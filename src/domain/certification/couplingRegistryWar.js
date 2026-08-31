/**
 * domain/certification/couplingRegistryWar.js — the WAR volume's coupling rows.
 *
 * The 26 rows WR-3 through WR-7 landed, moved here verbatim by CW-0w slice 1 so
 * the registry head stays a schema-and-lookup file while the row estate grows
 * one leaf per volume. Nothing about a row changed in the move: same ids, same
 * order, same frozen shape, same comments.
 *
 * A coupling row records the foreign read, the receipt field that makes it
 * reviewable, and the counterforce reading the same evidence. The registry
 * grows in the same change that lands each cross-layer read.
 *
 * Pure data only: no state, writer, clock, or randomness. Every row constant is
 * re-exported by couplingRegistry.js, so no consumer imports this file directly.
 *
 * @enforced-by tests/domain/couplingRegistry.test.js
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

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
  kinds: ['coalition_entry_priced'],
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
  kinds: ['coalition_joined', 'coalition_refused'],
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
  kinds: ['coalition_expenditure_read'],
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
  kinds: ['coalition_expenditure_read'],
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
  deskAuthority: 'war_coalition_registry',
  kinds: ['coalition_spoils_divided'],
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
  deskAuthority: 'war_coalition_registry',
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

/**
 * WR-6b / CPL-6. W-COIN-3's COFFERS TERM. Coalition expenditure reads the crown's own
 * vault to score how long it can keep paying for the war — an INTERIOR stock priced into
 * a WAR pressure read, through the SAME single `coffersRead` reading warCosts uses, so two
 * surfaces cannot score the same question from two independently written expressions.
 *
 * ⛔ WHY ITS OWN WR-6b GROUP AND NOT A ROW IN WR6_WAR_COALITION_COUPLINGS: that array is
 * pinned at SEVEN rows and every member is asserted `owningWave === 'WR-6'`
 * (couplingRegistry.test.js, "records the seven WR-6 reads"). This read landed with
 * W-COIN-3 and not with the coalition wave, so it takes its own wave letter rather than
 * falsifying either pin. No THIRTEENTH volume prefix is opened by it: `WR` is already
 * chartered and the couplingId shape admits `WR-6b` through its own `\d+[a-z]?` clause.
 *
 * The counterforce is the read itself, and it is a real one: the coffers component is
 * ABSENT unless the purse is OBSERVED, so a dark world scores the frozen five-weight set
 * exactly as before and this coupling cannot speak at all.
 */
