// ============================================================
// Service Worker — 离线缓存控制
// 版本号: 每次更新功能时把 v1 改成 v2, v3...
// ============================================================
const CACHE_NAME = 'boxpack-v1';
const FILES = [
  './',
  './index.html',
  './skudb.js',
  './boxdb.js',
  './packing.js',
  './history.js',
  './print.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
