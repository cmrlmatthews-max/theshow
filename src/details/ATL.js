// Detail module: Truist Park, Atlanta Braves (opened 2017). Units: feet.
// Sources: Wikipedia, Clem's Baseball, Baseball-Reference Bullpen, AJC (wall distances/heights, decks, canopy, Chop House).
// REFINED from the survey sheet (survey_tight.png, 1.5 px/ft, home plate = origin) and six photographs.
// MEASURED FROM THE SHEET:
//  - Roof outer edge: 17 stations (RF end 373,-153 -> behind home 0,252 -> LF end -383,-250); inner edge: 17 stations
//    (RF end 303,-167 -> behind home 0,158 -> LF end -300,-232). The roof stops at z=-153 (right) and z=-250 (left),
//    so the two ends differ. Outer wall (facade) line = outer roof edge pulled in 5 ft. Roof is 105 ft wide behind home.
//  - Outfield: low back wall line (left end -383,-250 around center z=-498 to right end 373,-153); main board and stack
//    above the batter's eye at x~-6, second board in left-center at x~-135; lattice tower bases from the shadow lines.
//  - Outfield wall corners were checked against the sheet (left corner r 335, left-center, center 400): within ~10 ft, kept.
// FROM PHOTOS: red-brown brick towers with cream caps/bands and arched tall windows, steel arch bridge and truss between
//  the twin towers of each gate, low dark entry canopy, cream precast wing panels, dark steel lattice towers, brick-over-metal
//  outfield wall, light-gray metal roof on dark columns/girders, lamp banks on the roof front edge, green seats.
// SECOND DETAIL PASS (seating bowl, field level, facade parts):
//  MEASURED on the zone sheets: dugouts (x +/-93, z -23, ~62 ft long, on the front row of the seats), batter's eye footprint
//    (x -40..+67, front on the wall line), seat end behind home (z~+105), upper-deck front line behind home (z~+105), section
//    aisle spacing (~22 ft of arc), facade distance for the upper-deck depth (ray to the measured facade line).
//  FROM PHOTOS: bowl layers (lower bowl with cross-aisle, club glass band, cream spandrel, suite glass band, upper deck in two
//    tiers), window grid and arched heads, stair-flight glazing, black gate fences, black perimeter fence on the brick outfield
//    wall, yellow foul poles, muted wall panels, red board in the wall right of the eye, dark-green eye with a planter ledge.
//  FROM LOOKUPS: Clem's Baseball (rows 33 / 19 / 13+12, field ~20 ft below street level), atlanta.com (bullpens in right-center,
//    beyond the wall).
//  ESTIMATES: all level heights (lower top 22-33 ft, club glass +4..+16, suite glass +19..+29, upper deck front 58-70, back 98),
//    bowl depths (52 ft behind home, 102 ft on the baselines, upper 46-90 ft), bullpen layout and mounds, net height (29 ft),
//    tunnel and aisle positions, stair/ramp tower positions, gate fence extent, eye height 38 ft, flag poles.
// STILL ESTIMATED: all heights (roof 112 ft outer / 127 ft inner, facade 72 ft, towers 100 ft, boards, lattice towers), gate
//  positions (five pavilions, spaced by arc length), tower count and positions, deck depths (the real bowl is deeper on the
//  sides than behind home; uniform here), Chop House mass, batter's eye details, Battery Atlanta blocks, video board faces.
const D2R = Math.PI / 180;
const LOWER_D = 100, UPPER_D = 92;
// Roof outer and inner edge, from the survey sheet. Order: right-field end -> behind home -> left-field end. [x, z]
const ROOF_OUT = [[373, -153], [373, -120], [353, -53], [313, 13], [253, 80], [193, 133], [133, 187], [67, 233], [0, 252],
  [-73, 232], [-153, 187], [-220, 140], [-280, 73], [-347, -13], [-380, -100], [-388, -167], [-383, -250]];
const ROOF_IN = [[303, -167], [300, -107], [280, -67], [233, -7], [187, 47], [127, 107], [67, 147], [0, 158], [-70, 150],
  [-130, 132], [-180, 95], [-213, 40], [-255, -15], [-290, -55], [-305, -110], [-302, -170], [-300, -232]];
const FAC_H = 72, LOW_H = 44;
const GATE_S = [0.05, 0.27, 0.5, 0.73, 0.95];            // gate pavilions as fractions of facade length (RF -> LF)
// Low outfield back wall, left end to right end.
const LOW_WALL = [[-383, -250], [-388, -330], [-340, -398], [-270, -446], [-190, -478], [-100, -494], [0, -498], [100, -494],
  [190, -470], [260, -425], [320, -355], [352, -255], [373, -153]];
const TOWERS = [[-84, -482, 150], [72, -482, 150], [-176, -466, 104], [-94, -484, 104], [-222, -345, 118], [192, -362, 118]];
const MAIN_BOARD = { x: -6, z: -470, y0: 84, w: 128, h: 56 };
const SECOND_BOARD = { x: -135, z: -466, y0: 50, w: 66, h: 30 };
// pull a polyline inward by d (outward normals point away from the field center)
const shiftIn = (poly, d) => poly.map((p, i) => {
  const a = poly[Math.max(i - 1, 0)], b = poly[Math.min(i + 1, poly.length - 1)];
  let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
  if (nx * p[0] + nz * (p[1] + 150) < 0) { nx = -nx; nz = -nz; }
  return [p[0] - nx * d, p[1] - nz * d];
});
const FAC_TALL = shiftIn(ROOF_OUT, 5);

// Point on the line from corner A to corner B at the given angle (gives the radius).
const onLine = (A, B, deg) => {
  const a = deg * D2R, dx = Math.sin(a), dz = -Math.cos(a);
  const ax = A.r * Math.sin(A.deg * D2R), az = -A.r * Math.cos(A.deg * D2R);
  const ex = B.r * Math.sin(B.deg * D2R) - ax, ez = -B.r * Math.cos(B.deg * D2R) - az;
  return (ax * ez - az * ex) / (dx * ez - dz * ex);
};

