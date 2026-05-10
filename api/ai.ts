import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { model, contents, config: aiConfig } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenAI(apiKey);
    const aiModel = genAI.getGenerativeModel({ 
      model: model || "gemini-3-flash-preview",
      generationConfig: aiConfig
    });

    // Handle string contents or object contents
    const result = await aiModel.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Vercel AI Error:", error);
    return new Response(JSON.stringify({ error: error.message || "AI generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
