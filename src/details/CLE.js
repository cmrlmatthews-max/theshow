// Detail module: Progressive Field (Jacobs Field), Cleveland (opened 1994). Units: feet.
// MEASURED FROM THE SATELLITE SHEET (/home/claude/refs/CLE/survey.png, home plate (801,702) and second base (801,561) of
//  mosaic.png; the mound falls at z = -61):
//  - Outfield wall corners: LF pole (-230,-226), LCF corner (-197,-294) r 354, CF corner (-30,-408) r 409, RCF corner
//    (155,-346) r 379, RF end (227,-236). The CF wall is straight between the two corners and crosses the 400 mark on the line.
//  - Foul-side seat edge: generic bowl fits (foulScale 1, backstop 60 ft behind the plate).
//  - Facade (outer edge of the steel-and-glass wall): 21 stations. Right field: straight 330 ft run from the top end
//    (232,-488) to the corner (414,-218), then straight down the first-base line to (252,14), then an arc behind home
//    (z 256 at x -20) and up the third-base side to (-311,24). Left end: a low tan podium 28 ft high to (-412,-95).
//  - Roof band width: about 62 ft over right field, 42-44 ft along the baselines, 36 ft behind home, 44 ft on the left.
//    The band stops at the top end in right field and at the podium on the left (no roof over the podium).
//  - Seat depth: blue seats 0-82 ft behind the front edge, tan suite wall 95-145 ft on the third-base side, roof 145-190 ft.
//    Upper deck is cut back in right field (starts z ~ -200) and ends at the left-field terrace (z ~ -175).
//  - Scoreboard: 221 ft long on the left-center terraces, centre (-188,-370), parallel to the wall.
//  - Heritage Park terrace and the bullpen turf behind the center and right-center wall (x 53..120, z -448..-400).
// FROM TEXT: posted distances (LF 325 / LCF 370 / CF 400 / RCF 375 / RF 325), wall heights (19 ft in left field, 9 ft
//  elsewhere, 14 ft near the right-field pole), 19 light towers (3 left field, 6 behind third base, 6 behind first base, 4
//  right field; 218 ft), white exposed steel and glass, three decks, 59 ft scoreboard height.
// LEVEL 4 (7 photographs: refs/CLE/photo1-7; satellite sheet; text sources).
//  FACADE (photo 1, 2): open white tubular steel frame (posts, X-bracing, two chords, big arches over three bays) in front of a
//   recessed glass wall, on a low tan stone base with piers and a deep canopy slab; tan brick tower with cream bands at the
//   left-field district end (photo 2); gates are two banded stone piers under the canopy with a steel arch (photo 1).
//  LIGHT TOWERS (photo 7): slender white shaft, tall lattice platform with a grid of round LED lamps. Three stand on the
//   scoreboard top (photo 6), as do two flagpoles and a blank sign frame between the towers.
//  PHOTO SCALE: pedestrians (5.7 ft) beside the gate piers in photo 1 give the canopy underside at about 12-13 ft above the street
//   and the top of the steel frame at about 70-85 ft above the street (+18 ft to the field = 88-100 ft); +-20 % because of
//   wide-angle perspective. Roof underside is set from the upper-deck top (+9 ft, clamped 86-98).
//  SEATING (measured on mosaic.png, resampled along the foul-side normals; row pitch found by peak counting):
//   - Third-base side (t 0.58-0.92): lower deck 29 rows at 3.0 ft pitch = 88-90 ft deep; the next tier starts at d 97 (8 ft gap),
//     19 rows at 3.2 ft pitch are visible out to d 156 where the roof band begins (more rows may run under the roof).
//   - First-base side: lit rows 0-40 ft, row peaks seen in shade out to about 58 ft; the rest of the deck is in shadow.
//     Lower deck taken as 56 ft (RF) to 66 ft (near the dugout); estimated. Suite roofs show at d 88-100.
//   - Behind home: lit rows to 57 ft, deck continues under the upper deck shadow; interpolated 76-82 ft.
//   - 2014-15 removed the upper deck behind right field and down the first-base line (text): upper extent starts at t 0.12 and is
//     shallow there (terraces).
//   - Right-field seats (wall deg 20-45): about 60 ft deep, 20 rows. Left-field bleachers: stepped panels 45-55 ft deep.
//  HEIGHTS (method): row rise x row count. Lower deck 29 rows x 1.2 ft = 35 ft (top about 39 ft above the field at the back).
//   Lower slope 0.40 (1.2 ft per row), upper 1.9 ft per 3.2 ft row (slope 0.60), about 20 rows = 38 ft. Concourse = street level = 18 ft above the field
//   (andrewclem.com). Light towers 218 ft above the field, scoreboard 59 x 221 ft, out-of-town board 10 x 173 ft (Daktronics, sportsvideo.org).
//   (photo 5/4: roof clearance over the top rows is about 15-25 ft, consistent with the above.)
//   Shadow-length method NOT usable on this sheet: the sun is low in the east-southeast, every shadow lands on stands or roofs
//   at an unknown level, and no object of known height has a clean shadow on flat ground.
//  BOARDS: main board 59 x 221 ft; its shadow in the wall unwrap covers wall deg -35 to -8, 50-100 ft behind the wall, so the
//   board sits about 50-65 ft behind the left-center wall and spans roughly deg -36 to -4. Ribbon boards (3.5 ft tall) on the
//   upper-deck fascia, the suite wall and behind home. Faces are blank.
// STILL ESTIMATED: first-base lower-deck depth, heights above the second tier (roof 86-104 ft, +-20 %), light tower
//  positions (spread along the roof edge, not seen on the sheet), gate pavilion positions and size, scoreboard base height (64 ft),
//  support legs, back truss, ribbon board lengths, the exact LCF wall bend.
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
const D2R = Math.PI / 180;

