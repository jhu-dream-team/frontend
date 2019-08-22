// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "221674904482"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    return self.postMessage(
          payload.data['firebase-messaging-data']
    );
});

messaging.onMessage(function(payload) {
    return self.postMessage(
          payload.data['firebase-messaging-data']
    );
});

