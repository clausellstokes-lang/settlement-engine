/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountDataPrivacySection.test.jsx — Phase A2 Data & Privacy UI.
 *
 * Pins:
 *   • Export downloads the user's data (downloadAccountExport called with a
 *     snapshot of settlements + campaigns).
 *   • Delete account is confirmation-gated (typed phrase) and routes to the
 *     SOFT-DELETE request (requestAccountDeletion) — never a client hard delete.
 *   • Bulk content deletion is confirmation-gated and calls the passed handler.
 *   • Visibility prefs persist through setProductPref.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react';
import {
  buildCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';

afterEach(cleanup);

const downloadAccountExport = vi.fn().mockReturnValue('file.json');
const requestAccountDeletion = vi.fn().mockResolvedValue({ status: 'queued', requestedAt: 'now' });
vi.mock('../../src/lib/accountData.js', () => ({
  ACCOUNT_EXPORT_VERSION: 3,
  downloadAccountExport,
  requestAccountDeletion,
}));
const listSaves = vi.fn();
vi.mock('../../src/lib/saves.js', () => ({ saves: { list: (...args) => listSaves(...args) } }));

// PrivacySettings pulls analytics + consent on mount; stub both to stay quiet.
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('../../src/lib/consent.js', () => ({
  getConsent: () => ({ essential: true, research: false, ai_prose: false }),
  setConsent: (p) => ({ essential: true, research: false, ai_prose: false, ...p }),
  dntEnabled: () => false,
}));

// Store mock — a mutable bag drives the selectors the section reads.
const setProductPref = vi.fn();
const exportCustomContentArchive = vi.fn().mockResolvedValue({
  format: 'settlementforge.custom-content-ledger',
  archiveFingerprint: 'a'.repeat(64),
});
const storeState = {
  auth: { user: { id: 'u1', email: 'me@example.test' } },
  savedSettlements: [{ id: 's1' }, { id: 's2' }],
  savedSettlementsLoaded: true,
  savedSettlementsOwnerId: 'u1',
  savedSettlementsHydrationGeneration: 0,
  campaigns: [{ id: 'c1' }],
  campaignsLoaded: true,
  customContent: { institutions: [] },
  customContentSyncedAt: '2026-07-25T00:00:00.000Z',
  canUseCustomContent: () => true,
  loadCustomContentFromCloud: vi.fn(),
  loadCampaigns: vi.fn(),
  exportCustomContentArchive,
  productPrefs: { galleryPublicDefault: false, shareDefault: 'unlisted', playerViewDefault: false },
  setProductPref,
};
storeState.setSavedSettlements = vi.fn((saves) => {
  storeState.savedSettlements = saves;
  storeState.savedSettlementsLoaded = true;
  storeState.campaignsLoaded = true;
  storeState.customContentSyncedAt = '2026-07-25T00:00:00.000Z';
  storeState.customContent = { institutions: [] };
  storeState.campaigns = [{ id: 'c1' }];
});
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

let AccountDataPrivacySection;
const AUTH = { user: { id: 'u1', email: 'me@example.test' } };

beforeEach(async () => {
  vi.clearAllMocks();
  storeState.savedSettlements = [{ id: 's1' }, { id: 's2' }];
  storeState.savedSettlementsLoaded = true;
  storeState.campaigns = [{ id: 'c1' }];
  storeState.campaignsLoaded = true;
  storeState.customContent = { institutions: [] };
  storeState.customContentSyncedAt = '2026-07-25T00:00:00.000Z';
  listSaves.mockResolvedValue(storeState.savedSettlements);
  exportCustomContentArchive.mockResolvedValue({
    format: 'settlementforge.custom-content-ledger',
    archiveFingerprint: 'a'.repeat(64),
  });
  ({ default: AccountDataPrivacySection } = await import('../../src/components/account/AccountDataPrivacySection.jsx'));
});

// LINEAGE NOTE (master merge W6): the two setProductPref persistence tests were
// removed — master's productPrefs store bag is a fenced system; this lineage
// has no productPrefs (the section's other behaviors are pinned below).
describe('AccountDataPrivacySection — export', () => {
  it('downloads the user data on Download JSON', async () => {
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={2} campaignCount={1} />);
    fireEvent.click(screen.getByText('Download JSON'));
    await waitFor(() => expect(downloadAccountExport).toHaveBeenCalledTimes(1));
    const arg = downloadAccountExport.mock.calls[0][0];
    expect(arg.savedSettlements).toHaveLength(2);
    expect(arg.campaigns).toHaveLength(1);
    expect(arg.customContentArchive).toMatchObject({
      format: 'settlementforge.custom-content-ledger',
    });
  });

  it('awaits a cold authenticated cloud-save load before building the archive', async () => {
    let resolveList;
    storeState.savedSettlements = [];
    storeState.savedSettlementsLoaded = false;
    listSaves.mockReturnValue(new Promise(resolve => {
      resolveList = resolve;
    }));
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={0} campaignCount={1} />);

    fireEvent.click(screen.getByText('Download JSON'));
    expect(downloadAccountExport).not.toHaveBeenCalled();

    resolveList([{ id: 'cloud-1' }, { id: 'cloud-2' }]);
    await waitFor(() => expect(downloadAccountExport).toHaveBeenCalledTimes(1));
    expect(downloadAccountExport.mock.calls[0][0].savedSettlements).toEqual([
      { id: 'cloud-1' }, { id: 'cloud-2' },
    ]);
    expect(listSaves).toHaveBeenCalledTimes(1);
  });

  it('awaits custom-content and campaign hydration before taking the export snapshot', async () => {
    let resolveContent;
    let resolveCampaigns;
    storeState.customContentSyncedAt = null;
    storeState.campaignsLoaded = false;
    storeState.customContent = { institutions: [] };
    storeState.campaigns = [];
    storeState.loadCustomContentFromCloud.mockImplementation(() => (
      new Promise(resolve => {
        resolveContent = () => {
          storeState.customContent = {
            institutions: [{ name: 'Cloud Hall', localUid: 'lu_cloud_hall' }],
          };
          storeState.customContentSyncedAt = '2026-07-25T01:00:00.000Z';
          resolve();
        };
      })
    ));
    storeState.loadCampaigns.mockImplementation(() => (
      new Promise(resolve => {
        resolveCampaigns = () => {
          storeState.campaigns = [{ id: 'cloud-campaign' }];
          storeState.campaignsLoaded = true;
          resolve();
        };
      })
    ));
    render(
      <AccountDataPrivacySection
        auth={AUTH}
        settlementCount={2}
        campaignCount={0}
      />,
    );

    fireEvent.click(screen.getByText('Download JSON'));
    await waitFor(() => expect(storeState.loadCustomContentFromCloud)
      .toHaveBeenCalledTimes(1));
    expect(storeState.loadCampaigns).not.toHaveBeenCalled();
    expect(downloadAccountExport).not.toHaveBeenCalled();

    resolveContent();
    await waitFor(() => expect(storeState.loadCampaigns).toHaveBeenCalledTimes(1));
    expect(downloadAccountExport).not.toHaveBeenCalled();
    resolveCampaigns();

    await waitFor(() => expect(downloadAccountExport).toHaveBeenCalledTimes(1));
    expect(exportCustomContentArchive).toHaveBeenCalledTimes(1);
    expect(downloadAccountExport).toHaveBeenCalledWith(
      expect.objectContaining({
        campaigns: [{ id: 'cloud-campaign' }],
        customContent: {
          institutions: [{ name: 'Cloud Hall', localUid: 'lu_cloud_hall' }],
        },
        customContentArchive: expect.objectContaining({
          format: 'settlementforge.custom-content-ledger',
        }),
      }),
    );
  });
});

