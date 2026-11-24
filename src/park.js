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


// ---- instanced box helpers: one draw call per set, per-instance colour. Every item is {m: Matrix4, c: colour}.
const ungroup = (g) => { g.clearGroups(); return g; };   // single material: groups would only inflate call counts
const UNIT = new THREE.BoxGeometry(1, 1, 1); UNIT.clearGroups();   // one material, one draw call per instanced set
const _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3(), _m = new THREE.Matrix4(), _c = new THREE.Color();
const UPV = new THREE.Vector3(0, 1, 0), ALTV = new THREE.Vector3(1, 0, 0);
// Box centred at (cx,cy,cz); local z runs along (zx,zy,zz), local x stays horizontal. Sizes are full lengths.
function boxAt(list, cx, cy, cz, zx, zy, zz, sx, sy, sz, color) {
  _z.set(zx, zy, zz).normalize();
  _x.crossVectors(Math.abs(_z.y) > 0.98 ? ALTV : UPV, _z).normalize();
  _y.crossVectors(_z, _x);
  _m.makeBasis(_x, _y, _z).scale(new THREE.Vector3(sx, sy, sz)).setPosition(cx, cy, cz);
  list.push({ m: _m.clone(), c: color });
}
// Thin bar from a to b ([x,y,z]) with cross-section tx (horizontal) by ty (vertical-ish).
function boxBetween(list, a, b, tx, ty, color, extra = 0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz);
  if (L < 1e-4) return;
  boxAt(list, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, dx, dy, dz, tx, ty, L + extra, color);
}
function makeInst(list, mat, geo = UNIT) {
  const im = new THREE.InstancedMesh(geo, mat, Math.max(1, list.length));
  im.count = list.length;
  list.forEach((it, i) => { im.setMatrixAt(i, it.m); im.setColorAt(i, _c.set(it.c)); });
  im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
  return im;
}
// Position and unit normal at arc length s along a path of [x,z] with normals. Also returns the fractional index.
function pathAt(pts, nrm, acc, s) {
  let i = 0; while (i < pts.length - 2 && acc[i + 1] < s) i++;
  const seg = acc[i + 1] - acc[i] || 1, u = clamp((s - acc[i]) / seg, 0, 1);
  const nx = nrm[i][0] + (nrm[i + 1][0] - nrm[i][0]) * u, nz = nrm[i][1] + (nrm[i + 1][1] - nrm[i][1]) * u, nl = Math.hypot(nx, nz) || 1;
  return { x: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, z: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, nx: nx / nl, nz: nz / nl, fi: i + u };
}
const cumLen = (pts) => { const a = [0]; for (let i = 1; i < pts.length; i++) a.push(a[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return a; };

// Rail: posts and a top rail along a polyline of [x,z]. yAt(i) is the base height at point i. opts { height, spacing, color, glass, lod }.
function railGroup(pts, yAt, o, lod, mats) {
  const grp = new THREE.Group(), height = o.height ?? 3.5, color = o.color || '#5f6458', glass = !!o.glass;
  const spacing = (o.spacing ?? 6) * (lod === 'low' ? 2 : 1);
  if (!pts || pts.length < 2) return grp;
  const acc = cumLen(pts), total = acc[acc.length - 1], n = Math.max(1, Math.round(total / spacing));
  const S3 = [];
  for (let k = 0; k <= n; k++) {
    const s = (total * k) / n; let i = 0; while (i < pts.length - 2 && acc[i + 1] < s) i++;
    const seg = acc[i + 1] - acc[i] || 1, u = clamp((s - acc[i]) / seg, 0, 1), y0 = yAt(i), y1 = yAt(i + 1);
    S3.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, y0 + (y1 - y0) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]);
  }
  const solid = [], panes = [];
  S3.forEach((p, k) => {
    boxAt(solid, p[0], p[1] + height / 2, p[2], 0, 1, 0, 0.3, 0.3, height, color);
    if (k) {
      const q = S3[k - 1];
      boxBetween(solid, [q[0], q[1] + height, q[2]], [p[0], p[1] + height, p[2]], 0.4, 0.3, color, 0.3);
      if (glass) boxBetween(panes, [q[0], q[1] + height * 0.5, q[2]], [p[0], p[1] + height * 0.5, p[2]], 0.12, height * 0.9, '#ffffff', 0.05);
    }
  });
  grp.add(makeInst(solid, mats.solid));
  if (glass && panes.length) { const g = makeInst(panes, mats.glass); g.renderOrder = 2; grp.add(g); }
  return grp;
}

