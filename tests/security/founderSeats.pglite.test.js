/**
 * founderSeats.pglite.test.js — the production seat register (137 rewrite, M-5a,
 * §6.1). Applies the REAL 137 migration into pglite and exercises:
 *   - claim_next_founder_seat: claims the lowest seat and stamps the original-
 *     purchase lifecycle (original_purchase_at + transfer_eligible_at = +12mo +
 *     acquired_via='purchase'); idempotent (an existing holder gets their seat
 *     back, never a second, original stamps preserved).
 *   - release_founder_seat_on_clawback: clears the holder (seat returns to the
 *     pool), appends a 'clawback' lineage note, claim-once (a redelivered refund
 *     no-ops), and snapshots the outgoing holder's opted+approved display name.
 *   - the service-role gate on both.
 *   - THE PROJECTION CONTRACT (founderLineage.js): list_founder_seats_public()
 *     still returns exactly {seat_id, display_name, gallery_slug, held_since,
 *     prior_names} — the shape FoundersPage renders from is UNCHANGED by the
 *     v2 rewrite (never a holder user id).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_137 = resolve(dir, '137_founder_seats.sql');
const U = '22222222-2222-2222-2222-222222222222';
const V = '44444444-4444-4444-4444-444444444444';

async function makeDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$ select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated') $fn$;
    create table if not exists auth.users (id uuid primary key);
    create table if not exists public.profiles (id uuid primary key, is_founder boolean default false);
    insert into auth.users(id) values ('${U}'), ('${V}') on conflict do nothing;
    insert into public.profiles(id, is_founder) values ('${U}', false), ('${V}', false) on conflict do nothing;
  `);
  await db.exec(readFileSync(MIG_137, 'utf-8'));
  return db;
}

async function asService(db) {
  await db.query(`select set_config('test.role', 'service_role', false)`);
  await db.query(`select set_config('test.uid', '', false)`);
}
async function asUser(db, uid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid}', false)`);
}

let db;
beforeEach(async () => { db = await makeDb(); });

describe('seed + claim lifecycle', () => {
  it('seeds 30 unclaimed seats', async () => {
    const n = (await db.query(`select count(*)::int as c from public.founder_seats`)).rows[0].c;
    expect(n).toBe(30);
    const held = (await db.query(`select count(*)::int as c from public.founder_seats where holder_user_id is not null`)).rows[0].c;
    expect(held).toBe(0);
  });

  it('claim stamps the original-purchase lifecycle and is idempotent per user', async () => {
    await asService(db);
    const first = (await db.query(`select public.claim_next_founder_seat('${U}'::uuid) as r`)).rows[0].r;
    expect(first.seat_id).toBe(1);
    expect(first.assigned).toBe(true);
    let row = (await db.query(`
      select holder_user_id, acquired_via, original_purchase_at is not null as opa,
             held_since is not null as hs,
             (transfer_eligible_at = original_purchase_at + interval '12 months') as tea_ok
      from public.founder_seats where seat_id = 1`)).rows[0];
    expect(row).toMatchObject({ holder_user_id: U, acquired_via: 'purchase', opa: true, hs: true, tea_ok: true });
    const origAt = (await db.query(`select original_purchase_at from public.founder_seats where seat_id=1`)).rows[0].original_purchase_at;

    // Idempotent: a second claim returns the SAME seat, assigned:false, original stamp preserved.
    const second = (await db.query(`select public.claim_next_founder_seat('${U}'::uuid) as r`)).rows[0].r;
    expect(second.seat_id).toBe(1);
    expect(second.assigned).toBe(false);
    const origAt2 = (await db.query(`select original_purchase_at from public.founder_seats where seat_id=1`)).rows[0].original_purchase_at;
    expect(origAt2).toEqual(origAt);
    // A different user takes the NEXT seat.
    const other = (await db.query(`select public.claim_next_founder_seat('${V}'::uuid) as r`)).rows[0].r;
    expect(other.seat_id).toBe(2);
  });

  it('claim is service-role only', async () => {
    await asUser(db, U);
    await expect(db.query(`select public.claim_next_founder_seat('${U}'::uuid)`)).rejects.toThrow(/service-role only/);
  });
});

describe('clawback seat release (mirror of the claim)', () => {
  it('clears the holder, appends a clawback lineage note, and is claim-once', async () => {
    await asService(db);
    await db.query(`select public.claim_next_founder_seat('${U}'::uuid)`);
    // opt in a display name + approve it (simulate moderation) so the release snapshots it.
    await asUser(db, U);
    await db.query(`select public.set_founder_display_optin('Aldric the Founder', null)`);
    await asService(db);
    await db.query(`update public.founder_seats set display_name_status='approved' where seat_id=1`);

    const rel = (await db.query(`select public.release_founder_seat_on_clawback('${U}'::uuid) as r`)).rows[0].r;
    expect(rel).toMatchObject({ released: true, seat_id: 1 });
    // Seat returns to the unclaimed pool, reset to a fresh state.
    const seat = (await db.query(`select holder_user_id, security_status, held_since, original_purchase_at, acquired_via from public.founder_seats where seat_id=1`)).rows[0];
    expect(seat.holder_user_id).toBeNull();
    expect(seat.security_status).toBe('normal');
    expect(seat.held_since).toBeNull();
    expect(seat.original_purchase_at).toBeNull();
    // A 'clawback' lineage note is appended with the opted display name snapshot.
    const note = (await db.query(`select from_holder, from_display_name, note from public.founder_seat_transfers where seat_id=1`)).rows[0];
    expect(note).toMatchObject({ from_holder: U, from_display_name: 'Aldric the Founder', note: 'clawback' });
    // Claim-once: a redelivered refund finds the holder already cleared and no-ops.
    const again = (await db.query(`select public.release_founder_seat_on_clawback('${U}'::uuid) as r`)).rows[0].r;
    expect(again).toMatchObject({ released: false });
    const noteCount = (await db.query(`select count(*)::int as c from public.founder_seat_transfers where seat_id=1`)).rows[0].c;
    expect(noteCount).toBe(1); // no second note
  });

  it('release is service-role only', async () => {
    await asUser(db, U);
    await expect(db.query(`select public.release_founder_seat_on_clawback('${U}'::uuid)`)).rejects.toThrow(/service-role only/);
  });
});

describe('projection contract (founderLineage.js) — UNCHANGED by the v2 rewrite', () => {
  it('list_founder_seats_public returns exactly the 5 fields the client consumes, never a holder id', async () => {
    await asService(db);
    await db.query(`select public.claim_next_founder_seat('${U}'::uuid)`);
    await asUser(db, U);
    await db.query(`select public.set_founder_display_optin('Aldric', 'my-world')`);
    await asService(db);
    await db.query(`update public.founder_seats set display_name_status='approved' where seat_id=1`);

    await db.query(`select set_config('test.role', 'anon', false)`);
    const res = await db.query(`select * from public.list_founder_seats_public() order by seat_id limit 1`);
    const cols = Object.keys(res.rows[0]).sort();
    expect(cols).toEqual(['display_name', 'gallery_slug', 'held_since', 'prior_names', 'seat_id']);
    // The approved opt-in projects; a holder user id NEVER appears in the output.
    expect(res.rows[0]).toMatchObject({ seat_id: 1, display_name: 'Aldric', gallery_slug: 'my-world' });
    expect(cols).not.toContain('holder_user_id');
  });

  it('prior opted names survive a clawback release into prior_names', async () => {
    await asService(db);
    await db.query(`select public.claim_next_founder_seat('${U}'::uuid)`);
    await asUser(db, U);
    await db.query(`select public.set_founder_display_optin('Aldric', null)`);
    await asService(db);
    await db.query(`update public.founder_seats set display_name_status='approved' where seat_id=1`);
    await db.query(`select public.release_founder_seat_on_clawback('${U}'::uuid)`);

    await db.query(`select set_config('test.role', 'anon', false)`);
    const row = (await db.query(`select prior_names from public.list_founder_seats_public() where seat_id=1`)).rows[0];
    expect(row.prior_names).toContain('Aldric');
  });
});
