/** @vitest-environment jsdom */
/**
 * dossierPathSteps.test.js — X-55 TRAIN THE DM, unit 1: the reading paths' anti-drift pin.
 *
 * The world map's tour learned this the hard way (worldMapTourSteps.test.js, the stale
 * "Wizard News" step): a guided step whose anchor no longer exists degrades to a centred
 * card and nobody notices. So every ANCHORED step of every dossier path must resolve to a
 * real `data-tour` anchor in the RENDERED dossier — the landing fixture's town (seed lf-033,
 * its own recorded forge config) at desktop width and at phone width, driven the way the
 * path drives it (a step's `tab` is clicked open through the real strips; a step that
 * `open`s Tonight renders with the Tonight sheet open). And a step whose target is absent
 * must show the centred card, never skip silently.
 */
import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ store: {} }));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

import OutputContainer, { TAB_GROUPS } from '../../src/components/OutputContainer.jsx';
import GuidedTour from '../../src/components/map/WorldMapTour.jsx';
import { DOSSIER_PATHS, DOSSIER_PATH_IDS } from '../../src/components/dossier/DossierPathSteps.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { fixture } from '../../src/components/home/landingFixture.js';

const h = React.createElement;

let town;
beforeAll(() => {
  town = generateSettlementPipeline({ ...fixture.forge.config }, null, { seed: fixture.seed, customContent: {} });
}, 120_000);

// One controlled MediaQueryList (the phone-floor walk's reason: useIsMobile caches its store).
const viewport = { matches: false, listeners: new Set() };
function installMatchMedia(matches) {
  viewport.matches = matches;
  if (!window.matchMedia?.SF_CONTROLLED) {
    const mock = vi.fn((query) => ({
      media: query,
      get matches() { return viewport.matches; },
      addEventListener: (_t, fn) => viewport.listeners.add(fn),
      removeEventListener: (_t, fn) => viewport.listeners.delete(fn),
      addListener: (fn) => viewport.listeners.add(fn),
      removeListener: (fn) => viewport.listeners.delete(fn),
    }));
    mock.SF_CONTROLLED = true;
    window.matchMedia = mock;
  }
  for (const fn of viewport.listeners) fn({ matches });
}

function freshStore(tableViewOpen) {
  return {
    settlement: town, aiSettlement: null, setAiSettlement: vi.fn(), clearAiSettlement: vi.fn(),
    regenSection: vi.fn(), requestNarrative: vi.fn(), requestDailyLife: vi.fn(), getCost: vi.fn(() => 0),
    creditBalance: 0, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '',
    aiPartialFailure: null, aiViolations: null, clearAiViolations: vi.fn(), lastRegenerationDelta: null,
    clearLastRegenerationDelta: vi.fn(), showNarrative: false, setShowNarrative: vi.fn(),
    savedSettlements: [{ id: 'save-1', settlement: town }], campaigns: [], eventLog: [], systemState: null,
    pinNpc: vi.fn(), unpinNpc: vi.fn(), queueEdit: vi.fn(), applyUserEditAction: vi.fn(),
    revertUserEditAction: vi.fn(), focusEntity: vi.fn(), editMode: false, phase: 'draft',
    auth: { tier: 'premium' }, isElevated: () => false, isSettlementClockBound: () => false,
    userPrefs: { tableViewOpen }, setUserPref: vi.fn(),
  };
}

const groupOf = (tab) => Object.entries(TAB_GROUPS).find(([, g]) => g.tabs.includes(tab))?.[0];

/** Drive the rendered dossier to the step's state the way the path does, then find its anchor. */
async function resolveStep(container, step) {
  if (step.tab) {
    const gid = groupOf(step.tab);
    const group = container.querySelector(`#sf-group-${gid}`);
    if (group) fireEvent.click(group);
    await waitFor(() => expect(container.querySelector(`#sf-tab-${step.tab}`)).not.toBeNull());
    fireEvent.click(container.querySelector(`#sf-tab-${step.tab}`));
  }
  await waitFor(() => expect(document.querySelector(`[data-tour="${step.sel}"]`)).not.toBeNull(), { timeout: 8000 });
  return true;
}

