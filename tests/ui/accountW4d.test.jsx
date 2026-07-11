/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountW4d.test.jsx — W4d Account wiring lock-in.
 *
 * Pins the three load-bearing wire-ups of the Account reunification:
 *   1. Security section renders and routes through the lib/auth.js methods
 *      (getIdentities on mount, changePassword on submit, signOutEverywhere).
 *   2. Data & Privacy has export wired (downloadAccountExport) and import wired
 *      (the file → preview → confirm path invokes the onImport action) + the
 *      tier gate on the import trigger.
 *   3. OUR per-category email opt-out (migration 126) still renders — the
 *      OURS-ahead feature the reorg must preserve inside the new IA.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

afterEach(cleanup);

// ── lib/auth.js — the Security section calls these directly ──────────────────
const authMock = {
  getIdentities: vi.fn().mockResolvedValue([{ provider: 'email', identity_id: 'e', email: 'x@y.z' }]),
  changePassword: vi.fn().mockResolvedValue(undefined),
  signOutEverywhere: vi.fn().mockResolvedValue(undefined),
  resetPassword: vi.fn().mockResolvedValue(undefined),
  linkIdentity: vi.fn().mockResolvedValue(undefined),
  unlinkIdentity: vi.fn().mockResolvedValue(undefined),
  getAccountNumber: vi.fn().mockResolvedValue('SF-TEST01'),
};
vi.mock('../../src/lib/auth.js', () => ({ auth: authMock }));

// ── lib/accountData.js — export path ─────────────────────────────────────────
const downloadAccountExport = vi.fn(() => 'settlementforge-account.json');
vi.mock('../../src/lib/accountData.js', () => ({
  downloadAccountExport,
  requestAccountDeletion: vi.fn().mockResolvedValue({ status: 'queued', requestedAt: '' }),
  ACCOUNT_EXPORT_VERSION: 1,
}));

// ── lib/accountImport.js — envelope validation (static + dynamic import) ──────
vi.mock('../../src/lib/accountImport.js', () => ({
  MAX_IMPORT_BYTES: 5 * 1024 * 1024,
  validateAccountImport: () => ({ ok: true, value: { version: 1, settlements: [], campaigns: [] } }),
}));

// PrivacySettings pulls analytics/consent wiring — stub it so the Data section
// renders without dragging those deps into the test.
vi.mock('../../src/components/PrivacySettings.jsx', () => ({ default: () => null }));

// ── lib/emailPreferences.js — the per-category opt-out (migration 126) ───────
vi.mock('../../src/lib/emailPreferences.js', () => ({
  EMAIL_CATEGORIES: [
    { id: 'product_updates', label: 'Product updates', description: 'Feature notes.' },
    { id: 'referral', label: 'Referral rewards', description: 'Reward notices.' },
    { id: 'lifecycle', label: 'Realm activity', description: 'Nudges.' },
  ],
  getMyEmailPreferences: vi.fn().mockResolvedValue({ product_updates: true, referral: true, lifecycle: true }),
  setMyEmailPreference: vi.fn().mockResolvedValue(undefined),
}));

// Store — only AccountDataPrivacySection reads it (savedSettlements + getState).
const storeState = { savedSettlements: [], campaigns: [], auth: { user: { email: 'x@y.z' } } };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

