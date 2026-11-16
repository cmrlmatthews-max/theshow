// Detail module: Rate Field (Comiskey Park II / U.S. Cellular Field / Guaranteed Rate Field), Chicago White Sox (opened 1991). Units: feet.
// LEVEL 4 (photographs, heights, seating shape, scoreboards). Photographs: refs/CWS photo1..photo7 (see PHOTOS.md).
// MEASURED FROM THE SATELLITE SHEET (survey.png, home plate at the origin; sheet frame rotated about 1.2 deg so the CF axis is x = 0):
//  - outfield wall as a 22-point table: poles 330 / 335, power alleys about 360-372, CF 401-403, straight 8 ft wall (kept: posted 330/375/400/375/335);
//  - foul boundary fit: foulScale 1.1, backstop 53 ft (seat front edge z = 53 behind the plate, 24 ft off the line at 150 ft out);
//  - lower deck back edge / roof front edge as a polyline (ROOF_IN: z about 100 behind home, 51 ft out there, 98-102 ft out along the lines);
//  - outer facade / roof edge as a 33-point ring (RING): z = +248 behind home, x = -430 on the 3B side, +350 on the 1B side, z = -580 behind CF;
//  - SEATING SHAPE (level 4): lower-deck aisle stripes on the lit 3B side are 70-75 ft long (zoom of survey_plain.png, 4x), so the lower seats are
//    about 76-80 ft deep along the lines, about 38 ft behind home (roof front 51 ft out there, minus the club ledge); then a 20-24 ft gap (club
//    ledge + suite band), then the upper-deck rows 45-50 ft wide in plan (lit 3B side) = 21 rows at about 2.4 ft; the 1B upper deck is in roof
//    shadow, so it is mirrored. Outfield stands: LF corner about 100 ft deep (curved sections to the pole), RF corner about 85 ft, the middle
//    sections beside the board about 74 ft (stripe length at the batter's eye, c_cf.png), ring distance gives the back concourse;
//  - batter's eye (x -45..+40 at the wall, 40 ft deep), CF board structure (x -52..+31, z -463..-502; top surface 83 ft wide); Fundamentals
//    Deck (round, centre -278,-384, r 29); both bullpens; light-gray white-roofed ramp blocks at the four corners as footprints (RAMPS).
// MEASURED FROM PHOTOGRAPHS (method in brackets):
//  - rows (text: 38 lower / 5 middle / 21 upper, 8 top rows removed 2004; photo 4 right side shows the three tiers and the roof truss):
//    lower deck rise 1.0 ft per row = slope 0.38 (lowTop about 32 ft at 76 ft depth), club ledge 5 rows (rise 8 ft), suite band 34 ft behind
//    the lines / 46 ft behind home, upper deck slope 0.80 (about 2 ft per row x 21 rows = 42 ft rise), top row 113-117 ft [counted rows, photo 4];
//  - roof underside 134 ft: the clear gap between the top row and the truss bottom is about 6 ft (= 1/7 of the upper deck height in photo 4) and
//    the truss is 10 ft deep [photo 4, ratios inside one photograph];
//  - precast wall top 100 ft on the foul side, tower tops 22 ft above it, open steel truss between the wall and the roof (about 37 ft)
//    [photo 1: the truss band is 1.5x the height of the tower above the wall, tower step taken as 22 ft from 3 story-lines of louvres at about 13 ft each];
//  - outfield: concourse floor and top of the batter's eye hedge 38 ft (the back of the seats = wall 8 + 3 + 74 x 0.36), hedge stepped in three
//    tiers [photo 6: hedge about 24 ft of drop at the foreshortening of a 6 ft person, photo 4]; Fan Deck tiers at +11 and +22 ft above that
//    [photo 6: person 6 ft = 14 px per ft]; concourse roof 52 ft [photo 7: storefront canopy about 14 ft over the floor];
//  - main board: face 124 ft wide x 50 ft high, bottom at 62 ft, arched crown +10 ft, six capped columns with pinwheel discs (+24 ft), the
//    scale from the foul-pole spacing in photo 3 (0.72 px per ft at the board's depth) and the crowd on the Fan Deck in photos 5-6;
//    ad panels at 17 deg (about 66 x 27 ft) and LED boards at 27 deg (about 76 x 21 ft) with their bottoms at the main board's bottom [photos 3, 5];
//  - four light towers at x = +-180 and +-270 (photo 3: pixel columns 195, 263, 517, 585 against the board at 392, 0.72 px per ft), top 195 ft
//    [photo 3: lamps 128 ft above the truss line]; truss band 56-96 ft along the outfield ring [photo 5: truss bottom = board top minus 31 ft];
//  - shadow check on the sheet (sun from the south, shadows toward -z): the edge of the 1B roof shadow on the lower seats is about 120 ft from the
//    roof front, which gives a shadow ratio of about 1.2 for a roof about 100 ft over the seats; the CF board shadow (82 ft or more to the
//    back wall) is consistent with it but is cut off by the wall, so only a lower bound. No second object of known height is clean enough.
// FROM TEXT SOURCES: precast exterior with columns and arches (nod to old Comiskey; arches kept at the home-plate gate only, none visible in
//  photo 1), flat 2004 canopy over 13 of 21 upper rows, translucent wall band replaced by an open truss, Fan Deck on the batter's eye.
// STILL ESTIMATED: roof and facade heights are derived from ratios (photos have no scale object at the facade), tower tops, right-field roof front
//  (mirrored), arch rhythm (26 ft bays), outfield concourse roof, side board sizes, flags, colors, bullpen shapes. Not built: team and sponsor
//  lettering anywhere (roof lettering, board crowns, ad panels are blank), the concourse interior.
const D2R = Math.PI / 180;

