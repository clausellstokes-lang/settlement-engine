/**
 * TAIL-HISTORY-3 batch 4 (2026-11-15; the chair's ruling Y14, the arrival pool's measure): each line of
 * `src/data/arrivalProse.js` that names a house, a trade or a good, read against the towns that print it. Seven were
 * false somewhere: goods from far routes, every cartload and the carts on the road out where no route reaches (the
 * broker 3 of 13, the clerk 1 of 20, the cloth 1 of 22, the herbs 2 of 12); a master's mark where no smith and no guild
 * stands (13 of 23); horse traders where no horse is kept (13 of 21); a moneylender with a queue in a thorp or a hamlet
 * (12 of 23). The file's form: a declaration (`route: isolated`, `tier: ≥ village`) with its declared twin (`twinOf`:
 * the twin keeps the slot and spends no redraw, so no later beat of the scene moves), or a reword without the noun.
 *
 * THIS FILE REDS WHEN a cured line prints again in a town that makes it false (each with what prints instead), or when
 * a true sibling of a declared line stops printing where the town holds its fact (each KEEP).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

const scene = (/** @type {string} */ seed) => String(bornCensus(seed).arrivalScene || '');

/** [seed, the false words, what prints instead on the same slot (a reword, or the declared line's twin)] */
const MUST_NOT = [
  ['r2r-thorp-9', /routes you have never travelled/, /A broker sits in the shade, matching buyers to whatever the neighbours have to spare/],
  ['r2s-wartime-thorp-2', /routes you have never travelled/, /A broker sits in the shade, matching buyers to whatever the neighbours have to spare/],
  ['r2r-thorp-48', /records every cartload/, /A clerk records every sack and basket that comes in from the fields/],
  ['r2s-politically_fractured-town-2', /fill the carts waiting on the road out/, /Bolts of cloth and bales of wool are stacked high in the workshops/],
  ['r2r-village-47', /herbs and spices fill the carts/, /Sacks of herbs and spices stand open in the doorways/],
  ['r2r-thorp-4', /a master's mark/, /An errand-runner hurries past, a household's mark stitched on his sleeve/],
  ['r2r-thorp-3', /Horse traders/, /Herders show their animals at the edge of the settlement/],
  ['r2r-thorp-57', /A moneylender sits at a low table/, /An old woman sits at a low table by her door/],
];
/** [seed, the true sibling that must still print] */
const KEEP = [
  ['r2r-thorp-43', /A broker sits in the shade, matching buyers to goods from routes you have never travelled/],
  ['r2r-thorp-47', /A clerk records every cartload that passes in a careful ledger/],
  ['r2r-town-0', /Bolts of cloth and bales of wool fill the carts waiting on the road out/],
  ['r2r-village-40', /A moneylender sits at a low table with a queue of familiar faces waiting/],
];

describe('TAIL-HISTORY batch 4 (Y14): an arrival line names only a house, a trade or a good the town holds', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('MUST NOT: the cured lines leave the towns that make them false; the reword or the twin prints instead', () => {
    expectNoSeedFailures(collectSeedFailures(MUST_NOT.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      const [, gone, instead] = MUST_NOT[Number(i)];
      const s = scene(String(seed));
      expect(s, key).not.toMatch(/** @type {RegExp} */ (gone));
      expect(s, key).toMatch(/** @type {RegExp} */ (instead));
    }), 'the false arrival lines');
  }, 600_000);

  test('KEEP: each declared line still prints where the town holds its fact', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      expect(scene(String(seed)), key).toMatch(/** @type {RegExp} */ (KEEP[Number(i)][1]));
    }), 'the true siblings');
  }, 300_000);
});
