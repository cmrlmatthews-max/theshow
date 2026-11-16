// Detail module: Busch Stadium (III), St. Louis Cardinals (opened 2006). Units: feet.  Level 4 pass (photographs, heights, seating, boards).
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft, home plate = origin, +z behind home, -x left field):
//  - Gray canopy roof is one ribbon from the right-field end (385,-302) down the first-base side (outer edge x ~ 405-412 at
//    z -250..-110), around behind home (outer edge z ~ 226 at x=0, ~ 190 at x +-100) to a tip at about (-135,160);
//    width ~55 ft on the right, ~18 ft at the narrow neck near (360,-20), ~38-40 ft behind home.
//    A separate strip covers the third-base side: outer edge (-340,-232) -> (-284,-9), inner edge about 35-48 ft in, with a
//    slanted end whose far tip is at (-211,-314). Between the strip and the back tip (z -9..160 on the left) the stands are
//    uncovered (open seating, concourse behind).
//  - Gate pylons (brick towers, flat roofs seen from above, 38-50 ft square incl. coping), centres from the sheet, moved 8 ft
//    toward the field to undo the lean of tall objects: main gate (home side) towers at (-13,236) and (103,236) with the gate roof
//    between them at x 25..70; third-base gate towers (-283,58) and (-191,148) with the gate roof (-233,90); right-field gate towers
//    (342,54) and (264,139). Tower pairs are 115-130 ft apart on centre. Light-tower pairs stand just behind each of these six towers
//    (photo 1: two masts per tower, ~35 ft apart; photo 2 the same at the third-base gate; sheet shows the lattice cross-bars there).
//  - Distance from the foul edge to the facade along the bowl normal: ~205-225 ft on the first-base side (t 0-0.35), 180 behind home,
//    160-170 on the third-base side (t 0.55-0.8), 130 at t 0.95. Visible seat-band edges on the third-base side (lit): lower band ends
//    ~45-55 ft from the foul edge, upper band ends ~100-115 ft, then the roof strip / concourse.
//  - Outfield wall rounder than straight chords: r ~ 400 at +-21 deg, 383 at +-27, 355-360 at +-37-41. White bleacher blocks left-center
//    (x -225..-60, z -440..-370) and right-center (x 55..170, z -430..-390, with a second block behind z -470..-430 = the pavilion tier);
//    planted batter's eye (x -45..45, z -430..-405) with a pavilion behind it (z -510..-465).
// MEASURED FROM PHOTOGRAPHS (scale from the sheet: tower plan width 34-38 ft, see photo 1/2; a door/truck 6.3 ft in photo 1):
//  - Brick gate tower height: photo 1 height/width ratio 2.3-2.5 on a 36-38 ft face = 88-92 ft; photo 2 ratio 2.4-2.7 on 34 ft = 84-92 ft.
//    Used 88 ft + 5 ft cream cap.
//  - Brick facade parapet: photo 2, right wall 140 px against the tower 190 px at the same scale = 64-66 ft (cream cornice at 64-67).
//  - Roof outer edge: photo 2, edge sits about 8-12% above the tower top = ~100 ft; inner edge lower (photo 6: canopy underside slopes up
//    to the back) = 93 ft. Roof slab 4 ft thick.
//  - Light towers: photo 2, mast top is 1.7-1.85 x brick tower height = ~160 ft (lamp bank on top is 24 ft of that); crossbar just under the banks.
//  - Scoreboards: photos 5 and 8 (angular position against the 90 ft wide batter's eye): main board 120 ft wide, centred about 110-140 ft
//    right of the eye (right-centre field), bottom on top of the pavilion's red-brick back wall (wall ~18 ft in photo 5 = top at ~46-50 ft);
//    second board ~100 ft wide, 270 ft right of the eye.  Sizes 40x120 (main) and 15x80 display / 81 ft frame (out-of-town) from text
//    (Wikipedia; SVC article).  Upper-deck ribbon boards 150 ft each on first- and third-base fascia (SVC article).
//  - Roof support columns every ~46 ft stand 40% of the way from the inner to the outer roof edge (photo 6 shows slender columns under the canopy).
//  - Seat rows: lower deck 1.15 ft per 3 ft row (slope 0.38), upper 1.4 ft (0.46); outfield wall 8 ft (config).
// FROM TEXT SOURCES: posted distances 336/375/400/375/335, 8 ft wall (Wikipedia); red brick exterior with steel, gray upper-deck
//  canopy, Gate 3 behind third base is a large arching "bridge" modeled on the Eads Bridge (baseballparks.com, Wikipedia);
//  luxury suites on the second level, club level below the top terrace; rooftop deck on the center-field eye.
// STILL ESTIMATED: depth of each deck on the first-base side (the roof shades it on the sheet; split lower/upper from photo 5 only),
//  exact upper-deck back heights (86-88 ft first base, 76 home, 66 third base: row counts not possible from the photos),
//  roof truss form, window rhythm (22 ft bays), pylon positions along the plain facade, board bottom heights (48 and 40 ft),
//  second-board position, pavilion roof, sizes of back structures behind the boards.
const D2R = Math.PI / 180;
const CEN = [0, -110];                                  // plan center for "outward" tests

