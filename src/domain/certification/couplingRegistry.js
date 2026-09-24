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
  WR6B_WAR_TREASURY_COUPLINGS,
  WR6C_SEAT_REACTION_COUPLINGS,
  WR7_ENVOY_COUPLINGS,
  WF_FAITH_WAR_COUPLINGS,
  WMEM_CONCLUDED_WAR_COUPLINGS,
  WSEAT_D10_IRREGULAR_FORCE_COUPLINGS,
} from './couplingRegistryWar.js';
// The first non-WAR leaf (FP wave TR-1). One sibling per volume, as CW-0w slice 1 built
// this family to accept.
import { TR1_CASUS_COMMERCII_COUPLINGS, TR3_BELIEVED_MARKETS_COUPLINGS } from './couplingRegistryTrade.js';
import { GR2_PACT_FORMATION_COUPLINGS, GR3_TERM_FAMILY_COUPLINGS, GR4_BREACH_CREDIBILITY_COUPLINGS, GR5C_RENEGOTIATION_COUPLINGS, GR6_MEDIATION_COUPLINGS } from './couplingRegistryGrammar.js';
import { IN_INFORMATION_COUPLINGS } from './couplingRegistryInfo.js';
// The ESPIONAGE leaf (FP wave ES-1). ES is a wave family OF the INFORMATION program in
// the LAYER map, and a volume of its own in the WAVE map — couplingIds carry the `ES`
// prefix and two lanes building IN-* and ES-* must not serialize on one registry file.
import { ES_ESPIONAGE_COUPLINGS } from './couplingRegistryEspionage.js';
// ENCOUNTERS opens its own leaf on the same concurrency law: the couplingId carries the
// volume prefix ENC and the cars append there, so an ENC lane and an ES lane never
// serialize on one registry file.
import { ENC_ENCOUNTERS_COUPLINGS } from './couplingRegistryEncounters.js';

export {
  ENC2_MEETING_MARK_CONSUME_COUPLING,
  ENC3_MEETING_EXPOSURE_WARINESS_COUPLING,
  ENC3_MEETING_STAGE_INTERIOR_COUPLING,
  ENC_ENCOUNTERS_COUPLINGS,
} from './couplingRegistryEncounters.js';

export {
  TR1_SEVERANCE_PRESSURE_COUPLING,
  TR1_CASUS_COMMERCII_COUPLINGS,
  TR3_BELIEVED_DEARNESS_COUPLING,
  TR3_BELIEVED_MARKETS_COUPLINGS,
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
  GR4C_BREACH_CREDIBILITY_COUPLING,
  GR4_BREACH_CREDIBILITY_COUPLINGS,
  GR5C_BELIEVED_SWING_COUPLING,
  GR5C_DEMAND_NERVE_COUPLING,
  GR5C_RENEGOTIATION_COUPLINGS,
  GR6_INTENT_BROKER_COUPLING,
  GR6_SOFT_GATE_COUPLING,
  GR6_MEDIATION_COUPLINGS,
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
  WR6B_COALITION_COFFERS_COUPLING,
  WR6B_WAR_TREASURY_COUPLINGS,
  WR6C_ANTICIPATED_REACTION_CASUS_COUPLING,
  WR6C_SEAT_REACTION_COUPLINGS,
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
  WF1D_DISSOLUTION_FALL_COUPLING,
  WF_FAITH_WAR_COUPLINGS,
  WMEM_TREATY_AT_SEAL_COUPLING,
  WMEM_SEAL_GRACE_WINDOW_COUPLING,
  WMEM_CONCLUDED_WAR_COUPLINGS,
  WSEAT_D10_RETURN_FORCE_RATIO_COUPLING,
  WSEAT_D10_IRREGULAR_FORCE_COUPLINGS,
} from './couplingRegistryWar.js';

