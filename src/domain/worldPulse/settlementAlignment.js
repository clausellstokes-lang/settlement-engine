/**
 * domain/worldPulse/settlementAlignment.js — the settlement-alignment READ MODEL
 * (Phase 5.5 W0, substrate).
 *
 * ONE pure selector bundling the three derived disposition coordinates the
 * spatial-engine design consumes (PHASE55_SPATIAL_ENGINE_DESIGN §IV.4 / §VI.3):
 *
 *   { lawfulness01, malice01, aggressiveness }
 *
 * - `lawfulness01` / `malice01` — the two derived 0..1 alignment axes
 *   (disposition.computeLawfulness / computeMalice; EXACTLY 0.5 = no signal).
 * - `aggressiveness` — the existing centered-on-1.0 disposition multiplier
 *   (computeAggressiveness; EXACTLY 1.0 = no signal), carried through verbatim
 *   so downstream consumers read all three off one call.
 *
 * This is a DISPLAY/DOMAIN SELECTOR, not persisted state: recomputed per eval
 * from the pre-tick snapshot item + worldState (the round-7 "culture is a LIVE
 * read" law — alignment drifts as corruption / coups / conquest move its
 * inputs, with no stored field to migrate or go stale). NO consumer is wired
 * this wave (W0 is substrate only); fidelityNoise stays deity-driven until
 * Wave A widens it, and every existing path is byte-identical by construction.
 *
 * Determinism: pure — no rng, no wall-clock, no mutation; total on garbage
 * (a null/sparse item reads the neutral { 0.5, 0.5, 1.0 }).
 */

import { computeAggressiveness, computeLawfulness, computeMalice } from './disposition.js';

/**
 * @typedef {Object} SettlementAlignment
 * @property {number} lawfulness01  0 lawless … 1 lawful-bureaucratic; EXACTLY 0.5 = no signal.
 * @property {number} malice01     0 saintly … 1 malicious; EXACTLY 0.5 = no signal.
 * @property {number} aggressiveness centered-on-1.0 multiplier; EXACTLY 1.0 = no signal.
 */

/**
 * The settlement's derived alignment, as one live read.
 *
 * @param {import('./disposition.js').AlignmentItem|null} [item] - a worldSnapshot settlement item.
 * @param {import('./disposition.js').AlignmentActsSource & { dispositionStats?: Record<string, unknown> }|null} [worldState]
 *   - carries dispositionStats / warExhaustion / occupations.
 * @returns {SettlementAlignment}
 */
export function settlementAlignment(item, worldState) {
  return {
    lawfulness01: computeLawfulness(item, worldState),
    malice01: computeMalice(item, worldState),
    // computeAggressiveness declares the narrower `id?: string` item; the
    // alignment item tolerates numeric ids (itemId stringifies) — route once.
    aggressiveness: computeAggressiveness(
      /** @type {{ id?: string }} */ (/** @type {unknown} */ (item)),
      worldState,
    ),
  };
}
