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
 * ── WHAT THIS WAVE DELIBERATELY DOES NOT MINT ───────────────────────────────────
 * ZERO new `wizard_news` kinds. The stage's whole story rides RECEIPTS and the relationship
 * record's turning-point archive, and the Herald sentences §8 promises land with GR-3, the
 * second slice of this same flag, which mints the term families those sentences name (a
 * "grain for ore" line is not interesting until the families it announces exist). The
 * choice is recorded, vetoable, and PINNED: a vocabulary pin asserts this module mints no
 * news kind, so it reds the day GR-3 adds one — the seam-2 tripwire shape.
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
import { credibilityScoreOf } from './informationStatecraft.js';
import { stampSworn } from './oathHolder.js';
import { amendPactInstrument, closeTermsBrokenByWar, termIdOf } from './pactAmendment.js';
import {
  openPactProposal, pactFormationActive, pactProposalsOf, prunePactProposals, settlePactProposal,
} from './pactProposals.js';
import {
  dependencyFearOf, scoreFaithCommunion, scoreMigrationPressure, scoreSharedThreat, scoreTradeDemand,
} from './pactTriggers.js';
import { PEACE_TERMS_TUNING, TERM_CATALOG, termLabel } from './peaceTermsCatalog.js';
import { round4, treatyPairKey } from './peaceTermsPrimitives.js';
import {
  RELATIONSHIP_DEFAULTS, appendRelationshipTurningPoint, normalizeRelationshipType,
  relationshipKeyFromEdge,
} from './relationshipState.js';
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
});

const F = PACT_FORMATION_TUNING;

/**
 * THE DRAFT LENS — which term type each occasion may write, TODAY.
 *
 * Two rows are deliberately EMPTY and they are a TOMBSTONE, not an oversight: faith and
 * population terms are GR-3's catalog rows, and `renewal` is GR-5's. A trigger with no
 * draftable family scores, crosses, and is then refused at the draft with
 * `no_draftable_family` in its own receipt — visible, never silent. THIS IS A TRIPWIRE: the
 * day GR-3 mints those rows the pin below it reds and demands this table be widened in the
 * same commit, which is the direction the recorded orphan-vocabulary law wants.
 * @type {Readonly<Record<string, string>>}
 */
