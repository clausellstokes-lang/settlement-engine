/** @vitest-environment jsdom */

import { afterEach, expect, test, vi } from 'vitest';
import {
  cleanup, fireEvent, render, screen, waitFor,
} from '@testing-library/react';

vi.mock('../../src/lib/flags.js', () => ({
  flag: () => false,
}));

// RealmDashboard is the sole owner of the front-page catch-up projection. The
// marker stands in for its real WhileYouWereAway child without loading the large
// dashboard dependency tree into this ownership test.
vi.mock('../../src/components/map/RealmDashboard.jsx', () => ({
  default: () => <div data-testid="while-you-were-away">Catch-up digest</div>,
}));

vi.mock('../../src/components/map/WhileYouWereAway.jsx', () => ({
  default: () => <div data-testid="while-you-were-away">Duplicate catch-up digest</div>,
}));

vi.mock('../../src/components/map/WizardNewsPanel.jsx', () => ({
  default: () => <div data-testid="wizard-news-owner">Wizard News</div>,
}));

import HeraldBody from '../../src/components/map/HeraldBody.jsx';

afterEach(cleanup);

test('the Herald front page has one catch-up projection owner', async () => {
  render(
    <HeraldBody
      section="dashboard"
      campaign={{ id: 'campaign-1', worldState: {} }}
      feed={{ bySection: {}, counts: {} }}
      nameById={new Map()}
      emptyHandlers={{}}
      canManageCampaigns
      tier="premium"
    />,
  );

  await waitFor(() => {
    expect(screen.getAllByTestId('while-you-were-away')).toHaveLength(1);
  });
});

test('the retained Dashboard body reaches Wizard News through Session prep', async () => {
  render(
    <HeraldBody
      section="dashboard"
      campaign={{ id: 'campaign-1', worldState: {} }}
      feed={{ bySection: {}, counts: {} }}
      nameById={new Map()}
      emptyHandlers={{}}
      canManageCampaigns
      tier="premium"
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Prose session-prep' }));
  await waitFor(() => {
    expect(screen.getByTestId('wizard-news-owner')).toBeTruthy();
  });
});