describe('W4d — Security section wires the auth methods', () => {
  test('loads identities on mount and renders the core controls', async () => {
    const AccountSecuritySection = (await import('../../src/components/account/AccountSecuritySection.jsx')).default;
    render(<AccountSecuritySection auth={{ user: { email: 'x@y.z' } }} onSignOut={vi.fn()} />);

    await waitFor(() => expect(authMock.getIdentities).toHaveBeenCalled());
    expect(screen.getByText('Login and security')).toBeTruthy();
    expect(screen.getByText('Linked accounts')).toBeTruthy();
    expect(screen.getByText('Sign out everywhere')).toBeTruthy();
  });

  test('"Sign out all" calls signOutEverywhere', async () => {
    const AccountSecuritySection = (await import('../../src/components/account/AccountSecuritySection.jsx')).default;
    const onSignOut = vi.fn();
    render(<AccountSecuritySection auth={{ user: { email: 'x@y.z' } }} onSignOut={onSignOut} />);

    fireEvent.click(screen.getByRole('button', { name: /sign out all/i }));
    await waitFor(() => expect(authMock.signOutEverywhere).toHaveBeenCalled());
  });

  test('change-password flow calls changePassword with the entered values', async () => {
    const AccountSecuritySection = (await import('../../src/components/account/AccountSecuritySection.jsx')).default;
    render(<AccountSecuritySection auth={{ user: { email: 'x@y.z' } }} onSignOut={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /^change password$/i }));
    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'oldpass12' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'newpass12' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'newpass12' } });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => expect(authMock.changePassword).toHaveBeenCalledWith({
      currentPassword: 'oldpass12', newPassword: 'newpass12',
    }));
  });
});

describe('W4d — Data & Privacy export + import wiring', () => {
  test('"Download JSON" calls downloadAccountExport', async () => {
    const AccountDataPrivacySection = (await import('../../src/components/account/AccountDataPrivacySection.jsx')).default;
    render(
      <AccountDataPrivacySection
        auth={{ user: {}, tier: 'free' }}
        onImport={vi.fn()}
        canSave maxSaves={3} settlementCount={0} campaignCount={0}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /download json/i }));
    expect(downloadAccountExport).toHaveBeenCalled();
  });

  test('import trigger is gated by canSave', async () => {
    const AccountDataPrivacySection = (await import('../../src/components/account/AccountDataPrivacySection.jsx')).default;
    const { rerender } = render(
      <AccountDataPrivacySection auth={{ user: {}, tier: 'free' }} onImport={vi.fn()} canSave={false} maxSaves={0} />
    );
    expect(screen.getByLabelText('Choose an export file to import').disabled).toBe(true);
    expect(screen.getByText(/Sign in or upgrade to import/i)).toBeTruthy();

    rerender(<AccountDataPrivacySection auth={{ user: {}, tier: 'free' }} onImport={vi.fn()} canSave maxSaves={3} />);
    expect(screen.getByLabelText('Choose an export file to import').disabled).toBe(false);
  });

  test('choosing a file → confirm invokes onImport', async () => {
    const AccountDataPrivacySection = (await import('../../src/components/account/AccountDataPrivacySection.jsx')).default;
    const onImport = vi.fn().mockResolvedValue({
      ok: true, settlementsImported: 0, settlementsSkipped: [], campaignsImported: 0, campaignsSkipped: [],
    });
    render(
      <AccountDataPrivacySection
        auth={{ user: {}, tier: 'free' }}
        onImport={onImport}
        canSave maxSaves={3} settlementCount={0} campaignCount={0}
      />
    );
    const input = screen.getByLabelText('Choose an export file to import');
    const file = new File(['{"version":1,"settlements":[],"campaigns":[]}'], 'export.json', { type: 'application/json' });
    // jsdom File may lack a usable text(); stub it so handleImportFile resolves.
    Object.defineProperty(file, 'text', { value: () => Promise.resolve('{"version":1,"settlements":[],"campaigns":[]}') });
    fireEvent.change(input, { target: { files: [file] } });

    const importBtn = await screen.findByRole('button', { name: /^import$/i });
    fireEvent.click(importBtn);
    await waitFor(() => expect(onImport).toHaveBeenCalled());
  });
});

describe('W4d — per-category email opt-out preserved (OURS-ahead, migration 126)', () => {
  test('AccountEmailPreferencesSection still renders its category toggles', async () => {
    const AccountEmailPreferencesSection = (await import('../../src/components/account/AccountEmailPreferencesSection.jsx')).default;
    render(<AccountEmailPreferencesSection />);

    expect(screen.getByText('Email preferences')).toBeTruthy();
    // The three opt-out categories render once the async load resolves.
    expect(await screen.findByText('Product updates')).toBeTruthy();
    expect(screen.getByText('Referral rewards')).toBeTruthy();
    expect(screen.getByText('Realm activity')).toBeTruthy();
  });
});
