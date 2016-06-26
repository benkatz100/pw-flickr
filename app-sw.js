/* global caches, self, console, fetch */
'use strict';
let cachesId = '1.0';

self.addEventListener('install', function (event) {
  console.log(`[INSTALL] caching with cache id = ${cachesId}`);
  event.waitUntil(
    caches.open(cachesId).then(function (cache) {
      console.log('[INSTALL] Adding app shell to cache');
      return cache.addAll([
        './',
        './index.html',
        './code/app.js',
        './style.css',
        './loading.gif'
      ]);
    }).then(function () {
      console.log('[INSTALL] finished adding all');
    }).catch(function (e) {
      console.error('[INSTALL] failed to cache', e);
    })
  );
});

let cacheResponse = request => response => {
  caches.open(cachesId).then(cache => cache.put(request, response.clone()));
  return response;
};

function fetchRequestIfNeeded(request) {

  return response => {
    console.log(`[Fetch] Getting ${request.url} from ${response ? 'cache' : 'server'}`);
    return (!response) ? fetch(request) : response;
  };
}

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(fetchRequestIfNeeded(event.request))
    .then(cacheResponse(event.request))
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
