/**
 * tests/store/campaignMembershipIdNormalization.test.js — membership scans
 * must String-normalize settlement ids.
 *
 * Settlement ids are an acknowledged number/string mix (cloud rows return
 * numeric ids; local saves mint string ids). The clock-bound scans
 * (isSettlementClockBound / queueSettlementEvent) always normalized, but the
 * two load-bearing RESOLVERS did exact-match comparisons: campaignSettlements
 * (which feeds every world-pulse advance its member saves) and
 * getCampaignForSettlement (the settlement→campaign bridge). A member whose
 * save id was the number 123 while the campaign row stored "123" (or vice
 * versa) silently vanished from the pulse and from the campaign badge.
 *
 * OWNER-RULED (Owner Ruling #5 blanket grant, 2026-07-17 — "membership
 * normalization", the signed W6 misc verdict): both resolvers now String()-
 * normalize, matching master's model and this repo's own
 * isSettlementClockBound precedent. The same String() model extends to the
 * settlementIds WRITERS in campaignSlice (addToCampaign's dedupe + cross-
 * campaign prune, removeFromCampaign's filter) — without that, a mismatched
 * member would now ADVANCE but be unremovable (the remove button would
 * silently no-op), and a mismatched re-add would duplicate the entry.
 *
 * ONE-TIME BEHAVIOR NOTE: campaigns that already contain number/string-
 * mismatched member ids gain those members back into world-pulse advances —
 * previously they were silently dropped. This is the signed intent.
 *
 * The advance-level pin (a mixed-id campaign advances BOTH members through a
 * real advanceCampaignWorld) lives in campaignSlice.worldPulse.test.js.
 */
import { describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { save: vi.fn(), update: vi.fn(() => Promise.resolve()), delete: vi.fn(), isConfigured: false },
}));

// The writer tests exercise persistCampaignState → campaignService.cache;
// mock the campaigns lib so no real localStorage/cloud client is needed
// (mirrors campaignSlice.worldPulse.test.js).
vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { campaignSettlements, findActiveCampaign } from '../../src/store/campaignSliceShared.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';

const makeStore = () => create(immer((set, get, api) => ({ ...createCampaignSlice(set, get, api) })));

const campaign = (id, settlementIds) => ({
  id,
  name: `Campaign ${id}`,
  accessState: 'active',
  settlementIds,
});

describe('campaignSettlements — id normalization', () => {
  test('the central campaign lookup normalizes number/string campaign ids', () => {
    const campaigns = [campaign(42, [])];
    expect(findActiveCampaign(campaigns, '42')).toBe(campaigns[0]);
    expect(findActiveCampaign(campaigns, null)).toBeNull();
  });

  test('string-stored id resolves a number-id save, and vice versa', () => {
    const state = {
      campaigns: [campaign('camp-1', ['alpha', '7', 9])],
      savedSettlements: [
        { id: 'alpha' },      // exact string match
        { id: 7 },            // number save vs string-stored '7'
        { id: '9' },          // string save vs number-stored 9
        { id: 'stranger' },   // non-member — must stay out
      ],
    };
    const members = campaignSettlements(state, 'camp-1');
    expect(members.map(s => String(s.id)).sort()).toEqual(['7', '9', 'alpha']);
  });

  test('missing settlementIds yields no members (no throw)', () => {
    const state = {
      campaigns: [{ id: 'camp-1', accessState: 'active' }],
      savedSettlements: [{ id: 'save-a' }],
    };
    expect(campaignSettlements(state, 'camp-1')).toEqual([]);
  });
});

