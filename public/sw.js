/* FORGEAPC service worker — KILL SWITCH.
   A previous service worker cached a broken page and kept serving it, causing a
   white screen that redeploys couldn't fix. This version does the opposite of
   caching: on activation it deletes ALL caches, unregisters itself, and reloads
   any open tabs so every visitor is healed automatically. */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try {
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (e) {} });
    } catch (e) {}
  })());
});

// Pass every request straight to the network — never serve from cache.
self.addEventListener("fetch", () => {});
