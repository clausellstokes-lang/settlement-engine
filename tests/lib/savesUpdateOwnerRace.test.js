/**
 * Production surface: saves.update's owner filter and commit-proof handling.
 *
 * A zero-row update cannot be treated as success after A→B or A→B→A rotation.
 * The negative control leaves a still-visible row retryable; a returned expected
 * id is the only response that proves the original write committed.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

const SAVE_ID = '77777777-7777-4777-8777-777777777777';

const h = vi.hoisted(() => {
  const state = {
    userId: 'owner-a',
    updateStarted: false,
    updateFilters: {},
    resolveUpdate: null,
    remainingRow: null,
  };
  return {
    state,
    reset() {
      state.userId = 'owner-a';
      state.updateStarted = false;
      state.updateFilters = {};
      state.resolveUpdate = null;
      state.remainingRow = null;
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
      update: () => {
        const query = {
          eq: (column, value) => {
            h.state.updateFilters[column] = value;
            return query;
          },
          select: () => {
            h.state.updateStarted = true;
            return new Promise(resolve => {
              h.state.resolveUpdate = resolve;
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
  },
}));

const { saves } = await import('../../src/lib/saves.js');

describe('settlement update commit proof across auth rotation', () => {
  beforeEach(() => h.reset());

  test('A to B rotation rejects a zero-row update and preserves it for retry', async () => {
    const updating = saves.update(
      SAVE_ID,
      { name: 'A write' },
      { expectedOwnerId: 'owner-a' },
    );
    await vi.waitFor(() => expect(h.state.updateStarted).toBe(true));
    h.state.userId = 'owner-b';
    h.state.resolveUpdate({ data: [], error: null });

    await expect(updating).rejects.toMatchObject({
      code: 'auth_session_changed',
      expectedOwnerId: 'owner-a',
      actualOwnerId: 'owner-b',
    });
    expect(h.state.updateFilters).toEqual({
      id: SAVE_ID,
      user_id: 'owner-a',
    });
  });

  test('A to B to A cannot turn the zero-row response into false success', async () => {
    h.state.remainingRow = { id: SAVE_ID };
    const updating = saves.update(
      SAVE_ID,
      { name: 'A write' },
      { expectedOwnerId: 'owner-a' },
    );
    await vi.waitFor(() => expect(h.state.updateStarted).toBe(true));
    h.state.userId = 'owner-b';
    h.state.userId = 'owner-a';
    h.state.resolveUpdate({ data: [], error: null });

    await expect(updating).rejects.toMatchObject({
      code: 'settlement_update_unconfirmed',
    });
  });

  test('returned expected id proves the write even if auth rotates afterward', async () => {
    const updating = saves.update(
      SAVE_ID,
      { name: 'A write' },
      { expectedOwnerId: 'owner-a' },
    );
    await vi.waitFor(() => expect(h.state.updateStarted).toBe(true));
    h.state.userId = 'owner-b';
    h.state.resolveUpdate({ data: [{ id: SAVE_ID }], error: null });

    await expect(updating).resolves.toBe(SAVE_ID);
  });
});
