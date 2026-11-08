/* 받아쓰기 연습장 서비스워커
   - 설치(홈 화면 앱) 조건을 만족시키기 위한 최소 구성
   - 항상 인터넷에서 먼저 받아오고(=최신 유지), 인터넷이 안 될 때만 저장본을 씀 */
const CACHE = 'badasseugi-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req))
  );
});
