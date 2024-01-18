/* eslint-disable no-restricted-globals */
// import { API } from '../src/api/config';

const cacheName = 'beer-app-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/static/js/bundle.js',
        '/beer'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {

  const { request } = event;
  // Handle API requests separately
  if (request.url.startsWith('https://api.openbrewerydb.org/v1/')) {
    event.respondWith(handleApiRequest(event));
  } else {
    // Handle other requests
    event.respondWith(handleStaticRequest(event));
  }
});

async function handleApiRequest(event) {
  const { request } = event;

  // Try to get the response from the cache
  const cachedResponse = await caches.match(request);

  // If the response is in the cache, return it
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // If the response is not in the cache, fetch it from the network
    const response = await fetch(request);

    // Clone the response to store it in the cache
    const responseToCache = response.clone();

    // Open the cache and store the response for future requests
    const cache = await caches.open(cacheName);
    cache.put(request, responseToCache);

    // Return the response to serve it to the current request
    return response;
  } catch (error) {
    // Handle errors, e.g., when the network is not available
    console.error('Error fetching API:', error);
  }
}

async function handleStaticRequest(event) {

}