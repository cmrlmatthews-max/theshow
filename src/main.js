// The Show: map, roster, stadium cards, and the door into the 3D ballpark.
import { geoAlbers, geoPath, geoGraticule10 } from 'd3-geo';
import { select, pointer } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import 'd3-transition';
import { STATES, NEIGHBORS } from './geo.js';
import { STADIUMS } from './data.js';
import { fieldDiagramSVG } from './field.js';
import { ParkView } from './park.js';
import { DETAILS } from './details/index.js';
import { HISTORY } from './history-data.js';
import { createHistory, curve, GROUPS, GROUP_BY_KEY, LEAGUE_ORDER, LEAGUE_NAMES } from './history.js';

const W = 1200, H = 760;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('en-US'));
const byId = new Map(STADIUMS.map((s) => [s.id, s]));
const ink = (hex) => { const n = parseInt(hex.slice(1), 16), l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; return l > 0.6 ? '#2b2118' : '#fbf5e3'; };

// ---------- map
const projection = geoAlbers().parallels([29.5, 45.5]).rotate([96, 0])
  .fitExtent([[50, 46], [W - 50, H - 46]], { type: 'FeatureCollection', features: STATES });
const path = geoPath(projection);
const svg = select('#map').attr('viewBox', `0 0 ${W} ${H}`);
const world = svg.append('g').attr('class', 'world');
world.append('rect').attr('class', 'sea').attr('x', -3000).attr('y', -3000).attr('width', 7200).attr('height', 6800);
world.append('path').attr('class', 'graticule').attr('d', path(geoGraticule10()));
const land = { type: 'FeatureCollection', features: [...NEIGHBORS, ...STATES] };
for (const w of [16, 10, 5]) world.append('path').attr('class', 'shore').attr('d', path(land)).attr('stroke-width', w);
world.append('g').selectAll('path').data(NEIGHBORS).join('path').attr('class', 'neighbor').attr('d', path);
const washes = ['#f1e6c8', '#ecdcc0', '#e9e2c2', '#f0dfc6', '#e6dfc6'];
world.append('g').selectAll('path').data(STATES).join('path').attr('class', 'state').attr('d', path)
  .attr('fill', (d) => washes[(Number(d.id) * 7) % washes.length]);
world.append('g').attr('class', 'state-labels').selectAll('text').data(STATES.filter((d) => path.area(d) > 1500)).join('text')
  .attr('transform', (d) => `translate(${path.centroid(d)})`).text((d) => d.properties.name.toUpperCase());
world.append('g').attr('class', 'country-labels').selectAll('text')
  .data([['C A N A D A', [-100, 52.2]], ['M E X I C O', [-103.5, 26.2]]]).join('text')
  .attr('transform', (d) => `translate(${projection(d[1])})`).text((d) => d[0]);

const HX = createHistory(HISTORY, STADIUMS);
const NOW = 2026, Y0 = 1871;
let year = NOW;
let selKey = null;   // key of the selected marker: a Phase 1 id, or 'H' + stint index
const defs = svg.append('defs');
for (const [id, fill, size] of [['arrow-sel', '#a63a2a', 5], ['arrow-faint', '#7a5c3c', 5]]) {
  defs.append('marker').attr('id', id).attr('viewBox', '0 0 10 10').attr('refX', 8).attr('refY', 5).attr('markerWidth', size).attr('markerHeight', size).attr('orient', 'auto')
    .append('path').attr('d', 'M0 0L10 5L0 10z').attr('fill', fill);
}
// History overlays live in screen space and are redrawn from the zoom transform in layout(), so widths stay constant.
const histLayer = svg.append('g').attr('class', 'hist-layer');
const gAll = histLayer.append('g').attr('class', 'all-reloc');
const gParks = histLayer.append('g').attr('class', 'all-parks');
const gSel = histLayer.append('g').attr('class', 'sel-path');
const leaders = svg.append('g').attr('class', 'leaders');
const marks = svg.append('g').attr('class', 'marks');
const PAPER_EDGE = '#d9cfb4';
const nowNodes = STADIUMS.map((s) => {
  const [x, y] = projection([s.lon, s.lat]);
  return { key: s.id, text: s.id, label: s.stadium, fill: s.colors[0], stroke: s.colors[1].toUpperCase() === '#FFFFFF' ? PAPER_EDGE : s.colors[1], ring: null, approx: false,
    aria: `${s.team}, ${s.stadium}`, s, x0: x, y0: y, x, y, ax: x, ay: y, pick: () => selectTeam(s.id, true) };
});
let nodes = nowNodes, mk, lead, dots;
function renderMarks() {
  mk = marks.selectAll('g.mk').data(nodes, (d) => d.key).join((en) => {
    const g = en.append('g').attr('class', 'mk').attr('tabindex', 0).attr('role', 'button');
    g.append('circle').attr('class', 'mk-hit').attr('r', 11);
    g.append('circle').attr('class', 'mk-disc').attr('r', 11);
    g.append('circle').attr('class', 'mk-approx').attr('r', 16.6);
    g.append('circle').attr('r', 13.6).attr('class', 'mk-ring');
    g.append('text').attr('class', 'mk-id').attr('dy', '0.36em');
    g.append('text').attr('class', 'mk-name').attr('y', 26);
    return g;
  });
  mk.attr('aria-label', (d) => d.aria).classed('approx', (d) => d.approx)
    .on('click', (_, d) => d.pick())
    .on('keydown', (e, d) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); d.pick(); } })
    .on('mouseenter', (_, d) => hover(d.key, true)).on('mouseleave', (_, d) => hover(d.key, false));
  mk.select('.mk-disc').attr('fill', (d) => d.fill).attr('stroke', (d) => d.stroke).attr('stroke-width', (d) => (d.ring ? 3.2 : 2.4));
  mk.select('.mk-id').attr('fill', (d) => ink(d.fill)).text((d) => d.text);
  mk.select('.mk-name').text((d) => d.label);
  lead = leaders.selectAll('line').data(nodes, (d) => d.key).join('line');
  dots = leaders.selectAll('circle').data(nodes, (d) => d.key).join('circle').attr('r', 1.8);
  applySel();
}

