/**
 * domain/worldPulse/supplyWebWarfare.js — W-DOCTRINE-1: SUPPLY-WEB WARFARE
 * (the indirect-war doctrine — DESIGN_SUPPLY_WEB_WARFARE.md).
 *
 * The owner's directive (§0): war strategy must include the INDIRECT path. A
 * war-prepared and/or better-INFORMED actor — a smaller force that cannot win the
 * direct fight, or a larger force reducing confrontation risk — systematically
 * strikes the satellite suppliers (the villages and thorps that feed a town and its
 * army) to weaken the target BEFORE the final confrontation, with TIME fully priced.
 *
 * This is a CHOOSER DEEPENING + one small conditional plan state, NOT a new physics
 * layer (§1). It rides existing substrate:
 *   - THE WEB (§2) IS the M2/M6a supply-link graph — deriveConsumingLinks +
 *     rankSupplySources + assessSourceRedundancy give the target's inbound
 *     dependency web, fragility, and buffer thinness. The read is BELIEF-GATED here
 *     (an informed commander sees the real web; a fog-blind one strikes the wrong
 *     village — misjudgment-as-cause extended to grand strategy).
 *   - THE STRATEGIC CHOICE (§3) is an explicit DIRECT-vs-INDIRECT EV comparison with
 *     the owner's TIME DISCOUNT (own drain, T's failover adaptation, counterplay
 *     growth, seasonal windows). The EV gate IS the "chooser compares" — WHO chooses
 *     indirect emerges from the reads (a weaker force's direct EV is terrible; an
 *     informed force's web read is high-confidence; a bold strong actor just attacks).
 *   - THE INSTRUMENTS (§4) are one doctrine, alignment/archetype-flavored: raid,
 *     occupy, embargo, toll war, purchase denial, interdiction — bloody to bloodless.
 *   - THE CAMPAIGN PLAN (§6) is the ONE new conditionally-materialized ledger
 *     (spatialLedgers.campaignPlans, keyed by aggressor), re-scored every tick
 *     (plans are hypotheses, not rails) and ABANDONED on EV collapse (no forever-grind).
 *   - ATROCITY ECONOMICS (§7): a raid on an innocent village is the textbook
 *     moralDrift case — it drifts the aggressor's alignment (the doctrine corrupts
 *     its user) and broadcasts a "burner of villages" reputation. These are the
 *     BRAKES the EV prices, so razing the villages is usually wrong.
 *   - THE COUNTERPLAY (§5) is mostly EXISTING machinery given honest inputs: M2
 *     failover re-sourcing (the web adapts — read here as adaptation), E1 relief
 *     corridors and M7 mercy-smuggling keep the town fed (read here as the town
 *     staying above the strangulation floor). The strangulation the aggressor
 *     achieves feeds the target's economic_strangulation PEACE reason — the town
 *     sues for early terms, which the EV re-score reads as the campaign's success
 *     (it stops early when T sues).
 *
 * CONSTITUTIONAL POSTURE (§8):
 *   - GATE: supplyWebWarfareActive(worldState) — warLayerEnabled === true AND the
 *     VIRTUAL supplyWebWarfareEnabled === true (the peaceEngineEnabled idiom: NO
 *     entry in DEFAULT_SIMULATION_RULES, so every existing golden — including the
 *     warLayerEnabled belief/spatial/peace goldens — is byte-identical; an
 *     explicitly-lit rules blob survives normalizeSimulationRules' spread). Gate
 *     absent ⇒ an IMMEDIATE no-op: zero forks, zero ledger keys.
 *       [JUDGMENT — a virtual sub-flag, not the design's literal "no new top-level
 *        flag inside settlementStrategyEnabled + warLayerEnabled": the constitution's
 *        byte-identity law (also §8) dominates. A bare `settlementStrategyEnabled &&
 *        warLayerEnabled` gate would MOVE any golden carrying both real flags. The
 *        virtual-flag idiom is the sanctioned reconciliation (see warReasons.js
 *        peaceCausalActive). Say "veto" to flip to the bare composite gate.]
 *   - Seeded forks `webwar:${aggressor}:${target}:${tick}` (§8), codepoint-sorted
 *     iteration everywhere, every constant named/frozen/retunable (WEBWAR_TUNING /
 *     INSTRUMENTS), aggregate-only, receipts on every mint / score / abandonment /
 *     stage / misjudgment. Ledger writes ride getSpatialLedger/setSpatialLedger/
 *     dropSpatialLedger (drop-when-empty; absent ⇒ byte-identical; zero eager
 *     first-paint bytes — the spatialLedgers family carries the name; this kernel is
 *     imported ONLY by the lazy pulseKernel).
 *   - CONSERVATION (§8): an interdicted good never vanishes unaccounted. This wave
 *     records the strangulation as a PRESSURE the target feels (the economic_
 *     strangulation feed + the EV read); it deletes no goods and no settlements
 *     (the M11-class bound — satellites are flight/severance/recovery, never
 *     annihilation). The physical granary-sink coupling (storageMonths debit) is a
 *     DOCUMENTED DEFERRAL, mirroring generosity's "instruments beyond grain relief
 *     land with E1b" precedent — the strangulation ledger is the honest, conserved
 *     proxy that closes the drama loop (strangle → economic_strangulation → early
 *     suit) with zero conservation risk.
 *
 * DOCUMENTED DEFERRALS (deliberate, not gaps — clean boundaries per the scope order):
 *   - The literal enumerateMoves `weaken_first` softmax move family: this kernel's
 *     EV gate embodies the direct-vs-indirect choice; surfacing it as a DM-proposal
 *     strategy candidate (dm_advanced oversight) is a follow-on.
 *   - Physical raid execution (war_front mint, M4 flight, storageMonths debit): the
 *     strangulation ledger is the conserved proxy; the physical coupling is deferred.
 *   - The forceable verbs (declareTradeEmbargo / orderSupplyRaid below) ship as pure
 *     gated worldState mutations + VETO_PROSE but are NOT registered in the
 *     settlement-scoped affordance manifest — the manifest walker hard-asserts
 *     scope==='settlement' and parks realm/worldState verbs for W-COMPOSER-2 (the
 *     exact declareCasus / sueForPeaceOrder precedent). W-GUIDE registers the
 *     whispers later.
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { buildProducerIndex, deriveConsumingLinks } from './supplyKernel.js';
import { assessSourceRedundancy } from '../spatial/supplyShipments.js';
import {
  belief, readBeliefStrength, readBeliefRelationship, governingCoalition,
} from './beliefMap.js';
import { sightFidelityOf } from './informationStatecraft.js';
// W-DOCTRINE-3b PAID EYES (§3): a live foreign-corruption asset grants its patron sight on the
// target (the design's "sight + hand"). 0 when the corruption web is dormant / no asset ⇒
// byte-identical (the web goldens never lit it).
import { assetSightFidelityOf } from './corruptionWeb.js';
import { computeMalice, computeLawfulness } from './disposition.js';
import {
  settlementStrength, buildPressureSummary, getRelationshipSettlements,
  relationshipKeyFromEdge, normalizeRelationshipEdge, ensureRelationshipState,
} from './relationshipEvolution.js';
import { stableSampleByWeight } from '../region/contestMath.js';
import { clamp01 } from '../../kernel/math.js';
import { stablePart } from './stablePart.js';
import { abandonFloorScale } from './momentum.js';

/** @typedef {{ fork?: (key: string) => { random: () => number } } | null} RngLike */
/** @typedef {import('./supplyKernel.js').SpatialDigest} SpatialDigest */
/** @typedef {import('./supplyKernel.js').SupplySettlement} SupplySettlement */
/** A settlement item as it appears on the pre-tick snapshot. @typedef {{ id: string, name?: string,
 *   governingArchetype?: string, settlement?: import('../settlement.schema.js').SimSettlement,
 *   causal?: { scores?: Record<string, number> } }} WebwarItem */
