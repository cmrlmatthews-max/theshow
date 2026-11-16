// Detail module: PNC Park, Pittsburgh Pirates (opened 2001). Units: feet. Home plate = origin, center field = -z.
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft; home plate and second base picked on the mosaic):
//  - Outfield wall line (outer edge of the warning track), by rays from home plate: LF corner r~337 at -42 deg, the wall
//    bends at -36 deg (r~372) and runs to the deep left-center bend near -15 deg (r~408), CF ~394, then curves in to the
//    right-field pole (r~314). The posted distances (325/383/399/375/320) are kept; corners moved by +3..+6 ft.
//  - Roof band (the flat light-gray strip around the back of the upper deck): outer edge 20 stations, inner edge 17
//    stations. It runs from the right end (430,-191), around the first-base side and behind home (z=198 outer, 174 inner,
//    so it is only 24 ft wide there), to a straight 150 ft run at x=-287 on the left-field side, and ends at z=-264.
//    The band is 24..38 ft wide. The bowl is lopsided: depth from the front of the seats to the roof inner edge is
//    ~170-190 ft on the first-base side, ~122 ft behind home and only ~70-80 ft on the left-field side.
//  - Right-field stand back line (river walk edge): (346,-195) -> (125,-428), ~95-105 ft behind the 21 ft wall.
//  - Rotundas (round towers): left-field gate (-284,-332) r~38, home-plate gate (34,295) r~40. Two stair towers by the band.
//  - Light-mast shadows on the left-field band: bases near (-110,75) and (-187,-25) on the band inner edge.
//  - Backstop 51 ft and the foul-side seat front line match the generic boundary (foulScale 1).
// FROM TEXT SOURCES (Wikipedia, MLB.com): distances 325/383/410 (deep LCF)/399/375/320; wall 6 ft LF, 10 ft CF, 21 ft RF;
//  Kasota limestone facade with exposed steel truss work and arches; two decks; highest seat 88 ft; 7 light towers
//  (~672 lamps); bullpens beyond the left-center wall; "four-level steel rotunda" gates; seats are green.
// LEVEL 4 (photographs 1-8 in refs/PIT, plus the sheet):
//  FACADE (photo 1, 2): the street facade is a three-level Kasota limestone base (arched gate level, two levels of slit windows,
//    belt courses, cornice), NOT a 93 ft stone wall. Above it the real park is open steel: a glazed upper-concourse band, big
//    steel columns, arched trusses and a flat dark canopy. Rebuilt that way (stone 46 ft; frame set back 7 ft; arch ribs).
//    Rotundas are round stone towers with a steel cone roof (kept). Press level behind home: cream box with a window ribbon
//    above the upper deck (photo 4, 8). Blank ribbon boards run along the upper-deck fascia (photo 3, 4, 5).
//  HEIGHTS: stone base 46 ft = 3 stories (gate level ~18, two upper levels ~14), counted against people and doors in photo 1
//    (about 2.8 px per ft at the wall). Roof outer edge 90 ft = 44 ft above the stone cornice in the same photo, plane of the
//    street facade. Roof inner edge 100 ft (roof band rise from the sheet width). Highest seat 88 ft (text) caps the rear stand
//    (90). Light-tower mast 72 ft above the roof edge + 24 ft lamp bank: tower height against the 46 ft stone wall in photo 1
//    and against the roof edge in photo 2 and 5 (+-15 ft). Board towers 96 ft on 30 ft stands (photo 3: tower is about 2.3 x the
//    board top). Seat rows: lower rise 0.4 per ft (1.2 ft per 3 ft row), upper 0.6 (about 1.8 ft per row), counted in photo 5.
//    Shadow check on the sheet: the batter's eye (about 40 ft from photo 7, wall = 10 ft) casts a ~39 ft shadow, so the ratio is
//    about 0.95 (+-0.2); the roof edge at 90 ft then should throw ~85 ft on the street side of the left-field band, which the
//    dark strip beside it (55-60 ft before it meets the next building) does not contradict. Low confidence; the photographs rule.
//  SEATING (sheet + photos 3, 4, 5): depth tables by t (0 right-field pole, 0.5 behind home, 1 left-field pole). Total bowl depth
//    to the roof inner edge from the sheet: 172-190 ft on the first-base side, 122 behind home, 70-80 on the left-field side.
//    Lower deck 70-84 ft on the first-base side, 56 behind home, 38 on the left-field side, 22 at the pole. Upper deck 50-56 ft
//    first base, 48 home, 30-34 left side, tapering at the pole. A rear stand (custom, with rows, aisles, rail) fills from the
//    upper deck to the roof edge; it reaches 90 ft. Upper deck spans t 0.01-0.95 (both sides, not just first base as before).
//  BOARDS (photo 3, 7): main video board in left-center above the stands (deg -28, 30 ft behind the wall, bottom 40 ft above the
//    field, 90 x 34 ft with side panels), plain name bar, steel frame, four posts with cross braces, rear truss and catwalk,
//    two flanking lamp towers. Out-of-town board flush on the right-center wall (deg 17-28, 10 ft, blank grid; photo 6). Flagpoles:
//    four on the right-field roof, three beside the board. All faces blank.
// ESTIMATED: facade bay rhythm (22 ft piers) and arch size, rotunda 78 ft, stair towers, rear-stand slope and seat counts,
//  depth split between lower and upper deck on the first-base side, board size and exact position, flagpole positions, light
//  tower positions other than the two measured on the left-field band, batter's eye size, ribbon board heights.
const D2R = Math.PI / 180;
const FS = 46, YO = 90, YI = 100;                         // stone facade height, roof outer / inner edge height
const ROOF_OUT = [[430, -191], [420, -168], [395, -127], [350, -45], [300, 27], [255, 88], [217, 136], [160, 178], [100, 193], [40, 198],
  [0, 198], [-50, 188], [-90, 150], [-125, 100], [-155, 65], [-180, 45], [-230, -27], [-287, -114], [-287, -200], [-282, -264]];
