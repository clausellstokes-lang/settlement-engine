/**
 * pactFormation.js — GR-2. PEACETIME FORMATION, AND THE STANDALONE NAP.
 *
 * Kadesh: equals, in peacetime, brothers not vassals — the instrument this engine has never
 * been able to mint. Two courts at peace decide on their own evidence that there is
 * something to write down, one asks, the other answers, and what they sign is the SAME
 * artifact a war's end produces, with the same compliance, the same war-block read and the
 * same repudiation surface. The survey's sharpest sentence dies here: two peaceful
 * neighbours can sign one.
 *
 * ── THE FOURTH TRANSPORT INTO THE ONE INSTRUMENT ────────────────────────────────
 * `peaceTermsSale.js`'s header names itself "the THIRD transport into the one instrument,
 * beside the live-appraisal mint and the carried-sheet mint". This is the fourth, and it is
 * built to that file's pattern exactly: a member of the peaceTerms WRITER FAMILY that
 * composes `TERM_CATALOG`, the family primitives and the treaty clock DIRECTLY, writes
 * through `treatyLedgerOf`/`setSpatialLedger`, is NOT re-exported by `peaceTerms.js` (a
 * re-export would drag its caller into the head's 35-module import cycle — the dist
 * chunk-cycle TDZ class), and whose caller lives outside that cycle.
 *
 * ── THE MOUNT, AND WHY THE ORDER IS FIXED ───────────────────────────────────────
 * `advancePeacetimePacts` is a stage in `settlementLifecycleKernel.js`, beside
 * `advanceSovereigntyMarket`, own-flag-before-host-gate. NEVER a `pulseKernel.js` edit —
 * that file is BANKED at 1580 under the standing R-BLD-10 law, and the treaty advance
 * there is no longer a bare call anyway (J-GRC-2).
 *
 * STAGE ORDER IS MARKET FIRST, PACTS SECOND (JUDGMENT, vetoable): a court that has just
 * sold a holding is a court whose believed books changed this very tick, and the pact
 * trigger should read the post-sale world rather than the world as it stood before its
 * neighbour bought a town from it.
 *
 * ⚠ THE ORIGINAL WORDING HERE — "and it is pinned" — WAS AN OVERSTATEMENT, caught by GR-2's
 * adversarial verifier: a mutant that swapped the two stages wholesale left 191 tests green,
 * because nothing in the estate drove `advanceSettlementLifecycle` with this file's flag
 * lit. The claim is now carried by an executed enforcer rather than by this sentence.
 * @enforced-by tests/domain/pactKernelMount.test.js (call order + the identity chain)
 *
 * ── FORMATION AMENDS; IT DOES NOT COMPETE FOR THE SLOT ──────────────────────────
 * One treaty per unordered pair (V-1) is the estate's law, and the war and sale doors both
 * keep it by REFUSING. A peacetime formation keeps it by APPENDING: where a standing
 * instrument exists the sheet becomes a lineage act on it, and where none exists this file
 * mints. So a pair holding a live sale deed can still sign a grain pact — the deed grows a
 * clause — and the SALE door's own refusal behaviour is untouched and pinned untouched
 * (§7 Q4's fenced baseline; the harmonization is a recorded post-GR-2 candidate).
 *
 * ── THE FORCE AND THE COUNTERFORCE ARE THE SAME NUMBERS ─────────────────────────
 * The demand scores the proposal; THE DEPENDENCY FEAR re-reads that same evidence through
 * the pair's existing `dependency`/`leverage` axes and the proposer's insularity. A pact
 * that would bind too tightly is refused by exactly the numbers that invited it, and the
 * pin makes the counterforce WIN on a real fixture.
 *
 * THE ANSWER IS A TWO-SIDED CONJUNCTION and both arms are load-bearing: the offer must
 * clear the responder's own reserve (posture × risk appetite, raised by the proposer's
 * oathbreaker credibility), AND the responder's dependency fear must not win. Dropping
 * either arm is an executed mutant, and the no-overlap pin reds for it.
 *
 * ── WHAT THIS STAGE MINTS, AND WHAT IT STILL DOES NOT ───────────────────────────
 * ONE `wizard_news` kind: the signing beat, `signed` (cure lane LIT1b-pre U4, the GR-5e voice's
 * core pulled forward). GR-2 shipped ZERO kinds and pinned it, leaving §8's sentences to GR-3;
 * GR-3 landed its families and minted none, so a pact signed in peace was a treaty on the
 * panel that no Herald item ever announced (the LIT DEPENDENCY MAP: signatures, no news). The
 * beat is the annex's `# GR-2` `signed` block wired as authored, with its five joins in the same
 * commit. Refusals, no-overlaps, expiries and the war-overtaken closure still ride RECEIPTS and
 * the turning-point archive alone, and the vocabulary pin now asserts exactly that: one kind,
 * minted only on a signature.
 *
 * ── K3 ──────────────────────────────────────────────────────────────────────────
 * This file is the COMPOSER and therefore sits OUTSIDE the K3 zero-import set, exactly as
 * `sovereigntyMarketStage.js` does, with its own import list pinned instead (the P4
 * no-hidden-governor pattern). A court's beliefs about its NEIGHBOUR arrive through
 * `beliefRecord`; a court's knowledge of ITSELF is its own ground truth, which is knowledge
 * and not belief. The two leaves it hands those words to — `pactTriggers.js` and
 * `pactProposals.js` — ARE in the K3 set and can reach nothing that could hand a
 * negotiation a settlement's real strength, stock or pressure.
 *
 * ⚠ Every band in `PACT_FORMATION_TUNING` is UNSOAKED — §7 owns them, the owner signs them
 * at the soak redo under THE PROMISE.
 *
 * DARK ⇒ A COMPLETE NO-OP: the same worldState and settlementUpdates REFERENCES, zero reads
 * below the gate, zero receipts, zero draws.
 *
 * @enforced-by tests/domain/pactFormation.test.js,
 *   tests/domain/pactAmendment.test.js,
 *   tests/property/pactFormationDormancyFence.test.js,
 *   tests/lint/allianceWebRiskConsumers.walker.test.js
 */
import { clamp01 } from '../../kernel/math.js';
import { setSpatialLedger } from '../spatial/distanceRead.js';
import {
  DEVOTION_BANDS, PULL_BANDS, SCARCITY_BANDS,
  conditionsGroundTruth, devotionGroundTruth, scarcityGroundTruth,
} from './beliefAxisSubjects.js';
import { beliefRecord } from './beliefMap.js';
import { grammarReceipt } from './grammarNews.js';
import { credibilityScoreOf } from './informationStatecraft.js';
import { stampSworn } from './oathHolder.js';
import { amendPactInstrument, closeTermsBrokenByWar, termIdOf } from './pactAmendment.js';
import {
  openPactProposal, pactFormationActive, pactProposalsOf, prunePactProposals, settlePactProposal,
} from './pactProposals.js';
import { openRenegotiationDemands, settleRenewalProposal } from './pactRenewal.js';
import {
  dependencyFearOf, scoreFaithCommunion, scoreMigrationPressure, scoreSharedThreat, scoreTradeDemand,
} from './pactTriggers.js';
import { PEACE_TERMS_TUNING, TERM_CATALOG, orderTermsByAsk, termLabel } from './peaceTermsCatalog.js';
import { round4, treatyPairKey } from './peaceTermsPrimitives.js';
// The estate's ONE strength derivation, imported from the same module the two sibling
// readers use (mobilizationReactions.js, peaceReasons.js). No new edge: `beliefMap.js`,
// already imported above, imports these exact two symbols from here. `edgeKeyBetween` is
// the relationship plane's ONE pair reader (FPQ-35), from the same module, so no new edge
// either.
import { buildPressureSummary, edgeKeyBetween, settlementStrength } from './relationshipEvolution.js';
import {
  RELATIONSHIP_DEFAULTS, appendRelationshipTurningPoint, normalizeRelationshipType,
} from './relationshipState.js';
import { stablePart } from './stablePart.js';
import { courtPostureOf, courtRiskAppetiteOf } from './strategicPosture.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from './treatyClock.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { readAllianceWebRisk } from './warAllianceRisk.js';
import { canonicalAllianceRows } from './warCoalitionGraph.js';

