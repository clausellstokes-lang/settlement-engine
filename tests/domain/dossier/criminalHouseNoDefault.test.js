/**
 * criminalHouseNoDefault.test.js — COHERENCE-POWERS-7 (the cold list REVIEW-W2A-3, MEDIUM #636): A CRIMINAL HOUSE IS NOT
 * "UNDER THE RULING POWER". A house no power of its own kind stands behind answers, by default, to the seat
 * (domain/dossier/powerSupport.js :: houseBacksOf, X-45). For a criminal house that is false: where the town has a criminal
 * power the house lands on it; where it has none, the house works outside the seat's law, not under it. The Power tab
 * printed the smuggling network, the thieves' guild chapter, the front businesses and the black market under the ruling
 * Noble Governorship "with no power of its own kind here" (rw3-city-infiltrated-1, criminal capture "none"); the
 * Institutions tab printed each "backs" the ruler.
 *
 * Before the cure, at the lane's base 714381934: 197 towns of the census's 720 and the reviewer's 20 list 454 criminal
 * houses under the ruler by default. The default's share is 0, so no person's membership reads it: no record byte moves.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveFactionSupport, houseBacksOf, institutionBackers } from '../../../src/domain/dossier/powerSupport.js';
import { isCriminalInstitution } from '../../../src/domain/corruption.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';

/** The reviewer's seeds in the app's shape (render.rw3.jsx :: cfgFor). @param {string} seed */
function born(seed) {
  const m = seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
const DEFAULT_WORDS = 'Under the ruling power, with no power of its own kind here';

describe('COHERENCE-POWERS-7 · a criminal house is never under the ruling power by default', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-city-infiltrated-1 (#636): no criminal house stands under Noble Governorship; the ruler keeps its other default houses', () => {
    const s = born('rw3-city-infiltrated-1');
    const ruler = nameOf(governingFactionOf(s));
    expect(ruler).toBe('Noble Governorship');
    const under = deriveFactionSupport(s).get(ruler) || [];
    const criminal = under.filter((e) => e.why === DEFAULT_WORDS && isCriminalInstitution(e.institution)).map((e) => e.name);
    expect(criminal).toEqual([]);
    for (const name of ['Smuggling network', "Thieves' guild chapter", 'Front businesses']) {
      expect(s.institutions.some((i) => i.name === name), `premise: ${name} is on the roster`).toBe(true);
      expect(institutionBackers(s).get(name) || [], `${name} backs no one`).not.toContain(ruler);
    }
    expect(under.some((e) => e.why === DEFAULT_WORDS), 'a house of no power\'s kind still answers to the seat').toBe(true);
  }, 60_000);
  it.each(['rw3-city-calm-1', 'rw3-city-wartime-1', 'rw3-metropolis-calm-1', 'rw3-metropolis-politically_fractured-1'])(
    '%s: every criminal house lands on a criminal power or on no one, never the seat by default', (seed) => {
      const s = born(seed);
      for (const inst of s.institutions.filter((i) => isCriminalInstitution(i))) {
        expect((houseBacksOf(s).get(inst.name) || []).filter((b) => b.basis === 'default').map((b) => b.faction), inst.name).toEqual([]);
      }
    }, 60_000);
});
