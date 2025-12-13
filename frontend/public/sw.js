self.addEventListener('push', event => {
    if (!event.data) return;

    const message = event.data.json();

    const options = {
        icon: "logo192.png",
        body:message.body || "",
        silent: false,
        vibrate : [200,100,200]
    }

    event.waitUntil(
        self.registration.showNotification(message.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) {
                let client = clientList[0];
                return client.focus();
            }
            return clients.openWindow(event.notification.data);
        })
    );
});
