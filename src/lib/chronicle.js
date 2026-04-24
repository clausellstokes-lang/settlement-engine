/**
 * chronicle.js — Pure helpers for the per-settlement narrative chronicle.
 *
 * A chronicle entry is an immutable record of a narrative generation event
 * (initial / regenerate / progression / revert). Entries live on the saved
 * settlement's `ai_data.chronicle` array; this module supplies the shape
 * and the rotation logic.
 *
 * Ordering: newest-first. Index 0 is the most recent entry.
 *
 * Modes:
 *   • 'full'    — carries the full aiSettlement/aiDailyLife snapshot.
 *   • 'summary' — only thesis + summaryText; heavy fields nulled.
 *
 * Rotation: when `full` entries exceed `limit`, the oldest `full` entries
 * are rotated in-place to `summary`. Summary entries are never pruned.
 *
 * No store access, no async, no side effects — safe to import anywhere.
 */

// ── Limits ───────────────────────────────────────────────────────────────────

export const CHRONICLE_LIMITS = {
  free:     5,
  premium:  Infinity,
  elevated: Infinity, // developer / admin
};

// ── UUID (tiny, self-contained — avoids pulling a dep just for ids) ──────────

function uuid() {
  // Good enough for local identifiers — not cryptographic.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try { return crypto.randomUUID(); } catch (_) { /* fall through */ }
  }
  const rnd = () => Math.random().toString(16).slice(2, 10);
  return `${rnd()}-${rnd()}-${rnd()}-${rnd()}`;
}

// ── Entry construction ───────────────────────────────────────────────────────

/**
 * Build a new chronicle entry from the current narrative state.
 *
 * Defaults to `mode: 'full'`. Callers can pass `mode: 'summary'` to create a
 * summary-at-birth entry (used for `revert` events where retaining the full
 * payload would contradict the user's intent).
 *
 * @param {object} args
 * @param {'initial'|'regenerate'|'progression'|'revert'} args.reason
 * @param {object|null} args.aiSettlement  — snapshot to preserve
 * @param {object|null} args.aiDailyLife   — snapshot to preserve
 * @param {string|null} [args.triggeredBy] — human-readable note (for progression)
 * @param {'full'|'summary'} [args.mode='full']
 * @returns {ChronicleEntry}
 */
export function createChronicleEntry({ reason, aiSettlement, aiDailyLife, triggeredBy = null, mode = 'full' }) {
  const thesis = typeof aiSettlement?.thesis === 'string' ? aiSettlement.thesis : '';
  // summaryText defaults to thesis — cheap, zero extra API calls. If callers
  // ever want a derived short summary, they can override after construction.
  const summaryText = thesis;
  const isSummary = mode === 'summary';

  return {
    id: uuid(),
    createdAt: new Date().toISOString(),
    mode: isSummary ? 'summary' : 'full',
    reason,
    thesis,
    summaryText,
    aiSettlement: isSummary ? null : (aiSettlement || null),
    aiDailyLife:  isSummary ? null : (aiDailyLife  || null),
    triggeredBy,
  };
}

/**
 * Strip the heavy fields off an entry, returning a summary-mode copy. The
 * original is not mutated. `thesis` and `summaryText` survive; everything
 * else that costs storage is nulled.
 */
export function rotateToSummary(entry) {
  if (!entry || entry.mode === 'summary') return entry;
  return {
    ...entry,
    mode: 'summary',
    aiSettlement: null,
    aiDailyLife:  null,
  };
}

/**
 * Append a new entry to the chronicle and enforce the full-mode cap.
 *
 * Newest-first. Any full-mode entries beyond `limit` are rotated to summary,
 * oldest first. Summary entries do not count against the limit and are never
 * pruned.
 *
 * Returns a new array — never mutates the input.
 */
export function appendChronicleEntry(chronicle, entry, { limit } = {}) {
  const list = Array.isArray(chronicle) ? chronicle : [];
  const capped = typeof limit === 'number' && Number.isFinite(limit) ? Math.max(0, limit) : Infinity;

  // Prepend newest.
  const next = [entry, ...list];

  if (capped === Infinity) return next;

  // Rotate older 'full' entries to 'summary' once we exceed the cap.
  // Walk newest→oldest; keep the first `capped` full entries as-is; rotate
  // the rest. Summary entries pass through untouched.
  let fullKept = 0;
  return next.map((e) => {
    if (!e || e.mode !== 'full') return e;
    if (fullKept < capped) {
      fullKept += 1;
      return e;
    }
    return rotateToSummary(e);
  });
}
