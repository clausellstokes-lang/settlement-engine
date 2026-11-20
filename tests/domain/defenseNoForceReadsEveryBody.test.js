/**
 * R3-TABS, L0 (the chair's ruling, 2026-11-13): "NO FORCE" READS EVERY ARMED BODY. A town has no force only
 * when it holds no garrison, no militia (the household levy is one), no watch and no contracted company.
 * `defenseStateProse.js :: defenseThreatProse` read three buckets of the standing projection (walls, garrison,
 * militia), so a town whose force was its watch was "walls and nobody to put on them" on the Invasion row and
 * "long stretches … with nobody on them" on the Beasts row, beside its own watch on the force cards (the defence
 * lane's fourth read, classes A and B). The selector now reads all four from the projection it already held:
 * a contracted company stands with the paid professionals' pools. RE-KEYED BY R3-TABS-4 (the chair's ruling (c) of
 * 2026-11-14 on the fresh reader's F2: L0's note that "a watch stands with the townspeople's pools" WITHDRAWN): a
 * watch is not the townspeople in arms, so a town whose only force is its watch, walled or not, hears no
 * citizen-militia line and no no-force line, and its Invasion row is silent (tests/domain/defenseWatchIsNotTheLevy.test.js).
 *
 * RED-FIRST at 9e57f5023 (the line with point 48): on 884 births in the app's shape, 77 walled and 41 unwalled
 * watch-only towns changed on each row; the three towns below printed "nobody" / "no line and no force".
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { defenseThreatProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's 720 shape (SECOND-WAVE-CENSUS births.mjs): DEFAULT_CONFIG and the random dials. */
const birth = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
const textOf = (row) => (row && typeof row.sentence === 'string' ? row.sentence : null);
const NOBODY = /nobody (?:on them|to put on them|to stand on them|on it)|meet nobody|no line and no force|NO force|no organi[sz]ed defen[cs]e/i;

const WALLED = ['r2r-village-40', 'r2r-town-0', 'r2r-town-1'];
const UNWALLED = ['r2r-village-25', 'r2r-village-45', 'r2r-town-2'];
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...WALLED, ...UNWALLED]) {
    const s = birth(seed);
    TOWNS[seed] = { s, forces: standingDefenseForces(s), prose: defenseThreatProse(s, { seed, audience: 'dm', tierNoun: s.tier }) };
  }
}, 300000);

describe('the threat rows read every armed body as a force (L0)', () => {
  test('the premise: each town\'s only force is its watch', () => {
    const failures = collectSeedFailures([...WALLED, ...UNWALLED], (seed) => {
      const f = TOWNS[seed].forces;
      if (!f.watch.present || f.garrison.present || f.militia.present || f.mercenary.present) throw new Error(`forces ${JSON.stringify(f)}`);
      if (f.walls.present !== WALLED.includes(seed)) throw new Error('walls');
    });
    expectNoSeedFailures(failures, 'each planted town keeps only a watch');
  });
  test('a walled watch town: the Invasion row is silent (no townspeople in arms), and no row says it has no force', () => {
    const failures = collectSeedFailures(WALLED, (seed) => {
      const { prose } = TOWNS[seed];
      if (prose.invasion !== null) throw new Error(`invasion: ${textOf(prose.invasion)}`);
      for (const k of ['invasion', 'beasts']) {
        if (NOBODY.test(textOf(prose[k]) || '')) throw new Error(`${k}: ${textOf(prose[k])}`);
        if (/townspeople|townsfolk|household/i.test(textOf(prose[k]) || '')) throw new Error(`${k}: ${textOf(prose[k])}`);
      }
    });
    expectNoSeedFailures(failures, 'a watch is a force, not a levy');
  });
  test('an unwalled watch town: the Invasion row is silent, and the Beasts row never says it has no force', () => {
    const failures = collectSeedFailures(UNWALLED, (seed) => {
      const { prose } = TOWNS[seed];
      if (prose.invasion !== null) throw new Error(`invasion: ${textOf(prose.invasion)}`);
      if (NOBODY.test(textOf(prose.beasts) || '')) throw new Error(`beasts: ${textOf(prose.beasts)}`);
    });
    expectNoSeedFailures(failures, 'the cell the corpus did not write is silent');
  });
});
