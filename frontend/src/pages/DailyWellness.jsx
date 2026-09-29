import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function DailyWellness() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("memorycare_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    mood: "Happy",
    water_glasses: 0,
    activity_minutes: 0,
    sleep_hours: 0,
    meals_completed: 0,
    notes: "",
  });

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
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // SAVE WELLNESS
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login first.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(apiUrl("/api/wellness"), {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.id,
          mood: form.mood,
          water_glasses: Number(form.water_glasses),
          activity_minutes: Number(form.activity_minutes),
          sleep_hours: Number(form.sleep_hours),
          meals_completed: Number(form.meals_completed),
          notes: form.notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to save wellness.");
        return;
      }

      setMessage("Daily wellness saved successfully! 🌿");

      setForm({
        mood: "Happy",
        water_glasses: 0,
        activity_minutes: 0,
        sleep_hours: 0,
        meals_completed: 0,
        notes: "",
      });
    } catch (error) {
      console.error("Wellness error:", error);

      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!user) {
    return (
      <div style={loadingStyle}>
        <div style={loadingCard}>
          <div style={loadingIcon}>🌿</div>
          <h2>Loading Wellness</h2>
          <p>Please wait a moment...</p>
          <div style={loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* ======================================
          BACKGROUND ORBS
      ====================================== */}

      <div style={orbOne}></div>
      <div style={orbTwo}></div>

      {/* ======================================
          HEADER
      ====================================== */}

      <header style={headerStyle}>
        <button
          onClick={() => navigate("/patient")}
          style={backButton}
        >
          <span style={backIcon}>←</span>
          Dashboard
        </button>

        <div style={brandStyle}>
          <div style={brandIcon}>🌿</div>

          <div>
            <div style={brandTitle}>Daily Wellness</div>
            <div style={brandSubtitle}>MemoryCare</div>
          </div>
        </div>

        <div style={userStyle}>
          <div style={userAvatar}>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div style={userInfo}>
            <strong>{user.name}</strong>
            <span>Patient</span>
          </div>
        </div>
      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main style={containerStyle}>
        {/* ====================================
            HERO
        ==================================== */}

        <section style={heroStyle}>
          <div style={heroGlow}></div>

          <div style={heroContent}>
            <div style={heroText}>
              <div style={heroBadge}>
                <span style={heroDot}></span>
                DAILY WELLNESS CHECK-IN
              </div>

              <h1 style={heroTitle}>
                How are you feeling
                <span> today?</span>
              </h1>

              <p style={heroDescription}>
                Take a moment to record how your day is going.
                Small daily check-ins can help you stay aware
                of your wellness and routine.
              </p>
            </div>

            <div style={heroVisual}>
              <div style={heroCircleOuter}></div>
              <div style={heroCircleInner}>
                🌿
              </div>
            </div>
          </div>
        </section>

        {/* ====================================
            WELLNESS FORM
        ==================================== */}

        <form onSubmit={handleSubmit} style={cardStyle}>
          {/* FORM HEADER */}

          <div style={formHeader}>
            <div>
              <span style={formEyebrow}>
                TODAY'S CHECK-IN
              </span>

              <h2 style={formTitle}>
                Your Wellness Space
              </h2>

              <p style={formSubtitle}>
                Share a few details about your day.
              </p>
            </div>

            <div style={formHeaderIcon}>💙</div>
          </div>

          {/* ====================================
              MOOD
          ==================================== */}

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <div style={sectionIcon}>😊</div>

              <div>
                <h2 style={sectionTitle}>
                  How is your mood?
                </h2>

                <p style={sectionSubtitle}>
                  Choose the option that best describes how
                  you feel today.
                </p>
              </div>
            </div>

            <div style={moodGrid}>
              {[
                ["Happy", "😊"],
                ["Okay", "😐"],
                ["Sad", "😔"],
                ["Worried", "😟"],
              ].map(([mood, emoji]) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => {
                    setForm((previous) => ({
                      ...previous,
                      mood,
                    }));

                    setMessage("");
                    setError("");
                  }}
                  style={{
                    ...moodButton,
                    ...(form.mood === mood
                      ? selectedMoodButton
                      : {}),
                  }}
                >
                  <span style={moodEmoji}>{emoji}</span>

                  <span style={moodLabel}>{mood}</span>

                  {form.mood === mood && (
                    <span style={selectedCheck}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ====================================
              WATER
          ==================================== */}

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <div
                style={{
                  ...sectionIcon,
                  background:
                    "linear-gradient(135deg, #dbeafe, #e0f2fe)",
                }}
              >
                💧
              </div>

              <div>
                <h2 style={sectionTitle}>
                  How much water did you drink?
                </h2>

                <p style={sectionSubtitle}>
                  Keep track of your hydration throughout the day.
                </p>
              </div>
            </div>

            <div style={counterBox}>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    water_glasses: Math.max(
                      0,
                      Number(previous.water_glasses) - 1
                    ),
                  }))
                }
                style={counterButton}
              >
                −
              </button>

              <div style={counterValueBox}>
                <div style={counterValue}>
                  {form.water_glasses}
                </div>

                <span style={counterUnit}>
                  glasses of water
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    water_glasses:
                      Number(previous.water_glasses) + 1,
                  }))
                }
                style={counterButton}
              >
                +
              </button>
            </div>
          </section>

          {/* ====================================
              ACTIVITY
          ==================================== */}

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <div
                style={{
                  ...sectionIcon,
                  background:
                    "linear-gradient(135deg, #dcfce7, #d1fae5)",
                }}
              >
                🚶
              </div>

              <div>
                <h2 style={sectionTitle}>
                  Physical activity
                </h2>

                <p style={sectionSubtitle}>
                  How many minutes were you physically active?
                </p>
              </div>
            </div>

            <div style={inputGroup}>
              <input
                type="number"
                name="activity_minutes"
                min="0"
                value={form.activity_minutes}
                onChange={handleChange}
                style={numberInput}
              />

              <span style={inputUnit}>minutes</span>
            </div>
          </section>

          {/* ====================================
              SLEEP
          ==================================== */}

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <div
                style={{
                  ...sectionIcon,
                  background:
                    "linear-gradient(135deg, #ede9fe, #e0e7ff)",
                }}
              >
                😴
              </div>

              <div>
                <h2 style={sectionTitle}>
                  How many hours did you sleep?
                </h2>

                <p style={sectionSubtitle}>
                  Record your sleep from last night.
                </p>
              </div>
            </div>

            <div style={inputGroup}>
              <input
                type="number"
                name="sleep_hours"
                min="0"
                max="24"
                step="0.5"
                value={form.sleep_hours}
                onChange={handleChange}
                style={numberInput}
              />

              <span style={inputUnit}>hours</span>
            </div>
          </section>

          {/* ====================================
              MEALS
          ==================================== */}

          <section style={sectionStyle}>
            <div style={sectionHeader}>
              <div
                style={{
                  ...sectionIcon,
                  background:
                    "linear-gradient(135deg, #fef3c7, #ffedd5)",
                }}
              >
                🍎
              </div>

              <div>
                <h2 style={sectionTitle}>
                  Meals completed
                </h2>

                <p style={sectionSubtitle}>
                  How many meals have you completed today?
                </p>
              </div>
            </div>

            <div style={counterBox}>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    meals_completed: Math.max(
                      0,
                      Number(previous.meals_completed) - 1
                    ),
                  }))
                }
                style={counterButton}
              >
                −
              </button>

              <div style={counterValueBox}>
                <div style={counterValue}>
                  {form.meals_completed}
                </div>

                <span style={counterUnit}>
                  meals
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    meals_completed:
                      Number(previous.meals_completed) + 1,
                  }))
                }
                style={counterButton}
              >
                +
              </button>
            </div>
          </section>

          {/* ====================================
              NOTES
          ==================================== */}

          <section style={lastSectionStyle}>
            <div style={sectionHeader}>
              <div
                style={{
                  ...sectionIcon,
                  background:
                    "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                }}
              >
                📝
              </div>

              <div>
                <h2 style={sectionTitle}>
                  Anything you want to note?
                </h2>

                <p style={sectionSubtitle}>
                  Add anything you'd like to remember about today.
                </p>
              </div>
            </div>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Write something about your day..."
              rows="5"
              style={textareaStyle}
            />
          </section>

          {/* ====================================
              MESSAGES
          ==================================== */}

          {message && (
            <div style={successStyle}>
              <span style={messageIcon}>✓</span>

              <div>
                <strong>Wellness saved</strong>
                <p>{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div style={errorStyle}>
              <span style={messageIcon}>!</span>

              <div>
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* ====================================
              SAVE BUTTON
          ==================================== */}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...saveButton,
              ...(saving ? saveButtonDisabled : {}),
            }}
          >
            {saving ? (
              <>
                <span style={buttonSpinner}></span>
                Saving your wellness...
              </>
            ) : (
              <>
                <span>🌿</span>
                Save Today's Wellness
                <span style={buttonArrow}>→</span>
              </>
            )}
          </button>

          <p style={privacyText}>
            🔒 Your wellness information is securely saved to
            your MemoryCare profile.
          </p>
        </form>
      </main>
    </div>
  );
}

