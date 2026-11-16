// Detail module: Sutter Health Park, West Sacramento (Athletics' temporary home; Raley Field 2000-2019). Units: feet.
// LEVEL 4 (photographs + satellite sheet). Sheet = /home/claude/refs/ATH/survey.png (1.1 px/ft, home plate at the origin,
// the axis turned ~2.5 deg so both foul poles come out symmetric). Photos = /home/claude/refs/ATH/photo1..7.
//
// MEASURED (satellite sheet)
//  - Outfield wall (outer edge of the warning track): LF pole (-233,-233), arc through (-213,-288) (-167,-341) (-98,-384),
//    CF run z -405..-397, then (47,-399) -> (176,-317) corner -> (214,-246) -> RF pole ~(223,-223).
//  - Seat-front line: the generic foul boundary (foulScale 0.7, backstop 58) lies on the dirt edge of the sheet within ~5 ft on
//    both sides (checked with an overlay); behind home the real seat front is ~60 ft from the plate.
//  - Seat back (inner edge of the concourse band) traced on the sheet and ray-cast from the bowl path along its normals
//    (bowl depth, ft, at t = 0 RF end ... 1 LF end): 1B side 66 (t .14) -> 78 (.18) -> 83 (.27) -> 91 (.36, deepest);
//    behind home 66-72 (.45-.55); 3B side 75 (.6) -> 65 (.73) -> 56 (.82) -> 46 (.86) -> 22 (.91). Seats end at t ~0.10 (RF,
//    z ~ -165) and t ~0.93 (LF, z ~ -190). Sheet error about +-8 ft.
//  - Facade outer line (OUT), roof bands, 1B green-roof building (gray strip x 185..265, z -120..0 on the sheet), buildings
//    behind LF/CF, and the structure behind CF at x -90..-45, z -495..-405 (read here as the rear of the main scoreboard
//    tower: its 45 ft width equals the tower frame width measured in photo 4).
// MEASURED (photographs; known size in the same plane)
//  - Photo 4 (old board, c.2015): CF wall, 8 ft, gives ~5.6 px/ft in the 4x crop; tower frame 265 px = 47 ft wide, frame top to
//    base ~85 ft, ornament on top ~9 ft more, screen field ~45 ft, blank lower panel ~27 ft; catwalks at the screen top and bottom.
//  - Photo 2: the gate fence (8 ft) gives 8.7 px/ft: brick gate piers ~25 ft, sign truss top ~37 ft, letters ~8 ft tall.
//  - Photo 1: with the 25 ft piers as scale (3.4 px/ft): cream facade parapet ~36-38 ft, brick clock-tower shaft ~45 ft (cage and
//    cap to ~66 ft), pavilion eave ~16 ft and hip-roof ridge ~24 ft, light pole ~95 ft (also ~90 ft in photo 4 against the wall).
//  - Photo 3: open concourse at the back of the seat bowl (columns, ~14 ft story), cream suite/fascia band with a window ribbon
//    above it, flat roofs; one cross-aisle (green wall) splits the bowl; photo 7 (2024, top-down) gives the seat sections.
//  - Shadows (sheet): the lamp-bank shadow of the RF-corner light tower is ~132 ft long; with the pole ~95 ft the ratio is
//    ~1.4 (sun ~35 deg, shadows fall toward WNW). The roof band of the CF building (30 ft wide shadow band) then gives ~23 ft.
// FROM TEXT (Wikipedia, Clem's Baseball, MLB.com): 330 / 403 / 325 posted, backstop 58 ft, 10,600 fixed seats plus grass berms
//  (Toyota Home Run Hill) behind the RF wall, 75 x 32 ft main display in right-center (2025 upgrade, replaces the old board),
//  ribbon board, backstop LED display, open-air Gilt-Edge lounge, rooftop group space in home run territory.
// STILL ESTIMATED: seat-row rise (slope 0.30, 1.0 ft per 3.3 ft tread; rows cannot be counted in the photos), inner roof
//  height (concourse floor + 20 ft), pavilion/1B green roof heights, the other five light towers, all colors, board sizes of the
//  RC 75x32 board (text only; shown beside the photographed tower, only one of the two exists at a time), flagpole heights.
// No logos; plain ballpark name only on the roof sign truss over the home gate (as on the real facade).
const D2R = Math.PI / 180;

