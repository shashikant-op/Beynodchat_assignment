const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function aiRewrite(id, refContent1, refContent2) {

    const mainContent = await axios.get(
                            `${process.env.API_BASE_URL}/${id}`
                                    ).then(res => res.data);
  const model = genAI.getGenerativeModel({
   model: "gemini-2.5-flash-lite"
  });
  

  const prompt = `
You are an SEO content strategist and senior editor.

GOAL:
Rewrite the MAIN ARTICLE so it can rank on the first page of Google.

HOW TO USE REFERENCES:
- The reference contents are from top-ranking Google pages
- Use them ONLY to understand:
  • search intent
  • important subtopics
  • keyword coverage
  • content structure
- Do NOT copy, paraphrase, or quote reference content
- Do NOT mention sources or organizations from references

SEO RULES:
- Match user search intent clearly
- Improve headline clarity and paragraph flow
- Naturally include relevant keywords (no keyword stuffing)
- Add missing but relevant subtopics if needed
- Maintain factual accuracy
- Plagiarism-safe, original writing
- Professional, authoritative tone
- Output plain text only
IMAGE RULES:
- Use ONLY the images listed below
- Do NOT invent new image URLs
- Insert ${mainContent.contentImages.length} images naturally after relevant headings
- Use SEO-friendly descriptive alt text
- Use this exact markdown format:
  ![ALT_TEXT](IMAGE_URL)

AVAILABLE IMAGES:
${mainContent.contentImages.join("\n")}
MAIN ARTICLE:
${mainContent}

REFERENCE CONTENT 1:
${refContent1}

REFERENCE CONTENT 2:
${refContent2}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = aiRewrite;
