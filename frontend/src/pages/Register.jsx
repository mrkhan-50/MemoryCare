import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create your account.");
      }

      localStorage.setItem("memorycare_user", JSON.stringify(data.user));
      navigate(data.user.role === "caregiver" ? "/caregiver" : "/patient");
    } catch (registerError) {
      setError(
        registerError.message ||
          "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-card">
          <div className="login-icon" aria-hidden="true">🧠</div>
          <h1>Create your account</h1>
          <p className="login-description">Join MemoryCare</p>

          <form onSubmit={handleRegister}>
            <div className="login-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-role">Account type</label>
              <select
                id="register-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="patient">Patient</option>
                <option value="caregiver">Caregiver</option>
              </select>
            </div>

            {error && <div className="login-error" role="alert">{error}</div>}

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="login-register">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;