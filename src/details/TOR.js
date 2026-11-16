// Detail module: Rogers Centre, Toronto Blue Jays (opened 1989 as SkyDome). Units: feet.
// MEASURED FROM THE SATELLITE SHEET (roof closed; home plate = origin, center field up, 1.1 px/ft):
//  - The building is symmetric about the center line. Roof ring (the dome rim) is a circle of radius ~337 ft centered at
//    z = -140 (north rim at z = -476 behind center field, south rim at z = +197 behind home plate).
//  - Roof panels (closed): fixed north dome (circle segment north of z = -330, chord half-width 278); panel 2 is a strip
//    z -330..-170 (half-width 347); panel 3 is a strip z -170..+25 (half-width 368); the south cap (panel 4) is the circular
//    segment south of z = +25 (straight sides end at z = +25 then step in to x = +-295). All of it rides on two rail towers
//    at x = +-(347..372) that run from z = -519 to z = +40. The panels slide NORTH (toward center field) and stack over the dome.
//  - Outer facade: south drum (table S_E2W, glass galleries along the arc from (+-326,57) to (+-70,204), glass corner
//    wedges at (+-300,80)); north concrete crescent (table N_OUT, outer edge z = -535 at x = 0, flat deck 44 ft wide).
//  - Concrete roof decks of the north crescent step in plan at x = +-94, +-153, +-203, +-253, +-298.
// FROM TEXT SOURCES: wall distances 328/368/381/400/372/359/328 (Wikipedia, MLB.com), wall heights 14 / 8 / 13 (data file),
//  roof: four panels (one fixed, two slide on parallel rails, one rotates), apex 282 ft above the field, about 700 ft across,
//  hotel with rooms over center field and a 110 x 33 ft video board with side wings, the CN Tower right next door,
//  stadium lights fixed to the roof ring (Clem), concrete exterior.
// LEVEL 4 (photographs in refs/TOR, 8 images; photo numbers below):
//  FACADE (photo 1): concrete frame of piers (every 4th one wider) and belt beams at 32/60/88 ft; street level is glass storefront
//   (7-29 ft); levels 2-4 alternate louvered vent panels and small dark windows (pseudo-random per bay); sloped louver hoods on the
//   flat side walls; plain red "ROGERS CENTRE" letters on a light sign band (south gate, east wall, west wall); warm grey concrete.
//  HEIGHTS: board 110 x 33 ft with its bottom at 56 ft (top 88): photo 7, the 8 ft outfield wall gives 4.1 px/ft at the wall and
//   3.3 px/ft at the board plane; camera height about 13 ft (+-8 ft), so the board bottom is +-8 ft. Hotel roof 104 ft, restaurant
//   glass band 28-47 ft, five rows of rooms at a 9.6 ft pitch (photo 7, same scale). Batter's eye 27 ft high and 84 ft wide (dark
//   panel about 19 ft above the 8 ft wall, photo 7). Light bars about 125-131 ft (photos 4, 7). Wall heights are from the config.
//   Shadow method: the only object of known height on the sheet is the CN Tower; its pod shadow gives a ratio of about 1.0 (sun about
//   45 deg, shadows fall west-southwest), uncertain by +-0.25. Every other shadow falls on the roof, steps or plaza slopes, so
//   no other height was taken from shadows.
//  SEATING (photos 3, 4, 5, 6): three tiers around the foul side (100 + 200 level as the lower deck, a dark suite and club glass band
//   in the recess under the 500 level, the 500 level), mirror-symmetric on the two sides. Lower slope 0.42 (1.2 ft row rise), upper
//   slope 0.9 (2 ft row rise; 24-27 rows). Depth tables below. Rear concourse from the back row to the dome ring. Outfield: the
//   generic 100-level terrace (46 ft deep), club band, 500 level (to 118 ft at most), rear concourse; both outfield sides are
//   shallower near the poles because the ring is only 87 ft behind the wall there. Ribbon boards (red on the third-base half,
//   teal on the first-base half and on the club band).
//  BOARDS: main board with frame bars, lattice truss under it, support columns, a catwalk with a rail, back columns up to the roof
//   steel; two small boards flanking it on the hotel (62 and 42 ft wide in photo 7, 48 and 36 ft here); two line-score panels in
//   the outfield wall; two plain flags hanging from the roof steel above the hotel (red-white-red and stripes with a blue corner).
// ESTIMATED: the rim 144 ft and apex 282 ft (text), mass height 110 (4 bands in photo 1 at about 22-26 ft each), rail towers
//  104/126, the arch profile of the panels (a sphere of radius 480 ft), the pier rhythm, the CN Tower position (about (565,-365)
//  from the mosaic, +-40 ft), the open positions of the panels (they stack on the north side), the deck depth tables (the roof
//  hides the bowl on the sheet; the dome ring distance behind each section is measured, the split between lower and upper tiers is
//  read from photos 3-5 and not counted row by row), row rises, the hotel footprint (216 x 46 ft), outfield tier depths.
const D2R = Math.PI / 180;
const CZ = -140, RR = 337;                              // roof circle: center z, radius
const RS = 480, YC = -198;                              // roof sphere radius and center height (apex = 282)
const Z_N = -330, Z_A = -170, Z_B = 25;                 // panel seams (z)
const XA = 347, XB = 368;                               // strip half-widths (rails)
const H_MASS = 110, H_RAIL_N = 126;                     // concrete mass and north rail tower tops

// Outer outline of the whole building, clockwise from the north apex: north crescent, east rail tower, south drum, west.
const N_E = [[0, -535], [94, -521], [153, -499], [203, -478], [253, -449], [298, -415], [316, -372]];
const S_E2W = [[340, 47], [326, 57], [276, 105], [218, 146], [143, 181], [70, 204], [0, 209],
  [-70, 204], [-143, 181], [-218, 146], [-276, 105], [-326, 57], [-340, 47]];
