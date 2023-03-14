const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      "./avcc-elevators/",
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: './gallery/myLittleVader.jpg',
    })
  );
});
