self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Buzz Chat", {
      body: data.body || "New message",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: data.tag || "buzz-chat",
      renotify: true,
      data: { url: "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) return clientList[0].focus();
        return clients.openWindow(event.notification.data?.url || "/");
      })
  );
});
