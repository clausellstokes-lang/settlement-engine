/**
 * couplingRegistryGrammar.js — the GRAMMAR volume's coupling rows, per the CW-0w
 * per-volume leaf split (WAR and TRADE already have theirs).
 *
 * GR-2 is the first GRAMMAR wave that reads ACROSS a layer boundary, and it does so in
 * three directions at once, because a peacetime pact is by construction a thing built out
 * of other layers' evidence: what a court BELIEVES it lacks (INFORMATION), what its court
 * is DISPOSED to do and what it already owes its neighbour (INTERIOR), and who both courts
 * have reason to fear (WAR). Each direction gets ONE row naming the importer as its read
 * address, because `tests/lint/couplingInclusion.walker.test.js` licenses a cross-layer
 * import by matching `moduleOf(row.read)` against the importer — so a row that named the
 * imported leaf instead would license nothing and the ratchet would still red.
 *
 * THE PAIR ANCHORS ARE THE COUPLINGS VOLUME'S OWN NUMBERS, not new ones: CPL-19
 * (INFO×GRAMMAR), CPL-21 (GRAMMAR×INTERIOR) and CPL-5 (WAR×GRAMMAR) are §4's table
 * verbatim, and the volume already names GR-2 in two of those rows as the wave that would
 * fill them. Minting a fresh pair id would have forked the estate's own map of what
 * touches what — the couplingId shape refuses it outright, which is the guard working.
 *
 * ⚠ EVERY `receiptField` HERE IS STATE-ROOTED, AND THAT WAS NOT THE FIRST DRAFT. The rows
 * originally addressed `advancePeacetimePacts(...).receipts[]` — a RETURNED READ, which
 * `tests/domain/couplingReceiptSample.test.js` cannot sample from persisted state and
 * which its seam SC-9 ratchet counts as debt. That ratchet is shrink-only and reddened
 * immediately, exactly as designed: "a NEW row that hides behind a returned-read address
 * raises it and reds here". The addresses were re-pointed rather than the debt raised,
 * which was possible because this lane genuinely persists its story — the proposal ledger
 * carries the trigger and the transport, the relationship record carries the refusal
 * memory and the trust delta, and the instrument carries the provenance and the lineage.
 * A row that could only have been expressed as a returned read would have been a sign the
 * coupling left no trace, which is a design problem and not a registry one.
 *
 * THE COUNTERFORCE COLUMN IS REAL HERE, not a formality. Every one of these reads has a
 * force and a counterforce inside the SAME module, and in two of the three cases inside
 * the same function: the demand that raises a proposal and the dependency fear that
 * refuses it are scored from one set of numbers, which is the whole design of GR-2's
 * answer. The registry is where that is written down for a reader who has only the row.
 *
 * @enforced-by tests/domain/couplingRegistry.test.js,
 *   tests/lint/couplingInclusion.walker.test.js
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * GR-2 / INFORMATION→GRAMMAR. THE DEMAND IS A BELIEF ON BOTH ENDS. A court's believed
 * scarcity of its neighbour's goods raises a proposal; the same belief machinery supplies
 * the devotion and pull rungs the other two peacetime occasions read. The proposer's
 * OATHBREAKER CREDIBILITY rides the same direction — it is what the responder's reserve
 * charges a lineage that has disavowed before, read through the estate's one credibility
 * reader so GR-4's charge bites here the day it lands.
 *
 * THE COUNTERFORCE is the wrong-market tragedy made legal: both ends are beliefs and
 * neither is checked against the other town's real granary, so a pact CAN be signed for
 * grain the counterparty never had, and the world discovers the mismatch as the next
 * grievance rather than as a validation error.
 */
export const GR2_BELIEVED_DEMAND_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.GR-2.believed_demand',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/pactFormation.js#crossingsFor',
  receiptField: 'spatialLedgers.pactProposals[].{trigger,sheet,openedTick,answerDueTick,transport}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#reserveFor',
  flags: Object.freeze([
    'beliefAxesEnabled',
    'believedConditionsEnabled',
    'believedDevotionEnabled',
    'believedScarcityEnabled',
    'pactFormationEnabled',
  ]),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-2',
  intendedDesk: 'diplomacy',
});

