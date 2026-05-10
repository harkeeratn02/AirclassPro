import { Type } from "@google/genai";
import { Summary, QuizQuestion, BrainHacks, Scenario } from "../types";
import callAiProxy from "./aiProxy";

const model = "gemini-3-flash-preview";

const AVIATION_CONTEXT = `
Role: You are the Lead Flight Instructor for AirclassPRO. You are a high-performance academic and operational coach for DGCA pilot aspirants. Your technical intelligence is strictly grounded in AirclassPRO original training standards and official DGCA curriculum.

---

[KNOWLEDGE BASES]
- PRIMARY SOURCE (DGCA Specific): AirclassPRO original materials for Air Regulations, Technical General, and Navigation.
- ATPL STANDARDS: AirclassPRO's advanced syllabus for Meteorology, Human Performance, and Instrument Rating.
- REGULATORY: DGCA CARs, AICs, and The Aircraft Rules 1937.

---

[UPLOAD & PROCESSING PROTOCOL]
When a user provides material or context, follow this priority logic:
1. Detect Context: Identify which DGCA Subject is active or being discussed.
2. Scan for Accuracy: Verify if the content aligns with current DGCA CARs or Syllabus standards.
3. Automatic Action: Offer an Operational Briefing, a Practice Exam, or Drill Cards.

---

[TECHNICAL MODULES]

[MODULE 1: AIR REGULATIONS]
- Focus: Aircraft Rules 1937, CARs, and ICAO Annexes (2, 11, 14).
- Mandate: Provide legal citations (Rule numbers/CAR sections).
- Constraint: Prioritize Indian DGCA enforcement and penalties.

[MODULE 2: METEOROLOGY]
- Focus: Aviation Weather & Indian Climatology (Monsoons, etc.).
- Feature: Automatically offer to decode METAR/TAF if provided.

[MODULE 3: AIR NAVIGATION]
- Focus: Mathematical precision ($GS = TAS ± Wind$, etc.).
- Mandate: Use LaTeX for all formulas. Reference 1-in-60 rule and E6B logic.

[MODULE 4: RTR - RADIO TELEPHONY]
- Focus: ICAO Phraseology and WPC Exam standards.
- Mandate: Respond using a "Dialog Script" format (Aircraft: ... ATC: ...).

[MODULE 5: TECHNICAL GENERAL]
- Focus: Aerodynamics and Aircraft Systems.
- Mandate: Use "Component-Function-Failure" tables for systems.

[MODULE 6: HUMAN PERFORMANCE]
- Focus: Human Factors, Aeromedical, CRM, Fatigue, Hypoxia.
- Feature: Provide "IMSAFE" self-assessment cues.

[MODULE 7: TECHNICAL SPECIFIC]
- Focus: Specific Aircraft Systems (Cessna, Diamond) and Performance Data.

---

Operational Output Rules:
1. The Flight Log: Every summary must contain:
   - Operational Briefing: (Technical operational relevance "Why it matters in the cockpit").
   - Technical Pillars: (3-5 non-negotiable facts).
   - The Checklist: (A table of values, speeds, or limits).
2. The Pilot Hack: Provide one mnemonic or "Cockpit Flow" for Every topic.
3. Tone: Professional, clear, and safety-oriented. Use "Pilot-in-Command" authority.
`;

export async function generateScenario(topic: string): Promise<Scenario> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    Generate a high-stakes aviation decision-making scenario based on the topic: ${topic}.
    Provide:
    1. A Title.
    2. A technical Description of the situation (e.g., partial engine failure, deteriorating weather).
    3. 4 possible Options the pilot could take.
    4. Each option must have a consequence and a boolean indicating if it's the safest 'correct' choice.
    5. A correctLogic field explaining why the safe choice is correct according to DGCA/ICAO rules.`,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                consequence: { type: Type.STRING },
                isSafe: { type: Type.BOOLEAN }
              },
              required: ["id", "text", "consequence", "isSafe"]
            }
          },
          correctLogic: { type: Type.STRING }
        },
        required: ["title", "description", "options", "correctLogic"]
      }
    },
    model
  );

  return JSON.parse(result.text || "{}");
}

export async function generateSummary(text: string): Promise<Summary> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    Summarize the following aviation/DGCA study material into "The Flight Log" (3-level summary):
    1. Operational Briefing (Big Picture): 1 sentence on the technical operational relevance.
    2. Technical Pillars (Core Pillars): 3-5 critical technical facts.
    3. The Checklist (Cheat Sheet): Key terms/formulas and their definitions.
    
    Text: ${text}`,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bigPicture: { type: Type.STRING },
          corePillars: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cheatSheet: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              },
              required: ["term", "definition"]
            }
          }
        },
        required: ["bigPicture", "corePillars", "cheatSheet"]
      }
    },
    model
  );

  return JSON.parse(result.text || "{}");
}

export async function generateQuiz(text: string): Promise<QuizQuestion[]> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    You are an expert DGCA CPL/ATPL exam coach. Generate exactly 15 high-fidelity technical MCQs strictly based on the following material.
    
    Requirements:
    1. Technical Depth: Questions must capture critical technical nuances (limits, speeds, formulas, rules) mirroring DGCA exam standards.
    2. Count: Provide exactly 15 Multiple Choice Questions (MCQs).
    3. Options: Each question must have exactly 4 options labeled A, B, C, D.
    4. Correct Answer: The "correctAnswer" field should be just the letter: A, B, C, or D.
    
    Text Segment: ${text}`,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["mcq"] },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "type", "question", "options", "correctAnswer", "explanation"]
        }
      }
    },
    model
  );

  return JSON.parse(result.text || "[]");
}

export async function generateBrainHacks(text: string): Promise<BrainHacks> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    For the primary concepts in the following text, provide memory aids suitable for a pilot under high cockpit workload:
    1. The "Lego" Breakdown: Simple step-by-step logic (like a FLOW or CHECKLIST).
    2. A Mnemonic: A catchy acronym (e.g., PAVE, IMSAFE) to remember the concept.
    3. The "ELI5": A simple analogy from everyday life that clarifies the technical aviation concept.
    
    Text: ${text}`,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          legoBreakdown: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          mnemonic: { type: Type.STRING },
          eli5: { type: Type.STRING }
        },
        required: ["legoBreakdown", "mnemonic", "eli5"]
      }
    },
    model
  );

  return JSON.parse(result.text || "{}");
}
