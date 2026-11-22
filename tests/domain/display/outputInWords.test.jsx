/** @vitest-environment jsdom */
/**
 * outputInWords.test.jsx — PAGE-1's OUTPUT unit (F3b; docs/chair/2026-11-20/content/page/briefs/BUILD.md): NO GRADE
 * OUT OF 100 ON ANY SURFACE. The economy's output figure (`economicState.compound.economyOutput`) printed as "n/100"
 * on the Economics header and bare on the PDF's Economics strip. Each now prints `domain/display/outputInWords.js`:
 * the share of what the town's work could yield, in words (the drag clause is the unit's STOP: see the reader).
 *
 * OUTPUT-FIX (PAGE-4, the chair's two changes of 2026-11-20 15:16 UTC): the three part-fractions reworded to match their
 * neighbours ('about two thirds', 'about three quarters', 'about four fifths'), and the drag as a plain fact: below
 * "nearly all" with no market by the market's own home (`factsOf(record).market`), the line ends ', held back by having
 * no market.' The arm: through the generator's own `getInstFlags`, all else equal, the output without a market is lower.
 *
 * Births in the app's own shape: the chair's towns (`hxd-<size>-<i>`, DEFAULT_CONFIG) and the census's crisis arm
 * (`censusPlan('r2')` rows through `configOf`).
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { EconomicsTab } from '../../../src/components/new/tabs/EconomicsTab.jsx';
import { EconomicsTrade } from '../../../src/pdf/sections/EconomicsTrade.jsx';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { outputInWords, outputReading } from '../../../src/domain/display/outputInWords.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { getInstFlags } from '../../../src/generators/priorityHelpers.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';

/** A chair's town. @param {string} size @param {number} i */
const hxd = (size, i) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
/** A census birth (the r2 plan's row shape). @param {string} size @param {string|null} crisis @param {number} i */
const census = (size, crisis, i) => generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null,
  { seed: crisis ? `r2s-${crisis}-${size}-${i}` : `r2r-${size}-${i}`, customContent: {} });
/** Every text leaf under a react(-pdf) tree, function components executed. @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** Every element under a react(-pdf) tree, function components executed. @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};
/** A made-up market (its own tags, as authored content carries them): the market's home reads it as a market. */
const MARKET = Object.freeze({ name: 'Weekly market', tags: ['market'] });
/** A made-up record: the figure, the dial, and the roster. @param {number} figure @param {number} dial @param {object[]} institutions */
const rec = (figure, dial, institutions) => ({ institutions, economicState: { compound: { economyOutput: figure, raw: { economy: dial } } } });
/** The model's working, which no line may name (BUILD.md, the common law's authored lines). */
const WORKING = /\b(band|score|ratio|tier|influence|dial|output)\b|\d|\/100/i;

/** @type {Record<string, any>} */
const T = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  T.noMarket = hxd('thorp', 0);
  T.all = hxd('city', 3);
  T.siege = census('village', 'under_siege', 0);
  T.sample = [...['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap((s) => [0, 1, 2].map((i) => hxd(s, i))),
    ...['hamlet', 'city', 'metropolis'].flatMap((s) => [0, 1].map((i) => census(s, null, i)))];
}, 600000);
afterEach(() => cleanup());

describe('the reader says the record in words', () => {
  test('the share is the figure over the town\'s own dial, said as the nearest named fraction', () => {
    const c = T.noMarket.economicState.compound;
    const r = outputReading(T.noMarket);
    expect(r?.share).toBeCloseTo(c.economyOutput / c.raw.economy, 12);
    expect(factsOf(T.noMarket).market, 'anchored: the thorp holds no market').toBe(false);
    expect(outputInWords(T.noMarket)).toBe('It gets about three quarters of what its work could yield, held back by having no market.');
    expect(outputInWords(T.all)).toBe('It gets all its work could yield.');
    expect(factsOf(T.siege).market, 'anchored: the besieged village holds a market').toBe(true);
    expect(outputInWords(T.siege)).toBe('It gets about half of what its work could yield.');
  });

  test('the ladder: each named fraction says itself, and the share between two takes the nearer', () => {
    /** @param {number} figure @param {number} dial */
    const at = (figure, dial) => outputInWords(rec(figure, dial, [MARKET]));
    expect(at(50, 50)).toBe('It gets all its work could yield.');
    expect(at(60, 50)).toBe('It gets more than its work alone could yield.');
    expect(at(45, 50)).toBe('It gets nearly all of what its work could yield.');
    expect(at(40, 50)).toBe('It gets about four fifths of what its work could yield.');
    expect(at(25, 50)).toBe('It gets about half of what its work could yield.');
    expect(at(12.5, 50)).toBe('It gets about a quarter of what its work could yield.');
    expect(at(37, 50), '0.74 stands nearer three in four than four in five').toBe('It gets about three quarters of what its work could yield.');
    expect(at(33, 50), '0.66 stands nearer two in three than three in four').toBe('It gets about two thirds of what its work could yield.');
    expect(at(5, 50)).toBe('It gets very little of what its work could yield.');
  });

  test('no figure or no dial: nothing', () => {
    expect(outputInWords({ economicState: { compound: { economyOutput: 55 } } })).toBeNull();
    expect(outputInWords({ economicState: {} })).toBeNull();
    expect(outputInWords(null)).toBeNull();
  });

  test('over born towns of every size: every line said, no figure and no working', () => {
    for (const town of T.sample) {
      const line = outputInWords(town);
      expect(line, town._seed).toMatch(/^It gets .+ yield(, held back by having no market)?\.$/); // OUTPUT-FIX: the one drag, stated
      expect(String(line), town._seed).not.toMatch(WORKING); // anchored: the line was matched as a sentence just above
    }
  });
});

