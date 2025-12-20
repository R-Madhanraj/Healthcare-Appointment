import axios from "axios";

// ... (keep your existing setup) ...
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 20000,
});
api.interceptors.response.use((res) => res, (err) => Promise.reject(err));

// ... (keep auth, patient, doctor exports) ...
export const authRegister = (d) => api.post("/api/auth/register", d).then(r=>r.data);
export const authLogin = (d) => api.post("/api/auth/login", d).then(r=>r.data);
export const fetchPatients = () => api.get("/api/patients").then(r=>r.data);
export const createPatient = (d) => api.post("/api/patients", d).then(r=>r.data);
export const fetchDoctors = () => api.get("/api/doctors").then(r=>r.data);

// --- APPOINTMENTS ---
export const createAppointment = (d) => api.post("/api/appointments", d).then(r=>r.data);
export const setAppointmentStatus = (id, s) => api.patch(`/api/appointments/${id}/status`, { status: s }).then(r=>r.data);
export const fetchAppointmentsByDoctor = (id) => api.get(`/api/appointments/doctor/${id}`).then(r=>r.data);
export const fetchAppointmentsByPatient = (id) => api.get(`/api/appointments/patient/${id}`).then(r=>r.data);

// ✅ NEW: Delete
export const deleteAppointment = (id) => api.delete(`/api/appointments/${id}`).then(r => r.data);

// ✅ NEW: Update
export const updateAppointment = (id, data) => api.put(`/api/appointments/${id}`, data).then(r => r.data);

export default api;