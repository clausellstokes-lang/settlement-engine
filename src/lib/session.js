/**
 * session.js — analytics session id + return-visit stamp.
 *
 * A session groups events for funnel/path analysis. It rotates after 30 min of
 * idle (checked on every access). The return-visit stamp (localStorage) lets
 * session_started carry `days_since_last_visit_band`.
 *
 * Dependency-free (analytics imports this; must not import analytics).
 * sessionStorage for the id (per-tab session), localStorage for the cross-
 * session "last visit" stamp.
 */

const SESSION_ID_KEY   = 'sf_session_id';
const SESSION_SEEN_KEY  = 'sf_session_last_seen';
const LAST_VISIT_KEY    = 'sf_last_visit';
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
