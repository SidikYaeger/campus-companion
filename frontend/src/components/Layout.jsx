import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Campus Companion</h2>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/schedule">Schedule</Link>
          <Link to="/calendar">Calendar</Link>
        </nav>

        <div className="sidebar-account">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
