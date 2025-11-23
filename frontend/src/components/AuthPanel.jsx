import { useState } from "react";

export default function AuthPanel({ user, onSignIn, onSignUp, onSignOut }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="card" style={{ marginTop: "1rem" }}>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          Logged in as <strong>{user.email}</strong>
        </p>
        <button className="button" type="button" onClick={onSignOut}>
          Logout
        </button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");
    setLoading(true);
    try {
      if (mode === "login") {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
        setStatusMsg("Signup successful. Check your email for confirmation if required.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <h2 style={{ fontSize: "1rem", margin: 0 }}>
          {mode === "login" ? "Login" : "Create an account"}
        </h2>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setErrorMsg("");
            setStatusMsg("");
          }}
          style={{
            border: "none",
            background: "none",
            color: "#60a5fa",
            fontSize: "0.8rem",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <label className="label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-row">
          <label className="label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="button-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Login" : "Sign up"}
          </button>
        </div>
      </form>

      {errorMsg && <p className="error-text" style={{ marginTop: "0.5rem" }}>{errorMsg}</p>}
      {statusMsg && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#a5b4fc" }}>{statusMsg}</p>
      )}
    </div>
  );
}
