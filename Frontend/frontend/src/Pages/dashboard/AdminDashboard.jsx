import { useEffect, useState } from "react";

import LogoutButton from "../../components/LogoutButton";
import Navbar from "../../components/Navbar";

import OrganizerApprovals from "../admin/OrganizerApprovals";
import EventApprovals from "../admin/EventApprovals";

import { subscribeToDashboardStats } from "../../services/adminService";

export default function AdminDashboard() {

  const [tab, setTab] = useState("organizers");

  const [stats, setStats] = useState({
    pendingOrganizers: 0,
    pendingEvents: 0,
    approvedEvents: 0
  });

  useEffect(() => {

    const unsubscribe =
      subscribeToDashboardStats(setStats);

    return unsubscribe;

  }, []);

  return (
    <div>

      <Navbar />

      <h1>Admin Dashboard 🛠</h1>

      <p>System control panel</p>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          margin: "20px 0",
          borderRadius: 8,
          background: "#f9f9f9"
        }}
      >

        <h2>System Overview</h2>

        <p>
          Pending Organizer Applications:
          {" "}
          <strong>{stats.pendingOrganizers}</strong>
        </p>

        <p>
          Pending Event Approvals:
          {" "}
          <strong>{stats.pendingEvents}</strong>
        </p>

        <p>
          Approved Events:
          {" "}
          <strong>{stats.approvedEvents}</strong>
        </p>

      </div>

      <div style={{ margin: "20px 0" }}>

        <button
          onClick={() => setTab("organizers")}
        >
          Organizer Approvals
        </button>

        <button
          onClick={() => setTab("events")}
          style={{ marginLeft: 10 }}
        >
          Event Approvals
        </button>

      </div>

      {tab === "organizers" && <OrganizerApprovals />}

      {tab === "events" && <EventApprovals />}

      <LogoutButton />

    </div>
  );
}