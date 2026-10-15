import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useAdminAuth } from "./AdminAuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { admin, logout: adminLogout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const handleAdminLogout = async () => {
    await adminLogout();
    setOpen(false);
    navigate("/admin/login");
  };

  const link = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : "");

  // Admin sessions get their own distinct navigation. Hiding patient links
  // from admins (and vice versa) is cosmetic only — every admin API and
  // route is protected on the backend.
  if (admin) {
    return (
      <nav className="navbar navbar-admin">
        <div className="nav-inner">
          <Link to="/admin/dashboard" className="nav-brand" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="HealthWise logo" />
            <span className="admin-badge">Admin</span>
          </Link>
          <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            ☰
          </button>
          <div className={`nav-links ${open ? "open" : ""}`}>
            <NavLink to="/admin/dashboard" end className={link} onClick={() => setOpen(false)}>Dashboard</NavLink>
            <NavLink to="/admin/dashboard?view=all" className={link} onClick={() => setOpen(false)}>All Appointments</NavLink>
          </div>
          <div className="nav-right">
            <span className="nav-user">Hi, {admin.name.split(" ")[0]}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleAdminLogout}>Logout</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="HealthWise logo" />
        </Link>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          ☰
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" className={link} onClick={() => setOpen(false)}>Home</NavLink>
          {user && (
            <>
              <NavLink to="/book" className={link} onClick={() => setOpen(false)}>Book Appointment</NavLink>
              <NavLink to="/appointments" className={link} onClick={() => setOpen(false)}>My Appointments</NavLink>
            </>
          )}
          <NavLink to="/chat" className={link} onClick={() => setOpen(false)}>AI Medical Chatbot</NavLink>
          <NavLink to="/library" className={link} onClick={() => setOpen(false)}>Health Library</NavLink>
          <NavLink to="/tools" className={link} onClick={() => setOpen(false)}>Health Tools</NavLink>
          <NavLink to="/emergency" className={link} onClick={() => setOpen(false)}>Emergency Help</NavLink>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm" onClick={() => setOpen(false)}>Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
