import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function CaregiverDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // USER
  // ==========================================

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("memorycare_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // ==========================================
  // STATE
  // ==========================================

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [overview, setOverview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // AUTH CHECK
  // ==========================================

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("memorycare_user");
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "caregiver") {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  // ==========================================
  // LOAD PATIENTS
  // ==========================================

  useEffect(() => {
    if (!user || user.role !== "caregiver") return;

    const loadPatients = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          apiUrl(`/api/caregiver/patients/${user.id}`)
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok || !data.success) {
          setError(
            data.message || "Unable to load patients."
          );
          return;
        }

        const patientList = data.patients || [];

        setPatients(patientList);

        if (patientList.length > 0) {
          setSelectedPatient(patientList[0]);
        }
      } catch (err) {
        console.error("Patient loading error:", err);

        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [user]);

  // ==========================================
  // LOAD PATIENT OVERVIEW
  // ==========================================

  useEffect(() => {
    if (!selectedPatient) return;

    const loadOverview = async () => {
      setOverviewLoading(true);
      setOverview(null);
      setError("");

      try {
        const response = await fetch(
          apiUrl(
            `/api/caregiver/patient/${selectedPatient.id}/overview`
          )
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok || !data.success) {
          setError(
            data.message ||
              "Unable to load patient overview."
          );
          return;
        }

        setOverview(data);
      } catch (err) {
        console.error("Overview loading error:", err);

        setError(
          "Unable to load patient information."
        );
      } finally {
        setOverviewLoading(false);
      }
    };

    loadOverview();
  }, [selectedPatient]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("memorycare_user");
    navigate("/login", { replace: true });
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="caregiver-loading-page">
        <div className="caregiver-loading-card">
          <div className="caregiver-loading-icon">
            🧠
          </div>

          <div className="caregiver-spinner"></div>

          <h2>Loading Dashboard</h2>

          <p>
            Preparing your caregiver workspace...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="caregiver-page">

      {/* ======================================
          BACKGROUND DECORATION
      ====================================== */}

      <div className="caregiver-bg-orb orb-one"></div>
      <div className="caregiver-bg-orb orb-two"></div>
      <div className="caregiver-bg-orb orb-three"></div>

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="caregiver-header">

        <div className="caregiver-brand">

          <div className="caregiver-brand-icon">
            🧠
          </div>

          <div>
            <h2>MemoryCare</h2>

            <span>
              Caregiver Portal
            </span>
          </div>

        </div>

        <div className="caregiver-header-right">

          <div className="caregiver-user">

            <div className="caregiver-user-avatar">
              {getInitials(user?.name)}
            </div>

            <div className="caregiver-user-info">

              <strong>
                {user?.name || "Caregiver"}
              </strong>

              <span>
                Caregiver
              </span>

            </div>

          </div>

          <button
            type="button"
            className="caregiver-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="caregiver-container">

        {/* ====================================
            PAGE INTRO
        ==================================== */}

        <section className="caregiver-intro">

          <div>

            <div className="caregiver-eyebrow">
              <span className="live-dot"></span>
              CAREGIVER WORKSPACE
            </div>

            <h1>
              Good to see you,
              <span> {getFirstName(user?.name)}!</span>
            </h1>

            <p>
              Monitor your patients' cognitive
              wellness, daily activities and
              overall progress from one place.
            </p>

          </div>

          <div className="system-status">

            <span className="status-check">
              ✓
            </span>

            <div>
              <strong>System Active</strong>
              <span>
                All services operational
              </span>
            </div>

          </div>

        </section>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="caregiver-error">

            <div className="error-icon">
              ⚠️
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>
        )}

        {/* ====================================
            TOP OVERVIEW STATS
        ==================================== */}

        <section className="caregiver-summary-grid">

          <SummaryCard
            icon="👥"
            value={patients.length}
            label="Total Patients"
            description="Patients under your care"
          />

          <SummaryCard
            icon="🧠"
            value={
              overview?.cognitive?.games_played ?? 0
            }
            label="Games Played"
            description="Selected patient activity"
          />

          <SummaryCard
            icon="🌿"
            value={
              overview?.wellness?.wellness_days ?? 0
            }
            label="Wellness Days"
            description="Recorded wellness days"
          />

          <SummaryCard
            icon="🔔"
            value={
              overview?.reminders?.total ?? 0
            }
            label="Reminders"
            description="Patient reminders"
          />

        </section>

        {/* ====================================
            PATIENTS
        ==================================== */}

        <section className="glass-section">

          <div className="section-top">

            <div>
              <div className="section-kicker">
                PATIENT MANAGEMENT
              </div>

              <h2>
                Your Patients
              </h2>

              <p>
                Select a patient to view their
                detailed wellness and cognitive
                information.
              </p>
            </div>

            <div className="patient-count-badge">
              <span>●</span>
              {patients.length}{" "}
              {patients.length === 1
                ? "Patient"
                : "Patients"}
            </div>

          </div>

          {patients.length === 0 ? (

            <div className="empty-state">

              <div className="empty-state-icon">
                👤
              </div>

              <h3>
                No Patients Found
              </h3>

              <p>
                There are currently no patient
                accounts connected to your
                caregiver account.
              </p>

            </div>

          ) : (

            <div className="patient-grid">

              {patients.map((patient) => {

                const isSelected =
                  selectedPatient?.id ===
                  patient.id;

                return (
                  <button
                    type="button"
                    key={patient.id}
                    className={`patient-card ${
                      isSelected
                        ? "patient-card-selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedPatient(patient);
                    }}
                  >

                    <div className="patient-avatar">
                      {getInitials(patient.name)}
                    </div>

                    <div className="patient-card-info">

                      <h3>
                        {patient.name}
                      </h3>

                      <p>
                        {patient.email}
                      </p>

                      <span className="patient-active">
                        <i></i>
                        Active account
                      </span>

                    </div>

                    <div className="patient-arrow">
                      {isSelected ? "✓" : "→"}
                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </section>

        {/* ====================================
            SELECTED PATIENT
        ==================================== */}

        {selectedPatient && (

          <section className="glass-section patient-overview-section">

            {/* PATIENT HERO */}

            <div className="selected-patient-hero">

              <div className="selected-patient-avatar">
                {getInitials(selectedPatient.name)}
              </div>

              <div className="selected-patient-details">

                <span className="selected-label">
                  SELECTED PATIENT
                </span>

                <h2>
                  {selectedPatient.name}
                </h2>

                <p>
                  {selectedPatient.email}
                </p>

                <div className="selected-active">
                  <span></span>
                  Patient account active
                </div>

              </div>

              <div className="patient-health-badge">

                <span>♥</span>

                <div>
                  <strong>
                    Care Status
                  </strong>

                  <small>
                    Monitoring
                  </small>
                </div>

              </div>

            </div>

            {overviewLoading ? (

              <div className="overview-loading">

                <div className="caregiver-spinner"></div>

                <h3>
                  Loading patient data...
                </h3>

                <p>
                  Fetching the latest cognitive
                  and wellness information.
                </p>

              </div>

            ) : overview ? (

              <>

                {/* ==================================
                    COGNITIVE PERFORMANCE
                ================================== */}

                <DashboardSectionHeader
                  icon="🧠"
                  title="Cognitive Performance"
                  subtitle="Overview of the patient's cognitive game activity."
                />

                <div className="stats-grid">

                  <StatCard
                    icon="🎮"
                    value={
                      overview.cognitive
                        ?.games_played ?? 0
                    }
                    label="Games Played"
                    accent="blue"
                  />

                  <StatCard
                    icon="⭐"
                    value={
                      overview.cognitive
                        ?.best_score ?? 0
                    }
                    label="Best Score"
                    accent="purple"
                  />

                  <StatCard
                    icon="📈"
                    value={
                      overview.cognitive
                        ?.average_score ?? 0
                    }
                    label="Average Score"
                    accent="green"
                  />

                  <StatCard
                    icon="🎯"
                    value={
                      overview.cognitive
                        ?.total_matches ?? 0
                    }
                    label="Total Matches"
                    accent="orange"
                  />

                  <StatCard
                    icon="⏱️"
                    value={`${overview.cognitive?.average_time ?? 0}s`}
                    label="Average Time"
                    accent="cyan"
                  />

                </div>

                {/* ==================================
                    WELLNESS
                ================================== */}

                <DashboardSectionHeader
                  icon="🌿"
                  title="Wellness Overview"
                  subtitle="Recent daily wellness information."
                  extraClass="section-margin"
                />

                <div className="stats-grid">

                  <StatCard
                    icon="📅"
                    value={
                      overview.wellness
                        ?.wellness_days ?? 0
                    }
                    label="Days Recorded"
                    accent="blue"
                  />

                  <StatCard
                    icon="💧"
                    value={
                      overview.wellness
                        ?.average_water ?? 0
                    }
                    label="Average Water"
                    accent="cyan"
                  />

                  <StatCard
                    icon="🚶"
                    value={`${overview.wellness?.average_activity ?? 0} min`}
                    label="Average Activity"
                    accent="green"
                  />

                  <StatCard
                    icon="😴"
                    value={`${overview.wellness?.average_sleep ?? 0} hrs`}
                    label="Average Sleep"
                    accent="purple"
                  />

                  <StatCard
                    icon="🍎"
                    value={
                      overview.wellness
                        ?.average_meals ?? 0
                    }
                    label="Average Meals"
                    accent="orange"
                  />

                </div>

                {/* ==================================
                    REMINDERS
                ================================== */}

                <DashboardSectionHeader
                  icon="🔔"
                  title="Reminder Status"
                  subtitle="Track the patient's reminder completion."
                  extraClass="section-margin"
                />

                <div className="reminder-dashboard-card">

                  <ReminderStat
                    icon="🔔"
                    value={
                      overview.reminders?.total ?? 0
                    }
                    label="Total Reminders"
                  />

                  <ReminderStat
                    icon="✅"
                    value={
                      overview.reminders?.completed ?? 0
                    }
                    label="Completed"
                  />

                  <ReminderStat
                    icon="📊"
                    value={`${getCompletionRate(
                      overview.reminders
                    )}%`}
                    label="Completion Rate"
                  />

                </div>

                {/* ==================================
                    RECENT GAMES
                ================================== */}

                <DashboardSectionHeader
                  icon="🎮"
                  title="Recent Games"
                  subtitle="Latest cognitive activities."
                  extraClass="section-margin"
                />

                {overview.recent_games?.length ? (

                  <div className="activity-list">

                    {overview.recent_games.map(
                      (game, index) => (

                        <div
                          className="activity-card"
                          key={
                            game.id ??
                            `game-${index}`
                          }
                        >

                          <div className="activity-game-icon">
                            🧩
                          </div>

                          <div className="activity-main">

                            <h3>
                              {game.game_name}
                            </h3>

                            <p>
                              {game.played_at}
                            </p>

                          </div>

                          <ActivityMetric
                            value={game.score}
                            label="Score"
                          />

                          <ActivityMetric
                            value={game.matches}
                            label="Matches"
                          />

                          <ActivityMetric
                            value={`${game.time_taken}s`}
                            label="Time"
                          />

                        </div>
                      )
                    )}

                  </div>

                ) : (

                  <div className="empty-activity">
                    <span>🧩</span>
                    <p>
                      No games played yet.
                    </p>
                  </div>

                )}

                {/* ==================================
                    RECENT WELLNESS
                ================================== */}

                <DashboardSectionHeader
                  icon="🌿"
                  title="Recent Wellness"
                  subtitle="Latest wellness records."
                  extraClass="section-margin"
                />

                {overview.recent_wellness?.length ? (

                  <div className="wellness-table">

                    <div className="wellness-table-header">
                      <span>Date</span>
                      <span>Water</span>
                      <span>Activity</span>
                      <span>Sleep</span>
                      <span>Meals</span>
                    </div>

                    {overview.recent_wellness.map(
                      (record, index) => (

                        <div
                          className="wellness-table-row"
                          key={
                            record.id ??
                            `wellness-${index}`
                          }
                        >

                          <strong>
                            📅{" "}
                            {record.record_date}
                          </strong>

                          <span>
                            💧{" "}
                            {record.water_glasses}
                            {" "}glasses
                          </span>

                          <span>
                            🚶{" "}
                            {record.activity_minutes}
                            {" "}min
                          </span>

                          <span>
                            😴{" "}
                            {record.sleep_hours}
                            {" "}hrs
                          </span>

                          <span>
                            🍎{" "}
                            {record.meals_completed}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                ) : (

                  <div className="empty-activity">
                    <span>🌿</span>
                    <p>
                      No wellness records yet.
                    </p>
                  </div>

                )}

              </>

            ) : (

              <div className="empty-activity">
                <span>📊</span>
                <p>
                  No overview data available.
                </p>
              </div>

            )}

          </section>
        )}

        {/* ====================================
            FOOTER MESSAGE
        ==================================== */}

        <div className="caregiver-footer-card">

          <div className="footer-heart">
            💙
          </div>

          <div>
            <h3>
              Caring starts with staying connected.
            </h3>

            <p>
              MemoryCare helps you stay informed
              about the people who matter most.
              Regular monitoring can help you
              understand daily patterns and
              provide better support.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  icon,
  value,
  label,
  description,
}) {
  return (
    <div className="summary-card">

      <div className="summary-icon">
        {icon}
      </div>

      <div className="summary-content">

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

        <small>
          {description}
        </small>

      </div>

    </div>
  );
}


// ======================================================
// DASHBOARD SECTION HEADER
// ======================================================

function DashboardSectionHeader({
  icon,
  title,
  subtitle,
  extraClass = "",
}) {
  return (
    <div
      className={`dashboard-section-header ${extraClass}`}
    >

      <div className="section-title-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  icon,
  value,
  label,
  accent = "blue",
}) {
  return (
    <div className={`professional-stat-card accent-${accent}`}>

      <div className="professional-stat-top">

        <div className="professional-stat-icon">
          {icon}
        </div>

        <span className="stat-dot"></span>

      </div>

      <div className="professional-stat-value">
        {value}
      </div>

      <div className="professional-stat-label">
        {label}
      </div>

    </div>
  );
}


// ======================================================
// REMINDER STAT
// ======================================================

function ReminderStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="reminder-stat">

      <div className="reminder-stat-icon">
        {icon}
      </div>

      <div>
        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>
      </div>

    </div>
  );
}


// ======================================================
// ACTIVITY METRIC
// ======================================================

function ActivityMetric({
  value,
  label,
}) {
  return (
    <div className="activity-metric">

      <strong>
        {value ?? 0}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}


// ======================================================
// HELPERS
// ======================================================

function getInitials(name) {
  if (!name) return "MC";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}


function getFirstName(name) {
  if (!name) return "Caregiver";

  return name.trim().split(/\s+/)[0];
}


function getCompletionRate(reminders) {
  if (!reminders?.total) return 0;

  return Math.round(
    ((reminders.completed ?? 0) /
      reminders.total) *
      100
  );
}


export default CaregiverDashboard;