let tf = zoomIdentity;
// Screen scale. The map is W x H units; a phone shows it at about 0.3 px per unit, a desktop at about 0.8.
// u keeps markers, dots, and labels at a readable size in screen pixels; g(k) grows them a little as the map zooms in.
let px = 1, u = 1, m = 1;
function measure() {
  const r = svg.node().getBoundingClientRect();
  px = r.width && r.height ? Math.min(r.width / W, r.height / H) : 1;
  const pxR = 11 * px + Math.max(0, 0.8 - px) * 15.3;   // marker radius in screen px: 11 on a phone, unchanged on a desktop
  u = Math.max(1, pxR / (11 * px));
  m = u * (1 + 0.35 * Math.min(1, Math.log2(Math.max(1, tf.k)) / 3));
}
function layout() {
  measure();
  const R = 13.5 * m;
  for (const n of nodes) { [n.ax, n.ay] = tf.apply([n.x0, n.y0]); n.x = n.ax; n.y = n.ay; }
  for (let it = 0; it < 60; it++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]; let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d < 2 * R) {
        if (d < 0.01) { dx = 1; dy = 0.3; d = 1; }
        const push = (2 * R - d) / 2 + 0.2; dx /= d; dy /= d;
        a.x -= dx * push; a.y -= dy * push; b.x += dx * push; b.y += dy * push; moved = true;
      }
    }
    for (const n of nodes) { n.x += (n.ax - n.x) * 0.04; n.y += (n.ay - n.y) * 0.04; }
    if (!moved) break;
  }
  mk.attr('transform', (d) => `translate(${d.x.toFixed(1)},${d.y.toFixed(1)}) scale(${m.toFixed(3)})`);
  mk.select('.mk-hit').attr('r', Math.max(11, Math.min(13.5, 22 / (px * m))));
  lead.attr('x1', (d) => d.ax).attr('y1', (d) => d.ay).attr('x2', (d) => d.x).attr('y2', (d) => d.y)
    .attr('stroke-width', 0.8 * u).attr('opacity', (d) => (Math.hypot(d.x - d.ax, d.y - d.ay) > 6 * m ? 1 : 0));
  dots.attr('r', 1.8 * u).attr('cx', (d) => d.ax).attr('cy', (d) => d.ay).attr('opacity', (d) => (Math.hypot(d.x - d.ax, d.y - d.ay) > 6 * m ? 1 : 0));
  for (const n of nodes) {
    let best = null, bd = 90 * m;
    for (const o of nodes) { if (o === n) continue; const d = Math.hypot(o.x - n.x, o.y - n.y); if (d < bd) { bd = d; best = o; } }
    n.up = !!best && n.y < best.y;
  }
  mk.select('.mk-name').attr('y', (d) => (d.up ? -19 : 26));
  marks.classed('show-names', tf.k >= 3.2);
  world.select('.state-labels').style('font-size', (6.6 * Math.min(u, 2.2) / Math.pow(tf.k, 0.8)).toFixed(2) + 'px');
  world.select('.country-labels').style('font-size', (13 * Math.min(u, 2.2) / Math.pow(tf.k, 0.8)).toFixed(2) + 'px');
  world.select('.state-labels').attr('opacity', tf.k > 6 ? 0.25 : 1);
  scaleBar();
  drawOverlays();
}
const zoomer = zoom().scaleExtent([1, 40]).translateExtent([[-260, -220], [W + 260, H + 220]])
  .on('zoom', (e) => { tf = e.transform; world.attr('transform', tf); layout(); });
