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

// ── Configured mode: authorization gating ──────────────────────────────────
// With Supabase configured, the page must authorize the reset form ONLY on a
// genuine recovery signal (the PASSWORD_RECOVERY event or a 'type=recovery'
// URL marker), never on a bare logged-in session. Otherwise an ordinary or
// stolen session reaching /set-new-password could rotate the password with no
// current-password re-auth.
describe('SetNewPasswordPage — configured authorization gating', () => {
  /** Mount the page with a freshly mocked supabase + a controlled URL. */
  async function renderConfigured({ url = '#', emitRecovery = false } = {}) {
    vi.resetModules();
    const hashIndex = url.indexOf('#');
    const searchIndex = url.indexOf('?');
    const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
    const search = searchIndex >= 0
      ? url.slice(searchIndex, hashIndex >= 0 ? hashIndex : undefined)
      : '';
    window.history.replaceState({}, '', `/set-new-password${search}${hash}`);

    let recoveryCb = null;
    const supabaseMock = {
      auth: {
        onAuthStateChange: (cb) => {
          recoveryCb = cb;
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        // A bare session exists, but the page must NOT treat it as authorization.
        getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'u1' } } } }),
      },
    };
    vi.doMock('../../src/store/index.js', () => {
      function useStore(selector) { return selector(storeState); }
      useStore.subscribe = () => () => {};
      useStore.getState = () => storeState;
      return { useStore };
    });
    vi.doMock('../../src/lib/supabase.js', () => ({ isConfigured: true, supabase: supabaseMock }));
    vi.doMock('../../src/hooks/useRoute.js', () => ({ navigate }));

    const Page = (await import('../../src/components/auth/SetNewPasswordPage.jsx')).default;
    await act(async () => { render(<Page />); });
    if (emitRecovery && recoveryCb) {
      await act(async () => { recoveryCb('PASSWORD_RECOVERY', null); });
    }
    return { supabaseMock };
  }

  afterEach(() => { window.history.replaceState({}, '', '/'); vi.resetModules(); });

  it('does NOT authorize an ordinary session with no recovery marker', async () => {
    await renderConfigured({ url: '#' });
    // No recovery signal: settle to no-session, never the form.
    await act(async () => { await new Promise(r => setTimeout(r, 1300)); });
    expect(screen.queryByRole('button', { name: /set new password/i })).toBeNull();
    expect(screen.getByRole('button', { name: /send a reset link/i })).toBeTruthy();
  });

  it('authorizes on a type=recovery URL marker', async () => {
    await renderConfigured({ url: '#access_token=abc&type=recovery' });
    expect(await screen.findByRole('button', { name: /set new password/i })).toBeTruthy();
  });

  it('authorizes on the PASSWORD_RECOVERY event', async () => {
    await renderConfigured({ url: '#', emitRecovery: true });
    expect(await screen.findByRole('button', { name: /set new password/i })).toBeTruthy();
  });
});
