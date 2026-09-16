/**
 * Migration 197 execution contract — consent model v3, the person-adjacent split.
 *
 * WHAT THIS PINS. 197 is the first migration to UPDATE existing telemetry_consent
 * rows (124 deliberately refused to), so the only thing standing between it and a
 * mass overwrite of recorded choices is its provenance predicate. That predicate is
 * a CONJUNCTION and both halves are load-bearing:
 *
 *     (telemetry_consent ->> 'v') is null      -- never mirrored by a user save
 *   AND no consent_change_records row           -- no recorded consent event ever
 *
 * WHY NEITHER HALF SUFFICES ALONE — and this suite proves it with the real RPC
 * rather than asserting it in prose:
 *   • 194's trigger inserts a change record only per CHANGED key, while the `v`
 *     stamp lands wholesale with the row. So a user who opens Privacy & data and
 *     SAVES WITHOUT MOVING A TOGGLE gets `v` and ZERO change records. Arm C drives
 *     that through public.set_my_telemetry_consent itself, so the specimen is
 *     executed, not imagined. A change-records-only predicate flips that user and
 *     silently overturns a deliberate review.
 *   • The reverse gap is real too: the trigger defaults its version to 1 when `v`
 *     is absent, so a non-mirror write leaves change records on an unstamped row.
 *     Arm D is that row. A v-only predicate flips it.
 *
 * The four arms are therefore the four corners of the conjunction, and the mutant
 * that drops EITHER conjunct reds the corresponding arm (M4).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BOOT_TIMEOUT = 180_000;
const MIG_126 = resolve(process.cwd(), 'supabase/migrations/126_email_preferences.sql');
const MIG_194 = resolve(process.cwd(), 'supabase/migrations/194_operator_messages.sql');
const MIG_197 = resolve(process.cwd(), 'supabase/migrations/197_consent_person_adjacent_default.sql');
const have = existsSync(MIG_126) && existsSync(MIG_194) && existsSync(MIG_197);

/** A — pure column default: no `v`, no history. The only row 197 may touch. */
const PURE = '11111111-1111-4111-8111-111111111111';
/** B — a recorded change AND a stamp (the ordinary reviewer who moved a toggle). */
const CHANGER = '22222222-2222-4222-8222-222222222222';
/** C — THE SPECIMEN: a real no-op save. Stamped `v`, zero change records. */
const REVIEWER = '33333333-3333-4333-8333-333333333333';
/** D — the reverse gap: change records with NO stamp (a non-mirror write). */
const UNSTAMPED_HISTORY = '44444444-4444-4444-8444-444444444444';

/** 124's default: the pre-197 shape — research ON, no `v`, no `market`. */
const V2_DEFAULT = '{"essential": true, "research": true, "ai_prose": false}';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid ?? ''}';`);
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];

const consentOf = async (uid) =>
  (await one(`select telemetry_consent from public.profiles where id = $1`, [uid])).telemetry_consent;
const researchOf = async (uid) => (await consentOf(uid)).research;
const recordCount = async (uid) =>
  (await one(`select count(*)::int n from public.consent_change_records where user_id = $1`, [uid])).n;

/** State captured immediately BEFORE 197 runs, so the arms can prove motion. */
let before;

describe('migration fixtures exist', () => {
  it('has the preference base, migration 194, and migration 197', () => {
    expect(have).toBe(true);
  });
});

