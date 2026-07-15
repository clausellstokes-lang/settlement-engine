/**
 * generosityKernel.js — THE GENEROSITY ENGINE adapter/mover (E1a-WIRE).
 *
 * docs/DESIGN_GENEROSITY_ENGINE.md. The PURE kernels landed at E1a
 * (spatial/generosityEV.js — the decision; spatial/generosityReactions.js — the
 * reaction ledger; spatial/cohesionWeave.js — the faith×alignment / structural-lens
 * modulators). THIS thin adapter is the wiring: it supplies the LIVE reads those pure
 * leaves cannot import (alignment, deity axes, war fronts, mobilization, food, seasons,
 * beliefs) and APPLIES their verdicts — mirroring pestilenceKernel.js / calamityKernel.js.
 *
 *   • ENUMERATE — the qualifying (giver, receiver) pairs (the §0.1 gate: a needy receiver
 *     that holds an allied / trade-partner / vassal / patron edge to the giver, OR a live
 *     obligation between them). Sparse BY CONSTRUCTION: only settlements in real food
 *     NEED are ever asked, codepoint-sorted, then rarity-gated by shouldInitiateAsk.
 *   • ADAPT — per pair, extract the ~10 kernel reads (bond, history, conscience, strategy,
 *     faith, margin, commitment, route, domestic, dependency) + the cohesion-weave
 *     quadrant/lens modulators, all from live state.
 *   • DECIDE — call generosityEV (the loaded-dice discipline, §H: the situation weights
 *     FIRST, the seeded fork only picks within it).
 *   • APPLY — on a GIVE: a CONSERVATION-EXACT grain transfer (computeSackFoodTransfer,
 *     fed the giver's ABOVE-FLOOR headroom so the hard reserve floor is never crossed),
 *     the obligation mint (foldObligations — the "aid changes history" ledger the §7 soak
 *     reads), the widow's-mite gratitude + typed relief incidents, the moral-hazard buffer
 *     step, the willingness latch, and a house-voice succor receipt. On a REFUSE: the
 *     fog-mediated refusal memory + the latch.
 *   • WRITE — three self-owned sub-ledgers under spatialLedgers (obligations /
 *     generosityWillingness / bufferDiscipline), each DROP-WHEN-EMPTY; the relief food
 *     deltas onto settlementUpdates (the calamity idiom); the receipts as wizard news.
 *
 * CONSTITUTIONAL (design §6): DORMANT behind constructiveFlowsActive — the gate ABSENT ⇒
 * an immediate no-op (zero forks, zero keys, byte-identical; the dormancy golden proves
 * it). Conservation exact (a grain gift balances to the tenth-month). Deterministic (the
 * pulse rng, forked on stable generosityForkKey composites — no Date, no Math.random).
 * Aggregate-only (grain, never named souls). Receipts mandatory. 0-hole discipline (no
 * `any`) — the read-shapes are declared local typedefs, mirroring pestilenceKernel.js.
 *
 * E1b SHIPPED (this wave, all behind the same dormancy gate ⇒ the golden holds byte-
 * identical): CREDIT goes live — GIVE_AS_CREDIT mints a distinct kind:'credit' obligation
 * that MATURES (CREDIT_TERM ticks) into REPAYMENT (trust + the debt clears) or DEFAULT
 * (the grievance ratchet on the edge = the casus-belli seam; the lender's hardened heart
 * via the lendAppetite accumulator — the merchantAppetite pattern). Plus the §9 couplings
 * the core parked: the newsVoice 'succor' category (display), the legitimacy→coup write-
 * back (a hungry giver's ruler pays a legitimacy price; a comfortable one earns a small
 * lift), the smuggle-premium coupling pin (a refuse moves no food ⇒ the shortage persists
 * for M7), and the stale-willingness-latch prune.
 *
 * DEFERRED — E1c+ (documented, not lost; recon-mapped for a clean handoff — see the E1b
 * report + the coherence matrix note):
 *   • PURCHASE / TRADE_OVERTURE live-flips (design A2/A4) — purchase = a dispatchDecision
 *     fall-through off the relief decision (relief-if-qualified, purchase-else); overture
 *     needs a tradeFlow-tally→trade-pressure wire + a dwell-bounded overture ledger.
 *   • REFUGE posture (design E1c) — a drop-when-empty 'refugePostures' sub-ledger written
 *     here, READ in migrationKernel.buildDestinationCandidate as a new weighted axis on
 *     migration.destinationScore; conservation is weight-independent (survivors only
 *     redistribute, never mint) — pin identical {originDeaths,roadDeaths,arrivals} with vs
 *     without a posture.
 *   • RUMOR broadcast belief-nudge — the GIVE receipt ALREADY seeds a typed rumor carrying
 *     both settlements (succorNews score≥60); the missing edge is nudging believed
 *     wealth/character in beliefMap.reconcileBelief (a cross-module, infoMode-gated change).
 *   • FORCE_RELIEF / OFFER_CREDIT counterpart verbs — the 11-touchpoint event-registry
 *     threading (registry/mutateWorld/mutate/batch/buildEvent/composer/prose + preview≡apply
 *     + the W-COMPOSER-1 manifest TODO); affordance predicates reuse qualifiesForGenerosity
 *     / shouldInitiateAsk.
 *   • The traveling-relief refinement over commodityFlow (E1a JUDGMENT-2 reaffirmed:
 *     invasive — the M6a ledger is institution-keyed with a food-exclusion rule; a separate
 *     peer-shipment lane or the aspatial fallback is the contained path, not a schema change).
 */

import {
  constructiveFlowsActive, generosityEV, generosityForkKey, shouldInitiateAsk,
  routeRiskTerm, VERDICTS,
} from '../spatial/generosityEV.js';
import {
  foldObligations, hasLiveObligation, gratitudeDeposit, giverMarginSacrifice,
  obligationMintMagnitude, reliefIncident, refusalDamage, fogForgiveness,
  bufferDisciplineStep, creditMaturityResolution, lendAppetiteStep, lendAppetiteOf,
  REACTION_TUNING,
} from '../spatial/generosityReactions.js';
import { faithAlignmentQuadrant, structuralLens, hasCharityFacet } from '../spatial/cohesionWeave.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { computeLawfulness, computeMalice } from './disposition.js';
import { evil01, chaos01 } from './deityAxes.js';
import { mobilizationSeverity } from './mobilization.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { computeSackFoodTransfer, storageCapacityMonths, STOCKPILE_TUNING, famineFor } from './foodStockpile.js';
import { seasonForTick } from './worldState.js';
import { seasonalUnitSwing } from './seasons.js';
import { ensureRelationshipState, relationshipKeyFromEdge, normalizeRelationshipType } from './relationshipState.js';
import { stablePart } from './stablePart.js';
import { clamp01 } from '../../kernel/math.js';

