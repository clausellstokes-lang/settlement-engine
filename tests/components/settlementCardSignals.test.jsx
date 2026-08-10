/**
 * @vitest-environment jsdom
 *
 * settlementCardSignals.test.jsx — the Library card's living-world signal row +
 * health pip + select-mode (UX Phase 3).
 *
 * Pins the SELF-GATING invariant at the component layer: a peaceful, non-campaign,
 * deity-free card renders NO living-world signal row (looks as today), while a
 * war/deity campaign card renders it. Also pins the select-mode checkbox.
 */

import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { SettlementCard } from '../../src/components/settlements/SettlementCard.jsx';
import { useStore } from '../../src/store/index.js';
import { preloadCampaignRuntimeForStore } from '../../src/store/campaignRuntimeBridge.js';

// SettlementCard reads campaign actions (getSettlementDeletionBlock,
// getCampaignMutationBlock, getCampaignMembershipBlock) DURING RENDER. Since the
// cold-slice split at 6e7acc4d those names are always present as stable delegates
// that THROW CampaignRuntimeNotReadyError until the runtime chunk preloads — so
// the defensive `state.getX?.(…)` at the call site no longer short-circuits.
// Production never renders this card cold: every campaign-capable route is behind
// AppViews' `campaignLazy` gate, which awaits exactly this preload before it will
// import the view (both facts pinned by tests/store/campaignRuntimeRouteGate.test.js).
// Satisfying the same precondition here renders the card the way production does,
// rather than outside its gate. Every assertion below is unchanged.
beforeAll(async () => { await preloadCampaignRuntimeForStore(useStore); });

afterEach(cleanup);

const baseProps = {
  allModifiers: new Map(),
  onView: vi.fn(),
  deleteId: null,
  setDeleteId: vi.fn(),
  deleteConfirmed: vi.fn(),
  campaigns: [],
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
  onCanonize: vi.fn(),
};

const peacefulSave = {
  id: 's-peace', name: 'Greenhollow', tier: 'town', timestamp: Date.now(),
  campaignState: { phase: 'draft' },
  settlement: {
    economicState: { prosperity: 'Comfortable' },
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    powerStructure: { factions: [{ faction: 'Council', power: 100 }] },
  },
};

describe('SettlementCard — living-world self-gating', () => {
  it('a peaceful, non-campaign, deity-free card renders NO signal row', () => {
    render(<SettlementCard s={peacefulSave} {...baseProps} currentCampaignId={null} />);
    // The card mounts...
    expect(screen.getByText('Greenhollow')).toBeTruthy();
    // ...but the living-world row is absent (byte-identical to today).
    expect(screen.queryByTestId('living-world-signal-row')).toBeNull();
  });

  it('a deity-bearing card renders the signal row with the faith pip', () => {
    const deitySave = {
      ...peacefulSave, id: 's-faith',
      settlement: {
        ...peacefulSave.settlement,
        config: { ...peacefulSave.settlement.config, primaryDeitySnapshot: { name: 'Sol', rankAxis: 'major', alignmentAxis: 'good' } },
      },
    };
    render(<SettlementCard s={deitySave} {...baseProps} currentCampaignId={null} />);
    const row = screen.getByTestId('living-world-signal-row');
    expect(within(row).getByText(/Sol/)).toBeTruthy();
  });

  it('a campaign card under siege renders the at-war/siege badge', () => {
    render(
      <SettlementCard
        s={{ ...peacefulSave, id: 's-warzone' }}
        {...baseProps}
        currentCampaignId="camp-1"
        worldState={{ deployments: { enemy: { targetId: 's-warzone' } } }}
        regionalGraph={null}
        nameFor={(id) => (id === 'enemy' ? 'Ironhold' : String(id))}
      />,
    );
    const row = screen.getByTestId('living-world-signal-row');
    expect(within(row).getByText(/siege/i)).toBeTruthy();
  });

  it('always shows a health pip (derived, like ReadSystemStateBar)', () => {
    render(<SettlementCard s={peacefulSave} {...baseProps} currentCampaignId={null} />);
    expect(screen.getByTestId('health-pip')).toBeTruthy();
  });
});

