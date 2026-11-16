// Detail module: American Family Field (Miller Park), Milwaukee Brewers (opened 2001). Units: feet.
// Orientation (from the satellite mosaic): home plate faces the outfield arc at the north-west of the site; the fan roof pivots behind home.
// MEASURED FROM THE SHEET (survey.png, 1.1 px/ft, home plate = origin; home plate and second base picked from the infield grass square,
// mound check z = -60 and first base (64,-64) both pass):
//  - Roof pivot (centre of the "Christmas tree" frame) at (36, 200). The fan has two fixed trapezoid panels over the baselines and five
//    wedge panels that stack on the sides when open: left stack corners (38,204) (-54,266) (-467,-171) (-355,-271); right stack
//    corners (62,196) (131,242) (444,-250) (312,-337). Open stacks span -53.6..-39.6 deg (left) and +27.2..+42.2 deg (right) around the pivot,
//    so the closed fan spans -39.6..+27.2 deg (five panels of 13.4 deg each); the panels reach r = 610-625 ft from the pivot.
//  - Outfield facade arc: 11 stations (-362,-283) ... (-3,-432) ... (318,-346); it is a circle about the pivot (R about 632 ft; the
//    wall at centre field is at r = 603 from the pivot). Side facade lines run along the outer stack edges
//    (LF (-478,-178)->(-54,270); RF (455,-248)->(312,20)->(232,190)); back wall behind home (-54,270)->(22,288)->(232,190).
//  - Corner annexes: gray flat-roofed blocks at both stack ends (LF (-368,-300)..(-505,-205); RF (330,-392)..(488,-306)).
//  - Outfield wall: traced left-field track edge: r 342 at the pole, 358 at -38 deg, 366 at -30 deg, 371 at -22.5 deg. Rest follows posted values.
//  - Outfield seat depth (wall to facade): about 100 ft in both corners, about 30 ft at centre field.
// FROM TEXT SOURCES (Wikipedia, andrewclem.com, AISC Modern Steel 2004, Milwaukee Magazine): distances 342/371/400/374/337, wall 8 ft;
//  seven roof panels (2 fixed, 5 moving), panels about 600 ft long and 140 ft wide at the outfield end, 12 ft deep main trusses, a
//  box-chord arch rising up to 100 ft above the deck, four outfield support columns, a circular track beam along the outfield, a
//  pivot frame behind home, brick exterior with a clock tower, deck about 200 ft above second base, LED boards in centre and right field.
// LEVEL 4 (photographs 1-8 in /home/claude/refs/MIL, wall = 8 ft as the scale in the interior photos):
//  A FACADE (photos 1, 2, 3): outfield arc = dark storefront glass 4-30 ft, light precast band 30-58 ft with steel brackets and a cornice,
//    green glass above up to the track fascia; baseline stacks and home side = brick base with tall windows to a 50 ft cornice (photo 2: cars
//    give about 0.6 ft/px; photo 3: end deck about 143 ft gives about 1.25 ft/px, both put the first cornice at 50-52 ft). Stacks: gray metal
//    band 50-62 ft, then glass. Home side: leaning glass curtain wall 54-126 ft with mullions and transoms (photo 2). Gates have flat canopies,
//    no pyramid roofs. Clock tower moved to the square seen on the sheet at (-139, 228) (60 ft square roof), brick shaft with a cream clock stage
//    and four plain dark clock faces, top 90 ft (photo 2: tower top about 25 ft over the 50 ft cornice). Corner annexes: brick base 24 ft under
//    light precast to 46 ft (photos 1, 3); plain name text on the left annex face (photo 3).
//  B HEIGHTS: foul poles 98 ft (photo 5: pole 285 px = 98 ft against the 8 ft wall 23 px at the same plane). Photo 7 (wall plane 3.1 px/ft):
//    batter's eye top 38 ft and about 100 ft wide; scoreboard towers 126 ft tall and 144-152 ft apart; fascia band 125-147 ft with lamp
//    banks above to about 157 ft (this sets the outfield track beam: 124-146 ft); side canopies 100-120 ft; glass behind the towers 35-98 ft.
//    Photo 5 (LF corner, 2.9 px/ft): loge seats top about 55 ft, suite glass band 56-72 ft, terrace lip 82 ft, terrace top about 125 ft,
//    fascia top about 155 ft. Board face sizes from press figures: main 12,077 sq ft (140 x 86 ft here, y 38-124), right field 2,840 sq ft (92 x 31).
//    No satellite shadow ratio was usable: the only objects of known height (poles, boards) stand in the roof shadow.
//  C SEATING: depth = distance from the seat front to the facade line on the sheet (right 188-230 ft, behind home 224, left 167-218 ft) minus about
//    54 ft of concourse. Lower deck 70-98 ft (deepest behind home), upper overhang 20-30 ft, upper depth 60-111 ft (narrow on the third-base
//    side where the left stack facade runs close to the seats), upper extent t 0.08-0.98. Outfield: lower sections 100 ft at the left corner,
//    108 ft at the right corner, 34-38 ft beside the eye. Terrace tiers (custom decks with rails and aisles) over both outfield corners,
//    left -45..-26 deg, right 24..45 deg, back at 62-112 ft behind the wall. Ribbon boards (blank) along the lower outfield seat fronts.
//  D BOARDS: main board between two lattice towers (CF, x -20) with housing, back truss, X brace, catwalks, fascia lintel and side canopies;
//    right-field board on two columns hung inside the arc facade with a back box, catwalk and struts to the track beam. Faces are blank.
// STILL ESTIMATED: roof deck heights (190 ft at the hub, about 143 ft at the track; fixed panels 14 ft lower; stack lifts 14 ft), arch rise and
//  hangers, column positions and angles, gate positions and bay rhythm, terrace tier depth curves and the exact upper deck height behind home
//  (about 109 ft), upper-deck rim along the foul lines, right-field board position along the arc and its height (104 ft), clock tower height,
//  facade colors, exact tower spacing (photo 7 gives 144-152 ft), the home-side glass lean.
const D2R = Math.PI / 180;
const PV = [36, 200];                         // roof pivot (plan)
const R0 = 26, R1 = 616;                      // panel hub and far-end radius from the pivot
const RING_TOP = 146;                         // top of the outfield track fascia (photo 7: fascia top 147 ft above the field)
const HM = (r) => { const s = r / 300; return 190 + 25 * s * (2 - s) - 45 * Math.pow(r / 620, 3); };   // moving deck height at radius r
const HF = (r) => HM(r) - 14;                 // fixed deck height
const rOf = (x, z) => Math.hypot(x - PV[0], z - PV[1]);
const FOUL_L = [[-478, -178], [-54, 270]], FOUL_R = [[455, -248], [312, 20], [232, 190]];
const HULL = [[-54, 270], [-47, 279], [22, 288], [84, 281], [140, 266], [178, 248], [214, 222], [232, 190]];
const ARC = [[-362, -283], [-300, -333], [-251, -367], [-178, -403], [-88, -424], [-3, -432], [94, -433], [191, -412], [270, -382], [312, -352], [318, -346]];
const END_L = [[-478, -178], [-362, -283]], END_R = [[318, -346], [455, -250]];
const L4 = { hubIn: [38, 204], hubOut: [-54, 266], farOut: [-467, -171], farIn: [-355, -271] };
const R4 = { hubIn: [62, 196], hubOut: [131, 242], farOut: [444, -250], farIn: [312, -337] };
const ANNEX_L = [[-368, -300], [-398, -312], [-505, -205], [-470, -168]], ANNEX_R = [[330, -392], [488, -306], [444, -262], [312, -340]];
// Moving panels, left to right when closed: 3L 2L 1L 2R 3R (13.4 deg each). Open stack angle centres and stack lifts.
const TH_L = -39.6, TH_W = 13.36;
const PANELS = [
  { name: '3L', open: -46.3, lift: 0, arches: [-1] }, { name: '2L', open: -46.3, lift: 14, arches: [-1] },
  { name: '1L', open: -46.3, lift: 28, arches: [-1, 1] }, { name: '2R', open: 33.9, lift: 14, arches: [1] },
  { name: '3R', open: 33.9, lift: 0, arches: [1] },
];