/** ⚠ UNSOAKED — §7 owns these; the owner signs them at the soak redo. */
export const PACT_FORMATION_TUNING = Object.freeze({
  /** The value a court asks for before it will set its name to anything. */
  RESERVE_BASE01: 0.5,
  /** How much of that a bold court gives up — SP-C's learned appetite, spent. */
  RISK_APPETITE_RELIEF: 0.25,
  /** What a lineage that has disavowed before must make up in substance. Read off the ONE
   *  credibility reader, so GR-4's charge bites HERE the day it lands and reads
   *  clean-by-absence until then (the §3 declared degraded arm). */
  OATHBREAKER_PENALTY: 0.35,
  /** THE PRICE OF SPEAKING OUT OF POSTURE. An insular seat that proposes anyway is LEGAL
   *  and pays this, and its receipt says so — priced news, never forbidden (Req 10). */
  OUT_OF_POSTURE_PRICE01: 0.15,
  /** The refusal's whole cost: a banded trust delta and a memory. No grievance, no casus,
   *  no ratchet in either direction (J-GR-7's asymmetry). */
  REFUSAL_TRUST_DELTA: -0.04,
  /** THE REFUSAL IS THE COOLDOWN — the sovereignty market's "the treaty IS the memory"
   *  idiom, pointed at a pact that was never written. A pair whose relationship record
   *  carries a `pact_refused` turning point inside this band does not ask again, so the
   *  remembered refusal shapes the next proposal's odds by silencing it rather than by a
   *  second scoring surface. ZERO new keys: `turningPoints` already exists, capped at 24.
   *  ⚠ MEASURED LIMITATION, deliberate and recorded: a pair with NO relationship record has
   *  nowhere to remember, so it may ask again at the next dwell. The alternative was to mint
   *  a relationship edge from this stage, which would invent a tie two courts do not have —
   *  a far worse trade than a court that asks twice. */
  REFUSAL_COOLDOWN_TICKS: 52,
  /** The magnitude a peacetime sheet drafts at, as a fraction of the catalog's base. Peace
   *  asks for less than a victory takes — §1c, NO MARGIN IN PEACE. */
  PEACETIME_MAGNITUDE01: 0.5,
  /** THE SIGNING BEAT'S WEIGHT ON THE FEED (LIT1b-pre U4): the war door's own `treaty_signed`
   *  weight (peaceTerms.js signingBeat), so the two doors into the one instrument read alike.
   *  Presentation only; nothing in the world reads it. */
  SIGNING_BEAT_SEVERITY01: 0.55,
  SIGNING_BEAT_SCORE: 66,
});

const F = PACT_FORMATION_TUNING;

/**
 * THE DRAFT LENS — a RUNG LADDER per occasion, and how far up it the evidence reached.
 *
 * An occasion does not name one clause; it names a SET its family can offer, and the
 * crossing's own score decides which rung of that set gets written. A faint faith
 * communion writes a shared rite; a strong one writes restitution. Each rung is
 * `{min, terms}` where `min` is an INCLUSIVE lower bound on the clamped score, and a rung
 * is NON-CUMULATIVE: its list is the whole output, never an addition to the rungs below
 * it. Every produced ladder starts at `min: 0`, which is what preserves the GR-2 promise
 * that a crossed trigger always drafts something.
 *
 * `renegotiation` and `renewal` are the two empty ladders, and by design rather than as
 * tombstones: GR-5's renewal leaf drafts both from the STANDING instrument, never from a lens.
 * Handed to this drafter, either is refused at the draft with `no_draftable_family` in its own
 * receipt — visible, never silent — which is the direction the recorded orphan-vocabulary law
 * wants.
 *
 * ⚠ THE SIX BOUNDS ARE AUTHORED LITERALS AND THEY ARE UNSOAKED, exactly like every band
 * in `PACT_FORMATION_TUNING`. They are NOT derived from catalog weights and no code may
 * compute them from `TERM_CATALOG`: the ask ORDER is the catalog's price, the rung
 * THRESHOLD is a tuning decision, and collapsing the two would silently retune the world
 * every time a clause was repriced. The owner signs them at the soak redo under THE
 * PROMISE; this file does not tune them.
 * @type {Readonly<Record<string, ReadonlyArray<{min: number, terms: ReadonlyArray<string>}>>>}
 */
export const PACT_DRAFT_LENS = Object.freeze({
  faith_communion: Object.freeze([
    Object.freeze({ min: 0, terms: Object.freeze(['shared_rite']) }),
    Object.freeze({ min: 0.45, terms: Object.freeze(['pilgrimage_right', 'tolerance_guarantee']) }),
    Object.freeze({ min: 0.7, terms: Object.freeze(['missionary_access']) }),
    Object.freeze({ min: 0.9, terms: Object.freeze(['temple_restitution']) }),
  ]),
  migration_pressure: Object.freeze([
    Object.freeze({ min: 0, terms: Object.freeze(['migration_right']) }),
    Object.freeze({ min: 0.6, terms: Object.freeze(['labor_compact']) }),
    Object.freeze({ min: 0.85, terms: Object.freeze(['settlement_provision']) }),
  ]),
  shared_threat: Object.freeze([
    Object.freeze({ min: 0, terms: Object.freeze(['non_aggression']) }),
    Object.freeze({ min: 0.75, terms: Object.freeze(['non_aggression', 'mutual_defense']) }),
  ]),
  trade_demand: Object.freeze([
    Object.freeze({ min: 0, terms: Object.freeze(['resource_share']) }),
  ]),
  renegotiation: Object.freeze([]),
  renewal: Object.freeze([]),
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {string} */
function text(v) { return typeof v === 'string' && v.length > 0 ? v : ''; }
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** One regional graph edge, at the shape `edgeKeyBetween` declares it.
 *  @typedef {{ from?: unknown, to?: unknown, id?: unknown }} RegionalEdge */

/**
 * WHAT A COURT KNOWS ABOUT ITSELF. Its own granary, its own pull, its own rites — knowledge,
 * not belief, and the reason this composer sits outside the K3 set. `beliefRecord(x, x)` is
 * never written anywhere in this estate (the recorded absent-self-belief hazard), so a
 * self-read routed through the belief map would silently return nothing forever.
 *
 * ⚠ ITS OWN RITES ARE READ WHERE THE FAITH SUBSYSTEM KEEPS THEM (FPQ-27). The devotion used
 * to be read off a `religionState` key on the settlement record, a key NOTHING in the estate
 * writes (the observed-shape register's banked reader-with-no-writer row for this file), so
 * every court reported no devotion and the faith_communion occasion could never cross. A court's
 * religion state lives at `worldState.religionStates[id]`: `religiousContest.js ::
 * advanceReligionStates` writes it every tick, the pulse kernel folds it into the world, and
 * the belief map's devotion family bands every subject from the same record through the same
 * `devotionGroundTruth` (`beliefMap.js`). So what a court knows of its own rites and what
 * its neighbours come to believe of them are one reading of one record. Writing a
 * `religionState` onto the settlement instead was REFUSED: a second writer of faith state.
 * @param {unknown} settlement
 * @param {unknown} religionState the court's own record, from `ownFaithOf`
 * @returns {{scarcity: Record<string, unknown>, pull: string, devotion: string}}
 */
function selfBandsOf(settlement, religionState) {
  const row = recordOf(settlement);
  return {
    scarcity: recordOf(scarcityGroundTruth(row)),
    pull: text(recordOf(conditionsGroundTruth(row)).pullBand),
    devotion: text(devotionGroundTruth(religionState)),
  };
}

/** A COURT'S OWN RELIGION STATE, where the faith subsystem keeps it (FPQ-27): the one read of
 *  `worldState.religionStates` in this file. The empty record when the court keeps no faith.
 *  @param {Record<string, unknown>} worldState @param {string} id @returns {Record<string, unknown>} */
function ownFaithOf(worldState, id) {
  return recordOf(recordOf(recordOf(worldState).religionStates)[id]);
}

/** WHAT A COURT BELIEVES ABOUT ITS NEIGHBOUR — only ever through the belief map.
 *  @param {Record<string, unknown>} worldState @param {string} observerId @param {string} subjectId */
function believedBandsOf(worldState, observerId, subjectId) {
  const record = recordOf(beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), observerId, subjectId,
  ));
  return {
    scarcity: recordOf(record.scarcityBands),
    pull: text(recordOf(record.conditionsBands).pullBand),
    devotion: text(record.devotionBand),
  };
}

