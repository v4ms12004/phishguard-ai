import EmailForm from "./components/EmailForm";

function App() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1>PhishGuard AI</h1>
      <p>Paste a suspicious email or URL to analyze it using AI.</p>

      <EmailForm />
    </div>
  );
}

export default App;
