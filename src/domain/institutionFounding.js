/**
 * institutionFounding.js — the institution FOUNDING read (MF-T2Q, the Shape-1 leaf).
 *
 * A pure headless leaf at the `src/domain/` root — the `ageBands.js` precedent: the
 * engine and the display both import it without crossing a boundary, and GENERATION
 * NEVER IMPORTS IT. The generator golden hashes `sha256(JSON.stringify(settlement))`
 * WHOLE, so a generation-reachable field would flip every row of the manifest; this
 * leaf is golden-inert BY CONSTRUCTION, the same cure `foundingCatalog.js` names in
 * its own header.
 *
 * WHAT IT READS. The pulse stamps `inst.foundedAt = { year, tick }` at the moment a
 * founding outcome is APPLIED to the settlement (`worldPulse/institutionLifecycle.js`),
 * where the world calendar is in scope on both the immediate and the deferred-proposal
 * path. `year` is the display calendar year; `tick` is the pulse counter — the same
 * two-clock pair `calamityHistory` stamps have always carried, and they are NOT the
 * same clock (a tick is one pulse, and a pulse advances the calendar by its interval).
 *
 * WRITE-ONCE. The stamp is written by the two constructions that bring a NEW
 * institution into existence. The two re-activation constructions — a reopen, a
 * re-founding — preserve whatever the record already carries and never write one,
 * because an institution's founding is its FIRST founding. A later re-founding is a
 * separate dated event and is recorded, dated, in `institutionHistory`.
 *
 * ABSENCE IS THE TYPED VALUE. Nothing is written at generation, ever, so a
 * founding-era institution carries no stamp and reads `PRE_SEED` — it has stood since
 * the founding. That is the cathedral case in its honest form: the year-18 leaf's
 * pulse-founded institutions carry years, and the founding-era cathedral carries the
 * typed bucket rather than an invented date.
 *
 * ⛔ NEVER A LIE — why there are THREE kinds and not two. A save pulsed BEFORE this
 * leaf landed can carry an institution the pulse itself created or founded, with no
 * dated stamp on it. Typing that `PRE_SEED` would assert it has stood since the
 * founding, which is false. It reads `FOUNDED_UNDATED` instead: the pulse founded,
 * re-founded or rebuilt it and no date was recorded. No arm ever invents a year.
 *
 * FROZEN v1. The kind vocabulary and the marker set below ARE the contract; changing
 * either is a declared shift by definition. Pure: no rng, no Date, no store, no I/O.
 */

/**
 * The closed vocabulary (FINITE-SEMANTICS: typed buckets, no free numbers).
 * @type {ReadonlyArray<'FOUNDED'|'FOUNDED_UNDATED'|'PRE_SEED'>}
 */
export const INSTITUTION_FOUNDING_KINDS = Object.freeze(
  /** @type {const} */ (['FOUNDED', 'FOUNDED_UNDATED', 'PRE_SEED']),
);

/**
 * The record keys that can only be present because the pulse CREATED or FOUNDED this
 * institution — the evidence that separates "undated pulse founding" from "stood since
 * the founding".
 *
 * ⚠ `_worldPulseEconomyBuilt` is deliberately NOT in this set. The reopen construction
 * sets it on a record it merely RE-ACTIVATED, so including it would retype every
 * founding-era institution the pulse ever reopened as a pulse founding — the exact lie
 * this leaf exists to refuse.
 *
 * ⚠ Known residual, accepted and recorded: `_worldPulseFounded` is set by BOTH the
 * new-record and the re-founding arm of the patron `found` lane, and the two carry no
 * other distinguishing mark. A founding-era institution RE-founded by that lane
 * therefore reads `FOUNDED_UNDATED` rather than `PRE_SEED`. The kind's meaning is
 * written to cover it — "founded, re-founded or rebuilt by the pulse, date unrecorded"
 * — and no year is claimed either way.
 */
const PULSE_FOUNDING_MARKERS = Object.freeze(['createdByWorldPulseOutcomeId', '_worldPulseFounded']);

/**
 * @typedef {{ kind: 'FOUNDED', year: number, tick: number }} FoundedReading
 * @typedef {{ kind: 'FOUNDED_UNDATED' }} UndatedReading
 * @typedef {{ kind: 'PRE_SEED' }} PreSeedReading
 * @typedef {FoundedReading | UndatedReading | PreSeedReading} InstitutionFounding
 */

/**
 * The dated stamp, or null when there is none to read. A malformed stamp is treated as
 * ABSENT rather than repaired: a half-written date is not evidence of a year.
 * @param {Record<string, unknown>} inst
 * @returns {{ year: number, tick: number } | null}
 */
function datedStampOf(inst) {
  const at = inst.foundedAt;
  if (!at || typeof at !== 'object') return null;
  const { year, tick } = /** @type {{ year?: unknown, tick?: unknown }} */ (at);
  if (!Number.isInteger(year) || !Number.isInteger(tick)) return null;
  const y = /** @type {number} */ (year);
  const t = /** @type {number} */ (tick);
  if (y < 1 || t < 0) return null;
  return { year: y, tick: t };
}

/**
 * Whether the record carries evidence that the PULSE brought it into being.
 * `null`/`false` count as absent — a stamp key written with an empty outcome id is not
 * evidence of anything.
 * @param {Record<string, unknown>} inst
 */
function hasPulseFoundingMarker(inst) {
  return PULSE_FOUNDING_MARKERS.some((key) => inst[key] != null && inst[key] !== false);
}

/**
 * Read one institution's founding as a typed value. TOTAL: every institution, on every
 * save, at every age, gets exactly one of the three kinds — and a non-record reads
 * `PRE_SEED`, because the absence of a record is the absence of a stamp.
 *
 * @param {unknown} inst
 * @returns {InstitutionFounding}
 */
export function institutionFoundingOf(inst) {
  if (!inst || typeof inst !== 'object') return { kind: 'PRE_SEED' };
  const record = /** @type {Record<string, unknown>} */ (inst);
  const dated = datedStampOf(record);
  if (dated) return { kind: 'FOUNDED', year: dated.year, tick: dated.tick };
  if (hasPulseFoundingMarker(record)) return { kind: 'FOUNDED_UNDATED' };
  return { kind: 'PRE_SEED' };
}
