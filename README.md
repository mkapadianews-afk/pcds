# FORGEAPC

A PC part-picker web app: pick a use case and budget, get a scored, compatibility-checked,
auto-assembled build. Includes a built-in catalog with real GPU board-partner variants and
optional live Best Buy pricing.

## Deploy from your browser (no terminal needed)

1. **Upload to GitHub**
   - On github.com click **New** to create a repository (name it `rigforge`, keep it Public or Private).
   - On the new repo page, click **uploading an existing file**.
   - Drag in *all* the files and folders from this project (`src/`, `api/`, `data/`,
     `package.json`, `index.html`, `vite.config.js`, `vercel.json`, `.gitignore`).
   - Click **Commit changes**.

2. **Deploy on Vercel**
   - Go to vercel.com and sign up **with GitHub**.
   - Click **Add New → Project**, find your `rigforge` repo, click **Import**.
   - Vercel auto-detects Vite. Leave everything default and click **Deploy**.
   - ~30 seconds later you get a live URL like `rigforge.vercel.app`.

3. **(Optional) Turn on live Best Buy prices**
   - Get a free key at developer.bestbuy.com (use a domain email, not Gmail).
   - In Vercel: **Project → Settings → Environment Variables** → add
     `BESTBUY_API_KEY` = your key.
   - Redeploy (Deployments tab → ⋯ → Redeploy). The home screen will show
     "Live Best Buy prices" when it works. Until then it shows accurate sample prices.

## Run locally (optional)
```
npm install
npm run dev
```

## Notes
- **AI assistant ("Ask AI"):** to make it work on your live site, get an API key at
  console.anthropic.com, then in Vercel add an environment variable
  `ANTHROPIC_API_KEY` = your key and redeploy. The key stays server-side in
  `api/chat.js` (never in the browser). It's pay-per-use and very cheap (the app
  asks for short answers). Optional: set `ANTHROPIC_MODEL` to a specific model id.
- Saved builds currently live in the browser session. To persist them across devices,
  wire the save/load to localStorage or a database like Supabase.

## Multi-store live pricing (Best Buy + Amazon + Newegg)

Prices come from three sources and the app automatically shows the **cheapest**
per part. Best Buy is live (official free API); Amazon and Newegg are scraped by
Apify on a 15-day schedule and read back instantly by `api/prices.js`.

### One-time setup
1. **Best Buy** — get a free key at developer.bestbuy.com (domain email).
2. **Apify** — create a free account at apify.com, then:
   - In **Settings → Integrations**, copy your **API token**.
   - Open the **Amazon** actor (`junglee/amazon-product-scraper`) and the
     **Newegg** actor (`kawsar/newegg-product-scraper`) in the Apify Store.
   - Run each once manually with a couple of part names to confirm the output,
     and note the exact **price/title/query field names** in the results.
3. **Schedule the 15-day refresh (in Apify, no code):**
   - For each actor, create a **Task** with your full list of part names as the
     search input (the names in `data/part-queries.js`), max 1 result each.
   - Go to **Schedules → Create schedule**, add both tasks, and set it to run
     on a 15-day cadence (cron `0 9 1,16 * *` = the 1st and 16th).
4. **Add the env vars in Vercel** (Settings → Environment Variables), then redeploy:
   - `BESTBUY_API_KEY`
   - `APIFY_TOKEN`
   - `AMAZON_ACTOR_ID` = `junglee~amazon-product-scraper`
   - `NEWEGG_ACTOR_ID` = `kawsar~newegg-product-scraper`

### Tuning
`api/prices.js` maps scraped items back to parts by matching the search query or
product title, and reads price from common field names. If a chosen actor uses
different field names, adjust the marked lines in `apifyPrices()` to match its
output (check one run's dataset to see the exact fields).

Any source you don't configure is skipped — the app still works on whatever it has.
