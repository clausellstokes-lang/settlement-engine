/**
 * @vitest-environment jsdom
 *
 * tests/ui/setNewPasswordPage.test.jsx — the Auth Phase 2 set-new-password page
 * (the recovery-link landing).
 *
 * Pins the completion form's behaviour with supabase UNCONFIGURED (the lazy
 * phase initializer starts 'ready', so the form renders without a real recovery
 * token):
 *   • a too-short password is rejected with the validation copy;
 *   • a mismatch between the two fields is rejected;
 *   • a valid match calls authUpdatePassword and shows the success close.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

const authUpdatePassword = vi.fn().mockResolvedValue(undefined);
const navigate = vi.fn();

const storeState = { authUpdatePassword };

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// Unconfigured: phase starts 'ready' so the form renders synchronously and the
// password update is a harmless no-op (mockUpdatePassword).
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: null }));
vi.mock('../../src/hooks/useRoute.js', () => ({ navigate }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

async function renderPage() {
  const Page = (await import('../../src/components/auth/SetNewPasswordPage.jsx')).default;
  render(<Page />);
}

function fields() {
  return screen.getAllByPlaceholderText(/password/i); // [0] new, [1] confirm
}

describe('SetNewPasswordPage', () => {
  it('rejects a too-short password', async () => {
    await renderPage();
    const [pw, confirm] = fields();
    fireEvent.change(pw, { target: { value: 'abc' } });
    fireEvent.change(confirm, { target: { value: 'abc' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /set new password/i })); });
    expect(screen.getByText(/at least six characters/i)).toBeTruthy();
    expect(authUpdatePassword).not.toHaveBeenCalled();
  });

  it('rejects a mismatch between the two fields', async () => {
    await renderPage();
    const [pw, confirm] = fields();
    fireEvent.change(pw, { target: { value: 'hunter2' } });
    fireEvent.change(confirm, { target: { value: 'hunter3' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /set new password/i })); });
    expect(screen.getByText(/do not match/i)).toBeTruthy();
    expect(authUpdatePassword).not.toHaveBeenCalled();
  });

  it('updates the password and shows the success close on a valid match', async () => {
    await renderPage();
    const [pw, confirm] = fields();
    fireEvent.change(pw, { target: { value: 'hunter2' } });
    fireEvent.change(confirm, { target: { value: 'hunter2' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /set new password/i })); });
    expect(authUpdatePassword).toHaveBeenCalledWith('hunter2');
    expect(await screen.findByText(/your password is set/i)).toBeTruthy();
  });
});
