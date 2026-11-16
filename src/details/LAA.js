// Detail module: Angel Stadium, Anaheim (opened 1966, "The Big A"). Units: feet.  LEVEL 4 (photographs, heights, seating, boards).
// ---------------------------------------------------------------------------------------------------------------------
// MEASURED FROM THE SATELLITE SHEET (mosaic.png / survey.png; home plate at the origin; 1.1 px per foot):
//  - outfield wall (outer edge of the warning track): LF 347 at -45, 358 at -36, 378 at -24, 390 at -15, ~392 at -7,
//    CF 396-399 at 0..3, 385 at +7, 367 at +14, 356 at +20, then the wall bends in (about 340 at +27) to the RF pole.
//  - outer roof/facade outline (40 points): ~100 ft behind the front seat edge on both lines, ~165 ft behind home plate
//    (roof outer edge z = +224), wrapping round both outfield corners (roof ends near (-352,-370) and (364,-358)).
//  - roof ribbon ~35 ft wide on the lines and ~50 ft behind home; white panels with ribs seen from above.
//  - seat bands (left line, sheet is sunlit there): seat rows run ~65 ft out from the front edge, then a flat concourse,
//    then the roof; roof outer edge 116 ft out on the left line, ~150 on the right line (shadowed, so read from a few points
//    only), 165 behind home. Home gate: flat canopy trapezoid x -61..109 at z 225 and x -82..145 at z 286.
//  - rock pile footprint x -140..-58, z -512..-380; batter's-eye lawn x -18..88, z -500..-400; right-field bleacher bank
//    x 45..260, z -455..-335 (angles 7.6 to 33 deg); right-field board gantry from (141,-500) to (302,-406) = 186 ft long;
//    left-field board structure from (-317,-423) to (-220,-520) = 137 ft long (dark streak, lamp-tower footing white
//    platforms near (-335,-410) and (-214,-500)); bullpen clay patches in both corners.
// FROM THE PHOTOGRAPHS (level 4):
//  - photo1/2 facade: tan stucco lower wall (about 55 % of the height) under a dark teal-green upper band with vertical
//    ribs; green curved cantilevered gate canopy with four diagonal bat-shaped struts on ball footings; plain lettering
//    "ANGEL STADIUM" on the gate wall; two large red wire-dome canopies on columns flanking the plaza (side gates).
//  - photo3/8 exterior: low dark fascia, tan base, steel trusses behind the boards, light banks standing on the roof edge,
//    lattice light towers (4 legs, cross bracing) with a lamp bank on top; boards on dark-green painted back trusses.
//  - photo4/5/6/7 inside: main board over the right-center pavilion (wide, ~3.5:1), lamp bank + lattice just above it;
//    smaller board (main panel plus a narrow side panel) over left-center pavilion with a lattice light tower on its left;
//    third-base upper deck set well back from the club level (sky visible between), roofed; outfield pavilions are open
//    tiers with vomitories; thin ribbon boards on the upper-deck fascia along both lines; batter's eye is a low hedge
//    band with a lawn behind (not a tall wall); rock pile roughly 60 ft high; yellow foul poles; flagpoles on the LF pavilion.
// HEIGHTS AND METHODS (B):
//  - upper-deck top ~85-88 ft behind home, ~85 on both lines: lower-deck run x slope (0.4) + 22-38 ft gap + 0.6 x depth;
//    facade parapet = deck top + 8 (92-96 ft). Cross-check: photo1 tan wall : green band : total = 49 : 41 : 90 ft by
//    pixel ratio with the total fixed by the deck geometry.
//  - main board 182 x 52 ft (area 9,500 sq ft from the club's own news release, 186 ft gantry on the sheet), face bottom 70 ft
//    above the field: photo4 scale (board 185 px wide = 182 ft, 1 px = 1 ft) puts its bottom ~7 ft over the pavilion top row,
//    and the pavilion top = wall 18 + 3 + 0.55 x 100 = 76 (photo5 wall 15 px = 18 ft agrees with the board scale).
//    Lamp bank 56 x 36 ft sits 22 ft above the board top (photo4/5: bank 48-65 px wide, lattice gap ~22 px).
//  - left board main 86 + side panel 26 = 112 x 48 ft (area 5,300 of the published 5,488 sq ft), bottom 62 ft (pavilion top 55 + 7).
//  - towers: bank top about 180 ft (photo8: mast ~2.3 x the board back structure height); Big A 230 ft (text).
//  - gate canopy underside 28 ft, bats 9 to 28 ft (photo2: bat length ~38 ft against a 8-10 ft entry); domes 28 to 64 ft (photo1).
//  - shadows on the sheet were NOT usable: the stands cast long shadows over the whole right half, the only free-standing
//    object of known height (rock pile) has a shadow lying on other objects, so no ratio was taken.
// FROM TEXT: posted distances 347 / 390 / 396 / 370 / 350 and wall heights (5 ft LF corner, 8 ft center, 19 ft right
//  center, 18 ft right field), three decks, 9,500 and 5,488 sq ft boards, sandstone and green facade.
// STILL ESTIMATED: right-field deck depths (shadowed), the right-field wall between +27 deg and the pole, left-field
//  pavilion depth, dome and gate positions in plan (no sheet pixels: the sheet predates the domes), board bottom heights,
//  lamp-bank spacing on the roof, window pattern, the Big A position (it is beyond the mosaic edge).
const D2R = Math.PI / 180; void D2R;

