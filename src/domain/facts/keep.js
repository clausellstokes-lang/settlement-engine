/**
 * domain/facts/keep.js — WHAT A PLACE CAN KEEP UP (COHERENCE-UPKEEP, the chair's ruling of
 * 2026-11-12 on item 4; the owner: "prosperity should also scale the rest … everything is based
 * on what can be stockpiled, refilled, rebuilt").
 *
 * THE CLASS IT CLOSES. "What can this place afford to keep up" was read from TWO homes: the
 * defence gates, the hired terms and the commercial service demand read the economy's OUTPUT
 * score, while the page prints the prosperity LABEL beside every capacity. The two disagree in
 * 97 of the lane's 360 births, so a Poor village could pay its adventurers in full and a
 * Comfortable town could starve its watch. ONE home now answers: the prosperity label.
 *
 * Nothing feeds back. `computeBaseProsperity` and `deriveProsperityLabel` read no defence
 * score, no service availability, no magic availability and no months in store, and prosperity
 * is written before every reader of this home (the defence profile, the service roll, the magic
 * profile and the stores' scaling after the food record).
 *
 * TWO COLUMNS, ONE TABLE (the chair's ruling 1):
 *   `bought` — the share of what is bought outright that the place can keep paying for: a hired
 *     company, a charter hall's bounties, a service's custom, a magic seller's stock, the grain
 *     laid by in store.
 *   `funded` — the funding of wages and works: how far the standing gates (the garrison's pay,
 *     the watch's wages, the patrols' provisions, the crisis logistics) are kept above their
 *     floors. 1 is today's identity.
 *
 * ONE READER: `keepOf(prosperity)`. An unknown or absent label reads as the identity (1, 1):
 * missing information is not a poor settlement, and the identity is what every gate did for a
 * healthy place before this home existed.
 *
 * Pure: no randomness, no clock, no import beyond the prosperity ladder's shape reader.
 */
import { prosperityLabelOf } from '../prosperityRank.js';

/**
 * The upkeep table, keyed by the prosperity label (`deriveProsperityLabel`'s six, plus
 * `Subsistence`, `computeBaseProsperity`'s own bottom rung). DRAFT values, the chair's ruling of
 * 2026-11-12 (from the item 4 proposal's shares); they are the owner's to sign.
 * @type {Readonly<Record<string, Readonly<{ bought: number, funded: number }>>>}
 */
export const KEEP_TUNING = Object.freeze({
  Struggling:  Object.freeze({ bought: 0.4,  funded: 0 }),
  Subsistence: Object.freeze({ bought: 0.55, funded: 0.3 }),
  Poor:        Object.freeze({ bought: 0.55, funded: 0.4 }),
  Moderate:    Object.freeze({ bought: 0.75, funded: 0.7 }),
  Comfortable: Object.freeze({ bought: 0.9,  funded: 1 }),
  Prosperous:  Object.freeze({ bought: 1,    funded: 1 }),
  Wealthy:     Object.freeze({ bought: 1,    funded: 1 }),
});

/** The identity: what an unknown label reads as. */
const KEEP_IDENTITY = Object.freeze({ bought: 1, funded: 1 });

const FOLDED = Object.freeze(Object.fromEntries(
  Object.entries(KEEP_TUNING).map(([label, row]) => [label.toLowerCase(), row]),
));

/**
 * What a place can keep up, from its prosperity label in any shape `economicState.prosperity`
 * takes (a bare string, or an object under `label` / `tier` / `level`).
 * @param {unknown} prosperity
 * @returns {Readonly<{ bought: number, funded: number }>}
 */
export function keepOf(prosperity) {
  const folded = prosperityLabelOf(prosperity).toLowerCase();
  return FOLDED[folded] || KEEP_IDENTITY;
}

/**
 * A gate kept above its floor by the place's funding: `floor + (1 - floor) × funded`. At
 * `funded` 1 it is the identity.
 * @param {number} floor @param {{ funded: number }} keep @returns {number}
 */
export function fundedGate(floor, keep) {
  return floor + (1 - floor) * keep.funded;
}
