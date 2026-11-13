# Brief: history data for "The Show" (a personal baseball map project)

Today's date is 2026-11-12. You collect fact data. You start with no context; this file is the complete instruction.

## Goal

For the group of clubs named in your task, record:
1. every **team stint** (a period in which a club kept one name, one city, and one league), and
2. every **home ballpark** those stints used.

Write ONE JSON file (path given in your task) with this shape: `{"teams": [...], "parks": [...]}`.

## How to research

- Use WebSearch and WebFetch. Shell commands cannot reach the web.
- Good sources: Wikipedia club pages and ballpark pages (the infobox has coordinates, capacity, and field dimensions), Wikipedia "List of former Major League Baseball stadiums", Wikipedia city lists such as "List of baseball parks in Boston", Seamheads ballparks database, Seamheads Negro Leagues database, Baseball-Reference Bullpen, Retrosheet, SABR.
- Do not answer from memory alone. Use null for a value you cannot find. Do not guess numbers.
- Work fast: at most two fetches per ballpark. A thin record with nulls is better than a slow record.
- Only principal home ballparks. Skip neutral-site games, one-day venues, and Sunday-only parks unless the club used them for a full season.

## Team stint record (exact keys)

```json
{
  "franchise": "ATL",
  "name": "Boston Beaneaters",
  "abbr": "BSN",
  "city": "Boston",
  "state": "Massachusetts",
  "country": "USA",
  "league": "NL",
  "start": 1883,
  "end": 1906,
  "homes": [{"park": "south-end-grounds", "start": 1883, "end": 1906}],
  "fate": "Renamed Boston Doves for 1907.",
  "note": "",
  "sources": ["https://..."]
}
```

- `franchise`: for a club that is an ancestor of a current MLB franchise, use the current id from the table below (example: Boston Beaneaters -> "ATL", Brooklyn Robins -> "LAD", Montreal Expos -> "WSH", Seattle Pilots -> "MIL"). For every other club use a lowercase slug of its best-known name with hyphens (examples: "kansas-city-monarchs", "homestead-grays", "louisville-colonels", "providence-grays"). The same club in two leagues keeps the same slug.
- Start a new stint when the name, the city, or the league changes. `start` and `end` are season years, inclusive. Use 2026 as `end` for a current club.
- `abbr`: 2 or 3 capital letters (Retrosheet / Baseball-Reference style if one exists).
- `league`: exactly one of `NA` (National Association 1871-75), `NL`, `AL`, `AA` (American Association 1882-91), `UA` (Union Association 1884), `PL` (Players' League 1890), `FL` (Federal League 1914-15), `NNL1` (Negro National League 1920-31), `ECL` (Eastern Colored League 1923-28), `ANL` (American Negro League 1929), `EWL` (East-West League 1932), `NSL` (Negro Southern League 1932), `NNL2` (Negro National League 1933-48), `NAL` (Negro American League 1937-48).
- `homes`: principal home ballpark for each season range inside the stint, in time order, no gaps. `park` is a park id (see below).
- `fate`: one sentence, 20 words or fewer, on what happened at the end of the stint (renamed, moved to X, folded, joined league Y, still active).
- `note`: optional, 25 words or fewer, your own words. Use "" if none.

## Park record (exact keys)

```json
{
  "id": "south-end-grounds",
  "name": "South End Grounds",
  "aka": ["Walpole Street Grounds"],
  "city": "Boston",
  "state": "Massachusetts",
  "country": "USA",
  "lat": 42.3375,
  "lon": -71.0872,
  "coord_approx": false,
  "opened": 1871,
  "closed": 1914,
  "status": "Demolished in 1914. A rail station stands on the site.",
  "capacity": 11000,
  "dimensions_ft": {"lf": 250, "lcf": null, "cf": 450, "rcf": null, "rf": 255},
  "wall_ft": {"lf": null, "cf": null, "rf": null},
  "surface": "Grass",
  "roof": "open",
  "architect": "",
  "notable": ["...", "..."],
  "sources": ["https://..."]
}
```

- `id`: lowercase slug of the usual Wikipedia article title, hyphens only, no punctuation, no parentheses (examples: "polo-grounds", "sportsmans-park", "shibe-park", "ebbets-field", "griffith-stadium", "forbes-field", "yankee-stadium-1923", "league-park", "rickwood-field").
- **Current ballparks:** the 30 ballparks in the table below already have records. When a stint used one of them, put the table id (example: "LAD" for Dodger Stadium, also for the 1962-65 Angels) in `homes[].park` and do NOT write a park record for it.
- `lat`, `lon`: decimal degrees, 4 decimals, required. If no source gives the site, use the city center and set `coord_approx` to true.
- `opened`: year the park opened. `closed`: last season a major-league or Negro-league club used it as a home; null if still used that way.
- `status`: one sentence, 20 words or fewer: what stands there now, or that the park still stands.
- `capacity`: peak or typical baseball capacity as an integer, or null.
- `dimensions_ft`: outfield distances in feet (left line, left-center, center, right-center, right line) for a typical season; null for each value not found.
- `wall_ft`: outfield wall heights in feet; null if not found.
- `roof`: exactly "open", "retractable", or "fixed".
- `notable`: 2 or 3 facts about the park, each 20 words or fewer, in your own words, no quotations.
- If a club's home park is not recorded anywhere, write a park with id "<city-slug>-unknown-grounds", name "Home grounds not recorded", city-center coordinates, and `coord_approx` true.

## Current franchises and ballparks (do not write park records for these)

| id | Club | Ballpark |
|---|---|---|
| BAL | Baltimore Orioles | Oriole Park at Camden Yards |
| BOS | Boston Red Sox | Fenway Park |
| NYY | New York Yankees | Yankee Stadium |
| TBR | Tampa Bay Rays | Tropicana Field |
| TOR | Toronto Blue Jays | Rogers Centre |
| CWS | Chicago White Sox | Rate Field |
| CLE | Cleveland Guardians | Progressive Field |
| DET | Detroit Tigers | Comerica Park |
| KC | Kansas City Royals | Kauffman Stadium |
| MIN | Minnesota Twins | Target Field |
| ATH | Athletics | Sutter Health Park |
| HOU | Houston Astros | Daikin Park |
| LAA | Los Angeles Angels | Angel Stadium |
| SEA | Seattle Mariners | T-Mobile Park |
| TEX | Texas Rangers | Globe Life Field |
| ATL | Atlanta Braves | Truist Park |
| MIA | Miami Marlins | loanDepot park |
| NYM | New York Mets | Citi Field |
| PHI | Philadelphia Phillies | Citizens Bank Park |
| WSH | Washington Nationals | Nationals Park |
| CHC | Chicago Cubs | Wrigley Field |
| CIN | Cincinnati Reds | Great American Ball Park |
| MIL | Milwaukee Brewers | American Family Field |
| PIT | Pittsburgh Pirates | PNC Park |
| STL | St. Louis Cardinals | Busch Stadium |
| ARI | Arizona Diamondbacks | Chase Field |
| COL | Colorado Rockies | Coors Field |
| LAD | Los Angeles Dodgers | Dodger Stadium |
| SD | San Diego Padres | Petco Park |
| SF | San Francisco Giants | Oracle Park |

## Rules for the file

- Real JSON only: no comments, no trailing commas.
- Every `homes[].park` must be either a table id above or the `id` of a park in your `parks` list.
- After you write the file, run `python3 /home/claude/theshow/briefs/validate_history.py <your file>` and correct every error it prints.
- Final reply: 6 lines or fewer. Give the count of teams and parks, then list only values you could not verify or where sources disagreed.
