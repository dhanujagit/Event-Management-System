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


// ==========================================
// GENERATE UNIQUE TICKET NUMBER
// ==========================================

const generateTicketNumber = async () => {

  const counterRef = doc(db, "counters", "tickets");

  const nextNumber = await runTransaction(db, async (transaction) => {

    const counterSnap = await transaction.get(counterRef);

    if (!counterSnap.exists()) {

      transaction.set(counterRef, {
        current: 1
      });

      return 1;
    }

    const current = counterSnap.data().current || 0;

    const next = current + 1;

    transaction.update(counterRef, {
      current: next
    });

    return next;

  });

  const year = new Date().getFullYear();

  return `EVT-${year}-${String(nextNumber).padStart(6, "0")}`;

};


// ==========================================
// JOIN EVENT
// ==========================================

export const joinEvent = async (
  userId,
  eventId,
  userData = {}
) => {

  // Prevent duplicate registrations

  const existingQuery = query(
    collection(db, "tickets"),
    where("userId", "==", userId),
    where("eventId", "==", eventId)
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    throw new Error("Already registered for this event.");
  }

  // Generate unique ticket number

  const ticketNumber = await generateTicketNumber();

  // QR payload

  const qrPayload = JSON.stringify({
    ticketNumber,
    eventId,
    userId
  });

  // Save ticket

  const ticketRef = await addDoc(
    collection(db, "tickets"),
    {

      ticketNumber,

      qrCode: qrPayload,

      userId,

      eventId,

      name: userData.name || "",

      email: userData.email || "",

      status: "registered",

      checkedIn: false,

      checkedInAt: null,

      createdAt: serverTimestamp()

    }
  );

  return ticketRef.id;

};


// ==========================================
// GET MY TICKETS
// ==========================================

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