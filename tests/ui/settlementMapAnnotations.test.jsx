/**
 * @vitest-environment jsdom
 *
 * settlementMapAnnotations.test.jsx — SM-5 (5) the DM pin/annotation layer, end-to-end.
 *
 * An editor (canEdit + saveId + desktop) can toggle marker mode, click the map to
 * place a labelled DM-only or player-visible marker, and remove it — each commit
 * riding the store's applyMapEdit into settlement.mapEdits.annotations. A non-editor
 * sees existing markers (viewing is free) but never the placement affordances.
 */
import { describe, test, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { useStore } from '../../src/store/index.js';
import { preloadCampaignRuntimeForStore } from '../../src/store/campaignRuntimeBridge.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

// The pane's bridge reads getCampaignForSettlement during render; since 6e7acc4d
// that delegate THROWS until the campaign runtime preloads, and production mounts
// the pane only behind AppViews' `campaignLazy` gate, which awaits this preload
// (pinned by tests/store/campaignRuntimeRouteGate.test.js).
beforeAll(async () => { await preloadCampaignRuntimeForStore(useStore); });

const SAVE_ID = 'sm5-ann-save';

function stubMatchMedia(matches) {
  window.matchMedia = (q) => ({
    matches, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

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
const savedAnnotations = () => useStore.getState().savedSettlements.find(s => s.id === SAVE_ID)?.settlement?.mapEdits?.annotations;

let fixture;
beforeEach(() => {
  stubMatchMedia(true);
  fixture = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'sm5-ann' });
  seedStore(fixture);
});
afterEach(() => {
  cleanup();
  useStore.setState({ savedSettlements: [], activeSaveId: null, settlement: null });
});

describe('DM markers — placement + persistence', () => {
  test('an editor toggles marker mode, places a DM-only marker, and it persists', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    // the Markers toggle is in the edit chrome
    const toggle = container.querySelector('[data-town-edit-annotate]');
    expect(toggle).toBeTruthy();
    fireEvent.click(toggle);
    // clicking the map background opens the composer
    fireEvent.click(container.querySelector('[data-town-bg]'), { clientX: 200, clientY: 150 });
    const input = container.querySelector('[data-town-annotation-input]');
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: 'Ambush point' } });
    fireEvent.click(container.querySelector('[data-town-annotation-composer] button[aria-label="Add this marker"]'));
    // persisted to the blob, default audience DM-only
    const ann = savedAnnotations();
    expect(ann).toHaveLength(1);
    expect(ann[0].label).toBe('Ambush point');
    expect(ann[0].audience).toBe('dm');
    // and it renders as a DM-only marker
    expect(container.querySelector('[data-town-annotation="0"][data-audience="dm"]')).toBeTruthy();
  });

  test('a placed marker can be removed in marker mode', () => {
    // seed with an existing marker
    fixture = { ...fixture, mapEdits: { annotations: [{ x: 300, y: 300, label: 'Old pin', audience: 'dm' }] } };
    seedStore(fixture);
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    expect(container.querySelector('[data-town-annotation="0"]')).toBeTruthy();
    fireEvent.click(container.querySelector('[data-town-edit-annotate]')); // enter marker mode
    fireEvent.click(container.querySelector('[data-town-annotation-remove="0"]'));
    expect(savedAnnotations()).toBeUndefined(); // removing the only marker clears the container
  });
});

describe('DM markers — viewing is free, editing is gated', () => {
  test('a non-editor sees existing markers but no placement affordances', () => {
    fixture = { ...fixture, mapEdits: { annotations: [{ x: 100, y: 100, label: 'The inn', audience: 'player' }] } };
    seedStore(fixture);
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit={false} saveId={null} />);
    // marker renders (player-visible)
    expect(container.querySelector('[data-town-annotation="0"][data-audience="player"]')).toBeTruthy();
    // but no Markers toggle and no remove affordance
    expect(container.querySelector('[data-town-edit-annotate]')).toBeNull();
    expect(container.querySelector('[data-town-annotation-remove="0"]')).toBeNull();
  });
});
