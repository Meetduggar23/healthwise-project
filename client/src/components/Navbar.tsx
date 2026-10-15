import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useAdminAuth } from "./AdminAuthContext";

const MORE_LINKS = [
  { to: "/library", label: "Health Library" },
  { to: "/tools", label: "Health Tools" },
  { to: "/faq", label: "Health FAQ" },
  { to: "/visit-prep", label: "Visit Prep" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { admin, logout: adminLogout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const closeAll = () => {
    setOpen(false);
    setMoreOpen(false);
  };

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const moreActive = MORE_LINKS.some((l) => location.pathname === l.to);

  const handleLogout = async () => {
    await logout();
    closeAll();
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
        <Link to="/" className="nav-brand" onClick={closeAll}>
          <img src="/logo.png" alt="HealthWise logo" />
        </Link>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          ☰
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" className={link} onClick={closeAll}>Home</NavLink>
          {user && (
            <>
              <NavLink to="/book" className={link} onClick={closeAll}>Book Appointment</NavLink>
              <NavLink to="/appointments" className={link} onClick={closeAll}>My Appointments</NavLink>
            </>
          )}
          <NavLink to="/chat" className={link} onClick={closeAll}>AI Medical Chatbot</NavLink>
          <NavLink to="/emergency" className={link} onClick={closeAll}>Emergency Help</NavLink>
          <div className="nav-dropdown" ref={moreRef}>
            <button
              type="button"
              className={`nav-drop-btn${moreActive ? " active" : ""}`}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((o) => !o)}
            >
              More ▾
            </button>
            {moreOpen && (
              <div className="nav-drop-menu">
                {MORE_LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} className={link} onClick={closeAll}>
                    {l.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm" onClick={closeAll}>Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
