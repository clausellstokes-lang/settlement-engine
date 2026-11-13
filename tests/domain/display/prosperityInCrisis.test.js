/**
 * prosperityInCrisis.test.js — the chair's ruling 1(a) on REVIEW-UPKEEP-2 (2026-11-13): where the
 * printed prosperity word and the word with no crisis in force differ, the page says both, in one
 * plain sentence in the world's words, in the owner's kept form (record 328):
 * "Comfortable before the famine; Struggling while it lasts." Its one writer is
 * `src/domain/display/prosperityInCrisis.js :: prosperityInCrisisLine`; this pins its words, its
 * silences, and that no sentence it can write names a figure or the model's working.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { prosperityInCrisisLine } from '../../../src/domain/display/prosperityInCrisis.js';
import { deriveDossierViewModel } from '../../../src/domain/display/dossierViewModel.js';
import { PROSPERITY_LABELS } from '../../../src/domain/prosperityRank.js';
import { CRISIS_NOUN } from '../../../src/domain/crisis/crisisHooks.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';

/** @param {string} prosperity @param {string|undefined} standing @param {any} stress */
const place = (prosperity, standing, stress) => ({
  economicState: standing === undefined ? { prosperity } : { prosperity, prosperityStanding: standing },
  stress,
});

/** The words the ruling strikes from the sentence: pay, score, standing, label, share, rule, a figure. */
const MACHINERY = /\b(?:pay|paid|wage|score|standing|label|share|rule|points?|percent)\b|\d|%/i;

describe('the sentence, in the owner\'s kept form', () => {
  test('one crisis: "<ordinary> before the <crisis>; <now> while it lasts."', () => {
    expect(prosperityInCrisisLine(place('Struggling', 'Comfortable', [{ type: 'famine' }])))
      .toBe('Comfortable before the famine; Struggling while it lasts.');
    expect(prosperityInCrisisLine(place('Poor', 'Moderate', [{ type: 'occupied' }])))
      .toBe('Moderate before the occupation; Poor while it lasts.');
    expect(prosperityInCrisisLine(place('Comfortable', 'Prosperous', [{ type: 'wartime' }])))
      .toBe('Prosperous before the war; Comfortable while it lasts.');
  });

  test('the crisis is named by the estate\'s one crisis noun; a plural noun turns the clause plural', () => {
    expect(prosperityInCrisisLine(place('Struggling', 'Poor', [{ type: 'under_siege' }])))
      .toBe(`Poor before the ${CRISIS_NOUN.under_siege}; Struggling while it lasts.`);
    expect(prosperityInCrisisLine(place('Poor', 'Moderate', [{ type: 'monster_pressure' }])))
      .toBe('Moderate before the raids; Poor while they last.');
  });

  test('several crises in force are all named, in the record\'s order, and the clause is plural', () => {
    expect(prosperityInCrisisLine(place('Struggling', 'Prosperous', [{ type: 'famine' }, { type: 'under_siege' }])))
      .toBe('Prosperous before the famine and the siege; Struggling while they last.');
    expect(prosperityInCrisisLine(place('Struggling', 'Wealthy', [{ type: 'wartime' }, { type: 'plague_onset' }, { type: 'famine' }])))
      .toBe('Wealthy before the war, the outbreak and the famine; Struggling while they last.');
  });

  test('a lone crisis stored as a bare object counts; a kind the noun table does not know is "the crisis"', () => {
    expect(prosperityInCrisisLine(place('Struggling', 'Moderate', { type: 'famine' })))
      .toBe('Moderate before the famine; Struggling while it lasts.');
    expect(prosperityInCrisisLine(place('Poor', 'Comfortable', [{ type: 'dragon_tithe' }])))
      .toBe('Comfortable before the crisis; Poor while it lasts.');
  });
});

