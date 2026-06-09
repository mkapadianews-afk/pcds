import { createClient } from "@supabase/supabase-js";

// PC Mogger online multiplayer — realtime only (no database tables used).
const SUPABASE_URL = "https://auqxtlnayxqwzsfpejme.supabase.co";
const SUPABASE_KEY = "sb_publishable_7SFlI96BVnlaCchKg56tmA_L1gDvJC5";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 20 } },
});

// stable per-tab identity
export const myId = Math.random().toString(36).slice(2, 10);

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
export function makeCode(n = 4) {
  let s = "";
  for (let i = 0; i < n; i++) s += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  return s;
}

// Create (but do not subscribe) a room channel. Caller wires handlers then subscribes.
export function roomChannel(code) {
  return supabase.channel("mogger-room-" + code, {
    config: { broadcast: { self: false }, presence: { key: myId } },
  });
}

export function lobbyChannel() {
  return supabase.channel("mogger-lobby", {
    config: { broadcast: { self: false }, presence: { key: myId } },
  });
}

export function leave(ch) {
  try { if (ch) supabase.removeChannel(ch); } catch (e) { /* ignore */ }
}

// ---------- Accounts + Elo (uses a Supabase table: mogger_users) ----------
// NOTE: this is light, browser-side auth — convenient, NOT real security.
// Passwords are stored only as a one-way SHA-256 hash (never in readable form).
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// password rule: 8+ chars, at least one number, letters & numbers only (no symbols)
export function validatePassword(pw) {
  if (!pw || pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[0-9]/.test(pw)) return "Password must include a number.";
  if (!/^[A-Za-z0-9]+$/.test(pw)) return "Only letters and numbers — no symbols.";
  return null;
}

export async function signUp(name, password) {
  const nm = (name || "").trim();
  if (!nm) return { error: "Enter a name." };
  const bad = validatePassword(password); if (bad) return { error: bad };
  const hash = await sha256(nm.toLowerCase() + "::" + password);
  try {
    const { data: dup } = await supabase.from("mogger_users").select("id").eq("name", nm).eq("hash", hash).limit(1);
    if (dup && dup.length) return { error: "That name+password is taken — make a stronger password." };
    const { data, error } = await supabase.from("mogger_users").insert({ name: nm, hash, elo: 100 }).select().single();
    if (error) return { error: "Could not create account." };
    return { user: { id: data.id, name: data.name, elo: data.elo } };
  } catch (e) { return { error: "Network error — try again." }; }
}

export async function logIn(name, password) {
  const nm = (name || "").trim();
  if (!nm || !password) return { error: "Enter your name and password." };
  const hash = await sha256(nm.toLowerCase() + "::" + password);
  try {
    const { data } = await supabase.from("mogger_users").select("*").eq("name", nm).eq("hash", hash).limit(1);
    if (!data || !data.length) return { error: "Wrong name or password." };
    const u = data[0];
    return { user: { id: u.id, name: u.name, elo: u.elo } };
  } catch (e) { return { error: "Network error — try again." }; }
}

export async function fetchElo(id) {
  try { const { data } = await supabase.from("mogger_users").select("elo").eq("id", id).single(); return data ? data.elo : null; }
  catch (e) { return null; }
}
export async function saveElo(id, elo) {
  try { await supabase.from("mogger_users").update({ elo }).eq("id", id); } catch (e) { /* ignore */ }
}

// Win gain = 10% of opponent's elo, scaled down the higher MY elo is (full reward on big upsets).
// Loser loses exactly what the winner gained.
export function eloGain(myElo, oppElo) {
  const base = oppElo * 0.10;
  const scale = oppElo / (myElo + oppElo); // ~1 when opp >> me, ~0 when me >> opp
  return Math.max(1, Math.round(base * scale));
}

export async function leaderboard(limit = 100) {
  try { const { data } = await supabase.from("mogger_users").select("name,elo").order("elo", { ascending: false }).limit(limit); return data || []; }
  catch (e) { return []; }
}

// ---- account-stored builds (table: mogger_builds) ----
export async function listBuilds(userId) {
  try { const { data } = await supabase.from("mogger_builds").select("*").eq("user_id", userId); return (data || []).map((r) => ({ ...(r.data || {}), _cloud: true })); }
  catch (e) { return []; }
}
export async function syncBuild(userId, build) {
  try {
    const { data: ex } = await supabase.from("mogger_builds").select("id").eq("user_id", userId).eq("build_id", build.id).limit(1);
    if (ex && ex.length) await supabase.from("mogger_builds").update({ name: build.name, data: build, updated_at: new Date().toISOString() }).eq("id", ex[0].id);
    else await supabase.from("mogger_builds").insert({ user_id: userId, build_id: build.id, name: build.name, data: build });
  } catch (e) { /* ignore */ }
}
export async function deleteBuildCloud(userId, buildId) {
  try { await supabase.from("mogger_builds").delete().eq("user_id", userId).eq("build_id", buildId); } catch (e) { /* ignore */ }
}

