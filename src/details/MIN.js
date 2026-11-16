// Detail module: Target Field, Minnesota Twins (opened 2010). Units: feet.
// MEASURED FROM THE SATELLITE SHEET (home plate and second base picked on mosaic.png; mound at z = -60, 1B line checked):
//  - canopy: inner (front) and outer (back) edge tables CAN_IN / CAN_OUT. Behind home plate the roof front edge is at z = +78 and
//    the back edge at z = +140 (a band 60 ft wide); it widens to 70-80 ft on the sides; left-field end is cut square at
//    z = -250 (x -335..-353); the right-field end tapers to a point at (338, -442) after an 80 ft wedge at the first-base side.
//  - seat front edge (rail) of the foul-side seats: backstop at z = +38, 46-48 ft off the foul lines near home, running
//    out to the poles; best fit of the generic seating curve is foulScale 1.0 / backstop 38 (rms 10 ft).
//  - lower-level seats show 40 ft of depth behind home, 55-70 ft on the sides, 90 ft near the poles before the roof starts.
//  - left-field stands: front edge along the wall, back edge table LF_BACK (about 95-100 ft behind the wall at -33 deg,
//    narrowing to 25 ft near center); concourse roofs outside the left-field pole.
//  - right-field: small stand block behind the pole (208,-292)..(260,-225), overhang strip 24-36 deg, roof deck turf platform
//    (224,-377)..(303,-334), white roof over its back.
//  - center field: building behind the wall at x -72..48, z -480..-435; the batter's eye is the dark band in front of it,
//    about +-57 ft wide; wall measured at 335-405 ft and kept at the posted distances 339 / 377 / 411 / 367 / 328.
//  - home-gate sloped white canopy: corners (-73,188) (7,195) (64,244) (45,270).
// FROM TEXT SOURCES: limestone (Kasota-type) facade with glass and metal, lights carried on the canopy front edge, 8 ft wall
//  from the left-field pole to right-center and 23 ft in right field, overhanging seats in right field, scoreboard in left-center.
// LEVEL 4 (photographs photo1..photo8 + sheet + text):
//  C SEATING. Roof front edge measured on the sheet along the bowl normals: 38 ft off the seat front behind home, 72-90 ft on the
//   lines and at the corners; roof back edge 100 ft behind home, 125-165 ft on the sides. Lower deck depth table (t = 0 right-field
//   pole, 0.5 home, 1 left-field pole): 70 / 100 (lines) / 60 (home) / 100 / 84; upper deck 45-55 ft deep, overhang 20, rise 16-20;
//   lower slope 0.42 (a row rises about 1.15-1.25 ft when counted at 40 rows on the lines, 24 rows behind home); upper slope 0.72
//   (2.0-2.2 ft per row, 14+7 rows from text). Back of the upper deck 95 ft (home), 132 ft (lines), 10 ft in front of the roof back edge.
//   Left field is a custom three-tier stand (lower seats to the ribbon fascia at 31 ft, mezzanine to 56 ft, upper tier to 82 ft; photos
//   4, 7) whose back edge is fitted to the main-board line measured on the sheet; the bullpens sit under the mezzanine (photo 7).
//  D BOARDS. Main left-field board: 57 x 178 ft (MLB press release 2023): centre panel and two wing panels, four lattice masts, a lamp
//   truss on top, a catwalk under it and a gray back wall (photos 2, 7). Front line fitted on the sheet: (-221,-475)..(-69,-554), a 171 ft
//   strip, so the face points 27 deg off the radial. Centre-field sign frame 46 x 39 ft on an open lattice tower (photos 2, 7, 8).
//   Right-field board 28 x 77 ft, Twins Tower 74 x 33.5 ft with an open geodesic ball, bullpen display 8.5 x 96 ft, fence display
//   12 x 109 ft (all sizes from the press release; places from photos 4, 6, 8). Flagpoles: rim of the left-field stands (photo 7),
//   right-field roof deck (photo 6). Board faces are blank panels with a plain line grid.
//  B HEIGHTS (method): main board 57 ft (text) used as the ruler in photos 6 and 7 (63 px and 252 px high); board bottom 84 ft
//   +-8 (three ways: counting the three stand levels below it in photo 7 = 36 + 22 + 22 + 6 ft; the perspective of photo 6 with a 12 ft
//   eye and the 8 ft wall = 92 ft; photo 2 stone building = 1.1 board heights = 63 ft below the catwalk); lamp truss top = board top + 44 ft
//   (4.42 px/ft in photo 7: 193 px). Centre-field sign bottom 62 ft, top 108 ft, building top 60 ft (photo 7 crop with the 34 ft batter's eye as the ruler gives 78 ft; photo 6 horizon
//   method with the board bottom as the second point gives 54-65 ft; the lower value is used).
//   Right-field board bottom 56 ft (photo 4: its top at the left-field board bottom), tower top 110 ft (photo 6: 40 px above the board
//   at 1.7 px/ft). Row rise (1.2 ft lower, 2.1 ft upper) and story height 14-16 ft give the deck tops (45 ft lower deck on the lines,
//   92 ft upper deck back). Wall heights 8 / 23 ft from text. Shadows on the sheet fall on the stands and the field, so they were not used.
// STILL ESTIMATED: canopy height (92-108 ft; clear gap of about 12 ft above the last upper row, photo 3), facade 56-72 ft,
//  facade offset (30 ft behind the roof edge), gate pavilion positions and tower heights, right-field board and tower places,
//  the exact row counts per tier, building heights behind the stands, rib and lamp spacing, flag sizes.
const D2R = Math.PI / 180;
const LIME = '#d0bd8e', LIME_DK = '#a98d63', GLASS = '#3b5360', STEEL = '#4a5258', ROOFC = '#aeb8bb';

