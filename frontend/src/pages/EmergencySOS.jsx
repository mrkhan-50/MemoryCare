import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmergencySOS() {
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

  const [showConfirm, setShowConfirm] = useState(false);
  const [emergencyActive, setEmergencyActive] =
    useState(false);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("memorycare_user");
    navigate("/login");
  };

  // ==========================================
  // SOS CONFIRMATION
  // ==========================================

  const handleSOSClick = () => {
    setShowConfirm(true);
  };

  // ==========================================
  // ACTIVATE SOS
  // ==========================================

  const activateSOS = () => {
    setShowConfirm(false);
    setEmergencyActive(true);

    // Save a local emergency event for now.
    // Backend emergency logging can be connected later.
    const emergencyEvent = {
      user_id: user?.id,
      user_name: user?.name,
      type: "SOS",
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      "memorycare_last_sos",
      JSON.stringify(emergencyEvent)
    );
  };

  // ==========================================
  // CANCEL SOS
  // ==========================================

  const cancelSOS = () => {
    setEmergencyActive(false);
  };

  // ==========================================
  // NO USER
  // ==========================================

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={loadingCard}>
          <h2 style={{ color: "#172554" }}>
            Please sign in first.
          </h2>

          <button
            onClick={() => navigate("/login")}
            style={primaryButton}
          >
            Go to Login
          </button>
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
              Health & Safety
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

        {/* ====================================
            HERO
        ==================================== */}

        <section style={heroStyle}>

          <div>

            <p
              style={{
                margin: "0 0 8px",
                opacity: 0.9,
              }}
            >
              🛡️ Health & Safety
            </p>

            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "34px",
              }}
            >
              Emergency & SOS
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "650px",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Get help quickly when you need it.
              Use the SOS button only for a
              genuine emergency.
            </p>

          </div>

          <div
            style={{
              fontSize: "70px",
            }}
          >
            🆘
          </div>

        </section>

        {/* ====================================
            EMERGENCY STATUS
        ==================================== */}

        {emergencyActive && (
          <section style={activeEmergencyCard}>

            <div
              style={{
                fontSize: "45px",
              }}
            >
              🚨
            </div>

            <div style={{ flex: 1 }}>

              <h2
                style={{
                  margin: "0 0 7px",
                  color: "#991b1b",
                }}
              >
                Emergency Alert Activated
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#7f1d1d",
                  lineHeight: 1.5,
                }}
              >
                Your emergency alert has been
                recorded on this device.
                Please contact your caregiver,
                family member, or local emergency
                service now.
              </p>

            </div>

            <button
              onClick={cancelSOS}
              style={cancelButton}
            >
              Cancel Alert
            </button>

          </section>
        )}

        {/* ====================================
            SOS CARD
        ==================================== */}

        <section style={sosCard}>

          <div
            style={{
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: "65px",
                marginBottom: "12px",
              }}
            >
              🆘
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#172554",
              }}
            >
              Emergency SOS
            </h2>

            <p
              style={{
                color: "#64748b",
                maxWidth: "550px",
                margin:
                  "0 auto 25px",
                lineHeight: 1.6,
              }}
            >
              If you are in immediate danger
              or need urgent assistance, use
              the SOS button below.
            </p>

            <button
              onClick={handleSOSClick}
              style={sosButton}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "30px",
                  marginBottom: "5px",
                }}
              >
                🆘
              </span>

              EMERGENCY SOS
            </button>

            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                fontSize: "13px",
                color: "#94a3b8",
              }}
            >
              Press only when emergency help
              is actually needed.
            </p>

          </div>

        </section>

        {/* ====================================
            QUICK HELP
        ==================================== */}

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
              Quick Help
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
              }}
            >
              Important options for getting
              assistance.
            </p>

          </div>

          <div style={helpGrid}>

            {/* FAMILY */}

            <div style={helpCard}>

              <div style={helpIcon}>
                👨‍👩‍👧
              </div>

              <h3 style={helpTitle}>
                Family / Caregiver
              </h3>

              <p style={helpText}>
                Contact your trusted family
                member or caregiver when you
                need assistance.
              </p>

              <button
                onClick={() =>
                  navigate("/family")
                }
                style={secondaryButton}
              >
                View Contacts →
              </button>

            </div>

            {/* EMERGENCY SERVICES */}

            <div style={helpCard}>

              <div style={helpIcon}>
                🚑
              </div>

              <h3 style={helpTitle}>
                Emergency Services
              </h3>

              <p style={helpText}>
                For immediate danger, contact
                your local emergency service.
              </p>

              <a
                href="tel:112"
                style={callButton}
              >
                📞 Call 112
              </a>

            </div>

            {/* MEDICATION */}

            <div style={helpCard}>

              <div style={helpIcon}>
                💊
              </div>

              <h3 style={helpTitle}>
                Medication
              </h3>

              <p style={helpText}>
                Check your medication schedule
                and today's medicines.
              </p>

              <button
                onClick={() =>
                  navigate("/medications")
                }
                style={secondaryButton}
              >
                View Medicines →
              </button>

            </div>

          </div>

        </section>

        {/* ====================================
            SAFETY INFORMATION
        ==================================== */}

        <section style={safetyCard}>

          <div
            style={{
              fontSize: "38px",
            }}
          >
            💙
          </div>

          <div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#172554",
              }}
            >
              Important Safety Information
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              MemoryCare is designed to support
              patients and caregivers. It does
              not replace professional medical
              care. For a serious or life-
              threatening emergency, contact
              emergency services immediately.
            </p>

          </div>

        </section>

      </main>

      {/* ======================================
          SOS CONFIRMATION MODAL
      ====================================== */}

      {showConfirm && (
        <div style={overlayStyle}>

          <div style={modalStyle}>

            <div
              style={{
                fontSize: "55px",
                marginBottom: "10px",
              }}
            >
              ⚠️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#172554",
              }}
            >
              Activate Emergency SOS?
            </h2>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.6,
                marginBottom: "25px",
              }}
            >
              Are you sure you need emergency
              assistance? Please confirm before
              activating the alert.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >

              <button
                onClick={() =>
                  setShowConfirm(false)
                }
                style={modalCancelButton}
              >
                Cancel
              </button>

              <button
                onClick={activateSOS}
                style={modalSOSButton}
              >
                Yes, Activate SOS
              </button>

            </div>

          </div>

        </div>
      )}

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

