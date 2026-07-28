/**
 * enforceSaveLimit.pglite.test.js — pins the free-tier save-count wall,
 * public.enforce_save_limit + its BEFORE INSERT trigger on settlements
 * (migration 014_enforce_save_limit.sql).
 *
 * This is the server-side backstop behind the client's canSave() gate: even a
 * bypassed client cannot insert a 4th settlement on a free/wanderer account, and
 * cannot save a row for ANOTHER user. It was REAL BUT UNPINNED (Wave-D wall
 * census). Runs the real PL/pgSQL trigger against pglite over a minimal profiles
 * + settlements scaffold and asserts:
 *   - free / wanderer / unknown tier caps at 3 (the 4th INSERT raises);
 *   - premium / cartographer / founder are unlimited;
 *   - developer / admin roles bypass entirely;
 *   - a cross-user INSERT (NEW.user_id != auth.uid()) is rejected.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase', 'migrations', '014_enforce_save_limit.sql');
const have = existsSync(MIG);
const SRC = have ? readFileSync(MIG, 'utf-8') : '';

/** Extract a `create or replace function ... $$;` block by name. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}
/** Extract the `create trigger ...;` DDL by name. */
function extractTrigger(src, name) {
  const m = src.match(new RegExp(`^create\\s+trigger\\s+${name}\\b[\\s\\S]*?;`, 'im'));
  if (!m) throw new Error(`could not extract trigger ${name}`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB   = '22222222-2222-2222-2222-222222222222';

let db;
const setActor = (uid) => db.exec(`set test.uid = '${uid ?? ''}';`);
const seedProfile = (id, tier, role = 'user') =>
  db.query(`insert into public.profiles (id, tier, role) values ($1, $2, $3)`, [id, tier, role]);
const insertSave = (userId) =>
  db.query(`insert into public.settlements (user_id) values ($1)`, [userId]);

it('migration 014 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('enforce_save_limit trigger (pglite, 014)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    await db.exec(`
      create schema if not exists auth;
      -- Stub auth.uid() off a GUC so the cross-user guard can be exercised.
      create or replace function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('test.uid', true), '')::uuid
      $$;
      create table public.profiles (
        id uuid primary key,
        tier text,
        role text not null default 'user'
      );
      create table public.settlements (
        id bigint generated always as identity primary key,
        user_id uuid not null
      );
    `);
    await db.exec(extractFn(SRC, 'enforce_save_limit'));
    await db.exec(extractTrigger(SRC, 'settlements_enforce_save_limit'));
  }, 60000);

  beforeEach(async () => {
    await db.exec('truncate public.settlements; truncate public.profiles;');
    await setActor(null); // default: no authenticated actor (cross-user guard inert)
  });

  it('a free account saves up to 3, and the 4th INSERT is rejected', async () => {
    await seedProfile(ALICE, 'free');
    await expect(insertSave(ALICE)).resolves.toBeTruthy(); // 1
    await expect(insertSave(ALICE)).resolves.toBeTruthy(); // 2
    await expect(insertSave(ALICE)).resolves.toBeTruthy(); // 3
    await expect(insertSave(ALICE)).rejects.toThrow(/save limit reached/i); // 4 → blocked
    // The rejected row did not land — the count stays at exactly 3.
    expect((await db.query(`select count(*)::int c from public.settlements`)).rows[0].c).toBe(3);
  });

  it('an unknown / null tier defaults to the 3-save cap', async () => {
    await seedProfile(ALICE, null);
    for (let i = 0; i < 3; i++) await insertSave(ALICE);
    await expect(insertSave(ALICE)).rejects.toThrow(/save limit reached/i);
  });

  it('premium / cartographer / founder tiers are unlimited', async () => {
    for (const tier of ['premium', 'cartographer', 'founder']) {
      await db.exec('truncate public.settlements; truncate public.profiles;');
      await seedProfile(ALICE, tier);
      for (let i = 0; i < 6; i++) await expect(insertSave(ALICE)).resolves.toBeTruthy();
    }
  });

  it('developer / admin roles bypass the cap regardless of tier', async () => {
    for (const role of ['developer', 'admin']) {
      await db.exec('truncate public.settlements; truncate public.profiles;');
      await seedProfile(ALICE, 'free', role);
      for (let i = 0; i < 5; i++) await expect(insertSave(ALICE)).resolves.toBeTruthy();
    }
  });

  it('rejects a cross-user INSERT (NEW.user_id != auth.uid())', async () => {
    await seedProfile(ALICE, 'free');
    await seedProfile(BOB, 'free');
    await setActor(ALICE); // Alice is the authenticated caller…
    // …trying to save a settlement owned by Bob.
    await expect(insertSave(BOB)).rejects.toThrow(/cannot save a settlement for another user/i);
    // Alice saving her own row still works.
    await expect(insertSave(ALICE)).resolves.toBeTruthy();
  });
});
