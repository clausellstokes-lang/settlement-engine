/**
 * surveyorByokHealth.pglite.test.js — runs the REAL PL/pgSQL from migration 143
 * (BYOK MANAGEMENT SURFACE key-health + the aiOperationLog refusal class) against
 * in-process Postgres (pglite), like aiSpendReservation.pglite.test.js.
 *
 * What it proves:
 *   - surveyor_byok_set_health transitions a key's health, stamps last_checked_at
 *     always and last_verified_at ONLY on 'healthy' (never "healthy unverified"),
 *     and clears the error class when healthy / records it otherwise.
 *   - surveyor_byok_status returns the caller's OWN health WITHOUT the ciphertext.
 *   - write_ai_operation_log's new 18-param signature persists refusal_class.
 *   - SOURCE PIN: surveyor_byok_set RESETS health to 'unverified' on set/rotate
 *     (asserted by source — the body needs pgcrypto which pglite lacks).
 *
 * pgcrypto is unavailable in pglite, so this inserts key rows with a dummy bytea
 * ciphertext directly and never calls the encrypting surveyor_byok_set.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_144 = resolve(process.cwd(), 'supabase', 'migrations', '143_surveyor_byok_health.sql');
const haveMigration = existsSync(MIG_144);

const UID = '11111111-1111-1111-1111-111111111111';
const UID2 = '22222222-2222-2222-2222-222222222222';

/** Extract a `create or replace function public.<name>` body verbatim. */
function extractFn(src, name) {
  const m = src.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;
const scalar = async (q, params) => (await db.query(q, params)).rows[0];
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);

const insertKey = (uid, provider = 'anthropic', health = 'unverified') =>
  db.query(
    `insert into public.surveyor_byok_keys (user_id, provider, ciphertext, health)
     values ($1, $2, '\\x00'::bytea, $3)`,
    [uid, provider, health],
  );
const setHealth = async (uid, provider, health, errClass = null, verified = false) =>
  (await scalar('select public.surveyor_byok_set_health($1,$2,$3,$4,$5) as r', [uid, provider, health, errClass, verified])).r;
const status = async () => (await db.query('select * from public.surveyor_byok_status(null)')).rows;

it('targeted migration present (suite not vacuous)', () => {
  expect(haveMigration).toBe(true);
});

/**
 * Wall-clock ceiling for the hook that boots PGlite and installs the migration
 * bodies. A hook timeout is a DEADLOCK GUARD, not a performance budget: the
 * inherited 10000ms default sits exactly on pglite's boot-noise band (this very
 * suite measured ~10.1s standalone on 2026-07-27 and reported 8 SKIPPED with
 * one green vacuity guard; under gate load the class measures 8.6-20.7s), so an
 * untimed — or tuned — hook goes FLAKY red and the tests it feeds never
 * execute. This replaces a 30000ms that was tuned to that measurement, the
 * exact brittleness that already bit surveyorProbeTierSql. Never tune it again;
 * generous is the point. Kept in step with the sibling suites
 * (tierCreditMultiplierSql, surveyorProbeTierSql) and enforced by
 * tests/security/pgliteHookTimeoutRatchet.test.js.
 */
const PGLITE_BOOT_TIMEOUT_MS = 180_000;