export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 347, h: 5 }, { deg: -41, r: 351, h: 5 }, { deg: -36, r: 358, h: 5 }, { deg: -30, r: 368, h: 5 },
        { deg: -29.95, r: 368, h: 8 }, { deg: -24, r: 378, h: 8 }, { deg: -15, r: 390, h: 8 }, { deg: -7, r: 392, h: 8 },
        { deg: 0, r: 396, h: 8 }, { deg: 4, r: 394, h: 8 }, { deg: 7, r: 386, h: 8 }, { deg: 12, r: 374, h: 8 },
        { deg: 12.05, r: 374, h: 19 }, { deg: 14, r: 368, h: 19 }, { deg: 20, r: 357, h: 19 }, { deg: 24, r: 346, h: 19 },
        { deg: 30, r: 342, h: 19 }, { deg: 33, r: 342, h: 19 }, { deg: 33.05, r: 342, h: 18 }, { deg: 38, r: 345, h: 18 },
        { deg: 45, r: 350, h: 18 },
      ],
      foulScale: 1,
      backstop: 60,
      // t: 0 right-field pole, 0.5 behind home, 1 left-field pole.  Left side: narrow lower bowl, short upper deck set
      // well back (big rise = the sky gap of photo 5); right side deeper (roof 150 ft out on the sheet); behind home deepest.
      lower: { depth: [[0, 58], [0.25, 60], [0.5, 62], [0.75, 56], [1, 52]], slope: 0.4, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: [[0, 12], [0.5, 18], [1, 12]],
        rise: [[0, 26], [0.3, 24], [0.5, 24], [0.7, 30], [1, 38]],
        depth: [[0, 66], [0.25, 68], [0.5, 71], [0.75, 52], [1, 45]],
        slope: 0.6, extent: [0.02, 0.98],
      },
      outfield: {
        depth: 90, slope: 0.5,
        spans: [[-45, -22, 95, 0.5], [8, 33, 100, 0.55], [33, 45, 80, 0.5]],
        eye: [-2, 8], eyeHeight: 17, eyeDepth: 14,            // low hedge band with a lawn behind (photo 4/7), not a tall wall
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f5a46', facade: '#cdbd98', wall: '#2f4a3a', cream: '#e3d8b8' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views } = ctx;
    const { sweepSolid } = tools;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const DA = dims.deckAt;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const add1 = (geo, mat) => { geo.clearGroups(); return ctx.add(geo, mat); };      // single material: one draw call
    const inst = (geo, mat, mats) => {
      geo.clearGroups();
      const m = new THREE.InstancedMesh(geo, mat, Math.max(1, mats.length)); m.count = mats.length;
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const beam = (a, b, th) => {                       // thin box between two points
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    // local frame of a structure: lx along its face (right), lz toward the field (face normal), world = c + lx*(cos,-sin) + lz*(sin,cos)
    const frameOf = (cx, cz, ry) => (lx, y, lz) => [cx + lx * Math.cos(ry) + lz * Math.sin(ry), y, cz - lx * Math.sin(ry) + lz * Math.cos(ry)];
    const { hTop } = dims;
    const sandstone = '#cdbd98', cream = '#e3d8b8', green = '#2f4a3a', steel = '#4a5055', teal = '#3f5b50', dkSteel = '#3d4a44';

    // ---------- measured outer outline of the roof / facade, from the right-field roof end round home plate to the left end
    const OUT = [
      [364, -358], [391, -337], [414, -324], [425, -301], [426, -269], [425, -246], [420, -215], [414, -183], [400, -151],
      [382, -124], [364, -101], [348, -74], [336, -51], [318, -28], [303, 0], [268, 45], [250, 72], [223, 95], [205, 120],
      [186, 140], [164, 170], [136, 188], [109, 208], [68, 217], [23, 224], [-14, 217], [-41, 201], [-73, 181], [-100, 158],
      [-132, 122], [-159, 76], [-195, 31], [-248, -26], [-271, -56], [-292, -87], [-316, -117], [-336, -147], [-350, -178],
      [-359, -199], [-364, -247], [-370, -285], [-372, -299], [-359, -344], [-352, -370],
    ];
    const curve = new THREE.CatmullRomCurve3(OUT.map((p) => new THREE.Vector3(p[0], 0, p[1])), false, 'centripetal');
    const NF = low ? 90 : 150;
    const fp = curve.getSpacedPoints(NF).map((p) => [p.x, p.z]);
    const cen = [0, -140];
    const fn = fp.map((p, i) => {
      const a = fp[Math.max(0, i - 1)], b = fp[Math.min(fp.length - 1, i + 1)];
      let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      if (nx * (p[0] - cen[0]) + nz * (p[1] - cen[1]) < 0) { nx = -nx; nz = -nz; }
      return [nx, nz];
    });
    // thickness of the solid behind the facade so that it meets the seating, and the local deck height, from the nearest bowl point
    const bP = paths.bPts, wP = paths.wallPts, wD = 4 + 100;
    const near = fp.map((p) => {
      let dB = 1e9, gi = 0, dW = 1e9;
      for (let k = 0; k < bP.length; k++) { const d = Math.hypot(p[0] - bP[k][0], p[1] - bP[k][1]); if (d < dB) { dB = d; gi = k; } }
      for (const q of wP) dW = Math.min(dW, Math.hypot(p[0] - q[0], p[1] - q[1]));
      return { dB, dW, gi };
    });
    const thick = near.map(({ dB, dW, gi }) => Math.max(3, Math.min(95, dW < dB ? dW - wD : dB - DA.dEnd(gi))));
    const rawH = near.map(({ gi }) => DA.hTop(gi) + 8);
    const FHs = rawH.map((_, i) => { let s = 0, c = 0; for (let k = -4; k <= 4; k++) { const j = i + k; if (j >= 0 && j < rawH.length) { s += rawH[j]; c++; } } return s / c; });
    const FHi = (i) => FHs[i];
    const MR = [...M, lam('#f1ecdd'), lam('#9a9382'), lam('#3f5b50'), basic('#222f2a')];   // 5 white roof, 6 concourse, 7 teal fascia, 8 ribbon board
    const N = fp.length;
    const step = low ? 3 : 2;

    // ---------- 1. Facade: green base, tan stucco lower wall, cream string course, teal upper band, cream cornice
    ctx.add(sweepSolid(fp, fn, (i) => {
      const t = thick[i], H = FHi(i), sl = Math.min(t, 30), Hl = t > 32 ? H - 12 : H, hs = H * 0.53;
      return [[-t, 0], [0, 0], [0, 8], [1, 8], [1, 9.4], [0, 9.4], [0, hs], [1.4, hs], [1.4, hs + 1.5], [0, hs + 1.5], [0, H - 5],
        [1.6, H - 5], [1.6, H - 2.5], [3, H - 2.5], [3, H], [-sl, H], [-sl, Hl], [-t, Hl]];
    }, [-1, MAT.WALL, MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.FACADE, MAT.CREAM, MAT.CREAM, MAT.CREAM, 7, 7, 7, MAT.CREAM, MAT.CREAM, 6, MAT.SHADE, 6, -1], MAT.FACADE), MR);
    {
      const win = [], pier = [];
      for (let i = 1; i < N - 1; i += step) {
        const x = fp[i][0] + fn[i][0] * 0.2, z = fp[i][1] + fn[i][1] * 0.2, ry = Math.atan2(fn[i][0], fn[i][1]), H = FHi(i), hs = H * 0.53;
        const rows = low ? [H * 0.3] : [H * 0.28, hs + (H - 5 - hs) * 0.5];
        for (const y of rows) win.push(mat4(x, y, z, 5.2, 8, 1, ry));
        if (i % (step * 2) === 1) pier.push(mat4(x, (hs + 1.5 + H - 5) / 2, z, 1.6, H - 6.5 - hs, 1.8, ry));
      }
      inst(new THREE.PlaneGeometry(1, 1), basic('#2f403c', { side: THREE.DoubleSide }), win);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#58766a'), pier);
    }

    // ---------- 2. Home Plate Gate (photos 1, 2): tan entry pavilion, plain name lettering, green curved canopy on four bat struts, red domes
    {
      const GX = 24;
      const blk = add1(new THREE.BoxGeometry(132, 56, 40), lam(sandstone)); blk.position.set(GX, 28, 220);
      const cap = add1(new THREE.BoxGeometry(137, 3, 45), lam(cream)); cap.position.set(GX, 57.5, 220);
      const course = add1(new THREE.BoxGeometry(133, 1.6, 41), lam(cream)); course.position.set(GX, 9, 220);
      // glazed entry (dark glass, mullions) and a taller recess frame
      const glass = add1(new THREE.PlaneGeometry(74, 25), basic('#2c3a3a', { side: THREE.DoubleSide })); glass.position.set(GX, 15.5, 240.3);
      const mul = [];
      for (let k = -4; k <= 4; k++) mul.push(mat4(GX + k * 9.25, 15.5, 240.6, 1.2, 25, 0.8));
      mul.push(mat4(GX, 28.4, 240.6, 76, 1.4, 1.2), mat4(GX, 2.6, 240.6, 76, 1.4, 1.2), mat4(GX - 38, 15.5, 240.6, 1.6, 26, 1.2), mat4(GX + 38, 15.5, 240.6, 1.6, 26, 1.2));
      inst(new THREE.BoxGeometry(1, 1, 1), lam(cream), mul);
      // side wings: two plain tan wall bays with dark window rows
      for (const s of [-1, 1]) {
        const wing = add1(new THREE.PlaneGeometry(22, 18), basic('#2f403c', { side: THREE.DoubleSide })); wing.position.set(GX + s * 52, 30, 240.3);
      }
      // plain lettering of the park name on the wall above the canopy (muted red on tan; no other mark)
      const tex = tools.textTexture((g, w, h) => {
        g.fillStyle = sandstone; g.fillRect(0, 0, w, h); g.fillStyle = '#8a3a30'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = 'bold 112px Georgia, serif'; g.fillText('ANGEL STADIUM', w / 2, h / 2 + 8);
      }, 1024, 160);
      const sign = add1(new THREE.PlaneGeometry(118, 18), basic('#ffffff', { map: tex })); sign.position.set(GX, 46, 240.4);
      // curved cantilevered canopy: dark green top, 3 ft deep fascia, measured trapezoid plan with a curved front edge
      const sh = new THREE.Shape();
      sh.moveTo(-61, -238); sh.lineTo(109, -238); sh.lineTo(145, -286); sh.quadraticCurveTo(24, -314, -82, -286); sh.lineTo(-61, -238);
      const can = add1(new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: false }).rotateX(-Math.PI / 2), lam('#385248')); can.position.y = 28;
      // four wooden bat struts (barrel up) standing on stone ball footings
      const bats = [], balls = [];
      for (const [lx, tx] of [[-20, -36], [-7, -13], [7, 13], [20, 36]]) {
        bats.push(beam([GX + lx, 9, 289], [GX + tx, 28, 294], 4));
        balls.push(mat4(GX + lx, 6, 289, 3.4, 3.4, 3.4));
      }
      inst(new THREE.CylinderGeometry(0.65, 0.25, 1, 8), lam('#b99a68'), bats);
      inst(new THREE.SphereGeometry(1, 10, 8), lam('#d9d0bd'), balls);
      // two red wire-dome canopies on columns, one each side of the plaza (position in plan estimated)
      const domes = [], cols = [];
      for (const [dx, dz] of [[-135, 212], [190, 212]]) {
        domes.push(mat4(dx, 28, dz, 46, 36, 46));
        for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; cols.push(beam([dx + Math.cos(a) * 40, 0, dz + Math.sin(a) * 40], [dx + Math.cos(a) * 40, 29, dz + Math.sin(a) * 40], 2.2)); }
      }
      inst(new THREE.SphereGeometry(1, low ? 12 : 20, low ? 5 : 8, 0, Math.PI * 2, 0, Math.PI / 2), lam('#94453f'), domes);
      inst(new THREE.BoxGeometry(1, 1, 1), lam(steel), cols);
    }
    // outfield pavilion backs: low walls behind the seats, left and right
    for (const [a, b, dd] of [[-45, -22, 4 + 95 + 6], [8, 33, 4 + 100 + 6], [33, 45, 4 + 80 + 6]]) {
      const [p, n] = tools.span(a, b);
      ctx.add(sweepSolid(p, n, () => [[dd, 0], [dd, 36], [dd + 2, 36], [dd + 2, 0]], [MAT.FACADE, MAT.CREAM, MAT.FACADE, -1], MAT.FACADE), M);
    }

    // ---------- 3. Thin view-level roof along the measured outline: ribbon, raker braces, columns, light banks on top
    const Wf = thick.map((t) => 36 + 0.25 * Math.min(60, t));              // roof ribbon width: ~36 on the lines, ~50 behind home
    const yIn = (i) => FHi(i) + 3, yOut = (i) => FHi(i) + 8;
    ctx.add(sweepSolid(fp, fn, (i) => [[-Wf[i], yIn(i)], [-Wf[i], yIn(i) + 3], [2, yOut(i) + 3], [2, yOut(i) - 0.5]],
      [MAT.SHADE, 5, 5, MAT.SHADE], 5), MR);
    {
      const steelB = [], lamps = [], frames = [], ribs = [];
      for (let i = 0; i < N; i += step) {
        const n = fn[i], ry = Math.atan2(n[0], n[1]), W = Wf[i], FH = FHi(i);
        const P = (o, y) => [fp[i][0] + n[0] * o, y, fp[i][1] + n[1] * o];
        if (i % (step * 3) === 0) {
          steelB.push(beam(P(-2, FH), P(-2, yOut(i) - 0.5), 1.8));                // column on the facade
          steelB.push(beam(P(-2, FH + 2), P(-W + 6, yIn(i) - 0.5), 1.1));           // raker brace
          steelB.push(beam(P(-W + 2, yIn(i) - 0.5), P(-4, yOut(i) - 0.8), 1.2));       // girder
        }
        if (i % step === 0) ribs.push(mat4(...P(-W / 2, yIn(i) + 4.2), 0.8, 0.5, W, ry));
        // light bank standing on the roof edge (photo 6: spaced banks on top of the roof, not a continuous frieze)
        if (i % (low ? 12 : 8) === 4) {
          const q = P(-W * 0.45, yOut(i) + 11), q2 = P(-W * 0.45 - 1.4, yOut(i) + 11);
          frames.push(mat4(q[0], q[1], q[2], 26, 9, 2, ry));
          lamps.push(mat4(q2[0], q2[1], q2[2], 24, 7.4, 0.8, ry));
          steelB.push(beam(P(-W * 0.45 - 7, yOut(i) + 2), P(-W * 0.45 - 7, yOut(i) + 7), 1.4), beam(P(-W * 0.45 + 7, yOut(i) + 2), P(-W * 0.45 + 7, yOut(i) + 7), 1.4));
        }
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam(steel), steelB);
      inst(new THREE.BoxGeometry(1, 1, 1), basic('#fff0c0'), lamps);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#3c4246'), frames);
      if (!low) inst(new THREE.BoxGeometry(1, 1, 1), lam('#bdb49a'), ribs);
    }
    // thin ribbon board along the upper-deck fascia on both lines (blank dark strip, 3 ft tall)
    for (const [t0, t1] of [[0.06, 0.4], [0.6, 0.94]]) {
      const [p, n, a] = tools.cut(t0, t1);
      ctx.add(sweepSolid(p, n, (i) => { const g = a + i, d = DA.d0(g) - 0.8, h = DA.h0(g); return [[d, h - 6.4], [d, h - 3.2], [d + 0.6, h - 3.2], [d + 0.6, h - 6.4]]; }, [8, 8, 8, -1], 8), MR);
    }

    // ---------- 4. Scoreboards and video boards (faces blank: dark panel with a faint line grid)
    const gridTex = tools.textTexture((g, w, h) => {
      g.fillStyle = '#1b2723'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(130,160,150,0.20)'; g.lineWidth = 1;
      for (let x = 0; x <= w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y <= h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, 512, 128);
    const lampTex = tools.textTexture((g, w, h) => {
      g.fillStyle = '#4a4f4a'; g.fillRect(0, 0, w, h);
      for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) { g.fillStyle = '#fff0c0'; g.beginPath(); g.arc(12 + c * ((w - 24) / 13), 10 + r * ((h - 20) / 5), 6, 0, 7); g.fill(); }
    }, 256, 128);
    const gridMat = basic('#ffffff', { map: gridTex, side: THREE.DoubleSide });
    const lampMat = basic('#ffffff', { map: lampTex, side: THREE.DoubleSide });
    // a lattice light tower: four tapered legs, level rings, zigzag faces; returns beams (low: coarser)
    const towerBeams = (L, H, w0, d0, w1, d1) => {
      const out = [], lv = low ? 6 : Math.round(H / 12);
      const C = (k, sx, sz) => { const f = k / lv, w = w0 + (w1 - w0) * f, d = d0 + (d1 - d0) * f; return L(sx * w / 2, H * f, sz * d / 2 - 9); };
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) out.push(beam(C(0, sx, sz), C(lv, sx, sz), low ? 1.8 : 1.4));
      for (let k = 0; k <= lv; k++) {
        out.push(beam(C(k, -1, -1), C(k, 1, -1), 0.9), beam(C(k, 1, -1), C(k, 1, 1), 0.9), beam(C(k, 1, 1), C(k, -1, 1), 0.9), beam(C(k, -1, 1), C(k, -1, -1), 0.9));
        if (k < lv && !low) {
          const s = k % 2 ? -1 : 1;
          out.push(beam(C(k, -s, -1), C(k + 1, s, -1), 0.7), beam(C(k, -s, 1), C(k + 1, s, 1), 0.7), beam(C(k, -1, -s), C(k + 1, -1, s), 0.7), beam(C(k, 1, -s), C(k + 1, 1, s), 0.7));
        }
      }
      return out;
    };
    const frameBoxes = [], steelBoxes = [], bankFrames = [], bankFaces = [];
    // board with its structure: panels = [{ lx, w }], height h, bottom y0, local frame L; back truss on dark-green steel
    const board = (L, ry, panels, h, y0, towerAt) => {
      const x0 = Math.min(...panels.map((p) => p.lx - p.w / 2)), x1 = Math.max(...panels.map((p) => p.lx + p.w / 2)), Wt = x1 - x0, xc = (x0 + x1) / 2;
      const yT = y0 + h;
      for (const p of panels) {
        const c = L(p.lx, y0 + h / 2, 2.8);
        const face = ctx.add(new THREE.PlaneGeometry(p.w - 3, h - 3), gridMat); face.geometry.clearGroups(); face.position.set(...c); face.rotation.y = ry;
        // frame: four bars and a 5 ft deep box behind the face
        frameBoxes.push(mat4(...L(p.lx, y0 + 0.9, 1.4), p.w, 2.2, 5, ry), mat4(...L(p.lx, yT - 0.9, 1.4), p.w, 2.2, 5, ry),
          mat4(...L(p.lx - p.w / 2 + 0.9, y0 + h / 2, 1.4), 2.2, h, 5, ry), mat4(...L(p.lx + p.w / 2 - 0.9, y0 + h / 2, 1.4), 2.2, h, 5, ry));
        const back = L(p.lx, y0 + h / 2, -2.6); steelBoxes.push(mat4(...back, p.w - 1, h - 1, 4.4, ry));
      }
      // back structure: columns (front and rear legs), ties, chords, X braces, catwalk with a rail
      const nc = Math.max(2, Math.round(Wt / 32) + 1), xs = []; for (let k = 0; k < nc; k++) xs.push(x0 + 3 + ((Wt - 6) * k) / (nc - 1));
      xs.forEach((lx) => {
        steelBoxes.push(beam(L(lx, 0, -5.5), L(lx, yT + 3, -5.5), 2.2), beam(L(lx, 0, -16), L(lx, yT + 3, -16), 2.2));
        for (const y of [y0 - 6, y0 + h / 2, yT + 2.5]) steelBoxes.push(beam(L(lx, y, -5.5), L(lx, y, -16), 1.1));
        if (!low) steelBoxes.push(beam(L(lx, y0 - 6, -16), L(lx, y0 * 0.5, -5.5), 0.9));
      });
      for (let k = 0; k < nc - 1; k++) {
        for (const lz of [-5.5, -16]) for (const y of [y0 - 6, yT + 2.5]) steelBoxes.push(beam(L(xs[k], y, lz), L(xs[k + 1], y, lz), 1.2));
        const up = k % 2 === 0;
        steelBoxes.push(beam(L(xs[k], up ? y0 - 6 : yT + 2.5, -16), L(xs[k + 1], up ? yT + 2.5 : y0 - 6, -16), 1));
        if (!low) {
          steelBoxes.push(beam(L(xs[k], 0, -16), L(xs[k + 1], y0 - 6, -16), 1), beam(L(xs[k + 1], 0, -16), L(xs[k], y0 - 6, -16), 1));
          steelBoxes.push(beam(L(xs[k], y0 - 6, -5.5), L(xs[k + 1], yT + 2.5, -5.5), 0.9));
        }
      }
      steelBoxes.push(mat4(...L(xc, y0 - 6.2, -1.2), Wt + 6, 0.7, 8, ry), mat4(...L(xc, y0 - 2.6, 2.2), Wt + 6, 0.5, 0.5, ry));     // catwalk and its rail
      for (let k = 0; k < nc; k++) steelBoxes.push(beam(L(xs[k], y0 - 6, 2.2), L(xs[k], y0 - 2.6, 2.2), 0.5));
      if (towerAt !== undefined) steelBoxes.push(...towerBeams((a, b, c) => L(towerAt + a, b, c), yT + 22, 14, 8, 11, 6));
    };

    // main video board over the right-center pavilion: 182 x 52 ft (9,500 sq ft), bottom 70 ft, lamp tower behind its centre-left
    {
      const A = [141, -500], B = [302, -406], cx = (A[0] + B[0]) / 2, cz = (A[1] + B[1]) / 2, ry = Math.atan2(-(B[1] - A[1]), B[0] - A[0]);
      const L = frameOf(cx, cz, ry), bw = 182, bh = 52, y0 = 70;
      board(L, ry, [{ lx: 0, w: bw }], bh, y0, -2);
      const bankY = y0 + bh + 22 + 18;                     // lamp bank 56 x 36, centred 40 ft above the board top
      bankFrames.push(mat4(...L(-2, bankY, -9), 58, 38, 3.4, ry));
      const f = ctx.add(new THREE.PlaneGeometry(54, 34), lampMat); f.geometry.clearGroups(); f.position.set(...L(-2, bankY, -7.1)); f.rotation.y = ry;
    }
    // left-center board: main panel 86 + narrow side panel 26 ft, 48 ft high, bottom 62 ft; its lamp tower stands to the left of it
    {
      const c = [-268, -472], ry = Math.atan2(-c[0], -c[1]), L = frameOf(c[0], c[1], ry);
      board(L, ry, [{ lx: -14, w: 86 }, { lx: 44, w: 26 }], 48, 62, undefined);
      // lattice tower with a lamp bank near the left-field pole side (footing from the sheet at about (-335,-410))
      const t0 = [-335, -410], rt = Math.atan2(-t0[0], -t0[1]), LT = frameOf(t0[0], t0[1], rt), H = 146;
      steelBoxes.push(...towerBeams(LT, H, 13, 9, 11, 7));
      bankFrames.push(mat4(...LT(0, H + 17, -9), 48, 32, 3.4, rt));
      const f = ctx.add(new THREE.PlaneGeometry(45, 29), lampMat); f.geometry.clearGroups(); f.position.set(...LT(0, H + 17, -7.1)); f.rotation.y = rt;
    }
    inst(new THREE.BoxGeometry(1, 1, 1), lam('#3d4a44'), frameBoxes);
    inst(new THREE.BoxGeometry(1, 1, 1), lam('#46564f'), steelBoxes);
    inst(new THREE.BoxGeometry(1, 1, 1), lam('#4b4f4b'), bankFrames);
    // out-of-town board in the 19 ft right-center wall (blank panel, flat on the wall face)
    {
      const q = ctx.tools.wallAt(18, -0.6, 10), ry = Math.atan2(-q.x, -q.z);
      const bd = add1(new THREE.PlaneGeometry(34, 12), gridMat); bd.position.copy(q); bd.rotation.y = ry;
    }
    // flagpoles on the left-field pavilion top (photo 6)
    {
      const fl = [];
      for (const [deg, out] of [[-37, 94], [-34.5, 96], [-32, 98]]) { const q = tools.wallAt(deg, out, 0); fl.push(mat4(q.x, 55 + 17, q.z, 0.45, 34, 0.45)); }
      inst(new THREE.CylinderGeometry(1, 1, 1, 6), lam('#cfc9b8'), fl);
    }

    // ---------- 5. Signature features, at measured places
    // California Spectacular rock pile (measured footprint, about 60 ft high: photo 4) with trees and a waterfall
    {
      const poly = [[-135, -505], [-100, -512], [-82, -480], [-62, -445], [-58, -412], [-85, -388], [-112, -380], [-120, -420], [-142, -455], [-138, -490]];
      const inside = (x, z) => tools.insidePoly(poly, x, z);
      const rocks = [], trees = [];
      const nR = low ? 18 : 40, nT = low ? 6 : 12;
      let tries = 0;
      while (rocks.length < nR && tries++ < 4000) {
        const x = -145 + rnd() * 95, z = -515 + rnd() * 140;
        if (!inside(x, z)) continue;
        const back = (-380 - z) / 135, top = 16 + back * 40 + rnd() * 10, s = 12 + rnd() * 12;
        rocks.push(mat4(x, top * 0.35, z, s, top * 0.65, s * 0.9, rnd() * 3));
      }
      tries = 0;
      while (trees.length < nT && tries++ < 4000) {
        const x = -145 + rnd() * 95, z = -515 + rnd() * 140;
        if (!inside(x, z)) continue;
        const back = (-380 - z) / 135, hgt = 18 + back * 36;
        trees.push(mat4(x, hgt + 6, z, 7, 14, 7));
      }
      inst(new THREE.IcosahedronGeometry(1, 0), lam('#9a8a6a'), rocks);
      inst(new THREE.ConeGeometry(1, 1, 7), lam('#3f5e3f'), trees);
      const fall = add1(new THREE.PlaneGeometry(9, 40), lam('#8fb4c0')); fall.position.set(-118, 26, -468); fall.lookAt(40, 26, 100);
      const pool = add1(new THREE.CylinderGeometry(15, 15, 0.8, 16), lam('#8fb4c0')); pool.position.set(-102, 1, -420);
    }
    // batter's-eye lawn (flat dark green patch behind center and right-center) and bullpen clay patches
    {
      const lawn = add1(new THREE.ShapeGeometry(new THREE.Shape([[-18, -402], [-18, -500], [40, -502], [88, -470], [88, -380]].map(([x, z]) => new THREE.Vector2(x, z)))).rotateX(Math.PI / 2), lam('#355a38'));
      lawn.position.y = 0.2;
      for (const [x, z, w, d, ry, c] of [[296, -472, 68, 50, 0.5, '#b0623e'], [316, -528, 30, 40, 0.5, '#c79a78'], [-176, -370, 36, 30, 0.6, '#b0623e'], [-218, -323, 40, 36, 0.6, '#c79a78']]) {
        const cp = add1(new THREE.BoxGeometry(w, 0.5, d), lam(c)); cp.position.set(x, 0.25, z); cp.rotation.y = ry;
      }
    }
    // Big A: 230 ft A-frame in a parking lot (plain steel A, no halo, no lettering); not on the sheet, so the position is a guess
    {
      const bx = 620, bz = -330, H = 230, ry = Math.atan2(-bx, -bz);
      const legs = [], local = (lx, y, lz = 0) => [bx + lx * Math.cos(ry) + lz * Math.sin(ry), y, bz - lx * Math.sin(ry) + lz * Math.cos(ry)];
      for (const lz of [-5, 5]) {
        for (const s of [-1, 1]) legs.push(beam(local(s * 38, 0, lz), local(s * 2, H, lz), 4.4));
        legs.push(beam(local(-19, H * 0.42, lz), local(19, H * 0.42, lz), 3));
      }
      legs.push(beam(local(0, H, -5), local(0, H + 18, -5), 2.4), beam(local(0, H, 5), local(0, H + 18, 5), 2.4), beam(local(0, H * 0.7, -5), local(0, H * 0.7, 5), 2));
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#b9b4a4'), legs);
    }

    // ---------- 6. Remove generic parts that conflict
    ctx.remove(parts.lights);
    // batter's eye: low hedge band 9 ft above the wall with a lawn behind (photo 4/7), instead of the generic tall block
    if (parts.batterEye) {
      ctx.remove(parts.batterEye);
      const [p, n, dg] = tools.span(-2, 8);
      ctx.add(sweepSolid(p, n, (i) => { const h = tools.wallH(ctx.spec, dg[i]) + 9; return [[1.2, 0], [1.2, h], [11, h], [11, 0]]; }, [MAT.WALL, MAT.WALL, MAT.WALL, -1], MAT.WALL), M);
    }

    // ---------- 7. Views
    const gate = tools.foulAt(0.5, 330, 14), gateLook = tools.foulAt(0.5, 200, 30);
    views.gate = { pos: [gate.x + 110, 11, gate.z + 40], look: [gateLook.x + 14, 36, gateLook.z], label: 'Home Gate' };
    const rv = tools.foulAt(0.7, dims.dEnd - 8, hTop + 30), rl = tools.foulAt(0.3, dims.dEnd - 24, hTop + 14);
    views.roof = { pos: [rv.x, rv.y, rv.z], look: [rl.x, rl.y, rl.z], label: 'Roof' };
    const bv = tools.foulAt(0.5, dims.dEnd + 12, hTop + 28);
    views.rocks = { pos: [bv.x, bv.y, bv.z], look: [20, 64, -420], label: 'Boards & Rocks' };
  },
};
