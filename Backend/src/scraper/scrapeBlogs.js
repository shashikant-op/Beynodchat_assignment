const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Article = require("../models/Article");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});

const BLOG_URL = "https://beyondchats.com/blogs/";

async function scrapeBlogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const { data } = await axios.get(BLOG_URL);
  const $ = cheerio.load(data);

  const articleLinks = [];

  $("h2 a").each((i, el) => {
    const link = $(el).attr("href");
    if (link) articleLinks.push(link);
  });

  const articlesToScrape = articleLinks.slice(-5);

  for (const link of articlesToScrape) {
    const articlePage = await axios.get(link);
    const $$ = cheerio.load(articlePage.data);

    const title = $$("h1").first().text().trim();

    // Hero Image
    const heroImage = $$(".elementor-widget-theme-post-content img")
      .first()
      .attr("src");

    let markdown = `# ${title}\n\n`;

    if (heroImage) {
      markdown += `![Hero Image](${heroImage})\n\n`;
    }
    const contentImages = [];
    // Main content
    $$(".elementor-widget-theme-post-content")
      .find("p, h2, h3, ul, ol, img")
      .each((i, el) => {
        const tag = el.tagName.toLowerCase();

        // Paragraph
        if (tag === "p") {
          const text = $$(el).text().trim();
          if (text) markdown += `${text}\n\n`;
        }

        // Headings
        if (tag === "h2") {
          markdown += `## ${$$(el).text().trim()}\n\n`;
        }

        if (tag === "h3") {
          markdown += `### ${$$(el).text().trim()}\n\n`;
        }

        // Images
        if (tag === "img") {
          const src = $$(el).attr("src");
          contentImages.push(src);
          if (src) markdown += `![Image](${src})\n\n`;
        }

        // Lists
        if (tag === "ul" || tag === "ol") {
          $$(el).find("li").each((i, li) => {
            const text = $$(li).text().trim();
            if (text) markdown += `- ${text}\n`;
          });
          markdown += `\n`;
        }
      });

    await Article.create({
      title,
      heroImage,
      contentImages: contentImages,
      contentBlocks: markdown,
      aiContentBlocks: "",
      sourceUrl: link,
      isUpdated: false,
    });

    console.log(`✅ Saved article: ${title}`);
  }
}

scrapeBlogs()
  .then(() => {
    console.log("🚀 Scraping completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Scraping error:", err);
    process.exit(1);
  });

module.exports = scrapeBlogs;
