/** @vitest-environment jsdom */
/**
 * bar7CardsMarkOnce.test.jsx — THE GUARD OF BAR7-CARDS (BRIEF-BAR7, 2026-11-17; the chair's ruling CM1, vetoable by the
 * owner): A PERSON'S CARD SAYS ITS HOUSE'S STATE ONCE; THE PDF PRINTS WHAT THE TABS PRINT (LAW 8: 8h).
 *
 *   1. THE TAB'S CARD: every person who keeps a house the one leaf marks (`crisisStoppedRow.js :: rowMarkText`, kind
 *      `house`) carries that mark ONCE on the card, as a line of its own, and no "How they deal" sentence opens with it.
 *   2. THE PDF'S CARD: every person row of the view model carries the leaf's mark of its house; every full card of such
 *      a person (the PDF's only card with a house line and the person's sentences) prints it once, straight under its
 *      house line; no dealing line opens with a mark.
 *   3. THE PDF'S OUTLOOK LIST ("N institutions critically impaired by siege: …") names only the houses the leaf marks, with
 *      its count, as the Outlook tab prints it (BAR6-RECORD (d)'s reading).
 *
 * THE READING IS THE LEAF'S AND THE ROSTER'S, never the cure's own helpers (a helper gone wrong cannot certify itself): the
 * expected mark is `rowMarkText` on the roster row the card's house names (`cardPowers.js :: cardHouseOf`). Over a fixed
 * sample of the sixth read's thirty and the wide read's 150 (the controls' towns C2524, C8842, C43844, C37251 and the
 * Outlook's two disagreeing towns of the seam's PDF seat). At the joined line's 7e4a64a19 every arm is red: the tab set the
 * mark in front of a trade line only, the PDF printed no mark, the PDF printed the record's list.
 */
import React from 'react';
import { beforeAll, afterEach, describe, expect, test, vi } from 'vitest';
import { render, cleanup, fireEvent, act } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import { NPCInlineCard } from '../../src/components/new/npcComponents.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import { useStore } from '../../src/store/index.js';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { cardHouseOf } from '../../src/domain/people/cardPowers.js';
import { institutionDisplayName, institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs, its bar0 arm verbatim (as `bar6CrimeOneReading.test.js` spells it). @param {string} seed */
const cfgFor = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, { t: any, vm: any }>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) {
    const t = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    towns.set(seed, { t, vm: buildViewModel({ settlement: t }) });
  }
  return /** @type {{ t: any, vm: any }} */ (towns.get(seed));
};

/** The sample: the controls' towns (C2524, C8842 · C43844 · C37251) and the Outlook's two disagreeing towns. */
const SAMPLE = [
  'bar0-city-under_siege+famine-rand-42', 'bar0-city-under_siege+famine-rand-44', 'bar0-village-calm-rand-44',
  'bar0-town-calm-rand-44', 'bar0-city-under_siege+famine-rand-34', 'bar0-hamlet-under_siege-rand-35',
];

/** The leaf's mark for a card's house, read from the roster row of that name (null where it marks none). @param {any} t @param {any} n */
const leafMarkOf = (t, n) => {
  const name = cardHouseOf(n);
  const row = name ? (t.institutions || []).find((/** @type {any} */ r) => r && r.name === name) : null;
  return row ? rowMarkText(t, 'house', row) : null;
};
/** @param {string} hay @param {string} needle */
const timesIn = (hay, needle) => hay.split(needle).length - 1;

const TABS = [{ id: 'overview' }, { id: 'institutions' }, { id: 'npcs' }, { id: 'power' }];
/** @param {{ settlement: any, children: any }} p */
function Dossier({ settlement, children }) {
  const value = useDossierEntityNav(settlement, () => {}, TABS, {});
  return <DossierEntityContext.Provider value={value}>{children}</DossierEntityContext.Provider>;
}

/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};

const IMPAIRED = /^(\d+) institutions? critically impaired by siege: (.+)\.$/;

