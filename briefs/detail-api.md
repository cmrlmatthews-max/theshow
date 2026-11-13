# Brief: hand-detailed 3D ballpark module for "The Show"

You start with no context. This file is the complete instruction, together with the short task text you received.

## The project

"The Show" is a personal, single-page baseball atlas in a vintage style. `src/park.js` generates a 3D ballpark (three.js) for each MLB park from five outfield distances, three wall heights, the seat count, and the roof type. The generated seating is generic. Your job: write ONE detail module that turns the generic model of ONE real ballpark into a recognizable model of that ballpark.

Your working copy of the project is the folder named in your task. Work only there.

## What you may change

- Create and edit only `src/details/<ID>.js` in your working copy (`<ID>` is in your task). `src/details/index.js` already imports it.
- Read everything else, especially `src/park.js` (the `load(rec)` method) and `src/field.js`. Do NOT edit them. If the API lacks something, do it inside your `build()` by adding or removing meshes.

## Coordinates and units

- Units are feet. `y` is up. Home plate is the origin `(0, 0, 0)`.
- Center field is toward `-z`. Left field is toward `-x`. Right field is toward `+x`. Behind home plate is `+z`.
- `deg` is the angle from the center-field axis: `-45` = left-field line, `0` = center field, `+45` = right-field line. A wall point at distance `r` is `(r*sin(deg), 0, -r*cos(deg))`.
- `t` runs along the front edge of the foul-side seats: `0` = right-field pole, `0.5` = behind home plate, `1` = left-field pole. `d` is the offset outward (away from the field) from that edge.

## Module shape

```js
// src/details/XXX.js
export default {
  // Optional. Changes the generic build. Every key is optional.
  config(rec) {
    return {
      // Surveyed outfield wall: corner points from the LF pole (-45) to the RF pole (+45). Walls run straight between
      // corners. h = wall height. Repeat a corner with deg + 0.05 to make a height step.
      wall: [{ deg: -45, r: 335, h: 6 }, /* ... */ { deg: 45, r: 325, h: 16 }],
      foulScale: 1,          // 1 = default foul territory; smaller = seats closer to the lines
      backstop: 58,          // feet from home plate to the backstop
      lower: { depth: 110, slope: 0.3, extent: [0, 1] },                  // lower deck: depth outward, rise per foot, t range
      hasUpper: true,
      upper: { overhang: 30, rise: 24, depth: 95, slope: 0.58, extent: [0.1, 0.9] },   // extent may also be one number e (0.5-e .. 0.5+e)
      outfield: { depth: 80, slope: 0.45, spans: [[-45, -9], [9, 45, 60, 0.4]],       // [fromDeg, toDeg, depth?, slope?]
                  eye: [-9, 9], eyeHeight: 44, eyeDepth: 26 },                         // eye: null removes the batter's eye
      skip: { upperDeck: false, canopy: false, scoreboard: false, lights: false },     // true = do not build the generic part
      colors: { seat: '#2f4b7c', facade: '#9a5c44', wall: '#2c4636', cream: '#e8dcbc' },
    };
  },
  // Optional. Runs after the generic build. Add or remove meshes here.
  build(ctx) { /* ... */ },
};
```

## `ctx` in `build(ctx)`

