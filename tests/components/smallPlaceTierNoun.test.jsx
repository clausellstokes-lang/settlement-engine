/** @vitest-environment jsdom */
/**
 * tests/components/smallPlaceTierNoun.test.jsx — A SMALL PLACE IS NOT WRITTEN AS A TOWN
 * (SIZE lane, coherence program, 2026-11-03, root-cause failure 8).
 *
 * THE DEFECT, MEASURED BEFORE THE CURE. Over these 60 small places (20 thorps, 20 hamlets, 20
 * villages, fixed seeds, made the way the app makes them), 57 of 60 rendered a self-reference
 * to "town" (162 findings, 109 on Economics); the thorp Madinatqala's Economics tab read "The
 * roads into this town are busy and the town is poor" while its PDF read "this thorp… the
 * thorp". Two causes: seven screens never passed the noun to the desk, and the rewriter left
 * 'a town' / 'every town' / 'an ordinary town' alone.
 *
 * ⛔ THE RENDER, NOT A GREP: a screen that does not pass the noun is invisible to a source
 * search for the call; it is visible on the page.
 *
 * STORY TEXT WRITTEN AT GENERATION (history events, their effects and hooks, the founding,
 * the migration pressure line) speaks the same noun since SIZE ruling 2, and so does the arrival
 * scene's drawn hook (`ARRIVAL_SCENES` / `STRESS_DESCS` through
 * `generators/narrative/arrivalScene.js :: composeArrivalScene`, the SIZE REQUEST landed by lane
 * DOORS-2). No residual is excluded: every finding on every tab is an offender.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => (typeof selector === 'function' ? selector(mocks.store) : mocks.store);
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { tierNounFindings } from '../../src/domain/coherence/tierNounFindings.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { PowerTab } from '../../src/components/new/tabs/PowerTab.jsx';
import PlotHooksTab from '../../src/components/new/tabs/PlotHooksTab.jsx';

const TIERS = ['thorp', 'hamlet', 'village'];
const PER_TIER = 20;
const TABS = [
  ['Overview', (s) => <OverviewTab settlement={s} />],
  ['Economics', (s) => <EconomicsTab economicState={s.economicState} settlement={s} />],
  ['Services', (s) => <ServicesTab services={s.availableServices} settlement={s} />],
  ['Resources', (s) => <ResourcesTab settlement={s} />],
  ['Viability', (s) => <ViabilityTab settlement={s} />],
  ['History', (s) => <HistoryTab settlement={s} />],
  ['DailyLife', (s) => <DailyLifeTab settlement={s} />],
  ['Defense', (s) => <DefenseTab settlement={s} />],
  ['Power', (s) => <PowerTab powerStructure={s.powerStructure} settlement={s} />],
  ['PlotHooks', (s) => <PlotHooksTab settlement={s} />],
];
// W1 ECO (2026-11-07): DS-ECO-1 C4 v2 reworded under the owner's style law; W1-A0b (2026-11-08) drops its {access} slot, an A0b over-claim ("The way into {settlement} is busy and the town is poor").
const HEADER = /The \p{L}+ into [\p{L}' -]+? is busy and the \p{L}+ is poor/u;

function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}

/** @type {Array<{s: object, pages: Record<string, string>}>} */
const PLACES = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  mocks.store = {
    savedSettlements: [], campaigns: [], eventLog: [], userPrefs: {}, auth: { tier: 'premium' },
    isElevated: () => false, isSettlementClockBound: () => false, setUserPref: () => {},
  };
  for (const tier of TIERS) {
    for (let i = 0; i < PER_TIER; i += 1) {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null,
        { seed: `size-${tier}-${i}`, customContent: {} });
      const pages = {};
      for (const [tab, draw] of TABS) {
        const { container } = render(draw(s));
        expandAll(container);
        pages[tab] = container.textContent || '';
        cleanup();
      }
      PLACES.push({ s, pages });
    }
  }
}, 600_000);
afterEach(cleanup);

describe('the screen calls a small place by its own noun', () => {
  test('every place is small, so the arms below read the population they claim', () => {
    expect(PLACES).toHaveLength(60);
    expect(PLACES.every(({ s }) => TIERS.includes(s.tier))).toBe(true);
    expect(PLACES.reduce((n, p) => n + Object.values(p.pages).join('').length, 0)).toBeGreaterThan(200_000);
  });

  test('no rendered tab calls a thorp, hamlet or village a town (outside a kept comparison)', () => {
    const offenders = [];
    for (const { s, pages } of PLACES) {
      for (const [tab, text] of Object.entries(pages)) {
        for (const f of tierNounFindings(s, text)) offenders.push(`${s.tier} ${s.name} / ${tab}: …${f.context}…`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('the Economics header reads the same noun on the screen as in the PDF', () => {
    let compared = 0;
    const disagreements = [];
    for (const { s, pages } of PLACES) {
      const printed = JSON.stringify(buildPrintProse(s)).match(HEADER)?.[0] ?? null;
      const shown = pages.Economics.match(HEADER)?.[0] ?? null;
      if (!printed && !shown) continue;
      compared += 1;
      if (printed !== shown) disagreements.push(`${s.tier} ${s.name}: pdf "${printed}" / screen "${shown}"`);
    }
    expect(compared, 'no place drew the header; the arm compares nothing').toBeGreaterThan(0);
    expect(disagreements).toEqual([]);
  });
});