describe.runIf(haveMigration)('surveyor BYOK key-health — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    const src = readFileSync(MIG_144, 'utf-8');
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create table public.surveyor_byok_keys (
        user_id uuid not null,
        provider text not null default 'anthropic',
        ciphertext bytea not null,
        created_at timestamptz not null default now(),
        rotated_at timestamptz not null default now(),
        health text not null default 'unverified'
          check (health in ('unverified','healthy','out_of_credit','invalid','rate_limited','down')),
        last_verified_at timestamptz,
        last_checked_at timestamptz,
        last_error_class text,
        primary key (user_id, provider)
      );
      create table public.ai_operation_log (
        id uuid primary key default gen_random_uuid(),
        user_id uuid, feature text not null, audience text not null,
        prompt_hash text not null, answer_hash text,
        retrieval_slice_ids text[] not null default '{}',
        retrieval_sources text[] not null default '{}',
        model text, model_version text, provider text,
        byok boolean not null default false, citation_coverage numeric,
        claim_count integer, refused boolean not null default false,
        spend_id uuid, created_at timestamptz not null default now(),
        canary text, meta_probe boolean not null default false, refusal_class text
      );
    `);
    await db.exec(extractFn(src, 'surveyor_byok_set_health'));
    await db.exec(extractFn(src, 'surveyor_byok_status'));
    await db.exec(extractFn(src, 'write_ai_operation_log'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec('truncate public.surveyor_byok_keys; truncate public.ai_operation_log;');
    await asUser(UID);
  });

  describe('surveyor_byok_set_health', () => {
    it('healthy stamps BOTH last_verified_at and last_checked_at and clears the error class', async () => {
      await insertKey(UID, 'anthropic', 'invalid');
      await db.query(`update public.surveyor_byok_keys set last_error_class = 'invalid' where user_id = $1`, [UID]);
      expect(await setHealth(UID, 'anthropic', 'healthy', null, true)).toBe(true);
      const row = await scalar('select * from public.surveyor_byok_keys where user_id = $1', [UID]);
      expect(row.health).toBe('healthy');
      expect(row.last_verified_at).not.toBeNull();
      expect(row.last_checked_at).not.toBeNull();
      expect(row.last_error_class).toBeNull();
    });

    it('a failure class stamps last_checked_at but NEVER last_verified_at, and records the class', async () => {
      await insertKey(UID, 'anthropic', 'unverified');
      expect(await setHealth(UID, 'anthropic', 'out_of_credit', 'out_of_credit')).toBe(true);
      const row = await scalar('select * from public.surveyor_byok_keys where user_id = $1', [UID]);
      expect(row.health).toBe('out_of_credit');
      expect(row.last_verified_at).toBeNull();          // never verified on a failure
      expect(row.last_checked_at).not.toBeNull();
      expect(row.last_error_class).toBe('out_of_credit');
    });

    it('rejects an invalid health class', async () => {
      await insertKey(UID);
      await expect(setHealth(UID, 'anthropic', 'exploded')).rejects.toThrow(/invalid byok health/i);
    });

    it('is a no-op (false) when the user has no key row for that provider', async () => {
      expect(await setHealth(UID, 'anthropic', 'healthy', null, true)).toBe(false);
    });
  });

  describe('surveyor_byok_status', () => {
    it('returns the caller OWN health WITHOUT the ciphertext, and never another user\'s row', async () => {
      await insertKey(UID, 'anthropic', 'healthy');
      await insertKey(UID2, 'anthropic', 'invalid');
      await asUser(UID);
      const rows = await status();
      expect(rows).toHaveLength(1);
      expect(rows[0].provider).toBe('anthropic');
      expect(rows[0].has_key).toBe(true);
      expect(rows[0].health).toBe('healthy');
      // the composite returns no ciphertext column at all
      expect(Object.keys(rows[0])).not.toContain('ciphertext');
    });
  });

  describe('write_ai_operation_log — the refusal_class receipt', () => {
    it('persists refusal_class for a refused/failed turn', async () => {
      await db.query(
        `select public.write_ai_operation_log(
           $1,'analysis','dm','ph', null, '{}', '{}', 'm','mv','anthropic',
           true, null, null, true, null, false, null, 'out_of_credit')`,
        [UID],
      );
      const row = await scalar('select refused, refusal_class, byok from public.ai_operation_log where user_id = $1', [UID]);
      expect(row.refused).toBe(true);
      expect(row.refusal_class).toBe('out_of_credit');
      expect(row.byok).toBe(true);
    });

    it('normalizes a blank refusal_class to null (success turn carries none)', async () => {
      await db.query(
        `select public.write_ai_operation_log(
           $1,'analysis','dm','ph','ah', '{}', '{}', 'm','mv','anthropic',
           false, 1, 0, false, null, false, null, '   ')`,
        [UID],
      );
      const row = await scalar('select refusal_class from public.ai_operation_log where user_id = $1', [UID]);
      expect(row.refusal_class).toBeNull();
    });
  });

  describe('SOURCE PIN — surveyor_byok_set resets health on set/rotate', () => {
    it('the set body writes health = \'unverified\' on both insert and on-conflict update', () => {
      const body = extractFn(readFileSync(MIG_144, 'utf-8'), 'surveyor_byok_set');
      // insert path plants 'unverified'; conflict path re-plants it (a rotated key re-proves).
      expect(body).toMatch(/health\s*=\s*'unverified'/);
      expect(body).toMatch(/last_verified_at\s*=\s*null/);
      expect(body).toMatch(/on conflict/i);
    });
  });
});
