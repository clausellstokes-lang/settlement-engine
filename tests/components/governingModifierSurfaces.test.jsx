// @vitest-environment jsdom
/**
 * governingModifierSurfaces.test.jsx — ONE READER FOR ONE FACT ON EVERY SURFACE: the ruling power's modifier (POWERS-15;
 * REVIEW-POWERS-5 A7, HIGH: the PDF's Power chapter printed the stored key raw, "mage-advised", in 395 of 395 towns that
 * store one; the Summary tab's faction legend printed it as a chip. The chair's ruling of 2026-11-14).
 *
 * The Power tab prints the modifier through display/governingModifierWords.js :: governingModifierWordsOf (plain words,
 * only where the town bears it out). The PDF's Power chapter (pdf/sections/PowerStructure.jsx) and the Summary tab's
 * legend (components/new/SummaryTab.jsx) now print it through that reader too: the three surfaces agree, and no surface
 * prints the stored key. Towns born as the census's 720 are, measured at 69521bf72 (POWERS-15 probe modsurf.mjs).
 */
import React from 'react';
import { beforeAll, describe, expect, test, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { governingModifierWordsOf } from '../../src/domain/display/governingModifierWords.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** seed -> [the stored key, the Power tab's words ('' = silent)] */
const TOWNS = {
  'r2r-city-56': ['arcane-advised', 'mage counsel'],
  'r2r-village-36': ['church-guided', 'church guidance'],
  'r2r-metropolis-16': ['military-dominated', 'armed sway'],
  'r2r-hamlet-28': ['mage-advised', ''], // no arcane house: silent on every surface
};

/** Flatten a react-pdf element tree to its text leaves (the tests/pdf idiom: the sections are hook-free). */
const collectText = (/** @type {any} */ node, /** @type {string[]} */ out = []) => {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
};

/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of Object.keys(TOWNS)) births[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
}, 180000);
afterEach(() => cleanup());

describe('the ruling power\'s modifier prints through one reader on the Power tab, the PDF and the Summary legend', () => {
  for (const [seed, [key, words]] of Object.entries(TOWNS)) {
    test(`${seed} (${key}): every surface prints ${words ? `"${words}"` : 'nothing'} and none prints the key`, () => {
      const s = births[seed];
      const ruler = s.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning);
      expect(ruler?.modifier, 'anchored: the key is stored').toBe(key);
      expect(governingModifierWordsOf(s), 'the Power tab\'s reader').toBe(words);
      const pdf = collectText(React.createElement(PowerStructure, { settlement: s, vm: buildViewModel({ settlement: s }), narrativeMode: false, stateProse: null }));
      expect(pdf.join(' '), 'anchored: the PDF chapter names the ruler').toContain(String(ruler.faction));
      expect(pdf.filter((t) => t.includes(key)), 'the PDF prints no stored key').toEqual([]);
      const ALL_WORDS = ['mage counsel', 'armed sway', 'armed backing', 'church sway', 'church guidance', 'merchant sway', 'criminal sway'];
      expect(pdf.filter((t) => ALL_WORDS.includes(t)), 'the PDF prints the Power tab\'s words, or none').toEqual(words ? [words] : []);
      const { container } = render(<SummaryTab settlement={s} />);
      const text = container.textContent || '';
      expect(text, 'anchored: the Summary legend names the ruler').toContain(String(ruler.faction));
      expect(text.toLowerCase(), 'the Summary prints no stored key').not.toContain(key);
      if (words) expect(text, `the Summary prints "${words}"`).toContain(words);
    });
  }
});
