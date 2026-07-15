/** @vitest-environment jsdom */
/**
 * campaignFolderAdvanceInterval.test.jsx
 *
 * The Library campaign folder's "Advance Time" was hardcoded to one_month. It now
 * carries a Week/Month/Season/Year picker (mirroring the World Map toolbar) and
 * threads the chosen interval to onAdvanceTime(campaignId, interval).
 *
 * Mounted collapsed so only the header (where the picker + button live) renders.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const state = { isAdvanceInFlight: () => false };
  const useStore = (sel) => sel(state);
  useStore.getState = () => state;
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { CampaignFolder } from '../../src/components/settlements/CampaignFolder.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('CampaignFolder — advance interval picker', () => {
  function renderFolder(onAdvanceTime) {
    render(
      <CampaignFolder
        campaign={{ id: 'camp-1', name: 'Test Realm', collapsed: true }}
        settlements={[{ id: 's1', name: 'Ashford', settlement: {} }]}
        worldCanonized
        canManageCampaigns
        onAdvanceTime={onAdvanceTime}
        toggleCollapsed={() => {}}
      />,
    );
  }

  test('exposes the four intervals and defaults to one_month', () => {
    renderFolder(vi.fn());
    const select = screen.getByLabelText('Advance interval');
    expect(select.value).toBe('one_month');
    const labels = Array.from(select.options).map(o => o.textContent);
    expect(labels).toEqual(['Week', 'Month', 'Season', 'Year']);
  });

  test('advancing threads the chosen interval to onAdvanceTime', () => {
    const onAdvanceTime = vi.fn();
    renderFolder(onAdvanceTime);
    const advanceBtn = screen.getByRole('button', { name: /Advance Time/i });

    fireEvent.click(advanceBtn);
    expect(onAdvanceTime).toHaveBeenLastCalledWith('camp-1', 'one_month');

    fireEvent.change(screen.getByLabelText('Advance interval'), { target: { value: 'one_season' } });
    fireEvent.click(advanceBtn);
    expect(onAdvanceTime).toHaveBeenLastCalledWith('camp-1', 'one_season');

    fireEvent.change(screen.getByLabelText('Advance interval'), { target: { value: 'one_year' } });
    fireEvent.click(advanceBtn);
    expect(onAdvanceTime).toHaveBeenLastCalledWith('camp-1', 'one_year');
  });
});