const ROOF_IN = [[398, -184], [377, -150], [345, -64], [300, -9], [240, 60], [195, 100], [150, 145], [100, 170], [40, 174], [0, 174],
  [-50, 165], [-90, 125], [-128, 45], [-190, -38], [-255, -124], [-248, -200], [-246, -258]];
const RF_BACK = [[346, -195], [285, -271], [212, -362], [157, -407], [125, -428]];
const LIGHTS = [[-187, -25], [-110, 75], [120, 166], [240, 60], [345, -64]];   // roof towers, snapped to the roof inner edge (the other two flank the left-field board)
const BOARD = { deg: -28, out: 30, w: 90, h: 34, y0: 40 };            // main video board above the left-center stands
const ROTUNDAS = [{ x: -284, z: -332, r: 38, h: 76 }, { x: 34, z: 295, r: 40, h: 80 }];
const STAIRS = [[-100, 178], [-232, 30]];

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
// subdivide a polyline so no segment is longer than step (original corners are kept)
const densify = (pl, step) => {
  const out = [pl[0]];
  for (let i = 1; i < pl.length; i++) {
    const a = pl[i - 1], b = pl[i], n = Math.max(1, Math.round(dist(a, b) / step));
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
  }
  return out;
};
// outward normals of a polyline (away from the point c)
const normalsOf = (pl, c) => pl.map((p, i) => {
  const a = pl[Math.max(0, i - 1)], b = pl[Math.min(pl.length - 1, i + 1)];
  let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
  if (nx * (p[0] - c[0]) + nz * (p[1] - c[1]) < 0) { nx = -nx; nz = -nz; }
  return [nx, nz];
});
// closest point on a polyline
const closest = (pl, p) => {
  let best = null, bd = 1e9;
  for (let i = 0; i < pl.length - 1; i++) {
    const [ax, az] = pl[i], [bx, bz] = pl[i + 1], ex = bx - ax, ez = bz - az;
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * ex + (p[1] - az) * ez) / (ex * ex + ez * ez)));
    const q = [ax + ex * t, az + ez * t], d = dist(p, q);
    if (d < bd) { bd = d; best = q; }
  }
  return best;
};
// distance from p along direction n to the first crossing of a polyline (null if none)
const rayHit = (p, n, pl) => {
  let best = null;
  for (let i = 0; i < pl.length - 1; i++) {
    const [ax, az] = pl[i], [bx, bz] = pl[i + 1], ex = bx - ax, ez = bz - az;
    const den = n[0] * ez - n[1] * ex; if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - p[0]) * ez - (az - p[1]) * ex) / den, u = ((ax - p[0]) * n[1] - (az - p[1]) * n[0]) / den;
    if (t > 0 && u >= 0 && u <= 1 && (best == null || t < best)) best = t;
  }
  return best;
};
// pick points at a fixed arc spacing along a polyline
const byArc = (pl, step, pad = 0) => {
  const out = []; let acc = pad;
  for (let i = 1; i < pl.length; i++) {
    const a = pl[i - 1], b = pl[i], L = dist(a, b);
    while (acc <= L) { const t = acc / L; out.push({ p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], t: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] }); acc += step; }
    acc -= L;
  }
  return out;
};

