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
 * E1c SHIPPED (this wave — REFUGE goes live; same dormancy gate ⇒ the golden holds byte-
 * identical): "generosity in people, not goods." A refuge PASS weighs each distressed
 * qualifying pair by the GIVE-side motive ALONE (refugeAcceptance — bond/history/conscience/
 * strategy/faith, enter/exit hysteresis + dwell; the domestic cost priced DOWNSTREAM by M4's
 * congestion brakes, design §4/§9) and, on an OPEN, writes a drop-when-empty 'refugePostures'
 * sub-ledger ('host:origin' -> { phase:'open', sinceTick, lastTick, weight01 }, stale-pruned).
 * migrationKernel.buildDestinationCandidate READS it as the refugePosture01 axis on
 * migration.destinationScore (W_REFUGE), weighting M4's destination choice toward the host
 * during the ally's exodus. A refuge_granted incident + a light succor beat fire on the open
 * transition. PIN CORRECTION (the handoff recipe's "pin identical {originDeaths,roadDeaths,
 * arrivals}" was PROVABLY WRONG — roadDeaths is a PER-COLUMN integer draw on each route's own
 * danger, so shifting shares moves roadDeaths AND total arrivals): the HONEST invariants are
 * (a) posture ABSENT ⇒ the axis adds EXACTLY 0 ⇒ byte-identical split (the golden guard); and
 * (b) posture PRESENT ⇒ departures + originDeaths unchanged + the conservation SUM exact (no
 * minting) — roadDeaths/arrivals REDISTRIBUTE across routes, never the total survivors vs deaths.
 *
 * E1d SHIPPED (this wave — THE GENEROSITY ENGINE COMPLETES; same dormancy gate ⇒ the goldens
 * hold byte-identical; the f3cf639e rulings implemented exactly):
 *   • PURCHASE goes live (design §4 / A2, ruling X/Y/Z) — the MARKET TWIN, wired as the
 *     post-REFUSE BONDED FALL-THROUGH ONLY ("you won't give? I'll pay"). A needy-AND-SOLVENT
 *     buyer BUYS the grain a bonded seller refused: grain conserves through the SAME sink
 *     (computeSackFoodTransfer); payment = a prosperity BAND-STEP debit on the buyer + a
 *     bounded non-zero-sum seller income nudge (the PROSPERITY_TIERS vocabulary — NO
 *     conserved-coin primitive), a typed 'trade_warmth' incident on the pair, a purchase beat.
 *     Debt-free (no obligation) + no legitimacy spent (a sale is not charity). A buyer too poor
 *     / a seller at the floor moves NO food ⇒ the §9 smuggle premium is untouched. The broad
 *     shortage→surplus enumeration is left to the acquisition-ladder mover (W-DOCTRINE, ruling Y).
 *   • TRADE_OVERTURE goes live (design §4 / A4, ruling Y/Z) — the per-pair GIVE-STREAM warms a
 *     corridor: a dwell-bounded drop-when-cold 'tradeOverture' sub-ledger (the merchantAppetite
 *     idiom) rises on each gift the pair exchanges; when warmth crosses the open threshold WITH
 *     dwell the giver opens an overture ONCE (the `initiated` latch): a byte-neutral trust-nudge
 *     into the pair's relationship-state so the EXISTING neutral_to_trade_partner rule can
 *     promote the label — NEVER an autonomous edge (ruling Y). Initiation routes through
 *     authorityFor(rules,'relationship_evolution','auto'): auto-applies under routine/full,
 *     WITHHELD under dm_only/recommendations (ruling Z — existing law, no new posture).
 *   • RUMOR belief-nudge goes live (design §3.1 / §9 INFORMATION) — a NOTABLE gift BROADCASTS:
 *     observers who ALREADY hold a belief about the giver read them richer (strengthBand ⇒
 *     raiders' attention) + friendlier (allianceLabel one rung ⇒ allies' trust), through
 *     beliefMap.reconcileBelief with a deed-inflated ground truth. GATED on beliefsActive
 *     (spatial marker + non-omniscient infoMode) ⇒ an omniscient/unmarked world is byte-
 *     identical (the belief/deity goldens prove it); only EXISTING slots move (no new keys).
 *
 * E1 IS COMPLETE with this wave: all six §4 instruments (grain_relief, warning, credit, refuge,
 * purchase, trade_overture) ship live. What remains is NOT E1-instrument work:
 *   • FORCE_RELIEF / OFFER_CREDIT counterpart DM-VERBS — ✅ SHIPPED (FP-G3 wave, 2026-07-15):
 *     the full 13-touchpoint threading landed (types / registry lean-spec / registryFull /
 *     registryProse / mutate / mutateWorld handlers / undoEvent snapshots + annotation scrub /
 *     affordanceManifest entries / batch consumes / buildEvent + composer dial /
 *     TARGET_ENTITY_BY_EVENT; walker counts 38/29/9 → 40/31/9; undoRoundTrip fixtures;
 *     preview≡apply + clamp pins — tests/domain/events/generosityVerbs.test.js). PAID FOR by
 *     the FP-G3 npcData reclaim (−51,957 B: corruption.js was the sole EAGER importer of the
 *     64 kB npcData.js for one small map → the data/npcTraitWeights.js leaf), so the wave lands
 *     far UNDER the pre-wave budget with no raise. The handlers run the SAME structural gate
 *     the mover runs (spatial/generosityGate.js — qualifiesForGenerosity extracted to a
 *     zero-import leaf, re-exported by generosityEV), the same reserve-floor law (mirrored
 *     const under a behavioral parity pin), and the same tenth-month grain flooring (a
 *     zero-grain decree VETOES — the E1d class, closed on the mover's give path this same
 *     wave). DM provenance: dual-written atEventId-stamped config._forcedRelief /
 *     _offeredCredit annotation ledgers (undo scrubs by provenance). Deliberately MOVER-OWNED,
 *     not in the settlement-scoped handlers (dossier scope reads no worldState): the obligation
 *     mint, gratitude/incidents, credit maturity, and the receiver-side grain — the annotations
 *     are the seam a future mover coupling can consume.
 *   • The traveling-relief refinement over commodityFlow (E1a JUDGMENT-2 reaffirmed: invasive —
 *     the M6a ledger is institution-keyed with a food-exclusion rule; a separate peer-shipment
 *     lane or the aspatial fallback is the contained path, not a schema change). W-DOCTRINE.
 *   • The upswing arcs (design Part B — reconstruction accelerant reads obligations; boom/
 *     flourishing) are E1d's SIBLING lane, unchanged and composing with this.
 */

