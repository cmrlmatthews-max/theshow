// The Show: map, roster, search, stadium cards, phone sheet, and the door into the 3D ballpark.
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
import { createSheet, createDrawer, trapTab } from './sheet.js';
import { createSearch } from './search.js';

const W = 1200, H = 760;
let sheet = null;   // the phone bottom sheet, created below
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('en-US'));
const byId = new Map(STADIUMS.map((s) => [s.id, s]));

// Plate ink: of the two inks the code can use, take the one with the higher WCAG contrast ratio against the plate color.
const INK_DARK = '#2b2118', INK_LIGHT = '#fbf5e3';
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = (hex) => { const n = parseInt(String(hex).slice(1, 7), 16) || 0; return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const ink = (hex) => (ratio(hex, INK_DARK) >= ratio(hex, INK_LIGHT) ? INK_DARK : INK_LIGHT);

// ---------- environment: reduced motion, layout class, saved state, shared library (every use is guarded)
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const dur = (ms) => (RM.matches ? 0 : ms);
const MQ = { phone: matchMedia('(max-width:900px)'), shortH: matchMedia('(max-height:500px)'), coarse: matchMedia('(pointer:coarse)') };
const isPhone = () => MQ.phone.matches || (MQ.shortH.matches && MQ.coarse.matches);
const isLand = () => isPhone() && MQ.shortH.matches;
const isTouch = () => isPhone() || MQ.coarse.matches;
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem('theshow.' + k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('theshow.' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
};
const SU = () => (window.SharedUI && typeof window.SharedUI === 'object' ? window.SharedUI : null);
const guard = (fn) => { try { return fn(); } catch (e) { return undefined; } };
guard(() => SU() && SU().init({ module: 'theshow', title: 'The Show' }));

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
const stateLabelData = STATES.filter((d) => path.area(d) > 1500).map((d) => { const b = path.bounds(d); return { d, bw: b[1][0] - b[0][0], rho: 0.7 }; });
const stateG = world.append('g').attr('class', 'state-labels');
const stateTx = stateG.selectAll('text').data(stateLabelData).join('text')
  .attr('transform', (o) => `translate(${path.centroid(o.d)})`).text((o) => o.d.properties.name.toUpperCase());
const countryG = world.append('g').attr('class', 'country-labels');
countryG.selectAll('text')
  .data([['C A N A D A', [-100, 52.2]], ['M E X I C O', [-103.5, 26.2]]]).join('text')
  .attr('transform', (d) => `translate(${projection(d[1])})`).text((d) => d[0]);
{ // width of each state name per unit of font size, measured once, so that a name that does not fit its state can be hidden
  stateG.style('font-size', '10px');
  stateTx.each(function (o) { try { const w = this.getBBox().width; if (w > 0) o.rho = w / 10; } catch (e) { /* not rendered */ } });
}

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
    aria: `${s.team}, ${s.stadium}`, s, x0: x, y0: y, x, y, ax: x, ay: y, pick: (o) => selectTeam(s.id, true, o) };
});
let nodes = nowNodes, mk, lead, dots;
// Marker sizes are in screen px: the marker group is scaled by 1/px, so one group unit is one screen pixel at every zoom and screen size.
const RAD = 15;
const nodeR = (n) => (n.text.length > 3 ? 17.5 : RAD);
let hotKey = null;
function renderMarks() {
  mk = marks.selectAll('g.mk').data(nodes, (d) => d.key).join((en) => {
    const g = en.append('g').attr('class', 'mk').attr('tabindex', 0).attr('role', 'button');
    g.append('circle').attr('class', 'mk-hit');
    g.append('circle').attr('class', 'mk-disc');
    g.append('circle').attr('class', 'mk-approx');
    g.append('circle').attr('class', 'mk-ring2');
    g.append('circle').attr('class', 'mk-ring');
    g.append('text').attr('class', 'mk-id').attr('dy', '0.36em');
    g.append('text').attr('class', 'mk-name');
    return g;
  });
  mk.attr('aria-label', (d) => d.aria).classed('approx', (d) => d.approx)
    .on('click', function (e, d) { if (e.detail === 0) { e.stopPropagation(); d.pick({ opener: this, focus: true }); } })
    .on('keydown', function (e, d) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); d.pick({ opener: this, focus: true }); } })
    .on('mouseenter', (_, d) => hover(d.key, true)).on('mouseleave', (_, d) => hover(d.key, false));
  mk.select('.mk-disc').attr('r', nodeR).attr('fill', (d) => d.fill).attr('stroke', (d) => d.stroke).attr('stroke-width', (d) => (d.ring ? 3.2 : 2.4));
  mk.select('.mk-approx').attr('r', (d) => nodeR(d) + 5.6);
  mk.select('.mk-ring').attr('r', (d) => nodeR(d) + 2.6);
  mk.select('.mk-ring2').attr('r', (d) => nodeR(d) + 2.6);
  mk.select('.mk-id').attr('fill', (d) => ink(d.fill)).text((d) => d.text);
  mk.select('.mk-name').text((d) => d.label);
  lead = leaders.selectAll('line').data(nodes, (d) => d.key).join('line');
  dots = leaders.selectAll('circle').data(nodes, (d) => d.key).join('circle');
  applySel();
}