/** The loosely-typed snapshot slice this kernel reads. @typedef {{ byId?: Map<string, WebwarItem>,
 *   settlements?: WebwarItem[], regionalGraph?: { edges?: Array<Record<string, unknown>> },
 *   worldState?: { relationshipStates?: Record<string, unknown> } }} WebwarSnapshot */
/** @typedef {Record<string, unknown> | null} PressureIndex */

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** The hostile/adversarial axis an aggressor can open a campaign against — the SAME
 *  set the settlement chooser reads (settlementStrategy HOSTILE_TYPES). */
const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

// ── Tuning (bounded named constants — owner-retunable per §8) ────────────────────

export const WEBWAR_TUNING = Object.freeze({
  /** Max plans live per aggressor (§6 "one live plan per aggressor"). */
  MAX_PLANS_PER_AGGRESSOR: 1,
  /** Max stages a campaign plan sequences (§6 "stages ≤ 4"). */
  STAGE_CAP: 4,
  /** A plan mints only when the indirect EV beats direct by at least this margin
   *  (a real preference for the indirect path, not a coin-flip — §3). */
  MINT_EV_MARGIN: 0.08,
  /** A plan mints only when the indirect EV clears this floor (no minting a doomed
   *  campaign). */
  MINT_EV_FLOOR: 0.4,
  /** A live plan is ABANDONED when its re-scored EV falls below this (§3 "abandons a
   *  stalling campaign; no forever-grind"). */
  ABANDON_EV_FLOOR: 0.28,
  /** A live plan is ABANDONED when the target's web fragility has RECOVERED past this
   *  fraction of its at-mint fragility (§3(b) M2 failover re-sourced — adaptation
   *  outpaced the strangulation). */
  ABANDON_ADAPTATION_RATIO: 0.5,
  /** The strength margin (believedSelf − believedTarget) at which the DIRECT assault
   *  is an even bet — below it the direct path is terrible, which is what makes a
   *  weaker force reach for the indirect one. */
  DIRECT_MARGIN_GAIN: 1.0,
  /** How much a fully-strangled, fully-known, fully-fragile web reduces the target's
   *  EFFECTIVE strength for the projected weakened assault (§3 the indirect payoff). */
  STRANGLE_MAX_REDUCTION: 0.5,
  /** The per-strangulation-tick own-drain the time discount charges (§3(a)). */
  DRAIN_PER_TICK: 0.04,
  /** The adaptation risk the time discount charges per NON-fragile (redundant) path in
   *  the web — a redundant web re-sources faster, so the campaign is worth less (§3(b)). */
  ADAPTATION_RISK_PER_PATH: 0.06,
  /** The counterplay-growth discount: the longer/bloodier the plan, the earlier the
   *  target reads intent (§3(c) / §5 "they mean to starve us"). Scaled by stage count. */
  COUNTERPLAY_PER_STAGE: 0.03,
  /** Per-active-stage strangulation contribution to the target (bounded by clamp). */
  STRANGLE_GAIN_PER_STAGE: 0.22,
  /** A web read below this aggregate confidence is "fog-blind" — the aggressor cannot
   *  reliably distinguish the real suppliers, so a wrong-village strike is likely. */
  FOG_BLIND_CONFIDENCE: 0.35,
  /** The atrocity EV brake: a raid stage's projected alignment/reputation cost
   *  subtracted from the indirect EV, scaled by victim innocence + the aggressor's
   *  professed creed (a lawful-good aggressor prices it highest). */
  ATROCITY_BRAKE_GAIN: 0.35,
  /** How many recent instruments of the same target read as the legible pattern the
   *  target's belief picks up (§5 pattern recognition). */
  PATTERN_LEGIBLE_AT: 2,
});

// ── The instrument catalog (§4 — one doctrine, alignment/archetype-flavored) ──────
//
// Every instrument drives the SAME web read, from bloody to bloodless. `fit` weights
// select the mix by the aggressor's governing archetype + alignment lean; `bloody`
// marks the ones that raid innocents (the atrocity brake reads it). All numbers are
// bounded 0..1 and owner-retunable.
/** @typedef {{ bloody: boolean, reversible: boolean, garrison: number, strangleGain: number,
 *   evilFit: number, lawfulFit: number, merchantFit: number, militaryFit: number,
 *   headline: string }} Instrument */
/** @type {Readonly<Record<string, Instrument>>} */
export const INSTRUMENTS = Object.freeze({
  // RAID — a fast, ugly light strike: burns granary/stock, severs links for K ticks,
  // NO occupation, NO annihilation. The military / evil-lean weapon.
  raid: Object.freeze({
    bloody: true, reversible: false, garrison: 0, strangleGain: WEBWAR_TUNING.STRANGLE_GAIN_PER_STAGE,
    evilFit: 0.9, lawfulFit: 0.15, merchantFit: 0.1, militaryFit: 0.9,
    headline: 'a granary raid',
  }),
  // OCCUPY — slower, holds the link, costs garrison. Militaries with reach.
  occupy: Object.freeze({
    bloody: true, reversible: false, garrison: 0.8, strangleGain: WEBWAR_TUNING.STRANGLE_GAIN_PER_STAGE * 1.1,
    evilFit: 0.6, lawfulFit: 0.5, merchantFit: 0.1, militaryFit: 0.8,
    headline: 'a supply-town occupation',
  }),
  // INTERDICTION — patrol the routes rather than strike the sources. Bloodier than
  // trade denial, cheaper than a raid; the professional's tool.
  interdiction: Object.freeze({
    bloody: false, reversible: true, garrison: 0.3, strangleGain: WEBWAR_TUNING.STRANGLE_GAIN_PER_STAGE * 0.8,
    evilFit: 0.5, lawfulFit: 0.6, merchantFit: 0.4, militaryFit: 0.7,
    headline: 'a route interdiction',
  }),
  // EMBARGO — strangle by trade denial, zero bloodshed, slower, reversible. The
  // merchant archetype's version.
  embargo: Object.freeze({
    bloody: false, reversible: true, garrison: 0, strangleGain: WEBWAR_TUNING.STRANGLE_GAIN_PER_STAGE * 0.7,
    evilFit: 0.4, lawfulFit: 0.8, merchantFit: 0.9, militaryFit: 0.3,
    headline: 'a trade embargo',
  }),
  // TOLL WAR — punitive tolls on the target's trade arteries; bloodless, reversible.
  toll_war: Object.freeze({
    bloody: false, reversible: true, garrison: 0, strangleGain: WEBWAR_TUNING.STRANGLE_GAIN_PER_STAGE * 0.55,
    evilFit: 0.5, lawfulFit: 0.7, merchantFit: 0.85, militaryFit: 0.3,
    headline: 'a toll war',
  }),
  // PURCHASE DENIAL — outbid the target for its own suppliers' output; economic
  // warfare priced in coin. The wealthy / evil-lean quiet weapon.
  purchase_denial: Object.freeze({
    bloody: false, reversible: true, garrison: 0, strangleGain: WEBWAR_TUNING.STRANGLE_GAIN_PER_STAGE * 0.6,
    evilFit: 0.7, lawfulFit: 0.55, merchantFit: 0.85, militaryFit: 0.4,
    headline: 'a purchase-denial squeeze',
  }),
});

/** The instrument keys, codepoint-sorted once (canonical draw order — §H). */
const INSTRUMENT_KEYS = Object.freeze(Object.keys(INSTRUMENTS).sort(codepoint));

/** The actor's EXPECTED bloody-instrument share — the fit-weighted fraction of the
 *  instruments it would reach for that are bloody (raid/occupy). A merchant ≈ low
 *  (bloodless levers dominate its fit); a warlord ≈ high. Drives the mint-time
 *  atrocity brake so a merchant mints the bloodless variant freely.
 * @param {{ archetype: string, evilLean01: number, lawfulLean01: number }} actor @returns {number} */
