import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ScanHistory({ currentUser, onSelectScan }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setScans([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchScans() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!mounted) return;

      if (error) {
        console.error("Error fetching scans:", error);
        setErrorMsg("Failed to load scan history.");
      } else {
        setScans(data || []);
      }

      setLoading(false);
    }

    fetchScans();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="card" style={{ marginTop: "1.25rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
          Scan History
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          Log in to see your recent phishing analysis history.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <h2 style={{ fontSize: "1rem", margin: 0 }}>Recent Scans</h2>
        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
          Showing latest {scans.length} result
          {scans.length === 1 ? "" : "s"}
        </span>
      </div>

      {loading && (
        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          Loading scan history…
        </p>
      )}

      {errorMsg && (
        <p style={{ fontSize: "0.85rem", color: "#f97373" }}>{errorMsg}</p>
      )}

      {!loading && !errorMsg && scans.length === 0 && (
        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          No scans yet. Analyze an email to see it appear here.
        </p>
      )}

      {!loading && scans.length > 0 && (
        <div style={{ marginTop: "0.5rem", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8rem",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#9ca3af" }}>
                <th style={{ padding: "0.4rem 0.4rem" }}>Date</th>
                <th style={{ padding: "0.4rem 0.4rem" }}>Subject</th>
                <th style={{ padding: "0.4rem 0.4rem" }}>Probability</th>
                <th style={{ padding: "0.4rem 0.4rem" }}>Label</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => {
                const prob = scan.probability ?? 0;
                const pct = (prob * 100).toFixed(1);
                const label = scan.label || "unknown";
                const isPhishing = label.toLowerCase() === "phishing";

                return (
                  <tr
                    key={scan.id}
                    onClick={() => onSelectScan && onSelectScan(scan)}
                    style={{
                      borderTop: "1px solid rgba(30, 64, 175, 0.4)",
                      cursor: "pointer",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.4rem 0.4rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {scan.created_at
                        ? new Date(scan.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "0.4rem 0.4rem",
                        maxWidth: "260px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      title={scan.subject || ""}
                    >
                      {scan.subject || (
                        <span style={{ color: "#64748b" }}>(no subject)</span>
                      )}
                    </td>
                    <td style={{ padding: "0.4rem 0.4rem" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span>{pct}%</span>
                        <div
                          style={{
                            width: "80px",
                            height: "0.35rem",
                            borderRadius: "999px",
                            backgroundColor: "rgba(15,23,42,0.9)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, prob * 100)
                              )}%`,
                              height: "100%",
                              borderRadius: "999px",
                              background:
                                "linear-gradient(90deg,#22c55e,#eab308,#ef4444)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "0.4rem 0.4rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          backgroundColor: isPhishing
                            ? "rgba(239,68,68,0.16)"
                            : "rgba(22,163,74,0.16)",
                          color: isPhishing ? "#fca5a5" : "#bbf7d0",
                          border: isPhishing
                            ? "1px solid rgba(248,113,113,0.4)"
                            : "1px solid rgba(34,197,94,0.4)",
                          textTransform: "capitalize",
                        }}
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
