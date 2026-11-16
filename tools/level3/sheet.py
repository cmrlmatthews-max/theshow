# Usage: python3 sheet.py <ID> <homeX> <homeY> <secondX> <secondY>
# Pixel positions are in /home/claude/refs/<ID>/mosaic.png (home plate tip, and second base).
# Writes survey.png (grid) and survey_plain.png: model coordinates, home plate at the origin, center field up,
# right field to the right. 1.1 px per foot. x from -560 to +560 ft, z from -620 (top) to +300 ft (bottom).
import sys, math
from PIL import Image, ImageDraw, ImageFont
ID = sys.argv[1]; hx, hy, sx, sy = map(float, sys.argv[2:6])
FT = 0.9022; S = 1.1; X0, Z0 = -560, -620; W, H = int(1120 * S), int(920 * S)
ux, uy = sx - hx, sy - hy; l = math.hypot(ux, uy); ux, uy = ux / l, uy / l   # toward center field (image)
rx, ry = -uy, ux                                                            # toward right field (image)
src = Image.open(f'/home/claude/refs/{ID}/mosaic.png')
a = rx / (S * FT); b = -ux / (S * FT); c = hx + (X0 * rx - Z0 * ux) / FT
d = ry / (S * FT); e = -uy / (S * FT); f = hy + (X0 * ry - Z0 * uy) / FT
img = src.transform((W, H), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BICUBIC, fillcolor=(40, 40, 40))
img.save(f'/home/claude/refs/{ID}/survey_plain.png')
g = ImageDraw.Draw(img, 'RGBA')
P = lambda x, z: ((x - X0) * S, (z - Z0) * S)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
except Exception: font = ImageFont.load_default()
for x in range(-550, 551, 50):
    g.line([P(x, Z0), P(x, 300)], fill=(255, 255, 255, 110 if x % 100 == 0 else 50), width=1)
for z in range(-600, 301, 50):
    g.line([P(X0, z), P(560, z)], fill=(255, 255, 255, 110 if z % 100 == 0 else 50), width=1)
for x in range(-500, 501, 100):
    for z in range(-600, 301, 100):
        px, py = P(x, z); g.text((px + 2, py + 1), f'{x},{z}', fill=(255, 230, 60, 230), font=font)
for r in range(100, 701, 100):
    cx, cy = P(0, 0); g.ellipse([cx - r * S, cy - r * S, cx + r * S, cy + r * S], outline=(255, 60, 60, 170), width=1)
cx, cy = P(0, 0); g.line([P(0, 0), P(0, -650)], fill=(255, 60, 60, 120)); g.line([P(0, 0), P(-470, -470)], fill=(255, 60, 60, 90)); g.line([P(0, 0), P(470, -470)], fill=(255, 60, 60, 90))
img.save(f'/home/claude/refs/{ID}/survey.png'); print('ok', W, H)