- `ctx.THREE` three.js. `ctx.G` the scene group for this park: add your meshes to it (or use `ctx.add`).
- `ctx.add(geometry, material, parent = G)` returns the mesh. `ctx.lam(color, extra)` returns a double-sided Lambert material. `ctx.remove(meshOrArray)` removes generic parts.
- `ctx.parts`: generic meshes you can remove or move: `field, wall, lowerDeck, upperDeck, canopy, outfieldSeats[], batterEye, scoreboard, lights[], poles[], signs[], bases[]`.
- `ctx.M` material array and `ctx.MAT` indices `{WALL, SEAT, CREAM, FACADE, SHADE}` for `sweepSolid`. `ctx.C` palette.
- `ctx.paths`: `{ wallPts, wallDeg, wallN, bPts, bN, fieldPoly }` (arrays of `[x, z]`; `wallN`/`bN` are outward normals).
- `ctx.dims`: `{ f, maxR, cf, dL, sL, lowTop, d0, h0, dU, sU, dEnd, hTop, D, ofSlope, i0, i1, halfW, zBack, zFront, roofY }`. `dL` = lower deck depth, `lowTop` = its top height, `d0,h0` = front of the upper deck (offset, height), `dEnd,hTop` = back top of the upper deck, `D` = outfield seat depth.
- `ctx.tools`:
  - `foulAt(t, d, y)` -> Vector3 on the foul side. `wallAt(deg, out, y)` -> Vector3 at the outfield wall plus `out` feet outward.
  - `wallR(spec, deg)`, `wallH(spec, deg)`, `wallXZ(spec, deg)` with `ctx.spec`.
  - `sweepSolid(pts, normals, polyFn, edgeMats, capMat)`: sweeps a closed cross-section `[[d, h], ...]` along a path. `polyFn(i)` returns the cross-section at sample `i`. `edgeMats[j]` = material index for edge `j` (-1 = open). Use it with `ctx.M`. `tools.span(fromDeg, toDeg)` returns `[pts, normals, degs]` along the outfield wall; `tools.cut(t0, t1)` returns `[pts, normals]` along the foul side.
  - `textTexture((g, w, h) => {...}, w, h)` makes a canvas texture (for scoreboards and signs).
  - `mixHex(a, b, t)`, `clamp`, `D2R`, `insidePoly`.
- `ctx.views`: camera stops. Add up to three: `ctx.views.myKey = { pos: [x, y, z], look: [x, y, z], label: 'Short Label' }`. Add `orbit: true` for a far view, `walk: true` only for a point on the field.

## Rules

- Research the real ballpark first (WebSearch, WebFetch; shell commands cannot reach the web). Good sources: the Wikipedia page, the Clem's Baseball page for the park (andrewclem.com), MLB.com ballpark pages. Get the real wall corner distances and heights, the deck layout, and the signature features. Use at most 8 fetches.
- Build the features in your task list. Proportions matter more than small parts.
- NO team logos, NO team wordmarks, NO sponsor or brand names or brand shapes, NO statues or likenesses of real people. The ballpark name as plain text is allowed.
- Style: muted vintage colors. Use `ctx.C` and the team colors in `ctx.rec.colors`. No shadows, no external assets, no network at run time.
- Performance: use `THREE.InstancedMesh` for repeated items (arches, trees, windows). Keep added draw calls under about 150.
- The field must stay walkable, and all generic views must still work.
- Write clear code with short comments. List your approximations in a comment at the top of the file.

## Build and look

```
cd <your working copy>
node build.mjs
python3 quick.py <ID> "aerial=window.__show.park.setView('aerial',true)" "home=window.__show.park.setView('home',true)" "upper=window.__show.park.setView('upper',true)"
```

- `quick.py` loads the park, prints `ok` or a stack trace, then runs each `name=javascript` step and saves `shots/<name>.png`. Read the PNG files to inspect your work.
- For a custom camera: `"x=(()=>{const p=window.__show.park;p.setView('aerial',true);p.camera.position.set(-300,250,-500);p.controls.target.set(0,20,-250);p.controls.update();})()"`.
- The test browser is slow (software rendering). Each run takes 20 to 60 seconds. Run it in the foreground.
- Do at most four build-and-look rounds. Then stop.

## Final reply (fixed format, 12 lines or fewer)

```
FILE: <path of your module>
BUILT: <comma list of features>
APPROXIMATE: <comma list of things that are not to scale or simplified>
VIEWS ADDED: <keys>
PROBLEMS: <none, or what failed>
```
