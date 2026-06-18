import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrganizerApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "organizerApplications"), {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,

      organizationName,
      organizationType,
      phone,
      description,

      status: "pending",
      submittedAt: new Date()
    });

    await updateDoc(doc(db, "users", user.uid), {
      role: "pending_organizer"
    });

    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Organizer Application</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Organization Name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={organizationType}
          onChange={(e) => setOrganizationType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="University Club">University Club</option>
          <option value="Company">Company</option>
          <option value="NGO">NGO</option>
          <option value="Community Group">Community Group</option>
          <option value="Other">Other</option>
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Contact Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Describe your organization"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">
          Submit Application
        </button>

      </form>
    </div>
  );
}