svg.call(zoomer).on('dblclick.zoom', null);
svg.on('click.near', (e) => {
  if (e.target.closest && e.target.closest('.mk, .pk-dot')) return;
  const [x, y] = pointer(e, svg.node());
  let best = null, bd = 24 / px;
  for (const n of nodes) { const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } }
  if (best) best.pick();
});
let rzT = 0;
window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(layout, 120); });
$('#zin').onclick = () => svg.transition().duration(350).call(zoomer.scaleBy, 1.8);
$('#zout').onclick = () => svg.transition().duration(350).call(zoomer.scaleBy, 1 / 1.8);
$('#zreset').onclick = () => svg.transition().duration(600).call(zoomer.transform, zoomIdentity);

// scale of miles
const p1 = projection([-96, 39]), p2 = projection([-96 + 1, 39]);
const pxPerMile = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 53.8;   // one degree of longitude at 39°N is about 53.8 miles
function scaleBar() {
  const miles = [500, 250, 100, 50, 25, 10, 5].find((m) => m * pxPerMile * tf.k <= 170) || 5;
  const px = miles * pxPerMile * tf.k;
  $('#scale').innerHTML = `<svg width="${px + 8}" height="26"><path d="M4 6v8h${px}v-8M${4 + px / 2} 10v4" fill="none" stroke="#4a3a28" stroke-width="1.4"/><text x="${4 + px / 2}" y="25" text-anchor="middle">${miles} miles</text></svg>`;
}

// ---------- roster
const rosterEl = $('#roster-list');
const rosterFoot = $('#roster footer');
const footNow = rosterFoot.innerHTML;
const dotStyle = (c1, c2) => `background:${c1};border-color:${c2}`;
function renderRoster() {
  if (year === NOW) {
    rosterEl.innerHTML = ['AL', 'NL'].map((lg) => `<section><h2>${lg === 'AL' ? 'American League' : 'National League'}</h2>` +
      ['East', 'Central', 'West'].map((dv) => `<h3>${dv}</h3><ul>` + STADIUMS.filter((s) => s.league === lg && s.division === dv)
        .map((s) => `<li><button data-id="${s.id}"><i style="${dotStyle(s.colors[0], s.colors[1].toUpperCase() === '#FFFFFF' ? '#d9cfb4' : s.colors[1])}"></i><b>${esc(s.team)}</b><span>${esc(s.stadium)}</span></button></li>`).join('') + '</ul>').join('') + '</section>').join('');
    rosterFoot.innerHTML = footNow;
  } else {
    const act = HX.activeIn(year).filter((st) => leagueOn[st.group]);
    rosterEl.innerHTML = LEAGUE_ORDER.map((lg) => {
      const list = act.filter((st) => st.league === lg).sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
      if (!list.length) return '';
      return `<section><h2>${esc(LEAGUE_NAMES[lg])}</h2><ul>` + list.map((st) => {
        const hf = HX.homeFor(st, year);
        return `<li><button data-i="${st.idx}"><i style="${dotStyle(st.colors[0], st.colors[1])}"></i><b>${esc(st.name)}</b><span>${esc(hf ? hf.park.name : 'Ballpark not recorded')}</span></button></li>`;
      }).join('') + '</ul></section>';
    }).join('') || '<p class="empty">No clubs are listed for this year.</p>';
    rosterFoot.innerHTML = `${act.length} club${act.length === 1 ? '' : 's'} in ${year}.<br>Select a club or a marker on the map.`;
  }
  applySel();
}
const keyOf = (b) => (b.dataset.id != null ? b.dataset.id : 'H' + b.dataset.i);
rosterEl.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.id != null) selectTeam(b.dataset.id, true); else if (b.dataset.i != null) selectStint(+b.dataset.i, { fly: true });
});
rosterEl.addEventListener('mouseover', (e) => { const b = e.target.closest('button'); if (b) hover(keyOf(b), true); });
rosterEl.addEventListener('mouseout', (e) => { const b = e.target.closest('button'); if (b) hover(keyOf(b), false); });
function hover(key, on) { mk.filter((d) => d.key === key).classed('hot', on).raise(); }
function applySel() {
  mk.classed('sel', (d) => d.key === selKey); mk.filter((d) => d.key === selKey).raise();
  rosterEl.querySelectorAll('button').forEach((b) => b.classList.toggle('sel', selKey != null && keyOf(b) === selKey));
}