// ==========================================================
// PAGE
// ==========================================================

const pageStyle = {
  minHeight: "100vh",
  position: "relative",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at 10% 10%, rgba(37,99,235,0.08), transparent 28%), radial-gradient(circle at 90% 30%, rgba(22,163,74,0.08), transparent 28%), linear-gradient(135deg, #f5f9ff 0%, #f1f8f5 50%, #f8fbff 100%)",
  fontFamily:
    'Inter, "Segoe UI", Arial, sans-serif',
  color: "#172554",
};

const orbOne = {
  position: "fixed",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(37,99,235,0.08)",
  filter: "blur(75px)",
  top: "120px",
  left: "-100px",
  pointerEvents: "none",
};

const orbTwo = {
  position: "fixed",
  width: "280px",
  height: "280px",
  borderRadius: "50%",
  background: "rgba(22,163,74,0.07)",
  filter: "blur(75px)",
  right: "-120px",
  bottom: "50px",
  pointerEvents: "none",
};

// ==========================================================
// HEADER
// ==========================================================

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  minHeight: "72px",
  padding: "10px 5%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 8px 30px rgba(30,64,175,0.06)",
};

const backButton = {
  border: "1px solid rgba(37,99,235,0.12)",
  background: "rgba(239,246,255,0.8)",
  color: "#1d4ed8",
  padding: "10px 15px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const backIcon = {
  fontSize: "18px",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const brandIcon = {
  width: "43px",
  height: "43px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, #16a34a, #15803d)",
  boxShadow: "0 8px 20px rgba(22,163,74,0.22)",
  fontSize: "22px",
};

const brandTitle = {
  fontWeight: "800",
  color: "#172554",
  fontSize: "17px",
};

const brandSubtitle = {
  color: "#64748b",
  fontSize: "11px",
  marginTop: "2px",
};

const userStyle = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
};

