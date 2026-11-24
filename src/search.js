// One search field for clubs, ballparks, cities, and former or defunct clubs. ARIA combobox with a listbox.
// Items come from main.js: { kind, title, sub, alias, order, act }.

const norm = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const KINDS = [['Club', 5], ['Ballpark', 5], ['City', 3], ['Former club', 8]];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function score(it, q, toks) {
  const t = it.t, a = it.a;
  let s = 0;
  for (const tok of toks) {
    if (t.startsWith(tok) || t.includes(' ' + tok)) s += 3;
    else if (tok.length >= 3 && t.includes(tok)) s += 2;
    else if (a.startsWith(tok) || a.includes(' ' + tok)) s += 1.5;
    else if (tok.length >= 3 && a.includes(tok)) s += 1;
    else return 0;
  }
  if (t.startsWith(q)) s += 50 - Math.min(20, (t.length - q.length) * 0.2);
  else if (t.includes(' ' + q)) s += 10;
  return s + (it.boost || 0);
}

export function createSearch({ input, list, clear, live, buildIndex, onChoose, isPhone }) {
  let items = null, results = [], active = -1, open = false;
  const ensure = () => {
    if (!items) items = buildIndex().map((it) => Object.assign(it, { t: norm(it.title), a: norm((it.alias || []).join(' ')) }));
    return items;
  };
  function position() {
    const r = input.getBoundingClientRect();
    if (isPhone()) { list.style.left = ''; list.style.right = ''; list.style.width = ''; list.style.top = r.bottom + 4 + 'px'; }
    else {
      const w = Math.min(Math.max(r.width, 340), window.innerWidth - r.left - 8);
      list.style.left = r.left + 'px'; list.style.right = 'auto'; list.style.width = w + 'px'; list.style.top = r.bottom + 2 + 'px';
    }
    list.style.maxHeight = Math.max(160, window.innerHeight - r.bottom - 24) + 'px';
  }
  function setOpen(on) {
    open = on; list.hidden = !on; input.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (!on) { active = -1; input.removeAttribute('aria-activedescendant'); } else position();
  }
  function setActive(i) {
    const opts = list.querySelectorAll('[role=option]');
    opts.forEach((o, k) => o.setAttribute('aria-selected', k === i ? 'true' : 'false'));
    active = i;
    if (i >= 0 && opts[i]) { input.setAttribute('aria-activedescendant', opts[i].id); opts[i].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
  }
  function update() {
    const raw = input.value; clear.hidden = !raw;
    const q = norm(raw), toks = q.split(' ').filter(Boolean);
    if (!toks.length) { results = []; setOpen(false); live.textContent = ''; return; }
    const all = ensure();
    const byKind = new Map(KINDS.map(([k]) => [k, []]));
    for (const it of all) { const s = score(it, q, toks); if (s > 0) byKind.get(it.kind).push([s, it]); }
    results = []; let html = '';
    for (const [k, cap] of KINDS) {
      const arr = byKind.get(k).sort((x, y) => y[0] - x[0] || (x[1].order || 0) - (y[1].order || 0)).slice(0, cap);
      if (!arr.length) continue;
      html += `<li role="presentation" class="sg">${k}</li>`;
      for (const [, it] of arr) {
        const i = results.length; results.push(it);
        html += `<li role="option" id="so-${i}" aria-selected="false" data-i="${i}" aria-label="${esc(it.title)}, ${esc(k)}, ${esc(it.sub)}"><b>${esc(it.title)}</b><span>${esc(it.sub)}</span></li>`;
      }
    }
    if (!results.length) html = `<li role="presentation" class="none">No clubs, ballparks, or cities match “${esc(raw.trim())}”.</li>`;
    list.innerHTML = html; setOpen(true); active = -1; input.removeAttribute('aria-activedescendant');
    live.textContent = results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'No results';
  }
  function choose(i) {
    const it = results[i]; if (!it) return;
    setOpen(false); input.value = it.title; clear.hidden = false;
    onChoose(it);
  }
  input.addEventListener('input', update);
  input.addEventListener('focus', () => { if (input.value.trim()) update(); });
  input.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== input && !list.contains(document.activeElement)) setOpen(false); }, 120));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) { update(); return; } if (results.length) setActive((active + 1) % results.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (open && results.length) setActive(active <= 0 ? results.length - 1 : active - 1); }
    else if (e.key === 'Enter') { if (open && results.length) { e.preventDefault(); choose(active >= 0 ? active : 0); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); e.stopPropagation(); setOpen(false); } }
    else if (e.key === 'Tab') setOpen(false);
  });
  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => { const o = e.target.closest('[role=option]'); if (o) choose(+o.dataset.i); });
  clear.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
  window.addEventListener('resize', () => { if (open) position(); });
  return { focus: () => { input.focus(); input.select(); }, close: () => setOpen(false), get isOpen() { return open; }, update, norm };
}
