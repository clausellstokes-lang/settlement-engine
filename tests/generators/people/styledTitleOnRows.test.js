/**
 * styledTitleOnRows.test.js — COHERENCE-POWERS-8 (the chair's R2, from REVIEW-POWERS-FU F2): ONE HOME FOR A PERSON'S
 * STYLED TITLE. A relationship row names each end by its role word (`npc1Role` / `npc2Role`, copied by
 * `people/ties.js :: drawTies` and refreshed by `generateSettlementPipeline.js :: refreshRelationshipProjections`). A
 * woman lord's card is styled "Lady" (data/faceHonorifics.js, the title's `{ male, female }` form), but her rows printed
 * "the lord · crushing · the monarch". The one home is `faceHonorifics.js :: styledTitleOf`: a title whose registry form
 * is gendered and whose last word is the masculine form's takes the feminine's for a woman — "the lord" → "the lady",
 * "the abbot" → "the abbess", "the senior abbot" → "the senior abbess"; a man's title, a title with no gendered form and
 * a missing role are returned as they are.
 *
 * Measured at the lane's tip 91a3a9623 on the census's 720 (probes/COHERENCE-POWERS-8/r2rows.mjs): 347 women's row ends
 * disagree with their card ("the lord" 120, "the abbot" 22, "the senior abbot" 205); 0 after; the men's 20,670 ends
 * unchanged. The named births below are three of those towns; the fresh ones were not measured before this file.
 * Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { styledTitleOf } from '../../../src/data/faceHonorifics.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
/** The census's calm seed shape r2r-<size>-<i>, and a fresh p8-<size>-<i> in the same dials. @param {string} seed */
function born(seed) {
  const m = seed.match(/^(?:r2r|p8)-(\w+)-\d+$/);
  if (!m) throw new Error(seed);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
}
/** Every row end: [the card, the word its row prints]. @param {any} s */
function ends(s) {
  const by = new Map((s.npcs || []).map((/** @type {any} */ c) => [c.id, c]));
  return (s.relationships || []).flatMap((/** @type {any} */ r) => [[by.get(r.from), r.npc1Role], [by.get(r.to), r.npc2Role]])
    .filter(([c]) => c);
}
const MASCULINE = /\b(?:lord|abbot)\b/;

describe('COHERENCE-POWERS-8 R2 · the styled title, in its home', () => {
  it('a woman takes the feminine of a gendered title', () => {
    expect(styledTitleOf('the lord', 'female')).toBe('the lady');
    expect(styledTitleOf('the abbot', 'female')).toBe('the abbess');
    expect(styledTitleOf('the senior abbot', 'female')).toBe('the senior abbess');
    expect(styledTitleOf('the high priest', 'female')).toBe('the high priestess');
  });
  it('a man, a title with no gendered form whose last word is the office, and a missing role keep what they had', () => {
    expect(styledTitleOf('the lord', 'male')).toBe('the lord');
    expect(styledTitleOf('the lord', undefined)).toBe('the lord');
    expect(styledTitleOf('the monarch', 'female')).toBe('the monarch');
    expect(styledTitleOf('the priest', 'female')).toBe('the priest');
    expect(styledTitleOf("the circle's first", 'female')).toBe("the circle's first");
    expect(styledTitleOf('the midwife', 'male')).toBe('the midwife');
    expect(styledTitleOf("the lord's appointee", 'female')).toBe("the lord's appointee");
    expect(styledTitleOf(undefined, 'female')).toBe(undefined);
    expect(styledTitleOf('', 'female')).toBe('');
  });
});

describe('COHERENCE-POWERS-8 R2 · a woman\'s row agrees with her card', () => {
  it('r2r-town-15: Kyriake Limniotes, the lord of her body, is "the lady" on her rows', async () => {
    await loadGenerationLawPayloads();
    const s = born('r2r-town-15');
    const mine = ends(s).filter(([c]) => c.name === 'Kyriake Limniotes');
    expect(mine.length).toBeGreaterThan(0);
    for (const [c, word] of mine) { expect(c.role).toBe('the lord'); expect(word).toBe('the lady'); }
  }, 60000);
  it('r2r-town-19: Bayarmaa Mangghud is "the abbess"; r2r-city-3: Komnenou Kamytzes is "the senior abbess"', async () => {
    await loadGenerationLawPayloads();
    const a = ends(born('r2r-town-19')).filter(([c]) => c.name === 'Bayarmaa Mangghud');
    const b = ends(born('r2r-city-3')).filter(([c]) => c.name === 'Komnenou Kamytzes');
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    for (const [, word] of a) expect(word).toBe('the abbess');
    for (const [, word] of b) expect(word).toBe('the senior abbess');
  }, 60000);
  it('on fresh births: no woman\'s row keeps a masculine word her title has a feminine for, and every man\'s row is his role', async () => {
    await loadGenerationLawPayloads();
    // chosen by a scan of p8-<size>-1..12 at 91a3a9623 for a woman lord or abbot with a row (the class's exposure), plus two
    // controls with none; the scan read the base only, never this file's expectations. RE-KEYED BY IDENTITY (POWERS-13): the
    // line's merge (835cce92c) re-dealt p8-city-10's roster and ties (68 -> 66 cards), and Volkera Wolf's rows went 5 -> 2, so
    // the six read 9 ends at 3909655c3. p8-city-3 is added, the first town of the same scan at 3909655c3 with the exposure
    // that the list did not hold (Yasmeen ibn Sina, the senior abbot, 3 rows); the scan read exposure only.
    let gendered = 0;
    const failures = collectSeedFailures(['p8-town-8', 'p8-town-10', 'p8-city-10', 'p8-metropolis-11', 'p8-city-3', 'p8-city-1', 'p8-village-1'], (seed) => {
      const wrong = ends(born(seed)).filter(([c, word]) => {
        if (c.gender !== 'female') return word !== c.role;
        if (/^the (?:lord|abbot|senior abbot)$/.test(c.role)) gendered++;
        return word !== styledTitleOf(c.role, 'female') || (/^the (?:lord|abbot|senior abbot)$/.test(c.role) && MASCULINE.test(word));
      }).map(([c, word]) => `${c.name}: "${word}"`);
      expect(wrong, seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every row end reads its card\'s styled title (a woman\'s feminine, a man\'s role)');
    expect(gendered).toBeGreaterThanOrEqual(10); // 12 at 91a3a9623; 12 at 3909655c3 with p8-city-3
  }, 120000);
});
