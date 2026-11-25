/**
 * tests/generators/prominentTieNotCovert.test.js — BIRTH-1, unit D2 (the tenth chair's PRERELEASE-LIST D2; START-BIRTH-1 (1)):
 * THE PROMINENT TIE IS NEVER A COVERT ONE.
 *
 * A card with a hidden allegiance spends its one tie on its handler, and that tie is `covert: true` (people/ties.js :: drawTies);
 * the veil drops it from every shared read. But `genRelNarrative` (power/settlementNarrative.js) picked the place's "notable
 * connection" from EVERY tie, covert ones included, and stored the pick's strings as `prominentRelationship` (a plain object
 * with no flag, so nothing hid it); the pressure step told the same pick as the first-screen `pressureSentence`. THE CURE AT
 * THE SOURCE: the pick is the best tie that is NOT covert (the scores are drawn over every tie exactly as before, so no draw
 * moves); where every tie is covert there is no prominent tie, and the pressure step falls through to its next line.
 *
 * THE ORACLE IS THE RAW RECORD, never the picker: a stored `prominentRelationship` is a covert tie's copy when its two names
 * and its description are a covert tie's own; a `pressureSentence` tells one when it names both of a covert tie's ends.
 *
 *   (a) RED FIRST, BY NAME (measured at 0ec96f13d on the close's two corpora, `gen/birth-1/` on the chair's tenth):
 *       C 8 and V 7 births store a covert tie as their prominent one; C 5 and V 3 print a pressure sentence naming both
 *       ends of a covert tie. After: none.
 *   (b) THE PICK ITSELF: a covert tie that scores highest is passed over for the best open tie; so is an open tie between
 *       the same two people (the pair's other direction names both ends of the hidden tie: V dp-hamlet-67, -76); ties that
 *       are all covert give no prominent tie; the draw count is the same with or without the covert ties flagged.
 * The check over EVERY birth of C and V (1,800) is the census `gen/birth-1/tools/check-d2.mjs` (0 and 0 after; the hand-in).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { genRelNarrative } from '../../src/generators/power/settlementNarrative.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, random as nextDraw, setActiveRng } from '../../src/kernel/rngContext.js';

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}

/** The covert ties of a record (the raw flag). @param {any} town */
const covertTies = (town) => (Array.isArray(town?.relationships) ? town.relationships : []).filter((r) => r?.covert === true);
/** Is the stored prominent tie the copy of a covert tie (its names and description)? @param {any} town */
const prominentIsCovert = (town) => {
  const pr = town?.prominentRelationship;
  return !!pr && covertTies(town).some((r) => pr.npc1 === r.npc1Name && pr.npc2 === r.npc2Name && pr.full === r.description);
};
/** The covert ties whose two ends the pressure sentence names. @param {any} town */
const pressureTellsCovert = (town) => {
  const ps = typeof town?.pressureSentence === 'string' ? town.pressureSentence : '';
  return covertTies(town).filter((r) => r.npc1Name && r.npc2Name && ps.includes(r.npc1Name) && ps.includes(r.npc2Name));
};

/** (a) Measured at 0ec96f13d (`gen/birth-1/d2/`): the births storing a covert prominent tie. */
const PROMINENT = /** @type {const} */ ([
  ['C', 'dp-town-77'], ['C', 'dp-city-28'], ['C', 'dp-city-60'], ['C', 'dp-city-72'], ['C', 'dp-city-86'],
  ['C', 'dp-metropolis-28'], ['C', 'dp-metropolis-46'], ['C', 'dp-metropolis-120'],
  ['V', 'dp-hamlet-76'], ['V', 'dp-town-0'], ['V', 'dp-city-23'], ['V', 'dp-city-69'], ['V', 'dp-city-92'], ['V', 'dp-city-148'],
  ['V', 'dp-metropolis-78'],
]);
/** (a) The births whose pressure sentence names both ends of a covert tie. */
const PRESSURE = /** @type {const} */ ([
  ['C', 'dp-town-29'], ['C', 'dp-city-40'], ['C', 'dp-city-47'], ['C', 'dp-city-84'], ['C', 'dp-city-135'],
  ['V', 'dp-hamlet-67'], ['V', 'dp-hamlet-76'], ['V', 'dp-metropolis-147'],
]);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('D2 (a): no birth stores or prints a covert tie as its notable connection', () => {
  for (const [corpus, seed] of PROMINENT) {
    it(`${corpus} ${seed}: the stored prominent tie is not a covert tie's copy`, () => {
      const town = birth(seed, corpus);
      expect(covertTies(town).length, 'the birth holds a covert tie (the case is live)').toBeGreaterThan(0);
      expect(town.prominentRelationship ?? null, 'a prominent tie stands').not.toBeNull();
      expect(prominentIsCovert(town)).toBe(false);
    }, 60000);
  }
  for (const [corpus, seed] of PRESSURE) {
    it(`${corpus} ${seed}: the pressure sentence names no covert tie's two ends`, () => {
      const town = birth(seed, corpus);
      expect(covertTies(town).length, 'the birth holds a covert tie (the case is live)').toBeGreaterThan(0);
      expect(typeof town.pressureSentence, 'a pressure sentence is printed').toBe('string');
      expect(pressureTellsCovert(town).map((r) => `${r.npc1Name} > ${r.npc2Name}`)).toEqual([]);
    }, 60000);
  }
});

