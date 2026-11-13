// History layer logic: year index, franchise chains, relocation geometry. No DOM here.

export const LEAGUE_NAMES = {
  NA: 'National Association', NL: 'National League', AL: 'American League', AA: 'American Association',
  UA: 'Union Association', PL: "Players' League", FL: 'Federal League',
  NNL1: 'Negro National League (1920–31)', ECL: 'Eastern Colored League', ANL: 'American Negro League',
  EWL: 'East-West League', NSL: 'Negro Southern League', NNL2: 'Negro National League (1933–48)', NAL: 'Negro American League',
};
// Order for the roster headings.
export const LEAGUE_ORDER = ['NA', 'NL', 'AL', 'AA', 'UA', 'PL', 'FL', 'NNL1', 'ECL', 'ANL', 'EWL', 'NSL', 'NNL2', 'NAL'];
const NEG = ['NNL1', 'ECL', 'ANL', 'EWL', 'NSL', 'NNL2', 'NAL'];
export const groupOf = (lg) => (NEG.includes(lg) ? 'NEG' : lg);
// Legend switches (one per group).
export const GROUPS = [
  { key: 'NL', name: 'National League', color: '#7a2e2e' },
  { key: 'AL', name: 'American League', color: '#2e4a7a' },
  { key: 'NA', name: 'National Association', color: '#6b5b3e' },
  { key: 'AA', name: 'American Association', color: '#4a6b3a' },
  { key: 'UA', name: 'Union Association', color: '#7a5a2e' },
  { key: 'PL', name: "Players' League", color: '#5a3e6b' },
  { key: 'FL', name: 'Federal League', color: '#2e6b6b' },
  { key: 'NEG', name: 'Negro Leagues', color: '#3a3a3a', ring: '#c9a227' },
];
export const GROUP_BY_KEY = Object.fromEntries(GROUPS.map((g) => [g.key, g]));
const PAPER_EDGE = '#d9cfb4';
const finite = (n) => typeof n === 'number' && Number.isFinite(n);

// Adapt a Phase 1 stadium record to the park schema.
function parkFromStadium(s) {
  return {
    id: s.id, name: s.stadium, aka: s.former_names || [], city: s.city, state: s.state, country: s.country,
    lat: s.lat, lon: s.lon, coord_approx: false, opened: s.opened, closed: null,
    status: 'Still in use as a major-league ballpark.', capacity: s.capacity,
    dimensions_ft: s.dimensions_ft, wall_ft: s.wall_ft, surface: s.surface, roof: s.roof, architect: s.architect,
    notable: s.notable || [], sources: s.sources || [], current: true,
  };
}

