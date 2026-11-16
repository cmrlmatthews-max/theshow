// Detail module: Great American Ball Park, Cincinnati Reds (opened 2003). Units: feet, y up, home plate = origin.
// ---------------------------------------------------------------------------------------------------------------
// MEASURED FROM THE SATELLITE SHEET (mosaic.png -> model coordinates, 0.9022 ft/px; the sheet is clipped at z=+300, so the
// bowl was also unrolled from a wider cut of the mosaic: one column per foul-edge sample, rows = feet outward):
//  - Outer edge of the white roof/facade band: 24 stations on the right-field/home side and 19 on the left side; band ~43 ft
//    wide; 35 ft "Gap" between the two pieces at ~(-129,254) = bowl sample 118 (t 0.536).
//  - Seating bowl by side (depth from the foul front edge, from the unrolled sheet), see PROF below:
//      first/right side: lower deck 40 ft at the pole -> 56 (t .15) -> 76 (t .25) -> 100 (t .45); then a flat concourse/suite
//      roof (dark band in the sheet, 20-40 ft wide) and one steep upper block that ends at 195-205 ft; behind home: lower deck
//      only ~58 ft deep, white suite roof to ~100 ft, upper block to 205 ft; third side: lower deck 93-100 ft (t .55-.7)
//      shrinking to 56 at the pole, upper block ends at 170 ft -> 86 ft at the pole (the upper deck is much smaller there).
//  - Four lattice light towers (bases RF (231,-267) (269,-240); LF (-210,-254) (-169,-281)); video board in left field from
//    (-308,-246) to (-152,-385) (209 ft long, faces home); two smokestacks in right-center; backstop 55 ft.
//  - Batter's eye pavilion x -61..+53 (photo 3: dark glass box wider than the 40 ft white roof piece seen on the sheet).
// MEASURED FROM PHOTOGRAPHS (heights; scale taken from a known size in the same photo and plane):
//  - photo 3 (from behind home): CF wall 8 ft = 11 px; same-depth objects behind it, scaled by that: eye pavilion roof 41 ft,
//    roof deck crowd rail 45, pilot house roof ~66 ft, cupola ~77; smokestack tops ~75 ft above the field (base on the
//    stand at ~24 ft); right-center bleacher top ~46 ft (steep, ~0.8 slope); left-field stand top ~66-77 ft with the
//    video board face from ~78 to ~123 ft (LF wall 12 ft = 17 px used for scale); light towers ~205 ft overall.
//  - photo 5 (from the lower deck, far side): lower deck top ~38 ft at ~90 ft depth (slope 0.38, ~1 ft per row at 2.6 ft
//    tread), suite band ~14-20 ft, mezzanine + upper deck are one raked block here (14 + 28 rows in the text sources) that
//    tops out at ~105-110 ft; photo-1 proportions (arcade : braced level : glass : terrace) scaled to a roof top of ~115 ft
//    gave arcade 19, braced level 17, glass wall 19, terrace rail 62 ft, roof lip ~85-93 ft (lip = inner roof edge - 24;
//    the roof band rises ~20 ft over its 46 ft width), masts ~15 ft above the lip (top ~108 ft).
//  - Shadows on the sheet were NOT usable for heights: the towers lean in the image and the long shadows do not start
//    at the tower bases, so no sun ratio could be derived (see PROBLEMS in the report).
// FROM TEXT SOURCES: posted distances 328/379/404/370/325; wall 12 ft LF, 8 ft CF/RF; scoreboard 215 x 40 ft; Gap 35 ft;
//  38 / 14 / 28 seat rows (lower / mezzanine / upper); stacks in right-center; LF upper deck is bleacher-style benches under
//  the board; steel-and-glass front with end towers of tan stone (photo 1).
// STILL ESTIMATED: stack and pilot-house plan positions, board panel split and arch rise, mast and strut spacing, bay rhythm
//  (21 ft), tower footprints, deck depth between table rows, facade level heights (photo-1 proportion), RF corner structures
//  (right-field board at deg 37 is a guess from photos 2 and 7; the open river-side stands of photo 7 are not modeled), colours.
const D2R = Math.PI / 180;
const W = 43;                                   // roof/canopy band width (ft)
// Outer edge of the roof band, right-field end -> home -> the Gap. [x, z]
const OUT_A = [[363, -150], [372, -120], [376, -80], [374, -40], [371, 0], [366, 25], [355, 45], [336, 66], [314, 87], [296, 109],
  [282, 130], [261, 155], [246, 184], [229, 212], [200, 234], [171, 255], [136, 273], [96, 287], [54, 300], [11, 310], [-30, 308],
  [-70, 298], [-100, 288], [-118, 277]];
// Left side: the Gap -> left-field end.
const OUT_B = [[-140, 232], [-154, 226], [-182, 198], [-205, 170], [-238, 134], [-262, 98], [-282, 62], [-302, 26], [-322, -10],
  [-338, -42], [-350, -74], [-360, -114], [-362, -130], [-340, -168], [-302, -210], [-282, -238], [-262, -262], [-234, -286], [-218, -306]];
