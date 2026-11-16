# Brief: capture satellite tiles for 26 ballparks

You start with no context. This file is the complete instruction.

## Goal

For each ballpark ID in the list below, save four satellite image tiles and join them into one mosaic. Other workers use the mosaics to model the ballparks in 3D. You do not model anything.

IDs, in this order:
BOS TBR TOR CWS CLE DET KC MIN ATH HOU LAA SEA TEX MIA NYM PHI WSH CHC CIN MIL PIT STL ARI COL LAD SD

(BAL, ATL, NYY, and SF are already done. Do not do them.)

## Inputs

- `/home/claude/lvl3/tiles.json`: for each ID, `name` and `tiles` (four URLs, in the order TL, TR, BL, BR). Each URL is an Esri World Imagery export image (1024 x 768).
- The built-in browser tools `mcp__remote-devices__Claude_Browser__*`. Load them with ToolSearch: query `select:mcp__remote-devices__Claude_Browser__browser_batch,mcp__remote-devices__Claude_Browser__tabs_context`.
- The shell cannot reach these URLs. Only the browser can.

## Steps for each ID

1. Read the four URLs for the ID from `tiles.json` (one `python3 -c` command can print them).
2. Call `browser_batch` one time with eight actions: `navigate` (URL 1), `computer` screenshot, `navigate` (URL 2), screenshot, `navigate` (URL 3), screenshot, `navigate` (URL 4), screenshot. Example item: `{"name":"navigate","input":{"url":"<URL>"}}` and `{"name":"computer","input":{"action":"screenshot"}}`.
3. Each screenshot result includes a line `[Image source: /tmp/claude-tool-results/.../<name>.jpg]`. Copy the four files, in order, to `/home/claude/refs/<ID>/tile_0.jpg` ... `tile_3.jpg` (make the folder first).
4. Run `python3 /home/claude/lvl3/mosaic.py <ID>`.
5. Look at the four screenshots that the batch returned. The whole ballpark (the field, the stands, and the outer wall of the building) must be inside the 2 x 2 area.
   - If a part of the building is cut off at an edge, run `python3 /home/claude/lvl3/retile.py <ID> <east_m> <north_m>` with a shift toward the cut-off side (for example `60 0` moves the area 60 m east). It prints four new URLs. Repeat steps 2 to 4 with them. Do this at most one time for each park.
6. Write the file `/home/claude/refs/<ID>/READY` with one line: `ok`, or `cut: <side>` if the building is still cut off.

## Rules

- Do one `browser_batch` call for each park (plus at most one retry). Do not take extra screenshots.
- Do not open any other website.
- Write READY only after `mosaic.png` exists. Other workers wait for READY.
- If the browser stops working (connection errors two times in a row), stop and report which IDs are done.

## Final reply (fixed format)

```
DONE: <IDs with READY ok>
CUT: <IDs with READY cut, and the side>
FAILED: <IDs not done, and why>
```
