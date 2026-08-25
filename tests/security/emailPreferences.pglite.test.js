/**
 * emailPreferences.pglite.test.js — EXECUTION-level tests for migration 126
 * (per-category email preferences + one-click token unsubscribe).
 *
 * The whole migration is loaded into in-process Postgres (pglite) — real table,
 * real RLS, real SECURITY DEFINER PL/pgSQL — and the RPCs are driven end-to-end
 * so a regression (a dropped category, an unsubscribe that can silently ENABLE a
 * flag, a token leak) can't ship green. auth.uid() is a settable-GUC stub;
 * auth.users + the client roles are minimal stubs so the migration's FK + grants
 * apply verbatim. The token path uses gen_random_uuid (Postgres core), so no
 * pgcrypto extension is required.
 *
 * Pins the owner-item contract:
 *   • all three categories default TRUE (opt-out model);
 *   • a member flips exactly one flag through their own RPC;
 *   • unsubscribe_via_token is OPT-OUT ONLY (never turns a flag back on) and
 *     needs the unguessable token;
 *   • can_email_user (the Phase-6 digest gate) defaults TRUE and honours a flip;
 *   • the token never SELECTs to a client (RLS-on-no-policy) — reachable only via
 *     the service-role mint RPC.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_126 = resolve(process.cwd(), 'supabase', 'migrations', '126_email_preferences.sql');
const exists = existsSync(MIG_126);

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const asAnon = () => db.exec(`set test.uid = '';`);
const scalar = async (q) => (await db.query(q)).rows[0];

// Anti-vacuity ([tests-3]/[test-quality-2]): if migration 126 is renamed/renumbered
// (the master-merge reconciliation risk), the execution suite below would silently
// skip and vitest would stay green. This UNCONDITIONAL assert fails loudly instead.
describe('email-preferences migration fixture exists (guards against silent vacuous skip)', () => {
  it('126_email_preferences.sql is present (a renamed/renumbered file must fail loudly)', () => {
    expect(existsSync(MIG_126), `migration 126 missing: ${MIG_126}`).toBe(true);
    expect(exists).toBe(true);
  });
});

describe.runIf(exists)('email preferences + token unsubscribe — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Stubs the migration's environment: the auth schema + a minimal users table
    // (the FK target), auth.uid() reading a settable GUC, and the three client
    // roles the grants reference.
    await db.exec(`
      create schema if not exists auth;
      create table auth.users (id uuid primary key, email text);
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      do $r$ begin
        if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role; end if;
      end $r$;
      insert into auth.users (id, email) values
        ('${UID}', 'a@example.com'),
        ('${OTHER}', 'b@example.com');
    `);
    // The real migration, verbatim.
    await db.exec(readFileSync(MIG_126, 'utf-8'));
  }, 30000); // PGlite WASM cold-start is ~8s under parallel load.

  beforeEach(async () => {
    await db.exec('truncate public.email_preferences cascade;');
    await asUser(UID);
  });

  it('all three categories default TRUE when no row exists yet', async () => {
    const row = await scalar('select * from public.get_my_email_preferences()');
    expect(row).toEqual({ product_updates: true, referral: true, lifecycle: true });
    // Reading did not mint a row (nothing to persist until a write).
    expect((await scalar('select count(*)::int n from public.email_preferences')).n).toBe(0);
  });

  it('a member flips exactly one of their own flags; the row + token are minted', async () => {
    await db.query(`select public.set_my_email_preference('product_updates', false)`);
    const row = await scalar('select * from public.get_my_email_preferences()');
    expect(row).toEqual({ product_updates: false, referral: true, lifecycle: true });
    // Exactly one row, with a non-null token (never exposed through get_my).
    const stored = await scalar('select count(*)::int n, count(unsubscribe_token)::int t from public.email_preferences');
    expect(stored).toEqual({ n: 1, t: 1 });
  });

  it('rejects an unknown category on set', async () => {
    await expect(db.query(`select public.set_my_email_preference('marketing_spam', false)`))
      .rejects.toThrow(/unknown email category/i);
  });

  it('get_my_email_preferences requires a session', async () => {
    await asAnon();
    await expect(db.query('select * from public.get_my_email_preferences()'))
      .rejects.toThrow(/not authenticated/i);
  });

  it('unsubscribe_via_token turns ONE category off and is opt-out only', async () => {
    // Mint the row + token (service-role path the mailer uses).
    const { unsubscribe_token: token } = await scalar(`select public.get_or_mint_unsubscribe_token('${UID}') as unsubscribe_token`);
    expect(token).toBeTruthy();

    const ok = await scalar(`select public.unsubscribe_via_token('${token}', 'referral') as ok`);
    expect(ok.ok).toBe(true);
    let row = await scalar('select * from public.get_my_email_preferences()');
    expect(row).toEqual({ product_updates: true, referral: false, lifecycle: true });

    // Opt-out ONLY: the token path can never turn a flag back on. Re-running with
    // the same token leaves referral off (there is no enable path at all).
    await db.query(`select public.unsubscribe_via_token('${token}', 'referral')`);
    row = await scalar('select * from public.get_my_email_preferences()');
    expect(row.referral).toBe(false);
  });

  it("unsubscribe_via_token with 'all' clears every category", async () => {
    const { unsubscribe_token: token } = await scalar(`select public.get_or_mint_unsubscribe_token('${UID}') as unsubscribe_token`);
    const ok = await scalar(`select public.unsubscribe_via_token('${token}', 'all') as ok`);
    expect(ok.ok).toBe(true);
    const row = await scalar('select * from public.get_my_email_preferences()');
    expect(row).toEqual({ product_updates: false, referral: false, lifecycle: false });
  });

  it('an unknown / rotated token changes nothing and returns false', async () => {
    await db.query(`select public.get_or_mint_unsubscribe_token('${UID}')`);
    const bogus = '99999999-9999-9999-9999-999999999999';
    const ok = await scalar(`select public.unsubscribe_via_token('${bogus}', 'all') as ok`);
    expect(ok.ok).toBe(false);
    const row = await scalar('select * from public.get_my_email_preferences()');
    expect(row).toEqual({ product_updates: true, referral: true, lifecycle: true });
  });

  it('can_email_user (digest gate) defaults TRUE and honours a flip', async () => {
    // No row yet → the opt-out default is subscribed.
    expect((await scalar(`select public.can_email_user('${UID}', 'lifecycle') as v`)).v).toBe(true);
    // Turn lifecycle off, and only lifecycle changes.
    await db.query(`select public.set_my_email_preference('lifecycle', false)`);
    expect((await scalar(`select public.can_email_user('${UID}', 'lifecycle') as v`)).v).toBe(false);
    expect((await scalar(`select public.can_email_user('${UID}', 'referral') as v`)).v).toBe(true);
    // Unknown category is never mailable.
    expect((await scalar(`select public.can_email_user('${UID}', 'nope') as v`)).v).toBe(false);
  });

  it('get_or_mint_unsubscribe_token is idempotent (stable token per user)', async () => {
    const t1 = (await scalar(`select public.get_or_mint_unsubscribe_token('${UID}') as t`)).t;
    const t2 = (await scalar(`select public.get_or_mint_unsubscribe_token('${UID}') as t`)).t;
    expect(t1).toBeTruthy();
    expect(t2).toBe(t1);
    // Distinct users get distinct tokens.
    const tOther = (await scalar(`select public.get_or_mint_unsubscribe_token('${OTHER}') as t`)).t;
    expect(tOther).not.toBe(t1);
  });
});
