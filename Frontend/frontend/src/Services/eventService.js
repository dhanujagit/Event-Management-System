import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";


// ===============================
// INCREMENT ATTENDANCE (FIXED)
// ===============================
export const incrementAttendance = async (eventId) => {
  const ref = doc(db, "events", eventId);

  await updateDoc(ref, {
    checkedInCount: increment(1)
  });
};


// ===============================
// CREATE EVENT
// ===============================
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      status: "pending",
      checkedInCount: 0, // 🔥 IMPORTANT FIX
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};


// ===============================
// GET APPROVED EVENTS
// ===============================
export const getEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, "events"));

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((event) => event.status === "approved");

  } catch (error) {
    console.error(error);
    return [];
  }
};


// ===============================
// ORGANIZER EVENTS
// ===============================
export const getOrganizerEvents = async (organizerId) => {
  try {
    const q = query(
      collection(db, "events"),
      where("createdBy", "==", organizerId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error(error);
    return [];
  }
};