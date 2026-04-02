const express = require("express");
const path = require("path");

const { getProjects } = require("./gitlabService");
const { scanProject } = require("./scanner");

const app = express();

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/scan", async (req, res) => {
  let username = req.query.username || "gitlab-org";

  let projects = await getProjects(username);

  // fallback if empty
  if (projects.length === 0) {
    username = "gitlab-org";
    projects = await getProjects(username);
  }

  const results = [];

  for (let project of projects) {
    const result = await scanProject(project);
    results.push(result);
  }

  res.json({
    username,
    total: results.length,
    results,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});