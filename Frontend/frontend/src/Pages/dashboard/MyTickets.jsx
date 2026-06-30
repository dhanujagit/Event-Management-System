import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyTickets } from "../../services/ticketService";
import { QRCodeCanvas } from "qrcode.react";

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

  // DOWNLOAD QR
  const downloadQR = (ticketNumber) => {
    const canvas = document.getElementById(ticketNumber);

    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${ticketNumber}.png`;
    link.click();
  };

  return (
    <div>
      <h2>My Tickets 🎫</h2>

      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        tickets.map((ticket) => {
          const qrValue = JSON.stringify({
            ticketNumber: ticket.ticketNumber,
            userId: ticket.userId,
            eventId: ticket.eventId
          });

          return (
            <div
              key={ticket.id}
              style={{
                border: "1px solid gray",
                padding: 15,
                marginBottom: 15,
                borderRadius: 10,
                textAlign: "center"
              }}
            >
              <h3>{ticket.event.title}</h3>

              <p>
                <strong>Ticket Number:</strong>{" "}
                {ticket.ticketNumber}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {ticket.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {ticket.event.date}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {ticket.event.location}
              </p>

              {/* QR CODE */}
              <div style={{ marginTop: 15 }}>
                <QRCodeCanvas
                  id={ticket.ticketNumber}
                  value={qrValue}
                  size={180}
                />
              </div>

              {/* DOWNLOAD BUTTON */}
              <button
                onClick={() => downloadQR(ticket.ticketNumber)}
                style={{
                  marginTop: 10,
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                Download QR
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}