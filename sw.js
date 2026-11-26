// 离线缓存：页面先走网络（拿到最新版），没网时用缓存。
const CACHE = "wsk-v7";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-face-192.png", "icon-face-512.png", "icon-face-180.png", "hero.jpg", "chara.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // 高德请求不缓存
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
