import { useState } from "react";
import "./index.css";
import logo from "./assets/phishguard-logo.png";
import EmailForm from "./components/EmailForm";
import AuthPanel from "./components/AuthPanel";
import ScanHistory from "./components/ScanHistory";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";

function App() {
  const { user, authLoading, signIn, signUp, signOut } = useSupabaseAuth();
  const [selectedScan, setSelectedScan] = useState(null);

  return (
    <div className="app-root">
      <div className="app">
        <header className="app-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 90, height: 90 }}>
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
            <EmailForm currentUser={user} selectedScan={selectedScan} />
          </div>

          {!authLoading && (
            <AuthPanel
              user={user}
              onSignIn={signIn}
              onSignUp={signUp}
              onSignOut={signOut}
            />
          )}

          <ScanHistory currentUser={user} onSelectScan={setSelectedScan} />
        </main>

        <footer className="app-footer">
          <span>
            Built by
            <a
              href="https://www.linkedin.com/in/v4ms12004/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#e5e7eb",
                fontWeight: 600,
                textDecoration: "underline",
                marginLeft: "6px",
              }}
            >
              Vamsi Doddapaneni
            </a>
            · AI &amp; Cybersecurity Engineer · University of Kansas
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
