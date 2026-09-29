import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function MedicationTracker() {
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

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    medicine_name: "",
    dosage: "",
    medicine_time: "",
    frequency: "Once a day",
  });

  // ==========================================
  // LOAD MEDICATIONS
  // ==========================================

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      navigate("/login");
      return;
    }

    loadMedications();
  }, [navigate, user]);

  const loadMedications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        apiUrl(`/api/medications/${user.id}`)
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMedications(data.medications || []);
      } else {
        alert(
          data.message || "Unable to load medications."
        );
      }
    } catch (error) {
      console.error("Load medications error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD MEDICATION
  // ==========================================

  const handleAddMedication = async (event) => {
    event.preventDefault();

    if (
      !form.medicine_name.trim() ||
      !form.dosage.trim() ||
      !form.medicine_time ||
      !form.frequency
    ) {
      alert("Please fill all medication fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        apiUrl("/api/medications"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            medicine_name:
              form.medicine_name.trim(),
            dosage: form.dosage.trim(),
            medicine_time:
              form.medicine_time,
            frequency:
              form.frequency,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setForm({
          medicine_name: "",
          dosage: "",
          medicine_time: "",
          frequency: "Once a day",
        });

        await loadMedications();
      } else {
        alert(
          data.message ||
            "Unable to add medication."
        );
      }
    } catch (error) {
      console.error("Add medication error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // TOGGLE MEDICATION
  // ==========================================

  const handleToggle = async (medicationId) => {
    try {
      const response = await fetch(
        apiUrl(
          `/api/medications/${medicationId}/toggle`
        ),
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await loadMedications();
      } else {
        alert(
          data.message ||
            "Unable to update medication."
        );
      }
    } catch (error) {
      console.error(
        "Toggle medication error:",
        error
      );

      alert("Unable to connect to the server.");
    }
  };

  // ==========================================
  // DELETE MEDICATION
  // ==========================================

  const handleDelete = async (medicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medication?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl(
          `/api/medications/${medicationId}`
        ),
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await loadMedications();
      } else {
        alert(
          data.message ||
            "Unable to delete medication."
        );
      }
    } catch (error) {
      console.error(
        "Delete medication error:",
        error
      );

      alert("Unable to connect to the server.");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("memorycare_user");
    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!user || loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingCard}>
          <div style={{ fontSize: "45px" }}>
            💊
          </div>

          <h2
            style={{
              margin: "10px 0 0",
              color: "#172554",
            }}
          >
            Loading Medications...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // COUNTS
  // ==========================================

  const takenCount = medications.filter(
    (medicine) => medicine.is_taken === 1
  ).length;

  const pendingCount =
    medications.length - takenCount;

  // ==========================================
  // UI
  // ==========================================

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
              Medication Tracker
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <button
            onClick={() => navigate("/patient")}
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

        {/* PAGE TITLE */}

        <section style={heroStyle}>

          <div>
            <p
              style={{
                margin: "0 0 8px",
                opacity: 0.85,
              }}
            >
              💊 Health & Safety
            </p>

            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "34px",
              }}
            >
              Medication Tracker
            </h1>

            <p
              style={{
                margin: 0,
                opacity: 0.9,
                fontSize: "16px",
                maxWidth: "650px",
              }}
            >
              Keep track of your daily medicines
              and mark them as taken when
              completed.
            </p>
          </div>

          <div
            style={{
              fontSize: "70px",
            }}
          >
            💊
          </div>

        </section>

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div style={summaryGrid}>

          <div style={summaryCard}>
            <div style={summaryIcon}>
              💊
            </div>

            <div>
              <div style={summaryNumber}>
                {medications.length}
              </div>

              <div style={summaryLabel}>
                Total Medicines
              </div>
            </div>
          </div>

          <div style={summaryCard}>
            <div
              style={{
                ...summaryIcon,
                background: "#dcfce7",
              }}
            >
              ✅
            </div>

            <div>
              <div
                style={{
                  ...summaryNumber,
                  color: "#15803d",
                }}
              >
                {takenCount}
              </div>

              <div style={summaryLabel}>
                Taken
              </div>
            </div>
          </div>

          <div style={summaryCard}>
            <div
              style={{
                ...summaryIcon,
                background: "#fef3c7",
              }}
            >
              ⏳
            </div>

            <div>
              <div
                style={{
                  ...summaryNumber,
                  color: "#b45309",
                }}
              >
                {pendingCount}
              </div>

              <div style={summaryLabel}>
                Pending
              </div>
            </div>
          </div>

        </div>

        {/* ======================================
            ADD MEDICATION
        ====================================== */}

        <section style={whiteCard}>

          <div style={sectionHeader}>
            <div>
              <h2 style={sectionTitle}>
                Add Medication
              </h2>

              <p style={sectionDescription}>
                Add a medicine to your daily
                medication schedule.
              </p>
            </div>

            <div
              style={{
                fontSize: "35px",
              }}
            >
              ➕
            </div>
          </div>

          <form
            onSubmit={handleAddMedication}
          >

            <div style={formGrid}>

              {/* MEDICINE NAME */}

              <div style={fieldContainer}>
                <label style={labelStyle}>
                  Medicine Name
                </label>

                <input
                  type="text"
                  name="medicine_name"
                  value={form.medicine_name}
                  onChange={handleChange}
                  placeholder="e.g. Vitamin D"
                  style={inputStyle}
                />
              </div>

              {/* DOSAGE */}

              <div style={fieldContainer}>
                <label style={labelStyle}>
                  Dosage
                </label>

                <input
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  placeholder="e.g. 1 tablet"
                  style={inputStyle}
                />
              </div>

              {/* TIME */}

              <div style={fieldContainer}>
                <label style={labelStyle}>
                  Time
                </label>

                <input
                  type="time"
                  name="medicine_time"
                  value={form.medicine_time}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* FREQUENCY */}

              <div style={fieldContainer}>
                <label style={labelStyle}>
                  Frequency
                </label>

                <select
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option>
                    Once a day
                  </option>

                  <option>
                    Twice a day
                  </option>

                  <option>
                    Three times a day
                  </option>

                  <option>
                    Every other day
                  </option>

                  <option>
                    As needed
                  </option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...addButton,
                opacity: saving ? 0.7 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "Adding..."
                : "➕ Add Medication"}
            </button>

          </form>

        </section>

        {/* ======================================
            MEDICATION LIST
        ====================================== */}

        <section>

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#172554",
              }}
            >
              Today's Medications
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
              }}
            >
              Keep your medication schedule
              organized.
            </p>
          </div>

          {medications.length === 0 ? (
            <div style={emptyCard}>

              <div
                style={{
                  fontSize: "55px",
                }}
              >
                💊
              </div>

              <h3
                style={{
                  margin:
                    "12px 0 6px",
                  color: "#172554",
                }}
              >
                No medications added
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                Add your first medication
                using the form above.
              </p>

            </div>
          ) : (
            <div style={medicationGrid}>

              {medications.map(
                (medicine) => (
                  <div
                    key={medicine.id}
                    style={{
                      ...medicationCard,
                      borderLeft:
                        medicine.is_taken === 1
                          ? "5px solid #22c55e"
                          : "5px solid #f59e0b",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                        }}
                      >

                        <div
                          style={{
                            width: "55px",
                            height: "55px",
                            borderRadius:
                              "15px",
                            background:
                              medicine.is_taken ===
                              1
                                ? "#dcfce7"
                                : "#fff7ed",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize: "28px",
                          }}
                        >
                          💊
                        </div>

                        <div>

                          <h3
                            style={{
                              margin:
                                "0 0 6px",
                              color:
                                "#172554",
                              fontSize:
                                "20px",
                            }}
                          >
                            {
                              medicine.medicine_name
                            }
                          </h3>

                          <p
                            style={{
                              margin:
                                "0 0 5px",
                              color:
                                "#475569",
                            }}
                          >
                            Dosage:{" "}
                            <strong>
                              {
                                medicine.dosage
                              }
                            </strong>
                          </p>

                          <p
                            style={{
                              margin:
                                "0 0 5px",
                              color:
                                "#475569",
                            }}
                          >
                            ⏰{" "}
                            {
                              medicine.medicine_time
                            }
                          </p>

                          <p
                            style={{
                              margin: 0,
                              color:
                                "#64748b",
                              fontSize:
                                "14px",
                            }}
                          >
                            {
                              medicine.frequency
                            }
                          </p>

                        </div>

                      </div>

                      <span
                        style={
                          medicine.is_taken ===
                          1
                            ? takenBadge
                            : pendingBadge
                        }
                      >
                        {medicine.is_taken ===
                        1
                          ? "✓ Taken"
                          : "⏳ Pending"}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                        flexWrap: "wrap",
                      }}
                    >

                      <button
                        onClick={() =>
                          handleToggle(
                            medicine.id
                          )
                        }
                        style={
                          medicine.is_taken ===
                          1
                            ? undoButton
                            : takenButton
                        }
                      >
                        {medicine.is_taken === 1
                          ? "↩ Mark Pending"
                          : "✓ Mark as Taken"}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            medicine.id
                          )
                        }
                        style={deleteButton}
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* ======================================
            SAFETY NOTE
        ====================================== */}

        <section style={safetyCard}>

          <div
            style={{
              fontSize: "35px",
            }}
          >
            💙
          </div>

          <div>

            <h3
              style={{
                margin: "0 0 6px",
                color: "#172554",
              }}
            >
              Medication Safety
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Take medicines only according
              to instructions from your doctor
              or caregiver. This tracker is
              designed to help you remember
              your schedule and does not replace
              medical advice.
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

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "18px",
  marginBottom: "30px",
};