// Gate pavilions: centre (nearest facade station), half distance between the two stone towers, tower height.
const GATES = [{ p: [-62, 303], half: 98, h: 84, main: true }, { p: [172, 255], half: 30, h: 62 }, { p: [373, -60], half: 30, h: 62 }, { p: [-330, -20], half: 30, h: 62 }];
const TOWERS = [[231, -267, 40], [269, -240, 40]];     // right-field light tower bases [x, z, base height]; the two left-field masts stand behind the board
const BOARD = { a: [-308, -246], b: [-152, -385], y0: 78, h: 45, L: 209 };
const SL = 0.38, SU = 0.55;                       // lower-deck slope, upper-block slope

// Bowl profile along the foul front edge (t 0 = right-field pole, .5 = home, 1 = left-field pole), measured on the sheet:
// [t, lower depth, upper front offset d0, upper back edge dEnd, (optional) rise override].
const PROF = [
  [0.000, 40, 66, 118], [0.050, 48, 76, 150], [0.100, 52, 90, 180], [0.150, 56, 98, 196], [0.200, 66, 100, 203],
  [0.250, 76, 98, 203], [0.300, 82, 102, 194], [0.350, 88, 110, 194], [0.400, 96, 118, 195], [0.450, 100, 122, 201],
  [0.470, 62, 100, 204], [0.500, 58, 100, 206], [0.520, 60, 102, 202],
  [0.5273, 60, 102, 200], [0.5318, 60, 102, 106, -34], [0.5455, 60, 102, 106, -34],   // the Gap: no upper block
  [0.552, 93, 101, 169], [0.600, 98, 106, 163], [0.650, 100, 108, 162], [0.700, 97, 105, 158], [0.750, 92, 100, 155],
  [0.800, 86, 94, 153], [0.850, 80, 88, 152], [0.900, 74, 82, 145], [0.950, 66, 74, 129], [1.000, 56, 62, 86],
];
// Posted distances -> the wall curve of the generic model (Catmull-Rom) so we can set heights at corners.
const POSTED = [328, 379, 404, 370, 325];
const rAt = (deg) => {
  const t = Math.min(3.9999, Math.max(0, (deg + 45) / 22.5)), i = Math.floor(t), u = t - i, p = POSTED;
  const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(4, i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
};
const hAt = (deg) => (deg <= -30 ? 12 : deg >= -18 ? 8 : 12 - 4 * (deg + 30) / 12);

export default {
  config() {
    const wall = [];
    for (let d = -45; d <= 45; d += 5) wall.push({ deg: d, r: rAt(d), h: hAt(d) });
    const tab = (f) => PROF.map((r) => [r[0], f(r)]);
    return {
      wall,
      backstop: 55,
      lower: { depth: tab((r) => r[1]), slope: SL, extent: [0, 1] },
      hasUpper: true,
      // upper block: front offset = lower depth - overhang; its front sits 20 ft above the lower-deck top (suite band)
      upper: {
        overhang: tab((r) => r[1] - r[2]),
        rise: tab((r) => (r[4] != null ? r[4] : 20 - SL * (r[2] - r[1]))),
        depth: tab((r) => r[3] - r[2]),
        slope: SU, extent: [0, 1],
      },
      outfield: {
        depth: 56, slope: 0.45,
        // LF: two tiers merged into one steep bank under the board; RF: steep bleachers; eye = wide dark pavilion (photo 3)
        spans: [[-45, -20, 60, 0.85], [-20, -9, 44, 0.5], [7.5, 12, 34, 0.55], [12, 45, 40, 0.8]],
        eye: [-9, 7.5], eyeHeight: 41, eyeDepth: 48,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#a63b38', facade: '#a2614b', wall: '#2c3a30', cream: '#e6dcc0' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims } = ctx;
    const { sweepSolid, textTexture, clamp } = tools;
    const { bPts, bN } = paths;
    const low = ctx.lod === 'low';
    const N1 = bPts.length - 1;
    const deck = dims.deckAt;
    const hTopAt = (g) => deck.hTop(clamp(g, 0, N1));
    const tmp = new THREE.Object3D();
    tmp.rotation.order = 'YXZ';
    const mat4 = (x, y, z, sx, sy, sz, yaw = 0, pitch = 0) => {
      tmp.position.set(x, y, z); tmp.rotation.set(pitch, yaw, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone();
    };
    const BOXG = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
    // left-field board frame: s along the board (0 = left-field corner end), off toward home, y
    const BF = (() => {
      const a = BOARD.a, b = BOARD.b, L0 = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L0, uz = (b[1] - a[1]) / L0;
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      let nx = uz, nz = -ux; if (nx * -mx + nz * -mz < 0) { nx = -nx; nz = -nz; }
      const L = BOARD.L;
      return { ux, uz, mx, mz, nx, nz, L, yaw: Math.atan2(nx, nz), P: (s, off, y) => [mx + ux * (s - L / 2) + nx * off, y, mz + uz * (s - L / 2) + nz * off] };
    })();

    // ---------- accumulators: everything that shares a material becomes ONE mesh (vertex colours) ----------
    const K = (hex) => new THREE.Color(hex);
    const nm3 = new THREE.Matrix3(), vv = new THREE.Vector3();
    class Acc {
      constructor() { this.p = []; this.n = []; this.c = []; }
      geo(g, m, col) {                                         // non-indexed geometry through matrix m
        const pa = g.attributes.position, na = g.attributes.normal;
        nm3.getNormalMatrix(m);
        for (let i = 0; i < pa.count; i++) {
          vv.fromBufferAttribute(pa, i).applyMatrix4(m); this.p.push(vv.x, vv.y, vv.z);
          vv.fromBufferAttribute(na, i).applyMatrix3(nm3).normalize(); this.n.push(vv.x, vv.y, vv.z);
          this.c.push(col.r, col.g, col.b);
        }
      }
      box(cx, cy, cz, sx, sy, sz, yaw, col) { this.geo(BOXG, mat4(cx, cy, cz, sx, sy, sz, yaw), col); }
      beam(a, b, th, col) {
        const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
        if (len < 1e-4) return;
        const o = new THREE.Object3D();
        o.position.copy(A).add(B).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        o.scale.set(th, len, th); o.updateMatrix(); this.geo(BOXG, o.matrix, col);
      }
      quad(a, b, c, d, col) {                                  // flat quad, corners [x,y,z]
        const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
        let nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0];
        const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
        for (const q of [a, b, c, a, c, d]) { this.p.push(q[0], q[1], q[2]); this.n.push(nx, ny, nz); this.c.push(col.r, col.g, col.b); }
      }
      cyl(x, y, z, rt, rb, h, seg, col, rotX = false, yaw = 0) {
        const g = new THREE.CylinderGeometry(rt, rb, h, seg).toNonIndexed();
        if (rotX) g.rotateX(Math.PI / 2);
        this.geo(g, mat4(x, y, z, 1, 1, 1, yaw), col);
      }
      sweep(geo, cols) {                                       // sweepSolid output: group material index -> colour
        const pa = geo.attributes.position, na = geo.attributes.normal;
        for (const gr of geo.groups) {
          const col = cols[gr.materialIndex];
          for (let i = gr.start; i < gr.start + gr.count; i++) {
            this.p.push(pa.getX(i), pa.getY(i), pa.getZ(i)); this.n.push(na.getX(i), na.getY(i), na.getZ(i));
            this.c.push(col.r, col.g, col.b);
          }
        }
      }
      mesh(mat) {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
        g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
        g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
        const m = new THREE.Mesh(g, mat); G.add(m); return m;
      }
    }
    const S = new Acc(), U = new Acc();                         // S: lit steel/stone/glass, U: unlit lamps and blank panels
    // sweepSolid with colour per edge (edge colours are indices into a local palette)
    const sweepC = (pts, nrm, polyFn, edgeCols, capCol, target = S) => {
      const palette = [...edgeCols, capCol];
      const g = sweepSolid(pts, nrm, polyFn, edgeCols.map((c, i) => (c ? i : -1)), edgeCols.length);
      target.sweep(g, palette);
    };

    // ---------- palette (muted vintage) ----------
    const steel = K('#ebe8dd'), steel2 = K('#d3cfc0'), grey = K('#8d8c85'), dark = K('#34393b'), glassC = K('#34444d'), glassD = K('#242e33');
    const stone = K('#bba88a'), stone2 = K('#a89677'), cream = K('#e1d6b6'), roofTop = K('#cdc8b8'), roofUnder = K('#7b7e7c');
    const redBand = K('#8a3a35'), brickRed = K('#74403a'), plinth = K('#b5ae9c');

    // ---------- ring stations (measured outer edge), outward normals ----------
    const CENTER = [0, -110];
    const ringSamples = (poly, step) => {
      const out = [];
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / step));
        for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      out.push(poly[poly.length - 1]);
      const nrm = out.map((p, i) => {
        const a = out[Math.max(0, i - 2)], b = out[Math.min(out.length - 1, i + 2)];
        let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * (p[0] - CENTER[0]) + nz * (p[1] - CENTER[1]) < 0) { nx = -nx; nz = -nz; }
        return [nx, nz];
      });
      return [out, nrm];
    };
    const nearestIdx = (p) => {
      let bi = 0, bd = 1e9;
      for (let i = 0; i <= N1; i++) { const d = Math.hypot(bPts[i][0] - p[0], bPts[i][1] - p[1]); if (d < bd) { bd = d; bi = i; } }
      return [bi, bd];
    };
    // stations with per-station heights: roof inner edge, roof lip (outer edge), facade top
    const stations = (poly, step) => {
      const [pts, nrm] = ringSamples(poly, step);
      const st = pts.map((p, i) => ({ p, n: nrm[i], idx: nearestIdx(p)[0] }));
      const yi = st.map((s) => Math.max(66, hTopAt(s.idx) + 13));
      st.forEach((s, i) => {                                   // smooth along the ring
        let a = 0, c = 0; for (let k = -3; k <= 3; k++) { const j = i + k; if (j >= 0 && j < st.length) { a += yi[j]; c++; } }
        s.yIn = a / c; s.yOut = Math.max(Math.min(s.yIn - 3, 70), s.yIn - 24); s.HF = clamp(s.yOut - 22, 36, 62);
      });
      return st;
    };

    // ---------- facade, roof and roof structure ----------
    const mLit = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const mUnlit = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const ringData = [];
    for (const poly of [OUT_A, OUT_B]) {
      // roof: top, underside, fascia (red banner band over a pale band), inner edge
      const fine = stations(poly, low ? 14 : 9);
      ringData.push(fine);
      const O = (s, y, off = 0) => [s.p[0] - s.n[0] * off, y, s.p[1] - s.n[1] * off];
      const Iw = W + 3;
      for (let i = 0; i < fine.length - 1; i++) {
        const A = fine[i], B = fine[i + 1];
        S.quad(O(A, A.yOut), O(A, A.yIn, Iw), O(B, B.yIn, Iw), O(B, B.yOut), roofTop);
        S.quad(O(A, A.yOut - 1.6), O(A, A.yIn - 1.6, Iw), O(B, B.yIn - 1.6, Iw), O(B, B.yOut - 1.6), roofUnder);
        S.quad(O(A, A.yOut), O(A, A.yOut - 3.4), O(B, B.yOut - 3.4), O(B, B.yOut), redBand);
        S.quad(O(A, A.yOut - 3.4), O(A, A.yOut - 6), O(B, B.yOut - 6), O(B, B.yOut - 3.4), steel);
        S.quad(O(A, A.yIn, Iw), O(A, A.yIn - 3.2, Iw), O(B, B.yIn - 3.2, Iw), O(B, B.yIn, Iw), steel2);
        const yU = (s) => s.yOut - 1.6 + (s.yIn - s.yOut) * 20 / Iw;
        S.quad(O(A, A.HF, 20), O(A, yU(A), 20), O(B, yU(B), 20), O(B, B.HF, 20), K('#5d6062'));       // dark soffit wall behind the open truss zone
      }
      // bays (~21 ft): arcade, braced level, glass curtain wall, terrace rail
      const bays = stations(poly, low ? 31.5 : 21);
      const q = (s, off = 2.5) => [s.p[0] - s.n[0] * off, s.p[1] - s.n[1] * off];
      for (let i = 0; i < bays.length - 1; i++) {
        const A = bays[i], B = bays[i + 1];
        const qa = q(A), qb = q(B), mid = [(qa[0] + qb[0]) / 2, (qa[1] + qb[1]) / 2];
        const nx = A.n[0] + B.n[0], nz = A.n[1] + B.n[1], nl = Math.hypot(nx, nz) || 1, nn = [nx / nl, nz / nl];
        const yaw = Math.atan2(nn[0], nn[1]), len = Math.hypot(qb[0] - qa[0], qb[1] - qa[1]);
        const s = (A.HF + B.HF) / 124;                           // vertical scale, 1 = 62 ft terrace
        const P3 = (pp, y, off) => [pp[0] + nn[0] * off, y, pp[1] + nn[1] * off];
        const along = (off, y, h, d, col) => S.box(mid[0] + nn[0] * off, y, mid[1] + nn[1] * off, len, h, d, yaw, col);
        along(0.2, 1.5 * s, 3 * s, 3.4, plinth);                                  // plinth
        S.quad(P3(qa, 3 * s, -2.6), P3(qb, 3 * s, -2.6), P3(qb, 17.5 * s, -2.6), P3(qa, 17.5 * s, -2.6), glassD);   // ground glazing (doors)
        S.box(qa[0] + nn[0] * 0.3, 9.5 * s, qa[1] + nn[1] * 0.3, 1.6, 19 * s, 1.6, yaw, steel);   // arcade column
        along(0.4, 19 * s, 1.6, 2.4, steel);                                       // head beam
        S.quad(P3(qa, 21 * s, -2.8), P3(qb, 21 * s, -2.8), P3(qb, 35 * s, -2.8), P3(qa, 35 * s, -2.8), dark);     // open braced level
        S.box(qa[0] + nn[0] * 0.3, 28 * s, qa[1] + nn[1] * 0.3, 1.6, 17 * s, 1.6, yaw, steel);
        S.beam(P3(qa, 20.5 * s, 0.3), P3(qb, 35 * s, 0.3), 0.9, steel); S.beam(P3(qa, 35 * s, 0.3), P3(qb, 20.5 * s, 0.3), 0.9, steel);
        along(0.8, 36.5 * s, 1.8, 3.2, steel);                                     // slab under the glass
        S.quad(P3(qa, 37.5 * s, -0.4), P3(qb, 37.5 * s, -0.4), P3(qb, 55.5 * s, -0.4), P3(qa, 55.5 * s, -0.4), glassC);   // curtain wall
        const nm = low ? 1 : 3;
        for (let k = 0; k < nm; k++) { const f = k / nm, px = qa[0] + (qb[0] - qa[0]) * f, pz = qa[1] + (qb[1] - qa[1]) * f; S.box(px + nn[0] * 0.2, 46.5 * s, pz + nn[1] * 0.2, 0.6, 18.5 * s, 0.8, yaw, steel); }
        if (!low) along(0.2, 46.5 * s, 0.5, 0.8, steel);
        along(1.6, 56.2 * s, 1.8, 5, steel);                                       // terrace slab
        along(3.6, 58.6 * s, 3.6, 0.5, steel2);                                    // terrace rail
        // roof umbrella: mast above the lip every third bay with a strut down to the terrace
        if (i % 3 === 0) {
          const lip = (A.yOut + B.yOut) / 2, top = lip + 15;
          const mx = qa[0] - nn[0] * -0.8, mz = qa[1] - nn[1] * -0.8;
          S.box(mx, (56 * s + top) / 2, mz, 1.7, top - 56 * s, 1.7, yaw, steel);
          const ix = qa[0] - nn[0] * 17, iz = qa[1] - nn[1] * 17, yU = lip - 1.6 + (((A.yIn + B.yIn) / 2) - lip) * 17 / Iw;
          S.beam([mx, 56 * s, mz], [ix, yU - 0.4, iz], 1.5, steel);
          if (!low) S.beam([mx, top, mz], [qa[0] - nn[0] * 30, lip + (((A.yIn + B.yIn) / 2) - lip) * 30 / Iw + 0.5, qa[1] - nn[1] * 30], 0.45, dark);
        }
      }
      // roof trusses under the canopy every ~22 ft, inner columns every other
      const tr = stations(poly, low ? 44 : 22);
      tr.forEach((s, i) => {
        const a = [s.p[0], s.yOut - 3.2, s.p[1]], b = [s.p[0] - s.n[0] * Iw, s.yIn - 3.2, s.p[1] - s.n[1] * Iw];
        S.beam(a, b, 1.3, steel2);
        if (i % 2 === 0) S.beam([b[0], Math.max(2, hTopAt(s.idx) - 2), b[2]], [b[0], b[1], b[2]], 1.6, grey);
      });
    }
    // the Gap: footbridge between the two facade pieces
    {
      const a = ringData[0][ringData[0].length - 1], b = ringData[1][0];
      const A = [a.p[0] - a.n[0] * 2, a.p[1] - a.n[1] * 2], B = [b.p[0] - b.n[0] * 2, b.p[1] - b.n[1] * 2];
      const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], len = Math.hypot(B[0] - A[0], B[1] - A[1]), yaw = Math.atan2(B[0] - A[0], B[1] - A[1]);
      S.box(mid[0], 50, mid[1], 11, 3, len, yaw, steel); S.box(mid[0], 56, mid[1], 11.4, 9, len - 2, yaw, glassC);
      S.box(mid[0], 61, mid[1], 12, 1.4, len, yaw, steel2);
    }

    // ---------- gate pavilions: tan stone end towers (photo 1) ----------
    const gateInfo = [];
    for (const g of GATES) {
      const all = ringData.flat();
      let k = 0, bd = 1e9;
      all.forEach((s, i) => { const d = Math.hypot(s.p[0] - g.p[0], s.p[1] - g.p[1]); if (d < bd) { bd = d; k = i; } });
      const c = all[k], n = c.n, t = [-n[1], n[0]], yaw = Math.atan2(n[0], n[1]);
      const q = [c.p[0] - n[0] * 2.5, c.p[1] - n[1] * 2.5];
      gateInfo.push({ q, n, t, yaw });
      const wd = g.main ? 36 : 22, dp = g.main ? 28 : 18;
      for (const sx of [-g.half, g.half]) {
        const px = q[0] + t[0] * sx + n[0] * 5, pz = q[1] + t[1] * sx + n[1] * 5;
        S.box(px, g.h / 2, pz, wd, g.h, dp, yaw, stone);
        S.box(px, g.h + 1.6, pz, wd + 2.4, 3.2, dp + 2.4, yaw, cream);              // cornice cap
        for (let r = 1; r < Math.floor(g.h / 11); r++) S.box(px + n[0] * (dp / 2 + 0.1), r * 11, pz + n[1] * (dp / 2 + 0.1), wd + 0.4, 0.7, 0.5, yaw, stone2);   // reveals
        if (!low) for (let sl = -1; sl <= 1; sl += 1) S.box(px + t[0] * sl * wd * 0.28 + n[0] * (dp / 2 + 0.15), g.h * 0.55, pz + t[1] * sl * wd * 0.28 + n[1] * (dp / 2 + 0.15), 1.6, g.h * 0.62, 0.4, yaw, stone2);
      }
      if (g.main) {                                                                   // entry canopy between the towers
        const cx = q[0] + n[0] * 9, cz = q[1] + n[1] * 9;
        S.box(cx, 20.5, cz, 150, 1.6, 20, yaw, steel);
        for (let k2 = -3; k2 <= 3; k2++) S.box(cx + t[0] * k2 * 22 + n[0] * 8, 10, cz + t[1] * k2 * 22 + n[1] * 8, 1.2, 20, 1.2, yaw, steel);
      }
    }

    // ---------- light towers: lattice masts with a tall portrait bank of lamps (photos 1, 2, 3) ----------
    {
      const TOP = 206, bankH = 48, bankW = 21;
      const towers = TOWERS.concat([0.36, 0.62].map((f) => { const q = BF.P(f * BF.L, -11, 0); return [q[0], q[2], 60]; }));
      towers.forEach(([x, z, base]) => {
        const tgt = [0, -170], yaw = Math.atan2(tgt[0] - x, tgt[1] - z);
        const HT = TOP - bankH - base + 2;
        const tri = [0, 1, 2].map((k) => { const a = yaw + k * 2.094 + 0.5; return [Math.cos(a), Math.sin(a)]; });
        const rB = 7.5, rT = 3.6;
        tri.forEach(([c, s]) => S.beam([x + c * rB, base, z + s * rB], [x + c * rT, base + HT, z + s * rT], 1.5, steel));
        const levels = low ? 5 : 10;
        for (let L = 1; L <= levels; L++) {
          const f = L / levels, y = base + HT * f, r = rB + (rT - rB) * f;
          for (let k = 0; k < 3; k++) {
            const a = tri[k], b = tri[(k + 1) % 3];
            S.beam([x + a[0] * r, y, z + a[1] * r], [x + b[0] * r, y, z + b[1] * r], 0.9, steel);
            if (!low && L < levels) { const r2 = rB + (rT - rB) * ((L + 1) / levels); S.beam([x + a[0] * r, y, z + a[1] * r], [x + b[0] * r2, base + HT * (L + 1) / levels, z + b[1] * r2], 0.7, steel); }
          }
        }
        const cy = base + HT + bankH / 2 - 1, fx = Math.sin(yaw), fz = Math.cos(yaw);
        S.box(x, cy, z, bankW + 1.6, bankH + 1.6, 2.6, yaw, grey);                    // lamp frame
        const rows = low ? 6 : 12, cols = low ? 3 : 5;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const lx = (c - (cols - 1) / 2) * (bankW / cols), ly = cy + (r - (rows - 1) / 2) * (bankH / rows);
          U.box(x + Math.cos(yaw) * lx + fx * 1.6, ly, z - Math.sin(yaw) * lx + fz * 1.6, bankW / cols * 0.8, bankH / rows * 0.72, 0.4, yaw, cream);
        }
      });
    }

    // ---------- left-field board: frame, arch, supports, catwalk, blank faces ----------
    {
      const { mx, mz, nx, nz, L, yaw, P } = BF, y0 = BOARD.y0, H = BOARD.h;
      const ys = (s) => 66 - 28 * (s / L);                                              // stand top under the board (LF corner -> centre)
      // frame
      S.box(...P(L / 2, -2.5, y0 + H / 2 + 1), L + 2, H + 6, 3, yaw, grey);
      S.box(...P(L / 2, -1, y0 - 1.5), L + 2, 3, 6, yaw, steel2);
      S.box(...P(L / 2, -1, y0 + H + 3.2), L + 2, 2, 5, yaw, steel2);
      S.quad(P(0, -4.2, y0 - 1), P(L, -4.2, y0 - 1), P(L, -4.2, y0 + H + 4), P(0, -4.2, y0 + H + 4), brickRed);       // plain back mural panel
      // blank faces: dark panels with a lighter inset
      const faces = [[0, 0.2, 9, 43, '#1b2733', '#26364a'], [0.2, 0.4, 9, 43, '#2f1c1f', '#3d2427'], [0.4, 0.68, 4, 44, '#1d2729', '#26363a'],
        [0.68, 0.8, 10, 40, '#262a30', '#313840'], [0.8, 1, 0, 15, '#2e2a26', '#3a352f'], [0.8, 1, 15.6, 30, '#22262b', '#2d333a'], [0.8, 1, 30.6, 46, '#2e2a26', '#3a352f']];
      for (const [f0, f1, yA, yB, c1, c2] of faces) {
        const s0 = f0 * L + 0.4, s1 = f1 * L - 0.4;
        U.quad(P(s0, 0.3, y0 + yA), P(s1, 0.3, y0 + yA), P(s1, 0.3, y0 + yB), P(s0, 0.3, y0 + yB), K(c1));
        U.quad(P(s0 + 1.8, 0.5, y0 + yA + 1.8), P(s1 - 1.8, 0.5, y0 + yA + 1.8), P(s1 - 1.8, 0.5, y0 + yB - 1.8), P(s0 + 1.8, 0.5, y0 + yB - 1.8), K(c2));
      }
      U.quad(P(1, 0.5, y0 + 3.2), P(0.4 * L - 1, 0.5, y0 + 3.2), P(0.4 * L - 1, 0.5, y0 + 7.6), P(1, 0.5, y0 + 7.6), K('#1f3a30'));   // ticker strip
      // arch over the left part of the board, hangers, plain name banner
      const aEnd = 0.6 * L, segs = low ? 8 : 16, rise = 15, top = y0 + H + 5;
      let prev = null;
      for (let k = 0; k <= segs; k++) {
        const s = aEnd * k / segs, y = top + rise * Math.sin(Math.PI * k / segs), cur = P(s, -1, y);
        if (prev) S.beam(prev, cur, 1.5, steel);
        if (k % 2 === 0 && k > 0 && k < segs) S.beam(cur, P(s, -1, top - 1), 0.6, steel);
        prev = cur;
      }
      for (const s of [0, aEnd]) S.beam(P(s, -1, top - 1), P(s, -1, top), 2, steel);
      // supports and catwalk
      const nsup = 7;
      for (let k = 0; k <= nsup; k++) {
        const s = L * k / nsup, y1 = ys(s) - 3;
        S.box(...P(s, -2, (y1 + y0) / 2), 2.8, y0 - y1, 2.8, yaw, steel2);
        if (k % 2 === 0) S.beam(P(s, -17, y1), P(s, -2, y0 + 8), 1.2, steel2);
      }
      S.box(...P(L / 2, -6, y0 - 0.2), L, 0.6, 6, yaw, steel2);
      S.box(...P(L / 2, -9, y0 + 1.8), L, 3.6, 0.4, yaw, steel2);
      // banner with the ballpark name (plain text)
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#e4dcc4'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b3a5c'; g.font = 'bold 56px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('GREAT AMERICAN BALL PARK', w / 2, h / 2 + 3);
      }, 1024, 96);
      const ban = ctx.add(new THREE.PlaneGeometry(aEnd - 14, 7.2), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      const bp = P(aEnd / 2, 0.8, top + 3.6); ban.position.set(bp[0], bp[1], bp[2]); ban.rotation.y = yaw;
      ctx.views.board = { pos: [mx + nx * 230, 70, mz + nz * 230], look: [mx, y0 + 18, mz], label: 'Left Field Board' };
    }

    // ---------- right-field board on a truss behind the bleachers (photos 2 and 7: red-backed boards, towers beside) ----------
    {
      const c = tools.wallAt(37, 46, 0), cx = c.x, cz = c.z, yaw = Math.atan2(-cx, -cz), cs = Math.cos(yaw), sn = Math.sin(yaw);
      const P = (u, off, y) => [cx + cs * u + sn * off, y, cz - sn * u + cs * off];           // u along the board, off toward home
      const y0 = 56, Wd = 84, Ht = 28;
      S.box(...P(0, -1.5, y0 + Ht / 2), Wd + 2, Ht + 5, 2.4, yaw, grey);
      S.quad(P(-Wd / 2, -2.9, y0 - 1), P(Wd / 2, -2.9, y0 - 1), P(Wd / 2, -2.9, y0 + Ht + 3), P(-Wd / 2, -2.9, y0 + Ht + 3), brickRed);
      for (const [f0, f1, c1, c2] of [[-0.5, -0.12, '#1d2729', '#27373b'], [-0.1, 0.0, '#2a2e33', '#343b42'], [0.02, 0.5, '#2f1c1f', '#3d2427']]) {
        U.quad(P(f0 * Wd + 0.6, 0.2, y0 + 1), P(f1 * Wd - 0.6, 0.2, y0 + 1), P(f1 * Wd - 0.6, 0.2, y0 + Ht - 1), P(f0 * Wd + 0.6, 0.2, y0 + Ht - 1), K(c1));
        U.quad(P(f0 * Wd + 2, 0.4, y0 + 3), P(f1 * Wd - 2, 0.4, y0 + 3), P(f1 * Wd - 2, 0.4, y0 + Ht - 3), P(f0 * Wd + 2, 0.4, y0 + Ht - 3), K(c2));
      }
      for (const u of [-Wd / 2, -Wd / 6, Wd / 6, Wd / 2]) { S.box(...P(u, -2, (y0 + 38) / 2), 2.6, y0 - 38, 2.6, yaw, steel2); }
      S.box(...P(0, -5, y0 - 0.5), Wd, 0.6, 5, yaw, steel2);
    }

    // ---------- batter's eye pavilion details, right-centre riverboat stacks, flagpoles ----------
    {
      const wx = (deg, out) => { const r = tools.wallR(ctx.spec, deg) + out, a = deg * D2R; return [r * Math.sin(a), -r * Math.cos(a)]; };
      // roof deck, rail and mullions on the dark glass front
      const [p, n] = tools.span(-9, 7.5);
      sweepC(p, n, () => [[0.4, 41], [0.4, 41.8], [48, 41.8], [48, 41]], [grey, grey, 0, 0], grey);
      sweepC(p, n, () => [[1.0, 41.8], [1.0, 45.5], [1.5, 45.5], [1.5, 41.8]], [steel2, steel2, 0, 0], steel2);
      for (let i = 2; i < p.length - 1; i += low ? 14 : 7) S.box(p[i][0] + n[i][0] * 1.4, 21, p[i][1] + n[i][1] * 1.4, 0.7, 40, 0.6, Math.atan2(n[i][0], n[i][1]), K('#4a5b62'));
      // pilot house on the left part of the roof, with a cupola and a small mast
      const ph = wx(-5, 16), pyaw = 0;
      S.box(ph[0], 54, ph[1], 40, 24, 24, pyaw, cream);
      S.box(ph[0], 66.2, ph[1], 46, 2.4, 30, pyaw, K('#a9683c'));
      S.box(ph[0], 71.5, ph[1], 16, 8.5, 11, pyaw, cream);
      S.box(ph[0], 76.4, ph[1], 19, 1.6, 14, pyaw, K('#a9683c'));
      S.quad([ph[0] - 19, 49, ph[1] + 12.1], [ph[0] + 19, 49, ph[1] + 12.1], [ph[0] + 19, 60, ph[1] + 12.1], [ph[0] - 19, 60, ph[1] + 12.1], glassD);
      S.beam([ph[0] + 5, 77, ph[1]], [ph[0] + 5, 99, ph[1]], 0.5, steel);
      // two stacks on a deck house behind the right-centre wall (photo 3): banded shafts with a flared crown, two blank round screens
      const s0 = wx(9, 22), s1 = wx(13, 22), bY = 21, top = 76;
      const hm = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2], hyaw = Math.atan2(-hm[0], -hm[1]);
      S.box(hm[0], bY + 7, hm[1], 64, 14, 22, hyaw, K('#c9bfa2'));
      S.box(hm[0], bY + 14.8, hm[1], 66, 1.6, 24, hyaw, redBand);
      const fx = Math.sin(hyaw), fz = Math.cos(hyaw);
      for (const s of [-1, 1]) {
        const cxp = hm[0] + Math.cos(hyaw) * s * 15 + fx * 11.3, czp = hm[1] - Math.sin(hyaw) * s * 15 + fz * 11.3;
        S.cyl(cxp, bY + 7, czp, 6.2, 6.2, 0.9, 20, cream, true, hyaw);
        U.cyl(cxp + fx * 0.6, bY + 7, czp + fz * 0.6, 5.2, 5.2, 0.5, 20, K('#22383c'), true, hyaw);
      }
      U.quad([hm[0] - Math.cos(hyaw) * 14 + fx * 11.3, bY + 1.5, hm[1] + Math.sin(hyaw) * 14 + fz * 11.3], [hm[0] + Math.cos(hyaw) * 14 + fx * 11.3, bY + 1.5, hm[1] - Math.sin(hyaw) * 14 + fz * 11.3],
        [hm[0] + Math.cos(hyaw) * 14 + fx * 11.3, bY + 5.2, hm[1] - Math.sin(hyaw) * 14 + fz * 11.3], [hm[0] - Math.cos(hyaw) * 14 + fx * 11.3, bY + 5.2, hm[1] + Math.sin(hyaw) * 14 + fz * 11.3], K('#2a2f33'));
      for (const sp of [s0, s1]) {
        const x = sp[0], z = sp[1], Hs = top - bY - 15;
        S.cyl(x, bY + 15 + Hs / 2, z, 3.6, 4.4, Hs, 14, K('#7a2f2c'));
        for (const f of [0.22, 0.55, 0.88]) S.cyl(x, bY + 15 + Hs * f, z, 4.6, 4.6, 3.2, 14, cream);
        S.cyl(x, top + 3, z, 6.6, 4.0, 6, 14, cream);
        S.cyl(x, top + 7, z, 4.2, 4.2, 1.6, 14, K('#6e2926'));
      }
      // flagpoles on the left-centre bank and the right bleachers (plain small flags)
      const flag = (xz, base, h, c) => {
        S.beam([xz[0], base, xz[1]], [xz[0], base + h, xz[1]], 0.5, steel);
        const d = [Math.cos(0.3) * 6.5, -Math.sin(0.3) * 6.5];
        S.quad([xz[0], base + h, xz[1]], [xz[0] + d[0], base + h, xz[1] + d[1]], [xz[0] + d[0], base + h - 4.2, xz[1] + d[1]], [xz[0], base + h - 4.2, xz[1]], c);
      };
      flag(wx(-12, 40), 38, 32, K('#a64a42')); flag(wx(-15, 40), 40, 32, K('#c9bfa2'));
      flag(wx(20, 36), 46, 30, K('#a64a42')); flag(wx(24, 36), 48, 30, K('#c9bfa2'));
    }

    // ---------- ribbon boards: blank LED strips on the fascia of the upper block ----------
    {
      const run = (a, b) => {
        if (b - a < 2) return;
        const pp = bPts.slice(a, b + 1), nn = bN.slice(a, b + 1);
        sweepC(pp, nn, (i) => { const g = a + i, d0 = deck.d0(g), h0 = deck.h0(g); return [[d0 - 0.9, h0 - 6.2], [d0 - 0.9, h0 - 3], [d0 - 0.3, h0 - 3], [d0 - 0.3, h0 - 6.2]]; }, [K('#1c2528'), K('#1c2528'), 0, 0], K('#1c2528'), U);
      };
      run(4, 114); run(124, 214);
    }

    // ---------- foul poles a little taller (photo 4) ----------
    for (const pl of ctx.parts.poles) { pl.scale.y = 1.2; pl.position.y = 36; }

    S.mesh(mLit); U.mesh(mUnlit);

    // ---------- views ----------
    const g1 = gateInfo[0];
    ctx.views.gate = { pos: [g1.q[0] + g1.n[0] * 230, 22, g1.q[1] + g1.n[1] * 230], look: [g1.q[0], 48, g1.q[1]], label: 'Main Gate' };
    ctx.views.roof = { pos: [430, 150, 180], look: [-40, 60, 120], label: 'Roof Edge' };
    const sd = tools.foulAt(0.72, 124, 78);
    ctx.views.stands = { pos: [sd.x, sd.y, sd.z], look: [120, 0, -230], label: 'Left Side Stands' };
  },
};
