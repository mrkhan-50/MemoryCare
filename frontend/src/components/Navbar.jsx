import { HeartPulse, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        <div className="logo-icon">
          <HeartPulse size={24} />
        </div>

        <div>
          <h2>MemoryCare</h2>
          <span>Cognitive Wellness</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#about">About</a>
        <a href="#features">Features</a>

        <button className="voice-button">
          <Volume2 size={20} />
          Voice
        </button>

        <Link to="/login" className="login-button">
          Login
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;