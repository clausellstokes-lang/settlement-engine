/**
 * densityPowerConservation.test.js — rung 1 N1 (docs/SOAK_1000_RUNG1_2026-11-04.md §2).
 *
 * With Register VII lit, the certification receipt failed in 940 of 1,000 settlements:
 * `conservationFindings` ("Faction power is not conserved at 100%") sums
 * `powerStructure.factions[].power` against 100, and the v2 seat resize
 * (`applyDensityLaw.js :: resizeSeats`) trimmed the unseated powers' shares and
 * minted each doubled niche's rival on top, so the roster totalled 20..102.
 * The cure is at the engine: the resize renormalises to exactly 100.
 *
 * Red-first: every case below failed at 90dc22f18 (soak1k-0 summed 71, soak1k-4 99,
 * soak1k-8 57).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { conservationFindings } from '../../src/generators/generationReceiptJudgments.js';
import { disperseNamedRoster, resizePoliticalRoster } from '../../src/generators/density/applyDensityLaw.js';
import { REGISTER_VII_DENSITY_LAW_VERSION } from '../../src/domain/density/densityLaw.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const total = factions => factions.reduce((sum, f) => sum + Number(f.power || 0), 0);

/** No strict order inverts: a seat strictly above another before the renormalisation
 *  is never strictly below it after. */
function expectNoInversion(before, after) {
  for (let i = 0; i < before.length; i += 1) {
    for (let j = 0; j < before.length; j += 1) {
      if (before[i] > before[j]) expect(after[i]).toBeGreaterThanOrEqual(after[j]);
    }
  }
}

describe('N1: under law v2 the dispersal leaves faction power conserved at 100', () => {
  const config = { _densityLawVersion: REGISTER_VII_DENSITY_LAW_VERSION };
  const roster = () => ({
    factions: [
      { faction: 'Grand Merchant Senate', category: 'government', power: 29, isGoverning: true },
      { faction: 'Merchant Guilds', category: 'economy', power: 22 },
      { faction: 'Military/Guard', category: 'military', power: 17 },
      { faction: 'Craft Guilds', category: 'economy', power: 12 },
      { faction: 'Arcane Orders', category: 'magic', power: 9 },
      { faction: 'Religious Authorities', category: 'religious', power: 7 },
      { faction: "Thieves' Guild", category: 'criminal', power: 4 },
    ],
  });
  const npcs = n => Array.from({ length: n }, (_, i) => ({ id: `npc-${i}`, name: `Figure ${i}`, role: 'Citizen' }));

  /** Resize then disperse, the assembly order; returns the roster both seams saw. */
  function birthSeams(tier, i) {
    const reconciled = roster();
    const { powerStructure } = resizePoliticalRoster({
      tier, config, powerStructure: reconciled, massOverride: 30, rng: createPRNG(`n1-${tier}-${i}`),
    });
    const resized = powerStructure.factions.map(f => ({ name: f.faction, power: f.power, contestsNiche: f.contestsNiche }));
    const dispersed = disperseNamedRoster({
      tier, config, powerStructure, npcs: npcs(30), rng: createPRNG(`n1-disperse-${tier}-${i}`),
    });
    return { reconciled, resized, powerStructure, dispersed };
  }

  it('the resized roster does not total 100; after the dispersal it totals exactly 100 in integers', () => {
    let resizedOff100 = 0;
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 12; i += 1) {
        const { resized, powerStructure, reconciled } = birthSeams(tier, i);
        if (total(resized) !== 100) resizedOff100 += 1;
        expect(total(powerStructure.factions)).toBe(100);
        for (const f of powerStructure.factions) expect(Number.isInteger(f.power)).toBe(true);
        // The seats and their order are the resize's.
        expect(powerStructure.factions.map(f => f.faction)).toEqual(resized.map(f => f.name));
        expect(reconciled.factions.length).toBe(7);
      }
    }
    expect(resizedOff100).toBeGreaterThan(0);
  });

  // The rungs and affiliations are unmoved on the corpus (seeds 0..119 against 90dc22f18:
  // the receipt in the unit's commit message); here, the order.
  it('no strict order among the resized seats inverts', () => {
    for (const tier of ['town', 'city', 'metropolis']) {
      for (let i = 0; i < 12; i += 1) {
        const { resized, powerStructure, dispersed } = birthSeams(tier, i);
        expect(dispersed.refused).toBeNull();
        expectNoInversion(resized.map(f => f.power), powerStructure.factions.map(f => f.power));
      }
    }
  });

  it('a v1 world is not touched: the same roster object and powers come back', () => {
    const powerStructure = { factions: [{ faction: 'Elder Council', category: 'government', power: 71, isGoverning: true }] };
    const out = disperseNamedRoster({
      tier: 'thorp', config: {}, powerStructure, npcs: npcs(2), rng: createPRNG('n1-v1'),
    });
    expect(out.plan).toBeNull();
    expect(powerStructure.factions[0].power).toBe(71);
  });
});

describe('N1: the soak seeds that failed at 90dc22f18 now conserve', () => {
  beforeAll(() => ensureLaws());
  for (const index of [0, 4, 8]) {
    it(`soak1k-${index}: faction power totals 100 and the receipt finds no conservation fault`, () => {
      const { settlement } = birth(index);
      expect(settlement.config._densityLawVersion).toBe(REGISTER_VII_DENSITY_LAW_VERSION);
      expect(total(settlement.powerStructure.factions)).toBe(100);
      expect(
        conservationFindings(settlement).filter(f => /Faction power/.test(JSON.stringify(f))),
      ).toEqual([]);
    }, 120_000);
  }
});

describe('N1 on every path: a v2 world regenerated with a HELD roster conserves faction power', () => {
  beforeAll(() => ensureLaws());
  for (const index of [0, 4, 8]) {
    it(`soak1k-${index}: held npcs regenerate with power totalling 100 and every held figure unmoved`, () => {
      const { settlement: born, config, seed } = birth(index);
      expect(born.config._densityLawVersion).toBe(REGISTER_VII_DENSITY_LAW_VERSION);
      // The runner's pins channel (the EM-R2/EM-R3 suites' instrument): the population
      // step's two record paths, held from the born world.
      const pins = structuredClone({ npcs: born.npcs, relationships: born.relationships });
      const regen = generateSettlementPipeline(config, null, { seed: `${seed}-regen`, pins });
      expect(total(regen.powerStructure.factions)).toBe(100);
      for (const f of regen.powerStructure.factions) expect(Number.isInteger(f.power)).toBe(true);
      const figure = n => [n.name, n.factionAffiliation, n.importance, n.densityRungRole];
      expect(regen.npcs.map(figure)).toEqual(born.npcs.map(figure));
    }, 120_000);
  }
});
