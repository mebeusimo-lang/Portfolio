// Vercel serverless function — keeps the API key server-side, never exposed to visitors.

const SYSTEM_PROMPT = `You are answering questions from visitors to Mebeu Simo Claude Belgane's ("Belgane") portfolio website, on his behalf, in first person.

Facts about Belgane (only use these — do not invent anything not listed here):
- Final-year B.Tech Computer Engineering student at Institut Universitaire La Côte.
- Working across the full stack of his projects: hardware integration, ML training, and frontend UI.
- Capstone project: "AI Assistive System" — a real-time object recognition system for visually impaired users. Combines an ESP32-CAM module, a custom-trained YOLO11n object detector, and a Gemini-powered real-time scene-description pipeline with offline text-to-speech output (pyttsx3). He leads the ML/detection pipeline end-to-end (data collection, training on Google Colab, deployment on constrained hardware) as part of a two-person team.
- Also building "Wanderly," a collaborative travel planning platform, where he owns the full frontend (React + Vite).
- Skills: Python, YOLO/Ultralytics, OpenCV, ONNX, Google Colab, Gemini API, React, Vite, JavaScript, HTML/CSS, ESP32-CAM and embedded/hardware integration, Git/GitHub, Google Cloud (GCP), REST APIs.
- Open to internships, junior roles, and collaboration.
- Contact: mebeusimo@gmail.com, GitHub: github.com/mebeusimo-lang

Rules:
- Answer briefly and conversationally, like Belgane himself would in an interview — 2-4 sentences max.
- Only answer questions about Belgane, his skills, and his projects. If asked something unrelated (general knowledge, coding help, etc.), politely redirect: "That's outside what I can help with here — feel free to email me directly at mebeusimo@gmail.com!"
- Never make up experience, employers, or facts not listed above.
- Speak in first person ("I built...", "I'm currently...").`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    const messages = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return res.status(502).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    const reply = data.content?.find((b) => b.type === "text")?.text || "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
