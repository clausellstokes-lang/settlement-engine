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
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2s-wartime-thorp-2 -> r2s-wartime-thorp-3, a besieged-route thorp of
  // the same crisis where the broker is refused and its twin prints on the slot
  ['r2s-wartime-thorp-3', /routes you have never travelled/, /A broker sits in the shade, matching buyers to whatever the neighbours have to spare/],
  ['r2r-thorp-48', /records every cartload/, /A clerk records every sack and basket that comes in from the fields/],
  ['r2s-politically_fractured-town-2', /fill the carts waiting on the road out/, /Bolts of cloth and bales of wool are stacked in the shops, and none of it is going anywhere/], // BAR6-SCENES (2026-11-16, LAW 6 rule 6b; re-keyed by identity): the twin reworded
  ['r2r-village-47', /herbs and spices fill the carts/, /A doorway here and there sells remedies/], // BAR6-SCENES (2026-11-16, LAW 6 rule 6b; re-keyed by identity): an isolated village with no spice made, sold or brought in: the spice sacks' twin holds the slot
  ['r2r-thorp-4', /a master's mark/, /An errand-runner hurries past, a household's mark stitched on his sleeve/],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-3 -> r2r-thorp-55, a thorp keeping no horse whose slot prints the twin
  ['r2r-thorp-55', /Horse traders/, /Herders show their animals at the edge of the settlement/],
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2r-thorp-57 -> r2r-hamlet-33, a hamlet (the twin's `tier: ≤ hamlet`) whose slot prints the twin
  ['r2r-hamlet-33', /A moneylender sits at a low table/, /An old woman sits at a low table by her door/],
];
/** [seed, the true sibling that must still print] */
const KEEP = [
  // BAR3-CLOSE-DOORS-1 (2026-11-15, the close of the round BAR3): r2r-thorp-43 -> r2s-monster_pressure-city-0, the KEEP's
  // address re-taken: lane BAR3-PLACES batch 1 refuses the broker where no market stands (r2r-thorp-43 holds none: its table of
  // books), and the line prints in the census's market towns; the address is the branch's own KEEP town for this line
  // (`bar3PlacesRows.test.js`, "H1: the broker of far goods where a market stands"). The line and the arm are unchanged.
  // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35; the arrival pools APPENDED, so the draw moved): r2s-monster_pressure-city-0 -> r2r-metropolis-62, a market town (the
  // line's `market`) with a road open; bar3PlacesRows.test.js's H1 KEEP takes the same address
  ['r2r-metropolis-62', /A broker sits in the shade, matching buyers to goods from routes you have never travelled/],
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
      expect(s, key).toMatch(/** @type {RegExp} */ (instead));
      // anchored: the same text is shown directly above to print what stands on the slot instead
      expect(s, key).not.toMatch(/** @type {RegExp} */ (gone));
    }), 'the false arrival lines');
  }, 600_000);

  test('KEEP: each declared line still prints where the town holds its fact', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map(([seed], i) => `${i}|${seed}`), (key) => {
      const [i, seed] = key.split('|');
      expect(scene(String(seed)), key).toMatch(/** @type {RegExp} */ (KEEP[Number(i)][1]));
    }), 'the true siblings');
  }, 300_000);
});