// outfield wall, LF pole -> RF pole [x, z]
const WALL_XZ = [[-233, -233], [-226, -258], [-213, -288], [-195, -316], [-167, -341], [-131, -364], [-98, -384], [-55, -397],
  [0, -405], [47, -399], [95, -380], [138, -351], [176, -317], [200, -282], [214, -246], [223, -223]];
// facade (outer line of the concourse building), RF end -> behind home -> LF end
const OUT = [[312, -134], [286, -92], [261, -52], [240, -3], [221, 33], [200, 85], [170, 133], [121, 166], [60, 164], [0, 162],
  [-62, 160], [-105, 145], [-140, 117], [-165, 80], [-190, 38], [-215, 0], [-251, -61], [-270, -110], [-285, -160], [-272, -205]];
// light towers [x, z, base height, mast height]; the first is measured, the rest are estimates
const TOWERS = [[213, -190, 0, 95], [-243, -208, 0, 95], [262, -58, 30, 70], [-262, -62, 30, 70], [128, 150, 38, 62], [-130, 128, 38, 62]];
// bowl depth along the foul path (t 0 = RF end, .5 = home, 1 = LF end), ray-cast from the traced seat back
const LOWER_DEPTH = [[0, 60], [0.1, 60], [0.136, 66], [0.182, 78], [0.227, 82], [0.273, 83], [0.318, 85], [0.364, 91], [0.409, 88],
  [0.455, 72], [0.5, 66], [0.545, 73], [0.591, 74], [0.636, 75], [0.682, 70], [0.727, 65], [0.773, 62], [0.818, 56], [0.864, 46],
  [0.909, 32], [1, 32]];
const H = 38;            // facade parapet (photo 1)

