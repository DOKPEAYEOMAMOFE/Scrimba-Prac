import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Paste your Firebase config here (Firebase Console > Project settings > Your apps).
// These values are safe to be public - Firebase security rules protect your data.
// Note: jersey photos are stored on Cloudinary (see src/cloudinary.js), not Firebase Storage.
const firebaseConfig = {
  apiKey: "AIzaSyDK7rxQp_6arct-tW3ZYUnmRyRd2Tq-mY4",
  authDomain: "jerseybank.firebaseapp.com",
  projectId: "jerseybank",
  storageBucket: "jerseybank.firebasestorage.app",
  messagingSenderId: "120715997486",
  appId: "1:120715997486:web:a612fed0db074896d2cabf",
  measurementId: "G-H9W6PW8FYB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
