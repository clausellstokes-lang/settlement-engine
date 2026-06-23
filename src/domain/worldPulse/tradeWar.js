/**
 * domain/worldPulse/tradeWar.js — the trade-war core.
 *
 * "C's primary trade partner for commodity K" is a CONTESTABLE PRIZE. Incumbent
 * A holds it (derived, never stored — the strongest confirmed supplier channel
 * into C for K); challenger B contests to replace A. The contest math, the
 * incumbency amplifier, the determinism, and the tie-break all live in the
 * shared primitive `contestOverThirdParty`; this module is a thin caller that
 * enumerates contests deterministically and supplies a single blended 0..1
 * `scoreFor` per contender.
 *
 *   scoreFor(X) = supplyCompleteness(X,K) × economicStrength(X) × standing(X↔C)
 *
 * A flip re-points C's primary trade_dependency channel to the winner, stamps a
 * trade-realignment condition, and (confidence-gated) either WINDS the defeated
 * incumbent DOWN (a peaceful cold_war on A↔B) or lets A ESCALATE — A emits a
 * hostility/war_front the war layer picks up next tick (conquest path stays
 * open, never automatic).
 *
 * HARD OVERRIDE — vassalage: if C is a vassal of X and the overlord compels the
 * trade, X wins regardless of the roll. The forced commitment is ROUTED THROUGH
 * the coerced vassal's economy: a `vassal_trade_coercion` strain condition is
 * stamped on C so the existing `vassal_rebellion` escape valve stays reachable —
 * a vassal forced into a ruinous trade can still rebel.
 *
 * ANTI-OSCILLATION: the contest primitive amplifies the incumbent + raises the
 * hold ceiling (hysteresis). This module ADDS a caller-side cooldown: after a flip,
 * `lastFlipTick` per prize is stored in `worldState.tradeWarState`. Within the
 * cooldown window a re-flip is suppressed (the prior winner holds).
 *
 * DETERMINISM CONTRACT (sacred, identical to the war layer):
 *   - No Date.now / Math.random / argless new Date. RNG is INJECTED; the contest
 *     forks on the FROZEN contest recipe (`contest:<channelType>:<prizeId>:<tick>`);
 *     the escalation/wind-down decision forks on a stable per-prize key.
 *   - Every output iteration is over a CODEPOINT-SORTED key list — buyers,
 *     commodities, contenders. Never a Map/Set/Object insertion order.
 *   - All reads come from the SINGLE pre-tick snapshot. The cooldown ledger is
 *     read pre-tick and rewritten as a fresh object (never aliased).
 *
 * GATED + byte-identical when OFF: `!rules.warLayerEnabled` ⇒ pure no-op
 * returning empties + the world's existing tradeWarState reference untouched.
 */

import { contestOverThirdParty } from '../region/contestOverThirdParty.js';
import { mintDirectedChannel } from '../region/graph.js';
import { normalizeGood } from '../region/goodsCatalog.js';
import { clamp01 } from '../region/contestMath.js';
import { supplyCompleteness } from './supplyCompleteness.js';
import {
  settlementStrength,
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  relationshipRoles,
} from './relationshipEvolution.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { stablePart } from './worldState.js';

const CHANNEL_TYPE = 'trade_primacy';
const TRADE_CARRIERS = ['trade_dependency', 'trade_route', 'export_market'];
// A challenger needs a minimally-complete supply chain to even contest.
const MIN_CHAIN = 0.2;
// Anti-thrash: after a flip, suppress re-flips for this many ticks (this caller-side
// cooldown — the primitive's hysteresis is the other half).
const FLIP_COOLDOWN_TICKS = 6;
// Escalation gate: only a CONFIDENT defeated incumbent can open a war
// (conquest stays reachable but not automatic — most losers wind down).
const ESCALATION_CONFIDENCE = 0.5;

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Canonical good id for a label/object, or null.
 * @param {any} value @returns {string|null}
 */
function goodId(value) {
  const good = normalizeGood(value);
  return good ? good.id : null;
}

