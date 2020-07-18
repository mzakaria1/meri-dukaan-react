importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
const firebaseConfig = {
  apiKey: "AIzaSyB4_hi_akHf9x5FzJhGy44nzVYyocN_ibs",
  authDomain: "meri-dukaan-a0d75.firebaseapp.com",
  databaseURL: "https://meri-dukaan-a0d75.firebaseio.com",
  projectId: "meri-dukaan-a0d75",
  storageBucket: "meri-dukaan-a0d75.appspot.com",
  messagingSenderId: "178001198147",
  appId: "1:178001198147:web:c8a5bcb3e3419894e0e8f6",
  measurementId: "G-DEYQDRMT4Z",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});
self.addEventListener("notificationclick", function (event) {
  console.log(event);
});
