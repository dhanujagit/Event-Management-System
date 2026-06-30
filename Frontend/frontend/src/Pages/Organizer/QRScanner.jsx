import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase";

import { incrementAttendance } from "../../services/eventService";
import { logScan } from "../../services/scanLogService";

export default function QRScanner() {
  const [message, setMessage] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [status, setStatus] = useState("idle");

  const scannerRef = useRef(null);
  const scanLock = useRef(false);

  // SOUND
  const playBeep = (type) => {
    const audio = new Audio(
      type === "success"
        ? "/sounds/success.mp3"
        : "/sounds/error.mp3"
    );

    audio.play().catch(() => {});
  };

  // START SCANNER
  const startScanner = () => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(onScanSuccess);
    scannerRef.current = scanner;
  };

  // MANUAL RESET ONLY
  const resetScanner = async () => {
    setMessage("");
    setTicketInfo(null);
    setEventInfo(null);
    setStatus("idle");
    scanLock.current = false;

    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }

    startScanner();
  };

  // SCAN LOGIC
  const onScanSuccess = async (decodedText) => {
    if (scanLock.current) return;
    scanLock.current = true;

    try {
      const data = JSON.parse(decodedText);

      const q = query(
        collection(db, "tickets"),
        where("ticketNumber", "==", data.ticketNumber)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setStatus("error");
        setMessage("Ticket not found");
        playBeep("error");

        await logScan({
          ticketNumber: data.ticketNumber,
          eventId: null,
          userId: null,
          status: "error",
          eventTitle: ""
        });

        return;
      }

      const ticketDoc = snap.docs[0];
      const ticketRef = doc(db, "tickets", ticketDoc.id);
      const ticket = ticketDoc.data();

      const eventSnap = await getDoc(doc(db, "events", ticket.eventId));
      const eventData = eventSnap.exists() ? eventSnap.data() : null;

      setTicketInfo(ticket);
      setEventInfo(eventData);

      if (ticket.checkedIn) {
        setStatus("used");
        setMessage("Already Checked In");
        playBeep("error");
        return;
      }

      if (ticket.eventId !== data.eventId) {
        setStatus("error");
        setMessage("Event mismatch");
        playBeep("error");
        return;
      }

      await updateDoc(ticketRef, {
        checkedIn: true,
        checkedInAt: new Date()
      });

      await incrementAttendance(ticket.eventId);

      setStatus("success");
      setMessage("Check-in Successful 🎉");
      playBeep("success");

      await logScan({
        ticketNumber: ticket.ticketNumber,
        eventId: ticket.eventId,
        userId: ticket.userId,
        status: "success",
        eventTitle: eventData?.title || ""
      });

    } catch (err) {
      console.error(err);

      setStatus("error");
      setMessage("Invalid QR Code");
      playBeep("error");
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const getColor = () => {
    if (status === "success") return "#9cffb3";
    if (status === "error") return "#74020b";
    if (status === "used") return "#74020b";
    return "#ffffff";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>QR Scanner 📸</h2>

      {eventInfo && (
        <h3 style={{ marginBottom: 10 }}>
          🎪 {eventInfo.title}
        </h3>
      )}

      <div id="reader" style={{ width: "300px", margin: "auto" }} />

      <div
        style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 8,
          backgroundColor: getColor(),
          width: 300,
          marginInline: "auto"
        }}
      >
        <h3>{message}</h3>

        {ticketInfo && (
          <>
            <p><strong>Ticket:</strong> {ticketInfo.ticketNumber}</p>
            <p><strong>Status:</strong> {ticketInfo.status}</p>
            <p><strong>User:</strong> {ticketInfo.userId}</p>
          </>
        )}
      </div>

      {/* MANUAL RESET ONLY */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={resetScanner}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Scan Another Ticket
        </button>
      </div>
    </div>
  );
}