// Detail module: Petco Park, San Diego Padres (opened 2004). Units: feet.
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft, home plate = origin, centre field = -z):
//  - Outfield wall (outer edge of the warning track, colour mask along rays): CF ~398 ft, left-centre bulge ~391 ft at -12 deg,
//    long straight right-centre diagonal from (13 deg, ~397) to (38 deg, ~340), RF corner jog at x ~222, LF corner (-209,-257).
//  - Foul-side seat front only ~47 ft from the line near home (x +-47 at z=0), backstop edge at z ~ +38.
//  - Roof ("sail") outer edge, 35 stations (right end (356,-246) -> behind home (0,194) -> left end (-318,-250)); band 30 ft wide
//    on the arc, 28 ft on the left, 10-12 ft white lip at both ends. Seat front to roof edge: ~155 ft behind home, ~145 ft on
//    the left, ~205 ft on the right-field side.
//  - Seating bowl (level-4 pass; rays normal to the foul line, every 0.1 of the bowl, 10 ft ticks on a 3.3 px/ft zoom): sunlit
//    lower-deck rows run 0-72 ft at the right-field pole, ~100 ft from t 0.2 to 0.35 (right side), shrink to ~55 ft behind home
//    (only ~25-35 ft of rows are lit there; the rest is roof shadow, so 56 is an estimate), ~85 ft on the third-base side and ~64 ft
//    at the left-field pole. The upper tier ends at the roof inner edge (125 ft behind home, ~158 ft right side).
//  - Western Metal Supply Co. footprint x -340..-211, z -347..-247 (SE corner = left-field foul pole); a sandstone block with a flat
//    tan roof x -296..-249, z -406..-349 (north of it); left-field board: long side parallel to the left-centre wall, centre
//    ~(-171,-403), ~140 ft long (white steel bar on the sheet), angle ~38 deg from the x axis.
//  - Two end towers (base ~ (235,74) right, (-137,86) left); batter's eye x -30..+48 at the wall; right-field terrace to ~135 ft
//    behind the wall; bullpen lawn x -115..-47, z -448..-394; park-at-the-park lawn x 60..210, z -640..-470.
// MEASURED FROM PHOTOGRAPHS (scale from a known size in the same plane; px/ft derived each time):
//  - Western Metal Supply Co. (photo 4, 6): four stacked floors (cream slab edges at ~15, 32, 47 ft above the wall; 7 ft wall as the
//    scale, 14-16 ft floors as a check) + a dark name band 57-69 ft + parapet 71 ft + roof deck pavilions to ~78 ft. Brick with
//    lighter piers; the three field-side floors step out on balconies. The name is painted on the real band (photos 4 and 6).
//  - Sandstone block north of it (photo 1, photo 2): 7 slit windows one landing apart (~7 ft) -> about 56 ft; flat roof, a lower
//    stair annex.
//  - End towers (photo 4, photo 7): roof edge and tower top compared on the same horizon -> tower body/roof edge = 1.3 to 1.45 ->
//    body 134 ft, lamp bank top ~158 ft; sandstone, ~40 x 30 ft, slit windows near the top.
//  - Left-field board (photo 3, photo 6, photo 1): WMSC floor pitch (14 ft) gave 2 px/ft at the corner, 4.6 px/ft at the board (distance
//    ratio 0.78). Lower row of three panels 115-124 ft wide (side panels 33 x 43 ft, centre video 50 x 33 ft + ribbon), main score
//    board 75 x 35 ft above it, two 12 x 38 ft banner panels beside it, bottom of the lower row ~48 ft (terrace seat top 40 ft + walk).
//    Photo 1 shows the back: a grey banner wall with three panels, two white columns and a catwalk, a lamp frame to ~172 ft.
//  - Batter's eye (photo 3): about 38 ft high, dark block with planter strips on the top corners.
// SHADOW METHOD: all shadows on the sheet fall toward -x (west, slightly north). Ratio estimate from the sandstone block (shadow >=33 ft,
//  shorter than 54 ft where it reaches the street light) and from the left tower (~90 ft) is 0.6-0.8 (sun elevation 50-60 deg), but no
//  object of known height is on the sheet, so no height rests on it; it only agrees with the photo values above.
// FROM TEXT SOURCES (Wikipedia, MLB.com, Stone World, Populous): posted distances 336/386/396/391/322, wall 4/7/8 ft, Indian
//  sandstone + stucco facade, white-painted exposed steel, dark blue seats, solar roof panels, Western Metal Supply Co. building built
//  into the park, 61 x 124 ft left-field video board, bullpens behind centre field.
// STILL ESTIMATED: facade height 88 ft and roof 104/98 ft (consistent with the photo ratios, not measured), deck slopes, aisle/pier
//  rhythm, gate positions, light-frame positions on the roof (from photos 4, 6, 7, not surveyed), the roof's under-structure, lawn
//  heights, the back of the left-field board (layout only), the exact lower-row bottom height of the board.
// NOT BUILT: right-field board (photographs show none), flagpoles (none clearly shown), ribbon boards on the deck fascias.
const D2R = Math.PI / 180;

