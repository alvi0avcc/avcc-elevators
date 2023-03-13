self.addEventListener('message', async (event) => {
    console.log('Got message in the service worker', event);
  });

self.addEventListener("install", event => {
    console.log("Service Worker installing.");
  });
  
self.addEventListener("activate", event => {
    console.log("Service Worker activating.");
  });