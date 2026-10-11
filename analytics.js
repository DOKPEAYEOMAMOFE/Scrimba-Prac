import { collection, doc, getDocs, query, setDoc, where, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

const VISITOR_KEY = "jerseybank_visitor_id";
const SESSION_KEY = "jerseybank_session_id";

function getId(key) {
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackVisit(path = window.location.pathname) {
  const visitorId = getId(VISITOR_KEY);
  const sessionId = getId(SESSION_KEY);
  const visitRef = doc(db, "visitors", sessionId);
  await setDoc(visitRef, {
    visitorId,
    path,
    firstSeen: serverTimestamp(),
    lastSeen: serverTimestamp(),
  }, { merge: true });
  return sessionId;
}

export async function heartbeat(path = window.location.pathname) {
  const sessionId = getId(SESSION_KEY);
  await setDoc(doc(db, "visitors", sessionId), {
    path,
    lastSeen: serverTimestamp(),
  }, { merge: true });
}

export async function trackProductView(jerseyId) {
  if (!jerseyId) return;
  const sessionId = getId(SESSION_KEY);
  const viewId = `${sessionId}_${jerseyId}`;
  await setDoc(doc(db, "productViews", viewId), {
    sessionId,
    jerseyId,
    viewedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getAnalytics() {
  const [visitorSnap, productSnap] = await Promise.all([
    getDocs(collection(db, "visitors")),
    getDocs(collection(db, "productViews")),
  ]);

  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const visitors = visitorSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const online = visitors.filter((v) => {
    const last = v.lastSeen?.toMillis?.() || 0;
    return now - last < 90_000;
  }).length;
  const today = visitors.filter((v) => (v.firstSeen?.toMillis?.() || 0) >= todayStart.getTime()).length;
  const week = visitors.filter((v) => (v.firstSeen?.toMillis?.() || 0) >= weekStart.getTime()).length;

  const viewCounts = {};
  productSnap.docs.forEach((d) => {
    const { jerseyId } = d.data();
    if (jerseyId) viewCounts[jerseyId] = (viewCounts[jerseyId] || 0) + 1;
  });

  return { online, today, week, viewCounts };
}
