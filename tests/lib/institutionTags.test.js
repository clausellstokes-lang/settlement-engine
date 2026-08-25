/**
 * tests/lib/institutionTags.test.js — P2.1 foundation.
 *
 * institutionTags / institutionHasTag must reliably resolve an institution's
 * canonical tags from EITHER its declared `tags` OR a name-keyword backfill —
 * including custom/legacy institutions that carry no tags at all. This is the
 * prerequisite that lets the scattered `name.includes(...)` mechanics migrate to
 * tag dispatch without silently breaking when a tag is absent.
 */

import { describe, it, expect } from 'vitest';
import {
  institutionTags, institutionHasTag, institutionHasAnyTag, tagsOf, TAG, TAG_GROUPS,
} from '../../src/lib/entities.js';

describe('institutionTags — declared ∪ keyword backfill', () => {
  it('keeps declared tags authoritative (first)', () => {
    const inst = { name: 'Town Granary', tags: ['food', 'storage'] };
    const tags = institutionTags(inst);
    expect(tags.slice(0, 2)).toEqual(['food', 'storage']);
  });

  it('backfills tags from the name when none are declared', () => {
    expect(institutionTags({ name: 'Town Watch' })).toContain(TAG.SECURITY);
    expect(institutionTags({ name: 'Grand Cathedral' })).toContain(TAG.RELIGIOUS);
    expect(institutionTags({ name: 'Watermill' })).toContain(TAG.FOOD);
    expect(institutionTags({ name: "Thieves' Den" })).toContain(TAG.CRIMINAL);
    expect(institutionTags({ name: 'Mage College' })).toContain(TAG.ARCANE);
  });

  it('resolves a CUSTOM institution with a weird name + no tags', () => {
    // The exact case name-matching handles poorly and tag-only dispatch misses.
    const custom = { name: 'The Drowned Sentinel Barracks', isCustom: true };
    expect(institutionHasTag(custom, TAG.MILITARY)).toBe(true);
    expect(institutionHasTag(custom, TAG.SECURITY)).toBe(true);
  });

  it('does not invent tags for an unrecognizable name', () => {
    expect(institutionTags({ name: 'The Quiet Place' })).toEqual([]);
  });

  it('accepts a bare string (name only)', () => {
    expect(institutionHasTag('Riverside Market', TAG.MARKET)).toBe(true);
  });

  it('unions declared + backfilled without duplicates', () => {
    const inst = { name: 'Temple of Light', tags: [TAG.RELIGIOUS] };
    const tags = institutionTags(inst);
    expect(tags.filter((t) => t === TAG.RELIGIOUS)).toHaveLength(1);
    expect(tags).toContain(TAG.WELFARE); // backfilled from "temple"
  });
});

describe('institutionHasTag / institutionHasAnyTag', () => {
  it('institutionHasAnyTag matches a TAG_GROUP', () => {
    expect(institutionHasAnyTag({ name: 'City Watch' }, TAG_GROUPS.ENFORCEMENT)).toBe(true);
    expect(institutionHasAnyTag({ name: 'Bakery' }, TAG_GROUPS.FOOD_SYSTEM)).toBe(true);
    expect(institutionHasAnyTag({ name: 'The Quiet Place' }, TAG_GROUPS.ENFORCEMENT)).toBe(false);
  });

  it('returns false for empty/garbage input', () => {
    expect(institutionHasTag(null, TAG.FOOD)).toBe(false);
    expect(institutionHasTag({ name: 'Mill' }, '')).toBe(false);
  });

  it('does not change the pure tagsOf (no backfill there)', () => {
    // tagsOf stays declared-only so the shared hasTag contract is unchanged.
    expect(tagsOf({ name: 'Town Watch' })).toEqual([]);
  });
});
