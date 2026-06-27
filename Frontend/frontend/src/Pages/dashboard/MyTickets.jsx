import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyTickets } from "../../services/ticketService";

export default function MyTickets() {

  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);

  useEffect(() => {

    if (!user) return;

    loadTickets();

  }, [user]);

  const loadTickets = async () => {

    const data = await getMyTickets(user.uid);

    setTickets(data);

  };

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
              padding: 15,
              marginBottom: 15,
              borderRadius: 8
            }}
          >

            <h3>{ticket.event.title}</h3>

            <p>

              <strong>Ticket Number:</strong>

              {" "}

              {ticket.ticketNumber}

            </p>

            <p>

              <strong>Status:</strong>

              {" "}

              {ticket.status}

            </p>

            <p>

              <strong>Date:</strong>

              {" "}

              {ticket.event.date}

            </p>

            <p>

              <strong>Location:</strong>

              {" "}

              {ticket.event.location}

            </p>

          </div>

        ))

      )}

    </div>
  );
}