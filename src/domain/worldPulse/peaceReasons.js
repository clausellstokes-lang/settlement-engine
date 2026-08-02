/**
 * domain/worldPulse/peaceReasons.js — W-PEACE-1: THE CAUSAL REASONS LAYER
 * (peace side) + the dramatic-irony read-model (DESIGN_PEACE_ENGINE.md §14.2/§14.4).
 *
 * REASONS FOR PEACE accumulate on LIVE WAR pairs (deployments — the one-army
 * ledger is the engine's war record), one directed entry per belligerent per
 * foe: `${party}>${foe}` is party's accumulated case for peace with foe. The
 * record shape, fold, aggregate, factor and gate are the SHARED substrate from
 * warReasons.js — the §14.3 symmetry law enforced by construction (the two
 * sides cannot drift in shape because they are the same code).
 *
 * THE BLAINEY MECHANIC (design §1, the wave's soul): wars end when both
 * courts' BELIEVED win-margins converge. Each side's margin is composed from
 * readBeliefStrength — self reads truth (a court knows its own strength), the
 * foe reads the observer's BANDED BELIEF, never ground truth. Divergence =
 * |marginA + marginB| (both believing they are winning pushes the sum
 * positive); fighting is information because battle outcomes reach beliefs
 * ONLY through the existing rumor→belief pipe (fieldBattleNews →
 * advanceRumorLedgers → advanceBeliefMaps) — this module adds NO belief write
 * and NO truth leak. When the belief layer is dormant, both margins read
 * truth, the sum is exactly 0, and convergence is full — Blainey-correct:
 * no fog, no illusion, wars end when the material balance says so.
 *
 * ACCUMULATION IS DETERMINISTIC (no rng); the §H loaded draw that consumes
 * the ledger is the existing sue_for_peace softmax weight (the weights ARE
 * the reasons). Gate, dormancy, ledger discipline: see warReasons.js.
 */

import {
  peaceCausalActive, reasonPairKey, foldPairReasons,
  aggregateReasons01, topReasons, REASON_TUNING,
  WAR_REASON_TYPES, PEACE_REASON_TYPES, REASON_MIRRORS,
} from './warReasons.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { peaceReceipt } from './eventProse.js';
import { buildPressureSummary, settlementStrength } from './relationshipEvolution.js';
import { readBeliefStrength } from './beliefMap.js';
import { findCrossPressuredMediator, fracturesAbandoning, treatyDocument } from './peaceTerms.js';
import { strangulationFelt01 } from './supplyWebWarfare.js';
// W-MOMENTUM Stage 0(a) — a naval BLOCKADE of the belligerent's own port strangles its
// commerce the same as a supply-web siege (design §4: "a blockade alone strangles commerce").
// 0 when no naval ledger / no blockade ⇒ byte-identical.
import { blockadeStrangulationOf } from '../spatial/navalLayer.js';
// W-CONVERGENCE — the foreign_clash intensity for the pair (the spheres_understanding
// fuel). 0 when the intervention layer is dark ⇒ byte-identical. One-directional.
import { foreignClashIntensityOf } from './convergence.js';
// D4 (DESIGN_SIM_DEPTH_R2): balance_restored — the peace mirror of fear_of_dominance. Reads
// the SAME belief-side hegemony sphere context; 0 when no sphere ⇒ byte-identical.
import { makeHegemonyFear } from './hegemonyFear.js';
// hopelessness — the §14.3-named mirror of opportunism. THE SAME believed vulnerability
// gradient the war side reads, taken with the opposite sign, off the SAME leaf: one
// measurement, so the casus and its mirror cannot drift. 0 when the gradient favours this
// party (that is the war side's appetite) ⇒ byte-identical.
import { makeOpportunismRead } from './opportunism.js';
// common_rite — the mirror of sacred_claim, off the SAME closed faith×alignment quadrant.
// 0 when the faith flag is dark or either town names no patron ⇒ byte-identical.
import { makeSacredClaimRead } from './sacredClaim.js';
import { makeLineageClaimRead } from './lineageClaim.js';
import { lineagePeaceTransitionNewsEntries } from './lineageNews.js';
// D7 (DESIGN_SIM_DEPTH_R2 §D7): the two reframe peace mirrors — debt_forgiven (aid re-read as a
// gift again) + bonds_of_commerce (the trade tie re-read as a binding mutual commerce). Pure
// reads over THIS tick's reframe ledger (written by advanceWarReasons, which runs first). 0 when
// the reframe layer is dark ⇒ byte-identical. reframeKernel is a leaf (never imports back).
import { debtForgiven01, bondsOfCommerce01 } from './reframeKernel.js';
import { seasonForTick } from './worldState.js';
import { warFrontsInto } from './warFrontReads.js';
import { clamp01 } from '../../kernel/math.js';

