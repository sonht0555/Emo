importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.setConfig({ debug: false });
let revision = '8';
revision = (parseInt(revision) + 1).toString();

workbox.precaching.precacheAndRoute([
  { url: '/', revision: 'revision' },
  { url: '/build/mgba.js', revision: revision },
  { url: '/build/mgba.wasm', revision: revision },
  { url: '/css/style.css', revision: revision },
  { url: '/font/04b03b.ttf', revision: revision },
  { url: '/img/favi.png', revision: revision },
  { url: '/img/icon.png', revision: revision },
  { url: '/js/app.js', revision: revision },
  { url: '/js/controls.js', revision: revision },
  { url: '/js/fileloader.js', revision: revision },
  { url: '/js/game.js', revision: revision },
  { url: '/js/init.js', revision: revision },
  { url: '/js/menu.js', revision: revision },
  { url: '/js/nipplejs.js', revision: revision },
  { url: '/js/settings.js', revision: revision },
  { url: '/js/storage.js', revision: revision },
  { url: '/index.html', revision: revision },
  { url: '/manifest.json', revision: revision },
  { url: '/sw.js', revision: revision },
]);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 ngày
      }),
    ],
  })
);

// Đăng ký chiến lược StaleWhileRevalidate cho các tệp JS và CSS
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);
