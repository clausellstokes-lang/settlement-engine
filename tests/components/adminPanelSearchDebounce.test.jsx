/** @vitest-environment jsdom */
/**
 * tests/components/adminPanelSearchDebounce.test.jsx — UI-resilience lane.
 *
 * Pins the AdminPanel user-search debounce. The audited `list_users`
 * admin-actions edge call fires an edge INVOCATION + an audit-log row, so it
 * MUST NOT fire on every keystroke. The fix debounces the trigger (~350ms): a
 * burst of typing collapses into ONE search call once the user pauses, while
 * the audited path itself is untouched.
 *
 * This test drives the REAL AdminPanel through the REAL search input (it does
 * not stand in an RPC proxy): it counts `supabase.functions.invoke` calls with
 * `{ action: 'list_users' }` and asserts that rapid input yields exactly ONE
 * extra (debounced) call, not one-per-character. It would FAIL if the debounce
 * were reverted (each keystroke would re-trigger fetchUsers).
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, cleanup, act } from '@testing-library/react';

// ── supabase mock — count list_users invocations. ──────────────────────────
const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...a) => invoke(...a) } },
}));

// ── store mock — elevated admin so the panel renders its body. ──────────────
const STORE = { auth: { user: { id: 'admin-1' }, tier: 'developer' }, isElevated: () => true };
vi.mock('../../src/store/index.js', () => ({
  useStore: Object.assign((selector) => selector(STORE), { getState: () => STORE }),
}));

import AdminPanel from '../../src/components/AdminPanel.jsx';

function listUsersCalls() {
  return invoke.mock.calls.filter(([fn, opts]) =>
    fn === 'admin-actions' && opts?.body?.action === 'list_users');
}

beforeEach(() => {
  vi.useFakeTimers();
  invoke.mockReset();
  invoke.mockResolvedValue({ data: { users: [] }, error: null });
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  cleanup();
});

describe('AdminPanel — debounced user search', () => {
  test('rapid keystrokes trigger a SINGLE debounced list_users call, not one per character', async () => {
    let getByLabelText;
    await act(async () => {
      ({ getByLabelText } = render(<AdminPanel />));
    });

    // One fetch fires on mount (the initial unfiltered load). Record the
    // baseline so we measure only the search-driven calls.
    const baseline = listUsersCalls().length;
    expect(baseline).toBe(1);

    const input = getByLabelText('Search users by email or name');

    // Type a burst of characters with no pause between them. Each keystroke
    // updates the controlled value but must NOT fire its own edge call.
    act(() => {
      for (const ch of ['a', 'b', 'c', 'd', 'e']) {
        fireEvent.change(input, { target: { value: input.value + ch } });
      }
    });

    // Before the debounce window elapses, NO new call should have fired.
    expect(listUsersCalls().length).toBe(baseline);

    // Let the debounce window (350ms) elapse and flush the resulting fetch.
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // Exactly ONE additional call — the single debounced search for "abcde".
    const after = listUsersCalls();
    expect(after.length).toBe(baseline + 1);
    expect(after[after.length - 1][1].body.metadata.search).toBe('abcde');
  });

  test('Enter flushes immediately, bypassing the debounce timer', async () => {
    let getByLabelText;
    await act(async () => {
      ({ getByLabelText } = render(<AdminPanel />));
    });
    const baseline = listUsersCalls().length;
    const input = getByLabelText('Search users by email or name');

    act(() => {
      fireEvent.change(input, { target: { value: 'orc' } });
    });
    // Enter should fire the search NOW, without waiting for the timer.
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    const after = listUsersCalls();
    expect(after.length).toBe(baseline + 1);
    expect(after[after.length - 1][1].body.metadata.search).toBe('orc');
  });

  test('an out-of-order (stale) fetch response does NOT overwrite the newest results', async () => {
    // Only DEFER the list_users search calls (keyed by their search term); every
    // other panel's invoke resolves immediately so the panel body settles. This
    // lets us resolve the "old" and "new" list_users fetches out of firing order.
    const pending = new Map(); // search term -> resolve fn
    invoke.mockImplementation((fn, opts) => {
      if (fn === 'admin-actions' && opts?.body?.action === 'list_users') {
        const term = opts.body.metadata?.search ?? '';
        if (term === 'old' || term === 'new') {
          return new Promise((resolve) => { pending.set(term, resolve); });
        }
      }
      return Promise.resolve({ data: { users: [] }, error: null });
    });

    let getByLabelText, getByText, queryByText;
    await act(async () => {
      ({ getByLabelText, getByText, queryByText } = render(<AdminPanel />));
    });

    const input = getByLabelText('Search users by email or name');

    // Fire search "old" (flush via Enter), then search "new" (flush via Enter).
    // Both list_users fetches are now in flight, unresolved.
    act(() => { fireEvent.change(input, { target: { value: 'old' } }); });
    await act(async () => { fireEvent.keyDown(input, { key: 'Enter' }); });
    act(() => { fireEvent.change(input, { target: { value: 'new' } }); });
    await act(async () => { fireEvent.keyDown(input, { key: 'Enter' }); });

    // Resolve NEW first, then the stale OLD — the stale payload must be dropped.
    await act(async () => {
      pending.get('new')({ data: { users: [{ id: 'u-new', display_name: 'Newmatch' }] }, error: null });
      pending.get('old')({ data: { users: [{ id: 'u-old', display_name: 'Oldmatch' }] }, error: null });
    });

    // The newest search's row is shown; the stale response never clobbered it.
    expect(getByText('Newmatch')).toBeTruthy();
    expect(queryByText('Oldmatch')).toBeNull();
  });

  test('the audited list_users path (action + search metadata) is preserved', async () => {
    await act(async () => {
      render(<AdminPanel />);
    });
    const calls = listUsersCalls();
    expect(calls.length).toBe(1);
    // The audited contract: routed through admin-actions with the list_users
    // action and a (trimmed) search metadata field — unchanged by debouncing.
    expect(calls[0][0]).toBe('admin-actions');
    expect(calls[0][1].body.action).toBe('list_users');
    expect(calls[0][1].body.metadata).toHaveProperty('search', '');
  });
});
