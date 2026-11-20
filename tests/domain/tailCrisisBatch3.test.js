/**
 * TAIL-CRISIS batch 3 (READ-ALL, 2026-11-14; the seat TAIL-CRISIS-2): THE CAST HOOK SAYS ITS REASON OF THE HOLDER, AND A POWER
 * BY ITS PROSE FORM (`domain/crisis/crisisHooks.js :: castSentenceOf, holderWords, loserClause`). One collected test on
 * births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r-/r2s- arms, copied): each FALSE pair is a (seed, words)
 * the town printed at 9c07f7461 and must not print now, with what prints in its place; each KEEP pair a true sibling.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { crisisHooksOf } from '../../src/domain/crisis/crisisHooks.js';
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

/** @param {any} s */
const hooks = (s) => [].concat(s.stress || []).filter(Boolean).flatMap((e) => crisisHooksOf(s, e).map((h) => h.text)).join(' ');

/** [seed, words that must NOT print, what prints in their place] (READ-ALL row ids) */
const FALSE = [
  ['r2s-indebted-thorp-1', 'come to terms: holds the seat.', 'Eir Ragnarsson of the Household Council, who holds the seat, is the one who would come to terms.'], // 11595
  ['r2s-recently_betrayed-thorp-2', 'Household Council: holds the seat', 'of the Household Council, who holds the seat, and the right to it is already in dispute.'], // 11549
  ['r2s-slave_revolt-thorp-3', 'Household Council: holds the seat', 'of the Household Council, who holds the seat, and the right to it is already in dispute.'], // 11671
  ['r2s-religious_conversion-thorp-3', 'Household Council: holds the seat', 'of the Household Council, who holds the seat, and the right to it is already in dispute.'], // 11569
  ['r2s-slave_revolt-thorp-2', 'Elder Council: holds the seat', 'of the Elder Council, who holds the seat, and the right to it is already in dispute.'], // 11668
  ['r2s-indebted-city-2', 'come to terms: holds the seat.', 'of the City Council, who holds the seat, is the one who would come to terms.'], // B11049
  ['r2r-thorp-22', 'Elder Council: holds the seat', 'it is aimed at Akna Balam of the Elder Council, who holds the seat, and the right to it is already in dispute.'], // B11090
  ['r2r-hamlet-35', 'of The Independent Bloc, who already carries more weight', 'of the Independent Bloc, whose power already carries more weight than whoever holds the seat, and gains as the seat weakens, is stirring it.'], // batch 3's inheritor read: the power's standing, not the person's
  ['r2s-insurgency-town-0', 'Military/Guard loses most', 'if it gives way, the Guard loses most, because the danger lands first on those it arms.'], // 20875; FRAME-7 · SR1 (the pin moves): the loss said by its matched system (defense_readiness)
];

/** [seed, a true sibling that must still print] */
const KEEP = [
  ['r2r-thorp-5', 'holds the key to it: nobody here could, so this one stepped in for the crisis.'], // a clause reason keeps its colon
  ['r2r-thorp-1', "the occupier's orders come through Lepidus Brutus of the Occupation Authority."], // a clause that says its reason
];

describe('TAIL-CRISIS batch 3: the cast hook says its reason of the holder', () => {
  it('no FALSE words print, and the line the record bears prints in their place', () => {
    const failures = collectSeedFailures(FALSE, ([seed, gone, instead]) => {
      const text = hooks(birth(seed));
      expectAbsentWithAnchor(text, gone, instead, seed);
    });
    expectNoSeedFailures(failures, 'a FALSE phrase printed, or the line in its place did not');
  }, 300000);
  it('every KEEP sibling still prints', () => {
    const failures = collectSeedFailures(KEEP, ([seed, kept]) => {
      expect(hooks(birth(seed)), seed).toContain(kept);
    });
    expectNoSeedFailures(failures, 'a KEEP sibling no longer prints');
  }, 300000);
});