// ── Kernel-local read-shapes (0-hole discipline: no `any`) ────────────────────
/** A recursively-forkable seeded PRNG (the pulse rng confluence). */
/** @typedef {{ fork: (k: string) => PulseRng, random: () => number }} PulseRng */
/** @typedef {{ _deityRef?: unknown, alignmentAxis?: string, lawAxis?: string }} GenDeity */
/** @typedef {{ name?: unknown, type?: unknown, category?: unknown }} GenInstitution */
/** @typedef {{ faction?: unknown, category?: unknown, power?: unknown }} GenFaction */
/** @typedef {{ population?: number, institutions?: GenInstitution[],
 *   economicState?: { foodSecurity?: { storageMonths?: unknown }, economicBase?: unknown, primaryIndustry?: unknown },
 *   powerStructure?: { factions?: GenFaction[] },
 *   config?: { primaryDeitySnapshot?: GenDeity|null, economicBase?: unknown } }} GenSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: GenSettlement }} GenSnapItem */
/** @typedef {{ edges?: unknown[] }} GenGraph */
/** @typedef {{ settlements?: GenSnapItem[], regionalGraph?: GenGraph|null,
 *   byId?: { get?: (id: string) => GenSnapItem|undefined } }} GenSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: GenSettlement }} GenUpdate */
/** @typedef {{ id?: unknown, from?: unknown, to?: unknown, relationshipType?: unknown, status?: unknown }} GenEdge */
/** @typedef {import('../spatial/generosityReactions.js').ObligationRecord} ObligationRecord */
/** @typedef {import('../spatial/generosityEV.js').GenerosityWillingness} GenerosityWillingness */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Narrow a kernel-local read-shape settlement to the food module's SimSettlement param. */
/** @param {GenSettlement|undefined} s @returns {Parameters<typeof storageCapacityMonths>[0]} */
function asSimSettlement(s) {
  return /** @type {Parameters<typeof storageCapacityMonths>[0]} */ (/** @type {unknown} */ (s));
}

// ── Tuning (documented; retuned in the E1a soak — the loaded-dice WEIGHTS, never forks) ──
export const GENEROSITY_MOVER_TUNING = Object.freeze({
  // Only a receiver whose food pressure crosses NEED_FLOOR is ever asked (sparse by
  // construction, design law 1). A famine stressor forces the ask regardless.
  NEED_FLOOR: 0.5,
  // The rarity baseline of an ask firing (shouldInitiateAsk), before the pressure² ramp.
  ASK_BASE_CHANCE: 0.15,
  // A hard per-tick ceiling on relief asks evaluated (keeps the hot path bounded + the
  // engine RARE; the highest-need receivers are served first). A drama engine, not a
  // welfare optimizer (design §6).
  ASK_CAP: 24,
  // Grain relief spoils little on a peaceful road (unlike a war sack's 0.6): most of what
  // leaves the giver's granary reaches the receiver. Conservation still holds (a sink).
  RELIEF_CAPTURE: 0.9,
  // The qualifying bond floor (mirrors generosityEV's qualifiesForGenerosity default).
  BOND_FLOOR: 0.2,
  // Recency window (ticks) for scanning typed relief incidents (reciprocity + chronic-ask
  // counts). Mirrors relationshipMemory's lookback order of magnitude.
  INCIDENT_LOOKBACK: 24,
  // A minimum obligation magnitude to bother minting (below this a gift is a courtesy, not
  // a debt — keeps the ledger sparse).
  OBLIGATION_MIN: 0.03,
  // §9 LEGITIMACY→COUP coupling (design §2.2): a GIVE writes back to the giver's ruler.
  // Shipping food out of a HUNGRY town costs legitimacy (courage with a political price);
  // a COMFORTABLE "granary city" earns a small reputation LIFT. Bounded, small (points on
  // the 0..100 publicLegitimacy score), scaled by the gift magnitude and own scarcity.
  LEGITIMACY_COST: 3,   // max score points a hungry giver's ruler loses per gift
  LEGITIMACY_LIFT: 1,   // max score points a comfortable giver's ruler gains per gift
  // Housekeeping: a refusing willingness latch that has not been re-advanced in this many
  // ticks is STALE (its pair stopped being asked — the receiver recovered, the edge changed)
  // and is PRUNED so a future ask re-evaluates fresh rather than inheriting a fossil refusal.
  // Byte-neutral when nothing is stale (the surviving set is identical).
  WILLINGNESS_STALE_TICKS: 24,
});

// ── The qualifying relationship kinds → the kernel's BondRead.kind vocabulary ──
/** @type {Record<string, string>} */
const KIND_MAP = Object.freeze({
  allied: 'allied', trade_partner: 'trade_partner', vassal: 'vassal', patron: 'patron', client: 'client',
});

// ── Small live-read helpers (each a bounded [0,1] or a small primitive) ────────
/** @param {GenSettlement|undefined} s @returns {number} storageMonths (0 when absent) */
function storageMonthsOf(s) {
  return Math.max(0, num(s?.economicState?.foodSecurity?.storageMonths, 0));
}
/**
 * Holds a charity-capable roster (§2.1 conscience exception). §I THE FACET LAW: routed
 * through the facetOf chokepoint (declared ?? inferred ?? default) — never a direct name
 * grep — so a custom sanctuary declaring nature:faith counts by its facet, not its English.
 * @param {GenSettlement|undefined} s @returns {boolean}
 */
function hasCharityRoster(s) {
  return hasCharityFacet(Array.isArray(s?.institutions) ? s.institutions : []);
}
/** The governing faction's category (highest power) → the structural-lens archetype. */
/** @param {GenSettlement|undefined} s @returns {string} */
function governingArchetypeOf(s) {
  const factions = Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : [];
  let best = null;
  let bestPower = -Infinity;
  for (const f of factions) {
    const p = num(f?.power, 0);
    if (p > bestPower) { bestPower = p; best = f; }
  }
  return String(best?.category || '');
}
/** @param {GenSettlement|undefined} s @returns {string} */
function economicBaseOf(s) {
  return String(s?.economicState?.economicBase || s?.config?.economicBase || s?.economicState?.primaryIndustry || '');
}

/**
 * The faith-axis proximity for a pair (samePatron + a sharedFaith01 closeness), from the
 * settlements' primaryDeitySnapshot alignment/law axes (deityAxes — the culture faith axis,
 * already computed elsewhere; no new derivation).
 * @param {GenDeity|null|undefined} dG @param {GenDeity|null|undefined} dR
 * @returns {{ samePatron: boolean, sharedFaith01: number, alignmentKinship01: number }}
 */
