// api/create-checkout-session.js — Vercel (Node) serverless function
// ---------------------------------------------------------------------------
// Creates a Stripe EMBEDDED Checkout session for a subscription tier and
// returns its client_secret + your publishable key, so the card form mounts
// right inside the site's Plans popup. Your SECRET key stays here on the
// server and is never exposed to the browser.
//
// EASIEST SETUP — just TWO environment variables, no code edits, no creating
// products in Stripe (the plans are built on the fly):
//   In Vercel -> Project -> Settings -> Environment Variables, add:
//     STRIPE_SECRET_KEY        = your SECRET key      (sk_live_... / sk_test_...)
//     STRIPE_PUBLISHABLE_KEY   = your PUBLISHABLE key  (pk_live_... / pk_test_...)
//   Then redeploy. That's it — the "Get <tier>" buttons now take real payments.
//
// (Optional) Override the prices without touching code by also setting
//   PRICE_PLUS, PRICE_PRO, PRICE_MAX  to dollar amounts (e.g. 2, 5, 8).
// ---------------------------------------------------------------------------

const SECRET = process.env.STRIPE_SECRET_KEY;
const PUBLISHABLE = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_API = "https://api.stripe.com/v1";

// tier -> { name, dollars }. Dollar amounts can be overridden via env vars.
const TIERS = {
  plus: { name: "FORGEAPC Plus", dollars: Number(process.env.PRICE_PLUS) || 2 },
  pro:  { name: "FORGEAPC Pro",  dollars: Number(process.env.PRICE_PRO)  || 5 },
  max:  { name: "FORGEAPC Max",  dollars: Number(process.env.PRICE_MAX)  || 8 },
};

async function stripeFetch(path, { method = "GET", form } = {}) {
  const opts = {
    method,
    headers: {
      Authorization: "Bearer " + SECRET,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  if (form) opts.body = new URLSearchParams(form).toString();
  const r = await fetch(STRIPE_API + path, opts);
  const data = await r.json();
  if (!r.ok) throw new Error((data && data.error && data.error.message) || ("Stripe " + r.status));
  return data;
}

export default async function handler(req, res) {
  if (!SECRET || !PUBLISHABLE) {
    res.status(500).json({ error: "Payments aren't connected yet. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in Vercel." });
    return;
  }

  try {
    // --- status check (after the customer returns from checkout) ---
    if (req.method === "GET") {
      const sessionId = req.query && req.query.session_id;
      if (!sessionId) { res.status(400).json({ error: "session_id required" }); return; }
      const s = await stripeFetch("/checkout/sessions/" + encodeURIComponent(sessionId));
      res.status(200).json({ status: s.status, payment_status: s.payment_status });
      return;
    }

    // --- create an embedded subscription checkout session ---
    if (req.method === "POST") {
      const body = req.body || {};
      const tier = TIERS[body.tier];
      if (!tier) { res.status(400).json({ error: "Unknown plan." }); return; }

      const origin = req.headers.origin || ("https://" + (req.headers.host || "forgeapc.xyz"));
      const form = {
        ui_mode: "embedded_page",
        mode: "subscription",
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][unit_amount]": String(Math.round(tier.dollars * 100)),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][product_data][name]": tier.name,
        return_url: origin + "/?checkout=return&session_id={CHECKOUT_SESSION_ID}",
        allow_promotion_codes: "true",
      };
      if (body.email) form.customer_email = body.email;

      const session = await stripeFetch("/checkout/sessions", { method: "POST", form });
      res.status(200).json({ clientSecret: session.client_secret, publishableKey: PUBLISHABLE });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || "Checkout failed" });
  }
}
