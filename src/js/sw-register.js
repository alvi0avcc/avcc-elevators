export function SitePath (){
  let site_path = window.location.href;
  console.log('SitePath=',site_path);
  return site_path;
}

export default function registerServiceWorker(){
  const Path = SitePath();
    //console.log('SitePath=',Path);
    if ( Path == 'http://localhost:3000/' ) { console.log('local') }
    else {
      console.log('external');
      //ExternalRegisterServiceWorker();
    };
}


async function LocalRegisterServiceWorker() {
    const swPath = `${process.env.PUBLIC_URL}/sw.js`;
    if ('serviceWorker' in navigator ) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
        .register(swPath)
        .then(serviceWorker  => { console.log('Service worker registered', serviceWorker); })
        .catch(error => { console.error("Error registering the Service Worker: ", error); });
    })
  }
}

async function ExternalRegisterServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };