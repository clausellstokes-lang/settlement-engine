/**
 * patronageStyledTitle.test.js — COHERENCE-POWERS-8 (R2's one home on a second surface): the Power tab's patronage rows
 * (domain/people/patronage.js :: dmPowerViewOf, read by the web panel and the PDF's view model) printed a woman lord as
 * "Grainne Shaughnessy, the lord (Noble Families) · brings protection and decisions" beside a card styled "Lady". The
 * face's title reads the one home of the styled title (data/faceHonorifics.js :: styledTitleOf). Display only.
 * Counted on the census's 720 rendered at this lane's tip: 10 such Power-tab rows; 0 after. Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { dmPowerViewOf } from '../../../src/domain/people/patronage.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
/** Every object in a view that names a person, with its title. @param {unknown} v @param {any[]} out */
function faces(v, out = []) {
  if (Array.isArray(v)) v.forEach((x) => faces(x, out));
  else if (v && typeof v === 'object') { const o = /** @type {any} */ (v); if (typeof o.name === 'string' && 'title' in o) out.push(o); Object.values(o).forEach((x) => faces(x, out)); }
  return out;
}

describe('COHERENCE-POWERS-8 · the patronage rows read the styled title', () => {
  it('r2r-city-19: Grainne Shaughnessy, the lord of Noble Families, is "the lady" on the Power tab\'s rows', async () => {
    await loadGenerationLawPayloads();
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'city' }), null, { seed: 'r2r-city-19', customContent: {} }));
    const hers = faces(dmPowerViewOf(s)).filter((f) => f.name === 'Grainne Shaughnessy');
    expect(hers.length).toBeGreaterThan(0);
    for (const f of hers) expect(f.title).toBe('the lady');
    for (const f of faces(dmPowerViewOf(s))) {
      const card = s.npcs.find((/** @type {any} */ c) => c.name === f.name);
      if (card?.gender === 'male' && card.title === 'the lord') expect(f.title).toBe('the lord');
    }
  }, 60000);
});
