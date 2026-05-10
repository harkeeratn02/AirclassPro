
async function callAiProxy(contents: any, config?: any, model: string = "gemini-3-flash-preview") {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      contents,
      config,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "AI request failed");
  }

  const data = await response.json();
  return { text: data.text };
}

export default callAiProxy;
