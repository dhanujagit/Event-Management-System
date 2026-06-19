import { logoutUser } from "../auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/"); // back to login page
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}