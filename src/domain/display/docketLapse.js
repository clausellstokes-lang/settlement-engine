/**
 * domain/display/docketLapse.js — the ONE shared §10 LAPSED derivation
 * (experience-product-fit-3). The docket (RealmDocket) and the settlement queue
 * (PendingIntentions) both mark a queued entry LAPSED when its verb predicate no
 * longer holds against the CURRENT settlement — "the tick will refuse it visibly."
 *
 * THE BUG THIS CLOSES: both surfaces used to evaluate `predicate(settlement, {})`
 * with an EMPTY ctx the composer never used. The composer builds a real
 * verbCtx = { canUseCustom, campaignPeerCount } (EventComposer.jsx), and the
 * OPENED_TRADE_ROUTE predicate reads campaignPeerCount — so a legally-staged
 * trade route to a campaign PEER (a settlement with zero legacy linked
 * neighbours) rendered a FALSE "LAPSED" even though the drain accepts it. The
 * honesty mechanism cried wolf, training the DM to distrust real lapses. Threading
 * the same ctx the composer builds kills the false positive.
 *
 * PRESENTATION ONLY. Pure; consumes the lazy AFFORDANCE_MANIFEST (rides the
 * docket/composer chunk — never the eager first-paint closure) and reads nothing.
 */

import { AFFORDANCE_MANIFEST } from '../events/affordanceManifest.js';

/**
 * @typedef {{ foldedInto?: unknown,
 *   predicate: (s: unknown, c: unknown) => { available?: boolean, reasons?: string[] } }} AffordanceEntry
 */

/**
 * The composer's verb-context, rebuilt for a docket/queue surface.
 * @param {{ canUseCustom?: boolean, campaignPeerCount?: number }} [signals]
 * @returns {{ canUseCustom: boolean, campaignPeerCount: number }}
 */
export function lapseCtx({ canUseCustom = false, campaignPeerCount = 0 } = {}) {
  return { canUseCustom: !!canUseCustom, campaignPeerCount: Math.max(0, Number(campaignPeerCount) || 0) };
}

/**
 * The campaign-peer count for ONE entry — every OTHER campaign member (the raw
 * settlementIds MINUS this entry's own saveId). The composer's OPENED_TRADE_ROUTE
 * predicate reads this as "are there campaign peers to trade with?".
 *
 * ⚠️ MUST exclude the entry's own saveId: deriving it from raw
 * campaign.settlementIds.length over-counts by one and, for a LONE-member
 * campaign, wrongly reports a peer (1 > 0) — which would SUPPRESS a legitimate
 * LAPSED. Excluding self makes a lone member correctly report zero peers.
 * @param {{ settlementIds?: Array<string|number> } | null | undefined} campaign
 * @param {string|number|null|undefined} saveId  the entry's own save
 * @returns {number}
 */
export function campaignPeerCountFor(campaign, saveId) {
  const ids = Array.isArray(campaign?.settlementIds) ? campaign.settlementIds : [];
  const self = String(saveId);
  return ids.map(String).filter((id) => id !== self).length;
}

/**
 * §10 LAPSED derivation: the entry's verb predicate no longer holds against the
 * CURRENT settlement (grayed-with-reason; the drain would refuse it). Returns the
 * reason string, or null when the entry is NOT lapsed. Threads the composer's real
 * ctx so a campaign-peer trade route is not falsely flagged.
 * @param {{ type?: string } | null | undefined} event  the queued event
 * @param {Record<string, unknown> | null | undefined} settlement  the entry's settlement
 * @param {{ canUseCustom?: boolean, campaignPeerCount?: number }} [ctx]
 * @returns {string | null}
 */
export function lapseOf(event, settlement, ctx = {}) {
  const type = event?.type;
  if (type == null) return null;
  const manifest = /** @type {Record<string, AffordanceEntry>} */ (/** @type {unknown} */ (AFFORDANCE_MANIFEST));
  const v = manifest[type];
  if (!v || v.foldedInto || !settlement) return null;
  const p = v.predicate(settlement, lapseCtx(ctx));
  return p.available ? null : (p.reasons || []).join(' ');
}
