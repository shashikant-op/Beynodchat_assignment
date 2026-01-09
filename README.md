# BeyondChats

Professional content-generation and publishing pipeline combining a Next.js frontend, an Express/MongoDB backend, and automated AI-assisted article rewriting using Google GenAI and web scraping.

## Table of contents

- Project overview
- Architecture / working diagram
- Quickstart (dev) — run locally
- Environment variables
- Dependencies
- API reference
- Project structure
- Notes, troubleshooting and next steps

## Project overview

BeyondChats is an experimental system to ingest article records, find top-ranking reference content on the web, scrape and analyze it, then use a generative AI model to rewrite and improve the original article for SEO and publish the result back to the database. The stack is intentionally split:

- Frontend: Next.js app (user-facing list and article pages)
- Backend: Express API with MongoDB (article storage and CRUD)
- AI worker: small Node script that performs searches, scrapes pages, calls a generative AI model, and updates articles

Use cases: content improvement automation, SEO-driven rewrites, content pipeline experimentation.

## Working / Architecture diagram

The ASCII diagram below shows the main components and how they interact.

Frontend (Next.js)
	-> calls REST API
		 http://localhost:5000/api/articles
			 /
			/         <-- Express API (CRUD)
		 /
	MongoDB (articles collection) <--- Express reads/writes

AI Worker (src/AIservices/index.js)
	- fetches pending articles from API (API_BASE_URL)
	- uses SerpAPI to get top links for each article title
	- scrapes the top links with Cheerio
	- sends prompt + references to Google Generative AI (Gemini)
	- updates article via API with aiContentBlocks and referenceUrl

Simplified flow:

Frontend <-> Backend (Express + Mongoose) <-> MongoDB
															 ^
															 |
												 AI Worker (scrape/search/genAI)

## Quickstart (development)

Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or hosted, connection string required)
- SerpAPI key (for Google search results) — optional for AI worker
- Google Generative AI (Gemini) key — optional for AI worker

1. Start the backend API

```zsh
cd Backend
npm install
# start server (option A)
node src/server.js

# or for development with auto-reload (if you have nodemon installed)
npx nodemon src/server.js
```

By default the backend listens on port 5000. The server uses dotenv; place your `.env` in `Backend/.env` (see Environment variables below).

Run the scraper (original article ingestion)

After the backend is running and connected to MongoDB, you can run the scraper which ingests or refreshes original articles into the API. The scraper script is located at `Backend/src/scrap/scrapBlogs.js`.

```zsh
cd Backend
node src/scrap/scrapBlogs.js
```

This script should POST or update articles through the backend API. Watch the backend console and the `MongoDB Connected` message to confirm the DB connection is healthy.

Then run the AI rewrite & update worker

Once articles are ingested (or if you already have pending articles with `isUpdated: false`), run the AI worker which performs search, scrape of references, generates rewritten content and updates the article via the API:

```zsh
cd Backend
node src/AIservices/index.js
```

Notes and verification

- Ensure the backend printed `MongoDB Connected` on start (this comes from `src/config/db.js`) and that the server logs show `Server running on port 5000`.
- Confirm `API_BASE_URL` in your `.env` points to `http://localhost:5000/api/articles` (used by both the scraper and AI worker).
- Check backend logs when running the scraper or AI worker to verify requests are received and articles are being created/updated.
- The AI worker includes deliberate delays to avoid rate limit spikes — expect multi-second pauses when it processes multiple articles.

2. Start the frontend

```zsh
cd frontend/beyondchats
npm install
npm run dev
```

The Next.js app runs by default on port 3000. Open http://localhost:3000.

3. (Optional) Run the AI worker

The AI worker lives at `Backend/src/AIservices/index.js`. It is a Node script that will:

- Fetch pending articles from the API_BASE_URL
- Run a SerpAPI query to get top links
- Scrape the top links
- Generate rewritten content using Google Generative AI
- Update the article through the API

To run it (once the backend is running and `.env` is configured):

```zsh
cd Backend
node src/AIservices/index.js
```

Note: this script has in-code delays to rate-limit requests; it is intended as a background/one-off worker process and not a high-throughput service.

## Environment variables

Create a `.env` file in the `Backend` directory. At minimum configure:

