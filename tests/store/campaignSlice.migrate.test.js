/**
 * campaignSlice.migrate.test.js — correctness-1 regression pin.
 *
 * migrateCampaign is the single load chokepoint applied to every campaign
 * entering the store (both the local cache and the remote fetch). It must
 * normalize settlementIds to an array so SettlementsPanel — which iterates
 * c.settlementIds unconditionally (assignedIds useMemo + the campaign-folder
 * map) — can never white-screen on a legacy / partial campaign that lacks it.
 */
import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    const data = new Map();
    globalThis.localStorage = {
      getItem: (k) => data.get(String(k)) ?? null,
      setItem: (k, v) => { data.set(String(k), String(v)); },
      removeItem: (k) => { data.delete(String(k)); },
      clear: () => data.clear(),
    };
  }
});

const { migrateCampaign } = await import('../../src/store/campaignSlice.js');

describe('migrateCampaign — settlementIds normalization (correctness-1)', () => {
  it('a campaign missing settlementIds gains an empty array (never undefined)', () => {
    const out = migrateCampaign({ name: 'Realm' });
    expect(Array.isArray(out.settlementIds)).toBe(true);
    expect(out.settlementIds).toEqual([]);
  });

  it('an existing settlementIds array is preserved verbatim', () => {
    const out = migrateCampaign({ settlementIds: ['s1', 's2'] });
    expect(out.settlementIds).toEqual(['s1', 's2']);
  });

  it('a non-array settlementIds is coerced to []', () => {
    expect(migrateCampaign({ settlementIds: 'oops' }).settlementIds).toEqual([]);
    expect(migrateCampaign({ settlementIds: null }).settlementIds).toEqual([]);
  });

  it('a nullish campaign passes through untouched (no throw)', () => {
    expect(migrateCampaign(null)).toBeNull();
    expect(migrateCampaign(undefined)).toBeUndefined();
  });
});
