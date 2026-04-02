const axios = require("axios");

const BASE_URL = "https://gitlab.com/api/v4";

const getProjects = async (username) => {
  try {
    const userRes = await axios.get(`${BASE_URL}/users?username=${username}`);
    const userId = userRes.data[0].id;

    const projectsRes = await axios.get(
      `${BASE_URL}/users/${userId}/projects`
    );

    return projectsRes.data;
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    return [];
  }
};

module.exports = { getProjects };