/**
 * seatStewardship.pglite.test.js — THE STEWARDSHIP LIMB RPCs (137/157/160/161/164, M-10).
 * Applies the REAL migrations into pglite and drives the standing buyback, its caseless
 * challenge, the buyback payout claim, and the dormancy/abandonment sweeps.
 *
 * OWNER RULING pins (2026-07-19): the seat_buyback_cents dial is READ at claim time (never
 * inlined), and the LADDER holds — the transfer share (price_cents/2 = $49.50) is strictly
 * greater than the buyback amount ($25 default). Abandonment escheats EXACTLY once and any
 * sign-in aborts it; escheat seats are NEVER auto-resold.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const M = (n, f) => resolve(dir, `${n}_${f}.sql`);

const FROM = '11111111-1111-1111-1111-111111111111';
const OTHER = '33333333-3333-3333-3333-333333333333';
const SID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

let db;
async function svc(sql) {
  await db.query(`select set_config('test.role', 'service_role', false)`);
  await db.query(`select set_config('test.uid', '', false)`);
  return (await db.query(sql)).rows;
}
async function svc1(sql) { return (await svc(sql))[0]; }
async function svcAll(sql) { return svc(sql); }

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$ select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select nullif(current_setting('test.jwt', true), '')::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text);
    create table if not exists public.profiles (id uuid primary key, is_founder boolean default false, tier text default 'free', updated_at timestamptz default now());
    create table if not exists public.system_config (key text primary key, value jsonb not null, updated_at timestamptz default now());
    insert into auth.users(id, email) values ('${FROM}','from@example.com'), ('${OTHER}','other@example.com') on conflict do nothing;
    insert into public.profiles(id, is_founder, tier) values ('${FROM}', true, 'premium'), ('${OTHER}', false, 'free') on conflict do nothing;
  `);
  await db.exec(readFileSync(M(137, 'founder_seats'), 'utf-8'));
  await db.exec(readFileSync(M(157, 'money_events'), 'utf-8'));
  await db.exec(readFileSync(M(160, 'founder_transfer_cases'), 'utf-8'));
  await db.exec(readFileSync(M(161, 'single_session'), 'utf-8'));
  await db.exec(readFileSync(M(164, 'seat_stewardship'), 'utf-8'));
  await db.exec(`
    create or replace function public.gen_salt(p_type text) returns text
      language sql volatile as $fn$ select 'shim$' || md5(random()::text || clock_timestamp()::text) $fn$;
    create or replace function public.crypt(p_answer text, p_salt_or_stored text) returns text
      language sql immutable as $fn$
        select case
          when p_salt_or_stored like 'shim$%' and length(p_salt_or_stored) > 5
            then 'crypt$' || substr(p_salt_or_stored, 6, 32) || '$' || md5(substr(p_salt_or_stored, 6, 32) || p_answer)
          when p_salt_or_stored like 'crypt$%'
            then 'crypt$' || split_part(p_salt_or_stored, '$', 2) || '$' || md5(split_part(p_salt_or_stored, '$', 2) || p_answer)
          else 'crypt$0$' || md5(p_answer) end $fn$;
  `);
}, 60000);

beforeEach(async () => {
  await svc(`truncate public.founder_transfer_cases cascade`);
  await svc(`truncate public.founder_seat_buybacks`);
  await svc(`truncate public.founder_seat_buyback_challenges`);
  await svc(`delete from public.founder_seat_transfers`);
  await svc(`delete from public.money_events`);
  await svc(`truncate public.current_account_session`);
  // FROM holds seat 1 (eligible, normal); all other seats unclaimed + normal.
  await svc(`update public.founder_seats set holder_user_id=null, security_status='normal', held_since=null, original_purchase_at=null, transfer_eligible_at=null, last_dormancy_nudge_at=null, abandonment_notice_started_at=null, abandonment_notice_count=0, display_name_optin=null, display_name_status='pending', gallery_author_slug=null where holder_user_id is not null or security_status <> 'normal'`);
  await svc(`update public.founder_seats set holder_user_id='${FROM}', security_status='normal', original_purchase_at=now()-interval '400 days', held_since=now()-interval '400 days', transfer_eligible_at=now()-interval '1 day', acquired_via='purchase', last_dormancy_nudge_at=null, abandonment_notice_started_at=null, abandonment_notice_count=0 where seat_id=1`);
  await svc(`update public.profiles set is_founder=true, tier='premium', updated_at=now() where id='${FROM}'`);
  await svc(`update public.system_config set value=jsonb_build_object('cents',2500) where key='seat_buyback_cents'`);
});

describe('the standing buyback (§6.8)', () => {
  it('releases the seat, appends a buyback lineage row, drops is_founder, and records the dial amount', async () => {
    const r = (await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r;
    expect(r.ok).toBe(true);
    expect(r.seat_id).toBe(1);
    expect(r.amount_cents).toBe(2500);           // the dial default, read at claim
    // Seat released to the pool (normal, resellable), holder cleared.
    const seat = await svc1(`select holder_user_id, security_status from public.founder_seats where seat_id=1`);
    expect(seat.holder_user_id).toBeNull();
    expect(seat.security_status).toBe('normal');
    // is_founder dropped (the tier logic is the edge leg).
    expect((await svc1(`select is_founder from public.profiles where id='${FROM}'`)).is_founder).toBe(false);
    // Lineage 'buyback' + a pending_payout buyback row at the dial amount.
    expect((await svc1(`select note from public.founder_seat_transfers where seat_id=1 order by transferred_at desc limit 1`)).note).toBe('buyback');
    const bb = await svc1(`select state, amount_cents, payout_form from public.founder_seat_buybacks where id='${r.buyback_id}'`);
    expect(bb).toMatchObject({ state: 'pending_payout', amount_cents: 2500, payout_form: 'connect_cash' });
  });

  it('reads the dial at claim time (never inlined) — a re-dial changes the recorded amount', async () => {
    await svc(`update public.system_config set value=jsonb_build_object('cents',3300) where key='seat_buyback_cents'`);
    const r = (await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'account_credits') as r`)).r;
    expect(r.amount_cents).toBe(3300);
    expect((await svc1(`select amount_cents from public.founder_seat_buybacks where id='${r.buyback_id}'`)).amount_cents).toBe(3300);
  });

  it('THE LADDER holds: the transfer share (price_cents/2 = 4950) is strictly greater than the buyback amount', async () => {
    const buyback = (await svc1(`select public._seat_buyback_cents() as c`)).c;
    const transferShare = 9900 / 2; // §6.5 even split; NOT routed through the dial
    expect(transferShare).toBeGreaterThan(buyback);
    expect(buyback).toBe(2500);
  });

  it('refuses during a live transfer case, and is claim-once + normal-status only', async () => {
    // Live case → refused.
    await svc(`select public.transfer_case_open(1::smallint, '${FROM}'::uuid, 'x@example.com', 'connect_cash')`);
    expect((await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r.reason).toBe('live_case');
    await svc(`truncate public.founder_transfer_cases cascade`);
    // A flagged seat is not buyable.
    await svc(`update public.founder_seats set security_status='flagged' where seat_id=1`);
    expect((await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r.reason).toBe('no_seat');
    await svc(`update public.founder_seats set security_status='normal' where seat_id=1`);
    // Claim once; a replay finds no seat.
    expect((await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r.ok).toBe(true);
    expect((await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r.reason).toBe('no_seat');
  });
});

describe('the buyback challenge (caseless 6.2 idiom) + payout claim', () => {
  it('issues a 6-digit code, verifies it once, rejects a wrong one, and locks after 5 attempts', async () => {
    const iss = (await svc1(`select public.issue_buyback_challenge('${FROM}'::uuid) as r`)).r;
    expect(iss.ok).toBe(true);
    expect(iss.code).toMatch(/^\d{6}$/);
    expect((await svc1(`select public.verify_buyback_challenge('${FROM}'::uuid, '000000') as r`)).r.reason).toBe('bad_code');
    expect((await svc1(`select public.verify_buyback_challenge('${FROM}'::uuid, '${iss.code}') as r`)).r.ok).toBe(true);
    expect((await svc1(`select public.verify_buyback_challenge('${FROM}'::uuid, '${iss.code}') as r`)).r.reason).toBe('no_live_code');
    // Fresh code, 5 wrong → locked.
    await svc(`select public.issue_buyback_challenge('${FROM}'::uuid)`);
    let last;
    for (let i = 0; i < 5; i += 1) last = (await svc1(`select public.verify_buyback_challenge('${FROM}'::uuid, '999999') as r`)).r;
    expect(last.reason).toBe('locked');
  });

  it('claim_due_buyback_payout atomically claims one pending buyback to releasing', async () => {
    const bb = (await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r;
    const claim = (await svc1(`select public.claim_due_buyback_payout() as r`)).r;
    expect(claim).toMatchObject({ ok: true, buyback_id: bb.buyback_id, from_user: FROM, payout_amount_cents: 2500, payout_form: 'connect_cash' });
    // The row is now 'releasing' and NOT re-claimed (the double-payout guard's claim half).
    expect((await svc1(`select state from public.founder_seat_buybacks where id='${bb.buyback_id}'`)).state).toBe('releasing');
    expect((await svc1(`select public.claim_due_buyback_payout() as r`)).r.reason).toBe('none_due');
  });
});

// ── FP-3 (fraud-fix, §6.8 family 10): THE BUYBACK PAYOUT DISPUTE-SAFETY HOLD ──
// The standing buyback may be INITIATED at any time (owner stewardship ruling), but its
// $25 payout must NOT release while the ORIGINAL $99 is still chargeback-eligible (~120
// days). Otherwise buy $99 → buyback $25 → chargeback $99 nets +$25 with no timing
// barrier (the transfer path is protected by LAW 8's 12-month hold; the buyback has no
// eligibility gate, so the PAYOUT carries the hold instead). The hold window is the
// buyback_payout_hold_days dial (default 120), read at claim time.
describe('FP-3 (§6.8 family 10) — the buyback payout parks until the original $99 dispute window closes', () => {
  it('a seat bought TODAY can be bought back today, but its payout HOLDS on the next sweep (not due)', async () => {
    // FROM bought seat 1 TODAY: the original $99 is fully chargeback-eligible.
    await svc(`update public.founder_seats set holder_user_id='${FROM}', security_status='normal', original_purchase_at=now(), held_since=now(), transfer_eligible_at=now()+interval '12 months', acquired_via='purchase' where seat_id=1`);
    // A TRANSFER of this fresh seat is correctly refused (LAW 8 hold) …
    const openTry = (await svc1(`select public.transfer_case_open(1::smallint, '${FROM}'::uuid, 'nom@example.com', 'connect_cash') as r`)).r;
    expect(openTry.ok).toBe(false);
    expect(openTry.reason).toBe('not_yet_eligible');
    // … but the BUYBACK INITIATION succeeds any time (the owner's stewardship ruling).
    const bb = (await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r;
    expect(bb.ok).toBe(true);
    expect(bb.amount_cents).toBe(2500);
    // The seat has ALREADY returned to the pool (the release is immediate) …
    expect((await svc1(`select holder_user_id from public.founder_seats where seat_id=1`)).holder_user_id).toBe(null);
    // … yet the $25 payout is HELD — the sweep finds nothing due while the $99 can be disputed.
    const claim = (await svc1(`select public.claim_due_buyback_payout() as r`)).r;
    expect(claim.ok).toBe(false);
    expect(claim.reason).toBe('none_due');
    // The buyback row is parked at pending_payout (not lost — it releases once the window elapses).
    expect((await svc1(`select state from public.founder_seat_buybacks where id='${bb.buyback_id}'`)).state).toBe('pending_payout');
  });

  it('an AGED seat (original purchase past the hold window) pays out normally', async () => {
    // beforeEach set seat 1 to original_purchase_at = now()-400d (well past 120d).
    const bb = (await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r;
    expect(bb.ok).toBe(true);
    const claim = (await svc1(`select public.claim_due_buyback_payout() as r`)).r;
    expect(claim.ok).toBe(true);
    expect(claim.buyback_id).toBe(bb.buyback_id);
  });

  it('the buyback_payout_hold_days dial tunes the window (owner-tunable, read at claim time)', async () => {
    await svc(`update public.founder_seats set holder_user_id='${FROM}', security_status='normal', original_purchase_at=now(), held_since=now() where seat_id=1`);
    // Default 120d → a fresh seat holds.
    const bbHeld = (await svc1(`select public.claim_founder_seat_buyback('${FROM}'::uuid, 'connect_cash') as r`)).r;
    expect(bbHeld.ok).toBe(true);
    expect((await svc1(`select public.claim_due_buyback_payout() as r`)).r.ok).toBe(false);
    // Dial the hold to 0 → the parked payout is now due on the next sweep.
    await svc(`update public.system_config set value = value || jsonb_build_object('payout_hold_days', 0) where key='founder_buyback'`);
    const claim = (await svc1(`select public.claim_due_buyback_payout() as r`)).r;
    expect(claim.ok).toBe(true);
    expect(claim.buyback_id).toBe(bbHeld.buyback_id);
    // Restore the dial (beforeEach does not reset the founder_buyback row).
    await svc(`update public.system_config set value = value || jsonb_build_object('payout_hold_days', 120) where key='founder_buyback'`);
  });
});

describe('the dormancy nudge sweep (§6.8)', () => {
  it('nudges a dormant holder once, respects the re-nudge window, and never nudges on absent data', async () => {
    // FROM signed in 20 months ago (dormant > 18mo).
    await svc(`insert into public.current_account_session(user_id, session_id, signed_in_at, updated_at) values ('${FROM}','${SID}', now()-interval '20 months', now()-interval '20 months')`);
    let rows = await svcAll(`select * from public.sweep_seat_dormancy_nudges()`);
    expect(rows.map((r) => r.user_id)).toContain(FROM);
    // Re-running immediately does NOT re-nudge (once per 12 months).
    rows = await svcAll(`select * from public.sweep_seat_dormancy_nudges()`);
    expect(rows.length).toBe(0);
    // A recently-active holder is never nudged.
    await svc(`update public.current_account_session set updated_at=now() where user_id='${FROM}'`);
    await svc(`update public.founder_seats set last_dormancy_nudge_at=null where seat_id=1`);
    rows = await svcAll(`select * from public.sweep_seat_dormancy_nudges()`);
    expect(rows.length).toBe(0);
  });
});

describe('the abandonment sweep (§6.8) — escheats exactly once, any sign-in aborts', () => {
  it('starts a notice, then escheats exactly once with the claimable credit at the dial', async () => {
    // FROM dormant 6 years (no session row → profiles.updated_at fallback).
    await svc(`update public.profiles set updated_at=now()-interval '6 years' where id='${FROM}'`);
    // Pass 1: START the notice.
    let rows = await svcAll(`select * from public.sweep_seat_abandonment()`);
    expect(rows.find((r) => r.action === 'notice' && r.user_id === FROM)).toBeTruthy();
    expect((await svc1(`select abandonment_notice_started_at from public.founder_seats where seat_id=1`)).abandonment_notice_started_at).not.toBeNull();
    // Age the notice past the 90-day window, then ESCHEAT.
    await svc(`update public.founder_seats set abandonment_notice_started_at = now()-interval '100 days' where seat_id=1`);
    rows = await svcAll(`select * from public.sweep_seat_abandonment()`);
    expect(rows.find((r) => r.action === 'escheated' && r.user_id === FROM)).toBeTruthy();
    const seat = await svc1(`select holder_user_id, security_status from public.founder_seats where seat_id=1`);
    expect(seat).toMatchObject({ holder_user_id: null, security_status: 'escheat' });
    expect((await svc1(`select is_founder from public.profiles where id='${FROM}'`)).is_founder).toBe(false);
    expect((await svc1(`select note from public.founder_seat_transfers where seat_id=1 order by transferred_at desc limit 1`)).note).toBe('abandonment');
    const me = await svc1(`select kind, amount_cents, metadata from public.money_events where user_id='${FROM}' and kind='refund_note'`);
    expect(me.amount_cents).toBe(2500);
    expect(me.metadata.claimable_cents).toBe(2500);
    // EXACTLY ONCE: re-running does not escheat again (the seat is no longer 'normal').
    rows = await svcAll(`select * from public.sweep_seat_abandonment()`);
    expect(rows.find((r) => r.action === 'escheated')).toBeFalsy();
  });

  it('ANY sign-in during the notice window aborts the escheat (clears the stamp)', async () => {
    await svc(`update public.profiles set updated_at=now()-interval '6 years' where id='${FROM}'`);
    await svc(`update public.founder_seats set abandonment_notice_started_at = now()-interval '100 days' where seat_id=1`);
    // The holder signs in NOW (after the notice started).
    await svc(`insert into public.current_account_session(user_id, session_id, signed_in_at, updated_at) values ('${FROM}','${SID}', now(), now())`);
    const rows = await svcAll(`select * from public.sweep_seat_abandonment()`);
    expect(rows.find((r) => r.action === 'cleared' && r.user_id === FROM)).toBeTruthy();
    expect(rows.find((r) => r.action === 'escheated')).toBeFalsy();
    const seat = await svc1(`select holder_user_id, security_status, abandonment_notice_started_at from public.founder_seats where seat_id=1`);
    expect(seat).toMatchObject({ holder_user_id: FROM, security_status: 'normal' });
    expect(seat.abandonment_notice_started_at).toBeNull();
  });

  it('an escheat seat is NEVER auto-resold by claim_next_founder_seat', async () => {
    // Escheat seat 1.
    await svc(`update public.founder_seats set holder_user_id=null, security_status='escheat' where seat_id=1`);
    // Ensure a lower-numbered normal seat does not exist above it; seat 2 is the next normal.
    const claim = (await svc1(`select public.claim_next_founder_seat('${OTHER}'::uuid) as r`)).r;
    expect(claim.assigned).toBe(true);
    expect(claim.seat_id).not.toBe(1);          // the escheat seat is skipped
    expect((await svc1(`select security_status from public.founder_seats where seat_id=1`)).security_status).toBe('escheat');
  });
});
