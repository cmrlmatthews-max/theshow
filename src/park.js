// Generated 3D ballpark. Built from the posted outfield distances, wall heights, capacity and roof type.
// The seating bowl is generic; the field shape and the wall are specific to each park. Units are feet.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { fieldSpec, wallR, wallH, wallXZ, D2R } from './field.js';
import { DETAILS } from './details/index.js';

const S = Math.SQRT1_2;
const C = {
  grass: '#6f8c4c', turf: '#5f8a5a', dirt: '#b58258', track: '#a9774e', concrete: '#b9ab90', ground: '#c2b491',
  wall: '#2c4636', cream: '#e8dcbc', brick: '#9a5c44', slab: '#b3a68c', pole: '#e0bd3f', line: '#f7f1df',
};
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const mixHex = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

function insidePoly(poly, x, z) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

// Front edge of the seats on the foul side: from the right-field pole, behind home plate, to the left-field pole.
function foulBoundary(spec, cfg) {
  const k = cfg.foulScale, q = cfg.backstop / 58;
  const side = (len, sgn) => {
    const P = (d, o) => new THREE.Vector3(sgn * S * (d + o * k), 0, S * (o * k - d));
    return [P(len, 0), P(len * 0.86, 9), P(len * 0.62, 22), P(150, 36), P(95, 47), P(45, 54)];
  };
  const right = side(spec.r[4], 1), left = side(spec.r[0], -1).reverse();
  const V = (x, z) => new THREE.Vector3(x, 0, z);
  const behind = [V(48 * k, 36 * q), V(22 * k, 54 * q), V(0, 58 * q), V(-22 * k, 54 * q), V(-48 * k, 36 * q)];
  const curve = new THREE.CatmullRomCurve3([...right, ...behind, ...left], false, 'centripetal');
  return curve.getSpacedPoints(220).map((p) => [p.x, p.z]);
}

function normalsFor(pts, center) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = b[1] - a[1], nz = -(b[0] - a[0]);
    const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
    if (nx * (p[0] - center[0]) + nz * (p[1] - center[1]) < 0) { nx = -nx; nz = -nz; }
    return [nx, nz];
  });
}

// Sweeps a closed cross-section (offset, height) along a path. One material index per edge; -1 leaves the edge open.
function sweepSolid(pts, nrm, polyFn, edgeMats, capMat) {
  const buckets = new Map();
  const push = (m, arr, uv) => { if (!buckets.has(m)) buckets.set(m, { p: [], uv: [] }); const b = buckets.get(m); b.p.push(...arr); b.uv.push(...uv); };
  const at = (i, [d, h]) => [pts[i][0] + nrm[i][0] * d, h, pts[i][1] + nrm[i][1] * d];
  let run = 0;
  const polys = pts.map((_, i) => polyFn(i));
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    const A = polys[i], B = polys[i + 1], k = A.length;
    for (let j = 0; j < k; j++) {
      const m = edgeMats[j]; if (m < 0) continue;
      const j2 = (j + 1) % k;
      const a0 = at(i, A[j]), a1 = at(i, A[j2]), b0 = at(i + 1, B[j]), b1 = at(i + 1, B[j2]);
      const len = Math.hypot(A[j2][0] - A[j][0], A[j2][1] - A[j][1]);
      const u0 = run / 24, u1 = (run + seg) / 24, v1 = len / 3;
      push(m, [...a0, ...b0, ...b1, ...a0, ...b1, ...a1], [u0, 0, u1, 0, u1, v1, u0, 0, u1, v1, u0, v1]);
    }
    run += seg;
  }
  for (const i of [0, pts.length - 1]) {
    const poly = polys[i];
    const tris = THREE.ShapeUtils.triangulateShape(poly.map(([d, h]) => new THREE.Vector2(d, h)), []);
    for (const t of tris) push(capMat, t.flatMap((v) => at(i, poly[v])), [0, 0, 0, 0, 0, 0]);
  }
  const pos = [], uv = [], geo = new THREE.BufferGeometry();
  let start = 0;
  for (const [m, b] of buckets) { pos.push(...b.p); uv.push(...b.uv); geo.addGroup(start, b.p.length / 3, m); start += b.p.length / 3; }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}