describe('D2 (b): the pick passes over a covert tie, and draws as it did', () => {
  /** @param {string} seed @param {() => any} work */
  const withSeed = (seed, work) => {
    setActiveRng(createPRNG(seed));
    try { return work(); } finally { clearActiveRng(); }
  };
  const tie = (/** @type {string} */ a, /** @type {string} */ b, /** @type {Record<string, unknown>} */ extra = {}) => ({
    type: 'rivalry', typeName: 'Rivalry', npc1Name: a, npc2Name: b, description: `${a} and ${b} compete.`, tension: 'short', ...extra,
  });
  // the covert tie is flag-driven and long-tensioned: it scores at least 1.5 above any open tie (each open tie scores < 0.5)
  const COVERT = tie('Hidden One', 'Handler', { covert: true, handler: true, flagDriven: true, tension: 'x'.repeat(40) });
  const OPEN = [tie('Ada Moss', 'Bren Hale'), tie('Cora Lind', 'Dov Ash')];

  it('a covert tie that scores highest is never the pick; the best open tie is', () => {
    let picked = 0;
    for (let i = 0; i < 60; i++) {
      const r = withSeed(`d2-pick-${i}`, () => genRelNarrative({ relationships: [COVERT, ...OPEN], stress: null }));
      if (!r) continue;
      picked++;
      expect(r.npc1).not.toBe('Hidden One');
      expect(OPEN.map((t) => t.npc1Name)).toContain(r.npc1);
    }
    expect(picked, 'the pick is live on this corpus').toBeGreaterThan(20);
  });

  it("an open tie between the two people a covert tie joins is passed over too (it would name both of the hidden tie's ends)", () => {
    const REVERSE = tie('Handler', 'Hidden One', { flagDriven: true, tension: 'y'.repeat(40) });
    let picked = 0;
    for (let i = 0; i < 60; i++) {
      const r = withSeed(`d2-pair-${i}`, () => genRelNarrative({ relationships: [COVERT, REVERSE, ...OPEN], stress: null }));
      if (!r) continue;
      picked++;
      // anchored: the pair is two names of a pick that stands (r is not null here), and `picked` below proves picks are live
      expect([r.npc1, r.npc2]).not.toContain('Hidden One');
    }
    expect(picked, 'the pick is live on this corpus').toBeGreaterThan(20);
    expect(withSeed('d2-pair-only', () => {
      for (let i = 0; i < 20; i++) { const r = genRelNarrative({ relationships: [COVERT, REVERSE], stress: null }); if (r) return r; }
      return null;
    })).toBeNull();
  });

  it('ties that are all covert give no prominent tie', () => {
    for (let i = 0; i < 40; i++) {
      expect(withSeed(`d2-all-${i}`, () => genRelNarrative({ relationships: [COVERT, { ...COVERT, npc1Name: 'Other' }], stress: null }))).toBeNull();
    }
  });

  it('the draw count is the same with or without the covert flag (the next draw after the pick is equal)', () => {
    const plain = { ...COVERT }; delete plain.covert; delete plain.handler;
    for (let i = 0; i < 40; i++) {
      const after = (/** @type {any[]} */ rels) => withSeed(`d2-draws-${i}`, () => { genRelNarrative({ relationships: rels, stress: null }); return nextDraw(); });
      expect(after([COVERT, ...OPEN])).toBe(after([plain, ...OPEN]));
      expect(after([COVERT, COVERT])).toBe(after([plain, plain]));
    }
  });
});
