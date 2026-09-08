/**
 * @vitest-environment jsdom
 *
 * tests/ui/forgotPasswordFlow.test.jsx — the Auth Phase 2 forgot-password
 * challenge UI (the reworked `reset` mode).
 *
 * Pins the multi-step recovery flow that runs through the auth-recovery edge
 * function (via the store's authRecoveryLookup / authRecoveryVerify):
 *   • step 1 looks the email up; exists:false reveals an honest "no account";
 *   • an account with no question set shows the "cannot recover this way" note;
 *   • exists:true renders the returned random question's TEXT + an answer field;
 *   • a wrong answer (ok:false) shows the calm "did not match" notice and keeps
 *     the field; a correct answer (ok:true) shows the "check your email" close;
 *   • a rate-limit error disables the verify control and shows the back-off copy.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react';
import { RECOVERY_RATE_LIMITED } from '../../src/lib/auth.js';

const authRecoveryLookup = vi.fn();
const authRecoveryVerify = vi.fn();

const storeState = { authRecoveryLookup, authRecoveryVerify };

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

afterEach(() => { cleanup(); vi.clearAllMocks(); });

async function renderFlow(onBack = vi.fn()) {
  const Flow = (await import('../../src/components/auth/ForgotPasswordFlow.jsx')).default;
  render(<Flow onBackToSignIn={onBack} />);
  return onBack;
}

function typeEmail(value = 'gm@example.com') {
  fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value } });
}

describe('ForgotPasswordFlow', () => {
  it('reveals "no account" when the email does not exist', async () => {
    authRecoveryLookup.mockResolvedValueOnce({ exists: false, slot: null, questionId: null });
    await renderFlow();
    typeEmail();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /continue/i })); });
    expect(await screen.findByText(/could not find an account/i)).toBeTruthy();
  });

  it('shows the "cannot recover this way" note when the account has no question', async () => {
    authRecoveryLookup.mockResolvedValueOnce({ exists: true, slot: null, questionId: null });
    await renderFlow();
    typeEmail();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /continue/i })); });
    expect(await screen.findByText(/does not have a security question/i)).toBeTruthy();
  });

  it('renders the returned question text and mails the link on a correct answer', async () => {
    authRecoveryLookup.mockResolvedValueOnce({ exists: true, slot: 1, questionId: 'first_pet' });
    authRecoveryVerify.mockResolvedValueOnce({ ok: true });
    await renderFlow();
    typeEmail();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /continue/i })); });

    // The stable question id resolves to its display text.
    expect(await screen.findByText(/name of your first pet/i)).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText(/your answer/i), { target: { value: 'Rex' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /verify answer/i })); });

    expect(authRecoveryVerify).toHaveBeenCalledWith({ email: 'gm@example.com', slot: 1, answer: 'Rex' });
    expect(await screen.findByText(/check your email for a link/i)).toBeTruthy();
  });

  it('shows a calm "did not match" notice and keeps the field on a wrong answer', async () => {
    authRecoveryLookup.mockResolvedValueOnce({ exists: true, slot: 2, questionId: 'first_street' });
    authRecoveryVerify.mockResolvedValueOnce({ ok: false });
    await renderFlow();
    typeEmail();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /continue/i })); });

    fireEvent.change(screen.getByPlaceholderText(/your answer/i), { target: { value: 'wrong' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /verify answer/i })); });

    expect(await screen.findByText(/did not match/i)).toBeTruthy();
    // The answer field is still present for a retry.
    expect(screen.getByPlaceholderText(/your answer/i)).toBeTruthy();
  });

  it('disables the verify control and shows back-off copy when rate-limited', async () => {
    authRecoveryLookup.mockResolvedValueOnce({ exists: true, slot: 1, questionId: 'first_pet' });
    const limitErr = new Error('rate limited');
    limitErr.code = RECOVERY_RATE_LIMITED;
    authRecoveryVerify.mockRejectedValueOnce(limitErr);
    await renderFlow();
    typeEmail();
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /continue/i })); });

    fireEvent.change(screen.getByPlaceholderText(/your answer/i), { target: { value: 'Rex' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /verify answer/i })); });

    expect(await screen.findByText(/too many attempts/i)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /verify answer/i }).disabled).toBe(true);
    });
  });
});