// Facade stations, right-field top end -> corner -> behind home -> left-field podium. [x, z, roofWidth, roofInset, brickTop, corner]
const FAC = [
  [232, -488, 62, 0, 34, 1], [325, -386, 62, 0, 34, 0], [414, -218, 56, 0, 34, 1],
  [336, -102, 44, 0, 34, 0], [252, 14, 42, 0, 34, 0], [236, 50, 42, 0, 34, 0], [218, 95, 41, 0, 34, 0],
  [198, 130, 40, 0, 34, 0], [170, 171, 39, 0, 34, 0], [138, 200, 38, 0, 34, 0], [102, 222, 37, 0, 34, 0],
  [53, 246, 36, 0, 34, 0], [-20, 256, 36, 0, 34, 0], [-84, 242, 37, 0, 34, 0], [-139, 222, 39, 0, 34, 0],
  [-165, 200, 41, 0, 34, 0], [-198, 171, 43, 0, 34, 0], [-227, 131, 44, 0, 34, 0], [-311, 24, 44, 0, 34, 0],
  [-407, -75, 30, 26, 30, 0], [-412, -95, 30, 26, 30, 1],
];

// Seating tables along the bowl: t 0 = right-field pole, 0.5 = behind home, 1 = left-field pole.
const LOW = [[0, 52], [0.12, 56], [0.4, 66], [0.47, 76], [0.5, 82], [0.56, 88], [0.9, 90], [0.96, 80], [1, 64]];   // lower deck depth
const UP0 = [[0.12, 75], [0.3, 82], [0.4, 88], [0.5, 92], [0.56, 97], [0.9, 97], [0.96, 92]];                      // upper deck front offset
const UP1 = [[0.12, 100], [0.3, 128], [0.4, 138], [0.45, 148], [0.5, 155], [0.56, 162], [0.9, 162], [0.96, 150]];  // upper deck back offset
const tab = (v, t) => { if (t <= v[0][0]) return v[0][1]; for (let k = 1; k < v.length; k++) if (t <= v[k][0]) { const [ta, a] = v[k - 1], [tb, b] = v[k]; return a + ((b - a) * (t - ta)) / (tb - ta || 1); } return v[v.length - 1][1]; };
const TS = [0.12, 0.3, 0.4, 0.45, 0.5, 0.56, 0.9, 0.96];

