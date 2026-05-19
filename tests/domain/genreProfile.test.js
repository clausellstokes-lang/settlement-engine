/**
 * tests/domain/genreProfile.test.js — Tier 4.15 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  CANONICAL_GENRES,
  deriveGenreProfile,
  supportedGenres,
  genreTemplate,
  summarizeGenre,
} from '../../src/domain/genreProfile.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('catalog', () => {
  it('exposes 10 canonical genres', () => {
    expect(CANONICAL_GENRES).toEqual([
      'low_magic', 'grimdark', 'heroic', 'weird', 'cozy',
      'frontier', 'gothic', 'political', 'sword_and_sorcery', 'mythic_high',
    ]);
    expect(Object.isFrozen(CANONICAL_GENRES)).toBe(true);
    expect(supportedGenres()).toEqual([...CANONICAL_GENRES]);
  });

  it('every canonical genre has a template', () => {
    for (const g of CANONICAL_GENRES) {
      const t = genreTemplate(g);
      expect(t, g).toBeTruthy();
      expect(Array.isArray(t.institutionEmphasis)).toBe(true);
      expect(Array.isArray(t.threatTypeBias)).toBe(true);
    }
  });
});

describe('deriveGenreProfile()', () => {
  it('returns the neutral profile for nullish settlement', () => {
    const p = deriveGenreProfile(null);
    expect(p.genre).toBeNull();
    expect(p.magicBias).toBe('neutral');
  });

  it('falls back to neutral template for unknown genre', () => {
    const p = deriveGenreProfile({ config: { genre: 'pizza_punk' } });
    expect(p.genre).toBe('pizza_punk');
    expect(p.contributors.some(c => c.effect === 'unknown')).toBe(true);
  });

  it('normalizes genre slugs (case + spaces)', () => {
    const p = deriveGenreProfile({ config: { genre: 'Sword and Sorcery' } });
    expect(p.genre).toBe('sword_and_sorcery');
  });

  it('returns canonical shape for a known genre', () => {
    const p = deriveGenreProfile({ config: { genre: 'grimdark' } });
    expect(p.genre).toBe('grimdark');
    expect(p.violenceLevel).toBe('brutal');
    expect(p.magicBias).toBe('dampen');
    expect(p.hookStyle).toBe('noir');
    expect(p.threatTypeBias.length).toBeGreaterThan(0);
  });
});

// ── Per-genre directions ───────────────────────────────────────────────

describe('genre-specific direction checks', () => {
  it('cozy: minimal violence, gentle hooks, no major threats', () => {
    const p = deriveGenreProfile({ config: { genre: 'cozy' } });
    expect(p.violenceLevel).toBe('minimal');
    expect(p.hookStyle).toBe('gentle');
  });

  it('mythic_high: amplifies magic, pervasive weirdness, mythic hooks', () => {
    const p = deriveGenreProfile({ config: { genre: 'mythic_high' } });
    expect(p.magicBias).toBe('amplify');
    expect(p.weirdnessTolerance).toBe('pervasive');
    expect(p.hookStyle).toBe('mythic');
  });

  it('low_magic: dampens magic, low weirdness', () => {
    const p = deriveGenreProfile({ config: { genre: 'low_magic' } });
    expect(p.magicBias).toBe('dampen');
    expect(p.weirdnessTolerance).toBe('low');
  });

  it('political: emphasizes civic institutions, biases toward corruption threats', () => {
    const p = deriveGenreProfile({ config: { genre: 'political' } });
    expect(p.institutionEmphasis).toContain('civic');
    expect(p.threatTypeBias).toContain('corruption');
  });

  it('frontier: biases toward monster + bandit threats', () => {
    const p = deriveGenreProfile({ config: { genre: 'frontier' } });
    expect(p.threatTypeBias).toContain('monster_pressure');
    expect(p.threatTypeBias).toContain('bandit_raids');
  });
});

// ── Diagnostics + purity + smoke ───────────────────────────────────────

describe('summarizeGenre()', () => {
  it('emits 5 lines for any genre', () => {
    const lines = summarizeGenre({ config: { genre: 'heroic' } });
    expect(lines).toHaveLength(5);
  });
});

describe('purity + smoke', () => {
  it('does not mutate the input settlement', () => {
    const s = { config: { genre: 'grimdark' } };
    const before = JSON.stringify(s);
    deriveGenreProfile(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real settlement without throwing', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'genre-real-city', customContent: {} },
    );
    const p = deriveGenreProfile(settlement);
    expect(p).toBeTruthy();
    expect(['amplify', 'neutral', 'dampen']).toContain(p.magicBias);
  });
});
