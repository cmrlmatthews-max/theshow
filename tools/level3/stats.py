# Usage (from your working copy): python3 /home/claude/lvl3/qlock.py python3 /home/claude/lvl3/stats.py <ID>
# Loads the park at desktop size and at phone size (touch, 390 x 844). Prints draw calls and triangles for each,
# the time to build the park, and any page errors.
import asyncio, os, sys
from playwright.async_api import async_playwright
ID = sys.argv[1]
JS = """(id)=>{const t0=performance.now();window.__show.openPark(window.__show.byId.get(id));const p=window.__show.park;const ms=performance.now()-t0;
for(const v of Object.keys(p.views)){p.setView(v,true);p.frame();} p.setView('aerial',true); p.frame();
let tri=0,calls=0;p.group.traverse(o=>{if(!o.isMesh||!o.visible)return;let n=o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3;
const groups=o.geometry.groups&&o.geometry.groups.length?o.geometry.groups.length:1;calls+=groups;tri+=n*(o.isInstancedMesh?o.count:1);});
return {calls,tri:Math.round(tri),buildMs:Math.round(ms),lod:p.lod||'n/a'}}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox'])
        for name, vp, mob in [('desktop', {'width':1280,'height':800}, False), ('phone', {'width':390,'height':844}, True)]:
            ctx = await b.new_context(viewport=vp, is_mobile=mob, has_touch=mob); pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.goto('file://' + os.getcwd() + '/dist/index.html'); await pg.wait_for_timeout(600)
            try: r = await pg.evaluate(JS, ID)
            except Exception as e: r = 'FAILED ' + str(e)[:300]
            print(name, r, 'errors:', errs[:4] or 'none'); await ctx.close()
        await b.close()
asyncio.run(main())