// canopy front edge, left-field end -> behind home -> right-field tip ([x, z])
const CAN_IN = [[-335, -250], [-327, -222], [-315, -200], [-297, -169], [-278, -141], [-258, -116], [-238, -94], [-217, -75], [-199, -55],
  [-181, -37], [-163, -19], [-143, -3], [-124, 15], [-103, 31], [-81, 48], [-56, 62], [-29, 73], [0, 78], [29, 76], [58, 72], [85, 62],
  [110, 48], [133, 29], [153, 10], [172, -9], [191, -28], [210, -48], [227, -69], [243, -92], [259, -116], [274, -142], [287, -170],
  [301, -200], [310, -220], [319, -240], [327, -260], [335, -280], [340, -320], [344, -380], [332, -410], [338, -442]];
// canopy back edge, same direction
const CAN_OUT = [[-353, -250], [-353, -220], [-347, -200], [-342, -164], [-330, -130], [-312, -99], [-292, -70], [-271, -44], [-248, -20],
  [-225, 3], [-202, 24], [-179, 47], [-155, 68], [-129, 91], [-100, 109], [-70, 125], [-35, 135], [0, 140], [36, 145], [71, 134],
  [105, 122], [139, 112], [165, 85], [193, 66], [217, 42], [241, 17], [260, -11], [285, -30], [308, -52], [326, -75], [338, -100],
  [347, -125], [352, -150], [372, -175], [382, -200], [382, -220], [380, -240], [372, -260], [364, -280], [368, -300], [380, -320],
  [388, -345], [388, -380], [372, -402], [350, -425], [338, -442]];
// left-field stands, back edge from the pole concourse to the center-field building
const LF_BACK = [[-259, -280], [-276, -331], [-219, -413], [-195, -449], [-167, -470], [-131, -504], [-76, -537]];
// right-field roof deck platform and the white roof behind it
const ROOFDECK = [[224, -377], [295, -410], [303, -334], [267, -311], [233, -335]];

