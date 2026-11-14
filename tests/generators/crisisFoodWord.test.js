/**
 * tests/generators/crisisFoodWord.test.js — R2-CODE-A item 1 (the cold list REVIEW-W2A-3, HIGH
 * #210, #309, #310, #891, #920, #921, #963; MEDIUM #887-#889, #1020, #1024): A SIEGE OR A FAMINE
 * LINE THAT MEANS FOOD SAYS THE TOWN'S FOOD, NEVER ITS EXPORT.
 *
 * The siege and famine lines filled one slot with the first export's keyword
 * (`tradeCommodity.js :: deriveTradeCommodity`), and printed "its days of legal", "the remaining
 * reeds reserves", "Secure enough crafts reserves", "a hidden cache of meals reserves". The slot
 * that means food now reads the one food record through `foodBalance.js :: foodStoreWord`
 * ("grain" where the record keeps grain, else "food"); the export slot stays where a line means
 * trade. Born in the app's own shape (the stress panel with Random off).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { foodStoreWord } from '../../src/generators/economy/foodBalance.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { SIEGE_GOALS } from '../../src/generators/npcGenerator.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The frames whose slot means the town's food (the pressure lines, the siege goal, the secrets). */
const FOOD_FRAMES = [
  /Every (.+?) cache in /,
  /counts its mouths and its days of (.+?) every morning/,
  /controls the remaining (.+?) reserves/,
  /knows where the hoarded (.+?) can be found/,
  /promised a fair share of the (.+?) reserves/,
  /Secure enough (.+?) reserves to outlast/i,
  /skimming from the (.+?) reserves/i,
  /hidden cache of (.+?) reserves/i,
  /receiving (.+?) shipments through a covert route/i,
  /selling the concealed (.+?) to both armies/i,
];

/** @param {string} text @returns {string[]} */
const foodWordsIn = (text) => FOOD_FRAMES.flatMap((re) => { const m = String(text).match(re); return m ? [m[1]] : []; });

describe('the food word has one home: the food record', () => {
  it('grain where the record keeps grain; food otherwise, and with no record', () => {
    expect(foodStoreWord({ hasGranary: true, foodSources: [] })).toBe('grain');
    expect(foodStoreWord({ hasGranary: false, foodSources: ['grain'] })).toBe('grain');
    expect(foodStoreWord({ hasGranary: false, foodSources: ['mill'] })).toBe('grain');
    expect(foodStoreWord({ hasGranary: false, foodSources: ['fish', 'game'] })).toBe('food');
    expect(foodStoreWord({ hasGranary: false })).toBe('food');
    expect(foodStoreWord(null)).toBe('food');
  });

  it('no siege or famine line, no siege goal and no food secret reads the export slot', () => {
    const r = { name: 'Hochfurt', commodity: 'legal', topFaction: 'Military/Guard', govFaction: 'the grand council', foodRecord: { hasGranary: true } };
    const lines = [...PRESSURE_SENTENCES.under_siege(r), ...PRESSURE_SENTENCES.famine(r)].map((l) => (typeof l === 'string' ? l : l.text));
    expect(lines.filter((l) => /\blegal\b/.test(l))).toEqual([]);
    for (const l of lines) for (const w of foodWordsIn(l)) expect(w).toBe('grain');
    expect(SIEGE_GOALS('legal')[0].short).toBe('Secure enough food reserves to outlast the blockade');
    expect(SIEGE_GOALS('legal', { hasGranary: true })[0].short).toBe('Secure enough grain reserves to outlast the blockade');
    const secrets = [...STRESS_INSTITUTION_EFFECTS.under_siege, ...STRESS_INSTITUTION_EFFECTS.famine, ...STRESS_INSTITUTION_EFFECTS.wartime].map((e) => e.secret);
    expect(secrets.filter((t) => /\{commodity\}/.test(t) && foodWordsIn(t.replace(/\{commodity\}/g, 'X')).length)).toEqual([]);
    expect(secrets.filter((t) => /\{food\}/.test(t))).toHaveLength(4);
  });
});

describe('the cold list\'s towns, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
    const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
    return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  };
  /** @param {any} s @returns {string[]} */
  const printed = (s) => [
    String(s.pressureSentence || ''),
    ...(s.npcs || []).flatMap((/** @type {any} */ n) => [n?.goal?.short, n?.goal?.text, n?.secret?.what].map((t) => String(t || ''))),
  ];
  it('every food slot says what the town eats and stores (every row)', () => {
    for (const [seed] of [
      ['rw3-metropolis-under_siege-1'], // "its days of legal", "Secure enough legal reserves", "skimming from the legal reserves"
      ['rw3-city-famine-1'], // "the remaining reeds reserves", "a hidden cache of reeds reserves", "receiving reeds shipments"
      ['rw3-town-under_siege-1'], // "its days of crafts", "crafts reserves"
      ['rw3-town-under_siege+famine-1'], // "meals reserves", "meals shipments"
    ]) {
      const s = /** @type {any} */ (born(seed));
      const own = foodStoreWord(s.economicState?.foodSecurity?.foodRecord);
      const words = printed(s).flatMap(foodWordsIn);
      expect(words.length, `${seed}: a food slot prints`).toBeGreaterThan(0);
      for (const w of words) expect([own, 'food'], `${seed}: ${w}`).toContain(w);
    }
  });
});
