/**
 * docketLapse.test.js — experience-product-fit-3: the shared §10 LAPSED
 * derivation, ctx-correct. The docket + PendingIntentions used to evaluate the
 * verb predicate with an EMPTY ctx the composer never used, so a legally-staged
 * trade route to a campaign PEER (a settlement with zero linked neighbours)
 * cried a FALSE "LAPSED" though the drain accepts it. The pin: with the real ctx
 * (campaignPeerCount > 0) the entry is NOT lapsed; a lone-member campaign still
 * lapses (peer count correctly zero).
 */
import { describe, it, expect } from 'vitest';
import { lapseOf, campaignPeerCountFor } from '../../src/domain/display/docketLapse.js';

/** A settlement with NO linked neighbours (the false-positive trigger). */
function linklessSettlement(id = 'ashford') {
  return {
    id, name: id, tier: 'town', population: 1800,
    economicState: { primaryImports: [], primaryExports: [] },
    // no neighbourNetwork / linked neighbours → buildTargetOptions('neighbours') is empty
  };
}

const tradeRouteEvent = { type: 'OPENED_TRADE_ROUTE', targetId: 'brookmere', payload: { relationshipType: 'allied' } };

describe('campaignPeerCountFor — excludes the entry own save', () => {
  it('counts every OTHER member id (settlementIds minus self)', () => {
    const campaign = { settlementIds: ['ashford', 'brookmere', 'caldwick'] };
    expect(campaignPeerCountFor(campaign, 'ashford')).toBe(2);
  });
  it('a lone-member campaign reports ZERO peers (no false peer at 1>0)', () => {
    expect(campaignPeerCountFor({ settlementIds: ['ashford'] }, 'ashford')).toBe(0);
  });
  it('is inert on a garbage campaign', () => {
    expect(campaignPeerCountFor(null, 'ashford')).toBe(0);
    expect(campaignPeerCountFor({}, 'ashford')).toBe(0);
  });
});

describe('lapseOf — the ctx-correct LAPSED verdict (kills the false alarm)', () => {
  it('a campaign-peer trade route on a linkless settlement is NOT lapsed', () => {
    const lapsed = lapseOf(tradeRouteEvent, linklessSettlement(), { campaignPeerCount: 1 });
    expect(lapsed).toBeNull();
  });

  it('the SAME entry with the OLD empty ctx WOULD have cried wolf (the bug)', () => {
    // Empty ctx ⇒ campaignPeerCount 0 ⇒ the linkless settlement gates unavailable.
    const lapsedEmpty = lapseOf(tradeRouteEvent, linklessSettlement(), {});
    expect(typeof lapsedEmpty).toBe('string');
    expect(lapsedEmpty.length).toBeGreaterThan(0);
  });

  it('a lone-member campaign (zero peers, no linked neighbours) STILL lapses — real lapse preserved', () => {
    const lonePeerCount = campaignPeerCountFor({ settlementIds: ['ashford'] }, 'ashford');
    const lapsed = lapseOf(tradeRouteEvent, linklessSettlement(), { campaignPeerCount: lonePeerCount });
    expect(typeof lapsed).toBe('string');
  });

  it('inert on an unknown verb / missing settlement', () => {
    expect(lapseOf({ type: 'NOT_A_VERB' }, linklessSettlement(), { campaignPeerCount: 1 })).toBeNull();
    expect(lapseOf(tradeRouteEvent, null, { campaignPeerCount: 1 })).toBeNull();
  });
});
