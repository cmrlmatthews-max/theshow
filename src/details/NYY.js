// Detail module for NYY: Yankee Stadium (2009). See briefs/detail-api.md.
// Sources: Wikipedia (distances 318/399/408/385/314, wall 8 ft 5 in falling to 8 ft, backstop 52 ft 4 in,
// field/main/suite/upper/grandstand levels, zinc-coated steel frieze, Great Hall, Monument Park, black-glass eye,
// Indiana limestone facade, gold-leaf name over the gates).
// APPROXIMATIONS: the wall corner angles of the 399/385 points and the bullpen jog are estimated; the Great Hall is a
// simple volume on the first-base side; the facade is a single ring on the foul side only (the outfield stays open to
// the train line); the frieze over the outfield is a ribbon on posts; Monument Park is a few plinths; the viaduct is
// a straight-ish steel deck with a plain train; the video board sits in center field as a vintage scoreboard
// (the real one is a big LED board in left-center); level heights, window counts and arch counts are not to scale.
const FRIEZE = '#ece6d2', STONE = '#d9d0b6', GLASS = '#10161c', STEEL = '#4a5a52';

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 318, h: 8.4 }, { deg: -34, r: 362, h: 8.4 }, { deg: -22, r: 399, h: 8.4 }, { deg: -9, r: 408, h: 8.4 },
        { deg: 0, r: 408, h: 8.4 }, { deg: 9, r: 404, h: 8.4 }, { deg: 22, r: 385, h: 8.4 }, { deg: 32, r: 353, h: 8.2 },
        { deg: 32.05, r: 340, h: 8.2 }, { deg: 45, r: 314, h: 8 },
      ],
      backstop: 52,
      lower: { depth: 95, slope: 0.3, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 14, rise: 30, depth: 85, slope: 0.6, extent: [0.04, 0.96] },
      outfield: { depth: 55, slope: 0.45, spans: [[-45, -10], [10, 45]], eye: null },
      skip: { scoreboard: true, canopy: false },
      colors: { seat: '#27466f', facade: STONE, wall: '#1f3350', cream: '#e6dec6' },
    };
  },

  build(ctx) {
    const { THREE, G, dims, tools, paths } = ctx;
    const { sweepSolid, textTexture } = tools;
    const { dL, lowTop, d0, h0, dEnd, hTop, D } = dims;
    const lam = ctx.lam;
    const sc = (c) => Math.cos(c), sn = (c) => Math.sin(c);
    const wallH = (d) => tools.wallH(ctx.spec, d);
    const wallR = (d) => tools.wallR(ctx.spec, d);
    const ofSeatTop = (deg, dep) => wallH(deg) + 3 + 0.45 * dep;

    // ---- helpers ------------------------------------------------------------------------------------------
    // Resample a polyline [[x,z],..] with normals into points roughly `step` apart.
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
    // Instance a geometry along a path. place(sample) -> {off, y, yaw?}; yaw = 0 faces along the path tangent.
    const instances = (geo, mat, samples, f, scaleFn) => {
      const mesh = new THREE.InstancedMesh(geo, mat, samples.length);
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), s = new THREE.Vector3(1, 1, 1);
      samples.forEach((p, k) => {
        const { off, y } = f(p, k);
        const px = p.x + p.nx * off, pz = p.z + p.nz * off;
        // local +x runs along the path tangent (perpendicular to the outward normal), local +z points outward
        const ang = Math.atan2(p.nx, p.nz);
        q.setFromAxisAngle(up, ang);
        s.set(1, 1, 1); if (scaleFn) scaleFn(s, p, k);
        m.compose(new THREE.Vector3(px, y, pz), q, s); mesh.setMatrixAt(k, m);
      });
      mesh.instanceMatrix.needsUpdate = true; G.add(mesh); return mesh;
    };
    // Flat ribbon between two offsets/heights along a path (a wall when the offset is constant).
    const ribbon = (pts, nrm, o0, y0, o1, y1, mat) => {
      const pos = [], idx = [];
      pts.forEach((p, i) => { const n = nrm[i]; pos.push(p[0] + n[0] * o0, y0, p[1] + n[1] * o0, p[0] + n[0] * o1, y1, p[1] + n[1] * o1); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return ctx.add(g, mat);
    };
    // Arch shapes. Opening is an arch cut from the bottom (frieze) or into the wall (facade window).
    const archShape = (w, h, springY, aw) => {
      const s = new THREE.Shape(), m = (w - aw) / 2;
      s.moveTo(0, 0); s.lineTo(0, h); s.lineTo(w, h); s.lineTo(w, 0); s.lineTo(w - m, 0); s.lineTo(w - m, springY);
      s.absarc(w / 2, springY, aw / 2, 0, Math.PI, false); s.lineTo(m, 0); s.lineTo(0, 0); return s;
    };
    const windowShape = (w, h) => {
      const s = new THREE.Shape(), r = w / 2;
      s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r); s.absarc(0, h - r, r, 0, Math.PI, false); s.lineTo(-r, 0); return s;
    };

    const [fp, fn] = tools.cut(0, 1);           // foul-side path, 0 = RF pole -> LF pole
    const [, , ua, ub] = tools.cut(0.04, 0.96);
    const upPts = fp.slice(ua, ub + 1), upN = fn.slice(ua, ub + 1);

    // ---- 1. suite / terrace band between the main level and the grandstand ---------------------------------------
    {
      const band = ribbon(fp.slice(ua, ub + 1), fn.slice(ua, ub + 1), dL - 0.6, lowTop + 3, dL - 0.6, h0 - 8, lam('#202a30'));
      // cream terrace ledge on top of the main level and mullions every ~14 ft
      const ledge = sweepSolid(upPts, upN, () => [[dL - 7, lowTop + 0.2], [dL - 7, lowTop + 2], [dL, lowTop + 2], [dL, lowTop + 0.2]], [2, 2, 2, 2], 2);
      ctx.add(ledge, ctx.M);
      const mulGeo = new THREE.BoxGeometry(0.8, h0 - 8 - lowTop - 3, 0.8);
      instances(mulGeo, lam('#d8d0b8'), resample(upPts, upN, 14), () => ({ off: dL - 1, y: (lowTop + 3 + h0 - 8) / 2 }));
    }

    // ---- 2. the frieze: scalloped arch band hanging from the roof's front edge --------------------------------
    const FW = 13, FH = 8.5;
    const friezeGeo = new THREE.ShapeGeometry(archShape(FW, FH, 4.4, FW * 0.7)); friezeGeo.translate(-FW / 2, 0, 0);
    const friezeMat = lam(FRIEZE);
    {
      const off = dEnd - 24, y0 = hTop + 15.5 - FH;
      const smp = resample(upPts, upN, FW);
      instances(friezeGeo, friezeMat, smp, () => ({ off, y: y0 }));
      // continuous cap rail (roof fascia)
      ribbon(upPts, upN, off, y0 + FH, off, y0 + FH + 1.5, lam('#cfc7ae'));
      // frieze over the outfield: ribbon on posts above the bleacher tops
      const parts = [[-45, -10, 55], [10, 45, 55]];
      for (const [a, b, dep] of parts) {
        const [p, n, dg] = tools.span(a, b);
        const smpO = resample(p, n, FW);
        const degAt = (s) => dg[Math.min(s.i, dg.length - 1)];
        const yT = (s) => ofSeatTop(degAt(s), dep) + 14;
        instances(friezeGeo, friezeMat, smpO, (s) => ({ off: 4 + dep + 4, y: yT(s) }));
        const posts = smpO.filter((_, k) => k % 3 === 0);
        instances(new THREE.BoxGeometry(1.2, 1, 1.2), lam('#bdb5a0'), posts, (s) => ({ off: 4 + dep + 4, y: (yT(s) + 4) / 2 }), (sv, s) => sv.set(1, yT(s) + 4 - 0.0, 1));
      }
      // across the batter's eye, the frieze rides on top of the black glass
      const [pe, ne, de] = tools.span(-10, 10);
      instances(friezeGeo, friezeMat, resample(pe, ne, FW), () => ({ off: 32, y: 60 }));
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

    // ---- 5. limestone facade ring with tall narrow arched openings; gold name over the home-plate gate ---------------
    const FO = dEnd + 34, FHt = hTop + 24;
    {
      // the first-base stretch (Great Hall) is glazed instead of solid stone
      const [, , ha0, hb0] = tools.cut(0.07, 0.40);
      const h0i = ha0 - ua, h1i = hb0 - ua, solid = () => [[FO, 0], [FO, FHt], [FO + 4, FHt], [FO + 4, 0]];
      ctx.add(sweepSolid(upPts.slice(0, h0i + 1), upN.slice(0, h0i + 1), solid, [3, 3, 3, 3], 3), ctx.M);
      ctx.add(sweepSolid(upPts.slice(h1i), upN.slice(h1i), solid, [3, 3, 3, 3], 3), ctx.M);
      // cornice
      ribbon(upPts, upN, FO - 1.5, FHt - 3, FO + 6, FHt - 3, lam('#cdc4a8'));
      ribbon(upPts, upN, FO + 6, FHt - 3, FO + 6, FHt + 1, lam('#cdc4a8'));
      // arched openings on the outer face
      const WW = 6, WH = 36;
      const winGeo = new THREE.ShapeGeometry(windowShape(WW, WH));
      const wins = resample(upPts, upN, 15).filter((q) => q.i < h0i || q.i >= h1i);
      const win = instances(winGeo, lam('#2b3338'), wins, () => ({ off: FO + 4.15, y: 14 }));
      const win2 = instances(winGeo, lam('#2b3338'), wins, () => ({ off: FO + 4.15, y: FHt - 14 - WH * 0.8 }), (s) => s.set(0.8, 0.8, 1));
      // wide gate arches at ground level
      const gates = resample(upPts, upN, 60).filter((q) => q.i < h0i || q.i >= h1i);
      instances(new THREE.ShapeGeometry(windowShape(14, 22)), lam('#1e252a'), gates, () => ({ off: FO + 4.2, y: 0 }));
      // gold-letter name over the gate behind home plate (t = 0.5 -> foul index)
      const mid = Math.round(0.5 * (fp.length - 1));
      const mx = fp[mid][0] + fn[mid][0] * (FO + 4.4), mz = fp[mid][1] + fn[mid][1] * (FO + 4.4);
      const nameTex = textTexture((g, w, h) => {
        g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h);
        g.fillStyle = '#d9b44a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 150px Georgia, serif';
        g.fillText('YANKEE STADIUM', w / 2, h / 2);
      }, 1536, 192);
      const sign = ctx.add(new THREE.PlaneGeometry(96, 12), new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, side: THREE.DoubleSide }));
      sign.position.set(mx, 46, mz); sign.lookAt(mx + fn[mid][0] * 50, 46, mz + fn[mid][1] * 50);
      // gate surround
      const gate = ctx.add(new THREE.BoxGeometry(110, 3, 3), lam('#cdc4a8')); gate.position.set(mx, 40, mz); gate.lookAt(mx + fn[mid][0] * 50, 40, mz + fn[mid][1] * 50);
    }

    // ---- 6. the Great Hall: tall concourse on the first-base / right-field side, translucent roof ----------------------
    {
      const [, , ha, hb] = tools.cut(0.07, 0.40);
      const hp = fp.slice(ha, hb + 1), hn = fn.slice(ha, hb + 1);
      const roofY = FHt - 6;
      const roofMat = new THREE.MeshLambertMaterial({ color: '#cfe0dc', transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false });
      ribbon(hp, hn, dEnd + 3, roofY, FO, roofY, roofMat);
      // inner glazed wall and steel ribs every 22 ft
      ribbon(hp, hn, dEnd + 3, 2, dEnd + 3, roofY, new THREE.MeshLambertMaterial({ color: '#b9d0cd', transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false }));
      const ribSm = resample(hp, hn, 22);
      const rib = new THREE.BoxGeometry(1.4, 1.4, FO - dEnd - 3);
      instances(rib, lam(STEEL), ribSm, () => ({ off: (dEnd + 3 + FO) / 2, y: roofY }));
      const colG = new THREE.BoxGeometry(1.6, roofY, 1.6);
      instances(colG, lam(STEEL), ribSm, () => ({ off: dEnd + 4, y: roofY / 2 }));
      ribbon(hp, hn, FO + 2, 2, FO + 2, roofY, new THREE.MeshLambertMaterial({ color: '#9db8b8', transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      instances(new THREE.BoxGeometry(2.4, roofY, 2.4), lam('#d3caae'), ribSm, () => ({ off: FO + 2, y: roofY / 2 }));
      // floor
      ribbon(hp, hn, dEnd + 3, 0.8, FO, 0.8, lam('#bdb39a'));
    }

    // ---- 7. elevated subway viaduct beyond the right-field side ----------------------------------------------------
    {
      const pts = [];
      for (let k = 0; k <= 24; k++) {
        const t = k / 24, z = 380 - t * 900;
        const x = 372 + 60 * Math.sin(t * 2.2 - 0.3) * t; pts.push([x, z]);
      }
      const nrm = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz); nx /= l; nz /= l; if (nx < 0) { nx = -nx; nz = -nz; } return [nx, nz]; });
      const girder = lam('#3b4a44'), rail = lam('#2a2e30'), gird2 = lam('#56665e');
      ctx.add(sweepSolid(pts, nrm, () => [[-9, 36], [-9, 40], [9, 40], [9, 36]], [0, 1, 0, 1], 0), [girder, gird2]);
      // parapet girders on both sides
      for (const s of [-1, 1]) ctx.add(sweepSolid(pts, nrm, () => [[s * 9, 36], [s * 9, 44], [s * 9 + 0.8, 44], [s * 9 + 0.8, 36]], [0, 0, 0, 0], 0), [gird2]);
      for (const s of [-3.6, 3.6]) ctx.add(sweepSolid(pts, nrm, () => [[s - 0.3, 40], [s - 0.3, 40.8], [s + 0.3, 40.8], [s + 0.3, 40]], [0, 0, 0, 0], 0), [rail]);
      // piers: two columns and a crossbeam every ~45 ft
      const sm = resample(pts, nrm, 45);
      instances(new THREE.BoxGeometry(2, 36, 2), lam('#46564e'), sm, () => ({ off: -7, y: 18 }));
      instances(new THREE.BoxGeometry(2, 36, 2), lam('#46564e'), sm, () => ({ off: 7, y: 18 }));
      instances(new THREE.BoxGeometry(18, 2.5, 2.2), lam('#46564e'), sm, () => ({ off: 0, y: 34.5 }), null);
      // a plain train of five cars
      const cars = resample(pts, nrm, 52).slice(3, 8);
      instances(new THREE.BoxGeometry(46, 12, 9), lam('#b9bcb4'), cars, () => ({ off: 0, y: 47 }), null);
    }

    // ---- camera stops --------------------------------------------------------------------------------------------
    ctx.views.exterior = { pos: [560, 110, 330], look: [0, 30, -60], orbit: true, label: 'Facade & Subway' };
    ctx.views.friezeView = { pos: ctx.tools.foulAt(0.78, d0 + 40, h0 + 40).toArray(), look: [60, 60, 160], label: 'Frieze' };
    ctx.views.eyeView = { pos: [-70, 40, -290], look: [0, 18, -430], label: 'Eye & Monuments' };
  },
};
