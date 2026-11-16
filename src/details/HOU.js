// Detail module: Daikin Park (Minute Maid Park, Enron Field), Houston Astros (opened 2000). Units: feet.
// REWORKED to the satellite sheet (survey.png, home plate = origin, 1.1 px/ft). The first version was text-only.
// MEASURED FROM THE SHEET (home plate (885,914) / second base (840.7,780) in mosaic.png; field axis checked: mound at z -62):
//  - Outfield wall corners (inner face): LF pole (-226,-232), end of the Crawford Boxes (-129,-343), left end of the
//    center wall (-32,-413), right end (83,-415), RF pole (232,-232). Scaled by 0.99 and the poles set to the posted 315 / 326.
//    The wall is straight from the Crawford Boxes to the center wall (no notch); the grass edge, not the wall, has the notch.
//  - The whole building is a rectangle turned 49.7 deg from the field axis. Roof frame: u along (0.763,-0.647) (the rail and
//    roof travel direction, toward the right-field side), v along (0.647,0.763); x = 0.763u + 0.647v, z = -0.647u + 0.763v.
//    Left rail (center-field side) v = -372, right rail (first-base side) v = +115; roof span v -385..+125 (about 510 ft).
//    Fixed roof strips: behind home / third base u -170..-97 (v -385..167), first-base side v 103..167 (u -97..353).
//    Parked panels (stack) sit beyond the bowl at u 395..640; closed lid covers u -97..393. Rail girders and lattice towers
//    run to u 645. Facade: home side pavilions to u -250, first-base side low block to v 205, left wall at v -390,
//    top wall under the stack at u 395.
//  - Stand depths: Crawford Boxes ~30 ft deep, center field ~30 ft, right field ~60 ft, first-base side deeper (about 115 ft
//    to the roof edge) than third-base side (about 85 ft); behind home the stands stop at z ~150.
//  - Teal roofs: five hip-roof and two barrel-vault pavilions on the home side; Union Station block and teal roofs on the
//    left-field side outside the left rail; bullpen lawn and two sheds behind the right-center wall at (103..150, -400..-345).
// FROM TEXT SOURCES (Wikipedia, Clem's Baseball, uni-systems.com): posted distances 315 / 366 / 409 / 370 / 326, wall heights
//  19 / 9 / 7, three roof panels (120 / 240 / 120 ft long along the rails, parabolic section, stacking at the right-field end),
//  brick facade with cream bands, brick clock tower at the home entrance, train over the left-field wall, Union Station.
// LEVEL 4 (photographs 1-8, row counts, sheet probes):
//  A FACADE (photos 1, 2): home block is brick with two rows of arched windows (arch heads), cream bands, a continuous teal copper band
//    on top, then a pale cream upper wall with tall pilasters and a rounded cap (it was brick); gate = three dark arched openings under a
//    flat teal canopy, the ballpark name in plain text on the vault end; clock tower moved to the first-base end of the home facade
//    (photo 2 shows it at the right end, not behind the gate); Union Station rebuilt as a 6-floor block, stone base + red brick shaft,
//    cornice with balustrade, window rows (photo 1); train wall lowered to 36 ft with arched openings (photo 8).
//  B HEIGHTS: main board 124 x 54 ft (text: Astros announcement, 2010); row counts lower 38 / middle 11 / upper 26 (Clem's Baseball);
//    seat rise 1.0 ft/row lower (slope 0.38), 1.85 ft/row upper (slope 0.65, 26 rows x 2.85 ft); upper deck top = 92 ft, club band
//    9-20 ft; train wall 36 ft, light tower 95 ft (photo 8: door about 8 ft = 35 px, train, tower top 275 px over the wall base, scaled up
//    for its larger distance); facade: brick block 54 ft and cream wall to 104 ft from the 60:20:55 px split of brick : teal : cream in
//    photo 2 against 3 floors of 17 ft; Union Station 84 ft (6 window rows x 14 ft, photo 1). Sheet shadows: the LF tower casts a
//    95 ft shadow, so the sun ratio is about 1.0 (45 deg); the 1B stands are shaded from the strip edge (102 ft) to about the foul
//    line, which agrees with ratio 1.0. The wide train-wall shadow band gave only 24 to 36 ft, a weak check.
//  C SEATING (sheet probe along the bowl normal: first white pixel = inner edge of the roof strip): strip edge distance from the foul
//    edge: 1B side 140 ft at the right-field end, falling to 98 (t 0.25), 78 (t 0.33), 58 (t 0.4); behind home 85; 3B side 54 near home
//    rising to 69 toward left field. Upper deck front = that edge (tables above), upper deck depth 64 (1B) to 73 (home, 3B) = the width
//    of the strips (64 / 73 ft). Lower deck depth 108 (RF end), 90 (t 0.3), 86 to 88 (home), 82 to 90 (3B). Right-field end follows the
//    sheet only partly (the strip edge there is 140 ft, the table gives 100) because the seats are hidden by shadow.
//  D BOARDS: main video board 124 x 54 ft at 22 deg, bottom edge 40 ft, face a blank dark grid, slab, frame bars, vertical trusses
//    with diagonals, a catwalk along the bottom and a top service walk, two lattice support legs; a line-score board (58 x 30 ft)
//    on the right-field side and an info board (40 x 22 ft) on the left side, both blank, on legs; ribbon board around the club-level
//    fascia (photos 3, 5, 7); left-field light tower (two lattice legs, catwalk, lamp bank, 95 ft) at the sheet shadow origin
//    (-250,-226); six flagpoles with plain pennants along the train wall top (photo 8).
// STILL ESTIMATED: roof heights (rail 200 ft, ridge 240 ft, strips 100-148 ft), the facade pilaster rhythm, tier details of the middle
//  deck (its 11 rows are folded into the club band), the right-field-end depth, the video board position and bottom edge, board
//  structure details, train position, panel section and overlap, truss and lattice detail, light bank positions, flag colors.
const D2R = Math.PI / 180;
// roof frame: world x = A*u + B*v, z = -B*u + A*v with A=0.763, B=0.647 (u toward right-field side, v toward first base side)
const A = 0.763, B = 0.647, TH = Math.atan2(-A, B);
const XZ = (u, v) => [A * u + B * v, -B * u + A * v];