export function expectedBloodyShare(actor) {
  let num = 0;
  let den = 0;
  for (const k of INSTRUMENT_KEYS) {
    const w = instrumentFit(k, actor);
    den += w;
    if (INSTRUMENTS[k].bloody) num += w;
  }
  return den > 0 ? clamp01(num / den) : 0;
}

// ── The gate (fail-closed; the virtual-flag idiom) ───────────────────────────────

/**
 * THE SUPPLY-WEB-WARFARE GATE: warLayerEnabled === true AND the virtual
 * supplyWebWarfareEnabled === true, both explicit booleans off
 * worldState.simulationRules. ABSENT ⇒ false ⇒ DORMANT. supplyWebWarfareEnabled is
 * virtual — no DEFAULT_SIMULATION_RULES entry, so no golden moves; the reader always
 * compares === true (fail-closed on absent/garbage).
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {boolean}
 */
export function supplyWebWarfareActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  if (!rules || typeof rules !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (rules);
  return r.warLayerEnabled === true && r.supplyWebWarfareEnabled === true;
}

/** The stable seed fork key (§8). @param {string} aggressor @param {string} target @param {number} tick @returns {string} */
export function webwarForkKey(aggressor, target, tick) {
  return `webwar:${aggressor}:${target}:${tick}`;
}

// ── §2 THE WEB READ (belief-gated) ────────────────────────────────────────────────

/**
 * @typedef {Object} WebSatellite
 * @property {string} satelliteId  the supplier settlement (a village/thorp)
 * @property {string} input        the good it supplies
 * @property {number} share01      its share of the target's need for that good (1/pathCount)
 * @property {number} cost         the route cost (cheaper = the primary artery)
 * @property {boolean} fragile     the target's web for this good is single/near-single sourced
 * @property {'truth'|'belief'|'unknown'} source  how the aggressor KNOWS this satellite
 * @property {number} confidence01 the aggressor's confidence in this satellite (0 when unknown)
 * @property {boolean} believedOnly TRUE when the aggressor BELIEVES this feeds the target but,
 *   in truth, it does not (the wrong-village candidate — "the grain came by barge")
 */

/**
 * @typedef {Object} SupplyWebRead
 * @property {string} targetId
 * @property {WebSatellite[]} satellites   the aggressor's BELIEVED inbound web of the target,
 *   codepoint-sorted by satelliteId then input
 * @property {number} fragility01          how concentrated the web is (1 = every good single-sourced)
 * @property {number} bufferThinness01     how thin the target's buffers are (1 = no reserve)
 * @property {number} confidence01         the aggressor's AGGREGATE confidence in the read (fog)
 * @property {number} truePathCount        the TRUE number of distinct supplier paths (adaptation floor)
 */

/**
 * Derive the target's inbound dependency web FROM THE AGGRESSOR'S OWN BELIEF MAP,
 * never truth (§2). The ground-truth topology is the M2/M6a supply graph
 * (deriveConsumingLinks + assessSourceRedundancy); each satellite is then fog-gated
 * through belief(aggressor, satellite, worldState). An informed commander sees the
 * real web; a fog-blind one holds a stale/wrong web and can strike the wrong village.
 * Pure — no rng, no state mutation.
 * @param {string} aggressorId @param {string} targetId
 * @param {WebwarSnapshot} snapshot
 * @param {Record<string, unknown>} worldState
 * @param {SpatialDigest | null | undefined} digest  the frozen spatial digest (worldState.spatialDigest)
 * @param {Map<string, string[]>} producers  buildProducerIndex(snapshot)
 * @returns {SupplyWebRead}
 */
export function readSupplyWeb(aggressorId, targetId, snapshot, worldState, digest, producers) {
  /** @type {SupplyWebRead} */
  const empty = { targetId: String(targetId), satellites: [], fragility01: 0, bufferThinness01: 0, confidence01: 0, truePathCount: 0 };
  const targetItem = snapshot?.byId?.get?.(String(targetId));
  const targetSettlement = targetItem && targetItem.settlement;
  if (!targetSettlement || !digest) return empty;

  const links = deriveConsumingLinks(
    /** @type {SupplySettlement} */ (targetSettlement), String(targetId), producers, digest,
  );
  if (!links.length) return empty;

  /** @type {WebSatellite[]} */
  const satellites = [];
  let fragileGoods = 0;
  let bufferSum = 0;
  let truePathCount = 0;
  let confidenceSum = 0;
  let confidenceCount = 0;
  // W-DOCTRINE-2b — SEE PRICES THE WEB READ (§2.1): an active SIGHT posture the aggressor
  // holds on the TARGET sharpens EVERY satellite read (watching the court reveals its
  // suppliers); a posture on a specific satellite sharpens that satellite. 0 when the
  // info-statecraft layer is dormant / no posture ⇒ byte-identical (the web goldens never lit it).
  const targetSight = Math.max(
    sightFidelityOf(worldState, String(aggressorId), String(targetId)),
    assetSightFidelityOf(worldState, snapshot, String(aggressorId), String(targetId)),
  );

  for (const link of links) {
    const redundancy = assessSourceRedundancy(link.rankedSources);
    if (redundancy.fragile) fragileGoods += 1;
    truePathCount += redundancy.pathCount;
    // Buffer thinness: a full BUFFER_WEEKS reserve reads 0; an empty one reads 1.
    const buffer = Number.isFinite(link.bufferWeeks) ? link.bufferWeeks : 0;
    bufferSum += clamp01(1 - buffer / 8);
    const share = link.rankedSources.length > 0 ? 1 / link.rankedSources.length : 0;
    for (const src of link.rankedSources) {
      const satelliteId = String(src.sourceId);
      // FOG-GATE this satellite through the aggressor's belief (§2). Self / omniscient
      // / dormant ⇒ 'truth' (the informed read). A held record ⇒ 'belief' at its
      // confidence. No record ⇒ 'unknown' — the aggressor does not know this supplier.
      const b = belief(String(aggressorId), satelliteId, worldState);
      const source = b.source;
      const rawConfidence = b.source === 'truth' ? 1 : b.source === 'belief' ? clamp01(b.record.confidence01) : 0;
      // Paid eyes sharpen the read toward certainty (SEE prices the web read, §2.1). The
      // sight on THIS satellite or on the target, whichever is stronger. 0 ⇒ byte-identical.
      const sightF = Math.max(targetSight, sightFidelityOf(worldState, String(aggressorId), satelliteId));
      const confidence01 = sightF > 0 ? clamp01(rawConfidence + (1 - rawConfidence) * sightF) : rawConfidence;
      confidenceSum += confidence01;
      confidenceCount += 1;
      satellites.push({
        satelliteId,
        input: String(link.input),
        share01: clamp01(share),
        cost: Number(src.cost) || 0,
        fragile: redundancy.fragile,
        source,
        confidence01,
        believedOnly: false, // truth-derived here; the believed-vs-true divergence is a raid-time check
      });
    }
  }

  satellites.sort((a, b) => codepoint(a.satelliteId, b.satelliteId) || codepoint(a.input, b.input));
  const goods = links.length;
  return {
    targetId: String(targetId),
    satellites,
    fragility01: goods > 0 ? clamp01(fragileGoods / goods) : 0,
    bufferThinness01: goods > 0 ? clamp01(bufferSum / goods) : 0,
    confidence01: confidenceCount > 0 ? clamp01(confidenceSum / confidenceCount) : 0,
    truePathCount,
  };
}

// ── §3 THE STRATEGIC CHOICE (direct vs indirect, time-discounted) ─────────────────

/**
 * @typedef {Object} CampaignEV
 * @property {number} directEV     the existing feasibility/strength EV of a direct assault
 * @property {number} indirectEV   the projected weakened-assault EV MINUS the time discount
 * @property {number} weakenReduction  the effective strength reduction the strangulation buys
 * @property {number} timeDiscount the total time discount charged (§3(a)-(e))
 * @property {number} nStages      the strangulation stages the plan would run
 * @property {string} receipt      the human-voice why-line (the loaded dice narrated — §H)
 */

