import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../components/AdminAuthContext";
import { PasswordField } from "../components/PasswordField";

export function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your admin email and password.");
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-wrap">
        <div className="card auth-card">
          <img className="auth-logo" src="/logo.png" alt="HealthWise" />
          <span className="admin-badge">Admin area</span>
          <h1>Admin login</h1>
          <p className="sub">Sign in with the administrator account to manage all appointments. (You can also use the main login page.)</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="admin-email">Admin email</label>
              <input
                id="admin-email" type="email" value={email} autoComplete="email"
                onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com"
              />
            </div>
            <PasswordField
              id="admin-password" label="Password" value={password}
              placeholder="Admin password" onChange={setPassword}
            />
            <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? <span className="spinner" /> : "Login as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
