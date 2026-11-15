/**
 * domain/facts/rivalPower.js — THE RIVAL-POWER HOME (TAIL-CRISIS-2, the chair's ruling K6 of 2026-11-15: "THE THIRD ATOM,
 * `rival power`, IS GRANTED"; vetoable by the owner). ONE atom, the record's fact: the record holds a power OTHER THAN
 * THE GOVERNING ONE whose own standing is Significant or above. A line that names "a strong power" defying the
 * government presumes one; the insurgency summary printed "A strong power in X has stopped obeying the government"
 * where the government was the only power on the record (READ-ALL 03091, the reader's HIGH).
 *
 *   rivalPowerOf(record)   THE ONE READER: true where a power that is not the governing one (`isGoverning !== true`)
 *                          stands at Significant, Strong or Dominant by its OWN standing (`powerLabel`, the band
 *                          `factionDynamics.js` writes and the Power tab prints); false where the record holds powers
 *                          and none such; `undefined` where it holds no power list (unanswered: fail-closed)
 *
 * The standing is the power's own label, never its share recomputed here: one leaf, the page's own word.
 *
 * ⛔ TRUE OF THE SETTLED RECORD ONLY (the chair's ruling K10, 2026-11-15). The powers are settled late in assembly
 * (`assembleSettlement.js`: `reconcilePowerStructure`, then `resizePoliticalRoster`). A LINE RENDERED BEFORE THE POWERS
 * SETTLE MUST NOT BE KEYED BY IT: the stress summaries are rendered there before that point, and keyed by this atom the
 * insurgency's strong line printed in 31 of the census's 37 insurgencies, 10 of which hold no such power once the roster
 * is resized (r2s-insurgency-hamlet-0: one power left). Measured at 9c07f7461; the summary keeps its true fallback.
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/facts/rivalPower.test.js
 */

/** The standings at Significant or above (the ladder `factionDynamics.js` labels by). */
export const RIVAL_STANDINGS = Object.freeze(['Significant', 'Strong', 'Dominant']);

/**
 * THE ONE READER of `rival power`.
 * @param {{ powerStructure?: { factions?: unknown } | null } | null | undefined} record
 * @returns {boolean | undefined}
 */
export function rivalPowerOf(record) {
  const factions = record?.powerStructure?.factions;
  if (!Array.isArray(factions)) return undefined;
  return factions.some((/** @type {{ isGoverning?: unknown, powerLabel?: unknown } | null | undefined} */ f) =>
    !!f && f.isGoverning !== true && typeof f.powerLabel === 'string' && RIVAL_STANDINGS.includes(f.powerLabel));
}
