import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { getOrganizerEvents } from "../../services/eventService";

import Navbar from "../../components/Navbar";
import LogoutButton from "../../components/LogoutButton";

import CreateEvent from "./CreateEvent";

export default function OrganizerDashboard() {

  const { user } = useAuth();

  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {

    if (!user) return;

    loadEvents();

  }, [user]);



  const loadEvents = async () => {

    const events = await getOrganizerEvents(user.uid);

    setMyEvents(events);

  };



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
              border: "1px solid gray",
              padding: 10,
              marginBottom: 10,
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