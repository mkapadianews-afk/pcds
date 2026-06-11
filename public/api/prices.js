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
//   APIFY_TOKEN          your Apify API token (Apify console -> Settings -> Integrations)
//   AMAZON_APIFY_TOKEN   (optional) separate token for the Amazon actor's account
//   NEWEGG_APIFY_TOKEN   (optional) separate token for the Newegg actor's account
//   AMAZON_ACTOR_ID   e.g. "junglee~amazon-product-scraper"
//   NEWEGG_ACTOR_ID   e.g. "kawsar~newegg-product-scraper"
// Any source whose env vars are missing is simply skipped.
// ---------------------------------------------------------------------------

import { PART_QUERIES } from "../data/part-queries.js";

const BESTBUY_KEY = process.env.BESTBUY_API_KEY;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
// Optional per-store tokens (e.g. two different Apify accounts). Fall back to APIFY_TOKEN.
const AMAZON_TOKEN = process.env.AMAZON_APIFY_TOKEN || process.env.APIFY_TOKEN;
const NEWEGG_TOKEN = process.env.NEWEGG_APIFY_TOKEN || process.env.APIFY_TOKEN;
const AMAZON_ACTOR = process.env.AMAZON_ACTOR_ID;
const NEWEGG_ACTOR = process.env.NEWEGG_ACTOR_ID;

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Normalize a Newegg product URL to a stable key (item code if present, else path).
function neggKey(u) {
  if (!u) return "";
  const s = String(u).toLowerCase();
  const m = s.match(/\/p\/([a-z0-9][a-z0-9-]*)/) || s.match(/item=([a-z0-9][a-z0-9-]*)/);
  if (m) return m[1];
  return s.split("?")[0].replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

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

// Robustly pull a positive number out of varied shapes: 12.3, "$12.30",
// {value:12.3}, {current:...}, {amount:...} — actors differ a lot here.
function num(v) {
  if (typeof v === "number") return v > 0 ? v : null;
  if (typeof v === "string") { const n = parseFloat(v.replace(/[^0-9.]/g, "")); return n > 0 ? n : null; }
  if (v && typeof v === "object")
    return num(v.value ?? v.amount ?? v.current ?? v.price ?? v.final ?? v.now ?? v.min);
  return null;
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
async function apifyPrices(actorId, { allowQueryMatch = false, token } = {}) {
  const out = {};
  const media = {};
  const dbg = { configured: !!(token && actorId), hasToken: !!token, actorId: actorId || null, httpStatus: null, itemsRead: 0, matched: 0, sampleKeys: null, sampleTitle: null, sampleUrl: null, samplePriceRaw: null };
  if (!token || !actorId) return { out, media, dbg };
  try {
    // Works whether the ID is an ACTOR id or a TASK id: try actor runs first,
    // then fall back to task runs. A scheduled task run also counts as an actor run.
    const q = `runs/last/dataset/items?token=${token}&status=SUCCEEDED&clean=true&limit=5000`;
    let r = await fetch(`https://api.apify.com/v2/acts/${actorId}/${q}`);
    if (!r.ok) r = await fetch(`https://api.apify.com/v2/actor-tasks/${actorId}/${q}`);
    dbg.httpStatus = r.status;
    if (!r.ok) return { out, media, dbg };
    const items = await r.json();
    dbg.itemsRead = Array.isArray(items) ? items.length : 0;
    if (items[0]) {
      const f = items[0];
      dbg.sampleKeys = Object.keys(f);
      dbg.sampleTitle = (f.title || f.name || f.productName || f.productTitle || "").toString().slice(0, 80);
      dbg.sampleUrl = f.url || f.link || f.productUrl || f.itemUrl || f.href || f.pageUrl || null;
      dbg.samplePriceRaw = f.price ?? f.salePrice ?? f.finalPrice ?? f.currentPrice ?? f.pricing ?? f.prices ?? null;
    }

    // build lookups: exact ASIN match first (most reliable), then query, then title
    const byAsin = {};
    const byQuery = {};
    const byUrl = {}; // Newegg: match by exact product URL / item code
    for (const [id, info] of Object.entries(PART_QUERIES)) {
      if (info.asin) byAsin[String(info.asin).toUpperCase()] = id;
      if (info.negUrl) byUrl[neggKey(info.negUrl)] = id;
      byQuery[norm(info.q)] = id;
    }

    // accessory keywords — reject mounting kits, brackets, "for X" listings, etc.
    const ACCESSORY = /\b(mounting\s*kit|bracket|adapter|adaptor|replacement|retention|backplate|stand(off)?|screw|cable|extension|sleeve|anti[-\s]?sag|riser|spare|for\s+)\b/i;
    // used/refurbished — Newegg glues these onto the next word ("RefurbishedAMD",
    // "Used - Like NewAMD"), so match as substrings (no word boundary).
    const USED = /(renewed|refurbished|recertified|open[-\s]*box|pre[-\s]*owned|preowned)/i;
    const USED_WORD = /\bused\b/i;

    for (const it of items) {
      // NOTE: field names vary by actor — adjust to match your chosen actor's output.
      const title = it.title || it.name || it.productTitle || it.productName || it.product_title || "";
      if (USED.test(title) || USED_WORD.test(title) || USED.test(it.brand || "")) continue; // never show used/refurbished
      const asin = (it.asin || it.ASIN || "").toString().toUpperCase();
      const query = it.searchQuery || it.keyword || it.query || it.input || "";
      const price =
        num(it.price) ?? num(it.priceCurrentDollars) ?? num(it.salePrice) ?? num(it.finalPrice) ??
        num(it.currentPrice) ?? num(it.sellingPrice) ?? num(it.priceCurrent) ?? num(it.price_current) ??
        num(it.productPrice) ?? num(it.pricing) ?? num(it.priceInfo) ?? num(it.prices) ??
        num(it.priceValue) ?? num(it.priceWas);
      if (price == null) continue;

      // resolve which part this item is.
      // Amazon: EXACT ASIN ONLY. Newegg (allowQueryMatch): EXACT URL/item code
      // first, then the search term that produced the row, then title contains.
      let id = (asin && byAsin[asin]) || null;
      // Newegg product URL can appear under many different field names depending
      // on the actor. Read all the common ones, and as a last resort scan the whole
      // row for any known Newegg item code, so a match never depends on the exact
      // field name the actor happened to use.
      const negUrlRaw =
        it.url || it.link || it.productUrl || it.itemUrl || it.href ||
        it.pageUrl || it.productLink || it.product_url || it.itemLink || "";
      if (!id && allowQueryMatch) {
        const uk = neggKey(negUrlRaw);
        if (uk && byUrl[uk]) id = byUrl[uk];
        if (!id) id = byQuery[norm(query)] || null;
        if (!id) {
          let blob = "";
          try { blob = JSON.stringify(it).toLowerCase(); } catch (e) {}
          for (const k of Object.keys(byUrl)) {
            if (k.length >= 6 && blob.includes(k)) { id = byUrl[k]; break; }
          }
        }
        if (!id) {
          const nt = norm(title);
          for (const [qn, pid] of Object.entries(byQuery)) {
            if (nt && qn && nt.includes(qn)) { id = pid; break; }
          }
        }
        if (id && ACCESSORY.test(title)) continue; // guard fuzzy matches
      }
      if (!id) continue;
      if (price < floorFor(id)) continue; // drop junk/accessory mis-prices

      if (out[id] == null || price < out[id]) out[id] = price;
      // capture product image + link (first decent one wins)
      const thumb = it.thumbnailImage || it.image || it.imageUrl || it.img || it.thumbnail || it.mainImage || it.mainImageUrl || (Array.isArray(it.images) ? it.images[0] : "") || (Array.isArray(it.imageUrls) ? it.imageUrls[0] : "") || (Array.isArray(it.galleryImageUrls) ? it.galleryImageUrls[0] : "");
      const link = negUrlRaw || (asin ? `https://www.amazon.com/dp/${asin}` : "");
      if (!media[id] && (thumb || link)) media[id] = { img: thumb || "", url: link || "" };
    }
  } catch (e) { dbg.error = String(e && e.message || e); }
  dbg.matched = Object.keys(out).length;
  return { out, media, dbg };
}

export default async function handler(req, res) {
  const prices = {};
  const add = (id, source, val) => {
    if (typeof val === "number" && val > 0) (prices[id] = prices[id] || {})[source] = val;
  };

  const [bb, amz, neg] = await Promise.all([
    bestBuyPrices(),
    apifyPrices(AMAZON_ACTOR, { token: AMAZON_TOKEN }),
    apifyPrices(NEWEGG_ACTOR, { allowQueryMatch: true, token: NEWEGG_TOKEN }),
  ]);

  for (const [id, v] of Object.entries(bb)) add(id, "bestbuy", v);
  for (const [id, v] of Object.entries(amz.out)) add(id, "amazon", v);
  for (const [id, v] of Object.entries(neg.out)) add(id, "newegg", v);

  // Per-part media is returned PER SOURCE ({ amazon, newegg }) so the client can
  // show the image + link of whichever store the displayed price came from.
  // Links are guaranteed from the baked catalog (ASIN / Newegg URL) even when a
  // scrape didn't return a url; images come from the scrape when available.
  const media = {};
  const ids = new Set([
    ...Object.keys(amz.media), ...Object.keys(neg.media),
    ...Object.keys(amz.out), ...Object.keys(neg.out),
  ]);
  for (const id of ids) {
    const info = PART_QUERIES[id] || {};
    const aUrl = (amz.media[id] && amz.media[id].url) || (info.asin ? `https://www.amazon.com/dp/${info.asin}` : "");
    const nUrl = (neg.media[id] && neg.media[id].url) || info.negUrl || "";
    const amazon = (aUrl || (amz.media[id] && amz.media[id].img)) ? { img: (amz.media[id] && amz.media[id].img) || "", url: aUrl } : null;
    const newegg = (nUrl || (neg.media[id] && neg.media[id].img)) ? { img: (neg.media[id] && neg.media[id].img) || "", url: nUrl } : null;
    if (amazon || newegg) media[id] = { amazon, newegg };
  }

  res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
  const payload = { updatedAt: new Date().toISOString(), prices, media };
  if (/[?&]debug=1\b/.test(req.url || "")) {
    payload._debug = {
      env: { amazonActorSet: !!AMAZON_ACTOR, neweggActorSet: !!NEWEGG_ACTOR, amazonTokenSet: !!AMAZON_TOKEN, neweggTokenSet: !!NEWEGG_TOKEN, bestBuyKeySet: !!BESTBUY_KEY },
      amazon: amz.dbg,
      newegg: neg.dbg,
    };
  }
  res.status(200).json(payload);
}
