/**
 * domain/certification/couplingRegistry.js — CW-0's growing cross-layer
 * coupling registry: the composing head.
 *
 * Pure data plus pure lookup only: no state, writer, clock, or randomness. A
 * coupling row records the foreign read, the receipt field that makes it
 * reviewable, and the counterforce reading the same evidence. The registry
 * grows in the same change that lands each cross-layer read. Schema v2 permits
 * more than one independently-owned read on the same directional pair while
 * retaining the original first-row lookup for legacy callers.
 *
 * CW-0w slice 1 split the ROWS into per-volume leaves (couplingRegistryWar.js
 * today; one sibling per volume as the FP programs land) and the row SHAPE into
 * couplingRegistrySchema.js. This file keeps the schema version, the
 * composition, and the lookups, and re-exports every row constant by name — so
 * no consumer's import path moved, and the enumerated re-export list below is
 * the registry's public surface.
 *
 * @enforced-by tests/domain/couplingRegistry.test.js
 */

export { COUPLING_REGISTRY_SCHEMA_VERSION } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

import {
  WR3_LINEAGE_COUPLING,
  WR4_WAR_COST_COUPLINGS,
  WR5_WAR_RULING_COUPLINGS,
  WR6_WAR_COALITION_COUPLINGS,
  WR7_ENVOY_COUPLINGS,
} from './couplingRegistryWar.js';
// The first non-WAR leaf (FP wave TR-1). One sibling per volume, as CW-0w slice 1 built
// this family to accept.
import { TR1_CASUS_COMMERCII_COUPLINGS } from './couplingRegistryTrade.js';
import { GR2_PACT_FORMATION_COUPLINGS, GR3_TERM_FAMILY_COUPLINGS } from './couplingRegistryGrammar.js';
import { IN_INFORMATION_COUPLINGS } from './couplingRegistryInfo.js';
// The ESPIONAGE leaf (FP wave ES-1). ES is a wave family OF the INFORMATION program in
// the LAYER map, and a volume of its own in the WAVE map — couplingIds carry the `ES`
// prefix and two lanes building IN-* and ES-* must not serialize on one registry file.
import { ES_ESPIONAGE_COUPLINGS } from './couplingRegistryEspionage.js';

export {
  TR1_SEVERANCE_PRESSURE_COUPLING,
  TR1_CASUS_COMMERCII_COUPLINGS,
} from './couplingRegistryTrade.js';

export {
  GR2_BELIEVED_DEMAND_COUPLING,
  GR2_POSTURE_RESERVE_COUPLING,
  GR2_SHARED_THREAT_COUPLING,
  GR2_PACT_FORMATION_COUPLINGS,
  GR3_FAITH_GRANT_COUPLING,
  GR3_POPULATION_GRANT_COUPLING,
  GR3_MUTUAL_DEFENSE_COUPLING,
  GR3_TERM_FAMILY_COUPLINGS,
} from './couplingRegistryGrammar.js';

// The INFORMATION leaf (FP wave IN-0a). Re-exported by name like every other volume's:
// the docstring above calls the enumerated re-export list "the registry's public surface",
// and a leaf composed into COUPLING_REGISTRY without its constants re-exported would make
// this file the one place a row exists but cannot be named.
export {
  IN0A_PLANT_HANDOFF_COUPLING,
  IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING,
  IN_INFORMATION_COUPLINGS,
} from './couplingRegistryInfo.js';

// The ESPIONAGE leaf (FP wave ES-1), re-exported by name on the same rule.
export {
  ES1_COVERT_MISSION_MINT_COUPLING,
  ES1_HIDDEN_FRANCHISE_COUPLING,
  ES1_MISSION_VOCABULARY_COUPLING,
  ES2_GAUNTLET_DWELL_READ_COUPLING,
  ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING,
  ES3_FLAW_DISTORTION_COUPLING,
  ES3_GRADIENT_AMENDER_COUPLING,
  ES5B_ABSENCE_BENCH_COUPLING,
  ES5C_CAREER_LADDER_COUPLING,
  ES5D_CAREER_CREDIT_COUPLING,
  ES5_DOCTRINE_MORAL_LADDER_COUPLING,
  ES6A_DOUBLE_AGENT_LEAK_COUPLING,
  ESDA_COVERT_RIDER_COUPLING,
  ES_ESPIONAGE_COUPLINGS,
} from './couplingRegistryEspionage.js';

