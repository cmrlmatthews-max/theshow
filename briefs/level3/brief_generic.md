# Brief: generic level 3 detail for all 30 ballparks, and a phone budget

You start with no context. This file is the complete instruction. Your working copy is `/home/claude/w3/GEN`.

## The project

"The Show" is a personal, single-page baseball atlas in a vintage style. `src/park.js` generates a 3D ballpark (three.js) for each MLB park. Detail modules in `src/details/` change the generic build for some parks (read `briefs/detail-api.md` for the module API and `ctx`). At the same time as you, 27 other workers write detail modules for the other parks against the current API. Your changes go into `park.js` (and `field.js` if needed) and apply to every park.

## Goals

### 1. Phone level of detail

- In `ParkView`, set `this.lod = 'low'` when `matchMedia('(pointer: coarse)').matches` or `Math.min(innerWidth, innerHeight) < 700`; otherwise `'high'`. Allow an override for tests: `window.__lod` (`'low'` or `'high'`) wins when set.
- Pass `lod: this.lod` in the `ctx` object of `detail.build`, and as a second argument to `detail.config(rec, { lod })`.
- On `'low'`: renderer pixel ratio at most 1.5; field texture at most half its desktop size; skip or thin the small parts that you add below.
- Budget for a generic park (no detail module), measured with the stats tool: desktop at most 260 draw calls and 60,000 triangles; phone at most 170 draw calls and 25,000 triangles. Today a generic park is about 143 calls and 6,600 triangles.

### 2. Seats (area B)

- **Seat rows.** Give the seat material a canvas texture of seat rows: a dark riser band and a lighter tread band in each row, with a faint seat-back pattern (white and grey only, so the material color tints it). `sweepSolid` sets `v = width / 3` across each face, so one texture repeat across = 3 ft = one row. Check that rows look right on the lower deck, upper deck, and outfield seats from the `home`, `upper`, and `aerial` views. Set `anisotropy` from the renderer, and mipmaps. Detail modules that use `ctx.M[ctx.MAT.SEAT]` get the rows for free.
- **Aisles.** Light concrete aisle strips that run up the lower and upper decks every 22 to 28 ft along the foul side, and in the outfield seats. Instanced. Each aisle has a center handrail (thin instanced posts plus one rail).
- **Railings.** A rail (posts + top rail) along the front edge of each deck and each outfield seat section; a glass rail (transparent pale blue, low opacity) on the front of the upper deck and the suite level behind home plate.
- Make each set a child of the deck mesh it sits on (`lowerDeck`, `upperDeck`, each `outfieldSeats[i]`), so that `ctx.remove(ctx.parts.lowerDeck)` also removes its aisles and rails. Record them in `parts` too (`parts.aisles`, `parts.rails`) for modules that want to remove only those.
- Export helpers in `ctx.tools` for modules with custom decks:
  - `tools.rail(pts, yAt, opts)`: posts and a top rail along a polyline of `[x, z]`; `yAt(i)` gives the base height at point `i`; `opts = { height: 3.5, spacing: 6, color, glass: false }`. Returns one Group.
  - `tools.aisles(pathPts, pathN, profile, opts)`: aisle strips (and handrails) on a sloped deck along a path with outward normals; `profile = { d0, h0, d1, h1 }` (offset and height at the front and back of the deck); `opts = { every: 24, from: 0, to: 1, width: 4, handrail: true }`. Returns one Group.
  - Both must honor `lod` (fewer posts, no handrails on `'low'`).

### 3. Field (area C)

In the field canvas texture and in geometry:

- Mowing pattern: stripes or a checkerboard in the outfield and infield grass, at a vintage, muted contrast.
- The infield dirt, base paths, the home-plate circle, the mound circle, batter's boxes, the catcher's box, foul lines, coaches' boxes (chalk outlines), two on-deck circles, the warning track edge. Positions to scale (90 ft bases, mound 60.5 ft, home-plate circle radius 13 ft, on-deck circles 37 ft from home toward each dugout, about 5 ft in diameter).
- Geometry: a raised mound (10 in high, 18 ft across, a gentle cone with a flat top), a pitching rubber, a home plate with a five-sided shape, bases as low boxes (keep the existing ones if they are right).
- A rolled tarp: a long cylinder in a tube, on the first-base side along the wall, about 170 ft long and 3 ft in diameter, in a muted blue-grey.
- Dugouts if the generic build has none: a recessed bench box with a roof on each side (first base and third base), about 120 ft long. Make it a child of the lower deck mesh for the same reason as above. Check `ATL`, `NYY`, and `SF` modules: they build their own dugouts; they remove `lowerDeck`, so your dugouts go away with it. If one of them does not remove the lower deck, skip your dugouts when `cfg.skip.dugouts` is true and tell me in PROBLEMS.
- The field must stay walkable (`walk` views on the field).

### 4. Generic structure (area A, generic parks only)

- Light towers: replace the plain box pole with a tapered lattice mast (instanced diagonal members) and a lamp bank that is a grid of lamps (instanced) with a catwalk. `'low'`: a plain tapered mast and a flat bank with a lamp texture.
- Canopy: on the underside of the generic canopy, ribs or trusses at a regular spacing (instanced), plus support columns from the upper deck where the canopy is deep.
- Retractable roofs: ribs on the roof panels (children of each panel so that `toggleRoof` still moves them).
- Keep the parts in `parts.lights` and `parts.canopy` so that modules can still remove them.

## Do not break

- The module API in `briefs/detail-api.md`. Add things; do not rename or remove `ctx` fields, `parts` keys, or `dims`.
- `ATL`, `NYY`, and `SF` must still load and look right (run them).
- All views of all 30 parks: run `test_all.py` before you finish.

## Tools and tests

- `node build.mjs`, then run every browser test through the slot wrapper, because 30 workers share 2 CPUs:
  - `python3 /home/claude/lvl3/qlock.py timeout 170 python3 quick.py BOS,KC "home=window.__show.park.setView('home',true)" "upper=window.__show.park.setView('upper',true)" "aerial=window.__show.park.setView('aerial',true)"`
  - `python3 /home/claude/lvl3/qlock.py python3 /home/claude/lvl3/stats.py KC` (desktop and phone: calls, triangles). For the phone path, the stats tool uses touch emulation, so `pointer: coarse` applies.
  - `python3 /home/claude/lvl3/qlock.py timeout 300 python3 test_all.py` at the end.
- Test parks with each roof type: open (KC, BOS), retractable (SEA, MIL), fixed (TBR).
- At most six build-and-look rounds.

## Rules

- Edit only `src/park.js`, `src/field.js`, and `briefs/detail-api.md` (document the new `ctx.lod`, `config(rec, { lod })`, `parts.aisles`, `parts.rails`, `tools.rail`, `tools.aisles`, and `cfg.skip.dugouts`).
- Muted vintage colors. No logos, no sponsor names. No external assets.

## Final reply (fixed format, 12 lines or fewer)

```
FILES: <changed files>
LOD: <how low/high is chosen, what changes on low>
SEATS: <rows, aisles, rails, helpers>
FIELD: <what was added>
STRUCTURE: <light towers, canopy, roof ribs>
STATS: KC desktop <calls>/<tri>, phone <calls>/<tri>; NYY desktop <calls>/<tri>, phone <calls>/<tri>
API: <new ctx fields and tools>
PROBLEMS: <none, or what failed>
```
