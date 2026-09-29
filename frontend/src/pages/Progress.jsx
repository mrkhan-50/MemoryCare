import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function Progress() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("memorycare_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("memorycare_user");
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      navigate("/login");
    }
  }, [navigate, user]);

  // ==========================================
  // LOAD PROGRESS
  // ==========================================

  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          apiUrl(`/api/progress/${user.id}`)
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(
            data.message || "Unable to load progress."
          );
          return;
        }

        setProgress(data);
      } catch (error) {
        console.error("Progress error:", error);

        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="progress-loading-page">
        <div className="progress-loading-card">
          <div className="progress-loading-icon">📊</div>

          <h2>Loading your progress</h2>

          <p>
            Preparing your wellness journey...
          </p>

          <div className="progress-spinner"></div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="progress-page">

        <header className="progress-header">

          <button
            onClick={() => navigate("/patient")}
            className="progress-back-button"
          >
            ← Dashboard
          </button>

          <div className="progress-brand">
            <div className="progress-brand-icon">
              📊
            </div>

            <div>
              <strong>My Progress</strong>
              <span>MemoryCare</span>
            </div>
          </div>

          <div className="progress-user">
            <div className="progress-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span>{user?.name}</span>
          </div>

        </header>

        <main className="progress-container">

          <div className="progress-error-card">

            <div className="progress-error-icon">
              ⚠️
            </div>

            <h2>Unable to load progress</h2>

            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="progress-primary-button"
            >
              Try Again
            </button>

          </div>

        </main>
      </div>
    );
  }

  const cognitive = progress?.cognitive || {};
  const wellness = progress?.wellness || {};
  const recentGames = progress?.recent_games || [];

  return (
    <div className="progress-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="progress-header">

        <button
          onClick={() => navigate("/patient")}
          className="progress-back-button"
        >
          ← Dashboard
        </button>

        <div className="progress-brand">

          <div className="progress-brand-icon">
            📊
          </div>

          <div>
            <strong>My Progress</strong>
            <span>MemoryCare</span>
          </div>

        </div>

        <div className="progress-user">

          <div className="progress-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="progress-user-info">
            <strong>{user?.name}</strong>
            <span>Patient</span>
          </div>

        </div>

      </header>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="progress-container">

        {/* ====================================
            HERO
        ==================================== */}

        <section className="progress-hero">

          <div className="progress-hero-content">

            <div className="progress-eyebrow">
              YOUR WELLNESS JOURNEY
            </div>

            <h1>
              Keep going, {user?.name}! 🌟
            </h1>

            <p>
              Every small activity helps you stay
              engaged, active and healthy.
            </p>

            <div className="progress-hero-actions">

              <button
                onClick={() =>
                  navigate("/games/memory-match")
                }
                className="progress-hero-button"
              >
                🧩 Play Memory Match
              </button>

              <button
                onClick={() =>
                  navigate("/wellness")
                }
                className="progress-hero-secondary"
              >
                🌿 Daily Wellness
              </button>

            </div>

          </div>

          <div className="progress-hero-visual">

            <div className="progress-orbit orbit-one"></div>
            <div className="progress-orbit orbit-two"></div>

            <div className="progress-brain-card">
              🧠
            </div>

            <div className="progress-floating-card progress-floating-one">
              ⭐
              <span>Keep going</span>
            </div>

            <div className="progress-floating-card progress-floating-two">
              🌿
              <span>Stay healthy</span>
            </div>

          </div>

        </section>


        {/* ====================================
            COGNITIVE PROGRESS
        ==================================== */}

        <section className="progress-section">

          <div className="progress-section-header">

            <div className="progress-section-title">

              <div className="progress-section-icon blue">
                🧠
              </div>

              <div>
                <h2>Cognitive Progress</h2>

                <p>
                  Your memory game activity
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                navigate("/games/memory-match")
              }
              className="progress-outline-button"
            >
              Play Game →
            </button>

          </div>


          <div className="progress-stats-grid">

            <StatCard
              icon="🎮"
              value={cognitive.games_played ?? 0}
              label="Games Played"
              color="blue"
            />

            <StatCard
              icon="⭐"
              value={cognitive.best_score ?? 0}
              label="Best Score"
              color="purple"
            />

            <StatCard
              icon="📈"
              value={cognitive.average_score ?? 0}
              label="Average Score"
              color="green"
            />

            <StatCard
              icon="🎯"
              value={cognitive.total_matches ?? 0}
              label="Total Matches"
              color="orange"
            />

            <StatCard
              icon="⏱️"
              value={`${cognitive.average_time ?? 0}s`}
              label="Average Time"
              color="cyan"
            />

          </div>

        </section>


        {/* ====================================
            WELLNESS
        ==================================== */}

        <section className="progress-section">

          <div className="progress-section-header">

            <div className="progress-section-title">

              <div className="progress-section-icon green">
                🌿
              </div>

              <div>
                <h2>Daily Wellness</h2>

                <p>
                  Your healthy daily habits
                </p>
              </div>

            </div>

            <button
              onClick={() => navigate("/wellness")}
              className="progress-green-button"
            >
              + Add Today
            </button>

          </div>


          <div className="progress-wellness-grid">

            <WellnessCard
              icon="📅"
              value={wellness.wellness_days ?? 0}
              label="Days Recorded"
            />

            <WellnessCard
              icon="💧"
              value={wellness.average_water ?? 0}
              label="Avg. Water / Day"
            />

            <WellnessCard
              icon="🚶"
              value={`${wellness.average_activity ?? 0} min`}
              label="Avg. Activity"
            />

            <WellnessCard
              icon="😴"
              value={`${wellness.average_sleep ?? 0} hrs`}
              label="Avg. Sleep"
            />

            <WellnessCard
              icon="🍎"
              value={wellness.average_meals ?? 0}
              label="Avg. Meals"
            />

          </div>

        </section>


        {/* ====================================
            RECENT GAMES
        ==================================== */}

        <section className="progress-section">

          <div className="progress-section-header">

            <div className="progress-section-title">

              <div className="progress-section-icon purple">
                🎮
              </div>

              <div>
                <h2>Recent Game Activity</h2>

                <p>
                  Your latest cognitive exercises
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                navigate("/games/memory-match")
              }
              className="progress-outline-button"
            >
              Play Game →
            </button>

          </div>


          {recentGames.length === 0 ? (

            <div className="progress-empty-card">

              <div className="progress-empty-icon">
                🧩
              </div>

              <h3>
                No games played yet
              </h3>

              <p>
                Play Memory Match to start
                tracking your cognitive activity.
              </p>

              <button
                onClick={() =>
                  navigate("/games/memory-match")
                }
                className="progress-primary-button"
              >
                Start Memory Match
              </button>

            </div>

          ) : (

            <div className="progress-games-list">

              {recentGames.map((game) => (

                <div
                  key={game.id}
                  className="progress-game-row"
                >

                  <div className="progress-game-icon">
                    🧩
                  </div>

                  <div className="progress-game-info">

                    <strong>
                      {game.game_name}
                    </strong>

                    <span>
                      {game.played_at}
                    </span>

                  </div>

                  <div className="progress-game-stat">
                    <strong>
                      {game.score}
                    </strong>
                    <span>Score</span>
                  </div>

                  <div className="progress-game-stat">
                    <strong>
                      {game.matches}
                    </strong>
                    <span>Matches</span>
                  </div>

                  <div className="progress-game-stat">
                    <strong>
                      {game.time_taken}s
                    </strong>
                    <span>Time</span>
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ====================================
            MOTIVATION
        ==================================== */}

        <section className="progress-motivation">

          <div className="progress-motivation-icon">
            🌟
          </div>

          <div>
            <h2>
              You're doing great!
            </h2>

            <p>
              Keep playing, stay hydrated, get
              enough rest, and take care of
              yourself every day.
            </p>
          </div>

          <div className="progress-motivation-decoration">
            💙
          </div>

        </section>

      </main>

    </div>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div className="progress-stat-card">

      <div
        className={`progress-stat-icon ${color}`}
      >
        {icon}
      </div>

      <strong className="progress-stat-value">
        {value}
      </strong>

      <span className="progress-stat-label">
        {label}
      </span>

    </div>
  );
}


// ==========================================
// WELLNESS CARD
// ==========================================

function WellnessCard({
  icon,
  value,
  label,
}) {
  return (
    <div className="progress-wellness-card">

      <div className="progress-wellness-icon">
        {icon}
      </div>

      <strong className="progress-wellness-value">
        {value}
      </strong>

      <span className="progress-wellness-label">
        {label}
      </span>

    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const style = document.createElement("style");

style.innerHTML = `

/* ==========================================
   PAGE
========================================== */

.progress-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(59,130,246,0.08),
      transparent 28%
    ),
    radial-gradient(
      circle at 90% 20%,
      rgba(99,102,241,0.07),
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


/* ==========================================
   HEADER
========================================== */

.progress-header {
  position: sticky;
  top: 0;
  z-index: 100;

  min-height: 72px;
  padding: 10px 5%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255,255,255,0.78);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  border-bottom:
    1px solid rgba(148,163,184,0.16);

  box-shadow:
    0 8px 30px rgba(30,64,175,0.05);
}

.progress-back-button {
  border: none;

  background: rgba(219,234,254,0.75);

  color: #1d4ed8;

  padding: 10px 16px;

  border-radius: 11px;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.progress-back-button:hover {
  background: #dbeafe;
  transform: translateX(-2px);
}

.progress-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-brand-icon {
  width: 43px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  font-size: 21px;

  box-shadow:
    0 7px 20px rgba(37,99,235,0.22);
}

.progress-brand strong {
  display: block;

  color: #172554;

  font-size: 15px;
}

.progress-brand span {
  display: block;

  color: #64748b;

  font-size: 10px;

  margin-top: 2px;
}

.progress-user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.progress-user-avatar {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #dbeafe,
      #e0e7ff
    );

  color: #1d4ed8;

  font-size: 14px;
  font-weight: 800;
}

.progress-user-info strong {
  display: block;

  color: #1e293b;

  font-size: 13px;
}

.progress-user-info span {
  display: block;

  color: #64748b;

  font-size: 10px;

  margin-top: 2px;
}


/* ==========================================
   CONTAINER
========================================== */

.progress-container {
  position: relative;
  z-index: 1;

  width: min(1180px, 90%);

  margin: auto;

  padding: 38px 0 60px;
}


/* ==========================================
   HERO
========================================== */

.progress-hero {
  position: relative;

  overflow: hidden;

  min-height: 275px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 30px;

  padding: 38px 42px;

  margin-bottom: 38px;

  border-radius: 30px;

  color: white;

  background:
    linear-gradient(
      135deg,
      #1d4ed8,
      #2563eb 45%,
      #4f46e5
    );

  box-shadow:
    0 25px 60px rgba(37,99,235,0.20);
}

.progress-hero::before {
  content: "";

  position: absolute;

  width: 420px;
  height: 420px;

  border-radius: 50%;

  right: -160px;
  top: -220px;

  background:
    rgba(255,255,255,0.09);

  filter: blur(4px);
}

.progress-hero-content {
  position: relative;
  z-index: 2;

  max-width: 650px;
}

.progress-eyebrow {
  display: inline-flex;

  padding: 7px 12px;

  border:
    1px solid rgba(255,255,255,0.2);

  border-radius: 30px;

  background:
    rgba(255,255,255,0.1);

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.4px;

  margin-bottom: 14px;
}

.progress-hero h1 {
  margin: 0;

  font-size: clamp(30px, 4vw, 44px);

  line-height: 1.12;

  letter-spacing: -1px;
}

.progress-hero p {
  margin: 14px 0 0;

  color:
    rgba(255,255,255,0.84);

  font-size: 15px;

  line-height: 1.6;
}

.progress-hero-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  margin-top: 22px;
}

.progress-hero-button,
.progress-hero-secondary {
  border: none;

  padding: 11px 16px;

  border-radius: 11px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.progress-hero-button {
  background: white;

  color: #1d4ed8;

  box-shadow:
    0 8px 22px rgba(0,0,0,0.12);
}

.progress-hero-secondary {
  background:
    rgba(255,255,255,0.11);

  color: white;

  border:
    1px solid rgba(255,255,255,0.24);
}

.progress-hero-button:hover,
.progress-hero-secondary:hover {
  transform: translateY(-2px);
}

.progress-hero-visual {
  position: relative;

  width: 270px;
  height: 230px;

  flex-shrink: 0;
}

.progress-orbit {
  position: absolute;

  border:
    1px solid rgba(255,255,255,0.18);

  border-radius: 50%;
}

.orbit-one {
  width: 220px;
  height: 220px;

  left: 25px;
  top: 0;
}

.orbit-two {
  width: 165px;
  height: 165px;

  left: 53px;
  top: 28px;
}

.progress-brain-card {
  position: absolute;

  width: 112px;
  height: 112px;

  left: 79px;
  top: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  background:
    rgba(255,255,255,0.14);

  border:
    1px solid rgba(255,255,255,0.22);

  backdrop-filter: blur(15px);

  font-size: 57px;

  box-shadow:
    inset 0 1px rgba(255,255,255,0.2),
    0 20px 40px rgba(0,0,0,0.13);
}

.progress-floating-card {
  position: absolute;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 8px 11px;

  border-radius: 11px;

  background:
    rgba(255,255,255,0.13);

  border:
    1px solid rgba(255,255,255,0.18);

  backdrop-filter: blur(12px);

  font-size: 14px;
}

.progress-floating-card span {
  font-size: 9px;

  font-weight: 700;
}

.progress-floating-one {
  top: 17px;
  right: -2px;
}

.progress-floating-two {
  bottom: 18px;
  left: -4px;
}


/* ==========================================
   SECTIONS
========================================== */

.progress-section {
  margin-bottom: 40px;
}

.progress-section-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 18px;
}

.progress-section-title {
  display: flex;

  align-items: center;

  gap: 12px;
}

.progress-section-icon {
  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  font-size: 21px;
}

.progress-section-icon.blue {
  background: #dbeafe;
}

.progress-section-icon.green {
  background: #dcfce7;
}

.progress-section-icon.purple {
  background: #ede9fe;
}

.progress-section-title h2 {
  margin: 0;

  color: #172554;

  font-size: 21px;
}

.progress-section-title p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 12px;
}


/* ==========================================
   BUTTONS
========================================== */

.progress-outline-button,
.progress-green-button {
  border: none;

  padding: 10px 15px;

  border-radius: 10px;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  transition: 0.2s ease;
}

.progress-outline-button {
  background: #eff6ff;

  color: #2563eb;
}

.progress-green-button {
  background: #dcfce7;

  color: #15803d;
}

.progress-outline-button:hover,
.progress-green-button:hover {
  transform: translateY(-2px);
}


/* ==========================================
   COGNITIVE STATS
========================================== */

.progress-stats-grid {
  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 14px;
}

.progress-stat-card {
  position: relative;

  padding: 20px;

  border-radius: 19px;

  background:
    rgba(255,255,255,0.72);

  border:
    1px solid rgba(255,255,255,0.9);

  backdrop-filter: blur(18px);

  box-shadow:
    0 10px 30px rgba(30,64,175,0.06);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.progress-stat-card:hover {
  transform: translateY(-4px);

  box-shadow:
    0 17px 38px rgba(30,64,175,0.11);
}

.progress-stat-icon {
  width: 43px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  font-size: 20px;

  margin-bottom: 13px;
}

.progress-stat-icon.blue {
  background: #dbeafe;
}

.progress-stat-icon.purple {
  background: #ede9fe;
}

.progress-stat-icon.green {
  background: #dcfce7;
}

.progress-stat-icon.orange {
  background: #ffedd5;
}

.progress-stat-icon.cyan {
  background: #cffafe;
}

.progress-stat-value {
  display: block;

  color: #172554;

  font-size: 27px;
}

.progress-stat-label {
  display: block;

  margin-top: 4px;

  color: #64748b;

  font-size: 11px;
}


/* ==========================================
   WELLNESS
========================================== */

.progress-wellness-grid {
  display: grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 14px;
}

.progress-wellness-card {
  padding: 20px;

  border-radius: 19px;

  background:
    rgba(255,255,255,0.72);

  border:
    1px solid rgba(255,255,255,0.9);

  backdrop-filter: blur(18px);

  box-shadow:
    0 10px 30px rgba(30,64,175,0.06);

  transition: 0.2s ease;
}

.progress-wellness-card:hover {
  transform: translateY(-4px);

  box-shadow:
    0 17px 38px rgba(30,64,175,0.11);
}

.progress-wellness-icon {
  width: 43px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #dcfce7;

  font-size: 20px;

  margin-bottom: 13px;
}

.progress-wellness-value {
  display: block;

  color: #166534;

  font-size: 25px;
}

.progress-wellness-label {
  display: block;

  margin-top: 4px;

  color: #64748b;

  font-size: 11px;
}


/* ==========================================
   GAMES
========================================== */

.progress-games-list {
  display: flex;

  flex-direction: column;

  gap: 10px;
}

.progress-game-row {
  display: flex;

  align-items: center;

  gap: 16px;

  padding: 15px 17px;

  border-radius: 17px;

  background:
    rgba(255,255,255,0.75);

  border:
    1px solid rgba(255,255,255,0.9);

  box-shadow:
    0 8px 25px rgba(30,64,175,0.05);

  transition: 0.2s ease;
}

.progress-game-row:hover {
  transform: translateY(-2px);

  box-shadow:
    0 13px 30px rgba(30,64,175,0.09);
}

.progress-game-icon {
  width: 47px;
  height: 47px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #ede9fe;

  font-size: 23px;
}

.progress-game-info {
  flex: 1;

  min-width: 0;
}

.progress-game-info strong {
  display: block;

  color: #172554;

  font-size: 14px;
}

.progress-game-info span {
  display: block;

  margin-top: 4px;

  color: #64748b;

  font-size: 11px;
}

.progress-game-stat {
  min-width: 68px;

  text-align: center;
}

.progress-game-stat strong {
  display: block;

  color: #172554;

  font-size: 16px;
}

.progress-game-stat span {
  display: block;

  margin-top: 3px;

  color: #94a3b8;

  font-size: 10px;
}


/* ==========================================
   EMPTY
========================================== */

.progress-empty-card {
  padding: 45px 25px;

  text-align: center;

  border-radius: 21px;

  background:
    rgba(255,255,255,0.72);

  border:
    1px solid rgba(255,255,255,0.9);

  box-shadow:
    0 10px 30px rgba(30,64,175,0.06);
}

.progress-empty-icon {
  font-size: 50px;

  margin-bottom: 8px;
}

.progress-empty-card h3 {
  margin: 0;

  color: #172554;

  font-size: 18px;
}

.progress-empty-card p {
  max-width: 430px;

  margin: 8px auto 18px;

  color: #64748b;

  line-height: 1.6;

  font-size: 13px;
}


/* ==========================================
   PRIMARY BUTTON
========================================== */

.progress-primary-button {
  border: none;

  padding: 12px 19px;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 8px 20px rgba(37,99,235,0.2);

  transition: 0.2s ease;
}

.progress-primary-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 12px 25px rgba(37,99,235,0.26);
}


/* ==========================================
   MOTIVATION
========================================== */

.progress-motivation {
  position: relative;

  overflow: hidden;

  display: flex;

  align-items: center;

  gap: 18px;

  padding: 25px;

  border-radius: 22px;

  background:
    linear-gradient(
      135deg,
      rgba(219,234,254,0.82),
      rgba(224,231,255,0.72)
    );

  border:
    1px solid rgba(255,255,255,0.9);

  box-shadow:
    0 12px 35px rgba(37,99,235,0.06);
}

.progress-motivation-icon {
  width: 53px;
  height: 53px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 16px;

  background:
    rgba(255,255,255,0.75);

  font-size: 27px;
}

.progress-motivation h2 {
  margin: 0 0 5px;

  color: #172554;

  font-size: 19px;
}

.progress-motivation p {
  margin: 0;

  color: #64748b;

  line-height: 1.6;

  font-size: 13px;
}

.progress-motivation-decoration {
  margin-left: auto;

  font-size: 42px;

  opacity: 0.35;
}


/* ==========================================
   LOADING
========================================== */

.progress-loading-page {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #f5f9ff,
      #eef5ff
    );
}

.progress-loading-card {
  width: min(370px, 90%);

  padding: 38px 28px;

  text-align: center;

  border-radius: 24px;

  background:
    rgba(255,255,255,0.78);

  border:
    1px solid rgba(255,255,255,0.9);

  backdrop-filter: blur(20px);

  box-shadow:
    0 20px 50px rgba(30,64,175,0.10);
}

.progress-loading-icon {
  font-size: 48px;
}

.progress-loading-card h2 {
  margin: 14px 0 5px;

  color: #172554;
}

.progress-loading-card p {
  margin: 0;

  color: #64748b;

  font-size: 13px;
}

.progress-spinner {
  width: 24px;
  height: 24px;

  margin: 20px auto 0;

  border:
    3px solid #dbeafe;

  border-top-color: #2563eb;

  border-radius: 50%;

  animation:
    progressSpin 0.8s linear infinite;
}

@keyframes progressSpin {
  to {
    transform: rotate(360deg);
  }
}


/* ==========================================
   ERROR
========================================== */

.progress-error-card {
  max-width: 500px;

  margin: 60px auto;

  padding: 45px 30px;

  text-align: center;

  border-radius: 24px;

  background:
    rgba(255,255,255,0.78);

  border:
    1px solid rgba(255,255,255,0.9);

  box-shadow:
    0 15px 45px rgba(30,64,175,0.08);
}

.progress-error-icon {
  font-size: 52px;
}

.progress-error-card h2 {
  margin: 12px 0 7px;

  color: #172554;
}

.progress-error-card p {
  margin: 0 0 20px;

  color: #64748b;

  font-size: 13px;
}


/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 1050px) {

  .progress-stats-grid,
  .progress-wellness-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}

@media (max-width: 800px) {

  .progress-header {
    padding: 10px 4%;
  }

  .progress-user-info {
    display: none;
  }

  .progress-container {
    width: 92%;
  }

  .progress-hero {
    padding: 30px;

    min-height: auto;
  }

  .progress-hero-visual {
    transform: scale(0.85);
  }

}

@media (max-width: 650px) {

  .progress-brand span {
    display: none;
  }

  .progress-brand-icon {
    width: 40px;
    height: 40px;
  }

  .progress-hero {
    flex-direction: column;

    align-items: flex-start;

    padding: 27px 22px;
  }

  .progress-hero h1 {
    font-size: 30px;
  }

  .progress-hero-visual {
    align-self: center;
  }

  .progress-stats-grid,
  .progress-wellness-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .progress-section-header {
    align-items: flex-start;
  }

  .progress-game-row {
    flex-wrap: wrap;
  }

  .progress-game-info {
    min-width: calc(100% - 70px);
  }

  .progress-game-stat {
    flex: 1;
  }

  .progress-motivation {
    align-items: flex-start;
  }

  .progress-motivation-decoration {
    display: none;
  }

}

@media (max-width: 450px) {

  .progress-header {
    min-height: 64px;
  }

  .progress-back-button {
    padding: 9px 11px;
    font-size: 11px;
  }

  .progress-user {
    display: none;
  }

  .progress-container {
    width: 94%;
    padding-top: 22px;
  }

  .progress-hero-actions {
    flex-direction: column;
  }

  .progress-hero-button,
  .progress-hero-secondary {
    width: 100%;
  }

  .progress-hero-visual {
    transform: scale(0.72);

    margin-top: -15px;
    margin-bottom: -30px;
  }

  .progress-stats-grid,
  .progress-wellness-grid {
    grid-template-columns: 1fr 1fr;

    gap: 10px;
  }

  .progress-stat-card,
  .progress-wellness-card {
    padding: 16px;
  }

  .progress-stat-value {
    font-size: 23px;
  }

  .progress-wellness-value {
    font-size: 21px;
  }

  .progress-section-title h2 {
    font-size: 18px;
  }

  .progress-outline-button,
  .progress-green-button {
    padding: 8px 10px;
    font-size: 10px;
  }

}

`;

document.head.appendChild(style);

export default Progress;