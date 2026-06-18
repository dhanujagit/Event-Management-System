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

  return (
    <div>
      <h1>All Events</h1>

      {events.map((event) => (
        <div key={event.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.date}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}