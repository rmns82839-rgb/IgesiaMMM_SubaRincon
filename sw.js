// =========================================================================
// SERVICE WORKER — Iglesia MMM Suba Rincón
// Versión: mmm-suba-v3
// Estrategia: Cache First para recursos locales, Network First para la API
// =========================================================================

const CACHE_NAME = 'mmm-suba-v3';

// Recursos que se cachean en la instalación (shell de la app)
const SHELL_ASSETS = [
  './',
  './index.html',
  './caballeros.html',
  './damas.html',
  './jovenes.html',
  './ninos.html',
  './evangelismo.html',
  './ujieres.html',
  './alabanza.html',
  './aseo.html',
  './multimedia.html',
  './actividades_ventas.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './logo.png',
  './foto7.jpeg',
  './foto7.jpg',
  './foto1.jpeg',
  './foto2.jpeg',
  './foto3.jpeg',
  './foto4.jpeg',
  './foto5.jpeg',
  './foto6.jpeg',
  './fortaleza.jpeg',
  './generaciones.jpg',
  './jesus_salva.jpg',
  './png.png'
];

// Dominios externos que también se cachean
const EXTERNAL_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// -------------------------------------------------------------------------
// 1. INSTALACIÓN: Pre-cachear el shell de la app
// -------------------------------------------------------------------------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cachear assets locales (críticos)
        return cache.addAll(SHELL_ASSETS)
          .then(() => {
            // Cachear externos en modo individual para no bloquear si uno falla
            return Promise.allSettled(
              EXTERNAL_ASSETS.map(url =>
                fetch(url).then(res => {
                  if (res.ok) cache.put(url, res);
                }).catch(() => {})
              )
            );
          });
      })
      .then(() => self.skipWaiting()) // Activar inmediatamente sin esperar
  );
});

// -------------------------------------------------------------------------
// 2. ACTIVACIÓN: Limpiar cachés viejas
// -------------------------------------------------------------------------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim()) // Tomar control de todas las pestañas abiertas
  );
});

// -------------------------------------------------------------------------
// 3. FETCH: Estrategia según el tipo de recurso
// -------------------------------------------------------------------------
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // No interceptar peticiones POST/PUT/DELETE (formularios, foro, ventas)
  if (event.request.method !== 'GET') return;

  // No interceptar la API del foro ni el backend de ventas
  if (url.hostname.includes('onrender.com')) return;

  // No interceptar YouTube (videos en vivo, iframes)
  if (url.hostname.includes('youtube.com') || url.hostname.includes('ytimg.com')) return;

  // No interceptar Google Analytics u otros trackers
  if (url.hostname.includes('google-analytics.com') || url.hostname.includes('googletagmanager.com')) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // CACHE FIRST: si está en caché, devolver inmediatamente
        if (cachedResponse) {
          // En segundo plano, actualizar la caché silenciosamente
          fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              }
            })
            .catch(() => {}); // Ignorar errores de red en background

          return cachedResponse;
        }

        // NETWORK FIRST: no está en caché, ir a la red
        return fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Sin red y sin caché: mostrar página offline si es una navegación HTML
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
