/**
 * accountStatusDirectWrites.pglite.test.js — EXECUTION test of the account
 * ban/disable/soft-delete enforcement on the REAL DIRECT-TABLE write path
 * (review B16 finding #1, migration 059).
 *
 * WHY THIS EXISTS (and why accountStatusGate.pglite.test.js is NOT enough)
 *   accountStatusGate.pglite.test.js proves the two SECURITY DEFINER RPCs
 *   (spend_credits, mutate_settlement_batch) reject a flagged account. But the
 *   client also writes via the PLAIN PostgREST table path — `.from('settlements')
 *   .insert/.update/.delete`, `.from('saved_maps')…`, and the gallery write paths —
 *   which are governed by RLS POLICIES + TRIGGERS, not those RPCs. A banned user
 *   with a still-valid JWT could forge exactly those direct requests. 057 never
 *   touched them; 059 does. This test RUNS the real 059 DDL and asserts the direct
 *   path is closed — a test that would PASS if 059 were reverted is theatre, so the
 *   active-user baseline + the explicit "direct write succeeds without 059's gate"
 *   sentinel below make the gate load-bearing.
 *
 * REALISM
 *   PostgREST executes its table writes as the authenticated role with RLS in
 *   force. pglite's default connection is a SUPERUSER, which BYPASSES RLS — so we
 *   `force row level security` AND run every attacking statement as a non-superuser
 *   role via `set role` (the same pattern profileEscalation.pglite.test.js uses).
 *   That is the faithful representation of the direct PostgREST path; we do NOT go
 *   through any RPC here.
 *
 * Loads VERBATIM from migrations: account_is_active (057), the settlements +
 * saved_maps owner write policies + enforce_account_active_write() trigger fn +
 * the gallery write policies (059). current_user_has_premium_access + auth.uid()
 * are GUC-backed stubs.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '057': resolve(dir, '057_enforce_account_status_writes.sql'),
  '059': resolve(dir, '059_enforce_account_status_rls.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames.
describe('account-status direct-write pglite targets exist (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const missing = Object.entries(MIG).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
    expect(allExist).toBe(true);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim. */
