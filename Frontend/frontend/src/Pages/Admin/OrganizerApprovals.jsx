import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function OrganizerApprovals() {
  const [applications, setApplications] = useState([]);

  // FETCH APPLICATIONS
  const fetchApplications = async () => {
    const snapshot = await getDocs(collection(db, "organizerApplications"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setApplications(data);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // APPROVE ORGANIZER
  const approveOrganizer = async (app) => {
    // 1. update user role
    await updateDoc(doc(db, "users", app.uid), {
      role: "organizer"
    });

    // 2. update application status
    await updateDoc(doc(db, "organizerApplications", app.id), {
      status: "approved"
    });

    alert("Organizer Approved!");
    fetchApplications();
  };

  // REJECT ORGANIZER
  const rejectOrganizer = async (app) => {
    await updateDoc(doc(db, "organizerApplications", app.id), {
      status: "rejected"
    });

    // revert user back to attendee
    await updateDoc(doc(db, "users", app.uid), {
      role: "attendee"
    });

    alert("Organizer Rejected!");
    fetchApplications();
  };

  return (
    <div>
      <h1>Organizer Applications (Admin)</h1>

      {applications.length === 0 && <p>No applications yet</p>}

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10
          }}
        >
          <h3>{app.organizationName}</h3>
          <p>Type: {app.organizationType}</p>
          <p>Phone: {app.phone}</p>
          <p>Email: {app.email}</p>
          <p>Status: {app.status}</p>

          <button
            onClick={() => approveOrganizer(app)}
            disabled={app.status !== "pending"}
          >
            Approve
          </button>

          <button
            onClick={() => rejectOrganizer(app)}
            disabled={app.status !== "pending"}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}