import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export function Login() {
  const { login } = useAuth();
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
      await login(email.trim(), password);
      navigate("/appointments");
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
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" value={password} autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
              />
            </div>
            <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? <span className="spinner" /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
