const API_BASE = "http://localhost:5000/api/analysis";

export async function fetchAnalyses() {
  const res = await fetch(API_BASE);
  return res.json();
}

export async function createAnalysis(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
