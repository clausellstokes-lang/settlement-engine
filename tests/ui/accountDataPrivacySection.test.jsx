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

afterEach(cleanup);

const downloadAccountExport = vi.fn().mockReturnValue('file.json');
const requestAccountDeletion = vi.fn().mockResolvedValue({ status: 'queued', requestedAt: 'now' });
vi.mock('../../src/lib/accountData.js', () => ({ downloadAccountExport, requestAccountDeletion }));

// PrivacySettings pulls analytics + consent on mount; stub both to stay quiet.
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('../../src/lib/consent.js', () => ({
  getConsent: () => ({ essential: true, research: false, ai_prose: false }),
  setConsent: (p) => ({ essential: true, research: false, ai_prose: false, ...p }),
  dntEnabled: () => false,
}));

// Store mock — a mutable bag drives the selectors the section reads.
const setProductPref = vi.fn();
const storeState = {
  auth: { user: { id: 'u1', email: 'me@example.test' } },
  savedSettlements: [{ id: 's1' }, { id: 's2' }],
  campaigns: [{ id: 'c1' }],
  productPrefs: { galleryPublicDefault: false, shareDefault: 'unlisted', playerViewDefault: false },
  setProductPref,
};
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
  ({ default: AccountDataPrivacySection } = await import('../../src/components/account/AccountDataPrivacySection.jsx'));
});

describe('AccountDataPrivacySection — export', () => {
  it('downloads the user data on Download JSON', async () => {
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={2} campaignCount={1} />);
    fireEvent.click(screen.getByText('Download JSON'));
    expect(downloadAccountExport).toHaveBeenCalledTimes(1);
    const arg = downloadAccountExport.mock.calls[0][0];
    expect(arg.savedSettlements).toHaveLength(2);
    expect(arg.campaigns).toHaveLength(1);
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

describe('AccountDataPrivacySection — visibility prefs', () => {
  it('persists the gallery-public default through setProductPref', () => {
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={2} campaignCount={1} />);
    fireEvent.click(screen.getByLabelText('Make new gallery shares public'));
    expect(setProductPref).toHaveBeenCalledWith('galleryPublicDefault', true);
  });

  it('persists the default share scope through setProductPref', () => {
    render(<AccountDataPrivacySection auth={AUTH} settlementCount={2} campaignCount={1} />);
    fireEvent.change(screen.getByLabelText(/Default share scope/i), { target: { value: 'public' } });
    expect(setProductPref).toHaveBeenCalledWith('shareDefault', 'public');
  });
});