/**
 * Per-settlement economic strength lookup from the SINGLE pre-tick snapshot —
 * the SAME `settlementStrength` over the SAME pressure index the war layer and
 * the relationship contests read, so the trade war's economic term can never
 * diverge from war's confidence gate.
 * @param {any} snapshot @returns {(id: any) => number}
 */
function buildStrengthLookup(snapshot) {
  const pIndex = pressureIndex(deriveSettlementPressures(snapshot));
  const cache = new Map();
  return (/** @type {any} */ id) => {
    const key = String(id);
    if (cache.has(key)) return cache.get(key);
    const item = snapshot?.byId?.get?.(key);
    const strength = item ? settlementStrength(item, buildPressureSummary(pIndex, key)) : 0;
    cache.set(key, strength);
    return strength;
  };
}

/**
 * The relationship state between two settlements, resolved from the pre-tick
 * edges + relationshipStates. Returns `{ relState, edge, roles }` or null.
 * @param {any} snapshot @param {any} a @param {any} b
 */
function relationshipBetween(snapshot, a, b) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const aId = String(a);
  const bId = String(b);
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const s = getRelationshipSettlements(edge);
    const paired = (String(s.from) === aId && String(s.to) === bId)
      || (String(s.from) === bId && String(s.to) === aId);
    if (!paired) continue;
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    return { relState, edge: rawEdge, roles: relationshipRoles(edge, relState) };
  }
  return null;
}

/**
 * Diplomatic standing of supplier X toward buyer C in 0..1. A composite of
 * trust, relationshipType, and (negatively) resentment/fear. A hostile/cold_war
 * tie takes a significant-but-not-fatal demerit (never a hard zero — §3.2).
 * No relationship ⇒ a neutral baseline.
 * @param {any} snapshot @param {any} supplierId @param {any} buyerId @returns {number}
 */
function diplomaticStanding(snapshot, supplierId, buyerId) {
  const rel = relationshipBetween(snapshot, supplierId, buyerId);
  if (!rel) return 0.5;
  const { relState } = rel;
  const base = clamp01(0.5 + relState.trust * 0.35 - relState.resentment * 0.3 - relState.fear * 0.1);
  const typeBias = /** @type {Record<string, number>} */ ({
    allied: 1.15,
    patron: 1.12,
    vassal: 1.12,
    trade_partner: 1.08,
    neutral: 1,
    rival: 0.8,
    cold_war: 0.6,
    hostile: 0.5,
  })[relState.relationshipType] ?? 1;
  return clamp01(base * typeBias);
}

/**
 * Is C a vassal of X, with the overlord able to compel C's trade? Returns the
 * overlord id when X is C's overlord (the hard-override holder), else null.
 * @param {any} snapshot @param {any} buyerId @param {any} supplierId
 */
function overlordOver(snapshot, buyerId, supplierId) {
  const rel = relationshipBetween(snapshot, supplierId, buyerId);
  if (!rel) return null;
  if (rel.relState.relationshipType !== 'vassal') return null;
  const { seniorId, juniorId } = rel.roles;
  if (String(juniorId) !== String(buyerId)) return null;
  if (String(seniorId) !== String(supplierId)) return null;
  return { overlordId: seniorId, vassalId: juniorId, relKey: relationshipKeyFromEdge(rel.edge) };
}

/**
 * Confirmed trade carriers INTO buyer C, codepoint-keyed. Each yields the
 * supplier id and channel strength; goods are matched to the commodity.
 * @param {any} snapshot @param {any} buyerId @param {any} commodityId @returns {Map<string, any>}
 */
function suppliersInto(snapshot, buyerId, commodityId) {
  const id = String(buyerId);
  const channels = snapshot?.regionalGraph?.channels || snapshot?.channels || [];
  const bySupplier = new Map();
  for (const channel of channels) {
    if (String(channel?.to) !== id) continue;
    if (!TRADE_CARRIERS.includes(String(channel?.type))) continue;
    if (String(channel?.status || 'confirmed') !== 'confirmed') continue;
    const goods = Array.isArray(channel?.goods) ? channel.goods : [];
    // A channel with declared goods must include K; a general (goods-less) tie
    // only counts when the supplier actually exports K (checked by eligibility).
    if (goods.length && !goods.some((/** @type {any} */ g) => goodId(g) === commodityId)) continue;
    const supplierId = String(channel.from);
    const strength = clamp01(channel.strength ?? channel.severity ?? 0.45);
    const prev = bySupplier.get(supplierId) || 0;
    if (strength > prev) bySupplier.set(supplierId, strength);
  }
  return bySupplier;
}