// Aisles on a sloped deck: concrete strips with a centre handrail. profile { d0, h0, d1, h1 } (each may be a function of the fractional path index).
function aisleGroup(pts, nrm, prof, o, lod, mats) {
  const grp = new THREE.Group(); if (!pts || pts.length < 2) return grp;
  const every = (o.every ?? 24) * (lod === 'low' ? 2 : 1), width = o.width ?? 4, hand = (o.handrail ?? true) && lod !== 'low';
  const acc = cumLen(pts), total = acc[acc.length - 1], s0 = total * (o.from ?? 0), s1 = total * (o.to ?? 1);
  const count = Math.max(1, Math.round((s1 - s0) / every)), list = [];
  for (let k = 0; k < count; k++) {
    const P = pathAt(pts, nrm, acc, s0 + ((k + 0.5) * (s1 - s0)) / count);
    const h0 = typeof prof.h0 === 'function' ? prof.h0(P.fi) : prof.h0, h1 = typeof prof.h1 === 'function' ? prof.h1(P.fi) : prof.h1;
    const pd0 = typeof prof.d0 === 'function' ? prof.d0(P.fi) : prof.d0, pd1 = typeof prof.d1 === 'function' ? prof.d1(P.fi) : prof.d1;
    const A = [P.x + P.nx * pd0, h0, P.z + P.nz * pd0], B = [P.x + P.nx * pd1, h1, P.z + P.nz * pd1];
    const dx = B[0] - A[0], dy = B[1] - A[1], dz = B[2] - A[2], L = Math.hypot(dx, dy, dz);
    boxAt(list, (A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + 0.25, (A[2] + B[2]) / 2, dx, dy, dz, width, 0.2, L, '#d8cfb8');
    if (hand) {
      const m = Math.max(2, Math.round(L / 10));
      for (let j = 0; j <= m; j++) { const f = j / m; boxAt(list, A[0] + dx * f, A[1] + dy * f + 1.9, A[2] + dz * f, 0, 1, 0, 0.3, 0.3, 3.2, '#5f6458'); }
      boxBetween(list, [A[0], A[1] + 3.4, A[2]], [B[0], B[1] + 3.4, B[2]], 0.3, 0.3, '#5f6458');
    }
  }
  grp.add(makeInst(list, mats.solid));
  return grp;
}

// Flat lamp bank for phones: a grid of pale lamps on a dark backing.
function lampTexture() {
  return textTexture((g, w, h) => {
    g.fillStyle = '#8a8068'; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { g.fillStyle = '#efe6c0'; g.fillRect(6 + c * 14.5, 6 + r * 14, 11, 10); }
  }, 128, 64);
}

// Concatenate non-indexed geometries (position, normal, uv) into one.
function mergeGeos(list) {
  const pos = [], nor = [], uv = [];
  for (const g of list) { pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); uv.push(...g.attributes.uv.array); g.dispose(); }
  const m = new THREE.BufferGeometry();
  m.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); m.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); m.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return m;
}

// Seat-row texture: one repeat across = 24 ft (14 seats), one repeat up the slope = 3 ft (one row). White and grey only; the material colour tints it.
function seatRowTexture(renderer, lod) {
  const W = lod === 'low' ? 128 : 256, H = lod === 'low' ? 32 : 64;
  const t = textTexture((g, w, h) => {
    const riser = h * 0.34, seats = 14, sw = w / seats;
    g.fillStyle = '#8f8f8f'; g.fillRect(0, h - riser, w, riser);          // riser (v near 0 is the bottom of the canvas)
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h - riser);               // tread
    g.fillStyle = '#6e6e6e'; g.fillRect(0, h - riser - 1, w, 1.5);       // shadow line under the seat bottoms
    for (let i = 0; i < seats; i++) {
      g.fillStyle = '#c9c9c9'; g.fillRect(i * sw + 1.5, 1, sw - 3, (h - riser) * 0.36);   // seat back
      g.fillStyle = '#e4e4e4'; g.fillRect(i * sw + 2.5, (h - riser) * 0.42, sw - 5, (h - riser) * 0.34);   // seat cushion
    }
  }, W, H);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), lod === 'low' ? 4 : 16);
  return t;
}