let tf = zoomIdentity;
let px = 1, s1 = 1;   // px: screen pixels per map unit; s1 = 1/px: map units per screen pixel
const nameCtx = document.createElement('canvas').getContext('2d');
const nameW = (() => { const c = new Map(); return (t) => { let w = c.get(t); if (w == null) { nameCtx.font = 'italic 12px Baskerville,"Hoefler Text",Georgia,serif'; w = nameCtx.measureText(t).width + 8; c.set(t, w); } return w; }; })();
let extKey = '';
function measure() {
  const r = svg.node().getBoundingClientRect();
  px = r.width && r.height ? Math.min(r.width / W, r.height / H) : 1;
  s1 = 1 / px;
  // On a tall phone the map has free space above and below it: let the map move through that space.
  const ex = r.width ? Math.max(0, (r.width / px - W) / 2) : 0, ey = r.height ? Math.max(0, (r.height / px - H) / 2) : 0, k = ex.toFixed(0) + ',' + ey.toFixed(0);
  const kmin = homeK(), pad = isPhone() ? 500 : 0, kk = k + ',' + kmin.toFixed(3) + pad;
  if (kk !== extKey) { extKey = kk; zoomer.scaleExtent([Math.min(1, kmin), 40]).translateExtent([[-260 - ex - pad, -220 - ey - pad], [W + 260 + ex + pad, H + 220 + ey + pad]]); }
}
function layout() {
  measure();
  for (const n of nodes) { [n.ax, n.ay] = tf.apply([n.x0, n.y0]); n.x = n.ax; n.y = n.ay; }
  for (let it = 0; it < 60; it++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]; let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      const R2 = (nodeR(a) + nodeR(b) + 3) * s1;
      if (d < R2) {
        if (d < 0.01) { dx = 1; dy = 0.3; d = 1; }
        const push = (R2 - d) / 2 + 0.2; dx /= d; dy /= d;
        a.x -= dx * push; a.y -= dy * push; b.x += dx * push; b.y += dy * push; moved = true;
      }
    }
    for (const n of nodes) { n.x += (n.ax - n.x) * 0.04; n.y += (n.ay - n.y) * 0.04; }
    if (!moved) break;
  }
  const touch = isTouch();
  mk.attr('transform', (d) => `translate(${d.x.toFixed(1)},${d.y.toFixed(1)}) scale(${s1.toFixed(4)})`);
  mk.select('.mk-hit').attr('r', (d) => (touch ? 22 : nodeR(d)));
  const moved6 = (d) => Math.hypot(d.x - d.ax, d.y - d.ay) > 6 * s1;
  lead.attr('x1', (d) => d.ax).attr('y1', (d) => d.ay).attr('x2', (d) => d.x).attr('y2', (d) => d.y)
    .attr('stroke-width', 0.8 * s1).attr('opacity', (d) => (moved6(d) ? 1 : 0));
  dots.attr('r', 1.8 * s1).attr('cx', (d) => d.ax).attr('cy', (d) => d.ay).attr('opacity', (d) => (moved6(d) ? 1 : 0));
  for (const n of nodes) {
    let best = null, bd = 90 * s1;
    for (const o of nodes) { if (o === n) continue; const d = Math.hypot(o.x - n.x, o.y - n.y); if (d < bd) { bd = d; best = o; } }
    n.up = !!best && n.y < best.y;
  }
  mk.select('.mk-name').attr('y', (d) => (d.up ? -(nodeR(d) + 6) : nodeR(d) + 14));
  marks.classed('show-names', tf.k >= 3.2);
  cullNames();
  // State and country names are decoration. They keep a readable size: below 10 px they are hidden, and they show when zoom makes them 10 px or more.
  const sNat = 11 * tf.k * px, sS = Math.min(15, sNat);
  stateG.style('font-size', (sS / (tf.k * px)).toFixed(3) + 'px').attr('opacity', tf.k > 6 ? 0.25 : 1);
  stateTx.attr('display', (o) => (sNat >= 10 && o.rho * sS <= 0.8 * o.bw * tf.k * px ? null : 'none'));
  const cNat = 13 * tf.k * px;
  countryG.style('font-size', (Math.min(18, cNat) / (tf.k * px)).toFixed(3) + 'px').attr('display', cNat >= 10 ? null : 'none');
  scaleBar();
  drawOverlays();
}
// Marker names render at 12 px at every zoom. Names that would collide with another name or marker are hidden, not shrunk.
function cullNames() {
  const all = tf.k >= 3.2, placed = [];
  const prio = (n) => (n.key === selKey ? 0 : n.key === hotKey ? 1 : 2);
  const list = nodes.filter((n) => all || prio(n) < 2).sort((a, b) => prio(a) - prio(b));
  const discs = nodes.map((n) => ({ n, x: n.x * px, y: n.y * px, r: nodeR(n) }));
  for (const n of nodes) n.nameOff = false;
  for (const n of list) {
    const x = n.x * px, y = n.y * px, w = nameW(n.label), r = nodeR(n), base = y + (n.up ? -(r + 6) : r + 14);
    const box = { x0: x - w / 2, x1: x + w / 2, y0: base - 11, y1: base + 4 };
    let hit = false;
    for (const p of placed) if (box.x0 < p.x1 && box.x1 > p.x0 && box.y0 < p.y1 && box.y1 > p.y0) { hit = true; break; }
    if (!hit) for (const d of discs) { if (d.n === n) continue; if (box.x0 < d.x + d.r && box.x1 > d.x - d.r && box.y0 < d.y + d.r && box.y1 > d.y - d.r) { hit = true; break; } }
    if (hit && prio(n) > 1) n.nameOff = true; else placed.push(box);
  }
  mk.select('.mk-name').classed('nm-off', (d) => d.nameOff);
}

const zoomer = zoom().scaleExtent([1, 40]).translateExtent([[-260, -220], [W + 260, H + 220]])
  .on('zoom', (e) => { tf = e.transform; world.attr('transform', tf); layout(); })
  .on('end.save', () => queueSync());
