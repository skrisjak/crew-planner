self.addEventListener('push', event => {
    let data = { title: 'Nová notifikace', body: '' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icons/default-icon.png',
        badge: data.badge || '/icons/badge.png',
        data: data.url || '/home'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
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
