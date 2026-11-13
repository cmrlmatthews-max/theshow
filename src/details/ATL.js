// Detail module: Truist Park, Atlanta Braves (opened 2017). Units: feet.
// Sources: Wikipedia (dimensions, canopy, batter's eye, brick/precast), Clem's Baseball (straight wall, canopy,
// four decks, Chop House), Baseball-Reference Bullpen (6 ft LF corner, 8'8" fence, 16 ft RF wall, Chop House),
// AJC (LF 6 ft, RF 16 ft, power alley 375).
// APPROXIMATIONS:
//  - Wall corner angles/radii between the posted distances are estimated; the heights step at deg -36 and +33.
//  - Chop House is a stepped mass with window blocks, not a true floor plan; rooftop plaza and terraces are simplified.
//  - The batter's eye is a dark wall with a stack of rocks, 3 big + a few small evergreens, a pond, a waterfall and
//    a fountain jet; real rock and water shapes differ.
//  - Video board is placed in left-center and drawn as a vintage scoreboard (the real one is a modern LED board).
//  - Canopy is one swept slab (real one is a trussed shell); light bands run RF pole to home plate on its front edge.
//  - Club level is a simple terrace/glass band; deck extents and heights are estimates (four decks, 41k seats).
//  - Entry plaza and gate towers behind home plate are stylized. Battery Atlanta is a few muted blocks, positions
//    and heights are estimates, only the idea (hotel tower, office slab, low retail) is real.
const D2R = Math.PI / 180;

// Point on the line from corner A to corner B at the given angle (gives the radius).
const onLine = (A, B, deg) => {
  const a = deg * D2R, dx = Math.sin(a), dz = -Math.cos(a);
  const ax = A.r * Math.sin(A.deg * D2R), az = -A.r * Math.cos(A.deg * D2R);
  const ex = B.r * Math.sin(B.deg * D2R) - ax, ez = -B.r * Math.cos(B.deg * D2R) - az;
  return (ax * ez - az * ex) / (dx * ez - dz * ex);
};

