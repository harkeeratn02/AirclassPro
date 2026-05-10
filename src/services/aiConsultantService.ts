import callAiProxy from "./aiProxy";

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
    const response = await callAiProxy(prompt);
    return response.text || "I'm sorry, I couldn't generate a brief for this chapter.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI consultant is currently offline. Please try again later.";
  }
}

export async function generateAIFlashcards(subject: string, topic: string): Promise<{ front: string, back: string }[]> {
  const prompt = `
    Generate 5 high-quality flashcards for the following aviation topic.
    Subject: ${subject}
    Topic: ${topic}

    Strictly use AirclassPRO DGCA Exam Preparation standards.
    Format your response AS A VALID JSON ARRAY of objects. 
    Each object must have "front" (question/term) and "back" (answer/definition) keys.
    Do NOT include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON.
  `.trim();

  try {
    const response = await callAiProxy(prompt);
    const text = response.text || "[]";
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Flashcard Gen Error:", error);
    return [];
  }
}

export async function generateAIQuestions(subject: string, topic: string): Promise<any[]> {
  const prompt = `
    Generate a set of 10 high-fidelity DGCA level Multiple Choice Questions (MCQs) strictly based on the technical subject matter of the following topic.
    
    Subject: ${subject}
    Topic: ${topic}

    CRITICAL REQUIREMENTS:
    1. DGCA Level Accuracy: Questions must mirror the complexity, wording, and technical depth found in actual DGCA Pilot exams for CPL/ATPL in India.
    2. Exam Standards: At least 60% of these should be based on actual examination patterns relevant to Air Navigation, Met, etc.
    3. Technical Standards: Use AirclassPRO standards for all navigation, meteorology, and technical data.
    4. Operational Context: Include scenario-based questions where a pilot must apply the knowledge.
    5. No Overlap: Ensure all 10 questions are distinct.

    SCHEMA:
    Response must be a VALID JSON ARRAY of objects.
    Each object: { "question": string, "options": [4 strings], "correct": string (exact match from options), "explanation": string (technical breakdown) }

    Do NOT include markdown block markers or conversational text. Just the raw JSON array.
  `.trim();

  try {
    const response = await callAiProxy(prompt);
    const text = response.text || "[]";
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Question Gen Error:", error);
    return [];
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
    const response = await callAiProxy(prompt);
    return response.text || "I'm sorry, I couldn't generate a weather brief at this moment.";
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
    const response = await callAiProxy(prompt);
    return response.text || "I was unable to analyze your request. Please try rephrasing.";
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
    const response = await callAiProxy(prompt);
    return response.text || "Unable to decode weather strings.";
  } catch (error) {
    console.error("Gemini Decode Error:", error);
    return "Weather decoding system offline. Reference AirclassPRO materials for manual decoding.";
  }
}
