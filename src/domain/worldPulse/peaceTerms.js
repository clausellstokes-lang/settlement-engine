/**
 * domain/worldPulse/peaceTerms.js — W-PEACE-2: THE PRICE OF PEACE
 * (DESIGN_PEACE_ENGINE.md §11 term catalog, §12 compliance, §13 composability,
 * §15 prize ranking + term limits).
 *
 * When a war winds down through the EXISTING sue-for-peace path (a deployment
 * stamped `recalled.cause` = 'sue_for_peace'* by the strategy chooser or the
 * W-PEACE-1 sueForPeaceOrder decree), the VICTOR — the party its own belief map
 * ranks stronger at the table — mints a TERM BUDGET from its BELIEVED advantage
 * (readBeliefStrength, never truth: a fog-deceived victor over/under-spends,
 * §15.1), APPRAISES the loser's portfolio through its own lens (scarcity,
 * archetype, threat — §15.1's top-three rule), and drafts DURATION-CAPPED terms
 * (§15.2 — perpetual extraction is structurally unrepresentable: every stream/
 * status term REQUIRES an expiresTick) into a conditionally-materialized treaty
 * ledger. Terms EXECUTE through existing machinery (tribute = a conserved
 * transfer, never minted; compelled alliance = the relationship-overlay nudge;
 * demilitarization = a readiness ceiling the mobilization reads consult) and
 * accrue per-term COMPLIANCE that evolves under FOG (a distant, poorly-informed
 * victor can be cheated — §12.2), the strain feeding the loser's resentment
 * (§12.3 / §5 revanchism) and a detected default MINTING the warReasons
 * treaty_default casus (§12.4 — closing W-PEACE-1's registration seam).
 *
 * THE WRITER FAMILY (THE DECOMPOSITION WAVE, war tranche, file 2 of 4, under
 * R-BLD-4's writer-family reading and R-BLD-6's ratchet direction). THIS FILE IS
 * THE HEAD: the one mover (`advanceTreaties`), the two MINTS that author the
 * signed-treaty news beat, and the one boundary that stamps AUTHORITY CLOCKS onto
 * a carried sheet (`materializeCarriedTermSheet`). Nothing else writes a treaty.
 * The pure leaves it composes:
 *   peaceTermsCatalog      the typed vocabulary — tuning, TERM_CATALOG, labels
 *   peaceTermsPrimitives   rounding, coercion, the strict validators, the pair key
 *   peaceTermsAppraisal    §15 the victor's own lens (belief, never truth)
 *   peaceTermsDrafting     §15.2 ranked assets + budget → duration-capped terms
 *   peaceTermsCarriedSheet WR-7b the authority-neutral artifact + its validator
 *   peaceTermsGraph        adjacency, real edge keys, the broker, the peace incident
 *   peaceTermsCoalition    §7 who besieged whom, the congress, the peel read
 *   peaceTermsOverlay      every E1b/E1c relationship write, and only these
 *   peaceTermsDocument     §13 the treaty as a legible document + the ledger reads
 *   peaceTermsSale         WR-10 THE VICTOR-FREE MINT — the third transport into this
 *                          instrument, for a treaty with no war in it. It is the ONLY
 *                          family member NOT re-exported from this head, and that is
 *                          deliberate rather than an omission: a re-export would draw it
 *                          into this file's 35-module import cycle, and the market
 *                          composer that calls it must stay outside that cycle (the
 *                          measured reason is recorded in satellitesLedger.js's header).
 *                          Its own header carries the CR-WR10-E measurement: the mint
 *                          FUNCTIONS here are already victor-free, but their only road is
 *                          PASS 1's sue_for_peace loop, which a peacetime sale can never
 *                          enter. Forking a second terms writer was the named defect, so
 *                          the sale mint composes THIS family's catalog, primitives and
 *                          clock, and nothing else authors a sale treaty.
 * The public surface is UNCHANGED: every name this module has ever exported is
 * still exported here, so no consumer import path moved.
 *
 * CONSTITUTIONAL POSTURE (design §8 + the wave brief), identical to W-PEACE-1:
 *   - GATE: peaceCausalActive(worldState) — warLayerEnabled AND the virtual
 *     peaceEngineEnabled, both fail-closed. Absent ⇒ immediate no-op: zero
 *     forks, zero ledger keys, byte-identical (the peace-causal dormancy golden,
 *     extended to fence the treaties ledger, proves it).
 *   - DETERMINISTIC: no rng — the budget, ranking, and compliance are READS, not
 *     rolls (the §H loaded draw that produced the peace is the existing
 *     settlementStrategy softmax; the treaty is its bounded consequence).
 *   - CONSERVATION: material terms move value on a MATCHED credit/debit — the
 *     victor gains exactly what the loser loses; tribute never mints.
 *   - Ledger writes ride getSpatialLedger/setSpatialLedger/dropSpatialLedger
 *     (drop-when-empty at every level; zero eager first-paint bytes).
 *
 * WAVE-3 SEAMS (rendered/negotiated later — NOT this wave): treaties-as-documents
 * rendering, coalition negotiation + separate exits, the cross-pressure mediation
 * table. puppet_seat (the corruption-web foreign-grip feed) and disclosure (the
 * M9b compelled-intel feed) ship as TYPED registration seams — minted + recorded,
 * executor documented-unlanded (the W-PEACE-1 treaty_default/corruption_exposed
 * idiom), fed when those upstreams land. The deeper economic CONSUMPTION of a
 * transfer (domestic shortage from a resource share; war-support credit) and the
 * differential faction-strain feed for W-DOCTRINE-4 are recorded (per-term
 * burden01) and seam-noted here, integrated there.
 */

