// Detail module for NYY: Yankee Stadium (2009). See briefs/detail-api.md.
// MEASURED from the survey sheet (survey_tight.png, 1.5 px/ft, home plate origin, +x right field, -z center field):
//  - FRIEZE[]  roof inner edge (white frieze line), RFOUT[] roof outer edge, 27 stations RF corner -> home -> LF corner.
//    Roof is ~38 ft wide on the 3B side, ~55 ft wide on the 1B/RF side. Canopy ends near (205,-390) and (-255,-390).
//  - FACADE[]  outer limestone wall line (closed loop): straight run along the 3B side (x ~ -308 at z=0 to -390 at z=-250),
//    crest at z ~ 293 behind home, 1B side runs out to x ~ 380 along RF, then turns toward the rail along the RF-CF corner.
//    Left side beyond z=-250 is outside the photo and extrapolated; CF side z ~ -500 is read from the pale roof band.
//  - Wall: sheet shows the warning-track outer edge ~10-15 ft inside the posted numbers (LF 308+10, CF 393+10); LF/RF
//    corners moved (-34 deg 352, RF turn 30 deg 338 / 38 deg 320). Posted distances at +-22.5 and 0 kept.
//  - Elevated rail: straight line through (-120,-713) and (433,-287) (slope 0.77), 4 tracks, ~50 ft wide.
//  - Concourse/Great Hall flat roofs fill the strip between the canopy and the facade (60-75 ft wide).
// FROM PHOTOS: facade composition (3-arch bays between piers, small square windows, cornice, dark base, gate pavilions with
//  3 taller arches and gold name), frieze of posts + scalloped arcs + slats, light banks on the roof edge, steel braces.
// SECOND PASS (detail level 2), from zone_home/left/right/center, survey_hi and photos 2-10:
//  MEASURED (sheets): deck back edge = ray from the seat front edge to the measured frieze line (smoothed, clamped 112..132 ft, so the
//   grandstand is 58..78 ft deep and follows the roof); dugouts 3B x -98..-42 / z -17..37 and 1B x 58..112 / z 19..-46 (about 80 ft long,
//   1B end partly in shadow); section-aisle spacing about 24 ft (lower tiers) and 28 ft (upper tiers); batter's-eye block x -50..+46, ~28 ft
//   deep; bullpen dirt pads on each side of the block (x +-48..80, just behind the wall); bowl extent and stair/ramp tower sites are read
//   off the rim of survey_hi.
//  FROM PHOTOS: four tiers (field level, main level with a flat cross-aisle, terrace, grandstand) with a dark suite band between main level
//   and terrace and a flat walkway between terrace and grandstand; press glass behind home; window grid (center mullion + transoms), paired
//   small windows, stepped cornice, glass doors + flat canopy at the gates, black iron fence; net behind home plate with posts; blank wall
//   panels; foul poles reaching the terrace level; flagpoles on the roof edge; Monument Park as dark granite walls with plain plaques.
//  PUBLISHED: center-field displays about 24 ft x 60 ft (video board and line-score board), second-deck ribbon board 1,280 ft long
//   (sportsvideo.org, "New Yankee Stadium to feature $19 million Daktronics scoreboard and display system", 2007).
//  ESTIMATED: all heights (facade ~78 ft, pavilions ~96 ft, canopy ~ hTop+15, foul poles 80 ft, eye 46 ft, dugout roof 7 ft, net 34 ft,
//   tier heights), tier splits (field level 22 ft deep, terrace 36% of the upper depth), tunnel and aisle counts, pavilion positions,
//   left side beyond z=-250, facade behind center field, Great Hall extent, rail height, tower sizes, board positions.
// LEVEL 3 (area A/B/C and phone budget):
//  ADDED: roof underside structure (primary trusses with zig-zag diagonals at the 39 ft column bay, secondary ribs at the 13 ft frieze bay,
//   ring beam at the column heads); lamp banks on the frieze panels (3 rows x 9 round-faced lamps per panel, photo 3); railings with
//   tools.rail (field-level front rail broken at both dugouts, cross-aisle drop rails on the main level and terrace, glass-panel rail on the
//   terrace front, outfield-stand front rails); aisle handrails (centre rail and posts) on every section aisle; seat rows come from the
//   seat texture (sweepSolid UVs give one row per 3 ft of slope on every seat edge). Stair-tower slot is now a narrow mid-grey glazed strip
//   with transoms instead of a black slot; the grandstand tunnel portals sit inside the back wall (they poked out above the facade).
//   Blank boards are a plain box plus a textured quad (2 calls instead of 6). Single-material meshes lose their geometry groups at the end
//   of build() so the call count is the real one. Phone ('low'): section aisles at half density and no handrails, window frames with one
//   transom, lamp banks as one textured quad each, secondary ribs at 26 ft, truss with 4 panels, rail posts at double spacing (tool default).
//   The park has no light towers (lamps sit on the roof edge), so none were added. Field: generic markings, mound, on-deck circles, coaches'
//   boxes and tarp checked; generic dugouts leave with the lower deck (our own are kept), the tarp lies in foul ground clear of both dugouts.
//   ESTIMATED at level 3: truss depth (3.2 ft) and diagonal pattern, lamp counts per panel, rail heights, handrail post spacing.
// LEVEL 4 (photographs, heights, seating shape, boards):
//  A FACADE (photos 2, 5, 8): warm limestone (#d6cdb2) over a ~10 ft grey granite base; three storeys: door level (a door in every second bay), one tall arched
//   window per bay (two panes, transoms) with a pair of small square windows above, pilasters between bays, belt courses at 12 ft and below the cornice, flat
//   slab cornice; bay pitch 14.5 ft (was 30 ft with three arches); gate pavilions 58 ft wide, 14 ft above the wall, three tall arches, plain blank roundels
//   beside the gold name, canopy with "GATE 4" on the home-plate gate (photo 8). Stair towers and the concourse roof were lowered with the wall.
//  B HEIGHTS (measured): wall 52 ft (40 ft behind the outfield) and pavilion 66 ft from photo 5 (door ~8 ft = 38 px, pavilion 300 px, arches 13.5..44 ft) and
//   photo 8 (granite base 10 ft, arches start 13 ft); video board 59 x 101 ft (published) and the other boards from their pixel ratio to it in photo 6
//   (left group 38 ft tall / 172 ft wide, right group 40 / 110; centres read from the photo axis); outfield wall 8 ft (config); seat rise per row 1.1-1.3 ft
//   in the lower tiers (slope 0.36 field level, 0.4 main level) and 1.8-2.2 ft above (0.6 terrace, 0.78 grandstand), as counted rows in photos 3 and 7.
//   Shadow method tried on survey_hi (sun from the right, low-ish elevation): ground shadows are lost in the dark street asphalt and the RF-side shadow
//   falls on the stands, so no usable ratio came out; no height rests on shadows.
//  C SEATING (sheet, 2.4 px/ft zones stitched, normal-ray brightness profiles): grandstand back edge = roof inner edge, checked per station on the shadowed RF
//   side (edge 102 at the RF pole, 111, 117, 121, 125, 128, 129-132 along RF, 126-135 behind home; model dE = ray distance to the measured frieze + 3 ft,
//   now allowed down to 100 ft at both ends, 134 max). Lower bowl: first cross-aisle band at d 29..35 (field level now 28 ft + 7 ft aisle, was 22), main level
//   back at d 62-64, terrace/grandstand cross-aisle band at d 92-95 (split now at 50% of the upper depth, was 36%).
//  D BOARDS: video board x -8..+93, left board group x -187..-15 (three blank panels), right group x +95..+205 (three blank panels), on a 455 ft ring around home,
//   bottoms at 50 ft; each has a back frame (chords, plate, end posts, ribs), a catwalk with a rail and steel columns down to the eye roof (42 ft) or the stand roofs;
//   plain name lettering above the left group; six flagpoles on the centre-field structure; a blank dark ribbon board on the terrace front.
//  STILL ESTIMATED: roof / frieze height (hTop + 18), tier boundary heights (rows counted, not measured), foul pole height (80 ft), board distance (ring radius),
//   left side beyond z=-250, truss depth, lamp counts, eye depth, facade behind centre field.
const FRIEZE_C = '#ece6d2', STONE = '#d6cdb2', STONE_D = '#97938a', GLASS = '#10161c', STEEL = '#4a5a52';