export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 325, h: 19 }, { deg: -33.8, r: 354, h: 19 }, { deg: -33.75, r: 354, h: 9 },
        { deg: -22, r: 366, h: 9 }, { deg: -4.2, r: 409, h: 9 }, { deg: 24.1, r: 379, h: 9 },
        { deg: 43.9, r: 327, h: 9 }, { deg: 43.95, r: 327, h: 14 }, { deg: 45, r: 325, h: 14 },
      ],
      foulScale: 1,
      backstop: 60,
      // lower deck: 29 rows of 3 ft (third base side) -> 88-90 ft; shallower on the first-base side (shade hides the back)
      lower: { depth: LOW, slope: 0.4, extent: [0, 1] },
      hasUpper: true,
      // upper deck: starts at the measured offsets (overhang is lower depth minus front offset, so it is negative where the
      // second tier sits behind the lower deck); 2.1 ft rise per 3.2 ft row
      upper: {
        overhang: TS.map((t) => [t, tab(LOW, t) - tab(UP0, t)]),
        rise: 9,
        depth: TS.map((t) => [t, tab(UP1, t) - tab(UP0, t)]),
        slope: 0.6,
        extent: [0.12, 0.96],
      },
      outfield: { depth: 55, slope: 0.5, spans: [[-45, -8, 52, 0.5], [20, 45, 60, 0.42]], eye: null },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f5640', facade: '#9a6a52', wall: '#2c4a38', cream: '#e8e2d0' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views } = ctx;
    const { sweepSolid, textTexture, wallR, wallH, clamp } = tools;
    const { bPts, bN } = paths;
    const low = ctx.lod === 'low';
    const spec = ctx.spec;
    const N1 = bPts.length - 1;
    const { d0, h0, dU, hTop, D } = dims;
    const STEEL = '#ece9df', GLASS = '#4a5a5e', BRICK = '#b39a74', CREAM = '#e8e2d0', DECK = '#e3e1d6', UNDER = '#bfbfb4';
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const tmp = new THREE.Object3D();
    const bakeGroups = [];                              // groups of plain meshes merged by material at the end (few draw calls)
    const inst = (geo, mat, list) => {
      geo.clearGroups();
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const between = (a, b, w, h) => {
      tmp.position.copy(a).add(b).multiplyScalar(0.5); tmp.lookAt(b); tmp.scale.set(w, h, a.distanceTo(b)); tmp.updateMatrix(); return tmp.matrix.clone();
    };
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const at = (i, d, y) => V(bPts[i][0] + bN[i][0] * d, y, bPts[i][1] + bN[i][1] * d);

    ctx.remove(parts.lights); ctx.remove(parts.scoreboard);

    // ---------- dense facade line: Catmull-Rom between stations, sharp at corner stations
    const STEP = 7;
    const secs = [];                                   // sections of samples { x, z, w, ins, hb, nx, nz }
    {
      const cr = (a, b, c, d, u) => 0.5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
      let start = 0;
      for (let k = 1; k < FAC.length; k++) {
        if (!FAC[k][5] && k < FAC.length - 1) continue;
        const idx = []; for (let j = start; j <= k; j++) idx.push(j);
        const s = [];
        for (let j = 0; j < idx.length - 1; j++) {
          const P = (q) => FAC[idx[clamp(q, 0, idx.length - 1)]];
          const A = P(j - 1), B = P(j), C = P(j + 1), E = P(j + 2);
          const len = Math.hypot(C[0] - B[0], C[1] - B[1]), n = Math.max(1, Math.round(len / STEP));
          for (let q = 0; q < n || (j === idx.length - 2 && q === n); q++) {
            const u = q / n;
            s.push({ x: cr(A[0], B[0], C[0], E[0], u), z: cr(A[1], B[1], C[1], E[1], u), w: B[2] + (C[2] - B[2]) * u, ins: B[3] + (C[3] - B[3]) * u, hb: B[4] + (C[4] - B[4]) * u });
          }
        }
        for (let i = 0; i < s.length; i++) {
          const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
          let tx = b.x - a.x, tz = b.z - a.z; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
          let nx = tz, nz = -tx;
          if (nx * (s[i].x - 0) + nz * (s[i].z + 120) < 0) { nx = -nx; nz = -nz; }
          s[i].nx = nx; s[i].nz = nz;
        }
        secs.push(s); start = k;
      }
    }
    // roof underside heights per sample: upper-deck top at the nearest bowl point + clearance, smoothed (roof suspended on arches)
    for (const sc of secs) {
      const raw = sc.map((p) => {
        let bg = 0, bd = 1e9; for (let g = 0; g <= N1; g += 2) { const d = (bPts[g][0] - p.x) ** 2 + (bPts[g][1] - p.z) ** 2; if (d < bd) { bd = d; bg = g; } }
        return clamp(dims.deckAt.hTop(bg) + 9, 86, 98);
      });
      sc.forEach((p, i) => { let a = 0, c = 0; for (let k = -6; k <= 6; k++) { const q = raw[clamp(i + k, 0, sc.length - 1)]; a += q; c++; } p.yi = a / c; p.yo = p.yi + 6; });
    }
    const pOut = (p, off = 0, y = 0) => [p.x + p.nx * off, y, p.z + p.nz * off];

    // geometry accumulator for custom strips
    const acc = () => ({ pos: [], idx: [] });
    const strip = (g, A, B) => {
      const base = g.pos.length / 3;
      for (let i = 0; i < A.length; i++) g.pos.push(...A[i], ...B[i]);
      for (let i = 0; i < A.length - 1; i++) { const a = base + 2 * i; g.idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    };
    const quad = (g, a, b, c, d) => { const base = g.pos.length / 3; g.pos.push(...a, ...b, ...c, ...d); g.idx.push(base, base + 1, base + 2, base, base + 2, base + 3); };
    const mesh = (g, color) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3)); geo.setIndex(g.idx); geo.computeVertexNormals();
      return ctx.add(geo, ctx.lam(color));
    };

    // ---------- 1. Exterior facade (photo 1, 2): tan stone base with gate piers and a deep canopy slab at about 28 ft above the street;
    //  above it an open white steel frame (posts, X-bracing, two chords, big tubular arches) in front of a recessed glass wall.
    {
      const wall = acc(), plinth = acc(), cornice = acc(), glass = acc(), back = acc(), chord = acc();
      const posts = [], diag = [], arches = [], piers = [];
      const TAN = '#b39a74';
      for (const s of secs) {
        strip(wall, s.map((p) => pOut(p, -3, 18)), s.map((p) => pOut(p, -3, p.hb)));                      // recessed gate wall (dark under canopy)
        strip(back, s.map((p) => pOut(p, -3.5, p.hb)), s.map((p) => pOut(p, -3.5, p.hb + 3)));
        strip(plinth, s.map((p) => pOut(p, 0.8, 0)), s.map((p) => pOut(p, 0.8, 18)));                      // street is 18 ft above the field
        strip(cornice, s.map((p) => pOut(p, 1.6, 18)), s.map((p) => pOut(p, 1.6, 19.5)));
        // canopy slab 10 ft deep: front fascia, top, underside
        strip(cornice, s.map((p) => pOut(p, 10, p.hb - 3)), s.map((p) => pOut(p, 10, p.hb + 1)));
        strip(cornice, s.map((p) => pOut(p, 10, p.hb + 1)), s.map((p) => pOut(p, -3, p.hb + 1)));
        strip(cornice, s.map((p) => pOut(p, -3, p.hb - 3)), s.map((p) => pOut(p, 10, p.hb - 3)));
        const tall = s.filter((p) => p.hb > 40).length > 2;
        if (tall) {
          strip(glass, s.map((p) => pOut(p, -2, p.hb + 1)), s.map((p) => pOut(p, -2, p.yo - 2)));          // recessed glazing
          const lv = (f) => (p) => pOut(p, 2.5, p.hb + 1 + (p.yo - 2 - p.hb - 1) * f);
          strip(chord, s.map((p) => lv(0.5)(p)), s.map((p) => { const q = lv(0.5)(p); return [q[0], q[1] + 1.4, q[2]]; }));
          strip(chord, s.map((p) => lv(1)(p)), s.map((p) => { const q = lv(1)(p); return [q[0], q[1] + 1.8, q[2]]; }));
        }
        const every = low ? 6 : 3;                                                                          // post every 21 ft (42 on phones)
        let prev = null, k = 0;
        for (let i = 1; i < s.length - 1; i += every) {
          const p = s[i], ry = Math.atan2(p.nx, p.nz);
          if (p.hb < 40) continue;
          const bot = p.hb + 1, top = p.yo - 2;
          posts.push(mat4(p.x + p.nx * 2.5, (top + bot) / 2, p.z + p.nz * 2.5, 1.5, top - bot, 1.5, ry));
          piers.push(mat4(p.x + p.nx * 2.2, (p.hb - 3 + 18) / 2, p.z + p.nz * 2.2, 5.5, p.hb - 21, 5, ry));   // tan stone piers under the canopy
          if (prev) {                                                                                       // X bracing: lower bay and upper bay
            const mid = (bot + top) / 2, sgn = k % 2 ? 1 : -1;
            const A1 = V(prev.x + prev.nx * 2.5, sgn > 0 ? bot : mid, prev.z + prev.nz * 2.5), B1 = V(p.x + p.nx * 2.5, sgn > 0 ? mid : bot, p.z + p.nz * 2.5);
            diag.push(between(A1, B1, 0.9, 0.9));
            if (!low) diag.push(between(V(prev.x + prev.nx * 2.5, sgn > 0 ? mid : top, prev.z + prev.nz * 2.5), V(p.x + p.nx * 2.5, sgn > 0 ? top : mid, p.z + p.nz * 2.5), 0.9, 0.9));
          }
          if (k % 3 === 1 && i + 2 * every < s.length) {                                                    // big tubular arch over three bays
            const q = s[Math.min(s.length - 1, i + every)], tx = -q.nz, tz = q.nx;
            tmp.position.set(q.x + q.nx * 3.2, bot + 1, q.z + q.nz * 3.2); tmp.rotation.set(0, Math.atan2(-tz, tx), 0);
            tmp.scale.set(every * 7 * 1.4, (top - bot) * 0.85, 1); tmp.updateMatrix(); arches.push(tmp.matrix.clone());
          }
          prev = p; k++;
        }
      }
      mesh(wall, '#6d5a47'); mesh(back, '#7d6a54'); mesh(plinth, '#a89d88'); mesh(cornice, CREAM);
      if (glass.pos.length) mesh(glass, GLASS);
      if (chord.pos.length) mesh(chord, STEEL);
      inst(new THREE.BoxGeometry(1, 1, 1), basic(STEEL), posts);
      inst(new THREE.BoxGeometry(1, 1, 1), ctx.lam(TAN), piers);
      if (diag.length) inst(new THREE.BoxGeometry(1, 1, 1), basic(STEEL), diag);
      if (arches.length && !low) inst(new THREE.TorusGeometry(1, 0.012, 4, 14, Math.PI), basic(STEEL), arches);
    }

    // ---------- 2. Roof band: white deck between the measured edges, underside ribs and columns
    {
      const top = acc(), under = acc(), fas = acc();
      const ribs = [], cols = [], arches = [], steelM = basic(STEEL);
      const w3 = (p, off, y) => pOut(p, off, y);
      let first = null, last = null, ci = 0;
      for (const s of secs) {
        const edge = (p) => -p.ins;                      // outer deck edge (negative = pulled in from the facade)
        const inEdge = (p) => -p.ins - p.w;
        strip(top, s.map((p) => w3(p, inEdge(p), p.yi + 1.4)), s.map((p) => w3(p, edge(p) + 1.5, p.yo + 1.4)));
        strip(under, s.map((p) => w3(p, inEdge(p), p.yi)), s.map((p) => w3(p, edge(p) + 1.5, p.yo)));
        strip(fas, s.map((p) => w3(p, inEdge(p), p.yi - 1.8)), s.map((p) => w3(p, inEdge(p), p.yi + 1.6)));
        strip(fas, s.map((p) => w3(p, edge(p) + 1.5, p.yo - 2.2)), s.map((p) => w3(p, edge(p) + 1.5, p.yo + 1.8)));
        const rEvery = low ? 4 : 2;
        for (let i = 0; i < s.length; i += rEvery) {   // underside trusses across the band every 14 ft (28 on phones)
          const p = s[i];
          ribs.push(between(V(...w3(p, inEdge(p), p.yi - 0.8)), V(...w3(p, edge(p) + 1.5, p.yo - 0.8)), 0.9, 1.8));
        }
        for (let i = 2; i < s.length; i += low ? 8 : 4) {   // tubular steel arches that carry the roof, every 28 ft (56 on phones)
          const p = s[i], wd = p.w - 1.5, mid = -p.ins - p.w / 2 + 0.75, ang = Math.atan2(-p.nz, p.nx), tilt = Math.atan2(8, wd);
          tmp.position.set(p.x + p.nx * mid, (p.yi + p.yo) / 2 + 1.6, p.z + p.nz * mid);
          tmp.rotation.set(0, 0, 0); tmp.rotateY(ang); tmp.rotateZ(tilt); tmp.scale.set(wd / 2, 9, 1); tmp.updateMatrix(); arches.push(tmp.matrix.clone());
        }
        for (let i = 0; i < s.length; i += low ? 8 : 4) {   // columns along the outer edge, every 28 ft
          const p = s[i]; if (p.ins > 5) continue;
          const o = w3(p, -1.2, 0); cols.push(mat4(o[0], (p.yo - 1) / 2, o[2], 1, p.yo - 1, 1));
        }
        if (!first) first = s[0]; last = s[s.length - 1]; ci++;
      }
      // end caps of the roof band: right-field top end and the left podium end
      const cap = acc();
      for (const p of [first, last]) {
        const a = w3(p, -p.ins - p.w, p.yi - 1.8), b = w3(p, -p.ins + 1.5, p.yo - 2.2), c = w3(p, -p.ins + 1.5, p.yo + 1.8), d = w3(p, -p.ins - p.w, p.yi + 1.6);
        quad(cap, a, b, c, d);
      }
      mesh(top, DECK); mesh(under, UNDER); mesh(fas, STEEL); mesh(cap, STEEL);
      inst(new THREE.BoxGeometry(1, 1, 1), steelM, ribs);
      inst(new THREE.CylinderGeometry(0.9, 1.2, 1, 7), steelM, cols);
      if (arches.length) inst(new THREE.TorusGeometry(1, 0.035, 4, low ? 8 : 12, Math.PI), steelM, arches);
    }

    // ---------- 3. Gate pavilions: brick towers with a glazed arch (home gate large)
    {
      const flat = secs.flat();
      const near = (x, z) => { let b = flat[0], bd = 1e9; for (const p of flat) { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; b = p; } } return b; };
      const gates = [[-10, 256, 1.0], [218, 95, 0.7], [-198, 171, 0.7]];
      for (const [gx, gz, sc] of gates) {
        const p = near(gx, gz), ry = Math.atan2(p.nx, p.nz), H = 50 + 22 * sc;
        const g = new THREE.Group(); g.position.set(p.x + p.nx * 8, 0, p.z + p.nz * 8); g.rotation.y = ry; G.add(g); bakeGroups.push(g);
        const w = 56 * sc, ph = 36;                                                              // piers reach the canopy (photo 1)
        for (const sx of [-1, 1]) {
          const tw = new THREE.Mesh(new THREE.BoxGeometry(11 * sc, ph + 4, 15), ctx.lam(BRICK)); tw.position.set(sx * w / 2, (ph + 4) / 2 - 2, 0); g.add(tw);
          for (const y of [24, 30]) { const bd = new THREE.Mesh(new THREE.BoxGeometry(11.8 * sc, 1.2, 15.8), ctx.lam(CREAM)); bd.position.set(sx * w / 2, y, 0); g.add(bd); }
        }
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(w, 3, 15), ctx.lam(CREAM)); lintel.position.set(0, ph + 2.5, 0); g.add(lintel);
        // sign backing above the lintel is left blank; the steel arch of the main facade passes behind it
        for (let k = -1; k <= 1; k += low ? 2 : 1) {
          const rib = new THREE.Mesh(new THREE.TorusGeometry(w / 2 - 4, 0.8, 5, 18, Math.PI), basic(STEEL)); rib.position.set(0, ph + 4, k * 4.5); g.add(rib);
        }
      }
    }

    // ---------- 3b. Left-field district tower (photo 2): square tan brick tower with cream bands and a stepped cap, about 80 ft above street
    {
      const flat = secs.flat(), p = flat[flat.length - 1], ry = Math.atan2(p.nx, p.nz);
      const g = new THREE.Group(); g.position.set(p.x + p.nx * 4 - p.nz * 14, 0, p.z + p.nz * 4 + p.nx * 14); g.rotation.y = ry; G.add(g); bakeGroups.push(g);
      const add1 = (geo, col, y) => { const m = new THREE.Mesh(geo, ctx.lam(col)); m.position.y = y; g.add(m); return m; };
      add1(new THREE.BoxGeometry(24, 86, 24), BRICK, 43);
      for (const y of [26, 46, 66]) add1(new THREE.BoxGeometry(25.2, 2.2, 25.2), CREAM, y);
      add1(new THREE.BoxGeometry(27, 3, 27), CREAM, 87.5); add1(new THREE.BoxGeometry(20, 4, 20), BRICK, 91);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) add1(new THREE.BoxGeometry(3, 5, 3), CREAM, 93.5).position.set(sx * 11, 93.5, sz * 11);
    }

    // ---------- 4. Light towers (photo 7): 19 slender white shafts to 218 ft above the field, each topped by a tall lattice platform
    //  carrying a grid of round LED lamps. Three of them stand on the scoreboard top (photo 6); the rest along the roof edge.
    const makeTowers = (list) => {
      const H = 218, masts = [], banks = [], lamps = [], cols = low ? 2 : 4, rows = low ? 4 : 7;
      for (const [x, z, y0] of list) {
        const ry = Math.atan2(-x, -150 - z);
        masts.push(mat4(x, y0 + (H - 30 - y0) / 2, z, 1, H - 30 - y0, 1));
        banks.push(mat4(x, H - 15, z, 1, 1, 1, ry));
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          tmp.position.set(x, H - 15, z); tmp.rotation.set(0, ry, 0); tmp.updateMatrix();
          lamps.push(tmp.matrix.clone().multiply(new THREE.Matrix4().makeTranslation((c - (cols - 1) / 2) * 3.0, (r - (rows - 1) / 2) * 4.3, 1.4)));
        }
      }
      inst(new THREE.CylinderGeometry(1.5, 2.3, 1, 8), basic(STEEL), masts);
      inst(new THREE.BoxGeometry(12, 30, 1.6), ctx.lam('#8f918b'), banks);
      inst(new THREE.CircleGeometry(1.25, 7), basic('#fff7d8'), lamps);
    };
    {
      const flat = secs.flat();
      const pick = (zt, side) => { let b = null, bd = 1e9; for (const p of flat) { if (side * p.x < 0) continue; const d = Math.abs(p.z - zt); if (d < bd) { bd = d; b = p; } } return b; };
      const spots = [];
      const onRoof = (p) => [p.x - p.nx * 14, p.z - p.nz * 14];
      for (const zt of [-170, -100, -30, 40, 110, 175]) spots.push(onRoof(pick(zt, 1)));      // first base side (east)
      for (const zt of [-60, -10, 45, 100, 155, 200]) spots.push(onRoof(pick(zt, -1)));       // third base side (west)
      for (const zt of [-450, -390, -330, -270]) spots.push(onRoof(flat.filter((p) => p.x > 150 && p.z < -240).reduce((b, p) => (!b || Math.abs(p.z - zt) < Math.abs(b.z - zt) ? p : b), null)));  // right field
      makeTowers(spots.map(([x, z]) => [x, z, 18]));
    }

    // ---------- 5. Scoreboards (blank faces): main 59 x 221 ft board behind the left-center terraces, out-of-town board,
    //  side wings, back truss, catwalks, support legs, top sign frame (blank). Positioned from the wall unwrap (deg -36..-4, 64 ft out).
    {
      const A = tools.wallAt(-35, 64, 0), B = tools.wallAt(-4, 64, 0);
      const cx = (A.x + B.x) / 2, cz = (A.z + B.z) / 2, ry = Math.atan2(-(B.z - A.z), B.x - A.x);   // local +x along the chord
      const bw = 221, bh = 59, y0 = 54, yc = y0 + bh / 2;
      const g = new THREE.Group(); g.position.set(cx, yc, cz);
      // face normal must point to the field: local +z after rotation
      g.rotation.y = -Math.atan2(B.z - A.z, B.x - A.x);
      const fz = new THREE.Vector3(0, 0, 1).applyEuler(g.rotation);
      if (fz.x * (0 - cx) + fz.z * (-150 - cz) < 0) g.rotation.y += Math.PI;
      G.add(g); bakeGroups.push(g);
      const mk = (geo, mat, x, y, z, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
      const white = ctx.lam('#cfcab8'), steel = basic(STEEL), dark = ctx.lam('#3a3f3d');
      const face = textTexture((c, w, h) => {
        c.fillStyle = '#1f2527'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4b5557'; c.lineWidth = 2;
        for (let i = 0; i <= 12; i++) { c.beginPath(); c.moveTo(i * w / 12, 0); c.lineTo(i * w / 12, h); c.stroke(); }
        for (let j = 0; j <= 4; j++) { c.beginPath(); c.moveTo(0, j * h / 4); c.lineTo(w, j * h / 4); c.stroke(); }
      }, 768, 208);
      mk(new THREE.PlaneGeometry(143, 43), new THREE.MeshBasicMaterial({ map: face }), 0, 5, 2.1);                          // central video
      mk(new THREE.PlaneGeometry(143, 9), new THREE.MeshBasicMaterial({ color: '#2d3436' }), 0, -bh / 2 + 6, 2.1);          // ticker strip below it
      for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) mk(new THREE.PlaneGeometry(33, 15.5), new THREE.MeshBasicMaterial({ color: k % 2 ? '#3a403f' : '#2b3234' }), sx * (bw / 2 - 19.5), bh / 2 - 9.5 - k * 18, 2.1);   // blank wing panels
      for (const sx of [-1, 1]) mk(new THREE.BoxGeometry(2, bh - 4, 3), white, sx * 73.5, 0, 0.6);
      // frame
      mk(new THREE.BoxGeometry(bw + 6, 3, 5), white, 0, bh / 2 - 1.5, 0); mk(new THREE.BoxGeometry(bw + 6, 3, 5), white, 0, -bh / 2 + 1.5, 0);
      for (const sx of [-1, 1]) mk(new THREE.BoxGeometry(3, bh, 5), white, sx * (bw / 2 + 1.5), 0, 0);
      // out-of-town display 173 x 10 ft below the main board
      mk(new THREE.BoxGeometry(177, 12, 3), white, 0, -bh / 2 - 8.5, -0.5);
      mk(new THREE.PlaneGeometry(173, 10), new THREE.MeshBasicMaterial({ map: textTexture((c, w, h) => { c.fillStyle = '#1f2527'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4b5557'; c.lineWidth = 2; for (let i = 0; i <= 18; i++) { c.beginPath(); c.moveTo(i * w / 18, 0); c.lineTo(i * w / 18, h); c.stroke(); } }, 512, 32) }), 0, -bh / 2 - 8.5, 1.2);
      // three light towers rise from the board top; two flagpoles at the ends (plain cloth, no marks)
      const wp = (lx) => new THREE.Vector3(lx, 0, -9).applyMatrix4(g.matrixWorld);
      g.updateMatrixWorld(true);
      makeTowers([-62, 0, 62].map((lx) => { const w = wp(lx); return [w.x, w.z, y0 + bh]; }));
      for (const sx of [-1, 1]) {
        mk(new THREE.CylinderGeometry(0.5, 0.7, 34, 6), steel, sx * (bw / 2 - 6), bh / 2 + 17, -4);
        mk(new THREE.PlaneGeometry(12, 7), new THREE.MeshBasicMaterial({ color: '#d9d2bc', side: THREE.DoubleSide }), sx * (bw / 2 - 6) + (sx > 0 ? -6.5 : 6.5), bh / 2 + 30, -4);
      }
      // top sign frame: blank backing panel on a truss (no marks)
      mk(new THREE.BoxGeometry(84, 16, 3), white, 0, bh / 2 + 12, -1); mk(new THREE.PlaneGeometry(78, 11), new THREE.MeshBasicMaterial({ color: '#2d3436' }), 0, bh / 2 + 12, 0.7);
      for (const sx of [-1, 1]) mk(new THREE.BoxGeometry(2, 8, 2), steel, sx * 38, bh / 2 + 3.5, -1);
      // back structure: vertical trusses front/back every 22 ft with diagonals, 16 ft deep, chords top and bottom
      const cols = [], diag = [], bays = Math.round(bw / (low ? 44 : 22));
      const bayW = bw / bays;
      for (let i = 0; i <= bays; i++) {
        const x = -bw / 2 + i * bayW;
        cols.push(mat4(x, 0, -3, 1.4, bh, 1.4), mat4(x, 0, -17, 1.4, bh, 1.4));
        if (i < bays) { diag.push(between(V(x, -bh / 2, -3), V(x + bayW, bh / 2, -17), 0.8, 0.8)); if (!low) diag.push(between(V(x, bh / 2, -3), V(x + bayW, -bh / 2, -17), 0.8, 0.8)); }
      }
      for (const yy of [-bh / 2, bh / 2]) for (const zz of [-3, -17]) mk(new THREE.BoxGeometry(bw, 1.6, 1.6), steel, 0, yy, zz);
      const instG = (geo, mat, list) => { const m = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((q, k) => m.setMatrixAt(k, q)); g.add(m); return m; };
      instG(new THREE.BoxGeometry(1, 1, 1), steel, cols); instG(new THREE.BoxGeometry(1, 1, 1), steel, diag);
      // catwalks (bottom and top) with rails
      for (const [yy, zz] of [[-bh / 2 - 15, -9], [bh / 2 + 3.2, -9]]) {
        mk(new THREE.BoxGeometry(bw, 0.8, 8), dark, 0, yy, zz);
        mk(new THREE.BoxGeometry(bw, 0.5, 0.5), steel, 0, yy + 3.5, zz + 4); mk(new THREE.BoxGeometry(bw, 0.5, 0.5), steel, 0, yy + 3.5, zz - 4);
      }
      // support legs: two columns on each of four bents, down to the ground, with cross bracing
      const legs = [], braces = [], gy = -yc;
      for (const bx of [-0.42, -0.14, 0.14, 0.42]) {
        const x = bx * bw;
        legs.push(mat4(x, gy / 2 + (-bh / 2) / 2 - 2, -3, 3.2, -gy - bh / 2 + 4, 3.2), mat4(x, gy / 2 + (-bh / 2) / 2 - 2, -17, 3.2, -gy - bh / 2 + 4, 3.2));
        braces.push(between(V(x, gy + 6, -3), V(x, -bh / 2 - 12, -17), 1.2, 1.2), between(V(x, gy + 6, -17), V(x, -bh / 2 - 12, -3), 1.2, 1.2));
      }
      instG(new THREE.BoxGeometry(1, 1, 1), steel, legs); instG(new THREE.BoxGeometry(1, 1, 1), steel, braces);
    }

    // ---------- 5b. Ribbon boards (3.5 ft tall, blank): upper-deck fascia, suite wall, club wall behind home
    {
      const rib = acc(), ribM = [];
      const ribbon = (t0, t1, off, yOf) => {
        const [p, n] = tools.cut(t0, t1), a0 = Math.round(t0 * N1), A = [], B = [];
        p.forEach((q, i) => { const gI = a0 + i, d = off(gI), y = yOf(gI); A.push([q[0] + n[i][0] * d, y, q[1] + n[i][1] * d]); B.push([q[0] + n[i][0] * d, y + 3.5, q[1] + n[i][1] * d]); });
        strip(rib, A, B);
      };
      const da = dims.deckAt;
      ribbon(0.2, 0.96, (gI) => da.d0(gI) - 0.5, (gI) => da.h0(gI) - 5.2);                       // upper ribbon (upper deck fascia)
      ribbon(0.58, 0.9, (gI) => da.dL(gI) - 0.5, (gI) => da.lowTop(gI) + 9);                      // suite ribbon on the suite wall
      ribbon(0.43, 0.57, (gI) => da.dL(gI) - 0.5, (gI) => da.lowTop(gI) + 3);                     // club ribbon behind home
      mesh(rib, '#252b2d');
    }

    // ---------- 6. Center field: terraced Heritage Park with trees, bullpen turf behind the right-center wall
    {
      const [p, n] = tools.span(-7, 21);
      for (const [d0_, d1_, y] of [[2, 14, 10], [14, 26, 16], [26, 38, 22]]) {
        ctx.add(sweepSolid(p, n, () => [[d0_, 0], [d0_, y], [d1_, y], [d1_, 0]], [MAT.WALL, MAT.WALL, MAT.WALL, -1], MAT.WALL), M);
      }
      const trees = [];
      for (let i = 1; i < p.length - 1; i += low ? 4 : 2) trees.push(mat4(p[i][0] + n[i][0] * (46 + (i % 3) * 8), 24 + (i % 3) * 3, p[i][1] + n[i][1] * (46 + (i % 3) * 8), 7, 14, 7));
      inst(new THREE.ConeGeometry(1, 1, 7), ctx.lam('#3d6b46'), trees);
      // bullpen turf: one 67 x 45 ft pad centered at (87,-424), along the wall direction
      const bp = new THREE.Mesh(new THREE.BoxGeometry(67, 1.2, 45), ctx.lam('#4a7a45'));
      bp.position.set(87, 11, -424); bp.rotation.y = -Math.atan2(62, 185); G.add(bp);
      if (!low) { const mnd = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.4, 14), ctx.lam('#a96a47')); mnd.position.set(78, 12, -414); G.add(mnd); }
    }

    // ---------- 7. Terrace Club: glass band on the upper deck along the left-field line
    {
      const [p, n] = tools.cut(0.86, 0.965), a0 = Math.round(0.86 * N1), da = dims.deckAt;
      ctx.add(sweepSolid(p, n, (i) => { const d = da.d0(a0 + i), h = da.h0(a0 + i); return [[d + 2, h + 4], [d + 2, h + 15], [d + 6, h + 15], [d + 6, h + 4]]; }, [MAT.SHADE, MAT.SHADE, MAT.SHADE, MAT.SHADE], MAT.SHADE), M);
      ctx.add(sweepSolid(p, n, (i) => { const d = da.d0(a0 + i), h = da.h0(a0 + i); return [[d + 1, h + 15], [d + 1, h + 17], [d + 9, h + 17], [d + 9, h + 15]]; }, [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
    }

    // ---------- merge the plain meshes of the gates, tower and scoreboard by material
    {
      G.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(G.matrixWorld).invert(), buckets = new Map();
      for (const grp of bakeGroups) {
        const list = []; grp.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !o.material.map) list.push(o); });
        for (const o of list) {
          const geo = o.geometry.clone(); geo.clearGroups(); geo.applyMatrix4(inv.clone().multiply(o.matrixWorld));
          for (const k of Object.keys(geo.attributes)) if (k !== 'position' && k !== 'normal') geo.deleteAttribute(k);
          const key = o.material.type + '|' + o.material.color.getHex() + '|' + o.material.side;
          if (!buckets.has(key)) buckets.set(key, { mat: o.material, geos: [] });
          buckets.get(key).geos.push(geo); o.parent.remove(o);
        }
      }
      for (const { mat, geos } of buckets.values()) G.add(new THREE.Mesh(mergeGeometries(geos, false), mat));
    }

    // ---------- views
    {
      const flat = secs.flat();
      const hp = flat.reduce((b, p) => (!b || Math.abs(p.x + 10) + Math.abs(p.z - 256) < Math.abs(b.x + 10) + Math.abs(b.z - 256) ? p : b), null);
      views.gate = { pos: [hp.x + hp.nx * 190, 26, hp.z + hp.nz * 190], look: [hp.x, 50, hp.z], label: 'Home Gate' };
      views.roof = { pos: [-120, 150, -230], look: [60, hTop + 25, 150], label: 'Roof' };
      const gg = Math.round(0.66 * N1), da = dims.deckAt, t = at(gg, da.d0(gg) + da.dU(gg) * 0.5, da.h0(gg) + dims.sU * da.dU(gg) * 0.5 + 5);
      views.stands = { pos: [t.x, t.y, t.z], look: [60, 20, -120], label: 'Stands' };
    }
  },
};
