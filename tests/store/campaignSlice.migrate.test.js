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
const { uuidFromLegacyId, isUuid } = await import('../../src/store/campaignSliceShared.js');

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

// SB1 store-lifecycle — the legacy-id remint must be DETERMINISTIC. loadCampaigns
// runs migrateCampaign SEPARATELY over the local cache and the remote list; a random
// newCampaignId() gave the same legacy campaign two different UUIDs, so
// mergeCampaignLists (keyed by id) could not dedupe them and yielded a duplicate row.
describe('migrateCampaign — deterministic legacy-id remint (SB1 dedupe fix)', () => {
  it('a non-UUID id remints to a valid UUID', () => {
    const out = migrateCampaign({ id: 'legacy-camp-42' });
    expect(out.id).not.toBe('legacy-camp-42');
    expect(isUuid(out.id)).toBe(true);
  });

  it('the SAME legacy id remints to the SAME UUID (local + remote copies converge)', () => {
    expect(migrateCampaign({ id: 'legacy-camp-42' }).id).toBe(migrateCampaign({ id: 'legacy-camp-42' }).id);
  });

  it('DIFFERENT legacy ids remint to DIFFERENT UUIDs', () => {
    expect(migrateCampaign({ id: 'legacy-a' }).id).not.toBe(migrateCampaign({ id: 'legacy-b' }).id);
  });

  it('a UUID id is left untouched (no remint churns identity)', () => {
    const uuid = '11111111-1111-4111-8111-111111111111';
    expect(migrateCampaign({ id: uuid }).id).toBe(uuid);
  });

  it('an empty/missing id keeps a RANDOM mint (distinct id-less campaigns never collapse)', () => {
    const a = migrateCampaign({ name: 'A' }).id;
    const b = migrateCampaign({ name: 'B' }).id;
    expect(isUuid(a)).toBe(true);
    expect(isUuid(b)).toBe(true);
    expect(a).not.toBe(b);
  });

  it('uuidFromLegacyId is pure and isUuid-valid', () => {
    expect(uuidFromLegacyId('legacy-x')).toBe(uuidFromLegacyId('legacy-x'));
    expect(isUuid(uuidFromLegacyId('legacy-x'))).toBe(true);
    expect(isUuid(uuidFromLegacyId('another-id'))).toBe(true);
  });
});
