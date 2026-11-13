import json, sys, re
CUR = ['BAL', 'BOS', 'NYY', 'TBR', 'TOR', 'CWS', 'CLE', 'DET', 'KC', 'MIN', 'ATH', 'HOU', 'LAA', 'SEA', 'TEX', 'ATL', 'MIA', 'NYM', 'PHI', 'WSH', 'CHC', 'CIN', 'MIL', 'PIT', 'STL', 'ARI', 'COL', 'LAD', 'SD', 'SF']
LEAGUES = {"NA","NL","AL","AA","UA","PL","FL","NNL1","ECL","ANL","EWL","NSL","NNL2","NAL"}
TK = {"franchise","name","abbr","city","state","country","league","start","end","homes","fate","note","sources"}
PK = {"id","name","aka","city","state","country","lat","lon","coord_approx","opened","closed","status","capacity","dimensions_ft","wall_ft","surface","roof","architect","notable","sources"}
d = json.load(open(sys.argv[1])); errs = []
parks = {p.get("id") for p in d.get("parks", [])}
for p in d.get("parks", []):
    i = p.get("id")
    if set(p) != PK: errs.append(f"park {i}: keys differ {sorted(set(p) ^ PK)}")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", str(i)): errs.append(f"park {i}: bad id slug")
    if i in CUR: errs.append(f"park {i}: do not write records for current ballparks")
    if not isinstance(p.get("lat"), (int, float)) or not isinstance(p.get("lon"), (int, float)): errs.append(f"park {i}: lat/lon required")
    elif not (17 < p["lat"] < 55 and -130 < p["lon"] < -60): errs.append(f"park {i}: lat/lon outside North America")
    if p.get("roof") not in ("open", "retractable", "fixed"): errs.append(f"park {i}: roof")
    for k in ("dimensions_ft", "wall_ft"):
        if not isinstance(p.get(k), dict): errs.append(f"park {i}: {k} must be an object")
    if isinstance(p.get("dimensions_ft"), dict) and set(p["dimensions_ft"]) != {"lf","lcf","cf","rcf","rf"}: errs.append(f"park {i}: dimensions_ft keys")
    if isinstance(p.get("wall_ft"), dict) and set(p["wall_ft"]) != {"lf","cf","rf"}: errs.append(f"park {i}: wall_ft keys")
    if not isinstance(p.get("opened"), int): errs.append(f"park {i}: opened must be a year")
for t in d.get("teams", []):
    n = f"{t.get('name')} {t.get('start')}"
    if set(t) != TK: errs.append(f"team {n}: keys differ {sorted(set(t) ^ TK)}")
    if t.get("league") not in LEAGUES: errs.append(f"team {n}: league {t.get('league')}")
    if not (isinstance(t.get("start"), int) and isinstance(t.get("end"), int) and 1871 <= t["start"] <= t["end"] <= 2026): errs.append(f"team {n}: start/end")
    if not re.fullmatch(r"[A-Z]{2,3}", str(t.get("abbr"))): errs.append(f"team {n}: abbr")
    f = t.get("franchise")
    if f not in CUR and not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", str(f)): errs.append(f"team {n}: franchise slug")
    hs = t.get("homes") or []
    if not hs: errs.append(f"team {n}: homes is empty")
    for h in hs:
        if h.get("park") not in parks and h.get("park") not in CUR: errs.append(f"team {n}: home park {h.get('park')} has no park record")
        if not (isinstance(h.get("start"), int) and isinstance(h.get("end"), int)): errs.append(f"team {n}: home years")
    if hs and isinstance(t.get("start"), int) and all(isinstance(h.get("start"), int) for h in hs):
        if min(h["start"] for h in hs) > t["start"] or max(h["end"] for h in hs) < t["end"]: errs.append(f"team {n}: homes do not cover the stint years")
print(f"{len(d.get('teams', []))} teams, {len(d.get('parks', []))} parks")
print("\n".join(errs) if errs else "OK")