// ── Peace-side tuning (bounded named constants — owner-retunable) ───────────

export const PEACE_REASON_TUNING = Object.freeze({
  /** |marginA + marginB| that fully blocks peace (divergence scale). */
  BLAINEY_DIVERGENCE_SCALE: 0.35,
  /** Trade vs economy blend for the strangulation-felt read. */
  STRANGLE_TRADE_W: 0.6,
  STRANGLE_ECONOMY_W: 0.4,
  /** Present-score for a cross-pressured mediator standing between the pair. */
  MEDIATION_PRESENT: 0.6,
  /** Present-score for the harvest imperative (autumn: levies wanted home). */
  HARVEST_PRESENT: 0.5,
  /** Realignment: a COMMON third attacker on both belligerents / distinct thirds. */
  REALIGNMENT_COMMON_THIRD: 0.8,
  REALIGNMENT_DISTINCT_THIRDS: 0.4,
});

// ── The peace-side scorers (pure, individually pinned) ──────────────────────

/**
 * EXHAUSTION (§14.2 legitimacy/domestic): the existing non-reverting
 * war-exhaustion scar, read verbatim (0..1).
 * @param {{ scar01: number }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreExhaustion({ scar01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(scar01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: peaceReceipt('exhaustion', seed) };
}

/**
 * BELIEF CONVERGENCE — THE BLAINEY READ (§1/§14.2 informational). marginSelf =
 * believed(self) − believed(foe), composed per side from readBeliefStrength.
 * Both-believe-winning ⇒ the margins share a sign ⇒ |sum| large ⇒ divergence
 * blocks peace. Beliefs consistent (fighting taught both courts the same
 * truth) ⇒ marginA ≈ −marginB ⇒ |sum| ≈ 0 ⇒ convergence.
 * @param {{ marginA: number, marginB: number }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreBeliefConvergence({ marginA, marginB }, /** @type {string | undefined} */ seed) {
  const divergence = Math.abs((Number(marginA) || 0) + (Number(marginB) || 0));
  const score = clamp01(1 - divergence / PEACE_REASON_TUNING.BLAINEY_DIVERGENCE_SCALE);
  if (score <= 0) return { score: 0, receipt: '' };
  const converged = score >= 0.75;
  return {
    score,
    receipt: converged
      ? peaceReceipt('belief_convergence.converged', seed)
      : peaceReceipt('belief_convergence.drifting', seed),
  };
}

/**
 * ECONOMIC STRANGULATION FELT (§14.2 no-other-options): the belligerent's own
 * trade/economy pressure — the severed routes and drained treasury it can
 * feel, off the same pressure index every contest reads.
 *
 * W-DOCTRINE-1 (SUPPLY-WEB WARFARE) FEED: a LIVE indirect campaign strangling
 * this town's supply web elevates the felt strangulation above the generic
 * pressure baseline — a directed siege of the granary villages, not just a
 * thin market. `strangulation01` (0 when the doctrine is dark — strangulationFelt01
 * returns 0) is the strangulation intensity from every campaign plan targeting
 * this belligerent. ABSENT ⇒ the reading is BYTE-IDENTICAL (Math.max(base, 0)
 * === base; the receipt branch stays the baseline copy).
 *
 * W-MOMENTUM Stage 0(a) BLOCKADE FEED: `blockade01` (0 when no fleet holds this
 * belligerent's port ⇒ byte-identical) is the naval strangulation of a blockaded
 * port. It elevates the felt strangulation the same as the supply-web siege, with
 * its own receipt when it is the dominant pressure.
 * @param {{ trade01: number, economy01: number, strangulation01?: number, blockade01?: number }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreEconomicStrangulation({ trade01, economy01, strangulation01 = 0, blockade01 = 0 }, /** @type {string | undefined} */ seed) {
  const base = clamp01(
    PEACE_REASON_TUNING.STRANGLE_TRADE_W * clamp01(Number(trade01) || 0)
    + PEACE_REASON_TUNING.STRANGLE_ECONOMY_W * clamp01(Number(economy01) || 0),
  );
  const strangle = clamp01(Number(strangulation01) || 0);
  const blockade = clamp01(Number(blockade01) || 0);
  const felt = clamp01(Math.max(base, strangle, blockade));
  if (felt <= 0) return { score: 0, receipt: '' };
  let branch = 'base';
  if (felt > base) branch = blockade >= strangle ? 'blockade' : 'supplyweb';
  return { score: felt, receipt: peaceReceipt(`economic_strangulation.${branch}`, seed) };
}

