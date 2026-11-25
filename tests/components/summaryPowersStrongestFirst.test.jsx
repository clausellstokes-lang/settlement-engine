/** @vitest-environment jsdom */
/**
 * tests/components/summaryPowersStrongestFirst.test.jsx — D4 (the tenth chair's BIRTH-2; intake item 1, "ORDER-TAIL"):
 * THE PAGE SORTS. The stored powers are not always strongest-first (`display/powersStrongestFirst.js` names the two writers);
 * every print site that names the strongest power, or the first few, reads the roster through that one leaf.
 *
 *   (a) RED FIRST, BY NAME, on real births of the close's two corpora (C: `birthConfig({ settType })`; V:
 *       `birthConfig({ ...DEFAULT_CONFIG, settType, _randomizePriorities: true })`, `close-7/read24/make-visitor-plan.mjs`),
 *       measured at 0ec96f13d8 (`docs/chair/2026-11-24/tenth/gen/birth-2/probes/d4order.census.jsx`): C dp-city-5 (its
 *       sixth row, 20, outweighs its fourth and fifth); V dp-town-93 and dp-city-134 (the ruler outgrew the first row).
 *       THE ORACLE IS THE RAW RECORD: the stored numbers, ranked here by the test's own comparison, never by the leaf.
 *       The Summary's sentence ("Power rests with"), its Power tile, and its bar (the five strongest, strongest first).
 *   (b) the template narrative's context (`aiLayer.js :: extractFullContext`): its five powers are the five strongest.
 *   (c) the leaf: a copy, strongest first, ties in the roster's order, no number as 0, no mutation.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render, within } from '@testing-library/react';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { extractFullContext } from '../../src/generators/aiLayer.js';
import { powersStrongestFirst } from '../../src/domain/display/powersStrongestFirst.js';

afterEach(cleanup);

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}

/** The oracle: the raw roster ranked by its stored numbers, the test's own comparison (ties keep the roster's order). */
const ranked = (/** @type {any} */ s) => (s.powerStructure.factions || [])
  .map((f, i) => ({ name: String(f.faction), power: Number(f.power) || 0, i }))
  .sort((a, b) => (a.power === b.power ? a.i - b.i : b.power - a.power));

const CASES = Object.freeze([['dp-city-5', 'C'], ['dp-town-93', 'V'], ['dp-city-134', 'V']]);
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed, corpus] of CASES) births[`${corpus} ${seed}`] = birth(seed, corpus);
}, 180000);

describe('D4: the stored roster is out of order on the cases (the measure, re-read)', () => {
  it.each(CASES)('%s (%s) stores its powers out of power order', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    const stored = s.powerStructure.factions.map((/** @type {any} */ f) => String(f.faction));
    expect(stored).not.toEqual(ranked(s).map((f) => f.name));
  });
});

describe('D4 (a): the Summary prints the powers strongest first', () => {
  it.each(CASES)('%s (%s): "Power rests with" and the Power tile name the strongest', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    const top = ranked(s)[0].name;
    const { container, getByText } = render(<SummaryTab settlement={s} />);
    expect(container.textContent).toContain(`Power rests with ${top.toLowerCase()};`);
    const tile = getByText('Power').parentElement;
    expect(within(/** @type {HTMLElement} */ (tile)).getByText(top)).toBeTruthy();
  });

  it.each(CASES)('%s (%s): the bar lists the five strongest, strongest first', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    const want = ranked(s).slice(0, 5).map((f) => f.name);
    const { container } = render(<SummaryTab settlement={s} />);
    const names = s.powerStructure.factions.map((/** @type {any} */ f) => String(f.faction));
    const legend = [...container.querySelectorAll('span')].map((n) => n.textContent || '').filter((t) => names.includes(t));
    // the bar's legend is the first run of power names on the tab (the Power & Conflict box)
    expect(legend.slice(0, want.length)).toEqual(want);
  });
});

describe('D4 (b): the template narrative takes the five strongest', () => {
  it.each(CASES)('%s (%s)', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    const want = ranked(s).slice(0, 5).map((f) => `${f.name} (${f.power}%)`);
    expect(extractFullContext(s).factions).toEqual(want);
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
