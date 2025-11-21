import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function formatRisk(prob) {
  if (prob >= 0.8) return "Critical";
  if (prob >= 0.6) return "High";
  if (prob >= 0.4) return "Moderate";
  if (prob >= 0.2) return "Low";
  return "Very Low";
}

export default function EmailForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();
    const trimmedUrl = url.trim();

    // ✅ Frontend guard: don’t call API with completely empty content
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
      });
    setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed to connect to backend." });
    } finally {
      setLoading(false);
      }
  }

  const probability =
    result && typeof result.phishing_probability === "number"
      ? result.phishing_probability
      : null;

  const label = result?.label || null;
  const riskLabel = probability !== null ? formatRisk(probability) : null;
  const isPhishing = label === "phishing";

  // for the bar we invert via scaleX from 0 to 1
  const barScale = probability !== null ? probability : 0;

  return (
    <div className="form-grid">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-row">
          <label className="label" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className="input"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Urgent: Your account will be closed"
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="body">
            Email Body
          </label>
          <textarea
            id="body"
            className="textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the email content here..."
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="url">
            URL (optional)
          </label>
          <input
            id="url"
            className="input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://example.com/login"
          />
        </div>

        <div className="button-row">
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Email"}
            {!loading && <span>➜</span>}
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          {result.error ? (
            <div className="error-text">{result.error}</div>
          ) : (
            <>
              <div className="result-header">
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Classification</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 600, marginTop: 2 }}>
                    {label === "phishing" ? "Likely Phishing" : "Likely Legitimate"}
                  </div>
                </div>

                <div
                  className={
                    "badge " + (isPhishing ? "badge--phishing" : "badge--legit")
                  }
                >
                  <span className="badge-dot" />
                  <span>{isPhishing ? "Phishing" : "Legitimate"}</span>
                </div>
              </div>

              {probability !== null && (
                <div className="risk-bar-wrapper">
                  <div className="risk-bar-label">
                    Phishing probability: {(probability * 100).toFixed(1)}% · {riskLabel} risk
                  </div>
                  <div className="risk-bar-track">
                    <div
                      className="risk-bar-mask"
                      style={{
                        width: `${(1 - Math.max(0, Math.min(1, barScale))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {Array.isArray(result.explanation) && result.explanation.length > 0 && (
                <div className="explanation">
                  <div className="explanation-title">Why this decision?</div>
                  <ul>
                    {result.explanation.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
