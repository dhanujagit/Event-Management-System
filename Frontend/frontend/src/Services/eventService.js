import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";



// CREATE EVENT (Organizer)
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


// GET EVENTS (Attendee view)
// Only approved events show
export const getEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return events.filter((event) => event.status === "approved");

  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};


// JOIN EVENT (create ticket)
export const joinEvent = async (userId, eventId) => {
  try {
    const q = query(
      collection(db, "tickets"),
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );

    const existing = await getDocs(q);

    if (!existing.empty) {
      throw new Error("Already registered for this event");
    }

    const docRef = await addDoc(collection(db, "tickets"), {
      userId,
      eventId,
      status: "registered",
      createdAt: serverTimestamp()
    });

    return docRef.id;

  } catch (error) {
    console.error("Join event error:", error);
    throw error;
  }
};