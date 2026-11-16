// Detail module: Nationals Park, Washington (opened 2008). Units: feet.
// FITTED TO THE SATELLITE SHEET (survey.png, home plate at the origin, 1.1 px/ft; home (711,703) and second base (774,577) in the mosaic).
// MEASURED FROM THE SHEET:
//  - Outfield wall (r at deg): LF pole 337 @ -45, corner 342 @ -41, 359 @ -34, 377 plateau from -28 to -18 (matches the posted left-center 377),
//    384 @ -12, 397 @ -5, 402 @ 0 (the apex is a blunt point), 390 @ 7, right plateau about 372 from 15 to 32 (sheet 381, pulled to the posted
//    370), 360 @ 34, 355 @ 38, 340 @ 43, RF pole 335 @ 45. Backstop 38 ft; foul territory about 40 ft wide (foulScale .85).
//  - Outer facade / roof edge ring (24 stations, right slab top -> behind home z=185 -> left slab end), corrected for the lean of the oblique
//    image by (-22, +11) ft. Ring is symmetric about x=0 after the correction (x -320 / +316 at z 0). Roof band width 48 ft behind home, 32 ft
//    on the sides; the two long straight slabs at the ends (right slab from (321,-345) to (191,-591); left slab from (-334,-45) to (-480,-321))
//    are about 36 ft wide at roof level.
//  - Seating depth from the front edge to the facade: about 147 ft behind home and 195-205 ft on the diagonals, so the bowl is deep on the
//    sides. Generic decks fill the first 134 ft; a flat open-air concourse terrace (built here) fills the rest up to the facade.
//  - Batter's eye: a planted wedge, vertices (-18,-486) (50,-446) (0,-406) (-19,-405). Raked red seat wedge left of it (-14 to -2.5 deg, 62 ft deep).
//    Round white-roofed drum behind left-center at (-98,-491), radius 33. Right-center scoreboard centre about (150,-476).
//    Gray gate block outside the first-base facade (axis (280,107), 170 x 28 ft). Low white entrance roofs behind home and on both diagonals.
//    Red terrace at the left-field corner beside the slab.
// FROM TEXT SOURCES: posted distances 337/377/402/370/335, wall heights 10.75 ft (left to center) and 16.75 ft (right), 41/11/22 seat rows,
//  precast granite-look panels with large glass panes, canopy over the upper concourse, steel framing.
// LEVEL 4 (photographs /home/claude/refs/WSH/photo1-8, PHOTOS.md):
//  A FACADE (photo 1, 2, 3, 5, 7): 3 glass storeys between a stone base and a slate-gray metal panel band, an open top storey of white
//   columns under a flat roof band, plain ballpark-name text on the band, a white roof arch over the home entrance, entrance bays with small
//   canopies, red gate canopies (photo 2, 3), roof lamp banks in a row of separate banks (photo 5, 6, about one per 45 ft) instead of a strip.
//  B HEIGHTS (method): stone base 18 ft = door about 8 ft x 2.2 (photo 1, same plane); glass 18-60 = 3 bands x 14 ft storey (photo 1 transoms,
//   storey 13-16 ft); panel band 60-78 (photo 1, lettering about 7.5 ft); open top storey 78 to roof 96 behind home / 88 at the sides (photo 1, 5);
//   outfield wall 10.75 / 16.75 ft (config); main video board face 104 x 46 ft: whole board structure 170 ft long on the sheet = 800 px in
//   photo 7, so 4.7 px/ft, face 490 x 215 px; board face bottom about 72 ft above the field from the photo 4 and 7 perspective (camera height 10 ft,
//   wall 16.75 ft at 374 ft as the scale, +-15 ft); lamp frame 36 ft above the face top (photo 7); batter's eye top about 40 ft (photo 4, wall 10.75 ft).
//   Shadow method: tried on the sheet (drum, trees, slabs); the sheet is oblique (walls lean 20-30 ft) and shadows fall on trees, street
//   and stands, so no shadow height was used.
//  C SEATING (sheet, unrolled along the foul boundary): visible seats end 80-85 ft from the front edge on both sides, 125 ft behind home;
//   a light flat terrace (concourse roof) fills the rest up to the roof band. Lower and upper decks are split by the depth tables in config.
//  D BOARDS (photo 4, 7): main face 104 x 46, left pair of panels 25 ft wide, right pair 38 ft wide, name strip above the face, lattice frame
//   with a lamp bank above the left panels, lattice mast and flagpole on the right, catwalk with rail under the face, 4 lattice legs.
//   Orientation from the sheet: the structure runs from (90,-506) to (240,-426), 28 deg from the x axis.
// STILL ESTIMATED: deck heights (lower top about 31 ft, upper front 46-52, upper back 60-83: row rises 1.0 and 2 ft assumed, not counted), the
//  split of the seat depth between lower and upper deck, where the right wall steps up (+17 deg), roof truss spacing, the roof arch size, bay
//  positions of entrances, scoreboard face bottom (72 ft, +-15), lamp-bank count at the sides, drum 34 ft, pavilions 28-40, the gate canopy
//  positions and sizes (red patches on the sheet), left-field red canopy name, outfield rear concourse (not built), seat colours.
const D2R = Math.PI / 180;
const UT = [0.05, 0.95];                 // upper-deck extent along the foul line (t)
const BASE_H = 18, GLASS_H = 60, BAND_H = 78;   // stone base, glass wall top, metal band top (photo 1)
const ROOF_HOME = 96, ROOF_SIDE = 88;           // roof band height behind home / at the sides
const LEAN = [-22, 11];                  // lean correction applied to measured roof-edge points
// Roof edge ring, measured (right slab top -> behind home -> left slab end), before the lean correction. [x, z]
const RING_M = [[213, -602], [343, -356], [372, -310], [390, -250], [396, -190], [393, -127], [379, -82], [349, -36], [338, -6], [319, 28],
  [288, 59], [251, 108], [194, 146], [140, 164], [88, 172], [0, 174], [-88, 172], [-115, 170], [-165, 142], [-225, 82], [-271, 21],
  [-293, -17], [-312, -57], [-458, -332]];

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 337, h: 10.75 }, { deg: -41, r: 342, h: 10.75 }, { deg: -34, r: 359, h: 10.75 }, { deg: -28, r: 377, h: 10.75 },
        { deg: -18, r: 377, h: 10.75 }, { deg: -12, r: 384, h: 10.75 }, { deg: -5, r: 397, h: 10.75 }, { deg: 0, r: 402, h: 10.75 },
        { deg: 7, r: 392, h: 10.75 }, { deg: 15, r: 376, h: 10.75 }, { deg: 17, r: 374, h: 10.75 }, { deg: 17.05, r: 374, h: 16.75 },
        { deg: 32, r: 370, h: 16.75 }, { deg: 35, r: 361, h: 16.75 }, { deg: 38, r: 354, h: 16.75 }, { deg: 43, r: 340, h: 16.75 },
        { deg: 45, r: 335, h: 16.75 },
      ],
      foulScale: 0.85,
      backstop: 38,
      // t: 0 = right-field pole, .5 = behind home, 1 = left-field pole. Visible seats end 125 ft out behind home and about 82 ft on the sides.
      lower: { depth: [[0, 46], [0.08, 56], [0.22, 60], [0.36, 68], [0.45, 80], [0.5, 84], [0.55, 80], [0.64, 68], [0.78, 60], [0.92, 56], [1, 46]],
        slope: 0.36, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: [[0, 8], [0.1, 16], [0.3, 18], [0.5, 24], [0.7, 18], [0.9, 16], [1, 8]], rise: [[0, 14], [0.2, 18], [0.5, 26], [0.8, 18], [1, 14]],
        depth: [[0, 30], [0.1, 40], [0.3, 44], [0.4, 54], [0.5, 66], [0.6, 54], [0.7, 44], [0.9, 40], [1, 30]], slope: 0.55, extent: UT },
      outfield: { depth: 76, slope: 0.45, spans: [[-45, -14, 80, 0.45], [7, 45, 96, 0.42]], eye: null },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f3f63', facade: '#b4aea0', wall: '#26343f', cream: '#d9d3c1' },
    };
  },

  build(ctx) {
    const { THREE, G, parts, views, dims, paths, tools, spec } = ctx;
    const { sweepSolid, clamp, wallR, wallH } = tools;
    const { bPts, bN } = paths;
    const { dL, lowTop, d0, h0, dEnd, hTop, ofSlope } = dims;
    const low = ctx.lod === 'low';
    const N1 = bPts.length - 1;
    const lam = ctx.lam;
    const basic = (c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide });
    const lerp = (a, b, w) => a + (b - a) * w;
    const smooth = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

    // palette
    const mGran = lam('#b9b3a4'), mGranL = lam('#cbc5b6'), mSteel = lam('#4a5157'), mGlass = lam('#5b7c86'), mGlassD = lam('#3d5762');
    const mRoof = lam('#d3d5d1'), mUnder = lam('#6b7176'), mFasc = lam('#8d9498'), mTerr = lam('#b7ad98'), mWhite = lam('#dcdcd6');

    // ---- instancing helpers
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => { if (!mats.length) return null; const m = new THREE.InstancedMesh(geo, mat, mats.length); mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m; };
    const Y = new THREE.Vector3(0, 1, 0);
    const beam = (a, b, th) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5); tmp.quaternion.setFromUnitVectors(Y, dir.normalize()); tmp.scale.set(th, len, th); tmp.updateMatrix();
      const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    const steel = [], lampHouse = [], lampFace = [], granB = [], granLB = [], glassB = [], glassDB = [], whiteB = [], redB = [];

    // =====================================================================================================
    // RING: the measured facade / roof edge line, smoothed, with outward normals and arc samples
    // =====================================================================================================
    const ringPts = RING_M.map(([x, z]) => new THREE.Vector3(x + LEAN[0], 0, z + LEAN[1]));
    const ringCurve = new THREE.CatmullRomCurve3(ringPts, false, 'centripetal');
    const NR = 220;
    const RP = ringCurve.getSpacedPoints(NR).map((p) => [p.x, p.z]);
    const RN = tools.normalsFor(RP, [0, -170]);
    const ringPt = (i, d) => [RP[i][0] + RN[i][0] * d, RP[i][1] + RN[i][1] * d];
    const roofW = (i) => 32 + 16 * smooth(RP[i][1], 20, 150);           // roof band width: 48 ft behind home, 32 ft on the sides
    // arc samples every `step` feet: { x, z, nx, nz, ry, i }
    const sampleRing = (step, i0 = 0, i1 = NR) => {
      const out = []; let carry = 0;
      for (let i = i0; i < i1; i++) {
        const a = RP[i], b = RP[i + 1], seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
        let s = carry;
        while (s < seg) {
          const f = s / seg, nx = RN[i][0] * (1 - f) + RN[i + 1][0] * f, nz = RN[i][1] * (1 - f) + RN[i + 1][1] * f, l = Math.hypot(nx, nz);
          out.push({ x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, nx: nx / l, nz: nz / l, ry: Math.atan2(nx, nz), i });
          s += step;
        }
        carry = s - seg;
      }
      return out;
    };
    const loc = (fr, lx, lz) => [fr.x + lx * fr.nz + lz * fr.nx, fr.z - lx * fr.nx + lz * fr.nz];     // lx along the wall, lz outward
    const put = (list, fr, lx, y, lz, sx, sy, sz) => { const [x, z] = loc(fr, lx, lz); list.push(mat4(x, y, z, sx, sy, sz, fr.ry)); };
    // distance along (nx,nz) from p to the ring polyline
    const hitRing = (p, nx, nz) => {
      let best = 1e9;
      for (let i = 0; i < RP.length - 1; i++) {
        const a = RP[i], ex = RP[i + 1][0] - a[0], ez = RP[i + 1][1] - a[1], den = nx * ez - nz * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * nz - (a[1] - p[1]) * nx) / den;
        if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
      }
      return best;
    };

    // =====================================================================================================
    // 1. FACADE (photo 1): stone base with entrance bays, 3 glass storeys, slate metal band with the name, open top storey of columns
    // =====================================================================================================
    const roofH = (i) => lerp(ROOF_SIDE, ROOF_HOME, smooth(RP[i][1], 10, 160));
    const mBase = lam('#c2baa5'), mBand = lam('#7d858a'), mDark = lam('#2c3236'), mCol = lam('#d8d9d4'), mBack = lam('#555c61');
    const sweepR = (prof, edge, mats, cap = 0) => ctx.add(sweepSolid(RP, RN, prof, edge, cap), mats);
    sweepR(() => [[-3, BASE_H], [-3, GLASS_H], [0, GLASS_H], [0, BASE_H]], [-1, 1, 0, -1], [mGlass, mSteel], 1);              // glass wall, 3 storeys
    sweepR(() => [[-3.5, 0], [-3.5, BASE_H], [2.4, BASE_H], [2.4, 0]], [-1, 0, 0, -1], [mBase], 0);                           // stone base
    sweepR(() => [[-3, GLASS_H], [-3, BAND_H], [1.4, BAND_H], [1.4, GLASS_H]], [0, 0, 0, 0], [mBand], 0);                      // slate panel band
    sweepR(() => [[-3, BAND_H], [-3, BAND_H + 2], [3.4, BAND_H + 2], [3.4, BAND_H]], [0, 0, 0, 0], [mGran], 0);                // cornice
    for (const y of [32, 46]) sweepR(() => [[-3.2, y], [-3.2, y + 0.8], [0.4, y + 0.8], [0.4, y]], [0, 0, 0, 0], [mSteel], 0);   // storey transoms (14 ft)
    sweepR((i) => [[-12, BAND_H + 2], [-12, roofH(i) - 1], [-11, roofH(i) - 1], [-11, BAND_H + 2]], [0, 0, 0, 0], [mBack], 0); // dark back wall of the open storey
    const openB = [], canB = [], colB = [];
    sampleRing(24).forEach((s) => put(granB, s, 0, BASE_H / 2, 0.8, 3.4, BASE_H, 3.2));                                         // stone piers every 24 ft
    sampleRing(low ? 72 : 36).forEach((s) => { put(openB, s, 12, 5.5, 2.6, 14, 11, 0.6); put(canB, s, 12, 12.4, 5, 18, 0.8, 6); });   // entrance bays + canopies
    sampleRing(low ? 20 : 12).forEach((s) => put(glassDB, s, 0, 39, 0.3, 0.7, 40, 0.8));                                         // glass mullions
    sampleRing(low ? 32 : 24).forEach((s) => { const h = roofH(s.i); put(colB, s, 0, (BAND_H + 2 + h) / 2, 0.6, 1.8, h - BAND_H - 3, 1.8); });   // open storey columns
    {   // plain ballpark-name text on the metal band behind home
        const fr = (i) => ({ x: RP[i][0], z: RP[i][1], nx: RN[i][0], nz: RN[i][1], ry: Math.atan2(RN[i][0], RN[i][1]) });
        const tex = tools.textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#a2463c'; g.font = 'bold 150px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('N A T I O N A L S   P A R K', w / 2, h / 2 + 6); }, 2048, 220);
        const mTxt = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, alphaTest: 0.2 });
        const f0 = fr(Math.round(NR * 0.5)), [tx, tz] = loc(f0, 0, 1.6);
        const m = ctx.add(new THREE.PlaneGeometry(150, 12), mTxt); m.position.set(tx, 69, tz); m.rotation.y = f0.ry;
    }
    // white roof arch over the home entrance (photo 1)
    {
      const pts = [];
      for (let k = 0; k <= 12; k++) { const i = Math.round(NR * (0.38 + 0.24 * k / 12)), [x, z] = ringPt(i, -roofW(i)); pts.push(new THREE.Vector3(x, roofH(i) + 4 + 14 * Math.sin(Math.PI * k / 12), z)); }
      ctx.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), low ? 16 : 36, 1.1, 5), mCol);
    }

    // =====================================================================================================
    // 2. ROOF BAND over the outer concourse, with under-structure and separate lamp banks on the front edge
    // =====================================================================================================
    ctx.add(sweepSolid(RP, RN, (i) => { const W = roofW(i), H = roofH(i); return [[-W, H + 1], [-W, H + 4.5], [2.5, H + 3], [2.5, H]]; }, [0, 1, 0, 2], 0), [mFasc, mRoof, mUnder]);
    const nearB = (x, z) => { let b = 0, bd = 1e12; for (let k = 0; k < bPts.length; k++) { const d = (bPts[k][0] - x) ** 2 + (bPts[k][1] - z) ** 2; if (d < bd) { bd = d; b = k; } } return b; };
    sampleRing(low ? 52 : 26).forEach((s) => {
      const W = roofW(s.i), H = roofH(s.i), P3 = (d, y) => [s.x + s.nx * d, y, s.z + s.nz * d];
      const hb = dims.deckAt.hTop(nearB(s.x + s.nx * -W, s.z + s.nz * -W));
      steel.push(beam(P3(-W + 2, hb), P3(-W + 2, H), 1.6));                                  // column from the terrace to the roof front edge
      steel.push(beam(P3(-W + 1, H - 0.5), P3(-W / 2, H - 7), 1.0)); steel.push(beam(P3(-W / 2, H - 7), P3(0, H - 0.5), 1.0));   // truss
      if (!low) steel.push(beam(P3(-W + 2, hb + 14), P3(-W / 2, H - 7), 0.8));
    });
    // lamp banks (photo 5, 6): one bank about every 45 ft along the roof front edge, 32 ft wide, on two short posts
    sampleRing(low ? 90 : 45).filter((s) => s.z > -60).forEach((s) => {
      const W = roofW(s.i), H = roofH(s.i), [x, z] = [s.x - s.nx * (W + 0.6), s.z - s.nz * (W + 0.6)], y = H + 10;
      lampHouse.push(mat4(x, y, z, 32, 7, 1.8, s.ry));
      lampFace.push(mat4(x - s.nx * 1.0, y, z - s.nz * 1.0, 30.4, 5.6, 0.3, s.ry));
      for (const k of [-10, 10]) steel.push(beam([x + s.nz * k, H + 3, z - s.nx * k], [x + s.nz * k, y - 3, z - s.nx * k], 1.1));
    });

    // =====================================================================================================
    // 3. CONCOURSE TERRACE behind the generic decks (open air), flat at the deck top height
    // =====================================================================================================
    {
      const da = dims.deckAt, N = bPts.length - 1;
      const [uPts, uN, ua] = tools.cut(UT[0], UT[1]);
      const hit = uPts.map((p, i) => Math.max(da.dEnd(ua + i) + 0.5, hitRing(p, uN[i][0], uN[i][1]) - 3));
      ctx.add(sweepSolid(uPts, uN, (i) => [[da.dEnd(ua + i) - 0.5, 0], [da.dEnd(ua + i) - 0.5, da.hTop(ua + i)], [hit[i], da.hTop(ua + i)], [hit[i], 0]], [-1, 0, 1, -1], 0), [mTerr, mGran]);
      for (const [t0, t1] of [[0.0, UT[0]], [UT[1], 1.0]]) {
        const [p, n, a] = tools.cut(t0, t1);
        const hh = p.map((q, i) => Math.max(da.dL(a + i) + 0.5, hitRing(q, n[i][0], n[i][1]) - 3));
        ctx.add(sweepSolid(p, n, (i) => [[da.dL(a + i) - 0.5, 0], [da.dL(a + i) - 0.5, da.lowTop(a + i)], [hh[i], da.lowTop(a + i)], [hh[i], 0]], [-1, 0, 1, -1], 0), [mTerr, mGran]);
      }
      // press / suite glass band at the back of the upper deck behind home (photo 5)
      const [gp, gn, ga] = tools.cut(0.36, 0.64);
      ctx.add(sweepSolid(gp, gn, (i) => { const d = da.dEnd(ga + i), h = da.hTop(ga + i); return [[d, h], [d, h + 11], [d + 12, h + 11], [d + 12, h]]; }, [0, 1, 0, 2], 0), [mGlass, mSteel, mBack]);
      // ribbon boards: blank dark strips on the fronts of the upper deck (photo 5)
      const [rp, rn, ra] = tools.cut(0.07, 0.93), pos = [];
      for (let i = 0; i < rp.length; i++) { const d = da.d0(ra + i) - 0.4, h = da.h0(ra + i), x = rp[i][0] + rn[i][0] * d, z = rp[i][1] + rn[i][1] * d; pos.push(x, h - 5.5, z, x, h - 1.5, z); }
      const idx = []; for (let i = 0; i < rp.length - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setIndex(idx);
      ctx.add(rg, basic('#2b2f37'));
    }

    // =====================================================================================================
    // 4. ENTRANCE ROOFS, gate block, red terrace (all measured from the sheet; heights estimated)
    // =====================================================================================================
    {
      // low podium roof behind home (a ring offset 30 ft outward from the facade for the home arc)
      const hp = [], hn = [];
      for (let i = 0; i <= NR; i++) if (RP[i][1] > 60) { hp.push(ringPt(i, 5)); hn.push(RN[i]); }
      ctx.add(sweepSolid(hp, hn, () => [[0, 0], [0, 30], [24, 33], [24, 0]], [0, 1, 0, -1], 0), [mWhite, lam('#e3e3dd')]);
      // blocks [x, z, width, depth, height, rotation (rad)]
      const blocks = [[95, 258, 85, 30, 30, -0.33], [172, 238, 82, 36, 28, -0.45], [265, 192, 60, 28, 30, -0.61], [-160, 245, 60, 90, 40, 0.0], [-75, 252, 100, 62, 34, 0.0]];
      blocks.forEach(([x, z, w, d, h, r]) => whiteB.push(mat4(x, h / 2, z, w, h, d, r)));
      // gray gate block outside the first-base facade, axis from (365,38) to (240,155) before the lean correction
      const gx = 302 + LEAN[0], gz = 96 + LEAN[1], gy = Math.atan2(-125, 117);
      granLB.push(mat4(gx, 28, gz, 28, 56, 170, gy));
      glassDB.push(mat4(gx, 40, gz, 29, 4, 171, gy));
      // red gate canopies (photo 2, 3): navy-red roof on posts with a fascia band; the left-field one carries the park name
      const canopy = (cx, cz, w, d, h, ry, name) => {
        const gg = new THREE.Group(); gg.position.set(cx, 0, cz); gg.rotation.y = ry; G.add(gg);
        const mk = (geo, mat, x, y, z) => { const m = ctx.add(geo, mat, gg); m.position.set(x, y, z); return m; };
        const roof = mk(new THREE.BoxGeometry(w, 1.2, d), lam('#7d3b3b'), 0, h, 0); roof.geometry.clearGroups();
        mk(new THREE.BoxGeometry(w + 2, 5, 1.2), lam('#a2463c'), 0, h - 2.2, d / 2).geometry.clearGroups();
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(1.2, h, 1.2), mSteel, sx * (w / 2 - 1), h / 2, sz * (d / 2 - 1)).geometry.clearGroups();
        if (name) {
          const tex = tools.textTexture((g, ww, hh) => { g.clearRect(0, 0, ww, hh); g.fillStyle = '#e6dcc6'; g.font = 'bold 120px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(name, ww / 2, hh / 2 + 4); }, 1024, 128);
          const t = ctx.add(new THREE.PlaneGeometry(w - 4, 4), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, alphaTest: 0.2 }), gg); t.position.set(0, h - 2.2, d / 2 + 0.8);
        }
      };
      canopy(-322, -282, 62, 30, 14, -2.0, 'NATIONALS PARK');       // left-field red terrace of the sheet, as a canopy
      canopy(326, 20, 34, 22, 12, 1.37, null);                       // right-field gate (red patch on the sheet)
    }

    // =====================================================================================================
    // 5. BATTER'S EYE: planted wedge in dead center
    // =====================================================================================================
    {
      const eye = [[-18, -486, 46], [50, -446, 38], [0, -406, 16], [-19, -405, 16]];
      const pos = [], tri = (...v) => v.forEach((p) => pos.push(...p));
      const top = (k) => [eye[k][0], eye[k][2], eye[k][1]], bot = (k) => [eye[k][0], 0, eye[k][1]];
      tri(top(0), top(1), top(2)); tri(top(0), top(2), top(3));
      for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; tri(bot(k), bot(j), top(j)); tri(bot(k), top(j), top(k)); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
      ctx.add(geo, lam('#2d4631'));
    }

    // =====================================================================================================
    // 6. RAKED RED SEAT WEDGE left of the eye (generic seat rows, tinted)
    // =====================================================================================================
    {
      const [p, n, dg] = tools.span(-14, -2.5);
      const seatMat = ctx.M[ctx.MAT.SEAT].clone(); seatMat.color = new THREE.Color('#b86f62');
      const hw = (i) => wallH(spec, dg[i]);
      ctx.add(sweepSolid(p, n, (i) => [[1.2, 0], [1.2, hw(i) + 3], [4, hw(i) + 3], [66, hw(i) + 3 + 0.45 * 62], [66, 0]], [0, 2, 1, 3, -1], 3), [lam('#26343f'), seatMat, lam('#d9d3c1'), lam('#8a5a50')]);
    }

    // =====================================================================================================
    // 7. DRUM behind left-center (round white-roofed building)
    // =====================================================================================================
    {
      const cx = -98, cz = -491;
      const body = ctx.add(new THREE.CylinderGeometry(33, 34, 34, low ? 20 : 32), mGranL); body.position.set(cx, 17, cz);
      const roofc = ctx.add(new THREE.CylinderGeometry(31, 31, 1.2, low ? 20 : 32), lam('#ecece6')); roofc.position.set(cx, 34.6, cz);
      const rim = ctx.add(new THREE.CylinderGeometry(34.5, 34.5, 3, low ? 20 : 32), mSteel); rim.position.set(cx, 34, cz);
      const glassr = ctx.add(new THREE.CylinderGeometry(34.2, 34.2, 8, low ? 20 : 32, 1, true), mGlass); glassr.position.set(cx, 14, cz);
    }

    // =====================================================================================================
    // 8. SCOREBOARD in right-center (photo 4, 7; sheet): face 104 x 46, side panels, lamp frame, lattice legs, catwalk, flagpole
    // =====================================================================================================
    {
      const g = new THREE.Group(); g.position.set(165, 0, -466); g.rotation.y = -28 * D2R; G.add(g); g.updateMatrixWorld(true);   // local +z faces home, x runs along the board
      const W = (lx, y, lz) => new THREE.Vector3(lx, y, lz).applyMatrix4(g.matrixWorld).toArray();
      const box = (w, h, d, mat, x, y, z) => { const m = ctx.add(new THREE.BoxGeometry(w, h, d), mat, g); m.geometry.clearGroups(); m.position.set(x, y, z); return m; };
      const navy = basic('#1f2c3a'), face = basic('#262e32'), rust = basic('#8a3f38'), strip = basic('#7a3b34');
      const Y0 = 72, FW = 104, FHT = 46, XM = -7;                                   // main face bottom, width, height, centre x
      box(FW, FHT, 1.2, face, XM, Y0 + FHT / 2, 1.2);                                // main video face (blank)
      box(FW + 3, FHT + 3, 3, mSteel, XM, Y0 + FHT / 2, -0.4);                       // frame
      box(FW, 6, 1.4, strip, XM, Y0 + FHT + 3.5, 1.2);                               // name strip (plain, no text)
      box(25, 26.5, 1.2, navy, -72.5, 93.5 + 13.25, 1.2); box(25, 26.5, 1.2, rust, -72.5, 67 + 13.25, 1.2);        // left pair of panels
      box(38, 30, 1.2, navy, 66, 107 + 15, 1.2); box(38, 32, 1.2, rust, 66, 75 + 16, 1.2);                          // right pair of panels
      box(26.5, 54, 3, mSteel, -72.5, 67 + 27, -0.4); box(40, 64, 3, mSteel, 66, 75 + 31, -0.4);                   // panel backs
      box(FW + 4, 36, 8, mBack, XM, Y0 + 6, -5);                                     // back structure behind the face
      box(170, 30, 22, mGran, 0, 15, -16);                                           // concrete base
      // lamp frame over the left panels (photo 7): 74 x 22 ft, lamp face in front
      box(74, 22, 3, mSteel, -48, 143, 0); box(70, 17, 0.5, basic('#f2e8b6'), -48, 143, 1.8);
      for (const x of [-84, -12]) steel.push(beam(W(x, 120, -1), W(x, 132, -1), 1.4));
      // right lattice mast and truss frame over the right panels, flagpole beside
      const lat = (x0, x1, y0, y1, z) => {                                          // zig-zag lattice between two chords
        steel.push(beam(W(x0, y0, z), W(x0, y1, z), 1.0)); steel.push(beam(W(x1, y0, z), W(x1, y1, z), 1.0));
        const n = Math.max(2, Math.round((y1 - y0) / 7)); for (let k = 0; k < n; k++) { const ya = y0 + (y1 - y0) * k / n, yb = y0 + (y1 - y0) * (k + 1) / n; steel.push(beam(W(k % 2 ? x1 : x0, ya, z), W(k % 2 ? x0 : x1, yb, z), 0.6)); }
      };
      lat(48, 84, 138, 160, -1); steel.push(beam(W(48, 160, -1), W(84, 160, -1), 1.0));
      lat(84, 88, 72, 138, -1);
      // 4 lattice legs under the face
      for (const x of [-78, -38, 12, 58]) lat(x - 3, x + 3, 30, Y0 - 2, -6);
      steel.push(beam(W(-84, Y0 - 2, -6), W(64, Y0 - 2, -6), 1.4)); steel.push(beam(W(-84, 30, -6), W(64, 30, -6), 1.2));
      // catwalk along the face bottom with a rail
      box(FW, 0.8, 5, mSteel, XM, Y0 - 1, 3.5);
      G.add(tools.rail([0, 1].map((q) => { const p = W(XM - FW / 2 + FW * q, 0, 6); return [p[0], p[2]]; }), () => Y0 - 0.6, { height: 3.2, spacing: 12, lod: ctx.lod }));
      // flagpole right of the board
      const fp = W(96, 0, 0); const pole = ctx.add(new THREE.CylinderGeometry(0.35, 0.5, 100, 6), mWhite); pole.position.set(fp[0], Y0 + 50 - 2, fp[2]);
      views.board = { pos: [10, 86, 112], look: [165, 105, -466], label: 'Scoreboard' };
    }

    // ---- flush shared instanced meshes
    const ub = new THREE.BoxGeometry(1, 1, 1);
    inst(ub, mSteel, steel);
    inst(ub, mGran, granB);
    inst(ub, mGranL, granLB);
    inst(ub, mGlass, glassB);
    inst(ub, mGlassD, glassDB);
    inst(ub, mWhite, whiteB);
    inst(ub, mDark, openB);
    inst(ub, mWhite, canB);
    inst(ub, mCol, colB);
    inst(ub, lam('#a8574a'), redB);
    inst(ub, lam('#50585e'), lampHouse);
    inst(ub, basic('#f2e8b6'), lampFace);

    // ---- views
    const gi = Math.round(NR * 0.5), gfr = { x: RP[gi][0], z: RP[gi][1], nx: RN[gi][0], nz: RN[gi][1] };
    views.gate = { pos: [gfr.x + gfr.nx * 260 + gfr.nz * 100, 50, gfr.z + gfr.nz * 260 - gfr.nx * 100], look: [gfr.x, 50, gfr.z], label: 'Home Gate' };
    views.roof = { pos: [-330, hTop + 140, 60], look: [60, hTop + 10, 90], orbit: true, label: 'Canopy' };
    const sp = tools.foulAt(0.3, d0 + 10, h0 + 10);
    views.stands = { pos: [sp.x, sp.y, sp.z], look: [-40, 20, -150], label: 'Upper Stands' };
  },
};