export default {
  config() {
    const wall = WALL_XZ.map(([x, z]) => ({ deg: Math.atan2(x, -z) / D2R, r: Math.hypot(x, z), h: 8 }));
    wall[0].deg = -45; wall[wall.length - 1].deg = 45;
    return {
      wall,
      foulScale: 0.7,
      backstop: 58,
      lower: { depth: LOWER_DEPTH, slope: 0.30, extent: [0.1, 0.93] },
      hasUpper: false,
      outfield: { depth: 40, slope: 0.4, spans: [], eye: [-7.5, 7.5], eyeHeight: 30, eyeDepth: 12 },
      skip: { upperDeck: true, canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f5b4a', facade: '#9a5c44', wall: '#2f4a3b', cream: '#e6dcc0' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, C } = ctx;
    const { sweepSolid, textTexture, clamp } = tools;
    const { bPts, bN } = paths;
    const dA = dims.deckAt, N = bPts.length - 1;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, list) => {
      if (!list.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const beam = (a, b, th) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    const bg = (w, h, d) => { const g = new THREE.BoxGeometry(w, h, d); g.clearGroups(); return g; };   // one draw call per box
    const BOX = bg(1, 1, 1);
    const dbl = (m) => { m.side = THREE.DoubleSide; return m; };
    const brickC = '#8f5a46', stuccoC = '#d3c4a0', creamC = '#e6dcc0', roofC = '#d8d2c0', steelC = '#34463b', glassC = '#2b3a40';
    const patina = '#5f8272', darkC = '#2b332f';
    const mBrick = lam(brickC), mStucco = lam(stuccoC), mCream = lam(creamC), mSteel = lam(steelC), mDark = lam(darkC);

    // resample a polyline at roughly equal spacing; outward normals point away from a point behind the field
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
        if (nx * p[0] + nz * (p[1] + 120) < 0) { nx = -nx; nz = -nz; }
        return [nx, nz];
      });
      return { pts, nr };
    };
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
    const strip = (P, Q) => {                          // quad strip between two 3D polylines (Vector3 arrays)
      const pos = [];
      for (let i = 0; i < P.length - 1; i++) for (const p of [P[i], Q[i], Q[i + 1], P[i], Q[i + 1], P[i + 1]]) pos.push(p.x, p.y, p.z);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
    };
    const v3 = (p, y) => new THREE.Vector3(p[0], y, p[1]);
    // hip roof over a w x d rectangle (ridge along x), eave at y = 0, ridge at y = h, overhang ov
    const hipGeo = (w, d, h, ov) => {
      const W = w / 2 + ov, Dd = d / 2 + ov, r = Math.max(0, (w - d) / 2);
      const v = [[-W, 0, Dd], [W, 0, Dd], [W, 0, -Dd], [-W, 0, -Dd], [-r, h, 0], [r, h, 0]];
      const tri = [[0, 1, 5], [0, 5, 4], [1, 2, 5], [2, 3, 4], [2, 4, 5], [3, 0, 4]];
      const pos = []; for (const t of tri) for (const k of t) pos.push(...v[k]);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
    };
    // a board face texture: dark panel with a faint plain line grid (no marks)
    const gridTex = (base, line, nx, ny) => textTexture((g, w, h) => {
      g.fillStyle = base; g.fillRect(0, 0, w, h); g.strokeStyle = line; g.lineWidth = 1;
      for (let i = 1; i < nx; i++) { g.beginPath(); g.moveTo(i * w / nx, 0); g.lineTo(i * w / nx, h); g.stroke(); }
      for (let j = 1; j < ny; j++) { g.beginPath(); g.moveTo(0, j * h / ny); g.lineTo(w, j * h / ny); g.stroke(); }
      g.strokeStyle = '#3d4a45'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
    }, 256, 256);

    // ---- facade along the measured outer line (parapet 38 ft: photo 1)
    const FAC = resample(OUT, low ? 9 : 6);
    {
      ctx.add(sweepSolid(FAC.pts, FAC.nr, () => [[-3, 0], [0.4, 0], [0.4, 13], [-3, 13]], [-1, MAT.FACADE, -1, -1], MAT.FACADE), M);   // brick base
      ctx.add(sweepSolid(FAC.pts, FAC.nr, () => [[-0.2, 13], [1.4, 13], [1.4, 15], [-0.2, 15]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);   // string course
      // cream stucco upper wall, cornice and parapet
      ctx.add(sweepSolid(FAC.pts, FAC.nr, () => [[-3, 15], [0, 15], [0, H - 3], [-3, H - 3]], [-1, 0, -1, -1], 0), [mStucco]);
      ctx.add(sweepSolid(FAC.pts, FAC.nr, () => [[-3, H - 3], [2.2, H - 3], [2.2, H - 1], [0.6, H - 1], [0.6, H + 3.2], [-1, H + 3.2], [-1, H - 1], [-3, H - 1]], [0, 0, 0, 0, 0, 0, 0, 0], 0), [mCream]);
    }
    // piers, upper windows (y 20-34), ground-floor arched openings (instanced)
    {
      const piers = [], glass = [], sills = [], arches = [], archTops = [];
      let run = 0;
      for (let i = 0; i < FAC.pts.length - 1; i++) {
        const a = FAC.pts[i], b = FAC.pts[i + 1], seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
        run += seg;
        if (run < (low ? 26 : 17)) continue; run = 0;
        const nx = FAC.nr[i][0], nz = FAC.nr[i][1], ry = Math.atan2(nx, nz);
        piers.push(mat4(a[0] + nx * 0.6, 26, a[1] + nz * 0.6, 2.2, 22, 1.6, ry));
        const ux = (b[0] - a[0]) / seg, uz = (b[1] - a[1]) / seg;
        const mx = (a[0] + b[0]) / 2 - 8 * ux, mz = (a[1] + b[1]) / 2 - 8 * uz;
        glass.push(mat4(mx + nx * 0.5, 27, mz + nz * 0.5, 9, 13, 0.8, ry));
        sills.push(mat4(mx + nx * 0.9, 20, mz + nz * 0.9, 10.4, 1, 1.2, ry));
        if (!low) {
          arches.push(mat4(mx + nx * 0.55, 6.5, mz + nz * 0.55, 7, 9, 0.5, ry));
          archTops.push(mat4(mx + nx * 0.58, 11, mz + nz * 0.58, 3.5, 3.5, 1, ry));
        }
      }
      inst(BOX, mCream, piers); inst(BOX, new THREE.MeshBasicMaterial({ color: glassC }), glass); inst(BOX, mCream, sills);
      if (arches.length) {
        const archMat = new THREE.MeshBasicMaterial({ color: '#2a2f2c', side: THREE.DoubleSide });
        inst(BOX, archMat, arches);
        inst(new THREE.CircleGeometry(1, 10, 0, Math.PI), archMat, archTops);
      }
    }

    // ---- bowl back: open concourse (columns, 14 ft story), fascia with window ribbon, ribbon board, roof slabs
    {
      const Pin = [], Pout = [], Pmid = [], Pbk = [], LT = [], NN = [], TT = [];
      const i0 = Math.round(0.10 * N), i1 = Math.round(0.93 * N);
      for (let i = i0; i <= i1; i += 3) {
        const dd = dA.dL(i) + 0.5;
        const p = [bPts[i][0] + bN[i][0] * dd, bPts[i][1] + bN[i][1] * dd];
        const q = nearestOn(OUT, p);
        const out = (q[0] - p[0]) * bN[i][0] + (q[1] - p[1]) * bN[i][1];
        if (out < 12) continue;                                   // facade must lie outward of the seat back
        Pin.push(p); Pout.push(q); LT.push(dA.lowTop(i)); NN.push(bN[i]); TT.push(i / N);
        Pmid.push([p[0] + (q[0] - p[0]) * 0.62, p[1] + (q[1] - p[1]) * 0.62]);
        Pbk.push([p[0] + bN[i][0] * 9, p[1] + bN[i][1] * 9]);
      }
      const HIN = LT.map((l) => l + 20);                          // inner roof = concourse floor + 14 + 6 fascia
      const yv = (P, f) => P.map((p, k) => v3(p, f(k)));
      const cst = lam('#8d8a7c'), mfas = lam('#dfd3b0'), mgl = new THREE.MeshBasicMaterial({ color: glassC, side: THREE.DoubleSide });
      const mRib = new THREE.MeshBasicMaterial({ color: '#141b19', side: THREE.DoubleSide });
      // seat-back wall (below the concourse floor), recessed dark concourse back wall, concourse floor
      ctx.add(strip(yv(Pin, () => 0), yv(Pin, (k) => LT[k])), dbl(lam(stuccoC)));
      ctx.add(strip(yv(Pbk, (k) => LT[k]), yv(Pbk, (k) => LT[k] + 14)), dbl(lam('#323a35')));
      ctx.add(strip(yv(Pin, (k) => LT[k]), yv(Pbk, (k) => LT[k])), dbl(cst));
      // fascia above the concourse (cream), window ribbon, and the ribbon board over the middle of the bowl (blank, dark)
      ctx.add(strip(yv(Pin, (k) => LT[k] + 14), yv(Pin, (k) => HIN[k])), dbl(mfas));
      const win = [], rib = [];
      for (let k = 0; k < Pin.length; k++) (TT[k] > 0.22 && TT[k] < 0.78 ? rib : win).push(k);
      const runs = (ks) => { const r = []; let cur = []; ks.forEach((k, j) => { if (j && k !== ks[j - 1] + 1) { r.push(cur); cur = []; } cur.push(k); }); if (cur.length) r.push(cur); return r.filter((c) => c.length > 1); };
      for (const r of runs(win)) ctx.add(strip(r.map((k) => v3(NN[k].map((n, c) => Pin[k][c] + n * 0.25), LT[k] + 15.4)), r.map((k) => v3(NN[k].map((n, c) => Pin[k][c] + n * 0.25), LT[k] + 18.4))), mgl);
      for (const r of runs(rib)) ctx.add(strip(r.map((k) => v3(NN[k].map((n, c) => Pin[k][c] + n * 0.3), LT[k] + 14.8)), r.map((k) => v3(NN[k].map((n, c) => Pin[k][c] + n * 0.3), LT[k] + 18.8))), mRib);
      // roof slabs: inner (concourse + 20), step down, outer (34), parapet strip along the inner edge
      ctx.add(strip(yv(Pin, (k) => HIN[k]), yv(Pmid, (k) => HIN[k])), dbl(lam('#dcd5c2')));
      ctx.add(strip(yv(Pmid, (k) => HIN[k]), yv(Pmid, () => 34)), dbl(lam(stuccoC)));
      ctx.add(strip(yv(Pmid, () => 34), yv(Pout, () => 34)), dbl(lam('#d4cdb8')));
      ctx.add(strip(yv(Pin, (k) => HIN[k] + 2.6), yv(Pin, (k) => HIN[k])), dbl(lam(creamC)));
      // concourse columns
      const cols = [], step = low ? 4 : 2;
      for (let k = 0; k < Pin.length; k += step) cols.push(mat4(Pin[k][0] + NN[k][0] * 1, LT[k] + 7, Pin[k][1] + NN[k][1] * 1, 1.6, 14, 1.6));
      inst(BOX, mCream, cols);
      // rooftop mechanical boxes and solar arrays (instanced)
      const arrays = [], units = [];
      for (let k = 2; k < Pmid.length - 2; k += (low ? 4 : 2)) {
        const m = Pmid[k], n = Pout[k];
        const px = (m[0] + n[0]) / 2, pz = (m[1] + n[1]) / 2;
        const ang = Math.atan2(Pout[k][0] - Pin[k][0], Pout[k][1] - Pin[k][1]);
        if (k % 4 === 0) units.push(mat4(m[0] * 0.9 + Pin[k][0] * 0.1, HIN[k] + 3, m[1] * 0.9 + Pin[k][1] * 0.1, 8, 5, 8, ang));
        if (pz < 20 && px < -170) arrays.push(mat4(px, 35.3, pz, 18, 1.2, 10, ang));
      }
      inst(BOX, lam('#cfc7b1'), units); inst(BOX, lam('#2b3a4b'), arrays);

      // canopy over the Diamond Club behind home: thin slab on columns with a truss line underneath
      const A = [], B = [], ccols = [], tr = [];
      for (let i = Math.round(0.4 * N); i <= Math.round(0.6 * N); i += 2) {
        const dL = dA.dL(i);
        A.push(v3([bPts[i][0] + bN[i][0] * (dL + 4), bPts[i][1] + bN[i][1] * (dL + 4)], 56));
        B.push(v3([bPts[i][0] + bN[i][0] * (dL + 36), bPts[i][1] + bN[i][1] * (dL + 36)], 54));
      }
      ctx.add(strip(A, B), dbl(lam('#9fa7a3')));
      ctx.add(strip(A.map((p) => p.clone().setY(54.2)), B.map((p) => p.clone().setY(52.2))), dbl(lam('#4b5a55')));
      A.forEach((a, i) => {
        const b = B[i];
        if (i % (low ? 4 : 2) === 0) { ccols.push(beam([b.x, 36, b.z], [b.x, 53, b.z], 1.6)); tr.push(beam([a.x, 55, a.z], [b.x, 53, b.z], 1.1)); }
      });
      inst(BOX, mSteel, ccols); inst(BOX, mSteel, tr);
    }

    // ---- home gate: brick piers, green hip-roof entrance pavilion, roof sign truss with the plain name, clock tower (photos 1, 2)
    {
      const grp = (x, z, ry = 0) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; G.add(g); return g; };
      // pavilion: cream walls 82 x 40, eave 16, hip roof rise 8 (photo 1), three arched windows on the street face
      const pv = grp(50, 192);
      ctx.add(bg(82, 16, 40), mStucco, pv).position.y = 8;
      ctx.add(bg(84, 1.2, 42), mCream, pv).position.y = 16.4;
      const roof = ctx.add(hipGeo(82, 40, 8, 3), lam(patina), pv); roof.position.y = 17;
      if (!low) {
        const sh = new THREE.Shape(); sh.moveTo(-4.5, 0); sh.lineTo(-4.5, 8); sh.absarc(0, 8, 4.5, Math.PI, 0, true); sh.lineTo(4.5, 0); sh.closePath();
        const ag = new THREE.ShapeGeometry(sh); ag.clearGroups();
        const mG = new THREE.MeshBasicMaterial({ color: glassC, side: THREE.DoubleSide });
        const fr = new THREE.ShapeGeometry(sh); fr.scale(1.18, 1.1, 1);
        for (const x of [-24, 0, 24]) {
          const f = ctx.add(fr, mCream, pv); f.position.set(x, 1.5, 20.1);
          const w = ctx.add(ag, mG, pv); w.position.set(x, 2, 20.2);
        }
      }
      // brick gate piers either side of the pavilion, cream arch lintels back to the facade, dark iron gate leaves
      for (const x of [-8, 108]) {
        const g = grp(x, 168);
        ctx.add(bg(7, 25, 6), mBrick, g).position.y = 12.5;
        ctx.add(bg(8.4, 1.6, 7.4), mCream, g).position.y = 25.8;
        const gate = ctx.add(bg(15, 9, 0.5), mDark, g); gate.position.set(x < 50 ? 11 : -11, 4.5, 2.8);
      }
      // roof sign truss: two chords, posts, diagonals; the plain name on it (plane with letter texture)
      {
        const x0 = -26, x1 = 118, z = 163, y0 = H + 3.6, y1 = H + 12, parts = [];
        parts.push(beam([x0, y0, z], [x1, y0, z], 0.7), beam([x0, y1, z], [x1, y1, z], 0.7));
        const n = Math.round((x1 - x0) / 9);
        for (let k = 0; k <= n; k++) {
          const x = x0 + (x1 - x0) * k / n;
          parts.push(beam([x, y0, z], [x, y1, z], 0.5));
          if (k < n && !low) parts.push(beam([x, y0, z], [x0 + (x1 - x0) * (k + 1) / n, y1, z], 0.4));
          if (k % 2 === 0) parts.push(beam([x, H + 1, z], [x, y0, z], 0.5));
        }
        inst(BOX, mSteel, parts);
        const tex = textTexture((g, w, h) => {
          g.clearRect(0, 0, w, h); g.fillStyle = '#3f8191'; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.font = 'bold 190px Georgia, serif'; g.fillText('Sutter Health Park', w / 2, h / 2 + 10);
        }, 2048, 200);
        const pl = ctx.add(new THREE.PlaneGeometry(x1 - x0 - 6, 10), new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide }));
        pl.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 0.2, z + 2.4);
      }
      // clock tower: brick shaft 45 ft, open cage to 60, copper-green cap, plain cream clock faces (no emblem)
      {
        const t = grp(-128, 214);
        ctx.add(bg(12, 45, 12), mBrick, t).position.y = 22.5;
        ctx.add(bg(13.4, 1.6, 13.4), mCream, t).position.y = 30;
        ctx.add(bg(13.4, 1.6, 13.4), mCream, t).position.y = 45.6;
        for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) ctx.add(bg(1, 14.4, 1), mSteel, t).position.set(sx * 5.5, 52.8, sz * 5.5);
        for (const y of [52.5, 59.5]) { ctx.add(bg(12, 0.8, 12), mSteel, t).position.y = y; }
        const cap = ctx.add(new THREE.ConeGeometry(8.6, 8, 4), lam(patina), t); cap.position.y = 64.4; cap.rotation.y = Math.PI / 4;
        const face = new THREE.CircleGeometry(3.4, 20), hand = bg(0.4, 2.8, 0.2), mC = new THREE.MeshBasicMaterial({ color: '#efe7cf', side: THREE.DoubleSide });
        for (const [fx, fz, ry] of [[0, 6.1, 0], [6.1, 0, Math.PI / 2], [0, -6.1, Math.PI], [-6.1, 0, -Math.PI / 2]]) {
          const c = ctx.add(face, mC, t); c.position.set(fx, 37, fz); c.rotation.y = ry;
          const h1 = ctx.add(hand, mSteel, t); h1.position.set(fx, 37.8, fz); h1.rotation.y = ry; h1.translateZ(0.2);
        }
      }
      // white-roofed block and the long 1B green-roof building (gray strip on the sheet, x 185..265, z -120..0)
      const blk = ctx.add(bg(103, 26, 45), mStucco); blk.position.set(-66, 13, 198);
      const cap = ctx.add(bg(105, 2.2, 47), lam('#e9e4d4')); cap.position.set(-66, 27, 198);
      const dx = -0.355, dz = 0.935, cx = 226, cz = -60, len = 127, wid = 34, eave = 22;
      const gb = grp(cx, cz, Math.atan2(-dz, dx));
      ctx.add(bg(len, eave, wid), mStucco, gb).position.y = eave / 2;
      const gsh = new THREE.Shape(); gsh.moveTo(-wid / 2 - 2, 0); gsh.lineTo(wid / 2 + 2, 0); gsh.lineTo(0, 9); gsh.closePath();
      const grg = new THREE.ExtrudeGeometry(gsh, { depth: len + 4, bevelEnabled: false }); grg.translate(0, 0, -(len + 4) / 2); grg.rotateY(Math.PI / 2); grg.clearGroups();
      ctx.add(grg, lam('#4d6a5e'), gb).position.y = eave;
    }

    // ---- light towers: lattice mast (4 legs, rings, diagonals) and three lamp rows facing the field
    {
      const legs = [], rings = [], lamps = [];
      for (const [x, z, y0, hMast] of TOWERS) {
        const w0 = 4.2, w1 = 2.4, ry = Math.atan2(-x, -(z + 140));        // faces the field
        const corner = (s, t, k) => { const w = w0 + (w1 - w0) * k; return [x + s * w, z + t * w]; };
        for (const [s, t] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          const b = corner(s, t, 0), u = corner(s, t, 1);
          legs.push(beam([b[0], y0, b[1]], [u[0], y0 + hMast, u[1]], 0.7));
        }
        const nR = low ? 3 : 6;
        for (let r = 0; r <= nR; r++) {
          const k = r / nR, y = y0 + hMast * k, w = w0 + (w1 - w0) * k;
          rings.push(mat4(x, y, z, 2 * w, 0.6, 0.6), mat4(x, y, z, 0.6, 0.6, 2 * w));
          if (r < nR && !low) { const k2 = (r + 1) / nR, w2 = w0 + (w1 - w0) * k2; legs.push(beam([x - w, y, z - w], [x + w2, y0 + hMast * k2, z - w2], 0.35)); }
        }
        for (let row = 0; row < 3; row++) {
          const y = y0 + hMast + 3 + row * 5.2;
          lamps.push(mat4(x + Math.sin(ry) * 2, y, z + Math.cos(ry) * 2, 15, 4, 1.4, ry));
        }
      }
      inst(BOX, mSteel, legs); inst(BOX, mSteel, rings); inst(BOX, new THREE.MeshBasicMaterial({ color: '#e9e3c4' }), lamps);
    }

    // ---- scoreboards, flagpoles, berm, outfield buildings
    {
      const at = (deg, out, y) => tools.wallAt(deg, out, y);
      const frameMat = lam('#2f4a3b'), blankMat = lam('#1b2321');
      // generic local frame of a board: +z faces home, +x to the board's right; L() gives world coordinates
      const frameOf = (P) => {
        const ry = Math.atan2(-P.x, -P.z), s = Math.sin(ry), c = Math.cos(ry);
        return { ry, L: (x, y, z) => [P.x + x * c + z * s, y, P.z - x * s + z * c] };
      };
      const grpAt = (P, ry) => { const g = new THREE.Group(); g.position.set(P.x, 0, P.z); g.rotation.y = ry; G.add(g); return g; };
      // lattice column: 4 chords, rungs every 5 ft and one diagonal per bay (front and side faces), in board-local coordinates
      const lattice = (F, cx, cz, w, d, hgt, out) => {
        const bays = Math.round(hgt / (low ? 10 : 6));
        const pts = (y, ax, az) => F.L(cx + ax * w / 2, y, cz + az * d / 2);
        for (const [ax, az] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) out.push(beam(pts(0, ax, az), pts(hgt, ax, az), 0.7));
        for (let k = 0; k <= bays; k++) {
          const y = hgt * k / bays;
          for (const [a, b] of [[[-1, 1], [1, 1]], [[1, 1], [1, -1]], [[1, -1], [-1, -1]], [[-1, -1], [-1, 1]]]) out.push(beam(pts(y, a[0], a[1]), pts(y, b[0], b[1]), 0.4));
          if (k < bays) {
            const y2 = hgt * (k + 1) / bays, s = k % 2 ? -1 : 1;
            out.push(beam(pts(y, -s, 1), pts(y2, s, 1), 0.35));
            if (!low) out.push(beam(pts(y, 1, -s), pts(y2, 1, s), 0.35));
          }
        }
      };

      // The old center-field tower board (photographs 3-6, before 2025) was taken down in 2025 and its panels reused as a
      // ribbon board in left field (GoVision, 2025). It is not built. The 2025 board in right-center is below.
      {
        // low rear equipment platform with a dark solar roof (the ladder-pattern roof on the sheet, x -90..-45, z -495..-445)
        const bk = ctx.add(bg(44, 12, 46), lam('#b9ae92')); bk.position.set(-66, 6, -470);
        ctx.add(bg(42, 0.8, 44), lam('#2b3a4b')).position.set(-66, 12.4, -470);
      }

      // SECOND BOARD: the 75 x 32 ft right-center display reported for 2025 (text only): two steel columns, truss back, catwalk
      {
        const P = at(19, 26, 0), F = frameOf(P), g = grpAt(P, F.ry), parts = [];
        const W = 75, Hh = 32, y0 = 26;
        for (const sx of [-1, 1]) lattice(F, sx * (W / 2 - 2), 0, 4, 4, y0 + Hh + 4, parts);
        for (const k of [0, 1, 2, 3]) parts.push(beam(F.L(-W / 2 + 2, y0 + 4 + k * 9, -2.5), F.L(W / 2 - 2, y0 + 4 + (k % 2) * 0 + k * 9, -2.5), 0.5));
        for (let k = 0; k < 6; k++) { const x0 = -W / 2 + 6 + k * (W - 12) / 6, x1 = x0 + (W - 12) / 6; parts.push(beam(F.L(x0, y0, -2.5), F.L(x1, y0 + Hh, -2.5), 0.4)); }
        const back = ctx.add(bg(W, Hh, 3), lam('#26302d'), g); back.position.set(0, y0 + Hh / 2, 0);
        const sc = ctx.add(new THREE.PlaneGeometry(W - 3, Hh - 3), new THREE.MeshBasicMaterial({ map: gridTex('#10161a', '#1d2a2c', 36, 16), side: THREE.DoubleSide }), g);
        sc.position.set(0, y0 + Hh / 2, 1.6);
        ctx.add(bg(W + 2, 1.4, 4), mCream, g).position.set(0, y0 + Hh + 0.7, 0);
        ctx.add(bg(W + 3, 0.6, 5), mSteel, g).position.set(0, y0 - 0.5, 3.2);
        inst(BOX, mSteel, parts);
      }

      // LEFT-FIELD auxiliary building with a small blank line-score board on its roof (photos 3, 4: brick building left of the tower)
      {
        const P = at(-24, 34, 0), F = frameOf(P), g = grpAt(P, F.ry);
        ctx.add(bg(56, 16, 24), mBrick, g).position.set(0, 8, -6);
        ctx.add(bg(58, 1.4, 26), mCream, g).position.set(0, 16.7, -6);
        const sb = ctx.add(bg(34, 9, 2), blankMat, g); sb.position.set(0, 22.5, 4);
        ctx.add(new THREE.PlaneGeometry(31, 7), new THREE.MeshBasicMaterial({ map: gridTex('#10161a', '#1d2a2c', 22, 5), side: THREE.DoubleSide }), g).position.set(0, 22.5, 5.1);
        for (const sx of [-15, 15]) ctx.add(bg(1.4, 6, 1.4), mSteel, g).position.set(sx, 19.5, 4);
      }

      // backstop LED display: blank dark strip on the wall in front of the first row behind the plate (text source)
      { const bl = ctx.add(bg(30, 2.4, 0.5), blankMat); bl.position.set(0, 1.9, bPts[Math.round(N / 2)][1] - 0.3); }

      // FLAGPOLES: three on the right-center berm, one tall beside the home gate (photos 2, 3, 4)
      {
        const poles = [], flags = [];
        const pole = (x, z, h, ry) => {
          poles.push(beam([x, 0, z], [x, h, z], 0.45));
          flags.push(mat4(x + Math.cos(ry) * 3.2, h - 2.6, z - Math.sin(ry) * 3.2, 6.4, 3.8, 0.2, ry));
        };
        for (const deg of [24, 30, 36]) { const p = at(deg, 52, 12); pole(p.x, p.z, 40, Math.atan2(-p.x, -p.z)); }
        pole(110, 214, 64, 0);
        inst(BOX, lam('#d9d2bc'), poles); inst(BOX, new THREE.MeshBasicMaterial({ color: '#8e3b34' }), flags);
      }

      // Toyota-hill style grass berm behind the right-field wall
      const [p, n] = tools.span(18, 43);
      ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 6], [26, 11], [42, 4], [42, 0]], [-1, MAT.WALL, MAT.WALL, MAT.WALL, -1], MAT.WALL), [lam('#6f8c4c')]);
      // buildings behind the left/center field (white roofs), rotated boxes
      const bx = (x, z, w, d, h, rot, col = stuccoC) => {
        const b = ctx.add(bg(w, h, d), lam(col)); b.position.set(x, h / 2, z); b.rotation.y = rot;
        const r = ctx.add(bg(w + 1.5, 1.6, d + 1.5), lam('#e9e5d8')); r.position.set(x, h + 0.8, z); r.rotation.y = rot;
      };
      bx(-178, -490, 80, 50, 34, 0.6); bx(-185, -425, 100, 60, 28, 0.62); bx(-275, -355, 80, 55, 30, 0.3);
      bx(-18, -452, 24, 34, 16, 0, '#b9ae92'); bx(25, -450, 30, 36, 18, 0, '#b9ae92');
      const eye = ctx.add(bg(110, 36, 3), lam('#2b4638')); eye.position.set(0, 18, -418);
    }

    // ---- camera stops
    ctx.views.gate = { pos: [10, 16, 440], look: [0, 24, 150], label: 'Home Gate' };
    {
      const i = Math.round(0.7 * N), d = dA.dL(i) * 0.8, y = 3.5 + dims.sL * d + 5.5, q = tools.foulAt(0.7, d, y);
      ctx.views.upper = { pos: [q.x, q.y, q.z], look: [0, 0, -150], label: 'Third-Base Seats' };
    }
    ctx.views.roof = { pos: [-420, 150, 90], look: [-120, 20, -20], label: 'Roof Deck' };
    ctx.views.hill = { pos: [330, 90, -130], look: [150, 10, -300], label: 'Home Run Hill' };
    ctx.views.board = { pos: [40, 24, -150], look: [132, 40, -384], label: 'Scoreboard' };
  },
};
