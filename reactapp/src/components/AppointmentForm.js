import React, { useEffect, useState } from "react";
import * as api from "../utils/api";
import "./AppointmentForm.css";

const initialForm = {
  patientName: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
};

const fallbackDoctors = [
  { id: "d1", name: "Dr. A (Cardiology)", specialization: "Cardiology" },
  { id: "d2", name: "Dr. B (Neurology)", specialization: "Neurology" },
  { id: "d3", name: "Dr. C (Orthopedics)", specialization: "Orthopedics" },
  { id: "d4", name: "Dr. D (Dermatology)", specialization: "Dermatology" },
  { id: "d5", name: "Dr. E (Pediatrics)", specialization: "Pediatrics" },
  { id: "d6", name: "Dr. F (Psychiatry)", specialization: "Psychiatry" },
];

export default function AppointmentForm({ onBooked } = {}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.fetchDoctors()
      .then((data) => {
        if (!mounted) return;

        // ensure you always have at least some doctors visible
        const unique = [];
        const seenSpecs = new Set();

        (data || [])
          .concat(fallbackDoctors)
          .forEach((doc) => {
            const spec = (doc.specialization || "").toLowerCase();
            if (!seenSpecs.has(spec)) {
              seenSpecs.add(spec);
              unique.push(doc);
            }
          });

        setDoctors(unique.slice(0, Math.max(6, unique.length)));
      })
      .catch(() => {
        if (!mounted) return;
        setDoctors(fallbackDoctors);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccessMessage("");
    setServerError("");
  };

  const validate = () => {
    const e = {};

    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.doctorId) e.doctorId = "Doctor is required";
    if (!form.appointmentDate) e.appointmentDate = "Appointment date is required";
    if (!form.appointmentTime) e.appointmentTime = "Appointment time is required";

    if (!form.reason.trim()) e.reason = "Reason is required";
    else if (form.reason.trim().length < 10)
      e.reason = "Reason must be at least 10 characters";
    else if (form.reason.trim().length > 200)
      e.reason = "Reason must be at most 200 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const findPatientByName = async (name) => {
    try {
      const patients = await api.fetchPatients();
      const existing = (patients || []).find(
        (p) => p.name && p.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) return existing.id;
    } catch {
      
    }


    const created = await api.createPatient({ name });
    return created.id;
  };

  const handleSubmit = async () => {
    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const patientId = await findPatientByName(form.patientName.trim());

      // CRITICAL FIX: IDs MUST BE STRINGS => backend rejects numbers
      const payload = {
        patientId: String(patientId),
        doctorId: String(form.doctorId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        reason: form.reason.trim(),
      };

      await api.createAppointment(payload);

      setForm(initialForm);
      setErrors({});
      setSuccessMessage("Appointment successfully booked");

      if (typeof onBooked === "function") onBooked();

    } catch (err) {
      const message =
        err?.response?.data ||
        err?.message ||
        "Server error";

      setServerError(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="appointment-card" aria-live="polite">
      <h2 className="appointment-title">Book Appointment</h2>

      {loading ? (
        <div>Loading doctors…</div>
      ) : (
        <form className="appointment-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="field-label">Patient name</label>
            <input
              className="field-input"
              value={form.patientName}
              onChange={handleChange("patientName")}
              placeholder="Enter patient name"
            />
            {errors.patientName && (
              <div className="field-error">{errors.patientName}</div>
            )}
          </div>

          <div className="form-group">
            <label className="field-label">Doctor</label>
            <select
              className="field-input"
              value={form.doctorId}
              onChange={handleChange("doctorId")}
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <div className="field-error">{errors.doctorId}</div>
            )}
          </div>

          <div className="form-group">
            <label className="field-label">Appointment date</label>
            <input
              type="date"
              className="field-input"
              value={form.appointmentDate}
              onChange={handleChange("appointmentDate")}
            />
            {errors.appointmentDate && (
              <div className="field-error">{errors.appointmentDate}</div>
            )}
          </div>

          <div className="form-group">
            <label className="field-label">Appointment time</label>
            <input
              type="time"
              className="field-input"
              value={form.appointmentTime}
              onChange={handleChange("appointmentTime")}
            />
            {errors.appointmentTime && (
              <div className="field-error">{errors.appointmentTime}</div>
            )}
          </div>

          <div className="form-group">
            <label className="field-label">Reason</label>
            <textarea
              className="field-input textarea-field"
              value={form.reason}
              onChange={handleChange("reason")}
            />
            {errors.reason && (
              <div className="field-error">{errors.reason}</div>
            )}
          </div>

          {serverError && <div className="field-error">{serverError}</div>}
          {successMessage && (
            <div className="field-success">{successMessage}</div>
          )}

          <button
            type="button"
            className="primary-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Booking…" : "Book Appointment"}
          </button>
        </form>
      )}
    </div>
  );
}