describe('it says nothing where it has nothing honest to say', () => {
  test('the two words agree', () => {
    expect(prosperityInCrisisLine(place('Struggling', 'Struggling', [{ type: 'famine' }]))).toBeNull();
  });
  test('the second word is absent (a record saved before it existed)', () => {
    expect(prosperityInCrisisLine(place('Struggling', undefined, [{ type: 'famine' }]))).toBeNull();
  });
  test('no crisis is in force (it has ended, or never was)', () => {
    expect(prosperityInCrisisLine(place('Struggling', 'Comfortable', []))).toBeNull();
    expect(prosperityInCrisisLine(place('Struggling', 'Comfortable', undefined))).toBeNull();
  });
  test('the printed word is the higher one, or a word off the six-word ladder', () => {
    expect(prosperityInCrisisLine(place('Comfortable', 'Struggling', [{ type: 'famine' }]))).toBeNull();
    expect(prosperityInCrisisLine(place('Subsistence', 'Poor', [{ type: 'famine' }]))).toBeNull();
    expect(prosperityInCrisisLine({ economicState: { prosperity: { tier: 'Poor' }, prosperityStanding: 'Moderate' }, stress: [{ type: 'famine' }] })).toBeNull();
  });
  test('no record at all', () => {
    expect(prosperityInCrisisLine(null)).toBeNull();
    expect(prosperityInCrisisLine({})).toBeNull();
  });
});

describe('the ratings, not the machinery: no sentence it can write names a figure or the working', () => {
  test('every lower/higher pair of the ladder, under every crisis kind, alone and in pairs', () => {
    const kinds = Object.keys(CRISIS_NOUN);
    let written = 0;
    for (let lo = 0; lo < PROSPERITY_LABELS.length; lo++) for (let hi = lo + 1; hi < PROSPERITY_LABELS.length; hi++) {
      for (const a of kinds) for (const b of [null, ...kinds]) {
        const stress = b ? [{ type: a }, { type: b }] : [{ type: a }];
        const line = prosperityInCrisisLine(place(PROSPERITY_LABELS[lo], PROSPERITY_LABELS[hi], stress));
        expect(line, `${lo}/${hi}/${a}/${b}`).toMatch(/^[A-Z][a-z]+ before the [a-z ,]+; [A-Z][a-z]+ while (?:it lasts|they last)\.$/);
        expect(MACHINERY.test(String(line)), String(line)).toBe(false);
        written++;
      }
    }
    expect(written).toBe(15 * kinds.length * (kinds.length + 1));
  });
});

describe('the canon carries it beside the printed word (the parity contract reads it once)', () => {
  test('deriveDossierViewModel(...).prosperity.inCrisis is the sentence, or null', () => {
    const capped = place('Struggling', 'Comfortable', [{ type: 'famine' }]);
    expect(deriveDossierViewModel(capped).prosperity).toEqual({ label: 'Struggling', inCrisis: 'Comfortable before the famine; Struggling while it lasts.' });
    expect(deriveDossierViewModel(place('Moderate', 'Moderate', [])).prosperity).toEqual({ label: 'Moderate', inCrisis: null });
  });
});

describe('on births (the 3,036 measure\'s recipe)', () => {
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @type {Record<string, any>} */
  const births = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const [key, tier, stress] of [['cold-famine-town-0', 'town', 'famine'], ['cold-town-1', 'town', null]]) {
      const cfg = stress
        ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false })
        : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier });
      births[key] = generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
    }
  }, 120000);

  test('a famine birth whose word the famine capped says both; a calm birth says nothing', () => {
    const famine = births['cold-famine-town-0'];
    const es = famine.economicState;
    expect(es.prosperity, 'the famine caps the printed word').toBe('Struggling');
    expect(es.prosperityStanding).not.toBe('Struggling');
    expect(prosperityInCrisisLine(famine)).toBe(`${es.prosperityStanding} before the famine; Struggling while it lasts.`);
    const calm = births['cold-town-1'];
    expect(calm.economicState.prosperityStanding).toBe(calm.economicState.prosperity);
    expect(prosperityInCrisisLine(calm)).toBeNull();
  });
});
