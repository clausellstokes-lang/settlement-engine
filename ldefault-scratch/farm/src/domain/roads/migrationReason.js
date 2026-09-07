/**
 * roads/migrationReason.js — the CAUSAL REASON string for a migrant column on the road scene
 * (§14 ON THE ROAD). The persisted migration ledger record carries no reason field, so the
 * "why" is read from the causal-reasons layer: the destination settlement's populationHistory
 * stamps an inbound-migration reason, and the origin's lifecycle (a shed/abandoning settlement)
 * supplies the push. Best-effort + INERT-NOT-CRASH: an unreadable pair yields a plain
 * origin→dest descriptor, never a throw.
 *
 * FIRST-PAINT LAW: a ZERO-IMPORT LAZY LEAF, read only from the lazy roadScene composer. Pure.
 *
 * @enforced-by tests/domain/roadSceneComposer.test.js
 */

/** @param {unknown} x @returns {Record<string, unknown>} */
function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {}; }
/** @param {unknown} v @returns {string} */
function str(v) { return v == null ? '' : String(v); }

/** Find a settlement blob by id in the settlements list (full or {id,settlement}). Pure.
 *  @param {unknown} settlements @param {string} id @returns {Record<string, unknown>} */
function settlementById(settlements, id) {
  for (const s of Array.isArray(settlements) ? settlements : []) {
    const so = obj(s);
    const sid = so.id ?? obj(so.settlement).id;
    if (String(sid) === String(id)) return obj(so.settlement || so);
  }
  return {};
}

/** The engine's ONE migration cause (migrationKernel.js:265 — the sole reason a column moves:
 *  a shed / over-capacity settlement). No reason vocabulary constant is exported there; this is
 *  the honest attributed cause for any in-transit column. */
export const MIGRATION_CAUSE = 'A column of folk leaving a shed settlement';

/**
 * The human causal reason for a migrant column originId→destId, resolving `id`s to names via the
 * settlements list. In this engine migration has a SINGLE cause (a shed/over-capacity origin), so
 * the base reason is that cause, personalized with names — enriched by a richer arrival stamp on
 * the destination's populationHistory when one is available. Pure, total.
 * @param {unknown} worldState  (reserved for a future world-level reason read; unused today)
 * @param {unknown} settlements  the roster (for populationHistory + names)
 * @param {string} originId @param {string} destId
 * @returns {string}
 */
export function migrationColumnReason(worldState, settlements, originId, destId) {
  /** @param {unknown} id @returns {string} */
  const nameOf = (id) => {
    const s = settlementById(settlements, str(id));
    return str(s.name || s.id || id);
  };
  const oName = nameOf(originId); const dName = nameOf(destId);
  const dest = settlementById(settlements, str(destId));

  // Enrichment: a richer inbound-migration reason stamped on the DESTINATION populationHistory
  // (the causal-reasons layer) matching this origin, most recent first. Only used when it clearly
  // refers to this origin — the stamp is dest+tick-keyed, so an ambiguous one is not attributed.
  const history = Array.isArray(dest.populationHistory) ? [...dest.populationHistory].reverse() : [];
  for (const h of history) {
    const ho = obj(h);
    const reason = str(ho.reason || ho.cause || ho.narrativeSummary);
    if (!reason) continue;
    if (String(ho.fromId ?? ho.originId ?? '') === String(originId) || (oName && reason.includes(oName))) return reason;
  }

  // The base cause (migration's one reason), personalized: folk shedding from origin toward dest.
  return `${MIGRATION_CAUSE}: ${oName} → ${dName}`;
}
