/**
 * creditBalanceIdorGuard.pglite.test.js — EXECUTION-level tests for the migration
 * 110 authorization guard on public.get_credit_balance(target_user uuid).
 *
 * The IDOR: 018's get_credit_balance is SECURITY DEFINER, takes a caller-supplied
 * uuid, and summed THAT user's ledger with no auth.uid() check — so any
 * authenticated (or anon, via the default PUBLIC execute grant) caller could read
 * another user's balance / use it as a uuid-existence oracle. 110 recreates it (the
 * balance math verbatim) with a guard: a genuine end-user may read only their own
 * balance unless elevated; service_role / pg_cron / the definer money functions
 * reach it with a NULL auth.uid() and may read any target.
 *
 * Following the creditLedger.pglite harness: the REAL, net-current 110 body runs in
 * in-process Postgres. auth.uid() and current_user_is_privileged() are settable GUC
 * stubs (test.uid / test.privileged); a NULL auth.uid() models the service_role /
 * cron / internal-definer context. This test loads the guarded body from 110
 * specifically (the shared harness deliberately still loads 018 to exercise the
 * balance MATH, which 110 leaves byte-identical).
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '110': resolve(dir, '110_restrict_get_credit_balance_to_owner.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

// Hard-fail (not a silent vacuous skip) if the target migration is renamed/removed.
describe('110 pglite target exists (guards against silent vacuous skip)', () => {
  it('the migration file is present (a moved migration must fail loudly)', () => {
    expect(existsSync(MIG['110']), '110_restrict_get_credit_balance_to_owner.sql missing').toBe(true);
    expect(allExist).toBe(true);
  });
});

/** Extract a function definition verbatim: from `create or replace function
 *  public.<name>` to the first `$$;`. */
function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name} from migration ${migKey}`);
  return m[0];
}

const OWNER = '11111111-1111-1111-1111-111111111111';
const ATTACKER = '22222222-2222-2222-2222-222222222222';

let db;
// '' → auth.uid() resolves to NULL (the service_role / pg_cron / internal context).
const asUser = (uid) => db.exec(`set test.uid = '${uid ?? ''}';`);
const asPrivileged = (on) => db.exec(`set test.privileged = '${on ? 'true' : ''}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const balanceOf = (uid) => scalar(`select public.get_credit_balance('${uid}') as b`).then((r) => r.b);
const grant = (uid, amount) =>
  db.query(`insert into public.credit_ledger (user_id, kind, amount, source) values ($1,'grant',$2,'purchase')`, [uid, amount]);

describe.runIf(allExist)('110 get_credit_balance IDOR guard — execution (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      -- auth.uid(): NULL when test.uid is unset/empty (models service_role/cron).
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- current_user_is_privileged(): the elevated-staff escape hatch (018).
      create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false)
      $fn$;

      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        kind text not null check (kind in ('grant','spend')),
        amount integer not null check (amount > 0), source text not null,
        metadata jsonb not null default '{}'::jsonb,
        expires_at timestamptz, created_at timestamptz not null default now()
      );
      create table public.credit_spend_allocations (
        spend_id uuid not null references public.credit_ledger(id) on delete cascade,
        grant_id uuid not null references public.credit_ledger(id) on delete cascade,
        amount integer not null check (amount > 0),
        created_at timestamptz not null default now(),
        primary key (spend_id, grant_id)
      );
    `);
    // The REAL, net-current guarded body.
    await db.exec(extractFn('110', 'get_credit_balance'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.credit_spend_allocations, public.credit_ledger cascade;');
    await grant(OWNER, 25);
    await grant(ATTACKER, 4);
    await asPrivileged(false);
  });

  it('the owner reads their OWN balance', async () => {
    await asUser(OWNER);
    expect(await balanceOf(OWNER)).toBe(25);
  });

  it('REJECTS a non-owner authenticated caller reading another user\'s balance (the IDOR)', async () => {
    await asUser(ATTACKER);
    await expect(balanceOf(OWNER)).rejects.toThrow(/not authorized to read another user/i);
  });

  it('the attacker can still read their own balance (guard blocks only cross-user reads)', async () => {
    await asUser(ATTACKER);
    expect(await balanceOf(ATTACKER)).toBe(4);
  });

  it('a NULL auth.uid() (service_role / pg_cron / definer money functions) may read any target', async () => {
    await asUser(null); // no authenticated user → service/internal context
    expect(await balanceOf(OWNER)).toBe(25);
    expect(await balanceOf(ATTACKER)).toBe(4);
  });

  it('elevated staff (current_user_is_privileged) may read any balance for support', async () => {
    await asUser(ATTACKER);
    await asPrivileged(true);
    expect(await balanceOf(OWNER)).toBe(25);
  });
});

// The guard is only half the fix — the API-role lockdown (revoke anon/public,
// grant authenticated+service_role) is what closes the anon reach and keeps the
// two legitimate direct callers. Pin it textually so a future edit that drops the
// lockdown (or lets the search_path hardening regress) fails the gate.
describe.runIf(allExist)('110 locks the API surface + preserves 094 search_path hardening', () => {
  const src = readFileSync(MIG['110'], 'utf-8');
  it('revokes execute from public and anon', () => {
    expect(/revoke\s+all\s+on\s+function\s+public\.get_credit_balance\(uuid\)\s+from\s+public\s*,\s*anon/i.test(src)).toBe(true);
  });
  it('grants execute to authenticated and service_role (the two direct callers)', () => {
    expect(/grant\s+execute\s+on\s+function\s+public\.get_credit_balance\(uuid\)\s+to\s+authenticated\s*,\s*service_role/i.test(src)).toBe(true);
  });
  it('re-declares the pinned search_path (public, pg_temp) so CREATE OR REPLACE does not drop 094', () => {
    expect(/set\s+search_path\s*=\s*public\s*,\s*pg_temp/i.test(src)).toBe(true);
  });
});
