/** @vitest-environment jsdom */
/**
 * workshop.test.jsx — the editor Workshop's two-card information architecture
 * (edit-IA refinement) and its read/write boundary. Pins:
 *   • The two grouping cards exist and hold the RIGHT sub-cards
 *     (Card 1 "The settlement" / Card 2 "Change the settlement").
 *   • The Faith & Pantheon edit card is GONE (faith read moved to the dossier's
 *     War & Faith tab; the deity-assign write relocated into Card 2).
 *   • All three living-world layer toggles (war / strategy / religion =
 *     "Awaken religion") sit together in the one Living-world Layers card.
 *   • A card RENDERS its read surface in view mode (free) and exposes WRITE
 *     controls only in edit mode (premium).
 *   • Each gate reaches the campaign's simulationRules via
 *     updateCampaignSimulationRules; a non-premium reach routes to the
 *     purchase modal, not a write.
 *
 * The Phase 2 read components and the premium write controls are stubbed to bare
 * markers so the test isolates the Workshop's own IA + the gate-toggle wiring.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';

// ── Stub the read surfaces (Phase 2) — bare markers. ──────────────────────────
vi.mock('../../src/components/settlement/ReadSystemStateBar.jsx', () => ({ default: () => <div data-testid="read-system-state-bar" /> }));
vi.mock('../../src/components/settlement/WarFaithSection.jsx', () => ({ default: () => <div data-testid="war-faith-section" /> }));
vi.mock('../../src/components/dossier/EngineSections.jsx', () => ({
  EconomicsGranarySection: () => <div data-testid="economics-granary-section" />,
  DefenseWarFrontSection: () => <div data-testid="defense-warfront-section" />,
  PowerSuccessionSection: () => <div data-testid="power-succession-section" />,
  NpcAgencySection: () => <div data-testid="npc-agency-section" />,
}));

// ── Stub the premium WRITE controls — bare markers so we can assert presence. ──
vi.mock('../../src/components/settlement/EventComposer.jsx', () => ({ default: () => <div data-testid="event-composer" /> }));
vi.mock('../../src/components/settlement/PrimaryDeityPicker.jsx', () => ({ default: () => <div data-testid="primary-deity-picker" /> }));
vi.mock('../../src/components/settlement/Timeline.jsx', () => ({ default: () => <div data-testid="timeline" /> }));
vi.mock('../../src/components/settlement/PendingIntentions.jsx', () => ({ default: () => <div data-testid="pending-intentions" /> }));
vi.mock('../../src/components/settlement/CoherencePanel.jsx', () => ({ default: () => <div data-testid="coherence-panel" /> }));
vi.mock('../../src/components/settlement/ProvenanceBlock.jsx', () => ({ default: () => <div data-testid="provenance-block" /> }));

// ── Store mock. A campaign owns the open save; its simulationRules are the gate
//    target. updateCampaignSimulationRules records the patch. ──────────────────
const updateRules = vi.fn(() => Promise.resolve());
const setPurchaseModalOpen = vi.fn();
const baseState = {
  campaigns: [{ id: 'camp-1', settlementIds: ['save-1'], worldState: { simulationRules: {} } }],
  savedSettlements: [{ id: 'save-1', name: 'Stoneford' }],
  updateCampaignSimulationRules: updateRules,
  setPurchaseModalOpen,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(baseState); }
  useStore.getState = () => baseState;
  return { useStore };
});

import Workshop from '../../src/components/settlement/Workshop.jsx';

const settlement = { name: 'Stoneford', npcs: [], factions: [], config: {} };

// Open a collapsible Workshop sub-card by clicking its header button.
function openCard(id) {
  fireEvent.click(screen.getByTestId(`workshop-card-${id}`).querySelector('button'));
}

describe('Workshop — two-card information architecture', () => {
  beforeEach(() => { updateRules.mockClear(); setPurchaseModalOpen.mockClear(); });
  afterEach(() => cleanup());

  it('groups the edit cards into the two named cards (right cards in each)', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);

    const settlementGroup = screen.getByTestId('workshop-group-the-settlement');
    const changeGroup = screen.getByTestId('workshop-group-change-the-settlement');

    // Card 1 "The settlement" — its own attributes.
    for (const id of ['causal-state', 'pressures-strength', 'power-succession', 'timeline-chronicle', 'provenance-links']) {
      expect(within(settlementGroup).getByTestId(`workshop-card-${id}`)).toBeTruthy();
    }
    // Card 2 "Change the settlement" — the write surface.
    for (const id of ['make-changes', 'assign-deity', 'living-world-layers']) {
      expect(within(changeGroup).getByTestId(`workshop-card-${id}`)).toBeTruthy();
    }
    // No leakage across the two cards.
    expect(within(settlementGroup).queryByTestId('workshop-card-make-changes')).toBeNull();
    expect(within(changeGroup).queryByTestId('workshop-card-causal-state')).toBeNull();
  });

  it('the Faith & Pantheon edit card is gone (faith relocated)', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);
    expect(screen.queryByTestId('workshop-card-faith-pantheon')).toBeNull();
  });

  it('all three layer toggles sit together in the Living-world Layers card', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);
    openCard('living-world-layers');
    const layers = screen.getByTestId('workshop-card-living-world-layers');
    // War + strategy + Awaken religion (religionDynamicsEnabled) are siblings here.
    expect(within(layers).getByTestId('workshop-gate-warLayerEnabled')).toBeTruthy();
    expect(within(layers).getByTestId('workshop-gate-settlementStrategyEnabled')).toBeTruthy();
    expect(within(layers).getByTestId('workshop-gate-religionDynamicsEnabled')).toBeTruthy();
  });

  it('the Edit-Dossier gate: write controls absent in view mode, present in edit mode', () => {
    // View mode (free / not editing): read surfaces present, no write controls.
    const { rerender } = render(<Workshop settlement={settlement} saveId="save-1" editMode={false} canEdit={false} />);
    expect(screen.getByTestId('workshop-rail')).toBeTruthy();
    openCard('causal-state');
    expect(screen.getAllByTestId('read-system-state-bar').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('event-composer')).toBeNull();
    expect(screen.queryByTestId('primary-deity-picker')).toBeNull();
    expect(screen.queryByTestId('timeline')).toBeNull();

    // Edit mode (premium / Edit Dossier on): the write controls mount.
    rerender(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);
    expect(screen.getByTestId('workshop-card-make-changes').getAttribute('data-mode')).toBe('edit');
  });

  it('every preserved edit action still mounts in edit mode', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);
    // Make Changes (event composer) and Timeline default-open in edit mode; the
    // deity-assign write lives in its own card. Open the ones that start closed.
    openCard('assign-deity');
    openCard('timeline-chronicle');
    openCard('provenance-links');
    expect(screen.getByTestId('event-composer')).toBeTruthy();     // Make Changes
    expect(screen.getByTestId('primary-deity-picker')).toBeTruthy(); // Assign deity
    expect(screen.getByTestId('timeline')).toBeTruthy();             // Timeline & Chronicle
    expect(screen.getByTestId('provenance-block')).toBeTruthy();     // Provenance & Links
  });

  it('changeExtras (Link / Edit-names) render inside the Change card', () => {
    render(
      <Workshop
        settlement={settlement}
        saveId="save-1"
        editMode
        canEdit
        changeExtras={<div data-testid="change-extras-marker" />}
      />,
    );
    const changeGroup = screen.getByTestId('workshop-group-change-the-settlement');
    expect(within(changeGroup).getByTestId('change-extras-marker')).toBeTruthy();
  });

  it('the layer gates reach simulationRules via updateCampaignSimulationRules', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);
    openCard('living-world-layers');
    fireEvent.click(screen.getByTestId('workshop-gate-warLayerEnabled').querySelector('input'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { warLayerEnabled: true });
    fireEvent.click(screen.getByTestId('workshop-gate-settlementStrategyEnabled').querySelector('input'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { settlementStrategyEnabled: true });
    fireEvent.click(screen.getByTestId('workshop-gate-religionDynamicsEnabled').querySelector('input'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { religionDynamicsEnabled: true });
  });

  it('a non-premium reach toward a gate routes to the purchase modal, not a write', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode={false} canEdit={false} />);
    openCard('living-world-layers');
    fireEvent.click(screen.getByTestId('workshop-gate-religionDynamicsEnabled').querySelector('input'));
    expect(updateRules).not.toHaveBeenCalled();
    expect(setPurchaseModalOpen).toHaveBeenCalled();
  });
});