const sosCard = {
  background: "white",
  borderRadius: "24px",
  padding: "40px 25px",
  marginBottom: "30px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.07)",
};

const sosButton = {
  width: "190px",
  height: "190px",
  borderRadius: "50%",
  border: "10px solid #fee2e2",
  background:
    "linear-gradient(135deg, #dc2626, #b91c1c)",
  color: "white",
  cursor: "pointer",
  fontSize: "19px",
  fontWeight: "bold",
  boxShadow:
    "0 12px 30px rgba(185,28,28,0.3)",
};

const activeEmergencyCard = {
  background: "#fee2e2",
  border: "1px solid #fecaca",
  borderRadius: "18px",
  padding: "22px",
  marginBottom: "25px",
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const cancelButton = {
  border: "none",
  background: "white",
  color: "#b91c1c",
  padding: "11px 15px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const helpGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(270px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const helpCard = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const helpIcon = {
  width: "55px",
  height: "55px",
  borderRadius: "14px",
  background: "#eef4ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  marginBottom: "15px",
};

const helpTitle = {
  margin: "0 0 8px",
  color: "#172554",
};

const helpText = {
  color: "#64748b",
  lineHeight: 1.5,
  fontSize: "14px",
  minHeight: "65px",
};

const secondaryButton = {
  border: "none",
  background: "#eef4ff",
  color: "#2563eb",
  padding: "11px 15px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const callButton = {
  display: "inline-block",
  textDecoration: "none",
  background: "#dcfce7",
  color: "#15803d",
  padding: "11px 15px",
  borderRadius: "9px",
  fontWeight: "bold",
};

const safetyCard = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  alignItems: "flex-start",
  gap: "18px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 100,
};

const modalStyle = {
  background: "white",
  borderRadius: "22px",
  padding: "35px",
  maxWidth: "450px",
  width: "100%",
  textAlign: "center",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.2)",
};

const modalCancelButton = {
  border: "none",
  background: "#f1f5f9",
  color: "#475569",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const modalSOSButton = {
  border: "none",
  background: "#dc2626",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
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

export default EmergencySOS;