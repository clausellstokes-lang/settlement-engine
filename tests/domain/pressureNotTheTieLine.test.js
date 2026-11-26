/**
 * tests/domain/pressureNotTheTieLine.test.js — BIRTH-1, unit D2b (the tenth chair's ruling G8 (3) as re-set at 11:15 UTC on
 * 2026-11-25): THE PRESSURE LINE NEVER REPEATS THE NOTABLE CONNECTION'S SENTENCE.
 *
 * The pressure step's relationship branch (`narrativeGenerator.js :: generatePressureSentence`) tells a tie with its own draw;
 * where it picked the prominent tie it printed the notable connection's line again, word for word or one of its sentences
 * under another opening (C dp-thorp-39: "Khatan Tayichi'ud and Qubilai Borjigin respect each other, and it is real." then the
 * tie line's own sentence). The Overview already dropped such a line (X-50); the PDF's view model and the other readers took
 * the stored line as it stood. THE CURE AT THE DRAW: the branch passes to its next candidate where its line shares a sentence
 * with the stored prominent line, by the ONE test both callers read (`domain/display/sharedSentence.js`, the Overview's own,
 * moved verbatim); the reader's drop stays for places born before.
 *
 *   (a) RED FIRST, BY NAME (measured at 0ec96f13d with the Overview's test): C 18 and V 19 births store such a pressure line.
 *       After: none.
 *   (b) ONE TEST, BOTH CALLERS: the leaf answers as the Overview's inline test answered (its words, kept here as the oracle).
 * The check over EVERY birth of C and V is the census `gen/birth-1/tools/measure-d2b.mjs` (0 and 0 after; the hand-in).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { sharesSentence } from '../../src/domain/display/sharedSentence.js';

/** The Overview's inline test as it stood at the base (OverviewTab.jsx, X-50), word for word: the oracle. @param {unknown} text */
const sentenceSet = (text) => new Set(String(text || '').split(/(?<=[.!?])\s+/)
  .map((x) => x.trim().replace(/[.!?]+$/, '')).filter((x) => x.split(/\s+/).length >= 4));
/** @param {unknown} a @param {unknown} b */
const overviewShares = (a, b) => { const p = sentenceSet(b); return [...sentenceSet(a)].some((x) => p.has(x)); };

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}

const C = ['dp-thorp-39', 'dp-thorp-59', 'dp-thorp-92', 'dp-thorp-127', 'dp-thorp-128', 'dp-hamlet-23', 'dp-hamlet-45', 'dp-hamlet-48',
  'dp-hamlet-65', 'dp-hamlet-110', 'dp-village-84', 'dp-village-91', 'dp-village-100', 'dp-village-113', 'dp-village-134', 'dp-village-135',
  'dp-village-146', 'dp-town-101'];
const V = ['dp-thorp-39', 'dp-hamlet-23', 'dp-hamlet-48', 'dp-hamlet-65', 'dp-hamlet-72', 'dp-hamlet-142', 'dp-hamlet-149', 'dp-village-4',
  'dp-village-26', 'dp-village-81', 'dp-village-84', 'dp-village-100', 'dp-village-148', 'dp-city-43', 'dp-city-144', 'dp-metropolis-15',
  'dp-metropolis-27', 'dp-metropolis-45', 'dp-metropolis-79'];

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('D2b (a): no stored pressure line shares a sentence with the notable connection', () => {
  for (const [corpus, seeds] of /** @type {const} */ ([['C', C], ['V', V]])) {
    for (const seed of seeds) {
      it(`${corpus} ${seed}`, () => {
        const town = /** @type {any} */ (birth(seed, corpus));
        expect(town.prominentRelationship?.phrasing, 'a notable connection stands (the case is live)').toBeTruthy();
        expect(overviewShares(town.pressureSentence, town.prominentRelationship.phrasing), String(town.pressureSentence)).toBe(false);
      }, 60000);
    }
  }
});

describe('D2b (b): one sentence test, both callers', () => {
  it('the leaf answers as the Overview\'s inline test answered', () => {
    const tie = "Khatan Tayichi'ud and Qubilai Borjigin still respect each other, but what each of them wants is pulling apart, and both can see it.";
    const cases = [
      [`Khatan Tayichi'ud and Qubilai Borjigin respect each other, and it is real. ${tie}`, tie, true],
      [tie, tie, true],
      ['A dispute over grazing rights and water access has been running for two seasons without resolution.', tie, false],
      ['It is late. Very late indeed.', 'Very late indeed. Go home.', false],
      ['They wait. The harvest was thin this year!', 'The harvest was thin this year.', true],
      [null, tie, false], [tie, null, false],
    ];
    for (const [a, b, want] of cases) {
      expect(sharesSentence(a, b), `${a} | ${b}`).toBe(want);
      expect(overviewShares(a, b)).toBe(want);
    }
  });
});
