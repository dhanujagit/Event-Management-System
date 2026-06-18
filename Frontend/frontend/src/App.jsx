import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import PendingOrganizerPage from "./pages/PendingOrganizerPage";
import OrganizerApplication from "./pages/OrganizerApplication";

import AttendeeDashboard from "./pages/dashboard/AttendeeDashboard";
import OrganizerDashboard from "./pages/dashboard/OrganizerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import OrganizerApprovals from "./pages/admin/OrganizerApprovals";
import EventApprovals from "./pages/admin/EventApprovals";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, role, loading } = useAuth();

  //prevent flicker while Firebase loads user
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        {/* ================= ROLE SELECTION ================= */}
        <Route
          path="/select-role"
          element={
            !user ? (
              <Navigate to="/" />
            ) : role === null ? (
              <SelectRole />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* ================= ORGANIZER APPLICATION ================= */}
        <Route
          path="/organizer-application"
          element={
            !user ? (
              <Navigate to="/" />
            ) : (
              <OrganizerApplication />
            )
          }
        />

        {/* ================= DASHBOARD ROUTER ================= */}
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/" />
            ) : role === null ? (
              <Navigate to="/select-role" />
            ) : role === "admin" ? (
              <AdminDashboard />
            ) : role === "organizer" ? (
              <OrganizerDashboard />
            ) : role === "pending_organizer" ? (
              <PendingOrganizerPage />
            ) : (
              <AttendeeDashboard />
            )
          }
        />

        {/* ================= ADMIN ROUTES (PROTECTED) ================= */}
        <Route
          path="/admin/organizers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrganizerApprovals />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

        <Route
        path="/admin/events"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EventApprovals />
          </ProtectedRoute>
        }
      />

      </Routes>
    </BrowserRouter>
  );
}

export default App;