/**
 * Codepoint-sorted commodities C imports (primaryImports), as canonical ids.
 * @param {any} snapshot @param {any} buyerId @returns {string[]}
 */
function importedCommodities(snapshot, buyerId) {
  const entry = snapshot?.byId?.get?.(String(buyerId));
  const eco = entry?.settlement?.economicState || entry?.settlement?.economy || {};
  const imports = eco.primaryImports || eco.imports || [];
  const ids = new Set();
  for (const imp of imports) { const id = goodId(imp); if (id) ids.add(id); }
  return [...ids].sort(codepoint);
}

/**
 * Does supplier X export commodity K (production eligibility, §3.2)?
 * @param {any} snapshot @param {any} supplierId @param {any} commodityId @returns {boolean}
 */
function exportsCommodity(snapshot, supplierId, commodityId) {
  const entry = snapshot?.byId?.get?.(String(supplierId));
  const eco = entry?.settlement?.economicState || entry?.settlement?.economy || {};
  const exportsList = eco.primaryExports || eco.exports || [];
  for (const e of exportsList) { if (goodId(e) === commodityId) return true; }
  // Production also counts via supplyCompleteness producing a non-zero score.
  return supplyCompleteness(snapshot, supplierId, commodityId) > 0;
}

/**
 * The DERIVED incumbent: C's current primary supplier for K — the strongest
 * confirmed carrier into C for K, codepoint tie-break. Null when none.
 * @param {any} supplierStrengths @returns {string|null}
 */
function deriveIncumbent(supplierStrengths) {
  let best = null;
  let bestStrength = -Infinity;
  for (const id of [...supplierStrengths.keys()].sort(codepoint)) {
    const s = supplierStrengths.get(id);
    if (s > bestStrength) { best = id; bestStrength = s; }
  }
  return best;
}

/**
 * A probability-1 condition outcome (the §A1 stressor-condition shape).
 * @param {{ id: string, archetype: string, targetSaveId: any, severity: number, headline: string,
 *   summary: string, reasons: string[], tick: number, sourceEventTargetId: any, causes: any[] }} args
 */
