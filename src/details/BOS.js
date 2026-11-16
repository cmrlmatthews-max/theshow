// Detail module: Fenway Park, Boston (opened 1912). Units: feet. Home plate = origin, center field = -z.
// The park is turned: the first-base line runs east, the left-field line north, so CF points north-east.
//
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft; home plate and 2B located on mosaic.png):
//  - Outfield wall base: LF pole (-219,-219) -> Green Monster end (-49,-377, r 380) -> straight CF line (0,-391) -> the Triangle
//    apex (81,-412, r 420) -> back in to (90,-377) -> bullpen/right-center wall (110,-362)..(232,-298) -> RF corner (237,-282)
//    -> RF pole (213,-213, r 302).
//  - Grandstand roof (teal): 3B outer edge (-249,-96)..(-137,100), inner edge (-207,-96)..(-112,100); 1B outer (270,-75)..(107,137),
//    inner (233,-90)..(85,103). Roof ends at z=-96 (3B) and z=-90 (1B). Home block (-111,143) (-73,93) (71,93) (108,141) (56,218).
//  - SEATING DEPTH (config tables): ray from the front edge of the foul-side seats along its normal to the outer facade / roof edge,
//    sampled every 0.045 of the bowl: total seat depth (facade minus 12 ft of back wall) 65 (RF pole) -> 119..122 (1B side) ->
//    47 (behind home, to the block face z=93) -> 103..127 (3B side) -> 37 (LF pole). Roof inner edge begins 76-92 ft deep. The satellite
//    shows a cross-aisle / deck fascia about 50 ft deep on both sides: that is where the upper deck (grandstand level) starts.
//  - Bleacher blocks (custom decks, built from satellite corner points): CF block (-49,-377) (136,-434) (142,-517) (55,-503); right-center
//    block (100,-398) (136,-434) (142,-517) (268,-460) (223,-345): its front edge stands about 30 ft behind the bullpen wall (bullpens and
//    white tents lie between), depth about 125 ft. RF-corner seats stay the generic red fan.
//    Right-field roof terrace: a 22 ft band behind the corner seats (252,-374)..(296,-282).
//  - Video board back structure: lattice on the CF bleacher back edge (55,-503)..(142,-517).
// FROM TEXT SOURCES (Wikipedia, Clem's, MLB.com, AV trade press): wall distances 310/379/390/420/380/302, Monster 37 ft (37 ft 2 in)
//  with seats on top (2003), CF wall 17 ft, bullpen wall about 5 ft, hand-operated scoreboard (plates 13 x 16 in), ladder starts 13 ft
//  above ground; video boards (2012): center field 38 x 100 ft, left-center 17 x 100 ft, right field 16 x 30 ft (between two sponsor
//  panels); 2017 right-field board 46.2 x 14.3 ft.
// FROM PHOTOGRAPHS (/home/claude/refs/BOS): facade brick with cream belt courses, green arched ground-floor doors, rectangular paired
//  windows, cream plaque with the park name at the raised corner bay (photo1); the Green Monster back is teal metal panels with a
//  lattice sign structure and catwalks over Lansdowne St, plain park name only (photo2); the upper deck overhangs the lower seats with a
//  teal fascia, roof boxes on the home block, glass press level with a teal roof and a name plaque (photos 3, 4, 5); Monster wall is teal
//  green, the scoreboard has a white border (photo6); CF board stands on the bleachers with a catwalk and a three-part sign (photo7).
// HEIGHTS (method):
//  - Wall 37 / 17 / 5 (config text). Manual scoreboard 14.5 ft tall, 1.5 ft above ground, 141 ft wide with two side panels (photo6:
//    wall 37 ft = 150-180 px, board 62-69 px; its ladder starts at 13 ft). Monster seat platform 9 ft over the wall top (photo6).
//  - Facade 42-44 ft: three floors; the arched door is taken as 12 ft against a 5 ft car in the same plane (photo1); 3.5 doors high.
//  - Lower deck rise 0.38 per ft (rows 1.25 ft per 3.3 ft); upper 0.45 (rows about 1.5 ft; photos 3, 4). Overhang of the upper deck about
//    22 ft over the lower rows (photo3: dark underside covers the back third). Upper deck front about 44 ft above the field (22.5 ft
//    lower-deck surface at 50 ft plus a 22 ft concourse story, photo3). Roof front edge = deck surface + 14 ft, 58-80 ft.
//  - Home block 96 ft (roof boxes 58-72, glass press band 76-90, teal cap); light towers 112-118 ft (photos 3, 4, 5: mast about 40 ft
//    above the roof). CF video board 38 ft tall with its foot 6 ft over the back of the bleachers (photo7 ratio).
//  - Shadows on the sheet fall on stands or on slopes, so they were not used.
// STILL ESTIMATED: roof and tower heights, upper-deck slope, the concourse gap, column rows, truss spacing, exact tower positions,
//  the Monster sign tower, positions of the left-center and right-field boards, bay rhythm, bleacher heights.
const D2R = Math.PI / 180;
const polar = (x, z) => ({ deg: Math.atan2(x, -z) / D2R, r: Math.hypot(x, z) });

// Outfield wall corners [x, z, h]; a repeated corner makes a height step.
const WALL_PTS = [
  [-219.2, -219.2, 37], [-49, -377, 37], [-49, -377, 17], [0, -391, 17], [80.6, -412.2, 17],
  [90, -377, 17], [90, -377, 5], [110, -362, 5], [154, -340, 5], [198, -316, 5], [232, -298, 5], [237, -282, 5],
  [230, -255, 5], [218, -228, 5], [213.2, -213.2, 5],
];
// Roof edges (3B side and 1B side), from the north end toward home plate.
const ROOF3_O = [[-249, -96], [-248, -48], [-241, -8], [-229, 24], [-205, 52], [-170, 74], [-137, 100]];
const ROOF3_I = [[-207, -96], [-201, -45], [-178, -6], [-153, 34], [-133, 65], [-112, 100]];
const ROOF1_O = [[270, -75], [238, 1], [218, 14], [185, 53], [151, 90], [124, 120], [107, 137]];
const ROOF1_I = [[233, -90], [218, -45], [195, -8], [161, 40], [137, 77], [114, 107], [85, 103]];
// Home block footprint (closed).
const HOME = [[-111, 143], [-73, 93], [71, 93], [108, 141], [56, 218]];
// Facade runs (outer building lines), [x, z].
const FAC_3B = [[-260, -212], [-260, -150], [-253, -100], [-250, -48], [-243, -8], [-231, 24], [-207, 52], [-172, 74], [-139, 100], [-111, 143]];
const FAC_HOME = [[-111, 143], [56, 218], [108, 141]];
const FAC_1B = [[108, 141], [126, 122], [153, 92], [187, 55], [220, 16], [241, 3], [272, -72]];
const FAC_RF = [[272, -72], [272, -139], [285, -190], [301, -230], [303, -285], [290, -320], [265, -352], [252, -396]];
const FAC_BL = [[252, -396], [270, -456], [200, -505], [140, -515], [53, -497], [-47, -389]];
const BULLPEN_TENTS = [[98.8, -385], [148, -362], [161.6, -355], [211, -333]];
// Bleacher blocks (satellite corners). front = indices of the two polygon points that form the front edge.
const CF_BLOCK = { poly: [[-49, -377], [136, -434], [142, -517], [55, -503]], front: [0, 1], yf: 20, slope: 0.42, fy: 17, aisles: [0.14, 0.34, 0.52, 0.7, 0.88] };
const RC_BLOCK = { poly: [[223, -345], [100, -398], [136, -434], [142, -517], [268, -460]], front: [0, 1], yf: 8, slope: 0.38, fy: 8, aisles: [0.14, 0.32, 0.5, 0.68, 0.86] };
// Right-field roof terrace (band behind the corner seats).
const RF_TERRACE = [[252, -374], [284, -362], [303, -338], [307, -310], [296, -282]];

