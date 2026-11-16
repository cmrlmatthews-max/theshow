// Detail module: Globe Life Field, Texas Rangers (opened 2020). Units: feet. Compass frame: u = east, v = north, home plate = 0,0.
// Field axis: center field faces northeast (home to second base at 45 deg), so the building is compass-aligned in the F group.
// MEASURED FROM THE SATELLITE SHEET (mosaic, roof closed; home plate taken at mosaic pixel 612,1140, second base 712,1040;
// the sheet cuts the south edge of the building at v = -54, so everything south of that is text-based):
//  - Closed movable roof panel: 441 ft wide (u) and 675 ft long (v). North edge v = 470, corners NW (-136,470) NE (305,470);
//    its long edges lean 0.255 ft/ft (the whole roof is a parallelogram on the sheet), so SW (36,-205) SE (477,-205).
//    Panel zones (north to south): dark opaque (real roof carries lettering here; not modeled) v 470..250, translucent ETFE v 250..72,
//    pale opaque v 72..-205. The panel parks west over the parking lot (u -457..-16 in its own frame).
//  - North track/girder: a 36 ft wide deck at v 452..488 from u = -577 to 310; south track mirrored 659 ft away (v = -197).
//  - Fixed west roof: outer edge u = -176 - 0.106 (v + 38) (u -233 at v 500, -176 at v -38). Long glass skylight strip along it:
//    (-190,445) (-160,235) (-125,-38), 22 ft wide. Catwalk rows with lamp banks: (-168,442) (-100,218) (-72,-5).
//  - Fixed east roof: outer edge (487,470) (514,355) (551,235) (565,167) (592,62), then a diagonal corner to (514,-56).
//    NE porch roof seen at about (550,385), tilted 15 deg.
//  - North facade line v = 500 from u = -231 to 480 (the shadowed face; its parapet strips show at v 497..518).
//    West facade line from (-231,500) to (-157,-215). East facade follows the east roof edge.
//  - West parking lot (u -460..-245, v 0..405) lies under the open-roof parking position.
// FROM TEXT SOURCES (Wikipedia, MLB.com, Ballpark Digest, baseballparks.com, Baseball America, Enterprise Precast):
//  - Wall corners LF 329, 334, LCF 372, CF 407, 410 either side of CF, RCF 374, RF 326; wall 8 ft; backstop 42 ft; batter's eye
//    120 x 40 ft dark green; video board 111 x 40 ft over the Sky Porch at the third-base pole.
//  - One roof panel slides west on two parallel tracks (about 650 ft apart, 900 ft long); ETFE with translucent and opaque zones.
//  - North face about 1,000 ft long, about 100 ft high, 18 brick/limestone arches filled with glass; thin-brick precast columns and
//    "aged travertine" precast elsewhere; Texas-sized porches at the SE, SW and NE entries; upper-concourse bay balconies.
// LEVEL 4 (photographs 1-8 in refs/TEX, text from the Rangers' video-board list on mlb.com):
//  A FACADE (photos 1-3): brick piers (9 ft) on 12 ft limestone plinth blocks, dark glass bays with transoms between them, a dark
//    bronze cornice band (9 ft) on the north and west faces; arched glass slots (19 ft wide, to H-17) only at gate bays and the
//    NE corner, not on every bay (earlier model had an arch per bay). South/east faces: travertine zone over brick, dark cornice;
//    porches have brick columns on stone feet and a dark canopy. Added the sloped ribbed silver roof wall (north, south, east):
//    ledge at 104 ft, wall leaning ~70 deg to 164 ft (north). The fixed roof strips now rise from the 104 ft ledge at 0.62 ft/ft up
//    to 136 ft (west) / 142 ft (east) so the upper deck (top 108 ft) clears the ceiling; they were flat at 104 before.
//    The roof lettering (sponsor name) is removed; no logos. Outfield curtain wall behind the stands (photos 4, 6, 7, 8): dark
//    concourse wall to 48 ft, limestone-footed brick piers every 24 ft, glass bays and pointed arched windows, dark cornice, top 140 ft.
//  B HEIGHTS (method): outfield wall 8 ft (photo 4 crop: batter's eye is 120 ft wide = 130 px, wall 9 px = 8.3 ft); batter's eye top
//    40 ft (32 ft above the wall top, same crop); center board 80 ft high measured as 79 ft in that crop, bottom 66 ft, top 145 ft
//    (58 ft above the wall top); pier cornice / roof truss bottom chord 137-145 ft above the wall top in the same crop, so panel
//    bottom 146 ft; foul poles ~75 ft (photos 4 and 7, pole height against distance from the camera fit); facade 100 ft (text) with
//    the roof ridge 144 ft (photo 1) to 176 ft (photo 3) from the ridge/facade pixel ratio, so wall top 164 ft; lower bowl: camera
//    fits (focal length from the foul-pole bearings 45 deg left/right at x = 5 and 765 px): photo 7 is 95 ft behind the plate at 24 ft
//    (field level at 53 ft from the front edge: 24 ft), photo 4 is 163 ft behind the plate at 49 ft (mezzanine at 121 ft: 49 ft);
//    the front edge of the seats behind home is 42 ft from the plate. Satellite shadows were not usable (roof closed, shadows fall on
//    sloped roofs).
//  C SEATING: foul-side lower deck is two tiers, field level (slope 0.33, half the depth) then a 4.5 ft fascia step with the 2.5 ft
//    seating ribbon, then the mezzanine (slope ~0.37-0.45) up to lowTop = 3.5 + 0.38 * depth. Lower depth by t (0 = right-field pole,
//    0.5 = home, 1 = left-field pole): 52, 80 (t .1), 112 (.25), 128 (.4), 135 (.5), 128 (.6), 112 (.75), 80 (.9), 50 ft. Upper deck
//    (300 level): from t .06 to .94, overhang 30 ft over the lower deck, front at 36 ft above the lower surface (about 79 ft behind
//    home), 44 ft deep behind home (30 ft near the ends), slope 0.66, top about 108 ft. Outfield seats: left 62 ft deep, right 72 ft deep,
//    slope 0.42, left span -37..-8.5 deg and right span 8.5..45 deg; the left corner (-45..-37.5) is the Sky Porch terraces.
//  D BOARDS: left field 111 x 40 ft (bottom 88 ft) over the Sky Porch; right field 150 x 58 ft (bottom 88, top 146) at 31 deg right
//    of center, 58 ft behind the wall line (bearing from photos 7 and 8); center field 20 wide x 80 high (66..146 ft). Each has a
//    frame, a lattice back structure 10 ft behind, a catwalk with a hand rail below, and two steel masts to the roof truss line.
//    Faces are blank dark panels. Three plain colour banners hang from the truss near center (photo 7). Suite fascia ribbon 3.5 x 211 ft.
// STILL ESTIMATED: truss depth (30 ft) and spacing, facade bay rhythm and arch positions (gate bays), all of the south part
//  (v < -54: south wall v = -215, south track, SW porch), the SE corner beyond the chamfer, the exact gate positions, the Sky Porch
//  tiers, the true (un-leaned) positions of the roof edges, the mezzanine/field-level split (half the depth), the suite level band
//  (plain dark face), the upper-deck extent near the poles, right-field and left-field second-level terraces (merged into one
//  slope), the position of the suite ribbon, the curtain wall offset (78-86 ft behind the outfield wall). The panel top is 176 ft
//  (146 + 30), above the 164 ft wall top.
//  Not built: bullpens, Texas Live! plaza, concourse interiors, statues, field-level details, the two suite displays behind home.
const R2 = Math.SQRT1_2;
const loc = (u, v) => [-v, -u];                                   // compass point -> F-local (x, z)
const W = (u, v, y = 0) => [R2 * (u - v), y, -R2 * (u + v)];       // world position of compass point (u, v)

