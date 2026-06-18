import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role } = useAuth();

  // not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // role not loaded yet
  if (role === null) {
    return <h1>Loading...</h1>;
  }

  // check permission
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}