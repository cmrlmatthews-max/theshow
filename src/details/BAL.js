// Detail module: Oriole Park at Camden Yards, Baltimore (opened 1992). Units: feet.
// MEASURED FROM THE SURVEY SHEET (survey.png, 1.1 px/ft, home plate = origin, home at mosaic 733,755; second base 807,635):
//  - Outer edge of the green upper-deck roof, 25 stations: right-field end (344,-128), along the first-base side to
//    (236,28), behind home (0,218), up the third-base side to (-425,-200), around the left-field corner
//    (-408,-274) / (-363,-376), and along the long left-field diagonal to its end at (-202,-486). The roof is a
//    shed roof: ~45 ft wide behind home, ~55 ft on the first-base side, 65-80 ft on the left-field side.
//  - Outfield wall corners (2024 layout): LF pole (-235,-235), (-244,-278), (-228,-300), LCF (-131,-353), bullpen
//    notch (-105,-346), deep LCF (-50,-400), CF (30,-402), RCF (120,-355), (168,-305), RF pole (222,-231).
//  - B&O warehouse west wall: line from (148,-600) to (435,-50), 1016 ft long, ~56 ft wide, runs along Eutaw Street.
//  - Batter's eye block x -52..36, z -405..-462 with the lounge and gray roof behind it (x -20..85, z -462..-520).
//  - Left-center bullpens x -150..-55, z -470..-405 (two lawn bullpens, picnic terrace behind).
//  - Right-field stands are shallow (two blocks, ~55-60 ft); left-field stands are as deep as the foul-side bowl (~150 ft).
// FROM TEXT SOURCES (Wikipedia): wall heights (7 ft, right field 21 ft), warehouse length 1016 ft, scoreboard in
//  right field below the flag court, bullpens in left-center, lounge on the batter's eye, field 16 ft below the street.
// LEVEL 4 (photographs 1-8 in refs/BAL, PHOTOS.md):
//  A FACADE (photo 1): cream precast base 0-18 ft with steps, dark recessed openings 18-33 ft under a cream string course (33-38),
//    brick piers with round-headed windows (39-51), stepped cream cornice (52-58), open steel frame with dark glazing up to the eave;
//    bays ~28 ft (was 16); gate towers 44 ft wide x 76 ft tall with a glass slot (17-66 ft) under an arched head, cream quoins and bands,
//    awning, and a plain ballpark-name sign (cream letters on a dark panel) above the home-plate gate; flagpoles along the eave.
//  B HEIGHTS (method): facade cornice 58 ft and tower 76 ft: photo 1, door (8 ft) and lamp-post scale, 4.4 px/ft at the entrance plane;
//    string course 38 ft, same photo. Photo 3 (from the back of the upper deck behind home): pinhole fit from home plate, mound and the
//    centre-field wall gives camera 171 ft behind the plate and 84 ft above the field (horizon row 176, focal 636 px from the wall width
//    LF pole to RF pole); that sets the upper-deck seat plane at 80 ft at 115 ft from the front edge (tier slopes below), the
//    batter's eye 37 ft, the roof front edge about 122-126 ft (roof inner edge Y_IN 122, eave Y_OUT 80 from photos 1 and 3), the light
//    bank centre about 172 ft, the scoreboard face 69-103 ft, ad row 31-69 ft, clock crown to about 135 ft, and the B&O warehouse about
//    112-115 ft. Photo 7 gives the board ratios (face 255 px of 370 px frame; 3.35 px/ft). Rake: lower deck 0.42 (1.26 ft per 3 ft row),
//    upper 0.58 (1.7 ft per row); not measured by row count.
//  C SEATING (sheet, luminance profiles along the bowl normals every 0.05 of t; D0/DL/DEND tables above): first-base side and behind
//    home: lit lower seats end 50-65 ft from the front edge, the club/upper tier starts there (no gap) and runs to 122-138 ft (roof
//    inner edge + 6); third-base side: lower deck ends 78-95 ft, a dark gap of about 10 ft, then the mid/upper tier from 88-105 ft to
//    144-152 ft. The roof outer edge is 145-205 ft from the front edge (it is the wide shed roof on the left-field side).
//    Right-field seats: 58 ft deep, rake 0.38 (stand top about 32 ft, from photo 7); left-field seats 140 ft deep.
//  D BOARDS: main scoreboard and video board in right-center behind the stands, centred at (108, -410) facing home plate (photos 3, 6, 7:
//    its left column touches the end of the batter's eye; the sheet footprint x 153-189 is the Eutaw Street steel behind it):
//    frame of 4 lattice columns (+-56 ft), two catwalk levels with back rails, top truss, blank video face 80 x 34 ft with frame,
//    three blank lower panels, header band, plain clock crown with two finial posts, two flagpoles. Roof-deck canopy on the batter's eye
//    (photo 7), ribbon boards (blank dark strips) along the upper-deck front fascia (photo 5), light banks (photo 3): two lattice masts
//    per tower and a 90 ft truss with lamp panel at about 172 ft.
// FROM TEXT SOURCES (Wikipedia): wall heights (7 ft, right field 21 ft), warehouse length 1016 ft, scoreboard in
//  right field below the flag court, bullpens in left-center, lounge on the batter's eye, field 16 ft below the street.
// STILL ESTIMATED: roof widths (ROOF_W), roof pitch, gate tower positions, bullpen layout, flag court depth, warehouse window rhythm,
//  tier rake (no row count), rise between lower and club tier (17 ft first base side, 10 ft third base side), the board's depth and
//  catwalk spacing, light-mast positions (kept from the earlier sheet reading), left-field seat rake and the left-field tier split.
const D2R = Math.PI / 180;
// Roof outer edge, right-field end -> behind home -> left-field end -> end of the left-field diagonal. [x, z]
const ROOF_OUT = [[344, -128], [320, -88], [292, -40], [262, -5], [236, 28], [205, 66], [172, 112], [135, 155], [95, 190], [50, 212],
  [0, 218], [-50, 214], [-100, 200], [-150, 172], [-195, 128], [-228, 100], [-265, 60], [-322, 0], [-377, -100], [-425, -200],
  [-408, -274], [-393, -308], [-363, -376], [-348, -389], [-202, -486]];
