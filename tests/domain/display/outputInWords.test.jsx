/** @vitest-environment jsdom */
/**
 * outputInWords.test.jsx — PAGE-1's OUTPUT unit (F3b; docs/chair/2026-11-20/content/page/briefs/BUILD.md): NO GRADE
 * OUT OF 100 ON ANY SURFACE. The economy's output figure (`economicState.compound.economyOutput`) printed as "n/100"
 * on the Economics header and bare on the PDF's Economics strip. Each now prints `domain/display/outputInWords.js`:
 * the share of what the town's work could yield, in words, and the drag that holds it back most.
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
/** The model's working, which no line may name (BUILD.md, the common law's authored lines). */
const WORKING = /\b(band|score|ratio|tier|influence|dial|output)\b|\d|\/100/i;

/** @type {Record<string, any>} */
const T = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  T.noMarket = hxd('thorp', 0);
  T.all = hxd('city', 3);
  T.famine = census('town', 'famine', 0);
  T.siege = census('village', 'under_siege', 0);
  T.sample = [...['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap((s) => [0, 1, 2].map((i) => hxd(s, i))),
    ...['hamlet', 'city', 'metropolis'].flatMap((s) => [0, 1].map((i) => census(s, null, i)))];
}, 600000);
afterEach(() => cleanup());

describe('the reader says the record in words', () => {
  test('a town with no market: the share and the market named, as the record holds them', () => {
    const c = T.noMarket.economicState.compound;
    expect(c.inst.hasMarket, 'anchored: the thorp has no market').toBe(false);
    const r = outputReading(T.noMarket);
    expect(r?.read, 'the record\'s own inputs reproduce its stored figure').toBe(true);
    expect(r?.share).toBeCloseTo(c.economyOutput / c.raw.economy, 12);
    expect(outputInWords(T.noMarket)).toBe('It gets about three parts in four of what its work could yield; having no market holds it back most.');
  });

  test('a town nothing drags: one plain line', () => {
    expect(outputReading(T.all)?.share, 'anchored: it makes all its work could').toBeGreaterThanOrEqual(0.95);
    expect(outputInWords(T.all)).toBe('It gets all its work could yield; nothing holds it back.');
  });

  test('a crisis in force names the crisis by its one noun', () => {
    expect(T.famine.config.stressTypes, 'anchored: the famine is in force').toContain('famine');
    expect(outputReading(T.famine)?.drag?.kind).toBe('crisis');
    expect(outputInWords(T.famine)).toMatch(/; the famine holds it back most\.$/);
    expect(outputInWords(T.siege)).toMatch(/; the siege holds it back most\.$/);
  });

  test('a record the reading does not reproduce names no drag (it never asserts what the record contradicts)', () => {
    const c = T.noMarket.economicState.compound;
    const edited = { ...T.noMarket, economicState: { ...T.noMarket.economicState, compound: { ...c, economyOutput: c.economyOutput - 1 } } };
    expect(outputReading(edited)?.read).toBe(false);
    expect(outputInWords(edited)).toBe('It gets about three parts in four of what its work could yield.');
  });

  test('no figure or no dial: nothing', () => {
    expect(outputInWords({ economicState: { compound: { economyOutput: 55 } } })).toBeNull();
    expect(outputInWords({ economicState: {} })).toBeNull();
    expect(outputInWords(null)).toBeNull();
  });

  test('over born towns of every size: every line read, the named drag the largest pull, no figure and no working', () => {
    for (const town of T.sample) {
      const r = outputReading(town);
      expect(r?.read, town._seed).toBe(true);
      const line = String(outputInWords(town));
      expect(line, town._seed).not.toMatch(WORKING);
    }
  });
});

describe('every surface prints the words, and no grade out of 100', () => {
  test('the Economics header', () => {
    for (const town of [T.noMarket, T.all, T.famine]) {
      const { container } = render(<EconomicsTab settlement={town} saveId={null} />);
      const text = container.textContent || '';
      expect(text, 'the line prints').toContain(String(outputInWords(town)));
      expect(text, 'no grade out of 100').not.toMatch(/\d+\/100/);
      const exact = [...container.querySelectorAll('div,span,p')].filter((n) => n.children.length === 0 && n.textContent === 'Output');
      expect(exact.length, 'no Output chip').toBe(0);
      cleanup();
    }
  });

  test('the PDF Economics chapter', () => {
    for (const town of [T.noMarket, T.all, T.famine]) {
      const vm = buildViewModel({ settlement: town });
      const tree = EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null });
      expect(leaves(tree), 'the line prints').toContain(String(outputInWords(town)));
      const strips = find(tree, (n) => typeof n.type === 'function' && n.type.name === 'StatStrip');
      expect(strips.length, 'anchored: the chapter\'s strip renders').toBe(1);
      expect(strips[0].props.stats.map((/** @type {{ label: string }} */ x) => x.label), 'no Output tile (the figure printed bare)').toEqual(['Prosperity', 'Complexity', 'Trade']);
      expect(vm.economics, 'the chapter carries no figure out of 100').not.toHaveProperty('economyOutput');
    }
  });
});