/**
 * COALITION FRACTURE (§14.2): allies peeled away from a shared siege. Presence
 * requires a remembered peak — the fold carries {peakAllies, nowAllies}
 * evidence so the record itself receipts the peel.
 * @param {{ peakAllies: number, nowAllies: number }} args
 * @returns {{ score: number, receipt: string, evidence?: Record<string, number> }}
 */
export function scoreCoalitionFracture({ peakAllies, nowAllies }, /** @type {string | undefined} */ seed) {
  const peak = Math.max(0, Math.floor(Number(peakAllies) || 0));
  const now = Math.max(0, Math.floor(Number(nowAllies) || 0));
  if (peak <= 0 || now >= peak) return { score: 0, receipt: '' };
  const score = clamp01((peak - now) / peak);
  return {
    score,
    receipt: peaceReceipt('coalition_fracture', seed, { peel: peak - now, peak }),
    evidence: { peakAllies: peak, nowAllies: now },
  };
}

/**
 * CROSS-PRESSURED MEDIATION (§14.2 moral/faith): a third settlement torn
 * between the belligerents (cohesionWeave's exported crossPressureMediation —
 * the E1a read, consumed here for the first time). Impulse is binary in the
 * weave; presence carries the mediator's name in the receipt.
 * @param {{ impulse: number, mediatorName: string }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreMediation({ impulse, mediatorName }, /** @type {string | undefined} */ seed) {
  const on = clamp01(Number(impulse) || 0);
  if (on <= 0) return { score: 0, receipt: '' };
  const score = clamp01(PEACE_REASON_TUNING.MEDIATION_PRESENT * on);
  // Every mediation variant LEADS with the mediator's name (the named-mediator receipt law).
  return { score, receipt: peaceReceipt('mediation', seed, { mediatorName: mediatorName || 'A neighbour' }) };
}

/**
 * THE HARVEST IMPERATIVE (§14.2 economic): autumn — levies wanted home for
 * the harvest before the hungry gap.
 * @param {{ season: string }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreHarvestPressure({ season }, /** @type {string | undefined} */ seed) {
  if (String(season) !== 'autumn') return { score: 0, receipt: '' };
  return { score: PEACE_REASON_TUNING.HARVEST_PRESENT, receipt: peaceReceipt('harvest_pressure', seed) };
}

/**
 * THE REALIGNMENT (§14.2 — "yesterday's enemies, today's new best friends"):
 * a common third attacker menacing BOTH belligerents makes continuing their
 * war jointly irrational; distinct third threats on each still soften it.
 * @param {{ commonThird: string | null, bothBesetByThirds: boolean }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreRealignment({ commonThird, bothBesetByThirds }, /** @type {string | undefined} */ seed) {
  if (commonThird) {
    return {
      score: PEACE_REASON_TUNING.REALIGNMENT_COMMON_THIRD,
      receipt: peaceReceipt('realignment.common', seed),
    };
  }
  if (bothBesetByThirds) {
    return {
      score: PEACE_REASON_TUNING.REALIGNMENT_DISTINCT_THIRDS,
      receipt: peaceReceipt('realignment.distinct', seed),
    };
  }
  return { score: 0, receipt: '' };
}

/**
 * SPHERES UNDERSTANDING (W-CONVERGENCE §4 — the mirror of foreign_clash): two sponsors
 * bleeding for opposite claimants on the same field have the mutual-disengagement ground
 * to settle ZONES OF INFLUENCE instead of a wider war. The pressure to reach an
 * understanding rises with the clash intensity. 0 when the intervention layer is dark ⇒
 * byte-identical. @param {{ clash01: number }} args @returns {{ score: number, receipt: string }}
 */
