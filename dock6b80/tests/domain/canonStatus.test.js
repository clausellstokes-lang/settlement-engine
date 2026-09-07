/**
 * tests/domain/canonStatus.test.js — Tier 5.3 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  CANON_SOURCES,
  CANON_STATUSES,
  tagEntityCanon,
  tagEntityList,
  canonBreakdown,
  supportedCanonSources,
  supportedCanonStatuses,
} from '../../src/domain/canonStatus.js';

describe('catalogs', () => {
  it('exposes 4 sources and 4 statuses', () => {
    expect(CANON_SOURCES).toEqual(['generated', 'user', 'event', 'ai_overlay']);
    expect(CANON_STATUSES).toEqual(['draft', 'canon', 'optional', 'superseded']);
    expect(supportedCanonSources()).toEqual([...CANON_SOURCES]);
    expect(supportedCanonStatuses()).toEqual([...CANON_STATUSES]);
  });
});

describe('tagEntityCanon()', () => {
  it('returns the canonical tag shape', () => {
    const tag = tagEntityCanon({ name: 'X' });
    expect(tag).toHaveProperty('source');
    expect(tag).toHaveProperty('canonStatus');
    expect(tag).toHaveProperty('locked');
  });

  it('defaults to generated/draft/unlocked', () => {
    const tag = tagEntityCanon({ name: 'X' });
    expect(tag.source).toBe('generated');
    expect(tag.canonStatus).toBe('draft');
    expect(tag.locked).toBe(false);
  });

  it('honors explicit source + canonStatus', () => {
    const tag = tagEntityCanon({ source: 'user', canonStatus: 'canon' });
    expect(tag.source).toBe('user');
    expect(tag.canonStatus).toBe('canon');
    expect(tag.locked).toBe(true);   // user-canon defaults to locked
  });

  it('infers user from _authored=true', () => {
    expect(tagEntityCanon({ _authored: true }).source).toBe('user');
  });

  it('infers event from appliedAt timestamp', () => {
    expect(tagEntityCanon({ appliedAt: '2026-05-19T00:00:00Z' }).source).toBe('event');
  });

  it('infers ai_overlay from _aiPolished=true', () => {
    expect(tagEntityCanon({ _aiPolished: true }).source).toBe('ai_overlay');
  });

  it('locked=true on input forces locked=true', () => {
    expect(tagEntityCanon({ locked: true }).locked).toBe(true);
  });

  it('superseded entities get superseded status', () => {
    expect(tagEntityCanon({ superseded: true }).canonStatus).toBe('superseded');
  });

  it('returns generated/draft for nullish input', () => {
    const tag = tagEntityCanon(null);
    expect(tag.source).toBe('generated');
    expect(tag.canonStatus).toBe('draft');
  });
});

describe('tagEntityList()', () => {
  it('tags every entity in a list', () => {
    const tagged = tagEntityList([
      { name: 'gen' },
      { name: 'user', _authored: true },
      { name: 'event', appliedAt: '2026-05-19T00:00:00Z' },
    ]);
    expect(tagged).toHaveLength(3);
    expect(tagged[0].source).toBe('generated');
    expect(tagged[1].source).toBe('user');
    expect(tagged[2].source).toBe('event');
  });

  it('returns [] for non-array input', () => {
    expect(tagEntityList(null)).toEqual([]);
  });
});

describe('canonBreakdown()', () => {
  it('counts entities across institutions / factions / npcs / conditions / eventLog', () => {
    const s = {
      institutions: [
        { name: 'Granary' },
        { name: 'User Hall', _authored: true },
      ],
      powerStructure: { factions: [{ faction: 'Council' }] },
      npcs: [{ name: 'Captain Rusk' }],
      activeConditions: [{ archetype: 'plague' }],
      eventLog: [{ event: { type: 'DAMAGE_INSTITUTION' }, appliedAt: '2026-05-19' }],
    };
    const b = canonBreakdown(s);
    expect(b.total).toBe(6);
    expect(b.bySource.generated).toBeGreaterThan(0);
    expect(b.bySource.user).toBe(1);
    expect(b.bySource.event).toBe(1);
  });

  it('returns zeros for nullish settlement', () => {
    const b = canonBreakdown(null);
    expect(b.total).toBe(0);
  });
});

describe('purity', () => {
  it('does not mutate the input entity', () => {
    const e = { name: 'X', source: 'user', canonStatus: 'canon' };
    const before = JSON.stringify(e);
    tagEntityCanon(e);
    expect(JSON.stringify(e)).toBe(before);
  });
});
