/**
 * @vitest-environment jsdom
 *
 * Component smoke tests for the tab views — render + unmount with
 * various settlement shapes (full, sparse, null) and assert no throws.
 *
 * Catches the class of bug where a tab assumes a field is present and
 * crashes when it isn't. The build only verifies compilation; this
 * verifies actual mount-time behavior.
 *
 * Uses React.createElement instead of JSX because the test-side
 * transform pipeline doesn't currently apply the React JSX transform
 * to test files (vitest 4 + rolldown). createElement is uglier but
 * unambiguous and needs no extra config.
 */

import React from 'react';
import { describe, test, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { OverviewTab }      from '../../src/components/new/tabs/OverviewTab.jsx';
import { ResourcesTab }     from '../../src/components/new/tabs/ResourcesTab.jsx';
import { EconomicsTab }     from '../../src/components/new/tabs/EconomicsTab.jsx';
import { DefenseTab }       from '../../src/components/new/tabs/DefenseTab.jsx';
import { HistoryTab }       from '../../src/components/new/tabs/HistoryTab.jsx';
import { NPCsTab }          from '../../src/components/new/tabs/NPCsTab.jsx';
import { PowerTab }         from '../../src/components/new/tabs/PowerTab.jsx';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import { ServicesTab }      from '../../src/components/new/tabs/ServicesTab.jsx';
import { ViabilityTab }     from '../../src/components/new/tabs/ViabilityTab.jsx';
import DMCompassTab         from '../../src/components/new/tabs/DMCompassTab.jsx';

const e = React.createElement;
const SEED = 'smoke-test-seed-2026-05';

let villageSettlement;
let metropolisSettlement;

beforeAll(() => {
  villageSettlement = generateSettlementPipeline(
    { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: SEED, customContent: {} },
  );
  metropolisSettlement = generateSettlementPipeline(
    { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
    null,
    { seed: `${SEED}-metro`, customContent: {} },
  );
});

afterEach(() => { cleanup(); });

describe('OverviewTab smoke', () => {
  test('mounts with a full village settlement', () => {
    expect(() => render(e(OverviewTab, { settlement: villageSettlement }))).not.toThrow();
  });
  test('mounts with a full metropolis settlement', () => {
    expect(() => render(e(OverviewTab, { settlement: metropolisSettlement }))).not.toThrow();
  });
  test('mounts with an extremely sparse settlement', () => {
    expect(() => render(e(OverviewTab, { settlement: { name: 'X', tier: 'thorp', population: 25 } }))).not.toThrow();
  });
  test('renders without crashing when settlement is null/undefined', () => {
    expect(() => render(e(OverviewTab, { settlement: null }))).not.toThrow();
    expect(() => render(e(OverviewTab, { settlement: undefined }))).not.toThrow();
  });
});

describe('ResourcesTab smoke', () => {
  test('mounts with a full village settlement', () => {
    expect(() => render(e(ResourcesTab, { settlement: villageSettlement }))).not.toThrow();
  });
  test('mounts with a full metropolis settlement', () => {
    expect(() => render(e(ResourcesTab, { settlement: metropolisSettlement }))).not.toThrow();
  });
  test('renders without crashing when settlement has no resources', () => {
    const { container } = render(e(ResourcesTab, { settlement: { name: 'X' } }));
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('EconomicsTab smoke', () => {
  // Extra value here: we extracted EconomicFlowsSection from this tab
  // last round — these tests guard the refactor.
  test('mounts with a full village settlement', () => {
    expect(() => render(e(EconomicsTab, {
      economicState: villageSettlement.economicState,
      settlement: villageSettlement,
    }))).not.toThrow();
  });
  test('mounts with a full metropolis settlement', () => {
    expect(() => render(e(EconomicsTab, {
      economicState: metropolisSettlement.economicState,
      settlement: metropolisSettlement,
    }))).not.toThrow();
  });
  test('renders Empty branch when economicState is missing', () => {
    const { container } = render(e(EconomicsTab, { economicState: null, settlement: { name: 'X' } }));
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ── Helper for the remaining tabs ────────────────────────────────────────
// Most tabs follow the same "render with full + sparse" shape. This
// helper keeps the smoke suite concise.
function smokeTab(label, Component, propsForFull, propsForSparse = { settlement: { name: 'X' } }) {
  describe(`${label} smoke`, () => {
    test('mounts with a full village settlement', () => {
      expect(() => render(e(Component, propsForFull(villageSettlement)))).not.toThrow();
    });
    test('mounts with a full metropolis settlement', () => {
      expect(() => render(e(Component, propsForFull(metropolisSettlement)))).not.toThrow();
    });
    test('mounts with a sparse settlement', () => {
      expect(() => render(e(Component, propsForSparse))).not.toThrow();
    });
  });
}

// Simple settlement-prop tabs
smokeTab('DefenseTab',       DefenseTab,       s => ({ settlement: s }));
smokeTab('HistoryTab',       HistoryTab,       s => ({ settlement: s }));
smokeTab('RelationshipsTab', RelationshipsTab, s => ({ settlement: s }));
smokeTab('ViabilityTab',     ViabilityTab,     s => ({ settlement: s }));
smokeTab('DMCompassTab',     DMCompassTab,     s => ({ settlement: s }));

// Multi-prop tabs — these take additional slices alongside `settlement`.
smokeTab('PowerTab',    PowerTab,    s => ({ powerStructure: s.powerStructure, settlement: s }),
  { powerStructure: null, settlement: { name: 'X' } });
smokeTab('ServicesTab', ServicesTab, s => ({ services: s.economicState?.institutionalServices || [], settlement: s }),
  { services: [], settlement: { name: 'X' } });
smokeTab('NPCsTab',     NPCsTab,     s => ({ npcs: s.npcs || [], settlement: s, pinnedIds: [] }),
  { npcs: [], settlement: { name: 'X' }, pinnedIds: [] });