export const WR6B_COALITION_COFFERS_COUPLING = couplingRow({
  couplingId: 'CPL-6.INTERIOR_TO_WAR.WR-6b.coalition_coffers',
  pairId: 'CPL-6',
  direction: 'INTERIOR→WAR',
  read: 'src/domain/worldPulse/warCoalitionExpenditure.js#readCoalitionExpenditure',
  receiptField: 'pulseRecord.warCoalitionEvidence[kind=coalition_expenditure_read].{components.coffers.band,components.coffers.source,completeness.coffers}',
  counterforce: 'src/domain/worldPulse/warCoalitionExpenditure.js#readCoalitionExpenditure',
  flags: ['warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled', 'treasuryEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6b',
  intendedDesk: 'trade',
  kinds: ['coalition_expenditure_read'],
});

/** The one WR-6b cross-layer read: the coalition's coffers term (W-COIN-3). */
export const WR6B_WAR_TREASURY_COUPLINGS = Object.freeze([
  WR6B_COALITION_COFFERS_COUPLING,
]);

/**
 * WR-6c / CPL-19. W-SEAT SEAT-4's ANTICIPATED-REACTION CASUS. Before a court takes a major
 * decision it forecasts how the powers that matter will answer, and ONE of the three
 * conditions that can actually hold a decision back is not a belief at all: whether the
 * objecting power holds a live SUBORDINATING COMPACT over the decider. That is TRUE
 * STRUCTURE, read from GRAMMAR's treaty orientation, deliberately NOT believed — a formal
 * compact is a contract, and a casus computed from a stale picture would let a court talk
 * itself out of an obligation it demonstrably has. The belief fog covers the other court's
 * STATE, never the compact between them.
 *
 * ⛔ CHAIR DECLARATION — ODQ §861, THE SEAT-A2 LANDING. The importing leaf
 * `anticipatedReactions.js` reads `beliefMap.js` (INFO) and `treatyOrientation.js`
 * (GRAMMAR), so it had NO free layer home: every family mints an unlicensed pair, and the
 * lane correctly refused to mint the licensing row on its own judgment — a registry row
 * declares a coupling's direction, desk, flags and receipt address, which is a chair
 * declaration and not a walker repair. The chair homed the leaf in INFO: its heaviest
 * substrate is the belief map, and INFO already owns the shape of "derive a court's
 * decision input from beliefs while consulting a grammar vocabulary" (the espionage-career
 * precedent).
 *
 * ⭐ THE COST WAS MEASURED BEFORE IT WAS RULED, BY PROBE AND NOT BY PREDICTION — both
 * candidate homes were placed and the walker run:
 *   INFO home    ⇒ EXACTLY ONE unlicensed pair, GRAMMAR→INFO on the treatyOrientation read
 *                  — this row, and the walker then goes green.
 *   GRAMMAR home ⇒ exactly one the other way, INFO→GRAMMAR on the beliefMap read.
 * The alternative was measured and NOT taken. Recording both is what makes the choice a
 * decision rather than a discovery: the row costs one license either way, so the home was
 * settled on where the module's subject lives, never on which was cheaper.
 *
 * ⛔ WHY WR-6c AND NOT A NEW W-SEAT PREFIX: the WR-6b precedent verbatim. A landing is no
 * place to charter a thirteenth volume prefix, and the honest owner already exists — WR-6
 * is the CALLED-COURT DELIBERATION family (the seat books and learned temperament that
 * answer a call), and an anticipated-reaction forecast is precisely that family's
 * ANTICIPATION arm. It takes its own wave letter because WR-6's array is pinned at seven
 * rows with every member asserted `owningWave === 'WR-6'`; the couplingId shape admits
 * `WR-6c` through its own `\d+[a-z]?` clause, so no prefix is opened.
 * ⚠ THE FUTURE IS RESERVED, AND CHEAPLY: a chartered W-SEAT volume may RE-HOME this row by
 * RENAME ALONE, with no re-licensing — the LICENSE is the chair's act and the prefix is
 * bookkeeping.
 *
 * THE COUNTERFORCE IS REAL AND IT IS `heldBackBy`. A true casus is necessary but NOT
 * sufficient: the power must also read `opposed` AND the court must be confident enough to
 * act on the picture at all, so a formally-bound objector still moves nothing when the
 * forecast is a half-forgotten rumour. Drop that and every hostile neighbour vetoes
 * everything.
 *
 * DARK ⇒ NOTHING: `reactionsLit` reads `foreignSeatEnabled` by name with the strict
 * `=== true` idiom, and every dark path returns the ONE frozen EMPTY array — the same
 * reference every time — so the choke's byte-identity pin survives by construction and this
 * coupling cannot speak at all.
 *
 * ⛔ THE RECEIPT ADDRESS IS STATE-ROOTED, AND THAT WAS EARNED RATHER THAN ASSUMED. The
 * obvious address for a choke pass is the candidate it decorates — but a candidate is
 * in-flight, not state, and `couplingReceiptSample` rejects any root that is neither a state
 * root nor a returned read. The returned-read escape was available and is REFUSED here: that
 * roster is FROZEN and shrink-only (seam SC-9) precisely so a new row cannot hide behind an
 * unsampleable address, and this row would have been the fifth. The held decision genuinely
 * persists: `applyWorldPulse` mints a proposal with `outcome: clone(outcome)`, so the whole
 * `anticipatedReaction` block rides onto `worldState.proposals[].outcome` and is sampleable
 * from state. The pass excludes `state_only` candidates, which is what keeps that branch
 * reachable — a mechanical refresh is restored to `auto` before it ever gets there.
 */
export const WR6C_ANTICIPATED_REACTION_CASUS_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.WR-6c.anticipated_reaction_casus',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/anticipatedReactions.js#reactionOf.holdsCompactOver',
  receiptField: 'worldState.proposals[status=pending].outcome.anticipatedReaction.{heldBy,confidence01,band,casus}',
  counterforce: 'src/domain/worldPulse/anticipatedReactions.js#heldBackBy',
  flags: ['foreignSeatEnabled'],
  owningVolume: 'WAR',
  owningWave: 'WR-6c',
  intendedDesk: 'war',
});

/** The one WR-6c cross-layer read: the anticipated-reaction casus (W-SEAT SEAT-4). */
export const WR6C_SEAT_REACTION_COUPLINGS = Object.freeze([
  WR6C_ANTICIPATED_REACTION_CASUS_COUPLING,
]);

const WR7_ENVOY_FLAGS = Object.freeze([
  'warLayerEnabled',
  'warTerminationEnabled',
  'peaceEngineEnabled',
  'envoyDiplomacyEnabled',
  'npcConsequencesEnabled',
  'routeLifecycleEnabled',
]);

/** WR-7a / CPL-5. An accepted war decision becomes a carried message instead
 * of mutating the hostile edge immediately. Failure to resolve a durable person
 * and lived route is the same-read counterforce: no errand is minted. */