const lerp = (a, b, t) => a + (b - a) * t;

export default {
  config() {
    const wall = WALL_PTS.map(([x, z, h], i) => {
      const p = polar(x, z);
      let deg = p.deg;
      if (i === 0) deg = -45; if (i === WALL_PTS.length - 1) deg = 45;
      if (i > 0 && Math.abs(deg - polar(WALL_PTS[i - 1][0], WALL_PTS[i - 1][1]).deg) < 1e-6) deg += 0.05;   // height step
      return { deg, r: p.r, h };
    });
    // t: 0 = right-field pole, 0.5 = behind home, 1 = left-field pole. Values from the satellite rays (see top comment).
    // dL = lower deck depth; ov = overhang of the upper deck over the lower rows (so the upper deck starts at dL - ov);
    // Ts = total seat depth (upper deck back); rise = height of the upper deck front above the lower surface.
    const T = [
      // t,   dL, ov, Ts, rise
      [0.00, 50, 4, 65, 14], [0.05, 56, 8, 78, 16], [0.09, 66, 16, 104, 20], [0.14, 72, 22, 119, 22], [0.18, 72, 22, 121, 22],
      [0.23, 72, 22, 122, 22], [0.27, 72, 22, 114, 22], [0.32, 72, 22, 111, 22], [0.36, 72, 22, 108, 22], [0.41, 72, 22, 108, 22],
      [0.44, 52, 12, 60, 36], [0.50, 47, 7, 60, 39], [0.56, 56, 12, 62, 36],
      [0.59, 72, 22, 103, 22], [0.64, 72, 22, 112, 22], [0.68, 72, 22, 125, 22], [0.73, 72, 22, 127, 22], [0.77, 72, 22, 115, 22],
      [0.82, 72, 22, 104, 22], [0.86, 70, 20, 94, 22], [0.91, 60, 12, 76, 20], [0.95, 46, 4, 58, 16], [1.00, 34, 2, 37, 12],
    ];
    const col = (f) => T.map((r) => [r[0], f(r)]);
    return {
      wall,
      foulScale: 1,
      backstop: 46,
      lower: { depth: col((r) => r[1]), slope: 0.38, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: col((r) => r[2]), rise: col((r) => r[4]), depth: col((r) => r[3] - (r[1] - r[2])), slope: 0.45, extent: [0.02, 0.98],
      },
      // Bleacher blocks are built by hand (their fronts stand behind the bullpens); the generic span only covers the RF-corner fan.
      outfield: { depth: 62, slope: 0.42, spans: [[33.5, 45, 62, 0.42]], eye: null, eyeHeight: 30, eyeDepth: 20 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#8a3f35', facade: '#5f8d80', wall: '#3d6b58', cream: '#6c9b8d' },
    };
  },

  build(ctx) {
    const { THREE, G, add, lam, parts, paths, dims, tools } = ctx;
    const low = ctx.lod === 'low';
    const { bPts, bN } = paths;
    const D = dims.deckAt;
    // palette
    const COL = {
      brick: '#99593f', brickD: '#7f4634', cream: '#e0d5b3', stone: '#a79c84', steel: '#4a5a52', glass: '#4d6b6c', win: '#26332f',
      teal: '#78a69a', tealD: '#5d8a80', truss: '#56655d', lamp: '#f0e4b0', conc: '#8b8a7a', green: '#3d6b58', door: '#3f6b55',
      lat: '#8a918a',
    };
    const lc = {};
    const lamc = (hex) => lc[hex] || (lc[hex] = lam(hex));
    const mat = {}; for (const k of Object.keys(COL)) mat[k] = lamc(COL[k]);

    // ---------- helpers
    const dummy = new THREE.Object3D();
    const BOXG = new THREE.BoxGeometry(1, 1, 1); BOXG.clearGroups();
    const box = () => BOXG;
    const buckets = new Map();       // material -> instance list (all unit boxes of one material become one draw call)
    const setMat = (m, list) => list.forEach((t, i) => { dummy.position.set(...t.p); dummy.rotation.set(0, t.ry || 0, 0); dummy.scale.set(...t.s); if (t.look) dummy.lookAt(...t.look); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); });
    const inst = (geo, material, list) => {
      if (geo === BOXG) { if (!buckets.has(material)) buckets.set(material, []); buckets.get(material).push(...list); return null; }
      const m = new THREE.InstancedMesh(geo, material, list.length);
      setMat(m, list); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const flush = () => {
      for (const [material, list] of buckets) {
        if (!list.length) continue;
        const m = new THREE.InstancedMesh(BOXG, material, list.length);
        setMat(m, list); m.instanceMatrix.needsUpdate = true; m.frustumCulled = false; G.add(m);
      }
    };
    const mergeGeos = (geos) => {
      const pos = []; for (const g of geos) pos.push(...g.attributes.position.array);
      const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.computeVertexNormals(); return out;
    };
    const quad = (a, b, c, d) => [...a, ...b, ...c, ...a, ...c, ...d];
    const geoFrom = (pos) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g; };
    const angOf = (tx, tz) => Math.atan2(-tz, tx);   // ry that turns a box x-axis onto the horizontal direction (tx, tz)
    const rodAt = (A, B, th) => ({ p: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2], look: B, s: [th, th, Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2])] });
    // resample a polyline to n points by arc length
    const resample = (poly, n) => {
      const L = [0]; for (let i = 1; i < poly.length; i++) L.push(L[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
      const tot = L[L.length - 1], out = [];
      for (let k = 0; k < n; k++) {
        const s = (tot * k) / (n - 1); let i = 0; while (i < poly.length - 2 && L[i + 1] < s) i++;
        const u = (s - L[i]) / Math.max(1e-6, L[i + 1] - L[i]);
        out.push([lerp(poly[i][0], poly[i + 1][0], u), lerp(poly[i][1], poly[i + 1][1], u)]);
      }
      return out;
    };
    const arcLen = (poly) => { let s = 0; for (let i = 1; i < poly.length; i++) s += Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]); return s; };
    // outward normal for a point on a facade segment (away from the field center)
    const outN = (dx, dz, px, pz) => { let nx = dz, nz = -dx; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l; if (nx * px + nz * (pz + 120) < 0) { nx = -nx; nz = -nz; } return [nx, nz]; };
    // vertical band along a polyline: heights y0..y1, pushed outward by o0..o1
    const bandPos = (poly, y0, y1, o0, o1) => {
      const pos = [];
      for (let i = 0; i < poly.length - 1; i++) {
        const [ax, az] = poly[i], [bx, bz] = poly[i + 1];
        const [nx, nz] = outN(bx - ax, bz - az, (ax + bx) / 2, (az + bz) / 2);
        pos.push(...quad([ax + nx * o0, y0, az + nz * o0], [bx + nx * o0, y0, bz + nz * o0], [bx + nx * o1, y1, bz + nz * o1], [ax + nx * o1, y1, az + nz * o1]));
      }
      return pos;
    };
    // deck surface height at a plan point, from the bowl tables
    const NB = bPts.length;
    const deckAt = (x, z) => {
      let bi = 0, bd = 1e12;
      for (let i = 0; i < NB; i++) { const dx = x - bPts[i][0], dz = z - bPts[i][1], d2 = dx * dx + dz * dz; if (d2 < bd) { bd = d2; bi = i; } }
      const d = (x - bPts[bi][0]) * bN[bi][0] + (z - bPts[bi][1]) * bN[bi][1];
      if (bi >= dims.i0 && bi <= dims.i1 && d >= D.d0(bi)) return D.h0(bi) + dims.sU * (Math.min(d, D.dEnd(bi)) - D.d0(bi));
      return d <= 0 ? 3.5 : 3.5 + dims.sL * Math.min(d, D.dL(bi));
    };
    // point on the Monster: sLF = feet from the left-field pole along the wall base, out = feet away from the field
    const MU = [0.7333150, -0.6798890], MO = [-0.6798890, -0.7333150];
    const monsterPt = (sLF, out = 0) => [-219.2 + MU[0] * sLF + MO[0] * out, -219.2 + MU[1] * sLF + MO[1] * out];

    // ---------- plain park-name plaque texture (cream plate, brick-red letters)
    const plaqueTex = tools.textTexture((g, w, h) => {
      g.fillStyle = '#e0d5b3'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8f5642'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
      g.fillStyle = '#8f4a3a'; g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FENWAY PARK', w / 2, h / 2 + 3);
    }, 512, 96);
    const plaques = [];
    const plaque = (cx, cy, cz, nx, nz, w, h) => {
      const g = new THREE.PlaneGeometry(w, h).toNonIndexed();
      const m = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-nx, 0, -nz), new THREE.Vector3(0, 1, 0)); m.setPosition(cx, cy, cz);
      g.applyMatrix4(m); plaques.push(g);
    };

    // ---------- bleacher seat material (dark green rows)
    const seatTex = tools.textTexture((g, w, h) => {
      g.fillStyle = '#2c4a38'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, h - 14, w, 14);
      g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(0, 0, w, 10); g.fillStyle = '#9c9680'; g.fillRect(0, 0, 6, h);
    }, 64, 64);
    seatTex.wrapS = seatTex.wrapT = THREE.RepeatWrapping;
    const bleachMat = new THREE.MeshLambertMaterial({ map: seatTex, side: THREE.DoubleSide });

    // =====================================================================================
    // FACADE: brick body, stone base, cream belt courses and cornice, piers, arched doors, paired windows, gate pavilions
    // =====================================================================================
    const runs = [
      { poly: FAC_3B, h: 44, win: 2, gates: [0.42] }, { poly: FAC_HOME, h: 52, win: 2, gates: [0.5] }, { poly: FAC_1B, h: 44, win: 2, gates: [0.3, 0.72], plaq: 0 },
      { poly: FAC_RF, h: 38, win: 1, gates: [0.45] }, { poly: FAC_BL, h: 46, win: 0, steel: true },
    ];
    const bodyB = [], bodyS = [], baseG = [], corG = [], beltG = [], pierL = [], winL = [], doorL = [], doorArch = [], ringL = [], trimL = [], gateL = [];
    runs.forEach((run, ri) => {
      const { poly, h } = run;
      (run.steel ? bodyS : bodyB).push(geoFrom(bandPos(poly, 6, h - 6, 0, 0)));
      baseG.push(geoFrom(bandPos(poly, 0, 6.5, 0.6, 0.6)));
      corG.push(geoFrom(bandPos(poly, h - 6, h + 1.5, 1.4, 1.4)));
      corG.push(geoFrom([...bandPos(poly, h + 1.5, h + 1.5, 1.4, -1.2)]));
      if (!run.steel) {   // cream belt courses between the floors
        beltG.push(geoFrom(bandPos(poly, 14.2, 16, 0.7, 0.7)));
        if (run.win !== 1) beltG.push(geoFrom(bandPos(poly, 29, 30.7, 0.7, 0.7)));
      }
      const total = arcLen(poly), bay = ri === 1 ? 17 : 14, n = Math.max(2, Math.round(total / bay));
      const gateAt = new Set((run.gates || []).map((f) => Math.round(n * f)));
      let firstGate = true;
      for (let k = 0; k <= n; k++) {
        const s = (total * k) / n; let i = 0, acc = 0;
        while (i < poly.length - 2 && acc + Math.hypot(poly[i + 1][0] - poly[i][0], poly[i + 1][1] - poly[i][1]) < s) { acc += Math.hypot(poly[i + 1][0] - poly[i][0], poly[i + 1][1] - poly[i][1]); i++; }
        const sl = Math.hypot(poly[i + 1][0] - poly[i][0], poly[i + 1][1] - poly[i][1]) || 1, u = Math.min(1, (s - acc) / sl);
        const dx = (poly[i + 1][0] - poly[i][0]) / sl, dz = (poly[i + 1][1] - poly[i][1]) / sl;
        const px = lerp(poly[i][0], poly[i + 1][0], u), pz = lerp(poly[i][1], poly[i + 1][1], u);
        const [nx, nz] = outN(dx, dz, px, pz), ry = angOf(dx, dz);
        if (run.steel) { if (k < n) pierL.push({ p: [px + nx * 0.7, (h + 6) / 2 - 0.5, pz + nz * 0.7], ry, s: [1.4, h - 8, 1.4] }); continue; }
        pierL.push({ p: [px + nx * 0.9, (h + 6) / 2 - 0.5, pz + nz * 0.9], ry, s: [2.2, h - 8, 1.8] });
        if (k === n) continue;
        const mx = px + dx * bay / 2, mz = pz + dz * bay / 2;
        if (gateAt.has(k)) { gateL.push({ x: mx, z: mz, nx, nz, ry, h, plaq: run.plaq === 0 && firstGate }); firstGate = false; continue; }
        // ground floor: green door with a round top (12 ft)
        doorL.push({ p: [mx + nx * 0.5, 4, mz + nz * 0.5], ry, s: [7.4, 8, 0.9] });
        if (!low) {
          doorArch.push({ p: [mx + nx * 0.5, 8, mz + nz * 0.5], ry, s: [7.4, 7.4, 0.9] });
          ringL.push({ p: [mx + nx * 0.3, 4.4, mz + nz * 0.3], ry, s: [8.6, 8.8, 0.8] });
        }
        // upper floors: dark paired windows with cream lintel, sill and mullion
        const rows = run.win === 1 ? [22] : [22.5, 36.5];
        rows.forEach((cy, rIdx) => {
          if (low && rIdx > 0 && k % 2) return;
          winL.push({ p: [mx + nx * 0.4, cy, mz + nz * 0.4], ry, s: [6.2, 7.6, 0.9] });
          if (!low) {
            trimL.push({ p: [mx + nx * 0.7, cy + 4.3, mz + nz * 0.7], ry, s: [7.6, 0.9, 1.0] });
            trimL.push({ p: [mx + nx * 0.7, cy - 4.2, mz + nz * 0.7], ry, s: [7.2, 0.7, 1.1] });
            trimL.push({ p: [mx + nx * 0.85, cy, mz + nz * 0.85], ry, s: [0.5, 7.6, 0.6] });
          }
        });
      }
    });
    add(mergeGeos(bodyB), mat.brick);
    if (bodyS.length) add(mergeGeos(bodyS), lamc('#6f8f80'));
    add(mergeGeos(baseG), mat.stone);
    add(mergeGeos([...corG, ...beltG]), mat.cream);
    inst(box(), mat.cream, pierL);
    inst(box(), mat.win, winL);
    inst(box(), mat.door, doorL);
    if (!low) {
      inst(new THREE.CylinderGeometry(0.5, 0.5, 1, 10).rotateX(Math.PI / 2), mat.door, doorArch);
      inst(box(), mat.cream, ringL);
      inst(box(), mat.cream, trimL);
    }
    // gate pavilions: taller brick masses with a cream surround, a dark arched opening, and the corner bay plaque
    {
      const pav = [], surr = [], opening = [], cap = [];
      for (const g of gateL) {
        const H = g.h + 8, w = 20;
        pav.push({ p: [g.x + g.nx * 2.5, H / 2, g.z + g.nz * 2.5], ry: g.ry, s: [w, H, 4.5] });
        surr.push({ p: [g.x + g.nx * 5, 9, g.z + g.nz * 5], ry: g.ry, s: [w + 2, 18, 1.2] });
        opening.push({ p: [g.x + g.nx * 5.8, 8, g.z + g.nz * 5.8], ry: g.ry, s: [11, 16, 0.6] });
        cap.push({ p: [g.x + g.nx * 3.5, H + 1.5, g.z + g.nz * 3.5], ry: g.ry, s: [w + 3, 3, 6.5] });
        if (g.plaq) { cap.push({ p: [g.x + g.nx * 3.2, H + 7.5, g.z + g.nz * 3.2], ry: g.ry, s: [w - 1, 9, 5.2] }); plaque(g.x + g.nx * 6.1, H + 7.5, g.z + g.nz * 6.1, g.nx, g.nz, w - 3, 6.6); }
      }
      inst(box(), mat.brickD, pav); inst(box(), mat.cream, surr); inst(box(), mat.win, opening); inst(box(), mat.cream, cap);
    }

    // =====================================================================================
    // HOME-PLATE BLOCK: club level, roof boxes (generic upper deck), glass press level, teal cap, plaque, mast
    // =====================================================================================
    {
      const H = 96, shp = new THREE.Shape(HOME.map(([x, z]) => new THREE.Vector2(x, z)));
      const top = new THREE.ShapeGeometry(shp).rotateX(Math.PI / 2); // lies in xz, y = 0 (after rotate, z is mirrored)
      const flat = top.clone(); flat.translate(0, H, 0);
      add(flat, mat.tealD);
      // setback cap (teal) over the press level
      const pav = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat.teal); pav.scale.set(120, 8, 26); pav.position.set(0, H + 4, 122); pav.geometry.clearGroups(); G.add(pav);
      // north face toward the field: dark glass club band, teal fascia under the roof boxes, glass press band, teal parapet
      add(geoFrom(quad([-73, 36, 93.4], [71, 36, 93.4], [71, 54, 93.4], [-73, 54, 93.4])), mat.glass);
      add(geoFrom(quad([-73, 54, 93.4], [71, 54, 93.4], [71, 58, 93.4], [-73, 58, 93.4])), mat.teal);
      add(geoFrom(quad([-73, 58, 93.2], [71, 58, 93.2], [71, 76, 93.2], [-73, 76, 93.2])), mat.tealD);
      add(geoFrom(quad([-73, 76, 93.4], [71, 76, 93.4], [71, 90, 93.4], [-73, 90, 93.4])), mat.glass);
      add(geoFrom(quad([-73, 90, 93.4], [71, 90, 93.4], [71, H, 93.4], [-73, H, 93.4])), mat.teal);
      add(geoFrom([...bandPos(HOME.concat([HOME[0]]), H, H + 3, 0.4, 0.4)]), mat.teal);
      plaque(0, 93, 93.9, 0, -1, 34, 6.2);
      // side walls of the block toward the field
      add(geoFrom(bandPos([HOME[1], HOME[0]], 30, H, 0.1, 0.1)), mat.teal);
      add(geoFrom(bandPos([HOME[2], HOME[3]], 30, H, 0.1, 0.1)), mat.teal);
      // window mullions on the glass bands
      const mull = [];
      if (!low) for (let x = -70; x <= 70; x += 10) { mull.push({ p: [x, 45, 93.9], ry: 0, s: [0.5, 18, 0.5] }); mull.push({ p: [x, 83, 93.9], ry: 0, s: [0.5, 14, 0.5] }); }
      inst(box(), mat.cream, mull);
      // rooftop plant, mast and a flag
      const plant = [];
      [[-52, 128, 16, 8, 14], [-8, 120, 22, 10, 12], [38, 118, 18, 9, 10], [-30, 160, 26, 11, 9], [20, 170, 20, 10, 8], [70, 130, 12, 8, 7]].forEach(([x, z, w, h, d]) => plant.push({ p: [x, H + 8 + h / 2, z], ry: 0, s: [w, h, d] }));
      inst(box(), lamc('#9a9684'), plant);
      inst(box(), mat.lat, [{ p: [-40, H + 8 + 20, 118], ry: 0, s: [0.7, 40, 0.7] }, { p: [-34, H + 8 + 36, 118], ry: 0, s: [10, 5, 0.25] }]);
    }

    // =====================================================================================
    // GRANDSTAND ROOF: teal deck, teal fascia with a cream stripe, trusses, columns, light-tower spots
    // =====================================================================================
    const rY = (x, z) => Math.min(80, Math.max(58, deckAt(x, z) + 14));
    const trussL = [], colL = [], towerSpots = [], roofStripes = [];
    const roofSide = (O, I) => {
      const n = 24, o = resample(O, n), ii = resample(I, n);
      const topPos = [], faPos = [], stripe = [], under = [];
      for (let k = 0; k < n - 1; k++) {
        const yi0 = rY(ii[k][0], ii[k][1]), yi1 = rY(ii[k + 1][0], ii[k + 1][1]), yo0 = yi0 + 5, yo1 = yi1 + 5;
        topPos.push(...quad([ii[k][0], yi0, ii[k][1]], [ii[k + 1][0], yi1, ii[k + 1][1]], [o[k + 1][0], yo1, o[k + 1][1]], [o[k][0], yo0, o[k][1]]));
        faPos.push(...quad([ii[k][0], yi0 - 2.5, ii[k][1]], [ii[k + 1][0], yi1 - 2.5, ii[k + 1][1]], [ii[k + 1][0], yi1 + 0.8, ii[k + 1][1]], [ii[k][0], yi0 + 0.8, ii[k][1]]));
        stripe.push(...quad([ii[k][0], yi0 - 0.6, ii[k][1]], [ii[k + 1][0], yi1 - 0.6, ii[k + 1][1]], [ii[k + 1][0], yi1 + 0.2, ii[k + 1][1]], [ii[k][0], yi0 + 0.2, ii[k][1]]));
        under.push(...quad([ii[k][0], yi0 - 0.6, ii[k][1]], [ii[k + 1][0], yi1 - 0.6, ii[k + 1][1]], [o[k + 1][0], yi1 + 4.4, o[k + 1][1]], [o[k][0], yi0 + 4.4, o[k][1]]));
      }
      add(geoFrom(topPos), mat.teal);
      add(geoFrom(faPos), mat.tealD);
      roofStripes.push(geoFrom(stripe));
      add(geoFrom(under), lamc('#8d9185'));
      for (let k = 0; k < n; k += (low ? 3 : 2)) {
        const yi = rY(ii[k][0], ii[k][1]), yo = yi + 5;
        const A = [ii[k][0], yi - 1.4, ii[k][1]], B = [o[k][0], yo - 1.4, o[k][1]];
        trussL.push(rodAt(A, B, 1.1));
        for (const f of [0, 0.5]) {
          const x = lerp(ii[k][0], o[k][0], f), z = lerp(ii[k][1], o[k][1], f), yTop = lerp(yi, yo, f) - 2;
          const yb = deckAt(x, z);
          if (yTop - yb > 4 && (f === 0 || k % 4 === 0)) colL.push({ p: [x, (yTop + yb) / 2, z], ry: 0, s: [1.5, yTop - yb, 1.5] });
        }
      }
      // two light towers per roof, standing on the roof behind the front edge
      for (const k of [6, 17]) { const x = lerp(ii[k][0], o[k][0], 0.65), z = lerp(ii[k][1], o[k][1], 0.65); towerSpots.push([x, z, rY(x, z) + 4, 116]); }
    };
    roofSide(ROOF3_O, ROOF3_I);
    roofSide(ROOF1_O, ROOF1_I);
    add(mergeGeos(roofStripes), mat.cream);
    inst(box(), mat.truss, trussL);
    inst(box(), mat.steel, colL);

    // =====================================================================================
    // BLEACHER BLOCKS (custom decks): seat plane, skirts and walls, aisles, rails
    // =====================================================================================
    {
      const seatPos = [], seatUv = [], wallPos = [], aislePos = [], blocks = [];
      const cross = (px, pz, qx, qz) => px * qz - pz * qx;
      const blockOf = (B) => {
        const P = B.poly, [fa, fb] = B.front, A = P[fa], Bq = P[fb];
        const dx = Bq[0] - A[0], dz = Bq[1] - A[1], L = Math.hypot(dx, dz), tx = dx / L, tz = dz / L;
        let nx = tz, nz = -tx; if (nz > 0) { nx = -nx; nz = -nz; }          // outward = toward -z (away from the field)
        const depth = (p) => (p[0] - A[0]) * nx + (p[1] - A[1]) * nz;
        const along = (p) => (p[0] - A[0]) * tx + (p[1] - A[1]) * tz;
        const yAt = (p) => B.yf + B.slope * depth(p);
        for (let i = 1; i < P.length - 1; i++) {      // fan triangulation of the convex polygon
          for (const p of [P[0], P[i], P[i + 1]]) { seatPos.push(p[0], yAt(p), p[1]); seatUv.push(along(p) / 24, depth(p) / 3); }
        }
        for (let i = 0; i < P.length; i++) {          // walls to the ground; the front edge gets a low skirt
          const a = P[i], b = P[(i + 1) % P.length];
          const isFront = (i === fa && (i + 1) % P.length === fb) || (i === fb && (i + 1) % P.length === fa);
          const ya = isFront ? B.fy : yAt(a), yb = isFront ? B.fy : yAt(b);
          wallPos.push(...quad([a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], yb, b[1]], [a[0], ya, a[1]]));
        }
        for (const f of B.aisles) {                   // aisle strips from the front edge to the far boundary
          const fp = [lerp(A[0], Bq[0], f), lerp(A[1], Bq[1], f)];
          let best = 0;
          for (let i = 0; i < P.length; i++) {
            const a = P[i], b = P[(i + 1) % P.length], ex = b[0] - a[0], ez = b[1] - a[1], den = cross(nx, nz, ex, ez);
            if (Math.abs(den) < 1e-9) continue;
            const t = cross(a[0] - fp[0], a[1] - fp[1], ex, ez) / den, u = cross(a[0] - fp[0], a[1] - fp[1], nx, nz) / den;
            if (u >= -1e-6 && u <= 1 + 1e-6 && t > best) best = t;
          }
          const q = [fp[0] + nx * best, fp[1] + nz * best], rx = -nz * 1.6, rz = nx * 1.6;
          aislePos.push(...quad([fp[0] - rx, yAt(fp) + 0.25, fp[1] - rz], [fp[0] + rx, yAt(fp) + 0.25, fp[1] + rz], [q[0] + rx, yAt(q) + 0.25, q[1] + rz], [q[0] - rx, yAt(q) + 0.25, q[1] - rz]));
        }
        blocks.push({ A, Bq, yAt, P });
      };
      blockOf(CF_BLOCK); blockOf(RC_BLOCK);
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.Float32BufferAttribute(seatPos, 3)); sg.setAttribute('uv', new THREE.Float32BufferAttribute(seatUv, 2)); sg.computeVertexNormals();
      add(sg, bleachMat);
      add(geoFrom(wallPos), mat.green);
      add(geoFrom(aislePos), lamc('#9c9680'));
      // rails along the front edge of each block and (high) along the back edge
      blocks.forEach((b) => { const fr = [b.A, b.Bq]; G.add(tools.rail(fr, () => b.yAt(fr[0]), { height: 3.2, spacing: 7, color: '#566259', lod: ctx.lod })); });
      if (!low) {
        const b = blocks[0], bk = [CF_BLOCK.poly[3], CF_BLOCK.poly[2]];
        G.add(tools.rail(bk, (i) => b.yAt(bk[i]), { height: 3.4, spacing: 8, color: '#566259', lod: ctx.lod }));
        const b2 = blocks[1], bk2 = [RC_BLOCK.poly[3], RC_BLOCK.poly[4]];
        G.add(tools.rail(bk2, (i) => b2.yAt(bk2[i]), { height: 3.4, spacing: 8, color: '#566259', lod: ctx.lod }));
      }
    }

    // =====================================================================================
    // RIGHT-FIELD ROOF TERRACE (steel frame, slab, glass rail) behind the corner seats
    // =====================================================================================
    {
      const pts = resample(RF_TERRACE, 9), W = 22;
      const slab = [], cols = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), nx = -dz / l, nz = dx / l;
        const ox = nx * W, oz = nz * W;
        slab.push(...quad([a[0], 47, a[1]], [b[0], 47, b[1]], [b[0] + ox, 47, b[1] + oz], [a[0] + ox, 47, a[1] + oz]));
        if (i % 2 === 0) cols.push({ p: [a[0], 23.5, a[1]], ry: 0, s: [1.6, 47, 1.6] }, { p: [a[0] + ox, 23.5, a[1] + oz], ry: 0, s: [1.6, 47, 1.6] });
      }
      add(geoFrom(slab), lamc('#a79c84'));
      inst(box(), mat.steel, cols);
      add(geoFrom(bandPos(pts, 47, 51, 0, 0)), new THREE.MeshLambertMaterial({ color: '#7f9a99', transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }));
    }

    // =====================================================================================
    // GREEN MONSTER: wall back, seat platform with brackets, rear panels, netting, scoreboard, ladder, sign tower
    // =====================================================================================
    {
      const [wp, wn, wd] = tools.span(-45, -7.4);
      const wh = (i) => tools.wallH(ctx.spec, wd[i]);
      add(tools.sweepSolid(wp, wn, (i) => [[0, 0], [0, wh(i)], [3, wh(i)], [3, 0]], [0, 0, 0, -1], 0), ctx.M);
      add(tools.sweepSolid(wp, wn, (i) => [[0, wh(i)], [0, wh(i) + 2.2], [4, wh(i) + 2.2], [26, wh(i) + 9], [26, wh(i) + 4], [9, wh(i) - 3], [3, wh(i) - 3], [3, wh(i)]], [0, 1, 1, 0, 0, 0, 0, 0], 0), ctx.M);
      // teal rear panels behind the platform (photo2: solid metal back)
      add(geoFrom(bandPos(wp, 30, 49, 26.6, 26.6)), mat.green);
      const br = [], posts = [];
      const nSt = Math.max(8, Math.round(arcLen(wp) / 16));
      const rs = resample(wp, nSt);
      rs.forEach(([x, z], k) => {
        const j = Math.min(wp.length - 2, Math.round((k / (nSt - 1)) * (wp.length - 1))), [nx, nz] = wn[j];
        const y0 = wh(j) - 3;
        br.push(rodAt([x + nx * 3, y0 - 0.5, z + nz * 3], [x + nx * 26, y0 + 6, z + nz * 26], 1.1));
        posts.push({ p: [x + nx * 26, y0 + 5, z + nz * 26], ry: 0, s: [1.2, 10, 1.2] });   // short struts under the platform lip
      });
      inst(box(), mat.steel, br); inst(box(), mat.steel, posts);
      // netting over the seats (translucent) and vertical panel seams on the wall face
      const net = []; const ptsN = resample(wp, 18);
      for (let k = 0; k < 17; k++) {
        const j0 = Math.min(wp.length - 1, Math.round((k / 17) * (wp.length - 1))), [nx, nz] = wn[j0];
        const a = ptsN[k], b = ptsN[k + 1], y = 49;
        net.push(...quad([a[0] + nx * 26, y, a[1] + nz * 26], [b[0] + nx * 26, y, b[1] + nz * 26], [b[0] + nx * 26, y + 17, b[1] + nz * 26], [a[0] + nx * 26, y + 17, a[1] + nz * 26]));
      }
      if (!low) add(geoFrom(net), new THREE.MeshLambertMaterial({ color: '#24302a', transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
      if (!low) {
        const seams = [], rs2 = resample(wp, Math.round(arcLen(wp) / 7));
        rs2.forEach(([x, z], k) => {
          const j = Math.min(wp.length - 2, Math.round((k / (rs2.length - 1)) * (wp.length - 1))), [nx, nz] = wn[j];
          const dxs = wp[j + 1][0] - wp[j][0], dzs = wp[j + 1][1] - wp[j][1], hh = wh(j);
          seams.push({ p: [x - nx * 0.25, hh / 2, z - nz * 0.25], ry: angOf(dxs, dzs), s: [0.6, hh - 1, 0.5] });
        });
        inst(box(), lamc('#2f5440'), seams);
      }
      // hand-operated scoreboard, from the CF end: side panel (23 ft), main board (89 ft), side panel (29 ft). Faces are blank.
      {
        const sCF0 = 14, sCF1 = 155, wTot = sCF1 - sCF0, hB = 14.5, yB = 1.5;
        const c = monsterPt(232.1 - (sCF0 + sCF1) / 2, -0.4);
        const tex = tools.textTexture((g, w, h) => {
          const f = w / wTot; g.fillStyle = '#162a20'; g.fillRect(0, 0, w, h);
          g.strokeStyle = '#d9d5c2'; g.lineWidth = 4;
          [0, 23, 112, 141].forEach((e) => { g.beginPath(); g.moveTo(e * f, 0); g.lineTo(e * f, h); g.stroke(); });
          g.strokeRect(2, 2, w - 4, h - 4);
          g.lineWidth = 2;
          for (let r = 1; r < 4; r++) { g.beginPath(); g.moveTo(23 * f, (h * r) / 4); g.lineTo(112 * f, (h * r) / 4); g.stroke(); }
          for (let col = 1; col < 20; col++) { const xx = (23 + col * 89 / 20) * f; g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx, h); g.stroke(); }
        }, 1280, 132);
        const sb = new THREE.Mesh(new THREE.PlaneGeometry(wTot, hB), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
        sb.position.set(c[0], yB + hB / 2, c[1]); sb.lookAt(c[0] - MO[0] * 10, yB + hB / 2, c[1] - MO[1] * 10);
        G.add(sb);
        // ladder: from 13 ft (upper-left corner of the board) to the top of the wall
        const l0 = monsterPt(232.1 - (sCF1 - 1), -0.6), l1 = monsterPt(232.1 - (sCF1 - 3.2), -0.6), lm = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
        const lad = [l0, l1].map((q) => ({ p: [q[0], 25, q[1]], ry: 0, s: [0.35, 24, 0.35] }));
        for (let y = 14; y < 37; y += (low ? 4 : 2)) lad.push({ p: [lm[0], y, lm[1]], ry: angOf(MU[0], MU[1]), s: [2.3, 0.3, 0.3] });
        inst(box(), lamc('#dcd6bc'), lad);
      }
      // Lansdowne-side sign tower: steel frame, teal side panels, catwalks, plain park-name plaque (photo2)
      {
        const c = monsterPt(88, 30), nx = MO[0], nz = MO[1], tx = MU[0], tz = MU[1], ry = angOf(tx, tz);
        const L = [], Pn = [];
        const at = (s, o, y) => [c[0] + tx * s + nx * o, y, c[1] + tz * s + nz * o];
        Pn.push({ p: at(0, 0, 62), ry, s: [34, 30, 3] });
        for (const sx of [-23, 23]) Pn.push({ p: at(sx, 0, 60), ry, s: [12, 36, 7] });
        for (const sx of [-21, -7, 7, 21]) for (const so of [-4, 4]) L.push({ p: at(sx, so, 20), ry: 0, s: [1.6, 40, 1.6] });
        for (const sx of [-21, 21]) L.push(rodAt(at(sx, 4, 4), at(sx * 0.4, -3, 38), 1.1));
        L.push({ p: at(0, 7, 44), ry, s: [58, 0.6, 5] }, { p: at(0, 9.4, 47), ry, s: [58, 0.4, 0.4] });
        L.push({ p: at(0, 0, 80.5), ry, s: [58, 0.5, 4] }, { p: at(0, 2, 83), ry, s: [58, 0.4, 0.4] });
        if (!low) for (let k = -28; k <= 28; k += 7) L.push({ p: at(k, 9.4, 45.5), ry: 0, s: [0.4, 3, 0.4] });
        inst(box(), mat.steel, L); inst(box(), mat.green, Pn);
        const pp = at(0, 2.2, 66); plaque(pp[0], pp[1], pp[2], nx, nz, 26, 7);
      }
    }

    // =====================================================================================
    // SCOREBOARDS AND VIDEO BOARDS: blank dark faces, frame, back lattice, catwalks, support legs
    // =====================================================================================
    const steelL = [], faceMeshes = [];
    const gridTex = (aspect) => tools.textTexture((g, w, h) => {
      g.fillStyle = '#1b2420'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a3731'; g.lineWidth = 1;
      const step = w / 64; for (let x = step; x < w; x += step) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = step; y < h; y += step) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, 512, Math.max(64, Math.round(512 / aspect)));
    // one board: c = [x, z] of the face center, n = unit direction it faces (toward the field), w x h feet, foot height y0
    const board = (c, n, w, h, y0) => {
      const t = [-n[1], n[0]], ry = angOf(t[0], t[1]), cy = y0 + h / 2, L = steelL;
      const P = (s, off, y) => [c[0] + t[0] * s + n[0] * off, y, c[1] + t[1] * s + n[1] * off];
      const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: gridTex(w / h), side: THREE.DoubleSide }));
      face.position.set(...P(0, 0.3, cy)); face.lookAt(c[0] + n[0] * 20, cy, c[1] + n[1] * 20); faceMeshes.push(face);
      L.push({ p: P(0, 0.4, y0 - 0.8), ry, s: [w + 3, 1.6, 2.6] }, { p: P(0, 0.4, y0 + h + 0.8), ry, s: [w + 3, 1.6, 2.6] });   // frame
      for (const sx of [-w / 2 - 0.8, w / 2 + 0.8]) L.push({ p: P(sx, 0.4, cy), ry, s: [1.6, h + 3, 2.6] });
      const D2 = 5;                                                                                                           // back structure
      L.push({ p: P(0, -D2, y0 + h), ry, s: [w, 1, 1] }, { p: P(0, -D2, y0), ry, s: [w, 1, 1] });
      const nT = Math.max(2, Math.round(w / 22));
      for (let k = 0; k <= nT; k++) {
        const s = -w / 2 + (w * k) / nT;
        L.push({ p: P(s, -D2, cy), ry, s: [0.9, h, 0.9] }, { p: P(s, -0.8, cy), ry, s: [0.9, h, 0.9] });
        if (!low) {
          L.push(rodAt(P(s, -0.8, y0), P(s, -D2, y0 + h), 0.7));
          if (k < nT) L.push(rodAt(P(s, -D2, y0), P(s + w / nT, -D2, y0 + h), 0.6));
        }
      }
      L.push({ p: P(0, 3.4, y0 - 1.8), ry, s: [w + 3, 0.5, 4] });                                                             // front catwalk and rail
      L.push({ p: P(0, 5.3, y0 + 1.4), ry, s: [w + 3, 0.4, 0.4] });
      const nR = low ? Math.round(w / 20) : Math.round(w / 8);
      for (let k = 0; k <= nR; k++) L.push({ p: P(-w / 2 - 1.5 + ((w + 3) * k) / nR, 5.3, y0 - 0.1), ry: 0, s: [0.35, 3, 0.35] });
      L.push({ p: P(0, -D2 - 2, y0 + h + 0.4), ry, s: [w, 0.4, 3.4] });                                                       // service walk
      const nL = Math.max(2, Math.round(w / 24));                                                                             // legs
      for (let k = 0; k <= nL; k++) {
        const s = -w / 2 + (w * k) / nL, hh = y0 - 1;
        L.push({ p: P(s, -D2 - 1, hh / 2), ry: 0, s: [1.8, hh, 1.8] });
        if (!low && hh > 14) L.push(rodAt(P(s, -D2 - 1, hh * 0.2), P(s + (k % 2 ? -8 : 8), -D2 - 1, y0 - 3), 0.8));
      }
    };
    {
      // center-field main board 100 x 38 ft on the back of the CF bleachers (lattice seen on the sheet at (55,-503)..(142,-517))
      const dl = Math.hypot(87, -14); let fN = [14 / dl, 87 / dl]; if (fN[1] < 0) fN = [-fN[0], -fN[1]];
      board([98.5, -512], fN, 100, 38, 62);
      // left-center board 17 x 100 ft on the Monster rear, over the CF end of the seats
      board(monsterPt(232.1 - 55, 29), [-MO[0], -MO[1]], 100, 17, 52);
      // right-field group on the back edge of the right block: sponsor panel, 30 x 16 ft message board, sponsor panel (blank)
      const e0 = RC_BLOCK.poly[3], e1 = RC_BLOCK.poly[4], el = Math.hypot(e1[0] - e0[0], e1[1] - e0[1]), et = [(e1[0] - e0[0]) / el, (e1[1] - e0[1]) / el];
      let en = [et[1], -et[0]]; if (en[1] < 0) en = [-en[0], -en[1]];
      const at = (f, off) => [e0[0] + et[0] * el * f + en[0] * off, e0[1] + et[1] * el * f + en[1] * off];
      board(at(0.35, 1), en, 30, 16, 60);
      board(at(0.35 - 0.19, 1), en, 18, 16, 60);
      board(at(0.35 + 0.19, 1), en, 18, 16, 60);
      // 2017 right-field board 46.2 x 14.3 ft at the back-right corner of the block
      board([268, -466], [-0.45, 0.89], 46.2, 14.3, 58);
    }
    inst(box(), mat.lat, steelL);
    faceMeshes.forEach((m) => G.add(m));

    // =====================================================================================
    // LIGHT TOWERS: lattice mast, cross-braces, lamp bank (instanced)
    // =====================================================================================
    {
      const legs = [], braces = [], banks = [], dots = [];
      const tower = (x, z, y0, H, w = 7) => {
        const hw = w / 2, fy = Math.atan2(-x, -(z + 120)), yaw = fy;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
          const lx = x + Math.cos(yaw) * sx * hw + Math.sin(yaw) * sz * hw, lz = z - Math.sin(yaw) * sx * hw + Math.cos(yaw) * sz * hw;
          legs.push({ p: [lx, (y0 + H) / 2, lz], ry: 0, s: [1.2, H - y0, 1.2] });
        }
        const seg = low ? 5 : 9;
        for (let k = 0; k < seg; k++) {
          const ya = y0 + ((H - y0) * k) / seg, yb = y0 + ((H - y0) * (k + 1)) / seg, sgn = k % 2 ? 1 : -1;
          for (const face of [0, 1]) {
            const nx = face ? Math.cos(yaw) : Math.sin(yaw), nz = face ? -Math.sin(yaw) : Math.cos(yaw);
            const px = face ? Math.sin(yaw) : Math.cos(yaw), pz = face ? Math.cos(yaw) : -Math.sin(yaw);
            braces.push(rodAt([x + nx * hw - px * hw * sgn, ya, z + nz * hw - pz * hw * sgn], [x + nx * hw + px * hw * sgn, yb, z + nz * hw + pz * hw * sgn], 0.6));
          }
        }
        banks.push({ p: [x, H + 5, z], ry: fy, s: [22, 12, 2.2] });
        if (!low) for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) dots.push({ p: [x + Math.cos(fy) * (c - 3) * 3.1 + Math.sin(fy) * 1.5, H + 1.2 + r * 3.9, z - Math.sin(fy) * (c - 3) * 3.1 + Math.cos(fy) * 1.5], ry: fy, s: [2.3, 2.3, 0.5] });
      };
      for (const [x, z, y0, H] of towerSpots) tower(x, z, y0, H);
      for (const sLF of [105, 200]) { const q = monsterPt(sLF, 40); tower(q[0], q[1], 0, 118, 8); }   // behind the Monster
      tower(26, -508, 0, 112, 8); tower(274, -474, 0, 108, 8);                                          // bleacher backs
      inst(box(), mat.lat, legs); inst(box(), mat.lat, braces); inst(box(), lamc('#2d3532'), banks);
      if (dots.length) inst(box(), new THREE.MeshBasicMaterial({ color: COL.lamp }), dots);
    }

    // =====================================================================================
    // OTHER FEATURES: bullpen tents, center-field flagpole, bleacher back truss, plaques
    // =====================================================================================
    {
      inst(box(), lamc('#e6e3d6'), BULLPEN_TENTS.map(([x, z]) => ({ p: [x, 4, z], ry: -0.4, s: [14, 8, 9] })));
      inst(box(), mat.cream, [{ p: [-42, 48, -383], ry: 0, s: [1.1, 96, 1.1] }, { p: [-36, 90, -383], ry: 0, s: [12, 7, 0.25] }]);   // flagpole and flag
      add(geoFrom(bandPos(FAC_BL, 46, 52, 0.5, 0.5)), mat.steel);
    }
    if (plaques.length) {    // all plaques (park name only) as one mesh
      const pos = [], uv = [];
      for (const g of plaques) { pos.push(...g.attributes.position.array); uv.push(...g.attributes.uv.array); }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); pg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      G.add(new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ map: plaqueTex, side: THREE.DoubleSide })));
    }
    // posted-distance signs move to where the real distances are (379 near the Monster end, 380 in right-center)
    {
      const moveSign = (sign, deg) => {
        if (!sign) return;
        const hw = tools.wallH(ctx.spec, deg), [ax, az] = tools.wallXZ(ctx.spec, deg - 0.6), [bx, bz] = tools.wallXZ(ctx.spec, deg + 0.6), [px, pz] = tools.wallXZ(ctx.spec, deg);
        let nx = bz - az, nz = -(bx - ax); const nl = Math.hypot(nx, nz); nx /= nl; nz /= nl; if (nx * px + nz * pz > 0) { nx = -nx; nz = -nz; }
        const sh = Math.min(6, Math.max(2.2, hw * 0.7)), old = sign.geometry.parameters.height, sy = Math.min(hw - sh / 2 - 0.2, Math.max(sh / 2 + 0.3, hw * 0.55));
        sign.scale.setScalar(sh / old); sign.position.set(px + nx * 0.45, sy, pz + nz * 0.45); sign.lookAt(px + nx * 10, sy, pz + nz * 10);
      };
      moveSign(parts.signs[1], -10.5); moveSign(parts.signs[3], 16.9);
    }
    flush();

    // =====================================================================================
    // VIEWS
    // =====================================================================================
    ctx.views.gate = { pos: [330, 30, 120], look: [200, 30, 20], label: 'Jersey St Gate' };
    ctx.views.monster = { pos: [70, 6.5, -40], look: [-130, 24, -250], walk: true, label: 'Green Monster' };
    ctx.views.roof = { pos: [-400, 150, 150], look: [-150, 40, -20], orbit: true, label: 'Grandstand Roof' };
    ctx.views.boards = { pos: [20, 30, 60], look: [120, 62, -500], label: 'Video Boards' };
    ctx.views.lansdowne = { pos: [-283, 11, -244], look: [-145, 40, -315], label: 'Lansdowne St' };
  },
};
