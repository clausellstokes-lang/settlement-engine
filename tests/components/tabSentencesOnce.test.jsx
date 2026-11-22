/** @vitest-environment jsdom */
/**
 * X-50 (the owner, 2026-11-03): BOILERPLATE ONCE. No sentence repeats verbatim within a tab.
 *
 * Sixty fresh settlements, ten per tier, each rendered through the dossier's tabs with every
 * disclosure opened (a popover the DM opens one at a time is not page text, so dialogs are
 * dropped). Each tab's text is cut into sentences (five words or more, ending in . ! or ?)
 * and a sentence printed twice on one tab is a defect.
 *
 * Four tabs are outside this arm, each a REQUEST in the TRIM report rather than a pass:
 *   - Economics: the FOOD lane owns the tab while it builds (the stores row); its repeated
 *     trade-impact line is measured and handed to the chair to cut after FOOD lands.
 *   - NPCs: two people of one category and rank are given the same position, constraint and
 *     wants paragraph by generation (npcStructure.js :: enrichNPCsWithStructure); the card
 *     cannot print it once without cutting a person's fact.
 *   - Relationships: two pairs of one archetype draw the same sentence from the pair pool.
 *   - Traditions: two festivals kept in the same week each carry their own date line.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { PowerTab } from '../../src/components/new/tabs/PowerTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import PlotHooksTab from '../../src/components/new/tabs/PlotHooksTab.jsx';
import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import FaithTab from '../../src/components/new/tabs/FaithTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import WarTab from '../../src/components/new/tabs/WarTab.jsx';
import RumorsTab from '../../src/components/new/tabs/RumorsTab.jsx';
import DMCompassTab from '../../src/components/new/tabs/DMCompassTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const SEEDS = Array.from({ length: 60 }, (_, i) => ({
  seed: `x50-trim-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length] },
}));

const TABS = [
  ['Overview', (s) => <OverviewTab settlement={s} />],
  ['Power', (s) => <PowerTab powerStructure={s.powerStructure} settlement={s} />],
  ['Services', (s) => <ServicesTab services={s.availableServices} settlement={s} />],
  ['Institutions', (s) => <InstitutionsTab settlement={s} />],
  ['Defense', (s) => <DefenseTab settlement={s} />],
  ['History', (s) => <HistoryTab settlement={s} />],
  ['Resources', (s) => <ResourcesTab settlement={s} />],
  ['Viability', (s) => <ViabilityTab settlement={s} />],
  ['PlotHooks', (s) => <PlotHooksTab settlement={s} />],
  ['DailyLife', (s) => <DailyLifeTab settlement={s} />],
  ['Faith', (s) => <FaithTab settlement={s} />],
  ['Magic', (s) => <MagicTab settlement={s} />],
  ['War', (s) => <WarTab settlement={s} />],
  ['Rumors', (s) => <RumorsTab settlement={s} />],
  ['DMCompass', (s) => <DMCompassTab settlement={s} />],
  ['Causes', (s) => <SubstrateTab settlement={s} />],
];

const INLINE = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'A', 'SMALL', 'CODE', 'MARK', 'SUP', 'SUB', 'ABBR', 'BUTTON', 'BR']);

/** Open every closed disclosure, so a sentence inside a fold is read too. */
function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}

/** The page's text blocks: each element whose content is inline-only reads as one block. */
function textBlocks(root) {
  const out = [];
  const walk = (el) => {
    const kids = [...el.children];
    const inlineOnly = kids.every((k) => INLINE.has(k.tagName)
      && [...k.querySelectorAll('*')].every((d) => INLINE.has(d.tagName)));
    if (inlineOnly) {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
      return;
    }
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ')
      .replace(/\s+/g, ' ').trim();
    if (own) out.push(own);
    for (const k of kids) walk(k);
  };
  walk(root);
  return out;
}

/** A sentence: five words or more, closed by . ! or ?. Labels and chips are not sentences. */
function sentencesOf(block) {
  return block.split(/(?<=[.!?])\s+(?=[A-Z"'“(])/)
    .map((x) => x.trim())
    .filter((x) => x.split(/\s+/).length >= 5 && /[.!?]["”)]?$/.test(x));
}

const REPEATS = [];
let SENTENCES = 0;
beforeAll(() => {
  for (const { seed, config } of SEEDS) {
    const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
    for (const [tab, renderTab] of TABS) {
      const { container } = render(renderTab(settlement));
      expandAll(container);
      for (const dialog of [...container.querySelectorAll('[role="dialog"]')]) dialog.remove();
      const counts = new Map();
      for (const block of textBlocks(container)) {
        for (const s of sentencesOf(block)) { counts.set(s, (counts.get(s) || 0) + 1); SENTENCES += 1; }
      }
      for (const [s, n] of counts) if (n > 1) REPEATS.push(`${seed} / ${tab} ×${n}: ${s}`);
      cleanup();
    }
  }
}, 600000);
afterEach(cleanup);

describe('X-50: boilerplate once', () => {
  test('no sentence repeats verbatim within one tab, over sixty settlements and sixteen tabs', () => {
    expect(REPEATS, `sentences printed twice on one tab:\n${REPEATS.slice(0, 20).join('\n')}`).toEqual([]);
  });

  test('the sweep read real pages, so the arm above is not vacuous', () => {
    // Measured 16,210 sentences on the base (2026-11-03); the floor sits well under it.
    expect(SENTENCES, 'the sweep found almost no sentences').toBeGreaterThan(12000);
  });
});
