/**
 * @vitest-environment jsdom
 *
 * settlementMapPaneEdit.test.jsx — SM-3 the pane's cosmetic edit affordances.
 *
 * The edit chrome (reroll / labels / legend / reset) and drag-to-nudge appear ONLY
 * when canEdit (premium/founder) AND a saveId exists AND the pointer is fine
 * (desktop) — viewing stays free on every tier/platform. Each affordance commits
 * through the store's applyMapEdit into the blob-resident settlement.mapEdits.
 *
 * These pins drive the REAL global store (with the cloud seam stubbed), so a click
 * / drag is proven end-to-end into savedSettlements[id].settlement.mapEdits.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { useStore } from '../../src/store/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const SAVE_ID = 'sm3-ui-save';

/** Stub matchMedia so the pane's fine-pointer (desktop) gate is controllable. */
function stubMatchMedia(matches) {
  window.matchMedia = (q) => ({
    matches, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

/** Seed the global store with an active saved settlement so applyMapEdit persists. */
function seedStore(settlement) {
  useStore.setState({
    savedSettlements: [{
      id: SAVE_ID, name: settlement.name || 'Town', tier: settlement.tier,
      settlement: structuredClone(settlement),
      campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
      timestamp: '2020-01-01T00:00:00.000Z',
    }],
    activeSaveId: SAVE_ID,
    settlement: structuredClone(settlement),
    phase: 'draft', eventLog: [], systemState: {}, editedAt: null,
    flushSuppressPersist: false,
  });
}

const savedMapEdits = () => useStore.getState().savedSettlements.find(s => s.id === SAVE_ID)?.settlement?.mapEdits;

let fixture;
beforeEach(() => {
  stubMatchMedia(true); // desktop by default
  fixture = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'sm3-ui' });
  seedStore(fixture);
});
afterEach(() => {
  cleanup();
  useStore.setState({ savedSettlements: [], activeSaveId: null, settlement: null });
});

describe('SettlementMapPane — edit chrome gating', () => {
  test('chrome is ABSENT for a non-editor (viewing stays free)', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit={false} saveId={SAVE_ID} />);
    expect(container.querySelector('[data-town-edit-chrome]')).toBeNull();
    // …and the map itself still renders (view-only).
    expect(container.querySelector('[data-town-map]')).toBeTruthy();
  });

  test('chrome is ABSENT without a saveId (an unsaved draft has nowhere to persist)', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={null} />);
    expect(container.querySelector('[data-town-edit-chrome]')).toBeNull();
  });

  test('chrome is ABSENT on a coarse pointer (mobile posture: view + hover only)', () => {
    stubMatchMedia(false);
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    expect(container.querySelector('[data-town-edit-chrome]')).toBeNull();
  });

  test('chrome is PRESENT (all four affordances) for an editor on desktop with a saveId', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    expect(container.querySelector('[data-town-edit-chrome]')).toBeTruthy();
    expect(container.querySelector('[data-town-edit-reroll]')).toBeTruthy();
    expect(container.querySelector('[data-town-edit-labels]')).toBeTruthy();
    expect(container.querySelector('[data-town-edit-legend]')).toBeTruthy();
    expect(container.querySelector('[data-town-edit-reset]')).toBeTruthy();
  });
});

describe('SettlementMapPane — edit affordances commit to the blob', () => {
  test('Reroll bumps layoutVariant and enables Reset', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    expect(container.querySelector('[data-town-edit-reset]').disabled).toBe(true); // nothing to reset yet

    fireEvent.click(container.querySelector('[data-town-edit-reroll]'));
    expect(savedMapEdits()).toEqual({ layoutVariant: 1 });
    expect(container.querySelector('[data-town-edit-reset]').disabled).toBe(false);

    fireEvent.click(container.querySelector('[data-town-edit-reroll]'));
    expect(savedMapEdits()).toEqual({ layoutVariant: 2 }); // monotone
  });

  test('Labels toggle persists legendPrefs.showLabels AND renders district labels', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    expect(container.querySelectorAll('svg text').length).toBe(0); // no labels before

    fireEvent.click(container.querySelector('[data-town-edit-labels]'));
    expect(savedMapEdits()).toEqual({ legendPrefs: { showLabels: true } });
    expect(container.querySelectorAll('svg text').length).toBeGreaterThan(0); // labels now drawn

    fireEvent.click(container.querySelector('[data-town-edit-labels]')); // toggle off
    expect(savedMapEdits()).toBeUndefined(); // container dropped ⇒ byte-identity
    expect(container.querySelectorAll('svg text').length).toBe(0);
  });

  test('Legend toggle persists legendPrefs.showLegend AND renders the legend', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    expect(container.querySelector('[data-town-legend]')).toBeNull();

    fireEvent.click(container.querySelector('[data-town-edit-legend]'));
    expect(savedMapEdits()).toEqual({ legendPrefs: { showLegend: true } });
    expect(container.querySelector('[data-town-legend]')).toBeTruthy();
  });

  test('Reset clears the whole container (restores byte-identity)', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    fireEvent.click(container.querySelector('[data-town-edit-reroll]'));
    fireEvent.click(container.querySelector('[data-town-edit-labels]'));
    expect(savedMapEdits()).toBeTruthy();

    fireEvent.click(container.querySelector('[data-town-edit-reset]'));
    expect(savedMapEdits()).toBeUndefined(); // gone
  });

  test('drag-to-nudge a building past the dead-zone persists a pin on its anchor', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    const building = container.querySelector('[data-town-building]');
    expect(building).toBeTruthy();
    const anchor = building.getAttribute('data-town-building');

    fireEvent.pointerDown(building, { pointerId: 1, button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(building, { pointerId: 1, clientX: 150, clientY: 130 }); // dx 50, dy 30 (past dead-zone)
    fireEvent.pointerUp(building, { pointerId: 1, clientX: 150, clientY: 130 });

    const edits = savedMapEdits();
    expect(Array.isArray(edits?.pins)).toBe(true);
    const pin = edits.pins.find(p => p.anchor === anchor);
    expect(pin).toBeTruthy();
    expect(pin.dx).toBe(50);
    expect(pin.dy).toBe(30);
  });

  test('a within-dead-zone press does NOT create a pin (it is a click, not a drag)', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    const building = container.querySelector('[data-town-building]');

    fireEvent.pointerDown(building, { pointerId: 2, button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(building, { pointerId: 2, clientX: 102, clientY: 101 }); // < 4px
    fireEvent.pointerUp(building, { pointerId: 2, clientX: 102, clientY: 101 });

    expect(savedMapEdits()).toBeUndefined(); // no pin, no container
  });
});
