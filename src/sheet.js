// Phone bottom sheet (three detents, drag plus a button that cycles them) and the menu drawer.
// This module stands alone: it never reads window.SharedUI, so the phone layout works when /shared-ui/ fails to load.

export const NAMES = ['peek', 'medium', 'large'];
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,summary,[tabindex]:not([tabindex="-1"])';

export function focusables(root) {
  return [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest('[hidden],[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
}
// Keep Tab inside a container (used by the drawer and by the 3D dialog).
export function trapTab(root, e) {
  if (e.key !== 'Tab') return;
  const f = focusables(root);
  if (!f.length) { e.preventDefault(); return; }
  const first = f[0], last = f[f.length - 1], a = document.activeElement;
  if (!root.contains(a)) { e.preventDefault(); first.focus(); return; }
  if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
}

export function createSheet({ sheet, grab, head, topbar, onChange }) {
  let cur = 'peek', drag = null, justDragged = false;
  const cache = { list: 150 };   // the peek height is measured per view: the card view has a one-row year bar
  const label = () => grab.setAttribute('aria-label', `Panel size: ${cur}. Activate to change the size.`);
  const viewOf = () => (sheet.dataset.view === 'card' && sheet.dataset.ybmode ? (sheet.dataset.ybmode === 'full' ? 'full' : 'card') : 'list');
  function measurePeek(view) {
    view = view || viewOf();
    if (view === viewOf() && head.getBoundingClientRect().height > 0) {
      const cs = getComputedStyle(sheet);
      cache[view] = Math.ceil(parseFloat(cs.paddingTop) + head.getBoundingClientRect().height + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth));
    }
    return cache[view] != null ? cache[view] : cache.list;
  }
  function heights() {
    const p = measurePeek(), pl = measurePeek('list'), v = window.innerHeight, tb = topbar ? topbar.offsetHeight : 60;
    const large = Math.max(p + 140, v - tb - 8);
    const land = document.documentElement.classList.contains('land');
    const medium = Math.max(p + (land ? 66 : 90), Math.min(Math.round(v * (land ? 0.44 : 0.52)), large - 40));
    return { peek: p, peekList: pl, medium, large };
  }
  function set(name, o = {}) {
    if (!NAMES.includes(name)) return;
    cur = name; const h = heights();
    if (o.instant) sheet.style.transition = 'none';
    sheet.dataset.detent = name; sheet.style.height = h[name] + 'px';
    document.documentElement.style.setProperty('--sheet-h', h[name] + 'px');
    if (o.instant) { void sheet.offsetHeight; sheet.style.transition = ''; }
    label();
    if (onChange) onChange(name, h[name]);
  }
  const step = (d) => { const i = NAMES.indexOf(cur) + d; if (i < 0 || i >= NAMES.length) return false; set(NAMES[i]); return true; };
  grab.addEventListener('click', () => {
    if (justDragged) { justDragged = false; return; }
    set(NAMES[(NAMES.indexOf(cur) + 1) % NAMES.length]);
  });
  grab.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); step(1); } else if (e.key === 'ArrowDown') { e.preventDefault(); step(-1); }
  });
  grab.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, y: e.clientY, h: sheet.getBoundingClientRect().height, moved: false };
    try { grab.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  grab.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = drag.y - e.clientY;
    if (!drag.moved && Math.abs(dy) < 5) return;
    if (!drag.moved) { drag.moved = true; sheet.setAttribute('data-dragging', ''); }
    const h = heights();
    sheet.style.height = Math.max(h.peek, Math.min(h.large, drag.h + dy)) + 'px';
  });
  const end = (e, cancel) => {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved; drag = null;
    try { grab.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    if (!moved) return;
    justDragged = true; setTimeout(() => { justDragged = false; }, 50);
    sheet.removeAttribute('data-dragging');
    if (cancel) { set(cur); return; }
    const fh = sheet.getBoundingClientRect().height, h = heights();
    set(NAMES.reduce((b, n) => (Math.abs(h[n] - fh) < Math.abs(h[b] - fh) ? n : b), 'peek'));
  };
  grab.addEventListener('pointerup', (e) => end(e, false));
  grab.addEventListener('pointercancel', (e) => end(e, true));
  window.addEventListener('resize', () => { if (!drag) set(cur, { instant: true }); });
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => { if (!drag) { const h = heights(); if (sheet.style.height && cur === 'peek') set('peek', { instant: true }); else measurePeek(); } }).observe(head);
  label();
  return {
    set, get detent() { return cur; }, heights,
    raise: () => step(1), lower: () => step(-1),
    refresh: () => set(cur, { instant: true }),
  };
}

export function createDrawer({ drawer, scrim, openBtn, closeBtn, inertEls, onClose }) {
  let isOpen = false, opener = null;
  const setInert = (on) => inertEls().forEach((el) => { if (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } });
  function open() {
    if (isOpen) return; isOpen = true; opener = document.activeElement;
    drawer.classList.add('open'); scrim.classList.add('open'); openBtn.setAttribute('aria-expanded', 'true');
    setInert(true);
    const t = drawer.querySelector('#dr-title'); if (t) t.focus({ preventScroll: true });
  }
  function close(o = {}) {
    if (!isOpen) return false; isOpen = false;
    drawer.classList.remove('open'); scrim.classList.remove('open'); openBtn.setAttribute('aria-expanded', 'false');
    setInert(false);
    if (o.restore !== false) { const b = opener && document.contains(opener) ? opener : openBtn; if (b) b.focus({ preventScroll: true }); }
    opener = null; if (onClose) onClose();
    return true;
  }
  openBtn.addEventListener('click', () => (isOpen ? close() : open()));
  closeBtn.addEventListener('click', () => close());
  scrim.addEventListener('click', () => close());
  drawer.addEventListener('keydown', (e) => trapTab(drawer, e));
  return { open, close, get isOpen() { return isOpen; } };
}
