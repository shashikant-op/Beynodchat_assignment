require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const aiRewrite = require("./services/aiRewrite");
const fetchArticles = require("./services/fetchArticles");
const googleSearch = require("./services/googleSearch");
const update = require("./services/publishArticle");
const scrapeArticle = require("./services/scrapeArticle");

// ⏱️ Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function airesponce() {
  console.log("Base URL:", process.env.API_BASE_URL);

  // Fetch articles
  const articles = await fetchArticles();
  if (!articles.length) {
    console.log("No articles found");
    return;
  }

  
  for (const article of articles) {
    //google search using title
    const links = await googleSearch(article.title);

    if (links.length < 2) {
      console.log("Not enough reference links");
      continue;
    }

    //top 2 links
    const contents = [];

    for (const [i, link] of links.slice(0, 2).entries()) {
      const content = await scrapeArticle(link);
      console.log(`Content length from link ${i + 1}: ${content.length}`);
      contents.push(content);
    }

    // ai response
   const response = await aiRewrite(
      article._id,
      contents[0]?.slice(500),
      contents[1]?.slice(500)
    );
     await update(article._id, response, links);
    // limiting requests
    await delay(20_000);
  }
 

  console.log("Article updated successfully");
}

airesponce();
