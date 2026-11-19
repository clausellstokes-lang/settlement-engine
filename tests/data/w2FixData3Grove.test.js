/**
 * W2-FIX-DATA-3 item 4 (REVIEW-W2-FIX-DATA F4): the Elder Grove Council named "the city" in a town.
 * The council stands at town, city and metropolis, and all three of its descriptions were written with
 * a literal "the city"; two variants were declared `tier: ≥ city` for that word, so a town fell back to
 * the canonical text, which says "the city" too (11 town councils of the census's 720, e.g. r2r-town-1).
 * The corpus's own voice for a size noun is "the town", which the draw speaks in the place's noun
 * (`stateProseKernel.js :: speakTierNoun` over every drawn description in `assembleInstitutions`): the
 * two variants are written in it. The catalogue text is ALSO printed raw, by a pass that adds the house
 * after the draw (a metropolis printed "the town" when it was written in that voice), so it names no
 * size at all. Red until the three texts are written so.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';
import { drawInstitutionDesc } from '../../src/generators/steps/institutionDescDraw.js';
import { birthFactsOf } from '../../src/domain/facts/factsOf.js';
import { speakTierNoun } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** Every text the site prints for the council at this tier over 300 seeds, spoken in the tier's noun. */
const printed = (/** @type {string} */ tier) => {
  const key = `${tier}|Religious|Elder Grove Council`;
  const pool = [/** @type {any} */ (institutionalCatalog)[tier].Religious['Elder Grove Council'].desc, ...(INSTITUTION_DESC_VARIANTS[key] || [])];
  const facts = () => birthFactsOf({ institutions: [{ name: 'Elder Grove Council' }], config: {}, tier }, { portKind: 'none' });
  const out = new Set();
  for (let n = 0; n < 300; n++) out.add(speakTierNoun(String(drawInstitutionDesc(pool, `w2fd3g${n}:Elder Grove Council`, facts, key)), tierNounFor(tier)));
  return [...out];
};

describe('W2-FIX-DATA-3: the Elder Grove Council speaks the place by its own size', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('a council names no size but its own, drawn at any tier; its catalogue text names none', () => {
    for (const [tier, own, other] of /** @type {const} */ ([['town', /\bthe town\b/, /\bcity\b|\bmetropolis\b/], ['city', /\bthe city\b/, /\btown\b|\bmetropolis\b/], ['metropolis', /\bthe metropolis\b/, /\btown\b|\bcity\b/]])) {
      const texts = printed(tier);
      expect(texts.length, tier).toBe(3);
      expect(texts.some((t) => own.test(t)), tier).toBe(true);
      expect(texts.filter((t) => other.test(t)), tier).toEqual([]);
      const catalogue = String(/** @type {any} */ (institutionalCatalog)[tier].Religious['Elder Grove Council'].desc);
      expect(texts, tier).toContain(catalogue);
      expect([catalogue].filter((t) => /\btown\b|\bcity\b|\bmetropolis\b|\burban\b/.test(t)), tier).toEqual([]);
    }
  });

  test('a census town with the council names no city (r2r-town-1)', () => {
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'town' }), null, { seed: 'r2r-town-1', customContent: {} });
    const council = town.institutions.find((/** @type {any} */ i) => i.name === 'Elder Grove Council');
    expect(council, 'the town has its council').toBeTruthy();
    expect(council.desc).toMatch(/druids/);
    expect([council.desc].filter((t) => /\bcity\b|\bmetropolis\b/.test(t))).toEqual([]);
  }, 120_000);
});
