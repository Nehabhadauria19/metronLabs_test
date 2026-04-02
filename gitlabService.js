const axios = require("axios");

const BASE_URL = "https://gitlab.com/api/v4";

const getProjects = async (username) => {
  try {
    if (!username) {
      console.log("No username provided");
      return [];
    }

    const userRes = await axios.get(`${BASE_URL}/users?username=${username}`);

    if (!userRes.data || userRes.data.length === 0) {
      console.log(" User not found:", username);
      return [];
    }

    const userId = userRes.data[0].id;

    const projectsRes = await axios.get(
      `${BASE_URL}/users/${userId}/projects?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITLAB_TOKEN || ""}`,
        },
      }
    );

    return projectsRes.data;
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    return [];
  }
};

module.exports = { getProjects };