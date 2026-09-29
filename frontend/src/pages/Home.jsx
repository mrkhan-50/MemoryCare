import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="home-navbar">

        {/* LOGO */}

        <Link to="/" className="home-logo">

          <div className="home-logo-icon">
            🧠
          </div>

          <div className="home-logo-text">
            <h2>MemoryCare</h2>
            <span>Cognitive Wellness</span>
          </div>

        </Link>


        {/* NAVIGATION */}

        <div className="home-nav-links">

          <a href="#about">
            About
          </a>

          <a href="#features">
            Features
          </a>

          <Link
            to="/login"
            className="home-login-btn"
          >
            Login
          </Link>

        </div>

      </nav>


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <main>

        <section className="home-hero">

          {/* HERO CONTENT */}

          <div className="home-hero-content">

            <div className="home-badge">
              <span>🧠</span>
              Cognitive Wellness Platform
            </div>


            <h1>
              A brighter day,
              <br />

              <span>
                one memory at a time.
              </span>
            </h1>


            <p className="home-hero-description">
              MemoryCare is an AI-powered cognitive assistance
              platform designed to help elderly people stay
              mentally active, engaged, organized and connected
              with their loved ones.
            </p>


            {/* BUTTONS */}

            <div className="home-hero-buttons">

              <Link
                to="/login"
                className="home-primary-btn"
              >
                Get Started
                <span>→</span>
              </Link>


              <a
                href="#features"
                className="home-secondary-btn"
              >
                Explore Features
              </a>

            </div>


            {/* TRUST INFO */}

            <div className="home-trust-row">

              <div className="home-trust-item">
                <span>✓</span>
                Elderly-friendly
              </div>

              <div className="home-trust-item">
                <span>✓</span>
                Family connected
              </div>

              <div className="home-trust-item">
                <span>✓</span>
                Easy to use
              </div>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="home-hero-visual">

            <div className="home-glow"></div>


            <div className="home-main-card">

              {/* TOP */}

              <div className="home-card-top">

                <div className="home-card-user">

                  <div className="home-card-avatar">
                    🧠
                  </div>

                  <div>
                    <strong>
                      MemoryCare
                    </strong>

                    <span>
                      Cognitive Wellness
                    </span>
                  </div>

                </div>

                <div className="home-status">
                  <span></span>
                  Active
                </div>

              </div>


              {/* BRAIN */}

              <div className="home-brain-container">

                <div className="home-brain-ring ring-one"></div>
                <div className="home-brain-ring ring-two"></div>

                <div className="home-brain-circle">
                  🧠
                </div>

              </div>


              <h2>
                Keep Your Mind Active
              </h2>

              <p>
                Simple activities and daily support
                for cognitive wellness.
              </p>


              {/* ACTIVITY */}

              <div className="home-activity-card">

                <div className="home-activity-icon">
                  🎯
                </div>

                <div className="home-activity-info">

                  <strong>
                    Today's Activity
                  </strong>

                  <span>
                    Cognitive exercises
                  </span>

                </div>

                <div className="home-activity-score">
                  85%
                </div>

              </div>


              {/* MINI STATS */}

              <div className="home-mini-stats">

                <div>
                  <strong>5</strong>
                  <span>Activities</span>
                </div>

                <div>
                  <strong>✓</strong>
                  <span>Reminders</span>
                </div>

                <div>
                  <strong>♥</strong>
                  <span>Wellness</span>
                </div>

              </div>

            </div>


            {/* FLOATING CARDS */}

            <div className="home-floating-card floating-reminder">

              <div className="floating-icon">
                🔔
              </div>

              <div>
                <strong>
                  Daily Reminder
                </strong>

                <span>
                  Stay on schedule
                </span>
              </div>

            </div>


            <div className="home-floating-card floating-family">

              <div className="floating-icon">
                👨‍👩‍👧
              </div>

              <div>
                <strong>
                  Family Connected
                </strong>

                <span>
                  Your loved ones are close
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES SECTION
        ===================================================== */}

        <section
          className="home-features"
          id="features"
        >

          <div className="home-section-heading">

            <span>
              WHAT MEMORYCARE OFFERS
            </span>

            <h2>
              Support for everyday
              <br />
              <strong>cognitive wellness.</strong>
            </h2>

            <p>
              Simple and meaningful tools designed
              for elderly users, caregivers and families.
            </p>

          </div>


          <div className="home-feature-grid">

            {/* FEATURE 1 */}

            <div className="home-feature-card">

              <div className="home-feature-icon">
                🧩
              </div>

              <h3>
                Cognitive Activities
              </h3>

              <p>
                Enjoy memory, attention, recognition
                and daily routine activities designed
                to keep the mind engaged.
              </p>

              <span className="feature-number">
                01
              </span>

            </div>


            {/* FEATURE 2 */}

            <div className="home-feature-card">

              <div className="home-feature-icon">
                🔔
              </div>

              <h3>
                Daily Support
              </h3>

              <p>
                Manage reminders, wellness activities
                and everyday routines in one simple place.
              </p>

              <span className="feature-number">
                02
              </span>

            </div>


            {/* FEATURE 3 */}

            <div className="home-feature-card">

              <div className="home-feature-icon">
                💊
              </div>

              <h3>
                Health & Safety
              </h3>

              <p>
                Keep track of medication schedules and
                quickly access emergency support when needed.
              </p>

              <span className="feature-number">
                03
              </span>

            </div>


            {/* FEATURE 4 */}

            <div className="home-feature-card">

              <div className="home-feature-icon">
                👨‍👩‍👧
              </div>

              <h3>
                Family Connection
              </h3>

              <p>
                Keep important people and family contacts
                close while staying connected with caregivers.
              </p>

              <span className="feature-number">
                04
              </span>

            </div>


            {/* FEATURE 5 */}

            <div className="home-feature-card">

              <div className="home-feature-icon">
                📊
              </div>

              <h3>
                Weekly Reports
              </h3>

              <p>
                Review activity, cognitive exercises and
                routine progress through easy-to-understand reports.
              </p>

              <span className="feature-number">
                05
              </span>

            </div>


            {/* FEATURE 6 */}

            <div className="home-feature-card">

              <div className="home-feature-icon">
                🤖
              </div>

              <h3>
                AI-Assisted Care
              </h3>

              <p>
                AI-powered assistance can help make the
                experience more personalized and supportive.
              </p>

              <span className="feature-number">
                06
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            ABOUT SECTION
        ===================================================== */}

        <section
          className="home-about"
          id="about"
        >

          <div className="home-about-visual">

            <div className="about-circle-large">
              🧠
            </div>

            <div className="about-small-card about-card-one">
              🧩
              <span>
                Cognitive Activities
              </span>
            </div>

            <div className="about-small-card about-card-two">
              💙
              <span>
                Connected Care
              </span>
            </div>

          </div>


          <div className="home-about-content">

            <span className="home-about-label">
              DESIGNED WITH CARE
            </span>

            <h2>
              Technology that
              <br />
              <strong>feels human.</strong>
            </h2>

            <p>
              MemoryCare aims to make cognitive engagement
              more accessible to elderly people by combining
              simple activities, daily support, health and
              safety tools, and family connectivity in one
              easy-to-use platform.
            </p>


            <div className="home-about-list">

              <div>
                <span>✓</span>
                Simple elderly-friendly interface
              </div>

              <div>
                <span>✓</span>
                Cognitive games and activities
              </div>

              <div>
                <span>✓</span>
                Medication and emergency support
              </div>

              <div>
                <span>✓</span>
                Family and caregiver connectivity
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA SECTION
        ===================================================== */}

        <section className="home-cta">

          <div className="home-cta-icon">
            🧠
          </div>

          <div>

            <span>
              START YOUR JOURNEY
            </span>

            <h2>
              Make every day a little brighter.
            </h2>

            <p>
              Stay active, organized and connected
              with MemoryCare.
            </p>

          </div>

          <Link
            to="/login"
            className="home-cta-button"
          >
            Get Started
            <span>→</span>
          </Link>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div className="home-footer-brand">

          <div className="footer-logo">
            🧠
          </div>

          <div>
            <h2>
              MemoryCare
            </h2>

            <p>
              AI-powered cognitive assistance
              for better everyday care.
            </p>
          </div>

        </div>


        <div className="home-footer-links">

          <a href="#about">
            About
          </a>

          <a href="#features">
            Features
          </a>

          <Link to="/login">
            Login
          </Link>

        </div>


        <div className="home-footer-bottom">

          <span>
            © 2026 MemoryCare. All rights reserved.
          </span>

          <span>
            Cognitive Wellness Platform
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;