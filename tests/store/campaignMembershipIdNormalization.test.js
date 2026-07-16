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

// BLOCKED ON OWNER (master merge W6 — recorded, not dropped silently): master
// String()-normalizes the id compare in campaignSettlements and
// getCampaignForSettlement, so number/string-mismatched member ids resolve.
// Porting that CHANGES SIM MEMBERSHIP — previously-dropped mismatched members
// would join every world-pulse advance — so it is on the master-merge owner
// decision queue ("campaign membership id normalization"). The two
// normalization tests were removed from this file until the owner rules; the
// crash-guard tests below (missing settlementIds must not throw) pin the SAFE
// half, which is landed.
describe('campaignSettlements — id normalization', () => {
  test('missing settlementIds yields no members (no throw)', () => {
    const state = {
      campaigns: [{ id: 'camp-1', accessState: 'active' }],
      savedSettlements: [{ id: 'save-a' }],
    };
    expect(campaignSettlements(state, 'camp-1')).toEqual([]);
  });
});

describe('getCampaignForSettlement — crash-guard (normalization half is owner-gated, see above)', () => {
  test('a campaign without settlementIds is skipped, not thrown on', () => {
    const store = makeStore();
    store.setState(s => { s.campaigns = [{ id: 'camp-1', accessState: 'active' }]; });
    expect(store.getState().getCampaignForSettlement('save-a')).toBeNull();
  });
});
