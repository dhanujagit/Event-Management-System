import { useEffect, useState } from "react";
import LogoutButton from "../../components/LogoutButton";
import Navbar from "../../components/Navbar";

import OrganizerApprovals from "../admin/OrganizerApprovals";
import EventApprovals from "../admin/EventApprovals";

import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

export default function AdminDashboard() {
  const [tab, setTab] = useState("organizers");

  const [pendingOrganizers, setPendingOrganizers] = useState(0);
  const [pendingEvents, setPendingEvents] = useState(0);
  const [approvedEvents, setApprovedEvents] = useState(0);

  useEffect(() => {
    // Pending organizer applications
    const organizerQuery = query(
      collection(db, "organizerApplications"),
      where("status", "==", "pending")
    );

    const unsubscribeOrganizers = onSnapshot(
      organizerQuery,
      (snapshot) => {
        setPendingOrganizers(snapshot.size);
      }
    );

    // Pending events
    const pendingEventQuery = query(
      collection(db, "events"),
      where("status", "==", "pending")
    );

    const unsubscribePendingEvents = onSnapshot(
      pendingEventQuery,
      (snapshot) => {
        setPendingEvents(snapshot.size);
      }
    );

    // Approved events
    const approvedEventQuery = query(
      collection(db, "events"),
      where("status", "==", "approved")
    );

    const unsubscribeApprovedEvents = onSnapshot(
      approvedEventQuery,
      (snapshot) => {
        setApprovedEvents(snapshot.size);
      }
    );

    return () => {
      unsubscribeOrganizers();
      unsubscribePendingEvents();
      unsubscribeApprovedEvents();
    };
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Admin Dashboard 🛠</h1>
      <p>System control panel</p>

      {/* Dashboard Statistics */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0",
          backgroundColor: "#f8f9fa"
        }}
      >
        <h2>System Overview</h2>

        <p>
          <strong>Pending Organizer Applications:</strong>{" "}
          {pendingOrganizers}
        </p>

        <p>
          <strong>Pending Event Approvals:</strong>{" "}
          {pendingEvents}
        </p>

        <p>
          <strong>Approved Events:</strong>{" "}
          {approvedEvents}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setTab("organizers")}
          style={{
            marginRight: "10px",
            padding: "8px 15px"
          }}
        >
          Organizer Approvals
        </button>

        <button
          onClick={() => setTab("events")}
          style={{
            padding: "8px 15px"
          }}
        >
          Event Approvals
        </button>
      </div>

      {/* Content */}
      {tab === "organizers" && <OrganizerApprovals />}
      {tab === "events" && <EventApprovals />}

      <LogoutButton />
    </div>
  );
}