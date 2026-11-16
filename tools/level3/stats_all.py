import asyncio, os, json
from playwright.async_api import async_playwright
JS = """()=>{const out={};for(const [id,s] of window.__show.byId){window.__show.openPark(s);const p=window.__show.park;
let tri=0,calls=0;p.group.traverse(o=>{if(!o.isMesh||!o.visible)return;let n=o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3;
const g=o.geometry.groups&&o.geometry.groups.length?o.geometry.groups.length:1;calls+=g;tri+=n*(o.isInstancedMesh?o.count:1);});out[id]=[calls,Math.round(tri),p.lod];}return out;}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox'])
        res = {}
        for name, vp, mob in [('desk', {'width':1280,'height':800}, False), ('phone', {'width':390,'height':844}, True)]:
            ctx = await b.new_context(viewport=vp, is_mobile=mob, has_touch=mob); pg = await ctx.new_page(); errs=[]
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + os.getcwd() + '/dist/index.html'); await pg.wait_for_timeout(600)
            res[name] = await pg.evaluate(JS); print(name, 'errors', errs[:3] or 'none'); await ctx.close()
        for k in res['desk']:
            d, ph = res['desk'][k], res['phone'][k]
            flag = ' OVER' if ph[0] > 250 or ph[1] > 90000 else ''
            print(f"{k:4} desk {d[0]:4}/{d[1]:6}  phone {ph[0]:4}/{ph[1]:6} {ph[2]}{flag}")
        await b.close()
asyncio.run(main())
