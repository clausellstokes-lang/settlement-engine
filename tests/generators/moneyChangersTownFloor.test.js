// X-46 car 2, 3a — THE RECORDED EXCEPTION to the design's move-not-lower rule (chair's ruling on
// the X46-2 hand-back, ODQ §934.104, vetoable by the owner). 'Money changers' (town) carried a
// 3,000+ floor, above the owner's town band (300–2,500), so it could never roll in a town. It is
// the Letters of Credit chain's only town processor and a live key in ten name-keyed tables, and
// a city row would add a draw (THE PROMISE), so the row stays a town row and its floor moves to
// the band's top fifth: 2,000. This proves the row is LIVE at the top of the band and stays shut
// below its floor.
import { describe, expect, it } from 'vitest';
import { institutionRowGuardsPass, institutionRowGuards } from '../../src/data/institutionalCatalog.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const ROW = 'Money changers';

describe('X-46 3a exception: Money changers is a live town row from 2,000 people', () => {
  it('the floor sits inside the town band (2,000, the top fifth of 300–2,500)', () => {
    expect(institutionRowGuards('town', ROW)?.minPopulation).toBe(2000);
    expect(2000).toBeLessThanOrEqual(POPULATION_RANGES.town.max);
  });

  it('the guard opens for a 2,400-person town and shuts for a 1,999-person one', () => {
    expect(institutionRowGuardsPass('town', ROW, { population: 2400 })).toBe(true);
    expect(institutionRowGuardsPass('town', ROW, { population: 2000 })).toBe(true);
    expect(institutionRowGuardsPass('town', ROW, { population: 1999 })).toBe(false);
  });

  it('over 120 town seeds it rolls at least once at 2,000+ and never below 2,000', () => {
    let topOfBand = 0;
    let rolledTop = 0;
    const below = [];
    for (let i = 0; i < 120; i += 1) {
      const seed = `tier-inertia-town-${i}`;
      const s = generateSettlementPipeline({ settType: 'town' }, null, { seed, customContent: {} });
      const has = (s.institutions || []).some(inst => inst.name === ROW);
      if (s.population >= 2000) { topOfBand += 1; if (has) rolledTop += 1; }
      else if (has) below.push(`${seed} (${s.population})`);
    }
    expect(topOfBand, 'the corpus reaches the top of the band (non-vacuous)').toBeGreaterThan(0);
    expect(rolledTop).toBeGreaterThan(0);
    expect(below).toEqual([]);
  });
});
