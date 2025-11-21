import EmailForm from "./components/EmailForm";

function App() {
  return (
    <div className="app-root">
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">PhishGuard AI</h1>
          <p className="app-subtitle">
            AI-powered phishing detection for emails and URLs. Paste suspicious content below
            to estimate risk in real time.
          </p>
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