export const PACT_DRAFT_LENS = Object.freeze({
  faith_communion: '',
  migration_pressure: '',
  renewal: '',
  shared_threat: 'non_aggression',
  trade_demand: 'resource_share',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function recordOf(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {string} */
function text(v) { return typeof v === 'string' && v.length > 0 ? v : ''; }
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * WHAT A COURT KNOWS ABOUT ITSELF. Its own granary, its own pull, its own rites — knowledge,
 * not belief, and the reason this composer sits outside the K3 set. `beliefRecord(x, x)` is
 * never written anywhere in this estate (the recorded absent-self-belief hazard), so a
 * self-read routed through the belief map would silently return nothing forever.
 * @param {unknown} settlement
 * @returns {{scarcity: Record<string, unknown>, pull: string, devotion: string}}
 */
function selfBandsOf(settlement) {
  const row = recordOf(settlement);
  return {
    scarcity: recordOf(scarcityGroundTruth(row)),
    pull: text(recordOf(conditionsGroundTruth(row)).pullBand),
    devotion: text(devotionGroundTruth(row.religionState)),
  };
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
 * @param {{worldState: Record<string, unknown>, snapshot: unknown, rows: unknown,
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
 * DRAFT THE SHEET. One term per crossing side, keyed family × beneficiary, so a reciprocal
 * grain-for-ore bargain is two economic terms with OPPOSED beneficiaries on ONE instrument
 * and a symmetric non-aggression clause is one term beneficiary `both`.
 * @param {{trigger: string, fromId: string, toId: string, reciprocal: boolean, tick: number}} input
 * @returns {{terms: Array<Record<string, unknown>>, refusal: string}}
 */
export function draftPactSheet({ trigger, fromId, toId, reciprocal, tick }) {
  const type = PACT_DRAFT_LENS[trigger] || '';
  if (!type) return { terms: [], refusal: 'no_draftable_family' };
  const spec = TERM_CATALOG[type];
  if (!spec) return { terms: [], refusal: 'no_draftable_family' };
  const symmetric = spec.family === 'security';
  const beneficiaries = symmetric ? ['both'] : reciprocal ? [fromId, toId] : [fromId];
  const terms = beneficiaries.map((beneficiary) => {
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
      // T4, drop-when-absent: this key exists ONLY on a negotiated term, so every treaty the
      // engine has ever minted stays byte-identical and the war door's family-only stacking
      // cell is unchanged.
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
 * @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   responderDemand01: number, tick: number}} input
 * @returns {Readonly<{verdict: string, receipt: string, offer01: number, reserve01: number}>}
 */
export function answerPactProposal({ worldState, proposal, responderDemand01, tick }) {
  const proposerId = String(proposal.from);
  const responderId = String(proposal.to);
  const terms = Array.isArray(recordOf(proposal.sheet).terms)
    ? /** @type {Array<Record<string, unknown>>} */ (recordOf(proposal.sheet).terms) : [];
  const substance = terms.length
    ? terms.reduce((sum, term) => sum + clamp01(term.magnitude), 0) / terms.length : 0;
  const offer01 = clamp01(0.5 * substance + 0.5 * clamp01(responderDemand01));
  const { reserve01, receipt: reserveReceipt } = reserveFor({
    worldState, responderId, proposerId, tick,
  });
  const relation = relationshipRecordOf(worldState, proposerId, responderId).state;
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
 * MINT OR AMEND — the FOURTH transport into the one instrument.
 *
 * Where the pair already holds a document the sheet becomes a LINEAGE ACT on it (one record
 * at the pair key, V-1); where it does not, this mints. Either way the ledger gains no key
 * and the pair gains no second instrument.
 *
 * @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   tick: number, settlementOf?: (id: string) => unknown}} input
 * @returns {{worldState: Record<string, unknown>, minted: boolean, amended: boolean,
 *   refused: ReadonlyArray<{cell: string, type: string, receipt: string}>, receipt: string}}
 */
export function signPactProposal({ worldState, proposal, tick, settlementOf = () => null }) {
  const a = String(proposal.from);
  const b = String(proposal.to);
  // ⚠ THE INSTRUMENT RUNS FROM THE SIGNATURE, NOT FROM THE ASKING, and re-basing here is
  // what makes that true. The sheet was drafted when the proposal opened, so its terms
  // carry the DRAFT tick and a span derived from the catalog; a far court's answer can
  // arrive eighteen weeks later, and a clause that had already been running for eighteen
  // weeks when it was signed would quietly shorten every distant pact in the world. The
  // SPAN is preserved exactly; only its origin moves.
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
        worldState, minted: false, amended: false, refused: amendment.refused,
        receipt: 'Every clause offered collided with one this instrument already carries.',
      };
    }
    ledger[standingKey] = amendment.treaty;
    return {
      worldState: setSpatialLedger(worldState, 'treaties', ledger),
      minted: false,
      amended: true,
      refused: amendment.refused,
      receipt: `${a} and ${b} have written a new clause into the instrument that already stood between them.`,
    };
  }
  const [first, second] = [a, b].sort(codepoint);
  /** @type {Record<string, unknown>} */
  const treaty = {
    parties: [first, second],
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
    receipt: `${first} and ${second} have set their names to it, in peace and not at a war's end.`,
  };
}

/**
 * THE ONE PLACE THIS FILE COMPOSES A RELATIONSHIP KEY (the CR-WR10-G one-reader
 * discipline, applied to the other ledger this lane touches).
 *
 * ⚠ THE KEY IS `rel.A.B` AND IT IS DIRECTED, and both halves of that were a measured bug.
 * The first draft spelled it `[a, b].sort().join('|')` — a hand-rolled key that exists
 * nowhere in the estate — and every pin still passed, because the FIXTURE had been written
 * to the same invented spelling. That is the recorded fixture-mirrors-the-deriver class
 * exactly: the arms were dead and self-consistently green, and only driving a REAL
 * consumer (`canonicalAllianceRows`, which returned an empty web) exposed it. The key is
 * now minted by the estate's own primitive, and because that primitive is DIRECTED the
 * record is looked for under both spellings — the same both-directions read the treaty
 * pair key already takes.
 *
 * @param {Record<string, unknown>} worldState @param {string} a @param {string} b
 * @returns {{key: string, state: Record<string, unknown>}}
 */
function relationshipRecordOf(worldState, a, b) {
  const states = recordOf(recordOf(worldState).relationshipStates);
  const forward = String(relationshipKeyFromEdge({ from: a, to: b }));
  const backward = String(relationshipKeyFromEdge({ from: b, to: a }));
  const key = states[forward] ? forward : backward;
  return { key, state: recordOf(states[key]) };
}

/** ARE THESE TWO COURTS AT WAR? The relationship overlay is the estate's own durable
 *  "this is a war" mark — the same read `peaceTerms.js`'s PASS 1 uses to decide a war has
 *  ENDED, consumed here to decide one is on.
 *  @param {Record<string, unknown>} worldState @param {string} a @param {string} b */
function hostileBetween(worldState, a, b) {
  const { state } = relationshipRecordOf(worldState, a, b);
  return normalizeRelationshipType(text(state.relationshipType)) === 'hostile';
}

/** HAS THIS PAIR ALREADY BEEN REFUSED, RECENTLY? The remembered refusal IS the cooldown;
 *  read off the relationship record's own archive, never stored a second time.
 *  @param {Record<string, unknown>} worldState @param {string} a @param {string} b
 *  @param {number} tick @returns {boolean} */
function refusedWithinCooldown(worldState, a, b, tick) {
  const { state } = relationshipRecordOf(worldState, a, b);
  const points = Array.isArray(state.turningPoints) ? state.turningPoints : [];
  return points.some((point) => recordOf(point).kind === 'pact_refused'
    && tick - Number(recordOf(point).tick) <= F.REFUSAL_COOLDOWN_TICKS);
}

/** THE REFUSAL, REMEMBERED. A banded trust delta and a turning-point entry — no grievance,
 *  no casus, no ratchet toward war OR toward pacts (J-GR-7's asymmetry).
 *  @param {{worldState: Record<string, unknown>, proposal: Record<string, unknown>,
 *   tick: number}} input @returns {Record<string, unknown>} */
function rememberRefusal({ worldState, proposal, tick }) {
  const states = recordOf(recordOf(worldState).relationshipStates);
  const { key, state } = relationshipRecordOf(worldState, String(proposal.from), String(proposal.to));
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
 * @property {Array<Record<string, unknown>>} newsEntries  ALWAYS empty in GR-2 (see header)
 * @property {Array<Record<string, unknown>>} receipts
 */

/**
 * ADVANCE THE PEACETIME PACT LANE ONE TICK.
 *
 * @param {{snapshot?: unknown, worldState: Record<string, unknown>,
 *   settlementUpdates?: Array<Record<string, unknown>>, digest?: unknown, season?: unknown,
 *   tick: number, strengthFor?: (id: string) => number}} args
 * @returns {PactAdvanceResult}
 */
export function advancePeacetimePacts({
  snapshot, worldState, settlementUpdates = [], digest = null, season = null, tick,
  strengthFor = null,
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
  // THE INJECTED STRENGTH READER, for the same reason the market stage injects three: the
  // alliance web's own battery proves the read, and standing a war layer up inside every
  // formation pin would turn this file into a war fixture. The default is a bounded read of
  // the freshest record, which is what the web then filters through the observer's belief.
  const strength = strengthFor
    || ((id) => clamp01(Number(recordOf(settlementOf(id)).militaryStrength) || 0));
  const rows = canonicalAllianceRows({ ...recordOf(snapshot), worldState });
  const relationshipStates = recordOf(recordOf(worldState).relationshipStates);

  let state = worldState;
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];

  // ── 1. THE WAR-OVERTAKEN CLOSURE. A war has opened between courts who wrote something
  // down in peace; the negotiated clauses end and the receipt names the war that ate them. ──
  for (const key of Object.keys(relationshipStates).sort(codepoint)) {
    if (normalizeRelationshipType(text(recordOf(relationshipStates[key]).relationshipType)) !== 'hostile') continue;
    // `rel.<a>.<b>` — the estate's own directed spelling, parsed rather than re-derived,
    // and a key that is not that shape is skipped instead of being guessed at.
    const parts = key.split('.');
    const [, aId, bId] = parts;
    if (parts.length !== 3 || parts[0] !== 'rel' || !aId || !bId) continue;
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
      || hostileBetween(state, String(proposal.from), String(proposal.to));
    if (unanswerable) {
      state = settlePactProposal({ worldState: state, id, state: 'expired' }).worldState;
      receipts.push({
        kind: 'pact_expired', tick, id, ending: 'expired_unanswered',
        receipt: 'No answer came, and the silence is the answer.',
      });
      continue;
    }
    const responderSelf = selfBandsOf(settlementOf(String(proposal.to)));
    const back = crossingsFor({
      worldState: state, rows, fromId: String(proposal.to), toId: String(proposal.from),
      self: responderSelf, strengthFor: strength, threatId: '',
    });
    const answer = answerPactProposal({
      worldState: state, proposal, responderDemand01: back.length ? back[0].score01 : 0, tick,
    });
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
      continue;
    }
    state = rememberRefusal({ worldState: state, proposal, tick });
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
    const self = selfBandsOf(settlementOf(fromId));
    for (const toId of ids) {
      if (toId === fromId
        || hostileBetween(state, fromId, toId)
        || refusedWithinCooldown(state, fromId, toId, tick)) continue;
      const threat = ids.find((other) => other !== fromId && other !== toId
        && hostileBetween(state, fromId, other)) || '';
      const crossings = crossingsFor({
        worldState: state, rows, fromId, toId, self, strengthFor: strength, threatId: threat,
      });
      if (!crossings.length) continue;
      const best = crossings[0];
      const reciprocal = crossingsFor({
        worldState: state, rows, fromId: toId, toId: fromId,
        self: selfBandsOf(settlementOf(toId)), strengthFor: strength, threatId: '',
      }).some((back) => back.trigger === best.trigger);
      const sheet = draftPactSheet({ trigger: best.trigger, fromId, toId, reciprocal, tick });
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

  // ── 4. A QUEUE, NOT AN ARCHIVE. Settled rows are gone once their receipt has landed. ──
  state = prunePactProposals({ worldState: state });
  return {
    worldState: state,
    settlementUpdates,
    changed: state !== worldState,
    newsEntries: [],
    receipts,
  };
}