// Small triangle collector: one material index per bucket, built into one BufferGeometry with groups.
class GB {
  constructor() { this.b = new Map(); }
  _a(m) { if (!this.b.has(m)) this.b.set(m, []); return this.b.get(m); }
  tri(m, a, b, c) { this._a(m).push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); }
  quad(m, a, b, c, d) { this.tri(m, a, b, c); this.tri(m, a, c, d); }
  // box with its own yaw (local +z faces (sin yaw, cos yaw))
  box(m, cx, cy, cz, sx, sy, sz, yaw = 0) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const P = (x, y, z) => [cx + x * c + z * s, cy + y, cz - x * s + z * c];
    const h = [sx / 2, sy / 2, sz / 2];
    const v = []; for (const a of [-1, 1]) for (const b of [-1, 1]) for (const d of [-1, 1]) v.push(P(a * h[0], b * h[1], d * h[2]));
    // index = a*4 + b*2 + d
    const f = (i, j, k, l) => this.quad(m, v[i], v[j], v[k], v[l]);
    f(0, 1, 3, 2); f(4, 6, 7, 5); f(0, 4, 5, 1); f(2, 3, 7, 6); f(0, 2, 6, 4); f(1, 5, 7, 3);
  }
  // disc (triangle fan) in a vertical plane facing (sin yaw, cos yaw)
  disc(m, cx, cy, cz, r, yaw, n = 12) {
    const c = Math.cos(yaw), s = Math.sin(yaw), P = (a) => [cx + Math.cos(a) * r * c + s * 0.5, cy + Math.sin(a) * r, cz - Math.cos(a) * r * s + c * 0.5];
    for (let i = 0; i < n; i++) this.tri(m, [cx + s * 0.5, cy, cz + c * 0.5], P(i / n * 2 * Math.PI), P((i + 1) / n * 2 * Math.PI));
  }
  // beam between two points with a w x h section
  beam(m, p0, p1, w, h) {
    const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], L = Math.hypot(...d) || 1;
    let up = Math.abs(d[1]) / L > 0.95 ? [1, 0, 0] : [0, 1, 0];
    const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const nz = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const rt = nz(cr(d, up)), uv = nz(cr(rt, d));
    const C = (p, a, b) => [p[0] + rt[0] * a * w / 2 + uv[0] * b * h / 2, p[1] + rt[1] * a * w / 2 + uv[1] * b * h / 2, p[2] + rt[2] * a * w / 2 + uv[2] * b * h / 2];
    const A = [C(p0, -1, -1), C(p0, 1, -1), C(p0, 1, 1), C(p0, -1, 1)], B = [C(p1, -1, -1), C(p1, 1, -1), C(p1, 1, 1), C(p1, -1, 1)];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; this.quad(m, A[i], A[j], B[j], B[i]); }
    this.quad(m, A[0], A[1], A[2], A[3]); this.quad(m, B[0], B[1], B[2], B[3]);
  }
  geo(THREE, nMats) {
    const pos = [], g = new THREE.BufferGeometry(); let start = 0;
    for (let m = 0; m < nMats; m++) {
      const a = this.b.get(m); if (!a || !a.length) continue;
      for (let i = 0; i < a.length; i++) pos.push(a[i]);
      g.addGroup(start, a.length / 3, m); start += a.length / 3;
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
  }
}

// point on a polyline at arc fraction, plus the unit tangent
const polyLen = (p) => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
const resample = (pts, step, THREE, smooth) => {
  if (smooth) { const c = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal'); return c.getSpacedPoints(Math.max(2, Math.round(polyLen(pts) / step))).map((v) => [v.x, v.z]); }
  const out = [], n = Math.max(1, Math.round(polyLen(pts) / step)); const L = polyLen(pts);
  for (let k = 0; k <= n; k++) {
    let t = (k / n) * L, i = 1; while (i < pts.length - 1 && t > Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])) { t -= Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); i++; }
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = Math.min(1, t / l); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
};

