/**
 * generosityNews.js — THE GENEROSITY ENGINE's house-voice Chronicle beats (E1a–E1d).
 *
 * The AGGREGATE wizard-news entries the generosity mover (generosityKernel.js) emits — one
 * per verdict class: a relief GIFT (succor), a fog-mediated REFUSAL (the tragic grudge
 * forming), a credit DEFAULT (the casus-belli seam), a REFUGE opening (people, not goods), a
 * PURCHASE (the market twin), and a TRADE OVERTURE (the aid road turning toward a trade road).
 *
 * Split out of the kernel as a pure display leaf (the registryProse idiom — the kernel owns
 * the DECISION; this owns the NARRATION), keeping the mover under the domain size ratchet.
 * AGGREGATE-only: population/settlement counts, never a named soul (the named-fate law). Pure,
 * deterministic (explicit tick/now — no Date); stable ids via stablePart.
 */

import { clamp01 } from '../../kernel/math.js';
import { VERDICTS } from '../spatial/generosityEV.js';
import { stablePart } from './stablePart.js';

/**
 * A relief-granted wizard-news entry. The kernel already narrated the deciding terms; this
 * frames it for the Chronicle.
 * @param {{ giverId: string, receiverId: string, giverName: string, receiverName: string, verdict: string, receipt: string, magnitude: number, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
export function succorNews({ giverId, receiverId, giverName, receiverName, verdict, receipt, magnitude, tick, now }) {
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
export function refusalNews({ giverName, receiverName, receipt, damage, tick, now }) {
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
export function defaultNews({ debtorName, creditorName, tick, now }) {
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

/**
 * A refuge-posture OPENING wizard-news entry (design §4 / E1c): a host opens its gates to a
 * distressed ally's displaced — "generosity in people." AGGREGATE (population counts, no named
 * soul). Emitted only on the OPEN transition (a held posture re-affirms silently).
 * @param {{ giverName: string, receiverName: string, weight: number, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
export function refugeNews({ giverName, receiverName, weight, tick, now }) {
  const summary = `${giverName} opens its gates to the displaced of ${receiverName} — refuge in the ally's exodus.`;
  return {
    id: `wizard_news.${tick}.refuge.${stablePart(giverName)}.${stablePart(receiverName)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: weight >= 0.4 ? 'notable' : 'minor',
    score: Math.round(45 + clamp01(weight) * 20),
    headline: `${giverName} opens refuge to ${receiverName}`,
    summary,
    kind: 'applied',
    impactKind: 'generosity_refuge',
    channelType: null,
    severity: Math.round(clamp01(weight) * 100) / 100,
    settlementIds: [],
    impactIds: [],
    channelIds: [],
    tags: ['world_pulse', 'generosity', 'refuge'],
    reasons: [summary],
  };
}

/**
 * A PURCHASE (market-twin) wizard-news entry (design §4 / A2 — E1d): the grain a seller would
 * not GIVE was BOUGHT instead — "coin for bushels, and the market kept the peace." AGGREGATE
 * (the two courts, no named soul); the conserved grain still moved (the buyer paid a prosperity
 * band, the seller took a bounded income).
 * @param {{ giverName: string, receiverName: string, magnitude: number, receipt: string, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
export function purchaseNews({ giverName, receiverName, magnitude, receipt, tick, now }) {
  return {
    id: `wizard_news.${tick}.purchase.${stablePart(giverName)}.${stablePart(receiverName)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: magnitude >= 0.6 ? 'notable' : 'minor',
    score: Math.round(42 + clamp01(magnitude) * 22),
    headline: `${receiverName} buys grain from ${giverName}`,
    summary: receipt,
    kind: 'applied',
    impactKind: 'generosity_purchase',
    channelType: 'trade_route',
    severity: Math.round(clamp01(magnitude) * 100) / 100,
    settlementIds: [],
    impactIds: [],
    channelIds: [],
    tags: ['world_pulse', 'generosity', 'purchase', 'trade'],
    reasons: [receipt],
  };
}

/**
 * A TRADE-OVERTURE OPENING wizard-news entry (§9 TRADE / design A4 — E1d): a sustained aid
 * corridor warmed enough that the giver opens a trade overture — the byte-neutral trust-nudge
 * toward a trade route ("the grain road of the famine year becomes the silk road of the peace").
 * AGGREGATE; emitted ONCE per warm episode (the initiated latch), only when the nudge auto-applies.
 * @param {{ giverName: string, receiverName: string, warmth: number, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
export function tradeOvertureNews({ giverName, receiverName, warmth, tick, now }) {
  const summary = `${giverName}'s sustained aid to ${receiverName} warms into a trade overture — the grain road turns toward a trade road.`;
  return {
    id: `wizard_news.${tick}.trade_overture.${stablePart(giverName)}.${stablePart(receiverName)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: warmth >= 0.8 ? 'notable' : 'minor',
    score: Math.round(44 + clamp01(warmth) * 18),
    headline: `${giverName} opens a trade overture to ${receiverName}`,
    summary,
    kind: 'applied',
    impactKind: 'generosity_trade_overture',
    channelType: 'trade_route',
    severity: Math.round(clamp01(warmth) * 100) / 100,
    settlementIds: [],
    impactIds: [],
    channelIds: [],
    tags: ['world_pulse', 'generosity', 'trade', 'overture'],
    reasons: [summary],
  };
}