svg.call(zoomer).on('dblclick.zoom', null);
// Every move of the map goes through here: animated, or instant when the person asked for reduced motion.
function moveMap(fn, ms, arg, force0) {
  const d = force0 ? 0 : dur(ms);
  if (d) svg.transition().duration(d).call(fn, arg); else { svg.interrupt(); svg.call(fn, arg); }
}
// Free area of the map (screen px inside the svg box): below the top bar and above the sheet on a phone.
function panelW() { return document.documentElement.classList.contains('land') && document.documentElement.dataset.panel !== 'closed' ? sheetEl.offsetWidth : 0; }
function freeRect(detent) {
  const r = svg.node().getBoundingClientRect();
  if (!isPhone()) return { l: 0, t: 0, r: r.width, b: r.height, w: r.width, h: r.height, top: r.top, left: r.left };
  const tb = $('#topbar').getBoundingClientRect().bottom;
  if (isLand()) {   // side panel: the free area is left of the panel, right of the zoom buttons, below the top bar
    const sal = parseFloat(getComputedStyle(ctlEl).left) || 10;
    return { l: sal + 54 - r.left, t: tb - r.top, r: window.innerWidth - panelW() - r.left, b: window.innerHeight - 6 - r.top, w: r.width, h: r.height, top: r.top, left: r.left };
  }
  const hh = sheet.heights()[detent === 'peek' ? 'peekList' : (detent || sheet.detent)];
  return { l: 0, t: tb - r.top, r: r.width, b: window.innerHeight - hh - r.top, w: r.width, h: r.height, top: r.top, left: r.left };
}
// The whole-map view. On a phone the map is fitted (and centered) into the free area left by the top bar and the peeking sheet or the side panel.
function homeK() {
  if (!isPhone() || !sheet) return 1;
  const f = freeRect('peek');
  const ky = (f.b - f.t - 60) / (668 * px);
  return Math.max(0.3, Math.min(1, ky, isLand() ? (f.r - f.l) / (W * 0.97 * px) : 1));
}
function homeTf() {
  if (!isPhone()) return zoomIdentity;
  const f = freeRect('peek'), r = svg.node().getBoundingClientRect(), k = homeK();
  const offX = (r.width - W * px) / 2, offY = (r.height - H * px) / 2;
  return zoomIdentity.translate(((f.l + f.r) / 2 - offX) / px - W / 2 * k, ((f.t + f.b) / 2 - offY) / px - H / 2 * k).scale(k);
}
let homeApplied = null;
function goHome(ms, force0) { measure(); homeApplied = homeTf(); moveMap(zoomer.transform, ms, homeApplied, force0); }
// Pan (no zoom change) so that a marker is inside the free area.
function panToVisible(n, detent, force0) {
  measure();
  const r = svg.node().getBoundingClientRect(), f = freeRect(detent);
  const offX = (r.width - W * px) / 2, offY = (r.height - H * px) / 2;
  const sx = offX + n.x * px, sy = offY + n.y * px, rr = nodeR(n);
  const mT = 14 + rr, mB = 40 + rr, mX = 24 + rr;
  if (sx >= f.l + mX && sx <= f.r - mX && sy >= f.t + mT && sy <= f.b - mB) return;
  const cx = (f.l + f.r) / 2, cy = (f.t + f.b) / 2 - 8;
  moveMap(zoomer.transform, 350, zoomIdentity.translate(tf.x + (cx - sx) / px, tf.y + (cy - sy) / px).scale(tf.k), force0);
}
// A pointer tap goes to the nearest marker (or former-ballpark dot) within reach, so neighbors never swallow each other.
svg.on('click.near', (e) => {
  if (e.detail === 0) return;
  const [x, y] = pointer(e, svg.node());
  const reach = isTouch() ? 24 : 20;
  let best = null, bd = reach;
  for (const n of nodes) { const d = Math.hypot(n.x - x, n.y - y) * px; if (d < bd) { bd = d; best = { pick: (o) => n.pick(o) }; } }
  if (!best && showParks) {
    const list = [...(parkDots ? parkDots.data() : []), ...(selDots ? selDots.data() : [])];
    for (const p of list) { const q = scr(p), d = Math.hypot(q[0] - x, q[1] - y) * px; if (d < bd) { bd = d; best = { pick: () => showParkCard(p.id) }; } }
  } else if (!best && selDots) {
    for (const p of selDots.data()) { const q = scr(p), d = Math.hypot(q[0] - x, q[1] - y) * px; if (d < bd) { bd = d; best = { pick: () => showParkCard(p.id) }; } }
  }
  if (best) best.pick({ opener: null });
});
let rzT = 0;
window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { const wasHome = homeApplied && tf.k === homeApplied.k && Math.abs(tf.x - homeApplied.x) < 1 && Math.abs(tf.y - homeApplied.y) < 1; layout(); if (wasHome) goHome(0, true); fixFD(); }, 120); });
$('#sh-back').onclick = () => closeCard({ restore: true });
$('#zin').onclick = () => moveMap(zoomer.scaleBy, 350, 1.8);
$('#zout').onclick = () => moveMap(zoomer.scaleBy, 350, 1 / 1.8);
$('#zreset').onclick = () => goHome(600);

