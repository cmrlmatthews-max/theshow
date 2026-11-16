// Detail module: Tropicana Field, Tampa Bay Rays (St. Petersburg, opened 1990). Units: feet.
// The only fixed dome in MLB: a tilted, cable-supported translucent fiberglass roof on a white compression ring.
//
// MEASURED FROM THE SURVEY SHEET (survey.png, 1.1 px/ft; home plate = origin; the real field points to the north-east,
// the sheet is rotated so center field is up). The aerial image was taken with the roof fabric missing, so the cable
// net, the rings and the compression ring could be traced directly:
//  - Compression ring (white band, 24 mast joints, 48 panels): circle centered (-28, -122), outer radius 358, inner 346
//    (outer r 360 on the CF and RF side, 352 on the home side; fitted from 60 radial scans).
//  - Cable-dome hub at (-37, -138) (white disc, ~13 ft radius); three catwalk rings around it with radii ~56, 135 and
//    250 ft (rings A, B, C; the compression ring is D); 24 ridge cables from the hub to the ring masts, 24 in between.
//  - Four round ramp towers (outer r 48, hole r 20): west (-433, -72), east (409, -72), south-west (-188, 230),
//    south-east (173, 230).
//  - Flat concourse roof outside the ring on the north half (outer r ~388), the north box (x -97..82, z -576..-516),
//    the glass-roofed round rotunda (center 158, -515, r ~40), the curved east wing (angles 35..66 deg, r to 392),
//    the east block (x to 366, z -233..-93), the south-east block (x to 355, z -35..60), the south entrance band and the
//    covered walkway (x -14..4, z 248..300), blue canopies at the south and west gates.
//  - Outfield: posted distances kept (corners checked against the pale deck edge: CF wall at 406, both poles ~320).
//  - Bowl: the seating edge to the ring leaves ~170-195 ft of bowl behind home and along the lines, ~60 ft behind center.
// FROM TEXT SOURCES (Birdair, Serge Ferrari, Wikipedia): roof 225 ft above second base falling to 85 ft at the center
//  field wall, tilt 6.5 deg, six acres of PTFE fiberglass fabric, 24 panels of ~330 ft, cable dome (Georgia Dome type),
//  catwalk rings A to D with lights hung from them, 35 x 64 ft video board, cownose ray tank just over the right-center
//  fence, backstop 50 ft, 70 suites, three levels (100 / 200 / 300).
// LEVEL 4 (photographs 1 to 7 in refs/TBR, plus the sheet):
//  A FACADE (photographs 1, 2): the outer wall is blank warm-gray concrete with a projecting light cornice at the roof line and
//   24 round columns at 15 deg (no slit windows; glass only at the entrance blocks). Entrance drum (photograph 2): beige, dark
//   glazing band, plain ballpark-name text, glass grid roof (sheet). Small hatch on top of the dome at the hub (photograph 1).
//   Suite level (photograph 5): dark glazed band between the lower deck and the upper-deck overhang.
//  B HEIGHTS. Ring plane: 85 ft at the CF end (text) and 6.5 deg tilt (text) gives 83 to 165 ft; facade top = ring plane - 9.
//   Sun/shadow ratio (shadow length / height) 0.43, from the sheet: the sunlit field edge on the east side is the shadow of the
//   rim (rim point at ring height 144 ft throws 62 ft; sun from the south-east, shadows run toward -x, -z). With it: the west ramp
//   tower throws a 29 ft shadow (leftmost shadow edge 17 ft beyond the tower wall) -> 66 ft (was 64 estimated); the north box
//   shadow on the ground (about 20 ft) -> 46 ft kept. Seat rows: lower deck row rise 1.2 ft on a 2.8 ft tread (slope 0.44,
//   about 26 rows behind home, 74 ft); upper deck rise 1.4 ft per tread (slope 0.5), top row 99 ft behind home to 127 ft on the
//   3B side, kept 8 ft or more under the facade top. Suite story: lower-deck back wall to upper fascia 13 to 15 ft (photograph 5).
//   Boards: 64 x 35 ft main board (text); board underside 36 ft = about 1 story above the seat tops (photograph 4, board
//   height against the 9 ft wall band); catwalk deck 34 ft.
//  C SEATING (sheet, photographs 3 and 5). Distance from the foul edge of the stands to the ring (measured on the sheet): 102 ft
//   at the RF pole, 170 ft behind home, 190 to 234 ft on the 3B side, 179 ft at the LF pole. Lower deck ends (shadow band and
//   row of tunnel roofs): 74 ft behind home, 88 ft on the 1B side, 98 ft on the 3B side, 60 and 66 ft at the poles. Upper
//   deck follows the bowl: it ends 30 ft before the ring (tables in config); the rest is the concourse top.
//  D BOARDS: the center-field board wall (sheet: dark block, lattice back structure x -90..55, z -445..-420; photographs 3, 4, 6):
//   main board, two side boards, one tall board; each with frame, cabinet, back truss, two support columns, X brace, plus one
//   service catwalk with rail. Faces are blank dark panels. No flagpoles other than the foul poles.
// ESTIMATED: the exact roof surface profile (power law between hub and ring), ring heights, facade bands, block heights
//  (46 to 60 ft), wall heights at the corners, the board positions along the wall (only the CF block is on the sheet), the
//  tank position, board sizes other than the main one, the seat rows per deck (rows are counted on photographs, not exact).

