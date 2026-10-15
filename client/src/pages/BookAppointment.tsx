import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const SAMPLE_DOCTORS = [
  "Dr. Aarav Sharma (Sample)",
  "Dr. Priya Nair (Sample)",
  "Dr. Rohan Verma (Sample)",
  "Dr. Sneha Iyer (Sample)",
];

const SPECIALIZATIONS = [
  "General Physician",
  "Pediatrician",
  "Dermatologist",
  "Orthopedic",
  "Cardiologist",
  "Neurologist",
  "Gynecologist",
  "Dentist",
  "Ophthalmologist",
  "Psychiatrist",
];

function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function nowTimeStr(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function BookAppointment() {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const today = todayStr();

  const validate = (): string | null => {
    if (patientName.trim().length < 2) return "Please enter the patient name.";
    if (!doctorName.trim() && !specialization) return "Please choose a doctor or a specialization.";
    if (!date) return "Please choose an appointment date.";
    if (date < today) return "Appointments cannot be booked for past dates.";
    if (!time) return "Please choose an appointment time.";
    if (date === today && time <= nowTimeStr()) return "Please choose a time later today.";
    if (reason.trim().length < 3) return "Please describe the reason for your visit.";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return; // prevent duplicate submissions
    setError("");
    setSuccess(false);
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    try {
      // Saved to the shared server-side demo store. Only the backend's
      // confirmation means the booking was created.
      await api.bookAppointment({
        patient_name: patientName.trim(),
        doctor_name: doctorName.trim(),
        specialization,
        date,
        time,
        reason: reason.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#e8f7ef",
            color: "#1e8e5a", fontSize: "2rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
          }}>✓</div>
          <h1>Appointment booked!</h1>
          <p className="sub" style={{ textAlign: "center" }}>
            Your appointment for <strong>{patientName}</strong> on <strong>{date}</strong> at{" "}
            <strong>{time}</strong> has been saved and is marked{" "}
            <strong>Pending</strong>.
          </p>
          <Link to="/appointments" className="btn">View My Appointments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1>Book an Appointment</h1>
        <p className="sub">Fill in the details below. Demo build: bookings are kept on the shared demo server (in-memory, cleared on restart) — no database.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="patient">Patient name</label>
            <input
              id="patient" value={patientName} onChange={(e) => setPatientName(e.target.value)}
              placeholder="Full name of the patient" maxLength={80}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="doctor">Doctor</label>
              <input
                id="doctor" list="sample-doctors" value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Choose or type a doctor" maxLength={80}
              />
              <datalist id="sample-doctors">
                {SAMPLE_DOCTORS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
            <div className="field">
              <label htmlFor="spec">Specialization</label>
              <select id="spec" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                <option value="">— Select —</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="date">Appointment date</label>
              <input id="date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="time">Appointment time</label>
              <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="reason">Reason for visit</label>
            <textarea
              id="reason" rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or the purpose of the visit" maxLength={500}
            />
          </div>
          <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>
            {busy ? <span className="spinner" /> : "Book Appointment"}
          </button>
          <p className="sub" style={{ marginTop: 14, fontSize: "0.85rem" }}>
            Note: the doctor names above are sample entries for demonstration purposes only.
          </p>
        </form>
      </div>
    </div>
  );
}
