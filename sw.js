/* 좀비 디펜스 — 오프라인 캐시
   테스트 중에는 게임 파일을 자주 갈아끼우므로, HTML은 '네트워크 우선'으로 가져온다.
   그래야 새로 올린 버전이 바로 반영된다. 오프라인이면 캐시로 떨어진다.
   아이콘·매니페스트는 잘 안 바뀌므로 '캐시 우선'. */
const CACHE = 'zd-v6';
const CORE  = ['./', './index.html', './manifest.webmanifest',
               './icon-192.png', './icon-512.png', './apple-touch-icon.png',
               './assets/map-ground.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isDoc = e.request.mode === 'navigate' || e.request.destination === 'document';
  if (isDoc) {
    // 최신 우선 — 새 버전을 올리면 다음 실행에서 바로 잡힌다
    e.respondWith(
      fetch(e.request)
        .then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return res; })
        .catch(() => caches.match('./index.html'))
    );
  } else {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true })
        .then(r => r || fetch(e.request).then(res => {
          const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res;
        }))
    );
  }
});
