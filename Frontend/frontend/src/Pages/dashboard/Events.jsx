import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import { joinEvent } from "../../services/ticketService";
import { useAuth } from "../../context/AuthContext";

export default function Events() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEvents();
      setEvents(data);
    };

    fetchData();
  }, []);

  const handleJoinEvent = async (eventId) => {
    try {
      await joinEvent(user.uid, eventId);

      alert("Successfully registered!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Available Events</h1>

      {events.length === 0 ? (
        <p>No approved events available.</p>
      ) : (
        events.map((event) => (
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

            <p>
              <strong>Date:</strong> {event.date}
            </p>

            <p>
              <strong>Location:</strong> {event.location}
            </p>

            <button
              onClick={() => handleJoinEvent(event.id)}
            >
              Join Event
            </button>
          </div>
        ))
      )}
    </div>
  );
}