describe('getCampaignForSettlement — id normalization', () => {
  test('number arg resolves a string-stored member; string arg resolves a number-stored member', () => {
    const store = makeStore();
    store.setState(s => {
      s.campaigns = [campaign('camp-1', ['7']), campaign('camp-2', [9])];
    });
    expect(store.getState().getCampaignForSettlement(7)?.id).toBe('camp-1');
    expect(store.getState().getCampaignForSettlement('9')?.id).toBe('camp-2');
    expect(store.getState().getCampaignForSettlement('absent')).toBeNull();
  });

  test('null / undefined never match (String(null) must not hit a literal "null" entry)', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [campaign('camp-1', ['null', 'undefined'])]; });
    expect(store.getState().getCampaignForSettlement(null)).toBeNull();
    expect(store.getState().getCampaignForSettlement(undefined)).toBeNull();
  });

  test('a campaign without settlementIds is skipped, not thrown on', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [{ id: 'camp-1', accessState: 'active' }]; });
    expect(store.getState().getCampaignForSettlement('save-a')).toBeNull();
  });
});

describe('membership writers — the same String() model (no advancing-but-unremovable member)', () => {
  test('removeFromCampaign removes a number-stored member by its string id', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [campaign('camp-1', [7, 'keep'])]; });
    store.getState().removeFromCampaign('camp-1', '7');
    expect(store.getState().campaigns[0].settlementIds).toEqual(['keep']);
  });

  test('addToCampaign does not duplicate a member stored under the other id type', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [campaign('camp-1', ['7'])]; });
    store.getState().addToCampaign('camp-1', 7);
    // ONE entry, not the pre-fix exact-match duplicate ['7', 7]. The cross-
    // campaign prune runs over the target too, so the surviving entry carries
    // the caller's id type — membership (String-normalized) is unchanged.
    expect(store.getState().campaigns[0].settlementIds).toEqual([7]);
  });

  test('addToCampaign re-homing prunes the member from a campaign that stored the other type', () => {
    const store = makeStore();
    store.setState(s => {
      s.campaigns = [campaign('camp-a', ['7', 'other']), campaign('camp-b', [])];
    });
    store.getState().addToCampaign('camp-b', 7);
    const byId = Object.fromEntries(store.getState().campaigns.map(c => [c.id, c.settlementIds]));
    expect(byId['camp-a']).toEqual(['other']);
    expect(byId['camp-b']).toEqual([7]);
  });

  test('re-homing refuses atomically when the source campaign is advancing', () => {
    const store = makeStore();
    store.setState(s => {
      s.campaigns = [campaign('camp-a', ['7', 'other']), campaign('camp-b', [])];
      s.advanceInFlight = ['camp-a'];
    });
    const before = JSON.stringify(store.getState().campaigns);
    expect(store.getState().addToCampaign('camp-b', 7)).toEqual({
      ok: false,
      reason: 'advance_in_flight',
      campaignId: 'camp-a',
    });
    expect(JSON.stringify(store.getState().campaigns)).toBe(before);
  });

  test('adding refuses atomically when the target campaign is advancing', () => {
    const store = makeStore();
    store.setState(s => {
      s.campaigns = [campaign('camp-a', ['7']), campaign('camp-b', [])];
      s.advanceInFlight = ['camp-b'];
    });
    const before = JSON.stringify(store.getState().campaigns);
    expect(store.getState().addToCampaign('camp-b', 'new')).toEqual({
      ok: false,
      reason: 'advance_in_flight',
      campaignId: 'camp-b',
    });
    expect(JSON.stringify(store.getState().campaigns)).toBe(before);
  });

  test('removing refuses atomically while the campaign has a paused advance', () => {
    const store = makeStore();
    store.setState(s => {
      s.campaigns = [{
        ...campaign('camp-a', ['7', 'other']),
        worldState: { pausedAdvance: { remaining: 2 } },
      }];
    });
    const before = JSON.stringify(store.getState().campaigns);
    expect(store.getState().removeFromCampaign('camp-a', 7)).toEqual({
      ok: false,
      reason: 'advance_paused',
      campaignId: 'camp-a',
    });
    expect(JSON.stringify(store.getState().campaigns)).toBe(before);
  });
});
