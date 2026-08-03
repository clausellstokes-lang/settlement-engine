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

/**
 * WR-5 / CPL-6. The legitimate seat's security, character, and exact covert
 * patron divide the realm and private books used by the four-term war read.
 * The same book can press toward peace or continued war.
 */
export const WR5_SEAT_BOOKS_COUPLING = couplingRow({
  couplingId: 'CPL-6.INTERIOR_TO_WAR.WR-5.seat_books',
  pairId: 'CPL-6',
  direction: 'INTERIOR→WAR',
  read: 'src/domain/worldPulse/warSeatBooks.js#readWarSeatBooks',
  receiptField: 'pulseRecord.warTerminationReads[].{authoritySignature,booksInterest,booksDirection,rulerSecurityBand,rulerLawfulnessBand,rulerMoralityBand,booksReason,booksPublicReason}',
  counterforce: 'src/domain/worldPulse/warSeatBooks.js#readWarSeatBooks',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-5',
  intendedDesk: 'war',
});

/**
 * WR-5 / CPL-6. A signed or refused peace can organize the faction that wanted
 * the opposite decision. An aligned faction writes nothing from the same read;
 * the ordinary faction contest remains the counterforce against an automatic coup.
 */
export const WR5_WAR_DECISION_GRIEVANCE_COUPLING = couplingRow({
  couplingId: 'CPL-6.WAR_TO_INTERIOR.WR-5.war_decision_grievance',
  pairId: 'CPL-6',
  direction: 'WAR→INTERIOR',
  read: 'src/domain/worldPulse/warPoliticalLoop.js#applyWarDecisionPolitics',
  receiptField: 'worldState.factionPairStates[...].incidents[].{type,context.{decisionId,actualAction,desiredAction}}',
  counterforce: 'src/domain/worldPulse/warPoliticalLoop.js#applyWarDecisionPolitics',
  flags: [
    'warLayerEnabled',
    'warTerminationEnabled',
    'factionCompetitionEnabled',
    'memoryWeaveEnabled',
  ],
  owningVolume: 'WAR',
  owningWave: 'WR-5',
  intendedDesk: 'adjudication',
});

/**
 * WR-5 / CPL-5. The offerer's approval is only the first yes: the named target
 * court runs the same four-term war read before the existing peace writer may act.
 */
export const WR5_BILATERAL_PEACE_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-5.bilateral_peace',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
  receiptField: 'readWarPeaceDecision(...).receipt.{decision,actualAction,decidingTerm,bands,reason}',
  counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-5',
  intendedDesk: 'adjudication',
});

/**
 * WR-5 / CPL-21. The current seat accepts or refuses on its own termination
 * evidence, with an exact inherited faction demand overriding either arm.
 */
export const WR5_SEAT_ACCEPTANCE_COUPLING = couplingRow({
  couplingId: 'CPL-21.INTERIOR_TO_GRAMMAR.WR-5.seat_acceptance',
  pairId: 'CPL-21',
  direction: 'INTERIOR→GRAMMAR',
  read: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
  receiptField: 'readWarPeaceDecision(...).receipt.{decision,actualAction,booksDirection,booksInterest,interestServed,inheritedDemand,booksPublicReason}',
  counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-5',
  intendedDesk: 'adjudication',
});

/**
 * WR-5 / CPL-21. Refusing a live peace offer charges the relationship, the
 * refuser's legitimacy, and only actual co-besieging allies; acceptance is the
 * counterforce that resumes the existing peace path without those costs.
 */
export const WR5_REFUSAL_PRICE_COUPLING = couplingRow({
  couplingId: 'CPL-21.GRAMMAR_TO_INTERIOR.WR-5.refusal_price',
  pairId: 'CPL-21',
  direction: 'GRAMMAR→INTERIOR',
  read: 'src/domain/worldPulse/warPeaceRefusal.js#applyWarPeaceRefusal',
  receiptField: 'applyWarPeaceRefusal(...).evidence[].{kind,id,settlementId,counterpartId,thirdPartyId,decision,interestServed}',
  counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
  flags: ['warLayerEnabled', 'warTerminationEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-5',
  intendedDesk: 'adjudication',
});

/** The five WR-5 cross-layer reads, in the wave's decision-flow order. */
export const WR5_WAR_RULING_COUPLINGS = Object.freeze([
  WR5_SEAT_BOOKS_COUPLING,
  WR5_WAR_DECISION_GRIEVANCE_COUPLING,
  WR5_BILATERAL_PEACE_COUPLING,
  WR5_SEAT_ACCEPTANCE_COUPLING,
  WR5_REFUSAL_PRICE_COUPLING,
]);

/** WR-6 / CPL-4. A candidate prices direct and second-order retaliation through
 * its own belief map; the same web may instead support a refusal. */
export const WR6_ALLIANCE_RISK_COUPLING = couplingRow({
  couplingId: 'CPL-4.INFO_TO_WAR.WR-6.alliance_web_risk',
  pairId: 'CPL-4',
  direction: 'INFO→WAR',
  read: 'src/domain/worldPulse/warAllianceRisk.js#readAllianceWebRisk',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_entry_priced].{band,callId,relationshipKey,settlementId,counterpartId,thirdPartyId}',
  counterforce: 'src/domain/worldPulse/warAllianceRisk.js#readAllianceWebRisk',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'war',
});

