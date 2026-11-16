// Detail module: Wrigley Field, Chicago (opened 1914, ivy 1937). Units: feet.   LEVEL 4: photographs, heights, seating shape, boards.
//
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft; home plate = origin; field axis ~37 deg east of north):
//  - Outfield wall line (last warning-track pixel on rays every 3 deg, +2 ft): LF pole 355, ~350 at -27 deg (the left-center "well"),
//    364 at -15, 377 at -9, 401 at 0, ~404 at +5 (deepest point right of center), 392 at +15, 372 at +21, 357 at +27, ~347 at +33..+42;
//    right-field corner only ~346 ft. Foul-side seat front ~21-22 ft off the foul line (foulScale 0.7).
//  - Seating shape: for every t along the bowl the distance from the seat front to the roof front edge (ER table below: 48 ft at
//    the poles, 66-76 on the long runs, only 23 ft behind home where the roof starts four rows behind the backstop) and to the outer
//    facade (128-203 ft). Upper-deck front = roof edge - 6 ft; lower deck = upper front + 8 ft on the runs, ~62 ft behind home.
//  - Batter's eye x -38..+42, 40 ft deep (z -441..-401). CF high tier is a wedge: arc rows from r=444 to the flat back edge z=-499
//    (width 76 ft at the back x 10..86, 142 ft at the front x -29..113). Scoreboard footprint x 10..86, z -525..-499 (75 ft wide,
//    rounded back drum 25 ft deep).
//  - Left-field video board: dark structure on the Waveland side, front edge midpoint (-134,-418), long axis along (0.83,-0.56),
//    ~139 ft over everything, ~25 ft deep. Right-field board: centre (235,-315), long axis (0.53,0.85) parallel to Sheffield, ~92 ft.
//  - Roof front edge (6 lamp-stand runs: RF (302,-244)->(248,-158), (222,-114)->(180,-42), (164,-22)->(124,30); LF mirror:
//    (-135,15)->(-168,-45), (-198,-76)->(-250,-161), (-268,-186)->(-325,-276)); outer facade line ~1250 ft long.
//  - Marquee at the street corner behind home (-17, 207); white club roof on the first-base side (x 300..390, z -120..-45).
// FROM TEXT: posted distances 355/368/400/368/353, backstop 55, ivy brick wall 11.5 ft with a wire basket; scoreboard 75 ft x 27 ft
//  (Chicago Landmark report), centre mast lengthened to 40 ft (1969), clock added 1941; facade = "56-foot-high, three-story, open
//  steel-frame" street structure; boards: left 3,990 sq ft (95 x 42), right 2,400 sq ft (80 x 30).
// HEIGHTS (method):
//  - wall 11.5 and the 56-ft facade line: text. Facade levels (ground floor 13 ft, tile canopy 12.5-17, cream to 29.5, brick band
//    to 34, green steel frame above): photo 1, scaled with the 6-ft people in the same plane (~13 px/ft at the wall).
//  - Scoreboard: board 27 ft (text); bottom 54 / top 81: photo 4 horizon method (the board bottom sits at the camera height of the
//    upper-deck section, ~54 ft, checked against the 11.5-ft wall at 400 ft) and the "about 60 ft above the field" text; ticker band 6 ft
//    under the board (photo 7: 5.7 ft by the 75-ft board width); clock dial 9.6 ft (photo 7: 62 px dial / 485 px board); mast 40 ft (text).
//  - CF tier: front 29.5 at r=444 to 48 at the back (photo 7: rows 1.2-1.3 ft under the ticker; sheet: 22 arc rows over 55 ft).
//    Batter's eye 28 ft (photo 4: eye face = 1.6x the 11.5-ft ivy wall above it).
//  - Roof front edge 60, rear edge 78 at the facade; lamp racks 26 ft above the roof edge (photo 6: rack = ~0.7x roof-edge height above
//    the eye line, horizon method; photo 5 agrees within 8 ft). Upper deck front 34, top 62; lower deck top 22-26 (rows 3.1 ft deep).
// STILL ESTIMATED: video-board heights (bottom 42/38), exact roof heights, lower-deck rake, facade bay rhythm and gate positions,
//  ribbon-board lengths, club size, seat colours.
const D2R = Math.PI / 180;

// Outer facade (street wall) line, right-field end -> behind home -> left-field end. [x, z]
const FAC = [[305, -245], [350, -190], [352, -140], [335, -95], [318, -52], [300, -12], [268, 32], [240, 68], [205, 100],
  [172, 132], [138, 160], [98, 188], [55, 210], [10, 221], [-30, 221], [-70, 213], [-108, 198], [-148, 176], [-188, 147],
  [-228, 108], [-250, 76], [-272, 32], [-299, -15], [-322, -55], [-348, -100], [-372, -150], [-396, -203], [-345, -258]];
// Roof front (inner) edge, same direction.
const ROOF_IN = [[302, -244], [275, -200], [248, -158], [235, -135], [222, -114], [200, -78], [180, -42], [164, -22], [145, 5],
  [127, 35], [107, 49], [78, 60], [48, 70], [0, 78], [-38, 78], [-80, 62], [-113, 45], [-135, 15], [-168, -45], [-198, -76],
  [-224, -120], [-250, -161], [-268, -186], [-300, -235], [-325, -276]];
// The six lamp-stand runs on the roof front edge: [x0, z0, x1, z1]
const STANDS = [[302, -244, 248, -158], [222, -114, 180, -42], [164, -22, 124, 30],
  [-135, 15, -168, -45], [-198, -76, -250, -161], [-268, -186, -325, -276]];
const Y_IN = 60, Y_OUT = 78;                       // roof front / rear (facade) edge height
const GF = 13, CAN_D = 5.2, UPW = 29.5, BRK = 34, MAS = 35.6;   // facade levels: ground floor, canopy projection, cream top, brick top, masonry top