// Roof width (outer edge to inner edge) as a function of the fraction of the arc length.
const ROOF_W = [[0, 52], [0.2, 55], [0.4, 46], [0.5, 44], [0.62, 50], [0.78, 66], [0.9, 72], [1, 76]];
const FAC_H = 58, TOWER_H = 76, Y_OUT = 80, Y_IN = 122, ROOF_T = 3.5;
const WALL_PTS = [[-244, -278], [-228, -300], [-131, -353], [-105, -346], [-50, -400], [30, -402], [120, -355], [168, -305]];
// B&O warehouse: west wall line and extent
const WH = { a: [148, -600], b: [435, -50], len: 1016, w: 56, h: 112, t0: -250 };

// Bowl tables sampled every 0.05 of the bowl path (t 0 = right-field pole, 0.5 = behind home, 1 = left-field pole), in feet from the
// front edge of the foul-side seats, read along the normal on the survey sheet (see top comment).
//   D0   = where the club/upper tier starts (first-base side: right behind the lit lower seats; third-base side: behind the dark gap)
//   DL   = back of the lower deck (first-base side it runs 14 ft under the club overhang; third-base side it ends at the gap)
//   DEND = back of the upper-deck seats (roof inner edge + ~6 ft)
const D0 = [58, 62, 58, 64, 62, 58, 56, 55, 52, 52, 56, 92, 90, 92, 88, 88, 105, 105, 105, 105, 105];
const DL = D0.map((v, i) => (i <= 10 ? v + 14 : v - 10));
const DEND = [122, 124, 126, 128, 132, 132, 132, 130, 128, 130, 138, 144, 144, 146, 148, 148, 152, 152, 152, 152, 152];
const zip = (a) => a.map((v, i) => [i / (a.length - 1), v]);

const ang = (x, z) => Math.atan2(x, -z) / D2R;
const rad = (x, z) => Math.hypot(x, z);