const N_W2E = [...N_E.slice(1).reverse().map(([x, z]) => [-x, z]), ...N_E];
const OUTLINE = [...N_E, [347, -372], [347, -519], [372, -519], [372, 40], ...S_E2W,
  [-372, 40], [-372, -519], [-347, -519], [-347, -372], ...N_E.slice(1).reverse().map(([x, z]) => [-x, z])];

const sph = (rho) => YC + Math.sqrt(Math.max(0, RS * RS - rho * rho));
const barrel = (x) => sph(Math.abs(x));
const HRIM = sph(RR);
const zRimS = (x) => CZ + Math.sqrt(Math.max(0, RR * RR - x * x));
const zRimN = (x) => CZ - Math.sqrt(Math.max(0, RR * RR - x * x));

// distance from p along unit direction n to the circle (center (0,CZ), radius R); null when it misses
const hitCircle = (p, n, R) => {
  const ox = p[0], oz = p[1] - CZ, b = ox * n[0] + oz * n[1], c = ox * ox + oz * oz - R * R, disc = b * b - c;
  return disc < 0 ? null : -b + Math.sqrt(disc);
};

export default {
  config(rec) {
    return {
      wall: [
        { deg: -45, r: 328, h: 14 }, { deg: -33, r: 350, h: 12 }, { deg: -22.5, r: 368, h: 10 }, { deg: -11, r: 381, h: 8 },
        { deg: 0, r: 400, h: 8 }, { deg: 11, r: 372, h: 8 }, { deg: 22.5, r: 359, h: 9 }, { deg: 33, r: 344, h: 12 },
        { deg: 45, r: 328, h: 13 },
      ],
      foulScale: 1,
      backstop: 58,
      // Bowl tables (t 0 = right-field pole, 0.5 = behind home, 1 = left-field pole). The bowl is mirror-symmetric (photos 3, 5):
      // lower deck = 100 + 200 levels, upper deck = 500 level. Deck backs stay 30-45 ft inside the dome ring (rear concourse).
      lower: { depth: [[0, 66], [0.05, 84], [0.1, 100], [0.15, 108], [0.25, 112], [0.35, 110], [0.4, 104], [0.45, 96], [0.5, 90],
                       [0.55, 96], [0.6, 104], [0.65, 110], [0.75, 112], [0.85, 108], [0.9, 100], [0.95, 84], [1, 66]], slope: 0.42, extent: [0, 1] },
      hasUpper: true,
      upper: {
        overhang: [[0, 12], [0.05, 20], [0.1, 26], [0.15, 28], [0.25, 30], [0.35, 30], [0.4, 28], [0.45, 26], [0.5, 26],
                   [0.55, 26], [0.6, 28], [0.65, 30], [0.75, 30], [0.85, 28], [0.9, 26], [0.95, 20], [1, 12]],
        rise: [[0, 30], [0.1, 30], [0.25, 28], [0.5, 30], [0.75, 28], [0.9, 30], [1, 30]],
        depth: [[0, 40], [0.05, 44], [0.1, 52], [0.15, 57], [0.25, 60], [0.35, 60], [0.4, 57], [0.45, 53], [0.5, 50],
                [0.55, 53], [0.6, 57], [0.65, 60], [0.75, 60], [0.85, 57], [0.9, 52], [0.95, 44], [1, 40]],
        slope: 0.9, extent: [0.03, 0.97],
      },
      outfield: { depth: 46, slope: 0.46, spans: [[-45, -6], [6, 45]], eye: [-6, 6], eyeHeight: 27, eyeDepth: 34 },
      skip: { scoreboard: true },
      colors: { seat: '#2f4b7a', facade: '#a8a291', wall: '#20395f', cream: '#d9d1bb' },
    };
  },

  build(ctx) {
    const { THREE, G, parts, tools, paths, dims, views } = ctx;
    const { sweepSolid, textTexture, wallR, wallH, clamp, normalsFor } = tools;
    const { bPts, bN, wallPts, wallDeg, wallN } = paths;
    const low = ctx.lod === 'low';
    const lam = ctx.lam;
    const spec = ctx.spec;
    const N1 = bPts.length - 1;
    if (parts.scoreboard) ctx.remove(parts.scoreboard);

    // ---- materials
    const CONC = '#aaa595', CONC_D = '#8c8779', CONC_L = '#c6c1b0', GLASS = '#4d6c82', STEEL = '#59595a', ROOFC = '#f1ebd6';
    const mConc = lam(CONC), mConcD = lam(CONC_D), mConcL = lam(CONC_L), mGlass = lam(GLASS), mSteel = lam(STEEL);

    // ---- merged-box helpers (one draw call for any number of small parts)
    const tpl = new THREE.BoxGeometry(1, 1, 1);
    const _o = new THREE.Object3D(), _z = new THREE.Vector3(0, 0, 1);
    const mxb = (cx, cy, cz, sx, sy, sz, ry = 0) => { _o.position.set(cx, cy, cz); _o.rotation.set(0, ry, 0); _o.scale.set(sx, sy, sz); _o.updateMatrix(); return _o.matrix.clone(); };
    const mseg = (a, b, t) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), len = d.length();
      _o.position.copy(A).add(B).multiplyScalar(0.5); _o.quaternion.setFromUnitVectors(_z, d.normalize()); _o.scale.set(t, t, len); _o.updateMatrix();
      return _o.matrix.clone();
    };
    const merge = (mats) => {
      const P = tpl.attributes.position, Nn = tpl.attributes.normal, UV = tpl.attributes.uv, I = tpl.index;
      const uvs = new Float32Array(mats.length * P.count * 2), pos = new Float32Array(mats.length * P.count * 3), nor = new Float32Array(mats.length * P.count * 3), ind = new Uint32Array(mats.length * I.count);
      const v = new THREE.Vector3(), nm = new THREE.Matrix3();
      let po = 0, io = 0, base = 0, uo = 0;
      for (const m of mats) {
        nm.getNormalMatrix(m);
        for (let i = 0; i < P.count; i++) {
          v.fromBufferAttribute(P, i).applyMatrix4(m); pos[po] = v.x; pos[po + 1] = v.y; pos[po + 2] = v.z;
          v.fromBufferAttribute(Nn, i).applyMatrix3(nm).normalize(); nor[po] = v.x; nor[po + 1] = v.y; nor[po + 2] = v.z; po += 3; uvs[uo++] = UV.getX(i); uvs[uo++] = UV.getY(i);
        }
        for (let j = 0; j < I.count; j++) ind[io++] = base + I.getX(j);
        base += P.count;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); g.setIndex(new THREE.BufferAttribute(ind, 1));
      return g;
    };
    const boxes = (mats, mat, parent) => (mats.length ? ctx.add(merge(mats), mat, parent) : null);

    // sample a polyline at about equal spacing: [{p, n, s}] with outward normals (away from the roof circle center)
    const along = (poly, step) => {
      const out = []; let run = 0;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i], b = poly[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step));
        let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * ((a[0] + b[0]) / 2) + nz * ((a[1] + b[1]) / 2 - CZ) < 0) { nx = -nx; nz = -nz; }
        for (let k = 0; k < n; k++) { const f = (k + 0.5) / n; out.push({ p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], n: [nx, nz], s: run + L * f }); }
        run += L;
      }
      return out;
    };
    const sweepAlong = (poly, profile, mats, capMat, mm) => {
      const nr = normalsFor(poly, [0, CZ]);
      return ctx.add(sweepSolid(poly, nr, () => profile, mats, capMat), mm);
    };

    // =========================================================================================================
    // 1. CONCRETE MASS: the whole footprint extruded, with the circular bowl cut out (solid corners and rail towers)
    // =========================================================================================================
    {
      const shape = new THREE.Shape(OUTLINE.map(([x, z]) => new THREE.Vector2(x, -z)));
      const hole = new THREE.Path();
      const ns = low ? 48 : 72;
      for (let k = 0; k < ns; k++) { const a = (k / ns) * Math.PI * 2, hx = Math.cos(a) * (RR + 3), hy = -(CZ + Math.sin(a) * (RR + 3)); if (k === 0) hole.moveTo(hx, hy); else hole.lineTo(hx, hy); }
      hole.closePath();
      shape.holes.push(hole);
      const g = new THREE.ExtrudeGeometry(shape, { depth: H_MASS, bevelEnabled: false, curveSegments: 4 });
      g.rotateX(-Math.PI / 2);
      ctx.add(g, [mConcD, mConc]);
    }

    // =========================================================================================================
    // 2. FACADE (photo 1): a concrete frame of piers and belt beams. Street level is glass storefront; the levels above
    //    are louvered vent panels and small dark windows; plain red name letters sit in the top band.
    // =========================================================================================================
    const sPoly = S_E2W, nPoly = N_W2E;
    const eSide = [[372, -519], [372, 40]], wSide = [[-372, 40], [-372, -519]];   // rail tower side walls
    const hash = (i) => { const s = Math.sin(i * 12.9898 + 4.1414) * 43758.5453; return s - Math.floor(s); };
    const louverTex = textTexture((g, w, h) => {                                    // horizontal slats, 16 per panel height
      g.fillStyle = '#3d4244'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 16; k++) { g.fillStyle = '#5c6262'; g.fillRect(0, k * (h / 16), w, h / 40); g.fillStyle = '#2a2e30'; g.fillRect(0, k * (h / 16) + h / 20, w, h / 60); }
    }, 16, 128);
    const glassTex = textTexture((g, w, h) => {                                     // storefront glass with mullions
      g.fillStyle = '#3f5c70'; g.fillRect(0, 0, w, h); g.fillStyle = '#22303a';
      g.fillRect(0, 0, 3, h); g.fillRect(w / 2 - 1, 0, 2, h); g.fillRect(0, 0, w, 3); g.fillRect(0, h * 0.34, w, 2); g.fillRect(0, h * 0.67, w, 2);
    }, 64, 64);
    const mLouv = new THREE.MeshLambertMaterial({ map: louverTex }), mGlassT = new THREE.MeshLambertMaterial({ map: glassTex });
    {
      // bay grid along a polyline: bay centres (with width) and pier positions at the bay boundaries
      const bayGrid = (poly, step) => {
        const bays = [], piers = [];
        for (let i = 0; i < poly.length - 1; i++) {
          const a = poly[i], b = poly[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step));
          let nx = b[1] - a[1], nz = -(b[0] - a[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
          if (nx * ((a[0] + b[0]) / 2) + nz * ((a[1] + b[1]) / 2 - CZ) < 0) { nx = -nx; nz = -nz; }
          const ry = Math.atan2(nx, nz);
          for (let k = 0; k < n; k++) { const f = (k + 0.5) / n; bays.push({ p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], n: [nx, nz], w: L / n, ry }); }
          for (let k = i === 0 ? 0 : 1; k <= n; k++) { const f = k / n; piers.push({ p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], n: [nx, nz], ry, big: (piers.length % 4) === 0 }); }
        }
        return { bays, piers };
      };
      const concL = [], glassI = [], louv = [], hoods = [];
      let bayNo = 0;
      for (const [poly, step] of [[sPoly, 26], [nPoly, 26], [eSide, 36], [wSide, 36]]) {
        const { bays, piers } = bayGrid(poly, low ? step * 1.5 : step);
        for (const { p, n, w, ry } of bays) {
          const at = (off, y, sx, sy, sz, arr) => arr.push(mxb(p[0] + n[0] * off, y, p[1] + n[1] * off, sx, sy, sz, ry));
          at(1.2, 3, w * 1.04, 6, 2.4, concL);                                            // plinth
          for (const y of [32, 60, 88]) at(1.0, y, w * 1.04, 5, 2, concL);                // belt beams at the floor lines
          at(2.2, H_MASS - 4, w * 1.04, 8, 4.4, concL);                                   // cornice
          at(0.5, 18, w - 5, 22, 1, glassI);                                              // level 1: storefront glass
          bayNo++;
          if (hash(bayNo) < 0.62) at(0.7, 46, w - 6, 18, 1.2, louv); else at(0.5, 47, w - 8, 9, 1, glassI);   // level 2
          if (hash(bayNo * 7 + 3) < 0.5) at(0.7, 74, w - 6, 18, 1.2, louv); else at(0.5, 75, w - 8, 9, 1, glassI);   // level 3
          if (hash(bayNo * 3 + 1) < 0.3) at(0.7, 97, w - 8, 8, 1.2, louv);               // level 4 (top band)
        }
        for (const { p, n, ry, big } of piers) {
          const wd = big ? 6 : 3.4, dp = big ? 4.4 : 2.6;
          concL.push(mxb(p[0] + n[0] * dp / 2, 54, p[1] + n[1] * dp / 2, wd, 108, dp, ry));
        }
      }
      // sloped louver hoods on the two flat side walls, either side of the name letters (photo 1)
      for (const sx of [-1, 1]) for (const z of [-30, 8]) hoods.push(mxb(sx * (372 + 4.5), 72, z, 9, 20, 34));
      boxes(concL, mConcL); boxes(glassI, mGlassT); boxes(louv, mLouv); boxes(hoods, mLouv);
    }
    {
      // blue glass galleries leaning against the south arc (seen on the sheet from (+-326,57) to (+-70,204))
      const east = sPoly.slice(1, 6), west = sPoly.slice(7, 12);
      for (const poly of [east, west]) sweepAlong(poly, [[0, 0], [15, 0], [15, 6], [3, 56], [0, 56]], [-1, 2, 2, 0, -1], 0, [mConcL, mConcL, mGlass]);
      // gate pavilions on the south arc
      const gates = along(sPoly, 40);
      const pick = [0.5, 0.31, 0.69, 0.13, 0.87].map((f) => gates[Math.round(f * (gates.length - 1))]);
      const body = [], glass = [], cap = [];
      pick.forEach(({ p, n }, k) => {
        const ry = Math.atan2(n[0], n[1]), w = k === 0 ? 70 : 52, d = k === 0 ? 20 : 16, h = k === 0 ? 74 : 62;
        body.push(mxb(p[0] + n[0] * d / 2, h / 2, p[1] + n[1] * d / 2, w, h, d, ry));
        glass.push(mxb(p[0] + n[0] * (d + 0.6), h * 0.42, p[1] + n[1] * (d + 0.6), w * 0.72, h * 0.62, 1.2, ry));
        cap.push(mxb(p[0] + n[0] * (d / 2 + 4), h + 1.5, p[1] + n[1] * (d / 2 + 4), w + 6, 3, d + 8, ry));
      });
      boxes(body, mConc); boxes(glass, mGlassT); boxes(cap, mConcL);
      // plain red name letters on a light concrete sign band (the real letters sit in the top band, photo 1)
      const nameTex = textTexture((g, w, h) => {
        g.clearRect(0, 0, w, h); g.fillStyle = '#8c3a32'; g.font = 'bold 74px Helvetica, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        if ('letterSpacing' in g) g.letterSpacing = '5px';
        g.fillText('ROGERS CENTRE', w / 2, h / 2 + 3);
      }, 1024, 96);
      const mName = new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, side: THREE.DoubleSide });
      const sign = (x, z, nx, nz, len, y) => {
        const ry = Math.atan2(nx, nz), band = ctx.add(new THREE.BoxGeometry(len + 6, 11, 4.3), mConcL);
        band.position.set(x + nx * 2.15, y, z + nz * 2.15); band.rotation.y = ry;
        const pl = ctx.add(new THREE.PlaneGeometry(len, len * 96 / 1024), mName);
        pl.position.set(x + nx * 4.5, y, z + nz * 4.5); pl.rotation.y = ry;
      };
      const m0 = pick[0];
      sign(m0.p[0], m0.p[1], m0.n[0], m0.n[1], 84, 96);
      sign(372, -95, 1, 0, 84, 96); sign(-372, -95, -1, 0, 84, 96);
    }

    {
      // the north crescent deck steps in plan: low cross walls at the table stations, from the outer edge inward
      const steps = [];
      for (const [x, z] of N_E.slice(1, 6).flatMap((q) => [q, [-q[0], q[1]]])) {
        const a = Math.atan2(x, -(z - CZ)), ry = Math.atan2(Math.cos(a), Math.sin(a)) ;
        steps.push(mxb(x - Math.sin(a) * 22, H_MASS + 3, z + Math.cos(a) * 22, 1.6, 6, 44, -a));
      }
      boxes(steps, mConcL);
    }

    // rail towers: north part is taller (the strips ride on top), dark rails on both
    {
      const items = [], rails = [];
      for (const sx of [-1, 1]) {
        items.push(mxb(sx * 359.5, (H_MASS + H_RAIL_N) / 2, (-519 + -170) / 2, 25, H_RAIL_N - H_MASS, 349));
        rails.push(mxb(sx * 354, H_RAIL_N + 0.8, (-519 + -170) / 2, 2.4, 1.6, 349), mxb(sx * 365, H_RAIL_N + 0.8, (-519 + -170) / 2, 2.4, 1.6, 349));
        rails.push(mxb(sx * 354, H_MASS + 0.8, (-170 + 40) / 2, 2.4, 1.6, 210), mxb(sx * 365, H_MASS + 0.8, (-170 + 40) / 2, 2.4, 1.6, 210));
        for (let z = -500; z <= 30; z += low ? 70 : 35)                                              // cross ties and brackets
          items.push(mxb(sx * 359.5, (z < -170 ? H_RAIL_N : H_MASS) - 3, z, 25, 3, 5));
      }
      boxes(items, mConcD); boxes(rails, mSteel);
    }

    // fascia ring at the dome rim: dark steel gutter band from the facade top up to the rim (north arc and south arc)
    {
      const arc = (a0, a1, n) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return [Math.sin(a) * (RR + 4), CZ - Math.cos(a) * (RR + 4)]; });
      const aN = Math.asin(278 / (RR + 4)), aS = Math.asin(295 / (RR + 4));
      const north = arc(-aN, aN, low ? 24 : 40);
      const south = arc(Math.PI - aS, Math.PI + aS, low ? 24 : 40);
      for (const poly of [north, south]) sweepAlong(poly, [[0, H_MASS], [0, HRIM + 3], [7, HRIM + 3], [7, H_MASS]], [-1, 3, 3, -1], 3, [mConc, mConc, mConc, lam('#85816f')]);
    }

    // =========================================================================================================
    // 3. ROOF: four panels (north dome fixed; strips and south cap slide north), underside ribs, bogies
    // =========================================================================================================
    const seamTex = textTexture((g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(120,128,134,0.55)'; g.fillRect(0, 0, 2, h); g.fillRect(0, 0, w, 1); }, 32, 32);
    seamTex.wrapS = seamTex.wrapT = THREE.RepeatWrapping;
    const roofMat = () => new THREE.MeshLambertMaterial({ map: seamTex, color: ROOFC, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });

    // height-field panel: columns follow x, rows follow z between zr(x)[0] and zr(x)[1]; origin shifted to zc
    const panelGeo = (x0, x1, nx, nz, zr, h, zc, skirts) => {
      const pos = [], uv = [], idx = [], col = nz + 1;
      for (let i = 0; i <= nx; i++) {
        const x = x0 + ((x1 - x0) * i) / nx, [za, zb] = zr(x);
        for (let j = 0; j <= nz; j++) { const z = za + ((zb - za) * j) / nz; pos.push(x, h(x, z), z - zc); uv.push(x / 24, z / 60); }
      }
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const a = i * col + j, b = a + 1, c = a + col, d = c + 1; idx.push(a, c, b, b, c, d); }
      const skirt = (ids, drop) => {
        const base = pos.length / 3;
        ids.forEach((k) => { pos.push(pos[k * 3], pos[k * 3 + 1] - drop, pos[k * 3 + 2]); uv.push(uv[k * 2], uv[k * 2 + 1]); });
        for (let t = 0; t < ids.length - 1; t++) idx.push(ids[t], base + t, ids[t + 1], ids[t + 1], base + t, base + t + 1);
      };
      const colIds = (i) => Array.from({ length: col }, (_, j) => i * col + j), rowIds = (j) => Array.from({ length: nx + 1 }, (_, i) => i * col + j);
      if (skirts.includes('L')) skirt(colIds(0), 14);
      if (skirts.includes('R')) skirt(colIds(nx), 14);
      if (skirts.includes('S')) skirt(rowIds(0), 16);
      if (skirts.includes('E')) skirt(rowIds(nz), 16);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    };
    const nxP = low ? 20 : 30;
    const hCap = (x, z) => { const s = clamp((z - Z_B) / Math.max(1, zRimS(x) - Z_B), 0, 1); return HRIM + (barrel(x) - HRIM) * (1 - s * s); };
    // arch ribs under a panel: arcs across x at several z (strips), or meridians (domes)
    const archRibs = (zc, z0, z1, X, count, mat, parent) => {
      const m = [];
      for (let k = 0; k < count; k++) {
        const z = z0 + ((z1 - z0) * (k + 0.5)) / count - zc;
        let prev = null;
        for (let q = 0; q <= (low ? 8 : 12); q++) {
          const x = -X + (2 * X * q) / (low ? 8 : 12), pt = [x, barrel(x) - 6, z];
          if (prev) m.push(mseg(prev, pt, 1.6)); prev = pt;
        }
      }
      boxes(m, mat, parent);
    };
    const bogies = (parent, zA, zB, X, zc) => {
      const m = [];
      for (const sx of [-1, 1]) for (const z of [zA + 8, zB - 8]) m.push(mxb(sx * (X - 3), barrel(X) - 9, z - zc, 7, 7, 12));
      boxes(m, mSteel, parent);
    };
    const mRib = lam('#6d6859');

    // panel 1: fixed north dome
    {
      const mesh = ctx.add(panelGeo(-278, 278, nxP, low ? 8 : 12, (x) => [Z_N, zRimN(x)], (x, z) => sph(Math.hypot(x, z - CZ)), 0, ''), roofMat());
      const m = [], K = low ? 5 : 9;
      for (let k = 0; k < K; k++) {
        const phi = (-72 + (144 * (k + 0.5)) / K) * D2R; let prev = null;
        for (let r = 60; r <= RR - 4; r += (RR - 64) / (low ? 5 : 8)) {
          const x = Math.sin(phi) * r, z = CZ - Math.cos(phi) * r;
          if (z > Z_N - 3) { prev = null; continue; }
          const pt = [x, sph(r) - 6, z]; if (prev) m.push(mseg(prev, pt, 1.6)); prev = pt;
        }
      }
      boxes(m, mRib, mesh);
    }
    // panels 2, 3, 4: sliding. closed origin z = zc; open positions stack toward the north (negative z)
    const panels = [
      { zc: -250, geo: () => panelGeo(-XA, XA, nxP, 4, () => [Z_N, Z_A], (x) => barrel(x), -250, 'LRS'), open: [-140, 0], ribs: (p) => { archRibs(-250, Z_N, Z_A, XA, 3, mRib, p); bogies(p, Z_N, Z_A, XA, -250); } },
      { zc: -72, geo: () => panelGeo(-XB, XB, nxP, 6, () => [Z_A, Z_B], (x) => barrel(x), -72, 'LRE'), open: [-305, 36], ribs: (p) => { archRibs(-72, Z_A, Z_B, XB, 4, mRib, p); bogies(p, Z_A, Z_B, XB, -72); } },
      { zc: 110, geo: () => panelGeo(-294, 294, nxP, low ? 8 : 12, (x) => [Z_B, Math.max(Z_B + 1, zRimS(x))], hCap, 110, ''), open: [-497, 72], ribs: (p) => {
        const m = [], K = low ? 5 : 9;
        for (let k = 0; k < K; k++) {
          const phi = (-72 + (144 * (k + 0.5)) / K) * D2R; let prev = null;
          for (let r = 60; r <= RR - 4; r += (RR - 64) / (low ? 5 : 8)) {
            const x = Math.sin(phi) * r, z = CZ + Math.cos(phi) * r;
            if (z < Z_B + 3) { prev = null; continue; }
            const pt = [x, hCap(x, z) - 6, z - 110]; if (prev) m.push(mseg(prev, pt, 1.6)); prev = pt;
          }
        }
        boxes(m, mRib, p);
      } },
    ];
    const pv = typeof window !== 'undefined' && window.__show && window.__show.park;
    const R = pv && pv.roof && pv.roof.length ? pv.roof : null;
    panels.forEach((P, i) => {
      let mesh;
      if (R && R[i]) {
        const e = R[i]; mesh = e.panel;
        mesh.geometry.dispose(); mesh.geometry = P.geo(); mesh.material.dispose(); mesh.material = roofMat();
        e.closedZ = P.zc; e.closedY = 0; e.openZ = P.zc + P.open[0]; e.openY = P.open[1];
      } else { mesh = ctx.add(P.geo(), roofMat()); mesh.position.set(0, 0, P.zc); }
      P.ribs(mesh);
    });
    if (R) {
      while (R.length > panels.length) { const e = R.pop(); if (e.panel.parent) e.panel.parent.remove(e.panel); e.panel.geometry.dispose(); }
      pv._placeRoof();
    }

    // =========================================================================================================
    // 4. BOWL: the generic decks come from config tables. Added here: the suite/club glass band under the upper deck,
    //    the rear concourse from the back of the 500 level to the dome ring, ribbon boards, and the two-tier
    //    outfield (100 level from the generic outfield, club band, 500 level, rear concourse).
    // =========================================================================================================
    const mBand = (() => {
      const tex = textTexture((g, w, h) => { g.fillStyle = '#33424d'; g.fillRect(0, 0, w, h); g.fillStyle = '#1c252c'; for (let k = 0; k < 4; k++) g.fillRect(k * 16, 0, 2, h); g.fillStyle = '#6f8895'; g.fillRect(0, 0, w, 3); }, 64, 32);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      return new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide });
    })();
    const mRed = new THREE.MeshBasicMaterial({ color: '#9a463d', side: THREE.DoubleSide });
    const mTeal = new THREE.MeshBasicMaterial({ color: '#3f8588', side: THREE.DoubleSide });
    const SU = 0.9;                                                    // 500-level slope (matches config upper.slope)
    const lerpAt = (arr, fi) => { const i = clamp(Math.floor(fi), 0, arr.length - 2), u = clamp(fi - i, 0, 1); return arr[i] * (1 - u) + arr[i + 1] * u; };
    const strip = (pp, nn, off, y0, y1, mat) => ctx.add(sweepSolid(pp, nn, (k) => [[off[k], y0[k]], [off[k], y1[k]], [off[k] - 0.4, y1[k]], [off[k] - 0.4, y0[k]]], [0, -1, -1, -1], 0), [mat]);
    {
      const { i0, i1, deckAt: dk } = dims;
      const stepN = low ? 3 : 2;
      const ip = [], pp = [], nn = [];
      for (let i = i0; i <= i1; i += stepN) { ip.push(i); pp.push(bPts[i]); nn.push(bN[i]); }
      if ((i1 - i0) % stepN) { ip.push(i1); pp.push(bPts[i1]); nn.push(bN[i1]); }
      const ext = ip.map((g, k) => { const h = hitCircle(pp[k], nn[k], RR + 3); return Math.max(dk.dEnd(g) + 0.5, h == null ? 0 : h); });
      // rear concourse behind the last row of the 500 level, out to the dome ring
      ctx.add(sweepSolid(pp, nn, (k) => [[dk.dEnd(ip[k]), dk.hTop(ip[k])], [ext[k], dk.hTop(ip[k]) + 0.8], [ext[k], 0], [dk.dEnd(ip[k]), 0]], [3, -1, -1, -1], 3), ctx.M);
      // suite and club band: dark glass wall standing on the back of the lower deck, under the overhang of the 500 level
      ctx.add(sweepSolid(pp, nn, (k) => { const g = ip[k]; return [[dk.dL(g) + 0.1, dk.lowTop(g)], [dk.dL(g) + 0.1, dk.h0(g) - 7], [dk.dL(g) + 0.6, dk.h0(g) - 7], [dk.dL(g) + 0.6, dk.lowTop(g)]]; }, [0, -1, -1, -1], 0), [mBand]);
      // ribbon boards on the fascia of the 500 level (red on the third-base half, teal on the first-base half) and the club band
      const sel = (a, b) => { const r = ip.map((g, k) => k).filter((k) => g01(ip[k]) >= a && g01(ip[k]) <= b); return r; };
      const g01 = (g) => g / N1;
      for (const [a, b, mat] of [[0.56, 0.9, mRed], [0.1, 0.44, mTeal]]) {
        const ks = sel(a, b); if (ks.length < 2) continue;
        strip(ks.map((k) => pp[k]), ks.map((k) => nn[k]), ks.map((k) => dk.d0(ip[k]) - 0.2), ks.map((k) => dk.h0(ip[k]) - 6), ks.map((k) => dk.h0(ip[k]) - 2), mat);
      }
      {
        const ks = sel(0.12, 0.88);
        strip(ks.map((k) => pp[k]), ks.map((k) => nn[k]), ks.map((k) => dk.dL(ip[k]) - 0.1), ks.map((k) => dk.lowTop(ip[k]) + 3), ks.map((k) => dk.lowTop(ip[k]) + 6.5), mTeal);
      }
    }
    // outfield: 100 level (generic, config), then club band, 500 level and rear concourse built here
    {
      const { D, ofSlope } = dims, stepN = low ? 3 : 2;
      for (const [a, b] of [[-45, -6], [6, 45]]) {
        const [p, n, dg] = tools.span(a, b);
        const keep = p.map((_, k) => k).filter((k) => k % stepN === 0 || k === p.length - 1);
        const pp2 = keep.map((k) => p[k]), nn2 = keep.map((k) => n[k]), dd = keep.map((k) => dg[k]);
        const xA = 4 + D, bf = xA + 6;
        const yA = dd.map((d) => wallH(spec, d) + 3 + ofSlope * D), yB0 = yA.map((y) => y + 22);
        const rd = pp2.map((q, k) => { const h = hitCircle(q, nn2[k], RR + 3); return h == null ? bf + 8 : h; });
        const dB = rd.map((r, k) => clamp(Math.min(r - 8 - bf, (118 - yB0[k]) / SU), 0.5, 80));
        const yT = dB.map((d, k) => yB0[k] + SU * d), ex = rd.map((r, k) => Math.max(r, bf + dB[k] + 0.5));
        const mats = [...ctx.M, mBand];
        const deck = ctx.add(sweepSolid(pp2, nn2, (k) => [[xA, yA[k]], [xA, yB0[k] - 7], [bf, yB0[k] - 7], [bf, yB0[k]], [bf + dB[k], yT[k]], [ex[k], yT[k] + 0.8], [ex[k], 0], [xA, 0]],
          [5, 4, 2, 1, 3, -1, -1, -1], 3), mats);
        deck.add(tools.aisles(pp2, nn2, { d0: bf, h0: (fi) => lerpAt(yB0, fi), d1: (fi) => bf + lerpAt(dB, fi), h1: (fi) => lerpAt(yT, fi) }, { every: 26, lod: ctx.lod }));
        deck.add(tools.rail(pp2.map((q, k) => [q[0] + nn2[k][0] * (bf + 0.4), q[1] + nn2[k][1] * (bf + 0.4)]), (k) => yB0[k], { height: 3.5, glass: true, color: '#7d7a6c', lod: ctx.lod }));
        strip(pp2, nn2, pp2.map(() => bf - 0.2), yB0.map((y) => y - 6), yB0.map((y) => y - 2), mTeal);
      }
    }

    // =========================================================================================================
    // 5. HOTEL OVER CENTER FIELD and the video board (photos 3, 4, 7). Faces stay blank.
    // =========================================================================================================
    {
      const z0 = -436, ZB = -482, HH = 104, BY = 72;            // hotel front face, back face, roof height; board centre height
      const frame = lam('#2a2c30'), conc = [], cornice = [], steel = [], glass = [], grate = [];
      boxes([mxb(0, HH / 2, (z0 + ZB) / 2, 216, HH, z0 - ZB)], mConc);                            // hotel mass
      cornice.push(mxb(0, HH + 1.5, (z0 + ZB) / 2, 220, 3, z0 - ZB + 4));
      // five rows of rooms (photo 7); the main board covers the middle of the lower rows
      for (let c = 0; c < 18; c++) for (let r = 0; r < 5; r++) {
        const x = -102 + c * 12, y = 56 + r * 9.6;
        if (Math.abs(x) < 60 && y < 92) continue;
        glass.push(mxb(x, y, z0 + 0.7, 7, 5.6, 1.2));
      }
      // restaurant glass band under the rooms, with a sloped awning (photo 7)
      boxes([mxb(0, 37.5, z0 + 5, 218, 19, 10)], mGlassT);
      const awn = ctx.add(new THREE.BoxGeometry(222, 0.8, 16), mConcL); awn.position.set(0, 48.4, z0 + 7); awn.rotation.x = 0.16;
      for (let c = 0; c < 17; c++) steel.push(mxb(-108 + c * 13.5, 37.5, z0 + 10.3, 0.9, 19, 0.9));       // mullions
      // main board: 110 x 33 ft, bottom 56 ft (photo 7 scale from the 8 ft wall), frame, face grid, back truss, catwalk
      const bz = z0 + 4;
      const body = ctx.add(new THREE.BoxGeometry(110, 33, 6), frame); body.position.set(0, BY, bz);
      const faceTex = textTexture((g, w, h) => { g.fillStyle = '#10161d'; g.fillRect(0, 0, w, h); g.fillStyle = '#1b2530'; for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 1, h); for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 1); }, 512, 128);
      const face = ctx.add(new THREE.PlaneGeometry(104, 27), new THREE.MeshBasicMaterial({ map: faceTex })); face.position.set(0, BY, bz + 3.1);
      for (const sx of [-1, 1]) steel.push(mxb(sx * 54.2, BY, bz + 3.3, 2.2, 33, 1.2));                  // frame bars
      steel.push(mxb(0, BY + 15.4, bz + 3.3, 110, 2.2, 1.2), mxb(0, BY - 15.4, bz + 3.3, 110, 2.2, 1.2));
      for (const sx of [-1, 1]) steel.push(mxb(sx * 58, 51.5, bz, 2.6, 10, 2.6));                        // support columns to the awning level
      let prev = null;                                                                                  // lattice truss under the board
      for (let k = 0; k <= 22; k++) {
        const x = -55 + k * 5, q = [x, k % 2 ? 51.6 : 56, bz - 1];
        if (prev) steel.push(mseg(prev, q, 0.9)); prev = q;
      }
      steel.push(mxb(0, 51.4, bz - 1, 110, 0.9, 0.9), mxb(0, 56.2, bz - 1, 110, 0.9, 0.9));
      grate.push(mxb(0, 53.6, bz + 5.5, 112, 0.6, 4.5));                                                 // catwalk
      for (const sx of [-1, 1]) steel.push(mxb(sx * 58, 63, bz - 3.8, 2.4, 64, 2.4));                    // back columns up to the roof steel
      // two secondary boards on the hotel front, level with the board (photo 7)
      const small = (cx, wd, ht, y) => {
        const b = ctx.add(new THREE.BoxGeometry(wd, ht, 1.6), frame); b.position.set(cx, y, z0 + 1.6);
        const f = ctx.add(new THREE.PlaneGeometry(wd - 2, ht - 1.6), new THREE.MeshBasicMaterial({ color: '#141b22' })); f.position.set(cx, y, z0 + 2.5);
      };
      small(-83, 48, 7, 77); small(84, 36, 5, 76);
      // two flags hanging from the roof steel above the hotel (plain bands and stripes, no marks)
      const flagTex = (kind) => textTexture((g, w, h) => {
        if (kind === 0) { g.fillStyle = '#a63a36'; g.fillRect(0, 0, w, h); g.fillStyle = '#eee6d2'; g.fillRect(w / 4, 0, w / 2, h); }
        else { for (let k = 0; k < 13; k++) { g.fillStyle = k % 2 ? '#eee6d2' : '#a63a36'; g.fillRect(0, k * h / 13, w, h / 13 + 1); } g.fillStyle = '#2b3d63'; g.fillRect(0, 0, w * 0.42, h * 7 / 13); }
      }, 128, 64);
      [[-26, 0], [33, 1]].forEach(([x, kind]) => {
        const f = ctx.add(new THREE.PlaneGeometry(24, 12), new THREE.MeshBasicMaterial({ map: flagTex(kind), side: THREE.DoubleSide })); f.position.set(x, 118, z0 - 30);
        steel.push(mxb(x, 131, z0 - 30, 0.5, 14, 0.5));
      });
      boxes(cornice, mConcL); boxes(glass, mGlassT); boxes(steel, mSteel); boxes(grate, lam('#6a6d6e'));
      // catwalk rail
      G.add(tools.rail([[-56, bz + 7.8], [56, bz + 7.8]], () => 53.9, { height: 3.5, color: '#4b4d4f', lod: ctx.lod }));
      // two small line-score boards set into the outfield wall, left and right of center
      for (const deg of [-19, 19]) {
        const q = tools.wallAt(deg, -0.2, wallH(spec, deg) / 2 + 0.6);
        const pnl = ctx.add(new THREE.PlaneGeometry(36, Math.max(3, wallH(spec, deg) - 2.5)), new THREE.MeshBasicMaterial({ color: '#12181e', side: THREE.DoubleSide }));
        pnl.position.copy(q); pnl.lookAt(0, q.y, 0);
      }
    }

    // =========================================================================================================
    // 6. STADIUM LIGHTS: bars hung from the roof ring (photos 4, 7), tilted lamp faces toward the field
    // =========================================================================================================
    {
      const bar = [], lamp = [];
      const nB = low ? 12 : 22;
      for (let k = 0; k < nB; k++) {
        const a = ((k + 0.5) / nB) * Math.PI * 2, x = Math.sin(a) * (RR - 9), z = CZ - Math.cos(a) * (RR - 9);
        if (z < -400 && Math.abs(x) < 125) continue;                              // behind the hotel
        const ry = Math.atan2(-x, -(z - CZ)), tx = Math.cos(ry), tz = -Math.sin(ry), nx = Math.sin(ry), nz = Math.cos(ry);
        for (const y of [131, 125]) {
          bar.push(mxb(x, y, z, 40, 3.2, 3, ry));
          if (!low) for (let c = 0; c < 8; c++) { const o = -17.5 + c * 5; lamp.push(mxb(x + tx * o + nx * 2.2, y, z + tz * o + nz * 2.2, 3.2, 2.8, 0.8, ry)); }
        }
        for (const o of [-16, 16]) bar.push(mxb(x + tx * o, 137.5, z + tz * o, 1.2, 14, 1.2, ry));
        if (low) lamp.push(mxb(x + nx * 2, 128, z + nz * 2, 38, 8, 0.8, ry));
      }
      boxes(bar, mSteel); boxes(lamp, new THREE.MeshBasicMaterial({ color: '#f3ead0' }));
    }

    // =========================================================================================================
    // 7. CN TOWER next door (simple lathe, position estimated from the satellite mosaic)
    // =========================================================================================================
    {
      const prof = [[34, 0], [30, 40], [20, 300], [14, 700], [10.5, 1000], [10, 1040], [30, 1062], [34, 1090], [34, 1110], [20, 1124], [9, 1128], [8, 1250], [14, 1440], [15, 1470], [8, 1490], [5, 1500], [3, 1815], [0.5, 1815]];
      const g = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), low ? 10 : 14);
      const tw = ctx.add(g, lam('#cfc9b6')); tw.position.set(565, 0, -365);
      const base = ctx.add(new THREE.CylinderGeometry(70, 80, 24, 6), lam('#bfb8a4')); base.position.set(565, 12, -365);
    }

    // =========================================================================================================
    // 8. VIEWS
    // =========================================================================================================
    views.gate = { pos: [60, 18, 330], look: [0, 62, 200], label: 'South Gate' };
    views.roof = { pos: [-640, 360, 360], look: [0, 120, -150], orbit: true, label: 'Roof and Tower' };
    {
      const p = tools.foulAt(0.5, dims.d0 + dims.dU * 0.75, dims.hTop - 4 + 4);
      views.dome = { pos: [p.x, p.y, p.z], look: [0, 200, -380], label: 'Under the Dome' };
      const q = tools.foulAt(0.3, ctx.dims.deckAt.dL(Math.round(0.3 * N1)) * 0.5, 36);
      views.east = { pos: [520, 14, 150], look: [372, 62, -60], label: 'East Wall' };
      views.board = { pos: [q.x, q.y, q.z], look: [0, 66, -436], label: 'Video Board' };
    }
  },
};