/**
 * THE FOUR CROSSINGS FOR ONE ORDERED PAIR, best first.
 *
 * `shared_threat` is the THIRD consumer of `readAllianceWebRisk` (WR-6) and consumes it
 * whole — the members, the risk and the BAND. It never rebuilds the depth-two walk and
 * never re-grades the intensity ladder; `tests/lint/allianceWebRiskConsumers.walker.test.js`
 * is the census that keeps that true, and this wave argues its own row into it.
 *
 * ⚠ `snapshot` USED TO STAND IN THIS SIGNATURE AND IN NO CALLER. It was a required member of
 * a type nothing supplied and this function never destructured, so every one of the three
 * call sites was a strict-mode error against a parameter that could not have been read. The
 * signature now names exactly what the body consumes.
 *
 * @param {{worldState: Record<string, unknown>, rows: unknown,
 *   fromId: string, toId: string, self: ReturnType<typeof selfBandsOf>,
 *   strengthFor: (id: string) => number, threatId: string}} input
 * @returns {Array<ReturnType<typeof scoreTradeDemand>>}
 */
function crossingsFor({ worldState, rows, fromId, toId, self, strengthFor, threatId }) {
  const believed = believedBandsOf(worldState, fromId, toId);
  const web = threatId
    ? readAllianceWebRisk({
      rows: /** @type {never} */ (rows), observerId: fromId, enemyId: threatId, worldState, strengthFor,
    })
    : { risk01: 0, band: 'quiet' };
  return [
    scoreTradeDemand({ ladder: SCARCITY_BANDS, proposerBands: self.scarcity, counterpartyBands: believed.scarcity }),
    scoreFaithCommunion({ ladder: DEVOTION_BANDS, proposerWord: self.devotion, counterpartyWord: believed.devotion }),
    scoreMigrationPressure({ ladder: PULL_BANDS, proposerWord: self.pull, counterpartyWord: believed.pull }),
    scoreSharedThreat({ band: web.band, risk01: web.risk01, threatId }),
  ].filter((crossing) => crossing.crossed)
    .sort((a, b) => (b.score01 - a.score01) || codepoint(a.trigger, b.trigger));
}

/**
 * WHICH RUNG THIS OCCASION REACHED, ask-ordered.
 *
 * The HIGHEST rung whose `min` is at or below the clamped score wins, and its list is the
 * whole answer. The reduce picks the greatest qualifying `min` rather than trusting the
 * table's authoring order, so a ladder that is ever re-sorted cannot silently select a
 * lower rung. Ties are impossible — every `min` in a ladder is a distinct literal — so no
 * tie-break is authored, because authoring one would be unreachable code.
 *
 * ⚠ THERE IS NO SECOND CLAMP HERE. `clamp01`'s standing policy is
 * `Number.isFinite(x) ? … : 0`, so a `NaN`, an `Infinity` and a word all land on rung
 * zero, and an out-of-range number lands at the nearest end, out of the ONE primitive.
 *
 * @param {string} trigger a `PACT_TRIGGERS` member
 * @param {unknown} score01 the crossing's own score
 * @returns {ReadonlyArray<string>} the rung's term list, ask-ordered; `[]` when none
 */
function rungTermsFor(trigger, score01) {
  const s = clamp01(Number(score01));
  const ladder = PACT_DRAFT_LENS[trigger] || [];
  const reached = ladder.reduce(
    (best, rung) => (rung.min <= s && (!best || rung.min > best.min) ? rung : best),
    /** @type {{min: number, terms: ReadonlyArray<string>} | null} */ (null),
  );
  // THE ASK LADDER'S INTENDED CONSUMER (GR-3a shipped it exported and consumed by
  // nothing). It also DROPS any type the catalog does not carry, which is what makes the
  // spec read below total — a phantom rung would draft a clause nothing can execute.
  return orderTermsByAsk(reached ? reached.terms : []);
}

/**
 * DRAFT THE SHEET. The rung's terms, each expanded over its OWN beneficiaries and keyed
 * family × beneficiary, so a reciprocal grain-for-ore bargain is two economic terms with
 * OPPOSED beneficiaries on ONE instrument and a symmetric non-aggression clause is one
 * term beneficiary `both`.
 *
 * ⚠ EXPANSION IS PER TERM AND IT HAPPENS AFTER SELECTION, and the order of those two acts
 * is load-bearing: one rung can carry clauses of different symmetry, so a `symmetric`
 * computed once for the whole sheet would give every clause the first one's direction.
 *
 * ⚠ THE BENEFICIARY IS THE OBLIGATION AXIS, not a label. The party a clause runs TO is
 * OWED it; the OTHER party promised it, and therefore pays it, is watched on it, and is
 * named if it defaults. That is what the receipt below says in words, and what
 * `grantTermFor` and `termObligationOf` read. Inverting this expansion would quietly
 * reverse every negotiated clause in the world, so it is never "tidied".
 *
 * @param {{trigger: string, fromId: string, toId: string, reciprocal: boolean,
 *   tick: number, score01?: unknown}} input
 * @returns {{terms: Array<Record<string, unknown>>, refusal: string}}
 */
