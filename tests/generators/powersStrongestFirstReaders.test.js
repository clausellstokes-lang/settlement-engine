/**
 * tests/generators/powersStrongestFirstReaders.test.js — D4 (the tenth chair's BIRTH-2; intake item 1, "ORDER-TAIL";
 * RULINGS G2 and G4): THE ONE SORTING READER. The stored powers are not always strongest-first
 * (`display/powersStrongestFirst.js` names the two writers); every LIVE reader that takes the strongest power, or the
 * first few, reads the roster through that one leaf. The stored ORDER is not changed.
 *
 *   (a) RED FIRST, BY NAME, on real births of the close's two corpora (C: `birthConfig({ settType })`; V:
 *       `birthConfig({ ...DEFAULT_CONFIG, settType, _randomizePriorities: true })`), measured at 0ec96f13d8
 *       (`docs/chair/2026-11-24/tenth/gen/birth-2/probes/d4order.census.jsx`): C dp-city-5 (its sixth row outweighs its
 *       fourth and fifth); V dp-town-93 and dp-city-134 (the fold left the ruler behind a weaker first row). The template
 *       narrative's five powers (`aiLayer.js :: extractFullContext`, live through `OutputContainer.jsx ::
 *       runTemplateNarrative`) are the five strongest. THE ORACLE IS THE RAW RECORD: the stored numbers ranked by the
 *       test's own comparison, never by the leaf.
 *   (b) THE BIRTH-TIME AND REGENERATION READERS (G2 (2), G4 (3)): the pressure sentence's and the NPC summary's
 *       `topFaction` (`narrativeGenerator.js :: genPressureDetail`, `genSettSummary`) and the history's `dominantFaction`,
 *       `secFaction`, `altFaction` (`historyGenerator.js`) take the roster through the leaf; no positional read of the
 *       roster is left in them. (On C and V they move no birth: C 0, V 0; the proof is the record census.)
 *   (c) the leaf: a copy, strongest first, ties in the roster's order, no number as 0, no mutation.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { extractFullContext } from '../../src/generators/aiLayer.js';
import { powersStrongestFirst } from '../../src/domain/display/powersStrongestFirst.js';

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}
/** The oracle: the raw roster ranked by its stored numbers, the test's own comparison (ties keep the roster's order). */
const ranked = (/** @type {any} */ s) => (s.powerStructure.factions || [])
  .map((/** @type {any} */ f, /** @type {number} */ i) => ({ name: String(f.faction), power: Number(f.power) || 0, i }))
  .sort((/** @type {any} */ a, /** @type {any} */ b) => (a.power === b.power ? a.i - b.i : b.power - a.power));

const CASES = Object.freeze([['dp-city-5', 'C'], ['dp-town-93', 'V'], ['dp-city-134', 'V']]);
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed, corpus] of CASES) births[`${corpus} ${seed}`] = birth(seed, corpus);
}, 180000);

describe('D4 (a): the template narrative takes the five strongest', () => {
  it.each(CASES)('%s (%s) stores its powers out of power order (the measure, re-read)', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    expect(s.powerStructure.factions.map((/** @type {any} */ f) => String(f.faction))).not.toEqual(ranked(s).map((f) => f.name));
  });
  it.each(CASES)('%s (%s): its five are the five strongest, strongest first', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    expect(extractFullContext(s).factions).toEqual(ranked(s).slice(0, 5).map((f) => `${f.name} (${f.power}%)`));
  });
});

describe('D4 (b): the stored-text readers take the roster through the leaf', () => {
  /** @param {string} path @param {string} fn the function whose body is read */
  const bodyOf = (path, fn) => {
    const src = readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
    const at = src.indexOf(`const ${fn} = `);
    expect(at, `${path} :: ${fn}`).toBeGreaterThan(-1);
    return src.slice(at, src.indexOf('\n};', at));
  };
  it.each([
    ['src/generators/narrativeGenerator.js', 'genSettSummary', ['topFaction']],
    ['src/generators/narrativeGenerator.js', 'genPressureDetail', ['topFaction']],
    ['src/generators/historyGenerator.js', 'buildHistoryContext', ['dominantFaction']],
    ['src/generators/historyGenerator.js', 'buildHistoricalEvent', ['secFaction', 'altFaction']],
  ])('%s :: %s', (path, fn, names) => {
    const body = bodyOf(path, fn);
    for (const name of names) {
      const line = body.split('\n').find((l) => l.includes(`const ${name} =`)) || '';
      expect(line, `${fn} :: ${name}`).toContain('powersStrongestFirst(');
      expect(line, `${fn} :: ${name}`).not.toMatch(/factions\??\.?\[[01]\]/); // anchored: the line above asserts the same line reads through powersStrongestFirst, so a vanished or renamed line reds there first
    }
  });
});

describe('D4 (c): the leaf', () => {
  it('a copy, strongest first, ties in the roster order, no number as 0, input untouched', () => {
    const roster = [{ faction: 'A', power: 10 }, { faction: 'B', power: 30 }, { faction: 'C' }, { faction: 'D', power: 30 }, { faction: 'E', power: '12' }];
    const before = JSON.stringify(roster);
    const out = powersStrongestFirst(roster);
    expect(out.map((f) => f.faction)).toEqual(['B', 'D', 'E', 'A', 'C']);
    expect(out).not.toBe(roster);
    expect(JSON.stringify(roster)).toBe(before);
    expect(powersStrongestFirst(null)).toEqual([]);
    expect(powersStrongestFirst(undefined)).toEqual([]);
  });
});
