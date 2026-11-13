# Brief: refine a detailed 3D ballpark from reference images

You start with no context. Read this file, then read `briefs/detail-api.md` in your working copy (the module API, the coordinate system, and the build-and-look commands). Skip the "Research" rule in that file: your references are image files, described below.

## The job

A detail module for your ballpark exists (`src/details/<ID>.js` in your working copy). A worker wrote it from text sources only, so its wall corners, roof outline, and facade are estimates. You now have a measured satellite sheet and photographs. Rebuild the **exterior facade** and the **roof / canopy** so that their massing and proportions match the real park. These two items are the owner's priority. Keep the same stylized vintage look. Do not add fine parts (no individual seats, railings, or small ornaments).

## Your reference images (read them with the Read tool before you write code)

Folder: `/home/claude/refs/<ID>/`

- `survey_tight.png`: a satellite image, rotated and scaled into the model's coordinate system, with a grid. Home plate is the origin. Center field is up. Right field is to the right. Red rings are 100 ft apart, measured from home plate. Faint grid lines are 50 ft apart; yellow labels give model `x` and `z` in feet (center field is negative `z`). Scale: 1.5 pixels per foot. `survey_tight_plain.png` is the same image with no grid.
- `survey_wide.png`: the same for the surroundings. Rings are 200 ft apart. Scale: 0.55 pixels per foot. Low resolution; use it only for the position of nearby buildings, streets, water, and rail lines.
- `photoN_*.jpg`: photographs. The file name says what each one shows.

How to measure: find a feature on `survey_tight.png`, read its `x` and `z` from the grid, and write the points into your code as a table of `[x, z]` pairs. A satellite image is not a perfect plan: tall objects lean away from the image center by a few feet, and shadows hide some edges. Use the roof edges and the ground line that you can see, and the photographs for heights.

## What to build

1. **Roof / canopy outline.** Trace the inner edge and the outer edge of the roof from the sheet as two point tables (at least 10 stations around the bowl). Build the roof from these tables (a custom ribbon mesh between the two edges, with the inner edge and outer edge heights from the photographs). Show where the roof stops on each side. Match the roof color and its structure as seen in the photographs (trusses, columns, a frieze, light banks), in simple form.
2. **Exterior facade.** Trace the outer wall line of the building from the sheet as a point table. Build the facade as a wall along that line with the real composition from the photographs: materials and colors, the rhythm of piers and window bays, gate pavilions or towers in their real positions, the cornice or cap, and the base. Use instanced meshes for repeated bays.
3. **Fit the bowl.** Adjust `config` (lower and upper deck depth, slope, extents, `foulScale`, `backstop`) so that the seating fits between the field and your measured facade line, and the upper deck ends where the sheet shows it. Remove generic parts that conflict (use `ctx.remove`).
4. **Outfield wall corners.** Check the existing `wall` corner table against the sheet (the wall is the edge between the warning track and the seats). Move corners that are more than about 10 ft off. Keep the posted distances.
5. **Check and keep** the other existing features (scoreboard, signature features, surroundings). Move one only if the sheet shows that its position is clearly wrong.

## Compare your model with the sheet

Add this step to your `quick.py` run to get a top-down view with center field up, then compare it with `survey_tight.png`:

```
"plan=(()=>{const p=window.__show.park;p.setView('aerial',true);p.controls.minPolarAngle=0;p.controls.maxPolarAngle=3.14;p.camera.position.set(0,1250,-159.9);p.controls.target.set(0,0,-160);p.controls.update();})()"
```

Also look at one exterior view from ground level near a gate, and compare it with the facade photographs.

## Rules

- Edit only `src/details/<ID>.js` in your working copy. Do not edit other files.
- No team logos, no team wordmarks, no sponsor names, no brand shapes, no likenesses of people. Signs in the photographs are reference for position and size only; use the ballpark name as plain text where a name sign exists.
- Keep all existing camera views working. You may change the three extra views so that they show the facade and the roof well.
- Keep added draw calls under about 200 in total. Use `THREE.InstancedMesh`.
- Do at most five build-and-look rounds, then stop.
- Put a comment block at the top of the file that lists what you measured from the sheet and what is still an estimate.

## Final reply (fixed format, 12 lines or fewer)

```
FILE: <path of your module>
MEASURED: <what you took from the survey sheet, with the main numbers>
FROM PHOTOS: <facade and roof features built from the photographs>
STILL ESTIMATED: <list>
VIEWS: <the extra view keys>
PROBLEMS: <none, or what failed>
```