// scale of miles
const p1 = projection([-96, 39]), p2 = projection([-96 + 1, 39]);
const pxPerMile = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 53.8;   // one degree of longitude at 39°N is about 53.8 miles
function scaleBar() {
  const miles = [500, 250, 100, 50, 25, 10, 5].find((m) => m * pxPerMile * tf.k <= 170) || 5;
  const w = miles * pxPerMile * tf.k;
  $('#scale').innerHTML = `<svg width="${w + 8}" height="30"><path d="M4 6v8h${w}v-8M${4 + w / 2} 10v4" fill="none" stroke="#4a3a28" stroke-width="1.4"/><text x="${4 + w / 2}" y="27" text-anchor="middle">${miles} miles</text></svg>`;
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
        .map((s) => `<li><button type="button" data-id="${s.id}"><i style="${dotStyle(s.colors[0], s.colors[1].toUpperCase() === '#FFFFFF' ? '#d9cfb4' : s.colors[1])}"></i><b>${esc(s.team)}</b><span>${esc(s.stadium)}</span></button></li>`).join('') + '</ul>').join('') + '</section>').join('');
    rosterFoot.innerHTML = footNow;
  } else {
    const act = HX.activeIn(year).filter((st) => leagueOn[st.group]);
    rosterEl.innerHTML = LEAGUE_ORDER.map((lg) => {
      const list = act.filter((st) => st.league === lg).sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
      if (!list.length) return '';
      return `<section><h2>${esc(LEAGUE_NAMES[lg])}</h2><ul>` + list.map((st) => {
        const hf = HX.homeFor(st, year);
        return `<li><button type="button" data-i="${st.idx}"><i style="${dotStyle(st.colors[0], st.colors[1])}"></i><b>${esc(st.name)}</b><span>${esc(hf ? hf.park.name : 'Ballpark not recorded')}</span></button></li>`;
      }).join('') + '</ul></section>';
    }).join('') || '<p class="empty">No clubs are listed for this year.</p>';
    rosterFoot.innerHTML = `${act.length} club${act.length === 1 ? '' : 's'} in ${year}.<br>Select a club or a marker on the map.`;
  }
  applySel();
}
const keyOf = (b) => (b.dataset.id != null ? b.dataset.id : 'H' + b.dataset.i);
rosterEl.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const o = { opener: b, focus: e.detail === 0 };
  if (b.dataset.id != null) selectTeam(b.dataset.id, true, o); else if (b.dataset.i != null) selectStint(+b.dataset.i, { fly: true, ...o });
});
rosterEl.addEventListener('mouseover', (e) => { const b = e.target.closest('button'); if (b) hover(keyOf(b), true); });
rosterEl.addEventListener('mouseout', (e) => { const b = e.target.closest('button'); if (b) hover(keyOf(b), false); });
function hover(key, on) { hotKey = on ? key : (hotKey === key ? null : hotKey); mk.filter((d) => d.key === key).classed('hot', on).raise(); cullNames(); }
function applySel() {
  mk.classed('sel', (d) => d.key === selKey).attr('aria-current', (d) => (d.key === selKey ? 'true' : null)); mk.filter((d) => d.key === selKey).raise();
  rosterEl.querySelectorAll('button').forEach((b) => { const on = selKey != null && keyOf(b) === selKey; b.classList.toggle('sel', on); if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
}

// ---------- history overlays: relocation lines, former ballparks, the selected franchise path
const leagueOn = Object.fromEntries(GROUPS.map((g) => [g.key, true]));
let showReloc = false, showParks = false, selFranchise = null;
const pj = new Map();
const scr = (p) => { let q = pj.get(p.id); if (!q) { q = projection([p.lon, p.lat]); pj.set(p.id, q); } return tf.apply(q); };
let allLines = null, parkDots = null, selLines = null, selDots = null, selLabels = null;
function ensureAll() {
  if (showReloc && !allLines) allLines = gAll.selectAll('path').data(HX.relocations()).join('path').attr('class', 'rl-faint').attr('marker-end', 'url(#arrow-faint)');
  if (showParks && !parkDots) parkDots = gParks.selectAll('circle').data(HX.allParks).join('circle').attr('class', 'pk-dot').attr('r', 3);
  if (showParks && parkDots && !parkDots.select('title').size()) parkDots.append('title').text((d) => d.name);
}
function setSelPath(f) {
  selFranchise = f; gSel.selectAll('*').remove(); selLines = selDots = selLabels = null;
  if (f) {
    const mv = HX.franchiseRelocations(f);
    selLines = gSel.append('g').selectAll('path').data(mv).join('path').attr('class', 'rl-sel').attr('marker-end', 'url(#arrow-sel)');
    selDots = gSel.append('g').selectAll('circle').data(HX.franchiseParks(f)).join('circle').attr('class', 'pk-dot sel-dot').attr('r', 3.6);
    selDots.append('title').text((d) => d.name);
    selLabels = gSel.append('g').selectAll('text').data(mv).join('text').attr('class', 'rl-year').text((d) => d.year);
  }
  drawOverlays();
}
function drawOverlays() {
  gAll.attr('display', showReloc ? null : 'none'); gParks.attr('display', showParks ? null : 'none');
  ensureAll();
  if (showReloc && allLines) allLines.style('stroke-width', s1).attr('d', (d) => curve(scr(d.from), scr(d.to), 3 * s1, 6 * s1).d);
  const pr = 3.6 * s1, hit = (isTouch() ? 44 : 22) * s1;
  if (showParks && parkDots) parkDots.attr('r', pr).style('stroke-width', hit).attr('cx', (d) => scr(d)[0]).attr('cy', (d) => scr(d)[1]);
  if (selLines) {
    const geo = selLines.data().map((d) => curve(scr(d.from), scr(d.to), 5 * s1, 9 * s1));
    selLines.style('stroke-width', 2.4 * s1).attr('d', (d, i) => geo[i].d);
    selLabels.style('font-size', 12 * s1 + 'px').style('stroke-width', 3.5 * s1 + 'px').attr('x', (d, i) => geo[i].mid[0]).attr('y', (d, i) => geo[i].mid[1] - 4 * s1);
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
      aria: `${st.name}, ${p.name}, ${year}`, st, x0: x, y0: y, x, y, ax: x, ay: y, pick: (o) => selectStint(st.idx, { fly: true, ...o }) });
  }
  return out;
}
function renderLegend() {
  const present = new Set(HX.activeIn(year).map((st) => st.group));
  const sw = (g) => `<button type="button" class="chip${leagueOn[g.key] ? '' : ' off'}" data-lg="${g.key}" aria-pressed="${leagueOn[g.key]}"><i style="background:${g.color};${g.ring ? `border-color:${g.ring}` : ''}"></i>${esc(g.name)}</button>`;
  $('#lg-leagues').innerHTML = `<span class="lg-h">Leagues</span>` + GROUPS.filter((g) => present.has(g.key)).map(sw).join('');
  $('#lg-leagues').hidden = year === NOW;
  const map = (k, on, t) => `<button type="button" class="chip map${on ? '' : ' off'}" data-map="${k}" aria-pressed="${on}"><i class="${k}"></i>${t}</button>`;
  $('#lg-map').innerHTML = `<span class="lg-h">Map</span>` + map('reloc', showReloc, 'All relocations') + map('parks', showParks, 'All former ballparks');
}
$('#legend').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const key = b.dataset.lg ? 'lg:' + b.dataset.lg : 'map:' + b.dataset.map;
  if (b.dataset.lg) { leagueOn[b.dataset.lg] = !leagueOn[b.dataset.lg]; refresh(); }
  else if (b.dataset.map === 'reloc') { showReloc = !showReloc; renderLegend(); drawOverlays(); }
  else if (b.dataset.map === 'parks') { showParks = !showParks; renderLegend(); drawOverlays(); }
  // the legend is rebuilt on each change, so put the focus back on the same chip
  const sel = b.dataset.lg ? `[data-lg="${b.dataset.lg}"]` : `[data-map="${b.dataset.map}"]`;
  const again = $('#legend').querySelector(sel); if (again && e.detail === 0) again.focus({ preventScroll: true });
  void key; queueSync();
});
const mastR = $('#mast-r'), mastNow = mastR.textContent;
function refresh() {
  nodes = year === NOW ? nowNodes : buildHistNodes();
  renderLegend(); renderMarks(); renderRoster(); layout();
  const n = year === NOW ? nowNodes.length : HX.activeIn(year).length;
  $('#yr-count').textContent = `${n} club${n === 1 ? '' : 's'}`;
  yrEl.setAttribute('aria-valuetext', `${year}, ${n} club${n === 1 ? '' : 's'}`);
  mastR.textContent = year === NOW ? mastNow : `${n} club${n === 1 ? '' : 's'} of the ${year} season, United States and Canada`;
}
function setYear(y, o = {}) {
  y = Math.max(Y0, Math.min(NOW, Math.round(Number(y)))); if (!Number.isFinite(y)) return;
  year = y; yrEl.value = y; $('#yr-read').textContent = y;
  yrEl.style.setProperty('--p', ((y - Y0) / (NOW - Y0) * 100).toFixed(2) + '%');
  refresh();
  if (!o.keep) followSelection();
  queueSync();
}
// Keep the card on the same franchise when the year changes.
function followSelection() {
  if (!sel || sel.type === 'park') return;
  const f = sel.type === 'team' ? sel.id : HX.stints[sel.idx].franchise;
  if (year === NOW) { if (byId.has(f)) showTeam(f, false, { follow: true }); else closeCard(); return; }
  const st = HX.chain(f).find((x) => x.start <= year && year <= x.end);
  if (st) showStint(st.idx, false, { follow: true }); else closeCard();
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
// With reduced motion the year does not run by itself: Play is hidden, and the arrows and the slider step it.
const applyRM = () => { if (RM.matches) stopPlay(); $('#y-play').hidden = RM.matches; };
RM.addEventListener('change', applyRM); applyRM();
{ // decade marks under the slider; the second set is dropped when the slider is narrow
  const t = $('#yr-ticks'); let h = '';
  for (const y of [1871, 1900, 1920, 1940, 1960, 1980, 2000, 2026]) h += `<span class="${[1900, 1940, 1960, 2000].includes(y) ? 't2' : ''}" style="--q:${((y - Y0) / (NOW - Y0)).toFixed(4)}">${y}</span>`;
  t.innerHTML = h;
}

// ---------- cards
let current = null, sel = null, parkSpec = null, cardOpener = null;
const cardEl = $('#card');
const sheetEl = $('#sheet'), shBody = $('#sh-body');
function showCard(o = {}) {
  cardEl.hidden = false; document.body.classList.add('card-open'); sheetEl.dataset.view = 'card';
  cardEl.scrollTop = 0; shBody.scrollTop = 0;
  ybFull = false; updateYb();
  if (isLand()) setPanel(true);
  if (!o.follow && isPhone()) sheet.set('medium');
  fixFD();
}
function announce(t) { $('#live').textContent = ''; setTimeout(() => { $('#live').textContent = t; }, 30); }
function focusCard() { const h = cardEl.querySelector('h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
function afterShow(o, name) {
  if (o.follow) return;
  cardOpener = o.opener || null;
  announce(`${name}. Ballpark card opened.`);
  if (o.focus) focusCard();
}
function selectTeam(id, fly, o = {}) {
  if (!byId.get(id)) return;
  if (year !== NOW) setYear(NOW, { keep: true });
  showTeam(id, fly, o);
}
function showTeam(id, fly, o = {}) {
  const s = byId.get(id); if (!s) return;
  current = s; sel = { type: 'team', id }; selKey = id;
  applySel(); renderCard(s); showCard(o); setSelPath(id);
  if (fly && !o.follow) revealNode(id, fly);
  afterShow(o, s.team); queueSync();
}
// Bring the selected marker into view. Desktop: zoom in (as before). Phone: pan only, keep the zoom, keep the marker clear of the sheet.
function revealNode(key, how) {
  const n = nodes.find((d) => d.key === key); if (!n) return;
  if (isPhone()) { panToVisible(n, 'medium', how === 'now'); return; }
  if (key[0] === 'H') return;
  const k = Math.max(tf.k, 5);
  moveMap(zoomer.transform, 900, zoomIdentity.translate(W / 2 - n.x0 * k - 120, H / 2 - n.y0 * k).scale(k), how === 'now');
}
function selectStint(idx, o = {}) {
  const st = HX.stints[idx]; if (!st) return;
  let y = o.year != null ? Math.round(o.year) : (year >= st.start && year <= st.end ? year : st.start);
  y = Math.max(st.start, Math.min(st.end, y));
  if (y === NOW && !(byId.has(st.franchise) && st.end >= NOW)) y = Math.max(st.start, NOW - 1);
  if (y === NOW) { selectTeam(st.franchise, o.fly, o); return; }
  if (y !== year) setYear(y, { keep: true });
  showStint(idx, o.fly, o);
}
function showStint(idx, fly, o = {}) {
  const st = HX.stints[idx]; current = null; sel = { type: 'stint', idx }; selKey = 'H' + idx;
  applySel(); renderStintCard(st); showCard(o); setSelPath(st.franchise);
  if (fly && !o.follow) { if (isPhone()) revealNode(selKey, fly); else flyToFranchise(st.franchise, fly === 'now'); }
  afterShow(o, st.name); queueSync();
}
function showParkCard(id, o = {}) {
  const p = HX.park(id); if (!p) return;
  current = null; sel = { type: 'park', id }; selKey = null;
  applySel(); renderParkCard(p); showCard(o); setSelPath(null);
  if (isPhone()) { const q = projection([p.lon, p.lat]); panToVisible({ x: tf.apply(q)[0], y: tf.apply(q)[1], text: '' }, 'medium', o.instant); }
  afterShow(o, p.name); queueSync();
}
function flyToFranchise(f, now) {
  const ps = HX.franchiseParks(f).map((p) => projection([p.lon, p.lat])); if (!ps.length) return;
  const xs = ps.map((q) => q[0]), ys = ps.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const bw = Math.max(x1 - x0, 1), bh = Math.max(y1 - y0, 1);
  // Fit into the part of the frame the card leaves free, and below the legend.
  const fr = $('#frame').getBoundingClientRect(), cw = cardEl.hidden ? 0 : cardEl.offsetWidth + 40;
  const availW = Math.max(250, W * (fr.width - cw) / fr.width), top = 110, availH = H - top - 30;
  const k = Math.max(1, Math.min(5, 0.8 * Math.min(availW / bw, availH / bh)));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  moveMap(zoomer.transform, 900, zoomIdentity.translate(availW / 2 - cx * k, top + availH / 2 - cy * k).scale(k), now);
}
function keyEl(key) {
  const m = mk && mk.filter((d) => d.key === key).node();
  if (m) return m;
  return [...rosterEl.querySelectorAll('button')].find((b) => keyOf(b) === key) || null;
}
function closeCard(o = {}) {
  const was = selKey, op = cardOpener;
  cardEl.hidden = true; document.body.classList.remove('card-open'); sheetEl.dataset.view = 'list'; ybFull = false; updateYb(); selKey = null; sel = null; current = null; parkSpec = null; cardOpener = null;
  applySel(); setSelPath(null); queueSync();
  if (o.restore) {
    let el = op && document.contains(op) && op.getClientRects().length ? op : (was ? keyEl(was) : null);
    if (el === $('#search-in') && isTouch()) el = null;   // do not pop the keyboard up on a phone
    if (!el && isPhone()) el = isLand() ? $('#panel-btn') : $('#sh-grab');
    if (el) el.focus({ preventScroll: true });
  }
}
// The field plan's distance numbers are drawn in map units; size them so that they show at 12 px or more.
function fixFD() {
  cardEl.querySelectorAll('svg.field-diagram').forEach((sv) => {
    const vb = sv.viewBox.baseVal, w = sv.getBoundingClientRect().width; if (!vb || !vb.width || !w) return;
    const fs = Math.max(24, 12.5 / (w / vb.width));
    sv.querySelectorAll('.fd-num').forEach((t) => { t.style.fontSize = fs.toFixed(1) + 'px'; });
  });
}

function renderCard(s) {
  parkSpec = null;
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
  $('#card-x').onclick = () => closeCard({ restore: true });
  parkSpec = s; $('#enter').onclick = () => openPark(s, $('#enter'));
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
  parkSpec = null;
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
  $('#card-x').onclick = () => closeCard({ restore: true });
  const en = $('#enter');
  if (en) {
    parkSpec = { id: 'H-' + p.id, stadium: p.name, team: st.name, city: p.city, colors: [c1, c2], capacity: p.capacity ?? 20000,
      opened: p.opened, roof: p.roof, surface: p.surface, dimensions_ft: p.dimensions_ft, wall_ft: p.wall_ft };
    en.onclick = () => openPark(parkSpec, en);
  }
}
function renderParkCard(p) {
  parkSpec = null;
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
  $('#card-x').onclick = () => closeCard({ restore: true });
}
cardEl.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-i]'); if (!b) return;
  selectStint(+b.dataset.i, { year: +b.dataset.y, fly: true, focus: e.detail === 0 });
});