// ---------- history overlays: relocation lines, former ballparks, the selected franchise path
const leagueOn = Object.fromEntries(GROUPS.map((g) => [g.key, true]));
let showReloc = false, showParks = false, selFranchise = null;
const pj = new Map();
const scr = (p) => { let q = pj.get(p.id); if (!q) { q = projection([p.lon, p.lat]); pj.set(p.id, q); } return tf.apply(q); };
let allLines = null, parkDots = null, selLines = null, selDots = null, selLabels = null;
function parkClick(_, d) { showParkCard(d.id); }
function ensureAll() {
  if (showReloc && !allLines) allLines = gAll.selectAll('path').data(HX.relocations()).join('path').attr('class', 'rl-faint').attr('marker-end', 'url(#arrow-faint)');
  if (showParks && !parkDots) parkDots = gParks.selectAll('circle').data(HX.allParks).join('circle').attr('class', 'pk-dot').attr('r', 3)
    .on('click', parkClick);
  if (showParks && parkDots && !parkDots.select('title').size()) parkDots.append('title').text((d) => d.name);
}
function setSelPath(f) {
  selFranchise = f; gSel.selectAll('*').remove(); selLines = selDots = selLabels = null;
  if (f) {
    const mv = HX.franchiseRelocations(f);
    selLines = gSel.append('g').selectAll('path').data(mv).join('path').attr('class', 'rl-sel').attr('marker-end', 'url(#arrow-sel)');
    selDots = gSel.append('g').selectAll('circle').data(HX.franchiseParks(f)).join('circle').attr('class', 'pk-dot sel-dot').attr('r', 3.6).on('click', parkClick);
    selDots.append('title').text((d) => d.name);
    selLabels = gSel.append('g').selectAll('text').data(mv).join('text').attr('class', 'rl-year').text((d) => d.year);
  }
  drawOverlays();
}
function drawOverlays() {
  gAll.attr('display', showReloc ? null : 'none'); gParks.attr('display', showParks ? null : 'none');
  ensureAll();
  if (showReloc && allLines) allLines.style('stroke-width', u).attr('d', (d) => curve(scr(d.from), scr(d.to), 3 * u, 6 * u).d);
  const pr = (u > 1.3 ? 3.8 : 3) * u * (m / u), hit = Math.max(9, 22 / px);
  if (showParks && parkDots) parkDots.attr('r', pr).style('stroke-width', hit).attr('cx', (d) => scr(d)[0]).attr('cy', (d) => scr(d)[1]);
  if (selLines) {
    const geo = selLines.data().map((d) => curve(scr(d.from), scr(d.to), 5 * u, 9 * u));
    selLines.style('stroke-width', 2.4 * u).attr('d', (d, i) => geo[i].d);
    selLabels.style('font-size', 11 * u + 'px').style('stroke-width', 3.5 * u + 'px').attr('x', (d, i) => geo[i].mid[0]).attr('y', (d, i) => geo[i].mid[1] - 4 * u);
  }
  if (selDots) selDots.attr('r', pr * 1.2).style('stroke-width', hit).attr('cx', (d) => scr(d)[0]).attr('cy', (d) => scr(d)[1]);
}

