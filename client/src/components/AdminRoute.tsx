import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { admin, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", color: "var(--ink-soft)" }}>
          Loading…
        </div>
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
