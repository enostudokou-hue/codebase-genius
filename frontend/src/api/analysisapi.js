import { API_BASE } from "../config";

export async function fetchAnalyses() {
  const res = await fetch(`${API_BASE}/analysis`);
  if (!res.ok) {
    throw new Error("Failed to fetch analyses");
  }
  return res.json();
}
