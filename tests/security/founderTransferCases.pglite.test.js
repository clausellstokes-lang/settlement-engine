/**
 * founderTransferCases.pglite.test.js — THE TRANSITION MATRIX (160, M-5b, §6.2).
 * Applies the REAL 137 + 160 migrations into pglite and drives the case machine
 * through every LEGAL transition once and refuses every ILLEGAL one, plus the
 * challenge lockout, the recovery-lockout read, and the party-facing projection.
 *
 * pgcrypto is shimmed (pglite lacks it) with the same deterministic
 * crypt(x,stored)=stored contract the securityAnswers probe uses, so the challenge
 * hash/verify logic is exercised for real.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_137 = resolve(dir, '137_founder_seats.sql');
const MIG_160 = resolve(dir, '160_founder_transfer_cases.sql');

const FROM = '11111111-1111-1111-1111-111111111111';
const NOM = '22222222-2222-2222-2222-222222222222';
const OTHER = '33333333-3333-3333-3333-333333333333';

let db;

async function svc(sql) {
  await db.query(`select set_config('test.role', 'service_role', false)`);
  await db.query(`select set_config('test.uid', '', false)`);
  return (await db.query(sql)).rows;
}
async function svc1(sql) { return (await svc(sql))[0]; }
async function asUser(uid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid}', false)`);
}

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
    create table if not exists auth.users (id uuid primary key, email text);
    create table if not exists public.profiles (id uuid primary key, is_founder boolean default false, tier text default 'free', updated_at timestamptz default now());
    create table if not exists public.system_config (key text primary key, value jsonb not null, updated_at timestamptz default now());
    insert into auth.users(id, email) values
      ('${FROM}','from@example.com'), ('${NOM}','nom@example.com'), ('${OTHER}','other@example.com')
      on conflict do nothing;
    insert into public.profiles(id, is_founder, tier) values
      ('${FROM}', true, 'premium'), ('${NOM}', false, 'free'), ('${OTHER}', false, 'free')
      on conflict do nothing;
  `);
  await db.exec(readFileSync(MIG_137, 'utf-8'));
  await db.exec(readFileSync(MIG_160, 'utf-8'));
  // pgcrypto shim (pglite lacks it) — preserves crypt(x, stored)=stored.
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
});

beforeEach(async () => {
  // Reset to: FROM holds seat 1, is eligible (12mo elapsed), un-flagged; nominee free.
  await svc(`truncate public.founder_transfer_cases cascade`);
  await svc(`delete from public.founder_seat_transfers`);
  await svc(`
    update public.founder_seats set
      holder_user_id='${FROM}', security_status='normal',
      original_purchase_at = now() - interval '400 days',
      held_since = now() - interval '400 days',
      transfer_eligible_at = now() - interval '1 day',
      cooldown_until = null, acquired_via='purchase',
      display_name_optin=null, display_name_status='pending', gallery_author_slug=null
    where seat_id = 1`);
  await svc(`update public.founder_seats set holder_user_id=null, security_status='normal', transfer_eligible_at=null where seat_id <> 1 and holder_user_id is not null`);
  await svc(`update public.profiles set is_founder=true, tier='premium' where id='${FROM}'`);
  await svc(`update public.profiles set is_founder=false, tier='free' where id in ('${NOM}','${OTHER}')`);
});

async function openLegal(payoutForm = 'connect_cash') {
  return svc1(`select public.transfer_case_open(1::smallint, '${FROM}'::uuid, 'nom@example.com', '${payoutForm}') as r`);
}

describe('the LEGAL transition path (each executed once)', () => {
  it('open → bind → awaiting → paid → finalize → reverse, end to end', async () => {
    const open = (await openLegal()).r;
    expect(open.ok).toBe(true);
    const caseId = open.case_id;

    const bind = (await svc1(`select public.transfer_case_bind_nominee('${caseId}'::uuid, '${NOM}'::uuid) as r`)).r;
    expect(bind).toMatchObject({ ok: true, seat_id: 1 });

    const await1 = (await svc1(`select public.transfer_case_mark_awaiting_payment('${caseId}'::uuid, 'cs_sess_1') as r`)).r;
    expect(await1.ok).toBe(true);

    const paid = (await svc1(`select public.transfer_case_mark_paid('${caseId}'::uuid, 'cs_sess_1', 9900) as r`)).r;
    expect(paid.ok).toBe(true);
    let row = await svc1(`select state, cooling_ends_at, price_cents, payout_amount_cents from public.founder_transfer_cases where id='${caseId}'`);
    expect(row.state).toBe('cooling');
    expect(row.price_cents).toBe(9900);
    expect(row.payout_amount_cents).toBe(4950);

    // Force cooling elapsed, then finalize.
    await svc(`update public.founder_transfer_cases set cooling_ends_at = now() - interval '1 minute' where id='${caseId}'`);
    const fin = (await svc1(`select public.transfer_case_finalize('${caseId}'::uuid) as r`)).r;
    expect(fin).toMatchObject({ ok: true, seat_id: 1, from_user: FROM, to_user: NOM, payout_amount_cents: 4950 });
    // Seat moved; flags flipped; payout scheduled; lineage appended.
    const seat = await svc1(`select holder_user_id, acquired_via, security_status from public.founder_seats where seat_id=1`);
    expect(seat).toMatchObject({ holder_user_id: NOM, acquired_via: 'transfer' });
    expect((await svc1(`select is_founder from public.profiles where id='${FROM}'`)).is_founder).toBe(false);
    expect((await svc1(`select is_founder, tier from public.profiles where id='${NOM}'`))).toMatchObject({ is_founder: true, tier: 'premium' });
    const caseRow = await svc1(`select state, payout_status, payout_due_at from public.founder_transfer_cases where id='${caseId}'`);
    expect(caseRow.state).toBe('finalized');
    expect(caseRow.payout_status).toBe('scheduled');
    expect(caseRow.payout_due_at).not.toBeNull();
    expect((await svc1(`select note from public.founder_seat_transfers where seat_id=1 order by transferred_at desc limit 1`)).note).toBe('transfer');

    // Reverse (payout not released): seat goes back, flags reversed, payout held.
    const rev = (await svc1(`select public.transfer_case_reverse('${caseId}'::uuid, 'chargeback') as r`)).r;
    expect(rev.ok).toBe(true);
    expect((await svc1(`select holder_user_id from public.founder_seats where seat_id=1`)).holder_user_id).toBe(FROM);
    expect((await svc1(`select is_founder from public.profiles where id='${FROM}'`)).is_founder).toBe(true);
    expect((await svc1(`select state, payout_status from public.founder_transfer_cases where id='${caseId}'`))).toMatchObject({ state: 'reversed', payout_status: 'held' });
  });

  it('abort is legal from initiated..cooling and reports was_paid for a cooling case', async () => {
    const open = (await openLegal()).r;
    const ab = (await svc1(`select public.transfer_case_abort('${open.case_id}'::uuid, 'outgoing', 'changed mind') as r`)).r;
    expect(ab).toMatchObject({ ok: true, was_paid: false });
    expect((await svc1(`select state, abort_actor from public.founder_transfer_cases where id='${open.case_id}'`))).toMatchObject({ state: 'aborted', abort_actor: 'outgoing' });

    // A paid (cooling) case aborts WITH was_paid true (the edge then refunds).
    const o2 = (await openLegal()).r;
    await svc(`select public.transfer_case_bind_nominee('${o2.case_id}'::uuid, '${NOM}'::uuid)`);
    await svc(`select public.transfer_case_mark_awaiting_payment('${o2.case_id}'::uuid, 'cs_2')`);
    await svc(`select public.transfer_case_mark_paid('${o2.case_id}'::uuid, 'cs_2', 9900)`);
    const ab2 = (await svc1(`select public.transfer_case_abort('${o2.case_id}'::uuid, 'chargeback', 'dispute') as r`)).r;
    expect(ab2).toMatchObject({ ok: true, was_paid: true, payment_session: 'cs_2' });
  });

  it('an expired unpaid session regresses awaiting_payment back to nominee_verified', async () => {
    const open = (await openLegal()).r;
    await svc(`select public.transfer_case_bind_nominee('${open.case_id}'::uuid, '${NOM}'::uuid)`);
    await svc(`select public.transfer_case_mark_awaiting_payment('${open.case_id}'::uuid, 'cs_exp')`);
    const reg = (await svc1(`select public.transfer_case_regress_awaiting_payment('cs_exp') as r`)).r;
    expect(reg.ok).toBe(true);
    expect((await svc1(`select state, stripe_session_id from public.founder_transfer_cases where id='${open.case_id}'`))).toMatchObject({ state: 'nominee_verified', stripe_session_id: null });
  });

  it('the due-runner expiry sweep expires stale open cases exactly once', async () => {
    const open = (await openLegal()).r;
    await svc(`update public.founder_transfer_cases set initiated_at = now() - interval '20 days' where id='${open.case_id}'`);
    const n = (await svc1(`select public.expire_stale_transfer_cases() as c`)).c;
    expect(n).toBe(1);
    expect((await svc1(`select state from public.founder_transfer_cases where id='${open.case_id}'`)).state).toBe('expired');
    // Re-running is a no-op (already expired).
    expect((await svc1(`select public.expire_stale_transfer_cases() as c`)).c).toBe(0);
  });
});

describe('ILLEGAL transitions are refused', () => {
  it('open refuses a not-yet-eligible seat, a non-founder, and a self-transfer', async () => {
    await svc(`update public.founder_seats set transfer_eligible_at = now() + interval '30 days' where seat_id=1`);
    expect((await openLegal()).r.reason).toBe('not_yet_eligible');
    await svc(`update public.founder_seats set transfer_eligible_at = now() - interval '1 day' where seat_id=1`);

    await svc(`update public.profiles set is_founder=false where id='${FROM}'`);
    expect((await openLegal()).r.reason).toBe('not_founder');
    await svc(`update public.profiles set is_founder=true where id='${FROM}'`);

    const selfT = (await svc1(`select public.transfer_case_open(1::smallint, '${FROM}'::uuid, 'from@example.com', 'connect_cash') as r`)).r;
    expect(selfT.reason).toBe('self_transfer');
  });

  it('open refuses a second live case for the same seat/holder', async () => {
    expect((await openLegal()).r.ok).toBe(true);
    expect((await openLegal()).r.reason).toBe('live_case_exists');
  });

  it('bind refuses email mismatch, a nominee who already holds a seat, and a wrong-state case', async () => {
    const open = (await openLegal()).r;
    expect((await svc1(`select public.transfer_case_bind_nominee('${open.case_id}'::uuid, '${OTHER}'::uuid) as r`)).r.reason).toBe('email_mismatch');
    // Give the nominee a seat, then bind refuses.
    await svc(`update public.founder_seats set holder_user_id='${NOM}' where seat_id=2`);
    expect((await svc1(`select public.transfer_case_bind_nominee('${open.case_id}'::uuid, '${NOM}'::uuid) as r`)).r.reason).toBe('nominee_already_holder');
    await svc(`update public.founder_seats set holder_user_id=null where seat_id=2`);
    // Bind then re-bind (wrong state).
    expect((await svc1(`select public.transfer_case_bind_nominee('${open.case_id}'::uuid, '${NOM}'::uuid) as r`)).r.ok).toBe(true);
    expect((await svc1(`select public.transfer_case_bind_nominee('${open.case_id}'::uuid, '${NOM}'::uuid) as r`)).r.reason).toBe('wrong_state');
  });

  it('mark_paid, finalize, abort, reverse all refuse from the wrong state', async () => {
    const open = (await openLegal()).r;
    const id = open.case_id;
    // mark_paid from initiated (not awaiting) → wrong_state.
    expect((await svc1(`select public.transfer_case_mark_paid('${id}'::uuid, 'x', 9900) as r`)).r.reason).toBe('wrong_state');
    // finalize from initiated → wrong_state.
    expect((await svc1(`select public.transfer_case_finalize('${id}'::uuid) as r`)).r.reason).toBe('wrong_state');
    // reverse from initiated → wrong_state.
    expect((await svc1(`select public.transfer_case_reverse('${id}'::uuid, 'x') as r`)).r.reason).toBe('wrong_state');
    // Drive to cooling; finalize before cooling elapses → cooling_not_elapsed.
    await svc(`select public.transfer_case_bind_nominee('${id}'::uuid, '${NOM}'::uuid)`);
    await svc(`select public.transfer_case_mark_awaiting_payment('${id}'::uuid, 'cs_x')`);
    await svc(`select public.transfer_case_mark_paid('${id}'::uuid, 'cs_x', 9900)`);
    expect((await svc1(`select public.transfer_case_finalize('${id}'::uuid) as r`)).r.reason).toBe('cooling_not_elapsed');
    // Finalize for real, then abort (illegal after finalize) and reverse-after-released.
    await svc(`update public.founder_transfer_cases set cooling_ends_at = now() - interval '1 minute' where id='${id}'`);
    expect((await svc1(`select public.transfer_case_finalize('${id}'::uuid) as r`)).r.ok).toBe(true);
    expect((await svc1(`select public.transfer_case_abort('${id}'::uuid, 'outgoing', 'too late') as r`)).r.reason).toBe('wrong_state');
    await svc(`update public.founder_transfer_cases set payout_status='released' where id='${id}'`);
    expect((await svc1(`select public.transfer_case_reverse('${id}'::uuid, 'x') as r`)).r.reason).toBe('payout_released');
  });

  it('every transition RPC is service-role only', async () => {
    await asUser(FROM);
    await expect(db.query(`select public.transfer_case_open(1::smallint, '${FROM}'::uuid, 'nom@example.com', 'connect_cash')`)).rejects.toThrow(/service-role only/);
    await expect(db.query(`select public.transfer_case_finalize('${FROM}'::uuid)`)).rejects.toThrow(/service-role only/);
  });
});

describe('challenge codes (066/067 idiom)', () => {
  it('issues a code, verifies the correct one once, and rejects a wrong one', async () => {
    const open = (await openLegal()).r;
    const iss = (await svc1(`select public.issue_transfer_challenge('${open.case_id}'::uuid, 'outgoing', 'initiate') as r`)).r;
    expect(iss.ok).toBe(true);
    expect(iss.code).toMatch(/^\d{6}$/);
    expect((await svc1(`select public.verify_transfer_challenge('${open.case_id}'::uuid, 'outgoing', 'initiate', '000000') as r`)).r.reason).toBe('bad_code');
    const ok = (await svc1(`select public.verify_transfer_challenge('${open.case_id}'::uuid, 'outgoing', 'initiate', '${iss.code}') as r`)).r;
    expect(ok.ok).toBe(true);
    // Consumed — a replay finds no live code.
    expect((await svc1(`select public.verify_transfer_challenge('${open.case_id}'::uuid, 'outgoing', 'initiate', '${iss.code}') as r`)).r.reason).toBe('no_live_code');
  });

  it('locks the party for an hour after 5 wrong attempts, and re-issue is refused while locked', async () => {
    const open = (await openLegal()).r;
    await svc(`select public.issue_transfer_challenge('${open.case_id}'::uuid, 'incoming', 'nominee_verify')`);
    let last;
    for (let i = 0; i < 5; i += 1) {
      last = (await svc1(`select public.verify_transfer_challenge('${open.case_id}'::uuid, 'incoming', 'nominee_verify', '999999') as r`)).r;
    }
    expect(last.reason).toBe('locked');
    // Re-issue during the lock window is refused.
    expect((await svc1(`select public.issue_transfer_challenge('${open.case_id}'::uuid, 'incoming', 'nominee_verify') as r`)).r.reason).toBe('locked');
  });

  it('an expired code cannot be verified', async () => {
    const open = (await openLegal()).r;
    const iss = (await svc1(`select public.issue_transfer_challenge('${open.case_id}'::uuid, 'outgoing', 'abort') as r`)).r;
    await svc(`update public.founder_transfer_challenges set expires_at = now() - interval '1 minute' where case_id='${open.case_id}'`);
    expect((await svc1(`select public.verify_transfer_challenge('${open.case_id}'::uuid, 'outgoing', 'abort', '${iss.code}') as r`)).r.reason).toBe('no_live_code');
  });
});

describe('recovery lockout read + party projection', () => {
  it('has_active_transfer_lock is true for a live-case party and false otherwise', async () => {
    const open = (await openLegal()).r;
    expect((await svc1(`select public.has_active_transfer_lock('${FROM}'::uuid) as l`)).l).toBe(true);
    expect((await svc1(`select public.email_has_active_transfer_lock('from@example.com') as l`)).l).toBe(true);
    expect((await svc1(`select public.has_active_transfer_lock('${OTHER}'::uuid) as l`)).l).toBe(false);
    // Abort → no longer live → lock clears.
    await svc(`select public.transfer_case_abort('${open.case_id}'::uuid, 'outgoing', 'x')`);
    expect((await svc1(`select public.has_active_transfer_lock('${FROM}'::uuid) as l`)).l).toBe(false);
  });

  it('my_transfer_case_status shows the counterparty email only to the outgoing party', async () => {
    const open = (await openLegal()).r;
    await svc(`select public.transfer_case_bind_nominee('${open.case_id}'::uuid, '${NOM}'::uuid)`);
    // Outgoing viewer sees the invited email; incoming viewer never sees from's email.
    await asUser(FROM);
    const outView = (await db.query(`select * from public.my_transfer_case_status()`)).rows[0];
    expect(outView).toMatchObject({ viewer_role: 'outgoing', counterparty_email: 'nom@example.com' });
    await asUser(NOM);
    const inView = (await db.query(`select * from public.my_transfer_case_status()`)).rows[0];
    expect(inView.viewer_role).toBe('incoming');
    expect(inView.counterparty_email).toBeNull();
  });
});
