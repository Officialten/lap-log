/* Network-first for the app page so updates show on the next open; cache-first for icons and fonts; works offline */
const CACHE="lap-log-v4";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const isPage=req.mode==="navigate"||req.url.endsWith("/index.html")||req.url.endsWith("/");
  if(isPage){
    e.respondWith(fetch(req,{cache:"no-store"}).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put("./index.html",cp)); return r; })
      .catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));} return r; })));
});