export function scoreSpheresUnderstanding({ clash01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(clash01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: peaceReceipt('spheres_understanding', seed) };
}

/**
 * DEBT FORGIVEN (§D7 — the DISTINCT mirror of ingratitude_debt). The both-signs reconciliation
 * lane has re-read the old aid as a gift again (gift_forgiven / unintended_kindness), and the
 * grievance loses its cause. REFRAME-FED: 0 when the reframe layer is dark ⇒ byte-identical.
 * @param {{ forgiven01?: number }} args @returns {{ score: number, receipt: string }}
 */
export function scoreDebtForgiven({ forgiven01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(forgiven01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: peaceReceipt('debt_forgiven', seed) };
}

/**
 * BONDS OF COMMERCE (§D7 — the DISTINCT mirror of dependency_by_design). The same trade tie,
 * re-read as a mutual bond that makes war too costly for either court (commercial
 * interdependence). REFRAME-FED: 0 when the reframe layer is dark ⇒ byte-identical.
 * @param {{ bonds01?: number }} args @returns {{ score: number, receipt: string }}
 */
export function scoreBondsOfCommerce({ bonds01 }, /** @type {string | undefined} */ seed) {
  const score = clamp01(Number(bonds01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: peaceReceipt('bonds_of_commerce', seed) };
}

// ── The factor (the consumption read — bounded, centered on 1.0) ────────────

/**
 * The peace-reason modulator for a directed pair: 1.0 exactly when dark or
 * absent; up to 1 + PEACE_FACTOR_W when the case saturates. Consumed at the
 * settlementStrategy sue_for_peace weight seam.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {unknown} foeId @param {readonly string[] | null | undefined} dissolvedCauseTypes
 * @returns {number}
 */
export function peaceReasonFactor(worldState, partyId, foeId, dissolvedCauseTypes = null) {
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) return 1;
  const ledger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  if (!ledger) return 1;
  const entry = withoutDissolvedCauseMirrors(ledger[reasonPairKey(partyId, foeId)], dissolvedCauseTypes);
  const aggregate = aggregateReasons01(entry);
  if (aggregate <= 0) return 1;
  return 1 + REASON_TUNING.PEACE_FACTOR_W * aggregate;
}

/**
 * The pair's peace-reason entry (for receipts). Null when dark/absent.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {unknown} foeId @param {readonly string[] | null | undefined} dissolvedCauseTypes
 * @returns {import('./warReasons.js').ReasonPairEntry | null}
 */
export function peaceReasonsFor(worldState, partyId, foeId, dissolvedCauseTypes = null) {
  const ledger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  if (!ledger) return null;
  return withoutDissolvedCauseMirrors(ledger[reasonPairKey(partyId, foeId)], dissolvedCauseTypes);
}

/**
 * A dissolved founding cause already contributes to the termination read. Its peace
 * mirror must not load the same sue-for-peace choice a second time.
 * @param {import('./warReasons.js').ReasonPairEntry | null | undefined} entry
 * @param {unknown} dissolvedCauseTypes
 * @returns {import('./warReasons.js').ReasonPairEntry | null}
 */
function withoutDissolvedCauseMirrors(entry, dissolvedCauseTypes) {
  if (!entry) return null;
  const causes = Array.isArray(dissolvedCauseTypes) ? dissolvedCauseTypes : [];
  const excluded = /** @type {Set<string>} */ (new Set(causes.map((type) => REASON_MIRRORS[/** @type {keyof typeof REASON_MIRRORS} */ (type)]).filter(Boolean)));
  if (!excluded.size) return entry;
  const reasons = Object.fromEntries(Object.entries(entry.reasons || {}).filter(([type]) => !excluded.has(type)));
  return Object.keys(reasons).length ? { ...entry, reasons } : null;
}

// ── THE IRONY READ-MODEL (§14.4 legibility of motive) ───────────────────────

/**
 * One row of the causal brief.
 * @typedef {Object} CausalBriefRow
 * @property {string} type
 * @property {boolean} present
 * @property {number} score
 * @property {string} receipt
 * @property {number | null} sinceTick
 */

/**
 * The dramatic-irony causal brief for a directed war pair: every typed reason
 * on both sides with presence flags, the rendered WHY line — "N of M peace
 * reasons now present[; this war is dying]" — and, when a treaty stands between
 * the pair, the §14.4 TREATY LINE ("the peace holds by two terms of five; the
 * tribute frays"). Pure read; safe on any worldState (dark ⇒ all-absent rows,
 * "0 of 7", treatyLine null).
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {unknown} foeId
 * @returns {{ war: CausalBriefRow[], peace: CausalBriefRow[],
 *            warPresent: number, peacePresent: number, line: string,
 *            treatyLine: string | null }}
 */
export function warCausalBrief(worldState, partyId, foeId) {
  const warLedger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'warReasons'));
  const peaceLedger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  const key = reasonPairKey(partyId, foeId);
  const rows = (
    /** @type {readonly string[]} */ types,
    /** @type {import('./warReasons.js').ReasonPairEntry | null | undefined} */ entry,
  ) => types.map((type) => {
    const rec = entry?.reasons?.[type];
    return {
      type,
      present: !!rec,
      score: rec ? rec.score : 0,
      receipt: rec ? rec.receipt : '',
      sinceTick: rec ? rec.sinceTick : null,
    };
  });
  const war = rows(WAR_REASON_TYPES, warLedger?.[key]);
  const peace = rows(PEACE_REASON_TYPES, peaceLedger?.[key]);
  const warPresent = war.filter((r) => r.present).length;
  const peacePresent = peace.filter((r) => r.present).length;
  const dying = peacePresent >= REASON_TUNING.IRONY_DYING_AT;
  const line = `${peacePresent} of ${PEACE_REASON_TYPES.length} peace reasons now present${dying ? '; this war is dying' : ''}`;
  // §14.4 the treaty line — the fraying peace beneath the brewing war (a treaty
  // between the pair renders "the peace holds by N terms of M; the X frays").
  const treaty = treatyDocument(worldState, key);
  const treatyLine = treaty?.summary ? treaty.summary.line : null;
  return { war, peace, warPresent, peacePresent, line, treatyLine };
}