export const WR7_PEACE_DISPATCH_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.peace_dispatch',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/envoyDiplomacy.js#dispatchAcceptedPeaceEnvoy',
  receiptField: 'pulseRecord.envoyEvidence[kind=envoy_departed].{id,errandId,npcId,settlementId,counterpartId,sourceOfferId,state}',
  counterforce: 'src/domain/worldPulse/envoyDiplomacy.js#dispatchAcceptedPeaceEnvoy',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'adjudication',
  deskAuthority: 'envoy_registry',
});

/** WR-7a / CPL-5. Only the exact persisted errand in its home state can carry
 * the accepted decision back into the ordinary war/relationship applicator;
 * every earlier state leaves the war physically live. */
export const WR7_HOME_DELIVERY_COUPLING = couplingRow({
  couplingId: 'CPL-5.GRAMMAR_TO_WAR.WR-7.home_delivery',
  pairId: 'CPL-5',
  direction: 'GRAMMAR→WAR',
  read: 'src/domain/worldPulse/envoyDiplomacy.js#envoyReturnAcceptance',
  receiptField: 'worldState.envoyErrands[state=home].{id,npcId,from,to,offer,acceptance,termSheet,homeTick}; pulseRecord.envoyEvidence[kind=envoy_home].{id,errandId,npcId,settlementId,counterpartId,sourceOfferId,state,termSheetId}',
  counterforce: 'src/domain/worldPulse/envoyDiplomacy.js#envoyReturnAcceptance',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'adjudication',
  deskAuthority: 'envoy_registry',
});

/** WR-7a / CPL-19. A moving envoy may alter its closed departure picture only
 * from a telling that has reached its current position and two beliefs already
 * held there. No arrived telling or no belief picture means no mutation. */
export const WR7_MOVING_PICTURE_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.WR-7.moving_picture',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/envoyDiplomacy.js#envoyRumorPatchFor',
  receiptField: 'worldState.envoyErrands[].{heardRumorIds,snapshot.believedRatioBand,positionRef}',
  counterforce: 'src/domain/worldPulse/envoyDiplomacy.js#envoyRumorPatchFor',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'events',
});

/** WR-7a / CPL-19. An overdue carried message may harden an existing court
 * belief; the exact envoy's return removes only that inference. Both arms name
 * the same errand rather than importing hidden truth about its fate. */
export const WR7_SILENCE_INFERENCE_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.WR-7.silence_inference',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/beliefMap.js#applyEnvoySilenceInference',
  receiptField: 'pulseRecord.envoyEvidence[kind=envoy_silence_inference].{id,errandId,npcId,settlementId,counterpartId,inferenceBasis}; worldState.spatialLedgers.beliefMaps[...].hostilityInference.{kind,errandId,sinceTick}',
  counterforce: 'src/domain/worldPulse/beliefMap.js#clearEnvoySilenceInference',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'divination',
  kinds: ['envoy_silence_inference'],
});

/** WR-7b / CPL-5. Columns and envoys are projected from the same pre-mutation
 * cut; collision selection either returns one codepoint-stable encounter or no
 * encounter. No writer is advanced by this read. */
export const WR7_ENCOUNTER_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.envoy_encounter',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/envoyEncounter.js#selectEnvoyEncounters',
  receiptField: 'pulseRecord.envoyEvidence[kind=envoy_intercepted|envoy_parlaying|envoy_held|interceptor_dilemma].{errandId,encounterId,thirdPartyId,armyId,venueId}',
  counterforce: 'src/domain/worldPulse/envoyEncounter.js#selectEnvoyEncounters',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'war',
  deskAuthority: 'envoy_registry',
  kinds: ['envoy_intercepted', 'interceptor_dilemma'],
});

/** WR-7b / CPL-5. The unexpected door is a separate proactive census over one
 * exact coalition join anchor and the member's own live causes. It never borrows
 * an interception to create the errand. */
export const WR7_SELF_PARLAY_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.self_parlay',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/envoyEncounter.js#censusProactiveSelfParlays',
  receiptField: 'pulseRecord.envoyEvidence[kind=interceptor_parlays_own_edge].{errandId,settlementId,counterpartId,sourceOfferId}',
  counterforce: 'src/domain/worldPulse/envoyEncounter.js#censusProactiveSelfParlays',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'adjudication',
  deskAuthority: 'envoy_registry',
});

/** WR-7b / CPL-5. Each party drafts once from its own complete carried picture;
 * acceptance and refusal are opposite verdicts of this same pure read. */
export const WR7_TWO_PICTURE_PARLAY_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.two_picture_parlay',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/negotiationEvaluation.js#negotiateFromPictures',
  receiptField: 'worldState.envoyErrands[].{negotiationPicture,termSheet}; pulseRecord.envoyEvidence[kind=envoy_terms_agreed|parlay_terms_neither_court_drafted].{errandId,termSheetId,envoyPictureId,interceptorPictureId}',
  counterforce: 'src/domain/worldPulse/negotiationEvaluation.js#negotiateFromPictures',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'adjudication',
  deskAuthority: 'envoy_registry',
});

