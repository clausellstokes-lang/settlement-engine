/**
 * profileModerationColumnLock.pglite.test.js — A+ closes the profiles self-UPDATE
 * MODERATION-column gap (adversarial finding on migration 059 → fixed by 061).
 *
 * 059 recreated the profiles self-UPDATE policy with the full 018 column lock
 * (role/tier/credits/is_founder/stripe_customer_id/email pinned) + account_is_active,
 * but it did NOT pin the three MODERATION columns (banned_at / disabled_at /
 * deleted_at, added by 053/054). So a still-ACTIVE account could self-UPDATE its own
 * moderation timestamps via the direct PostgREST path — a self-DoS AND moderation-
 * state pollution (account_is_active() reads exactly those three columns, so writing
 * them lets a user steer its own trust-boundary state). 061 recreates the policy with
 * the 059 body verbatim PLUS `… is not distinct from (select … where id=auth.uid())`
 * conjuncts on all three columns, so they are writable ONLY via the admin/processor
 * RLS-exempt paths.
 *
 * This test loads the REAL 061 policy body (verbatim from the migration) into pglite
 * with FORCE RLS as a non-superuser — the faithful direct-PostgREST path — and proves:
 *  (a) an active user CANNOT self-set banned_at / disabled_at / deleted_at,
 *  (b) an active user CAN still rename display_name (legitimate self-update preserved),
 *  (c) a no-op write that re-states the SAME moderation values still succeeds,
 *  (d) a SENTINEL (separate db) reproduces the gap under the 059 policy (no moderation
 *      conjuncts) — so the assertions are load-bearing, not vacuously green.
 *
 * Assertions are EFFECT-based (read-back): an RLS WITH CHECK violation throws, but we
 * also read the column back to prove the value did not change (defense in depth on the
 * assertion itself). Mirrors accountStatusProfilesCustomContent.pglite.test.js.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '057': resolve(dir, '057_enforce_account_status_writes.sql'),
  '059': resolve(dir, '059_enforce_account_status_rls.sql'),
  '061': resolve(dir, '061_lock_profile_moderation_columns.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract function ${name} from ${migKey}`);
  return m[0];
}
function extractPolicy(migKey, title) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = src.match(new RegExp(`create policy "${esc}"[\\s\\S]*?;\\s*\\n`, 'i'));
  if (!m) throw new Error(`could not extract policy "${title}" from ${migKey}`);
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const POLICY = 'Users update own profile (safe preferences only)';

/** Build a pglite db with the shared auth stubs, profiles table (incl. moderation
 *  columns), account_is_active (057) and a non-superuser FORCE-RLS role. */
