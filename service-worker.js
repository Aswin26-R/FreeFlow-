const CACHE = "ffc-cache-v1";
const ASSETS = [
  "/index.html",
  "/dashboard.html",
  "/clients.html",
  "/projects.html",
  "/invoices.html",
  "/reminders.html",
  "/js/app.js",
  "/js/modules/storage.js",
  "/js/modules/ui.js",
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});