export function draftPactSheet({ trigger, fromId, toId, reciprocal, tick, score01 }) {
  const types = rungTermsFor(trigger, score01);
  if (!types.length) return { terms: [], refusal: 'no_draftable_family' };
  const terms = types.flatMap((type) => {
    const spec = TERM_CATALOG[type];
    // SYMMETRIC means MUTUAL — both courts hold it and nothing is handed over — and it is
    // a different fact from RECIPROCAL, which is two opposed one-sided promises.
    const symmetric = spec.family === 'security';
    const beneficiaries = symmetric ? ['both'] : reciprocal ? [fromId, toId] : [fromId];
    return beneficiaries.map((beneficiary) => {
      /** @type {Record<string, unknown>} */
      const term = {
        type,
        family: spec.family,
        magnitude: round4(spec.baseMag * F.PEACETIME_MAGNITUDE01),
        mintedTick: tick,
        expiresTick: tick + Math.round(spec.baseYears * PEACE_TERMS_TUNING.TICKS_PER_YEAR),
        weightSpent: spec.weight,
        complianceState: 'honored',
        trueState: 'honored',
        burden01: 0,
        // T4, drop-when-absent: this key exists ONLY on a negotiated term, so every treaty
        // the engine has ever minted stays byte-identical and the war door's family-only
        // stacking cell is unchanged.
        beneficiary,
        receipt: beneficiary === 'both'
          ? `${fromId} and ${toId} promise ${termLabel(type)} to each other for ${spec.baseYears} years.`
          : `${beneficiary === fromId ? toId : fromId} promises ${termLabel(type)} to ${beneficiary}`
            + ` for ${spec.baseYears} years.`,
      };
      if (spec.stream) { term.deliveredToVictor = 0; term.extractedFromLoser = 0; }
      if (spec.executor === 'seam') term.seam = true;
      return term;
    });
  });
  return { terms, refusal: '' };
}

/**
 * THE RESPONDER'S RESERVE — posture, appetite, and what the asker's word is worth.
 * @param {{worldState: Record<string, unknown>, responderId: string, proposerId: string,
 *   tick: number}} input
 * @returns {Readonly<{reserve01: number, receipt: string}>}
 */
export function reserveFor({ worldState, responderId, proposerId, tick }) {
  const entry = recordOf(recordOf(worldState).dispositionStats)[responderId] || null;
  const actor = { kind: 'settlement', id: responderId };
  const rules = recordOf(worldState).simulationRules;
  const posture = courtPostureOf(actor, entry, { rules });
  const appetite = courtRiskAppetiteOf(actor, entry, { rules });
  const disavowal = clamp01(-Number(credibilityScoreOf(worldState, proposerId, tick)) || 0);
  const reserve = clamp01(
    F.RESERVE_BASE01 * posture.factor
    - F.RISK_APPETITE_RELIEF * (appetite.present ? appetite.stock01 : 0)
    + F.OATHBREAKER_PENALTY * disavowal,
  );
  return Object.freeze({
    reserve01: reserve,
    receipt: `${posture.receipt} ${appetite.receipt}`
      + (disavowal > 0 ? ' They will not treat with this court on its word alone.' : ''),
  });
}

/**
 * THE ANSWER. Two arms, both live, and the verdict names which one spoke.
 *
 * `edges` is the tick's regional edge list, and it is how the pair's relationship record is
 * found (FPQ-35): the record is keyed by the edge that joins the two courts. Absent, or with
 * no edge between them, there is no record and the reliance axes read the neutral defaults.
 * @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   responderDemand01: number, tick: number, edges?: ReadonlyArray<RegionalEdge>}} input
 * @returns {Readonly<{verdict: string, receipt: string, offer01: number, reserve01: number}>}
 */
export function answerPactProposal({ worldState, proposal, responderDemand01, tick, edges = [] }) {
  const proposerId = String(proposal.from);
  const responderId = String(proposal.to);
  const terms = Array.isArray(recordOf(proposal.sheet).terms)
    ? /** @type {Array<Record<string, unknown>>} */ (recordOf(proposal.sheet).terms) : [];
  // A term's magnitude arrives as `unknown` — the sheet is DM-editable and import-tolerant —
  // and the `typeof` narrows it without moving a value: `clamp01`'s policy is
  // `Number.isFinite(x) ? … : 0` over an UNCOERCED check, so a non-number already scored 0
  // here. Deliberately not `Number(term.magnitude)`, which would newly admit numeric strings.
  const substance = terms.length
    ? terms.reduce((sum, term) => sum
      + (typeof term.magnitude === 'number' ? clamp01(term.magnitude) : 0), 0) / terms.length : 0;
  const offer01 = clamp01(0.5 * substance + 0.5 * clamp01(responderDemand01));
  const { reserve01, receipt: reserveReceipt } = reserveFor({
    worldState, responderId, proposerId, tick,
  });
  const relation = relationshipRecordOf(worldState, pairKeyReader(edges), proposerId, responderId).state;
  const defaults = RELATIONSHIP_DEFAULTS[normalizeRelationshipType(text(relation.relationshipType))]
    || RELATIONSHIP_DEFAULTS.neutral;
  const posture = courtPostureOf({ kind: 'settlement', id: responderId },
    recordOf(recordOf(worldState).dispositionStats)[responderId] || null,
    { rules: recordOf(worldState).simulationRules });
  const fear = dependencyFearOf({
    demand01: offer01,
    dependency01: relation.dependency == null ? defaults.dependency : relation.dependency,
    leverage01: relation.leverage == null ? defaults.leverage : relation.leverage,
    insularity01: posture.direction === 'raise' ? 1 - posture.factor + F.OUT_OF_POSTURE_PRICE01 : 0,
  });
  // THE TWO-SIDED CONJUNCTION. Arm one is value, arm two is reliance, and a signature needs
  // BOTH. Dropping either is an executed mutant and the no-overlap pin reds for it.
  const clears = offer01 >= reserve01;
  if (clears && !fear.refuses) {
    return Object.freeze({
      verdict: 'signed', offer01, reserve01,
      receipt: `${reserveReceipt} The offer met what this court asked, and it can carry the reliance.`,
    });
  }
  return Object.freeze({
    verdict: clears ? 'refused' : 'no_overlap',
    offer01,
    reserve01,
    receipt: clears ? fear.receipt : `${reserveReceipt} The offer did not reach what this court asked.`,
  });
}

/**
 * THE SIGNED RECORD'S OWN COURT NAMES (TREATY-VOICE U1; FPQ-36, the owner's decision of
 * 2026-09-24: the names ride a NEW SAVED KEY on the signed record). A war settlement keeps
 * `victorName`/`loserName` and a sale `sellerName`/`buyerName`; a pact has no roles to hang
 * a name on, so the key is keyed by COURT, never by position. Null unless BOTH courts
 * resolve a real reader name (a name that only echoes the id is not a name), so a nameless
 * signature writes no key at all and its record is byte-identical to the day before.
 * READERS: `treatyOrientation.js :: treatyOrientationOf` (the negotiated arm), and through
 * it the lifecycle voice's lapse and default beats (`treatyLifecycleVoice.js`), which name
 * both courts on the Herald where they used to mint nothing.
 * LIFECYCLE: written once at the mint below; every later act (an amendment, a renewal, a
 * war's closure, a war's end absorbed) spreads the record and so carries it; legacy pacts
 * carry none and read `unknown`, as they always did (no migration: launch-shape
 * persistence, the stasis plan's no-preserved-data law).
 * @param {ReadonlyArray<string>} ids @param {(id: string) => unknown} settlementOf
 * @returns {Record<string, string> | null}
 */
function courtNamesOf(ids, settlementOf) {
  /** @type {Record<string, string>} */
  const names = {};
  for (const id of ids) {
    const name = text(recordOf(settlementOf(id)).name).trim();
    if (!name || name === id) return null;
    names[id] = name;
  }
  return names;
}