// Point on the line from corner A to corner B (used nowhere else; kept simple)
export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 325, h: 6 }, { deg: -42, r: 337, h: 6 }, { deg: -36, r: 372, h: 6 }, { deg: -24, r: 386, h: 6 }, { deg: -23.95, r: 386, h: 10 },
        { deg: -15, r: 410, h: 10 }, { deg: -9, r: 401, h: 10 }, { deg: 0, r: 399, h: 10 }, { deg: 9, r: 391, h: 10 }, { deg: 15, r: 382, h: 10 },
        { deg: 21, r: 375, h: 10 }, { deg: 24, r: 366, h: 10 }, { deg: 30, r: 347, h: 10 }, { deg: 30.05, r: 347, h: 21 }, { deg: 36, r: 334, h: 21 },
        { deg: 42, r: 325, h: 21 }, { deg: 45, r: 320, h: 21 },
      ],
      foulScale: 1,
      backstop: 51,
      // bowl depth by t (0 right-field pole, 0.5 behind home, 1 left-field pole), see the top comment
      lower: { depth: [[0, 70], [0.05, 78], [0.18, 84], [0.3, 82], [0.4, 72], [0.5, 56], [0.58, 42], [0.65, 38], [0.9, 38], [0.95, 30], [1, 22]], slope: 0.4, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: [[0, 8], [1, 6]], rise: [[0, 22], [0.5, 22], [0.6, 18], [1, 16]], slope: 0.6, extent: [0.01, 0.95],
               depth: [[0, 40], [0.05, 50], [0.18, 56], [0.3, 54], [0.4, 50], [0.5, 48], [0.58, 34], [0.65, 32], [0.9, 30], [0.95, 14], [1, 8]] },
      outfield: { depth: 34, slope: 0.45, spans: [[-45, -15, 34, 0.45], [20, 45, 95, 0.42]], eye: [-8, 12], eyeHeight: 38, eyeDepth: 30 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f4d3c', facade: '#cbbf9d', wall: '#2c4636', cream: '#e4d9bc' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, C, views } = ctx;
    const { sweepSolid, mixHex, wallR, wallH } = tools;
    const { bPts, bN } = paths;
    const lam = ctx.lam, spec = ctx.spec;
    const low = ctx.lod === 'low';
    const N1 = bPts.length - 1;
    const { i0, i1, deckAt } = dims;

    // palette: Kasota limestone, steel, roof metal, glass
    const LIME = '#cfc3a1', LIME_D = '#aa9f84', LIME_L = '#ddd3b6', STEEL = '#3f4543', ROOFC = '#b9b4a4', GLASS = '#56706c';
    const mLime = lam(LIME), mLimeD = lam(LIME_D), mLimeL = lam(LIME_L), mSteel = lam(STEEL), mRoof = lam(ROOFC), mGlass = lam(GLASS);
    const mDark = new THREE.MeshBasicMaterial({ color: '#2a312f', side: THREE.DoubleSide });
    const mWin = new THREE.MeshBasicMaterial({ color: '#33494a', side: THREE.DoubleSide });

    // ---------- helpers
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      if (!mats.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const Y = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), sc = new THREE.Vector3(), pos = new THREE.Vector3();
    // a square beam between two 3D points (instance matrix for a unit box)
    const beam = (a, b, t) => {
      v0.set(...a); v1.set(...b); const d = v1.clone().sub(v0), len = d.length() || 1e-3;
      q.setFromUnitVectors(Y, d.normalize()); pos.copy(v0).add(v1).multiplyScalar(0.5); sc.set(t, len, t);
      return new THREE.Matrix4().compose(pos, q, sc);
    };
    const geoOf = (P, I) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g; };
    // vertical wall strip along a point list, offset outward by off, from y0 to y1
    const wallStrip = (pts, nrm, off, y0, y1) => {
      const P = [], I = [];
      pts.forEach((p, i) => { const x = p[0] + nrm[i][0] * off, z = p[1] + nrm[i][1] * off; P.push(x, y0, z, x, y1, z); if (i) { const a = (i - 1) * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
      return geoOf(P, I);
    };
    // horizontal ribbon between two paired point lists (A at yA, B at yB)
    const ribbon = (A, B, yA, yB) => {
      const P = [], I = [];
      A.forEach((p, i) => { P.push(p[0], yA, p[1], B[i][0], yB, B[i][1]); if (i) { const a = (i - 1) * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
      return geoOf(P, I);
    };
    // arch-headed opening (unit width, height 1.12, origin at the base)
    const archGeo = (() => {
      const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0.5, 0.62); s.absarc(0, 0.62, 0.5, 0, Math.PI, false); s.lineTo(-0.5, 0);
      return new THREE.ShapeGeometry(s, low ? 4 : 8);
    })();
    const rectGeo = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const yaw = (n) => Math.atan2(n[0], n[1]);                 // plane faces outward along n
    // merge static meshes by material: bat(geometry, material[, matrix]) queues, flush() adds one mesh per material
    const queue = new Map();
    const bat = (geo, mat, mx) => {
      const g = geo.index ? geo.clone() : geo.clone(); if (mx) g.applyMatrix4(mx);
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!queue.has(mat)) queue.set(mat, []); queue.get(mat).push(g);
    };
    const boxQ = new Map();
    const instQ = (mat, mats) => { if (!boxQ.has(mat)) boxQ.set(mat, []); boxQ.get(mat).push(...mats); };
    const flush = () => { boxQ.forEach((mats, mat) => inst(boxGeo, mat, mats)); queue.forEach((list, mat) => {
      const P = [], Nn = [], I = []; let base = 0;
      list.forEach((g) => {
        const pa = g.attributes.position, na = g.attributes.normal;
        for (let i = 0; i < pa.count; i++) { P.push(pa.getX(i), pa.getY(i), pa.getZ(i)); Nn.push(na.getX(i), na.getY(i), na.getZ(i)); }
        if (g.index) for (let i = 0; i < g.index.count; i++) I.push(g.index.getX(i) + base); else for (let i = 0; i < pa.count; i++) I.push(base + i);
        base += pa.count;
      });
      const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); m.setAttribute('normal', new THREE.Float32BufferAttribute(Nn, 3)); m.setIndex(I);
      ctx.add(m, mat);
    }); };

    // ---------- 1. variable-depth rear stand: fills the gap between the generic decks and the measured roof inner edge
    const D = new Array(N1 + 1).fill(null), HB = new Array(N1 + 1).fill(0), inner = new Array(N1 + 1).fill(null);
    for (let i = 0; i <= N1; i++) {
      const hit = rayHit(bPts[i], bN[i], ROOF_IN);
      const zoneA = i >= i0 && i <= i1, ds = zoneA ? deckAt.dEnd(i) : deckAt.dL(i), hs = zoneA ? deckAt.hTop(i) : deckAt.lowTop(i);
      if (hit == null || hit > 230) { D[i] = null; HB[i] = hs; continue; }
      D[i] = Math.max(hit, ds + 0.5);
      HB[i] = Math.min(zoneA ? hs + 0.45 * (D[i] - ds) : hs + 0.5 * (D[i] - ds), 90);
      inner[i] = [bPts[i][0] + bN[i][0] * hit, bPts[i][1] + bN[i][1] * hit];
    }
    {
      const sec = (i) => {
        const zoneA = i >= i0 && i <= i1, ds = zoneA ? deckAt.dEnd(i) : deckAt.dL(i), hs = zoneA ? deckAt.hTop(i) : deckAt.lowTop(i);
        const d = D[i] == null ? ds + 0.5 : D[i], hb = D[i] == null ? hs : HB[i];
        return [[ds, hs], [d, hb], [d, 0], [ds, 0]];
      };
      const rear = ctx.add(sweepSolid(bPts, bN, sec, [MAT.SEAT, MAT.FACADE, -1, -1], MAT.FACADE), M);
      // aisles and a front rail on the custom rear stand (it is not a generic deck)
      const f = (fn) => (fi) => { const i = Math.min(N1 - 1, Math.max(0, Math.floor(fi))), u = fi - i; return fn(i) * (1 - u) + fn(i + 1) * u; };
      const sc = (i) => sec(i), from = i0 / N1, to = 0.98;
      rear.add(tools.aisles(bPts, bN, { d0: f((i) => sc(i)[0][0]), h0: f((i) => sc(i)[0][1]), d1: f((i) => sc(i)[1][0]), h1: f((i) => sc(i)[1][1]) }, { every: 26, from, to, lod: ctx.lod }));
      rear.add(tools.rail(bPts.map((q, i) => [q[0] + bN[i][0] * (sc(i)[0][0] + 0.4), q[1] + bN[i][1] * (sc(i)[0][0] + 0.4)]).slice(i0, i1 + 1), (i) => sc(i0 + i)[0][1], { height: 3, lod: ctx.lod }));
    }

    // ---------- 2. rear glass wall along the roof inner edge (tall on the left-field side, a low parapet over the upper deck)
    {
      const ids = []; for (let i = 0; i <= N1; i++) if (inner[i]) ids.push(i);
      const P = [], I = [], mull = [];
      ids.forEach((i, k) => {
        const [x, z] = inner[i]; P.push(x, HB[i], z, x, YI - 2, z);
        if (k && ids[k] - ids[k - 1] <= 2) { const a = (k - 1) * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
        if (k % (low ? 6 : 3) === 0 && YI - 2 - HB[i] > 20) mull.push([x, z, HB[i], bN[i]]);
      });
      bat(geoOf(P, I), mGlass);
      // mullions and columns (steel beams standing on the rear stand)
      const bm = [];
      ids.forEach((i, k) => {
        if (k % (low ? 6 : 3)) return;
        const [x, z] = inner[i]; bm.push(beam([x, HB[i], z], [x, YI - 2, z], 1.6));
      });
      instQ(mSteel, bm);
    }

    // ---------- 3. roof band: ribbon between the measured outer and inner edges, rafters underneath, fascia
    const ro = densify(ROOF_OUT, 14), rn = normalsOf(ro, [20, -120]);
    const ri = ro.map((p) => closest(ROOF_IN, p));
    {
      bat(ribbon(ro, ri, YO, YI), mRoof);                                  // top surface (slopes up toward the field)
      bat(ribbon(ro, ri, YO - 2.6, YI - 2.6), mSteel);                      // dark underside
      bat(wallStrip(ri, ro.map((_, i) => { const dx = ri[i][0] - ro[i][0], dz = ri[i][1] - ro[i][1], l = Math.hypot(dx, dz) || 1; return [dx / l, dz / l]; }), 0, YI - 7, YI + 0.8), mSteel); // inner fascia (girder)
      bat(wallStrip(ro, rn, 0.2, YO - 4, YO + 1.4), mLimeL);                 // outer parapet
      // rafters (steel beams from the facade to the inner girder) and a diagonal brace under each
      const raf = [], step = low ? 4 : 2;
      for (let i = 0; i < ro.length; i += step) {
        const a = ro[i], b = ri[i]; raf.push(beam([a[0], YO - 3.4, a[1]], [b[0], YI - 3.4, b[1]], 1.3));
        if (!low) { const m = [(a[0] + b[0]) / 2, (YO + YI) / 2 - 3.4, (a[1] + b[1]) / 2]; raf.push(beam([a[0], YO - 3.4, a[1]], [b[0], YI - 12, b[1]], 0.8)); }
      }
      instQ(mSteel, raf);
    }

    // ---------- 4. facade along the outer roof edge (pulled in 4 ft): three-story limestone base (gate level with arches,
    // two levels of slit windows), then an open steel frame with a glazed concourse band and arched trusses up to the roof
    {
      const fp = ro.map((p, i) => [p[0] - rn[i][0] * 4, p[1] - rn[i][1] * 4]), fn = rn;
      bat(wallStrip(fp, fn, 0, 0, FS), mLime);
      bat(wallStrip(fp, fn, 0.9, 0, 5), mLimeD);                            // plinth
      bat(wallStrip(fp, fn, 0.7, 18.5, 20), mLimeL);                        // belt courses between the three levels
      bat(wallStrip(fp, fn, 0.7, 32.5, 34), mLimeL);
      bat(wallStrip(fp, fn, 1.6, FS - 3, FS + 1.5), mLimeL);                // cornice and parapet
      bat(wallStrip(fp, fn, 1.6, FS - 4.4, FS - 3), mLimeD);
      // steel frame set back 7 ft behind the stone: glass band at the upper concourse, dark soffit under the roof
      const gp = fp.map((p, i) => [p[0] - fn[i][0] * 7, p[1] - fn[i][1] * 7]);
      bat(wallStrip(gp, fn, 0, FS + 2, FS + 20), mGlass);
      bat(wallStrip(gp, fn, 0.2, FS + 20, YO - 3), mDark);
      bat(wallStrip(fp, fn, 0.3, FS + 20, FS + 22), mSteel);                // fascia girder over the glass
      // bays: piers, arched gate openings, window slits (two levels)
      const sp = low ? 44 : 22, pierM = [], archM = [], winM = [], colM = [], archR = [];
      const st = byArc(fp, sp, 8);
      const nAt = (p) => { let bi = 0, bd = 1e9; fp.forEach((f, i) => { const d = dist(f, p); if (d < bd) { bd = d; bi = i; } }); return fn[bi]; };
      st.forEach(({ p }, k) => {
        const n = nAt(p), ry = yaw(n);
        pierM.push(mat4(p[0] + n[0] * 0.9, (FS + 1) / 2 - 2, p[1] + n[1] * 0.9, 3.2, FS - 3, 1.8, ry));
        if (k % 2 === 0) colM.push(beam([p[0] - n[0] * 4, FS, p[1] - n[1] * 4], [p[0] - n[0] * 4, YO - 3, p[1] - n[1] * 4], 2.2));   // steel column
      });
      for (let k = 0; k + 1 < st.length; k++) {
        const a = st[k].p, b = st[k + 1].p; if (dist(a, b) > sp * 1.6) continue;       // skip across corners of the end caps
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n = nAt(m), ry = yaw(n), w = dist(a, b) - 4;
        archM.push(mat4(m[0] + n[0] * 0.5, 0, m[1] + n[1] * 0.5, w * 0.82, 15.5, 1, ry));        // arched opening, ~17 ft high
        const t = [n[1], -n[0]];
        for (const sgn of [-1, 1]) {                                                    // two slit windows per bay and level
          const cx = m[0] + t[0] * sgn * w * 0.22 + n[0] * 0.5, cz = m[1] + t[1] * sgn * w * 0.22 + n[1] * 0.5;
          winM.push(mat4(cx, 22.5, cz, w * 0.2, 8.5, 1, ry));
          if (!low) winM.push(mat4(cx, 36.5, cz, w * 0.2, 8.5, 1, ry));
        }
        if (k % 2 === 0 && dist(a, st[Math.min(st.length - 1, k + 2)].p) < sp * 2.6) {  // arched truss spanning two bays
          const c = st[Math.min(st.length - 1, k + 2)].p, mm = [(a[0] + c[0]) / 2 - n[0] * 4, (a[1] + c[1]) / 2 - n[1] * 4];
          archR.push({ m: mm, r: dist(a, c) / 2 - 1, ry });
        }
      }
      instQ(mLimeL, pierM); inst(archGeo, mDark, archM); inst(rectGeo, mWin, winM); instQ(mSteel, colM);
      // steel arch ribs (half tori) between the columns, springing at the glass band
      const torus = new THREE.TorusGeometry(1, 0.055, 4, low ? 8 : 14, Math.PI);
      inst(torus, mSteel, archR.map(({ m, r, ry }) => mat4(m[0], FS + 22, m[1], r, Math.min(r, YO - 3 - FS - 22), r, ry + Math.PI / 2 * 0)));
      // end caps of the band (left-field end and right-field end)
      for (const [a, b] of [[ROOF_OUT[ROOF_OUT.length - 1], ROOF_IN[ROOF_IN.length - 1]], [ROOF_OUT[0], ROOF_IN[0]]]) {
        const L = dist(a, b), nx = (b[1] - a[1]) / L, nz = -(b[0] - a[0]) / L;
        bat(wallStrip([a, b], [[nx, nz], [nx, nz]], 0, 0, YO - 3), mLime);
      }
    }

    // ---------- 5. right-field stand back wall (river side) and its window rhythm
    {
      const bk = densify(RF_BACK, 14), bn = normalsOf(bk, [-30, -100]);
      const H = 72;
      bat(wallStrip(bk, bn, 0, 0, H), mLime);
      bat(wallStrip(bk, bn, 0.9, 0, 6), mLimeD);
      bat(wallStrip(bk, bn, 0.7, 34, 37), mLimeL);
      bat(wallStrip(bk, bn, 1.6, H - 4, H + 1), mLimeL);
      const winM = [], pierM = [];
      byArc(bk, low ? 44 : 22, 8).forEach(({ p }) => {
        let bi = 0, bd = 1e9; bk.forEach((f, i) => { const d = dist(f, p); if (d < bd) { bd = d; bi = i; } });
        const n = bn[bi], ry = yaw(n);
        pierM.push(mat4(p[0] + n[0] * 0.8, H / 2, p[1] + n[1] * 0.8, 3, H - 2, 1.6, ry));
        winM.push(mat4(p[0] + n[0] * 0.5 + 11 * 0, 14, p[1] + n[1] * 0.5, 0.01, 0.01, 1, ry));
        const t = [n[1], -n[0]];                                                // along the wall
        winM.push(mat4(p[0] + t[0] * 11 + n[0] * 0.5, 12, p[1] + t[1] * 11 + n[1] * 0.5, 12, 20, 1, ry));
        winM.push(mat4(p[0] + t[0] * 11 + n[0] * 0.5, 42, p[1] + t[1] * 11 + n[1] * 0.5, 12, 22, 1, ry));
      });
      instQ(mLimeL, pierM); inst(rectGeo, mWin, winM);
      // roof deck rail over the right-field stand (a thin dark parapet on the inner side is the wall itself)
    }

    // ---------- 6. light towers: lattice mast, catwalk, lamp bank facing the field (roof towers + two flanking the board)
    const towerLegs = [], towerLamps = [], towerPlates = [];
    const tower = (cx, cz, yb, H, bw, bh, focus = [0, 0, -140]) => {
      const b0 = 3, b1 = 1.5, corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      const bot = corners.map(([a, b]) => [cx + a * b0, yb, cz + b * b0]), top = corners.map(([a, b]) => [cx + a * b1, yb + H, cz + b * b1]);
      for (let k = 0; k < 4; k++) towerLegs.push(beam(bot[k], top[k], 1));
      const lv = low ? 2 : 5;
      for (let l = 0; l < lv; l++) {
        const t0 = l / lv, t1 = (l + 1) / lv, P = (k, t) => [bot[k][0] + (top[k][0] - bot[k][0]) * t, yb + H * t, bot[k][2] + (top[k][2] - bot[k][2]) * t];
        for (let k = 0; k < 4; k++) { const k2 = (k + 1) % 4; towerLegs.push(beam(P(k, t0), P(k2, t1), 0.5)); if (!low) towerLegs.push(beam(P(k, t1), P(k2, t1), 0.5)); }
      }
      const ang = Math.atan2(focus[0] - cx, focus[2] - cz), yT = yb + H + bh / 2 + 1.5, nx = Math.sin(ang), nz = Math.cos(ang), tx = nz, tz = -nx;
      towerPlates.push(mat4(cx + nx * 1.4, yT, cz + nz * 1.4, bw + 1.5, bh + 1.5, 1.6, ang));
      towerPlates.push(mat4(cx, yb + H + 0.6, cz, 6, 1.2, 6, ang));                  // catwalk deck under the bank
      const cols = low ? 3 : 6, rows = low ? 3 : 5;
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const u = (k - (cols - 1) / 2) * (bw / cols), vv = (r - (rows - 1) / 2) * (bh / rows);
        towerLamps.push(mat4(cx + tx * u + nx * 2.5, yT + vv, cz + tz * u + nz * 2.5, bw / cols * 0.8, bh / rows * 0.72, 0.8, ang));
      }
    };
    LIGHTS.forEach(([x0, z0]) => { const c = closest(ROOF_IN, [x0, z0]); tower(c[0], c[1], YI, 72, 28, 24); });
    // main video board (left-center, above the stands): position and the two flanking towers
    const bd = (() => {
      const a = BOARD.deg * D2R, r = wallR(spec, BOARD.deg) + BOARD.out, u = [Math.sin(a), -Math.cos(a)];
      return { x: r * u[0], z: r * u[1], u, t: [-u[1], u[0]], ry: Math.atan2(-u[0], -u[1]) };      // t runs along the board, ry faces home
    })();
    for (const sg of [-1, 1]) tower(bd.x + bd.t[0] * sg * (BOARD.w / 2 + 12), bd.z + bd.t[1] * sg * (BOARD.w / 2 + 12), 30, 96, 24, 20, [0, 0, 0]);
    instQ(mSteel, towerLegs); instQ(mSteel, towerPlates);
    inst(boxGeo, new THREE.MeshBasicMaterial({ color: '#e6dfc0' }), towerLamps);

    // ---------- 7. rotundas (round gate towers) and stair towers
    {
      const archM = [], ribs = [];
      for (const R of ROTUNDAS) {
        const { x, z, r, h } = R;
        bat(new THREE.CylinderGeometry(r, r, h, 16, 1, true).translate(x, h / 2, z), mLime);
        bat(new THREE.CylinderGeometry(r + 1.6, r + 1.6, 8, 16, 1, true).translate(x, 4, z), mLimeD);
        bat(new THREE.CylinderGeometry(r + 2.4, r + 2.4, 5, 16, 1, true).translate(x, h - 1, z), mLimeL);
        bat(new THREE.CylinderGeometry(r + 2.4, r + 2.4, 0.4, 16).translate(x, h + 1.5, z), mSteel);
        // steel umbrella roof: open cone plus radial ribs
        bat(new THREE.ConeGeometry(r + 2, 24, 16, 1, true).translate(x, h + 13.5, z), mSteel);
        for (let k = 0; k < (low ? 8 : 16); k++) { const a = (k / (low ? 8 : 16)) * Math.PI * 2; ribs.push(beam([x + Math.sin(a) * (r + 2), h + 1.5, z + Math.cos(a) * (r + 2)], [x, h + 27, z], 1.1)); }
        // arched windows in three rings
        const rings = low ? [14] : [14, 36, 58], nW = low ? 10 : 16;
        for (const y of rings) for (let k = 0; k < nW; k++) {
          const a = (k + 0.5) / nW * Math.PI * 2, n = [Math.sin(a), Math.cos(a)];
          archM.push(mat4(x + n[0] * (r + 0.4), y, z + n[1] * (r + 0.4), 7.5, 17, 1, yaw(n)));
        }
      }
      for (const [x, z] of STAIRS) {
        const r = 13, h = 58;
        bat(new THREE.CylinderGeometry(r, r, h, 12, 1, true).translate(x, h / 2, z), mLime);
        bat(new THREE.CylinderGeometry(r + 1.5, r + 1.5, 4, 12, 1, true).translate(x, h - 2, z), mLimeL);
        bat(new THREE.CylinderGeometry(r + 0.2, r + 0.2, 0.4, 12).translate(x, h, z), mSteel);
        bat(new THREE.ConeGeometry(r + 1.5, 9, 12).translate(x, h + 4.5, z), mSteel);
      }
      inst(archGeo, mDark, archM); instQ(mSteel, ribs);
    }

    // ---------- 8. scoreboards: main video board with frame, side panels, name bar, truss, catwalk; out-of-town board; flagpoles
    {
      const grp = new THREE.Group(); grp.position.set(bd.x, 0, bd.z); grp.rotation.y = bd.ry; G.add(grp);   // local +z faces home, +x along the board
      const { w, h, y0 } = BOARD, fw = 12, rw = 14, cw = w - fw - rw, cx0 = (rw - fw) / 2 * 0;
      const faceGrid = (cols, rows, c1, c2) => ctx.tools.textTexture((g, W, H) => {
        g.fillStyle = c1; g.fillRect(0, 0, W, H); g.strokeStyle = c2; g.lineWidth = 2;
        for (let i = 1; i < cols; i++) { g.beginPath(); g.moveTo(W * i / cols, 0); g.lineTo(W * i / cols, H); g.stroke(); }
        for (let j = 1; j < rows; j++) { g.beginPath(); g.moveTo(0, H * j / rows); g.lineTo(W, H * j / rows); g.stroke(); }
      }, 256, 128);
      const mFace = new THREE.MeshBasicMaterial({ map: faceGrid(32, 12, '#1b2422', '#26312e') });
      const mFace2 = new THREE.MeshBasicMaterial({ map: faceGrid(8, 12, '#1d2624', '#2a3532') });
      grp.updateMatrix();
      const eul = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), qq = new THREE.Quaternion();
      // steel parts are merged into the shared steel mesh; textured faces stay separate children of the group
      const put = (geo, mat, x, y, z, rz = 0) => { qq.setFromEuler(eul.set(0, 0, rz)); bat(geo, mat, grp.matrix.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), qq, one))); };
      const putTex = (geo, mat, x, y, z) => { const m = ctx.add(geo, mat, grp); m.position.set(x, y, z); return m; };
      // frame: back box, face panels, rim
      put(new THREE.BoxGeometry(w + 4, h + 4, 6), mSteel, 0, y0 + h / 2, 0);
      putTex(new THREE.PlaneGeometry(cw, h - 3), mFace, (fw - rw) / 2 * -1 * 0 + (rw - fw) / 2 * 0 - (rw - fw) / 2 + 0, y0 + h / 2, 3.1);
      putTex(new THREE.PlaneGeometry(fw - 1, h - 3), mFace2, -w / 2 + fw / 2 + 0.5, y0 + h / 2, 3.1);
      putTex(new THREE.PlaneGeometry(rw - 1, h - 3), mFace2, w / 2 - rw / 2 - 0.5, y0 + h / 2, 3.1);
      // name bar above the board: plain text only
      const barTex = ctx.tools.textTexture((g, W, H) => { g.fillStyle = '#242c2a'; g.fillRect(0, 0, W, H); g.fillStyle = '#d8cfae'; g.font = 'bold 74px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PNC PARK', W / 2, H / 2 + 4); }, 512, 96);
      put(new THREE.BoxGeometry(46, 7, 3), mSteel, -4, y0 + h + 5.5, 0);
      putTex(new THREE.PlaneGeometry(44, 6), new THREE.MeshBasicMaterial({ map: barTex }), -4, y0 + h + 5.5, 1.7);
      // support: four steel posts down to the stand, cross braces, rear truss with a catwalk along the bottom
      for (const sx of [-0.42, -0.14, 0.14, 0.42]) put(new THREE.BoxGeometry(3, y0 + 2, 3), mSteel, w * sx, (y0 + 2) / 2 - 1, -4);
      for (const sx of [-0.28, 0, 0.28]) {
        put(new THREE.BoxGeometry(1.2, y0 * 1.1, 1.2), mSteel, w * sx - 6, y0 / 2, -5, 0.5);
        put(new THREE.BoxGeometry(1.2, y0 * 1.1, 1.2), mSteel, w * sx + 6, y0 / 2, -5, -0.5);
      }
      put(new THREE.BoxGeometry(w + 2, 1, 7), mSteel, 0, y0 - 1, -3);                        // catwalk deck
      put(new THREE.BoxGeometry(w + 2, 0.5, 0.5), mSteel, 0, y0 + 3, 2);                      // catwalk rail
      put(new THREE.BoxGeometry(w - 6, 1.6, 8), mSteel, 0, y0 + h + 3, -5);                   // top rear girder
      for (let k = 0; k < (low ? 3 : 7); k++) { const x = (k / (low ? 2 : 6) - 0.5) * (w - 8); put(new THREE.BoxGeometry(1.2, h + 2, 1.2), mSteel, x, y0 + h / 2 + 1, -7); }
      // out-of-town board: a flush dark panel with a plain line grid on the right-center wall, 10 ft high, between 17 and 28 degrees
      const sa = 17, sb = 28, pts = [];
      for (let k = 0; k <= 6; k++) { const dg = sa + (sb - sa) * k / 6, rr = wallR(spec, dg) - 0.5, an = dg * D2R; pts.push([rr * Math.sin(an), -rr * Math.cos(an)]); }
      const nrm = pts.map(([x, z]) => { const l = Math.hypot(x, z); return [-x / l, -z / l]; });
      ctx.add(wallStrip(pts, nrm, 0.15, 1.5, 9.3), new THREE.MeshBasicMaterial({ map: faceGrid(14, 4, '#33503f', '#6a8672'), side: THREE.DoubleSide }));
      bat(wallStrip(pts, nrm, 0.12, 9.3, 10), mSteel);
      // flagpoles: a cluster of four on the right-field roof and three on the left-field stands next to the board
      const poles = [[300, -230], [307, -222], [314, -214], [321, -206]].map(([x, z]) => [x, z, YO + 38]).concat(
        [-1, 0, 1].map((k) => [bd.x - bd.t[0] * (BOARD.w / 2 + 34) - bd.u[0] * 4 + k * 5, bd.z - bd.t[1] * (BOARD.w / 2 + 34) - bd.u[1] * 4 + k * 3, 80]));
      const pb = [], flag = [];
      poles.forEach(([x, z, top], i) => {
        const yb = i < 4 ? YO - 2 : 28; pb.push(mat4(x, (yb + top) / 2, z, 0.9, top - yb, 0.9));
        flag.push(mat4(x + 4.2, top - 3, z, 8, 5, 0.3, i * 0.4));
      });
      instQ(mSteel, pb); inst(boxGeo, lam('#a64a3c'), flag);
      // bullpens behind the left-center wall: two sunken clay strips
      for (const [dg, ww] of [[-21, 70], [-12, 70]]) {
        const rr = wallR(spec, dg) + 14, aa = dg * D2R, px = rr * Math.sin(aa), pz = -rr * Math.cos(aa);
        const pen = ctx.add(new THREE.PlaneGeometry(ww, 24).rotateX(-Math.PI / 2), lam('#a98a62')); pen.position.set(px, 0.3, pz);
      }
    }

    // ---------- 8b. press level behind home (cream box with a ribbon of windows), blank ribbon boards on the upper-deck fascia
    {
      const ids = []; for (let i = 0; i <= N1; i++) if (inner[i] && Math.abs(inner[i][0]) < 95 && inner[i][1] > 120) ids.push(i);
      if (ids.length > 3) {
        const pp = ids.map((i) => inner[i]), nn = ids.map((i) => [-bN[i][0], -bN[i][1]]);     // normals point toward the field
        const yb = Math.max(...ids.map((i) => HB[i])) + 1;
        bat(wallStrip(pp, nn, 0.4, yb, YI - 4), mLimeL);
        bat(wallStrip(pp, nn, 0.6, yb + 6, yb + 15), mWin);
        bat(wallStrip(pp, nn, 0.8, yb + 15, yb + 16.2), mLimeD);
      }
      if (!low) {
        const ids2 = []; for (let i = i0 + 2; i <= i1 - 2; i++) ids2.push(i);
        const pts = ids2.map((i) => [bPts[i][0] + bN[i][0] * (deckAt.d0(i) + 0.25), bPts[i][1] + bN[i][1] * (deckAt.d0(i) + 0.25)]);
        const P = [], I = [];
        ids2.forEach((i, k) => { const [x, z] = pts[k]; P.push(x, deckAt.h0(i) - 5.5, z, x, deckAt.h0(i) - 2.5, z); if (k) { const a = (k - 1) * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
        bat(geoOf(P, I), mDark);
      }
    }

    flush();

    // ---------- 9. remove generic parts that conflict, add views
    if (parts.scoreboard) ctx.remove(parts.scoreboard);
    views.gate = { pos: [70, 34, 420], look: [10, 50, 230], label: 'Home Gate' };
    views.board = { pos: [90, 60, -170], look: [bd.x, 60, bd.z], label: 'Main Board' };
    views.roof = { pos: [262, 98, 8], look: [-170, 100, -60], label: 'Roof & Lights' };
    // the generic 'upper' stop sits at t=0.6, where this park has no deep upper deck: move it to the first-base side upper deck
    { const p = ctx.tools.foulAt(0.3, dims.d0 + dims.dU * 0.6, dims.h0 + dims.sU * dims.dU * 0.6 + 4.5); views.upper = { pos: [p.x, p.y, p.z], look: [0, 0, -150], label: 'Upper Deck' }; }
    { const p = ctx.tools.foulAt(0.74, 30, 44); views.stands = { pos: [p.x, p.y, p.z], look: [140, 36, -250], label: 'Right Field' }; }
  },
};