describe.runIf(have)('migration 197 — the person-adjacent consent flip, real SQL', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create schema if not exists extensions;
      create table auth.users (id uuid primary key, email text);
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      do $roles$ begin
        if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
        if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
        if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin; end if;
      end $roles$;
      grant usage on schema public, auth to anon, authenticated, service_role;

      create table public.profiles (
        id uuid primary key references auth.users(id) on delete cascade,
        role text not null default 'user',
        email text,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        telemetry_consent jsonb not null default '${V2_DEFAULT}'::jsonb,
        disabled_at timestamptz,
        banned_at timestamptz,
        deleted_at timestamptz
      );
      create table public.system_config (
        key text primary key, value jsonb not null, updated_at timestamptz not null default now()
      );
      create table public.warnings (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references auth.users(id),
        issued_by uuid references auth.users(id),
        severity text not null, reason text not null,
        user_notified boolean not null default false,
        created_at timestamptz not null default now()
      );
      create table public.audit_log (
        id uuid primary key default gen_random_uuid(), action text not null,
        actor_id uuid, target_user_id uuid, target_type text, target_id text,
        after_state jsonb, created_at timestamptz not null default now()
      );
      create table public.support_messages (
        id uuid primary key default gen_random_uuid(),
        user_id uuid references auth.users(id), email text not null,
        subject text not null, message text not null, status text not null default 'new',
        ticket_number text default 'SF-TEST', category text not null default 'general',
        priority text not null default 'normal', settlement_id uuid, campaign_id uuid,
        map_id uuid, payment_ref text, pdf_ref text, generation_ref text,
        gallery_ref text, metadata jsonb not null default '{}'::jsonb
      );
      create or replace function public.has_role(p_uid uuid, p_roles text[])
      returns boolean language sql stable security definer set search_path=public,pg_temp as $fn$
        select exists(select 1 from public.profiles where id=p_uid and role=any(p_roles))
      $fn$;
      create or replace function public.account_is_active(p_uid uuid)
      returns boolean language sql stable security definer set search_path=public,pg_temp as $fn$
        select exists(select 1 from public.profiles where id=p_uid and disabled_at is null and banned_at is null and deleted_at is null)
      $fn$;
      create or replace function public.write_audit(
        p_action text, p_target_user_id uuid default null, p_target_type text default null,
        p_target_id text default null, p_reason text default null, p_before jsonb default null,
        p_after jsonb default null, p_was_destructive boolean default false,
        p_was_reversible boolean default true, p_user_notified boolean default false,
        p_actor_id uuid default null
      ) returns uuid language plpgsql security definer set search_path=public,pg_temp as $fn$
      declare v_id uuid;
      begin
        insert into public.audit_log(action,actor_id,target_user_id,target_type,target_id,after_state)
        values(p_action,p_actor_id,p_target_user_id,p_target_type,p_target_id,p_after)
        returning id into v_id;
        return v_id;
      end $fn$;
      create or replace function public.issue_warning(
        p_actor uuid,p_target uuid,p_severity text,p_reason text,p_notified boolean default false
      ) returns uuid language sql security definer as $fn$ select gen_random_uuid() $fn$;
      create or replace function public.set_account_banned(
        p_actor uuid,p_target uuid,p_banned boolean,p_reason text default null
      ) returns jsonb language sql security definer as $fn$ select jsonb_build_object('banned',p_banned) $fn$;

      insert into auth.users(id,email) values
        ('${PURE}','pure@example.com'), ('${CHANGER}','changer@example.com'),
        ('${REVIEWER}','reviewer@example.com'), ('${UNSTAMPED_HISTORY}','unstamped@example.com');
      insert into public.profiles(id,role,email) values
        ('${PURE}','user','pure@example.com'), ('${CHANGER}','user','changer@example.com'),
        ('${REVIEWER}','user','reviewer@example.com'), ('${UNSTAMPED_HISTORY}','user','unstamped@example.com');
    `);
    // The real consent machinery: the RPC, the `v` stamp, and the per-key trigger.
    await db.exec(readFileSync(MIG_126, 'utf8'));
    await db.exec(readFileSync(MIG_194, 'utf8'));

    // ── Seed each corner of the conjunction, using the REAL write paths ──────
    // B — an ordinary reviewer who actually moved a toggle: stamp AND a record.
    await asUser(CHANGER);
    await db.query(`select public.set_my_telemetry_consent(
      '${CHANGER}'::uuid,
      '{"essential": true, "research": true, "ai_prose": false, "market": true, "v": 2}'::jsonb,
      'account'
    )`);

    // C — THE SPECIMEN. A save that changes nothing: every key already holds the
    // value being written (market is absent on the old row and coalesces to false).
    // The stamp lands; the trigger writes NOTHING, because no key changed.
    await asUser(REVIEWER);
    await db.query(`select public.set_my_telemetry_consent(
      '${REVIEWER}'::uuid,
      '{"essential": true, "research": true, "ai_prose": false, "market": false, "v": 2}'::jsonb,
      'account'
    )`);

    // D — the reverse gap: a non-mirror write. Flip research off then on with a raw
    // UPDATE carrying no `v`, so the trigger records the change (source defaults to
    // 'system', version defaults to 1) on a row that is still unstamped.
    await db.exec(`
      update public.profiles
         set telemetry_consent = '{"essential": true, "research": false, "ai_prose": false}'::jsonb
       where id = '${UNSTAMPED_HISTORY}';
      update public.profiles
         set telemetry_consent = '${V2_DEFAULT}'::jsonb
       where id = '${UNSTAMPED_HISTORY}';
    `);

    before = {
      pure: { research: await researchOf(PURE), v: (await consentOf(PURE)).v, records: await recordCount(PURE) },
      changer: { research: await researchOf(CHANGER), v: (await consentOf(CHANGER)).v, records: await recordCount(CHANGER) },
      reviewer: { research: await researchOf(REVIEWER), v: (await consentOf(REVIEWER)).v, records: await recordCount(REVIEWER) },
      unstamped: { research: await researchOf(UNSTAMPED_HISTORY), v: (await consentOf(UNSTAMPED_HISTORY)).v, records: await recordCount(UNSTAMPED_HISTORY) },
    };

    await db.exec(readFileSync(MIG_197, 'utf8'));
  }, BOOT_TIMEOUT);

  // ── GUARD THE GUARD ───────────────────────────────────────────────────────
  // Every arm below is "research is still true" for three of four rows. If the
  // seed had left research false anywhere, those arms would pass for the wrong
  // reason. So first prove all four entered the migration identically ON.
  it('CONTROL: all four rows entered the migration with research ON, so the arms can only pass on merit', () => {
    expect(before.pure.research).toBe(true);
    expect(before.changer.research).toBe(true);
    expect(before.reviewer.research).toBe(true);
    expect(before.unstamped.research).toBe(true);
  });

  it('CONTROL: the specimen is real — a no-op save stamps `v` and writes ZERO change records', () => {
    // This is the whole reason the predicate is a conjunction. If this ever fails,
    // 194's trigger has changed shape and 197's predicate must be re-derived.
    expect(before.reviewer.v).toBe(2);
    expect(before.reviewer.records).toBe(0);
    // …and the contrast case, to prove the trigger was live and simply had nothing
    // to record: an ordinary toggle move on the same RPC DOES leave a record.
    expect(before.changer.v).toBe(2);
    expect(before.changer.records).toBeGreaterThan(0);
  });

  it('CONTROL: the reverse gap is real — a non-mirror write leaves records on an UNSTAMPED row', () => {
    expect(before.unstamped.v).toBeUndefined();
    expect(before.unstamped.records).toBeGreaterThan(0);
  });

  // ── A4, the four corners ──────────────────────────────────────────────────
  it('ARM A — neither signal: a pure column default is flipped OFF', async () => {
    expect(before.pure.v).toBeUndefined();
    expect(before.pure.records).toBe(0);
    expect(await researchOf(PURE)).toBe(false);
  });

  it('ARM B — stamp AND history: an ordinary reviewer is untouched', async () => {
    expect(await researchOf(CHANGER)).toBe(true);
  });

  it('ARM C — stamp, NO history: the no-op-save reviewer is untouched (the F1 specimen)', async () => {
    // A change-records-only predicate flips this row. That is the defect the
    // conjunction exists to close, and this arm is its executed refutation.
    expect(await researchOf(REVIEWER)).toBe(true);
  });

  it('ARM D — history, NO stamp: the non-mirror-written row is untouched', async () => {
    // A `v`-only predicate flips this row. Both conjuncts, both directions.
    expect(await researchOf(UNSTAMPED_HISTORY)).toBe(true);
  });

  // ── The rest of the migration's contract ──────────────────────────────────
  it('leaves an honest audit trail: the flip itself is recorded as a system change', async () => {
    const rec = await one(
      `select consent_key, prior_value, new_value, source
         from public.consent_change_records
        where user_id = $1 order by created_at desc, id desc limit 1`,
      [PURE],
    );
    expect(rec).toMatchObject({
      consent_key: 'research', prior_value: true, new_value: false, source: 'system',
    });
  });

  it('touches only `research` — the other planes on the flipped row are byte-identical', async () => {
    const after = await consentOf(PURE);
    expect(after.essential).toBe(true);
    expect(after.ai_prose).toBe(false);
  });

  it('mints fresh profiles with research OFF (the column default, part 1)', async () => {
    const FRESH = '55555555-5555-4555-8555-555555555555';
    await db.query(`insert into auth.users(id,email) values ($1,'fresh@example.com')`, [FRESH]);
    await db.query(`insert into public.profiles(id,role,email) values ($1,'user','fresh@example.com')`, [FRESH]);
    const minted = await consentOf(FRESH);
    expect(minted.research).toBe(false);
    expect(minted.essential).toBe(true);
  });

  it('is re-runnable: a second application changes nothing', async () => {
    const snapshot = async () => (await one(
      `select jsonb_agg(jsonb_build_object('id', id, 'c', telemetry_consent) order by id) as all
         from public.profiles`,
    )).all;
    const priorRecords = (await one(`select count(*)::int n from public.consent_change_records`)).n;
    const priorState = await snapshot();
    await db.exec(readFileSync(MIG_197, 'utf8'));
    expect(await snapshot()).toEqual(priorState);
    expect((await one(`select count(*)::int n from public.consent_change_records`)).n).toBe(priorRecords);
  });
});
