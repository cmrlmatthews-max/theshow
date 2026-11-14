// Oracle Park (San Francisco Giants) detail module, refined from the survey sheet and photographs.
//
// MEASURED from survey_tight.png / survey_wide.png (home plate = origin, feet):
//  - Outfield wall: LF pole (-240,-240); straight LF wall to the left-center corner (-110,-391); flat center-field run at
//    z ~ -391..-397; Triples Alley corner (~108,-397); one straight brick run to the RF pole (218,-218).
//    (Old table had corners 35-60 ft off; the LCF/RCF "posted" numbers 399/415 are kept at the two corners, not at the sign angles.)
//  - Exterior facade line (table F): LF-corner block (-382,-348), west facade x ~ -425 (z -250..-100), 3B-side arc, main
//    plaza corner (-255,87), rear z ~ +186 behind home, 1B/King-St corner (165,118), then the cove-side arcade
//    along (213,50) (242,0) (256,-60) (262,-140) to the RF end (252,-215), length ~ 360 ft.
//  - Seawall / cove edge table S: (255,-254) (295,-170) (345,-54) (389,53) (415,115), runs ~25 deg off the z axis.
//  - Upper deck: from the LF pole around home to z ~ -150 on the first-base side (stops short of the RF corner; the RF side
//    has only the low arcade and the arcade-top seats).
//  - Seat depth to the facade is computed per boundary sample by casting a ray to table F (3B side ~230-270 ft, behind home ~130 ft,
//    1B side ~150 ft); the generic decks are removed and rebuilt with that depth.
// FROM PHOTOS: red brick piers and tall dark multi-pane windows, cream stone base and bands, dark green steel above the brick,
//  cream arcade with 27 arches (13 ft bays), thin roof band over the back rows of the upper deck with a press-level strip,
//  clock towers (square brick shaft, round clock, dark green pyramid roof), tall dark lattice light towers, scoreboard tower pair.
// SECOND PASS (detail level 2):
//  MEASURED from zone_home / zone_center: dugout roofs (~52 x 9 ft, centered ~68 ft out on each foul line), bullpen pits and
//   bleacher blocks behind the center-field wall (left pen x -84..-50, right pen x 72..104, z about -444..-398), batter's eye
//   width (~55 ft), section-aisle spacing (~30 ft lower bowl, ~40 ft upper deck).
//  FROM PHOTOS: three levels (lower bowl with a cross-aisle, club/suite glass band, upper deck; Clem's page: 36/12/25 rows),
//   thin roof band, press glass behind home, net behind the plate, RF wall 20 ft (Clem, andrewclem.com/Baseball/OraclePark.html),
//   bullpens behind the CF wall either side of the open garden (mlb.com press release on the relocated bullpens),
//   window grids with transoms, stepped cornice, steel X-bracing above the brick, stair and ramp towers, gate grilles, flags.
//  ESTIMATED: cross-aisle position (58% of the lower depth), riser 7 ft, suite band ~10 ft, tunnel size, net height (36 ft),
//   dugout height, pen wall height, bleacher heights, panel colors, stair/ramp tower positions, flag count, foul pole height (75 ft).
// STILL ESTIMATED: all heights (brick 74 ft, steel top 108 ft, arcade 34 ft, upper-deck top ~80-100 ft), the second
//  (small) tower position, gate pavilion positions, the LF corner block shape, seawall ends beyond z -254 / +115, boat/palm placement,
//  glove position, bay rhythm (16 ft), roof depth (26 ft band).  No bottle slide, no logos; the name is plain text only.
export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 339, h: 8 },
        { deg: -15.7, r: 406, h: 8 },    // left-center corner (-110,-391)
        { deg: 15.2, r: 412, h: 8 },     // Triples Alley corner (~108,-397)
        { deg: 15.25, r: 412, h: 20 },   // brick wall begins
        { deg: 45, r: 309, h: 24 },      // right-field pole
      ],
      foulScale: 1,
      backstop: 56,
      // generic values only place the stock camera stops; the real decks are rebuilt in build()
      lower: { depth: 70, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 22, rise: 22, depth: 66, slope: 0.6, extent: [0.2, 1] },
      outfield: { depth: 60, slope: 0.4, spans: [[-45, -16, 62, 0.4]], eye: [-4.4, 4.4], eyeHeight: 26, eyeDepth: 14 },
      skip: { upperDeck: true, canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#254a38', facade: '#9a5a42', wall: '#2c4636', cream: '#e8dcbc' },
    };
  },

  build(ctx) {
    const { THREE, G, add, lam, dims, tools, M, MAT, parts, spec, paths } = ctx;
    const { sweepSolid, textTexture, wallXZ, wallR, wallH, D2R } = tools;
    const { bPts, bN } = paths;
    const N1 = bPts.length - 1;
    const brick = '#9a5c44', brickDk = '#84493a', cream = '#e8dcbc', stone = '#d8cba6', dark = '#241a15', steel = '#2f4136', conc = '#b9ae94';
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v3 = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1);
    const basic = (c, extra) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });
    const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const lerp = (a, b, t) => a + (b - a) * t;

    // ============================ measured tables ============================
    // exterior facade line, LF corner -> around home -> RF end (x, z)
    const F = [[-382, -348], [-425, -250], [-428, -180], [-410, -100], [-370, -30], [-300, 55], [-210, 120], [-110, 165], [0, 186],
      [100, 168], [165, 118], [213, 50], [242, 0], [256, -60], [262, -140], [252, -215]];
    const K_ARC = 10;                                    // vertex where the cream arcade starts (165,118)
    // seawall (cove edge)
    const S = [[68, -640], [132, -500], [186, -385], [255, -254], [295, -170], [345, -54], [389, 53], [415, 115], [440, 175]];

    // ---- resample F every ~6 ft with outward normals
    const Pf = [], Nf = [], Sf = [];
    {
      let acc = 0;
      for (let k = 0; k < F.length - 1; k++) {
        const [ax, az] = F[k], [bx, bz] = F[k + 1], L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / 6));
        for (let j = 0; j < n; j++) { const u = j / n; Pf.push([lerp(ax, bx, u), lerp(az, bz, u)]); Sf.push(acc + L * u); }
        acc += L;
      }
      Pf.push([...F[F.length - 1]]); Sf.push(acc);
      for (let k = 0; k < Pf.length; k++) {
        const a = Pf[Math.max(0, k - 2)], b = Pf[Math.min(Pf.length - 1, k + 2)];
        let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * (Pf[k][0] - 0) + nz * (Pf[k][1] + 120) < 0) { nx = -nx; nz = -nz; }
        Nf.push([nx, nz]);
      }
    }
    const sArc = (() => { let a = 0; for (let k = 0; k < K_ARC; k++) a += Math.hypot(F[k + 1][0] - F[k][0], F[k + 1][1] - F[k][1]); return a; })();
    const sTot = Sf[Sf.length - 1];
    const at = (s) => {                                   // point on the facade at arc length s
      s = Math.min(sTot, Math.max(0, s));
      let k = 0; while (k < Sf.length - 2 && Sf[k + 1] < s) k++;
      const u = (s - Sf[k]) / Math.max(1e-6, Sf[k + 1] - Sf[k]);
      const nx = lerp(Nf[k][0], Nf[k + 1][0], u), nz = lerp(Nf[k][1], Nf[k + 1][1], u), l = Math.hypot(nx, nz) || 1;
      return { x: lerp(Pf[k][0], Pf[k + 1][0], u), z: lerp(Pf[k][1], Pf[k + 1][1], u), nx: nx / l, nz: nz / l, yaw: Math.atan2(nx, nz) };
    };

    // generic quad strip between two 3D point lists
    const strip = (A, B, mat) => {
      const pos = [], idx = [];
      for (let k = 0; k < A.length; k++) { pos.push(A[k].x, A[k].y, A[k].z, B[k].x, B[k].y, B[k].z); if (k) { const a = (k - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return add(g, mat);
    };
    // vertical band along the facade samples k0..k1: heights y0..y1, shifted outward by o0..o1
    const band = (k0, k1, y0, y1, o0, o1, mat) => {
      const A = [], B = [];
      for (let k = k0; k <= k1; k++) { const [x, z] = Pf[k], [nx, nz] = Nf[k]; A.push(new THREE.Vector3(x + nx * o0, y0, z + nz * o0)); B.push(new THREE.Vector3(x + nx * o1, y1, z + nz * o1)); }
      return strip(A, B, mat);
    };
    const kArc = Sf.findIndex((s) => s >= sArc - 1e-6);

    // ============================ ray from the seating front to the facade ============================
    const cross = (ax, az, bx, bz) => ax * bz - az * bx;
    const Traw = new Array(N1 + 1).fill(NaN), Hs = new Array(N1 + 1).fill(0);
    for (let i = 0; i <= N1; i++) {
      const [px, pz] = bPts[i], [nx, nz] = bN[i];
      let best = Infinity, bs = 0;
      for (let k = 0; k < F.length - 1; k++) {
        const [ax, az] = F[k], ex = F[k + 1][0] - ax, ez = F[k + 1][1] - az, den = cross(nx, nz, ex, ez);
        if (Math.abs(den) < 1e-6) continue;
        const s = cross(ax - px, az - pz, ex, ez) / den, u = cross(ax - px, az - pz, nx, nz) / den;
        if (s > 5 && u >= 0 && u <= 1 && s < best) { best = s; bs = k + u; }
      }
      if (best < Infinity) {
        Traw[i] = best;
        let a = 0; const kk = Math.floor(bs); for (let k = 0; k < kk; k++) a += Math.hypot(F[k + 1][0] - F[k][0], F[k + 1][1] - F[k][1]);
        Hs[i] = a + (bs - kk) * Math.hypot(F[kk + 1][0] - F[kk][0], F[kk + 1][1] - F[kk][1]);
      }
    }
    // fill gaps from the nearest valid sample, then smooth
    for (let i = 0; i <= N1; i++) if (isNaN(Traw[i])) {
      let j = i; while (j >= 0 && isNaN(Traw[j])) j--;
      let k = i; while (k <= N1 && isNaN(Traw[k])) k++;
      const a = j >= 0 ? j : k, b = k <= N1 ? k : j; Traw[i] = (Traw[a] + Traw[b]) / 2; Hs[i] = Hs[a] ?? 0;
    }
    const T = Traw.map((_, i) => { let s = 0, c = 0; for (let j = -5; j <= 5; j++) { const k = Math.min(N1, Math.max(0, i + j)); s += Math.min(Traw[k], Traw[i] * 1.12); c++; } return Math.min(s / c, Traw[i] * 1.05); });
    // arcade weight 0..1 by where the ray hits the facade
    const arcW = Hs.map((h) => sstep(sArc - 50, sArc + 25, h));
    // per-sample deck profile
    const prof = [];
    for (let i = 0; i <= N1; i++) {
      const gap = lerp(14, 40, arcW[i]);
      const dEnd = Math.max(95, T[i] - gap);
      const dl = Math.min(105, Math.max(66, 0.4 * (T[i] - gap)));
      const d0 = dl - 22, h0 = 3.5 + 0.3 * d0 + 28;   // 28 ft: club/suite glass band between the decks
      const hTop = Math.min(102, h0 + 0.62 * (dEnd - d0));
      const sU = (hTop - h0) / Math.max(10, dEnd - d0);
      const dm = 0.58 * dl, hm = 3.5 + 0.28 * dm;            // cross-aisle: flat walk with a 7 ft riser (tunnel wall) behind it
      const lowTop = hm + 7 + 0.3 * (dl - dm - 5);
      prof.push({ dl, d0, h0, dEnd, hTop, sU, lowTop, gap, dm, hm });
    }
    // upper deck range: starts where the ray meets the facade at z >= -150 on the 1B side
    let iR = 0;
    for (let i = 0; i <= N1; i++) { const hx = bPts[i][1] + bN[i][1] * T[i]; if (hx >= -150) { iR = i; break; } }
    const iL = N1;
    const deckY = (i, d) => {                              // seat surface height at offset d
      const p = prof[i];
      if (d < p.d0) return d < p.dm ? 3.5 + 0.28 * d : p.hm + 7 + 0.3 * (d - p.dm - 5);
      return p.h0 + p.sU * (Math.min(d, p.dEnd) - p.d0);
    };
    const at3 = (i, d, y) => new THREE.Vector3(bPts[i][0] + bN[i][0] * d, y, bPts[i][1] + bN[i][1] * d);

    // ============================ decks (rebuild) ============================
    ctx.remove(parts.lowerDeck); ctx.remove(parts.upperDeck); ctx.remove(parts.canopy);
    {
      add(sweepSolid(bPts.slice(), bN.slice(), (i) => { const p = prof[i]; return [[0, 0], [0, 3.5], [p.dm, p.hm], [p.dm + 5, p.hm], [p.dm + 5, p.hm + 7], [p.dl, p.lowTop], [p.dl, 0]]; },
        [MAT.WALL, MAT.SEAT, MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.WALL, -1], MAT.WALL), M);
      add(sweepSolid(bPts.slice(iR, iL + 1), bN.slice(iR, iL + 1), (j) => { const p = prof[j + iR]; return [[p.d0, p.h0 - 7], [p.d0, p.h0], [p.dEnd, p.hTop], [p.dEnd, 0], [p.dl, 0], [p.dl, p.h0 - 7]]; },
        [MAT.CREAM, MAT.SEAT, MAT.WALL, -1, MAT.SHADE, MAT.SHADE], MAT.WALL), M);
      // press level: dark glazed strip on the back of the upper deck behind home
      const ia = Math.round(0.4 * N1), ib2 = Math.round(0.6 * N1);
      add(sweepSolid(bPts.slice(ia, ib2 + 1), bN.slice(ia, ib2 + 1), (j) => { const p = prof[j + ia]; return [[p.dEnd - 30, p.hTop], [p.dEnd - 30, p.hTop + 14], [p.dEnd, p.hTop + 14], [p.dEnd, p.hTop]]; },
        [MAT.SHADE, MAT.WALL, MAT.WALL, -1], MAT.WALL), M);
    }

    // ============================ bowl detail: aisles, tunnels, suite glass, press glass ============================
    const cum = [0]; for (let i = 1; i <= N1; i++) cum.push(cum[i - 1] + Math.hypot(bPts[i][0] - bPts[i - 1][0], bPts[i][1] - bPts[i - 1][1]));
    const stations = (i0, i1, sp, off = 0) => { const r = []; let nx = cum[i0] + off; for (let i = i0; i <= i1; i++) if (cum[i] >= nx) { r.push(i); nx += sp; } return r; };
    const upV = new THREE.Vector3(0, 1, 0);
    const orient = (pos, zdir, sx, sy, sz) => {          // matrix for a unit box whose z axis follows zdir
      const z = zdir.clone().normalize(), x = new THREE.Vector3().crossVectors(upV, z); if (x.lengthSq() < 1e-6) x.set(1, 0, 0);
      x.normalize(); const y = new THREE.Vector3().crossVectors(z, x);
      q.setFromRotationMatrix(m4.makeBasis(x, y, z)); return m4.compose(pos, q, sc.set(sx, sy, sz));
    };
    {
      const aisles = [], tunnels = [], portals = [];
      const lowSt = stations(2, N1 - 2, 30, 14);          // lower-bowl section aisles, ~30 ft apart (counted on the sheets)
      lowSt.forEach((i, n) => {
        const p = prof[i], hasU = i >= iR;
        const yA = (d) => 3.5 + 0.28 * d + 0.18, yB = (d) => p.hm + 7 + 0.3 * (d - p.dm - 5) + 0.18;
        aisles.push([at3(i, 1.5, yA(1.5)), at3(i, p.dm - 0.5, yA(p.dm - 0.5))]);
        const e2 = hasU ? Math.min(p.dl, p.d0) - 0.5 : p.dl - 0.5;
        if (e2 > p.dm + 8) aisles.push([at3(i, p.dm + 5.5, yB(p.dm + 5.5)), at3(i, e2, yB(e2))]);
        if (n % 2 === 0) tunnels.push(i);
      });
      const upSt = stations(iR, iL - 1, 40, 6);           // upper-deck aisles, ~40 ft apart
      upSt.forEach((i, n) => {
        const p = prof[i];
        aisles.push([at3(i, p.d0 + 1.2, p.h0 + 0.18), at3(i, p.dEnd - 0.5, p.hTop + 0.18)]);
        if (n % 2 === 0) portals.push(i);
      });
      const aMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), lam('#d9cfae'), aisles.length);
      aisles.forEach(([a, b], k) => { orient(v3.addVectors(a, b).multiplyScalar(0.5), new THREE.Vector3().subVectors(b, a), 1.7, 0.3, a.distanceTo(b)); aMesh.setMatrixAt(k, m4); });
      G.add(aMesh);
      // entry tunnels: dark openings in the cross-aisle riser (lower bowl) and under the roof band (upper deck)
      const tMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(6.5, 6.4, 1.3), lam('#14100d'), tunnels.length + portals.length);
      let tk = 0;
      tunnels.forEach((i) => { const p = prof[i], c = at3(i, p.dm + 4.6, p.hm + 3.4); q.setFromEuler(e.set(0, Math.atan2(bN[i][0], bN[i][1]), 0)); m4.compose(c, q, sc.set(1, 1, 1)); tMesh.setMatrixAt(tk++, m4); });
      portals.forEach((i) => { const p = prof[i], c = at3(i, p.dEnd - 0.7, p.hTop + 3.4); q.setFromEuler(e.set(0, Math.atan2(bN[i][0], bN[i][1]), 0)); m4.compose(c, q, sc.set(1, 1, 1)); tMesh.setMatrixAt(tk++, m4); });
      G.add(tMesh);
      // lintels above the lower tunnels
      const lMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(8.4, 0.9, 1.6), lam(cream), tunnels.length);
      tunnels.forEach((i, k) => { const p = prof[i], c = at3(i, p.dm + 4.5, p.hm + 6.9); q.setFromEuler(e.set(0, Math.atan2(bN[i][0], bN[i][1]), 0)); m4.compose(c, q, sc.set(1, 1, 1)); lMesh.setMatrixAt(k, m4); });
      G.add(lMesh);

      // club / suite level: glass band between the lower bowl and the upper deck, with cream mullions
      const glass = lam('#3d5963');
      const A = [], B = [];
      for (let i = iR; i <= iL; i++) { const p = prof[i]; A.push(at3(i, p.dl - 0.3, p.lowTop + 0.6)); B.push(at3(i, p.dl - 0.3, p.h0 - 7.2)); }
      strip(A, B, glass);
      const mulSt = stations(iR, iL, 7, 0);
      const mul = new THREE.InstancedMesh(new THREE.BoxGeometry(0.7, 1, 0.7), lam(cream), mulSt.length);
      mulSt.forEach((i, k) => { const p = prof[i], y0 = p.lowTop + 0.6, y1 = p.h0 - 7.2; m4.compose(at3(i, p.dl - 0.6, (y0 + y1) / 2), q.identity(), sc.set(1, y1 - y0, 1)); mul.setMatrixAt(k, m4); });
      sc.set(1, 1, 1); G.add(mul);
      // sill and header bands
      const S0 = [], S1 = [];
      for (let i = iR; i <= iL; i++) { const p = prof[i]; S0.push(at3(i, p.dl - 0.6, p.lowTop + 0.5)); S1.push(at3(i, p.dl - 0.6, p.lowTop + 1.9)); }
      strip(S0, S1, lam(cream));
      // press level: glass front on the dark box behind home, with mullions
      const ia = Math.round(0.4 * N1), ib2 = Math.round(0.6 * N1);
      const P0 = [], P1 = [];
      for (let i = ia; i <= ib2; i++) { const p = prof[i]; P0.push(at3(i, p.dEnd - 30.3, p.hTop + 1.2)); P1.push(at3(i, p.dEnd - 30.3, p.hTop + 12.6)); }
      strip(P0, P1, glass);
      const pst = stations(ia, ib2, 6, 0);
      const pm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, 11.4, 0.6), lam(cream), pst.length);
      pst.forEach((i, k) => { const p = prof[i]; m4.compose(at3(i, p.dEnd - 30.6, p.hTop + 6.9), q.identity(), sc.set(1, 1, 1)); pm.setMatrixAt(k, m4); });
      G.add(pm);
    }

    // LF corner block: stands behind the left-field pole out to the facade corner
    {
      const p = prof[N1], rear = [bPts[N1][0] + bN[N1][0] * p.dEnd, bPts[N1][1] + bN[N1][1] * p.dEnd];
      const wn = [-0.74, -0.67], w1 = [-240 + wn[0] * 66, -240 + wn[1] * 66];
      const pts = [[-240, -240], rear, [-410, -100], [-428, -180], [-425, -250], [-382, -348], w1];
      // terraced block: three stacked prisms shrinking toward the back corner
      const cxz = [-405, -235];
      [[1, 26], [0.78, 44], [0.55, 62]].forEach(([k, hh]) => {
        const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(cxz[0] + (x - cxz[0]) * k, -(cxz[1] + (z - cxz[1]) * k))));
        add(new THREE.ExtrudeGeometry(sh, { depth: hh, bevelEnabled: false }).rotateX(-Math.PI / 2), lam(k === 1 ? '#254a38' : '#2b5340'));
      });
    }

    // ============================ exterior facade ============================
    const matBrick = lam(brick), matStone = lam(stone), matSteel = lam(steel), matCream = lam(cream);
    band(0, kArc, 0, 9, 0.6, 0.6, matStone);
    band(0, kArc, 9, 74, 0, 0, matBrick);
    band(0, kArc, 38, 41, 0, 1.0, matCream);
    // profiled cornice: stepped cream bands (soffit, cyma, fascia, drip cap)
    const pband = (k0, k1, pts, mat) => { for (let j = 0; j + 1 < pts.length; j++) band(k0, k1, pts[j][0], pts[j + 1][0], pts[j][1], pts[j + 1][1], mat); };
    pband(0, kArc, [[70.2, 0.0], [71.2, 0.7], [72.4, 0.7], [72.4, 2.1], [75.4, 2.1], [75.9, 2.9], [77, 2.9], [77, 0]], matCream);
    pband(0, kArc, [[8.6, 0.6], [9.6, 1.5], [11.0, 1.5], [11.0, 0.6]], matStone);     // base string course
    pband(0, kArc, [[55.5, 0], [56.3, 0.8], [57.4, 0.8], [57.4, 0]], matCream);       // upper string course
    band(0, kArc, 77, 108, -2, -2, matSteel);
    pband(0, kArc, [[104.5, -2], [105.5, 0.2], [107.5, 0.2], [108.2, 1.4], [109.2, 1.4], [109.2, -2]], matCream);
    // cove-side arcade: cream, 34 ft, with plinth, cornice and flat roof
    band(kArc, Pf.length - 1, 0, 3, 0.6, 0.6, matStone);
    band(kArc, Pf.length - 1, 3, 34, 0, 0, matCream);
    band(kArc, Pf.length - 1, 33, 37, 1.5, 2.5, matCream);
    {
      const A = [], B = [];
      for (let k = kArc; k < Pf.length; k++) { const [x, z] = Pf[k], [nx, nz] = Nf[k]; A.push(new THREE.Vector3(x, 34, z)); B.push(new THREE.Vector3(x - nx * 34, 34, z - nz * 34)); }
      strip(A, B, lam('#8d8470'));
    }
    // piers + windows (brick part)
    const bayW = 16;
    const nBays = Math.floor(sArc / bayW);
    const bayS = (k) => (k + 0.5) * (sArc / nBays);
    {
      const piers = new THREE.InstancedMesh(new THREE.BoxGeometry(3.4, 66, 2.4), lam(brickDk), nBays + 1);
      // tall window: dark glass, 3 columns of small panes, mullions, a heavier transom at 1/5 height and a cream sill/head
      const wtex = textTexture((g, w, h) => {
        g.fillStyle = '#1b2528'; g.fillRect(0, 0, w, h); g.strokeStyle = '#51625f'; g.lineWidth = 2;
        for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(i * w / 6, 0); g.lineTo(i * w / 6, h); g.stroke(); }
        for (let j = 1; j < 24; j++) { g.beginPath(); g.moveTo(0, j * h / 24); g.lineTo(w, j * h / 24); g.stroke(); }
        g.strokeStyle = '#b7a67e'; g.lineWidth = 5; for (const x of [w / 3, 2 * w / 3]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        g.lineWidth = 7; g.beginPath(); g.moveTo(0, h * 0.2); g.lineTo(w, h * 0.2); g.stroke(); g.beginPath(); g.moveTo(0, h * 0.62); g.lineTo(w, h * 0.62); g.stroke();
        g.lineWidth = 8; g.strokeRect(1, 1, w - 2, h - 2);
      }, 128, 512);
      const wins = new THREE.InstancedMesh(new THREE.PlaneGeometry(8.5, 46), new THREE.MeshBasicMaterial({ map: wtex, side: THREE.DoubleSide }), nBays);
      for (let k = 0; k <= nBays; k++) {
        const p = at(k * (sArc / nBays));
        m4.compose(v3.set(p.x + p.nx * 0.4, 38, p.z + p.nz * 0.4), q.setFromEuler(e.set(0, p.yaw, 0)), sc); piers.setMatrixAt(k, m4);
        if (k < nBays) { const c = at(bayS(k)); m4.compose(v3.set(c.x + c.nx * 0.5, 33, c.z + c.nz * 0.5), q.setFromEuler(e.set(0, c.yaw, 0)), sc); wins.setMatrixAt(k, m4); }
      }
      G.add(piers); G.add(wins);
    }
    {
      const sh = new THREE.Shape(); const w = 4.3, hr = 9;
      sh.moveTo(-w, 0); sh.lineTo(-w, hr); sh.absarc(0, hr, w, Math.PI, 0, true); sh.lineTo(w, 0); sh.lineTo(-w, 0);
      const arcLen = sTot - sArc, nA = Math.round(arcLen / 13);
      const arches = new THREE.InstancedMesh(new THREE.ShapeGeometry(sh, 8), basic('#3a2e27'), nA);
      const lint = new THREE.InstancedMesh(new THREE.PlaneGeometry(4, 3.2), basic('#5b5446'), nA);
      for (let k = 0; k < nA; k++) {
        const p = at(sArc + (k + 0.5) * arcLen / nA); q.setFromEuler(e.set(0, p.yaw, 0));
        m4.compose(v3.set(p.x + p.nx * 0.5, 3, p.z + p.nz * 0.5), q, sc); arches.setMatrixAt(k, m4);
        m4.compose(v3.set(p.x + p.nx * 0.5, 26.5, p.z + p.nz * 0.5), q, sc); lint.setMatrixAt(k, m4);
      }
      G.add(arches); G.add(lint);
    }
    // gate pavilions (brick blocks with cream cap and a dark arched door)
    const gates = [0.06 * sArc, 0.37 * sArc, 0.7 * sArc, 0.93 * sArc];
    {
      const pav = new THREE.InstancedMesh(new THREE.BoxGeometry(46, 84, 12), lam(brick), gates.length);
      const cap = new THREE.InstancedMesh(new THREE.BoxGeometry(50, 5, 15), lam(cream), gates.length);
      const door = new THREE.InstancedMesh(new THREE.PlaneGeometry(13, 22), basic('#241a15'), gates.length);
      gates.forEach((s, k) => {
        const p = at(s), o = 5;
        q.setFromEuler(e.set(0, p.yaw, 0));
        m4.compose(v3.set(p.x + p.nx * o, 42, p.z + p.nz * o), q, sc); pav.setMatrixAt(k, m4);
        m4.compose(v3.set(p.x + p.nx * o, 86, p.z + p.nz * o), q, sc); cap.setMatrixAt(k, m4);
        m4.compose(v3.set(p.x + p.nx * (o + 6.2), 11, p.z + p.nz * (o + 6.2)), q, sc); door.setMatrixAt(k, m4);
      });
      G.add(pav); G.add(cap);
    }

    // ---- facade parts: dentils, steel bracing, stair and ramp towers, gate doors and fences
    {
      const nD = Math.floor(sArc / 4.5), dent = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 1.6, 1.6), matCream, nD);
      for (let k = 0; k < nD; k++) { const p = at((k + 0.5) * sArc / nD); m4.compose(v3.set(p.x + p.nx * 0.9, 70.9, p.z + p.nz * 0.9), q.setFromEuler(e.set(0, p.yaw, 0)), sc); dent.setMatrixAt(k, m4); }
      G.add(dent);
      // dark green steel above the brick: portal frame with X bracing, one panel per bay
      const xt = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.strokeStyle = '#4e6a58'; g.lineWidth = 5; g.strokeRect(2, 2, w - 4, h - 4);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
        g.fillStyle = '#10181a'; g.fillRect(w * 0.22, h * 0.34, w * 0.56, h * 0.3);
      }, 128, 128);
      const xb = new THREE.InstancedMesh(new THREE.PlaneGeometry(15.4, 29), new THREE.MeshBasicMaterial({ map: xt, transparent: true, side: THREE.DoubleSide }), nBays);
      for (let k = 0; k < nBays; k++) { const c = at(bayS(k)); m4.compose(v3.set(c.x - c.nx * 1.4, 92.5, c.z - c.nz * 1.4), q.setFromEuler(e.set(0, c.yaw, 0)), sc); xb.setMatrixAt(k, m4); }
      G.add(xb);
      // stair towers: brick box, glazed stair slot, cream cap (positions on the 3B / home-plate side, read from photo1)
      const stairS = [0.2 * sArc, 0.58 * sArc];
      const stTex = textTexture((g, w, h) => {
        g.fillStyle = '#1b2528'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6d8279'; g.lineWidth = 3;
        for (let y = 0; y < h; y += 28) { g.beginPath(); g.moveTo(0, y + 22); g.lineTo(w, y); g.stroke(); }
        g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
      }, 64, 256);
      stairS.forEach((s0) => {
        const p = at(s0), tw = new THREE.Group(); G.add(tw); tw.position.set(p.x + p.nx * 9, 0, p.z + p.nz * 9); tw.rotation.y = p.yaw;
        const bx = add(new THREE.BoxGeometry(17, 70, 15), matBrick, tw); bx.position.y = 35;
        const slot = add(new THREE.PlaneGeometry(9, 56), new THREE.MeshBasicMaterial({ map: stTex }), tw); slot.position.set(0, 36, 7.6);
        const cp = add(new THREE.BoxGeometry(19, 2.4, 17), matCream, tw); cp.position.y = 71.2;
        const bs = add(new THREE.BoxGeometry(19, 8, 17), matStone, tw); bs.position.y = 4;
      });
      // ramp tower: round brick drum with cream bands (photo1, west side)
      {
        const p = at(0.31 * sArc), dr = new THREE.Group(); G.add(dr); dr.position.set(p.x + p.nx * 14, 0, p.z + p.nz * 14);
        const body = add(new THREE.CylinderGeometry(15, 15, 62, 24), matBrick, dr); body.position.y = 31;
        [14, 30, 46].forEach((y) => { const b = add(new THREE.CylinderGeometry(15.8, 15.8, 1.6, 24), matCream, dr); b.position.y = y; });
        const cap = add(new THREE.CylinderGeometry(16.6, 16.6, 2.4, 24), matCream, dr); cap.position.y = 63;
        const rf = add(new THREE.ConeGeometry(14, 6, 24), lam('#2e4a3b'), dr); rf.position.y = 67;
      }
      // gate doors (iron grille in an arch) and gate fences in front of each pavilion
      const gTex = textTexture((g, w, h) => {
        g.fillStyle = '#181210'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a8168'; g.lineWidth = 3;
        for (let x = 6; x < w; x += 10) { g.beginPath(); g.moveTo(x, h * 0.18); g.lineTo(x, h); g.stroke(); }
        g.lineWidth = 5; g.beginPath(); g.moveTo(0, h * 0.5); g.lineTo(w, h * 0.5); g.stroke(); g.beginPath(); g.arc(w / 2, h * 0.3, w / 2 - 2, Math.PI, 0); g.stroke();
      }, 128, 192);
      const fTex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.strokeStyle = '#25302a'; g.lineWidth = 3;
        for (let x = 4; x < w; x += 8) { g.beginPath(); g.moveTo(x, 6); g.lineTo(x, h); g.stroke(); }
        g.lineWidth = 5; g.beginPath(); g.moveTo(0, 8); g.lineTo(w, 8); g.stroke(); g.beginPath(); g.moveTo(0, h - 6); g.lineTo(w, h - 6); g.stroke();
      }, 256, 64);
      const gd = new THREE.InstancedMesh(new THREE.PlaneGeometry(13, 22), new THREE.MeshBasicMaterial({ map: gTex, side: THREE.DoubleSide }), gates.length);
      const gf = new THREE.InstancedMesh(new THREE.PlaneGeometry(40, 8), new THREE.MeshBasicMaterial({ map: fTex, transparent: true, side: THREE.DoubleSide }), gates.length * 2);
      gates.forEach((s0, k) => {
        const p = at(s0); q.setFromEuler(e.set(0, p.yaw, 0));
        m4.compose(v3.set(p.x + p.nx * 11.3, 11.2, p.z + p.nz * 11.3), q, sc); gd.setMatrixAt(k, m4);
        m4.compose(v3.set(p.x + p.nx * 20, 4, p.z + p.nz * 20), q, sc); gf.setMatrixAt(k, m4);
        const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, p.yaw + Math.PI / 2, 0));
        m4.compose(v3.set(p.x + p.nx * 20 + p.nz * 20, 4, p.z + p.nz * 20 - p.nx * 20), q2, sc.set(0.5, 1, 1)); gf.setMatrixAt(gates.length + k, m4); sc.set(1, 1, 1);
      });
      G.add(gd); G.add(gf);
    }

    // clock towers: square brick shaft, round clock, dark green pyramid roof
    const clockTex = textTexture((g, w, h) => {
      g.fillStyle = cream; g.fillRect(0, 0, w, h); g.strokeStyle = '#2b2118'; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, h / 2, w * 0.42, 0, 7); g.stroke();
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * w * 0.33, h / 2 - Math.cos(a) * w * 0.33); g.lineTo(w / 2 + Math.sin(a) * w * 0.39, h / 2 - Math.cos(a) * w * 0.39); g.stroke(); }
      g.lineWidth = 10; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + 40, h / 2 - 60); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 - 20, h / 2 + 90); g.stroke();
    }, 256, 256);
    const tower = (s, size, hgt, off) => {
      const p = at(s), tw = new THREE.Group(); G.add(tw);
      tw.position.set(p.x + p.nx * off, 0, p.z + p.nz * off); tw.rotation.y = p.yaw;
      const shaft = add(new THREE.BoxGeometry(size, hgt, size), matBrick, tw); shaft.position.y = hgt / 2;
      const plinth = add(new THREE.BoxGeometry(size + 2, 10, size + 2), matStone, tw); plinth.position.y = 5;
      for (const y of [hgt * 0.4, hgt * 0.72]) { const b = add(new THREE.BoxGeometry(size + 1.6, 1.8, size + 1.6), matCream, tw); b.position.y = y; }
      const yc = hgt - size * 0.55;
      for (let k = 0; k < 4; k++) {
        const face = add(new THREE.PlaneGeometry(size * 0.62, size * 0.62), new THREE.MeshBasicMaterial({ map: clockTex, side: THREE.DoubleSide }), tw);
        const a = k * Math.PI / 2; face.position.set(Math.sin(a) * (size / 2 + 0.2), yc, Math.cos(a) * (size / 2 + 0.2)); face.rotation.y = a;
      }
      const eaves = add(new THREE.BoxGeometry(size + 3, 2.4, size + 3), matCream, tw); eaves.position.y = hgt + 1;
      const roof = add(new THREE.ConeGeometry(size * 0.78, size * 0.95, 4).rotateY(Math.PI / 4), lam('#2e4a3b'), tw); roof.position.y = hgt + 2.4 + size * 0.475;
      const spire = add(new THREE.CylinderGeometry(0.2, 0.5, 8, 6), lam('#2b3a30'), tw); spire.position.y = hgt + size * 0.95 + 6;
      return p;
    };
    const kMain = Pf.findIndex(([x, z]) => Math.hypot(x + 255, z - 87) < 6);
    const sMain = kMain >= 0 ? Sf[kMain] : 0.42 * sArc;
    const pMain = tower(sMain, 22, 122, 3);                     // main-gate clock tower
    tower(sArc - 8, 17, 96, 3);                                 // small corner tower at the King St / cove corner
    // name sign (plain text) on the brick beside the main tower
    {
      const tex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#c99a58'; g.font = 'bold 120px Rockwell, Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ORACLE PARK', w / 2, h / 2);
      }, 1024, 160);
      const sign = add(new THREE.PlaneGeometry(88, 13.75), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
      const p = at(sMain + 62); sign.position.set(p.x + p.nx * 2.2, 90, p.z + p.nz * 2.2); sign.rotation.y = p.yaw;
    }

    // ============================ roof band ============================
    {
      const A = [], B = [], C = [];
      for (let i = iR; i <= iL; i++) {
        const p = prof[i], w = arcW[i], tOut = p.dEnd + 8;
        const inner = at3(i, p.dEnd - 26, p.hTop + 17);
        const outerF = at3(i, T[i], 112), outerA = at3(i, tOut, p.hTop + 12);
        A.push(inner); B.push(new THREE.Vector3().lerpVectors(outerF, outerA, w));
        C.push(at3(i, p.dEnd - 26, p.hTop + 12));
      }
      strip(A, B, lam('#3a4a40'));                             // roof deck, dark green
      strip(A, C, lam('#2b3a30'));                             // front fascia
      // rafters every ~4 samples and thin columns at the front edge
      const cnt = Math.floor((iL - iR) / 4);
      const beams = new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 1.6, 1), lam('#242c27'), cnt);
      const cols = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 1, 1.8), lam('#242c27'), cnt);
      for (let k = 0; k < cnt; k++) {
        const j = Math.min(A.length - 1, k * 4), a = A[j], b = B[j], len = a.distanceTo(b);
        m4.compose(v3.copy(a).add(b).multiplyScalar(0.5).setY((a.y + b.y) / 2 - 1.2), q.setFromEuler(e.set(0, Math.atan2(b.x - a.x, b.z - a.z), 0)), sc.set(1, 1, len)); beams.setMatrixAt(k, m4);
        const top = prof[j + iR].hTop, h = a.y - 2 - top;
        m4.compose(v3.set(a.x, top + h / 2, a.z), q.identity(), sc.set(1, h, 1)); cols.setMatrixAt(k, m4);
      }
      sc.set(1, 1, 1);
      G.add(beams); G.add(cols);
    }

    // ============================ lattice light towers (instanced bars) ============================
    const bars = [], lamps = [];
    const bar = (a, b, th) => bars.push([a.clone(), b.clone(), th]);
    // dark green steel framing on the back of the upper deck where no facade hides it (cove side): posts, bands, X braces
    for (let i = iR; i < iL - 4; i += 4) {
      if (arcW[i] < 0.25 || arcW[i + 4] < 0.25) continue;
      const a = prof[i], b = prof[i + 4];
      const a0 = at3(i, a.dEnd + 0.8, 36), a1 = at3(i, a.dEnd + 0.8, a.hTop), b0 = at3(i + 4, b.dEnd + 0.8, 36), b1 = at3(i + 4, b.dEnd + 0.8, b.hTop);
      bar(a0, a1, 1.8);
      bar(a0, b1, 0.8); bar(b0, a1, 0.8);
      const am = at3(i, a.dEnd + 0.8, (36 + a.hTop) / 2), bm2 = at3(i + 4, b.dEnd + 0.8, (36 + b.hTop) / 2);
      bar(am, bm2, 1.2);
    }
    const lattice = (cx, cz, y0, hgt, w0, w1, face, nLev) => {
      const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      const co = Math.cos(face), si = Math.sin(face);
      const pt = (sx, sz, y) => { const f = (y - y0) / hgt, w = lerp(w0, w1, f) / 2, lx = sx * w, lz = sz * w; return new THREE.Vector3(cx + lx * co + lz * si, y, cz - lx * si + lz * co); };
      for (const [sx, sz] of cs) bar(pt(sx, sz, y0), pt(sx, sz, y0 + hgt), 1.5);
      for (let l = 0; l <= nLev; l++) {
        const y = y0 + hgt * l / nLev;
        for (let c = 0; c < 4; c++) {
          const [ax, az] = cs[c], [bx2, bz2] = cs[(c + 1) % 4]; bar(pt(ax, az, y), pt(bx2, bz2, y), 0.9);
          if (l < nLev) { const y2 = y0 + hgt * (l + 1) / nLev; bar(pt(ax, az, y), pt(bx2, bz2, y2), 0.7); bar(pt(bx2, bz2, y), pt(ax, az, y2), 0.7); }
        }
      }
    };
    const bank = (cx, cz, y, face, w, h) => lamps.push([cx, y, cz, face, w, h]);
    for (const tt of [0.28, 0.42, 0.62, 0.78]) {
      const i = Math.round(tt * N1), p = prof[i], base = at3(i, p.dEnd - 6, p.hTop + 8), face = Math.atan2(-bN[i][0], -bN[i][1]);
      lattice(base.x, base.z, base.y, 78, 11, 8, face, 6);
      bank(base.x - bN[i][0] * 2, base.z - bN[i][1] * 2, base.y + 86, face, 24, 14);
    }
    // scoreboard flanking towers (center field, behind the batter's eye)
    const bd = -2, br = wallR(spec, bd) + 36, bcx = br * Math.sin(bd * D2R), bcz = -br * Math.cos(bd * D2R);
    {
      const fx = -bcx, fz = -bcz, fl = Math.hypot(fx, fz), rx = fz / fl, rz = -fx / fl, face = Math.atan2(fx, fz);
      for (const sgn of [-1, 1]) {
        const cx = bcx + rx * 62 * sgn, cz = bcz + rz * 62 * sgn;
        lattice(cx, cz, 0, 128, 12, 8, face, 8);
        bank(cx, cz, 138, face, 22, 20);
      }
    }
    {
      const bm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), lam('#33392f'), bars.length), up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
      bars.forEach(([a, b, th], k) => { d.subVectors(b, a); const l = d.length(); q.setFromUnitVectors(up, d.normalize()); m4.compose(v3.addVectors(a, b).multiplyScalar(0.5), q, sc.set(th, l, th)); bm.setMatrixAt(k, m4); });
      G.add(bm);
      const fr = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), lam('#2a2f29'), lamps.length), lm = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), basic('#ece4c4'), lamps.length);
      lamps.forEach(([x, y, z, face, w, h], k) => {
        q.setFromEuler(e.set(0, face, 0)); m4.compose(v3.set(x, y, z), q, sc.set(w + 2, h + 2, 2.6)); fr.setMatrixAt(k, m4);
        m4.compose(v3.set(x + Math.sin(face) * 1.5, y, z + Math.cos(face) * 1.5), q, sc.set(w, h, 1)); lm.setMatrixAt(k, m4);
      });
      sc.set(1, 1, 1);
      G.add(fr); G.add(lm);
    }

    // ============================ right-field wall, arcade seats, manual scoreboard ============================
    const aDeg = 15.25;
    const [bx, bz] = wallXZ(spec, 45), [ax, az] = wallXZ(spec, aDeg);
    const L = Math.hypot(ax - bx, az - bz), ux = (ax - bx) / L, uz = (az - bz) / L;
    let nx = uz, nz = -ux; if (nx * bx + nz * bz < 0) { nx = -nx; nz = -nz; }
    const P = (s, t, y) => new THREE.Vector3(bx + ux * s + nx * t, y, bz + uz * s + nz * t);
    const yaw = Math.atan2(-nx, -nz);
    {
      const [p, n, dg] = tools.span(aDeg, 45);
      const hh = (i) => wallH(spec, dg[i]);
      add(sweepSolid(p, n, (i) => [[-0.4, 0], [-0.4, hh(i)], [3, hh(i)], [3, 0]], [MAT.FACADE, MAT.CREAM, MAT.FACADE, -1], MAT.FACADE), M);
      add(sweepSolid(p, n, (i) => [[-0.4, hh(i)], [-0.4, hh(i) + 3.2], [2.5, hh(i) + 3.2], [20, hh(i) + 3.2 + 7.5], [20, 0], [3, 0]],
        [MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.FACADE, MAT.FACADE, -1], MAT.FACADE), M);
    }
    {
      const sh = new THREE.Shape(); const w = 4.2, hRect = 7.5;
      sh.moveTo(-w, 0); sh.lineTo(-w, hRect); sh.absarc(0, hRect, w, Math.PI, 0, true); sh.lineTo(w, 0); sh.lineTo(-w, 0);
      const n = Math.floor(L / 13);
      const arches = new THREE.InstancedMesh(new THREE.ShapeGeometry(sh, 10), basic(dark), n);
      for (let k = 0; k < n; k++) { const s = 8 + k * ((L - 16) / (n - 1)), pos = P(s, -0.5, 0.2); q.setFromEuler(e.set(0, yaw, 0)); m4.compose(pos, q, sc); arches.setMatrixAt(k, m4); }
      G.add(arches);
    }
    {
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#1f3a2c'; g.fillRect(0, 0, w, h); g.strokeStyle = cream; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
        const rows = 8, cols = 14, mx = 24, my = 24, cw = (w - mx * 2) / cols, ch = (h - my * 2) / rows;
        g.fillStyle = cream;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g.fillRect(mx + c * cw + 3, my + r * ch + 3, cw - 6, ch - 6);
      }, 512, 256);
      const panel = add(new THREE.PlaneGeometry(40, 10), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      panel.position.copy(P(L * 0.5, -0.7, 17)); panel.rotation.y = yaw;
    }

    // ============================ cove, quay and walkway ============================
    {
      // pale walkway between the arcade and the quay
      const poly = [...Pf.slice(kArc).filter((_, k) => k % 4 === 0), [252, -215], [255, -254], [295, -170], [345, -54], [389, 53], [415, 115], [165, 118]];
      const sh = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z)));
      const walk = add(new THREE.ShapeGeometry(sh).rotateX(-Math.PI / 2), lam('#d6c9a8')); walk.position.y = 0.25;
      // quay strip + curb along the seawall
      const A = [], B = [], Cc = [], Dd = [];
      for (const [x, z] of S) { A.push(new THREE.Vector3(x - 30, 0.35, z)); B.push(new THREE.Vector3(x, 0.35, z)); Cc.push(new THREE.Vector3(x, 0.35, z)); Dd.push(new THREE.Vector3(x, 2.4, z)); }
      strip(A, B, lam('#cdbf9f'));
      strip(Cc, Dd, lam(conc));
      // rail posts along the seawall
      const pts = [];
      for (let k = 0; k < S.length - 1; k++) { const [x0, z0] = S[k], [x1, z1] = S[k + 1], l = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(l / 14); for (let j = 0; j < n; j++) pts.push([lerp(x0, x1, j / n), lerp(z0, z1, j / n)]); }
      const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.4, 3.4, 0.4), lam('#2b2723'), pts.length);
      pts.forEach(([x, z], k) => { m4.compose(v3.set(x - 1, 2.1, z), q.identity(), sc); posts.setMatrixAt(k, m4); });
      G.add(posts);
      { const R0 = [], R1 = []; for (const [x, z] of S) { R0.push(new THREE.Vector3(x - 1, 3.5, z)); R1.push(new THREE.Vector3(x - 1, 3.9, z)); } strip(R0, R1, lam('#2b2723'));
        const R2 = [], R3 = []; for (const [x, z] of S) { R2.push(new THREE.Vector3(x - 1, 2.2, z)); R3.push(new THREE.Vector3(x - 1, 2.5, z)); } strip(R2, R3, lam('#2b2723')); }
      // water: polygon east of the seawall
      const wtex = textTexture((g, w, h) => {
        g.fillStyle = '#58808c'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(232,220,188,0.22)'; g.lineWidth = 2;
        for (let i = 0; i < 18; i++) { const y = (i + 0.5) * h / 18; g.beginPath(); g.moveTo(10 + (i % 3) * 30, y); g.lineTo(w * 0.4 + (i % 4) * 20, y + 2); g.stroke(); }
      }, 256, 256);
      wtex.wrapS = wtex.wrapT = THREE.RepeatWrapping; wtex.repeat.set(0.01, 0.01);
      const wpoly = [...S, [1100, 175], [1100, -700], [S[0][0], -700]];
      const wsh = new THREE.Shape(wpoly.map(([x, z]) => new THREE.Vector2(x, -z)));
      const wg = new THREE.ShapeGeometry(wsh); wg.rotateX(-Math.PI / 2);
      const water = add(wg, new THREE.MeshLambertMaterial({ map: wtex })); water.position.y = 0.12;
      // boats: two kayaks and a small motor boat
      const dirS = (() => { const [x0, z0] = S[3], [x1, z1] = S[4]; const l = Math.hypot(x1 - x0, z1 - z0); return [(x1 - x0) / l, (z1 - z0) / l]; })();
      const en = [-dirS[1], dirS[0]]; if (en[0] < 0) { en[0] = -en[0]; en[1] = -en[1]; }
      const rot = Math.atan2(dirS[0], dirS[1]);
      const boat = (k, t, ang, kind) => {
        const [x0, z0] = S[3]; const s = k * 60 - 40;
        const g = new THREE.Group(); G.add(g); g.position.set(x0 + dirS[0] * s + en[0] * t, 0.5, z0 + dirS[1] * s + en[1] * t); g.rotation.y = rot + ang;
        if (kind === 'kayak') {
          const h = add(new THREE.CylinderGeometry(0.9, 0.9, 11, 8).rotateX(Math.PI / 2), lam('#d6b25a'), g); h.scale.set(1, 0.55, 1); h.position.y = 0.5;
        } else {
          const h = add(new THREE.BoxGeometry(7, 2.2, 22), lam('#e5dfcf'), g); h.position.y = 1;
          const cab = add(new THREE.BoxGeometry(5, 3.4, 8), lam('#6f8a93'), g); cab.position.set(0, 3.7, -2);
        }
      };
      boat(0.2, 40, 0.2, 'kayak'); boat(1.1, 70, -0.5, 'kayak'); boat(2, 120, 0.9, 'boat');
    }

    // ============================ plaza and palms at the main gate ============================
    {
      const plaza = add(new THREE.CylinderGeometry(60, 60, 0.5, 32), lam('#d3c6a4')); plaza.position.set(pMain.x + pMain.nx * 62, 0.25, pMain.z + pMain.nz * 62);
      const palms = [];
      for (let k = -5; k <= 5; k++) {
        const p = at(sMain + k * 12), o = 42 + (k % 2 ? 5 : 0);
        palms.push({ x: p.x + p.nx * o, z: p.z + p.nz * o, hgt: 22 + ((k * 7) % 5) });
      }
      const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.7, 1.1, 1, 7), lam('#7d6446'), palms.length);
      const nf = 8, frond = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 0.15, 11), lam('#4d6b3d'), palms.length * nf);
      let fi = 0;
      palms.forEach((p, k) => {
        m4.compose(v3.set(p.x, p.hgt / 2, p.z), q.identity(), sc.set(1, p.hgt, 1)); trunk.setMatrixAt(k, m4);
        for (let f = 0; f < nf; f++) {
          const a = f * Math.PI * 2 / nf + k, tilt = 0.45;
          q.setFromEuler(e.set(tilt, a, 0, 'YXZ'));
          v3.set(Math.sin(a) * 4.8 * Math.cos(tilt) + p.x, p.hgt + 1 - Math.sin(tilt) * 2.4, Math.cos(a) * 4.8 * Math.cos(tilt) + p.z);
          m4.compose(v3, q, sc.set(1, 1, 1)); frond.setMatrixAt(fi++, m4);
        }
      });
      sc.set(1, 1, 1);
      G.add(trunk); G.add(frond);
    }

    // ============================ scoreboard (center field) ============================
    {
      const hw = wallH(spec, bd), bw = 96, bh = 40, y = 78;
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#16221b'; g.fillRect(0, 0, w, h);
        g.strokeStyle = cream; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20);
        g.fillStyle = cream; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = 'bold 84px Rockwell, Georgia, serif'; g.fillText('ORACLE PARK', w / 2, 90);
        g.font = 'bold 34px Rockwell, Georgia, serif';
        const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'H', 'E'], x0 = 360, cw = (w - x0 - 50) / cols.length;
        cols.forEach((c, i) => g.fillText(c, x0 + cw * (i + 0.5), 180));
        ['VISITORS', 'HOME'].forEach((t, row) => {
          const yy = 250 + row * 90; g.textAlign = 'left'; g.fillText(t, 50, yy); g.textAlign = 'center';
          cols.forEach((_, i) => g.strokeRect(x0 + cw * i + 6, yy - 32, cw - 12, 64));
        });
      }, 1024, 448);
      const board = add(new THREE.BoxGeometry(bw, bh, 5), [lam('#2c4636'), lam('#2c4636'), lam('#2c4636'), lam('#2c4636'), new THREE.MeshBasicMaterial({ map: tex }), lam('#2c4636')]);
      board.position.set(bcx, y, bcz); board.lookAt(0, y, 0);
      const cornice = add(new THREE.BoxGeometry(bw + 6, 3, 8), lam(cream), board); cornice.position.y = bh / 2 + 1.5;
      const postH = y - bh / 2, post = add(new THREE.BoxGeometry(bw * 0.8, postH, 4), lam('#2c4636'), board); post.position.set(0, -bh / 2 - postH / 2, -4);
    }

    // ============================ glove behind the left-field bleachers ============================
    const gDeg = -30, gR = wallR(spec, gDeg) + 4 + 62 + 40, gA = gDeg * D2R;
    const gTop = wallH(spec, gDeg) + 3 + 0.4 * 62;
    {
      const g = new THREE.Group(); G.add(g);
      g.position.set(gR * Math.sin(gA), 0, -gR * Math.cos(gA)); g.lookAt(0, 0, 0);
      const plinth = add(new THREE.BoxGeometry(34, gTop - 3, 24), lam(conc), g); plinth.position.y = (gTop - 3) / 2;
      const gl = new THREE.Group(); gl.position.y = gTop - 3; gl.scale.setScalar(1.7); g.add(gl);
      const leather = lam('#8a5a33'), lace = lam('#5b3720');
      const palm = add(new THREE.SphereGeometry(1, 16, 12), leather, gl); palm.scale.set(10, 10, 4); palm.position.y = 9;
      const cuff = add(new THREE.CylinderGeometry(5.2, 4.4, 5, 14), lace, gl); cuff.position.y = 2;
      [[-6.5, -0.12], [-2.2, -0.04], [2.2, 0.04], [6.5, 0.12]].forEach(([x, rz], i) => {
        const len = 12 + (i === 1 || i === 2 ? 2 : 0), f = add(new THREE.CylinderGeometry(1.9, 2.4, len, 10), leather, gl);
        f.position.set(x + rz * -len * 0.4, 14 + len / 2 - 1, 0); f.rotation.z = rz;
        const tip = add(new THREE.SphereGeometry(1.9, 10, 8), leather, gl); tip.position.set(x + rz * -len * 0.9, 14 + len - 1, 0);
      });
      const th = add(new THREE.CylinderGeometry(2.1, 2.7, 12, 10), leather, gl); th.position.set(-11.5, 11, 0); th.rotation.z = -0.9;
      const web = add(new THREE.BoxGeometry(8, 7, 0.8), lace, gl); web.position.set(-8.8, 17, -0.4); web.rotation.z = 0.25;
      const strap = add(new THREE.BoxGeometry(10, 1.2, 4.2), lace, gl); strap.position.set(0, 8, 0.4);
    }

    // ============================ field level ============================
    // taller yellow foul poles (photo6: well above the RF arcade roof)
    parts.poles.forEach((pl) => { pl.scale.y = 1.25; pl.position.y = 37.5; });
    // -- dugouts: low roofed boxes at the seat edge, dark opening toward the field.
    //    Position along the foul line from zone_home: roofs centered ~65-70 ft out from the plate on both lines, ~52 ft long, ~9 ft wide.
    {
      const roofM = lam('#3a4a40'), faceM = basic('#120e0b');
      [-1, 1].forEach((sg) => {
        let bi = 2, bd = 1e9;
        for (let i = 2; i < N1 - 2; i++) {
          const [x, z] = bPts[i]; if (x * sg < 0) continue;
          const u = sg < 0 ? -(x + z) / 1.414 : (x - z) / 1.414, dd = Math.abs(u - 68) + Math.abs(Math.abs(x) - Math.abs(z)) * 0.0;
          if (dd < bd) { bd = dd; bi = i; }
        }
        const [px, pz] = bPts[bi], [nx, nz] = bN[bi];
        let tx = bPts[bi + 2][0] - bPts[bi - 2][0], tz = bPts[bi + 2][1] - bPts[bi - 2][1]; const tl = Math.hypot(tx, tz); tx /= tl; tz /= tl;
        if (tz * -nx + -tx * -nz < 0) { tx = -tx; tz = -tz; }       // local +x must point toward the field (-normal)
        const g = new THREE.Group(); G.add(g);
        g.position.set(px + nx * 3.2, 0, pz + nz * 3.2); g.rotation.y = Math.atan2(tx, tz);
        const body = add(new THREE.BoxGeometry(9, 5.4, 52), lam('#c8bd9c'), g); body.position.y = 2.7;
        const roof = add(new THREE.BoxGeometry(10.2, 0.8, 53.2), roofM, g); roof.position.y = 5.6;
        const hole = add(new THREE.PlaneGeometry(46, 2.6), faceM, g); hole.rotation.y = Math.PI / 2; hole.position.set(4.6, 2.5, 0);
        const rail = add(new THREE.BoxGeometry(0.4, 0.4, 50), lam('#d8cfae'), g); rail.position.set(4.8, 4.6, 0);
      });
    }
    // -- backstop net: transparent mesh on an arc behind the plate, with posts
    {
      const R = 57, a0 = -1.0, a1 = 1.0, nA = 24, y0 = 4, y1 = 36;
      const netTex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(40,44,40,0.5)'; g.lineWidth = 1.5;
        for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke(); }
      }, 64, 64);
      netTex.wrapS = netTex.wrapT = THREE.RepeatWrapping; netTex.repeat.set(24, 5);
      const pos = [], uv = [], idx = [];
      for (let k = 0; k <= nA; k++) { const a = a0 + (a1 - a0) * k / nA, x = R * Math.sin(a), z = R * Math.cos(a); pos.push(x, y0, z, x, y1, z); uv.push(k / nA, 0, k / nA, 1); if (k) { const b = (k - 1) * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); } }
      const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); ng.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); ng.setIndex(idx);
      add(ng, new THREE.MeshBasicMaterial({ map: netTex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
      const npost = 9, posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.3, 38, 6), lam('#3a423d'), npost);
      for (let k = 0; k < npost; k++) { const a = a0 + (a1 - a0) * k / (npost - 1); m4.compose(v3.set((R + 0.6) * Math.sin(a), 19, (R + 0.6) * Math.cos(a)), q.identity(), sc.set(1, 1, 1)); posts.setMatrixAt(k, m4); }
      G.add(posts);
      // top cable
      const top = [], top2 = [];
      for (let k = 0; k <= nA; k++) { const a = a0 + (a1 - a0) * k / nA; top.push(new THREE.Vector3(R * Math.sin(a), 36.2, R * Math.cos(a))); top2.push(new THREE.Vector3(R * Math.sin(a), 36.8, R * Math.cos(a))); }
      strip(top, top2, lam('#1e2723'));
    }
    // -- bullpens beyond the center-field wall, either side of the open garden (zone_center: gray pens with mound clumps)
    {
      const pens = [{ x0: -84, x1: -50, z0: -444, z1: -398 }, { x0: 72, x1: 104, z0: -446, z1: -400 }];
      const wallBox = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), lam('#2c4636'), pens.length * 3);
      const moundM = new THREE.InstancedMesh(new THREE.CylinderGeometry(3.2, 4.4, 1, 12), lam('#a8745a'), pens.length * 2);
      const plateM = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 0.12, 1.3), lam('#f2ecd8'), pens.length * 2);
      let wk = 0, mk = 0;
      pens.forEach(({ x0, x1, z0, z1 }) => {
        const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;
        const floor = add(new THREE.BoxGeometry(w, 0.4, d), lam('#8b6a50')); floor.position.set(cx, 0.2, cz);
        // fence/wall: back and both sides, 4.5 ft; the field-side wall is the outfield wall itself
        [[cx, z0, w, 0.8], [x0, cz, 0.8, d], [x1, cz, 0.8, d]].forEach(([x, z, sx, sz]) => { m4.compose(v3.set(x, 2.5, z), q.identity(), sc.set(sx, 4.6, sz)); wallBox.setMatrixAt(wk++, m4); });
        // two pitching mounds with plates, side by side along the width
        for (let k = 0; k < 2; k++) {
          const mx = x0 + w * (0.3 + 0.4 * k), mz = z0 + d * 0.55;
          m4.compose(v3.set(mx, 0.7, mz), q.identity(), sc.set(1, 0.7, 1)); moundM.setMatrixAt(mk, m4);
          m4.compose(v3.set(mx, 0.5, mz + 3), q.identity(), sc.set(1, 1, 1)); plateM.setMatrixAt(mk++, m4);
        }
        // bench with a small roof along the back wall
        const bench = add(new THREE.BoxGeometry(w * 0.6, 0.6, 1.6), lam('#5b4a38')); bench.position.set(cx, 1.7, z0 + 1.6);
        const bro = add(new THREE.BoxGeometry(w * 0.7, 0.4, 5), lam('#3a4a40')); bro.position.set(cx, 6.6, z0 + 2.4);
      });
      sc.set(1, 1, 1);
      G.add(wallBox); G.add(moundM); G.add(plateM);
      // bleacher terraces overlooking the pens (the white striped blocks on the sheet)
      [[-98, -48, -470, -445], [40, 70, -486, -426], [72, 104, -490, -448]].forEach(([x0, x1, z0, z1]) => {
        const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0, 4); sh.lineTo(z1 - z0, 14); sh.lineTo(z1 - z0, 0);
        const g = new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false });
        g.rotateY(Math.PI / 2); g.translate(x0, 0, 0);                // profile runs along -z (shape x -> -z)
        const bl = add(g, M[MAT.SEAT]); bl.position.set(0, 0, z1); bl.scale.z = 1;
      });
    }
    // -- boards in the walls: plain muted panels with blank slots (no names)
    {
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d8d0b8'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
        g.fillStyle = '#e2dcc6'; for (let i = 0; i < 3; i++) g.fillRect(14 + i * 82, 18, 66, h - 36);
      }, 256, 64);
      const cols = ['#4b6d5a', '#7b5a46', '#55697a', '#8a7a52', '#5e6b52', '#7a4e44'];
      const list = [];
      for (let k = 0; k < 9; k++) list.push(-41 + k * 3.7);              // left-field wall
      for (let k = 0; k < 7; k++) list.push(-11.2 + k * 3.7);            // center / right-center wall (skips the batter's eye)
      const keep = list.filter((dg) => Math.abs(dg) > 5.2 && dg < 15);
      const bp = new THREE.InstancedMesh(new THREE.PlaneGeometry(14, 3.6), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }), keep.length);
      keep.forEach((dg, k) => {
        const [x, z] = wallXZ(spec, dg), [x1, z1] = wallXZ(spec, dg - 0.4), [x2, z2] = wallXZ(spec, dg + 0.4);
        let nx2 = z2 - z1, nz2 = -(x2 - x1); const l = Math.hypot(nx2, nz2); nx2 /= l; nz2 /= l; if (nx2 * x + nz2 * z > 0) { nx2 = -nx2; nz2 = -nz2; }
        const hw = wallH(spec, dg);
        m4.compose(v3.set(x + nx2 * 0.5, Math.max(2.2, hw * 0.55), z + nz2 * 0.5), q.setFromEuler(e.set(0, Math.atan2(nx2, nz2), 0)), sc.set(1, hw < 5 ? 0.7 : 1, 1)); bp.setMatrixAt(k, m4);
        bp.setColorAt(k, new THREE.Color(cols[k % cols.length]));
      });
      sc.set(1, 1, 1); G.add(bp);
    }
    // -- flags: poles with plain pennants on the RF arcade roof and the scoreboard top
    {
      const poles = [];
      for (let k = 0; k < 6; k++) { const pp = P(18 + k * ((L - 36) / 5), 1.2, wallH(spec, 30) + 3.2); poles.push([pp.x, pp.y, pp.z, 24]); }
      for (let k = 0; k < 5; k++) { const x = bcx + (k - 2) * 14, z = bcz + (k - 2) * 0; poles.push([x, 98, z, 12 + (k % 2) * 4]); }
      const pm2 = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.28, 1, 5), lam('#cfc9b4'), poles.length);
      const fl = new THREE.InstancedMesh(new THREE.PlaneGeometry(6, 3.4), basic('#fff', {}), poles.length);
      const fc = ['#b0573a', '#e8dcbc', '#2f5a45', '#c99a58', '#55697a'];
      poles.forEach(([x, y, z, h], k) => {
        m4.compose(v3.set(x, y + h / 2, z), q.identity(), sc.set(1, h, 1)); pm2.setMatrixAt(k, m4);
        m4.compose(v3.set(x + 3.1, y + h - 1.9, z), q.setFromEuler(e.set(0, 0.3 * (k % 3 - 1), 0)), sc.set(1, 1, 1)); fl.setMatrixAt(k, m4); fl.setColorAt(k, new THREE.Color(fc[k % fc.length]));
      });
      G.add(pm2); G.add(fl);
    }

    // ============================ camera stops ============================
    const setView = (key, pos, look, label, extra = {}) => {
      const pa = Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z], la = Array.isArray(look) ? look : [look.x, look.y, look.z];
      ctx.views[key] = { pos: pa, look: la, label, ...extra };
      const v = ctx.views[key]; v.dir = new THREE.Vector3(...v.look).sub(new THREE.Vector3(...v.pos)).normalize();
    };
    const ib = Math.round(0.5 * N1), iu = Math.round(0.62 * N1);
    { const p = prof[ib], d = p.d0 + 4; setView('pressbox', at3(ib, d, deckY(ib, d) + 6), [0, 0, -170], 'Press Box'); }
    { const p = prof[iu], d = p.d0 + (p.dEnd - p.d0) * 0.6; setView('upper', at3(iu, d, deckY(iu, d) + 4.5), [0, 0, -150], 'Upper Deck'); }
    setView('cove', [575, 105, 140], [215, 24, -30], 'Kayak in the Cove');
    setView('glove', [70, 6, -250], [gR * Math.sin(gA), gTop + 8, -gR * Math.cos(gA)], 'Glove & Bleachers', { walk: true });
    setView('plaza', [pMain.x + pMain.nx * 190, 16, pMain.z + pMain.nz * 190], [pMain.x, 70, pMain.z], 'Clock Tower Plaza');
  },
};
