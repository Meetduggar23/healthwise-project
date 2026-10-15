import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Appointment } from "../api/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await api.myAppointments();
      setAppointments(r.appointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmCancel = async () => {
    if (confirmId === null) return;
    setNotice("");
    setError("");
    try {
      // Only the backend's confirmation means the cancellation happened.
      const r = await api.cancelAppointment(confirmId);
      setAppointments((list) => list.map((a) => (a.id === r.appointment.id ? r.appointment : a)));
      setNotice("Appointment cancelled successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel the appointment.");
    } finally {
      setConfirmId(null);
    }
  };

  const cancellable = (a: Appointment) => a.status === "Pending" || a.status === "Confirmed";

  return (
    <div className="page">
      <h1>My Appointments</h1>
      <p className="sub">All your booked appointments, soonest first. Shared demo server storage (cleared on server restart).</p>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      {loading ? (
        <div className="card empty"><p className="sub">Loading your appointments…</p></div>
      ) : appointments.length === 0 ? (
        <div className="card empty">
          <div className="big" aria-hidden="true">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#8a97a5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2>No appointments yet</h2>
          <p className="sub" style={{ textAlign: "center" }}>
            You haven't booked any appointments. Book one in under a minute.
          </p>
          <Link to="/book" className="btn">Book Appointment</Link>
        </div>
      ) : (
        <div className="appt-list">
          {appointments.map((a) => {
            const [y, mo, d] = a.date.split("-").map(Number);
            return (
              <div className="appt" key={a.id}>
                <div className="appt-date">
                  <div className="d">{String(d).padStart(2, "0")}</div>
                  <div className="m">{MONTHS[mo - 1]} {y}</div>
                </div>
                <div className="appt-body">
                  <h3>{a.doctor_name || a.specialization || "Doctor"}</h3>
                  <div className="appt-meta">
                    {a.specialization && <div><strong>Specialization:</strong> {a.specialization}</div>}
                    <div><strong>Patient:</strong> {a.patient_name}</div>
                    <div><strong>Time:</strong> {formatTime(a.time)}</div>
                    <div><strong>Reason:</strong> {a.reason}</div>
                    <div><strong>ID:</strong> {a.id}</div>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span className={`status status-${a.status}`}>{a.status}</span>
                    {cancellable(a) && (
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(a.id)}>
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmId !== null && (
        <div className="modal-back" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cancel appointment?</h2>
            <p className="sub">
              Are you sure you want to cancel this appointment? The record will be kept
              and marked as Cancelled.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>
                Keep it
              </button>
              <button className="btn btn-danger" onClick={confirmCancel}>
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