/**
 * MINT OR AMEND — the FOURTH transport into the one instrument.
 *
 * Where the pair already holds a document the sheet becomes a LINEAGE ACT on it (one record
 * at the pair key, V-1); where it does not, this mints. Either way the ledger gains no key
 * and the pair gains no second instrument.
 *
 * @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   tick: number, settlementOf?: (id: string) => unknown}} input
 * @returns {{worldState: Record<string, unknown>, minted: boolean, amended: boolean,
 *   refused: ReadonlyArray<{cell: string, type: string, receipt: string}>, receipt: string,
 *   added: ReadonlyArray<Record<string, unknown>>}}
 */
export function signPactProposal({ worldState, proposal, tick, settlementOf = () => null }) {
  // `added` (LIT1b-pre U4) is the clauses this signature actually wrote: every drafted term on a
  // mint, the non-colliding ones on an amendment, none when every clause collided. The signing
  // beat reads it to know what it may honestly say.
  const a = String(proposal.from);
  const b = String(proposal.to);
  // ⚠ THE INSTRUMENT RUNS FROM THE SIGNATURE, NOT FROM THE ASKING, and re-basing here is
  // what makes that true. The sheet was drafted when the proposal opened, so its terms
  // carry the DRAFT tick and a span derived from the catalog; a far court's answer can
  // arrive eighteen weeks later, and a clause that had already been running for eighteen
  // weeks when it was signed would quietly shorten every distant pact in the world. The
  // SPAN is preserved exactly; only its origin moves.
  // ⚠ THE ANNOTATION ON THE CONST IS LOAD-BEARING, not decoration. Spreading a
  // `Record<string, unknown>` into an object literal loses the index signature, so the mapped
  // rows inferred as `{mintedTick, expiresTick}` ALONE — and `term.weightSpent` below, a real
  // key every drafted term carries, did not exist on that type. Naming the row type restores
  // what a treaty clause actually is: an open record.
  /** @type {Array<Record<string, unknown>>} */
  const terms = /** @type {Array<Record<string, unknown>>} */ (recordOf(proposal.sheet).terms || [])
    .map((term) => ({
      ...term,
      mintedTick: tick,
      expiresTick: tick + (Number(term.expiresTick) - Number(term.mintedTick)),
    }));
  const ledger = { ...(treatyLedgerOf(/** @type {never} */ (worldState)) || {}) };
  const standingKey = ledger[treatyPairKey(a, b)] ? treatyPairKey(a, b)
    : ledger[treatyPairKey(b, a)] ? treatyPairKey(b, a) : '';
  if (standingKey) {
    const amendment = amendPactInstrument({
      treaty: recordOf(ledger[standingKey]), terms, tick,
    });
    if (amendment.added.length === 0) {
      return {
        worldState, minted: false, amended: false, refused: amendment.refused, added: [],
        receipt: 'Every clause offered collided with one this instrument already carries.',
      };
    }
    ledger[standingKey] = amendment.treaty;
    return {
      worldState: setSpatialLedger(worldState, 'treaties', ledger),
      minted: false,
      amended: true,
      refused: amendment.refused,
      added: amendment.added,
      receipt: `${a} and ${b} have written a new clause into the instrument that already stood between them.`,
    };
  }
  const [first, second] = [a, b].sort(codepoint);
  const partyNames = courtNamesOf([first, second], settlementOf);
  /** @type {Record<string, unknown>} */
  const treaty = {
    parties: [first, second],
    // T4, drop-when-absent: the saved court names (TREATY-VOICE U1), see `courtNamesOf`.
    ...(partyNames ? { partyNames } : {}),
    mintedTick: tick,
    budgetGranted: 0,
    budgetSpent: round4(terms.reduce((sum, term) => sum + (Number(term.weightSpent) || 0), 0)),
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
    terms: [...terms].sort((x, y) => codepoint(termIdOf(x), termIdOf(y))),
    complianceState: 'honored',
    // T4, drop-when-absent on every legacy record: this instrument says how it came to be,
    // and a legacy treaty that says nothing resolves to `dictated` AT READ, never rewritten.
    provenance: 'negotiated',
    // ⚠ WRITTEN DIRECTLY, NOT THROUGH `appendLineage`, and that is a measured correction.
    // `lineageOf` synthesizes the implied `formed` act for a record that carries no lineage
    // key — the legacy-tolerance read — so appending to a FRESH mint produced that implied
    // act AND the real one: the same formation recorded twice. A write path may never
    // materialize a read-time default.
    lineage: [{ act: 'formed', tick, termIds: terms.map(termIdOf).sort() }],
    receipts: [`Agreed in peace between ${first} and ${second}, and extracted from nobody.`],
  };
  stampSworn(treaty, { worldState, tick, ids: [first, second], settlementOf });
  ledger[treatyPairKey(first, second)] = treaty;
  return {
    worldState: setSpatialLedger(worldState, 'treaties', ledger),
    minted: true,
    amended: false,
    refused: Object.freeze([]),
    added: terms,
    receipt: `${first} and ${second} have set their names to it, in peace and not at a war's end.`,
  };
}

/**
 * THE CLAUSES AN AMENDMENT WROTE, in words (TREATY-VOICE U3): each catalogue label once, in the
 * order written, joined as a sentence joins them. A reciprocal ask writes one clause per court,
 * and naming the same clause twice would read as two. Never empty on a real amendment (a
 * wholly refused one mints no beat), and the fallback is still a sentence.
 * @param {ReadonlyArray<Record<string, unknown>>} terms @returns {string}
 */
function clauseListOf(terms) {
  const labels = [...new Set(terms.map((term) => `the ${termLabel(text(term.type))}`))];
  if (labels.length === 0) return 'a new clause';
  return labels.length === 1 ? labels[0] : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
}

/** The signing beat's kind: the annex's `# GR-2` `signed` block, the formation ending spoken on
 *  the Herald. */
const PACT_SIGNED_KIND = 'signed';

/**
 * THE TWO FACTS THE SIGNING'S PROSE MAY LEAN ON (A-26 in the annex): whether every court takes
 * something away (a clause both hold, or clauses owed to each), and whether a clause moves
 * goods (a catalogue stream). ONE context token, because the picker filters on one; `null` when
 * neither holds, so only the families honest about any signature can draw.
 * @param {ReadonlyArray<Record<string, unknown>>} terms @param {string} fromId @param {string} toId
 * @returns {string|null}
 */
function signingContextOf(terms, fromId, toId) {
  const owed = new Set(terms.map((term) => text(term.beneficiary)));
  const bothGain = owed.has('both') || (owed.has(fromId) && owed.has(toId));
  const goods = terms.some((term) => recordOf(TERM_CATALOG[text(term.type)]).stream === true);
  if (bothGain && goods) return 'both_gain_goods';
  if (bothGain) return 'both_gain';
  return goods ? 'goods' : null;
}

