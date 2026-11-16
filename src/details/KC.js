// Detail module: Kauffman Stadium, Kansas City Royals (opened 1973 as Royals Stadium). Units: feet.
// MEASURED from the satellite sheet (mosaic home plate px 719,643, second base 820,546; the infield skin arc fixed the
//  distance, the foul-side stand edges fixed the rotation). Image lean is about 0.55 ft east per ft of height, removed below.
//  - Outfield wall as a point table: CF 410, 402 @ +7 deg, 397 @ 15, 388 @ 22, 381 @ 28, 364 @ 36, poles 330; the left half
//    is fuller (401 @ -15, 391 @ -28, 376 @ -33, 355 @ -39). Heights 9 ft (text).
//  - Foul-side stands: lower deck about 85 ft deep (rail line 45 ft from the front edge on the sides, concourse behind);
//    behind home the upper deck ends at z = +205 (roof front edge); upper deck stops at z = -100 (left) and z = -60 (right).
//  - Rim roof band: front edge table (half width about x = +8: 270 @ z -100, 252 @ 5, 202 @ 100, 142 @ 160, 0 @ 205),
//    band 58 ft wide, top at about 104 ft. Rear rotunda: corners at +-158, z 232..285, rear edge z = 336, roof about 46 ft.
//  - Facade outline: half width 305 @ z -40, 262 @ 105, 210 @ 165, then the notch at the ramp drums to 158 and the rear arc.
//  - Ramp drums: centres (-180, 226) and (232, 238), radius about 45, silhouettes only.
//  - Outfield: dry fountain basin right field (r 425..520, 6..36 deg), sloped waterfall panels r 520..560 (both sides,
//    +-4..37 deg), left-field bullpen/party building, white plaza roofs (LF x -311..-214 z -433..-290; RF x 275..348 z -400..-322),
//    big video board behind left-center at (-68, -572), 85 ft wide.
// FROM TEXT (Wikipedia, Clem's Baseball): wall heights, backstop 58, two decks, smooth concrete exterior, thin rim roof
//  carrying the lights (no separate towers), 322 ft water feature, crown-topped board (85 x 105 ft).
// LEVEL 4 (photographs 1-8 in refs/KC, satellite sheet):
//  FACADE (photo 1, 2): the outside is NOT a solid wall. Ground to about 42 ft is an open column grid with three curved concrete
//   spandrel / ramp bands (about 13, 26, 40 ft) over dark glazing; above it an open arcade of tapered radial ribs (about 40 to
//   90 ft) shows the dark underside of the bowl; a deep rim beam (86..100 ft) closes the top; the pale roof rises behind it and
//   carries a long white lamp truss. Muted warm-grey concrete. The rear rotunda stays low (46 ft).
//  SEATING (photos 3, 4, 6; roof edge from the sheet): the sheet shows the roof top, not the seats, so the upper deck back is
//   tied to the measured roof front edge: dEnd = distance to the roof edge along the bowl normal + 6 ft (roof edge 146 ft behind
//   home, 168 first-base side at z=0, 125 third-base side at z=-108; dist tables derived from the roof table below). Lower deck
//   about 76 ft deep at 0.42 (about 2.9 ft run per 1.2 ft row, 25 rows), narrowing to 56 ft at the corners. A 13 ft press/suite
//   level (photo 6, glass band) sits between lower deck and upper deck, the upper deck overhangs only 10 ft and rises at 0.5.
//   The upper deck runs almost pole to pole (photo 3, 6: it continues past the roof end, unroofed, into both corners).
//  HEIGHTS (B): scale in photos 5 and 7 from the 9 ft outfield wall (about 0.38 ft per photo pixel at the board, in crop
//   coordinates of photo 5); rows of seats in photo 6 (lower deck about 25 rows x 1.2 ft, press level one 13 ft story).
//   Crown board shield 100 ft tall x 72 wide (text: 105 x 85; the photo ratio 1.39 tall to wide fixed the width), crown 46 ft
//   above it, shield foot 38 ft over the field (hill crest 18 ft, 20 ft pedestal), light poles about 200 ft, lamp truss about
//   205 ft (photo 5: poles end about 25 ft above the crown tips), video board frame 80 x 62 ft on a 16 ft pedestal. Rim roof 104
//   and facade 100 ft stay from the earlier pass (roof front fascia 93 ft is consistent with the upper deck top at 87..94 ft).
//   Shadows on the sheet were NOT used for heights: the roof, pole and board shadows fall on stands and slopes.
//  BOARDS (D): crown board on the centre line (photo 5: it stands at the middle of the grass batter's-eye slope; the earlier
//   x = -68 came from the lean of the crown top on the sheet), 8 light poles at +-48, +-96, +-145, +-195 ft on an arc at about 498 ft
//   with one long lattice truss, left-centre video board at x = -182 in front of the pole line (photo 5), ribbon boards on
//   the upper deck front, blank ad panels along the outfield wall, flagpoles on the right-field plaza and beside the video board.
// STILL ESTIMATED (level 4): pole, truss and board heights (no known-height object in the same plane; scale from the 9 ft wall), the
//  press-level story (13 ft), rib / spandrel spacing and heights, deck tables on the shadowed first-base side, board x for the video board,
//  flagpole positions and heights, the batter's-eye slope profile, jet layout. Earlier estimates: all heights (deck rises, facade 100 / 46 ft, roof 104 ft, panels 32 ft), fin spacing and window rhythm, light bank
//  spacing, truss depth, jet layout, board leg layout, the waterfall tiers, outfield seat depths, lean-corrected x positions
//  (+-15 ft). The two sides of the building are not exactly symmetric on the sheet; tables are symmetric about x = +8.
const D2R = Math.PI / 180;

