import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function PatientDashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("memorycare_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [reminderCount, setReminderCount] = useState(0);
  const [loading, setLoading] = useState(Boolean(user));

  // ==========================================================
  // AUTHENTICATION + REMINDER COUNT
  // ==========================================================

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("memorycare_user");
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "patient") {
      navigate("/login", { replace: true });
      return;
    }

    const loadReminderCount = async () => {
      try {
        const response = await fetch(
          apiUrl(`/api/reminders/${user.id}`)
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (response.ok && data.success) {
          setReminderCount(data.reminders?.length ?? 0);
        }
      } catch (error) {
        console.error("Unable to load reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReminderCount();
  }, [navigate, user]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    localStorage.removeItem("memorycare_user");
    navigate("/login", { replace: true });
  };

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const openPage = (path) => {
    navigate(path);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (!user || loading) {
    return (
      <div className="patient-loading-page">
        <div className="patient-loading-card">
          <div className="loading-brain">🧠</div>

          <div className="loading-spinner"></div>

          <h2>Loading MemoryCare</h2>

          <p>
            Preparing your cognitive wellness dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="dashboard-orb dashboard-orb-one"></div>
      <div className="dashboard-orb dashboard-orb-two"></div>
      <div className="dashboard-orb dashboard-orb-three"></div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="patient-header">

        <div className="patient-brand">

          <div className="patient-brand-icon">
            🧠
          </div>

          <div>
            <h2>MemoryCare</h2>

            <span>
              Cognitive Wellness
            </span>
          </div>

        </div>


        <div className="patient-header-right">

          <div className="patient-user">

            <div className="patient-user-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "P"}
            </div>

            <div className="patient-user-info">

              <strong>
                {user.name}
              </strong>

              <span>
                Patient
              </span>

            </div>

          </div>

          <button
            type="button"
            className="patient-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="patient-main">

        {/* ===================================================
            WELCOME HERO
        =================================================== */}

        <section className="patient-welcome">

          <div className="welcome-glow"></div>

          <div className="welcome-content">

            <div className="welcome-text">

              <div className="welcome-label">
                <span className="online-dot"></span>
                Your wellness space
              </div>

              <p className="welcome-small">
                Welcome back 👋
              </p>

              <h1>
                Hello,{" "}
                <span>{user.name}!</span>
              </h1>

              <p className="welcome-description">
                Let's keep your mind active and
                your day organized. Choose an
                activity below to continue your
                wellness journey.
              </p>

              <div className="welcome-actions">

                <button
                  type="button"
                  className="welcome-primary-button"
                  onClick={() =>
                    openPage("/games/memory-match")
                  }
                >
                  <span>🧩</span>
                  Start a Brain Activity
                  <span>→</span>
                </button>

                <button
                  type="button"
                  className="welcome-secondary-button"
                  onClick={() =>
                    openPage("/wellness")
                  }
                >
                  Daily Wellness
                </button>

              </div>

            </div>


            <div className="welcome-visual">

              <div className="brain-ring ring-one"></div>
              <div className="brain-ring ring-two"></div>

              <div className="brain-glass-card">
                <span>🧠</span>
              </div>

              <div className="floating-card floating-card-one">
                <span>✨</span>
                <div>
                  <strong>Stay Active</strong>
                  <small>Every day matters</small>
                </div>
              </div>

              <div className="floating-card floating-card-two">
                <span>💙</span>
                <div>
                  <strong>Wellness</strong>
                  <small>You're doing great</small>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            QUICK OVERVIEW
        =================================================== */}

        <section className="quick-overview">

          <div className="overview-heading">

            <div>
              <span className="eyebrow">
                YOUR OVERVIEW
              </span>

              <h2>
                Today's Snapshot
              </h2>
            </div>

            <span className="overview-status">
              ● Active
            </span>

          </div>


          <div className="overview-grid">

            {/* GAMES */}

            <div className="overview-card">

              <div className="overview-icon blue">
                🎮
              </div>

              <div className="overview-info">

                <span>
                  Cognitive Games
                </span>

                <strong>
                  5
                </strong>

                <small>
                  Activities available
                </small>

              </div>

              <button
                type="button"
                onClick={() =>
                  openPage("/progress")
                }
              >
                →
              </button>

            </div>


            {/* REMINDERS */}

            <div className="overview-card">

              <div className="overview-icon purple">
                🔔
              </div>

              <div className="overview-info">

                <span>
                  Active Reminders
                </span>

                <strong>
                  {reminderCount}
                </strong>

                <small>
                  Scheduled for you
                </small>

              </div>

              <button
                type="button"
                onClick={() =>
                  openPage("/reminders")
                }
              >
                →
              </button>

            </div>


            {/* WELLNESS */}

            <div className="overview-card">

              <div className="overview-icon green">
                💚
              </div>

              <div className="overview-info">

                <span>
                  Wellness Status
                </span>

                <strong>
                  Good
                </strong>

                <small>
                  Keep up the routine
                </small>

              </div>

              <button
                type="button"
                onClick={() =>
                  openPage("/wellness")
                }
              >
                →
              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            DAILY SUPPORT
        =================================================== */}

        <DashboardSection
          icon="🌿"
          title="Daily Support"
          subtitle="Tools to help organize your everyday routine."
        >

          <DashboardCard
            icon="🔔"
            title="My Reminders"
            description="Manage medicines, hydration, daily activities and appointments."
            action="View Reminders"
            onClick={() => openPage("/reminders")}
          />

          <DashboardCard
            icon="🌿"
            title="Daily Wellness"
            description="Track your daily activities, mood and healthy routines."
            action="Open Wellness"
            onClick={() => openPage("/wellness")}
          />

          <DashboardCard
            icon="📈"
            title="My Progress"
            description="Review your cognitive game performance and personal progress."
            action="View Progress"
            onClick={() => openPage("/progress")}
          />

        </DashboardSection>


        {/* ===================================================
            HEALTH & SAFETY
        =================================================== */}

        <DashboardSection
          icon="🛡️"
          title="Health & Safety"
          subtitle="Important health tools and emergency support."
        >

          <DashboardCard
            icon="💊"
            title="Medication Tracker"
            description="Track medicines, dosage schedules and your medication routine."
            action="Open Medication"
            onClick={() => openPage("/medications")}
          />

          <DashboardCard
            icon="🆘"
            title="Emergency / SOS"
            description="Quickly access emergency support and important contacts."
            action="Open Emergency SOS"
            danger
            onClick={() => openPage("/emergency")}
          />

        </DashboardSection>


        {/* ===================================================
            COGNITIVE ACTIVITIES
        =================================================== */}

        <DashboardSection
          icon="🧠"
          title="Cognitive Activities"
          subtitle="Choose an activity to exercise your memory and attention."
        >

          <DashboardCard
            icon="🧩"
            title="Memory Match"
            description="Match cards and exercise your memory and concentration."
            action="Play Game"
            onClick={() =>
              openPage("/games/memory-match")
            }
          />

          <DashboardCard
            icon="🔢"
            title="Number Sequence"
            description="Remember numbers and complete the sequence."
            action="Play Game"
            onClick={() =>
              openPage("/games/number-sequence")
            }
          />

          <DashboardCard
            icon="🎯"
            title="Attention Challenge"
            description="Test your focus with simple visual challenges."
            action="Play Game"
            onClick={() =>
              openPage("/games/attention")
            }
          />

          <DashboardCard
            icon="🖼️"
            title="Object Recognition"
            description="Identify familiar objects and exercise recognition skills."
            action="Play Game"
            onClick={() =>
              openPage("/games/object-recognition")
            }
          />

          <DashboardCard
            icon="🕐"
            title="Daily Routine Recall"
            description="Remember everyday activities and their correct order."
            action="Play Game"
            onClick={() =>
              openPage("/games/daily-routine")
            }
          />

        </DashboardSection>


        {/* ===================================================
            FAMILY
        =================================================== */}

        <DashboardSection
          icon="👨‍👩‍👧"
          title="Memory & Family"
          subtitle="Keep important people and family contacts close."
        >

          <DashboardCard
            icon="👨‍👩‍👧"
            title="Important People"
            description="View important family members and quickly access their contact information."
            action="View Family & Contacts"
            onClick={() => openPage("/family")}
          />

        </DashboardSection>


        {/* ===================================================
            WEEKLY REPORT
        =================================================== */}

        <DashboardSection
          icon="📊"
          title="Weekly Report"
          subtitle="Review your cognitive activity and weekly routine."
        >

          <DashboardCard
            icon="📊"
            title="Weekly Report"
            description="View your games, scores, activity summary and weekly progress."
            action="View Weekly Report"
            onClick={() =>
              openPage("/weekly-report")
            }
          />

        </DashboardSection>


        {/* ===================================================
            SUPPORT MESSAGE
        =================================================== */}

        <section className="care-message">

          <div className="care-message-icon">
            💙
          </div>

          <div className="care-message-content">

            <span>
              A little reminder
            </span>

            <h3>
              Take care of yourself
            </h3>

            <p>
              Small daily activities can help keep
              your mind engaged. Remember to take
              your medicines, stay hydrated, follow
              your routine and stay connected with
              your loved ones.
            </p>

          </div>

          <div className="care-message-decoration">
            ✨
          </div>

        </section>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="patient-footer">

          <div className="footer-brand">
            <span>🧠</span>
            <strong>MemoryCare</strong>
          </div>

          <span>
            Cognitive Wellness &amp; Memory Assistance
          </span>

        </footer>

      </main>

    </div>
  );
}


// ==========================================================
// DASHBOARD SECTION
// ==========================================================

function DashboardSection({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="dashboard-section">

      <div className="section-heading">

        <div className="section-heading-left">

          <div className="section-heading-icon">
            {icon}
          </div>

          <div>

            <h2>
              {title}
            </h2>

            <p>
              {subtitle}
            </p>

          </div>

        </div>

      </div>

      <div className="dashboard-cards-grid">
        {children}
      </div>

    </section>
  );
}


// ==========================================================
// DASHBOARD CARD
// ==========================================================

function DashboardCard({
  icon,
  title,
  description,
  action,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      className={`dashboard-card ${
        danger ? "dashboard-card-danger" : ""
      }`}
      onClick={onClick}
    >

      <div className="dashboard-card-top">

        <div className="dashboard-card-icon">
          {icon}
        </div>

        <span className="dashboard-card-arrow">
          ↗
        </span>

      </div>

      <div className="dashboard-card-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

      <div className="dashboard-card-action">
        {action}
        <span>→</span>
      </div>

    </button>
  );
}


export default PatientDashboard;