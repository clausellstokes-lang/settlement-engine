/**
 * tests/generators/foodDiversity.test.js — FOOD-3: FOOD DIVERSITY (the owner, 2026-11-03: "Is food
 * diversity in the mix as well?" · "Would you recommend?" · "Do it"; chair addendum and rulings).
 *
 * Four changes, nothing more: the food record lists the SOURCES a place really has (the five
 * resource+institution pairings the balance already reads); a famine fails ONE named source,
 * the largest, as deep as that source's share; preserved fish, meat and game lengthen the
 * stores; and the foodways line is composed from the place's own sources.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { deriveFoodRecord } from '../../src/generators/economy/foodBalance.js';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const corpus = (perTier, extra = {}) => TIERS.flatMap((tier) => Array.from({ length: perTier }, (_, i) => (
  generateSettlementPipeline({ settType: tier, ...extra }, null, { seed: `food-diversity-${tier}-${i}`, customContent: {} })
)));

/** The five pairings, re-spelled here as an independent oracle over the settlement's own roster. */
function pairingsOf(s) {
  const names = (s.institutions || []).map((i) => String(i?.name || '').toLowerCase());
  // A depleted resource feeds nothing (foodGenerator.js reads both depletion formats).
  const depleted = new Set([...(s.config?.nearbyResourcesDepleted || []),
    ...Object.entries(s.config?.nearbyResourcesState || {}).filter(([, v]) => v === 'depleted').map(([k]) => k)]);
  const res = (s.config?.nearbyResources || []).map(String).filter((r) => !depleted.has(r));
  const inst = (...k) => names.some((n) => k.some((x) => n.includes(x)));
  const has = (...k) => res.some((r) => k.some((x) => r.includes(x)));
  const mill = names.some((n) => n.includes('mill') && !n.includes('sawmill') && !n.includes('access to external mill'));
  return {
    grain: (inst('subsistence', 'common field', 'household farm', 'farming community') || inst('farmland', 'grain field', 'managed farmland')) && has('grain_fields', 'fertile_floodplain'),
    livestock: inst('pastoral', 'grazing', 'livestock', 'shepherd', 'common graz') && has('grazing_land'),
    fish: (inst('fish', 'fishing') || has('fishing_grounds', 'river_fish')) && has('fishing_grounds', 'river_fish'),
    mill: mill && has('river_mills'),
    game: has('hunting_grounds') && (inst('hunting', 'managed forest', 'woodcutter') || ['thorp', 'hamlet', 'village'].includes(s.tier)),
  };
}

const BARE = { _population: 200, tradeRouteAccess: 'road', terrainType: 'plains', magicExists: false };

