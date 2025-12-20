import React, { useEffect, useState } from "react";
import * as api from "../utils/api";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", time: "" });

  const u = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!u || u.role !== "DOCTOR") { window.location.href = "/login"; return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const doctors = await api.fetchDoctors();
      const doc = doctors.find(d => String(d.userId) === String(u.id));
      if (!doc) { setAppointments([]); setLoading(false); return; }
      setDoctorProfile(doc);
      const appts = await api.fetchAppointmentsByDoctor(doc.id);
      setAppointments(appts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.setAppointmentStatus(id, status);
      setAppointments(a => a.map(x => x.id === id ? { ...x, status } : x));
    } catch (err) {
      alert("Failed: " + (err.message || err));
    }
  };

  const startEdit = (appt) => {
    setEditingId(appt.id);
    setEditForm({ date: appt.appointmentDate || "", time: appt.appointmentTime || "" });
  };

  const saveEdit = async (id) => {
    try {
      await api.updateAppointment(id, {
        appointmentDate: editForm.date,
        appointmentTime: editForm.time
      });
      alert("Rescheduled!");
      setEditingId(null);
      loadData();
    } catch (err) {
      alert("Failed to update: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) return <div style={{ maxWidth: 900, margin: "20px auto", padding: 12, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" }}>Loading...</div>;

  const styles = {
    page: {
      maxWidth: 900,
      margin: "20px auto",
      padding: 16,
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto",
      color: "#0f1724",
      background: "radial-gradient(1200px 600px at 10% 10%, rgba(106,92,255,0.06), transparent 8%), radial-gradient(800px 400px at 90% 90%, rgba(0,212,255,0.04), transparent 6%), #f3f6fb"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 12,
      borderBottom: "1px solid rgba(15,23,36,0.04)"
    },
    title: { margin: 0, fontSize: 24, fontWeight: 700 },
    headerRight: { display: "flex", alignItems: "center", gap: 16 },
    doctorText: { fontWeight: 600, color: "#68708a" },
    logoutBtn: {
      padding: "8px 14px",
      background: "linear-gradient(90deg, #6a5cff, #00d4ff)",
      border: "none",
      color: "#fff",
      borderRadius: 12,
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(106,92,255,0.18)",
      fontWeight: 600
    },
    listWrap: { marginTop: 12, display: "grid", gap: 12 },
    item: {
      position: "relative",
      padding: 16,
      borderRadius: 14,
      background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(248,249,255,0.5))",
      border: "1px solid rgba(15,23,36,0.06)",
      boxShadow: "0 6px 18px rgba(19,24,46,0.06)",
      overflow: "hidden"
    },
    wedge: {
      content: '""',
      position: "absolute",
      top: "-35%",
      left: "-40%",
      width: "180%",
      height: 120,
      background: "linear-gradient(90deg, rgba(106,92,255,0.12), rgba(0,212,255,0.10))",
      transform: "rotate(-8deg)",
      pointerEvents: "none",
      zIndex: 1
    },
    itemContent: { position: "relative", zIndex: 2 },
    patientName: { fontWeight: 700, fontSize: 14, color: "#0f1724" },
    meta: { color: "#68708a", fontSize: 13, marginTop: 6 },
    editBox: {
      marginTop: 10,
      padding: 12,
      borderRadius: 10,
      background: "#fff",
      border: "1px solid rgba(15,23,36,0.04)",
      boxShadow: "0 6px 14px rgba(19,24,46,0.04)"
    },
    input: {
      padding: "8px 10px",
      borderRadius: 8,
      border: "1px solid rgba(15,23,36,0.06)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,249,255,0.98))",
      marginRight: 8
    },
    smallBtn: {
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid rgba(15,23,36,0.06)",
      background: "#fff",
      cursor: "pointer"
    },
    acceptBtn: {
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid rgba(15,23,46,0.06)",
      background: "#fff",
      cursor: "pointer"
    },
    rejectBtn: {
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid rgba(15,23,46,0.06)",
      background: "#fff",
      cursor: "pointer",
      color: "#cc0000"
    },
    statusBadge: {
      padding: "6px 10px",
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 12,
      background: "linear-gradient(90deg, rgba(106,92,255,0.12), rgba(0,212,255,0.06))",
      color: "#6a5cff"
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Doctor Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.doctorText}>{doctorProfile ? `Welcome, ${doctorProfile.name}` : `Logged in as: ${u?.username || "Doctor"}`}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {appointments.length === 0 && <div style={{ color: "#68708a" }}>No appointments found.</div>}

      <div style={styles.listWrap}>
        {appointments.map(a => (
          <div key={a.id} style={styles.item}>
            <div style={styles.wedge} />
            <div style={styles.itemContent}>
              <div style={{ marginBottom: 8 }}>
                <div style={styles.patientName}>{a.patientName || a.patientId}</div>
                <div style={styles.meta}>{a.reason}</div>
              </div>

              {editingId === a.id ? (
                <div style={styles.editBox}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} style={styles.input} />
                    <input type="time" value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} style={styles.input} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => saveEdit(a.id)} style={{ ...styles.smallBtn, background: "linear-gradient(90deg,#6a5cff,#00d4ff)", color: "#fff", border: "none" }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={styles.smallBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Time:</strong> {a.appointmentDate} at {a.appointmentTime}
                    <button onClick={() => startEdit(a)} style={{ marginLeft: 12, fontSize: 12, cursor: "pointer", background: "transparent", border: "none", textDecoration: "underline", color: "#6a5cff" }}>✏️ Reschedule</button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12, borderTop: "1px solid rgba(15,23,36,0.04)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ marginRight: 6 }}>Status:</strong>
                  <span style={{ fontWeight: "700", marginLeft: 6 }}>{a.status}</span>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={styles.statusBadge}>{a.status === "APPROVED" ? "Confirmed" : a.status}</div>
                  <button
                    onClick={() => changeStatus(a.id, "APPROVED")}
                    disabled={a.status === "APPROVED"}
                    style={{ ...styles.acceptBtn, background: a.status === "APPROVED" ? "#f0f0f0" : "#fff" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => changeStatus(a.id, "REJECTED")}
                    disabled={a.status === "REJECTED"}
                    style={{ ...styles.rejectBtn, background: a.status === "REJECTED" ? "#fff0f0" : "#fff" }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
