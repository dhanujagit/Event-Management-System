import CreateEvent from "./CreateEvent";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import LogoutButton from "../../components/LogoutButton";
import Navbar from "../../components/Navbar";


export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(
        collection(db, "events"),
        where("createdBy", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setMyEvents(events);
    };

    fetchEvents();
  }, [user]);

  return (
    <div>
      <Navbar />
      <h1>Organizer Dashboard</h1>

      <CreateEvent />

      <h2>My Events</h2>

      {myEvents.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        myEvents.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
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

            <p>
              <strong>Status:</strong> {event.status}
            </p>
          </div>
        ))
      )}
      <LogoutButton />
    </div>
  );
}
