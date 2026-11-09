/** @vitest-environment jsdom */
/**
 * sectionRerollBoundary.test.jsx — THE REGENERATION BOUNDARY (the owner, 2026-11-09, verbatim:
 * "No. They would have to start from scratch and remember it building an eventual pipeline for
 * them to purchase premium. I'm setting this boundary."). Regenerating a SECTION of a generated
 * settlement is post-generation editing, law (1): every per-section reroll control is the
 * premium owner's. The dossier's two section rerolls (History, NPCs — the store's
 * `regenSection` regenerates exactly these, engineRemote.js REMOTE_REGEN_SECTIONS) are driven
 * through the real OutputContainer as a free and a premium owner. Red at the base: the free
 * owner held the History ↺ Reroll.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ state: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.state);
  useStore.getState = () => mocks.state;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/components/new/tabs/OverviewTab', () => ({ default: () => React.createElement('div', { 'data-testid': 'overview-stub' }) }));

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const town = () => generateSettlementPipeline({ settType: 'village', selectedStressesRandom: false, selectedStresses: [] }, null, { seed: 'section-reroll-boundary', customContent: {} });

function setViewer(tier) {
  for (const k of Object.keys(mocks.state)) delete mocks.state[k];
  Object.assign(mocks.state, {
    auth: { tier, user: { id: 'u1' } }, isElevated: () => false,
    settlement: null, savedSettlements: [], campaigns: [], userPrefs: {}, editMode: false,
    regenSection: vi.fn(), setPurchaseModalOpen: () => {}, setActivePricingMoment: () => {},
    applyUserEditAction: () => {}, revertUserEditAction: () => {},
  });
}

async function openTab(tier, tabName) {
  window.matchMedia = vi.fn((query) => ({ media: query, matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }));
  setViewer(tier);
  vi.resetModules();
  const OutputContainer = (await import('../../src/components/OutputContainer.jsx')).default;
  render(React.createElement(OutputContainer, { settlement: town() }));
  await screen.findAllByRole('tab', { name: /Overview/ });
  fireEvent.click(screen.getByRole('tab', { name: 'World' }));
  fireEvent.click(await screen.findByRole('tab', { name: tabName }));
}

afterEach(() => cleanup());

/** Text in the same header row as each tab's ↺ Reroll. */
const ANCHOR = { History: /years old/, NPCs: /Key Figures/ };

describe('the per-section rerolls are the premium owner\'s (law (1))', () => {
  for (const tabName of ['History', 'NPCs']) {
    test(`${tabName}: the premium owner holds ↺ Reroll; the free owner does not`, async () => {
      await openTab('premium', tabName);
      expect((await screen.findAllByRole('button', { name: /↺ Reroll/ }, { timeout: 15000 })).length).toBeGreaterThan(0);
      cleanup();
      await openTab('free', tabName);
      // LIVENESS FIRST: the tab's own header beside where the button stands has rendered.
      await screen.findByText(ANCHOR[tabName], {}, { timeout: 15000 });
      expect(screen.queryByRole('button', { name: /↺ Reroll/ })).toBeNull(); // anchored: the header text beside the button rendered just above
    }, 60000);
  }
});
