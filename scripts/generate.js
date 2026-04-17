import fs from "fs";
import fetch from "node-fetch";

const filePath = process.argv[2];

const file = fs.readFileSync(filePath, "utf-8");
const title = file.split("title:")[1].trim();

// Gemini API
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `
You are a senior tech blogger.

Generate:
1. Full blog article (markdown)
2. LinkedIn post
3. dev.to tags

Title: ${title}

Return JSON ONLY:
{
  "content": "...",
  "linkedin": "...",
  "tags": ["..."]
}
              `,
            },
          ],
        },
      ],
    }),
  }
);

const data = await res.json();
const candidate = data?.candidates?.[0];

if (!candidate) {
  console.error("No candidates returned from Gemini:", data);
  process.exit(1);
}

const text = candidate?.content?.parts?.[0]?.text;

if (!text) {
  console.error("No text in Gemini response:", data);
  process.exit(1);
}

const output = JSON.parse(text);

// overwrite file
const newContent = `
# ${title}

${output.content}

---

## LinkedIn Post
${output.linkedin}

---

## Tags
${output.tags.join(", ")}
`;

fs.writeFileSync(filePath, newContent);

console.log("Done updating post!");