// ── The mover ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PeaceReasonsAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the peace-reason ledger one tick. DETERMINISTIC (no rng); gate
 * absent ⇒ immediate no-op. War pairs come from worldState.deployments (the
 * one-army ledger): each deployment attacker→target yields BOTH directed
 * entries (each belligerent holds its own case for peace). Ledger discipline
 * mirrors advanceWarReasons (fold, serialize-compare, drop-when-empty).
 *
 * @param {{ snapshot: { byId?: Map<string, { id: string, name?: string,
 *                         settlement?: Record<string, unknown>,
 *                         causal?: { scores?: Record<string, number> } }>,
 *                       regionalGraph?: { edges?: Array<Record<string, unknown>> } },
 *           worldState: Record<string, unknown>,
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           pIndex?: Record<string, unknown> | null,
 *           tick: number,
 *           blaineyCredibility?: ((subjectId: string, believedStrength: number) => number) | null }} args
 *   W-DOCTRINE-2: the credibility-discount closure for the Blainey subject-side reads
 *   (info-statecraft layer lit). ABSENT ⇒ byte-identical.
 * @returns {PeaceReasonsAdvanceResult}
 */
export function advancePeaceReasons({ snapshot, worldState, graph, pIndex = null, tick, blaineyCredibility = null }) {
  // ── DORMANCY GATE (§8): absent ⇒ an immediate no-op. No key, no read. ──
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { worldState, changed: false, newsEntries: [] };
  }

  const deployments = /** @type {Record<string, { targetId?: unknown }>} */ (
    worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const prevLedger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  const liveGraph = (graph && Array.isArray(graph.edges) ? graph : null) || snapshot?.regionalGraph || null;
  // D4: the hegemony fear context (same belief-side read as the war side) — balance_restored
  // rises as a feared sphere crumbles. hasSphere false ⇒ 0 everywhere ⇒ byte-identical.
  const hegemonyFear = makeHegemonyFear({ worldState, snapshot });
  // The predation + faith contexts, built ONCE per pass — the SAME two leaves the war
  // mover builds, so both sides of each mirror come off one reading.
  const opportunismRead = makeOpportunismRead({ snapshot, worldState });
  const sacredClaimRead = makeSacredClaimRead({ snapshot, worldState });
  const lineageClaimRead = makeLineageClaimRead({ snapshot, worldState, graph: liveGraph });

  // The live war pairs, both directions, codepoint-ordered.
  /** @type {Map<string, { partyId: string, foeId: string }>} */
  const pairs = new Map();
  for (const attackerId of Object.keys(deployments).sort()) {
    const rec = deployments[attackerId];
    const targetId = rec?.targetId != null ? String(rec.targetId) : '';
    if (!targetId) continue;
    const a = String(attackerId);
    pairs.set(reasonPairKey(a, targetId), { partyId: a, foeId: targetId });
    pairs.set(reasonPairKey(targetId, a), { partyId: targetId, foeId: a });
  }
  const orderedKeys = [...pairs.keys()].sort();

  // Truth strength lookup (the beliefs' fallback + self read), memoized.
  /** @type {Map<string, number>} */
  const strengthCache = new Map();
  const strengthFor = (/** @type {string} */ id) => {
    if (strengthCache.has(id)) return /** @type {number} */ (strengthCache.get(id));
    const item = snapshot?.byId?.get?.(id);
    const s = item ? settlementStrength(item, buildPressureSummary(pIndex, id)) : 0;
    strengthCache.set(id, s);
    return s;
  };

  const warExhaustion = /** @type {Record<string, unknown>} */ (
    worldState.warExhaustion && typeof worldState.warExhaustion === 'object' ? worldState.warExhaustion : {});
  const season = seasonForTick(Number(
    /** @type {{ calendar?: { elapsedWeeks?: unknown } }} */ (worldState).calendar?.elapsedWeeks) || 0).season;

  /** @type {import('./warReasons.js').ReasonLedger} */
  const nextLedger = {};
  const newsEntries = [];
  for (const key of orderedKeys) {
    const { partyId, foeId } = /** @type {{ partyId: string, foeId: string }} */ (pairs.get(key));

    // THE BLAINEY MARGINS — self reads truth, the foe reads BELIEF (never truth).
    // W-DOCTRINE-2: the SUBJECT-side believed strength (the second term of each margin)
    // is credibility-discounted when the info-statecraft layer is lit — a proven liar's
    // claimed strength is trusted less, so the courts' reckonings fail to reconcile and
    // the war runs longer. ABSENT ⇒ the raw read passes through ⇒ byte-identical.
    const discBelief = (/** @type {string} */ subjectId, /** @type {number} */ raw) =>
      blaineyCredibility ? blaineyCredibility(subjectId, raw) : raw;
    const marginA = readBeliefStrength(partyId, partyId, worldState, strengthFor(partyId))
      - discBelief(foeId, readBeliefStrength(partyId, foeId, worldState, strengthFor(foeId)));
    const marginB = readBeliefStrength(foeId, foeId, worldState, strengthFor(foeId))
      - discBelief(partyId, readBeliefStrength(foeId, partyId, worldState, strengthFor(partyId)));

    const pressures = buildPressureSummary(pIndex, partyId);

    // Coalition fracture: co-besiegers of MY current target (attacker side
    // only). The PEAK ally count is entry-level memo — it must be remembered
    // from BEFORE the peel (a reason record only exists once the score clears
    // the threshold, so the memory cannot live inside the record).
    const myTarget = deployments[partyId]?.targetId != null ? String(deployments[partyId].targetId) : '';
    let fracture = { score: 0, receipt: '' };
    /** @type {Record<string, number> | null} */
    let memo = null;
    if (myTarget) {
      let nowAllies = 0;
      for (const otherId of Object.keys(deployments)) {
        if (otherId === partyId) continue;
        if (String(deployments[otherId]?.targetId || '') === myTarget) nowAllies += 1;
      }
      // Consume the typed FRACTURE RECORD (W-PEACE-3 §7): a co-besieger that took
      // a SEPARATE EXIT signs a fracture naming this party among the ABANDONED.
      // Each such record is a peer that peeled — fold its count into the PEAK so
      // the fracture stays legible even after the deserter's deployment is
      // recalled (the record rescues the peel the live-deployment count misses).
      const recentDeserters = fracturesAbandoning(worldState, partyId, tick).length;
      const peakAllies = Math.max(nowAllies + recentDeserters, nowAllies, Number(prevLedger?.[key]?.memo?.peakAllies) || 0);
      if (peakAllies > 0) memo = { peakAllies };
      fracture = scoreCoalitionFracture({ peakAllies, nowAllies }, key);
    }

    // Mediation: the first (codepoint-ordered) third settlement cross-pressured
    // between the pair, via the exported cohesionWeave read.
    const mediator = findCrossPressuredMediator(snapshot, liveGraph, partyId, foeId);

    // Realignment: a common third attacker on both, or distinct thirds on each.
    const third = thirdThreatRead(deployments, liveGraph, partyId, foeId);

    const lineageStanding = lineageClaimRead.lineageStandingOf(partyId, foeId);
    const kinshipBond = lineageClaimRead.kinshipBondOf(partyId, foeId);
    const computed = [
      { type: 'exhaustion', ...scoreExhaustion({ scar01: Number(warExhaustion[partyId]) || 0 }, key) },
      { type: 'belief_convergence', ...scoreBeliefConvergence({ marginA, marginB }, key) },
      {
        type: 'economic_strangulation',
        // W-DOCTRINE-1: elevate on a live supply-web strangulation of THIS belligerent
        // (strangulationFelt01 = 0 when the doctrine is dark ⇒ byte-identical).
        ...scoreEconomicStrangulation({
          trade01: Number(pressures?.trade) || 0,
          economy01: Number(pressures?.economy) || 0,
          strangulation01: strangulationFelt01(worldState, partyId),
          // W-MOMENTUM Stage 0(a): a blockade of THIS belligerent's own port
          // strangles its commerce (0 when no fleet holds it ⇒ byte-identical).
          blockade01: blockadeStrangulationOf(worldState, partyId),
        }, key),
      },
      { type: 'coalition_fracture', ...fracture },
      { type: 'mediation', ...scoreMediation({ impulse: mediator ? 1 : 0, mediatorName: mediator?.name || '' }, key) },
      { type: 'harvest_pressure', ...scoreHarvestPressure({ season }, key) },
      { type: 'realignment', ...scoreRealignment(third, key) },
      // W-CONVERGENCE: the mirror of foreign_clash — clashing sponsors settling spheres (0 when dark).
      { type: 'spheres_understanding', ...scoreSpheresUnderstanding({ clash01: foreignClashIntensityOf(worldState, partyId, foeId) }, key) },
      // D4: the balance restored as a once-feared sphere centred on foeId crumbles (0 when foeId
      // centres no sphere, partyId is its subordinate, or no hegemony ⇒ byte-identical).
      { type: 'balance_restored', ...hegemonyFear.balanceRestoredOf(partyId, foeId) },
      // D7: the reframe peace mirrors — partyId has re-read foeId's old aid as a gift again, or
      // its trade tie with foeId as a binding mutual commerce. 0 when the reframe layer is dark /
      // no such bright reading ⇒ byte-identical (reframe reads THIS tick's fresh ledger).
      { type: 'debt_forgiven', ...scoreDebtForgiven({ forgiven01: debtForgiven01(worldState, partyId, foeId) }, key) },
      { type: 'bonds_of_commerce', ...scoreBondsOfCommerce({ bonds01: bondsOfCommerce01(worldState, partyId, foeId) }, key) },
      // HOPELESSNESS: partyId believes foeId could bear this war far longer than it can —
      // the vulnerability gradient of the war side, read from the losing end. No capability
      // damper: being unable to march is part of being hopeless, never a reason to fight on.
      { type: 'hopelessness', ...opportunismRead.hopelessnessOf(partyId, foeId) },
      // COMMON RITE: the two courts already stand on one floor. Distinct from `mediation`,
      // which is a THIRD party standing between them.
      { type: 'common_rite', ...sacredClaimRead.commonRiteOf(partyId, foeId) },
      // WR-3: the peace mirror is the same surviving founding-edge and inversion
      // read as lineage_claim. Corroborated care restores the bond strongly
      // enough to defeat the claim; no second evidence model can drift here.
      { type: 'kinship_bond', ...kinshipBond },
    ];

    const entry = foldPairReasons(prevLedger?.[key], computed, tick, memo);
    if (entry) nextLedger[key] = entry;
    newsEntries.push(...lineagePeaceTransitionNewsEntries({
      snapshot,
      standing: lineageStanding,
      previousReason: prevLedger?.[key]?.reasons?.kinship_bond,
      currentReason: entry?.reasons?.kinship_bond,
      tick,
    }));
  }

  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? nextLedger : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false, newsEntries };
  }
  const nextWorldState = hasNext
    ? setSpatialLedger(worldState, 'peaceReasons', nextLedger)
    : dropSpatialLedger(worldState, 'peaceReasons');
  return { worldState: nextWorldState, changed: true, newsEntries };
}

