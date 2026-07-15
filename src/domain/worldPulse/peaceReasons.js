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
  WAR_REASON_TYPES, PEACE_REASON_TYPES,
} from './warReasons.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { buildPressureSummary, settlementStrength } from './relationshipEvolution.js';
import { readBeliefStrength } from './beliefMap.js';
import { faithAlignmentQuadrant, crossPressureMediation } from '../spatial/cohesionWeave.js';
import { evil01 } from './deityAxes.js';
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
export function scoreExhaustion({ scar01 }) {
  const score = clamp01(Number(scar01) || 0);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: `The war has worn the town to the bone — exhaustion ${score.toFixed(2)}; the seat needs peace to survive.` };
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
export function scoreBeliefConvergence({ marginA, marginB }) {
  const divergence = Math.abs((Number(marginA) || 0) + (Number(marginB) || 0));
  const score = clamp01(1 - divergence / PEACE_REASON_TUNING.BLAINEY_DIVERGENCE_SCALE);
  if (score <= 0) return { score: 0, receipt: '' };
  const converged = score >= 0.75;
  return {
    score,
    receipt: converged
      ? 'The fighting has taught both courts the same truth — no offer insults any longer.'
      : `The courts' reckonings drift closer (divergence ${divergence.toFixed(2)}) — the war is running out of illusions.`,
  };
}

/**
 * ECONOMIC STRANGULATION FELT (§14.2 no-other-options): the belligerent's own
 * trade/economy pressure — the severed routes and drained treasury it can
 * feel, off the same pressure index every contest reads.
 * @param {{ trade01: number, economy01: number }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreEconomicStrangulation({ trade01, economy01 }) {
  const score = clamp01(
    PEACE_REASON_TUNING.STRANGLE_TRADE_W * clamp01(Number(trade01) || 0)
    + PEACE_REASON_TUNING.STRANGLE_ECONOMY_W * clamp01(Number(economy01) || 0),
  );
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: 'The routes are severed and the treasury bleeds — the war costs more than its aims.' };
}

/**
 * COALITION FRACTURE (§14.2): allies peeled away from a shared siege. Presence
 * requires a remembered peak — the fold carries {peakAllies, nowAllies}
 * evidence so the record itself receipts the peel.
 * @param {{ peakAllies: number, nowAllies: number }} args
 * @returns {{ score: number, receipt: string, evidence?: Record<string, number> }}
 */
