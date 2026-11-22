/** @vitest-environment jsdom */
/**
 * crashForensics.test.js — R-14: the store-side reproduction-coordinate reader.
 *
 * buildCrashForensics reads ONLY scalars off the live state — a seed string, a
 * tick integer, flag names — so world state never even enters the forensics path
 * (the errorReporter whitelist is the second wall). These pins prove the reader
 * extracts the right coordinates and returns a fixed three-scalar shape even when
 * the state carries a full worldState + NPCs + user PII.
 */
import { describe, expect, it } from 'vitest';
import { buildCrashForensics } from '../../src/lib/crashForensics.js';

describe('buildCrashForensics', () => {
  it('reads seed (rngSeed) + tick from the active campaign and the on-flags', () => {
    const state = {
      activeCampaignId: 'c1',
      campaigns: [{ id: 'c1', worldState: { rngSeed: 'byte-seed-42', tick: 208, npcs: [{ name: 'x' }] } }],
    };
    const f = buildCrashForensics(state);
    expect(f.seed).toBe('byte-seed-42');
    expect(f.tick).toBe(208);
    expect(Array.isArray(f.flags_on)).toBe(true);
    // flags_on is names only, sorted, all strings.
    expect(f.flags_on.every((n) => typeof n === 'string')).toBe(true);
    expect([...f.flags_on]).toEqual([...f.flags_on].sort());
  });

  it('returns EXACTLY { seed, tick, flags_on } even when the state is fat with world/PII', () => {
    const state = {
      activeCampaignId: 'c1',
      lastSeed: 'fallback-seed',
      auth: { user: { id: 'auth-uuid', email: 'p@example.com' } },
      campaigns: [{
        id: 'c1',
        worldState: { rngSeed: 's', tick: 3, npcs: [{ name: 'Reeve', secret: 'covert' }], settlements: [{ population: 9999 }] },
      }],
      savedSettlements: [{ settlement: { name: "Kelder's Reach" } }],
    };
    const f = buildCrashForensics(state);
    expect(Object.keys(f).sort()).toEqual(['flags_on', 'seed', 'tick']);
    // No nested world/PII object anywhere in the returned value.
    const wire = JSON.stringify(f);
    for (const leak of ['npcs', 'covert', 'population', 'Kelder', 'p@example.com', 'auth-uuid']) {
      expect(wire).not.toContain(leak);
    }
  });

  it('falls back to lastSeed, then map.seed; honest null when no seed exists', () => {
    expect(buildCrashForensics({ lastSeed: 'gen-seed' }).seed).toBe('gen-seed');
    expect(buildCrashForensics({
      activeCampaignId: 'c1',
      campaigns: [{ id: 'c1', map: { seed: 'map-seed' } }],
    }).seed).toBe('map-seed');
    const none = buildCrashForensics({});
    expect(none.seed).toBeNull();
    expect(none.tick).toBeNull();
  });

  it('never throws on a malformed / partial state', () => {
    expect(() => buildCrashForensics(null)).not.toThrow();
    expect(() => buildCrashForensics(undefined)).not.toThrow();
    expect(() => buildCrashForensics({ campaigns: 'not-an-array', activeCampaignId: 'z' })).not.toThrow();
    expect(buildCrashForensics(null)).toEqual({ seed: null, tick: null, flags_on: expect.any(Array) });
  });
});
