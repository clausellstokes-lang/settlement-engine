/**
 * @vitest-environment jsdom
 *
 * settlementMapIllustratedCensus.test.jsx — THE ILLUSTRATED TOWN (IT-6, THE FACE): the census row.
 *
 * §8 DONE-WHEN #9: every existing map behavior stays REACHABLE when the illustrated lens is worn.
 * The illustrated underlay is a `pointer-events:none` art layer mounted UNDER the interactive
 * layers, and NONE of the map's affordances gate on the lens — they gate on saveId / editing /
 * viewMode, all orthogonal to which lens is drawn. This pins that co-existence STRUCTURALLY:
 * rendered in illustrated OWNER mode (canEdit + a saved blob + desktop) the underlay and EVERY
 * affordance surface are present at once — the hover/pin hit-targets, the cosmetic edit chrome,
 * the export menu, the fog table (DM chrome), the panorama toggle, and the lens picker
 * (with illustrated selected + parchment one click away for flip-back). A regression that made any
 * affordance mutually-exclusive with the illustrated lens reds here.
 *
 * Test-only; no source touched. Mirrors the store-seeding of settlementMapPaneEdit.test.jsx.
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

const SAVE_ID = 'it6-census-save';

/** Stub matchMedia so the pane's fine-pointer (desktop) gate is on — the edit posture. */
function stubMatchMedia(matches) {
  window.matchMedia = (q) => ({
    matches, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

/** Seed the global store with an active saved settlement so the owner surfaces mount + persist. */
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

/** The Plan/Panorama Segmented button whose visible label matches. */
function viewButton(container, label) {
  const toggle = container.querySelector('[data-town-view-toggle]');
  return [...toggle.querySelectorAll('button')].find((b) => b.textContent.trim() === label);
}

let fixture;
beforeEach(() => {
  stubMatchMedia(true); // desktop
  fixture = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'it6-census' });
  seedStore(fixture);
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('SettlementMapPane — the illustrated-mode census (IT-6 done-when #9)', () => {
  test('every map affordance co-exists with the illustrated underlay in owner mode', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    // Wear the illustrated lens — one click on the decision surface (the lens picker).
    fireEvent.click(container.querySelector('[data-town-lens="illustrated"]'));

    // The map is now WORN in the illustrated lens: the static glyph underlay is mounted…
    const underlay = container.querySelector('[data-town-illustrated]');
    expect(underlay).toBeTruthy();
    // …and it is a pointer-events:none art layer, so every interactive affordance underneath fires.
    expect(underlay.getAttribute('style') || '').toContain('pointer-events: none');

    // DECISION SURFACE — the picker shows illustrated SELECTED, with parchment one click away.
    expect(container.querySelector('[data-town-lens-switcher]')).toBeTruthy();
    expect(container.querySelector('[data-town-lens="illustrated"]').getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-town-lens="parchment"]')).toBeTruthy();

    // HOVER + PIN — the district / building hit-targets stay mounted (they only go transparent).
    expect(container.querySelectorAll('[data-town-district]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-town-building]').length).toBeGreaterThan(0);

    // EDITS — the cosmetic edit chrome (reroll / labels / legend / reset) is present.
    expect(container.querySelector('[data-town-edit-chrome]')).toBeTruthy();

    // EXPORT MENU — the per-settlement export affordance is present (owner saveId).
    expect(container.querySelector('[data-town-export-toggle]')).toBeTruthy();

    // FOG — the DM table-layer chrome is present, so a session can be started (the overlay itself
    // is dormant until a reveal exists — SettlementMapFog returns null with no reveal).
    expect(container.querySelector('[data-town-fog-controls]')).toBeTruthy();

    // PANORAMA TOGGLE — the Plan / Panorama switch is present and starts on Plan.
    expect(viewButton(container, 'Plan')).toBeTruthy();
    expect(viewButton(container, 'Panorama')).toBeTruthy();
    expect(viewButton(container, 'Plan').getAttribute('aria-pressed')).toBe('true');
  });

  test('the panorama projection is reachable in illustrated mode and wears the glyph facades', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit saveId={SAVE_ID} />);
    fireEvent.click(container.querySelector('[data-town-lens="illustrated"]'));
    expect(container.querySelector('[data-town-illustrated]')).toBeTruthy();

    // Flip to panorama WHILE illustrated is worn — the oblique projection mounts…
    fireEvent.click(viewButton(container, 'Panorama'));
    const overlay = container.querySelector('[data-town-panorama]');
    expect(overlay).toBeTruthy();
    // …and it drew the projected town (the glyph facades compile to primitive ops).
    expect(overlay.querySelectorAll('polygon, line, rect, circle, path').length).toBeGreaterThan(0);
    // the plan-view illustrated underlay stayed mounted behind it (an instant flip back).
    expect(container.querySelector('[data-town-illustrated]')).toBeTruthy();
  });
});
