import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";



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

    //show approved events
    return events.filter((event) => event.status === "approved");

  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};