export default {
  config(rec) {
    const cor = (x, z, h) => ({ deg: ang(x, z), r: rad(x, z), h });
    const w = [{ deg: -45, r: 333, h: 7 }];
    const lf = [[-244, -278], [-228, -300], [-131, -353], [-105, -346], [-50, -400]];
    lf.forEach(([x, z]) => w.push(cor(x, z, 7)));
    w.push(cor(30, -402, 7), cor(120, -355, 7), cor(168, -305, 7));
    // right-field wall steps up to 21 ft after the right-center corner
    w.push({ ...cor(168, -305, 7), deg: ang(168, -305) + 0.05, h: 21 });
    w.push({ deg: 45, r: 318, h: 21 });
    return {
      wall: w,
      foulScale: 1,
      backstop: 56,
      lower: { depth: zip(DL), slope: 0.42, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: zip(DL.map((v, i) => v - D0[i])), rise: [[0, 17], [0.5, 17], [0.55, 10], [1, 10]], depth: zip(DEND.map((v, i) => v - D0[i])), slope: 0.58, extent: [0.04, 0.96] },
      outfield: { depth: 58, slope: 0.5, spans: [[-45, -20.4, 140, 0.5], [5.1, 45, 58, 0.38]], eye: null, eyeHeight: 36, eyeDepth: 50 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f5846', facade: '#8a5742', wall: '#26402f', cream: '#d9cdb0' },
    };
  },

  build(ctx) {
    const { THREE, G, parts, views, tools, dims } = ctx;
    const { sweepSolid, textTexture, clamp } = tools;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });
    ctx.remove(parts.lights); ctx.remove(parts.scoreboard); ctx.remove(parts.batterEye);

    // ---------- helpers
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      if (!mats.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    // One instanced box kit with per-instance colors: every plain box in the module goes into this single draw call.
    const KIT = [], KC = [];
    const kit = (m, col) => { KIT.push(m); KC.push(new THREE.Color(col)); };
    const kbox = (x0, x1, y0, y1, z0, z1, col) => kit(mat4((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, x1 - x0, y1 - y0, z1 - z0), col);
    const beam = (a, b, th) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    const rep = (t, rx, ry) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t; };
    // resample a polyline to roughly equal spacing; outward normals (away from the field), cumulative length
    const resample = (poly, step) => {
      const pts = [];
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
        for (let k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      pts.push(poly[poly.length - 1]);
      const nr = pts.map((p, i) => {
        const a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 2)];
        let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * (p[0] + 10) + nz * (p[1] + 150) < 0) { nx = -nx; nz = -nz; }
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
    const loc = (fr, lx, lz) => [fr.x + lx * fr.nz + lz * fr.nx, fr.z - lx * fr.nx + lz * fr.nz];   // lx along wall, lz outward
    const strip = (P, Q, uLen, vRep) => {
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

    const mergeGeo = (gs) => {
      const pos = [], uv = [];
      gs.forEach((g) => { pos.push(...g.attributes.position.array); uv.push(...g.attributes.uv.array); });
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals(); return g;
    };

    // ---------- materials
    const brickCol = '#8a5742', creamCol = '#d9cdb0', roofCol = '#5f7b77', steelCol = '#2f3d3a', glassCol = '#26343a';
    const mBrick = lam(brickCol), mCream = lam(creamCol), mSteel = lam(steelCol), mGlass = basic(glassCol);
    const brickTex = rep(textTexture((g, w, h) => {
      g.fillStyle = brickCol; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(40,20,10,0.22)';
      for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 1);
      for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { g.fillRect(x, y, 1, 8); g.fillRect(x + 8, y + 8, 1, 8); }
    }, 64, 64), 1, 1);
    const mBrickT = new THREE.MeshLambertMaterial({ map: brickTex, side: THREE.DoubleSide });

    // ======================================================================================================
    // ROOF: one shed roof (green steel) over the rear of the upper deck, outer edge measured on the sheet.
    // ======================================================================================================
    const OUT = resample(ROOF_OUT, low ? 30 : 20);
    const widthAt = (f) => { for (let i = 1; i < ROOF_W.length; i++) if (f <= ROOF_W[i][0]) { const [f0, w0] = ROOF_W[i - 1], [f1, w1] = ROOF_W[i]; return w0 + (w1 - w0) * (f - f0) / (f1 - f0); } return ROOF_W[ROOF_W.length - 1][1]; };
    const IN = OUT.pts.map((p, i) => { const w = widthAt(OUT.cum[i] / OUT.L); return [p[0] - OUT.nr[i][0] * w, p[1] - OUT.nr[i][1] * w]; });
    const V3 = (p, y) => new THREE.Vector3(p[0], y, p[1]);
    const Atop = OUT.pts.map((p) => V3(p, Y_OUT)), Abot = OUT.pts.map((p) => V3(p, Y_OUT - ROOF_T));
    const Btop = IN.map((p) => V3(p, Y_IN)), Bbot = IN.map((p) => V3(p, Y_IN - ROOF_T)), Bfr = IN.map((p) => V3(p, Y_IN - 8));
    {
      const topTex = rep(textTexture((g, w, h) => {
        g.fillStyle = roofCol; g.fillRect(0, 0, w, h); g.fillStyle = '#4f6965'; g.fillRect(0, 0, 3, h); g.fillRect(w / 2, 0, 2, h);
      }, 64, 64), 1, 1);
      const underTex = rep(textTexture((g, w, h) => {
        g.fillStyle = '#4a5654'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a3432'; g.lineWidth = 3; g.strokeRect(1, 1, w - 2, h - 2);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
      }, 64, 64), 1, 1);
      const wAvg = 58;
      const dbl = (m) => { m.side = THREE.DoubleSide; return m; };
      ctx.add(strip(Atop, Btop, 24, wAvg / 24), dbl(new THREE.MeshLambertMaterial({ map: topTex })));
      ctx.add(strip(Abot, Bbot, 24, wAvg / 24), dbl(new THREE.MeshLambertMaterial({ map: underTex })));
      const fas = strip(Abot, Atop, 40, 1), endsG = [0, OUT.pts.length - 1].map((k) => strip([Abot[k], Bbot[k]], [Atop[k], Btop[k]], 40, 1));
      ctx.add(mergeGeo([fas, ...endsG]), lam('#7b8d89'));                   // outer fascia and the two end faces
      ctx.add(strip(Bfr, Btop, 16, 1), dbl(lam('#3f4c49')));   // dark steel fascia on the front edge of the roof
      // frame: column over the facade, rafter under the deck, raker brace
      const steel = [], step = low ? 2 : 1;
      for (let i = 0; i < OUT.pts.length; i += step) {
        const A = OUT.pts[i], B = IN[i], lerp = (w) => [A[0] + (B[0] - A[0]) * w, A[1] + (B[1] - A[1]) * w];
        const c0 = lerp(0.03), g1 = lerp(0.97), m = lerp(0.5);
        steel.push(beam([c0[0], FAC_H, c0[1]], [c0[0], Y_OUT - ROOF_T, c0[1]], 2.2));
        steel.push(beam([c0[0], Y_OUT - ROOF_T - 3, c0[1]], [g1[0], Y_IN - ROOF_T - 3, g1[1]], 1.6));
        if (!low) {
          steel.push(beam([c0[0], FAC_H + 2, c0[1]], [m[0], (Y_OUT + Y_IN) / 2 - ROOF_T - 4, m[1]], 1.2));
          steel.push(beam([m[0], (Y_OUT + Y_IN) / 2 - ROOF_T - 4, m[1]], [g1[0], Y_IN - ROOF_T - 3, g1[1]], 1.0));
        }
      }
      steel.forEach((m) => kit(m, steelCol));
      // roof support columns standing on the upper deck, every other station on the inner third
      const cols = [];
      for (let i = 1; i < OUT.pts.length; i += low ? 4 : 2) {
        const A = OUT.pts[i], B = IN[i], q = [A[0] + (B[0] - A[0]) * 0.8, A[1] + (B[1] - A[1]) * 0.8];
        cols.push(beam([q[0], dims.hTop - 24, q[1]], [q[0], Y_IN - ROOF_T - 4 - (Y_IN - Y_OUT) * 0.2, q[1]], 1.8));
      }
      cols.forEach((m) => kit(m, steelCol));
    }

    // ======================================================================================================
    // FACADE (photo 1, street view of the entrance): cream precast base with steps (0-18 ft), dark recessed openings under a cream
    // string course (18-38 ft), brick piers with round-arched windows (39-51 ft), stepped cream cornice (52-58 ft), then an open steel
    // frame with dark glazing up to the roof eave. Gate towers 44 ft wide, 76 ft tall, with a tall glass slot and an arched head.
    // Outer edge of the roof - 4 ft.
    // ======================================================================================================
    const FAC = resample(ROOF_OUT, 8);
    FAC.pts = FAC.pts.map((p, i) => [p[0] - FAC.nr[i][0] * 4, p[1] - FAC.nr[i][1] * 4]);
    {
      const prof = () => [[-3, 0], [1.2, 0], [1.2, 18], [1.8, 18], [1.8, 19.6], [0, 19.6], [0, 33], [1.7, 33], [1.7, 38], [0, 38], [0, 52],
        [2.2, 52], [2.2, 55], [3.2, 55], [3.2, FAC_H], [-3, FAC_H]];
      ctx.add(sweepSolid(FAC.pts, FAC.nr, prof, [-1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, -1], 0), [mBrickT, mCream]);
    }
    const gateF = low ? [0.1, 0.34, 0.5, 0.78] : [0.08, 0.2, 0.35, 0.5, 0.65, 0.8, 0.92];
    const gates = gateF.map((f) => f * FAC.L);
    const nearGate = (s, pad) => gates.some((g) => Math.abs(s - g) < pad);
    // the home-plate gate is the one nearest to (0, 218); it carries the plain ballpark-name sign
    const homeGate = gates.reduce((b, s) => { const f = frameAt(FAC, s); return Math.hypot(f.x, f.z - 218) < b.d ? { s, d: Math.hypot(f.x, f.z - 218), f } : b; }, { s: -1, d: 1e9 });
    {
      // round-headed window shape: width 1, straight part `st`, semicircular head of radius 0.5
      const archShape = (st) => { const sh = new THREE.Shape(); sh.moveTo(-0.5, 0); sh.lineTo(0.5, 0); sh.lineTo(0.5, st); sh.absarc(0, st, 0.5, 0, Math.PI, false); sh.lineTo(-0.5, 0); return new THREE.ShapeGeometry(sh, low ? 5 : 8); };
      const archWin = archShape(0.2), archTall = archShape(3.0), archSur = archShape(0.2), archSurTall = archShape(2.1);
      const win = [], sur = [], rect = [], pil = [], tallWin = [], tallSur = [];
      const BAY = low ? 40 : 28;
      const nb = Math.floor(FAC.L / BAY), step = FAC.L / nb;
      for (let k = 0; k < nb; k++) {
        const s = (k + 0.5) * step, fr = frameAt(FAC, s);
        if (!nearGate(s, 30)) {
          const p = loc(fr, 0, 0.3), p2 = loc(fr, 0, 0.18);
          win.push(mat4(p[0], 39.6, p[1], 17, 17, 1, fr.ry));                  // arched window, 12 ft tall
          sur.push(mat4(p2[0], 38.6, p2[1], 19.4, 19.4, 1, fr.ry));            // cream arch surround
          rect.push(mat4(p[0], 26.4, p[1], 18, 13.2, 1, fr.ry));               // dark recessed opening under the string course
          if (!low) { const pa = loc(fr, 0, 0.3); rect.push(mat4(pa[0], 64.5, pa[1], step - 5, 11, 1, fr.ry)); }   // dark glazing in the open frame
        }
        const q = loc(fr, step / 2, 0.8);
        pil.push(mat4(q[0], (19.6 + 52) / 2, q[1], 2.2, 52 - 19.6, 1.6, fr.ry));
      }
      pil.forEach((m) => kit(m, creamCol));
      // gate towers
      const tw = [], cap = [], band = [], awn = [], quoin = [], signs = [];
      gates.forEach((s, gi) => {
        const fr = frameAt(FAC, s), p = loc(fr, 0, 6), TW = 44;
        tw.push(mat4(p[0], TOWER_H / 2, p[1], TW, TOWER_H, 16, fr.ry));
        cap.push(mat4(p[0], TOWER_H + 1.5, p[1], TW + 4, 3, 20, fr.ry));
        band.push(mat4(p[0], 37, p[1], TW + 1.2, 2.6, 17.2, fr.ry));
        band.push(mat4(p[0], 52, p[1], TW + 1.2, 1.6, 17.2, fr.ry));
        for (const sx of [-1, 1]) { const q = loc(fr, sx * (TW / 2 - 1.2), 14.2); quoin.push(mat4(q[0], (19.6 + TOWER_H) / 2, q[1], 2.4, TOWER_H - 19.6, 1.2, fr.ry)); }
        const g1 = loc(fr, 0, 14.3), g2 = loc(fr, 0, 14.2);
        tallWin.push(mat4(g1[0], 17, g1[1], 14, 14, 1, fr.ry));               // glass slot with an arched head: 17 -> 66 ft
        tallSur.push(mat4(g2[0], 15.5, g2[1], 20, 20, 1, fr.ry));             // cream surround of the arch
        const dr = loc(fr, 0, 14.4); rect.push(mat4(dr[0], 6, dr[1], 15, 11, 1, fr.ry));   // entrance doors under the awning
        const aw = loc(fr, 0, 18); awn.push(mat4(aw[0], 14.5, aw[1], 17, 1.4, 8, fr.ry));  // dark green awning
        if (s === homeGate.s) signs.push(fr);
      });
      tw.forEach((m) => kit(m, brickCol)); cap.concat(band, quoin).forEach((m) => kit(m, creamCol)); awn.forEach((m) => kit(m, '#2d4a3c'));
      rect.forEach((m) => kit(m, glassCol));
      inst(archWin, mGlass, win);
      inst(archTall, mGlass, tallWin);
      inst(archSur, mCream, sur);
      inst(archSurTall, mCream, tallSur);
      // plain ballpark-name sign above the home gate (cream letters on a dark panel)
      signs.forEach((fr) => {
        const pn = loc(fr, 0, 14.2), pf = loc(fr, 0, 15.4);
        kit(mat4(pn[0], TOWER_H + 9.5, pn[1], 46, 12, 2, fr.ry), '#2f3d3a');
        const tex = textTexture((g, w, h) => {
          g.fillStyle = '#2f3d3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8dcbc'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 62px Georgia, serif';
          g.fillText('ORIOLE PARK', w / 2, h * 0.28); g.fillText('CAMDEN YARDS', w / 2, h * 0.74);
        }, 512, 128);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(44, 11), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(pf[0], TOWER_H + 9.5, pf[1]); m.rotation.y = fr.ry; G.add(m);
      });
    }

    // ======================================================================================================
    // B&O WAREHOUSE: 1016 ft brick block along Eutaw Street beyond right field
    // ======================================================================================================
    {
      const d = new THREE.Vector2(WH.b[0] - WH.a[0], WH.b[1] - WH.a[1]).normalize();
      const nE = new THREE.Vector2(-d.y, d.x); if (nE.x < 0) nE.multiplyScalar(-1);   // pointing east, away from the park
      const at = (t, o) => new THREE.Vector2(WH.a[0], WH.a[1]).addScaledVector(d, t).addScaledVector(nE, o);
      const mid = at(WH.t0 + WH.len / 2, WH.w / 2), ry = Math.atan2(d.x, d.y);
      kit(mat4(mid.x, WH.h / 2, mid.y, WH.w, WH.h, WH.len, ry), brickCol);                         // brick core
      kit(mat4(mid.x, WH.h + 1.2, mid.y, WH.w + 2, 2.6, WH.len + 2, ry), '#cfc3a4');                // cornice / parapet
      kit(mat4(mid.x, WH.h + 3.6, mid.y, WH.w - 8, 2.2, WH.len - 8, ry), '#4a5558');                // dark roof
      const west = at(WH.t0 + WH.len / 2, -6);
      kit(mat4(west.x, 17, west.y, 12, 1.6, WH.len, ry), '#3d4a47');                                // replica ground-floor canopy
      for (const t of [WH.t0 + 120, WH.t0 + WH.len / 2, WH.t0 + WH.len - 120]) { const c = at(t, WH.w / 2); kit(mat4(c.x, WH.h + 12, c.y, 14, 18, 14, ry), creamCol); }
      // window faces: two long planes (west face looks at the park, east face at the street)
      const sideTex = rep(textTexture((g, w, h) => {      // brick with 7 rows of windows, one bay per 20 ft
        g.fillStyle = brickCol; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(40,20,10,0.2)';
        for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 1);
        g.fillStyle = '#2b363c';
        for (let r = 0; r < 7; r++) g.fillRect(14, 10 + r * 17, 36, 11);
        g.fillStyle = '#d2c6a8'; g.fillRect(0, h - 5, w, 5); g.fillRect(0, 0, w, 3);
      }, 64, 128), WH.len / 20, 1);
      const mWs = new THREE.MeshLambertMaterial({ map: sideTex, side: THREE.DoubleSide });
      const pw = at(WH.t0 + WH.len / 2, -0.15), pe = at(WH.t0 + WH.len / 2, WH.w + 0.15);
      const m1 = new THREE.Matrix4().compose(new THREE.Vector3(pw.x, WH.h / 2, pw.y), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.atan2(-nE.x, -nE.y), 0)), new THREE.Vector3(WH.len, WH.h, 1));
      const m2 = new THREE.Matrix4().compose(new THREE.Vector3(pe.x, WH.h / 2, pe.y), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.atan2(nE.x, nE.y), 0)), new THREE.Vector3(WH.len, WH.h, 1));
      inst(new THREE.PlaneGeometry(1, 1), mWs, [m1, m2]);
    }

    // ======================================================================================================
    // RIGHT FIELD: flag court terrace over the 21 ft wall
    // ======================================================================================================
    {
      const [p, n, dg] = tools.span(34, 44.5);
      const wh = (i) => tools.wallH(ctx.spec, dg[i]);
      ctx.add(sweepSolid(p, n, (i) => [[1, wh(i)], [1, wh(i) + 1.2], [20, wh(i) + 1.2], [20, wh(i)]], [2, 2, 2, 2], 2), ctx.M);
      if (!low) ctx.add(sweepSolid(p, n, (i) => [[1.2, wh(i) + 1.2], [1.2, wh(i) + 5], [1.6, wh(i) + 5], [1.6, wh(i) + 1.2]], [1, 1, 1, 1], 1), [mSteel, mSteel]);
    }

    // ======================================================================================================
    // MAIN SCOREBOARD / VIDEO BOARD (photos 3, 6, 7, 8): stands on the back of the right-center stands, centred at (168, -405) on the sheet
    // (steel frame footprint along Eutaw Street at x 153..189, z -435..-373), facing home plate. Sizes by pinhole scale in photo 3 and by
    // ratios in photo 7: video face 80 x 34 ft (69-103 ft up), lower row of three blank panels 96 x 38 ft (31-69 ft), header band 12 ft,
    // clock crown to about 135 ft, lattice columns at +-56 ft. Faces are blank dark panels.
    // ======================================================================================================
    {
      const BX = 108, BZ = -410, fl = Math.hypot(BX, BZ), fx = -BX / fl, fz = -BZ / fl;     // f = unit vector toward home
      const rx = -(-fz), rz = -fx;                                                           // right-hand axis seen from home
      const bry = Math.atan2(fx, fz);
      const P = (u, v, w) => [BX + rx * u + fx * w, v, BZ + rz * u + fz * w];
      const bb = (u, v, w, sx, sy, sz, col) => { const q = P(u, v, w); kit(mat4(q[0], q[1], q[2], sx, sy, sz, bry), col); };
      const bm = (a, b, th, col) => kit(beam(P(...a), P(...b), th), col);
      const dark = '#16221d', panelCol = '#26332e', frameCol = '#3a4743', steel2 = '#2b3835';
      // lower row of blank ad panels, video face, header band
      bb(-35.5, 50, 1.5, 23, 36, 3, panelCol); bb(-1, 50, 1.5, 44, 36, 3, '#1d2b25'); bb(36.5, 50, 1.5, 23, 36, 3, panelCol);
      bb(0, 50, -3, 98, 40, 6, steel2);                                                      // body behind the lower row
      bb(0, 86, 0, 84, 38, 8, steel2);                                                       // body behind the video face
      bb(0, 86, 4.3, 80, 34, 1.2, dark);                                                     // blank video face
      for (const [u, v, sx, sy] of [[0, 103.4, 84, 2.4], [0, 68.6, 84, 2.4], [-41.4, 86, 2.4, 34], [41.4, 86, 2.4, 34]]) bb(u, v, 4.6, sx, sy, 1.6, frameCol);
      bb(0, 109.4, 1, 84, 12, 6, '#2f3d3a'); bb(0, 109.4, 4.2, 70, 8, 0.6, '#3c4a46');       // header band (plain)
      // lattice columns: front and back posts, x-braces, catwalks, top truss
      const H = 122;
      for (const sx of [-1, 1]) {
        const u = sx * 56;
        for (const w of [4, -14]) bb(u, H / 2, w, 2.4, H, 2.4, steelCol);
        bb(u, H / 2, -5, 1, H, 1, steelCol);
        if (!low) for (let k = 0; k < 7; k++) { const v0 = k * H / 7, v1 = (k + 1) * H / 7, a = k % 2 ? 4 : -14, b = k % 2 ? -14 : 4; bm([u, v0, a], [u, v1, b], 0.8, steelCol); bb(u, v1, -5, 1, 0.8, 18.6, steelCol); }
      }
      for (const v of [31, 69, 103]) { bb(0, v, -5, 114, 1.2, 20, steel2); if (!low) bb(0, v + 2, -14.6, 114, 3.4, 0.5, steelCol); }   // catwalk levels with a back rail
      bb(0, 118, -5, 116, 1.4, 20, steelCol);                                                // top truss deck
      if (!low) for (let k = 0; k < 14; k++) { const u0 = -56 + k * 8, u1 = u0 + 8, v0 = k % 2 ? 104 : 118, v1 = k % 2 ? 118 : 104; bm([u0, v0, 4], [u1, v1, 4], 0.7, steelCol); bm([u0, v0, -14], [u1, v1, -14], 0.7, steelCol); }
      bb(0, 112, -14, 114, 1, 1, steelCol); bb(0, 112, 4, 114, 1, 1, steelCol);
      // clock crown (plain clock, no marks): cream drum and dark face, two hands, two finial posts
      const ck = P(0, 126, 3.2);
      const drum = ctx.add(new THREE.CylinderGeometry(7.5, 7.5, 2.6, 24), lam(creamCol)); drum.rotation.set(Math.PI / 2, 0, -bry); drum.position.set(ck[0], ck[1], ck[2]);
      const face = ctx.add(new THREE.CylinderGeometry(6, 6, 2.8, 24), lam('#222d29')); face.rotation.copy(drum.rotation); face.position.copy(drum.position);
      bb(0, 128.4, 4.9, 0.6, 4.4, 0.4, creamCol); bb(1.6, 126, 4.9, 3.2, 0.6, 0.4, creamCol);
      bb(0, 118.8, 2.5, 26, 2.2, 3, creamCol);
      for (const u of [-24, 24]) { bb(u, 123.5, 2, 1.2, 9, 1.2, steelCol); bb(u, 129, 2, 3, 3, 3, creamCol); }
      // flagpoles on the frame corners
      for (const u of [-56, 56]) { bb(u, 128, 4, 0.7, 20, 0.7, '#cfc3a4'); bb(u, 139.5, 4, 1.4, 1.4, 1.4, '#cfc3a4'); }
    }

    // ======================================================================================================
    // CENTER FIELD: batter's eye (dark wall, 37 ft by pinhole scale in photo 3) with the roof deck on top (photo 7); left-center bullpens
    // ======================================================================================================
    {
      kbox(-52, 36, 0, 36.5, -462, -404, '#1f3326');                     // eye block (dark panel wall)
      kbox(-52, 36, 36.5, 37.6, -462, -404, '#b9ab8c');                  // roof-deck floor
      kbox(-52, 36, 37.6, 41.2, -405, -404.6, '#3d4a47');                // front rail panel
      kbox(-24, 86, 0, 54, -522, -462, '#7a5240');                       // lounge building
      kbox(-26, 88, 54, 57, -524, -460, '#51615f');                      // gray roof
      for (const x of [-48, -30, -10, 10, 30]) kbox(x - 0.7, x + 0.7, 37.6, 50, -450.7, -449.3, steelCol);   // canopy posts
      kbox(-52, 36, 50, 51.8, -452, -420, '#4a5558');                    // deck canopy (dark flat roof)
      if (!low) for (let i = 0; i < 6; i++) kbox(-44 + i * 14.5, -37 + i * 14.5, 41, 42, -441, -434, '#c8793c');   // umbrellas over the deck
      for (const [x0, x1] of [[-150, -108], [-100, -58]]) {              // bullpens: raised lawns behind a low wall
        kbox(x0, x1, 0, 5, -470, -410, '#8d8363');
        kbox(x0 + 2, x1 - 2, 5, 5.3, -468, -412, '#6f8c4c');
        if (!low) kbox(x0 + 14, x1 - 14, 5.3, 5.6, -440, -414, '#b58258');
      }
      kbox(-152, -56, 0, 12, -472, -468, '#8a5742');                    // brick back wall of the bullpens
      kbox(-190, -50, 0, 12, -520, -472, '#cfc3a4');                    // picnic terrace above and behind the bullpens
      if (!low) for (let i = 0; i < 14; i++) kbox(-184 + (i % 7) * 20, -176 + (i % 7) * 20, 18, 19.6, -509 + Math.floor(i / 7) * 20, -501 + Math.floor(i / 7) * 20, '#c8793c');
    }

    // ======================================================================================================
    // RIBBON BOARDS: blank dark LED strips along the upper-deck front fascia (photo 5)
    // ======================================================================================================
    {
      const [rp, rn, ra] = tools.cut(0.1, 0.9);
      const dk = dims.deckAt, mRib = lam('#1b2823');
      ctx.add(sweepSolid(rp, rn, (i) => { const g = ra + i, d = dk.d0(g) - 0.5, h = dk.h0(g); return [[d, h - 6], [d, h - 2.4], [d - 0.5, h - 2.4], [d - 0.5, h - 6]]; }, [0, 0, 0, 0], 0), [mRib]);
    }

    // ======================================================================================================
    // LIGHT BANKS: pairs of lattice masts carrying a long horizontal truss with lamp panels (photos 1, 2, 3, 6), top about 180 ft
    // ======================================================================================================
    {
      const H = 165, BL = 40;                                              // mast height, half bank length
      const lampMat = new THREE.MeshBasicMaterial({ map: rep(textTexture((g, w, h) => {
        g.fillStyle = '#3b4643'; g.fillRect(0, 0, w, h); g.fillStyle = '#fbf0c6';
        for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(5 + i * 10, 6 + j * 10, 3.4, 0, 7); g.fill(); }
      }, 128, 32), 1, 1) });
      const lamps = [];
      for (const [lx, lz] of (low ? [[326, -150], [-210, -468], [-402, -250]] : [[326, -150], [-210, -468], [-402, -250], [-372, -60]])) {
        const ry = Math.atan2(-lx, -(lz + 150)), ux = Math.cos(ry), uz = -Math.sin(ry), nx = Math.sin(ry), nz = Math.cos(ry);
        const s = 3.4;
        for (const k of [-BL * 0.7, BL * 0.7]) {
          const cx = lx + ux * k, cz = lz + uz * k;
          for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) kit(beam([cx + dx * s, 0, cz + dz * s], [cx + dx * 1.3, H, cz + dz * 1.3], 0.9), steelCol);
          if (!low) for (let q = 1; q < 6; q++) { const y = q * H / 6, w = s - (s - 1.3) * q / 6; kit(mat4(cx, y, cz, w * 2, 0.8, 0.8), steelCol); kit(mat4(cx, y, cz, 0.8, 0.8, w * 2), steelCol); }
        }
        kit(mat4(lx, H + 3, lz, BL * 2 + 6, 1.4, 3.4, ry), steelCol);                // lower chord
        kit(mat4(lx, H + 15, lz, BL * 2 + 6, 1.4, 3.4, ry), steelCol);               // upper chord
        if (!low) for (let q = 0; q < 10; q++) { const a = -BL - 3 + q * (BL * 2 + 6) / 10, b = a + (BL * 2 + 6) / 10; kit(beam([lx + ux * a, H + 3, lz + uz * a], [lx + ux * b, H + 15, lz + uz * b], 0.6), steelCol); }
        lamps.push(mat4(lx + nx * 2.4, H + 9, lz + nz * 2.4, BL * 2, 10, 1.6, ry));  // lamp panel facing the field
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lampMat, lamps);
    }

    // ======================================================================================================
    // FLAGPOLES along the roof eave (photo 1: a pole over every second column)
    // ======================================================================================================
    {
      const polesM = [], pitch = low ? 110 : 52;
      for (let s = 20; s < OUT.L - 10; s += pitch) { const fr = frameAt(OUT, s); polesM.push(mat4(fr.x - fr.nx * 2, Y_OUT + 7, fr.z - fr.nz * 2, 0.45, 14, 0.45)); }
      polesM.forEach((m) => kit(m, '#cfc3a4'));
    }

    // ---------- flush the box kit: every plain box above is one instanced draw call
    {
      const km = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), lam('#ffffff'), KIT.length);
      KIT.forEach((m, i) => { km.setMatrixAt(i, m); km.setColorAt(i, KC[i]); });
      km.instanceMatrix.needsUpdate = true; km.instanceColor.needsUpdate = true; G.add(km);
    }

    // ---------- extra views
    { const f = homeGate.f; views.gate = { pos: [f.x + f.nx * 125, 10, f.z + f.nz * 125], look: [f.x + f.nx * 6, 52, f.z + f.nz * 6], label: 'Gate' }; }
    views.roof = { pos: [-120, 150, 330], look: [-60, 80, 120], label: 'Roof', orbit: false };
    views.eutaw = { pos: [292, 9, -260], look: [246, 40, -349], label: 'Eutaw Street' };
  },
};
