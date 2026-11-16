// Detail module: Citizens Bank Park, Philadelphia Phillies (opened 2004). Units: feet.
// Rework of the first (text-only) version, fitted to the satellite sheet (home plate at pixel 731,685, second base 748,553 of the mosaic).
// MEASURED FROM THE SHEET:
//  - Outfield wall: LF pole (-233,-233) r329, one straight chord to the LCF corner (-91,-378) r389 (the old 374 "power alley" corner is not
//    a corner on the sheet: the chord is r342-356 there), Monty's Angle (-91,-378) -> (-58,-381) -> (-33,-405), CF r402, RCF (91,-388) r398,
//    straight RF chord to the pole (233,-233) r330. Posted distances kept at the poles and CF.
//  - Facade (outer edge of the pale copper roof band): left leg x=-299 (z -168..-16), 45 deg diagonal to (-64,229), home side z=229,
//    diagonal (142,229) -> (362,-12), jog to (395,-48), right leg x=395 (z -48..-265), diagonal (395,-265) -> (251,-388). Band width 34 ft.
//    Facade offset from the seat edge: ~148 ft on the baselines, ~180 ft behind the plate.
//  - Decks: lower seats reach ~100 ft out from the seat edge, upper deck back ~136 ft; RF terrace is three tiers about 130 ft deep;
//    LF stand about 85 ft deep with a big roofed block behind it (-250,-318)..(-308,-368)..(-226,-497)..(-128,-430).
//  - Home-side pavilion row z 230-280 (x centres -102, -30, 28, 83, 153, 209), bullpen patch x 67-156 z -444..-394, Ashburn Alley promenade
//    z -405..-505 behind CF, left-center bleachers x -110..-30, batter's eye x -33..55, outside boxes west of the left leg.
//  - RF terrace is built in build() (3 tiers, ends flush at z -398 like the sheet); LF/Monty stands use config spans.
// FROM TEXT SOURCES (mlb.com, andrewclem.com): wall heights (10.5 LF, 19 Monty's Angle, 6 CF, 13.25 RF), foul poles 85 ft, backstop 49 ft,
//    brick/precast/copper-green material, black brick diamonds, 165 ft light towers, LF board 152 x 86 ft (blank here).
// LEVEL 4 (photos 1-7 in refs/PHI, MLB.com facts page, Clem, Wikipedia):
//  A FACADE (photo 1, 2): wide brick piers, paired tall two-storey windows above a pale precast arcade at street level, cream string course and
//    cornice, black-brick diamonds, gates = brick pylons + cream caps + dark steel truss canopy (photo 2), light towers = brick pylon to 70 ft then
//    an open steel lattice to 165 ft with platforms and a lamp bank (photos 2, 3, 5, 6), roof band copper green rising inward.
//  B HEIGHTS: roof 134 ft above the field, suite level 36, club concourse 61, terrace concourse 81 (MLB.com); the street is 23 ft above the field, so
//    outside the model the facade reads 23 ft taller than real (model ground = field). Parapet 112, towers 165, foul poles 85 (MLB.com).
//    Lower deck top = 3.5 + 0.33 x depth = 36 ft at 100 ft deep (matches the suite level). Upper deck front 38-60 ft, top about 86-105 ft from
//    sampled fronts + rows 0.6 slope (about 24 rows, Clem). LF board 86 ft tall, bottom 57.25, top 143.25 (MLB.com "143 ft 3 in"); block roof 54-57.
//    Shadow check on the sheet: the right-leg roof (134 ft) throws a dark band about 104 ft wide across the 1B stands (ratio about 0.8 in x);
//    rough only, not used to set any height.
//  C SEATING (table BOWL): measured on strips along the bowl normal (t 0 RF pole .. 1 LF pole). Lower seats end 55 ft out behind the plate in the
//    visible top view but rows continue under the mezzanine, so the lower depth is 92; 98-104 on the 3B line, 88-96 on the 1B line, narrowing to 56
//    at the RF pole and 64-85 toward the LF pole. Upper deck: set back (overhang -6..-30) on the 1B/RF side where it runs straight out to the roof
//    band (dEnd 146-198 = band inner edge 154-201 computed from the facade line), stacked (overhang 32-40) behind home and on the 3B side (dEnd 112-146),
//    wedge ending at t 0.9 near the LF pole. RF terrace and LF stand keep the earlier spans.
//  D BOARDS: LF board 152 x 86 on four steel columns with back-raked struts, three girders, X-bracing, catwalks above and below, end ladders, a steel
//    lattice tower with lamp bank on its centre-field end (photos 4, 5, 7), a blank ribbon board below it; blank grid faces. Out-of-town boards on
//    the RF wall and baseline message boards on the suite fascia. Flagpoles: six poles with plain flags on the centre-field concession roof (photo 5).
// STILL ESTIMATED: light tower positions (four facade corners), gate positions along the facade, bay pitch (28 ft), lamp counts, LF block outline
//  (in shadow), board centre position (front edge of the block, 8 ft back), flagpole positions/count, secondary board sizes, the upper-deck
//  mid-walkway notch (not modelled), mezzanine rows (merged into the upper deck front), outside buildings.
const FAC_H = 112, RIDGE = 134, TW_H = 165, BAND = 34;   // heights above the field (street is 23 ft above the field)

