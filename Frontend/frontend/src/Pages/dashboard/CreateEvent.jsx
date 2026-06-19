import { useState } from "react";
import { createEvent } from "../../services/eventService";
import { useAuth } from "../../context/AuthContext";

export default function CreateEvent() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEvent({
      title,
      description,
      date,
      location,
      createdBy: user.uid,
      organizerEmail: user.email
    });

    alert("Event sent for approval 🔥");

    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
  };

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit">
          Submit Event
        </button>
      </form>
    </div>
  );
}