/**
 * Score the DIRECT-vs-INDIRECT choice for aggressor→target (§3), time-discounted.
 * The EV gate IS the chooser: WHO chooses indirect emerges — a weaker force's
 * directEV is terrible, so a fragile web makes indirectEV win; a bold strong actor's
 * directEV already dominates. Pure — no rng.
 * @param {{ believedSelf: number, believedTarget: number, web: SupplyWebRead,
 *   atrocityBrake01: number }} args
 * @returns {CampaignEV}
 */
export function scoreCampaignEV({ believedSelf, believedTarget, web, atrocityBrake01 }) {
  const T = WEBWAR_TUNING;
  const margin = clamp01(believedSelf) - clamp01(believedTarget);
  // DIRECT EV — the even-bet-at-parity feasibility read (unchanged war math shape).
  const directEV = clamp01(0.5 + margin * T.DIRECT_MARGIN_GAIN);

  // The strangulation the plan can buy: bounded by the web's fragility AND the
  // aggressor's KNOWLEDGE (a fog-blind read cannot reliably strangle — it strikes
  // the wrong villages). §3.
  const nStages = Math.min(T.STAGE_CAP, web.satellites.filter((s) => s.fragile).length || Math.min(2, web.satellites.length));
  const weakenReduction = clamp01(
    T.STRANGLE_MAX_REDUCTION * web.fragility01 * web.confidence01 * clamp01(0.5 + 0.5 * web.bufferThinness01),
  );
  const projectedTarget = clamp01(believedTarget * (1 - weakenReduction));
  const projectedMargin = clamp01(believedSelf) - projectedTarget;
  const projectedAssaultEV = clamp01(0.5 + projectedMargin * T.DIRECT_MARGIN_GAIN);

  // THE TIME DISCOUNT (§3): own drain over N ticks (a), T's adaptation risk — a
  // redundant web re-sources faster (b), counterplay growth the longer it runs (c),
  // and the atrocity brake (§7 — bloody stages cost alignment + reputation).
  const redundantPaths = Math.max(0, web.truePathCount - web.satellites.filter((s) => s.fragile).length);
  const drain = T.DRAIN_PER_TICK * nStages;
  const adaptation = T.ADAPTATION_RISK_PER_PATH * redundantPaths;
  const counterplay = T.COUNTERPLAY_PER_STAGE * nStages;
  const timeDiscount = clamp01(drain + adaptation + counterplay + clamp01(atrocityBrake01));

  const indirectEV = clamp01(projectedAssaultEV - timeDiscount);
  const receipt = margin < 0
    ? `A direct assault is a losing bet (margin ${margin.toFixed(2)}); the target's web is ${(web.fragility01 * 100).toFixed(0)}% single-sourced — strangle first (indirect ${indirectEV.toFixed(2)} vs direct ${directEV.toFixed(2)}).`
    : `The target can be taken directly (margin ${margin.toFixed(2)}); the slow strangulation is not worth the ${timeDiscount.toFixed(2)} time cost (indirect ${indirectEV.toFixed(2)} vs direct ${directEV.toFixed(2)}).`;
  return { directEV, indirectEV, weakenReduction, timeDiscount, nStages, receipt };
}

/**
 * The projected atrocity brake (§7) for striking a target's web: the alignment +
 * reputation cost a BLOODY campaign would incur, scaled by the aggressor's professed
 * creed (lawful-good prices it highest) and the average victim innocence. This is the
 * EV brake that makes razing the villages usually wrong. Pure.
 * @param {{ actorLawfulness01: number, actorMalice01: number, avgVictimInnocence01: number,
 *   bloodyShare01: number }} args
 * @returns {number} 0..1
 */
export function atrocityBrakeFor({ actorLawfulness01, actorMalice01, avgVictimInnocence01, bloodyShare01 }) {
  const lawfulGoodness = clamp01(actorLawfulness01) * (1 - clamp01(actorMalice01));
  return clamp01(
    WEBWAR_TUNING.ATROCITY_BRAKE_GAIN
    * clamp01(bloodyShare01)
    * (0.35 + 0.65 * lawfulGoodness)
    * (0.4 + 0.6 * clamp01(avgVictimInnocence01)),
  );
}

// ── §4 INSTRUMENT SELECTION (alignment/archetype-flavored) ────────────────────────

/**
 * The fit weight of an instrument for an aggressor of the given archetype + alignment
 * lean (§4). A merchant reaches for embargo/toll/purchase-denial; a warlord for
 * raid/occupy; an evil-lean actor tolerates the bloody instruments a lawful one won't.
 * The weights ARE the receipts (§H) — a flat draw among differentiated instruments
 * would be a design bug, so the fit is always state-differentiated.
 * @param {string} instrumentKey @param {{ archetype: string, evilLean01: number, lawfulLean01: number }} actor
 * @returns {number}
 */
export function instrumentFit(instrumentKey, { archetype, evilLean01, lawfulLean01 }) {
  const inst = INSTRUMENTS[instrumentKey];
  if (!inst) return 0;
  const arche = archetype === 'merchant' ? inst.merchantFit
    : archetype === 'military' ? inst.militaryFit
      : (inst.merchantFit + inst.militaryFit) / 2;
  const align = clamp01(evilLean01) * inst.evilFit + clamp01(lawfulLean01) * inst.lawfulFit
    + (1 - clamp01(evilLean01) - clamp01(lawfulLean01)) * 0.5 * (inst.evilFit + inst.lawfulFit);
  return clamp01(0.5 * arche + 0.5 * clamp01(align));
}

/**
 * Choose ONE instrument for a stage via a state-weighted loaded draw (§H): the fit
 * weights come first from the actor's archetype + alignment (the world has already
 * made some instruments probable); the seeded fork only picks among them.
 * @param {RngLike} rng @param {string} forkKey
 * @param {{ archetype: string, evilLean01: number, lawfulLean01: number }} actor
 * @returns {string}
 */
function chooseInstrument(rng, forkKey, actor) {
  const weights = INSTRUMENT_KEYS.map((k) => instrumentFit(k, actor));
  if (rng && typeof rng.fork === 'function') {
    const idx = stableSampleByWeight(weights, rng.fork(forkKey));
    if (idx >= 0 && idx < INSTRUMENT_KEYS.length) return INSTRUMENT_KEYS[idx];
  }
  // No rng (test stubs): the canonical argmax (fit-desc, key-codepoint tiebreak).
  let best = -Infinity;
  let bestKey = INSTRUMENT_KEYS[0];
  for (let i = 0; i < INSTRUMENT_KEYS.length; i += 1) {
    if (weights[i] > best) { best = weights[i]; bestKey = INSTRUMENT_KEYS[i]; }
  }
  return bestKey;
}

// ── §5 THE PEACE-REASON FEED (economic_strangulation) ─────────────────────────────

/**
 * The strangulation intensity the target FEELS from every live campaign plan striking
 * its web (§5). Derived PURELY from the campaignPlans ledger — the sum of active-stage
 * strangleGain across plans targeting `targetId`, clamped. Consumed by
 * advancePeaceReasons' economic_strangulation scorer (a strangled town sues for early
 * terms). ABSENT ledger / gate dark ⇒ 0 ⇒ the peace reason is byte-identical.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} targetId
 * @returns {number} 0..1
 */
export function strangulationFelt01(worldState, targetId) {
  if (!supplyWebWarfareActive(worldState)) return 0;
  const ledger = /** @type {Record<string, CampaignPlan> | null} */ (getSpatialLedger(worldState, 'campaignPlans'));
  if (!ledger) return 0;
  const tid = String(targetId);
  let felt = 0;
  for (const aggressorId of Object.keys(ledger).sort(codepoint)) {
    const plan = ledger[aggressorId];
    if (!plan || String(plan.targetId) !== tid) continue;
    felt += clamp01(Number(plan.strangle01) || 0);
  }
  return clamp01(felt);
}

