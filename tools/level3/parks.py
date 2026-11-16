# Tile plan for each park: 2 x 2 Esri tiles, each 220 m of ground wide (3:4), centered on the park record.
import json, math, sys
R = 6378137; WG = 220.0
d = json.load(open('/home/claude/theshow/data/stadiums.json'))
out = {}
for s in d:
    lat, lon = s['lat'], s['lon']
    cx = R * math.radians(lon); cy = R * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
    wm = WG / math.cos(math.radians(lat)); hm = wm * 0.75
    tiles = []
    for (x0, y0) in [(cx - wm, cy), (cx, cy), (cx - wm, cy - hm), (cx, cy - hm)]:   # TL, TR, BL, BR
        tiles.append(f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox={x0:.0f},{y0:.0f},{x0+wm:.0f},{y0+hm:.0f}&bboxSR=3857&imageSR=3857&size=1024,768&format=jpg&f=image")
    out[s['id']] = {'name': s['stadium'], 'tiles': tiles}
json.dump(out, open('/home/claude/lvl3/tiles.json', 'w'), indent=1)
print(len(out))
