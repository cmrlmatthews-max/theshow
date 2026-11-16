# Brief: level 3 detail for one hand-detailed ballpark

You start with no context. This file and the short task text (your ballpark ID and working copy) are the complete instruction.

## The project

"The Show" is a personal, single-page baseball atlas in a vintage style. `src/park.js` generates a 3D ballpark (three.js). Your ballpark already has a detailed module, `src/details/<ID>.js` (levels 1 and 2: measured facade, roof or canopy, custom seating decks, aisles, tunnels, dugouts, net, bullpens, window panes). A new `park.js` now adds generic level 3 detail (seat-row texture, aisles, railings, field markings, a raised mound, a tarp, lattice light towers) and a phone level of detail. Your module replaces the generic decks, so most generic seat detail does not reach your park. Your job: bring your park to level 3 and fit it into the phone budget.

## Read first

1. `briefs/detail-api.md` in your working copy. It documents `ctx.lod`, `config(rec, { lod })`, `parts.aisles`, `parts.rails`, `tools.rail`, `tools.aisles`, and `cfg.skip.dugouts`.
2. The top comment block of `src/details/<ID>.js`.
3. Reference images in `/home/claude/refs/<ID>/`: `survey_hi.png`, `zone_*.png` (satellite sheets in model coordinates, home plate at the origin, center field up), and `photoN_*.jpg` (photographs; the file name says what each one shows). Read the ones you need.

## What to build

1. **Roof, canopy, and light structure (area A).** The underside structure of the roof or canopy: trusses or ribs at the real spacing, support columns, and light banks with lamps at their real positions (from the photographs). Light towers with a lattice or truss mast where the park has them.
2. **Seats (area B).** Seat rows on your custom decks: use the seat material `ctx.M[ctx.MAT.SEAT]` (it now carries a row texture; check that your UVs give about one row per 3 ft across the deck), or the same texture on your own materials. Railings on the front of each deck (`tools.rail`), glass rails where the photographs show them, and handrails in the aisles that you already have.
3. **Field (area C).** Check the new generic field details in your park (markings, mound, on-deck circles, coaches' boxes, tarp). Fix any conflict with your own dugouts, net, or bullpens (for example a tarp that runs into a dugout, or doubled dugouts: set `skip.dugouts` if needed).
4. **Phone budget.** `const low = ctx.lod === 'low';`. On `low`: the whole park at most 250 draw calls and 90,000 triangles. Merge or skip small repeated parts (window panes, mullions, small trusses, lamps, aisle handrails), or use fewer instances. Desktop: at most 420 draw calls and 200,000 triangles.

## Tools and tests

- `node build.mjs`, then run every browser test through the slot wrapper (many workers share 2 CPUs):
  - `python3 /home/claude/lvl3/qlock.py timeout 170 python3 quick.py <ID> "home=window.__show.park.setView('home',true)" "upper=window.__show.park.setView('upper',true)" "aerial=window.__show.park.setView('aerial',true)"` (add your own camera views as in the brief examples in `briefs/`).
  - `python3 /home/claude/lvl3/qlock.py python3 /home/claude/lvl3/stats.py <ID>` prints calls and triangles at desktop size and at phone size.
- At most five build-and-look rounds.

## Rules

- Edit only `src/details/<ID>.js` in your working copy.
- No team logos, wordmarks, sponsor names, brand shapes, statues, likenesses of people, or player names or numbers. Boards stay blank.
- Keep all existing views working. Keep the vintage colors.
- Update the top comment block: what level 3 added, and what is estimated.

## Final reply (fixed format, 10 lines or fewer)

```
FILE: <path>
AREA A: <roof/canopy/light structure added>
AREA B: <seat rows, rails, handrails>
AREA C: <field fixes>
STATS: desktop <calls>/<triangles>, phone <calls>/<triangles>
PROBLEMS: <none, or what failed>
```