export const COUPLING_REGISTRY = Object.freeze([
  WR3_LINEAGE_COUPLING,
  ...WR4_WAR_COST_COUPLINGS,
  ...WR5_WAR_RULING_COUPLINGS,
  ...WR6_WAR_COALITION_COUPLINGS,
  // W-COIN-3 (2026-08-31): the coalition's COFFERS term, in its own wave letter because
  // WR-6's seven rows are pinned by count and by `owningWave`. It licenses
  // warCoalitionExpenditure.js's read of the INTERIOR treasury leaf.
  ...WR6B_WAR_TREASURY_COUPLINGS,
  ...WR7_ENVOY_COUPLINGS,
  ...TR1_CASUS_COMMERCII_COUPLINGS,
  // FP TR-3 (2026-09-24): the TRADE leaf's second set, beside its first rather than appended
  // (SR-7): the WHERE composer's read of believed dearness, licensing its one INFO→TRADE pair.
  ...TR3_BELIEVED_MARKETS_COUPLINGS,
  ...GR2_PACT_FORMATION_COUPLINGS,
  ...GR3_TERM_FAMILY_COUPLINGS,
  // FP GR-4c (2026-08-12): the GRAMMAR leaf's THIRD set, appended in wave order beside
  // its siblings. One row — the credibility charge a torn-up oath finally costs its
  // breaker — and the producer half of the INFO→GRAMMAR read GR-2's row pre-declared.
  ...GR4_BREACH_CREDIBILITY_COUPLINGS,
  ...IN_INFORMATION_COUPLINGS,
  // FP ES-1 (2026-08-06): the FIFTH volume in this registry, and the first ESPIONAGE
  // rows. Three: the covert mission minting through the estate's one errand spine, the
  // arithmetic borrowing the row vocabulary it used to author, and the covert
  // traveller's hidden-path franchise read.
  ...ES_ESPIONAGE_COUPLINGS,
  // ENC-2 (2026-09-03): the ENCOUNTERS volume's first row — the ladder kernel consuming a
  // chance-meeting mark deposit through its own mintBond writer, licensed here because a
  // tie between two named people is the ladder's subject and the meeting only deposits it.
  ...ENC_ENCOUNTERS_COUPLINGS,
  // FP WF-1d (2026-08-21): the estate's FIRST FAITH→WAR rows. One — the war-dissolution
  // receipt naming the typed patron fall. It rides the WAR leaf rather than opening a
  // FAITH one because its owningVolume IS WAR: the read lives in warTermination.js and
  // the row licenses that file's import of the faith leaf.
  ...WF_FAITH_WAR_COUPLINGS,
  // W-SEAT SEAT-4 (2026-08-31, chair declaration ODQ §861): the anticipated-reaction CASUS,
  // licensing anticipatedReactions.js's GRAMMAR read of treaty orientation.
  // ⛔ APPENDED LAST, NOT FILED NEXT TO WR-6b, AND THE REASON IS A REAL ONE. Its wave letter
  // puts it numerically beside WR-6b, but this list's ORDER is load-bearing: registration
  // order is the legacy first-row tiebreak for `couplingRowFor`. Composed in numeric
  // position it would sit ahead of WR-7 and TAKE the CPL-19 / GRAMMAR→INFO first-row seat
  // from `WR7_SILENCE_INFERENCE_COUPLING` — silently changing what every single-row caller
  // on that pair resolves to. A landing act does not move a legacy tiebreak to tidy an
  // ordinal, so the row appends in LANDING order where it costs nothing. WR-6b had no such
  // conflict: it joined its bucket last wherever it was composed.
  ...WR6C_SEAT_REACTION_COUPLINGS,
  // W-MEM (lane T12, ODQ §834): the Remembrance ledger's two GRAMMAR reads — the treaty
  // that stands for a concluding pair, and the peace-mint window the seal waits out.
  // ⛔ APPENDED AFTER WR-6c, WHICH LEAVES WR-6c'S OWN APPEND-LAST ARGUMENT INTACT. That
  // argument is about ORDER RELATIVE TO WR-7, not about being the literal last line: it
  // exists so WR-6c cannot take the CPL-19 / GRAMMAR→INFO first-row seat from
  // WR7_SILENCE_INFERENCE_COUPLING, and appending behind it preserves that exactly.
  // These two rows cannot take a first-row seat from anyone in any case: their pair and
  // direction is CPL-5 / GRAMMAR→WAR, whose first row is WR7_HOME_DELIVERY_COUPLING,
  // composed well ahead of here — checked rather than assumed, because the tiebreak is a
  // legacy resolution rule and a landing act does not move one to tidy an ordinal.
  ...WMEM_CONCLUDED_WAR_COUPLINGS,
  // W-SEAT D10 (2026-09-05, chair declaration at the §900 desk landing): the returning
  // host's coup verdict reading INTERIOR's irregular-force share. Lane SEAT-78 measured the
  // pair, argued the layer home, and REFUSED to mint the licence itself — a registry row
  // declares a coupling's direction, desk, flags and receipt address, which the walker's own
  // REACH_OWED note reserves to the chair. `WR-6e` is the next free war-side wave letter, on
  // the WR-6b / WR-6c / WR-6d precedent.
  // ⛔ APPENDED LAST, ON THE SAME TIEBREAK ARGUMENT WR-6c AND W-MEM BOTH MAKE, AND CHECKED
  // RATHER THAN ASSUMED: this row's pair and direction is CPL-6 / INTERIOR→WAR, whose legacy
  // first-row seat is held by WR4_INSTITUTION_HOME_FRONT_COUPLING, composed far above. A
  // landing act does not move a legacy tiebreak to tidy an ordinal, so appending here costs
  // nothing and disturbs no single-row caller.
  ...WSEAT_D10_IRREGULAR_FORCE_COUPLINGS,
  // FP GR-6 (2026-09-24): the two mediation rows, licensing mediationPressure.js's read of the
  // war intent ledger and the war opener's read of the broker's pressure. ⛔ APPENDED LAST, on the
  // tiebreak argument WR-6c, W-MEM and WR-6e make: both directions' CPL-5 first-row seats are
  // held by rows composed far above, so this append moves nothing a single-row caller resolves.
  ...GR6_MEDIATION_COUPLINGS,
  // FP GR-5c (2026-09-24): the two renegotiation rows, licensing pactRenewal.js's read of the
  // demander's picture (INFO) and of the court's own strength and posture (INTERIOR). ⛔ APPENDED
  // LAST on the same tiebreak argument: CPL-19 and CPL-21's first-row seats in these directions
  // belong to rows composed far above, so this append moves nothing a single-row caller resolves.
  ...GR5C_RENEGOTIATION_COUPLINGS,
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
