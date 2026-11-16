// Detail module: loanDepot park, Miami Marlins (opened 2012, formerly Marlins Park). Units: feet.
// MEASURED FROM THE SURVEY SHEET (survey.png, 1.1 px/ft, home plate = origin). The mosaic shows the roof CLOSED, so the field
// itself is hidden: home plate and second base were fitted by symmetry of the bowl.
//  - Field axis: center field points about 128 deg true bearing (south-east), fitted so the bowl is centred on x = 0.
//  - Facade: near circle, centre (0, -168), radius 384 at the ground (left x = -383, right x = +385, top z = -552, bottom z = +216).
//    Roof edge (top of the fixed ring): radius about 362.
//  - Roof: three moving panels side by side, long axes at 45 deg (parallel to the right-field line), each rolling on two
//    750 ft rails that lie along the two short ends. Centre panel corners (-282,-55) (-120,152) (309,-264) (144,-476):
//    268 ft wide x 600 ft long. Two lower side panels about 100 ft and 92 ft wide, about 560 ft long. Roll direction
//    (0.614, 0.789), toward behind home / first base. Rails: from the facade out to (540, 31) on the right-field side
//    and out past (-45, 213) on the home side. Forked pylons stand at the rail ends: (-376,-170) (62,394) (109,-529) (547,34).
//  - Left-field plaza oval garden at (-422, -254) (a basin; the home-run sculpture is gone, none is built). West-plaza V ramps:
//    apex (403, 53), arms to (350,-25) and (415,-80). Four parking garages in the corners of the block.
// FROM TEXT SOURCES (Wikipedia, Clem's Baseball, baseballparks.com, AISC "Roof That's Ready"): wall corners 344/386/400/387/335,
//  backstop 47 ft, wall heights after 2016/2020 (LF/RF lines 7, CF 8.5, right-center tapering to 11.5), three roof panels on two
//  750 ft tracks, eight concrete pillars + four flared pylons, 42 lower rows, 22 upper rows (4 fewer near the poles), white stucco
//  facade with cobalt glass and paler glass above, six outfield glass panels (240 ft long x 60 ft high in total), video display in the
//  left-field corner with the out-of-town board beside it.
// FROM PHOTOGRAPHS (level 4; refs/MIA photo1..7):
//  A facade (photos 1, 2): open ground floor with big white flared round columns (about 6-8 ft across) and dark blue storefront glass;
//    white stucco band that projects over it; curved glass wall with fine horizontal louvres; gray metal-panel band with vertical seams;
//    white roof-edge fascia with the ballpark name in plain text; white forked pylons splitting into two branches under the roof girder
//    (photo 1); mid level between the decks is a glass suite band, with an LED ribbon strip under the upper-deck fascia (photo 3).
//    The old blue/cream bands, fins and mullions are gone. Left-centre has no seats: a dark back wall, then the glass wall (photos 3, 7).
//  B heights (feet above the field, method):
//    ground-floor column 26 ft (photo 1: column 175 px against an adult 38 px at 5.7 ft in the same plane); white band 17 ft above it
//    (same photo, same scale); glass wall 44 ft; gray metal band 22 ft; fascia 10 ft; facade top 118 ft (sum; leaning 22 ft over its height).
//    glass wall panels 60 ft (text) = 103 px in photo 7, so 1.7 px/ft in that plane: glass base 58 ft, top 118 ft; main board face about 75 x 38 ft
//    (129 x 65 px) with its bottom at 58 ft (same plane); back-wall height 58 ft the same way.
//    lower bowl: 42 rows (text) x 1.25 ft = about 52 ft; the model has 98 ft depth behind home at slope 0.45, top 47.6 ft (rows shortened a little to fit the facade);
//    upper deck: 22 rows at 1.6 ft rise per 2.6 ft row (slope 0.62), 58 ft deep behind home, top about 100 ft.
//    rail girder tops 152/136 ft: the pillars in photo 3 stand about 37 px above a 20 px stack of nine upper rows (nine rows = 20 ft),
//    which fits a girder 35-45 ft over the upper deck top. Roof crest 208 ft: not measured.
//    SHADOWS: the roof is closed in the sheet and no object of known height casts a clean ground shadow, so no shadow ratio could be
//    fixed. The shadow band of the centre panel on the lower north-west panel is about 35 ft wide (sheet row z = -200), and the
//    garage light-pole shadows about 41 ft; with poles of 14-16 ft the ratio would be 2.6-2.9, which gives a panel step near 22 ft.
//    That is what the model has (peaks 208 vs 186). Used only as a plausibility check.
//  C seating (photos 3, 5, 6, 7): lower depth by position t (0 = right-field end .. 1 = left-field end): 60, 74, 90, 98 (home), 90, 74, 60;
//    upper depth 46, 50, 54, 58 (home), 54, 50, 46, upper deck from t = 0.03 to 0.97 with a 14 ft overhang and a 20-22 ft suite band;
//    the third-base and first-base sides are mirror images because the sheet cannot show the bowl (roof closed).
//    Outfield: right side seats from CF 4.6 deg to the pole (62 ft deep to 26 deg, then 48 ft); left corner seats only from -45 to -40 deg
//    (30 ft deep); -40 to -4.6 deg has the back wall and glass wall; batter's eye +-4.6 deg.
//  D boards: main video board in right-centre at 22 deg, face about 75 x 38 ft, bottom 58 ft, with frame, cap, back box, catwalk and
//    rail, two white support columns down to the seats, three steel braces to the roof edge and a white wedge box at its left (photo 6).
//    Left-field corner display at -41.5 deg, 36 x 28 ft, bottom 50 ft (Clem: digital display in the left-field corner).
//    Out-of-town board on the left-centre back wall at -14 deg, 34 x 16 ft, bottom 26 ft. All faces are blank dark panels with a line grid.
//    Flagpoles: none in the park; the two foul poles are drawn in muted yellow (photos 3, 4).
// STILL ESTIMATED: board sizes beyond the one scale measurement and board positions along the wall, the other-side seating shape,
//  rail heights and roof crest, wall height steps, back-wall offset (28 ft), facade lean, garage heights (68 ft), ramp heights,
//  light-bank length (72% of each rail chord) and lamp counts, depth of the upper seats at the foul poles.
const D2R = Math.PI / 180;
const CX = 0, CZ = -168, R_FAC = 384, R_ROOF = 362, FAC_H = 118, LEAN = 22;
const T = [0.6143, 0.7891], A = [0.7071, -0.7071], P0 = [-282, -55];     // roll direction, long axis, centre-panel corner
const WP = (t, a) => [P0[0] + T[0] * t + A[0] * a, P0[1] + T[1] * t + A[1] * a];
const H_SW = 146, H_NE = 130;                                            // rail-top heights at the two ends of the panels
const PANELS = [
  { t0: -100, t1: 0, a0: 22, a1: 578, peak: 186, shift: 352, rise: 0, trusses: 3 },
  { t0: 0, t1: 268, a0: 0, a1: 600, peak: 208, shift: 338, rise: 24, trusses: 6 },
  { t0: 272, t1: 364, a0: 40, a1: 578, peak: 184, shift: 262, rise: 10, trusses: 3 },
];
const edgeH = (a) => H_SW + (H_NE - H_SW) * Math.min(1, Math.max(0, a / 600));
const radius = (y) => R_FAC - LEAN * (y / FAC_H);                        // leaning facade
// ray from home plate through angle deg to the facade circle
const facadeAt = (deg) => {
  const a = deg * D2R, dx = Math.sin(a), dz = -Math.cos(a), b = dx * CX + dz * CZ;
  const s = b + Math.sqrt(b * b - (CX * CX + CZ * CZ - R_FAC * R_FAC));
  return [dx * s, dz * s];
};
// mosaic pixel -> model feet (home plate at mosaic 713,478; centre field direction 0.784,0.620; 0.9022 ft/px)
const MOS = (px, py) => { const dx = (px - 713) * 0.9022, dy = (py - 478) * 0.9022; return [-0.62 * dx + 0.784 * dy, -(0.784 * dx + 0.62 * dy)]; };

