import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function explainIssue(issue) {
  const prompt = `
You are a senior software engineer.

Explain the following code issue clearly for a developer:

Rule: ${issue.rule}
Severity: ${issue.severity}
Message: ${issue.message}

Provide:
1. Explanation
2. How to fix it
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content;

  // Simple split (can improve later)
  const [explanation, fixSuggestion] = text.split("How to fix");

  return {
    explanation: explanation?.trim(),
    fixSuggestion: fixSuggestion?.trim(),
  };
}