import { peaceCausalActive } from './warReasons.js';
import { setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
// THE TERMS THAT BITE. The three enforcement READS (readiness_cap · war_block ·
// occupation_hold) live in a dependency-free leaf so the war-layer consumers can
// consult them: this module imports warReasons' gate, and warReasons reaches
// mobilization through corruptionWeb/settlementPolitics, so a consumer importing
// THIS module would close a cycle. Same cure as sacredClaim.faithProximityOf. The
// historic names are re-exported at the bottom, so callers and the battery are
// untouched. `streamInstallmentFraction` is the stream terms' per-tick draw.
import {
  treatyLedgerOf, demilitarizationCapFor, treatyBlocksWar, occupationHoldFor,
  streamInstallmentFraction,
} from './treatyEnforcement.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from './treatyClock.js';
// THE ONE ORIENTATION READER (chair ruling CR-WR10-G) — who gives, who receives, and
// separately who OWES. WR-10 mints treaties with a seller and a buyer and no war in
// them, so "the loser" stopped being a field this file may read directly.
import { treatyOrientationOf } from './treatyOrientation.js';
import { dispositionTreatyLearningActive, treatyDispositionDeltas, withTreatyDispositionDeltas } from './treatyDisposition.js';
import { thresholdFactorOf } from './dispositionProfile.js';
// THE MATERIAL EXECUTOR: a stream term's installment moves REAL granary months
// through the conserved sink-only primitive, applied by the existing single
// food applicator. See treatyTransfer.js for why grain is the honest denomination.
import { computeTreatyGrainDraw, applyTreatyFoodDeltas, freshestSettlement } from './treatyTransfer.js';
// WR-10 — THE CONVEYANCE EXECUTOR. A sovereignty_transfer is `stream:false`, so it
// fires ONCE at mint (the compelled_alliance precedent) rather than in the per-tick
// walk. It is invoked from the mint LOOP rather than from inside applyMintEffects,
// deliberately: that closure is defined TWICE — once per mint road — and an arm added
// inside it would be two spellings of one law, with the carried-sheet road free to
// drift from the live-appraisal one. The loop is where both roads meet.
import { executeTreatyConveyances } from './sovereigntyTransfer.js';
// GR-1 — THE SIGNATURE LINE. The one writer of `sworn`, stamped at the mint loop where
// both roads meet. Dark ⇒ the record gains no key (drop-when-absent, T4).
import { stampSworn } from './oathHolder.js';
// GR-0 — THE LIFECYCLE VOICE. The two moments this mover has always executed in silence:
// the prune that retires a spent instrument, and the tick a court's OBSERVED compliance
// first crosses out of honored. Composition lives entirely in the leaf, so the head pays
// four effective lines for the whole wave and the beats stay unit-testable without it.
import { treatyDefaultDetectedBeats, treatyLapsedBeats, treatyLifecycleVoiceActive } from './treatyLifecycleVoice.js';
import { stablePart } from './stablePart.js';
import { buildPressureSummary, settlementStrength } from './relationshipEvolution.js';
import { readBeliefRelationship } from './beliefMap.js';
import { buildThreatByCid } from './martialReadiness.js';
// The pair's faith×alignment proximity read — owned by sacredClaim.js (a pure leaf) so the
// war side can read it too without closing a cycle back through this module.
import { faithProximityOf } from './sacredClaim.js';
import { relationshipKeyFromEdge, normalizeRelationshipType } from './relationshipState.js';
import { deepClone } from '../clone.js';
import { clamp01 } from '../../kernel/math.js';
import { coalitionLedgerActive, readCoalitionExpenditure } from './warCoalitionExpenditure.js';
import { joinAnchorOf } from './warCoalitionLedger.js';
import { applyCoalitionReimbursement, applyCoalitionSettlement } from './warCoalitionSettlement.js';

// ── THE FAMILY (see the header) ─────────────────────────────────────────────
import { absorbWarEndIntoStandingPact } from './pactAmendment.js';
import {
  COALITION_BETRAYAL_CHARACTER_TUNING, PEACE_TERMS_TUNING, TERM_CATALOG,
  TERM_FAMILIES, TERM_TYPES, termLabel,
} from './peaceTermsCatalog.js';
import {
  nonNegativeInteger, rankState, recordOf, round4, sortedLedger, explicitText,
  treatyPairKey,
} from './peaceTermsPrimitives.js';
import {
  alignmentPress, alignmentPressFromInput, appraiseLoserPortfolio,
  appraiseLoserPortfolioFromInputs, believedAdvantage, believedAdvantageFromInputs,
  evolveCompliance, resolveVictor, termBudgetFor, victorMonitorReach,
} from './peaceTermsAppraisal.js';
import { draftReceipt, draftTerms, signingReason } from './peaceTermsDrafting.js';
import {
  CARRIED_TERM_SHEET_SCHEMA_VERSION, carriedClauseFromDraft, normalizeCarriedTermSheet,
} from './peaceTermsCarriedSheet.js';
import {
  avgTieStrength, buildAdjacency, findCrossPressuredMediator, loserAllyStrength,
  recentSueForPeaceIncident,
} from './peaceTermsGraph.js';
import {
  chooseCoalitionMode, coBesiegersOf, coalitionBetrayalCharacterRead,
  coalitionPeaceContext, coalitionSeparatePeaceEvidence, coalitionShares,
  explicitCongressPlan, persistedCoalitionPeaceContext,
} from './peaceTermsCoalition.js';
import {
  accrueBetrayal, accrueMediationTrust, accrueStrainResentment,
  markCoalitionSeparatePeace, nudgeCompelledAlliance,
} from './peaceTermsOverlay.js';
import {
  fracturesAbandoning, frayingTermOf, treatiesForPair, treatyDocument,
  treatyDocumentsForSettlement, treatyFrayingSummary,
} from './peaceTermsDocument.js';

// THE TYPE SURFACE IS PART OF THE PUBLIC SURFACE. Every typedef this module used
// to declare is re-declared here as an alias onto the leaf that now owns it, so a
// consumer's `import('./peaceTerms.js').TreatyDocument` keeps resolving. Dropping
// one is a silent break: it costs the consumer its types and lands NEW strict
// errors on a file outside this family (display/treatyDocument.js caught exactly
// that during this split).
/** @typedef {import('./peaceTermsCatalog.js').TermSpec} TermSpec */
/** @typedef {import('./peaceTermsCatalog.js').AssetClass} AssetClass */
/** @typedef {import('./peaceTermsCatalog.js').AppraisedAsset} AppraisedAsset */
/** @typedef {import('./peaceTermsCatalog.js').TermRecord} TermRecord */
/** @typedef {import('./peaceTermsCatalog.js').TreatyRecord} TreatyRecord */
/** @typedef {import('./peaceTermsCatalog.js').TreatyLedger} TreatyLedger */
/** @typedef {import('./peaceTermsDocument.js').TreatyTermView} TreatyTermView */
/** @typedef {import('./peaceTermsDocument.js').TreatyDocument} TreatyDocument */

// ── The carried sheet's ONE authority boundary ──────────────────────────────

/**
 * Materialize an agreed carried sheet into the existing treaty-record shape.
 * Only this boundary stamps authority clocks. The sheet is never re-appraised
 * and no current route, front, settlement, or holding can veto its odd terms.
 * @param {{ termSheet:unknown, homeTick:unknown }} args
 * @returns {TreatyRecord | null}
 */
export function materializeCarriedTermSheet({ termSheet, homeTick }) {
  const sheet = normalizeCarriedTermSheet(termSheet);
  const mintedTick = nonNegativeInteger(homeTick);
  if (!sheet || mintedTick == null || mintedTick < Number(sheet.agreedTick)) return null;
  const victorId = String(sheet.victorId);
  const loserId = String(sheet.loserId);
  /** @type {TermRecord[]} */
  const terms = /** @type {Array<Record<string, unknown>>} */ (sheet.clauses).map((clause) => {
    const type = String(clause.type);
    const spec = TERM_CATALOG[type];
    const magnitude = Number(clause.magnitude);
    const durationTicks = Number(clause.durationTicks);
    /** @type {TermRecord} */
    const term = {
      type,
      family: String(clause.family),
      magnitude,
      mintedTick,
      expiresTick: mintedTick + durationTicks,
      weightSpent: Number(clause.weightSpent),
      complianceState: 'honored',
      trueState: 'honored',
      burden01: Number(clause.burden01),
      receipt: draftReceipt(type, {
        assetClass: /** @type {AssetClass} */ ('treasury'),
        termType: type,
        value: 0,
        ...(clause.good ? { good: String(clause.good) } : {}),
      }, durationTicks / CURRENT_TREATY_TICKS_PER_YEAR, magnitude),
    };
    if (clause.good) term.good = String(clause.good);
    if (clause.seam === true) term.seam = true;
    // WR-10: the conveyed settlement survives materialization. Dropping it here would
    // mint a treaty whose cession clause named no property — the writer would refuse
    // it, and the refusal would look like the world having moved rather than like the
    // boundary having eaten the object.
    if (clause.assetId) term.assetId = String(clause.assetId);
    if (spec.stream) { term.deliveredToVictor = 0; term.extractedFromLoser = 0; }
    return term;
  });
  return {
    parties: [victorId, loserId],
    victorId,
    loserId,
    mintedTick,
    budgetGranted: Number(sheet.budgetSpent),
    budgetSpent: Number(sheet.budgetSpent),
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
    terms,
    complianceState: 'honored',
    receipts: [],
    sourceTermSheetId: String(sheet.id),
    sourceErrandId: String(sheet.errandId),
    sourceEncounterId: String(sheet.encounterId),
    sourceRelationshipKey: String(sheet.relationshipKey),
    sourceEpisodeKey: String(sheet.episodeKey),
    sourcePictureIds: { .../** @type {Record<string, string>} */ (sheet.pictureIds) },
    termsAgreedTick: Number(sheet.agreedTick),
    signedTick: mintedTick,
  };
}

// ── The mover ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PeaceTermsAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<Record<string, unknown>>} [coalitionEvidence]
 * @property {Array<{id:string, channel:'diplomatic', outcome:'win'|'loss', magnitude?:number}>} [dispositionDeltas]
 * @property {Array<Record<string, unknown>>} [settlementUpdates] the tick's pending
 *   per-settlement writes, with this tick's conserved tribute/reparations/restitution/
 *   resource_share installments folded in. Present only when grain actually moved.
 */

/**
 * Advance the treaty ledger one tick. DETERMINISTIC; gate absent ⇒ immediate
 * no-op. Two passes: (1) MINT — a treaty for each war winding down via the
 * sue-for-peace path this tick (a fresh `recalled.cause` = sue_for_peace* stamp
 * the war layer has not yet consumed); (2) ADVANCE — execute installments, evolve
 * compliance under fog, accrue strain → resentment (§12.3 E1b seam), mark
 * detected defaults (feeding warReasons treaty_default), and expire/prune terms.
 * Persist only on real change (serialize-compare; drop-when-empty).
 *
 * @param {{ snapshot: { byId?: Map<string, Record<string, unknown>>,
 *                       regionalGraph?: { edges?: Array<Record<string, unknown>> } },
 *           worldState: Record<string, unknown>,
 *           settlementUpdates?: Array<Record<string, unknown>>,
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           pIndex?: Record<string, unknown> | null,
 *           tick: number, now?: unknown }} args
 * @returns {PeaceTermsAdvanceResult}
 */
export function advanceTreaties({ snapshot, worldState, settlementUpdates = [], graph, pIndex = null, tick, now = null }) {
  // ── DORMANCY GATE (§8): absent ⇒ an immediate no-op. No key, no read. ──
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { worldState, changed: false, newsEntries: [] };
  }

  const prevLedger = treatyLedgerOf(worldState);
  const edges = (graph?.edges && Array.isArray(graph.edges) ? graph.edges : null)
    || (Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : []);
  const threatByCid = buildThreatByCid(snapshot, worldState);

  /** @type {Map<string, number>} */
  const strengthCache = new Map();
  const truthFor = (/** @type {string} */ id) => {
    if (strengthCache.has(id)) return /** @type {number} */ (strengthCache.get(id));
    const item = snapshot?.byId?.get?.(id);
    const s = item ? settlementStrength(item, buildPressureSummary(pIndex, id)) : 0;
    strengthCache.set(id, s);
    return s;
  };

  // Adjacency (for the loser's ally-network appraisal + the resentment edge key).
  const adjacency = buildAdjacency(edges);

  /** @type {TreatyLedger} */
  const nextLedger = {};
  for (const key of Object.keys(prevLedger || {})) nextLedger[key] = deepClone(/** @type {TreatyRecord} */((prevLedger || {})[key]));

  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  const coalitionLit = coalitionLedgerActive(worldState);
  /** @type {Array<Record<string, unknown>>} */
  const coalitionEvidence = [];
  /** @type {Array<Record<string, unknown>>} */
  const congressClosures = [];
  /** @type {Array<{id:string, channel:'diplomatic', outcome:'win'|'loss', magnitude?:number}>} */
  const dispositionDeltas = []; const dispositionChannelsActive = dispositionTreatyLearningActive(worldState);
  const lifecycleVoiceLit = treatyLifecycleVoiceActive(worldState);
  let workingState = worldState;
  let workingSettlementUpdates = settlementUpdates;
  // The tick's conserved granary movements, accumulated across every stream term and
  // folded onto settlementUpdates ONCE at the end (the generosity mover's idiom): a
  // loser paying two victors debits a single, ordered running total rather than two
  // independent draws that could each believe the whole granary was theirs to take.
  /** @type {Map<string, number>} */
  const foodDeltas = new Map();

  // ── PASS 1: MINT from a war just ended by a NEGOTIATED PEACE. The DURABLE,
  // reliable signal is the relationship overlay — an edge that has DE-ESCALATED
  // off 'hostile' (the sue-for-peace label change, confirmed through the existing
  // proposal machinery) carrying a fresh 'sue_for_peace' incident. The transient
  // deployment recall is NOT the trigger: the deployment and the label change fall
  // out of sync (the army marches home ticks before the court signs the peace, and
  // the war layer consumes the recall before this late mover runs), so the recorded
  // incident is the authoritative "this war ended by treaty" mark. A short window
  // (the confirmed peace can land a tick or two after the beat) + the live-treaty
  // check keep it mint-once per war.
  const relStates = /** @type {Record<string, { relationshipType?: unknown, recentIncidents?: Array<{ type?: unknown, tick?: unknown, outcomeId?: unknown }> }>} */ (
    workingState.relationshipStates && typeof workingState.relationshipStates === 'object' ? workingState.relationshipStates : {});
  /** @type {Set<string>} */
  const mintedThisPair = new Set();
  for (const rawEdge of edges) {
    const a = rawEdge?.from != null ? String(rawEdge.from) : '';
    const b = rawEdge?.to != null ? String(rawEdge.to) : '';
    if (!a || !b || a === b) continue;
    const relationshipKey = relationshipKeyFromEdge(rawEdge);
    const rel = relStates[relationshipKey];
    if (!rel) continue;
    if (normalizeRelationshipType(String(rel.relationshipType || '')) === 'hostile') continue; // the war has NOT ended
    const peaceIncident = recentSueForPeaceIncident(rel.recentIncidents, tick);
    if (!peaceIncident) continue;                                                // no fresh negotiated peace here
    const unordered = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (mintedThisPair.has(unordered)) continue;                                 // one treaty per unordered pair
    mintedThisPair.add(unordered);

    const carriesTermSheet = Object.prototype.hasOwnProperty.call(
      peaceIncident,
      'carriedTermSheet',
    );
    const carriedTermSheet = carriesTermSheet
      ? normalizeCarriedTermSheet(peaceIncident.carriedTermSheet)
      : null;
    const expectedParties = [a, b].sort();
    // Presence is authoritative: a malformed carried artifact may never fall
    // back to the live victor/appraisal path. The exact historical bargain is
    // either consumed whole or refused whole.
    if (carriesTermSheet && (!carriedTermSheet
      || carriedTermSheet.relationshipKey !== relationshipKey
      || JSON.stringify(carriedTermSheet.parties) !== JSON.stringify(expectedParties)
      || Number(carriedTermSheet.agreedTick) > Number(peaceIncident.tick))) continue;
    const liveOrientation = carriedTermSheet
      ? null
      : resolveVictor(a, b, workingState, truthFor);
    const victorId = carriedTermSheet
      ? String(carriedTermSheet.victorId)
      : String(liveOrientation.victorId);
    const loserId = carriedTermSheet
      ? String(carriedTermSheet.loserId)
      : String(liveOrientation.loserId);
    const believedMargin = carriedTermSheet ? null : Number(liveOrientation.believedMargin);
    const persistedContext = persistedCoalitionPeaceContext(
      peaceIncident.coalitionPeaceClosure,
      a,
      b,
    );
    const coalitionContext = coalitionLit
      ? (persistedContext || coalitionPeaceContext(workingState, a, b, tick))
      : null;
    const peaceOutcomeId = explicitText(peaceIncident.outcomeId)
      || `bilateral_peace.${stablePart(a)}.${stablePart(b)}.${Math.floor(Number(peaceIncident.tick) || tick)}`;

    // The congress payload is merely a declaration until this exact edge has
    // really closed and its claimed winner/loser/key agree with the live peace
    // read. The complete declared census is validated after every edge is read.
    const congressClosure = recordOf(peaceIncident.coalitionSettlementClosure);
    if (coalitionLit
      && Object.keys(congressClosure).length
      && explicitText(congressClosure.relationshipKey) === relationshipKey
      && explicitText(congressClosure.winnerId) === victorId
      && explicitText(congressClosure.loserId) === loserId) {
      congressClosures.push(congressClosure);
    }

    // The closing edge owns one durable public fact. Record its stable marker
    // before treaty minting so white peace and an already-present treaty obey
    // the same exact-once law across the whole mint window.
    let coalitionExitFirst = false;
    if (coalitionContext) {
      const marked = markCoalitionSeparatePeace(
        workingState,
        relationshipKey,
        peaceOutcomeId,
        Number(peaceIncident.tick),
        now,
        coalitionContext,
        rawEdge,
      );
      workingState = marked.worldState;
      coalitionExitFirst = marked.first;
      if (marked.first) coalitionEvidence.push(coalitionSeparatePeaceEvidence(
        coalitionContext,
        Number(peaceIncident.tick),
        peaceOutcomeId,
      ));
    }

    // Pairwise closure settles every anchored member's measured current bill.
    // A joined member's own exit has one claim; a root caller's exit carries
    // every member it abandons. Acceptance-time claims survive deployment
    // removal, while the live read remains the backwards-compatible fallback.
    if (coalitionContext) {
      const settlementSnapshot = { ...snapshot, regionalGraph: { ...(snapshot.regionalGraph || {}), edges } };
      let reimbursementClaims = Array.isArray(coalitionContext.reimbursementClaims)
        ? coalitionContext.reimbursementClaims.map((claim) => ({ ...claim }))
        : [];
      if (!reimbursementClaims.length
        && coalitionContext.departingId !== coalitionContext.callerId
        && Number.isFinite(Number(coalitionContext.expenditurePressure01))
        && coalitionContext.joinAnchor) {
        reimbursementClaims = [{
          memberId: coalitionContext.departingId,
          pressure01: Number(coalitionContext.expenditurePressure01),
          joinAnchor: coalitionContext.joinAnchor,
        }];
      }
      if (!reimbursementClaims.length) {
        const reimbursementPartyIds = coalitionContext.departingId === coalitionContext.callerId
          ? coalitionContext.abandoned
          : [coalitionContext.departingId];
        reimbursementClaims = reimbursementPartyIds.map((memberId) => {
          const deployment = recordOf(recordOf(workingState.deployments)[memberId]);
          const anchor = joinAnchorOf(deployment, memberId);
          if (!anchor || anchor.callerId !== coalitionContext.callerId
            || anchor.enemyId !== coalitionContext.enemyId) return null;
          const expenditure = readCoalitionExpenditure({
            worldState: workingState,
            snapshot: settlementSnapshot,
            partyId: memberId,
            targetId: coalitionContext.enemyId,
            deployment,
            tick,
          });
          const pressure01 = Number(expenditure?.pressure01);
          return Number.isFinite(pressure01)
            ? { memberId, pressure01, joinAnchor: anchor }
            : null;
        }).filter(Boolean);
      }
      reimbursementClaims.sort((left, right) => (
        String(left.memberId) < String(right.memberId) ? -1 : String(left.memberId) > String(right.memberId) ? 1 : 0
      ));
      for (const reimbursementClaim of reimbursementClaims) {
        const claim = Number(reimbursementClaim.pressure01);
        if (!Number.isFinite(claim) || claim <= 0) continue;
        const reimbursement = applyCoalitionReimbursement({
          worldState: workingState,
          snapshot: settlementSnapshot,
          settlementUpdates: workingSettlementUpdates,
          coalitionSettlementId: peaceOutcomeId,
          callerId: coalitionContext.callerId,
          memberId: reimbursementClaim.memberId,
          targetId: coalitionContext.enemyId,
          claim01: claim,
          tick,
          joinAnchor: reimbursementClaim.joinAnchor,
        });
        if (reimbursement.changed) {
          workingState = reimbursement.worldState;
          workingSettlementUpdates = reimbursement.settlementUpdates;
          coalitionEvidence.push(...(reimbursement.coalitionEvidence || []));
          if (dispositionChannelsActive && Array.isArray(reimbursement.dispositionDeltas)) {
            dispositionDeltas.push(...reimbursement.dispositionDeltas);
          }
        }
      }
    }
    // GR-2 (J-GR-14b) — THE WAR DOOR'S AMENDMENT AWARENESS, and the ONE edit this file
    // takes for the whole GR-2 wave. A standing peacetime instrument used to make this
    // settlement VANISH: the pair-slot guard below skipped, and nothing anywhere recorded
    // that a war had ended under a pact these courts had signed. It is now absorbed as a
    // lineage act on that instrument. DARK ⇒ the call returns false before reading anything
    // and the guard below runs byte-identically.
    if (absorbWarEndIntoStandingPact({
      ledger: nextLedger, worldState: workingState, victorId, loserId, tick,
    })) continue;
    // Already under a live treaty? Don't re-mint (idempotent within the window).
    if (nextLedger[treatyPairKey(victorId, loserId)] || nextLedger[treatyPairKey(loserId, victorId)]) continue;

    const mint = carriedTermSheet
      ? mintTreatyFromCarriedSheet({
          termSheet: carriedTermSheet,
          homeTick: tick,
          snapshot,
          edges,
          coalitionContext,
          coalitionOutcomeId: peaceOutcomeId,
          coalitionOutcomeTick: Number(peaceIncident.tick),
        })
      : mintTreaty({
          victorId, loserId, believedMargin, worldState: workingState, snapshot,
          pIndex, threatByCid, adjacency, truthFor, tick, edges,
          coalitionContext,
          coalitionOutcomeId: peaceOutcomeId,
          coalitionOutcomeTick: Number(peaceIncident.tick),
        });
    if (!mint) {
      // White peace has no treaty ledger shell, but the actual coalition edge
      // still closed. Stable outcome ids make both betrayal pricing and public
      // evidence exact-once across the mint window.
      if (coalitionContext && coalitionExitFirst) {
        workingState = accrueBetrayal(
          workingState,
          /** @type {Array<Record<string, unknown>>} */ (edges),
          coalitionContext.departingId,
          coalitionContext.abandoned,
          now,
          peaceOutcomeId,
          snapshot,
        );
      }
      continue; // white peace / no affordable term ⇒ no treaty key
    }
    // GR-1 THE SIGNATURE LINE, STAMPED WHERE BOTH MINT ROADS MEET — for exactly the
    // reason executeTreatyConveyances is called from this loop below rather than from
    // inside applyMintEffects: that closure is defined TWICE, once per road, so an arm
    // added inside it would be two spellings of one law with the carried-sheet road
    // free to drift from the live-appraisal one. Dark ⇒ no `sworn` key is written.
    stampSworn(mint.treaty, {
      worldState: workingState, tick, ids: [victorId, loserId],
      settlementOf: (sid) => freshestSettlement(workingSettlementUpdates, snapshot, sid),
    });
    nextLedger[treatyPairKey(victorId, loserId)] = mint.treaty;
    // Mint-time executions (overlay nudge, seam registration) + the signing beat.
    workingState = mint.applyMintEffects(
      workingState,
      /** @type {Array<Record<string, unknown>>} */ (edges),
      now,
      coalitionExitFirst,
    );
    // ── WR-10 THE CONVEYANCE, EXECUTED AT THE SIGNING (amendment S: the treaty IS the
    // artifact). Both mint roads pass through this one point, so the wartime cession an
    // envoy carried home and the peacetime sale a market cleared execute through ONE
    // writer. The victor RECEIVES and the loser GIVES — the orientation every other
    // term in this file already uses. Dark, or on a treaty carrying no cession clause,
    // it returns both references unchanged.
    const conveyed = executeTreatyConveyances({
      treaty: mint.treaty, worldState: workingState,
      settlementUpdates: workingSettlementUpdates, edges, tick, now,
    });
    workingState = conveyed.worldState;
    workingSettlementUpdates = conveyed.settlementUpdates;
    newsEntries.push(mint.signingBeat);
    if (mint.treaty.mediator) {
      // A mediation that actually lands is a resolved diplomatic outcome for the
      // broker. Qualification alone teaches nothing; the signed sheet teaches once.
      dispositionDeltas.push(...treatyDispositionDeltas({
        enabled: dispositionChannelsActive,
        outcome: 'mediated',
        treaty: mint.treaty,
        mediatorId: String(mint.treaty.mediator.id || ''),
      }));
    }
  }

  // An aggregate congress is a distinct, explicit coordination fact. Group
  // actual fresh closures by their declared id, demand the declared complete
  // census, then run the canonical planner/applicator. A lone tagged peace edge
  // cannot become a congress.
  const congressIds = [...new Set(congressClosures
    .map((row) => explicitText(row.coalitionSettlementId)).filter(Boolean))].sort();
  for (const settlementId of congressIds) {
    const prepared = explicitCongressPlan(
      congressClosures.filter((row) => explicitText(row.coalitionSettlementId) === settlementId),
      tick,
    );
    if (!prepared) continue;
    const appliedCongress = applyCoalitionSettlement({
      worldState: workingState,
      snapshot: { ...snapshot, regionalGraph: { ...(snapshot.regionalGraph || {}), edges } },
      settlementUpdates: workingSettlementUpdates,
      plan: prepared.plan,
      closures: prepared.closures,
    });
    if (!appliedCongress.changed) continue;
    workingState = appliedCongress.worldState;
    workingSettlementUpdates = appliedCongress.settlementUpdates;
    coalitionEvidence.push(...(appliedCongress.coalitionEvidence || []));
    if (dispositionChannelsActive && Array.isArray(appliedCongress.dispositionDeltas)) {
      dispositionDeltas.push(...appliedCongress.dispositionDeltas);
    }
  }

  // ── PASS 2: ADVANCE live treaties (execute · monitor · strain · expire) ────
  for (const key of Object.keys(nextLedger).sort()) {
    const treaty = nextLedger[key];
    const previousCompliance = String(prevLedger?.[key]?.complianceState || treaty.complianceState || 'honored');
    // ── WHO OWES WHOM, THROUGH THE ONE ORIENTATION READER (chair ruling CR-WR10-G).
    // These two lines used to be `String(treaty.victorId)` / `String(treaty.loserId)`,
    // which on WR-10's victor-free sale treaty produce the four-character string
    // "undefined" — and this pass then WRITES one of them: `treaty.defaultedBy` below
    // would have persisted a court by that name into the ledger forever, and
    // scoreTreatyDefault would have minted a casus belli against it. The obligor is the
    // party that owes: the wartime LOSER, or on a sale the BUYER, because the
    // consideration flows to the seller. The names are kept for the receipts.
    const orientation = treatyOrientationOf(treaty);
    const victorId = orientation.obligeeId;
    const loserId = orientation.obligorId;
    const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty.terms) ? treaty.terms : []);

    // WR-0c — a deliberate repudiation is already a resolved compliance verdict,
    // not another delivery roll. Its writer ended every live term at the breach
    // tick, lifting ALL enforcement and streams immediately. Keep the broken shell
    // until the terms' ORIGINAL horizon so treatiesForPair can feed the standing
    // treaty_default casus, then prune it as spent history. Never restore honored,
    // execute installments, or accrue ordinary payment strain on this branch.
    if (String(treaty.breachType || '') === 'repudiation') {
      const horizon = Number(treaty.breachExpiresTick);
      if (!Number.isFinite(horizon) || Number(tick) >= horizon) delete nextLedger[key];
      else {
        treaty.complianceState = 'defaulted';
        treaty.defaultSeverity01 = 1;
        treaty.terms = terms;
      }
      continue;
    }

    // The loser's true delivery capacity (economic headroom) + the victor's
    // monitoring reach (belief source — truth ⇒ sight, banded belief ⇒ fog).
    const loserPressure = buildPressureSummary(pIndex, loserId);
    const loserBurden01 = clamp01(0.6 * clamp01(Number(loserPressure?.economy) || 0) + 0.4 * clamp01(Number(loserPressure?.food) || 0));
    const loserCapacity01 = clamp01(1 - loserBurden01);
    const monitorReach01 = victorMonitorReach(victorId, loserId, workingState, truthFor);

    /** @type {TermRecord[]} */
    const liveTerms = [];
    let worstObserved = 'honored';
    let anyStrainThisTick = false;
    let defaultSeverity01 = 0;
    for (const term of terms) {
      if (Number(tick) >= Number(term.expiresTick)) {
        // EXPIRY (§12.5): the term lapses; its effect lifts (the reads stop
        // returning it once it is gone). Dropped from the live set.
        continue;
      }
      const comp = evolveCompliance({ loserCapacity01, monitorReach01 });
      term.trueState = comp.trueState;
      term.complianceState = comp.observedState;
      term.burden01 = round4(loserBurden01);

      // ── STREAMS EXECUTE A REAL, CONSERVED INSTALLMENT. The term's magnitude is its
      // nominal YEARLY share; one tick draws one installment of it from the loser's
      // granary ABOVE its reserve floor and credits the victor's, through the
      // sink-only primitive (absolute food is reduced by the carry, never minted —
      // see treatyTransfer.js for why grain is the honest denomination here).
      // The accumulators now record the REAL storage-months moved, so
      // `extractedFromLoser` is what the payer actually lost and `deliveredToVictor`
      // what the payee actually received; they DIVERGE by the road's spoilage, which
      // is the sink. A payer at its reserve floor moves nothing — and that silence is
      // exactly the under-delivery §12's compliance read is watching for.
      const spec = TERM_CATALOG[term.type];
      if (spec?.stream) {
        const draw = computeTreatyGrainDraw({
          payer: freshestSettlement(workingSettlementUpdates, snapshot, loserId),
          payee: freshestSettlement(workingSettlementUpdates, snapshot, victorId),
          takeFraction: streamInstallmentFraction(term, comp.trueDelivery01, treaty),
          committedDebit: -(foodDeltas.get(loserId) || 0),
          committedCredit: foodDeltas.get(victorId) || 0,
        });
        if (draw && draw.lostMonths > 0) {
          foodDeltas.set(loserId, round4((foodDeltas.get(loserId) || 0) - draw.lostMonths));
          if (draw.gainedMonths > 0) foodDeltas.set(victorId, round4((foodDeltas.get(victorId) || 0) + draw.gainedMonths));
          term.extractedFromLoser = round4((Number(term.extractedFromLoser) || 0) + draw.lostMonths);
          term.deliveredToVictor = round4((Number(term.deliveredToVictor) || 0) + draw.gainedMonths);
        }
      }
      if (comp.trueState !== 'honored') anyStrainThisTick = true;
      if (comp.observedState === 'defaulted') defaultSeverity01 = Math.max(defaultSeverity01, round4(1 - comp.trueDelivery01));
      if (rankState(comp.observedState) > rankState(worstObserved)) worstObserved = comp.observedState;
      liveTerms.push(term);
    }

    if (liveTerms.length === 0) {
      // A pact that reaches its authored horizon without a default is an outcome,
      // not mere clock passage: both parties learned that diplomacy held. The
      // repudiation shell is handled by its direct writer and can never earn this.
      dispositionDeltas.push(...treatyDispositionDeltas({ enabled: dispositionChannelsActive, outcome: 'held', treaty, previousCompliance, victorId, loserId }));
      // GR-0 THE LAPSE BEAT. `previousCompliance` is the LAST RECORDED observed state —
      // every term expired above without reaching evolveCompliance, so `worstObserved` is
      // still 'honored' here and would report a hollowed pact as a clean one. The beats
      // never feed the disposition learning on the line above; they only speak about it.
      if (lifecycleVoiceLit) newsEntries.push(...treatyLapsedBeats({ treaty, terms, tick, observedWorst: previousCompliance, orientation }));
      delete nextLedger[key]; // all terms lapsed ⇒ the treaty is spent history (prune)
      continue;
    }
    treaty.terms = liveTerms;
    treaty.complianceState = worstObserved;
    // GR-0 THE DETECTION BEAT — keyed on the OBSERVED CROSSING, never on the level. The
    // `prevLedger?.[key]` arm is load-bearing rather than defensive: a treaty minted THIS
    // tick has been observed once, and one observation is a level. Without it a single-tick
    // harness could certify a "crossing" pin that never saw a transition at all.
    if (lifecycleVoiceLit && previousCompliance === 'honored' && prevLedger?.[key]) newsEntries.push(...treatyDefaultDetectedBeats({ tick, observedState: worstObserved, terms: liveTerms, orientation }));
    // DROP-WHEN-ABSENT AT THE WRITE (CR-WR10-G's needs-guard). An unresolved orientation
    // yields the empty string, and a treaty that cannot say who owes it cannot name an
    // oathbreaker — writing the key anyway would put a nameless accusation in the ledger
    // and feed it to scoreTreatyDefault. No obligor ⇒ no default record, and the branch
    // below prunes any stale one exactly as it always did.
    if (defaultSeverity01 > 0 && loserId) {
      treaty.defaultedBy = loserId;                 // the obligor is the oathbreaker (feeds scoreTreatyDefault)
      treaty.defaultSeverity01 = defaultSeverity01;
      // Learn the breach once on the observed transition, never once per tick of
      // an already-defaulted treaty. The other party does not receive a synthetic
      // "win" merely because a promise to it was broken.
      dispositionDeltas.push(...treatyDispositionDeltas({ enabled: dispositionChannelsActive, outcome: 'defaulted', previousCompliance, loserId, severity01: defaultSeverity01 }));
    } else if ('defaultedBy' in treaty) {
      delete treaty.defaultedBy; delete treaty.defaultSeverity01;
    }

    // §12.3 STRAIN → the E1b resentment seam: the paying loser resents its burden;
    // that resentment is the §5 revanchism fuel a future war reads.
    if (anyStrainThisTick && orientation.resolved) {
      workingState = accrueStrainResentment(workingState, /** @type {Array<Record<string, unknown>>} */ (edges), loserId, victorId, loserBurden01, now, treaty);
    }
  }

  // ── PERSIST (serialize-compare; drop-when-empty) ───────────────────────────
  // The tick's granary movements fold on through the EXISTING single food applicator
  // (clamped to each granary's capacity, rounded to the tenth-month). Zero deltas ⇒ the
  // same array by reference, so a tick where no term drew is byte-identical here.
  const nextUpdates = applyTreatyFoodDeltas(
    /** @type {Array<{ saveId?: unknown }>} */ (workingSettlementUpdates), foodDeltas);
  const grainMoved = nextUpdates !== settlementUpdates;
  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? sortedLedger(nextLedger) : null);
  const relChanged = workingState !== worldState;
  if (prevSerialized === nextSerialized && !relChanged && !grainMoved && newsEntries.length === 0) {
    return withTreatyDispositionDeltas({
      worldState,
      changed: false,
      newsEntries: [],
      ...(coalitionLit ? { coalitionEvidence } : {}),
    }, dispositionChannelsActive, dispositionDeltas);
  }
  let out = workingState;
  out = hasNext ? setSpatialLedger(out, 'treaties', sortedLedger(nextLedger)) : dropSpatialLedger(out, 'treaties');
  return withTreatyDispositionDeltas({
    worldState: out, changed: true, newsEntries,
    ...(coalitionLit ? { coalitionEvidence } : {}),
    settlementUpdates: /** @type {Array<Record<string, unknown>>} */ (nextUpdates),
  }, dispositionChannelsActive, dispositionDeltas);
}

