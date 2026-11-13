// Oracle Park (San Francisco Giants) detail module.
// Sources: Wikipedia (Oracle Park): LF 339, LCF 399, CF 391, RCF 415 ("Triples Alley"), RF 309; fence 8 ft LF, 24 ft brick RF.
// APPROXIMATIONS: corner angles for the wall (-41 / -22 / +24 deg) are estimated from the plan, not surveyed.
//  The RF brick wall is one straight run from the pole to the Triples Alley corner (height 24 -> 20 ft); the
//  real wall has a few small jogs. The big video scoreboard is placed in left-center (as in life), not dead center.
//  Glove is a stylized primitive set on a plinth behind the LF bleachers (no bottle slide). Clock tower, palms,
//  arched windows, boats, cove and quay are simplified shapes and not to scale. The cove is a plain plane.
//  Light towers are generic four-bank towers on the upper-deck roof.
export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 339, h: 8 },
        { deg: -41, r: 364, h: 8 },     // bend near the left-field line
        { deg: -22, r: 399, h: 8 },     // left-center
        { deg: 0, r: 391, h: 8 },       // dead center
        { deg: 23.95, r: 415, h: 8 },   // Triples Alley, low wall
        { deg: 24, r: 415, h: 20 },     // brick wall starts (step up)
        { deg: 45, r: 309, h: 24 },     // right-field pole, 24 ft brick
      ],
      foulScale: 1,
      lower: { extent: [0, 1] },
      hasUpper: true,
      upper: { extent: [0.03, 0.97] },
      outfield: { depth: 44, slope: 0.36, spans: [[-45, -10]], eye: [-10, 10], eyeHeight: 28, eyeDepth: 22 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#254a38', facade: '#9a5a42', wall: '#2c4636', cream: '#e8dcbc' },
    };
  },

  build(ctx) {
    const { THREE, G, add, lam, dims, tools, M, MAT, parts, spec } = ctx;
    const { sweepSolid, textTexture, wallXZ, wallR, wallH, D2R } = tools;
    const brick = '#9a5a42', dark = '#241a15', cream = '#e8dcbc', conc = '#b9ae94';
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v3 = new THREE.Vector3(), sc = new THREE.Vector3();
    const basic = (c, extra) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, ...extra });

    // ---------- right-field wall frame (straight run from pole B to Triples Alley corner A) ----------
    const [bx, bz] = wallXZ(spec, 45), [ax, az] = wallXZ(spec, 24);
    const L = Math.hypot(ax - bx, az - bz), ux = (ax - bx) / L, uz = (az - bz) / L;   // unit from B toward A
    let nx = uz, nz = -ux; if (nx * bx + nz * bz < 0) { nx = -nx; nz = -nz; }          // outward normal (away from field)
    const hAt = (s) => 24 + (20 - 24) * (s / L);                                       // wall height at distance s from the pole
    const P = (s, t, y) => new THREE.Vector3(bx + ux * s + nx * t, y, bz + uz * s + nz * t);
    const yaw = Math.atan2(-nx, -nz);                                                  // faces the field

    // brick wall solid (front face slightly toward field) and arcade on top
    {
      const [p, n, dg] = tools.span(24, 45);
      const hh = (i) => wallH(spec, dg[i]);
      add(sweepSolid(p, n, (i) => [[-0.4, 0], [-0.4, hh(i)], [3, hh(i)], [3, 0]], [MAT.FACADE, MAT.CREAM, MAT.FACADE, -1], MAT.FACADE), M);
      // narrow arcade seating on top of the wall
      add(sweepSolid(p, n, (i) => [[-0.4, hh(i)], [-0.4, hh(i) + 3.2], [2.5, hh(i) + 3.2], [20, hh(i) + 3.2 + 7.5], [20, 0], [3, 0]],
        [MAT.CREAM, MAT.CREAM, MAT.SEAT, MAT.FACADE, MAT.FACADE, -1], MAT.FACADE), M);
    }

    // arched openings at the base (instanced): rectangle + half-disc shape, dark
    {
      const sh = new THREE.Shape(); const w = 4.2, hRect = 7.5;
      sh.moveTo(-w, 0); sh.lineTo(-w, hRect); sh.absarc(0, hRect, w, Math.PI, 0, true); sh.lineTo(w, 0); sh.lineTo(-w, 0);
      const n = Math.floor(L / 13);
      const arches = new THREE.InstancedMesh(new THREE.ShapeGeometry(sh, 10), basic(dark), n);
      for (let k = 0; k < n; k++) {
        const s = 8 + k * ((L - 16) / (n - 1)), pos = P(s, -0.5, 0.2);
        q.setFromEuler(e.set(0, yaw, 0)); m4.compose(pos, q, sc.set(1, 1, 1)); arches.setMatrixAt(k, m4);
      }
      G.add(arches);
    }

    // manual out-of-town scoreboard: dark panel with blank cream slots (no logos)
    {
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#1f3a2c'; g.fillRect(0, 0, w, h);
        g.strokeStyle = cream; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
        const rows = 8, cols = 14, mx = 24, my = 24, cw = (w - mx * 2) / cols, ch = (h - my * 2) / rows;
        g.fillStyle = cream;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g.fillRect(mx + c * cw + 3, my + r * ch + 3, cw - 6, ch - 6);
      }, 512, 256);
      const panel = add(new THREE.PlaneGeometry(40, 10), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
      const s = L * 0.5; panel.position.copy(P(s, -0.7, 17)); panel.rotation.y = yaw;
    }

    // ---------- walkway, quay, McCovey Cove ----------
    {
      const ext = 70, len = L + ext, walkA = 24, quay = 56;
      const walk = add(new THREE.BoxGeometry(quay - walkA, 0.5, len), lam('#cdbf9f'));
      walk.position.copy(P((L + ext) / 2, (walkA + quay) / 2, 0.25)); walk.rotation.y = Math.atan2(ux, uz);
      // quay curb
      const curb = add(new THREE.BoxGeometry(2.4, 2, len), lam(conc));
      curb.position.copy(P((L + ext) / 2, quay, 0.4)); curb.rotation.y = walk.rotation.y;
      // rail posts along the quay (instanced)
      const np = Math.floor(len / 12);
      const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.4, 3.4, 0.4), lam('#2b2723'), np);
      for (let k = 0; k < np; k++) { q.identity(); m4.compose(P(k * 12 + 2, quay - 0.6, 2.2), q, sc.set(1, 1, 1)); posts.setMatrixAt(k, m4); }
      G.add(posts);
      const rail = add(new THREE.BoxGeometry(0.3, 0.3, len), lam('#2b2723')); rail.position.copy(P((L + ext) / 2, quay - 0.6, 3.8)); rail.rotation.y = walk.rotation.y;
      // water polygon beyond the quay (shape in local frame: x along wall, y outward)
      const wtex = textTexture((g, w, h) => {
        g.fillStyle = '#58808c'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(232,220,188,0.22)'; g.lineWidth = 2;
        for (let i = 0; i < 18; i++) { const y = (i + 0.5) * h / 18; g.beginPath(); g.moveTo(10 + (i % 3) * 30, y); g.lineTo(w * 0.4 + (i % 4) * 20, y + 2); g.stroke(); }
      }, 256, 256);
      wtex.wrapS = wtex.wrapT = THREE.RepeatWrapping; wtex.repeat.set(10, 10);
      const water = add(new THREE.PlaneGeometry(520, len).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: wtex }));
      water.rotation.y = walk.rotation.y;
      water.position.copy(P((L + ext) / 2, quay + 1.2 + 260, 0.12));
      // boats: two kayaks and a small motor boat (simple shapes)
      const boat = (s, t, ang, kind) => {
        const g = new THREE.Group(); G.add(g); g.position.copy(P(s, t, 0.5)); g.rotation.y = walk.rotation.y + ang;
        if (kind === 'kayak') {
          const h = add(new THREE.CylinderGeometry(0.9, 0.9, 11, 8).rotateX(Math.PI / 2), lam('#d6b25a'), g); h.scale.set(1, 0.55, 1); h.position.y = 0.5;
          const p = add(new THREE.BoxGeometry(0.3, 0.1, 8), lam('#3a3a3a'), g); p.position.y = 1.6; p.rotation.y = 0.3;
        } else {
          const h = add(new THREE.BoxGeometry(7, 2.2, 22), lam('#e5dfcf'), g); h.position.y = 1;
          const bow = add(new THREE.ConeGeometry(3.5, 8, 4).rotateX(Math.PI / 2).rotateZ(Math.PI / 4), lam('#e5dfcf'), g); bow.position.set(0, 1, 15); bow.scale.set(1, 0.31, 1);
          const cab = add(new THREE.BoxGeometry(5, 3.4, 8), lam('#6f8a93'), g); cab.position.set(0, 3.7, -2);
        }
      };
      boat(60, quay + 40, 0.2, 'kayak'); boat(95, quay + 62, -0.5, 'kayak'); boat(30, quay + 110, 0.9, 'boat');
    }

    // ---------- grandstand tweaks: dark-green seats are set by config; exterior windows ----------
    // windows (instanced, brick facade of the upper deck)
    const { bPts, bN } = ctx.paths;
    {
      const arr = [], step = 6;
      for (let i = dims.i0 + 2; i < dims.i1 - 2; i += step) arr.push(i);
      const rows = [0.3, 0.62];
      const win = new THREE.InstancedMesh(new THREE.BoxGeometry(4.6, 9, 0.5), basic('#2a2420'), arr.length * rows.length);
      let k = 0;
      for (const i of arr) for (const rr of rows) {
        const [x, z] = bPts[i], [nxx, nzz] = bN[i], d = dims.dEnd + 0.3;
        m4.compose(v3.set(x + nxx * d, dims.hTop * rr + 5, z + nzz * d), q.setFromEuler(e.set(0, Math.atan2(nxx, nzz), 0)), sc.set(1, 1, 1));
        win.setMatrixAt(k++, m4);
      }
      G.add(win);
    }

    // ---------- main entrance: plaza, clock tower, palms ----------
    const tE = 0.6, iE = Math.round(tE * (bPts.length - 1));
    const entry = (d, y) => tools.foulAt(tE, d, y);
    const eAng = Math.atan2(bN[iE][0], bN[iE][1]);
    {
      const plaza = add(new THREE.CylinderGeometry(70, 70, 0.5, 32), lam('#d3c6a4')); plaza.position.copy(entry(dims.dEnd + 70, 0.25));
      const hT = dims.hTop + 28;
      const tw = new THREE.Group(); G.add(tw); tw.position.copy(entry(dims.dEnd + 8, 0)); tw.rotation.y = eAng;
      const shaft = add(new THREE.BoxGeometry(16, hT, 16), lam(brick), tw); shaft.position.y = hT / 2;
      for (const y of [hT * 0.35, hT * 0.7]) { const band = add(new THREE.BoxGeometry(17.4, 1.6, 17.4), lam(cream), tw); band.position.y = y; }
      const clockTex = textTexture((g, w, h) => {
        g.fillStyle = cream; g.fillRect(0, 0, w, h); g.strokeStyle = '#2b2118'; g.lineWidth = 8; g.beginPath(); g.arc(w / 2, h / 2, w * 0.42, 0, 7); g.stroke();
        for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.lineWidth = 6; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * w * 0.34, h / 2 - Math.cos(a) * w * 0.34); g.lineTo(w / 2 + Math.sin(a) * w * 0.4, h / 2 - Math.cos(a) * w * 0.4); g.stroke(); }
        g.lineWidth = 9; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + 40, h / 2 - 60); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 - 20, h / 2 + 90); g.stroke();
      }, 256, 256);
      const topY = hT - 12;
      for (let k = 0; k < 4; k++) {
        const face = add(new THREE.PlaneGeometry(11, 11), new THREE.MeshBasicMaterial({ map: clockTex, side: THREE.DoubleSide }), tw);
        const a = k * Math.PI / 2; face.position.set(Math.sin(a) * 8.15, topY, Math.cos(a) * 8.15); face.rotation.y = a;
      }
      const cap = add(new THREE.ConeGeometry(12.5, 16, 4).rotateY(Math.PI / 4), lam('#5f7f6a'), tw); cap.position.y = hT + 8;
      const spire = add(new THREE.CylinderGeometry(0.2, 0.5, 8, 6), lam('#3a4a40'), tw); spire.position.y = hT + 19;
    }
    // palms: instanced trunks and fronds along an arc in front of the entrance
    {
      const palms = [];
      for (let k = -5; k <= 5; k++) {
        const t = tE + k * 0.011, pos = tools.foulAt(t, dims.dEnd + 38 + (k % 2 ? 4 : 0), 0);
        palms.push({ pos, hgt: 22 + ((k * 7) % 5) });
      }
      const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.7, 1.1, 1, 7), lam('#7d6446'), palms.length);
      const nf = 8, frond = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 0.15, 11), lam('#4d6b3d'), palms.length * nf);
      let fi = 0;
      palms.forEach((p, k) => {
        m4.compose(v3.set(p.pos.x, p.hgt / 2, p.pos.z), q.identity(), sc.set(1, p.hgt, 1)); trunk.setMatrixAt(k, m4);
        for (let f = 0; f < nf; f++) {
          const a = f * Math.PI * 2 / nf + k, tilt = 0.45;
          q.setFromEuler(e.set(tilt, a, 0, 'YXZ'));
          const off = v3.set(Math.sin(a) * 4.8 * Math.cos(tilt), p.hgt + 1 - Math.sin(tilt) * 4.8 * 0.5, Math.cos(a) * 4.8 * Math.cos(tilt)).add(new THREE.Vector3(p.pos.x, 0, p.pos.z));
          m4.compose(off, q, sc.set(1, 1, 1)); frond.setMatrixAt(fi++, m4);
        }
      });
      G.add(trunk); G.add(frond);
    }

    // ---------- light towers on the upper-deck roof ----------
    {
      const lampMat = lam('#d9d1b6'), steel = lam('#5f5a50');
      for (const t of [0.12, 0.3, 0.7, 0.88]) {
        const pos = tools.foulAt(t, dims.dEnd - 4, dims.hTop), i = Math.round(t * (bPts.length - 1));
        const tw = new THREE.Group(); G.add(tw); tw.position.copy(pos); tw.rotation.y = Math.atan2(bN[i][0], bN[i][1]) + Math.PI;
        for (const sx of [-7, 7]) { const leg = add(new THREE.BoxGeometry(1.6, 52, 1.6), steel, tw); leg.position.set(sx, 26, 0); leg.rotation.z = -sx * 0.01; }
        const bank = add(new THREE.BoxGeometry(24, 11, 2.2), steel, tw); bank.position.y = 54;
        const lamps = add(new THREE.BoxGeometry(22, 9, 0.6), lampMat, tw); lamps.position.set(0, 54, 1.4);
        const brace = add(new THREE.BoxGeometry(14, 1, 1), steel, tw); brace.position.y = 30;
      }
    }

    // ---------- big vintage scoreboard (left-center) ----------
    {
      const deg = -14, a = deg * D2R, r = wallR(spec, deg) + dims.D * 0 + 14, hw = wallH(spec, deg);
      const bw = 112, bh = 46, y = hw + 3.2 + 0.36 * dims.D * 0 + 8 + bh / 2 + 14;
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#243d2e'; g.fillRect(0, 0, w, h);
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
        g.textAlign = 'center'; g.font = 'italic 30px Baskerville, Georgia, serif'; g.fillText('SAN FRANCISCO', w / 2, h - 55);
      }, 1024, 448);
      const board = add(new THREE.BoxGeometry(bw, bh, 5), [lam('#2c4636'), lam('#2c4636'), lam('#2c4636'), lam('#2c4636'), new THREE.MeshBasicMaterial({ map: tex }), lam('#2c4636')]);
      const px = r * Math.sin(a), pz = -r * Math.cos(a);
      board.position.set(px, y, pz); board.lookAt(0, y, 0);
      const cornice = add(new THREE.BoxGeometry(bw + 6, 3, 8), lam(cream), board); cornice.position.y = bh / 2 + 1.5;
      for (const sx of [-0.38, 0.38]) { const post = add(new THREE.BoxGeometry(4, y - bh / 2, 4), lam('#2c4636'), board); post.position.set(bw * sx, -bh / 2 - (y - bh / 2) / 2, -4); }
    }

    // ---------- giant four-fingered glove behind the left-field bleachers ----------
    const gDeg = -34, gR = wallR(spec, gDeg) + 4 + 44 + 24, gA = gDeg * D2R;
    const gTop = wallH(spec, gDeg) + 3 + 0.36 * 44;           // top of bleacher rows
    {
      const g = new THREE.Group(); G.add(g);
      g.position.set(gR * Math.sin(gA), 0, -gR * Math.cos(gA)); g.lookAt(0, 0, 0);
      const plinth = add(new THREE.BoxGeometry(34, gTop - 3, 24), lam('#b9ae94'), g); plinth.position.y = (gTop - 3) / 2;
      const gl = new THREE.Group(); gl.position.y = gTop - 3; gl.scale.setScalar(1.7); g.add(gl);
      const leather = lam('#8a5a33'), lace = lam('#5b3720');
      const palm = add(new THREE.SphereGeometry(1, 16, 12), leather, gl); palm.scale.set(10, 10, 4); palm.position.y = 9;
      const cuff = add(new THREE.CylinderGeometry(5.2, 4.4, 5, 14), lace, gl); cuff.position.y = 2;
      [[-6.5, -0.12], [-2.2, -0.04], [2.2, 0.04], [6.5, 0.12]].forEach(([x, rz], i) => {
        const len = 12 + (i === 1 || i === 2 ? 2 : 0), f = add(new THREE.CylinderGeometry(1.9, 2.4, len, 10), leather, gl);
        f.position.set(x * 1.0 + rz * -len * 0.4, 14 + len / 2 - 1, 0); f.rotation.z = rz;
        const tip = add(new THREE.SphereGeometry(1.9, 10, 8), leather, gl); tip.position.set(x + rz * -len * 0.9, 14 + len - 1, 0);
      });
      const th = add(new THREE.CylinderGeometry(2.1, 2.7, 12, 10), leather, gl); th.position.set(-11.5, 11, 0); th.rotation.z = -0.9;
      const web = add(new THREE.BoxGeometry(8, 7, 0.8), lace, gl); web.position.set(-8.8, 17, -0.4); web.rotation.z = 0.25;
      const strap = add(new THREE.BoxGeometry(10, 1.2, 4.2), lace, gl); strap.position.set(0, 8, 0.4);
    }

    // ---------- camera stops (all stay clear of the walkable-field rule) ----------
    const cov = P(95, 56 + 130, 14), tgt = P(L * 0.45, 0, 20);
    ctx.views.cove = { pos: [cov.x, cov.y, cov.z], look: [tgt.x, tgt.y, tgt.z], label: 'Kayak in the Cove' };
    const gx = gR * Math.sin(gA), gz = -gR * Math.cos(gA);
    ctx.views.glove = { pos: [70, 6, -250], look: [gx, gTop + 8, gz], walk: true, label: 'Glove & Bleachers' };
    const pl = tools.foulAt(tE, dims.dEnd + 260, 110), tp = entry(dims.dEnd + 20, 20);
    ctx.views.plaza = { pos: [pl.x, pl.y, pl.z], look: [tp.x, tp.y, tp.z], label: 'Clock Tower Plaza' };
  },
};
