/**
 * refundServiceRole.pglite.test.js — EXECUTION test of the SERVICE-ROLE-aware
 * refund_credits auth gate (migration 085) against in-process Postgres (pglite).
 *
 * The bug 085 fixes (CRITICAL, money): refund_credits is GRANTed to service_role
 * only (migration 033) but its net-current body (migration 009) opens with
 * `if auth.uid() is null then raise 'not authenticated'` and later raises on
 * `spend_row.user_id <> auth.uid()`. generate-narrative calls it via the
 * SERVICE-ROLE client (supabaseAdmin, auth.uid() = NULL), so EVERY AI-failure
 * refund threw — the user was charged (spend_credits ran on the user client and
 * succeeded) and never refunded.
 *
 * 085 makes the gate service-role-aware: when the caller IS service_role
 * (detected via request.jwt.claim.role / auth.role()), it SKIPS both the
 * `auth.uid() is null` raise and the ownership raise (the server already
 * verified the JWT in the edge fn and refunds by spend_id); when NOT
 * service_role it preserves the auth.uid() + ownership checks EXACTLY.
 *
 * This RUNS the real, verbatim-extracted RPC body from 085 against pglite and
 * proves:
 *   (a) under role=service_role with NO sub (auth.uid() NULL), refund_credits
 *       APPLIES — it writes the refund grant + bumps the counter. This FAILS
 *       against the 009 body ('not authenticated') and PASSES against 085;
 *   (b) a non-service AUTHENTICATED user refunding ANOTHER user's spend is still
 *       rejected ('not authorized to refund this spend') — the ownership gate is
 *       preserved for ordinary callers.
 *
 * auth.uid()/auth.role() are faked with session-GUC shims so the definer body's
 * gates run verbatim (pglite has no GoTrue). Mirrors worldPulseAtomicPersist.pglite.test.js.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Extract from 085 — the NET-CURRENT body of refund_credits (085 forked 009's
// body to make the auth gate service-role-aware; 033 only changed the GRANT).
// Testing the net-current def keeps this suite honest about what actually ships.
const MIG = resolve(process.cwd(), 'supabase/migrations/085_refund_credits_service_role.sql');
const exists = existsSync(MIG);

describe('085 pglite target exists (guards against silent vacuous skip)', () => {
  it('migration 085 (net-current refund_credits) is present on disk', () => {
    expect(exists, 'supabase/migrations/085_refund_credits_service_role.sql must exist').toBe(true);
  });
});

/** Extract the `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(name) {
  const src = readFileSync(MIG, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from 085`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const MALLORY = '22222222-2222-2222-2222-222222222222';

let db;
const scalar = async (q) => (await db.query(q)).rows[0];

/**
 * Run a statement as a given JWT identity. `set local` scopes the auth GUCs to
 * the surrounding transaction, so the call runs inside one tx — a raise inside
 * the definer body rolls the whole thing back, exactly as in Postgres.
 *
 *   sub  → auth.uid()   (NULL when not passed)
 *   role → auth.role()  ('authenticated' for a user, 'service_role' for the server)
 *
 * The service-role server reaches refund_credits with role='service_role' and NO
 * sub — exactly the supabaseAdmin client shape.
 */
async function asIdentity({ sub, role }, sql) {
  return db.transaction(async (tx) => {
    await tx.query(`set local request.jwt.claim.sub = '${sub ?? ''}'`);
    await tx.query(`set local request.jwt.claim.role = '${role ?? ''}'`);
    return tx.query(sql);
  });
}

const balanceOf = async (uid) =>
  (await scalar(`select credits from public.profiles where id = '${uid}'`)).credits;
const refundRows = async (spendId) =>
  (await scalar(`select count(*)::int as n from public.credit_ledger
                   where source = 'refund' and metadata->>'refund_of' = '${spendId}'`)).n;

