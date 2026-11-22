/**
 * Production surface: direct settlement deletion and mutate_settlement_batch.
 *
 * A zero-row response is ambiguous across auth rotation and must never become
 * false success. Returned ids/counts are commit proof; the negative controls keep
 * a visible row retryable and accept idempotence only after absence is proven.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

const SAVE_ID = '44444444-4444-4444-8444-444444444444';

const h = vi.hoisted(() => {
  const state = {
    userId: 'owner-a',
    deleteStarted: false,
    deleteFilters: {},
    resolveDelete: null,
    remainingRow: null,
    batchStarted: false,
    resolveBatch: null,
  };
  return {
    state,
    reset() {
      state.userId = 'owner-a';
      state.deleteStarted = false;
      state.deleteFilters = {};
      state.resolveDelete = null;
      state.remainingRow = null;
      state.batchStarted = false;
      state.resolveBatch = null;
    },
  };
});

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: h.state.userId ? { id: h.state.userId } : null },
      })),
    },
    from: vi.fn(() => ({
      delete: () => {
        const query = {
          eq: (column, value) => {
            h.state.deleteFilters[column] = value;
            return query;
          },
          select: () => {
            h.state.deleteStarted = true;
            return new Promise(resolve => {
              h.state.resolveDelete = resolve;
            });
          },
        };
        return query;
      },
      select: () => {
        const query = {
          eq: () => query,
          maybeSingle: () => Promise.resolve({
            data: h.state.remainingRow,
            error: null,
          }),
        };
        return query;
      },
    })),
    rpc: vi.fn(() => {
      h.state.batchStarted = true;
      return new Promise(resolve => {
        h.state.resolveBatch = resolve;
      });
    }),
  },
}));

const { saves } = await import('../../src/lib/saves.js');

describe('settlement delete commit proof across auth rotation', () => {
  beforeEach(() => h.reset());

  test('zero-row direct delete after A to B rotation rejects instead of false success', async () => {
    let sessionCurrent = true;
    const deleting = saves.delete(SAVE_ID, 'owner-a', () => sessionCurrent);
    await vi.waitFor(() => expect(h.state.deleteStarted).toBe(true));

    sessionCurrent = false;
    h.state.userId = 'owner-b';
    h.state.resolveDelete({ data: [], error: null });

    await expect(deleting).rejects.toMatchObject({
      code: 'auth_session_changed',
      expectedOwnerId: 'owner-a',
    });
    expect(h.state.deleteFilters).toEqual({ id: SAVE_ID, user_id: 'owner-a' });
  });

  test('returned direct-delete id proves A committed even after rotation', async () => {
    let sessionCurrent = true;
    const deleting = saves.delete(SAVE_ID, 'owner-a', () => sessionCurrent);
    await vi.waitFor(() => expect(h.state.deleteStarted).toBe(true));

    sessionCurrent = false;
    h.state.userId = 'owner-b';
    h.state.resolveDelete({ data: [{ id: SAVE_ID }], error: null });

    await expect(deleting).resolves.toBe(SAVE_ID);
  });

  test('same-owner zero-row response rejects while the row remains visible', async () => {
    h.state.remainingRow = { id: SAVE_ID };
    const deleting = saves.delete(SAVE_ID, 'owner-a', () => true);
    await vi.waitFor(() => expect(h.state.deleteStarted).toBe(true));
    h.state.resolveDelete({ data: [], error: null });

    await expect(deleting).rejects.toMatchObject({
      code: 'settlement_delete_unconfirmed',
    });
  });

  test('same-owner zero-row response is idempotent only after absence is proven', async () => {
    h.state.remainingRow = null;
    const deleting = saves.delete(SAVE_ID, 'owner-a', () => true);
    await vi.waitFor(() => expect(h.state.deleteStarted).toBe(true));
    h.state.resolveDelete({ data: [], error: null });

    await expect(deleting).resolves.toBeNull();
  });

  test('ambiguous zero-count delete batch rechecks and rejects after rotation', async () => {
    let sessionCurrent = true;
    const deleting = saves.mutateBatch(
      { deletes: [SAVE_ID] },
      { expectedOwnerId: 'owner-a', isSessionCurrent: () => sessionCurrent },
    );
    await vi.waitFor(() => expect(h.state.batchStarted).toBe(true));

    sessionCurrent = false;
    h.state.userId = 'owner-b';
    h.state.resolveBatch({ data: 0, error: null });

    await expect(deleting).rejects.toMatchObject({ code: 'auth_session_changed' });
  });

  test('exact affected count proves atomic batch commit despite later rotation', async () => {
    let sessionCurrent = true;
    const deleting = saves.mutateBatch(
      { deletes: [SAVE_ID] },
      { expectedOwnerId: 'owner-a', isSessionCurrent: () => sessionCurrent },
    );
    await vi.waitFor(() => expect(h.state.batchStarted).toBe(true));

    sessionCurrent = false;
    h.state.userId = 'owner-b';
    h.state.resolveBatch({ data: 1, error: null });

    await expect(deleting).resolves.toBe(1);
  });

  test('batch RPC carries the expected owner into the server transaction', async () => {
    const deleting = saves.mutateBatch(
      { deletes: [SAVE_ID] },
      { expectedOwnerId: 'owner-a', isSessionCurrent: () => true },
    );
    await vi.waitFor(() => expect(h.state.batchStarted).toBe(true));
    h.state.resolveBatch({ data: 1, error: null });
    await deleting;

    expect(vi.mocked((await import('../../src/lib/supabase.js')).supabase.rpc))
      .toHaveBeenCalledWith(
        'mutate_settlement_batch',
        expect.objectContaining({ p_expected_user: 'owner-a' }),
      );
  });
});