describe('AccountDataPrivacySection — full-ledger import copy', () => {
  it('labels definitions and discloses immutable archive dimensions', async () => {
    const activeData = { name: 'Active Hall', localUid: 'lu_active_hall' };
    const archivedData = {
      name: 'Archived Hall',
      localUid: 'lu_archived_hall',
    };
    const archive = buildCustomContentArchive({
      schemaVersion: 1,
      definitions: {
        active: {
          id: 'active',
          category: 'institutions',
          localUid: activeData.localUid,
          headRevisionId: 'active-r1',
          archivedAt: null,
          createdAt: null,
          updatedAt: null,
        },
        archived: {
          id: 'archived',
          category: 'institutions',
          localUid: archivedData.localUid,
          headRevisionId: 'archived-r1',
          archivedAt: '2026-07-25T00:00:00.000Z',
          createdAt: null,
          updatedAt: null,
        },
      },
      revisions: {
        'active-r1': {
          id: 'active-r1',
          definitionId: 'active',
          category: 'institutions',
          revisionNumber: 1,
          parentRevisionId: null,
          contentHash: contentRevisionHash('institutions', activeData),
          data: activeData,
          createdAt: null,
        },
        'archived-r1': {
          id: 'archived-r1',
          definitionId: 'archived',
          category: 'institutions',
          revisionNumber: 1,
          parentRevisionId: null,
          contentHash: contentRevisionHash('institutions', archivedData),
          data: archivedData,
          createdAt: null,
        },
      },
      packs: {},
      activePacks: {},
      packEntryDefinitions: {},
      packVersionEntries: {},
      environments: {},
      activeEnvironmentRevisionId: null,
      commandReceipts: {},
    }, {
      sourceKey: 'preview-owner',
      exportedAt: null,
    });
    const accountFile = JSON.stringify({
      version: 3,
      settlements: [],
      campaigns: [],
      customContentArchive: archive,
    });
    render(
      <AccountDataPrivacySection
        auth={AUTH}
        canSave
        onImport={vi.fn()}
      />,
    );

    fireEvent.change(
      screen.getByLabelText('Choose an export file to import'),
      {
        target: {
          files: [{
            size: accountFile.length,
            text: async () => accountFile,
          }],
        },
      },
    );

    expect(await screen.findByText(/2 custom-content definitions/i))
      .toBeTruthy();
    expect(screen.getByText(
      /Full ledger: 2 immutable revisions, 1 archived definition/i,
    )).toBeTruthy();
  });
});

