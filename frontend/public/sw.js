self.addEventListener('push', event => {
    let message = "";
    if (event.data) {
        message = event.data.text();

    }

    const options = {
        badge: "/logo192.png",
        image:"/logo192.png",
        body:message
    }

    event.waitUntil(
        self.registration.showNotification("Beach směny", options)
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
