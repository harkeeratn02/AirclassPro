import { Summary, QuizQuestion, BrainHacks, Scenario } from "../types";
import callAiProxy from "./aiProxy";

const model = "claude-3-haiku-20240307";

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
    
    Return ONLY valid JSON in this format:
    {
      "title": "Scenario Title",
      "description": "Technical description of the situation",
      "options": [
        { "id": "1", "text": "Option 1", "consequence": "Result of choosing this", "isSafe": false },
        ... exactly 4 options
      ],
      "correctLogic": "Detailed explanation of why the safe choice is correct according to DGCA/ICAO rules"
    }
    
    Ensure exactly 4 options are provided. One must be safe (isSafe: true), others unsafe.`,
    {
      maxOutputTokens: 2000
    },
    model
  );

  const text = result.text || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function generateSummary(text: string): Promise<Summary> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    Summarize the following aviation/DGCA study material into "The Flight Log" (3-level summary).
    
    Return ONLY valid JSON in this format:
    {
      "bigPicture": "1 sentence on the technical operational relevance",
      "corePillars": ["Fact 1", "Fact 2", "Fact 3"],
      "cheatSheet": [
        { "term": "Term 1", "definition": "Definition 1" }
      ]
    }
    
    Text: ${text}`,
    {
      maxOutputTokens: 2000
    },
    model
  );

  const cleanText = result.text || "{}";
  return JSON.parse(cleanText.replace(/```json|```/g, "").trim());
}

export async function generateQuiz(text: string): Promise<QuizQuestion[]> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    You are an expert DGCA CPL/ATPL exam coach. Generate exactly 15 high-fidelity technical MCQs strictly based on the following material.
    
    Return ONLY valid JSON in this exact format (an array of objects):
    [
      {
        "id": "1",
        "type": "mcq",
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "A",
        "explanation": "Why A is correct"
      }
    ]
    
    Text Segment: ${text}`,
    {
      maxOutputTokens: 4000
    },
    model
  );

  const cleanText = result.text || "[]";
  return JSON.parse(cleanText.replace(/```json|```/g, "").trim());
}

export async function generateBrainHacks(text: string): Promise<BrainHacks> {
  const result = await callAiProxy(
    `${AVIATION_CONTEXT}
    For the primary concepts in the following text, provide memory aids suitable for a pilot under high cockpit workload.
    
    Return ONLY valid JSON in this format:
    {
      "legoBreakdown": ["Step 1", "Step 2", "Step 3"],
      "mnemonic": " Catchy acronym (e.g., PAVE)",
      "eli5": "Simple everyday analogy"
    }
    
    Text: ${text}`,
    {
      maxOutputTokens: 2000
    },
    model
  );

  const cleanText = result.text || "{}";
  return JSON.parse(cleanText.replace(/```json|```/g, "").trim());
}
