import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

// ========================================
// ORGANIZER APPLICATIONS
// ========================================

export const getOrganizerApplications = async () => {
  try {
    const snapshot = await getDocs(collection(db, "organizerApplications"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error(error);
    return [];
  }
};


export const approveOrganizer = async (application) => {

  await updateDoc(doc(db, "users", application.uid), {
    role: "organizer"
  });

  await updateDoc(
    doc(db, "organizerApplications", application.id),
    {
      status: "approved"
    }
  );
};


export const rejectOrganizer = async (application) => {

  await updateDoc(
    doc(db, "organizerApplications", application.id),
    {
      status: "rejected"
    }
  );

  await updateDoc(doc(db, "users", application.uid), {
    role: "attendee"
  });
};


// ========================================
// EVENTS
// ========================================

export const getAllEvents = async () => {

  try {

    const snapshot = await getDocs(collection(db, "events"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {

    console.error(error);
    return [];

  }
};


export const approveEvent = async (event) => {

  await updateDoc(doc(db, "events", event.id), {
    status: "approved"
  });

};


export const rejectEvent = async (event) => {

  await updateDoc(doc(db, "events", event.id), {
    status: "rejected"
  });

};