// ── Internal reads ───────────────────────────────────────────────────────────

// (findCrossPressuredMediator + faithProximityOf now live in peaceTerms.js — the
// single source both the mint and this mediation reason share, so the treaty's
// named broker and the peace reason can never drift.)

/**
 * The third-threat read for realignment: attackers (by deployment or live
 * war_front) menacing each belligerent, excluding the pair itself. A COMMON
 * third attacker beats distinct thirds.
 * @param {Record<string, { targetId?: unknown }>} deployments
 * @param {{ edges?: Array<Record<string, unknown>> } | null} graph
 * @param {string} partyId @param {string} foeId
 * @returns {{ commonThird: string | null, bothBesetByThirds: boolean }}
 */
function thirdThreatRead(deployments, graph, partyId, foeId) {
  const attackersOf = (/** @type {string} */ id, /** @type {string} */ excluding) => {
    /** @type {Set<string>} */
    const out = new Set();
    for (const attackerId of Object.keys(deployments)) {
      if (attackerId === excluding || attackerId === id) continue;
      if (String(deployments[attackerId]?.targetId || '') === id) out.add(attackerId);
    }
    // warFrontsInto returns the ATTACKER IDS (provenance-gated: war-layer
    // fronts only, never hostile-relationship labels).
    for (const fromId of warFrontsInto(graph, id)) {
      if (fromId && fromId !== excluding && fromId !== id) out.add(fromId);
    }
    return out;
  };
  const thirdsOnParty = attackersOf(partyId, foeId);
  const thirdsOnFoe = attackersOf(foeId, partyId);
  let commonThird = null;
  for (const c of [...thirdsOnParty].sort()) {
    if (thirdsOnFoe.has(c)) { commonThird = c; break; }
  }
  return { commonThird, bothBesetByThirds: thirdsOnParty.size > 0 && thirdsOnFoe.size > 0 };
}