// Roof outer edge, right-field end -> behind home -> left-field end: [x, z, band width]
const ROOF = [[356, -246, 10], [373, -200, 10], [378, -140, 12], [374, -110, 28], [357, -80, 30], [338, -40, 30], [318, 0, 30],
  [292, 28, 30], [264, 59, 30], [240, 82, 30], [215, 104, 30], [195, 128, 30], [170, 153, 30], [149, 165, 30], [131, 174, 30],
  [100, 189, 30], [70, 192, 30], [40, 197, 30], [0, 194, 30], [-26, 186, 30], [-50, 176, 30], [-68, 167, 30], [-87, 155, 30],
  [-114, 137, 30], [-132, 119, 30], [-150, 98, 28], [-178, 57, 28], [-200, 35, 28], [-222, 22, 28], [-255, -35, 28],
  [-288, -92, 28], [-304, -130, 20], [-318, -180, 14], [-322, -220, 12], [-318, -250, 12]];
const FAC_H = 88, ROOF_YO = 104, ROOF_YI = 98;

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 336, h: 4 }, { deg: -39, r: 329, h: 4 }, { deg: -33, r: 337, h: 4 }, { deg: -32.95, r: 337, h: 7 },
        { deg: -27, r: 352, h: 7 }, { deg: -21, r: 370, h: 7 }, { deg: -16, r: 386, h: 7 }, { deg: -12, r: 391, h: 7 },
        { deg: -6, r: 386, h: 7 }, { deg: 0, r: 396, h: 7 }, { deg: 6, r: 398, h: 7 }, { deg: 13, r: 397, h: 7 },
        { deg: 16, r: 390, h: 7 }, { deg: 18, r: 378, h: 7 }, { deg: 22, r: 365, h: 7 }, { deg: 26, r: 356, h: 7 },
        { deg: 30, r: 351, h: 7 }, { deg: 30.05, r: 351, h: 8 }, { deg: 34, r: 342, h: 8 }, { deg: 38, r: 339, h: 8 },
        { deg: 40, r: 331, h: 8 }, { deg: 43, r: 324, h: 8 }, { deg: 45, r: 322, h: 8 },
      ],
      foulScale: 0.45,
      backstop: 40,
      // t: 0 = right-field pole, 0.5 = behind home, 1 = left-field pole (see the bowl note in the top comment)
      lower: { depth: [[0, 72], [0.1, 90], [0.2, 100], [0.33, 100], [0.42, 78], [0.5, 56], [0.58, 76], [0.68, 86], [0.82, 88], [0.92, 76], [1, 64]],
        slope: 0.34, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: [[0, 20], [0.2, 22], [0.4, 16], [0.5, 12], [0.6, 16], [0.8, 20], [1, 20]],
        rise: [[0, 18], [0.2, 20], [0.5, 22], [0.8, 20], [1, 18]],
        depth: [[0, 70], [0.2, 80], [0.4, 84], [0.5, 80], [0.6, 76], [0.8, 60], [1, 45]],
        slope: 0.48, extent: [0, 0.9] },
      outfield: {
        depth: 60, slope: 0.5,
        spans: [[-39, -16, 60, 0.5], [13, 45, 135, 0.4]],
        eye: [-4.5, 7], eyeHeight: 38, eyeDepth: 55,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#22395e', facade: '#d2bf98', wall: '#26382f', cream: '#e6dcc2' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views, rec } = ctx;
    const { sweepSolid, textTexture, wallH, clamp } = tools;
    const { bPts, bN } = paths;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });
    const spec = ctx.spec;

    // palette
    const SAND = '#c6aa7e', SAND_D = '#a68b62', STUCCO = '#e4d9bf', STEEL = '#ece8dc', STEEL_D = '#9a9a92', SOLAR = '#27364b',
      SOLAR_U = '#56606a', GLASS = '#41566a', BRICK = '#8b4d3b', BRICK_L = '#a86a52', GOLD = ctx.rec.colors[1] || '#ffc425';
    const accent = tools.mixHex(GOLD, '#9a8c74', 0.45);

    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0, rx = 0, rz = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(rx, ry, rz); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const BOX = new THREE.BoxGeometry(1, 1, 1); BOX.clearGroups();
    // merged solids: many small coloured parts (gates, towers, buildings, masts) become ONE mesh with vertex colours
    const SP = [], SN = [], SC = [];
    const place = (x, y, z, ry = 0, rx = 0, rz = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(rx, ry, rz); tmp.scale.set(1, 1, 1); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const solid = (geo, color, M) => {
      const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(M);
      const p = g.attributes.position.array, n = g.attributes.normal.array, c = new THREE.Color(color);
      for (let i = 0; i < p.length; i++) { SP.push(p[i]); SN.push(n[i]); }
      for (let i = 0; i < p.length / 3; i++) SC.push(c.r, c.g, c.b);
      g.dispose();
    };
    // box of size w,h,d at local x,y,z (rotated by rx), inside a frame matrix F (default identity)
    const sbox = (F, w, h, d, color, x, y, z, rx = 0, ry = 0) => solid(new THREE.BoxGeometry(w, h, d), color, F.clone().multiply(place(x, y, z, ry, rx)));
    const scyl = (F, r, h, color, x, y, z) => solid(new THREE.CylinderGeometry(r, r, h, 6), color, F.clone().multiply(place(x, y, z)));
    const I4 = new THREE.Matrix4();
    // bar between two points a, b (local to frame F), square section w
    const bar = (F, a, b, w, color) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length();
      if (L < 1e-4) return;
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.clone().normalize());
      const m = new THREE.Matrix4().compose(A.clone().add(B).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1));
      solid(new THREE.BoxGeometry(L, w, w), color, F.clone().multiply(m));
    };
    // dark blank board faces with a plain line grid: all merged into one mesh (uv = 3 ft per cell)
    const FQP = [], FQU = [];
    const face = (F, w, h, x, y, z) => {
      const g = new THREE.PlaneGeometry(w, h).toNonIndexed(); g.applyMatrix4(F.clone().multiply(place(x, y, z)));
      const p = g.attributes.position.array, u = g.attributes.uv.array;
      for (let i = 0; i < p.length; i++) FQP.push(p[i]);
      for (let i = 0; i < u.length; i += 2) FQU.push(u[i] * w / 3, u[i + 1] * h / 3);
      g.dispose();
    };
    // thin white frame around a panel
    const frameBox = (F, cx, cy, w, h, z, color, t = 1.2) => {
      sbox(F, w + t * 2, t, 2.6, color, cx, cy + h / 2 + t / 2, z); sbox(F, w + t * 2, t, 2.6, color, cx, cy - h / 2 - t / 2, z);
      sbox(F, t, h, 2.6, color, cx - w / 2 - t / 2, cy, z); sbox(F, t, h, 2.6, color, cx + w / 2 + t / 2, cy, z);
    };
    // lamp banks: instanced lamps on a panel (frame F faces the infield with local +z)
    const lampM = [];
    const lampBank = (F, y, z, w, h) => {
      const cols = low ? 4 : 8, rows = low ? 2 : 4;
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
        const lx = (c - (cols - 1) / 2) * ((w - 4) / cols), ly = (r - (rows - 1) / 2) * ((h - 4) / rows);
        lampM.push(F.clone().multiply(mat4(lx, y + ly, z + 1.9, 2.6, 2.2, 1.0)));
      }
    };
    const SLITS = [];       // dark slit windows of the sandstone towers and block

    // ---------- path along the roof outer edge: smooth, resampled every ~8 ft, with widths and outward normals
    const curve = new THREE.CatmullRomCurve3(ROOF.map((p) => new THREE.Vector3(p[0], 0, p[1])), false, 'centripetal');
    const P = [], W = [];
    for (let i = 0; i < ROOF.length - 1; i++) {
      const a = ROOF[i], b = ROOF[i + 1];
      const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 8));
      for (let s = 0; s < n; s++) {
        const v = curve.getPoint((i + s / n) / (ROOF.length - 1));
        P.push([v.x, v.z]); W.push(a[2] + (b[2] - a[2]) * (s / n));
      }
    }
    { const v = curve.getPoint(1); P.push([v.x, v.z]); W.push(ROOF[ROOF.length - 1][2]); }
    const NP = P.length, CEN = [0, -150];
    const NRM = P.map((p, i) => {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(NP - 1, i + 1)];
      let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      if (nx * (p[0] - CEN[0]) + nz * (p[1] - CEN[1]) < 0) { nx = -nx; nz = -nz; }
      return [nx, nz];
    });
    const TAN = NRM.map(([nx, nz]) => [-nz, nx]);                     // along-path direction (RF -> LF reversed sign is fine)
    const arc = [0]; for (let i = 1; i < NP; i++) arc.push(arc[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = arc[NP - 1];
    const yawAlong = (i) => Math.atan2(-TAN[i][1], TAN[i][0]);          // rotation.y that aligns local x with the path tangent
    const at = (i, d, y) => [P[i][0] + NRM[i][0] * d, y, P[i][1] + NRM[i][1] * d];
    const idxAt = (s) => { let i = 0; while (i < NP - 1 && arc[i] < s) i++; return i; };
    const nearestIdx = (x, z) => { let bi = 0, bd = 1e12; P.forEach((p, i) => { const d = (p[0] - x) ** 2 + (p[1] - z) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };

    // ======================================================================================================
    // 1. ROOF: solar "sail" canopy ribbon between the measured outer and inner edge, white steel edge beams,
    //    underside ribs, columns, and light banks on the front edge.
    // ======================================================================================================
    const yO = (i) => ROOF_YO, yI = (i) => ROOF_YI;
    {
      const T = 2.6, TI = 7;      // outer edge beam 2.6 ft; the inner edge is a deeper white steel truss fascia (photos 4, 7)
      const pos = [], idx = [], grp = [];
      const V = (x, y, z) => { pos.push(x, y, z); return pos.length / 3 - 1; };
      const OT = [], IT = [], OB = [], IB = [];
      for (let i = 0; i < NP; i++) {
        const o = at(i, 0, yO(i)), n = at(i, -W[i], yI(i));
        OT.push(V(o[0], o[1], o[2])); IT.push(V(n[0], n[1], n[2]));
        OB.push(V(o[0], o[1] - T, o[2])); IB.push(V(n[0], n[1] - TI, n[2]));
      }
      const quads = (a, b, flip) => { const s = idx.length; for (let i = 0; i < NP - 1; i++) { if (!flip) idx.push(a[i], b[i], b[i + 1], a[i], b[i + 1], a[i + 1]); else idx.push(a[i], b[i + 1], b[i], a[i], a[i + 1], b[i + 1]); } grp.push([s, idx.length - s]); };
      quads(OT, IT, false);          // 0 top (solar)
      quads(OB, IB, true);           // 1 underside
      const s2 = idx.length;
      for (let i = 0; i < NP - 1; i++) idx.push(OT[i], OB[i], OB[i + 1], OT[i], OB[i + 1], OT[i + 1], IT[i], IB[i + 1], IB[i], IT[i], IT[i + 1], IB[i + 1]);
      grp.push([s2, idx.length - s2]); // 2 edges (white)
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
      grp.forEach(([s, c], k) => g.addGroup(s, c, k)); g.computeVertexNormals();
      ctx.add(g, [lam(SOLAR), lam(SOLAR_U), lam(STEEL)]);
    }
    // top ribs (white struts across the panels) and bottom truss chords
    {
      const top = [], bot = [], diag = [], cols = [];
      const step = low ? 6 : 3;
      for (let i = 0; i < NP; i += step) {
        const o = at(i, 0, yO(i)), n = at(i, -W[i], yI(i));
        const mx = (o[0] + n[0]) / 2, mz = (o[2] + n[2]) / 2, ln = Math.hypot(o[0] - n[0], o[2] - n[2]);
        const ry = Math.atan2(-(o[2] - n[2]), o[0] - n[0]);
        top.push(mat4(mx, (o[1] + n[1]) / 2 + 0.9, mz, ln, 1.2, 1.5, ry));
        if (!low) {
          bot.push(mat4(mx, (o[1] + n[1]) / 2 - 5.4, mz, ln, 1.8, 1.8, ry));
          // diagonal web from the outer top to the inner bottom
          const a = new THREE.Vector3(o[0], o[1] - 1, o[2]), b = new THREE.Vector3(n[0], n[1] - 5.4, n[2]);
          const d = b.clone().sub(a), L = d.length();
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.clone().normalize());
          tmp.position.copy(a).add(b).multiplyScalar(0.5); tmp.quaternion.copy(q); tmp.scale.set(L, 1, 1); tmp.updateMatrix(); diag.push(tmp.matrix.clone()); tmp.quaternion.identity();
        }
      }
      inst(BOX, lam(STEEL), top);
      if (!low) { inst(BOX, lam(STEEL_D), bot); inst(BOX, lam(STEEL_D), diag); }
      // columns under the outer edge (every ~48 ft), thin steel
      const cstep = low ? 12 : 6;
      for (let i = 0; i < NP; i += cstep) { const o = at(i, -1.5, 0); cols.push(mat4(o[0], (yO(i) - 2) / 2, o[2], 1.7, yO(i) - 2, 1.7)); }
      inst(new THREE.CylinderGeometry(0.5, 0.5, 1, 6), lam(STEEL), cols);
    }

    // ======================================================================================================
    // 2. FACADE: stucco wall along the roof outer line pulled in 6 ft, sandstone plinth / belt / cornice,
    //    piers and window bays (instanced), gate pavilions and the two white end towers with tilted sails.
    // ======================================================================================================
    const FAC_OFF = 6;
    const FP = P.map((p, i) => [p[0] - NRM[i][0] * FAC_OFF, p[1] - NRM[i][1] * FAC_OFF]);
    const sweepFac = (poly, edgeMats, mats) => ctx.add(sweepSolid(FP, NRM, poly, edgeMats, 0), mats);
    sweepFac(() => [[-3, 0], [-3, FAC_H], [0.4, FAC_H], [0.4, 0]], [-1, 1, 0, -1], [lam(STUCCO), lam(SAND)]);            // body
    sweepFac(() => [[-3, 0], [-3, 9], [2, 9], [2, 0]], [-1, 0, 0, -1], [lam(SAND_D)]);                                  // plinth
    sweepFac(() => [[-3, 40], [-3, 44], [1.5, 44], [1.5, 40]], [-1, 0, 0, 0], [lam(SAND)]);                              // belt
    sweepFac(() => [[-3, FAC_H - 5], [-3, FAC_H + 3], [3.5, FAC_H + 3], [3.5, FAC_H - 2], [1, FAC_H - 5]], [-1, 0, 0, 0, -1], [lam(SAND)]);   // cornice
    // gate pavilions along the path (fraction of arc length) and the tower zones where windows are skipped
    const GATES = [{ s: 0.5, w: 66, h: 104, name: true }, { s: 0.2, w: 40, h: 98 }, { s: 0.8, w: 40, h: 98 }, { s: 0.05, w: 30, h: 96 }];
    const TOWERS = [{ x: 235, z: 74, ry: 0 }, { x: -137, z: 86, ry: 0 }];
    const inGate = (s) => GATES.some((g) => Math.abs(s - g.s * total) < g.w * 0.5 + 2);
    const inTower = (x, z) => TOWERS.some((t) => Math.hypot(x - t.x, z - t.z) < 50);
    {
      const wins = [], piers = [];
      const bay = 18;
      for (let s = 12; s < total - 8; s += bay) {
        const i = idxAt(s); const p = at(i, 0.5 - FAC_OFF, 0);
        if (inGate(s) || inTower(p[0], p[2])) continue;
        const ry = yawAlong(i);
        for (const y of low ? [26] : [20, 60]) wins.push(mat4(p[0], y, p[2], 9, 16, 1.2, ry));
        piers.push(mat4(p[0] + TAN[i][0] * bay / 2, FAC_H / 2 + 4, p[2] + TAN[i][1] * bay / 2, 2.4, FAC_H - 8, 1.6, ry));
      }
      // NB: window and pier boxes lie flat on the wall; the box depth is the third scale
      inst(BOX, basic(GLASS), wins);
      inst(BOX, lam(SAND), piers);
    }
    // gate pavilions (merged into the shared solid mesh); frame matrix F: local x along the facade, local -z outward
    for (const g of GATES) {
      const i = idxAt(g.s * total), ry = yawAlong(i), c = at(i, 3 - FAC_OFF, 0);
      const F = place(c[0], 0, c[2], ry);
      sbox(F, g.w, g.h, 14, SAND, 0, g.h / 2, 3);
      sbox(F, g.w + 4, 4, 17, STUCCO, 0, g.h + 2, 3);
      sbox(F, g.w * 0.46, 36, 2, '#2f3b45', 0, 18, -10.3);
      sbox(F, g.w * 0.46 + 6, 3, 3, SAND_D, 0, 37.5, -10.3);
      for (const sx of [-1, 1]) sbox(F, 4, 40, 4, SAND_D, sx * (g.w * 0.23 + 5), 20, -9);
      if (g.name) {
        const tex = textTexture((gg, w, h) => { gg.fillStyle = '#e4d9bf'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#3a3226'; gg.font = 'bold 76px Georgia, serif'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('PETCO PARK', w / 2, h / 2 + 4); }, 512, 96);
        const sign = ctx.add(new THREE.PlaneGeometry(g.w * 0.8, g.w * 0.8 * 96 / 512), new THREE.MeshBasicMaterial({ map: tex }));
        sign.position.set(c[0] + NRM[i][0] * 4.6, 62, c[2] + NRM[i][1] * 4.6);
        sign.rotation.y = Math.atan2(NRM[i][0], NRM[i][1]);
        views.gate = { pos: [c[0] + NRM[i][0] * 150, 26, c[2] + NRM[i][1] * 150], look: [c[0], 40, c[2]], label: 'Home Gate' };
      }
    }
    // end towers (photos 4, 5, 7): sandstone shafts 40 x 30 x 134 ft, string courses, slit windows high up; the lamp bank is in section 3
    for (const t of TOWERS) {
      const i = nearestIdx(t.x, t.z), F = place(t.x, 0, t.z, yawAlong(i));
      sbox(F, 42, 9, 32, SAND_D, 0, 4.5, 0);
      sbox(F, 40, 134, 30, SAND, 0, 67, 0);
      for (const y of [48, 92, 126]) sbox(F, 42, 2, 32, SAND_D, 0, y, 0);
      sbox(F, 44, 3.5, 34, '#d9cfb5', 0, 135.7, 0);
      for (const y of low ? [62, 98, 114] : [62, 74, 86, 98, 110, 122]) {
        for (const zf of [-15.4, 15.4]) for (const x of [-12, 0, 12]) SLITS.push(F.clone().multiply(mat4(x, y, zf, 2.2, 5.5, 0.8)));
        if (!low) for (const xf of [-20.4, 20.4]) for (const z of [-7, 7]) SLITS.push(F.clone().multiply(mat4(xf, y, z, 0.8, 5.5, 2.2)));
      }
    }

    // ---------- bowl back: right-field-side extension so the upper deck reaches the facade (the sheet shows terraces to x 378)
    {
      const [lo, hi] = [0, 0.46];
      const i0 = Math.round(lo * (bPts.length - 1)), i1 = Math.round(hi * (bPts.length - 1));
      const pts = bPts.slice(i0, i1 + 1), nr = bN.slice(i0, i1 + 1);
      // distance from the seat front to the facade along each normal
      const dist = pts.map((p, k) => {
        let best = 260;
        for (let j = 0; j < FP.length - 1; j++) {
          const a = FP[j], b = FP[j + 1], ex = b[0] - a[0], ez = b[1] - a[1], den = nr[k][0] * ez - nr[k][1] * ex;
          if (Math.abs(den) < 1e-9) continue;
          const t = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * nr[k][1] - (a[1] - p[1]) * nr[k][0]) / den;
          if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
        }
        return best;
      });
      const dE = (k) => dims.deckAt.dEnd(i0 + k), hT = (k) => dims.deckAt.hTop(i0 + k);
      const ext = (k) => Math.max(dE(k) + 6, dist[k] - 4);
      ctx.add(sweepSolid(pts, nr, (k) => [[dE(k) - 2, hT(k) - 3], [dE(k) - 2, hT(k)], [ext(k), hT(k) + 0.12 * (ext(k) - dE(k))], [ext(k), 0], [dE(k) - 2, 0]],
        [MAT.SEAT, MAT.SEAT, MAT.FACADE, -1, -1], MAT.FACADE), M);
    }

    // ======================================================================================================
    // 3. LIGHTS (photos 4, 5, 6, 7): white steel A-frames with a lamp bank standing on the roof, and one lamp bank on top of each
    //    sandstone end tower. (The four lattice masts behind the outfield stands of the first version are not in the photographs.)
    // ======================================================================================================
    {
      const faceAng = (x, z) => Math.atan2(0 - x, -120 - z);          // local +z faces the infield
      for (const f of [0.03, 0.17, 0.74, 0.84, 0.97]) {
        const i = idxAt(f * total), p = at(i, -W[i] + 4, yI(i)), F = place(p[0], 0, p[2], faceAng(p[0], p[2])), y0 = p[1], tall = 34;
        for (const sx of [-1, 1]) bar(F, [sx * 10, y0, 0], [sx * 6.5, y0 + tall, 0], 1.3, STEEL);
        sbox(F, 14, 1.2, 1.4, STEEL, 0, y0 + tall * 0.5, 0);
        if (!low) { bar(F, [-10, y0, 0], [6.5, y0 + tall * 0.5, 0], 0.9, STEEL_D); bar(F, [10, y0, 0], [-6.5, y0 + tall * 0.5, 0], 0.9, STEEL_D); }
        sbox(F, 30, 14, 2.4, '#d6d0be', 0, y0 + tall + 8, 0);
        lampBank(F, y0 + tall + 8, 0, 30, 14);
      }
      for (const t of TOWERS) {
        const F = place(t.x, 0, t.z, faceAng(t.x, t.z));
        for (const sx of [-1, 1]) sbox(F, 1.6, 14, 1.6, STEEL_D, sx * 9, 143, 0);
        sbox(F, 34, 16, 2.6, '#d6d0be', 0, 151, 0);
        lampBank(F, 151, 0, 34, 16);
      }
    }

    // ======================================================================================================
    // 4. SIGNATURE FEATURES
    // ======================================================================================================
    // 4a. Western Metal Supply Co. (photos 4, 6): brick, four floors; the three upper floors step out on balconies on the two field faces
    //     (cream slab edges at 15, 32, 47 ft), dark name band 57-69 ft carrying the name painted on the real building, roof pavilions.
    {
      const cx = -287, cz = -295, W0 = 118, D0 = 100, HB = 57, xE = cx + W0 / 2, zS = cz + D0 / 2, SLAB = '#e2d8bd', RAIL = '#3d3a36';
      sbox(I4, W0, HB, D0, BRICK, cx, HB / 2, cz);
      sbox(I4, W0 + 1.5, 7, D0 + 1.5, BRICK_L, cx, 3.5, cz);
      sbox(I4, W0 + 2, 12, D0 + 2, '#4a4540', cx, HB + 6, cz);                  // name band
      sbox(I4, W0 + 3, 2.5, D0 + 3, '#e0d5b5', cx, HB + 13.2, cz);              // parapet cap
      for (const y of [15, 32, 47]) {
        sbox(I4, 7, 1.4, D0, SLAB, xE + 3.5, y, cz); sbox(I4, W0 + 7, 1.4, 7, SLAB, cx + 3.5, y, zS + 3.5);
        sbox(I4, 0.5, 3, D0, RAIL, xE + 6.8, y + 2.6, cz); sbox(I4, W0 + 7, 3, 0.5, RAIL, cx + 3.5, y + 2.6, zS + 6.8);
      }
      for (let z = -D0 / 2 + 6; z < D0 / 2; z += 12) sbox(I4, 1.6, 47, 1.6, BRICK_L, xE + 6.3, 23.5, cz + z);
      for (let x = -W0 / 2 + 6; x < W0 / 2 + 6; x += 12) sbox(I4, 1.6, 47, 1.6, BRICK_L, cx + x, 23.5, zS + 6.3);
      sbox(I4, 62, 6, 30, '#e8e0cb', cx + 10, 74.5, cz - 8);                  // roof-deck pavilions
      sbox(I4, 40, 1, 20, '#f1ecde', cx - 22, 79, cz + 10, 0.2);
      const nameTex = textTexture((g, w, h) => { g.fillStyle = '#4a4540'; g.fillRect(0, 0, w, h); g.fillStyle = '#ece3cc'; g.font = 'bold 56px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('WESTERN METAL SUPPLY CO.', w / 2, h / 2 + 3); }, 1024, 96);
      for (const [x, z, ry] of [[xE + 1.4, cz, Math.PI / 2], [cx, zS + 1.4, 0]]) {
        const m = ctx.add(new THREE.PlaneGeometry(108, 10.2), new THREE.MeshBasicMaterial({ map: nameTex })); m.position.set(x, HB + 6, z); m.rotation.y = ry;
      }
      const wins = [];
      for (const y of low ? [24, 40] : [24, 40, 52]) {
        for (let x = -W0 / 2 + 6; x < W0 / 2; x += 12) { wins.push(mat4(cx + x, y, zS + 0.3, 7, y > 50 ? 6 : 9, 0.6)); wins.push(mat4(cx + x, y, cz - D0 / 2 - 0.3, 7, 9, 0.6)); }
        for (let z = -D0 / 2 + 6; z < D0 / 2; z += 12) { wins.push(mat4(xE + 0.3, y, cz + z, 0.6, y > 50 ? 6 : 9, 7)); wins.push(mat4(cx - W0 / 2 - 0.3, y, cz + z, 0.6, 9, 7)); }
      }
      inst(BOX, basic('#2e3338'), wins);
      views.wmsc = { pos: [-70, 36, -150], look: [-240, 40, -285], label: 'Western Metal' };
    }
    // 4a2. Sandstone block north of it (photos 1, 2): 47 x 57 ft, 56 ft, slit windows at every stair landing, lower annex
    {
      const sx = -272, sz = -378;
      sbox(I4, 47, 56, 57, SAND, sx, 28, sz); sbox(I4, 49, 6, 59, SAND_D, sx, 3, sz); sbox(I4, 49, 2.5, 59, '#d9cfb5', sx, 57.2, sz);
      sbox(I4, 20, 38, 30, SAND, sx + 33, 19, sz + 6); sbox(I4, 22, 2, 32, '#d9cfb5', sx + 33, 39, sz + 6);
      for (let y = 14; y < 54; y += low ? 14 : 7) {
        for (const x of [-14, 0, 14]) { SLITS.push(mat4(sx + x, y, sz - 28.8, 2.2, 5, 0.8)); SLITS.push(mat4(sx + x, y, sz + 28.8, 2.2, 5, 0.8)); }
        for (const z of [-20, -7, 7, 20]) SLITS.push(mat4(sx - 23.8, y, sz + z, 0.8, 5, 2.2));
      }
    }
    // 4b. Left-field board (photos 3, 6, 1): lower row of three blank panels, ribbon, main board with two banner panels above, catwalk,
    //     white truss, back banner wall with a tall lamp-frame tower. Faces dark with a plain line grid.
    {
      const bx = -176, bz = -410, ang = 36 * D2R, F = place(bx, 0, bz, ang);
      const SLATE = '#3a4046', GREY = '#8d9498', DECK = '#9a9a92';
      // legs and braces below the catwalk
      for (const x of [-60, -20, 20, 60]) sbox(F, 3, 48, 3, STEEL, x, 24, -6);
      sbox(F, 124, 1.6, 1.6, STEEL, 0, 24, -6);
      for (const [x0, x1] of [[-60, -20], [20, 60]]) { bar(F, [x0, 2, -6], [x1, 46, -6], 1.6, STEEL); if (!low) bar(F, [x1, 2, -6], [x0, 46, -6], 1.6, STEEL); }
      sbox(F, 132, 2, 12, DECK, 0, 48, -2);                                      // catwalk deck
      sbox(F, 130, 0.6, 0.6, STEEL, 0, 51.5, 3.8);
      // back banner wall: three panels (the outer face seen from the street), grey top band
      for (const [x, w, c] of [[-44, 40, '#8c7f72'], [0, 48, '#4a5f78'], [44, 40, '#7d776e']]) sbox(F, w, 52, 2, c, x, 76, -8);
      for (const x of [-64, -24, 24, 64]) sbox(F, 1.8, 54, 3, STEEL, x, 76, -7.5);
      sbox(F, 132, 8, 4, GREY, 0, 106, -7);
      for (const x of [-58, -30, 30, 58]) sbox(F, 3, 4, 3, '#d6d0be', x, 112, -8);   // small lamps on the wall top
      // lower row (front): left panel, centre video + ribbon, right panel
      sbox(F, 33, 43, 3, SLATE, -46.5, 71.5, -1); sbox(F, 33, 43, 3, SLATE, 46.5, 71.5, -1);
      sbox(F, 50, 33, 3, SLATE, 0, 68.5, -1); sbox(F, 50, 6, 3, SLATE, 0, 89, -1);
      face(F, 31, 41, -46.5, 71.5, 0.7); face(F, 31, 41, 46.5, 71.5, 0.7); face(F, 48, 31, 0, 68.5, 0.7); face(F, 48, 4.4, 0, 89, 0.7);
      frameBox(F, -46.5, 71.5, 31, 41, 0.4, STEEL); frameBox(F, 46.5, 71.5, 31, 41, 0.4, STEEL); frameBox(F, 0, 68.5, 48, 31, 0.4, STEEL); frameBox(F, 0, 89, 48, 4.4, 0.4, STEEL);
      // main board above: 74 x 35 ft with two 12 x 38 ft banner panels
      sbox(F, 74, 35, 4, SLATE, 0, 115.5, -2); face(F, 72, 33, 0, 115.5, 0.2); frameBox(F, 0, 115.5, 72, 33, 0.2, STEEL);
      for (const x of [-48, 48]) sbox(F, 12, 38, 2.5, '#7a3a34', x, 116, -1.5);
      // upper truss: columns, chords, diagonals behind the boards
      for (const x of [-62, -22, 22, 62]) sbox(F, 2.6, 88, 2.6, STEEL, x, 92, -11);
      sbox(F, 128, 2, 2, STEEL, 0, 136, -11); sbox(F, 128, 2, 2, STEEL, 0, 104, -11);
      for (const [x0, x1] of [[-62, -22], [22, 62]]) { bar(F, [x0, 104, -11], [x1, 136, -11], 1.4, STEEL); if (!low) bar(F, [x1, 104, -11], [x0, 136, -11], 1.4, STEEL); }
      // tall lamp-frame tower and rear catwalk (photo 1)
      for (const x of [-22, 22]) bar(F, [x, 136, -11], [x * 0.75, 168, -11], 2.2, STEEL);
      sbox(F, 36, 1.6, 1.6, STEEL, 0, 152, -11); bar(F, [-22, 136, -11], [16.5, 152, -11], 1.4, STEEL); if (!low) bar(F, [22, 136, -11], [-16.5, 152, -11], 1.4, STEEL);
      sbox(F, 44, 2, 8, DECK, 0, 168.5, -11); sbox(F, 40, 18, 3, '#d6d0be', 0, 178, -11); lampBank(F, 178, -11, 40, 18);
      sbox(F, 56, 1.4, 11, DECK, 0, 118, -13); sbox(F, 56, 0.6, 0.6, STEEL, 0, 121.5, -18.5);
      for (let x = -24; x <= 24; x += 12) sbox(F, 3, 3, 3, '#d6d0be', x, 120.5, -13);
      views.board = { pos: [-40, 64, -170], look: [-176, 100, -410], label: 'LF Board' };
    }
    // 4b2. Batter's eye planters (photo 3): green strips along the two top corners of the dark block
    {
      const [ep, en] = tools.span(-4.5, 7), top = Math.max(38, wallH(spec, 0) + 20) + 1.6;
      for (const k of [1, ep.length - 2]) {
        const d = (ctx.dims && 27.5), x = ep[k][0] + en[k][0] * d, z = ep[k][1] + en[k][1] * d;
        sbox(place(x, 0, z, Math.atan2(en[k][0], en[k][1])), 9, 3.2, 54, '#5f7a4b', 0, top, 0);
      }
    }
    // 4c. Park-at-the-park lawn behind the right-centre stands and a bullpen lawn behind left-centre
    {
      const shape = new THREE.Shape([[62, 440], [120, 470], [175, 515], [215, 575], [215, 640], [62, 640]].map(([x, z]) => new THREE.Vector2(x, z)));
      const g = new THREE.ExtrudeGeometry(shape, { depth: 6, bevelEnabled: false }); g.rotateX(-Math.PI / 2);
      solid(g, '#70895a', place(0, 0.2, 0));
      sbox(I4, 66, 0.5, 54, '#6f8c4c', -81, 0.3, -421);
      solid(new THREE.CylinderGeometry(3, 6, 1.6, 12), '#b58258', place(-81, 1, -404));
    }

    inst(BOX, basic('#fff0c0'), lampM);
    if (SLITS.length) inst(BOX, basic('#2b2a28'), SLITS);
    if (FQP.length) {
      const gt = textTexture((g, w, h) => { g.fillStyle = '#1b232a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f3d49'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); }, 32, 32);
      gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.needsUpdate = true;
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(FQP, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(FQU, 2));
      ctx.add(g, new THREE.MeshBasicMaterial({ map: gt, side: THREE.DoubleSide }));
    }
    // flush the merged solids into one mesh
    {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(SP, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(SN, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(SC, 3));
      ctx.add(g, lam('#ffffff', { vertexColors: true }));
    }

    // ======================================================================================================
    // 5. CLEAN-UP and VIEWS
    // ======================================================================================================
    for (const p of parts.poles) if (p.material && p.material.color) p.material.color.set('#e0bd3f');   // yellow foul poles
    views.roof = { pos: [0, 42, -118], look: [-10, 88, 185], label: 'Sail Roof' };
    if (!views.gate) views.gate = { pos: [0, 26, 340], look: [0, 40, 194], label: 'Home Gate' };
  },
};
