/* global caches, self, console, fetch */
'use strict';
let cachesId = '1.5';

self.addEventListener('install', function (event) {
  console.log(`[INSTALL] caching with cache id = ${cachesId}`);
  event.waitUntil(
    caches.open(cachesId).then(function (cache) {
      console.log('[INSTALL] Adding app shell to cache');
      return cache.addAll([
        '/pw-flickr/',
        '/pw-flickr/index.html',
        '/pw-flickr/fetch.js',
        '/pw-flickr/code/app.js',
        '/pw-flickr/style.css',
        '/pw-flickr/loading.gif',
        '/pw-flickr/favicon.ico',
        '/pw-flickr/icons/icon-128x128.png',
        '/pw-flickr/icons/icon-144x144.png',
        '/pw-flickr/icons/icon-192x192.png',
        '/pw-flickr/icons/icon-152x152.png'
      ]);
    }).then(function () {
      console.log('[INSTALL] finished adding all');
    }).catch(function (e) {
      console.error('[INSTALL] failed to install due to caching failure', e);
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
    .catch(() => caches.open(cachesId)
                  .then(cache => cache.keys())
                  .then(requests =>
                    requests.map(request => request.url)
                    .filter(url => url && url.includes('api.flickr.com')))
                  .then(urls => urls[0])
                  .then(caches.match))
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