// ---------- the year and the league switches
const yrEl = $('#yr');
function buildHistNodes() {
  const out = [];
  for (const st of HX.activeIn(year)) {
    if (!leagueOn[st.group]) continue;
    const hf = HX.homeFor(st, year); if (!hf) continue;
    const p = hf.park, [x, y] = projection([p.lon, p.lat]);
    out.push({ key: 'H' + st.idx, text: st.abbr, label: p.name, fill: st.colors[0], stroke: st.colors[1], ring: st.ring, approx: !!p.coord_approx,
      aria: `${st.name}, ${p.name}, ${year}`, st, x0: x, y0: y, x, y, ax: x, ay: y, pick: () => selectStint(st.idx, { fly: true }) });
  }
  return out;
}
function renderLegend() {
  const present = new Set(HX.activeIn(year).map((st) => st.group));
  const sw = (g) => `<button class="chip${leagueOn[g.key] ? '' : ' off'}" data-lg="${g.key}" aria-pressed="${leagueOn[g.key]}"><i style="background:${g.color};${g.ring ? `border-color:${g.ring}` : ''}"></i>${esc(g.name)}</button>`;
  $('#lg-leagues').innerHTML = `<span class="lg-h">Leagues</span>` + GROUPS.filter((g) => present.has(g.key)).map(sw).join('');
  $('#lg-leagues').hidden = year === NOW;
  const map = (k, on, t) => `<button class="chip map${on ? '' : ' off'}" data-map="${k}" aria-pressed="${on}"><i class="${k}"></i>${t}</button>`;
  $('#lg-map').innerHTML = `<span class="lg-h">Map</span>` + map('reloc', showReloc, 'All relocations') + map('parks', showParks, 'All former ballparks');
}
$('#legend').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.lg) { leagueOn[b.dataset.lg] = !leagueOn[b.dataset.lg]; refresh(); }
  else if (b.dataset.map === 'reloc') { showReloc = !showReloc; renderLegend(); drawOverlays(); }
  else if (b.dataset.map === 'parks') { showParks = !showParks; renderLegend(); drawOverlays(); }
});
const mastR = $('#mast-r'), mastNow = mastR.textContent;
function refresh() {
  nodes = year === NOW ? nowNodes : buildHistNodes();
  renderLegend(); renderMarks(); renderRoster(); layout();
  const n = year === NOW ? nowNodes.length : HX.activeIn(year).length;
  $('#yr-count').textContent = `${n} club${n === 1 ? '' : 's'}`;
  mastR.textContent = year === NOW ? mastNow : `${n} club${n === 1 ? '' : 's'} of the ${year} season, United States and Canada`;
}
function setYear(y, o = {}) {
  y = Math.max(Y0, Math.min(NOW, Math.round(Number(y)))); if (!Number.isFinite(y)) return;
  year = y; yrEl.value = y; $('#yr-read').textContent = y;
  yrEl.style.setProperty('--p', ((y - Y0) / (NOW - Y0) * 100).toFixed(2) + '%');
  refresh();
  if (!o.keep) followSelection();
}
// Keep the card on the same franchise when the year changes.
function followSelection() {
  if (!sel || sel.type === 'park') return;
  const f = sel.type === 'team' ? sel.id : HX.stints[sel.idx].franchise;
  if (year === NOW) { if (byId.has(f)) showTeam(f, false); else closeCard(); return; }
  const st = HX.chain(f).find((x) => x.start <= year && year <= x.end);
  if (st) showStint(st.idx, false); else closeCard();
}
yrEl.addEventListener('input', () => { stopPlay(); setYear(yrEl.value); });
$('#y-back').onclick = () => { stopPlay(); setYear(year - 1); };
$('#y-fwd').onclick = () => { stopPlay(); setYear(year + 1); };
$('#y-today').onclick = () => { stopPlay(); setYear(NOW); };
let timer = null;
function stopPlay() { if (timer) clearInterval(timer); timer = null; $('#y-play').textContent = 'Play'; $('#y-play').setAttribute('aria-pressed', 'false'); }
$('#y-play').onclick = () => {
  if (timer) { stopPlay(); return; }
  if (year >= NOW) setYear(Y0);
  $('#y-play').textContent = 'Pause'; $('#y-play').setAttribute('aria-pressed', 'true');
  timer = setInterval(() => { if (year >= NOW) { stopPlay(); return; } setYear(year + 1); if (year >= NOW) stopPlay(); }, 333);
};
{ // decade marks under the slider
  const t = $('#yr-ticks'); let h = '';
  for (const y of [1871, 1900, 1920, 1940, 1960, 1980, 2000, 2026]) h += `<span style="--q:${((y - Y0) / (NOW - Y0)).toFixed(4)}">${y}</span>`;
  t.innerHTML = h;
}

