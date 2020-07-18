import * as firebase from "firebase/app";
import "firebase/messaging";
let messaging;

const initializedFirebaseApp = firebase.initializeApp(
  {
    apiKey: "AIzaSyB4_hi_akHf9x5FzJhGy44nzVYyocN_ibs",
    authDomain: "meri-dukaan-a0d75.firebaseapp.com",
    databaseURL: "https://meri-dukaan-a0d75.firebaseio.com",
    projectId: "meri-dukaan-a0d75",
    storageBucket: "meri-dukaan-a0d75.appspot.com",
    messagingSenderId: "178001198147",
    appId: "1:178001198147:web:c8a5bcb3e3419894e0e8f6",
    measurementId: "G-DEYQDRMT4Z",
  },
  "meri-dukaan"
);
messaging = initializedFirebaseApp.messaging();

export { messaging };