function paintField(spec, fieldPoly, rec, maxTex, lod, aniso) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const [x, z] of fieldPoly) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); }
  const size = Math.max(maxX - minX, maxZ - minZ) + 60;
  const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2, x0 = cx - size / 2, z0 = cz - size / 2;
  const W = Math.min(4096, maxTex) / (lod === 'low' ? 2 : 1);      // phone: half the desktop texture
  const cv = document.createElement('canvas'); cv.width = cv.height = W;
  const g = cv.getContext('2d'), k = W / size;
  g.fillStyle = C.concrete; g.fillRect(0, 0, W, W);
  g.setTransform(k, 0, 0, k, -x0 * k, -z0 * k);
  const path = () => { g.beginPath(); fieldPoly.forEach(([x, z], i) => (i ? g.lineTo(x, z) : g.moveTo(x, z))); g.closePath(); };
  const isTurf = /turf|synthetic/i.test(rec.surface || '');
  const grass = isTurf ? C.turf : C.grass;
  const circle = (x, z, r) => { g.beginPath(); g.arc(x, z, r, 0, Math.PI * 2); };
  // grass, with a muted checkerboard of 26 ft diamonds over the outfield and foul ground
  g.save(); path(); g.clip();
  g.fillStyle = grass; g.fillRect(x0, z0, size, size);
  g.save(); g.rotate(45 * D2R);
  const cell = 26;
  for (let i = -30; i < 30; i++) for (let j = -30; j < 30; j++) {
    g.fillStyle = (i + j) & 1 ? 'rgba(255,255,225,0.055)' : 'rgba(10,35,0,0.045)';
    g.fillRect(i * cell, j * cell, cell + 0.3, cell + 0.3);
  }
  g.restore();
  // warning track along the whole edge, with a darker rim on its inner edge
  g.lineJoin = 'round'; path();
  g.strokeStyle = 'rgba(80,48,24,0.4)'; g.lineWidth = 32; g.stroke();
  g.strokeStyle = C.track; g.lineWidth = 30.2; g.stroke();
  // infield dirt: the 95 ft arc around the mound, cut by the foul lines, and the home-plate circle
  g.save();
  g.beginPath(); g.moveTo(0, 14); g.lineTo(320, -306); g.lineTo(-320, -306); g.closePath(); g.clip();
  g.fillStyle = C.dirt; circle(0, -60.5, 95); g.fill();
  g.restore();
  g.fillStyle = C.dirt; circle(0, 0, 13); g.fill();
  g.strokeStyle = 'rgba(90,55,28,0.3)'; g.lineWidth = 0.5; circle(0, 0, 13); g.stroke();
  // infield grass: a diamond inside the 6 ft base paths, mown in bands across the diamond
  const b = 90 * S;
  g.save();
  g.beginPath(); g.moveTo(0, -4.24); g.lineTo(b - 4.24, -b); g.lineTo(0, -2 * b + 4.24); g.lineTo(-b + 4.24, -b); g.closePath();
  g.fillStyle = grass; g.fill(); g.clip();
  for (let z = -2 * b; z < 0; z += 12) { g.fillStyle = ((z / 12) & 1) ? 'rgba(255,255,225,0.06)' : 'rgba(10,35,0,0.05)'; g.fillRect(-b, z, 2 * b, 12); }
  g.restore();
  // dirt around the bases and the mound
  g.fillStyle = C.dirt;
  for (const [x, z, r] of [[b, -b, 10], [0, -2 * b, 10], [-b, -b, 10], [0, -59, 9]]) { circle(x, z, r); g.fill(); }
  g.strokeStyle = 'rgba(90,55,28,0.3)'; g.lineWidth = 0.4; circle(0, -59, 9); g.stroke();
  // chalk
  g.strokeStyle = C.line; g.fillStyle = C.line; g.lineCap = 'butt'; g.lineJoin = 'miter';
  g.lineWidth = 0.5;
  g.beginPath(); g.moveTo(-spec.r[0] * S, -spec.r[0] * S); g.lineTo(0, 0); g.lineTo(spec.r[4] * S, -spec.r[4] * S); g.stroke();
  g.lineWidth = 0.33;
  for (const sx of [1, -1]) {
    g.strokeRect(sx > 0 ? 1.21 : -5.21, -3, 4, 6);                    // batter's boxes: 4 x 6 ft, 6 in off the plate
    g.save(); g.scale(sx, 1); g.rotate(-45 * D2R);                    // frame of the right-field line; the left side is its mirror
    g.strokeRect(80, 10, 20, 10);                                     // coaches' box: 20 ft long, 10 ft deep, 10 ft off the line
    g.restore();
    circle(sx * 28.8, 23.2, 2.5); g.stroke();                         // on-deck circle, 37 ft from the plate toward the dugout
  }
  g.strokeRect(-1.79, 3, 3.58, 6);                                    // catcher's box
  g.fillRect(-1, -61, 2, 0.5);                                        // pitcher's rubber
  g.beginPath(); g.moveTo(-0.71, -0.71); g.lineTo(0.71, -0.71); g.lineTo(0.71, 0); g.lineTo(0, 0.71); g.lineTo(-0.71, 0); g.closePath(); g.fill();   // home plate
  g.restore();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = aniso;
  return { tex, size, cx, cz };
}

const RM = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

