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

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { SettlementCard } from '../../src/components/settlements/SettlementCard.jsx';

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
