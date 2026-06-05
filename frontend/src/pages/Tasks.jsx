import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const initialForm = {
  title: "",
  description: "",
  deadline: "",
  status: "NOT_STARTED",
  priority: "MEDIUM",
  courseId: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  useEffect(() => {
    fetchTasks();
    fetchCourses();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError("Failed to load tasks");
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/tasks", {
        ...form,
        deadline: form.deadline ? `${form.deadline}:00` : null,
        courseId: form.courseId ? Number(form.courseId) : null,
      });

      setForm(initialForm);
      fetchTasks();
    } catch (err) {
      setError("Failed to create task. Please check your input.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this task?");

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleMarkDone = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: "DONE",
        priority: task.priority,
        courseId: task.course?.id,
      });

      fetchTasks();
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    return new Date(deadline).toLocaleString();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;

    const matchesCourse =
      courseFilter === "ALL" || task.course?.id === Number(courseFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesCourse;
  });

  return (
    <>
      <header className="app-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h1>Task Manager</h1>
          <p className="subtitle">
            Add and manage your assignments, deadlines, and study tasks.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>Add Task</h2>
          <p>Create a new task and connect it to a course.</p>
        </div>

        {error && <p className="error-box">{error}</p>}

        {courses.length === 0 ? (
          <div className="empty-state">
            You need to add a course first before creating tasks.
          </div>
        ) : (
          <form className="task-form" onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />

            <select name="courseId" value={form.courseId} onChange={handleChange}>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <button type="submit">Add Task</button>
          </form>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Task List</h2>
          <p>{filteredTasks.length} task(s) shown.</p>
        </div>

        <div className="filter-bar">
          <input
            placeholder="Search task..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
          >
            <option value="ALL">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">No matching tasks.</div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div className="task-card" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                  <span>{task.course?.name}</span>
                </div>

                <div className="task-meta">
                  <strong>{task.priority}</strong>
                  <small>{task.status}</small>
                  <small>{formatDeadline(task.deadline)}</small>

                  {task.status !== "DONE" && (
                    <button
                      className="done-button"
                      onClick={() => handleMarkDone(task)}
                    >
                      Mark Done
                    </button>
                  )}

                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Tasks;