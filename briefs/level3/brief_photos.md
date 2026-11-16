# Brief: capture reference photographs of ballparks

You start with no context. This file and the short task text (your list of ballpark IDs) are the complete instruction.

## Goal

For each ballpark in your list, save 6 to 8 photographs from Wikimedia Commons, so that a modeling worker can read the facade, the roof structure, the heights, the seating bowl, and the scoreboards. You do not model anything.

## Tools

- The built-in browser. Load its tools with ToolSearch, query `select:mcp__remote-devices__Claude_Browser__browser_batch,mcp__remote-devices__Claude_Browser__tabs_create,mcp__remote-devices__Claude_Browser__get_page_text,mcp__remote-devices__Claude_Browser__javascript_tool`.
- Other workers use the same browser at the same time. First call `tabs_create` one time and keep the returned `tabId`. Put that `tabId` in the input of EVERY browser action (navigate, computer, get_page_text, javascript_tool). Never act on another tab. Never close tabs.
- The shell cannot reach the web. Only the browser can.

## Steps for each ballpark

1. Open the Commons category of the park, for example `https://commons.wikimedia.org/wiki/Category:Fenway_Park`. If the name is wrong, use the Commons search page in your tab. Look in useful subcategories (exterior, interior, by year).
2. List file names with `get_page_text` or `javascript_tool` (for example, collect the `title` of links that start with `File:`). Read a few file description pages if you need the date or the view.
3. Pick 6 to 8 photographs. Prefer recent photographs (the park as it is now), daylight, wide and sharp views. Cover these views, one photograph each where possible:
   1. The main facade or main gate, from the street.
   2. Another exterior side (a different facade, a corner, or a gate).
   3. Inside, a wide view from high behind home plate (both sides of the seating bowl).
   4. Inside, a view from the outfield toward home plate (the roof or canopy, the press level).
   5. The first-base side stands, and 6. the third-base side stands (deck tiers, how deep each side is, where each deck ends).
   7. The scoreboard or main video board, with its structure.
   8. The roof underside, a light tower, or a light bank, close enough to see the structure.
   Skip a view if Commons has no good photograph of it. Do not take photographs of people as the subject.
4. For each photograph, navigate your tab to `https://commons.wikimedia.org/wiki/Special:FilePath/<File_name>?width=1024` and take a full screenshot (`computer`, action `screenshot`, no `scale`). Use one `browser_batch` call for several photographs (navigate, screenshot, navigate, screenshot ...).
5. Each screenshot result has a line `[Image source: /tmp/claude-tool-results/.../<name>.jpg]`. Copy THAT exact file (not the newest file in the folder; other workers write there too) to `/home/claude/refs/<ID>/photoN_<short_description>.jpg`, for example `photo3_inside_from_upper_deck_behind_home.jpg`. Number the photographs from 1. The ballparks ATL, NYY, and SF already have photographs; you do not have them in your list.
6. Write `/home/claude/refs/<ID>/PHOTOS.md`: one line for each photograph with the file name, what it shows (view direction, which side), the year if known, and the Commons file name.
7. Write `/home/claude/refs/<ID>/PHOTOS_READY` with one line: `ok <count>`. A modeling worker waits for this file. Do this park by park, in the order of your list, so that the first park is ready early.

## Rules

- Open only commons.wikimedia.org and upload.wikimedia.org pages.
- If a photograph fails to load, skip it.
- If the browser stops working (connection errors two times in a row), write PHOTOS_READY with `none` for the remaining parks, and stop.

## Final reply (fixed format)

```
DONE: <ID count, ...>
PARTIAL: <IDs with fewer than 5 photographs, and why>
FAILED: <IDs with no photographs, and why>
```
