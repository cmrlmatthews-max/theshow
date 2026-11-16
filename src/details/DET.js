// Detail module: Comerica Park, Detroit Tigers (opened 2000). Units: feet. Fitted to the satellite sheet (rework pass).
// MEASURED FROM THE SHEET (home plate at origin, CF up; the sheet axis is ~150 deg bearing):
//  outfield wall corners: LF pole (-242,-242) r342; straight LF wall to (-76,-402) r409; chamfer to (-52,-413); CF wall flat at
//  z=-413 to (75,-413) r420 (CF 412); chamfer (99,-402); RCF corner (142,-359); step (148,-333) r364; straight RF wall to
//  (219,-260); RF pole (233,-233). Foul edge fits the generic curve; backstop 50 ft; lower deck rear (white curb) 85-90 ft out,
//  upper deck rear 140-145 ft, roof/facade edge ~170 ft out (behind home z=222); facade polygon traced all round (left edge
//  x=-386, right edge x=+380, LF corner (-378,-394), north edge z=-472, RF diagonal (204,-412)-(266,-315), RF corner (377,-286));
//  batter's eye x -79..72 depth 26 flush behind the wall; rectangular CF fountain basin x -79..72, z -472..-439;
//  two LF bullpens behind the LF wall (t 0.30-0.88 along it, ~28 ft deep) with a block between them; LF mast near (-203,-476);
//  Ferris wheel (286,-330) behind the RF stands; carousel (321,148) behind first base; RF seat depth ~85 ft.
// FROM TEXT (Wikipedia, MLB.com): posted distances LF 342, LCF 370, CF 412, RCF 365, RF 330; walls 7 ft (taller RF corner);
//  open-air, three levels; brick exterior; fountain behind CF; Ferris wheel and carousel.
// LEVEL 4 (photos 1-8 in refs/DET, sheet strips unwrapped along the foul-edge normals):
//  SEATING (sheet): lower deck rear (cross-aisle arc) 98 ft out behind home, ~108-114 on the 1B side, ~104 toward LF; upper rows
//  run to ~148-158 ft where the dark roof band starts; 1B upper deck sits ~13 ft lower (text, andrewclem.com); upper deck ~50 ft deep.
//  FACADE (photos 2,3): low tan stone/brick arcade (~52 ft, 3 tiers of round-headed windows) with the steel canopy on open columns
//  above it; green hip-roofed brick gate towers; canopy is a flat blue-grey steel roof; outfield mass ~38 ft.
//  LIGHTS (photos 5,6): groups of three lamp banks on ~36 ft poles with a cross tube on the roof edge; RF lattice tower outside.
//  BOARDS (photos 4,7,8 + sheet): main board centre/orientation from the sheet (steel band (-306,-384)..(-202,-477), face to home);
//  size from the 2024 text (185x67 ft main, 96x35 ft lower; the sheet's 140 ft band is the older board); two flanking lattice towers
//  (~150 ft) with stacked lamp panels, truss behind, catwalks; ribbon boards ~75x3.5 ft on the upper fascia; yellow in-play pole.
//  HEIGHTS: wall 7/12 ft (text) is the scale for photo 7 (board face ~ 9 wall heights tall); facade top and canopy from deck table
//  (lower top ~40, upper front ~57, upper top ~93 behind home); shadow ratio ~0.45 assumed (sun az ~195 deg, high), only used as a
//  sanity check (facade shadows 15-35 ft wide on lower roofs fit 50-90 ft).
// STILL ESTIMATED: all heights above (no true scale in photos), deck seat layout detail, RF light tower and RCF board (text only),
//  gate/tower positions and bay rhythm, Ferris wheel and carousel sizes, bullpen details, flagpole heights. Not built (rules):
//  tiger sculptures, logos, sponsor names, board script.
const D2R = Math.PI / 180;

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 342, h: 7 }, { deg: -10.7, r: 409, h: 7 }, { deg: -7.2, r: 416, h: 7 }, { deg: 0, r: 412, h: 7 },
        { deg: 10.3, r: 420, h: 7 }, { deg: 13.8, r: 414, h: 7 }, { deg: 21.6, r: 386, h: 7 }, { deg: 24, r: 364, h: 7 },
        { deg: 40.1, r: 340, h: 7 }, { deg: 40.15, r: 340, h: 12 }, { deg: 45, r: 330, h: 12 },
      ],
      foulScale: 1,
      backstop: 50,
      // bowl measured in foul-normal strips of the sheet (see the top comment); t 0 = RF pole, 0.5 = behind home, 1 = LF pole
      lower: { depth: [[0, 100], [0.12, 108], [0.3, 114], [0.44, 108], [0.5, 106], [0.62, 106], [0.76, 108], [0.9, 104], [1, 96]], slope: 0.32, extent: [0, 1] },
      hasUpper: true,
      // upper deck: ~50 ft deep behind the lower rear; the 1B side sits ~14 ft lower (one suite level), text: andrewclem.com
      upper: { overhang: 8, rise: [[0, 9], [0.3, 9], [0.46, 22], [1, 22]], depth: [[0, 52], [0.15, 48], [0.3, 46], [0.5, 50], [0.7, 48], [0.85, 50], [1, 50]], slope: 0.72, extent: [0.02, 0.98] },
      outfield: { depth: 60, slope: 0.42, spans: [[-45, -31.9, 55, 0.4], [13.8, 45, 85, 0.42]], eye: [-10.7, 10.3], eyeHeight: 40, eyeDepth: 26 },
      skip: { canopy: true, lights: true, scoreboard: true },
      colors: { seat: '#26364f', facade: '#b49a78', wall: '#27382f', cream: '#e4d8b8' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, C, views } = ctx;
    const { sweepSolid, textTexture, wallH, clamp, normalsFor } = tools;
    const { bPts, bN } = paths;
    const spec = ctx.spec;
    const low = ctx.lod === 'low';
    const N1 = bPts.length - 1;
    const lam = ctx.lam;
    const lampM = new THREE.MeshBasicMaterial({ color: '#f1ead0' }), boardM = new THREE.MeshBasicMaterial({ color: '#1d2a26' });
    const creamL = lam('#e0d6b6'), penM = lam('#cdbf9c'), dirtM = lam(C.dirt), basinM = lam('#c8c0a4'), waterM = lam('#79a2ac'), jetM = lam('#e8f0ec'), carM = lam('#d8cfae');
    const dark = lam('#3d3a36'), steel = lam('#7d8083'), brick = lam('#8e5640'), brickDk = lam('#6f4332'), cream = lam('#e4d8b8');
    const glass = new THREE.MeshBasicMaterial({ color: '#33424a' }), green = lam('#5f7a68');
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0, rx = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(rx, ry, 0, 'YXZ'); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx));
      m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const box = new THREE.BoxGeometry(1, 1, 1);
    // batching: every repeated part goes into one InstancedMesh per (geometry, material)
    const buckets = new Map();
    const put = (geo, mat, matrix) => { let b = buckets.get(geo); if (!b) buckets.set(geo, (b = new Map())); let l = b.get(mat); if (!l) b.set(mat, (l = [])); l.push(matrix); };
    // placed in a local frame of group g (position + lookAt), local position/scale/rotation
    const putL = (g, geo, mat, lx, ly, lz, sx, sy, sz, rz = 0, ry = 0) => {
      const o = new THREE.Object3D(); o.position.set(lx, ly, lz); o.rotation.set(0, ry, rz); o.scale.set(sx, sy, sz); g.add(o); g.updateMatrixWorld(true); o.updateMatrix();
      put(geo, mat, new THREE.Matrix4().multiplyMatrices(g.matrixWorld, o.matrix)); g.remove(o);
    };
    const mkG = (x, y, z, lx, ly, lz) => { const g = new THREE.Object3D(); g.position.set(x, y, z); if (lx !== undefined) g.lookAt(lx, ly, lz); return g; };
    const flush = () => { for (const [geo, mm] of buckets) for (const [mat, list] of mm) inst(geo, mat, list); };

    ctx.remove(parts.canopy); ctx.remove(parts.lights); ctx.remove(parts.scoreboard);

    // ---------- 1. Exterior facade: one closed path, foul side then the outfield arc
    // measured facade polygon [x, z, tall]; tall = stands with a deck behind (92 ft), otherwise concourse/outfield mass (38 ft)
    const FAC = [
      [380, -229, 1], [374, -111, 1], [360, -38, 1], [338, 10, 1], [296, 86, 1], [235, 160, 1], [150, 203, 1], [76, 216, 1], [0, 222, 1],
      [-80, 212, 1], [-124, 202, 1], [-196, 144, 1], [-247, 78, 1], [-298, 9, 1], [-330, -50, 1], [-360, -111, 1], [-374, -160, 1],
      [-383, -215, 1], [-382, -290, 1],
      [-378, -394, 0], [-330, -432, 0], [-258, -470, 0], [-79, -478, 0], [72, -478, 0], [140, -458, 0], [204, -412, 0], [266, -315, 0],
      [310, -287, 0], [377, -286, 0], [380, -229, 0],
    ];
    const P = [], Dg = [];
    for (let k = 0; k < FAC.length - 1; k++) {
      const [x0, z0, t0] = FAC[k], [x1, z1] = FAC[k + 1], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / (low ? 16 : 10)));
      for (let j = 0; j < n; j++) { P.push([x0 + (x1 - x0) * j / n, z0 + (z1 - z0) * j / n]); Dg.push(t0 ? 0 : 1); }
    }
    P.push(P[0].slice()); Dg.push(Dg[0]);
    const nrm = normalsFor(P, [0, -dims.cf * 0.42]);
    const cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = cum[cum.length - 1];
    let foulIdx = 0; while (foulIdx < P.length && Dg[foulIdx] === 0) foulIdx++;
    const foulLen = cum[Math.max(foulIdx - 1, 1)];
    const dk = dims.deckAt, N1b = dims.N1;
    const gOf = (i) => Math.round(clamp(cum[Math.min(i, P.length - 1)] / foulLen, 0, 1) * N1b);
    const H = (i) => (Dg[i] === 0 ? 52 : 38);   // photos 2,3: a low tan-stone/brick arcade (~3 storeys) with the open canopy on columns above
    ctx.add(sweepSolid(P, nrm, (i) => [[-2, 0], [-2, H(i)], [0, H(i)], [0, 0]], [MAT.FACADE, MAT.FACADE, MAT.FACADE, -1], MAT.FACADE), M);
    ctx.add(sweepSolid(P, nrm, (i) => [[-2.6, H(i) - 6], [-2.6, H(i) + 3], [1.6, H(i) + 3], [1.6, H(i) - 6]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
    ctx.add(sweepSolid(P, nrm, () => [[-2.6, 0], [-2.6, 8], [1.2, 8], [1.2, 0]], [MAT.SHADE, MAT.SHADE, MAT.SHADE, -1], MAT.SHADE), M);
    // cream string courses between the window tiers (tall mass only; the outfield mass is one storey)
    for (const fr of [0.52]) ctx.add(sweepSolid(P, nrm, (i) => { const y = H(i) * fr, o = Dg[i] === 0 ? 1 : 0; return [[-2.2, y - 1.4 * o], [-2.2, y + 1.4 * o], [1.1 * o, y + 1.4 * o], [1.1 * o, y - 1.4 * o]]; }, [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
    const at = (s) => {
      s = clamp(s, 0, total - 0.01); let i = 1; while (cum[i] < s) i++;
      const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1]);
      return { x: P[i - 1][0] + (P[i][0] - P[i - 1][0]) * t, z: P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t,
        nx: nrm[i - 1][0], nz: nrm[i - 1][1], tall: Dg[i] === 0 };
    };
    const planeG = new THREE.PlaneGeometry(1, 1);
    const archTopG = new THREE.CircleGeometry(1, 10, 0, Math.PI);
    const sIdx = (s) => { let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; return i; };
    const coneG = new THREE.ConeGeometry(1, 1, 4);
    const spacing = low ? 40 : 26;
    for (let s = 6; s < total; s += spacing) {
      const q = at(s), ry = Math.atan2(q.nx, q.nz), h = q.tall ? 52 : 38, hRoof = dk.hTop(gOf(sIdx(s))) + 15;
      put(box, brickDk, mat4(q.x + q.nx * 0.6, h / 2, q.z + q.nz * 0.6, 4.6, h, 2.4, ry));
      if (q.tall) put(box, steel, mat4(q.x - q.nx * 0.5, (h + hRoof) / 2, q.z - q.nz * 0.5, 1.4, hRoof - h, 1.4, ry));   // open canopy column
      if (!low) {
        const m = at(s + spacing / 2), ry2 = Math.atan2(m.nx, m.nz), hm = m.tall ? 52 : 38;
        // tall mass: three window tiers (concourse, club/suite, upper) with round-headed tops; outfield mass: one tier
        const tiers = m.tall ? [14, 37] : [19];
        for (const y of tiers) {
          put(planeG, glass, mat4(m.x + m.nx * 0.4, y, m.z + m.nz * 0.4, 8, 10, 1, ry2));
          put(archTopG, glass, mat4(m.x + m.nx * 0.4, y + 5, m.z + m.nz * 0.4, 4, 4, 1, ry2));
          put(planeG, cream, mat4(m.x + m.nx * 0.3, y - 6.2, m.z + m.nz * 0.3, 9.6, 1.2, 1, ry2));   // sill
        }
      }
    }
    // gate pavilions on the foul side: brick towers with cream caps and a steel arch between them
    const archG = new THREE.TorusGeometry(15, 1.1, 5, 14, Math.PI);
    const gates = [0.04, 0.2, 0.36, 0.5, 0.64, 0.8, 0.96];
    const archMats = [];
    gates.forEach((g, k) => {
      const q = at(g * foulLen), ry = Math.atan2(q.nx, q.nz), main = k === 3;
      const tw = main ? 24 : 16, th = main ? 74 : 62, off = main ? 26 : 20;
      for (const sx of [-1, 1]) {
        const ox = q.x + q.nz * sx * off + q.nx * 6, oz = q.z - q.nx * sx * off + q.nz * 6;
        put(box, brick, mat4(ox, th / 2, oz, tw, th, tw, ry));
        put(box, cream, mat4(ox, th + 2.5, oz, tw + 3, 5, tw + 3, ry));
        put(coneG, green, mat4(ox, th + 8, oz, tw * 0.9, 10, tw * 0.9, ry + Math.PI / 4));   // green hip roof (photo 3)
      }
      const sc = main ? 1.5 : 1;
      put(archG, steel, mat4(q.x + q.nx * 8, 36, q.z + q.nz * 8, sc, sc, 1.3, ry));
      put(box, dark, mat4(q.x + q.nx * 1.0, 8, q.z + q.nz * 1.0, 14, 16, 2, ry));
    });

    // ---------- 2. Upper-deck canopy, trusses, columns, light banks
    {
      const [up, un, ua] = tools.cut(0.02, 0.98);
      const roofMs = M.slice(); roofMs[MAT.SHADE] = lam('#46505c');   // blue-grey steel roof (photo 3)
      const dEi = (i) => dk.dEnd(ua + i), hTi = (i) => dk.hTop(ua + i);
      // roof reaches the measured facade: ray-cast each canopy sample outward to the facade polygon
      const hit = (px, pz, nx, nz) => {
        let best = Infinity;
        for (let k = 0; k < P.length - 1; k++) {
          const ex = P[k + 1][0] - P[k][0], ez = P[k + 1][1] - P[k][1], den = nx * ez - nz * ex; if (Math.abs(den) < 1e-9) continue;
          const t = ((P[k][0] - px) * ez - (P[k][1] - pz) * ex) / den, u = ((P[k][0] - px) * nz - (P[k][1] - pz) * nx) / den;
          if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
        }
        return best;
      };
      const dF = up.map((p, i) => { const h = hit(p[0], p[1], un[i][0], un[i][1]); return Math.max(dEi(i) - 10, Math.min(h === Infinity ? dEi(i) + 5 : h - 1, dEi(i) + 60)); });
      // roof sheet: a shallow slope from the back of the seats (hTop + 20) down to the facade edge (hTop + 15 = facade top)
      ctx.add(sweepSolid(up, un, (i) => [[dEi(i) - 22, hTi(i) + 20], [dF[i], hTi(i) + 14.2], [dF[i], hTi(i) + 15.8], [dEi(i) - 22, hTi(i) + 22]], [MAT.SHADE, MAT.SHADE, MAT.SHADE, MAT.SHADE], MAT.SHADE), roofMs);
      ctx.add(sweepSolid(up, un, (i) => [[dEi(i) - 22.5, hTi(i) + 17], [dEi(i) - 22.5, hTi(i) + 24], [dEi(i) - 21.5, hTi(i) + 24], [dEi(i) - 21.5, hTi(i) + 17]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      const stepT = low ? 14 : 7, stepC = low ? 20 : 10;
      for (let i = 2; i < up.length - 1; i += stepT) {
        const mx = up[i][0] + un[i][0] * (dEi(i) - 8.5), mz = up[i][1] + un[i][1] * (dEi(i) - 8.5);
        put(box, steel, mat4(mx, hTi(i) + 17.5, mz, 1.2, 1.4, 25, Math.atan2(un[i][0], un[i][1])));
      }
      for (let i = 4; i < up.length - 1; i += stepC)
        put(box, steel, mat4(up[i][0] + un[i][0] * (dEi(i) + 1.5), hTi(i) / 2 + 8, up[i][1] + un[i][1] * (dEi(i) + 1.5), 1.6, hTi(i) + 16, 1.6, Math.atan2(un[i][0], un[i][1])));
      // roof-edge light groups (photos 5, 6): three lamp banks on ~38 ft poles joined by a horizontal tube, with cable stays
      const nG = low ? 5 : 9;
      for (let k = 0; k < nG; k++) {
        const i = Math.round((k + 0.5) / nG * (up.length - 1));
        const g = mkG(up[i][0] + un[i][0] * (dEi(i) - 14), hTi(i) + 22, up[i][1] + un[i][1] * (dEi(i) - 14), 0, hTi(i) + 22, -dims.cf * 0.3);
        putL(g, box, steel, 0, 40, 0, 70, 0.8, 0.8);
        for (const lx of [-24, 0, 24]) {
          const hh = lx === 0 ? 30 : 36;
          putL(g, box, steel, lx, hh / 2, 0, 1.4, hh, 1.4);
          putL(g, box, dark, lx, hh + 4, 0.6, 11, 9, 1.4);
          if (!low) for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) putL(g, box, lampM, lx + (c - 1) * 3.2, hh + 1.5 + r * 2.8, 1.5, 2.4, 2, 0.4);
        }
      }
    }
    // lattice light towers outside the park (photos 2, 3, 6): RF tower (estimated near (196,-446)); the LF pair flanks the board below
    {
      const g = mkG(196, 0, -446, 0, 0, 0);
      for (const [lx, lz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) putL(g, box, steel, lx, 70, lz, 0.9, 140, 0.9);
      for (const y of [25, 55, 85, 115]) putL(g, box, steel, 0, y, 0, 7, 0.7, 7);
      putL(g, box, dark, 0, 148, 0, 30, 12, 2);
      if (!low) for (let c = 0; c < 6; c++) for (let r2 = 0; r2 < 3; r2++) putL(g, box, lampM, (c - 2.5) * 4.6, 143 + r2 * 4, 1.3, 3.6, 2.6, 0.6);
    }

    // ---------- 3. Signature features
    // main videoboard behind the LF stands: centre/orientation measured on the sheet (steel structure along (-306,-384)..(-202,-477),
    // face toward home, tilted ~42 deg from the z axis); size from the 2024 board (about 185 x 67 ft, with a 96 x 35 ft board below)
    {
      const cx = -262, cz = -416, ang = Math.atan2(0.667, 0.745);
      const g = mkG(cx, 0, cz, cx + 0.667, 0, cz + 0.745);   // local +z = face normal (toward home), local +x along the board
      const gridM = new THREE.MeshBasicMaterial({ map: textTexture((c, w, h) => {
        c.fillStyle = '#17211e'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a3a35'; c.lineWidth = 2;
        for (let x = 0; x <= w; x += w / 24) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
        for (let y = 0; y <= h; y += h / 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      }, 256, 96) });
      const MW = 185, MH = 67, MB = 66;            // main board width, height, bottom
      const LW = 96, LH = 35, LB = 30;             // lower board
      const frame = lam('#6b6f6e');
      const faceG = new THREE.PlaneGeometry(1, 1);
      // frames and faces
      putL(g, box, frame, 0, MB + MH / 2, 0, MW + 4, MH + 4, 5);
      putL(g, faceG, gridM, 0, MB + MH / 2, 2.6, MW, MH, 1);
      putL(g, box, frame, 0, LB + LH / 2, 0, LW + 4, LH + 4, 5);
      putL(g, faceG, gridM, 0, LB + LH / 2, 2.6, LW, LH, 1);
      // back structure: a deep truss frame behind the boards (two chords, verticals, X braces), then columns to the ground
      const tz = -9;
      for (const y of [MB - 4, MB + MH + 4]) putL(g, box, dark, 0, y, tz, MW + 8, 2.2, 9);
      for (const y of [LB - 3, LB + LH + 3]) putL(g, box, dark, 0, y, tz, LW + 6, 2, 9);
      const nBay = low ? 6 : 12, bw = (MW + 8) / nBay;
      for (let k = 0; k <= nBay; k++) putL(g, box, steel, -MW / 2 - 4 + k * bw, MB + MH / 2, tz, 1.6, MH + 8, 1.6);
      if (!low) for (let k = 0; k < nBay; k += 2) {
        const dx = -MW / 2 - 4 + (k + 1) * bw, ang2 = Math.atan2(MH + 8, bw * 2);
        putL(g, box, steel, dx, MB + MH / 2, tz, Math.hypot(bw * 2, MH + 8), 0.9, 0.9, ang2);
        putL(g, box, steel, dx, MB + MH / 2, tz, Math.hypot(bw * 2, MH + 8), 0.9, 0.9, -ang2);
      }
      // two flanking lattice towers (photos 4, 7, 8): square legs, rings and X braces to ~150 ft, stacked lamp panels on top;
      // between them heavy columns carry the boards; a brace line runs under the lower board
      const TH = 150;
      for (const sx of [-1, 1]) {
        const tx = sx * (MW / 2 + 9);
        for (const [lx, lz] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) putL(g, box, steel, tx + lx, TH / 2, tz + lz, 1.1, TH, 1.1);
        const nR = low ? 6 : 12;
        for (let k = 0; k <= nR; k++) putL(g, box, steel, tx, k * TH / nR, tz, 9, 0.7, 9);
        if (!low) for (let k = 0; k < nR; k += 2) { const a2 = Math.atan2(TH / nR * 2, 8); putL(g, box, steel, tx, (k + 1) * TH / nR, tz - 4, 0.8, Math.hypot(8, TH / nR * 2), 0.8, 0, 0); }
        for (let r = 0; r < 4; r++) { putL(g, box, dark, tx, TH + 5 + r * 8, tz, 11, 7, 3); if (!low) for (let c = 0; c < 4; c++) putL(g, box, lampM, tx + (c - 1.5) * 2.4, TH + 5 + r * 8, tz + 1.8, 1.8, 5, 0.4); }
      }
      for (const cxl of [-0.3, 0, 0.3]) putL(g, box, dark, cxl * MW, MB / 2, tz, 5, MB, 5);
      if (!low) for (const sx of [-1, 1]) putL(g, box, steel, sx * MW * 0.25, MB * 0.55, tz, 1.1, MB * 0.95, 1.1, sx * 0.5);
      // catwalks: under the main board, above it, and behind the lower board (plank + rail)
      putL(g, box, steel, 0, MB - 5.5, 4.5, MW + 10, 0.7, 5);
      putL(g, box, steel, 0, MB - 2.2, 7.0, MW + 10, 0.5, 0.5);
      putL(g, box, steel, 0, MB + MH + 6, -1, MW + 10, 0.7, 6);
      putL(g, box, steel, 0, MB + MH + 9.2, 2.2, MW + 10, 0.5, 0.5);
      putL(g, box, steel, 0, LB - 5, 4, LW + 8, 0.7, 4.5);
    }
    // yellow in-play flagpole at the LF/CF corner (photo 7, height ~70 ft estimated by comparing with the 7 ft wall), a tall flagpole
    // beside the board and three bare street flagpoles at the main gate (photo 2)
    {
      const poleG = new THREE.CylinderGeometry(0.5, 0.7, 1, 8), thin = new THREE.CylinderGeometry(0.35, 0.5, 1, 6), yel = lam('#d3b24c');
      const q = tools.wallAt(-10.7, 6, 0);
      put(poleG, yel, mat4(q.x, 35, q.z, 1, 70, 1));
      put(thin, steel, mat4(-150, 45, -400, 1, 90, 1));
      for (const x of [-34, -2, 30]) put(thin, steel, mat4(x, 42, 262, 1, 84, 1));
    }
    // ribbon boards on the upper-deck fascia along each baseline (about 75 x 3.5 ft each)
    for (const tc of [0.27, 0.73]) {
      const g0 = Math.round(tc * dims.N1), a = tools.foulAt(tc - 0.01, dk.d0(g0) + 0.4, dk.h0(g0) - 2.2), b = tools.foulAt(tc + 0.01, dk.d0(g0) + 0.4, dk.h0(g0) - 2.2);
      const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, ry = Math.atan2(b.x - a.x, b.z - a.z);
      put(box, boardM, mat4(mx, a.y, mz, 0.8, 3.5, 75, ry));
    }
    // right-center LED board (added 2007, text only; position and size estimated): on a frame above the RCF wall
    {
      const q = tools.wallAt(18, 40, 0), g = mkG(q.x, 0, q.z, 0, 0, 0);
      putL(g, box, creamL, 0, 33, 0, 52, 15, 3); putL(g, box, boardM, 0, 33, 1.8, 49, 12, 0.6);
      for (const sx of [-0.38, 0.38]) putL(g, box, dark, 52 * sx, 13, -1, 3, 26, 3);
    }
    // left-field bullpens (measured): two green pens and a block between them along the straight LF wall, seats behind
    {
      const A = [-241.8, -241.8], Lw = Math.hypot(165.8, 160.2), d = [165.8 / Lw, -160.2 / Lw], nn = [-d[1], d[0]];
      const nOut = nn[0] * (-1) + nn[1] * (-1) > 0 ? nn : [-nn[0], -nn[1]];   // outward = away from home
      const ry = Math.atan2(-d[1], d[0]);
      const Pw = (t, off) => [A[0] + d[0] * t * Lw + nOut[0] * off, A[1] + d[1] * t * Lw + nOut[1] * off];
      const strip = (t0, t1, off0, off1, y, h, mat) => { const [x, z] = Pw((t0 + t1) / 2, (off0 + off1) / 2); put(box, mat, mat4(x, y, z, (t1 - t0) * Lw, h, off1 - off0, ry)); };
      const pen = lam('#4e6a45'), blue = lam('#4a6f93'), blk = lam('#c9a7a0');
      strip(0.30, 0.52, 3, 28, 0.6, 1.2, pen); strip(0.68, 0.88, 3, 28, 0.6, 1.2, pen);
      strip(0.52, 0.68, 3, 28, 1.5, 3, blk);
      for (const t of [0.41, 0.78]) { const [x, z] = Pw(t, 14); put(box, blue, mat4(x, 1.4, z, 13, 0.5, 12, ry)); const [mx, mz] = Pw(t, 22); put(new THREE.CylinderGeometry(1, 1, 1, 10), dirtM, mat4(mx, 1.3, mz, 3, 0.4, 3)); }
      for (const t of [0.30, 0.52, 0.68, 0.88]) { const [x, z] = Pw(t, 28); put(box, dark, mat4(x, 6, z, 1.2, 12, 26, ry)); }
      // seats behind the pens
      const [sp, sn, sd] = tools.span(-31.9, -14.0);
      ctx.add(sweepSolid(sp, sn, (i) => { const hw = wallH(spec, sd[i]) + 3; return [[30, 0], [30, hw + 1], [32, hw + 1], [32 + 52, hw + 1 + 0.45 * 52], [32 + 52, 0]]; },
        [MAT.WALL, MAT.CREAM, MAT.SEAT, MAT.FACADE, -1], MAT.FACADE), M);
    }
    // center-field fountain basin behind the batter's eye (measured x -79..72, z -472..-439)
    {
      const cx = -3.5, cz = -455.5;
      put(box, basinM, mat4(cx, 1.5, cz, 150, 3, 33));
      put(box, waterM, mat4(cx, 3.1, cz, 144, 0.4, 27));
      const jetG = new THREE.ConeGeometry(1, 1, 6), nJ = low ? 7 : 15;
      for (let k = 0; k < nJ; k++) { const hh2 = 16 + (k % 3) * 7; put(jetG, jetM, mat4(cx - 66 + k * (132 / (nJ - 1)), hh2 / 2 + 3, cz, 1.6, hh2, 1.6)); }
    }
    // Ferris wheel (measured at 286,-330, plane parallel to the RF stands edge) and carousel (321,148 behind first base)
    {
      const g = mkG(286, 0, -330); g.rotation.y = -0.995;
      const torG = new THREE.TorusGeometry(1, 0.03, 5, 28), cylG = new THREE.CylinderGeometry(1, 1, 1, 8), sphG = new THREE.SphereGeometry(1, 8, 6);
      putL(g, torG, steel, 0, 29, 0, 25, 25, 1);
      putL(g, torG, steel, 0, 29, 0, 13, 13, 1);
      for (let k = 0; k < 6; k++) putL(g, box, steel, 0, 29, 0, 0.4, 50, 0.4, k / 6 * Math.PI);
      for (let k = 0; k < 12; k++) { const ang = k / 12 * Math.PI * 2; putL(g, sphG, carM, Math.sin(ang) * 25, 29 + Math.cos(ang) * 25 - 3, 0, 3.4, 3.4, 3.4); }
      for (const sx of [-1, 1]) putL(g, box, dark, sx * 8, 14, 0, 1.2, 30, 1.2, sx * 0.28);
      const c = { x: 321, z: 148 };
      put(cylG, penM, mat4(c.x, 0.8, c.z, 30, 1.5, 30));
      put(new THREE.ConeGeometry(1, 1, 24), brick, mat4(c.x, 24, c.z, 27, 12, 27));
      put(cylG, steel, mat4(c.x, 9, c.z, 1.4, 16, 1.4));
      for (let k = 0; k < 12 && !low; k++) { const ang = k / 12 * Math.PI * 2; put(cylG, steel, mat4(c.x + Math.sin(ang) * 20, 8.5, c.z + Math.cos(ang) * 20, 0.3, 15, 0.3)); }
    }
    flush();

    // ---------- views
    const hh = dims.hTop;
    views.gate = { pos: tools.foulAt(0.45, dims.dEnd + 330, 45).toArray(), look: tools.foulAt(0.5, dims.dEnd + 28, 55).toArray(), label: 'Main Gate' };
    views.roof = { pos: tools.foulAt(0.36, dims.dEnd - 6, hh + 40).toArray(), look: tools.foulAt(0.78, dims.dEnd - 24, hh + 20).toArray(), label: 'Roof Edge' };
    views.stands = { pos: tools.foulAt(0.58, dims.d0 + 4, dims.h0 + 7).toArray(), look: [-120, 0, -200], label: 'Third-Base Stands' };
  },
};
