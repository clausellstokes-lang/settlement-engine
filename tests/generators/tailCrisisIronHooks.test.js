/**
 * TAIL-CRISIS K9/K17 (READ-ALL 22079 22080 20908; the seat TAIL-CRISIS-3): THE PEACETIME IRON HOOKS NAME NO SMITHS, NO
 * FORGE AND NO IRON MERCHANTS (`generators/economy/foodBalance.js`, the three literals by the chair's exception, and their
 * keys in `generators/economy/outlookHookSiblings.js :: PEACE_IRON_HOOKS`). The hooks are stored on the record
 * (`economicViability.plotHooks`): the test reads the birth's own. One collected test on births of the census's own seeds (CENSUS-3
 * seedcfg.mjs, the r2r-/r2s- arms, copied): each FALSE pair is a (seed, words) the town printed at the base and must not
 * print now, with what prints in its place; each KEEP pair a true sibling that prints at both.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
    let cfg;
    if (m) cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
    else {
      m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
      if (!m) throw new Error(`no configuration for ${seed}`);
      cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    }
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 120000);

/** The stored outlook hooks of a birth, joined. @param {any} s */
const hooks = (s) => (s.economicViability?.plotHooks || []).map((h) => String(h?.hook ?? h ?? '')).join('\n');

/** [seed, words that must NOT print, what prints in their place] */
const FALSE = [
  // RE-KEYED BY IDENTITY (TAIL-CLOSE-TESTS-B, the crisis seat's answer): since 2ac50c55 (TAIL-DEFECON-3's declared move: an
  // iron hook prints only where the import list holds iron) r2r-hamlet-35 and r2r-hamlet-30 import only salt and incense, so no
  // iron hook prints there at all. The same two lines are read where they print: r2r-town-20 (the doubled line, iron ore
  // imported) and r2r-town-1 (the rations line, iron imported).
  ['r2r-town-20', 'The iron merchants have doubled their price this season, and the smiths', 'Iron has doubled in price this season, and tools are being mended with scrap.'], // 20908
  ['r2r-town-1', 'The smiths are rationing what they have', 'What iron there is goes out in rations, and work waits on mended tools.'], // 22079
  ['r2r-town-17', 'The smiths blame whoever set it', 'People blame whoever set it, and the tools still need mending.'], // 22080
  ['r2r-town-49', 'The iron merchants have doubled their price this season, and iron for tools', 'Iron has doubled in price this season, and metal for tools and repairs is hard to come by.'], // the twin, same fault
];

/** [seed, a true sibling that must still print] */
const KEEP = [
  ['r2r-town-26', 'The iron carts are three weeks late and the carters will not say why. Broken tools stay broken, and work waits.'], // the twin, unchanged
];

describe('TAIL-CRISIS K9/K17: the peacetime iron hooks name no smiths, forge or iron merchants', () => {
  it('no FALSE words print, and the reworded line prints in their place', () => {
    const failures = collectSeedFailures(FALSE, ([seed, gone, instead]) => {
      const text = hooks(birth(seed));
      expectAbsentWithAnchor(text, gone, instead, seed);
      expect(text, seed).toContain(instead);
    });
    expectNoSeedFailures(failures, 'each FALSE town prints no false words, and the reworded line in their place');
  }, 300000);
  it('every KEEP sibling still prints', () => {
    const failures = collectSeedFailures(KEEP, ([seed, kept]) => { expect(hooks(birth(seed)), seed).toContain(kept); });
    expectNoSeedFailures(failures, 'every KEEP sibling still prints');
  }, 300000);
});
