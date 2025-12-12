// backend/src/app.js
import express from "express";
import cors from "cors";
import Analysis from "./models/analysis.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Codebase Genius backend is running ✅",
  });
});

// POST /api/analysis  -> create + save an analysis
app.post("/api/analysis", async (req, res) => {
  try {
    const { repoUrl, branch = "main" } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ message: "repoUrl is required" });
    }

    // Stubbed analysis result (later we plug in Jaseci/AI here)
    const result = {
      repoUrl,
      branch,
      summary: `Stub analysis for ${repoUrl} on branch ${branch}`,
      issues: [],
    };

    // Save to MongoDB
    const saved = await Analysis.create(result);

    return res.status(201).json(saved); // <- returns MongoDB doc with _id, createdAt, etc.
  } catch (error) {
    console.error("Analysis save error:", error);
    return res.status(500).json({
      message: "Server error while saving analysis",
      error: error.message,
    });
  }
});

// GET /api/analysis  -> list all analyses
app.get("/api/analysis", async (req, res) => {
  try {
    const items = await Analysis.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error("Get analyses error:", error);
    return res.status(500).json({
      message: "Server error while fetching analyses",
      error: error.message,
    });
  }
});

export default app;
