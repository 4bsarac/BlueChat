// sw.js - Arka Planda Çalışan Hizmetli (Service Worker)

// İşletim sisteminden gelen Push bildirim sinyallerini yakalama
self.addEventListener('push', function(event) {
    let payload = { title: "BlueChat", body: "Yeni bir mesajınız var." };

    if (event.data) {
        try {
            payload = event.data.json(); 
        } catch (e) {
            payload = { title: "BlueChat", body: event.data.text() };
        }
    }

    const options = {
        body: payload.body,
        icon: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/comments.svg',
        badge: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/comments.svg',
        vibrate: [100, 50, 100], // Telefonlar için titreşim kalıbı
        data: payload.data || {},
        actions: [
            { action: 'open_chat', title: 'Sohbeti Aç' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});

// Bildirime tıklatıldığında uygulamayı açma aksiyonu
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Eğer uygulama sekmelerde zaten açıksa onu öne getir
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // Kapalıysa uygulamayı sıfırdan aç
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
