import fs from "fs";

const content = fs.readFileSync("posts/my-post.md", "utf-8");

await fetch("https://dev.to/api/articles", {
  method: "POST",
  headers: {
    "api-key": process.env.DEVTO_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    article: {
      title: content.split("#")[1].split("\n")[0],
      body_markdown: content,
      published: true,
    },
  }),
});