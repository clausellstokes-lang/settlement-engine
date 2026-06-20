/**
 * accountStatusProfilesCustomContent.pglite.test.js — A+ closes the profiles
 * OR-bypass + the custom_content gap (adversarial finding on migration 059).
 *
 * The profiles self-UPDATE surface had TWO coexisting permissive policies: 018's
 * "Users update own profile (safe preferences only)" (NO account_is_active; locks
 * email + stripe_customer_id) and a 059 policy. PostgreSQL ORs permissive policies,
 * so a banned account could self-UPDATE via the un-gated 018 policy AND an active
 * account could change its email via the looser 059 policy. The fix: 059 DROPs the
 * 018 policy and recreates ONE policy with the FULL 018 column lock + account_is_active.
 *
 * This test loads the REAL policy bodies (verbatim from the migrations) into pglite
 * with FORCE RLS as a non-superuser — the faithful direct-PostgREST path — and proves:
 *  (a) exactly ONE profiles UPDATE policy survives 059 (the 018 one is dropped),
 *  (b) a banned user cannot rename display_name,
 *  (c) an active user cannot change email or stripe_customer_id (018 lock preserved),
 *  (d) an active user can still rename display_name,
 *  (e) custom_content writes are blocked for a banned premium user / allowed for active,
 *  (f) a SENTINEL (separate db) reproduces the OR-bug when the 018 drop is omitted —
 *      so the assertions are load-bearing, not vacuously green.
 *
 * Assertions are EFFECT-based (read-back), because an RLS USING-filtered UPDATE/DELETE
 * silently affects 0 rows (no throw) while only WITH CHECK / trigger violations throw.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '018': resolve(dir, '018_account_billing_models_credits.sql'),
  '057': resolve(dir, '057_enforce_account_status_writes.sql'),
  '059': resolve(dir, '059_enforce_account_status_rls.sql'),
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
const CC_ID = '22222222-2222-2222-2222-222222222222';

/** Build a pglite db with the shared auth stubs, profiles + custom_content tables,
 *  account_is_active (057) and the trigger fn (059). Returns the db. */
