import Groq from "groq-sdk";

const ai = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = "llama3-70b-8192";

export interface SubjectChapter {
  subject: string;
  chapter: string;
}

export async function getChapterBrief(chapter: SubjectChapter): Promise<string> {
  const prompt = `You are an expert DGCA aviation exam coach for AirclassPRO.
Provide a comprehensive brief for:
Subject: ${chapter.subject}
Chapter: ${chapter.chapter}

Include key concepts, important rules, and exam tips.`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }]
    });
    return result.choices[0].message.content || "I'm sorry, I couldn't generate a brief for this chapter.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI consultant is currently offline. Please try again later.";
  }
}

export async function generateAIFlashcards(subject: string, topic: string): Promise<any> {
  const prompt = `You are an expert DGCA aviation exam coach. Generate exactly 15 flashcards for the topic: "${topic}" within ${subject}.

Return ONLY valid JSON in this exact format, no markdown, no preamble:
{
  "topic": "${topic}",
  "flashcards": [
    {
      "id": 1,
      "front": "Short question or term",
      "back": "Concise, memorable answer (2-3 sentences max)",
      "category": "Formula/Definition/Rule/Concept"
    }
  ]
}

Rules:
- All 15 flashcards relevant to ${topic}
- Mix formulas, definitions, rules, and key concepts
- Keep fronts punchy and backs concise but complete
- DGCA exam difficulty level`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    const text = result.choices[0].message.content || '{"flashcards": []}';
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Flashcard Gen Error:", error);
    return { topic, flashcards: [] };
  }
}

export async function generateAIQuestions(subject: string, topic: string): Promise<any> {
  const prompt = `You are an expert DGCA CPL/ATPL exam coach. Generate exactly 15 technical multiple-choice questions for the topic: "${topic}" within ${subject}.

Return ONLY valid JSON in this exact format, no markdown, no preamble:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["A. Option one", "B. Option two", "C. Option three", "D. Option four"],
      "correct": "A",
      "explanation": "Brief explanation of why A is correct."
    }
  ]
}

Rules:
- All 15 questions must be relevant to ${topic}
- Questions should match DGCA exam difficulty
- Mix easy, medium, and hard difficulty
- Each question must have exactly 4 options labeled A, B, C, D
- The "correct" field must be just the letter: A, B, C, or D`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });
    const text = result.choices[0].message.content || '{"questions": []}';
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Question Gen Error:", error);
    return { topic, questions: [] };
  }
}

export async function getWeatherBrief(icao: string, metar: string, taf: string | null): Promise<string> {
  const prompt = `You are an expert aviation meteorologist for AirclassPRO.
Decode and explain the following weather data for ${icao}:
METAR: ${metar}
TAF: ${taf || "Not available"}

Provide a pilot-friendly weather brief.`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }]
    });
    return result.choices[0].message.content || "I'm sorry, I couldn't generate a weather brief at this moment.";
  } catch (error) {
    console.error("Gemini Weather Error:", error);
    return "The AI weather consultant is currently processing satellite data. Please retry after a short delay.";
  }
}

export async function getWeatherResponse(question: string, context: { icao: string, metar: string, taf: string | null }): Promise<string> {
  const prompt = `You are an expert aviation meteorologist for AirclassPRO.
Context - Airport: ${context.icao}, METAR: ${context.metar}, TAF: ${context.taf || "Not available"}
Question: ${question}`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }]
    });
    return result.choices[0].message.content || "I was unable to analyze your request. Please try rephrasing.";
  } catch (error) {
    console.error("Gemini Q&A Error:", error);
    return "Weather Intelligence Link interrupted. Please standby.";
  }
}

export async function decodeWeather(icao: string, metar: string, taf: string | null): Promise<string> {
  const prompt = `Decode this aviation weather for ${icao}:
METAR: ${metar}
TAF: ${taf || "Not available"}
Provide clear pilot-friendly explanation.`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }]
    });
    return result.choices[0].message.content || "Unable to decode weather strings.";
  } catch (error) {
    console.error("Gemini Decode Error:", error);
    return "Weather decoding system offline. Reference AirclassPRO materials for manual decoding.";
  }
}

export async function getAIInstructorBriefing(icao: string, metar: string, taf: string): Promise<string> {
  const prompt = `You are an AI Flight Instructor for AirclassPRO.
Provide a complete pre-flight weather briefing for ${icao}:
METAR: ${metar}
TAF: ${taf}
Include go/no-go recommendation.`.trim();

  try {
    const result = await ai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }]
    });
    return result.choices[0].message.content || "I'm sorry, I couldn't generate a briefing right now.";
  } catch (error) {
    console.error("Instructor Briefing Error:", error);
    return "The instructor is currently checked out. Please try again in a moment.";
  }
}