// roof inner edge (frieze line), RF corner -> behind home -> LF corner
const FRIEZE = [[215,-372],[240,-338],[266,-306],[290,-268],[303,-210],[301,-150],[285,-100],[258,-50],[232,0],[184,50],[147,100],[100,150],[50,172],[0,178],[-50,172],[-100,151],[-150,100],[-184,50],[-230,0],[-255,-50],[-284,-100],[-308,-150],[-321,-200],[-320,-250],[-312,-300],[-290,-350],[-255,-390]];
// roof outer edge, same stations
const RFOUT = [[232,-385],[268,-352],[310,-326],[338,-290],[355,-215],[358,-150],[345,-100],[316,-50],[298,0],[235,52],[198,100],[115,196],[55,215],[0,218],[-50,212],[-100,190],[-185,128],[-235,50],[-272,0],[-301,-50],[-321,-100],[-343,-150],[-351,-200],[-352,-250],[-348,-300],[-334,-350],[-298,-415]];
// facade outer wall line, closed loop starting at the RF-CF corner and running down the RF side, behind home, up the LF side
const FACADE = [[200,-402],[250,-362],[300,-328],[352,-300],[368,-250],[370,-200],[372,-150],[372,-100],[368,-50],[362,0],[336,36],[307,70],[281,103],[252,135],[226,167],[194,200],[152,239],[100,268],[50,286],[0,293],[-57,282],[-108,250],[-148,200],[-182,150],[-231,100],[-274,50],[-308,0],[-326,-50],[-348,-100],[-368,-160],[-385,-215],[-368,-270],[-348,-330],[-325,-385],[-285,-435],[-230,-470],[-170,-488],[-100,-496],[0,-497],[100,-478],[150,-450]];
// gate pavilions: target points on the facade
const GATES = [[0,293],[-148,200],[-308,0],[194,200],[362,0],[372,-130],[-372,-175]];
const RAIL = [[-420,-944],[520,-221]];

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 318, h: 8.4 }, { deg: -34, r: 352, h: 8.4 }, { deg: -22.5, r: 399, h: 8.4 }, { deg: -9, r: 408, h: 8.4 },
        { deg: 0, r: 408, h: 8.4 }, { deg: 9, r: 404, h: 8.4 }, { deg: 22.5, r: 385, h: 8.4 }, { deg: 30, r: 338, h: 8.2 },
        { deg: 38, r: 320, h: 8.2 }, { deg: 45, r: 314, h: 8 },
      ],
      backstop: 52,
      lower: { depth: 62, slope: 0.4, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 8, rise: 24, depth: 66, slope: 0.74, extent: [0, 1] },
      outfield: { depth: 55, slope: 0.45, spans: [[-45, -12.5], [12.5, 45]], eye: null },
      skip: { scoreboard: true, canopy: true },
      colors: { seat: '#27466f', facade: STONE, wall: '#1f3350', cream: '#e6dec6' },
    };
  },

  build(ctx) {
    const { THREE, G, dims, tools } = ctx;
    const { sweepSolid, textTexture } = tools;
    const { dL, lowTop, d0, h0, dEnd, hTop } = dims;
    const lam = ctx.lam;
    const low = ctx.lod === 'low';                       // phone: fewer and simpler small parts
    const box = (w, h, d) => { const g = new THREE.BoxGeometry(w, h, d); g.clearGroups(); return g; };   // one material: groups would only inflate the call count
    const sc = (c) => Math.cos(c), sn = (c) => Math.sin(c);
    const wallH = (d) => tools.wallH(ctx.spec, d);
    const wallR = (d) => tools.wallR(ctx.spec, d);

    // ---- helpers ------------------------------------------------------------------------------------------
    const resample = (pts, nrm, step) => {
      const out = []; let acc = 0, next = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], L = Math.hypot(x1 - x0, z1 - z0);
        while (next <= acc + L + 1e-6) {
          const t = L ? (next - acc) / L : 0;
          out.push({ x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, nx: nrm[i][0] + (nrm[i + 1][0] - nrm[i][0]) * t, nz: nrm[i][1] + (nrm[i + 1][1] - nrm[i][1]) * t, i });
          next += step;
        }
        acc += L;
      }
      return out;
    };
    const instances = (geo, mat, samples, f, scaleFn) => {
      const mesh = new THREE.InstancedMesh(geo, mat, samples.length);
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), s = new THREE.Vector3(1, 1, 1);
      samples.forEach((p, k) => {
        const { off, y } = f(p, k);
        q.setFromAxisAngle(up, Math.atan2(p.nx, p.nz));
        s.set(1, 1, 1); if (scaleFn) scaleFn(s, p, k);
        m.compose(new THREE.Vector3(p.x + p.nx * off, y, p.z + p.nz * off), q, s); mesh.setMatrixAt(k, m);
      });
      mesh.instanceMatrix.needsUpdate = true; G.add(mesh); return mesh;
    };
    const ribbon = (pts, nrm, o0, y0, o1, y1, mat) => {
      const pos = [], idx = [];
      pts.forEach((p, i) => { const n = nrm[i]; pos.push(p[0] + n[0] * o0, y0, p[1] + n[1] * o0, p[0] + n[0] * o1, y1, p[1] + n[1] * o1); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return ctx.add(g, mat);
    };
    // Catmull-Rom spline through a table, S sub-steps per segment. Returns [[x,z],..].
    const spline = (pts, S, closed) => {
      const n = pts.length, out = [], g = (i) => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
      const segs = closed ? n : n - 1;
      for (let i = 0; i < segs; i++) {
        const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
        for (let k = 0; k < S; k++) {
          const t = k / S, t2 = t * t, t3 = t2 * t, c = (a) => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3);
          out.push([c(0), c(1)]);
        }
      }
      if (!closed) out.push(pts[n - 1].slice());
      return out;
    };
    // outward normals for a path that runs RF -> home -> LF (outward = right-hand side of travel)
    const normalsOf = (pts, closed) => pts.map((p, i) => {
      const a = pts[closed ? (i - 1 + pts.length) % pts.length : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % pts.length : Math.min(pts.length - 1, i + 1)];
      let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l; return [tz, -tx];
    });
    // equal-arclength samples of a closed loop
    const loopSamples = (pts, step) => {
      const n = pts.length, cum = [0]; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; cum.push(cum[i] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
      const L = cum[n], cnt = Math.round(L / step), out = [], nr = normalsOf(pts, true);
      let j = 0;
      for (let k = 0; k < cnt; k++) {
        const s = (k / cnt) * L; while (cum[j + 1] < s) j++;
        const t = (s - cum[j]) / (cum[j + 1] - cum[j]), a = pts[j], b = pts[(j + 1) % n], na = nr[j], nb = nr[(j + 1) % n];
        let nx = na[0] + (nb[0] - na[0]) * t, nz = na[1] + (nb[1] - na[1]) * t; const l = Math.hypot(nx, nz); nx /= l; nz /= l;
        out.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, nx, nz, s });
      }
      return { out, L };
    };
    const inPoly = (x, z, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
    const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const windowShape = (w, h) => {
      const s = new THREE.Shape(), r = w / 2;
      s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r); s.absarc(0, h - r, r, 0, Math.PI, false); s.lineTo(-r, 0); return s;
    };
    // instance with lateral offset u, rotation about the local x axis rx, and non-uniform scale
    const placeAll = (geo, mat, items) => {
      const mesh = new THREE.InstancedMesh(geo, mat, items.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(), qx = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), ax = new THREE.Vector3(1, 0, 0), s = new THREE.Vector3(), v = new THREE.Vector3();
      items.forEach((it, k) => {
        q.setFromAxisAngle(up, Math.atan2(it.nx, it.nz)); if (it.rx) { qx.setFromAxisAngle(ax, it.rx); q.multiply(qx); }
        const u = it.u || 0, off = it.off || 0;
        v.set(it.x + it.nx * off + it.nz * u, it.y, it.z + it.nz * off - it.nx * u);
        s.set(it.sx || 1, it.sy || 1, it.sz || 1); m.compose(v, q, s); mesh.setMatrixAt(k, m);
      });
      mesh.instanceMatrix.needsUpdate = true; G.add(mesh); return mesh;
    };

    // merge a list of [w,h,d,x,y,z] boxes into one geometry (for instanced window frames etc.)
    const mergeBoxes = (boxes) => {
      const pos = [], nor = [];
      for (const [w, h, d, x, y, z] of boxes) { const g = box(w, h, d).translate(x, y, z).toNonIndexed(); pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g;
    };

    // ---- remove generic parts replaced here: outfield seats get a deeper, variable-depth rebuild ------------------
    ctx.remove(ctx.parts.lights);                    // light banks are rebuilt on the roof edge below
    const [fp, fn] = tools.cut(0, 1);
    const [, , ua, ub] = tools.cut(0, 1);
    const upPts = fp.slice(ua, ub + 1), upN = fn.slice(ua, ub + 1);
    const roofIn = hTop + 18, roofOut = hTop + 12, conY = 38;

    // dense roof edges
    const S = 8;
    const Fd = spline(FRIEZE, S, false), Rd = spline(RFOUT, S, false);
    const Fn = normalsOf(Fd, false);
    const Cd = spline(FACADE, 6, true);

    // ---- bowl: lower bowl (field level + cross-aisle + main level) and upper structure (terrace + grandstand), depth varies ----
    // distance from the seat front edge to the measured frieze line along each station normal (ray cast), smoothed
    const rayDist = (x, z, nx, nz) => {
      let best = 1e9;
      for (let k = 0; k < Fd.length - 1; k++) {
        const [ax, az] = Fd[k], [bx, bz] = Fd[k + 1], ex = bx - ax, ez = bz - az, den = nx * ez - nz * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = ((ax - x) * ez - (az - z) * ex) / den, u = ((ax - x) * nz - (az - z) * nx) / den;
        if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
      }
      return best > 1e8 ? 125 : best;
    };
    const NS = fp.length;
    const rd0 = fp.map((p, i) => rayDist(p[0], p[1], fn[i][0], fn[i][1]));
    const rdS = rd0.map((_, i) => { let a = 0, c = 0; for (let k = -4; k <= 4; k++) { const j = Math.min(NS - 1, Math.max(0, i + k)); a += rd0[j]; c++; } return a / c; });
    const AF = 28, XA = 7, sF = 0.36;                            // field-level depth, cross-aisle width, field-level slope (sheet: cross-aisle band at d 29..35)
    const yF = 3.5 + sF * AF, yA = yF + 2.6;                    // field-level top, cross-aisle height
    const P = rdS.map((r) => {
      const dE = clamp(r + 3, 100, 134), W = dE - d0, d1 = d0 + 0.5 * W, y2 = h0 + 0.6 * (d1 - d0);
      const sG = 0.78, hT = y2 + 3 + sG * (dE - d1 - 6);
      return { dE, W, d1, y2, hT, sG };
    });
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    const glassMat = new THREE.MeshLambertMaterial({ color: '#16232c', transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const pressMat = new THREE.MeshLambertMaterial({ color: '#7f98a0', transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const Mx = [...ctx.M, glassMat, pressMat];                    // 5 = suite glass, 6 = press glass
    ctx.remove([ctx.parts.lowerDeck, ctx.parts.upperDeck]);
    // lower bowl: field level seats, flat cross-aisle, main level seats
    ctx.add(sweepSolid(fp, fn, () => [[0, 0], [0, 3.5], [AF, yF], [AF, yA], [AF + XA, yA], [dL, lowTop], [dL, 0]],
      [0, 1, 2, 2, 1, 3, -1], 3), Mx);
    // upper structure: terrace seats, step + cross-aisle, grandstand; suite glass on its inner face
    ctx.add(sweepSolid(fp, fn, (i) => { const q = P[i]; return [[d0, h0 - 7], [d0, h0], [q.d1, q.y2], [q.d1, q.y2 + 3], [q.d1 + 6, q.y2 + 3], [q.dE, q.hT], [q.dE, 0], [dL, 0], [dL, h0 - 7]]; },
      [2, 1, 2, 2, 1, 3, -1, 5, 4], 3), Mx);

    // outfield stands: depth follows the distance from the wall to the measured roof edge (deep behind the poles, 55 ft in the middle)
    {
      ctx.remove(ctx.parts.outfieldSeats);
      const distF = (x, z) => { let m = 1e9; for (const p of Fd) { const d = Math.hypot(p[0] - x, p[1] - z); if (d < m) m = d; } return m; };
      const wmat = ctx.M;
      for (const [a, b] of [[-45, -12.5], [12.5, 45]]) {
        const [p, n, dg] = tools.span(a, b);
        const dep = p.map((q, i) => { const w = sstep(12.5, 26, Math.abs(dg[i])); return 55 + w * (Math.min(125, Math.max(55, distF(q[0], q[1]) - 8)) - 55); });
        { const g = tools.rail(p.map((q, i) => [q[0] + n[i][0] * 4.4, q[1] + n[i][1] * 4.4]), (i) => wallH(dg[i]) + 3, { height: 3.2, color: '#5f6458' }); G.add(g); }
        ctx.add(sweepSolid(p, n, (i) => {
          const hw = wallH(dg[i]), dp = dep[i], sl = 0.45 + (dp - 55) / 70 * 0.33;
          return [[1.2, 0], [1.2, hw + 3], [4, hw + 3], [4 + dp, hw + 3 + sl * dp], [4 + dp, 0]];
        }, [0, 2, 1, 3, -1], 3), wmat);
      }
    }

    // ---- 1. suite / terrace band between the main level and the grandstand ---------------------------------------
    {
      // cream terrace ledge on top of the main level and mullions every ~14 ft
      const ledge = sweepSolid(upPts, upN, () => [[dL - 7, lowTop + 0.2], [dL - 7, lowTop + 2], [dL, lowTop + 2], [dL, lowTop + 0.2]], [2, 2, 2, 2], 2);
      ctx.add(ledge, ctx.M);
      const mulGeo = box(0.8, h0 - 8 - lowTop - 3, 0.8);
      instances(mulGeo, lam('#d8d0b8'), resample(upPts, upN, 14), () => ({ off: dL - 1, y: (lowTop + 3 + h0 - 8) / 2 }));
    }


    // ---- 1b. seating details: section aisles, entry tunnels, press band; field level: dugouts, net, bullpens -----------------
    {
      const aisleMat = lam('#dcd3b6'), tunMat = lam('#12171b');
      const aisleG = box(2.4, 0.22, 1);
      const strips = [];
      // aisles: [step ft, d from, d to, y from, y to, getter for station]
      const aisleSet = (step, f) => resample(fp, fn, step * (low ? 2 : 1)).forEach((p) => { const q = P[Math.min(p.i, NS - 1)], r = f(q); strips.push({ x: p.x, z: p.z, nx: p.nx, nz: p.nz, off: r.dm, y: r.ym + 0.14, rx: -Math.atan(r.sl), sz: r.len, sl: r.sl, run: r.len * Math.cos(Math.atan(r.sl)) }); });
      const sFld = sF, sMain = (lowTop - yA) / (dL - AF - XA);
      aisleSet(24, () => ({ dm: AF / 2 + 0.4, ym: 3.5 + sFld * AF / 2, sl: sFld, len: AF / Math.cos(Math.atan(sFld)) - 1 }));
      aisleSet(24, () => ({ dm: (AF + XA + dL) / 2, ym: (yA + lowTop) / 2, sl: sMain, len: (dL - AF - XA) / Math.cos(Math.atan(sMain)) - 1 }));
      aisleSet(28, (q) => ({ dm: (d0 + q.d1) / 2, ym: (h0 + q.y2) / 2, sl: 0.6, len: (q.d1 - d0) / Math.cos(Math.atan(0.6)) - 1 }));
      aisleSet(28, (q) => ({ dm: (q.d1 + 6 + q.dE) / 2, ym: (q.y2 + 3 + q.hT) / 2, sl: q.sG, len: (q.dE - q.d1 - 6) / Math.cos(Math.atan(q.sG)) - 1 }));
      placeAll(aisleG, aisleMat, strips);
      // aisle handrails (level 3): a centre rail and a post every ~11 ft on each aisle strip; none on the phone
      if (!low) {
        const hr = [];
        strips.forEach((a) => {
          hr.push({ x: a.x, z: a.z, nx: a.nx, nz: a.nz, off: a.off, y: a.y + 3.3, rx: a.rx, sx: 0.3, sy: 0.3, sz: a.sz });
          const m = Math.max(1, Math.round(a.sz / 11));
          for (let j = 0; j <= m; j++) { const f = (j / m - 0.5) * a.run; hr.push({ x: a.x, z: a.z, nx: a.nx, nz: a.nz, off: a.off + f, y: a.y + f * a.sl + 1.65, sx: 0.3, sy: 3.3, sz: 0.3 }); }
        });
        placeAll(box(1, 1, 1), lam('#5f6458'), hr);
      }
      // entry tunnels: dark portals at the back of the main level and the back of the grandstand
      const tm = [], tg = [];
      resample(fp, fn, 52).forEach((p) => tm.push({ x: p.x, z: p.z, nx: p.nx, nz: p.nz, off: dL - 1.6, y: lowTop - 3.2 }));
      resample(fp, fn, 58).forEach((p) => { const q = P[Math.min(p.i, NS - 1)]; tg.push({ x: p.x, z: p.z, nx: p.nx, nz: p.nz, off: q.dE - 2.3, y: q.hT - 4.4 }); });
      placeAll(box(9, 8.4, 3.6), tunMat, tm);
      placeAll(box(9, 8.2, 3.6), tunMat, tg);
      // press level: pale glass band on the terrace fascia behind home plate, with mullions
      const a = Math.round(0.4 * (NS - 1)), b = Math.round(0.6 * (NS - 1));
      ribbon(fp.slice(a, b + 1), fn.slice(a, b + 1), d0 + 0.5, h0 - 6.4, d0 + 0.5, h0 - 0.6, new THREE.MeshLambertMaterial({ color: '#8aa3ab', transparent: true, opacity: 0.88, side: THREE.DoubleSide }));
      instances(box(0.7, 6, 0.7), lam('#e7dfc5'), resample(fp.slice(a, b + 1), fn.slice(a, b + 1), 9), () => ({ off: d0 + 0.8, y: h0 - 3.5 }));
      // ---- ribbon board along the terrace front (photo 7: a dark LED band on the fascia, published as about 1,280 ft long); blank slate, plain pale edge line
      ribbon(fp.slice(ua, ub + 1), fn.slice(ua, ub + 1), d0 + 0.25, h0 - 4.4, d0 + 0.25, h0 - 1.0, new THREE.MeshLambertMaterial({ color: '#22313f', side: THREE.DoubleSide }));
      ribbon(fp.slice(ua, ub + 1), fn.slice(ua, ub + 1), d0 + 0.3, h0 - 2.9, d0 + 0.3, h0 - 2.5, new THREE.MeshLambertMaterial({ color: '#8fa0a6', side: THREE.DoubleSide }));
      // ---- dugouts: low roofed boxes along the field-level front edge, dark opening toward the field
      const dug = (zLo, zHi, sideX) => {
        const ids = []; fp.forEach((q, i) => { if (q[1] >= zLo && q[1] <= zHi && q[0] * sideX > 0) ids.push(i); });
        if (ids.length < 2) return;
        const pp = ids.map((i) => fp[i]), nn = ids.map((i) => fn[i]);
        ctx.add(sweepSolid(pp, nn, () => [[-3, 0.2], [-3, 5.4], [-3.5, 5.4], [-3.5, 7], [11, 7], [11, 0.2]], [0, 1, 1, 3, 4, -1], 4),
          [lam('#0d1114'), lam('#d9d0b4'), lam('#2b3b4a'), lam('#56635f'), lam('#2b3b4a')]);
      };
      dug(-17, 40, -1);     // third-base side (x<0)
      dug(-46, 20, 1);      // first-base side (x>0), home dugout
      // ---- backstop net: transparent mesh between the dugouts + posts
      const ids = []; fp.forEach((q, i) => { if (Math.abs(q[0]) <= 42 && q[1] > 30) ids.push(i); });
      if (ids.length > 2) {
        const pp = ids.map((i) => fp[i]), nn = ids.map((i) => fn[i]);
        const ntex = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#eef0e8'; g.lineWidth = 2; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * w / 4, 0); g.lineTo(k * w / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, k * h / 4); g.lineTo(w, k * h / 4); g.stroke(); } }, 64, 64);
        ntex.wrapS = ntex.wrapT = THREE.RepeatWrapping;
        const pos = [], uv = [], idx = []; let acc = 0;
        pp.forEach((q, k) => { if (k) acc += Math.hypot(q[0] - pp[k - 1][0], q[1] - pp[k - 1][1]); const nx = nn[k][0] * 2.5, nz = nn[k][1] * 2.5; pos.push(q[0] + nx, 5, q[1] + nz, q[0] + nx, 34, q[1] + nz); uv.push(acc / 2, 0, acc / 2, 14.5); if (k) { const i = (k - 1) * 2; idx.push(i, i + 1, i + 2, i + 1, i + 3, i + 2); } });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
        ctx.add(g, new THREE.MeshBasicMaterial({ map: ntex, transparent: true, alphaTest: 0.2, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
        const posts = resample(pp, nn, 14.5);
        instances(box(0.8, 36, 0.8), lam('#3a4448'), posts, () => ({ off: 2.5, y: 18 }));
        ribbon(pp, nn, 2.5, 34.3, 2.5, 34.8, lam('#3a4448'));
      }
      // ---- level 3, area B: railings (tools.rail). Field-level front rail stops at the two dugouts; cross-aisle drop rails; terrace front glass rail.
      {
        const R = (pts, yAt, o) => { const g = tools.rail(pts, yAt, o); G.add(g); return g; };
        const offp = (pts, nn, d) => pts.map((q, i) => [q[0] + nn[i][0] * (typeof d === 'function' ? d(i) : d), q[1] + nn[i][1] * (typeof d === 'function' ? d(i) : d)]);
        const inDug = fp.map((q) => (q[0] < 0 && q[1] >= -17 && q[1] <= 40) || (q[0] > 0 && q[1] >= -46 && q[1] <= 20));
        let run = [];
        const flush = () => { if (run.length > 2) R(offp(run.map((i) => fp[i]), run.map((i) => fn[i]), 0.4), () => 3.5, { height: 2.6, color: '#5f6458' }); run = []; };
        fp.forEach((_, i) => { if (inDug[i]) flush(); else run.push(i); }); flush();
        R(offp(fp, fn, AF + 0.5), () => yA, { height: 3.1, color: '#6a6e62' });                         // cross-aisle drop rail
        const uu = fp.slice(ua, ub + 1), un = fn.slice(ua, ub + 1);
        R(offp(uu, un, d0 + 0.5), () => h0, { height: 3.4, glass: true, color: '#7d7a6c' });            // terrace front: glass panels
        R(offp(uu, un, (i) => P[ua + i].d1 + 0.5), (i) => P[ua + i].y2 + 3, { height: 3.1, color: '#6a6e62' });   // terrace cross-aisle drop rail
      }
      // ---- bullpens: beyond the wall on each side of the center-field block (floor, wall, fence, two mounds each)
      for (const sgn of [-1, 1]) {
        const a0 = sgn * 7.4, a1 = sgn * 12.3, lo = Math.min(a0, a1), hi = Math.max(a0, a1);
        const [p, n, dg] = tools.span(lo, hi);
        const dirt = lam('#a67f56'), wl = lam('#1f3350'), fence = lam('#2c3338');
        ctx.add(sweepSolid(p, n, () => [[1.6, 0], [1.6, 0.35], [30, 0.35], [30, 0]], [0, 0, 0, 0], 0), [dirt]);          // pen floor
        ctx.add(sweepSolid(p, n, () => [[29.4, 0], [29.4, 9], [30.2, 9], [30.2, 0]], [0, 0, 0, 0], 0), [wl]);              // back wall
        ribbon(p, n, 29.4, 9, 29.4, 12.5, new THREE.MeshLambertMaterial({ color: '#2c3338', transparent: true, opacity: 0.55, side: THREE.DoubleSide })); // fence above
        ribbon(p, n, 1.6, 0.3, 1.6, 3.6, new THREE.MeshLambertMaterial({ color: '#1f3350', side: THREE.DoubleSide }));         // low front fence
        const mid = (lo + hi) / 2;
        for (const [dd, o] of [[-1.7, 13], [1.7, 13]]) { const v = tools.wallAt(mid + dd, o, 0); const m = ctx.add(new THREE.CylinderGeometry(2.4, 4.6, 0.8, 18), lam('#b88f63')); m.position.set(v.x, 0.75, v.z); }
        // plate + bench
        const v1 = tools.wallAt(mid, 25, 0); const bn = ctx.add(box(14, 1.2, 1.6), lam('#6b563c')); bn.position.set(v1.x, 1.6, v1.z); bn.rotation.y = -mid * tools.D2R;
      }
    }

    // ---- 2. roof / canopy: pale flat roof ribbon between the measured inner and outer edges ---------------------------
    {
      const nR = Fd.length;
      const roofMat = lam('#f3f0e6'), underMat = lam('#b9b3a2'), fasciaMat = lam('#f4f0e4');
      const pos = [], idx = [], pos2 = [], idx2 = [];
      Fd.forEach((f, i) => {
        const r = Rd[i];
        pos.push(f[0], roofIn, f[1], r[0], roofOut, r[1]);
        pos2.push(f[0], roofIn - 4, f[1], r[0], roofOut - 4, r[1]);
        if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      });
      const mk = (ps, id, mat) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(ps, 3)); g.setIndex(id); g.computeVertexNormals(); return ctx.add(g, mat); };
      mk(pos, idx, roofMat); mk(pos2, idx, underMat);
      const Fp = Fd, Rp = Rd, Rn = normalsOf(Rd, false);
      ribbon(Fp, Fn, 0, roofIn - 4, 0, roofIn + 0.8, fasciaMat);             // inner fascia
      ribbon(Rp, Rn, 0, roofOut - 4, 0, roofOut + 0.8, fasciaMat);           // outer fascia
      // end caps
      for (const k of [0, nR - 1]) { const a = Fd[k], b = Rd[k]; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], roofIn - 4, a[1], a[0], roofIn, a[1], b[0], roofOut, b[1], b[0], roofOut - 4, b[1]], 3)); g.setIndex([0, 1, 2, 0, 2, 3]); ctx.add(g, fasciaMat); }

      // frieze: a white band hanging from the inner edge: slats above scalloped arcs between posts (alpha-cut texture, one tile per bay)
      const BAY = 13, FH = 12;
      const ftex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#f2eddc';
        g.fillRect(0, 0, w, h * 0.09);                                   // top rail
        for (let k = 0; k < 7; k++) g.fillRect(w * (0.09 + k * 0.125), h * 0.09, w * 0.05, h * 0.42); // slats
        g.fillRect(0, h * 0.50, w, h * 0.06);                             // arc band top
        g.beginPath(); g.moveTo(0, h * 0.56); g.lineTo(0, h * 0.62); g.quadraticCurveTo(w * 0.5, h * 1.25, w, h * 0.62); g.lineTo(w, h * 0.56); g.closePath(); g.fill();
        g.fillStyle = '#d9d2bd'; g.fillRect(0, h * 0.58, w, h * 0.03);
      }, 128, 128);
      ftex.wrapS = THREE.RepeatWrapping; ftex.colorSpace = THREE.SRGBColorSpace;
      const fm = new THREE.MeshLambertMaterial({ map: ftex, alphaTest: 0.5, side: THREE.DoubleSide });
      {
        const pp = [], uu = [], ii = []; let acc = 0;
        Fd.forEach((f, i) => {
          if (i) acc += Math.hypot(f[0] - Fd[i - 1][0], f[1] - Fd[i - 1][1]);
          const u = acc / BAY, off = -1.0;
          pp.push(f[0] + Fn[i][0] * off, roofIn - 3, f[1] + Fn[i][1] * off, f[0] + Fn[i][0] * off, roofIn - 3 - FH, f[1] + Fn[i][1] * off);
          uu.push(u, 1, u, 0);
          if (i) { const a = (i - 1) * 2; ii.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uu, 2)); g.setIndex(ii); g.computeVertexNormals();
        ctx.add(g, fm);
      }
      const Fs = resample(Fd, Fn, 1).filter((_, k) => true);
      const posts = resample(Fd, Fn, 39);
      instances(box(2, FH + 4, 2), fasciaMat, posts, () => ({ off: -1, y: roofIn - 3 - FH / 2 + 1 }));
      // light banks on the roof edge: dark panel with a pale frame, every 39 ft (offset half a bay from the posts)
      const banks = resample(Fd, Fn, 39).slice(0, -1).map((p, k, a) => p);
      const bankPts = []; { const sm = resample(Fd, Fn, 19.5); sm.forEach((p, k) => { if (k % 2 === 1) bankPts.push(p); }); }
      instances(box(30, 6, 1.6), lam('#80878b'), bankPts, () => ({ off: -3, y: roofIn + 4.4 }));
      instances(box(31, 0.9, 2), fasciaMat, bankPts, () => ({ off: -3, y: roofIn + 7.6 }));
      // steel columns + braces under the outer edge, every 39 ft
      const colS = resample(Rd, Rn, 39);
      const colH = roofOut - 4 - conY;
      instances(box(2.4, colH, 2.4), lam('#6c7a73'), colS, () => ({ off: -1.5, y: conY + colH / 2 }));
      const brace = [];
      colS.forEach((p) => { const rx = -Math.atan2(14, colH); brace.push({ x: p.x, z: p.z, nx: p.nx, nz: p.nz, off: -8, y: conY + colH / 2 + 2, rx, sy: Math.hypot(14, colH) / colH }); });
      placeAll(box(1.5, colH, 1.5), lam('#6c7a73'), brace);
      // ---- level 3, area A: roof underside structure. Rd[i] and Fd[i] are the same station, so a rib runs from an outer-edge point to its
      // matching inner-edge point and lies on the underside plane. Trusses at the column bay (39 ft), light secondary ribs at the frieze bay (13 ft).
      {
        const alongRoof = (step, skip3) => {
          const out = []; let acc = 0, next = 0, k = 0;
          for (let i = 0; i < Rd.length - 1; i++) {
            const [x0, z0] = Rd[i], [x1, z1] = Rd[i + 1], l = Math.hypot(x1 - x0, z1 - z0), f0 = Fd[i], f1 = Fd[i + 1];
            while (next <= acc + l) {
              const t = (next - acc) / l, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t, fx = f0[0] + (f1[0] - f0[0]) * t, fz = f0[1] + (f1[1] - f0[1]) * t;
              const dx = fx - x, dz = fz - z, L = Math.hypot(dx, dz) || 1;
              if (!(skip3 && k % 3 === 0)) out.push({ x, z, nx: dx / L, nz: dz / L, L });
              next += step; k++;
            }
            acc += l;
          }
          return out;
        };
        const dyR = roofIn - roofOut, LN = 50, TD = 3.2, NP = low ? 4 : 8;
        // truss: top chord at the underside, bottom chord TD below, zig-zag diagonals; built for a 50 ft span and stretched to each span
        const tg = [[0.7, 0.7, LN, 0, 0, LN / 2], [0.7, 0.7, LN, 0, -TD, LN / 2]];
        const trussGeo = (() => {
          const pos = [], nor = [];
          const add = (g) => { const ng = g.toNonIndexed(); pos.push(...ng.attributes.position.array); nor.push(...ng.attributes.normal.array); };
          for (const [w, h, d, x, y, z] of tg) add(new THREE.BoxGeometry(w, h, d).translate(x, y, z));
          const pw = LN / NP;
          for (let k = 0; k < NP; k++) {
            const len = Math.hypot(pw, TD), a = Math.atan2(TD, pw) * (k % 2 ? -1 : 1);
            add(new THREE.BoxGeometry(0.45, 0.45, len).rotateX(a).translate(0, -TD / 2, (k + 0.5) * pw));
          }
          const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g;
        })();
        const tilt = (a) => ({ ...a, off: 0, rx: -Math.atan2(dyR, a.L), sz: Math.hypot(a.L, dyR) / LN });
        const steel2 = lam('#7a857e');
        placeAll(trussGeo, steel2, alongRoof(39, false).map((a) => ({ ...tilt(a), y: roofOut - 4 - 0.4 })));
        placeAll(box(0.7, 1.5, LN), steel2, alongRoof(low ? 26 : 13, true).map((a) => ({ ...tilt(a), y: roofOut - 4 - 0.8 })));
        // ring beam under the outer edge (continuous, at the column heads)
        ribbon(Rd, Rn, -1.5, roofOut - 5.2, -1.5, roofOut - 3.6, steel2);
        // lamp banks: three rows of round-faced lamps on each panel (photo 3), real panel spacing; the phone gets one textured quad per panel
        if (low) {
          const lt = textTexture((g, w, h) => { g.fillStyle = '#6f777a'; g.fillRect(0, 0, w, h); for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { g.fillStyle = '#e4ddc4'; g.fillRect(6 + c * 13.6, 6 + r * 19, 10, 14); } }, 128, 64);
          placeAll(new THREE.PlaneGeometry(28, 5).rotateY(Math.PI).translate(0, 0, -0.9), new THREE.MeshBasicMaterial({ map: lt, side: THREE.DoubleSide }), bankPts.map((q) => ({ ...q, off: -3, y: roofIn + 4.4 })));
        } else {
          const lb = [];
          for (let r = -1; r <= 1; r++) for (let c = -4; c <= 4; c++) lb.push([2, 1.5, 0.9, c * 3.1, r * 1.8, -1.25]);
          placeAll(mergeBoxes(lb), lam('#e0dac3'), bankPts.map((q) => ({ ...q, off: -3, y: roofIn + 4.4 })));
        }
      }
      // big plain name lettering on the roof behind home plate, facing outward
      const nameTex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#34425e'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 150px Georgia, serif'; g.fillText('YANKEE STADIUM', w / 2, h / 2);
      }, 1536, 192);
      const nm = ctx.add(new THREE.PlaneGeometry(130, 16.3), new THREE.MeshBasicMaterial({ map: nameTex, transparent: true }));
      const mid = Fd.findIndex((p) => p[0] <= -20 && p[1] > 150);
      const mR = Rd[Math.max(0, mid)];
      nm.position.set(-8, roofOut + 10, mR[1] + 0.3); nm.rotation.y = 0;
    }

    // ---- 3. bleachers colour: already seat-coloured; add the main-level / field-level split line ------------------
    {
      const [lp, ln] = tools.cut(0, 1);
      ribbon(lp, ln, 10, 0.5 + 3.5 * 0.9, 10, 3.9, lam('#e6dec6')); // thin field-level rail
    }

    // ---- 4. center field: black-glass batter's eye over Monument Park, boards, wall panels, poles ---------------------------
    {
      const [p, n, dg] = tools.span(-7, 7);               // block measured on zone_center: x -50..+46 at the wall, ~28 ft deep
      const glass = lam(GLASS), steel = lam('#2c3338'), granite = lam('#5d605f'), granD = lam('#3d4244'), dark = lam('#1a1f23');
      const EYE = 42;                                                    // top of the black glass (photos 4 and 6: glass ~27 ft above a ~15 ft base)
      ctx.add(sweepSolid(p, n, () => [[1.5, 15], [1.5, EYE], [30, EYE], [30, 15]], [0, 1, 0, 2], 0), [glass, steel, dark]);
      // Monument Park: dark granite floor, back wall, curved low wall, columns; plain plaques only
      // glass ribs and floor bands on the eye's field face
      instances(box(0.9, 27, 0.8), lam('#2f3b42'), resample(p, n, 8), () => ({ off: 1.0, y: 28.5 }));
      for (const yy of [22, 30, 38]) ribbon(p, n, 0.9, yy, 0.9, yy + 0.7, lam('#3a474e'));
      ctx.add(sweepSolid(p, n, () => [[1.5, 0], [1.5, 0.6], [28, 0.6], [28, 0]], [0, 0, 0, 0], 0), [lam('#7a7870')]);
      ribbon(p, n, 28, 0.6, 28, 15, granD);
      const colSm = resample(p, n, 22);
      instances(box(2.4, 15, 2.4), steel, colSm, () => ({ off: 27, y: 7.5 }));
      instances(box(2.4, 15, 2.4), steel, colSm, () => ({ off: 3, y: 7.5 }));
      ctx.add(sweepSolid(tools.span(-5, 5)[0], tools.span(-5, 5)[1], () => [[11, 0.6], [11, 3.2], [13.5, 3.2], [13.5, 0.6]], [0, 0, 0, 0], 0), [granite]);   // curved low granite wall
      // plain oval plaques on the back wall and plain sloped plaques along the low wall (no names, no numbers)
      const ovals = resample(p.slice(2, -2), n.slice(2, -2), 9);
      const ovTex = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#e8e4d6'; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 3, h / 2 - 3, 0, 0, 7); g.fill(); g.strokeStyle = '#3c4046'; g.lineWidth = 4; g.stroke(); }, 64, 96);
      placeAll(new THREE.PlaneGeometry(4.2, 6.2), new THREE.MeshBasicMaterial({ map: ovTex, transparent: true }), ovals.map((q) => ({ ...q, off: 27.7, y: 9 })));
      const plq = resample(tools.span(-5, 5)[0], tools.span(-5, 5)[1], 7);
      placeAll(box(3.6, 0.3, 2.6), lam('#2a3036'), plq.map((q) => ({ ...q, off: 9.5, y: 1.2, rx: -0.45 })));

      // ---- scoreboards (photos 4, 6, 10; sizes from the published 59 x 101 ft video board and the photo-6 pixel ratios at the same plane)
      // Boards stand on a ring of radius RB around home plate on the centre-field structure: video board x -8..+93 ft (59 ft tall),
      // left group x -187..-15 (three blank panels, 38 ft tall), right group x +95..+205 (three blank panels, 40 ft tall). All bottoms at 50 ft.
      const RB = 455, YB = 50;
      const blank = (w, h, base, slots, edge) => textTexture((g, W, H) => {
        g.fillStyle = base; g.fillRect(0, 0, W, H); g.strokeStyle = edge; g.lineWidth = 6; g.strokeRect(5, 5, W - 10, H - 10);
        g.strokeStyle = edge; g.lineWidth = 2; const [cx, cy] = slots;
        for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) g.strokeRect(14 + i * (W - 28) / cx + 2, 14 + j * (H - 28) / cy + 2, (W - 28) / cx - 4, (H - 28) / cy - 4);
      }, 512, Math.round(512 * h / w));
      const steelM = lam('#3b4448'), steelD = lam('#262d30');
      const stl = [];                                        // merged steel boxes in world space: [w, h, d, x, y, z, rotY]
      const world = (list) => {
        const pos = [], nor = [], mm = new THREE.Matrix4(), qq = new THREE.Quaternion(), ax = new THREE.Vector3(0, 1, 0);
        for (const [w, h, d, x, y, z, ry] of list) {
          const g = box(w, h, d).toNonIndexed(); mm.compose(new THREE.Vector3(x, y, z), qq.setFromAxisAngle(ax, ry || 0), new THREE.Vector3(1, 1, 1)); g.applyMatrix4(mm);
          pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array);
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g;
      };
      // a board face made of segments along the ring (each segment is a flat quad facing home), one texture; returns the mesh
      const faceOn = (x0, x1, h, tex, nseg) => {
        const pos = [], uv = [], idx = [], thetas = [];
        for (let k = 0; k <= nseg; k++) { const x = x0 + (x1 - x0) * k / nseg, th = Math.asin(x / RB); thetas.push(th); const px = RB * Math.sin(th), pz = -RB * Math.cos(th); pos.push(px, YB, pz, px, YB + h, pz); uv.push(k / nseg, 0, k / nseg, 1); if (k) { const a = (k - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
        return ctx.add(g, new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      };
      // structure behind a board: back frame, top and bottom chords, vertical ribs, a catwalk with a rail, and support columns to the roof deck
      const frameFor = (x0, x1, h) => {
        const nseg = Math.max(1, Math.round((x1 - x0) / 30));
        for (let k = 0; k < nseg; k++) {
          const xa = x0 + (x1 - x0) * k / nseg, xb = x0 + (x1 - x0) * (k + 1) / nseg, xm = (xa + xb) / 2, th = Math.asin(xm / RB), len = (xb - xa) / Math.cos(th) + 0.4;
          const cx = RB * Math.sin(th), cz = -RB * Math.cos(th), ry = -th, nx = -Math.sin(th), nz = Math.cos(th);   // nx,nz: toward home
          // local frame: u along the board (right = +x rotated), dn = depth behind the face
          const put = (u, dn, y, w, hh, d) => { const ux = Math.cos(th), uz = Math.sin(th); stl.push([w, hh, d, cx + ux * u - nx * dn, y, cz + uz * u - nz * dn, ry]); };
          put(0, 1.6, YB + h + 0.6, len, 1.2, 3.2);                           // top chord / roof of the frame
          put(0, 1.6, YB - 0.6, len, 1.2, 3.2);                               // bottom chord
          put(0, 2.8, YB + h / 2, len, h, 0.7);                               // back plate
          put(-len / 2 + 0.4, 1.6, YB + h / 2, 0.9, h, 3);                    // end posts
          if (!low) for (let r = 1; r < 3; r++) put(-len / 2 + (len * r) / 3, 2.0, YB + h / 2, 0.5, h, 1.6);   // ribs (skipped on the phone)
        }
      };
      const videoTex = blank(101, 59, '#141f2a', [1, 1], '#9aa6a8'), leftTex = blank(172, 38, '#4a3a36', [3, 1], '#cfc6aa'), rightTex = blank(110, 40, '#2e4658', [3, 1], '#cfc6aa');
      const vid = faceOn(-8, 93, 59, videoTex, 4);
      faceOn(-187, -15, 38, leftTex, 6); faceOn(95, 205, 40, rightTex, 4);
      frameFor(-8, 93, 59); frameFor(-187, -15, 38); frameFor(95, 205, 40);
      // support columns: from the eye roof (x inside the block) or the stand roofs below; every ~34 ft, with a cross brace row at the catwalk
      const addCols = (x0, x1, yBase) => { const n = Math.max(2, Math.round((x1 - x0) / 34) + 1); for (let k = 0; k < n; k++) { const x = x0 + (x1 - x0) * k / (n - 1), th = Math.asin(x / RB), hgt = YB - 0.6 - yBase; const nx = -Math.sin(th), nz = Math.cos(th); stl.push([2.2, hgt, 2.2, RB * Math.sin(th) - nx * 3.4, yBase + hgt / 2, -RB * Math.cos(th) - nz * 3.4, -th]); } };
      addCols(-8, 46, EYE); addCols(50, 93, 30); addCols(-187, -52, 30); addCols(95, 205, 30);
      // catwalks under each board with a post-and-rail
      const walk = (x0, x1) => { const nseg = Math.max(1, Math.round((x1 - x0) / 30)); for (let k = 0; k < nseg; k++) { const xm = x0 + (x1 - x0) * (k + 0.5) / nseg, th = Math.asin(xm / RB), len = (x1 - x0) / nseg / Math.cos(th) + 0.4, nx = -Math.sin(th), nz = Math.cos(th), cx = RB * Math.sin(th), cz = -RB * Math.cos(th);
        stl.push([len, 0.5, 5, cx - nx * 1.2, YB - 2.2, cz - nz * 1.2, -th]); stl.push([len, 0.35, 0.35, cx + nx * 1.6, YB - 2.2 + 3.4, cz + nz * 1.6, -th]); } };
      walk(-8, 93); walk(-187, -15); walk(95, 205);
      ctx.add(world(stl), steelM);
      // plain name lettering above the left group (photos 6 and 10: set on the roof structure above the left board)
      const nameTex = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#c9c2a8'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 110px Georgia, serif'; g.fillText('YANKEE STADIUM', w / 2, h / 2); }, 1024, 160);
      { const th = Math.asin(-100 / RB); const nm = ctx.add(new THREE.PlaneGeometry(110, 10.9), new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, side: THREE.DoubleSide })); nm.position.set(RB * Math.sin(th), YB + 38 + 8, -RB * Math.cos(th)); nm.rotation.y = -th; }
      // extra flagpoles on the centre-field structure (two groups of three, plain cloth)
      { const poles = [], cl = []; for (const x of [-210, -190, -170, 120, 140, 160]) { const th = Math.asin(x / RB); poles.push({ x: RB * Math.sin(th), z: -RB * Math.cos(th), nx: -Math.sin(th), nz: Math.cos(th) }); }
        instances(new THREE.CylinderGeometry(0.3, 0.3, 24, 5), lam('#e9e4d2'), poles, () => ({ off: -2, y: 62 }));
        placeAll(new THREE.PlaneGeometry(7, 4.5).translate(3.7, 0, 0), lam('#c9bfa2'), poles.map((q) => ({ ...q, off: -2, y: 71 }))); }
      ctx.parts.scoreboard = vid;

      // blank sponsor-style panels on the outfield wall: muted colors, blank slot in each (instanced, with per-instance color)
      const cols = ['#7b3f37', '#2f4e69', '#6d6a44', '#4a4f52', '#8a6a3a', '#35574a'];
      const [wp, wn, wd] = tools.span(-45, 45);
      const wsm = resample(wp, wn, 31).filter((q, k) => { const dgv = Math.atan2(q.x, -q.z) / tools.D2R; return Math.abs(dgv) > 7.5 && Math.abs(dgv) < 43; });
      const slotTex = textTexture((g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); }, 128, 32);
      const pm = new THREE.InstancedMesh(new THREE.PlaneGeometry(15, 3.6), new THREE.MeshBasicMaterial({ map: slotTex, side: THREE.DoubleSide }), wsm.length);
      const mm = new THREE.Matrix4(), qq = new THREE.Quaternion(), upv = new THREE.Vector3(0, 1, 0), c = new THREE.Color();
      wsm.forEach((q, k) => {
        const dgv = Math.atan2(q.x, -q.z) / tools.D2R, hw = wallH(dgv);
        qq.setFromAxisAngle(upv, Math.atan2(-q.nx, -q.nz));                                    // face the field
        mm.compose(new THREE.Vector3(q.x - q.nx * 0.5, Math.max(2.4, hw - 3.0), q.z - q.nz * 0.5), qq, new THREE.Vector3(1, Math.min(1, (hw - 1) / 6), 1));
        pm.setMatrixAt(k, mm); pm.setColorAt(k, c.set(cols[k % cols.length]));
      });
      pm.instanceMatrix.needsUpdate = true; pm.instanceColor.needsUpdate = true; G.add(pm);

      // foul poles: yellow, ~ 80 ft (photos 6, 7, 10: tip reaches the terrace/upper deck level)
      ctx.parts.poles.forEach((pl) => { pl.scale.y = 80 / 60; pl.position.y = 40; pl.material = lam('#d7c24a'); });
      // flagpoles on the roof edge near each pole (plain cloth, no marks)
      const fl = resample(Fd, Fn, 150).filter((q) => q.z < 150);
      instances(new THREE.CylinderGeometry(0.35, 0.35, 26, 6), lam('#e9e4d2'), fl, () => ({ off: -2, y: roofIn + 12 }));
      placeAll(new THREE.PlaneGeometry(8, 5).translate(4.2, 0, 0), lam('#d6ccb0'), fl.map((q, k) => ({ ...q, off: -2, y: roofIn + 22, u: 0 })));
    }

    // ---- 5. limestone facade: 3 storeys (base + door level, arched windows, small paired windows), pilasters, gate pavilions ------
    // Heights (photos 5 and 8, door ~8 ft as the scale, cross-checked with 3 storeys of ~14 ft): wall 52 ft to the cornice top, pavilions 66 ft;
    // arches start at 13.5 ft and end at ~37 ft; small windows at 40..44 ft. Bay pitch about 14.5 ft (photo 5: pier to pier = 66 px, door = 38 px / 8 ft).
    {
      const { out: sm, L } = loopSamples(Cd.filter((_, i) => true), 1.5);
      const nb = Math.round(L / 14.5), pitch = L / nb;
      const Hf = (z) => 40 + 12 * sstep(-400, -320, z);               // 52 ft on the foul side, 40 ft behind the outfield
      const HP = 14;                                                  // pavilion rises 14 ft above the wall
      const H = sm.map((p) => Hf(p.z));
      const stone = lam(STONE), stoneD = lam(STONE_D), cornice = lam('#c6bda2'), dark = lam('#232b30');
      // wall body, granite base course, cornice
      const wallGeo = (o0, y0f, o1, y1f, mat) => {
        const pos = [], idx = [];
        sm.forEach((p, i) => { pos.push(p.x + p.nx * o0, y0f(i), p.z + p.nz * o0, p.x + p.nx * o1, y1f(i), p.z + p.nz * o1); const a = i * 2, b = ((i + 1) % sm.length) * 2; idx.push(a, a + 1, b, a + 1, b + 1, b); });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return ctx.add(g, mat);
      };
      wallGeo(0, () => 0, 0, (i) => H[i], stone);                                  // outer face
      wallGeo(-5, (i) => H[i], 0, (i) => H[i], stone);                              // top
      wallGeo(0.6, () => 0, 0.6, () => 10, stoneD);                                 // granite base course (photo 8: ~10 ft)
      wallGeo(0.6, () => 10, 1.6, () => 10, stoneD);
      // cornice: flat cap on a recessed band (photo 8), a belt course under the arches and one over them
      const sub = (k) => { const ix = []; for (let i = 0; i < sm.length; i += k) ix.push(i); ix.push(0); return ix; };      // sub-sample (sweepSolid spreads arrays: keep them small)
      const profile = (k, fn, mats) => { const ix = sub(k); ctx.add(sweepSolid(ix.map((i) => [sm[i].x, sm[i].z]), ix.map((i) => [sm[i].nx, sm[i].nz]), (j) => fn(H[ix[j]]), mats, 0), [cornice]); };
      profile(5, (h) => [[0, h - 6.0], [1.0, h - 6.0], [1.0, h - 4.4], [2.0, h - 4.4], [2.0, h - 3.0], [2.8, h - 3.0], [2.8, h + 0.9], [0, h + 0.9]], [0, 0, 0, 0, 0, 0, 0, -1]);
      profile(8, (h) => { const y = 12.2; return [[0, y - 0.7], [1.5, y - 0.7], [1.5, y + 0.7], [0, y + 0.7]]; }, [0, 0, 0, -1]);       // belt course at the arch springs
      profile(8, (h) => { const y = h - 9.2; return [[0, y - 0.6], [1.3, y - 0.6], [1.3, y + 0.6], [0, y + 0.6]]; }, [0, 0, 0, -1]);   // course above the small windows
      wallGeo(-5, () => 0, -5, (i) => H[i], lam('#bdb49a'));                         // inner face
      // gate pavilion positions: nearest sample to each target
      const gateIdx = GATES.map(([x, z]) => { let b = 0, bd = 1e9; sm.forEach((p, i) => { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; b = i; } }); return b; });
      const nearGate = (i) => gateIdx.some((g) => { const d = Math.abs(g - i); return Math.min(d, sm.length - d) * 1.5 < 40; });
      const at = (s) => sm[Math.round((s / L) * sm.length) % sm.length];
      // pilasters at bay boundaries; per bay one arched window (two panes, transoms), a pair of small square windows above, a door in every second bay
      const piers = [], wins = [], sq = [], doors = [];
      for (let k = 0; k < nb; k++) {
        const pb = at(k * pitch), pc = at((k + 0.5) * pitch), idxc = Math.round(((k + 0.5) * pitch / L) * sm.length) % sm.length, h = H[idxc], f = h / 52;
        if (nearGate(idxc)) continue;
        piers.push({ ...pb, off: 0.7, y: 10 + (h - 12) / 2, sy: (h - 12) / 40 });
        wins.push({ ...pc, off: 0.2, y: 13.5, sy: f });
        if (h > 46) { sq.push({ ...pc, u: -1.7, off: 0.2, y: h - 12.6 }); sq.push({ ...pc, u: 1.7, off: 0.2, y: h - 12.6 }); }
        if (k % 2 === 0) doors.push({ ...pc, u: 0, off: 0.2, y: 0 });
      }
      placeAll(box(2.6, 40, 1.8), stone, piers);
      const archG = new THREE.ShapeGeometry(windowShape(5.2, 23.5));
      const dglass = lam('#2f3c45');
      placeAll(archG, dglass, wins);
      // mullions and transoms: one instanced frame per window (centre mullion + transoms), stone-grey
      const frameMat = lam('#98a09b');
      const archFrame = mergeBoxes([[0.4, 21, 0.3, 0, 10.5, 0], ...(low ? [11] : [4, 8, 12, 16, 20]).map((y) => [5.2, 0.35, 0.3, 0, y, 0])]);
      placeAll(archFrame, frameMat, wins.map((w) => ({ ...w, off: 0.5 })));
      placeAll(new THREE.PlaneGeometry(2.3, 3.2).translate(0, 1.6, 0), dglass, sq.map((q) => ({ ...q, y: q.y - 1.6 })));
      placeAll(new THREE.PlaneGeometry(4.6, 8.2).translate(0, 4.1, 0), dglass, doors);
      // gate pavilions (photos 5, 8): 58 ft wide stone block, 14 ft above the wall, three tall arches (pitch ~9 ft), slab cap, plain roundels, gold name
      const pavH = (i) => Hf(sm[i].z) + HP;
      placeAll(box(58, 1, 12), stone, gateIdx.map((i) => ({ ...sm[i], off: 5, y: pavH(i) / 2, sy: pavH(i) })));
      placeAll(box(60, 1.6, 14), cornice, gateIdx.map((i) => ({ ...sm[i], off: 5.2, y: pavH(i) - 0.8 })));
      placeAll(box(60, 10, 13), stoneD, gateIdx.map((i) => ({ ...sm[i], off: 5.2, y: 5 })));
      const tall = [];
      gateIdx.forEach((i) => { const p = sm[i]; [-9, 0, 9].forEach((u) => tall.push({ ...p, u, off: 11.2, y: 13.5, sy: 31 / 40 })); });
      placeAll(new THREE.ShapeGeometry(windowShape(6.2, 40)), lam('#1d252a'), tall);
      const tallFrame = mergeBoxes([[0.45, 38, 0.3, 0, 19.5, 0], ...(low ? [14] : [5, 10, 15, 20, 25, 30, 35]).map((y) => [6.2, 0.4, 0.3, 0, y, 0])]);
      placeAll(tallFrame, lam('#98a09b'), tall.map((t) => ({ ...t, off: 11.55, sy: t.sy })));
      // recessed panel above the arches with a plain horizontal course (photo 8)
      placeAll(box(31, 2.2, 1), cornice, gateIdx.map((i) => ({ ...sm[i], off: 11.6, y: 13.5 + 31 + 1.6 })));
      // gate doors: three pairs of glass doors with frames and a flat canopy
      const gd = []; gateIdx.forEach((i) => [-9, 0, 9].forEach((u) => gd.push({ ...sm[i], u, off: 11.5, y: 0.2 })));
      placeAll(new THREE.PlaneGeometry(6.2, 9).translate(0, 4.5, 0), lam('#1b2429'), gd);
      placeAll(mergeBoxes([[0.35, 9, 0.4, -3.1, 4.5, 0], [0.35, 9, 0.4, 3.1, 4.5, 0], [0.35, 9, 0.4, 0, 4.5, 0], [6.4, 0.35, 0.4, 0, 9, 0]]), lam('#aeb4ac'), gd.map((d) => ({ ...d, off: 11.7 })));
      placeAll(box(32, 0.9, 8), lam('#c7bfa6'), gateIdx.map((i) => ({ ...sm[i], off: 15, y: 11.6 })));
      placeAll(box(0.5, 2, 0.5), lam('#8c948f'), gateIdx.flatMap((i) => [-14, 14].map((u) => ({ ...sm[i], u, off: 18.5, y: 10.6 }))));
      // pavilion cap slab
      placeAll(box(64, 1.4, 16), cornice, gateIdx.map((i) => ({ ...sm[i], off: 5.6, y: pavH(i) + 0.9 })));
      // plain round roundels beside the name (blank discs), gold name over the arches
      placeAll(new THREE.CircleGeometry(2.6, 20), lam('#bdb497'), gateIdx.flatMap((i) => [-26, 26].map((u) => ({ ...sm[i], u, off: 11.2, y: pavH(i) - 6.2 }))));
      const goldTex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#c9a23c'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 120px Georgia, serif'; g.fillText('YANKEE STADIUM', w / 2, h / 2);
      }, 1536, 192);
      placeAll(new THREE.PlaneGeometry(40, 5), new THREE.MeshBasicMaterial({ map: goldTex, transparent: true }), gateIdx.map((i) => ({ ...sm[i], off: 11.4, y: pavH(i) - 8.8 })));
      // gate number on the canopy of the gate behind home plate (photo 8)
      const gtex = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#22334f'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 150px Georgia, serif'; g.fillText('GATE 4', w / 2, h / 2); }, 768, 192);
      placeAll(new THREE.PlaneGeometry(9, 2.25), new THREE.MeshBasicMaterial({ map: gtex, transparent: true }), [{ ...sm[gateIdx[0]], off: 11.9, y: 12.4 }]);
    }


    // ---- 5b. perimeter fence and stair / ramp towers --------------------------------------------------------------------------------
    {
      const { out: sm, L } = loopSamples(Cd, 2);
      // black iron fence on the sidewalk side, 7 ft high, alpha-cut bars (one ribbon)
      const ftx = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#14181b'; g.fillRect(0, h * 0.12, w, h * 0.05); g.fillRect(0, h * 0.8, w, h * 0.06); for (let k = 0; k < 4; k++) g.fillRect(w * (0.06 + k * 0.25), 0, w * 0.06, h); g.fillRect(w * 0.0, 0, w * 0.04, h); }, 64, 64);
      ftx.wrapS = THREE.RepeatWrapping;
      const pos = [], uv = [], idx = []; let acc = 0;
      sm.forEach((q, i) => { if (i) acc += Math.hypot(q.x - sm[i - 1].x, q.z - sm[i - 1].z); const o = 24; pos.push(q.x + q.nx * o, 0, q.z + q.nz * o, q.x + q.nx * o, 7, q.z + q.nz * o); uv.push(acc / 8, 0, acc / 8, 1); const a = i * 2, b = ((i + 1) % sm.length) * 2; if (i < sm.length - 1) idx.push(a, a + 1, b, a + 1, b + 1, b); });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
      ctx.add(g, new THREE.MeshBasicMaterial({ map: ftx, alphaTest: 0.5, side: THREE.DoubleSide }));
      // stair / ramp towers: stone shafts with a dark glazed slot, projecting past the facade (positions estimated between the gates)
      const TW = [[100, 268], [-108, 250], [281, 103], [372, -100], [-348, -100], [-231, 100], [352, -300], [-325, -385]];
      const items = TW.map(([x, z]) => { let b = 0, bd = 1e9; sm.forEach((q, i) => { const d = Math.hypot(q.x - x, q.z - z); if (d < bd) { bd = d; b = i; } }); return sm[b]; });
      const hh = (q) => 40 + 12 * sstep(-400, -320, q.z) + 10;
      placeAll(box(22, 1, 17), lam(STONE), items.map((q) => ({ ...q, off: 6, y: hh(q) / 2, sy: hh(q) })));
      placeAll(box(24, 2.2, 19), lam('#cbc2a6'), items.map((q) => ({ ...q, off: 6, y: hh(q) + 1.1 })));
      // glazed slot: narrow, mid-grey glass (not black) cut by pale transoms every ~11 ft, so it reads as a window strip
      placeAll(box(3.2, 1, 0.5), lam('#62737a'), items.map((q) => ({ ...q, off: 14.55, y: hh(q) * 0.56, sy: hh(q) * 0.66 })));
      const trs = []; items.forEach((q) => { const h = hh(q); for (let y = h * 0.23 + 5; y < h * 0.89; y += 11) trs.push({ ...q, off: 14.8, y }); });
      placeAll(box(3.8, 0.55, 0.7), lam('#cbc2a6'), trs);
      placeAll(box(0.5, 1, 0.7), lam('#cbc2a6'), items.map((q) => ({ ...q, off: 14.8, y: hh(q) * 0.56, sy: hh(q) * 0.66 })));
      placeAll(box(23, 8, 18), lam(STONE_D), items.map((q) => ({ ...q, off: 6, y: 4 })));
    }

    // ---- 6. concourse / Great Hall flat roofs between the canopy and the facade ------------------------------------------
    {
      const C = Cd, nR = Rd.length, pos = [], idx = [], pos2 = [];
      const raise = (x, z) => (x > 20 && z > -10 && z < 235 ? 60 : conY);          // Great Hall roof on the 1B side
      let n = 0;
      for (let i = 0; i < nR; i++) {
        const f = Fd[i], r = Rd[i]; let dx = r[0] - f[0], dz = r[1] - f[1]; const l = Math.hypot(dx, dz); dx /= l; dz /= l;
        let t = 6; while (t < 160 && inPoly(r[0] + dx * t, r[1] + dz * t, C)) t += 1.5;
        const y = raise(r[0], r[1]), a = [r[0] + dx * 2.5, r[1] + dz * 2.5], b = [r[0] + dx * (t - 2), r[1] + dz * (t - 2)];
        pos.push(a[0], y, a[1], b[0], y, b[1]);
        if (i) { const q = (i - 1) * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      ctx.add(g, lam('#e7e4da'));
      // low parapets on the Great Hall step and a few rooftop mechanical boxes
      const rn = normalsOf(Rd, false), boxes = resample(Rd, rn, 46).filter((p) => p.z < 260);
      instances(box(14, 5, 9), lam('#cfcabb'), boxes, (p, k) => ({ off: 8 + (k % 2) * 9, y: raise(p.x, p.z) + 2.5 }));
    }

    // ---- 7. elevated rail line past the right-field / center-field side (measured on the wide sheet) ------------------------
    {
      const pts = []; for (let k = 0; k <= 30; k++) { const t = k / 30; pts.push([RAIL[0][0] + (RAIL[1][0] - RAIL[0][0]) * t, RAIL[0][1] + (RAIL[1][1] - RAIL[0][1]) * t]); }
      const dx = RAIL[1][0] - RAIL[0][0], dz = RAIL[1][1] - RAIL[0][1], dl = Math.hypot(dx, dz);
      const nrm = pts.map(() => [dz / dl, -dx / dl]);                      // points away from the stadium (up-right)
      const girder = lam('#3b4a44'), gird2 = lam('#56665e'), rail = lam('#2a2e30'), W = 24;
      ctx.add(sweepSolid(pts, nrm, () => [[-W, 34], [-W, 39], [W, 39], [W, 34]], [0, 1, 0, 1], 0), [girder, gird2]);
      for (const s of [-1, 1]) ctx.add(sweepSolid(pts, nrm, () => [[s * W, 34], [s * W, 43], [s * W + 0.8, 43], [s * W + 0.8, 34]], [0, 0, 0, 0], 0), [gird2]);
      const rl = []; for (const s of [-15, -5, 5, 15]) rl.push(ctx.add(sweepSolid(pts, nrm, () => [[s - 0.3, 39], [s - 0.3, 40], [s + 0.3, 40], [s + 0.3, 39]], [0, 0, 0, 0], 0), [rail]));
      const sm = resample(pts, nrm, 45);
      for (const o of [-20, 20]) instances(box(2.4, 34, 2.4), lam('#46564e'), sm, () => ({ off: o, y: 17 }));
      instances(box(50, 2.5, 2.6), lam('#46564e'), sm, () => ({ off: 0, y: 33 }));
      const cars = resample(pts, nrm, 52).slice(12, 17);
      instances(box(9, 12, 46), lam('#b9bcb4'), cars, () => ({ off: -10, y: 46 }));
    }

    // single-material meshes (including generic bases, poles, mounds, tarp) render in one call: drop their groups
    G.traverse((o) => { if (o.isMesh && !Array.isArray(o.material) && o.geometry.groups.length > 1) o.geometry.clearGroups(); });

    // ---- camera stops --------------------------------------------------------------------------------------------
    ctx.views.exterior = { pos: [250, 70, 420], look: [10, 50, 280], label: 'Gate & Facade' };
    ctx.views.friezeView = { pos: ctx.tools.foulAt(0.78, d0 + 30, h0 + 45).toArray(), look: [60, roofIn - 6, 175], label: 'Frieze & Roof' };
    ctx.views.eyeView = { pos: [-70, 40, -290], look: [0, 18, -430], label: 'Eye & Monuments' };
  },
};
