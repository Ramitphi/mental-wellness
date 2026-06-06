import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import type { CheckIn, UserProfile } from "./types";

const profileKey = "mw-profile";
const checkinsKey = "mw-checkins";

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

function readLocalProfile(): UserProfile | null {
  if (!canUseBrowserStorage()) return null;
  const stored = window.localStorage.getItem(profileKey);
  return stored ? (JSON.parse(stored) as UserProfile) : null;
}

function writeLocalProfile(profile: UserProfile) {
  if (canUseBrowserStorage()) window.localStorage.setItem(profileKey, JSON.stringify(profile));
}

function readLocalCheckins(): CheckIn[] {
  if (!canUseBrowserStorage()) return [];
  const stored = window.localStorage.getItem(checkinsKey);
  return stored ? (JSON.parse(stored) as CheckIn[]) : [];
}

function writeLocalCheckins(checkins: CheckIn[]) {
  if (canUseBrowserStorage()) window.localStorage.setItem(checkinsKey, JSON.stringify(checkins));
}

export async function getProfile(uid: string) {
  if (!db) return readLocalProfile();

  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveProfile(profile: UserProfile) {
  const next = { ...profile, updatedAt: new Date().toISOString() };

  if (!db) {
    writeLocalProfile(next);
    return next;
  }

  await setDoc(
    doc(db, "users", next.uid),
    {
      ...next,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  return next;
}

export async function getCheckins(uid: string) {
  if (!db) return readLocalCheckins();

  const snap = await getDocs(
    query(collection(db, "users", uid, "checkins"), orderBy("createdAt", "desc"), limit(20))
  );
  return snap.docs.map((item) => ({ id: item.id, ...item.data() })) as CheckIn[];
}

export async function saveCheckIn(uid: string, checkin: Omit<CheckIn, "id">) {
  if (!db) {
    const next = { ...checkin, id: crypto.randomUUID() };
    writeLocalCheckins([next, ...readLocalCheckins()]);
    return next;
  }

  const docRef = await addDoc(collection(db, "users", uid, "checkins"), {
    ...checkin,
    createdAt: serverTimestamp()
  });

  return { ...checkin, id: docRef.id };
}

export function createDemoProfile(uid: string, email?: string | null): UserProfile {
  const now = new Date().toISOString();
  return {
    uid,
    alias: `steady-${Math.floor(1000 + Math.random() * 9000)}`,
    email,
    ageBand: "18-21",
    examType: "JEE",
    examPhase: "preparing",
    reminderTime: "21:30",
    createdAt: now,
    updatedAt: now
  };
}