/**
 * THE SIGNING BEAT (cure lane LIT1b-pre U4; the GR-5e voice's core, pulled forward). A pact
 * signed in peace is ONE Herald item: the annex's `# GR-2` `signed` block, "formation ending;
 * Herald (the signing beat)", wired as authored, so every sentence it can say is annex-verbatim.
 * Minted and amended signatures both speak through it (the annex's own lineage note), and the
 * pool line is the annex's either way; the HEADLINE tells them apart (TREATY-VOICE U3): a fresh
 * signing says the courts set their names to terms, and an amendment names the clauses it wrote
 * into the instrument that already stood, because READ 3 heard a clause added to a standing
 * pact announced in the very words of a new one.
 * `{settlement}` is the court that ASKED and `{counterpart}` the court that answered, bound here
 * from the proposal row and never through `grammarSlotRoles`, because a negotiated instrument
 * has no treaty-level obligee. Both names must be real names or nothing is minted: a slug where a
 * town belongs is the fabrication the address law forbids. ⚠ The volume's "signing beat with
 * trigger named and transport mode recorded" is NOT carried as two fields: the wizard-news
 * normalizer names neither key, so both would be dropped at the first append and on every load
 * (the allowlist-rebuilder walker's DIRECTION 1), and naming them there is a persisted-shape
 * change, the owner's. The proposal receipt keeps both. `cause` is the cause row (L10): present only when a decree caused the signing, which is
 * structurally never until the host's answer lands (FPQ-1), and never defaulted.
 * @param {{tick: number, proposal: Record<string, unknown>, terms: ReadonlyArray<Record<string, unknown>>,
 *   fromName: string, toName: string, cause?: string, amended?: boolean}} input
 *   `terms` is what the signature WROTE (`signPactProposal`'s `added`), so on an amendment it is
 *   exactly the change; `amended` is that signature's own verdict.
 * @returns {Record<string, unknown>|null}
 */
export function pactSignedBeat({ tick, proposal, terms, fromName, toName, cause, amended = false }) {
  const fromId = String(proposal.from);
  const toId = String(proposal.to);
  if (!fromName || !toName) return null;
  const line = grammarReceipt(PACT_SIGNED_KIND, String(proposal.id),
    { settlement: fromName, counterpart: toName }, signingContextOf(terms, fromId, toId));
  if (!line) return null;
  return {
    id: `wizard_news.${Math.round(tick)}.${PACT_SIGNED_KIND}.${stablePart(fromId)}.${stablePart(toId)}`,
    kind: PACT_SIGNED_KIND,
    // ⛔ LITERAL, the grammar beats' own idiom: the mint scans (the Herald totality walker, the
    // letter's minter-totality arm, the impactKind voice walker) read `impactKind:` literals.
    impactKind: 'signed',
    significance: line.significance,
    severity: F.SIGNING_BEAT_SEVERITY01,
    score: F.SIGNING_BEAT_SCORE,
    tick,
    scope: 'regional',
    headline: amended
      ? `${fromName} and ${toName} have written ${clauseListOf(terms)} into the instrument that already stood between them`
      : `${fromName} and ${toName} have set their names to terms, in peace`,
    summary: line.line,
    reasons: ['The court that was asked weighed the terms on its own evidence, and they met what it asked of them.'],
    settlementIds: [fromId, toId],
    settlementNames: [fromName, toName],
    parties: [fromId, toId],
    ending: 'signed',
    familyId: line.familyId,
    audience: line.audience,
    section: line.section,
    tags: ['world_pulse', 'pact_grammar', 'formation'],
    ...(cause ? { cause } : {}),
  };
}

/**
 * THE ONE PLACE THIS FILE FINDS A RELATIONSHIP RECORD (the CR-WR10-G one-reader discipline,
 * applied to the other ledger this lane touches).
 *
 * ⚠ THE KEY IS THE REGIONAL EDGE'S OWN ID, AND TWO EARLIER SPELLINGS WERE MEASURED BUGS.
 * The first draft spelled `[a, b].sort().join('|')`, a key that exists nowhere in the
 * estate, and every pin still passed because the FIXTURE had been written to the same
 * invented spelling (the recorded fixture-mirrors-the-deriver class). The second minted
 * `rel.<a>.<b>` through `relationshipKeyFromEdge` on a bare `{from, to}`, which is only that
 * primitive's fallback for an edge with no id: every relationship writer keys its record by
 * the graph edge's id (`region/graph.js :: edgeIdFor`, `edge.<a>.<b>`), so the hostility
 * read, the refusal memory, the cooldown and the reliance axes never hit a live record
 * (FPQ-35; the LIT DEPENDENCY MAP measured every run's records as `edge.*`). The key now
 * comes from `keyOf`, the pass's pair reader over `edgeKeyBetween`, which is the reader the
 * plane's consumers share, so no key is spelled here at all. A pair no edge joins has no
 * record, and the empty record is the answer.
 *
 * @param {Record<string, unknown>} worldState @param {(a: string, b: string) => string|null} keyOf
 * @param {string} a @param {string} b
 * @returns {{key: string, state: Record<string, unknown>}}
 */
function relationshipRecordOf(worldState, keyOf, a, b) {
  const key = keyOf(a, b);
  if (!key) return { key: '', state: {} };
  return { key, state: recordOf(recordOf(recordOf(worldState).relationshipStates)[key]) };
}

/**
 * THE PASS'S PAIR READER: `edgeKeyBetween` over the tick's regional edges, remembered per
 * unordered pair. The answer depends on the edges alone, which do not move inside the pass,
 * and the crossing loop asks the same pair many times. `edgeBetween` matches either
 * direction and returns the first edge in graph order, so one answer serves both.
 * @param {ReadonlyArray<RegionalEdge>} edges
 * @returns {(a: string, b: string) => string|null}
 */
function pairKeyReader(edges) {
  /** @type {Map<string, string|null>} */
  const seen = new Map();
  return (a, b) => {
    const pair = a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
    if (!seen.has(pair)) seen.set(pair, edgeKeyBetween(edges, a, b));
    return seen.get(pair) ?? null;
  };
}

/**
 * EVERY PAIR THE GRAPH JOINS, once each, in its record key's codepoint order. The courts are
 * the edge's own two ends and never parsed back out of a key, because the key is an id.
 * @param {ReadonlyArray<RegionalEdge>} edges @param {(a: string, b: string) => string|null} keyOf
 * @returns {Array<{key: string, aId: string, bId: string}>}
 */
function edgePairsOf(edges, keyOf) {
  /** @type {Map<string, {key: string, aId: string, bId: string}>} */
  const pairs = new Map();
  for (const edge of edges) {
    const row = recordOf(edge);
    const aId = row.from != null ? String(row.from) : '';
    const bId = row.to != null ? String(row.to) : '';
    if (!aId || !bId || aId === bId) continue;
    const key = keyOf(aId, bId);
    if (key && !pairs.has(key)) pairs.set(key, { key, aId, bId });
  }
  return [...pairs.values()].sort((x, y) => codepoint(x.key, y.key));
}

/** ARE THESE TWO COURTS AT WAR? The relationship overlay is the estate's own durable
 *  "this is a war" mark — the same read `peaceTerms.js`'s PASS 1 uses to decide a war has
 *  ENDED, consumed here to decide one is on.
 *  @param {Record<string, unknown>} worldState @param {(a: string, b: string) => string|null} keyOf
 *  @param {string} a @param {string} b */
function hostileBetween(worldState, keyOf, a, b) {
  const { state } = relationshipRecordOf(worldState, keyOf, a, b);
  return normalizeRelationshipType(text(state.relationshipType)) === 'hostile';
}

/** HAS THIS PAIR ALREADY BEEN REFUSED, RECENTLY? The remembered refusal IS the cooldown;
 *  read off the relationship record's own archive, never stored a second time.
 *  @param {Record<string, unknown>} worldState @param {(a: string, b: string) => string|null} keyOf
 *  @param {string} a @param {string} b @param {number} tick @returns {boolean} */
