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
import { DEFENCE_TUNING } from '../../src/data/defenceWeights.js';
import { partitionDefenseInstitutions } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {Record<string, any>} */
const births = {};
const KEYS = ['cold-city-227', 'fresh6-metropolis-30', 'cold-thorp-191', 'fresh6-thorp-52', 'cold-thorp-16', 'cold-hamlet-123', 'cold-thorp-20'];
const CITIES = ['cold-city-227', 'fresh6-metropolis-30'];

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
    for (const key of CITIES) {
      const s = births[key];
      expect(s.institutions.some((i) => i.name === 'Professional city watch'), key).toBe(true);
      const alone = without(s, (n) => /garrison|barracks|professional guard/i.test(n));
      expect(partOf(alone, 'watch'), key).not.toBeNull();
      expect(partOf(alone, 'garrison'), key).toBeNull();
    }
  });

  test('the stored force cards: the garrison bucket of a born city holds its garrison houses and not its watch', () => {
    for (const key of CITIES) {
      const g = births[key].defenseProfile.institutions;
      const anchor = key.includes('metropolis') ? 'Multiple garrisons' : 'Garrison';
      expectAbsentWithAnchor(g.garrison.map((i) => i.name), 'Professional city watch', anchor, key);
      expect(g.watch.map((i) => i.name), key).toContain('Professional city watch');
    }
  });
});

describe('G2 (C3): the household levy is the militia, at its ladder\'s least rung', () => {
  test('RED-FIRST: the roster flags read the levy as a militia, as the defence bucket and the facts home already do', () => {
    const LEVY = { name: 'Household levy' };
    expect(getInstFlags({}, [LEVY]).inst.hasMilitia).toBe(true);
    expect(partitionDefenseInstitutions([LEVY]).militia).toEqual([LEVY]);
    expect(defenseFactsOf({ institutions: [LEVY] }).hasMilitia).toBe(true);
  });

  test('RED-FIRST: a levy thorp counts its levy as a militia part, at the least rung of the militia\'s ladder', () => {
    const { least } = DEFENCE_TUNING.houseScale;
    const whole = Object.values(DEFENCE_TUNING.militia).reduce((a, v) => a + v, 0);
    for (const key of ['cold-thorp-191', 'fresh6-thorp-52']) {
      const s = births[key];
      expect(s.institutions.some((i) => i.name === 'Household levy'), key).toBe(true);
      const part = partOf(s, 'militia');
      expect(part, key).not.toBeNull();
      // `full` is the part's points before pay, the rules and the crises: the weights × the least rung, over the scores.
      expect(part.full, key).toBeCloseTo(Math.round(((whole * least) / 5) * 10) / 10, 1);
    }
  });

  test('the militia\'s ladder is the catalogue\'s two rungs: a citizen militia counts 1.5 times a levy in the same place', () => {
    const { least, greatest } = DEFENCE_TUNING.houseScale;
    const s = births['cold-thorp-191'];
    const asMilitia = { ...s, institutions: s.institutions.map((i) => (i.name === 'Household levy' ? { ...i, name: 'Citizen militia' } : i)) };
    expect(partOf(asMilitia, 'militia').full / partOf(s, 'militia').full).toBeCloseTo(greatest / least, 1);
  });
});

describe('G3 (C4a): the walk to another\'s church opens no clergy part; the parish row stays', () => {
  test('RED-FIRST: a thorp and a hamlet that walk to church have no clergy part and no divine tradition, and keep the parish row', () => {
    for (const key of ['cold-thorp-16', 'cold-hamlet-123']) {
      const s = births[key];
      expect(s.institutions.some((i) => i.name === 'Access to parish church'), key).toBe(true);
      expect(s.institutions.some((i) => /parish church$|parish churches|cathedral|monastery|shrine|temple|friary/i.test(i.name) && i.name !== 'Access to parish church'), key).toBe(false);
      expect(partOf(s, 'clergy'), key).toBeNull();
      expect(partOf(s, 'parish'), key).not.toBeNull();
      expect(s.defenseProfile.traditions.hasDivine, key).toBe(false);
    }
  });

  test('RED-FIRST: the clergy\'s ladder starts at the village\'s Parish church: it counts the least rung, and a town\'s parish churches more', () => {
    const { least } = DEFENCE_TUNING.houseScale;
    const s = births['cold-hamlet-123'];
    const asVillageChurch = { ...s, institutions: s.institutions.map((i) => (i.name === 'Access to parish church' ? { ...i, name: 'Parish church' } : i)) };
    const asTownChurches = { ...s, institutions: s.institutions.map((i) => (i.name === 'Access to parish church' ? { ...i, name: 'Parish churches (2-5)' } : i)) };
    const church = partOf(asVillageChurch, 'clergy');
    const churches = partOf(asTownChurches, 'clergy');
    expect(church).not.toBeNull();
    expect(churches).not.toBeNull();
    // The Parish church is now rung 1 of 4 (the walk was rung 1 of 5): 0.8 against (2-5)'s rung 2 of 4.
    const { greatest } = DEFENCE_TUNING.houseScale;
    expect(churches.full / church.full).toBeCloseTo((least + (greatest - least) / 3) / least, 1);
  });
});

describe('G3s (C4b): the wayside shrine has no clergy of its own, so it opens no clergy part; its parish row stays', () => {
  test('RED-FIRST: a thorp whose only house of faith is a wayside shrine has no clergy part and no divine tradition, and keeps the parish row', () => {
    const s = births['cold-thorp-20'];
    expect(s.institutions.some((i) => i.name === 'Wayside shrine')).toBe(true);
    expect(partOf(s, 'clergy')).toBeNull();
    expect(partOf(s, 'parish')).not.toBeNull();
    expect(s.defenseProfile.traditions.hasDivine).toBe(false);
  });
});