import {
  constructiveFlowsActive, generosityEV, generosityForkKey, shouldInitiateAsk,
  routeRiskTerm, refugeAcceptance, purchaseFallThrough, VERDICTS,
} from '../spatial/generosityEV.js';
import {
  foldObligations, hasLiveObligation, gratitudeDeposit, giverMarginSacrifice,
  obligationMintMagnitude, reliefIncident, refusalDamage, fogForgiveness,
  bufferDisciplineStep, creditMaturityResolution, lendAppetiteStep, lendAppetiteOf,
  tradeOvertureStep,
  REACTION_TUNING,
} from '../spatial/generosityReactions.js';
import { faithAlignmentQuadrant, structuralLens, hasCharityFacet } from '../spatial/cohesionWeave.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { reconcileBelief, beliefsActive, strengthBandOf, strengthOfBand } from './beliefMap.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { computeLawfulness, computeMalice } from './disposition.js';
import { evil01, chaos01 } from './deityAxes.js';
import { mobilizationSeverity } from './mobilization.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { lifecycleStatusOf } from './settlementLifecycleFirstClass.js';
import { computeSackFoodTransfer, storageCapacityMonths, STOCKPILE_TUNING, famineFor } from './foodStockpile.js';
import { seasonForTick } from './worldState.js';
import { seasonalUnitSwing } from './seasons.js';
import { ensureRelationshipState, relationshipKeyFromEdge, normalizeRelationshipType } from './relationshipState.js';
import {
  succorNews, refusalNews, defaultNews, refugeNews, purchaseNews, tradeOvertureNews,
} from './generosityNews.js';
import { clamp01 } from '../../kernel/math.js';

