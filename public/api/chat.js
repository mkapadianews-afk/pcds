// api/chat.js — Vercel (Node) serverless function
// ---------------------------------------------------------------------------
// Proxies the in-app AI assistant to Anthropic, keeping your API key on the
// server (never exposed to the browser). The app calls /api/chat with
// { system, messages } and gets back { text }.
//
// SETUP:
//   1. Get an API key at console.anthropic.com (Settings -> API Keys).
//   2. In Vercel: Project -> Settings -> Environment Variables ->
//      ANTHROPIC_API_KEY = your key.   (optional: ANTHROPIC_MODEL = a model id)
//   3. Redeploy. The "Ask AI" button now works on your live site.
// ---------------------------------------------------------------------------

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
// Always use Haiku (cheap + fast). An ANTHROPIC_MODEL override is only honored if it is
// itself a Haiku model, so the agent can never fall back to Sonnet/Opus by accident.
const ENV_MODEL = process.env.ANTHROPIC_MODEL;
const MODELS =
  ENV_MODEL && ENV_MODEL.toLowerCase().includes("haiku")
    ? [ENV_MODEL]
    : ["claude-haiku-4-5", "claude-3-5-haiku-latest"]; // first the account has wins

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  if (!ANTHROPIC_KEY) { res.status(500).json({ error: "Missing ANTHROPIC_API_KEY" }); return; }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages)) { res.status(400).json({ error: "messages[] required" }); return; }

  let lastErr = "request failed";
  for (const model of MODELS) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model, max_tokens: 600, system, messages }),
      });
      const data = await r.json();
      if (!r.ok) { lastErr = (data && data.error && data.error.message) || ("status " + r.status); continue; }
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      if (text) { res.status(200).json({ text, model }); return; }
      lastErr = "empty response";
    } catch (e) {
      lastErr = String(e);
    }
  }
  res.status(502).json({ error: lastErr });
}
