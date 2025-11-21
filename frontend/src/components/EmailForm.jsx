import { useState } from "react";
import axios from "axios";

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

    try {
      const response = await axios.post("http://localhost:8000/predict", {
        subject,
        body,
        url,
      });

      setResult(response.data);
    } catch (error) {
      setResult({ error: "Failed to connect to backend." });
    }

    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Email Body:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="6"
          style={{ width: "100%", marginBottom: "10px" }}
        ></textarea>

        <label>URL (optional):</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Email"}
        </button>
      </form>

      {result && (
        <pre style={{ background: "#f0f0f0", padding: "10px", marginTop: "20px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </>
  );
}
