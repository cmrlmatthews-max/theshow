# Usage: python3 mosaic.py <ID>   joins /home/claude/refs/<ID>/tile_0..3.jpg (TL, TR, BL, BR; each 800x600) into mosaic.png (1600x1200).
# Scale of the mosaic: 0.9022 ft per pixel (220 m of ground per 800 px). North is up.
import sys
from PIL import Image
ID = sys.argv[1]; base = f'/home/claude/refs/{ID}/'
m = Image.new('RGB', (1600, 1200))
for i, (x, y) in enumerate([(0, 0), (800, 0), (0, 600), (800, 600)]):
    t = Image.open(base + f'tile_{i}.jpg').convert('RGB')
    if t.size != (800, 600): t = t.resize((800, 600))
    m.paste(t, (x, y))
m.save(base + 'mosaic.png'); print('ok', base + 'mosaic.png')
