import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";


// CREATE EVENT
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      status: "pending",
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};


// GET ALL APPROVED EVENTS
export const getEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, "events"));

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return events.filter(
      (event) => event.status === "approved"
    );

  } catch (error) {
    console.error(error);
    return [];
  }
};


// GET EVENTS CREATED BY ORGANIZER
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


