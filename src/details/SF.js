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
      outfield: { depth: 60, slope: 0.4, spans: [[-45, -16, 62, 0.4]], eye: [-7, 7], eyeHeight: 26, eyeDepth: 20 },
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
      const d0 = dl - 22, h0 = 3.5 + 0.3 * d0 + 22;
      const hTop = Math.min(102, h0 + 0.62 * (dEnd - d0));
      const sU = (hTop - h0) / Math.max(10, dEnd - d0);
      prof.push({ dl, d0, h0, dEnd, hTop, sU, lowTop: 3.5 + 0.3 * dl, gap });
    }
    // upper deck range: starts where the ray meets the facade at z >= -150 on the 1B side
    let iR = 0;
    for (let i = 0; i <= N1; i++) { const hx = bPts[i][1] + bN[i][1] * T[i]; if (hx >= -150) { iR = i; break; } }
    const iL = N1;
    const deckY = (i, d) => {                              // seat surface height at offset d
      const p = prof[i];
      if (d < p.d0) return 3.5 + 0.3 * d;
      return p.h0 + p.sU * (Math.min(d, p.dEnd) - p.d0);
    };
    const at3 = (i, d, y) => new THREE.Vector3(bPts[i][0] + bN[i][0] * d, y, bPts[i][1] + bN[i][1] * d);

    // ============================ decks (rebuild) ============================
    ctx.remove(parts.lowerDeck); ctx.remove(parts.upperDeck); ctx.remove(parts.canopy);
    {
      add(sweepSolid(bPts.slice(), bN.slice(), (i) => { const p = prof[i]; return [[0, 0], [0, 3.5], [p.dl, p.lowTop], [p.dl, 0]]; }, [MAT.WALL, MAT.SEAT, MAT.WALL, -1], MAT.WALL), M);
      add(sweepSolid(bPts.slice(iR, iL + 1), bN.slice(iR, iL + 1), (j) => { const p = prof[j + iR]; return [[p.d0, p.h0 - 7], [p.d0, p.h0], [p.dEnd, p.hTop], [p.dEnd, 0], [p.dl, 0], [p.dl, p.h0 - 7]]; },
        [MAT.CREAM, MAT.SEAT, MAT.WALL, -1, MAT.SHADE, MAT.SHADE], MAT.WALL), M);
      // press level: dark glazed strip on the back of the upper deck behind home
      const ia = Math.round(0.4 * N1), ib2 = Math.round(0.6 * N1);
      add(sweepSolid(bPts.slice(ia, ib2 + 1), bN.slice(ia, ib2 + 1), (j) => { const p = prof[j + ia]; return [[p.dEnd - 30, p.hTop], [p.dEnd - 30, p.hTop + 14], [p.dEnd, p.hTop + 14], [p.dEnd, p.hTop]]; },
        [MAT.SHADE, MAT.WALL, MAT.WALL, -1], MAT.WALL), M);
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
    band(0, kArc, 71, 77, 1.5, 2.8, matCream);
    band(0, kArc, 77, 108, -2, -2, matSteel);
    band(0, kArc, 106, 109, -2, 1, matCream);
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
      const wtex = textTexture((g, w, h) => {
        g.fillStyle = '#1b2528'; g.fillRect(0, 0, w, h); g.strokeStyle = '#4b5b5a'; g.lineWidth = 3;
        for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo(i * w / 3, 0); g.lineTo(i * w / 3, h); g.stroke(); }
        for (let j = 1; j < 8; j++) { g.beginPath(); g.moveTo(0, j * h / 8); g.lineTo(w, j * h / 8); g.stroke(); }
        g.strokeStyle = '#b7a67e'; g.lineWidth = 6; g.strokeRect(1, 1, w - 2, h - 2);
      }, 64, 256);
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
      G.add(pav); G.add(cap); G.add(door);
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
