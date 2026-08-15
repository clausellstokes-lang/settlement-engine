/**
 * publicTableRlsCensus.test.js — THE WHOLE-SCHEMA RLS CENSUS (bar-6 security, C4).
 *
 * The completeness wall for Row-Level Security, the table analogue of
 * verifyJwtPins.test.js (which enumerates EVERY edge function and requires an
 * explicit gate). Supabase exposes public tables through PostgREST under default
 * grants, so a `create table public.<x> (…)` that omits `enable row level security`
 * is world-readable/writable to anon+authenticated. No gate enumerated the schema to
 * require RLS-enable: denyAllRlsCensus pins a hand-list, the per-table pglite suites
 * cover only named tables, and migrationSequenceAll tolerates RLS gaps.
 *
 * THE WALL: enumerate EVERY `create table public.<name>` across all migrations and
 * require a matching `alter table [only] public.<name> … enable row level security`
 * SOMEWHERE in the migration set (RLS may be enabled in a later migration than the
 * create). A future migration that adds a public table and forgets RLS reds here —
 * the unauthorized-access class loses its habitat.
 *
 * EXEMPT is empty by design: every one of the 70 public tables enables RLS today. A
 * table that genuinely must stay RLS-off (none exists) is added here WITH a written
 * reason — never by weakening the scan. This is a pure source census (no pglite), so
 * it is fast and file-parallelism-safe.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const files = readdirSync(MIG_DIR).filter((f) => f.endsWith('.sql')).sort();
// Concatenate + lowercase: RLS-enable for a table can live in a later migration than
// its create, and SQL is case-insensitive for these keywords/identifiers.
const SRC = files.map((f) => readFileSync(join(MIG_DIR, f), 'utf8')).join('\n').toLowerCase();

/** Every `create table [if not exists] public.<name>` across the migration set. */
function createdPublicTables(src) {
  const set = new Set();
  for (const m of src.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?public\.("?)([a-z0-9_]+)\1/g)) {
    set.add(m[2]);
  }
  return [...set].sort();
}

/** True iff the table has `alter table [only] public.<name> … enable row level
 *  security` anywhere — tolerant of newlines/whitespace between the name and enable. */
function rlsEnabled(src, table) {
  return new RegExp(`alter\\s+table\\s+(?:only\\s+)?public\\.${table}\\s+enable\\s+row\\s+level\\s+security`).test(src);
}

// RLS-off exemptions: [table, why]. EMPTY — every public table enables RLS today. A
// real exemption is added here with a written reason, never by loosening the scan.
const EXEMPT = new Map([]);

const TABLES = createdPublicTables(SRC);

describe('whole-schema RLS census — every public table enables Row-Level Security', () => {
  it('the scan found the schema (guard-the-guard: not a vacuous pass)', () => {
    // If the create-table regex broke, TABLES would be near-empty and the census below
    // would pass vacuously. There are ~70 public tables today.
    expect(TABLES.length).toBeGreaterThanOrEqual(60);
  });

  it.each(TABLES)('public.%s enables Row-Level Security (or is an explicit exemption)', (table) => {
    if (EXEMPT.has(table)) {
      expect(EXEMPT.get(table), `exemption for ${table} must carry a reason`).toBeTruthy();
      return;
    }
    expect(
      rlsEnabled(SRC, table),
      `public.${table} is created but never gets 'enable row level security' — PostgREST `
      + `exposes it to anon/authenticated under default grants. Enable RLS in its migration, `
      + `or add an EXEMPT entry with a written reason.`,
    ).toBe(true);
  });

  it('the RLS detector rejects a no-RLS table and accepts a multi-line enable (self-check)', () => {
    const withRls = 'create table public.foo (id uuid);\nalter table public.foo\n  enable row level security;';
    const noRls = 'create table public.bar (id uuid);';
    expect(rlsEnabled(withRls.toLowerCase(), 'foo')).toBe(true);
    expect(rlsEnabled(noRls.toLowerCase(), 'bar')).toBe(false);
  });
});
