import { describe, it, expect } from 'vitest';
import {
  CONTENT_GROUP_KEYS,
  CRITICALITY_KEYS,
  ECONOMIC_WEIGHT_KEYS,
  TIER_ORDER,
  normalizeTags,
  effectiveTags,
  isMagical,
  isCriminal,
  passesTierGate,
} from '../../src/domain/customContentSchema.js';

describe('customContentSchema taxonomies', () => {
  it('exposes stable key lists', () => {
    expect(CONTENT_GROUP_KEYS).toContain('government');
    expect(CONTENT_GROUP_KEYS).toContain('criminal');
    expect(CRITICALITY_KEYS).toEqual(['critical', 'important', 'discretionary']);
    expect(ECONOMIC_WEIGHT_KEYS).toContain('backbone');
    expect(TIER_ORDER[0]).toBe('thorp');
    expect(TIER_ORDER[TIER_ORDER.length - 1]).toBe('metropolis');
  });
});

describe('normalizeTags', () => {
  it('parses comma strings and arrays to clean lowercase tags', () => {
    expect(normalizeTags('Civic, Legal , ESSENTIAL')).toEqual(['civic', 'legal', 'essential']);
    expect(normalizeTags(['A', ' b '])).toEqual(['a', 'b']);
    expect(normalizeTags(null)).toEqual([]);
    expect(normalizeTags('')).toEqual([]);
  });
});

describe('effectiveTags / isMagical / isCriminal', () => {
  it('folds the magical/criminal toggles into the tag set', () => {
    const e = { tags: 'sacred', magical: true, criminal: true };
    const tags = effectiveTags(e);
    expect(tags).toContain('sacred');
    expect(tags).toContain('magical');
    expect(tags).toContain('criminal');
  });

  it('reads either the boolean toggle or a tag', () => {
    expect(isMagical({ magical: true })).toBe(true);
    expect(isMagical({ tags: 'arcane, magical' })).toBe(true);
    expect(isMagical({ tags: 'civic' })).toBe(false);
    expect(isCriminal({ criminal: true })).toBe(true);
    expect(isCriminal({ tags: 'criminal' })).toBe(true);
    expect(isCriminal({})).toBe(false);
  });

  it('does not duplicate a tag already present', () => {
    expect(effectiveTags({ tags: 'magical', magical: true }).filter((t) => t === 'magical')).toHaveLength(1);
  });
});

describe('passesTierGate', () => {
  it('passes when there is no gate or no tier', () => {
    expect(passesTierGate({}, 'village')).toBe(true);
    expect(passesTierGate({ tierMin: 'city' }, null)).toBe(true);
  });

  it('enforces an inclusive minimum tier', () => {
    expect(passesTierGate({ tierMin: 'town' }, 'village')).toBe(false);
    expect(passesTierGate({ tierMin: 'town' }, 'town')).toBe(true);
    expect(passesTierGate({ tierMin: 'town' }, 'city')).toBe(true);
  });

  it('enforces an inclusive maximum tier', () => {
    expect(passesTierGate({ tierMax: 'village' }, 'town')).toBe(false);
    expect(passesTierGate({ tierMax: 'village' }, 'village')).toBe(true);
  });

  it('supports a min+max band', () => {
    const e = { tierMin: 'village', tierMax: 'city' };
    expect(passesTierGate(e, 'hamlet')).toBe(false);
    expect(passesTierGate(e, 'town')).toBe(true);
    expect(passesTierGate(e, 'metropolis')).toBe(false);
  });

  it('fails open on an unknown tier value', () => {
    expect(passesTierGate({ tierMin: 'town' }, 'megacity')).toBe(true);
  });
});
