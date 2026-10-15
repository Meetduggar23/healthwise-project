import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../components/AuthContext";
import { useAdminAuth } from "../components/AdminAuthContext";
import { PasswordField } from "../components/PasswordField";

export function Login() {
  const { refresh: refreshUser } = useAuth();
  const { refresh: refreshAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      // One login for both accounts: admin email opens the admin dashboard,
      // patient email opens the patient pages.
      const r = await api.unifiedLogin(email.trim(), password);
      await Promise.all([refreshUser(), refreshAdmin()]);
      navigate(r.role === "admin" ? "/admin/dashboard" : "/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-wrap">
        <div className="card auth-card">
          <img className="auth-logo" src="/logo.png" alt="HealthWise" />
          <h1>Welcome back</h1>
          <p className="sub">Log in to manage your appointments and chat with HealthWise AI.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email" type="email" value={email} autoComplete="email"
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              />
            </div>
            <PasswordField
              id="password" label="Password" value={password}
              placeholder="Your password" onChange={setPassword}
            />
            <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? <span className="spinner" /> : "Login"}
            </button>
          </form>
          <div className="auth-alt">
            <span>New to HealthWise?</span>
            <button className="btn btn-outline" type="button" disabled title="Sign-ups are disabled in this demo">
              Sign Up
            </button>
            <p className="sub" style={{ margin: "8px 0 0", fontSize: "0.8rem" }}>
              Sign-ups are disabled in this college demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