function textTexture(draw, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function paintField(spec, fieldPoly, rec, maxTex) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const [x, z] of fieldPoly) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); }
  const size = Math.max(maxX - minX, maxZ - minZ) + 60;
  const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2, x0 = cx - size / 2, z0 = cz - size / 2;
  const W = Math.min(4096, maxTex);
  const cv = document.createElement('canvas'); cv.width = cv.height = W;
  const g = cv.getContext('2d'), k = W / size;
  g.fillStyle = C.concrete; g.fillRect(0, 0, W, W);
  g.setTransform(k, 0, 0, k, -x0 * k, -z0 * k);
  const path = () => { g.beginPath(); fieldPoly.forEach(([x, z], i) => (i ? g.lineTo(x, z) : g.moveTo(x, z))); g.closePath(); };
  const isTurf = /turf|synthetic/i.test(rec.surface || '');
  // grass and mowing stripes
  g.save(); path(); g.clip();
  g.fillStyle = isTurf ? C.turf : C.grass; g.fillRect(x0, z0, size, size);
  for (const [ang, col] of [[45, 'rgba(255,255,240,0.055)'], [-45, 'rgba(0,20,0,0.05)']]) {
    g.save(); g.rotate(ang * D2R); g.fillStyle = col;
    for (let s = -900; s < 900; s += 36) g.fillRect(s, -900, 18, 1800);
    g.restore();
  }
  // warning track along the whole edge
  g.strokeStyle = C.track; g.lineWidth = 30; g.lineJoin = 'round'; path(); g.stroke();
  // infield dirt
  g.save();
  g.beginPath(); g.moveTo(0, 14); g.lineTo(320, -306); g.lineTo(-320, -306); g.closePath(); g.clip();
  g.fillStyle = C.dirt; g.beginPath(); g.arc(0, -60.5, 95, 0, Math.PI * 2); g.fill();
  g.restore();
  g.fillStyle = C.dirt; g.beginPath(); g.arc(0, 0, 13, 0, Math.PI * 2); g.fill();
  // infield grass
  const b = 90 * S;
  g.fillStyle = isTurf ? C.turf : C.grass;
  g.beginPath(); g.moveTo(0, -4.24); g.lineTo(b - 4.24, -b); g.lineTo(0, -2 * b + 4.24); g.lineTo(-b + 4.24, -b); g.closePath(); g.fill();
  g.fillStyle = C.dirt;
  for (const [x, z, r] of [[0, 0, 13], [b, -b, 12], [0, -2 * b, 12], [-b, -b, 12], [0, -59, 9], [30, 24, 2.5], [-30, 24, 2.5]]) { g.beginPath(); g.arc(x, z, r, 0, Math.PI * 2); g.fill(); }
  // lines
  g.strokeStyle = C.line; g.fillStyle = C.line; g.lineCap = 'butt';
  g.lineWidth = 0.55;
  g.beginPath(); g.moveTo(-spec.r[0] * S, -spec.r[0] * S); g.lineTo(0, 0); g.lineTo(spec.r[4] * S, -spec.r[4] * S); g.stroke();
  g.lineWidth = 0.3;
  for (const sx of [1, -1]) g.strokeRect(sx > 0 ? 1.21 : -5.21, -3, 4, 6);
  g.strokeRect(-1.79, 3, 3.58, 6);
  g.fillRect(-1, -61, 2, 0.5);                                   // pitcher's rubber
  g.beginPath(); g.moveTo(-0.71, -0.71); g.lineTo(0.71, -0.71); g.lineTo(0.71, 0); g.lineTo(0, 0.71); g.lineTo(-0.71, 0); g.closePath(); g.fill();   // home plate
  g.restore();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  return { tex, size, cx, cz };
}