afterEach(cleanup);

describe('X-55 — the dossier paths: shape', () => {
  test('three paths, in the X-55 order, each an ordered list of { sel, title, body } steps', () => {
    expect(DOSSIER_PATH_IDS).toEqual(['tonight', 'hub', 'region']);
    for (const id of DOSSIER_PATH_IDS) {
      const steps = DOSSIER_PATHS[id].steps;
      expect(steps.length, id).toBeGreaterThanOrEqual(3);
      const seen = new Set();
      for (const s of steps) {
        expect(s.sel === null || (typeof s.sel === 'string' && /^[a-z][a-z_-]*$/.test(s.sel)), `${id}: bad sel ${s.sel}`).toBe(true);
        expect(typeof s.title === 'string' && s.title.length > 0, `${id}: empty title`).toBe(true);
        expect(typeof s.body === 'string' && s.body.length > 10, `${id}: thin body ${s.title}`).toBe(true);
        if (s.sel) { expect(seen.has(s.sel), `${id}: duplicate anchor ${s.sel}`).toBe(false); seen.add(s.sel); }
        if (s.tab) expect(groupOf(s.tab), `${id}: ${s.tab} is in no tab group`).toBeTruthy();
      }
    }
  });

  test('the walks the X-55 entry names: Tonight first, the hub through the six tabs, the region outward', () => {
    expect(DOSSIER_PATHS.tonight.steps.map((s) => s.sel)).toEqual(
      ['tonight', 'tonight-crisis', 'tonight-people', 'tonight-facts', 'tonight-hooks', null]);
    expect(DOSSIER_PATHS.hub.steps.map((s) => s.tab ?? null)).toEqual(
      ['overview', 'power', 'npcs', 'economics', 'defense', 'plot_hooks', null]);
    expect(DOSSIER_PATHS.region.steps.map((s) => s.tab ?? null)).toEqual([null, 'relationships', 'chronicle']);
  });
});

describe.each([['desktop', false], ['phone', true]])('X-55 — every anchored step resolves in the rendered lf-033 dossier (%s)', (_w, phone) => {
  beforeEach(() => { installMatchMedia(phone); });

  for (const id of ['tonight', 'hub', 'region']) {
    test(`${id}: each anchored step finds its control`, async () => {
      const resolved = [];
      for (const step of DOSSIER_PATHS[id].steps.filter((s) => s.sel)) {
        mocks.store = freshStore(step.open === 'tonight');
        const { container, unmount } = render(h(OutputContainer, { settlement: town, readOnly: true, saveId: 'save-1' }));
        await resolveStep(container, step);
        resolved.push(step.sel);
        unmount();
      }
      expect(resolved).toEqual(DOSSIER_PATHS[id].steps.filter((s) => s.sel).map((s) => s.sel));
    }, 60_000);
  }
});

describe('X-55 — an absent target shows the centred card, never a silent skip', () => {
  test('a missing anchor renders the step as a centred card with no spotlight; a present one spotlights', () => {
    installMatchMedia(false);
    const steps = [{ sel: 'no-such-anchor', title: 'Absent step', body: 'This target is not on screen.' }];
    const { container, rerender } = render(h('div', null, h(GuidedTour, { open: true, steps, onClose: () => {} })));
    expect(container.textContent).toContain('Absent step');
    expect(container.textContent).toContain('Step 1 of 1');
    expect(container.querySelector('[style*="9999px"]')).toBeNull();
    rerender(h('div', null, h('span', { 'data-tour': 'here' }, 'x'),
      h(GuidedTour, { open: true, steps: [{ sel: 'here', title: 'Present step', body: 'This target is on screen.' }], onClose: () => {} })));
    expect(container.textContent).toContain('Present step');
    expect(container.querySelector('[style*="9999px"]')).not.toBeNull();
  });
});
