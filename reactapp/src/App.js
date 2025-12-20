import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginRegister from "./components/LoginRegister";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import DoctorDashboard from "./components/DoctorDashboard";

import "./App.css";

function RequireAuth({ children }) {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function MainApp() {
  const [mode, setMode] = useState("book");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Clinic App</h1>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>

      <nav className="app-tabs">
        <button
          className={`app-tab ${mode === "book" ? "active" : ""}`}
          onClick={() => setMode("book")}
        >
          Book Appointment
        </button>

        <button
          className={`app-tab ${mode === "view" ? "active" : ""}`}
          onClick={() => setMode("view")}
        >
          View Appointments
        </button>
      </nav>

      <main className="app-main">
        {mode === "book" ? <AppointmentForm /> : <AppointmentList />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />

        <Route
          path="/doctor"
          element={
            <RequireAuth>
              <DoctorDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/application"
          element={
            <RequireAuth>
              <MainApp />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/application" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
