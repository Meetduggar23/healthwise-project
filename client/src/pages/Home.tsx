import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export function Home() {
  const { user } = useAuth();
  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>Your health, managed simply.</h1>
          <p>
            HealthWise lets you book healthcare appointments in seconds and get instant
            answers from our AI medical assistant — all in one clean, secure place.
          </p>
          <div className="hero-cta">
            {user ? (
              <>
                <Link to="/book" className="btn">Book Appointment</Link>
                <Link to="/chat" className="btn btn-outline">Ask HealthWise AI</Link>
              </>
            ) : (
              <Link to="/login" className="btn">Login to Continue</Link>
            )}
          </div>
        </div>
        <div>
          <img className="logo-big" src="/logo.png" alt="HealthWise" />
        </div>
      </section>

      <div className="alert alert-error" style={{ marginTop: 20 }}>
        <strong>Emergency?</strong> Call <a href="tel:112" style={{ fontWeight: 800 }}>112</a>
        {" "}immediately — or open <Link to="/emergency" style={{ fontWeight: 700, textDecoration: "underline" }}>Emergency Help</Link> for
        quick-dial numbers and first-aid steps.
      </div>

      <section className="feature-grid">
        <div className="feature">
          <div className="icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3>Easy appointment booking</h3>
          <p>Choose a doctor or specialization, pick a date and time, and you're booked. Manage everything from one dashboard.</p>
        </div>
        <div className="feature">
          <div className="icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <h3>AI medical chatbot</h3>
          <p>Ask about symptoms, conditions, nutrition, fitness, first aid, and more — with safety-first guidance and clear disclaimers.</p>
        </div>
        <div className="feature">
          <div className="icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>Private & secure</h3>
          <p>Your appointments and chats belong only to you. Passwords are hashed, sessions are protected, and access is verified.</p>
        </div>
      </section>

      <section style={{ marginTop: 36 }}>
        <h2>How it works</h2>
        <div className="steps">
          <div className="step"><div className="n">1</div><h3>Log in</h3><p className="sub" style={{ margin: 0 }}>Use the demo account to access your dashboard.</p></div>
          <div className="step"><div className="n">2</div><h3>Book an appointment</h3><p className="sub" style={{ margin: 0 }}>Pick a doctor or specialization, date, and time.</p></div>
          <div className="step"><div className="n">3</div><h3>Chat anytime</h3><p className="sub" style={{ margin: 0 }}>Ask HealthWise AI your health questions, day or night.</p></div>
        </div>
        <p className="sub" style={{ marginTop: 18, fontSize: "0.85rem" }}>
          Note: doctor listings shown during booking are sample entries for demonstration.
          HealthWise AI provides general health information only and is not a substitute for professional medical advice.
        </p>
      </section>
    </div>
  );
}
