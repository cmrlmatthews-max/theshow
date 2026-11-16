# Usage: python3 sheet_all.py <view> <ID,ID,...>  -> shots/all_<view>_<ID>.png at 560x350
import asyncio, os, sys
from playwright.async_api import async_playwright
view, ids = sys.argv[1], sys.argv[2].split(',')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox'])
        pg = await b.new_page(viewport={'width':560,'height':350}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.getcwd() + '/dist/index.html'); await pg.wait_for_timeout(500)
        for i in ids:
            await pg.evaluate("(id)=>{window.__show.openPark(window.__show.byId.get(id));}", i)
            await pg.evaluate("(v)=>{const p=window.__show.park;p.setView(v,true);p.frame();document.querySelectorAll('#park .hud').forEach(e=>e.style.display='none');}", view)
            await pg.wait_for_timeout(250)
            await pg.screenshot(path=f'shots/all_{view}_{i}.png')
        print('errors', errs or 'none'); await b.close()
asyncio.run(main())
