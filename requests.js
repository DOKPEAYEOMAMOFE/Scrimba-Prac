import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const requestsRef = collection(db, "jerseyRequests");

export async function createJerseyRequest(request) {
  const payload = {
    name: String(request.name || "").trim(),
    phone: String(request.phone || "").trim(),
    team: String(request.team || "").trim(),
    player: String(request.player || "").trim(),
    season: String(request.season || "").trim(),
    size: String(request.size || "").trim(),
    message: String(request.message || "").trim(),
    referenceImage: request.referenceImage || "",
    status: "pending",
    createdAt: serverTimestamp(),
  };
  if (!payload.name || !payload.phone || !payload.team || !payload.size) throw new Error("Please complete the required fields.");
  const ref = await addDoc(requestsRef, payload);
  return ref.id;
}

export async function getAllJerseyRequests() {
  const snap = await getDocs(query(requestsRef, orderBy("createdAt", "desc")));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function updateJerseyRequestStatus(id, status) {
  await updateDoc(doc(db, "jerseyRequests", id), { status });
}

export async function deleteJerseyRequest(id) {
  await deleteDoc(doc(db, "jerseyRequests", id));
}
