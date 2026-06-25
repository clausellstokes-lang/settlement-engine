/**
 * creditLedgerHarness.js — shared pglite harness for the credit/money RPCs.
 *
 * Loads the ACTUAL, NET-CURRENT PL/pgSQL function bodies (get_credit_balance +
 * allocations from 018, spend_credits + system_grant_credits from 024,
 * refund_credits from 087 (net-current), admin_grant_credits from 009) into an in-process Postgres
 * (pglite) over a minimal schema mirror. auth.uid()/auth.role()/privileged are
 * GUC stubs; _audit_action is a no-op.
 *
 * This is the extracted setup that creditLedger.pglite.test.js pioneered, so the
 * unit suite AND the composed money-path JOURNEY test (moneyPathJourney.pglite.
 * test.js) exercise the SAME real SQL without drift. Not a `*.test.js` file, so
 * vitest never collects it as a suite.
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
export const MIG = {
  '009': resolve(dir, '009_profile_security.sql'),
  '018': resolve(dir, '018_account_billing_models_credits.sql'),
  '024': resolve(dir, '024_billing_retention_and_atomic_mutations.sql'),
  '087': resolve(dir, '087_review_money_hardening.sql'),
};
export const allMigrationsExist = Object.values(MIG).every(existsSync);

/** Extract a function definition verbatim: `create or replace function
 *  public.<name>` to the first `$$;`. */
export function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration ${migKey}`);
  return m[0];
}

/**
 * Build a fresh pglite DB with the real credit RPCs loaded. Returns the db plus
 * a small set of bound helpers used by the suites.
 */
export async function makeCreditLedgerDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated')
    $fn$;
    create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
      select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false)
    $fn$;
    create or replace function public._audit_action(
      p_actor_id uuid, p_target_id uuid, p_action text, p_before jsonb, p_after jsonb, p_reason text
    ) returns void language plpgsql as $fn$ begin return; end $fn$;

    create table public.profiles (
      id uuid primary key, role text, tier text,
      credits integer not null default 0, is_founder boolean not null default false,
      display_name text, updated_at timestamptz default now()
    );
    create table public.credit_ledger (
      id uuid primary key default gen_random_uuid(), user_id uuid not null,
      kind text not null check (kind in ('grant','spend')),
      amount integer not null check (amount > 0), source text not null,
      metadata jsonb not null default '{}'::jsonb,
      expires_at timestamptz, reversed_by uuid, created_at timestamptz not null default now()
    );
    create table public.credit_transactions (
      id uuid primary key default gen_random_uuid(), user_id uuid not null,
      amount integer not null, reason text not null, created_at timestamptz not null default now()
    );
    create table public.credit_spend_allocations (
      spend_id uuid not null references public.credit_ledger(id) on delete cascade,
      grant_id uuid not null references public.credit_ledger(id) on delete cascade,
      amount integer not null check (amount > 0),
      created_at timestamptz not null default now(),
      primary key (spend_id, grant_id)
    );
    create table public.credit_grant_idempotency (
      source text not null,
      idempotency_key text not null,
      user_id uuid not null,
      ledger_id uuid references public.credit_ledger(id) on delete set null,
      created_at timestamptz not null default now(),
      primary key (source, idempotency_key)
    );
  `);
  await db.exec(extractFn('018', 'get_credit_balance'));
  await db.exec(extractFn('024', 'spend_credits'));
  // pglite can't resolve the <<grant_fn>> block label as a qualifier for a
  // function PARAMETER; re-qualify by the function name (behaviorally identical).
  await db.exec(extractFn('024', 'system_grant_credits').replace(/\bgrant_fn\.source\b/g, 'system_grant_credits.source'));
  // refund_credits net-current = 087 (085 added service-role awareness; 087 added
  // the FOR UPDATE serialization + the unique-index backstop). Loading it here is
  // what makes the journey + unit suites exercise the ACTUAL production function,
  // not the stale 009 body.
  await db.exec(extractFn('087', 'refund_credits'));
  await db.exec(`create unique index if not exists ux_credit_ledger_one_refund_per_spend
    on public.credit_ledger ((metadata->>'refund_of')) where source = 'refund';`);
  await db.exec(extractFn('009', 'admin_grant_credits'));
  return db;
}
