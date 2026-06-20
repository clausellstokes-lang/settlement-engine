/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountSecuritySection.test.jsx — Phase A2 Login & Security UI.
 *
 * Pins the security-sensitive UI behaviours against a mocked auth service:
 *   • Change password calls changePassword with the current + new password
 *     (re-auth + confirmation), only after the confirm field matches.
 *   • A mismatched confirmation is blocked client-side (no service call).
 *   • Linked accounts list renders the loaded identities; Link/Unlink invoke
 *     the matching service calls.
 *   • Sign out everywhere calls signOutEverywhere (global scope) + onSignOut.
 *   • The MFA "coming soon" stub renders and its button is disabled.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react';

afterEach(cleanup);

const changePassword = vi.fn().mockResolvedValue(undefined);
const resetPassword = vi.fn().mockResolvedValue(undefined);
const getIdentities = vi.fn();
const linkIdentity = vi.fn().mockResolvedValue({});
const unlinkIdentity = vi.fn().mockResolvedValue(undefined);
const signOutEverywhere = vi.fn().mockResolvedValue(undefined);

vi.mock('../../src/lib/auth.js', () => ({
  auth: { changePassword, resetPassword, getIdentities, linkIdentity, unlinkIdentity, signOutEverywhere },
}));

let AccountSecuritySection;
const AUTH = { user: { id: 'u1', email: 'me@example.test' } };

beforeEach(async () => {
  vi.clearAllMocks();
  getIdentities.mockResolvedValue([{ id: 'g', provider: 'google' }, { id: 'e', provider: 'email' }]);
  ({ default: AccountSecuritySection } = await import('../../src/components/account/AccountSecuritySection.jsx'));
});

function typeInto(label, value) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('AccountSecuritySection — change password', () => {
  it('calls changePassword with re-auth + new password after confirmation matches', async () => {
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);

    fireEvent.click(screen.getByText('Change password'));
    typeInto('Current password', 'old-pass');
    typeInto('New password', 'brand-new-pass');
    typeInto('Confirm new password', 'brand-new-pass');
    fireEvent.click(screen.getByText('Update password'));

    await waitFor(() => expect(changePassword).toHaveBeenCalledTimes(1));
    expect(changePassword).toHaveBeenCalledWith({ currentPassword: 'old-pass', newPassword: 'brand-new-pass' });
  });

  it('blocks a mismatched confirmation client-side (no service call)', async () => {
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);

    fireEvent.click(screen.getByText('Change password'));
    typeInto('Current password', 'old-pass');
    typeInto('New password', 'brand-new-pass');
    typeInto('Confirm new password', 'different-pass');
    fireEvent.click(screen.getByText('Update password'));

    await screen.findByText(/do not match/i);
    expect(changePassword).not.toHaveBeenCalled();
  });
});

describe('AccountSecuritySection — linked accounts', () => {
  it('lists the providers and links a not-yet-connected one', async () => {
    // Only email connected → both Google and Discord offer "Link".
    getIdentities.mockResolvedValue([{ id: 'e', provider: 'email' }]);
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);

    const linkButtons = await screen.findAllByRole('button', { name: /^Link$/ });
    expect(linkButtons.length).toBeGreaterThan(0);
    fireEvent.click(linkButtons[0]); // first is Google
    await waitFor(() => expect(linkIdentity).toHaveBeenCalledWith('google'));
  });

  it('unlinks a connected provider', async () => {
    // Two identities so unlink is allowed (server keeps one).
    getIdentities.mockResolvedValue([{ id: 'g', provider: 'google' }, { id: 'e', provider: 'email' }]);
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);

    const unlinkBtn = await screen.findByRole('button', { name: /Unlink/ });
    fireEvent.click(unlinkBtn);
    await waitFor(() => expect(unlinkIdentity).toHaveBeenCalledTimes(1));
    expect(unlinkIdentity.mock.calls[0][0].provider).toBe('google');
  });
});

describe('AccountSecuritySection — sessions + MFA stub', () => {
  it('sign out everywhere calls the global sign-out and onSignOut', async () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);
    render(<AccountSecuritySection auth={AUTH} onSignOut={onSignOut} />);

    fireEvent.click(await screen.findByText('Sign out all'));
    await waitFor(() => expect(signOutEverywhere).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onSignOut).toHaveBeenCalledTimes(1));
  });

  it('renders a disabled "coming soon" two-factor stub', async () => {
    render(<AccountSecuritySection auth={AUTH} onSignOut={vi.fn()} />);
    expect(await screen.findByText('Coming soon')).toBeTruthy();
    const setUp = screen.getByRole('button', { name: /two-factor authentication coming soon/i });
    expect(setUp.disabled).toBe(true);
  });
});
