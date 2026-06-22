/** @vitest-environment jsdom */
/**
 * workshop.test.jsx — the editor Workshop read/write boundary (UX overhaul
 * Phase 6, plan §4.3). Pins:
 *   • A card RENDERS its read surface in view mode (free) and exposes WRITE
 *     controls only in edit mode (premium).
 *   • The 3 living-world gate toggles (war / strategy / religion) in the
 *     Faith/War cards reach the campaign's simulationRules via
 *     updateCampaignSimulationRules.
 *
 * The Phase 2 read components and the premium write controls are stubbed to bare
 * markers so the test isolates the Workshop's own gating + the gate-toggle wiring.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

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

describe('Workshop — read/write boundary', () => {
  beforeEach(() => { updateRules.mockClear(); setPurchaseModalOpen.mockClear(); });
  afterEach(() => cleanup());

  it('view mode (free): read surfaces present, write controls absent', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode={false} canEdit={false} />);
    // The seven cards render their read surface (data-mode="view").
    expect(screen.getByTestId('workshop-rail')).toBeTruthy();
    expect(screen.getByTestId('workshop-card-causal-state').getAttribute('data-mode')).toBe('view');
    // Per the P1 reorder, in the read-only View the Workshop cards start
    // COLLAPSED (the dossier above is the hero; the rail is the collapsed
    // drill-down). Open the Causal State card to reveal its read surface.
    fireEvent.click(screen.getByTestId('workshop-card-causal-state').querySelector('button'));
    // The Causal State card's surviving read surface is the four-dimension health
    // glance. The 16-variable Substrate grid + What-changed deltas were de-duped
    // out of the Workshop (the tabbed dossier owns those reads now — dossier
    // keystone §4), so the card keeps only the ReadSystemStateBar.
    expect(screen.getAllByTestId('read-system-state-bar').length).toBeGreaterThan(0);
    // ...but the premium write controls are NOT mounted.
    expect(screen.queryByTestId('event-composer')).toBeNull();
    expect(screen.queryByTestId('primary-deity-picker')).toBeNull();
    expect(screen.queryByTestId('timeline')).toBeNull();
  });

  it('edit mode (premium): write controls appear in the cards', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);
    expect(screen.getByTestId('workshop-card-make-changes').getAttribute('data-mode')).toBe('edit');
    // Cards default collapsed (except Causal State) — open the ones with write controls.
    fireEvent.click(screen.getByTestId('workshop-card-faith-pantheon').querySelector('button'));
    fireEvent.click(screen.getByTestId('workshop-card-make-changes').querySelector('button'));
    fireEvent.click(screen.getByTestId('workshop-card-timeline-chronicle').querySelector('button'));
    expect(screen.getByTestId('event-composer')).toBeTruthy();
    expect(screen.getByTestId('primary-deity-picker')).toBeTruthy();
    expect(screen.getByTestId('timeline')).toBeTruthy();
  });

  it('the 3 gate toggles reach simulationRules via updateCampaignSimulationRules', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode canEdit />);

    // Religion gate lives in the Faith & Pantheon card (open by mount via default
    // collapse — the card defaults closed except Causal State, so open it first).
    fireEvent.click(screen.getByTestId('workshop-card-faith-pantheon').querySelector('button'));
    fireEvent.click(screen.getByTestId('workshop-gate-religionDynamicsEnabled').querySelector('input'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { religionDynamicsEnabled: true });

    // War + strategy gates live in the Make Changes card.
    fireEvent.click(screen.getByTestId('workshop-card-make-changes').querySelector('button'));
    fireEvent.click(screen.getByTestId('workshop-gate-warLayerEnabled').querySelector('input'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { warLayerEnabled: true });
    fireEvent.click(screen.getByTestId('workshop-gate-settlementStrategyEnabled').querySelector('input'));
    expect(updateRules).toHaveBeenCalledWith('camp-1', { settlementStrategyEnabled: true });
  });

  it('gate toggle for a non-premium user routes to the purchase modal, not a write', () => {
    render(<Workshop settlement={settlement} saveId="save-1" editMode={false} canEdit={false} />);
    // Open the Faith card and click its religion gate input.
    fireEvent.click(screen.getByTestId('workshop-card-faith-pantheon').querySelector('button'));
    fireEvent.click(screen.getByTestId('workshop-gate-religionDynamicsEnabled').querySelector('input'));
    expect(updateRules).not.toHaveBeenCalled();
    expect(setPurchaseModalOpen).toHaveBeenCalled();
  });
});