// ── Kernel-local read-shapes (0-hole discipline: no `any`) ────────────────────
/** A recursively-forkable seeded PRNG (the pulse rng confluence). */
/** @typedef {{ fork: (k: string) => PulseRng, random: () => number }} PulseRng */
/** @typedef {{ _deityRef?: unknown, alignmentAxis?: string, lawAxis?: string }} GenDeity */
/** @typedef {{ name?: unknown, type?: unknown, category?: unknown }} GenInstitution */
/** @typedef {{ faction?: unknown, category?: unknown, power?: unknown }} GenFaction */
/** @typedef {{ population?: number, institutions?: GenInstitution[],
 *   economicState?: { foodSecurity?: { storageMonths?: unknown }, economicBase?: unknown, primaryIndustry?: unknown, prosperity?: unknown },
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
/** @typedef {import('../spatial/generosityEV.js').RefugePosture} RefugePosture */
/** @typedef {import('./beliefMap.js').BeliefRecord} BeliefRecord */

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
  // REFUGE (design §4 / E1c): a per-tick ceiling on refuge-posture evaluations (bounds the
  // hot path; the highest-need distressed pairs are weighed first — the same codepoint/need
  // order as the grain candidates) and the staleness horizon for an OPEN posture. A posture
  // not re-affirmed within REFUGE_STALE_TICKS (its distressed ally recovered ⇒ it left the
  // candidate set) is PRUNED — the host's gates quietly close once the crisis passes.
  // Byte-neutral when nothing is stale.
  REFUGE_CAP: 24,
  REFUGE_STALE_TICKS: 12,
  // TRADE OVERTURE (§9 TRADE / design A4 — E1d): the give-stream warmth threshold at/above
  // which a sustained aid corridor OPENS a trade overture, the DWELL (min ticks warm — the
  // "sustained" requirement, no flip-flop), and the byte-neutral TRUST-NUDGE the overture
  // writes into the pair's relationship-state so the EXISTING neutral_to_trade_partner
  // evolution rule (trust > 0.48) can promote the label — NEVER an autonomous edge-mint.
  // Initiation routes through authorityFor(rules, 'relationship_evolution', 'auto'): the nudge
  // AUTO-applies under routine/full and is WITHHELD under dm_only/recommendations (the DM's
  // proposal flow governs). Fires ONCE per warm episode (the record's `initiated` latch).
  TRADE_OVERTURE_OPEN_AT: 0.6,
  TRADE_OVERTURE_DWELL: 6,
  TRADE_OVERTURE_TRUST_NUDGE: 0.04,
  // THE RUMOR BELIEF-NUDGE (design §3.1 / §9 INFORMATION — E1d): a NOTABLE gift BROADCASTS —
  // observers who already hold a belief about the giver update it: believed WEALTH rises
  // (strengthBand up ⇒ raiders' attention) and believed CHARACTER warms (allianceLabel one
  // rung friendlier ⇒ allies' trust). Gated on beliefsActive (spatial marker + non-omniscient
  // infoMode) SO an omniscient/unmarked world is byte-identical; only EXISTING belief slots are
  // nudged (no new keys minted ⇒ the belief-ledger shape is unperturbed). Routed through
  // beliefMap.reconcileBelief with a deed-inflated ground truth (the deed is the evidence).
  BELIEF_NUDGE_MIN_MAGNITUDE: 0.6, // only a notable gift broadcasts (matches the succor rumor floor)
  BELIEF_NUDGE_STRENGTH: 0.2,      // the believed-wealth lift, in 0..1 strength (≈ one band)
  BELIEF_NUDGE_ACCURACY: 0.7,      // the broadcast report's fidelity (≥ CAT_ADOPT ⇒ the friendlier label adopts)
});

// ── The rumor belief-nudge ladder (design §3.1): a generosity deed warms believed CHARACTER
// by ONE rung toward friendlier — the same neutral→trade_partner arc the trade overture drives.
// Already-friendly labels (trade_partner/allied/patron/client/vassal) are unchanged. ──
/** @type {Record<string, string>} */
const FRIENDLIER_LABEL_STEP = Object.freeze({
  hostile: 'cold_war', cold_war: 'rival', rival: 'neutral', neutral: 'trade_partner',
});
/** @param {unknown} label @returns {string} the label one rung friendlier (or unchanged) */
function friendlierLabel(label) {
  const l = String(label ?? '');
  return FRIENDLIER_LABEL_STEP[l] || l;
}

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
 * The settlement's prosperity band ranked to [0,1] (0 = subsistence … 1 = wealthy), or 0 when
 * absent/unknown (a settlement with no readable prosperity band cannot pay ⇒ never buys). Routed
 * through the canonical prosperityRank ladder (data/constants) — never a hand-typed band match.
 * @param {GenSettlement|undefined} s @returns {number}
 */
function prosperity01Of(s) {
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (s?.economicState?.prosperity));
  return rank >= 0 ? rank / Math.max(1, PROSPERITY_TIERS.length - 1) : 0;
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

/**
 * Extract the GIVE-SIDE MOTIVE reads for one qualifying pair — bond, history, conscience,
 * strategy, faith + the cohesion-weave quadrant/lens modulators — the same give-side blend
 * the grain loop derives inline (§2.1). Used by the REFUGE pass, whose posture decision
 * (refugeAcceptance) is the give-side motive ALONE (the domestic cost of hospitality is
 * priced downstream by M4's congestion brakes, design §4/§9). Kept a SEPARATE derivation
 * from the grain loop's inline reads so the golden-pinned grain decision path is never
 * perturbed by the refuge wiring. Deterministic; no rng.
 * @param {Object} a
 * @param {GenSnapItem|undefined} a.giverItem @param {GenSettlement|undefined} a.giverS
 * @param {GenSettlement|undefined} a.receiverS @param {{ trust?: unknown, pactStrength?: unknown, dependency?: unknown, recentIncidents?: unknown }} a.relState
 * @param {string} a.kind @param {number} a.bondStrength @param {number} a.need01
 * @param {GenGraph|null|undefined} a.graph @param {string} a.giverId @param {string} a.receiverId
 * @param {Record<string, unknown>} a.worldState @param {Record<string, unknown>} a.lendAppetiteLedger @param {number} a.tick
 */
