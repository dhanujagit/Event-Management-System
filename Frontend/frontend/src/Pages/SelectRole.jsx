import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    // 👇 ATTENDEE FLOW (direct)
    if (selectedRole === "attendee") {
      await updateDoc(doc(db, "users", user.uid), {
        role: "attendee"
      });

      navigate("/dashboard");
      return;
    }

    // 👇 ORGANIZER FLOW (go to form)
    if (selectedRole === "organizer") {
      navigate("/organizer-application");
      return;
    }
  };

  return (
    <div>
      <h1>Select Role</h1>

      <button onClick={() => setSelectedRole("attendee")}>
        Attendee
      </button>

      <button onClick={() => setSelectedRole("organizer")}>
        Organizer
      </button>

      <br /><br />

      <button onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}