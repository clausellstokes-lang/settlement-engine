/**
 * @vitest-environment jsdom
 *
 * tests/ui/authPanel.confirmPassword.test.jsx — lock-in for the sign-up
 * confirm-password mismatch guard (RP-1 §57).
 *
 * A typo'd password would otherwise create an account the user can never sign
 * back into. The guard must block submit (no authSignUp call) and surface the
 * mismatch copy; matching passwords must pass through to authSignUp.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { t } from '../../src/copy/index.js';

afterEach(cleanup);

// vi.hoisted so the shared spy exists before the hoisted vi.mock factory runs.
const { authSignUp } = vi.hoisted(() => ({
  authSignUp: vi.fn(() => Promise.resolve({ needsVerification: true })),
}));
vi.mock('../../src/store/index.js', () => {
  const state = {
    authSignUp,
    authSignIn: vi.fn(),
    authMagicLink: vi.fn(),
    authOAuth: vi.fn(),
  };
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true, supabase: {} }));
vi.mock('../../src/lib/flags.js', () => ({ flag: () => false }));

import AuthPanel from '../../src/components/auth/AuthPanel.jsx';

// Password is the primary inline path (W5.1): the email/password/confirm
// fields render directly on the sign-up tab, no disclosure to open.
function openPasswordSignup() {
  render(<AuthPanel initialMode="signup" />);
}

function fill(labelKey, value) {
  fireEvent.change(screen.getByLabelText(t(labelKey)), { target: { value } });
}

describe('AuthPanel — confirm-password mismatch guard', () => {
  test('mismatched passwords block submit and show the mismatch copy', () => {
    openPasswordSignup();
    fill('auth.placeholder.email', 'gm@example.com');
    fill('auth.placeholder.password', 'abcdef');
    fill('auth.placeholder.confirmPassword', 'zzzzzz');

    fireEvent.click(screen.getByRole('button', { name: t('auth.button.createAcct') }));

    expect(authSignUp).not.toHaveBeenCalled();
    expect(screen.getByText(t('auth.error.passwordMismatch'))).toBeTruthy();
  });

  test('matching passwords pass through to authSignUp', async () => {
    authSignUp.mockClear();
    openPasswordSignup();
    fill('auth.placeholder.email', 'gm@example.com');
    fill('auth.placeholder.password', 'abcdef');
    fill('auth.placeholder.confirmPassword', 'abcdef');

    fireEvent.click(screen.getByRole('button', { name: t('auth.button.createAcct') }));

    await waitFor(() => expect(authSignUp).toHaveBeenCalledWith('gm@example.com', 'abcdef'));
  });
});
