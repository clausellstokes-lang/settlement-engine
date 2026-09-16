/** @vitest-environment jsdom */
/**
 * The DM Screen carries one shared campaign feed across its two faces. This
 * pins the actual UI seam: switching to Player view must recompose the letter
 * through the Wizard News audience projection, not merely hide DM-only tools.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

afterEach(cleanup);

const storeState = {
  settlement: { id: 'ashford', name: 'Ashford', tier: 'Village', population: 800, institutions: [], npcs: [] },
  campaigns: [{
    id: 'campaign-1',
    lastReadTick: 0,
    flagsSeen: null,
    worldState: { simulationRules: {} },
    wizardNews: {
      schemaVersion: 1,
      currentTick: 12,
      entries: [
        {
          id: 'public-crossing', tick: 10, significance: 'notable',
          impactKind: 'disposition_martial_crossed', headline: 'Ashford takes a harder line',
        },
        {
          id: 'suppressed-reading', tick: 11, significance: 'routine',
          kind: 'war_culture_suppressed', impactKind: 'war_culture_suppressed',
          headline: "Ashford's books refuse a warlike reading", covert: true,
        },
      ],
    },
  }],
  activeCampaignId: 'campaign-1',
  markCampaignLettersRead: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

vi.mock('../../src/components/tableLedger/TableLedgerPanel.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/auspice/AuspicePanel.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/temperament/TemperamentPicker.jsx', () => ({ default: () => null }));

import DmScreen from '../../src/components/screen/DmScreen.jsx';

describe('WR-2 — DM Screen Wizard News privacy', () => {
  it('shows war_culture_suppressed to the DM and removes it from the player face', () => {
    render(<DmScreen />);

    expect(screen.getByText("Ashford's books refuse a warlike reading")).toBeTruthy();
    expect(screen.getByText('Ashford takes a harder line')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Player view' }));

    expect(screen.queryByText("Ashford's books refuse a warlike reading")).toBeNull();
    expect(screen.getByText('Ashford takes a harder line')).toBeTruthy();
  });
});