// ── §6 THE CAMPAIGN PLAN + the mover ──────────────────────────────────────────────

/**
 * @typedef {Object} CampaignStage
 * @property {string} mode        the instrument key
 * @property {string} satelliteId the satellite this stage strikes
 * @property {string} input       the good it severs
 * @property {'pending'|'done'} status
 */

/**
 * @typedef {Object} CampaignPlan
 * @property {string} targetId
 * @property {CampaignStage[]} stages
 * @property {number} mintedTick
 * @property {number} lastScoredTick
 * @property {number} ev01          the at-mint indirect EV
 * @property {number} mintFragility01  the target's web fragility at mint (the adaptation baseline)
 * @property {number} strangle01    the current strangulation this plan applies to the target
 */

/**
 * @typedef {Object} SupplyWebAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<{ actorId: string, victimId: string, trueRelationship: string, believedOnly: boolean }>} atrocities
 *   this tick's raid atrocities — the pulseKernel moral-drift site enriches them into
 *   MoralDriftDeltaInput and folds them into its SINGLE advanceMoralDrift call (no
 *   double-decay). Empty ⇒ byte-neutral.
 */

/** The aggressor's believed hostile targets, codepoint-sorted (belief-gated — the
 *  observer targets what it BELIEVES hostile, possibly a stale hostility). Mirrors
 *  settlementStrategy.contextFor's hostile-target read.
 * @param {WebwarSnapshot} snapshot @param {string} aggressorId @param {Record<string, unknown>} worldState @returns {string[]} */
function believedHostileTargets(snapshot, aggressorId, worldState) {
  const states = /** @type {Record<string, unknown>} */ (
    (snapshot?.worldState?.relationshipStates) || worldState?.relationshipStates || {});
  const id = String(aggressorId);
  /** @type {Set<string>} */
  const targets = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, /** @type {Record<string, unknown>} */ (states[relationshipKeyFromEdge(rawEdge)]));
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;
    const perceived = readBeliefRelationship(id, other, worldState, relState.relationshipType);
    if (HOSTILE_TYPES.has(perceived)) targets.add(other);
  }
  return [...targets].sort(codepoint);
}

/** The GROUND-TRUTH relationship label between two settlements ('neutral' when no
 *  edge), for the atrocity's former-friend read + the wrong-village divergence.
 * @param {WebwarSnapshot} snapshot @param {string} a @param {string} b @returns {string} */
function trueRelationshipType(snapshot, a, b) {
  const states = /** @type {Record<string, unknown>} */ ((snapshot?.worldState?.relationshipStates) || {});
  for (const rawEdge of snapshot?.regionalGraph?.edges || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const s = getRelationshipSettlements(edge);
    const paired = (String(s.from) === String(a) && String(s.to) === String(b))
      || (String(s.from) === String(b) && String(s.to) === String(a));
    if (!paired) continue;
    const relState = ensureRelationshipState(edge, /** @type {Record<string, unknown>} */ (states[relationshipKeyFromEdge(rawEdge)]));
    return relState.relationshipType;
  }
  return 'neutral';
}

/**
 * Advance the supply-web-warfare layer one tick (§6): re-score live plans and abandon
 * the stalling ones; mint a new plan for an aggressor whose indirect EV beats direct;
 * advance one stage per live plan (applying its strangulation + queuing raid
 * atrocities). Gate dark ⇒ an IMMEDIATE no-op (zero forks, zero keys). Codepoint-sorted
 * throughout; seeded forks `webwar:${aggressor}:${target}:${tick}`; drop-when-empty.
 *
 * The relationship/war reads route through `snapshot.regionalGraph`; no separate graph
 * argument is taken (the sibling-mover `graph` param would be redundant here).
 * @param {{ snapshot: WebwarSnapshot,
 *           worldState: Record<string, unknown>,
 *           pIndex?: PressureIndex,
 *           digest?: SpatialDigest | null,
 *           rng?: RngLike,
 *           tick: number,
 *           nameFor?: (id: string) => string }} args
 * @returns {SupplyWebAdvanceResult}
 */