function faithProximity(dG, dR) {
  const refG = dG && dG._deityRef != null ? String(dG._deityRef) : '';
  const refR = dR && dR._deityRef != null ? String(dR._deityRef) : '';
  const samePatron = !!(refG && refG === refR);
  const faithDist = 0.5 * Math.abs(evil01(dG) - evil01(dR)) + 0.5 * Math.abs(chaos01(dG) - chaos01(dR));
  const sharedFaith01 = samePatron ? 1 : clamp01(1 - faithDist);
  // Alignment kinship = 1 − alignment-axis distance (the good/evil axis; the quadrant's
  // kindred read). A no-signal pair lands at the charitable midpoint.
  const alignmentKinship01 = clamp01(1 - Math.abs(evil01(dG) - evil01(dR)));
  return { samePatron, sharedFaith01, alignmentKinship01 };
}

/**
 * Scan a relationship state's recent typed incidents for the reciprocity reads: how much
 * the receiver has helped/refused the giver, whether a betrayal zeroed the give-side, and
 * the recent count of relief already given to this receiver (the chronic-ask read).
 * @param {{ recentIncidents?: unknown }} relState @param {number} tick
 * @returns {{ reliefReceived01: number, reliefRefusedByThem01: number, betrayal: boolean, reliefGivenCountRecent: number }}
 */
function reciprocityFromMemory(relState, tick) {
  const incidents = Array.isArray(relState?.recentIncidents) ? relState.recentIncidents : [];
  const lookback = GENEROSITY_MOVER_TUNING.INCIDENT_LOOKBACK;
  let reliefReceived01 = 0;
  let reliefRefusedByThem01 = 0;
  let betrayal = false;
  let reliefGivenCountRecent = 0;
  for (const raw of incidents) {
    const inc = asObject(raw);
    const t = num(inc.tick, tick);
    if (tick - t > lookback) continue;
    const type = String(inc.type || '');
    const sev = clamp01(num(inc.severity, 0.45));
    if (type === 'relief_received') reliefReceived01 = Math.max(reliefReceived01, sev);
    else if (type === 'relief_refused') reliefRefusedByThem01 = Math.max(reliefRefusedByThem01, sev);
    else if (type === 'relief_given') reliefGivenCountRecent += 1;
    else if (type === 'credit_defaulted' || /betray/i.test(type)) betrayal = true;
  }
  return { reliefReceived01, reliefRefusedByThem01, betrayal, reliefGivenCountRecent };
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} GenerosityAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {GenUpdate[]} settlementUpdates
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<{ giverId: string, receiverId: string, verdict: string, magnitude: number }>} receipts
 */

/**
 * Advance the generosity layer one tick (design §2–§4). DORMANT (constructiveFlowsActive
 * false) ⇒ { changed:false, … } with zero forks / zero keys — byte-identical.
 * @param {Object} args
 * @param {GenSnapshot} args.snapshot                    the post-time snapshot (byId / settlements / regionalGraph)
 * @param {Record<string, unknown>} args.worldState      the post-apply memoryState
 * @param {GenUpdate[]} args.settlementUpdates           this tick's post-apply settlement updates (relief food deltas land here)
 * @param {{ get: (id: string, kind: string) => ({ score?: number }|null) }} args.pIndex
 * @param {GenGraph|null|undefined} args.graph
 * @param {{ fork?: (k: string) => PulseRng }|null} args.rng
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {GenerosityAdvanceResult}
 */
