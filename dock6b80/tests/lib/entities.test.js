/**
 * tests/lib/entities.test.js — Entity tag / id helper contract.
 *
 * These helpers are the long-term replacement for name-pattern matching
 * (`name.toLowerCase().includes('watch')` and friends) across the
 * codebase. Their behavior needs to be reliable enough that mechanics
 * can adopt them confidently.
 */

import { describe, it, expect } from 'vitest';
import {
  TAG, TAG_GROUPS,
  tagsOf, hasTag, hasAnyTag, hasAllTags,
  idOf,
  isEnforcement, isWelfareProvider, isTradeParticipant,
  isFoodSystem, isMagicSystem, isUnderground,
} from '../../src/lib/entities.js';

describe('tagsOf()', () => {
  it('returns the tag array on a tagged entity', () => {
    expect(tagsOf({ tags: ['a', 'b'] })).toEqual(['a', 'b']);
  });

  it('returns empty for untagged entities', () => {
    expect(tagsOf({})).toEqual([]);
    expect(tagsOf({ tags: null })).toEqual([]);
    expect(tagsOf({ tags: 'not-an-array' })).toEqual([]);
  });

  it('returns empty for nullish input', () => {
    expect(tagsOf(null)).toEqual([]);
    expect(tagsOf(undefined)).toEqual([]);
    expect(tagsOf('string')).toEqual([]);
  });
});

describe('hasTag()', () => {
  it('returns true when the tag is present', () => {
    expect(hasTag({ tags: [TAG.SECURITY, TAG.LAW] }, TAG.SECURITY)).toBe(true);
  });

  it('returns false when the tag is absent', () => {
    expect(hasTag({ tags: [TAG.SECURITY] }, TAG.RELIGIOUS)).toBe(false);
  });

  it('returns false for nullish entity / tag', () => {
    expect(hasTag(null, TAG.SECURITY)).toBe(false);
    expect(hasTag({ tags: [TAG.SECURITY] }, null)).toBe(false);
    expect(hasTag({ tags: [TAG.SECURITY] }, '')).toBe(false);
  });
});

describe('hasAnyTag() / hasAllTags()', () => {
  const watch = { tags: [TAG.SECURITY, TAG.LAW, TAG.PUBLIC_ORDER] };

  it('hasAnyTag is true when at least one tag matches', () => {
    expect(hasAnyTag(watch, [TAG.RELIGIOUS, TAG.LAW])).toBe(true);
    expect(hasAnyTag(watch, [TAG.ARCANE, TAG.MAGIC])).toBe(false);
  });

  it('hasAllTags requires every tag', () => {
    expect(hasAllTags(watch, [TAG.SECURITY, TAG.LAW])).toBe(true);
    expect(hasAllTags(watch, [TAG.SECURITY, TAG.ARCANE])).toBe(false);
  });

  it('empty group: hasAnyTag false, hasAllTags true', () => {
    expect(hasAnyTag(watch, [])).toBe(false);
    expect(hasAllTags(watch, [])).toBe(true);
  });
});

describe('idOf()', () => {
  it('returns the entity id when present', () => {
    expect(idOf({ id: 'institution.town_watch' })).toBe('institution.town_watch');
  });

  it('derives a stable id from the name when no id is present', () => {
    expect(idOf({ name: 'Town Watch' }, 'institution')).toBe('institution.town_watch');
  });

  it('derives the same id twice for the same name', () => {
    const a = idOf({ name: 'Old Market' }, 'institution');
    const b = idOf({ name: 'Old Market' }, 'institution');
    expect(a).toBe(b);
  });

  it('returns null for entities with neither id nor name', () => {
    expect(idOf({})).toBeNull();
    expect(idOf(null)).toBeNull();
  });

  it('defaults the prefix to "entity"', () => {
    expect(idOf({ name: 'Generic Thing' })).toBe('entity.generic_thing');
  });
});

describe('convenience queries', () => {
  it('isEnforcement matches any ENFORCEMENT-group tag', () => {
    expect(isEnforcement({ tags: [TAG.SECURITY] })).toBe(true);
    expect(isEnforcement({ tags: [TAG.MILITARY] })).toBe(true);
    expect(isEnforcement({ tags: [TAG.PUBLIC_ORDER] })).toBe(true);
    expect(isEnforcement({ tags: [TAG.RELIGIOUS] })).toBe(false);
  });

  it('isWelfareProvider matches welfare-group tags', () => {
    expect(isWelfareProvider({ tags: [TAG.WELFARE] })).toBe(true);
    expect(isWelfareProvider({ tags: [TAG.HEALING] })).toBe(true);
    expect(isWelfareProvider({ tags: [TAG.RELIGIOUS] })).toBe(true);
    expect(isWelfareProvider({ tags: [TAG.SECURITY] })).toBe(false);
  });

  it('isTradeParticipant matches trade-group tags', () => {
    expect(isTradeParticipant({ tags: [TAG.TRADE] })).toBe(true);
    expect(isTradeParticipant({ tags: [TAG.MARKET] })).toBe(true);
    expect(isTradeParticipant({ tags: [TAG.CRAFT] })).toBe(true);
  });

  it('isFoodSystem / isMagicSystem / isUnderground each check their groups', () => {
    expect(isFoodSystem({ tags: [TAG.FOOD] })).toBe(true);
    expect(isMagicSystem({ tags: [TAG.ARCANE] })).toBe(true);
    expect(isUnderground({ tags: [TAG.CRIMINAL] })).toBe(true);
  });
});

describe('TAG vocabulary integrity', () => {
  it('exposes the documented canonical groups', () => {
    expect(TAG_GROUPS.ENFORCEMENT).toContain(TAG.SECURITY);
    expect(TAG_GROUPS.WELFARE_PROVIDER).toContain(TAG.WELFARE);
    expect(TAG_GROUPS.TRADE_PARTICIPANT).toContain(TAG.TRADE);
    expect(TAG_GROUPS.FOOD_SYSTEM).toContain(TAG.FOOD);
    expect(TAG_GROUPS.MAGIC_SYSTEM).toContain(TAG.ARCANE);
    expect(TAG_GROUPS.UNDERGROUND).toContain(TAG.CRIMINAL);
  });

  it('every TAG value is a non-empty string', () => {
    for (const v of Object.values(TAG)) {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    }
  });
});
