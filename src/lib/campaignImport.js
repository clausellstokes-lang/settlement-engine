/**
 * lib/campaignImport.js — V-17 THE CAMPAIGN IMPORT: the resumable import session.
 *
 * The orchestration glue between the paste/upload UI and the pure schema wall
 * (src/domain/tableEvents.js). A SESSION is the in-progress backfill: the DM's raw
 * notes turned into a batch of PROPOSED rows (via the deterministic clerk), each of
 * which the DM reviews, corrects, and CONFIRMS one at a time. Nothing here writes to
 * the world; nothing persists. The session lives only in component state — abandoning
 * the panel (or reloading) discards it, honoring "nothing uncommitted persists." The
 * commit is a single store action (importTableEvents) fed ONLY the confirmed rows.
 *
 * Pure + immutable: every mutator returns a new session; the same inputs yield the
 * same session (the clerk is deterministic), so an import is replayable/resumable.
 *
 * FOLD SEAM: at fold this module keeps its shape; only the vocabulary it imports from
 * tableEvents.js unifies onto V-F's tableLedger.js (a value-identical swap).
 */

import {
  proposeBuckets,
  buildTableEvent,
  validateTableEvent,
  isTableEventKind,
  isMagnitudeBand,
} from '../domain/tableEvents.js';

/**
 * @typedef {Object} ImportRow
 * @property {number} index       the segment index (stable across edits)
 * @property {string} flavor      the DM's verbatim words (editable; FLAVOR ONLY)
 * @property {string} kind        the chosen/proposed typed kind
 * @property {string} band        the chosen/proposed magnitude band
 * @property {boolean} confident  did the clerk match a vocabulary keyword?
 * @property {number} tick        the DM-chosen historical tick to place it at
 * @property {string[]} settlementIds  typed targets the DM picked (never from text)
 * @property {boolean} confirmed  the per-event gate — false until the DM confirms
 * @property {boolean} skipped    the DM chose not to import this row
 */

/**
 * @typedef {Object} ImportSession
 * @property {string} raw         the original pasted notes (for resume/review)
 * @property {number} defaultTick the tick new/unset rows default to
 * @property {ImportRow[]} rows
 */

/**
 * Start a session from raw notes. The clerk proposes {kind, band} per segment; the
 * DM confirms each. `defaultTick` seeds every row's tick (typically the campaign's
 * current tick, so a backfill lands "now" unless the DM moves it earlier).
 * @param {string} rawNotes
 * @param {{ defaultTick?: number }} [opts]
 * @returns {ImportSession}
 */
export function createImportSession(rawNotes, opts = {}) {
  const defaultTick = Math.max(0, Math.floor(Number(opts.defaultTick) || 0));
  const proposals = proposeBuckets(rawNotes);
  return {
    raw: typeof rawNotes === 'string' ? rawNotes : '',
    defaultTick,
    rows: proposals.map(p => ({
      index: p.index,
      flavor: p.flavor,
      kind: p.kind,
      band: p.band,
      confident: p.confident,
      tick: defaultTick,
      settlementIds: [],
      confirmed: false,
      skipped: false,
    })),
  };
}

/**
 * Append a blank row for the FULLY-MANUAL path — the DM authors a table event by
 * hand with no notes and no clerk (the required deterministic manual path). The row
 * starts on the safe defaults (incident/moderate) for the DM to set. Pure.
 * @param {ImportSession} session @param {{ tick?: number }} [opts]
 * @returns {ImportSession}
 */
export function addBlankRow(session, opts = {}) {
  const rows = Array.isArray(session?.rows) ? session.rows : [];
  const nextIndex = rows.reduce((m, r) => Math.max(m, r.index), -1) + 1;
  const tick = Number.isFinite(opts.tick) ? Math.max(0, Math.floor(Number(opts.tick))) : (session?.defaultTick ?? 0);
  return {
    ...session,
    rows: [...rows, {
      index: nextIndex, flavor: '', kind: 'incident', band: 'moderate',
      confident: false, tick, settlementIds: [], confirmed: false, skipped: false,
    }],
  };
}

/** Immutably replace the row at `index` with `{ ...row, ...patch }`. Pure. */
export function updateRow(session, index, patch) {
  if (!session || !Array.isArray(session.rows)) return session;
  return {
    ...session,
    rows: session.rows.map(r => (r.index === index ? { ...r, ...patch } : r)),
  };
}

/**
 * Confirm (or un-confirm) a row — the per-event human gate. A row can only be
 * confirmed when its typed selection is admissible (kind + band in the vocabulary);
 * an inadmissible row cannot be confirmed, so it can never reach the commit.
 * @param {ImportSession} session @param {number} index @param {boolean} [confirmed]
 */
export function setRowConfirmed(session, index, confirmed = true) {
  const row = session?.rows?.find(r => r.index === index);
  if (!row) return session;
  const admissible = isTableEventKind(row.kind) && isMagnitudeBand(row.band);
  return updateRow(session, index, { confirmed: confirmed && admissible, skipped: false });
}

/** Skip a row entirely (kept for review, never committed). Skipping clears any
 *  confirmation; un-skipping leaves the confirmation untouched. Pure. */
export function setRowSkipped(session, index, skipped = true) {
  return updateRow(session, index, skipped ? { skipped: true, confirmed: false } : { skipped: false });
}

/**
 * The confirmed, non-skipped, schema-valid rows as typed records ready to commit.
 * This is the ONLY bridge from session to the store action — an unconfirmed or
 * skipped row is structurally incapable of appearing here (the confirmation gate).
 * Records are built through buildTableEvent (deterministic ids) and re-validated
 * through the schema wall as belt-and-suspenders.
 * @param {ImportSession} session
 * @returns {import('../domain/tableEvents.js').TableEventRecord[]}
 */
export function confirmedRecords(session) {
  if (!session || !Array.isArray(session.rows)) return [];
  /** @type {import('../domain/tableEvents.js').TableEventRecord[]} */
  const out = [];
  for (const r of session.rows) {
    if (!r.confirmed || r.skipped) continue;
    const rec = buildTableEvent({
      kind: r.kind,
      band: r.band,
      tick: r.tick,
      targets: { settlementIds: Array.isArray(r.settlementIds) ? r.settlementIds : [] },
      flavor: r.flavor,
      index: r.index,
    });
    if (validateTableEvent(rec).ok) out.push(rec);
  }
  return out;
}

/**
 * Progress counters for the review UI (total / confirmed / skipped / pending).
 * @param {ImportSession} session
 */
export function importSummary(session) {
  const rows = session?.rows || [];
  let confirmed = 0;
  let skipped = 0;
  for (const r of rows) {
    if (r.skipped) skipped += 1;
    else if (r.confirmed) confirmed += 1;
  }
  return {
    total: rows.length,
    confirmed,
    skipped,
    pending: rows.length - confirmed - skipped,
    ready: confirmed > 0,
  };
}
