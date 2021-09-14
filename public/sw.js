self.addEventListener("install", event =>{
  console.log("SW instalado");
})

self.addEventListener("activate", event =>{
  console.log("Activado");
})

self.addEventListener('fetch', function (event) {
    console.log("fetch");
});


//Cache first
self.addEventListener("fetch", (event)=> {
  event.respondWith(caches.match(event.request)
      .then((response)=> {
          if (response) {                
              return response;
          } else {                
              return fetch(event.request);
          }
      })
  );
});



//Recursos a cachear, el / es el index.html
//Cachea uno x uno si se corta sigue con el siguiente
var urls = ["/","estilos.css","https://fonts.googleapis.com/icon?family=Material+Icons","https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"];

//Instalacion
self.addEventListener("install", function(event) {
    console.log("The SW is now installed");    
    event.waitUntil(caches.open("myAppCache").then(function(cache) {
        return cache.addAll(urls);
    }));
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function(error) {
        return caches.open(myAppCache).then(function(cache) {
        	//match sabe fijarse si un recurso esta cacheado
          return cache.match(request);
        });
      })
    );
  });



//Network first
self.addEventListener('fetch', (event)=> {
  event.respondWith(
    fetch(event.request).catch((error)=> {
      return caches.open(myAppCache).then((cache)=> {
        return cache.match(request);
      });
    })
  );
});



//Stale while Revalidate
self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request)
          .then(function(response) {
              // Refresca el cache para un futuro uso
              var fetchPromise = fetch(event.request).then(
                  function(networkResponse) {
                      caches.open("mi-PWA").then(function(cache) {
                          cache.put(event.request, networkResponse.clone());
                          return networkResponse;
                      });
                  });
              // Usa la version actual
              return response || fetchPromise;
          })
      );
  }); 