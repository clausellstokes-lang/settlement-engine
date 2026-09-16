/**
 * Production surface: campaigns.upsert's per-owner queue and auth/session proof.
 *
 * A queued owner-A write must not resume under owner B, and even a same-owner
 * reauthentication invalidates work from the prior session. The first committed
 * A upsert is the positive control; the stale continuation must issue no write.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

const h = vi.hoisted(() => {
  const state = {
    userId: 'owner-a',
    rows: [],
    first: null,
    getUserGate: null,
    getUserStarted: false,
    rpcGate: null,
    rpcStarted: false,
    rpcCalls: [],
  };
  const reset = () => {
    state.userId = 'owner-a';
    state.rows = [];
    let resolve;
    const promise = new Promise(r => {
      resolve = r;
    });
    state.first = { promise, resolve };
    state.getUserGate = null;
    state.getUserStarted = false;
    state.rpcGate = null;
    state.rpcStarted = false;
    state.rpcCalls = [];
  };
  reset();
  return { state, reset };
});

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: {
      getUser: vi.fn(async () => {
        if (h.state.getUserGate) {
          h.state.getUserStarted = true;
          await h.state.getUserGate.promise;
        }
        return {
          data: { user: h.state.userId ? { id: h.state.userId } : null },
        };
      }),
    },
    rpc: vi.fn(async (name, args) => {
      h.state.rpcStarted = true;
      h.state.rpcCalls.push({
        name,
        args: structuredClone(args),
      });
      if (h.state.rpcGate) await h.state.rpcGate.promise;
      return {
        data: {
          schemaVersion: 1,
          status: 'applied',
          replayed: false,
          commandId: args.p_command_id,
          fingerprint: args.p_fingerprint,
          campaignId: args.p_campaign_id,
          previousBindingHash: args.p_expected_binding_hash,
          bindingHash: args.p_target_binding.bindingHash,
          appliedAt: '2026-07-25T12:00:00.000Z',
        },
        error: null,
      };
    }),
    from: vi.fn(() => ({
      upsert: row => {
        h.state.rows.push(structuredClone(row));
        return {
          select: () => ({
            single: () => (
              h.state.rows.length === 1
                ? h.state.first.promise
                : Promise.resolve({ data: { id: row.id }, error: null })
            ),
          }),
        };
      },
    })),
  },
}));

const { campaigns } = await import('../../src/lib/campaigns.js');
const { makeCampaignContentBinding } = await import(
  '../../src/domain/content/contentEnvironment.js'
);
const { fingerprintContent } = await import(
  '../../src/domain/content/contentFingerprint.js'
);

function binding(magicExists) {
  return makeCampaignContentBinding({}, {
    source: 'test',
    tunables: { magicExists },
  });
}

describe('campaign persistence owner boundary', () => {
  beforeEach(() => h.reset());

  test('an A upsert queued behind A work cannot execute under B', async () => {
    const id = '11111111-1111-4111-8111-111111111111';
    const first = campaigns.upsert({ id, name: 'A first' }, 'owner-a');
    while (h.state.rows.length === 0) await Promise.resolve();

    const queued = campaigns.upsert({ id, name: 'A queued' }, 'owner-a');
    const queuedResult = queued.catch(error => error);
    h.state.userId = 'owner-b';
    h.state.first.resolve({ data: { id }, error: null });

    await expect(first).resolves.toBe(id);
    await expect(queuedResult).resolves.toMatchObject({
      code: 'auth_session_changed',
      expectedOwnerId: 'owner-a',
      actualOwnerId: 'owner-b',
    });
    expect(h.state.rows).toHaveLength(1);
    expect(h.state.rows[0]).toMatchObject({ id, user_id: 'owner-a', name: 'A first' });
  });

  test('same-owner session rotation while auth lookup is pending aborts before write', async () => {
    const id = '22222222-2222-4222-8222-222222222222';
    let releaseGetUser;
    h.state.getUserGate = {
      promise: new Promise(resolve => {
        releaseGetUser = resolve;
      }),
    };
    let sessionCurrent = true;

    const pending = campaigns.upsert(
      { id, name: 'Stale same-owner session' },
      'owner-a',
      () => sessionCurrent,
    );
    while (!h.state.getUserStarted) await Promise.resolve();
    sessionCurrent = false;
    releaseGetUser();

    await expect(pending).rejects.toMatchObject({
      code: 'auth_session_changed',
      expectedOwnerId: 'owner-a',
      actualOwnerId: 'owner-a',
    });
    expect(h.state.rows).toHaveLength(0);
  });

  test('submits the exact reviewed binding CAS command to the authoritative RPC', async () => {
    const id = '33333333-3333-4333-8333-333333333333';
    const current = binding(false);
    const target = binding(true);
    const previewFingerprint = fingerprintContent({ review: 'binding-cas' });

    await expect(campaigns.compareAndSwapContentBinding({
      id,
      contentBinding: target,
      contentBindingHistory: [current, target],
    }, {
      expectedBindingHash: current.bindingHash,
      previewFingerprint,
    }, 'owner-a')).resolves.toMatchObject({
      ok: true,
      status: 'applied',
      campaignId: id,
      previousBindingHash: current.bindingHash,
      bindingHash: target.bindingHash,
    });

    expect(h.state.rpcCalls).toEqual([{
      name: 'compare_and_swap_campaign_content_binding',
      args: expect.objectContaining({
        p_expected_owner: 'owner-a',
        p_campaign_id: id,
        p_expected_binding_hash: current.bindingHash,
        p_target_binding: target,
        p_content_binding_history: [current, target],
      }),
    }]);
    expect(h.state.rpcCalls[0].args.p_command_id)
      .toBe(`campaign-content-binding:${previewFingerprint}`);
    expect(h.state.rpcCalls[0].args.p_fingerprint)
      .toMatch(/^[0-9a-f]{64}$/);
  });

  test('does not project a committed CAS receipt into a replacement session', async () => {
    const id = '44444444-4444-4444-8444-444444444444';
    const current = binding(false);
    const target = binding(true);
    let releaseRpc;
    h.state.rpcGate = {
      promise: new Promise(resolve => {
        releaseRpc = resolve;
      }),
    };
    let sessionCurrent = true;

    const pending = campaigns.compareAndSwapContentBinding({
      id,
      contentBinding: target,
      contentBindingHistory: [current, target],
    }, {
      expectedBindingHash: current.bindingHash,
      previewFingerprint: fingerprintContent({ review: 'rotated-session' }),
    }, 'owner-a', () => sessionCurrent);
    while (!h.state.rpcStarted) await Promise.resolve();
    sessionCurrent = false;
    releaseRpc();

    await expect(pending).rejects.toMatchObject({
      code: 'auth_session_changed',
      expectedOwnerId: 'owner-a',
      actualOwnerId: 'owner-a',
    });
    expect(h.state.rpcCalls).toHaveLength(1);
  });
});