const D2R = Math.PI / 180;
const C0 = [-28, -122];            // compression ring center
const R_BAND = 352;                // ring band center radius (346..358, outer face at 358)
const R_FAC = 360;                 // outer face of the facade wall
const K_TILT = 0.1139;             // tan(6.5 deg), roof drops toward center field
const HUB = [-37, -138], Y_HUB = 225;
const yRimAt = (z) => 124 + K_TILT * (z + 122);   // ring plane: 83 ft at the CF end, 165 ft at the home end
const dirA = (a) => [Math.sin(a * D2R), -Math.cos(a * D2R)];   // a = 0 center field, +90 right field
const ringXZ = (a, R) => { const d = dirA(a); return [C0[0] + d[0] * R, C0[1] + d[1] * R]; };
// point on the roof net: s = 0 at the hub, 1 at the ring band; returns [x, y, z]
const surf = (s, a) => {
  const r = ringXZ(a, R_BAND);
  const x = HUB[0] + s * (r[0] - HUB[0]), z = HUB[1] + s * (r[1] - HUB[1]);
  return [x, Y_HUB + (yRimAt(r[1]) - Y_HUB) * Math.pow(s, 1.15), z];
};

const TOWERS = [[-433, -72], [409, -72], [-188, 230], [173, 230]];
const TOWER_H = 66;                // shadow of the west tower 29 ft long, shadow ratio 0.43 (see top comment)
// distance from point p along unit normal n to the ring's inner face (radius 344)
const toRing = (p, n) => {
  const dx = p[0] - C0[0], dz = p[1] - C0[1], b = dx * n[0] + dz * n[1];
  const disc = b * b - (dx * dx + dz * dz) + 344 * 344;
  return disc > 0 ? -b + Math.sqrt(disc) : 0;
};