export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 339, h: 8 }, { deg: -22, r: 377, h: 8 }, { deg: -5, r: 411, h: 8 }, { deg: 6, r: 405, h: 8 },
        { deg: 22, r: 367, h: 8 }, { deg: 24, r: 363, h: 8 }, { deg: 24.05, r: 363, h: 23 }, { deg: 45, r: 328, h: 23 },
      ],
      foulScale: 1.0,
      backstop: 38,
      lower: {
        depth: [[0, 66], [0.06, 82], [0.15, 98], [0.25, 102], [0.33, 96], [0.4, 80], [0.46, 66], [0.5, 60], [0.54, 64], [0.6, 78],
          [0.68, 94], [0.76, 102], [0.86, 98], [0.95, 88], [1, 82]],
        slope: 0.42, extent: [0, 1],
      },
      hasUpper: true,
      upper: {
        overhang: [[0, 16], [0.15, 20], [0.5, 20], [0.85, 20], [1, 16]],
        rise: [[0, 16], [0.15, 18], [0.5, 20], [0.85, 18], [1, 16]],
        depth: [[0, 44], [0.1, 54], [0.25, 52], [0.5, 55], [0.75, 52], [0.9, 54], [1, 46]],
        slope: 0.72, extent: [0.04, 0.96],
      },
      outfield: {
        depth: 100, slope: 0.5,
        spans: [[22, 45, 56, 0.45]],              // left field is the custom three-tier stand built below
        eye: [-8, 8], eyeHeight: 34, eyeDepth: 28,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f4466', facade: LIME, wall: '#2c3d4d', cream: '#e6dbbd' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, dims, parts, views } = ctx;
    const { sweepSolid, wallH, textTexture, normalsFor } = tools;
    const { dL, lowTop, dEnd, hTop } = dims;
    const spec = ctx.spec, lam = ctx.lam;
    const low = ctx.lod === 'low';
    ctx.remove(parts.lights);
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const beam = (a, b, th) => {                       // thin box from a to b ([x,y,z])
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); return tmp.matrix.clone();
    };
    const box = new THREE.BoxGeometry(1, 1, 1), plane = new THREE.PlaneGeometry(1, 1);
    const strip = (P, Q) => {                          // quad strip between two 3D polylines
      const pos = [];
      for (let i = 0; i < P.length - 1; i++) for (const p of [P[i], Q[i], Q[i + 1], P[i], Q[i + 1], P[i + 1]]) pos.push(p.x, p.y, p.z);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
    };
    const cr = (pts, n) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], 0, p[1])), false, 'centripetal').getSpacedPoints(n).map((v) => [v.x, v.z]);
    const CEN = [0, -140];
    const offset = (pts, nr, d) => pts.map((p, i) => [p[0] + nr[i][0] * (typeof d === 'function' ? d(i) : d), p[1] + nr[i][1] * (typeof d === 'function' ? d(i) : d)]);
    const poly = (pts, y0, y1, mat) => {               // flat polygon prism-less slab (top face only) from [x,z] points at height y
      const sh = new THREE.Shape(pts.map((p) => new THREE.Vector2(p[0], -p[1])));
      const g = new THREE.ShapeGeometry(sh); g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
      const m = ctx.add(g, mat); return m;
    };
    // Kasota-type limestone: random-bond ashlar, two courses (1.5 ft) per 3 ft of height, 24 ft per repeat (matches the sweep UVs)
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const stoneTex = textTexture((g, w, h) => {
      g.fillStyle = '#b3a37f'; g.fillRect(0, 0, w, h);
      const tones = ['#d8c9a0', '#d0bd90', '#ddcfac', '#c9b385', '#d4c196', '#cdb98c', '#e0d3b4', '#d2b488'];
      for (let r = 0; r < 2; r++) {
        let x = r * 23;
        while (x < w + 40) { const bw = (2.2 + rnd() * 3.6) * (w / 24); g.fillStyle = tones[Math.floor(rnd() * tones.length)]; g.fillRect(x - 40 + 1, r * (h / 2) + 1, bw - 2, h / 2 - 2); x += bw; }
      }
    }, 512, 64);
    stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
    const stoneMat = (wFt, hFt) => { const t = stoneTex.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(wFt / 24, hFt / 3); return new THREE.MeshLambertMaterial({ map: t }); };
    const stone = new THREE.MeshLambertMaterial({ map: stoneTex, side: THREE.DoubleSide });
    const lime = lam(LIME), limeDk = lam(LIME_DK), steelM = lam('#454c52');
    const FM = [stone, limeDk];

    // ---------- 1. Canopy from the measured inner and outer edges: skin, soffit, fascia, rib trusses, columns, lamp banks
    const NC = low ? 70 : 110;
    const inS = cr(CAN_IN, NC), outD = cr(CAN_OUT, 400);
    const outS = inS.map((p) => { let b = 0, bd = 1e9; outD.forEach((q, j) => { const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < bd) { bd = d; b = j; } }); return outD[b]; });
    {
      // roof height follows the upper deck: soffit about 12 ft above the last upper row (photo 3), never under 90 ft
      const bp = ctx.paths.bPts, dA = dims.deckAt, T = 3;
      const yFs = inS.map((p) => { let b = 0, bd = 1e9; bp.forEach((q, j) => { const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < bd) { bd = d; b = j; } }); return Math.max(90, dA.hTop(b) + 12); });
      const yBs = yFs.map((y) => y + 16);
      const Ft = [], Fb = [], Bt = [], Bb = [];
      inS.forEach((p, i) => { const q = outS[i]; Ft.push(new THREE.Vector3(p[0], yFs[i], p[1])); Fb.push(new THREE.Vector3(p[0], yFs[i] - T, p[1])); Bt.push(new THREE.Vector3(q[0], yBs[i], q[1])); Bb.push(new THREE.Vector3(q[0], yBs[i] - T, q[1])); });
      ctx.add(strip(Ft, Bt), new THREE.MeshLambertMaterial({ color: ROOFC, side: THREE.DoubleSide }));
      ctx.add(strip(Fb, Bb), new THREE.MeshLambertMaterial({ color: '#7d878b', side: THREE.DoubleSide }));
      ctx.add(strip(Fb, Ft), lam('#8a9498'));
      ctx.add(strip(Bb, Bt), lam('#8a9498'));
      for (const k of [0, inS.length - 1]) ctx.add(strip([Fb[k], Bb[k]], [Ft[k], Bt[k]]), lam('#8a9498'));
      // underside ribs, columns and lamp banks
      const stepR = low ? 6 : 3, steel = [], lamps = [];
      for (let i = 1; i < inS.length - 1; i += stepR) {
        const a = [inS[i][0], yFs[i] - T, inS[i][1]], b = [outS[i][0], yBs[i] - T, outS[i][1]];
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 6, (a[2] + b[2]) / 2];
        steel.push(beam(a, b, 1.1));
        if (!low) { steel.push(beam(a, m, 0.7)); steel.push(beam(m, b, 0.7)); }
        if ((i - 1) / stepR % 2 === 0) {
          const t = 0.9, cx = inS[i][0] + (outS[i][0] - inS[i][0]) * t, cz = inS[i][1] + (outS[i][1] - inS[i][1]) * t;
          steel.push(beam([cx, 0, cz], [cx, yBs[i] - T - 1 - (1 - t) * 16, cz], 1.5));
        }
      }
      const nIn = normalsFor(inS, CEN);
      for (let i = 2; i < inS.length - 2; i += low ? 5 : 2) {
        const ry = Math.atan2(nIn[i][0], nIn[i][1]);
        lamps.push(mat4(inS[i][0] - nIn[i][0] * 1.2, yFs[i] - 5, inS[i][1] - nIn[i][1] * 1.2, 5, 2.2, 1, ry));
        if (!low) lamps.push(mat4(inS[i][0] - nIn[i][0] * 1.2, yFs[i] - 8.5, inS[i][1] - nIn[i][1] * 1.2, 5, 2.2, 1, ry));
      }
      inst(box, steelM, steel);
      inst(box, new THREE.MeshBasicMaterial({ color: '#f6ecc0' }), lamps);
    }

    // ---------- 2. Limestone facade 30 ft behind the roof edge, from the left-field end around home to the right-field side
    let fac = null, facN = null;
    {
      const src = CAN_OUT.slice(0, CAN_OUT.findIndex((p) => p[1] <= -230 && p[0] > 300));
      const sm = cr(src, low ? 60 : 100), nr = normalsFor(sm, CEN), n = sm.length;
      fac = offset(sm, nr, (i) => 30 - 22 * Math.pow(Math.max(0, 1 - Math.min(i, n - 1 - i) / 12), 1.5));
      facN = nr;
      const H = (i) => 56 + 16 * Math.min(1, Math.min(i, n - 1 - i) / 10);
      ctx.add(sweepSolid(fac, nr, (i) => { const h = H(i); return [[-3, 0], [1.6, 0], [1.6, 9], [0, 9], [0, h - 6], [1.8, h - 6], [1.8, h], [-3, h]]; }, [-1, 1, 0, 0, 0, 0, 0, 0], 0), FM);
      ctx.add(sweepSolid(fac, nr, (i) => { const h = H(i); return [[-0.2, h * 0.5], [-0.2, h * 0.5 + 5], [1.2, h * 0.5 + 5], [1.2, h * 0.5]]; }, [1, 1, 1, 1], 1), FM);
      // piers and glass bays
      const piers = [], glass = [], step = low ? 5 : 3;
      for (let i = 2; i < n - 2; i += step) {
        const h = H(i), x = fac[i][0] + nr[i][0] * 1.8, z = fac[i][1] + nr[i][1] * 1.8, ry = Math.atan2(nr[i][0], nr[i][1]);
        piers.push(mat4(x, h / 2, z, 2.4, h - 7, 2.6, ry));
        const gx = fac[i][0] + nr[i][0] * 0.7 + nr[i][1] * 5, gz = fac[i][1] + nr[i][1] * 0.7 - nr[i][0] * 5;
        glass.push(mat4(gx, h * 0.62, gz, 9, h * 0.34, 1, ry));
      }
      inst(box, limeDk, piers);
      inst(plane, new THREE.MeshBasicMaterial({ color: GLASS, side: THREE.DoubleSide }), glass);
      // gate pavilions: glass-and-steel entry blocks, taller stone tower behind home
      // Entrance (photo 1): stone block, flat steel-edged canopy about 16 ft up on two concrete piers, black iron gates under it,
      // and the ballpark name in plain steel letters on the stone above the canopy.
      const gts = [0.12, 0.3, 0.5, 0.72, 0.88], body = [], gl = [], cap = [], piersG = [], gates = [], names = [];
      gts.forEach((t, k) => {
        const i = Math.round(t * (n - 1)), hh = k === 2 ? 92 : 76, ry = Math.atan2(nr[i][0], nr[i][1]);
        const at = (d, u = 0) => [fac[i][0] + nr[i][0] * d + nr[i][1] * u, fac[i][1] + nr[i][1] * d - nr[i][0] * u];
        const c = at(8), f = at(17.3), cc = at(24);
        body.push(mat4(c[0], hh / 2, c[1], 34, hh, 16, ry));
        gl.push(mat4(f[0], hh * 0.58, f[1], 26, hh * 0.40, 1, ry));
        cap.push(mat4(c[0], hh + 1.2, c[1], 38, 2.4, 20, ry));
        cap.push(mat4(cc[0], 16, cc[1], 30, 1.2, 14, ry));
        for (const u of [-12.5, 12.5]) { const q = at(29, u); piersG.push(mat4(q[0], 8, q[1], 2.6, 16, 2.6, ry)); }
        const gq = at(16.6); gates.push(mat4(gq[0], 7, gq[1], 25, 14, 1, ry));
        const nq = at(16.5); names.push(mat4(nq[0], 16 + (hh * 0.58 - 16) * 0.0 + 11, nq[1], 30, 3.4, 1, ry));
      });
      inst(box, lime, body);
      inst(plane, new THREE.MeshBasicMaterial({ color: '#27414d', side: THREE.DoubleSide }), gl);
      inst(box, lam(STEEL), cap);
      inst(box, lam('#b3afa4'), piersG);
      inst(plane, new THREE.MeshBasicMaterial({ color: '#1c2226', side: THREE.DoubleSide }), gates);
      const nameTex = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#e4e7e5'; g.font = 'bold 58px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('T A R G E T   F I E L D', w / 2, h / 2 + 3); }, 1024, 80);
      inst(plane, new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide }), names);
    }
    // home-gate sloped white canopy (measured quad, rises toward the stadium)
    {
      const q = [[-73, 188], [7, 195], [64, 244], [45, 270]];
      const P = q.map((p, i) => new THREE.Vector3(p[0], i < 2 ? 38 : 24, p[1])), Q = q.map((p) => new THREE.Vector3(p[0], 38 + (p === q[0] || p === q[1] ? 0 : -14) - 3, p[1]));
      const g = new THREE.BufferGeometry(); const v = [P[0], P[1], P[2], P[0], P[2], P[3]]; const pos = []; v.forEach((p) => pos.push(p.x, p.y, p.z));
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      ctx.add(g, new THREE.MeshLambertMaterial({ color: '#e9e7df', side: THREE.DoubleSide }));
      const posts = [mat4(-70, 19, 188, 1.6, 38, 1.6), mat4(6, 19, 195, 1.6, 38, 1.6), mat4(62, 12, 243, 1.6, 24, 1.6), mat4(44, 12, 269, 1.6, 24, 1.6)];
      inst(box, steelM, posts);
    }

    // ---------- Shared helpers for the boards and their structures: boxes and beams are collected per material and merged
    const FLAGS = [], ACC = {}, unitBox = new THREE.BoxGeometry(1, 1, 1);
    const accBox = (k, x, y, z, sx, sy, sz, ry = 0) => (ACC[k] ||= []).push(mat4(x, y, z, sx, sy, sz, ry));
    const accBeam = (k, a, b, th) => (ACC[k] ||= []).push(beam(a, b, th));
    const mergeBoxes = (arr) => {
      const P = unitBox.attributes.position, Nn = unitBox.attributes.normal, ix = unitBox.index, pos = [], nor = [], idx = [];
      const v = new THREE.Vector3(), nm = new THREE.Matrix3();
      arr.forEach((m, k) => {
        nm.getNormalMatrix(m);
        for (let i = 0; i < P.count; i++) {
          v.fromBufferAttribute(P, i).applyMatrix4(m); pos.push(v.x, v.y, v.z);
          v.fromBufferAttribute(Nn, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z);
        }
        for (let j = 0; j < ix.count; j++) idx.push(ix.getX(j) + k * P.count);
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
      return g;
    };
    const BM = {   // materials of the board structures
      steelW: lam('#c3c7c3'), steelD: lam('#59636a'), dark: lam('#242c32'), back: lam('#a9a79e'), brown: lam('#7b6a58'), cream: lam('#d9d2bc'), concrete: lam('#b3afa4'),
    };
    const gridTex = (bg, line, stepPx, w, h) => textTexture((g, W, H) => {
      g.fillStyle = bg; g.fillRect(0, 0, W, H); g.strokeStyle = line; g.lineWidth = 1;
      for (let x = 0; x <= W; x += stepPx) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 0; y <= H; y += stepPx) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    }, w, h);
    const faceMat = new THREE.MeshBasicMaterial({ map: gridTex('#1d262c', '#2c3a43', 8, 512, 256), side: THREE.DoubleSide });
    const wingMat = new THREE.MeshBasicMaterial({ map: gridTex('#232c33', '#2b353c', 32, 256, 256), side: THREE.DoubleSide });
    const lampTex = textTexture((g, W, H) => {
      g.fillStyle = '#4b5258'; g.fillRect(0, 0, W, H); g.fillStyle = '#f4ecc4';
      for (let y = 4; y < H; y += 12) for (let x = 4; x < W; x += 12) g.fillRect(x, y, 8, 8);
    }, 512, 64);
    const lampMat = new THREE.MeshBasicMaterial({ map: lampTex, side: THREE.DoubleSide });
    // local frame: origin (cx, cz), n = outward normal of the board face, u = along the face, y = height
    const facing = (cx, cz, nx, nz) => {
      const yaw = Math.atan2(nx, nz), ux = Math.cos(yaw), uz = -Math.sin(yaw);
      const W = (u, n) => [cx + ux * u + nx * n, cz + uz * u + nz * n];
      return {
        yaw, W,
        bx(k, u, y, n, su, sy, sn) { const [x, z] = W(u, n); accBox(k, x, y, z, su, sy, sn, yaw); },
        bm(k, u1, y1, n1, u2, y2, n2, th) { const a = W(u1, n1), b = W(u2, n2); accBeam(k, [a[0], y1, a[1]], [b[0], y2, b[1]], th); },
        plane(mat, u, y, n, w, h) { const [x, z] = W(u, n); const m = ctx.add(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.y = yaw; return m; },
        // open lattice tower: four chords and zig-zag braces on the two wide faces
        mast(u, n, y0, y1, wu, wn, step) {
          for (const du of [-1, 1]) for (const dn of [-1, 1]) this.bx('steelW', u + du * wu / 2, (y0 + y1) / 2, n + dn * wn / 2, 1.1, y1 - y0, 1.1);
          let up = false;
          for (let y = y0; y + step <= y1 + 0.1; y += step) {
            for (const dn of [-1, 1]) this.bm('steelW', u + (up ? wu / 2 : -wu / 2), y, n + dn * wn / 2, u + (up ? -wu / 2 : wu / 2), y + step, n + dn * wn / 2, 0.55);
            if (!low) this.bx('steelW', u, y, n, wu, 0.5, wn);
            up = !up;
          }
        },
      };
    };
    // main video board: wings, centre panel, frame, back wall, masts, lamp truss, catwalks
    const mainBoard = (F, y0, h, wC, wW) => {
      const w = wC + 2 * wW, hc = h;
      F.plane(faceMat, 0, y0 + hc / 2, 0.35, wC, hc);
      F.plane(wingMat, -(wC + wW) / 2, y0 + hc / 2, 0.35, wW, hc);
      F.plane(wingMat, (wC + wW) / 2, y0 + hc / 2, 0.35, wW, hc);
      F.bx('dark', 0, y0 + hc / 2, -2.4, w, hc, 5);                         // cabinet
      F.bx('back', 0, y0 + hc / 2, -5.2, w - 4, hc - 3, 0.8);               // gray back wall (photo 2)
      for (const u of [-w / 2, -wC / 2, wC / 2, w / 2]) F.bx('steelW', u, y0 + hc / 2, 0.8, 1.6, hc + 2.4, 1.6);
      F.bx('steelW', 0, y0 - 0.6, 0.8, w, 1.2, 1.6); F.bx('steelW', 0, y0 + hc + 0.6, 0.8, w, 1.2, 1.6);
      // catwalk under the board and a walkway on its top, with rails
      F.bx('steelD', 0, y0 - 1.6, -6, w + 12, 0.8, 9); F.bx('steelW', 0, y0 + 2.4, -10.2, w + 12, 0.5, 0.5); F.bx('steelW', 0, y0 + 0.4, -10.2, w + 12, 0.4, 0.4);
      F.bx('steelD', 0, y0 + hc + 0.6, -6, w - 6, 0.7, 7); F.bx('steelW', 0, y0 + hc + 4, -9.4, w - 6, 0.5, 0.5);
      // masts: four lattice columns, the inner two carry the lamp truss
      const top = y0 + hc + 44, step = low ? 18 : 11;
      F.mast(-wC / 2, -7, y0 - 6, top, 5, 5, step); F.mast(wC / 2, -7, y0 - 6, top, 5, 5, step);
      F.mast(-w / 2 + 1, -7, y0 - 6, y0 + hc + 8, 4, 4, step); F.mast(w / 2 - 1, -7, y0 - 6, y0 + hc + 8, 4, 4, step);
      F.bx('steelW', 0, y0 + hc * 0.5, -9.6, w - 4, 0.8, 0.8);                // cross-tie behind the cabinet
      F.bx('steelW', 0, y0 + hc * 0.5, -4.8, w - 4, 0.8, 0.8);
      // lamp truss on top, 10 ft taller than the struts, with the lamp face toward the field
      const ty = y0 + hc + 37;
      F.bx('steelD', 0, ty, -8, wC + 4, 14, 6); F.plane(lampMat, 0, ty, -4.9, wC, 11.5);
      F.bx('steelW', 0, ty + 7.6, -8, wC + 4, 0.6, 6.4); F.bx('steelW', 0, ty + 9.6, -10.6, wC + 4, 0.5, 0.5);
    };
    // plain video board on posts: panel, frame, back box, catwalk, two posts
    const plainBoard = (F, y0, w, h, mat, post) => {
      F.plane(mat, 0, y0 + h / 2, 0.3, w, h);
      F.bx('dark', 0, y0 + h / 2, -1.8, w, h, 3.6); F.bx('back', 0, y0 + h / 2, -4.3, w - 3, h - 2, 1);
      F.bx('steelW', 0, y0 - 0.5, 0.5, w + 1, 1, 1.4); F.bx('steelW', 0, y0 + h + 0.5, 0.5, w + 1, 1, 1.4);
      for (const u of [-w / 2, w / 2]) F.bx('steelW', u, y0 + h / 2, 0.5, 1.2, h + 2, 1.4);
      F.bx('steelD', 0, y0 - 1.5, -4.5, w + 6, 0.7, 6); F.bx('steelW', 0, y0 + 2.2, -7.2, w + 6, 0.4, 0.4);
      if (post) for (const u of post) F.mast(u, -4, post.base, y0 - 1.5, 3.2, 3.2, 10);
    };

    // ---------- 3. Right field: stone wall facing, overhanging seats, stand block, roof deck platform, aux board, tower, fence display
    {
      const [p, nn, dg] = tools.span(24.05, 45);
      ctx.add(sweepSolid(p, nn, (i) => { const h = wallH(spec, dg[i]); return [[-0.5, 0], [-0.5, h], [0.5, h + 0.8], [0.5, 0]]; }, [1, 1, 1, -1], 1), FM);
      const [q, qn] = tools.span(24, 36);                 // overhanging seat section (measured strip 24-36 deg)
      ctx.add(sweepSolid(q, qn, () => [[-10, 24], [-10, 30], [10, 30], [10, 24]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.SHADE], MAT.CREAM), M);
      ctx.add(sweepSolid(q, qn, () => [[-10, 30], [-10, 33.5], [-9.4, 33.5], [-9.4, 30]], [1, 1, 1, 1], 1), FM);
      // back wall of the right-field stands and the plain concourse wall toward center
      const [r, rn] = tools.span(22, 45);
      ctx.add(sweepSolid(r, rn, () => [[58, 0], [58, 46], [64, 46], [64, 0]], [0, 0, 0, -1], 0), FM);
      const [r2, rn2] = tools.span(8.5, 22);
      ctx.add(sweepSolid(r2, rn2, () => [[24, 0], [24, 30], [28, 30], [28, 0]], [1, 1, 1, -1], 1), FM);
      // outfield fence display, 12 x 109 ft (press release), on the front of that concourse wall in right-center (photo 4)
      const [fp, fn] = tools.span(9, 22.5);
      ctx.add(sweepSolid(fp, fn, () => [[23.5, 12], [23.5, 24], [23.9, 24], [23.9, 12]], [0, -1, -1, -1], 0), [faceMat]);
      // roof deck: turf-colored platform on columns, with a rail
      poly(ROOFDECK, 44, 44, new THREE.MeshLambertMaterial({ color: '#6f8a58', side: THREE.DoubleSide }));
      const cols = ROOFDECK.map((p) => mat4(p[0], 22, p[1], 3, 44, 3));
      inst(box, limeDk, cols);
      const rail = [];
      for (let i = 0; i < ROOFDECK.length; i++) { const a = ROOFDECK[i], b = ROOFDECK[(i + 1) % ROOFDECK.length]; rail.push(beam([a[0], 47, a[1]], [b[0], 47, b[1]], 1.2)); }
      inst(box, steelM, rail);
      // white roof over the back of the roof deck (sloped panel)
      const rp = [[219, -402, 52], [296, -434, 52], [304, -412, 44], [226, -380, 44]].map((p) => new THREE.Vector3(p[0], p[2], p[1]));
      const rg = new THREE.BufferGeometry(); const rpos = []; [rp[0], rp[1], rp[2], rp[0], rp[2], rp[3]].forEach((v) => rpos.push(v.x, v.y, v.z));
      rg.setAttribute('position', new THREE.Float32BufferAttribute(rpos, 3)); rg.computeVertexNormals();
      ctx.add(rg, new THREE.MeshLambertMaterial({ color: '#e9e7df', side: THREE.DoubleSide }));
      // auxiliary board 28 x 77 ft, bottom 56 ft, on four lattice posts above that roof; faces the infield
      const A = facing(262, -412, -0.6, 0.8);
      plainBoard(A, 56, 77, 28, faceMat, null);
      for (const u of [-34, -11, 11, 34]) A.mast(u, -4, 44, 55, 3.2, 3.2, 11);
      // Twins Tower 74 x 33.5 ft: stone core, display with frame, open geodesic ball on top (no marks on it)
      const T = facing(318, -398, -0.55, 0.835);
      T.bx('brown', 0, 18, -5, 36, 36, 18);
      T.plane(faceMat, 0, 36 + 37, 0.4, 33.5, 74); T.bx('dark', 0, 36 + 37, -2, 33.5, 74, 4); T.bx('back', 0, 36 + 37, -4.3, 31, 72, 0.8);
      for (const u of [-16.75, 16.75]) T.bx('steelW', u, 36 + 37, 0.4, 1.4, 75, 1.6);
      T.bx('steelW', 0, 36 + 74.4, 0.4, 35, 1.2, 1.6); T.bx('steelW', 0, 35.6, 0.4, 35, 1.2, 1.6);
      T.bx('steelD', 0, 36 + 76.5, -2, 8, 3, 8);
      const [bx0, bz0] = T.W(0, -2);
      const ball = ctx.add(new THREE.IcosahedronGeometry(6, 1), new THREE.MeshBasicMaterial({ color: '#d9d4c3', wireframe: true }));
      ball.position.set(bx0, 36 + 76 + 7, bz0);
      // flagpoles on the roof deck, plain muted flags
      const FLAGC = ['#8e4038', '#3f5a7c', '#d9d0b4'];
      [0, 1, 2].forEach((k) => { accBox('steelW', 300 - k * 7, 44 + 17, -336 - k * 5, 0.6, 34, 0.6); });
      FLAGS.push(...[0, 1, 2].map((k) => [300 - k * 7 + 3.6, 44 + 31, -336 - k * 5, FLAGC[k], 0.5]));
    }

    // ---------- 4. Left field: custom three-tier stand fitted to the board line, bullpens under the mezzanine, building under the board
    const LFB = { cx: -145, cz: -514.5, nx: 0.462, nz: 0.889, y0: 84, h: 57 };          // board line measured on the sheet
    {
      const [lp, ln, ld] = tools.span(-45, -8);
      const n = lp.length, zSplit = ld.findIndex((d) => d >= -17);
      // back edge of the upper tier: ray along the wall normal to the board line, 4 ft short of it; 96 ft at the pole end
      const dBack = lp.map((q, i) => {
        const sd = (q[0] - LFB.cx) * LFB.nx + (q[1] - LFB.cz) * LFB.nz, den = ln[i][0] * LFB.nx + ln[i][1] * LFB.nz;
        const t = den < -0.05 ? -sd / den - 4 : 130;
        return Math.min(Math.max(t, 92), 142, 96 + (ld[i] + 45) * 2.6);
      });
      const hs = (i) => Math.min(1, 0.72 + (ld[i] + 45) / 16 * 0.28), sc = (i) => dBack[i] / 128;
      const H = (i, x) => 11 + (x - 11) * hs(i);
      const prof1 = (i) => { const c = sc(i), hw = Math.min(11, wallH(spec, ld[i]) + 3); return [[1.2, 0], [1.2, hw], [40 * c, H(i, 27)], [40 * c, H(i, 31)], [50 * c, H(i, 31)], [80 * c, H(i, 50)], [80 * c, H(i, 56)], [90 * c, H(i, 56)], [dBack[i], H(i, 82)], [dBack[i], 0]]; };
      const prof2 = (i) => { const c = sc(i); return [[38 * c, 0], [38 * c, H(i, 28)], [38 * c, H(i, 31)], [50 * c, H(i, 31)], [80 * c, H(i, 50)], [80 * c, H(i, 56)], [90 * c, H(i, 56)], [dBack[i], H(i, 82)], [dBack[i], 0]]; };
      const sl = (a, b) => [lp.slice(a, b + 1), ln.slice(a, b + 1)];
      const [p1, n1] = sl(0, zSplit), [p2, n2] = sl(zSplit, n - 1);
      ctx.add(sweepSolid(p1, n1, (i) => prof1(i), [MAT.WALL, MAT.SEAT, MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.FACADE, -1], MAT.CREAM), M);
      ctx.add(sweepSolid(p2, n2, (i) => prof2(i + zSplit), [MAT.WALL, MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.FACADE, -1], MAT.CREAM), M);
      // bullpen display 8.5 x 96 ft on the recess wall (photo 7), plain panel
      ctx.add(sweepSolid(p2, n2, (i) => { const c = sc(i + zSplit); return [[37.5 * c, 17.5], [37.5 * c, 26], [38 * c, 26], [38 * c, 17.5]]; }, [0, -1, -1, -1], 0), [faceMat]);
      // rails on the fascia tops of the mezzanine and the upper tier, aisles on the three tiers
      const offs = (d) => lp.map((q, i) => [q[0] + ln[i][0] * d(i), q[1] + ln[i][1] * d(i)]);
      const iFrac = (arr, fi) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(fi)))];
      const dA = (i) => 40 * sc(i), dB = (i) => 80 * sc(i), dC = (i) => 90 * sc(i);
      G.add(tools.rail(offs((i) => dB(i) + 0.4), (i) => H(i, 56), { height: 3.5, spacing: 8 }));
      if (!low) G.add(tools.rail(offs((i) => dA(i) + 0.4), (i) => H(i, 31), { height: 3.5, spacing: 8 }));
      const cut1 = sl(0, zSplit);
      G.add(tools.aisles(p1, n1, { d0: (fi) => 1.2, h0: (fi) => 11, d1: (fi) => dA(Math.round(fi)), h1: (fi) => H(Math.round(fi), 27) }, { every: 20 }));
      G.add(tools.aisles(lp, ln, { d0: (fi) => 50 * sc(Math.round(fi)), h0: (fi) => H(Math.round(fi), 31), d1: (fi) => dB(Math.round(fi)), h1: (fi) => H(Math.round(fi), 50) }, { every: 20 }));
      G.add(tools.aisles(lp, ln, { d0: (fi) => dC(Math.round(fi)), h0: (fi) => H(Math.round(fi), 56), d1: (fi) => dBack[Math.round(fi)], h1: (fi) => H(Math.round(fi), 82) }, { every: 20 }));
      // stone building under the main board (photo 2): two stone tiers, the lower one darker, flat roof at the walkway level
      const B = facing(LFB.cx, LFB.cz, LFB.nx, LFB.nz), bw = 192;
      const stoneF = stoneMat(bw, 80), stoneS = stoneMat(60, 80);
      const bb = ctx.add(new THREE.BoxGeometry(bw, 80, 54), [stoneS, stoneS, lam('#d3ccb8'), lam('#6e6455'), stoneF, stoneF]);
      { const [bx, bz] = B.W(0, -30); bb.position.set(bx, 40, bz); bb.rotation.y = B.yaw; }
      B.bx('brown', 0, 38, -2.6, bw + 1, 5, 50);                  // dark mid band between the two tiers
      B.bx('cream', 0, 80.6, -26, bw + 1, 1.2, 55);              // roof slab
      mainBoard(B, LFB.y0, LFB.h, 104, 36);
      // concourse roofs outside the pole
      const dk = new THREE.MeshLambertMaterial({ color: '#cfc7b4', side: THREE.DoubleSide });
      const b1 = ctx.add(new THREE.BoxGeometry(95, 36, 52), dk); b1.position.set(-290, 18, -300); b1.rotation.y = 0.6;
      const b2 = ctx.add(new THREE.BoxGeometry(60, 28, 40), dk); b2.position.set(-300, 14, -345); b2.rotation.y = 0.6;
      // flagpoles on the rim of the left-field stands (photo 7)
      const fl = [];
      for (let k = 0; k < 7; k++) {
        const i = Math.round(((ld.findIndex((d) => d >= -41) + k * 11)));
        const q = lp[i], nq = ln[i], d = dBack[i] + 1.5, y = H(i, 82);
        accBox('steelW', q[0] + nq[0] * d, y + 11, q[1] + nq[1] * d, 0.5, 22, 0.5);
        fl.push([q[0] + nq[0] * d + 3.2 * -nq[1], y + 19.5, q[1] + nq[1] * d + 3.2 * nq[0], ['#8e4038', '#3f5a7c', '#d9d0b4'][k % 3], Math.atan2(-nq[1], nq[0])]);
      }
      FLAGS.push(...fl);
    }

    // ---------- 5. Center field: stone building behind the batter's eye, open frame sign tower on it
    {
      const front = stoneMat(120, 60), side = stoneMat(45, 60);
      const b = ctx.add(new THREE.BoxGeometry(120, 60, 45), [side, side, lam('#d3ccb8'), lam('#6e6455'), front, front]); b.position.set(-12, 30, -457);
      const S = facing(-18, -460, 0.03, 1);
      // sign: blank 39 x 46 ft panel with steel frame on an open lattice tower; bottom 62 ft, top 108 ft
      const yS = 62;
      S.plane(new THREE.MeshBasicMaterial({ color: '#e7e3d6', side: THREE.DoubleSide }), 0, yS + 23, 0.4, 36, 43);
      S.bx('steelW', 0, yS + 0.8, 0.3, 39, 1.6, 1.6); S.bx('steelW', 0, yS + 45.2, 0.3, 39, 1.6, 1.6);
      for (const u of [-19.5, 19.5]) S.bx('steelW', u, yS + 23, 0.3, 1.6, 46, 1.6);
      S.bx('back', 0, yS + 23, -1.4, 37, 44, 0.8);
      for (const u of [-13, 13]) S.mast(u, -8, 60, yS + 40, 4, 12, 11);
      S.bx('steelD', 0, yS + 1.5, -9, 36, 0.7, 14); S.bx('steelW', 0, yS + 4.8, -15.5, 36, 0.5, 0.5);
      S.bx('steelD', 0, 60.3, -9, 40, 0.8, 22);
      // ballpark name in plain letters on the front of the building
      const [nx0, nz0] = S.W(0, 18);
      const nameTex = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#e4e7e5'; g.font = 'bold 72px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('T A R G E T   F I E L D', w / 2, h / 2 + 4); }, 1024, 96);
      const nm = ctx.add(new THREE.PlaneGeometry(67, 7.2), new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide }));
      nm.position.set(-12, 50, -434.2); nm.rotation.y = 0;
    }

    // ---------- Flags (one instanced mesh) and the merged board structures
    if (FLAGS.length) {
      const fm = new THREE.InstancedMesh(new THREE.PlaneGeometry(6.5, 3.8), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), FLAGS.length);
      FLAGS.forEach(([x, y, z, c, ry], i) => { fm.setMatrixAt(i, mat4(x, y, z, 1, 1, 1, ry)); fm.setColorAt(i, new THREE.Color(c)); });
      fm.instanceMatrix.needsUpdate = true; fm.instanceColor.needsUpdate = true; G.add(fm);
    }
    for (const [k, arr] of Object.entries(ACC)) ctx.add(mergeBoxes(arr), BM[k]);

    // ---------- 6. Extra views
    views.gate = { pos: [-40, 52, 420], look: [10, 45, 150], label: 'Home Gate' };
    const rA = tools.foulAt(0.3, dEnd - 10, hTop + 6), rB = tools.foulAt(0.62, dEnd - 10, hTop + 18);
    views.roof = { pos: [rA.x, rA.y, rA.z], look: [rB.x, rB.y, rB.z], label: 'Under Canopy' };
    const sA = tools.foulAt(0.16, dL - 10, lowTop + 4);
    views.lfboard = { pos: [79, 21, 32], look: [-120, 62, -470], label: 'Left Field Board' };
    views.rfboard = { pos: [-150, 30, -100], look: [275, 72, -420], label: 'Right Field Board' };
    views.stands = { pos: [sA.x, sA.y, sA.z], look: [-60, 20, -120], label: 'First Base Line' };
  },
};
