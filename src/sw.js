/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  // tries network first and fallback to cache
  ({url}) => url.origin === 'https://api.openbrewerydb.org',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      // if status 200, cache the response
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 3600 // 1 hour
      }),
    ],
  })
);

// Use the StaleWhileRevalidate strategy for images
registerRoute(
  /\/dist\/.*\.(?:.*\.[0-9a-f]{32}\.(?:png|jpg|jpeg|svg|gif))$/,
  new StaleWhileRevalidate({
    cacheName: 'image-cache',
  })
);