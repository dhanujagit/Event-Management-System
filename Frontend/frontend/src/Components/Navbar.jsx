import { logoutUser } from "../auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      background: "#111",
      color: "white"
    }}>
      <h3>Event App</h3>

      {user && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}