export function scoreCoalitionFracture({ peakAllies, nowAllies }) {
  const peak = Math.max(0, Math.floor(Number(peakAllies) || 0));
  const now = Math.max(0, Math.floor(Number(nowAllies) || 0));
  if (peak <= 0 || now >= peak) return { score: 0, receipt: '' };
  const score = clamp01((peak - now) / peak);
  return {
    score,
    receipt: `The coalition thins — ${peak - now} of ${peak} co-belligerents have left the field.`,
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
export function scoreMediation({ impulse, mediatorName }) {
  const on = clamp01(Number(impulse) || 0);
  if (on <= 0) return { score: 0, receipt: '' };
  const score = clamp01(PEACE_REASON_TUNING.MEDIATION_PRESENT * on);
  return { score, receipt: `${mediatorName || 'A neighbour'} stands torn between the belligerents — its envoys carry terms both courts will hear.` };
}

/**
 * THE HARVEST IMPERATIVE (§14.2 economic): autumn — levies wanted home for
 * the harvest before the hungry gap.
 * @param {{ season: string }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreHarvestPressure({ season }) {
  if (String(season) !== 'autumn') return { score: 0, receipt: '' };
  return { score: PEACE_REASON_TUNING.HARVEST_PRESENT, receipt: 'The harvest stands in the fields and the levies mutter of home — wars pause for bread.' };
}

/**
 * THE REALIGNMENT (§14.2 — "yesterday's enemies, today's new best friends"):
 * a common third attacker menacing BOTH belligerents makes continuing their
 * war jointly irrational; distinct third threats on each still soften it.
 * @param {{ commonThird: string | null, bothBesetByThirds: boolean }} args
 * @returns {{ score: number, receipt: string }}
 */
export function scoreRealignment({ commonThird, bothBesetByThirds }) {
  if (commonThird) {
    return {
      score: PEACE_REASON_TUNING.REALIGNMENT_COMMON_THIRD,
      receipt: 'A third banner is at both gates — signed in haste, for the horde was at the passes.',
    };
  }
  if (bothBesetByThirds) {
    return {
      score: PEACE_REASON_TUNING.REALIGNMENT_DISTINCT_THIRDS,
      receipt: 'Each court is beset by another foe — this front is a luxury neither can keep.',
    };
  }
  return { score: 0, receipt: '' };
}

// ── The factor (the consumption read — bounded, centered on 1.0) ────────────

/**
 * The peace-reason modulator for a directed pair: 1.0 exactly when dark or
 * absent; up to 1 + PEACE_FACTOR_W when the case saturates. Consumed at the
 * settlementStrategy sue_for_peace weight seam.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {unknown} foeId
 * @returns {number}
 */
export function peaceReasonFactor(worldState, partyId, foeId) {
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) return 1;
  const ledger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  if (!ledger) return 1;
  const entry = ledger[reasonPairKey(partyId, foeId)];
  const aggregate = aggregateReasons01(entry);
  if (aggregate <= 0) return 1;
  return 1 + REASON_TUNING.PEACE_FACTOR_W * aggregate;
}

/**
 * The pair's peace-reason entry (for receipts). Null when dark/absent.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {unknown} foeId
 * @returns {import('./warReasons.js').ReasonPairEntry | null}
 */
export function peaceReasonsFor(worldState, partyId, foeId) {
  const ledger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  if (!ledger) return null;
  return ledger[reasonPairKey(partyId, foeId)] || null;
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
 * on both sides with presence flags, and the rendered WHY line — "N of M
 * peace reasons now present[; this war is dying]". Pure read; safe on any
 * worldState (dark ⇒ all-absent rows, "0 of 7").
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {unknown} foeId
 * @returns {{ war: CausalBriefRow[], peace: CausalBriefRow[],
 *            warPresent: number, peacePresent: number, line: string }}
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
  return { war, peace, warPresent, peacePresent, line };
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
 *           tick: number }} args
 * @returns {PeaceReasonsAdvanceResult}
 */
export function advancePeaceReasons({ snapshot, worldState, graph, pIndex = null, tick }) {
  // ── DORMANCY GATE (§8): absent ⇒ an immediate no-op. No key, no read. ──
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { worldState, changed: false, newsEntries: [] };
  }

  const deployments = /** @type {Record<string, { targetId?: unknown }>} */ (
    worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const prevLedger = /** @type {import('./warReasons.js').ReasonLedger | null} */ (getSpatialLedger(worldState, 'peaceReasons'));
  const liveGraph = (graph && Array.isArray(graph.edges) ? graph : null) || snapshot?.regionalGraph || null;

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
  for (const key of orderedKeys) {
    const { partyId, foeId } = /** @type {{ partyId: string, foeId: string }} */ (pairs.get(key));

    // THE BLAINEY MARGINS — self reads truth, the foe reads BELIEF (never truth).
    const marginA = readBeliefStrength(partyId, partyId, worldState, strengthFor(partyId))
      - readBeliefStrength(partyId, foeId, worldState, strengthFor(foeId));
    const marginB = readBeliefStrength(foeId, foeId, worldState, strengthFor(foeId))
      - readBeliefStrength(foeId, partyId, worldState, strengthFor(partyId));

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
      const peakAllies = Math.max(nowAllies, Number(prevLedger?.[key]?.memo?.peakAllies) || 0);
      if (peakAllies > 0) memo = { peakAllies };
      fracture = scoreCoalitionFracture({ peakAllies, nowAllies });
    }

    // Mediation: the first (codepoint-ordered) third settlement cross-pressured
    // between the pair, via the exported cohesionWeave read.
    const mediator = findCrossPressuredMediator(snapshot, liveGraph, partyId, foeId);

    // Realignment: a common third attacker on both, or distinct thirds on each.
    const third = thirdThreatRead(deployments, liveGraph, partyId, foeId);

    const computed = [
      { type: 'exhaustion', ...scoreExhaustion({ scar01: Number(warExhaustion[partyId]) || 0 }) },
      { type: 'belief_convergence', ...scoreBeliefConvergence({ marginA, marginB }) },
      {
        type: 'economic_strangulation',
        ...scoreEconomicStrangulation({ trade01: Number(pressures?.trade) || 0, economy01: Number(pressures?.economy) || 0 }),
      },
      { type: 'coalition_fracture', ...fracture },
      { type: 'mediation', ...scoreMediation({ impulse: mediator ? 1 : 0, mediatorName: mediator?.name || '' }) },
      { type: 'harvest_pressure', ...scoreHarvestPressure({ season }) },
      { type: 'realignment', ...scoreRealignment(third) },
    ];

    const entry = foldPairReasons(prevLedger?.[key], computed, tick, memo);
    if (entry) nextLedger[key] = entry;
  }

  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? nextLedger : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false, newsEntries: [] };
  }
  const nextWorldState = hasNext
    ? setSpatialLedger(worldState, 'peaceReasons', nextLedger)
    : dropSpatialLedger(worldState, 'peaceReasons');
  return { worldState: nextWorldState, changed: true, newsEntries: [] };
}