// ---------- 3D ballpark
let park = null, loadTok = 0, parkOpener = null;
const parkEl = $('#park'), parkLoading = $('#park-loading');
const parkTrace = [];
function setInertOthers(on) {
  for (const el of document.body.children) {
    if (el === parkEl || el.tagName === 'SCRIPT' || el.id === 'live') continue;
    if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
  }
}
function openPark(s, opener) {
  parkOpener = opener || document.activeElement;
  parkEl.hidden = false; document.body.classList.add('park-open'); setInertOthers(true);
  $('#park-title').textContent = s.stadium; $('#park-sub').textContent = `${s.team} · ${s.city}`;
  const detailed = !!DETAILS[s.id];
  $('#park-tag').innerHTML = detailed ? 'Detailed model.<span class="more"> The wall, the decks, and the main features follow the real park. Proportions are approximate.</span>'
    : 'Generated model.<span class="more"> The field shape and the wall use the real dimensions. The seating is generic.</span>';
  $('#park-canvas').setAttribute('aria-label', `3D model of ${s.stadium}`);
  $('#views').innerHTML = ''; $('#hint').textContent = '';
  parkLoading.hidden = false;
  $('#park-x').focus({ preventScroll: true });
  const tok = ++loadTok;
  parkTrace.push({ e: 'loading-shown', t: performance.now() });
  // Paint the loading state first; the build blocks the main thread for up to a second or more.
  requestAnimationFrame(() => {
    parkTrace.push({ e: 'raf', t: performance.now() });
    setTimeout(() => {
      if (tok !== loadTok || parkEl.hidden) return;
      parkTrace.push({ e: 'build-start', t: performance.now() });
      try {
        if (!park) park = new ParkView($('#park-canvas'));
        park.load(s);
      } catch (err) {
        console.error(err); $('#park-title').textContent = 'The 3D view did not start on this device.'; parkLoading.hidden = true; return;
      }
      $('#views').innerHTML = Object.entries(park.views).map(([k, v]) => `<button type="button" data-v="${k}" aria-pressed="false">${v.label}</button>`).join('') + (park.roof ? '<button type="button" id="roof" aria-pressed="false">Close the roof</button>' : '');
      setViewUI('aerial'); park.start();
      parkLoading.hidden = true;
      parkTrace.push({ e: 'build-end', t: performance.now() });
    }, window.__show ? window.__show.loadDelay || 0 : 0);
  });
  queueSync();
}
function setViewUI(name) {
  $('#views').querySelectorAll('button[data-v]').forEach((b) => { const on = b.dataset.v === name; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  const v = park.views[name];
  const touch = matchMedia('(pointer: coarse)').matches;
  $('#hint').textContent = v.orbit ? (touch ? 'Drag to orbit. Pinch to zoom.' : 'Drag to orbit. Scroll to zoom.') : v.walk ? (touch ? 'Drag to look around on the field.' : 'Drag to look. Use W A S D or the arrow keys to walk on the field. Hold Shift to run.') : 'Drag to look around from this seat.';
}
$('#views').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || !park) return;
  if (b.id === 'roof') { const closed = park.toggleRoof(); b.textContent = closed ? 'Open the roof' : 'Close the roof'; b.setAttribute('aria-pressed', closed ? 'true' : 'false'); return; }
  park.setView(b.dataset.v); setViewUI(b.dataset.v);
});
function closePark() {
  if (parkEl.hidden) return;
  loadTok++; if (park) park.stop(); parkEl.hidden = true; parkLoading.hidden = true; document.body.classList.remove('park-open'); setInertOthers(false);
  let el = parkOpener && document.contains(parkOpener) && parkOpener.getClientRects().length ? parkOpener : (selKey ? keyEl(selKey) : null);
  parkOpener = null;
  if (!el && isPhone()) el = isLand() ? $('#panel-btn') : $('#sh-grab');
  if (el) el.focus({ preventScroll: true });
  queueSync();
}
$('#park-x').onclick = closePark;
parkEl.addEventListener('keydown', (e) => trapTab(parkEl, e));

