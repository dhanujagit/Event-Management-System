import { useEffect, useState } from "react";

import {
  getAllEvents,
  approveEvent,
  rejectEvent
} from "../../services/adminService";

export default function EventApprovals() {

  const [events, setEvents] = useState([]);

  const loadEvents = async () => {

    const data = await getAllEvents();

    setEvents(data);

  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleApprove = async (event) => {

    await approveEvent(event);

    alert("Event Approved!");

    loadEvents();

  };

  const handleReject = async (event) => {

    await rejectEvent(event);

    alert("Event Rejected!");

    loadEvents();

  };

  return (
    <div>

      <h1>Event Approvals (Admin)</h1>

      {events.length === 0 && (
        <p>No events available.</p>
      )}

      {events.map((event) => (

        <div
          key={event.id}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10,
            borderRadius: 8
          }}
        >

          <h3>{event.title}</h3>

          <p>{event.description}</p>

          <p>{event.date}</p>

          <p>{event.location}</p>

          <p>Status: {event.status}</p>

          <button
            onClick={() => handleApprove(event)}
            disabled={event.status !== "pending"}
          >
            Approve
          </button>

          <button
            onClick={() => handleReject(event)}
            disabled={event.status !== "pending"}
            style={{ marginLeft: 10 }}
          >
            Reject
          </button>

        </div>

      ))}

    </div>
  );
}