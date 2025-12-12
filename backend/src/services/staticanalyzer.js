import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

const CODE_EXTENSIONS = ["js", "ts", "jsx", "tsx", "py", "java"];

export async function analyzeCodebase(repoPath) {
  const issues = [];

  const files = await glob("**/*", {
    cwd: repoPath,
    nodir: true,
    ignore: ["node_modules/**", ".git/**"],
  });

  for (const file of files) {
    const ext = file.split(".").pop();
    if (!CODE_EXTENSIONS.includes(ext)) continue;

    const fullPath = path.join(repoPath, file);
    const content = await fs.readFile(fullPath, "utf-8");

    // Empty file
    if (content.trim().length === 0) {
      issues.push({
        file,
        type: "EMPTY_FILE",
        severity: "low",
        message: "File is empty",
      });
    }

    // TODO comments
    if (content.includes("TODO")) {
      issues.push({
        file,
        type: "TODO",
        severity: "medium",
        message: "TODO comment found",
      });
    }

    // console.log usage
    if (content.includes("console.log")) {
      issues.push({
        file,
        type: "DEBUG_LOG",
        severity: "medium",
        message: "console.log found (remove before production)",
      });
    }

    // Large files
    const lines = content.split("\n").length;
    if (lines > 500) {
      issues.push({
        file,
        type: "LARGE_FILE",
        severity: "high",
        message: `File has ${lines} lines`,
      });
    }
  }

  return issues;
}
