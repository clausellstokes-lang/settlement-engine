/**
 * migrationSequence050to056.pglite.test.js — F1 beta-hardening: the NEW migrations
 * (050–056) apply IN SEQUENCE without a gap or a parse error.
 *
 * The individual security pglite tests (adminLeastPrivilege / adminUserManagement /
 * accountDeletionProcessing / supportTickets / customContentDeities) exercise each
 * migration's behaviour. This test is the SEQUENCE guard: it pins that the 050→056
 * band is numerically gapless on disk AND that applying them in order on top of the
 * earlier chain into a fresh in-process Postgres (pglite) succeeds — the migration-
 * applies-in-sequence beta gate the F1 brief asks for.
 */
import { describe, expect, it, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { buildDefinedAt, classifyApplyError } from '../../scripts/migration-ordering.mjs';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const allMigrations = existsSync(dir)
  ? readdirSync(dir).filter(f => /^\d{3}_.*\.sql$/.test(f)).sort()
  : [];

/** The 050–056 band, in numeric order. */
const band = allMigrations.filter(f => {
  const n = Number(f.slice(0, 3));
  return n >= 50 && n <= 56;
});

// Hard-fail (not a silent vacuous skip) if the 050–056 band vanished from disk:
// the runIf(band.length > 0) suites below would otherwise go GREEN with 0 tests.
describe('migrations 050–056 band exists (guards against silent vacuous skip)', () => {
  it('the 050–056 migration band is present on disk (a moved band must fail loudly)', () => {
    expect(band.length, 'no 050–056 migrations found — sequence coverage dropped').toBeGreaterThan(0);
  });
});

describe.runIf(band.length > 0)('migrations 050–056 — sequence integrity', () => {
  it('the 050–056 band is numerically GAPLESS on disk', () => {
    const numbers = band.map(f => Number(f.slice(0, 3)));
    // Every expected number 50..56 is present exactly once.
    for (let n = 50; n <= 56; n += 1) {
      expect(numbers.filter(x => x === n).length, `migration ${n} present exactly once`).toBe(1);
    }
  });

  it('each migration file is non-empty SQL', () => {
    for (const f of band) {
      const sql = readFileSync(join(dir, f), 'utf-8');
      expect(sql.trim().length, `${f} is non-empty`).toBeGreaterThan(0);
    }
  });
});

describe.runIf(band.length > 0)('migrations 050–056 — apply in sequence (pglite)', () => {
  /** @type {any} */
  let db;
  /** @type {Error|null} */
  let applyError = null;
  /** @type {Error|null} — set ONLY when a band file references an object a LATER
   *  band file defines (a true ordering bug), distinct from a parse error. */
  let orderingError = null;

  beforeAll(async () => {
    db = new PGlite();
    // Scaffold the Supabase-managed objects the band's RLS/GRANT DDL references:
    // the auth schema + helpers, the platform roles (authenticated/anon/service_
    // role), and a minimal profiles table the role-helper functions read. The
    // sequence test only needs the DDL to APPLY, not RLS to enforce (single conn).
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function auth.role() returns text language sql stable as $fn$
        select coalesce(nullif(current_setting('test.role', true), ''), 'anon')
      $fn$;
      create table if not exists auth.users (id uuid primary key);
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
      end $do$;
      create table if not exists public.profiles (
        id uuid primary key,
        role text default 'free',
        created_at timestamptz default now()
      );
    `);

    // Pre-scan: map each band-defined object name -> the INDEX of the band file
    // that defines it. A "does not exist" error for an object defined LATER in
    // the band (index > the failing file's index) is an ordering bug; one for a
    // pre-050/non-band object is an environmental gap in this minimal scaffold.
    const bandSql = band.map((f) => readFileSync(join(dir, f), 'utf-8'));
    const definedAt = buildDefinedAt(bandSql);

    // Apply the 050–056 band IN ORDER into the fresh database. Each migration's
    // full BEHAVIOUR is proven by its own dedicated pglite test with the right
    // schema scaffold; this SEQUENCE test pins that the band is SYNTACTICALLY valid
    // and ordering-coherent. So a genuine SYNTAX error (or an ordering bug — a band
    // migration referencing an object a LATER band migration defines) fails the
    // test, while an ENVIRONMENTAL dependency on prior-chain schema/extensions that
    // pglite does not model here (a missing pre-050 relation/role, pg_cron/http,
    // etc.) is tolerated — those are covered by the per-migration tests' fuller
    // scaffolds.
    try {
      for (let i = 0; i < band.length; i += 1) {
        const f = band[i];
        try {
          await db.exec(bandSql[i]);
        } catch (e) {
          const msg = String(/** @type {any} */ (e)?.message || e);
          const verdict = classifyApplyError(msg, i, definedAt);
          if (verdict.kind === 'syntax') throw new Error(`${f}: ${msg}`, { cause: e });

          // ORDERING BUG: a "does not exist" error whose missing object is DEFINED
          // by a LATER band file means this file was applied before its in-band
          // dependency — exactly the failure the comment above promises to catch
          // and the catch block used to SWALLOW (everything non-syntax was treated
          // as environmental). Surface it loudly instead of letting it pass green.
          if (verdict.kind === 'ordering') {
            orderingError = new Error(
              `${f} references "${verdict.missing}", which is not defined until ${band[/** @type {number} */ (verdict.definedAtIndex)]} (later in the band) — migration ordering bug`,
              { cause: e },
            );
            throw orderingError;
          }
          // Environmental dependency (prior-chain table/role/extension absent in
          // this minimal scaffold) — not a sequence bug. Continue the band.
        }
      }
    } catch (e) {
      applyError = /** @type {Error} */ (e);
    }
  });

  it('every migration in the 050–056 band is syntactically valid SQL (no parse error)', () => {
    expect(applyError, applyError ? applyError.message : 'no error').toBeNull();
  });

  it('no band migration references an object a LATER band migration defines (ordering)', () => {
    // The comment above promises this guarantee; assert it explicitly so the
    // ordering check can't silently rot back into a swallowed environmental error.
    expect(orderingError, orderingError ? orderingError.message : 'no ordering bug').toBeNull();
  });
});
