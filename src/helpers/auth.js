import { firebaseAuth } from "../config/firebase.config";

export function auth(email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw);
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}
