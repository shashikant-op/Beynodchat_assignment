const axios = require("axios");

async function googleSearch(title) {
  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: title,
        engine: "google",
        api_key: process.env.SERP_API_KEY,
        num: 5,
      },
      timeout: 10000,
    });

    const results = response.data.organic_results || [];

    // Filter top 2 blog/article links excluding certain domains
    const filteredLinks = results
      .map(item => item.link)
      .filter(
        link =>
          link &&
          !link.includes("beyondchats.com") &&
          !link.includes("youtube.com") &&
          !link.includes(".pdf")
      )
      .slice(0, 2);

    console.log(filteredLinks, "++++++++++++++");

    return filteredLinks;
  } catch (error) {
    console.error(
      " Google search failed:",
      error.response?.data || error.message
    );
    return [];
  }
}

module.exports = googleSearch;
