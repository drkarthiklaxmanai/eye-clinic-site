// netlify/functions/create-content.js
//
// Receives content from the staff-admin form, validates the password,
// builds the correct markdown file, and opens a GitHub Pull Request
// for review rather than committing directly to main.

const GITHUB_OWNER = "drkarthiklaxmanai";
const GITHUB_REPO = "eye-clinic-site";
const BASE_BRANCH = "main";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const { password, contentType, fields } = payload;

  // 1. Check password
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Incorrect password" }) };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server is not configured correctly. Contact developer." }) };
  }

  // 2. Validate content type and required fields
  if (contentType !== "blog" && contentType !== "faq") {
    return { statusCode: 400, body: JSON.stringify({ error: "Unknown content type" }) };
  }

  try {
    let filePath, fileContent, prTitle;

    if (contentType === "blog") {
      const { title, description, pubDate, author, tags, body } = fields;
      if (!title || !description || !pubDate || !body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required blog fields" }) };
      }
      const slug = slugify(title);
      filePath = `src/content/blog/${slug}.md`;
      const tagsLine = tags && tags.trim().length > 0
        ? `tags: [${tags.split(",").map(t => `"${t.trim()}"`).join(", ")}]\n`
        : "";
      const authorLine = author && author.trim().length > 0 ? `author: "${author.trim()}"\n` : "";
      fileContent =
        `---\n` +
        `title: "${escapeYaml(title)}"\n` +
        `pubDate: ${pubDate}\n` +
        `description: "${escapeYaml(description)}"\n` +
        authorLine +
        tagsLine +
        `---\n\n` +
        body;
      prTitle = `New blog post: ${title}`;
    } else {
      const { question, order, body } = fields;
      if (!question || !body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required FAQ fields" }) };
      }
      const slug = slugify(question);
      filePath = `src/content/faqs/${slug}.md`;
      const orderLine = order ? `order: ${order}\n` : "";
      fileContent =
        `---\n` +
        `question: "${escapeYaml(question)}"\n` +
        orderLine +
        `---\n\n` +
        body;
      prTitle = `New FAQ: ${question}`;
    }

    const prUrl = await createGithubPR({ token, filePath, fileContent, prTitle });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, prUrl }),
    };
  } catch (error) {
    console.error("create-content error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Something went wrong creating the content." }),
    };
  }
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function escapeYaml(text) {
  return text.replace(/"/g, '\\"');
}

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${errorBody}`);
  }
  return response.json();
}

async function createGithubPR({ token, filePath, fileContent, prTitle }) {
  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

  // 1. Get the latest commit SHA on the base branch
  const baseRef = await githubRequest(`${apiBase}/git/ref/heads/${BASE_BRANCH}`, token);
  const baseSha = baseRef.object.sha;

  // 2. Create a new branch from that commit
  const branchName = `staff-admin/${Date.now()}`;
  await githubRequest(`${apiBase}/git/refs`, token, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
  });

  // 3. Create the file on the new branch
  const contentBase64 = Buffer.from(fileContent, "utf-8").toString("base64");
  await githubRequest(`${apiBase}/contents/${filePath}`, token, {
    method: "PUT",
    body: JSON.stringify({
      message: prTitle,
      content: contentBase64,
      branch: branchName,
    }),
  });

  // 4. Open a Pull Request
  const pr = await githubRequest(`${apiBase}/pulls`, token, {
    method: "POST",
    body: JSON.stringify({
      title: prTitle,
      head: branchName,
      base: BASE_BRANCH,
      body: "Created via the staff admin panel. Review the content below, then merge to publish it live.",
    }),
  });

  return pr.html_url;
}