/**
 * GR-2 / INTERIOR→GRAMMAR. THE ANSWER IS THE COURT'S OWN NERVE. SP-C's posture and risk
 * appetite compose the reserve a proposal must clear, and the pair's existing
 * `dependency`/`leverage` relationship axes price THE DEPENDENCY FEAR that can refuse a
 * bargain the demand alone would have signed. The refusal is written back to the same
 * relationship record as a turning point and a banded trust delta — no grievance, no
 * casus, and no ratchet in either direction.
 *
 * THE COUNTERFORCE is named in the row because it is the load-bearing half: a pact that
 * would bind a court too tightly is refused BY THE SAME NUMBERS that invited it, and the
 * band is proven live at both ends rather than merely permitted by arithmetic.
 */
export const GR2_POSTURE_RESERVE_COUPLING = couplingRow({
  couplingId: 'CPL-21.INTERIOR_TO_GRAMMAR.GR-2.posture_reserve',
  pairId: 'CPL-21',
  direction: 'INTERIOR→GRAMMAR',
  read: 'src/domain/worldPulse/pactFormation.js#reserveFor',
  receiptField: 'worldState.relationshipStates[...].{trust,turningPoints}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#answerPactProposal',
  flags: Object.freeze([
    'dispositionChannelsEnabled',
    'pactFormationEnabled',
    'strategicPostureEnabled',
  ]),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-2',
  intendedDesk: 'diplomacy',
});

/**
 * GR-2 / WAR→GRAMMAR. THE THREAT TWO COURTS SHARE. `shared_threat` is the THIRD consumer
 * of WR-6's believed alliance-web risk read, and it consumes it whole — the members, the
 * magnitude and the BAND — rebuilding no walk and re-grading no rung. The war layer also
 * supplies this lane's terminal condition: a war OPENING between courts who wrote
 * something down in peace closes their negotiated clauses with the `broken_by_war` ending
 * and stops the pair forming anything new while it lasts.
 *
 * THE COUNTERFORCE is that closure. The same layer that gives two courts a reason to sign
 * is the layer that can end what they signed, and both halves live in this module.
 */
export const GR2_SHARED_THREAT_COUPLING = couplingRow({
  couplingId: 'CPL-5.WAR_TO_GRAMMAR.GR-2.shared_threat',
  pairId: 'CPL-5',
  direction: 'WAR→GRAMMAR',
  read: 'src/domain/worldPulse/pactFormation.js#crossingsFor',
  receiptField: 'spatialLedgers.treaties[].{provenance,lineage,terms}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#advancePeacetimePacts',
  flags: Object.freeze([
    'pactFormationEnabled',
    'peaceEngineEnabled',
    'warLayerEnabled',
  ]),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-2',
  intendedDesk: 'diplomacy',
});

/** @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const GR2_PACT_FORMATION_COUPLINGS = Object.freeze([
  GR2_BELIEVED_DEMAND_COUPLING,
  GR2_POSTURE_RESERVE_COUPLING,
  GR2_SHARED_THREAT_COUPLING,
]);

/**
 * ── GR-3's THREE ROWS, AND WHY THEY POINT THE OTHER WAY (seam 6) ────────────────────
 *
 * GR-2's rows above all read INTO grammar: belief, posture and the alliance web are other
 * layers' evidence, and `pactFormation.js` is the importer that consumes them. GR-3's are
 * the mirror. It mints a STANDING RIGHT — the seventh executor kind — and the reads that
 * bite are `missionaryAccessFor`, `migrationRightFor`, `laborCompactFor`,
 * `mutualDefenseFor` and their siblings, every one of them consumed by a volume that has
 * not landed yet: FAITH's WF-6, POPULATIONS' POP-5b, and the war layer's own
 * `defensive_pact` reader families.
 *
 * ⚠ SO THESE ARE FORWARD DECLARATIONS, AND THEY SAY SO RATHER THAN PRETENDING OTHERWISE.
 * The inclusion walker licenses a cross-layer import by matching `moduleOf(row.read)`
 * against the IMPORTER, and for a consumer that does not exist there is no importer to
 * match — so `read` names the PRODUCER (the enforcement leaf where the right is read from
 * the ledger) and the row licenses nothing today. That is the point: the corpus's
 * producer/consumer law says a right may not ship with its consumer-side reachability
 * merely unmentioned, and `non_intervention` is the recorded proof of what happens when
 * one does. Named here, the debt is findable; the consuming wave re-points `read` at its
 * own module in ITS commit and the row starts licensing then.
 *
 * THE COUNTERFORCE COLUMN IS HONEST HERE TOO. A granted right is not free to the grantor:
 * every one of these three has its own answering pressure inside the same instrument —
 * the compliance state that frays, and the strain that a resented right banks against the
 * court that granted it. `grantedRightStateFor` is that reading's address.
 */