// measured outer facade line (outer edge of the copper roof band), RF terrace end -> home -> LF leg top, [x, z]
const FACADE_PTS = [[251, -388], [396, -265], [395, -48], [362, -12], [142, 229], [-64, 229], [-299, -16], [-299, -168]];
// gate centres (nearest facade point is used): RF gate, 1B diagonal, home, 3B diagonal, LF gate
const GATE_AT = [[395, -160], [262, 97], [25, 229], [-165, 95], [-299, -95]];
// light towers at the facade corners (estimated)
const TOWERS = [[388, -255], [355, -8], [-60, 222], [-292, -12]];
// pavilion row behind home plate: [x centre, width, dark roof?]
const HOME_PAV = [[-102, 62, 0], [-30, 50, 0], [28, 52, 1], [83, 56, 0], [153, 58, 0], [209, 54, 0]];
// roofed block behind the left-field stand (LF scoreboard sits on it)
const LF_BLOCK = [[-250, -318], [-128, -430], [-170, -445], [-226, -497], [-290, -468], [-308, -368]];

// Seating samples along the bowl: [t, lower depth, upper overhang (negative = upper set back), upper depth, upper front height]
// (t 0 = RF pole, 0.5 = behind home, 1 = LF pole). Sheet-measured depth, see the top comment.
const BOWL = [
  [0.00, 56, -30, 60, 38], [0.05, 66, -24, 78, 42], [0.10, 88, -12, 94, 46], [0.20, 96, -6, 90, 47], [0.30, 92, 0, 84, 47],
  [0.40, 86, 20, 90, 47], [0.50, 92, 40, 91, 48], [0.60, 98, 38, 52, 54], [0.70, 102, 34, 54, 58], [0.80, 104, 32, 56, 60],
  [0.90, 85, 25, 30, 58],
];
const SL = 0.33;                                                   // lower-deck slope (rise per foot): 3.5 -> 36 ft at 100 ft deep
const tabOf = (f) => BOWL.map((r) => [r[0], f(r)]);

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 329, h: 10.5 }, { deg: -13.6, r: 389, h: 12.7 }, { deg: -13.55, r: 389, h: 19 },
        { deg: -8.65, r: 385.4, h: 19 }, { deg: -4.7, r: 406.3, h: 19 }, { deg: -4.65, r: 406.3, h: 6 },
        { deg: 0, r: 402, h: 6 }, { deg: 7.85, r: 402.8, h: 6 }, { deg: 7.9, r: 402.8, h: 13.25 },
        { deg: 13.2, r: 398, h: 13.25 }, { deg: 45, r: 330, h: 13.25 },
      ],
      foulScale: 1,
      backstop: 49,
      lower: { depth: tabOf((r) => r[1]), slope: SL, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: tabOf((r) => r[2]),
        // front height of the upper deck = 3.5 + SL*d0 + rise, solved from the sampled front heights
        rise: tabOf((r) => r[4] - 3.5 - SL * (r[1] - r[2])),
        depth: tabOf((r) => r[3]),
        slope: 0.6, extent: [0.02, 0.9],
      },
      outfield: {
        depth: 85, slope: 0.4, spans: [[-45, -13.6, 85, 0.4], [-13.55, -4.7, 52, 0.55]],      // the RF terrace is built in build()
        eye: null, eyeHeight: 40, eyeDepth: 30,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#4a5d4f', facade: '#97503f', wall: '#2c4636', cream: '#dccfae' },
    };
  },

  build(ctx) {
    const { THREE, G, lam, tools, views } = ctx;
    const { sweepSolid, textTexture, wallH, clamp } = tools;
    const parts = ctx.parts, spec = ctx.spec;
    const low = ctx.lod === 'low';
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const BOX = new THREE.BoxGeometry(1, 1, 1);
    const inst = (mat, list, geo = BOX) => {
      if (!list.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const inst2 = (parent, mat, list, geo = BOX) => {
      if (!list.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; parent.add(m); return m;
    };
    const beam = (a, b, th) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };

    // ---- remove generic parts that conflict
    for (const k of ['lights', 'scoreboard', 'batterEye']) if (parts[k]) ctx.remove(parts[k]);
    for (const p of parts.poles || []) { p.scale.y = 85 / 60; p.position.y = 42.5; }   // 85 ft foul poles

    // ---- palette
    const brickCol = '#97503f', brickDk = '#7d3f33', cream = '#d8ccab', granite = '#a8907f';
    const copper = '#7aa392', steelCol = '#3c4247', black = '#26211f', glassCol = '#2a3338', lampCol = '#fff0bd';
    const mBrick = lam(brickCol), mCream = lam(cream), mGran = lam(granite), mCopper = lam(copper), mSteel = lam(steelCol), mBrickDk = lam(brickDk);
    const steelB = [], lampB = [], brickB = [], creamB = [], glassB = [], diaB = [], capP = [], colB = [];

    // ---- polyline helpers
    const resample = (poly, step) => {
      const pts = [];
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
        for (let k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      pts.push(poly[poly.length - 1]);
      const nr = pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * p[0] + nz * (p[1] + 150) < 0) { nx = -nx; nz = -nz; }
        return [nx, nz];
      });
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      return { pts, nr, cum, L: cum[cum.length - 1] };
    };
    const frameAt = (F, s) => {
      let i = 1; while (i < F.cum.length - 1 && F.cum[i] < s) i++;
      const f = clamp((s - F.cum[i - 1]) / Math.max(1e-6, F.cum[i] - F.cum[i - 1]), 0, 1), a = F.pts[i - 1], b = F.pts[i];
      let nx = F.nr[i - 1][0] * (1 - f) + F.nr[i][0] * f, nz = F.nr[i - 1][1] * (1 - f) + F.nr[i][1] * f; const l = Math.hypot(nx, nz); nx /= l; nz /= l;
      return { x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, nx, nz, ry: Math.atan2(nx, nz) };
    };
    const loc = (fr, lx, lz) => [fr.x + lx * fr.nz + lz * fr.nx, fr.z - lx * fr.nx + lz * fr.nz];
    const put = (list, fr, lx, ly, lz, sx, sy, sz) => { const [x, z] = loc(fr, lx, lz); list.push(mat4(x, ly, z, sx, sy, sz, fr.ry)); };
    const loc3 = (fr, lx, y, lz) => { const [x, z] = loc(fr, lx, lz); return [x, y, z]; };
    const sNear = (F, x, z) => { let best = 0, bd = 1e9; for (let s = 0; s <= F.L; s += 3) { const f = frameAt(F, s), d = Math.hypot(f.x - x, f.z - z); if (d < bd) { bd = d; best = s; } } return best; };

    // ======================================================================================================
    // 1. FACADE: brick wall on the measured line, granite base, precast string courses, three window rows
    //    (rows sit at the real concourse levels: ground/street, club 61, terrace 81 above the field), cornice
    // ======================================================================================================
    const FAC = resample(FACADE_PTS, 8);          // frames for bays, gates, signs
    const FACS = resample(FACADE_PTS, low ? 90 : 60);   // coarse path for the swept solids
    const H = FAC_H;
        {
      // brick wall with granite base (to 10 ft), set-back cream cornice at the top
      const prof = () => [[-2, 0], [1.5, 0], [1.5, 10], [0.4, 10], [0.4, H - 8], [1.8, H - 8], [1.8, H - 4], [3.4, H - 4], [3.4, H], [-2, H]];
      ctx.add(sweepSolid(FACS.pts, FACS.nr, prof, [2, 2, 1, 0, 1, 1, 1, 1, -1], 1), [mBrick, mCream, mGran]);
      const course = (y0, y1, out = 2.2) => ctx.add(sweepSolid(FACS.pts, FACS.nr, () => [[0.2, y0], [out, y0], [out, y1], [0.2, y1]], [1, 1, 1, 1], 1), [mBrick, mCream]);
      course(47, 49);                                           // string course above the ground arcade
      if (!low) { course(98.5, 100.5); course(H - 14, H - 12.4, 2.6); }
    }
    // rear wall of the RF terrace (stand back, lower than the facade)
    { const R = resample([[251, -388], [91, -398]], 80);
      ctx.add(sweepSolid(R.pts, R.nr, () => [[-1, 0], [1.5, 0], [1.5, 62], [-1, 62]], [2, 0, 1, -1], 1), [mBrick, mCream, mGran]); }
    const gates = GATE_AT.map(([x, z]) => sNear(FAC, x, z));
    const nearGate = (s, pad) => gates.some((g) => Math.abs(s - g) < pad);
    // window bays (photo 1: wide brick piers, tall paired two-storey windows above a pale precast arcade at street level)
    const PITCH = low ? 56 : 28;
    for (let s = 14; s < FAC.L - 14; s += PITCH) {
      if (nearGate(s, 44)) continue;
      const fr = frameAt(FAC, s);
      put(glassB, fr, 0, 27, 0.5, PITCH - 11, 30, 1);                         // ground arcade opening (recess)
      put(creamB, fr, PITCH / 2, 24, 1.1, 6, 48, 2.6);                         // pale precast pier, base to the string course
      if (low) put(glassB, fr, 0, 73, 0.5, 12, 40, 1);
      else for (const k of [-5.2, 5.2]) { put(glassB, fr, k, 73, 0.5, 4.4, 40, 1); put(creamB, fr, k, 73, 0.7, 5.2, 1, 0.8); put(creamB, fr, k, 93.5, 0.7, 5.8, 1.4, 1); }
      if (!low) put(diaB, fr, 0, 105, 0.6, 5, 5, 0.6);                          // black-brick diamond in the parapet band
    }

    // ======================================================================================================
    // 2. ROOF BAND: the copper-green roof over the upper concourse, 34 ft wide, rising from the cornice to the
    //    ridge at 134 ft above the field (MLB.com), with columns and ribs
    // ======================================================================================================
    {
      const roof = (poly) => {
        const B = resample(poly, low ? 90 : 60);
        // outer eave at the cornice, short steep mansard face, then a low pitch to the inner edge at the ridge height
        ctx.add(sweepSolid(B.pts, B.nr, () => [[-BAND, RIDGE - 3], [-BAND, RIDGE], [3, H - 1], [3, H - 5]], [0, 0, 0, 0, 0, 0], 0), [mCopper]);
        ctx.add(sweepSolid(B.pts, B.nr, () => [[-BAND - 0.5, RIDGE - 8], [-BAND - 0.5, RIDGE - 3.6], [-BAND + 1.6, RIDGE - 3.6], [-BAND + 1.6, RIDGE - 8]], [0, 0, 0, 0], 0), [mSteel]);   // inner steel fascia
      };
      roof(FACADE_PTS);
      const step = low ? 48 : 24;
      for (let s = step / 2; s < FAC.L - 4; s += step) {
        const fr = frameAt(FAC, s);
        const [ix, iz] = loc(fr, 0, -BAND + 1), [ox, oz] = loc(fr, 0, -6);
        colB.push(beam([ix, 81, iz], [ix, RIDGE - 4, iz], 1.4));                    // column from the terrace concourse (81 ft) up
        if (!low) steelB.push(beam([ix, RIDGE - 4, iz], [ox, H - 4, oz], 0.9), beam([ix, RIDGE - 8, iz], [ox, H - 4, oz], 0.7));   // rib under the roof
      }
    }

    // ======================================================================================================
    // 3. GATES, pavilions, light towers
    // ======================================================================================================
    // entrance gates (photo 2): brick pylons with cream caps, a dark steel truss canopy, iron fence panels between
    gates.forEach((gs, gi) => {
      const fr = frameAt(FAC, gs);
      for (const sx of [-1, 1]) { put(brickB, fr, sx * 20, 34, 3, 9, 68, 8); put(creamB, fr, sx * 20, 69, 3, 10.5, 2.4, 9.4); }
      put(brickB, fr, 0, 80, 2, 49, 36, 5);                               // brick gatehouse mass above the opening
      put(creamB, fr, 0, 99.5, 2.5, 51, 3, 7);
      put(glassB, fr, 0, 38, 5.2, 28, 40, 1);                             // opening
      put(steelB, fr, 0, 52, 11, 52, 1.6, 16);                            // canopy slab
      if (!low) for (const k of [-24, -12, 0, 12, 24]) steelB.push(beam(loc3(fr, k, 52, 3), loc3(fr, k, 56.5, 19), 0.8));   // canopy trusses
      if (!low) for (const k of [-8, 8]) put(glassB, fr, k, 80, 4.8, 6, 20, 1);
      put(capP, fr, 0, H + 3, 2.5, 52, 4, 8);
    });
    // home-side pavilion row (z 230..280) and the 3B-diagonal pavilion
    for (const [x, w, dark] of HOME_PAV) {
      creamB.push(mat4(x, 19, 253, w, 38, 46)); (dark ? steelB : capP).push(mat4(x, 40, 253, w + 2, 3, 48));
      if (!low) glassB.push(mat4(x, 20, 276.6, w * 0.6, 12, 1));
    }
    creamB.push(mat4(-162, 17, 224, 44, 34, 44)); capP.push(mat4(-162, 36, 224, 46, 3, 46));
    // outside buildings west of the left leg (cream roofs)
    for (const [x, z, w, d] of [[-348, -126, 44, 47], [-350, -78, 53, 44], [-351, -21, 56, 42], [-375, 38, 54, 46]]) { creamB.push(mat4(x, 15, z, w, 30, d)); }
    // light towers: brick shaft, precast cap, steel lattice mast, lamp bank facing the field
    TOWERS.forEach(([tx, tz]) => {
      const dx = -tx, dz = -150 - tz, dl = Math.hypot(dx, dz), fx = dx / dl, fz = dz / dl;   // facing the field
      // brick pylon base to 70 ft (the towers frame the gates), then an open four-leg steel lattice to 165 ft (photos 2, 3, 5, 6)
      brickB.push(mat4(tx, 35, tz, 15, 70, 15)); creamB.push(mat4(tx, 71, tz, 17.5, 3, 17.5), mat4(tx, 30, tz, 16.4, 2, 16.4));
      const hw0 = 6.5, hw1 = 4.5, y0 = 73;
      const legAt = (sx, sz, y) => { const k = (y - y0) / (TW_H - 2 - y0), w = hw0 + (hw1 - hw0) * k; return [tx + sx * w, y, tz + sz * w]; };
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) steelB.push(beam(legAt(sx, sz, y0), legAt(sx, sz, TW_H - 2), 1.3));
      const lv = low ? [y0, 118, 163] : [y0, 91, 109, 127, 145, 163];
      for (let i = 0; i < lv.length; i++) {
        const y = lv[i], w = hw0 + (hw1 - hw0) * ((y - y0) / (TW_H - 2 - y0));
        steelB.push(mat4(tx, y, tz - w, 2 * w, 0.9, 0.9), mat4(tx, y, tz + w, 2 * w, 0.9, 0.9), mat4(tx - w, y, tz, 0.9, 0.9, 2 * w), mat4(tx + w, y, tz, 0.9, 0.9, 2 * w));
        if (!low && i < lv.length - 1 && i % 2 === 0) { creamB.push(mat4(tx, y + 0.6, tz, 2 * w + 3, 0.5, 2 * w + 3)); }          // service platform
        if (i < lv.length - 1) { const y1 = lv[i + 1], w1 = hw0 + (hw1 - hw0) * ((y1 - y0) / (TW_H - 2 - y0));
          for (const [sx, sz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const tz2 = sx ? 1 : 0; steelB.push(beam([tx + sx * w + (tz2 ? 0 : -w), y, tz + sz * w + (tz2 ? -w : 0)], [tx + sx * w1 + (tz2 ? 0 : w1), y1, tz + sz * w1 + (tz2 ? w1 : 0)], 0.5)); } }
      }
      const ry = Math.atan2(fx, fz), hx = tx + fx * 3.5, hz = tz + fz * 3.5;
      steelB.push(mat4(hx, TW_H + 3, hz, 20, 14, 2.2, ry));
      for (let r = 0; r < 3; r++) for (let k = -2; k <= 2; k++) {
        if (low && k % 2) continue;
        lampB.push(mat4(hx + fx * 1.6 + fz * k * 3.6, TW_H - 1.2 + r * 4.2, hz + fz * 1.6 - fx * k * 3.6, 2.3, 2.3, 0.4, ry));
      }
    });
    // plain name sign above the home pavilions
    {
      const fr = frameAt(FAC, sNear(FAC, 0, 229));
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#2a2220'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d8ccab'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
        g.fillStyle = '#d8ccab'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 76px Georgia, serif'; g.fillText('CITIZENS BANK PARK', w / 2, h / 2 + 3);
      }, 1024, 160);
      const sgn = ctx.add(new THREE.PlaneGeometry(52, 8.1), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      const [x, z] = loc(fr, 0, 5.4); sgn.position.set(x, 84, z); sgn.rotation.y = fr.ry;
    }

    // ======================================================================================================
    // 4. OUTFIELD: batter's eye, Ashburn Alley promenade, bullpens, left-field block with the board
    // ======================================================================================================
    {
      // batter's eye: three overlapping brick walls, x -33..55
      [[-18, 36, 30, 36, 6], [10, 42, 34, 44, 18], [38, 32, 32, 34, 28]].forEach(([x, h, w, dep, out], k) => {
        const z = -(402 + out + dep / 2) + 2;
        const b = ctx.add(new THREE.BoxGeometry(w, h, dep), k === 1 ? mBrickDk : mBrick); b.position.set(x, h / 2, z);
        if (!low) { const c = ctx.add(new THREE.BoxGeometry(w + 2, 2, dep + 2), mCream); c.position.set(x, h + 1, z); }
      });
      // Ashburn Alley: brick promenade behind the wall, concession row on its far side
      const prom = ctx.add(new THREE.PlaneGeometry(380, 70).rotateX(-Math.PI / 2), lam('#a56b57')); prom.position.set(10, 0.25, -470);
      const stall = [], roofs = [];
      for (let x = -150; x <= 190; x += low ? 68 : 34) { stall.push(mat4(x, 8, -508, 26, 16, 14)); roofs.push(mat4(x, 17, -508, 30, 2, 18)); }
      inst(mCream, stall); inst(mCopper, roofs);
      if (!low) {
        const poles = [], heads = [];
        for (let x = -140; x <= 190; x += 40) { poles.push(beam([x, 0, -440], [x, 22, -440], 0.7)); heads.push(mat4(x, 23, -440, 2.2, 1.2, 2.2)); }
        inst(mSteel, poles); inst(basic(lampCol), heads);
      }
      // flagpoles on the roof of the centre-field concession block (photo 5): six poles with plain solid-colour flags (position estimated)
      {
        const poleB = [], flagB = [];
        for (let k = 0; k < 6; k++) {
          const x = 22 + k * 15, z = -503, base = 18;
          poleB.push(mat4(x, base + 22, z, 0.7, 44, 0.7)); flagB.push(mat4(x + 4.5, base + 40, z, 9, 5.6, 1));
        }
        inst(mSteel, poleB);
        const fm = inst(new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide }), flagB, new THREE.PlaneGeometry(1, 1));
        const cols = ['#8c3a35', '#d8ccab', '#3d5a80', '#6f8f72', '#c19a4a', '#d8ccab'];
        cols.forEach((c, i) => fm.setColorAt(i, new THREE.Color(c))); fm.instanceColor.needsUpdate = true;
      }
      // bullpens behind the right-centre wall: turf and dirt strips with a low fence
      const bp = ctx.add(new THREE.PlaneGeometry(90, 50).rotateX(-Math.PI / 2), lam('#3f5f40')); bp.position.set(111, 0.3, -419);
      const bd = ctx.add(new THREE.PlaneGeometry(90, 8).rotateX(-Math.PI / 2), lam('#8b6a4d')); bd.position.set(111, 0.4, -437);
      const fence = ctx.add(new THREE.BoxGeometry(92, 6, 1), mCopper); fence.position.set(111, 3, -393);
      // left-field block (roofed upper stand behind the LF seats) with the blank board on top
      const sh = new THREE.Shape(); LF_BLOCK.forEach(([x, z], i) => (i ? sh.lineTo(x, -z) : sh.moveTo(x, -z)));
      const blk = ctx.add(new THREE.ExtrudeGeometry(sh, { depth: 54, bevelEnabled: false }).rotateX(-Math.PI / 2), [mBrick, mBrick]);
      const roofLF = ctx.add(new THREE.ExtrudeGeometry(sh, { depth: 3, bevelEnabled: false }).rotateX(-Math.PI / 2), mSteel); roofLF.position.y = 54;
      // ---- main video board 152 x 86 ft, bottom 57.25, top 143.25 ft (the "143 ft 3 in" steel top, MLB.com). Local +z faces home plate.
      const mid = [-187, -376], bw = 152, bh = 86, yb = 57.25, yt = yb + bh;
      const g = new THREE.Group(); g.position.set(mid[0] + 8, 0, mid[1] - 8); g.lookAt(0, 0, 0); G.add(g);
      const gridTex = textTexture((c, w, h) => {      // blank dark face with a plain module grid
        c.fillStyle = '#1b2327'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2b363b'; c.lineWidth = 2;
        for (let i = 0; i <= 38; i++) { c.beginPath(); c.moveTo(i * w / 38, 0); c.lineTo(i * w / 38, h); c.stroke(); }
        for (let j = 0; j <= 22; j++) { c.beginPath(); c.moveTo(0, j * h / 22); c.lineTo(w, j * h / 22); c.stroke(); }
      }, 512, 300);
      const panel = ctx.add(new THREE.BoxGeometry(bw, bh, 5), [mSteel, mSteel, mSteel, mSteel, new THREE.MeshBasicMaterial({ map: gridTex }), mSteel], g); panel.position.set(0, yb + bh / 2, 0);
      const gl = [], gs = [];                       // girders/struts (steel) and rails, local to g
      const bx = (x, y, z, sx, sy, sz) => mat4(x, y, z, sx, sy, sz);
      gl.push(bx(0, yt + 1.5, 1.5, bw + 6, 3, 3), bx(0, yb - 1.5, 1.5, bw + 6, 3, 3), bx(-bw / 2 - 1.5, yb + bh / 2, 1.5, 3, bh, 3), bx(bw / 2 + 1.5, yb + bh / 2, 1.5, 3, bh, 3));
      const colX = [-66, -22, 22, 66];
      for (const x of colX) {
        gl.push(bx(x, (54 + yt) / 2, -7, 4, yt - 54, 4));
        gs.push(beam([x, yt - 4, -7], [x, 56, -62], 2.2), beam([x - 5, yt - 4, -7], [x - 5, 56, -62], 1.2));
      }
      for (const y of [yb + 4, yb + bh / 2, yt - 6]) gl.push(bx(0, y, -7, bw, 3, 3));
      if (!low) for (let k = 0; k < colX.length - 1; k++) for (const [y0, y1] of [[yb + 4, yb + bh / 2], [yb + bh / 2, yt - 6]]) {
        gs.push(beam([colX[k], y0, -9], [colX[k + 1], y1, -9], 0.9), beam([colX[k + 1], y0, -9], [colX[k], y1, -9], 0.9));
      }
      const walks = [];
      for (const [y, z] of [[yb - 3.2, 5], [yt + 3.2, 5]]) {
        walks.push(bx(0, y, z, bw + 10, 0.8, 9)); gl.push(bx(0, y + 3.6, z + 4.4, bw + 10, 0.5, 0.5));
        if (!low) for (let x = -bw / 2 - 4; x <= bw / 2 + 4; x += 12) gs.push(bx(x, y + 1.9, z + 4.4, 0.5, 3.4, 0.5));
      }
      for (const sx of [-1, 1]) gs.push(bx(sx * (bw / 2 + 4.5), (54 + yt) / 2, -2, 1, yt - 54, 1));
      if (!low) for (const x of [-60, -20, 20, 60]) gs.push(beam([x, 55, -6], [x, yb - 3, 5], 1.4));
      // lattice tower on the centre-field end of the board (photos 4, 5, 7): four legs, rings, X braces, lamp bank on top
      {
        const tx = bw / 2 + 16, tz = -10, w0 = 11, w1 = 8, y0 = 54, y1 = 168, W = (y) => w0 + (w1 - w0) * (y - y0) / (y1 - y0);
        for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) gs.push(beam([tx + sx * w0, y0, tz + sz * w0], [tx + sx * w1, y1, tz + sz * w1], 2));
        const lv = low ? [y0, 100, 140, y1] : [y0, 72, 90, 108, 126, 144, y1];
        for (let i = 0; i < lv.length; i++) {
          const y = lv[i], w = W(y);
          gl.push(bx(tx, y, tz - w, 2 * w, 1, 1), bx(tx, y, tz + w, 2 * w, 1, 1), bx(tx - w, y, tz, 1, 1, 2 * w), bx(tx + w, y, tz, 1, 1, 2 * w));
          if (i < lv.length - 1) { const yy = lv[i + 1], w2 = W(yy);
            gs.push(beam([tx - w, y, tz - w], [tx + w2, yy, tz - w2], 0.7), beam([tx + w, y, tz - w], [tx - w2, yy, tz - w2], 0.7), beam([tx - w, y, tz + w], [tx + w2, yy, tz + w2], 0.7), beam([tx + w, y, tz + w], [tx - w2, yy, tz + w2], 0.7)); }
        }
        walks.push(bx(tx, 144 + 0.6, tz, 2 * W(144) + 4, 0.8, 2 * W(144) + 4));
        gl.push(bx(tx, y1 + 7, tz + w1 + 1.5, 30, 18, 2.5));                       // lamp frame
        const lamps = [];
        for (let r = 0; r < 4; r++) for (let k = -3; k <= 3; k++) { if (low && (k + r) % 2) continue; lamps.push(bx(tx + k * 3.9, y1 + 1.5 + r * 4.2, tz + w1 + 3, 3, 3, 0.5)); }
        inst2(g, basic(lampCol), lamps);
        // connecting catwalk from the tower to the board's back girder
        gl.push(bx((tx + bw / 2) / 2, yb + 30, -8, tx - bw / 2, 1.2, 2.5));
      }
      // secondary ribbon board under the main face (blank dark strip, 110 x 7)
      const rib = ctx.add(new THREE.BoxGeometry(110, 7, 3), [mSteel, mSteel, mSteel, mSteel, basic('#202a2e'), mSteel], g); rib.position.set(-8, 50.2, 0.5);
      inst2(g, mSteel, gl); inst2(g, mSteel, gs); inst2(g, lam('#6a665e'), walks);
    }
    // RF terrace: three stepped tiers (about 130 ft deep). The end next to the bullpens is cut flush (normals swing to +x).
    {
      const [p, n0, dg] = tools.span(13.5, 45), n = n0.map((q, i) => { const w = clamp(1 - i / 5, 0, 1), x = q[0] * (1 - w) + w, z = q[1] * (1 - w), l = Math.hypot(x, z); return [x / l, z / l]; });
      const tiers = (i) => {
        const hw = wallH(spec, dg[i]), pts = [[1.2, 0], [1.2, hw + 3], [4, hw + 3]]; let d = 4, h = hw + 3;
        for (let k = 0; k < 3; k++) { d += 40; h += 0.36 * 40; pts.push([d, h]); if (k < 2) { pts.push([d, h + 6], [d + 4, h + 6]); d += 4; h += 6; } }
        pts.push([d, 0]); return pts;
      };
      ctx.add(sweepSolid(p, n, tiers, [0, 2, 1, 3, 2, 1, 3, 2, 1, 3, -1], 3), ctx.M);
    }
    // secondary boards: out-of-town boards on the right-field wall (blank grid) and baseline message boards on the suite fascia
    {
      const oot = textTexture((c, w, h) => {
        c.fillStyle = '#1d2a22'; c.fillRect(0, 0, w, h); c.strokeStyle = '#33473a'; c.lineWidth = 2;
        for (let i = 0; i <= 14; i++) { c.beginPath(); c.moveTo(i * w / 14, 0); c.lineTo(i * w / 14, h); c.stroke(); }
        for (let j = 0; j <= 5; j++) { c.beginPath(); c.moveTo(0, j * h / 5); c.lineTo(w, j * h / 5); c.stroke(); }
      }, 448, 160);
      const mOot = new THREE.MeshBasicMaterial({ map: oot });
      for (const [dg, w, h] of low ? [[30, 40, 9]] : [[30, 40, 9], [38, 22, 5]]) {
        const q = tools.wallAt(dg, 0, 0), hw = wallH(spec, dg), yc = Math.max(hw - h / 2 - 0.8, h / 2 + 0.5);
        const b = ctx.add(new THREE.PlaneGeometry(w, h), mOot); b.position.set(q.x, yc, q.z);
        b.lookAt(0, yc, 0); b.translateZ(0.6);
      }
      if (!low) for (const t of [0.3, 0.7]) {
        const i = Math.round(t * ctx.dims.N1), pt = ctx.paths.bPts[i], nn = ctx.paths.bN[i], dd = ctx.dims.deckAt;
        const d = dd.dL(i) + 0.5, y = dd.lowTop(i) + 2.5;
        const b = ctx.add(new THREE.BoxGeometry(34, 3.2, 0.8), basic('#1d2327'));
        b.position.set(pt[0] + nn[0] * d, y, pt[1] + nn[1] * d); b.lookAt(pt[0] + nn[0] * (d + 10), y, pt[1] + nn[1] * (d + 10));
      }
    }

    inst(mBrick, brickB); inst(mCream, creamB); inst(basic(glassCol, { side: THREE.DoubleSide }), glassB);
    inst(basic(black), diaB, new THREE.BoxGeometry(1, 1, 1).rotateZ(Math.PI / 4)); inst(mCopper, capP);
    inst(mSteel, steelB); inst(mSteel, colB); inst(basic(lampCol), lampB);

    // ======================================================================================================
    // 5. Views
    // ======================================================================================================
    const gf = frameAt(FAC, gates[1]), gp = loc(gf, 0, 330), gl = loc(gf, 0, 0);
    views.gate = { pos: [gp[0], 36, gp[1]], look: [gl[0], 60, gl[1]], label: 'Gate & Towers' };
    const hf = frameAt(FAC, sNear(FAC, 0, 229)), hp = loc(hf, 120, 190), hl = loc(hf, 0, 0);
    views.facade = { pos: [hp[0], 70, hp[1]], look: [hl[0], 50, hl[1]], label: 'Brick Facade', orbit: true };
    views.alley = { pos: [20, 30, -330], look: [20, 18, -470], label: 'Ashburn Alley' };
    for (const v of ['gate', 'facade', 'alley']) views[v].dir = new THREE.Vector3(...views[v].look).sub(new THREE.Vector3(...views[v].pos)).normalize();
  },
};
