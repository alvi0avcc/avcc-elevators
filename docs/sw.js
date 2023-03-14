const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/static",
      "/192.png",
      "/asset-manifest.json",
      "/favicon.ico",
      "/manifest.json"
    ])
  );
});
