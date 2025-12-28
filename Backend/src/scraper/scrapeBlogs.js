const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Article = require("../models/Article");
const connectDB = require("../config/db");
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

 //all article links scrapping
  $("h2 a").each((i, el) => {
    const link = $(el).attr("href");
    if (link) articleLinks.push(link);
  });

  
  const articlesToScrape = articleLinks.slice(-5);

  for (const link of articlesToScrape) {
    const articlePage = await axios.get(link);
    const $$ = cheerio.load(articlePage.data);

    const title = $$("h1").first().text().trim();
    // Hero image
    const heroImage = $$(".elementor-widget-theme-post-content img")
      .first()
      .attr("src");

    const contentBlocks = [];
//main div scrapping
    $$(".elementor-widget-theme-post-content")
      .find("p, h2, h3, ul, ol, img")
      .each((i, el) => {
        
        const tag = el.tagName.toLowerCase();
       
        // Paragraph
        if (tag === "p") {
          const text = $$(el).text().trim();
          if (text) {
            contentBlocks.push({
              blockType: "paragraph",
              text,
            });
          }
        }

        // Headings
        if (tag === "h2" || tag === "h3") {
          const text = $$(el).text().trim();

          if (text) {
            contentBlocks.push({
              blockType: "heading",
              text,
            });
          }
        }

        // Image
        if (tag === "img") {
          const src = $$(el).attr("src");

          if (src) {
            contentBlocks.push({
              blockType: "image",
              src,
            });
          }
        }

        if (tag === "ul" || tag === "ol") {
          const listItems = [];
          $$(el)
            .find("li")
            .each((i, li) => {
              const liText = $$(li).text().trim();

              if (liText) listItems.push(liText);
            });

          if (listItems.length > 0) {
            contentBlocks.push({
              blockType: "list",
              listItems,
            });
          }
        }
      });

  
    await Article.create({
      title,
      heroImage,
      contentBlocks,
      sourceUrl: link,
      aiContentBlocks: [],
      isUpdated: false,
    });

    console.log(`saved article: ${title}`);
  }
}

scrapeBlogs()
  .then(() => {
    console.log(" Scraping completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Scraping error:", err);
    process.exit(1);
  });

module.exports = scrapeBlogs;