// Outer facade / roof edge ring (clockwise from behind home toward right field), measured [x, z].
const RING = [
  [3, 248], [75, 242], [135, 217], [185, 180], [235, 135], [290, 80], [335, 20], [355, -50], [358, -150], [350, -250],
  [333, -340], [300, -420], [250, -480], [185, -525], [110, -558], [40, -576], [-30, -580], [-100, -572], [-165, -550],
  [-230, -512], [-290, -462], [-345, -405], [-395, -345], [-424, -290], [-433, -215], [-418, -125], [-385, -35],
  [-335, 45], [-270, 130], [-205, 185], [-135, 222], [-65, 243],
];
// Lower-deck back edge / canopy front edge, left-field pole to behind home (mirrored for the right side).
const ROOF_L = [[-345, -225], [-320, -185], [-300, -150], [-285, -125], [-265, -98], [-240, -64], [-219, -36], [-198, -6], [-176, 21], [-152, 48], [-122, 70], [-88, 88], [-55, 100], [-20, 104]];
const ROOF_IN = [...ROOF_L.map(([x, z]) => [-x, z]), ...ROOF_L.slice().reverse()];
// Ramp footprints (white concrete roofs at the corners). rect = [cx, cz, length, width, angle deg of the long axis from +x toward +z].
const RAMPS = [
  { poly: [[240, -38], [395, -122], [424, -64], [285, 48]], h: 32 },
  { poly: [[85, 198], [158, 89], [245, 112], [122, 244]], h: 28 },
  { rect: [-452, 22, 101, 36, 40], h: 30 }, { rect: [-414, 4, 73, 20, 32], h: 22 }, { rect: [-361, 27, 58, 26, -38], h: 34 },
  { rect: [-429, 92, 38, 34, 37], h: 20 }, { rect: [-369, 87, 92, 36, 39], h: 36 }, { rect: [-327, 127, 33, 25, 38], h: 24 },
  { rect: [-254, 113, 58, 25, -38], h: 30 }, { rect: [-299, 181, 82, 46, 72], h: 26 }, { rect: [-270, 250, 69, 46, 62], h: 24 },
  { poly: [[-469, -306], [-442, -388], [-401, -395], [-424, -320], [-433, -252], [-471, -252]], h: 26 },
  { poly: [[335, -388], [417, -397], [431, -247], [358, -243]], h: 26 },
];

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 330, h: 8 }, { deg: -40.4, r: 333, h: 8 }, { deg: -35.5, r: 345, h: 8 }, { deg: -29.3, r: 358, h: 8 },
        { deg: -24.9, r: 363, h: 8 }, { deg: -21, r: 372, h: 8 }, { deg: -17, r: 384, h: 8 }, { deg: -13.3, r: 391, h: 8 },
        { deg: -9.7, r: 397, h: 8 }, { deg: -6.3, r: 402, h: 8 }, { deg: 0, r: 401, h: 8 }, { deg: 5.7, r: 402, h: 8 },
        { deg: 7.2, r: 397, h: 8 }, { deg: 10.9, r: 391, h: 8 }, { deg: 15, r: 383, h: 8 }, { deg: 18.9, r: 376, h: 8 },
        { deg: 22.5, r: 370, h: 8 }, { deg: 25.4, r: 364, h: 8 }, { deg: 29.8, r: 355, h: 8 }, { deg: 35, r: 346, h: 8 },
        { deg: 40.1, r: 339, h: 8 }, { deg: 45, r: 335, h: 8 },
      ],
      foulScale: 1.1,
      backstop: 53,
      // lower deck depth follows the sheet (stripe length 70-75 ft at the lines, shallow behind home); slope 0.38 = 1.0 ft per row
      lower: { depth: [[0, 76], [0.1, 80], [0.2, 77], [0.3, 69], [0.4, 55], [0.45, 42], [0.5, 36], [0.55, 40], [0.6, 54], [0.7, 68], [0.8, 77], [0.9, 80], [1, 77]], slope: 0.38, extent: [0, 1] },
      hasUpper: true,
      // upper deck: 21 rows (about 2.4 ft deep, 2 ft rise) behind a 21 ft gap (club ledge + suite band); the suite band is taller behind home
      upper: { overhang: -21, rise: [[0, 34], [0.3, 34], [0.5, 46], [0.7, 34], [1, 34]], depth: [[0, 34], [0.04, 52], [1, 52]], slope: 0.8, extent: [0.03, 0.97] },
      outfield: { depth: 74, slope: 0.36, spans: [[-45, -33, 100, 0.4], [-33, -6.5, 74, 0.36], [6.5, 33, 74, 0.36], [33, 45, 85, 0.4]], eye: [-6.5, 6.5], eyeHeight: 38, eyeDepth: 40 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#34483c', facade: '#b4ad9c', wall: '#232a28', cream: '#e4dcc6' },
    };
  },

  build(ctx) {
    const { THREE, G, tools, paths, dims, parts, views } = ctx;
    const { sweepSolid, wallH, clamp } = tools;
    const { bPts, bN, wallPts, wallN } = paths;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const one = (g) => { g.clearGroups(); return g; };             // single-material geometry: one draw call
    const bg = (...a) => one(new THREE.BoxGeometry(...a)), cyl = (...a) => one(new THREE.CylinderGeometry(...a));
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const { d0, h0, dEnd, hTop, dL, sU, dU, D, i0, i1 } = dims;
    const N1 = bPts.length - 1;
    const tmp = new THREE.Object3D();
    const lerp = (a, b, t) => a + (b - a) * t;
    const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx));
      m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const beam = (a, b, th) => {                         // thin box from a to b ([x,y,z])
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    const mSteel = lam('#262b2f'), mPre = lam('#b9b2a1'), mCream = lam('#e3dcc7'), mDark = lam('#1d2225');
    const mGlass = lam('#dfe8e8', { transparent: true, opacity: 0.55, depthWrite: false });
    const mWin = basic('#2b3335', { side: THREE.DoubleSide });
    const steel = [];                                    // shared instance list: dark steel members

    // ---------- geometry helpers: ray against a polygon, even resampling
    const rayPoly = (p, n, poly, closed) => {
      let best = Infinity; const m = closed ? poly.length : poly.length - 1;
      for (let k = 0; k < m; k++) {
        const a = poly[k], c = poly[(k + 1) % poly.length], ex = c[0] - a[0], ez = c[1] - a[1], den = n[0] * ez - n[1] * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * n[1] - (a[1] - p[1]) * n[0]) / den;
        if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
      }
      return best;
    };
    const resample = (poly, step) => {                         // closed polygon, even spacing, first point repeated at the end
      const cum = [0]; for (let k = 0; k < poly.length; k++) { const a = poly[k], c = poly[(k + 1) % poly.length]; cum.push(cum[k] + Math.hypot(c[0] - a[0], c[1] - a[1])); }
      const total = cum[poly.length], n = Math.max(3, Math.round(total / step)), out = [];
      for (let q = 0, k = 0; q < n; q++) {
        const s = (q / n) * total; while (cum[k + 1] < s) k++;
        const a = poly[k], c = poly[(k + 1) % poly.length], t = (s - cum[k]) / (cum[k + 1] - cum[k]);
        out.push([lerp(a[0], c[0], t), lerp(a[1], c[1], t)]);
      }
      out.push(out[0].slice()); return out;
    };

    // ---------- measured heights (see the top comment)
    const deck = dims.deckAt;
    let maxHTop = 0; for (let g = 0; g <= N1; g++) maxHTop = Math.max(maxHTop, deck.hTop(g));
    const ROOF_Y = maxHTop + 17, ROOF_T = 3;                       // flat canopy underside: top row + 6 ft clearance + 10 ft truss
    const OFY = 52;                                                // outfield concourse roof (floor 38 + 14)
    const EYE_H = 38;                                              // batter's eye hedge top = outfield concourse floor
    const FAC_H = (z) => lerp(56, 100, sstep(-330, -170, z));      // precast wall top: low around the outfield, tall foul side
    const TRUSS_TOP = 96;                                          // outfield back truss top chord
    const pro = (i) => deck.hTop(i) - 4;                           // upper promenade floor behind the top row

    const mTan = lam('#bda993'), mTrim = lam('#d1c4aa'), mBase = lam('#9d9380'), mLine = lam('#968a74');
    const mGlassT = lam('#3f5b58');

    const dIn = (i) => clamp(rayPoly(bPts[i], bN[i], ROOF_IN, false), 40, 110);
    const dOut = (i) => { const t = rayPoly(bPts[i], bN[i], RING, true); return t === Infinity ? dEnd + 40 : t - 1; };

    // ---------- facade: precast wall around the measured ring, plinth and cornice, score lines, glass slits, louvres
    const ringStep = low ? 30 : 18;
    const RP = resample(RING, ringStep), RN = tools.normalsFor(RP, [0, -170]);
    const H = (i) => FAC_H(RP[i][1]);
    {
      ctx.add(sweepSolid(RP, RN, (i) => { const h = H(i); return [[-3, 0], [1.2, 0], [1.2, 7], [0.5, 7], [0.5, h - 7], [1.7, h - 7], [1.7, h], [-3, h]]; }, [-1, 2, 1, 0, 1, 1, 1, -1], 0), [mTan, mTrim, mBase]);
      // horizontal score lines in the precast panels (photo 1)
      for (const f of low ? [0.5] : [0.36, 0.68]) ctx.add(sweepSolid(RP, RN, (i) => { const y = H(i) * f; return [[0.4, y], [1.1, y], [1.1, y + 1.2], [0.4, y + 1.2]]; }, [0, 0, 0, 0], 0), [mLine]);
      // glass slits (stair towers), louvres, and arched gate bays behind home
      const bay = resample(RING, low ? 78 : 52), BN = tools.normalsFor(bay, [0, -170]);
      const slits = [], vents = [], arcs = [], opens = [], piers = [];
      for (let i = 0; i < bay.length - 1; i++) {
        const z = bay[i][1]; if (z < -200) continue;
        const n = BN[i], ry = Math.atan2(n[0], n[1]), x = bay[i][0] + n[0] * 1.0, zz = z + n[1] * 1.0, h = FAC_H(z);
        slits.push(mat4(x, h * 0.42, zz, 3.4, h * 0.62, 0.8, ry));
        if (!low) { vents.push(mat4(x + n[1] * 9, 14, zz - n[0] * 9, 3, 6.5, 1, ry)); vents.push(mat4(x - n[1] * 9, 14, zz + n[0] * 9, 3, 6.5, 1, ry)); }
      }
      // gate arches: the real facade keeps columns and arches at the entrance behind home
      const gate = resample(RING, 26), GN = tools.normalsFor(gate, [0, -170]);
      for (let i = 0; i < gate.length - 1; i++) {
        if (gate[i][1] < 205) continue;
        const n = GN[i], ry = Math.atan2(n[0], n[1]), x = gate[i][0] + n[0] * 1.0, z = gate[i][1] + n[1] * 1.0;
        opens.push(mat4(x, 11, z, 14, 22, 1, ry)); if (!low) arcs.push(mat4(x, 22, z, 7, 7, 1, ry));
        piers.push(mat4(x + n[1] * 13, 36, z - n[0] * 13, 5, 72, 1.2, ry));
      }
      inst(bg(1, 1, 1), mGlassT, slits);
      if (vents.length) inst(bg(1, 1, 1), mWin, vents);
      if (opens.length) inst(new THREE.PlaneGeometry(1, 1), mWin, opens);
      if (arcs.length) inst(new THREE.CircleGeometry(1, 10, 0, Math.PI), mWin, arcs);
      if (piers.length) inst(bg(1, 1, 1), mTrim, piers);
      // four stair/sign towers rising above the wall (photo 1): flat top, blank recessed panel, a tall glass slit on the side
      const TW = [[-135, 222], [135, 217], [-424, -290], [350, -250]], tb = [], tc = [], tp = [], ts = [];
      for (const [qx, qz] of TW) {
        let bi = 0, bd = 1e9; RP.forEach((p, i) => { const d = Math.hypot(p[0] - qx, p[1] - qz); if (d < bd) { bd = d; bi = i; } });
        const n = RN[bi], ry = Math.atan2(n[0], n[1]), h = H(bi) + 24, cx = RP[bi][0] + n[0] * 5, cz = RP[bi][1] + n[1] * 5;
        tb.push(mat4(cx, h / 2, cz, 26, h, 24, ry)); tc.push(mat4(cx + n[0] * 0.6, h + 1.2, cz + n[1] * 0.6, 28.4, 2.4, 26.4, ry));
        tp.push(mat4(cx + n[0] * 12.3, h - 15, cz + n[1] * 12.3, 19, 10, 0.8, ry));
        ts.push(mat4(cx + n[0] * 12.3 - n[1] * 10.5, h * 0.5 - 4, cz + n[1] * 12.3 + n[0] * 10.5, 2.6, h * 0.8, 0.8, ry));
      }
      inst(bg(1, 1, 1), lam('#b3a690'), tb); inst(bg(1, 1, 1), mTrim, tc);
      inst(bg(1, 1, 1), lam('#5e6867'), tp); inst(bg(1, 1, 1), mGlassT, ts);
      // open steel truss between the wall top and the roof edge (photo 1), and the back truss around the outfield (photos 3, 5, 7)
      const TB = resample(RING, 26), TN = tools.normalsFor(TB, [0, -170]);
      const zEnd = Math.min(bPts[0][1] + bN[0][1] * dOut(0), bPts[N1][1] + bN[N1][1] * dOut(N1));
      const inRoof = (z) => z > zEnd + 20;
      const top = (z) => (inRoof(z) ? ROOF_Y + ROOF_T : TRUSS_TOP), bot = (z) => FAC_H(z) + 1;
      for (let i = 0; i < TB.length - 1; i++) {
        const a = TB[i], b = TB[i + 1], na = TN[i], nb = TN[i + 1], za = a[1];
        if (!inRoof(za) && za > -150) continue;
        const pa = [a[0] + na[0] * 1.4, a[1] + na[1] * 1.4], pb = [b[0] + nb[0] * 1.4, b[1] + nb[1] * 1.4];
        steel.push(beam([pa[0], bot(a[1]), pa[1]], [pa[0], top(a[1]), pa[1]], 1.6));
        steel.push(beam([pa[0], bot(a[1]), pa[1]], [pb[0], top(b[1]), pb[1]], 0.9));
        if (!low) steel.push(beam([pa[0], top(a[1]), pa[1]], [pb[0], bot(b[1]), pb[1]], 0.7));
      }
      // chords of the truss along the ring: top and bottom, only where the truss exists (runs of consecutive samples)
      const tIdx = []; RP.forEach((p, i) => { if (inRoof(p[1]) || p[1] < -150) tIdx.push(i); });
      const runs = []; let cur = [];
      tIdx.forEach((v, k) => { if (k && v !== tIdx[k - 1] + 1) { runs.push(cur); cur = []; } cur.push(v); }); if (cur.length) runs.push(cur);
      for (const r of runs) {
        if (r.length < 2) continue;
        const rp = r.map((k) => RP[k]), rn = r.map((k) => RN[k]), zz = rp.map((q) => q[1]);
        ctx.add(sweepSolid(rp, rn, (i) => { const y = top(zz[i]); return [[0.6, y - 1], [2.2, y - 1], [2.2, y + 0.8], [0.6, y + 0.8]]; }, [0, 0, 0, 0], 0), [mSteel]);
        ctx.add(sweepSolid(rp, rn, (i) => { const y = bot(zz[i]); return [[0.6, y], [2.2, y], [2.2, y + 1.6], [0.6, y + 1.6]]; }, [0, 0, 0, 0], 0), [mSteel]);
      }
    }

    // ---------- Exterior ramps: solid concrete blocks (white roofs on the sheet) with a gentle slope toward the field
    {
      const topP = [], wallP = [];
      const FC = [0, -170];
      const rampGeo = (poly, hc, g) => {
        const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cz = poly.reduce((s, p) => s + p[1], 0) / poly.length;
        const ux = FC[0] - cx, uz = FC[1] - cz, ul = Math.hypot(ux, uz), U = [ux / ul, uz / ul];
        const y = (p) => Math.max(8, hc + g * ((p[0] - cx) * U[0] + (p[1] - cz) * U[1]));
        const tris = THREE.ShapeUtils.triangulateShape(poly.map((p) => new THREE.Vector2(p[0], p[1])), []);
        for (const t of tris) for (const v of t) topP.push(poly[v][0], y(poly[v]), poly[v][1]);
        for (let k = 0; k < poly.length; k++) {
          const a = poly[k], b = poly[(k + 1) % poly.length], ya = y(a), yb = y(b);
          wallP.push(a[0], 0, a[1], b[0], 0, b[1], b[0], yb, b[1], a[0], 0, a[1], b[0], yb, b[1], a[0], ya, a[1]);
        }
      };
      for (const r of RAMPS) {
        let poly = r.poly;
        if (r.rect) {
          const [cx, cz, L, W, ang] = r.rect, a = ang * D2R, ax = Math.cos(a), az = Math.sin(a), bx = -az, bz = ax;
          poly = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [cx + ax * L / 2 * s + bx * W / 2 * t, cz + az * L / 2 * s + bz * W / 2 * t]);
        }
        rampGeo(poly, r.h, 0.12);
      }
      const mk = (arr) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.computeVertexNormals(); return g; };
      ctx.add(mk(topP), lam('#cdc8b8')); ctx.add(mk(wallP), lam('#8f8a7c'));
    }

    // ---------- Club ledge (5 middle-deck rows), suite band details and the upper promenade
    {
      const [uP, uN, a] = tools.cut(0.03, 0.97);
      const dl = (i) => deck.dL(a + i), lt = (i) => deck.lowTop(a + i), y1 = (i) => lt(i) + 12;
      // the five rows of seats on their own terrace in front of the suite band (photo 4, right side)
      ctx.add(sweepSolid(uP, uN, (i) => [[dl(i) - 15, y1(i)], [dl(i), y1(i) + 8], [dl(i), y1(i) - 7], [dl(i) - 15, y1(i) - 7]], [ctx.MAT.SEAT, -1, -1, ctx.MAT.CREAM], ctx.MAT.CREAM), ctx.M);
      const rp = uP.map((p, i) => [p[0] + uN[i][0] * (dl(i) - 14.6), p[1] + uN[i][1] * (dl(i) - 14.6)]);
      G.add(tools.rail(rp, (i) => y1(i), { height: 3.2, spacing: 8, color: '#2a3033', lod: ctx.lod }));
      // dark glass face of the suite band (photo 4): replaces the pale generic back wall
      ctx.add(sweepSolid(uP, uN, (i) => { const g = a + i; return [[dl(i) + 0.12, lt(i)], [dl(i) + 0.55, lt(i)], [dl(i) + 0.55, deck.h0(g) - 7], [dl(i) + 0.12, deck.h0(g) - 7]]; }, [0, 0, 0, 0], 0), [lam('#2b3438')]);
      // ribbon line and cornice on the dark suite band
      ctx.add(sweepSolid(uP, uN, (i) => { const y = y1(i) + 15; return [[dl(i) + 0.2, y], [dl(i) + 1.0, y], [dl(i) + 1.0, y + 3], [dl(i) + 0.2, y + 3]]; }, [0, 0, 0, 0], 0), [lam('#1c2124')]);
      ctx.add(sweepSolid(uP, uN, (i) => { const g = a + i, y = deck.h0(g) - 8; return [[deck.d0(g) - 1.2, y], [deck.d0(g) + 0.4, y], [deck.d0(g) + 0.4, y + 1.6], [deck.d0(g) - 1.2, y + 1.6]]; }, [0, 0, 0, 0], 0), [lam('#d8cfb6')]);
      // promenade floor behind the top row, out to the facade (the real park has its upper concourse here)
      ctx.add(sweepSolid(uP, uN, (i) => { const g = a + i, e = deck.dEnd(g) - 0.3, o = dOut(g); return [[e, 0], [e, pro(g)], [o, pro(g)], [o, 0]]; }, [-1, 0, -1, -1], 0), [lam('#8c887b')]);
    }

    // ---------- Canopy: flat steel roof over the whole upper deck, trusses and posts below, light banks on the front edge
    {
      const st = low ? 4 : 2, idx = [];
      for (let i = 0; i <= N1; i += st) idx.push(i);
      if (idx[idx.length - 1] !== N1) idx.push(N1);
      const rp = idx.map((i) => bPts[i]), rn = idx.map((i) => bN[i]);
      const din = idx.map(dIn), dout = idx.map(dOut);
      ctx.add(sweepSolid(rp, rn, (k) => [[din[k], ROOF_Y], [dout[k] + 1, ROOF_Y], [dout[k] + 1, ROOF_Y + ROOF_T], [din[k], ROOF_Y + ROOF_T]], [3, 1, 2, 0], 0), [lam('#c5cbcd'), lam('#6a7276'), lam('#9aa2a6'), lam('#59616a')]);
      ctx.add(sweepSolid(rp, rn, (k) => [[din[k] - 0.5, ROOF_Y - 3], [din[k] + 0.5, ROOF_Y - 3], [din[k] + 0.5, ROOF_Y + ROOF_T + 1], [din[k] - 0.5, ROOF_Y + ROOF_T + 1]], [0, 0, 0, 0], 0), [lam('#2f3539')]);
      const sx = low ? 12 : 5;
      const seatAt = (i, d) => deck.h0(i) + dims.sU * (Math.min(d, deck.dEnd(i)) - deck.d0(i));
      const lampM = [], bankM = [];
      for (let i = 6; i < N1 - 5; i += sx) {
        const a = dIn(i), b = dOut(i), p = bPts[i], n = bN[i], ry = Math.atan2(n[0], n[1]);
        const at = (d, y) => [p[0] + n[0] * d, y, p[1] + n[1] * d];
        const dp = lerp(a, b, 0.5), dp2 = lerp(a, b, 0.85);
        steel.push(beam(at(dp, Math.max(2, dp > deck.dEnd(i) ? pro(i) : seatAt(i, dp))), at(dp, ROOF_Y), 1.8));   // post
        steel.push(beam(at(dp2, pro(i)), at(dp2, ROOF_Y), 1.6));                                                  // outer post
        steel.push(beam(at(b, ROOF_Y - 1), at(a, ROOF_Y - 1), 1.1));                                              // lower chord
        if (!low) {
          steel.push(beam(at(b, ROOF_Y - 1), at(dp, ROOF_Y - 11), 0.9));
          steel.push(beam(at(dp, ROOF_Y - 11), at(a, ROOF_Y - 1), 0.9));
          steel.push(beam(at(dp, ROOF_Y - 11), at(dp2, ROOF_Y - 1), 0.8));
        }
        const bk = at(a - 1.5, ROOF_Y + ROOF_T + 3.4);
        bankM.push(mat4(bk[0], bk[1], bk[2], 22, 6.4, 1.8, ry + Math.PI));
        const lp = at(a - 2.7, ROOF_Y + ROOF_T + 3.4);
        lampM.push(mat4(lp[0], lp[1], lp[2], 20, 5, 0.4, ry + Math.PI));
      }
      inst(bg(1, 1, 1), lam('#2d3337'), bankM);
      inst(bg(1, 1, 1), basic('#f3e7b8'), lampM);
      // end walls of the canopy
      for (const k of [0, N1]) {
        const p = bPts[k], n = bN[k], a = [p[0] + n[0] * dIn(k), p[1] + n[1] * dIn(k)], c = [p[0] + n[0] * (dOut(k) + 1), p[1] + n[1] * (dOut(k) + 1)];
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute([a[0], ROOF_Y, a[1], c[0], ROOF_Y, c[1], c[0], ROOF_Y + ROOF_T, c[1], a[0], ROOF_Y, a[1], c[0], ROOF_Y + ROOF_T, c[1], a[0], ROOF_Y + ROOF_T, a[1]], 3));
        geo.computeVertexNormals(); ctx.add(geo, lam('#59616a'));
      }
    }

    // ---------- Outfield: concourse roof from the back of the seats to the ring, hedge batter's eye with the Fan Deck, boards, towers
    {
      // seating spans as in config(): [from, to, seat depth]; the back-of-seats offset BD follows each span
      const SP = [[-45, -33, 100], [-33, -6.5, 74], [-6.5, 6.5, 100], [6.5, 33, 74], [33, 45, 85]];
      const bdOf = (dep) => 4 + dep + 6;
      const BDS = SP.map((s) => bdOf(s[2]));
      const hb = (deg, dep, slp) => wallH(ctx.spec, deg) + 3 + slp * dep;
      const st = low ? 3 : 1;
      SP.forEach(([a0, b0, dep], si) => {
        const BD = BDS[si], slp = si === 0 || si === 4 ? 0.4 : 0.36;
        const [p0, n0, dg0] = tools.span(a0, b0);
        const p = [], n = [], dg = [];
        for (let i = 0; i < p0.length; i += st) { p.push(p0[i]); n.push(n0[i]); dg.push(dg0[i]); }
        const dr = p.map((q, i) => { const t = rayPoly(q, n[i], RING, true); return t === Infinity ? BD + 90 : t - 1; });
        ctx.add(sweepSolid(p, n, (i) => [[BD, OFY], [dr[i] + 1, OFY], [dr[i] + 1, OFY + 2.5], [BD, OFY + 2.5]], [0, 0, 0, 0], 0), [lam('#59616a')]);
        if (si !== 2) ctx.add(sweepSolid(p, n, (i) => { const Hh = hb(dg[i], dep, slp); return [[BD - 8, Hh - 3], [BD - 8, Hh], [BD + 2, Hh], [BD + 2, Hh - 3]]; }, [-1, 0, -1, 0], 0), [mDark]);  // back concourse edge
        ctx.add(sweepSolid(p, n, () => [[BD, OFY - 3], [BD + 1, OFY - 3], [BD + 1, OFY + 3.5], [BD, OFY + 3.5]], [0, 0, 0, 0], 0), [lam('#2f3539')]);                 // dark fascia
        for (let i = 3; i < p.length - 3; i += low ? 6 : 4) steel.push(beam([p[i][0] + n[i][0] * (BD + 14), 0, p[i][1] + n[i][1] * (BD + 14)], [p[i][0] + n[i][0] * (BD + 14), OFY, p[i][1] + n[i][1] * (BD + 14)], 1.6));
      });
      // corner wedges: concourse roof between the foul-side canopy end, the outfield roof end and the ring
      for (const sg of [-1, 1]) {
        const iEnd = sg < 0 ? N1 : 0, wi = sg < 0 ? 0 : wallPts.length - 1, Pw = wallPts[wi], nw = wallN[wi], BD = sg < 0 ? BDS[0] : BDS[4];
        const FI = [bPts[iEnd][0] + bN[iEnd][0] * dIn(iEnd), bPts[iEnd][1] + bN[iEnd][1] * dIn(iEnd)], FOd = dOut(iEnd);
        const FO = [bPts[iEnd][0] + bN[iEnd][0] * FOd, bPts[iEnd][1] + bN[iEnd][1] * FOd];
        const tO = rayPoly(Pw, nw, RING, true), dO = tO === Infinity ? BD + 90 : tO - 1;
        const OO = [Pw[0] + nw[0] * dO, Pw[1] + nw[1] * dO], OI = [Pw[0] + nw[0] * BD, Pw[1] + nw[1] * BD];
        const ang = (q) => Math.atan2(q[1] - Pw[1], q[0] - Pw[0]), nrm = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
        const a1 = ang(FO), span = nrm(ang(OO) - a1);
        const mid = RING.map((q) => ({ q, d: nrm(ang(q) - a1) })).filter((o) => Math.sign(o.d) === Math.sign(span) && Math.abs(o.d) < Math.abs(span)).sort((u, v) => Math.abs(u.d) - Math.abs(v.d)).map((o) => o.q);
        const poly = [FI, FO, ...mid, OO, OI], pos = [];
        for (const t of THREE.ShapeUtils.triangulateShape(poly.map((q) => new THREE.Vector2(q[0], q[1])), [])) for (const v of t) pos.push(poly[v][0], OFY + 1, poly[v][1]);
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); ctx.add(g, lam('#59616a'));
      }

      // batter's eye: stepped hedge wall (three tiers) up to the concourse floor, with the Fan Deck on the concourse behind it
      if (parts.batterEye) ctx.remove(parts.batterEye);
      {
        const [p, n] = tools.span(-6.5, 6.5), ED = 40;
        const mHedge = lam('#34503c'), mConc = lam('#a9a595');
        ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 14], [8, 14], [8, 26], [15, 26], [15, EYE_H], [ED, EYE_H], [ED, 0]], [0, 0, 0, 0, 0, 1, 2, -1], 1), [mHedge, mConc, lam('#2a2f31')]);
      }
      // Fan Deck: tan brick base, two terraces (+11, +22), rail, blank fascia (photo 6)
      {
        const cx = -4, cz = -452, mBrick = lam('#9b7f66'), mFas = lam('#23292b'), mDeck = lam('#b9b4a2');
        const bx = (w, h, d, x, y, z, m) => { const q = ctx.add(bg(w, h, d), m); q.position.set(x, y, z); return q; };
        bx(58, 11, 20, cx, EYE_H + 5.5, cz, mBrick);                           // ground block
        bx(60, 1, 22, cx, EYE_H + 11.5, cz, mDeck);                            // terrace 1 slab
        bx(48, 11, 12, cx, EYE_H + 17, cz - 5, mBrick);                        // upper block
        bx(50, 1, 14, cx, EYE_H + 22.5, cz - 5, mDeck);                        // terrace 2 slab
        bx(58, 3, 0.8, cx, EYE_H + 6, cz + 10.2, mFas);                        // blank fascia strip on the front
        bx(48, 3, 0.8, cx, EYE_H + 18, cz + 1.2, mFas);
        bx(6, 10, 20, cx + 34, EYE_H + 5, cz - 2, mBrick);                     // stair block
        if (!low) {
          G.add(tools.rail([[cx - 30, cz + 11], [cx + 30, cz + 11]], () => EYE_H + 12, { height: 3.4, spacing: 7, color: '#2a3033', lod: ctx.lod }));
          G.add(tools.rail([[cx - 25, cz + 1], [cx + 25, cz + 1]], () => EYE_H + 23, { height: 3.4, spacing: 7, color: '#2a3033', lod: ctx.lod }));
        }
      }

      // ---- main board at the measured structure (x -52..+31, z -463..-502): legs, catwalk, body, crown, pinwheel stacks, back box
      const bcx = -6, zf = -468, BY = 62, BW = 124, BH = 50;
      const mFrame = lam('#6a7378'), mBodyDark = lam('#14191b'), mAdA = lam('#26343f'), mAdB = lam('#3a3f4a'), mStrip = lam('#2d3b46');
      const gridTex = tools.textTexture((g, w, h) => {
        g.fillStyle = '#0d1316'; g.fillRect(0, 0, w, h); g.strokeStyle = '#24323a'; g.lineWidth = 1;
        for (let x = 0; x <= w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        for (let y = 0; y <= h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      }, 128, 64);
      const mScreen = new THREE.MeshBasicMaterial({ map: gridTex, side: THREE.DoubleSide });
      const bxm = (w, h, d, x, y, z, m) => { const q = ctx.add(bg(w, h, d), m); q.position.set(x, y, z); return q; };
      bxm(BW, BH, 8, bcx, BY + BH / 2, zf - 4, mBodyDark);                              // body
      bxm(112, BH - 4, 24, bcx, BY + BH / 2 - 2, zf - 20, lam('#101517'));               // back box (structure behind the face)
      bxm(26, 36, 1.2, bcx - 47, BY + 22, zf + 0.6, mAdA);                               // blank left panel
      bxm(26, 36, 1.2, bcx + 47, BY + 22, zf + 0.6, mAdB);                               // blank right panel
      const scr = ctx.add(new THREE.PlaneGeometry(62, 32), mScreen); scr.position.set(bcx, BY + 29, zf + 0.7);
      bxm(66, 1.4, 1.4, bcx, BY + 45.7, zf + 0.9, mFrame); bxm(66, 1.4, 1.4, bcx, BY + 12.3, zf + 0.9, mFrame);
      bxm(1.4, 34, 1.4, bcx - 33, BY + 29, zf + 0.9, mFrame); bxm(1.4, 34, 1.4, bcx + 33, BY + 29, zf + 0.9, mFrame);
      bxm(62, 7, 1.0, bcx, BY + 7.5, zf + 0.6, mStrip);                                  // blank bottom strip
      bxm(14, 6, 1.0, bcx - 41, BY + 5, zf + 0.6, mStrip); bxm(14, 6, 1.0, bcx + 41, BY + 5, zf + 0.6, mStrip);
      // arched crown
      {
        const sh = new THREE.Shape(); sh.moveTo(-52, 0); sh.lineTo(52, 0); sh.lineTo(52, 3); sh.quadraticCurveTo(0, 17, -52, 3); sh.lineTo(-52, 0);
        const crown = ctx.add(one(new THREE.ExtrudeGeometry(sh, { depth: 7, bevelEnabled: false, curveSegments: low ? 4 : 8 })), lam('#1d2427'));
        crown.position.set(bcx, BY + BH, zf);
      }
      // six capped columns with pinwheel discs on the crown (muted colours, no marks)
      {
        const xs = [-43, -30, -16, 12, 28, 44], cols = ['#a2493a', '#4d7a58', '#c9a24d', '#4d7a58', '#a2493a', '#c9a24d'];
        const archY = (x) => BY + BH + 3 + 7 * (1 - (x / 52) * (x / 52));
        const stacks = [], backs = [], discs = [[], [], []], dc = ['#a2493a', '#4d7a58', '#c9a24d'];
        xs.forEach((x, k) => {
          const y0 = archY(x);
          stacks.push(mat4(bcx + x, y0 + 11, zf + 3, 5, 22, 5)); backs.push(mat4(bcx + x, y0 + 22.5, zf + 3, 7.2, 3, 7.2));
          discs[dc.indexOf(cols[k])].push(mat4(bcx + x, y0 + 17, zf + 6, 5.2, 5.2, 1));
        });
        inst(bg(1, 1, 1), lam('#d9d2bd'), stacks); inst(bg(1, 1, 1), lam('#9aa0a2'), backs);
        discs.forEach((arr, k) => { if (arr.length) inst(new THREE.CircleGeometry(1, low ? 8 : 14), basic(dc[k], { side: THREE.DoubleSide }), arr); });
      }
      // legs, catwalk with rail, braces
      for (const sx of [-1, 1]) {
        const x = bcx + sx * 52, x2 = bcx + sx * 22;
        steel.push(beam([x, 0, zf - 8], [x, BY, zf - 8], 4.4)); steel.push(beam([x, 0, zf - 22], [x, BY, zf - 22], 4.4));
        steel.push(beam([x, 0, zf - 8], [x, BY - 6, zf - 22], 1.2)); steel.push(beam([x, 0, zf - 22], [x, BY - 6, zf - 8], 1.2));
        steel.push(beam([x, 30, zf - 8], [x2, BY - 2, zf - 8], 1.4));
      }
      bxm(BW + 8, 1, 7, bcx, BY - 0.6, zf + 3.4, lam('#3b4247'));
      G.add(tools.rail([[bcx - BW / 2 - 4, zf + 6.6], [bcx + BW / 2 + 4, zf + 6.6]], () => BY, { height: 3.6, spacing: 8, color: '#2a3033', lod: ctx.lod }));

      // ---- secondary boards: blank ad panels at +-17 deg and +-37 deg, LED boards (plain line grid) at +-27 deg, each with posts and a catwalk
      const board = (deg, dep, w, h, mFace, led) => {
        const q = tools.wallAt(deg, bdOf(dep) + 12, 0), L = Math.hypot(q.x, q.z), nx = q.x / L, nz = q.z / L;
        const m = ctx.add(bg(w, h, 4), mBodyDark); m.position.set(q.x, BY + h / 2, q.z); m.lookAt(0, BY + h / 2, 0);
        const fc = ctx.add(new THREE.PlaneGeometry(w - 3, h - 3), led ? mScreen : lam(mFace)); fc.position.set(q.x - nx * 2.2, BY + h / 2, q.z - nz * 2.2); fc.lookAt(0, BY + h / 2, 0);
        const tg = [-nz, nx];
        for (const s of [-0.4, 0.4]) {
          const px = q.x + tg[0] * s * w, pz = q.z + tg[1] * s * w;
          steel.push(beam([px, OFY, pz], [px, BY + h * 0.7, pz], 2.2)); steel.push(beam([px - tg[0] * 5, OFY, pz - tg[1] * 5], [px, BY + h, pz], 0.9));
        }
        steel.push(beam([q.x - tg[0] * w * 0.5, BY - 1, q.z - tg[1] * w * 0.5], [q.x + tg[0] * w * 0.5, BY - 1, q.z + tg[1] * w * 0.5], 1.8));
      };
      for (const sg of [-1, 1]) {
        board(sg * 17, 74, 66, 27, sg < 0 ? '#26343f' : '#3a3f4a', false);
        board(sg * 27, 74, 76, 21, '#26343f', true);
        if (!low) board(sg * 37, sg < 0 ? 100 : 85, 70, 27, sg < 0 ? '#3a3f4a' : '#26343f', false);
      }
      // flagpoles on the back truss either side of the main board (photo 5), blank pennants
      {
        const flagX = [-81, -65, 66, 80], fl = [];
        flagX.forEach((x) => { steel.push(beam([bcx + x, TRUSS_TOP - 2, zf - 26], [bcx + x, TRUSS_TOP + 34, zf - 26], 0.9)); fl.push(mat4(bcx + x + 4.2, TRUSS_TOP + 30, zf - 26, 8.4, 5, 0.3)); });
        inst(bg(1, 1, 1), lam('#d9d2bd'), fl);
      }
      // round Fundamentals Deck behind the left-field corner and the two bullpens
      const fd = ctx.add(cyl(29, 31, 10, low ? 14 : 24), lam('#c9c3b0')); fd.position.set(-278, 5, -384);
      const fdt = ctx.add(cyl(25, 25, 0.5, low ? 14 : 24), lam('#86b3a5')); fdt.position.set(-278, 10.3, -384);
      const bp = (x, z, w, d, ry) => { const m = ctx.add(bg(w, 0.6, d), lam('#5f8556')); m.position.set(x, 0.5, z); m.rotation.y = ry; };
      bp(172, -330, 55, 22, -0.55); bp(-218, -278, 58, 24, 0.62);

      // ---- four lattice light towers on the back line (photo 3), lamp banks facing home
      const ringAtX = (x) => {
        let best = null;
        for (let k = 0; k < RING.length; k++) { const a = RING[k], b = RING[(k + 1) % RING.length]; if (a[1] > -300 || b[1] > -300) continue; if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) { const t = (x - a[0]) / (b[0] - a[0]); best = lerp(a[1], b[1], t); } }
        return best === null ? -480 : best;
      };
      const lampsT = [];
      for (const x of [-270, -180, 180, 270]) {
        const c = { x, z: ringAtX(x) + 10 };
        const nrm = new THREE.Vector3(c.x, 0, c.z).normalize(), tg = new THREE.Vector3(-nrm.z, 0, nrm.x);
        const Ht = 195, w0 = 15, w1 = 7;
        const corner = (sx, sz, y) => { const w = lerp(w0, w1, y / Ht); return [c.x + tg.x * sx * w + nrm.x * sz * w, y, c.z + tg.z * sx * w + nrm.z * sz * w]; };
        const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        cs.forEach(([sx, sz]) => steel.push(beam(corner(sx, sz, 0), corner(sx, sz, Ht), 1.7)));
        const lv = low ? [0, 100, Ht] : [0, 30, 60, 90, 120, 155, Ht];
        for (let k = 0; k < lv.length - 1; k++) for (let s = 0; s < 4; s++) {
          const [ax, az] = cs[s], [bx2, bz] = cs[(s + 1) % 4];
          steel.push(beam(corner(ax, az, lv[k]), corner(bx2, bz, lv[k + 1]), 0.7));
          if (!low) steel.push(beam(corner(bx2, bz, lv[k]), corner(ax, az, lv[k + 1]), 0.7));
        }
        for (let r = 0; r < (low ? 2 : 4); r++) for (let q = 0; q < (low ? 3 : 6); q++) {
          lampsT.push(mat4(c.x - nrm.x * 6 + tg.x * (q - (low ? 1 : 2.5)) * 6.4, Ht + 2 + r * 6, c.z - nrm.z * 6 + tg.z * (q - (low ? 1 : 2.5)) * 6.4, 5.4, 4.4, 1.2, Math.atan2(-nrm.x, nrm.z)));
        }
        const hh = ctx.add(bg(42, 28, 3), lam('#2d3337')); hh.position.set(c.x - nrm.x * 8, Ht + 11, c.z - nrm.z * 8); hh.lookAt(0, Ht + 11, 0);
      }
      inst(bg(1, 1, 1), basic('#f3e7b8'), lampsT);
    }

    // ---------- the shared steel instance list
    inst(bg(1, 1, 1), mSteel, steel);

    // ---------- remove conflicting generic parts
    ctx.remove(parts.lights);
    ctx.remove(parts.scoreboard);
    ctx.remove(parts.canopy);

    // ---------- views
    {
      const iH = Math.round(0.5 * N1), iS = Math.round(0.26 * N1), iT = Math.round(0.76 * N1);
      const at = (i, d, y) => [bPts[i][0] + bN[i][0] * d, y, bPts[i][1] + bN[i][1] * d];
      views.gate = { pos: [70, 24, 340], look: [20, 55, 240], label: 'Back Gate' };
      views.roof = { pos: at(iH, dOut(iH) + 250, ROOF_Y + 110), look: [0, 20, -140], label: 'Canopy' };
      views.stands = { pos: at(iS, deck.d0(iS) + deck.dU(iS) * 0.45, deck.h0(iS) + dims.sU * deck.dU(iS) * 0.45 + 5), look: at(iT, deck.d0(iT) + 20, ROOF_Y - 4), label: 'Under the Roof' };
    }
  },
};
