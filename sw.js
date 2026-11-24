// Service worker of The Show. It keeps a copy of the page so that the atlas opens without a connection.
// The page is fetched network first and the browser cache is asked to revalidate, so a new build shows at once when there is a connection.
// The saved copy is used only when the network fails. A page address with state in its query (?y=1920&c=ATL) uses the same saved page.
// The shared files /shared-ui/tokens.css and /shared-ui/shell.js are saved at run time and served from the saved copy first,
// so the app starts offline after one online visit. Old caches are removed when a new worker starts.
// Change the version number below when the rules in this file change.
const VERSION = 'v1', CACHE = 'theshow-' + VERSION, PAGE = new URL('./', self.location).href;
const SHARED = ['/shared-ui/tokens.css', '/shared-ui/shell.js'].map((p) => new URL(p, self.location.origin).href);
const FILES = ['manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-180.png'].map((p) => new URL(p, self.location).href);
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all([c.add(PAGE), ...SHARED.map((u) => c.add(u)), ...FILES.map((u) => c.add(u))].map((p) => p.catch(() => {})))));
});
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('theshow-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', (e) => {
  const r = e.request, url = new URL(r.url);
  if (r.method !== 'GET' || url.origin !== self.location.origin) return;
  const bare = url.origin + url.pathname;
  if (SHARED.includes(bare)) {   // saved copy first, refreshed in the background
    e.respondWith(caches.open(CACHE).then((c) => c.match(bare).then((hit) => {
      const net = fetch(r).then((res) => { if (res.ok && res.type === 'basic') c.put(bare, res.clone()); return res; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    })).catch(() => Response.error()));
    return;
  }
  const key = r.mode === 'navigate' ? PAGE : r;
  const net = r.mode === 'navigate' ? fetch(new Request(r.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'manual' })) : fetch(r);
  e.respondWith(net.then((res) => {
    if (res.type === 'opaqueredirect') return res;
    if (res.ok && res.type === 'basic') { const copy = res.clone(); e.waitUntil(caches.open(CACHE).then((c) => c.put(key, copy))); return res; }
    return r.mode === 'navigate' ? caches.match(key, { ignoreSearch: true }).then((m) => m || res) : res;
  }).catch(() => caches.match(key, { ignoreSearch: true }).then((m) => m || Response.error())));
});
