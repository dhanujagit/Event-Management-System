import { useState } from "react";
import LogoutButton from "../../components/LogoutButton";
import Navbar from "../../components/Navbar";

import OrganizerApprovals from "../admin/OrganizerApprovals";
import EventApprovals from "../admin/EventApprovals";

export default function AdminDashboard() {
  const [tab, setTab] = useState("organizers");

  return (
    <div>
      <Navbar />

      <h1>Admin Dashboard 🛠</h1>
      <p>System control panel</p>

      {/* NAV TABS */}
      <div style={{ margin: "20px 0" }}>
        <button onClick={() => setTab("organizers")}>
          Organizer Approvals
        </button>

        <button onClick={() => setTab("events")} style={{ marginLeft: 10 }}>
          Event Approvals
        </button>
      </div>

      {/* CONTENT */}
      {tab === "organizers" && <OrganizerApprovals />}
      {tab === "events" && <EventApprovals />}

      <LogoutButton />
    </div>
  );
}