// ── Mint internals ───────────────────────────────────────────────────────────

/**
 * Build a treaty from a resolved victor/loser + budget/ranking, plus a closure
 * that applies the mint-time executions. Returns null on white peace / no
 * affordable term (the clean exit — no key materializes).
 *
 * WAVE-3 composes the table (§7 / §13): a named MEDIATOR softens the budget +
 * earns trust both ways; a co-besieger COALITION either negotiates JOINTLY (one
 * treaty, burden split by strength shares) or lets the victor take a SEPARATE
 * EXIT (a lighter solo peace that ABANDONS its co-besiegers — betrayal priced,
 * a fracture record typed for the coalition_fracture peace reason to consume).
 * The joint-vs-peel choice is a DETERMINISTIC §H-loaded read (the module's
 * no-rng law): the loading is exhaustion + tie-strength, resolved by threshold.
 *
 * @param {{ victorId: string, loserId: string, believedMargin: number,
 *           worldState: Record<string, unknown>, snapshot: { byId?: Map<string, Record<string, unknown>> },
 *           pIndex: Record<string, unknown> | null, threatByCid: Map<string, number>,
 *           adjacency: Map<string, Set<string>>, truthFor: (id: string) => number, tick: number,
 *           edges: Array<Record<string, unknown>>, coalitionContext?:Record<string,unknown>|null,
 *           coalitionOutcomeId?:string, coalitionOutcomeTick?:number }} args
 * @returns {{ treaty: TreatyRecord, signingBeat: Record<string, unknown>,
 *             applyMintEffects: (ws: Record<string, unknown>, edges: Array<Record<string, unknown>>, now: unknown) => Record<string, unknown>,
 *             coalitionEvidence?: Array<Record<string, unknown>> } | null}
 */
