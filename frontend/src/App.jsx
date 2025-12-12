import { useEffect, useState } from "react";

function App() {
  const [analyses, setAnalyses] = useState([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/analysis")
      .then((res) => res.json())
      .then(setAnalyses)
      .catch(() => setError("Failed to load analyses"));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, branch }),
      });

      const data = await res.json();
      setAnalyses([data, ...analyses]);
      setRepoUrl("");
    } catch {
      setError("Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Codebase Genius</h1>

      <form onSubmit={submit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
          style={{ width: 400, marginRight: 8 }}
        />

        <input
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          style={{ width: 120, marginRight: 8 }}
        />

        <button disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />
      <h2>Saved Analyses</h2>

      {analyses.length === 0 && <p>No analyses yet</p>}

      {analyses.map((a) => (
        <div
          key={a._id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <strong>{a.repoUrl}</strong>
          <div>Branch: {a.branch}</div>
          <div style={{ marginTop: 6 }}>{a.summary}</div>

          <div style={{ marginTop: 10 }}>
            <strong>Issues ({a.issues?.length || 0})</strong>

            {!a.issues || a.issues.length === 0 ? (
              <div style={{ opacity: 0.7 }}>No issues found ✅</div>
            ) : (
              <ul>
                {a.issues.map((iss, i) => (
                  <li key={i}>
                    <strong>{iss.rule || "Issue"}</strong>
                    {iss.message && ` — ${iss.message}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <small style={{ opacity: 0.8 }}>
            {new Date(a.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;
