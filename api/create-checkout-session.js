// api/create-checkout-session.js — Vercel (Node) serverless function
// ---------------------------------------------------------------------------
// Creates a Stripe SUBSCRIPTION and returns a PaymentIntent client_secret so a
// native, dark, on-brand Payment Element can mount right inside the Plans popup
// (not a "page in a page"). Your SECRET key stays on the server.
//
// EASIEST SETUP — just TWO environment variables in Vercel, no code edits and
// no creating products in Stripe (a reusable price is made automatically the
// first time, then reused via a lookup_key):
//     STRIPE_SECRET_KEY        = sk_live_... / sk_test_...
//     STRIPE_PUBLISHABLE_KEY   = pk_live_... / pk_test_...
// Then redeploy.
//
// (Optional) Override amounts with PRICE_PLUS / PRICE_PRO / PRICE_MAX (dollars).
// ---------------------------------------------------------------------------

const SECRET = process.env.STRIPE_SECRET_KEY;
const PUBLISHABLE = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_API = "https://api.stripe.com/v1";

const TIERS = {
  plus: { name: "FORGEAPC Plus", dollars: Number(process.env.PRICE_PLUS) || 2, key: "forgeapc_plus" },
  pro:  { name: "FORGEAPC Pro",  dollars: Number(process.env.PRICE_PRO)  || 5, key: "forgeapc_pro" },
  max:  { name: "FORGEAPC Max",  dollars: Number(process.env.PRICE_MAX)  || 8, key: "forgeapc_max" },
};

async function stripeFetch(path, { method = "GET", form } = {}) {
  const opts = { method, headers: { Authorization: "Bearer " + SECRET, "Content-Type": "application/x-www-form-urlencoded" } };
  if (form) opts.body = new URLSearchParams(form).toString();
  const r = await fetch(STRIPE_API + path, opts);
  const data = await r.json();
  if (!r.ok) throw new Error((data && data.error && data.error.message) || ("Stripe " + r.status));
  return data;
}

// Find an existing monthly price by lookup_key, or create the product + price once.
async function getOrCreatePrice(tier) {
  const found = await stripeFetch("/prices?lookup_keys[]=" + encodeURIComponent(tier.key) + "&active=true&limit=1");
  if (found.data && found.data.length && found.data[0].unit_amount === Math.round(tier.dollars * 100)) return found.data[0].id;
  const product = await stripeFetch("/products", { method: "POST", form: { name: tier.name } });
  const price = await stripeFetch("/prices", { method: "POST", form: {
    unit_amount: String(Math.round(tier.dollars * 100)),
    currency: "usd",
    "recurring[interval]": "month",
    product: product.id,
    lookup_key: tier.key,
    transfer_lookup_key: "true",
  } });
  return price.id;
}

export default async function handler(req, res) {
  if (!SECRET || !PUBLISHABLE) {
    res.status(500).json({ error: "Payments aren't connected yet. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in Vercel." });
    return;
  }
  try {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
    const body = req.body || {};
    const tier = TIERS[body.tier];
    if (!tier) { res.status(400).json({ error: "Unknown plan." }); return; }

    const priceId = await getOrCreatePrice(tier);

    const custForm = {};
    if (body.email) custForm.email = body.email;
    if (body.name) custForm.name = body.name;
    const customer = await stripeFetch("/customers", { method: "POST", form: custForm });

    const sub = await stripeFetch("/subscriptions", { method: "POST", form: {
      customer: customer.id,
      "items[0][price]": priceId,
      payment_behavior: "default_incomplete",
      "payment_settings[save_default_payment_method]": "on_subscription",
      "expand[]": "latest_invoice.payment_intent",
    } });

    const pi = sub.latest_invoice && sub.latest_invoice.payment_intent;
    if (!pi || !pi.client_secret) throw new Error("Could not initialize payment.");

    res.status(200).json({ clientSecret: pi.client_secret, publishableKey: PUBLISHABLE, subscriptionId: sub.id });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || "Checkout failed" });
  }
}
