/**
 * Production surface: saves.save's owner lookup, row stamp, and insert boundary.
 *
 * If auth rotates while owner lookup is pending, owner A's payload must not be
 * inserted as owner B. A current A session is the positive control and proves the
 * saved row is stamped with the expected owner.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

const h = vi.hoisted(() => {
  const state = {
    resolveUser: null,
    insertRows: [],
  };
  return {
    state,
    getUser: vi.fn(),
    from: vi.fn(),
    reset() {
      state.resolveUser = null;
      state.insertRows = [];
    },
  };
});

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getUser: (...args) => h.getUser(...args) },
    from: (...args) => h.from(...args),
  },
}));

const { saves } = await import('../../src/lib/saves.js');

function entry() {
  return {
    name: 'Owner A Save',
    tier: 'town',
    settlement: { name: 'Owner A Save', tier: 'town' },
    campaignState: { phase: 'canon', eventLog: [] },
  };
}

describe('settlement insert owner/session fence', () => {
  beforeEach(() => {
    h.reset();
    h.getUser.mockReset();
    h.from.mockReset();
    h.from.mockImplementation(() => ({
      insert: (row) => {
        h.state.insertRows.push(row);
        return {
          select: () => ({
            single: () => Promise.resolve({
              data: { id: 'owner-a-save' },
              error: null,
            }),
          }),
        };
      },
    }));
  });

  test('an A to B rotation during owner lookup rejects before any insert', async () => {
    let sessionCurrent = true;
    h.getUser.mockImplementationOnce(() => new Promise(resolve => {
      h.state.resolveUser = resolve;
    }));
    const saving = saves.save(entry(), {
      expectedOwnerId: 'owner-a',
      isSessionCurrent: () => sessionCurrent,
    });
    await vi.waitFor(() => expect(h.state.resolveUser).toBeTypeOf('function'));

    sessionCurrent = false;
    h.state.resolveUser({ data: { user: { id: 'owner-b' } } });

    await expect(saving).rejects.toMatchObject({
      code: 'auth_session_changed',
      expectedOwnerId: 'owner-a',
    });
    expect(h.from).not.toHaveBeenCalled();
  });

  test('a current A session stamps and inserts only owner A', async () => {
    h.getUser.mockResolvedValueOnce({ data: { user: { id: 'owner-a' } } });

    await expect(saves.save(entry(), {
      expectedOwnerId: 'owner-a',
      isSessionCurrent: () => true,
    })).resolves.toBe('owner-a-save');

    expect(h.from).toHaveBeenCalledWith('settlements');
    expect(h.state.insertRows).toHaveLength(1);
    expect(h.state.insertRows[0].user_id).toBe('owner-a');
  });
});
