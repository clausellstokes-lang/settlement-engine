/**
 * profileEscalation.pglite.test.js — EXECUTION-level test for the profiles
 * RLS column-lock (A+ tests-tooling.3).
 *
 * The privilege-escalation guard is migration 009's UPDATE policy "Users update
 * own profile (display_name only)": its WITH CHECK pins role/tier/credits/
 * is_founder to their current values, so a self-UPDATE can change ONLY
 * display_name. Until now that single line of SQL was verified two non-executing
 * ways — a commented "run manually" block and a Docker-only pgTAP file — so a
 * reorder or a loosened predicate could ship green. This RUNS the real policy.
 *
 * It loads the ACTUAL policy DDL verbatim from migration 009 into in-process
 * Postgres (pglite) and attempts every escalation a malicious client could send.
 *
 * CRITICAL pglite caveat (baked into setup so it can't false-green): pglite's
 * default connection is a SUPERUSER, and a superuser BYPASSES RLS even with
 * `enable row level security`. RLS is only enforced with BOTH `force row level
 * security` AND a non-superuser role via `set role`. We seed as the superuser
 * (RLS-exempt), then `set role nosuperuser` for every attacking statement.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_009 = resolve(process.cwd(), 'supabase', 'migrations', '009_profile_security.sql');
const present = existsSync(MIG_009);

/** Extract the column-lock UPDATE policy verbatim from migration 009. */
function extractUpdatePolicy() {
  const src = readFileSync(MIG_009, 'utf-8');
  const m = src.match(/create policy "Users update own profile \(display_name only\)"[\s\S]*?;/i);
  if (!m) throw new Error('could not extract the column-lock UPDATE policy from migration 009');
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';

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

describe.runIf(present)('profiles RLS column-lock — executed against migration 009 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create table public.profiles (
        id uuid primary key,
        role text not null default 'user',
        tier text not null default 'free',
        credits integer not null default 0,
        is_founder boolean not null default false,
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
    // The REAL column-lock UPDATE policy, verbatim from migration 009.
    await db.exec(extractUpdatePolicy());
    // A non-superuser role — the superuser default bypasses RLS even when forced.
    await db.exec(`
      create role nosuperuser nologin;
      grant select, update on public.profiles to nosuperuser;
    `);
  });

  beforeEach(reseed);

  // ── Escalations must be REJECTED (WITH CHECK violation → error) ──────────────
  const escalations = {
    'role → developer':      `update public.profiles set role = 'developer' where id = '${UID}'`,
    'tier → premium':        `update public.profiles set tier = 'premium' where id = '${UID}'`,
    'credits → 99999':       `update public.profiles set credits = 99999 where id = '${UID}'`,
    'is_founder → true':     `update public.profiles set is_founder = true where id = '${UID}'`,
    // The sneakiest path: all four at once (the migration's own example attack).
    'combined multi-column': `update public.profiles set role='developer', tier='premium', credits=99999, is_founder=true where id = '${UID}'`,
  };

  for (const [name, sql] of Object.entries(escalations)) {
    it(`rejects self-escalation: ${name}`, async () => {
      await expect(asUser(sql)).rejects.toThrow(/row-level security|policy/i);
      // And the persisted values are untouched.
      expect(await readOwn('role')).toBe('user');
      expect(Number(await readOwn('credits'))).toBe(10);
      expect(await readOwn('tier')).toBe('free');
      expect(await readOwn('is_founder')).toBe(false);
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
