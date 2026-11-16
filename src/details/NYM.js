// Detail module: Citi Field, New York Mets (opened 2009, Queens). Units: feet.
// MEASURED FROM THE SATELLITE SHEET (survey.png, 1.1 px/ft, home plate = origin, CF = -z):
//  - Outfield wall corners (x,z): LF pole (-237,-237) r335, (-231,-249), (-205,-296) r360, (-38,-411) and (31,-411) (flat center
//    wall, r~409), notch (69,-389), (84,-380), right-center (167,-333), RF pole (233,-231). Walls 8 ft (posted).
//  - Batter's eye: dark box x -40..+43, z -411..-455 (deeper than the old 26 ft). Scoreboard assembly: lattice strip x -49..129,
//    z -493..-475, house roof z -475..-462. Shea Bridge (red lattice) about (150,-455) to (255,-365).
//  - Facade / roof-edge line: 25 stations (see FAC): z=212 behind home, x=-355 at z=-225, x=+338 at z=-151, up to (-86,-480).
//  - SEATING (rays drawn along the bowl normals at t = 0..1, ticks every 20 ft, read on the 2x crops): total width front edge to
//    facade W(t) = 174 (t.1), 192 (.2), 199 (.3-.4), 169 (.5), 183 (.7), 180 (.8), 160 (.9), 129 (1). Lower bowl (lit seats before
//    the dark shadow gap) = 62 (t.05), 78 (.1), 100 (.2), 95 (.3), 82 (.4), 70 (.5 behind home), 86 (.7), 90 (.8), 82 (.9), 62 (1).
//    Upper block starts at the gap (overhang 4-8 ft on the sides, 34 ft behind home) and ends ~10 ft inside the facade:
//    dEnd = 140 (.05), 164 (.1), 184 (.2), 190 (.3), 158 (.5), 172 (.7), 150 (.9). Tables are in config().
// MEASURED FROM PHOTOGRAPHS (/home/claude/refs/NYM, scale objects named):
//  - batter's eye 40 ft: photo 4, eye box height against the 8 ft outfield wall in the same plane (ratio ~5).
//  - main board frame ~108 ft tall x ~100 ft wide, bottom at the eye top (38 ft), top ~146 ft; LED face ~90 x 50 ft: photo 4, the
//    frame measured against the eye (40 ft) and wall (8 ft), corrected for the 65 ft extra distance (+-15%).
//  - right-field board ~80 x 45 ft on two posts, face bottom ~68 ft, lamp bank top ~165 ft: photo 4, against the main frame.
//  - left-field board ~52 x 30 ft on the roof truss: photo 4. Roof truss level 124 ft (inner edge), light tower legs 34-43 ft
//    above it with three arched lamp banks: photos 3, 7 (tower width ~ 4 legs x 26 ft, height half its width).
//  - facade total 104 ft: photos 1 and 2, ground arches ~20 ft and people ~5.8 ft in the same plane; ground story 0-26 ft, belt
//    course 26-30, two-story arched windows 32-82 (arch head to 84), string course 90, parapet to 104.
//  - Shadows on the sheet (long shadows fall toward the upper left) mostly land on stands or roofs and no object of known
//    height has a clean shadow, so no height comes from them.
// FROM TEXT SOURCES (Wikipedia, Clem, Baseball-Reference Bullpen): posted distances 335/358/408/375/330, 8 ft walls, red-brick
//  Ebbets-Field style exterior with the Jackie Robinson Rotunda at home plate, open bowl with a roof canopy over the upper level
//  only (no retractable roof), Shea Bridge in right-center.
// STILL ESTIMATED: stand heights (lower slope 0.34, upper slope 0.5 and rises: no row counts possible at the photo resolution),
//  tier gaps and concourse levels (one slope per deck), outfield seat depth (LF 128 ft, RF 116 ft from the facade distance),
//  bay pitch 28 ft, light tower positions (six, spaced by eye from photos 3-7), roof truss depth 30 ft, RF board position
//  (placed from the bearing in photo 4), flagpole spacing, pavilion positions.
const D2R = Math.PI / 180;
const FAC = [[-86, -480], [-166, -435], [-262, -387], [-328, -335], [-349, -293], [-355, -225], [-345, -170], [-336, -122],
  [-318, -65], [-302, -9], [-274, 37], [-234, 88], [-189, 133], [-132, 176], [-64, 197], [0, 212], [64, 204], [135, 190],
  [192, 165], [232, 125], [266, 77], [297, 25], [322, -31], [335, -88], [338, -151]];
