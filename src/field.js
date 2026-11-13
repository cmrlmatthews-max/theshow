// Shared field geometry. Units are feet. Home plate is the origin.
// Angle "deg" runs from -45 (left-field line) through 0 (center field) to +45 (right-field line).
export const D2R = Math.PI / 180;

export function fieldSpec(rec, wallPoly) {
  const d = rec.dimensions_ft, w = rec.wall_ft || {};
  const lcf = d.lcf ?? Math.round(((d.lf + d.cf) / 2) * 1.03);
  const rcf = d.rcf ?? Math.round(((d.rf + d.cf) / 2) * 1.03);
  const spec = { r: [d.lf, lcf, d.cf, rcf, d.rf], h: [w.lf ?? 8, w.cf ?? 8, w.rf ?? 8] };
  // Optional surveyed wall: [{deg, r, h}] corner points from the left-field pole (-45) to the right-field pole (+45).
  // Walls run straight between corners. Repeat a corner with a slightly larger deg to make a height step.
  if (wallPoly && wallPoly.length >= 2) {
    spec.poly = wallPoly.map((p) => ({ deg: p.deg, r: p.r, h: p.h, x: p.r * Math.sin(p.deg * D2R), z: -p.r * Math.cos(p.deg * D2R) })).sort((a, b) => a.deg - b.deg);
  }
  return spec;
}

function polySeg(spec, deg) {
  const P = spec.poly; let i = 0;
  while (i < P.length - 2 && P[i + 1].deg <= deg) i++;
  return [P[i], P[i + 1]];
}

// Wall distance from home plate at an angle: Catmull-Rom curve through the five posted distances,
// or straight segments between surveyed corners when spec.poly exists.
export function wallR(spec, deg) {
  if (spec.poly) {
    const [A, B] = polySeg(spec, deg), a = deg * D2R, dx = Math.sin(a), dz = -Math.cos(a);
    const ex = B.x - A.x, ez = B.z - A.z, den = dx * ez - dz * ex;
    if (Math.abs(den) < 1e-6 || B.deg - A.deg < 1e-6) return deg <= A.deg ? A.r : B.r;
    return (A.x * ez - A.z * ex) / den;
  }
  const t = Math.min(3.9999, Math.max(0, (deg + 45) / 22.5));
  const i = Math.floor(t), u = t - i, p = spec.r;
  const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(4, i + 2)];
  const u2 = u * u, u3 = u2 * u;
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (3 * p1 - p0 - 3 * p2 + p3) * u3);
}

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Wall height at an angle: left, center and right heights with short blends between them.
export function wallH(spec, deg) {
  if (spec.poly) {
    const [A, B] = polySeg(spec, deg), span = B.deg - A.deg;
    const t = span < 1e-6 ? (deg <= A.deg ? 0 : 1) : Math.min(1, Math.max(0, (deg - A.deg) / span));
    return A.h + (B.h - A.h) * t;
  }
  const h = spec.h;
  return deg < 0 ? h[0] + (h[1] - h[0]) * smooth(-30, -18, deg) : h[1] + (h[2] - h[1]) * smooth(18, 30, deg);
}

export function wallXZ(spec, deg) {
  const r = wallR(spec, deg), a = deg * D2R;
  return [r * Math.sin(a), -r * Math.cos(a)];
}

// Small plan drawing of the field for the stadium card.
export function fieldDiagramSVG(rec, ink = '#4a3a28', wallPoly = null) {
  const spec = fieldSpec(rec, wallPoly);
  const pts = [];
  for (let d = -45; d <= 45; d += 1.5) pts.push(wallXZ(spec, d));
  const maxR = Math.max(...spec.r);
  const pad = 46, W = 2 * maxR * Math.SQRT1_2 + pad * 2, H = maxR + pad + 34;
  const X = (x) => (x + W / 2).toFixed(1), Y = (z) => (z + maxR + pad).toFixed(1);
  const wall = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]) + ' ' + Y(p[1])).join(' ');
  const fair = `M${X(0)} ${Y(0)} L${X(pts[0][0])} ${Y(pts[0][1])} ${wall.slice(wall.indexOf('L'))} Z`;
  const b = 63.64;
  const labels = [-45, -22.5, 0, 22.5, 45].map((deg, i) => {
    const posted = [rec.dimensions_ft.lf, rec.dimensions_ft.lcf, rec.dimensions_ft.cf, rec.dimensions_ft.rcf, rec.dimensions_ft.rf][i];
    if (posted == null) return '';
    const r = spec.r[i] + 22, a = deg * D2R;
    return `<text x="${X(r * Math.sin(a))}" y="${Y(-r * Math.cos(a) + 6)}" text-anchor="middle" class="fd-num">${posted}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" class="field-diagram" role="img" aria-label="Field plan with outfield distances in feet">
    <path d="${fair}" fill="#a9b98a" stroke="none"/>
    <circle cx="${X(0)}" cy="${Y(-60.5)}" r="95" fill="#c9a37a" clip-path="url(#fdclip-${rec.id})"/>
    <clipPath id="fdclip-${rec.id}"><path d="M${X(0)} ${Y(10)} L${X(300)} ${Y(-290)} L${X(-300)} ${Y(-290)} Z"/></clipPath>
    <path d="M${X(0)} ${Y(-5)} L${X(b - 5)} ${Y(-b)} L${X(0)} ${Y(-2 * b + 5)} L${X(-b + 5)} ${Y(-b)} Z" fill="#a9b98a"/>
    <circle cx="${X(0)}" cy="${Y(-59)}" r="9" fill="#c9a37a"/>
    <path d="${wall}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M${X(pts[0][0])} ${Y(pts[0][1])} L${X(0)} ${Y(0)} L${X(pts[pts.length - 1][0])} ${Y(pts[pts.length - 1][1])}" fill="none" stroke="${ink}" stroke-width="2.5"/>
    ${[[b, -b], [0, -2 * b], [-b, -b], [0, 0]].map(([x, z]) => `<rect x="${X(x - 4)}" y="${Y(z - 4)}" width="8" height="8" fill="#fff" stroke="${ink}" stroke-width="1.5" transform="rotate(45 ${X(x)} ${Y(z)})"/>`).join('')}
    ${labels}
  </svg>`;
}