// Bowl tables (t: 0 right-field pole, 0.5 behind home, 1 left-field pole)
const DL_TAB = [[0, 56], [0.06, 60], [0.15, 70], [0.25, 76], [0.5, 76], [0.75, 76], [0.85, 72], [0.94, 62], [1, 56]];
const DEND_TAB = [[0, 92], [0.06, 96], [0.1, 102], [0.15, 116], [0.2, 131], [0.25, 146], [0.3, 152], [0.35, 158], [0.4, 161], [0.45, 155], [0.5, 152],
  [0.55, 155], [0.6, 161], [0.65, 158], [0.7, 152], [0.75, 146], [0.8, 131], [0.85, 116], [0.9, 102], [0.94, 96], [1, 92]];
const tabAt = (T, t) => { if (t <= T[0][0]) return T[0][1]; for (let k = 1; k < T.length; k++) if (t <= T[k][0]) { const [a, x] = T[k - 1], [b, y] = T[k]; return x + ((y - x) * (t - a)) / (b - a || 1); } return T[T.length - 1][1]; };
const DU_TAB = DEND_TAB.map(([t, e]) => [t, e - (tabAt(DL_TAB, t) - 10)]);

export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 330, h: 9 }, { deg: -41, r: 341, h: 9 }, { deg: -38.7, r: 355, h: 9 }, { deg: -33.5, r: 376, h: 9 },
        { deg: -28, r: 391, h: 9 }, { deg: -21, r: 395, h: 9 }, { deg: -15, r: 401, h: 9 }, { deg: -7, r: 406, h: 9 },
        { deg: 0, r: 410, h: 9 }, { deg: 7, r: 402, h: 9 }, { deg: 15, r: 397, h: 9 }, { deg: 22, r: 388, h: 9 },
        { deg: 28, r: 381, h: 9 }, { deg: 32, r: 375, h: 9 }, { deg: 36, r: 364, h: 9 }, { deg: 39.4, r: 356, h: 9 },
        { deg: 42, r: 343, h: 9 }, { deg: 45, r: 330, h: 9 },
      ],
      backstop: 58,
      // Lower deck depth along the bowl (t 0 = right-field pole, 0.5 = behind home, 1 = left-field pole).
      lower: { depth: DL_TAB, slope: 0.42, extent: [0, 1] },
      hasUpper: true,
      // Upper deck: front 10 ft behind the lower deck back (overhang 10), 13 ft press level above the lower top, back wall under the
      // roof edge (dEnd table). depth = dEnd - (dL - 10).
      upper: { overhang: 10, rise: 13, depth: DU_TAB, slope: 0.5, extent: [0.06, 0.94] },
      outfield: { depth: 36, slope: 0.4, spans: [[-45, -28, 32, 0.4], [28, 45, 32, 0.4]], eye: [-7, 7], eyeHeight: 30, eyeDepth: 28 },
      skip: { canopy: true, lights: true, scoreboard: true },
      colors: { seat: '#34578c', facade: '#aea590', wall: '#2c4636', cream: '#e6dfcb' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, dims, parts, views } = ctx;
    const { sweepSolid } = tools;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const tmp = new THREE.Object3D();
    tmp.rotation.order = 'YXZ';
    const mat4 = (x, y, z, sx, sy, sz, ry = 0, rx = 0, rz = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(rx, ry, rz); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const cg = (g) => { g.clearGroups(); return g; };   // one draw call for single-material primitives
    const addMesh = ctx.add; ctx.add = (geo, mat, parent) => { if (!Array.isArray(mat)) geo.clearGroups(); return addMesh(geo, mat, parent); };
    const inst = (geo, mat, mats) => {
      geo.clearGroups();
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    ctx.remove(parts.lights); ctx.remove(parts.canopy);

    const XC = 8;                                   // symmetry axis of the building (x)
    // ---- path helper: smooth polyline resampled by arc length, with outward normals (away from the bowl centre)
    const mkPath = (poly, step, cx = XC, cz = 60) => {
      const cv = new THREE.CatmullRomCurve3(poly.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
      const len = cv.getLength(), n = Math.max(4, Math.round(len / step));
      const pts = cv.getSpacedPoints(n).map((p) => [p.x, p.z]);
      const nrm = pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * (p[0] - cx) + nz * (p[1] - cz) < 0) { nx = -nx; nz = -nz; }
        return [nx, nz];
      });
      return { pts, nrm, L: len, step: len / n };
    };
    // half-width table [[hw, z], ...] from the top of the left side to the rear apex -> full path left to right
    const sym = (tab, tabR) => {
      const left = tab.map(([h, z]) => [XC - h, z]);
      const right = (tabR || tab).slice(0, -1).map(([h, z]) => [XC + h, z]).reverse();
      return [...left, ...right];
    };
    const sub = (P, a, b) => ({ pts: P.pts.slice(a, b + 1), nrm: P.nrm.slice(a, b + 1) });
    const slabGeo = (poly, y0, h) => {
      const sh = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, z)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false });
      g.rotateX(Math.PI / 2); g.translate(0, y0 + h, 0); return g;      // extrusion goes down from y0+h to y0
    };

    // ---------- 1. Rim roof band (front edge table I, measured), light fascia, ribs underneath
    const RY = 104;                                  // roof top height
    const I_TAB = [[270, -100], [265, -50], [252, 5], [238, 35], [222, 65], [202, 100], [173, 135], [142, 160], [110, 178], [75, 190], [40, 199], [0, 205]];
    const I_TAB_R = [[270, -100], [265, -50], [252, 5], [238, 35], [222, 65], [202, 100], [173, 135], [142, 160], [110, 178], [75, 190], [40, 199], [0, 205]];
    const I = mkPath(sym(I_TAB, I_TAB_R), 7);
    {
      const BW = 58;
      ctx.add(sweepSolid(I.pts, I.nrm, () => [[-2, RY - 4.5], [BW, RY - 4.5], [BW, RY + 0.8], [-2, RY + 0.8]], [MAT.SHADE, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      // deep front fascia
      ctx.add(sweepSolid(I.pts, I.nrm, () => [[-1.6, RY - 11], [0.6, RY - 11], [0.6, RY + 3], [-1.6, RY + 3]], [MAT.SHADE, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      // long white lamp truss on top of the roof front edge (photos 1, 2, 4, 6): two chords, posts and two rows of lamp cells
      const at = (i, d) => ({ x: I.pts[i][0] + I.nrm[i][0] * d, z: I.pts[i][1] + I.nrm[i][1] * d, nx: I.nrm[i][0], nz: I.nrm[i][1], ry: Math.atan2(I.nrm[i][0], I.nrm[i][1]) });
      const N = I.pts.length, TY = RY + 4;
      ctx.add(sweepSolid(I.pts, I.nrm, () => [[1.5, TY], [3.5, TY], [3.5, TY + 1.4], [1.5, TY + 1.4]], [0, 0, 0, 0], 0), [lam('#d9d5c8')]);          // lower chord
      ctx.add(sweepSolid(I.pts, I.nrm, () => [[1.5, TY + 12], [3.5, TY + 12], [3.5, TY + 13.4], [1.5, TY + 13.4]], [0, 0, 0, 0], 0), [lam('#d9d5c8')]);  // upper chord
      const ls = Math.max(1, Math.round((low ? 24 : 12) / I.step)), posts = [], lamps = [], backs = [];
      for (let i = 1; i < N - 1; i += ls) {
        const s0 = at(i, 3.2);
        posts.push(mat4(s0.x, TY + 6.7, s0.z, 1.1, 12.6, 1.1, s0.ry));
        const s1 = at(i, 3.9);
        backs.push(mat4(s1.x, TY + 6.7, s1.z, I.step * ls * 0.96, 11, 0.5, s1.ry + Math.PI));
        if (!low) for (let r = 0; r < 2; r++) lamps.push(mat4(s1.x - s1.nx * 0.25, TY + 3.4 + r * 6.2, s1.z - s1.nz * 0.25, I.step * ls * 0.82, 4.2, 0.3, s1.ry + Math.PI));
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#c9c5b8'), posts);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#8a9194'), backs);
      if (lamps.length) inst(new THREE.BoxGeometry(1, 1, 1), basic('#fff1c4'), lamps);
      // underside ribs: radial concrete beams from the facade to the front edge
      const rs = Math.max(1, Math.round((low ? 56 : 28) / I.step)), ribs = [];
      for (let i = 1; i < N - 1; i += rs) { const s = at(i, BW / 2); ribs.push(mat4(s.x, RY - 7.5, s.z, 1.8, 3.2, BW, s.ry)); }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#aaa392'), ribs);
    }

    // ---------- 2. Facade outline Fo (measured), tall side wall and low rear rotunda
    const FO_TAB = [[315, -100], [305, -40], [300, -10], [290, 30], [278, 70], [262, 105], [240, 138], [210, 165], [185, 190], [170, 205],
      [162, 215], [158, 232], [158, 285], [132, 302], [95, 318], [55, 330], [20, 335], [0, 336]];
    const FO_TAB_R = FO_TAB.slice(1);
    const F = mkPath(sym(FO_TAB, FO_TAB_R), 8);
    const TALL = 100, SHORT = 46, ZSTEP = 209;
    const hAt = (i) => (F.pts[i][1] < ZSTEP ? TALL : SHORT);
    const dark = lam('#2f3638'), glass = lam('#3a4547');
    {
      // runs of constant height
      const runs = []; let a = 0;
      for (let i = 1; i <= F.pts.length; i++) if (i === F.pts.length || hAt(i) !== hAt(a)) { runs.push([a, Math.min(i, F.pts.length - 1)]); a = i; }
      for (const [r0, r1] of runs) {
        const H = hAt(r0), p = sub(F, r0, r1);
        const course = (y0, y1, o, mt = MAT.CREAM) => ctx.add(sweepSolid(p.pts, p.nrm, () => [[-0.3, y0], [o, y0], [o, y1], [-0.3, y1]], [mt, mt, mt, mt], mt), M);
        if (H > 60) {
          // TALL side: open structure (photo 1). dark back wall = glazing and the shadowed underside of the bowl
          ctx.add(sweepSolid(p.pts, p.nrm, () => [[-9, 0], [-7, 0], [-7, H], [-9, H]], [0, 0, 0, 0], 0), [dark]);
          ctx.add(sweepSolid(p.pts, p.nrm, () => [[-8, 3], [-6.5, 3], [-6.5, 41], [-8, 41]], [0, 0, 0, 0], 0), [glass]);          // glazed lower levels
          ctx.add(sweepSolid(p.pts, p.nrm, () => [[-2, 0], [4.5, 0], [4.5, 3], [-2, 3]], [MAT.FACADE, MAT.FACADE, MAT.FACADE, MAT.FACADE], MAT.FACADE), M);   // plinth
          // three curved spandrel / ramp bands over the open ground levels (photo 1)
          for (const y of [13, 26, 39]) ctx.add(sweepSolid(p.pts, p.nrm, () => [[-8, y], [3.6, y], [3.6, y + 3], [-8, y + 3]], [MAT.FACADE, MAT.FACADE, MAT.CREAM, MAT.FACADE], MAT.FACADE), M);
          // deep rim beam closing the arcade
          ctx.add(sweepSolid(p.pts, p.nrm, () => [[-8, 84], [4.5, 86], [5, 88], [5, H], [-8, H]], [MAT.FACADE, MAT.FACADE, MAT.FACADE, MAT.CREAM, MAT.FACADE], MAT.FACADE), M);
          course(H - 1.4, H, 5.6);
        } else {
          const prof = [[-1, 0], [0, 0], [0, 7], [-0.5, 7], [-0.5, H - 8], [1.6, H - 8], [1.6, H], [-6, H], [-6, 0]];
          const mats = [MAT.FACADE, MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.CREAM, MAT.CREAM, MAT.FACADE, MAT.FACADE, -1];
          ctx.add(sweepSolid(p.pts, p.nrm, () => prof, mats, MAT.FACADE), M);
          course(31, 34, 1.3);
        }
      }
      // rotunda roof cap (flat slab over the rear concourse)
      const rot = []; for (let i = 0; i < F.pts.length; i++) if (F.pts[i][1] >= ZSTEP) rot.push(F.pts[i]);
      const capPts = [...rot, [rot[rot.length - 1][0], 196], [rot[0][0], 196]];
      ctx.add(slabGeo(capPts, SHORT - 1, 3), lam('#d6ceb8'));
      // columns of the open ground levels, tapered radial ribs of the arcade, slot windows / portals on the low rotunda
      const cstep = low ? 40 : 22, nc = Math.round(F.L / cstep), cols = [];
      const rstep = low ? 34 : 18, nr = Math.round(F.L / rstep), ribs = [], fins = [], slots = [], portal = [];
      const pick = (sv) => Math.min(F.pts.length - 2, Math.max(0, Math.round(sv / F.step)));
      for (let k = 0; k <= nc; k++) {
        const i = pick(k * F.L / nc), x = F.pts[i][0] + F.nrm[i][0] * 1.2, z = F.pts[i][1] + F.nrm[i][1] * 1.2, ry = Math.atan2(F.nrm[i][0], F.nrm[i][1]);
        if (hAt(i) > 60) cols.push(mat4(x, 21, z, 2.6, 42, 2.6, ry));
      }
      for (let k = 0; k <= nr; k++) {
        const i = pick(k * F.L / nr), H = hAt(i), x = F.pts[i][0] + F.nrm[i][0], z = F.pts[i][1] + F.nrm[i][1], ry = Math.atan2(F.nrm[i][0], F.nrm[i][1]);
        if (H > 60) {
          // rib: slender at the foot, wide at the top, leaning out (tilt about the tangent): box 2.4 wide x 46 tall x 5 deep
          const ox = F.nrm[i][0] * 0.6, oz = F.nrm[i][1] * 0.6;
          ribs.push(mat4(x + ox, 63, z + oz, 2.4, 46, 3.8, ry, -0.07));
        } else {
          fins.push(mat4(x + F.nrm[i][0] * 0.6, H * 0.5 - 2, z + F.nrm[i][1] * 0.6, 2.6, H - 8, 3.2, ry));
          if (k < nr) {
            const j = pick((k + 0.5) * F.L / nr), Hj = hAt(j), mx = F.pts[j][0] + F.nrm[j][0] * 0.3, mz = F.pts[j][1] + F.nrm[j][1] * 0.3, rj = Math.atan2(F.nrm[j][0], F.nrm[j][1]);
            slots.push(mat4(mx, Hj * 0.5 + 8, mz, rstep * 0.42, Hj * 0.36, 1, rj));
            if (k % 3 === 1) portal.push(mat4(mx, 11, mz, rstep * 0.55, 20, 1, rj));
          }
        }
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#a39b87'), cols);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#b3ab97'), ribs);
      if (fins.length) { inst(new THREE.BoxGeometry(1, 1, 1), lam('#cbc2ad'), fins); inst(new THREE.PlaneGeometry(1, 1), basic('#33403f', { side: THREE.DoubleSide }), slots); inst(new THREE.PlaneGeometry(1, 1), basic('#262d2e', { side: THREE.DoubleSide }), portal); }
    }

    // ---------- 3. Spiral ramp drums at the rear corners (measured centres), helical ramp stripe
    {
      for (const [cx, cz, R] of [[-180, 226, 45], [232, 238, 42]]) {
        const H = 56, seg = low ? 20 : 32;
        const dr = ctx.add(new THREE.CylinderGeometry(R, R + 1.5, H, seg, 1, true), lam('#b8ad98')); dr.position.set(cx, H / 2, cz);
        const top = ctx.add(new THREE.CylinderGeometry(R + 2, R + 2, 3, seg), lam('#e0d6bb')); top.position.set(cx, H + 1.5, cz);
        class Helix extends THREE.Curve { getPoint(u, o = new THREE.Vector3()) { const a = u * Math.PI * 2 * 2.5; return o.set(Math.cos(a) * (R + 1.2), 8 + u * (H - 16), Math.sin(a) * (R + 1.2)); } }
        const hx = ctx.add(new THREE.TubeGeometry(new Helix(), low ? 50 : 100, 2.4, 4, false), lam('#6f6a60')); hx.position.set(cx, 0, cz);
      }
    }

    // ---------- 4. Outfield: arc helper (polar), dry fountain basin right field, sloped waterfall panels, bullpen building
    const arc = (a0, a1, r, n) => {
      const pts = [], nrm = [];
      for (let k = 0; k <= n; k++) { const a = (a0 + (a1 - a0) * k / n) * D2R; pts.push([r * Math.sin(a), -r * Math.cos(a)]); nrm.push([Math.sin(a), -Math.cos(a)]); }
      return [pts, nrm];
    };
    {
      const stone = lam('#948f7e'), water = lam('#6f98a0'), foam = basic('#d3e0e0'), panel = lam('#a9bcc2'), roofc = lam('#bdb7a6');
      // basin, right field: a shallow pool between the wall seating and the waterfall panels
      { const [p, nr] = tools.span(8, 36);
        ctx.add(sweepSolid(p, nr, () => [[16, 0], [16, 3.6], [100, 3.6], [100, 0]], [0, 0, 0, 0], 0), [stone]);
        ctx.add(sweepSolid(p, nr, () => [[18, 3.5], [18, 4.1], [98, 4.1], [98, 3.5]], [0, 0, 0, 0], 0), [water]);
        const jets = [], step = low ? 34 : 18;
        for (let a = 10; a <= 35; a += step / 9) for (const o of [40, 72]) { const q = tools.wallAt(a, o, 4.1), h = 8 + ((Math.round(a * 3) + o) % 5) * 3; jets.push(mat4(q.x, 4.1 + h / 2, q.z, 2.2, h, 2.2)); }
        inst(new THREE.ConeGeometry(1, 1, 6), foam, jets); }
      // sloped waterfall panels on the outer arc, both sides (dry in the photo): inclined slab rising outward
      for (const [a0, a1] of [[4, 37], [-37, -4]]) {
        const [p, nr] = arc(a0, a1, 522, low ? 12 : 24);
        ctx.add(sweepSolid(p, nr, () => [[0, 0], [0, 3], [38, 32], [38, 0]], [0, 0, 0, 0], 0), [panel]);
        ctx.add(sweepSolid(p, nr, () => [[38, 0], [38, 34], [42, 34], [42, 0]], [0, 0, 0, 0], 0), [stone]);   // back wall
      }
      // left-field bullpen / party building behind the wall: low flat roof with arched openings
      { const [p, nr] = tools.span(-27, -9);
        ctx.add(sweepSolid(p, nr, () => [[14, 0], [14, 20], [62, 20], [62, 0]], [0, 0, 0, 0], 0), [roofc]);
        const arches = [], an = low ? 6 : 12;
        for (let k = 0; k < an; k++) { const q = tools.wallAt(-26 + 17 * (k + 0.5) / an, 14.4, 9), v = tools.wallAt(-26 + 17 * (k + 0.5) / an, 20, 0); void v; arches.push(mat4(q.x, 9, q.z, 9, 12, 1, Math.atan2(q.x, q.z + 1e-6) + Math.PI)); }
        inst(new THREE.PlaneGeometry(1, 1), basic('#262d2e', { side: THREE.DoubleSide }), arches); }
      // white plaza roofs (lean corrected)
      ctx.add(slabGeo([[-311, -380], [-233, -433], [-214, -383], [-289, -307], [-324, -290], [-347, -308]], 0, 18), lam('#d9d1ba'));
      ctx.add(slabGeo([[294, -400], [342, -363], [348, -341], [323, -322], [275, -377]], 0, 20), lam('#d9d1ba'));
    }

    // ---------- 5. Boards, light poles and flagpoles (D). Crown scoreboard on the centre line, video board left of it.
    {
      const G0 = 18;                                  // crest of the grass slope behind the wall (batter's eye hill)
      const steel = lam('#d9d6cc'), steelDk = lam('#7b8085'), green = lam('#2c4636'), faceDk = lam('#1d2326');
      // --- crown scoreboard: pedestal, shield board with blank face, plain crown, rear frame and catwalk
      {
        const W = 72, SH = 100, PY = G0 + 20;
        const grp = new THREE.Group(); grp.position.set(0, 0, -478); grp.lookAt(0, 0, 0); G.add(grp);        // +z faces home plate
        const add = (geo, mat, x, y, z) => { const m = ctx.add(geo, mat, grp); m.position.set(x, y, z); return m; };
        add(new THREE.BoxGeometry(46, 20, 16), green, 0, G0 + 10, 0);                                          // counter housing
        add(new THREE.BoxGeometry(34, 8, 0.6), faceDk, 0, G0 + 12, 8.2);                                       // blank counter panel
        // shield outline (rectangle with a pointed foot): y = 0 at the foot
        const shield = (w, h, inset) => { const sh = new THREE.Shape(), a = w / 2 - inset, top = SH - inset, rect = SH * 0.28 + inset * 0.6;
          sh.moveTo(0, inset); sh.lineTo(a, rect); sh.lineTo(a, top); sh.lineTo(-a, top); sh.lineTo(-a, rect); sh.lineTo(0, inset); return sh; };
        const xt = (sh, th) => new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
        add(xt(shield(W, SH, 0), 6), lam('#d3ccb6'), 0, PY, -3);                                              // frame
        add(xt(shield(W, SH, 3.2), 0.6), faceDk, 0, PY, 3.1);                                                 // blank face
        add(new THREE.BoxGeometry(W - 6, 9, 0.7), lam('#c8c0a6'), 0, PY + SH - 7.5, 3.4);                      // plain header band
        // plain line grid on the face (dot-matrix look): instanced thin bars
        { const bars = []; for (let r = 0; r < 8; r++) bars.push(mat4(0, PY + 34 + r * 6.4, 3.9, W - 14, 0.35, 0.2));
          const im = new THREE.InstancedMesh(cg(new THREE.BoxGeometry(1, 1, 1)), basic('#34404a'), bars.length); bars.forEach((mx, i) => im.setMatrixAt(i, mx)); grp.add(im); }
        // plain crown on top (muted gold, four points with round tips; no marks)
        const cr = new THREE.Shape(), CY = PY + SH;
        [[-36, 0], [-36, 24], [-31, 38], [-26, 29], [-20.7, 21], [-15.5, 29], [-10.5, 38], [-5.2, 29], [0, 21], [5.2, 29], [10.5, 38], [15.5, 29], [20.7, 21], [26, 29], [31, 38], [36, 24], [36, 0]]
          .forEach(([x, y], i) => (i ? cr.lineTo(x, y) : cr.moveTo(x, y)));
        add(xt(cr, 6), lam('#c4b27b'), 0, CY, -3);
        add(new THREE.BoxGeometry(W, 5, 6.4), lam('#a8976a'), 0, CY + 2.5, 0);                                   // crown band
        { const orbs = [[-31, 41.5], [-10.5, 41.5], [10.5, 41.5], [31, 41.5]].map(([x, y]) => mat4(x, CY + y, 0, 3.2, 3.2, 3.2));
          const im = new THREE.InstancedMesh(cg(new THREE.SphereGeometry(1, low ? 6 : 10, low ? 4 : 8)), lam('#c4b27b'), 4); orbs.forEach((mx, i) => im.setMatrixAt(i, mx)); grp.add(im); }
        // rear structure: two steel columns, a cross frame, diagonal braces, top catwalk with rail
        for (const sx of [-24, 24]) add(new THREE.BoxGeometry(4, SH + 6, 4), steelDk, sx, PY + (SH + 6) / 2 - 3, -9);
        add(new THREE.BoxGeometry(W - 8, 2.5, 4), steelDk, 0, PY + SH * 0.5, -9);
        add(new THREE.BoxGeometry(W - 8, 2.5, 4), steelDk, 0, PY + SH * 0.85, -9);
        for (const sg of [-1, 1]) { const b = add(new THREE.BoxGeometry(1.4, Math.hypot(SH * 0.35, 48), 1.4), steelDk, 0, PY + SH * 0.675, -9); b.rotation.z = sg * Math.atan2(48, SH * 0.35); }
        add(new THREE.BoxGeometry(W - 4, 1.2, 9), steelDk, 0, PY + SH + 0.5, -6);                              // catwalk
        add(new THREE.BoxGeometry(W - 4, 0.5, 0.5), steelDk, 0, PY + SH + 4.2, -10.2);
        if (!low) { const rl = []; for (let k = -16; k <= 16; k++) rl.push(mat4(k * 2.1, PY + SH + 2.4, -10.2, 0.4, 3.8, 0.4));
          const im = new THREE.InstancedMesh(cg(new THREE.BoxGeometry(1, 1, 1)), steelDk, rl.length); rl.forEach((mx, i) => im.setMatrixAt(i, mx)); grp.add(im); }
      }
      // --- video board (left of the crown board, in front of the pole line, faces home): frame, blank face, pedestal, back truss
      {
        const grp = new THREE.Group(); grp.position.set(-182, 0, -470); grp.lookAt(0, 0, 0); G.add(grp);
        const add = (geo, mat, x, y, z) => { const m = ctx.add(geo, mat, grp); m.position.set(x, y, z); return m; };
        const PYv = G0 + 16;
        add(new THREE.BoxGeometry(92, 16, 24), green, 0, G0 + 8, -2);                                          // pedestal housing
        add(new THREE.BoxGeometry(80, 62, 8), lam('#d3ccb6'), 0, PYv + 31, 0);                                  // frame
        add(new THREE.BoxGeometry(70, 46, 0.8), faceDk, 0, PYv + 31, 4.3);                                     // blank face
        { const bars = []; for (let r = 0; r < 6; r++) bars.push(mat4(0, PYv + 12 + r * 7.4, 4.9, 66, 0.3, 0.2));
          const im = new THREE.InstancedMesh(cg(new THREE.BoxGeometry(1, 1, 1)), basic('#34404a'), bars.length); bars.forEach((mx, i) => im.setMatrixAt(i, mx)); grp.add(im); }
        add(new THREE.BoxGeometry(60, 2, 8), lam('#9aa0a2'), 0, PYv + 63, -3);                                  // top catwalk
        for (const sx of [-30, 30]) add(new THREE.BoxGeometry(4, 66, 4), steelDk, sx, PYv + 33, -8);              // rear columns
        add(new THREE.BoxGeometry(64, 2.4, 4), steelDk, 0, PYv + 20, -8);
        add(new THREE.BoxGeometry(64, 2.4, 4), steelDk, 0, PYv + 48, -8);
      }
      // --- light poles and the long lamp truss behind the outfield (photos 5, 7): 8 poles, 4 each side of the crown board
      {
        const PH = 200, TY = 205, xs = [-195, -145, -96, -48, 48, 96, 145, 195];
        const zOf = (x) => -498 + (x * x) / 3200;
        const poleGeo = new THREE.CylinderGeometry(1.1, 1.9, PH, low ? 6 : 8);
        const poles = xs.map((x) => mat4(x, G0 + PH / 2, zOf(x), 1, 1, 1));
        inst(poleGeo, steel, poles);
        // truss: straight segments along the arc, two chords + posts, lamp banks on the outer four poles of each side
        const chords = [], posts = [], lamps = [], backs = [];
        const step = 12, X0 = -205, X1 = 205;
        for (let x = X0; x < X1; x += step) {
          const xa = x, xb = Math.min(X1, x + step), za = zOf(xa), zb = zOf(xb), mx = (xa + xb) / 2, mz = (za + zb) / 2, L = Math.hypot(xb - xa, zb - za);
          const yaw = Math.atan2(-(zb - za), xb - xa);                         // rotate box local x along the segment
          chords.push(mat4(mx, TY, mz, L, 1.4, 1.4, yaw), mat4(mx, TY + 7, mz, L, 1.4, 1.4, yaw));
          posts.push(mat4(xa, TY + 3.5, za, 1, 7, 1));
          const inCentre = Math.abs(mx) < 62;
          if (!inCentre) {
            backs.push(mat4(mx, TY + 3.5, mz + 1.2, L, 7.4, 0.5, yaw));
            if (!low) for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) lamps.push(mat4(mx - L * 0.25 + q * L * 0.5, TY + 1.6 + r * 3.8, mz + 1.6, L * 0.4, 2.6, 0.3, yaw));
          }
        }
        inst(new THREE.BoxGeometry(1, 1, 1), steel, chords);
        inst(new THREE.BoxGeometry(1, 1, 1), steel, posts);
        inst(new THREE.BoxGeometry(1, 1, 1), lam('#5a6063'), backs);
        if (lamps.length) inst(new THREE.BoxGeometry(1, 1, 1), basic('#fff1c4'), lamps);
        // deeper centre section over the crown board: a rectangular frame
        { const c = ctx.add(new THREE.BoxGeometry(124, 14, 5), lam('#cfcabb')); c.position.set(0, TY + 3.5, zOf(0) + 0.2); }
        // pole cross braces near the top of each group (paired poles)
        { const br = []; for (const [xa, xb] of [[-195, -145], [-96, -48], [48, 96], [145, 195]]) br.push(mat4((xa + xb) / 2, G0 + PH * 0.82, zOf((xa + xb) / 2), xb - xa, 1.2, 1.2, 0)); inst(new THREE.BoxGeometry(1, 1, 1), steel, br); }
      }
      // --- flagpoles (photos 3, 5): a group of four beside the video board, four on the right-field plaza, one tall in right field
      {
        const fp = [[-262, -462, 52], [-256, -468, 48], [-250, -474, 44], [-244, -480, 40], [297, -330, 42], [305, -338, 46], [313, -346, 42], [321, -354, 38], [330, -430, 90]];
        const poles = fp.map(([x, z, h]) => mat4(x, h / 2 + (z < -420 && x < 0 ? G0 : 20), z, 0.7, h, 0.7));
        inst(new THREE.CylinderGeometry(1, 1, 1, 5), lam('#dcd8cc'), poles);
        const flags = fp.map(([x, z, h], i) => mat4(x + 4.2, (z < -420 && x < 0 ? G0 : 20) + h - 3.6, z, 8.4, 5.4, 0.2, 0));
        const fm = new THREE.InstancedMesh(cg(new THREE.BoxGeometry(1, 1, 1)), lam('#ffffff'), flags.length);
        const cols = ['#5d7391', '#a8a08a', '#8a6a5a', '#6e8a76', '#5d7391', '#a8a08a', '#8a6a5a', '#6e8a76', '#cdc6b0'];
        flags.forEach((mx, i) => { fm.setMatrixAt(i, mx); fm.setColorAt(i, new THREE.Color(cols[i])); }); fm.instanceMatrix.needsUpdate = true; if (fm.instanceColor) fm.instanceColor.needsUpdate = true; G.add(fm);
      }
      // --- secondary boards: ribbon board on the upper deck front (photo 6) and blank ad panels on the outfield wall (photos 7, 8)
      {
        const ribbon = lam('#233045');
        const a0 = Math.round(0.1 * dims.N1), a1 = Math.round(0.9 * dims.N1), dA = dims.deckAt;
        const pts = [], nrm = [];
        for (let g = a0; g <= a1; g++) { const q = tools.foulAt(g / dims.N1, 0, 0); pts.push([q.x, q.z]); }
        for (let g = a0; g <= a1; g++) { const q0 = tools.foulAt(g / dims.N1, 0, 0), q1 = tools.foulAt(g / dims.N1, 10, 0); nrm.push([(q1.x - q0.x) / 10, (q1.z - q0.z) / 10]); }
        ctx.add(sweepSolid(pts, nrm, (i) => { const g = a0 + i, d = dA.d0(g), h = dA.h0(g); return [[d - 1.4, h - 6.5], [d - 0.2, h - 6.5], [d - 0.2, h - 1.8], [d - 1.4, h - 1.8]]; }, [0, 0, 0, 0], 0), [ribbon]);
        // wall panels: blank ad boards, muted colours, along the outfield wall facing the field
        const panels = [], colsP = [];
        const pc = ['#2d4a66', '#8d8a78', '#4a3a36', '#355045', '#a89870', '#27384a'];
        let k = 0;
        for (let a = -43; a <= 43; a += 3.6) {
          if (Math.abs(a) < 8.5) continue;                        // the grass slope and board sit in the centre
          const q = tools.wallAt(a, -0.5, 0), q2 = tools.wallAt(a + 1.0, -0.5, 0), ang = Math.atan2(q2.x - q.x, q2.z - q.z) + Math.PI / 2;
          panels.push(mat4(q.x, 5.6, q.z, 14.5, 3.4, 0.5, ang)); colsP.push(pc[k++ % pc.length]);
        }
        const im = new THREE.InstancedMesh(cg(new THREE.BoxGeometry(1, 1, 1)), lam('#ffffff'), panels.length);
        panels.forEach((mx, i) => { im.setMatrixAt(i, mx); im.setColorAt(i, new THREE.Color(colsP[i])); }); im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; G.add(im);
      }
      // --- batter's eye slope: grass ramp rising from the wall to a crest where the crown board stands (photos 5, 7)
      { ctx.remove(parts.batterEye);
        const [p, nr] = tools.span(-8, 8);
        ctx.add(sweepSolid(p, nr, () => [[1.2, 0], [1.2, 9], [34, G0 + 2], [86, G0 + 2], [86, 0]], [0, 0, 0, 0], 0), [lam('#6f8c4c')]);
        ctx.add(sweepSolid(tools.span(-12, -8)[0], tools.span(-12, -8)[1], () => [[1.2, 0], [1.2, 14], [34, 14], [86, 14], [86, 0]], [0, 0, 0, 0], 0), [green]);
        ctx.add(sweepSolid(tools.span(8, 12)[0], tools.span(8, 12)[1], () => [[1.2, 0], [1.2, 14], [34, 14], [86, 14], [86, 0]], [0, 0, 0, 0], 0), [green]);
      }
    }

    // ---------- 6. Views
    {
      views.gate = { pos: [XC, 26, 336 + 120], look: [XC, 50, 200], label: 'Gate' };
      views.roof = { pos: [-420, 170, 260], look: [60, 90, 60], label: 'Rim Roof' };
      views.fountain = { pos: [-120, 70, -240], look: [190, 10, -450], label: 'Fountains' };
    }
  },
};
