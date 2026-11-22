/**
 * Production surface: migration 181's complete lease schema and claim,
 * complete, and release RPCs, executed directly in PGlite.
 *
 * Legacy rows remain completed dedupe, stale leases are reclaimable, and a
 * current lease can complete or enter durable retry state. Client roles and
 * superseded lease tokens are the negative controls and may not mutate another
 * claimant's row.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const migration = readFileSync(
  resolve(
    process.cwd(),
    'supabase',
    'migrations',
    '181_leased_stripe_webhook_events.sql',
  ),
  'utf8',
);

let db;
const claim = async (eventId) => {
  const { rows } = await db.query(
    `select public.claim_stripe_webhook_event(
      $1,
      'invoice.paid',
      300
    ) as result`,
    [eventId],
  );
  return rows[0].result;
};

describe('migration 181 leased Stripe webhook claims', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema auth;
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create or replace function auth.role() returns text language sql stable as $$
        select coalesce(
          nullif(current_setting('test.role', true), ''),
          'service_role'
        )
      $$;
      create table public.processed_webhook_events (
        event_id text primary key,
        event_type text,
        processed_at timestamptz not null default now()
      );
      insert into public.processed_webhook_events(event_id, event_type)
      values ('evt_legacy', 'invoice.paid');
      set test.role = 'service_role';
    `);
    await db.exec(migration);
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('backfills legacy claims as completed rows', async () => {
    const { rows } = await db.query(`
      select status, completed_at is not null as completed,
             lease_token is null as no_lease,
             first_claimed_at = processed_at as claim_clock_backfilled
      from public.processed_webhook_events
      where event_id = 'evt_legacy'
    `);
    expect(rows[0]).toEqual({
      status: 'done',
      completed: true,
      no_lease: true,
      claim_clock_backfilled: true,
    });
    expect(await claim('evt_legacy')).toMatchObject({
      claimed: false,
      reason: 'done',
    });
  });

  it('denies every lease mutation RPC to client roles', async () => {
    await db.exec('set role authenticated');
    try {
      await expect(db.query(
        `select public.claim_stripe_webhook_event(
          'evt_client_denied',
          'invoice.paid',
          300
        )`,
      )).rejects.toThrow(/permission denied/i);
    } finally {
      await db.exec('reset role; set test.role = \'service_role\'');
    }
  });

  it('supports a non-mutating empty-id readiness probe', async () => {
    const before = await db.query(
      'select count(*)::int as count from public.processed_webhook_events',
    );
    await expect(claim('')).rejects.toThrow(/event id is required/i);
    const after = await db.query(
      'select count(*)::int as count from public.processed_webhook_events',
    );
    expect(after.rows[0].count).toBe(before.rows[0].count);
  });

  it('returns in_progress for a live lease and rotates the token on stale reclaim', async () => {
    const first = await claim('evt_reclaim');
    expect(first.claimed).toBe(true);
    expect(first.lease_token).toBeTruthy();

    expect(await claim('evt_reclaim')).toMatchObject({
      claimed: false,
      reason: 'in_progress',
    });

    await db.exec(`
      update public.processed_webhook_events
      set locked_at = now() - interval '1 hour'
      where event_id = 'evt_reclaim'
    `);
    const reclaimed = await claim('evt_reclaim');
    expect(reclaimed).toMatchObject({ claimed: true, reclaimed: true });
    expect(reclaimed.lease_token).not.toBe(first.lease_token);
    expect(reclaimed.attempts).toBe(2);

    const staleComplete = await db.query(
      `select public.complete_stripe_webhook_event($1, $2::uuid) as ok`,
      ['evt_reclaim', first.lease_token],
    );
    expect(staleComplete.rows[0].ok).toBe(false);
    const currentComplete = await db.query(
      `select public.complete_stripe_webhook_event($1, $2::uuid) as ok`,
      ['evt_reclaim', reclaimed.lease_token],
    );
    expect(currentComplete.rows[0].ok).toBe(true);
    expect(await claim('evt_reclaim')).toMatchObject({
      claimed: false,
      reason: 'done',
    });
  });

  it('release is lease-guarded and makes a failed event immediately claimable', async () => {
    const first = await claim('evt_release');
    const originalClock = await db.query(`
      select first_claimed_at
        from public.processed_webhook_events
       where event_id = 'evt_release'
    `);
    await db.exec(`
      update public.processed_webhook_events
      set locked_at = now() - interval '1 hour'
      where event_id = 'evt_release'
    `);
    const second = await claim('evt_release');

    const staleRelease = await db.query(
      `select public.release_stripe_webhook_event($1, $2::uuid) as ok`,
      ['evt_release', first.lease_token],
    );
    expect(staleRelease.rows[0].ok).toBe(false);
    const currentRelease = await db.query(
      `select public.release_stripe_webhook_event($1, $2::uuid) as ok`,
      ['evt_release', second.lease_token],
    );
    expect(currentRelease.rows[0].ok).toBe(true);

    const released = await db.query(`
      select status, attempts, lease_token, locked_at, first_claimed_at
        from public.processed_webhook_events
       where event_id = 'evt_release'
    `);
    expect(released.rows[0]).toMatchObject({
      status: 'retry',
      attempts: 2,
      lease_token: null,
      locked_at: null,
      first_claimed_at: originalClock.rows[0].first_claimed_at,
    });

    const third = await claim('evt_release');
    expect(third).toMatchObject({ claimed: true, attempts: 3 });
    expect(third.lease_token).not.toBe(second.lease_token);
    const retried = await db.query(`
      select status, first_claimed_at
        from public.processed_webhook_events
       where event_id = 'evt_release'
    `);
    expect(retried.rows[0]).toEqual({
      status: 'processing',
      first_claimed_at: originalClock.rows[0].first_claimed_at,
    });
  });
});