// ---- roof, from the sheet. Outer edge RF end -> behind home -> back-left tip, and the inward width at each station.
const P1_OUT = [[385, -302], [404, -262], [412, -200], [412, -155], [402, -110], [384, -60], [358, -20], [335, 18], [300, 65],
  [262, 108], [228, 140], [182, 172], [144, 192], [109, 208], [57, 222], [0, 226], [-48, 214], [-95, 195], [-135, 160]];
const P1_W = [0, 50, 50, 41, 30, 20, 18, 24, 32, 38, 40, 40, 40, 40, 40, 40, 40, 36, 24];
const P1_END = [300, -345];                              // inner point of the slanted right-field end
// third-base strip: [outer, inner] pairs, far end first
const L_PAIRS = [[[-340, -232], [-211, -314]], [[-336, -190], [-292, -212]], [[-325, -130], [-283, -130]], [[-300, -60], [-262, -60]],
  [[-284, -9], [-250, -18]]];
const GAP = [[-190, 115], [-240, 65], [-270, 25]];       // uncovered concourse wall on the left, from the back tip to the strip
const ROOF_YO = 100, ROOF_YI = 93, ROOF_T = 4;
const BRICK_H = 64, CORN = 3, BAND_TOP_OPEN = 72;
const TOWER_H = 88, TOWER_CAP = 5, LIGHT_H = 160, LIGHT_BANK = 24;

// gate towers (centres, see header). n = outward normal of the gate.
const GATES = [
  { name: 'main', a: [-13, 232], b: [103, 232], w: 36 },
  { name: 'third', a: [-277, 52], b: [-185, 142], w: 40 },
  { name: 'right', a: [336, 49], b: [258, 134], w: 40 },
];
// plain pylons along the facade (nearest facade sample is used): x, z
const PYLONS = [[407, -240], [410, -140], [366, -35], [182, 176], [-338, -225], [-332, -135], [-305, -45]];

// ---- helpers
const inwardN = (p, a, b) => {                           // inward unit normal of a polyline at p (between neighbors a and b)
  let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
  if (nx * (CEN[0] - p[0]) + nz * (CEN[1] - p[1]) < 0) { nx = -nx; nz = -nz; }
  return [nx, nz];
};
const inset = (pts, widths) => pts.map((p, i) => {
  const [nx, nz] = inwardN(p, pts[Math.max(0, i - 1)], pts[Math.min(pts.length - 1, i + 1)]);
  return [p[0] + nx * widths[i], p[1] + nz * widths[i]];
});
// resample a polyline at a fixed spacing -> [{x, z, nx, nz}] with outward normals
const resample = (pts, step) => {
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1], n = Math.max(2, Math.round(L / step)), out = [];
  for (let k = 0; k <= n; k++) {
    const s = (L * k) / n; let i = 1; while (i < pts.length - 1 && cum[i] < s) i++;
    const u = (s - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
    out.push({ x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, z: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u });
  }
  out.forEach((p, i) => {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
    let nx = b.z - a.z, nz = -(b.x - a.x); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
    if (nx * (p.x - CEN[0]) + nz * (p.z - CEN[1]) < 0) { nx = -nx; nz = -nz; }
    p.nx = nx; p.nz = nz;
  });
  return out;
};
const inGap = (x, z) => x < -128 && z > -5 && z < 168;     // facade samples with no roof above them
// first hit (distance) of a ray p + t*n with a polyline of [x,z]
const rayHit = (p, n, poly) => {
  let best = null;
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i], c = poly[i + 1], ex = c[0] - a[0], ez = c[1] - a[1], den = n[0] * ez - n[1] * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * n[1] - (a[1] - p[1]) * n[0]) / den;
    if (t > 0 && u >= 0 && u <= 1 && (best === null || t < best)) best = t;
  }
  return best;
};

