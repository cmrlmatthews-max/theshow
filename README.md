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

The third version (November 2026, "level 2") adds parts in three areas. The satellite sheets for this version have a scale of about 0.7 ft for each pixel.

- **Seating bowl:** deck tiers with a cross-aisle, section aisles, tunnels, glass bands for suites and the press level, and a deck depth that changes along the bowl.
- **Field level:** dugouts, a backstop net, bullpens, a batter's eye, foul poles, and blank panels on the outfield wall.
- **Facade:** window panes and frames, cornices, stair and ramp towers, gate doors, and fences.

| Ballpark | Parts (meshes) | Triangles |
|---|---|---|
| Truist Park | 101 | 47,240 |
| Yankee Stadium | 123 | 74,815 |
| Oracle Park | 172 | 37,985 |

Limits of the level 2 parts:

- All heights are estimates from photographs.
- The aisle spacing and the tunnel positions are typical values. They are not a count of the real sections.
- The bullpen positions at Oracle Park come from a press release, because the satellite sheet does not show them clearly. The bullpen position at Truist Park is read from the sheet.
- The stair and ramp tower positions are approximate.
- The models have no team marks, sponsor names, player names, or numbers. Boards and wall panels are blank.
- `briefs/detail2.md` describes the level 2 method.

### Level 3: all 30 ballparks (November 2026)

All 30 current ballparks now have a detail module. Each module uses a satellite sheet at about 0.9 ft for each pixel (Esri World Imagery), text sources, and the generic generator.

- **Massing:** the facade line, the roof or canopy outline, the outfield wall corners, the deck depths, and the signature features are measured from the sheet. Examples: the B&O Warehouse, the Green Monster, the Crawford Boxes and train, the fountains at Kauffman Stadium, the rock pile at Angel Stadium, the Western Metal Supply building, and McCovey Cove.
- **Roof, canopy, and light structure (area A):** trusses or ribs under each roof, support columns, and lattice light towers or roof light banks with lamps. The retractable roofs follow the real panel layout and open in the real direction. Use "Close the roof" in the view menu.
- **Seats (area B):** a seat-row texture on every deck, section aisles with handrails, front railings, and glass rails at the upper deck and suite level.
- **Field (area C):** a mowing pattern, chalk lines, batter's boxes, coaches' boxes, on-deck circles, a raised mound with a rubber, a five-sided home plate, dugouts, and a rolled tarp.

Level of detail:

- A phone (a screen whose short side is under 600 px) gets a lighter model: fewer small parts, a smaller field texture, and a lower pixel ratio. An iPad or a computer gets the full model.
- Limits for each park: 600 draw calls and 300,000 triangles on an iPad or a computer, and 250 draw calls and 90,000 triangles on a phone. All 30 parks are well within both limits. The largest is Yankee Stadium (169 calls and 113,317 triangles on a computer; 168 and 75,147 on a phone). Most parks use 40,000 to 60,000 triangles on a computer.
- On a narrow screen, the 3D view menu is one row that scrolls sideways.

### Level 4: photographs, heights, seating shape, scoreboards (November 2026)

Each park was checked against 7 to 11 photographs from Wikimedia Commons, together with its satellite sheet.

- **Facade (a):** materials, levels, bay rhythm, window and arch shapes, gates, and towers now follow the photographs. Many facades changed a lot. Examples: Great American Ball Park is white steel and glass, not brick; Progressive Field has an open white steel frame; Busch Stadium has three gates with brick tower pairs and freestanding light towers; Oracle Park's facade line moved 60 to 100 ft inward (the earlier line followed the building's shadow).
- **Heights (b):** heights come from photographs (a known size in the same plane: a door, a person, the outfield wall, seat-row counts), from published sizes (for example scoreboard dimensions on MLB.com), and in a few parks from satellite shadows. Each module lists every height and its method in its top comment. Shadows were rarely usable, because most shadows fall on stands or roofs.
- **Seating shape (c):** the deck depth now changes along the bowl, measured on the satellite sheet. The shared generator accepts a depth table (`lower.depth`, `upper.depth`, `upper.overhang`, `upper.rise`; see `briefs/detail-api.md`). Examples: Truist Park's lower deck is 105 ft deep at the right-field end, 66 ft behind home, and 104 ft at the left-field end; Tropicana Field is deeper on the third-base side.
- **Scoreboards (d):** each main and secondary board is at its measured position and size, with its frame, support columns or truss, catwalks, and back structure. Flagpoles where the photographs show them. All board faces are blank.

Limits of levels 3 and 4:

- Heights from photographs have an accuracy of about 10 to 20 percent.
- At four parks the roof was closed in the satellite image: loanDepot park, Rogers Centre, Chase Field, and Globe Life Field. There, home plate and the seating shape come from the roof, the facade, and photographs (accuracy about 20 to 30 ft).
- Where one side of the bowl is in shadow on the satellite image, that side is a mirror of the other side. This applies to Dodger Stadium, Rate Field, Kauffman Stadium, Nationals Park, and loanDepot park.
- The satellite image of Globe Life Field cuts off the south edge of the building. That edge comes from text sources.
- Sutter Health Park shows only the 2025 board in right-center. The old center-field board was taken down in 2025.
- No team marks, sponsor names, statues, mascots, or brand shapes. Boards are blank. Some parks show the ballpark name as plain text where the real facade has it. Two park features stay in simple form: the apple at Citi Field (a plain red sphere) and the crown on Kauffman Stadium's scoreboard (a plain crown with no letters).
- `briefs/level3/` holds the worker briefs (`brief_level4.md` and `brief_photos.md` for level 4). `tools/level3/` holds the scripts for tiles, sheets, and stats. The scripts use the paths of the work session; change the paths before you use them again. The photographs are not in the project folder or the repository.

## Files

| File | Purpose |
|---|---|
| `index.html` | The complete page. Code, map shapes, and data are inside this one file. |
| `data/stadiums.json` | The 30 current ballpark records. |
| `data/history.json` | 311 club stints and 203 former ballparks, 1871 to 2026. |
| `data/history/raw/` | The twelve first-pass history files, one per worker group. |
| `data/history/*.json` | Merge rules: duplicate ballpark names, joined franchises, and fact-check corrections. |
| `data/raw/` | The six first-pass files for the current ballparks. |
| `src/` | The source code. `main.js` is the map and cards. `history.js` is the timeline logic. `park.js` is the 3D generator. `field.js` is the field geometry. `details/` holds the detail module of each ballpark. |
| `build-data.py`, `build-history.py` | Apply corrections and write the data files. `build-history.py` also checks the club count of each league season. |
| `build-geo.mjs`, `build.mjs` | Build the map shapes and the final `index.html`. |
| `briefs/` | The instructions and the data format that the workers used. |

To rebuild after a data change: run `npm install`, then `python3 build-data.py`, `python3 build-history.py`, and `node build.mjs`. Copy `dist/index.html` over `index.html`.

## What the 3D model is

- The field shape uses the five posted outfield distances of each ballpark.
- The outfield wall uses the posted wall heights at left, center, and right.
- The roof type (open, retractable, fixed) and the seat count set the roof and the size of the stands.
- Each ballpark has a detail module (level 3). The generic generator still makes the base of the seating bowl.
- In Truist Park, Yankee Stadium, and Oracle Park, the posted distances and the main wall heights are from sources. The roof outline, the facade line, and the wall corners are measured from a satellite image (accuracy about 5 to 10 ft). Heights, gate positions, and tower positions are estimates. Deck depths and dugout positions are read from the level 2 satellite sheets (accuracy about 3 to 5 ft).

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