const userAvatar = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, #dbeafe, #dcfce7)",
  color: "#1d4ed8",
  fontWeight: "800",
};

const userInfo = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

userInfo.strong = {
  color: "#1e293b",
  fontSize: "13px",
};

userInfo.span = {
  color: "#64748b",
  fontSize: "11px",
};

// ==========================================================
// MAIN
// ==========================================================

const containerStyle = {
  position: "relative",
  zIndex: 1,
  width: "min(950px, 92%)",
  margin: "0 auto",
  padding: "35px 0 60px",
};

// ==========================================================
// HERO
// ==========================================================

const heroStyle = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "28px",
  padding: "36px 40px",
  marginBottom: "25px",
  color: "white",
  background:
    "linear-gradient(135deg, #166534 0%, #16a34a 50%, #15803d 100%)",
  boxShadow:
    "0 22px 55px rgba(22,163,74,0.20)",
};

const heroGlow = {
  position: "absolute",
  width: "360px",
  height: "360px",
  borderRadius: "50%",
  right: "-130px",
  top: "-190px",
  background: "rgba(255,255,255,0.10)",
  filter: "blur(5px)",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "30px",
};

const heroText = {
  maxWidth: "650px",
};

const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 12px",
  borderRadius: "30px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.10)",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1.2px",
};

const heroDot = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#bbf7d0",
  boxShadow: "0 0 10px #bbf7d0",
};

const heroTitle = {
  margin: "16px 0 12px",
  fontSize: "clamp(30px, 5vw, 44px)",
  lineHeight: "1.1",
  letterSpacing: "-1px",
};

const heroDescription = {
  margin: 0,
  maxWidth: "600px",
  color: "rgba(255,255,255,0.84)",
  lineHeight: 1.65,
  fontSize: "15px",
};

const heroVisual = {
  position: "relative",
  width: "150px",
  height: "150px",
  flexShrink: 0,
};

const heroCircleOuter = {
  position: "absolute",
  width: "145px",
  height: "145px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.20)",
  top: 0,
  left: 0,
};

const heroCircleInner = {
  position: "absolute",
  width: "95px",
  height: "95px",
  borderRadius: "30px",
  left: "25px",
  top: "25px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.22)",
  backdropFilter: "blur(12px)",
  fontSize: "48px",
};

// ==========================================================
// FORM CARD
// ==========================================================

const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(255,255,255,0.95)",
  borderRadius: "26px",
  padding: "30px",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow:
    "0 18px 50px rgba(30,64,175,0.08)",
};

const formHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  paddingBottom: "25px",
  marginBottom: "5px",
  borderBottom: "1px solid rgba(148,163,184,0.16)",
};

const formEyebrow = {
  color: "#16a34a",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1.4px",
};

const formTitle = {
  margin: "5px 0 4px",
  fontSize: "24px",
  color: "#172554",
};

const formSubtitle = {
  margin: 0,
  color: "#64748b",
  fontSize: "13px",
};

const formHeaderIcon = {
  width: "52px",
  height: "52px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, #dbeafe, #dcfce7)",
  fontSize: "25px",
};

// ==========================================================
// SECTIONS
// ==========================================================

const sectionStyle = {
  padding: "27px 0",
  borderBottom: "1px solid rgba(148,163,184,0.16)",
};

