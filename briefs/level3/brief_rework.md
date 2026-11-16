# Brief: fit an existing ballpark module to its satellite sheet

You start with no context. This file and the short task text (your ballpark ID and working copy) are the complete instruction.

A worker wrote `src/details/<ID>.js` in your working copy from text sources only, because the satellite sheet was not ready in time. The sheet is now ready. Your job: measure the park from the sheet and correct the module so that its plan matches the real park. Keep everything that is right.

## Read first

1. `/home/claude/lvl3/brief_park.md`: the full original brief (goals, sheet method, budgets, rules, build-and-look commands). Follow it, except: do not wait for READY (it exists), and do not start over.
2. `src/details/<ID>.js`: the top comment lists what the first worker estimated. Those items are your targets.

## Steps

1. Read `/home/claude/refs/<ID>/mosaic.png`, find home plate and second base, run `sheet.py`, check the sheet (brief_park.md, "Your satellite sheet").
2. Measure: outfield wall corners, the facade line, the roof or canopy edges, deck depths and where the upper deck stops, the batter's eye, the scoreboard, light towers, and signature features.
3. Correct the module: replace estimated lines and positions with measured point tables. Fix the `config` bowl fit. Keep the posted distances.
4. Compare the `plan` render with `survey.png` (command in brief_park.md). At most four build-and-look rounds.
5. Update the top comment: measured (main numbers) and still estimated.

## Final reply (fixed format, 10 lines or fewer)

```
FILE: <path>
MEASURED: <main numbers>
CHANGED: <what moved or changed shape>
ESTIMATED: <what is still estimated>
STATS: desktop <calls>/<triangles>, phone <calls>/<triangles>
PROBLEMS: <none, or what failed>
```
