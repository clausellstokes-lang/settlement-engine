import { describe, it, expect } from 'vitest';
import {
  isCorruptibleFlaw, corruptionVectorForFlaw, npcCorruptibleFlaw,
  spawnCorruptionChance, onsetHazard, exposureChance,
  demoteImportance, demoteDotRank, canBeOuted, CORRUPTION_TUNING,
  readCorruptionClimate,
} from '../../src/domain/corruption.js';

describe('corruption — eligibility + vectors', () => {
  it('recognizes corruptible flaws and rejects benign ones', () => {
    expect(isCorruptibleFlaw('greedy')).toBe(true);
    expect(isCorruptibleFlaw('Ambitious')).toBe(true); // case-insensitive
    expect(isCorruptibleFlaw('stoic')).toBe(false);
    expect(isCorruptibleFlaw('')).toBe(false);
    expect(isCorruptibleFlaw(undefined)).toBe(false);
  });

  it('maps flaws to corruption vectors', () => {
    expect(corruptionVectorForFlaw('greedy')).toBe('greed');
    expect(corruptionVectorForFlaw('ambitious')).toBe('hunger_for_status');
    expect(corruptionVectorForFlaw('cowardly')).toBe('fear');
    expect(corruptionVectorForFlaw('deceitful')).toBe('forbidden_patron');
    expect(corruptionVectorForFlaw('unmapped')).toBe('greed'); // default
  });

  it('reads the corruptible flaw off an NPC shape', () => {
    expect(npcCorruptibleFlaw({ personality: { flaw: 'greedy' } })).toBe('greedy');
    expect(npcCorruptibleFlaw({ flaw: 'Ambitious' })).toBe('ambitious');
    expect(npcCorruptibleFlaw({ personality: { flaw: 'kind' } })).toBeNull();
  });
});

describe('corruption — damped probability model', () => {
  it('spawn chance rises with crime, falls with security + prosperity, clamped', () => {
    const low = spawnCorruptionChance({ crime: 0.1, security: 0.9, prosperity: 0.9 });
    const high = spawnCorruptionChance({ crime: 0.9, security: 0.1, prosperity: 0.1 });
    expect(high).toBeGreaterThan(low);
    expect(low).toBeGreaterThanOrEqual(CORRUPTION_TUNING.spawn.min);
    expect(high).toBeLessThanOrEqual(CORRUPTION_TUNING.spawn.max);
  });

  it('per-tick onset hazard is smaller than the spawn chance under the same climate', () => {
    const climate = { crime: 0.6, security: 0.3, prosperity: 0.3 };
    expect(onsetHazard(climate)).toBeLessThan(spawnCorruptionChance(climate));
    expect(onsetHazard(climate)).toBeLessThanOrEqual(CORRUPTION_TUNING.onset.max);
  });

  it('exposure rises with security/prosperity/visibility, falls with guild strength (self-cleaning)', () => {
    const healthy = exposureChance({ security: 0.9, prosperity: 0.9, guildStrength: 0.0, visibility: 1 });
    const captured = exposureChance({ security: 0.2, prosperity: 0.2, guildStrength: 0.9, visibility: 0.3 });
    expect(healthy).toBeGreaterThan(captured);
    // a strong guild meaningfully suppresses exposure vs. an otherwise equal settlement
    const noGuild = exposureChance({ security: 0.6, prosperity: 0.6, guildStrength: 0.0, visibility: 0.5 });
    const bigGuild = exposureChance({ security: 0.6, prosperity: 0.6, guildStrength: 1.0, visibility: 0.5 });
    expect(noGuild).toBeGreaterThan(bigGuild);
  });

  it('prior exposures make re-corruption HARDER and re-exposure EASIER (the scar)', () => {
    const climate = { crime: 0.6, security: 0.3, prosperity: 0.3 };
    expect(onsetHazard({ ...climate, priorExposures: 2 })).toBeLessThan(onsetHazard(climate));
    expect(onsetHazard({ ...climate, priorExposures: 3 })).toBeLessThan(onsetHazard({ ...climate, priorExposures: 1 }));
    const exp = { security: 0.6, prosperity: 0.6, guildStrength: 0, visibility: 0.5 };
    expect(exposureChance({ ...exp, priorExposures: 2 })).toBeGreaterThan(exposureChance(exp));
  });

  it('all probabilities stay within [0,1] for extreme inputs', () => {
    for (const fn of [spawnCorruptionChance, onsetHazard]) {
      const p = fn({ crime: 5, security: -5, prosperity: -5 });
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
    const e = exposureChance({ security: 5, prosperity: 5, guildStrength: -5, visibility: 5 });
    expect(e).toBeGreaterThanOrEqual(0);
    expect(e).toBeLessThanOrEqual(1);
  });
});

describe('corruption — settlement climate adapter', () => {
  const withCrime = {
    institutions: [{ name: 'Thieves Guild' }, { name: 'Market' }],
    economicState: { prosperity: 'Poor', safetyProfile: { safetyRatio: 0.8, blackMarketCapture: 40, compound: { criminalEffective: 70 } } },
  };
  const clean = {
    institutions: [{ name: 'Market' }, { name: 'Temple' }],
    economicState: { prosperity: 'Prosperous', safetyProfile: { safetyRatio: 2.5, blackMarketCapture: 2, compound: { criminalEffective: 12 } } },
  };

  it('detects a criminal institution + names it', () => {
    const c = readCorruptionClimate(withCrime);
    expect(c.hasCriminalInst).toBe(true);
    expect(c.criminalInstitutions).toContain('Thieves Guild');
    expect(readCorruptionClimate(clean).hasCriminalInst).toBe(false);
  });

  it('normalizes crime/security/prosperity into 0..1', () => {
    const c = readCorruptionClimate(withCrime);
    expect(c.crime).toBeGreaterThan(0.5);   // criminalEffective 70 → 0.7
    expect(c.security).toBeLessThan(0.5);    // safetyRatio 0.8 → 0.32
    expect(c.prosperity).toBeLessThan(0.5);  // 'Poor'
    const h = readCorruptionClimate(clean);
    expect(h.crime).toBeLessThan(c.crime);
    expect(h.security).toBeGreaterThan(c.security);
    expect(h.prosperity).toBeGreaterThan(c.prosperity);
  });

  it('degrades gracefully on a bare/empty settlement', () => {
    const c = readCorruptionClimate({});
    expect(c.hasCriminalInst).toBe(false);
    expect(c.crime).toBeGreaterThanOrEqual(0);
    expect(c.prosperity).toBe(0.4); // unknown → middling
  });
});

describe('corruption — standing erosion', () => {
  it('demotes importance one step toward minor', () => {
    expect(demoteImportance('pillar')).toBe('key');
    expect(demoteImportance('key')).toBe('notable');
    expect(demoteImportance('notable')).toBe('minor');
    expect(demoteImportance('minor')).toBe('minor'); // floor
    expect(demoteImportance('???')).toBe('notable'); // unknown
  });

  it('demotes dotRank with a floor of 1', () => {
    expect(demoteDotRank(3)).toBe(2);
    expect(demoteDotRank(2)).toBe(1);
    expect(demoteDotRank(1)).toBe(1);
  });

  it('only notable-or-lower NPCs can be outed + replaced', () => {
    expect(canBeOuted('pillar')).toBe(false);
    expect(canBeOuted('key')).toBe(false);
    expect(canBeOuted('notable')).toBe(true);
    expect(canBeOuted('minor')).toBe(true);
  });
});
