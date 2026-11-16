// Detail module: Chase Field, Arizona Diamondbacks (opened 1998, retractable roof). Units: feet.
// MEASURED FROM THE SHEET (survey.png, 1.1 px/ft; home plate = origin; CF axis = +x-symmetric roof, roof closed in the image):
//  - Home plate / second base were placed from the roof: the apron behind home is a circle of radius ~242 ft centered on
//    home (5 edge points fit within 3 ft), and the roof is symmetric about x = 0 (roof seam on the center line).
//  - Moving-roof rectangle: x -341 .. +336, z -402 (north) .. +121 (south). Eight sections run north-south and slide
//    east-west; seams read at x = -341, -263, -184, -93, 0 (center seam), then 109 (light line), and the right three
//    sections are an even split of 109..336. Cross ribs every ~48 ft (11 per panel).
//  - South apron roof (round, fixed): chord z 121..124 between x -211 and +205, arc r 242 to z +242.
//  - North fixed roof: polygon (-213,-477) (-152,-511) (-68,-511) (-68,-536) (80,-536) (80,-502) (164,-502) (221,-466);
//    behind it a dark shadow band to the moving roof (z -402 .. -470).
//  - Green side wings: x 343..373 (east) and -379..-343 (west), z -284..-45; stair towers west of the west wing:
//    x -422..-402, six blocks z -327..-88; cream strip x 373..386 (east annex) z -290..-90; NE corner tower x 335..380, z -432..-400.
//  - South low buildings: x -190..-95 and 90..168, z 150..238 (outside the round apron); gray sheds x 185..330, z 135..162.
// FROM TEXT (Wikipedia, Clem's Baseball): wall corners LF 330 / LC 374-376 / deep corners 413 / CF 407 / RF 335; CF wall
//  ~25 ft, other fence 7.5 ft; roof has eight sections, six telescope from the left and right over the upper decks of
//  first and third base, each side can move alone, ~4.5 min; brick walls kept from an old warehouse give the "hangar"
//  rectangle; pool in right-center beyond the fence; HD scoreboard 136 x 46 ft beyond center; upper deck very large.
// LEVEL 4 (photographs 1-8 in refs/ARI, satellite sheet is roof-covered so it gives no bowl or shadow data):
//  FACADE (photos 1, 2, 8): ground floor of red-brown brick and storefront glass ~36 ft; pale gray-green metal band to 62 ft with
//   ribbon windows; above it dark charcoal-green cladding to ~160 ft with large mural panels (muted blocks, no figures) and tall
//   blue-gray glass towers with steel grids, a deep steel truss band ~26 ft below the top, cream roof-edge fascia; rectangular (not
//   arched) windows; brick pavilions 54-56 ft; glass-and-steel corner towers; gates are glass fronts under a steel truss canopy at 32-36 ft.
//  HEIGHTS: levels from photo 2 by thirds of the facade height (ground floor 19 %, band 19 %, upper zone 62 % of ~160 ft); pavilions
//   from photo 1 (3-4 stories x 13-15 ft); CF scoreboard from photo 7 with the 25 ft CF wall (config) as the scale (3 px/ft; board
//   plane ~20 ft behind the wall, so +-10 %): eye/base 44 ft, video face 60-103 ft (43 ft, text says 46), header crest ~128 ft, clock
//   ~134 ft, flag tops ~150 ft; lower-bowl top ~40 ft behind home from a 6 ft player in the same plane in photo 4 (concourse
//   ribbon board 33 ft above the fence line, x1.2 for the farther plane); club + suite stories 13 + 13 ft above it (photo 4); upper
//   front ~74 ft, upper top ~131 ft (steep, slope 0.6, from the photo 4 aisle angles); panel row on the north wall from photo 3 using
//   the 46 ft board face as the scale (1.5 px/ft): panels 37 x 50 ft, bottoms ~77 ft; lamp ladders 7 x 53 ft.
//  SEATING: tables in config (t 0 = RF pole, .5 = home, 1 = LF pole): lower depth 52 (poles) / 64 / 88 (baselines) / 86 (home),
//   slope .43 so the concourse top is 26 ft at the poles and ~40 ft behind home; upper overhang 14 .. 30 ft, rise 30 .. 47 ft, depth
//   66 (ends) .. 102 (baselines) .. 98 (home); upper deck ends at t 0.06 and 0.94 (just past the poles, photos 3 and 5). Photos show
//   both sides alike, so the table is symmetric; the sheet roof limits the depth (facade 170 ft from the seats at the poles, 285 ft at the
//   baselines, 182 ft behind home). Outfield sections 54-60 ft deep. A dark suite-glass band with piers and a blank ribbon board on
//   the concourse edge are added along the bowl.
//  BOARDS (photos 3, 6, 7): main video board (three blank faces, 28 + 78 + 26 ft wide, 46 ft high) on the batter's eye at the center
//   line, with frame, catwalk, header plate (ballpark name as plain text), clock, two flagpoles, two lattice towers up to the roof
//   truss and back bracing to the north wall; six blank panels and six lamp ladders on the north wall (x +-91/150/209 and +-120/180/240);
//   three small blank boards (x -138, -99 and +90). Board faces are dark with a plain line grid.
// STILL ESTIMATED: roof levels 168-192 ft, glass towers' and murals' exact positions (60 ft module, not measured), upper deck ~104-130
//  rakes, bays, gate sizes, rotunda, light-bank positions, pool deck size, stair-tower heights, truss layouts under each roof panel,
//  colors, flag colors, deck depths on the first-base side vs the third-base side (no clean side photo).
const D2R = Math.PI / 180;
const RX0 = -341, RX1 = 336, RZ0 = -402, RZ1 = 121;               // moving roof rectangle
const XE = 345, ZN = -440, ZS = 124, R_ARC = 241;                  // facade envelope: x half width, north z, south straight z, round radius
const BASE_H = 36, BAND_TOP = 62, GLASS_TOP = 160, ARC_TOP = 104;       // facade levels: brick ground floor, pale metal band, top of the dark cladding
// Roof sections (west to east): [x0, x1, level, open shift]. Outer two are fixed, six slide and stack over them.
const PANELS = [
  [-341, -263, 168, 0], [-263, -184, 176, -78], [-184, -93, 184, -157], [-93, 0, 192, -248],
  [0, 109, 192, 227], [109, 185, 184, 151], [185, 260, 176, 76], [260, 336, 168, 0],
];
const SOUTH_APRON_Y0 = 168, SOUTH_APRON_Y1 = 105;
const NORTH_ROOF = [[-213, -477], [-152, -511], [-68, -511], [-68, -536], [80, -536], [80, -502], [164, -502], [221, -466]];

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 330, h: 7.5 }, { deg: -22.5, r: 376, h: 7.5 }, { deg: -9.65, r: 413, h: 7.5 }, { deg: -9.6, r: 413, h: 25 },
        { deg: 9.6, r: 413, h: 25 }, { deg: 9.65, r: 413, h: 7.5 }, { deg: 22.5, r: 376, h: 7.5 }, { deg: 45, r: 335, h: 7.5 },
      ],
      foulScale: 1, backstop: 58,
      // Bowl depth along the foul edge (t 0 = RF pole, .5 = home, 1 = LF pole). Behind home the facade is 242 ft from the plate
      // (round apron), at the poles only ~170 ft from the seats, so the decks are shallow at the ends and full behind home.
      lower: { depth: [[0, 52], [0.1, 64], [0.28, 88], [0.5, 86], [0.72, 88], [0.9, 64], [1, 52]], slope: 0.43, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: [[0, 14], [0.15, 22], [0.5, 30], [0.85, 22], [1, 14]],        // upper front is behind the lower back by this much
        rise: [[0, 30], [0.15, 40], [0.5, 47], [0.85, 40], [1, 30]],             // club + suite stories (~27 ft above the concourse) plus structure
        depth: [[0, 66], [0.15, 88], [0.3, 102], [0.5, 98], [0.7, 102], [0.85, 88], [1, 66]],
        slope: 0.6, extent: [0.06, 0.94],
      },
      outfield: { depth: 56, slope: 0.42, spans: [[-45, -9.6, 60, 0.4], [22.5, 45, 54, 0.42]], eye: [-9.6, 9.6], eyeHeight: 44, eyeDepth: 20 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#3f6a63', facade: '#a9694a', wall: '#2f4a45', cream: '#e6dabb' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views, rec } = ctx;
    const { sweepSolid, textTexture, clamp, normalsFor } = tools;
    const { bPts, bN } = paths;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });
    const BRICK = '#a9694a', CREAM = '#e6dabb', STEEL = '#55544e', GLASS = '#486370', GREEN = '#7aa08c', FABRIC = '#efe7d0', STONE = '#c7b894', BAND = '#9ca78f', CLAD = '#434f48';

    // ---------- helpers ----------
    // Tiny mesh builder: accumulates triangles, boxes and oriented beams into one BufferGeometry.
    const mesher = (useColor = false) => {
      const p = [], cl = []; let cur = [1, 1, 1];
      const paint = (n) => { if (useColor) for (let i = 0; i < n; i++) cl.push(...cur); };
      const quad = (a, b, c, d) => { p.push(...a, ...b, ...c, ...a, ...c, ...d); paint(6); };
      const faces = [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]];
      const solid = (v) => { for (const [a, b, c, d] of faces) quad(v[a], v[b], v[c], v[d]); };
      const api = {
        quad,
        tri(a, b, c) { p.push(...a, ...b, ...c); paint(3); },
        setColor(hex) { const c = new THREE.Color(hex); cur = [c.r, c.g, c.b]; },
        box(cx, cy, cz, sx, sy, sz, ry = 0) {
          const c = Math.cos(ry), s = Math.sin(ry), x = sx / 2, y = sy / 2, z = sz / 2;
          const P = (lx, ly, lz) => [cx + lx * c + lz * s, cy + ly, cz - lx * s + lz * c];
          solid([P(-x, -y, -z), P(x, -y, -z), P(x, y, -z), P(-x, y, -z), P(-x, -y, z), P(x, -y, z), P(x, y, z), P(-x, y, z)]);
        },
        beam(a, b, t) {
          const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d); if (L < 1e-6) return;
          const n = (v) => { const l = Math.hypot(...v) || 1; return v.map((q) => q / l); };
          const cr = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
          const dn = n(d), up = Math.abs(dn[1]) > 0.95 ? [1, 0, 0] : [0, 1, 0];
          const s = n(cr(dn, up)).map((q) => q * t / 2), w = n(cr(s, dn)).map((q) => q * t / 2);
          const C = (P, sx, sy) => [P[0] + s[0] * sx + w[0] * sy, P[1] + s[1] * sx + w[1] * sy, P[2] + s[2] * sx + w[2] * sy];
          solid([C(a, -1, -1), C(a, 1, -1), C(a, 1, 1), C(a, -1, 1), C(b, -1, -1), C(b, 1, -1), C(b, 1, 1), C(b, -1, 1)]);
        },
        geo() { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); if (useColor) g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3)); g.computeVertexNormals(); return g; },
        get count() { return p.length; },
      };
      return api;
    };
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      if (!mats.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const mBrick = lam(BRICK), mCream = lam(CREAM), mSteel = lam(STEEL), mGlass = lam(GLASS), mStone = lam(STONE);
    const mVC = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const ADD = (geo, mat) => ctx.add(geo, mat);
    const archGeo = (() => {                                        // flat arched window, 1 wide, ~1.1 high
      const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0.5, 0.6); s.absarc(0, 0.6, 0.5, 0, Math.PI, false); s.lineTo(-0.5, 0);
      return new THREE.ShapeGeometry(s, 6);
    })();
    const mDark = basic('#25343a');
    // extruded polygon [[x,z]...] from y=0 up to h. mats = [cap, side]
    const prism = (poly, h, mats, y0 = 0) => {
      const sh = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, z)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(0, h + y0, 0);
      return ADD(g, mats);
    };

    // ---------- 0. remove generic parts that conflict, take over the generic roof panels ----------
    const generic = G.children.filter((o) => o.isMesh && o.geometry && o.geometry.type === 'BoxGeometry' && o.geometry.parameters.height === 5 && o.material && o.material.transparent);
    generic.forEach((o) => { o.visible = false; });

    // ---------- 1. facade envelope (photos 1, 2, 8): brick/glass ground floor, pale metal band, mural + glass-tower zone, dark top ----------
    const line = (a, b, seg = 60) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / seg)); return Array.from({ length: n + 1 }, (_, k) => [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); };
    const PHI = Math.acos(ZS / R_ARC), X0 = R_ARC * Math.sin(PHI);
    const arc = []; { const n = 36; for (let k = 0; k <= n; k++) { const a = PHI - 2 * PHI * k / n; arc.push([R_ARC * Math.sin(a), R_ARC * Math.cos(a)]); } }
    const RUNS = [line([-XE, ZN], [XE, ZN]), line([XE, ZN], [XE, ZS]), line([XE, ZS], [X0, ZS]), arc, line([-X0, ZS], [-XE, ZS]), line([-XE, ZS], [-XE, ZN])];
    const FP = [], isArc = [];
    RUNS.forEach((r, ri) => r.forEach((p) => { FP.push(p); isArc.push(ri === 3); }));
    const FN = normalsFor(FP, [0, -150]);
    const topAt = (i) => (isArc[i] ? ARC_TOP : GLASS_TOP);
    const UNIQ = []; RUNS.forEach((r) => r.forEach((p, k) => { if (k < r.length - 1) UNIQ.push(p); }));
    const mBand = lam(BAND), mClad = lam(CLAD);
    const FACMATS = [mBrick, mCream, mGlass, mSteel, mBand, mClad];
    ADD(sweepSolid(FP, FN, () => [[-2, 0], [-2, BASE_H], [0, BASE_H], [0, 0]], [0, 1, 0, -1], 0), FACMATS);                    // brick ground floor
    ADD(sweepSolid(FP, FN, () => [[0, 0], [1.8, 0], [1.8, 5], [0, 5]], [1, 1, 1, 1], 1), FACMATS);                              // stone plinth
    ADD(sweepSolid(FP, FN, () => [[0, BASE_H - 3], [2.8, BASE_H - 3], [2.8, BASE_H + 1.5], [0, BASE_H + 1.5]], [1, 1, 1, 1], 1), FACMATS); // cornice
    ADD(sweepSolid(FP, FN, () => [[-1.5, BASE_H + 1.5], [-1.5, BAND_TOP], [0.6, BAND_TOP], [0.6, BASE_H + 1.5]], [4, 4, 4, 4], 4), FACMATS); // pale metal band
    ADD(sweepSolid(FP, FN, (i) => [[-1.5, BAND_TOP], [-1.5, topAt(i)], [0.4, topAt(i)], [0.4, BAND_TOP]], [5, 5, 5, 5], 5), FACMATS);        // dark cladding above
    ADD(sweepSolid(FP, FN, () => [[0, BAND_TOP - 1.5], [2.2, BAND_TOP - 1.5], [2.2, BAND_TOP + 1], [0, BAND_TOP + 1]], [1, 1, 1, 1], 1), FACMATS); // ledge over the band
    ADD(sweepSolid(FP, FN, (i) => { const t = topAt(i) - 26; return [[0, t], [2.6, t], [2.6, t + 7], [0, t + 7]]; }, [3, 3, 3, 3], 3), FACMATS);  // deep steel truss band near the top
    ADD(sweepSolid(FP, FN, (i) => [[0, topAt(i) - 6], [2.6, topAt(i) - 6], [2.6, topAt(i) + 1], [0, topAt(i) + 1]], [1, 1, 1, 1], 1), FACMATS);   // cream roof-edge fascia

    // bays: storefront glass and brick piers below, ribbon windows in the band, mural panels and glass towers above (60 ft module)
    {
      const rect = new THREE.PlaneGeometry(1, 1); rect.translate(0, 0.5, 0);                 // 1 wide, 1 high, origin at the bottom
      const win = [], band = [], pier = [], mural = [], murCol = [], tower = [], steps = [];
      const MURAL = ['#b0694c', '#c9a45a', '#547a84', '#8c5f64', '#7f9370', '#a9764f'];
      let mi = 0;
      RUNS.forEach((r, ri) => {
        const cum = [0]; for (let i = 1; i < r.length; i++) cum.push(cum[i - 1] + Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]));
        const L = cum[cum.length - 1];
        const at = (s) => {
          let i = 1; while (i < r.length - 1 && cum[i] < s) i++;
          const f = clamp((s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]), 0, 1), a = r[i - 1], b = r[i];
          let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
          if (nx * a[0] + nz * (a[1] + 150) < 0) { nx = -nx; nz = -nz; }
          return { x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, nx, nz, ry: Math.atan2(nx, nz) };
        };
        const top = ri === 3 ? ARC_TOP : GLASS_TOP, n = Math.max(2, Math.round(L / 24));
        for (let k = 0; k < n; k++) {                                                        // 24 ft bays: glass + piers + ribbon windows
          const c = at((k + 0.5) * L / n);
          if (!low || k % 2 === 0) win.push(mat4(c.x + c.nx * 0.45, 5, c.z + c.nz * 0.45, 16, 24, 1, c.ry));
          if (!low || k % 2 === 0) band.push(mat4(c.x + c.nx * 0.75, BASE_H + 9, c.z + c.nz * 0.75, 17, 11, 1, c.ry));
          if (k > 0) { const e = at(k * L / n); pier.push(mat4(e.x + e.nx * 0.9, BASE_H / 2 - 1, e.z + e.nz * 0.9, 3.4, BASE_H - 2, 2, e.ry)); }
        }
        const m = Math.max(1, Math.round(L / 60));                                           // 60 ft modules above the band
        for (let k = 0; k < m; k++) {
          const s0 = (k + 0.5) * L / m, pitch = L / m;
          const a = at(s0 - pitch * 0.2), b = at(s0 + pitch * 0.36);
          mural.push(mat4(a.x + a.nx * 1.0, (BAND_TOP + 6 + top - 28) / 2, a.z + a.nz * 1.0, pitch * 0.58, top - 28 - BAND_TOP - 6, 1.2, a.ry)); murCol.push(MURAL[mi++ % MURAL.length]);
          tower.push(mat4(b.x + b.nx * 1.4, (BASE_H + 2 + top - 10) / 2, b.z + b.nz * 1.4, Math.min(16, pitch * 0.25), top - 10 - BASE_H - 2, 3.4, b.ry));
        }
      });
      inst(rect, mDark, win); inst(rect, new THREE.MeshBasicMaterial({ color: '#52666b', side: THREE.DoubleSide }), band);
      inst(new THREE.BoxGeometry(1, 1, 1), mCream, pier);
      const mm = inst(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: '#ffffff' }), mural);
      if (mm) { murCol.forEach((c, i) => mm.setColorAt(i, new THREE.Color(c))); mm.instanceColor.needsUpdate = true; }
      // glass towers: blue-gray glass with a steel mullion grid (texture), instanced boxes
      const gt = textTexture((g, w, h) => {
        g.fillStyle = '#5f7882'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2e3a3d'; g.lineWidth = 3;
        for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * w / 4, 0); g.lineTo(k * w / 4, h); g.stroke(); }
        for (let k = 0; k <= 12; k++) { g.beginPath(); g.moveTo(0, k * h / 12); g.lineTo(w, k * h / 12); g.stroke(); }
      }, 64, 192);
      inst(new THREE.BoxGeometry(1, 1, 1), low ? mGlass : new THREE.MeshLambertMaterial({ map: gt }), tower);
    }

    // ---------- 2. gate pavilions, corner glass towers, stair towers, annex walls (one vertex-colored mesh) ----------
    const mas = mesher(true), glassRects = [];
    const brickBox = (...a) => { mas.setColor(BRICK); mas.box(...a); }, creamBox = (...a) => { mas.setColor(CREAM); mas.box(...a); };
    const steelBox = (...a) => { mas.setColor(STEEL); mas.box(...a); };
    // corner towers: tall glass-and-steel stair towers (photo 1: glass tower with a steel grid at the corner), cream cap
    for (const [x, z] of [[-XE, ZN], [XE, ZN], [XE, ZS], [-XE, ZS]]) {
      const sx = Math.sign(x), sz = Math.sign(z);
      mas.setColor('#5b727b'); mas.box(x + sx * 2, 78, z + sz * 2, 26, 152, 26); creamBox(x + sx * 2, 155, z + sz * 2, 30, 6, 30);
      for (let k = 1; k < 6; k++) steelBox(x + sx * 2, k * 25, z + sz * 2, 26.8, 1.2, 26.8);   // horizontal mullion rings
    }
    // truss canopy over a gate: steel truss (top/bottom chord + zigzag) projecting from the facade, y ~34
    const canopy = (cx, cz, nx, nz, w, proj) => {
      const tx = -nz, tz = nx, ry = Math.atan2(nx, nz);
      const P = (u, v, y) => [cx + tx * u + nx * v, y, cz + tz * u + nz * v];
      for (const v of [2, proj]) { mas.setColor(STEEL); mas.beam(P(-w / 2, v, 36), P(w / 2, v, 36), 1.6); mas.beam(P(-w / 2, v, 32), P(w / 2, v, 32), 1.6); }
      const n = Math.max(3, Math.round(w / 8));
      for (let k = 0; k < n; k++) { const u0 = -w / 2 + k * w / n, u1 = u0 + w / n; mas.beam(P(u0, proj, k % 2 ? 36 : 32), P(u1, proj, k % 2 ? 32 : 36), 0.9); }
      mas.beam(P(-w / 2, 2, 34), P(-w / 2, proj, 34), 1.4); mas.beam(P(w / 2, 2, 34), P(w / 2, proj, 34), 1.4);
      mas.setColor('#7b8a85'); mas.box(cx + nx * (proj / 2 + 1), 37.2, cz + nz * (proj / 2 + 1), w, 0.6, proj, ry);   // roof deck of the canopy
    };
    // home-plate gate on the round south wall: two brick pylons, glass entrance, truss canopy, name panel on the dark cladding
    brickBox(-26, 29, R_ARC + 5, 12, 58, 14); brickBox(26, 29, R_ARC + 5, 12, 58, 14); creamBox(-26, 59, R_ARC + 5, 15, 3, 17); creamBox(26, 59, R_ARC + 5, 15, 3, 17);
    glassRects.push(mat4(0, 3, R_ARC + 1.6, 40, 31, 1, 0));
    canopy(0, R_ARC + 2, 0, 1, 58, 22);
    for (const a of [-31, 31]) {                                                         // flanking brick pavilions (photo 1: 3-4 stories)
      const x = R_ARC * Math.sin(a * D2R), z = R_ARC * Math.cos(a * D2R), sx = 3 * Math.sin(a * D2R), sz = 3 * Math.cos(a * D2R);
      brickBox(x + sx, 27, z + sz, 38, 54, 18, a * D2R); creamBox(x + sx, 55.5, z + sz, 42, 3, 22, a * D2R);
      glassRects.push(mat4(x + 9.8 * Math.sin(a * D2R), 4, z + 9.8 * Math.cos(a * D2R), 20, 28, 1, a * D2R));
    }
    // east and west gate pavilions on the straight sides
    for (const [x, z, sg] of [[XE, 50, 1], [XE, -350, 1], [-XE, 50, -1], [-XE, -350, -1]]) {
      brickBox(x + sg * 8, 28, z, 20, 56, 40); creamBox(x + sg * 8, 57.5, z, 24, 3, 44);
      glassRects.push(mat4(x + sg * 18.2, 4, z, 24, 30, 1, sg * Math.PI / 2));
      canopy(x + sg * 18, z, sg, 0, 40, 14);
    }
    // east annex wall, west wall with six stair towers, NE corner tower of the old warehouse block
    brickBox(380, 26, -190, 12, 52, 200); creamBox(380, 53, -190, 15, 3, 203);
    brickBox(-400, 25, -208, 4, 50, 240); creamBox(-400, 51, -208, 6, 3, 244);
    [[-294, 66], [-242, 29], [-207, 29], [-173, 29], [-138, 32], [-103, 30]].forEach(([z, L]) => { brickBox(-412, 32, z, 20, 64, L - 3); creamBox(-412, 65, z, 22, 3, L - 1); });
    brickBox(358, 60, -416, 44, 120, 32); creamBox(358, 122, -416, 48, 4, 36);
    ADD(mas.geo(), mVC);
    { const rg = new THREE.PlaneGeometry(1, 1); rg.translate(0, 0.5, 0); inst(rg, new THREE.MeshBasicMaterial({ color: '#4a5f66', side: THREE.DoubleSide }), glassRects); }
    {
      // ballpark name as plain text on a dark panel over the home gate (photo 8: sign on the dark cladding above the entrance)
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#2f3a36'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9c9a3'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12);
        g.fillStyle = '#e6dabb'; g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CHASE FIELD', w / 2, h / 2 + 3);
      }, 512, 80);
      const sign = ADD(new THREE.PlaneGeometry(64, 10), new THREE.MeshBasicMaterial({ map: tex })); sign.position.set(0, 82, R_ARC + 1.2);
    }

    // ---------- 3. roof: eight sliding sections, then the fixed parts ----------
    const fabricTex = textTexture((g, w, h) => {
      g.fillStyle = FABRIC; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(90,80,60,0.28)'; g.fillRect(0, 0, w, 3);
      g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(0, h / 2, w, 2);
    }, 16, 64);
    fabricTex.wrapS = fabricTex.wrapT = THREE.RepeatWrapping;
    const mFabric = new THREE.MeshLambertMaterial({ map: fabricTex, side: THREE.DoubleSide });
    const RIBS = low ? 6 : 11, ribZ = (k) => RZ0 + 3 + k * (RZ1 - RZ0 - 6) / (RIBS - 1);
    const sections = PANELS.map(([xa, xb, y]) => {
      const grp = new THREE.Group(); G.add(grp);
      const st = mesher(low), w = xb - xa, bays = low ? 2 : Math.max(3, Math.round(w / 22));
      if (low) {                                                   // phone: fabric and steel in one vertex-colored mesh (one draw call)
        st.setColor(FABRIC); st.quad([xa, y, RZ0], [xa, y, RZ1], [xb, y, RZ1], [xb, y, RZ0]); st.setColor(STEEL);
      } else {                                                     // fabric surface with uv so the 48 ft rib lines show
        const top = new THREE.BufferGeometry();
        const A = [xa, y, RZ0], B = [xb, y, RZ0], Cc = [xb, y, RZ1], D = [xa, y, RZ1];
        top.setAttribute('position', new THREE.Float32BufferAttribute([...A, ...D, ...Cc, ...A, ...Cc, ...B], 3));
        const uv = (pt) => [(pt[0] - xa) / 60, (pt[2] - RZ0) / 47.6];
        top.setAttribute('uv', new THREE.Float32BufferAttribute([...uv(A), ...uv(D), ...uv(Cc), ...uv(A), ...uv(Cc), ...uv(B)], 2)); top.computeVertexNormals();
        grp.add(new THREE.Mesh(top, mFabric));
      }
      // steel: edge beams, end beams, cross trusses (Warren)
      st.box(xa + 1, y - 6.5, (RZ0 + RZ1) / 2, 2, 11, RZ1 - RZ0); st.box(xb - 1, y - 6.5, (RZ0 + RZ1) / 2, 2, 11, RZ1 - RZ0);
      st.box((xa + xb) / 2, y - 4, RZ0 + 1.5, w, 7, 3); st.box((xa + xb) / 2, y - 4, RZ1 - 1.5, w, 7, 3);
      for (let k = 0; k < RIBS; k++) {
        const z = ribZ(k), yt = y - 1.5, yb = y - 11.5;
        st.beam([xa, yt, z], [xb, yt, z], 1.2); st.beam([xa, yb, z], [xb, yb, z], 1.2);
        if (!low) for (let j = 0; j < bays; j++) {
          const x0 = xa + j * w / bays, x1 = xa + (j + 1) * w / bays, xm = (x0 + x1) / 2;
          st.beam([x0, yt, z], [xm, yb, z], 0.8); st.beam([xm, yb, z], [x1, yt, z], 0.8);
        }
      }
      grp.add(new THREE.Mesh(st.geo(), low ? mVC : mSteel));
      return grp;
    });
    // fixed roof parts (one vertex-colored mesh): south round apron sloping down, rim beams, north cap, end rails
    {
      const fx = mesher(true);
      const f = (z) => SOUTH_APRON_Y0 - (z - RZ1) * (SOUTH_APRON_Y0 - SOUTH_APRON_Y1) / (R_ARC - RZ1);
      const mid = [0, f(RZ1 + 3), RZ1 + 3];
      fx.setColor(FABRIC);
      for (let i = 0; i < arc.length - 1; i++) fx.tri(mid, [arc[i][0], f(arc[i][1]), arc[i][1]], [arc[i + 1][0], f(arc[i + 1][1]), arc[i + 1][1]]);
      fx.quad([-XE, 168, ZN], [XE, 168, ZN], [XE, 168, RZ0], [-XE, 168, RZ0]);               // north cap between the moving roof and the north wall
      fx.setColor(STEEL);
      if (!low) {
        for (let k = 0; k < arc.length - 1; k++) fx.beam([arc[k][0], f(arc[k][1] - 2) - 3, arc[k][1] - 2], [arc[k + 1][0], f(arc[k + 1][1] - 2) - 3, arc[k + 1][1] - 2], 2.2);
        for (let k = 0; k <= 10; k++) { const a = PHI - 2 * PHI * k / 10, x = R_ARC * 0.98 * Math.sin(a), z = R_ARC * 0.98 * Math.cos(a); fx.beam([0, f(RZ1 + 3) - 2, RZ1 + 3], [x, f(z) - 2, z], 1.4); }
      }
      fx.box(0, 161, RZ0 - 1, 2 * XE, 8, 3); fx.box(0, 161, RZ1 + 1, 2 * XE, 8, 3);
      ADD(fx.geo(), mVC);
    }
    // roof animation takeover: panel 0 of the generic roof drives s (0 open .. 1 closed)
    {
      const n = 5, depth = (dims.zBack - dims.zFront) / n, closed0 = dims.zBack - depth * 0.5, open0 = dims.zBack + depth * 0.1;
      const setRoof = (s) => PANELS.forEach(([, , , dx], i) => { sections[i].position.x = dx * (1 - s); });
      generic.forEach((o, idx) => {
        o.position.set = idx === 0 ? (x, y, z) => { setRoof(clamp((z - open0) / (closed0 - open0), 0, 1)); return o.position; } : () => o.position;
      });
      setRoof(0);
    }

    // ---------- 4. light banks on the fixed roof beams, hung inside ----------
    {
      const frames = [], faces = [], hang = [];
      const bank = (x, z, ry, nx, nz) => { frames.push(mat4(x, 150, z, 18, 9, 2.6, ry)); faces.push(mat4(x + nx * 1.4, 150, z + nz * 1.4, 16.5, 7.4, 1, ry)); hang.push(mat4(x, 156.5, z, 1.2, 8, 1.2)); };
      const step = low ? 100 : 50;
      for (let x = -200; x <= 200; x += step) bank(x, RZ1 - 6, Math.PI, 0, -1);
      for (let x = -250; x <= 250; x += step) bank(x, RZ0 + 6, 0, 0, 1);
      for (let z = -330; z <= 60; z += step) { bank(RX1 - 7, z, -Math.PI / 2, -1, 0); bank(RX0 + 7, z, Math.PI / 2, 1, 0); }
      inst(new THREE.BoxGeometry(1, 1, 1), mSteel, frames); if (!low) inst(new THREE.BoxGeometry(1, 1, 1), mSteel, hang);
      inst(new THREE.PlaneGeometry(1, 1), basic('#f3e9c0'), faces);
    }

    // ---------- 5. rear concourse behind the upper deck, suite band, ribbon boards ----------
    {
      const [ep, en, ea] = tools.cut(0.06, 0.94);
      const rayDist = (p, d) => {
        let best = 1e9;
        for (let i = 0; i < UNIQ.length; i++) {
          const a = UNIQ[i], b = UNIQ[(i + 1) % UNIQ.length], ex = b[0] - a[0], ez = b[1] - a[1], den = d[0] * ez - d[1] * ex;
          if (Math.abs(den) < 1e-9) continue;
          const t = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
          if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
        }
        return best;
      };
      const avail = ep.map((p, i) => rayDist(p, en[i]));
      const { sU } = dims, da = dims.deckAt;
      ADD(sweepSolid(ep, en, (i) => {
        const g = ea + i, dE = da.dEnd(g), hT = da.hTop(g);
        const A = Math.max(dE + 4, avail[i] - 5), ext = clamp(A - dE - 22, 0, 52), hh = hT + sU * ext;
        return [[dE, hT], [dE + ext, hh], [A, hh], [A, 0], [dE, 0]];
      }, [MAT.SEAT, MAT.CREAM, MAT.CREAM, -1, -1], MAT.CREAM), M);

      // suite band: dark glass strip with cream piers on the face between the lower deck back and the upper deck underside
      const mSuite = basic('#5a4c3a'), mRibbon = basic('#2c3a42');
      ADD(sweepSolid(ep, en, (i) => { const g = ea + i, d = da.dL(g) - 0.5; return [[d, da.lowTop(g) + 13], [d, da.h0(g) - 9], [d - 0.8, da.h0(g) - 9], [d - 0.8, da.lowTop(g) + 13]]; }, [0, 0, 0, 0], 0), [mSuite]);
      // ribbon board: a blank dark band along the front of the concourse (top of the lower bowl)
      const [lp, ln, la] = tools.cut(0.0, 1.0);
      ADD(sweepSolid(lp, ln, (i) => { const g = la + i, d = da.dL(g) - 0.3, y = da.lowTop(g); return [[d, y + 1.2], [d, y + 4.6], [d - 0.8, y + 4.6], [d - 0.8, y + 1.2]]; }, [0, 0, 0, 0], 0), [mRibbon]);
      ADD(sweepSolid(lp, ln, (i) => { const g = la + i, d = da.dL(g) - 0.3, y = da.lowTop(g); return [[d, y + 0.2], [d, y + 1.2], [d - 0.5, y + 1.2], [d - 0.5, y + 0.2]]; }, [0, 0, 0, 0], 0), [mCream]);
      // suite piers (instanced) every ~14 ft
      const piers = [], acc = [0];
      for (let i = 1; i < ep.length; i++) acc.push(acc[i - 1] + Math.hypot(ep[i][0] - ep[i - 1][0], ep[i][1] - ep[i - 1][1]));
      const step = low ? 30 : 14;
      for (let sv = step / 2, i = 1; sv < acc[acc.length - 1]; sv += step) {
        while (i < acc.length - 1 && acc[i] < sv) i++;
        const f = clamp((sv - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]), 0, 1), g = ea + i - 1 + f;
        const x = ep[i - 1][0] + (ep[i][0] - ep[i - 1][0]) * f, z = ep[i - 1][1] + (ep[i][1] - ep[i - 1][1]) * f;
        const nx = en[i - 1][0], nz = en[i - 1][1], d = da.dL(Math.round(g)) - 1.1, y0 = da.lowTop(Math.round(g)) + 13, y1 = da.h0(Math.round(g)) - 9;
        if (y1 - y0 > 3) piers.push(mat4(x + nx * d, (y0 + y1) / 2, z + nz * d, 1.6, y1 - y0, 1.6, Math.atan2(nx, nz)));
      }
      inst(new THREE.BoxGeometry(1, 1, 1), mCream, piers);
    }

    // ---------- 6. green side wings, rotunda, north service building, south buildings ----------
    {
      const wing = mesher(), legs = mesher();
      for (const s of [1, -1]) {
        const xa = s * 343, xb = s * 376;
        wing.quad([xa, 100, -284], [xa, 100, -45], [xb, 62, -45], [xb, 62, -284]);
        for (let z = -284; z <= -45; z += (low ? 60 : 30)) legs.beam([xa, 98, z], [xb, 2, z], 1.6);
        legs.beam([xb, 62, -284], [xb, 62, -45], 2.4); legs.beam([xa, 99, -284], [xa, 99, -45], 2.4);
      }
      ADD(wing.geo(), lam(GREEN)); ADD(legs.geo(), mSteel);
      // west rotunda (round gate hall) beside the wing
      const ro = new THREE.Group(); ro.position.set(-392, 0, -30); G.add(ro);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 84, 28, 1, true), mBrick); body.position.y = 42; ro.add(body);
      if (!low) { const band = new THREE.Mesh(new THREE.CylinderGeometry(28, 28, 5, 28), mCream); band.position.y = 84; ro.add(band); }
      const dome = new THREE.Mesh(new THREE.SphereGeometry(27, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), mCream); dome.scale.y = 0.55; dome.position.y = 86; ro.add(dome);
      const rwin = []; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; rwin.push(mat4(-392 + Math.cos(a) * 26.4, 14, -30 - Math.sin(a) * 26.4, 9, 40, 1, Math.atan2(Math.cos(a), -Math.sin(a)))); }
      inst(archGeo, mDark, rwin);
      // north service building (measured roof polygon), south buildings outside the round apron, east sheds
      const roofSide = low ? [mCream, mCream] : [mCream, mStone];
      prism(NORTH_ROOF, 58, low ? [mStone] : [mCream, mBrick]);
      const arcPts = (a0, a1, r) => { const o = []; for (let k = 0; k <= 8; k++) { const a = (a0 + (a1 - a0) * k / 8) * D2R; o.push([r * Math.sin(a), r * Math.cos(a)]); } return o; };
      prism([...arcPts(-51, -23, 243), [-95, 238], [-189, 238]], 38, low ? [mStone] : roofSide);
      prism([...arcPts(22, 43, 243), [168, 236], [90, 238]], 38, low ? [mStone] : roofSide);
      const sh = mesher(); sh.box(257, 15, 148, 145, 30, 27); ADD(sh.geo(), lam('#9a9a8c'));
    }

    // ---------- 7. signature features: pool in right-center, scoreboard on the north wall ----------
    {
      const A = [68.9, -407.2], B = [143.9, -347.4], t = 0.45;                 // wall segment between the deep corner and the 22.5 deg point
      const cx = A[0] + (B[0] - A[0]) * t, cz = A[1] + (B[1] - A[1]) * t, ang = -Math.atan2(B[1] - A[1], B[0] - A[0]);
      const grp = new THREE.Group(); grp.position.set(cx, 0, cz); grp.rotation.y = ang; G.add(grp);       // local -z = outward from the field
      const dk = mesher(); dk.box(0, 6, -20, 58, 12, 34);                                                   // pool deck and three terraces behind it
      for (let k = 0; k < 3; k++) { const hh = 12 + 6 * (k + 1); dk.box(0, hh / 2, -41 - 8 * k, 58, hh, 8); }
      grp.add(new THREE.Mesh(dk.geo(), mCream));
      const rim = mesher(); rim.box(0, 12, -16, 43, 1.2, 19); grp.add(new THREE.Mesh(rim.geo(), mStone));
      const water = new THREE.Mesh(new THREE.BoxGeometry(40, 0.6, 16), new THREE.MeshLambertMaterial({ color: '#6fb0b8' })); water.position.set(0, 12.7, -16); grp.add(water);
    }

    // ---------- 7b. center-field backdrop (photos 3, 6, 7): main video board on the batter's eye, support towers, header, clock,
    //              flags, six blank advertising panels with light ladders between them, small side boards ----------
    {
      const ZB = -425.5;                                                 // board plane (eye front is the CF wall at z -413)
      const faceTex = (w, h, cols, rows) => textTexture((g, W, H) => {   // blank dark face with a plain line grid
        g.fillStyle = '#1e2a2c'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(150,175,170,0.28)'; g.lineWidth = 1;
        for (let i = 1; i < cols; i++) { g.beginPath(); g.moveTo(i * W / cols, 0); g.lineTo(i * W / cols, H); g.stroke(); }
        for (let j = 1; j < rows; j++) { g.beginPath(); g.moveTo(0, j * H / rows); g.lineTo(W, j * H / rows); g.stroke(); }
        g.strokeStyle = '#8fa89f'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
      }, w, h);
      const mFace = new THREE.MeshBasicMaterial({ map: faceTex(256, 128, 24, 10) });
      const mSide = new THREE.MeshBasicMaterial({ map: faceTex(128, 128, 6, 12) });
      const mPanel = new THREE.MeshBasicMaterial({ map: faceTex(128, 160, 4, 8) });
      const mLamp = new THREE.MeshBasicMaterial({ color: '#e7ecdf' });
      const mFrameDk = lam('#3d4741');
      // measured heights (photo 7, scale = 25 ft CF wall): video face 60 to 103 ft, header crest to ~128 ft, clock ~134 ft
      const parts7 = mesher(); const st7 = mesher();
      parts7.box(0, 58.5, ZB - 1.6, 140, 3, 9);                                              // catwalk / lower frame under the face
      parts7.box(0, 104.5, ZB - 1.6, 140, 3, 9);                                             // top frame
      for (const sx of [-1, 1]) parts7.box(sx * 69.5, 81.5, ZB - 1.6, 3, 49, 9);            // side frames
      parts7.box(0, 51, ZB - 3, 126, 14, 8);                                                 // dark base block between eye top and face
      ADD(parts7.geo(), mFrameDk);
      // faces: left lineup panel, main video, right panel (blank)
      const faceY = 81.5, faceH = 46;
      const f1 = ADD(new THREE.PlaneGeometry(28, faceH), mSide); f1.position.set(-52, faceY, ZB + 0.1);
      const f2 = ADD(new THREE.PlaneGeometry(78, faceH), mFace); f2.position.set(-1, faceY, ZB + 0.1);
      const f3 = ADD(new THREE.PlaneGeometry(26, faceH), mSide); f3.position.set(53, faceY, ZB + 0.1);
      // header: dark sign plate with the ballpark name in plain text, above it a clock and two flagpoles
      const hdr = textTexture((g, w, h) => {
        g.fillStyle = '#34413b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#cdbf98'; g.lineWidth = 4; g.strokeRect(5, 5, w - 10, h - 10);
        g.fillStyle = '#e6dabb'; g.font = 'bold 44px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CHASE FIELD', w / 2, h / 2 + 2);
      }, 512, 80);
      const hp = ADD(new THREE.PlaneGeometry(70, 11), new THREE.MeshBasicMaterial({ map: hdr })); hp.position.set(0, 113.5, ZB + 0.7);
      const hb = mesher(); hb.box(0, 113, ZB - 1, 74, 15, 3); hb.box(0, 121.5, ZB - 1, 56, 3, 3); ADD(hb.geo(), mFrameDk);       // header box and crown shelf
      const clock = ADD(new THREE.CylinderGeometry(5, 5, 1.2, 24), new THREE.MeshBasicMaterial({ color: '#efe9d4' })); clock.rotation.x = Math.PI / 2; clock.position.set(0, 130, ZB - 0.4);
      const hands = mesher(); hands.box(0, 130.8, ZB + 0.4, 0.5, 3.4, 0.3); hands.box(1.1, 130, ZB + 0.4, 2.2, 0.5, 0.3); ADD(hands.geo(), lam('#2a2e2b'));
      const stem = mesher(); stem.box(0, 124.5, ZB - 1, 1.6, 7, 1.6); ADD(stem.geo(), mSteel);
      for (const [fx, c1, c2] of [[-42, '#8f4a42', '#e0d6bd'], [32, '#b58b44', '#6d7f78']]) {   // two flagpoles, plain two-band flags
        const pole = ADD(new THREE.CylinderGeometry(0.4, 0.5, 34, 6), lam('#d8d4c4')); pole.position.set(fx, 129, ZB - 1);
        const f = ADD(new THREE.PlaneGeometry(11, 7), new THREE.MeshBasicMaterial({ map: textTexture((g, w, h) => { g.fillStyle = c1; g.fillRect(0, 0, w, h / 2); g.fillStyle = c2; g.fillRect(0, h / 2, w, h / 2); }, 32, 16) }));
        f.position.set(fx + 5.6, 142, ZB - 1);
      }
      // support: two steel lattice towers beside the board running up to the roof truss, a rear frame back to the north wall
      for (const sx of [-1, 1]) {
        const x = sx * 76, x2 = sx * 82;
        for (const dx of [-3, 3]) st7.beam([x + dx, 42, ZB - 4], [x + dx, 160, ZB - 4], 1.4);
        for (let y = 42; y < 156; y += 14) { st7.beam([x - 3, y, ZB - 4], [x + 3, y + 14, ZB - 4], 0.8); st7.beam([x + 3, y, ZB - 4], [x - 3, y + 14, ZB - 4], 0.5); }
        st7.beam([x, 60, ZB - 4], [x2 - sx * 4, 60, ZN + 6], 1.2); st7.beam([x, 104, ZB - 4], [x2 - sx * 4, 104, ZN + 6], 1.2);
      }
      for (let k = -3; k <= 3; k++) { st7.beam([k * 22, 58, ZB - 5], [k * 22 + 11, 104, ZN + 6], 0.9); }                   // back bracing to the wall
      ADD(st7.geo(), mSteel);
      // six blank advertising panels (photo 3: 37 ft wide, ~50 ft tall, bottom ~77 ft) and six light ladders (7 ft wide, 53 ft tall) between them
      const pan = [], lad = [], ladFrame = [];
      for (const sg of [-1, 1]) for (const px of [91, 150, 209]) pan.push(mat4(sg * px, 102, ZN + 1.2, 37, 50, 1.4));
      for (const sg of [-1, 1]) for (const lx of [120, 180, 240]) { lad.push(mat4(sg * lx, 101, ZN + 1.6, 6.5, 53, 1.6)); ladFrame.push(mat4(sg * lx, 101, ZN + 1.2, 9, 56, 1.2)); }
      const bx = new THREE.BoxGeometry(1, 1, 1);
      inst(bx, mPanel, pan); inst(bx, mLamp, lad); inst(bx, mSteel, ladFrame);
      // small blank secondary boards below the panels: one left pair, one to the right of the main board (photo 3)
      const sbf = mesher(), mSb = new THREE.MeshBasicMaterial({ map: faceTex(128, 64, 10, 4) });
      for (const [bx0, bw, by, bh] of [[-138, 46, 66, 17], [-99, 28, 66, 17], [90, 50, 68, 19]]) {
        sbf.box(bx0, by, ZN + 1.2, bw + 2, bh + 2, 1.6);
        const sb = ADD(new THREE.PlaneGeometry(bw, bh), mSb); sb.position.set(bx0, by, ZN + 2.1);
      }
      ADD(sbf.geo(), mFrameDk);
    }

    // ---------- 8. views ----------
    const st = tools.foulAt(0.3, dims.d0 + dims.dU * 0.7, dims.h0 + dims.sU * dims.dU * 0.7 + 4.5);
    views.roof = { pos: [-560, 400, 330], look: [0, 100, -140], orbit: true, label: 'Roof' };
    views.gate = { pos: [-70, 26, 520], look: [0, 74, 240], label: 'Home Gate' };
    views.stands = { pos: [st.x, st.y, st.z], look: [-60, 175, -130], label: 'Under Roof' };
  },
};
