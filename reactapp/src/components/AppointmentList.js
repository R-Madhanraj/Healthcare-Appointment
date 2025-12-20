import React, { useEffect, useState } from "react";
import * as api from "../utils/api";
import "./AppointmentList.css";

export default function AppointmentList() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  // Helper to refresh list
  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (!u) { setError("Not logged in"); return; }

      // Patient Flow
      const patients = await api.fetchPatients();
      const username = (u.username || "").toLowerCase();
      const match = (patients || []).find((p) => (p.name || "").toLowerCase() === username);

      if (!match) {
        setError("No patient record found.");
        return;
      }
      const appts = await api.fetchAppointmentsByPatient(match.id);
      setAppointments(appts || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // ✅ NEW: Handle Cancel
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id)); // Remove from UI
    } catch (err) {
      alert("Failed to cancel: " + err.message);
    }
  };

  if (loading) return <div>Loading appointments…</div>;
  if (error) return <div style={{ color: "#b00020" }}>{error}</div>;
  if (!appointments.length) return <div>No appointments found.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h3>Your Appointments</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {appointments.map((a) => (
          <li key={a.id} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div><strong>Doctor:</strong> {a.doctor?.name || a.doctorName || "—"}</div>
                <div><strong>Date:</strong> {a.appointmentDate} at {a.appointmentTime}</div>
                <div><strong>Reason:</strong> {a.reason}</div>
                <div style={{ marginTop: 4 }}>
                  <strong>Status:</strong> <span style={{ color: getStatusColor(a.status) }}>{a.status}</span>
                </div>
              </div>
              {/* Only show Cancel if not completed/rejected */}
              {a.status === "REQUESTED" && (
                <button 
                  onClick={() => handleCancel(a.id)}
                  style={{ background: "#d32f2f", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "APPROVED") return "green";
  if (status === "REJECTED") return "red";
  return "orange";
}