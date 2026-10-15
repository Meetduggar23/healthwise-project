const BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status}). Please try again.`);
  }
  return data as T;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  specialization: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  reason: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface NewAppointment {
  patient_name: string;
  doctor_name: string;
  specialization: string;
  date: string;
  time: string;
  reason: string;
}

export const api = {
  me: () => request<{ user: User }>("/api/auth/me"),
  login: (email: string, password: string) =>
    request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

  // Stateless chat: the client keeps history in localStorage and sends the
  // recent turns with each request. The AI key stays on the backend.
  sendChatMessage: (messages: ChatTurn[]) =>
    request<{ reply: string }>("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({ messages }),
    }),

  // Patient appointments — shared server-side store (no database).
  // Only the backend's confirmation means a booking/cancellation happened.
  myAppointments: () => request<{ appointments: Appointment[] }>("/api/appointments/mine"),
  bookAppointment: (input: NewAppointment) =>
    request<{ appointment: Appointment }>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  cancelAppointment: (id: string) =>
    request<{ appointment: Appointment }>(`/api/appointments/${encodeURIComponent(id)}/cancel`, {
      method: "POST",
    }),

  // Admin — separate session, protected server-side.
  adminMe: () => request<{ user: User }>("/api/admin/me"),
  adminLogin: (email: string, password: string) =>
    request<{ user: User }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  adminLogout: () => request<{ ok: boolean }>("/api/admin/logout", { method: "POST" }),
  allAppointments: () =>
    request<{ appointments: Appointment[] }>("/api/admin/appointments"),
  updateAppointmentStatus: (id: string, status: AppointmentStatus) =>
    request<{ appointment: Appointment }>(`/api/admin/appointments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
