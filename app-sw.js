/* global caches, self, console, fetch */
'use strict';
let cachesId = Math.floor(Math.random() * 10000);

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cachesId).then(function (cache) {
      console.log('[INSTALL] Adding app shell to cache');
      return cache.addAll([
        '/',
        '/index.html',
        '/code/app.js',
        '/style.css',
        '/loading.gif'
      ]);
    }).then(function () {
      console.log('finished adding all');
    })
  );
});

self.addEventListener('activate', event =>
  event.waitUntil(caches.keys().then(
    keys =>
    Promise.all(keys.map(
      key =>
      (key !== cachesId) ? caches.delete(key) : null
    ))
  ))
);

let cacheResponse = request => response => {
  caches.open(cachesId).then(cache => cache.put(request, response.clone()));
  return response;
};

function fetchRequestIfNeeded(request) {
  return response => (!response) ? fetch(request) : response;
}

self.addEventListener('fetch', function (event) {

  event.respondWith(
    caches.match(event.request)
    .then(fetchRequestIfNeeded(event.request))
    .then(cacheResponse(event.request))
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(keyList => Promise.all(keyList.map(key =>
    (key.indexOf('v1') !== -1) ? caches.delete(key) : null
  ))));

});
