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

import QRScanner from "./pages/organizer/QRScanner";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, role, loading } = useAuth();

  //HARD STOP UNTIL AUTH LOADS
  if (loading) {
    return <div style={{ padding: 20 }}>Loading app...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= ROOT ================= */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* ================= ROLE SELECTION ================= */}
        <Route
          path="/select-role"
          element={
            !user ? (
              <Navigate to="/" replace />
            ) : role ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SelectRole />
            )
          }
        />

        {/* ================= ORGANIZER APPLICATION ================= */}
        <Route
          path="/organizer-application"
          element={
            !user ? (
              <Navigate to="/" replace />
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
              <Navigate to="/" replace />
            ) : !role ? (
              <Navigate to="/select-role" replace />
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

        {/* ================= SCANNER ROUTE =============== */}
        <Route
          path="/scanner"
          element={
            <ProtectedRoute allowedRoles={["organizer", "admin"]}>
              <QRScanner />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/organizers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrganizerApprovals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EventApprovals />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;