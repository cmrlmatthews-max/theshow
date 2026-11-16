// Detail module: T-Mobile Park, Seattle Mariners (opened 1999 as Safeco Field). Units: feet; y = 0 is the field.
// Level 3 fit: satellite sheet /home/claude/refs/SEA/survey.png (home plate at the origin, 1.1 px per foot). Level 4: photographs
// photo1..photo8 in /home/claude/refs/SEA (read by eye; no measurements taken from the photographs were copied out of refs).
//
// MEASURED ON THE SHEET (level 3):
//  - Wall corners (deg, r): LF pole (-45,331), (-42.9,341), (-29,354.5), (-18.8,378), (-15,386), (-7.8,397), (-1.6,406), CF (0.7,401); the
//    right-field wall is under the roof shadow and keeps the posted distances (390 / 381 / 351 / 326). Wall height 8 ft (config).
//  - Foul seat front edge 60 ft off the foul line near home down to 5 ft at the LF pole (foulScale 1.05); backstop 49 ft.
//  - Facade outer edge 205 ft behind the front edge behind home and on the RF side, 180-186 ft on the LF side (shade-canopy outer edge).
//  - Roof, open and parked east: 4 lattice trusses 85.7 ft apart, 681 ft long, skewed 8 deg from the panel travel direction (travel = world
//    (0.663, -0.748)), panel ends 675 ft apart; lens-shaped east edge on the last panel; the west truss lies about 30 ft outside the RF wall.
//  - Behind the LF wall a concourse strip; behind LCF/CF a flat terrace (x -110..-5, z -405..-500) and a white triangular roof
//    (x -21..36, z -491..-425); LF/LCF outer building edge (-244,-331) (-200,-395) (-161,-440) (-125,-482); round plaza behind home (x 28, z 312).
//    Roof south rail line passes (420,-29); the 1B-side outer concourse edge passes (352,-87) (300,-2) (267,47).
// MEASURED IN THE PHOTOGRAPHS (level 4), method in brackets:
//  - Entrance corner facade (photo1): masonry base 18 ft [a 10 ft gate door in the same plane: door 72 px, base 130 px at 2x], then four open
//    concourse levels with slab edges at about 30 / 42 / 54 / 66 ft [slab spacing 80 px = 11 ft], steel frame with X bracing up to 94 ft [corner
//    tower top 635 px / 7.2 px per ft = 88 ft above the base top + 18], grey concrete stair towers rising the full height, a thin steel arc and
//    the name sign over the gate. Back side (photo2): dark steel and glass, a sloped shade roof rising from the 94 ft facade edge to about 140 ft
//    [460 px ground to arch crown = 269 ft gives 0.83 px per ft]; a deep sign girder at about 175-215 ft; the arched truss above it.
//  - Roof arch (photo2, photo6, photo8): trusses are arched; crown top 269 ft, underside at the ends 217 ft (text), crown rise taken as 40 ft
//    on the top chord and 22 ft on the bottom chord [arch rise / span about 0.1 in photo2 and photo8 after the girder depth].
//  - Seat rows (photo7, photo4): lower deck rows about 1.3 ft rise per 3 ft tread (slope 0.42), upper deck about 2.0 ft per 3 ft (slope 0.66).
//  - Outfield (photo5, photo6): CF seat bank about 12 rows (34 ft deep) under a dark concourse deck (top 46 ft) and a white terrace block
//    (62 ft), flags along the block roofline, a steel sign gantry about 55 ft above the LF block roof; RF has a lower tier, the glass restaurant
//    band, and a large upper tier [counted tiers in photo6 and photo3].
//  - Main videoboard 201 x 57 ft (text), three panels (photo3, photo5, photo6), hung from the CF terrace under the roof end; bottom at 62 ft.
// SHADOWS: tried and not usable. The sheet is lit from the east; every shadow of a known-height object (roof 269 ft, canopy) lands on the
//  stands or on the other roofs, and no free-standing object of known height has a free shadow. Heights come from photographs and text.
// FROM TEXT SOURCES: three telescoping panels, roof bottom 217 / top 269 ft above the field, glass back wall behind the top row, brick facade,
//  glass-enclosed restaurant in right field, 201 x 57 ft videoboard in left-center, three decks, wall height 8 ft.
// STILL ESTIMATED: the lower / club / upper split (lower 106 ft deep to 48 ft high, club overhang 26 ft, upper 76 ft to 109 ft high), the
//  RF facade line and RF upper tier (hidden under the roof), videoboard height and exact position, gantry position, lamp banks, flag
//  count, panel width (100 ft), closed-roof positions, plaza radius, foul pole height (60 ft generic), anything under the roof in right field.
export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 331, h: 8 }, { deg: -42.9, r: 341, h: 8 }, { deg: -29, r: 354.5, h: 8 }, { deg: -18.8, r: 378, h: 8 },
        { deg: -15, r: 386, h: 8 }, { deg: -7.8, r: 397, h: 8 }, { deg: -1.6, r: 406, h: 8 }, { deg: 0.7, r: 401, h: 8 },
        { deg: 14, r: 390, h: 8 }, { deg: 22.5, r: 381, h: 8 }, { deg: 33, r: 351, h: 8 }, { deg: 45, r: 326, h: 8 },
      ],
      foulScale: 1.05,
      backstop: 49,
      // t: 0 = RF end, 0.5 = behind home, 1 = LF end. Deck tops: lower 3.5 + 0.42 d; upper front = lower surface at d0 + rise; slope 0.66.
      lower: { depth: [[0, 66], [0.1, 94], [0.3, 106], [0.5, 108], [0.7, 104], [0.9, 92], [1, 68]], slope: 0.42, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: [[0, 12], [0.2, 22], [0.5, 26], [0.8, 23], [1, 12]],
        rise: [[0, 18], [0.5, 22], [1, 18]],
        depth: [[0.04, 66], [0.15, 80], [0.5, 76], [0.85, 66], [0.96, 52]],
        slope: 0.66, extent: [0.04, 0.96],
      },
      outfield: {
        depth: 36, slope: 0.48,
        spans: [[-44, -17, 44, 0.48], [-17, 17, 34, 0.5], [17, 44, 56, 0.5]],
        eye: null,
      },
      skip: { scoreboard: true, canopy: true, lights: true },
      colors: { seat: '#2f5a5a', facade: '#8f5a47', wall: '#27402f', cream: '#e4d9bc' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, dims, parts, views } = ctx;
    const { sweepSolid } = tools;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const { dEnd, hTop } = dims;
    const tan = '#a39880', tanDk = '#7a6e5c', cream = '#ddd3b6', steel = '#6f7d78', steelLt = '#aeb7ae', frameG = '#4a5d56',
      recess = '#36403e', glassC = '#41666a', roofGrey = '#c9c6b8', concrete = '#9b9a90', darkSteel = '#3b4543', door = '#222a2a';
    const nameStr = String((ctx.rec && ctx.rec.stadium) || 'BALLPARK').toUpperCase();

    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0, rz = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, rz); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (geo, mat, mats, parent = G) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; parent.add(m); return m;
    };
    const nog = (g) => { g.clearGroups(); return g; };   // one material: no per-face groups (one draw call)
    const box = (w, h, d, color, x, y, z, ry = 0, parent = G) => {
      const m = ctx.add(nog(new THREE.BoxGeometry(w, h, d)), lam(color), parent); m.position.set(x, y, z); m.rotation.y = ry; return m;
    };
    // extruded plan polygon (world x,z) from y0 up by h
    const prism = (poly, h, color, y0 = 0, roofColor = null) => {
      const sh = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false }); g.rotateX(-Math.PI / 2);
      const m = ctx.add(g, roofColor ? [lam(roofColor), lam(color)] : lam(color)); m.position.y = y0; return m;
    };
    const lerpTab = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const a = tab[i - 1], b = tab[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return tab[tab.length - 1][1]; };
    const textMat = (draw, w, h, extra = {}) => new THREE.MeshBasicMaterial({ map: tools.textTexture(draw, w, h), side: THREE.DoubleSide, ...extra });
    const nameSign = (w, h, bg = '#2b3432', fg = '#e8dcbc') => textMat((g, cw, ch) => {
      g.fillStyle = bg; g.fillRect(0, 0, cw, ch); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
      let fs = ch * 0.62; g.font = `bold ${fs}px Georgia, serif`;
      while (g.measureText(nameStr).width > cw * 0.9 && fs > 10) { fs -= 2; g.font = `bold ${fs}px Georgia, serif`; }
      g.fillText(nameStr, cw / 2, ch / 2 + 2);
    }, Math.round(w * 8), Math.round(h * 8));
    // plain line grid for blank video faces
    const gridMat = (cell = 8) => textMat((g, w, h) => {
      g.fillStyle = '#1a2325'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(130,160,160,0.18)'; g.lineWidth = 1;
      for (let x = 0; x <= w; x += cell) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y <= h; y += cell) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    }, 256, 128);

    const FH = 94;                  // facade top at the entrance corner (photo1)

    // ================= 1. FACADE LINE (closed loop: RF pole -> home -> LF pole, then LF -> RF behind the outfield) =================
    const facOff = [[0, 205], [0.12, 207], [0.3, 205], [0.5, 205], [0.62, 200], [0.72, 190], [0.82, 180], [0.92, 183], [1, 186]];
    const fac = [];
    const NF = 60;
    for (let k = 0; k <= NF; k++) {
      const t = k / NF, v = tools.foulAt(t, lerpTab(facOff, t), 0);
      fac.push({ x: v.x, z: v.z, h: FH });
    }
    // outfield side, LF to RF: [x, z, height]. LF/LCF edge and CF terrace measured on the sheet; the RF line is estimated (under the roof).
    const outer = [[-345, -205, 36], [-302, -262, 38], [-244, -331, 42], [-200, -395, 46], [-161, -440, 50], [-125, -482, 56], [-100, -503, 60], [-60, -503, 62],
      [-20, -498, 62], [8, -470, 60], [36, -438, 60], [100, -478, 78], [190, -470, 90], [262, -405, FH], [318, -300, FH], [345, -190, FH], [352, -87, FH]];
    outer.forEach(([x, z, h]) => fac.push({ x, z, h }));
    const NP = fac.length;
    fac.forEach((p, i) => {
      const a = fac[(i + NP - 1) % NP], b = fac[(i + 1) % NP];
      let nx = b.z - a.z, nz = -(b.x - a.x); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      if (nx * p.x + nz * (p.z + 150) < 0) { nx = -nx; nz = -nz; }
      p.nx = nx; p.nz = nz; p.ry = Math.atan2(nx, nz); p.full = p.h >= 70;
    });
    const full = (p) => p.full;
    // several wall strips of one colour merged into one mesh: spec = [y0(p), y1(p), offset along the normal, cond(p)]
    const ribbons = (specs, color, extra = {}) => {
      const pos = [], idx = []; let base = 0;
      for (const [y0, y1, off, cond] of specs) {
        for (let i = 0; i <= NP; i++) {
          const p = fac[i % NP];
          pos.push(p.x + p.nx * off, y0(p), p.z + p.nz * off, p.x + p.nx * off, y1(p), p.z + p.nz * off);
          if (i) { const a = fac[(i - 1) % NP]; if (!cond || (cond(a) && cond(p))) { const q = base + (i - 1) * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); } }
        }
        base += (NP + 1) * 2;
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      return ctx.add(g, lam(color, extra));
    };
    const SL = [30, 42, 54, 66, 78];                           // open concourse slab edges (photo1)
    ribbons([[() => 0, (p) => (p.full ? 18 : p.h - 4), 0]], tan);                                            // masonry base (low blocks: full height)
    ribbons([[() => 0, () => 3, 0.8]], tanDk);                                                                // plinth
    ribbons([[(p) => (p.full ? 18 : p.h - 4), (p) => (p.full ? 19.8 : p.h), 1.2]], cream);                    // cornice over the base / cap of the low blocks
    ribbons([[() => 19.8, (p) => p.h - 4, -0.8, full]], recess);                                              // dark recess of the open levels
    ribbons(SL.map((sl) => [() => sl, () => sl + 1.8, 1.0, (p) => p.full && p.h > sl + 8]), cream);           // slab edges
    ribbons([[(p) => p.h - 4, (p) => p.h, 0.6, full]], frameG);                                               // steel cap

    // walk the loop at a fixed arc step
    const walk = (step, upto = NP) => {
      const out = []; let carry = 0;
      for (let i = 0; i < upto; i++) {
        const a = fac[i], b = fac[(i + 1) % NP], L = Math.hypot(b.x - a.x, b.z - a.z);
        let s = carry;
        while (s < L) {
          const u = s / L, nx = a.nx + (b.nx - a.nx) * u, nz = a.nz + (b.nz - a.nz) * u, nl = Math.hypot(nx, nz) || 1;
          out.push({ x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u, nx: nx / nl, nz: nz / nl, h: a.h + (b.h - a.h) * u, ry: Math.atan2(nx, nz), full: a.full && b.full });
          s += step;
        }
        carry = s - L;
      }
      return out;
    };
    {
      const step = low ? 56 : 28;
      const w = walk(step);
      // steel columns of the open levels
      const cols = [];
      for (const s of w) if (s.full) cols.push(mat4(s.x + s.nx * 0.8, (19.8 + s.h - 4) / 2, s.z + s.nz * 0.8, 2.6, s.h - 4 - 19.8, 2.6, s.ry));
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(frameG), cols);
      // X bracing in the top band (photo1: diagonal steel up to the cap)
      const br = [];
      for (let i = 0; i + 1 < w.length; i++) {
        const a = w[i], b = w[i + 1], dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz);
        if (!a.full || !b.full || L > step * 1.7 || L < 8) continue;
        const y0 = 66, y1 = Math.min(a.h, b.h) - 4, dh = y1 - y0, th = Math.atan2(-dz, dx), Ld = Math.hypot(L, dh), tilt = Math.atan2(dh, L);
        const mx = (a.x + b.x) / 2 + (a.nx + b.nx) * 0.4, mz = (a.z + b.z) / 2 + (a.nz + b.nz) * 0.4;
        br.push(mat4(mx, (y0 + y1) / 2, mz, Ld, 1.1, 1.1, th, tilt), mat4(mx, (y0 + y1) / 2, mz, Ld, 1.1, 1.1, th, -tilt));
      }
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(frameG), br);
      // gate portals in the masonry base (flat rectangular openings, photo1)
      const por = [];
      for (let i = 0; i + 1 < w.length; i += (low ? 2 : 1)) {
        const a = w[i], b = w[i + 1];
        if (a.h < 34 || Math.hypot(b.x - a.x, b.z - a.z) > step * 1.7) continue;
        por.push(mat4((a.x + b.x) / 2 + a.nx * 0.9, 5.5, (a.z + b.z) / 2 + a.nz * 0.9, 11, 11, 1, a.ry));
      }
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(door), por);
      // grey concrete stair towers (photo1: rise the full height beside the gates), mid-height bays on the outfield side
      const tw = [];
      for (const t of [0.04, 0.2, 0.43, 0.57, 0.8, 0.96]) {
        const p = fac[Math.round(t * NF)];
        tw.push(mat4(p.x + p.nx * 5, FH / 2 + 1, p.z + p.nz * 5, 13, FH + 2, 14, p.ry));
      }
      for (const k of [NF + 3, NF + 9, NF + 13]) { const p = fac[k]; tw.push(mat4(p.x + p.nx * 4, p.h / 2 + 1, p.z + p.nz * 4, 12, p.h + 2, 12, p.ry)); }
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(concrete), tw);
    }

    // ================= 2. GATES, SIGN, ARC, ROTUNDA PLAZA =================
    const hg = fac[Math.round(NF / 2)];
    const gate = (x, z, w, d, h) => {
      box(w, h, d, cream, x, h / 2, z);
      box(w + 4, 3, d + 4, tanDk, x, h + 1.5, z);
      box(w * 0.5, h * 0.62, 1.4, door, x, h * 0.31, z + d / 2 + 0.5);
    };
    gate(hg.x - 22, hg.z + 3, 28, 12, 22); gate(hg.x + 24, hg.z + 3, 28, 12, 22);       // two entrance pavilions behind home
    {
      // name sign on the facade above the gates (plain text) and the thin steel arc over the entrance (photo1)
      const sg = ctx.add(new THREE.PlaneGeometry(62, 7.8), nameSign(62, 7.8)); sg.position.set(hg.x + 1, 54, hg.z + 3); sg.rotation.y = hg.ry;
      const arc = ctx.add(nog(new THREE.TorusGeometry(100, 0.8, 5, 48, 0.78)), lam(steelLt));
      arc.rotation.z = Math.PI / 2 - 0.39; arc.position.set(hg.x + 1, 70 - 100, hg.z + 5);
      // semicircular rotunda plaza (round, white, glass) behind home plate
      const cx = hg.x + 28, cz = hg.z + 50, R = 42;
      const wall = ctx.add(nog(new THREE.CylinderGeometry(R, R, 34, 28, 1, true, Math.PI * 0.05, Math.PI * 0.9 + 0.001)), lam('#6f9a96', { transparent: true, opacity: 0.32 }));
      wall.position.set(cx, 17, cz);
      const slab = ctx.add(nog(new THREE.CylinderGeometry(R + 3, R + 3, 3, 28)), lam(cream)); slab.position.set(cx, 1.5, cz);
      const roof = ctx.add(nog(new THREE.CylinderGeometry(R + 4, R + 4, 2.4, 28, 1, false, Math.PI * 0.05, Math.PI * 0.9)), lam(roofGrey)); roof.position.set(cx, 35, cz);
    }

    // ================= 3. SHADE CANOPY, GLASS BACK WALL, COLUMNS, LAMP BANKS =================
    const [uP, uN, ua] = tools.cut(0.03, 0.97);
    const tOf = (i) => 0.03 + 0.94 * i / (uP.length - 1);
    const hT = (i) => dims.deckAt.hTop(ua + i), dE = (i) => dims.deckAt.dEnd(ua + i);
    {
      // shade roof: sloped, high at the glass line and falling to the facade edge (photo2: grey trapezoid rising above the 94 ft facade)
      const cm = [lam('#5b5448'), lam('#6e675a'), lam('#8f8c80'), lam('#4a4338')];
      ctx.add(sweepSolid(uP, uN, (i) => {
        const o = lerpTab(facOff, tOf(i)), yi = hT(i) + 30, yo = FH + 2, e = dE(i) - 4;
        return [[e, yi - 3], [o, yo - 3], [o, yo], [e, yi]];
      }, [0, 1, 2, 3], 0), cm);
    }
    // glass back wall behind the top row
    ctx.add(sweepSolid(uP, uN, (i) => [[dE(i) + 1, hT(i)], [dE(i) + 1, hT(i) + 27], [dE(i) + 2, hT(i) + 27], [dE(i) + 2, hT(i)]], [0, 1, 0, -1], 1),
      [lam(glassC, { transparent: true, opacity: 0.5 }), lam(frameG)]);
    {
      const cols = [], step = low ? 10 : 5;
      for (let i = 0; i < uP.length; i += step) { const hh = hT(i) + 27; cols.push(mat4(uP[i][0] + uN[i][0] * (dE(i) + 5), hh / 2, uP[i][1] + uN[i][1] * (dE(i) + 5), 1, hh, 1)); }
      inst(nog(new THREE.BoxGeometry(3.4, 1, 3.4)), lam(steel), cols);
      // lamp banks hang from the canopy lip
      const lamps = [], s2 = low ? 6 : 3;
      for (let i = 0; i < uP.length; i += s2) {
        const d = dE(i) + 2, x = uP[i][0] + uN[i][0] * d, z = uP[i][1] + uN[i][1] * d;
        lamps.push(mat4(x, hT(i) + 18, z, 1, 1, 1, Math.atan2(uN[i][0], uN[i][1])));
      }
      inst(nog(new THREE.BoxGeometry(14, 6, 2.2)), basic('#eee9d0'), lamps);
    }

    // ================= 4. RETRACTABLE ROOF (arched trusses) =================
    // Local roof frame (rotP): local +z = panel travel direction w = (0.663, -0.748) (world x,z), local +x = north end direction (-0.748, -0.663).
    // lx runs along the panel end edges (south end -289 .. north end 386), lz across. The trusses are skewed: truss line lz = lz0 + K (lx + 289).
    const GIRD_LO = 183, GIRD_HI = 216;      // rail girder depth (the three panels ride on stepped rails)
    {
      const K = 0.1398, LX0 = -289, LX1 = 386, LXC = (LX0 + LX1) / 2, SP = 85.7;
      const phi = Math.atan2(0.663, -0.748);
      const rotP = new THREE.Group(); rotP.rotation.y = phi; G.add(rotP);
      const deckMat = new THREE.MeshLambertMaterial({ color: roofGrey, side: THREE.DoubleSide });
      const shear = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, K, 0, 1, -K * LX0, 0, 0, 0, 1);   // z' = z + K (x - LX0)
      const archB = (u) => 22 * (1 - u * u);                    // bottom chord rise at the crown 22 ft
      const archT = (u) => 12 + 40 * (1 - u * u);                // top chord: 12 ft above the ends, crown 52 ft above the ends
      // deck: arched skin at the bottom chord; the last panel has a lens-shaped east edge
      const slab = (bulge) => {
        const N = 28, pos = [], idx = [];
        for (let i = 0; i <= N; i++) {
          const lx = LX0 + (LX1 - LX0) * i / N, u = (lx - LXC) / ((LX1 - LX0) / 2), y = archB(u) + 0.8, b = bulge ? bulge(lx) : 0;
          pos.push(lx, y, 0, lx, y, SP + 14 + b);
          if (i) { const q = (i - 1) * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        g.applyMatrix4(shear);
        return g;
      };
      const lensB = (lx) => { const u = (lx + 75) / 438; return u > 0 && u < 1 ? 25 * Math.pow(Math.sin(Math.PI * u), 0.8) - 14 : -14; };
      // trusses: two vertical lattice planes per truss, instanced; chords follow the arch
      const bay = low ? 40 : 21, Lt = (LX1 - LX0) * Math.sqrt(1 + K * K), nb = Math.round(Lt / bay), bl = Lt / nb;
      const trussMats = (pz0) => {
        const out = [], cxl = LXC, czl = pz0 + K * (LXC - LX0);
        const base = new THREE.Matrix4().compose(new THREE.Vector3(cxl, 0.8, czl), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.atan(K), 0)), new THREE.Vector3(1, 1, 1));
        const seg = (x0, y0, x1, y1, zz, th) => {            // box from (x0,y0) to (x1,y1) in the truss plane
          const L = Math.hypot(x1 - x0, y1 - y0);
          tmp.position.set((x0 + x1) / 2, (y0 + y1) / 2, zz); tmp.rotation.set(0, 0, Math.atan2(y1 - y0, x1 - x0)); tmp.scale.set(L, th, th); tmp.updateMatrix();
          out.push(base.clone().multiply(tmp.matrix));
        };
        const xs = (b) => -Lt / 2 + b * bl, us = (b) => xs(b) / (Lt / 2);
        for (const zz of [-5.5, 5.5]) {
          for (let b = 0; b < nb; b++) {
            seg(xs(b), archB(us(b)), xs(b + 1), archB(us(b + 1)), zz, 1.2);            // bottom chord
            seg(xs(b), archT(us(b)), xs(b + 1), archT(us(b + 1)), zz, 1.5);            // top chord
            if (b % 2 === 0) seg(xs(b), archB(us(b)), xs(b + 1), archT(us(b + 1)), zz, 0.8); else seg(xs(b), archT(us(b)), xs(b + 1), archB(us(b + 1)), zz, 0.8);
          }
          for (let b = 0; b <= nb; b++) if (!low || b % 2 === 0) seg(xs(b), archB(us(b)), xs(b), archT(us(b)), zz, 0.9);
        }
        if (!low) for (let b = 0; b < nb; b++) {            // plan bracing between the two planes along the top chord
          const x = (xs(b) + xs(b + 1)) / 2, ang = Math.atan2(11, bl) * (b % 2 ? -1 : 1);
          tmp.position.set(x, archT(x / (Lt / 2)) + 0.2, 0); tmp.rotation.set(0, ang, 0); tmp.scale.set(Math.hypot(bl, 11), 0.8, 0.8); tmp.updateMatrix(); out.push(base.clone().multiply(tmp.matrix));
        }
        return out;
      };
      const open = [217, 200, 183], closedY = [217, 217, 217];
      const lzS = (j) => 300.4 + SP * j;           // west truss of panel j at the south end
      const openZ = [lzS(0), lzS(1), lzS(2)], closedZ = [-100, 12, 124];
      const roofList = [];
      for (let j = 0; j < 3; j++) {
        const panel = new THREE.Group(); rotP.add(panel);
        const deck = new THREE.Mesh(slab(j === 2 ? lensB : null), deckMat); panel.add(deck);
        const mats = trussMats(0);
        if (j === 2) mats.push(...trussMats(SP));
        inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(steel), mats, panel);
        roofList.push({ panel, closedZ: closedZ[j], openZ: openZ[j], closedY: closedY[j], openY: open[j] });
      }
      // replace the generic panels in park.roof (same format) so toggleRoof keeps working
      const park = ctx.park || (typeof window !== 'undefined' && window.__show && window.__show.park);
      if (park && park.roof) {
        for (const r of park.roof) ctx.remove(r.panel);
        park.roof = roofList; park._placeRoof();
      } else { roofList.forEach((r) => { r.panel.position.set(0, r.openY, r.openZ); }); }

      // fixed rail girders along the north and south ends of the panels (deep girder, photo2), with columns to the ground
      const railG = new THREE.Group(); rotP.add(railG);
      const lz0 = -170, lz1 = 650, lzc = (lz0 + lz1) / 2, gH = GIRD_HI - GIRD_LO, gY = (GIRD_HI + GIRD_LO) / 2;
      const colMats = [], lampMats = [];
      for (const [lx, side] of [[LX1 + 6, 1], [LX0 - 6, -1]]) {
        const gm = ctx.add(nog(new THREE.BoxGeometry(12, gH, lz1 - lz0)), lam(darkSteel), railG); gm.position.set(lx, gY, lzc);
        const gt = ctx.add(nog(new THREE.BoxGeometry(5, 3, lz1 - lz0)), lam(steelLt), railG); gt.position.set(lx, GIRD_HI + 1.5, lzc);
        // name sign band on the outward face of the girder
        const sg = ctx.add(new THREE.PlaneGeometry(210, 15), nameSign(210, 15, '#3b4543', '#e8dcbc'), railG);
        sg.position.set(lx + side * 6.2, gY, lzc + 40); sg.rotation.y = side * Math.PI / 2;
        for (let z = lz0 + 20; z <= lz1 - 10; z += low ? 160 : 80) colMats.push(mat4(lx, GIRD_LO / 2, z, 1, GIRD_LO, 1));
        for (let z = lz0 + 30; z <= 380; z += low ? 66 : 33) lampMats.push(mat4(lx - side * 7.5, GIRD_LO - 3, z, 1, 1, 1, side > 0 ? -Math.PI / 2 : Math.PI / 2));
      }
      inst(nog(new THREE.BoxGeometry(7, 1, 7)), lam(steel), colMats, railG);
      inst(nog(new THREE.BoxGeometry(2.4, 7, 16)), basic('#eee9d0'), lampMats, railG);
      // end towers at the east end: A-frame legs under the girder ends
      const legs = [];
      for (const lx of [LX1 + 6, LX0 - 6]) for (const lz of [lz1 - 10, lz1 - 70]) legs.push(mat4(lx, GIRD_LO / 2, lz, 1, GIRD_LO, 1));
      inst(nog(new THREE.BoxGeometry(9, 1, 9)), lam(steelLt), legs, railG);
    }

    // ================= 5. OUTFIELD STRUCTURES =================
    const wA = (deg, out, y = 0) => tools.wallAt(deg, out, y);
    // glass-enclosed restaurant in right field and the big upper tier behind it (photo6: lower tier, restaurant band, large upper tier)
    {
      const [p, n] = tools.span(18, 42);
      const glass = [lam(glassC, { transparent: true, opacity: 0.62 }), lam(glassC, { transparent: true, opacity: 0.62 }), lam(cream), lam(tan), lam('#3a4a47')];
      ctx.add(sweepSolid(p, n, () => [[58, 0], [58, 52], [78, 56], [78, 0]], [MAT.WALL, MAT.WALL, MAT.CREAM, -1], MAT.CREAM), glass);
      ctx.add(sweepSolid(p, n, () => [[57, 51], [57, 53.5], [79, 57.5], [79, 55]], [MAT.CREAM, MAT.CREAM, MAT.CREAM, MAT.CREAM], MAT.CREAM), M);
      // upper tier: a custom deck (seat rows, aisles, rail) from 78 to 118 ft behind the wall
      const up = ctx.add(sweepSolid(p, n, () => [[78, 0], [78, 57], [118, 84], [118, 0]], [MAT.CREAM, MAT.SEAT, MAT.SHADE, -1], MAT.SHADE), M);
      up.add(tools.aisles(p, n, { d0: 78, h0: 57, d1: 118, h1: 84 }, { every: 26, lod: ctx.lod }));
      up.add(tools.rail(p.map((q, i) => [q[0] + n[i][0] * 78.4, q[1] + n[i][1] * 78.4]), () => 57, { height: 3.5, glass: true, color: '#7d7a6c', lod: ctx.lod }));
    }
    // left-field concourse block (brick, flat grey roof) behind the LF seats
    {
      const poly = [];
      for (const deg of [-44, -38, -32, -26, -20, -14]) { const v = wA(deg, 52); poly.push([v.x, v.z]); }
      for (let i = 4; i >= 0; i--) poly.push([outer[i][0], outer[i][1]]);
      prism(poly, 44, '#7d6a58', 0, '#d3cfc0');
    }
    // CF concourse deck over the seat bank: dark steel band under a pale roof (photo5)
    {
      const [p, n] = tools.span(-17, 17);
      const dk = [lam(darkSteel), lam(darkSteel), lam('#d6d2c4'), lam(darkSteel)];
      ctx.add(sweepSolid(p, n, () => [[38, 0], [38, 46], [66, 46], [66, 0]], [0, 2, 1, -1], 0), dk);
    }
    // CF white terrace block (62 ft, photo5) and the triangular roof behind it
    {
      const poly = [];
      for (const deg of [-16, -9, -2]) { const v = wA(deg, 66); poly.push([v.x, v.z]); }
      poly.push([-14, -478], [-45, -503], [-86, -500], [-112, -450]);
      prism(poly, 62, '#c9c5b8', 0, '#e9e6dc');
      prism([[-12, -491], [-21, -449], [36, -425]], 52, '#d6d2c6', 0, '#f1efe6');
    }
    // flag poles along the terrace roofline (plain coloured flags, no marks)
    {
      const a = wA(-16, 70), b = wA(-1, 70), n = low ? 7 : 13, polesM = [], flagM = [];
      const flags = new THREE.InstancedMesh(nog(new THREE.BoxGeometry(7, 4, 0.2)), lam('#ffffff'), n);
      const cc = ['#a8573f', '#41607a', '#d9ceb0', '#5b7a5c'], col = new THREE.Color();
      for (let k = 0; k < n; k++) {
        const u = k / (n - 1), x = a.x + (b.x - a.x) * u, z = a.z + (b.z - a.z) * u;
        polesM.push(mat4(x, 62 + 14, z, 1, 28, 1));
        flags.setMatrixAt(k, mat4(x + 3.5, 62 + 25.5, z, 1, 1, 1, 0.3)); flags.setColorAt(k, col.set(cc[k % 4]));
      }
      G.add(flags);
      inst(nog(new THREE.CylinderGeometry(0.28, 0.32, 1, 5)), lam('#c9c6b8'), polesM);
    }
    // steel sign gantry over the LCF concourse (photo5: four legs, truss top, sign between the front legs)
    {
      const g = new THREE.Group(); g.position.set(-205, 44, -372); g.rotation.y = Math.atan2(205, 372); G.add(g);
      const W = 104, Dp = 26, H = 56;
      const legs = [];
      for (const sx of [-W / 2, W / 2]) for (const sz of [-Dp / 2, Dp / 2]) legs.push(mat4(sx, H / 2, sz, 3, H, 3));
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(frameG), legs, g);
      const top = (y) => { for (const sz of [-Dp / 2, Dp / 2]) { const m = ctx.add(nog(new THREE.BoxGeometry(W + 4, 2, 2)), lam(steel), g); m.position.set(0, y, sz); } for (const sx of [-W / 2, W / 2]) { const m = ctx.add(nog(new THREE.BoxGeometry(2, 2, Dp)), lam(steel), g); m.position.set(sx, y, 0); } };
      top(H); top(H - 14); top(14);
      // X bracing in the side and back planes
      const xb = [];
      for (const sz of [-Dp / 2, Dp / 2]) for (const s of [1, -1]) xb.push(mat4(0, H / 2, sz, Math.hypot(W, H - 14) * 0.98, 1.1, 1.1, 0, s * Math.atan2(H - 14, W)));
      for (const sx of [-W / 2, W / 2]) for (const s of [1, -1]) xb.push(mat4(sx, H / 2, 0, Dp * 1.02, 1.1, 1.1, Math.PI / 2, 0), mat4(sx, H / 2 + 14, 0, 1.1, Math.hypot(Dp, H - 28), 1.1, 0, 0));
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(steel), xb.slice(0, 4), g);
      const sg = ctx.add(new THREE.PlaneGeometry(70, 11), nameSign(70, 11, '#34403d', '#e8dcbc'), g); sg.position.set(0, H - 26, Dp / 2 + 1.2);
      const sb = box(72, 13, 1.6, '#34403d', 0, H - 26, Dp / 2 + 0.2, 0, g);
    }

    // ================= 6. SCOREBOARDS AND VIDEO BOARDS =================
    // main videoboard: 201 x 57 ft (text), hung over the CF terrace under the roof end; three blank panels, steel frame, back truss, legs, catwalks
    {
      const g = new THREE.Group(); g.position.set(-60, 0, -440); g.rotation.y = Math.atan2(0.351, 0.936); G.add(g);
      const bw = 201, bh = 57, y0 = 62, y1 = y0 + bh;
      const panels = [[-80.5, 45], [0, 108], [80.5, 46]];
      const darkM = lam('#1d2729');
      for (const [cx, pw] of panels) {
        const m = ctx.add(nog(new THREE.PlaneGeometry(pw, bh - 4)), cx === 0 ? gridMat(8) : darkM, g); m.position.set(cx, y0 + bh / 2, 2.6);
      }
      const body = ctx.add(nog(new THREE.BoxGeometry(bw, bh, 4)), lam('#2a3335'), g); body.position.set(0, y0 + bh / 2, 0);
      // frame: top, bottom, ends and the two dividers
      const fr = [mat4(0, y1 + 1.2, 1, bw + 4, 2.4, 6), mat4(0, y0 - 1.2, 1, bw + 4, 2.4, 6)];
      for (const sx of [-bw / 2 - 1, bw / 2 + 1, -57.5, 57.5]) fr.push(mat4(sx, y0 + bh / 2, 1, 2.2, bh + 4.8, 6));
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(steelLt), fr, g);
      // back structure: lattice truss plane behind the board (chords, posts, diagonals)
      const bk = [], nbay = low ? 6 : 12, bayW = bw / nbay;
      bk.push(mat4(0, y0 + 5, -8, bw, 1.6, 1.6), mat4(0, y1 - 5, -8, bw, 1.6, 1.6), mat4(0, y0 + bh / 2, -8, bw, 1.2, 1.2));
      for (let k = 0; k <= nbay; k++) bk.push(mat4(-bw / 2 + k * bayW, y0 + bh / 2, -8, 1.4, bh - 8, 1.4));
      for (let k = 0; k < nbay; k++) { const L = Math.hypot(bayW, (bh - 10) / 2), s = k % 2 ? 1 : -1; bk.push(mat4(-bw / 2 + (k + 0.5) * bayW, y0 + bh * 0.25 + 2.5, -8, L, 1, 1, 0, s * Math.atan2((bh - 10) / 2, bayW)), mat4(-bw / 2 + (k + 0.5) * bayW, y0 + bh * 0.75 - 2.5, -8, L, 1, 1, 0, -s * Math.atan2((bh - 10) / 2, bayW))); }
      // depth ties from the face frame to the back truss
      for (const sx of [-bw / 2, -bw / 4, 0, bw / 4, bw / 2]) bk.push(mat4(sx, y0 + 5, -3, 1.2, 1.2, 10), mat4(sx, y1 - 5, -3, 1.2, 1.2, 10));
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(steel), bk, g);
      // support legs from the terrace roof (46 ft) to the board, with back braces to the terrace
      const legM = [], braceM = [];
      for (const sx of [-0.46, -0.23, 0, 0.23, 0.46]) legM.push(mat4(bw * sx, (46 + y0) / 2, -2, 4.5, y0 - 46, 4.5));
      for (const sx of [-0.46, -0.23, 0, 0.23, 0.46]) {
        const L = Math.hypot(30, y1 - 8 - 46); tmp.position.set(bw * sx, (46 + y1 - 8) / 2, -20); tmp.rotation.set(Math.atan2(30, y1 - 8 - 46), 0, 0); tmp.scale.set(1.8, L, 1.8); tmp.updateMatrix(); braceM.push(tmp.matrix.clone());
      }
      inst(nog(new THREE.BoxGeometry(1, 1, 1)), lam(frameG), [...legM, ...braceM], g);
      // catwalks under and over the board, with a rail
      box(bw + 10, 0.8, 8, darkSteel, 0, y0 - 2.8, -2, 0, g);
      box(bw + 10, 0.4, 0.4, steelLt, 0, y0 + 0.6, 2.2, 0, g);
      box(bw + 4, 0.8, 6, darkSteel, 0, y1 + 2.6, -3, 0, g);
      // bell hung under the left end (plain bronze, no marks)
      const bell = ctx.add(nog(new THREE.CylinderGeometry(0.4, 2.1, 3.4, 10)), lam('#8b6a3a'), g); bell.position.set(-bw / 2 + 16, y0 - 5.2, 1);
    }
    // CF line-score ribbon board on the concourse deck front (photo5: long dark board above the CF wall)
    {
      const v = wA(-3, 39, 0), rb = ctx.add(nog(new THREE.BoxGeometry(96, 11, 1.4)), gridMat(6)); rb.position.set(v.x, 36, v.z); rb.lookAt(0, 36, 0);
      const fr = ctx.add(nog(new THREE.BoxGeometry(100, 15, 1)), lam(steelLt)); fr.position.set(v.x, 36, v.z - 0.9); fr.lookAt(0, 36, 0);
      fr.translateZ(-0.9);
    }
    // ribbon boards along the upper-deck front fascia (photo6, photo4: continuous dark strips with plain cells)
    {
      const [p, n, a] = tools.cut(0.1, 0.9);
      const dg = dims.deckAt;
      ctx.add(sweepSolid(p, n, (i) => { const d = dg.d0(a + i), h = dg.h0(a + i); return [[d - 0.7, h - 6.5], [d - 0.7, h - 2.5], [d, h - 2.5], [d, h - 6.5]]; }, [0, 0, 0, -1], 0), [gridMat(8)]);
    }

    // ================= 7. CLEANUP AND VIEWS =================
    ctx.remove(parts.lights);
    const home = tools.foulAt(0.5, lerpTab(facOff, 0.5), 0);
    views.gate = { pos: [home.x + 60, 26, home.z + 150], look: [home.x, 55, home.z], label: 'Home Gate' };
    views.roof = { pos: [-250, 90, -150], look: [260, 230, -330], label: 'Roof' };
    const sp = tools.foulAt(0.2, dims.d0 + 20, 70);
    views.stands = { pos: [sp.x, 72, sp.z], look: [-60, 30, -200], label: 'RF Upper' };
  },
};
