import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEvents();
      setEvents(data);
    };

    fetchData();
  }, []);

  const handleJoinEvent = async (eventId) => {
    console.log("Joining event:", eventId);

    alert("Join Event button clicked!");
  };

  return (
    <div>
      <h1>All Events</h1>

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