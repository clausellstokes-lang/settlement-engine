/**
 * fraudCharterSession.pglite.test.js — THE §10.7 FRAUD-CHARTER SESSION PROBES (M-9f).
 *
 * Executed attacks (not prose review) over the ASSEMBLED single-session + case machine,
 * applying the REAL 137 + 160 + 161 migrations into pglite:
 *
 *   1. RAPID ALTERNATING CLAIMS from two devices — one active session at a time; each
 *      gated call (the assert/is belt) honors ONLY the CURRENT claim. The tug-of-war
 *      never yields a simultaneous acceptance window beyond the one in-flight claim.
 *   2. REPLAYED OLD-SESSION JWT rejected at the DB belt (assert_current_session raises;
 *      is_current_session is false) — the shared chokepoint every gated surface runs.
 *   3. EVICTION MID-TRANSFER: the case machine (160) is ORTHOGONAL to the session layer
 *      (161). Driven through supersession at EVERY transfer step, a case is never wedged:
 *      it stays in its state (resumable by the winner via the service-role RPCs) and
 *      stays abortable (the email-token abort's DB effect works from every live state).
 *
 * pgcrypto is shimmed (pglite lacks it) with the deterministic crypt(x,stored)=stored
 * contract the case-machine probe uses.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_137 = resolve(dir, '137_founder_seats.sql');
const MIG_160 = resolve(dir, '160_founder_transfer_cases.sql');
const MIG_161 = resolve(dir, '161_single_session.sql');

const FROM = '11111111-1111-1111-1111-111111111111';
const NOM = '22222222-2222-2222-2222-222222222222';
const S1 = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const S2 = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

let db;

/** Service-role context (the case-machine transition RPCs are service-role only). */
async function svc(sql) {
  await db.query(`select set_config('test.role', 'service_role', false)`);
  await db.query(`select set_config('test.uid', '', false)`);
  await db.query(`select set_config('test.jwt', '', false)`);
  return (await db.query(sql)).rows;
}
async function svc1(sql) { return (await svc(sql))[0]; }
/** Authenticated session context (the 161 claim/is/assert belt reads uid + jwt.session_id). */
async function sessionCtx(uid, sid) {
  await db.query(`select set_config('test.role', 'authenticated', false)`);
  await db.query(`select set_config('test.uid', '${uid ?? ''}', false)`);
  await db.query(`select set_config('test.jwt', '${sid ? `{"session_id":"${sid}"}` : ''}', false)`);
}
async function sess1(sql) { return (await db.query(sql)).rows[0]; }

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
    insert into auth.users(id, email) values ('${FROM}','from@example.com'), ('${NOM}','nom@example.com') on conflict do nothing;
    insert into public.profiles(id, is_founder, tier) values ('${FROM}', true, 'premium'), ('${NOM}', false, 'free') on conflict do nothing;
  `);
  await db.exec(readFileSync(MIG_137, 'utf-8'));
  await db.exec(readFileSync(MIG_160, 'utf-8'));
  await db.exec(readFileSync(MIG_161, 'utf-8'));
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
}, 60000);

beforeEach(async () => {
  await svc(`truncate public.current_account_session`);
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
  await svc(`update public.profiles set is_founder=false, tier='free' where id='${NOM}'`);
});

describe('§10.7 (1) rapid alternating claims — one active session, no simultaneous acceptance', () => {
  it('each gated call honors ONLY the current claim as two devices tug-of-war', async () => {
    // Device 1 claims → it is current; device 2 is not yet in play.
    await sessionCtx(FROM, S1);
    expect((await sess1(`select public.claim_current_session('Chrome / macOS') as r`)).r).toBe(true);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(true);

    // Device 2 signs in → supersedes. Now ONLY S2 is current; S1's belt rejects.
    await sessionCtx(FROM, S2);
    await sess1(`select public.claim_current_session('Safari / iOS')`);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(true);
    await sessionCtx(FROM, S1);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(false);
    await expect(db.query(`select public.assert_current_session()`)).rejects.toThrow(/session_superseded/);

    // Device 1 signs in again → wins back. ONLY S1 is current; S2 now rejects.
    await sessionCtx(FROM, S1);
    await sess1(`select public.claim_current_session('Chrome / macOS')`);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(true);
    await sessionCtx(FROM, S2);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(false);
    await expect(db.query(`select public.assert_current_session()`)).rejects.toThrow(/session_superseded/);

    // Exactly one row exists at all times — no simultaneous acceptance window.
    expect((await svc1(`select count(*)::int as c from public.current_account_session where user_id='${FROM}'`)).c).toBe(1);
  });
});

describe('§10.7 (2) a replayed old-session JWT is rejected at the belt', () => {
  it('after a newer claim, the OLD session id raises at assert_current_session (the money guard)', async () => {
    await sessionCtx(FROM, S1);
    await sess1(`select public.claim_current_session(null)`);           // S1 current
    await sessionCtx(FROM, S2);
    await sess1(`select public.claim_current_session(null)`);           // S2 supersedes
    // Replay the OLD S1 JWT — the belt every gated surface runs rejects it.
    await sessionCtx(FROM, S1);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(false);
    await expect(db.query(`select public.assert_current_session()`)).rejects.toThrow(/session_superseded/);
    // The winning S2 is unaffected.
    await sessionCtx(FROM, S2);
    expect((await sess1(`select public.is_current_session() as r`)).r).toBe(true);
  });
});

describe('§10.7 (3) eviction mid-transfer — the case machine is session-orthogonal, no wedge', () => {
  // Drive the case to each live state, supersede the outgoing holder, and prove the case
  // is (a) UNCHANGED by supersession (session layer ≠ case layer) and (b) still ABORTABLE
  // from that state — the email-token abort's DB effect, session-independent by construction.
  const advanceTo = async (targetState) => {
    const caseId = (await svc1(`select public.transfer_case_open(1::smallint, '${FROM}'::uuid, 'nom@example.com', 'connect_cash') as r`)).r.case_id;
    if (targetState === 'initiated') return caseId;
    await svc(`select public.transfer_case_bind_nominee('${caseId}'::uuid, '${NOM}'::uuid)`);
    if (targetState === 'nominee_verified') return caseId;
    await svc(`select public.transfer_case_mark_awaiting_payment('${caseId}'::uuid, 'cs_${targetState}')`);
    if (targetState === 'awaiting_payment') return caseId;
    await svc(`select public.transfer_case_mark_paid('${caseId}'::uuid, 'cs_${targetState}', 9900)`);
    return caseId; // 'cooling'
  };

  it.each(['initiated', 'nominee_verified', 'awaiting_payment', 'cooling'])(
    'a case in %s survives supersession and stays abortable by the escape hatch',
    async (state) => {
      const caseId = await advanceTo(state);
      // The outgoing holder was mid-transfer on device S1; a NEW device S2 signs in.
      await sessionCtx(FROM, S1);
      await sess1(`select public.claim_current_session(null)`);
      await sessionCtx(FROM, S2);
      await sess1(`select public.claim_current_session(null)`); // supersede S1

      // (a) The case is UNTOUCHED — the session layer never wrote to the case machine.
      expect((await svc1(`select state from public.founder_transfer_cases where id='${caseId}'`)).state).toBe(state);
      // (b) It stays ABORTABLE from this live state (the session-independent escape hatch).
      const ab = (await svc1(`select public.transfer_case_abort('${caseId}'::uuid, 'outgoing', 'evicted_escape') as r`)).r;
      expect(ab.ok).toBe(true);
      expect((await svc1(`select state from public.founder_transfer_cases where id='${caseId}'`)).state).toBe('aborted');
      // A paid (cooling) case reports was_paid so the edge refunds — no wedged money state.
      if (state === 'cooling') expect(ab.was_paid).toBe(true);
    },
  );

  it('resumable by the WINNER: after supersession the case still advances awaiting → cooling → finalize', async () => {
    const caseId = await advanceTo('awaiting_payment');
    // Supersede the outgoing holder mid-payment.
    await sessionCtx(FROM, S1); await sess1(`select public.claim_current_session(null)`);
    await sessionCtx(FROM, S2); await sess1(`select public.claim_current_session(null)`);

    // The winner resumes: the service-role RPCs drive the case forward regardless of session.
    expect((await svc1(`select public.transfer_case_mark_paid('${caseId}'::uuid, 'cs_awaiting_payment', 9900) as r`)).r.ok).toBe(true);
    expect((await svc1(`select state from public.founder_transfer_cases where id='${caseId}'`)).state).toBe('cooling');
    await svc(`update public.founder_transfer_cases set cooling_ends_at = now() - interval '1 minute' where id='${caseId}'`);
    expect((await svc1(`select public.transfer_case_finalize('${caseId}'::uuid) as r`)).r.ok).toBe(true);
    expect((await svc1(`select state, payout_status from public.founder_transfer_cases where id='${caseId}'`))).toMatchObject({ state: 'finalized', payout_status: 'scheduled' });
  });
});