function mintTreaty(args) {
  const {
    victorId, loserId, believedMargin, worldState, snapshot, pIndex,
    threatByCid, adjacency, truthFor, tick, edges,
    coalitionOutcomeId = '', coalitionOutcomeTick = tick,
  } = args;
  const { margin01, budget, whitePeace } = termBudgetFor(believedMargin);
  if (whitePeace || budget <= 0) return null;

  const victorItem = snapshot?.byId?.get?.(victorId) || null;
  const loserItem = snapshot?.byId?.get?.(loserId) || null;
  const press = alignmentPress(victorItem);

  // ── MEDIATION (§13): a cross-pressured neighbour brokering the table softens
  // the terms (the §12 magnanimity nudge — bounded) and earns trust both ways.
  // Eligibility is resolved first from the relationship/faith/alignment graph.
  // Only then may WR-2 colour the already-qualified broker's propensity; it can
  // neither nominate a different mediator nor manufacture a relationship.
  const mediator = findCrossPressuredMediator(snapshot, { edges }, victorId, loserId);
  const mediationDisposition = mediator && dispositionTreatyLearningActive(worldState)
    ? thresholdFactorOf(
      /** @type {Record<string, any>} */ (worldState.dispositionStats || {})[mediator.id],
      'diplomatic',
    )
    : null;
  const mediationScale = mediationDisposition ? 2 - mediationDisposition.factor : 1;
  let effectiveBudget = mediator
    ? budget * (1 - PEACE_TERMS_TUNING.MEDIATION_SOFTEN * mediationScale)
    : budget;

  // ── COALITION (§7): the victor's co-besiegers of this loser. >1 member ⇒ the
  // table is COMPOSED; the §H-loaded peel read decides joint vs separate exit.
  const deployments = /** @type {Record<string, { targetId?: unknown }>} */ (
    worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const warExhaustion = /** @type {Record<string, unknown>} */ (
    worldState.warExhaustion && typeof worldState.warExhaustion === 'object' ? worldState.warExhaustion : {});
  const wr6Active = coalitionLedgerActive(worldState);
  const rawCoalitionContext = wr6Active
    ? (args.coalitionContext || coalitionPeaceContext(worldState, victorId, loserId, tick))
    : null;
  const coalitionContext = rawCoalitionContext ? {
    ...rawCoalitionContext,
    departingName: String(/** @type {{name?:unknown}} */ (
      snapshot?.byId?.get?.(rawCoalitionContext.departingId) || {}).name || rawCoalitionContext.departingId),
    enemyName: String(/** @type {{name?:unknown}} */ (
      snapshot?.byId?.get?.(rawCoalitionContext.enemyId) || {}).name || rawCoalitionContext.enemyId),
  } : null;
  const coBesiegers = wr6Active
    ? (coalitionContext?.abandoned || [])
    : coBesiegersOf(deployments, victorId, loserId);
  const coalition = wr6Active
    ? (coalitionContext?.members || [victorId])
    : [victorId, ...coBesiegers].sort();
  const legacyMode = wr6Active ? { mode: 'joint', peelPropensity: 0 } : chooseCoalitionMode({
    victorExhaustion01: Number(warExhaustion[victorId]) || 0,
    avgTie01: avgTieStrength(worldState, edges, victorId, coBesiegers),
    coalitionSize: coalition.length,
  });
  const peelPropensity = legacyMode.peelPropensity;
  // WR-6's stay/exit choice has already been made through the four-term ruling.
  // If another anchored front survives, this treaty closes this pair only.  No
  // table-time heuristic may turn it into a joint treaty or veto the exit.
  const separateExit = wr6Active
    ? !!coalitionContext
    : coalition.length > 1 && legacyMode.mode === 'separate_exit';
  if (separateExit) effectiveBudget *= PEACE_TERMS_TUNING.SEPARATE_EXIT_BUDGET; // a solo bargain is lighter

  const ranked = appraiseLoserPortfolio({
    victorId, loserId, worldState, victorItem, loserItem,
    victorPressure: buildPressureSummary(pIndex, victorId),
    victorThreat01: clamp01(threatByCid.get(victorId) || 0),
    loserTruthStrength: truthFor(loserId),
    loserAllyStrength01: loserAllyStrength(adjacency, loserId, victorId),
  });
  const { terms, budgetSpent } = draftTerms({ ranked, budget: effectiveBudget, margin01, press, tick });
  if (terms.length === 0) return null; // budget too thin for any term ⇒ clean exit

  const victorName = String(/** @type {{ name?: unknown }} */ (victorItem || {}).name || victorId);
  const loserName = String(/** @type {{ name?: unknown }} */ (loserItem || {}).name || loserId);

  /** @type {string[]} */
  const receipts = [`The Peace of ${loserName} — signed under ${victorName}'s terms (${terms.map((t) => t.type).join(', ')}).`];
  if (mediator) receipts.push(`Brokered by ${mediator.name}, torn between the courts — the terms were the lighter for it.`);
  if (mediationDisposition && mediationDisposition.factor !== 1) {
    receipts.push(mediationDisposition.receipt);
  }

  /** @type {TreatyRecord} */
  const treaty = {
    parties: [victorId, loserId],
    victorId,
    loserId,
    victorName,
    loserName,
    mintedTick: tick,
    believedMarginAtSignature: round4(believedMargin),
    budgetGranted: round4(effectiveBudget),
    budgetSpent,
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
    terms,
    complianceState: 'honored',
    receipts,
  };
  if (mediator) treaty.mediator = { id: mediator.id, name: mediator.name };

  // JOINT coalition: the roster + committed-strength shares are legible on the
  // treaty (§7 — reparations distribute pro-rata; the transfer physics credit the
  // lead negotiator, per-member distribution is a later-wave transfer seam).
  if (!wr6Active && coalition.length > 1 && !separateExit) {
    treaty.coalitionScope = coalition;
    treaty.shares = coalitionShares(coalition, truthFor);
    receipts.push(`A coalition peace — ${coalition.length} besiegers bind ${loserName} jointly, the spoils split by the strength each brought.`);
  }
  // SEPARATE EXIT: the typed fracture record (§7) — the deserter, its abandoned
  // co-besiegers, the coalition size, and the recorded credibility hit (the
  // W-DOCTRINE-2 reliability seam). The coalition_fracture peace reason reads it.
  if (separateExit) {
    const deserterId = coalitionContext?.departingId || victorId;
    const deserterItem = snapshot?.byId?.get?.(deserterId) || null;
    const deserterName = String(/** @type {{ name?: unknown }} */ (deserterItem || {}).name || deserterId);
    const abandoned = coalitionContext?.abandoned || coBesiegers;
    const fractureReceipt = `${deserterName} left the siege — its own peace bought, its allies' fronts left standing.`;
    treaty.separateExit = true;
    treaty.fracture = {
      deserter: deserterId,
      abandoned,
      coalitionSize: coalition.length,
      credibilityHit: round4(PEACE_TERMS_TUNING.CREDIBILITY_HIT),
      peelPropensity,
      tick,
      receipt: fractureReceipt,
    };
    receipts.push(fractureReceipt);
  }

  const signingBeat = {
    // THE FEED'S ADMISSION KEY (see the wizardNews.js authoring guard). This beat went
    // WITHOUT one, so every treaty this engine has ever signed was narrated into a void:
    // normalizeEntry refuses an id-less entry and the audit sink skips it. COLLISION-FREE:
    // the minting loop keeps a `mintedThisPair` set and takes one treaty per unordered
    // pair per tick, and re-mint is refused while a treaty is live, so (victor, loser)
    // cannot repeat within a tick.
    id: `wizard_news.${tick}.treaty_signed.${stablePart(victorId)}.${stablePart(loserId)}`,
    kind: 'treaty_signed',
    impactKind: 'diplomacy',
    // A dictated peace ENDS A WAR — a major beat by any in-world reading, on par with
    // the climb-down (major/68). Without these three, normalizeEntry graded it notable
    // with severity 0 and score 0: invisible weight on the one beat that closes an arc.
    // Also the reader-facing meters: absent severity renders "Severity 0%" on the card
    // and seeds rumors at the mildest magnitude band.
    significance: 'major',
    severity: 0.55,
    score: 66,
    tick,
    headline: separateExit && coalitionContext
      ? `${coalitionContext.departingName} closes its own war edge with ${coalitionContext.enemyName}`
      : separateExit
      ? `${victorName} peels from the siege and makes a separate peace with ${loserName}`
      : `${victorName} dictates the peace with ${loserName}`,
    summary: `${separateExit && coalitionContext
      ? `${coalitionContext.departingName} settles only its own edge with ${coalitionContext.enemyName}, leaving the allied fronts standing under`
      : separateExit
      ? `${victorName} makes a separate peace with ${loserName}, binding the defeated court to`
      : `${victorName} binds ${loserName} to`} ${terms.map((term) => termLabel(term.type)).join(', ')}.${mediator ? ` ${mediator.name} brokered the settlement.` : ''}`,
    reasons: [
      ...terms.map((term) => signingReason(term, victorName, loserName)),
      ...(mediationDisposition && mediationDisposition.factor !== 1
        ? [mediationDisposition.receipt]
        : []),
    ],
    // THE NEWS ADDRESS LAW's place layer. `parties` is this module's own vocabulary and no
    // feed consumer reads it (normalizeEntry, the rumor seeder, the panel's
    // AffectedSettlements and arcIdForEntry all read `settlementIds`), so without this the
    // beat would reach the feed addressed to nowhere. `parties` is retained because the
    // treaty ledger's own readers speak it.
    settlementIds: [victorId, loserId],
    parties: [victorId, loserId],
  };

  /** Apply the mint-time executions (§11): the relational overlay nudge + the
   *  seam registrations, plus WAVE-3 the mediation trust (both mediator edges)
   *  and the separate-exit betrayal (each abandoned co-besiegers' edge). Streams/
   *  readiness/war-block execute lazily via the reads + the advance pass. */
  const applyMintEffects = (
    /** @type {Record<string, unknown>} */ ws,
    /** @type {Array<Record<string, unknown>>} */ eff,
    /** @type {unknown} */ now,
    coalitionExitFirst = true,
  ) => {
    let state = ws;
    for (const term of terms) {
      if (term.type === 'compelled_alliance') {
        // The relationship-overlay nudge (the E1c overture lane): the loser is
        // pulled toward the victor's banner AND its resentment rises (compelled
        // loyalty is resented — §11's defection window is a wave-3 read).
        state = nudgeCompelledAlliance(state, eff, loserId, victorId, term.magnitude, now);
      }
    }
    if (mediator) state = accrueMediationTrust(state, eff, mediator.id, victorId, loserId, now);
    if (separateExit && (!wr6Active || coalitionExitFirst)) state = accrueBetrayal(
      state,
      eff,
      coalitionContext?.departingId || victorId,
      coalitionContext?.abandoned || coBesiegers,
      now,
      wr6Active ? coalitionOutcomeId : '',
      snapshot,
    );
    return state;
  };

  const mintCoalitionEvidence = coalitionContext
    ? [coalitionSeparatePeaceEvidence(
        coalitionContext,
        coalitionOutcomeTick,
        coalitionOutcomeId,
      )]
    : [];

  return {
    treaty,
    signingBeat,
    applyMintEffects,
    ...(wr6Active ? { coalitionEvidence: mintCoalitionEvidence } : {}),
  };
}

/**
 * Materialize the exact WR-7b artifact without reopening any live appraisal.
 * Names color the signing receipt only; present-day strength, holdings, roads,
 * fronts, alignment, mediation, and affordability cannot alter the clauses.
 * @param {{ termSheet:unknown, homeTick:number,
 *   snapshot:{byId?:Map<string,Record<string,unknown>>},
 *   edges:Array<Record<string,unknown>>, coalitionContext?:Record<string,unknown>|null,
 *   coalitionOutcomeId?:string, coalitionOutcomeTick?:number }} args
 */
function mintTreatyFromCarriedSheet(args) {
  const sheet = normalizeCarriedTermSheet(args.termSheet);
  const materialized = materializeCarriedTermSheet({
    termSheet: sheet,
    homeTick: args.homeTick,
  });
  if (!sheet || !materialized || !Array.isArray(materialized.terms)
    || materialized.terms.length === 0) return null;

  const victorId = String(sheet.victorId);
  const loserId = String(sheet.loserId);
  const victorItem = args.snapshot?.byId?.get?.(victorId) || null;
  const loserItem = args.snapshot?.byId?.get?.(loserId) || null;
  const victorName = String(/** @type {{name?:unknown}} */ (victorItem || {}).name || victorId);
  const loserName = String(/** @type {{name?:unknown}} */ (loserItem || {}).name || loserId);
  const terms = /** @type {TermRecord[]} */ (materialized.terms);
  const coalitionContext = args.coalitionContext || null;
  const separateExit = !!coalitionContext;
  const receipts = [
    `The Peace of ${loserName} — carried home under ${victorName}'s agreed terms (${terms.map((term) => term.type).join(', ')}).`,
  ];
  /** @type {TreatyRecord} */
  const treaty = {
    ...materialized,
    victorName,
    loserName,
    receipts,
  };
  if (separateExit) {
    const departingId = String(coalitionContext.departingId || victorId);
    const departingItem = args.snapshot?.byId?.get?.(departingId) || null;
    const departingName = String(/** @type {{name?:unknown}} */ (departingItem || {}).name || departingId);
    const abandoned = Array.isArray(coalitionContext.abandoned)
      ? coalitionContext.abandoned.map(String).sort()
      : [];
    const members = Array.isArray(coalitionContext.members)
      ? coalitionContext.members.map(String)
      : [departingId, ...abandoned];
    const fractureReceipt = `${departingName} left the siege — its own peace bought, its allies' fronts left standing.`;
    treaty.separateExit = true;
    treaty.fracture = {
      deserter: departingId,
      abandoned,
      coalitionSize: members.length,
      credibilityHit: round4(PEACE_TERMS_TUNING.CREDIBILITY_HIT),
      peelPropensity: 0,
      tick: args.homeTick,
      receipt: fractureReceipt,
    };
    receipts.push(fractureReceipt);
  }

  const signingBeat = {
    id: `wizard_news.${args.homeTick}.treaty_signed.${stablePart(victorId)}.${stablePart(loserId)}`,
    kind: 'treaty_signed',
    impactKind: 'diplomacy',
    significance: 'major',
    severity: 0.55,
    score: 66,
    tick: args.homeTick,
    headline: separateExit
      ? `${String(coalitionContext.departingName || victorName)} closes its own war edge with ${String(coalitionContext.enemyName || loserName)}`
      : `${victorName} carries the agreed peace home from ${loserName}`,
    summary: `${separateExit
      ? `${String(coalitionContext.departingName || victorName)} settles only its own edge with ${String(coalitionContext.enemyName || loserName)}, leaving allied fronts standing under`
      : `${victorName} binds ${loserName} to`} ${terms.map((term) => termLabel(term.type)).join(', ')}.`,
    reasons: terms.map((term) => signingReason(term, victorName, loserName)),
    settlementIds: [victorId, loserId],
    parties: [victorId, loserId],
  };

  const applyMintEffects = (
    /** @type {Record<string,unknown>} */ worldState,
    /** @type {Array<Record<string,unknown>>} */ edges,
    /** @type {unknown} */ now,
    coalitionExitFirst = true,
  ) => {
    let state = worldState;
    for (const term of terms) {
      if (term.type === 'compelled_alliance') {
        state = nudgeCompelledAlliance(
          state,
          edges,
          loserId,
          victorId,
          term.magnitude,
          now,
        );
      }
    }
    if (separateExit && coalitionExitFirst) {
      state = accrueBetrayal(
        state,
        edges,
        String(coalitionContext.departingId || victorId),
        Array.isArray(coalitionContext.abandoned)
          ? coalitionContext.abandoned.map(String)
          : [],
        now,
        String(args.coalitionOutcomeId || ''),
        args.snapshot,
      );
    }
    return state;
  };

  return {
    treaty,
    signingBeat,
    applyMintEffects,
    ...(coalitionContext ? {
      coalitionEvidence: [coalitionSeparatePeaceEvidence(
        coalitionContext,
        args.coalitionOutcomeTick ?? args.homeTick,
        args.coalitionOutcomeId || '',
      )],
    } : {}),
  };
}

// ── THE PUBLIC SURFACE (unchanged by the split) ─────────────────────────────
//
// Every name this module has ever exported is still exported from this path, so
// no consumer import site moved. The three groups below are the historic
// re-exports (they predate the split and are load-bearing for the reasons DAG);
// the fourth is the family's own surface, re-exported from the leaves that now
// own the code.

// faithProximityOf now lives in sacredClaim.js and is RE-EXPORTED here so this module's
// historic import path keeps working. It moved because the faith casus belli
// (sacred_claim ↔ common_rite) needs the same read from warReasons.js, and warReasons
// could never import peaceTerms — peaceTerms imports warReasons' gate, so the edge would
// close a cycle. ONE reader, three consumers (the treaty mint, the mediation reason, and
// the two faith reasons), no fork.
export { faithProximityOf };

// Re-export the believed-relationship read the wave-3 stance/defection reads will
// consume (the compelled-alliance defection window reads a believed victor weakness).
export { readBeliefRelationship };

// The three ENFORCEMENT reads now live in treatyEnforcement.js (a dependency-free leaf
// the war-layer consumers can import without closing a cycle back through this module —
// see the import block). Re-exported under their historic names so every existing caller,
// the display layer and the battery keep their import path. occupationHoldFor rides the
// same seam: one reader, so a term's expiry lifts every effect on the same tick.
export { treatyLedgerOf, demilitarizationCapFor, treatyBlocksWar, occupationHoldFor };

// The family's own surface.
export {
  CARRIED_TERM_SHEET_SCHEMA_VERSION,
  COALITION_BETRAYAL_CHARACTER_TUNING,
  PEACE_TERMS_TUNING,
  TERM_CATALOG,
  TERM_FAMILIES,
  TERM_TYPES,
  alignmentPress,
  alignmentPressFromInput,
  appraiseLoserPortfolio,
  appraiseLoserPortfolioFromInputs,
  believedAdvantage,
  believedAdvantageFromInputs,
  carriedClauseFromDraft,
  chooseCoalitionMode,
  coBesiegersOf,
  coalitionBetrayalCharacterRead,
  coalitionPeaceContext,
  draftTerms,
  evolveCompliance,
  fracturesAbandoning,
  frayingTermOf,
  findCrossPressuredMediator,
  normalizeCarriedTermSheet,
  resolveVictor,
  termBudgetFor,
  termLabel,
  treatiesForPair,
  treatyDocument,
  treatyDocumentsForSettlement,
  treatyFrayingSummary,
  treatyPairKey,
};
