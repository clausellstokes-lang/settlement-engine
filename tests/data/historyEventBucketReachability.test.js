/**
 * historyEventBucketReachability.test.js — content:noble-bucket-reachable.
 *
 * getUpgradeOpportunities (economicGenerator.js) walks HISTORY_EVENTS bucket by
 * bucket and only surfaces a bucket's roles when SOME institution carries that
 * bucket key on one of the two classification axes:
 *
 *     institutions.some(i => i.priorityCategory === key || i.category?.toLowerCase() === key)
 *
 * (the catch-all 'other' bucket is exempt — it is always reached). A bucket key
 * that no institution can ever carry on either axis is DEAD: its roles never
 * surface for any settlement. That is exactly how HISTORY_EVENTS.noble rotted —
 * no catalog entry uses 'noble' on either axis, and the closed-set governance
 * pin (categoryVocabulary.js + categoryGovernance.test.js) forbids adding one,
 * so the bucket was remapped into the reachable 'government' bucket.
 *
 * This pin asserts EVERY HISTORY_EVENTS category bucket is reachable through the
 * SAME OR-chain the runtime uses, so an unreachable bucket (a new key nothing
 * carries, or a re-introduced 'noble') can never silently regress in.
 */
import { describe, expect, test } from 'vitest';
import { HISTORY_EVENTS } from '../../src/data/historyData.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

// HISTORY_EVENTS is keyed only by faction-category buckets (government,
// religious, noble→merged, crafts, military, economy, criminal, magic, other).
// Each value is an array of role records. Tier-keyed data lives in AGE_BY_TIER,
// not here — but guard anyway: a bucket is any key whose value is an array.
const bucketKeys = Object.entries(HISTORY_EVENTS)
  .filter(([, v]) => Array.isArray(v))
  .map(([k]) => k);

// The reachable axis-value set, computed EXACTLY as getUpgradeOpportunities'
// matcher reads it: an institution contributes its priorityCategory (lowercase,
// as authored) and its grouping lowercased (the i.category?.toLowerCase() clause
// — institution.category is set from the catalog's TitleCase grouping key).
const reachableAxisValues = (() => {
  const reachable = new Set();
  for (const groups of Object.values(institutionalCatalog)) {
    for (const [grouping, insts] of Object.entries(groups)) {
      for (const entry of Object.values(insts)) {
        if (entry?.priorityCategory) reachable.add(entry.priorityCategory);
        reachable.add(grouping.toLowerCase());
      }
    }
  }
  return reachable;
})();

// Mirror getUpgradeOpportunities' bucket gate: 'other' is the always-reached
// catch-all; every other bucket needs a carrier on one of the two axes.
const bucketIsReachable = (key) => key === 'other' || reachableAxisValues.has(key);

describe('content:noble-bucket-reachable — every HISTORY_EVENTS bucket is reachable', () => {
  test('every faction-category bucket is reachable via some institution axis', () => {
    const dead = bucketKeys.filter((k) => !bucketIsReachable(k));
    expect(
      dead,
      `unreachable HISTORY_EVENTS buckets (no institution carries the key on priorityCategory OR category): ${JSON.stringify(dead)} — merge the bucket into a reachable category, or tag an institution (subject to the categoryVocabulary closed-set pin)`,
    ).toEqual([]);
  });

  test("the former 'noble' bucket was merged, not re-introduced", () => {
    // 'noble' is not a member of either closed-set axis (categoryVocabulary.js),
    // so re-adding the key would resurrect the dead-bucket bug.
    expect(bucketKeys).not.toContain('noble');
    expect(reachableAxisValues.has('noble')).toBe(false);
  });

  test("the merged noble/feudal leadership roles now live in the reachable 'government' bucket", () => {
    const govRoles = new Set((HISTORY_EVENTS.government || []).map((r) => r.role));
    for (const role of [
      'Lord/Lady of the Manor',
      'Baron/Baroness',
      'Court Advisor',
      'House Steward',
      'Noble Heir',
      'Land Agent',
      'Knight/Dame',
      'Duke/Duchess',
      'Royal Chamberlain',
    ]) {
      expect(govRoles.has(role), `expected merged noble role "${role}" in government bucket`).toBe(true);
    }
    expect(bucketIsReachable('government')).toBe(true);
  });

  test('pin is not vacuous (buckets and axis values are actually populated)', () => {
    expect(bucketKeys.length).toBeGreaterThanOrEqual(8);
    expect(reachableAxisValues.size).toBeGreaterThanOrEqual(10);
    // Every bucket holds at least one role record with a role + minTier.
    for (const key of bucketKeys) {
      expect(HISTORY_EVENTS[key].length).toBeGreaterThan(0);
      for (const role of HISTORY_EVENTS[key]) {
        expect(typeof role.role).toBe('string');
        expect(typeof role.minTier).toBe('string');
      }
    }
  });
});
