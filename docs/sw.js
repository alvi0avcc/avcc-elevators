const CACHE_NAME_1 = "V1";
//const STATIC_CACHE_URLS = ["styles.css", "scripts.js"];
const STATIC_CACHE_URLS = ["/avcc-elevators/", "/static"];


self.addEventListener("install", event => {  
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_NAME_1).then(cache => cache.addAll(STATIC_CACHE_URLS))
  );
});

self.addEventListener('message', async (event) => {
    console.log('Got message in the service worker', event);
  });

  
  const CACHE_NAME_2 = "V2";

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
