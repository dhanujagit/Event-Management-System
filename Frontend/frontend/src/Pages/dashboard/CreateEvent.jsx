import { useState } from "react";
import { createEvent } from "../../services/eventService";
import { useAuth } from "../../context/AuthContext";

export default function CreateEvent() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // safety check
    if (!user) {
      alert("User not loaded. Please refresh and try again.");
      return;
    }

    if (!title || !description || !date || !location) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await createEvent({
        title,
        description,
        date,
        location,
        createdBy: user.uid,
        organizerEmail: user.email,
        status: "pending"
      });

      alert("Event sent for approval 🔥");

      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");

    } catch (error) {
      console.error("Event creation error:", error);
      alert("Failed to create event. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", marginTop: "20px" }}>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Event"}
        </button>

      </form>
    </div>
  );
}