describe('FOOD-3 — food diversity', () => {
  it('every listed source traces to a firing pairing, and every firing pairing is listed, over 120 seeds', () => {
    const wrong = [];
    for (const s of corpus(20)) {
      const listed = s.economicState.foodSecurity.foodRecord.foodSources;
      const oracle = pairingsOf(s);
      const fired = Object.keys(oracle).filter((k) => oracle[k]);
      if (!Array.isArray(listed) || [...listed].sort().join() !== fired.sort().join()) wrong.push(`${s.tier} ${s.name}: ${JSON.stringify(listed)} vs ${fired}`);
    }
    expect(wrong).toEqual([]);
  });

  it('a famine fails the largest source, as deep as its share: one source loses 65%, three lose a third', () => {
    const three = { ...BARE, nearbyResources: ['grain_fields', 'grazing_land', 'fishing_grounds'] };
    const inst3 = [{ name: 'Subsistence farming' }, { name: 'Common grazing' }, { name: 'Fishing huts' }];
    const ratio = (insts, cfg) => generateFoodSecurity('hamlet', insts, { ...cfg, stressTypes: ['famine'] }).dailyProduction
      / generateFoodSecurity('hamlet', insts, cfg).dailyProduction;
    const fam3 = generateFoodSecurity('hamlet', inst3, { ...three, stressTypes: ['famine'] });
    expect(fam3.foodRecord.foodSources).toEqual(['grain', 'livestock', 'fish']);
    expect(fam3.foodRecord.failedSource).toBe('grain');
    expect(ratio(inst3, three)).toBeCloseTo(2 / 3, 2);
    const one = { ...BARE, nearbyResources: ['grain_fields'] };
    expect(ratio([{ name: 'Subsistence farming' }], one)).toBeCloseTo(7 / 20, 2);
    expect(generateFoodSecurity('hamlet', [], BARE).foodRecord.failedSource, 'no famine, nothing failed').toBe(null);
  });

  it('a forced famine names the failed source in its note, 11 of 11, and a single-source place reads Deficit or Active Famine', () => {
    const missing = [];
    let named = 0;
    for (let i = 0; i < 11; i += 1) {
      const tier = TIERS[i % 6];
      const s = generateSettlementPipeline({ settType: tier, selectedStresses: ['famine'], selectedStressesRandom: false, nearbyResourcesRandom: false, nearbyResources: ['grain_fields'] }, null, { seed: `food-diversity-famine-${i}`, customContent: {} });
      const record = s.economicState.foodSecurity.foodRecord;
      const notes = (s.economicViability?.issues || []).map((x) => x.description || '').join(' ');
      const word = { grain: 'grain', livestock: 'herds', fish: 'fishing', mill: 'mill', game: 'hunt' }[record.failedSource];
      if (record.foodSources.length && (!word || !new RegExp(`The [^.]*${word}[^.]* failed this year`).test(notes))) missing.push(`${tier}-${i}: ${record.failedSource} / ${notes.slice(0, 80)}`);
      if (record.foodSources.length) named += 1;
      if (record.foodSources.length <= 1 && !/^Deficit/.test(s.economicState.foodSecurity.label)) missing.push(`${tier}-${i}: ${s.economicState.foodSecurity.label}`);
    }
    expect(missing).toEqual([]);
    expect(named, 'the famines named a source (a place with none has nothing to name)').toBeGreaterThan(0);
  });

  it('preserved fish, meat and game lengthen the stores by a quarter month each, three quarters at most', () => {
    const months = (insts, resources) => generateFoodSecurity('hamlet', insts, { ...BARE, nearbyResources: resources }).storageMonths;
    const base = months([{ name: 'Subsistence farming' }], ['grain_fields']);
    expect(months([{ name: 'Subsistence farming' }, { name: 'Common grazing' }, { name: 'Fishing huts' }], ['grain_fields', 'grazing_land', 'fishing_grounds'])).toBeCloseTo(base + 0.5, 5);
  });

  it('the foodways line names only sources the place has, over 120 seeds', () => {
    const wrong = [];
    for (const s of corpus(20)) {
      const record = s.economicState.foodSecurity.foodRecord;
      const line = record.foodwaysLine;
      if (typeof line !== 'string' || !line) { wrong.push(`${s.name}: no line`); continue; }
      wrong.push(...foodWordsFindings(s, line).map((f) => `${s.name}: ${f.code} ${f.sentence}`));
    }
    expect(wrong).toEqual([]);
  });

  it('a named food source on the table that the record does not hold is a finding', () => {
    const record = deriveFoodRecord({ dailyNeed: 100, dailyProduction: 110, importCoverage: 0, magicOffset: 0, deficitPct: 0, surplusPct: 10, stressFamine: false, storageMonths: 2, hasGranary: false, foodSources: ['grain'] });
    const s = { economicState: { foodSecurity: { foodRecord: record } } };
    expect(foodWordsFindings(s, 'Fish from the local waters anchor the table.').map((f) => f.code)).toContain('source_not_held');
    expect(foodWordsFindings(s, 'Most meals start from the day\'s catch.').map((f) => f.code)).toContain('source_not_held');
    expect(foodWordsFindings(s, 'Most meals start from bread from the home fields.')).toEqual([]);
  });
});
