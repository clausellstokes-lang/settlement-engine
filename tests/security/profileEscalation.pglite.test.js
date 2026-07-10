/**
 * profileEscalation.pglite.test.js — EXECUTION-level test for the profiles
 * RLS column-lock (A+ tests-tooling.3; hardened for finding F7).
 *
 * The privilege-escalation guard is the profiles self-UPDATE policy: its WITH
 * CHECK pins the escalation-relevant columns to their current values, so a
 * self-UPDATE can change ONLY safe preference columns (display_name, etc.).
 *
 * F7 fix: this test previously extracted migration 009's policy "Users update
 * own profile (display_name only)" BY NAME — but migration 018 DROPS that policy
 * and replaces it with "Users update own profile (safe preferences only)", which
 * additionally pins stripe_customer_id and email. So the test verified DEAD SQL
 * and a regression in the LIVE policy would ship green. It now derives the
 * NET-CURRENT self-update policy by replaying every migration's create/drop of
 * profiles UPDATE policies in file order — so it always attacks whatever policy
 * production actually runs — and asserts every column that policy pins.
 *
 * CRITICAL pglite caveat (baked into setup so it can't false-green): pglite's
 * default connection is a SUPERUSER, and a superuser BYPASSES RLS even with
 * `enable row level security`. RLS is only enforced with BOTH `force row level
 * security` AND a non-superuser role via `set role`. We seed as the superuser
 * (RLS-exempt), then `set role nosuperuser` for every attacking statement.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const present = existsSync(MIG_DIR);

/**
 * Derive the NET-CURRENT self-update policy on public.profiles by replaying
 * every migration's `create policy` / `drop policy` for a FOR UPDATE policy
 * whose USING references `auth.uid() = id` (the self, not the privileged-dev,
 * policy). The last one standing is what production enforces. Returns
 * { name, ddl, pinnedColumns } — pinnedColumns parsed from the `<col> is not
 * distinct from` clauses in the WITH CHECK so the test asserts exactly what the
 * live policy locks (catches both a loosened AND a newly-added pin).
 */
function netCurrentSelfUpdatePolicy() {
  const files = readdirSync(MIG_DIR).filter(f => /^\d.*\.sql$/.test(f)).sort();
  const live = new Map(); // policy name -> ddl
  const createRe = /create\s+policy\s+"([^"]+)"\s+on\s+public\.profiles([\s\S]*?);/gi;
  const dropRe = /drop\s+policy\s+if\s+exists\s+"([^"]+)"\s+on\s+public\.profiles/gi;
  for (const f of files) {
    const src = readFileSync(resolve(MIG_DIR, f), 'utf-8');
    // Process drops and creates in source order within the file.
    const events = [];
    let m;
    while ((m = createRe.exec(src))) events.push({ kind: 'create', name: m[1], body: m[2], ddl: m[0], idx: m.index });
    while ((m = dropRe.exec(src))) events.push({ kind: 'drop', name: m[1], idx: m.index });
    events.sort((a, b) => a.idx - b.idx);
    for (const e of events) {
      if (e.kind === 'drop') live.delete(e.name);
      else live.set(e.name, e);
    }
  }
  // The self policy: FOR UPDATE, USING auth.uid() = id, not the dev/privileged one.
  const self = [...live.values()].find(e =>
    /for\s+update/i.test(e.body) &&
    /auth\.uid\(\)\s*=\s*id/i.test(e.body) &&
    !/current_user_is_privileged/i.test(e.body),
  );
  if (!self) throw new Error('could not derive a net-current self-update policy on public.profiles');
  const pinnedColumns = [...self.body.matchAll(/\b(\w+)\s+is\s+not\s+distinct\s+from/gi)].map(x => x[1]);
  return { name: self.name, ddl: self.ddl, pinnedColumns };
}

const UID = '11111111-1111-1111-1111-111111111111';
const POLICY = present ? netCurrentSelfUpdatePolicy() : null;

let db;
/** Run a statement AS the unprivileged user (RLS enforced). */
const asUser = (sql) => db.exec(`set role nosuperuser; set test.uid = '${UID}'; ${sql}`);
/** Reseed the row AS the superuser (RLS-exempt) and return to the attack role. */
async function reseed() {
  await db.exec(`
    reset role;
    delete from public.profiles;
    insert into public.profiles (id, role, tier, credits, is_founder, display_name)
      values ('${UID}', 'user', 'free', 10, false, 'Original');
    set role nosuperuser;
    set test.uid = '${UID}';
  `);
}
const readOwn = async (col) => {
  await db.exec(`set role nosuperuser; set test.uid = '${UID}';`);
  const { rows } = await db.query(`select ${col} from public.profiles where id = $1`, [UID]);
  return rows[0]?.[col];
};