const summaryCard = {
  background: "white",
  borderRadius: "18px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.06)",
};

const summaryIcon = {
  width: "55px",
  height: "55px",
  borderRadius: "14px",
  background: "#eef4ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
};

const summaryNumber = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#172554",
};

const summaryLabel = {
  color: "#64748b",
  fontSize: "14px",
  marginTop: "3px",
};

const whiteCard = {
  background: "white",
  borderRadius: "20px",
  padding: "28px",
  marginBottom: "35px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "22px",
};

const sectionTitle = {
  margin: 0,
  color: "#172554",
};

const sectionDescription = {
  margin: "6px 0 0",
  color: "#64748b",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const fieldContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  background: "white",
};

const addButton = {
  marginTop: "20px",
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  padding: "13px 22px",
  borderRadius: "11px",
  fontSize: "15px",
  fontWeight: "bold",
};

const medicationGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px",
};

const medicationCard = {
  background: "white",
  borderRadius: "18px",
  padding: "22px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const takenBadge = {
  background: "#dcfce7",
  color: "#15803d",
  padding: "7px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const pendingBadge = {
  background: "#fef3c7",
  color: "#b45309",
  padding: "7px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const takenButton = {
  border: "none",
  background: "#dcfce7",
  color: "#15803d",
  padding: "10px 14px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const undoButton = {
  border: "none",
  background: "#eef4ff",
  color: "#2563eb",
  padding: "10px 14px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const deleteButton = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "10px 14px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const emptyCard = {
  background: "white",
  borderRadius: "20px",
  padding: "50px 25px",
  textAlign: "center",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const safetyCard = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  marginTop: "30px",
  display: "flex",
  alignItems: "flex-start",
  gap: "18px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const loadingCard = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow:
    "0 8px 30px rgba(0,0,0,0.08)",
  textAlign: "center",
};

export default MedicationTracker;