export class ParkView {
  constructor(host) {
    this.host = host;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.5, 9000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.scene.background = textTexture((g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#86adc0'); gr.addColorStop(0.5, '#c5d6cf'); gr.addColorStop(1, '#f4ead0');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, 8, 512);
    this.scene.fog = new THREE.Fog('#eadfc4', 1800, 7000);
    this.scene.add(new THREE.HemisphereLight('#fff6dc', '#8a7355', 1.15));
    const sun = new THREE.DirectionalLight('#fff0cf', 1.5); sun.position.set(-500, 700, 350); this.scene.add(sun);
    this.keys = new Set(); this.tween = null; this.roofT = 0; this.roofGoal = 0; this.running = false;
    this._kd = (e) => { if (!this.running) return; const k = e.key.toLowerCase(); if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(k)) { this.keys.add(k); if (k.startsWith('arrow')) e.preventDefault(); } };
    this._ku = (e) => this.keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', this._kd); window.addEventListener('keyup', this._ku);
    this._resize = () => this.resize(); window.addEventListener('resize', this._resize);
    this.clock = new THREE.Clock();
  }

  resize() {
    const w = this.host.clientWidth || 1, h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }

  clear() {
    if (!this.group) return;
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) { if (m.map) m.map.dispose(); m.dispose(); }
    });
    this.scene.remove(this.group); this.group = null;
  }

  load(rec) {
    this.clear();
    const G = (this.group = new THREE.Group()); this.scene.add(G);
    const detail = DETAILS[rec.id] || null;
    const cfg = Object.assign({ foulScale: 1, backstop: 58, skip: {}, colors: {} }, detail && detail.config ? detail.config(rec) : {});
    const spec = (this.spec = fieldSpec(rec, cfg.wall));
    const parts = (this.parts = { poles: [], signs: [], outfieldSeats: [], lights: [], bases: [] });
    const maxR = Math.max(...spec.r), cf = spec.r[2];
    const center = [0, -cf * 0.42];
    const f = clamp((rec.capacity - 10000) / 36000, 0, 1.25);
    const add = (geo, mat, parent = G) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
    const lam = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide, ...extra });

    // ---- paths
    const wallPts = []; const wallDeg = [];
    for (let d = -45; d <= 45.001; d += 0.5) { wallPts.push(wallXZ(spec, d)); wallDeg.push(d); }
    const bPts = foulBoundary(spec, cfg);
    const fieldPoly = (this.fieldPoly = [...wallPts, ...bPts]);
    const wallN = normalsFor(wallPts, center), bN = normalsFor(bPts, center);

    // ---- ground and field
    const blockTex = textTexture((g, w, h) => {
      g.fillStyle = '#cbbd97'; g.fillRect(0, 0, w, h); g.fillStyle = '#ddd0ac';
      for (const [x, y, bw, bh] of [[10, 10, 108, 108], [138, 10, 108, 50], [138, 76, 50, 42], [204, 76, 42, 42], [10, 138, 50, 108], [76, 138, 170, 108]]) g.fillRect(x, y, bw, bh);
    }, 256, 256);
    blockTex.wrapS = blockTex.wrapT = THREE.RepeatWrapping; blockTex.repeat.set(26, 26);
    add(new THREE.CircleGeometry(6000, 64).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: blockTex })).position.y = -3;
    const apron = add(new THREE.CircleGeometry(maxR * 0.5 + 330, 64).rotateX(-Math.PI / 2), lam(C.concrete)); apron.position.set(0, -1.5, -cf * 0.42);
    const fld = paintField(spec, fieldPoly, rec, this.renderer.capabilities.maxTextureSize);
    const plane = (parts.field = add(new THREE.PlaneGeometry(fld.size, fld.size).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: fld.tex })));
    plane.position.set(fld.cx, 0, fld.cz);
    const mound = add(new THREE.CylinderGeometry(2.5, 9, 0.83, 40), lam(C.dirt)); mound.position.set(0, 0.42, -59);
    const b = 90 * S;
    for (const [x, z] of [[b, -b], [0, -2 * b], [-b, -b]]) { const bag = add(new THREE.BoxGeometry(1.5, 0.3, 1.5), lam('#f7f1df')); bag.position.set(x, 0.15, z); bag.rotation.y = Math.PI / 4; parts.bases.push(bag); }

    // ---- materials
    const seatBase = cfg.colors.seat || (() => { const c = new THREE.Color(rec.colors[0]); const hsl = {}; c.getHSL(hsl); return hsl.l < 0.1 ? '#31503f' : mixHex(rec.colors[0], '#9a8c74', 0.2); })();
    const seatTex = textTexture((g, w, h) => {
      g.fillStyle = seatBase; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(0, h - 14, w, 14);
      g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, 0, w, 10);
      g.fillStyle = C.slab; g.fillRect(0, 0, 6, h);
    }, 64, 64);
    seatTex.wrapS = seatTex.wrapT = THREE.RepeatWrapping;
    const era = cfg.colors.facade || (rec.opened >= 1960 && rec.opened <= 1991 ? C.slab : C.brick);
    const wallCol = cfg.colors.wall || C.wall, creamCol = cfg.colors.cream || C.cream;
    const M = [lam(wallCol), new THREE.MeshLambertMaterial({ map: seatTex, side: THREE.DoubleSide }), lam(creamCol), lam(era), lam(mixHex(creamCol, '#000', 0.35))];
    const WALL = 0, SEAT = 1, CREAM = 2, FACADE = 3, SHADE = 4;

    // ---- outfield wall (height follows the posted wall heights)
    {
      const pos = [], idx = [];
      wallPts.forEach(([x, z], i) => { const h = wallH(spec, wallDeg[i]); pos.push(x, 0, z, x, h, z); if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      parts.wall = add(g, lam(wallCol));
    }
    for (const sgn of [-1, 1]) {
      const [x, z] = wallXZ(spec, 45 * sgn);
      const pole = add(new THREE.CylinderGeometry(0.7, 0.7, 60, 10), lam(C.pole)); pole.position.set(x, 30, z); parts.poles.push(pole);
    }
    // distance signs
    [-45, -22.5, 0, 22.5, 45].forEach((deg, i) => {
      const posted = [rec.dimensions_ft.lf, rec.dimensions_ft.lcf, rec.dimensions_ft.cf, rec.dimensions_ft.rcf, rec.dimensions_ft.rf][i];
      if (posted == null) return;
      const dd = clamp(deg, -42.5, 42.5), hw = wallH(spec, dd);
      const [px, pz] = wallXZ(spec, dd), [ax, az] = wallXZ(spec, dd - 0.6), [bx, bz] = wallXZ(spec, dd + 0.6);
      let nx = bz - az, nz = -(bx - ax); const nl = Math.hypot(nx, nz); nx /= nl; nz /= nl;
      if (nx * px + nz * pz > 0) { nx = -nx; nz = -nz; }            // point the sign into the field
      const sh = clamp(hw * 0.7, 2.2, 6), sw = sh * 2.1;
      const tex = textTexture((g, w, h) => { g.fillStyle = '#243a2d'; g.fillRect(0, 0, w, h); g.fillStyle = '#f0d98a'; g.font = 'bold 96px Rockwell, Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(posted), w / 2, h / 2 + 6); }, 256, 128);
      const sign = add(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ map: tex }));
      const sy = Math.min(hw - sh / 2 - 0.2, Math.max(sh / 2 + 0.3, hw * 0.55));
      sign.position.set(px + nx * 0.45, sy, pz + nz * 0.45); sign.lookAt(px + nx * 10, sy, pz + nz * 10); parts.signs.push(sign);
    });

    // ---- main grandstand
    const lo = Object.assign({ depth: 60 + 50 * f, slope: 0.3, extent: [0, 1] }, cfg.lower);
    const dL = lo.depth, sL = lo.slope, lowTop = 3.5 + sL * dL;
    const N1 = bPts.length - 1, cut = (t0, t1) => { const a = Math.round(t0 * N1), b = Math.round(t1 * N1); return [bPts.slice(a, b + 1), bN.slice(a, b + 1), a, b]; };
    { const [p, n] = cut(lo.extent[0], lo.extent[1]); parts.lowerDeck = add(sweepSolid(p, n, () => [[0, 0], [0, 3.5], [dL, lowTop], [dL, 0]], [WALL, SEAT, FACADE, -1], FACADE), M); }
    const hasUpper = cfg.hasUpper ?? rec.capacity > 22000;
    const up = Object.assign({ overhang: hasUpper ? 30 : 8, rise: 24, depth: hasUpper ? 40 + 55 * f : 24, slope: hasUpper ? 0.58 : 0.25, extent: hasUpper ? 0.26 + 0.14 * Math.min(1, f) : 0.2 }, cfg.upper);
    const d0 = dL - up.overhang, h0 = 3.5 + sL * d0 + up.rise, dU = up.depth, sU = up.slope;
    const dEnd = d0 + dU, hTop = h0 + sU * dU;
    const [ut0, ut1] = Array.isArray(up.extent) ? up.extent : [0.5 - up.extent, 0.5 + up.extent];
    const [uPts, uN, i0, i1] = cut(ut0, ut1);
    if (!cfg.skip.upperDeck) parts.upperDeck = add(sweepSolid(uPts, uN, () => [[d0, h0 - 7], [d0, h0], [dEnd, hTop], [dEnd, 0], [dL, 0], [dL, h0 - 7]], [CREAM, hasUpper ? SEAT : CREAM, FACADE, -1, SHADE, SHADE], FACADE), M);
    if (hasUpper && rec.roof === 'open' && !cfg.skip.canopy && !cfg.skip.upperDeck) {
      parts.canopy = add(sweepSolid(uPts, uN, () => [[dEnd - 24, hTop + 15], [dEnd + 2, hTop + 18], [dEnd + 2, hTop + 19.5], [dEnd - 24, hTop + 16.5]], [CREAM, CREAM, CREAM, CREAM], CREAM), M);
    }

    // ---- outfield seats, batter's eye, scoreboard
    const of = Object.assign({ depth: 25 + 55 * Math.min(1, f), slope: 0.45, spans: [[-45, -9], [9, 45]], eye: [-9, 9], eyeHeight: 44, eyeDepth: 26 }, cfg.outfield);
    const D = of.depth;
    const span = (a, bdeg) => { const ia = wallDeg.findIndex((d) => d >= a - 1e-6), ib = wallDeg.findIndex((d) => d >= bdeg - 1e-6); return [wallPts.slice(ia, ib + 1), wallN.slice(ia, ib + 1), wallDeg.slice(ia, ib + 1)]; };
    for (const [a, bd, dep = D, slp = of.slope] of of.spans) {
      const [p, n, dg] = span(a, bd);
      if (p.length < 2) continue;
      parts.outfieldSeats.push(add(sweepSolid(p, n, (i) => { const hw = wallH(spec, dg[i]); return [[1.2, 0], [1.2, hw + 3], [4, hw + 3], [4 + dep, hw + 3 + slp * dep], [4 + dep, 0]]; }, [WALL, CREAM, SEAT, FACADE, -1], FACADE), M));
    }
    if (of.eye) { const [p, n, dg] = span(of.eye[0], of.eye[1]); const eh = (i) => Math.max(of.eyeHeight, wallH(spec, dg[i]) + 20); parts.batterEye = add(sweepSolid(p, n, (i) => [[1.2, 0], [1.2, eh(i)], [of.eyeDepth, eh(i)], [of.eyeDepth, 0]], [WALL, WALL, WALL, -1], WALL), M); }
    if (!cfg.skip.scoreboard)
    {
      const deg = -25, a = deg * D2R, r = wallR(spec, deg) + D + 16, hw = wallH(spec, deg);
      const bw = 80 + 50 * Math.min(1, f), bh = bw * 0.44, y = hw + 3 + 0.45 * D + 10 + bh / 2;
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#1f3a2c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8dcbc'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20);
        g.fillStyle = '#e8dcbc'; g.textAlign = 'center'; g.textBaseline = 'middle';
        let fs = 70; g.font = `bold ${fs}px Rockwell, Georgia, serif`; const name = rec.stadium.toUpperCase();
        while (g.measureText(name).width > w - 80 && fs > 24) { fs -= 4; g.font = `bold ${fs}px Rockwell, Georgia, serif`; }
        g.fillText(name, w / 2, 70);
        g.font = 'bold 30px Rockwell, Georgia, serif';
        const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'H', 'E'], x0 = 330, cw = (w - x0 - 40) / cols.length;
        cols.forEach((c, i) => g.fillText(c, x0 + cw * (i + 0.5), 150));
        g.textAlign = 'left';
        ['VISITORS', rec.team.split(' ').slice(-1)[0].toUpperCase()].forEach((t, row) => {
          const yy = 220 + row * 80; g.fillText(t, 40, yy);
          cols.forEach((_, i) => { g.strokeStyle = '#e8dcbc'; g.lineWidth = 2; g.strokeRect(x0 + cw * i + 6, yy - 28, cw - 12, 56); });
        });
        g.textAlign = 'center'; g.font = 'italic 28px Baskerville, Georgia, serif'; g.fillText(`Opened ${rec.opened}  ·  Capacity ${rec.capacity.toLocaleString('en-US')}`, w / 2, h - 50);
      }, 1024, 448);
      const board = add(new THREE.BoxGeometry(bw, bh, 5), [lam(C.wall), lam(C.wall), lam(C.wall), lam(C.wall), new THREE.MeshBasicMaterial({ map: tex }), lam(C.wall)]);
      board.position.set(r * Math.sin(a), y, -r * Math.cos(a)); board.lookAt(0, y, 0); parts.scoreboard = board;
      const ph = y - bh / 2;
      for (const sx of [-0.35, 0.35]) { const post = add(new THREE.BoxGeometry(3, ph, 3), lam(C.wall), board); post.position.set(bw * sx, -bh / 2 - ph / 2, -4); }
    }

    // ---- lights
    if (rec.roof === 'open' && !cfg.skip.lights) {
      const tower = (x, z, base) => { const t = new THREE.Group(); const pole = add(new THREE.BoxGeometry(3, 55, 3), lam('#6d6558'), t); pole.position.y = base + 27; const bank = add(new THREE.BoxGeometry(26, 11, 2), lam('#d9d1b6'), t); bank.position.y = base + 60; t.position.set(x, 0, z); t.lookAt(0, 0, -cf * 0.4); G.add(t); parts.lights.push(t); };
      for (const tt of [0.16, 0.34, 0.66, 0.84]) { const i = Math.round(tt * (bPts.length - 1)); const inU = i >= i0 && i <= i1; const dd = inU ? dEnd - 3 : dL - 3; tower(bPts[i][0] + bN[i][0] * dd, bPts[i][1] + bN[i][1] * dd, inU ? hTop : lowTop); }
      for (const deg of [-33, 33]) { const r = wallR(spec, deg) + D + 2, a = deg * D2R; tower(r * Math.sin(a), -r * Math.cos(a), wallH(spec, deg) + 3 + 0.45 * D); }
    }

    // ---- roof
    this.roof = null;
    const roofY = Math.max(hTop + 55, 170), halfW = maxR * S + dL + 90, zBack = 62 + dEnd + 30, zFront = -(cf + D + 60);
    if (rec.roof === 'fixed') {
      const R = Math.max(halfW, (zBack - zFront) / 2) * 1.08;
      const dome = add(new THREE.SphereGeometry(R, 48, 14, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#f1e8cf', transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }));
      dome.scale.y = (roofY + 40) / R; dome.position.set(0, 0, (zBack + zFront) / 2); parts.dome = dome;
      const ribs = add(new THREE.SphereGeometry(R, 20, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#6d5d45', wireframe: true, transparent: true, opacity: 0.22 }));
      ribs.scale.copy(dome.scale); ribs.position.copy(dome.position);
    } else if (rec.roof === 'retractable') {
      const n = 5, depth = (zBack - zFront) / n; this.roof = [];
      for (let i = 0; i < n; i++) {
        const panel = add(new THREE.BoxGeometry(halfW * 2, 5, depth + 4), new THREE.MeshLambertMaterial({ color: '#efe5ca', transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false }));
        const closedZ = zBack - depth * (i + 0.5), openZ = zBack + depth * 0.1 - i * 14;
        this.roof.push({ panel, closedZ, openZ, closedY: roofY, openY: roofY + i * 9 });
      }
      this.roofT = this.roofGoal = 0; this._placeRoof();
    }

    // ---- camera stops
    const dirFrom = (p, look) => new THREE.Vector3(...look).sub(new THREE.Vector3(...p)).normalize();
    const cfR = wallR(spec, 0) - 16;
    const iu = Math.round(0.6 * (bPts.length - 1)), ib = Math.round(0.5 * (bPts.length - 1));
    const seatAt = (i, d, y) => [bPts[i][0] + bN[i][0] * d, y, bPts[i][1] + bN[i][1] * d];
    const blA = -28 * D2R, blR = wallR(spec, -28) + 4 + D * 0.55;
    this.views = {
      aerial: { pos: [-maxR * 0.85, maxR * 1.0, 300], look: [0, 0, -cf * 0.45], orbit: true, label: 'Aerial' },
      pressbox: { pos: seatAt(ib, d0 + 4, h0 + 6), look: [0, 0, -170], label: 'Press Box' },
      home: { pos: [0, 5.6, 4], look: [0, 14, -300], walk: true, label: 'Home Plate' },
      mound: { pos: [0, 6.6, -57], look: [0, 3.5, 0], walk: true, label: 'Mound' },
      center: { pos: [0, 5.8, -cfR], look: [0, 6, 0], walk: true, label: 'Center Field' },
      upper: { pos: seatAt(iu, d0 + dU * 0.6, h0 + sU * dU * 0.6 + 4.5), look: [0, 0, -150], label: hasUpper ? 'Upper Deck' : 'Suite Level' },
      bleachers: { pos: [blR * Math.sin(blA), wallH(spec, -28) + 3 + 0.45 * D * 0.55 + 4.5, -blR * Math.cos(blA)], look: [0, 0, -40], label: 'Bleachers' },
    };
    for (const v of Object.values(this.views)) v.dir = dirFrom(v.pos, v.look);
    this.orbitTarget = new THREE.Vector3(0, 0, -cf * 0.45);

    // ---- hand-detailed additions (Phase 3)
    if (detail && detail.build) {
      const remove = (obj) => { if (!obj) return; (Array.isArray(obj) ? obj : [obj]).forEach((o) => { if (o && o.parent) o.parent.remove(o); }); };
      detail.build({
        THREE, G, rec, spec, cfg, parts, views: this.views, add, lam, remove,
        M, MAT: { WALL, SEAT, CREAM, FACADE, SHADE }, C,
        paths: { wallPts, wallDeg, wallN, bPts, bN, fieldPoly },
        dims: { f, maxR, cf, dL, sL, lowTop, d0, h0, dU, sU, dEnd, hTop, D, ofSlope: of.slope, i0, i1, halfW, zBack, zFront, roofY },
        tools: { sweepSolid, textTexture, normalsFor, insidePoly, mixHex, clamp, wallXZ, wallR, wallH, D2R, span, cut,
          foulAt: (t, d, y) => { const i = Math.round(clamp(t, 0, 1) * N1); return new THREE.Vector3(bPts[i][0] + bN[i][0] * d, y, bPts[i][1] + bN[i][1] * d); },
          wallAt: (deg, out, y) => { const r = wallR(spec, deg) + out, a = deg * D2R; return new THREE.Vector3(r * Math.sin(a), y, -r * Math.cos(a)); } },
      });
      for (const v of Object.values(this.views)) if (!v.dir) v.dir = dirFrom(v.pos, v.look);
    }
    this.setView('aerial', true);
  }

  _placeRoof() {
    if (!this.roof) return;
    const t = this.roofT, s = t * t * (3 - 2 * t);
    for (const r of this.roof) r.panel.position.set(0, r.openY + (r.closedY - r.openY) * s, r.openZ + (r.closedZ - r.openZ) * s);
  }
  toggleRoof() { if (!this.roof) return null; this.roofGoal = this.roofGoal ? 0 : 1; return this.roofGoal === 1; }

  setView(name, instant = false) {
    const v = this.views[name]; if (!v) return;
    this.view = name; this.walk = !!v.walk;
    const pos = new THREE.Vector3(...v.pos);
    const target = v.orbit ? this.orbitTarget.clone() : pos.clone().addScaledVector(v.dir, 1);
    const c = this.controls;
    const apply = () => {
      c.enabled = true; c.enableZoom = !!v.orbit; c.enablePan = false;
      c.rotateSpeed = v.orbit ? 0.6 : -0.3;
      c.minDistance = v.orbit ? 80 : 1; c.maxDistance = v.orbit ? 3000 : 1;
      c.minPolarAngle = v.orbit ? 0.05 : 0.5; c.maxPolarAngle = v.orbit ? 1.5 : 2.5;
    };
    if (instant) { this.camera.position.copy(pos); c.target.copy(target); apply(); c.update(); this.tween = null; return; }
    c.enabled = false; c.minDistance = 0; c.maxDistance = Infinity; c.minPolarAngle = 0; c.maxPolarAngle = Math.PI;
    this.tween = { t: 0, p0: this.camera.position.clone(), t0: c.target.clone(), p1: pos, t1: target, done: apply };
  }

  start() { if (this.running) return; this.running = true; this.resize(); this.clock.getDelta(); const loop = () => { if (!this.running) return; this.frame(); this.raf = requestAnimationFrame(loop); }; loop(); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); this.keys.clear(); }

  frame() {
    const dt = Math.min(0.05, this.clock.getDelta()), c = this.controls;
    if (this.tween) {
      const tw = this.tween; tw.t = Math.min(1, tw.t + dt / 1.1);
      const s = tw.t * tw.t * (3 - 2 * tw.t);
      this.camera.position.lerpVectors(tw.p0, tw.p1, s); c.target.lerpVectors(tw.t0, tw.t1, s); this.camera.lookAt(c.target);
      if (tw.t >= 1) { this.tween = null; tw.done(); c.update(); }
    } else {
      if (this.walk && this.keys.size) {
        const fwd = new THREE.Vector3().subVectors(c.target, this.camera.position); fwd.y = 0; fwd.normalize();
        const right = new THREE.Vector3(-fwd.z, 0, fwd.x), k = this.keys, mv = new THREE.Vector3();
        if (k.has('w') || k.has('arrowup')) mv.add(fwd); if (k.has('s') || k.has('arrowdown')) mv.sub(fwd);
        if (k.has('d') || k.has('arrowright')) mv.add(right); if (k.has('a') || k.has('arrowleft')) mv.sub(right);
        if (mv.lengthSq()) {
          mv.normalize().multiplyScalar((k.has('shift') ? 75 : 30) * dt);
          const nx = this.camera.position.x + mv.x, nz = this.camera.position.z + mv.z;
          const pad = 4;
          if (insidePoly(this.fieldPoly, nx + Math.sign(mv.x) * pad, nz + Math.sign(mv.z) * pad)) { this.camera.position.add(mv); c.target.add(mv); }
        }
      }
      c.update();
    }
    if (this.roof && this.roofT !== this.roofGoal) { this.roofT = clamp(this.roofT + Math.sign(this.roofGoal - this.roofT) * dt / 3, 0, 1); this._placeRoof(); }
    this.renderer.render(this.scene, this.camera);
  }
}
