import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Anthropic } from "@anthropic-ai/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Anthropic
let anthropic: Anthropic | null = null;

function getAnthropic() {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    console.log("[AI] Initializing Anthropic SDK...");
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initial check
  getAnthropic();

  // CORS
  app.use(cors());

  // JSON parsing
  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      anthropicConfigured: !!process.env.ANTHROPIC_API_KEY
    });
  });

  const AIRPORT_COORDS: Record<string, { lat: number; lon: number }> = {
  "VABB": { lat: 19.0887, lon: 72.8679 },
  "VIDP": { lat: 28.5665, lon: 77.1031 },
  "VCBI": { lat: 7.1812, lon: 79.8837 },
  "RPLL": { lat: 14.5083, lon: 121.0194 },
  "FAOR": { lat: -26.1367, lon: 28.2411 },
  "OMDB": { lat: 25.2532, lon: 55.3657 },
  "VOBL": { lat: 13.1986, lon: 77.7066 },
  "VOMM": { lat: 12.9941, lon: 80.1709 },
  "FACT": { lat: -33.9715, lon: 18.6021 },
  "VRMM": { lat: 4.1918, lon: 73.5291 },
  "WIII": { lat: -6.1256, lon: 106.6559 }
};

async function fetchOpenMeteo(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error("Open-Meteo fetch failed:", e);
  }
  return null;
}

// API Route for METAR (Server-side fetch to bypass CORS)
app.get("/api/metar", async (req, res) => {
  const icao = String(req.query.icao || "").toUpperCase().trim();
  if (!icao) {
    return res.status(400).json({ error: "ICAO code is required" });
  }

  const url = `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return res.json(data);
      } else {
        return res.status(404).json({ error: "No METAR data found for this ICAO." });
      }
    }
    res.status(response.status).json({ error: "Failed to fetch METAR from Aviation Weather Center" });
  } catch (error: any) {
    console.error("METAR Proxy Error:", error);
    res.status(500).json({ error: "Internal server error during weather fetch" });
  }
});

  // TAF Proxy
  app.get("/api/taf", async (req, res) => {
    const icao = req.query.icao;
    if (!icao) {
      return res.status(400).json({ error: "ICAO code is required" });
    }

    const url = `https://aviationweather.gov/api/data/taf?ids=${icao}&format=json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
      res.status(response.status).json({ error: "Failed to fetch TAF" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Endpoint
  app.post("/api/ai", async (req, res) => {
    console.log(`[AI] Request received: ${req.method} ${req.url}`);
    try {
      const { model: modelId, contents, config } = req.body;
      const prompt = typeof contents === 'string' ? contents : JSON.stringify(contents);
      
      console.log(`[AI] Payload - Model: ${modelId || "default"}, Prompt Length: ${prompt.length}`);
      
      const client = getAnthropic();
      if (!process.env.ANTHROPIC_API_KEY || !client) {
        console.error("[CRITICAL] ANTHROPIC_API_KEY is not set in environment variables");
        return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured on server" });
      }

      console.log(`[AI] Calling Anthropic API...`);
      
      // Basic implementation for Claude 3
      const msg = await client.messages.create({
        model: modelId || "claude-3-haiku-20240307",
        max_tokens: config?.maxOutputTokens || 4096,
        messages: [{ role: "user", content: prompt }],
        system: "You are an expert aviation instructor. Return only the requested data format (e.g., JSON) without preamble if JSON is requested."
      });

      const text = msg.content[0].type === 'text' ? msg.content[0].text : "";

      console.log(`[AI] Anthropic success. Response length: ${text.length}`);
      res.json({ text });
    } catch (error: any) {
      console.error("[AI] Error during generation:", error);
      if (error.stack) console.error(error.stack);
      res.status(500).json({ 
        error: error.message || "AI generation failed",
        details: error.toString()
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log(`[Server] Production mode: serving static files from ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
