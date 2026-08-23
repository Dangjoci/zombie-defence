/* ì¢€ë¹??”íœ?????¤í”„?¼ì¸ ìºì‹œ
   ?ŒìŠ¤??ì¤‘ì—??ê²Œì„ ?Œì¼???ì£¼ ê°ˆì•„?¼ìš°ë¯€ë¡? HTML?€ '?¤íŠ¸?Œí¬ ?°ì„ '?¼ë¡œ ê°€?¸ì˜¨??
   ê·¸ë˜???ˆë¡œ ?¬ë¦° ë²„ì „??ë°”ë¡œ ë°˜ì˜?œë‹¤. ?¤í”„?¼ì¸?´ë©´ ìºì‹œë¡??¨ì–´ì§„ë‹¤.
   ?„ì´ì½˜Â·ë§¤?ˆí˜?¤íŠ¸??????ë°”ë€Œë?ë¡?'ìºì‹œ ?°ì„ '. */
const CACHE = 'zd-v10';
const CORE  = ['./', './index.html', './manifest.webmanifest',
               './icon-192.png', './icon-512.png', './apple-touch-icon.png',
               './assets/map-top.png'];

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
    // ìµœì‹  ?°ì„  ????ë²„ì „???¬ë¦¬ë©??¤ìŒ ?¤í–‰?ì„œ ë°”ë¡œ ?¡íŒ??    e.respondWith(
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
