import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function WeeklyReport() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("memorycare_user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [results, setResults] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD WEEKLY DATA
  // ==========================================

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadReport = async () => {
      try {
        // Game results
        const gameResponse = await fetch(
          apiUrl(`/api/game-results/${user.id}`)
        );

        if (gameResponse.ok) {
          const gameData =
            await gameResponse.json();

          if (gameData.success) {
            setResults(
              gameData.results || []
            );
          }
        }

        // Reminders
        const reminderResponse =
          await fetch(
            apiUrl(`/api/reminders/${user.id}`)
          );

        if (reminderResponse.ok) {
          const reminderData =
            await reminderResponse.json();

          if (reminderData.success) {
            setReminders(
              reminderData.reminders || []
            );
          }
        }
      } catch (error) {
        console.error(
          "Unable to load weekly report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [navigate, user]);

  // ==========================================
  // LAST 7 DAYS
  // ==========================================

  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 7
  );

  const weeklyResults = results.filter(
    (result) => {
      const date = new Date(
        result.played_at
      );

      return date >= sevenDaysAgo;
    }
  );

  // ==========================================
  // STATISTICS
  // ==========================================

  const gamesPlayed =
    weeklyResults.length;

  const totalScore =
    weeklyResults.reduce(
      (sum, result) =>
        sum + Number(result.score || 0),
      0
    );

  const averageScore =
    gamesPlayed > 0
      ? Math.round(
          totalScore / gamesPlayed
        )
      : 0;

  const totalAttempts =
    weeklyResults.reduce(
      (sum, result) =>
        sum + Number(result.attempts || 0),
      0
    );

  const completedReminders =
    reminders.filter(
      (reminder) =>
        Number(
          reminder.completed ??
          reminder.is_completed ??
          0
        ) === 1
    ).length;

  const reminderTotal =
    reminders.length;

  const reminderRate =
    reminderTotal > 0
      ? Math.round(
          (completedReminders /
            reminderTotal) *
            100
        )
      : 0;

  // ==========================================
  // GAME BREAKDOWN
  // ==========================================

  const gameBreakdown = {};

  weeklyResults.forEach((result) => {
    const name =
      result.game_name ||
      "Unknown Game";

    if (!gameBreakdown[name]) {
      gameBreakdown[name] = {
        played: 0,
        score: 0,
      };
    }

    gameBreakdown[name].played += 1;

    gameBreakdown[name].score +=
      Number(result.score || 0);
  });

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "memorycare_user"
    );

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!user || loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingCard}>
          <div
            style={{
              fontSize: "40px",
              marginBottom: "10px",
            }}
          >
            📊
          </div>

          <h2
            style={{
              margin: 0,
              color: "#172554",
            }}
          >
            Preparing your report...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>

      {/* ======================================
          HEADER
      ====================================== */}

      <header style={headerStyle}>

        <div style={brandContainer}>

          <div style={brandIcon}>
            🧠
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#172554",
              }}
            >
              MemoryCare
            </h2>

            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Weekly Report
            </span>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >

          <button
            onClick={() =>
              navigate("/patient")
            }
            style={backButton}
          >
            ← Dashboard
          </button>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: "#1e293b",
              }}
            >
              {user.name}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Patient
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main style={mainStyle}>

        {/* HERO */}

        <section style={heroStyle}>

          <div>

            <p
              style={{
                margin: "0 0 8px",
                opacity: 0.9,
              }}
            >
              📊 Your Weekly Summary
            </p>

            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "34px",
              }}
            >
              Weekly Report
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "650px",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              See your cognitive activities,
              game performance and daily
              routine progress from the last
              7 days.
            </p>

          </div>

          <div
            style={{
              fontSize: "70px",
            }}
          >
            📈
          </div>

        </section>

        {/* ====================================
            SUMMARY CARDS
        ==================================== */}

        <div style={statsGrid}>

          {/* GAMES */}

          <div style={statCard}>

            <div style={statIcon}>
              🎮
            </div>

            <div>
              <div style={statNumber}>
                {gamesPlayed}
              </div>

              <div style={statLabel}>
                Games Played
              </div>
            </div>

          </div>

          {/* SCORE */}

          <div style={statCard}>

            <div style={statIcon}>
              ⭐
            </div>

            <div>
              <div style={statNumber}>
                {averageScore}
              </div>

              <div style={statLabel}>
                Average Score
              </div>
            </div>

          </div>

          {/* ATTEMPTS */}

          <div style={statCard}>

            <div style={statIcon}>
              🧠
            </div>

            <div>
              <div style={statNumber}>
                {totalAttempts}
              </div>

              <div style={statLabel}>
                Total Attempts
              </div>
            </div>

          </div>

          {/* REMINDERS */}

          <div style={statCard}>

            <div style={statIcon}>
              🔔
            </div>

            <div>
              <div style={statNumber}>
                {reminderRate}%
              </div>

              <div style={statLabel}>
                Reminder Completion
              </div>
            </div>

          </div>

        </div>

        {/* ====================================
            COGNITIVE ACTIVITY
        ==================================== */}

        <section style={sectionCard}>

          <div style={sectionHeader}>

            <div>

              <h2 style={sectionTitle}>
                🧠 Cognitive Activity
              </h2>

              <p style={sectionSubtitle}>
                Your game activity during
                the last 7 days.
              </p>

            </div>

          </div>

          {weeklyResults.length === 0 ? (

            <div style={emptyState}>

              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "10px",
                }}
              >
                🎮
              </div>

              <h3
                style={{
                  margin: "0 0 7px",
                  color: "#172554",
                }}
              >
                No games played this week
              </h3>

              <p
                style={{
                  margin: "0 0 18px",
                  color: "#64748b",
                }}
              >
                Play a cognitive game to
                start building your weekly
                report.
              </p>

              <button
                onClick={() =>
                  navigate("/games/memory-match")
                }
                style={primaryButton}
              >
                Play a Game →
              </button>

            </div>

          ) : (

            <div style={gameList}>

              {Object.entries(
                gameBreakdown
              ).map(
                ([gameName, game]) => (

                  <div
                    key={gameName}
                    style={gameRow}
                  >

                    <div
                      style={{
                        fontSize: "32px",
                      }}
                    >
                      🎯
                    </div>

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <h3
                        style={{
                          margin:
                            "0 0 5px",
                          color:
                            "#172554",
                        }}
                      >
                        {gameName}
                      </h3>

                      <span
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "14px",
                        }}
                      >
                        Played{" "}
                        {game.played}{" "}
                        time
                        {game.played !==
                        1
                          ? "s"
                          : ""}
                      </span>

                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            "22px",
                          fontWeight:
                            "bold",
                          color:
                            "#2563eb",
                        }}
                      >
                        {Math.round(
                          game.score /
                            game.played
                        )}
                      </div>

                      <div
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                        }}
                      >
                        Avg. Score
                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ====================================
            REMINDER PROGRESS
        ==================================== */}

        <section style={sectionCard}>

          <h2 style={sectionTitle}>
            🔔 Daily Routine
          </h2>

          <p style={sectionSubtitle}>
            Your reminder completion for
            the available reminders.
          </p>

          <div style={progressContainer}>

            <div style={progressTop}>

              <span>
                Reminder Completion
              </span>

              <strong>
                {reminderRate}%
              </strong>

            </div>

            <div style={progressTrack}>

              <div
                style={{
                  ...progressBar,
                  width: `${reminderRate}%`,
                }}
              />

            </div>

            <p
              style={{
                margin:
                  "10px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {completedReminders} of{" "}
              {reminderTotal} reminders
              completed.
            </p>

          </div>

        </section>

        {/* ====================================
            WEEKLY INSIGHT
        ==================================== */}

        <section style={insightCard}>

          <div
            style={{
              fontSize: "42px",
            }}
          >
            💙
          </div>

          <div>

            <h3
              style={{
                margin:
                  "0 0 7px",
                color:
                  "#172554",
              }}
            >
              Keep going!
            </h3>

            <p
              style={{
                margin: 0,
                color:
                  "#64748b",
                lineHeight: 1.6,
              }}
            >
              Regular cognitive activities
              and healthy daily routines can
              help keep your mind engaged.
              Try to maintain a consistent
              routine throughout the week.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #eef7ff 0%, #f4fbf7 100%)",
  fontFamily:
    "Arial, Helvetica, sans-serif",
};

const headerStyle = {
  background: "white",
  padding: "18px 35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const brandIcon = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
};

const backButton = {
  border: "none",
  background: "#eef4ff",
  color: "#2563eb",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const logoutButton = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const mainStyle = {
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "35px 25px 50px",
};

const heroStyle = {
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  borderRadius: "24px",
  padding: "32px 35px",
  marginBottom: "25px",
  boxShadow:
    "0 10px 30px rgba(37,99,235,0.22)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const statCard = {
  background: "white",
  borderRadius: "18px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.06)",
};

const statIcon = {
  width: "55px",
  height: "55px",
  borderRadius: "14px",
  background: "#eef4ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
};

const statNumber = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#172554",
};

const statLabel = {
  color: "#64748b",
  fontSize: "14px",
  marginTop: "3px",
};

const sectionCard = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  marginBottom: "25px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const sectionTitle = {
  margin: 0,
  color: "#172554",
};

const sectionSubtitle = {
  marginTop: "6px",
  color: "#64748b",
};

const gameList = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "20px",
};

const gameRow = {
  background: "#f8fafc",
  borderRadius: "15px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const progressContainer = {
  marginTop: "22px",
};

const progressTop = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  color: "#334155",
};

const progressTrack = {
  width: "100%",
  height: "12px",
  background: "#e2e8f0",
  borderRadius: "20px",
  overflow: "hidden",
};

const progressBar = {
  height: "100%",
  background:
    "linear-gradient(90deg, #2563eb, #4f46e5)",
  borderRadius: "20px",
  transition: "width 0.4s ease",
};

const insightCard = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  alignItems: "flex-start",
  gap: "18px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const emptyState = {
  textAlign: "center",
  padding: "35px 20px",
};

const primaryButton = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const loadingCard = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow:
    "0 8px 30px rgba(0,0,0,0.08)",
};

export default WeeklyReport;