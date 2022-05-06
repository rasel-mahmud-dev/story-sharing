
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) return response
      fetch(event.request).then(response => {
        cache.put(event.request, response.clone());
        return response;
      });
    })
);
});

// https://fill-in-the-blank.vercel.app/mad-libs/your-day-off