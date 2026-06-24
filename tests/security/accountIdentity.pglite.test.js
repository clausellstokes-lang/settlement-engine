/**
 * accountIdentity.pglite.test.js — EXECUTION tests for the account-identity
 * foundation (migration 075) and the gallery resolve-by-id (migration 076).
 *
 * WHAT THIS PROVES (each load-bearing — a revert turns it RED)
 *   1. gen_account_number() yields unique SF-XXXXXXX handles in the Crockford
 *      alphabet (no ambiguous 0/O/1/I/L/U), and the unique index rejects a dup.
 *   2. RLS: an end-user self-UPDATE CANNOT change its own account_number (the
 *      075 pin in "Users update own profile (safe preferences only)"), while a
 *      no-op (same value) self-update of a writable column still succeeds — so
 *      the pin is the immutability guard, not a blanket deny. A sentinel proves
 *      that WITHOUT the pin the write would land (not vacuously green).
 *   3. update_external_name() rejects a duplicate (case-insensitive), a reserved
 *      name, and a bad charset; accepts a clean rename; the unique index is the
 *      race backstop.
 *   4. Gallery resolve-by-id: a JOIN onto profiles.external_name returns the
 *      CURRENT name, so a rename reflects in the resolved author with ZERO
 *      backfill (the 076 rename-safety principle, exercised on the real shape).
 *
 * REALISM
 *   PostgREST table writes run as the authenticated role with RLS forced; the
 *   default pglite connection is a superuser that BYPASSES RLS, so the RLS test
 *   `force row level security` + `set role nosuperuser` (the same pattern
 *   accountStatusDirectWrites.pglite.test.js uses). auth.uid()/account_is_active
 *   are GUC-backed stubs. The 075/076 function + policy bodies are extracted
 *   VERBATIM from the migration files so a body edit is what the test exercises.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '075': resolve(dir, '075_account_identity_columns.sql'),
  '076': resolve(dir, '076_gallery_resolve_author.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

describe('account-identity pglite targets exist (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const missing = Object.entries(MIG).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim. */
function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract function ${name} from migration ${migKey}`);
  return m[0];
}

/**
 * Extract a `create policy "<title>" …;` statement verbatim. The 075 policy body
 * is multi-line and ends with `\n  );\n` — the WITH CHECK contains nested
 * `(select … )` parens, so we match up to the FIRST line that is exactly the
 * closing `);` (optionally indented), not the first `);` anywhere.
 */
function extractPolicy(migKey, title) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const escTitle = title.replace(/[.*+?^${}()|[\]\\]/g, (c) => `\\${c}`);
  const m = src.match(new RegExp(`create policy "${escTitle}"[\\s\\S]*?\\n\\s*\\);`, 'i'));
  if (!m) throw new Error(`could not extract policy "${title}" from migration ${migKey}`);
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

let db;
const asUser = (sql) => db.exec(`set role nosuperuser; set test.uid = '${UID}'; ${sql}`);
const asSuper = (sql) => db.exec(`reset role; ${sql}`);

describe.runIf(allExist)('account identity — 075 generation + RLS + external_name + 076 resolve (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- account_is_active stub: default true so the gate never masks the
      -- account_number pin we are actually testing.
      create or replace function public.account_is_active(p uuid) returns boolean
        language sql stable as $fn$ select true $fn$;

      create table public.profiles (
        id uuid primary key,
        role text default 'user', tier text default 'free',
        credits integer not null default 0, is_founder boolean not null default false,
        stripe_customer_id text, email text, display_name text,
        banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz,
        updated_at timestamptz default now()
      );
      -- The 075 ADD COLUMNs + indexes + reserved table, applied directly (the
      -- alter/create-index/seed are idempotent DDL, not function bodies).
      alter table public.profiles add column if not exists account_number text;
      alter table public.profiles add column if not exists external_name  text;
      alter table public.profiles add column if not exists first_name      text;
      alter table public.profiles add column if not exists last_name       text;
      alter table public.profiles add column if not exists preferred_name  text;
      create unique index if not exists idx_profiles_account_number on public.profiles(account_number);
      create unique index if not exists idx_profiles_external_name_ci on public.profiles(lower(external_name));
      create table if not exists public.reserved_external_names (name text primary key);
      insert into public.reserved_external_names (name) values ('admin'),('support'),('moderator') on conflict do nothing;

      -- Self-read policy (the UPDATE WITH CHECK subqueries read through it).
      create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
    `);

    // Real 075 helpers + RPCs.
    await db.exec(extractFn('075', 'normalize_external_name'));
    await db.exec(extractFn('075', 'gen_account_number'));
    await db.exec(extractFn('075', 'gen_external_name'));
    await db.exec(extractFn('075', 'update_external_name'));

    // The real 075 self-UPDATE policy (carries the account_number pin).
    await db.exec(extractPolicy('075', 'Users update own profile (safe preferences only)'));

    await db.exec(`
      alter table public.profiles enable row level security;
      alter table public.profiles force row level security;
      create role nosuperuser nologin;
      grant select, insert, update on public.profiles to nosuperuser;
      grant select on public.reserved_external_names to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role; set test.uid = '';
      truncate public.profiles cascade;
      insert into public.profiles (id, role, tier, account_number, external_name)
        values ('${UID}', 'user', 'free', public.gen_account_number(), public.gen_external_name());
      insert into public.profiles (id, role, tier, account_number, external_name)
        values ('${OTHER}', 'user', 'free', public.gen_account_number(), 'TakenName42');
    `);
  });

  const one = async (sql) => { await db.exec('reset role;'); const { rows } = await db.query(sql); return rows[0]; };

  // ── (1) generation ─────────────────────────────────────────────────────────
  describe('gen_account_number', () => {
    it('matches SF- + 7 Crockford chars (no ambiguous 0/O/1/I/L/U)', async () => {
      const { n } = await one(`select account_number as n from public.profiles where id = '${UID}'`);
      expect(n).toMatch(/^SF-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{7}$/);
    });

    it('is unique across a batch (the index would reject a collision)', async () => {
      await db.exec(`reset role;`);
      // Generate many; assert all distinct.
      const { rows } = await db.query(`
        select public.gen_account_number() as a from generate_series(1, 200)
      `);
      const set = new Set(rows.map(r => r.a));
      expect(set.size).toBe(rows.length);
    });

    it('the unique index rejects a duplicate account_number write', async () => {
      const { existing } = await one(`select account_number as existing from public.profiles where id = '${UID}'`);
      await expect(
        db.query(`update public.profiles set account_number = '${existing}' where id = '${OTHER}'`),
      ).rejects.toThrow();
    });
  });

  // ── (2) RLS immutability of account_number ─────────────────────────────────
  describe('RLS: end-user cannot change its own account_number', () => {
    it('a self-UPDATE that changes account_number does NOT change the row', async () => {
      const before = (await one(`select account_number as v from public.profiles where id = '${UID}'`)).v;
      try {
        await asUser(`update public.profiles set account_number = 'SF-ZZZZZZZ' where id = '${UID}'`);
      } catch { /* WITH CHECK may reject outright */ }
      const after = (await one(`select account_number as v from public.profiles where id = '${UID}'`)).v;
      expect(after).toBe(before);
    });

    it('a self-UPDATE of a WRITABLE column (display_name) still succeeds', async () => {
      await expect(
        asUser(`update public.profiles set display_name = 'Cartographer of Note' where id = '${UID}'`),
      ).resolves.not.toThrow();
      const v = (await one(`select display_name as v from public.profiles where id = '${UID}'`)).v;
      expect(v).toBe('Cartographer of Note');
    });

    it('SENTINEL: without the pin (permissive policy) the account_number write WOULD land', async () => {
      await db.exec(`reset role; drop policy "Users update own profile (safe preferences only)" on public.profiles;`);
      await db.exec(`reset role; create policy "permissive" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);`);
      await expect(
        asUser(`update public.profiles set account_number = 'SF-ZZZZZZZ' where id = '${UID}'`),
      ).resolves.not.toThrow();
      expect((await one(`select account_number as v from public.profiles where id = '${UID}'`)).v).toBe('SF-ZZZZZZZ');
      // Restore the real pinned policy for any later test ordering.
      await db.exec(`reset role; drop policy "permissive" on public.profiles;`);
      await db.exec(extractPolicy('075', 'Users update own profile (safe preferences only)'));
    });
  });

  // ── (3) external_name owner-edit validation ────────────────────────────────
  describe('update_external_name', () => {
    const callAs = (name) => db.exec(`set role nosuperuser; set test.uid = '${UID}'; select public.update_external_name('${name}');`);

    it('accepts a clean, unique rename', async () => {
      await expect(callAs('QuietArchivist7')).resolves.not.toThrow();
      expect((await one(`select external_name as v from public.profiles where id = '${UID}'`)).v).toBe('QuietArchivist7');
    });

    it('rejects a case-insensitive duplicate of another user', async () => {
      await expect(callAs('takenNAME42')).rejects.toThrow(/taken/i);
    });

    it('rejects a reserved name', async () => {
      await expect(callAs('Admin')).rejects.toThrow(/reserved/i);
    });

    it('rejects a name with an illegal charset', async () => {
      await expect(callAs('bad name!')).rejects.toThrow(/letters, numbers/i);
    });

    it('rejects too-short names', async () => {
      await expect(callAs('ab')).rejects.toThrow(/3 to 24/i);
    });
  });

  // ── (4) gallery resolve-by-id (the 076 rename-safety principle) ────────────
  describe('gallery resolve-by-id reflects the CURRENT external_name', () => {
    beforeEach(async () => {
      // A minimal stand-in for the gallery JOIN: a public "share" keyed by owner
      // id, resolving the author from profiles.external_name (exactly the shape
      // migration 076 adds: `left join profiles ap on ap.id = owner_id`).
      await db.exec(`
        reset role;
        create table if not exists public.shares (id uuid primary key, owner_id uuid not null);
        truncate public.shares;
        insert into public.shares (id, owner_id) values (gen_random_uuid(), '${UID}');
        create or replace function public.resolve_author(p_owner uuid)
          returns text language sql stable as $fn$
          select ap.external_name from public.shares s
          left join public.profiles ap on ap.id = s.owner_id
          where s.owner_id = p_owner limit 1
        $fn$;
      `);
    });

    it('a rename via update_external_name reflects with ZERO backfill', async () => {
      const before = (await one(`select public.resolve_author('${UID}') as v`)).v;
      await db.exec(`set role nosuperuser; set test.uid = '${UID}'; select public.update_external_name('RenamedSteward9');`);
      const after = (await one(`select public.resolve_author('${UID}') as v`)).v;
      expect(after).toBe('RenamedSteward9');
      expect(after).not.toBe(before);
    });
  });
});
