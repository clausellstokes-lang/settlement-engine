/**
 * anonGenCounter.js - Per-day anonymous generation counter (localStorage).
 *
 * Why this exists:
 *   The homepage hero generates settlements without an account so new
 *   visitors can try the product instantly. Without a cap, that's an
 *   open invitation for scrapers and tab-spamming. The cap is a soft
 *   one - generation happens in the browser anyway, so a determined
 *   actor can clear localStorage and keep going. This is a polite
 *   "you've hit the free limit, sign in for unlimited" nudge, not
 *   security.
 *
 * Tier 7.2 - two-bucket cap:
 *   The roadmap's "1 full dossier + 2 lightweight rerolls/previews"
 *   pattern is more forgiving than a flat 3/day cap without inviting
 *   abuse. We split the counter into two:
 *
 *     full      - full first-generation runs (population, full
 *                 derivations). 1 per day for anonymous.
 *     reroll    - preset switches or section rerolls (the user has
 *                 already seen a full dossier and is tweaking). 2
 *                 per day for anonymous.
 *
 *   When the user is at-cap on `full` but has rerolls remaining, the
 *   hero offers a reroll instead of full regeneration. When both are
 *   exhausted, the upgrade nudge appears.
 *
 * Storage shape (extends prior single-counter shape, backward
 * compatible - pre-7.2 saves have only `count` and get interpreted
 * as `full: count`):
 *   { date: 'YYYY-MM-DD', full: 0, reroll: 0, count?: 0 }
 *
 * Default caps are exposed for tests; product code should call the
 * helpers below instead of reaching for the constants.
 */

const KEY = 'sf.anon.gens';
export const DEFAULT_DAILY_FULL_CAP = 1;
export const DEFAULT_DAILY_REROLL_CAP = 2;
// Backward-compatibility alias - many call sites still pass DEFAULT_DAILY_CAP.
// It now represents the COMBINED cap (full + reroll = 3) so existing
// "remaining" displays stay sensible without changing the call site.
export const DEFAULT_DAILY_CAP = DEFAULT_DAILY_FULL_CAP + DEFAULT_DAILY_REROLL_CAP;

function todayKey(now = new Date()) {
  // Local-day key. Using ISO date avoids surprises around DST.
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function emptyShape() {
  return { date: todayKey(), full: 0, reroll: 0 };
}

function read() {
  if (typeof window === 'undefined') return emptyShape();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyShape();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.date !== 'string') {
      return emptyShape();
    }
    // Tier 7.2 backward-compat: pre-7.2 saves only have `count`.
    // Treat that legacy count as `full` so the user doesn't lose
    // their day's quota on schema upgrade.
    if (typeof parsed.full !== 'number') {
      const legacyCount = typeof parsed.count === 'number' ? parsed.count : 0;
      return { date: parsed.date, full: legacyCount, reroll: 0 };
    }
    return {
      date: parsed.date,
      full: parsed.full,
      reroll: typeof parsed.reroll === 'number' ? parsed.reroll : 0,
    };
  } catch {
    return emptyShape();
  }
}

function write(value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch { /* private mode or quota - ignore, soft cap only */ }
}

function todaySnapshot() {
  const cur = read();
  if (cur.date !== todayKey()) return emptyShape();
  return cur;
}

// ── Per-bucket accessors (Tier 7.2) ─────────────────────────────────

/** Full-generation count for today (does not persist a date roll). */
export function getAnonFullCount() {
  return todaySnapshot().full;
}

/** Reroll count for today (does not persist a date roll). */
export function getAnonRerollCount() {
  return todaySnapshot().reroll;
}

/** Remaining full generations today. */
export function anonFullRemaining(cap = DEFAULT_DAILY_FULL_CAP) {
  return Math.max(0, cap - getAnonFullCount());
}

/** Remaining rerolls today. */
export function anonRerollRemaining(cap = DEFAULT_DAILY_REROLL_CAP) {
  return Math.max(0, cap - getAnonRerollCount());
}

/** True when the user has used their daily full allowance. */
export function anonFullAtCap(cap = DEFAULT_DAILY_FULL_CAP) {
  return getAnonFullCount() >= cap;
}

/** True when the user has used their daily reroll allowance. */
export function anonRerollAtCap(cap = DEFAULT_DAILY_REROLL_CAP) {
  return getAnonRerollCount() >= cap;
}

/** Increment the full-generation counter and return the new value. */
export function incrementAnonFull() {
  const today = todayKey();
  const cur = read();
  const next = cur.date === today
    ? { ...cur, date: today, full: cur.full + 1 }
    : { date: today, full: 1, reroll: 0 };
  write(next);
  return next.full;
}

/** Increment the reroll counter and return the new value. */
export function incrementAnonReroll() {
  const today = todayKey();
  const cur = read();
  const next = cur.date === today
    ? { ...cur, date: today, reroll: cur.reroll + 1 }
    : { date: today, full: 0, reroll: 1 };
  write(next);
  return next.reroll;
}

// ── Combined-bucket helpers (backward compatible API) ───────────────

/**
 * Combined count for today (full + reroll). Tier 7.2 splits the
 * counter but legacy callers reading "the user's daily count" still
 * get a single number that matches DEFAULT_DAILY_CAP.
 */
export function getAnonGenCount() {
  const snap = todaySnapshot();
  return snap.full + snap.reroll;
}

/**
 * Combined remaining. Defaults to the sum cap so existing UI shows
 * "N of 3 remaining" without changes.
 */
export function anonGensRemaining(cap = DEFAULT_DAILY_CAP) {
  return Math.max(0, cap - getAnonGenCount());
}

export function anonAtCap(cap = DEFAULT_DAILY_CAP) {
  return getAnonGenCount() >= cap;
}

/**
 * Legacy increment - interprets a single bump as a full generation
 * (the most-common call site is the hero's first-generation button).
 * Section rerolls and preset switches should use incrementAnonReroll
 * directly.
 */
export function incrementAnonGen() {
  return incrementAnonFull();
}

/** Test helper. */
export function resetAnonGenCounter() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