export function advanceSupplyWebWarfare({ snapshot, worldState, pIndex = null, digest, rng = null, tick, nameFor }) {
  // ── DORMANCY GATE (§8): absent ⇒ an immediate no-op. No fork, no key. ──
  if (!supplyWebWarfareActive(worldState)) {
    return { worldState, changed: false, newsEntries: [], atrocities: [] };
  }

  const now = Math.max(0, Math.floor(Number.isFinite(tick) ? Number(tick) : 0));
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const useDigest = digest ?? /** @type {SpatialDigest} */ (worldState.spatialDigest);
  const producers = buildProducerIndex(/** @type {import('./supplyKernel.js').SupplySnapshot} */ (snapshot));

  const prevLedger = /** @type {Record<string, CampaignPlan> | null} */ (getSpatialLedger(worldState, 'campaignPlans'));
  /** @type {Record<string, CampaignPlan>} */
  const nextLedger = {};
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {SupplyWebAdvanceResult['atrocities']} */
  const atrocities = [];

  // The believed-strength lookup for the aggressor's read (self ⇒ truth; else banded
  // belief — an over-confident misjudgment marches, a misinformed one holds).
  /** @type {Map<string, number>} */
  const truthCache = new Map();
  const truthStrength = (/** @type {string} */ id) => {
    if (truthCache.has(id)) return /** @type {number} */ (truthCache.get(id));
    const item = snapshot?.byId?.get?.(id);
    const s = item ? settlementStrength(item, buildPressureSummary(pIndex, id)) : 0;
    truthCache.set(id, s);
    return s;
  };
  const believedStrength = (/** @type {string} */ observer, /** @type {string} */ subject) =>
    readBeliefStrength(observer, subject, worldState, truthStrength(subject));

  // The candidate aggressors: every mapped settlement (codepoint-sorted), plus any
  // that already hold a plan (so a plan survives even if its aggressor left the roster).
  const aggressorIds = [...new Set([
    ...(snapshot?.settlements || []).map((s) => String(s.id)),
    ...Object.keys(prevLedger || {}),
  ])].sort(codepoint);

  for (const aggressorId of aggressorIds) {
    const prevPlan = prevLedger?.[aggressorId] || null;

    if (prevPlan) {
      // ── RE-SCORE a live plan (plans are hypotheses, not rails) ──
      const targetId = String(prevPlan.targetId);
      const web = readSupplyWeb(aggressorId, targetId, snapshot, worldState, useDigest, producers);
      const sSelf = believedStrength(aggressorId, aggressorId);
      const sTarget = believedStrength(aggressorId, targetId);
      // The re-score omits the atrocity brake (the mint gate already priced it — the
      // committed campaign is not re-litigated for its bloodiness each tick).
      const ev = scoreCampaignEV({ believedSelf: sSelf, believedTarget: sTarget, web, atrocityBrake01: 0 });

      // ADAPTATION (§3(b)): the target's web has RECOVERED (M2 failover re-sourced) when
      // its fragility has fallen well below the at-mint fragility — the strangulation
      // could not outpace re-sourcing. Abandon (receipted: "the river barges could not
      // be stopped"). Also abandon on a bare EV collapse.
      const adapted = prevPlan.mintFragility01 > 0
        && web.fragility01 <= prevPlan.mintFragility01 * WEBWAR_TUNING.ABANDON_ADAPTATION_RATIO;
      // W-MOMENTUM §3.3: a COMMITTED strangler holds a marginal campaign LONGER — the
      // aggressor's commitment stock on this campaign course LOWERS the EV floor it abandons
      // at (abandonFloorScale ≥ 1 ⇒ a lower effective floor ⇒ tolerates a weaker squeeze).
      // EXACTLY 1 when momentum is dormant / uncommitted ⇒ the floor is unchanged ⇒
      // byte-identical (the supplyWebWarfare dormancy golden holds). Adaptation (the web
      // re-sourced) still abandons regardless — commitment cannot un-lose a lost squeeze.
      const abandonScale = abandonFloorScale(worldState, aggressorId, targetId, now);
      const collapsed = ev.indirectEV < WEBWAR_TUNING.ABANDON_EV_FLOOR / abandonScale;
      if (adapted || collapsed) {
        newsEntries.push(abandonNews(aggressorId, targetId, name, adapted, now));
        continue; // drop the plan (do not carry to nextLedger)
      }

      // ADVANCE one stage (§6 consumed stage-by-stage). The first pending stage fires.
      const stages = prevPlan.stages.map((s) => ({ ...s }));
      const pendingIdx = stages.findIndex((s) => s.status === 'pending');
      if (pendingIdx === -1) {
        // All stages done — the target is weakened; the plan's purpose is served. Drop
        // it (the siege is now the war layer's job) with a completion receipt.
        newsEntries.push(completeNews(aggressorId, targetId, name, prevPlan, now));
        continue;
      }
      const stage = stages[pendingIdx];
      stage.status = 'done';
      const inst = INSTRUMENTS[stage.mode];
      // The strangulation this plan now applies = sum of DONE stages' strangleGain.
      const strangle01 = clamp01(stages.filter((s) => s.status === 'done')
        .reduce((sum, s) => sum + (INSTRUMENTS[s.mode]?.strangleGain || 0), 0));

      // A BLOODY stage (raid/occupy) queues an atrocity + a reputation news beat (§7).
      if (inst?.bloody) {
        const trueRel = trueRelationshipType(snapshot, aggressorId, stage.satelliteId);
        // WRONG-VILLAGE (§2 misjudgment): the aggressor struck a satellite it BELIEVES
        // feeds the target, but the true web does not carry it (the grain came by barge).
        const believedOnly = !web.satellites.some((s) => s.satelliteId === stage.satelliteId);
        atrocities.push({ actorId: aggressorId, victimId: stage.satelliteId, trueRelationship: trueRel, believedOnly });
        newsEntries.push(raidNews(aggressorId, targetId, stage, name, believedOnly, web.confidence01, now));
      }

      nextLedger[aggressorId] = {
        targetId,
        stages,
        mintedTick: prevPlan.mintedTick,
        lastScoredTick: now,
        ev01: round4(ev.indirectEV),
        mintFragility01: prevPlan.mintFragility01,
        strangle01: round4(strangle01),
      };
      continue;
    }

    // ── Consider MINTING a new plan (§3 the strategic choice) ──
    // Bounded: one plan per aggressor (already guaranteed — prevPlan was null here).
    const targets = believedHostileTargets(snapshot, aggressorId, worldState);
    if (!targets.length) continue;

    // The actor's archetype + alignment lean (for instrument fit + the atrocity brake).
    const actorItem = snapshot?.byId?.get?.(aggressorId);
    const actor = actorProfileOf(actorItem, worldState);

    // Score every believed target; the strongest indirect case (that also beats direct)
    // wins. Codepoint-stable: iterate sorted targets, keep the first strict max.
    /** @type {{ targetId: string, web: SupplyWebRead, ev: CampaignEV } | null} */
    let bestCase = null;
    for (const targetId of targets) {
      const web = readSupplyWeb(aggressorId, targetId, snapshot, worldState, useDigest, producers);
      if (!web.satellites.length) continue;
      const sSelf = believedStrength(aggressorId, aggressorId);
      const sTarget = believedStrength(aggressorId, targetId);
      // The atrocity brake prices the bloodiest plan the actor might run (§7). Use the
      // average innocence of the fragile satellites as the victim-innocence proxy.
      const avgInnocence = averageVictimInnocence(web, snapshot, pIndex, worldState);
      const brake = atrocityBrakeFor({
        actorLawfulness01: actor.lawfulness01, actorMalice01: actor.malice01,
        // The brake reflects the actor's EXPECTED instrument mix (§4/§7): a merchant
        // leans bloodless (embargo/toll/purchase-denial) ⇒ a small brake, so it readily
        // mints the bloodless variant; a warlord leans raid/occupy ⇒ a large brake, so
        // razing the villages must clear a real payoff.
        avgVictimInnocence01: avgInnocence, bloodyShare01: expectedBloodyShare(actor),
      });
      const ev = scoreCampaignEV({ believedSelf: sSelf, believedTarget: sTarget, web, atrocityBrake01: brake });
      if (!bestCase || ev.indirectEV > bestCase.ev.indirectEV) bestCase = { targetId, web, ev };
    }
    if (!bestCase) continue;

    // THE MINT GATE (§3): the indirect path must beat the direct one by a real margin
    // AND clear the floor. A bold strong aggressor (directEV ≥ indirectEV) never mints
    // — it just attacks. This is WHO chooses indirect, mechanically.
    const { targetId, web, ev } = bestCase;
    if (ev.indirectEV < WEBWAR_TUNING.MINT_EV_FLOOR) continue;
    if (ev.indirectEV < ev.directEV + WEBWAR_TUNING.MINT_EV_MARGIN) continue;

    // Sequence the stages: strike the most FRAGILE, highest-share satellites first,
    // instruments chosen by archetype+alignment via the loaded draw (§4/§H). Bounded
    // to STAGE_CAP; one stage per distinct satellite.
    const stages = sequenceStages(rng, aggressorId, targetId, web, actor, now);
    if (!stages.length) continue;

    nextLedger[aggressorId] = {
      targetId,
      stages,
      mintedTick: now,
      lastScoredTick: now,
      ev01: round4(ev.indirectEV),
      mintFragility01: round4(web.fragility01),
      strangle01: 0,
    };
    newsEntries.push(mintNews(aggressorId, targetId, name, ev, stages, now));
  }

  // Persist only on real change (serialize-compare; drop-when-empty).
  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? sortLedger(nextLedger) : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false, newsEntries: [], atrocities };
  }
  const nextWorldState = hasNext
    ? setSpatialLedger(worldState, 'campaignPlans', sortLedger(nextLedger))
    : dropSpatialLedger(worldState, 'campaignPlans');
  return { worldState: nextWorldState, changed: true, newsEntries, atrocities };
}

// ── Internal helpers ──────────────────────────────────────────────────────────────

/** @param {number} n @returns {number} */
function round4(n) { return Math.round((Number(n) || 0) * 10000) / 10000; }

/** Codepoint-stable ledger ordering (the serialization discipline). @param {Record<string, CampaignPlan>} ledger @returns {Record<string, CampaignPlan>} */
function sortLedger(ledger) {
  /** @type {Record<string, CampaignPlan>} */
  const out = {};
  for (const k of Object.keys(ledger).sort(codepoint)) out[k] = ledger[k];
  return out;
}

/** The actor's governing archetype + alignment lean (0..1 each), read through the SAME
 *  reads the settlement chooser uses — governingCoalition (the seat archetype) and the
 *  derived computeMalice/computeLawfulness (which already fold any moral drift). A
 *  shapeless / deity-free actor reads neutral (archetype '', 0.5 leans).
 * @param {WebwarItem | null | undefined} item @param {Record<string, unknown>} worldState
 * @returns {{ archetype: string, evilLean01: number, lawfulLean01: number, malice01: number, lawfulness01: number }} */
function actorProfileOf(item, worldState) {
  if (!item) return { archetype: '', evilLean01: 0.5, lawfulLean01: 0.5, malice01: 0.5, lawfulness01: 0.5 };
  const archetype = String(governingCoalition(item).governing || '');
  const malice01 = clamp01(computeMalice(item, worldState));
  const lawfulness01 = clamp01(computeLawfulness(item, worldState));
  return { archetype, evilLean01: malice01, lawfulLean01: lawfulness01, malice01, lawfulness01 };
}

/** The average victim innocence across a web's fragile satellites (saintliness ×
 *  weakness — the moralDrift victim-innocence weighting), for the atrocity brake.
 * @param {SupplyWebRead} web @param {WebwarSnapshot} snapshot @param {PressureIndex} pIndex
 * @param {Record<string, unknown>} worldState @returns {number} */