async function baseDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated') $fn$;
    create table public.profiles (
      id uuid primary key, role text default 'user', tier text default 'free',
      credits integer not null default 0, is_founder boolean not null default false,
      display_name text, email text, stripe_customer_id text, updated_at timestamptz default now(),
      banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz
    );
    create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
  `);
  await db.exec(extractFn('057', 'account_is_active'));
  return db;
}

async function lockdown(db) {
  await db.exec(`
    alter table public.profiles enable row level security; alter table public.profiles force row level security;
    create role nosuperuser nologin;
    grant select, insert, update, delete on public.profiles to nosuperuser;
  `);
}

describe.runIf(allExist)('profiles moderation-column self-UPDATE lock — executed against 061 (pglite)', () => {
  let db;
  beforeAll(async () => {
    db = await baseDb();
    // Apply the historical 059 policy, THEN the 061 drop + recreate, in migration
    // order — faithfully reproducing what a live DB sees after 061. The extractor
    // captures only the `create policy …` body, so re-issue 061's own drop (which the
    // real migration runs) before its recreate.
    await db.exec(extractPolicy('059', POLICY));
    await db.exec(`drop policy if exists "${POLICY}" on public.profiles;`);
    await db.exec(extractPolicy('061', POLICY));
    await lockdown(db);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role; set test.role = 'service_role'; set test.uid = '';
      truncate public.profiles cascade;
      insert into public.profiles (id, role, tier, display_name, email)
        values ('${UID}', 'user', 'premium', 'Orig', 'orig@x.com');
    `);
  });

  const tryUser = async (sql) => {
    try { await db.exec(`set role nosuperuser; set test.role='authenticated'; set test.uid='${UID}'; ${sql}`); return 'ok'; }
    catch { return 'rejected'; }
  };
  const field = async (col) => { await db.exec('reset role;'); const r = await db.query(`select ${col} as v from public.profiles where id='${UID}'`); return r.rows[0]?.v; };

  it('exactly ONE profiles UPDATE policy survives 061 (the recreate did not duplicate)', async () => {
    await db.exec('reset role;');
    const r = await db.query(`select count(*)::int as n from pg_policies where schemaname='public' and tablename='profiles' and cmd='UPDATE'`);
    expect(r.rows[0].n).toBe(1);
  });

  it('an ACTIVE user CAN still rename display_name (legitimate self-update preserved)', async () => {
    expect(await tryUser(`update public.profiles set display_name='New' where id='${UID}';`)).toBe('ok');
    expect(await field('display_name')).toBe('New');
  });

  it('an ACTIVE user CANNOT self-set banned_at (moderation column pinned by 061)', async () => {
    expect(await tryUser(`update public.profiles set banned_at = now() where id='${UID}';`)).toBe('rejected');
    expect(await field('banned_at')).toBeNull();
  });

  it('an ACTIVE user CANNOT self-set disabled_at (self-DoS blocked)', async () => {
    expect(await tryUser(`update public.profiles set disabled_at = now() where id='${UID}';`)).toBe('rejected');
    expect(await field('disabled_at')).toBeNull();
  });

  it('an ACTIVE user CANNOT self-set deleted_at (moderation-state pollution blocked)', async () => {
    expect(await tryUser(`update public.profiles set deleted_at = now() where id='${UID}';`)).toBe('rejected');
    expect(await field('deleted_at')).toBeNull();
  });

  it('an ACTIVE user CANNOT smuggle a moderation write alongside a legit display_name change', async () => {
    // The whole statement is rejected (WITH CHECK is per-row), so the display_name does
    // NOT land either — the moderation write cannot ride in on a legit field change.
    expect(await tryUser(`update public.profiles set display_name='Sneaky', banned_at = now() where id='${UID}';`)).toBe('rejected');
    expect(await field('display_name')).toBe('Orig');
    expect(await field('banned_at')).toBeNull();
  });

  it('an admin/processor having ALREADY set banned_at, the user cannot CLEAR it (un-ban itself)', async () => {
    // Simulate an admin ban (service_role / RLS-exempt path).
    await db.exec(`reset role; update public.profiles set banned_at = now() where id='${UID}';`);
    // Two independent layers stop the self-un-ban, both observable as: banned_at stays
    // set. (1) account_is_active is now false → the USING clause filters the row out, so
    // the UPDATE silently affects 0 rows; (2) even were it active, the 061 WITH CHECK pin
    // would reject the change. The EFFECT (the only thing that matters) is asserted.
    await tryUser(`update public.profiles set banned_at = null where id='${UID}';`);
    expect(await field('banned_at')).not.toBeNull();
  });

  it('a no-op self-UPDATE that re-states the SAME (null) moderation values still succeeds', async () => {
    // The conjuncts use `is not distinct from`, so a NULL→NULL no-op passes — a legit
    // self-update is never collateral-damaged by the pin.
    expect(await tryUser(`update public.profiles set display_name='Fresh', banned_at = null, disabled_at = null, deleted_at = null where id='${UID}';`)).toBe('ok');
    expect(await field('display_name')).toBe('Fresh');
  });
});

// SENTINEL (isolated db): under the 059 policy (WITHOUT the 061 moderation conjuncts),
// the gap is REAL — a still-active user self-sets its own banned_at. This proves the
// main suite's "cannot self-set" assertions are load-bearing (they would fail if 061
// stopped pinning the moderation columns).
describe.runIf(allExist)('SENTINEL — the moderation-column gap reproduces under the 059 policy alone', () => {
  it('an active user CAN self-set banned_at under the un-pinned 059 policy', async () => {
    const db = await baseDb();
    // Apply ONLY the 059 policy (simulate 061 never landing).
    await db.exec(extractPolicy('059', POLICY));
    await lockdown(db);
    await db.exec(`reset role; insert into public.profiles (id, role, tier, display_name, email) values ('${UID}','user','premium','Orig','orig@x.com');`);
    await db.exec(`set role nosuperuser; set test.role='authenticated'; set test.uid='${UID}'; update public.profiles set banned_at = now() where id='${UID}';`);
    await db.exec('reset role;');
    const r = await db.query(`select banned_at as v from public.profiles where id='${UID}'`);
    expect(r.rows[0].v).not.toBeNull();   // the gap, reproduced — confirms 061 is necessary
  });
});
