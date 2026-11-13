# The Show

The Show is an interactive atlas of the 30 Major League Baseball (MLB) home ballparks. It shows a vintage map of the United States and Canada, a card for each ballpark, and a generated 3D model of each ballpark.

Phases 1, 2, and 3 are complete. Data is current to November 2026.

## How to use it

1. Open `index.html` in Safari or Chrome. The file needs no internet connection.
2. Select a marker on the map or a club in the left list.
3. Read the card. Select **Enter the Ballpark** to open the 3D model.
4. Select a view. Drag to look. On the field views, use W A S D or the arrow keys to walk.
5. Press Escape to go back.

### The timeline (Phase 2)

- Move the year slider from 1871 to 2026. The map shows each club of that season at its home ballpark.
- **Play** steps through the years. **Today** goes back to 2026. The left and right arrow keys change the year.
- The league switches show or hide a league. A switch shows only in years when that league has clubs.
- Select a club to see its card and the path of its franchise from city to city.
- The **Franchise timeline** buttons in a card go to each earlier or later form of the club.
- **All relocations** shows each city change of each franchise. **All former ballparks** shows each ballpark in the data.
- A past ballpark has a 3D model only when its left, center, and right distances are known (77 of 203).
- A dashed ring on a marker shows that the ballpark location is approximate.

### Detailed 3D models (Phase 3)

Truist Park, Yankee Stadium, and Oracle Park have a detail module on top of the generated model. Each has three more camera views.

The second version of these models (November 2026) uses reference images:

- A satellite image of each park, rotated and scaled so that home plate is the origin and center field is up, with a grid in feet. The roof outline, the facade line, and the outfield wall corners are point tables read from this sheet.
- Five or six photographs of each park from Wikimedia Commons, for the facade composition, the roof structure, and the colors.
- Heights are estimates from the photographs. No source gives them.
- The reference images are not in this folder. The satellite images are from Esri World Imagery, and the photographs belong to their authors.
- `briefs/refine.md` describes the method. A new park needs one satellite sheet, a few photographs, and one file in `src/details/`.

## Files

| File | Purpose |
|---|---|
| `index.html` | The complete page. Code, map shapes, and data are inside this one file. |
| `data/stadiums.json` | The 30 current ballpark records. |
| `data/history.json` | 311 club stints and 203 former ballparks, 1871 to 2026. |
| `data/history/raw/` | The twelve first-pass history files, one per worker group. |
| `data/history/*.json` | Merge rules: duplicate ballpark names, joined franchises, and fact-check corrections. |
| `data/raw/` | The six first-pass files for the current ballparks. |
| `src/` | The source code. `main.js` is the map and cards. `history.js` is the timeline logic. `park.js` is the 3D generator. `field.js` is the field geometry. `details/` holds the three detailed ballparks. |
| `build-data.py`, `build-history.py` | Apply corrections and write the data files. `build-history.py` also checks the club count of each league season. |
| `build-geo.mjs`, `build.mjs` | Build the map shapes and the final `index.html`. |
| `briefs/` | The instructions and the data format that the workers used. |

To rebuild after a data change: run `npm install`, then `python3 build-data.py`, `python3 build-history.py`, and `node build.mjs`. Copy `dist/index.html` over `index.html`.

## What the 3D model is

- The field shape uses the five posted outfield distances of each ballpark.
- The outfield wall uses the posted wall heights at left, center, and right.
- The roof type (open, retractable, fixed) and the seat count set the roof and the size of the stands.
- The seating bowl, scoreboard, and light towers are generic, except in the three detailed ballparks.
- In the three detailed ballparks, the posted distances and the main wall heights are from sources. The roof outline, the facade line, and the wall corners are measured from a satellite image (accuracy about 5 to 10 ft). Heights, gate positions, and deck depths are estimates.

## History data: scope and limits

- Leagues: National Association (1871 to 1875), National League, American League, American Association, Union Association, Players' League, Federal League, and the seven Negro Leagues from 1920 to 1948 that MLB counts as major leagues.
- MLB does not count the National Association as a major league. It is in the data because the Braves and the Cubs started there.
- A "stint" is a period in which a club kept one name, one city, and one league.
- Only the principal home ballpark of each season is in the data. Neutral-site games and one-day venues are not.
- 68 of the 203 former ballparks have an approximate location. Most are 19th-century grounds and Negro Leagues ballparks. 8 clubs have no recorded home grounds.
- Negro Leagues membership differs between sources (Wikipedia, Baseball-Reference, Seamheads). The data follows the Baseball-Reference standings where sources disagree.
- Many Negro Leagues clubs used more than one home ballpark in a season. The data shows one.
- Known gaps: the Homestead Grays' short 1933 season in the Negro National League is not in the data, and the 1933 Akron club has no ballpark.
- An independent reviewer checked the merged data against sources. Its six corrections are in `data/history/patches.json` with the reason and the source for each.
- `build-history.py` confirms the club count of each season: National and American League 1876 to 2026, and each season of the five early leagues.

## Sources

- Wikipedia stadium and team pages (linked in each card).
- MLB.com ballpark pages (linked in each card).
- Clem's Baseball, Stadium Statistics, for wall heights: https://andrewclem.com/Baseball/Stadium_statistics.html
- History data: Wikipedia club and ballpark pages, Baseball-Reference, Seamheads ballparks and Negro Leagues databases, SABR. Each card lists its sources.
- 2026 World Series result: https://www.mlb.com/brewers/news/brewers-win-world-series-2026
- Map shapes: US Census Bureau (through `us-atlas`) and Natural Earth (through `world-atlas`).
- Team colors: teamcolorcodes.com and similar lists. These are not official brand values.

## Values to verify

These values had a conflict between sources or no strong source. Confidence is medium for each.

| Ballpark | Value | Reason |
|---|---|---|
| Rogers Centre | Wall heights 14 / 8 / 13 ft | The 2023 renovation changed the walls. No source was fetched for the new heights. |
| Sutter Health Park | Wall heights, left-center and right-center distances | Not found. The 3D model uses 8 ft and an estimate. |
| Oriole Park at Camden Yards | Left wall 7 ft | The wall changed for 2025. Sources give 7 ft to 13 ft. |
| Citi Field | Left-center 358 ft | Sources mark different points on the wall (358 to 385 ft). |
| Daikin Park | Left-center 366 ft, right-center 370 ft | Sources also list deep points of 399 and 408 ft. |
| Kauffman Stadium | Capacity 37,903 | A second source gives 38,053. |
| Great American Ball Park | Capacity 43,500 | MLB.com gives 45,814. |
| loanDepot park | Capacity 37,442 | A second source gives 36,742. |
| Chase Field | Capacity 48,330 | MLB.com gives two other figures. |
| Dodger Stadium | Name | 2026 sources list "Uniqlo Field at Dodger Stadium". The card keeps "Dodger Stadium" and shows a note. |
| Comerica Park | Planned 2027 rename | From one source. |
| All teams | Color hex values | From color lists, not from the clubs. |

## Design limits

- The page does not use official team logos. It uses team names, team colors, and original lettering.
- Fonts are Mac system fonts (Snell Roundhand, Rockwell, Baskerville). Other systems show substitute fonts.

## Possible next steps

- Detailed 3D models for more ballparks (each one is a file in `src/details/`).
- Better locations for the 68 approximate ballparks.
- Original vintage artwork for the cards.
