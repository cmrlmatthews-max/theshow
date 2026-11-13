# Merges the history worker files, removes duplicate ballparks, checks club counts per season,
# and writes data/history.json and src/history-data.js.
import json, glob, math, re, sys, collections
CUR = {r['id']: r for r in json.load(open('data/stadiums.json'))}
PARK_ALIAS = json.load(open('data/history/park_alias.json')) if glob.glob('data/history/park_alias.json') else {}
FR_ALIAS = json.load(open('data/history/franchise_alias.json')) if glob.glob('data/history/franchise_alias.json') else {}
PATCH = json.load(open('data/history/patches.json')) if glob.glob('data/history/patches.json') else {"drop_teams": [], "park_fix": {}, "team_fix": []}
teams, parks = [], {}
def score(p): return sum(v is not None for v in p['dimensions_ft'].values()) * 3 + sum(v is not None for v in p['wall_ft'].values()) + (p['capacity'] is not None) * 2 + (not p['coord_approx']) * 4 + len(p['notable'])
for f in sorted(glob.glob('data/history/raw/*.json')):
    d = json.load(open(f)); src = f.split('/')[-1][:-5]
    for t in d['teams']:
        t['_src'] = src; t['franchise'] = FR_ALIAS.get(t['franchise'], t['franchise'])
        for h in t['homes']: h['park'] = PARK_ALIAS.get(h['park'], h['park'])
        teams.append(t)
    for p in d['parks']:
        p['id'] = PARK_ALIAS.get(p['id'], p['id'])
        if p['id'] in CUR: continue
        if p['id'] in parks:
            a, b = parks[p['id']], p
            hi, lo = (a, b) if score(a) >= score(b) else (b, a)
            for k in ('lf','lcf','cf','rcf','rf'):
                if hi['dimensions_ft'][k] is None: hi['dimensions_ft'][k] = lo['dimensions_ft'][k]
            for k in ('lf','cf','rf'):
                if hi['wall_ft'][k] is None: hi['wall_ft'][k] = lo['wall_ft'][k]
            for k in ('capacity','architect','surface'):
                if not hi[k]: hi[k] = lo[k]
            hi['aka'] = sorted(set(hi['aka']) | set(lo['aka']) | ({lo['name']} - {hi['name']}))
            hi['sources'] = list(dict.fromkeys(hi['sources'] + lo['sources']))
            hi['notable'] = (hi['notable'] + [n for n in lo['notable'] if n not in hi['notable']])[:3]
            hi['opened'] = min(hi['opened'], lo['opened'])
            cl = [x for x in (hi['closed'], lo['closed']) if x is not None]; hi['closed'] = max(cl) if len(cl) == 2 else (None if None in (a['closed'], b['closed']) and False else (cl[0] if cl else None))
            parks[p['id']] = hi
        else: parks[p['id']] = p
for pid, fix in PATCH.get('park_fix', {}).items():
    if pid in parks: parks[pid].update(fix)
# team de-duplication and patches
seen = {}; out = []
for t in teams:
    key = (t['franchise'], t['league'], t['start'], t['name'])
    if key in seen: continue
    if any(all(t.get(k) == v for k, v in d.items()) for d in PATCH.get('drop_teams', [])): continue
    for fx in PATCH.get('team_fix', []):
        if all(t.get(k) == v for k, v in fx['match'].items()): t.update(fx['set'])
    seen[key] = 1; out.append(t)
teams = sorted(out, key=lambda t: (t['start'], t['league'], t['name']))
# drop parks that no stint uses; check references
used = {h['park'] for t in teams for h in t['homes']}
missing = sorted(u for u in used if u not in parks and u not in CUR)
unused = sorted(set(parks) - used)
for u in unused: del parks[u]
# closed = last season any stint used the park
last = collections.defaultdict(int)
for t in teams:
    for h in t['homes']: last[h['park']] = max(last[h['park']], h['end'])
for pid, p in parks.items():
    if p['closed'] is None or p['closed'] < last[pid]: p['closed'] = last[pid]
# near-duplicate report
def dist(a, b):
    return math.hypot((a['lat'] - b['lat']) * 111000, (a['lon'] - b['lon']) * 111000 * math.cos(math.radians(a['lat'])))
pl = list(parks.values()); near = []
for i in range(len(pl)):
    for j in range(i + 1, len(pl)):
        a, b = pl[i], pl[j]
        if a['coord_approx'] or b['coord_approx']: continue
        if dist(a, b) < 180: near.append((round(dist(a, b)), a['id'], b['id']))
# season counts
MAJ = lambda y: {'AL': 0 if y < 1901 else 8 if y < 1961 else 10 if y < 1969 else 12 if y < 1977 else 14 if y < 2013 else 15,
                 'NL': (8 if y < 1962 else 10 if y < 1969 else 12 if y < 1993 else 14 if y < 1998 else 16 if y < 2013 else 15) if y >= 1900 else None}
bad = []
for y in range(1900, 2027):
    exp = MAJ(y)
    for lg in ('AL', 'NL'):
        n = sum(1 for t in teams if t['league'] == lg and t['start'] <= y <= t['end'])
        if exp[lg] is not None and n != exp[lg]: bad.append((y, lg, n, exp[lg]))
EXP = {'NA': {1871: 9, 1872: 11, 1873: 9, 1874: 8, 1875: 13}, 'NL': {1876: 8, 1877: 6, 1878: 6, 1879: 8, **{y: 8 for y in range(1880, 1892)}, **{y: 12 for y in range(1892, 1900)}},
       'AA': {1882: 6, 1883: 8, 1884: 13, 1885: 8, 1886: 8, 1887: 8, 1888: 8, 1889: 8, 1890: 9, 1891: 9}, 'UA': {1884: 13}, 'PL': {1890: 8}, 'FL': {1914: 8, 1915: 8}}
for lg, yrs in EXP.items():
    for y, e in yrs.items():
        n = sum(1 for t in teams if t['league'] == lg and t['start'] <= y <= t['end'])
        if n != e: bad.append((y, lg, n, e))
for t in teams: t.pop('_src', None)
json.dump({'teams': teams, 'parks': sorted(parks.values(), key=lambda p: p['id'])}, open('data/history.json', 'w'), indent=1, ensure_ascii=False)
open('src/history-data.js', 'w').write('// Generated by build-history.py from data/history/raw/*.json\nexport const HISTORY = ' + json.dumps({'teams': teams, 'parks': sorted(parks.values(), key=lambda p: p['id'])}, ensure_ascii=False) + ';\n')
print(len(teams), 'stints;', len(parks), 'parks;', len({t['franchise'] for t in teams}), 'franchises')
print('missing park records:', missing)
print('unused parks dropped:', unused)
print('near-duplicate parks (m, a, b):'); [print('  ', n) for n in sorted(near)]
print('season count problems (year, league, found, expected):', bad[:40], '...' if len(bad) > 40 else '')
by = collections.Counter(t['league'] for t in teams); print('stints by league:', dict(by))
