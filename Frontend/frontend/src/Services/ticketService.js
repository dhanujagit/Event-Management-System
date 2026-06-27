import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";


// SAFE TICKET NUMBER GENERATOR
const generateTicketNumber = async () => {

  const counterRef = doc(db, "counters", "tickets");

  const newNumber = await runTransaction(db, async (transaction) => {

    const snap = await transaction.get(counterRef);

    if (!snap.exists()) {
      transaction.set(counterRef, { current: 1 });
      return 1;
    }

    const current = snap.data().current || 0;
    const next = current + 1;

    transaction.update(counterRef, {
      current: next
    });

    return next;

  });

  const year = new Date().getFullYear();

  return `EVT-${year}-${String(newNumber).padStart(6, "0")}`;
};

// Join Event

export const joinEvent = async (userId, eventId) => {

  const existingQuery = query(
    collection(db, "tickets"),
    where("userId", "==", userId),
    where("eventId", "==", eventId)
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    throw new Error("Already registered.");
  }

  const ticketNumber = await generateTicketNumber();

  const ticketRef = await addDoc(
    collection(db, "tickets"),
    {
      ticketNumber,
      userId,
      eventId,

      status: "registered",

      checkedIn: false,

      checkedInAt: null,

      qrCode: ticketNumber,

      createdAt: serverTimestamp()
    }
  );

  return ticketRef.id;

};



// =====================================
// Get My Tickets
// =====================================

export const getMyTickets = async (userId) => {

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

};