describe('the drag as a plain fact: no market (the chair\'s ruling of 15:16 UTC)', () => {
  const HELD = ', held back by having no market.';
  test('below "nearly all" with no market, the line ends on the market', () => {
    expect(outputInWords(rec(25, 50, []))).toBe('It gets about half of what its work could yield, held back by having no market.');
    expect(outputInWords(rec(5, 50, []))).toBe('It gets very little of what its work could yield, held back by having no market.');
    expect(outputInWords(rec(33, 50, []))).toBe('It gets about two thirds of what its work could yield, held back by having no market.');
    expect(outputInWords(rec(40, 50, []))).toBe('It gets about four fifths of what its work could yield, held back by having no market.');
    expect(outputInWords(rec(25, 50, [{ ...MARKET, status: 'ruined' }])), 'a ruined market holds no market').toBe('It gets about half of what its work could yield, held back by having no market.');
  });

  test('with a market, or at "nearly all" and above, no drag is named', () => {
    for (const figure of [5, 10, 12.5, 25, 33, 37, 40]) {
      const line = String(outputInWords(rec(figure, 50, [MARKET])));
      expect(line, `anchored: ${figure} of 50 is said`).toMatch(/^It gets .+ yield\.$/);
      expect(line, `${figure} of 50 with a market`).not.toContain(HELD); // anchored: the line was matched as a sentence just above
    }
    expect(outputInWords(rec(45, 50, []))).toBe('It gets nearly all of what its work could yield.');
    expect(outputInWords(rec(50, 50, []))).toBe('It gets all its work could yield.');
    expect(outputInWords(rec(60, 50, []))).toBe('It gets more than its work alone could yield.');
  });

  test('THE ARM: through the generator\'s own function, all else equal, the output without a market is lower than with one', () => {
    for (const config of [{}, { priorityEconomy: 80, priorityCriminal: 70 }, { stressTypes: ['famine'], priorityEconomy: 30 }]) {
      const without = getInstFlags(config, []), withMarket = getInstFlags(config, [MARKET]);
      expect(without.inst.hasMarket, 'anchored: the generator reads no market').toBe(false);
      expect(withMarket.inst.hasMarket, 'anchored: the generator reads the market').toBe(true);
      expect(without.economyOutput, JSON.stringify(config)).toBeLessThan(withMarket.economyOutput);
    }
  });
});

describe('every surface prints the words, and no grade out of 100', () => {
  test('the Economics header', () => {
    for (const town of [T.noMarket, T.all, T.siege]) {
      const { container } = render(<EconomicsTab settlement={town} saveId={null} />);
      const text = container.textContent || '';
      expect(text, 'the line prints').toContain(String(outputInWords(town)));
      expect(text, 'no grade out of 100').not.toMatch(/\d+\/100/); // anchored: the line was found in this text just above
      const exact = [...container.querySelectorAll('div,span,p')].filter((n) => n.children.length === 0 && n.textContent === 'Output');
      expect(exact.length, 'no Output chip').toBe(0);
      cleanup();
    }
  });

  test('the PDF Economics chapter', () => {
    for (const town of [T.noMarket, T.all, T.siege]) {
      const vm = buildViewModel({ settlement: town });
      const tree = EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null });
      expect(leaves(tree), 'the line prints').toContain(String(outputInWords(town)));
      const strips = find(tree, (n) => typeof n.type === 'function' && n.type.name === 'StatStrip');
      expect(strips.length, 'anchored: the chapter\'s strip renders').toBe(1);
      expect(strips[0].props.stats.map((/** @type {{ label: string }} */ x) => x.label), 'no Output tile (the figure printed bare)').toEqual(['Prosperity', 'Complexity', 'Trade']);
      expect(vm.economics.outputInWords, 'anchored: the slice carries the words').toBe(outputInWords(town));
      expect(vm.economics, 'the chapter carries no figure out of 100').not.toHaveProperty('economyOutput'); // anchored: the slice carries the words, asserted above
    }
  });
});
