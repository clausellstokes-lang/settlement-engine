/**
 * tests/lib/campaignsTimeout.test.js — hang guard on campaigns.js network legs.
 *
 * Locks:
 *   • Every supabase network leg in campaigns.js (list, upsert's getUser + upsert,
 *     delete, and the persist_world_pulse_advance RPC) is withTimeout-guarded, so a
 *     stalled call REJECTS with a TimeoutError instead of pending forever. Unguarded,
 *     a hang leaves the campaign screen loading with no recovery — and a hung
 *     advance RPC permanently wedges advanceInFlight/changeQueueFlushing.
 *   • The guard rejects (never resolves), so a timed-out write is never mistaken
 *     for a successful one.
 *   • A leg that settles normally still resolves with its mapped result (the
 *     wrapper changes failure mode only, not the happy path).
 *
 * Before the fix these legs awaited the supabase thenables bare; with a
 * never-settling call each assertion below would hang past the suite timeout.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** A supabase query-builder stand-in: every chain method returns the builder,
 *  and awaiting it never settles (a stalled network leg). */
function hangingBuilder() {
  const builder = {};
  for (const method of ['select', 'order', 'upsert', 'insert', 'update', 'delete', 'eq', 'single']) {
    builder[method] = () => builder;
  }
  builder.then = () => {}; // thenable that never calls its callbacks
  return builder;
}

/** Same chain shape, but awaiting it resolves with `result`. */
function resolvingBuilder(result) {
  const builder = {};
  for (const method of ['select', 'order', 'upsert', 'insert', 'update', 'delete', 'eq', 'single']) {
    builder[method] = () => builder;
  }
  builder.then = (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected);
  return builder;
}

const NEVER = new Promise(() => {});

async function loadCampaigns(supabaseMock) {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase.js', async (importOriginal) => {
    const actual = await importOriginal(); // real withTimeout + TimeoutError
    return { ...actual, isConfigured: true, supabase: supabaseMock };
  });
  const { campaigns } = await import('../../src/lib/campaigns.js');
  return campaigns;
}

/** Kick off `run`, advance fake time past every timeout, assert TimeoutError. */
async function expectTimeout(run, ms) {
  const promise = run();
  const assertion = expect(promise).rejects.toMatchObject({ name: 'TimeoutError', isTimeout: true });
  await vi.advanceTimersByTimeAsync(ms);
  await assertion;
}

describe('campaigns.js network legs reject on a stalled call instead of hanging', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('list() times out when the select never settles', async () => {
    const campaigns = await loadCampaigns({ from: () => hangingBuilder() });
    await expectTimeout(() => campaigns.list(), 20000);
  });

  it('upsert() times out when auth.getUser never settles', async () => {
    const campaigns = await loadCampaigns({
      auth: { getUser: () => NEVER },
      from: () => hangingBuilder(),
    });
    await expectTimeout(() => campaigns.upsert({ id: 'c1', name: 'Test' }), 15000);
  });

  it('upsert() times out when the row upsert never settles', async () => {
    const campaigns = await loadCampaigns({
      auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
      from: () => hangingBuilder(),
    });
    await expectTimeout(() => campaigns.upsert({ id: 'c1', name: 'Test' }), 20000);
  });

  it('delete() times out when the delete never settles', async () => {
    const campaigns = await loadCampaigns({ from: () => hangingBuilder() });
    await expectTimeout(() => campaigns.delete('c1'), 20000);
  });

  it('persistWorldPulseAdvance() times out when the RPC never settles (the advanceInFlight wedge)', async () => {
    const campaigns = await loadCampaigns({ rpc: () => NEVER });
    await expectTimeout(
      () => campaigns.persistWorldPulseAdvance({ campaignId: 'c1', campaign: { id: 'c1' } }),
      30000,
    );
  });

  it('list() still resolves normally when the query settles in time', async () => {
    const row = {
      id: 'row-1',
      name: 'Cloud Campaign',
      map_data: { kind: 'settlementforge_campaign', version: 2, campaign: { id: 'row-1', name: 'Cloud Campaign' } },
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    };
    const campaigns = await loadCampaigns({ from: () => resolvingBuilder({ data: [row], error: null }) });
    const listed = await campaigns.list();
    expect(listed).toEqual([expect.objectContaining({ id: 'row-1', name: 'Cloud Campaign' })]);
  });

  it('persistWorldPulseAdvance() still resolves the RPC outcome when it settles in time', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { applied: true, settlementsWritten: 2 }, error: null });
    const campaigns = await loadCampaigns({ rpc });
    const outcome = await campaigns.persistWorldPulseAdvance({
      campaignId: 'c1',
      campaign: { id: 'c1' },
      settlementUpdates: [{ saveId: 's1' }],
      expectedTick: 4,
    });
    expect(outcome).toEqual({ applied: true, settlementsWritten: 2 });
    expect(rpc).toHaveBeenCalledWith('persist_world_pulse_advance', expect.objectContaining({
      p_campaign_id: 'c1',
      p_expected_tick: 4,
    }));
  });
});
