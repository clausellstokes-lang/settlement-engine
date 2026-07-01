/**
 * migrationSequenceAll.pglite.test.js — the migrations apply IN SEQUENCE,
 * across the WHOLE chain (001→HEAD), without a gap, a parse error, or an
 * in-chain forward reference.
 *
 * History: this started as migrationSequence050to056.pglite.test.js, frozen at
 * the F1 beta band (050–056). That froze the sequence guarantee at a stale
 * window — every migration since (057→087, including the money-path 084–087) was
 * shipping with no sequence coverage at all. This now iterates EVERY NNN_*.sql
 * on disk in numeric order, so a new migration is sequence-tested the moment it
 * lands instead of waiting for someone to widen a hard-coded band.
 *
 * The individual security pglite tests (adminLeastPrivilege / adminUserManagement /
 * accountDeletionProcessing / supportTickets / customContentDeities / …) exercise
 * each migration's BEHAVIOUR with a fuller scaffold. This is the SEQUENCE guard:
 * it pins that the chain is numerically gapless on disk AND that applying the
 * files in order into a fresh in-process Postgres (pglite) raises no SYNTAX error
 * and no in-chain ORDERING bug (a file referencing an object a LATER file
 * defines). Dependencies on Supabase-managed schema/extensions pglite does not
 * model here (pg_cron, http, storage, vault, a pre-existing relation/role) are
 * classified ENVIRONMENTAL and tolerated — those paths are covered by the
 * per-migration tests' fuller scaffolds.
 */
import { describe, expect, it, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { buildDefinedAt, classifyApplyError, definedObjects } from '../../scripts/migration-ordering.mjs';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
/** Every NNN_*.sql migration on disk, in numeric (== lexicographic, zero-padded) order. */
const allMigrations = existsSync(dir)
  ? readdirSync(dir).filter(f => /^\d{3}_.*\.sql$/.test(f)).sort()
  : [];

// The whole chain is the band now. Named `band` so the apply-loop below reads
// the same as the per-migration tests it grew out of.
const band = allMigrations;

// Hard-fail (not a silent vacuous skip) if the migrations vanished from disk:
// the runIf(band.length > 0) suites below would otherwise go GREEN with 0 tests.
describe('migration chain exists (guards against silent vacuous skip)', () => {
  it('at least one NNN_*.sql migration is present on disk (a moved tree must fail loudly)', () => {
    expect(band.length, 'no NNN_*.sql migrations found — sequence coverage dropped').toBeGreaterThan(0);
  });
});

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('migration chain present (suite not vacuous)', () => {
  expect(band.length).toBeGreaterThan(0);
});

describe.runIf(band.length > 0)('migration chain — sequence integrity', () => {
  it('the chain is numerically GAPLESS on disk (001→HEAD, each number exactly once)', () => {
    const numbers = band.map(f => Number(f.slice(0, 3)));
    const max = Math.max(...numbers);
    // Every number from the first present through the highest must appear exactly
    // once — a gap (a deleted/renumbered migration) or a duplicate fails loudly.
    const min = Math.min(...numbers);
    for (let n = min; n <= max; n += 1) {
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

describe.runIf(band.length > 0)('migration chain — apply in sequence (pglite)', () => {
  /** @type {any} */
  let db;
  /** @type {Error|null} */
  let applyError = null;
  /** @type {Error|null} — set ONLY when a file references an object a LATER file
   *  in the chain defines (a true ordering bug), distinct from a parse error. */
  let orderingError = null;

  beforeAll(async () => {
    db = new PGlite();
    // Scaffold the Supabase-managed objects the chain's RLS/GRANT DDL references:
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

    // Pre-scan: map each chain-defined object name -> the INDEX of the file that
    // defines it. A "does not exist" error for an object defined LATER in the
    // chain (index > the failing file's index) is an ordering bug; one for a
    // pre-chain/unmodelled object is an environmental gap in this scaffold.
    const bandSql = band.map((f) => readFileSync(join(dir, f), 'utf-8'));
    const definedAt = buildDefinedAt(bandSql);

    // Apply the WHOLE chain IN ORDER into the fresh database. Each migration's
    // full BEHAVIOUR is proven by its own dedicated pglite test with the right
    // schema scaffold; this SEQUENCE test pins that the chain is SYNTACTICALLY
    // valid and ordering-coherent. A genuine SYNTAX error (or an ordering bug — a
    // file referencing an object a LATER file defines) fails the test, while an
    // ENVIRONMENTAL dependency on prior-chain schema/extensions pglite does not
    // model here (a missing relation/role, pg_cron/http/storage/vault, etc.) is
    // tolerated — those are covered by the per-migration tests' fuller scaffolds.
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
          // by a LATER chain file means this file was applied before its in-chain
          // dependency — exactly the failure the comment above promises to catch
          // and the original catch block used to SWALLOW (everything non-syntax
          // was treated as environmental). Surface it loudly instead of green.
          if (verdict.kind === 'ordering') {
            orderingError = new Error(
              `${f} references "${verdict.missing}", which is not defined until ${band[/** @type {number} */ (verdict.definedAtIndex)]} (later in the chain) — migration ordering bug`,
              { cause: e },
            );
            throw orderingError;
          }
          // Environmental dependency (prior-chain table/role/extension absent in
          // this minimal scaffold) — not a sequence bug. Continue the chain.
        }
      }
    } catch (e) {
      applyError = /** @type {Error} */ (e);
    }
  });

  it('every migration in the chain is syntactically valid SQL (no parse error)', () => {
    expect(applyError, applyError ? applyError.message : 'no error').toBeNull();
  });

  it('no migration references an object a LATER migration defines (ordering)', () => {
    // The comment above promises this guarantee; assert it explicitly so the
    // ordering check can't silently rot back into a swallowed environmental error.
    expect(orderingError, orderingError ? orderingError.message : 'no ordering bug').toBeNull();
  });
});

// ── Finding (2) regression guard: definedObjects recognises every CREATE-able
// object kind, not just function + table. A type/view/sequence/domain/
// materialized-view defined LATER in the chain is exactly the kind of forward
// reference the ordering check exists to catch — but the old classifier regex
// saw only function|table, so such a reference was mis-classified ENVIRONMENTAL
// and swallowed. These assertions FAIL against the old regex and PASS once it
// recognises type|view|sequence|domain|materialized view. ───────────────────
describe('migration-ordering classifier recognises every CREATE-able object kind', () => {
  it('definedObjects extracts type / view / sequence / domain / materialized view names', () => {
    const sql = `
      create type public.ticket_status as enum ('open', 'closed');
      create view public.active_tickets as select 1;
      create sequence public.account_number_seq;
      create domain public.positive_int as int check (value > 0);
      create materialized view public.daily_rollup as select 1;
      create or replace function public.fn() returns void language sql as $$ select 1 $$;
      create table if not exists public.tbl (id uuid primary key);
    `;
    expect(definedObjects(sql).sort()).toEqual([
      'account_number_seq',
      'active_tickets',
      'daily_rollup',
      'fn',
      'positive_int',
      'tbl',
      'ticket_status',
    ]);
  });

  it('a "materialized view" parses as the view name, not the literal "materialized"', () => {
    // Ordered alternation must prefer `materialized view` over the bare `view`,
    // else the name captured would be "view" (from `materialized VIEW name`).
    expect(definedObjects('create materialized view public.mv_foo as select 1;')).toEqual(['mv_foo']);
  });
});