export default {
  config(rec) {
    const bw = (deg, r) => ({ deg, r, h: 8 });
    return {
      wall: [bw(-45, 342), bw(-38, 358), bw(-30, 366), bw(-22.5, 371), bw(-11, 391), bw(0, 400), bw(11, 392), bw(22.5, 374), bw(30, 366), bw(38, 354), bw(45, 337)],
      foulScale: 1, backstop: 60,
      // t: 0 = right-field pole, 0.5 = behind home, 1 = left-field pole. Total depth = distance from the seat front to the facade line on the
      // sheet minus about 55 ft of concourse (right 188-230 ft, behind home 224, left 167-218 ft).
      lower: { depth: [[0, 70], [0.1, 76], [0.2, 82], [0.3, 86], [0.4, 92], [0.5, 98], [0.6, 80], [0.7, 82], [0.8, 80], [0.9, 76], [1, 72]], slope: 0.3, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: [[0, 20], [0.2, 22], [0.5, 30], [0.6, 24], [1, 20]],
        rise: [[0, 22], [0.5, 28], [1, 22]],
        depth: [[0, 83], [0.1, 88], [0.2, 90], [0.3, 99], [0.4, 110], [0.5, 102], [0.6, 60], [0.7, 66], [0.8, 83], [0.9, 95], [1, 111]],
        slope: 0.56, extent: [0.08, 0.98],
      },
      outfield: {
        depth: 70, slope: 0.5,
        spans: [[-45, -36, 100, 0.5], [-36, -28, 68, 0.5], [-28, -17, 52, 0.45], [-17, -8, 34, 0.45], [8, 17, 38, 0.45], [17, 26, 58, 0.5], [26, 36, 84, 0.5], [36, 45, 108, 0.5]],
        eye: [-7.2, 7.2], eyeHeight: 38, eyeDepth: 28,
      },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#3a4f70', facade: '#9c5c44', wall: '#26384f', cream: '#e0d6b8' },
    };
  },

  build(ctx) {
    const { THREE, G, dims, tools, parts, views, rec } = ctx;
    const low = ctx.lod === 'low';
    const clamp = tools.clamp;
    const lam = ctx.lam;
    const bx = () => { const g = new THREE.BoxGeometry(1, 1, 1); g.clearGroups(); return g; };
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });

    // ---- palette
    const BRICK = '#9c5c44', BRICK2 = '#8a4f3b', CREAM = '#e0d6b8', STEEL = '#59635f', STEEL2 = '#7b8580', DARK = '#2d3b42', COPPER = '#7f9c8c';
    const ROOF = '#c3ccc0', ROOF_EDGE = '#8d9992', GLASS = '#6f8f94';
    const mBrick = lam(BRICK), mCream = lam(CREAM), mStone = lam('#a69a82'), mSteel = lam(STEEL), mGlass = lam(GLASS, { transparent: true, opacity: 0.55, depthWrite: false });
    const mDark = basic(DARK), mCopper = lam(COPPER), mBrick2 = lam(BRICK2);

    // ---- remove generic parts that are replaced
    ctx.remove(parts.lights); ctx.remove(parts.scoreboard);

    // =============================================================================================
    // 1. ROOF. Fixed trapezoid panels + five wedge panels about the pivot; hooks into the generic roof toggle.
    // =============================================================================================
    const roofMats = [lam(ROOF), lam(ROOF_EDGE)];
    const movMats = [lam(ROOF, { transparent: true, opacity: 0.72, depthWrite: false }), lam(ROOF_EDGE)];
    const NR = low ? 8 : 14;
    // arch on one edge of a moving panel (local coordinates around the pivot)
    const panelGeo = (thLo, thHi, archSides) => {
      const gb = new GB();
      const pt = (th, r, y) => [r * Math.sin(th * D2R), y, -r * Math.cos(th * D2R)];
      const rs = []; for (let i = 0; i <= NR; i++) rs.push(R0 + (R1 - R0) * i / NR);
      const ths = [thLo, (thLo + thHi) / 2, thHi];
      for (let i = 0; i < NR; i++) for (let j = 0; j < 2; j++) {
        gb.quad(0, pt(ths[j], rs[i], HM(rs[i])), pt(ths[j + 1], rs[i], HM(rs[i])), pt(ths[j + 1], rs[i + 1], HM(rs[i + 1])), pt(ths[j], rs[i + 1], HM(rs[i + 1])));
      }
      const T = 12;                                                   // edge truss depth
      for (const th of [thLo, thHi]) for (let i = 0; i < NR; i++) gb.quad(1, pt(th, rs[i], HM(rs[i])), pt(th, rs[i + 1], HM(rs[i + 1])), pt(th, rs[i + 1], HM(rs[i + 1]) - T), pt(th, rs[i], HM(rs[i]) - T));
      gb.quad(1, pt(thLo, R1, HM(R1)), pt(thHi, R1, HM(R1)), pt(thHi, R1, HM(R1) - T), pt(thLo, R1, HM(R1) - T));
      // underside ribs and a centre truss
      const mid = (thLo + thHi) / 2;
      for (const r of [R0 + 80, 160, 260, 360, 460, 560]) {
        gb.beam(1, pt(thLo, r, HM(r) - 9), pt(thHi, r, HM(r) - 9), 3, 4);
      }
      gb.beam(1, pt(mid, R0, HM(R0) - 8), pt(mid, R1, HM(R1) - 8), 3, 6);
      // hub "tub" and the two bogies at the far end
      gb.box(1, ...pt(mid, R0 + 6, HM(R0) - 4), 14, 16, 14, 0);
      for (const th of [thLo, thHi]) gb.box(1, ...pt(th, R1 - 8, HM(R1) - 16), 6, 12, 22, -th * D2R);
      // box-chord arches on the chosen edges, rising to 100 ft at mid span, with hangers
      const NA = low ? 10 : 18;
      for (const side of archSides) {
        const th = side < 0 ? thLo + 0.5 : thHi - 0.5, ap = [];
        for (let k = 0; k <= NA; k++) { const r = R0 + 20 + (R1 - R0 - 40) * k / NA, a = 100 * Math.sin(Math.PI * k / NA); ap.push(pt(th, r, HM(r) + a)); }
        for (let k = 0; k < NA; k++) gb.beam(1, ap[k], ap[k + 1], 5, 5);
        for (let k = 1; k < NA; k += low ? 3 : 2) { const q = ap[k]; gb.beam(1, [q[0], q[1], q[2]], [q[0], HM(Math.hypot(q[0], q[2])), q[2]], 1.2, 1.2); }
      }
      return gb.geo(THREE, 2);
    };
    const movers = PANELS.map((p, i) => {
      const lo = TH_L + TH_W * i, hi = lo + TH_W, closedC = lo + TH_W / 2;
      const grp = new THREE.Group(); grp.position.set(PV[0], 0, PV[1]); G.add(grp);
      grp.add(new THREE.Mesh(panelGeo(lo, hi, p.arches), movMats));
      return { grp, phiOpen: closedC - p.open, lift: p.lift };
    });
    const setRoof = (i, s) => { const m = movers[i]; m.grp.rotation.y = m.phiOpen * D2R * (1 - s); m.grp.position.y = m.lift * (1 - s); };
    movers.forEach((_, i) => setRoof(i, 0));

    // fixed trapezoid panels over the baseline stands
    const fixedGeo = (Q) => {
      const gb = new GB(), NL = low ? 9 : 16, NW = 3;
      const e = (t) => [Q.hubIn[0] + (Q.farIn[0] - Q.hubIn[0]) * t, Q.hubIn[1] + (Q.farIn[1] - Q.hubIn[1]) * t];
      const o = (t) => [Q.hubOut[0] + (Q.farOut[0] - Q.hubOut[0]) * t, Q.hubOut[1] + (Q.farOut[1] - Q.hubOut[1]) * t];
      const P = (t, s) => { const a = e(t), b = o(t); const x = a[0] + (b[0] - a[0]) * s, z = a[1] + (b[1] - a[1]) * s; return [x, HF(rOf(x, z)), z]; };
      for (let i = 0; i < NL; i++) for (let j = 0; j < NW; j++) gb.quad(0, P(i / NL, j / NW), P(i / NL, (j + 1) / NW), P((i + 1) / NL, (j + 1) / NW), P((i + 1) / NL, j / NW));
      const T = 12, dn = (p) => [p[0], p[1] - T, p[2]];
      for (const s of [0, 1]) for (let i = 0; i < NL; i++) { const a = P(i / NL, s), b = P((i + 1) / NL, s); gb.quad(1, a, b, dn(b), dn(a)); }
      for (const t of [0, 1]) { const a = P(t, 0), b = P(t, 1); gb.quad(1, a, b, dn(b), dn(a)); }
      for (const t of [0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.95]) { const a = P(t, 0), b = P(t, 1); gb.beam(1, [a[0], a[1] - 9, a[2]], [b[0], b[1] - 9, b[2]], 3, 4); }
      const a = P(0, 0.5), b = P(1, 0.5); gb.beam(1, [a[0], a[1] - 8, a[2]], [b[0], b[1] - 8, b[2]], 3, 6);
      return gb.geo(THREE, 2);
    };
    ctx.add(fixedGeo(L4), roofMats); ctx.add(fixedGeo(R4), roofMats);

    // hook the five generic roof panels so toggleRoof() drives the fan
    {
      const n = 5, depth = (dims.zBack - dims.zFront) / n;
      const gp = G.children.filter((o) => o.isMesh && o.geometry && o.geometry.type === 'BoxGeometry' && o.geometry.parameters.height === 5 && Math.abs(o.geometry.parameters.width - dims.halfW * 2) < 1e-3);
      gp.forEach((pan, i) => {
        pan.visible = false;
        const oZ = dims.zBack + depth * 0.1 - i * 14, cZ = dims.zBack - depth * (i + 0.5);
        pan.position.set = function (x, y, z) { setRoof(i, clamp((z - oZ) / (cZ - oZ), 0, 1)); return this; };
      });
    }

    // =============================================================================================
    // 2. ROOF SUPPORT: track beam on the outfield, four columns, pivot frame behind home
    // =============================================================================================
    const sg = new GB();
    const arcS = resample(ARC, 20, THREE, true);
    const arcN = tools.normalsFor(arcS, [30, -100]);
    const ringTop = RING_TOP;
    for (let i = 0; i < arcS.length - 1; i++) {               // track beam: box ring just inside the facade
      const a = arcS[i], b = arcS[i + 1], na = arcN[i], nb = arcN[i + 1];
      const A = (d, y) => [a[0] + na[0] * d, y, a[1] + na[1] * d], B = (d, y) => [b[0] + nb[0] * d, y, b[1] + nb[1] * d];
      sg.quad(1, A(-14, ringTop - 22), B(-14, ringTop - 22), B(-14, ringTop), A(-14, ringTop));
      sg.quad(1, A(2, ringTop - 22), B(2, ringTop - 22), B(2, ringTop), A(2, ringTop));
      sg.quad(1, A(-14, ringTop), B(-14, ringTop), B(2, ringTop), A(2, ringTop));
      sg.quad(1, A(-14, ringTop - 22), B(-14, ringTop - 22), B(2, ringTop - 22), A(2, ringTop - 22));
    }
    const rayHit = (poly, th) => {                              // outfield arc point at pivot angle th
      const dx = Math.sin(th * D2R), dz = -Math.cos(th * D2R);
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], ex = b[0] - a[0], ez = b[1] - a[1], den = dx * ez - dz * ex;
        if (Math.abs(den) < 1e-9) continue;
        const wx = a[0] - PV[0], wz = a[1] - PV[1], t = (wx * ez - wz * ex) / den, u = (wx * dz - wz * dx) / den;
        if (t > 0 && u >= 0 && u <= 1) return [PV[0] + dx * t, PV[1] + dz * t, t];
      }
      return null;
    };
    const colAngles = [-34, -19, 19, 32];
    const colBase = [];
    for (const th of colAngles) {                                // four big columns just inside the arc facade
      const h = rayHit(arcS, th); if (!h) continue;
      const dx = Math.sin(th * D2R), dz = -Math.cos(th * D2R), r = h[2] - 16;
      const bx = PV[0] + dx * r, bz = PV[1] + dz * r; colBase.push([bx, bz, dx, dz]);
      sg.beam(0, [bx, 30, bz], [bx, ringTop - 8, bz], 10, 10);
      sg.beam(0, [bx - dz * 7, 30, bz + dx * 7], [bx, ringTop - 22, bz], 2.4, 2.4); sg.beam(0, [bx + dz * 7, 30, bz - dx * 7], [bx, ringTop - 22, bz], 2.4, 2.4);
    }
    // pivot "Christmas tree" frame behind home
    {
      const topY = HM(R0) + 4, base = [PV[0], 262], tp = [PV[0], PV[1] + 2];
      const legs = [[-22, 0], [22, 0]];
      for (const [ox] of legs) { sg.beam(0, [base[0] + ox, 50, base[1] + 6], [tp[0] + ox * 0.22, topY - 6, tp[1]], 4, 4); }
      sg.beam(0, [base[0], 50, base[1] + 24], [tp[0], topY - 6, tp[1] + 4], 4, 4);
      const lv = low ? 4 : 7;
      for (let k = 0; k < lv; k++) {
        const t0 = k / lv, t1 = (k + 1) / lv, y0 = 50 + (topY - 56) * t0, y1 = 50 + (topY - 56) * t1, w0 = 22 * (1 - t0 * 0.78), w1 = 22 * (1 - t1 * 0.78);
        const z0 = base[1] + 6 - (base[1] - tp[1]) * t0, z1 = base[1] + 6 - (base[1] - tp[1]) * t1;
        sg.beam(0, [base[0] - w0, y0, z0], [base[0] + w1, y1, z1], 1.6, 1.6); sg.beam(0, [base[0] + w0, y0, z0], [base[0] - w1, y1, z1], 1.6, 1.6);
        sg.beam(0, [base[0] - w1, y1, z1], [base[0] + w1, y1, z1], 2, 2);
      }
      sg.box(0, tp[0], topY - 2, tp[1], 18, 8, 14, 0);
    }
    ctx.add(sg.geo(THREE, 2), [mSteel, lam('#a3a396')]);

    // lamp banks: on the inner edge skirts of the fixed panels and on the outfield track beam (instanced)
    {
      const tmp = new THREE.Object3D(), frames = [], lamps = [];
      const bank = (x, y, z, nx, nz, w = 22, h = 9) => {
        const yaw = Math.atan2(nx, nz);
        tmp.position.set(x, y, z); tmp.rotation.set(0, yaw, 0); tmp.scale.set(w, h, 3); tmp.updateMatrix(); frames.push(tmp.matrix.clone());
        tmp.position.set(x + nx * 1.7, y, z + nz * 1.7); tmp.scale.set(w - 3, h - 3, 0.4); tmp.updateMatrix(); lamps.push(tmp.matrix.clone());
      };
      for (const Q of [L4, R4]) {
        const ex = Q.farIn[0] - Q.hubIn[0], ez = Q.farIn[1] - Q.hubIn[1], L = Math.hypot(ex, ez);
        const dirx = Q === L4 ? ez / L : -ez / L, dirz = Q === L4 ? -ex / L : ex / L;
        for (const t of low ? [0.3, 0.6, 0.9] : [0.2, 0.34, 0.48, 0.62, 0.76, 0.9]) {
          const x = Q.hubIn[0] + ex * t, z = Q.hubIn[1] + ez * t, r = rOf(x, z);
          // choose the normal that points toward the infield (smaller distance to (30,-120))
          const c1 = Math.hypot(x + dirx * 4 - 30, z + dirz * 4 + 120), c2 = Math.hypot(x - dirx * 4 - 30, z - dirz * 4 + 120);
          const sn = c1 < c2 ? 1 : -1;
          bank(x + dirx * sn * 2, HF(r) - 12, z + dirz * sn * 2, dirx * sn, dirz * sn, 24, 10);
        }
      }
      for (const th of low ? [-30, -10, 10, 28] : [-34, -24, -14, -4, 6, 16, 26, 34]) {
        const h = rayHit(arcS, th); if (!h) continue;
        const dx = Math.sin(th * D2R), dz = -Math.cos(th * D2R);
        bank(PV[0] + dx * (h[2] - 18), ringTop + 5, PV[1] + dz * (h[2] - 18), -dx, -dz, 24, 11);
      }
      const mk = (geo, mat, list) => { const m = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m; };
      mk(bx(), lam('#404946'), frames);
      mk(new THREE.PlaneGeometry(1, 1), basic('#f4ecc8'), lamps.map((mx) => mx));
    }

    // =============================================================================================
    // 3. EXTERIOR FACADE (rebuilt from photographs 1-3): outfield arc = dark storefront glass + light precast band + green glass up to the
    //    track fascia; baseline stacks and home side = brick base to a 50 ft cornice; home side = leaning glass curtain wall above it.
    // =============================================================================================
    const CENTER = [30, -110];
    const mkRun = (pts, smooth, step = 24) => { const p = resample(pts, step, THREE, smooth); return { p, n: tools.normalsFor(p, CENTER) }; };
    const runs = [
      { ...mkRun(ARC, true, 22), kind: 'arc' },
      { ...mkRun(END_R, false, 30), kind: 'end' },
      { ...mkRun(FOUL_R, false, 30), kind: 'side' },
      { ...mkRun(HULL, true, 22), kind: 'hull' },
      { ...mkRun(FOUL_L, false, 30), kind: 'side' },
      { ...mkRun(END_L, false, 30), kind: 'end' },
    ];
    const CORN = 50;                                       // brick cornice height (photo 2: first cornice, car-height scale; photo 3: band top)
    const sideTop = (p) => Math.max(100, HF(rOf(p[0], p[1])) - 12);
    const mPre = lam('#b4b2a5'), mPreD = lam('#9a988c'), mDarkG = lam('#34484e'), mPanel = lam('#7f8b86'), mMull = lam('#97a19b');
    const fb = new GB();                                   // 0 brick 1 cream 2 stone 3 glass 4 dark glass 5 precast 6 gray panel 7 precast dark 8 mullion
    const nstrip = (run, m, y0, y1, d) => {
      for (let i = 0; i < run.p.length - 1; i++) {
        const a = run.p[i], b = run.p[i + 1], na = run.n[i], nb = run.n[i + 1];
        const Y = (k, y) => (typeof y === 'function' ? y(run.p[k]) : y);
        fb.quad(m, [a[0] + na[0] * d, Y(i, y0), a[1] + na[1] * d], [b[0] + nb[0] * d, Y(i + 1, y0), b[1] + nb[1] * d], [b[0] + nb[0] * d, Y(i + 1, y1), b[1] + nb[1] * d], [a[0] + na[0] * d, Y(i, y1), a[1] + na[1] * d]);
      }
    };
    const nslope = (run, m, ya, da, yb, db) => {            // strip that leans: offset da at height ya to db at yb
      for (let i = 0; i < run.p.length - 1; i++) {
        const a = run.p[i], b = run.p[i + 1], na = run.n[i], nb = run.n[i + 1];
        fb.quad(m, [a[0] + na[0] * da, ya, a[1] + na[1] * da], [b[0] + nb[0] * da, ya, b[1] + nb[1] * da], [b[0] + nb[0] * db, yb, b[1] + nb[1] * db], [a[0] + na[0] * db, yb, a[1] + na[1] * db]);
      }
    };
    const nledge = (run, m, y, d0, d1) => {
      for (let i = 0; i < run.p.length - 1; i++) {
        const a = run.p[i], b = run.p[i + 1], na = run.n[i], nb = run.n[i + 1];
        fb.quad(m, [a[0] + na[0] * d0, y, a[1] + na[1] * d0], [b[0] + nb[0] * d0, y, b[1] + nb[1] * d0], [b[0] + nb[0] * d1, y, b[1] + nb[1] * d1], [a[0] + na[0] * d1, y, a[1] + na[1] * d1]);
      }
    };
    const LEAN = [[CORN + 4, -2], [72, -5], [90, -10], [108, -17], [126, -26]];       // home-side curtain wall: height, inward offset
    const GLASS_TOP = ringTop - 22;
    for (const run of runs) {
      const k = run.kind;
      nstrip(run, 2, 0, 4, 1.4); nledge(run, 2, 4, 0, 1.4);                              // stone base
      if (k === 'arc') {
        nstrip(run, 4, 4, 30, 0.6);                                                      // dark storefront glass
        nstrip(run, 5, 30, 58, 1.8); nledge(run, 5, 30, 0, 1.8);                           // light precast band
        nstrip(run, 7, 43, 45, 2.0);                                                     // joint line
        nstrip(run, 1, 58, 62, 3.2); nledge(run, 1, 62, 0, 3.2); nledge(run, 1, 58, 0, 3.2);   // cornice
        nstrip(run, 3, 62, GLASS_TOP, -3.2);                                             // green glass up to the fascia
      } else {
        nstrip(run, 0, 4, CORN, 0);                                                      // brick
        nstrip(run, 1, 24, 27, 0.9); nledge(run, 1, 27, 0, 0.9);                           // string course
        nstrip(run, 1, CORN - 4, CORN, 3.2); nledge(run, 1, CORN, 0, 3.2); nledge(run, 1, CORN - 4, 0, 3.2);   // cornice
        if (k === 'hull') {
          for (let j = 0; j < LEAN.length - 1; j++) nslope(run, 3, LEAN[j][0], LEAN[j][1], LEAN[j + 1][0], LEAN[j + 1][1]);
          nslope(run, 1, 126, -26, 130, -26); nledge(run, 1, 130, -26, -22);
        } else { nstrip(run, 6, CORN, 62, 0.5); nstrip(run, 3, 62, sideTop, 0.5); }       // gray metal band, then glass up to the stack deck
      }
    }
    // hull curtain wall: mullions along the lean, and transoms
    {
      const hull = runs[3], stepM = low ? 28 : 14;
      for (let i = 0, acc = 1e9; i < hull.p.length - 1; i++) {
        const a = hull.p[i], b = hull.p[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        for (let u = 0; u < L; u += stepM) {
          const f = u / L, x = a[0] + (b[0] - a[0]) * f, z = a[1] + (b[1] - a[1]) * f, n = hull.n[i];
          for (let j = 0; j < LEAN.length - 1; j++) {
            const P = (q) => [x + n[0] * (LEAN[q][1] - 0.4), LEAN[q][0], z + n[1] * (LEAN[q][1] - 0.4)];
            fb.beam(8, P(j), P(j + 1), 1.0, 1.0);
          }
        }
      }
      if (!low) for (let j = 1; j < LEAN.length; j++) for (let i = 0; i < hull.p.length - 1; i++) {
        const a = hull.p[i], b = hull.p[i + 1], na = hull.n[i], nb = hull.n[i + 1], d = LEAN[j][1] - 0.4;
        fb.beam(8, [a[0] + na[0] * d, LEAN[j][0], a[1] + na[1] * d], [b[0] + nb[0] * d, LEAN[j][0], b[1] + nb[1] * d], 0.9, 1.4);
      }
    }
    const facadeMats = [mBrick, mCream, mStone, mGlass, mDarkG, mPre, mPanel, mPreD, mMull];
    ctx.add(fb.geo(THREE, 9), facadeMats);

    // piers, windows, brackets, glass posts (instanced)
    const mkInst = (geo, mat, list) => { if (!list.length) return null; const m = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m; };
    {
      const tmp = new THREE.Object3D(), pierB = [], pierP = [], wins = [], posts = [], brk = [];
      const put = (list, x, y, z, yaw, sx, sy, sz) => { tmp.position.set(x, y, z); tmp.rotation.set(0, yaw, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); list.push(tmp.matrix.clone()); };
      for (const run of runs) {
        const stepP = low ? 36 : 24; let acc = 0;
        for (let i = 0; i < run.p.length - 1; i++) {
          const a = run.p[i], b = run.p[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]); acc += L;
          if (acc < stepP * 0.9) continue; acc = 0;
          const n = run.n[i], yaw = Math.atan2(n[0], n[1]), x = (a[0] + b[0]) / 2, z = (a[1] + b[1]) / 2;
          const ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L, cx = x + ux * stepP * 0.5, cz = z + uz * stepP * 0.5;
          if (run.kind === 'arc') {
            put(pierP, x + n[0] * 1.2, 15, z + n[1] * 1.2, yaw, 4.2, 30, 2.6);                       // precast pier over the storefront
            if (!low) put(brk, x + n[0] * 2.2, 55.5, z + n[1] * 2.2, yaw, 2.6, 6, 4.4);                // steel bracket under the cornice
            put(posts, x - n[0] * 3.2, (62 + GLASS_TOP) / 2, z - n[1] * 3.2, yaw, 2.2, GLASS_TOP - 62, 2.2);
          } else {
            put(pierB, x + n[0] * 1.3, 4 + (CORN - 8) / 2, z + n[1] * 1.3, yaw, 4.4, CORN - 8, 2.8);  // brick pier
            const lv = low ? [[16, 20]] : [[16, 20], [38, 13]];                                     // [centre height, window height]
            for (const [y, h] of lv) put(wins, cx + n[0] * 0.3, y, cz + n[1] * 0.3, yaw, stepP * 0.4, h, 1);
          }
        }
      }
      mkInst(bx(), mBrick2, pierB); mkInst(bx(), mPre, pierP); mkInst(new THREE.PlaneGeometry(1, 1), basic('#33444b'), wins);
      mkInst(bx(), mSteel, posts); mkInst(bx(), mPreD, brk);
    }

    // gate pavilions (flat canopy, glazed opening; photo 2: no pyramid roofs)
    {
      const gb = new GB();                     // 0 brick, 1 cream, 2 dark glass, 3 precast
      const gate = (x, z, nx, nz, w = 48) => {
        const yaw = Math.atan2(nx, nz), c = Math.cos(yaw), s = Math.sin(yaw);
        const W = (lx, lz) => [x + lx * c + lz * s, z - lx * s + lz * c];
        const at = (lx, ly, lz, sx, sy, sz, m) => { const p = W(lx, lz); gb.box(m, p[0], ly, p[1], sx, sy, sz, yaw); };
        at(0, 25, 7, w, 50, 20, 0);                         // brick body to the 50 ft cornice
        at(0, 51, 7.5, w + 5, 4, 24, 1);                    // cornice
        at(0, 15, 17.3, w * 0.6, 30, 0.8, 2);               // glazed opening
        at(0, 31.5, 17.6, w * 0.66, 3, 1.4, 1);             // lintel
        for (const sx of [-0.4, 0.4]) at(w * sx, 25, 17.5, 4, 46, 1.2, 1);   // pilasters
        at(0, 36, 22, w * 0.72, 1.4, 11, 3);                // projecting canopy
      };
      const at2 = (run, t) => { const i = Math.min(run.p.length - 2, Math.round(t * (run.p.length - 1))); const p = run.p[i], n = run.n[i]; return [p[0] + n[0] * 3, p[1] + n[1] * 3, n[0], n[1]]; };
      gate(...at2(runs[3], 0.78), 56);                     // home plate gate
      gate(...at2(runs[0], 0.2), 48); gate(...at2(runs[0], 0.78), 48);
      gate(...at2(runs[2], 0.55), 48); gate(...at2(runs[4], 0.5), 48);
      if (!low) { gate(...at2(runs[0], 0.5), 40); }
      ctx.add(gb.geo(THREE, 4), [mBrick, mCream, mDarkG, mPre]);
    }

    // clock tower at the left end of the home side (sheet: stepped square roof, about 60 ft over the cornice, centre (-139, 228))
    {
      const gb = new GB();                     // 0 brick, 1 cream, 2 dark, 3 copper roof
      const TX = -139, TZ = 228, yaw = 0.7, c = Math.cos(yaw), s = Math.sin(yaw);
      const W = (lx, lz) => [TX + lx * c + lz * s, TZ - lx * s + lz * c];
      const at = (lx, ly, lz, sx, sy, sz, m) => { const p = W(lx, lz); gb.box(m, p[0], ly, p[1], sx, sy, sz, yaw); };
      at(0, 3, 0, 40, 6, 40, 1);                                                    // plinth
      at(0, 41, 0, 34, 70, 34, 0);                                                  // brick shaft
      at(0, 24, 0, 37, 2.5, 37, 1); at(0, 52, 0, 37, 2.5, 37, 1);                    // string courses
      for (const sx of [-7, 7]) { at(sx, 36, 17.2, 5, 24, 0.8, 2); at(sx, 36, -17.2, 5, 24, 0.8, 2); at(17.2, 36, sx, 0.8, 24, 5, 2); at(-17.2, 36, sx, 0.8, 24, 5, 2); }
      at(0, 69, 0, 38, 14, 38, 1);                                                  // clock stage (cream)
      for (const [lx, lz, ry] of [[0, 19.3, 0], [0, -19.3, 0], [19.3, 0, Math.PI / 2], [-19.3, 0, Math.PI / 2]]) {
        const p = W(lx, lz); gb.disc(2, p[0], 69, p[1], 5.6, yaw + ry + (lz < 0 || lx < 0 ? Math.PI : 0), 14);
      }
      at(0, 77.5, 0, 44, 3, 44, 1);                                                 // cornice
      const q = [W(-16, -16), W(16, -16), W(16, 16), W(-16, 16)], tp = W(0, 0);
      for (let k = 0; k < 4; k++) gb.tri(3, [q[k][0], 79, q[k][1]], [q[(k + 1) % 4][0], 79, q[(k + 1) % 4][1]], [tp[0], 90, tp[1]]);
      ctx.add(gb.geo(THREE, 4), [mBrick, mCream, mDark, mCopper]);
    }

    // corner annexes: light precast block over a brick base (photo 1, 3); plain ballpark name on the left annex face (photo 3)
    {
      const mAn = lam('#aaa89c'), mAnRoof = lam('#6e7570');
      for (const poly of [ANNEX_L, ANNEX_R]) {
        const sh = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z)));
        const g = new THREE.ExtrudeGeometry(sh, { depth: 46, bevelEnabled: false }); g.rotateX(-Math.PI / 2);
        ctx.add(g, [mAnRoof, mAn]);
        const cx = poly.reduce((a, q) => a + q[0], 0) / poly.length, cz = poly.reduce((a, q) => a + q[1], 0) / poly.length;
        const sh2 = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(cx + (x - cx) * 1.012, -(cz + (z - cz) * 1.012))));
        const g2 = new THREE.ExtrudeGeometry(sh2, { depth: 24, bevelEnabled: false }); g2.rotateX(-Math.PI / 2);
        ctx.add(g2, [mBrick2, mBrick2]);
      }
      const tex = tools.textTexture((g, w, h) => {
        g.fillStyle = '#3a2d27'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#c8a964'; g.font = 'bold 66px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('AMERICAN FAMILY FIELD', w / 2, h / 2 + 3);
      }, 1024, 96);
      const mid = [(-398 - 505) / 2, (-312 - 205) / 2], nrm = [-Math.SQRT1_2, -Math.SQRT1_2];
      const sign = ctx.add(new THREE.PlaneGeometry(116, 10.8), new THREE.MeshBasicMaterial({ map: tex }));
      sign.position.set(mid[0] + nrm[0] * 1.2, 30, mid[1] + nrm[1] * 1.2); sign.rotation.y = Math.atan2(nrm[0], nrm[1]);
    }

    // =============================================================================================
    // 4. SEATING EXTRAS, SCOREBOARDS, FOUL POLES
    // =============================================================================================
    // 4a. outfield corner terrace tiers over the loge seats (photo 5: loge top about 55 ft, glass suite band 56-72 ft, terrace rows 82-125 ft)
    {
      const mSuite = lam('#34484e'), mShadeT = lam('#6d746f');
      const seatM = ctx.M[ctx.MAT.SEAT];
      const tab = (T, v) => { if (v <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (v <= T[i][0]) return T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (v - T[i - 1][0]) / (T[i][0] - T[i - 1][0]); return T[T.length - 1][1]; };
      const terrace = (a, b, T) => {
        const [p, n, dg] = tools.span(a, b); if (p.length < 2) return;
        const dB = (i) => tab(T, dg[i]), dF = (i) => Math.max(26, dB(i) * 0.5), hT = (i) => 82 + 0.8 * (dB(i) - dF(i));
        ctx.add(tools.sweepSolid(p, n, (i) => [[dF(i), 56], [dF(i), 72], [dF(i), 82], [dB(i), hT(i)], [dB(i), 56]], [0, 1, 2, 3, 4], 3), [mSuite, mCream, seatM, mBrick2, mShadeT]);
        const fr = (arr, f) => { const q = clamp(f, 0, arr.length - 1), i0 = Math.floor(q), i1 = Math.min(arr.length - 1, i0 + 1); return arr[i0] + (arr[i1] - arr[i0]) * (q - i0); };
        const dBa = p.map((_, i) => dB(i)), dFa = p.map((_, i) => dF(i)), hTa = p.map((_, i) => hT(i));
        G.add(tools.rail(p.map((q, i) => [q[0] + n[i][0] * dFa[i], q[1] + n[i][1] * dFa[i]]), () => 82, { height: 3.5, spacing: 6, color: '#8a948f', lod: ctx.lod }));
        G.add(tools.aisles(p, n, { d0: (f) => fr(dFa, f), h0: () => 82, d1: (f) => fr(dBa, f), h1: (f) => fr(hTa, f) }, { every: 26, width: 4, handrail: !low, lod: ctx.lod }));
      };
      terrace(-45, -26, [[-45, 107], [-40, 93], [-35, 75], [-30, 66], [-26, 62]]);
      terrace(24, 45, [[24, 70], [30, 88], [36, 108], [40, 112], [45, 112]]);
    }

    // 4b. foul poles: 98 ft (photo 5: pole 285 px against the 8 ft wall = 23 px)
    for (const m of parts.poles) { m.scale.y = 98 / 60; m.position.y = 49; }

    // 4c. scoreboards. Blank dark faces. Structure measured on photo 7 (wall plane 3.1 px/ft): two lattice towers 152 ft apart, 126 ft tall,
    //     fascia lintel 125-147 ft, side canopies at 100-120 ft; main face 140 x 86 ft (12,040 sq ft, the 2024 board is 12,077) from 38 to 124 ft.
    {
      const boardTex = tools.textTexture((g, w, h) => {
        g.fillStyle = '#1b262e'; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(255,255,255,0.05)'; for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 1, h); for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 1);
      }, 256, 128);
      const mBoard = new THREE.MeshBasicMaterial({ map: boardTex });
      const mFrame = lam('#3b464a'), mTow = lam('#59655d'), mBack = lam('#2f393d');
      const sb = new GB();                                   // 0 frame, 1 tower steel, 2 back
      // lattice tower: four legs, rings every 14 ft, X braces on the front and back faces and single braces on the sides
      const tower = (cx, cz, w, d, h) => {
        const hw = w / 2, hd = d / 2, ns = Math.round(h / 14), dy = h / ns;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) sb.beam(1, [cx + sx * hw, 0, cz + sz * hd], [cx + sx * hw, h, cz + sz * hd], 1.5, 1.5);
        for (let k = 0; k <= ns; k++) {
          const y = k * dy;
          if (k % 2 === 0 || !low) { sb.beam(1, [cx - hw, y, cz - hd], [cx + hw, y, cz - hd], 1, 1); sb.beam(1, [cx - hw, y, cz + hd], [cx + hw, y, cz + hd], 1, 1); sb.beam(1, [cx - hw, y, cz - hd], [cx - hw, y, cz + hd], 1, 1); sb.beam(1, [cx + hw, y, cz - hd], [cx + hw, y, cz + hd], 1, 1); }
          if (k < ns) {
            const y1 = y + dy, flip = k % 2 ? -1 : 1;
            for (const sz of [-1, 1]) sb.beam(1, [cx - hw * flip, y, cz + sz * hd], [cx + hw * flip, y1, cz + sz * hd], 0.9, 0.9);
            if (!low) for (const sx of [-1, 1]) sb.beam(1, [cx + sx * hw, y, cz - hd * flip], [cx + sx * hw, y1, cz + hd * flip], 0.9, 0.9);
          }
        }
      };
      const BX = -20, BZ = -413, TW = 76, FW = 140, FH = 86, FY = 38;
      for (const sx of [-1, 1]) tower(BX + sx * TW, BZ, 12, 16, 126);
      sb.box(0, BX, 136, BZ, 164, 22, 16);                                       // fascia lintel (125-147)
      sb.box(0, BX, 150.5, BZ, 164, 3, 17);                                     // coping under the lamp banks
      for (const sx of [-1, 1]) { sb.box(0, BX + sx * 114, 108, BZ - 3, 64, 3, 24); for (const o of [-8, 8]) sb.beam(1, [BX + sx * 82, 100, BZ + o], [BX + sx * 146, 100, BZ + o], 1.4, 2.4); }   // side canopies
      sb.box(0, BX, FY + FH / 2, BZ - 5.5, FW + 6, FH + 6, 8);                  // board housing and bezel
      sb.box(2, BX, FY + FH / 2, BZ - 11, FW - 8, FH - 10, 6);                  // back structure box
      for (const y of [FY + 12, FY + FH / 2, FY + FH - 10]) sb.beam(1, [BX - TW, y, BZ - 14], [BX + TW, y, BZ - 14], 2.4, 3);   // back trusses
      sb.beam(1, [BX - TW, FY, BZ - 14], [BX + TW, FY + FH, BZ - 14], 1.8, 1.8); sb.beam(1, [BX + TW, FY, BZ - 14], [BX - TW, FY + FH, BZ - 14], 1.8, 1.8);
      sb.box(0, BX, FY - 2, BZ + 1.5, FW + 12, 1.4, 8);                          // front catwalk
      sb.box(0, BX, FY + FH + 3, BZ - 8, FW + 12, 1.2, 6);                       // top catwalk
      // RF board 92 x 31 ft (2,840 sq ft press figure): hung inside the arc facade
      const rh = rayHit(arcS, 24.5); const RX = rh[0] - Math.sin(24.5 * D2R) * 24, RZ = rh[1] + Math.cos(24.5 * D2R) * 24;
      const ryaw = Math.atan2(-RX, -RZ - 0), rc = Math.cos(ryaw), rs = Math.sin(ryaw);
      const RW = 92, RH = 31, RY = 104;
      sb.box(0, RX, RY + RH / 2, RZ, RW + 6, RH + 6, 5, ryaw);
      sb.box(2, RX - rs * 7, RY + RH / 2, RZ - rc * 7, RW - 8, RH - 4, 8, ryaw);
      for (const sx of [-0.42, 0.42]) { const px = RX + sx * RW * rc, pz = RZ - sx * RW * rs; sb.beam(1, [px, 84, pz], [px, RY + 2, pz], 3.2, 3.2); sb.beam(1, [px, RY + RH, pz], [px - rs * 14 * 0 + Math.sin(ryaw) * -16, RING_TOP - 6, pz + Math.cos(ryaw) * -16], 2, 2); }
      sb.box(0, RX + rs * 2.5, RY - 2.6, RZ + rc * 2.5, RW + 8, 1.2, 5, ryaw);
      ctx.add(sb.geo(THREE, 3), [mFrame, mTow, mBack]);
      const f1 = ctx.add(new THREE.PlaneGeometry(FW, FH), mBoard); f1.position.set(BX, FY + FH / 2, BZ + 1.2);
      const f2 = ctx.add(new THREE.PlaneGeometry(RW, RH), mBoard); f2.position.set(RX + rs * 2.7, RY + RH / 2, RZ + rc * 2.7); f2.rotation.y = ryaw;
      if (!low) {                                                                   // catwalk rails
        G.add(tools.rail([[BX - FW / 2 - 6, BZ + 5], [BX + FW / 2 + 6, BZ + 5]], () => FY - 1.2, { height: 3.5, spacing: 8, color: '#8a948f', lod: ctx.lod }));
      }
      // ribbon boards on the outfield seat fronts (photo 4, 5): thin dark strips just above the wall
      const rb = new GB();
      for (const [a, b] of [[-41, -24], [22, 40]]) {
        const [p, n] = tools.span(a, b);
        for (let i = 0; i < p.length - 1; i++) {
          const q = (k, d, y) => [p[k][0] + n[k][0] * d, y, p[k][1] + n[k][1] * d];
          rb.quad(0, q(i, 1.6, 8.6), q(i + 1, 1.6, 8.6), q(i + 1, 1.6, 10.6), q(i, 1.6, 10.6));
        }
      }
      ctx.add(rb.geo(THREE, 1), basic('#1c262c'));
    }

    // =============================================================================================
    // 5. VIEWS
    // =============================================================================================
    views.aerial = { pos: [-500, 420, 360], look: [0, 60, -160], orbit: true, label: 'Aerial' };
    views.gate = { pos: [-175, 26, 520], look: [-60, 62, 255], label: 'Home Gate' };
    views.roof = { pos: [-760, 430, -560], look: [-20, 130, -60], orbit: true, label: 'Fan Roof' };
    views.stands = { pos: tools.foulAt(0.18, dims.deckAt.dL(Math.round(0.18 * dims.N1)) * 0.6, dims.deckAt.lowTop(Math.round(0.18 * dims.N1)) + 6).toArray(), look: [-20, 80, -415], label: 'Scoreboard' };
  },
};
