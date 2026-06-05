// api/prices.js — Vercel (Node) serverless function
// ---------------------------------------------------------------------------
// Returns { updatedAt, prices: { <partId>: { bestbuy, amazon, newegg }, ... } }
// The app reduces each part to its LOWEST available price automatically.
//
// Sources:
//   • Best Buy   — official free API (live), needs BESTBUY_API_KEY
//   • Amazon     — Apify actor dataset (scraped on a 15-day Apify schedule)
//   • Newegg     — Apify actor dataset (scraped on a 15-day Apify schedule)
//
// Reading Apify datasets is a cheap, instant API call — the slow scraping runs
// on Apify's own 15-day schedule (set up in the Apify console, see README).
//
// ENV VARS (Vercel -> Settings -> Environment Variables):
//   BESTBUY_API_KEY   your Best Buy developer key
//   APIFY_TOKEN       your Apify API token (Apify console -> Settings -> Integrations)
//   AMAZON_ACTOR_ID   e.g. "junglee~amazon-product-scraper"
//   NEWEGG_ACTOR_ID   e.g. "kawsar~newegg-product-scraper"
// Any source whose env vars are missing is simply skipped.
// ---------------------------------------------------------------------------

import { PART_QUERIES } from "../data/part-queries.js";

const BESTBUY_KEY = process.env.BESTBUY_API_KEY;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const AMAZON_ACTOR = process.env.AMAZON_ACTOR_ID;
const NEWEGG_ACTOR = process.env.NEWEGG_ACTOR_ID;

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Reject implausibly-low prices (wrong/accessory listings, e.g. a $10 "motherboard").
const FLOORS = { cpu: 40, gpu: 80, mobo: 50, ram: 20, storage: 25, psu: 25, case: 30, cooler: 10 };
function floorFor(id) {
  if (id.startsWith("cpu")) return FLOORS.cpu;
  if (id.startsWith("gpu")) return FLOORS.gpu;
  if (id.startsWith("mb")) return FLOORS.mobo;
  if (id.startsWith("ram")) return FLOORS.ram;
  if (id.startsWith("ssd")) return FLOORS.storage;
  if (id.startsWith("psu")) return FLOORS.psu;
  if (id.startsWith("cs")) return FLOORS.case;
  if (id.startsWith("cl")) return FLOORS.cooler;
  return 0;
}

// ---------------- Best Buy (live official API) ----------------
async function bestBuyPrices() {
  const out = {};
  if (!BESTBUY_KEY) return out;
  for (const [id, { q, sku }] of Object.entries(PART_QUERIES)) {
    try {
      const url = sku
        ? `https://api.bestbuy.com/v1/products(sku=${encodeURIComponent(sku)})?apiKey=${BESTBUY_KEY}&format=json&show=salePrice`
        : `https://api.bestbuy.com/v1/products((search=${encodeURIComponent(q)}))?apiKey=${BESTBUY_KEY}&format=json&sort=salePrice.asc&pageSize=1&show=salePrice`;
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        const p = d.products && d.products[0];
        if (p && typeof p.salePrice === "number" && p.salePrice >= floorFor(id)) out[id] = p.salePrice;
      }
      await new Promise((res) => setTimeout(res, 220));
    } catch (e) {}
  }
  return out;
}

// ---------------- Apify dataset (latest scheduled run) ----------------
// Reads the most recent SUCCEEDED run's dataset for an actor and maps each
// scraped item back to a part by matching the search query / product title.
async function apifyPrices(actorId) {
  const out = {};
  const media = {};
  if (!APIFY_TOKEN || !actorId) return { out, media };
  try {
    const r = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs/last/dataset/items?token=${APIFY_TOKEN}&status=SUCCEEDED&clean=true&limit=5000`
    );
    if (!r.ok) return { out, media };
    const items = await r.json();

    // build lookups: exact ASIN match first (most reliable), then query, then title
    const byAsin = {};
    const byQuery = {};
    for (const [id, info] of Object.entries(PART_QUERIES)) {
      if (info.asin) byAsin[String(info.asin).toUpperCase()] = id;
      byQuery[norm(info.q)] = id;
    }

    // accessory keywords — reject mounting kits, brackets, "for X" listings, etc.
    const ACCESSORY = /\b(mounting\s*kit|bracket|adapter|adaptor|replacement|retention|backplate|stand(off)?|screw|cable|extension|sleeve|anti[-\s]?sag|riser|spare|for\s+)\b/i;

    for (const it of items) {
      // NOTE: field names vary by actor — adjust to match your chosen actor's output.
      const title = it.title || it.name || it.productTitle || "";
      const asin = (it.asin || it.ASIN || "").toString().toUpperCase();
      const query = it.searchQuery || it.keyword || it.query || it.input || "";
      let price = it.price ?? it.salePrice ?? it.finalPrice ?? it.currentPrice;
      if (price && typeof price === "object") price = price.value ?? price.amount; // some actors nest price
      if (typeof price === "string") price = parseFloat(price.replace(/[^0-9.]/g, ""));
      if (typeof price !== "number" || !(price > 0)) continue;

      // resolve which part this item is — EXACT ASIN ONLY (no fuzzy/used/wrong fallback)
      const id = (asin && byAsin[asin]) || null;
      if (!id) continue;
      if (price < floorFor(id)) continue; // drop junk/accessory mis-prices

      if (out[id] == null || price < out[id]) out[id] = price;
      // capture product image + link (first decent one wins)
      const thumb = it.thumbnailImage || it.image || it.img || (Array.isArray(it.images) ? it.images[0] : "");
      const link = it.url || (asin ? `https://www.amazon.com/dp/${asin}` : "");
      if (!media[id] && (thumb || link)) media[id] = { img: thumb || "", url: link || "" };
    }
  } catch (e) {}
  return { out, media };
}

export default async function handler(req, res) {
  const prices = {};
  const add = (id, source, val) => {
    if (typeof val === "number" && val > 0) (prices[id] = prices[id] || {})[source] = val;
  };

  const [bb, amz, neg] = await Promise.all([
    bestBuyPrices(),
    apifyPrices(AMAZON_ACTOR),
    apifyPrices(NEWEGG_ACTOR),
  ]);

  for (const [id, v] of Object.entries(bb)) add(id, "bestbuy", v);
  for (const [id, v] of Object.entries(amz.out)) add(id, "amazon", v);
  for (const [id, v] of Object.entries(neg.out)) add(id, "newegg", v);

  const media = { ...neg.media, ...amz.media }; // Amazon images preferred

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=43200");
  res.status(200).json({ updatedAt: new Date().toISOString(), prices, media });
}
