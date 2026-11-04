/**
 * F1 DEFENCE-WORDS, UNIT 2 — EVERY CLAIM WRITER READS THE ONE DEFENCE ANSWER (soak 1000 rung 1B,
 * kind 4 `coh:defense-words`, 534 settlements; docs/F1_DEFENCE_WORDS_2026-11-04.md §2 bucket b).
 *
 * Each writer below printed a garrison, soldiers, walls, a Garrison Commander or a hospital the
 * place's own record (`src/domain/defense/defenseFacts.js :: defenseFactsOf`) does not hold. One
 * seed per writer, from the rung's corpus (`scripts/audit/soak-review/corpus.mjs :: birth`): the
 * test walks the stored record (the coherence receipt aside, which quotes the findings) and asks
 * the defence-words check for that writer's sentence.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { defenseFactsOf, forceWordsOf } from '../../src/domain/defense/defenseFacts.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { generatePressureSentence } from '../../src/generators/narrativeGenerator.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

/** @param {unknown} node @param {string[]} out @returns {string[]} */
function strings(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((v) => strings(v, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) if (k !== 'generationCoherenceReceipt') strings(v, out);
  }
  return out;
}

/** @param {any} s @param {RegExp} writer @returns {string[]} the writer's unlicensed sentences */
const claims = (s, writer) => defenseWordsFindings(s, strings(s))
  .map((f) => f.sentence)
  .filter((sentence) => writer.test(sentence));

/** @type {ReadonlyArray<[string, number, RegExp]>} */
const WRITERS = [
  ['narrativeData.js :: stressNote "these walls" (soak1k-0, a thorp with no walls)', 0, /these walls|inside the walls/],
  ['npcData.js :: gov_mil_friction tension "a road toll for the garrison" (soak1k-8)', 8, /road toll for the/],
  ['supplyChainData.js :: the garrison chain label "Standing Garrison" over a town watch (soak1k-9)', 9, /^Standing Garrison$/],
  ['supplyChainData.js :: the hospital chain label "Hospital & Surgery" with no hospital (soak1k-112)', 112, /^Hospital & Surgery$/],
  ['spatialGenerator.js :: LAYOUT_BY_TIER "Stone-walled village" with no walls (soak1k-32)', 32, /Stone-walled village/],
  ['economicState.js :: Property Rents "within the walls" with no walls (soak1k-21)', 21, /plots within the walls/],
  ['stressFactions.js :: occupied desc "how many soldiers they have here" (soak1k-152)', 152, /how many soldiers they have here/],
  ['historyGenerator.js :: stone construction "Walls, civic buildings" with no walls (soak1k-12)', 12, /Walls, civic buildings/],
  ['npcGenerator.js :: the Garrison Commander over a town watch (soak1k-69)', 69, /^Garrison Commander$/],
  ['narrativeData.js :: arrival "There are soldiers on the streets" with no force (soak1k-212)', 212, /There are soldiers on/],
  ['rulingStructure.js :: the wartime faith desc "soldiers praying" with no soldiers (soak1k-380)', 380, /soldiers praying/],
  ['institutionalCatalog.js :: the charter hall desc "when the garrison falls short" (soak1k-205)', 205, /garrison falls short|garrison cannot/],
  ['factionDynamics.js :: "Merchants fund churches, endow hospitals" with no hospital (soak1k-88)', 88, /endow hospitals/],
  ['rulingStructure.js :: "Land grants, hospital networks" with no hospital (soak1k-4)', 4, /hospital networks/],
  ['factionStanding.js :: "The garrison handles bodies" with a militia only (soak1k-20)', 20, /garrison handles bodies|garrison can arrest|garrison outweighs/],
];

describe('every claim writer reads the place\'s defence record', () => {
  beforeAll(async () => { await ensureLaws(); });
  for (const [title, index, writer] of WRITERS) {
    it(`${title}: names nothing the record lacks`, () => {
      const { settlement } = birth(index);
      expect(claims(settlement, writer)).toEqual([]);
    });
  }
});

describe('the siege pressure line reads the walls (soak1k-348, a besieged place with no walls)', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('narrativeText.js :: PRESSURE_SENTENCES.under_siege names no walls the record lacks', () => {
    const { settlement } = birth(348);
    expect(defenseFactsOf(settlement).hasWalls).toBe(false);
    const lines = [];
    for (let k = 0; k < 24; k++) {
      const prev = setActiveRng(createPRNG(`f1-pressure-${k}`));
      try { lines.push(String(generatePressureSentence(settlement) ?? '')); } finally { clearActiveRng(prev); }
    }
    expect(defenseWordsFindings(settlement, lines)).toEqual([]);
  });
});

describe('the force words follow the standing force', () => {
  const NONE = { hasGarrison: false, hasWatch: false, hasMilitia: false, hasMercenary: false };
  it('keeps the soldiers\' words where a garrison or a hired company stands', () => {
    expect(forceWordsOf({ ...NONE, hasGarrison: true }).body).toBe('garrison');
    expect(forceWordsOf({ ...NONE, hasMercenary: true }).members).toBe('soldiers');
  });
  it('names a hired company, not a garrison, where only a hired company stands (soak1k-153)', () => {
    expect(forceWordsOf({ ...NONE, hasMercenary: true }).body).toBe('hired company');
    expect(forceWordsOf({ ...NONE, hasMercenary: true, hasGarrison: true }).body).toBe('garrison');
  });
  it('names the watch, the militia, or plain guards otherwise', () => {
    expect(forceWordsOf({ ...NONE, hasWatch: true }).body).toBe('watch');
    expect(forceWordsOf({ ...NONE, hasMilitia: true }).body).toBe('militia');
    expect(forceWordsOf(NONE).members).toBe('guards');
  });
  it('counts a free company hall as a hired company', () => {
    expect(defenseFactsOf({ institutions: [{ name: 'Free company hall' }] }).hasMercenary).toBe(true);
  });
});