// ---------- keyboard
const typing = (a) => { const t = a && a.tagName; return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (a && a.isContentEditable); };
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  if (!parkEl.hidden) { closePark(); return; }                      // 1. the 3D dialog
  if (drawer.isOpen) { drawer.close(); return; }                    // 2. the menu
  if (!cardEl.hidden) { closeCard({ restore: true }); return; }     // 3. the card
  if (isPhone() && !isLand()) sheet.lower();                        // 4. then the sheet goes down one step
});
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.altKey && !e.ctrlKey && !e.metaKey && !typing(document.activeElement) && parkEl.hidden && !drawer.isOpen) { e.preventDefault(); search.focus(); }
});
window.addEventListener('keydown', (e) => {
  if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const a = document.activeElement;
  if (!parkEl.hidden || drawer.isOpen || typing(a)) return;
  e.preventDefault(); stopPlay(); setYear(year + (e.key === 'ArrowRight' ? 1 : -1));
});

// ---------- search
const searchIn = $('#search-in');
function buildIndex() {
  const out = [], span = (a, b) => (a === b ? `${a}` : `${a}–${b}`);
  const cityKey = (o) => `${o.city}|${o.state || ''}`, cityName = (o) => `${o.city}${o.state ? ', ' + o.state : ''}`;
  STADIUMS.forEach((s, i) => {
    out.push({ kind: 'Club', title: s.team, sub: `${s.stadium} · ${s.city}, ${s.state}`, alias: [s.id, s.stadium, s.city, s.state], boost: 60, order: i, act: (o) => selectTeam(s.id, true, o) });
    out.push({ kind: 'Ballpark', title: s.stadium, sub: `${s.team} · ${s.city}, ${s.state} · opened ${s.opened}`, alias: [...s.former_names, s.team, s.city, s.state], boost: 60, order: i, act: (o) => selectTeam(s.id, true, o) });
  });
  for (const p of HX.allParks) {
    const users = HX.parkUsers(p.id);
    const y0 = users.length ? Math.min(...users.map((u) => u.start)) : (typeof p.opened === 'number' ? p.opened : null);
    const y1 = users.length ? Math.max(...users.map((u) => u.end)) : (typeof p.closed === 'number' ? p.closed : null);
    out.push({ kind: 'Ballpark', title: p.name, sub: `Former ballpark · ${p.city}${p.state ? ', ' + p.state : ''}${y0 != null ? ' · ' + span(y0, y1 == null ? y0 : y1) : ''}`,
      alias: [...(p.aka || []), p.city, p.state, ...users.map((u) => u.stint.name)], order: 100 + (y0 || 0),
      act: (o) => { const u = users[0]; if (u) selectStint(u.stint.idx, { year: Math.min(Math.max(u.start, u.stint.start), NOW - 1), fly: true, ...o }); else showParkCard(p.id, o); } });
  }
  const cities = new Map();
  const addCity = (o, kind, ref) => { const k = cityKey(o); if (!cities.has(k)) cities.set(k, { name: cityName(o), city: o.city, state: o.state || '', cur: [], past: [] }); const c = cities.get(k); if (kind === 'cur') c.cur.push(ref); else if (kind === 'past') c.past.push(ref); };
  STADIUMS.forEach((s) => addCity(s, 'cur', s));
  HX.stints.forEach((st) => { if (!(st.end >= NOW && byId.has(st.franchise))) addCity(st, 'past', st); });
  HX.allParks.forEach((p) => addCity(p, 'none', p));
  for (const c of cities.values()) {
    const ys = c.past.map((st) => st.start).concat(c.past.map((st) => st.end));
    const sub = c.cur.length ? `${c.cur.map((s) => s.team).join(', ')}${c.past.length ? ' · ' + c.past.length + ' former club' + (c.past.length === 1 ? '' : 's') : ''}` : c.past.length ? `${c.past.length} former club${c.past.length === 1 ? '' : 's'} · ${span(Math.min(...ys), Math.max(...ys))}` : 'Former ballparks';
    out.push({ kind: 'City', title: c.name, sub, alias: [], boost: c.cur.length ? 60 : 0, order: -(c.cur.length * 100 + c.past.length),
      act: (o) => {
        if (c.cur.length) return selectTeam(c.cur.slice().sort((a, b) => a.team.localeCompare(b.team))[0].id, true, o);
        const last = c.past.slice().sort((a, b) => b.end - a.end)[0];
        if (last) return selectStint(last.idx, { year: last.end, fly: true, ...o });
        const p = HX.allParks.find((q) => cityKey(q) === cityKey(c)); if (p) showParkCard(p.id, o);
      } });
  }
  HX.stints.forEach((st) => {
    if (st.end >= NOW && byId.has(st.franchise)) return;
    out.push({ kind: 'Former club', title: st.name, sub: `${st.city}${st.state ? ', ' + st.state : ''} · ${span(st.start, st.end)} · ${st.leagueName}`, alias: [st.city, st.state, st.leagueName], order: st.start, years: [st.start, st.end],
      act: (o) => selectStint(st.idx, { fly: true, ...o }) });
  });
  return out;
}
const search = createSearch({
  input: searchIn, list: $('#search-list'), clear: $('#search-clear'), live: $('#search-live'), buildIndex, isPhone,
  onChoose: (it) => { it.act({ opener: searchIn, focus: true }); if (isTouch()) searchIn.blur(); },
});