// ---------- cards
let current = null, sel = null;
const cardEl = $('#card');
function showCard() { cardEl.hidden = false; document.body.classList.add('card-open'); cardEl.scrollTop = 0; }
function selectTeam(id, fly) {
  if (!byId.get(id)) return;
  if (year !== NOW) setYear(NOW, { keep: true });
  showTeam(id, fly);
}
function showTeam(id, fly) {
  const s = byId.get(id); if (!s) return;
  current = s; sel = { type: 'team', id }; selKey = id;
  applySel(); renderCard(s); showCard(); setSelPath(id);
  if (fly) {
    const n = nodes.find((d) => d.key === id), k = Math.max(tf.k, 5);
    svg.transition().duration(900).call(zoomer.transform, zoomIdentity.translate(W / 2 - n.x0 * k - 120, H / 2 - n.y0 * k).scale(k));
  }
}
function selectStint(idx, o = {}) {
  const st = HX.stints[idx]; if (!st) return;
  let y = o.year != null ? Math.round(o.year) : (year >= st.start && year <= st.end ? year : st.start);
  y = Math.max(st.start, Math.min(st.end, y));
  if (y === NOW && !(byId.has(st.franchise) && st.end >= NOW)) y = Math.max(st.start, NOW - 1);
  if (y === NOW) { selectTeam(st.franchise, !!o.fly); return; }
  if (y !== year) setYear(y, { keep: true });
  showStint(idx, !!o.fly);
}
function showStint(idx, fly) {
  const st = HX.stints[idx]; current = null; sel = { type: 'stint', idx }; selKey = 'H' + idx;
  applySel(); renderStintCard(st); showCard(); setSelPath(st.franchise);
  if (fly) flyToFranchise(st.franchise);
}
function showParkCard(id) {
  const p = HX.park(id); if (!p) return;
  current = null; sel = { type: 'park', id }; selKey = null;
  applySel(); renderParkCard(p); showCard(); setSelPath(null);
}
function flyToFranchise(f) {
  const ps = HX.franchiseParks(f).map((p) => projection([p.lon, p.lat])); if (!ps.length) return;
  const xs = ps.map((q) => q[0]), ys = ps.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const bw = Math.max(x1 - x0, 1), bh = Math.max(y1 - y0, 1);
  // Fit into the part of the frame the card leaves free, and below the legend.
  const fr = $('#frame').getBoundingClientRect(), cw = cardEl.hidden ? 0 : cardEl.offsetWidth + 40;
  const availW = Math.max(250, W * (fr.width - cw) / fr.width), top = 110, availH = H - top - 30;
  const k = Math.max(1, Math.min(5, 0.8 * Math.min(availW / bw, availH / bh)));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  svg.transition().duration(900).call(zoomer.transform, zoomIdentity.translate(availW / 2 - cx * k, top + availH / 2 - cy * k).scale(k));
}
function closeCard() { cardEl.hidden = true; document.body.classList.remove('card-open'); selKey = null; sel = null; current = null; applySel(); setSelPath(null); }

