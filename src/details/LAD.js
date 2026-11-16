// Detail module: Dodger Stadium, Los Angeles Dodgers (opened 1962). Units: feet.
// Level 4 (photographs, heights, seating shape, boards). Sources: satellite sheet survey.png (1.1 px/ft, home = origin),
// photographs photo1..7 in refs/LAD, text (mlb.com DodgerVision page, walteromalley.com construction facts).
//
// MEASURED FROM THE SHEET (survey.png, ~+/-8 ft):
//  - Outfield wall (outer edge of warning track): left pole (-236,-236) ... (0,-399); right side mirrored (right wall in shadow;
//    checked against photo3/photo4: the two pavilions, the two foul poles and the two boards are symmetric about the center line).
//  - Roof band outer edge: 29-point table OUT0 (right-field end around behind home to left-field end), roof 40-46 ft wide.
//    PARALLAX: the sheet is not ortho. Tall poles (board light towers) lean in the sheet by about 0.19 ft per ft of height,
//    away from a nadir point near (-300, 0). Roof edge (~110 ft up) therefore appears pushed outward; OUT0 is pulled back by
//    k = 0.044 toward N = (-300, 0) (OUT = (1-k) P + k N). This cuts the left/right asymmetry of the outline (rms 33 -> 19 ft).
//    The built roof/facade outline is the offset curve (deck back + 6 ft) of the symmetrized depth tables, so it is symmetric by construction.
//  - Seating depth, by sampling the sheet along normals of the foul-side front edge (left side, right side mirrored):
//    field boxes (dark) 0-35 ft, field level (yellow) 35-78, loge (orange) 78-94 -> lower deck 94 ft deep from z=-190 to behind
//    home, tapering to 80 ft at the poles. Reserve (teal) starts at 94. Roof outer edge is 165-175 ft from the front edge on the
//    sides and about 190 ft behind home (ray cast from the front edge to OUT); upper deck depth table UP_T = that minus the lower
//    deck minus 6 ft, symmetrized (the right side is in shadow).
//  - Boards: sheet slabs at (-165,-457) and (161,-458) (tops, 100 ft up), but photo3 puts them at about +/-195 ft laterally (pose scale
//    5-10% uncertain); built at +/-174 (21 degrees at 486 ft), a compromise; pavilions 6.5 to 37 degrees each side, batter's eye +/-6.5 deg; bullpens (-258,-318), (232,-318).
// MEASURED FROM PHOTOGRAPHS (heights) - method: camera pose solved from photo3 (daylight, from the top deck behind home):
//  home plate, mound, first and third base corners and the CF wall base fix a pinhole camera (focal 758 px, 800x600 image):
//  camera 104 ft above the field, 227 ft behind home plate, pitch 12 degrees. Then a vertical object at a known (x,z) gives its
//  height from its image row:
//  - back row of the top deck behind home: 104 ft (the camera seat), so the upper deck slope is 0.82 (36.5 ft at its front).
//  - outfield wall top 7 to 11 ft (check: posted 8 ft); pavilion top row 35 ft at 90 ft behind the wall (slope 0.30, was 0.42);
//    pavilion awning tops 40-44 ft; batter's eye screen top 56 ft (text says 30 ft screen: it stands on a base); eye camera
//    tower 71 ft; flagpole tops above 80 ft.
//  - boards: bottom 54-60 ft, top 97 ft (older 75 x 34 ft board = 40 px, scale check 0.85 ft/px agrees); light bank bottom
//    178 ft, top 196 ft, four poles about 21 ft apart, bank 86 ft wide x 15 ft deep. Current boards from text: 77.5 x 38 ft
//    hexagonal main screens with a 69 x 6 ft line-score board under each.
//  - roof edge = back row + about 14 ft (camera seat is under the roof); foul poles about 90 ft (photo4 scaled to the boards).
// FROM TEXT: five seating levels, eight banks of lights, pavilions of 3,000 seats, walls 4 ft (corners) and 8 ft (center).
// STILL ESTIMATED: facade bands and bay spacing (the real wall steps with the terraced parking lots; modeled flat from the
//  ground), roof edge height on the sides, club level split, deck slopes on the sides, light mast heights on the roof edge,
//  elevator tower, bullpen sizes, awning shapes, right-side bowl depth (shadow), foul pole height.
const D2R = Math.PI / 180;
const SL = 0.30, SU = 0.82, RISE = 4.5, OVH = 0.5;      // lower slope, upper slope, club step, tiny overlap (avoids duplicate points)
// Lower deck (field + loge) depth by t (0 = right-field pole, 0.5 = home, 1 = left-field pole) and upper deck depth (symmetric).
const LOW_T = [[0, 80], [0.03, 84], [0.08, 90], [0.14, 93], [0.3, 94], [0.5, 95], [0.7, 94], [0.86, 93], [0.92, 90], [0.97, 84], [1, 80]];
const UP_T = [[0, 72], [0.045, 72], [0.091, 71], [0.136, 69], [0.182, 67], [0.227, 65], [0.273, 64], [0.318, 67], [0.364, 74], [0.409, 80], [0.455, 83],
  [0.5, 83], [0.545, 83], [0.591, 80], [0.636, 74], [0.682, 67], [0.727, 64], [0.773, 65], [0.818, 67], [0.864, 69], [0.909, 71], [0.955, 72], [1, 72]];