// ---------- phone layout: the same elements move between the desktop regions and the phone sheet, top bar and menu
const topbar = $('#topbar'), mainEl = $('main'), mapwrap = $('#mapwrap'), rosterAside = $('#roster'), rosterTop = $('#roster-top'), hubSlot = $('#hub-slot');
const yearbar = $('#yearbar'), legendEl = $('#legend'), searchEl = $('#search'), ctlEl = $('.ctl');
const hubEl = (() => {
  let a = guard(() => SU() && SU().hubLink && SU().hubLink());
  if (!a) { a = document.createElement('a'); a.className = 'ui-hublink'; a.href = '/learn-/'; a.textContent = 'Learn'; }
  a.setAttribute('aria-label', 'Learn hub: all learning modules');
  return a;
})();
sheet = createSheet({ sheet: sheetEl, grab: $('#sh-grab'), head: $('#sh-head'), topbar,
  onChange: (name) => { if (!isPhone()) return; const big = name === 'large'; for (const el of [$('#frame'), ctlEl, $('#scale')]) { if (big) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } } });
const drawer = createDrawer({ drawer: $('#drawer'), scrim: $('#scrim'), openBtn: $('#menu-btn'), closeBtn: $('#dr-x'),
  inertEls: () => [topbar, mainEl, sheetEl] });
let lastPhone = null;
// Compact year row: while a card is open (phone) and always in the landscape side panel, the year bar is one 44 px row.
let ybFull = false;
function updateYb() {
  const can = isPhone() && (sheetEl.dataset.view === 'card' || isLand());
  const mode = can ? (ybFull ? 'full' : 'compact') : '';
  if (mode) sheetEl.dataset.ybmode = mode; else delete sheetEl.dataset.ybmode;
  const more = $('#yb-more'); more.setAttribute('aria-expanded', String(mode === 'full'));
  more.setAttribute('aria-label', mode === 'full' ? 'Hide the timeline controls' : 'Show the full timeline');
}
function toggleYb() {
  if (!sheetEl.dataset.ybmode) return;
  ybFull = !ybFull; updateYb();
  if (sheet && !isLand()) sheet.set(ybFull ? 'large' : 'medium'); else if (sheet) sheet.refresh();
}
$('#yb-more').onclick = toggleYb;
$('#yr-read').addEventListener('click', () => { if (sheetEl.dataset.ybmode === 'compact') toggleYb(); });
// Landscape side panel: a 44 px button in the top bar collapses and expands it.
const panelBtn = $('#panel-btn');
function atHome() { return homeApplied && tf.k === homeApplied.k && Math.abs(tf.x - homeApplied.x) < 1 && Math.abs(tf.y - homeApplied.y) < 1; }
function setPanel(open) {
  const d = document.documentElement, was = d.dataset.panel !== 'closed';
  if (!isLand() || was === open) return;
  const home = atHome();
  if (open) delete d.dataset.panel; else d.dataset.panel = 'closed';
  if (open) sheetEl.removeAttribute('inert'); else sheetEl.setAttribute('inert', '');
  panelBtn.setAttribute('aria-expanded', String(open)); panelBtn.setAttribute('aria-label', open ? 'Hide the club panel' : 'Show the club panel');
  measure();
  if (home) goHome(300); else if (sel && open) { const n = nodes.find((x) => x.key === selKey); if (n) panToVisible(n, 'medium'); }
  queueSync();
}
panelBtn.onclick = () => setPanel(document.documentElement.dataset.panel === 'closed');
let lastLand = false;
function applyLayout() {
  const ph = isPhone(), d = document.documentElement;
  d.classList.toggle('phone', ph); d.classList.toggle('touch', isTouch()); d.classList.toggle('land', ph && MQ.shortH.matches);
  const land = ph && MQ.shortH.matches;
  if (land !== lastLand) { const home = atHome(); lastLand = land; if (!land) { delete d.dataset.panel; sheetEl.removeAttribute('inert'); } updateYb(); if (sheet) sheet.refresh(); measure(); if (home && booted) goHome(0, true); }
  if (ph !== lastPhone) {
    lastPhone = ph;
    if (ph) {
      $('#sh-head').appendChild(yearbar); shBody.append(rosterAside, cardEl);
      topbar.appendChild(searchEl); $('#dr-legend').appendChild(legendEl); $('#dr-hub').appendChild(hubEl);
      sheet.set('peek', { instant: true });
    } else {
      drawer.close({ restore: false });
      for (const el of [$('#frame'), ctlEl, $('#scale')]) el.removeAttribute('inert');
      mainEl.insertBefore(rosterAside, mapwrap);
      mapwrap.insertBefore(legendEl, ctlEl); mapwrap.insertBefore(cardEl, ctlEl); mapwrap.insertBefore(yearbar, ctlEl);
      rosterTop.appendChild(searchEl); hubSlot.appendChild(hubEl);
    }
    if (lastPhone === true && !hubEl.parentNode) $('#dr-hub').appendChild(hubEl);
    layout(); fixFD();
  }
  updateYb(); watchYb();
}
// On desktop the map frame leaves room for the year bar, whose height follows its content.
let ybRO = null;
function watchYb() {
  if (typeof ResizeObserver !== 'function') return;
  if (!ybRO) ybRO = new ResizeObserver(() => { if (!isPhone()) { const h = yearbar.offsetHeight; if (h) mapwrap.style.setProperty('--yb', (h + 8) + 'px'); } });
  ybRO.disconnect(); ybRO.observe(yearbar);
}
for (const q of Object.values(MQ)) q.addEventListener('change', () => { applyLayout(); if (isPhone()) sheet.refresh(); });