describe.runIf(present)('profiles RLS column-lock — executed against the NET-CURRENT policy (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- account_is_active (057) stub — the net-current self-update policy (087,
      -- forked through 059) gates USING + WITH CHECK on it. Return true so an
      -- active account's display_name update is admitted; the escalation
      -- rejections are driven by the column pins, independent of this.
      create or replace function public.account_is_active(p uuid) returns boolean language sql stable as $fn$
        select true
      $fn$;
      -- Columns the net-current 087 policy pins (beyond the original set): the
      -- WITH CHECK subqueries read each pinned column via an is-not-distinct-from
      -- self-subquery, so every pinned column must exist on this scaffold table.
      create table public.profiles (
        id uuid primary key,
        role text not null default 'user',
        tier text not null default 'free',
        credits integer not null default 0,
        is_founder boolean not null default false,
        stripe_customer_id text,
        stripe_subscription_id text,
        email text,
        banned_at timestamptz,
        disabled_at timestamptz,
        deleted_at timestamptz,
        account_number text,
        external_name text,
        display_name text,
        updated_at timestamptz default now()
      );
      -- Self-read policy: the real schema has one (migration 001), and the
      -- UPDATE policy's WITH CHECK subquery reads the current row through it.
      create policy "Users read own profile" on public.profiles
        for select using (auth.uid() = id);
      alter table public.profiles enable row level security;
      alter table public.profiles force row level security; -- required for pglite to enforce RLS
    `);
    // The REAL, NET-CURRENT self-update policy (018's "safe preferences only"
    // after 009's "display_name only" is dropped) — derived by migration replay,
    // never hardcoded by name (finding F7).
    await db.exec(POLICY.ddl);
    // A non-superuser role — the superuser default bypasses RLS even when forced.
    await db.exec(`
      create role nosuperuser nologin;
      grant select, update on public.profiles to nosuperuser;
    `);
  }, 30000); // PGlite WASM cold-start is ~8s under parallel load — beyond the 10s default.

  beforeEach(reseed);

  // Guard the derivation itself: the live self-update policy MUST pin every
  // escalation-relevant column. A future migration that loosens the WITH CHECK
  // (drops a pin) makes this fail — the exact regression the by-name extraction
  // was blind to.
  it('the net-current policy pins every escalation-relevant column', () => {
    for (const col of ['role', 'tier', 'credits', 'is_founder', 'stripe_customer_id', 'email']) {
      expect(POLICY.pinnedColumns, `live policy "${POLICY.name}" no longer pins ${col}`).toContain(col);
    }
  });

  // ── Escalations must be REJECTED (WITH CHECK violation → error) ──────────────
  const escalations = {
    'role → developer':          `update public.profiles set role = 'developer' where id = '${UID}'`,
    'tier → premium':            `update public.profiles set tier = 'premium' where id = '${UID}'`,
    'credits → 99999':           `update public.profiles set credits = 99999 where id = '${UID}'`,
    'is_founder → true':         `update public.profiles set is_founder = true where id = '${UID}'`,
    'stripe_customer_id hijack': `update public.profiles set stripe_customer_id = 'cus_attacker' where id = '${UID}'`,
    'email swap':                `update public.profiles set email = 'attacker@evil.test' where id = '${UID}'`,
    // The sneakiest path: everything at once (the migration's own example attack).
    'combined multi-column':     `update public.profiles set role='developer', tier='premium', credits=99999, is_founder=true, stripe_customer_id='cus_x', email='x@y.z' where id = '${UID}'`,
  };

  for (const [name, sql] of Object.entries(escalations)) {
    it(`rejects self-escalation: ${name}`, async () => {
      await expect(asUser(sql)).rejects.toThrow(/row-level security|policy/i);
      // And the persisted values are untouched.
      expect(await readOwn('role')).toBe('user');
      expect(Number(await readOwn('credits'))).toBe(10);
      expect(await readOwn('tier')).toBe('free');
      expect(await readOwn('is_founder')).toBe(false);
      expect(await readOwn('stripe_customer_id')).toBe(null);
    });
  }

  // ── The one legitimate self-update still works ──────────────────────────────
  it('allows the owner to update display_name', async () => {
    await asUser(`update public.profiles set display_name = 'Renamed' where id = '${UID}'`);
    expect(await readOwn('display_name')).toBe('Renamed');
    // …and the locked columns are still their seeded values.
    expect(await readOwn('role')).toBe('user');
    expect(Number(await readOwn('credits'))).toBe(10);
  });

  // ── Cannot touch ANOTHER user's row at all (USING clause) ────────────────────
  it("cannot update another user's display_name (USING blocks the row)", async () => {
    await db.exec(`reset role; insert into public.profiles (id, display_name) values ('22222222-2222-2222-2222-222222222222', 'Victim'); set role nosuperuser; set test.uid = '${UID}';`);
    await db.exec(`update public.profiles set display_name = 'Hijacked' where id = '22222222-2222-2222-2222-222222222222'`);
    await db.exec('reset role;');
    const { rows } = await db.query(`select display_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'`);
    expect(rows[0].display_name).toBe('Victim'); // unchanged — the row was invisible to the UPDATE
  });
});
