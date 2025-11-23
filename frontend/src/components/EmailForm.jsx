import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function formatRisk(prob) {
  if (prob >= 0.8) return "Very High Risk (Likely Phishing)";
  if (prob >= 0.6) return "High Risk (Likely Phishing)";
  if (prob >= 0.4) return "Moderate Risk";
  if (prob >= 0.2) return "Low Risk";
  return "Very Low Risk (Likely Legitimate)";
}

export default function EmailForm({ currentUser, selectedScan }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Load a selected scan from history into the form
  useEffect(() => {
    if (selectedScan) {
      setSubject(selectedScan.subject || "");
      setBody(selectedScan.body || "");
      setUrl(selectedScan.url || "");
    }
  }, [selectedScan]);

  const probability =
    result && typeof result.probability === "number"
      ? result.probability
      : null;

  const barScale = probability !== null ? probability : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();
    const trimmedUrl = url.trim();

    // Frontend guard for completely empty input
    if (!trimmedSubject && !trimmedBody && !trimmedUrl) {
      setLoading(false);
      setResult({
        error: "Please enter a subject, body, or URL before analyzing.",
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        subject: trimmedSubject,
        body: trimmedBody,
        url: trimmedUrl,
        user_id: currentUser ? currentUser.id : null,
      });

      const data = response.data;
      setResult({
        label: data.label,
        probability: data.phishing_probability,
        explanation: data.explanation || [],
        error: null,
      });
    } catch (err) {
      console.error(err);
      setResult({
        error:
          "Something went wrong while analyzing the email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="section-title">Analyze an Email</h2>
      <p className="section-subtitle">
        Paste the email content below and let PhishGuard AI estimate the risk of
        phishing.
      </p>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <label className="label" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className="input"
            placeholder="e.g., Important: Your account will be suspended"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="body">
            Email Body
          </label>
          <textarea
            id="body"
            className="textarea"
            placeholder="Paste the full email content here..."
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="url">
            URL (optional)
          </label>
          <input
            id="url"
            className="input"
            placeholder="e.g., https://secure-login-verification.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Email"}
          </button>
        </div>
      </form>

      {result && result.error && (
        <p className="error-text" style={{ marginTop: "0.75rem" }}>
          {result.error}
        </p>
      )}

      {result && !result.error && probability !== null && (
        <div className="result-panel">
          <div className="result-header">
            <span className="result-label">
              {probability >= 0.5 ? "Likely Phishing" : "Likely Legitimate"}
            </span>
            <span className="result-score">
              {(probability * 100).toFixed(1)}%
            </span>
          </div>

          {/* Risk bar with gradient and dark mask based on probability */}
          <div className="risk-bar-track" style={{ marginTop: "0.5rem" }}>
            <div
              className="risk-bar-mask"
              style={{
                width: `${(1 - Math.max(0, Math.min(1, barScale))) * 100}%`,
              }}
            />
          </div>

          <p className="result-risk-text" style={{ marginTop: "0.5rem" }}>
            {formatRisk(probability)}
          </p>

          {result.explanation && result.explanation.length > 0 && (
            <ul className="explanation-list">
              {result.explanation.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
