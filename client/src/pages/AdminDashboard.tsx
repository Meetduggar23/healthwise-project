import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, type Appointment, type AppointmentStatus } from "../api/client";
import { useAdminAuth } from "../components/AdminAuthContext";

const STATUSES: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

function isUpcoming(a: Appointment): boolean {
  if (a.status !== "Pending" && a.status !== "Confirmed") return false;
  const now = new Date();
  const slot = new Date(`${a.date}T${a.time}:00`);
  return slot.getTime() >= now.getTime() - 60_000;
}

function formatDateTime(date: string, time: string): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(d).padStart(2, "0")}/${String(mo).padStart(2, "0")}/${y}, ${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "all" ? "all" : "overview";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [doctorFilter, setDoctorFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sort, setSort] = useState<"newest" | "upcoming">("newest");

  const [detailId, setDetailId] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<{ id: string; status: AppointmentStatus } | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await api.allAppointments();
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

  // Overview counts — always computed from the actual fetched records.
  const stats = useMemo(() => {
    const count = (s: AppointmentStatus) => appointments.filter((a) => a.status === s).length;
    return {
      total: appointments.length,
      pending: count("Pending"),
      confirmed: count("Confirmed"),
      completed: count("Completed"),
      cancelled: count("Cancelled"),
      upcoming: appointments.filter(isUpcoming).length,
    };
  }, [appointments]);

  const doctorOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of appointments) {
      const label = a.doctor_name || a.specialization;
      if (label) set.add(label);
    }
    return [...set].sort();
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = appointments.filter((a) => {
      if (q && !a.patient_name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (doctorFilter && (a.doctor_name || a.specialization) !== doctorFilter) return false;
      if (dateFilter && a.date !== dateFilter) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? b.created_at.localeCompare(a.created_at)
        : `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
    return list;
  }, [appointments, search, statusFilter, doctorFilter, dateFilter, sort]);

  const detail = detailId ? appointments.find((a) => a.id === detailId) ?? null : null;

  const applyStatus = async () => {
    if (!statusTarget) return;
    setUpdating(true);
    setError("");
    setNotice("");
    try {
      // Only the backend's confirmation means the status changed.
      const r = await api.updateAppointmentStatus(statusTarget.id, statusTarget.status);
      setAppointments((list) => list.map((a) => (a.id === r.appointment.id ? r.appointment : a)));
      setNotice(`Appointment ${r.appointment.id} marked as ${r.appointment.status}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the appointment.");
    } finally {
      setUpdating(false);
      setStatusTarget(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const goView = (v: "overview" | "all") => {
    setParams(v === "all" ? { view: "all" } : {});
  };

  return (
    <div className="page">
      <div className="admin-bar">
        <div>
          <span className="admin-badge">Admin area</span>
          <h1 style={{ marginTop: 8 }}>Dashboard</h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            {admin ? `Signed in as ${admin.email}. ` : ""}Shared demo-server records (in-memory, cleared on restart).
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button>
          <button className="btn btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="tabs">
        <button className={view === "overview" ? "active" : ""} onClick={() => goView("overview")}>Overview</button>
        <button className={view === "all" ? "active" : ""} onClick={() => goView("all")}>All Appointments</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      {view === "overview" ? (
        loading ? (
          <div className="card empty"><p className="sub">Loading statistics…</p></div>
        ) : (
          <div className="stat-grid">
            <div className="stat"><div className="n">{stats.total}</div><div className="l">Total appointments</div></div>
            <div className="stat"><div className="n">{stats.pending}</div><div className="l">Pending</div></div>
            <div className="stat"><div className="n">{stats.confirmed}</div><div className="l">Confirmed</div></div>
            <div className="stat"><div className="n">{stats.completed}</div><div className="l">Completed</div></div>
            <div className="stat"><div className="n">{stats.cancelled}</div><div className="l">Cancelled</div></div>
            <div className="stat stat-hot"><div className="n">{stats.upcoming}</div><div className="l">Upcoming</div></div>
          </div>
        )
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="filter-grid">
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="f-search">Search name or ID</label>
                <input id="f-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Patient name or HW-…" maxLength={80} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="f-status">Status</label>
                <select id="f-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="f-doctor">Doctor / specialization</label>
                <select id="f-doctor" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
                  <option value="">All</option>
                  {doctorOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="f-date">Date</label>
                <input id="f-date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="f-sort">Sort</label>
                <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value as "newest" | "upcoming")}>
                  <option value="newest">Newest booking</option>
                  <option value="upcoming">Upcoming appointment</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="card empty"><p className="sub">Loading appointments…</p></div>
          ) : filtered.length === 0 ? (
            <div className="card empty">
              <h2>No appointments found</h2>
              <p className="sub" style={{ textAlign: "center" }}>Try clearing the search or filters.</p>
            </div>
          ) : (
            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th><th>Patient</th><th>Doctor / Specialization</th>
                    <th>Date &amp; time</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id}>
                      <td className="mono">{a.id}</td>
                      <td>{a.patient_name}<div className="muted">{a.patient_email}</div></td>
                      <td>{a.doctor_name || a.specialization}{a.doctor_name && a.specialization ? <div className="muted">{a.specialization}</div> : null}</td>
                      <td>{formatDateTime(a.date, a.time)}</td>
                      <td><span className={`status status-${a.status}`}>{a.status}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setDetailId(a.id)}>View</button>
                          <select
                            aria-label={`Change status for ${a.id}`}
                            value={a.status}
                            disabled={updating}
                            onChange={(e) => {
                              const next = e.target.value as AppointmentStatus;
                              if (next !== a.status) setStatusTarget({ id: a.id, status: next });
                            }}
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {detail && (
        <div className="modal-back" onClick={() => setDetailId(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h2>Appointment {detail.id}</h2>
            <div className="appt-meta">
              <div><strong>Patient:</strong> {detail.patient_name} ({detail.patient_email})</div>
              <div><strong>Doctor:</strong> {detail.doctor_name || "—"}</div>
              <div><strong>Specialization:</strong> {detail.specialization || "—"}</div>
              <div><strong>Date &amp; time:</strong> {formatDateTime(detail.date, detail.time)}</div>
              <div><strong>Reason:</strong> {detail.reason}</div>
              <div><strong>Status:</strong> <span className={`status status-${detail.status}`}>{detail.status}</span></div>
              <div><strong>Booked at:</strong> {new Date(detail.created_at).toLocaleString()}</div>
              <div><strong>Last updated:</strong> {new Date(detail.updated_at).toLocaleString()}</div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {statusTarget && (
        <div className="modal-back" onClick={() => !updating && setStatusTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{statusTarget.status === "Cancelled" ? "Cancel appointment?" : "Change status?"}</h2>
            <p className="sub">
              {statusTarget.status === "Cancelled"
                ? `Are you sure you want to cancel appointment ${statusTarget.id}? The record will be kept and marked as Cancelled.`
                : `Mark appointment ${statusTarget.id} as ${statusTarget.status}?`}
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" disabled={updating} onClick={() => { setStatusTarget(null); load(); }}>
                Back
              </button>
              <button className={statusTarget.status === "Cancelled" ? "btn btn-danger" : "btn"} disabled={updating} onClick={applyStatus}>
                {updating ? <span className="spinner" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