/**
 * GR-3 / GRAMMAR→FAITH (CPL-14). THE RITE SETTLED BY COMPACT. Five faith rows land in the
 * one canonical catalog and their grant reads expose lawful access, communion, pilgrimage
 * and forsworn suppression. FAITH's WF-6 is the CONSUMER wave — a pointer, never a second
 * author — and its stance lanes read these as lawful access rather than as intrusion.
 *
 * ⚠ LAW ONE BOUNDS THIS COUPLING ABSOLUTELY: it moves believers, believer-share bands and
 * sacred tension, and it never confirms, denies or resolves a divine.
 *
 * THE COUNTERFORCE is inside the same evidence: the host temple reads the same
 * believer-share drift the missionary counts as success as EROSION. Same numbers, other
 * sign — which is why the row names the compliance read rather than a second scorer.
 */
export const GR3_FAITH_GRANT_COUPLING = couplingRow({
  couplingId: 'CPL-14.GRAMMAR_TO_FAITH.GR-3.faith_grants',
  pairId: 'CPL-14',
  direction: 'GRAMMAR→FAITH',
  read: 'src/domain/worldPulse/treatyEnforcement.js#missionaryAccessFor',
  receiptField: 'spatialLedgers.treaties[].{terms,provenance,lineage}',
  counterforce: 'src/domain/worldPulse/treatyEnforcement.js#grantedRightStateFor',
  flags: Object.freeze(['pactFormationEnabled', 'peaceEngineEnabled']),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-3',
  intendedDesk: 'diplomacy',
});

/**
 * GR-3 / GRAMMAR→POP (CPL-17). THE LOCATIO CHARTER. `migration_right` is the instrument
 * behind the permit surface FP-POPULATIONS lights; `labor_compact` colours a production
 * arm in BANDS and never in counts; `settlement_provision` carries founding grain on the
 * existing conserved-stream physics with its direction on the term's own beneficiary.
 *
 * THE COUNTERFORCE is the commons voice: the same arrivals that are labour to a court are
 * pressure to the people already there, and POP owns that arc off the same evidence.
 */
export const GR3_POPULATION_GRANT_COUPLING = couplingRow({
  couplingId: 'CPL-17.GRAMMAR_TO_POP.GR-3.population_grants',
  pairId: 'CPL-17',
  direction: 'GRAMMAR→POP',
  read: 'src/domain/worldPulse/treatyEnforcement.js#migrationRightFor',
  receiptField: 'spatialLedgers.treaties[].{terms,provenance,lineage}',
  counterforce: 'src/domain/worldPulse/treatyEnforcement.js#grantedRightStateFor',
  flags: Object.freeze(['pactFormationEnabled', 'peaceEngineEnabled']),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-3',
  intendedDesk: 'diplomacy',
});

