import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

export default function MyTickets() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const q = query(
        collection(db, "tickets"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const ticketData = [];

      for (const ticketDoc of snapshot.docs) {
        const ticket = ticketDoc.data();

        const eventRef = doc(db, "events", ticket.eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          ticketData.push({
            id: ticketDoc.id,
            ...ticket,
            event: eventSnap.data()
          });
        }
      }

      setTickets(ticketData);
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

  return (
    <div>
      <h2>My Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              border: "1px solid gray",
              margin: 10,
              padding: 10,
              borderRadius: 8
            }}
          >
            <h3>{ticket.event.title}</h3>

            <p>
              Status: {ticket.status}
            </p>

            <p>
              Date: {ticket.event.date}
            </p>

            <p>
              Location: {ticket.event.location}
            </p>
          </div>
        ))
      )}
    </div>
  );
}