# Brief: level 4 detail for one ballpark (photographs, heights, seating shape, scoreboards)

You start with no context. This file and the short task text (your ballpark ID and working copy) are the complete instruction.

## The project

"The Show" is a personal, single-page baseball atlas in a vintage style. `src/park.js` generates a 3D ballpark (three.js). Your ballpark already has a detail module, `src/details/<ID>.js`, built from a satellite sheet and text sources. Its top comment lists what was measured and what is estimated. Your job: make it more accurate and more detailed in four areas. Improve the existing module; do not start over.

## Read first

1. `briefs/detail-api.md` in your working copy: the module API, coordinates, `ctx`, and the tools. NEW: deck depth, upper overhang, and upper rise accept a table along the bowl (`lower: { depth: [[0, 60], [0.5, 85], [1, 120]] }`), and `ctx.dims.deckAt` gives the deck values at any point of the bowl.
2. `/home/claude/lvl3/brief_park.md`: the earlier brief. Its sections "Your satellite sheet" and "Build and look" still apply. The satellite sheet already exists: `/home/claude/refs/<ID>/survey.png` and `survey_plain.png` (model coordinates; 1.1 px per foot; home plate at the origin; center field up; right field to the right). If the sheet is wrong or missing, rebuild it with `sheet.py` as that brief says.
3. `src/details/<ID>.js`: the top comment and the code.

## Photographs

- `/home/claude/refs/<ID>/photoN_*.jpg`, with `PHOTOS.md` (what each one shows). Another worker captures them. If `PHOTOS_READY` does not exist yet, start with areas C and D, then check again (`sleep 120` between checks, at most 45 minutes in total). If it never comes, or says `none`, use the satellite sheet and text only, and say so in PROBLEMS.
- Read the photographs with the Read tool. Crop and zoom with PIL if you need to (save crops in your working copy `shots/`, never in refs).

## What to build

**A. Facade from photographs.** Compare the facade in the photographs with the model: materials and colors (muted vintage versions), the number of levels, the bay rhythm, arches and window shapes, gate and tower shapes, cornices, signs (plain ballpark name text only, if it is on the real facade). Correct what is wrong. Add the parts that are missing and visible from the outside views.

**B. Real heights.** Replace estimated heights with measured ones:
- From photographs: use a known size in the same photograph and the same plane. Examples: a seat row rises about 1.2 to 1.5 ft in a lower deck and 2 to 2.5 ft in an upper deck (count rows); a concourse story is about 13 to 16 ft; a door is about 8 ft; the outfield wall height is in the config.
- From the satellite sheet: shadows. In one sheet, all shadows have the same direction and the same length ratio. Find one object of known height (from a photograph or from text), measure its shadow length, and get the ratio. Then measure other shadows (light towers, roof edge, facade, scoreboard). Shadows that fall on stands or on a slope are not reliable.
- Record each height and its method in the top comment.

**C. Real seating shape.** The generic bowl is the same on both sides. Measure the real bowl on the sheet and in the photographs: the depth of the lower and upper decks on each side and behind home, where each deck starts and ends, and the outfield seat sections. Use the new depth tables in `config` (generic decks then keep their seat rows, aisles, and rails). Use custom decks only where a table cannot describe the shape; if you do, give them the seat material and rails (`tools.rail`) and aisles (`tools.aisles`).

**D. Scoreboards and video boards.** Each main board and secondary board at its measured position and size, with its real structure: frame, support columns or truss, catwalks, a back structure, and the board's top elements if any (for example a clock or a crown shape that is not a team or sponsor mark). Flagpoles where the park has them. Board faces stay blank (dark panels, or a plain line grid). No logos, sponsor names, team names, or player names or numbers.

## Budgets

- Desktop and iPad (`ctx.lod` is `'high'`): the whole park at most 600 draw calls and 300,000 triangles.
- Phone (`ctx.lod === 'low'`, short screen side under 600 px): the whole park at most 250 draw calls and 90,000 triangles. Skip or simplify small repeated parts on `low`.
- Merge meshes that share a material, and use instancing for repeated parts. Single-material box geometry: clear its groups (`geometry.clearGroups()`) so that it counts as one draw call.
- Check with `python3 /home/claude/lvl3/qlock.py python3 /home/claude/lvl3/stats.py <ID>` from your working copy. Its phone run uses a 390 x 844 screen, so `lod` is `'low'` there.

## Build and look

- `node build.mjs`, then run every browser test through the slot wrapper (many workers share 2 CPUs), for example:
  `python3 /home/claude/lvl3/qlock.py timeout 170 python3 quick.py <ID> "aerial=window.__show.park.setView('aerial',true)" "gate=window.__show.park.setView('gate',true)"`
- Compare your renders with the photographs from about the same viewpoint (add a temporary camera if needed). Compare the plan with `survey.png`.
- At most five build-and-look rounds.

## Rules

- Edit only `src/details/<ID>.js` in your working copy.
- No team logos, wordmarks, sponsor names, brand shapes, statues, likenesses of people, or player names or numbers. Muted vintage colors.
- All existing views must work. You may add or move up to three views.
- Keep the top comment block up to date: measured (with method), and still estimated.
- Do not copy photographs anywhere outside `/home/claude/refs/` and your `shots/` folder.

## Final reply (fixed format, 12 lines or fewer)

```
FILE: <path>
A FACADE: <what changed, from which photographs>
B HEIGHTS: <main heights and the method for each>
C SEATING: <depth tables and deck ends, per side>
D BOARDS: <boards, structures, flagpoles>
STILL ESTIMATED: <list>
STATS: desktop <calls>/<triangles>, phone <calls>/<triangles>
PROBLEMS: <none, or what failed>
```
