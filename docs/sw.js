const CACHE_NAME_1 = "V1";
const CACHE_NAME_2 = "V2";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME_1);
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
      "https://alvi0avcc.github.io/avcc-elevators/manifest.json",
      "https://alvi0avcc.github.io/avcc-elevators/static/css/main.93ab147d.css",
      "https://alvi0avcc.github.io/avcc-elevators/static/css/main.93ab147d.css.map",
      "https://alvi0avcc.github.io/avcc-elevators/static/js/787.dc98cd1f.chunk.js",
      "https://alvi0avcc.github.io/avcc-elevators/static/js/787.dc98cd1f.chunk.js.map",
      "https://alvi0avcc.github.io/avcc-elevators/static/js/main.278dc0e2.js",
      "https://alvi0avcc.github.io/avcc-elevators/static/js/main.278dc0e2.js.LICENSE.txt",
      "https://alvi0avcc.github.io/avcc-elevators/static/js/main.278dc0e2.js.map",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-all-300-normal.168d6383e73339293ac3.woff",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-cyrillic-300-normal.1431d1cef06ad04f5458.woff2",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-cyrillic-ext-300-normal.4777461b144e55145268.woff2",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-greek-300-normal.db2632771401f61463fe.woff2",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-greek-ext-300-normal.35b9d6be04b95f0f0530.woff2",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-latin-300-normal.c48fb6765a9fcb00b330.woff2",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-latin-ext-300-normal.dc7dcec8e3f654e0ed63.woff2",
      "https://alvi0avcc.github.io/avcc-elevators/static/media/roboto-vietnamese-300-normal.32fc45a3d1e8ea11fabc.woff2"
    ])
  );
});

self.addEventListener('message', async (event) => {
    console.log('Got message in the service worker', event);
  });

  
  self.addEventListener("activate", event => {
    // delete any unexpected caches
    event.waitUntil(
      caches
        .keys()
        .then(keys => keys.filter(key => key !== CACHE_NAME_2))
        .then(keys =>
          Promise.all(
            keys.map(key => {
              console.log(`Deleting cache ${key}`);
              return caches.delete(key);
            })
          )
        )
    );
  });


self.addEventListener("fetch", event => {
    // Cache-First Strategy
    event.respondWith(
      caches
        .match(event.request) // check if the request has already been cached
        .then(cached => cached || fetch(event.request)) // otherwise request network
        .then(
          response =>
            cache(event.request, response) // put response in cache
              .then(() => response) // resolve promise with the network response
        )
    );
  });
