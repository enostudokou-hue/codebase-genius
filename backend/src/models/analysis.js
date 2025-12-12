import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  file: String,
  type: String,
  severity: String,
  message: String,
});

const analysisSchema = new mongoose.Schema(
  {
    repoUrl: { type: String, required: true },
    branch: { type: String, default: "main" },
    summary: String,
    issues: [IssueSchema],
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error
const Analysis =
  mongoose.models.Analysis ||
  mongoose.model("analysis", analysisSchema);

export default Analysis;
