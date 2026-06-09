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