export default {
  config(rec) {
    return {
      // wall heights 2016/2020 (text): LF and RF lines 7 ft, center 8.5 ft, right-center tapering up to 11.5 ft
      wall: [
        { deg: -45, r: 344, h: 7 }, { deg: -22.5, r: 386, h: 7 }, { deg: 0, r: 400, h: 8.5 },
        { deg: 22.5, r: 387, h: 11.5 }, { deg: 45, r: 335, h: 8 },
      ],
      foulScale: 1, backstop: 47,
      // lower bowl: about 42 rows behind home (rise 1.25 ft per 2.6 ft row = 0.47), shallower toward the poles
      lower: { depth: [[0, 60], [0.12, 74], [0.3, 90], [0.5, 98], [0.7, 90], [0.88, 74], [1, 60]], slope: 0.45, extent: [0, 1] },
      hasUpper: true,
      // upper (Vista) deck: 22 rows behind home, 4 fewer rows near the poles; the suite band is the gap under it
      upper: { overhang: 14, rise: [[0, 20], [0.5, 22], [1, 20]], slope: 0.62,
               depth: [[0, 46], [0.15, 50], [0.3, 54], [0.5, 58], [0.7, 54], [0.85, 50], [1, 46]], extent: [0.03, 0.97] },
      // outfield seats only on the right-field side; the left-field side is a back wall with the glass wall above it
      outfield: { depth: 60, slope: 0.5, spans: [[-45, -40, 30, 0.5], [4.6, 26, 62, 0.52], [26, 45, 48, 0.5]], eye: [-4.6, 4.6], eyeHeight: 38, eyeDepth: 34 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#3f6f9a', facade: '#e9e4d6', wall: '#31485a', cream: '#e9e4d6' },
    };
  },

  build(ctx) {
    const { THREE, G, add, lam, tools } = ctx;
    const low = ctx.lod === 'low';
    const dm = ctx.dims, { bPts, bN, wallPts, wallN, wallDeg } = ctx.paths;
    const stucco = '#ece7da', plinth = '#cfc9b6', steel = '#8d949a', under = '#c4c8c6', white = '#f1eee8', grayMetal = '#98a0a4';

    // ---- remove the generic roof panels (a box the width of the field); ours come below
    for (const m of G.children.slice()) {
      if (m.geometry && m.geometry.type === 'BoxGeometry' && m.geometry.parameters.width === dm.halfW * 2) G.remove(m);
    }
    // foul poles in a muted yellow (photos 3, 4)
    for (const pl of ctx.parts.poles) if (pl.material && pl.material.color) pl.material = lam('#d6b650');

    // ---- geometry helpers: everything static goes into buckets keyed by colour (one draw call per colour)
    const geo = () => ({ p: [], uv: [], g: [] });
    const tri = (o, a, b, c, uvs) => { o.p.push(...a, ...b, ...c); o.uv.push(...(uvs || [0, 0, 1, 0, 1, 1])); };
    const quad = (o, a, b, c, d, uvs) => { const u = uvs || [0, 0, 1, 0, 1, 1, 0, 1]; tri(o, a, b, c, [u[0], u[1], u[2], u[3], u[4], u[5]]); tri(o, a, c, d, [u[0], u[1], u[4], u[5], u[6], u[7]]); };
    const toGeo = (parts) => {
      const pos = [], uv = [], g = new THREE.BufferGeometry(); let start = 0;
      parts.forEach((pt, i) => { pos.push(...pt.p); uv.push(...pt.uv); g.addGroup(start, pt.p.length / 3, i); start += pt.p.length / 3; });
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals();
      return g;
    };
    const B = new Map();                                                  // colour ('*#rrggbb' = unlit) -> geometry buffer
    const bk = (c) => { if (!B.has(c)) B.set(c, geo()); return B.get(c); };
    const unit = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
    const _v = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(0, 0, 0, 'YXZ'), _s = new THREE.Vector3(), _p = new THREE.Vector3();
    // box centred at (cx,cy,cz), size sx,sy,sz, turned by ry about y and rx about x
    const boxB = (c, cx, cy, cz, sx, sy, sz, ry = 0, rx = 0) => {
      const o = bk(c); _e.set(rx, ry, 0); _q.setFromEuler(_e); _m.compose(_p.set(cx, cy, cz), _q, _s.set(sx, sy, sz));
      const a = unit.attributes.position;
      for (let i = 0; i < a.count; i++) { _v.fromBufferAttribute(a, i).applyMatrix4(_m); o.p.push(_v.x, _v.y, _v.z); o.uv.push(0, 0); }
    };
    // tapered prism between two points (columns, braces)
    const tube = (c, a, b, r0, r1, seg = 8) => {
      const o = bk(c), ax = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...ax), d = ax.map((v) => v / L);
      const up = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
      let u = [d[1] * up[2] - d[2] * up[1], d[2] * up[0] - d[0] * up[2], d[0] * up[1] - d[1] * up[0]]; const ul = Math.hypot(...u); u = u.map((v) => v / ul);
      const w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
      const R = (t, r) => { const cs = Math.cos(t) * r, sn = Math.sin(t) * r; return [u[0] * cs + w[0] * sn, u[1] * cs + w[1] * sn, u[2] * cs + w[2] * sn]; };
      for (let i = 0; i < seg; i++) {
        const t0 = i / seg * Math.PI * 2, t1 = (i + 1) / seg * Math.PI * 2, a0 = R(t0, r0), a1 = R(t1, r0), b0 = R(t0, r1), b1 = R(t1, r1);
        const A0 = [a[0] + a0[0], a[1] + a0[1], a[2] + a0[2]], A1 = [a[0] + a1[0], a[1] + a1[1], a[2] + a1[2]], B0 = [b[0] + b0[0], b[1] + b0[1], b[2] + b0[2]], B1 = [b[0] + b1[0], b[1] + b1[1], b[2] + b1[2]];
        quad(o, A0, A1, B1, B0);
      }
    };
    const flush = () => {
      for (const [key, o] of B) {
        if (!o.p.length) continue;
        const m = key[0] === '*' ? new THREE.MeshBasicMaterial({ color: key.slice(1), side: THREE.DoubleSide }) : lam(key);
        ctx.add(toGeo([o]), m);
      }
    };
    const P3 = (cx, cz, r, th, y) => [cx + Math.sin(th) * r, y, cz - Math.cos(th) * r];
    // band of the leaning facade between two heights; off0/off1 push the band out of (or into) the facade surface
    const ring = (o, y0, y1, n, off0 = 0, off1 = off0, vrep = 1) => {
      const r0 = radius(y0) + off0, r1 = radius(y1) + off1;
      for (let i = 0; i < n; i++) {
        const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2;
        quad(o, P3(CX, CZ, r0, t0, y0), P3(CX, CZ, r0, t1, y0), P3(CX, CZ, r1, t1, y1), P3(CX, CZ, r1, t0, y1), [i / n * 40, 0, (i + 1) / n * 40, 0, (i + 1) / n * 40, vrep, i / n * 40, vrep]);
      }
    };
    const tex = (fn, w, h, rep = true) => { const t = tools.textTexture(fn, w, h); if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; } return t; };

    // ======================= A. FACADE (photos 1, 2) =======================
    // levels: open ground floor with round white columns and dark storefront glass (0-22), white stucco band (22-36),
    // curved glass wall with fine horizontal louvres (36-84), gray metal-panel band (84-108), white roof-edge fascia (108-118)
    {
      const n = low ? 96 : 180;
      ring(bk('#33495a'), 0, 26, n, -6);                                  // storefront glass, recessed
      ring(bk(plinth), 0, 1.2, n, 0.5);
      ring(bk(stucco), 26, 42, n, 2.2, 2.6);                              // white band, slightly proud
      { const o = bk(stucco), r = radius(26);                             // soffit of the band
        for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2; quad(o, P3(CX, CZ, r - 6, t0, 26), P3(CX, CZ, r - 6, t1, 26), P3(CX, CZ, r + 2.2, t1, 26), P3(CX, CZ, r + 2.2, t0, 26)); } }
      ring(bk(grayMetal), 86, 108, n, 2.5, 3.5);                          // gray metal band
      ring(bk(white), 108, FAC_H, n, 4, 5);                               // roof-edge fascia
      ring(bk('#6f7b83'), 105.5, 108, n, 2.8);                            // shadow gap under the fascia
      { const o = bk(white), r = radius(FAC_H) + 5, r2 = radius(FAC_H) - 4;   // top lip
        for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2; quad(o, P3(CX, CZ, r, t0, FAC_H), P3(CX, CZ, r, t1, FAC_H), P3(CX, CZ, r2, t1, FAC_H), P3(CX, CZ, r2, t0, FAC_H)); } }
      // louvred glass wall (textured, one mesh)
      const lv = tex((g, w, h) => { g.fillStyle = '#3d5365'; g.fillRect(0, 0, w, h); g.fillStyle = '#6f8b9d'; g.fillRect(0, 0, w, h * 0.45); g.fillStyle = '#cfd8dc'; g.fillRect(0, h - 6, w, 6); }, 16, 64);
      const go = geo(); ring(go, 42, 86, n, -1.5, -1.5, 44 / 4.5);
      ctx.add(toGeo([go]), new THREE.MeshLambertMaterial({ map: lv, side: THREE.DoubleSide }));
      // round white columns on the ground floor and seams in the metal band (instanced boxes through the buckets)
      const nc = low ? 48 : 96;
      for (let i = 0; i < nc; i++) { const th = (i + 0.5) / nc * Math.PI * 2, r = radius(13) + 1.5;
        tube(white, P3(CX, CZ, r, th, 0), P3(CX, CZ, r + 0.8, th, 26), 3.0, 4.0, low ? 5 : 8); }
      const ns = low ? 60 : 120;
      for (let i = 0; i < ns; i++) { const th = (i + 0.5) / ns * Math.PI * 2, q = P3(CX, CZ, radius(97) + 4.1, th, 97); boxB('#7f878b', q[0], q[1], q[2], 0.5, 22, 0.6, th); }
      // plain name text on the fascia (the ballpark name only), two places
      const sg = tex((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#6a7378'; g.font = 'bold 82px "Helvetica Neue", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('loanDepot park', w / 2, h / 2 + 4); }, 1024, 128, false);
      const sm = new THREE.MeshBasicMaterial({ map: sg, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      for (const thd of [185, 262]) {
        const th = thd * D2R, r = radius(113) + 5.3, q = P3(CX, CZ, r, th, 113);
        const m = ctx.add(new THREE.PlaneGeometry(88, 11), sm); m.position.set(q[0], q[1], q[2]); m.rotation.y = Math.PI - th; m.renderOrder = 3;
      }
    }

    // ---- concourse floors that close the gap between the bowl and the facade (per position along the bowl)
    {
      const o = bk('#bdb5a0'), da = dm.deckAt;
      const toFac = (p, nrm, y) => { const r = radius(y), ox = p[0] - CX, oz = p[1] - CZ, b = ox * nrm[0] + oz * nrm[1], c = ox * ox + oz * oz - r * r; return -b + Math.sqrt(Math.max(0, b * b - c)); };
      const q = (k) => { const up = k >= dm.i0 && k <= dm.i1, dIn = (up ? da.dEnd(k) : da.dL(k)) - 1, y = up ? da.hTop(k) : da.lowTop(k), dOut = toFac(bPts[k], bN[k], y);
        return [[bPts[k][0] + bN[k][0] * dIn, y, bPts[k][1] + bN[k][1] * dIn], [bPts[k][0] + bN[k][0] * dOut, y, bPts[k][1] + bN[k][1] * dOut]]; };
      for (let i = 0; i < bPts.length - 1; i += 2) { const j = Math.min(i + 2, bPts.length - 1), a = q(i), b = q(j); quad(o, a[0], b[0], b[1], a[1]); }
    }

    // ---- mid level "suite band" in glass and the ribbon strip under the upper deck fascia (photo 3)
    {
      const da = dm.deckAt, i0 = dm.i0, i1 = dm.i1, gl = geo(), step = low ? 4 : 2; let acc = 0, prev = null;
      for (let k = i0; k <= i1; k += step) {
        const kk = Math.min(k, i1), d = da.dL(kk) - 0.35, p = [bPts[kk][0] + bN[kk][0] * d, bPts[kk][1] + bN[kk][1] * d];
        if (prev) { const a = acc; acc += Math.hypot(p[0] - prev.p[0], p[1] - prev.p[1]);
          const y0a = prev.y0, y1a = prev.y1, y0b = da.lowTop(kk) + 2, y1b = da.h0(kk) - 7.4;
          quad(gl, [prev.p[0], y0a, prev.p[1]], [p[0], y0b, p[1]], [p[0], y1b, p[1]], [prev.p[0], y1a, prev.p[1]], [a / 12, 0, acc / 12, 0, acc / 12, 1, a / 12, 1]); }
        prev = { p, y0: da.lowTop(kk) + 2, y1: da.h0(kk) - 7.4 };
      }
      const mu = tex((g, w, h) => { g.fillStyle = '#86a0ae'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8dfe0'; g.fillRect(0, 0, 3, h); g.fillRect(0, 0, w, 4); g.fillRect(0, h - 4, w, 4); }, 32, 32);
      ctx.add(toGeo([gl]), new THREE.MeshLambertMaterial({ map: mu, side: THREE.DoubleSide }));
      const rb = bk('*#1d2a36');
      for (let k = i0; k < i1; k += step) { const k2 = Math.min(k + step, i1), a = bPts[k], b = bPts[k2], d1 = da.d0(k) - 0.4, d2 = da.d0(k2) - 0.4;
        quad(rb, [a[0] + bN[k][0] * d1, da.h0(k) - 6.2, a[1] + bN[k][1] * d1], [b[0] + bN[k2][0] * d2, da.h0(k2) - 6.2, b[1] + bN[k2][1] * d2], [b[0] + bN[k2][0] * d2, da.h0(k2) - 2.9, b[1] + bN[k2][1] * d2], [a[0] + bN[k][0] * d1, da.h0(k) - 2.9, a[1] + bN[k][1] * d1]); }
    }

    // ======================= roof ring and moving panels =======================
    const poly = [[-100, 22], [-100, 578], [0, 578], [0, 600], [268, 600], [268, 578], [364, 578], [364, 40], [268, 40], [268, 0], [0, 0], [0, 22]].map(([t, a]) => WP(t, a));
    const hit = (th) => {
      const dx = Math.sin(th), dz = -Math.cos(th); let best = 1e9;
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i], q = poly[(i + 1) % poly.length], ex = q[0] - p[0], ez = q[1] - p[1];
        const den = dx * ez - dz * ex; if (Math.abs(den) < 1e-9) continue;
        const s = ((p[0] - CX) * ez - (p[1] - CZ) * ex) / den, u = ((p[0] - CX) * dz - (p[1] - CZ) * dx) / den;
        if (s > 0 && u >= 0 && u <= 1 && s < best) best = s;
      }
      return best;
    };
    {
      const nth = low ? 120 : 200, nr = 5, top = geo(), und = geo();
      const rows = [];
      for (let i = 0; i <= nth; i++) {
        const th = i / nth * Math.PI * 2, s = Math.min(R_ROOF - 6, hit(th)), row = [];
        const ix = CX + Math.sin(th) * s, iz = CZ - Math.cos(th) * s, aa = (ix - P0[0]) * A[0] + (iz - P0[1]) * A[1];
        const yIn = edgeH(aa) - 4;
        for (let k = 0; k <= nr; k++) {
          const f = k / nr, r = R_ROOF - (R_ROOF - s) * f, y = FAC_H - 2 + (yIn - (FAC_H - 2)) * (1 - Math.pow(1 - f, 1.7));
          row.push([CX + Math.sin(th) * r, y, CZ - Math.cos(th) * r]);
        }
        rows.push(row);
      }
      for (let i = 0; i < nth; i++) for (let k = 0; k < nr; k++) {
        const a = rows[i][k], b = rows[i + 1][k], c = rows[i + 1][k + 1], d = rows[i][k + 1];
        quad(top, a, b, c, d);
        quad(und, [a[0], a[1] - 5, a[2]], [b[0], b[1] - 5, b[2]], [c[0], c[1] - 5, c[2]], [d[0], d[1] - 5, d[2]]);
      }
      ctx.add(toGeo([top]), lam('#f1eee6')); ctx.add(toGeo([und]), lam(under));
      // radial ribs on the underside of the ring (flat lattice strips)
      const lat = tex((g, w, h) => { g.strokeStyle = '#5c6268'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 2); g.lineTo(w, 2); g.moveTo(0, h - 2); g.lineTo(w, h - 2);
        g.moveTo(0, h); g.lineTo(w / 2, 0); g.lineTo(w, h); g.stroke(); }, 64, 32, false);
      lat.wrapS = THREE.RepeatWrapping;
      const latMat = new THREE.MeshLambertMaterial({ map: lat, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide });
      const rib = geo(), nrib = low ? 24 : 48;
      for (let i = 0; i < nrib; i++) {
        const th = (i + 0.5) / nrib * Math.PI * 2, s = Math.min(R_ROOF - 6, hit(th));
        const idx = Math.round(i / nrib * nth) % nth, row = rows[idx];
        const a = row[0], b = row[nr];
        quad(rib, [a[0], a[1] - 5, a[2]], [b[0], b[1] - 5, b[2]], [b[0], b[1] - 17, b[2]], [a[0], a[1] - 17, a[2]], [0, 1, (R_ROOF - s) / 20, 1, (R_ROOF - s) / 20, 0, 0, 0]);
      }
      ctx.add(toGeo([rib]), latMat);
    }

    // three moving panels (unchanged from the first pass; rails and trusses as before)
    const latU = tex((g, w, h) => { g.strokeStyle = '#4f565c'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 3); g.lineTo(w, 3); g.moveTo(0, h - 3); g.lineTo(w, h - 3);
      for (let x = 0; x < w; x += w / 2) { g.moveTo(x, h); g.lineTo(x + w / 4, 0); g.lineTo(x + w / 2, h); } g.stroke(); }, 128, 48, false);
    latU.wrapS = THREE.RepeatWrapping;
    const webMat = new THREE.MeshLambertMaterial({ map: latU, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide });
    const topMat = lam('#f6f3ec'), underMat = lam('#b4b9b8');
    const roofList = [];
    PANELS.forEach((p) => {
      const nu = 4, nv = low ? 14 : 24, w = p.t1 - p.t0, len = p.a1 - p.a0;
      const yTop = (t, a) => { const arch = 1 - Math.pow(2 * a / 600 - 1, 2); return edgeH(a) + (p.peak - edgeH(a)) * arch + (p.trusses === 6 ? 4 * (1 - Math.pow(2 * (t - p.t0) / w - 1, 2)) : 0); };
      const V = (t, a, dy = 0) => { const q = WP(t, a); return [q[0], yTop(t, a) + dy, q[1]]; };
      const top = geo(), sd = geo(), web = geo();
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        const t0 = p.t0 + w * i / nu, t1 = p.t0 + w * (i + 1) / nu, a0 = p.a0 + len * j / nv, a1 = p.a0 + len * (j + 1) / nv;
        quad(top, V(t0, a0), V(t1, a0), V(t1, a1), V(t0, a1));
        quad(sd, V(t0, a0, -11), V(t1, a0, -11), V(t1, a1, -11), V(t0, a1, -11));
      }
      for (let j = 0; j < nv; j++) {
        const a0 = p.a0 + len * j / nv, a1 = p.a0 + len * (j + 1) / nv;
        for (const t of [p.t0, p.t1]) quad(sd, V(t, a0), V(t, a1), V(t, a1, -11), V(t, a0, -11));
      }
      for (let i = 0; i < nu; i++) for (const a of [p.a0, p.a1]) { const t0 = p.t0 + w * i / nu, t1 = p.t0 + w * (i + 1) / nu; quad(sd, V(t0, a), V(t1, a), V(t1, a, -11), V(t0, a, -11)); }
      for (let k = 0; k < p.trusses; k++) {
        const t = p.t0 + w * (k + 0.5) / p.trusses;
        for (let j = 0; j < nv; j++) {
          const a0 = p.a0 + len * j / nv, a1 = p.a0 + len * (j + 1) / nv;
          quad(web, V(t, a0, -1), V(t, a1, -1), V(t, a1, -17), V(t, a0, -17), [j, 1, j + 1, 1, j + 1, 0, j, 0]);
          quad(sd, V(t - 1.6, a0, -17), V(t + 1.6, a0, -17), V(t + 1.6, a1, -17), V(t - 1.6, a1, -17));
        }
      }
      const grp = new THREE.Group(); G.add(grp);
      grp.add(new THREE.Mesh(toGeo([top, sd, web]), [topMat, underMat, webMat]));
      roofList.push({ panel: { position: { set: (x, y, z) => grp.position.set(T[0] * z, y, T[1] * z) } }, closedZ: 0, openZ: p.shift, closedY: 0, openY: p.rise });
    });

    // ---- rails: two 750 ft girders, forked white pylons at their ends, eight round pillars inside, light banks on the girder faces
    {
      const lineHit = (P, dir, sign) => { const ox = P[0] - CX, oz = P[1] - CZ, b = ox * dir[0] + oz * dir[1], c = ox * ox + oz * oz - R_FAC * R_FAC; return -b + sign * Math.sqrt(b * b - c); };
      const ry = Math.atan2(T[0], T[1]);
      const swP = WP(0, -4), nePt = WP(0, 604);
      for (const [P, y] of [[swP, H_SW + 6], [nePt, H_NE + 6]]) {
        const s0 = lineHit(P, T, -1), sx = lineHit(P, T, 1), s1 = s0 + 750, mid = s0 + 375;
        boxB('#c4c0b4', P[0] + T[0] * mid, y - 7, P[1] + T[1] * mid, 12, 14, 750, ry);
        boxB('#a7a7a0', P[0] + T[0] * (s1 - 120), y - 24, P[1] + T[1] * (s1 - 120), 5, 4, 240, ry);
        // forked flared pylons at both girder ends (photo 1): trunk, then two branches splayed along the girder
        for (const s of [s0 + 12, s1 - 24]) {
          const bx = P[0] + T[0] * s, bz = P[1] + T[1] * s, ty = y * 0.42;
          tube(white, [bx, 0, bz], [bx, ty, bz], 9, 6, low ? 8 : 12);
          for (const sg of [-1, 1]) tube(white, [bx, ty - 2, bz], [bx + T[0] * sg * 16, y - 6, bz + T[1] * sg * 16], 4.6, 3.4, low ? 6 : 8);
        }
        // four round pillars inside the bowl along the chord
        for (const f of [0.16, 0.39, 0.61, 0.84]) {
          const s = s0 + (sx - s0) * f, bx = P[0] + T[0] * s, bz = P[1] + T[1] * s;
          tube(white, [bx, 0, bz], [bx, y - 8, bz], 4.8, 4.2, low ? 6 : 10);
        }
        // light bank on the inner face of the girder: housing plus two rows of lamps
        const toField = (-P[0]) * T[1] + (-170 - P[1]) * (-T[0]), sgn = toField >= 0 ? 1 : -1;
        const sA = s0 + (sx - s0) * 0.14, sB = s0 + (sx - s0) * 0.86, L = sB - sA, sm = (sA + sB) / 2, off = 6 + 1.3;
        const cx = P[0] + T[0] * sm + T[1] * sgn * off, cz = P[1] + T[1] * sm - T[0] * sgn * off;
        boxB('#4a5156', cx, y - 6.5, cz, 2.6, 8.4, L, ry);
        const nl = Math.floor(L / (low ? 9 : 4.5));
        for (let i = 0; i < nl; i++) { const s = sA + (i + 0.5) * L / nl; for (const dy of [-3.2, 0.6]) boxB('*#f4efd6', P[0] + T[0] * s + T[1] * sgn * (off + 1.5), y - 6.5 + dy, P[1] + T[1] * s - T[0] * sgn * (off + 1.5), 0.5, 2.6, 3, ry); }
      }
    }

    // ======================= outfield: back wall + glass wall (left), seats and boards (right) =======================
    const ofAt = (deg) => (deg < -40 ? { dep: 30, slp: 0.5 } : deg < 26 ? { dep: 62, slp: 0.52 } : { dep: 48, slp: 0.5 });
    const wR = (deg) => tools.wallR(ctx.spec, deg), wH = (deg) => tools.wallH(ctx.spec, deg);
    {
      // terrace behind the outfield seats (right and corner only; the left-centre back wall is below)
      const o = bk('#bdb5a0');
      for (let i = 0; i < wallPts.length - 1; i++) {
        const dg = wallDeg[i]; if (Math.abs(dg) < 4.6 || Math.abs(dg) > 44.9 || (dg > -40 && dg < -4.6)) continue;
        const k = (idx) => { const p = wallPts[idx], nn = wallN[idx], od = ofAt(wallDeg[idx]), hw = wH(wallDeg[idx]), y = hw + 3 + od.slp * od.dep;
          const dIn = 4 + od.dep - 1, r = radius(y), ox = p[0] - CX, oz = p[1] - CZ, b = ox * nn[0] + oz * nn[1], c = ox * ox + oz * oz - r * r;
          const dOut = -b + Math.sqrt(Math.max(0, b * b - c));
          return [[p[0] + nn[0] * dIn, y, p[1] + nn[1] * dIn], [p[0] + nn[0] * dOut, y, p[1] + nn[1] * dOut]]; };
        const a = k(i), b = k(i + 1); quad(o, a[0], b[0], b[1], a[1]);
      }
      // left-centre: dark back wall 28 ft behind the fence up to 58 ft, six 40 x 60 ft glass panels above it (text: 240 x 60 ft)
      const [sp, sn] = tools.span(-40, -4.6), OFF = 28, wp = sp.map((p, i) => [p[0] + sn[i][0] * OFF, p[1] + sn[i][1] * OFF]);
      const wb = bk('#2a3a35'), ws = bk('#cfc9b6'), fr = bk('#6d7a82');
      for (let i = 0; i < wp.length - 1; i++) {
        const a = wp[i], b = wp[i + 1];
        quad(wb, [a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], 58, b[1]], [a[0], 58, a[1]]);
        quad(ws, [a[0], 56.2, a[1]], [b[0], 56.2, b[1]], [b[0], 59.2, b[1]], [a[0], 59.2, a[1]]);
        quad(fr, [a[0], 117, a[1]], [b[0], 117, b[1]], [b[0], 119.5, b[1]], [a[0], 119.5, a[1]]);
        // fence-top terrace between fence and back wall
        quad(bk('#a89f86'), [sp[i][0], 0.2, sp[i][1]], [sp[i + 1][0], 0.2, sp[i + 1][1]], [b[0], 0.2, b[1]], [a[0], 0.2, a[1]]);
      }
      const gg = geo();
      for (let i = 0; i < wp.length - 1; i++) { const a = wp[i], b = wp[i + 1]; quad(gg, [a[0], 59.2, a[1]], [b[0], 59.2, b[1]], [b[0], 117, b[1]], [a[0], 117, a[1]]); }
      const glassMat = new THREE.MeshLambertMaterial({ color: '#b9d2da', transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
      ctx.add(toGeo([gg]), glassMat).renderOrder = 2;
      // mullions every 40 ft along the arc
      const seg = []; let tot = 0; for (let i = 0; i < wp.length - 1; i++) { const l = Math.hypot(wp[i + 1][0] - wp[i][0], wp[i + 1][1] - wp[i][1]); seg.push([tot, l]); tot += l; }
      const nM = 6, pitch = tot / nM;
      for (let m = 0; m <= nM; m++) { const s = m * pitch; let i = seg.findIndex(([a, l]) => s <= a + l + 1e-6); if (i < 0) i = seg.length - 1; const f = Math.min(1, (s - seg[i][0]) / seg[i][1]);
        const x = wp[i][0] + (wp[i + 1][0] - wp[i][0]) * f, z = wp[i][1] + (wp[i + 1][1] - wp[i][1]) * f; boxB('#6d7a82', x, 88, z, 1.2, 60, 1.6, Math.atan2(wp[i + 1][0] - wp[i][0], wp[i + 1][1] - wp[i][1]) + Math.PI / 2); }
    }

    // ======================= D. SCOREBOARDS AND VIDEO BOARDS =======================
    const faceG = geo();                                                 // blank dark faces, one mesh, line-grid texture
    // frame/structure builder in a local frame: (lx right, ly up, lz toward the field), facing = unit vector toward the field
    const board = ({ x, z, fx, fz, y0, w, h, post = 0, wedge = false, back = 10, trussUp = 0 }) => {
      const ry = Math.atan2(fx, fz), rx = [Math.cos(ry), -Math.sin(ry)];
      const W = (lx, lz) => [x + rx[0] * lx + fx * lz, z + rx[1] * lx + fz * lz];
      const bx = (c, lx, ly, lz, sx, sy, sz) => { const p = W(lx, lz); boxB(c, p[0], ly, p[1], sx, sy, sz, ry); };
      bx('#6d747a', 0, y0 + h / 2 - 1, -back / 2 - 2, w * 0.86, h + 8, back);          // back structure (box behind the board)
      bx('#d9d5c8', 0, y0 + h / 2, 0, w + 5, h + 5, 3.4);                              // frame
      bx('#d9d5c8', 0, y0 + h + 3.4, 0.5, w + 7, 2, 4);                                // top cap
      { const a = W(-w / 2, 1.8), b = W(w / 2, 1.8); quad(faceG, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y0 + h, b[1]], [a[0], y0 + h, a[1]], [0, 0, w / 4, 0, w / 4, h / 4, 0, h / 4]); }
      bx('#8e969b', 0, y0 - 3.4, 3, w + 9, 1.1, 6);                                    // catwalk
      bx('#8e969b', 0, y0 - 0.6, 5.8, w + 9, 0.5, 0.5);                                // catwalk rail
      for (const sx of [-0.36, 0.36]) {                                                // support columns
        const a = W(w * sx, -2); if (post > 0) tube('#e6e2d6', [a[0], post, a[1]], [a[0], y0 - 4, a[1]], 2.4, 2.0, low ? 6 : 8);
      }
      if (trussUp > 0) for (const sx of [-0.4, 0, 0.4]) {                              // braces from the top back to the roof structure
        const a = W(w * sx, 0), b = W(w * sx, -back - 6); tube(steel, [a[0], y0 + h + 4, a[1]], [b[0], y0 + h + 4 + trussUp, b[1]], 0.9, 0.9, 4); }
      if (wedge) { const p = W(-w / 2 - 14, -3); boxB('#e6e2d6', p[0], y0 + h / 2 + 4, p[1], 20, h + 18, 12, ry); }
    };
    {
      // main video board: right-centre, hung above the right-field seats (photos 3, 6, 7), about 75 x 38 ft face, bottom 58 ft above the field
      const deg = 22, a = deg * D2R, od = ofAt(deg), r = wR(deg) + 4 + od.dep + 6, x = r * Math.sin(a), z = -r * Math.cos(a), len = Math.hypot(x, z);
      const seatTop = wH(deg) + 3 + od.slp * od.dep;
      board({ x, z, fx: -x / len, fz: -z / len, y0: 58, w: 75, h: 38, post: seatTop, wedge: true, back: 14, trussUp: 14 });
      // left-field corner digital display (Clem): 36 x 28 ft face at the end of the glass wall
      const d2 = -41.5, a2 = d2 * D2R, o2 = ofAt(d2), r2 = wR(d2) + 4 + o2.dep + 6, x2 = r2 * Math.sin(a2), z2 = -r2 * Math.cos(a2), l2 = Math.hypot(x2, z2);
      board({ x: x2, z: z2, fx: -x2 / l2, fz: -z2 / l2, y0: 50, w: 36, h: 28, post: wH(d2) + 3 + o2.slp * o2.dep, back: 8, trussUp: 8 });
      // out-of-town scoreboard on the left-centre back wall: 34 x 16 ft, no post (hangs on the wall)
      const d3 = -14, a3 = d3 * D2R, r3 = wR(d3) + 28 - 1.5, x3 = r3 * Math.sin(a3), z3 = -r3 * Math.cos(a3), l3 = Math.hypot(x3, z3);
      board({ x: x3, z: z3, fx: -x3 / l3, fz: -z3 / l3, y0: 26, w: 34, h: 16, back: 3 });
    }
    {
      const gt = tex((g, w, h) => { g.fillStyle = '#141d25'; g.fillRect(0, 0, w, h); g.strokeStyle = '#27343f'; g.lineWidth = 2; g.strokeRect(0, 0, w, h); }, 32, 32);
      ctx.add(toGeo([faceG]), new THREE.MeshBasicMaterial({ map: gt, side: THREE.DoubleSide }));
    }

    // ---- fixed pieces carried over from the first pass
    // left-field plaza: oval garden with a basin (no sculpture)
    { const bed = ctx.add(new THREE.CylinderGeometry(34, 34, 1.2, 28), lam('#6e8a58')); bed.position.set(-422, 0.6, -254); bed.scale.z = 1.5;
      const pool = ctx.add(new THREE.CylinderGeometry(22, 22, 1.4, 28), lam('#8fb2c0')); pool.position.set(-422, 0.8, -254); pool.scale.z = 1.5; }
    // west-plaza V ramps
    {
      const ramp = (a, b, y0, y1) => {
        const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz), ry = Math.atan2(dx, dz), rx = -Math.atan2(y1 - y0, len), cx = (a[0] + b[0]) / 2, cz = (a[1] + b[1]) / 2, cy = (y0 + y1) / 2;
        boxB('#c9c5b8', cx, cy, cz, 14, 3, len, ry, rx);
        const off = new THREE.Vector3(6.6, 3, 0).applyEuler(new THREE.Euler(rx, ry, 0, 'YXZ'));
        boxB('#8e969b', cx + off.x, cy + off.y, cz + off.z, 0.8, 4, len, ry, rx);
      };
      ramp([403, 53], [350, -25], 10, 30); ramp([403, 53], [415, -80], 10, 30);
    }
    // parking garages in the corners of the block (pastel tile), from the mosaic
    {
      const rects = [[[315, -10], [700, 135]], [[785, -10], [1295, 130]], [[205, 1050], [725, 1210]], [[810, 1060], [1320, 1210]]];
      const cols = ['#d8c9ae', '#cfd8c8', '#d5c4b4', '#c8d3d6'];
      rects.forEach(([a, b], i) => {
        const p0 = MOS(a[0], a[1]), p1 = MOS(b[0], a[1]), p2 = MOS(b[0], b[1]), p3 = MOS(a[0], b[1]), cx = (p0[0] + p2[0]) / 2, cz = (p0[1] + p2[1]) / 2;
        const w = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), h = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
        boxB(cols[i], cx, 34, cz, h, 68, w, Math.atan2(p1[0] - p0[0], p1[1] - p0[1]) - Math.PI / 2);
      });
    }

    flush();

    // ---- extra views
    ctx.views.gate = { pos: [-470, 40, 260], look: [0, 70, -160], label: 'West Side' };
    ctx.views.roof = { pos: [-330, 250, 360], look: [100, 110, -200], orbit: true, label: 'Roof' };
    { const q = tools.foulAt(0.3, dm.d0 + dm.dU * 0.55, dm.h0 + dm.sU * dm.dU * 0.55 + 4.5); ctx.views.stands = { pos: [q.x, q.y, q.z], look: [-120, 30, -260], label: 'Vista Level' }; }
    { const q = tools.foulAt(0.78, dm.deckAt.dL(Math.round(0.78 * dm.N1)) * 0.5, dm.deckAt.lowTop(Math.round(0.78 * dm.N1)) * 0.62 + 4.5); ctx.views.board = { pos: [q.x, q.y, q.z], look: [150, 70, -440], label: 'Video Board' }; }
    ctx.views.facade = { pos: [-470, 26, 330], look: [-250, 70, 120], label: 'Facade' };
    for (const v of Object.values(ctx.views)) v.dir = new THREE.Vector3(...v.look).sub(new THREE.Vector3(...v.pos)).normalize();

    // swap the roof list in the live park (keeps toggleRoof working)
    const park = typeof window !== 'undefined' && window.__show ? window.__show.park : null;
    if (park) { park.roof = roofList; park._placeRoof(); }
  },
};
