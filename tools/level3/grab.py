# Usage: python3 grab.py [--small] ID [ID2]
# Copies the newest 4 (or 8) browser screenshots into refs/<ID>/tile_0..3.jpg (TL, TR, BL, BR), makes the mosaic, writes READY.
# --small: the tiles were requested with size=800,600 (the fallback when size=1024,768 gives "Error: bytes, Code: 500").
#          The browser then shows the image smaller with a dark border; this crops it and scales it back to 800 x 600.
import glob, os, re, shutil, subprocess, sys
from PIL import Image
args = sys.argv[1:]; small = '--small' in args; ids = [a for a in args if a != '--small']; n = 4 * len(ids)
fs = glob.glob('/tmp/claude-tool-results/*/mcp-remote-devices-blob-*.jpg')
key = lambda f: (int(re.search(r'blob-(\d+)-', f).group(1)), os.stat(f).st_mtime_ns)
fs = sorted(fs, key=key)[-n:]
for k, ID in enumerate(ids):
    d = f'/home/claude/refs/{ID}'; os.makedirs(d, exist_ok=True)
    for i in range(4):
        im = Image.open(fs[4 * k + i]).convert('RGB'); assert im.size == (800, 600), fs[4 * k + i]
        if small:
            im = im.crop((87.5, 65.625, 712.5, 534.375)).resize((800, 600), Image.LANCZOS)
        else:
            px = im.getpixel((400, 300)); top = im.crop((0, 0, 800, 40)).getextrema()
            if max(e[1] for e in top) < 60: sys.exit(f'{ID} tile {i} looks like an error page or a dark border')
        im.save(f'{d}/tile_{i}.jpg', quality=93)
    subprocess.run(['python3', '/home/claude/lvl3/mosaic.py', ID], check=True)
    open(f'{d}/READY', 'w').write('ok\n'); print('READY', ID)