describe('AccountDataPrivacySection — delete account (soft-delete request, gated)', () => {
  it('requires the typed phrase before it can submit', async () => {
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={2} campaignCount={1} />);
    fireEvent.click(screen.getByText('Request account deletion'));

    const submit = screen.getByText('Permanently delete');
    // Disabled until the phrase matches.
    expect(submit.disabled).toBe(true);
    expect(requestAccountDeletion).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Type DELETE to confirm/i), { target: { value: 'DELETE' } });
    expect(screen.getByText('Permanently delete').disabled).toBe(false);
  });

  it('routes to the soft-delete request once confirmed', async () => {
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={2} campaignCount={1} />);
    fireEvent.click(screen.getByText('Request account deletion'));
    fireEvent.change(screen.getByLabelText(/Type DELETE to confirm/i), { target: { value: 'DELETE' } });
    fireEvent.click(screen.getByText('Permanently delete'));

    await waitFor(() => expect(requestAccountDeletion).toHaveBeenCalledTimes(1));
    expect(requestAccountDeletion).toHaveBeenCalledWith(AUTH.user);
    await screen.findByText(/scheduled for removal/i);
  });
});

describe('AccountDataPrivacySection — bulk content deletion', () => {
  it('is confirmation-gated and calls the settlements handler', async () => {
    const onDeleteAllSettlements = vi.fn().mockResolvedValue(undefined);
    render(
      <AccountDataPrivacySection
        auth={AUTH} settlementCount={2} campaignCount={1}
        onDeleteAllSettlements={onDeleteAllSettlements}
      />
    );

    fireEvent.click(screen.getByText('Delete all settlements (2)'));
    expect(onDeleteAllSettlements).not.toHaveBeenCalled(); // confirm step first
    fireEvent.click(screen.getByText('Yes, delete all'));
    await waitFor(() => expect(onDeleteAllSettlements).toHaveBeenCalledTimes(1));
  });

  it('surfaces the error when the wipe handler rejects (server delete failed)', async () => {
    // AccountPage.handleDeleteAllSettlements throws when a server-side delete
    // fails, so a partial wipe cannot report a clean success. The confirm panel
    // must show that error and stay open for a retry.
    const onDeleteAllSettlements = vi.fn().mockRejectedValue(
      new Error('1 of 2 settlements could not be deleted from the server. They remain in your library – try again.')
    );
    render(
      <AccountDataPrivacySection
        auth={AUTH} settlementCount={2} campaignCount={1}
        onDeleteAllSettlements={onDeleteAllSettlements}
      />
    );

    fireEvent.click(screen.getByText('Delete all settlements (2)'));
    fireEvent.click(screen.getByText('Yes, delete all'));

    // The rejection is surfaced as an alert instead of silently finishing…
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/could not be deleted from the server/i);
    // …and the confirm panel stays open so the user can retry.
    expect(screen.getByText('Yes, delete all')).toBeTruthy();
  });
});
