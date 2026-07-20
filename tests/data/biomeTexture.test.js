/**
 * biomeTexture.test.js — VISION WAVE V-6 the texture corpus pins (pure, total, deterministic).
 */
import { describe, it, expect } from 'vitest';
import { BIOME_NAMES, biomeNameOf, TERRAIN_SEASON_TEXTURE, biomeSeasonTexture } from '../../src/data/biomeTexture.js';
import { TERRAIN_CLASSES } from '../../src/domain/spatial/spatialCost.js';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

describe('data/biomeTexture — the V-6 biome/season texture corpus', () => {
  it('BIOME_NAMES covers FMG ids 0..12; biomeNameOf is total', () => {
    expect(BIOME_NAMES.length).toBe(13);
    expect(biomeNameOf(10)).toBe('tundra');
    expect(biomeNameOf(4)).toBe('grassland');
    expect(biomeNameOf(null)).toBe('wilds');
    expect(biomeNameOf(999)).toBe('wilds');
    expect(biomeNameOf(2.5)).toBe('wilds');
  });

  it('every terrain class × season resolves to a non-empty line', () => {
    for (const t of TERRAIN_CLASSES) {
      for (const s of SEASONS) {
        const line = biomeSeasonTexture(t, s);
        expect(typeof line, `${t}/${s} is a string`).toBe('string');
        expect(line.length, `${t}/${s} non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('an unknown terrain folds to grassland; an unknown season to summer (total)', () => {
    expect(biomeSeasonTexture('nonsense', 'spring')).toBe(TERRAIN_SEASON_TEXTURE.grassland.spring);
    expect(biomeSeasonTexture('tundra', 'nonsense')).toBe(TERRAIN_SEASON_TEXTURE.tundra.summer);
  });

  it('no calamity vocabulary (the F24 register) leaks into the texture', () => {
    const banned = /flood|fire|quake|earthquake|storm/i;
    for (const t of Object.keys(TERRAIN_SEASON_TEXTURE)) {
      for (const s of SEASONS) {
        expect(banned.test(TERRAIN_SEASON_TEXTURE[t][s]), `${t}/${s} avoids calamity words`).toBe(false);
      }
    }
  });
});
