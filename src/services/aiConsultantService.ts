import callAiProxy from "./aiProxy";

const model = "gemini-1.5-flash";

export interface SubjectChapter {
  subject: string;
  chapterTitle: string;
  book: string;
  description: string;
}

export async function getChapterBrief(chapter: SubjectChapter): Promise<string> {
  const prompt = `
    You are an AirclassPRO DGCA Technical Instructor. 
    Provide a professional, technical brief for this topic, strictly following the DGCA India CPL/ATPL syllabus.

    Subject: ${chapter.subject}
    Topic: ${chapter.chapterTitle}
    Context: ${chapter.description}

    Constraints:
    1. DO NOT use raw LaTeX or dollar signs ($). Use clean UTF-8 symbols (e.g., Δ,°, λ, φ).
    2. Focus on "Need to Know" exam points from the AirclassPRO exam preparation material.
    3. Use technical terminology relevant to Indian pilots (e.g., "Monsoon", "Western Disturbances", "CAR", "AIP India").
    4. Provide 3-5 high-impact bullet points and a simple explanation.
    5. Be precise and avoid vague descriptions. Tell the user what the core concept is.

    Output format: Clean Markdown without raw block characters.
  `.trim();

  try {
    const result = await callAiProxy(prompt, undefined, model);
    return result.text || "I'm sorry, I couldn't generate a brief for this chapter.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI consultant is currently offline. Please try again later.";
  }
}

export async function generateAIFlashcards(subject: string, topic: string): Promise<any> {
    const prompt = `
      You are an expert DGCA aviation exam coach. Generate exactly 15 flashcards for the topic: "${topic}" within ${subject}.
  
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
      - DGCA exam difficulty level
    `.trim();
  
    try {
      const result = await callAiProxy(prompt, { responseMimeType: "application/json" }, model);
      const text = result.text || '{"flashcards": []}';
      return JSON.parse(text.replace(/```json|```/g, ""));
    } catch (error) {
      console.error("Flashcard Gen Error:", error);
      return { topic, flashcards: [] };
    }
  }

export async function generateAIQuestions(subject: string, topic: string): Promise<any> {
    const prompt = `
      You are an expert DGCA CPL/ATPL exam coach. Generate exactly 15 technical multiple-choice questions for the topic: "${topic}" within ${subject}.
  
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
      - The "correct" field must be just the letter: A, B, C, or D
    `.trim();
  
    try {
      const result = await callAiProxy(prompt, { responseMimeType: "application/json" }, model);
      const text = result.text || '{"questions": []}';
      return JSON.parse(text.replace(/```json|```/g, ""));
    } catch (error) {
      console.error("Question Gen Error:", error);
      return { topic, questions: [] };
    }
  }

export async function getWeatherBrief(icao: string, metar: string, taf: string | null): Promise<string> {
  const prompt = `
    You are an AirclassPRO DGCA Meteorology Instructor and a professional AI Weather Consultant.
    Provide a professional, technical operational briefing for the following weather data at ${icao.toUpperCase()}.

    METAR: ${metar}
    TAF: ${taf || 'Not available'}

    Syllabus Context: DGCA India / ATPL Meteorology Standard.
    
    Structure your briefing into these 4 concise sections:
    1. **Operational Summary**: (e.g. VFR/IFR, Cloud Base/Visibility status)
    2. **Technical Details**: (Explain wind velocity, pressure settings QNH, and temperature/dew point spread risk like fog/icing)
    3. **Significant Trends**: (Briefly highlight changes from TAF such as TEMPO, BECMG or FM groups)
    4. **Flight Planning Advice**: (Concrete safety advice for a pilot regarding fuel, crosswind limits, or alternate planning)

    Constraints:
    1. Use technical terminology (e.g., "CAVOK", "NOSIG", "TEMPO", "Gust Factor").
    2. Be precise and avoid vague descriptions.
    3. Keep the tone professional, authoritative, and helpful.
    4. Use Markdown for layout.

    Output format: Clean Markdown without raw block characters.
  `.trim();

  try {
    const result = await callAiProxy(prompt, undefined, model);
    return result.text || "I'm sorry, I couldn't generate a weather brief at this moment.";
  } catch (error) {
    console.error("Gemini Weather Error:", error);
    return "The AI weather consultant is currently processing satellite data. Please retry after a short delay.";
  }
}

export async function getWeatherResponse(question: string, context: { icao: string, metar: string, taf: string | null }): Promise<string> {
  const prompt = `
    You are a professional AI Aviation Weather Consultant for ${context.icao.toUpperCase()}.
    A pilot is asking you a question. Answer it based on the following real-time data:
    
    METAR: ${context.metar}
    TAF: ${context.taf || 'N/A'}
    
    Question: "${question}"
    
    Guidelines:
    1. Be precise, technical yet clear.
    2. Use AirclassPRO / DGCA standards.
    3. If the pilot asks about safety (e.g. VFR/IFR), provide a definitive professional opinion based on minima (e.g. 5km/1500ft for VFR).
    4. If the question involves calculations (like crosswind), perform them accurately.
    5. Show warnings in bold if conditions are deteriorating.
    
    Output in Markdown.
  `.trim();

  try {
    const result = await callAiProxy(prompt, undefined, model);
    return result.text || "I was unable to analyze your request. Please try rephrasing.";
  } catch (error) {
    console.error("Gemini Q&A Error:", error);
    return "Weather Intelligence Link interrupted. Please standby.";
  }
}

export async function decodeWeather(icao: string, metar: string, taf: string | null): Promise<string> {
  const prompt = `
    Decode the following aviation weather data for ${icao.toUpperCase()} into a clear, user-friendly bulleted summary for a pilot.
    
    METAR: ${metar}
    TAF: ${taf || 'N/A'}

    Focus on decoding code segments (e.g., '28010KT' -> 'West at 10 knots').
    Output EXACTLY these bullet points in Markdown:
    - **Wind**: (decoded wind info)
    - **Visibility**: (decoded visibility)
    - **Clouds**: (decoded cloud layers)
    - **Significant Weather**: (decoded weather phenomena)
    - **Pressure (QNH)**: (decoded Altimeter)
    - **Temp/DP**: (decoded temperature and dewpoint)
    - **Operational Outlook**: (brief summary of trends from TAF)
  `.trim();

  try {
    const result = await callAiProxy(prompt, undefined, model);
    return result.text || "Unable to decode weather strings.";
  } catch (error) {
    console.error("Gemini Decode Error:", error);
    return "Weather decoding system offline. Reference AirclassPRO materials for manual decoding.";
  }
}

export async function getAIInstructorBriefing(icao: string, metar: string, taf: string | null): Promise<string> {
  const prompt = `
    Analyze this raw METAR string for ${icao.toUpperCase()} and provide a exactly 3-sentence briefing for a pilot.
    
    METAR: ${metar}
    TAF: ${taf || 'Not available'}

    Task:
    1. Sentence 1: Explain the wind and visibility in plain English.
    2. Sentence 2: Call out any specific hazards (like TS, FG, or low ceilings).
    3. Sentence 3: Give a final Go/No-Go recommendation based on the conditions.
    
    Format: Use clear Markdown. Focus on being extremely concise and professional.
  `.trim();

  try {
    const result = await callAiProxy(prompt, undefined, model);
    return result.text || "I'm sorry, I couldn't generate a briefing right now.";
  } catch (error) {
    console.error("Instructor Briefing Error:", error);
    return "The instructor is currently checked out. Please try again in a moment.";
  }
}
