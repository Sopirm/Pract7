const CACHE_NAME = 'notes-app-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './sw-register.js',
    './manifest.json',
    './icons/icon-16x16.png',
    './icons/icon-32x32.png',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './icons/splash-512x512.png'
];

 // Установка Service Worker и кэширование ресурсов
 self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
 });

 // Активация и очистка старых кэшей
 self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key)))
        })
    );
});

// Перехват запросов и возврат из кэша
self.addEventListener('fetch', event => {
   event.respondWith(
       caches.match(event.request)
           .then(response => {
               // Если ресурс найден в кэше, возвращаем его
               if (response) {
                   return response;
               }
               
               // Если ресурса нет в кэше, делаем сетевой запрос
               return fetch(event.request)
                   .then(networkResponse => {
                       // Сохраняем копию ответа в кэш
                       if (networkResponse && networkResponse.status === 200) {
                           const responseToCache = networkResponse.clone();
                           caches.open(CACHE_NAME)
                               .then(cache => {
                                   cache.put(event.request, responseToCache);
                               });
                       }
                       return networkResponse;
                   })
                   .catch(() => {
                       // Если произошла ошибка сети и это навигационный запрос,
                       // возвращаем главную страницу из кэша
                       if (event.request.mode === 'navigate') {
                           return caches.match('./index.html');
                       }
                       return new Response('Нет соединения с сетью', {
                           status: 503,
                           headers: { 'Content-Type': 'text/plain' }
                       });
                   });
           })
   );
}); 