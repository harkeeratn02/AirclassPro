import Groq from "groq-sdk";
import { Summary, QuizQuestion, BrainHacks, Scenario } from "../types";

const ai = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = "llama3-70b-8192";

const AVIATION_CONTEXT = `
Role: You are the Lead Flight Instructor for AirclassPRO. You are a high-performance academic and operational coach for DGCA pilot aspirants.

[KNOWLEDGE BASES]
- PRIMARY SOURCE: AirclassPRO original materials for Air Regulations, Technical General, and Navigation.
- ATPL STANDARDS: AirclassPRO's advanced syllabus for Meteorology, Human Performance, and Instrument Rating.
- REGULATORY: DGCA CARs, AICs, and The Aircraft Rules 1937.

[TECHNICAL MODULES]
- Air Regulations: Aircraft Rules 1937, CARs, ICAO Annexes
- Meteorology: Aviation Weather, Indian Climatology, METAR/TAF
- Air Navigation: Mathematical precision, E6B logic
- RTR: ICAO Phraseology, WPC Exam standards
- Technical General: Aerodynamics, Aircraft Systems
- Human Performance: Human Factors, CRM, Fatigue, Hypoxia
- Technical Specific: Cessna, Diamond systems and performance
`;

async function callGroq(prompt: string): Promise<string> {
  const result = await ai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }]
  });
  return result.choices[0].message.content || "";
}

export async function generateScenario(topic: string): Promise<Scenario> {
  const prompt = `${AVIATION_CONTEXT}
Generate a high-stakes aviation scenario for: ${topic}

Return ONLY valid JSON:
{
  "title": "Scenario Title",
  "description": "Technical description",
  "options": [
    { "id": "1", "text": "Option 1", "consequence": "Result", "isSafe": false },
    { "id": "2", "text": "Option 2", "consequence": "Result", "isSafe": true },
    { "id": "3", "text": "Option 3", "consequence": "Result", "isSafe": false },
    { "id": "4", "text": "Option 4", "consequence": "Result", "isSafe": false }
  ],
  "correctLogic": "Explanation"
}`;
  const text = await callGroq(prompt);
  return JSON.parse(text.replace(/```json|```/g, "").trim() || "{}");
}

export async function generateSummary(text: string): Promise<Summary> {
  const prompt = `${AVIATION_CONTEXT}
Summarize this aviation material into The Flight Log:
1. Operational Briefing: 1 sentence on technical relevance
2. Technical Pillars: 3-5 critical facts
3. The Checklist: Key terms and definitions

Text: ${text}

Return ONLY valid JSON:
{
  "bigPicture": "1 sentence summary",
  "corePillars": ["Fact 1", "Fact 2", "Fact 3"],
  "cheatSheet": [{ "term": "Term 1", "definition": "Definition 1" }]
}`;
  const result = await callGroq(prompt);
  return JSON.parse(result.replace(/```json|```/g, "").trim() || "{}");
}

export async function generateQuiz(text: string): Promise<QuizQuestion[]> {
  const prompt = `${AVIATION_CONTEXT}
Generate exactly 15 MCQs based on this material:

Text: ${text}

Return ONLY valid JSON array:
[{
  "id": "1",
  "type": "mcq",
  "question": "Question text",
  "options": ["A. Option one", "B. Option two", "C. Option three", "D. Option four"],
  "correctAnswer": "A",
  "explanation": "Brief explanation"
}]`;
  const result = await callGroq(prompt);
  return JSON.parse(result.replace(/```json|```/g, "").trim() || "[]");
}

export async function generateBrainHacks(text: string): Promise<BrainHacks> {
  const prompt = `${AVIATION_CONTEXT}
Create memory aids for this aviation content:

Text: ${text}

Return ONLY valid JSON:
{
  "legoBreakdown": ["Step 1", "Step 2", "Step 3"],
  "mnemonic": "Catchy acronym",
  "eli5": "Simple everyday analogy"
}`;
  const result = await callGroq(prompt);
  return JSON.parse(result.replace(/```json|```/g, "").trim() || "{}");
}
