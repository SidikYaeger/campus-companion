import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const initialForm = {
  name: "",
  lecturer: "",
  room: "",
  day: "",
  startTime: "",
  endTime: "",
  sks: 3,
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      startTime: form.startTime ? `${form.startTime}:00` : null,
      endTime: form.endTime ? `${form.endTime}:00` : null,
      sks: Number(form.sks),
    };

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
      } else {
        await api.post("/courses", payload);
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      setError("Failed to save course. Please check your input.");
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);

    setForm({
      name: course.name || "",
      lecturer: course.lecturer || "",
      room: course.room || "",
      day: course.day || "",
      startTime: course.startTime ? course.startTime.slice(0, 5) : "",
      endTime: course.endTime ? course.endTime.slice(0, 5) : "",
      sks: course.sks || 3,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this course?");

    if (!confirmed) return;

    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError("Failed to delete course. This course may still have related tasks.");
      console.error(err);
    }
  };

  return (
    <>
      <header className="app-header">
        <div>
          <p className="eyebrow">Courses</p>
          <h1>Course Manager</h1>
          <p className="subtitle">
            Add and manage your semester courses.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>{editingId ? "Edit Course" : "Add Course"}</h2>
          <p>
            {editingId
              ? "Update the selected course information."
              : "Create a new course for this semester."}
          </p>
        </div>

        {error && <p className="error-box">{error}</p>}

        <form className="course-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Course name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="lecturer"
            placeholder="Lecturer"
            value={form.lecturer}
            onChange={handleChange}
          />

          <input
            name="room"
            placeholder="Room"
            value={form.room}
            onChange={handleChange}
          />

          <select name="day" value={form.day} onChange={handleChange}>
            <option value="">Select day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>

          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />

          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />

          <input
            type="number"
            name="sks"
            min="1"
            max="6"
            value={form.sks}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "Update Course" : "Add Course"}
          </button>

          {editingId && (
            <button type="button" className="cancel-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Course List</h2>
          <p>{courses.length} course(s) registered.</p>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">No courses yet.</div>
        ) : (
          <div className="course-list">
            {courses.map((course) => (
              <div className="course-card" key={course.id}>
                <div>
                  <h3>{course.name}</h3>
                  <p>{course.lecturer}</p>
                  <span>
                    {course.day}, {course.startTime} - {course.endTime}
                  </span>
                </div>

                <div className="course-meta">
                  <strong>{course.sks} SKS</strong>
                  <small>{course.room}</small>

                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
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

export default Courses;