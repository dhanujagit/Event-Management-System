import Events from "./Events";
import MyTickets from "./MyTickets";
import LogoutButton from "../../components/LogoutButton";
import Navbar from "../../components/Navbar";

export default function AttendeeDashboard() {
  return (
    <div>
      <Navbar />

      <h1>Attendee Dashboard</h1>

      <MyTickets />

      <Events />

      <LogoutButton />
    </div>
  );
}