export class ParkView {
  constructor(host) {
    this.host = host;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.lod = ParkView.detectLod(); this._applyLod();
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

  // 'low' on phones and small screens; window.__lod ('low' or 'high') overrides for tests.
  static detectLod() {
    const o = window.__lod; if (o === 'low' || o === 'high') return o;
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    return Math.min(window.innerWidth, window.innerHeight) < 600 ? 'low' : 'high';   // phones only; iPads and desktops get full detail
  }
  _applyLod() { this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.lod === 'low' ? 1.5 : 2)); }

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
    this.lod = ParkView.detectLod(); this._applyLod();
    const lod = this.lod, aniso = Math.min(this.renderer.capabilities.getMaxAnisotropy(), lod === 'low' ? 4 : 16);
    const G = (this.group = new THREE.Group()); this.scene.add(G);
    const detail = DETAILS[rec.id] || null;
    const cfg = Object.assign({ foulScale: 1, backstop: 58, skip: {}, colors: {} }, detail && detail.config ? detail.config(rec, { lod }) : {});
    const spec = (this.spec = fieldSpec(rec, cfg.wall));
    const parts = (this.parts = { poles: [], signs: [], outfieldSeats: [], lights: [], bases: [], aisles: [], rails: [] });
    const maxR = Math.max(...spec.r), cf = spec.r[2];
    const center = [0, -cf * 0.42];
    const f = clamp((rec.capacity - 10000) / 36000, 0, 1.25);
    const add = (geo, mat, parent = G) => { const m = new THREE.Mesh(geo, mat); parent.add(m); return m; };
    const lam = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide, ...extra });
    const iMat = { solid: new THREE.MeshLambertMaterial({ color: '#ffffff' }), glass: new THREE.MeshLambertMaterial({ color: '#b9d3dc', transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }) };

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
    const fld = paintField(spec, fieldPoly, rec, this.renderer.capabilities.maxTextureSize, lod, aniso);
    const plane = (parts.field = add(new THREE.PlaneGeometry(fld.size, fld.size).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: fld.tex })));
    plane.position.set(fld.cx, 0, fld.cz);
    // pitcher's mound: 18 ft across, 10 in high, flat top; rubber 60.5 ft from the plate
    const mound = add(new THREE.CylinderGeometry(4, 9, 0.83, 40), lam(C.dirt)); mound.position.set(0, 0.43, -59);
    const rubber = add(new THREE.BoxGeometry(2, 0.12, 0.5), lam('#f2ecd8')); rubber.position.set(0, 0.86, -60.75);
    // home plate: five-sided, 17 in wide, standing a hand's breadth above the dirt
    { const sh = new THREE.Shape(); [[-0.708, 0.708], [0.708, 0.708], [0.708, 0], [0, -0.708], [-0.708, 0]].forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y)));
      const plate = add(new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false }).rotateX(-Math.PI / 2), lam('#f7f1df')); plate.position.y = 0.01; parts.plate = plate; }
    const b = 90 * S;
    for (const [x, z] of [[b, -b], [0, -2 * b], [-b, -b]]) { const bag = add(new THREE.BoxGeometry(1.5, 0.3, 1.5), lam('#f7f1df')); bag.position.set(x, 0.15, z); bag.rotation.y = Math.PI / 4; parts.bases.push(bag); }

    // ---- materials
    const seatBase = cfg.colors.seat || (() => { const c = new THREE.Color(rec.colors[0]); const hsl = {}; c.getHSL(hsl); return hsl.l < 0.1 ? '#31503f' : mixHex(rec.colors[0], '#9a8c74', 0.2); })();
    const seatTex = seatRowTexture(this.renderer, lod);
    const era = cfg.colors.facade || (rec.opened >= 1960 && rec.opened <= 1991 ? C.slab : C.brick);
    const wallCol = cfg.colors.wall || C.wall, creamCol = cfg.colors.cream || C.cream;
    const M = [lam(wallCol), new THREE.MeshLambertMaterial({ map: seatTex, color: seatBase, side: THREE.DoubleSide }), lam(creamCol), lam(era), lam(mixHex(creamCol, '#000', 0.35))];
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
    // Deck sizes may vary along the bowl: lower.depth, upper.depth, upper.overhang and upper.rise accept a number or a
    // table [[t, value], ...] (t 0 = right-field end of the bowl path, 0.5 = behind home, 1 = left-field end; linear between rows).
    const lo = Object.assign({ depth: 60 + 50 * f, slope: 0.3, extent: [0, 1] }, cfg.lower);
    const N1 = bPts.length - 1, cut = (t0, t1) => { const a = Math.round(t0 * N1), b = Math.round(t1 * N1); return [bPts.slice(a, b + 1), bN.slice(a, b + 1), a, b]; };
    const tab = (v, t) => { if (!Array.isArray(v)) return v; if (t <= v[0][0]) return v[0][1]; for (let k = 1; k < v.length; k++) if (t <= v[k][0]) { const [ta, a] = v[k - 1], [tb, b] = v[k]; return a + ((b - a) * (t - ta)) / (tb - ta || 1); } return v[v.length - 1][1]; };
    const sL = lo.slope, dLg = (g) => tab(lo.depth, g / N1), lowTopg = (g) => 3.5 + sL * dLg(g);
    const dL = dLg(N1 / 2), lowTop = lowTopg(N1 / 2);
    { const [p, n, a] = cut(lo.extent[0], lo.extent[1]); parts.lowerDeck = add(sweepSolid(p, n, (i) => [[0, 0], [0, 3.5], [dLg(a + i), lowTopg(a + i)], [dLg(a + i), 0]], [WALL, SEAT, FACADE, -1], FACADE), M); }
    const hasUpper = cfg.hasUpper ?? rec.capacity > 22000;
    const up = Object.assign({ overhang: hasUpper ? 30 : 8, rise: 24, depth: hasUpper ? 40 + 55 * f : 24, slope: hasUpper ? 0.58 : 0.25, extent: hasUpper ? 0.26 + 0.14 * Math.min(1, f) : 0.2 }, cfg.upper);
    const sU = up.slope, dUg = (g) => tab(up.depth, g / N1), d0g = (g) => dLg(g) - tab(up.overhang, g / N1), h0g = (g) => 3.5 + sL * d0g(g) + tab(up.rise, g / N1);
    const dEndg = (g) => d0g(g) + dUg(g), hTopg = (g) => h0g(g) + sU * dUg(g);
    const d0 = d0g(N1 / 2), h0 = h0g(N1 / 2), dU = dUg(N1 / 2), dEnd = dEndg(N1 / 2), hTop = hTopg(N1 / 2);
    let maxDL = 0, maxDEnd = 0, maxHTop = 0; for (let g = 0; g <= N1; g++) { maxDL = Math.max(maxDL, dLg(g)); maxDEnd = Math.max(maxDEnd, dEndg(g)); maxHTop = Math.max(maxHTop, hTopg(g)); }
    const [ut0, ut1] = Array.isArray(up.extent) ? up.extent : [0.5 - up.extent, 0.5 + up.extent];
    const [uPts, uN, i0, i1] = cut(ut0, ut1);
    if (!cfg.skip.upperDeck) parts.upperDeck = add(sweepSolid(uPts, uN, (i) => { const g = i0 + i; return [[d0g(g), h0g(g) - 7], [d0g(g), h0g(g)], [dEndg(g), hTopg(g)], [dEndg(g), 0], [dLg(g), 0], [dLg(g), h0g(g) - 7]]; }, [CREAM, hasUpper ? SEAT : CREAM, FACADE, -1, SHADE, SHADE], FACADE), M);
    if (hasUpper && rec.roof === 'open' && !cfg.skip.canopy && !cfg.skip.upperDeck) {
      parts.canopy = add(sweepSolid(uPts, uN, (i) => { const e = dEndg(i0 + i), y = hTopg(i0 + i); return [[e - 24, y + 15], [e + 2, y + 18], [e + 2, y + 19.5], [e - 24, y + 16.5]]; }, [CREAM, CREAM, CREAM, CREAM], CREAM), M);
    }

    // ---- outfield seats, batter's eye, scoreboard
    const of = Object.assign({ depth: 25 + 55 * Math.min(1, f), slope: 0.45, spans: [[-45, -9], [9, 45]], eye: [-9, 9], eyeHeight: 44, eyeDepth: 26 }, cfg.outfield);
    const D = of.depth;
    const span = (a, bdeg) => { const ia = wallDeg.findIndex((d) => d >= a - 1e-6), ib = wallDeg.findIndex((d) => d >= bdeg - 1e-6); return [wallPts.slice(ia, ib + 1), wallN.slice(ia, ib + 1), wallDeg.slice(ia, ib + 1)]; };
    const ofSpans = [];
    for (const [a, bd, dep = D, slp = of.slope] of of.spans) {
      const [p, n, dg] = span(a, bd);
      if (p.length < 2) continue;
      ofSpans.push({ p, n, dg, dep, slp });
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

    // ---- seat details: aisles and rails (children of the deck they sit on), canopy ribs, dugouts, tarp
    const railTool = (pts, yAt, o = {}) => railGroup(pts, yAt, o, o.lod || lod, iMat);
    const aisleTool = (pts, nrm, prof, o = {}) => aisleGroup(pts, nrm, prof, o, o.lod || lod, iMat);
    const hang = (deck, grp, kind) => { if (!deck || !grp) return; deck.add(grp); parts[kind].push(grp); };
    const offPts = (p, n, d) => p.map((q, i) => [q[0] + n[i][0] * d, q[1] + n[i][1] * d]);
    {
      const [p, n, la] = cut(lo.extent[0], lo.extent[1]);
      hang(parts.lowerDeck, aisleTool(p, n, { d0: 0, h0: 3.5, d1: (fi) => dLg(la + fi), h1: (fi) => lowTopg(la + fi) }, { every: 24 }), 'aisles');
      hang(parts.lowerDeck, railTool(offPts(p, n, 0.4), () => 3.5, { height: 3.5 }), 'rails');
      if (parts.upperDeck) {
        hang(parts.upperDeck, aisleTool(uPts, uN, { d0: (fi) => d0g(i0 + fi), h0: (fi) => h0g(i0 + fi), d1: (fi) => dEndg(i0 + fi), h1: (fi) => hTopg(i0 + fi) }, { every: 26 }), 'aisles');
        hang(parts.upperDeck, railTool(uPts.map((q, i) => [q[0] + uN[i][0] * (d0g(i0 + i) + 0.4), q[1] + uN[i][1] * (d0g(i0 + i) + 0.4)]), (i) => h0g(i0 + i), { height: 3.5, glass: true, color: '#7d7a6c' }), 'rails');
      }
      ofSpans.forEach((sp, k) => {
        const mesh = parts.outfieldSeats[k], hAt = (fi) => { const i = Math.min(sp.dg.length - 2, Math.floor(fi)), u = fi - i; return wallH(spec, sp.dg[i]) * (1 - u) + wallH(spec, sp.dg[i + 1]) * u + 3; };
        hang(mesh, aisleTool(sp.p, sp.n, { d0: 4, h0: hAt, d1: 4 + sp.dep, h1: (fi) => hAt(fi) + sp.slp * sp.dep }, { every: 24 }), 'aisles');
        hang(mesh, railTool(offPts(sp.p, sp.n, 4.3), (i) => wallH(spec, sp.dg[i]) + 3, { height: 3.5 }), 'rails');
      });
    }
    // canopy: trusses on the underside (hanging from it) and columns down to the top row
    if (parts.canopy) {
      const acc = cumLen(uPts), tot = acc[acc.length - 1], list = [], col = mixHex(creamCol, '#000', 0.25), step = lod === 'low' ? 30 : 15;
      const Wp = (P, dd, y) => [P.x + P.nx * dd, y, P.z + P.nz * dd];
      for (let sv = step / 2; sv < tot; sv += step) {
        const P = pathAt(uPts, uN, acc, sv), e = dEndg(i0 + P.fi), y = hTopg(i0 + P.fi);
        const a = Wp(P, e - 24, y + 15), a2 = Wp(P, e - 24, y + 13.4), b2 = Wp(P, e + 2, y + 16.6), m = Wp(P, e - 11, y + 16.7);
        boxBetween(list, a2, b2, 0.5, 0.5, col); boxBetween(list, a2, m, 0.4, 0.4, col); boxBetween(list, m, b2, 0.4, 0.4, col); boxBetween(list, a, a2, 0.4, 0.4, col);
      }
      const cstep = lod === 'low' ? 80 : 40;
      for (let sv = cstep / 2; sv < tot; sv += cstep) { const P = pathAt(uPts, uN, acc, sv), e = dEndg(i0 + P.fi), y = hTopg(i0 + P.fi); boxAt(list, P.x + P.nx * (e - 1.5), y + 8.8, P.z + P.nz * (e - 1.5), 0, 1, 0, 1, 1, 17.6, col); }
      const ribs = makeInst(list, iMat.solid); parts.canopy.add(ribs); parts.canopyRibs = ribs;
    }
    // dugouts: a roofed bench box with a low front wall, in front of the lower deck on each baseline (about 120 ft long)
    if (!cfg.skip.dugouts && parts.lowerDeck) {
      const [, , la, lb] = cut(lo.extent[0], lo.extent[1]), geos = [];
      const alongOf = (sgn, q) => (sgn * q[0] - q[1]) * S;
      for (const sgn of [1, -1]) {
        let i0d = -1, i1d = -1;
        for (let i = la; i <= lb; i++) { const q = bPts[i], a = alongOf(sgn, q); if (sgn * q[0] > 0 && a >= 30 && a <= 150) { if (i0d < 0) i0d = i; i1d = i; } }
        if (i1d - i0d < 3) continue;
        const pp = bPts.slice(i0d, i1d + 1), nn = bN.slice(i0d, i1d + 1);
        geos.push(sweepSolid(pp, nn, () => [[0, 0], [0, 7.6], [-10, 7.6], [-10, 6.6], [-1, 6.6], [-1, 1.8], [-3.5, 1.8], [-3.5, 0]], new Array(8).fill(0), 0));
        geos.push(sweepSolid(pp, nn, () => [[-10, 0], [-10, 3], [-9.4, 3], [-9.4, 0]], new Array(4).fill(0), 0));
      }
      if (geos.length) parts.dugouts = add(mergeGeos(geos), M[SHADE], parts.lowerDeck);
    }
    // rolled tarp along the first-base wall, about 170 ft long
    if (!cfg.skip.tarp) {
      const lenR = spec.r[4], half = Math.floor(N1 / 2), alongR = (q) => (q[0] - q[1]) * S;
      const dB = lenR - 14, dA = Math.max(154, dB - 170);
      let iB = -1, iA = -1;
      for (let i = 0; i <= half; i++) { const a = alongR(bPts[i]); if (iB < 0 && a <= dB) iB = i; if (iA < 0 && a <= dA) { iA = i; break; } }
      if (iB >= 0 && iA > iB && dB - dA > 100) {
        const A = bPts[iA], B = bPts[iB], L = Math.hypot(B[0] - A[0], B[1] - A[1]), cx = (B[0] - A[0]) / L, cz = (B[1] - A[1]) / L;
        let nx = 0, nz = 0; for (let i = iB; i <= iA; i++) { nx += bN[i][0]; nz += bN[i][1]; }
        let px = cz, pz = -cx; if (px * nx + pz * nz < 0) { px = -px; pz = -pz; }
        let minS = 0; for (let i = iB; i <= iA; i++) minS = Math.min(minS, (bPts[i][0] - A[0]) * px + (bPts[i][1] - A[1]) * pz);
        const off = 2.2 - minS, tarp = add(new THREE.CylinderGeometry(1.5, 1.5, L, 24), lam('#7f93a1'));
        tarp.position.set((A[0] + B[0]) / 2 - px * off, 1.5, (A[1] + B[1]) / 2 - pz * off);
        tarp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(cx, 0, cz)); parts.tarp = tarp;
      }
    }

    // ---- lights: lattice masts with a lamp bank and catwalk (phone: a tapered mast and a flat bank with a lamp texture)
    if (rec.roof === 'open' && !cfg.skip.lights) {
      const spots = [];
      for (const tt of [0.16, 0.34, 0.66, 0.84]) { const i = Math.round(tt * (bPts.length - 1)); const inU = i >= i0 && i <= i1; const dd = inU ? dEndg(i) - 3 : dLg(i) - 3; spots.push([bPts[i][0] + bN[i][0] * dd, bPts[i][1] + bN[i][1] * dd, inU ? hTopg(i) : lowTopg(i)]); }
      for (const deg of [-33, 33]) { const r = wallR(spec, deg) + D + 2, a = deg * D2R; spots.push([r * Math.sin(a), -r * Math.cos(a), wallH(spec, deg) + 3 + 0.45 * D]); }
      const grp = new THREE.Group(); G.add(grp); parts.lights.push(grp);
      const H = 54, T = new THREE.Object3D(), tv = new THREE.Vector3(), lm = new THREE.Matrix4();
      if (lod === 'low') {
        const mast = new THREE.InstancedMesh(ungroup(new THREE.CylinderGeometry(0.9, 1.9, H, 6)), lam('#6d6558'), spots.length);
        const bank = new THREE.InstancedMesh(ungroup(new THREE.BoxGeometry(26, 12, 1.2)), new THREE.MeshLambertMaterial({ map: lampTexture(), color: '#ffffff' }), spots.length);
        spots.forEach(([x, z, base], i) => {
          T.position.set(x, 0, z); T.lookAt(0, 0, -cf * 0.4); T.updateMatrix();
          mast.setMatrixAt(i, lm.copy(T.matrix).multiply(new THREE.Matrix4().makeTranslation(0, base + H / 2, 0)));
          bank.setMatrixAt(i, lm.copy(T.matrix).multiply(new THREE.Matrix4().makeTranslation(0, base + H + 7, 0)));
        });
        grp.add(mast, bank);
      } else {
        const list = [], steel = '#6d6558', lampCol = '#efe6c0', frame = '#8a8068';
        spots.forEach(([x, z, base]) => {
          T.position.set(x, 0, z); T.lookAt(0, 0, -cf * 0.4); T.updateMatrix();
          const P = (lx, ly, lz) => tv.set(lx, base + ly, lz).applyMatrix4(T.matrix).toArray();
          const half = (y) => 3.0 - 1.5 * (y / H), n = 6;
          for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) boxBetween(list, P(sx * half(0), 0, sz * half(0)), P(sx * half(H), H, sz * half(H)), 0.55, 0.55, steel);   // legs
          for (let k = 0; k <= n; k++) {                                                                                               // rings and zig-zag bracing
            const y = (H * k) / n, w = half(y), c4 = [[w, w], [-w, w], [-w, -w], [w, -w]];
            for (let c = 0; c < 4; c++) boxBetween(list, P(c4[c][0], y, c4[c][1]), P(c4[(c + 1) % 4][0], y, c4[(c + 1) % 4][1]), 0.3, 0.3, steel);
            if (k < n) { const y2 = (H * (k + 1)) / n, w2 = half(y2), d4 = [[w2, w2], [-w2, w2], [-w2, -w2], [w2, -w2]];
              for (let c = 0; c < 4; c++) { const c2 = (c + 1) % 4, flip = (k + c) & 1; boxBetween(list, P(...(flip ? [c4[c][0], y, c4[c][1]] : [c4[c2][0], y, c4[c2][1]])), P(...(flip ? [d4[c2][0], y2, d4[c2][1]] : [d4[c][0], y2, d4[c][1]])), 0.25, 0.25, steel); } }
          }
          const zc = tv.set(0, 0, 1).transformDirection(T.matrix), zx = zc.x, zz = zc.z;
          const bx = (lx, ly, lz, sx, sy, sz, col) => { const c = tv.set(lx, base + ly, lz).applyMatrix4(T.matrix); boxAt(list, c.x, c.y, c.z, zx, 0, zz, sx, sy, sz, col); };
          bx(0, H + 0.2, 1, 30, 0.4, 5, frame);                       // catwalk
          bx(0, H + 3.2, 3.4, 30, 0.25, 0.25, steel);                 // catwalk rail
          bx(0, H + 7.6, 0, 27, 12, 1, frame);                       // lamp bank backing
          for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) bx(-11.2 + c * 3.2, H + 3.1 + r * 3.1, 0.9, 2.7, 2.5, 0.8, lampCol);
        });
        grp.add(makeInst(list, iMat.solid));
      }
    }

    // ---- roof
    this.roof = null;
    const roofY = Math.max(maxHTop + 55, 170), halfW = maxR * S + maxDL + 90, zBack = 62 + maxDEnd + 30, zFront = -(cf + D + 60);
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
        const rl = [], rc = mixHex(creamCol, '#000', 0.3), pd = depth + 4, rs = lod === 'low' ? 44 : 22;   // ribs hang under each panel and move with it
        for (let z = -pd / 2 + rs / 2; z < pd / 2; z += rs) boxAt(rl, 0, -3.1, z, 0, 0, 1, halfW * 2, 1.3, 1, rc);
        for (const fx of [-0.5, 0, 0.5]) boxAt(rl, fx * halfW, -3.6, 0, 0, 0, 1, 1.4, 1.8, pd, rc);
        panel.add(makeInst(rl, iMat.solid));
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
      pressbox: { pos: seatAt(ib, d0g(ib) + 4, h0g(ib) + 6), look: [0, 0, -170], label: 'Press Box' },
      home: { pos: [0, 5.6, 4], look: [0, 14, -300], walk: true, label: 'Home Plate' },
      mound: { pos: [0, 6.6, -57], look: [0, 3.5, 0], walk: true, label: 'Mound' },
      center: { pos: [0, 5.8, -cfR], look: [0, 6, 0], walk: true, label: 'Center Field' },
      upper: { pos: seatAt(iu, d0g(iu) + dUg(iu) * 0.6, h0g(iu) + sU * dUg(iu) * 0.6 + 4.5), look: [0, 0, -150], label: hasUpper ? 'Upper Deck' : 'Suite Level' },
      bleachers: { pos: [blR * Math.sin(blA), wallH(spec, -28) + 3 + 0.45 * D * 0.55 + 4.5, -blR * Math.cos(blA)], look: [0, 0, -40], label: 'Bleachers' },
    };
    for (const v of Object.values(this.views)) v.dir = dirFrom(v.pos, v.look);
    this.orbitTarget = new THREE.Vector3(0, 0, -cf * 0.45);

    // ---- hand-detailed additions (Phase 3)
    if (detail && detail.build) {
      const remove = (obj) => { if (!obj) return; (Array.isArray(obj) ? obj : [obj]).forEach((o) => { if (o && o.parent) o.parent.remove(o); }); };
      detail.build({
        THREE, G, rec, spec, cfg, parts, views: this.views, add, lam, remove, park: this,
        M, MAT: { WALL, SEAT, CREAM, FACADE, SHADE }, C,
        paths: { wallPts, wallDeg, wallN, bPts, bN, fieldPoly },
        dims: { f, maxR, cf, dL, sL, lowTop, d0, h0, dU, sU, dEnd, hTop, D, ofSlope: of.slope, i0, i1, halfW, zBack, zFront, roofY, N1,
          deckAt: { dL: dLg, lowTop: lowTopg, d0: d0g, h0: h0g, dU: dUg, dEnd: dEndg, hTop: hTopg } },
        lod,
        tools: { rail: railTool, aisles: aisleTool, sweepSolid, textTexture, normalsFor, insidePoly, mixHex, clamp, wallXZ, wallR, wallH, D2R, span, cut,
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
  toggleRoof() { if (!this.roof) return null; this.roofGoal = this.roofGoal ? 0 : 1; if (RM.matches) { this.roofT = this.roofGoal; this._placeRoof(); } return this.roofGoal === 1; }

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
    if (instant || RM.matches) { this.camera.position.copy(pos); c.target.copy(target); apply(); c.update(); this.tween = null; return; }
    c.enabled = false; c.minDistance = 0; c.maxDistance = Infinity; c.minPolarAngle = 0; c.maxPolarAngle = Math.PI;
    this.tween = { t: 0, p0: this.camera.position.clone(), t0: c.target.clone(), p1: pos, t1: target, done: apply };
  }

  start() { if (this.running) return; this.running = true; this.resize(); this.clock.getDelta(); const loop = () => { if (!this.running) return; this.frame(); this.raf = requestAnimationFrame(loop); }; loop(); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); this.keys.clear(); }

  frame() {
    const dt = Math.min(0.05, this.clock.getDelta()), c = this.controls;
    c.enableDamping = !RM.matches;
    if (this.tween && RM.matches) this.tween.t = 1;
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
    if (this.roof && RM.matches) this.roofT = this.roofGoal;
    if (this.roof && this.roofT !== this.roofGoal) { this.roofT = clamp(this.roofT + Math.sign(this.roofGoal - this.roofT) * dt / 3, 0, 1); this._placeRoof(); }
    this.renderer.render(this.scene, this.camera);
  }
}