function deriveGiverMotive({ giverItem, giverS, receiverS, relState, kind, bondStrength, need01, graph, giverId, receiverId, worldState, lendAppetiteLedger, tick }) {
  // BOND (kind × strength + the vassal/patron/client duty).
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
  // STRATEGY (three explicit reads).
  const giverEnemies = new Set([...warFrontsInto(graph, giverId), ...warFrontsFrom(graph, giverId)]);
  const receiverEnemies = new Set([...warFrontsInto(graph, receiverId), ...warFrontsFrom(graph, receiverId)]);
  const sharesEnemy = [...receiverEnemies].some((e) => giverEnemies.has(e));
  const receiverBesieged = warFrontsInto(graph, receiverId).length > 0;
  const warStrategic01 = clamp01((sharesEnemy ? 0.7 : 0) + (sharesEnemy && receiverBesieged ? 0.2 : 0));
  const lendAppetite01 = lendAppetiteOf(lendAppetiteLedger, giverId);
  const leverage01 = clamp01((giverGood01 < 0.5 ? (0.5 - giverGood01) * 2 : 0) * lendAppetite01);
  const supplyDependency01 = kind === 'trade_partner' ? clamp01(num(relState.dependency, 0)) : 0;
  const strategy = { warStrategic01, supplyDependency01, leverage01 };
  // FAITH.
  const dG = giverS?.config?.primaryDeitySnapshot || null;
  const dR = receiverS?.config?.primaryDeitySnapshot || null;
  const prox = faithProximity(dG, dR);
  const faith = { templeMediated: charityRoster, sharedFaith01: prox.sharedFaith01 };
  // The cohesion-weave modulators (quadrant × structural lens).
  const quadrant = faithAlignmentQuadrant({ samePatron: prox.samePatron, alignmentKinship01: prox.alignmentKinship01 });
  const lens = structuralLens({ economicBase: economicBaseOf(giverS), governingArchetype: governingArchetypeOf(giverS) });
  const lensMod = {
    conscience: lens.modulators.conscience,
    strategy: lens.modulators.strategy,
    leverage: lens.modulators.leverage,
    domesticNerve: lens.modulators.domesticNerve,
    hysteresisWiden: lens.hysteresisWiden,
  };
  return { bond, history, conscience, strategy, faith, quadrantMod: quadrant.modulators, lensMod };
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
    // MOVERS SKIP REMNANTS (r2 economy-upswing-1), BOTH directions: a terminal-dead corpse
    // neither orients to give nor is a valid receiver of aid.
    if (lifecycleStatusOf(freshSettlement(giverId)) || lifecycleStatusOf(freshSettlement(receiverId))) return;
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
  /** @type {Map<string, number>} the net prosperity BAND-STEP delta per settlement (PURCHASE payment, §4/A2) */
  const prosperityDeltas = new Map();
  const willingnessLedger = asObject(getSpatialLedger(worldState, 'generosityWillingness'));
  const bufferLedger = asObject(getSpatialLedger(worldState, 'bufferDiscipline'));
  const lendAppetiteLedger = asObject(getSpatialLedger(worldState, 'lendAppetite'));
  // REFUGE postures (design §4 / E1c): the host-acceptance stances written this tick + carried.
  const refugeLedger = asObject(getSpatialLedger(worldState, 'refugePostures'));
  /** @type {Record<string, RefugePosture|null>} */
  const refugePostureWrites = {};
  // TRADE OVERTURE (§9 TRADE / design A4 — E1d): the per-pair give-stream warmth ledger +
  // the pairs that gave THIS tick (key → { relKey, trust } for the byte-neutral trust-nudge).
  const tradeOvertureLedger = asObject(getSpatialLedger(worldState, 'tradeOverture'));
  /** @type {Map<string, { giverId: string, receiverId: string, relKey: string, trust: number }>} */
  const tradeOvertureGaveInfo = new Map();
  // RUMOR belief-nudge (design §3.1 / §9): the givers whose NOTABLE gift broadcasts this tick.
  /** @type {Set<string>} */
  const beliefBroadcasters = new Set();

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
      // ── A gift REACTS only when it ACTUALLY MOVES GRAIN. A willing giver a sliver above
      // the reserve floor DECIDES to give, but the conserved sink FLOORS the transfer to the
      // tenth-month ⇒ ZERO grain moves (computeSackFoodTransfer returns null ⇒ lostMonths 0).
      // That is the tenth-month floor class — E1d's zero-grain-SALE sibling on the GIVE path:
      // no aid changed history, so NOTHING records it (no obligation, no widow's-mite gratitude,
      // no legitimacy cost, no succor beat, no rumor broadcast, no trade-overture warming, no
      // moral-hazard decay). Mirrors the purchase fall-through's `sold` gate exactly. ──
      if (lostMonths > 0) {
        foodDeltas.set(giverId, (foodDeltas.get(giverId) || 0) - lostMonths);
        if (gainedMonths > 0) foodDeltas.set(receiverId, (foodDeltas.get(receiverId) || 0) + gainedMonths);

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

        newsEntries.push(succorNews({
          giverId, receiverId,
          giverName: String(giverItem?.name || giverId), receiverName: String(receiverItem?.name || receiverId),
          verdict: verdict.verdict, receipt: verdict.receipt, magnitude: verdict.magnitudeFraction, tick, now,
        }));
        // ── TRADE-OVERTURE give-stream (§9 TRADE / A4): this pair exchanged a gift this tick,
        // warming the giver→receiver corridor toward a trade route (the per-pair source that
        // supersedes the per-node tradeFlow tally). The dwell-bounded warmth ledger + the
        // byte-neutral trust-nudge are committed below. ──
        tradeOvertureGaveInfo.set(`${giverId}:${receiverId}`, { giverId, receiverId, relKey, trust: clamp01(num(relState.trust, 0)) });
        // RUMOR broadcast (design §3.1 / §9): a NOTABLE gift makes the giver read as richer +
        // friendlier to those already watching (the belief-nudge is committed below, belief-gated).
        if (verdict.magnitudeFraction >= T.BELIEF_NUDGE_MIN_MAGNITUDE) beliefBroadcasters.add(giverId);
      }
      // The receipt + the moral-hazard buffer step fire ONCE per give, keyed on whether grain
      // ACTUALLY moved: a zero-grain give banks a magnitude-0 receipt (the ask fired — NOT a
      // refusal) and NO discipline decay (no relief was received). Mirrors the purchase `sold` gate.
      receipts.push({ giverId, receiverId, verdict: verdict.verdict, magnitude: lostMonths > 0 ? verdict.magnitudeFraction : 0 });
      bufferSteps.push({ giverId, receiverId, reliefThisTick: lostMonths > 0 });
    } else {
      // ── THE PURCHASE FALL-THROUGH (design §4 / A2 — "you won't give? I'll pay"). The
      // free gift was refused; a needy-AND-SOLVENT buyer may still BUY the grain the seller
      // would not give. Grain conserves through the SAME sink; payment = a prosperity
      // BAND-STEP debit on the buyer + a bounded seller income nudge (no conserved coin —
      // the sim's prosperity vocabulary). Debt-free (no obligation) and no legitimacy spent
      // (a sale is not charity). No sale ⇒ the shortage persists exactly (the §9 smuggle
      // premium the M7 tail reads is untouched — a buyer too poor / a seller at the floor
      // moves no food). ──
      const purchase = purchaseFallThrough({
        buyerProsperity01: prosperity01Of(receiverS),   // the buyer is the needy receiver
        need01,
        sellerSpareable01: reserveAboveFloor01,          // the seller is the refusing giver
      });
      // A sale COMPLETES only if grain actually changes hands. The buy-decision keys on the
      // NORMALISED above-floor headroom, but the conserved grain sink FLOORS to the tenth-month:
      // a seller a sliver above the reserve floor can clear the buy gate yet move ZERO grain.
      // That is a NO-SALE (no coin for nothing, no false "buys grain" beat) — it falls through
      // to the refusal reaction, preserving the §9 smuggle premium AND the refused-ask grudge.
      let sold = false;
      if (purchase.buys) {
        // The grain leg (seller giver → buyer receiver), conserved through the pure sink.
        const giverPop = Math.max(0, num(giverS?.population, 0));
        const receiverPop = Math.max(0, num(receiverS?.population, 0));
        const receiverMonths = storageMonthsOf(receiverS);
        const receiverCap = storageCapacityMonths(asSimSettlement(receiverS));
        const transfer = computeSackFoodTransfer({
          conqueredStorageMonths: spareableMonths,       // only the seller's above-floor headroom
          conqueredPopulation: giverPop,
          victorStorageMonths: receiverMonths,
          victorPopulation: receiverPop,
          victorCapMonths: receiverCap,
          takeFraction: purchase.magnitudeFraction01,
          captureFraction: T.RELIEF_CAPTURE,
        });
        const lostMonths = transfer ? transfer.lostMonths : 0;
        const gainedMonths = transfer ? transfer.gainedMonths : 0;
        if (lostMonths > 0) {
          // Grain moved ⇒ the sale is REAL: move the food, take the payment, bank the warmth.
          sold = true;
          foodDeltas.set(giverId, (foodDeltas.get(giverId) || 0) - lostMonths);
          if (gainedMonths > 0) foodDeltas.set(receiverId, (foodDeltas.get(receiverId) || 0) + gainedMonths);
          // The PAYMENT: a prosperity band-step debit on the buyer + a bounded seller income nudge.
          if (purchase.buyerDebitBands > 0) prosperityDeltas.set(receiverId, (prosperityDeltas.get(receiverId) || 0) - purchase.buyerDebitBands);
          if (purchase.sellerCreditBands > 0) prosperityDeltas.set(giverId, (prosperityDeltas.get(giverId) || 0) + purchase.sellerCreditBands);
          // A typed trade-warmth incident on the pair (a market deposit — NOT a debt) + a beat.
          const tradeInc = reliefIncident({ kind: 'trade_warmth', tick, magnitude01: purchase.magnitudeFraction01, summary: purchase.receipt });
          if (tradeInc) incidentWrites.push({ key: relKey, incident: tradeInc });
          newsEntries.push(purchaseNews({
            giverName: String(giverItem?.name || giverId), receiverName: String(receiverItem?.name || receiverId),
            magnitude: purchase.magnitudeFraction01, receipt: purchase.receipt, tick, now,
          }));
          receipts.push({ giverId, receiverId, verdict: 'purchase', magnitude: purchase.magnitudeFraction01 });
        }
      }
      if (!sold) {
        // ── REFUSE (no sale completed): the fog-mediated refusal memory (§3.2/§3.3). The
        // belief-map wiring is E1c; here the forgiveness reads the giver's own scarcity/military
        // as a proxy for what a well-informed receiver would believe. ──
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
        receipts.push({ giverId, receiverId, verdict: verdict.verdict, magnitude: 0 });
      }
      // A refused ask (bought or not) is NOT relief — no moral-hazard discipline decay.
      bufferSteps.push({ giverId, receiverId, reliefThisTick: false });
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

  // ── REFUGE POSTURES (design §4 / E1c): "generosity in people, not goods." For each
  // distressed qualifying pair (the SAME need-gated, codepoint/need-ordered candidates the
  // grain loop weighs), the HOST decides — by the give-side motive ALONE (bond/history/
  // conscience/strategy/faith; the domestic cost of hospitality is priced DOWNSTREAM by M4's
  // congestion/crowding brakes) — whether to OPEN a refuge posture toward the distressed
  // ally. An open posture is a standing STANCE (enter/exit hysteresis + dwell — it does not
  // flip weekly) written to the drop-when-empty refugePostures sub-ledger and READ in
  // migrationKernel.buildDestinationCandidate as the refugePosture01 axis, weighting M4's
  // destination choice toward the host during that ally's exodus. Conservation is untouched:
  // it only re-weights WHERE survivors go, never how many survive (design §9 MIGRATION). ──
  {
    let refugeAsks = 0;
    for (const cand of candidates) {
      if (refugeAsks >= T.REFUGE_CAP) break;
      refugeAsks += 1;
      const { giverId, receiverId, edge, need01, bondStrength } = cand;
      const giverItem = itemById.get(giverId);
      const receiverItem = itemById.get(receiverId);
      const giverS = freshSettlement(giverId);
      const receiverS = freshSettlement(receiverId);
      const relKey = relationshipKeyFromEdge(edge);
      const relState = ensureRelationshipState(edge, relStates[relKey]);
      const kind = KIND_MAP[normalizeRelationshipType(String(edge?.relationshipType || 'neutral'))] || 'trade_partner';
      const motive = deriveGiverMotive({
        giverItem, giverS, receiverS, relState, kind, bondStrength, need01,
        graph, giverId, receiverId, worldState, lendAppetiteLedger, tick,
      });
      const postureKey = `${giverId}:${receiverId}`;
      const priorPosture = /** @type {RefugePosture|null} */ (refugeLedger[postureKey] || null);
      const decision = refugeAcceptance({ ...motive, priorPosture, now: tick });
      if (decision.open && decision.posture) {
        refugePostureWrites[postureKey] = decision.posture;
        // On the OPEN transition (a fresh posture), bank the refuge_granted incident (the
        // "aid changes history" artifact) + a light succor beat. A held posture re-affirms
        // silently (no news spam), a closed one drops.
        if (!priorPosture) {
          const inc = reliefIncident({ kind: 'refuge_granted', tick, magnitude01: decision.weight01 });
          if (inc) incidentWrites.push({ key: relKey, incident: inc });
          newsEntries.push(refugeNews({
            giverName: String(giverItem?.name || giverId), receiverName: String(receiverItem?.name || receiverId),
            weight: decision.weight01, tick, now,
          }));
        }
      } else {
        refugePostureWrites[postureKey] = null; // closed / not opened ⇒ drop
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

  // Refuge-postures sub-ledger (design §4 / E1c): upsert this tick's OPEN stances, drop the
  // closed ones, and STALE-PRUNE a posture whose distressed ally left the candidate set (the
  // crisis passed — the gates quietly close). Drop-when-empty ⇒ byte-identical-dormant.
  {
    /** @type {Record<string, RefugePosture>} */
    const nextPostures = {};
    for (const [k, v] of Object.entries(refugeLedger)) {
      if (k in refugePostureWrites) continue; // updated (or closed) by this tick's writes below
      const rec = asObject(v);
      const last = num(rec.lastTick, num(rec.sinceTick, tick));
      if (tick - last > T.REFUGE_STALE_TICKS) continue; // stale ⇒ the crisis passed, gates close
      nextPostures[k] = /** @type {RefugePosture} */ (v);
    }
    for (const [k, v] of Object.entries(refugePostureWrites)) {
      if (v) nextPostures[k] = v;
    }
    const sortedNextPostures = sortedRecord(nextPostures);
    if (JSON.stringify(sortedNextPostures) !== JSON.stringify(sortedRecord(refugeLedger))) {
      nextWorldState = Object.keys(sortedNextPostures).length
        ? setSpatialLedger(nextWorldState, 'refugePostures', sortedNextPostures)
        : dropSpatialLedger(nextWorldState, 'refugePostures');
      changed = true;
    }
  }

  // Trade-overture sub-ledger (§9 TRADE / design A4 — E1d): step every pair's give-stream
  // warmth (a gift this tick warms; a silent tick decays; cold ⇒ pruned ⇒ drop-when-empty ⇒
  // byte-identical-dormant). When warmth crosses the open threshold AND has DWELLED, the giver
  // OPENS a trade overture ONCE (the `initiated` latch): a byte-neutral trust-nudge into the
  // pair's relationship-state so the EXISTING neutral_to_trade_partner rule (trust > 0.48) can
  // promote the label — NEVER an autonomous edge-mint. The nudge routes through authorityFor:
  // it AUTO-applies under routine/full and is WITHHELD under dm_only/recommendations (the DM's
  // proposal flow governs the route opening; the label change is itself always-proposal).
  if (tradeOvertureGaveInfo.size || Object.keys(tradeOvertureLedger).length) {
    const rules = asObject(worldState?.simulationRules);
    const overtureMode = authorityFor(rules, 'relationship_evolution', 'auto');
    /** @type {Record<string, unknown>} */
    const nextOverture = {};
    const keys = new Set([...Object.keys(tradeOvertureLedger), ...tradeOvertureGaveInfo.keys()]);
    for (const key of keys) {
      const priorRec = asObject(tradeOvertureLedger[key]).warmth != null ? tradeOvertureLedger[key] : null;
      const gave = tradeOvertureGaveInfo.has(key);
      const stepped = tradeOvertureStep(
        /** @type {Parameters<typeof tradeOvertureStep>[0]} */ (priorRec), { gaveThisTick: gave, now: tick });
      if (!stepped) continue; // cold ⇒ prune
      let initiated = asObject(priorRec).initiated === true;
      if (!initiated && gave
        && stepped.warmth >= T.TRADE_OVERTURE_OPEN_AT
        && (tick - stepped.sinceTick) >= T.TRADE_OVERTURE_DWELL
        && overtureMode === 'auto') {
        const info = tradeOvertureGaveInfo.get(key);
        if (info) {
          // The byte-neutral trust-nudge (clamped) + a trade-warmth incident + a light beat.
          const nudged = clamp01(info.trust + T.TRADE_OVERTURE_TRUST_NUDGE);
          const inc = reliefIncident({ kind: 'trade_warmth', tick, magnitude01: stepped.warmth });
          if (inc) incidentWrites.push({ key: info.relKey, incident: inc, patch: { trust: nudged } });
          newsEntries.push(tradeOvertureNews({
            giverName: String(itemById.get(info.giverId)?.name || info.giverId),
            receiverName: String(itemById.get(info.receiverId)?.name || info.receiverId),
            warmth: stepped.warmth, tick, now,
          }));
          initiated = true;
        }
      }
      nextOverture[key] = initiated ? { ...stepped, initiated: true } : stepped;
    }
    const sortedNextOverture = sortedRecord(nextOverture);
    if (JSON.stringify(sortedNextOverture) !== JSON.stringify(sortedRecord(tradeOvertureLedger))) {
      nextWorldState = Object.keys(sortedNextOverture).length
        ? setSpatialLedger(nextWorldState, 'tradeOverture', sortedNextOverture)
        : dropSpatialLedger(nextWorldState, 'tradeOverture');
      changed = true;
    }
  }

  // RUMOR belief-nudge (design §3.1 / §9 INFORMATION — E1d): a NOTABLE gift BROADCASTS. For
  // every observer that ALREADY holds a belief about a broadcasting giver, nudge believed
  // WEALTH up (strengthBand ⇒ raiders' attention) and believed CHARACTER one rung friendlier
  // (allianceLabel ⇒ allies' trust), routed through beliefMap.reconcileBelief with a
  // deed-inflated ground truth (the deed is the evidence). GATED on beliefsActive (spatial
  // marker + non-omniscient infoMode) so an omniscient/unmarked/dormant world is byte-identical.
  // Only EXISTING slots are touched (no new keys minted ⇒ the belief-ledger shape/order is
  // preserved — no re-sort) and only a MATERIAL wealth/character shift writes (byte-neutral for
  // an already-maxed belief). Deed-broadcast rumor + the succor beat already carry the FACT of
  // the gift; this is the perception BIAS the design §9 INFORMATION row calls the "missing edge".
  if (beliefBroadcasters.size && beliefsActive(worldState)) {
    const beliefMaps = asObject(getSpatialLedger(worldState, 'beliefMaps'));
    // The deed's single broadcast report (firsthand, fresh, faithful — accuracy ≥ CAT_ADOPT).
    const report = { hopCount: 0, ageTicks: 0, independentSources: 1, completeness01: 1, accuracy01: T.BELIEF_NUDGE_ACCURACY, score: 60, sortKey: 'generosity_broadcast' };
    let nextMaps = beliefMaps;
    let mapsTouched = false;
    for (const [obs, byFactionRaw] of Object.entries(beliefMaps)) {
      const byFaction = asObject(byFactionRaw);
      /** @type {Record<string, unknown>|null} */
      let nextByFaction = null;
      for (const [fac, bySubjectRaw] of Object.entries(byFaction)) {
        const bySubject = asObject(bySubjectRaw);
        /** @type {Record<string, unknown>|null} */
        let nextBySubject = null;
        for (const giverId of beliefBroadcasters) {
          const raw = bySubject[giverId];
          if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
          const prior = /** @type {BeliefRecord} */ (raw);
          const inflatedBand = strengthBandOf(clamp01(strengthOfBand(num(prior.strengthBand, 2)) + T.BELIEF_NUDGE_STRENGTH));
          const groundTruth = /** @type {BeliefRecord} */ ({ ...prior, strengthBand: inflatedBand, allianceLabel: friendlierLabel(prior.allianceLabel) });
          const nextRec = reconcileBelief({ prior, groundTruth, reports: [report], now: tick });
          // Only a MATERIAL wealth/character shift is worth a write (byte-neutral otherwise).
          if (nextRec.strengthBand === prior.strengthBand && nextRec.allianceLabel === prior.allianceLabel) continue;
          if (!nextBySubject) nextBySubject = { ...bySubject };
          nextBySubject[giverId] = nextRec;
        }
        if (nextBySubject) {
          if (!nextByFaction) nextByFaction = { ...byFaction };
          nextByFaction[fac] = nextBySubject;
        }
      }
      if (nextByFaction) {
        if (!mapsTouched) { nextMaps = { ...beliefMaps }; mapsTouched = true; }
        nextMaps[obs] = nextByFaction;
      }
    }
    if (mapsTouched) {
      nextWorldState = setSpatialLedger(nextWorldState, 'beliefMaps', nextMaps);
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

  // PURCHASE payment prosperity band-step deltas → settlementUpdates (§4/A2: a buyer's
  // band-step debit + a bounded seller income nudge, ranked on the canonical PROSPERITY_TIERS
  // ladder, clamped [0,6]; only where a readable prosperity band exists). Runs AFTER the food
  // pass so the grain and its price compose on the same update entry.
  if (prosperityDeltas.size) {
    const withProsp = applyProsperityDeltasToUpdates(nextUpdates, updateIndex, prosperityDeltas);
    if (withProsp !== nextUpdates) { nextUpdates = withProsp; changed = true; }
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

/**
 * Apply the PURCHASE payment prosperity BAND-STEP deltas to settlementUpdates (§4/A2 — E1d):
 * a buyer's band-step debit + a bounded seller income nudge, both ranked on the canonical
 * PROSPERITY_TIERS ladder (data/constants — never a hand-typed band match), clamped [0,6], and
 * written back IN KIND (a string label stays a string; a { tier } object keeps its shape). A
 * settlement with no readable prosperity band (numeric/absent ⇒ rank −1) is SKIPPED. Because
 * the ladder is coarse, a single sale's sub-band nudge often rounds to no change; a settlement
 * that sells to several buyers in one tick accumulates its credits and CAN step up a band (the
 * "granary city grows rich on volume" story). Pure.
 * @param {GenUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} prosperityDeltas
 * @returns {GenUpdate[]}
 */
function applyProsperityDeltasToUpdates(updates, updateIndex, prosperityDeltas) {
  let next = updates;
  let cloned = false;
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  for (const [id, delta] of prosperityDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    const ec = asObject(settlement?.economicState);
    const cur = ec.prosperity;
    const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (cur));
    if (rank < 0) continue; // no readable band (numeric/absent) — nothing to step
    const nextRank = Math.round(Math.max(0, Math.min(maxRank, rank + delta)));
    if (nextRank === rank) continue;
    const nextLabel = PROSPERITY_TIERS[nextRank];
    // Preserve the field shape (string label vs { tier } object).
    const nextProsperity = cur && typeof cur === 'object' && !Array.isArray(cur)
      ? { .../** @type {Record<string, unknown>} */ (cur), tier: nextLabel } : nextLabel;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = /** @type {GenUpdate} */ ({
      ...entry,
      settlement: /** @type {GenSettlement} */ (/** @type {unknown} */ ({
        ...settlement, economicState: { ...ec, prosperity: nextProsperity },
      })),
    });
  }
  return next;
}

export { REACTION_TUNING };