export function advanceGenerosity({ snapshot, worldState, settlementUpdates, pIndex, graph, rng, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE (design §6): the gate absent ⇒ an immediate no-op. No fork, no key. ──
  if (!constructiveFlowsActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [], receipts: [] };
  }

  const T = GENEROSITY_MOVER_TUNING;
  const RT = REACTION_TUNING;
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  const stressors = Array.isArray(worldState?.stressors) ? worldState.stressors : [];
  const genFork = rng && typeof rng.fork === 'function' ? rng.fork('generosity') : null;

  // The freshest per-settlement food/state is on settlementUpdates (post-apply, post-calamity).
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  /** @param {string} id @returns {GenSettlement|undefined} the freshest settlement (update ▸ snapshot) */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return updates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  // ── The pre-tick relationship states (read-only source for bond + memory). ──
  const relStates = asObject(worldState?.relationshipStates);
  // The edges of the frozen regional graph (one per pair; either endpoint may be the giver).
  const edges = /** @type {GenEdge[]} */ (Array.isArray(graph?.edges) ? graph.edges : []);
  const obligationLedger = /** @type {Record<string, ObligationRecord>|null} */ (getSpatialLedger(worldState, 'obligations'));

  // ── ENUMERATE the qualifying (giver, receiver) candidate asks. ──
  // For every graph edge of a qualifying kind, BOTH orientations are candidate asks (the
  // needy endpoint receives, the other gives). Sparse: only a receiver in real NEED is asked.
  /** @typedef {{ giverId: string, receiverId: string, edge: GenEdge, need01: number, bondStrength: number }} Candidate */
  /** @type {Candidate[]} */
  const candidates = [];
  /** @param {string} id @returns {number} the receiver's need (food pressure ∪ famine severity) */
  const needOf = (id) => {
    const foodPressure = clamp01(num(pIndex?.get?.(String(id), 'food')?.score, 0));
    const famine = famineFor(stressors, String(id));
    const famineSev = famine ? clamp01(num(famine.severity, 0)) : 0;
    return Math.max(foodPressure, famineSev);
  };

  const seenPair = new Set();
  /** @param {string} giverId @param {string} receiverId @param {GenEdge} edge */
  const considerOrientation = (giverId, receiverId, edge) => {
    if (giverId === receiverId) return;
    const pairKey = `${giverId} ${receiverId}`;
    if (seenPair.has(pairKey)) return;
    if (!itemById.has(giverId) || !itemById.has(receiverId)) return;
    const need01 = needOf(receiverId);
    const kindRaw = normalizeRelationshipType(String(edge?.relationshipType || 'neutral'));
    const kind = KIND_MAP[kindRaw];
    if (!kind) return; // not a qualifying relationship kind
    const relState = ensureRelationshipState(edge, relStates[relationshipKeyFromEdge(edge)]);
    const bondStrength = clamp01(0.7 * num(relState.trust, 0) + 0.3 * num(relState.pactStrength, 0));
    const hasObl = hasLiveObligation(obligationLedger, giverId, receiverId);
    // The §0.1 gate: a needy receiver above the floor with a qualifying bond OR a live debt.
    if (need01 < T.NEED_FLOOR && !hasObl) return;
    if (bondStrength < T.BOND_FLOOR && !hasObl) return;
    seenPair.add(pairKey);
    candidates.push({ giverId, receiverId, edge, need01, bondStrength });
  };

  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b) continue;
    considerOrientation(a, b, edge); // a gives to needy b
    considerOrientation(b, a, edge); // b gives to needy a
  }
  // Codepoint-sort (deterministic), highest need first (triage: the buffer state served first).
  candidates.sort((x, y) => (y.need01 - x.need01)
    || (x.giverId < y.giverId ? -1 : x.giverId > y.giverId ? 1 : 0)
    || (x.receiverId < y.receiverId ? -1 : x.receiverId > y.receiverId ? 1 : 0));

  // ── DECIDE + APPLY, up to the per-tick ask cap. ──
  let nextWorldState = worldState;
  let nextUpdates = updates;
  /** @type {ObligationRecord[]} */
  const obligationMints = [];
  /** @type {Array<{ giverId: string, receiverId: string, reliefThisTick: boolean }>} */
  const bufferSteps = [];
  /** @type {Record<string, GenerosityWillingness|null>} */
  const willingnessWrites = {};
  /** @type {Array<{ key: string, incident?: Record<string, unknown>|null, patch?: Record<string, number> }>} */
  const incidentWrites = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Array<{ giverId: string, receiverId: string, verdict: string, magnitude: number }>} */
  const receipts = [];
  /** @type {Map<string, number>} the net storageMonths delta to apply per settlement */
  const foodDeltas = new Map();
  const willingnessLedger = asObject(getSpatialLedger(worldState, 'generosityWillingness'));
  const bufferLedger = asObject(getSpatialLedger(worldState, 'bufferDiscipline'));
  const lendAppetiteLedger = asObject(getSpatialLedger(worldState, 'lendAppetite'));

  // Directed-pair → relationship edge (for credit-maturity incident/scalar writes).
  /** @type {Map<string, GenEdge>} */
  const pairToEdge = new Map();
  for (const e of edges) {
    const a = e?.from != null ? String(e.from) : '';
    const b = e?.to != null ? String(e.to) : '';
    if (!a || !b) continue;
    pairToEdge.set(`${a}:${b}`, e);
    pairToEdge.set(`${b}:${a}`, e);
  }
  // Credit-maturity collections (resolved this tick).
  /** @type {Array<{ from: string, to: string, kind: string, amount: number }>} */
  const obligationRepayments = [];   // zero out a resolved credit (repay OR default clears it)
  /** @type {Set<string>} */
  const defaultedLenders = new Set(); // creditor ids that suffered a default this tick
  /** @type {Map<string, number>} the giver's bounded publicLegitimacy.score delta (§9) */
  const legitimacyDeltas = new Map();

  let asks = 0;
  for (const cand of candidates) {
    if (asks >= T.ASK_CAP) break;
    const { giverId, receiverId, edge, need01, bondStrength } = cand;
    // The rarity gate (loaded dice, §H): pressure² ramps the baseline. A deep need + a
    // strong bond makes the ask near-certain; a mild need barely whispers.
    const pressure01 = clamp01(need01 * (0.5 + 0.5 * bondStrength));
    const askKey = generosityForkKey(giverId, receiverId, 'grain_relief', tick);
    if (!shouldInitiateAsk(genFork, `ask:${askKey}`, pressure01, T.ASK_BASE_CHANCE)) continue;
    asks += 1;

    const giverItem = itemById.get(giverId);
    const receiverItem = itemById.get(receiverId);
    const giverS = freshSettlement(giverId);
    const receiverS = freshSettlement(receiverId);
    const relKey = relationshipKeyFromEdge(edge);
    const relState = ensureRelationshipState(edge, relStates[relKey]);
    const kind = KIND_MAP[normalizeRelationshipType(String(edge?.relationshipType || 'neutral'))] || 'trade_partner';

    // ── The adapter reads. ──
    // BOND (kind × strength + the vassal/patron duty).
    const duty01 = (kind === 'vassal' || kind === 'patron' || kind === 'client')
      ? clamp01(num(relState.dependency, 0)) : 0;
    const bond = { kind, strength01: bondStrength, duty01 };

    // HISTORY (reciprocity memory).
    const recip = reciprocityFromMemory(relState, tick);
    const history = {
      reliefReceived01: recip.reliefReceived01,
      reliefRefusedByThem01: recip.reliefRefusedByThem01,
      betrayal: recip.betrayal,
    };

    // CONSCIENCE (the ONE W-C2 read).
    const alignItem = /** @type {Parameters<typeof computeMalice>[0]} */ (/** @type {unknown} */ (giverItem));
    const giverGood01 = giverItem ? clamp01(1 - computeMalice(alignItem, worldState)) : 0.5;
    const giverLawful01 = giverItem ? clamp01(computeLawfulness(alignItem, worldState)) : 0.5;
    const charityRoster = hasCharityRoster(giverS);
    const conscience = { good01: giverGood01, lawful01: giverLawful01, need01, charityRoster };

    // STRATEGY (three explicit reads — the owner's example made mechanical).
    const giverEnemies = new Set([...warFrontsInto(graph, giverId), ...warFrontsFrom(graph, giverId)]);
    const receiverEnemies = new Set([...warFrontsInto(graph, receiverId), ...warFrontsFrom(graph, receiverId)]);
    const sharesEnemy = [...receiverEnemies].some((e) => giverEnemies.has(e));
    // A besieged receiver whose fall would expose the giver (shared enemy) is a buffer state.
    const receiverBesieged = warFrontsInto(graph, receiverId).length > 0;
    const warStrategic01 = clamp01((sharesEnemy ? 0.7 : 0) + (sharesEnemy && receiverBesieged ? 0.2 : 0));
    // Leverage appetite: a malicious/ambitious giver gives to indebt (the merchant/criminal
    // seat's leverage lens amplifies it downstream in the kernel). §3.4: a lender whose past
    // credit DEFAULTED has a hardened heart (lendAppetite < 1) and lends more warily — the
    // appetite DAMPENS the credit-preference (baseline 1 for an unburned lender ⇒ no change).
    const lendAppetite01 = lendAppetiteOf(lendAppetiteLedger, giverId);
    const leverage01 = clamp01((giverGood01 < 0.5 ? (0.5 - giverGood01) * 2 : 0) * lendAppetite01);
    // Supply dependency: a trade-partner the giver leans on (their famine = my shortage).
    const supplyDependency01 = kind === 'trade_partner' ? clamp01(num(relState.dependency, 0)) : 0;
    const strategy = { warStrategic01, supplyDependency01, leverage01 };

    // FAITH.
    const dG = giverS?.config?.primaryDeitySnapshot || null;
    const dR = receiverS?.config?.primaryDeitySnapshot || null;
    const prox = faithProximity(dG, dR);
    const faith = { templeMediated: charityRoster, sharedFaith01: prox.sharedFaith01 };

    // MARGIN (graded, forward-looking) + the hard reserve floor headroom.
    const giverMonths = storageMonthsOf(giverS);
    const giverCap = Math.max(0.1, storageCapacityMonths(asSimSettlement(giverS)));
    const floorMonths = num(STOCKPILE_TUNING.reserveTitheFloorMonths, 1);
    const spareableMonths = Math.max(0, giverMonths - floorMonths);
    const reserveAboveFloor01 = clamp01(spareableMonths / Math.max(0.1, giverCap - floorMonths));
    const aheadWeeks = (num(/** @type {{ calendar?: { elapsedWeeks?: unknown } }} */ (worldState)?.calendar?.elapsedWeeks, 0)) + 13;
    const ahead = seasonForTick(aheadWeeks);
    const seasonalOutlook01 = clamp01((seasonalUnitSwing(ahead.season, ahead.weekOfSeason) + 1) / 2);
    const margin = { reserveAboveFloor01, granaryTrend01: 0.5, seasonalOutlook01 };

    // COMMITMENT (deployed armies + mobilization + war drain).
    const deployments = asObject(worldState?.deployments);
    const warPosture = asObject(worldState?.warPosture);
    const warExhaustion = asObject(worldState?.warExhaustion);
    const deployedArmies = asObject(deployments[giverId]).targetId ? 1 : 0;
    const mobilization01 = clamp01(mobilizationSeverity(String(asObject(warPosture[giverId]).state || '')));
    const warDrain01 = clamp01(num(warExhaustion[giverId], 0));
    const commitment = { deployedArmies, mobilization01, warDrain01 };

    // ROUTE (belief-mediated) — the kernel's wrapper adds the hostile-gate premium.
    const occupations = asObject(worldState?.occupations);
    const groundTruthStressor = {
      occupationState: (() => { const o = asObject(occupations[receiverId]).state; return o == null ? null : String(o); })(),
      besieged: receiverBesieged,
    };
    const routeRisk = routeRiskTerm({ giverId, receiverId, worldState, groundTruthStressor, hostileGateOnRoute: false });

    // DOMESTIC + DEPENDENCY.
    const ownScarcity01 = clamp01(num(pIndex?.get?.(giverId, 'food')?.score, 0));
    const lens = structuralLens({ economicBase: economicBaseOf(giverS), governingArchetype: governingArchetypeOf(giverS) });
    const domestic = { ownScarcity01, nerveMod: lens.modulators.domesticNerve };
    const reliefCountRecent = recip.reliefGivenCountRecent;

    // The cohesion-weave modulators (quadrant × structural lens).
    const quadrant = faithAlignmentQuadrant({ samePatron: prox.samePatron, alignmentKinship01: prox.alignmentKinship01 });
    const quadrantMod = quadrant.modulators;
    const lensMod = {
      conscience: lens.modulators.conscience,
      strategy: lens.modulators.strategy,
      leverage: lens.modulators.leverage,
      domesticNerve: lens.modulators.domesticNerve,
      hysteresisWiden: lens.hysteresisWiden,
    };

    // The ask fraction (share of the giver's spareable the receiver's gap represents).
    const receiverGapMonths = Math.max(0, floorMonths - storageMonthsOf(receiverS)) + need01 * floorMonths;
    const askFraction01 = spareableMonths > 0 ? clamp01(receiverGapMonths / spareableMonths) : 1;

    const priorWillingness = /** @type {GenerosityWillingness|null} */ (
      (willingnessLedger[`${giverId}:${receiverId}:grain_relief`]) || null);

    // ── THE VERDICT. ──
    const verdict = generosityEV({
      giverId, receiverId, kind: 'grain_relief', now: tick,
      bond, history, conscience, strategy, faith, margin, commitment,
      routeRisk, domestic, reliefCountRecent, askFraction01,
      quadrantMod, lensMod,
      conscienceException: false,
      priorWillingness,
    });

    // The willingness latch (persist the refusing phase; null ⇒ prune).
    willingnessWrites[`${giverId}:${receiverId}:grain_relief`] = verdict.willingness;

    const isGive = verdict.verdict === VERDICTS.GIVE_FULL
      || verdict.verdict === VERDICTS.GIVE_PARTIAL
      || verdict.verdict === VERDICTS.GIVE_AS_CREDIT;

    if (isGive) {
      // ── CONSERVATION-EXACT grain transfer (the hard floor honoured by feeding the
      // ABOVE-FLOOR headroom to the conserved primitive). ──
      const giverPop = Math.max(0, num(giverS?.population, 0));
      const receiverPop = Math.max(0, num(receiverS?.population, 0));
      const receiverMonths = storageMonthsOf(receiverS);
      const receiverCap = storageCapacityMonths(asSimSettlement(receiverS));
      const transfer = computeSackFoodTransfer({
        conqueredStorageMonths: spareableMonths,       // only the above-floor headroom can move
        conqueredPopulation: giverPop,
        victorStorageMonths: receiverMonths,
        victorPopulation: receiverPop,
        victorCapMonths: receiverCap,
        takeFraction: verdict.magnitudeFraction,
        captureFraction: T.RELIEF_CAPTURE,
      });
      const lostMonths = transfer ? transfer.lostMonths : 0;
      const gainedMonths = transfer ? transfer.gainedMonths : 0;
      if (lostMonths > 0) {
        foodDeltas.set(giverId, (foodDeltas.get(giverId) || 0) - lostMonths);
        if (gainedMonths > 0) foodDeltas.set(receiverId, (foodDeltas.get(receiverId) || 0) + gainedMonths);
      }

      // ── The obligation mint (the "aid changes history" ledger). A GIVE_AS_CREDIT verdict
      // mints a distinct kind:'credit' obligation that MATURES (§3.4 — repayment/default,
      // resolved below); a gift mints a slow-decaying kind:'grain_relief' debt. Predatory
      // weight for a leverage-driven / credit gift. ──
      const isCredit = verdict.verdict === VERDICTS.GIVE_AS_CREDIT;
      const leverageIntent = isCredit ? Math.max(leverage01, 0.6) : leverage01;
      const baseMag = clamp01(verdict.magnitudeFraction * (0.5 + 0.5 * need01));
      const oblMag = obligationMintMagnitude({ baseMagnitude01: baseMag, leverageIntent01: leverageIntent });
      if (oblMag >= T.OBLIGATION_MIN) {
        obligationMints.push({
          from: receiverId, to: giverId, kind: isCredit ? 'credit' : 'grain_relief',
          magnitude: oblMag, mintTick: tick, lastTick: tick,
          ...(leverageIntent >= 0.6 ? { predatory: true } : {}),
        });
      }

      // ── §9 LEGITIMACY→COUP write-back (design §2.2): a hungry giver's ruler pays a
      // legitimacy price for shipping food out (courage with a political cost); a
      // comfortable "granary city" earns a small reputation lift. Bounded, applied to the
      // giver's publicLegitimacy.score below (only where a structured legitimacy exists). ──
      const legDelta = ownScarcity01 > 0.5
        ? -(T.LEGITIMACY_COST * verdict.magnitudeFraction * ownScarcity01)
        : (T.LEGITIMACY_LIFT * verdict.magnitudeFraction * (1 - ownScarcity01));
      if (legDelta !== 0) legitimacyDeltas.set(giverId, (legitimacyDeltas.get(giverId) || 0) + legDelta);

      // ── The widow's-mite gratitude + the typed incidents (edge-backed pairs only — an
      // obligation-only pair without a graph edge would be dropped by the relationship
      // rebuild; its debt still records on the self-owned obligation ledger above). ──
      const sacrifice = giverMarginSacrifice({
        magnitudeFraction01: verdict.magnitudeFraction,
        giverHeadroom01: reserveAboveFloor01,
        seasonalScarcity01: clamp01(1 - seasonalOutlook01),
      });
      const gratitude = gratitudeDeposit({ needRelieved01: need01, giverMarginSacrifice01: sacrifice, throughTie: false });
      const givenInc = reliefIncident({ kind: 'relief_given', tick, magnitude01: gratitude, summary: verdict.receipt });
      const recvInc = reliefIncident({ kind: 'relief_received', tick, magnitude01: gratitude });
      if (givenInc) incidentWrites.push({ key: relKey, incident: givenInc });
      if (recvInc) incidentWrites.push({ key: relKey, incident: recvInc });

      // The moral-hazard buffer step (relief this tick decays the receiver's discipline).
      bufferSteps.push({ giverId, receiverId, reliefThisTick: true });

      newsEntries.push(succorNews({
        giverId, receiverId,
        giverName: String(giverItem?.name || giverId), receiverName: String(receiverItem?.name || receiverId),
        verdict: verdict.verdict, receipt: verdict.receipt, magnitude: verdict.magnitudeFraction, tick, now,
      }));
      receipts.push({ giverId, receiverId, verdict: verdict.verdict, magnitude: verdict.magnitudeFraction });
    } else {
      // ── REFUSE: the fog-mediated refusal memory (§3.2/§3.3). The belief-map wiring is
      // E1c; here the forgiveness reads the giver's own scarcity/military as a proxy for
      // what a well-informed receiver would believe. ──
      const forgiveness = fogForgiveness({
        believedGiverScarcity01: ownScarcity01,
        believedGiverMilitaryLoad01: clamp01(0.6 * deployedArmies + 0.4 * mobilization01),
      });
      const vassalBreach = kind === 'vassal' || kind === 'client';
      const damage = refusalDamage({ refusedDesperation01: need01, forgiveness01: forgiveness, vassalBreach });
      if (damage > 0.02) {
        const refusedInc = reliefIncident({ kind: 'relief_refused', tick, magnitude01: damage, summary: verdict.receipt });
        if (refusedInc) incidentWrites.push({ key: relKey, incident: refusedInc });
        // A significant, poorly-forgiven refusal reaches the Chronicle (the tragic grudge forming).
        if (damage >= 0.35) {
          newsEntries.push(refusalNews({
            giverName: String(giverItem?.name || giverId), receiverName: String(receiverItem?.name || receiverId),
            receipt: verdict.receipt, damage, tick, now,
          }));
        }
      }
      bufferSteps.push({ giverId, receiverId, reliefThisTick: false });
      receipts.push({ giverId, receiverId, verdict: verdict.verdict, magnitude: 0 });
    }
  }

  // ── CREDIT MATURITY (§3.4): scan the PRIOR obligation ledger for 'credit' obligations
  // that have MATURED (CREDIT_TERM ticks past mint) and resolve each. REPAYMENT (a solvent,
  // non-malicious debtor) deposits trust + clears the debt; DEFAULT (an insolvent OR
  // malicious debtor) ratchets a grievance on the edge (the casus-belli seam that feeds the
  // adversarial escalation reads) + hardens the lender's heart (lendAppetite decay). BOTH
  // clear the obligation (a full repayment consumes it). Codepoint-ordered, deterministic. ──
  if (obligationLedger) {
    const floorMonthsD = num(STOCKPILE_TUNING.reserveTitheFloorMonths, 1);
    for (const key of Object.keys(obligationLedger).sort()) {
      const rec = /** @type {ObligationRecord} */ (obligationLedger[key]);
      if (!rec || rec.kind !== 'credit') continue;
      const debtorId = String(rec.from);
      const creditorId = String(rec.to);
      const debtorS = freshSettlement(debtorId);
      const debtorItem = itemById.get(debtorId);
      // Debtor solvency = food headroom above the reserve floor (can they repay?).
      const dMonths = storageMonthsOf(debtorS);
      const dCap = Math.max(0.1, storageCapacityMonths(asSimSettlement(debtorS)));
      const debtorSolvency01 = clamp01(Math.max(0, dMonths - floorMonthsD) / Math.max(0.1, dCap - floorMonthsD));
      const debtorMalice01 = debtorItem
        ? clamp01(computeMalice(/** @type {Parameters<typeof computeMalice>[0]} */ (/** @type {unknown} */ (debtorItem)), worldState))
        : 0.5;
      const resolution = creditMaturityResolution({ obligation: rec, now: tick, debtorSolvency01, debtorMalice01 });
      if (resolution === 'pending') continue;
      // Zero out the resolved credit (both outcomes clear it).
      obligationRepayments.push({ from: debtorId, to: creditorId, kind: 'credit', amount: 1 });
      const edge = pairToEdge.get(`${debtorId}:${creditorId}`);
      const relKey = edge ? relationshipKeyFromEdge(edge) : null;
      const relState = edge && relKey ? ensureRelationshipState(edge, relStates[relKey]) : null;
      if (resolution === 'repaid') {
        // The debt clears cleanly — trust deposit + the typed credit_repaid incident.
        if (relKey && relState) {
          const inc = reliefIncident({ kind: 'credit_repaid', tick, magnitude01: RT.CREDIT_REPAY_TRUST });
          if (inc) incidentWrites.push({ key: relKey, incident: inc, patch: { trust: clamp01(num(relState.trust, 0) + 0.05) } });
        }
      } else {
        // DEFAULT — the grievance ratchet (casus-belli): raise resentment on the edge; the
        // lender's appetite-to-lend decays; the grudge reaches the Chronicle.
        defaultedLenders.add(creditorId);
        if (relKey && relState) {
          const inc = reliefIncident({ kind: 'credit_defaulted', tick, magnitude01: RT.CREDIT_DEFAULT_GRIEVANCE });
          if (inc) incidentWrites.push({ key: relKey, incident: inc, patch: { resentment: clamp01(num(relState.resentment, 0) + 0.18) } });
        }
        newsEntries.push(defaultNews({
          debtorName: String(debtorItem?.name || debtorId),
          creditorName: String(itemById.get(creditorId)?.name || creditorId),
          tick, now,
        }));
      }
    }
  }

  // ── PERSIST. Nothing decided ⇒ byte-identical (no ledger touched). ──
  let changed = false;

  // Obligations sub-ledger (fold this tick's mints + credit-maturity repayments, decay+prune;
  // drop-when-empty).
  if (obligationMints.length || obligationRepayments.length || obligationLedger) {
    const nextObl = foldObligations(obligationLedger, { mints: obligationMints, repayments: obligationRepayments, now: tick });
    if (JSON.stringify(nextObl || null) !== JSON.stringify(obligationLedger || null)) {
      nextWorldState = nextObl
        ? setSpatialLedger(nextWorldState, 'obligations', nextObl)
        : dropSpatialLedger(nextWorldState, 'obligations');
      changed = true;
    }
  }

  // Willingness latch sub-ledger (upsert the refusing latches; drop cleared ones).
  {
    /** @type {Record<string, GenerosityWillingness>} */
    const nextWill = {};
    for (const [k, v] of Object.entries(willingnessLedger)) {
      if (k in willingnessWrites) continue; // updated (or pruned) by this tick's writes below
      // HOUSEKEEPING: drop a latch not re-advanced within WILLINGNESS_STALE_TICKS (its pair
      // stopped being asked). Byte-neutral when nothing is stale.
      const rec = asObject(v);
      const last = num(rec.lastTick, num(rec.sinceTick, tick));
      if (tick - last > T.WILLINGNESS_STALE_TICKS) continue;
      nextWill[k] = /** @type {GenerosityWillingness} */ (v);
    }
    for (const [k, v] of Object.entries(willingnessWrites)) {
      if (v) nextWill[k] = v;
    }
    const sortedNextWill = sortedRecord(nextWill);
    if (JSON.stringify(sortedNextWill) !== JSON.stringify(sortedRecord(willingnessLedger))) {
      nextWorldState = Object.keys(sortedNextWill).length
        ? setSpatialLedger(nextWorldState, 'generosityWillingness', sortedNextWill)
        : dropSpatialLedger(nextWorldState, 'generosityWillingness');
      changed = true;
    }
  }

  // Buffer-discipline sub-ledger (moral hazard; drop-when-recovered).
  if (bufferSteps.length || Object.keys(bufferLedger).length) {
    /** @type {Record<string, unknown>} */
    const nextBuffer = { ...bufferLedger };
    for (const step of bufferSteps) {
      const k = step.receiverId; // discipline is a property of the receiver's own granary
      const prior = /** @type {Parameters<typeof bufferDisciplineStep>[0]} */ (asObject(nextBuffer[k]).discipline != null ? nextBuffer[k] : null);
      const nextRec = bufferDisciplineStep(prior, { reliefThisTick: step.reliefThisTick, now: tick });
      if (nextRec) nextBuffer[k] = nextRec; else delete nextBuffer[k];
    }
    const sortedBuffer = sortedRecord(nextBuffer);
    if (JSON.stringify(sortedBuffer) !== JSON.stringify(sortedRecord(bufferLedger))) {
      nextWorldState = Object.keys(sortedBuffer).length
        ? setSpatialLedger(nextWorldState, 'bufferDiscipline', sortedBuffer)
        : dropSpatialLedger(nextWorldState, 'bufferDiscipline');
      changed = true;
    }
  }

  // Lend-appetite sub-ledger (§3.4, the merchantAppetite pattern — hardened hearts on a
  // default; recover-and-prune otherwise; drop-when-empty ⇒ byte-identical once drained).
  if (defaultedLenders.size || Object.keys(lendAppetiteLedger).length) {
    /** @type {Record<string, unknown>} */
    const nextLend = {};
    const lenders = new Set([...Object.keys(lendAppetiteLedger), ...defaultedLenders]);
    for (const id of lenders) {
      const prior = /** @type {Parameters<typeof lendAppetiteStep>[0]} */ (asObject(lendAppetiteLedger[id]).appetite != null ? lendAppetiteLedger[id] : null);
      const nextRec = lendAppetiteStep(prior, { defaultedThisTick: defaultedLenders.has(id), now: tick });
      if (nextRec) nextLend[id] = nextRec;
    }
    const sortedLend = sortedRecord(nextLend);
    if (JSON.stringify(sortedLend) !== JSON.stringify(sortedRecord(lendAppetiteLedger))) {
      nextWorldState = Object.keys(sortedLend).length
        ? setSpatialLedger(nextWorldState, 'lendAppetite', sortedLend)
        : dropSpatialLedger(nextWorldState, 'lendAppetite');
      changed = true;
    }
  }

  // relationshipMemory incidents (edge-backed pairs; append immutably, bounded to last 8) +
  // the credit-maturity scalar patches (SET clamped-absolute trust/resentment — the
  // applyRelationshipPatch idiom; the resentment ratchet IS the casus-belli seam).
  if (incidentWrites.length) {
    const nextStates = { ...relStates };
    for (const w of incidentWrites) {
      const cur = asObject(nextStates[w.key]);
      const prior = Array.isArray(cur.recentIncidents) ? cur.recentIncidents : [];
      /** @type {Record<string, unknown>} */
      const nextRec = { ...cur };
      if (w.incident) nextRec.recentIncidents = [...prior.slice(-7), w.incident];
      if (w.patch) for (const [k, v] of Object.entries(w.patch)) nextRec[k] = v;
      nextStates[w.key] = nextRec;
    }
    nextWorldState = { ...nextWorldState, relationshipStates: nextStates };
    changed = true;
  }

  // Relief food deltas → settlementUpdates (the calamity idiom; conserved, clamped to [0,cap]).
  if (foodDeltas.size) {
    nextUpdates = applyFoodDeltasToUpdates(updates, updateIndex, foodDeltas);
    if (nextUpdates !== updates) changed = true;
  }

  // §9 legitimacy score deltas → settlementUpdates (bounded, integer, clamped [0,100]; only
  // where a structured {score} legitimacy exists). Runs AFTER the food pass so a giver's
  // granary drawdown and its ruler's legitimacy move compose on the same update entry.
  if (legitimacyDeltas.size) {
    const withLeg = applyLegitimacyDeltasToUpdates(nextUpdates, updateIndex, legitimacyDeltas);
    if (withLeg !== nextUpdates) { nextUpdates = withLeg; changed = true; }
  }

  return { worldState: nextWorldState, settlementUpdates: nextUpdates, changed, newsEntries, receipts };
}