export default {
  config(rec) {
    const lf = { deg: -45, r: 335 }, lcf = { deg: -22, r: 385 }, rcf = { deg: 22, r: 375 }, rf = { deg: 45, r: 325 };
    const rL = onLine(lf, lcf, -36), rR = onLine(rcf, rf, 33);
    return {
      wall: [
        { deg: -45, r: 335, h: 6 }, { deg: -36, r: rL, h: 6 }, { deg: -35.95, r: rL, h: 8.7 },
        { deg: -22, r: 385, h: 8.7 }, { deg: -5.5, r: 401, h: 8.7 }, { deg: 0, r: 400, h: 8.7 }, { deg: 9.5, r: 402, h: 8.7 },
        { deg: 22, r: 375, h: 8.7 }, { deg: 33, r: rR, h: 8.7 }, { deg: 33.05, r: rR, h: 16 }, { deg: 45, r: 325, h: 16 },
      ],
      lower: { depth: LOWER_D, slope: 0.3, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 34, rise: 26, depth: UPPER_D, slope: 0.52, extent: [0.03, 0.97] },
      outfield: { depth: 68, slope: 0.42, spans: [[-45, -5.5], [9.5, 33]], eye: [-5.5, 9.5], eyeHeight: 36, eyeDepth: 44 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#3b5d4d', facade: '#9b5a45', wall: '#2b4034', cream: '#e4d9bc' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, C, views } = ctx;
    const { sweepSolid, textTexture, wallR, wallH, clamp, mixHex } = tools;
    const { bPts, bN, wallPts, wallDeg, wallN } = paths;
    const N1 = bPts.length - 1;
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const spec = ctx.spec;

    // Seeded random for repeatable scatter
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    // Instanced helper: mats = array of Matrix4
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx));
      m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const idx = (t) => Math.round(clamp(t, 0, 1) * N1);
    const rep0 = (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

    // ---------- 1. Wall: brick facing on the tall right-field wall, short padded strip on the low left corner
    {
      const [p, n, dg] = tools.span(33.5, 45);
      const h = (i) => wallH(spec, dg[i]);
      ctx.add(sweepSolid(p, n, (i) => [[-0.5, 0], [-0.5, h(i)], [0.3, h(i)], [0.3, 0]], [MAT.FACADE, MAT.FACADE, MAT.FACADE, -1], MAT.FACADE), M);
    }

    // ---------- 2. Chop House: stepped restaurant mass above the right-field wall, with terraces
    {
      const [p, n, dg] = tools.span(33.5, 44.5);
      const prof = () => [[1.2, 0], [1.2, 28], [12, 28], [12, 42], [28, 42], [28, 58], [46, 58], [46, 0]];
      ctx.add(sweepSolid(p, n, prof, [MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.SHADE, MAT.FACADE, -1], MAT.FACADE), M);
      // railings on both terraces and the rooftop plaza
      const rail = (d, y) => ctx.add(sweepSolid(p, n, () => [[d - 0.2, y], [d - 0.2, y + 3.6], [d + 0.2, y + 3.6], [d + 0.2, y]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      rail(2.2, 28); rail(13, 42);
      // roof cap over the top block
      ctx.add(sweepSolid(p, n, () => [[27, 58], [27, 60], [47, 60], [47, 58]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      // window blocks on three faces (instanced dark panels)
      const win = [];
      const faces = [[1.0, 18, 3.4, 7.5, 2], [11.8, 34.5, 3.4, 7, 2], [27.8, 50, 3.6, 7.5, 2]];
      for (const [d, y, w, h, step] of faces) {
        for (let i = 0; i < p.length; i += step) {
          const x = p[i][0] + n[i][0] * d, z = p[i][1] + n[i][1] * d;
          win.push(mat4(x, y, z, w, h, 1, Math.atan2(-n[i][0], -n[i][1])));
        }
      }
      inst(new THREE.PlaneGeometry(1, 1), basic('#3a4a50'), win);
      // flat plaza deck on the highest terrace (visible rooftop plaza) gets tiny table umbrellas
      const um = [];
      for (let i = 2; i < p.length - 2; i += 3) um.push(mat4(p[i][0] + n[i][0] * 20, 44.5, p[i][1] + n[i][1] * 20, 3.2, 1, 3.2));
      inst(new THREE.ConeGeometry(1, 1.4, 8), lam('#d8c9a0'), um);
    }

    // ---------- 3. Batter's eye (measured: x -40..+67, front on the wall line, ~80 ft deep with its shadow; photo10:
    //            flat dark-green panel wall, a planter ledge with evergreens in front, a brick block to the left)
    {
      if (parts.batterEye) ctx.remove(parts.batterEye);
      const EH = 38, EDEP = 46;
      const [p, n, dg] = tools.span(-5.5, 9.5);
      const panelTex = rep0(textTexture((g, w, h) => {
        g.fillStyle = '#243d2f'; g.fillRect(0, 0, w, h); g.fillStyle = '#1b3126'; g.fillRect(0, 0, 3, h);
        g.fillStyle = '#2c4838'; for (let y = 8; y < h; y += 32) g.fillRect(3, y, w - 3, 2);   // horizontal reveals
      }, 64, 64));
      const mPanel = new THREE.MeshLambertMaterial({ map: panelTex, side: THREE.DoubleSide });
      const mTop = lam('#1d3025'), mCap = lam('#d9cfae');
      ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, EH], [EDEP, EH], [EDEP, 0]], [0, 1, 1, -1], 1), [mPanel, mTop]);
      ctx.add(sweepSolid(p, n, () => [[1.0, EH - 0.2], [1.0, EH + 1.4], [2.4, EH + 1.4], [2.4, EH - 0.2]], [0, 0, 0, 0], 0), [mCap]);
      // planter ledge halfway up the face, with a row of evergreens (small cones, instanced)
      ctx.add(sweepSolid(p, n, () => [[1.2, 11], [1.2, 12.2], [8, 12.2], [8, 11]], [0, 0, 0, 0], 0), [lam('#6f6a5a')]);
      const cones = [];
      for (let k = 0; k < p.length; k += 2) {
        const sc = 0.8 + rnd() * 0.5, o = 3.5 + rnd() * 2;
        const x = p[k][0] + n[k][0] * o, z = p[k][1] + n[k][1] * o;
        cones.push(mat4(x, 12.2 + 7 * sc, z, 3.6 * sc, 14 * sc, 3.6 * sc));
      }
      for (let k = 1; k < p.length; k += 3) {          // a few taller trees on the roof of the eye
        const sc = 1.1 + rnd() * 0.5, o = 8 + rnd() * 30;
        cones.push(mat4(p[k][0] + n[k][0] * o, EH + 9 * sc, p[k][1] + n[k][1] * o, 4.5 * sc, 18 * sc, 4.5 * sc));
      }
      inst(new THREE.ConeGeometry(1, 1, 9), lam('#2d4a33'), cones);
      // brick block to the left of the eye, under the board stack (photo10)
      const bw = tools.wallAt(-8.2, EDEP + 8, 0);
      const bb = ctx.add(new THREE.BoxGeometry(34, 62, 40), lam('#8e5642')); bb.position.set(bw.x - 3, 31, bw.z - 18);
      const bc = ctx.add(new THREE.BoxGeometry(38, 3, 44), lam('#e0d5b5')); bc.position.set(bb.position.x, 63.5, bb.position.z);
      const bwin = [];
      for (let r = 0; r < 4; r++) for (let c = -1; c <= 1; c++) bwin.push(mat4(bb.position.x + c * 9, 18 + r * 12, bb.position.z + 20.2, 5, 6, 1));
      inst(new THREE.PlaneGeometry(1, 1), basic('#2b363d', { side: THREE.DoubleSide }), bwin);
      // flag poles on the eye roof: three plain pennant flags in muted colors (no marks)
      const poles = [], flags = [];
      [[-26, 0], [-2, 1], [22, 2]].forEach(([dx, c], k) => {
        const q = tools.wallAt(dx / 400 / D2R, 30, EH + 1.4);
        poles.push(mat4(q.x, EH + 1.4 + 17, q.z, 0.5, 34, 0.5));
        flags.push(mat4(q.x + 5.6, EH + 1.4 + 29.5, q.z, 11, 6, 1));
      });
      inst(new THREE.CylinderGeometry(1, 1, 1, 6), lam('#d9d4c4'), poles);
      inst(new THREE.PlaneGeometry(1, 1), lam('#7b3b34'), flags);
    }

    const { d0, h0, dEnd, hTop } = dims;
    // ======================================================================================================
    // 5. ROOF: one light-gray metal canopy ribbon between a measured inner and outer edge (survey sheet),
    //    dark steel columns, rafters and braces, and a light-bank frieze on the front edge.
    // ======================================================================================================
    const Y_OUT = 112, Y_IN = 127, ROOF_T = 4;
    const steelBoxes = [], lightBoxes = [];            // shared instance lists (steel = dark frame, light = lamp banks)
    const nearestOn = (poly, p) => {
      let best = poly[0], bd = 1e9;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], ex = b[0] - a[0], ez = b[1] - a[1];
        const t = clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ez) / (ex * ex + ez * ez), 0, 1);
        const q = [a[0] + ex * t, a[1] + ez * t], d = Math.hypot(p[0] - q[0], p[1] - q[1]);
        if (d < bd) { bd = d; best = q; }
      }
      return best;
    };
    const beam = (a, b, th) => {                       // matrix of a thin box from a to b ([x,y,z])
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); return tmp.matrix.clone();
    };
    const strip = (P, Q, uLen, vRep) => {              // quad strip between two 3D polylines with uvs
      const pos = [], uv = []; let run = 0;
      for (let i = 0; i < P.length - 1; i++) {
        const seg = Math.hypot(P[i + 1].x - P[i].x, P[i + 1].z - P[i].z), u0 = run / uLen, u1 = (run + seg) / uLen;
        for (const [p, u, v] of [[P[i], u0, 0], [Q[i], u0, vRep], [Q[i + 1], u1, vRep], [P[i], u0, 0], [Q[i + 1], u1, vRep], [P[i + 1], u1, 0]]) { pos.push(p.x, p.y, p.z); uv.push(u, v); }
        run += seg;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals(); return g;
    };
    const rep = (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
    const roofSt = [];                                  // stations: { A: outer [x,z], B: inner [x,z] }
    {
      const Od = [];                                    // outer table, densified once (midpoints)
      for (let i = 0; i < ROOF_OUT.length; i++) { Od.push(ROOF_OUT[i]); if (i < ROOF_OUT.length - 1) { const a = ROOF_OUT[i], b = ROOF_OUT[i + 1]; Od.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); } }
      Od.forEach((A, i) => roofSt.push({ A, B: i === 0 ? ROOF_IN[0] : i === Od.length - 1 ? ROOF_IN[ROOF_IN.length - 1] : nearestOn(ROOF_IN, A) }));
      const at3 = (pt, y) => new THREE.Vector3(pt[0], y, pt[1]);
      const Atop = roofSt.map((s) => at3(s.A, Y_OUT)), Abot = roofSt.map((s) => at3(s.A, Y_OUT - ROOF_T));
      const Btop = roofSt.map((s) => at3(s.B, Y_IN)), Bbot = roofSt.map((s) => at3(s.B, Y_IN - ROOF_T));
      const Bfr = roofSt.map((s) => at3(s.B, Y_IN - 7.5));
      const topTex = rep(textTexture((g, w, h) => {      // light-gray metal deck with standing seams
        g.fillStyle = '#b2bfc7'; g.fillRect(0, 0, w, h); g.fillStyle = '#97a5ae'; g.fillRect(0, 0, 3, h); g.fillRect(0, 0, w, 2);
      }, 64, 64));
      const underTex = rep(textTexture((g, w, h) => {    // truss pattern on the soffit
        g.fillStyle = '#5b6268'; g.fillRect(0, 0, w, h); g.strokeStyle = '#33393e'; g.lineWidth = 3; g.strokeRect(1, 1, w - 2, h - 2);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
      }, 64, 64));
      const lampTex = rep(textTexture((g, w, h) => {
        g.fillStyle = '#4a5157'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff1bd';
        for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(8 + i * 16, h / 2, 5, 0, 7); g.fill(); }
      }, 64, 16));
      const width = (i) => Math.hypot(roofSt[i].A[0] - roofSt[i].B[0], roofSt[i].A[1] - roofSt[i].B[1]);
      const wAvg = roofSt.reduce((a, _, i) => a + width(i), 0) / roofSt.length;
      const dbl = (m) => { m.side = THREE.DoubleSide; return m; };
      ctx.add(strip(Atop, Btop, 24, wAvg / 24), dbl(new THREE.MeshLambertMaterial({ map: topTex })));
      ctx.add(strip(Abot, Bbot, 24, wAvg / 24), dbl(new THREE.MeshLambertMaterial({ map: underTex })));
      ctx.add(strip(Abot, Atop, 40, 1), lam('#8d969b'));               // outer fascia
      ctx.add(strip(Bfr, Btop, 16, 1), dbl(new THREE.MeshBasicMaterial({ map: lampTex })));   // inner frieze with lamps
      // end faces where the roof stops (right end is shorter than left end)
      for (const k of [0, roofSt.length - 1]) {
        ctx.add(strip([Abot[k], Bbot[k]], [Atop[k], Btop[k]], 40, 1), lam('#8d969b'));
      }
      // frame: column over the facade, girder under the deck, raker brace down to the facade top
      roofSt.forEach((s, i) => {
        const A = s.A, B = s.B, lerp = (w) => [A[0] + (B[0] - A[0]) * w, A[1] + (B[1] - A[1]) * w];
        const yAt = (w) => Y_OUT + (Y_IN - Y_OUT) * w;
        const c0 = lerp(0.03);
        steelBoxes.push(beam([c0[0], FAC_H, c0[1]], [c0[0], Y_OUT - ROOF_T, c0[1]], 2.2));
        const g0 = lerp(0.02), g1 = lerp(0.97);
        steelBoxes.push(beam([g0[0], Y_OUT - ROOF_T - 5, g0[1]], [g1[0], Y_IN - ROOF_T - 5, g1[1]], 1.5));
        const m = lerp(0.5);
        steelBoxes.push(beam([c0[0], FAC_H + 2, c0[1]], [m[0], yAt(0.5) - ROOF_T - 5, m[1]], 1.3));
        steelBoxes.push(beam([m[0], yAt(0.5) - ROOF_T - 5, m[1]], [g1[0], Y_IN - ROOF_T - 5, g1[1]], 1.1));
        // lamp bank on the front edge: a box facing the field, every other station twice
        const e = roofSt[Math.min(i + 1, roofSt.length - 1)].B, p = roofSt[Math.max(i - 1, 0)].B;
        const tx = e[0] - p[0], tz = e[1] - p[1], tl = Math.hypot(tx, tz) || 1;
        const segLen = Math.hypot(roofSt[Math.min(i + 1, roofSt.length - 1)].B[0] - B[0], roofSt[Math.min(i + 1, roofSt.length - 1)].B[1] - B[1]);
        const n = Math.max(1, Math.round(segLen / 12));
        for (let q = 0; q < n && i < roofSt.length - 1; q++) {
          const nb = roofSt[i + 1].B, f = (q + 0.5) / n, bx = B[0] + (nb[0] - B[0]) * f, bz = B[1] + (nb[1] - B[1]) * f;
          const ang = Math.atan2(-(nb[1] - B[1]), nb[0] - B[0]);
          lightBoxes.push(mat4(bx, Y_IN - 3.2, bz, 9, 3.4, 1.6, ang));
        }
      });
    }
    // ======================================================================================================
    // 7. FACADE: brick wall on the measured outer line, precast bands, window bays, five gate pavilions
    //    (twin brick towers, steel arch bridge, low entry canopy). Instanced for repeated parts.
    // ======================================================================================================
    const brickCol = '#9b5a45', creamCol = '#e4d9bc', steelCol = '#3b4147', glassCol = '#2b363d';
    const mBrick = lam(brickCol), mCream = lam(creamCol), mSteel = lam(steelCol), mMetal = lam('#6d7873');
    // resample a polyline at roughly equal spacing; returns points, outward normals, cumulative length
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
        if (nx * (p[0] - 0) + nz * (p[1] + 150) < 0) { nx = -nx; nz = -nz; }
        return [nx, nz];
      });
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      return { pts, nr, cum, L: cum[cum.length - 1] };
    };
    const frameAt = (F, s) => {                          // position, outward normal at arc length s
      let i = 1; while (i < F.cum.length - 1 && F.cum[i] < s) i++;
      const f = clamp((s - F.cum[i - 1]) / Math.max(1e-6, F.cum[i] - F.cum[i - 1]), 0, 1), a = F.pts[i - 1], b = F.pts[i];
      let nx = F.nr[i - 1][0] * (1 - f) + F.nr[i][0] * f, nz = F.nr[i - 1][1] * (1 - f) + F.nr[i][1] * f; const l = Math.hypot(nx, nz); nx /= l; nz /= l;
      return { x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, nx, nz, ry: Math.atan2(nx, nz) };
    };
    const brickB = [], creamB = [], glassBay = [], glassTwr = [], glassSm = [], glassPortal = [], glassStair = [], archP = [], torusM = [], fenceB = [];
    const rampBody = [], rampCap = [];
    // local-frame helper: lx along the wall, lz outward from the wall plane
    const loc = (fr, lx, lz) => [fr.x + lx * fr.nz + lz * fr.nx, fr.z - lx * fr.nx + lz * fr.nz];
    const put = (list, fr, lx, ly, lz, sx, sy, sz) => { const [x, z] = loc(fr, lx, lz); list.push(mat4(x, ly, z, sx, sy, sz, fr.ry)); };
    const putBeam = (fr, a, b, th) => { const [ax, az] = loc(fr, a[0], a[2]), [bx, bz] = loc(fr, b[0], b[2]); steelBoxes.push(beam([ax, a[1], az], [bx, b[1], bz], th)); };

    // --- main wall (tall, along the outer roof line pulled in by the roof overhang)
    const FAC = resample(FAC_TALL, 6);
    {
      const prof = () => [[-3, 0], [1.2, 0], [1.2, 7], [0, 7], [0, FAC_H - 8], [1.6, FAC_H - 8], [1.6, FAC_H], [-3, FAC_H]];
      ctx.add(sweepSolid(FAC.pts, FAC.nr, prof, [-1, 1, 1, 0, 1, 1, 1, 0], 1), [mBrick, mCream]);
      // second precast band (mid height) and base string course
      const band = (y0, y1, o) => ctx.add(sweepSolid(FAC.pts, FAC.nr, () => [[-0.2, y0], [-0.2, y1], [o, y1], [o, y0]], [1, 1, 1, 1], 1), [mBrick, mCream]);
      // real profile bands: sill course, string course with drip, stepped cornice under the roof
      const course = (pts) => ctx.add(sweepSolid(FAC.pts, FAC.nr, () => pts, pts.map(() => 1), 1), [mBrick, mCream]);
      course([[-0.2, 33.2], [-0.2, 34], [1.7, 34], [1.7, 35.1], [0.9, 35.6], [0.9, 36.6], [-0.2, 36.6]]);
      course([[-0.2, 21.4], [1.3, 21.4], [1.3, 22.6], [-0.2, 22.6]]);
      course([[-0.2, FAC_H - 7], [2.4, FAC_H - 7], [2.4, FAC_H - 5.6], [3.4, FAC_H - 5.6], [3.4, FAC_H - 3.4], [4.6, FAC_H - 3.4], [4.6, FAC_H - 0.6], [3, FAC_H - 0.6], [3, FAC_H + 0.8], [-0.2, FAC_H + 0.8]]);
    }
    const gates = GATE_S.map((f) => f * FAC.L);
    const nearGate = (s, pad) => gates.some((g) => Math.abs(s - g) < pad);
    // stair towers (between the gates, glazed face with stair flights) and ramp towers at both roof ends
    const stairs = [0.16, 0.385, 0.615, 0.84].map((f) => f * FAC.L);
    stairs.forEach((ss) => {
      const fr = frameAt(FAC, ss);
      put(brickB, fr, 0, 46, 9, 22, 92, 18);
      put(creamB, fr, 0, 94.2, 9, 26, 4.4, 22);
      put(creamB, fr, 0, 90, 9, 23.4, 2, 19.4);
      put(creamB, fr, 0, 38, 9, 23.2, 2.2, 19.2);
      put(glassStair, fr, 0, 52, 18.15, 12, 62, 1);
      for (const sx of [-1, 1]) put(creamB, fr, sx * 9.8, 44, 18.1, 2.2, 88, 0.8);
    });
    for (const k of [0, FAC.pts.length - 1]) {
      const pt = FAC.pts[k], nr = FAC.nr[k], q = FAC.pts[k === 0 ? 1 : k - 1];
      let tx = pt[0] - q[0], tz = pt[1] - q[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;   // beyond the end of the wall
      const x = pt[0] + nr[0] * 4 + tx * 20, z = pt[1] + nr[1] * 4 + tz * 20;
      rampBody.push(mat4(x, 47, z, 18, 94, 18));
      rampCap.push(mat4(x, 95.5, z, 20.5, 4, 20.5), mat4(x, 62, z, 19.4, 3, 19.4), mat4(x, 30, z, 19.4, 3, 19.4));
    }
    // window bays: tall dark windows with arched heads, cream piers between
    {
      const piers = [];
      for (let s = 14; s < FAC.L - 10; s += 20) {
        if (nearGate(s, 82) || stairs.some((q) => Math.abs(s - q) < 17)) continue;
        const fr = frameAt(FAC, s);
        put(glassBay, fr, 0, 36, 0.45, 8.4, 30, 1);
        put(archP, fr, 0, 51, 0.45, 8.4, 8.4, 1);
        put(piers, fr, 10, 31, 0.5, 2.8, 56, 2.2);
        put(creamB, fr, 0, 22.5, 0.5, 9.6, 1.2, 1.4);              // sill band under each window
      }
      inst(new THREE.BoxGeometry(1, 1, 1), mCream, piers);
    }
    // gate pavilions
    gates.forEach((gs, gi) => {
      const fr = frameAt(FAC, gs);
      for (const sx of [-1, 1]) {
        put(brickB, fr, sx * 31, 49, 6, 22, 98, 20);                 // brick tower
        put(creamB, fr, sx * 31, 101.5, 6, 27, 5, 25);               // precast cap
        put(creamB, fr, sx * 31, 96, 6, 24.5, 2.4, 22.5);
        put(creamB, fr, sx * 31, 27, 6, 23.2, 2.4, 21.2);            // bands
        put(creamB, fr, sx * 31, 62, 6, 23.2, 2.4, 21.2);
        put(glassTwr, fr, sx * 31, 62, 16.2, 8.2, 30, 1);              // tall arched window
        put(archP, fr, sx * 31, 77, 16.2, 8.2, 8.2, 1);
        put(glassSm, fr, sx * 31, 36, 16.2, 6, 14, 1);
        put(creamB, fr, sx * 31 + sx * 12.5, 33, 6, 3, 66, 21);      // pilaster edge
        put(creamB, fr, sx * 62, 33, 1.2, 38, 66, 2.6);              // cream wall panel beside the tower
        put(creamB, fr, sx * 62, 68, 1.2, 40, 4, 3.4);
      }
      put(glassPortal, fr, 0, 21, 0.8, 38, 40, 1);                        // dark portal
      for (let k = -2; k <= 2; k++) { put(creamB, fr, k * 8.6, 7.4, 1.4, 7.8, 14.8, 0.7); put(glassPortal, fr, k * 8.6, 7, 1.9, 6.4, 13.4, 1); }   // entry doors
      // gate fence under the canopy front: pickets, rails, turnstile blocks in the middle opening
      for (let lx = -50; lx <= 50; lx += 3.4) if (Math.abs(lx) > 8) put(fenceB, fr, lx, 4.2, 30, 0.4, 8.4, 0.4);
      for (const sx of [-1, 1]) for (const y of [1.2, 7.6]) put(fenceB, fr, sx * 29, y, 30, 42, 0.5, 0.5);
      for (const k of [-1, 0, 1]) put(steelBoxes, fr, k * 4.5, 2.3, 29, 1.2, 4.6, 5);
      {
        const names = ['RIGHT FIELD GATE', '1ST BASE GATE', 'HOME GATE', '3RD BASE GATE', 'LEFT FIELD GATE'];
        const ptex = textTexture((g, w, h) => {
          g.fillStyle = '#2a3036'; g.fillRect(0, 0, w, h); g.strokeStyle = '#cfc4a3'; g.lineWidth = 4; g.strokeRect(4, 4, w - 8, h - 8);
          g.fillStyle = '#e4d9bc'; g.font = 'bold 40px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(names[gi], w / 2, h / 2 + 2);
        }, 512, 64);
        const pl = ctx.add(new THREE.PlaneGeometry(36, 4.5), new THREE.MeshBasicMaterial({ map: ptex, side: THREE.DoubleSide }));
        const [qx, qz] = loc(fr, 0, 27.3); pl.position.set(qx, 19.6, qz); pl.rotation.y = fr.ry;
      }
      // bridge: steel truss between the towers, arch beneath it
      for (const y of [58, 78]) putBeam(fr, [-20, y, 4], [20, y, 4], 1.8);
      for (let k = -3; k <= 3; k++) putBeam(fr, [k * 6.4, 58, 4], [k * 6.4, 78, 4], 0.9);
      for (let k = -3; k < 3; k++) { putBeam(fr, [k * 6.4, 58, 4], [(k + 1) * 6.4, 78, 4], 0.8); putBeam(fr, [k * 6.4, 78, 4], [(k + 1) * 6.4, 58, 4], 0.8); }
      { const [x, z] = loc(fr, 0, 4.4); tmp.position.set(x, 40, z); tmp.rotation.set(0, fr.ry, 0); tmp.scale.set(19, 19, 3); tmp.updateMatrix(); torusM.push(tmp.matrix.clone()); }
      // low steel entry canopy at ground level
      put(steelBoxes, fr, 0, 22, 14, 98, 1.6, 26);
      for (let k = -3; k <= 3; k++) put(steelBoxes, fr, k * 15, 11, 25, 1.6, 22, 1.6);
      putBeam(fr, [-49, 24, 1], [-49, 22, 27], 1.1); putBeam(fr, [49, 24, 1], [49, 22, 27], 1.1);
      if (gi === 2) {                                                // plain name sign above the home-plate gate
        const [x, z] = loc(fr, 0, -1.5);
        const tex = textTexture((g, w, h) => {
          g.fillStyle = '#1d2f3f'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e4d9bc'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12);
          g.fillStyle = '#e4d9bc'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 92px Rockwell, Georgia, serif'; g.fillText('TRUIST PARK', w / 2, h / 2 + 4);
        }, 1024, 160);
        const sgn = ctx.add(new THREE.PlaneGeometry(88, 13.75), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
        sgn.position.set(x, Y_OUT + 11, z); sgn.rotation.y = fr.ry;
        for (const sx of [-30, 30]) putBeam(fr, [sx, Y_OUT - 1, -1.5], [sx, Y_OUT + 5, -1.5], 1.2);
      }
    });
    inst(new THREE.BoxGeometry(1, 1, 1), mBrick, brickB);
    inst(new THREE.BoxGeometry(1, 1, 1), mCream, creamB);
    {
      const paneTex = (cols, rows, w, h) => textTexture((g, W, H) => {
        const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#4a6470'); gr.addColorStop(1, '#202b32'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        g.fillStyle = '#d5ccb0';                                         // mullions and transoms
        for (let c = 0; c <= cols; c++) g.fillRect(Math.min(W - 4, c * W / cols - 2), 0, 4, H);
        for (let r = 0; r <= rows; r++) g.fillRect(0, Math.min(H - 3, r * H / rows - 1.5), W, 3);
      }, w, h);
      const pm = (t) => new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide });
      const quad = new THREE.PlaneGeometry(1, 1);
      inst(quad, pm(paneTex(3, 9, 96, 256)), glassBay);
      inst(quad, pm(paneTex(3, 9, 96, 256)), glassTwr);
      inst(quad, pm(paneTex(2, 4, 64, 128)), glassSm);
      inst(quad, basic('#1d252a', { side: THREE.DoubleSide }), glassPortal);
      inst(quad, pm(textTexture((g, W, H) => {                          // stair tower glazing: dark glass with stair flights
        g.fillStyle = '#26323a'; g.fillRect(0, 0, W, H); g.strokeStyle = '#a9a28b'; g.lineWidth = 3;
        for (let k = 0; k < 6; k++) { const y0 = k * H / 6, up = k % 2 === 0; g.beginPath(); g.moveTo(up ? 6 : W - 6, y0 + H / 6); g.lineTo(up ? W - 6 : 6, y0); g.stroke(); g.fillStyle = '#cfc4a3'; g.fillRect(0, y0, W, 3); }
      }, 64, 192)), glassStair);
      const archTex = textTexture((g, W, H) => {
        g.fillStyle = '#26323a'; g.fillRect(0, 0, W, H); g.strokeStyle = '#d5ccb0'; g.lineWidth = 4;
        for (let k = 0; k <= 4; k++) { const an = Math.PI * k / 4; g.beginPath(); g.moveTo(W / 2, H / 2); g.lineTo(W / 2 - Math.cos(an) * W / 2, H / 2 - Math.sin(an) * H / 2); g.stroke(); }
        g.beginPath(); g.arc(W / 2, H / 2, W * 0.27, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(W / 2, H / 2, W / 2 - 2, Math.PI, 0); g.stroke();
      }, 128, 128);
      inst(new THREE.CircleGeometry(0.5, 14, 0, Math.PI), pm(archTex), archP);
      inst(new THREE.CylinderGeometry(1, 1, 1, 24), mBrick, rampBody);
      inst(new THREE.CylinderGeometry(1, 1, 1, 24), mCream, rampCap);
      inst(new THREE.BoxGeometry(1, 1, 1), basic('#15191b'), fenceB);
    }
    inst(new THREE.TorusGeometry(1, 0.075, 6, 20, Math.PI), mSteel, torusM);
    // ======================================================================================================
    // 7b. Facade returns at the roof ends, then the low outfield wall (brick over a metal base) that runs
    //     behind the outfield seats, with dark lattice towers that carry lamps and the two boards.
    // ======================================================================================================
    for (const [A, B] of [[ROOF_OUT[0], ROOF_IN[0]], [ROOF_OUT[ROOF_OUT.length - 1], ROOF_IN[ROOF_IN.length - 1]]]) {
      const dx = B[0] - A[0], dz = B[1] - A[1], len = Math.hypot(dx, dz);
      brickB.push(mat4((A[0] + B[0]) / 2, FAC_H / 2, (A[1] + B[1]) / 2, len, FAC_H, 3, Math.atan2(-dz, dx)));
      creamB.push(mat4((A[0] + B[0]) / 2, FAC_H + 1.5, (A[1] + B[1]) / 2, len + 1, 3, 5, Math.atan2(-dz, dx)));
    }
    const LOW = resample(LOW_WALL, 6);
    ctx.add(sweepSolid(LOW.pts, LOW.nr, () => [[-3, 0], [0.6, 0], [0.6, 14], [0, 14], [0, LOW_H - 3], [1.4, LOW_H - 3], [1.4, LOW_H], [-3, LOW_H]],
      [-1, 2, 1, 0, 1, 1, 1, 0], 0), [mBrick, mCream, mMetal]);
    {
      // black perimeter fence along the street side of the low brick wall (photo3), vertical bars on a transparent texture
      const fenceTex = rep(textTexture((g, w, h) => {
        g.fillStyle = '#14181a'; for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 2, h); g.fillRect(0, 0, w, 3); g.fillRect(0, h - 3, w, 3);
      }, 384, 24));
      fenceTex.repeat.set(1, 0.375);
      ctx.add(sweepSolid(LOW.pts, LOW.nr, () => [[27, 0], [27, 8], [27.2, 8], [27.2, 0]], [0, 0, 0, 0], 0),
        [new THREE.MeshLambertMaterial({ map: fenceTex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide })]);
    }
    {
      // pilasters every 40 ft on the long brick run
      const pil = [];
      for (let s = 20; s < LOW.L - 10; s += 40) { const fr = frameAt(LOW, s); put(pil, fr, 0, 24, 0.5, 3, 20, 1.6); }
      inst(new THREE.BoxGeometry(1, 1, 1), mCream, pil);
      // loading-dock style openings low on the metal base
      const dk = [];
      for (let s = 30; s < LOW.L - 10; s += 90) { const fr = frameAt(LOW, s); put(dk, fr, 0, 7, 0.9, 24, 9, 1); }
      inst(new THREE.BoxGeometry(1, 1, 1), basic('#262b2e'), dk);
    }
    const lattice = (x, z, h) => {
      const w = 4.6;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) steelBoxes.push(mat4(x + sx * w, h / 2, z + sz * w, 1.5, h, 1.5));
      for (let y = 8; y < h; y += 14) {
        for (const s of [-1, 1]) {
          steelBoxes.push(mat4(x, y, z + s * w, 2 * w, 1, 1), mat4(x + s * w, y, z, 1, 1, 2 * w));
          if (y + 14 < h) {
            steelBoxes.push(beam([x - w, y, z + s * w], [x + w, y + 14, z + s * w], 0.7), beam([x + s * w, y, z - w], [x + s * w, y + 14, z + w], 0.7));
          }
        }
      }
      const ang = Math.atan2(x, z);
      for (let k = 0; k < 3; k++) lightBoxes.push(mat4(x, h + 2 + k * 4.2, z, 21, 3.4, 2.6, ang));
    };
    for (const [x, z, h] of TOWERS) lattice(x, z, h);

    // ---------- 4. Main video board (center field, above the batter's eye) and the smaller left-center board
    {
      if (parts.scoreboard) ctx.remove(parts.scoreboard);
      const frame = lam('#33404a');
      const makeBoard = (x, z, yBase, bw, bh, tex) => {
        const y = yBase + bh / 2;
        const board = ctx.add(new THREE.BoxGeometry(bw, bh, 7), [frame, frame, frame, frame, new THREE.MeshBasicMaterial({ map: tex }), frame]);
        board.position.set(x, y, z); board.lookAt(0, y, 0);
        const crown = ctx.add(new THREE.BoxGeometry(bw + 6, 3.5, 9), lam('#e6dcc0'), board); crown.position.y = bh / 2 + 1.8;
        return board;
      };
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#1d2f3f'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#e6dcc0'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20);
        g.lineWidth = 3; g.strokeRect(28, 28, w - 56, h - 56);
        g.fillStyle = '#e6dcc0'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = 'bold 78px Rockwell, Georgia, serif'; g.fillText('TRUIST PARK', w * 0.5, 82);
        g.fillStyle = '#98533f'; g.fillRect(60, 130, w - 120, 6);
        const sx = 70, sy = 160, sw = w * 0.56, sh = h - 160 - 150;
        g.fillStyle = '#0f1a24'; g.fillRect(sx, sy, sw, sh);
        g.strokeStyle = '#6f8c8c'; g.lineWidth = 3; g.strokeRect(sx, sy, sw, sh);
        g.strokeStyle = 'rgba(230,220,192,0.55)'; g.lineWidth = 4;
        const cx = sx + sw / 2, cy = sy + sh * 0.5, dd = Math.min(sw, sh) * 0.32;
        g.beginPath(); g.moveTo(cx, cy + dd); g.lineTo(cx + dd, cy); g.lineTo(cx, cy - dd); g.lineTo(cx - dd, cy); g.closePath(); g.stroke();
        const lx = sx + sw + 40, cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'H', 'E'], cw = (w - lx - 60) / cols.length;
        g.fillStyle = '#e6dcc0'; g.font = 'bold 30px Rockwell, Georgia, serif';
        cols.forEach((c, i) => g.fillText(c, lx + cw * (i + 0.5), 190));
        ['AWAY', 'HOME'].forEach((t, row) => {
          const yy = 270 + row * 100; g.textAlign = 'left'; g.fillText(t, lx - 2, yy - 56); g.textAlign = 'center';
          cols.forEach((_, i) => { g.strokeStyle = '#e6dcc0'; g.lineWidth = 2; g.strokeRect(lx + cw * i + 4, yy - 34, cw - 8, 62); });
        });
        g.textAlign = 'center'; g.font = 'italic 30px Baskerville, Georgia, serif'; g.fillStyle = '#e6dcc0';
        g.fillText('Cobb County  ·  Opened 2017', w * 0.5, h - 70);
      }, 1536, 672);
      const MB = MAIN_BOARD;
      makeBoard(MB.x, MB.z, MB.y0, MB.w, MB.h, tex);
      // dark service stack under the board (floors seen from the street)
      const stackTex = rep(textTexture((g, w, h) => {
        g.fillStyle = '#434b51'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a3035'; g.fillRect(0, h - 5, w, 5); g.fillStyle = '#566068'; g.fillRect(0, 0, w, 3);
        g.fillStyle = '#242a2e'; for (let x = 4; x < w; x += 14) g.fillRect(x, 10, 9, 14);
      }, 64, 32));
      stackTex.repeat.set(10, 3);
      const stack = ctx.add(new THREE.BoxGeometry(MB.w - 10, MB.y0 - LOW_H + 4, 14), new THREE.MeshLambertMaterial({ map: stackTex }));
      stack.position.set(MB.x, (MB.y0 + LOW_H - 4) / 2, MB.z - 4);
      // second, smaller board in left-center: dark LED face
      const SB = SECOND_BOARD;
      const tex2 = textTexture((g, w, h) => {
        g.fillStyle = '#1a2128'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6f8c8c'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
        g.fillStyle = '#26333b'; g.fillRect(24, 24, w * 0.62, h - 48);
        g.fillStyle = '#c9bd9f'; for (let i = 0; i < 5; i++) g.fillRect(w * 0.68 + 20, 34 + i * ((h - 68) / 5), w * 0.3 - 40, 8);
      }, 768, 352);
      makeBoard(SB.x, SB.z, SB.y0, SB.w, SB.h, tex2);
      const post = (x, z, y0, y1) => steelBoxes.push(mat4(x, (y0 + y1) / 2, z, 4, y1 - y0, 4));
      post(SB.x - SB.w * 0.38, SB.z - 3, LOW_H, SB.y0); post(SB.x + SB.w * 0.38, SB.z - 3, LOW_H, SB.y0);
    }

    // ======================================================================================================
    // 6. SEATING BOWL (rebuilt). Depth changes around the bowl: lower bowl 52 ft deep behind home, 102 ft on the
    //    baselines (sheet: seats end at z~+105 behind home; ~115 ft to the roof edge on the sides). Lower bowl has a
    //    cross-aisle; behind it a club tier and glass band, a cream spandrel, a suite glass band (a wider press-level
    //    glass box behind home), then the upper deck in two tiers split by a cross-aisle. Upper deck depth follows the
    //    distance to the measured facade line. Heights/levels: Clem's Baseball (33 / 19 / 13+12 rows).
    // ======================================================================================================
    const BOWL = {};
    {
      if (parts.lowerDeck) ctx.remove(parts.lowerDeck);
      if (parts.upperDeck) ctx.remove(parts.upperDeck);
      const sm = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
      const rayHit = (p, nn, poly) => {
        let best = Infinity;
        for (let k = 0; k < poly.length - 1; k++) {
          const a = poly[k], b = poly[k + 1], ex = b[0] - a[0], ez = b[1] - a[1], den = nn[0] * ez - nn[1] * ex;
          if (Math.abs(den) < 1e-9) continue;
          const wx = a[0] - p[0], wz = a[1] - p[1], u = (wx * ez - wz * ex) / den, v = (wx * nn[1] - wz * nn[0]) / den;
          if (u > 0 && v >= 0 && v <= 1 && u < best) best = u;
        }
        return best;
      };
      const raw = bPts.map((p, i) => { const h = rayHit(p, bN[i], FAC_TALL); return isFinite(h) ? h : 215; });
      const dFac = raw.map((_, i) => { let s = 0, c = 0; for (let k = -4; k <= 4; k++) if (raw[i + k] != null) { s += raw[i + k]; c++; } return s / c; });
      const P = bPts.map((_, i) => {
        const e = sm(0.05, 0.5, Math.abs(2 * (i / N1) - 1));
        const dLow = 52 + 50 * e, lowTop = 22 + 11.5 * e;
        const dA = 0.56 * dLow, hA = 3.5 + (lowTop - 3.5) * 0.5;
        const d0U = dLow - 6, dG = dLow + 5, h0U = lowTop + 36;
        const hCap = 98, dUp = clamp(Math.min(dFac[i] - 24 - d0U, (hCap - h0U) / 0.5), 46, 90);
        const hTop = Math.min(hCap, h0U + 0.5 * dUp), t1 = 0.52 * dUp, r1 = (hTop - h0U) * 0.44;
        return { dLow, lowTop, dA, hA, d0U, dG, h0U, dUp, hTop, t1, r1, aw: 6 };
      });
      BOWL.P = P;
      const glassTex = (base, top, mull, bays) => {
        const t = textTexture((g, w, h) => {
          const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(1, base);
          g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = mull;
          for (let k = 0; k < bays; k++) g.fillRect(k * w / bays, 0, 3, h);
          g.fillRect(0, 0, w, 4); g.fillRect(0, h - 4, w, 4);
        }, 128, 64);
        t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 0.3); return t;
      };
      const gm = (tex) => new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide });
      const mats = [M[MAT.SEAT], M[MAT.CREAM], M[MAT.SHADE], M[MAT.FACADE],
        gm(glassTex('#4b6978', '#7fa0ad', '#d5ccb0', 4)),    // 4 club glass
        gm(glassTex('#27363f', '#3f5764', '#b9b196', 3)),    // 5 suite glass
        gm(glassTex('#566f7c', '#8aa6b0', '#e0d7bb', 6)),    // 6 press glass
        M[MAT.WALL]];
      const SEATi = 0, CREAMi = 1, SHADEi = 2, FACi = 3, GC = 4, GS = 5, GP = 6, WALLi = 7;
      // lower bowl with cross-aisle (all the way round)
      const [lp, ln] = tools.cut(0, 1);
      ctx.add(sweepSolid(lp, ln, (i) => { const q = P[i]; return [[0, 0], [0, 3.5], [q.dA, q.hA], [q.dA + 7, q.hA], [q.dLow, q.lowTop], [q.dLow, 0]]; },
        [WALLi, SEATi, CREAMi, SEATi, FACi, -1], FACi), mats);
      // club tier, glass bands, upper deck in one solid (t 0.03 .. 0.97)
      const [up, un, ua] = tools.cut(0.03, 0.97);
      ctx.add(sweepSolid(up, un, (k) => {
        const q = P[ua + k], dB = q.d0U + q.dUp, dT1 = q.d0U + q.t1;
        return [[q.dLow - 2, 0], [dB, 0], [dB, q.hTop], [dT1 + q.aw, q.h0U + q.r1], [dT1, q.h0U + q.r1], [q.d0U, q.h0U], [q.d0U, q.h0U - 7],
          [q.dG, q.h0U - 7], [q.dG, q.lowTop + 19], [q.dG, q.lowTop + 16], [q.dG, q.lowTop + 4], [q.dLow - 2, q.lowTop - 1]];
      }, [-1, FACi, SEATi, CREAMi, SEATi, CREAMi, SHADEi, GS, CREAMi, GC, SEATi, -1], FACi), mats);
      // press level: wider glass box in front of the suite band, behind home plate
      const [pp, pn, pa] = tools.cut(0.4, 0.6);
      ctx.add(sweepSolid(pp, pn, (k) => { const q = P[pa + k]; return [[q.dG - 7, q.lowTop + 17], [q.dG - 7, q.lowTop + 28], [q.dG + 0.5, q.lowTop + 28], [q.dG + 0.5, q.lowTop + 17]]; },
        [GP, CREAMi, -1, -1], CREAMi), mats);

      // surface height of the bowl at offset d (lower bowl and upper deck), station q
      const hLow = (q, d) => d <= q.dA ? 3.5 + (q.hA - 3.5) * d / q.dA : d <= q.dA + 7 ? q.hA : q.hA + (q.lowTop - q.hA) * (d - q.dA - 7) / (q.dLow - q.dA - 7);
      BOWL.hLow = hLow;
      // section aisles: light strips every ~22 ft of arc, in each tier (instanced). Spacing counted on the sheets.
      const aisleM = [], tunM = [];
      const stripM = (pt, nn, d0, d1, h0, h1, w) => {
        const dd = d1 - d0, dh = h1 - h0, L = Math.hypot(dd, dh);
        const S = new THREE.Vector3(nn[0] * dd / L, dh / L, nn[1] * dd / L), T = new THREE.Vector3(nn[1], 0, -nn[0]);
        const Y = new THREE.Vector3().crossVectors(S, T);
        const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(T, Y, S));
        const dm = (d0 + d1) / 2, hm = (h0 + h1) / 2 + 0.18;
        return new THREE.Matrix4().compose(new THREE.Vector3(pt[0] + nn[0] * dm, hm, pt[1] + nn[1] * dm), q, new THREE.Vector3(w, 0.3, L));
      };
      let run = 11, a = 0;
      for (let i = 1; i <= N1; i++) {
        run += Math.hypot(bPts[i][0] - bPts[i - 1][0], bPts[i][1] - bPts[i - 1][1]);
        if (run < 22) continue; run -= 22; a++;
        const q = P[i], pt = bPts[i], nn = bN[i];
        aisleM.push(stripM(pt, nn, 3, q.dA - 1, hLow(q, 3), hLow(q, q.dA - 1), 1.7));
        aisleM.push(stripM(pt, nn, q.dA + 8, q.dLow - 1, hLow(q, q.dA + 8), hLow(q, q.dLow - 1), 1.7));
        if (i / N1 > 0.035 && i / N1 < 0.965) {
          const dT1 = q.d0U + q.t1;
          aisleM.push(stripM(pt, nn, q.d0U + 1.5, dT1 - 1, q.h0U + 0.4 * 1.5, q.h0U + q.r1 - 0.2, 1.7));
          aisleM.push(stripM(pt, nn, dT1 + q.aw + 1, q.d0U + q.dUp - 1, q.h0U + q.r1 + 0.3, q.hTop - 0.3, 1.7));
          if (a % 2 === 0) {                                  // entry tunnels at the cross-aisles
            tunM.push(mat4(pt[0] + nn[0] * (q.dA + 8.4), q.hA + 3.2, pt[1] + nn[1] * (q.dA + 8.4), 7, 6.6, 3, Math.atan2(nn[0], nn[1])));
            tunM.push(mat4(pt[0] + nn[0] * (dT1 + q.aw + 1.2), q.h0U + q.r1 + 3.2, pt[1] + nn[1] * (dT1 + q.aw + 1.2), 7, 6.6, 3, Math.atan2(nn[0], nn[1])));
          }
        }
      }
      // outfield seat aisles (left span full, right span up to the bullpens)
      const ofAisle = (a0, a1) => {
        const [wp, wn, wd] = tools.span(a0, a1); let r2 = 8;
        for (let k = 1; k < wp.length; k++) {
          r2 += Math.hypot(wp[k][0] - wp[k - 1][0], wp[k][1] - wp[k - 1][1]);
          if (r2 < 21) continue; r2 -= 21;
          const hw = wallH(spec, wd[k]);
          aisleM.push(stripM(wp[k], wn[k], 6, 4 + 66, hw + 3 + 0.42 * 2, hw + 3 + 0.42 * 66, 1.7));
        }
      };
      ofAisle(-44.5, -6); ofAisle(10, 19.5);
      inst(new THREE.BoxGeometry(1, 1, 1), basic('#d9cfae'), aisleM);
      inst(new THREE.BoxGeometry(1, 1, 1), basic('#161b1d'), tunM);
      BOWL.aisles = a;

      // stock camera stops that sat inside the old generic deck
      const dirTo = (pos, look) => new THREE.Vector3(...look).sub(new THREE.Vector3(...pos)).normalize();
      const ib = Math.round(0.5 * N1), iu = Math.round(0.6 * N1), qb = P[ib], qu = P[iu];
      views.pressbox.pos = [bPts[ib][0] + bN[ib][0] * (qb.d0U + 5), qb.h0U + 0.42 * 5 + 5.5, bPts[ib][1] + bN[ib][1] * (qb.d0U + 5)];
      views.pressbox.dir = dirTo(views.pressbox.pos, views.pressbox.look);
      const du = qu.d0U + qu.t1 * 0.6;
      views.upper.pos = [bPts[iu][0] + bN[iu][0] * du, qu.h0U + qu.r1 * 0.6 + 5.5, bPts[iu][1] + bN[iu][1] * du];
      views.upper.dir = dirTo(views.upper.pos, views.upper.look);
    }

    // ---------- 8. The Battery Atlanta: simple muted blocks beyond right and center field
    {
      const winTex = (rep, base, win) => { const t = textTexture((g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); g.fillStyle = win; for (let y = 6; y < h; y += 16) for (let x = 5; x < w; x += 16) g.fillRect(x, y, 9, 8); }, 128, 128); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); return t; };
      const bld = (deg, rOut, w, d, h, base, win, rep) => {
        const a = deg * D2R, r = rOut;
        const mat = new THREE.MeshLambertMaterial({ map: winTex(rep, base, win) });
        const m = ctx.add(new THREE.BoxGeometry(w, h, d), mat);
        m.position.set(r * Math.sin(a), h / 2, -r * Math.cos(a)); m.rotation.y = -a; return m;
      };
      bld(33, 530, 64, 96, 150, '#8f9ba3', '#4f5f69', [4, 9]);     // hotel tower
      bld(12, 620, 150, 80, 176, '#b0a592', '#5b5d5e', [8, 11]);   // office building
      bld(-7, 650, 110, 70, 96, '#a8826b', '#4a3c33', [6, 6]);     // residential, brick
      bld(21, 520, 90, 40, 38, '#b79a7d', '#4a3c33', [5, 2]);      // low retail
      bld(44, 480, 70, 50, 52, '#9d8a74', '#4a3c33', [4, 3]);
      bld(51, 450, 56, 44, 34, '#b79a7d', '#4a3c33', [3, 2]);
      bld(2, 575, 70, 40, 30, '#9c9382', '#4a3c33', [4, 2]);       // low block behind center field
    }


    // ======================================================================================================
    // 9. FIELD LEVEL: dugouts, backstop net, bullpens (right-center, beyond the wall), wall panels and boards, poles
    // ======================================================================================================
    {
      const nearest = (x, z) => { let bi = 0, bd = 1e9; bPts.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - z); if (d < bd) { bd = d; bi = i; } }); return bi; };
      // ---- dugouts: measured on zone_home at (+93,-23) first-base (home) side and (-94,-23) third-base side, ~62 ft long
      const dBox = [], dSlab = [], dOpen = [];
      let dugI = [];
      for (const sx of [1, -1]) {
        const i = nearest(sx * 93, -23); dugI.push(i);
        const pt = bPts[i], nn = bN[i], ry = Math.atan2(nn[0], nn[1]);
        const cd = 4.25, cx = pt[0] + nn[0] * cd, cz = pt[1] + nn[1] * cd;
        dBox.push(mat4(cx, 3.7, cz, 62, 7.4, 13.5, ry));
        dSlab.push(mat4(cx, 7.6, cz, 64, 0.9, 15.5, ry));
        const fx = pt[0] - nn[0] * 2.6, fz = pt[1] - nn[1] * 2.6;
        dOpen.push(mat4(fx, 2.5, fz, 55, 4, 1, Math.atan2(-nn[0], -nn[1])));
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#c9bf9f'), dBox);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#8d6a52'), dSlab);
      inst(new THREE.PlaneGeometry(1, 1), basic('#12171a', { side: THREE.DoubleSide }), dOpen);

      // ---- backstop net between the dugouts, with posts every ~13 ft (outside the foul lines)
      {
        const i0n = Math.min(dugI[0], dugI[1]), i1n = Math.max(dugI[0], dugI[1]);
        const [np, nn2] = [bPts.slice(i0n, i1n + 1), bN.slice(i0n, i1n + 1)];
        const netTex = textTexture((g, w, h) => {
          g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(30,34,36,0.85)'; g.lineWidth = 2;
          for (let x = 0; x < w; x += w / 6) { g.beginPath(); g.moveTo(x + 1, 0); g.lineTo(x + 1, h); g.stroke(); }
          g.beginPath(); g.moveTo(0, 1); g.lineTo(w, 1); g.stroke();
        }, 96, 24);
        netTex.wrapS = netTex.wrapT = THREE.RepeatWrapping; netTex.repeat.set(1, 0.2);
        const mNet = new THREE.MeshBasicMaterial({ map: netTex, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide });
        ctx.add(sweepSolid(np, nn2, () => [[1, 5], [1, 29], [1.15, 29], [1.15, 5]], [0, 0, 0, 0], 0), [mNet]);
        const posts = []; let run = 0;
        for (let k = 0; k < np.length; k++) {
          if (k) run += Math.hypot(np[k][0] - np[k - 1][0], np[k][1] - np[k - 1][1]);
          if (k === 0 || k === np.length - 1 || run >= 13) { if (k && k < np.length - 1) run = 0; posts.push(mat4(np[k][0] + nn2[k][0] * 1.2, 16, np[k][1] + nn2[k][1] * 1.2, 0.9, 32, 0.9)); }
        }
        inst(new THREE.BoxGeometry(1, 1, 1), lam('#2b3237'), posts);
      }

      // ---- foul poles: yellow, taller (photos 1 and 11 show them clearing the upper seats)
      parts.poles.forEach((pl) => { pl.scale.y = 1.35; pl.position.y = 40.5; pl.material = lam('#d6bb45'); });

      // ---- right-center bullpens beyond the wall (atlanta.com: "right-center field area, beyond the outfield wall")
      {
        const A0 = 19.5, A1 = 32.5, AM = 26;
        const degIdx = (d) => Math.round((d + 45) / 0.5);
        if (parts.outfieldSeats[1]) ctx.remove(parts.outfieldSeats[1]);
        const [sp, sn, sd] = tools.span(9.5, A0);
        ctx.add(sweepSolid(sp, sn, (i) => { const hw = wallH(spec, sd[i]); return [[1.2, 0], [1.2, hw + 3], [4, hw + 3], [4 + 68, hw + 3 + 0.42 * 68], [4 + 68, 0]]; }, [MAT.WALL, MAT.CREAM, MAT.SEAT, MAT.FACADE, -1], MAT.FACADE), M);
        const [p, n, dg] = tools.span(A0, A1);
        ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 0.4], [30, 0.4], [30, 0]], [0, 0, 0, -1], 0), [lam('#78854f')]);          // pen floor
        ctx.add(sweepSolid(p, n, () => [[29.5, 0], [29.5, 9], [31, 9], [31, 0]], [MAT.FACADE, MAT.CREAM, MAT.FACADE, -1], MAT.FACADE), M);  // rear wall
        ctx.add(sweepSolid(p, n, () => [[30.5, 0], [30.5, 13], [33, 13], [33 + 42, 13 + 0.45 * 42], [75, 0]], [MAT.WALL, MAT.CREAM, MAT.SEAT, MAT.FACADE, -1], MAT.FACADE), M); // seats behind the pens
        // dividing walls at both ends and between the two pens
        const divs = [], mounds = [], plates = [], benches = [];
        for (const dd of [A0, AM, A1]) {
          const k = degIdx(dd), q = wallPts[k], nn = wallN[k], ry = Math.atan2(nn[0], nn[1]);
          divs.push(mat4(q[0] + nn[0] * 15.6, 3.6, q[1] + nn[1] * 15.6, 1.2, 7.2, 28.8, ry));
        }
        for (const [dc, dl] of [[22.75, 1], [29.25, 1]]) {
          for (const off of [-1.6, 1.6]) {
            const k = degIdx(dc + off), q = wallPts[k], nn = wallN[k];
            mounds.push(mat4(q[0] + nn[0] * 21, 0.7, q[1] + nn[1] * 21, 2.4, 1, 2.4, 0));
            plates.push(mat4(q[0] + nn[0] * 3.4, 0.5, q[1] + nn[1] * 3.4, 1.3, 0.2, 1.3, Math.atan2(nn[0], nn[1])));
          }
          const kb = degIdx(dc), qb = wallPts[kb], nb = wallN[kb];
          benches.push(mat4(qb[0] + nb[0] * 26.5, 1.4, qb[1] + nb[1] * 26.5, 14, 2.8, 2.4, Math.atan2(nb[1], -nb[0])));
        }
        inst(new THREE.BoxGeometry(1, 1, 1), lam('#c9bf9f'), divs);
        inst(new THREE.CylinderGeometry(1, 1.9, 1, 14), lam('#a98660'), mounds);
        inst(new THREE.BoxGeometry(1, 1, 1), basic('#f2ecd8'), plates);
        inst(new THREE.BoxGeometry(1, 1, 1), lam('#5d4a38'), benches);
      }

      // ---- wall panels (muted, blank slots, no marks) along the face of the outfield wall; one board right of the eye
      {
        const pal = ['#6f3a33', '#2f4a5e', '#c9bf9d', '#3f5a46', '#8d7a52', '#545f69', '#4c3b5a'];
        const geo = new THREE.PlaneGeometry(1, 1), panels = [], slots = [], cols = [];
        const wallFace = (k0, k1, color, hFrac) => {
          const a = wallPts[k0], b = wallPts[k1], ex = b[0] - a[0], ez = b[1] - a[1], len = Math.hypot(ex, ez);
          let nx = ez / len, nz = -ex / len; if (nx * a[0] + nz * (a[1] + 170) > 0) { nx = -nx; nz = -nz; }   // face the field
          const mx = (a[0] + b[0]) / 2 + nx * 0.2, mz = (a[1] + b[1]) / 2 + nz * 0.2, hw = Math.min(wallH(spec, wallDeg[k0]), wallH(spec, wallDeg[k1]));
          const h = Math.max(2.4, hw * hFrac), ry = Math.atan2(nx, nz);
          return { mx, mz, h, len, ry, hw };
        };
        let ci = 0;
        for (const [d0g, d1g] of [[-44.5, -6.5], [10.5, 32.5]]) {
          const ka = Math.round((d0g + 45) / 0.5), kb = Math.round((d1g + 45) / 0.5);
          for (let k = ka; k + 6 <= kb; k += 7) {
            const f = wallFace(k, k + 7, 0, 0.78); const c = new THREE.Color(pal[ci++ % pal.length]);
            panels.push(mat4(f.mx, f.hw * 0.5 + 0.2, f.mz, f.len - 1.2, f.h, 1, f.ry)); cols.push(c);
            slots.push(mat4(f.mx, f.hw * 0.5 + 0.2, f.mz, (f.len - 1.2) * 0.62, f.h * 0.42, 1, f.ry));
          }
        }
        const im = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), panels.length);
        panels.forEach((m, i) => { im.setMatrixAt(i, m); im.setColorAt(i, cols[i]); }); G.add(im);
        inst(geo, basic('#1c2328', { side: THREE.DoubleSide }), slots.map((m) => m.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, 0.12))));
        // board in the wall right of the batter's eye (photo10): muted brick-red panel with blank slots and a small dark display
        const k0 = Math.round((10.6 + 45) / 0.5), k1 = Math.round((19 + 45) / 0.5);
        const f = wallFace(k0, k1, 0, 1);
        const bt = textTexture((g, w, h) => {
          g.fillStyle = '#7a3d34'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e0d5b5'; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10);
          g.fillStyle = '#1c2328'; g.fillRect(w * 0.06, h * 0.2, w * 0.5, h * 0.6); g.fillRect(w * 0.6, h * 0.2, w * 0.15, h * 0.6); g.fillRect(w * 0.79, h * 0.2, w * 0.15, h * 0.6);
          g.strokeStyle = '#8f8a78'; g.lineWidth = 3; g.strokeRect(w * 0.06, h * 0.2, w * 0.5, h * 0.6);
        }, 512, 96);
        const bd = ctx.add(new THREE.PlaneGeometry(f.len - 2, 8.2), new THREE.MeshBasicMaterial({ map: bt, side: THREE.DoubleSide }));
        bd.position.set(f.mx, 4.9, f.mz); bd.rotation.y = f.ry;
        const strip2 = ctx.add(new THREE.PlaneGeometry(f.len - 2, 2.2), new THREE.MeshBasicMaterial({ color: '#141a1e', side: THREE.DoubleSide }));
        strip2.position.set(f.mx + Math.sin(f.ry) * 0.05, 9.6, f.mz + Math.cos(f.ry) * 0.05); strip2.rotation.y = f.ry;
      }
    }

    // ---------- instanced steel frame, lamp banks
    inst(new THREE.BoxGeometry(1, 1, 1), lam('#3b4147'), steelBoxes);
    inst(new THREE.BoxGeometry(1, 1, 1), basic('#fff1bd'), lightBoxes);

    // ---------- camera stops
    {
      const gf = frameAt(FAC, gates[2]);
      const lf = frameAt(FAC, gates[4]);
      const gp = loc(gf, 0, 175), lp = loc(lf, 0, 175);
      views.gate = { pos: [gp[0], 34, gp[1]], look: [gf.x, 62, gf.z], label: 'Home Gate' };
      views.lfgate = { pos: [lp[0] + 40, 30, lp[1]], look: [lf.x, 62, lf.z], label: 'Left Field Gate' };
      views.canopy = { pos: [-150, 44, -120], look: [200, 118, 70], label: 'Canopy' };
    }
  },
};
