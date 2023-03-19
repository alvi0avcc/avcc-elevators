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
  // Сначала попробуйте получить ресурс из кэша
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  // Далее попробуйте использовать предустановленный ответ, если он есть
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  // Далее попробуйте получить ресурс из сети
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
    // если даже резервный ответ недоступен,
    // здесь мы ничего не можем сделать, но мы всегда должны
    // возврат объекта Response
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
  const Path = window.location.href;
  console.log('External Path=',Path);
  event.waitUntil(
    addResourcesToCache([
      "Path",
      "Path"+"index.html",
      "Path"+"favicon.ico",
      "Path"+"192.png",
      "Path"+"asset-manifest.json",
      "Path"+"manifest.json",
      "Path"+"static/css/main.93ab147d.css",
      "Path"+"static/css/main.93ab147d.css.map",
      "Path"+"static/js/787.dc98cd1f.chunk.js",
      "Path"+"static/js/787.dc98cd1f.chunk.js.map",
      "Path"+"static/js/main.278dc0e2.js",
      "Path"+"static/js/main.278dc0e2.js.LICENSE.txt",
      "Path"+"static/js/main.278dc0e2.js.map",
      "Path"+"static/media/roboto-all-300-normal.168d6383e73339293ac3.woff",
      "Path"+"static/media/roboto-cyrillic-300-normal.1431d1cef06ad04f5458.woff2",
      "Path"+"static/media/roboto-cyrillic-ext-300-normal.4777461b144e55145268.woff2",
      "Path"+"static/media/roboto-greek-300-normal.db2632771401f61463fe.woff2",
      "Path"+"static/media/roboto-greek-ext-300-normal.35b9d6be04b95f0f0530.woff2",
      "Path"+"static/media/roboto-latin-300-normal.c48fb6765a9fcb00b330.woff2",
      "Path"+"static/media/roboto-latin-ext-300-normal.dc7dcec8e3f654e0ed63.woff2",
      "Path"+"static/media/roboto-vietnamese-300-normal.32fc45a3d1e8ea11fabc.woff2"
    ])
  );
});

//self.addEventListener('fetch', (event) => {
//  event.respondWith(
//    cacheFirst({
//      request: event.request,
//      preloadResponsePromise: event.preloadResponse,
//      fallbackUrl: './gallery/myLittleVader.jpg',
//    })
//  );
//});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    })
  );
});
