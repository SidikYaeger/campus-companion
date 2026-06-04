import { useEffect, useState } from "react";
import api from "./api/axiosConfig";
import "./App.css";

function App() {
  const [summary, setSummary] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const summaryResponse = await api.get("/dashboard/summary");
      const tasksResponse = await api.get("/dashboard/upcoming-tasks");

      setSummary(summaryResponse.data);
      setUpcomingTasks(tasksResponse.data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Campus Companion</p>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Track your courses, assignments, and semester workload.
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

        <div className="summary-card">
          <p>Completed Tasks</p>
          <h2>{summary.completedTasks}</h2>
        </div>

        <div className="summary-card">
          <p>High Priority</p>
          <h2>{summary.highPriorityTasks}</h2>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Upcoming Tasks</h2>
          <p>Your nearest deadlines</p>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="empty-state">
            No upcoming tasks yet.
          </div>
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
                  <small>{new Date(task.deadline).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;