export default {
  config(rec) {
    const lf = { deg: -45, r: 335 }, lcf = { deg: -22, r: 385 }, rcf = { deg: 22, r: 375 }, rf = { deg: 45, r: 325 };
    const rL = onLine(lf, lcf, -36), rR = onLine(rcf, rf, 33);
    return {
      wall: [
        { deg: -45, r: 335, h: 6 }, { deg: -36, r: rL, h: 6 }, { deg: -35.95, r: rL, h: 8.7 },
        { deg: -22, r: 385, h: 8.7 }, { deg: -9, r: 402, h: 8.7 }, { deg: 0, r: 400, h: 8.7 }, { deg: 9, r: 402, h: 8.7 },
        { deg: 22, r: 375, h: 8.7 }, { deg: 33, r: rR, h: 8.7 }, { deg: 33.05, r: rR, h: 16 }, { deg: 45, r: 325, h: 16 },
      ],
      lower: { depth: 96, slope: 0.3, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 36, rise: 36, depth: 92, slope: 0.6, extent: [0.05, 0.95] },
      outfield: { depth: 68, slope: 0.42, spans: [[-45, -9], [9, 33]], eye: [-9, 9], eyeHeight: 36, eyeDepth: 44 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2c3f66', facade: '#98533f', wall: '#2b4034', cream: '#e6dcc0' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, C, views } = ctx;
    const { sweepSolid, textTexture, wallR, wallH, clamp, mixHex } = tools;
    const { bPts, bN, wallPts, wallDeg, wallN } = paths;
    const N1 = bPts.length - 1;
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const spec = ctx.spec;

    // Seeded random for repeatable scatter
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    // Instanced helper: mats = array of Matrix4
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx));
      m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const idx = (t) => Math.round(clamp(t, 0, 1) * N1);

    // ---------- 1. Wall: brick facing on the tall right-field wall, short padded strip on the low left corner
    {
      const [p, n, dg] = tools.span(33.5, 45);
      const h = (i) => wallH(spec, dg[i]);
      ctx.add(sweepSolid(p, n, (i) => [[-0.5, 0], [-0.5, h(i)], [0.3, h(i)], [0.3, 0]], [MAT.FACADE, MAT.FACADE, MAT.FACADE, -1], MAT.FACADE), M);
    }

    // ---------- 2. Chop House: stepped restaurant mass above the right-field wall, with terraces
    {
      const [p, n, dg] = tools.span(33.5, 44.5);
      const prof = () => [[1.2, 0], [1.2, 28], [12, 28], [12, 42], [28, 42], [28, 58], [46, 58], [46, 0]];
      ctx.add(sweepSolid(p, n, prof, [MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.SHADE, MAT.FACADE, -1], MAT.FACADE), M);
      // railings on both terraces and the rooftop plaza
      const rail = (d, y) => ctx.add(sweepSolid(p, n, () => [[d - 0.2, y], [d - 0.2, y + 3.6], [d + 0.2, y + 3.6], [d + 0.2, y]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      rail(2.2, 28); rail(13, 42);
      // roof cap over the top block
      ctx.add(sweepSolid(p, n, () => [[27, 58], [27, 60], [47, 60], [47, 58]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      // window blocks on three faces (instanced dark panels)
      const win = [];
      const faces = [[1.0, 18, 3.4, 7.5, 2], [11.8, 34.5, 3.4, 7, 2], [27.8, 50, 3.6, 7.5, 2]];
      for (const [d, y, w, h, step] of faces) {
        for (let i = 0; i < p.length; i += step) {
          const x = p[i][0] + n[i][0] * d, z = p[i][1] + n[i][1] * d;
          win.push(mat4(x, y, z, w, h, 1, Math.atan2(-n[i][0], -n[i][1])));
        }
      }
      inst(new THREE.PlaneGeometry(1, 1), basic('#3a4a50'), win);
      // flat plaza deck on the highest terrace (visible rooftop plaza) gets tiny table umbrellas
      const um = [];
      for (let i = 2; i < p.length - 2; i += 3) um.push(mat4(p[i][0] + n[i][0] * 20, 44.5, p[i][1] + n[i][1] * 20, 3.2, 1, 3.2));
      inst(new THREE.ConeGeometry(1, 1.4, 8), lam('#d8c9a0'), um);
    }

    // ---------- 3. Batter's eye: rocks, evergreens, pond, waterfall, fountain
    {
      const eh = 36;
      const W = (deg, out, y) => tools.wallAt(deg, out, y);
      // rocks scattered over the eye top and front slope
      const rocks = [];
      for (let k = 0; k < 34; k++) {
        const deg = (rnd() - 0.5) * 17, out = 3 + rnd() * 38, front = out < 12;
        const y = front ? 12 + rnd() * (eh - 12) : eh;
        const q = W(deg, out, y), s = 2.6 + rnd() * 4.2;
        rocks.push(mat4(q.x, q.y + s * 0.3, q.z, s * 1.3, s * 0.8, s, rnd() * 3));
      }
      inst(new THREE.DodecahedronGeometry(1, 0), lam('#7b7466'), rocks);
      // evergreens: 3 big (3 tiers each) and 12 small ones
      const cones = [];
      const tree = (deg, out, base, sc) => {
        const q = W(deg, out, base);
        [[0, 7.5, 16], [11, 5.8, 15], [22, 4.1, 14]].forEach(([dy, r, h]) => cones.push(mat4(q.x, base + dy * sc + h * sc / 2, q.z, r * sc, h * sc, r * sc)));
      };
      [[-4.5, 24], [0.5, 32], [5, 22]].forEach(([d, o]) => tree(d, o, eh + 3, 1.25));
      for (let k = 0; k < 12; k++) tree((rnd() - 0.5) * 20, 14 + rnd() * 26, eh + 1.5, 0.45 + rnd() * 0.3);
      inst(new THREE.ConeGeometry(1, 1, 9), lam('#2d4a33'), cones);
      // pond on the ledge and fountain jet (50 ft)
      const pc = W(-1, 14, eh + 1.2);
      const pond = ctx.add(new THREE.CylinderGeometry(9, 9, 0.6, 24), lam('#6f9ba6')); pond.position.copy(pc);
      const jet = ctx.add(new THREE.CylinderGeometry(0.3, 1.4, 50, 8), new THREE.MeshBasicMaterial({ color: '#e5f1f0', transparent: true, opacity: 0.55 }));
      jet.position.set(pc.x, pc.y + 25, pc.z);
      // waterfall ribbon down the front face
      const wf = W(-1, 1.7, 22);
      const fall = ctx.add(new THREE.PlaneGeometry(9, 26), new THREE.MeshBasicMaterial({ color: '#cfe4e6', transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
      fall.position.set(wf.x, 22, wf.z);
    }

    // ---------- 4. Main video board: vintage scoreboard in left-center
    {
      if (parts.scoreboard) ctx.remove(parts.scoreboard);
      const deg = -26, D = dims.D, hw = wallH(spec, deg);
      const bw = 138, bh = 60, base = hw + 3 + dims.ofSlope * D, y = base + 22 + bh / 2;
      const r = wallR(spec, deg) + D + 16, a = deg * D2R;
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#1d2f3f'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#e6dcc0'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20);
        g.lineWidth = 3; g.strokeRect(28, 28, w - 56, h - 56);
        // name plate
        g.fillStyle = '#e6dcc0'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = 'bold 78px Rockwell, Georgia, serif'; g.fillText('TRUIST PARK', w * 0.5, 82);
        g.fillStyle = '#98533f'; g.fillRect(60, 130, w - 120, 6);
        // big screen: dark panel with a diamond sketch
        const sx = 70, sy = 160, sw = w * 0.56, sh = h - 160 - 150;
        g.fillStyle = '#0f1a24'; g.fillRect(sx, sy, sw, sh);
        g.strokeStyle = '#6f8c8c'; g.lineWidth = 3; g.strokeRect(sx, sy, sw, sh);
        g.strokeStyle = 'rgba(230,220,192,0.55)'; g.lineWidth = 4;
        const cx = sx + sw / 2, cy = sy + sh * 0.5, dd = Math.min(sw, sh) * 0.32;
        g.beginPath(); g.moveTo(cx, cy + dd); g.lineTo(cx + dd, cy); g.lineTo(cx, cy - dd); g.lineTo(cx - dd, cy); g.closePath(); g.stroke();
        // line score
        const lx = sx + sw + 40, cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'H', 'E'], cw = (w - lx - 60) / cols.length;
        g.fillStyle = '#e6dcc0'; g.font = 'bold 30px Rockwell, Georgia, serif';
        cols.forEach((c, i) => g.fillText(c, lx + cw * (i + 0.5), 190));
        ['AWAY', 'HOME'].forEach((t, row) => {
          const yy = 270 + row * 100; g.textAlign = 'left'; g.fillText(t, lx - 2, yy - 56); g.textAlign = 'center';
          cols.forEach((_, i) => { g.strokeStyle = '#e6dcc0'; g.lineWidth = 2; g.strokeRect(lx + cw * i + 4, yy - 34, cw - 8, 62); });
        });
        g.textAlign = 'center'; g.font = 'italic 30px Baskerville, Georgia, serif'; g.fillStyle = '#e6dcc0';
        g.fillText('Cobb County  ·  Opened 2017', w * 0.5, h - 70);
      }, 1536, 672);
      const frame = lam('#33404a');
      const board = ctx.add(new THREE.BoxGeometry(bw, bh, 7), [frame, frame, frame, frame, new THREE.MeshBasicMaterial({ map: tex }), frame]);
      board.position.set(r * Math.sin(a), y, -r * Math.cos(a)); board.lookAt(0, y, 0);
      // cap rail and scalloped crown in cream
      const crown = ctx.add(new THREE.BoxGeometry(bw + 6, 4, 9), lam('#e6dcc0'), board); crown.position.y = bh / 2 + 2;
      // support legs with a cross brace
      const ph = y - bh / 2;
      for (const sx of [-0.38, 0.38]) { const post = ctx.add(new THREE.BoxGeometry(5, ph, 5), lam('#4d5660'), board); post.position.set(bw * sx, -bh / 2 - ph / 2, -5); }
      const brace = ctx.add(new THREE.BoxGeometry(bw * 0.76, 3, 3), lam('#4d5660'), board); brace.position.set(0, -bh / 2 - ph * 0.45, -5);
    }

    // ---------- 5. Metal canopy over the upper deck with light bands on the front edge
    const { d0, h0, dEnd, hTop } = dims; const sU = dims.dU ? (hTop - h0) / dims.dU : 0.6;
    {
      const a = idx(0.15), b = idx(0.85);
      const p = bPts.slice(a, b + 1), n = bN.slice(a, b + 1);
      const dF = d0 + 28, dB = dEnd + 14;
      const yF = h0 + sU * (dF - d0) + 24, yB = h0 + sU * (dB - d0) + 20;
      const steel = lam('#cfcabb'), under = new THREE.MeshBasicMaterial({ color: '#8b8a82', side: THREE.DoubleSide });
      const mats = [steel, under];
      const geo = sweepSolid(p, n, () => [[dF, yF], [dF, yF + 4], [dB, yB + 4], [dB, yB]], [0, 0, 0, 1], 0);
      ctx.add(geo, mats);
      // light band: a strip with bright dots, from the right-field pole to home plate only (t 0.15 .. 0.5)
      const dots = textTexture((g, w, h) => {
        g.fillStyle = '#575b60'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#fff3c4'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(8 + i * 16, h / 2, 5, 0, 7); g.fill(); }
      }, 64, 16);
      dots.wrapS = dots.wrapT = THREE.RepeatWrapping;
      const lightMat = new THREE.MeshBasicMaterial({ map: dots, side: THREE.DoubleSide });
      const [lp, ln] = tools.cut(0.15, 0.5);
      ctx.add(sweepSolid(lp, ln, () => [[dF - 0.5, yF + 0.2], [dF - 0.5, yF + 3.8], [dF + 0.3, yF + 3.8], [dF + 0.3, yF + 0.2]], [0, -1, -1, -1], 0), [lightMat]);
      // plain steel band on the rest of the front edge
      const [qp, qn] = tools.cut(0.5, 0.85);
      ctx.add(sweepSolid(qp, qn, () => [[dF - 0.5, yF + 0.2], [dF - 0.5, yF + 3.8], [dF + 0.3, yF + 3.8], [dF + 0.3, yF + 0.2]], [0, -1, -1, -1], 0), [lam('#8e9298')]);
      // columns at the back of the upper deck
      const cols = [];
      for (let i = 0; i < p.length; i += 7) {
        const dd = dEnd + 4, hh = yB - 1 - hTop;
        cols.push(mat4(p[i][0] + n[i][0] * dd, hTop + hh / 2, p[i][1] + n[i][1] * dd, 1.8, hh, 1.8));
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#9ea1a5'), cols);
    }

    // ---------- 6. Club level: a terrace of seats and a glass suite band between the lower and upper decks
    {
      const [p, n] = tools.cut(0.06, 0.94);
      const { dL, lowTop } = dims;
      ctx.add(sweepSolid(p, n, () => [[d0 + 2, lowTop], [d0 + 2, lowTop + 3], [dL, lowTop + 12], [dL, lowTop]], [MAT.WALL, MAT.SEAT, MAT.SHADE, -1], MAT.WALL), M);
      const glass = new THREE.MeshLambertMaterial({ color: '#4d6a7a', side: THREE.DoubleSide });
      ctx.add(sweepSolid(p, n, () => [[dL - 1, lowTop + 12], [dL - 1, h0 - 8], [dL - 0.4, h0 - 8], [dL - 0.4, lowTop + 12]], [0, 0, 0, 0], 0), [glass]);
    }

    // ---------- 7. Facade: precast bands, piers and arched openings on the brick; entry plaza behind home plate
    {
      const a = idx(0.05), b = idx(0.95);
      const p = bPts.slice(a, b + 1), n = bN.slice(a, b + 1);
      const band = (y0, y1, out) => ctx.add(sweepSolid(p, n, () => [[dEnd - 0.2, y0], [dEnd - 0.2, y1], [dEnd + out, y1], [dEnd + out, y0]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      band(32, 35, 1.0); band(70, 73, 1.0); band(hTop - 4, hTop + 1.5, 2.4);
      const piers = [], arches = [];
      for (let i = 0; i < p.length; i += 4) {
        const ang = Math.atan2(n[i][0], n[i][1]);
        piers.push(mat4(p[i][0] + n[i][0] * (dEnd + 0.6), hTop / 2, p[i][1] + n[i][1] * (dEnd + 0.6), 3.2, hTop, 1.6, ang));
        if (i + 2 < p.length) { const j = i + 2; arches.push(mat4(p[j][0] + n[j][0] * (dEnd + 0.3), 9, p[j][1] + n[j][1] * (dEnd + 0.3), 6.5, 15, 1, Math.atan2(n[j][0], n[j][1]))); }
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#d8cdb0'), piers);
      inst(new THREE.PlaneGeometry(1, 1), basic('#3b2f2a'), arches);

      // lower-deck back wall at the two ends (outside the upper deck): precast band
      for (const [t0, t1] of [[0, 0.05], [0.95, 1]]) {
        const [qp, qn] = tools.cut(t0, t1);
        ctx.add(sweepSolid(qp, qn, () => [[dims.dL - 0.2, dims.lowTop - 3], [dims.dL - 0.2, dims.lowTop + 1.5], [dims.dL + 1.6, dims.lowTop + 1.5], [dims.dL + 1.6, dims.lowTop - 3]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      }

      // entry plaza: group placed behind home plate, local +z points away from the field
      const i5 = idx(0.5), nx = bN[i5][0], nz = bN[i5][1];
      const g = new THREE.Group(); G.add(g);
      g.position.set(bPts[i5][0] + nx * dEnd, 0, bPts[i5][1] + nz * dEnd); g.rotation.y = Math.atan2(nx, nz);
      const box = (w, h, d, col, x, y, z) => { const m = ctx.add(new THREE.BoxGeometry(w, h, d), lam(col), g); m.position.set(x, y, z); return m; };
      box(230, 0.6, 90, '#c9bd9f', 0, 0.3, 48);                          // plaza paving
      const ring = ctx.add(new THREE.CylinderGeometry(34, 34, 0.5, 40), lam('#ded2b2'), g); ring.position.set(0, 0.7, 62);
      for (const sx of [-1, 1]) {
        box(24, 84, 26, '#98533f', sx * 44, 42, 14);                      // brick gate towers
        box(28, 4, 30, '#e0d5b8', sx * 44, 86, 14);                       // precast caps
        box(18, 10, 20, '#e0d5b8', sx * 44, 90, 14);
      }
      box(64, 14, 14, '#e0d5b8', 0, 52, 14);                              // precast lintel between the towers
      box(40, 40, 3, '#3b2f2a', 0, 20, 7.5);                              // dark portal
      box(52, 6, 10, '#e0d5b8', 0, 41, 14);
      // low brick ticket pavilions flanking the plaza
      for (const sx of [-1, 1]) { box(34, 14, 24, '#98533f', sx * 92, 7, 40); box(38, 2, 28, '#e0d5b8', sx * 92, 15, 40); }
      // plaza lamp posts (instanced)
      const lm = []; const gp = g.position;
      for (let k = -3; k <= 3; k++) {
        const lx = k * 28, lz = 82;
        const wx = gp.x + lx * Math.cos(g.rotation.y) + lz * Math.sin(g.rotation.y), wz = gp.z - lx * Math.sin(g.rotation.y) + lz * Math.cos(g.rotation.y);
        lm.push(mat4(wx, 9, wz, 0.8, 18, 0.8));
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#4d5660'), lm);
    }

    // ---------- 8. The Battery Atlanta: simple muted blocks beyond right and center field
    {
      const winTex = (rep, base, win) => { const t = textTexture((g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); g.fillStyle = win; for (let y = 6; y < h; y += 16) for (let x = 5; x < w; x += 16) g.fillRect(x, y, 9, 8); }, 128, 128); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); return t; };
      const bld = (deg, rOut, w, d, h, base, win, rep) => {
        const a = deg * D2R, r = rOut;
        const mat = new THREE.MeshLambertMaterial({ map: winTex(rep, base, win) });
        const m = ctx.add(new THREE.BoxGeometry(w, h, d), mat);
        m.position.set(r * Math.sin(a), h / 2, -r * Math.cos(a)); m.rotation.y = -a; return m;
      };
      bld(33, 530, 64, 96, 150, '#8f9ba3', '#4f5f69', [4, 9]);     // hotel tower
      bld(12, 620, 150, 80, 176, '#b0a592', '#5b5d5e', [8, 11]);   // office building
      bld(-7, 650, 110, 70, 96, '#a8826b', '#4a3c33', [6, 6]);     // residential, brick
      bld(21, 520, 90, 40, 38, '#b79a7d', '#4a3c33', [5, 2]);      // low retail
      bld(44, 480, 70, 50, 52, '#9d8a74', '#4a3c33', [4, 3]);
      bld(51, 450, 56, 44, 34, '#b79a7d', '#4a3c33', [3, 2]);
      bld(2, 520, 70, 40, 30, '#9c9382', '#4a3c33', [4, 2]);       // low block behind center field
    }

    // ---------- camera stops
    {
      const cp = tools.wallAt(-30, 40, 62); const look1 = tools.wallAt(40, 22, 30);
      views.chop = { pos: [cp.x, cp.y, cp.z], look: [look1.x, look1.y, look1.z], label: 'Chop House' };
      views.canopy = { pos: [-110, 48, -250], look: [150, 105, 60], label: 'Canopy' };
      views.eye = { pos: [-60, 52, 45], look: [0, 38, -420], label: 'Batter\'s Eye' };
    }
  },
};
