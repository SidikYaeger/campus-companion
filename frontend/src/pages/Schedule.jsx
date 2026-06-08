import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import { getApiErrorMessage } from "../api/errorMessage";

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Schedule() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load data."));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadCourses]);

  const groupedCourses = useMemo(() => {
    const groups = dayOrder.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    courses.forEach((course) => {
      const day = course.day || "Other";

      if (!groups[day]) {
        groups[day] = [];
      }

      groups[day].push(course);
    });

    Object.values(groups).forEach((dayCourses) => {
      dayCourses.sort((a, b) => {
        const first = a.startTime || "99:99";
        const second = b.startTime || "99:99";
        return first.localeCompare(second);
      });
    });

    return groups;
  }, [courses]);

  const visibleDays = useMemo(() => {
    const extraDays = Object.keys(groupedCourses).filter(
      (day) => !dayOrder.includes(day)
    );

    return [...dayOrder, ...extraDays];
  }, [groupedCourses]);

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  if (error) {
    return (
      <div className="state-panel error-state page-state">
        <p>{error}</p>
        <button type="button" onClick={loadCourses}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="app-header">
        <div>
          <p className="eyebrow">Schedule</p>
          <h1>Weekly Schedule</h1>
          <p className="subtitle">
            See your course timetable grouped by day and ordered by start time.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>Course Timetable</h2>
          <p>{courses.length} course(s) scheduled this semester.</p>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            No courses added yet.
          </div>
        ) : (
          <div className="schedule-grid">
            {visibleDays.map((day) => {
              const dayCourses = groupedCourses[day] || [];

              return (
                <div className="schedule-day" key={day}>
                  <div className="schedule-day-header">
                    <h3>{day}</h3>
                    <span>{dayCourses.length}</span>
                  </div>

                  {dayCourses.length === 0 ? (
                    <div className="schedule-empty">No classes</div>
                  ) : (
                    <div className="schedule-course-list">
                      {dayCourses.map((course) => (
                        <article className="schedule-course" key={course.id}>
                          <div className="schedule-time">
                            {course.startTime?.slice(0, 5) || "--:--"} -{" "}
                            {course.endTime?.slice(0, 5) || "--:--"}
                          </div>

                          <h4>{course.name}</h4>
                          <p>{course.lecturer}</p>

                          <div className="schedule-course-meta">
                            <span>{course.room}</span>
                            <strong>{course.sks} SKS</strong>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default Schedule;