describe.runIf(exists)('refund_credits service-role auth gate — execution against 085 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Minimal schema: auth.uid()/auth.role() shims reading the session GUCs, the
    // two ledger tables + profiles the RPC touches, and stubs for the two helpers
    // the body calls (current_user_is_privileged, _audit_action).
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      create or replace function auth.role() returns text language sql stable as $$
        select nullif(current_setting('request.jwt.claim.role', true), '')
      $$;

      create table public.profiles (
        id uuid primary key,
        email text,
        role text default 'user',
        credits integer not null default 0,
        updated_at timestamptz not null default now()
      );

      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        kind text not null,           -- 'spend' | 'grant'
        amount integer not null,
        source text,                  -- 'refund' for refund grants
        metadata jsonb,
        created_at timestamptz not null default now()
      );

      create table public.credit_transactions (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        amount integer not null,
        reason text,
        created_at timestamptz not null default now()
      );

      -- Privileged check mirrors 018: admin/developer by profiles.role for the
      -- current auth.uid(). Under service_role auth.uid() is NULL → false.
      create or replace function public.current_user_is_privileged() returns boolean
        language sql stable security definer set search_path = public as $$
        select exists (
          select 1 from public.profiles
          where id = auth.uid() and role in ('developer','admin')
        )
      $$;

      -- Audit stub: records into a table so we can assert it is NOT hit on the
      -- service-role path. Signature mirrors 009's _audit_action call.
      create table public.audit_log (
        actor uuid, target uuid, action text, before jsonb, after jsonb, reason text
      );
      create or replace function public._audit_action(
        p_actor uuid, p_target uuid, p_action text, p_before jsonb, p_after jsonb, p_reason text
      ) returns void language sql security definer set search_path = public as $$
        insert into public.audit_log values (p_actor, p_target, p_action, p_before, p_after, p_reason);
      $$;
    `);

    // The real, verbatim RPC body from 085.
    await db.exec(extractFn('refund_credits'));
  });

  beforeEach(async () => {
    await db.exec(`truncate public.profiles, public.credit_ledger, public.credit_transactions, public.audit_log;`);
    // Alice (the spender) starts with 0 credits AFTER a spend; the spend row is
    // what the edge fn captured. Mallory is an unrelated authenticated user.
    await db.query(
      `insert into public.profiles (id, email, role, credits) values
         ($1, 'alice@example.com',   'user', 0),
         ($2, 'mallory@example.com', 'user', 5)`,
      [ALICE, MALLORY],
    );
    await db.query(
      `insert into public.credit_ledger (id, user_id, kind, amount, source)
         values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', $1, 'spend', 1, 'ai_generate')`,
      [ALICE],
    );
  });

  const SPEND = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  // ── (a) service_role with NO sub refunds (the bug: 009 raised 'not authenticated') ──
  it('the SERVICE-ROLE client (no sub, role=service_role) APPLIES the refund', async () => {
    // This is exactly the supabaseAdmin shape generate-narrative uses on AI failure.
    const res = await asIdentity(
      { role: 'service_role' },
      `select public.refund_credits('${SPEND}'::uuid, 'generation failed') as bal`,
    );

    // Under the 009 body this would have thrown 'not authenticated' and rolled
    // back; under 085 it writes the refund grant and returns the new balance.
    expect(res.rows[0].bal).toBe(1);          // Alice's 0 → 1 refund landed
    expect(await balanceOf(ALICE)).toBe(1);   // legacy counter bumped
    expect(await refundRows(SPEND)).toBe(1);  // exactly one refund grant row
    // No audit on the service-role path (auth.uid() is NULL → guard falsy).
    expect((await scalar(`select count(*)::int as n from public.audit_log`)).n).toBe(0);
  });

  it('a second service-role refund of the same spend is rejected (idempotency preserved)', async () => {
    await asIdentity({ role: 'service_role' },
      `select public.refund_credits('${SPEND}'::uuid, 'generation failed')`);
    await expect(
      asIdentity({ role: 'service_role' },
        `select public.refund_credits('${SPEND}'::uuid, 'again')`),
    ).rejects.toThrow(/already refunded/);
    expect(await refundRows(SPEND)).toBe(1);   // still exactly one
    expect(await balanceOf(ALICE)).toBe(1);    // not double-credited
  });

  // ── (b) a non-service user refunding ANOTHER user's spend is rejected ───────
  it('a non-service AUTHENTICATED user refunding ANOTHER user\'s spend is rejected', async () => {
    // Mallory (authenticated, not the spend owner, not admin) tries to refund
    // Alice's spend. The ownership gate must still fire for non-service callers.
    await expect(
      asIdentity(
        { sub: MALLORY, role: 'authenticated' },
        `select public.refund_credits('${SPEND}'::uuid, 'steal')`,
      ),
    ).rejects.toThrow(/not authorized to refund this spend/);
    expect(await refundRows(SPEND)).toBe(0);   // no grant written
    expect(await balanceOf(ALICE)).toBe(0);    // Alice not credited
    expect(await balanceOf(MALLORY)).toBe(5);  // Mallory not credited
  });

  it('a non-service caller with NO sub (auth.uid() NULL) is still rejected as unauthenticated', async () => {
    // The non-service path preserves the original 'not authenticated' raise.
    await expect(
      asIdentity({ role: 'authenticated' },
        `select public.refund_credits('${SPEND}'::uuid, 'anon')`),
    ).rejects.toThrow(/not authenticated/);
    expect(await refundRows(SPEND)).toBe(0);
  });
});
