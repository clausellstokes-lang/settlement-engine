import { describe, test, expect } from 'vitest';

import { simulateCampaignWorldPulse, simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceCampaignWorld.js';
import { assertNowPinnedInTest } from '../../src/domain/clock.js';

/**
 * Proves the pin-`now` structural guard has teeth (audit finding: byte-equivalence
 * was CONVENTIONALLY dependent on every caller passing `now`, with no guardrail).
 * In a Node test run, a byte-equivalence-critical entry point called WITHOUT a pinned
 * `now` must throw rather than silently fall back to the wall clock (which would make
 * same-seed runs diverge byte-wise). Production stays a no-op. This is what keeps a
 * future caller from re-introducing non-reproducibility with a green suite.
 */
describe('pin-`now` guard fires on an unpinned byte-critical entry (test-only)', () => {
  const campaign = { id: 'c', settlementIds: [], worldState: { rngSeed: 's', tick: 0 } };

  test('assertNowPinnedInTest throws in NODE_ENV=test', () => {
    expect(() => assertNowPinnedInTest('someEntry')).toThrow(/pinned `now`|wallClockNow/);
  });

  test('simulateCampaignWorldPulse WITHOUT now throws', () => {
    expect(() => simulateCampaignWorldPulse({ campaign, saves: [], interval: 'one_week' }))
      .toThrow(/simulateCampaignWorldPulse fell back to wallClockNow/);
  });

  test('simulateCampaignWorldInterval WITHOUT now throws', async () => {
    await expect(simulateCampaignWorldInterval({ campaign, saves: [], interval: 'one_month' }))
      .rejects.toThrow(/simulateCampaignWorldInterval fell back to wallClockNow/);
  });

  test('WITH a pinned now, the guard is silent (does not throw for the now-reason)', () => {
    // It may still no-op or return early for an empty campaign, but it must NOT throw
    // the pin-`now` error when now is provided.
    let threwPinNow = false;
    try {
      simulateCampaignWorldPulse({ campaign, saves: [], interval: 'one_week', now: '2026-01-01T00:00:00.000Z' });
    } catch (e) {
      if (/fell back to wallClockNow/.test(String(e && e.message))) threwPinNow = true;
    }
    expect(threwPinNow).toBe(false);
  });
});