export function createHistory(data, stadiums) {
  const teams = Array.isArray(data && data.teams) ? data.teams : [];
  const parkList = Array.isArray(data && data.parks) ? data.parks : [];
  const stadById = new Map(stadiums.map((s) => [s.id, s]));
  const parkById = new Map();
  for (const p of parkList) if (p && p.id != null) parkById.set(p.id, p);
  const adapted = new Map();
  const warned = new Set();

  function park(id) {
    if (parkById.has(id)) return parkById.get(id);
    if (stadById.has(id)) {
      if (!adapted.has(id)) adapted.set(id, parkFromStadium(stadById.get(id)));
      return adapted.get(id);
    }
    return null;
  }
  const locatable = (p) => !!p && finite(p.lat) && finite(p.lon);

  // Stints with resolved homes. A home whose park is unknown is skipped, with one warning per park id.
  const stints = teams.map((t, idx) => {
    const homes = [];
    for (const h of Array.isArray(t.homes) ? t.homes : []) {
      const p = park(h.park);
      if (!locatable(p)) {
        if (!warned.has(h.park)) { warned.add(h.park); console.warn(`history: home park "${h.park}" is not in HISTORY.parks or STADIUMS; skipped.`); }
        continue;
      }
      homes.push({ park: p, start: finite(h.start) ? h.start : t.start, end: finite(h.end) ? h.end : t.end });
    }
    homes.sort((a, b) => a.start - b.start);
    const group = groupOf(t.league);
    const phase1 = stadById.get(t.franchise);
    const gd = GROUP_BY_KEY[group];
    let c1, c2, ring = null;
    if (phase1) { c1 = phase1.colors[0]; c2 = phase1.colors[1].toUpperCase() === '#FFFFFF' ? PAPER_EDGE : phase1.colors[1]; }
    else { c1 = gd ? gd.color : '#6b5b3e'; c2 = (gd && gd.ring) || PAPER_EDGE; ring = (gd && gd.ring) || null; }
    return Object.assign({}, t, { idx, homes, group, colors: [c1, c2], ring, leagueName: LEAGUE_NAMES[t.league] || t.league });
  });

  const byFranchise = new Map();
  for (const s of stints) { if (!byFranchise.has(s.franchise)) byFranchise.set(s.franchise, []); byFranchise.get(s.franchise).push(s); }
  for (const l of byFranchise.values()) l.sort((a, b) => a.start - b.start || a.end - b.end);

  const byYear = new Map();
  function activeIn(year) {
    if (!byYear.has(year)) byYear.set(year, stints.filter((s) => s.start <= year && year <= s.end));
    return byYear.get(year);
  }

  // The home park of a stint in a given year (falls back to the nearest listed home when the list has a gap).
  function homeFor(s, year) {
    if (!s.homes.length) return null;
    let h = s.homes.find((x) => x.start <= year && year <= x.end);
    if (!h) {
      const gap = (x) => (year < x.start ? x.start - year : year - x.end);
      h = s.homes.reduce((best, x) => (!best || gap(x) < gap(best) ? x : best), null);
    }
    return { park: h.park, home: h };
  }

  const chain = (f) => byFranchise.get(f) || [];

  // City changes of every franchise: from the last park of one stint to the first park of the next.
  const relocs = [];
  const movesBy = new Map();
  for (const [f, list] of byFranchise) {
    const mv = [];
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1], b = list[i];
      if (!a.homes.length || !b.homes.length) continue;
      const pa = a.homes[a.homes.length - 1].park, pb = b.homes[0].park;
      if ((a.city || '') === (b.city || '') && (a.state || '') === (b.state || '')) continue;
      mv.push({ franchise: f, year: b.start, from: pa, to: pb, fromStint: a, toStint: b });
    }
    movesBy.set(f, mv); relocs.push(...mv);
  }

  function franchiseParks(f) {
    const seen = new Map();
    for (const s of chain(f)) for (const h of s.homes) seen.set(h.park.id, h.park);
    return [...seen.values()];
  }

  function parkUsers(id) {
    const out = [];
    for (const s of stints) for (const h of s.homes) if (h.park.id === id) out.push({ stint: s, start: Math.max(h.start, s.start), end: Math.min(h.end, s.end) });
    return out.sort((a, b) => a.start - b.start || a.stint.idx - b.stint.idx);
  }

  const allParks = parkList.filter(locatable);

  return { stints, park, activeIn, homeFor, chain, relocations: () => relocs, franchiseRelocations: (f) => movesBy.get(f) || [], franchiseParks, parkUsers, allParks, stadById };
}

// Curved line between two screen points. Returns the SVG path (trimmed at both ends so the arrowhead is visible),
// the label anchor, and nothing else. The curve bows to the left of the direction of travel.
export function curve(a, b, trimA = 4, trimB = 8, bow = 0.2) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
  const c = [(a[0] + b[0]) / 2 + dy * bow, (a[1] + b[1]) / 2 - dx * bow];
  const unit = (p, q) => { const x = q[0] - p[0], y = q[1] - p[1], l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  const ua = unit(a, c), ub = unit(c, b);
  const a2 = d > trimA + trimB + 6 ? [a[0] + ua[0] * trimA, a[1] + ua[1] * trimA] : a;
  const b2 = d > trimA + trimB + 6 ? [b[0] - ub[0] * trimB, b[1] - ub[1] * trimB] : b;
  const mid = [0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0], 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1]];
  return { d: `M${a2[0].toFixed(1)},${a2[1].toFixed(1)}Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b2[0].toFixed(1)},${b2[1].toFixed(1)}`, mid };
}