function refusedWithinCooldown(worldState, keyOf, a, b, tick) {
  const { state } = relationshipRecordOf(worldState, keyOf, a, b);
  const points = Array.isArray(state.turningPoints) ? state.turningPoints : [];
  return points.some((point) => recordOf(point).kind === 'pact_refused'
    && tick - Number(recordOf(point).tick) <= F.REFUSAL_COOLDOWN_TICKS);
}

/** THE REFUSAL, REMEMBERED. A banded trust delta and a turning-point entry — no grievance,
 *  no casus, no ratchet toward war OR toward pacts (J-GR-7's asymmetry).
 *  @param {{worldState: Record<string, unknown>, keyOf: (a: string, b: string) => string|null,
 *   proposal: Record<string, unknown>, tick: number}} input @returns {Record<string, unknown>} */
function rememberRefusal({ worldState, keyOf, proposal, tick }) {
  const states = recordOf(recordOf(worldState).relationshipStates);
  const { key, state } = relationshipRecordOf(worldState, keyOf, String(proposal.from), String(proposal.to));
  if (!Object.keys(state).length) return worldState;
  const trust = clamp01(Number(state.trust) + F.REFUSAL_TRUST_DELTA);
  return {
    ...worldState,
    relationshipStates: {
      ...states,
      [key]: {
        ...state,
        trust,
        turningPoints: appendRelationshipTurningPoint(state, {
          tick: Math.round(tick),
          kind: 'pact_refused',
          summary: `${proposal.to} would not treat with ${proposal.from} over ${String(proposal.trigger).replace(/_/g, ' ')}.`,
        }),
      },
    },
  };
}

/**
 * @typedef {Object} PactAdvanceResult
 * @property {Record<string, unknown>} worldState  the SAME reference when nothing happened
 * @property {Array<Record<string, unknown>>} settlementUpdates  likewise
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries  the signing beats, and nothing else (see header)
 * @property {Array<Record<string, unknown>>} receipts
 */

/**
 * ADVANCE THE PEACETIME PACT LANE ONE TICK.
 *
 * ⚠ `strengthFor` IS DECLARED NULLABLE BECAUSE ITS DEFAULT IS `null`. The old spelling said
 * the parameter was a function or absent, while the destructuring default handed it `null` —
 * a signature that contradicted the line beneath it. The body's `strengthFor || (…)` fallback
 * is the whole point of the null: an absent reader means "use the bounded default read".
 *
 * `pressureIdx` is the per-tick pressure index the default strength reader needs. It is
 * NULLABLE for the same reason every other pressure consumer's is: an absent index yields a
 * zero pressure vector, which `settlementStrength` reads as "no pressure known" (the
 * `opportunism.js` idiom, `settlementStrength(item, {})`) rather than as zero strength.
 *
 * @param {{snapshot?: unknown, worldState: Record<string, unknown>,
 *   settlementUpdates?: Array<Record<string, unknown>>, digest?: unknown, season?: unknown,
 *   tick: number, strengthFor?: ((id: string) => number) | null, pressureIdx?: unknown}} args
 * @returns {PactAdvanceResult}
 */
