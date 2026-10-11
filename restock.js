import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const restockRef = collection(db, "restockAlerts");

export async function createRestockAlert({ jerseyId, jerseyName, size, name, phone }) {
  const payload = {
    jerseyId: String(jerseyId || ""),
    jerseyName: String(jerseyName || "").trim(),
    size: String(size || "").trim(),
    name: String(name || "").trim(),
    phone: String(phone || "").trim(),
    status: "pending",
    createdAt: serverTimestamp(),
  };
  if (!payload.jerseyId || !payload.jerseyName || !payload.size || !payload.name || !payload.phone) {
    throw new Error("Please complete the required fields.");
  }
  const ref = await addDoc(restockRef, payload);
  return ref.id;
}

export async function getAllRestockAlerts() {
  const snap = await getDocs(query(restockRef, orderBy("createdAt", "desc")));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function updateRestockAlertStatus(id, status) {
  await updateDoc(doc(db, "restockAlerts", id), { status });
}

export async function deleteRestockAlert(id) {
  await deleteDoc(doc(db, "restockAlerts", id));
}