// ---------- URL and saved state
let syncT = 0;
function queueSync() { clearTimeout(syncT); syncT = setTimeout(writeState, 160); }
function queryFromState() {
  const q = new URLSearchParams();
  if (year !== NOW) q.set('y', year);
  if (sel) {
    if (sel.type === 'team') q.set('c', sel.id);
    else if (sel.type === 'stint') { const st = HX.stints[sel.idx]; q.set('h', st.franchise + ':' + st.start); }
    else q.set('p', sel.id);
  }
  const lay = []; if (showReloc) lay.push('reloc'); if (showParks) lay.push('parks'); if (lay.length) q.set('l', lay.join(','));
  const off = GROUPS.filter((g) => !leagueOn[g.key]).map((g) => g.key); if (off.length) q.set('off', off.join(','));
  if (!parkEl.hidden) q.set('v', '3d');
  return q;
}
let booted = false;
function writeState() {
  if (!booted) return;
  const q = queryFromState(), s = q.toString();
  guard(() => history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash));
  store.set('year', year);
  store.set('sel', sel ? (sel.type === 'team' ? { t: 'c', id: sel.id } : sel.type === 'stint' ? { t: 'h', f: HX.stints[sel.idx].franchise, s: HX.stints[sel.idx].start } : { t: 'p', id: sel.id }) : null);
  store.set('view', { k: tf.k, x: tf.x, y: tf.y });
  store.set('layers', { reloc: showReloc, parks: showParks, off: GROUPS.filter((g) => !leagueOn[g.key]).map((g) => g.key) });
  if (sel || year !== NOW) {
    let label = String(year);
    if (sel && sel.type === 'team') label = `${byId.get(sel.id).stadium}, ${year}`;
    else if (sel && sel.type === 'stint') { const st = HX.stints[sel.idx], hf = HX.homeFor(st, year); label = `${hf ? hf.park.name : st.name}, ${year}`; }
    else if (sel && sel.type === 'park') label = (HX.park(sel.id) || {}).name || label;
    guard(() => SU() && SU().resume.set({ label, url: location.href }));
  }
}
function applyLayers(lay, off) {
  showReloc = lay.includes('reloc'); showParks = lay.includes('parks');
  for (const g of GROUPS) leagueOn[g.key] = !off.includes(g.key);
}
function restoreSelection(t, id, f, s, y) {
  if (t === 'c' && byId.has(id)) selectTeam(id, 'now');
  else if (t === 'h') { const st = HX.stints.find((x) => x.franchise === f && x.start === +s); if (st) selectStint(st.idx, { year: y, fly: 'now' }); }
  else if (t === 'p' && HX.park(id)) showParkCard(id, { instant: true });
}
function restore() {
  const q = new URLSearchParams(location.search);
  const hasUrl = ['y', 'c', 'h', 'p', 'l', 'off', 'v'].some((k) => q.has(k));
  if (hasUrl) {
    applyLayers((q.get('l') || '').split(','), (q.get('off') || '').split(','));
    const y = q.has('y') ? +q.get('y') : NOW;
    setYear(y, { keep: true });
    if (q.has('c')) restoreSelection('c', q.get('c'));
    else if (q.has('h')) { const [f, s] = q.get('h').split(':'); restoreSelection('h', null, f, s, y); }
    else if (q.has('p')) restoreSelection('p', q.get('p'));
    if (q.get('v') === '3d' && parkSpec) openPark(parkSpec, null);
    return true;
  }
  const lay = store.get('layers'), yr = store.get('year'), sv = store.get('sel'), vw = store.get('view');
  if (!lay && !yr && !sv && !vw) return false;
  if (lay) applyLayers([lay.reloc ? 'reloc' : '', lay.parks ? 'parks' : ''], lay.off || []);
  setYear(Number.isFinite(+yr) && yr ? +yr : NOW, { keep: true });
  if (sv) restoreSelection(sv.t, sv.id, sv.f, sv.s, year);
  if (vw && Number.isFinite(vw.k) && vw.k >= 1 && (vw.k > 1.001 || !isPhone())) { measure(); svg.interrupt(); svg.call(zoomer.transform, zoomIdentity.translate(vw.x, vw.y).scale(vw.k)); }
  return true;
}

// ---------- start
setYear(NOW, { keep: true });
applyLayout();
if (isPhone()) goHome(0, true);
guard(() => restore());
$('#boot').hidden = true;
booted = true; queueSync();
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
window.__show = { zoomTo: (k) => { svg.interrupt(); svg.call(zoomer.transform, zoomIdentity.translate(W / 2 * (1 - k), H / 2 * (1 - k)).scale(k)); }, selectTeam, openPark, byId, setYear, selectStint, sheet, drawer, search, loadDelay: 0, parkTrace, get year() { return year; }, get history() { return HX; }, get park() { return park; }, get tf() { return tf; }, get px() { return px; }, ink, ratio, state: () => queryFromState().toString() };