function conditionOutcome({ id, archetype, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, causes }) {
  return {
    id,
    type: 'condition',
    candidateType: archetype,
    ruleId: `trade_war_${archetype}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity,
    headline,
    summary,
    reasons,
    condition: {
      archetype,
      severity,
      triggeredAt: { tick, sourceEventType: 'TRADE_WAR', sourceEventTargetId },
      causes,
    },
  };
}

/**
 * Evaluate the trade war for one tick.
 *
 * @param {Object} args
 * @param {any} args.snapshot   the SINGLE pre-tick world snapshot
 * @param {any} args.worldState
 * @param {{ random: () => number, fork: (label:string) => any }} args.rng
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @param {{ warLayerEnabled?: boolean }} args.rules
 * @returns {{ outcomes: any[], graphChannels: any[], tradeWarState: Record<string, any>, dispositionDeltas: Array<{id:string, outcome:'win'|'loss', magnitude?:number}> }}
 */
export function evaluateTradeWar({ snapshot, worldState, rng, tick = 0, now = null, rules = {} }) {
  const existingState = worldState?.tradeWarState || {};
  // ── Gate: byte-identical no-op when OFF. Return the existing ledger ref. ────
  if (!rules?.warLayerEnabled) {
    return { outcomes: [], graphChannels: [], tradeWarState: existingState, dispositionDeltas: [] };
  }

  const strengthFor = buildStrengthLookup(snapshot);
  const outcomes = [];
  const graphChannels = [];
  // Disposition write-side: id-stable win/loss attributions from the trade
  // contests that FLIPPED this tick. The winner/defeated ids are derived from
  // primarySupplierInto (channel-strength + codepoint tie-break) and the
  // relationshipRoles vassal override, never raw edge orientation — so a
  // reversed-authored save credits the SAME new primary partner. Empty unless a
  // flip lands; folded into next-tick dispositionStats post-apply by the caller.
  /** @type {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} */
  const dispositionDeltas = [];
  // Copy the ledger; never mutate the world's record in place.
  const tradeWarState = { ...existingState };

  const nameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };
  const commodityLabelFor = (/** @type {any} */ commodityId) => {
    const good = normalizeGood(commodityId);
    return good?.label || good?.sourceLabel || commodityId;
  };

  // ── Enumerate contests deterministically: every buyer C (codepoint), every
  //    imported commodity K (codepoint). ──────────────────────────────────────
  const buyers = (snapshot?.settlements || []).map((/** @type {any} */ item) => String(item.id)).sort(codepoint);

  for (const buyerId of buyers) {
    for (const commodityId of importedCommodities(snapshot, buyerId)) {
      // Candidate suppliers = confirmed carriers into C for K whose supplier
      // both exports K and clears the minimum-chain gate.
      const supplierStrengths = suppliersInto(snapshot, buyerId, commodityId);
      const eligible = [...supplierStrengths.keys()]
        .filter(supplierId => supplierId !== buyerId)
        .filter(supplierId => exportsCommodity(snapshot, supplierId, commodityId))
        .filter(supplierId => supplyCompleteness(snapshot, supplierId, commodityId) >= MIN_CHAIN)
        .sort(codepoint);
      if (eligible.length < 2) continue; // need an incumbent + ≥1 challenger

      const prizeId = `${stablePart(buyerId)}:${stablePart(commodityId)}`;
      const incumbentId = deriveIncumbent(
        new Map(eligible.map(id => [id, supplierStrengths.get(id)])),
      );

      // scoreFor(X) = supplyCompleteness × economicStrength × diplomaticStanding,
      // all 0..1, blended as a product into a single 0..1 claim. (The PRIMITIVE
      // takes the log-odds of this — never a raw product across contenders.)
      const contenders = eligible.map(supplierId => {
        const sup = supplyCompleteness(snapshot, supplierId, commodityId);
        const eco = strengthFor(supplierId);
        const dip = diplomaticStanding(snapshot, supplierId, buyerId);
        let scoreFor = clamp01(sup * eco * dip);
        // Allied/vassal supplier bias: a friendly supplier is a stronger claim.
        const rel = relationshipBetween(snapshot, supplierId, buyerId);
        if (rel && ['allied', 'patron', 'vassal'].includes(rel.relState.relationshipType)) {
          scoreFor = clamp01(scoreFor + 0.15);
        }
        return { id: supplierId, scoreFor };
      });

      // ── HARD OVERRIDE: an overlord compels its vassal C's trade. The FIRST
      //    eligible supplier that is C's overlord forces the win (codepoint
      //    order → deterministic). Force its scoreFor → ~1 and pin the winner. ─
      let forcedOverlord = null;
      for (const supplierId of eligible) {
        const over = overlordOver(snapshot, buyerId, supplierId);
        if (over) { forcedOverlord = { supplierId, ...over }; break; }
      }

      let result;
      if (forcedOverlord) {
        // Deterministic: no rng when forced (probability-1 bypass).
        for (const c of contenders) {
          if (c.id === forcedOverlord.supplierId) c.scoreFor = 1;
        }
        const priorWinner = tradeWarState[prizeId]?.winnerId ?? incumbentId;
        result = {
          prizeId,
          channelType: CHANNEL_TYPE,
          winnerId: forcedOverlord.supplierId,
          incumbentId,
          changed: forcedOverlord.supplierId !== priorWinner,
          contested: true,
          forced: true,
          pHold: 1,
          roll: 0,
          weights: {},
        };
        // Route the forced commitment through the vassal's ECONOMY PRESSURE so
        // `vassal_rebellion` stays reachable — a coerced ruinous trade strains C.
        outcomes.push(conditionOutcome({
          id: `world_outcome.vassal_trade_coercion.${prizeId}.${tick}`,
          archetype: 'vassal_trade_coercion',
          targetSaveId: buyerId,
          severity: 0.5,
          headline: `${nameFor(forcedOverlord.overlordId)} dictates ${nameFor(buyerId)}'s ${commodityLabelFor(commodityId)} trade`,
          summary: `${nameFor(forcedOverlord.overlordId)} compels its vassal ${nameFor(buyerId)} to source ${commodityLabelFor(commodityId)} from the overlord's designate, straining the local economy.`,
          reasons: [`Overlord ${nameFor(forcedOverlord.overlordId)} compels the trade. The contest is overridden.`],
          tick,
          sourceEventTargetId: forcedOverlord.overlordId,
          causes: [{ source: forcedOverlord.overlordId, effect: 'vassal_trade_coercion', reason: `${nameFor(forcedOverlord.overlordId)} forces ${nameFor(buyerId)}'s trade allocation.` }],
        }));
      } else {
        // ── Cooldown: within the flip window the prior winner holds (anti-thrash).
        const ledgerEntry = tradeWarState[prizeId];
        const lastFlipTick = Number.isFinite(ledgerEntry?.lastFlipTick) ? ledgerEntry.lastFlipTick : -Infinity;
        const inCooldown = tick - lastFlipTick < FLIP_COOLDOWN_TICKS;
        // The contest's incumbent is the prior WINNER if one is on cooldown,
        // else the derived incumbent. (A held prize keeps its holder.)
        const contestIncumbent = inCooldown
          ? (ledgerEntry?.winnerId ?? incumbentId)
          : incumbentId;

        result = contestOverThirdParty({
          prizeId,
          channelType: CHANNEL_TYPE,
          contenders,
          incumbentId: contestIncumbent,
          rng,
          tick,
        });

        if (inCooldown && result.changed) {
          // Suppress the re-flip: the holder retains the prize this window.
          result = { ...result, winnerId: contestIncumbent, changed: false, suppressed: true };
        }
      }

      // ── Persist the prize state; stamp lastFlipTick only on a real flip. ────
      const priorEntry = tradeWarState[prizeId] || {};
      tradeWarState[prizeId] = {
        winnerId: result.winnerId,
        incumbentId: result.incumbentId,
        lastFlipTick: result.changed ? tick : (Number.isFinite(priorEntry.lastFlipTick) ? priorEntry.lastFlipTick : null),
        updatedTick: tick,
      };

      if (!result.changed) continue; // held — no realignment, no escalation.

      // ── FLIP: re-point C's primary trade_dependency channel to the winner. ─
      const winnerId = result.winnerId;
      const defeatedId = result.incumbentId;
      // Disposition ratchet: the new primary partner banked a trade WIN; the displaced
      // incumbent a LOSS. (Only on a real flip — a held prize banks nothing.)
      dispositionDeltas.push({ id: String(winnerId), outcome: 'win', magnitude: 1 });
      if (defeatedId && defeatedId !== winnerId) {
        dispositionDeltas.push({ id: String(defeatedId), outcome: 'loss', magnitude: 1 });
      }
      graphChannels.push(mintDirectedChannel({
        type: 'trade_dependency',
        from: winnerId,
        to: buyerId,
        strength: clamp01(0.55 + (contenders.find(c => c.id === winnerId)?.scoreFor || 0) * 0.35),
        confidence: 0.8,
        explanation: `${nameFor(buyerId)} realigns its ${commodityLabelFor(commodityId)} trade to ${nameFor(winnerId)}.`,
        relationshipKey: `trade_dependency.${stablePart(winnerId)}.${stablePart(buyerId)}`,
        source: 'trade_war_realign',
        now,
      }));
      // Goods carried on the realigned channel (so the next-tick selector reads K).
      /** @type {any} */ (graphChannels[graphChannels.length - 1]).goods = [{ id: commodityId, label: commodityLabelFor(commodityId) }];

      outcomes.push(conditionOutcome({
        id: `world_outcome.trade_realignment.${prizeId}.${tick}`,
        archetype: 'trade_realignment',
        targetSaveId: buyerId,
        severity: 0.4,
        headline: `${nameFor(buyerId)} turns to ${nameFor(winnerId)} for ${commodityLabelFor(commodityId)}`,
        summary: `${nameFor(winnerId)} has displaced ${defeatedId ? nameFor(defeatedId) : 'the prior supplier'} as ${nameFor(buyerId)}'s primary source of ${commodityLabelFor(commodityId)}.`,
        reasons: [`Primary ${commodityLabelFor(commodityId)} supplier flipped to ${nameFor(winnerId)}.`],
        tick,
        sourceEventTargetId: winnerId,
        causes: [{ source: winnerId, effect: 'trade_realignment', reason: `${nameFor(winnerId)} won the trade contest over ${nameFor(buyerId)}.` }],
      }));

      // ── Wind-down vs conquest escalation for the defeated incumbent A. ──────
      if (defeatedId && defeatedId !== winnerId && snapshot?.byId?.has?.(defeatedId)) {
        const escalationRng = rng.fork(`trade_escalation:${prizeId}:${tick}`);
        const defeatedStrength = strengthFor(defeatedId);
        const escalates = defeatedStrength >= ESCALATION_CONFIDENCE
          && escalationRng.random() < clamp01(defeatedStrength - ESCALATION_CONFIDENCE + 0.2);
        if (escalates) {
          // ESCALATE: A opens a war_front toward the winner — the war layer
          // resolves the siege next tick (conquest stays reachable, not automatic).
          graphChannels.push(mintDirectedChannel({
            type: 'war_front',
            from: defeatedId,
            to: winnerId,
            strength: clamp01(0.45 + defeatedStrength * 0.3),
            confidence: 0.75,
            explanation: `${nameFor(defeatedId)} escalates the lost trade war against ${nameFor(winnerId)}.`,
            relationshipKey: `war_front.${stablePart(defeatedId)}.${stablePart(winnerId)}`,
            source: 'trade_war_escalation',
            now,
          }));
          outcomes.push(conditionOutcome({
            id: `world_outcome.trade_war_escalation.${prizeId}.${tick}`,
            archetype: 'war_pressure',
            targetSaveId: winnerId,
            severity: clamp01(0.4 + defeatedStrength * 0.2),
            headline: `${nameFor(defeatedId)} answers lost trade with the sword`,
            summary: `Defeated in the contest for ${nameFor(buyerId)}'s ${commodityLabelFor(commodityId)} trade, ${nameFor(defeatedId)} opens hostilities against ${nameFor(winnerId)}.`,
            reasons: [`Defeated incumbent strength ${defeatedStrength.toFixed(2)} cleared the escalation gate.`],
            tick,
            sourceEventTargetId: defeatedId,
            causes: [{ source: defeatedId, effect: 'war_pressure', reason: `${nameFor(defeatedId)} escalated a lost trade war.` }],
          }));
        } else {
          // WIND DOWN: a peaceful economic adjustment — a reversible cold_war
          // strain condition on the defeated incumbent (the market loss bites,
          // but no war). A market_shock-flavored economic condition.
          outcomes.push(conditionOutcome({
            id: `world_outcome.trade_war_winddown.${prizeId}.${tick}`,
            archetype: 'market_shock',
            targetSaveId: defeatedId,
            severity: 0.35,
            headline: `${nameFor(defeatedId)} absorbs the loss of ${nameFor(buyerId)}'s market`,
            summary: `${nameFor(defeatedId)} loses ${nameFor(buyerId)}'s ${commodityLabelFor(commodityId)} market and adjusts. This is a sober economic wind-down, not war.`,
            reasons: [`Defeated incumbent strength ${defeatedStrength.toFixed(2)} below the escalation gate: peaceful adjustment.`],
            tick,
            sourceEventTargetId: buyerId,
            causes: [{ source: buyerId, effect: 'market_shock', reason: `${nameFor(defeatedId)} lost a primary export market.` }],
          }));
        }
      }
    }
  }

  return { outcomes, graphChannels, tradeWarState, dispositionDeltas };
}
