// reactapp/src/components/LoginRegister.js
import React, { useState } from "react";
import "./LoginRegister.css";
import * as api from "../utils/api";

export default function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setMsg("");
    if (!username.trim() || !password) { setMsg("fill username & password"); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        await api.authRegister({ username: username.trim(), password });
        setMsg("registered — logging in...");
      }
      const login = await api.authLogin({ username: username.trim(), password });
      localStorage.setItem("user", JSON.stringify(login));
      if (login.role === "DOCTOR") window.location.href = "/doctor";
      else window.location.href = "/";
    } catch (err) {
      setMsg(err?.message || "server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h3>{mode === "login" ? "Login" : "Register"}</h3>

      <div className="auth-toggle">
        <button type="button" className={mode==="login" ? "active":""} onClick={() => setMode("login")}>Login</button>
        <button type="button" className={mode==="register" ? "active":""} onClick={() => setMode("register")}>Register</button>
      </div>

      <div className="auth-field">
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="auth-field">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {msg && <div className="auth-msg">{msg}</div>}

      <div className="auth-actions">
        <button type="button" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : (mode === "login" ? "Login" : "Register")}
        </button>
      </div>
    </div>
  );
}
