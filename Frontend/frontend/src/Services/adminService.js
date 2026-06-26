import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";



// ========================================
// LIVE DASHBOARD STATISTICS
// ========================================

export const subscribeToDashboardStats = (callback) => {

  const organizerQuery = query(
    collection(db, "organizerApplications"),
    where("status", "==", "pending")
  );

  const pendingEventQuery = query(
    collection(db, "events"),
    where("status", "==", "pending")
  );

  const approvedEventQuery = query(
    collection(db, "events"),
    where("status", "==", "approved")
  );

  let stats = {
    pendingOrganizers: 0,
    pendingEvents: 0,
    approvedEvents: 0
  };

  const notify = () => callback({ ...stats });

  const unsubscribeOrganizers = onSnapshot(
    organizerQuery,
    (snapshot) => {
      stats.pendingOrganizers = snapshot.size;
      notify();
    }
  );

  const unsubscribePendingEvents = onSnapshot(
    pendingEventQuery,
    (snapshot) => {
      stats.pendingEvents = snapshot.size;
      notify();
    }
  );

  const unsubscribeApprovedEvents = onSnapshot(
    approvedEventQuery,
    (snapshot) => {
      stats.approvedEvents = snapshot.size;
      notify();
    }
  );

  return () => {
    unsubscribeOrganizers();
    unsubscribePendingEvents();
    unsubscribeApprovedEvents();
  };
};



// ========================================
// ORGANIZER APPLICATIONS
// ========================================

export const getOrganizerApplications = async () => {

  const snapshot = await getDocs(
    collection(db, "organizerApplications")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};



export const approveOrganizer = async (application) => {

  await updateDoc(
    doc(db, "users", application.uid),
    {
      role: "organizer"
    }
  );

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

  await updateDoc(
    doc(db, "users", application.uid),
    {
      role: "attendee"
    }
  );

};



// ========================================
// EVENTS
// ========================================

export const getAllEvents = async () => {

  const snapshot = await getDocs(
    collection(db, "events")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

};



export const approveEvent = async (event) => {

  await updateDoc(
    doc(db, "events", event.id),
    {
      status: "approved"
    }
  );

};



export const rejectEvent = async (event) => {

  await updateDoc(
    doc(db, "events", event.id),
    {
      status: "rejected"
    }
  );

};