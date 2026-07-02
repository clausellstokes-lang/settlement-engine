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
 */
import { describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { save: vi.fn(), update: vi.fn(() => Promise.resolve()), delete: vi.fn(), isConfigured: false },
}));

import { campaignSettlements } from '../../src/store/campaignSliceShared.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';

const makeStore = () => create(immer((set, get, api) => ({ ...createCampaignSlice(set, get, api) })));

const campaign = (id, settlementIds) => ({
  id,
  name: `Campaign ${id}`,
  accessState: 'active',
  settlementIds,
});

describe('campaignSettlements — id normalization', () => {
  test('numeric campaign ids resolve string save ids (and vice versa)', () => {
    const state = {
      campaigns: [campaign('camp-1', [123, 'save-b'])],
      savedSettlements: [
        { id: '123', settlement: { name: 'Cloudmarsh' } },   // string save vs numeric member id
        { id: 'save-b', settlement: { name: 'Stoneford' } }, // exact match still works
        { id: 'save-c', settlement: { name: 'Unrelated' } },
      ],
    };
    const members = campaignSettlements(state, 'camp-1');
    expect(members.map(s => s.settlement.name).sort()).toEqual(['Cloudmarsh', 'Stoneford']);
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
  test('resolves across the number/string id mix like the sibling scans', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [campaign('camp-1', [123])]; });

    expect(store.getState().getCampaignForSettlement(123)?.id).toBe('camp-1');
    expect(store.getState().getCampaignForSettlement('123')?.id).toBe('camp-1');
    expect(store.getState().getCampaignForSettlement('999')).toBeNull();
    expect(store.getState().getCampaignForSettlement(null)).toBeNull();
  });

  test('a campaign without settlementIds is skipped, not thrown on', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [{ id: 'camp-1', accessState: 'active' }]; });
    expect(store.getState().getCampaignForSettlement('save-a')).toBeNull();
  });
});
