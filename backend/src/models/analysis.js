import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  file: String,
  type: String,
  severity: String,
  message: String,
});

const analysisSchema = new mongoose.Schema(
  {
    repoUrl: String,
    branch: String,
    summary: String,
    issues: [
      {
        rule: String,
        severity: String,
        file: String,
        line: Number,
        message: String,

        // 🤖 AI fields
        explanation: String,
        fixSuggestion: String,
      }
    ]
  },
  { timestamps: true }
);


// ✅ Prevent model overwrite error
const Analysis =
  mongoose.models.Analysis ||
  mongoose.model("analysis", analysisSchema);

export default Analysis;


