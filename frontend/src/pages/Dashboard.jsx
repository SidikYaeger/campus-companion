import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pad = (value) => String(value).padStart(2, "0");

  const toLocalDateTimeString = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);

      const summaryResponse = await api.get("/dashboard/summary");
      const tasksResponse = await api.get("/dashboard/upcoming-tasks");
      const eventsResponse = await api.get("/calendar-events", {
        params: {
          start: toLocalDateTimeString(now),
          end: toLocalDateTimeString(next7Days),
        },
      });

      setSummary(summaryResponse.data);
      setUpcomingTasks(tasksResponse.data);
      setUpcomingEvents(eventsResponse.data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "No date";
    return new Date(dateTime).toLocaleString();
  };

  const formatEventTime = (startDateTime, endDateTime) => {
    const start = new Date(startDateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const end = new Date(endDateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${start} - ${end}`;
  };

  const getReminderLabel = (minutes) => {
    if (minutes === 0) return "No reminder";
    if (minutes < 60) return `${minutes} minutes before`;
    if (minutes === 60) return "1 hour before";
    if (minutes === 1440) return "1 day before";

    return `${minutes} minutes before`;
  };

  if (loading) {
    return <p className="loading-text">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <>
      <header className="app-header">
        <div>
          <p className="eyebrow">Campus Companion</p>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Track your courses, assignments, activities, and semester workload.
          </p>
        </div>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <p>Total Courses</p>
          <h2>{summary.totalCourses}</h2>
        </div>

        <div className="summary-card">
          <p>Total Tasks</p>
          <h2>{summary.totalTasks}</h2>
        </div>

        <div className="summary-card">
          <p>Pending Tasks</p>
          <h2>{summary.pendingTasks}</h2>
        </div>

        <div className="summary-card danger-card">
          <p>Overdue</p>
          <h2>{summary.overdueTasks}</h2>
        </div>

        <div className="summary-card warning-card">
          <p>Due Soon</p>
          <h2>{summary.dueSoonTasks}</h2>
        </div>

        <div className="summary-card">
          <p>Completed Tasks</p>
          <h2>{summary.completedTasks}</h2>
        </div>

        <div className="summary-card">
          <p>High Priority</p>
          <h2>{summary.highPriorityTasks}</h2>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="section">
          <div className="section-header">
            <h2>Upcoming Tasks</h2>
            <p>Your nearest academic deadlines</p>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="empty-state">No upcoming tasks yet.</div>
          ) : (
            <div className="task-list">
              {upcomingTasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description"}</p>
                    <span>{task.course?.name}</span>
                  </div>

                  <div className="task-meta">
                    <strong>{task.priority}</strong>
                    <small>{task.status}</small>
                    <small>{formatDateTime(task.deadline)}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Upcoming Calendar Events</h2>
            <p>Your activities for the next 7 days</p>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="empty-state">No upcoming events yet.</div>
          ) : (
            <div className="event-list">
              {upcomingEvents.map((event) => (
                <div className="event-card" key={event.id}>
                  <div>
                    <h3>{event.title}</h3>
                    <p>{event.description || "No description"}</p>
                    <span>{event.type}</span>
                  </div>

                  <div className="event-meta">
                    <strong>
                      {new Date(event.startDateTime).toLocaleDateString()}
                    </strong>
                    <small>
                      {formatEventTime(event.startDateTime, event.endDateTime)}
                    </small>
                    <small>
                      Reminder: {getReminderLabel(event.reminderMinutesBefore)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Dashboard;