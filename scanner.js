const axios = require("axios");
const { SECRET_PATTERNS, SENSITIVE_FILES } = require("./utils/regex");

const BASE_URL = "https://gitlab.com/api/v4";

const scanProject = async (project) => {
  const issues = [];

  try {
    const treeRes = await axios.get(
      `${BASE_URL}/projects/${project.id}/repository/tree`
    );

    const files = treeRes.data.map((f) => f.name);

    
    files.forEach((file) => {
      if (SENSITIVE_FILES.includes(file)) {
        issues.push({
          type: "Sensitive File",
          message: `${file} found`,
          severity: "High",
        });
      }
    });

    
    if (!files.includes("README.md")) {
      issues.push({
        type: "Metadata",
        message: "Missing README.md",
        severity: "Low",
      });
    }

    if (!files.includes("LICENSE")) {
      issues.push({
        type: "Metadata",
        message: "Missing LICENSE",
        severity: "Low",
      });
    }

    
    for (let file of treeRes.data.slice(0, 5)) {
      if (file.type === "blob") {
        try {
          const fileRes = await axios.get(
            `${BASE_URL}/projects/${project.id}/repository/files/${encodeURIComponent(
              file.path
            )}/raw?ref=main`
          );

          const content = fileRes.data;

          SECRET_PATTERNS.forEach((pattern) => {
            if (pattern.test(content)) {
              issues.push({
                type: "Exposed Secret",
                message: `Secret found in ${file.name}`,
                severity: "High",
              });
            }
          });
        } catch (e) {}
      }
    }

    return {
      project: project.name,
      issues,
    };
  } catch (err) {
    return {
      project: project.name,
      issues: [{ message: "Error scanning repo", severity: "Medium" }],
    };
  }
};

module.exports = { scanProject };