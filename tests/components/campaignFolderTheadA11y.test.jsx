/** @vitest-environment jsdom */
/**
 * campaignFolderTheadA11y.test.jsx
 *
 * The campaign folder's settlement table carried a hidden <caption> but NO
 * column headers, so screen-reader users navigating the rows had no column
 * semantics (the sibling UnassignedLedger table has a proper scope="col" head).
 * The folder now renders a visually-hidden but accessible <thead> with the same
 * columns. These pins lock the accessible column names in.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const state = {
    isAdvanceInFlight: () => false,
    isCampaignMutationLocked: () => false,
    isSettlementClockBound: () => false,
  };
  const useStore = (sel) => sel(state);
  useStore.getState = () => state;
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
// Stub the folder's expanded-body children so this pin isolates the folder's
// own table head, not the realm/regional summaries or the row cards.
vi.mock('../../src/components/settlements/SettlementCard.jsx', () => ({
  SettlementCard: () => (<tr><td>row</td></tr>),
}));
vi.mock('../../src/components/settlements/RealmStrip.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/region/RegionalGraphSummary.jsx', () => ({ default: () => null }));

import { CampaignFolder } from '../../src/components/settlements/CampaignFolder.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('CampaignFolder — accessible column heads', () => {
  test('the settlement table exposes scope="col" heads for every column', () => {
    render(
      <CampaignFolder
        campaign={{ id: 'camp-1', name: 'Test Realm', collapsed: false }}
        settlements={[{ id: 's1', name: 'Ashford', settlement: {} }]}
        canManageCampaigns
        toggleCollapsed={() => {}}
      />,
    );
    // Column heads renamed to plain words (legibility wave, 2026-07-22):
    // Tier -> Size, Phase -> Status, Standing -> Health.
    for (const name of ['Settlement', 'Size', 'Status', 'Health', 'Actions']) {
      expect(screen.getByRole('columnheader', { name }), `missing column head: ${name}`).toBeTruthy();
    }
  });
});