export default {
  config() {
    const W = (deg, r) => ({ deg, r, h: 8 });
    return {
      // wall: rounder than straight chords between the posted corners (checked on the sheet)
      wall: [W(-45, 336), W(-38, 356), W(-31, 376), W(-22, 393), W(-11, 399), W(0, 400), W(11, 399), W(22, 393), W(31, 376), W(38, 356), W(45, 335)],
      foulScale: 1, backstop: 46,
      // depth tables: t 0 = right-field end, 0.5 = behind home, 1 = left-field end (see the header for the measurements)
      lower: { depth: [[0, 60], [0.08, 76], [0.2, 84], [0.32, 86], [0.42, 80], [0.5, 76], [0.6, 68], [0.7, 62], [0.8, 56], [0.9, 50], [1, 42]], slope: 0.38, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: [[0, 12], [1, 10]],
        rise: [[0, 12], [0.1, 16], [0.3, 17], [0.5, 16], [0.7, 15], [0.9, 12], [1, 10]],
        depth: [[0, 60], [0.08, 84], [0.2, 90], [0.32, 88], [0.42, 80], [0.5, 73], [0.6, 68], [0.7, 66], [0.8, 64], [0.9, 52], [1, 30]],
        slope: 0.46, extent: [0, 1],
      },
      outfield: { depth: 60, slope: 0.36, spans: [[-45, -34, 34, 0.4], [-34, -9, 62, 0.34], [9, 30, 76, 0.42], [30, 45, 36, 0.4]],
        eye: null, eyeHeight: 30, eyeDepth: 20 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#9a4a42', facade: '#a5543e', wall: '#2f4a3a', cream: '#e1d3ae' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views } = ctx;
    const { sweepSolid, clamp } = tools;
    const { bPts, bN } = paths;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const N1 = bPts.length - 1;
    const dk = dims.deckAt;

    ctx.remove(parts.canopy); ctx.remove(parts.lights); ctx.remove(parts.scoreboard); ctx.remove(parts.batterEye);

    // ---- materials
    const brickCol = '#a5543e', creamCol = '#e1d3ae', steelCol = '#4d585e', roofCol = '#7a868c', fasciaCol = '#4f5b61';
    const mats = {
      brick: lam(brickCol), pier: lam('#b2624a'), cream: lam(creamCol), steel: lam(steelCol), roof: lam(roofCol), fascia: lam(fasciaCol),
      dark: new THREE.MeshBasicMaterial({ color: '#2a3238', side: THREE.DoubleSide }), back: lam('#37424a'), panel: lam('#6b3b2e'),
      lampFrame: lam('#454e53'), lamp: new THREE.MeshBasicMaterial({ color: '#f1e9c8' }), concrete: lam('#a89f8a'),
      flagA: lam('#c9bb92'), flagB: lam('#b2503f'), pole: lam('#d8d2c0'), grate: lam('#2f383d'),
    };
    // ---- merged-geometry builder: every box/shape of one material becomes one draw call
    const BOXV = []; // unit box, non-indexed: [x,y,z,nx,ny,nz]
    {
      const f = [[1, 0, 0, [0, 1, 0], [0, 0, 1]], [-1, 0, 0, [0, 0, 1], [0, 1, 0]], [0, 1, 0, [0, 0, 1], [1, 0, 0]], [0, -1, 0, [1, 0, 0], [0, 0, 1]],
        [0, 0, 1, [1, 0, 0], [0, 1, 0]], [0, 0, -1, [0, 1, 0], [1, 0, 0]]];
      for (const [nx, ny, nz, a, b] of f) {
        const c = (s, t) => [nx * 0.5 + a[0] * s * 0.5 + b[0] * t * 0.5, ny * 0.5 + a[1] * s * 0.5 + b[1] * t * 0.5, nz * 0.5 + a[2] * s * 0.5 + b[2] * t * 0.5, nx, ny, nz];
        BOXV.push(c(-1, -1), c(1, -1), c(1, 1), c(-1, -1), c(1, 1), c(-1, 1));
      }
    }
    const builders = {};
    const B = (k) => (builders[k] || (builders[k] = { p: [], n: [] }));
    const tmp = new THREE.Object3D();
    const addBoxM = (k, m) => {                              // m: Matrix4 of a unit box
      const b = B(k), e = m.elements;
      const sx = Math.hypot(e[0], e[1], e[2]) || 1, sy = Math.hypot(e[4], e[5], e[6]) || 1, sz = Math.hypot(e[8], e[9], e[10]) || 1;
      for (const v of BOXV) {
        b.p.push(e[0] * v[0] + e[4] * v[1] + e[8] * v[2] + e[12], e[1] * v[0] + e[5] * v[1] + e[9] * v[2] + e[13], e[2] * v[0] + e[6] * v[1] + e[10] * v[2] + e[14]);
        b.n.push(e[0] / sx * v[3] + e[4] / sy * v[4] + e[8] / sz * v[5], e[1] / sx * v[3] + e[5] / sy * v[4] + e[9] / sz * v[5], e[2] / sx * v[3] + e[6] / sy * v[4] + e[10] / sz * v[5]);
      }
    };
    const addGeoM = (k, geo, m) => {                         // any geometry (indexed or not)
      const b = B(k), g = geo.index ? geo.toNonIndexed() : geo, P = g.attributes.position, Nn = g.attributes.normal, e = m.elements;
      for (let i = 0; i < P.count; i++) {
        const x = P.getX(i), y = P.getY(i), z = P.getZ(i), nx = Nn.getX(i), ny = Nn.getY(i), nz = Nn.getZ(i);
        b.p.push(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]);
        const sx = Math.hypot(e[0], e[1], e[2]) || 1, sy = Math.hypot(e[4], e[5], e[6]) || 1, sz = Math.hypot(e[8], e[9], e[10]) || 1;
        b.n.push(e[0] / sx * nx + e[4] / sy * ny + e[8] / sz * nz, e[1] / sx * nx + e[5] / sy * ny + e[9] / sz * nz, e[2] / sx * nx + e[6] / sy * ny + e[10] / sz * nz);
      }
    };
    // box at (x,y,z), size (sx,sy,sz), local +z toward the plan direction (nx,nz)
    const box = (k, x, y, z, sx, sy, sz, nx = 0, nz = 1) => {
      tmp.position.set(x, y, z); tmp.rotation.set(0, Math.atan2(nx, nz), 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); addBoxM(k, tmp.matrix);
    };
    // thin member from A to B (3D), cross-section (w,h)
    const beam = (k, A, Bp, w, h) => {
      tmp.position.set((A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2, (A[2] + Bp[2]) / 2);
      tmp.rotation.set(0, 0, 0); tmp.lookAt(Bp[0], Bp[1], Bp[2]);
      // lookAt on an Object3D points +z at the target; box length along local z
      tmp.scale.set(w, h, Math.hypot(Bp[0] - A[0], Bp[1] - A[1], Bp[2] - A[2])); tmp.updateMatrix(); addBoxM(k, tmp.matrix);
    };
    const archGeo = (w, h) => {
      const s = new THREE.Shape(), r = w / 2;
      s.moveTo(-r, 0); s.lineTo(-r, h - r); s.absarc(0, h - r, r, Math.PI, 0, true); s.lineTo(r, 0); s.closePath();
      const g = new THREE.ShapeGeometry(s, low ? 3 : 6); g.computeVertexNormals(); return g;
    };
    const archCache = {};
    const arch = (k, w, h, x, y, z, nx, nz) => {
      const key = w + 'x' + h; const g = archCache[key] || (archCache[key] = archGeo(w, h));
      tmp.position.set(x, y, z); tmp.rotation.set(0, Math.atan2(nx, nz), 0); tmp.scale.set(1, 1, 1); tmp.updateMatrix(); addGeoM(k, g, tmp.matrix);
    };
    // local frame at (cx,cz) with outward normal n: u along the facade, v outward
    const frame = (cx, cz, nx, nz) => {
      const ax = nz, az = -nx;                                // u axis = (cos, -sin) of yaw atan2(nx,nz)
      return {
        nx, nz, ax, az, cx, cz,
        W: (u, v) => [cx + ax * u + nx * v, cz + az * u + nz * v],
        box(k, u, y, v, su, sy, sv) { const p = this.W(u, v); box(k, p[0], y, p[1], su, sy, sv, nx, nz); },
        arch(k, w, h, u, y, v) { const p = this.W(u, v); arch(k, w, h, p[0], y, p[1], nx, nz); },
        beam(k, u0, y0, v0, u1, y1, v1, w, h) { const a = this.W(u0, v0), b = this.W(u1, v1); beam(k, [a[0], y0, a[1]], [b[0], y1, b[1]], w, h); },
      };
    };

    // =========================================================================================== roof ribbon
    const P1_IN = inset(P1_OUT, P1_W); P1_IN[0] = P1_END;
    const L_OUT = L_PAIRS.map((p) => p[0]), L_IN = L_PAIRS.map((p) => p[1]);
    const ribbon = (O, I) => {
      const slab = [], edge = [];
      const V = (p, y) => [p[0], y, p[1]];
      const quad = (arr, a, b, c, d) => arr.push(...a, ...b, ...c, ...a, ...c, ...d);
      for (let i = 0; i < O.length - 1; i++) {
        const o0 = V(O[i], ROOF_YO), o1 = V(O[i + 1], ROOF_YO), i0 = V(I[i], ROOF_YI), i1 = V(I[i + 1], ROOF_YI);
        const p0 = V(O[i], ROOF_YO - ROOF_T), p1 = V(O[i + 1], ROOF_YO - ROOF_T), q0 = V(I[i], ROOF_YI - ROOF_T), q1 = V(I[i + 1], ROOF_YI - ROOF_T);
        quad(slab, o0, o1, i1, i0); quad(slab, p0, p1, q1, q0);
        quad(edge, o0, o1, p1, p0); quad(edge, i0, i1, q1, q0);
      }
      for (const k of [0, O.length - 1]) quad(edge, V(O[k], ROOF_YO), V(I[k], ROOF_YI), V(I[k], ROOF_YI - ROOF_T), V(O[k], ROOF_YO - ROOF_T));
      const mk = (arr, mat) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.computeVertexNormals(); return ctx.add(g, mat); };
      mk(slab, mats.roof); mk(edge, mats.fascia);
    };
    ribbon(P1_OUT, P1_IN); ribbon(L_OUT, L_IN);

    const piece = (O, I) => {
      const cum = [0]; for (let i = 1; i < O.length; i++) cum.push(cum[i - 1] + Math.hypot(O[i][0] - O[i - 1][0], O[i][1] - O[i - 1][1]));
      const L = cum[cum.length - 1];
      return {
        L,
        at(s) {
          let i = 1; while (i < O.length - 1 && cum[i] < s) i++;
          const u = clamp((s - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1), 0, 1);
          const l = (a, b) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
          return { O: l(O[i - 1], O[i]), I: l(I[i - 1], I[i]) };
        },
      };
    };
    const pcs = [piece(P1_OUT, P1_IN), piece(L_OUT, L_IN)];
    // underside trusses (chords + diagonals), merged
    {
      const step = low ? 56 : 26;
      for (const pc of pcs) {
        const n = Math.max(2, Math.round(pc.L / step));
        for (let k = 0; k <= n; k++) {
          const { O, I } = pc.at((pc.L * k) / n);
          const yt = (y) => y - ROOF_T - 0.5;
          const A = [I[0], yt(ROOF_YI), I[1]], Bp = [O[0], yt(ROOF_YO), O[1]];
          const A2 = [I[0], yt(ROOF_YI) - 7, I[1]], B2 = [O[0], yt(ROOF_YO) - 7, O[1]];
          const mid = (P, Q, f) => [P[0] + (Q[0] - P[0]) * f, P[1] + (Q[1] - P[1]) * f, P[2] + (Q[2] - P[2]) * f];
          beam('steel', A, Bp, 1.1, 1.6); beam('steel', A2, B2, 1.1, 1.4);
          beam('steel', A, mid(A2, B2, 0.5), 0.8, 0.9);
          if (!low) beam('steel', mid(A2, B2, 0.5), Bp, 0.8, 0.9);
        }
      }
    }

    // =========================================================================================== facade
    const FAC_RAW = [...P1_OUT, ...GAP, ...L_OUT.slice().reverse()];
    const FAC = resample(inset(FAC_RAW, FAC_RAW.map(() => 4)), low ? 30 : 22);   // facade sits 4 ft inside the roof edge
    const facPts = FAC.map((p) => [p.x, p.z]), facN = FAC.map((p) => [p.nx, p.nz]);
    const open = (i) => inGap(FAC[i].x, FAC[i].z);
    const top = (i) => (open(i) ? BAND_TOP_OPEN : ROOF_YO - ROOF_T - 1);
    const nearest = (x, z) => { let b = 0, bd = 1e9; FAC.forEach((p, i) => { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; b = i; } }); return FAC[b]; };
    // brick base wall (parapet 64 ft) with brick/cream courses
    ctx.add(sweepSolid(facPts, facN, () => [[-1, 0], [-1, BRICK_H], [1.6, BRICK_H], [1.6, 0]], [MAT.FACADE, MAT.FACADE, MAT.FACADE, -1], MAT.FACADE), M);
    ctx.add(sweepSolid(facPts, facN, () => [[1.4, 0], [1.4, 5], [2.6, 5], [2.6, 0]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);        // base course
    ctx.add(sweepSolid(facPts, facN, () => [[1.5, 29], [2.4, 29], [2.4, 31.5], [1.5, 31.5]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M); // belt course between the two levels
    ctx.add(sweepSolid(facPts, facN, () => [[-1, BRICK_H], [3.8, BRICK_H], [3.8, BRICK_H + CORN], [-1, BRICK_H + CORN]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M); // cornice
    // dark steel band above the cornice up to the roof underside (open steel structure seen in photos 2 and 3)
    ctx.add(sweepSolid(facPts, facN, (i) => [[-3, BRICK_H + CORN], [-3, top(i)], [-1.5, top(i)], [-1.5, BRICK_H + CORN]], [0, 0, 0, -1], 0), mats.back);
    // bays: piers, lower rectangular windows, upper arcade arches, steel columns above the cornice
    FAC.forEach((p, i) => {
      box('pier', p.x + p.nx * 1.0, BRICK_H / 2, p.z + p.nz * 1.0, 3.4, BRICK_H, 2.4, p.nx, p.nz);
      if (i % 2 === 0) box('steel', p.x + p.nx * 1.2, (BRICK_H + CORN + top(i)) / 2, p.z + p.nz * 1.2, 1.5, top(i) - BRICK_H - CORN, 1.5, p.nx, p.nz);
      if (i < FAC.length - 1) {
        const q = FAC[i + 1], mx = (p.x + q.x) / 2, mz = (p.z + q.z) / 2, nx = p.nx + q.nx, nz = p.nz + q.nz, nl = Math.hypot(nx, nz) || 1;
        const ux = nx / nl, uz = nz / nl;
        if (!low || i % 2 === 0) box('dark', mx + ux * 1.75, 15, mz + uz * 1.75, 8.5, 13, 0.4, ux, uz);          // lower window
        arch('dark', 12, 26, mx + ux * 1.9, 33, mz + uz * 1.9, ux, uz);                                          // upper arcade arch
      }
    });

    // =========================================================================================== gate towers, gates, pylons
    const tower = (x, z, nx, nz, w, d, h, win) => {
      const cx = x, cz = z, f = frame(cx, cz, nx, nz);
      f.box('brick', 0, h / 2, 0, w, h, d);
      f.box('cream', 0, h + TOWER_CAP / 2, 0, w + 4, TOWER_CAP, d + 4);                 // cap
      f.box('cream', 0, h - 6, 0, w + 2, 2.4, d + 2);                                   // cornice band
      f.box('cream', 0, 5, 0, w + 3, 10, d + 3);                                        // base course
      if (win) {
        f.arch('dark', w * 0.34, 46, 0, 22, d / 2 + 0.2);                              // tall arched window (photo 1)
        if (!low) {
          for (const y of [32, 44, 56]) f.box('cream', 0, y, d / 2 + 0.4, w * 0.34, 0.9, 0.5);
          f.box('cream', 0, 44, d / 2 + 0.4, 0.9, 46, 0.5);
        }
      }
      return f;
    };
    const gateFrames = [];
    for (const g of GATES) {
      const dx = g.b[0] - g.a[0], dz = g.b[1] - g.a[1], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
      // outward normal: the one pointing away from the plan centre
      let nx = uz, nz = -ux; const mx = (g.a[0] + g.b[0]) / 2, mz = (g.a[1] + g.b[1]) / 2;
      if (nx * (mx - CEN[0]) + nz * (mz - CEN[1]) < 0) { nx = -nx; nz = -nz; }
      const fa = tower(g.a[0], g.a[1], nx, nz, g.w, 30, TOWER_H, true), fb = tower(g.b[0], g.b[1], nx, nz, g.w, 30, TOWER_H, true);
      // gate frame between the towers, local frame centred on the pair
      const gf = frame(mx, mz, nx, nz);
      // the frame's u axis may run opposite to a->b; keep the width symmetric so it does not matter
      const Wd = L - g.w - 2;
      const cols = Math.max(4, Math.round(Wd / 11)), sp = Wd / cols;
      const vF = 14;                                                                   // front plane of the frame (proud of tower centre line)
      gf.box('back', 0, 33, 2, Wd, 66, 1);                                            // dark back wall
      for (let k = 0; k <= cols; k++) gf.box('steel', -Wd / 2 + k * sp, 33, vF, 2.2, 66, 2.2);   // columns
      for (const y of [38, 66]) gf.box('steel', 0, y, vF, Wd, 3, 3.2);                 // girders
      gf.box('steel', 0, 52, vF, Wd, 1.4, 1.6);
      gf.box('panel', 0, 52, vF - 1.2, Wd, 24, 0.8);                                   // upper tier backing (muted brown)
      for (let k = 0; k < cols; k++) gf.arch('dark', sp - 2.4, 20, -Wd / 2 + (k + 0.5) * sp, 41, vF + 0.9);   // upper arcade
      gf.box('roof', 0, 68, vF - 6, Wd + 4, 2, 18);                                    // flat roof over the frame
      // big steel arch truss over the entry (two parallel ribs, Eads-bridge look)
      {
        const S = Wd * 0.8, a = S / 2, bH = 26, y0 = 10, nseg = low ? 8 : 14;
        for (const v of low ? [vF - 3] : [vF - 5, vF + 1]) {
          let prev = null, prevIn = null;
          for (let k = 0; k <= nseg; k++) {
            const ph = Math.PI * k / nseg, u = -a * Math.cos(ph), y = y0 + bH * Math.sin(ph);
            const uo = -(a + 3) * Math.cos(ph), yo = y0 + (bH + 3) * Math.sin(ph);
            if (prev) { gf.beam('steel', prev[0], prev[1], v, u, y, v, 1.4, 1.8); gf.beam('steel', prevIn[0], prevIn[1], v, uo, yo, v, 1.2, 1.4); }
            if (!low && k > 0 && k < nseg) gf.beam('steel', u, y, v, uo, yo, v, 0.8, 0.8);
            prev = [u, y]; prevIn = [uo, yo];
          }
        }
        if (!low) for (let k = 1; k < nseg; k++) { const ph = Math.PI * k / nseg; gf.box('steel', -a * Math.cos(ph), y0 + bH * Math.sin(ph), vF - 2, 0.8, 0.8, 6); }
        gf.box('grate', 0, y0 - 5, vF - 2, S + 8, 1.4, 12);                            // entry deck
      }
      gateFrames.push({ gf, fa, fb, nx, nz, ux, uz, g, mx, mz });
    }
    // plain pylons along the facade
    for (const [px, pz] of PYLONS) {
      const p = nearest(px, pz);
      tower(p.x + p.nx * 5, p.z + p.nz * 5, p.nx, p.nz, 28, 22, 80, !low);
    }

    // =========================================================================================== light towers (freestanding lattice pairs)
    {
      const lampPos = [];
      const mast = (f, u) => {
        const half = 4.5;
        for (const sx of [-1, 1]) for (const sv of [-1, 1]) f.box('steel', u + sx * half, (LIGHT_H - LIGHT_BANK) / 2, sv * half, 1.4, LIGHT_H - LIGHT_BANK, 1.4);   // legs
        const pan = low ? 24 : 12, nP = Math.floor((LIGHT_H - LIGHT_BANK) / pan);
        for (let k = 0; k <= nP; k++) {
          const y = k * pan + 0.5;
          f.box('steel', u, y, -half, 9, 0.9, 0.9); f.box('steel', u, y, half, 9, 0.9, 0.9);
          if (!low) { f.box('steel', u - half, y, 0, 0.9, 0.9, 9); f.box('steel', u + half, y, 0, 0.9, 0.9, 9); }
          if (!low && k < nP) { f.beam('steel', u - half, y, -half, u + half, y + pan, -half, 0.7, 0.7); f.beam('steel', u + half, y, half, u - half, y + pan, half, 0.7, 0.7); }
        }
        // lamp bank on top: frame + instanced-looking lamp grid (merged)
        const yb = LIGHT_H - LIGHT_BANK / 2;
        f.box('lampFrame', u, yb, 0, 22, LIGHT_BANK, 3.5);
        const rows = low ? 3 : 5, cols = low ? 4 : 6;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const ou = (c - (cols - 1) / 2) * (19 / cols), oy = (r - (rows - 1) / 2) * (LIGHT_BANK - 5) / rows;
          lampPos.push([f, u + ou, yb + oy, 1.6, 1.8, 1.4]);
        }
      };
      for (const gfr of gateFrames) for (const t of [gfr.g.a, gfr.g.b]) {
        const f = frame(t[0] - gfr.nx * 32, t[1] - gfr.nz * 32, -gfr.nx, -gfr.nz);  // pair stands ~32 ft behind the tower centre; lamps face the field
        mast(f, -17); mast(f, 17);
        const yc = LIGHT_H - LIGHT_BANK - 6;                                        // cross-girder just under the banks
        f.box('steel', 0, yc, 0, 26, 2, 2); f.box('steel', 0, yc - 7, 0, 26, 1.4, 1.4);
        if (!low) for (let k = 0; k < 6; k++) f.beam('steel', -13 + k * 4.3, yc - 7, 0, -13 + (k + 0.5) * 4.3 + 2, yc, 0, 0.7, 0.7);
        f.box('grate', 0, yc + 1.3, 0, 30, 0.6, 5);                                  // service walkway
      }
      for (const [f, u, y, sx, sy, sv] of lampPos) f.box('lamp', u, y, 2.2, sx, sy, sv);
    }

    // ---- roof support columns: slender steel columns between the roof's inner and outer edge, standing on the concourse deck
    {
      const step = low ? 90 : 46;
      for (const pc of pcs) {
        const n = Math.max(2, Math.round(pc.L / step));
        for (let k = 0; k <= n; k++) {
          const { O, I } = pc.at((pc.L * k) / n);
          const x = I[0] + (O[0] - I[0]) * 0.4, z = I[1] + (O[1] - I[1]) * 0.4;
          let bi = 0, bd = 1e9; for (let i = 0; i <= N1; i += 2) { const d = Math.hypot(bPts[i][0] - x, bPts[i][1] - z); if (d < bd) { bd = d; bi = i; } }
          const y0 = Math.min(dk.hTop(bi) - 1, 70), y1 = ROOF_YI - ROOF_T - 8 + (ROOF_YO - ROOF_YI) * 0.4;
          if (y1 - y0 > 6) box('steel', x, (y0 + y1) / 2, z, 1.8, y1 - y0, 1.8);
        }
      }
    }

    // =========================================================================================== concourse filler behind the upper deck
    {
      const dEndF = (g) => dk.dEnd(g), hTopF = (g) => dk.hTop(g);
      const dF = [];
      for (let i = 0; i <= N1; i++) dF.push(rayHit(bPts[i], bN[i], facPts));
      const idx = []; for (let i = 0; i <= N1; i += 2) idx.push(i); if (idx[idx.length - 1] !== N1) idx.push(N1);
      const pts = idx.map((i) => bPts[i]), nrm = idx.map((i) => bN[i]);
      const geo = sweepSolid(pts, nrm, (k) => {
        const i = idx[k], e = dEndF(i), f = (dF[i] === null ? e + 18 : dF[i]) - 1.5, h = hTopF(i) - 1;
        const fe = Math.max(f, e + 0.05);
        return [[e, 0], [e, h], [fe, h], [fe, 0]];
      }, [-1, 0, -1, -1], 0);
      ctx.add(geo, lam('#85796a'));
    }

    // =========================================================================================== ribbon boards on the upper fascia (150 ft each)
    {
      for (const [t0, t1] of [[0.10, 0.31], [0.69, 0.90]]) {
        const [p, n, a] = tools.cut(t0, t1);
        const geo = sweepSolid(p, n, (i) => { const g = a + i, d = dk.d0(g) - 0.25, h = dk.h0(g); return [[d, h - 5.8], [d, h - 3.2], [d + 0.5, h - 3.2], [d + 0.5, h - 5.8]]; }, [0, 0, 0, 0], 0);
        ctx.add(geo, mats.dark);
      }
    }

    // =========================================================================================== outfield features
    // batter's eye: planted green wall in front, two-level pavilion behind it with a rooftop deck
    {
      const [p, n] = tools.span(-8.5, 8.5);
      ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 30], [18, 30], [18, 0]], [MAT.WALL, MAT.WALL, MAT.WALL, -1], MAT.WALL), M);
      ctx.add(sweepSolid(p, n, () => [[1.4, 30], [1.4, 33], [17.5, 33], [17.5, 30]], [0, 0, 0, 0], 0), lam('#3f6542'));
      box('pv', 0, 19, -486, 92, 38, 36); box('pvroof', 0, 39.5, -486, 96, 3, 40); box('cream', 0, 42.5, -466, 96, 3.4, 0.6);
    }
    // ---- video boards: blank dark faces (plain line grid) in steel frames; positions from photos 5 and 8
    const gridTex = tools.textTexture((g, w, h) => {
      g.fillStyle = '#151c20'; g.fillRect(0, 0, w, h); g.strokeStyle = '#27333a'; g.lineWidth = 1;
      for (let x = 0; x <= w; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y <= h; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, 256, 128);
    const faceMat = new THREE.MeshBasicMaterial({ map: gridTex });
    const board = (cx, cz, w, h, y0, opts = {}) => {
      let nx = -cx, nz = -cz; const l = Math.hypot(nx, nz); nx /= l; nz /= l;
      const f = frame(cx, cz, nx, nz);
      const yc = y0 + h / 2, dpt = opts.depth || 12;
      // face
      const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), faceMat);
      const fp = f.W(0, 1.6); face.position.set(fp[0], yc, fp[1]); face.rotation.y = Math.atan2(nx, nz); G.add(face);
      // frame (4 members) and a plain cornice
      f.box('steel', 0, y0 - 1.5, 0.4, w + 5, 3, 5); f.box('steel', 0, y0 + h + 1.5, 0.4, w + 5, 3, 5);
      for (const s of [-1, 1]) f.box('steel', s * (w / 2 + 1.25), yc, 0.4, 2.5, h + 6, 5);
      f.box('steel', 0, y0 + h + 4.2, -2, w + 5, 2.4, 9);                            // top gantry
      // back structure: corner posts, top/bottom chords and X braces on the back and both ends
      const bv = -dpt;
      for (const s of [-1, 1]) {
        f.box('steel', s * (w / 2 - 1), yc, bv, 2.4, h + 3, 2.4);
        f.beam('steel', s * (w / 2 - 1), y0 - 1, 0, s * (w / 2 - 1), y0 + h + 1, bv, 1.2, 1.2);
        f.beam('steel', s * (w / 2 - 1), y0 + h + 1, 0, s * (w / 2 - 1), y0 - 1, bv, 1.2, 1.2);
      }
      f.box('steel', 0, y0, bv, w - 2, 2.4, 2.4); f.box('steel', 0, y0 + h, bv, w - 2, 2.4, 2.4);
      const nb = Math.max(3, Math.round(w / 30));
      for (let k = 0; k < nb; k++) {
        const u0 = -w / 2 + 1 + k * (w - 2) / nb, u1 = u0 + (w - 2) / nb;
        f.beam('steel', u0, y0, bv, u1, y0 + h, bv, 0.9, 0.9); f.beam('steel', u0, y0 + h, bv, u1, y0, bv, 0.9, 0.9);
        f.box('steel', u0, yc, bv, 1.4, h, 1.4);
      }
      // catwalks (front and back) with rails
      f.box('grate', 0, y0 - 3.4, 3.5, w + 2, 0.8, 4.5); f.box('steel', 0, y0 + 0.2, 5.6, w + 2, 0.5, 0.5); f.box('steel', 0, y0 - 1.2, 5.6, w + 2, 0.4, 0.4);
      f.box('grate', 0, y0 - 3.4, bv - 3.5, w + 2, 0.8, 4.5); f.box('steel', 0, y0 + 0.2, bv - 5.6, w + 2, 0.5, 0.5);
      // support legs from the base level up to the bottom of the board, with X bracing
      const legs = opts.legs || [-0.44, -0.15, 0.15, 0.44];
      const base = opts.base || 0;
      for (const s of legs) {
        f.box('steel', s * w, (y0 - 3.4 + base) / 2, -2, 4, y0 - 3.4 - base, 4);
        f.box('steel', s * w, (y0 - 3.4 + base) / 2, bv + 1, 3, y0 - 3.4 - base, 3);
      }
      if (!low) for (let k = 0; k < legs.length - 1; k++) {
        const u0 = legs[k] * w, u1 = legs[k + 1] * w;
        f.beam('steel', u0, base + 2, -2, u1, y0 - 4, -2, 1.1, 1.1); f.beam('steel', u1, base + 2, -2, u0, y0 - 4, -2, 1.1, 1.1);
      }
      return f;
    };
    // main video board (40 x 120 ft): right-centre, on the pavilion's brick back wall
    {
      const cx = 118, cz = -488;
      let nx = -cx, nz = -cz; const l = Math.hypot(nx, nz); nx /= l; nz /= l;
      const wall = frame(cx, cz - 14, nx, nz);
      wall.box('brick', 0, 24, 0, 150, 48, 24); wall.box('cream', 0, 49, 0, 152, 2.4, 26);          // brick back wall of the pavilion (top 50 ft)
      wall.box('pvroof', -4, 39, 36, 120, 1.6, 46);                                              // pavilion roof over the upper tier
      for (const s of [-0.45, -0.15, 0.15, 0.45]) wall.box('steel', s * 120, 19, 56, 1.4, 38, 1.4);
      board(cx, cz, 120, 40, 54, { base: 50, depth: 12, legs: [-0.46, -0.2, 0.2, 0.46] });
    }
    // out-of-town board (display 15 x 80, frame ~81 x 28) with a row of flagpoles on top
    {
      const cx = 262, cz = -426;
      const f = board(cx, cz, 81, 28, 44, { base: 0, depth: 9 });
      const nF = low ? 6 : 11;
      for (let k = 0; k < nF; k++) {
        const u = -36 + k * (72 / (nF - 1)), y = 44 + 28 + 5;
        f.box('pole', u, y + 8, -1.5, 0.5, 16, 0.5);
        f.box(k % 2 ? 'flagA' : 'flagB', u + 2.4, y + 13.5, -1.5, 4.6, 2.6, 0.3);
      }
    }

    // =========================================================================================== merged meshes out
    const matOf = { steel: mats.steel, pier: mats.pier, dark: mats.dark, brick: mats.brick, cream: mats.cream, back: mats.back, panel: mats.panel,
      roof: mats.roof, lampFrame: mats.lampFrame, lamp: mats.lamp, grate: mats.grate, flagA: mats.flagA, flagB: mats.flagB, pole: mats.pole,
      pv: lam('#8e9a9c'), pvroof: lam('#6f7a7e') };
    for (const [k, b] of Object.entries(builders)) {
      if (!b.p.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(b.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(b.n, 3));
      ctx.add(g, matOf[k] || mats.steel);
    }

    // ---- views
    const g3 = gateFrames.find((o) => o.g.name === 'third');
    views.gate = { pos: [g3.mx + g3.nx * 175, 26, g3.mz + g3.nz * 175], look: [g3.mx, 42, g3.mz], label: 'Gate 3' };
    views.roof = { pos: [330, 300, 330], look: [60, 70, 60], label: 'Roof' };
    views.stands = { pos: tools.foulAt(0.2, dims.d0 + dims.dU * 0.5, dims.h0 + dims.sU * dims.dU * 0.5 + 5).toArray(), look: [-40, 0, -170], label: 'Stands' };
  },
};
