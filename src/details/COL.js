// Detail module: Coors Field, Denver (opened 1995). Units: feet. Home plate = origin, center field = -z.
// Level 4: facade from photographs, measured heights, per-side seating tables, scoreboards.
//
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft; home (800,752) and second base (810,612) in mosaic.png):
//  - Outfield wall: left pole (-245,-246) -> corner (-107,-412) -> flat center wall z=-413..-415 -> corner (50,-415)
//    -> right pole (248,-250). Posted 347/390/415/375/350.
//  - Roof strip (light blue-gray metal): outer and inner edge traced as 27 stations (ROOF_OUT / ROOF_IN); 25 ft wide behind
//    home, 35-40 ft on the sides. Facade line = outer edge pulled in 3 ft.
//  - Bowl unrolled along the foul-side path (normals from the front edge of the seats, see shots/unroll.png):
//    lower deck back at d = 66-70 ft on the right-field side, 72 behind home, 78 on the left-field side; upper deck rows
//    start at d = 62 / 68 / 74 and end at 118 / 134 / 150; roof inner edge at d = 120 / 138 / 168. So the left-field
//    (third-base) side is 30-45 ft deeper than the right-field side. A cross aisle shows in the upper deck on the left side.
//  - Upper deck rows run from t = 0.03 to 0.975 (they reach both foul poles).
//  - Scoreboard complex: front plane parallel to the left-center wall diagonal, centered at (-217,-459), ~115 ft behind the wall,
//    ~137 ft long end to end (bright ad panel at (-172,-510), far end near (-263,-408)). Facing the field.
//  - Right-field outfield stands (unrolled along the wall): seats to d = 80-90 ft from the wall, roof strip right behind; built as a
//    custom two-tier deck (lower to 32 ft at d 44, club/suite glass band to 50 ft, upper tier to 90 ft at d 90), as in photos 3, 6, 7.
//    Left-field stands stay a single tier (unroll and photo 7), concourse behind at about 40 ft.
//  - Right-field roof portal (light frame) footprint: white roof-top rectangle at about x 118..170, z -447..-413.
//  - Center field: evergreen batter's eye x -43..43, z -417..-497; Rockpile x -134..18, z -506..-597.
// HEIGHTS (method):
//  - Street level 21 ft above the field (text: field sunk 21 ft below street level). Drawn as a raised plaza around the facade.
//  - Gate openings 15 ft, from a pedestrian in photo 2 (about 7 px/ft at the gate plane, opening 108 px). Facade stories from
//    photo 1 proportions (opening 170 px = 15 ft): lozenge band to 21 ft, window rows 25-34 and 38-48, parapet 58 ft above
//    street (79 ft above field). Clock face about 12 ft across (80 px at ~6.5 px/ft in photo 2), clock center 73 ft over street.
//    Tower top (cap) 80 ft above street. Open terrace pavilions beside the tower: floor 58, roof 70 ft above street.
//  - RF wall out-of-town line board: mounted on the wall face from 27 to 42 deg, 7 ft tall (photo 7 proportions, wall 17 ft).
//  - Upper deck: 20th row = the purple row = 5,280 ft (text) = about 96 ft over the field (field about 5,184). Row rise 2.2-2.3 ft
//    (rows counted in photos 4, 6, 7) gives the first upper row at about 51 ft. Two stories of club/suite between the
//    lower deck (back at 22-24 ft) and the upper deck front: 2 x 14.5 ft stories.
//  - Roof: upper rows top out at 89 (right) to 102 ft (left); roof underside 14-16 ft over the top row: roof top 112 (outer)
//    and 119 ft (inner edge), steel lattice band between facade parapet (79) and the roof edge (from photo 2).
//  - Scoreboard (photo 5, 6.3 px/ft from the old 2,340 sq ft face area; MLB.com): board bottom 8 ft over the rear concourse
//    (concourse ~40 ft, from the outfield stand top 39-44 ft); scoreboard 50 x 26 ft, video board 32 x 19 ft, outer lattice legs to
//    94 ft, inner lattice columns to 126 ft, lamp tower to 144 ft. Shadows: the sun is due south in the sheet (shadows run toward
//    -z, e.g. the ribbon of shadow north of the scoreboard and the dark strip inside the third-base roof edge). Shadow/height
//    ratio about 0.9-1.0 from the scoreboard tower tip (-300,-575) vs. the photo height; used only as a plausibility check.
// FROM TEXT SOURCES: posted distances; wall heights 8/13/16.5/17; hand-laid red brick facade with cream stone courses and
//  lozenge bands; clock tower over the main entrance behind home; dark-green seats with one purple row; Rockpile in deep
//  center; evergreens as batter's eye; exposed steel frame.
// STILL ESTIMATED: gate positions (other than the main entrance), secondary gate shapes, bay widths, window sizes, exact roof
//  heights, light portal size and legs, scoreboard depth and rear bracing, suite window rhythm, tree counts, Rockpile rows, ramps
//  and stairs from street to plaza (not modeled), upper-deck cross aisle height, third-base roof lights (none modeled).
const D2R = Math.PI / 180;

// Roof outer / inner edge, [x, z]. Order: right-field end -> behind home -> left-field end.
const ROOF_OUT = [[52, -530], [82, -541], [134, -491], [198, -436], [257, -373], [302, -327], [348, -300], [364, -289], [370, -146],
  [366, -132], [302, -68], [252, -23], [239, 0], [215, 60], [160, 120], [100, 170], [40, 200], [0, 204], [-40, 202], [-100, 190],
  [-160, 168], [-203, 138], [-236, 97], [-274, 38], [-312, -5], [-334, -45], [-385, -139]];
const ROOF_IN = [[52, -514], [116, -459], [184, -400], [252, -341], [298, -314], [323, -291], [336, -173], [334, -155], [302, -114],
  [275, -82], [248, -50], [232, -14], [200, 40], [150, 100], [100, 150], [40, 176], [0, 180], [-40, 178], [-100, 166], [-150, 148],
  [-185, 120], [-220, 85], [-255, 35], [-280, 0], [-305, -47], [-332, -92], [-366, -156]];
const Y_OUT = 112, Y_IN = 119, ROOF_T = 3;    // roof top heights at the outer and inner edge (above the field)
const STREET = 21;                           // street level above the field
const PARAPET = STREET + 58;                 // facade parapet top (79)
const FLOOR_Y = 66;                          // rear concourse floor under the roof