describe('BAR7-CARDS: a person\'s card says its house\'s state once; the PDF prints what the tabs print', () => {
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    if (typeof window !== 'undefined' && !window.matchMedia) {
      // @ts-ignore jsdom has no matchMedia
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    }
  }, 180000);
  afterEach(() => cleanup());

  test('1. THE TAB\'S CARD: a marked house\'s keeper carries the mark once, as its own line; no deal line opens with it', () => {
    let marked = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const { t } = town(seed);
      act(() => { useStore.setState({ settlement: t }); });
      for (const n of t.npcs || []) {
        const mark = leafMarkOf(t, n);
        const { container, getByRole, unmount } = render(<Dossier settlement={t}><NPCInlineCard npc={n} settlement={t} /></Dossier>);
        fireEvent.click(getByRole('button', { expanded: false }));
        const text = container.textContent || '';
        const deal = [...container.querySelectorAll('div')].map((d) => d.textContent || '').find((s) => s.startsWith('How they deal ')) || '';
        if (mark) {
          marked += 1;
          expect(timesIn(text, mark), `${seed} ${n.name} (${cardHouseOf(n)}): the mark "${mark}" once on the card`).toBe(1);
          const line = container.querySelector('[data-testid="npc-house-mark"]');
          expect(line?.textContent, `${seed} ${n.name}: the mark is a line of its own`).toBe(mark);
          expect(deal.startsWith(`How they deal ${mark}`), `${seed} ${n.name}: "How they deal" opens with no mark: "${deal}"`).toBe(false);
        } else {
          expect(container.querySelector('[data-testid="npc-house-mark"]'), `${seed} ${n.name}: an unmarked house's keeper has no mark line`).toBeNull();
        }
        unmount();
      }
    }), 'every keeper of a marked house carries its mark once on the tab\'s card');
    expect(marked, 'the sample holds keepers of marked houses (the guard cannot go blind)').toBeGreaterThan(10);
  }, 600000);

  test('2. THE PDF\'S CARD: a marked house\'s keeper carries the mark once, straight under the house line', () => {
    let printed = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const { t, vm } = town(seed);
      // Every person as a FULL card (the only PDF card that prints a house line and the person's sentences): the view
      // model's rows unchanged but for their power, raised to the major tier, so every keeper's card goes to print.
      const vmFull = { ...vm, npcs: { ...vm.npcs, sorted: (vm.npcs?.sorted || []).map((/** @type {any} */ r) => ({ ...r, power: 10 })) } };
      const L = leaves(NotableNPCs({ settlement: t, narrativeMode: false, vm: vmFull }));
      /** @type {Map<string, string>} mark -> the house lines of its keepers */
      const byMark = new Map();
      for (const n of t.npcs || []) {
        const mark = leafMarkOf(t, n);
        const row = (vm.npcs?.sorted || []).find((/** @type {any} */ r) => r.name === n.name);
        if (row && typeof row.dealing === 'string' && mark) {
          expect(row.dealing.startsWith(mark), `${seed} ${n.name}: the PDF's dealing opens with no mark: "${row.dealing}"`).toBe(false);
        }
        if (row) expect(row.houseMark ?? null, `${seed} ${n.name} (${cardHouseOf(n)}): the PDF's row carries the leaf's mark`).toBe(mark);
        if (!mark || !row) continue;
        const houseLine = [row.house ? institutionHouseLabel(row.house) : '', row.powerLine].filter(Boolean).join(' · ');
        byMark.set(houseLine, mark);
      }
      for (let i = 0; i < L.length; i++) {
        const mark = byMark.get(L[i]);
        if (!mark) continue;
        printed += 1;
        expect(L[i + 1], `${seed}: under "${L[i]}" the house's mark`).toBe(mark);
        expect(L[i + 2], `${seed}: under "${L[i]}" the mark said once`).not.toBe(mark);
      }
    }), 'every PDF card of a marked house\'s keeper carries its mark once');
    expect(printed, 'the sample prints full PDF cards of marked houses (the guard cannot go blind)').toBeGreaterThan(10);
  }, 600000);

  test('3. THE PDF\'S OUTLOOK LIST names only the houses the leaf marks, recounted, as the tab prints it', () => {
    let lists = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const { t, vm } = town(seed);
      const houses = t.institutions || [];
      for (const item of vm.viability?.stressConsequences || []) {
        const d = typeof item?.description === 'object' && item.description ? (item.description.short || item.description.text) : item?.description;
        const m = typeof d === 'string' ? IMPAIRED.exec(d) : null;
        if (!m) continue;
        lists += 1;
        const names = m[2].split(', ');
        expect(Number(m[1]), `${seed}: the count is the list's`).toBe(names.length);
        for (const name of names) {
          const house = houses.find((/** @type {any} */ h) => h?.name === name || institutionDisplayName(h?.name) === name);
          expect(!house || !!rowMarkText(t, 'house', house), `${seed}: "${name}" is named only where the leaf marks it`).toBe(true);
        }
      }
    }), 'the PDF\'s Outlook list is the tab\'s');
    expect(lists, 'the sample prints an impaired list (the guard cannot go blind)').toBeGreaterThan(0);
  }, 600000);
});