- MONGO_URI — MongoDB connection string (required)
- API_BASE_URL — Base URL for articles REST endpoint. Example: `http://localhost:5000/api/articles` (used by AI worker)
- SERP_API_KEY — SerpAPI key (used by AI worker to find references)
- GEMINI_API_KEY — Google Generative AI (Gemini) API key (used by aiRewrite service)

Example `Backend/.env`:

```text
MONGO_URI=mongodb://localhost:27017/beyondchats
API_BASE_URL=http://localhost:5000/api/articles
SERP_API_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_key_here
```

Frontend environment (client)

The Next.js frontend reads a client-side base URL from `frontend/beyondchats/.env`. Create or update that file with the public API URL your frontend should call.

Example `frontend/beyondchats/.env`:

```text
NEXT_PUBLIC_API_URL=https://beynodchattest.onrender.com
```

If you're running everything locally during development, set `NEXT_PUBLIC_API_URL=http://localhost:5000/api/articles` (or point to your deployed backend).

## Dependencies (high level)

Backend (see `Backend/package.json`)

- express — HTTP server
- mongoose — MongoDB ODM
- dotenv — env config
- axios — HTTP requests (used by AI services)
- cheerio — HTML scraping
- @google/generative-ai / @google/genai — Google GenAI client
- google-it / serpapi (via HTTP) — search results
- cors
- nodemon (dev)

Frontend (see `frontend/beyondchats/package.json`)

- next (React framework)
- react / react-dom
- axios
- react-markdown
- tailwindcss (dev)

## API Reference (articles)

Base route: /api/articles

- POST /api/articles/new — create an article (body: article fields)
- GET  /api/articles/ — list all articles
- GET  /api/articles/:id — fetch a single article by id
- PUT  /api/articles/:id — update an article (e.g., `aiContentBlocks`, `referenceUrl`, `isUpdated`)
- DELETE /api/articles/:id — delete

Example: create a simple article (minimal fields):

```zsh
curl -X POST http://localhost:5000/api/articles/new \
	-H 'Content-Type: application/json' \
	-d '{"title":"My Title","contentBlocks":"Original content","sourceUrl":"https://example.com/article"}'
```

Example: update an article with AI content

```zsh
curl -X PUT http://localhost:5000/api/articles/<ARTICLE_ID> \
	-H 'Content-Type: application/json' \
	-d '{"aiContentBlocks":"Rewritten content","referenceUrl":["https://ref1","https://ref2"],"isUpdated":true}'
```

## Project structure (high level)

- Backend/
	- src/
		- app.js           # express app
		- server.js        # server bootstrap + DB connect
		- config/db.js     # mongoose connection
		- controllers/     # express controllers (articleController)
		- models/          # mongoose models (Article)
		- routes/          # express routes (articleRoutes)
		- AIservices/      # AI worker + services (rewrite, search, scrape, publish)

- frontend/beyondchats/
	- src/               # Next.js pages/components

## Notes, troubleshooting and next steps

- Backend start script: `Backend/package.json` does not contain a `start` script by default. You can either run `node src/server.js` or add the following scripts to `Backend/package.json`:

```json
"scripts": {
	"start": "node src/server.js",
	"dev": "nodemon src/server.js"
}
```

- Ensure `API_BASE_URL` points to the articles endpoint (including the `/api/articles`). The AI worker relies on that value to fetch and update articles.
- Rate limits: the AI worker uses SerpAPI and external scraping — watch rate/usage limits for SerpAPI and your GenAI provider.
- Security: do not commit `.env` values or API keys. Use a secrets manager for production deployments.

## Contributing

If you'd like to contribute, please open issues or pull requests. Suggested low-risk improvements:

- Add unit and integration tests for `articleController` and AI services
- Add a proper start/dev script to `Backend/package.json` (see above)
- Add logging and retries for the AI worker

## License

This repository does not include a license file. Add `LICENSE` if you intend to publish under an open source license.

---

If you'd like, I can also:

- add the recommended `start`/`dev` scripts to `Backend/package.json` (small change),
- or create a sample `Backend/.env.example` file with the expected variables.

Tell me which of those you'd like and I'll make the changes.

