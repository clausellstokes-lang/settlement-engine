/**
 * F1 DEFENCE-WORDS, UNIT 3 — THE CATALOGUE BELOW TOWN (soak 1000 rung 1B; PLACE-NOT-TIER unit 5:
 * "a village may raise a watch" needs a watch row in the village catalogue).
 *
 * The Village watch is a rolled village row, never required, weighted by the military slider
 * like every defence row (`institutionProbability.js :: getBaseChance`), and the one defence
 * reader (`defenseFacts.js :: defenseFactsOf`) reads it as a watch, so a watch village keeps its
 * Guard Captain. The hamlet's militia row already stands (the `Citizen militia` hamlet rung).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { cellFor, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { birthConfig } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { getBaseChance } from '../../src/generators/institutionProbability.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';

/** @param {string} tier @returns {any} */
const watchRowAt = (tier) => /** @type {any} */ (institutionalCatalog)[tier]?.Defense?.['Village watch'];

describe('the Village watch row', () => {
  it('stands in the village catalogue only, rolled and never required', () => {
    const row = watchRowAt('village');
    expect(row).toBeTruthy();
    expect(row.required).not.toBe(true);
    expect(row.baseChance).toBeGreaterThan(0);
    for (const tier of ['thorp', 'hamlet', 'town', 'city', 'metropolis']) expect(watchRowAt(tier)).toBeUndefined();
  });

  it('is weighted by the military slider ×slider/50', () => {
    const at = (/** @type {number} */ m) => getBaseChance(0.2, 'Defense', 'Village watch', { priorityMilitary: m, priorityEconomy: 50, priorityReligion: 50, priorityCriminal: 50, priorityMagic: 50 }, null);
    expect([at(0), at(50), at(100)]).toEqual([0, 0.2, 0.4]);
  });

  it('reads as a watch on the defence record', () => {
    const f = defenseFactsOf({ institutions: [{ name: 'Village watch' }] });
    expect([f.hasWatch, f.hasGarrison, f.hasMilitia]).toEqual([true, false, false]);
  });
});

describe('a village at slider 100 that raises a watch (f1u3-village-100-6)', () => {
  /** @type {any} */ let s;
  beforeAll(async () => {
    await ensureLaws();
    const cell = cellFor(6 * 6 + 2);
    s = generateSettlementPipeline(birthConfig({ ...cell.input, settType: 'village', priorityMilitary: 100 }), null, { seed: 'f1u3-village-100-6' });
  });

  it('holds the Village watch and a Guard Captain to lead it', () => {
    expect(s.institutions.map((/** @type {any} */ i) => i.name)).toContain('Village watch');
    expect(defenseFactsOf(s).hasWatch).toBe(true);
    expect(s.npcs.map((/** @type {any} */ n) => n.role)).toContain('Guard Captain');
  });
});
