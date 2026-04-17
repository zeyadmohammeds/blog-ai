import fs from "fs";
import fetch from "node-fetch";

const filePath = process.argv[2];

const file = fs.readFileSync(filePath, "utf-8");
const title = file.split("title:")[1].trim();

// Gemini API
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
const output = JSON.parse(data.candidates[0].content.parts[0].text);

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