// Outer edge of the roof band as read from the sheet (right-field end -> behind home -> left-field end), then parallax-corrected.
const OUT0 = [[397, -390], [408, -348], [422, -271], [413, -218], [388, -156], [366, -106], [335, -58], [303, -12], [279, 30],
  [262, 68], [250, 107], [238, 146], [214, 188], [177, 223], [126, 247], [70, 253], [25, 251], [-40, 240], [-88, 222],
  [-133, 183], [-174, 146], [-219, 81], [-256, 32], [-301, -33], [-344, -87], [-373, -144], [-387, -222], [-393, -304], [-386, -357]];
const PK = 0.044, PN = [-300, 0];
const OUT = OUT0.map(([x, z]) => [(1 - PK) * x + PK * PN[0], (1 - PK) * z + PK * PN[1]]);
// Wings: the stands wrap around both foul poles; front edge, from the far end back to the pole (right), pole to far end (left).
const WING_R = [[217, -342], [221, -324], [226, -300], [234, -286], [243, -262], [241, -243]];
const WING_L = [[-241, -243], [-243, -262], [-234, -286], [-226, -300], [-221, -324], [-217, -342]];

export default {
  config() {
    // wall corners from the left pole to the right pole; mirrored by hand (the sheet shows the left side well)
    const L = [[-45, 334], [-42.5, 346], [-38.6, 359], [-34.4, 371], [-30.3, 381], [-25.1, 386], [-20, 388], [-14.9, 392], [-10.6, 398], [-6.4, 400]];
    const wall = [];
    for (const [d, r] of L) wall.push({ deg: d, r, h: Math.abs(d) > 25 ? 4 : 8 });
    wall.push({ deg: 0, r: 399, h: 8 });
    for (const [d, r] of L) wall.push({ deg: -d, r, h: Math.abs(d) > 25 ? 4 : 8 });   // 4 ft to the alleys, 8 ft in the center
    return {
      wall: wall.sort((a, b) => a.deg - b.deg),
      foulScale: 1, backstop: 55,
      lower: { depth: LOW_T, slope: SL, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: OVH, rise: RISE, depth: UP_T, slope: SU, extent: [0, 1] },
      outfield: { depth: 90, slope: 0.30, spans: [[-37, -6.5], [6.5, 37]], eye: [-6.5, 6.5], eyeHeight: 56, eyeDepth: 20 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#cfa955', facade: '#b8ab8f', wall: '#5b9a98', cream: '#e6dcc0' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, parts, C, rec } = ctx;
    const { sweepSolid, textTexture, clamp, mixHex, wallH } = tools;
    const { bPts, bN } = paths;
    const lam = ctx.lam, spec = ctx.spec, dims = ctx.dims, dk = dims.deckAt;
    const low = ctx.lod === 'low';
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => { const m = new THREE.InstancedMesh(geo, mat, mats.length); mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m; };
    const beam = (a, b, th) => {                    // thin box from a to b ([x,y,z]) as a matrix for a unit box scaled (th, len, th) along y
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5); tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    const box = new THREE.BoxGeometry(1, 1, 1); box.clearGroups();

    // ---------- palette (muted early-1960s pastels)
    const blue = rec.colors[0];
    const col = {
      concrete: '#cfc8b4', concreteDk: '#8f8873', sand: '#b8ab8f', yellow: '#d6bf78', orange: '#cf9468', turq: '#7fb0a4',
      sky: mixHex(blue, '#c9d6dc', 0.62), steel: '#4a4f52', lamp: '#f2e6b8', teal: '#5f9c98', ribbon: '#8fb8b4', cream: '#e6dec6',
      field: '#5d6f7a', foul: '#d9b64c',
    };

    // ---------- seat rows with level colors: one texture covers the whole slope, one row = 3 ft
    const bandMat = (rows, bands) => {
      const RH = low ? 10 : 20, W = low ? 112 : 224, seats = 14, sw = W / seats;
      const t = textTexture((g, w, h) => {
        for (const [a, b, c] of bands) for (let r = a; r < b; r++) {
          const y0 = h - (r + 1) * RH, tread = RH * 0.66;
          g.fillStyle = mixHex(c, '#000000', 0.38); g.fillRect(0, y0 + tread, w, RH - tread);          // riser
          g.fillStyle = c; g.fillRect(0, y0, w, tread);                                                // tread
          if (!low) for (let i = 0; i < seats; i++) { g.fillStyle = mixHex(c, '#ffffff', 0.28); g.fillRect(i * sw + 1.5, y0 + 1, sw - 3, tread * 0.4); g.fillStyle = mixHex(c, '#000000', 0.16); g.fillRect(i * sw + 2.5, y0 + tread * 0.5, sw - 5, tread * 0.35); }
        }
      }, W, rows * RH);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1 / rows);
      return new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide });
    };
    // lower deck: field boxes 0-35 ft, field level (yellow) 35-78, loge (orange) 78 to the back (rows are 3.1 ft along the slope)
    const matLow = bandMat(34, [[0, 12, col.field], [12, 27, col.yellow], [27, 34, col.orange]]);
    // upper deck: reserve (turquoise), club walkway, top deck (sky)
    const matUp = bandMat(40, [[0, 12, col.turq], [12, 13, col.concreteDk], [13, 40, col.sky]]);
    const withSeat = (mat) => M.map((m, i) => (i === MAT.SEAT ? mat : m));
    if (parts.lowerDeck) parts.lowerDeck.material = withSeat(matLow);
    if (parts.upperDeck) parts.upperDeck.material = withSeat(matUp);

    // ---------- helpers on polylines
    const resample = (poly, step) => {
      const pts = [];
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
        for (let k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      pts.push(poly[poly.length - 1]); return pts;
    };
    const rayHit = (p, d, poly) => {                 // distance along d from p to the polyline (Infinity if none)
      let best = Infinity;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], c = poly[i + 1], ex = c[0] - a[0], ez = c[1] - a[1], den = d[0] * ez - d[1] * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
        if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
      }
      return best;
    };
    const nearest = (poly, p) => { let bd = 1e9, bi = 0; poly.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; bi = i; } }); return bi; };

    // ---------- 1. the stands wrap around both poles (wings, same section as the generic decks); stations for the roof
    const wingDir = (side) => { const l = Math.hypot(1, 0.12); return [side / l, 0.12 / l]; };
    const DLW = LOW_T[0][1], lowTopW = 3.5 + SL * DLW, d0W = DLW - OVH, h0W = 3.5 + SL * d0W + RISE;
    const backPts = [], hTopArr = [], outL = [];     // deck back points, deck top heights, roof outline (deck back + 6 ft)
    const push = (p, n, h) => { backPts.push(p); hTopArr.push(h); outL.push([p[0] + n[0] * 6, p[1] + n[1] * 6]); };
    const addWing = (W, side) => {
      const n = W.map(() => wingDir(side));
      ctx.add(sweepSolid(W, n, () => [[0, 0], [0, 3.5], [DLW, lowTopW], [DLW, 0]], [MAT.WALL, MAT.SEAT, MAT.FACADE, -1], MAT.FACADE), withSeat(matLow));
      const dE = W.map((p, i) => Math.max(DLW + 40, Math.min(rayHit(p, n[i], OUT), 260) - 6));
      ctx.add(sweepSolid(W, n, (i) => [[d0W, h0W - 7], [d0W, h0W], [dE[i], h0W + SU * (dE[i] - d0W)], [dE[i], 0], [DLW, 0], [DLW, h0W - 7]],
        [MAT.CREAM, MAT.SEAT, MAT.FACADE, -1, MAT.SHADE, MAT.SHADE], MAT.FACADE), withSeat(matUp));
      return W.map((p, i) => ({ p: [p[0] + n[i][0] * dE[i], p[1] + n[i][1] * dE[i]], n: n[i], h: h0W + SU * (dE[i] - d0W) }));
    };
    for (const s of addWing(WING_R, 1)) push(s.p, s.n, s.h);
    const N1 = dims.N1;
    for (let g = 0; g <= N1; g++) { const d = dk.dEnd(g); push([bPts[g][0] + bN[g][0] * d, bPts[g][1] + bN[g][1] * d], bN[g], dk.hTop(g)); }
    for (const s of addWing(WING_L, -1)) push(s.p, s.n, s.h);

    // ---------- 2. roof band: outer edge table, inner edge by inset, heights from the deck below (back row + 14 ft)
    // The outline is the offset curve of the deck back (the depth table came from the parallax-corrected, symmetrized OUT), so the
    // facade never cuts through the seats. Smooth it a little: the wing/arc junctions kink.
    for (let k = 0; k < 2; k++) for (let i = 1; i < outL.length - 1; i++) outL[i] = [(outL[i - 1][0] + 2 * outL[i][0] + outL[i + 1][0]) / 4, (outL[i - 1][1] + 2 * outL[i][1] + outL[i + 1][1]) / 4];
    const RO = resample(outL, low ? 18 : 12);
    const center = [0, -130];
    const inN = RO.map((p, i) => {                  // inward normals
      const a = RO[Math.max(0, i - 1)], b = RO[Math.min(RO.length - 1, i + 1)];
      let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      if (nx * (center[0] - p[0]) + nz * (center[1] - p[1]) < 0) { nx = -nx; nz = -nz; }
      return [nx, nz];
    });
    const widthAt = (p) => (p[0] < -200 ? 40 : 46);
    const roofY = RO.map((p) => hTopArr[nearest(backPts, p)] + 14);
    for (let k = 0; k < 3; k++) for (let i = 1; i < roofY.length - 1; i++) roofY[i] = (roofY[i - 1] + 2 * roofY[i] + roofY[i + 1]) / 4;
    const mRoof = lam(col.cream), mUnder = lam(col.concreteDk);
    // cross-section (inward offset, height): top surface, outer fascia and the underside
    ctx.add(sweepSolid(RO, inN, (i) => { const w = widthAt(RO[i]), y = roofY[i]; return [[-2, y - 3], [-2, y + 1.5], [0, y + 1.5], [w, y + 3.5], [w, y - 1.5], [0, y - 3]]; },
      [0, 0, 0, 0, 1, 1], 0), [mRoof, mUnder]);
    // rib seams on top of the roof (folded-plate look), instanced
    {
      const ribs = [], step = low ? 36 : 18; let run = 0;
      for (let i = 1; i < RO.length; i++) {
        const seg = Math.hypot(RO[i][0] - RO[i - 1][0], RO[i][1] - RO[i - 1][1]); run += seg;
        if (run < step) continue; run = 0;
        const w = widthAt(RO[i]), n = inN[i], y = roofY[i] + 3.2, cx = RO[i][0] + n[0] * w / 2, cz = RO[i][1] + n[1] * w / 2;
        ribs.push(mat4(cx, y, cz, w, 0.8, 1.2, Math.atan2(-n[1], n[0])));
      }
      inst(box, lam(mixHex(col.concrete, '#000', 0.2)), ribs);
    }
    // columns at the facade line, raking struts under the roof
    {
      const cols = [], struts = [], step = low ? 48 : 24; let run = 0;
      for (let i = 1; i < RO.length; i++) {
        const seg = Math.hypot(RO[i][0] - RO[i - 1][0], RO[i][1] - RO[i - 1][1]); run += seg;
        if (run < step) continue; run = 0;
        const n = inN[i], w = widthAt(RO[i]), y = roofY[i];
        const ox = RO[i][0] + n[0] * 3, oz = RO[i][1] + n[1] * 3, ix = RO[i][0] + n[0] * w, iz = RO[i][1] + n[1] * w;
        cols.push(beam([ox, -3, oz], [ox, y - 3, oz], 2.4));
        if (!low) struts.push(beam([ox, y - 3, oz], [ix, y - 3, iz], 1.4));
        struts.push(beam([ox, y - 24, oz], [ix, y - 2, iz], 1.1));
      }
      inst(new THREE.CylinderGeometry(0.5, 0.5, 1, 6), lam(col.sand), cols);
      inst(box, lam(col.steel), struts);
    }

    // ---------- 3. facade (photo1, photo2): sand plinth, teal wall, pale ribbon, cream cornice; ground-floor glass between piers
    {
      const bands = [lam(col.sand), lam(col.teal), lam(col.ribbon), lam(col.cream), lam(mixHex(col.concreteDk, '#000', 0.1))];
      const topY = (i) => roofY[i] - 3;
      ctx.add(sweepSolid(RO, inN, (i) => { const t = topY(i);
        return [[3, -3], [3, 10], [3, t - 16], [6, t - 16], [6, t - 11], [3, t - 11], [3, t], [8, t], [8, -3]];
      }, [0, 1, 4, 2, 4, 3, 3, -1, -1], 0), bands);
      // vertical piers every ~22 ft, glass panels at the ground floor
      const piers = [], glass = [], step = low ? 44 : 22; let run = 0;
      for (let i = 1; i < RO.length; i++) {
        const seg = Math.hypot(RO[i][0] - RO[i - 1][0], RO[i][1] - RO[i - 1][1]); run += seg;
        if (run < step) continue; run = 0;
        const n = inN[i], t = topY(i), ry = Math.atan2(n[0], n[1]);
        piers.push(mat4(RO[i][0] + n[0] * 2.4, (t - 3) / 2, RO[i][1] + n[1] * 2.4, 3.2, t + 3, 2.6, ry));
        if (!low || (piers.length % 2)) glass.push(mat4(RO[i][0] + n[0] * 2.2 - n[1] * 11, 7.5, RO[i][1] + n[1] * 2.2 + n[0] * 11, 14, 10, 0.8, ry));
      }
      inst(box, lam('#e2d9bf'), piers);
      inst(box, lam('#46666c'), glass);
      // elevator tower behind home plate (plain cream shaft, dark cap, no sign)
      const tw = ctx.add(new THREE.BoxGeometry(18, 156, 16), lam('#e3dac1')); tw.position.set(14, 75, 240);
      const cap = ctx.add(new THREE.BoxGeometry(22, 5, 20), lam(col.steel)); cap.position.set(14, 155, 240);
    }

    // ---------- 4. outfield pavilions (photo3): seats rise 0.30 to 35 ft, low hip awnings on posts over the top rows
    {
      const D = 90, slp = 0.30;
      const seatTop = (hw, o) => hw + 3 + slp * (o - 4);
      const posts = [], awn = [];
      for (const [a, b] of [[-37, -6.5], [6.5, 37]]) {
        const [p, n, dg] = tools.span(a, b);
        const len = p.reduce((s, q, i) => s + (i ? Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
        const cnt = Math.max(3, Math.round(len / 27)), oM = D - 14;
        for (let k = 0; k < cnt; k++) {
          const i = Math.min(p.length - 1, Math.round(((k + 0.5) / cnt) * (p.length - 1)));
          const hw = wallH(spec, dg[i]), x = p[i][0] + n[i][0] * oM, z = p[i][1] + n[i][1] * oM, ey = seatTop(hw, oM) + 8, ry = Math.atan2(n[i][0], n[i][1]);
          awn.push(mat4(x, ey + 2.5, z, 25, 5, 33, ry + Math.PI / 4 * 0));
          if (!low) for (const sx of [-10, 10]) for (const sz of [-12, 12]) { const c = Math.cos(ry), s = Math.sin(ry); posts.push(beam([x + sx * c + sz * s, ey - 9, z - sx * s + sz * c], [x + sx * c + sz * s, ey, z - sx * s + sz * c], 0.9)); }
        }
      }
      const pyr = new THREE.ConeGeometry(0.5, 1, 4, 1).rotateY(Math.PI / 4); pyr.clearGroups();
      inst(pyr, lam('#6d6a62'), awn);
      if (posts.length) inst(box, lam(col.steel), posts);
    }

    // ---------- 5. boards (photo3, photo4; sizes from the DodgerVision page): hexagonal 77.5 x 38 ft screen, 69 x 6 ft line score,
    // catwalk, two legs, and a four-pole light bank above (bank bottom 178 ft, 86 x 15 ft). Faces are blank dark panels.
    {
      const hex = (w, h, sh) => { const s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2 + sh); s.lineTo(0, -h / 2); s.lineTo(w / 2, -h / 2 + sh); s.lineTo(w / 2, h / 2 - sh); s.lineTo(0, h / 2); s.lineTo(-w / 2, h / 2 - sh); s.closePath(); return s; };
      const mFrame = lam('#cfc7ae'), mFace = basic('#1d2a2b'), mSteel = lam(col.steel), mBank = lam('#8d8f86');
      const frameGeo = new THREE.ExtrudeGeometry(hex(77.5, 38, 4), { depth: 5, bevelEnabled: false }); frameGeo.clearGroups();
      const faceGeo = new THREE.ShapeGeometry(hex(73.5, 34, 3.6)); faceGeo.clearGroups();
      const poleX = [-31.5, -10.5, 10.5, 31.5], lampM = [];
      for (const deg of [-21, 21]) {
        const a = deg * D2R, r = 486, x = r * Math.sin(a), z = -r * Math.cos(a);
        const g = new THREE.Group(); g.position.set(x, 0, z); g.lookAt(0, 0, 0); G.add(g);
        const yc = 82;                                                    // board centre height (bottom 63, top 101)
        const fr = ctx.add(frameGeo, mFrame, g); fr.position.set(0, yc, -2.5);
        const fc = ctx.add(faceGeo, mFace, g); fc.position.set(0, yc, 2.7);
        const ls = ctx.add(box, mFrame, g); ls.scale.set(69, 6, 4); ls.position.set(0, 59, 0);
        const lf = ctx.add(new THREE.PlaneGeometry(65, 3.4), mFace, g); lf.position.set(0, 59, 2.2);
        const cw = ctx.add(box, mSteel, g); cw.scale.set(82, 1.4, 7); cw.position.set(0, 55.2, -1.5);          // catwalk under the boards
        for (const sx of [-30, 30]) { const lg = ctx.add(box, mSteel, g); lg.scale.set(3.5, 55, 3.5); lg.position.set(sx, 27.5, -4); }   // legs to the ground
        const tr = ctx.add(box, mSteel, g); tr.scale.set(66, 1.6, 2); tr.position.set(0, 82, -6);              // back truss behind the screen
        // light bank: four poles from the pavilion roof, bank on top
        const bank = ctx.add(box, mBank, g); bank.scale.set(86, 15, 5); bank.position.set(0, 187, -6);
        for (const px of poleX) { const pl = ctx.add(box, mSteel, g); pl.scale.set(1.8, 150, 1.8); pl.position.set(px, 104, -8); }
        // lamp grid on the bank face (world matrices from the group frame)
        g.updateMatrixWorld(true);
        const cols = low ? 6 : 12, rows = low ? 2 : 3;
        for (let c = 0; c < cols; c++) for (let rI = 0; rI < rows; rI++) {
          const u = ((c + 0.5) / cols - 0.5) * 80, y = 187 + (rI - (rows - 1) / 2) * 4.2;
          const w = new THREE.Vector3(u, y, -3.2).applyMatrix4(g.matrixWorld);
          lampM.push(mat4(w.x, w.y, w.z, low ? 12 : 6, 2.8, 0.8, g.rotation.y));
        }
      }
      inst(box, basic(col.lamp), lampM);
    }

    // ---------- 6. light banks on the roof edge: six four-pole banks (photo2, photo7: thin tall poles, wide flat bank)
    {
      const masts = [], panels = [], lampM = [], spots = [];
      [0.1, 0.27, 0.43, 0.6, 0.76, 0.92].forEach((f) => { const i = Math.round(f * (RO.length - 1)), n = inN[i], w = widthAt(RO[i]); spots.push({ x: RO[i][0] + n[0] * (w - 4), z: RO[i][1] + n[1] * (w - 4), y: roofY[i] + 3, n }); });
      for (const s of spots) {
        const nx = s.n[0], nz = s.n[1], tx = nz, tz = -nx, H = 50, W = 62;
        for (const u of [-23, -8, 8, 23]) {                                  // four poles
          const lx = s.x + tx * u, lz = s.z + tz * u;
          masts.push(beam([lx, s.y, lz], [lx - nx * 2, s.y + H, lz - nz * 2], 1.5));
        }
        for (let k = 0; k < (low ? 1 : 2); k++) {                           // cross-bracing near the base
          const y0 = s.y + 4 + k * 12, y1 = s.y + 16 + k * 12;
          masts.push(beam([s.x - tx * 23, y0, s.z - tz * 23], [s.x - tx * 8, y1, s.z - tz * 8], 0.7));
          masts.push(beam([s.x + tx * 23, y0, s.z + tz * 23], [s.x + tx * 8, y1, s.z + tz * 8], 0.7));
        }
        const cx = s.x - nx * 2, cz = s.z - nz * 2, ry = Math.atan2(nx, nz), by = s.y + H + 7;
        panels.push(mat4(cx, by, cz, W, 12, 3.2, ry));
        const cols = low ? 5 : 10, rows = low ? 2 : 3;
        for (let c = 0; c < cols; c++) for (let rI = 0; rI < rows; rI++) {
          const u = (c + 0.5) / cols - 0.5, y = by + (rI - (rows - 1) / 2) * 3.4;
          lampM.push(mat4(cx + tx * u * (W - 3) + nx * 1.9, y, cz + tz * u * (W - 3) + nz * 1.9, W / cols * 0.7, 2.2, 0.6, ry));
        }
      }
      inst(box, lam(col.steel), masts);
      inst(box, lam('#8d8f86'), panels);
      inst(box, basic(col.lamp), lampM);
    }

    // ---------- 7. foul poles (yellow, tall) and the two flagpoles that flank the batter's eye (photo3, photo4)
    for (const p of parts.poles) { p.scale.set(1.3, 1.5, 1.3); p.position.y = 45; p.material = lam(col.foul); }
    {
      const eye = wallH(spec, 0), eyeTop = 56;
      for (const sx of [-44, 44]) {
        const pole = ctx.add(new THREE.CylinderGeometry(0.35, 0.45, 40, 6), lam('#d8d4c4')); pole.position.set(sx, eyeTop + 20, -410);
        const flag = ctx.add(new THREE.PlaneGeometry(9, 5.5), basic(sx < 0 ? '#c9c2a8' : '#7c8c96')); flag.position.set(sx + 4.8, eyeTop + 36, -410);
      }
      const tower = ctx.add(new THREE.BoxGeometry(8, 15, 8), lam('#2b2f30')); tower.position.set(0, eyeTop + 7.5, -410);
      void eye;
    }

    if (parts.batterEye) parts.batterEye.material = lam('#2a3633');           // dark nylon screen (photo3)

    // ---------- 8. bullpens behind the wall in both corners (flat green strips)
    for (const [x, z] of [[-258, -318], [232, -318]]) {
      const bp = ctx.add(new THREE.PlaneGeometry(62, 52).rotateX(-Math.PI / 2), lam('#6c8a52')); bp.position.set(x, 2.2, z);
    }

    // ---------- views
    const v = ctx.views;
    v.gate = { pos: [-70, 26, 470], look: [10, 78, 245], label: 'Home Plaza' };
    v.roof = { pos: [600, 200, 120], look: [270, 100, -90], label: 'Roof' };
    const g74 = Math.round(0.74 * N1), dd = dk.d0(g74) + (dk.dEnd(g74) - dk.d0(g74)) * 0.6;
    const f = tools.foulAt(0.74, dd, 0);
    v.stands = { pos: [f.x, dk.h0(g74) + 0.82 * (dd - dk.d0(g74)) + 5, f.z], look: [0, 0, -150], label: 'Top Deck Left' };
  },
};