// ── Persistence helpers ─────────────────────────────────────────────────────
/** Key-sorted shallow copy (deterministic ledger serialization). @param {Record<string, unknown>} rec */
function sortedRecord(rec) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const k of Object.keys(rec).sort()) out[k] = rec[k];
  return out;
}

/**
 * Apply the conserved per-settlement storageMonths deltas to settlementUpdates (clamped to
 * [0, granary capacity], rounded to the tenth-month — the applyFoodStockpileOutcome idiom).
 * @param {GenUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} foodDeltas
 * @returns {GenUpdate[]}
 */
function applyFoodDeltasToUpdates(updates, updateIndex, foodDeltas) {
  let next = updates;
  let cloned = false;
  for (const [id, delta] of foodDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    const fs = settlement?.economicState?.foodSecurity;
    if (!fs || !Number.isFinite(Number(fs.storageMonths))) continue;
    const cap = storageCapacityMonths(asSimSettlement(settlement));
    const nextMonths = Math.round(Math.max(0, Math.min(cap, Number(fs.storageMonths) + delta)) * 10) / 10;
    if (nextMonths === Number(fs.storageMonths)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = {
      ...entry,
      settlement: {
        ...settlement,
        economicState: { ...settlement.economicState, foodSecurity: { ...fs, storageMonths: nextMonths } },
      },
    };
  }
  return next;
}

/**
 * Apply the bounded per-giver publicLegitimacy.score deltas to settlementUpdates (§9): a
 * hungry giver's ruler loses legitimacy for shipping food out, a comfortable one gains a
 * small "granary city" lift. Integer, clamped [0,100] (the applyDivineMandate idiom); SKIPS
 * a legacy bare-number or absent legitimacy (only nudges a structured {score}). Pure.
 * @param {GenUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} legitimacyDeltas
 * @returns {GenUpdate[]}
 */
function applyLegitimacyDeltasToUpdates(updates, updateIndex, legitimacyDeltas) {
  let next = updates;
  let cloned = false;
  for (const [id, delta] of legitimacyDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    if (!settlement) continue;
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw)
      ? /** @type {Record<string, unknown>} */ (plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(Math.max(0, Math.min(100, Number(pl.score) + delta)));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = /** @type {GenUpdate} */ ({
      ...entry,
      settlement: /** @type {GenSettlement} */ (/** @type {unknown} */ ({
        ...settlement,
        powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } },
      })),
    });
  }
  return next;
}

