// SPYDER Team Management Center - Service Worker
const CACHE = 'spyder-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Handle push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'SPYDER Team';
  const options = {
    body: data.body || 'משימה חדשה שובצת לך',
    icon: data.icon || '/moshesho/icon-192.png',
    badge: data.badge || '/moshesho/icon-192.png',
    dir: 'rtl',
    lang: 'he',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/moshesho/team.html' },
    actions: [
      { action: 'open', title: 'פתח משימה' },
      { action: 'close', title: 'סגור' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  const url = e.notification.data?.url || '/moshesho/team.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('team.html') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