describe('SettlementCard — select mode', () => {
  it('renders a checkbox in select mode and toggles selection', () => {
    const onToggleSelect = vi.fn();
    render(
      <SettlementCard
        s={peacefulSave}
        {...baseProps}
        currentCampaignId={null}
        selectMode
        selected={false}
        onToggleSelect={onToggleSelect}
      />,
    );
    const box = screen.getByLabelText('Select Greenhollow');
    fireEvent.click(box);
    expect(onToggleSelect).toHaveBeenCalledWith('s-peace');
  });

  it('no checkbox when select mode is off', () => {
    render(<SettlementCard s={peacefulSave} {...baseProps} currentCampaignId={null} selectMode={false} />);
    expect(screen.queryByLabelText('Select Greenhollow')).toBeNull();
  });
});

describe('SettlementCard — AUDIT-2.2 frozen-card read-only export', () => {
  // A retention-frozen (plan-lapsed) save: the paid-rights floor says the owner
  // can always extract what they made.
  const frozenSave = {
    id: 's-frozen', name: 'Ashfen', tier: 'town', timestamp: Date.now(),
    accessState: 'inactive_plan',
    settlement: { economicState: { prosperity: 'Comfortable' }, config: {} },
  };

  it('offers a read-only Export PDF alongside Reactivate on a frozen card', () => {
    render(<SettlementCard s={frozenSave} {...baseProps} currentCampaignId={null} canReactivate={false} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /reactivate/i })).toBeTruthy();
    // The frozen export is NOT the simulation-resuming Open action.
    expect(screen.queryByRole('button', { name: /open ashfen/i })).toBeNull();
  });

  it('an active card shows Open, never the frozen Export affordance', () => {
    const activeSave = { ...frozenSave, id: 's-active', accessState: 'active' };
    render(<SettlementCard s={activeSave} {...baseProps} currentCampaignId={null} />);
    expect(screen.getByRole('button', { name: /open ashfen/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /export pdf/i })).toBeNull();
  });
});

describe('SettlementCard — Advance Time CTA (no longer a dead-end)', () => {
  it('standalone card routes Advance Time to the move-to-campaign popover', () => {
    render(<SettlementCard s={peacefulSave} {...baseProps} currentCampaignId={null} campaigns={[{ id: 'c1', name: 'Camp One' }]} />);
    fireEvent.click(screen.getByLabelText('More actions'));
    fireEvent.click(screen.getByText('Advance Time'));
    // The move popover opened (the campaign target is now offered).
    expect(screen.getByText('Add to Camp One')).toBeTruthy();
  });

  it('campaign card deep-links Advance Time via onAdvanceTime', () => {
    const onAdvanceTime = vi.fn();
    render(<SettlementCard s={peacefulSave} {...baseProps} currentCampaignId="camp-1" onAdvanceTime={onAdvanceTime} />);
    fireEvent.click(screen.getByLabelText('More actions'));
    fireEvent.click(screen.getByText('Advance Time'));
    expect(onAdvanceTime).toHaveBeenCalledWith('camp-1');
  });
});

describe('SettlementCard — saved-on date (defect 7b: never "Invalid Date")', () => {
  // Local/anon saves stamp only the numeric `savedAt`, never a top-level
  // `timestamp` (saves.js localSaveEntry), so a fresh draft used to render the
  // literal "Invalid Date". The card must fall back to `savedAt` and never render
  // an unparseable date.
  it('falls back to savedAt when timestamp is absent — real date, no "Invalid Date"', () => {
    const draftNoTimestamp = {
      id: 's-draft', name: 'Draftholm', tier: 'village',
      savedAt: Date.parse('2026-07-01T10:00:00Z'), // valid epoch, no `timestamp`
      settlement: { economicState: { prosperity: 'Comfortable' }, config: {} },
    };
    render(<SettlementCard s={draftNoTimestamp} {...baseProps} currentCampaignId={null} />);
    expect(screen.queryByText(/Invalid Date/i)).toBeNull();
    // A real formatted date line renders from the savedAt fallback (day mon yy).
    expect(screen.getByText(/\d{1,2}\s+\w{3}\s+\d{2}/)).toBeTruthy();
  });

  it('drops the date line entirely when neither timestamp nor savedAt is parseable', () => {
    const noDates = {
      id: 's-nodate', name: 'Nowhen', tier: 'hamlet',
      settlement: { economicState: { prosperity: 'Comfortable' }, config: {} },
    };
    render(<SettlementCard s={noDates} {...baseProps} currentCampaignId={null} />);
    expect(screen.getByText('Nowhen')).toBeTruthy();
    expect(screen.queryByText(/Invalid Date/i)).toBeNull();
  });
});
