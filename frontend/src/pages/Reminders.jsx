import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function Reminders() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    reminder_type: "medicine",
    reminder_time: "",
    reminder_date: "",
    notes: "",
  });

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("memorycare_user");

      if (!storedUser) return null;

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  // ==========================================
  // LOAD REMINDERS
  // ==========================================

  useEffect(() => {
    const user = getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    let active = true;

    fetch(apiUrl(`/api/reminders/${user.id}`))
      .then(async (response) => ({
        response,
        data: await response.json(),
      }))
      .then(({ response, data }) => {
        if (!active) return;

        if (!response.ok || !data.success) {
          setError(data.message || "Unable to load reminders.");
          return;
        }

        setReminders(data.reminders || []);
        setError("");
      })
      .catch((error) => {
        console.error("Load reminders error:", error);

        if (active) {
          setError("Unable to connect to the server.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // CREATE REMINDER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = getUser();

    if (!user) {
      setError("Please login first.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a reminder title.");
      return;
    }

    if (!form.reminder_time) {
      setError("Please select a time.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(apiUrl("/api/reminders"), {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.id,
          title: form.title.trim(),
          reminder_type: form.reminder_type,
          reminder_time: form.reminder_time,
          reminder_date: form.reminder_date || null,
          notes: form.notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to create reminder.");
        return;
      }

      setReminders((previous) => [
        ...previous,
        data.reminder,
      ]);

      setForm({
        title: "",
        reminder_type: "medicine",
        reminder_time: "",
        reminder_date: "",
        notes: "",
      });

      setError("");
    } catch (error) {
      console.error("Create reminder error:", error);

      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // COMPLETE REMINDER
  // ==========================================

  const toggleComplete = async (reminder) => {
    try {
      const response = await fetch(
        apiUrl(`/api/reminders/${reminder.id}/complete`),
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            completed: !reminder.is_completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to update reminder.");
        return;
      }

      setReminders((previous) =>
        previous.map((item) =>
          item.id === reminder.id
            ? {
                ...item,
                is_completed: !item.is_completed,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Complete reminder error:", error);

      setError("Unable to connect to the server.");
    }
  };

  // ==========================================
  // DELETE REMINDER
  // ==========================================

  const deleteReminder = async (id) => {
    try {
      const response = await fetch(
        apiUrl(`/api/reminders/${id}`),
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to delete reminder.");
        return;
      }

      setReminders((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete reminder error:", error);

      setError("Unable to connect to the server.");
    }
  };

  // ==========================================
  // ICON
  // ==========================================

  const getIcon = (type) => {
    switch (type) {
      case "medicine":
        return "💊";

      case "hydration":
        return "💧";

      case "activity":
        return "🚶";

      case "appointment":
        return "🏥";

      default:
        return "🔔";
    }
  };

  // ==========================================
  // TYPE LABEL
  // ==========================================

  const getTypeLabel = (type) => {
    switch (type) {
      case "medicine":
        return "Medicine";

      case "hydration":
        return "Hydration";

      case "activity":
        return "Daily Activity";

      case "appointment":
        return "Medical Appointment";

      default:
        return "Reminder";
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const activeReminders = reminders.filter(
    (item) => !item.is_completed
  ).length;

  const completedReminders = reminders.filter(
    (item) => item.is_completed
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="reminders-page">

      {/* BACKGROUND ORBS */}

      <div className="reminders-orb reminders-orb-one"></div>
      <div className="reminders-orb reminders-orb-two"></div>
      <div className="reminders-orb reminders-orb-three"></div>


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="reminders-header">

        <div className="reminders-brand">

          <button
            className="reminders-back-button"
            onClick={() => navigate("/patient")}
            type="button"
          >
            ←
          </button>

          <div className="reminders-brand-icon">
            🔔
          </div>

          <div>
            <h1>My Reminders</h1>

            <span>
              MemoryCare • Daily Support
            </span>
          </div>

        </div>

        <button
          className="reminders-dashboard-button"
          onClick={() => navigate("/patient")}
          type="button"
        >
          <span>←</span>
          Dashboard
        </button>

      </header>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="reminders-main">

        {/* PAGE INTRO */}

        <section className="reminders-intro">

          <div>

            <span className="reminders-eyebrow">
              DAILY ORGANIZATION
            </span>

            <h2>
              Stay on top of your day
            </h2>

            <p>
              Keep track of medicines, hydration,
              activities and important appointments
              with simple reminders.
            </p>

          </div>

          <div className="reminders-intro-icon">
            🔔
          </div>

        </section>


        {/* ====================================
            OVERVIEW
        ==================================== */}

        <section className="reminders-overview">

          <div className="reminder-stat-card">

            <div className="reminder-stat-icon blue">
              🔔
            </div>

            <div>
              <span>Active Reminders</span>
              <strong>{activeReminders}</strong>
            </div>

          </div>


          <div className="reminder-stat-card">

            <div className="reminder-stat-icon green">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedReminders}</strong>
            </div>

          </div>


          <div className="reminder-stat-card">

            <div className="reminder-stat-icon purple">
              📋
            </div>

            <div>
              <span>Total Reminders</span>
              <strong>{reminders.length}</strong>
            </div>

          </div>

        </section>


        {/* ====================================
            CONTENT GRID
        ==================================== */}

        <div className="reminders-content-grid">


          {/* ==================================
              CREATE REMINDER
          ================================== */}

          <section className="reminder-form-card">

            <div className="card-header">

              <div className="card-header-icon">
                ➕
              </div>

              <div>
                <h3>Add a Reminder</h3>

                <p>
                  Create a simple reminder for your day.
                </p>
              </div>

            </div>


            <form onSubmit={handleSubmit}>

              {/* TITLE */}

              <div className="reminder-field">

                <label htmlFor="reminder-title">
                  Reminder Title
                </label>

                <input
                  id="reminder-title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Take morning medicine"
                  disabled={saving}
                />

              </div>


              {/* TYPE */}

              <div className="reminder-field">

                <label htmlFor="reminder-type">
                  Reminder Type
                </label>

                <select
                  id="reminder-type"
                  name="reminder_type"
                  value={form.reminder_type}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="medicine">
                    💊 Medicine
                  </option>

                  <option value="hydration">
                    💧 Hydration
                  </option>

                  <option value="activity">
                    🚶 Daily Activity
                  </option>

                  <option value="appointment">
                    🏥 Medical Appointment
                  </option>
                </select>

              </div>


              {/* TIME + DATE */}

              <div className="reminder-form-row">

                <div className="reminder-field">

                  <label htmlFor="reminder-time">
                    Time
                  </label>

                  <input
                    id="reminder-time"
                    type="time"
                    name="reminder_time"
                    value={form.reminder_time}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>


                <div className="reminder-field">

                  <label htmlFor="reminder-date">
                    Date
                  </label>

                  <input
                    id="reminder-date"
                    type="date"
                    name="reminder_date"
                    value={form.reminder_date}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>

              </div>


              {/* NOTES */}

              <div className="reminder-field">

                <label htmlFor="reminder-notes">
                  Notes
                  <span>Optional</span>
                </label>

                <textarea
                  id="reminder-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add any helpful notes..."
                  rows="4"
                  disabled={saving}
                />

              </div>


              {/* ERROR */}

              {error && (
                <div className="reminders-error">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="add-reminder-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="reminder-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>＋</span>
                    Add Reminder
                  </>
                )}
              </button>

            </form>

          </section>


          {/* ==================================
              REMINDER LIST
          ================================== */}

          <section className="reminders-list-section">

            <div className="reminders-list-header">

              <div>

                <span className="reminders-list-eyebrow">
                  YOUR SCHEDULE
                </span>

                <h3>
                  Your Reminders
                </h3>

              </div>

              {reminders.length > 0 && (
                <span className="reminder-count-badge">
                  {reminders.length}
                </span>
              )}

            </div>


            {loading ? (

              <div className="reminders-empty-card">

                <div className="reminder-loading-spinner"></div>

                <h3>
                  Loading reminders
                </h3>

                <p>
                  Please wait a moment...
                </p>

              </div>

            ) : reminders.length === 0 ? (

              <div className="reminders-empty-card">

                <div className="empty-reminder-icon">
                  🔔
                </div>

                <h3>
                  No reminders yet
                </h3>

                <p>
                  Add your first reminder using
                  the form to keep your day organized.
                </p>

              </div>

            ) : (

              <div className="reminders-list">

                {reminders.map((reminder) => (

                  <article
                    key={reminder.id}
                    className={`reminder-item ${
                      reminder.is_completed
                        ? "reminder-completed"
                        : ""
                    }`}
                  >

                    {/* ICON */}

                    <div className="reminder-item-icon">
                      {getIcon(
                        reminder.reminder_type
                      )}
                    </div>


                    {/* CONTENT */}

                    <div className="reminder-item-content">

                      <div className="reminder-item-top">

                        <div>

                          <span className="reminder-type-badge">
                            {getTypeLabel(
                              reminder.reminder_type
                            )}
                          </span>

                          <h4>
                            {reminder.title}
                          </h4>

                        </div>

                        {reminder.is_completed && (
                          <span className="completed-badge">
                            ✓ Completed
                          </span>
                        )}

                      </div>


                      <div className="reminder-details">

                        <span>
                          🕐 {reminder.reminder_time}
                        </span>

                        {reminder.reminder_date && (
                          <span>
                            📅 {reminder.reminder_date}
                          </span>
                        )}

                      </div>


                      {reminder.notes && (
                        <p className="reminder-notes">
                          {reminder.notes}
                        </p>
                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="reminder-actions">

                      <button
                        type="button"
                        className="reminder-complete-button"
                        onClick={() =>
                          toggleComplete(reminder)
                        }
                        title={
                          reminder.is_completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {reminder.is_completed
                          ? "↩"
                          : "✓"}
                      </button>

                      <button
                        type="button"
                        className="reminder-delete-button"
                        onClick={() =>
                          deleteReminder(reminder.id)
                        }
                        title="Delete reminder"
                      >
                        🗑
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        </div>


        {/* ====================================
            SUPPORT MESSAGE
        ==================================== */}

        <section className="reminder-support">

          <div className="reminder-support-icon">
            💙
          </div>

          <div>

            <span>
              MEMORYCARE SUPPORT
            </span>

            <h3>
              A little organization can make the day easier.
            </h3>

            <p>
              Keep important medicines, activities and
              appointments easy to remember. You can update
              or complete your reminders whenever needed.
            </p>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="reminders-footer">

          <span>
            🧠 MemoryCare
          </span>

          <span>
            Cognitive Wellness &amp; Memory Assistance
          </span>

        </footer>

      </main>

      <style>{`
        /* =====================================================
           REMINDERS PAGE
        ===================================================== */

        .reminders-page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(59,130,246,0.12),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(99,102,241,0.10),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #f5f9ff 0%,
              #eef5ff 50%,
              #f8fbff 100%
            );
          color: #172554;
          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* BACKGROUND ORBS */

        .reminders-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(75px);
          pointer-events: none;
          z-index: 0;
        }

        .reminders-orb-one {
          width: 260px;
          height: 260px;
          background: rgba(37,99,235,0.11);
          top: 130px;
          left: -110px;
        }

        .reminders-orb-two {
          width: 300px;
          height: 300px;
          background: rgba(79,70,229,0.09);
          right: -130px;
          top: 500px;
        }

        .reminders-orb-three {
          width: 220px;
          height: 220px;
          background: rgba(14,165,233,0.08);
          left: 40%;
          bottom: -100px;
        }

        /* HEADER */

        .reminders-header {
          position: sticky;
          top: 0;
          z-index: 50;

          min-height: 76px;
          padding: 12px 5%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          border-bottom:
            1px solid rgba(148,163,184,0.18);

          box-shadow:
            0 8px 30px rgba(30,64,175,0.06);
        }

        .reminders-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reminders-brand-icon {
          width: 47px;
          height: 47px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          box-shadow:
            0 8px 22px rgba(37,99,235,0.22);

          font-size: 24px;
        }

        .reminders-brand h1 {
          margin: 0;

          color: #172554;
          font-size: 20px;
        }

        .reminders-brand span {
          display: block;
          margin-top: 2px;

          color: #64748b;
          font-size: 11px;
        }

        .reminders-back-button {
          width: 38px;
          height: 38px;

          border: 1px solid rgba(148,163,184,0.20);
          border-radius: 11px;

          background: rgba(255,255,255,0.75);
          color: #2563eb;

          font-size: 20px;
          cursor: pointer;

          transition: 0.2s ease;
        }

        .reminders-back-button:hover {
          background: #eff6ff;
          transform: translateX(-2px);
        }

        .reminders-dashboard-button {
          display: flex;
          align-items: center;
          gap: 8px;

          border: 1px solid rgba(37,99,235,0.12);
          border-radius: 11px;

          padding: 10px 15px;

          background: rgba(239,246,255,0.75);
          color: #2563eb;

          font-weight: 700;
          cursor: pointer;

          transition: 0.2s ease;
        }

        .reminders-dashboard-button:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }

        /* MAIN */

        .reminders-main {
          position: relative;
          z-index: 1;

          width: min(1180px, 90%);
          margin: auto;

          padding: 38px 0 55px;
        }

        /* INTRO */

        .reminders-intro {
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 25px;

          padding: 30px 34px;

          margin-bottom: 22px;

          border-radius: 25px;

          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #2563eb 48%,
              #4f46e5
            );

          color: white;

          box-shadow:
            0 20px 50px rgba(37,99,235,0.18);
        }

        .reminders-intro::after {
          content: "";

          position: absolute;

          width: 260px;
          height: 260px;

          border-radius: 50%;

          right: -90px;
          top: -130px;

          background: rgba(255,255,255,0.09);
        }

        .reminders-eyebrow {
          display: block;

          margin-bottom: 8px;

          color: #bfdbfe;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 1.6px;
        }

        .reminders-intro h2 {
          margin: 0 0 8px;

          font-size: 30px;
          letter-spacing: -0.7px;
        }

        .reminders-intro p {
          max-width: 680px;

          margin: 0;

          color: rgba(255,255,255,0.82);

          line-height: 1.6;
          font-size: 14px;
        }

        .reminders-intro-icon {
          position: relative;
          z-index: 2;

          width: 90px;
          height: 90px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 25px;

          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.20);

          backdrop-filter: blur(12px);

          font-size: 43px;
          flex-shrink: 0;
        }

        /* OVERVIEW */

        .reminders-overview {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0,1fr));

          gap: 15px;

          margin-bottom: 30px;
        }

        .reminder-stat-card {
          display: flex;
          align-items: center;

          gap: 13px;

          padding: 17px;

          border-radius: 18px;

          background: rgba(255,255,255,0.70);

          border:
            1px solid rgba(255,255,255,0.9);

          backdrop-filter: blur(18px);

          box-shadow:
            0 12px 35px rgba(30,64,175,0.06);
        }

        .reminder-stat-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          font-size: 22px;
        }

        .reminder-stat-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .reminder-stat-icon.green {
          background: #dcfce7;
          color: #15803d;
        }

        .reminder-stat-icon.purple {
          background: #ede9fe;
          color: #7c3aed;
        }

        .reminder-stat-card span {
          display: block;

          color: #64748b;
          font-size: 12px;
        }

        .reminder-stat-card strong {
          display: block;

          margin-top: 2px;

          color: #172554;
          font-size: 22px;
        }

        /* CONTENT */

        .reminders-content-grid {
          display: grid;

          grid-template-columns:
            minmax(310px, 370px) 1fr;

          gap: 22px;

          align-items: start;
        }

        /* FORM */

        .reminder-form-card {
          padding: 25px;

          border-radius: 22px;

          background: rgba(255,255,255,0.70);

          border:
            1px solid rgba(255,255,255,0.92);

          backdrop-filter: blur(18px);

          box-shadow:
            0 15px 40px rgba(30,64,175,0.07);
        }

        .card-header {
          display: flex;
          align-items: center;

          gap: 12px;

          margin-bottom: 23px;
        }

        .card-header-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #ede9fe
            );

          font-size: 21px;
        }

        .card-header h3 {
          margin: 0;

          color: #172554;
          font-size: 18px;
        }

        .card-header p {
          margin: 4px 0 0;

          color: #64748b;
          font-size: 12px;
        }

        .reminder-field {
          margin-bottom: 17px;
        }

        .reminder-field label {
          display: flex;
          justify-content: space-between;

          margin-bottom: 7px;

          color: #334155;

          font-size: 12px;
          font-weight: 700;
        }

        .reminder-field label span {
          color: #94a3b8;
          font-weight: 500;
        }

        .reminder-field input,
        .reminder-field select,
        .reminder-field textarea {
          width: 100%;
          box-sizing: border-box;

          border:
            1px solid rgba(148,163,184,0.28);

          border-radius: 11px;

          padding: 11px 12px;

          background: rgba(255,255,255,0.78);

          color: #1e293b;

          font-family: inherit;
          font-size: 13px;

          outline: none;

          transition: 0.2s ease;
        }

        .reminder-field textarea {
          resize: vertical;
          min-height: 90px;
        }

        .reminder-field input:focus,
        .reminder-field select:focus,
        .reminder-field textarea:focus {
          border-color: #60a5fa;

          background: white;

          box-shadow:
            0 0 0 3px rgba(59,130,246,0.10);
        }

        .reminder-field input:disabled,
        .reminder-field select:disabled,
        .reminder-field textarea:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .reminder-form-row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 12px;
        }

        /* ERROR */

        .reminders-error {
          display: flex;
          align-items: flex-start;

          gap: 8px;

          margin-bottom: 15px;

          padding: 11px 12px;

          border:
            1px solid rgba(239,68,68,0.13);

          border-radius: 11px;

          background: rgba(254,242,242,0.85);

          color: #b91c1c;

          font-size: 12px;
          line-height: 1.4;
        }

        /* ADD BUTTON */

        .add-reminder-button {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          padding: 13px;

          border: none;
          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: white;

          font-size: 14px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 9px 22px rgba(37,99,235,0.20);

          transition: 0.2s ease;
        }

        .add-reminder-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 13px 28px rgba(37,99,235,0.26);
        }

        .add-reminder-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .reminder-spinner {
          width: 15px;
          height: 15px;

          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;

          border-radius: 50%;

          animation: reminderSpin 0.7s linear infinite;
        }

        @keyframes reminderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* LIST */

        .reminders-list-section {
          min-width: 0;
        }

        .reminders-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 15px;
        }

        .reminders-list-eyebrow {
          color: #2563eb;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .reminders-list-header h3 {
          margin: 4px 0 0;

          color: #172554;
          font-size: 22px;
        }

        .reminder-count-badge {
          min-width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #dbeafe;

          color: #2563eb;

          font-size: 12px;
          font-weight: 800;
        }

        /* EMPTY */

        .reminders-empty-card {
          padding: 50px 25px;

          text-align: center;

          border-radius: 20px;

          background: rgba(255,255,255,0.65);

          border:
            1px solid rgba(255,255,255,0.9);

          backdrop-filter: blur(16px);

          box-shadow:
            0 12px 35px rgba(30,64,175,0.06);
        }

        .empty-reminder-icon {
          width: 65px;
          height: 65px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 15px;

          border-radius: 19px;

          background: #dbeafe;

          font-size: 30px;
        }

        .reminders-empty-card h3 {
          margin: 0 0 6px;

          color: #172554;
          font-size: 18px;
        }

        .reminders-empty-card p {
          max-width: 360px;

          margin: 0 auto;

          color: #64748b;

          font-size: 13px;
          line-height: 1.6;
        }

        .reminder-loading-spinner {
          width: 30px;
          height: 30px;

          margin: 0 auto 18px;

          border: 3px solid #dbeafe;
          border-top-color: #2563eb;

          border-radius: 50%;

          animation: reminderSpin 0.8s linear infinite;
        }

        /* REMINDER ITEM */

        .reminders-list {
          display: flex;
          flex-direction: column;

          gap: 12px;
        }

        .reminder-item {
          display: flex;
          align-items: center;

          gap: 14px;

          padding: 17px;

          border-radius: 18px;

          background: rgba(255,255,255,0.72);

          border:
            1px solid rgba(255,255,255,0.92);

          backdrop-filter: blur(18px);

          box-shadow:
            0 10px 30px rgba(30,64,175,0.06);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .reminder-item:hover {
          transform: translateY(-2px);

          box-shadow:
            0 15px 35px rgba(30,64,175,0.10);
        }

        .reminder-item.reminder-completed {
          opacity: 0.62;
        }

        .reminder-item-icon {
          width: 50px;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #eef2ff
            );

          font-size: 24px;
        }

        .reminder-item-content {
          flex: 1;
          min-width: 0;
        }

        .reminder-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 10px;
        }

        .reminder-type-badge {
          display: inline-block;

          padding: 4px 8px;

          border-radius: 20px;

          background: #eff6ff;

          color: #2563eb;

          font-size: 9px;
          font-weight: 800;

          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reminder-item h4 {
          margin: 5px 0 0;

          color: #172554;

          font-size: 16px;

          line-height: 1.3;
        }

        .reminder-completed .reminder-item h4 {
          text-decoration: line-through;
        }

        .completed-badge {
          flex-shrink: 0;

          padding: 5px 8px;

          border-radius: 20px;

          background: #dcfce7;

          color: #15803d;

          font-size: 9px;
          font-weight: 800;
        }

        .reminder-details {
          display: flex;
          flex-wrap: wrap;

          gap: 12px;

          margin-top: 8px;

          color: #64748b;

          font-size: 11px;
        }

        .reminder-notes {
          margin: 8px 0 0;

          color: #94a3b8;

          font-size: 11px;
          line-height: 1.5;
        }

        /* ACTIONS */

        .reminder-actions {
          display: flex;
          flex-direction: column;

          gap: 7px;
        }

        .reminder-complete-button,
        .reminder-delete-button {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          border-radius: 10px;

          cursor: pointer;

          font-size: 15px;

          transition: 0.2s ease;
        }

        .reminder-complete-button {
          background: #dcfce7;
          color: #15803d;
        }

        .reminder-complete-button:hover {
          background: #bbf7d0;
          transform: scale(1.04);
        }

        .reminder-delete-button {
          background: #fff1f2;
          color: #dc2626;
        }

        .reminder-delete-button:hover {
          background: #fee2e2;
          transform: scale(1.04);
        }

        /* SUPPORT */

        .reminder-support {
          display: flex;
          align-items: center;

          gap: 16px;

          margin-top: 35px;

          padding: 22px;

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              rgba(219,234,254,0.78),
              rgba(224,231,255,0.68)
            );

          border:
            1px solid rgba(255,255,255,0.9);

          box-shadow:
            0 12px 35px rgba(37,99,235,0.06);
        }

        .reminder-support-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 15px;

          background: rgba(255,255,255,0.75);

          font-size: 25px;
        }

        .reminder-support span {
          color: #2563eb;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1px;
        }

        .reminder-support h3 {
          margin: 4px 0 5px;

          color: #172554;
          font-size: 17px;
        }

        .reminder-support p {
          margin: 0;

          color: #64748b;

          font-size: 12px;
          line-height: 1.6;
        }

        /* FOOTER */

        .reminders-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 38px;
          padding: 22px 4px 0;

          border-top:
            1px solid rgba(148,163,184,0.18);

          color: #94a3b8;

          font-size: 10px;
        }

        .reminders-footer span:first-child {
          color: #475569;
          font-weight: 700;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {

          .reminders-content-grid {
            grid-template-columns: 1fr;
          }

          .reminder-form-card {
            max-width: none;
          }

        }

        @media (max-width: 700px) {

          .reminders-header {
            padding: 11px 4%;
          }

          .reminders-brand span {
            display: none;
          }

          .reminders-dashboard-button {
            padding: 9px 11px;
          }

          .reminders-main {
            width: 92%;
            padding-top: 25px;
          }

          .reminders-intro {
            padding: 25px 22px;
          }

          .reminders-intro-icon {
            display: none;
          }

          .reminders-intro h2 {
            font-size: 26px;
          }

          .reminders-overview {
            grid-template-columns: 1fr;
          }

          .reminder-form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .reminder-item {
            align-items: flex-start;
          }

          .reminder-item-top {
            flex-direction: column;
          }

          .completed-badge {
            align-self: flex-start;
          }

          .reminder-actions {
            flex-direction: row;
          }

          .reminder-support {
            align-items: flex-start;
          }

          .reminders-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 7px;
          }

        }

        @media (max-width: 450px) {

          .reminders-brand h1 {
            font-size: 17px;
          }

          .reminders-brand-icon {
            width: 42px;
            height: 42px;
            font-size: 21px;
          }

          .reminders-back-button {
            width: 34px;
            height: 34px;
          }

          .reminders-dashboard-button {
            font-size: 11px;
          }

          .reminders-main {
            width: 94%;
          }

          .reminder-form-card {
            padding: 20px;
          }

          .reminder-item {
            padding: 14px;
            gap: 10px;
          }

          .reminder-item-icon {
            width: 43px;
            height: 43px;
            font-size: 20px;
          }

          .reminder-item h4 {
            font-size: 14px;
          }

          .reminder-details {
            flex-direction: column;
            gap: 4px;
          }

          .reminder-support {
            padding: 18px;
          }

        }
      `}</style>

    </div>
  );
}

export default Reminders;