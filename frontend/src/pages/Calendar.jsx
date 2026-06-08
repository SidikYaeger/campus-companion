import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import { getApiErrorMessage } from "../api/errorMessage";

const initialForm = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  type: "PERSONAL",
  reminderMinutesBefore: 30,
};

const allowedEventTypes = ["PERSONAL", "ACADEMIC", "ORGANIZATION"];

const pad = (value) => String(value).padStart(2, "0");

const toLocalDateTimeString = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;

const getDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getFormDate = (dateTime) => (dateTime ? dateTime.slice(0, 10) : "");

const getFormTime = (dateTime) => (dateTime ? dateTime.slice(11, 16) : "");

function Calendar() {
  const today = useMemo(() => new Date(), []);

  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingEventId, setEditingEventId] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");

  const [year, month] = selectedMonth.split("-").map(Number);

  const monthLabel = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const fetchEvents = useCallback(async (options = {}) => {
    const { showLoading = false } = options;

    try {
      if (showLoading) setLoading(true);
      setLoadError("");

      const start = new Date(year, month - 1, 1, 0, 0, 0);
      const end = new Date(year, month, 0, 23, 59, 59);

      const response = await api.get("/calendar-events", {
        params: {
          start: toLocalDateTimeString(start),
          end: toLocalDateTimeString(end),
        },
      });

      setEvents(response.data);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Failed to load data."));
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents({ showLoading: true });
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const blanks = Array.from({ length: firstDay.getDay() }, () => null);

    const days = Array.from({ length: lastDay.getDate() }, (_, index) => {
      return new Date(year, month - 1, index + 1);
    });

    return [...blanks, ...days];
  }, [month, year]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const key = getDateKey(new Date(event.startDateTime));

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(event);
      return acc;
    }, {});
  }, [events]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingEventId(null);
    setError("");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Event title is required.";
    }

    if (!form.date) {
      return "Event date is required.";
    }

    if (!form.startTime || !form.endTime) {
      return "Start time and end time are required.";
    }

    const startDateTime = new Date(`${form.date}T${form.startTime}:00`);
    const endDateTime = new Date(`${form.date}T${form.endTime}:00`);

    if (startDateTime >= endDateTime) {
      return "End time must be after start time.";
    }

    if (Number(form.reminderMinutesBefore) < 0) {
      return "Reminder cannot be negative.";
    }

    if (!allowedEventTypes.includes(form.type)) {
      return "Event type must be Personal, Academic, or Organization.";
    }

    return "";
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description,
    startDateTime: `${form.date}T${form.startTime}:00`,
    endDateTime: `${form.date}T${form.endTime}:00`,
    type: form.type,
    reminderMinutesBefore: Number(form.reminderMinutesBefore),
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

      if (editingEventId) {
        await api.put(`/calendar-events/${editingEventId}`, payload);
      } else {
        await api.post("/calendar-events", payload);
      }

      resetForm();
      await fetchEvents();
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          editingEventId
            ? "Failed to update event. Please check your input."
            : "Failed to create event. Please check your input."
        )
      );
      console.error(err);
    } finally {
      setBusyAction("");
    }
  };

  const handleEdit = (event) => {
    setEditingEventId(event.id);
    setError("");

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: getFormDate(event.startDateTime),
      startTime: getFormTime(event.startDateTime),
      endTime: getFormTime(event.endDateTime),
      type: allowedEventTypes.includes(event.type) ? event.type : "PERSONAL",
      reminderMinutesBefore: event.reminderMinutesBefore ?? 30,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this event?");

    if (!confirmed) return;

    try {
      setBusyAction(`delete-${id}`);
      await api.delete(`/calendar-events/${id}`);
      await fetchEvents();

      if (editingEventId === id) {
        resetForm();
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete event."));
      console.error(err);
    } finally {
      setBusyAction("");
    }
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <header className="app-header">
        <div>
          <p className="eyebrow">Calendar</p>
          <h1>Activity Calendar</h1>
          <p className="subtitle">
            Plan your activities, meetings, study sessions, and reminders.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>{editingEventId ? "Edit Activity" : "Add Activity"}</h2>
          <p>
            {editingEventId
              ? "Update the selected calendar event."
              : "Create a simple calendar event outside your course schedule."}
          </p>
        </div>

        {error && <p className="error-box">{error}</p>}

        <form className="calendar-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Activity title"
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
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

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

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="PERSONAL">Personal</option>
            <option value="ACADEMIC">Academic</option>
            <option value="ORGANIZATION">Organization</option>
          </select>

          <select
            name="reminderMinutesBefore"
            value={form.reminderMinutesBefore}
            onChange={handleChange}
          >
            <option value={0}>No reminder</option>
            <option value={10}>10 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>1 hour before</option>
            <option value={1440}>1 day before</option>
          </select>

          <button type="submit" disabled={busyAction !== ""}>
            {busyAction === "save"
              ? "Saving..."
              : editingEventId
                ? "Update Event"
                : "Add Event"}
          </button>

          {editingEventId && (
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
      </section>

      <section className="section">
        <div className="calendar-toolbar">
          <div>
            <h2>{monthLabel}</h2>
            <p>{events.length} event(s) this month.</p>
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => {
              setLoading(true);
              setSelectedMonth(event.target.value);
            }}
          />
        </div>

        <div className="calendar-weekdays">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : loadError ? (
          <div className="state-panel error-state">
            <p>{loadError}</p>
            <button type="button" onClick={() => fetchEvents({ showLoading: true })}>
              Try again
            </button>
          </div>
        ) : (
          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <div className="calendar-cell empty" key={`empty-${index}`} />
                );
              }

              const key = getDateKey(day);
              const dayEvents = eventsByDate[key] || [];
              const isToday = getDateKey(day) === getDateKey(today);

              return (
                <div
                  className={`calendar-cell ${isToday ? "today" : ""}`}
                  key={key}
                >
                  <div className="calendar-date">{day.getDate()}</div>

                  <div className="calendar-events">
                    {dayEvents.length === 0 ? (
                      <div className="calendar-empty-day">
                        No events on this date.
                      </div>
                    ) : (
                      dayEvents.map((event) => (
                        <div className="calendar-event" key={event.id}>
                          <div>
                            <strong>{event.title}</strong>
                            <small>
                              {formatTime(event.startDateTime)} -{" "}
                              {formatTime(event.endDateTime)}
                            </small>
                            <span>{event.type}</span>
                          </div>

                          <div className="calendar-event-actions">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => handleEdit(event)}
                              disabled={busyAction !== ""}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => handleDelete(event.id)}
                              disabled={busyAction !== ""}
                            >
                              {busyAction === `delete-${event.id}`
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default Calendar;
