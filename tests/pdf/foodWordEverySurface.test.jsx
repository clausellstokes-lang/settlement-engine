/** @vitest-environment jsdom */
/**
 * foodWordEverySurface.test.jsx — SURFACES-2 item 1 (the chair's ruling (r2) of 2026-11-14): THE FOOD WORD IS ONE FACT
 * ON EVERY SURFACE.
 *
 * The Tonight sheet (the tab's, the PDF's page and the journal's), Daily Life and the quick guide print the food band
 * (`summary/tonightSheet.js :: foodBandOf` over the food record). The Overview's Systems Health "Food Security" row and
 * the Foundations "Food" row printed the record's stored label ("Secure" beside the band's "Pressured": 159 of 772
 * births), and the PDF's Identity block printed a vocabulary of its own, Deficit / Surplus / Balanced off the view's
 * daily figures (729 of 772). Each now prints `domain/display/foodWordShown.js`, the band's word in the band's colour.
 * Births in the app's own shape (the census's 720, the r2r- arm, as tests/pdf/chainStateThreeSurfaces.test.jsx): a
 * siege, a famine, an occupation (the occupied thorp is a town whose stored label and band differ), and a calm town.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { foodWordShown } from '../../src/domain/display/foodWordShown.js';
import { TONIGHT_COPY } from '../../src/domain/summary/tonightSheet.js';
import { statusCase } from '../../src/domain/display/labelCase.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** @param {string} seed */
const birth720 = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'random_trade', culture: 'random_culture',
    monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
    magicExists: true, contentProfile: 'grounded', settType: m[1] }), null, { seed, customContent: {} });
};
/** Every text leaf under a react(-pdf) tree, function components executed. @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** @param {Element} root @returns {Text[]} */
const textNodes = (root) => {
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  /** @type {Text[]} */ const out = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (/** @type {Text} */ (n).nodeValue?.trim()) out.push(/** @type {Text} */ (n));
  return out;
};
/** '#7a5010' as jsdom prints a style colour. @param {string | null} hex */
const rgb = (hex) => {
  if (!hex) return '';
  const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};
/** The word after a label among a rendered tab's text nodes. @param {Element} root @param {string} label */
const wordAfter = (root, label) => {
  const nodes = textNodes(root); const at = nodes.findIndex((n) => n.nodeValue?.trim() === label);
  const node = at >= 0 ? nodes[at + 1] : null;
  const style = node ? /** @type {HTMLElement} */ (node.parentElement).style : null;
  return node && style ? { word: String(node.nodeValue).trim(), color: style.color, background: style.background } : null;
};

/** Every surface's food word for one town, as "<surface>: <printed> / <the one home>". @param {any} town */
const disagreements = (town) => {
  const home = foodWordShown(town);
  expect(home, 'anchored: the town has a food word').toBeTruthy();
  const want = /** @type {{ label: string, color: string | null }} */ (home);
  /** @type {string[]} */ const out = [];
  const overview = render(<OverviewTab settlement={town} />);
  const ov = wordAfter(overview.container, 'Food Security');
  if (ov?.word !== statusCase(want.label)) out.push(`overview: ${ov?.word} / ${statusCase(want.label)}`);
  else if (ov.color !== rgb(want.color)) out.push(`overview colour: ${ov.color} / ${rgb(want.color)}`);
  cleanup();
  const substrate = render(<SubstrateTab settlement={town} />);
  const sb = wordAfter(substrate.container, 'Food');
  if (sb?.word !== statusCase(want.label)) out.push(`substrate: ${sb?.word} / ${statusCase(want.label)}`);
  else if (!sb.background.includes(rgb(want.color))) out.push(`substrate colour: ${sb.background} / ${rgb(want.color)}`);
  cleanup();
  const vm = buildViewModel({ settlement: town });
  const id = leaves(IdentityDailyLife({ settlement: town, narrativeMode: false, vm, stateProse: null }));
  const at = id.indexOf('Food'); const idWord = at >= 0 ? String(id[at + 1]).trim() : null;
  if (idWord !== want.label) out.push(`pdf identity: ${idWord} / ${want.label}`);
  const tonight = leaves(TonightAtTheTable({ settlement: town, narrativeMode: false })).join(' ');
  if (!tonight.includes(`${want.label}.`)) out.push(`pdf tonight: no "${want.label}."`);
  const md = buildJournalPages(vm, { settlement: town }).map((p) => String(p.markdown || '')).join('\n');
  const jr = md.split('\n').find((l) => l.startsWith(`- **${TONIGHT_COPY.food}**: `));
  if (!jr || !jr.replace(/\\(.)/g, '$1').startsWith(`- **${TONIGHT_COPY.food}**: ${want.label}.`)) out.push(`journal tonight: ${jr} / ${want.label}`);
  return out;
};

/** A siege in the smallest and the largest size it reaches here; a famine likewise (tests/pdf/chainStateThreeSurfaces.test.jsx's towns). */
const SIEGE_SEEDS = ['r2r-hamlet-0', 'r2r-metropolis-14'];
const FAMINE_SEEDS = ['r2r-hamlet-16', 'r2r-city-44'];

describe('the food word is one fact on every surface (SURFACES-2 item 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  afterEach(cleanup);

  test('an occupied thorp whose stored label is not the band (r2r-thorp-24): every surface prints the band', () => {
    const town = birth720('r2r-thorp-24');
    expect(town.economicState.foodSecurity.label, 'anchored: the record stores "Secure"').toBe('Secure');
    expect(foodWordShown(town)?.label, 'anchored: the band reads "Pressured" (a share of the need goes unmet)').toBe('Pressured');
    expect(disagreements(town)).toEqual([]);
  }, 180000);

  test('under a siege and under a famine every surface prints the band (SIEGE_SEEDS, FAMINE_SEEDS)', () => {
    const seeds = [...SIEGE_SEEDS, ...FAMINE_SEEDS];
    expect(seeds.map((seed) => ({ seed, out: disagreements(birth720(seed)) }))).toEqual(seeds.map((seed) => ({ seed, out: [] })));
  }, 300000);

  test('the PDF\'s Identity block keeps no vocabulary of its own: no Balanced, the band\'s word (the guard town r2r-city-0)', () => {
    const town = birth720('r2r-city-0');
    const id = leaves(IdentityDailyLife({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null }));
    expect(id).toContain('Food');
    expect(id.map((x) => x.trim())).not.toContain('Balanced');
    expect(disagreements(town)).toEqual([]);
  }, 180000);
});
