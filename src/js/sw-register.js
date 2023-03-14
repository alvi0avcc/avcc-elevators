export default function LocalServiceWorkerRegister() {
    const swPath = `${process.env.PUBLIC_URL}/js/sw.js`;
    if ('serviceWorker' in navigator ) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
        .register(swPath)
        .then(serviceWorker  => { console.log('Service worker registered', serviceWorker); })
        .catch(error => { console.error("Error registering the Service Worker: ", error); });
    })
  }
}