/**
 * anonGenCounter.js — Per-day anonymous generation counter (localStorage).
 *
 * Why this exists:
 *   The homepage hero generates settlements without an account so new
 *   visitors can try the product instantly. Without a cap, that's an
 *   open invitation for scrapers and tab-spamming. The cap is a soft
 *   one — generation happens in the browser anyway, so a determined
 *   actor can clear localStorage and keep going. This is a polite
 *   "you've hit the free limit, sign in for unlimited" nudge, not
 *   security.
 *
 * Storage shape:
 *   { date: 'YYYY-MM-DD', count: 0 }
 *   The date is the local day. Crossing midnight resets the counter.
 *
 * Default cap is exposed for tests; product code should call the
 * helpers below instead of reaching for the constant.
 */

const KEY = 'sf.anon.gens';
export const DEFAULT_DAILY_CAP = 3;

function todayKey(now = new Date()) {
  // Local-day key. Using ISO date avoids surprises around DST.
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function read() {
  if (typeof window === 'undefined') return { date: todayKey(), count: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.count !== 'number' || typeof parsed.date !== 'string') {
      return { date: todayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function write(value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch { /* private mode or quota — ignore, soft cap only */ }
}

/**
 * Current count for today. Auto-rolls to 0 if the stored date isn't
 * today, but does NOT persist the roll until incrementAnonGen() is
 * called (read-only access shouldn't mutate storage).
 */
export function getAnonGenCount() {
  const cur = read();
  if (cur.date !== todayKey()) return 0;
  return cur.count;
}

/** Whether the user has any free generations left today. */
export function anonGensRemaining(cap = DEFAULT_DAILY_CAP) {
  return Math.max(0, cap - getAnonGenCount());
}

export function anonAtCap(cap = DEFAULT_DAILY_CAP) {
  return getAnonGenCount() >= cap;
}

/**
 * Record one more anonymous generation. Idempotent across the day
 * boundary — calling it on a fresh day resets the counter to 1.
 * Returns the new count.
 */
export function incrementAnonGen() {
  const cur = read();
  const today = todayKey();
  const next = cur.date === today
    ? { date: today, count: cur.count + 1 }
    : { date: today, count: 1 };
  write(next);
  return next.count;
}

/** Test helper. */
export function resetAnonGenCounter() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