// Point on the line from corner A to corner B at the given angle (radius).
const onLine = (A, B, deg) => {
  const a = deg * D2R, dx = Math.sin(a), dz = -Math.cos(a);
  const ax = A.r * Math.sin(A.deg * D2R), az = -A.r * Math.cos(A.deg * D2R);
  const ex = B.r * Math.sin(B.deg * D2R) - ax, ez = -B.r * Math.cos(B.deg * D2R) - az;
  return (ax * ez - az * ex) / (dx * ez - dz * ex);
};
const cornerA = { deg: -14.63, r: 426.8 }, cornerB = { deg: 6.87, r: 418 }, poleL = { deg: -45, r: 347 }, poleR = { deg: 45, r: 352 };

export default {
  config() {
    const rStep = onLine(poleL, cornerA, -38);
    return {
      wall: [
        { deg: -45, r: 347, h: 13 }, { deg: -38, r: rStep, h: 13 }, { deg: -37.95, r: rStep, h: 8 },
        { deg: cornerA.deg, r: cornerA.r, h: 8 }, { deg: cornerB.deg, r: cornerB.r, h: 8 },
        { deg: cornerB.deg + 0.05, r: cornerB.r, h: 16.5 }, { deg: 45, r: 352, h: 17 },
      ],
      foulScale: 0.95,
      backstop: 42,
      // t: 0 = right-field end, 0.5 = behind home, 1 = left-field end (from the unrolled satellite sheet)
      lower: { depth: [[0, 70], [0.1, 67], [0.3, 66], [0.42, 69], [0.5, 72], [0.58, 76], [0.75, 78], [0.95, 78], [1, 74]], slope: 0.26, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: 4, rise: [[0, 32], [0.5, 31], [1, 29.5]], slope: 0.66, extent: [0.03, 0.975],
        depth: [[0, 56], [0.2, 56], [0.4, 60], [0.5, 66], [0.6, 72], [0.75, 76], [0.95, 76], [1, 72]],
      },
      outfield: {
        depth: 80, slope: 0.4,
        spans: [[-45, cornerA.deg, 78, 0.36], [cornerA.deg, -5.9, 72, 0.4]],      // right-field stands are built in build() (two tiers)
        eye: [-5.9, 5.9], eyeHeight: 22, eyeDepth: 80,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f5a43', facade: '#9b5a45', wall: '#2b4636', cream: '#dfd2ae' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, C, views } = ctx;
    const { sweepSolid, textTexture, wallH, clamp } = tools;
    const { bPts, bN, wallDeg } = paths;
    const spec = ctx.spec, lam = ctx.lam;
    const low = ctx.lod === 'low';
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });
    let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0, rx = 0) => { tmp.position.set(x, y, z); tmp.rotation.order = 'YXZ'; tmp.rotation.set(rx, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats, parent = G) => { if (!mats.length) return null; const m = new THREE.InstancedMesh(geo, mat, mats.length); mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; parent.add(m); return m; };
    const ng = (g) => { g.clearGroups(); return g; };      // single-material geometry: one draw call
    const BOX = ng(new THREE.BoxGeometry(1, 1, 1));
    const ARCH = ng(new THREE.CylinderGeometry(1, 1, 1, 12, 1, false, 0, Math.PI).rotateX(Math.PI / 2).rotateZ(Math.PI / 2));   // upper half-disc, axis along z

    // palette (muted)
    const BRICK = '#9b5a45', CREAM = '#dfd2ae', STEEL = '#33493c', ROOFC = '#9fb0b0', ROOF_U = '#6d7b78', GLASS = '#27333c', SAND = '#a99b80';
    const mCream = lam(CREAM), mSteel = lam(STEEL), mGlass = lam(GLASS), mDark = lam('#1f2a2a');
    const mBrickD = lam('#8a4d3b'), mBrickF = lam('#9b5a45');

    // textures: sweepSolid maps u = run / 24 ft and v = edge length / 3 ft, so repeat = 24 / tileW and 3 / tileH
    const tex = (w, h, draw, tileW, tileH) => {
      const t = textTexture(draw, w, h); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(24 / tileW, 3 / tileH); return t;
    };
    const brickTex = tex(128, 64, (g, w, h) => {              // tile 6 ft x 3 ft: three courses
      g.fillStyle = '#7d4a3b'; g.fillRect(0, 0, w, h);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const off = r % 2 ? 16 : 0, x = ((c * 32 + off) % 128);
        const k = 0.9 + ((c * 7 + r * 13) % 5) * 0.045;
        g.fillStyle = `rgb(${Math.round(155 * k)},${Math.round(90 * k)},${Math.round(69 * k)})`;
        g.fillRect(x + 1, r * 21 + 1, 30, 19);
        if (x + 30 > 128) g.fillRect(0, r * 21 + 1, 30 - (128 - x) + 1, 19);
      }
    }, 6, 3);
    const lozTex = tex(128, 64, (g, w, h) => {                // tile 12 ft x 6 ft: brick with cream diamond lattice
      g.fillStyle = '#9b5a45'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#dccfa8'; g.lineWidth = 3;
      for (let k = 0; k < 2; k++) { const cx = 32 + k * 64; g.beginPath(); g.moveTo(cx, 6); g.lineTo(cx + 28, 32); g.lineTo(cx, 58); g.lineTo(cx - 28, 32); g.closePath(); g.stroke(); }
      g.lineWidth = 2; g.strokeStyle = '#c9b88f';
      for (let k = 0; k < 2; k++) { const cx = 32 + k * 64; g.beginPath(); g.moveTo(cx, 20); g.lineTo(cx + 12, 32); g.lineTo(cx, 44); g.lineTo(cx - 12, 32); g.closePath(); g.stroke(); }
    }, 12, 6);
    const dentilTex = tex(64, 32, (g, w, h) => {              // tile 3 ft x 2 ft: brick header band with cream blocks
      g.fillStyle = '#8a4d3b'; g.fillRect(0, 0, w, h); g.fillStyle = '#d3c6a0';
      g.fillRect(4, 4, 14, 10); g.fillRect(36, 4, 14, 10); g.fillStyle = '#a56a52'; g.fillRect(20, 18, 14, 10); g.fillRect(52, 18, 10, 10);
    }, 3, 2);
    const latTex = (w, h, tileW, tileH, chord = 7) => {       // steel lattice panel on transparent ground, X bracing
      const t = tex(w, h, (g, W, H) => {
        g.clearRect(0, 0, W, H); g.strokeStyle = '#2d3f35'; g.fillStyle = '#2d3f35'; g.lineWidth = Math.max(3, W / 28);
        g.fillRect(0, 0, W, chord); g.fillRect(0, H - chord, W, chord);
        g.beginPath(); g.moveTo(0, chord); g.lineTo(W, H - chord); g.moveTo(W, chord); g.lineTo(0, H - chord); g.stroke();
        g.fillRect(0, 0, 3, H); g.fillRect(W - 3, 0, 3, H);
      }, tileW, tileH); return t;
    };
    const suiteTex = tex(128, 128, (g, w, h) => {             // tile 12 ft x 11.5 ft: two stories of suite / club glass
      g.fillStyle = '#b9ad8c'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2b3a40'; g.fillRect(8, 8, w - 16, 44); g.fillRect(8, 68, w - 16, 44);
      g.fillStyle = '#44575c'; g.fillRect(8, 8, w - 16, 8); g.fillRect(8, 68, w - 16, 8);
      g.fillStyle = '#b9ad8c'; g.fillRect(62, 8, 4, 44); g.fillRect(62, 68, 4, 44);
    }, 12, 11.5);
    const matMap = (t, color = '#ffffff', extra = {}) => lam(color, { map: t, ...extra });
    const mBrick = matMap(brickTex), mLoz = matMap(lozTex), mDentil = matMap(dentilTex), mSuite = matMap(suiteTex);
    const mLattice = lam('#ffffff', { map: latTex(176, 256, 22, 33), alphaTest: 0.45 });
    const mSand = lam(SAND), mPlaza = lam('#b3a68b'), mRetain = lam('#8d7b64');

    // ---------- polyline helpers
    const lenOf = (poly) => poly.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - poly[i - 1][0], p[1] - poly[i - 1][1]) : 0), 0);
    const resample = (poly, step) => {              // evenly spaced points along the polyline
      const out = [poly[0]]; let carry = 0;
      for (let i = 1; i < poly.length; i++) {
        const a = poly[i - 1], b = poly[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        let d = step - carry;
        while (d <= L) { const t = d / L; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); d += step; }
        carry = L - (d - step);
      }
      const last = poly[poly.length - 1], q = out[out.length - 1];
      if (Math.hypot(last[0] - q[0], last[1] - q[1]) > step * 0.4) out.push(last);
      return out;
    };
    const CENTER = [0, -170];
    const normalsOf = (pts) => pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      if (nx * (p[0] - CENTER[0]) + nz * (p[1] - CENTER[1]) < 0) { nx = -nx; nz = -nz; }
      return [nx, nz];
    });
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
    const rayHit = (p, n, poly) => {                // distance from p along n to the polyline (Infinity = none)
      let best = Infinity;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], ex = b[0] - a[0], ez = b[1] - a[1], den = n[0] * ez - n[1] * ex;
        if (Math.abs(den) < 1e-9) continue;
        const s = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * n[1] - (a[1] - p[1]) * n[0]) / den;
        if (u >= 0 && u <= 1 && s > 0 && s < best) best = s;
      }
      return best;
    };
    // ribbon mesh between two lists of 3D points (same length); returns a BufferGeometry
    const ribbonGeo = (A, B) => {
      const pos = [], idx = [];
      A.forEach((a, i) => { pos.push(...a, ...B[i]); if (i) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
    };

    // lattice plane for masts and legs: uv scaled so that one panel = one tile
    const latPlane = (w, h, nx, ny) => { const g = new THREE.PlaneGeometry(w, h); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * nx, uv.getY(i) * ny); return g; };
    const mLatMast = (() => { const t = textTexture((g, W, H) => {
      g.clearRect(0, 0, W, H); g.strokeStyle = '#2d3f35'; g.fillStyle = '#2d3f35'; g.lineWidth = 4;
      g.fillRect(0, 0, 6, H); g.fillRect(W - 6, 0, 6, H); g.fillRect(0, 0, W, 6);
      g.beginPath(); g.moveTo(0, 6); g.lineTo(W, H); g.moveTo(W, 6); g.lineTo(0, H); g.stroke();
    }, 64, 64); t.wrapS = t.wrapT = THREE.RepeatWrapping; return lam('#ffffff', { map: t, alphaTest: 0.45 }); })();
    // mast (square lattice) at local (0,0) of group g: two crossed planes
    const addMast = (g, x, z, w, y0, y1) => {
      const h = y1 - y0, n = Math.max(2, Math.round(h / w));
      for (const ry of [0, Math.PI / 2]) { const m = new THREE.Mesh(latPlane(w, h, 1, n), mLatMast); m.position.set(x, y0 + h / 2, z); m.rotation.y = ry; g.add(m); }
    };

    // ---------- derived paths
    const FAC = (() => {                           // facade line = roof outer edge pulled in 3 ft
      const rs = resample(ROOF_OUT, 6), ns = normalsOf(rs);
      return { pts: rs.map((p, i) => [p[0] - ns[i][0] * 3, p[1] - ns[i][1] * 3]), nrm: ns };
    })();
    const facLine = FAC.pts;
    const { d0, h0, dEnd, hTop, dU, sU, i0, i1 } = dims;
    const floorY = FLOOR_Y;
    const Y0 = STREET;
    const frameAt = (idx) => { const k = clamp(idx, 0, facLine.length - 1), n = FAC.nrm[k]; return { p: facLine[k], n, ry: Math.atan2(n[0], n[1]) }; };
    const homeIdx = (() => { let bi = 0, bd = 1e9; facLine.forEach((q, i) => { const d = Math.hypot(q[0], q[1] - 204); if (d < bd) { bd = d; bi = i; } }); return bi; })();

    // =====================================================================================
    // 1. EXTERIOR FACADE (photos 1 and 2): street plaza, brick wall with courses, lozenge band, pilasters, windows, gates,
    //    main-entrance clock tower with two open terrace pavilions and the park name in plain letters.
    // =====================================================================================
    {
      const mats = [mBrick, mSand, mLoz, mDentil, mCream, mPlaza, mRetain];     // 0 brick 1 sand 2 loz 3 dentil 4 cream 5 plaza 6 retaining
      const sw = (poly, edges, cap = 4) => ctx.add(sweepSolid(FAC.pts, FAC.nrm, () => poly, edges, cap), mats);
      // street plaza on a retaining wall (street is 21 ft above the field)
      sw([[-1, 0], [-1, Y0], [30, Y0], [33, 0]], [-1, 5, 6, -1], 6);
      // brick wall, base course, lozenge band, string courses, dentil band, coping
      sw([[-0.6, Y0], [-0.6, PARAPET - 3], [0.6, PARAPET - 3], [0.6, Y0]], [-1, -1, 0, -1], 0);
      sw([[0.5, Y0], [0.5, Y0 + 4], [1.4, Y0 + 4], [1.4, Y0]], [-1, 1, 1, -1], 1);
      sw([[0.6, Y0 + 15], [0.6, Y0 + 21], [1.0, Y0 + 21], [1.0, Y0 + 15]], [-1, -1, 2, -1], 2);
      sw([[0.6, Y0 + 21], [0.6, Y0 + 22.8], [2.3, Y0 + 22.8], [2.3, Y0 + 21.6]], [-1, 4, 4, 4], 4);
      sw([[0.6, Y0 + 36], [0.6, Y0 + 37.2], [1.7, Y0 + 37.2], [1.7, Y0 + 36]], [-1, 4, 4, 4], 4);
      sw([[0.6, Y0 + 50], [0.6, Y0 + 52], [1.0, Y0 + 52], [1.0, Y0 + 50]], [-1, -1, 3, -1], 3);
      sw([[0.5, PARAPET - 4], [0.5, PARAPET], [2.2, PARAPET], [2.2, PARAPET - 2]], [-1, 4, 4, 4], 4);

      // bays: pilasters, windows, ground-floor openings
      const BAY = 20, fl = resample(facLine, BAY), fn = normalsOf(fl);
      const pil = [], win = [], opn = [], lint = [];
      for (let i = 0; i < fl.length; i++) {
        const p = fl[i], [nx, nz] = fn[i], ry = Math.atan2(nx, nz);
        pil.push(mat4(p[0] + nx * 1.2, Y0 + 38.6, p[1] + nz * 1.2, 4.2, 33.4, 1.4, ry));
        if (i + 1 >= fl.length) continue;
        const q = fl[i + 1], mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
        const mnx = nx + fn[i + 1][0], mnz = nz + fn[i + 1][1], ml = Math.hypot(mnx, mnz) || 1, ox = mnx / ml, oz = mnz / ml;
        const rr = Math.atan2(ox, oz), tx = Math.cos(rr), tz = -Math.sin(rr);         // tangent along the bay
        const span = Math.hypot(q[0] - p[0], q[1] - p[1]);
        for (const k of [-1, 0, 1]) {
          const cx = mx + tx * k * 5.2 * (span / BAY), cz = mz + tz * k * 5.2 * (span / BAY);
          win.push(mat4(cx + ox * 0.9, Y0 + 29.5, cz + oz * 0.9, 3.6, 9, 0.5, rr));
          win.push(mat4(cx + ox * 0.9, Y0 + 43, cz + oz * 0.9, 3.6, 10, 0.5, rr));
        }
        opn.push(mat4(mx + ox * 0.9, Y0 + 7.5, mz + oz * 0.9, 10, 15, 0.5, rr));
        lint.push(mat4(mx + ox * 1.0, Y0 + 15.3, mz + oz * 1.0, 11.4, 1.2, 0.9, rr));
      }
      inst(BOX, mBrickD, pil); inst(BOX, mGlass, win); inst(BOX, mDark, opn); inst(BOX, mCream, lint);

      // secondary gate blocks (estimated places): brick block with cream cap, dark entrance, tall windows
      const GATES = [[300, -48], [130, 152], [-140, 178], [-292, 12], [352, -250], [200, -420]];
      const gb = [], gc = [], gd = [], gs = [], gp = [];
      const near = (pt) => { let bi = 0, bd = 1e9; facLine.forEach((q, i) => { const d = Math.hypot(q[0] - pt[0], q[1] - pt[1]); if (d < bd) { bd = d; bi = i; } }); return bi; };
      GATES.forEach((pt) => {
        const { p, n, ry } = frameAt(near(pt)), w = 34, top = Y0 + 66;
        gb.push(mat4(p[0] + n[0] * 3.6, (Y0 + top) / 2, p[1] + n[1] * 3.6, w, top - Y0, 6, ry));
        gc.push(mat4(p[0] + n[0] * 3.8, top + 1.4, p[1] + n[1] * 3.8, w + 3, 2.8, 7, ry));
        gc.push(mat4(p[0] + n[0] * 3.8, top + 4.2, p[1] + n[1] * 3.8, w - 10, 3, 6, ry));
        gc.push(mat4(p[0] + n[0] * 6.7, Y0 + 21, p[1] + n[1] * 6.7, w + 1, 1.4, 1.2, ry));
        gd.push(mat4(p[0] + n[0] * 6.8, Y0 + 8.5, p[1] + n[1] * 6.8, 16, 17, 0.5, ry));
        const tx = Math.cos(ry), tz = -Math.sin(ry);
        for (const k of [-1, 0, 1]) gs.push(mat4(p[0] + n[0] * 6.8 + tx * k * 8, Y0 + 40, p[1] + n[1] * 6.8 + tz * k * 8, 4.4, 20, 0.5, ry));
        for (const s of [-1, 1]) gp.push(mat4(p[0] + n[0] * 6.9 + tx * s * 14.4, Y0 + 33, p[1] + n[1] * 6.9 + tz * s * 14.4, 3.2, 66, 1.2, ry));
      });
      inst(BOX, mBrickF, gb); inst(BOX, mCream, gc); inst(BOX, mDark, gd); inst(BOX, mGlass, gs); inst(BOX, mCream, gp);

      // ----- main entrance behind home plate: tower, two terrace pavilions, corner pylons, flagpoles, letters
      const H = frameAt(homeIdx), hg = new THREE.Group();
      hg.position.set(H.p[0], 0, H.p[1]); hg.rotation.y = H.ry; G.add(hg);
      const add = (geo, mat, x, y, z) => { const m = ctx.add(ng(geo), mat, hg); m.position.set(x, y, z); return m; };
      const bx = (w, h, d) => new THREE.BoxGeometry(w, h, d);
      const topT = Y0 + 80;
      add(bx(22, topT - Y0, 12), mBrickF, 0, (Y0 + topT) / 2, 3.6);                   // tower shaft (front face at +9.6)
      for (const s of [-1, 1]) add(bx(2.4, topT - Y0, 12.4), mCream, s * 10.4, (Y0 + topT) / 2, 3.6);   // cream quoins
      for (const y of [Y0 + 22, Y0 + 37, Y0 + 56, Y0 + 71]) add(bx(23.4, 1.2, 12.8), mCream, 0, y, 3.6);
      add(bx(24, 2.2, 13.5), mCream, 0, topT + 1.1, 3.6);
      for (const wy of [Y0 + 29.5, Y0 + 44]) for (const s of [-1, 1]) add(bx(3.4, 9, 0.5), mGlass, s * 4.2, wy, 9.8);
      add(bx(14, 18, 0.5), mDark, 0, Y0 + 9, 9.8);                                  // tower gate opening
      // clock: blank cream faces front and back, plain bar hands, steel-green arched cap, flagpole
      for (const s of [1, -1]) { const f = add(new THREE.CircleGeometry(6, 32), basic('#ece4cc'), 0, Y0 + 70, 3.6 + s * 6.85); if (s < 0) f.rotation.y = Math.PI; }
      add(bx(0.6, 5, 0.3), basic('#2a2a2a'), 0.7, Y0 + 72, 10.6).rotation.z = -0.6;
      add(bx(0.5, 3.6, 0.3), basic('#2a2a2a'), 0, Y0 + 69, 10.6).rotation.z = 0.5;
      const cap = ctx.add(ARCH, lam('#456354'), hg); cap.scale.set(7.8, 7.8, 13); cap.position.set(0, topT + 2.2, 3.6);
      add(new THREE.CylinderGeometry(0.2, 0.35, 28, 6), basic('#c9c4b4'), 0, topT + 17, 3.6);
      // terrace pavilions (steel posts, rail, dark-green flat roof) either side of the tower
      const sideIdx = (s) => homeIdx + Math.round(s / 6);
      const terr = [];
      for (const sgn of [-1, 1]) {
        const a = sgn * 14, b = sgn * 50, ia = sideIdx(Math.min(a, b)), ib = sideIdx(Math.max(a, b));
        const seg = facLine.slice(ia, ib + 1), nseg = FAC.nrm.slice(ia, ib + 1);
        // floor slab and roof slab, swept along the facade
        ctx.add(sweepSolid(seg, nseg, () => [[-12, PARAPET - 0.4], [-12, PARAPET], [0.6, PARAPET], [0.6, PARAPET - 0.4]], [-1, 4, -1, -1], 4), mats);
        ctx.add(sweepSolid(seg, nseg, () => [[-12, PARAPET + 12], [-12, PARAPET + 13.4], [2.4, PARAPET + 13.4], [2.4, PARAPET + 12]], [-1, 0, 0, 0], 0), [lam('#41584a')]);
        const rl = tools.rail(seg.map((q, k) => [q[0] - nseg[k][0] * 0.8, q[1] - nseg[k][1] * 0.8]), () => PARAPET, { height: 3.8, spacing: 5, color: '#33493c', lod: ctx.lod });
        G.add(rl);
        const nPost = Math.max(2, Math.round(Math.hypot(seg[seg.length - 1][0] - seg[0][0], seg[seg.length - 1][1] - seg[0][1]) / 12));
        for (let k = 0; k <= nPost; k++) {
          const ii = Math.min(seg.length - 1, Math.round((k / nPost) * (seg.length - 1))), q = seg[ii], n = nseg[ii], ry = Math.atan2(n[0], n[1]);
          terr.push(mat4(q[0] - n[0] * 1.6, PARAPET + 6, q[1] - n[1] * 1.6, 0.9, 12, 0.9, ry));
          terr.push(mat4(q[0] - n[0] * 10, PARAPET + 6, q[1] - n[1] * 10, 0.9, 12, 0.9, ry));
        }
      }
      inst(BOX, mSteel, terr);
      // corner pylons with stepped cream caps, flagpoles outside them
      const pyl = [], pylc = [], poles = [];
      for (const sgn of [-1, 1]) {
        const F = frameAt(homeIdx + sgn * 9), { p, n, ry } = F, top = Y0 + 70;
        pyl.push(mat4(p[0] + n[0] * 4, (Y0 + top) / 2, p[1] + n[1] * 4, 11, top - Y0, 11, ry));
        pylc.push(mat4(p[0] + n[0] * 4, top + 1, p[1] + n[1] * 4, 12.4, 2, 12.4, ry));
        pylc.push(mat4(p[0] + n[0] * 4, top + 3, p[1] + n[1] * 4, 8.4, 2, 8.4, ry));
        pylc.push(mat4(p[0] + n[0] * 9.6, (Y0 + top) / 2, p[1] + n[1] * 9.6, 2.2, top - Y0, 0.8, ry));
        const E = frameAt(homeIdx + sgn * 11); poles.push([E.p[0] + E.n[0] * 5, E.p[1] + E.n[1] * 5]);
      }
      // (pylons sit at +-54 ft: homeIdx +-9 at 6 ft spacing)
      inst(BOX, mBrickF, pyl); inst(BOX, mCream, pylc);
      poles.forEach(([x, z]) => { const m = ctx.add(ng(new THREE.CylinderGeometry(0.22, 0.4, 84, 6)), basic('#cfcab8')); m.position.set(x, Y0 + 42, z); });
      // park-name letters on the terrace roofs (plain text, steel plates behind)
      const letters = (txt, s) => {
        const F = frameAt(sideIdx(s)), t = textTexture((g, W, Hh) => {
          g.clearRect(0, 0, W, Hh); g.fillStyle = '#ece6d2'; g.textAlign = 'center'; g.textBaseline = 'middle';
          let fs = 100; g.font = `bold ${fs}px Rockwell, Georgia, serif`; while (g.measureText(txt).width > W - 20 && fs > 30) { fs -= 4; g.font = `bold ${fs}px Rockwell, Georgia, serif`; }
          g.fillText(txt, W / 2, Hh / 2 + 4);
        }, 512, 128);
        const pl = ctx.add(new THREE.PlaneGeometry(25, 6.2), new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }));
        pl.position.set(F.p[0] - F.n[0] * 3, PARAPET + 13.4 + 4.6, F.p[1] - F.n[1] * 3); pl.rotation.y = F.ry;
        const back = ctx.add(ng(new THREE.BoxGeometry(26, 6, 1.2)), lam('#24352c')); back.position.set(F.p[0] - F.n[0] * 3.9, PARAPET + 13.4 + 4.3, F.p[1] - F.n[1] * 3.9); back.rotation.y = F.ry;
      };
      letters('COORS', 31); letters('FIELD', -31);
    }


    // =====================================================================================
    // 2. ROOF / CANOPY: measured ribbon, exposed steel lattice band above the parapet, columns, rafters
    // =====================================================================================
    const rOut = resample(ROOF_OUT, low ? 22 : 14), rOutN = normalsOf(rOut);
    const rIn = rOut.map((p) => nearestOn(ROOF_IN, p));
    {
      const A = (y) => rOut.map((p) => [p[0], y, p[1]]);
      const B = (y) => rIn.map((p) => [p[0], y, p[1]]);
      ctx.add(ribbonGeo(A(Y_OUT), B(Y_IN)), lam(ROOFC)); ctx.add(ribbonGeo(A(Y_OUT - ROOF_T), B(Y_IN - ROOF_T)), lam(ROOF_U));
      ctx.add(ribbonGeo(A(Y_OUT), A(Y_OUT - ROOF_T - 1)), lam('#c7c1a6')); ctx.add(ribbonGeo(B(Y_IN), B(Y_IN - ROOF_T - 1)), lam('#c7c1a6'));
      // exposed steel lattice between the facade parapet and the roof edge (photo 2), plus a chord at the roof edge
      ctx.add(sweepSolid(rOut, rOutN, () => [[-0.4, PARAPET - 1], [-0.4, Y_OUT - ROOF_T], [0.4, Y_OUT - ROOF_T], [0.4, PARAPET - 1]], [-1, -1, 0, -1], 0), [mLattice]);
      // steel columns along the inner edge, rafters under the roof
      const cols = [], rafters = [], inL = resample(ROOF_IN, low ? 40 : 28);
      const nearBowl = (p) => {
        let bi = 0, bd = 1e9;
        for (let i = 0; i < bPts.length; i += 2) { const d = Math.hypot(bPts[i][0] - p[0], bPts[i][1] - p[1]); if (d < bd) { bd = d; bi = i; } }
        return bi >= i0 && bi <= i1;
      };
      inL.forEach((p) => { const base = nearBowl(p) ? floorY : 0, top = Y_IN - ROOF_T; cols.push(mat4(p[0], (base + top) / 2, p[1], 1.8, top - base, 1.8)); });
      inst(BOX, mSteel, cols);
      if (!low) {
        resample(ROOF_OUT, 21).forEach((p) => {
          const q = nearestOn(ROOF_IN, p), dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz);
          if (L < 6) return;
          tmp.position.set((p[0] + q[0]) / 2, (Y_OUT + Y_IN) / 2 - ROOF_T - 1.3, (p[1] + q[1]) / 2);
          tmp.rotation.order = 'YXZ'; tmp.rotation.set(Math.atan2(Y_IN - Y_OUT, L) * -1, Math.atan2(dx, dz), 0); tmp.scale.set(1.1, 2.4, L); tmp.updateMatrix();
          rafters.push(tmp.matrix.clone());
        });
        inst(BOX, mSteel, rafters);
      }
    }

    // =====================================================================================
    // 2b. RIGHT-FIELD LIGHT PORTAL on the roof (photos 2, 3, 4, 6, 7): four lattice legs, a top truss, three lamp banks
    // =====================================================================================
    {
      const c = [146, -430], A = [116, -459], Bp = [184, -400];
      const tl = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), tx = (Bp[0] - A[0]) / tl, tz = (Bp[1] - A[1]) / tl;
      const nx = -tz, nz = tx, yb = Y_IN - 2.5 - 3.5;           // faces the field; base on the roof
      const g = new THREE.Group(); g.position.set(c[0], yb, c[1]); g.rotation.y = Math.atan2(nx, nz); G.add(g);
      const top = 36, lampY = top + 5;
      for (const x of [-42, -14, 14, 42]) addMast(g, x, 0, 5, 0, top);
      const beam = new THREE.Mesh(latPlane(90, 6, 5, 1), mLatMast); beam.position.set(0, top - 1, 0); g.add(beam);
      const beam2 = new THREE.Mesh(latPlane(90, 6, 5, 1), mLatMast); beam2.position.set(0, top - 1, 0); beam2.rotation.y = Math.PI / 2; beam2.visible = false;
      const lampTex = textTexture((gg, w, h) => {
        gg.fillStyle = '#4a5348'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#f2ecc8';
        for (let r = 0; r < 4; r++) for (let q = 0; q < 8; q++) { gg.beginPath(); gg.arc(8 + q * 15, 9 + r * 15, 5, 0, 7); gg.fill(); }
      }, 128, 64);
      for (const x of [-28, 0, 28]) {
        const back = ctx.add(ng(new THREE.BoxGeometry(26, 11, 1.6)), mSteel, g); back.position.set(x, lampY + 3, 0);
        const face = ctx.add(new THREE.PlaneGeometry(24.4, 9.4), new THREE.MeshBasicMaterial({ map: lampTex, side: THREE.DoubleSide }), g); face.position.set(x, lampY + 3, 0.9);
      }
      // catwalk along the beam
      const cw = ctx.add(ng(new THREE.BoxGeometry(90, 0.5, 3)), mSteel, g); cw.position.set(0, top - 4.5, 1.2);
    }

    // =====================================================================================
    // 3. REAR CONCOURSE FLOOR under the roof, and club / suite glass face under the upper deck
    // =====================================================================================
    {
      const A = [], B = [];
      for (let i = i0; i <= i1; i += 2) {
        const p = bPts[i], n = bN[i], d = rayHit(p, n, facLine);
        const dE = dims.deckAt.dEnd(i);
        if (!isFinite(d) || d < dE + 2) continue;
        A.push([p[0] + n[0] * dE, floorY, p[1] + n[1] * dE]); B.push([p[0] + n[0] * (d - 1), floorY, p[1] + n[1] * (d - 1)]);
      }
      if (A.length > 2) ctx.add(ribbonGeo(A, B), lam('#6f6958'));
      // two stories of club and suite glass between the lower-deck back and the upper-deck fascia
      const [uP, uNn, ua] = tools.cut(0.03, 0.975);
      ctx.add(sweepSolid(uP, uNn, (i) => { const g = ua + i, dl = dims.deckAt.dL(g), lt = dims.deckAt.lowTop(g), hh = dims.deckAt.h0(g) - 7; return [[dl - 0.3, lt + 0.2], [dl - 0.3, hh], [dl - 0.5, hh], [dl - 0.5, lt + 0.2]]; }, [0, -1, -1, -1], 0), [mSuite]);
    }

    // =====================================================================================
    // 4. SIGNATURE: purple row (20th row of the upper deck = 5,280 ft = about 96 ft over the field)
    // =====================================================================================
    {
      const [p, n, a] = tools.cut(0.03, 0.975);
      const rowAt = (i) => { const g = a + i, dd = dims.deckAt.d0(g), hh = dims.deckAt.h0(g), dUu = dims.deckAt.dU(g); const frac = clamp((96 - hh) / (sU * dUu), 0.35, 0.97); return [dd + dUu * frac, hh + sU * dUu * frac + 0.25]; };
      ctx.add(sweepSolid(p, n, (i) => { const [dd, hh] = rowAt(i); return [[dd, hh], [dd + 2.6, hh + sU * 2.6], [dd + 2.6, hh + sU * 2.6 + 0.35], [dd, hh + 0.35]]; }, [0, 0, 0, 0], 0), lam('#5d4684'));
    }

    // =====================================================================================
    // 5. CENTER FIELD: evergreen batter's eye with rock, the Rockpile bleachers behind it
    // =====================================================================================
    {
      if (parts.batterEye) ctx.remove(parts.batterEye);
      const [p, n] = tools.span(-5.9, 5.9);
      ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 14], [30, 20], [80, 30], [80, 0]], [0, 1, 1, 0, -1], 1), [lam('#4c5d4f'), lam('#43503f')]);
      const trees = [], boul = [], N = low ? 45 : 130;
      for (let k = 0; k < N; k++) {
        const x = (rnd() * 2 - 1) * 42, z = -415 - 4 - rnd() * 76, sc = 0.8 + rnd() * 0.7, hgt = 12 + (-z - 415) * 0.1;
        trees.push(mat4(x, hgt + 6 * sc, z, 5.2 * sc, 12 * sc, 5.2 * sc));
      }
      inst(ng(new THREE.ConeGeometry(1, 1, 7)), lam('#2c4a35'), trees);
      for (let k = 0; k < (low ? 8 : 20); k++) boul.push(mat4((rnd() * 2 - 1) * 40, 15 + rnd() * 3, -418 - rnd() * 20, 3 + rnd() * 4, 2.5 + rnd() * 2.5, 3 + rnd() * 4, rnd() * 3));
      inst(new THREE.DodecahedronGeometry(1, 0), lam('#7f7a6c'), boul);

      // Rockpile: stepped bleachers on a brick base, a fan of rows (measured x -134..18, z -506..-597)
      const R0 = 514, ROWS = 12, TR = 7, RI = 2.8, BASE = 34;
      const arc = [];
      for (let k = 0; k <= (low ? 6 : 12); k++) { const a = (-15.5 + k * (18.5 / (low ? 6 : 12))) * D2R; arc.push([R0 * Math.sin(a), -R0 * Math.cos(a)]); }
      const arcN = arc.map((q) => { const l = Math.hypot(q[0], q[1]); return [q[0] / l, q[1] / l]; });
      const prof2 = [[0, 0], [0, BASE]], edge2 = [3];
      for (let r = 0; r < ROWS; r++) { prof2.push([r * TR, BASE + (r + 1) * RI]); edge2.push(2); prof2.push([(r + 1) * TR, BASE + (r + 1) * RI]); edge2.push(1); }
      prof2.push([ROWS * TR, 0]); edge2.push(0); edge2.push(-1);
      const rm = [lam('#26392e'), lam('#3b6a4f'), lam('#2a4a3a'), lam('#9b5a45')];
      ctx.add(sweepSolid(arc, arcN, () => prof2, edge2, 3), rm);
      ctx.add(sweepSolid(arc, arcN, () => [[ROWS * TR, BASE + ROWS * RI], [ROWS * TR, BASE + ROWS * RI + 5], [ROWS * TR + 1, BASE + ROWS * RI + 5], [ROWS * TR + 1, BASE + ROWS * RI]], [3, 3, 3, 3], 3), rm);
    }


    // =====================================================================================
    // 5b. RIGHT-FIELD STANDS, two tiers (photos 3, 4, 6, 7): lower seats, a club/suite glass band, an upper tier under the roof
    // =====================================================================================
    {
      const [p, n, dg] = tools.span(cornerB.deg + 0.05, 45);
      const LD = 44, UD = 90, UY0 = 50, UY1 = 90.5, hw = (i) => wallH(spec, dg[i]);
      const mats = [M[MAT.WALL], M[MAT.CREAM], M[MAT.SEAT], mSuite, M[MAT.FACADE]];
      const lowY = (i) => hw(i) + 3 + 0.3 * (LD - 4);
      parts.outfieldSeats.push(ctx.add(sweepSolid(p, n, (i) => [[1.2, 0], [1.2, hw(i) + 3], [4, hw(i) + 3], [LD, lowY(i)], [LD, UY0], [UD, UY1], [UD, 0]], [0, 1, 2, 3, 2, 4, -1], 4), mats));
      const dk = G.children[G.children.length - 1];
      dk.add(tools.aisles(p, n, { d0: 4, h0: 20, d1: LD, h1: 32 }, { every: 24, lod: ctx.lod }));
      dk.add(tools.aisles(p, n, { d0: LD, h0: UY0, d1: UD, h1: UY1 }, { every: 24, lod: ctx.lod }));
      const off = (d) => p.map((q, i) => [q[0] + n[i][0] * d, q[1] + n[i][1] * d]);
      dk.add(tools.rail(off(UD - 0.6), () => UY1, { height: 3.5, lod: ctx.lod }));
      dk.add(tools.rail(off(LD - 0.6), () => UY0, { height: 3.5, lod: ctx.lod }));
    }

    // =====================================================================================
    // 6. MAIN SCOREBOARD COMPLEX in left-center (photos 3-7): scoreboard 50 x 26 ft, video board 32 x 19 ft, blank panels,
    //    lattice legs and inner columns, catwalk, rear bracing, a lamp tower, flagpoles. Faces are blank panels or a plain line grid.
    // =====================================================================================
    {
      const nrmX = 0.773, nrmZ = 0.634, th = Math.atan2(nrmX, nrmZ);       // face normal (toward the field), parallel to the wall diagonal
      const C0 = [-217, -459];
      const g = new THREE.Group(); g.position.set(C0[0], 0, C0[1]); g.rotation.y = th; G.add(g);
      const CONC = 40, YB = 48;                                              // rear concourse, board bottom
      const gridTex = textTexture((gg, w, h) => {
        gg.fillStyle = '#161e21'; gg.fillRect(0, 0, w, h); gg.strokeStyle = '#3c494c'; gg.lineWidth = 2;
        for (let c = 0; c <= 12; c++) { gg.beginPath(); gg.moveTo(8 + c * (w - 16) / 12, 8); gg.lineTo(8 + c * (w - 16) / 12, h - 8); gg.stroke(); }
        for (let r = 0; r <= 3; r++) { gg.beginPath(); gg.moveTo(8, 8 + r * (h - 16) / 3); gg.lineTo(w - 8, 8 + r * (h - 16) / 3); gg.stroke(); }
        gg.strokeRect(4, 4, w - 8, h - 8);
      }, 256, 128);
      const videoTex = textTexture((gg, w, h) => { gg.fillStyle = '#10181a'; gg.fillRect(0, 0, w, h); gg.strokeStyle = '#3a4648'; gg.lineWidth = 6; gg.strokeRect(5, 5, w - 10, h - 10); }, 128, 96);
      const mHouse = lam('#26302e'), mPanel = lam('#2b3231');
      const slab = (w, h, d, x, y, z, mat, faceMat) => {
        const b = ctx.add(ng(new THREE.BoxGeometry(w, h, d)), mat, g); b.position.set(x, y, z);
        if (faceMat) { const f = ctx.add(new THREE.PlaneGeometry(w - 1.6, h - 1.6), faceMat, g); f.position.set(x, y, z + d / 2 + 0.05); }
        return b;
      };
      // concourse deck from the outfield stands back to the board base
      {
        const [p, n] = tools.span(-34, -11);
        ctx.add(sweepSolid(p, n, () => [[80, CONC - 0.5], [80, CONC], [126, CONC], [126, CONC - 0.5]], [0, 0, 0, 0], 0), lam('#7a7360'));
      }
      slab(110, CONC + 8, 14, 0, (CONC + 8) / 2, -6, lam('#7b4a3a'));                       // brick rear wall under the board
      slab(50, 26, 6, 0, YB + 13, -3, mHouse, new THREE.MeshBasicMaterial({ map: gridTex }));   // scoreboard
      for (const s of [-1, 1]) slab(15, 26, 4, s * 32.5, YB + 13, -2, mPanel);               // tall blank panels
      slab(32, 19, 5, 0, YB + 26 + 9.5, -2.5, mHouse, new THREE.MeshBasicMaterial({ map: videoTex }));   // video board
      for (const s of [-1, 1]) slab(23, 11.6, 3, s * 29.5, YB + 32 + 5.8, -1.5, mPanel);      // upper blank strips
      slab(32, 7, 4, 0, YB + 45 + 3.5, -2, mHouse);                                          // blank top block
      for (const s of [-1, 1]) {
        addMast(g, s * 45, -4, 8, CONC - 8, 94);                                              // outer lattice legs
        addMast(g, s * 15, -4, 7, YB + 26, 126);                                              // inner columns
        for (const k of [0, 1]) { const m = ctx.add(ng(new THREE.CylinderGeometry(0.2, 0.32, 26, 6)), basic('#cfcab8'), g); m.position.set(s * (42 + k * 4.5), 94 + 13, -4); }   // flagpoles
      }
      const t1 = new THREE.Mesh(latPlane(90, 4, 4, 1), mLatMast); t1.position.set(0, 92, -4); g.add(t1);          // outer top truss
      const t2 = new THREE.Mesh(latPlane(30, 6, 3, 1), mLatMast); t2.position.set(0, 123, -4); g.add(t2);         // inner top truss
      const t3 = new THREE.Mesh(latPlane(90, 4, 4, 1), mLatMast); t3.position.set(0, YB - 1, -4); g.add(t3);      // base truss
      // catwalk behind and in front of the board
      slab(92, 0.5, 6, 0, YB + 27, -9, mSteel);
      slab(92, 0.4, 2.6, 0, YB - 3, 1.2, mSteel);
      // rear bracing (A-frame struts from the outer legs down to the concourse)
      for (const s of [-1, 1]) for (const dx of [-3, 3]) {
        const L = Math.hypot(28, 54), b = ctx.add(ng(new THREE.BoxGeometry(1.2, 1.2, L)), mSteel, g);
        b.position.set(s * 45 + dx, (94 + CONC) / 2, -18); b.rotation.x = -Math.atan2(54, 28);
      }
      // lamp tower behind the left half of the board, lamp bank on top
      addMast(g, -30, -14, 8, CONC, 138);
      const lb = ctx.add(ng(new THREE.BoxGeometry(28, 13, 2)), mSteel, g); lb.position.set(-30, 141, -14);
      const lf = ctx.add(new THREE.PlaneGeometry(26, 11), new THREE.MeshBasicMaterial({ color: '#efe8c6', side: THREE.DoubleSide }), g); lf.position.set(-30, 141, -12.9);
    }

    // =====================================================================================
    // 7. OUT-OF-TOWN LINE BOARD on the right-field wall (photos 4, 6, 7): blank dark ribbon with a lamp-dot grid
    // =====================================================================================
    {
      const [p, n, dg] = tools.span(27, 42);
      const dots = textTexture((gg, w, h) => { gg.fillStyle = '#141b1d'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#4a5750'; for (let r = 0; r < 4; r++) for (let c = 0; c < 20; c++) gg.fillRect(4 + c * 12, 6 + r * 10, 6, 5); }, 256, 48);
      dots.wrapS = dots.wrapT = THREE.RepeatWrapping; dots.repeat.set(24 / 21, 3 / 7);
      ctx.add(sweepSolid(p, n, (i) => { const h = wallH(spec, dg[i]); return [[-0.9, h - 8], [-0.9, h - 0.8], [0, h - 0.8], [0, h - 8]]; }, [-1, 0, -1, -1], 0), [lam('#ffffff', { map: dots })]);
    }

    // views
    views.gate = { pos: [110, 34, 430], look: [0, 62, 204], label: 'Home Gate' };
    views.roof = { pos: [-150, 62, -10], look: [-300, 98, 60], label: 'Roof' };
    views.rockpile = { pos: [10, 42, -300], look: [-58, 62, -560], label: 'Rockpile' };
    views.board = { pos: [-60, 36, -240], look: [-217, 85, -459], label: 'Scoreboard' };
    views.street = { pos: [-150, 20, 380], look: [0, 60, 204], label: 'Street' };
  },
};