// roof-edge distance from the seat front along the bowl (t: 0 = RF pole, .5 = behind home, 1 = LF pole), measured on the sheet
const ER = [[0, 48], [0.1, 57], [0.2, 66], [0.3, 72], [0.38, 76], [0.41, 70], [0.44, 52], [0.47, 31], [0.5, 23], [0.53, 31], [0.56, 52],
  [0.59, 68], [0.62, 74], [0.7, 65], [0.8, 65], [0.9, 56], [1, 50]];
const tabAt = (tab, t) => {
  if (t <= tab[0][0]) return tab[0][1];
  for (let k = 1; k < tab.length; k++) if (t <= tab[k][0]) { const [ta, a] = tab[k - 1], [tb, b] = tab[k]; return a + ((b - a) * (t - ta)) / (tb - ta); }
  return tab[tab.length - 1][1];
};
const smooth01 = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

export default {
  config(rec) {
    const TS = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.42, 0.44, 0.46, 0.48, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
    const SL = 0.33;
    const rows = TS.map((t) => {
      const d0 = Math.max(14, tabAt(ER, t) - 6);                                   // upper-deck front
      const base = 62 - 22 * smooth01(Math.abs(t - 0.5) / 0.35);                   // lower-deck depth where the roof does not govern
      const dL = Math.max(d0 + 8, base);
      return { t, d0, dL, ovh: dL - d0, rise: 34 - 3.5 - SL * d0 };
    });
    return {
      // measured wall (deg, radius): posted 355/368/400/368/353; the wells and the shallow RF corner are from the sheet
      wall: [[-45, 355], [-42, 354], [-33, 355], [-27, 350], [-21, 356], [-15, 364], [-9, 377], [-3, 395], [0, 401], [4.5, 404],
        [9, 402], [15, 392], [21, 372], [27, 357], [33, 348], [39, 348], [42, 346], [45, 353]].map(([deg, r]) => ({ deg, r, h: 11.5 })),
      foulScale: 0.7,
      backstop: 55,
      lower: { depth: rows.map((r) => [r.t, r.dL]), slope: SL, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: rows.map((r) => [r.t, r.ovh]), rise: rows.map((r) => [r.t, r.rise]), depth: 64, slope: 0.44, extent: [0.02, 0.98] },
      outfield: {
        depth: 70, slope: 0.4, spans: [[-43, -5.4], [5.9, 36]],
        eye: [-5.4, 5.9], eyeHeight: 28, eyeDepth: 40,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#35604a', facade: '#9a5c44', wall: '#243a2c', cream: '#e4d9bc' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views } = ctx;
    const { sweepSolid, textTexture, wallH, clamp } = tools;
    const { bPts, bN } = paths;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const COL = {
      brick: '#98604a', cream: '#dccfae', buff: '#d6c9a6', green: '#34553f', dkgreen: '#27402f', steel: '#2f4a3b', roof: '#3d4642',
      terra: '#8a4a3a', grey: '#c9c7bb', lamp: '#efe9cf', pale: '#cdc7b0', dark: '#1d2a27', win: '#2a3633',
    };
    const center = [0, -168];
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    // Every box-like part goes into ONE instanced mesh with per-instance colours (a handful of draw calls for the whole module).
    const BOXES = [], CONES = [], PR = [];
    const box = (x, y, z, sx, sy, sz, ry, color) => BOXES.push([mat4(x, y, z, sx, sy, sz, ry), color]);
    const beam = (a, b, th, color) => {              // thin box from a to b ([x,y,z])
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
      tmp.position.copy(A).add(B).multiplyScalar(0.5); tmp.up.set(0, 1, 0);
      if (Math.abs(B.x - A.x) + Math.abs(B.z - A.z) < 1e-6) tmp.up.set(1, 0, 0);
      tmp.lookAt(B); tmp.scale.set(th, th, A.distanceTo(B)); tmp.updateMatrix(); BOXES.push([tmp.matrix.clone(), color]);
    };
    // plan polygon [[x,z],...] extruded from y0 to y1; all prisms are merged into one vertex-coloured mesh
    const prism = (pts, y0, y1, color) => {
      const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false, curveSegments: 1 });
      g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); PR.push([g, color]);
    };
    const flush = () => {
      const make = (geo, list) => {
        if (!list.length) return;
        const m = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: '#ffffff' }), list.length);
        const c = new THREE.Color();
        list.forEach(([mx, col], i) => { m.setMatrixAt(i, mx); m.setColorAt(i, c.set(col)); });
        m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true; G.add(m);
      };
      make(new THREE.BoxGeometry(1, 1, 1), BOXES); make(new THREE.ConeGeometry(0.78, 1, 4), CONES);
      if (PR.length) {
        const pos = [], nor = [], col = [], c = new THREE.Color();
        for (const [geo, color] of PR) {
          const g = geo.index ? geo.toNonIndexed() : geo, p = g.attributes.position.array, n = g.attributes.normal.array; c.set(color);
          for (let i = 0; i < p.length; i += 3) { pos.push(p[i], p[i + 1], p[i + 2]); nor.push(n[i], n[i + 1], n[i + 2]); col.push(c.r, c.g, c.b); }
        }
        const out = new THREE.BufferGeometry();
        out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        ctx.add(out, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
      }
    };
    // position of a local (lx, lz) offset from a point, for a part rotated by ry about y (local +z = facing direction)
    const loc = (px, pz, ry, lx, lz) => [px + lx * Math.cos(ry) + lz * Math.sin(ry), pz - lx * Math.sin(ry) + lz * Math.cos(ry)];
    // a part with its own local frame: box / beam / prism / textured plane in local coordinates
    const frame = (px, pz, ry) => {
      const w = (lx, lz) => loc(px, pz, ry, lx, lz);
      return {
        w,
        box: (lx, y, lz, sx, sy, sz, color) => { const q = w(lx, lz); box(q[0], y, q[1], sx, sy, sz, ry, color); },
        beam: (a, b, th, color) => { const p = w(a[0], a[2]), q = w(b[0], b[2]); beam([p[0], a[1], p[1]], [q[0], b[1], q[1]], th, color); },
        prism: (pts, y0, y1, color) => prism(pts.map(([lx, lz]) => w(lx, lz)), y0, y1, color),
        plane: (lx, y, lz, sw, sh, tex) => {
          const q = w(lx, lz), m = ctx.add(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ map: tex }));
          m.position.set(q[0], y, q[1]); m.rotation.y = ry; return m;
        },
        pts: (list) => list.map(([lx, lz]) => w(lx, lz)),
      };
    };
    // D-shaped plan: flat front at lz = 0, rounded back (sagitta `sag`), half width hw
    const dshape = (hw, sag, n = 10) => {
      const R = (hw * hw + sag * sag) / (2 * sag), cz = R - sag, a = Math.asin(hw / R), pts = [[-hw, 0], [hw, 0]];
      for (let k = 0; k <= n; k++) { const th = a - (2 * a * k) / n; pts.push([R * Math.sin(th), cz - R * Math.cos(th)]); }
      return pts;
    };
    const rep = (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
    let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const pennants = ['#8f3b34', '#2f4d6e', '#c2a24a', '#3f6b4d', '#d8d0b8', '#6a4a78', '#a8643a'];

    // ---------- helpers for polylines
    const smooth = (pts, n) => new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal').getSpacedPoints(n).map((p) => [p.x, p.z]);
    const nearestOn = (poly, p) => {
      let best = poly[0], bd = 1e9;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], ex = b[0] - a[0], ez = b[1] - a[1];
        const t = clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ez) / (ex * ex + ez * ez || 1), 0, 1);
        const q = [a[0] + ex * t, a[1] + ez * t], d = Math.hypot(p[0] - q[0], p[1] - q[1]);
        if (d < bd) { bd = d; best = q; }
      }
      return best;
    };
    // deck surface height at a point (uses the per-path deck tables)
    const deckAt = (x, z) => {
      let bi = 0, bd = 1e9;
      for (let i = 0; i < bPts.length; i++) { const d = Math.hypot(bPts[i][0] - x, bPts[i][1] - z); if (d < bd) { bd = d; bi = i; } }
      const d = (x - bPts[bi][0]) * bN[bi][0] + (z - bPts[bi][1]) * bN[bi][1];
      const da = dims.deckAt, sL = dims.sL, sU = dims.sU;
      if (d <= 0) return 3.5;
      if (d <= da.dL(bi)) return 3.5 + sL * d;
      return d < da.dEnd(bi) ? da.h0(bi) + sU * (d - da.d0(bi)) : da.hTop(bi);
    };

    // ======================================================================================================
    // 1. IVY WALL: brick wall with ivy texture and a wire basket on top (replaces the generic wall)
    // ======================================================================================================
    {
      if (parts.wall) ctx.remove(parts.wall);
      const ivyTex = rep(textTexture((g, w, h) => {
        g.fillStyle = '#3f6030'; g.fillRect(0, 0, w, h);
        const cols = ['#4d7038', '#2f4d27', '#5b8040', '#6a8f4a', '#35552b'];
        for (let i = 0; i < 260; i++) { g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(rnd() * w, rnd() * h, 2 + rnd() * 4, 0, 7); g.fill(); }
        g.fillStyle = 'rgba(150,80,60,0.35)'; for (let i = 0; i < 18; i++) g.fillRect(rnd() * w, rnd() * h, 3, 2);   // brick showing through
      }, 128, 64));
      const [p, n, dg] = tools.span(-45, 45);
      const h = (i) => wallH(ctx.spec, dg[i]);
      const mats = [new THREE.MeshLambertMaterial({ map: ivyTex, side: THREE.DoubleSide }), lam('#3a4a35')];
      ctx.add(sweepSolid(p, n, (i) => [[-0.4, 0], [-0.4, h(i)], [0.9, h(i)], [0.9, 0]], [0, 1, 1, -1], 1), mats);
      // basket: thin sloped wire screen leaning into the field
      ctx.add(sweepSolid(p, n, (i) => [[0.9, h(i)], [-2.6, h(i) + 0.7], [-2.6, h(i) + 1.5], [0.9, h(i) + 0.9]], [1, 1, 1, 1], 1), mats);
    }

    // ======================================================================================================
    // 2. CENTER FIELD: arc-row high tier (wedge), rounded-back hand scoreboard, clock, flag mast
    // ======================================================================================================
    const SB = { x: 48, z: -499.3 };                         // scoreboard front face centre, on the back edge of the tier (ry = 0)
    const Y_TIER = [29.5, 48], Y_BD0 = 54, Y_BD1 = 81;       // tier front/back height; board bottom/top
    {
      // --- high tier: rows follow arcs from r = 444 to the flat back edge z = -499.3
      const NU = low ? 14 : 26, NV = low ? 10 : 22, R0 = 444, ZB = -SB.z;
      const phiL = [-3.8 * D2R, Math.atan2(10, ZB)], phiR = [14.7 * D2R, Math.atan2(86, ZB)];
      const pt = (u, v) => {
        const pl = phiL[0] + (phiL[1] - phiL[0]) * v, pr = phiR[0] + (phiR[1] - phiR[0]) * v, phi = pl + (pr - pl) * u;
        const r = R0 + v * (ZB / Math.cos(phi) - R0); return [r * Math.sin(phi), -r * Math.cos(phi)];
      };
      const hAt = (v) => Y_TIER[0] + (Y_TIER[1] - Y_TIER[0]) * v;
      const pos = [], uv = [], idx = [];
      for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
        const v = j / NV, u = i / NU, [x, z] = pt(u, v); pos.push(x, hAt(v), z);
        uv.push(((x + 40) / 24), (v * 58) / 3);
      }
      for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
        const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, d = c + 1; idx.push(a, b, c, b, d, c);
      }
      const top = new THREE.BufferGeometry();
      top.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); top.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      top.setIndex(idx); top.computeVertexNormals();
      ctx.add(top, M[MAT.SEAT]);
      // skirts: left, right and front faces down to the ground
      const sp = [], si = [];
      const wallQuad = (pa, ha, pb, hb) => { const k = sp.length / 3; sp.push(pa[0], ha, pa[1], pb[0], hb, pb[1], pa[0], 0, pa[1], pb[0], 0, pb[1]); si.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); };
      for (let j = 0; j < NV; j++) { const v0 = j / NV, v1 = (j + 1) / NV; wallQuad(pt(0, v0), hAt(v0), pt(0, v1), hAt(v1)); wallQuad(pt(1, v0), hAt(v0), pt(1, v1), hAt(v1)); }
      for (let i = 0; i < NU; i++) wallQuad(pt(i / NU, 0), hAt(0), pt((i + 1) / NU, 0), hAt(0));
      const sk = new THREE.BufferGeometry(); sk.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); sk.setIndex(si); sk.computeVertexNormals();
      ctx.add(sk, lam('#2c4636'));
      // aisles: two radial concrete strips up the tier
      for (const u of [0.28, 0.72]) for (let j = 0; j < NV; j++) {
        const a = pt(u, j / NV), b = pt(u, (j + 1) / NV); beam([a[0], hAt(j / NV) + 0.15, a[1]], [b[0], hAt((j + 1) / NV) + 0.15, b[1]], 3.2, '#b9b39f');
      }
    }
    {
      const S = frame(SB.x, SB.z, 0);
      const HW = 37.5;
      // --- structure behind the tier: housing in three bands (dark steel, glazed ribbon, cream gallery beam), then the drum
      S.prism(dshape(34.5, 20), 0, 30, '#3a4a40');
      S.prism(dshape(36.2, 22), 30, 38, COL.dark);
      S.prism(dshape(37.8, 24), 38, 45, COL.cream);
      S.prism(dshape(HW, 25), 45, Y_BD0, '#2c3d34');
      S.prism(dshape(HW, 25), Y_BD0, Y_BD1, COL.pale);                  // the board body: flat front, rounded back
      S.prism(dshape(HW + 1.1, 25.8), Y_BD1, Y_BD1 + 1.6, '#2d4635');   // roof cap
      // diagonal knee braces under the gallery beam
      for (const lx of [-30, -15, 0, 15, 30]) S.beam([lx, 38, -2], [lx, 45, -8], 1.6, COL.steel);
      // --- face: ticker band + board in one blank plane, frame trim
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#233a2d'; g.fillRect(0, 0, w, h);
        const tickH = Math.round(h * (6 / 33));                         // blank ticker band at the bottom
        g.fillStyle = '#1b2723'; g.fillRect(0, h - tickH, w, tickH);
        g.strokeStyle = '#cfc4a2'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - tickH - 2);
        g.strokeStyle = 'rgba(215,205,170,0.8)'; g.lineWidth = 1.5;
        const bh = h - tickH, x0 = 16, x1 = w - 16;
        // left and right league panels: score grid (13 rows), centre panel: umpire / batter cells
        const panel = (a, b, rows) => {
          const rh = (bh - 52) / rows;
          for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(a, 40 + r * rh); g.lineTo(b, 40 + r * rh); g.stroke(); }
          g.strokeRect(a, 40, b - a, bh - 52);
          for (const f of [0.5, 0.78]) { g.beginPath(); g.moveTo(a + (b - a) * f, 40); g.lineTo(a + (b - a) * f, bh - 12); g.stroke(); }
        };
        panel(x0 + 10, w * 0.37, 13); panel(w * 0.63, x1 - 10, 13);
        const cx0 = w * 0.40, cx1 = w * 0.60; g.strokeRect(cx0, 40, cx1 - cx0, bh - 52);
        for (let r = 1; r < 5; r++) { g.beginPath(); g.moveTo(cx0, 40 + r * (bh - 52) / 5); g.lineTo(cx1, 40 + r * (bh - 52) / 5); g.stroke(); }
        g.strokeStyle = 'rgba(0,0,0,0.25)'; for (let x = 0; x < w; x += 16) { g.beginPath(); g.moveTo(x, h - tickH); g.lineTo(x, h); g.stroke(); }
      }, 1024, 450);
      S.plane(0, Y_BD0 - 6 + 16.5, 0.15, 75, 33, tex);
      S.box(0, Y_BD0 + 0.2, 0.4, 75.6, 0.8, 0.9, COL.cream); S.box(0, Y_BD1 - 0.4, 0.4, 75.6, 0.8, 0.9, COL.cream);
      for (const sx of [-1, 1]) S.box(sx * (HW - 0.2), (Y_BD0 + Y_BD1) / 2, 0.4, 0.8, 27, 0.9, COL.cream);
      S.box(0, 48, 0.4, 75.6, 0.7, 0.9, '#4a5a4e');
      // --- clock: round dial on a small plinth on top of the centre panel; plain dots, no numerals
      const ctex = textTexture((g, w, h) => {
        g.fillStyle = '#efe8d0'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 2, 0, 7); g.fill();
        g.strokeStyle = '#2b3a33'; g.lineWidth = 6; g.stroke();
        g.fillStyle = '#2b3a33'; for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; g.beginPath(); g.arc(w / 2 + Math.sin(a) * w * 0.38, h / 2 - Math.cos(a) * w * 0.38, k % 3 ? 5 : 8, 0, 7); g.fill(); }
        g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + 20, h / 2 - 50); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 - 6, h / 2 + 62); g.stroke();
      }, 128, 128);
      const cy = Y_BD1 + 1.6 + 4.9;
      S.box(0, Y_BD1 + 2.3, -3, 10, 1.4, 5, '#2d4635');
      const dial = ctx.add(new THREE.CircleGeometry(4.8, 28), new THREE.MeshBasicMaterial({ map: ctex }));
      const dq = S.w(0, 0.4); dial.position.set(dq[0], cy, dq[1]);
      const rimGeo = new THREE.CylinderGeometry(5.1, 5.1, 1.4, 20); rimGeo.rotateX(Math.PI / 2);
      const rim = ctx.add(rimGeo, lam(COL.cream)); rim.position.set(dq[0], cy, S.w(0, -0.4)[1]);
      // --- mast (40 ft) with two yard-arms and plain pennants; two small floodlights on the cap corners
      const mz = -9, my0 = Y_BD1 + 1.6;
      S.box(0, my0 + 20, mz, 0.9, 40, 0.9, '#dcd6c2');
      S.box(0, my0 + 31, mz, 25, 0.5, 0.5, '#dcd6c2'); S.box(0, my0 + 38, mz, 10, 0.5, 0.5, '#dcd6c2'); S.box(0, my0 + 40.4, mz, 1.6, 1.2, 1.6, COL.cream);
      for (let k = 0; k < 10; k++) {
        const side = k % 2 ? 1 : -1, col = k >> 1, lx = side * (3 + col * 2.4), yy = my0 + 30 - 1.4 * (k % 3);
        S.box(lx, yy, mz, 0.2, 1.8, 2.6 + (k % 3), pennants[k % pennants.length]);
      }
      if (!low) for (let k = 0; k < 6; k++) { const s = k < 3 ? -1 : 1; S.box(s * (10 + (k % 3) * 1.8), my0 + 30 - 2.4 * (k % 3), mz, 0.2, 1.7, 2.4, pennants[(k + 3) % pennants.length]); }
      for (const sx of [-1, 1]) { S.box(sx * 34, Y_BD1 + 3, -4, 3, 3, 4, '#2d4635'); S.box(sx * 34, Y_BD1 + 3, -1.8, 2.4, 2.2, 0.5, COL.lamp); }
      G.add(tools.rail(S.pts([[-36, -1.2], [36, -1.2]]), () => Y_BD1 + 1.6, { height: 2.6, spacing: 8, color: '#d9d4c4', lod: ctx.lod }));
    }

    // ======================================================================================================
    // 3. VIDEO BOARDS (blank): steel tower, truss behind the panel, catwalks, end stair towers, top cap, service lights
    // ======================================================================================================
    const videoBoard = (F0, ry, w, h, y0, deep) => {
      const B = frame(F0[0], F0[1], ry), top = y0 + h, hw = w / 2;
      const tex = textTexture((g, W, H) => {                          // blank dark panel with a plain line grid (pixel rows)
        g.fillStyle = '#18211e'; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(120,140,128,0.22)'; g.lineWidth = 1;
        for (let x = 0; x < W; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
        for (let y = 0; y < H; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
        g.strokeStyle = '#2f4a3c'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
      }, 512, Math.round((512 * h) / w));
      B.plane(0, y0 + h / 2, 0.2, w - 2, h - 2, tex);
      B.box(0, y0 + h / 2, -3.4, w, h, 6.6, '#2f4636');                // panel cabinet
      B.box(0, top + 0.6, -3.4, w + 1.6, 1.2, 7.4, COL.cream);          // top cap
      B.box(0, y0 - 0.5, -3.4, w + 1.0, 1.0, 7.0, '#3b4a40');           // bottom edge
      for (const s of [-1, 1]) B.box(s * (hw + 0.4), y0 + h / 2, -3.4, 1.0, h, 7.0, '#3b4a40');
      // tower: front and back column rows from the stand structure up to the panel, with X bracing between rows
      const cols = low ? [-hw + 4, 0, hw - 4] : [-hw + 4, -hw / 3, hw / 3, hw - 4];
      for (const lx of cols) for (const lz of [-3, -deep + 3]) B.box(lx, y0 / 2, lz, 2.4, y0, 2.4, COL.steel);
      for (const lx of cols) { B.beam([lx, y0 * 0.15, -3], [lx, y0 * 0.85, -deep + 3], 1.2, COL.steel); B.beam([lx, y0 * 0.85, -3], [lx, y0 * 0.15, -deep + 3], 1.2, COL.steel); }
      // back truss behind the panel: posts, three chords, diagonals
      const nb = low ? 4 : 8, bay = (w - 8) / nb;
      for (let k = 0; k <= nb; k++) { const lx = -hw + 4 + k * bay; B.box(lx, y0 + h / 2, -deep + 2, 1.2, h, 1.2, COL.steel); B.beam([lx, y0 + h / 2, -6], [lx, y0 + h / 2, -deep + 2], 1.1, COL.steel); }
      for (const f of [0.02, 0.5, 0.98]) B.box(0, y0 + h * f, -deep + 2, w - 6, 1.3, 1.3, COL.steel);
      if (!low) for (let k = 0; k < nb; k++) { const lx = -hw + 4 + k * bay; B.beam([lx, y0 + 1, -deep + 2], [lx + bay, y0 + h / 2, -deep + 2], 0.9, COL.steel); B.beam([lx + bay, y0 + 1 + h / 2, -deep + 2], [lx, y0 + h - 1, -deep + 2], 0.9, COL.steel); }
      // catwalks: below the panel (front) and along the top (back), with rails
      B.box(0, y0 - 2.2, 1.5, w + 10, 0.7, 5.5, '#76796c'); B.box(0, top + 1.8, -deep / 2 - 2, w + 4, 0.6, deep - 4, '#76796c');
      G.add(tools.rail(B.pts([[-hw - 5, 4.2], [hw + 5, 4.2]]), () => y0 - 1.8, { height: 3.4, spacing: 8, color: '#cfcab6', lod: ctx.lod }));
      G.add(tools.rail(B.pts([[-hw - 1, -deep + 1], [hw + 1, -deep + 1], [hw + 1, -4], [-hw - 1, -4]]), () => top + 2.1, { height: 3, spacing: 8, color: '#cfcab6', lod: ctx.lod }));
      // end stair towers (louvered pale steel) and service lights on the cap
      for (const s of [-1, 1]) {
        const lx = s * (hw + 6);
        B.box(lx, (top + 2) / 2, -deep / 2, 4.5, top + 2, deep, '#a7a698');
        if (!low) for (let k = 0; k < 6; k++) B.box(lx, 6 + k * ((top - 8) / 5), -deep / 2 + 0.2, 6.2, 0.5, deep + 0.3, '#8d8c80');
        B.box(lx, top + 3, -deep / 2, 7, 1.2, deep + 1, '#2d4635');
        B.box(s * (hw - 10), top + 3.5, -4, 2.6, 2.6, 2.2, '#2d4635'); B.box(s * (hw - 10), top + 3.5, -2.8, 2.0, 2.0, 0.4, COL.lamp);
      }
    };
    {
      // left-field board: 95 x 42 ft, face toward home along (0.58, 0.815)
      videoBoard([-134, -418], Math.atan2(0.58, 0.815), 95, 42, 42, 25);
      // right-field board: 80 x 30 ft, face toward the infield along (-0.85, 0.53)
      videoBoard([223, -310], Math.atan2(-0.85, 0.53), 80, 30, 38, 22);
      // blank ribbon boards on the bleacher fronts (secondary boards): thin dark strip above the ivy wall
      const rib = (a, b) => {
        const [p, n, dg] = tools.span(a, b);
        if (p.length < 2) return;
        ctx.add(sweepSolid(p, n, (i) => { const hw = wallH(ctx.spec, dg[i]); return [[1.3, hw + 0.6], [1.3, hw + 4.2], [2.1, hw + 4.2], [2.1, hw + 0.6]]; }, [0, 1, 0, -1], 1), [lam('#1d2824'), lam('#35523f')]);
      };
      rib(-42, -21); rib(21, 36);
    }
    // flags on the foul poles (plain white pennants)
    for (const pole of parts.poles || []) {
      const bb = new THREE.Box3().setFromObject(pole), top = bb.max.y, cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;
      box(cx, top - 2, cz, 3.2, 2, 0.2, Math.atan2(cx, -cz) + Math.PI / 2, '#ece6d2');
    }

    // ======================================================================================================
    // 4. FACADE: cream stucco with green steel pilasters, red tile canopy, brick band, open green steel frame, gate canopies, marquee
    // ======================================================================================================
    const F = smooth(FAC, 220);
    const Fn = tools.normalsFor(F, center);
    const cum = [0]; for (let i = 1; i < F.length; i++) cum.push(cum[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
    const total = cum[cum.length - 1];
    const idxAt = (s) => { let i = 0; while (i < F.length - 1 && cum[i] < s) i++; return i; };
    const pointAt = (s) => {                                   // point and outward normal at arc length s
      const i = Math.min(F.length - 2, Math.max(0, idxAt(s) - 1)), u = clamp((s - cum[i]) / ((cum[i + 1] - cum[i]) || 1), 0, 1);
      return { x: F[i][0] + (F[i + 1][0] - F[i][0]) * u, z: F[i][1] + (F[i + 1][1] - F[i][1]) * u, nx: Fn[i][0], nz: Fn[i][1] };
    };
    {
      const mats = [lam(COL.buff), lam(COL.brick), lam(COL.terra), lam(COL.green)];
      // masonry: cream ground floor, projecting red tile canopy, cream second level, brick band with cornice
      ctx.add(sweepSolid(F, Fn, () => [[0, 0], [0, GF], [CAN_D, GF - 0.6], [CAN_D, GF + 0.4], [0.2, GF + 3.8], [0.2, UPW], [1.6, UPW], [1.6, BRK], [2.4, BRK], [2.4, MAS], [-10, MAS], [-10, 0]],
        [0, 2, 2, 2, 0, 1, 1, 0, 0, 0, -1, -1], 0), mats);
      // open steel level: dark back wall (concourse side) with green beams in front of it
      ctx.add(sweepSolid(F, Fn, () => [[-12, MAS], [-12, Y_OUT - 4], [-11, Y_OUT - 4], [-11, MAS]], [0, 0, 0, 0], 0), [lam('#27332e')]);
      ctx.add(sweepSolid(F, Fn, () => [[-0.4, MAS + 18.6], [-0.4, MAS + 20.2], [1.2, MAS + 20.2], [1.2, MAS + 18.6]], [0, 0, 0, 0], 0), [mats[3]]);   // mid beam
      ctx.add(sweepSolid(F, Fn, () => [[-0.6, Y_OUT - 2.4], [-0.6, Y_OUT], [1.8, Y_OUT], [1.8, Y_OUT - 2.4]], [0, 0, 0, 0], 0), [mats[3]]);          // top beam
      const rp = []; for (let i = 0; i < F.length; i += 2) rp.push([F[i][0] + Fn[i][0] * 0.4, F[i][1] + Fn[i][1] * 0.4]);
      G.add(tools.rail(rp, () => MAS, { height: 3.4, spacing: 6, color: COL.green, lod: ctx.lod }));
      // bays: green steel pilaster full height, two windows on the cream level, vents on the ground floor, X braces in the steel level
      const step = low ? 40 : 26;
      for (let s = 8; s < total - 12; s += step) {
        const a = pointAt(s), b = pointAt(s + step), nx = a.nx, nz = a.nz, ry = Math.atan2(nx, nz), tx = Math.cos(ry), tz = -Math.sin(ry);
        const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
        box(a.x + nx * 1.0, Y_OUT / 2, a.z + nz * 1.0, 2.4, Y_OUT, 2.4, ry, COL.green);                        // pilaster / column
        for (const o of [-0.2, 0.2]) {                                                                          // paired windows, level 2
          const wx = mx + tx * step * o, wz = mz + tz * step * o;
          box(wx + nx * 0.35, 23.2, wz + nz * 0.35, step * 0.13, 8.2, 0.7, ry, '#2d3d35'); box(wx + nx * 0.7, 23.2, wz + nz * 0.7, step * 0.1, 7.2, 0.4, ry, '#232d2a');
        }
        if (!low) {
          box(mx + nx * 0.35, 6.5, mz + nz * 0.35, step * 0.36, 5.5, 0.7, ry, COL.win);                          // ground-floor louver / door
          const q = [b.x + b.nx * 1.0, b.z + b.nz * 1.0], p = [a.x + nx * 1.0, a.z + nz * 1.0];
          beam([p[0], MAS + 0.4, p[1]], [q[0], MAS + 18.4, q[1]], 0.9, COL.green); beam([q[0], MAS + 0.4, q[1]], [p[0], MAS + 18.4, p[1]], 0.9, COL.green);
          beam([p[0], MAS + 20.4, p[1]], [q[0], Y_OUT - 2.6, q[1]], 0.8, COL.green);
        }
      }
      // gate canopies: cream columns carrying a flat green roof, in front of the red tile canopy
      const marq = F.reduce((best, p, i) => (p[1] > 150 && Math.abs(p[0] + 17) < Math.abs(F[best][0] + 17) ? i : best), 0);
      for (const off of [-540, -400, -260, -125, 125, 260, 400, 540]) {
        const i = idxAt(cum[marq] + off); if (i <= 2 || i >= F.length - 3) continue;
        const ry = Math.atan2(Fn[i][0], Fn[i][1]), g = frame(F[i][0], F[i][1], ry);
        g.box(0, GF - 0.9, 13, 44, 1.0, 14, COL.green);                                   // flat canopy roof
        for (const lx of [-20, -10, 0, 10, 20]) g.box(lx, (GF - 1.4) / 2, 18.4, 1.6, GF - 1.4, 1.6, COL.cream);
        g.box(0, 5, 0.6, 12, 10, 0.8, '#2b3633');                                          // gate opening in the wall
      }
      // marquee: red double-faced sign standing over the main entrance (plain name only)
      const i = marq, ry = Math.atan2(Fn[i][0], Fn[i][1]), M0 = frame(F[i][0] + Fn[i][0] * 5, F[i][1] + Fn[i][1] * 5, ry), red = '#a63f32';
      M0.box(0, 18.5, 0, 34, 11.5, 7, red); M0.box(0, 24.8, 0, 36, 1.4, 8.6, COL.cream);
      for (const sx of [-14, 14]) M0.box(sx, 6.3, 2, 2, 12.6, 2, COL.cream);
      const mt = textTexture((g, w, h) => {
        g.fillStyle = red; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8dcbc'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
        g.fillStyle = '#f1e8d0'; g.font = 'bold 56px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('WRIGLEY FIELD', w / 2, h / 2 + 3);
      }, 512, 128);
      M0.plane(0, 18.5, 3.7, 32, 9, mt);
      views.gate = { pos: [F[i][0] + Fn[i][0] * 130 - 40, 26, F[i][1] + Fn[i][1] * 130], look: [F[i][0], 30, F[i][1]], label: 'Marquee' };

      // white-roofed club on the first-base side, outside the main facade
      box(335, 18, -85, 80, 36, 46, -0.69, '#ddd8c6'); box(335, 37, -85, 84, 3, 50, -0.69, COL.cream);
    }

    // ======================================================================================================
    // 5. ROOF: one ribbon between the measured front edge and the facade, fascias, trusses, columns
    // ======================================================================================================
    const colXZ = [];
    const Rin = smooth(ROOF_IN, low ? 70 : 110);
    const Rout = Rin.map((p) => nearestOn(F, p));
    {
      const pos = [], colr = [], cc = new THREE.Color();
      const strip = (P, Q, hex) => {                      // quad strip between two 3D polylines, one flat colour
        cc.set(hex);
        for (let i = 0; i < P.length - 1; i++) for (const v of [P[i], Q[i], Q[i + 1], P[i], Q[i + 1], P[i + 1]]) { pos.push(v.x, v.y, v.z); colr.push(cc.r, cc.g, cc.b); }
      };
      const at = (pt, y) => new THREE.Vector3(pt[0], y, pt[1]);
      const Itop = Rin.map((p) => at(p, Y_IN)), Otop = Rout.map((p) => at(p, Y_OUT));
      strip(Itop, Otop, COL.roof);                                                   // roof deck
      strip(Rin.map((p) => at(p, Y_IN - 3)), Rout.map((p) => at(p, Y_OUT - 3)), '#2a3a31');   // soffit
      strip(Rin.map((p) => at(p, Y_IN - 8)), Itop, '#31503d');                       // front fascia (green steel)
      strip(Rout.map((p) => at(p, Y_OUT - 3)), Otop, COL.green);                     // rear fascia
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3));
      g.computeVertexNormals();
      ctx.add(g, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
      const every = low ? 8 : 4;
      for (let i = 0; i < Rin.length; i += every) {
        const a = Rin[i], b = Rout[i], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ym = (Y_IN + Y_OUT) / 2 - 8;
        beam([a[0], Y_IN - 4, a[1]], [b[0], Y_OUT - 4, b[1]], 1.8, COL.steel);              // rafter
        if (!low) { beam([a[0], Y_IN - 4, a[1]], [m[0], ym, m[1]], 1.1, COL.steel); beam([m[0], ym, m[1]], [b[0], Y_OUT - 4, b[1]], 1.1, COL.steel); }
        beam([a[0], deckAt(a[0], a[1]), a[1]], [a[0], Y_IN - 3, a[1]], 1.5, COL.steel); colXZ.push(a);   // column under the front edge
      }
      const gs = low ? 4 : 2;
      for (let i = 0; i < Rin.length - 1; i += gs) {                                  // longitudinal girder, mid-width
        const j = Math.min(i + gs, Rin.length - 1), ym = (Y_IN + Y_OUT) / 2 - 5;
        beam([(Rin[i][0] + Rout[i][0]) / 2, ym, (Rin[i][1] + Rout[i][1]) / 2], [(Rin[j][0] + Rout[j][0]) / 2, ym, (Rin[j][1] + Rout[j][1]) / 2], 1.4, COL.steel);
      }
    }

    // ======================================================================================================
    // 6. LAMP STANDS: six lattice racks on the roof front edge, facing the field
    // ======================================================================================================
    {
      const Y0 = Y_IN + 6, Y1 = Y_IN + 26;                                            // bank bottom / top (rack = 26 ft above the roof edge)
      for (const [x0, z0, x1, z1] of STANDS) {
        const L = Math.hypot(x1 - x0, z1 - z0), ux = (x1 - x0) / L, uz = (z1 - z0) / L;
        let nx = uz, nz = -ux; if (nx * ((x0 + x1) / 2 - center[0]) + nz * ((z0 + z1) / 2 - center[1]) < 0) { nx = -nx; nz = -nz; }
        const P = (t, y, o = 0) => [x0 + ux * L * t + nx * (o + 3), y, z0 + uz * L * t + nz * (o + 3)];
        const gy = COL.grey;
        beam(P(0, Y0), P(1, Y0), 1.6, gy); beam(P(0, Y1), P(1, Y1), 1.6, gy); beam(P(0, Y0), P(0, Y1), 1.4, gy); beam(P(1, Y0), P(1, Y1), 1.4, gy);
        const cells = Math.max(3, Math.round(L / (low ? 22 : 11)));
        for (let c = 0; c < cells; c++) {
          const t0 = c / cells, t1 = (c + 1) / cells;
          beam(P(t0, Y0), P(t0, Y1), 0.9, gy);
          beam(c % 2 ? P(t0, Y0) : P(t0, Y1), c % 2 ? P(t1, Y1) : P(t1, Y0), 0.8, gy);
        }
        const rows = low ? 2 : 3, cols = Math.round(L / (low ? 12 : 6)), ry = Math.atan2(-nx, -nz);   // lamps on the field face
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const q = P((c + 0.5) / cols, Y0 + 3 + (r + 0.5) * ((Y1 - Y0 - 6) / rows), -1.5);
          box(q[0], q[1], q[2], low ? 6 : 3.4, low ? 5 : 3.4, 1.2, ry, COL.lamp);
        }
        for (const t of [0.12, 0.5, 0.88]) {                                           // mast and back legs
          beam(P(t, Y_IN), P(t, Y0), 2.2, gy);
          beam(P(t, Y1 - 3, 0), P(t, Y_IN + 3, 24), 1.7, gy);
          beam(P(t, Y0 + 4, 0), P(t, Y_IN + 3, 24), 1.2, gy);
        }
        beam(P(0.12, Y_IN + 3, 24), P(0.88, Y_IN + 3, 24), 1.4, gy);
      }
    }

    flush();

    // ======================================================================================================
    // 7. VIEWS
    // ======================================================================================================
    {   // the stock upper-deck view: keep its camera clear of the roof columns
      const v = views.upper, tx = tools.foulAt(0.62, 0, 0).x - tools.foulAt(0.58, 0, 0).x, tz = tools.foulAt(0.62, 0, 0).z - tools.foulAt(0.58, 0, 0).z, tl = Math.hypot(tx, tz) || 1;
      const blocked = () => {                           // a column near the line of sight, ahead of the camera
        const dx = v.look[0] - v.pos[0], dz = v.look[2] - v.pos[2], dl = Math.hypot(dx, dz);
        return colXZ.some(([x, z]) => { const ax = x - v.pos[0], az = z - v.pos[2], t = (ax * dx + az * dz) / dl, off = Math.abs(ax * dz - az * dx) / dl; return t > 0 && t < 80 && off < 7; });
      };
      for (let k = 0; k < 12 && blocked(); k++) { v.pos[0] += (tx / tl) * 5; v.pos[2] += (tz / tl) * 5; }
      v.dir = new THREE.Vector3(...v.look).sub(new THREE.Vector3(...v.pos)).normalize();
    }
    views.roof = { pos: [-430, 170, 150], look: [-230, 70, -120], label: 'Roof' };
    views.ivy = { pos: [150, 9, -170], look: [-110, 11, -350], walk: false, label: 'Ivy Wall' };
    views.scoreboard = { pos: [20, 40, -230], look: [48, 66, -505], label: 'Scoreboard' };
    views.boards = { pos: [20, 60, -250], look: [-100, 60, -420], label: 'Video Boards' };
  },
};
