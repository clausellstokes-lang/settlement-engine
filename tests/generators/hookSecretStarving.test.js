/**
 * tests/generators/hookSecretStarving.test.js — F3 FOOD-WORDS unit 4
 * (docs/SOAK_1000_RUNG1B_2026-11-04.md §2 coh:food-words, §5 F3): a person's secret says
 * "People are starving." only where the food record says the place goes hungry.
 *
 * The siege pool of stress secrets (src/data/stressInstitutionEffects.js :: under_siege) carries
 * "People are starving." in a stakes line. npcGenerator.js :: generateCrimeLevel drew it from the
 * stress alone, so soak1k-857 — a besieged metropolis whose record reads importDependent with
 * fifteen months of stores — printed it twice. The pool's starving lines are now gated on the
 * food record (domain/foodSurplus.js :: recordAllowsStarving, the rule the food-words
 * instrument reads too).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { CLAIMS_STARVING, recordAllowsStarving } from '../../src/domain/foodSurplus.js';

/** @param {any} s */
const starvingSecrets = (s) => (s.npcs || [])
  .map((/** @type {any} */ npc) => `${npc?.secret?.what || ''} ${npc?.secret?.stakes || ''}`)
  .filter((text) => CLAIMS_STARVING.test(text));

describe('the starving rule', () => {
  it('reads the food band: only deficit and famine starve; no record keeps the legacy pool', () => {
    expect(recordAllowsStarving({ band: 'famine' })).toBe(true);
    expect(recordAllowsStarving({ band: 'deficit' })).toBe(true);
    for (const band of ['importDependent', 'pressured', 'secure', 'surplus']) expect(recordAllowsStarving({ band })).toBe(false);
    expect(recordAllowsStarving(null)).toBe(true);
  });
});

describe('hook secrets on their seeds', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('soak1k-857: a besieged metropolis with fifteen months of stores has no one say people are starving', () => {
    const s = birth(857).settlement;
    const record = s.economicState.foodSecurity.foodRecord;
    expect(record.band).toBe('importDependent');
    expect(starvingSecrets(s)).toEqual([]);
  });
});
