/** @vitest-environment jsdom */
/**
 * campaignFolderAdvanceInterval.test.jsx — RE-KEYED (LIBRARY-SIMPLE, 2026-11-10).
 *
 * This file used to pin the Library folder's "Advance by" interval picker and its
 * "Advance Time" button. The owner removed them (2026-11-10, verbatim): "I now want to
 * simplify the library page. No longer does it advance time. That will only be
 * accessible in isolated (not in campaign settlements) or the realm page." A campaign
 * advances on the Realm alone (WorldMapToolbar's "Advance by" + "Advance Realm").
 *
 * The same identity — the folder header, a premium + canonized folder with a member,
 * the state in which every advance control used to be live — now pins the NEGATIVE:
 * no interval select, no Advance button, no auto-resolve switch. The keep-side is
 * pinned too, so the negative cannot pass by the header failing to render.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  // The folder still reads the store (the faith seam); give it an empty state. The
  // advance readers it used to need are gone with the controls they served.
  const state = {};
  const useStore = (sel) => sel(state);
  useStore.getState = () => state;
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { CampaignFolder } from '../../src/components/settlements/CampaignFolder.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('CampaignFolder — the Library advances nothing (owner, 2026-11-10)', () => {
  function renderFolder() {
    render(
      <CampaignFolder
        campaign={{ id: 'camp-1', name: 'Test Realm', collapsed: true, worldState: { canonizedAt: '2026-01-01T00:00:00Z' } }}
        settlements={[{ id: 's1', name: 'Ashford', settlement: {} }]}
        canManageCampaigns
        toggleCollapsed={() => {}}
      />,
    );
  }

  test('a premium, canonized, populated folder renders no advance control', () => {
    renderFolder();
    // The keep-side: the header rendered (rename, delete, books and export).
    expect(screen.getByRole('button', { name: 'Rename campaign' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Delete campaign' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Books and export/ })).toBeTruthy();
    // The negative, by each removed control's own anchor.
    expect(screen.queryByLabelText('Advance interval')).toBeNull();
    expect(screen.queryByRole('button', { name: /Advance Time/i })).toBeNull();
    expect(screen.queryByText('Advance by')).toBeNull();
    expect(screen.queryByLabelText('Auto-resolve every change')).toBeNull();
    expect(screen.queryByText(/Advanc/i)).toBeNull();
  });
});
