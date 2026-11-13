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
// ESTIMATED: all heights (facade ~78 ft, pavilions ~96 ft, canopy ~ hTop+15), pavilion positions, left side beyond z=-250,
//  facade behind center field, Great Hall extent, rail height, level splits of the seating bowl.
const FRIEZE_C = '#ece6d2', STONE = '#e3dbc3', STONE_D = '#a79e86', GLASS = '#10161c', STEEL = '#4a5a52';

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
      lower: { depth: 62, slope: 0.3, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 8, rise: 26, depth: 66, slope: 0.74, extent: [0, 1] },
      outfield: { depth: 55, slope: 0.45, spans: [[-45, -10], [10, 45]], eye: null },
      skip: { scoreboard: true, canopy: true },
      colors: { seat: '#27466f', facade: STONE, wall: '#1f3350', cream: '#e6dec6' },
    };
  },

  build(ctx) {
    const { THREE, G, dims, tools } = ctx;
    const { sweepSolid, textTexture } = tools;
    const { dL, lowTop, d0, h0, dEnd, hTop } = dims;
    const lam = ctx.lam;
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

    // ---- remove generic parts replaced here: outfield seats get a deeper, variable-depth rebuild ------------------
    ctx.remove(ctx.parts.lights);                    // light banks are rebuilt on the roof edge below
    const [fp, fn] = tools.cut(0, 1);
    const [, , ua, ub] = tools.cut(0, 1);
    const upPts = fp.slice(ua, ub + 1), upN = fn.slice(ua, ub + 1);
    const roofIn = hTop + 18, roofOut = hTop + 12, conY = 50;

    // dense roof edges
    const S = 8;
    const Fd = spline(FRIEZE, S, false), Rd = spline(RFOUT, S, false);
    const Fn = normalsOf(Fd, false);
    const Cd = spline(FACADE, 6, true);
    // outfield stands: depth follows the distance from the wall to the measured roof edge (deep behind the poles, 55 ft in the middle)
    {
      ctx.remove(ctx.parts.outfieldSeats);
      const distF = (x, z) => { let m = 1e9; for (const p of Fd) { const d = Math.hypot(p[0] - x, p[1] - z); if (d < m) m = d; } return m; };
      const wmat = ctx.M;
      for (const [a, b] of [[-45, -10], [10, 45]]) {
        const [p, n, dg] = tools.span(a, b);
        const dep = p.map((q, i) => { const w = sstep(10, 24, Math.abs(dg[i])); return 55 + w * (Math.min(125, Math.max(55, distF(q[0], q[1]) - 8)) - 55); });
        ctx.add(sweepSolid(p, n, (i) => {
          const hw = wallH(dg[i]), dp = dep[i], sl = 0.45 + (dp - 55) / 70 * 0.33;
          return [[1.2, 0], [1.2, hw + 3], [4, hw + 3], [4 + dp, hw + 3 + sl * dp], [4 + dp, 0]];
        }, [0, 2, 1, 3, -1], 3), wmat);
      }
    }

    // ---- 1. suite / terrace band between the main level and the grandstand ---------------------------------------
    {
      const band = ribbon(fp.slice(ua, ub + 1), fn.slice(ua, ub + 1), dL - 0.6, lowTop + 3, dL - 0.6, h0 - 8, lam('#202a30'));
      // cream terrace ledge on top of the main level and mullions every ~14 ft
      const ledge = sweepSolid(upPts, upN, () => [[dL - 7, lowTop + 0.2], [dL - 7, lowTop + 2], [dL, lowTop + 2], [dL, lowTop + 0.2]], [2, 2, 2, 2], 2);
      ctx.add(ledge, ctx.M);
      const mulGeo = new THREE.BoxGeometry(0.8, h0 - 8 - lowTop - 3, 0.8);
      instances(mulGeo, lam('#d8d0b8'), resample(upPts, upN, 14), () => ({ off: dL - 1, y: (lowTop + 3 + h0 - 8) / 2 }));
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
      instances(new THREE.BoxGeometry(2, FH + 4, 2), fasciaMat, posts, () => ({ off: -1, y: roofIn - 3 - FH / 2 + 1 }));
      // light banks on the roof edge: dark panel with a pale frame, every 39 ft (offset half a bay from the posts)
      const banks = resample(Fd, Fn, 39).slice(0, -1).map((p, k, a) => p);
      const bankPts = []; { const sm = resample(Fd, Fn, 19.5); sm.forEach((p, k) => { if (k % 2 === 1) bankPts.push(p); }); }
      instances(new THREE.BoxGeometry(30, 6, 1.6), lam('#80878b'), bankPts, () => ({ off: -3, y: roofIn + 4.4 }));
      instances(new THREE.BoxGeometry(31, 0.9, 2), fasciaMat, bankPts, () => ({ off: -3, y: roofIn + 7.6 }));
      // steel columns + braces under the outer edge, every 39 ft
      const colS = resample(Rd, Rn, 39);
      const colH = roofOut - 4 - conY;
      instances(new THREE.BoxGeometry(2.4, colH, 2.4), lam('#6c7a73'), colS, () => ({ off: -1.5, y: conY + colH / 2 }));
      const brace = [];
      colS.forEach((p) => { const rx = -Math.atan2(14, colH); brace.push({ x: p.x, z: p.z, nx: p.nx, nz: p.nz, off: -8, y: conY + colH / 2 + 2, rx, sy: Math.hypot(14, colH) / colH }); });
      placeAll(new THREE.BoxGeometry(1.5, colH, 1.5), lam('#6c7a73'), brace);
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

    // ---- 4. center field: black-glass batter's eye over Monument Park, and the scoreboard ---------------------
    {
      const [p, n, dg] = tools.span(-10, 10);
      const glass = lam(GLASS), steel = lam('#2c3338'), granite = lam('#8d8a82'), dark = lam('#1a1f23');
      const Mx = [glass, steel, dark];
      // glass bar (sports bar / batter's eye): raised on columns, open below for Monument Park
      const eyeGeo = sweepSolid(p, n, () => [[1.5, 15], [1.5, 46], [34, 46], [34, 15]], [0, 1, 0, 2], 0);
      ctx.add(eyeGeo, Mx);
      // park floor, back wall, and columns
      ctx.add(sweepSolid(p, n, () => [[1.5, 0], [1.5, 0.6], [30, 0.6], [30, 0]], [2, 2, 2, 2], 2), [granite, granite, granite, granite]);
      const back = ribbon(p, n, 30, 0.6, 30, 15, dark);
      const colSm = resample(p, n, 22);
      instances(new THREE.BoxGeometry(2.4, 15, 2.4), steel, colSm, () => ({ off: 28, y: 7.5 }));
      instances(new THREE.BoxGeometry(2.4, 15, 2.4), steel, colSm, () => ({ off: 3, y: 7.5 }));
      // Monument Park: plinths with plaques in an arc against the back wall (no names, no likenesses)
      const plint = new THREE.BoxGeometry(5, 1, 3);
      const stele = [];
      for (let k = 0; k < 7; k++) {
        const deg = -4.2 + k * 1.4, r = wallR(deg) + 14 + (k % 2) * 4, a = deg * tools.D2R;
        stele.push({ x: r * sn(a), z: -r * sc(a), nx: -sn(a), nz: sc(a), i: 0, h: 8 + (k % 3) * 2 });
      }
      stele.forEach((s) => {
        const base = ctx.add(new THREE.BoxGeometry(4.6, 1.2, 3.2), granite); base.position.set(s.x, 0.6 + 0.6, s.z);
        const post = ctx.add(new THREE.BoxGeometry(3.4, s.h, 1.4), lam('#a9a69b')); post.position.set(s.x, 1.2 + s.h / 2, s.z);
        const plaque = ctx.add(new THREE.BoxGeometry(2.4, 1.8, 0.3), lam('#b98f3e')); plaque.position.set(s.x, 1.2 + s.h * 0.55, s.z);
        const len = Math.hypot(s.x, s.z), ux = -s.x / len, uz = -s.z / len, yaw = Math.atan2(ux, uz);
        post.rotation.y = base.rotation.y = plaque.rotation.y = yaw;
        plaque.position.set(s.x + ux * 0.8, 1.2 + s.h * 0.55, s.z + uz * 0.8);
      });
      // scoreboard on top of the eye: vintage board with the ballpark name (no logos)
      const r = wallR(0) + 22, y = 46 + 3 + 24, bw = 100, bh = 48;
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#18291f'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e6dec6'; g.lineWidth = 8; g.strokeRect(10, 10, w - 20, h - 20);
        g.fillStyle = '#e6dec6'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = 'bold 76px Georgia, serif'; g.fillText('YANKEE STADIUM', w / 2, 70);
        g.font = 'bold 30px Georgia, serif';
        const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'H', 'E'], x0 = 330, cw = (w - x0 - 40) / cols.length;
        cols.forEach((c, i) => g.fillText(c, x0 + cw * (i + 0.5), 150));
        g.textAlign = 'left';
        ['VISITORS', 'HOME'].forEach((t, row) => {
          const yy = 220 + row * 80; g.fillText(t, 40, yy);
          cols.forEach((_, i) => { g.strokeStyle = '#e6dec6'; g.lineWidth = 2; g.strokeRect(x0 + cw * i + 6, yy - 28, cw - 12, 56); });
        });
        g.textAlign = 'center'; g.font = 'italic 26px Georgia, serif'; g.fillText('BRONX, NEW YORK', w / 2, h - 44);
      }, 1024, 448);
      const board = ctx.add(new THREE.BoxGeometry(bw, bh, 5), [lam('#243a2d'), lam('#243a2d'), lam('#243a2d'), lam('#243a2d'), new THREE.MeshBasicMaterial({ map: tex }), lam('#243a2d')]);
      board.position.set(0, y, -r); board.lookAt(0, y, 0);
      for (const sx of [-0.4, 0.4]) { const post = ctx.add(new THREE.BoxGeometry(3, 8, 3), lam('#243a2d')); post.position.set(bw * sx, 46 + 4, -r); }
      ctx.parts.scoreboard = board;
    }

    // ---- 5. limestone facade: wall along the measured outline, bays of three arched windows, gate pavilions ---------------
    {
      const { out: sm, L } = loopSamples(Cd.filter((_, i) => true), 1.5);
      const nb = Math.round(L / 30), pitch = L / nb;
      const Hf = (z) => 56 + 22 * sstep(-400, -320, z);               // 78 ft on the foul side, 56 ft behind the outfield
      const H = sm.map((p) => Hf(p.z));
      const stone = lam(STONE), stoneD = lam(STONE_D), cornice = lam('#cbc2a6'), dark = lam('#232b30');
      // wall body, base course, cornice
      const wallGeo = (o0, y0f, o1, y1f, mat) => {
        const pos = [], idx = [];
        sm.forEach((p, i) => { pos.push(p.x + p.nx * o0, y0f(i), p.z + p.nz * o0, p.x + p.nx * o1, y1f(i), p.z + p.nz * o1); const a = i * 2, b = ((i + 1) % sm.length) * 2; idx.push(a, a + 1, b, a + 1, b + 1, b); });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return ctx.add(g, mat);
      };
      wallGeo(0, () => 0, 0, (i) => H[i], stone);                                  // outer face
      wallGeo(-5, (i) => H[i], 0, (i) => H[i], stone);                              // top
      wallGeo(0.6, () => 0, 0.6, () => 9, stoneD);                                  // dark base course
      wallGeo(0.6, () => 9, 1.6, () => 9, stoneD);
      wallGeo(1.0, (i) => H[i] - 5, 1.0, (i) => H[i] + 0.6, cornice);               // cornice face
      wallGeo(1.0, (i) => H[i] + 0.6, 3.2, (i) => H[i] + 0.6, cornice);
      wallGeo(-5, () => 0, -5, (i) => H[i], lam('#bdb49a'));                         // inner face
      // gate pavilion positions: nearest sample to each target
      const gateIdx = GATES.map(([x, z]) => { let b = 0, bd = 1e9; sm.forEach((p, i) => { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; b = i; } }); return b; });
      const nearGate = (i) => gateIdx.some((g) => { const d = Math.abs(g - i); return Math.min(d, sm.length - d) * 1.5 < 44; });
      const at = (s) => sm[Math.round((s / L) * sm.length) % sm.length];
      // piers at bay boundaries, windows within each bay
      const piers = [], wins = [[], [], []], sq = [[], [], []], doors = [];
      for (let k = 0; k < nb; k++) {
        const pb = at(k * pitch), pc = at((k + 0.5) * pitch), idxc = Math.round(((k + 0.5) * pitch / L) * sm.length) % sm.length, h = H[idxc], f = h / 78;
        if (!nearGate(idxc)) piers.push({ ...pb, off: 0.9, y: 9 + (h - 9) / 2 - 2, sy: (h - 14) / 40 });
        if (nearGate(idxc)) continue;
        [-8.4, 0, 8.4].forEach((u, j) => {
          wins[j].push({ ...pc, u, off: 0.2, y: 16 * f, sy: f });
          if (h > 70) sq[j].push({ ...pc, u, off: 0.2, y: h - 17 });
        });
        [-7, 7].forEach((u) => doors.push({ ...pc, u, off: 0.2, y: 0 }));
      }
      const pierG = new THREE.BoxGeometry(3.6, 40, 2.2);
      placeAll(pierG, stone, piers);
      const archG = new THREE.ShapeGeometry(windowShape(5.4, 36));
      const dglass = lam('#3a464c');
      placeAll(archG, dglass, [].concat(...wins));
      placeAll(new THREE.PlaneGeometry(2.8, 3.6).translate(0, 1.8, 0), dglass, [].concat(...sq));
      placeAll(new THREE.PlaneGeometry(4.4, 9).translate(0, 4.5, 0), dglass, doors);
      // gate pavilions: projecting stone blocks with three taller arches and gold lettering
      const pav = gateIdx.map((i, g) => ({ ...sm[i], off: 5, y: (Hf(sm[i].z) + 20) / 2, sy: (Hf(sm[i].z) + 20) / 40 }));
      placeAll(new THREE.BoxGeometry(68, 40, 12), stone, pav);
      placeAll(new THREE.BoxGeometry(70, 1.8, 14).translate(0, 0, 0), cornice, gateIdx.map((i) => ({ ...sm[i], off: 5.2, y: Hf(sm[i].z) + 20 - 0.9 })));
      placeAll(new THREE.BoxGeometry(70, 9, 13), stoneD, gateIdx.map((i) => ({ ...sm[i], off: 5.2, y: 4.5 })));
      const tall = [];
      gateIdx.forEach((i) => { const p = sm[i], h = Hf(p.z); [-17, 0, 17].forEach((u) => tall.push({ ...p, u, off: 11.2, y: 13, sy: (h - 13) / 44 * 1.0 })); });
      placeAll(new THREE.ShapeGeometry(windowShape(8, 44)), lam('#1d252a'), tall);
      placeAll(new THREE.BoxGeometry(24, 10, 1), lam('#2b3338'), gateIdx.map((i) => ({ ...sm[i], off: 11.4, y: 5 })));
      // gold name over the arches
      const goldTex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#d4a93c'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 120px Georgia, serif'; g.fillText('YANKEE STADIUM', w / 2, h / 2);
      }, 1536, 192);
      placeAll(new THREE.PlaneGeometry(60, 7.5), new THREE.MeshBasicMaterial({ map: goldTex, transparent: true }), gateIdx.map((i) => ({ ...sm[i], off: 11.5, y: Hf(sm[i].z) + 7 })));
    }

    // ---- 6. concourse / Great Hall flat roofs between the canopy and the facade ------------------------------------------
    {
      const C = Cd, nR = Rd.length, pos = [], idx = [], pos2 = [];
      const raise = (x, z) => (x > 20 && z > -10 && z < 235 ? 62 : conY);          // Great Hall roof on the 1B side
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
      instances(new THREE.BoxGeometry(14, 5, 9), lam('#cfcabb'), boxes, (p, k) => ({ off: 8 + (k % 2) * 9, y: raise(p.x, p.z) + 2.5 }));
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
      for (const o of [-20, 20]) instances(new THREE.BoxGeometry(2.4, 34, 2.4), lam('#46564e'), sm, () => ({ off: o, y: 17 }));
      instances(new THREE.BoxGeometry(50, 2.5, 2.6), lam('#46564e'), sm, () => ({ off: 0, y: 33 }));
      const cars = resample(pts, nrm, 52).slice(12, 17);
      instances(new THREE.BoxGeometry(9, 12, 46), lam('#b9bcb4'), cars, () => ({ off: -10, y: 46 }));
    }

    // ---- camera stops --------------------------------------------------------------------------------------------
    ctx.views.exterior = { pos: [250, 70, 420], look: [10, 50, 280], label: 'Gate & Facade' };
    ctx.views.friezeView = { pos: ctx.tools.foulAt(0.78, d0 + 30, h0 + 45).toArray(), look: [60, roofIn - 6, 175], label: 'Frieze & Roof' };
    ctx.views.eyeView = { pos: [-70, 40, -290], look: [0, 18, -430], label: 'Eye & Monuments' };
  },
};
