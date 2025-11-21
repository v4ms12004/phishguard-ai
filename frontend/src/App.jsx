// frontend/src/App.jsx
import EmailForm from "./components/EmailForm";
import "./index.css";
import logo from "./assets/phishguard-logo.png";

function App() {
  return (
    <div className="app-root">
      <div className="app">
        <header className="app-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(248,250,252,0.35), rgba(15,23,42,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 40px rgba(37,99,235,0.55)",
              }}
            >
             <div style={{ width: 140, height: 140 }}>
              <img
                src={logo}
                alt="PhishGuard AI Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            </div>
            <div>
              <h1 className="app-title">PhishGuard AI</h1>
              <p className="app-subtitle">
                Intelligent phishing detection for emails and URLs.
              </p>
            </div>
          </div>
        </header>

        <main>
          <div className="card">
            <EmailForm />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
