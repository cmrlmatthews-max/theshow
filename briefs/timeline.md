# Brief: timeline and history layers for "The Show"

You start with no context. This file is the complete instruction.

## The project

"The Show" is a personal, single-page baseball atlas in a vintage style (parchment map, slab-serif type, baseball-card pop-ups). Phase 1 is complete: a d3 map of the US and Canada with the 30 current MLB ballparks, a card for each, and a generated 3D ballpark (`src/park.js`). Your working copy is `/home/claude/work/timeline`. Work only there.

Read these files first: `src/main.js`, `src/template.html`, `src/field.js` (only `fieldDiagramSVG`), and `briefs/history-schema.md` (the data schema). Skim `src/park.js` only for `ParkView.load(rec)` inputs.

## Your job

Add a history mode: a year slider from 1871 to 2026 that shows every club of the selected year, with relocation paths, former ballparks, defunct clubs, and the Negro Leagues.

## Data

- `src/history-data.js` exports `HISTORY = { teams: [...], parks: [...] }` in the schema of `briefs/history-schema.md`. The file in your copy is a SMALL FIXTURE with approximate values. The real file replaces it later (about 450 team stints and 350 parks). Do not edit the fixture except to add test cases. Your code must work with any data that follows the schema: null capacity, null dimensions, `coord_approx: true`, and `homes[].park` values that are Phase 1 ids (example: "LAD") which have no entry in `HISTORY.parks` (take the ballpark fields from `STADIUMS` in `src/data.js` for those).
- A stint can list a home park id that is missing from both lists. Skip that home without an error and `console.warn` once.

## Features

1. **Year bar** at the bottom of the map frame: a slider (1871 to 2026, default 2026), a large year readout in vintage numerals, step buttons (one year back, one year forward), a play/pause button (about 3 years per second), and a "Today" button (2026). Left and right arrow keys change the year when the 3D view is closed and no input has focus.
2. **Year 2026 = Phase 1.** At 2026 the page must look and act as it does now (30 markers, the existing cards, the roster by division).
3. **Other years.** Show one marker for every stint with `start <= year <= end`, placed at its home park for that year. The existing `layout()` function moves overlapping markers apart; make it work with a changing set of nodes. One year can have about 40 clubs, with several in one city.
4. **Marker look.** Ancestors of a current franchise (`franchise` is a Phase 1 id) use that franchise's Phase 1 colors. Other clubs use a league color: NA `#6b5b3e`, NL `#7a2e2e`, AL `#2e4a7a`, AA `#4a6b3a`, UA `#7a5a2e`, PL `#5a3e6b`, FL `#2e6b6b`, Negro Leagues `#3a3a3a` with a gold `#c9a227` ring. Marker text is `abbr`. A `coord_approx` park gets a dashed ring.
5. **League switches** (a small legend panel on the map): National League, American League, National Association, American Association, Union Association, Players' League, Federal League, Negro Leagues (one switch for NNL1, ECL, ANL, EWL, NSL, NNL2, NAL). Show a switch only when the selected year has a club in that league. All switches start on.
6. **Roster panel.** For years other than 2026, list the clubs of that year grouped by league (full league name as the heading), each with its ballpark name.
7. **History card** (same baseball-card style as the existing card) for a selected club in a past year:
   - Club: name, league full name, city, stint years, `fate`, `note`.
   - Ballpark that year: name, aka, opened, closed, status, capacity, surface, architect, notable facts, a "Location is approximate" line when `coord_approx` is true.
   - The field diagram and the distances table when at least `lf`, `cf`, and `rf` are known (reuse `fieldDiagramSVG`; it needs an object with `id`, `dimensions_ft`, `wall_ft`).
   - **Enter the Ballpark** button only when `lf`, `cf`, and `rf` are all known. Call the existing `openPark` with an adapter object: `{ id: 'H-' + park.id, stadium: park.name, team: stint.name, city: park.city, colors: [c1, c2], capacity: park.capacity ?? 20000, opened: park.opened, roof: park.roof, surface: park.surface, dimensions_ft, wall_ft }`.
   - **Franchise timeline:** every stint of the same `franchise`, oldest first, as buttons. A click sets the slider to that stint's start year and selects that club.
   - Sources list (collapsed), same as the existing card.
8. **Relocation path.** When a club is selected, draw its franchise's path on the map: one curved line with an arrowhead for each change of home city, in time order, with the year of the move as a small label, and a small dot at each former park of the franchise. Remove the path when the card closes.
9. **Two map switches** in the legend panel: "All relocations" (faint curved lines for every city change of every franchise, drawn once) and "All former ballparks" (a small sepia dot for every park in `HISTORY.parks`, any year). A click on a park dot opens a park card: the ballpark fields plus the list of clubs that used it, with years, each a button that jumps to that club and year.
10. Lines and dots must keep their screen width when the map zooms (they live in the zoomed group; use `vector-effect: non-scaling-stroke` or redraw from the zoom transform, as `layout()` does for markers).

## Rules

- Edit only `src/main.js` and `src/template.html`. Create `src/history.js` for the new logic (index by year, franchise chains, path geometry). Do not edit `park.js`, `field.js`, `data.js`, `geo.js`, or `src/details/`.
- Keep the vintage style of the existing CSS (fonts, colors, double rules). No team logos, wordmarks, or brand names.
- Keep `window.__show` and add `setYear(year)` and `selectStint(index)` to it for tests.
- No new dependencies. The page must work from `file://` with no network.

## Build and look

```
cd /home/claude/work/timeline
node build.mjs
python3 quick.py "" "y1884=window.__show.setYear(1884)" "y1953=window.__show.setYear(1953)"
```

`quick.py` (first argument: comma list of park ids to load in 3D, or "") runs each `name=javascript` step and saves `shots/<name>.png`. It prints page errors. Read the PNG files to inspect your work. The test browser is slow; each run takes 20 to 60 seconds. Do at most five build-and-look rounds.

## Final reply (fixed format, 12 lines or fewer)

```
FILES: <changed and new files>
DONE: <feature numbers that work>
GAPS: <feature numbers that are partial, with one phrase each>
TEST HOOKS: <names added to window.__show>
PROBLEMS: <none, or what failed>
```
