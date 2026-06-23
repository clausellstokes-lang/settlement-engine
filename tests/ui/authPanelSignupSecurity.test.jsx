/**
 * @vitest-environment jsdom
 *
 * tests/ui/authPanelSignupSecurity.test.jsx — Auth Phase 2 signup-side UI.
 *
 * Pins the security-question capture + the post-signup polling auto-login that
 * fires the DEFERRED security-answer write:
 *   • sign-up renders two question <select>s + two answer fields after
 *     confirm-password, and the second select EXCLUDES the first's pick;
 *   • the Create-account CTA stays disabled until both questions are chosen,
 *     distinct, and answered;
 *   • a successful sign-up with needsVerification swaps to the "check your
 *     inbox" verify screen with the calm auto-login note;
 *   • the bounded poll calls authSignIn on its interval, swallows the
 *     "Email not confirmed" error, and on the first success fires
 *     authSetSecurityAnswers with the stashed answers THEN onAuthed — the
 *     deferred-capture contract.
 *
 * Timers are faked so the poll interval is driven deterministically.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';

beforeEach(() => {
  // Hide OAuth so the test focuses on the email/password + security path.
  setFlagOverride('googleOauth', false);
  setFlagOverride('discordOauth', false);
});
afterEach(() => {
  setFlagOverride('googleOauth', null);
  setFlagOverride('discordOauth', null);
  vi.useRealTimers();
  cleanup();
  vi.clearAllMocks();
});

const authSignUp = vi.fn();
const authSignIn = vi.fn();
const authSetSecurityAnswers = vi.fn().mockResolvedValue(undefined);

const storeState = {
  authSignUp,
  authSignIn,
  authResetPassword: vi.fn(),
  authMagicLink: vi.fn(),
  authOAuth: vi.fn(),
  authSetSecurityAnswers,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// configured=true so the polling auto-login actually runs (it no-ops in mock mode).
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

async function renderSignup(onAuthed = vi.fn()) {
  const AuthPanel = (await import('../../src/components/auth/AuthPanel.jsx')).default;
  render(<AuthPanel initialMode="signup" onAuthed={onAuthed} showTabs={false} />);
  return onAuthed;
}

// Fill the four credential fields. The two answer fields share their question's
// label as the accessible name; we target by placeholder text.
function fillCredentials() {
  fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'gm@example.com' } });
  const pwFields = screen.getAllByPlaceholderText(/password/i);
  // [0] = Password, [1] = Confirm password
  fireEvent.change(pwFields[0], { target: { value: 'hunter2' } });
  fireEvent.change(pwFields[1], { target: { value: 'hunter2' } });
}

describe('AuthPanel — signup security questions', () => {
  it('renders two question selects (second excludes the first pick) + answer fields', async () => {
    await renderSignup();
    const q1 = screen.getByLabelText('First question');
    const q2 = screen.getByLabelText('Second question');
    expect(q1).toBeTruthy();
    expect(q2).toBeTruthy();

    // Pick the first option in q1; q2 must no longer offer it.
    fireEvent.change(q1, { target: { value: 'first_street' } });
    const q2Values = Array.from(q2.querySelectorAll('option')).map(o => o.value);
    expect(q2Values).not.toContain('first_street');
  });

  it('keeps the Create-account CTA disabled until both questions are chosen, distinct, answered', async () => {
    await renderSignup();
    fillCredentials();
    const cta = screen.getByRole('button', { name: /create account/i });
    expect(cta.disabled).toBe(true); // questions not yet set

    fireEvent.change(screen.getByLabelText('First question'), { target: { value: 'first_street' } });
    fireEvent.change(screen.getByPlaceholderText(/answer to the first question/i), { target: { value: 'Elm' } });
    fireEvent.change(screen.getByLabelText('Second question'), { target: { value: 'first_pet' } });
    expect(cta.disabled).toBe(true); // second answer still empty

    fireEvent.change(screen.getByPlaceholderText(/answer to the second question/i), { target: { value: 'Rex' } });
    expect(cta.disabled).toBe(false); // complete
  });

  it('fires the deferred security-answer write on poll success, then onAuthed', async () => {
    vi.useFakeTimers();
    authSignUp.mockResolvedValueOnce({ needsVerification: true });
    // First poll: still unconfirmed. Second poll: confirmed (session granted).
    authSignIn
      .mockRejectedValueOnce(new Error('Email not confirmed'))
      .mockResolvedValueOnce(undefined);

    const onAuthed = vi.fn();
    await renderSignup(onAuthed);

    fillCredentials();
    fireEvent.change(screen.getByLabelText('First question'), { target: { value: 'first_street' } });
    fireEvent.change(screen.getByPlaceholderText(/answer to the first question/i), { target: { value: ' Elm ' } });
    fireEvent.change(screen.getByLabelText('Second question'), { target: { value: 'first_pet' } });
    fireEvent.change(screen.getByPlaceholderText(/answer to the second question/i), { target: { value: 'Rex' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Verify screen showed (the auto-login note).
    expect(screen.getByText(/sign you in automatically/i)).toBeTruthy();
    // The signup ran with the typed credentials.
    expect(authSignUp).toHaveBeenCalledWith('gm@example.com', 'hunter2');

    // The hook fires one immediate attempt (unconfirmed → swallowed), then polls.
    // Advance two intervals so the second, successful attempt runs and resolves.
    await act(async () => { await vi.advanceTimersByTimeAsync(8200); });

    expect(authSetSecurityAnswers).toHaveBeenCalledTimes(1);
    // Answers are stashed with trimmed text; question ids are the stable ids.
    expect(authSetSecurityAnswers).toHaveBeenCalledWith({
      q1: 'first_street', a1: 'Elm', q2: 'first_pet', a2: 'Rex',
    });
    // Deferred capture runs BEFORE onAuthed hands off.
    expect(onAuthed).toHaveBeenCalledTimes(1);
    expect(authSignIn).toHaveBeenCalledWith('gm@example.com', 'hunter2');
  });
});