// ── THE FORCEABLE VERB: SUE_FOR_PEACE (the counterpart criterion) ────────────
//
// The peace-side mirror of warReasons.declareCasus, under the same posture:
// a PURE, GATED worldState mutation that the W-COMPOSER-2 realm manifest now
// WRAPS verbatim (SUE_FOR_PEACE in realmManifest.js — same-function law);
// never registered in the settlement-scoped manifest — see declareCasus's proof
// (the applyEvent pipeline has no worldState channel; realm verbs are the
// walker's documented W-COMPOSER-2 deferral). Preview≡apply by construction.
//
// The order stamps the EXISTING recall contract — `recalled: { cause, tick }`
// on the live deployment — which warDeployment's withdrawal path resolves next
// tick as an outcome:'withdrawal' through the deploymentReturn homecoming
// (the same stamp shape applyWorldPulse's sue_for_peace apply arm writes).
// The verb pins prove the war layer executes a decree-stamped recall end to
// end, so the contract cannot silently drift.

/** The DM-facing refusal prose per veto code (W-COMPOSER-2's VETO_PROSE feed). */
export const PEACE_VETO_PROSE = Object.freeze({
  peace_gate_dark: 'The causal reasons layer is not active in this campaign. Pick the Dramatic Campaign or Full Simulation preset, or light War and “Causes of war and peace” under Simulation rules → Engine waves.',
  peace_no_deployment: 'That court has no army in the field against that foe — there is no war of theirs to wind down.',
  peace_already_ordered: 'The recall order is already given; the army marches home.',
});