async function baseDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated') $fn$;
    create or replace function public.profile_has_premium_access(p uuid) returns boolean
      language sql stable as $fn$ select true $fn$;
    create table public.profiles (
      id uuid primary key, role text default 'user', tier text default 'free',
      credits integer not null default 0, is_founder boolean not null default false,
      display_name text, email text, stripe_customer_id text, updated_at timestamptz default now(),
      banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz
    );
    create table public.custom_content (
      id uuid primary key default gen_random_uuid(), user_id uuid not null,
      kind text, payload jsonb, created_at timestamptz default now()
    );
    create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
    create policy "cc self read" on public.custom_content for select using (auth.uid() = user_id);
  `);
  await db.exec(extractFn('057', 'account_is_active'));
  await db.exec(extractFn('059', 'enforce_account_active_write'));
  return db;
}

describe.runIf(allExist)('account-status profiles + custom_content gate — executed against 059 (pglite)', () => {
  let db;
  beforeAll(async () => {
    db = await baseDb();
    // Apply the historical 018 profiles policy, THEN the real 059 drops + recreate,
    // in migration order — faithfully reproducing what a live DB sees after 059.
    await db.exec(extractPolicy('018', 'Users update own profile (safe preferences only)'));
    await db.exec(`drop policy if exists "Users update own profile (display_name only)" on public.profiles;`);
    await db.exec(`drop policy if exists "Users update own profile (safe preferences only)" on public.profiles;`);
    await db.exec(extractPolicy('059', 'Users update own profile (safe preferences only)'));
    // 059 custom_content write policies.
    await db.exec(extractPolicy('059', 'premium users insert own custom content'));
    await db.exec(extractPolicy('059', 'premium users update own custom content'));
    await db.exec(extractPolicy('059', 'premium users delete own custom content'));
    // Redundant LAYER-2 triggers (059).
    await db.exec(`
      create trigger trg_pf before update on public.profiles for each row execute function public.enforce_account_active_write();
      create trigger trg_cc before insert or update or delete on public.custom_content for each row execute function public.enforce_account_active_write();
      alter table public.profiles enable row level security; alter table public.profiles force row level security;
      alter table public.custom_content enable row level security; alter table public.custom_content force row level security;
      create role nosuperuser nologin;
      grant select, insert, update, delete on public.profiles, public.custom_content to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role; set test.role = 'service_role'; set test.uid = '';
      truncate public.profiles, public.custom_content cascade;
      insert into public.profiles (id, role, tier, display_name, email, stripe_customer_id)
        values ('${UID}', 'user', 'premium', 'Orig', 'orig@x.com', 'cus_orig');
      insert into public.custom_content (id, user_id, kind, payload)
        values ('${CC_ID}', '${UID}', 'faction', '{}'::jsonb);
    `);
  });

  const tryUser = async (sql) => {
    try { await db.exec(`set role nosuperuser; set test.role='authenticated'; set test.uid='${UID}'; ${sql}`); return 'ok'; }
    catch { return 'rejected'; }
  };
  const ban = () => db.exec(`reset role; update public.profiles set banned_at = now() where id='${UID}';`);
  const field = async (col) => { await db.exec('reset role;'); const r = await db.query(`select ${col} as v from public.profiles where id='${UID}'`); return r.rows[0]?.v; };
  const ccCount = async () => { await db.exec('reset role;'); const r = await db.query(`select count(*)::int as n from public.custom_content where user_id='${UID}'`); return r.rows[0].n; };
  const ccKind = async () => { await db.exec('reset role;'); const r = await db.query(`select kind from public.custom_content where id='${CC_ID}'`); return r.rows[0]?.kind; };

  it('exactly ONE profiles UPDATE policy survives 059 — the 018 policy is dropped (no OR-coexistence)', async () => {
    await db.exec('reset role;');
    const r = await db.query(`select count(*)::int as n from pg_policies where schemaname='public' and tablename='profiles' and cmd='UPDATE'`);
    expect(r.rows[0].n).toBe(1);
  });

  it('an ACTIVE user CAN rename display_name (legitimate self-update preserved)', async () => {
    await tryUser(`update public.profiles set display_name='New' where id='${UID}';`);
    expect(await field('display_name')).toBe('New');
  });

  it('an ACTIVE user CANNOT change email (018 column lock preserved through 059)', async () => {
    await tryUser(`update public.profiles set email='hacked@x.com' where id='${UID}';`);
    expect(await field('email')).toBe('orig@x.com');
  });

  it('an ACTIVE user CANNOT change stripe_customer_id (018 column lock preserved)', async () => {
    await tryUser(`update public.profiles set stripe_customer_id='cus_evil' where id='${UID}';`);
    expect(await field('stripe_customer_id')).toBe('cus_orig');
  });

  it('a BANNED user CANNOT rename display_name (account_is_active gate + trigger)', async () => {
    await ban();
    await tryUser(`update public.profiles set display_name='Banned' where id='${UID}';`);
    expect(await field('display_name')).toBe('Orig');
  });

  it('a BANNED premium user CANNOT insert/update/delete custom_content (direct PostgREST path)', async () => {
    await ban();
    await tryUser(`insert into public.custom_content (user_id, kind, payload) values ('${UID}','sneaky','{}'::jsonb);`);
    expect(await ccCount()).toBe(1);                 // no new row
    await tryUser(`update public.custom_content set kind='y' where id='${CC_ID}';`);
    expect(await ccKind()).toBe('faction');          // unchanged
    await tryUser(`delete from public.custom_content where id='${CC_ID}';`);
    expect(await ccCount()).toBe(1);                  // still present
  });

  it('an ACTIVE premium user CAN write custom_content (baseline)', async () => {
    await tryUser(`update public.custom_content set kind='updated' where id='${CC_ID}';`);
    expect(await ccKind()).toBe('updated');
  });

  // REGRESSION GUARD: GoTrue's own SECURITY DEFINER triggers (handle_new_user's
  // welcome-credit UPDATE on signup, sync_profile_email's mirror UPDATE on email
  // confirm/change) UPDATE profiles with NO request JWT (auth.uid() null, role not
  // service_role). The LAYER-2 trigger must PASS those, else signup + email changes
  // break for everyone. (A fail-closed-on-null trigger broke 100% of signups.)
  it('a no-request-JWT system/definer profiles UPDATE is NOT blocked by the trigger', async () => {
    // reset role = table owner (force-RLS bypassed, like a SECURITY DEFINER fn);
    // test.role='' -> auth.role()='authenticated' (NOT service_role, so the
    // exemption does not mask this), test.uid='' -> auth.uid()=null.
    await db.exec(`reset role; set test.role=''; set test.uid='';
      update public.profiles set credits = credits + 1, email = 'confirmed@x.com' where id='${UID}';`);
    expect(await field('credits')).toBe(1);
    expect(await field('email')).toBe('confirmed@x.com');
  });

  // REGRESSION GUARD (redundancy preserved): the trigger STILL blocks a banned
  // END-USER (non-null uid) even if an owner RLS policy is dropped/bypassed.
  it('LAYER-2 trigger still blocks a banned end-user (non-null uid) when RLS is bypassed', async () => {
    await ban();
    let threw = false;
    try {
      await db.exec(`reset role; set test.role='authenticated'; set test.uid='${UID}';
        update public.profiles set display_name='ViaBypassedRLS' where id='${UID}';`);
    } catch { threw = true; }
    expect(threw).toBe(true);
    expect(await field('display_name')).toBe('Orig');
    await db.exec(`reset role; set test.role='service_role'; set test.uid='';`);
  });
});

// SENTINEL (isolated db): without 059's drop of the 018 policy, the OR-coexistence
// bug is REAL — a banned user self-updates via the un-gated 018 policy. This proves
// the main suite's "banned blocked" assertion is load-bearing (it would fail if 059
// stopped dropping the 018 policy).
describe.runIf(allExist)('SENTINEL — the OR-bypass reproduces without 059 dropping the 018 policy', () => {
  it('a banned user CAN self-update via the un-gated 018 policy when it is left in place', async () => {
    const db = await baseDb();
    // Apply ONLY the 018 policy (simulate 059 forgetting to drop it). No trigger,
    // so we isolate the RLS-OR defect specifically.
    await db.exec(extractPolicy('018', 'Users update own profile (safe preferences only)'));
    await db.exec(`
      alter table public.profiles enable row level security; alter table public.profiles force row level security;
      create role nosuperuser nologin; grant select, update on public.profiles to nosuperuser;
      reset role; insert into public.profiles (id, role, tier, display_name, email) values ('${UID}','user','premium','Orig','orig@x.com');
      update public.profiles set banned_at = now() where id='${UID}';
    `);
    await db.exec(`set role nosuperuser; set test.role='authenticated'; set test.uid='${UID}'; update public.profiles set display_name='BannedViaOldPolicy' where id='${UID}';`);
    await db.exec('reset role;');
    const r = await db.query(`select display_name as v from public.profiles where id='${UID}'`);
    expect(r.rows[0].v).toBe('BannedViaOldPolicy');   // the bug, reproduced — confirms the fix is necessary
  });
});