export default {
  config() {
    return {
      wall: [
        { deg: -45, r: 315, h: 11 }, { deg: -22.5, r: 370, h: 11 }, { deg: 0, r: 404, h: 9 },
        { deg: 22.5, r: 370, h: 11 }, { deg: 45, r: 322, h: 11 },
      ],
      backstop: 50,
      // bowl tables (t 0 = right-field end, 0.5 = behind home, 1 = left-field end), from the sheet and photographs 3 and 5
      lower: { depth: [[0, 60], [0.1, 78], [0.2, 86], [0.3, 88], [0.4, 82], [0.5, 74], [0.6, 88], [0.7, 98], [0.8, 98], [0.9, 94], [1, 66]], slope: 0.44, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: 16, rise: [[0, 26], [0.5, 30], [1, 26]], slope: 0.5, extent: [0.03, 0.97],
        depth: [[0, 28], [0.1, 62], [0.2, 76], [0.3, 84], [0.4, 86], [0.5, 80], [0.6, 112], [0.7, 118], [0.8, 116], [0.9, 100], [1, 80]],
      },
      outfield: {
        depth: 70, slope: 0.42,
        spans: [[-45, -30, 108, 0.42], [-30, -10, 76, 0.42], [10, 15, 52, 0.45], [22, 30, 54, 0.45], [30, 45, 58, 0.45]],
        eye: [-10, 10], eyeHeight: 30, eyeDepth: 30,
      },
      skip: { scoreboard: true, lights: true, canopy: true },
      colors: { seat: '#34507d', facade: '#c9c3b1', wall: '#25405f', cream: '#e3dcc6' },
    };
  },

  build(ctx) {
    const { THREE, G, M, MAT, tools, paths, dims, parts, views } = ctx;
    const { sweepSolid, textTexture, wallR, wallH, clamp } = tools;
    const { bPts, bN } = paths;
    const spec = ctx.spec;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const tmp = new THREE.Object3D();
    const V3 = THREE.Vector3;
    const inst = (geo, mat, mats) => {
      const m = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((mx, i) => m.setMatrixAt(i, mx));
      m.instanceMatrix.needsUpdate = true; G.add(m); return m;
    };
    const mat4 = (x, y, z, sx, sy, sz, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.scale.set(sx, sy, sz); tmp.updateMatrix(); return tmp.matrix.clone(); };
    const beam = (a, b, th) => {                       // thin box from a to b ([x,y,z])
      const A = new V3(...a), B = new V3(...b), dir = B.clone().sub(A), len = dir.length();
      tmp.position.copy(A).add(B).multiplyScalar(0.5);
      tmp.quaternion.setFromUnitVectors(new V3(0, 0, 1), dir.normalize());
      tmp.scale.set(th, th, len); tmp.updateMatrix(); return tmp.matrix.clone();
    };

    // ---- remove the generic dome and its wireframe ribs
    if (parts.dome) ctx.remove(parts.dome);
    ctx.remove(G.children.filter((o) => o.material && !Array.isArray(o.material) && o.material.wireframe));
    ctx.remove(parts.lights);

    // ---------- 1. closed circle paths ----------
    const N = low ? 64 : 96;
    const circle = (R, n = N) => {
      const pts = [], nrm = [];
      for (let i = 0; i <= n; i++) { const a = (i / n) * 360, d = dirA(a), p = ringXZ(a, R); pts.push(p); nrm.push(d); }
      return [pts, nrm];
    };
    const angAt = (i, n = N) => (i / n) * 360;

    // ---------- 2. facade wall: tilted top follows the ring plane; textured concrete ----------
    const facTex = textTexture((g, w, h) => {
      g.fillStyle = '#c6c4b8'; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(70,66,56,0.22)';
      for (let y = 0; y < h; y += h / 2) g.fillRect(0, y, w, 3);            // horizontal joints every 12 ft
      for (let x = 0; x < w; x += w / 4) g.fillRect(x, 0, 3, h);            // vertical joints every 12 ft
      g.fillStyle = 'rgba(255,255,255,0.10)'; for (let x = 0; x < w; x += w / 4) g.fillRect(x + 4, 0, 5, h);
      g.fillStyle = 'rgba(90,84,66,0.10)'; g.fillRect(0, h * 0.5 - 6, w, 6);
    }, 256, 128);
    facTex.wrapS = facTex.wrapT = THREE.RepeatWrapping; facTex.repeat.set(24 / 48, 3 / 24);
    const mFac = new THREE.MeshLambertMaterial({ map: facTex, side: THREE.DoubleSide });
    const mFacIn = lam('#cfcabb'), mCap = lam('#d9d7cc'), mShade = lam('#8f8c80');
    {
      const [pts, nrm] = circle(R_FAC);
      const top = (i) => yRimAt(pts[i][1]) - 9;
      const geo = sweepSolid(pts, nrm, (i) => [[0, -2], [0, top(i)], [-9, top(i)], [-9, -2]], [0, 1, 2, -1], 1);
      ctx.add(geo, [mFac, mCap, mFacIn]);
      // plinth: darker base course
      ctx.add(sweepSolid(pts, nrm, () => [[0.6, -2], [0.6, 9], [0, 9], [0, -2]], [0, 0, 0, 0], 0), [mShade]);
    }
    // The wall is blank gray concrete (photograph 1): no slit windows. 24 round columns stand in front of it at 15 deg
    // (photograph 1 shows about 13 over the visible half), glass only at the entrance blocks (bands below).
    {
      const cols = [], feet = [];
      for (let k = 0; k < 24; k++) {
        const a = k * 15, [x, z] = ringXZ(a, R_FAC + 1.2), h = yRimAt(z) - 9;
        tmp.position.set(x, h / 2 - 1, z); tmp.rotation.set(0, 0, 0); tmp.scale.set(1, h + 2, 1); tmp.updateMatrix(); cols.push(tmp.matrix.clone());
        feet.push(mat4(x, 4, z, 1, 1, 1));
      }
      inst(new THREE.CylinderGeometry(2.3, 2.3, 1, low ? 8 : 12, 1), lam('#d6d4c9'), cols);
      inst(new THREE.CylinderGeometry(3.2, 3.6, 8, low ? 8 : 12), lam('#a9a69a'), feet);
      // glazed bands on the block faces (entrance zones)
      const gl = [];
      for (const [a0, a1, R, y, w, h] of [[168, 192, 380.6, 20, 11, 20], [37, 64, 392.6, 24, 9, 22], [76, 92, 396.6, 22, 9, 20], [102, 114, 415.6, 24, 9, 24], [-90, 28, 388.6, 34, 14, 14]]) {
        const n = Math.max(2, Math.round((a1 - a0) * Math.PI / 180 * R / (w + 6)));
        for (let k = 0; k < n; k++) { const a = a0 + ((k + 0.5) * (a1 - a0)) / n, [x, z] = ringXZ(a, R), d = dirA(a); gl.push(mat4(x, y, z, w, h, 1, Math.atan2(d[0], d[1]))); }
      }
      inst(new THREE.PlaneGeometry(1, 1), lam('#586b7b'), low ? gl.filter((_, i) => i % 2 === 0) : gl);
    }

    // ---------- 3. compression ring band, joints and masts ----------
    const yBand = (i, pts) => yRimAt(pts[i][1]);
    {
      const [pts, nrm] = circle(R_BAND);
      const geo = sweepSolid(pts, nrm, (i) => { const y = yBand(i, pts); return [[-6, y - 10], [-6, y], [11, y], [11, y - 10]]; }, [0, 1, 2, -1], 1);   // cornice projects 3 ft past the wall face
      ctx.add(geo, [mShade, mCap, mCap]);
      // panel joints (48) and mast posts (24)
      const joints = [], posts = [];
      for (let k = 0; k < 48; k++) {
        const a = k * 7.5, [x, z] = ringXZ(a, R_BAND), d = dirA(a), y = yRimAt(z);
        if (k % 2) joints.push(mat4(x, y - 4, z, 0.9, 8.5, 15, Math.atan2(d[0], d[1])));
        else posts.push(mat4(x, y + 5, z, 3.4, 10, 3.4, Math.atan2(d[0], d[1])));
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#c9c4b3'), joints);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#e9e6da'), posts);
    }

    // ---------- 4. translucent membrane over the net ----------
    {
      const S = [0.0, 0.07, 0.157, 0.27, 0.378, 0.54, 0.70, 0.85, 1.0], NA = N;
      const pos = [], idx = [];
      for (let j = 0; j < S.length; j++) for (let i = 0; i <= NA; i++) { const p = surf(S[j], angAt(i, NA)); pos.push(p[0], p[1] - 1.2, p[2]); }
      for (let j = 0; j < S.length - 1; j++) for (let i = 0; i < NA; i++) {
        const a = j * (NA + 1) + i, b = a + 1, c = a + NA + 1, d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      const mem = ctx.add(g, new THREE.MeshLambertMaterial({ color: '#f3eedd', transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
      mem.renderOrder = 2; parts.dome = mem;
    }

    // ---------- 5. cables, catwalk rings, light banks, hub ----------
    {
      const RS = [0.157, 0.378, 0.70];                 // rings A, B, C
      const NR = low ? 12 : 24;
      const nodes = [1.0, ...RS.slice().reverse(), 0.0];       // ridge cable stations from the rim to the hub
      const ridge = [], second = [];
      for (let k = 0; k < NR; k++) {
        const a = k * 360 / NR;
        const P = nodes.map((s, n) => { const p = surf(s, a); return n === 0 ? [p[0], p[1] + 10, p[2]] : [p[0], p[1] + 1.5, p[2]]; });
        for (let n = 0; n < P.length - 1; n++) ridge.push(beam(P[n], P[n + 1], 1.1));
        if (!low) {
          const a2 = a + 360 / NR / 2;                          // secondary cable between two ridge cables
          const p0 = surf(1.0, a2), p1 = surf(RS[2], a2);
          second.push(beam([p0[0], p0[1] + 1, p0[2]], [p1[0], p1[1] + 1.5, p1[2]], 0.55));
        }
      }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#d9d6cb'), ridge);
      if (second.length) inst(new THREE.BoxGeometry(1, 1, 1), lam('#c8c5ba'), second);

      // catwalk rings as thin walkways
      const widths = [5, 6, 7.5];
      RS.forEach((s, ri) => {
        const pts = [], nrm = [], ys = [];
        for (let i = 0; i <= N; i++) { const a = angAt(i), p = surf(s, a); pts.push([p[0], p[2]]); nrm.push(dirA(a)); ys.push(p[1] + 0.8); }
        const w = widths[ri];
        ctx.add(sweepSolid(pts, nrm, (i) => [[-w, ys[i] - 1.4], [-w, ys[i]], [w, ys[i]], [w, ys[i] - 1.4]], [0, 1, 0, -1], 0), [lam('#aaa598'), lam('#c7c3b5')]);
        // hand rail on the outer edge
        ctx.add(sweepSolid(pts, nrm, (i) => [[w, ys[i]], [w, ys[i] + 3.4], [w + 0.35, ys[i] + 3.4], [w + 0.35, ys[i]]], [0, 0, 0, 0], 0), [lam('#8e8a7e')]);
      });

      // light banks hung under rings B and C (instanced body + lamp face)
      const bodies = [], lamps = [];
      const bank = (s, count, size) => {
        for (let k = 0; k < count; k++) {
          const a = (k + 0.5) * 360 / count, p = surf(s, a), d = dirA(a);
          const rot = Math.atan2(-d[0], -d[1]);             // yaw so the box length follows the ring tangent (cos a, sin a)
          bodies.push(mat4(p[0], p[1] - 4.2, p[2], size, 3.2, 3.2, rot));
          lamps.push(mat4(p[0] - d[0] * 1.8, p[1] - 5.9, p[2] - d[1] * 1.8, size * 0.86, 0.9, 1.4, rot));
        }
      };
      bank(RS[2], low ? 16 : 32, 14); bank(RS[1], low ? 8 : 16, 11); if (!low) bank(RS[0], 8, 8);
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#3c4249'), bodies);
      inst(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#f1e7bd' }), lamps);

      // hub: white disc and cable-dome crown
      const hub = ctx.add(new THREE.CylinderGeometry(13, 14, 3.5, 24), lam('#f0ecde')); hub.position.set(HUB[0], Y_HUB + 1.5, HUB[1]);
      const crown = ctx.add(new THREE.CylinderGeometry(6, 9, 5, 16), lam('#cfcabb')); crown.position.set(HUB[0], Y_HUB + 5.5, HUB[1]);
      const vent = ctx.add(new THREE.CylinderGeometry(4, 5, 5, 12), lam('#f0ecde')); vent.position.set(HUB[0], Y_HUB + 10.5, HUB[1]);   // roof-top hatch seen in photograph 1
    }

    // ---------- 6. blocks around the facade: one merged mesh with seven materials ----------
    const bm = [lam('#e8e4d7'), lam('#f1eee3'), lam('#bdb8a8'), lam('#6d8aa3'), lam('#47545f'), lam('#b9b29f'), lam('#d3ccb8'), lam('#c3b9a1')];
    const buck = bm.map(() => ({ p: [], uv: [] }));
    const take = (geo, remap) => {                        // geometry (non-indexed) -> buckets by material
      const g = geo.index ? geo.toNonIndexed() : geo, P = g.attributes.position.array, U = g.attributes.uv ? g.attributes.uv.array : null;
      const groups = g.groups.length ? g.groups : [{ start: 0, count: P.length / 3, materialIndex: 0 }];
      for (const gr of groups) {
        const b = buck[remap[gr.materialIndex] ?? remap[0]];
        for (let v = gr.start; v < gr.start + gr.count; v++) { b.p.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]); b.uv.push(U ? U[v * 2] : 0, U ? U[v * 2 + 1] : 0); }
      }
    };
    const box = (x0, x1, y0, y1, z0, z1, mat, topMat = 1) => {
      const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
      // box groups: 0 +x, 1 -x, 2 +y (roof), 3 -y, 4 +z, 5 -z
      take(g, [mat, mat, topMat, mat, mat, mat]);
    };
    const arcSeg = (a0, a1, R0, R1, h, mat = 0, topMat = 1) => {
      const n = Math.max(2, Math.ceil((a1 - a0) / 3)), pts = [], nrm = [];
      for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push(ringXZ(a, R1)); nrm.push(dirA(a)); }
      const wdt = R1 - R0;
      take(sweepSolid(pts, nrm, () => [[0, -2], [0, h], [-wdt, h], [-wdt, -2]], [0, 1, -1, -1], mat), [mat, topMat]);
    };
    // concourse roof outside the ring on the north half, with the pale blue-white roof on the west side
    arcSeg(-95, 30, 359, 388, 60, 0, 1);
    // curved east wing, east block, south-east block, south entrance band
    arcSeg(35, 66, 359, 392, 56, 0, 1);
    arcSeg(74, 94, 359, 396, 52, 0, 1);
    arcSeg(100, 116, 359, 415, 58, 0, 1);
    arcSeg(165, 195, 359, 380, 52, 0, 1);
    arcSeg(123, 146, 359, 384, 48, 0, 1);
    // north box (white roof, lower gray strip behind it), covered walkway at the south gate
    box(-97, 82, -2, 46, -576, -516, 0, 1);
    box(-97, 78, -2, 30, -593, -576, 2, 2);
    box(-14, 4, -2, 14, 248, 300, 0, 1);
    // blue canopies (south gates and west gate)
    box(-143, -90, 14, 18, 227, 280, 3, 3); box(82, 125, 14, 18, 222, 251, 3, 3); box(-428, -392, 12, 16, -38, 25, 3, 3);
    for (const [px, pz] of [[-134, 236], [-98, 236], [-134, 272], [-98, 272], [90, 230], [118, 230]]) box(px - 1, px + 1, -2, 14, pz - 1, pz + 1, 5, 5);
    // glass rotunda at the north: drum, glass roof, cornice
    {
      const drum = new THREE.CylinderGeometry(43, 44, 50, low ? 24 : 40, 1, false).translate(158, 23, -515);
      take(drum, [7, 1, 1]);
      const glass = new THREE.CylinderGeometry(39, 39, 0.8, low ? 24 : 40).translate(158, 50.6, -515);
      take(glass, [4, 4, 4]);
      const rim = new THREE.CylinderGeometry(41, 41, 3, low ? 24 : 40).translate(158, 49, -515);
      take(rim, [6, 6, 6]);
    }
    {
      const pos = [], uv = [], geo = new THREE.BufferGeometry(); let st = 0;
      buck.forEach((b, mi) => { if (!b.p.length) return; pos.push(...b.p); uv.push(...b.uv); geo.addGroup(st, b.p.length / 3, mi); st += b.p.length / 3; });
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.computeVertexNormals();
      ctx.add(geo, bm);
    }
    // rotunda glass grid (mullions)
    {
      const m = [];
      for (let k = -4; k <= 4; k++) { m.push(mat4(158 + k * 8.6, 51.2, -515, 0.5, 0.4, 78)); m.push(mat4(158, 51.2, -515 + k * 8.6, 78, 0.4, 0.5)); }
      inst(new THREE.BoxGeometry(1, 1, 1), lam('#f4f1e8'), m);
      // entrance drum (photograph 2): dark glazing band, plain ballpark-name sign (no logo), beige panel joints
      const band = ctx.add(new THREE.CylinderGeometry(44.4, 44.4, 7, low ? 24 : 40, 1, true), lam('#4d5b66')); band.position.set(158, 38, -515);
      const sign = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#35564f'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = 'bold 46px Rockwell, Georgia, serif'; g.fillText('TROPICANA FIELD', w / 2, h / 2 + 2);
      }, 512, 64);
      const sg = ctx.add(new THREE.PlaneGeometry(46, 5.75), new THREE.MeshBasicMaterial({ map: sign, transparent: true, side: THREE.DoubleSide }));
      const sa = Math.atan2(0.55, -0.83);                     // faces north-east, toward the plaza
      sg.position.set(158 + Math.sin(sa) * 44.9, 28, -515 + Math.cos(sa) * 44.9); sg.rotation.y = sa;
    }

    // ---------- 7. round ramp towers (instanced lathe) ----------
    {
      const H = TOWER_H;
      const prof = [[20, -2], [48, -2], [48, H], [46.5, H], [46.5, H + 3.6], [45, H + 3.6], [45, H], [23, H], [23, H + 2.8], [21.6, H + 2.8], [21.6, H], [20, H]];
      const lathe = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), low ? 24 : 40);
      inst(lathe, lam('#b7b09d'), TOWERS.map(([x, z]) => mat4(x, 0, z, 1, 1, 1)));
      inst(new THREE.CylinderGeometry(20, 20, 0.5, 20), lam('#12171b'), TOWERS.map(([x, z]) => mat4(x, H - 14, z, 1, 1, 1)));
      // spiral ramp bands on the tower faces
      const bands = [];
      for (const [x, z] of TOWERS) for (let k = 0; k < 3; k++) bands.push(mat4(x, 14 + k * 17, z, 1, 1, 1));
      inst(new THREE.TorusGeometry(48.2, 0.9, 4, low ? 24 : 40).rotateX(Math.PI / 2), lam('#d6d0be'), bands);
    }

    // ---------- 8. bowl: concourse top between the upper deck and the facade ----------
    {
      const [uPts, uN, i0] = tools.cut(0.03, 0.97);
      const dA = dims.deckAt;
      const wd = uPts.map((p, i) => Math.max(dA.dEnd(i0 + i) + 4, toRing(p, uN[i]) - 3));
      ctx.add(sweepSolid(uPts, uN, (i) => { const e = dA.dEnd(i0 + i) - 1, h = dA.hTop(i0 + i) + 2; return [[e, 0], [e, h], [wd[i], h], [wd[i], 0]]; }, [MAT.SHADE, MAT.CREAM, MAT.FACADE, -1], MAT.FACADE), M);
    }

    // ---------- 8b. suite level: dark glazing between the lower deck and the upper-deck overhang (photograph 5) ----------
    {
      const [uPts, uN, i0] = tools.cut(0.03, 0.97), dA = dims.deckAt;
      const gt = textTexture((g, w, h) => {
        g.fillStyle = '#27323d'; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(190,200,205,0.55)'; g.fillRect(0, 0, 4, h); g.fillRect(0, h * 0.62, w, 3);       // mullion and transom
        g.fillStyle = 'rgba(210,190,130,0.25)'; g.fillRect(8, 6, w - 16, h * 0.4);                         // lit interior
      }, 64, 64);
      gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.repeat.set(24 / 8, 0.25);
      const mGl = new THREE.MeshBasicMaterial({ map: gt, side: THREE.DoubleSide });
      ctx.add(sweepSolid(uPts, uN, (i) => {
        const g = i0 + i, d = dA.dL(g) - 0.5, y0 = dA.lowTop(g), y1 = dA.h0(g) - 7;
        return [[d, y0], [d, y1], [d + 0.3, y1], [d + 0.3, y0]];
      }, [0, 1, -1, -1], 1), [mGl, lam('#6f7b86')]);
    }

    // ---------- 9. scoreboards: the center-field board wall (main board, two side boards, one tall board) ----------
    // Plan position from the sheet: a dark block with a lattice back structure spans x -90..55 behind the CF wall (deg -11..+7).
    // Sizes: main board 64 x 35 ft (text); the others scaled from photographs 3, 4 and 6 against the 64 ft board.
    {
      const stl = { p: [], n: [] }, fac = { p: [], n: [], uv: [] };
      const addGeo = (g, tgt, m) => {
        g = g.index ? g.toNonIndexed() : g; g.applyMatrix4(m);
        tgt.p.push(...g.attributes.position.array); tgt.n.push(...g.attributes.normal.array); if (tgt.uv) tgt.uv.push(...g.attributes.uv.array);
      };
      const unit = new THREE.BoxGeometry(1, 1, 1), plane = new THREE.PlaneGeometry(1, 1);
      const Mx = new THREE.Matrix4(), Q = new THREE.Quaternion(), Pv = new V3(), Sv = new V3();
      const box = (cx, cy, cz, sx, sy, sz, yaw) => { Q.setFromAxisAngle(new V3(0, 1, 0), yaw); Mx.compose(Pv.set(cx, cy, cz), Q, Sv.set(sx, sy, sz)); addGeo(unit.clone(), stl, Mx); };
      const bm2 = (a, b, th) => {                              // beam between two world points
        const A = new V3(...a), B = new V3(...b), dir = B.clone().sub(A), len = dir.length();
        Q.setFromUnitVectors(new V3(0, 0, 1), dir.normalize()); Mx.compose(A.add(B).multiplyScalar(0.5), Q, Sv.set(th, th, len)); addGeo(unit.clone(), stl, Mx);
      };
      const faceTex = textTexture((g, w, h) => {
        g.fillStyle = '#1a2430'; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(120,150,170,0.20)'; g.lineWidth = 1;
        for (let x = 0; x < w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        for (let y = 0; y < h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      }, 128, 128);
      const BOT = 36;                                          // underside of every board (photograph 4: just above the seat tops)
      const OUT = 18;                                          // distance of the board face behind the wall
      // deg, width, height
      const boards = [[-6.0, 64, 35], [-14.2, 30, 19], [2.4, 30, 19], [7.4, 12, 36]];
      for (const [deg, w, h] of boards) {
        const c = tools.wallAt(deg, OUT, 0), yaw = Math.atan2(-c.x, -c.z), sn = Math.sin(yaw), cs = Math.cos(yaw);
        const W = (lx, ly, lz) => [c.x + lx * cs + lz * sn, ly, c.z - lx * sn + lz * cs];     // board-local -> world
        const cy = BOT + h / 2;
        const bx = (lx, ly, lz, sx, sy, sz) => { const q = W(lx, ly, lz); box(q[0], q[1], q[2], sx, sy, sz, yaw); };
        bx(0, cy, 0, w, h, 4);                                                                 // cabinet
        bx(0, BOT - 0.7, 0.4, w + 1.6, 1.4, 5); bx(0, BOT + h + 0.7, 0.4, w + 1.6, 1.4, 5);    // frame bars
        bx(-w / 2 - 0.7, cy, 0.4, 1.4, h + 2.8, 5); bx(w / 2 + 0.7, cy, 0.4, 1.4, h + 2.8, 5);
        const q = W(0, cy, 2.06); Q.setFromAxisAngle(new V3(0, 1, 0), yaw); Mx.compose(Pv.set(q[0], q[1], q[2]), Q, Sv.set(w, h, 1)); addGeo(plane.clone(), fac, Mx);   // blank face
        // back structure: two chords, verticals, diagonals, depth beams back to the chords (steel truss)
        const yt = BOT + h - 1.5, yb = BOT + 1.5, zb = -9;
        bm2(W(-w / 2 + 1, yt, zb), W(w / 2 - 1, yt, zb), 1.4); bm2(W(-w / 2 + 1, yb, zb), W(w / 2 - 1, yb, zb), 1.4);
        bm2(W(-w / 2 + 1, yt, -2), W(-w / 2 + 1, yt, zb), 1.2); bm2(W(w / 2 - 1, yt, -2), W(w / 2 - 1, yt, zb), 1.2);
        bm2(W(-w / 2 + 1, yb, -2), W(-w / 2 + 1, yb, zb), 1.2); bm2(W(w / 2 - 1, yb, -2), W(w / 2 - 1, yb, zb), 1.2);
        const nv = low ? Math.max(1, Math.round(w / 32)) : Math.max(2, Math.round(w / 14));
        for (let k = 0; k <= nv; k++) {
          const lx = -w / 2 + 1 + ((w - 2) * k) / nv;
          bm2(W(lx, yb, zb), W(lx, yt, zb), 1.1);
          if (k < nv && !low) { const lx2 = -w / 2 + 1 + ((w - 2) * (k + 1)) / nv; bm2(W(lx, k % 2 ? yt : yb, zb), W(lx2, k % 2 ? yb : yt, zb), 0.8); }
        }
        // support columns (two) down through the batter's eye / seat block, with a cross brace
        const cx = w * 0.4;
        bx(-cx, BOT / 2, -4, 3, BOT, 3); bx(cx, BOT / 2, -4, 3, BOT, 3);
        if (w > 20) { bm2(W(-cx, 4, -4), W(cx, BOT - 2, -4), 1.1); bm2(W(cx, 4, -4), W(-cx, BOT - 2, -4), 1.1); }
      }
      const mk = (t, mat) => {
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(t.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(t.n, 3));
        if (t.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(t.uv, 2)); return ctx.add(g, mat);
      };
      mk(stl, lam('#38414a'));
      const fm = mk(fac, new THREE.MeshBasicMaterial({ map: faceTex, side: THREE.DoubleSide })); parts.scoreboard = fm;
      // service catwalk in front of the board wall: deck and rail, one polyline behind the CF wall
      {
        const pts = [], nrm = [];
        for (let dg = -17; dg <= 11.01; dg += low ? 4 : 2) { const w = tools.wallAt(dg, 11, 0); pts.push([w.x, w.z]); const a = dg * D2R; nrm.push([Math.sin(a), -Math.cos(a)]); }
        ctx.add(sweepSolid(pts, nrm, () => [[-3.2, BOT - 2.2], [-3.2, BOT - 1], [3.2, BOT - 1], [3.2, BOT - 2.2]], [0, 1, 0, -1], 0), [lam('#4a535c'), lam('#7d858c')]);
        const fr = pts.map((p, i) => [p[0] - nrm[i][0] * 3.2, p[1] - nrm[i][1] * 3.2]);
        G.add(tools.rail(fr, () => BOT - 1, { height: 3.5, spacing: 8, color: '#9aa1a6', lod: ctx.lod }));
      }
    }

    // ---------- 10. cownose ray tank just over the right-center fence ----------
    {
      const deg = 18.5, a = deg * D2R, r = wallR(spec, deg) + 16, hw = wallH(spec, deg);
      const tank = new THREE.Group(); tank.position.set(r * Math.sin(a), 0, -r * Math.cos(a)); tank.lookAt(0, 0, 0); G.add(tank);
      const frame = ctx.add(new THREE.BoxGeometry(36, hw + 3, 16), lam('#2c4059'), tank); frame.position.y = (hw + 3) / 2;
      const water = ctx.add(new THREE.PlaneGeometry(33, 13).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#5a99b3', transparent: true, opacity: 0.85 }), tank); water.position.y = hw + 3.1;
      const back = ctx.add(new THREE.BoxGeometry(36, 18, 1.2), lam('#e0d9c3'), tank); back.position.set(0, hw + 9, -8);
    }

    // ---------- 11. views ----------
    views.gate = { pos: [190, 20, 500], look: [-20, 55, 260], label: 'South Gate' };
    views.roof = { pos: [-4, dims.hTop + 6, dims.zBack - 70], look: [HUB[0], 205, HUB[1] - 10], label: 'Catwalks' };
    views.wing = { pos: [430, 62, -690], look: [190, 40, -470], label: 'Rotunda' };
    for (const v of ['gate', 'roof', 'wing']) {
      const p = new V3(...views[v].pos), l = new V3(...views[v].look); views[v].dir = l.sub(p).normalize();
    }
  },
};
