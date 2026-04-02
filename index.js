require("dotenv").config();
const Table = require("cli-table3");

const { getProjects } = require("./gitlabService");
const { scanProject } = require("./scanner");

const username = process.argv[2];

if (!username) {
  console.log("Usage: node index.js <gitlab-username>");
  process.exit(1);
}

const run = async () => {
  console.log(`🔍 Scanning GitLab user: ${username}\n`);

  const projects = await getProjects(username);

  const table = new Table({
    head: ["Project", "Issue", "Severity"],
  });

  for (let project of projects) {
    const result = await scanProject(project);

    if (result.issues.length === 0) {
      table.push([result.project, "No Issues", "Safe"]);
    } else {
      result.issues.forEach((issue) => {
        table.push([
          result.project,
          issue.message,
          issue.severity,
        ]);
      });
    }
  }

  console.log(table.toString());
};

run();