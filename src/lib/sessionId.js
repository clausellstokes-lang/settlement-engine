/**
 * sessionId.js — the analytics session id (rotates after 30 min of idle).
 *
 * SPLIT out of session.js (which keeps the return-visit stamp) as part of the
 * A1-FP eager-leaf/lazy-applier reclaim: main.jsx statically imports session.js
 * for returnVisitBand/stampVisit, so anything living in that file is EAGER
 * (first-paint entry closure). The id machinery below is imported ONLY by the
 * lazy analyticsFlush.js, so it folds into that lazy chunk — zero eager bytes
 * (the vendorPdfLazy closure ratchet asserts the budget).
 *
 * ⚠️ Do NOT import this from any eager module (main.jsx, store slices,
 * analytics.js/analyticsQueue.js) and do NOT re-export it from session.js —
 * either would pull it back into the entry closure.
 *
 * A session groups events for funnel/path analysis. sessionStorage for the id
 * (per-tab session). Dependency-free.
 */

const SESSION_ID_KEY   = 'sf_session_id';
const SESSION_SEEN_KEY = 'sf_session_last_seen';
const IDLE_MS = 30 * 60 * 1000; // 30 min

function uuid() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* fall through */ }
  // Fallback (older WebViews) — not cryptographically strong, fine for a session id.
  return 'sx-' + Math.abs(hashStr(String(performance?.now?.() ?? '') + ':' + readSeen())).toString(36)
    + '-' + (readSeen() % 1e6).toString(36);
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
  return h;
}

function nowMs() {
  // Wall clock is acceptable here (session boundaries are not part of the
  // deterministic engine). Guarded for SSR.
  try { return typeof Date !== 'undefined' ? Date.now() : 0; } catch { return 0; }
}

function readSeen() {
  try { return Number(sessionStorage.getItem(SESSION_SEEN_KEY)) || 0; } catch { return 0; }
}

/** Current session id, rotating after idle. Side effect: refreshes last-seen. */
export function getSessionId() {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const now = nowMs();
    const lastSeen = readSeen();
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id || (lastSeen && now - lastSeen > IDLE_MS)) {
      id = uuid();
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    sessionStorage.setItem(SESSION_SEEN_KEY, String(now));
    return id;
  } catch { return null; }
}