export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 315, h: 19 }, { deg: -20.6, r: 366, h: 19 }, { deg: -20.55, r: 366, h: 9 },
        { deg: -4.4, r: 410, h: 9 }, { deg: 11.3, r: 419, h: 9 }, { deg: 24, r: 370, h: 9 }, { deg: 24.05, r: 370, h: 7 },
        { deg: 45, r: 326, h: 7 },
      ],
      foulScale: 1, backstop: 52,
      // bowl tables (t 0 = right-field pole, 0.5 = behind home, 1 = left-field pole), see the top comment
      lower: { depth: [[0, 108], [0.1, 104], [0.2, 96], [0.3, 90], [0.35, 86], [0.4, 82], [0.44, 76], [0.47, 75], [0.5, 78], [0.53, 78], [0.56, 76], [0.6, 74], [0.7, 76], [0.78, 80], [0.9, 84], [1, 90]], slope: 0.38, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: [[0, 8], [0.1, 8], [0.2, 8], [0.3, 14], [0.35, 24], [0.4, 28], [0.44, 28], [0.47, 25], [0.5, 22], [0.53, 20], [0.56, 22], [0.6, 24], [0.7, 28], [0.78, 28], [0.9, 26], [1, 28]],
               rise: [[0, 8.9], [0.1, 10.4], [0.2, 13.5], [0.3, 25.8], [0.35, 29.8], [0.4, 32.9], [0.44, 35.2], [0.47, 31.8], [0.5, 23.0], [0.53, 22.3], [0.56, 34.2], [0.6, 35.7], [0.7, 32.6], [0.78, 27.1], [0.9, 22.3], [1, 18.1]],
               depth: [[0, 64], [0.1, 64], [0.2, 64], [0.3, 52], [0.35, 54], [0.4, 54], [0.44, 54], [0.47, 58], [0.5, 68], [0.53, 68], [0.56, 52], [0.6, 52], [0.7, 58], [0.78, 64], [0.9, 68], [1, 72]], slope: 0.65, extent: [0.04, 0.96] },
      outfield: { depth: 34, slope: 0.5, spans: [[-45, -20.6, 30, 0.55], [-20.6, -4.4, 30, 0.5], [11.3, 45, 70, 0.45]],
                  eye: [-4.4, 11.3], eyeHeight: 30, eyeDepth: 30 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2c3f66', facade: '#98583f', wall: '#2a4231', cream: '#e3d8b8' },
    };
  },

  build(ctx) {
    const { THREE, G, tools, parts, views } = ctx;
    const { textTexture, wallH, clamp } = tools;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });

    // ---- palette
    const BRICK = '#98583f', CREAM = '#e3d8b8', STONE = '#cfc4a3', BASE = '#5f5547', STEEL = '#3c4348', GIRDER = '#86a6a0',
      TEAL = '#6a9893', WHITE = '#f2ede0', ROOFGREY = '#c9c1ac', GLASS = '#2a3640', IRON = '#23282b';

    // ---- roof frame group: local x = v, local z = -u, so a panel moved along local z travels along the rails
    const RF = new THREE.Group(); RF.rotation.y = TH; G.add(RF);

    // ---- merged-geometry builder (one draw call per material key), coordinates in the roof frame (u, v, y)
    const mats = {};
    const matFor = (k) => mats[k] || (mats[k] = k[0] === '#' ? lam(k) : k.startsWith('b') ? basic(k.slice(1)) : lam(k));
    const buf = new Map();
    const P = (u, y, v) => [v, y, -u];
    const tri = (k, a, b, c) => { let o = buf.get(k); if (!o) buf.set(k, o = []); o.push(...a, ...b, ...c); };
    const quad = (k, a, b, c, d) => { tri(k, a, b, c); tri(k, a, c, d); };
    // axis-aligned box in (u, v, y)
    const box = (k, u0, u1, v0, v1, y0, y1) => {
      const p = (u, v, y) => P(u, y, v);
      const a = p(u0, v0, y0), b = p(u1, v0, y0), c = p(u1, v1, y0), d = p(u0, v1, y0);
      const e = p(u0, v0, y1), f = p(u1, v0, y1), g = p(u1, v1, y1), h = p(u0, v1, y1);
      quad(k, e, f, g, h); quad(k, a, d, c, b);
      quad(k, a, b, f, e); quad(k, b, c, g, f); quad(k, c, d, h, g); quad(k, d, a, e, h);
    };
    // frustum (hip roof): base rectangle at y0, top rectangle inset by ins (u and v) at y1
    const hip = (k, u0, u1, v0, v1, y0, y1, insU, insV) => {
      const p = (u, v, y) => P(u, y, v);
      const b = [p(u0, v0, y0), p(u1, v0, y0), p(u1, v1, y0), p(u0, v1, y0)];
      const t = [p(u0 + insU, v0 + insV, y1), p(u1 - insU, v0 + insV, y1), p(u1 - insU, v1 - insV, y1), p(u0 + insU, v1 - insV, y1)];
      for (let i = 0; i < 4; i++) quad(k, b[i], b[(i + 1) % 4], t[(i + 1) % 4], t[i]);
      quad(k, t[0], t[1], t[2], t[3]);
    };
    // sloped slab running along u: eave (uA, yA) to ridge (uB, yB), v0..v1, thickness th
    const slabU = (k, uA, yA, uB, yB, v0, v1, th) => {
      const p = (u, v, y) => P(u, y, v);
      const a = p(uA, v0, yA), b = p(uB, v0, yB), c = p(uB, v1, yB), d = p(uA, v1, yA);
      const a2 = p(uA, v0, yA - th), b2 = p(uB, v0, yB - th), c2 = p(uB, v1, yB - th), d2 = p(uA, v1, yA - th);
      quad(k, a, b, c, d); quad(k, a2, d2, c2, b2); quad(k, a, a2, b2, b); quad(k, d, c, c2, d2);
      quad(k, a, d, d2, a2); quad(k, b, b2, c2, c);
    };
    const slabV = (k, vA, yA, vB, yB, u0, u1, th) => {
      const p = (u, v, y) => P(u, y, v);
      const a = p(u0, vA, yA), b = p(u0, vB, yB), c = p(u1, vB, yB), d = p(u1, vA, yA);
      const a2 = p(u0, vA, yA - th), b2 = p(u0, vB, yB - th), c2 = p(u1, vB, yB - th), d2 = p(u1, vA, yA - th);
      quad(k, a, b, c, d); quad(k, a2, d2, c2, b2); quad(k, a, a2, b2, b); quad(k, d, c, c2, d2);
      quad(k, a, d, d2, a2); quad(k, b, b2, c2, c);
    };
    // thin beam between two (u, y, v) points, as a square-section tube
    const beamK = (k, p0, p1, w) => {
      const a = new THREE.Vector3(p0[2], p0[1], -p0[0]), b = new THREE.Vector3(p1[2], p1[1], -p1[0]);
      const dir = b.clone().sub(a); const len = dir.length(); dir.normalize();
      const up = Math.abs(dir.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      const s = new THREE.Vector3().crossVectors(dir, up).normalize().multiplyScalar(w / 2), t = new THREE.Vector3().crossVectors(dir, s).normalize().multiplyScalar(w / 2);
      const c = [a.clone().add(s).add(t), a.clone().sub(s).add(t), a.clone().sub(s).sub(t), a.clone().add(s).sub(t)];
      const d = c.map((q) => q.clone().add(dir.clone().multiplyScalar(len)));
      for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(k, c[i].toArray(), c[j].toArray(), d[j].toArray(), d[i].toArray()); }
    };
    const flush = () => {
      for (const [k, arr] of buf) {
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.computeVertexNormals();
        RF.add(new THREE.Mesh(g, matFor(k)));
      }
      buf.clear();
    };

    // ======================================================================================================
    // 1. FACADE (measured rectangle in the roof frame)
    // ======================================================================================================
    const U_ST = -228, U_WALL = -170, U_TOP = 395, V_L = -392, V_R = 205, V_STRIP_OUT = 167;
    // half-disc arch head on a wall face (axis 'v': face at u = f, running along v; axis 'u': face at v = f)
    const arcHead = (axis, f, t, y, r, c) => {
      const n = 6;
      for (let i = 0; i < n; i++) {
        const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n;
        const pt = (a) => axis === 'v' ? P(f, y + Math.sin(a) * r, t + Math.cos(a) * r) : P(t + Math.cos(a) * r, y + Math.sin(a) * r, f);
        tri(c, axis === 'v' ? P(f, y, t) : P(t, y, f), pt(a0), pt(a1));
      }
    };
    // brick wall run with base, pilasters, window rows and cornice. axis 'v': wall along v at u = fixed; 'u': along u at v = fixed
    const wallRun = (axis, fixed, from, to, out, H, opts = {}) => {
      const { bay = low ? 40 : 24, rows = [H * 0.35, H * 0.7], brick = 'b', skip = () => false, tp = 2.6, winH = 14, winW = 8 } = opts;
      const col = opts.col || BRICK;
      const t0 = fixed, t1 = fixed + out * tp;
      if (axis === 'v') box(col, Math.min(t0, t1), Math.max(t0, t1), from, to, 0, H); else box(col, from, to, Math.min(t0, t1), Math.max(t0, t1), 0, H);
      const o1 = fixed + out * (tp + 0.9), o2 = fixed + out * (tp + 0.1);
      const sl = (a, b, y0, y1, c) => {   // band on the outer face
        if (axis === 'v') box(c, Math.min(fixed, o1), Math.max(fixed, o1), a, b, y0, y1); else box(c, a, b, Math.min(fixed, o1), Math.max(fixed, o1), y0, y1);
      };
      sl(from, to, 0, 9, BASE); sl(from, to, H * 0.5 - 1, H * 0.5 + 1, CREAM); sl(from, to, H - 7, H + 1.5, CREAM);
      const wq = (c, t, y, w, h) => {
        if (axis === 'v') quad(c, P(o2, y - h / 2, t - w / 2), P(o2, y - h / 2, t + w / 2), P(o2, y + h / 2, t + w / 2), P(o2, y + h / 2, t - w / 2));
        else quad(c, P(t - w / 2, y - h / 2, o2), P(t + w / 2, y - h / 2, o2), P(t + w / 2, y + h / 2, o2), P(t - w / 2, y + h / 2, o2));
      };
      for (let t = from + bay / 2; t < to - bay / 2 + 0.01; t += bay) {
        if (skip(t)) continue;
        if (axis === 'v') box(CREAM, Math.min(fixed, o1), Math.max(fixed, o1), t - bay / 2 - 1.1, t - bay / 2 + 1.1, 9, H - 7); else box(CREAM, t - bay / 2 - 1.1, t - bay / 2 + 1.1, Math.min(fixed, o1), Math.max(fixed, o1), 9, H - 7);
        rows.forEach((y) => {
          if (opts.arch && !low) { arcHead(axis, o2, t, y + winH / 2, winW / 2 + 1.2, CREAM); arcHead(axis, o2 + 0.02 * out, t, y + winH / 2, winW / 2, 'b' + GLASS); }
          wq('b' + GLASS, t, y, winW, winH);
          if (!low && !opts.arch) wq(CREAM, t, y + winH / 2 + 1, winW + 2.6, 1.8);
        });
      }
    };
    // pale cream wall with pilasters, a banded cap and a rounded cornice (H0 = bottom, H1 = top)
    const CW = '#d9cfae';
    function creamWall(axis, fixed, from, to, out, H0, H1) {
      const t1 = fixed + out * 3, o = fixed + out * 5;
      const bx = (c, a0, a1, f0, f1, y0, y1) => axis === 'v' ? box(c, Math.min(f0, f1), Math.max(f0, f1), a0, a1, y0, y1) : box(c, a0, a1, Math.min(f0, f1), Math.max(f0, f1), y0, y1);
      bx(CW, from, to, fixed, t1, H0, H1);
      bx(CREAM, from, to, fixed, fixed + out * 5.5, H1 - 8, H1 - 5);     // band
      bx(CREAM, from, to, fixed, fixed + out * 7, H1 - 5, H1 + 1.5);       // overhanging cornice
      const bay = low ? 60 : 30;
      for (let t = from + bay / 2; t < to - 2; t += bay) bx(CREAM, t - 2, t + 2, fixed, o, H0, H1 - 8);   // pilasters
    }
    const gateSkip = [];
    // ---- home side: low pavilion block (u -250..-170), teal hip roofs, flat cream roofs, tall brick wall behind
    box(BRICK, U_ST, U_WALL, -415, V_R, 0, 56);
    wallRun('v', U_ST, -415, V_R, -1, 54, { rows: [16, 34], arch: true, skip: (t) => (t > -52 && t < 38) });
    // photo 2: above the brick block the outer wall of the upper deck is pale cream concrete with tall pilasters and a rounded cap
    creamWall('v', U_WALL, -392, V_R, -1, 56, 104);
    box(CREAM, U_ST, U_WALL, -415, V_R, 54, 57);                      // parapet slab over the block
    slabU(TEAL, -243, 57, -170, 69, -415, V_R, 2);                    // photo 2: continuous teal copper band between the brick block and the cream wall
    // teal hip roofs (measured v ranges), flat equipment roofs between
    const hipRoofs = [[-413, -327], [-237, -153], [-67, 17], [110, 190]];
    hipRoofs.forEach(([a, b]) => hip(TEAL, -215, -170, a, b, 60, 76, 10, 12));
    // ---- first-base side: low block to v 205 (gray terrace roof), tall brick wall under the strip
    box(STONE, -170, 360, V_STRIP_OUT, V_R, 0, 44); box(ROOFGREY, -170, 360, V_STRIP_OUT, V_R, 44, 46);
    wallRun('u', V_R, -170, 360, 1, 44, { rows: [20], bay: low ? 44 : 28, arch: true });
    creamWall('u', V_STRIP_OUT, -170, 353, 1, 46, 104);
    // ---- center-field / left side: stone wall carrying the train track, under the left rail
    wallRun('u', V_L, -170, U_TOP, -1, 36, { rows: [20], col: STONE, bay: low ? 44 : 28, arch: true, winH: 13 });
    box(BASE, 60, 335, V_L - 4, V_L + 2, 36, 37.4);
    slabV(TEAL, V_L, 34, -344, 27, -97, U_TOP, 2.5);                        // concourse roof between the wall and the Crawford stands (teal band on the sheet)
    box(CREAM, -97, U_TOP, -366, -362, 25, 28);
    // ---- top side under the stack roof (u 395)
    wallRun('v', U_TOP, V_L, V_STRIP_OUT + 38, 1, 62, { bay: 30, rows: [26, 46] });
    // ---- barrel vaults (instanced geometry, 1 draw call): home entrance and right end
    {
      const vg = new THREE.CylinderGeometry(1, 1, 1, 14, 1, false, 0, Math.PI); vg.rotateZ(Math.PI / 2); // axis along x, arch up
      const items = [[-246, -7, 80, 40, 20], [-125, 211, 36, 56, 16]];  // u center, v center, v width, u length, radius (height)
      const im = new THREE.InstancedMesh(vg, lam(TEAL), items.length);
      const tm = new THREE.Object3D();
      items.forEach(([u, v, w, len, r], i) => {
        tm.position.set(v, 36, -u); tm.rotation.set(0, Math.PI / 2, 0); tm.scale.set(len, r, w / 2); tm.updateMatrix(); im.setMatrixAt(i, tm.matrix);
      });
      RF.add(im);
    }
    // ---- home gate (photo 2): three dark arched openings under a flat teal canopy, ballpark name in plain text on the vault end
    {
      const gv = -7;
      for (const dv of [-26, -7, 12]) { box('#2b3236', U_ST - 0.6, U_ST + 0.2, gv + dv - 8, gv + dv + 8, 0, 18); arcHead('v', U_ST - 0.7, gv + dv, 18, 8, '#2b3236'); }
      box(TEAL, U_ST - 15, U_ST, gv - 40, gv + 40, 29, 31.5); box(CREAM, U_ST - 15, U_ST, gv - 40, gv + 40, 27.8, 29);
      if (!low) for (const dv of [-40, -14, 12, 38]) box(BASE, U_ST - 14, U_ST - 12, gv + dv - 0.8, gv + dv + 0.8, 0, 28);
      const tx = textTexture((g, w, h) => { g.fillStyle = '#4f6f6b'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8dcbc'; g.font = 'bold 40px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DAIKIN PARK', w / 2, h / 2 + 2); }, 256, 48);
      const sign = ctx.add(new THREE.PlaneGeometry(56, 10.5), new THREE.MeshBasicMaterial({ map: tx }), RF);
      sign.position.set(gv, 44, 266.6);   // plane faces local +z = toward -u (outside)
    }
    // ---- home entrance: brick clock tower beside the barrel vault (plain faces, no numerals)
    const TOWER = { u: -232, v: 224, w: 34, h: 128 };   // photo 2: at the first-base end of the home facade
    box(BRICK, TOWER.u - TOWER.w / 2, TOWER.u + TOWER.w / 2, TOWER.v - TOWER.w / 2, TOWER.v + TOWER.w / 2, 0, TOWER.h);
    box(BASE, TOWER.u - TOWER.w / 2 - 1.5, TOWER.u + TOWER.w / 2 + 1.5, TOWER.v - TOWER.w / 2 - 1.5, TOWER.v + TOWER.w / 2 + 1.5, 0, 10);
    box(CREAM, TOWER.u - TOWER.w / 2 - 1.5, TOWER.u + TOWER.w / 2 + 1.5, TOWER.v - TOWER.w / 2 - 1.5, TOWER.v + TOWER.w / 2 + 1.5, TOWER.h - 8, TOWER.h);
    box(CREAM, TOWER.u - TOWER.w / 2 - 1.5, TOWER.u + TOWER.w / 2 + 1.5, TOWER.v - TOWER.w / 2 - 1.5, TOWER.v + TOWER.w / 2 + 1.5, 92, 95);
    hip('#5d4a3c', TOWER.u - TOWER.w / 2, TOWER.u + TOWER.w / 2, TOWER.v - TOWER.w / 2, TOWER.v + TOWER.w / 2, TOWER.h, TOWER.h + 34, 14, 14);
    {
      const hw = TOWER.w / 2 + 0.7, cy = TOWER.h - 24, r = 7;
      const disc = (c, rr, a) => { for (let q = 0; q < 14; q++) { const a0 = q / 14 * Math.PI * 2, a1 = (q + 1) / 14 * Math.PI * 2; const f = (ang, ra) => a(ang, ra); tri(c, f(0, 0), f(a0, rr), f(a1, rr)); } };
      for (const [du, dv, face] of [[-1, 0, 'u'], [1, 0, 'u'], [0, -1, 'v'], [0, 1, 'v']]) {
        const mk = (ang, ra) => face === 'u' ? P(TOWER.u + du * hw, cy + Math.sin(ang) * ra, TOWER.v + Math.cos(ang) * ra) : P(TOWER.u + Math.cos(ang) * ra, cy + Math.sin(ang) * ra, TOWER.v + dv * hw);
        disc('b#efe6cb', r, mk);
      }
    }
    // ---- Union Station (left-field side, outside the left rail) and its teal roofs
    // photo 1: pale stone base (2 floors), red brick shaft (4 floors), ornate cornice with a balustrade; about 6 floors, 84 ft
    {
      const u0 = 40, u1 = 118, v0 = -480, v1 = -398;
      box(STONE, u0, u1, v0, v1, 0, 28); box(BRICK, u0 + 0.5, u1 - 0.5, v0 + 0.5, v1 - 0.5, 28, 80);
      box(CREAM, u0 - 2, u1 + 2, v0 - 2, v1 + 2, 80, 83); box(CREAM, u0 - 3.5, u1 + 3.5, v0 - 3.5, v1 + 3.5, 83, 86);
      box(CREAM, u0 - 1, u1 + 1, v0 - 1, v1 + 1, 86, 90); box(CREAM, u0 - 1, u1 + 1, v0 - 1, v1 + 1, 28, 30);
      for (let u = u0 + 2; u < u1; u += 15.6) box(CREAM, u - 0.7, u + 0.7, v0 - 3, v0, 86, 90);     // balustrade posts
      hip(TEAL, u0 + 8, u1 - 8, v0 + 8, v1 - 8, 90, 104, 12, 16);
      if (!low) {
        const wn = (c, vf, a0, a1, y, w, h) => { for (let u = a0; u < a1; u += 15.6) quad(c, P(u - w / 2, y, vf), P(u + w / 2, y, vf), P(u + w / 2, y + h, vf), P(u - w / 2, y + h, vf)); };
        for (const y of [6, 17]) wn('b#3b3a33', v0 - 0.3, u0 + 8, u1, y, 6.5, 9);
        for (const y of [35, 48, 61, 73]) { wn('b#3b3a33', v0 - 0.3, u0 + 8, u1, y, 5.5, 8); wn('b#3b3a33', v1 + 0.3, u0 + 8, u1, y, 5.5, 8); }
      }
    }
    box(STONE, 372, 440, -480, -398, 0, 40); hip(TEAL, 372, 440, -480, -398, 40, 58, 8, 30);
    if (!low) {
      const uq = (c, u0, u1, vf, y0, y1) => { for (let u = u0 + 8; u < u1 - 4; u += 16) quad(c, P(u - 3.5, y0, vf), P(u + 3.5, y0, vf), P(u + 3.5, y1, vf), P(u - 3.5, y1, vf)); };
      uq('b#3b3a33', 372, 440, -398.2, 8, 22);
    }
    flush();

    // ======================================================================================================
    // 2. LEFT-FIELD TRAIN: small steam locomotive and tender on the track over the left wall (plain boxes)
    // ======================================================================================================
    {
      const u0 = 165, vT = V_L - 1, y0 = 37.4;
      const L = (c, ua, ub, v0, v1, ya, yb) => box(c, u0 + ua, u0 + ub, vT + v0, vT + v1, y0 + ya, y0 + yb);
      L('#34383a', 0, 24, -3, 3, 3, 9); L('#34383a', 17, 21, -1.6, 1.6, 9, 17); L('#34383a', 0, 4, -4, 4, 9, 20); L('#34383a', -1, 5, -4.7, 4.7, 20, 21.2);
      for (const du of [5, 11, 17]) L('#2a2d2f', du - 2, du + 2, -3.4, 3.4, 0, 6);
      L('#34383a', -16, -2, -3.8, 3.8, 3, 10);
      L('#6a2f27', -24, -17, -3, 3, 3, 8);
      flush();
    }

    // ======================================================================================================
    // 3. BULLPEN LAWN AND SHEDS behind the right-center wall (model coordinates, measured)
    // ======================================================================================================
    {
      const ang = Math.atan2(0.631, 0.775);
      const lawn = ctx.add(new THREE.BoxGeometry(24, 0.8, 66), lam('#56703f')); lawn.position.set(129, 8, -375); lawn.rotation.y = ang;
      const shed = (x, z, w, d) => { const s = ctx.add(new THREE.BoxGeometry(w, 9, d), lam('#c9a773')); s.position.set(x, 12.5, z); s.rotation.y = ang;
        const r = ctx.add(new THREE.BoxGeometry(w + 3, 1.4, d + 3), lam('#6f6254')); r.position.set(x, 17.8, z); r.rotation.y = ang; };
      shed(113.5, -402, 24, 18); shed(144, -359, 22, 16);
    }

    // ======================================================================================================
    // 4. SCOREBOARDS, VIDEO BOARDS, LIGHT TOWER, FLAGPOLES (all faces blank)
    // ======================================================================================================
    // merged boxes in a group: list of [cx, cy, cz, sx, sy, sz] (group-local), one draw call per material
    const mergeBoxes = (list, mat, parent) => {
      const pos = [];
      const q = (a, b, c, d) => { pos.push(...a, ...b, ...c, ...a, ...c, ...d); };
      for (const [cx, cy, cz, sx, sy, sz] of list) {
        const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2;
        q([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]); q([x0, y0, z0], [x0, y0, z1], [x1, y0, z1], [x1, y0, z0]);
        q([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]); q([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
        q([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]); q([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat); parent.add(m); return m;
    };
    // slanted bar between two group-local points (square section w) as a box list entry replacement: returns a mesh added to parent
    const barMesh = (pts, mat, parent, w) => {
      const pos = [];
      for (const [p0, p1] of pts) {
        const a = new THREE.Vector3(...p0), b = new THREE.Vector3(...p1), dir = b.clone().sub(a), len = dir.length(); dir.normalize();
        const up = Math.abs(dir.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
        const s1 = new THREE.Vector3().crossVectors(dir, up).normalize().multiplyScalar(w / 2), t1 = new THREE.Vector3().crossVectors(dir, s1).normalize().multiplyScalar(w / 2);
        const c = [a.clone().add(s1).add(t1), a.clone().sub(s1).add(t1), a.clone().sub(s1).sub(t1), a.clone().add(s1).sub(t1)];
        const d = c.map((x) => x.clone().add(dir.clone().multiplyScalar(len)));
        for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; pos.push(...c[i].toArray(), ...c[j].toArray(), ...d[j].toArray(), ...c[i].toArray(), ...d[j].toArray(), ...d[i].toArray()); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat); parent.add(m); return m;
    };
    const gridTex = (cols, rows, base, line) => {
      const t = textTexture((g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); g.strokeStyle = line; g.lineWidth = 1;
        for (let i = 1; i < cols; i++) { g.beginPath(); g.moveTo(i * w / cols, 0); g.lineTo(i * w / cols, h); g.stroke(); }
        for (let j = 1; j < rows; j++) { g.beginPath(); g.moveTo(0, j * h / rows); g.lineTo(w, j * h / rows); g.stroke(); } }, 256, 128);
      return t;
    };
    const matSteel = lam('#4a4f52'), matFrame = lam('#b6a98a'), matDark = lam('#2d3438');
    {
      if (parts.scoreboard) ctx.remove(parts.scoreboard);
      // main video board: 124 x 54 ft (text source, Houston Astros 2010 announcement), right-center field, faces home plate.
      // Position from photos 4, 5 and 8: above the right-center seats under the roof truss, bottom edge about 38 ft above the seats' top row.
      const deg = 22, out = 62, v = tools.wallAt(deg, out, 0);
      const BW = 124, BH = 54, BY = 40;                    // width, height, bottom edge
      const grp = new THREE.Group(); grp.position.set(v.x, 0, v.z); grp.lookAt(0, 0, 0); G.add(grp);   // local +z toward home, +x toward the right-field side
      const faceMat = new THREE.MeshBasicMaterial({ map: gridTex(40, 18, '#161b1f', '#232b31') });
      const panel = (w, h, x, y, z, parent = grp) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), faceMat); m.position.set(x, y, z); parent.add(m); };
      const fr = [], tr = [];
      const board = (w, h, cx, by, depth) => {
        panel(w, h, cx, by + h / 2, depth / 2 + 0.2);
        fr.push([cx, by + h / 2, 0, w + 3, h + 3, depth]);                                            // slab behind the face
        fr.push([cx, by + h + 1.6, depth / 2, w + 5, 3.2, depth + 3], [cx, by - 1.6, depth / 2, w + 5, 3.2, depth + 3]);                   // top and bottom frame bars
        fr.push([cx - w / 2 - 1.6, by + h / 2, depth / 2, 3.2, h + 6, depth + 3], [cx + w / 2 + 1.6, by + h / 2, depth / 2, 3.2, h + 6, depth + 3]);
      };
      board(BW, BH, 0, BY, 5);
      // back structure: vertical trusses every 20 ft with two chords and diagonals, a catwalk along the bottom and a service walk on top
      const bk = -7;
      for (let x = -BW / 2; x <= BW / 2 + 0.1; x += 20.7) tr.push([[x, BY - 2, bk], [x, BY + BH + 2, bk]]);
      tr.push([[-BW / 2, BY + 3, bk], [BW / 2, BY + 3, bk]], [[-BW / 2, BY + BH - 3, bk], [BW / 2, BY + BH - 3, bk]]);
      if (!low) for (let x = -BW / 2; x < BW / 2 - 1; x += 20.7) { tr.push([[x, BY + 3, bk], [x + 20.7, BY + BH - 3, bk]], [[x + 20.7, BY + 3, bk], [x, BY + BH - 3, bk]]); }
      fr.push([0, BY - 5, -4, BW + 12, 1, 9]);                                                         // catwalk floor
      fr.push([0, BY - 2, -8.5, BW + 12, 0.8, 0.8], [0, BY - 2 , 0.4, BW + 12, 0.8, 0.8], [0, BY + BH + 5, -4, BW - 4, 0.8, 5]);          // handrails, top walk
      // support: two lattice legs and a cross girder from the ground to the catwalk, with side stays down to the back
      for (const x of [-BW * 0.34, BW * 0.34]) {
        fr.push([x, (BY - 6) / 2, bk - 3, 5, BY - 6, 5]);
        const n = low ? 3 : 6; for (let i = 0; i < n; i++) { const y0 = (BY - 6) * i / n, y1 = (BY - 6) * (i + 1) / n; tr.push([[x - 2.5, y0, bk - 3], [x + 2.5, y1, bk - 3]]); }
        tr.push([[x, BY - 6, bk - 3], [x * 1.0, BY - 6, 8]]);
      }
      fr.push([0, BY - 6.5, bk - 1, BW * 0.68 + 6, 3, 3]);
      mergeBoxes(fr, matFrame, grp); barMesh(tr, matSteel, grp, 1.4);
      // secondary boards beside it (blank): line-score board to the right-field side, a smaller ad/info board to the left-field side
      const sec = [];
      const sb = (w, h, cx, by) => { panel(w, h, cx, by + h / 2, 2.7); sec.push([cx, by + h / 2, 0, w + 3, h + 3, 4], [cx, by + h + 1.5, 1, w + 5, 3, 5], [cx, by - 1.5, 1, w + 5, 3, 5]); };
      sb(58, 30, BW / 2 + 40, BY + 4); sb(40, 22, -BW / 2 - 30, BY + 8);
      mergeBoxes(sec, matFrame, grp);
      for (const cx of [BW / 2 + 40, -BW / 2 - 30]) { const bb = [[[cx - 20, BY - 2, -5], [cx + 20, BY + 28, -5]], [[cx + 20, BY - 2, -5], [cx - 20, BY + 28, -5]]]; if (!low) barMesh(bb, matSteel, grp, 1.2); }
      mergeBoxes([[BW / 2 + 40, (BY + 2) / 2, -6, 3, BY + 2, 3], [-BW / 2 - 30, (BY + 2) / 2, -6, 3, BY + 2, 3]], matSteel, grp);
    }
    // long ribbon board on the club-level fascia: a thin dark band with a pale center line, blank
    {
      const N1 = ctx.dims.N1, da = ctx.dims.deckAt, pos = [], pos2 = [];
      const step = low ? 8 : 4;
      let prev = null;
      for (let g = Math.round(N1 * 0.07); g <= Math.round(N1 * 0.93); g += step) {
        const t = g / N1, d = da.d0(g) - 0.3, y = da.h0(g) - 8;
        const a = tools.foulAt(t, d, y), b = tools.foulAt(t, d, y + 3.6), c = tools.foulAt(t, d, y + 1.6), e = tools.foulAt(t, d, y + 2.0);
        if (prev) {
          pos.push(...prev[0].toArray(), ...a.toArray(), ...b.toArray(), ...prev[0].toArray(), ...b.toArray(), ...prev[1].toArray());
          pos2.push(...prev[2].toArray(), ...c.toArray(), ...e.toArray(), ...prev[2].toArray(), ...e.toArray(), ...prev[3].toArray());
        }
        prev = [a, b, c, e];
      }
      for (const [arr, col] of [[pos, '#1d2328'], [pos2, '#8a99a3']]) {
        const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); G.add(new THREE.Mesh(gg, basic(col)));
      }
    }
    // left-field light tower (photo 8): two lattice legs, cross braces, a catwalk and a wide lamp bank; about 95 ft (scaled from a door and the train)
    {
      const grp = new THREE.Group(); grp.position.set(-250, 0, -226); grp.lookAt(0, 0, 0); G.add(grp);
      const H = 95, W = 30, fr = [], tr = [];
      for (const x of [-W / 2, W / 2]) {
        fr.push([x, H / 2, 0, 3.2, H, 3.2]);
        const n = low ? 4 : 9; for (let i = 0; i < n; i++) { const y0 = H * i / n, y1 = H * (i + 1) / n; tr.push([[x - 1.6, y0, 0], [x + 1.6, y1, 0]]); }
      }
      const n = low ? 3 : 7; for (let i = 0; i < n; i++) { const y0 = H * 0.9 * i / n, y1 = H * 0.9 * (i + 1) / n; tr.push([[-W / 2, y0, 0], [W / 2, y1, 0]], [[W / 2, y0, 0], [-W / 2, y1, 0]]); }
      fr.push([0, H - 4, 0, W + 4, 1.4, 3], [0, H + 2.5, 1.5, 66, 8, 3], [0, H - 1, 2, 66, 0.8, 5]);     // cross girder, lamp bank housing, catwalk
      mergeBoxes(fr, matDark, grp); barMesh(tr, matSteel, grp, 1.1);
      const lamps = new THREE.InstancedMesh(new THREE.BoxGeometry(3.2, 2.6, 0.6), basic('#fff1c0'), low ? 12 : 28);
      const tm = new THREE.Object3D(); let k = 0;
      for (let r = 0; r < (low ? 1 : 2); r++) for (let i = 0; i < (low ? 12 : 14); i++) { tm.position.set(-30 + (i + 0.5) * 60 / (low ? 12 : 14), H + 0.2 + r * 3.4 + (low ? 2.5 : 0), 3.3); tm.updateMatrix(); lamps.setMatrixAt(k++, tm.matrix); }
      grp.add(lamps);
    }
    // flagpoles along the top of the train wall (photo 8): plain pennant-shaped flags in muted colours
    {
      const flags = ['#8d4a3c', '#e3d8b8', '#56708a', '#e3d8b8', '#8d4a3c', '#56708a'];
      const nF = low ? 3 : 6;
      for (let i = 0; i < nF; i++) {
        const u = 120 + i * (low ? 80 : 40), vv = V_L - 2;
        box('#d8d2c0', u - 0.4, u + 0.4, vv - 0.4, vv + 0.4, 36, 62);
        box(flags[i % flags.length], u + 0.4, u + 9, vv - 0.15, vv + 0.15, 54, 61);
      }
      flush();
    }

    // ======================================================================================================
    // 5. ROOF: fixed strips, rail girders and towers, three arched panels that slide along the rails
    // ======================================================================================================
    const Y_RAIL = 200, RISE = 40, V_PL = -385, V_PR = 125, V_RL = -372, V_RR = 115, U_END = 645;
    // ---- fixed roof strips (measured): behind home / third-base side, first-base side
    slabU(WHITE, -170, 102, -97, 148, -385, V_STRIP_OUT, 4);
    slabV(WHITE, V_STRIP_OUT, 104, 103, 148, -97, 353, 4);
    box(ROOFGREY, -170, -97, -385, V_STRIP_OUT, 98, 102); box(ROOFGREY, -97, 353, V_STRIP_OUT, V_STRIP_OUT + 1.5, 100, 104);
    // underside rafters of the strips and edge girders
    {
      const nR = low ? 7 : 14;
      for (let i = 0; i <= nR; i++) {
        const v = -385 + (V_STRIP_OUT + 385) * i / nR;
        beamK(STEEL, [-170, 100, v], [-97, 146, v], 1.4); beamK(STEEL, [-170, 101, v], [-134, 112, v], 1.2); beamK(STEEL, [-134, 112, v], [-97, 144, v], 1.0);
      }
      const nU = low ? 7 : 13;
      for (let i = 0; i <= nU; i++) {
        const u = -97 + 450 * i / nU;
        beamK(STEEL, [u, 146, V_STRIP_OUT], [u, 146, 103], 1.4); beamK(STEEL, [u, 102, V_STRIP_OUT], [u, 146, 103], 1.0);
      }
      beamK(GIRDER, [-170, 144, -385], [-97, 150, -385], 2.4);
      beamK(GIRDER, [-97, 148, 103], [353, 148, 103], 3.2); beamK(GIRDER, [-97, 142, 103], [353, 142, 103], 2.0);
      beamK(GIRDER, [-97, 150, -385], [-97, 150, 103], 3.2);
    }
    // ---- platform beside the stack (pale teal roof on lattice, v 125..207, u 353..612)
    box(TEAL, 353, 612, 125, 207, 190, 194); box(GIRDER, 353, 612, 205, 209, 150, 194);
    for (let u = 353; u <= 612; u += 43) { beamK(STEEL, [u, 40, 207], [u + 43, 190, 207], 1.6); beamK(STEEL, [u + 43, 40, 207], [u, 190, 207], 1.6); beamK(STEEL, [u, 190, 125], [u, 190, 207], 1.6); }
    // ---- rail girders (left v -372, right v 115) carried to the stack end, with posts and X-bracing
    {
      const xs = []; const pitch = low ? 94 : 63;
      for (let u = -97; u <= U_END + 0.1; u += pitch) xs.push(u);
      for (const vr of [V_RL, V_RR]) {
        beamK(GIRDER, [-97, Y_RAIL - 6, vr], [U_END, Y_RAIL - 6, vr], 6.5); beamK(STEEL, [-97, Y_RAIL - 20, vr], [U_END, Y_RAIL - 20, vr], 3);
        xs.forEach((u, i) => {
          if (u > 400 || i % 2 === 0) beamK(GIRDER, [u, 0, vr], [u, Y_RAIL - 6, vr], 4.6);
          if (i + 1 < xs.length) { beamK(STEEL, [u, Y_RAIL - 20, vr], [xs[i + 1], Y_RAIL - 6, vr], 1.6); beamK(STEEL, [u, Y_RAIL - 6, vr], [xs[i + 1], Y_RAIL - 20, vr], 1.6); }
        });
        // the stack end: braced towers (tall, lattice) beyond u 395
        for (let i = 0; i + 1 < xs.length; i++) if (xs[i] > 390) { const u = xs[i], un = xs[i + 1]; beamK(STEEL, [u, 10, vr], [un, Y_RAIL - 30, vr], 1.8); beamK(STEEL, [un, 10, vr], [u, Y_RAIL - 30, vr], 1.8); beamK(STEEL, [u, 100, vr], [un, 100, vr], 1.6); }
      }
      // cross girders across the span at both ends of the stack and at the home end
      for (const u of [-97, 395, U_END]) {
        beamK(GIRDER, [u, Y_RAIL - 6, V_RL], [u, Y_RAIL - 6, V_RR], 5);
        const nk = low ? 8 : 16;
        for (let i = 0; i < nk; i++) {
          const v0 = V_RL + (V_RR - V_RL) * i / nk, v1 = V_RL + (V_RR - V_RL) * (i + 1) / nk, vm = (v0 + v1) / 2;
          beamK(STEEL, [u, Y_RAIL - 30, v0], [u, Y_RAIL - 6, vm], 1.6); beamK(STEEL, [u, Y_RAIL - 6, vm], [u, Y_RAIL - 30, v1], 1.6); beamK(STEEL, [u, Y_RAIL - 30, v0], [u, Y_RAIL - 30, v1], 2);
        }
      }
      flush();
    }
    // ---- lamp banks (instanced) along both rails and the strip edges
    {
      const lamps = [], faces = [];
      const tmpO = new THREE.Object3D();
      const addLamp = (u, y, v, ru, rv) => {   // ru, rv: bank length along u / along v
        for (const [arr, s] of [[lamps, 1], [faces, 0.9]]) {
          const p = P(u, y, v); tmpO.position.set(p[0], p[1], p[2]); tmpO.rotation.set(0, 0, 0); tmpO.scale.set(rv * s, 3.6 * s, ru * s); tmpO.updateMatrix(); arr.push(tmpO.matrix.clone());
        }
      };
      const stepR = low ? 70 : 38;
      for (let u = -80; u <= 390; u += stepR) { addLamp(u, Y_RAIL - 26, V_RL + 8, 10, 3); addLamp(u, Y_RAIL - 26, V_RR - 8, 10, 3); }
      for (let u = 410; u <= 640; u += stepR * 1.2) { addLamp(u, Y_RAIL - 26, V_RL + 8, 10, 3); addLamp(u, Y_RAIL - 26, V_RR - 8, 10, 3); }
      for (let v = -370; v <= 160; v += stepR) addLamp(-100, 142, v, 3, 12);
      for (let u = -80; u <= 350; u += stepR) addLamp(u, 140, 100, 12, 3);
      const mkI = (geo, mat, ms) => { const im = new THREE.InstancedMesh(geo, mat, ms.length); ms.forEach((m, i) => im.setMatrixAt(i, m)); RF.add(im); };
      const bx = new THREE.BoxGeometry(1, 1, 1);
      mkI(bx, lam('#41484d'), lamps); mkI(bx, basic('#fff1c0'), faces.map((m) => m.clone().multiply(new THREE.Matrix4().makeTranslation(0, -0.2, 0))));
    }
    // ---- panels: arched shells (parabolic across v), ribs underneath, travelling along u
    {
      if (ctx.park && ctx.park.roof) { ctx.park.roof.forEach((r) => { if (r.panel && r.panel.parent) r.panel.parent.remove(r.panel); }); ctx.park.roof.length = 0; }
      const vc = (V_PL + V_PR) / 2, hw = (V_PR - V_PL) / 2;
      const arch = (v) => RISE * (1 - Math.pow((v - vc) / hw, 2));
      const nSeg = low ? 12 : 24;
      const latt = textTexture((g, w, h) => {
        g.fillStyle = 'rgba(242,238,224,0.8)'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(110,118,122,0.7)'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
        g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
      }, 64, 64);
      latt.wrapS = latt.wrapT = THREE.RepeatWrapping;
      const pmat = new THREE.MeshLambertMaterial({ map: latt, transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false });
      const ribGeo = new THREE.BoxGeometry(1, 1, 1);
      const makePanel = (len, uClosed, uOpen, dyOpen) => {
        const pos = [], uv = [];
        for (let i = 0; i < nSeg; i++) {
          const v0 = V_PL + (V_PR - V_PL) * i / nSeg, v1 = V_PL + (V_PR - V_PL) * (i + 1) / nSeg;
          const a = [v0, arch(v0), -len / 2], b = [v1, arch(v1), -len / 2], c = [v1, arch(v1), len / 2], d = [v0, arch(v0), len / 2];
          for (const [p, tu, tv] of [[a, v0 / 30, 0], [b, v1 / 30, 0], [c, v1 / 30, len / 30], [a, v0 / 30, 0], [c, v1 / 30, len / 30], [d, v0 / 30, len / 30]]) { pos.push(...p); uv.push(tu, tv); }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals();
        const panel = new THREE.Mesh(g, pmat); RF.add(panel);
        // arched ribs hanging under the shell: top chord follows the arch, lower chord 9 ft below, zigzag between
        const ms = [], tmpO = new THREE.Object3D();
        const seg = (p0, p1, th, zc) => {
          const a = new THREE.Vector3(...p0), b = new THREE.Vector3(...p1), dir = b.clone().sub(a);
          tmpO.position.copy(a).add(b).multiplyScalar(0.5); tmpO.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
          tmpO.scale.set(th, dir.length(), th); tmpO.updateMatrix(); ms.push(tmpO.matrix.clone());
        };
        const nRib = Math.max(2, Math.round(len / (low ? 60 : 36)) + 1), nS = low ? 8 : 16;
        for (let r = 0; r < nRib; r++) {
          const z = -len / 2 + len * r / (nRib - 1);
          const top = [], bot = [];
          for (let s = 0; s <= nS; s++) { const v = V_PL + (V_PR - V_PL) * s / nS; top.push([v, arch(v) - 1, z]); bot.push([v, arch(v) - 9, z]); }
          for (let s = 0; s < nS; s++) {
            seg(top[s], top[s + 1], 1.5); seg(bot[s], bot[s + 1], 1.3);
            if (!low || s % 2 === 0) seg(s % 2 ? top[s] : bot[s], s % 2 ? bot[s + 1] : top[s + 1], 0.9);
          }
        }
        const im = new THREE.InstancedMesh(ribGeo, lam('#4a5257'), ms.length); ms.forEach((m, i) => im.setMatrixAt(i, m)); panel.add(im);
        ctx.park.roof.push({ panel, closedZ: -uClosed, openZ: -uOpen, closedY: Y_RAIL, openY: Y_RAIL + dyOpen });
        return panel;
      };
      // closed: 120 / 240 / 120 ft panels end to end (u -97 .. 393); open: stacked beyond the bowl (u 397 .. 640)
      makePanel(240, 143, 520, 0);       // large middle panel
      makePanel(126, 330, 590, 11);      // small right-field-side panel
      makePanel(126, -34, 460, 22);      // small home-side panel
      ctx.park._placeRoof();
    }

    // ---- extra camera views (roof frame points)
    const at = (u, v, y) => { const [x, z] = XZ(u, v); return [x, y, z]; };
    views.gate = { pos: at(-360, 60, 30), look: at(-232, 110, 62), label: 'Clock Tower' };
    views.train = { pos: at(60, -250, 52), look: at(165, -392, 60), label: 'Train Wall' };
    views.roof = { pos: at(-520, -140, 380), look: at(230, -130, 160), orbit: true, label: 'Roof' };
  },
};
