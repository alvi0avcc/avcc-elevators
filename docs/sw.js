const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "https://alvi0avcc.github.io/avcc-elevators/",
      "https://alvi0avcc.github.io/avcc-elevators/index.html",
      "https://alvi0avcc.github.io/avcc-elevators/favicon.ico",
      "https://alvi0avcc.github.io/avcc-elevators/192.png",
      "https://alvi0avcc.github.io/avcc-elevators/asset-manifest.json",
      "https://alvi0avcc.github.io/avcc-elevators/manifest.json"
    ])
  );
});
