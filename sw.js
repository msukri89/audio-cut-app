// BUMP VERSION KE v3 AGAR BROWSER MENGHAPUS CACHE LAMA
const CACHE_NAME = 'audiocut-v3'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js'
];

// Menginstall Service Worker dan menyimpan aset ke cache
self.addEventListener('install', (e) => {
  // skipWaiting memaksa SW baru untuk segera mengambil alih
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Mengaktifkan Service Worker
self.addEventListener('activate', (e) => {
  // clients.claim memastikan semua tab yang terbuka menggunakan SW baru
  e.waitUntil(clients.claim());
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Event Fetch agar browser mendeteksi fitur PWA secara penuh
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
