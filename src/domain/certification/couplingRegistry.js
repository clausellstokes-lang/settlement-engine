/**
 * domain/certification/couplingRegistry.js — CW-0's growing cross-layer
 * coupling registry.
 *
 * Pure data plus pure lookup only: no state, writer, clock, or randomness. A
 * coupling row records the foreign read, the receipt field that makes it
 * reviewable, and the counterforce reading the same evidence. The registry
 * grows in the same change that lands each cross-layer read. Schema v2 permits
 * more than one independently-owned read on the same directional pair while
 * retaining the original first-row lookup for legacy callers.
 */

export const COUPLING_REGISTRY_SCHEMA_VERSION = 2;

/**
 * @typedef {Object} CouplingRegistryRow
 * @property {string} couplingId
 * @property {string} pairId
 * @property {string} direction
 * @property {string} read
 * @property {string} receiptField
 * @property {string} counterforce
 * @property {ReadonlyArray<string>} flags
 * @property {string} owningVolume
 * @property {string} owningWave
 * @property {string} intendedDesk
 */

/**
 * Freeze one row and its flag list together. A coupling row is evidence, not a
 * runtime switchboard, so callers may inspect it but can never retune it.
 *
 * @param {CouplingRegistryRow} row
 * @returns {Readonly<CouplingRegistryRow>}
 */
function couplingRow(row) {
  return Object.freeze({ ...row, flags: Object.freeze([...row.flags]) });
}

/**
 * WR-3 / CPL-3. The lineage claim and kinship bond are two signs over the same
 * memoized parent-child evidence read. Positive claims persist through the
 * ordinary reason receipt. A suppressed score cannot truthfully enter that
 * ledger, so the direct read's suppression receipt is the registry field.
 */
export const WR3_LINEAGE_COUPLING = couplingRow({
  couplingId: 'CPL-3.POP_TO_WAR.WR-3.lineage',
  pairId: 'CPL-3',
  direction: 'POP→WAR',
  read: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.lineageClaimOf',
  receiptField: 'lineageClaimOf(...).suppression.receipt',
  counterforce: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.kinshipBondOf',
  flags: Object.freeze([
    'demographicsEnabled',
    'lineageClaimEnabled',
    'peaceEngineEnabled',
    'warLayerEnabled',
  ]),
  owningVolume: 'WAR',
  owningWave: 'WR-3',
  intendedDesk: 'war',
});

/**
 * WR-4 / CPL-1. Route degradation and lost markets are two trade-side signs
 * inside the same home-front read. A quiet/preserved result is their
 * counterforce, derived by the same function from the same source evidence.
 */
export const WR4_TRADE_HOME_FRONT_COUPLING = couplingRow({
  couplingId: 'CPL-1.TRADE_TO_WAR.WR-4.home_front_trade',
  pairId: 'CPL-1',
  direction: 'TRADE→WAR',
  read: 'src/domain/worldPulse/warCosts.js#readWarHomeFront',
  receiptField: 'pulseRecord.warTerminationReads[].homeFrontComponents.{roads,markets}.{band,stateRead}',
  counterforce: 'src/domain/worldPulse/warCosts.js#readWarHomeFront',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-4',
  intendedDesk: 'trade',
});

/**
 * WR-4 / CPL-3. The attacker's own conscript share of conserved deployed
 * population (aggregate minus allied/vassal source levies) is the hands-at-home
 * cost; a quiet hands band is the opposite reading of that same deployment bank.
 */
export const WR4_HANDS_HOME_FRONT_COUPLING = couplingRow({
  couplingId: 'CPL-3.POP_TO_WAR.WR-4.home_front_hands',
  pairId: 'CPL-3',
  direction: 'POP→WAR',
  read: 'src/domain/worldPulse/warCosts.js#readWarHomeFront',
  receiptField: 'pulseRecord.warTerminationReads[].homeFrontComponents.hands.{band,stateRead}',
  counterforce: 'src/domain/worldPulse/warCosts.js#readWarHomeFront',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-4',
  intendedDesk: 'events',
});

/**
 * WR-4 / CPL-4. Improving, worsening and even trajectories are all readings of
 * consecutive believed balance bands. Truth is retained only for the private
 * misread receipt and never substitutes for the court's behavioral evidence.
 */
export const WR4_BELIEF_TRAJECTORY_COUPLING = couplingRow({
  couplingId: 'CPL-4.INFO_TO_WAR.WR-4.believed_trajectory',
  pairId: 'CPL-4',
  direction: 'INFO→WAR',
  read: 'src/domain/worldPulse/warCosts.js#evaluateWarCostTrajectory',
  receiptField: 'pulseRecord.warTerminationReads[].{believedBalanceBand,truthBalanceBand,trajectory,trajectoryMisread}',
  counterforce: 'src/domain/worldPulse/warCosts.js#evaluateWarCostTrajectory',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-4',
  intendedDesk: 'war',
});

/**
 * WR-4 / CPL-6. Institution shells formed during a deployment make the
 * interior cost legible; an operational/quiet result comes from the same shell
 * census. Structural degradation belongs on events, never adjudication.
 */
export const WR4_INSTITUTION_HOME_FRONT_COUPLING = couplingRow({
  couplingId: 'CPL-6.INTERIOR_TO_WAR.WR-4.home_front_institutions',
  pairId: 'CPL-6',
  direction: 'INTERIOR→WAR',
  read: 'src/domain/worldPulse/warCosts.js#readWarHomeFront',
  receiptField: 'pulseRecord.warTerminationReads[].homeFrontComponents.institutions.{band,stateRead}',
  counterforce: 'src/domain/worldPulse/warCosts.js#readWarHomeFront',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-4',
  intendedDesk: 'events',
});

/** The four WR-4 cross-layer reads, in coupling-map order. */
export const WR4_WAR_COST_COUPLINGS = Object.freeze([
  WR4_TRADE_HOME_FRONT_COUPLING,
  WR4_HANDS_HOME_FRONT_COUPLING,
  WR4_BELIEF_TRAJECTORY_COUPLING,
  WR4_INSTITUTION_HOME_FRONT_COUPLING,
]);

export const COUPLING_REGISTRY = Object.freeze([
  WR3_LINEAGE_COUPLING,
  ...WR4_WAR_COST_COUPLINGS,
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
