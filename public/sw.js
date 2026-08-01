self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch {
    return;
  }
  const {
    title = "Titan Fitness",
    body = "",
    icon = "/icon-192.png",
    badge = "/icon-192.png",
    data: payload = {},
  } = data;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: payload,
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard/notifications";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client && client.url.includes(url)) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