function renderCard(s) {
  const c1 = s.colors[0], c2 = s.colors[1].toUpperCase() === '#FFFFFF' ? '#e9dfc4' : s.colors[1];
  const d = s.dimensions_ft, w = s.wall_ft;
  const ws = s.world_series_titles;
  const row = (k, v) => (v === '' || v == null ? '' : `<tr><th>${k}</th><td>${v}</td></tr>`);
  const roofWord = { open: 'Open air', retractable: 'Retractable roof', fixed: 'Fixed dome' }[s.roof];
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
  cardEl.innerHTML = `
  <article class="bcard" style="--c1:${c1};--c2:${c2};--on:${ink(c1)}">
    <button class="x" id="card-x" aria-label="Close card">×</button>
    <header>
      <div class="mono" aria-hidden="true">${esc(s.id)}</div>
      <div><p class="lg">${s.league === 'AL' ? 'American' : 'National'} League · ${s.division}</p>
      <h2>${esc(s.team)}</h2></div>
    </header>
    <div class="plate"><h3>${esc(s.stadium)}</h3><p>${esc(s.city)}, ${esc(s.state)}${s.country === 'Canada' ? ', Canada' : ''}</p></div>
    <button class="enter" id="enter">Enter the Ballpark <span aria-hidden="true">▸</span></button>
    ${s.note ? `<p class="note"><b>Note.</b> ${esc(s.note)}</p>` : ''}
    <section><h4>The Ballpark</h4><table>
      ${row('Opened', s.opened)}${row('Capacity', fmt(s.capacity))}${row('Roof', roofWord)}${row('Surface', esc(s.surface))}
      ${row('Architect', esc(s.architect))}${row('Cost', esc(s.cost))}
      ${row('Earlier names', s.former_names.length ? s.former_names.map(esc).join('<br>') : '')}
      ${row('Previous home', esc(s.previous_stadium))}
    </table></section>
    <section><h4>The Field <small>distances in feet</small></h4>
      ${fieldDiagramSVG(s, undefined, DETAILS[s.id] && DETAILS[s.id].config ? DETAILS[s.id].config(s).wall : null)}
      <table class="dims"><tr><th>Left</th><th>Left-center</th><th>Center</th><th>Right-center</th><th>Right</th></tr>
      <tr><td>${fmt(d.lf)}</td><td>${fmt(d.lcf)}</td><td>${fmt(d.cf)}</td><td>${fmt(d.rcf)}</td><td>${fmt(d.rf)}</td></tr>
      <tr class="sub"><td>${w.lf == null ? '—' : w.lf + ' ft wall'}</td><td></td><td>${w.cf == null ? '—' : w.cf + ' ft wall'}</td><td></td><td>${w.rf == null ? '—' : w.rf + ' ft wall'}</td></tr></table>
    </section>
    <section><h4>The Club</h4><table>
      ${row('First season', s.team_founded)}
      ${row('World Series titles', ws.length ? `<b>${ws.length}</b> <span class="yrs">${ws.join(' · ')}</span>` : 'None')}
      ${row('League pennants', fmt(s.pennants))}
    </table>
    <ol class="hist">${s.franchise_history.map((h) => `<li><span>${esc(h.years)}</span>${esc(h.name)}</li>`).join('')}</ol></section>
    <section><h4>Notes from the Grandstand</h4><ul class="notable">${s.notable.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>
    <details><summary>Sources</summary><ul class="src">${s.sources.map((u) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(host(u))}</a></li>`).join('')}</ul></details>
  </article>`;
  $('#card-x').onclick = closeCard;
  $('#enter').onclick = () => openPark(s);
}


// ---------- history cards
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const hasField = (p) => !!p && !!p.dimensions_ft && num(p.dimensions_ft.lf) && num(p.dimensions_ft.cf) && num(p.dimensions_ft.rf);
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
const hrow = (k, v) => (v === '' || v == null ? '' : `<tr><th>${k}</th><td>${v}</td></tr>`);
const span = (a, b) => (a === b ? `${a}` : `${a}–${b}`);
const place = (o) => `${esc(o.city)}${o.state ? ', ' + esc(o.state) : ''}${o.country === 'Canada' ? ', Canada' : ''}`;
function fieldSection(p) {
  const d = p.dimensions_ft, w = p.wall_ft || {};
  const wl = (v) => (num(v) ? v + ' ft wall' : '—');
  return `<section><h4>The Field <small>distances in feet</small></h4>
    ${fieldDiagramSVG({ id: 'H-' + p.id, dimensions_ft: d, wall_ft: w })}
    <table class="dims"><tr><th>Left</th><th>Left-center</th><th>Center</th><th>Right-center</th><th>Right</th></tr>
    <tr><td>${fmt(d.lf)}</td><td>${fmt(d.lcf)}</td><td>${fmt(d.cf)}</td><td>${fmt(d.rcf)}</td><td>${fmt(d.rf)}</td></tr>
    <tr class="sub"><td>${wl(w.lf)}</td><td></td><td>${wl(w.cf)}</td><td></td><td>${wl(w.rf)}</td></tr></table></section>`;
}
function parkTable(p) {
  const roofWord = { open: '', retractable: 'Retractable roof', fixed: 'Fixed dome' }[p.roof] || '';
  return `<table>${hrow('Also known as', (p.aka || []).map(esc).join('<br>'))}${hrow('Opened', p.opened)}${hrow('Closed', p.closed)}
    ${hrow('Status', esc(p.status))}${hrow('Capacity', num(p.capacity) ? fmt(p.capacity) : '')}${hrow('Surface', esc(p.surface))}${hrow('Roof', roofWord)}${hrow('Architect', esc(p.architect))}</table>
    ${p.coord_approx ? '<p class="approx">Location is approximate.</p>' : ''}`;
}
const notableSec = (p) => ((p.notable || []).length ? `<section><h4>Notes from the Grandstand</h4><ul class="notable">${p.notable.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>` : '');
const sourcesSec = (list) => `<details><summary>Sources</summary><ul class="src">${(list || []).map((u) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(hostOf(u))}</a></li>`).join('') || '<li>None listed.</li>'}</ul></details>`;

function renderStintCard(st) {
  const hf = HX.homeFor(st, year), p = hf && hf.park;
  const [c1, c2] = st.colors;
  const chain = HX.chain(st.franchise);
  const multi = st.homes.length > 1;
  cardEl.innerHTML = `
  <article class="bcard" style="--c1:${c1};--c2:${c2};--on:${ink(c1)}">
    <button class="x" id="card-x" aria-label="Close card">×</button>
    <header>
      <div class="mono" aria-hidden="true">${esc(st.abbr)}</div>
      <div><p class="lg">${esc(st.leagueName)} · ${span(st.start, st.end)}</p>
      <h2>${esc(st.name)}</h2></div>
    </header>
    <div class="plate"><h3>${esc(p ? p.name : 'Ballpark not recorded')}</h3><p>${p ? place(p) : place(st)}</p></div>
    ${hasField(p) ? '<button class="enter" id="enter">Enter the Ballpark <span aria-hidden="true">▸</span></button>' : ''}
    ${st.note ? `<p class="note"><b>Note.</b> ${esc(st.note)}</p>` : ''}
    <section><h4>The Club</h4><table>
      ${hrow('City', place(st))}${hrow('League', esc(st.leagueName))}${hrow('Seasons', span(st.start, st.end))}
      ${hrow('Fate', esc(st.fate))}
      ${multi ? hrow('Home in ' + year, esc(p ? p.name : '')) : ''}
    </table></section>
    ${p ? `<section><h4>The Ballpark in ${year}</h4>${parkTable(p)}</section>${hasField(p) ? fieldSection(p) : ''}${notableSec(p)}` : ''}
    <section><h4>The Franchise</h4><ol class="hist tl">${chain.map((x) => `<li><button data-i="${x.idx}" data-y="${x.start}" class="${x.idx === st.idx ? 'on' : ''}"><span>${span(x.start, x.end)}</span>${esc(x.name)} <em>${esc(x.city)}</em></button></li>`).join('')}</ol></section>
    ${sourcesSec(st.sources)}
  </article>`;
  $('#card-x').onclick = closeCard;
  const en = $('#enter');
  if (en) en.onclick = () => openPark({ id: 'H-' + p.id, stadium: p.name, team: st.name, city: p.city, colors: [c1, c2], capacity: p.capacity ?? 20000,
    opened: p.opened, roof: p.roof, surface: p.surface, dimensions_ft: p.dimensions_ft, wall_ft: p.wall_ft });
}
function renderParkCard(p) {
  const users = HX.parkUsers(p.id);
  cardEl.innerHTML = `
  <article class="bcard" style="--c1:#7a5c3c;--c2:#c9a227;--on:#fbf5e3">
    <button class="x" id="card-x" aria-label="Close card">×</button>
    <header>
      <div class="mono" aria-hidden="true">PK</div>
      <div><p class="lg">${p.current ? 'Current ballpark' : 'Former ballpark'}</p><h2>${esc(p.name)}</h2></div>
    </header>
    <div class="plate"><h3>${esc(p.name)}</h3><p>${place(p)}</p></div>
    <section><h4>The Ballpark</h4>${parkTable(p)}</section>
    ${hasField(p) ? fieldSection(p) : ''}${notableSec(p)}
    <section><h4>Clubs That Played Here</h4>${users.length ? `<ol class="hist tl">${users.map((u) => `<li><button data-i="${u.stint.idx}" data-y="${u.start}"><span>${span(u.start, u.end)}</span>${esc(u.stint.name)} <em>${esc(u.stint.league)}</em></button></li>`).join('')}</ol>` : '<p class="approx">No club is listed for this ballpark.</p>'}</section>
    ${sourcesSec(p.sources)}
  </article>`;
  $('#card-x').onclick = closeCard;
}
cardEl.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-i]'); if (!b) return;
  selectStint(+b.dataset.i, { year: +b.dataset.y, fly: true });
});