function averageVictimInnocence(web, snapshot, pIndex, worldState) {
  const fragile = web.satellites.filter((s) => s.fragile);
  const pool = fragile.length ? fragile : web.satellites;
  if (!pool.length) return 0.5;
  let sum = 0;
  for (const s of pool) {
    const item = snapshot?.byId?.get?.(s.satelliteId);
    const malice = item ? clamp01(computeMalice(item, worldState)) : 0.2;
    const strength = item ? clamp01(settlementStrength(item, buildPressureSummary(pIndex, s.satelliteId))) : 0.2;
    sum += (1 - malice) * (1 - strength);
  }
  return clamp01(sum / pool.length);
}

/** Sequence a plan's stages: the most fragile, highest-share, cheapest-route satellites
 *  first (one stage per distinct satellite), each with an instrument chosen by the
 *  loaded draw. Bounded to STAGE_CAP.
 * @param {RngLike} rng @param {string} aggressorId @param {string} targetId @param {SupplyWebRead} web
 * @param {{ archetype: string, evilLean01: number, lawfulLean01: number }} actor @param {number} tick
 * @returns {CampaignStage[]} */
function sequenceStages(rng, aggressorId, targetId, web, actor, tick) {
  // Rank satellites: fragile first, then higher share, then cheaper route, then key.
  const ranked = [...web.satellites].sort((a, b) =>
    (Number(b.fragile) - Number(a.fragile))
    || (b.share01 - a.share01)
    || (a.cost - b.cost)
    || codepoint(a.satelliteId, b.satelliteId)
    || codepoint(a.input, b.input));
  /** @type {CampaignStage[]} */
  const stages = [];
  const usedSatellites = new Set();
  for (const s of ranked) {
    if (stages.length >= WEBWAR_TUNING.STAGE_CAP) break;
    if (usedSatellites.has(s.satelliteId)) continue;
    usedSatellites.add(s.satelliteId);
    const mode = chooseInstrument(rng, `${webwarForkKey(aggressorId, targetId, tick)}:instr:${s.satelliteId}`, actor);
    stages.push({ mode, satelliteId: s.satelliteId, input: s.input, status: 'pending' });
  }
  return stages;
}

// ── Receipt / news builders (house voice — the loaded dice narrated) ──────────────
//
// THE FEED'S ADMISSION KEY. All four builders below went WITHOUT an `id` until
// 2026-07-31, and an id-less receipt is DROPPED twice over: normalizeEntry returns null
// on `!entry?.id` (wizardNews.js:475) and appendObservedWizardNewsEntries pushes only
// id-carrying entries into the audit sink (wizardNews.js:744). So this doctrine's whole
// narrative output was discarded before it reached any reader, the Herald, or a soak
// receipt, even on the ticks it fired. House convention (generosityNews.js:28,
// upswingKernel.js:926): `wizard_news.<tick>.<slug>.<stableParts>`, normalized through
// stablePart so the id stays inside the dotted-id alphabet whatever characters the
// underlying save id happens to carry. On today's ids that normalization is INJECTIVE
// (save ids are crypto.randomUUID hex-and-dash, and `-`>`_` is a bijection there), so it
// cannot alias two settlements into one id and merge their beats.
//
// COLLISION-FREE PER TICK, which matters because appendWizardNewsEntries dedupes by id
// through a Map and would SILENTLY MERGE two beats sharing one. advanceSupplyWebWarfare
// walks a DEDUPED, codepoint-sorted aggressorIds list once, and every arm that emits
// either `continue`s or falls out of the iteration, so an aggressor authors AT MOST ONE
// receipt per tick; it also holds at most one plan, hence one targetId. So
// (kind, aggressor, target) is already unique. The raid id carries the satellite as well
// because the beat is ABOUT that village, and that keeps the id honest if the stage loop
// is ever widened to fire more than one stage per tick.

/** @param {string} aggressorId @param {string} targetId @param {(id:string)=>string} name @param {CampaignEV} ev @param {CampaignStage[]} stages @param {number} tick */
function mintNews(aggressorId, targetId, name, ev, stages, tick) {
  const A = name(aggressorId);
  const Tn = name(targetId);
  const modes = [...new Set(stages.map((s) => INSTRUMENTS[s.mode]?.headline || s.mode))];
  return {
    id: `wizard_news.${tick}.webwar_campaign_minted.${stablePart(aggressorId)}.${stablePart(targetId)}`,
    kind: 'webwar_campaign_minted',
    headline: `${A} opens an indirect campaign against ${Tn}`,
    summary: `${A} cannot (or will not) take ${Tn} head-on. It plans to strangle ${Tn}'s supply web first — ${modes.join(', ')} — before the reckoning.`,
    reasons: [
      ev.receipt,
      `The plan sequences ${stages.length} stage${stages.length === 1 ? '' : 's'} against ${Tn}'s suppliers (indirect EV ${ev.indirectEV.toFixed(2)} vs direct ${ev.directEV.toFixed(2)}).`,
    ],
    settlementIds: [String(aggressorId), String(targetId)],
    significance: 'notable',
    // Material weight for the reader-facing meters (absent severity clamps to 0 and
    // renders "Severity 0%"; register per the upswing exemplars): a minted plan is a
    // threat declared, not yet a wound.
    severity: 0.45,
    score: 62,
    tick,
  };
}

/** @param {string} aggressorId @param {string} targetId @param {CampaignStage} stage @param {(id:string)=>string} name @param {boolean} wrongVillage @param {number} confidence01 @param {number} tick */
function raidNews(aggressorId, targetId, stage, name, wrongVillage, confidence01, tick) {
  const A = name(aggressorId);
  const V = name(stage.satelliteId);
  const Tn = name(targetId);
  // Hoisted so the id and the kind cannot drift apart (npcGrowthKernel.js:704 idiom).
  const kind = wrongVillage ? 'webwar_wrong_village' : 'webwar_raid';
  const reasons = [
    `${A} struck ${V} to sever ${Tn}'s supply of ${stage.input}.`,
  ];
  if (wrongVillage) {
    reasons.push(`But ${V} no longer fed ${Tn} — the ${stage.input} had come by another road. ${A} burned the wrong village (read confidence ${confidence01.toFixed(2)}) — a misjudgment.`);
  }
  return {
    id: `wizard_news.${tick}.${kind}.${stablePart(aggressorId)}.${stablePart(stage.satelliteId)}.${stablePart(targetId)}`,
    kind,
    headline: wrongVillage ? `${A} burns the wrong village` : `${A} raids ${V}`,
    summary: wrongVillage
      ? `${A} put ${V} to the torch believing it fed ${Tn} — but the ${stage.input} had come by another road for seasons. The atrocity bought nothing.`
      : `${A}'s raiders put ${V}'s stores to the torch to sever ${Tn}'s supply of ${stage.input}. The villagers scatter; the town's web thins.`,
    reasons,
    settlementIds: [String(aggressorId), String(stage.satelliteId), String(targetId)],
    significance: 'major',
    severity: 0.65, // a village burned: the heaviest beat this doctrine mints
    score: 70,
    tick,
  };
}

/** @param {string} aggressorId @param {string} targetId @param {(id:string)=>string} name @param {boolean} adapted @param {number} tick */
function abandonNews(aggressorId, targetId, name, adapted, tick) {
  const A = name(aggressorId);
  const Tn = name(targetId);
  return {
    id: `wizard_news.${tick}.webwar_campaign_abandoned.${stablePart(aggressorId)}.${stablePart(targetId)}`,
    kind: 'webwar_campaign_abandoned',
    headline: `${A} abandons its strangulation of ${Tn}`,
    summary: adapted
      ? `The strangulation of ${Tn} was abandoned; the river barges could not be stopped — ${Tn} re-sourced faster than ${A} could sever.`
      : `${A} calls off its indirect campaign against ${Tn} — the slow squeeze was no longer worth its cost.`,
    reasons: [
      adapted
        ? `${Tn}'s supply web re-sourced (M2 failover) faster than the strangulation could outpace it — the campaign stalled.`
        : `The re-scored campaign EV fell below the abandonment floor; ${A} does not grind a losing squeeze.`,
    ],
    settlementIds: [String(aggressorId), String(targetId)],
    significance: 'notable',
    severity: 0.4, // a squeeze released, not a wound dealt
    score: 60,
    tick,
  };
}

