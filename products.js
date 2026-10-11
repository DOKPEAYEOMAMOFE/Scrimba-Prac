// ============================================================
// PRODUCTS - talks to the "jerseys" collection in Firestore
// Shop page and Admin dashboard both use these functions.
// ============================================================

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase.js";

const jerseysRef = collection(db, "jerseys");

// Short in-memory cache prevents repeated catalog downloads while navigating
// between Shop, collections, and related-product sections.
const CACHE_TTL = 30_000;
let jerseysCache = null;
let jerseysCacheAt = 0;

// Shape of a jersey document in Firestore:
// {
//   name: "Real Madrid Home Jersey 24/25",
//   category: "Football",
//   price: 45000,
//   sizes: ["S", "M", "L", "XL"],
//   colors: ["White", "Blue"],
//   images: ["https://res.cloudinary.com/.../photo1.jpg", ...],
//   createdAt: <ms timestamp, used for sort order>
// }

export async function getAllJerseys({ force = false } = {}) {
  if (!force && jerseysCache && Date.now() - jerseysCacheAt < CACHE_TTL) return jerseysCache;
  // Read the collection directly and sort in the browser. This is more
  // resilient than orderBy("createdAt") because older jerseys may not have
  // a createdAt field and do not require a Firestore index.
  const snap = await getDocs(jerseysRef);
  jerseysCache = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
  jerseysCacheAt = Date.now();
  return jerseysCache;
}

export async function getJerseyById(id) {
  const snap = await getDoc(doc(db, "jerseys", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function addJersey(jersey) {
  const result = await addDoc(jerseysRef, { ...jersey, createdAt: Date.now() });
  jerseysCache = null;
  return result;
}

export async function updateJersey(id, jersey) {
  const result = await updateDoc(doc(db, "jerseys", id), jersey);
  jerseysCache = null;
  return result;
}

export async function deleteJersey(id) {
  const result = await deleteDoc(doc(db, "jerseys", id));
  jerseysCache = null;
  return result;
}
