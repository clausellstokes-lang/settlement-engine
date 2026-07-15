/** @vitest-environment jsdom */
/**
 * treatyDossierTab.test.jsx — W-PEACE-3 the treaty surfaces (§13 legibility).
 *
 * Pins the two UI homes for treaties-as-documents:
 *   • the dossier's War & Faith tab renders a settlement's treaty where it is a
 *     party — the terms, the house-voice compliance, and the fraying seam;
 *   • the realm TreatyPanel renders every treaty (and an honest empty note when
 *     none stand — the dormancy render).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      auth: { tier: 'premium' }, isElevated: () => false,
      setPurchaseModalOpen: () => {}, setActivePricingMoment: () => {},
      campaigns: [], savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import WarFaithTab from '../../src/components/new/tabs/WarFaithTab.jsx';
import TreatyPanel from '../../src/components/map/TreatyPanel.jsx';

/** A canonized campaign whose treaties ledger holds one Iron>Weak treaty, tribute
 *  strained (so the fraying seam and house voice render). */
function campaignWithTreaty() {
  return {
    id: 'c1', settlementIds: ['iron', 'weak'],
    worldState: {
      tick: 60, canonizedAt: '2026-01-01T00:00:00.000Z',
      spatialLedgers: { treaties: { 'iron>weak': {
        parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', victorName: 'Ironhold', loserName: 'Weakmoor',
        mintedTick: 12, believedMarginAtSignature: 0.4, budgetGranted: 3, budgetSpent: 2, complianceState: 'strained',
        terms: [
          { type: 'tribute', family: 'economic', magnitude: 0.4, mintedTick: 12, expiresTick: 96, weightSpent: 1, complianceState: 'strained', trueState: 'strained', burden01: 0.5, receipt: 't' },
          { type: 'non_aggression', family: 'security', magnitude: 1, mintedTick: 12, expiresTick: 200, weightSpent: 0.4, complianceState: 'honored', trueState: 'honored', burden01: 0, receipt: 'n' },
        ],
        receipts: ['The Peace of Weakmoor.'],
      } } },
    },
  };
}

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('WarFaithTab — the treaty document where the settlement is a party', () => {
  it('renders the settlement treaty: role, term, house-voice compliance, and the fraying seam', () => {
    const campaign = campaignWithTreaty();
    useStore.__set({ campaigns: [campaign], savedSettlements: [
      { id: 'iron', settlement: { name: 'Ironhold' } }, { id: 'weak', settlement: { name: 'Weakmoor' } },
    ] });
    const { container } = render(<WarFaithTab settlement={{ id: 'weak', name: 'Weakmoor' }} saveId="weak" />);
    expect(screen.getByTestId('treaty-block')).toBeTruthy();
    expect(container.textContent).toContain('The Peace of Weakmoor');
    expect(container.textContent).toMatch(/as the bound party/);
    // The house-voice compliance line for the strained tribute.
    expect(container.textContent).toMatch(/grudgingly/);
    // The fraying seam is named (tribute is the only strained term).
    expect(container.textContent).toMatch(/seam that will tear first/i);
  });

  it('a settlement with no treaty shows NO treaty block', () => {
    const campaign = { id: 'c1', settlementIds: ['iron', 'weak'], worldState: { tick: 5, canonizedAt: '2026-01-01T00:00:00.000Z', spatialLedgers: {} } };
    useStore.__set({ campaigns: [campaign], savedSettlements: [{ id: 'weak', settlement: { name: 'Weakmoor' } }] });
    render(<WarFaithTab settlement={{ id: 'weak', name: 'Weakmoor' }} saveId="weak" />);
    expect(screen.queryByTestId('treaty-block')).toBeNull();
  });
});

describe('TreatyPanel — the realm-wide treaty documents', () => {
  it('renders each treaty as a document; the fraying tribute is flagged', () => {
    const { container } = render(<TreatyPanel campaign={campaignWithTreaty()} nameById={{ iron: 'Ironhold', weak: 'Weakmoor' }} />);
    expect(screen.getByTestId('treaty-panel')).toBeTruthy();
    expect(container.textContent).toContain('The Peace of Weakmoor');
    expect(container.textContent).toMatch(/tribute/i);
    expect(container.textContent).toMatch(/grudgingly/);
  });

  it('a realm with no treaties shows the honest empty note (the dormancy render)', () => {
    const { container } = render(<TreatyPanel campaign={{ worldState: { tick: 1 } }} nameById={{}} />);
    expect(screen.getByTestId('treaty-panel')).toBeTruthy();
    expect(container.textContent).toMatch(/No treaties stand/i);
  });
});
