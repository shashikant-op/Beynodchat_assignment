# BeyondChats Full Stack Intern Assignment

This repository contains the implementation of **Phase 1 and Phase 2** of the BeyondChats Full Stack Intern Assignment. The project focuses on automated article collection, storage, and AI-based content processing using a clean, scalable backend architecture.

---

##  Project Overview

The goal of this assignment is to:

* Automatically fetch and store articles from BeyondChats blogs
* Preserve original content for transparency
* Analyze and rewrite articles using AI (Google Gemini)
* Maintain a clear separation between original and AI-processed content

The implementation follows real-world backend best practices, including modular services, database versioning, and AI token optimization.

---

##  Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Web Scraping:** Axios, Cheerio
* **AI Integration:** Google Gemini (`@google/genai`, `@google/generative-ai`)
* **Environment Management:** dotenv
* **Version Control:** Git & GitHub
* **Development Tools:** Nodemon

---

##  Project Structure

```
project-root/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Article.js
│   ├── scripts/
│   │   ├── phase1.js
│   │   └── phase2.js
│   └── services/
│       ├── fetchArticles.js
│       ├── scrapeArticle.js
│       ├── aiRewrite.js
│       └── googleSearch.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# ⚡ Quick Start

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

### Dependencies

* `@google/genai` — Google Gemini AI integration
* `@google/generative-ai` — Generative AI support
* `axios` — HTTP requests for scraping & API calls
* `cheerio` — HTML parsing for scraping
* `cors` — Cross-origin requests handling
* `dotenv` — Environment variables
* `express` — Backend server
* `google-it` — Google search API
* `mongoose` — MongoDB ODM

### Dev Dependencies

* `nodemon` — Auto-restart server during development

```bash
npm install
```

### 3.Configure Environment Variables

Create a `.env` file in the project root and add:

```
MONGO_URI=
API_BASE_URL=http://localhost:5000/api/articles
SERP_API_KEY=
GEMINI_API_KEY=
```

### 4.Connect to MongoDB

Ensure your MongoDB is running locally or provide a remote connection in `MONGO_URI`.

### 5.Run Phase 1 (Scraping Articles from Backend/)

```bash
node src/scraper/scrapBlogs.js
```

This will fetch and store original articles in the database.

### 6.Run Phase 2 (AI Processing)

```bash
node src/AIservices/index.js
```

This will analyze and generate AI-enhanced content for each article and upadate in db.

### 7. Verify in Database

Check your MongoDB collection to ensure articles have been stored and AI content is updated.

---

#  Phase 1: Article Scraping & Storage

##  Objective

To scrape all blog articles from the BeyondChats website and store the **original content** safely in the database without any AI modification.

---

##  Phase 1 Workflow

1. Fetch all blog URLs from BeyondChats.
2. Visit each article page.
3. Extract:

   * Title (`title`)
   * All images (`heroImage` & `contentImages`)
   * Original content (`contentBlocks`)
   * Source URL (`sourceUrl`)
4. Store the extracted data in MongoDB.

---

##  Database Schema (Phase 1 & 2)

```js
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  aititle: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  heroImage: { type: String },
  contentImages: { type: [String], default: [] },
  contentBlocks: { type: String, required: true },
  aiContentBlocks: { type: String, default: "" },
  sourceUrl: { type: String, required: true },
  referenceUrl: { type: [String], default: [] },
  isUpdated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);
```

---

## Phase 1 Design Decisions

* **Original content is preserved** in `contentBlocks`.
* Images are stored in arrays (`contentImages`) instead of single links.
* Modular scraping logic ensures scalability.
* Prevents duplicate entries.

---

# Phase 2: AI Content Analysis & Rewriting

##  Objective

To analyze the original articles and generate AI-enhanced rewritten content without losing the original article.

---

##  Phase 2 Workflow

### Step 1: Content Analysis

* Articles are chunked if content is too long (~65k characters).
* Each chunk is sent to Google Gemini to analyze structure, topics, and context.

### Step 2: AI Rewriting

* Gemini generates:

  * Improved readability and flow
  * SEO-friendly structure
  * Professional tone
* The rewritten content is stored in `aiContentBlocks`.
* Updated AI title is stored in `aititle`.
* `isUpdated` flag is set to `true`.

---

##  AI Model Selection

* **Model Used:** Google Gemini (`@google/genai`, `@google/generative-ai`)
* **Reason:** Free tier availability, large context window, reliable content understanding.

---

##  Environment Variables

```
MONGO_URI=
API_BASE_URL=http://localhost:5000/api/articles
SERP_API_KEY=
GEMINI_API_KEY=
```

> `.env` is included in `.gitignore` for security.

---

##  Error Handling & Optimizations

* Content chunking to handle large articles
* Retry mechanism for failed AI calls
* Logs at every pipeline stage for debugging
* Preserves original article if AI fails

---

## Scalability Considerations

* Modular service-based architecture
* Handles thousands of articles efficiently
* AI calls optimized to reduce cost
* Ready for frontend integration in Phase 3

---

## Author

**Shashikant Sharma**
Full Stack Developer | MERN | AI Integration

---

✅ *This README strictly follows the BeyondChats assignment requirements for Phase 1 and Phase 2, reflecting the exact project setup and schema.*
