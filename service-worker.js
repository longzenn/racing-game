const CACHE_NAME = 'cyber-racer-3d-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './lib/three.min.js',
  './lib/EffectComposer.js',
  './lib/RenderPass.js',
  './lib/ShaderPass.js',
  './lib/CopyShader.js',
  './lib/LuminosityHighPassShader.js',
  './lib/UnrealBloomPass.js',
  './js/config.js',
  './js/engine/AudioManager.js',
  './js/engine/InputManager.js',
  './js/engine/Renderer.js',
  './js/world/RoadManager.js',
  './js/world/Environment.js',
  './js/world/WeatherVFX.js',
  './js/entities/Car.js',
  './js/entities/TrafficCar.js',
  './js/entities/Coin.js',
  './js/entities/Obstacles.js',
  './js/entities/Powerups.js',
  './js/vfx/ParticleSystem.js',
  './js/ui/HUD.js',
  './js/ui/MenuManager.js',
  './js/main.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
