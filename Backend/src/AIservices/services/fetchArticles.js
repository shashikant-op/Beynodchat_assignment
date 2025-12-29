const axios = require("axios");

async function fetchArticles() {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}`
    );

    // Only fetch articles which are NOT updated yet
    const pendingArticles = response.data.filter(
      article => article.isUpdated === false
    );

    return pendingArticles;
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    return [];
  }
}

module.exports = fetchArticles;
