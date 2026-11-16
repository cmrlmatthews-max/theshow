# Usage: python3 retile.py <ID> <east_m> <north_m>   prints 4 tile URLs (TL, TR, BL, BR) with the center moved
# east_m meters east and north_m meters north (negative values = west / south). Use it when the park is cut off.
import json, math, sys
R = 6378137; WG = 220.0
d = {s['id']: s for s in json.load(open('/home/claude/theshow/data/stadiums.json'))}
s = d[sys.argv[1]]; e, n = float(sys.argv[2]), float(sys.argv[3])
k = 1 / math.cos(math.radians(s['lat']))
cx = R * math.radians(s['lon']) + e * k; cy = R * math.log(math.tan(math.pi / 4 + math.radians(s['lat']) / 2)) + n * k
wm = WG * k; hm = wm * 0.75
for (x0, y0) in [(cx - wm, cy), (cx, cy), (cx - wm, cy - hm), (cx, cy - hm)]:
    print(f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox={x0:.0f},{y0:.0f},{x0+wm:.0f},{y0+hm:.0f}&bboxSR=3857&imageSR=3857&size=1024,768&format=jpg&f=image")
