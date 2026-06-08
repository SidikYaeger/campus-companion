import { Link, Outlet } from "react-router-dom";

function Layout() {
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
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