export {
  WR3_LINEAGE_COUPLING,
  WR4_TRADE_HOME_FRONT_COUPLING,
  WR4_HANDS_HOME_FRONT_COUPLING,
  WR4_BELIEF_TRAJECTORY_COUPLING,
  WR4_INSTITUTION_HOME_FRONT_COUPLING,
  WR4_WAR_COST_COUPLINGS,
  WR5_SEAT_BOOKS_COUPLING,
  WR5_WAR_DECISION_GRIEVANCE_COUPLING,
  WR5_BILATERAL_PEACE_COUPLING,
  WR5_SEAT_ACCEPTANCE_COUPLING,
  WR5_REFUSAL_PRICE_COUPLING,
  WR5_WAR_RULING_COUPLINGS,
  WR6_ALLIANCE_RISK_COUPLING,
  WR6_COALITION_BOOKS_COUPLING,
  WR6_PEOPLE_EXPENDITURE_COUPLING,
  WR6_TRADE_EXPENDITURE_COUPLING,
  WR6_COALITION_SETTLEMENT_TRADE_COUPLING,
  WR6_COALITION_RELATIONSHIP_COUPLING,
  WR6_PAIRWISE_SETTLEMENT_COUPLING,
  WR6_WAR_COALITION_COUPLINGS,
  WR7_PEACE_DISPATCH_COUPLING,
  WR7_HOME_DELIVERY_COUPLING,
  WR7_MOVING_PICTURE_COUPLING,
  WR7_SILENCE_INFERENCE_COUPLING,
  WR7_ENCOUNTER_COUPLING,
  WR7_SELF_PARLAY_COUPLING,
  WR7_TWO_PICTURE_PARLAY_COUPLING,
  WR7_CARRIED_SHEET_COUPLING,
  WR7_ENVOY_PLANT_COUPLING,
  WR7_ENVOY_COUPLINGS,
} from './couplingRegistryWar.js';

export const COUPLING_REGISTRY = Object.freeze([
  WR3_LINEAGE_COUPLING,
  ...WR4_WAR_COST_COUPLINGS,
  ...WR5_WAR_RULING_COUPLINGS,
  ...WR6_WAR_COALITION_COUPLINGS,
  ...WR7_ENVOY_COUPLINGS,
  ...TR1_CASUS_COMMERCII_COUPLINGS,
  ...GR2_PACT_FORMATION_COUPLINGS,
  ...GR3_TERM_FAMILY_COUPLINGS,
  ...IN_INFORMATION_COUPLINGS,
  // FP ES-1 (2026-08-06): the FIFTH volume in this registry, and the first ESPIONAGE
  // rows. Three: the covert mission minting through the estate's one errand spine, the
  // arithmetic borrowing the row vocabulary it used to author, and the covert
  // traveller's hidden-path franchise read.
  ...ES_ESPIONAGE_COUPLINGS,
]);

/** @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
const EMPTY_COUPLING_ROWS = Object.freeze([]);
/** @type {Map<string, ReadonlyArray<Readonly<CouplingRegistryRow>>>} */
const ROWS_BY_PAIR_DIRECTION = new Map();
for (const row of COUPLING_REGISTRY) {
  const key = `${row.pairId}\u0000${row.direction}`;
  const prior = ROWS_BY_PAIR_DIRECTION.get(key) || EMPTY_COUPLING_ROWS;
  ROWS_BY_PAIR_DIRECTION.set(key, Object.freeze([...prior, row]));
}

/**
 * Resolve every independently-owned read for one directional pair. The result
 * is stable and frozen; unknown or incomplete keys return one shared empty list.
 *
 * @param {unknown} pairId
 * @param {unknown} direction
 * @returns {ReadonlyArray<Readonly<CouplingRegistryRow>>}
 */
export function couplingRowsFor(pairId, direction) {
  const pair = String(pairId || '');
  const arrow = String(direction || '');
  return ROWS_BY_PAIR_DIRECTION.get(`${pair}\u0000${arrow}`) || EMPTY_COUPLING_ROWS;
}

/**
 * Legacy first-row lookup. When a direction has several independently-owned
 * reads, registration order remains the compatibility tiebreak: WR-3's original
 * CPL-3 row therefore still wins over WR-4's later hands read.
 *
 * @param {unknown} pairId
 * @param {unknown} direction
 * @returns {Readonly<CouplingRegistryRow> | null}
 */
export function couplingRowFor(pairId, direction) {
  return couplingRowsFor(pairId, direction)[0] || null;
}