/** @param {string} aggressorId @param {string} targetId @param {(id:string)=>string} name @param {CampaignPlan} plan @param {number} tick */
function completeNews(aggressorId, targetId, name, plan, tick) {
  const A = name(aggressorId);
  const Tn = name(targetId);
  return {
    id: `wizard_news.${tick}.webwar_campaign_complete.${stablePart(aggressorId)}.${stablePart(targetId)}`,
    kind: 'webwar_campaign_complete',
    headline: `${A} completes its strangulation of ${Tn}`,
    summary: `${A} has struck ${plan.stages.length} of ${Tn}'s suppliers. ${Tn}'s web is thinned and its buffers bled — the town is ripe for the reckoning.`,
    reasons: [
      `The campaign ran its ${plan.stages.length} stage${plan.stages.length === 1 ? '' : 's'}; ${Tn} now feels the strangulation (${(plan.strangle01 * 100).toFixed(0)}%).`,
    ],
    settlementIds: [String(aggressorId), String(targetId)],
    significance: 'notable',
    severity: 0.5, // the target's web is thinned and bled: material, short of a razing
    score: 62,
    tick,
  };
}

// ── §4 THE FORCEABLE VERBS (the counterpart criterion) ────────────────────────────
//
// Two PURE, GATED worldState mutations — the DM-authored twins of the autonomous
// mover, wrapping the SAME gate (supplyWebWarfareActive). Under the same posture as
// warReasons.declareCasus / peaceReasons.sueForPeaceOrder. REGISTERED
// (W-COMPOSER-2): realmManifest.js ORDER_SUPPLY_RAID / DECLARE_TRADE_EMBARGO
// wrap these fns verbatim (the veto codes are their coversVetoCodes;
// WEBWAR_VETO_PROSE the prose feed); the realm arm applies them. Preview ≡
// apply by construction — the functions are pure and deterministic.

/** The DM-facing refusal prose per veto code (W-COMPOSER-2's VETO_PROSE feed). */
export const WEBWAR_VETO_PROSE = Object.freeze({
  webwar_gate_dark: 'Supply-web warfare is not active in this campaign. Pick the Dramatic Campaign or Full Simulation preset, or light War and “Supply-line war” under Simulation rules → Engine waves.',
  webwar_self: 'A court cannot open a supply-war campaign against itself.',
  webwar_no_web: 'That target has no readable supply web to strangle (no reachable outside suppliers).',
  webwar_plan_exists: 'That court already runs a live indirect campaign; one plan per aggressor.',
});

/**
 * ORDER_SUPPLY_RAID: mint a campaign plan against a target by decree (the DM forcing
 * the autonomous mover's decision). Bounded exactly as the mover: one live plan per
 * aggressor, stages ≤ STAGE_CAP. Pure: same input ⇒ same output (preview ≡ apply).
 * @param {Record<string, unknown>} worldState
 * @param {{ aggressorId: unknown, targetId: unknown, snapshot: WebwarSnapshot, digest?: SpatialDigest | null, tick?: number }} args
 * @returns {{ ok: true, worldState: Record<string, unknown> }
 *         | { ok: false, code: keyof typeof WEBWAR_VETO_PROSE, detail: string }}
 */
export function orderSupplyRaid(worldState, { aggressorId, targetId, snapshot, digest, tick = 0 }) {
  if (!supplyWebWarfareActive(worldState)) {
    return { ok: false, code: 'webwar_gate_dark', detail: 'supply-web gate absent' };
  }
  const a = String(aggressorId);
  const t = String(targetId);
  if (a === t) return { ok: false, code: 'webwar_self', detail: a };
  const ledger = /** @type {Record<string, CampaignPlan> | null} */ (getSpatialLedger(worldState, 'campaignPlans'));
  if (ledger && ledger[a]) return { ok: false, code: 'webwar_plan_exists', detail: a };
  const producers = buildProducerIndex(/** @type {import('./supplyKernel.js').SupplySnapshot} */ (snapshot));
  const web = readSupplyWeb(a, t, snapshot, worldState, digest ?? /** @type {SpatialDigest} */ (worldState.spatialDigest), producers);
  if (!web.satellites.length) return { ok: false, code: 'webwar_no_web', detail: t };
  const actor = actorProfileOf(snapshot?.byId?.get?.(a), worldState);
  const now = Math.max(0, Math.floor(Number.isFinite(tick) ? Number(tick) : 0));
  const stages = sequenceStages(null, a, t, web, actor, now); // null rng ⇒ canonical instruments
  if (!stages.length) return { ok: false, code: 'webwar_no_web', detail: t };
  /** @type {CampaignPlan} */
  const plan = { targetId: t, stages, mintedTick: now, lastScoredTick: now, ev01: 0, mintFragility01: round4(web.fragility01), strangle01: 0 };
  return { ok: true, worldState: setSpatialLedger(worldState, 'campaignPlans', sortLedger({ ...(ledger || {}), [a]: plan })) };
}

/**
 * DECLARE_TRADE_EMBARGO: the bloodless twin — force a single-stage embargo campaign
 * against a target (a merchant's decree). Same gates as orderSupplyRaid; the single
 * stage rides the target's cheapest supply artery. Pure (preview ≡ apply).
 * @param {Record<string, unknown>} worldState
 * @param {{ aggressorId: unknown, targetId: unknown, snapshot: WebwarSnapshot, digest?: SpatialDigest | null, tick?: number }} args
 * @returns {{ ok: true, worldState: Record<string, unknown> }
 *         | { ok: false, code: keyof typeof WEBWAR_VETO_PROSE, detail: string }}
 */
export function declareTradeEmbargo(worldState, { aggressorId, targetId, snapshot, digest, tick = 0 }) {
  if (!supplyWebWarfareActive(worldState)) {
    return { ok: false, code: 'webwar_gate_dark', detail: 'supply-web gate absent' };
  }
  const a = String(aggressorId);
  const t = String(targetId);
  if (a === t) return { ok: false, code: 'webwar_self', detail: a };
  const ledger = /** @type {Record<string, CampaignPlan> | null} */ (getSpatialLedger(worldState, 'campaignPlans'));
  if (ledger && ledger[a]) return { ok: false, code: 'webwar_plan_exists', detail: a };
  const producers = buildProducerIndex(/** @type {import('./supplyKernel.js').SupplySnapshot} */ (snapshot));
  const web = readSupplyWeb(a, t, snapshot, worldState, digest ?? /** @type {SpatialDigest} */ (worldState.spatialDigest), producers);
  if (!web.satellites.length) return { ok: false, code: 'webwar_no_web', detail: t };
  // The embargo rides the cheapest (primary-artery) satellite — a bloodless single stage.
  const primary = [...web.satellites].sort((x, y) => (x.cost - y.cost) || codepoint(x.satelliteId, y.satelliteId))[0];
  const now = Math.max(0, Math.floor(Number.isFinite(tick) ? Number(tick) : 0));
  /** @type {CampaignPlan} */
  const plan = {
    targetId: t,
    stages: [{ mode: 'embargo', satelliteId: primary.satelliteId, input: primary.input, status: 'pending' }],
    mintedTick: now, lastScoredTick: now, ev01: 0, mintFragility01: round4(web.fragility01), strangle01: 0,
  };
  return { ok: true, worldState: setSpatialLedger(worldState, 'campaignPlans', sortLedger({ ...(ledger || {}), [a]: plan })) };
}
