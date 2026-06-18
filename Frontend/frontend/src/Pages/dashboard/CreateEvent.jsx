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
      createdBy: user.uid
    });

    alert("Event created!");

    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
  };

  return (
    <div>
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
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

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}