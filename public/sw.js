self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_NOTIF') {
    scheduleDailyNotif();
  }
});

function scheduleDailyNotif() {
  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const delay = target - now;
  setTimeout(() => {
    self.registration.showNotification('process lab.', {
      body: "N'oublie pas ton journal du jour ! 📋",
      icon: '/icon.png',
      badge: '/icon.png',
      vibrate: [200, 100, 200],
      data: { url: self.location.origin },
    });
    scheduleDailyNotif();
  }, delay);
}
