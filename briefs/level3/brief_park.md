# Brief: detailed 3D model of one ballpark (level 1 + structure)

You start with no context. This file and the short task text (your ballpark ID and working copy) are the complete instruction.

## The project

"The Show" is a personal, single-page baseball atlas in a vintage style. `src/park.js` generates a 3D ballpark (three.js) for each MLB park from five outfield distances, three wall heights, the seat count, and the roof type. Three parks (ATL, NYY, SF) already have hand-detailed modules. Your job: write the detail module for ONE more park, so that its massing and structure match the real park.

## Read first

1. `briefs/detail-api.md` in your working copy: the module API, coordinates, `ctx`, and the build-and-look commands. Skip its "Research" limit; the limits below apply.
2. `briefs/refine.md`: the method for measuring from a satellite sheet. It describes an older sheet; your sheet is described below.
3. Look at one existing module for patterns, for example `src/details/ATL.js` (the top comment and `config`). Do not copy its geometry.

## Your satellite sheet

1. Wait for the file `/home/claude/refs/<ID>/READY`. Another worker makes it. While you wait, do your text research. Check with `ls`; if it is not there, `sleep 120` and check again (at most 40 minutes in total). If it never comes, build from text sources only and say so in PROBLEMS.
2. Read `/home/claude/refs/<ID>/mosaic.png` (1600 x 1200 px, north up, 0.9022 ft per pixel). Find two pixel positions: the tip of home plate, and second base. Zoom in with a crop if you need to (PIL; save crops in your working copy, not in refs).
3. Run `python3 /home/claude/lvl3/sheet.py <ID> <homeX> <homeY> <secondX> <secondY>`. It writes `survey.png` and `survey_plain.png` in the refs folder: model coordinates, home plate at the origin, center field up, right field to the right, 1.1 px per foot, a 50 ft grid with yellow `x,z` labels every 100 ft (center field is negative z), and red rings every 100 ft from home plate.
4. Read `survey.png`. Check it: the pitcher's mound must be on the center line at about z = -60, and first base at about (64, -64). If not, fix your two points and run it again.
5. Measure: the outer facade line, the roof or canopy edges, the deck edges, the outfield wall corners, the batter's eye, the scoreboard, and the position of the light towers. Write them as tables of `[x, z]` in feet.

## Research

Use WebSearch and WebFetch (at most 6 fetches): the Wikipedia page, andrewclem.com, MLB.com ballpark pages. Get the wall corner distances and heights, the deck layout, the roof or canopy type, the facade material and composition, and the signature features. The shell cannot reach the web, and you cannot download photographs.

## What to build (priority order)

1. **Bowl fit.** Set `config` (wall corners, `foulScale`, `backstop`, `lower`, `upper`, `outfield`) so that the generic seating matches the sheet: deck depths, where the upper deck stops, outfield seat sections. Prefer `config` over new deck geometry. The generic decks get seat rows, railings, and aisles from another worker; custom decks do not.
2. **Exterior facade.** A wall along your measured facade line, with the real material, colors, rhythm of bays, gates or towers, cornice, and base (instanced meshes for repeated bays).
3. **Roof, canopy, and light structure (owner's priority).** The real roof or canopy outline from the sheet. Its structure in simple form: trusses or ribs on the underside, support columns, a frieze if the park has one. Light towers or roof light banks at their real positions, with a lattice or truss mast and a bank of lamps (instanced). For a retractable roof: the real panel layout and the direction it opens (see how `park.js` builds `this.roof` panels, and keep `toggleRoof` working, or set `skip` and build your own panels in the same `this.roof` format only if you must). For a fixed dome: the dome shape and its ribs.
4. **Signature features** (for example a big wall, a warehouse, a fountain, a pool, a rooftop deck), in simple form, at their measured positions.
5. Remove generic parts that conflict (`ctx.remove(ctx.parts.lights)`, and so on).

## Phone budget

The owner opens the 3D view on a phone. Another worker adds `ctx.lod` (`'low'` on phones, `'high'` on desktops). Read it as `const low = ctx.lod === 'low';` (it may be undefined in your copy, which means high).

- Desktop: your module adds at most 40,000 triangles and 120 draw calls.
- Phone (`low`): at most 20,000 triangles and 70 draw calls. Skip small repeated parts (window panes, small trusses, lamps) or use fewer instances.
- Check with: `python3 /home/claude/lvl3/qlock.py python3 /home/claude/lvl3/stats.py <ID>` (from your working copy). It prints calls and triangles for the whole park. Generic parks start at about 150 calls and 7,000 triangles. To test the phone path in your copy, temporarily pass `lod: 'low'` yourself; remove it before you finish.

## Build and look

- Register your module: add `import <ID> from './<ID>.js';` to `src/details/index.js` and add `<ID>` to the `DETAILS` object.
- `node build.mjs`, then run every browser test through the slot wrapper, because 30 workers share 2 CPUs:
  `python3 /home/claude/lvl3/qlock.py timeout 170 python3 quick.py <ID> "aerial=window.__show.park.setView('aerial',true)" "plan=(()=>{const p=window.__show.park;p.setView('aerial',true);p.controls.minPolarAngle=0;p.controls.maxPolarAngle=3.14;p.camera.position.set(0,1250,-159.9);p.controls.target.set(0,0,-160);p.controls.update();})()"`
- Compare `shots/plan.png` with `survey.png`. Add one exterior view and one view from the stands.
- At most four build-and-look rounds.

## Rules

- Edit only `src/details/<ID>.js` and `src/details/index.js` in your working copy.
- No team logos, wordmarks, sponsor names, brand shapes, statues, or likenesses of people. Boards and signs are blank. The ballpark name as plain text is allowed on a facade.
- Muted vintage colors. Use `ctx.C` and `ctx.rec.colors`. No external assets, no network at run time.
- All existing views must work. You may add up to three views (for example `gate`, `roof`, `stands`).
- A comment block at the top of the file: what you measured from the sheet (main numbers), what came from text sources, what is estimated.
- Do not write files in `/home/claude/refs/` other than the two sheets that `sheet.py` writes. Keep your crops in `shots/` in your working copy.

## Final reply (fixed format, 10 lines or fewer)

```
FILE: <path of your module>
MEASURED: <main features and numbers from the sheet>
BUILT: <facade, roof/canopy structure, lights, signature features>
ESTIMATED: <list>
STATS: desktop <calls>/<triangles>, phone <calls>/<triangles>
VIEWS: <added view keys>
PROBLEMS: <none, or what failed>
```
