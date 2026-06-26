import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

// ================================
// GET ALL TICKETS OF A USER
// ================================
export const getMyTickets = async (userId) => {
  try {
    const q = query(
      collection(db, "tickets"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    const tickets = [];

    for (const ticketDoc of snapshot.docs) {
      const ticket = ticketDoc.data();

      const eventRef = doc(db, "events", ticket.eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        tickets.push({
          id: ticketDoc.id,
          ...ticket,
          event: {
            id: eventSnap.id,
            ...eventSnap.data()
          }
        });
      }
    }

    return tickets;

  } catch (error) {
    console.error("Error loading tickets:", error);
    return [];
  }
};