// wall corners as [x, z]; converted to deg/r in config()
const WALL_XZ = [[-237, -237], [-231, -249], [-205, -296], [-38, -411], [31, -411], [69, -389], [84, -380], [167, -333], [233, -231]];
const GATES = [[-189, 133], [192, 165], [-318, -65], [322, -31], [-262, -387]];   // gate pavilions (besides the rotunda)
const ROOF_W = 30;

export default {
  config(rec) {
    const wall = WALL_XZ.map(([x, z], i) => {
      let deg = Math.atan2(x, -z) / D2R, r = Math.hypot(x, z);
      if (i === 0) { deg = -45; r = 335; }
      if (i === WALL_XZ.length - 1) { deg = 45; r = 330; }
      if (i === 3 || i === 4) r = i === 3 ? 410 : 409;
      return { deg, r, h: 8 };
    });
    wall.splice(4, 0, { deg: 0, r: 408, h: 8 });   // posted center-field distance
    return {
      wall, foulScale: 0.98, backstop: 42,
      // bowl tables, t = 0 right-field end .. 1 left-field end (see the SEATING note at the top)
      lower: {
        depth: [[0, 58], [0.05, 62], [0.1, 78], [0.2, 100], [0.3, 95], [0.4, 82], [0.45, 76], [0.5, 70], [0.55, 72], [0.6, 78], [0.7, 86], [0.8, 90], [0.9, 82], [0.95, 70], [1, 62]],
        slope: 0.34, extent: [0, 1],
      },
      hasUpper: true,
      upper: {
        overhang: [[0, 4], [0.1, 4], [0.2, 8], [0.3, 8], [0.4, 14], [0.45, 22], [0.5, 34], [0.55, 32], [0.6, 20], [0.7, 10], [0.8, 8], [0.9, 6], [1, 4]],
        rise: [[0, 24], [0.05, 24], [0.1, 22], [0.2, 18], [0.3, 18], [0.4, 16], [0.45, 20], [0.5, 24], [0.6, 22], [0.7, 20], [0.8, 18], [0.9, 22], [0.95, 24], [1, 24]],
        depth: [[0, 74], [0.05, 82], [0.1, 90], [0.2, 92], [0.3, 103], [0.4, 120], [0.45, 111], [0.5, 122], [0.55, 118], [0.6, 107], [0.7, 96], [0.8, 88], [0.9, 74], [0.95, 71], [1, 62]],
        slope: 0.5, extent: [0.05, 0.95],
      },
      outfield: {
        depth: 100, slope: 0.55,
        spans: [[-45, -5.7, 128, 0.62], [6.2, 12.5, 62, 0.5], [26.7, 45, 116, 0.58]],
        eye: [-5.7, 6.2], eyeHeight: 40, eyeDepth: 44,
      },
      skip: { canopy: true, lights: true, scoreboard: true },
      colors: { seat: '#3d5c47', facade: '#8a5646', wall: '#2c4772', cream: '#e0d5b8' },
    };
  },

  build(ctx) {
    const { THREE, add, lam, dims } = ctx;
    const low = ctx.lod === 'low';
    const G = ctx.G;
    const FASC = 104;                 // facade parapet top (photo 1/2: ~ 5.8 ft people, 20 ft ground arches)
    const ROOF_I = 124;               // inner roof truss level
    const mats = {
      brick: lam('#8c5442'), pier: lam('#96583f'), ring: lam('#b58862'), cream: lam('#d6caa8'), granite: lam('#5d5a54'),
      dark: lam('#23262b'), glass: lam('#2c3a46'), roofTop: lam('#5c6670'), steel: lam('#43413d'), red: lam('#7e3f33'),
      lamp: new THREE.MeshBasicMaterial({ color: '#f1e6bf' }), house: lam('#6c6e6f'), flag: lam('#d8cfb8'),
      panelA: lam('#7c4a42'), panelB: lam('#5f4a58'), panelC: lam('#2f353c'),
    };
    const dummy = new THREE.Object3D();
    const box = new THREE.BoxGeometry(1, 1, 1);
    const disc = new THREE.CircleGeometry(1, 12, 0, Math.PI);   // arch head, flat, faces +z
    // instance lists: key -> [Matrix4]
    const L = {}, LG = {};
    const list = (k, geo) => { if (!L[k]) { L[k] = []; LG[k] = geo || box; } return L[k]; };
    const putBox = (k, x, y, z, ry, sx, sy, sz, geo) => { dummy.position.set(x, y, z); dummy.rotation.set(0, ry, 0); dummy.scale.set(sx, sy, sz); dummy.updateMatrix(); list(k, geo).push(dummy.matrix.clone()); };
    const putBar = (k, ax, ay, az, bx, by, bz, tx, ty) => {
      const a = new THREE.Vector3(ax, ay, az), b = new THREE.Vector3(bx, by, bz);
      dummy.position.copy(a).add(b).multiplyScalar(0.5); dummy.rotation.set(0, 0, 0); dummy.lookAt(b); dummy.scale.set(tx, ty, a.distanceTo(b)); dummy.updateMatrix(); list(k).push(dummy.matrix.clone());
    };
    // local frame at (cx, cz) turned by ry: u along the face, v out of the face
    const fr = (cx, cz, ry) => ({ ry, w: (u, v) => [cx + u * Math.cos(ry) + v * Math.sin(ry), cz - u * Math.sin(ry) + v * Math.cos(ry)] });
    const fBox = (k, f, u, y, v, su, sy, sv) => { const [x, z] = f.w(u, v); putBox(k, x, y, z, f.ry, su, sy, sv); };
    const fBar = (k, f, u1, y1, v1, u2, y2, v2, tx, ty) => { const [x1, z1] = f.w(u1, v1), [x2, z2] = f.w(u2, v2); putBar(k, x1, y1, z1, x2, y2, z2, tx, ty); };
    const flush = () => {
      const matOf = { brick: mats.brick, pier: mats.pier, ring: mats.ring, cream: mats.cream, dark: mats.dark, glass: mats.glass, steel: mats.steel, red: mats.red, lamp: mats.lamp, house: mats.house, flag: mats.flag, panelA: mats.panelA, panelB: mats.panelB, panelC: mats.panelC, face: faceMat, granite: mats.granite };
      for (const k of Object.keys(L)) {
        const m = new THREE.InstancedMesh(LG[k], matOf[k], L[k].length);
        L[k].forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; G.add(m);
      }
    };
    // blank board face: dark panel with a fine plain line grid
    const faceTex = ctx.tools.textTexture((g, w, h) => {
      g.fillStyle = '#1d242b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f3a43'; g.lineWidth = 1;
      for (let x = 0; x <= w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y <= h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, 128, 64);
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTex });

    // ---- resample the facade line to even stations with outward normals
    const step = 14, P = [];
    for (let i = 0; i < FAC.length - 1; i++) {
      const a = FAC[i], b = FAC[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / step));
      for (let k = 0; k < n; k++) P.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    P.push(FAC[FAC.length - 1]);
    const N = ctx.tools.normalsFor(P, [0, -150]);

    // ---- facade shell: granite plinth, brick body, belt course, string course and cornice (one material each)
    const sw1 = (poly, mat) => {
      const g = ctx.tools.sweepSolid(P, N, () => poly, [0, 0, 0, 0], 0); g.clearGroups(); return add(g, mat);
    };
    sw1([[-7, 0], [0, 0], [0, FASC], [-7, FASC]], mats.brick);
    sw1([[-7, 0], [1.6, 0], [1.6, 3.5], [-7, 3.5]], mats.granite);
    sw1([[-7, 26], [2.4, 26], [2.4, 30], [-7, 30]], mats.cream);        // belt course over the ground arcade
    sw1([[-7, 90], [1.2, 90], [1.2, 91.6], [-7, 91.6]], mats.cream);    // string course under the parapet
    sw1([[-7, FASC - 3], [2.6, FASC - 3], [2.6, FASC + 1], [-7, FASC + 1]], mats.cream);   // cornice

    // ---- bays: brick piers, two-story arched windows above a ground arcade of small arches
    const place = (k, x, y, z, nx, nz, sx, sy, sz, off = 0, geo) => putBox(k, x + nx * off, y, z + nz * off, Math.atan2(nx, nz), sx, sy, sz, geo);
    const bayIdx = []; for (let i = 0; i < P.length - 2; i += 2) bayIdx.push(i);
    const bayMid = (i) => [(P[i][0] + P[i + 2][0]) / 2, (P[i][1] + P[i + 2][1]) / 2];
    bayIdx.forEach((i) => {
      const [mx, mz] = bayMid(i), nx = N[i + 1][0], nz = N[i + 1][1];
      place('pier', P[i][0], 60, P[i][1], N[i][0], N[i][1], 8.5, 60, 2.6, 0.9);                         // pier, y 30..90
      place('cream', P[i][0], 28.8, P[i][1], N[i][0], N[i][1], 4, 3.4, 3.4, 1.7);                       // corbel under the belt course
      // tall window: glass with an arched head, buff arch ring, transom
      place('glass', mx, 32 + 21, mz, nx, nz, 17, 42, 0.8, 0.3);
      place('glass', mx, 74, mz, nx, nz, 8.5, 8.5, 1, 0.3, disc);
      place('ring', mx, 74, mz, nx, nz, 11, 11, 1, 0.1, disc);
      place('steel', mx, 58, mz, nx, nz, 17.4, 1.1, 1, 0.8);
      if (!low) place('steel', mx, 53, mz, nx, nz, 1, 42, 1, 0.8);                                      // center mullion
      // ground-level small arch
      place('dark', mx, 12, mz, nx, nz, 11, 16, 0.8, 0.3);
      place('dark', mx, 20, mz, nx, nz, 5.5, 5.5, 1, 0.3, disc);
      place('ring', mx, 20, mz, nx, nz, 7.2, 7.2, 1, 0.1, disc);
    });
    const nearest = (x, z) => { let bi = 0, bd = 1e9; P.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - z); if (d < bd) { bd = d; bi = i; } }); return bi; };

    // ---- entrance pavilions (low brick gate blocks) and the rotunda arcade at home plate
    {
      GATES.forEach(([x, z]) => {
        const i = nearest(x, z), [px, pz] = P[i], [nx, nz] = N[i];
        place('brick', px, 20, pz, nx, nz, 34, 40, 6, 3);
        place('cream', px, 41, pz, nx, nz, 38, 3, 8, 3);
        place('dark', px, 14, pz, nx, nz, 15, 24, 1, 6.2);
        place('dark', px, 26, pz, nx, nz, 7.5, 7.5, 1, 6.2, disc);
        place('ring', px, 26, pz, nx, nz, 9.5, 9.5, 1, 6.0, disc);
      });
      const ri = nearest(0, 212), [rx, rz] = P[ri], [rnx, rnz] = N[ri];
      place('brick', rx, 15, rz, rnx, rnz, 116, 30, 13, 6.5);        // projecting ground arcade
      place('cream', rx, 31, rz, rnx, rnz, 120, 3.2, 15, 6.5);
      place('cream', rx, 33.5, rz, rnx, rnz, 118, 1.2, 16.5, 6.5);
      const px = (o) => [rx + (-rnz) * o, rz + rnx * o];
      for (let k = 0; k < 7; k++) {
        const [x, z] = px((k - 3) * 15.5);
        place('dark', x, 11, z, rnx, rnz, 9, 20, 1, 13.2); place('dark', x, 21, z, rnx, rnz, 4.5, 4.5, 1, 13.2, disc); place('ring', x, 21, z, rnx, rnz, 6, 6, 1, 13.0, disc);
      }
      for (let k = 0; k < 8; k++) { const [x, z] = px((k - 3.5) * 15.5); place('pier', x, 14, z, rnx, rnz, 3.4, 28, 3, 13.4); }
      // plain name text on the rotunda parapet (no marks)
      const tex = ctx.tools.textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#c8a266'; g.font = 'bold 120px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CITI FIELD', w / 2, h / 2 + 4);
      }, 1024, 160);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(92, 14.4), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      sign.position.set(rx + rnx * 3.0, 96, rz + rnz * 3.0); sign.rotation.y = Math.atan2(rnx, rnz); G.add(sign);
      // the same plain name text on the left and right facade parapets
      for (const [sx2, sz2, wd] of [[-355, -235, 64], [338, -85, 60]]) {
        const j = nearest(sx2, sz2), [qx, qz] = P[j], [qnx, qnz] = N[j];
        const sg = new THREE.Mesh(new THREE.PlaneGeometry(wd, wd * 0.156), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        sg.position.set(qx + qnx * 3.0, 96, qz + qnz * 3.0); sg.rotation.y = Math.atan2(qnx, qnz); G.add(sg);
      }
      // rotunda flagpole with a plain cloth
      const [fx, fz] = px(-52);
      place('steel', fx, FASC + 26, fz, rnx, rnz, 0.9, 52, 0.9, 1);
      place('flag', fx + (-rnz) * 0, FASC + 48, fz, rnx, rnz, 0.5, 7, 12, 1);
    }

    // ---- roof: slate ribbon, ribs, columns
    const O = P.map((p) => [p[0], p[1]]);
    const I = P.map((p, i) => [p[0] - N[i][0] * ROOF_W, p[1] - N[i][1] * ROOF_W]);
    {
      const pos = [], idx = [];
      O.forEach((o, i) => { pos.push(o[0] + N[i][0] * 1.5, FASC + 1, o[1] + N[i][1] * 1.5, I[i][0], ROOF_I, I[i][1]); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      add(g, mats.roofTop);
      const trim = ctx.tools.sweepSolid(P, N, () => [[-ROOF_W, ROOF_I - 3.5], [-ROOF_W + 1.5, ROOF_I - 3.5], [-ROOF_W + 1.5, ROOF_I + 0.8], [-ROOF_W, ROOF_I + 0.8]], [0, 0, 0, 0], 0);
      trim.clearGroups(); add(trim, mats.steel);
    }
    bayIdx.filter((_, k) => (low ? k % 2 === 0 : true)).forEach((i) => {
      putBar('steel', O[i][0], FASC - 1.5, O[i][1], I[i][0], ROOF_I - 2, I[i][1], 1.6, 2.6);
      const cx = I[i][0] + N[i][0] * 12, cz = I[i][1] + N[i][1] * 12, top = ROOF_I - 3.5, bot = dims.hTop - 30;
      putBox('steel', cx, (top + bot) / 2, cz, 0, 1.3, top - bot, 1.3);
    });

    // ---- portal light towers on the roof edge: four lattice legs, three arched lamp banks, aimed at the infield
    const towerAt = [0.1, 0.22, 0.34, 0.66, 0.78, 0.9];
    towerAt.forEach((fx) => {
      const i = Math.round(fx * (P.length - 1)), [x, z] = I[i];
      const f = fr(x, z, Math.atan2(-N[i][0], -N[i][1]));
      const tops = [34, 43, 43, 34], us = [-39, -13, 13, 39];
      us.forEach((u, k) => {
        fBox('steel', f, u, ROOF_I + tops[k] / 2 - 1, 0, 3.8, tops[k] + 2, 3.8);
        if (!low) fBox('steel', f, u, ROOF_I + tops[k] * 0.55, 0, 1.2, 1.2, 12);   // cross strut
      });
      for (let k = 0; k < 3; k++) {
        const y1 = ROOF_I + tops[k], y2 = ROOF_I + tops[k + 1], mid = (y1 + y2) / 2 + 3;
        fBar('dark', f, us[k], y1, 0, us[k + 1], y2, 0, 3.4, 9);
        fBar('lamp', f, us[k] + 2, y1 + 0.6, 2.2, us[k + 1] - 2, y2 + 0.6, 2.2, 0.4, 6.5);
      }
    });

    // ---- scoreboards: main video board with frame, side panels, back truss and house; right-field and left-field boards
    {
      // main board: structure x -49..129 (sheet), z -495..-475; frame photo 4 (eye 40 ft and wall 8 ft as the scale)
      const cx = 40, cz = -482, f = fr(cx, cz, Math.atan2(-cx, -cz) * 1.0);
      const base = 38;
      putBox('house', cx, base / 2, cz - 3, 0, 178, base, 32);                          // scoreboard house behind the eye
      putBox('granite', cx, base + 0.6, cz - 3, 0, 180, 1.2, 34);
      // board
      fBox('face', f, 0, 77, 0, 90, 50, 3);                                             // video face y 52..102
      fBox('panelC', f, 0, 45, 0, 90, 14, 3);                                           // lower ad strip, blank
      fBox('panelC', f, 0, 123, 0.5, 100, 40, 4);                                       // header block y 103..143
      for (const s of [-1, 1]) {
        fBox('steel', f, s * 49, base + 55, 0, 6, 110, 6);                              // side lattice columns
        const nb = low ? 3 : 8;
        for (let k = 0; k < nb; k++) { const y0 = base + 2 + k * (106 / nb), y1 = y0 + 106 / nb; fBar('steel', f, s * 49 - 3.4 * (k % 2 ? -1 : 1), y0, 3.3, s * 49 + 3.4 * (k % 2 ? -1 : 1), y1, 3.3, 0.8, 0.8); }
      }
      // arched header top
      for (let k = 0; k < 6; k++) {
        const a = -1 + k / 3, b = -1 + (k + 1) / 3, h = (u) => 144 + 5 * (1 - u * u);
        fBar('steel', f, a * 52, h(a), 0.8, b * 52, h(b), 0.8, 2.2, 2.2);
      }
      fBox('steel', f, 0, base + 2, 3, 100, 2, 6);
      // flank panels (blank, muted)
      for (const s of [-1, 1]) {
        const u = s * 70;
        fBox(s < 0 ? 'panelA' : 'panelB', f, u, 80, 0, 34, 36, 2.5);
        fBox('panelC', f, u, 56, 0, 34, 12, 2.5);
        fBox('panelC', f, u, 42, 0, 34, 14, 2.5);
        fBox('steel', f, u + s * 18.5, base + 30, 0, 2.5, 62, 2.5);
      }
      // back catwalk truss and legs (sheet: lattice strip z -493..-475)
      fBox('steel', f, 0, 100, -10, 176, 2.4, 3.5);
      fBox('steel', f, 0, 92, -10, 176, 1.6, 2.5);
      const nt = low ? 8 : 20;
      for (let k = 0; k < nt; k++) { const u0 = -88 + k * 176 / nt, u1 = u0 + 176 / nt; fBar('steel', f, k % 2 ? u1 : u0, 92, -10, k % 2 ? u0 : u1, 100, -10, 0.9, 0.9); }
      for (const u of [-80, -30, 30, 80]) fBox('steel', f, u, base + 27, -10, 3, 54, 3);
      // plain name text on the header (no marks)
      const tex = ctx.tools.textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#c8a266'; g.font = 'bold 110px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CITI FIELD', w / 2, h / 2 + 4); }, 1024, 160);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(70, 11), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      const [sx, sz] = f.w(0, 2.6); sign.position.set(sx, 130, sz); sign.rotation.y = f.ry; G.add(sign);

      // right-field board on a tall tower (photo 4): 80 x 45 face, two lattice posts, arched lamp bank
      {
        const bx = 236, bz = -432, g2 = fr(bx, bz, Math.atan2(-bx, -bz));
        fBox('face', g2, 0, 92, 0, 80, 45, 3);
        fBox('steel', g2, 0, 117, 0, 84, 3, 3.5);
        fBox('steel', g2, 0, 68, 0, 84, 3, 3.5);
        for (const u of [-45, 45]) fBox('steel', g2, u, 82, 0, 5, 164, 5);
        for (const u of [-45, 45]) for (let k = 0; k < (low ? 2 : 5); k++) fBar('steel', g2, u - 2.6, 4 + k * 32, 3, u + 2.6, 4 + (k + 1) * 32, 3, 0.8, 0.8);
        for (let k = 0; k < 4; k++) { const a = -1 + k / 2, b = -1 + (k + 1) / 2, h = (u) => 158 + 6 * (1 - u * u); fBar('dark', g2, a * 45, h(a), 0, b * 45, h(b), 0, 2.6, 8); fBar('lamp', g2, a * 45, h(a), 2, b * 45, h(b), 2, 0.4, 6); }
      }
      // left-field board on the roof (photo 4): 52 x 34 face on two posts
      {
        const bx = -104, bz = -476, g3 = fr(bx, bz, Math.atan2(-bx, -bz));
        fBox('face', g3, 0, ROOF_I + 22, 0, 52, 30, 2.5);
        fBox('steel', g3, 0, ROOF_I + 38, 0, 56, 2.4, 3);
        fBox('steel', g3, 0, ROOF_I + 6, 0, 56, 2.4, 3);
        for (const u of [-26, 26]) fBox('steel', g3, u, ROOF_I + 20, 0, 3.4, 40, 3.4);
      }
    }

    // ---- flagpoles along the roof's outer edge (plain cloth)
    {
      const every = low ? 8 : 4;
      for (let i = 2; i < P.length - 1; i += every) {
        putBox('steel', O[i][0] + N[i][0] * 1.5, FASC + 10, O[i][1] + N[i][1] * 1.5, 0, 0.5, 18, 0.5);
        putBox('flag', O[i][0] + N[i][0] * 1.5 + N[i][0] * 0, FASC + 17, O[i][1] + N[i][1] * 1.5, Math.atan2(N[i][0], N[i][1]), 0.3, 3.5, 5);
      }
    }

    // ---- signature features: Home Run Apple, Shea Bridge
    {
      const eyeTop = 40;
      const apple = add(new THREE.SphereGeometry(8, 14, 10), lam('#a8362c')); apple.position.set(0, eyeTop + 8, -424);
      const stem = add(new THREE.CylinderGeometry(0.8, 0.8, 4, 6), lam('#3d5a2f')); stem.position.set(0, eyeTop + 17, -424);
      const a = new THREE.Vector3(150, 56, -455), b = new THREE.Vector3(255, 56, -365), len = a.distanceTo(b);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const bridge = new THREE.Mesh(box, mats.red); bridge.position.copy(mid); bridge.lookAt(b); bridge.scale.set(6, 3, len); G.add(bridge);
      const chord = new THREE.Mesh(box, mats.red); chord.position.copy(mid).setY(80); chord.lookAt(b.clone().setY(80)); chord.scale.set(2.2, 2.2, len * 0.8); G.add(chord);
      const nv = low ? 6 : 12, dir = b.clone().sub(a).normalize();
      for (let k = 0; k < nv; k++) {
        const t = (k + 0.5) / nv, p = a.clone().addScaledVector(dir, t * len), arc = 56 + 24 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.1) / 0.8)));
        putBox('red', p.x, (56 + arc) / 2, p.z, 0, 1.6, arc - 56, 1.6);
      }
    }

    flush();
    if (ctx.parts.batterEye) ctx.parts.batterEye.material = mats.dark;

    // ---- views
    ctx.views.gate = { pos: [130, 20, 440], look: [0, 48, 215], label: 'Rotunda' };
    ctx.views.roof = { pos: [420, 210, 300], look: [-40, 80, 40], orbit: false, label: 'Canopy' };
    ctx.views.stands = { pos: [-250, 70, -330], look: [60, 20, 60], label: 'Left Field Stands' };
    ctx.views.board = { pos: [-20, 90, 60], look: [40, 85, -482], label: 'Video Board' };
  },
};
