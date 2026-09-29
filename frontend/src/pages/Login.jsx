import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // LOGIN REQUEST
      // ==========================================

      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          email: cleanEmail,
          password: password,
        }),
      });

      // ==========================================
      // READ RESPONSE SAFELY
      // ==========================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Login response:", data);

      // ==========================================
      // LOGIN FAILED
      // ==========================================

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Invalid email or password. Please try again."
        );

        return;
      }

      // ==========================================
      // USER DATA CHECK
      // ==========================================

      if (!data.user) {
        setError(
          "Login successful, but user information was not received."
        );

        return;
      }

      // ==========================================
      // SAVE USER
      // ==========================================

      localStorage.setItem(
        "memorycare_user",
        JSON.stringify(data.user)
      );

      console.log("Logged in user:", data.user);

      // ==========================================
      // REDIRECT BASED ON ROLE
      // ==========================================

      if (data.user.role === "patient") {
        navigate("/patient", { replace: true });
      } else if (data.user.role === "caregiver") {
        navigate("/caregiver", { replace: true });
      } else {
        localStorage.removeItem("memorycare_user");

        setError(
          "Your account has an invalid user role."
        );
      }
    } catch (error) {
      console.error("Login connection error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR ERROR WHEN USER TYPES
  // ==========================================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="memorycare-login-page">

      {/* ======================================
          LEFT BRANDING PANEL
      ====================================== */}

      <section className="memorycare-login-left">

        <div className="login-background-circle circle-one"></div>
        <div className="login-background-circle circle-two"></div>

        <div className="login-brand-content">

          <div className="login-brand-icon">
            🧠
          </div>

          <h1>
            MemoryCare
          </h1>

          <p className="login-brand-subtitle">
            Cognitive Wellness &amp; Memory Assistance
          </p>

          <div className="login-brand-message">

            <div className="brand-feature">
              <span>🧩</span>
              <div>
                <strong>Cognitive Activities</strong>
                <p>
                  Keep your mind active with engaging
                  memory exercises.
                </p>
              </div>
            </div>

            <div className="brand-feature">
              <span>🔔</span>
              <div>
                <strong>Daily Support</strong>
                <p>
                  Stay organized with reminders and
                  wellness support.
                </p>
              </div>
            </div>

            <div className="brand-feature">
              <span>💙</span>
              <div>
                <strong>Connected Care</strong>
                <p>
                  Stay connected with caregivers and
                  important people.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* ======================================
          RIGHT LOGIN PANEL
      ====================================== */}

      <section className="memorycare-login-right">

        <div className="login-card">

          {/* HEADER */}

          <div className="login-heading">

            <div className="mobile-login-icon">
              🧠
            </div>

            <span className="login-welcome">
              Welcome back 👋
            </span>

            <h2>
              Sign in to
              <br />
              <span>MemoryCare</span>
            </h2>

            <p>
              Continue your journey toward better
              cognitive wellness.
            </p>

          </div>


          {/* ==================================
              LOGIN FORM
          ================================== */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="professional-login-field">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉️
                </span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="professional-login-field">

              <div className="password-label-row">

                <label htmlFor="login-password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password-button"
                  onClick={() => {
                    alert(
                      "Password reset will be added once the backend reset system is connected."
                    );
                  }}
                  disabled={loading}
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  🔒
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (
              <div className="professional-login-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}


            {/* ==================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              className="professional-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* ==================================
              TEST ACCOUNTS
          ================================== */}

          <div className="login-test-account">

            <div className="test-account-header">
              <span>🧪</span>
              <strong>Demo Accounts</strong>
            </div>

            <div className="test-account-row">
              <span>Patient</span>
              <code>patient@test.com</code>
            </div>

            <div className="test-account-row">
              <span>Caregiver</span>
              <code>caregiver@test.com</code>
            </div>

          </div>


          {/* ==================================
              REGISTER
          ================================== */}

          <div className="professional-login-register">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Create Account
            </button>

          </div>


          {/* SECURITY MESSAGE */}

          <div className="login-security">

            <span>🔐</span>

            <span>
              Your account information is kept
              secure.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;