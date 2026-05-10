async function callAiProxy(contents: any, config?: any, model: string = "gemini-3-flash-preview") {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const apiUrl = `${baseUrl}/api/ai`;
  console.log(`[AI Proxy] Calling: ${apiUrl}`);
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      config,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "AI proxy request failed");
  }

  return await response.json();
}

export default callAiProxy;
