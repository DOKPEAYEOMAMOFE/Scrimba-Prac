// ============================================================
// AUTH - admin login (Firebase Authentication, email + password)
// Create the admin's login in Firebase Console > Authentication
// > Users > Add user. Use that email/password to log in at /admin/login.
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase.js";

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Calls callback(user) whenever login state changes. Returns an unsubscribe fn.
export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
