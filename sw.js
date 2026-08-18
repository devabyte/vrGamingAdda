const CACHE='tableorder-v16';
const STATIC=['/icons/icon-192.png','/icons/icon-512.png','/manifest.json'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Always fetch index.html fresh from network
  if(url.pathname.endsWith('.html')||url.pathname==='/'||url.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));
    return;
  }
  // Cache-first only for static assets (icons, manifest)
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