// ---------- 3D ballpark
let park = null;
const parkEl = $('#park');
function openPark(s) {
  parkEl.hidden = false; document.body.classList.add('park-open');
  try {
    if (!park) park = new ParkView($('#park-canvas'));
    park.load(s);
  } catch (err) {
    console.error(err); $('#park-title').textContent = 'The 3D view did not start on this device.'; return;
  }
  $('#park-title').textContent = s.stadium; $('#park-sub').textContent = `${s.team} · ${s.city}`;
  $('#park-tag').textContent = DETAILS[s.id] ? 'Detailed model. The wall, the decks, and the main features follow the real park. Proportions are approximate.' : 'Generated model. The field shape and the wall use the real dimensions. The seating is generic.';
  $('#views').innerHTML = Object.entries(park.views).map(([k, v]) => `<button data-v="${k}">${v.label}</button>`).join('') + (park.roof ? '<button id="roof">Close the roof</button>' : '');
  setViewUI('aerial'); park.start();
}
function setViewUI(name) {
  $('#views').querySelectorAll('button[data-v]').forEach((b) => b.classList.toggle('on', b.dataset.v === name));
  const v = park.views[name];
  $('#hint').textContent = v.orbit ? 'Drag to orbit. Scroll to zoom.' : v.walk ? 'Drag to look. Use W A S D or the arrow keys to walk on the field. Hold Shift to run.' : 'Drag to look around from this seat.';
}
$('#views').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || !park) return;
  if (b.id === 'roof') { const closed = park.toggleRoof(); b.textContent = closed ? 'Open the roof' : 'Close the roof'; return; }
  park.setView(b.dataset.v); setViewUI(b.dataset.v);
});
function closePark() { if (park) park.stop(); parkEl.hidden = true; document.body.classList.remove('park-open'); }
$('#park-x').onclick = closePark;
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!parkEl.hidden) closePark(); else if (!cardEl.hidden) closeCard(); } });

window.addEventListener('keydown', (e) => {
  if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const a = document.activeElement, tag = a && a.tagName;
  if (!parkEl.hidden || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (a && a.isContentEditable)) return;
  e.preventDefault(); stopPlay(); setYear(year + (e.key === 'ArrowRight' ? 1 : -1));
});

setYear(NOW, { keep: true });
window.__show = { selectTeam, openPark, byId, setYear, selectStint, get year() { return year; }, get history() { return HX; }, get park() { return park; } };