/** WR-6 / CPL-6. The called court's own seat books and learned temperament
 * answer the call; the same evidence can honestly produce either arm. */
export const WR6_COALITION_BOOKS_COUPLING = couplingRow({
  couplingId: 'CPL-6.INTERIOR_TO_WAR.WR-6.coalition_books',
  pairId: 'CPL-6',
  direction: 'INTERIOR→WAR',
  read: 'src/domain/worldPulse/warCoalitionDecision.js#readCoalitionJoinDecisions',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_joined|coalition_refused].{decision,booksDirection,temperamentDirection,riskBand,callId,relationshipKey}',
  counterforce: 'src/domain/worldPulse/warCoalitionDecision.js#readCoalitionJoinDecisions',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'war',
});

/** WR-6 / CPL-3. People spent since entry are derived from the existing
 * deployment/population books; survival and homecoming are the counter-reading. */
export const WR6_PEOPLE_EXPENDITURE_COUPLING = couplingRow({
  couplingId: 'CPL-3.POP_TO_WAR.WR-6.coalition_people_spent',
  pairId: 'CPL-3',
  direction: 'POP→WAR',
  read: 'src/domain/worldPulse/warCoalitionExpenditure.js#readCoalitionExpenditure',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_expenditure_read].{componentBands.population,componentBands.attrition,componentBands.force,incompleteEvidence,settlementId}',
  counterforce: 'src/domain/worldPulse/warCoalitionExpenditure.js#readCoalitionExpenditure',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'trade',
});

/** WR-6 / CPL-1. Live territorial and attributable home-front degradation are
 * read from their existing owners and never copied into a coalition total. */
export const WR6_TRADE_EXPENDITURE_COUPLING = couplingRow({
  couplingId: 'CPL-1.TRADE_TO_WAR.WR-6.coalition_expenditure',
  pairId: 'CPL-1',
  direction: 'TRADE→WAR',
  read: 'src/domain/worldPulse/warCoalitionExpenditure.js#readCoalitionExpenditure',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_expenditure_read].{componentBands.territory,componentBands.homeFront,incompleteEvidence,settlementId}',
  counterforce: 'src/domain/worldPulse/warCoalitionExpenditure.js#readCoalitionExpenditure',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'trade',
});

/** WR-6 / CPL-1. Coalition settlement turns one aggregate judgment into
 * pairwise material payments and winner shares through existing transfer owners. */
export const WR6_COALITION_SETTLEMENT_TRADE_COUPLING = couplingRow({
  couplingId: 'CPL-1.WAR_TO_TRADE.WR-6.coalition_settlement',
  pairId: 'CPL-1',
  direction: 'WAR→TRADE',
  read: 'src/domain/worldPulse/warCoalitionSettlement.js#planCoalitionSettlement',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_apportionment|coalition_spoils_divided].{coalitionSettlementId,band,allocationBasis,settlementId,counterpartId}',
  counterforce: 'src/domain/worldPulse/warCoalitionSettlement.js#planCoalitionSettlement',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'trade',
});

/** WR-6 / CPL-6. A refusal and an underpaid ally become durable relationship
 * facts; service honored or debt paid is the same-evidence counterforce. */
export const WR6_COALITION_RELATIONSHIP_COUPLING = couplingRow({
  couplingId: 'CPL-6.WAR_TO_INTERIOR.WR-6.coalition_relationship',
  pairId: 'CPL-6',
  direction: 'WAR→INTERIOR',
  read: 'src/domain/worldPulse/relationshipEvolution.js#applyRelationshipPatch',
  receiptField: 'pulseRecord.warCoalitionEvidence[].{kind,settlementId,counterpartId}',
  counterforce: 'src/domain/worldPulse/relationshipEvolution.js#applyRelationshipPatch',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'trade',
});

/** WR-6 / CPL-5. A coalition settlement is aggregate in judgment but closes
 * and pays only bilateral edges; a separate peace leaves all other edges open. */
export const WR6_PAIRWISE_SETTLEMENT_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-6.pairwise_settlement',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/warCoalitionSettlement.js#validateCoalitionSettlementClosures',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_separate_peace].{settlementId,counterpartId,thirdPartyId}; pulseRecord.warCoalitionEvidence[kind=coalition_apportionment|coalition_spoils_divided].{coalitionSettlementId,settlementId,counterpartId}',
  counterforce: 'src/domain/worldPulse/warCoalitionSettlement.js#validateCoalitionSettlementClosures',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6',
  intendedDesk: 'adjudication',
});

/** The seven WR-6 cross-layer reads, in call-to-settlement order. */
export const WR6_WAR_COALITION_COUPLINGS = Object.freeze([
  WR6_ALLIANCE_RISK_COUPLING,
  WR6_COALITION_BOOKS_COUPLING,
  WR6_PEOPLE_EXPENDITURE_COUPLING,
  WR6_TRADE_EXPENDITURE_COUPLING,
  WR6_COALITION_SETTLEMENT_TRADE_COUPLING,
  WR6_COALITION_RELATIONSHIP_COUPLING,
  WR6_PAIRWISE_SETTLEMENT_COUPLING,
]);

export const COUPLING_REGISTRY = Object.freeze([
  WR3_LINEAGE_COUPLING,
  ...WR4_WAR_COST_COUPLINGS,
  ...WR5_WAR_RULING_COUPLINGS,
  ...WR6_WAR_COALITION_COUPLINGS,
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