const lastSectionStyle = {
  padding: "27px 0",
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  marginBottom: "20px",
};

const sectionIcon = {
  width: "45px",
  height: "45px",
  flexShrink: 0,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, #dcfce7, #dbeafe)",
  fontSize: "22px",
};

const sectionTitle = {
  margin: 0,
  color: "#172554",
  fontSize: "18px",
};

const sectionSubtitle = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: "12px",
  lineHeight: 1.5,
};

// ==========================================================
// MOOD
// ==========================================================

const moodGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "12px",
};

const moodButton = {
  position: "relative",
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(248,250,252,0.85)",
  borderRadius: "17px",
  padding: "17px 10px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  color: "#334155",
  transition: "all 0.2s ease",
};

const selectedMoodButton = {
  border: "2px solid #16a34a",
  background:
    "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
  color: "#166534",
  boxShadow:
    "0 8px 20px rgba(22,163,74,0.10)",
};

const moodEmoji = {
  fontSize: "31px",
};

const moodLabel = {
  fontSize: "13px",
  fontWeight: "700",
};

const selectedCheck = {
  position: "absolute",
  top: "7px",
  right: "8px",
  width: "19px",
  height: "19px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#16a34a",
  color: "white",
  fontSize: "11px",
  fontWeight: "800",
};

// ==========================================================
// COUNTERS
// ==========================================================

const counterBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "25px",
  padding: "15px",
  borderRadius: "18px",
  background:
    "linear-gradient(135deg, rgba(239,246,255,0.75), rgba(236,253,245,0.75))",
  border: "1px solid rgba(255,255,255,0.9)",
};

const counterButton = {
  width: "48px",
  height: "48px",
  border: "none",
  borderRadius: "14px",
  background: "white",
  color: "#166534",
  fontSize: "27px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow:
    "0 5px 15px rgba(30,64,175,0.08)",
};

const counterValueBox = {
  minWidth: "100px",
  textAlign: "center",
};

const counterValue = {
  fontSize: "30px",
  fontWeight: "800",
  color: "#172554",
};

const counterUnit = {
  display: "block",
  marginTop: "2px",
  color: "#64748b",
  fontSize: "11px",
};

// ==========================================================
// NUMBER INPUTS
// ==========================================================

const inputGroup = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const numberInput = {
  width: "170px",
  padding: "13px 15px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  fontSize: "17px",
  color: "#172554",
  background: "rgba(255,255,255,0.9)",
  boxSizing: "border-box",
  outline: "none",
};

const inputUnit = {
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  padding: "15px",
  fontSize: "14px",
  resize: "vertical",
  fontFamily:
    'Inter, "Segoe UI", Arial, sans-serif',
  background: "rgba(255,255,255,0.85)",
  color: "#172554",
  outline: "none",
  lineHeight: 1.6,
};

// ==========================================================
// MESSAGES
// ==========================================================

const successStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "13px",
  marginBottom: "15px",
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  color: "#166534",
};

const errorStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "13px",
  marginBottom: "15px",
  background: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
};

const messageIcon = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.75)",
  fontWeight: "800",
};

successStyle.p = {
  margin: "3px 0 0",
  fontSize: "12px",
};

errorStyle.p = {
  margin: "3px 0 0",
  fontSize: "12px",
};

// ==========================================================
// SAVE BUTTON
// ==========================================================

const saveButton = {
  width: "100%",
  border: "none",
  borderRadius: "14px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "9px",
  background:
    "linear-gradient(135deg, #16a34a, #15803d)",
  color: "white",
  fontSize: "15px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow:
    "0 10px 25px rgba(22,163,74,0.20)",
};

const saveButtonDisabled = {
  opacity: 0.7,
  cursor: "not-allowed",
};

const buttonArrow = {
  marginLeft: "4px",
  fontSize: "18px",
};

const buttonSpinner = {
  width: "17px",
  height: "17px",
  border: "2px solid rgba(255,255,255,0.4)",
  borderTopColor: "white",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const privacyText = {
  textAlign: "center",
  margin: "15px 0 0",
  color: "#94a3b8",
  fontSize: "10px",
};

// ==========================================================
// LOADING
// ==========================================================

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, #f0fdf4, #eff6ff)",
  fontFamily:
    'Inter, "Segoe UI", Arial, sans-serif',
};

const loadingCard = {
  width: "300px",
  padding: "35px",
  textAlign: "center",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(255,255,255,0.9)",
  backdropFilter: "blur(20px)",
  boxShadow:
    "0 20px 50px rgba(30,64,175,0.10)",
};

const loadingIcon = {
  fontSize: "48px",
};

const loadingSpinner = {
  width: "24px",
  height: "24px",
  margin: "18px auto 0",
  border: "3px solid #dcfce7",
  borderTopColor: "#16a34a",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

export default DailyWellness;