// ── Internal reads ───────────────────────────────────────────────────────────

/**
 * The faith×alignment proximity inputs for a pair of snapshot items (the
 * generosityKernel faithProximity derivation, kept identical so the quadrant
 * reads agree across movers).
 * @param {{ settlement?: { config?: { primaryDeitySnapshot?: Record<string, unknown> | null } } } | null | undefined} itemA
 * @param {{ settlement?: { config?: { primaryDeitySnapshot?: Record<string, unknown> | null } } } | null | undefined} itemB
 * @returns {{ samePatron: boolean, alignmentKinship01: number }}
 */
function faithProximityOf(itemA, itemB) {
  const dA = itemA?.settlement?.config?.primaryDeitySnapshot || null;
  const dB = itemB?.settlement?.config?.primaryDeitySnapshot || null;
  const refA = dA && dA._deityRef != null ? String(dA._deityRef) : '';
  const refB = dB && dB._deityRef != null ? String(dB._deityRef) : '';
  const samePatron = !!(refA && refA === refB);
  // The quadrant needs only samePatron + alignment kinship (the good/evil
  // axis) — the same kinship read generosityKernel's faithProximity derives.
  const alignmentKinship01 = clamp01(1 - Math.abs(evil01(dA) - evil01(dB)));
  return { samePatron, alignmentKinship01 };
}

/**
 * Find the first (codepoint-ordered) third settlement adjacent to BOTH
 * belligerents whose quadrant reads are cross-pressured per cohesionWeave.
 * @param {{ byId?: Map<string, Record<string, unknown>> } | null | undefined} snapshot
 * @param {{ edges?: Array<Record<string, unknown>> } | null} graph
 * @param {string} partyId @param {string} foeId
 * @returns {{ id: string, name: string } | null}
 */
function findCrossPressuredMediator(snapshot, graph, partyId, foeId) {
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  /** @type {Map<string, Set<string>>} */
  const adjacency = new Map();
  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b) continue;
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    /** @type {Set<string>} */ (adjacency.get(a)).add(b);
    /** @type {Set<string>} */ (adjacency.get(b)).add(a);
  }
  const partyItem = snapshot?.byId?.get?.(partyId);
  const foeItem = snapshot?.byId?.get?.(foeId);
  const candidates = [...adjacency.keys()].sort();
  for (const mId of candidates) {
    if (mId === partyId || mId === foeId) continue;
    const near = /** @type {Set<string>} */ (adjacency.get(mId));
    if (!near.has(partyId) || !near.has(foeId)) continue;
    const mItem = snapshot?.byId?.get?.(mId);
    if (!mItem) continue;
    const toA = faithAlignmentQuadrant(faithProximityOf(mItem, partyItem));
    const toB = faithAlignmentQuadrant(faithProximityOf(mItem, foeItem));
    const read = crossPressureMediation({ toA, toB });
    if (read.crossPressured) {
      return { id: mId, name: String(/** @type {{ name?: unknown }} */ (mItem).name || mId) };
    }
  }
  return null;
}

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
// a PURE, GATED worldState mutation that a W-COMPOSER-2 manifest entry wraps
// verbatim (same-function law); NOT registered in the settlement-scoped
// affordance manifest this wave — see the declareCasus header for the proof
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
  peace_gate_dark: 'The causal reasons layer is not active in this campaign (warLayerEnabled + peaceEngineEnabled).',
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
