/**
 * tests/domain/crisisNamesWhatItHolds.test.js — BIRTH-1, unit D7 (the tenth chair's rulings G17 and G18 of 2026-11-25):
 * THE CRISIS NAMES ONLY WHAT THE PLACE HOLDS.
 *
 * The power step writes its crisis sentence before the roster settles, and two of its sentences name a LOCAL body of the
 * crisis: the debt's "The creditor's agent has blocked the money for repairs. In public they talk of prudence; ..." and the
 * conversion's "The split is now open: two priests, two congregations, two registers ...". The debt's pressure row named "the
 * creditor's representative". Where the settled roster holds no power of the crisis's own, each now prints its declared twin
 * (`data/powerSiblings.js :: CRISIS_BODY_SIBLINGS`; the pressure pool's own twin row), by the atom `crisis body: <kind>`
 * (`domain/facts/crisisBody.js`). No power is added to any place and no draw moves.
 *
 *   (a) RED FIRST, BY NAME (measured at 0ec96f13d, `gen/birth-1/d7/`): these births print a body-naming crisis line with no
 *       such body on the roster (C 25, V 17 over the corpora). After: none, and the twin prints.
 *   (b) WHERE THE BODY STANDS, THE LINE IS KEPT.
 *   (c) THE LEAF: fail-closed with no powers; the governing power is never the crisis's body.
 * THE ORACLE is independent of the leaf: the crisis's own powers BY NAME (`power/stressFactions.js` at the base). The check
 * over EVERY birth of C and V is the census `gen/birth-1/tools/measure-d7.mjs` (the hand-in).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { crisisBodyOf } from '../../src/domain/facts/crisisBody.js';

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}

/** The oracle: the crisis's own powers by name, as `power/stressFactions.js` pushes them. */
const OWN = /** @type {Record<string, RegExp>} */ ({
  indebted: /Creditor/,
  religious_conversion: /^(New Faith Community|Reform Congregation|Conversion Enforcement Office|Underground Old Faith)$/,
});
/** The body-naming words, each with its crisis. */
const NAMING = /** @type {const} */ ([
  ["The creditor's agent has blocked the money for repairs.", 'indebted'],
  ['In public they talk of prudence;', 'indebted'],
  ["the creditor's representative arrived last month", 'indebted'],
  ['two priests, two congregations', 'religious_conversion'],
]);
/** @param {any} town @param {string} kind */
const holds = (town, kind) => (town.powerStructure?.factions || []).some((/** @type {any} */ f) => f && f.isGoverning !== true && OWN[kind].test(String(f.faction)));
/** @param {any} town */
const lines = (town) => [String(town.powerStructure?.recentConflict ?? ''), String(town.pressureSentence ?? '')].join('\n');

const RED = /** @type {const} */ ([
  ['C', 'dp-thorp-29', 'indebted'], ['C', 'dp-village-16', 'religious_conversion'], ['C', 'dp-town-1', 'religious_conversion'],
  ['C', 'dp-city-93', 'indebted'], ['V', 'dp-thorp-147', 'religious_conversion'], ['V', 'dp-hamlet-78', 'indebted'],
]);
const KEPT = /** @type {const} */ ([['C', 'dp-town-60', 'indebted'], ['C', 'dp-town-142', 'religious_conversion'], ['V', 'dp-city-86', 'indebted']]);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('D7 (a): a crisis line names no body of the crisis the roster lacks', () => {
  for (const [corpus, seed, kind] of RED) {
    it(`${corpus} ${seed} (${kind})`, () => {
      const town = /** @type {any} */ (birth(seed, corpus));
      expect(holds(town, kind), 'the case is live: no body of the crisis on the roster').toBe(false);
      const text = lines(town);
      for (const [words, of] of NAMING) if (of === kind) expect(text.includes(words), `${words} | ${text}`).toBe(false);
    }, 60000);
  }
});

describe('D7 (b): where the body stands, the line is kept', () => {
  for (const [corpus, seed, kind] of KEPT) {
    it(`${corpus} ${seed} (${kind})`, () => {
      const town = /** @type {any} */ (birth(seed, corpus));
      expect(holds(town, kind)).toBe(true);
      const text = lines(town);
      expect(NAMING.some(([words, of]) => of === kind && text.includes(words)), text).toBe(true);
    }, 60000);
  }
});

describe('D7 (c): the leaf', () => {
  it('is fail-closed, never reads the governing power, and reads the face table and the no-face names', () => {
    expect(crisisBodyOf({}, 'indebted')).toBeUndefined();
    expect(crisisBodyOf({ powerStructure: { factions: [] } }, null)).toBeUndefined();
    expect(crisisBodyOf({ powerStructure: { factions: [] } }, 'indebted')).toBe(false);
    expect(crisisBodyOf({ powerStructure: { factions: [{ faction: "Creditor's Representative", isGoverning: true }] } }, 'indebted')).toBe(false);
    expect(crisisBodyOf({ powerStructure: { factions: [{ faction: "Creditor's Representative" }] } }, 'indebted')).toBe(true);
    expect(crisisBodyOf({ powerStructure: { factions: [{ faction: 'Crown Creditors (Noble Coalition)' }] } }, 'indebted')).toBe(true);
    expect(crisisBodyOf({ powerStructure: { factions: [{ faction: 'New Faith Community' }] } }, 'religious_conversion')).toBe(true);
    expect(crisisBodyOf({ powerStructure: { factions: [{ faction: 'New Faith Community' }] } }, 'indebted')).toBe(false);
  });
});