/** WR-7b / CPL-5. Home arrival turns the exact carried sheet into authoritative
 * clauses. Invalid or absent cargo is the same-read counterforce: no materialized
 * treaty input exists and live war truth is never consulted as a substitute. */
export const WR7_CARRIED_SHEET_COUPLING = couplingRow({
  couplingId: 'CPL-5.GRAMMAR_TO_WAR.WR-7.carried_sheet',
  pairId: 'CPL-5',
  direction: 'GRAMMAR→WAR',
  read: 'src/domain/worldPulse/peaceTerms.js#materializeCarriedTermSheet',
  receiptField: 'worldState.envoyErrands[state=home].termSheet.{id,partyIds,relationshipKey,episodeKey,clauses,agreedTick}; spatialLedgers.treaties[].{sourceTermSheetId,sourceErrandId,sourceEncounterId,signedTick}',
  counterforce: 'src/domain/worldPulse/peaceTerms.js#materializeCarriedTermSheet',
  flags: WR7_ENVOY_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'adjudication',
});

const WR7_PLANT_FLAGS = Object.freeze([
  ...WR7_ENVOY_FLAGS,
  'infoStatecraftEnabled',
  'informationBrokeragesEnabled',
]);

/** WR-7b / CPL-19. A paid envoy-picture plant enters through the one lie writer;
 * the returned one-rung patch and later contradiction/exposure share one lineage. */
export const WR7_ENVOY_PLANT_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.WR-7.envoy_picture_plant',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/informationStatecraft.js#processLies',
  receiptField: 'spatialLedgers.disinfo[plant:*].{liarId,audienceId,subjectId,lineageId}; processLies(...).envoyPicturePatches[].{errandId,pictureId,field,direction,sourceId,lineageId}',
  counterforce: 'src/domain/worldPulse/informationStatecraft.js#processLies',
  flags: WR7_PLANT_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WR-7',
  intendedDesk: 'events',
});

/** WR-7 transport, parlay, carried-authority, and belief couplings in lifecycle order. */
export const WR7_ENVOY_COUPLINGS = Object.freeze([
  WR7_PEACE_DISPATCH_COUPLING,
  WR7_SELF_PARLAY_COUPLING,
  WR7_ENCOUNTER_COUPLING,
  WR7_TWO_PICTURE_PARLAY_COUPLING,
  WR7_HOME_DELIVERY_COUPLING,
  WR7_CARRIED_SHEET_COUPLING,
  WR7_MOVING_PICTURE_COUPLING,
  WR7_ENVOY_PLANT_COUPLING,
  WR7_SILENCE_INFERENCE_COUPLING,
]);

/** WF-1d's three gates, all LANDED: the war layer, the termination reader, and WF-1a's
 * unseating key, which is read BY NAME and strict `=== true` at the join's own seam. */
const WF1D_DISSOLUTION_FALL_FLAGS = Object.freeze([
  'warLayerEnabled',
  'warTerminationEnabled',
  'faithUnseatingEnabled',
]);

/** WF-1d / CPL-23. THE ESTATE'S FIRST FAITH→WAR ROW, and the coupling
 * `DESIGN_FP_FAITH.md` §5-WF-1 declares in terms. A sacred war's founding claim dies when
 * the pinned patron anchor moves; until now the receipt could say only THAT it died. The
 * dissolution read now consults the settlement's own typed fall ring through WF-1a's pure
 * `fallCauseFor` and names WHY the creed lost the seat — a political and social fact about
 * people, never a claim about a god. The counterforce reads the same evidence to author the
 * reader clause, so the token and the sentence cannot disagree. */
export const WF1D_DISSOLUTION_FALL_COUPLING = couplingRow({
  couplingId: 'CPL-23.FAITH_TO_WAR.WF-1d.dissolution_names_the_fall',
  pairId: 'CPL-23',
  direction: 'FAITH→WAR',
  read: 'src/domain/worldPulse/warTermination.js#readWarTerminations.fallCauseFor',
  receiptField: 'pulseRecord.warTerminationReads[].{patronFallCause,reason}',
  counterforce: 'src/domain/worldPulse/warTermination.js#terminationReason.dissolvedClauseFor',
  flags: WF1D_DISSOLUTION_FALL_FLAGS,
  owningVolume: 'WAR',
  owningWave: 'WF-1d',
  intendedDesk: 'war',
});

/** The FAITH×WAR couplings the WF train lands against the war volume. */
export const WF_FAITH_WAR_COUPLINGS = Object.freeze([
  WF1D_DISSOLUTION_FALL_COUPLING,
]);