/**
 * GR-3 / GRAMMAR→WAR (CPL-5). THE WRITER THE SURVEY WENT LOOKING FOR. Five reader families
 * have treated a `defensive_pact` RELATIONSHIP edge as support since before the survey, and
 * NO simulation path ever minted one — a label with no terms. `mutual_defense` is the
 * instrument side of it, and `mutualDefenseFor` is its read.
 *
 * ⚠ THE CONSUMER SIDE IS DEFERRED BY NAME, WHICH IS WHAT THIS ROW IS FOR. Not one of
 * `warHomeCosts.js`, `warCapacityReads.js`, `warAllianceRisk.js` or `thirdPartyRansom.js`
 * consults this read yet, and the measured reason is structural rather than lazy:
 * `computeAllyRelief` takes no `tick`, so admitting a treaty-scoped right at that site
 * means threading the clock through war hot paths — a war-owned change with its own
 * verification burden. `tests/domain/peaceTermsGrantTerms.test.js` holds the census as a
 * TRIPWIRE: the day a reader consults `mutualDefenseFor` it reds, and discharging THIS row
 * is what that red asks for.
 *
 * THE COUNTERFORCE is the entanglement read: the same WR-6 alliance-web evidence that
 * recommends the bond prices being dragged into the partner's wars when the call comes.
 */
export const GR3_MUTUAL_DEFENSE_COUPLING = couplingRow({
  couplingId: 'CPL-5.GRAMMAR_TO_WAR.GR-3.mutual_defense',
  pairId: 'CPL-5',
  direction: 'GRAMMAR→WAR',
  read: 'src/domain/worldPulse/treatyEnforcement.js#mutualDefenseFor',
  receiptField: 'spatialLedgers.treaties[].{terms,provenance,lineage}',
  counterforce: 'src/domain/worldPulse/treatyEnforcement.js#grantedRightStateFor',
  flags: Object.freeze(['pactFormationEnabled', 'peaceEngineEnabled', 'warLayerEnabled']),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-3',
  intendedDesk: 'diplomacy',
});

/** @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const GR3_TERM_FAMILY_COUPLINGS = Object.freeze([
  GR3_FAITH_GRANT_COUPLING,
  GR3_POPULATION_GRANT_COUPLING,
  GR3_MUTUAL_DEFENSE_COUPLING,
]);

/**
 * GR-4c / INFORMATION→GRAMMAR (CPL-19). THE OATH THAT FINALLY COSTS SOMETHING — and the
 * row GR-2's own leaf pre-declared above, in as many words: the proposer's oathbreaker
 * credibility "read through the estate's one credibility reader so GR-4's charge bites
 * here the day it lands." This is that day. A torn-up oath — the DM's open repudiation or
 * an heir's disavowal — now CHARGES the breaking court's credibility stock at the act,
 * banded by the severity GR-4a already graded, closing a seam where the reader chain had
 * waited since GR-2 with no producer on the other side.
 *
 * ⚠ THE PAIR IS CROSS-LAYER EVEN THOUGH BOTH MODULES SHARE A DIRECTORY, and that is
 * exactly why this row exists. The inclusion walker resolves layers from frozen module
 * SETS matched by regex, never from directories: `treatyBreach.js` is GRAMMAR and
 * `informationStatecraft.js` is INFO. A compile draft argued the import was same-layer and
 * owed nothing; the measurement refuted it. A directory is not a layer.
 *
 * THE COUNTERFORCE is where the charge is actually spent: `reserveFor` prices a proposer's
 * disavowal history into the reserve a peacetime pact must clear, so the same number that
 * records the breach is the number a future counterparty refuses on. Force and
 * counterforce read one stock from opposite ends, which is what this column is for.
 */
export const GR4C_BREACH_CREDIBILITY_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.GR-4c.breach_credibility',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/treatyBreach.js#repudiateTreaty',
  receiptField: 'spatialLedgers.credibility[].{score,lastUpdateTick,holder}',
  counterforce: 'src/domain/worldPulse/pactFormation.js#reserveFor',
  flags: Object.freeze(['oathHolderEnabled', 'infoStatecraftEnabled']),
  owningVolume: 'GRAMMAR',
  owningWave: 'GR-4c',
  intendedDesk: 'diplomacy',
});

/** @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const GR4_BREACH_CREDIBILITY_COUPLINGS = Object.freeze([GR4C_BREACH_CREDIBILITY_COUPLING]);
