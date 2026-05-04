self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Biarkan fetch lewat tanpa cache dulu biar gak ganggu data real-time lu
  event.respondWith(fetch(event.request));
});
