import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function EventApprovals() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // APPROVE EVENT
  const approveEvent = async (event) => {
    await updateDoc(doc(db, "events", event.id), {
      status: "approved"
    });

    alert("Event Approved!");
    fetchEvents();
  };

  // REJECT EVENT
  const rejectEvent = async (event) => {
    await updateDoc(doc(db, "events", event.id), {
      status: "rejected"
    });

    alert("Event Rejected!");
    fetchEvents();
  };

  return (
    <div>
      <h1>Event Approvals (Admin)</h1>

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10
          }}
        >
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.date}</p>
          <p>{event.location}</p>
          <p>Status: {event.status}</p>

          <button
            onClick={() => approveEvent(event)}
            disabled={event.status !== "pending"}
          >
            Approve
          </button>

          <button
            onClick={() => rejectEvent(event)}
            disabled={event.status !== "pending"}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}