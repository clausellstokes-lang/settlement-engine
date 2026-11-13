/**
 * THE GAPS THE CENSUS OF SCALE FOUND (UPKEEP-CAPACITY C2 to C6; the chair's rulings G1 to G5 on
 * docs/chair/2026-11-13/UPKEEP-CAPACITY-MEASURE.md, section 5 and "C2 to C6"). Each is a house read as a job it
 * does not do, or not read as a job it does; each is cured on every home that reads the house, and each move of the
 * rating it brings is declared in that file with its counts.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defencePartsOf } from '../../src/generators/defenseGenerator.js';
import { getInstFlags } from '../../src/generators/helpers.js';
import { keepOfRecord } from '../../src/domain/facts/keep.js';
import { partitionDefenseInstitutions } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {Record<string, any>} */
const births = {};
const KEYS = ['cold-city-227', 'fresh6-metropolis-30'];

/** @param {string} key */
const bear = (key) => {
  const m = /^[a-z0-9]+-(?:([a-z_]+)-)?(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(key);
  if (!m) throw new Error(key);
  const cfg = m[1]
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[2] });
  return generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
};

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const key of KEYS) births[key] = bear(key);
}, 120000);

/** @param {any} s */
const partsOf = (s) => defencePartsOf(s, keepOfRecord(s.economicState));
/** @param {any} s @param {string} id */
const partOf = (s, id) => partsOf(s).find((p) => p.id === id) ?? null;
/** @param {any} s @param {(name: string) => boolean} out the same record with those houses taken out */
const without = (s, out) => ({ ...s, institutions: s.institutions.filter((i) => !out(String(i.name))) });

describe('G1 (C2): the professional city watch is the watch only, on every home', () => {
  const WATCH = { name: 'Professional city watch' };
  test('RED-FIRST: the defence bucket, the roster flags and the facts home read it as the watch and not as a garrison', () => {
    const buckets = partitionDefenseInstitutions([WATCH]);
    expect(buckets.watch).toEqual([WATCH]);
    expect(buckets.garrison).toEqual([]);
    const { inst } = getInstFlags({}, [WATCH]);
    expect(inst.hasWatch).toBe(true);
    expect(inst.hasGarrison).toBe(false);
    const facts = defenseFactsOf({ institutions: [WATCH] });
    expect(facts.hasWatch).toBe(true);
    expect(facts.hasGarrison).toBe(false);
    expect(facts.hasCommander).toBe(false);
    expect(facts.forceName).toBe('Professional city watch');
  });

  test('RED-FIRST: a city holding the watch alone (its garrison houses taken out) has a watch part and no garrison part', () => {
    for (const key of KEYS) {
      const s = births[key];
      expect(s.institutions.some((i) => i.name === 'Professional city watch'), key).toBe(true);
      const alone = without(s, (n) => /garrison|barracks|professional guard/i.test(n));
      expect(partOf(alone, 'watch'), key).not.toBeNull();
      expect(partOf(alone, 'garrison'), key).toBeNull();
    }
  });

  test('the stored force cards: the garrison bucket of a born city holds its garrison houses and not its watch', () => {
    for (const key of KEYS) {
      const g = births[key].defenseProfile.institutions;
      const anchor = key.includes('metropolis') ? 'Multiple garrisons' : 'Garrison';
      expectAbsentWithAnchor(g.garrison.map((i) => i.name), 'Professional city watch', anchor, key);
      expect(g.watch.map((i) => i.name), key).toContain('Professional city watch');
    }
  });
});
