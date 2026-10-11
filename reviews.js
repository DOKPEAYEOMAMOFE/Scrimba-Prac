import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

const reviewsRef = collection(db, "reviews");

export async function getApprovedReviews(jerseyId) {
  const q = query(reviewsRef, where("jerseyId", "==", jerseyId), where("status", "==", "approved"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}

export async function getAllReviews() {
  const snap = await getDocs(reviewsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}

export async function submitReview({ jerseyId, name, rating, text }) {
  return addDoc(reviewsRef, {
    jerseyId,
    name: name.trim().slice(0, 60),
    rating: Number(rating),
    text: text.trim().slice(0, 800),
    status: "pending",
    verified: false,
    createdAt: serverTimestamp(),
  });
}

export async function setReviewStatus(id, status) {
  const { updateDoc, doc } = await import("firebase/firestore");
  return updateDoc(doc(db, "reviews", id), { status });
}