function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract function ${name} from migration ${migKey}`);
  return m[0];
}

/** Extract a `create policy "<title>" on public.<table> …;` statement verbatim. */
function extractPolicy(migKey, title) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  // Match from `create policy "title"` to the terminating `;` at column-0-ish
  // (the policy bodies in 059 are multi-line and end with `);`).
  const m = src.match(new RegExp(`create policy "${title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}"[\\s\\S]*?;\\s*\\n`, 'i'));
  if (!m) throw new Error(`could not extract policy "${title}" from migration ${migKey}`);
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

let db;
/** Run a statement AS the unprivileged authenticated user (RLS + triggers in force). */
const asUser = (sql) => db.exec(`set role nosuperuser; set test.uid = '${UID}'; ${sql}`);
/** Reset to superuser (RLS-exempt) for seeding/inspection. */
const asSuper = (sql) => db.exec(`reset role; ${sql}`);
const flag = (col) => db.exec(`reset role; update public.profiles set ${col} = now() where id = '${UID}';`);
const clearFlags = () => db.exec(`reset role; update public.profiles set banned_at = null, disabled_at = null, deleted_at = null where id = '${UID}';`);
const count = async (table, where = 'true') => {
  await db.exec('reset role;');
  const { rows } = await db.query(`select count(*)::int n from public.${table} where ${where}`);
  return rows[0].n;
};

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(allExist).toBe(true);
});

describe.runIf(allExist)('account-status DIRECT-table write gate — executed against 059 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function auth.role() returns text language sql stable as $fn$
        select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated')
      $fn$;
      -- Premium-access stub: the saved_maps policies require it. Default true so the
      -- premium check never masks the account-status gate we are testing.
      create or replace function public.current_user_has_premium_access() returns boolean
        language sql stable as $fn$
        select coalesce(nullif(current_setting('test.premium', true), '')::boolean, true)
      $fn$;

      create table public.profiles (
        id uuid primary key, role text default 'user', tier text default 'free',
        credits integer not null default 0, is_founder boolean not null default false,
        display_name text, updated_at timestamptz default now(),
        banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz
      );
      create table public.settlements (
        id uuid primary key, user_id uuid not null,
        name text, tier text, data jsonb, config jsonb, toggles jsonb, seed text,
        neighbour_links jsonb, ai_data jsonb default '{}'::jsonb,
        campaign_state jsonb, version_history jsonb,
        is_public boolean not null default false, public_slug text,
        access_state text not null default 'active'
      );
      create table public.saved_maps (
        id uuid primary key, user_id uuid not null, name text, map_data jsonb,
        is_public boolean not null default false, public_slug text,
        access_state text not null default 'active'
      );
      create table public.gallery_votes (
        settlement_id uuid not null, user_id uuid not null,
        created_at timestamptz not null default now(),
        primary key (settlement_id, user_id)
      );
      create table public.gallery_comments (
        id uuid primary key default gen_random_uuid(),
        settlement_id uuid not null, user_id uuid not null, body text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(), deleted_at timestamptz
      );
      create table public.gallery_reports (
        id uuid primary key default gen_random_uuid(),
        settlement_id uuid not null, user_id uuid not null,
        reason text not null default 'other', body text not null default '',
        status text not null default 'open',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        unique (settlement_id, user_id)
      );

      -- Self-read policies (real schema has them; UPDATE WITH CHECK subqueries read
      -- through them). Owner rows must be readable for the USING clause to see them.
      create policy "Users read own settlements" on public.settlements for select using (auth.uid() = user_id);
      create policy "Users read own maps" on public.saved_maps for select using (auth.uid() = user_id);
      create policy "Users read own votes" on public.gallery_votes for select using (auth.uid() = user_id);
      create policy "Users read own comments" on public.gallery_comments for select using (auth.uid() = user_id);
      create policy "Users read own reports" on public.gallery_reports for select using (auth.uid() = user_id);
      -- Public-read on settlements so the gallery-write EXISTS(is_public) subqueries resolve.
      create policy "Public settlements" on public.settlements for select using (is_public = true);
    `);

    // The REAL account-status predicate (057) — fail-closed, SECURITY DEFINER.
    await db.exec(extractFn('057', 'account_is_active'));
    // The REAL trigger function + the REAL owner/gallery write policies (059).
    await db.exec(extractFn('059', 'enforce_account_active_write'));

    // Owner write policies (059) — settlements + saved_maps.
    await db.exec(extractPolicy('059', 'Users insert active own settlements'));
    await db.exec(extractPolicy('059', 'Users update active own settlements'));
    await db.exec(extractPolicy('059', 'Users delete active own settlements'));
    await db.exec(extractPolicy('059', 'Premium users insert own maps'));
    await db.exec(extractPolicy('059', 'Premium users update active own maps'));
    await db.exec(extractPolicy('059', 'Premium users delete active own maps'));
    // Gallery write policies (059).
    await db.exec(extractPolicy('059', 'Users can upvote public settlements'));
    await db.exec(extractPolicy('059', 'Users can comment on public settlements'));
    await db.exec(extractPolicy('059', 'Users can report public gallery dossiers'));

    // The REAL triggers (059) — the redundant second layer.
    await db.exec(`
      create trigger trg_enforce_account_active_settlements
        before insert or update or delete on public.settlements
        for each row execute function public.enforce_account_active_write();
      create trigger trg_enforce_account_active_saved_maps
        before insert or update or delete on public.saved_maps
        for each row execute function public.enforce_account_active_write();
    `);

    // Force RLS + a non-superuser role (the superuser default bypasses RLS).
    await db.exec(`
      alter table public.settlements   enable row level security; alter table public.settlements   force row level security;
      alter table public.saved_maps    enable row level security; alter table public.saved_maps    force row level security;
      alter table public.gallery_votes enable row level security; alter table public.gallery_votes force row level security;
      alter table public.gallery_comments enable row level security; alter table public.gallery_comments force row level security;
      alter table public.gallery_reports  enable row level security; alter table public.gallery_reports  force row level security;
      create role nosuperuser nologin;
      grant select, insert, update, delete on
        public.settlements, public.saved_maps, public.gallery_votes,
        public.gallery_comments, public.gallery_reports to nosuperuser;
    `);
  });

  beforeEach(async () => {
    // Seed as a SERVICE-ROLE system run: the BEFORE-write triggers exempt
    // service_role (that is how the real downgrade/retention jobs seed rows), so
    // the trigger does not fire on these setup inserts. A stale test.uid from a
    // prior test is also cleared so nothing leaks into the next case. The acting
    // role/uid for the actual test writes is set by asUser().
    await db.exec(`
      reset role;
      set test.role = 'service_role'; set test.uid = '';
      truncate public.profiles, public.settlements, public.saved_maps,
        public.gallery_votes, public.gallery_comments, public.gallery_reports cascade;
      insert into public.profiles (id, role, tier) values ('${UID}', 'user', 'premium');
      -- A pre-existing OWNED active settlement to update/delete, and a PUBLIC one to
      -- vote/comment/report on (owned by another user so the gallery write is the
      -- only thing under test).
      insert into public.settlements (id, user_id, name, tier, data, access_state, is_public)
        values ('33333333-3333-3333-3333-333333333333', '${UID}', 'Mine', 'free', '{}'::jsonb, 'active', false);
      insert into public.settlements (id, user_id, name, tier, data, access_state, is_public)
        values ('44444444-4444-4444-4444-444444444444', '${OTHER}', 'Public', 'free', '{}'::jsonb, 'active', true);
      insert into public.saved_maps (id, user_id, name, map_data, access_state)
        values ('55555555-5555-5555-5555-555555555555', '${UID}', 'MyMap', '{}'::jsonb, 'active');
      -- Back to an end-user authed context for the test writes themselves.
      set test.role = 'authenticated'; set test.premium = 'true';
    `);
  });

  const SETTLE_NEW = '66666666-6666-6666-6666-666666666666';
  const MAP_NEW = '77777777-7777-7777-7777-777777777777';
  const PUBLIC_ID = '44444444-4444-4444-4444-444444444444';

  const directWrites = {
    'settlement INSERT': `insert into public.settlements (id, user_id, name, tier, data, access_state) values ('${SETTLE_NEW}', '${UID}', 'New', 'free', '{}'::jsonb, 'active')`,
    'settlement UPDATE': `update public.settlements set name = 'Renamed' where id = '33333333-3333-3333-3333-333333333333'`,
    'settlement DELETE': `delete from public.settlements where id = '33333333-3333-3333-3333-333333333333'`,
    'saved_map INSERT':  `insert into public.saved_maps (id, user_id, name, map_data, access_state) values ('${MAP_NEW}', '${UID}', 'NewMap', '{}'::jsonb, 'active')`,
    'saved_map UPDATE':  `update public.saved_maps set name = 'RenamedMap' where id = '55555555-5555-5555-5555-555555555555'`,
    'saved_map DELETE':  `delete from public.saved_maps where id = '55555555-5555-5555-5555-555555555555'`,
    'gallery vote INSERT':    `insert into public.gallery_votes (settlement_id, user_id) values ('${PUBLIC_ID}', '${UID}')`,
    'gallery comment INSERT': `insert into public.gallery_comments (settlement_id, user_id, body) values ('${PUBLIC_ID}', '${UID}', 'nice')`,
    'gallery report INSERT':  `insert into public.gallery_reports (settlement_id, user_id, reason, body, status) values ('${PUBLIC_ID}', '${UID}', 'spam', '', 'open')`,
  };

  // ── BASELINE: an ACTIVE account can do every direct write (proves the gate isn't
  //    just blanket-denying — a green run here is required for the rejections to mean
  //    something). If 059 were reverted these would ALSO pass, so the rejection tests
  //    below are what make 059 load-bearing.
  describe('an ACTIVE account succeeds on every direct write (baseline)', () => {
    for (const [name, sql] of Object.entries(directWrites)) {
      it(`active: ${name} succeeds`, async () => {
        await expect(asUser(sql)).resolves.not.toThrow();
      });
    }
  });

  // ── REJECTIONS: each flag must block every direct write, via RLS (no row admitted
  //    → a silent no-op for UPDATE/DELETE) OR the trigger (a raised exception for
  //    settlements/saved_maps). We assert the EFFECT (no row written / row unchanged)
  //    so both enforcement layers are covered regardless of which fired.
  for (const col of ['banned_at', 'disabled_at', 'deleted_at']) {
    describe(`a ${col.replace('_at', '')} account is blocked on every direct write`, () => {
      it('settlement INSERT does not land', async () => {
        await flag(col);
        try { await asUser(directWrites['settlement INSERT']); } catch { /* trigger may raise */ }
        expect(await count('settlements', `id = '${SETTLE_NEW}'`)).toBe(0);
        await clearFlags();
      });
      it('settlement UPDATE does not change the row', async () => {
        await flag(col);
        try { await asUser(directWrites['settlement UPDATE']); } catch { /* trigger may raise */ }
        expect(await count('settlements', `id = '33333333-3333-3333-3333-333333333333' and name = 'Mine'`)).toBe(1);
        await clearFlags();
      });
      it('settlement DELETE does not remove the row', async () => {
        await flag(col);
        try { await asUser(directWrites['settlement DELETE']); } catch { /* trigger may raise */ }
        expect(await count('settlements', `id = '33333333-3333-3333-3333-333333333333'`)).toBe(1);
        await clearFlags();
      });
      it('saved_map INSERT does not land', async () => {
        await flag(col);
        try { await asUser(directWrites['saved_map INSERT']); } catch { /* trigger may raise */ }
        expect(await count('saved_maps', `id = '${MAP_NEW}'`)).toBe(0);
        await clearFlags();
      });
      it('saved_map UPDATE does not change the row', async () => {
        await flag(col);
        try { await asUser(directWrites['saved_map UPDATE']); } catch { /* trigger may raise */ }
        expect(await count('saved_maps', `id = '55555555-5555-5555-5555-555555555555' and name = 'MyMap'`)).toBe(1);
        await clearFlags();
      });
      it('saved_map DELETE does not remove the row', async () => {
        await flag(col);
        try { await asUser(directWrites['saved_map DELETE']); } catch { /* trigger may raise */ }
        expect(await count('saved_maps', `id = '55555555-5555-5555-5555-555555555555'`)).toBe(1);
        await clearFlags();
      });
      it('gallery vote INSERT does not land', async () => {
        await flag(col);
        try { await asUser(directWrites['gallery vote INSERT']); } catch { /* RLS no-op */ }
        expect(await count('gallery_votes', `user_id = '${UID}'`)).toBe(0);
        await clearFlags();
      });
      it('gallery comment INSERT does not land', async () => {
        await flag(col);
        try { await asUser(directWrites['gallery comment INSERT']); } catch { /* RLS no-op */ }
        expect(await count('gallery_comments', `user_id = '${UID}'`)).toBe(0);
        await clearFlags();
      });
      it('gallery report INSERT does not land', async () => {
        await flag(col);
        try { await asUser(directWrites['gallery report INSERT']); } catch { /* RLS no-op */ }
        expect(await count('gallery_reports', `user_id = '${UID}'`)).toBe(0);
        await clearFlags();
      });
    });
  }

  // ── REDUNDANCY PROOF: drop the RLS write policy and confirm the TRIGGER alone
  //    still blocks a banned account's direct settlement write. This is the whole
  //    point of the second layer — a future migration that drops/mis-edits the
  //    policy must NOT reopen the hole.
  describe('the trigger blocks a banned account even with the owner RLS policy dropped', () => {
    it('settlement INSERT is rejected by the trigger after the INSERT policy is dropped', async () => {
      await db.exec(`reset role; drop policy "Users insert active own settlements" on public.settlements;`);
      await flag('banned_at');
      // With no INSERT policy a banned user's insert is RLS-denied anyway, so to
      // isolate the TRIGGER we re-add a permissive policy that omits the account
      // gate (simulating a mis-edited policy) and confirm the trigger still raises.
      await db.exec(`reset role; create policy "permissive insert" on public.settlements for insert with check (auth.uid() = user_id and access_state = 'active');`);
      await expect(
        asUser(`insert into public.settlements (id, user_id, name, tier, data, access_state) values ('88888888-8888-8888-8888-888888888888', '${UID}', 'Sneak', 'free', '{}'::jsonb, 'active')`),
      ).rejects.toThrow(/account is not active/i);
      expect(await count('settlements', `id = '88888888-8888-8888-8888-888888888888'`)).toBe(0);
      // Restore the real policy + clear flag so later tests are unaffected.
      await db.exec(`reset role; drop policy "permissive insert" on public.settlements;`);
      await db.exec(extractPolicy('059', 'Users insert active own settlements'));
      await clearFlags();
    });
  });

  // ── COUNTER-PROOF: a permissive INSERT policy WITHOUT 059's trigger would let a
  //    banned write land — proving the assertions above are not vacuously green.
  describe('sentinel: without the account gate a banned direct write WOULD land', () => {
    it('a banned insert succeeds when neither the policy gate nor the trigger applies', async () => {
      await db.exec(`reset role; alter table public.settlements disable trigger trg_enforce_account_active_settlements;`);
      await db.exec(`reset role; drop policy if exists "Users insert active own settlements" on public.settlements; create policy "permissive insert2" on public.settlements for insert with check (auth.uid() = user_id and access_state = 'active');`);
      await flag('banned_at');
      await expect(
        asUser(`insert into public.settlements (id, user_id, name, tier, data, access_state) values ('99999999-9999-9999-9999-999999999999', '${UID}', 'Leak', 'free', '{}'::jsonb, 'active')`),
      ).resolves.not.toThrow();
      expect(await count('settlements', `id = '99999999-9999-9999-9999-999999999999'`)).toBe(1);
      // Restore the gate (trigger + real policy) for any subsequent run.
      await db.exec(`reset role; alter table public.settlements enable trigger trg_enforce_account_active_settlements;`);
      await db.exec(`reset role; drop policy "permissive insert2" on public.settlements;`);
      await db.exec(extractPolicy('059', 'Users insert active own settlements'));
      await clearFlags();
    });
  });
});
