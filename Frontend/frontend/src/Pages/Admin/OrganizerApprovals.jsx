import { useEffect, useState } from "react";

import {
  getOrganizerApplications,
  approveOrganizer,
  rejectOrganizer
} from "../../services/adminService";

export default function OrganizerApprovals() {

  const [applications, setApplications] = useState([]);

  const loadApplications = async () => {

    const data = await getOrganizerApplications();

    setApplications(data);

  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (application) => {

    await approveOrganizer(application);

    alert("Organizer Approved!");

    loadApplications();

  };

  const handleReject = async (application) => {

    await rejectOrganizer(application);

    alert("Organizer Rejected!");

    loadApplications();

  };

  return (
    <div>

      <h1>Organizer Applications (Admin)</h1>

      {applications.length === 0 && (
        <p>No applications yet.</p>
      )}

      {applications.map((application) => (

        <div
          key={application.id}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10,
            borderRadius: 8
          }}
        >

          <h3>{application.organizationName}</h3>

          <p>Type: {application.organizationType}</p>

          <p>Phone: {application.phone}</p>

          <p>Email: {application.email}</p>

          <p>Status: {application.status}</p>

          <button
            onClick={() => handleApprove(application)}
            disabled={application.status !== "pending"}
          >
            Approve
          </button>

          <button
            onClick={() => handleReject(application)}
            disabled={application.status !== "pending"}
            style={{ marginLeft: 10 }}
          >
            Reject
          </button>

        </div>

      ))}

    </div>
  );
}