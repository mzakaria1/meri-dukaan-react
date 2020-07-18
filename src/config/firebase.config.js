import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDSFGErIODdcYRHtjCy6e4Gq4xDUpMzBf4",
  authDomain: "practice-aa.firebaseapp.com",
  databaseURL: "https://practice-aa.firebaseio.com",
  projectId: "practice-aa",
  storageBucket: "practice-aa.appspot.com",
  messagingSenderId: "775515730436",
  appId: "1:775515730436:web:d6fb2e72c19feb051f7b51",
  measurementId: "G-VNGJS8D2CC"
};

firebase.initializeApp(config);

export const database = firebase.firestore();
export const storage = firebase.storage();
export const firebaseAuth = firebase.auth;
