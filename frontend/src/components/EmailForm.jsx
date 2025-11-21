import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        subject,
        body,
        url,
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed to connect to backend." });
    }

    setLoading(false);
  }

  // ... rest of component unchanged
}
