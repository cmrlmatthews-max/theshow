# UI notes: phone layout and audit fixes

## Accepted exception (text color)
Text colors and text opacity stay as they were. Computed styles were compared before and after (desktop 1440, first screen and card, 122 and 195 text runs): no difference.
The one exception is the code on team-color plates (map markers). It uses the higher-contrast of the two inks (#2b2118 or #fbf5e3), computed with the WCAG ratio. No plate color changed.
Measured ratios with the better ink: all 30 clubs pass 4.5:1 except Baltimore Orioles (#df4601, 3.84; dark ink 3.76) and Philadelphia Phillies (#e81828, 4.20; dark ink 3.44). Both fail with either ink and keep their colors, as decided.
Other plates: Miami 5.49 and San Francisco 4.99 use the dark ink; the rest use the light ink (lowest: Boston 5.29, Cardinals 5.36).

## What changed
- Phone layout (up to 900 px wide, iPad portrait): full-screen map, top bar (menu, search), bottom sheet with three detents (peek = year bar, medium, large), drag handle that also cycles, card inside the sheet with a back control, menu drawer (legend, layers, hub link). With a card open the year bar collapses to one 44 px row shared with the back button; tap the year or the arrow button to expand it. iPad landscape and desktop keep three regions.
- Short landscape (height 500 px or less): the sheet is a side panel on the right (46% of the width, 340 to 420 px, safe-area padding), compact year row with slider on top, club list or card below; zoom buttons move to the left; a top-bar button collapses and expands the panel. No detents.
- Search: one combobox for club, ballpark, city and former club (including relocated, defunct and Negro Leagues clubs); `/` focuses it on desktop.
- Sizes: HTML text 12 px minimum; marker codes and names 12 px at every zoom (colliding names hidden); state and country names hidden under 10 px; 44 px touch targets and marker hit areas; nearest marker wins a tap; zoom buttons 44 px plus a whole-map reset.
- Year bar no longer clips at 900 px or below.
- Two-tone focus ring; Enter on a marker moves focus to the card, closing returns it; the 3D view is a dialog (focus trap, Escape, focus return); hidden controls are not tabbable; ARIA names, roles, states; an HTML list alternative for the markers.
- Reduced motion in CSS and JS (d3 and three.js), including live changes.
- URL state (`y`, `c`, `h`, `p`, `l`, `off`, `v=3d`) with `replaceState`; saved state in `localStorage` (`theshow.*`) restored without animation when the URL has none.
- First-paint loader; the 3D view paints a "building" state before the model is built.
- Safe areas, dvh, viewport-fit=cover; page zoom is never blocked.
- Home Screen app: manifest, icons (SVG, 180, 192, 512), theme color, service worker (page and the two shared files cached, works offline).
- Shared library: tokens.css and shell.js are loaded with literal fallbacks and guarded calls; resume and hub link wired.

## What remains
- Low items from the audit are not done.
- Walking in 3D needs W A S D; there is no touch control yet.
- The audit's "could not determine" list is untouched.
- Baltimore and Philadelphia plate contrast (see above).
