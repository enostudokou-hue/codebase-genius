import { useEffect, useState } from "react";
import { fetchAnalyses } from "../api/analysisapi";

export default function AnalysisList() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalyses()
      .then(setAnalyses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>🔍 Loading analyses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (analyses.length === 0) {
    return <p>No analyses yet.</p>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>📊 Code Analysis Results</h2>

      {analyses.map((a) => (
        <div
          key={a._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <h3>{a.repoUrl}</h3>
          <p><strong>Branch:</strong> {a.branch}</p>
          <p><strong>Summary:</strong> {a.summary}</p>
          <p><strong>Issues found:</strong> {a.issues.length}</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            Created: {new Date(a.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
