const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeArticle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove noise
    $("script, style, nav, footer, header, iframe, ads").remove();

    let content = "";

    const selectors = [
      "article",
      ".post-content",
      ".entry-content",
      ".blog-content",
      ".content",
      "main",
    ];

    for (const selector of selectors) {
      if ($(selector).length) {
        content = $(selector).text();
        break;
      }
    }

    // fallback
    if (!content) {
      $("p").each((_, el) => {
        content += $(el).text() + "\n";
      });
    }

    return content.replace(/\s+/g, " ")   // remove extra spaces/newlines
    .trim();

  } catch (error) {
    console.error(`Scraping failed for ${url}`);
    return "";
  }
}

module.exports = scrapeArticle;
