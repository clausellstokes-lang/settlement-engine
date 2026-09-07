/**
 * session.js — the return-visit stamp (EAGER: main.jsx imports this at boot).
 *
 * The analytics session ID that used to live here moved to sessionId.js (the
 * A1-FP eager-leaf/lazy-applier reclaim): main.jsx's static import makes this
 * file part of the first-paint entry closure, and the id machinery is only
 * needed at flush time — it now folds into the lazy analyticsFlush.js chunk.
 * Do NOT re-export getSessionId from here; that would pull it back eager.
 *
 * The return-visit stamp (localStorage) lets session_started carry
 * `days_since_last_visit_band`. Dependency-free (analytics imports must never
 * cycle back through this).
 */

const LAST_VISIT_KEY = 'sf_last_visit';

function nowMs() {
  // Wall clock is acceptable here (session boundaries are not part of the
  // deterministic engine). Guarded for SSR.
  try { return typeof Date !== 'undefined' ? Date.now() : 0; } catch { return 0; }
}

/** Days since the last recorded visit, as a coarse band (for session_started). */
export function returnVisitBand() {
  let last = 0;
  try { last = Number(localStorage.getItem(LAST_VISIT_KEY)) || 0; } catch { /* none */ }
  if (!last) return { is_return: false, days_since_last_visit_band: 'first' };
  const days = (nowMs() - last) / (24 * 60 * 60 * 1000);
  const band = days <= 1 ? 'same_day'
    : days <= 3 ? '1_3d'
      : days <= 7 ? '4_7d'
        : days <= 30 ? '8_30d'
          : 'gt_30d';
  return { is_return: true, days_since_last_visit_band: band };
}

/** Stamp "now" as the last visit (call once per session on start). */
export function stampVisit() {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(LAST_VISIT_KEY, String(nowMs())); }
  catch { /* storage unavailable */ }
}
