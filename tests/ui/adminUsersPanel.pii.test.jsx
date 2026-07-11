/**
 * @vitest-environment jsdom
 *
 * tests/ui/adminUsersPanel.pii.test.jsx — pins the W4g security contract.
 *
 * AdminUsersPanel replaced the old admin user console, whose vulnerability was a
 * RAW client-side `profiles.select('*')` read: unaudited PII (every user's email
 * + columns) shipped into the browser to any elevated role. This test locks the
 * fix so it can never silently regress:
 *
 *   - the ONLY user-data source is the audited `list_users` admin-actions edge
 *     action (server role-gated, redacted, one audit row);
 *   - the panel NEVER reads a table directly (`supabase.from(...)` throws if
 *     called — a raw read would fail this test loudly);
 *   - what renders is the MASKED email the audited action returns, never a raw
 *     address.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

// Hoisted spies so the mock factory (which vitest lifts above imports) can wire
// them. `from` throws: any direct table read is the raw-PII path we forbid.
const { invoke, from } = vi.hoisted(() => ({
  invoke: vi.fn(),
  from: vi.fn(() => {
    throw new Error('AdminUsersPanel must not read a table directly (raw-PII path)');
  }),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    functions: { invoke: (...args) => invoke(...args) },
    from: (...args) => from(...args),
  },
}));

import AdminUsersPanel from '../../src/components/admin/AdminUsersPanel.jsx';

afterEach(() => {
  cleanup();
  invoke.mockReset();
  from.mockClear();
});

describe('AdminUsersPanel — no raw-PII path (W4g)', () => {
  test('search routes through the audited list_users action, never a raw table read, and renders the masked email only', async () => {
    invoke.mockResolvedValue({
      data: {
        users: [{
          id: 'u-1234567890',
          role: 'user',
          tier: 'free',
          display_name: 'Alice',
          email_masked: 'a***@example.com',
          redacted: true,
        }],
      },
      error: null,
    });

    render(<AdminUsersPanel />);

    const input = screen.getByLabelText('Search users by id, email, or name');
    fireEvent.change(input, { target: { value: 'alice' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // The masked email from the audited payload renders.
    expect(await screen.findByText('a***@example.com')).toBeTruthy();

    // The one and only backend call is the audited, redacted list_users action.
    expect(invoke).toHaveBeenCalledWith('admin-actions', {
      body: { action: 'list_users', metadata: { search: 'alice' } },
    });

    // No direct table read EVER — mount and search both go through the edge fn.
    expect(from).not.toHaveBeenCalled();

    // The raw address is never present; only the masked form the edge returns.
    expect(screen.queryByText('alice@example.com')).toBeNull();
  });
});
