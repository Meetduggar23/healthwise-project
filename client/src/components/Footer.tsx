import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="HealthWise logo" />
          <p>
            Book appointments and get general health information from HealthWise AI —
            in English, Hindi, and Hinglish.
          </p>
          <div className="footer-emg">
            <span>Emergency?</span>
            <a className="btn btn-sm" href="tel:112">Call 112</a>
            <a className="btn btn-sm btn-outline" href="tel:108">Call 108</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>HealthWise</h4>
          <Link to="/">Home</Link>
          <Link to="/book">Book Appointment</Link>
          <Link to="/appointments">My Appointments</Link>
          <Link to="/chat">AI Medical Chatbot</Link>
        </div>
        <div className="footer-col">
          <h4>Learn</h4>
          <Link to="/library">Health Library</Link>
          <Link to="/tools">Health Tools</Link>
          <Link to="/faq">Health FAQ</Link>
          <Link to="/visit-prep">Visit Prep</Link>
          <Link to="/medicines">Medicine Library</Link>
          <Link to="/emergency">Emergency Help</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Patient Login</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 HealthWise · College demonstration — general information only, not medical
        advice. Not a real hospital service. In an emergency, call 112.
      </div>
    </footer>
  );
}
