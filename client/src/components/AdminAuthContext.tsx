import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User } from "../api/client";

interface AdminAuthState {
  admin: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .adminMe()
      .then((r) => setAdmin(r.user))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.adminLogin(email, password);
    setAdmin(r.user);
  };
  const logout = async () => {
    await api.adminLogout();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