// Roof geometry (measured; compass u east, v north).
const SHEAR = -0.255;                                              // du/dv of the long panel edges on the sheet
const PAN_V1 = 470, PAN_V0 = -205, PAN_W = -136, PAN_E = 305;      // panel north edge, south edge, NW and NE corner u at v = 470
const pw = (v) => PAN_W + SHEAR * (v - PAN_V1), pe = (v) => PAN_E + SHEAR * (v - PAN_V1);   // panel west / east edge u at v
const wo = (v) => -176 - 0.106 * (v + 38);                         // west facade / fixed roof outer edge u at v
const SPAN = PAN_V1 - PAN_V0, PLEN = PAN_E - PAN_W;                // 675 x 441
const VC = (PAN_V1 + PAN_V0) / 2, UC = (pw(VC) + pe(VC)) / 2 - SHEAR * VC;   // panel center in its own (unsheared) frame
const RAIL_N = 470, RAIL_S = -197;                                 // track centers (v)
const Y_BOT = 146, T_DEPTH = 30, Y_FIX = 104;                      // panel bottom chord, truss depth, fixed roof deck
const H_N = 102, H_W = 100, H_S = 94, H_E = 96, WALL_T = 7;

// Facade lines (compass points), outward = away from the field.
const P_NW = [-231, 500], P_NE = [480, 500], P_SW = [wo(-215), -215], P_SE = [500, -215];
const EAST = [[480, 500], [551, 235], [592, 62]];                  // east wall, two straight runs
const EO = [[470, 487], [355, 514], [235, 551], [167, 565], [62, 592], [-56, 514], [-215, 500]];   // east outer edge as [v, u]
const eo = (v) => { for (let i = 0; i < EO.length - 1; i++) { const [v0, u0] = EO[i], [v1, u1] = EO[i + 1]; if (v <= v0 && v >= v1) return u0 + (u1 - u0) * (v0 - v) / (v0 - v1); } return EO[EO.length - 1][1]; };
const CHAMFER = [[592, 62], [514, -56]], EAST_S = [[514, -56], [500, -215]];

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 329, h: 8 }, { deg: -38, r: 334, h: 8 }, { deg: -22.5, r: 372, h: 8 }, { deg: -8.5, r: 410, h: 8 },
        { deg: 0, r: 407, h: 8 }, { deg: 8.5, r: 410, h: 8 }, { deg: 22.5, r: 374, h: 8 }, { deg: 45, r: 326, h: 8 },
      ],
      foulScale: 0.94, backstop: 42,
      // Bowl measured from photos 4 and 7 (camera fits, see top comment). The lower deck here only sets the depth and the top
      // height (3.5 + slope * depth); build() replaces it with a two-tier deck (field level + mezzanine) with a fascia step.
      lower: { depth: [[0, 52], [0.1, 80], [0.25, 112], [0.4, 128], [0.5, 135], [0.6, 128], [0.75, 112], [0.9, 80], [1, 50]], slope: 0.38, extent: [0, 1] },
      hasUpper: true,
      upper: { overhang: 30, rise: 36, depth: [[0.06, 30], [0.18, 40], [0.35, 44], [0.65, 44], [0.82, 40], [0.94, 30]], slope: 0.66, extent: [0.06, 0.94] },
      outfield: { depth: 70, slope: 0.42, spans: [[-37, -8.5, 62], [8.5, 45, 72]], eye: [-8.5, 8.5], eyeHeight: 40, eyeDepth: 18 },
      skip: { canopy: true, scoreboard: true, lights: true },
      colors: { seat: '#2f4b7c', facade: '#cdbd96', wall: '#27405c', cream: '#e0d3b0' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, dims, parts, views } = ctx;
    const { sweepSolid, textTexture } = tools;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
    const tmp = new THREE.Object3D();
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const inst = (parent, geo, mat, list) => {
      if (!list.length) return null;
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((mx, i) => m.setMatrixAt(i, mx)); m.instanceMatrix.needsUpdate = true; parent.add(m); return m;
    };
    const beam = (a, b, th) => {                      // thin box from point a to b (local coordinates)
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      tmp.scale.set(th, len, th); tmp.updateMatrix(); const m = tmp.matrix.clone(); tmp.quaternion.identity(); return m;
    };
    const unit = new THREE.BoxGeometry(1, 1, 1);
    // flat polygon from compass points, lying at height y inside parent (F-local frame)
    const flat = (pts, y, mat, parent) => {
      const sh = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(-v, u)));
      const m = new THREE.Mesh(new THREE.ShapeGeometry(sh).rotateX(-Math.PI / 2), mat); m.position.y = y; parent.add(m); return m;
    };
    // flat ribbon along a compass polyline
    const ribbon = (path, w, y, mat, parent) => {
      const pos = [], idx = [];
      path.forEach(([u, v], i) => {
        const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)];
        let du = b[0] - a[0], dv = b[1] - a[1]; const l = Math.hypot(du, dv); du /= l; dv /= l;
        for (const s of [-1, 1]) pos.push(-(v + du * w / 2 * s), y, -(u - dv * w / 2 * s));
        if (i) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat); parent.add(m); return m;
    };

    // The F frame holds the whole building: everything inside is in compass-aligned local coordinates (x = -v, z = -u).
    const F = new THREE.Group(); F.rotation.y = -Math.PI / 4; G.add(F);

    // ------------------------------------------------------------------ materials and instance lists
    const mBrick = lam('#8c4f3c'), mCream = lam('#e0d3b0'), mGran = lam('#554b44'), mTrav = lam('#d6c7a0'), mTrav2 = lam('#c4b48c');
    const mGlass = lam('#3d535f'), mSteel = lam('#6a717a'), mStone = lam('#b8a07a'), mDark = lam('#3c3936');
    const L = { brick: [], cream: [], gran: [], trav: [], trav2: [], glass: [], steel: [], track: [], stone: [], dark: [] };

    // ------------------------------------------------------------------ wall frames (local coords)
    // n = outward normal (local x,z); t = (nz, -nx); the origin O is the wall start; s runs along t.
    const frame = (O, n) => ({ ox: O[0], oz: O[1], nx: n[0], nz: n[1], tx: n[1], tz: -n[0], ry: Math.atan2(n[0], n[1]) });
    const at = (f, s, o) => [f.ox + f.tx * s + f.nx * o, f.oz + f.tz * s + f.nz * o];
    const put = (list, f, s, y, o, sx, sy, sz) => { const [x, z] = at(f, s, o); list.push(mat4(x, y, z, sx, sy, sz, f.ry)); };
    const cc = loc(130, 140);                                                    // interior reference point
    const seg = (A, B) => {                                                      // frame along compass segment A-B, normal pointing outward
      let a = loc(...A), b = loc(...B);
      let dx = b[0] - a[0], dz = b[1] - a[1]; const len = Math.hypot(dx, dz); dx /= len; dz /= len;
      let n = [-dz, dx];
      if ((a[0] - cc[0]) * n[0] + (a[1] - cc[1]) * n[1] < 0) { a = b; dx = -dx; dz = -dz; n = [-dz, dx]; }
      return { f: frame(a, n), len };
    };

    // ------------------------------------------------------------------ brick colonnade (north and west faces), from photos 1-3
    // Brick piers on limestone plinth blocks, dark glass bays between them, a dark bronze cornice; tall slender arched glass slots
    // (about 19 ft wide) only at the corner and at the gates. Arches are not repeated on every bay.
    const arcRing = [], arcDisc = [];
    const uAt = (f, s) => -(f.oz + f.tz * s);                                     // compass u of a point on a facade frame
    const arcade = (f, len, bays, H, gates, balc) => {
      const bay = len / bays, PW = 9, ow = bay - PW, rA = Math.min(9.5, ow * 0.3), spring = H - 27;
      put(L.stone, f, len / 2, 6, 0.8, len, 12, WALL_T + 1.6);                      // limestone plinth, 12 ft
      put(L.dark, f, len / 2, H - 4.5, 1.7, len + 1, 9, WALL_T + 3.4);               // dark cornice band, 9 ft
      put(L.glass, f, len / 2, 12 + (H - 22) / 2, -1.2, len, H - 22, 1);            // glazing behind the piers (y 12 to H-10)
      for (const y of [36, 60, 82]) if (y < H - 14) put(L.dark, f, len / 2, y, -0.5, len, 0.9, 0.9);   // transoms
      for (let k = 0; k <= bays; k++) {
        const w = k === 0 || k === bays ? 6 : PW, s = k === 0 ? w / 2 : k === bays ? len - w / 2 : k * bay;
        put(L.brick, f, s, H / 2, 0, w, H, WALL_T);                                // brick pier
        put(L.stone, f, s, 6, 0.9, w + 1.6, 12, WALL_T + 1.9);                     // limestone base block
      }
      const flip = uAt(f, len) < uAt(f, 0);                                        // gate numbers count from the east end
      for (let k = 0; k < bays; k++) {
        const s = (k + 0.5) * bay, kk = flip ? k : bays - 1 - k;
        if (gates.includes(kk)) {
          put(L.brick, f, s, (12 + H - 9) / 2, -0.8, ow, H - 21, WALL_T - 0.4);    // brick mass around the arched slot
          put(L.glass, f, s, 12 + (spring - 12) / 2, WALL_T / 2 - 0.35, rA * 2, spring - 12, 1);
          const [x, z] = at(f, s, WALL_T / 2 - 0.3);
          arcDisc.push(mat4(x, spring, z, rA, rA, 1, f.ry));                       // glass half disc
          const [x2, z2] = at(f, s, WALL_T / 2 - 0.2);
          arcRing.push(mat4(x2, spring, z2, rA + 2.4, rA + 2.4, 1, f.ry));         // limestone arch ring
        }
        if (balc && balc.includes(kk)) {                                           // projecting upper-concourse bay (about 17 ft)
          put(L.dark, f, s, 44, WALL_T / 2 + 8, 52, 3, 17);
          put(L.glass, f, s, 49, WALL_T / 2 + 16, 50, 7, 0.8);
          put(L.dark, f, s, 52.6, WALL_T / 2 + 16, 52, 0.8, 1.6);
        }
      }
    };

    // ------------------------------------------------------------------ travertine precast walls (south and east)
    const precast = (f, len, bays, H) => {
      const bay = len / bays;
      put(L.gran, f, len / 2, 3.5, 0.5, len, 7, WALL_T + 1);
      put(L.brick, f, len / 2, 17, 0, len, 20, WALL_T);                            // thin-brick lower zone
      put(L.cream, f, len / 2, 27.4, 0.9, len, 1.6, WALL_T + 1.8);                 // string course
      put(L.trav, f, len / 2, (27 + H) / 2, 0, len, H - 27, WALL_T);               // travertine-finish upper zone
      put(L.dark, f, len / 2, H - 2.6, 1.4, len + 1, 5.2, WALL_T + 3);
      for (let k = 0; k <= bays; k++) {
        const s = k === 0 ? 2 : k === bays ? len - 2 : k * bay;
        put(L.trav2, f, s, (H) / 2, 0.8, k === 0 || k === bays ? 4 : 5, H, WALL_T + 1.6);
      }
      for (let k = 0; k < bays; k++) {
        const s = (k + 0.5) * bay;
        for (const y of [44, 70]) put(L.glass, f, s, y, WALL_T / 2 + 0.2, bay * 0.55, 18, 0.8);
        put(L.glass, f, s, 13, WALL_T / 2 + 0.2, bay * 0.4, 14, 0.8);              // gate glazing in the brick zone
      }
    };
    { const s = seg(P_NW, P_NE); arcade(s.f, s.len, 18, H_N, [0, 5, 10, 15], [3, 8, 13]); }
    { const s = seg(P_NW, P_SW); arcade(s.f, s.len, 18, H_W, [0, 6, 12, 17], [3, 9]); }
    { const s = seg(P_SW, P_SE); precast(s.f, s.len, 14, H_S); }
    for (let i = 0; i < EAST.length - 1; i++) { const s = seg(EAST[i], EAST[i + 1]); precast(s.f, s.len, Math.round(s.len / 48), H_E); }
    { const s = seg(...CHAMFER); precast(s.f, s.len, 3, H_E); }
    { const s = seg(...EAST_S); precast(s.f, s.len, 3, H_E); }

    // ------------------------------------------------------------------ "Texas-sized porches": big shade canopies at the SE, SW and NE entries
    {
      const porch = (u, v, nu, nv, wide) => {                                      // corner position and outward compass normal
        const l = Math.hypot(nu, nv), f = frame(loc(u, v), [-nv / l, -nu / l]);
        put(L.trav, f, 0, 70, -4, 54, 80, 34);                                     // corner pavilion
        put(L.cream, f, 0, 112, -4, 60, 3.4, 40);
        put(L.dark, f, 0, 64, 30, wide, 5, 56);                                    // deep canopy slab (dark steel, photo 1)
        put(L.brick, f, 0, 40, 4, 58, 12, 6);
        for (const sx of [-wide * 0.42, 0, wide * 0.42]) for (const o of [10, 54]) { put(L.brick, f, sx, 31, o, 5, 62, 5); put(L.stone, f, sx, 4, o, 6.6, 8, 6.6); }
        put(L.glass, f, 0, 24, 2.4, 70, 40, 1);                                    // entry glazing
      };
      porch(553, 3, 118, -78, 120);          // SE entry on the chamfer (measured corner)
      porch(P_SW[0], P_SW[1], -1, -1, 120);  // SW entry (south part is text-based)
      porch(511, 385, 265, 71, 100);         // NE entry (roof seen on the sheet near 550,385)
    }

    // ------------------------------------------------------------------ roof group R: leaned like the sheet (u = u0 - 0.255 v)
    const R = new THREE.Group(); R.matrixAutoUpdate = false;
    R.matrix.set(1, 0, 0, 0, 0, 1, 0, 0, SHEAR, 0, 1, 0, 0, 0, 0, 1);               // z' = z + SHEAR x   (lz = -u, lx = -v)
    F.add(R);

    // tracks: north deck v 452..488 from u -577 to 310; south track v -197 from u -420 to 480; columns outside the building
    {
      const cols = [];
      const track = (v, u0, u1, th) => L.track.push(mat4(-v, 135, -(u0 + u1) / 2, th, 22, u1 - u0));
      track(RAIL_N, -577, 310, 36); track(RAIL_S, -420, 480, 30);
      for (let u = -577; u < -240; u += 56.25) cols.push(mat4(-RAIL_N + 10, 62, -u, 5, 124, 5), mat4(-RAIL_N - 10, 62, -u, 5, 124, 5));
      for (let u = -420; u < -240; u += 56.25) cols.push(mat4(-RAIL_S, 62, -u, 6, 124, 6));
      inst(F, unit, mSteel, cols);
    }

    // fixed roofs (outlines from the sheet). They rise from the facade ledge (104 ft) at about 0.62 ft per ft until they reach
    // the level of the panel track (136 ft west, 142 ft east), then run flat: the upper deck (top 108 ft) must clear the ceiling.
    const mFix = lam('#cfc9b8'), mFix2 = lam('#d7d0bd');
    const Y_INW = 136, Y_INE = 142, RISE = 0.62;
    const roofY = (side, u, v) => Math.min(side === 'W' ? Y_INW : Y_INE, Y_FIX + RISE * Math.max(0, side === 'W' ? u - wo(v) : eo(v) - u));
    const outerU = (side, v) => (side === 'W' ? wo(v) : eo(v)), innerU = (side, v) => (side === 'W' ? pw(Math.max(v, PAN_V0)) : pe(Math.max(v, PAN_V0)));
    {
      const strip = (side, v0, v1, mat) => {                                       // quads along v: outer edge, break point, inner edge
        const pos = [], idx = [], n = 36;
        for (let i = 0; i <= n; i++) {
          const v = v0 + (v1 - v0) * i / n, uo = outerU(side, v), ui = innerU(side, v), sg = side === 'W' ? 1 : -1;
          const um = Math.abs(ui - uo) > 61 ? uo + sg * 61 : ui;
          for (const u of [uo, um, ui]) pos.push(-v, roofY(side, u, v), -u);
          if (i) { const k = (i - 1) * 3; for (const j of [0, 1]) idx.push(k + j, k + j + 1, k + j + 3, k + j + 1, k + j + 4, k + j + 3); }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        F.add(new THREE.Mesh(g, mat));
      };
      strip('W', 462, -215, mFix); strip('E', 470, -215, mFix2);
      // cross beams under both strips, sloped like the roof
      const step = low ? 80 : 40;
      for (let v = 440; v > -200; v -= step) {
        for (const side of ['W', 'E']) {
          const uo = outerU(side, v), ui = innerU(side, v);
          L.steel.push(beam([-v, Y_FIX - 4, -uo], [-v, roofY(side, ui, v) - 4, -ui], 2.5));
        }
      }
      // long glass skylight along the west roof; catwalk rows with lamp banks
      ribbon([[-190, 445], [-160, 235], [-125, -38]], 22, 132, lam('#587f95'), F);
      const rung = [];
      for (const path of [[[-168, 442], [-100, 218], [-72, -5]], [[-150, 190], [-70, 190]]]) {
        for (let i = 0; i < path.length - 1; i++) {
          const [a, b] = [path[i], path[i + 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1]), st = low ? 24 : 12;
          for (let s = 0; s < l; s += st) { const t = s / l, u = a[0] + (b[0] - a[0]) * t, v = a[1] + (b[1] - a[1]) * t; rung.push(mat4(-v, roofY('W', u, v) + 1.4, -u, 3, 2.4, 8)); }
        }
      }
      inst(F, unit, lam('#7d7a70'), rung);
      // rooftop plant boxes seen on the west roof
      inst(F, unit, lam('#8b877b'), [mat4(-198, roofY('W', -198, 118) + 4, 118, 9, 8, 14), mat4(-25, roofY('W', -25, 70) + 5, 70, 12, 9, 12), mat4(-120, roofY('W', -120, 255) + 4, 255, 10, 7, 12)]);
    }

    // ------------------------------------------------------------------ the movable roof: one flat panel on the tracks, slides WEST
    const pivot = new THREE.Group(); pivot.position.set(-VC, 0, -UC); R.add(pivot);
    const panel = new THREE.Group(); pivot.add(panel);
    {
      const steel = [], lamps = [], fascia = [];
      const nz = low ? 5 : 9, dz = PLEN / (nz - 1), nx = 15, dx = SPAN / nx;
      for (let k = 0; k < nz; k++) {                                              // trusses across the panel
        const z = -PLEN / 2 + k * dz;
        steel.push(mat4(0, 0, z, SPAN, 2.8, 2.8), mat4(0, T_DEPTH, z, SPAN, 2.8, 2.8));
        for (let i = 0; i < nx; i += low ? 2 : 1) {
          const xa = -SPAN / 2 + i * dx, xb = xa + dx * (low ? 2 : 1);
          steel.push(i % 2 ? beam([xa, T_DEPTH, z], [xb, 0, z], 1.6) : beam([xa, 0, z], [xb, T_DEPTH, z], 1.6));
        }
      }
      for (let i = 0; i <= nx; i += low ? 3 : 1) steel.push(mat4(-SPAN / 2 + i * dx, T_DEPTH, 0, 2, 2, PLEN));    // purlins
      for (let i = 0; i <= nx; i += 3) steel.push(mat4(-SPAN / 2 + i * dx, 0, 0, 2.2, 2.2, PLEN));
      // deck zones, local x = -(v - VC): north (x -337..-117) dark opaque, middle (to +60) translucent ETFE, south pale opaque
      const x0 = -(PAN_V1 - VC), xa = -(250 - VC), xb = -(72 - VC), x1 = SPAN / 2;
      const zone = (xs, xe, mat) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(xe - xs, PLEN).rotateX(-Math.PI / 2), mat); m.position.set((xs + xe) / 2, T_DEPTH + 1.4, 0); panel.add(m); return m; };
      zone(x0, xa, lam('#737b7e'));
      zone(xb, x1, lam('#ebe6d4'));
      const rib = textTexture((g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(150,185,195,0.9)'; g.fillRect(0, 0, w, h * 0.35); }, 8, 32);
      rib.wrapS = rib.wrapT = THREE.RepeatWrapping; rib.repeat.set(1, PLEN / 7);
      zone(xa, xb, new THREE.MeshLambertMaterial({ map: rib, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
      // edge fascia (parapet band) on all four sides
      for (const sx of [-1, 1]) fascia.push(mat4(sx * SPAN / 2, T_DEPTH - 1, 0, 1.4, 8, PLEN));
      for (const sz of [-1, 1]) fascia.push(mat4(0, T_DEPTH - 1, sz * PLEN / 2, SPAN, 8, 1.4));
      // rail carriages under both truss ends
      for (const sx of [-1, 1]) for (const z of [-PLEN / 2 + 14, PLEN / 2 - 14]) steel.push(mat4(sx * (SPAN / 2 - 6), -6, z, 12, 10, 18));
      // lamp banks hang under the bottom chord along the north and south edges and across the panel
      const step = low ? 40 : 20;
      for (let z = -PLEN / 2 + 9; z < PLEN / 2; z += step) for (const sx of [-1, 1]) lamps.push(mat4(sx * (SPAN / 2 - 4), -3.4, z, 5, 2.4, 11));
      for (let x = -SPAN / 2 + 18; x < SPAN / 2 - 10; x += step * 1.5) for (const sz of [-1, 1]) lamps.push(mat4(x, -3.4, sz * (PLEN / 2 - 4), 11, 2.4, 5));
      inst(panel, unit, mSteel, steel); inst(panel, unit, lam('#b9bcb4'), fascia); inst(panel, unit, basic('#fff1c4'), lamps);
    }
    // register the panel with the park so the Open/Close button keeps working (local z: 0 = closed, +PLEN = open to the west)
    {
      const park = ctx.park || (globalThis.__show && globalThis.__show.park);
      if (park && Array.isArray(park.roof)) {
        for (const r of park.roof) if (r.panel && r.panel.parent) r.panel.parent.remove(r.panel);
        park.roof = [{ panel, closedZ: 0, openZ: PLEN, closedY: Y_BOT, openY: Y_BOT }];
        park._placeRoof();
      } else {
        panel.position.set(0, Y_BOT, PLEN);                                        // fallback: static, roof open
      }
    }
    // lamp banks on the inner edges of the fixed strips
    {
      const lamps = [], step = low ? 40 : 20;
      for (let v = 440; v > -190; v -= step) { lamps.push(mat4(-v, Y_INW - 11, -(pw(v) - 4), 5, 2.4, 11), mat4(-v, Y_INE - 11, -(pe(v) + 4), 5, 2.4, 11)); }
      inst(F, unit, basic('#fff1c4'), lamps);
    }

    // ------------------------------------------------------------------ sloped metal roof wall (photos 1 and 3)
    // Above the cornice a flat ledge, then a ribbed silver-grey wall leaning back about 70 deg up to the roof panel's edge.
    // Built as one merged mesh from quads given as compass points [u, v, y].
    {
      const pos = [], uv = [], idx = [];
      const quad = (a, b, c, d, rep) => {                                           // a-b bottom edge, c-d top edge (same side as b, a)
        const k = pos.length / 3, len = Math.hypot(b[0] - a[0], b[1] - a[1]) / rep;
        for (const [u, v, y] of [a, b, c, d]) pos.push(-v, y, -u);
        uv.push(0, 0, len, 0, len, 1, 0, 1); idx.push(k, k + 1, k + 2, k, k + 2, k + 3);
      };
      const T = 164, LED = 104;                                                     // wall top and ledge height
      // north: ledge v 500..494 at y 104, wall (494,104) -> (470,170)
      quad([-231, 497, LED], [480, 497, LED], [480, 494, LED], [-231, 494, LED], 7);
      quad([-231, 494, LED], [480, 494, LED], [480, 470, T], [-231, 470, T], 7);
      // south: wall (v -211, y 100) -> (v -197, y 158); the south part is text based
      quad([wo(-211), -211, 100], [pe(-211) + 20, -211, 100], [pe(-197) + 20, -197, 158], [wo(-197), -197, 158], 7);
      // east: along the panel's east edge, from the fixed east roof (y 142) up to the panel top
      quad([pe(470) + 12, 470, Y_INE], [pe(-205) + 12, -205, Y_INE], [pe(-205), -205, T], [pe(470), 470, T], 7);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx); g.computeVertexNormals();
      const rib = textTexture((gg, w, h) => { gg.fillStyle = '#b3bbbf'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#9fa8ad'; gg.fillRect(0, 0, w * 0.22, h); gg.fillStyle = '#c4cacc'; gg.fillRect(w * 0.22, 0, w * 0.06, h); }, 32, 8);
      rib.wrapS = rib.wrapT = THREE.RepeatWrapping;
      F.add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({ map: rib, side: THREE.DoubleSide })));
      // dark coping line along the top of the north wall
      L.dark.push(mat4(-471, T + 0.5, -(-231 + 480) / 2, 1.6, 1.6, 711));
    }

    // ------------------------------------------------------------------ push the facade instance lists
    inst(F, unit, mBrick, L.brick); inst(F, unit, mCream, L.cream); inst(F, unit, mGran, L.gran);
    inst(F, unit, mTrav, L.trav); inst(F, unit, mTrav2, L.trav2); inst(F, unit, mGlass, L.glass);
    inst(F, unit, mSteel, L.steel); inst(F, unit, lam('#a3a59f'), L.track); inst(F, unit, mStone, L.stone); inst(F, unit, mDark, L.dark);
    inst(F, new THREE.CircleGeometry(1, low ? 10 : 16, 0, Math.PI), mGlass, arcDisc);
    inst(F, new THREE.RingGeometry(0.89, 1, low ? 10 : 16, 1, 0, Math.PI), mCream, arcRing);
    // west parking lot under the parked roof (u -460..-245, v 0..405 on the sheet)
    {
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#7b7a74'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d8d4c4'; g.lineWidth = 2;
        for (let y = 0; y < h; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      }, 128, 256);
      const m = ctx.add(new THREE.PlaneGeometry(430, 215).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: tex }), F);
      m.position.set(-205, -0.9, 350);
    }

    // ------------------------------------------------------------------ batter's eye: 120 x 40 ft, vertical dark green
    {
      if (parts.batterEye) ctx.remove(parts.batterEye);
      const [p, n] = tools.span(-8.5, 8.5);
      const tex = textTexture((g, w, h) => {
        g.fillStyle = '#22402f'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b4d38';
        for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 4, h);
      }, 64, 8);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      const mEye = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide }), mTop = lam('#1c3326');
      ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 40], [18, 40], [18, 0]], [0, 1, 0, -1], 1), [mEye, mTop]);
    }

    // ------------------------------------------------------------------ foul-side bowl: field level + mezzanine with a fascia step (photos 4, 5, 7)
    {
      const dd = dims.deckAt, [p, n, a] = tools.cut(0, 1);
      const lowerOld = parts.lowerDeck;
      const dB = (g) => dd.dL(g), dA = (g) => 0.5 * dd.dL(g), yA = (g) => 3.5 + 0.33 * dA(g), STEP = 4.5;
      const yB = (g) => dd.lowTop(g);
      if (parts.dugouts) G.add(parts.dugouts);                                      // keep the dugouts, replace the deck under them
      ctx.remove(lowerOld);
      const deck = ctx.add(sweepSolid(p, n, (i) => { const g = a + i; return [[0, 0], [0, 3.5], [dA(g), yA(g)], [dA(g), yA(g) + STEP], [dB(g), yB(g)], [dB(g), 0]]; },
        [MAT.WALL, MAT.SEAT, MAT.FACADE, MAT.SEAT, MAT.FACADE, -1], MAT.FACADE), M);
      parts.lowerDeck = deck;
      // seating fascia ribbon, 2.5 ft high, blank (photo 5)
      ctx.add(sweepSolid(p, n, (i) => { const g = a + i; return [[dA(g) - 0.5, yA(g) + 1.3], [dA(g) - 0.5, yA(g) + 3.8], [dA(g) + 0.05, yA(g) + 3.8], [dA(g) + 0.05, yA(g) + 1.3]]; }, [0, 0, 0, -1], 0),
        [new THREE.MeshBasicMaterial({ color: '#d6c88e' })], deck);
      const off = (d) => p.map((q, i) => [q[0] + n[i][0] * d(a + i), q[1] + n[i][1] * d(a + i)]);
      deck.add(tools.aisles(p, n, { d0: 0, h0: 3.5, d1: (fi) => dA(a + fi), h1: (fi) => yA(a + fi) }, { every: 24, lod: ctx.lod }));
      deck.add(tools.aisles(p, n, { d0: (fi) => dA(a + fi), h0: (fi) => yA(a + fi) + STEP, d1: (fi) => dB(a + fi), h1: (fi) => yB(a + fi) }, { every: 24, lod: ctx.lod }));
      deck.add(tools.rail(off(() => 0.4), () => 3.5, { height: 3.5, lod: ctx.lod }));
      deck.add(tools.rail(off((g) => dA(g) + 0.4), (i) => yA(a + i) + STEP, { height: 3.5, glass: true, color: '#7d7a6c', lod: ctx.lod }));
    }

    // suite-level fascia ribbon, 3.5 ft x about 211 ft, blank; sits on the upper deck front fascia on the right-field side (photo 7)
    {
      const dd = dims.deckAt, [p, n, a] = tools.cut(0.08, 0.30);
      ctx.add(sweepSolid(p, n, (i) => { const g = a + i, d = dd.d0(g), h = dd.h0(g); return [[d - 0.5, h - 5.4], [d - 0.5, h - 1.9], [d + 0.05, h - 1.9], [d + 0.05, h - 5.4]]; }, [0, 0, 0, -1], 0), [new THREE.MeshBasicMaterial({ color: '#7f95ad' })]);
    }

    // ------------------------------------------------------------------ video boards (faces blank), photos 4, 7, 8 and the Rangers' board list
    // Left field 111 x 40 over the Sky Porch, right field 150 x 58, center field 80 high x 20 wide. All hang from the roof truss line
    // (top about 146 ft in the center and right boards) on steel masts, with a catwalk below and a lattice back structure.
    const steelB = [], frameB = [];
    {
      const faceTex = (w, h) => textTexture((g, W, H) => {
        g.fillStyle = '#1b2125'; g.fillRect(0, 0, W, H); g.strokeStyle = '#252d33'; g.lineWidth = 1;
        const st = W / (w / 3);
        for (let x = 0; x < W; x += st) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
        for (let y = 0; y < H; y += st) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      }, 256, Math.max(32, Math.round(256 * h / w)));
      const board = ({ deg, out, y0, w, h, base, look = [0, 40], mast = true }) => {
        const c = tools.wallAt(deg, out, y0 + h / 2);
        const grp = new THREE.Group(); grp.position.copy(c); G.add(grp); grp.lookAt(look[0], c.y, look[1]); grp.updateMatrix();
        const W4 = (m) => new THREE.Matrix4().multiplyMatrices(grp.matrix, m);
        const bx = (list, x, y, z, sx, sy, sz) => list.push(W4(mat4(x, y, z, sx, sy, sz)));
        const bm = (list, a, b, th) => list.push(W4(beam(a, b, th)));
        const scr = ctx.add(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: faceTex(w, h) }), grp); scr.position.z = 0.1;
        bx(frameB, 0, 0, -1.6, w + 4, h + 4, 3);                                    // cabinet and frame
        bx(frameB, 0, h / 2 + 2.2, 0.2, w + 5, 1.2, 1.2); bx(frameB, 0, -h / 2 - 2.2, 0.2, w + 5, 1.2, 1.2);
        // back structure: two chords, verticals and diagonals, 12 ft behind the cabinet
        const nb = Math.max(2, Math.round(w / 15)), bw = w / nb, zb = -10;
        bx(steelB, 0, h / 2 + 3, zb, w + 4, 1.4, 1.4); bx(steelB, 0, -h / 2 - 3, zb, w + 4, 1.4, 1.4);
        for (let i = 0; i <= nb; i++) { bx(steelB, -w / 2 + i * bw, 0, zb, 1.2, h + 7, 1.2); if (i < nb) bm(steelB, [-w / 2 + i * bw, i % 2 ? h / 2 + 3 : -h / 2 - 3, zb], [-w / 2 + (i + 1) * bw, i % 2 ? -h / 2 - 3 : h / 2 + 3, zb], 0.9); }
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) bm(steelB, [sx * (w / 2 + 2), sy * (h / 2 + 3), zb], [sx * (w / 2 + 2), sy * (h / 2 + 2), -1.6], 1.2);   // ties to the cabinet
        bx(steelB, 0, h / 2 + 3, zb / 2, w + 4, 1, 9);                              // top walk deck
        // catwalk with a hand rail under the board
        bx(steelB, 0, -h / 2 - 6, -5, w + 8, 0.6, 7); bx(steelB, 0, -h / 2 - 3.4, -8.4, w + 8, 0.35, 0.35);
        // masts: from the stand or porch top (base) up to the roof truss line (y 146)
        if (mast) for (const sx of [-1, 1]) {
          const x = sx * (w / 2 - 3), yb = base - c.y, yt = 146 - c.y, lh = yt - yb, nk = Math.max(3, Math.round(lh / 14));
          for (const dz of [-6, -16]) bx(steelB, x, (yb + yt) / 2, dz, 1.8, lh, 1.8);
          for (let k = 0; k <= nk; k++) bx(steelB, x, yb + lh * k / nk, -11, 1.1, 1.1, 11);
          for (let k = 0; k < nk; k++) bm(steelB, [x, yb + lh * k / nk, k % 2 ? -6 : -16], [x, yb + lh * (k + 1) / nk, k % 2 ? -16 : -6], 0.9);
        }
        return grp;
      };
      // left field: over the Sky Porch (porch top is 52 ft); the porch solid itself is built below
      board({ deg: -41.5, out: 33, y0: 88, w: 111, h: 40, base: 52, look: [0, 40] });
      // right field: high on the right-center to right corner roof structure, bearing about 31 deg right of center (photos 7, 8)
      board({ deg: 31, out: 58, y0: 88, w: 150, h: 58, base: 36, look: [0, 40] });
      // center field: tall narrow board over the batter's eye, top at the roof chord
      board({ deg: 0, out: 40, y0: 66, w: 20, h: 80, base: 42, look: [0, 40] });
      // Sky Porch (third-base-line pole): stepped terraces under the left-field board
      const [p, n] = tools.span(-45, -37.5);
      ctx.add(sweepSolid(p, n, () => [[1.2, 0], [1.2, 22], [12, 22], [12, 38], [26, 38], [26, 52], [40, 52], [40, 0]],
        [MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.CREAM, MAT.FACADE, MAT.SHADE, MAT.FACADE, -1], MAT.FACADE), M);
      // banners hang from the roof truss near center field (photo 7): plain colour panels on short arms
      {
        const cols = ['#2f4b7c', '#e0d3b0', '#9b4a36'], fl = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), 3);
        [3.2, 6.9, 10.6].forEach((deg, i) => {
          const q = tools.wallAt(deg, 30, 138);
          tmp.position.copy(q); tmp.lookAt(0, 138, 40); tmp.scale.set(9, 20, 1); tmp.updateMatrix(); fl.setMatrixAt(i, tmp.matrix); fl.setColorAt(i, new THREE.Color(cols[i]));
          steelB.push(mat4(q.x, 144, q.z, 0.8, 4, 0.8));                             // hanger
        });
        tmp.scale.set(1, 1, 1); G.add(fl);
      }
      // foul poles: about 75 ft above the field (photos 4 and 7), the generic ones are 60 ft
      for (const pl of parts.poles) { pl.scale.y = 1.25; pl.position.y = 37.5; }
      inst(G, unit, lam('#4a4f55'), steelB); inst(G, unit, lam('#33383d'), frameB);
    }

    // ------------------------------------------------------------------ outfield curtain wall (photos 6-8)
    // Behind the outfield seats: a dark concourse wall, then brick piers (8 ft) with limestone base blocks and dark glass bays
    // (16 ft) up to a dark cornice at the roof truss line, one bay per 24 ft.
    {
      const [p, n, dg] = tools.span(-45, 45), TH = 140;
      const tex = textTexture((g, w, h) => {
        const k = h / TH, Y = (ft) => h - ft * k, pw8 = w * 8 / 24;
        g.fillStyle = '#5a4b42'; g.fillRect(0, 0, w, h);                          // lower concourse wall
        g.fillStyle = '#3b5260'; g.fillRect(0, Y(130), w, 68 * k);                  // glass bays 62..130 ft
        g.fillStyle = '#2a3841'; for (const f of [104, 118]) g.fillRect(0, Y(f), w, 1.5);   // transoms
        g.fillStyle = '#8fa6b0'; g.beginPath(); g.moveTo(pw8 + 3, Y(62)); g.lineTo(pw8 + 3, Y(92)); g.quadraticCurveTo(pw8 + 3, Y(104), (pw8 + w) / 2 + 1.5, Y(106)); g.quadraticCurveTo(w - 3, Y(104), w - 3, Y(92)); g.lineTo(w - 3, Y(62)); g.closePath(); g.fill();   // pointed arched window (photo 4)
        g.fillStyle = '#a8705d'; g.fillRect(0, Y(130), pw8, 82 * k);                // brick pier 48..130
        g.fillStyle = '#b8a07a'; g.fillRect(0, Y(62), pw8 + 2, 14 * k);             // limestone base block 48..62
        g.fillStyle = '#3c3936'; g.fillRect(0, 0, w, 10 * k);                      // dark cornice 130..140
      }, 64, 512);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 3 / TH);
      const mC = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide });
      ctx.add(sweepSolid(p, n, (i) => { const d = 82 + 4 * dg[i] / 45; return [[d, 0], [d, TH], [d + 1, TH], [d + 1, 0]]; }, [0, 1, 0, -1], 1), [mC, mDark]);
    }

    // ------------------------------------------------------------------ extra camera stops
    const [gx, , gz] = W(150, 760), [glx, , glz] = W(150, 500);
    views.gate = { pos: [gx, 42, gz], look: [glx, 56, glz], label: 'North Arcade' };
    const [rx, , rz] = W(640, -330);
    views.roof = { pos: [rx, 360, rz], look: [0, 0, -190], orbit: true, label: 'Roof & Tracks' };
    views.aerial.pos = [dims.maxR * 0.85, dims.maxR * 1.0, 330]; views.aerial.dir = undefined;
    const up = tools.foulAt(0.5, dims.d0 + dims.dU * 0.55, dims.h0 + dims.sU * dims.dU * 0.55 + 5);
    const rfb = tools.wallAt(31, 58, 117);
    views.under = { pos: [up.x, up.y, up.z], look: [rfb.x, 100, rfb.z], label: 'Under the Roof' };
  },
};