export function advancePeacetimePacts({
  snapshot, worldState, settlementUpdates = [], digest = null, season = null, tick,
  strengthFor = null, pressureIdx = null,
}) {
  const inert = {
    worldState, settlementUpdates, changed: false, newsEntries: [], receipts: [],
  };
  // ── THE GATE. Dark ⇒ both references back, and not one read below runs. ──
  if (!pactFormationActive(worldState)) return inert;

  const items = Array.isArray(recordOf(snapshot).settlements)
    ? /** @type {Array<Record<string, unknown>>} */ (recordOf(snapshot).settlements) : [];
  if (items.length < 2) return inert;
  const freshest = new Map(settlementUpdates.map((u) => [String(u.saveId), recordOf(u.settlement)]));
  /** @param {string} id */
  const settlementOf = (id) => freshest.get(id)
    || recordOf(recordOf(items.find((it) => String(recordOf(it).id) === id)).settlement);
  const ids = items.map((it) => String(recordOf(it).id)).filter(Boolean).sort(codepoint);
  /** WHAT A COURT KNOWS OF ITSELF, read ONE way at every site below (FPQ-27): its freshest
   *  settlement and its own religion state. @param {string} id */
  const selfOf = (id) => selfBandsOf(settlementOf(id), ownFaithOf(worldState, id));
  /** THE SNAPSHOT ITEM, with the freshest settlement spliced over it — `settlementStrength`
   *  reads `item.settlement` (population, activeConditions) AND `item` (tier), so a bare
   *  record is not enough. @param {string} id @returns {Record<string, unknown>|null} */
  const itemOf = (id) => {
    const item = items.find((it) => String(recordOf(it).id) === id);
    const fresh = freshest.get(id);
    if (fresh) return item ? { ...recordOf(item), settlement: fresh } : { id, settlement: fresh };
    return item ? recordOf(item) : null;
  };
  /** A COURT'S READER NAME for the signing beat (U4), from the tick's snapshot item, or '' when
   *  none resolved: a name that is only the id echoed back is not a name, so the beat stays
   *  silent rather than print a slug. @param {string} id @returns {string} */
  const courtNameOf = (id) => {
    const item = recordOf(itemOf(id));
    const name = (text(item.name) || text(recordOf(item.settlement).name)).trim();
    return name && name !== id ? name : '';
  };
  // THE INJECTED STRENGTH READER, for the same reason the market stage injects three: standing
  // a war layer up inside every formation pin would turn this file into a war fixture.
  //
  // ⚠ THE DEFAULT USED TO READ `settlement.militaryStrength` — A FIELD NO PRODUCTION CODE
  // WRITES. Only `tests/helpers/pactFixture.js` ever set it, and the kernel injects no
  // `strengthFor`, so EVERY court in EVERY live world priced at 0 and the shared-threat
  // crossing could never clear its own floor band — while the sentence here claimed "the
  // alliance web's own battery proves the read". It did: against a fixture-only field
  // (§759.2 PACT-STRENGTH-ZERO, cured in T7/UNITS as a DECLARED SHIFT).
  //
  // The default is now the estate's ONE strength derivation, read exactly as the two
  // siblings read it — `mobilizationReactions.js` and `peaceReasons.js` both call
  // `settlementStrength(item, buildPressureSummary(pressureIdx, id))`. Memoized because the
  // depth-two web asks for the same court once per observer pair.
  /** @type {Map<string, number>} */
  const strengthCache = new Map();
  const strength = strengthFor
    || ((id) => {
      const cached = strengthCache.get(id);
      if (cached !== undefined) return cached;
      const item = itemOf(id);
      const value = item ? clamp01(Number(settlementStrength(item, buildPressureSummary(pressureIdx, id))) || 0) : 0;
      strengthCache.set(id, value);
      return value;
    });
  const rows = canonicalAllianceRows({ ...recordOf(snapshot), worldState });
  // THE TICK'S REGIONAL EDGES, read exactly as `canonicalAllianceRows` reads them one line up,
  // so the alliance web and every relationship read below see the same graph (FPQ-35).
  const graphEdges = recordOf(recordOf(snapshot).regionalGraph).edges;
  const bareEdges = recordOf(snapshot).relationships;
  /** @type {ReadonlyArray<RegionalEdge>} */
  const edges = Array.isArray(graphEdges) ? graphEdges : Array.isArray(bareEdges) ? bareEdges : [];
  const keyOf = pairKeyReader(edges);

  let state = worldState;
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  // ── 1. THE WAR-OVERTAKEN CLOSURE. A war has opened between courts who wrote something
  // down in peace; the negotiated clauses end and the receipt names the war that ate them.
  // The pairs are the GRAPH'S, each read through the one pair reader (FPQ-35). The old walk
  // parsed `rel.<a>.<b>` out of the record keys and so skipped every live record, whose key
  // is an edge id. ──
  for (const { aId, bId } of edgePairsOf(edges, keyOf)) {
    if (!hostileBetween(state, keyOf, aId, bId)) continue;
    const closure = closeTermsBrokenByWar({ worldState: state, aId, bId, tick });
    if (!closure.closed.length) continue;
    state = closure.worldState;
    receipts.push({
      kind: 'pact_broken_by_war', tick, fromId: aId, toId: bId,
      ending: 'broken_by_war', closed: closure.closed, receipt: closure.receipt,
    });
  }

  // ── 2. THE ANSWER, at the dwell the roads set. A responder that is no longer in the world
  // cannot answer, and the proposal expires unanswered — silence, honestly recorded. ──
  for (const proposal of pactProposalsOf(state)) {
    if (proposal.state !== 'open' || Number(proposal.answerDueTick) > tick) continue;
    const id = String(proposal.id);
    // A RESPONDER THAT IS NO LONGER IN THE WORLD, or a war that opened while the word was
    // still on the road, cannot answer. Both expire unanswered — and the second is the
    // honest one: a court does not sign a grain pact with the army it is fighting, and the
    // war is a louder answer than any refusal. Its clauses are closed by step 1 above; this
    // closes the QUESTION, which would otherwise be answered mid-war and re-signed forever.
    const unanswerable = !ids.includes(String(proposal.to))
      || hostileBetween(state, keyOf, String(proposal.from), String(proposal.to));
    if (unanswerable) {
      state = settlePactProposal({ worldState: state, id, state: 'expired' }).worldState;
      receipts.push({
        kind: 'pact_expired', tick, id, ending: 'expired_unanswered',
        receipt: 'No answer came, and the silence is the answer.',
      });
      continue;
    }
    const responderSelf = selfOf(String(proposal.to));
    const back = crossingsFor({
      worldState: state, rows, fromId: String(proposal.to), toId: String(proposal.from),
      self: responderSelf, strengthFor: strength, threatId: '',
    });
    const answer = answerPactProposal({
      worldState: state, proposal, responderDemand01: back.length ? back[0].score01 : 0, tick, edges,
    });
    // GR-5b/5c: a renewal or a demand settles in its own leaf (a clean lapse, or a strain for a refused demand); this pass writes what it hands back.
    const renewal = settleRenewalProposal({ worldState: state, proposal, answer, tick, settlementOf, snapshot });
    if (renewal) {
      state = renewal.ledger ? setSpatialLedger(renewal.worldState, 'treaties', renewal.ledger) : renewal.worldState;
      receipts.push(renewal.receipt);
      continue;
    }
    if (answer.verdict === 'signed') {
      const signed = signPactProposal({ worldState: state, proposal, tick, settlementOf });
      state = settlePactProposal({
        worldState: signed.worldState, id, state: signed.minted || signed.amended ? 'signed' : 'refused',
      }).worldState;
      receipts.push({
        kind: signed.minted || signed.amended ? 'pact_signed' : 'pact_refused', tick, id,
        ending: signed.minted || signed.amended ? 'signed' : 'refused',
        amended: signed.amended, stacking: signed.refused,
        offer01: answer.offer01, reserve01: answer.reserve01,
        receipt: `${answer.receipt} ${signed.receipt}`,
      });
      // U4: THE SIGNING BEAT, one Herald item per signature; TREATY-VOICE U3: an amendment says
      // what it wrote rather than announcing a new pact.
      const beat = signed.minted || signed.amended ? pactSignedBeat({
        tick, proposal, terms: signed.added, amended: signed.amended,
        fromName: courtNameOf(String(proposal.from)), toName: courtNameOf(String(proposal.to)),
      }) : null;
      if (beat) newsEntries.push(beat);
      continue;
    }
    state = rememberRefusal({ worldState: state, keyOf, proposal, tick });
    // BOTH verdicts settle the row `refused`: the question WAS answered, and which answer it
    // was lives on the ENDING. `expired` is reserved for the proposal nobody could answer.
    state = settlePactProposal({ worldState: state, id, state: 'refused' }).worldState;
    receipts.push({
      kind: answer.verdict === 'refused' ? 'pact_refused' : 'pact_no_overlap', tick, id,
      ending: answer.verdict === 'refused' ? 'refused' : 'no_overlap',
      offer01: answer.offer01, reserve01: answer.reserve01, receipt: answer.receipt,
    });
  }

  // ── 3. THE CROSSINGS. Every ordered pair, best occasion first, one proposal per pair. ──
  for (const fromId of ids) {
    const self = selfOf(fromId);
    for (const toId of ids) {
      if (toId === fromId
        || hostileBetween(state, keyOf, fromId, toId)
        || refusedWithinCooldown(state, keyOf, fromId, toId, tick)) continue;
      const threat = ids.find((other) => other !== fromId && other !== toId
        && hostileBetween(state, keyOf, fromId, other)) || '';
      const crossings = crossingsFor({
        worldState: state, rows, fromId, toId, self, strengthFor: strength, threatId: threat,
      });
      if (!crossings.length) continue;
      const best = crossings[0];
      const reciprocal = crossingsFor({
        worldState: state, rows, fromId: toId, toId: fromId,
        self: selfOf(toId), strengthFor: strength, threatId: '',
      }).some((back) => back.trigger === best.trigger);
      const sheet = draftPactSheet({
        trigger: best.trigger, fromId, toId, reciprocal, tick, score01: best.score01,
      });
      if (sheet.refusal) {
        receipts.push({
          kind: 'pact_not_drafted', tick, fromId, toId, trigger: best.trigger,
          refusal: sheet.refusal,
          receipt: `${best.receipt} No clause this estate carries yet could say it.`,
        });
        continue;
      }
      const opened = openPactProposal({
        worldState: state, from: fromId, to: toId, trigger: best.trigger,
        sheet: { terms: sheet.terms }, tick, digest, season,
      });
      state = opened.worldState;
      receipts.push({
        kind: opened.proposal ? 'pact_proposed' : 'pact_not_proposed', tick, fromId, toId,
        trigger: best.trigger, refusal: opened.refusal,
        transport: opened.proposal ? opened.proposal.transport : '',
        receipt: `${best.receipt} ${opened.receipt}`,
      });
    }
  }

  // GR-5c: a court whose believed lead has swung past the band demands new terms on its instrument's year-turn, from its own leaf.
  const demands = openRenegotiationDemands({ worldState: state, ids, strengthFor: strength, tick, digest, season });
  state = demands.worldState; receipts.push(...demands.receipts);

  // ── 4. A QUEUE, NOT AN ARCHIVE. Settled rows are gone once their receipt has landed. ──
  state = prunePactProposals({ worldState: state });
  return {
    worldState: state,
    settlementUpdates,
    changed: state !== worldState,
    newsEntries,
    receipts,
  };
}
