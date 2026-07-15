/**
 * tests/store/canCreateCampaignGate.test.js — Store cluster finding #5.
 *
 * createCampaign is a premium (or elevated) feature. The gate is a CLIENT
 * predicate: saved_maps RLS enforces row ownership but NOT tier, so a true
 * server backstop is flagged for the main loop. Until it lands this predicate is
 * the only barrier, so it must FAIL CLOSED — a missing / still-loading auth is
 * not premium — and be shared by every creation entry point (createCampaign +
 * importGalleryMap) so the two can't drift.
 *
 * These tests pin the hardened predicate + that createCampaign refuses a
 * non-entitled caller (returns null, seeds nothing).
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createCampaignSlice, canCreateCampaign } from '../../src/store/campaignSlice.js';

const stub = () => ({
  auth: { tier: 'free', role: null, loading: false, user: { id: 'u1' } },
  campaigns: [],
  campaignsLoaded: true,
});

function makeStore(authOverride) {
  const store = create(immer((...a) => ({ ...stub(...a), ...createCampaignSlice(...a) })));
  if (authOverride !== undefined) store.setState({ auth: authOverride });
  return store;
}

describe('canCreateCampaign — fails closed (finding #5)', () => {
  test('premium tier passes', () => {
    expect(canCreateCampaign({ auth: { tier: 'premium' } })).toBe(true);
  });

  test('developer / admin roles pass regardless of tier', () => {
    expect(canCreateCampaign({ auth: { tier: 'free', role: 'developer' } })).toBe(true);
    expect(canCreateCampaign({ auth: { tier: 'free', role: 'admin' } })).toBe(true);
  });

  test('free tier is refused', () => {
    expect(canCreateCampaign({ auth: { tier: 'free', role: null } })).toBe(false);
  });

  test('missing / loading / undefined auth fails closed (never premium)', () => {
    expect(canCreateCampaign({})).toBe(false);
    expect(canCreateCampaign({ auth: undefined })).toBe(false);
    expect(canCreateCampaign({ auth: { loading: true } })).toBe(false);
    expect(canCreateCampaign(undefined)).toBe(false);
  });
});

describe('createCampaign enforces the gate (finding #5)', () => {
  test('a free account cannot create a campaign — returns null, seeds nothing', () => {
    const store = makeStore({ tier: 'free', role: null, user: { id: 'u1' } });
    const id = store.getState().createCampaign('My Realm');
    expect(id).toBeNull();
    expect(store.getState().campaigns).toHaveLength(0);
  });

  test('a premium account creates a campaign', () => {
    const store = makeStore({ tier: 'premium', role: null, user: { id: 'u1' } });
    const id = store.getState().createCampaign('My Realm');
    expect(id).toBeTruthy();
    expect(store.getState().campaigns).toHaveLength(1);
    expect(store.getState().campaigns[0].name).toBe('My Realm');
  });
});
