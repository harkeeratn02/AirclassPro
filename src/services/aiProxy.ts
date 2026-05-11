async function callAiProxy(contents: any, config?: any, model: string = "claude-3-haiku-20240307") {
  const apiUrl = `/api/ai`;
  
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
