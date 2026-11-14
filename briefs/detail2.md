# Brief: second detail level for a 3D ballpark (seating bowl, field level, facade parts)

You start with no context. Read this file, then read `briefs/detail-api.md` in your working copy (the module API, the coordinate system, and the build-and-look commands). Skip the "Research" rule and the round limit in that file; this brief replaces them.

## Where the work stands

`src/details/<ID>.js` in your working copy is a detail module for your ballpark. Its roof outline, facade line, and outfield wall corners were measured from a satellite sheet in an earlier pass. Keep that work. Do not move the roof or the facade line unless a new sheet shows an error of more than 10 ft.

Read the whole module first, so that you know its tables and helpers.

## Your reference images (read them with the Read tool)

Folder: `/home/claude/refs/<ID>/`. All sheets use the model's coordinate system: home plate is the origin, center field is up (negative `z`), right field is to the right (positive `x`), units are feet. Red rings are 100 ft apart from home plate. Yellow labels give `x` and `z`.

- `survey_hi.png`: the whole park at 1.5 pixels per foot, grid lines 50 ft apart. This image has more than twice the resolution of the sheet that the earlier pass used.
- `zone_home.png`, `zone_left.png`, `zone_right.png`, `zone_center.png`: zooms at 2.4 pixels per foot, grid lines 25 ft apart, labels every 50 ft. `zone_home` covers `x` -250..250 and `z` -250..250. `zone_left` covers `x` -500..0, `z` -500..0. `zone_right` covers `x` 0..500, `z` -500..0. `zone_center` covers `x` -250..250, `z` -750..-250.
- `survey_wide.png`: the surroundings at low resolution.
- `photoN_*.jpg`: photographs. The file name says what each one shows.

The sheet rotation is accurate to about 1 degree. Tall objects lean a few feet in a satellite image, and shadows hide some edges.

## The job: three areas

**a. Seating bowl**
1. Read the real decks from the zone sheets: for each deck, where its front edge and back edge are (at about 12 stations around the bowl), and where the deck starts and stops. Seat sections, cross-aisles, and deck edges show as light lines in the sheets. Use the photographs for the number of levels and their heights.
2. Rebuild the decks with depth that changes around the bowl (`tools.sweepSolid` takes a cross-section function per station). Show the cross-aisle (the flat walkway that splits the lower bowl) where the sheet shows one.
3. Add section aisles as thin light strips on the seating (instanced), at the spacing that you count on the sheet.
4. Add entry tunnels (dark openings in the seating, instanced boxes).
5. Add the suite level and the press level as glass bands between decks, where the photographs show them.

**b. Field level**
1. Dugouts: measure position and length on `zone_home.png`. Build each one as a low roofed box with a dark opening toward the field.
2. Bullpens: find them on the sheets and the photographs. Build the pen floor, its fence or wall, and two pitching mounds each.
3. Backstop net: a transparent net behind home plate between the dugouts, with its posts.
4. Batter's eye: correct its shape and size from `zone_center.png` and the photographs.
5. Boards in or on the outfield wall (manual scoreboards, board panels): plain panels in muted colors with blank slots. No brand names.
6. Flag poles and foul-pole height where the photographs show them.

**c. Facade parts**
1. Window divisions: mullions and transoms on the tall windows. Use one canvas texture for each window type on the existing instanced windows, or thin instanced bars.
2. Cornices and string courses as real profile bands.
3. Stair towers and ramp towers at their positions on the sheet.
4. Gates: doors or gate fences at each gate pavilion, and the perimeter fence where the photographs show one.
5. Name signs: the ballpark name as plain text only.

## Heights

You may use up to four web lookups (WebSearch or WebFetch; shell commands cannot reach the web) for published heights: roof height, facade height, light tower height, board size. Write each source in a comment. Estimate the rest from the photographs.

## Compare your model with the sheets

Use these `quick.py` steps (replace X, Z with the center of the zone, and H with the camera height; H = 420 matches one zone sheet):

```
"plan=(()=>{const p=window.__show.park;p.setView('aerial',true);p.controls.minPolarAngle=0;p.controls.maxPolarAngle=3.14;p.camera.position.set(0,1250,-159.9);p.controls.target.set(0,0,-160);p.controls.update();})()"
"zone=(()=>{const p=window.__show.park;p.setView('aerial',true);p.controls.minPolarAngle=0;p.controls.maxPolarAngle=3.14;p.controls.minDistance=1;p.camera.position.set(X,H,Z+0.1);p.controls.target.set(X,0,Z);p.controls.update();})()"
```

Also look at the model from the stock views `home`, `upper`, and `pressbox`, and from one ground-level exterior view, and compare with the photographs.

## Rules

- Edit only `src/details/<ID>.js` in your working copy.
- No team logos, no team wordmarks, no sponsor names, no brand shapes, no likenesses of people, no player names or numbers. Sponsor signs in the photographs become blank panels.
- Keep the stylized vintage look. No individual seats.
- Performance: the whole park must stay under 330 meshes and under 450,000 triangles. Use `THREE.InstancedMesh` and merged geometry. Print the counts with this step and report them:
  `"count=(()=>{const p=window.__show.park;let m=0,t=0;p.group.traverse(o=>{if(o.isMesh){m++;const g=o.geometry;const n=(g.index?g.index.count:g.attributes.position.count)/3;t+=n*(o.isInstancedMesh?o.count:1);}});document.title='MESHES '+m+' TRIS '+Math.round(t);})()"` then read `document.title` in a later step, or add `console.error('COUNT '+m+' '+Math.round(t))` so that `quick.py` prints it.
- The field must stay walkable. Do not put solid objects on the field except the dugout fronts and the net posts, outside the foul lines.
- Keep all existing camera views working. You may change the three extra views.
- Do at most six build-and-look rounds, then stop.
- Update the comment block at the top of the file: what is measured, what is from photographs, what is an estimate.

## Final reply (fixed format, 14 lines or fewer)

```
FILE: <path of your module>
BOWL: <decks, depths, aisles, tunnels, suite and press levels: what you built and the main numbers>
FIELD: <dugouts, bullpens, net, batter's eye, boards, poles>
FACADE: <window divisions, cornices, towers, gates, signs>
HEIGHTS: <values with a source, and values that are estimates>
COUNTS: <meshes and triangles>
STILL ESTIMATED: <list>
PROBLEMS: <none, or what failed>
```
