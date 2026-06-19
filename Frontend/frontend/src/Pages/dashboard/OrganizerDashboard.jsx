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

      {myEvents.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.date}</p>
          <p>Status: {event.status}</p>
        </div>
      ))}
      <LogoutButton />
    </div>
  );
}
