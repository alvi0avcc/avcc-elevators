const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "https://github.com/alvi0avcc/",
      "https://github.com/alvi0avcc/index.html"
    ])
  );
});
