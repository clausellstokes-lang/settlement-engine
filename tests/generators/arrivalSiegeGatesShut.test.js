/**
 * tests/generators/arrivalSiegeGatesShut.test.js — R2-CODE-A-10, the bar's HIGH row #35 (`narrativeData.js ::
 * STRESS_DESCS.under_siege`, the arrival's crisis vignette). bar0-city-under_siege+famine-rand-1: the Overview printed
 * "Agiospolis's gates are open but attended: every person entering is noted, every cart searched" while the record
 * holds a siege in force ("nothing comes in by road") and the Defense tab says the gates are shut and barred.
 * THE RULING (the chair's brief): under a siege in force no line says the gates stand open or that people and carts
 * come in by road. The pool prints ONLY under a siege (`under_siege` is first in `STRESS_PRIORITY`, and
 * `narrativeGenerator.js :: siegeInForce` is that stress), so every one of its lines is read under one. Two were false
 * there: [1] (the open gate, the searched carts) and [2] ("From the road, … looks ordinary … the way conversation
 * stops when strangers approach": the town ordinary from a road its besiegers hold, the gate a place of passing). Each
 * is cured by a twin true under the siege, in its own slot (no draw moves), with its siblings' conditions.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STRESS_DESCS } from '../../src/data/narrativeData.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { configOf, DIALS } from '../components/pageCensusWalk.shared.mjs';

/** The open gate and the road traffic a siege in force makes false. */
const OPEN_UNDER_SIEGE = /\bgates? (?:are|is|stands?) open\b|\bevery (?:person|one) entering\b|\bevery cart\b|\bfrom the road,? [^.]*\blooks ordinary\b|\bstrangers approach\b/i;

/** @param {string} seed */
const born = (seed) => {
  let m = seed.match(/^bar0-(\w+)-([a-z_+]+)-rand-\d+$/);
  if (m) return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
  m = seed.match(/^a10s-(\w+)-([a-z_+]+)-\d+$/);
  if (m) return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1], selectedStresses: m[2].split('+'), selectedStressesRandom: false }), null, { seed, customContent: {} }));
  m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:r2|q9)(?:r-(\w+)|s-([a-z_]+)-(\w+))-\d+$/));
  const row = m[1] ? { size: m[1], crisis: null } : { size: m[3], crisis: m[2] };
  return /** @type {any} */ (generateSettlementPipeline(/** @type {any} */ (configOf(row, DEFAULT_CONFIG, birthConfig)), null, { seed, customContent: {} }));
};

describe('under a siege in force the arrival keeps the gates shut', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('no line of the siege pool says the gates stand open or that people and carts come in by road', () => {
    const lines = STRESS_DESCS.under_siege.map((l) => textOf(l)('Q'));
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.filter((t) => OPEN_UNDER_SIEGE.test(t)), 'the siege pool').toEqual([]);
  });

  it("the reader's town and the towns that drew either line open on the gates shut (every row)", () => {
    expectNoSeedFailures(collectSeedFailures([
      'bar0-city-under_siege+famine-rand-1', 'r2s-under_siege-city-2', 'q9r-city-38', 'q9s-under_siege-metropolis-3',
      'a10s-metropolis-under_siege+famine-9', 'q9s-under_siege-city-0', 'a10s-city-under_siege+famine-4',
      'a10s-town-under_siege-1', 'a10s-metropolis-under_siege+occupied-5',
    ], (seed) => {
      const s = born(seed);
      const types = (Array.isArray(s.stress) ? s.stress : [s.stress]).map((/** @type {any} */ x) => x?.type);
      expect(types, `${seed}: a siege in force`).toContain('under_siege');
      expect(String(s.arrivalScene), `${seed}: the arrival opens on the town`).toContain(s.name);
      expect(String(s.arrivalScene), `${seed}: the gate is shut`).toMatch(/\bgates? (?:are )?shut\b|\bshut fast\b/i);
      expect(String(s.arrivalScene), `${seed}: no open gate, no traffic by road`).not.toMatch(OPEN_UNDER_SIEGE); // anchored: the two lines above assert this arrival names the town and its shut gate; red at 1869ac9b2 (9 of 9)
    }), 'under a siege in force the arrival keeps the gates shut');
  });

  it('the guard towns keep their own lines: a siege town that drew another line of the pool prints it as before', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['a10s-town-under_siege-4', /^The gates of .+? are closed\. There are people on the walls\./],
      ['r2s-under_siege-city-0', /^The approach to \S+ is quieter than it should be/],
      ['r2s-under_siege-thorp-0', /^There are campfires on the hill above /],
    ], ([seed, kept]) => {
      expect(String(born(seed).arrivalScene), `${seed}: its own line`).toMatch(kept);
    }), 'the guard towns keep their own lines');
  });
});