// ── House-voice news (AGGREGATE — no npc named; the receipt is the kernel's). ──
/**
 * A relief-granted wizard-news entry. The kernel already narrated the deciding terms; this
 * frames it for the Chronicle. (The dedicated 'succor' newsVoice category is an E1b coupling.)
 * @param {{ giverId: string, receiverId: string, giverName: string, receiverName: string, verdict: string, receipt: string, magnitude: number, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
function succorNews({ giverId, receiverId, giverName, receiverName, verdict, receipt, magnitude, tick, now }) {
  const credit = verdict === VERDICTS.GIVE_AS_CREDIT;
  return {
    id: `wizard_news.${tick}.relief.${stablePart(giverId)}.${stablePart(receiverId)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: magnitude >= 0.6 ? 'notable' : 'minor',
    score: Math.round(45 + clamp01(magnitude) * 25),
    headline: credit ? `${giverName} advances grain to ${receiverName}` : `${giverName} sends relief to ${receiverName}`,
    summary: receipt,
    kind: 'applied',
    impactKind: 'generosity_relief',
    channelType: 'trade_route',
    severity: Math.round(clamp01(magnitude) * 100) / 100,
    settlementIds: [giverId, receiverId],
    impactIds: [],
    channelIds: [],
    sourceEventId: `relief.${giverId}.${receiverId}.${tick}`,
    tags: ['world_pulse', 'generosity', 'relief'],
    reasons: [receipt],
  };
}

/**
 * A refusal-that-wounds wizard-news entry (the tragic grudge forming — the DM may intervene).
 * @param {{ giverName: string, receiverName: string, receipt: string, damage: number, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
function refusalNews({ giverName, receiverName, receipt, damage, tick, now }) {
  return {
    id: `wizard_news.${tick}.relief_refused.${stablePart(giverName)}.${stablePart(receiverName)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: 'notable',
    score: Math.round(50 + clamp01(damage) * 20),
    headline: `${receiverName} is turned away by ${giverName}`,
    summary: receipt,
    kind: 'applied',
    impactKind: 'generosity_refusal',
    channelType: null,
    severity: Math.round(clamp01(damage) * 100) / 100,
    settlementIds: [],
    impactIds: [],
    channelIds: [],
    tags: ['world_pulse', 'generosity', 'refusal'],
    reasons: [receipt],
  };
}

/**
 * A credit-DEFAULT wizard-news entry (§3.4): a grain-debt fell into default — a grievance
 * that ratchets toward war (the casus-belli seam). AGGREGATE — the two courts, no named soul.
 * @param {{ debtorName: string, creditorName: string, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
function defaultNews({ debtorName, creditorName, tick, now }) {
  const summary = `${debtorName} defaulted on the grain-debt owed to ${creditorName} — the ledger sours into a grievance.`;
  return {
    id: `wizard_news.${tick}.credit_default.${stablePart(debtorName)}.${stablePart(creditorName)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: 'notable',
    score: 58,
    headline: `${debtorName} defaults on its debt to ${creditorName}`,
    summary,
    kind: 'applied',
    impactKind: 'generosity_credit_default',
    channelType: null,
    severity: 0.6,
    settlementIds: [],
    impactIds: [],
    channelIds: [],
    tags: ['world_pulse', 'generosity', 'credit', 'default'],
    reasons: [summary],
  };
}

export { REACTION_TUNING };