/**
 * SUE_FOR_PEACE: order a belligerent's committed army home by decree — the
 * physical peace-seeking act. Refuses when the gate is dark, when the party
 * holds no live deployment against the named foe, or when the order already
 * stands. Pure: same input ⇒ same output (preview ≡ apply).
 * @param {Record<string, unknown>} worldState
 * @param {{ partyId: unknown, foeId: unknown, tick?: number }} args
 * @returns {{ ok: true, worldState: Record<string, unknown> }
 *         | { ok: false, code: keyof typeof PEACE_VETO_PROSE, detail: string }}
 */
export function sueForPeaceOrder(worldState, { partyId, foeId, tick = 0 }) {
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { ok: false, code: 'peace_gate_dark', detail: 'peace-engine gate absent' };
  }
  const party = String(partyId);
  const foe = String(foeId);
  const deployments = /** @type {Record<string, { targetId?: unknown, recalled?: unknown }>} */ (
    worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const dep = deployments[party];
  if (!dep || dep.targetId == null || String(dep.targetId) !== foe) {
    return { ok: false, code: 'peace_no_deployment', detail: `${party}>${foe}` };
  }
  if (dep.recalled) {
    return { ok: false, code: 'peace_already_ordered', detail: party };
  }
  return {
    ok: true,
    worldState: {
      ...worldState,
      deployments: {
        ...deployments,
        [party]: { ...dep, recalled: { cause: 'sue_for_peace_decree', tick: Number.isFinite(tick) ? Number(tick) : null } },
      },
    },
  };
}

// Re-export the shared read the decision receipts use, so consumers of the
// peace side need one import (symmetry with warReasonsFor/topReasons).
export { topReasons };
