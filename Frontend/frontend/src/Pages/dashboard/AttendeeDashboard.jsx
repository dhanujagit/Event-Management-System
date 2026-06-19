import Events from "./Events";
import LogoutButton from "../../components/LogoutButton";


export default function AttendeeDashboard() {
  return (
    <div>
      <h1>Attendee Dashboard</h1>
      <Events />
      <LogoutButton />
    </div>
  );
}
