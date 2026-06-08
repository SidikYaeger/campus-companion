import { useCallback, useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { getApiErrorMessage } from "../api/errorMessage";

const initialForm = {
  title: "",
  description: "",
  deadline: "",
  status: "NOT_STARTED",
  priority: "MEDIUM",
  courseId: "",
};

const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
const allowedStatuses = ["NOT_STARTED", "IN_PROGRESS", "DONE"];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  const loadData = useCallback(async (options = {}) => {
    const { showLoading = false } = options;

    try {
      if (showLoading) setLoading(true);
      setLoadError("");

      const [tasksResponse, coursesResponse] = await Promise.all([
        api.get("/tasks"),
        api.get("/courses"),
      ]);

      setTasks(tasksResponse.data);
      setCourses(coursesResponse.data);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Failed to load data."));
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData({ showLoading: true });
    }, 0);

    return () => clearTimeout(timer);
  }, [loadData]);

  async function fetchTasks() {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Failed to load data."));
      console.error(err);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Task title is required.";
    }

    const selectedCourseId = Number(form.courseId);
    const hasValidCourse = courses.some((course) => course.id === selectedCourseId);

    if (!selectedCourseId || !hasValidCourse) {
      return "Please select a valid course.";
    }

    if (!allowedPriorities.includes(form.priority)) {
      return "Priority must be Low, Medium, or High.";
    }

    if (!allowedStatuses.includes(form.status)) {
      return "Status must be Not Started, In Progress, or Done.";
    }

    if (form.deadline && Number.isNaN(new Date(form.deadline).getTime())) {
      return "Deadline must be a valid date and time.";
    }

    return "";
  };

  const buildPayload = () => ({
    ...form,
    title: form.title.trim(),
    deadline: form.deadline ? `${form.deadline}:00` : null,
    courseId: form.courseId ? Number(form.courseId) : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setBusyAction("save");

    try {
      const payload = buildPayload();

      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      resetForm();
      await fetchTasks();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Failed to save task. Please check your input.")
      );
      console.error(err);
    } finally {
      setBusyAction("");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      deadline: task.deadline ? task.deadline.slice(0, 16) : "",
      status: task.status || "NOT_STARTED",
      priority: task.priority || "MEDIUM",
      courseId: task.course?.id || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this task?");

    if (!confirmed) return;

    try {
      setBusyAction(`delete-${id}`);
      await api.delete(`/tasks/${id}`);
      await fetchTasks();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete task."));
      console.error(err);
    } finally {
      setBusyAction("");
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      setBusyAction(`status-${task.id}`);
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: newStatus,
        priority: task.priority,
        courseId: task.course?.id,
      });

      await fetchTasks();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update task status."));
      console.error(err);
    } finally {
      setBusyAction("");
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    return new Date(deadline).toLocaleString();
  };

  const getDeadlineStatus = (task) => {
  if (task.status === "DONE") {
    return "DONE";
  }

  if (!task.deadline) {
    return "NO_DEADLINE";
  }

  const now = new Date();
  const deadline = new Date(task.deadline);
  const diffMs = deadline - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    return "OVERDUE";
  }

  if (diffHours <= 24) {
    return "DUE_SOON";
  }

  return "UPCOMING";
};

const getDeadlineLabel = (task) => {
  const status = getDeadlineStatus(task);

  switch (status) {
    case "DONE":
      return "Done";
    case "OVERDUE":
      return "Overdue";
    case "DUE_SOON":
      return "Due Soon";
    case "UPCOMING":
      return "Upcoming";
    default:
      return "No Deadline";
  }
};

  const filteredTasks = tasks
  .filter((task) => {
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
  })
  .sort((a, b) => {
    if (a.status === "DONE" && b.status !== "DONE") return 1;
    if (a.status !== "DONE" && b.status === "DONE") return -1;

    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    return new Date(a.deadline) - new Date(b.deadline);
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
          <h2>{editingId ? "Edit Task" : "Add Task"}</h2>
          <p>
            {editingId
              ? "Update the selected task information."
              : "Create a new task and connect it to a course."}
          </p>
        </div>

        {error && <p className="error-box">{error}</p>}

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : loadError ? (
          <div className="state-panel error-state">
            <p>{loadError}</p>
            <button type="button" onClick={() => loadData({ showLoading: true })}>
              Try again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            No courses added yet.
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

            <button type="submit" disabled={busyAction !== ""}>
              {busyAction === "save"
                ? "Saving..."
                : editingId
                  ? "Update Task"
                  : "Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
                disabled={busyAction !== ""}
              >
                Cancel
              </button>
            )}
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

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : loadError ? (
          <div className="state-panel error-state">
            <p>{loadError}</p>
            <button type="button" onClick={() => loadData({ showLoading: true })}>
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            No tasks yet. Add your first task to start organizing your study plan.
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">No matching tasks.</div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div
                className={`task-card ${getDeadlineStatus(task).toLowerCase()}`}
                key={task.id}
              >
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                  <span>{task.course?.name}</span>
                </div>

                <div className="task-meta">
                  <strong>{task.priority}</strong>
                  <small>{task.status}</small>

                  <span className={`deadline-badge ${getDeadlineStatus(task).toLowerCase()}`}>
                    {getDeadlineLabel(task)}
                  </span>

                  <small>{formatDeadline(task.deadline)}</small>

                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(task)}
                      disabled={busyAction !== ""}
                    >
                      Edit
                    </button>

                    {task.status !== "DONE" ? (
                      <button
                        className="done-button"
                        onClick={() => handleUpdateStatus(task, "DONE")}
                        disabled={busyAction !== ""}
                      >
                        {busyAction === `status-${task.id}`
                          ? "Updating..."
                          : "Done"}
                      </button>
                    ) : (
                      <button
                        className="undone-button"
                        onClick={() => handleUpdateStatus(task, "NOT_STARTED")}
                        disabled={busyAction !== ""}
                      >
                        {busyAction === `status-${task.id}`
                          ? "Updating..."
                          : "Undone"}
                      </button>
                    )}

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(task.id)}
                      disabled={busyAction !== ""}
                    >
                      {busyAction === `delete-${task.id}`
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
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
