/**
 * civilityGuard.pglite.test.js — THE TWO MIRRORS, PROVEN EQUAL BY EXECUTION
 * (DESIGN_PROFILE_IMAGE.md §9: "the two mirrors share ONE test-vector file so
 * they can never drift").
 *
 * The design's §9 pin list asks for "shared vectors green on both mirrors" and
 * "the server refuses what a bypassed client submits". Those are claims about
 * SQL, and a source-inspection test could only ever claim the SQL *looks* right.
 * So this loads the real functions from migration 195 into pglite and runs the
 * same shared vector file through BOTH implementations, asserting verdict-for-
 * verdict agreement.
 *
 * Why that matters more than the individual verdicts: the failure mode this
 * feature is most exposed to is not "the guard is wrong", it is "the guard was
 * fixed in one language and not the other" — a client that politely refuses text
 * the server would have accepted, or far worse, a client that accepts text the
 * server then rejects with a raw Postgres error. Equivalence is the property; the
 * vectors are just how it is measured.
 *
 * The functions are self-contained (they read only civility_terms /
 * civility_allow, both created here), so they load verbatim with no stubs — the
 * gallerySanitize.pglite.test.js pattern.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  BLOCKED_VECTORS, CLEAN_VECTORS, } from '../fixtures/civilityVectors.js';
import { checkCivility } from '../../src/lib/civility.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget

const MIGRATION = resolve(
  process.cwd(), 'supabase', 'migrations', '195_civility_guard_and_public_identity.sql',
);

/**
 * Pull ONLY the guard's own objects out of the migration: the two list tables
 * with their seed, and the three functions. The rest of 195 (the profiles
 * column, the forked definers, the storage policies) depends on schema pglite
 * does not have — and none of it is what this test is about.
 */
function guardSql() {
  const src = readFileSync(MIGRATION, 'utf-8');
  const statements = [];

  // ⚠ ANCHORED AT LINE START (^ + m). The unanchored form also matches the header
  // prose that quotes these statement names, which is the recorded
  // unanchored-extractor hazard: it extracts a comment instead of the function
  // and the test then proves nothing at all.
  const fnRe = /^create\s+or\s+replace\s+function\s+public\.(civility_normalize|civility_blocked|_civility_token_hits|_civility_stem_hits)\b[\s\S]*?\n\$\$;/gim;
  const tableRe = /^create\s+table\s+if\s+not\s+exists\s+public\.(civility_terms|civility_allow)[\s\S]*?\);/gim;
  const seedRe = /^insert\s+into\s+public\.civility_terms[\s\S]*?;/gim;

  for (const re of [tableRe, seedRe]) {
    const found = src.match(re) || [];
    statements.push(...found);
  }
  const fns = src.match(fnRe) || [];
  statements.push(...fns);

  return { statements, functionCount: fns.length };
}

const GUARD = guardSql();

describe('the civility guard\'s SERVER mirror, executed', () => {
  /** @type {PGlite} */
  let db;

  beforeAll(async () => {
    // NON-VACUITY: if the extraction silently found nothing, every assertion
    // below would fail confusingly rather than pointing at the real problem.
    expect(GUARD.functionCount, 'all four guard functions must be extracted from migration 195').toBe(4);

    db = new PGlite();
    for (const statement of GUARD.statements) {
      await db.exec(statement);
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  /** @param {string} text */
  async function serverBlocked(text) {
    const result = await db.query('select public.civility_blocked($1) as blocked', [text]);
    return result.rows[0].blocked === true;
  }

  it('seeded the blocklist (the fixture is not empty)', async () => {
    const { rows } = await db.query('select count(*)::int as n from public.civility_terms');
    expect(rows[0].n).toBe(8);
  });

  it('THE SCUNTHORPE SET passes on the server, exactly as on the client', async () => {
    for (const { text, why } of CLEAN_VECTORS) {
      expect(await serverBlocked(text), `server must PASS "${text}" — ${why}`).toBe(false);
    }
  });

  it('THE EVASION SET is blocked on the server, exactly as on the client', async () => {
    for (const { text, why } of BLOCKED_VECTORS) {
      expect(await serverBlocked(text), `server must BLOCK "${text}" — ${why}`).toBe(true);
    }
  });

  it('⚠️ THE ANTI-DRIFT PIN — every vector gets the SAME verdict from both mirrors', async () => {
    // This is the assertion that actually protects the feature. The two tests
    // above could both be satisfied by two implementations that disagree about
    // some vector neither set happens to cover; this one compares them directly,
    // vector by vector, and reports every disagreement at once rather than
    // stopping at the first.
    const disagreements = [];
    for (const { text, why } of [...CLEAN_VECTORS, ...BLOCKED_VECTORS]) {
      const client = checkCivility(text).blocked;
      const server = await serverBlocked(text);
      if (client !== server) {
        disagreements.push(`"${text}" (${why}): client=${client} server=${server}`);
      }
    }
    expect(disagreements, 'the two mirrors must never disagree — one shared vector file, one verdict').toEqual([]);
  });

  it('the server refuses what a bypassed client would have submitted', async () => {
    // §9's fourth pin. A client can always be bypassed — devtools, a script, a
    // stale bundle — so the server check is the one that is load-bearing.
    for (const text of ['shit', 'Sh1t', 's h i t', 'you are a nazi']) {
      expect(await serverBlocked(text), `bypassed submission "${text}" must be refused server-side`).toBe(true);
    }
  });

  it('the allowlist overrides the blocklist, on the server too', async () => {
    // Non-vacuity for the §9 escape hatch: prove it actually has teeth before
    // anyone relies on it to clear a reported false positive.
    expect(await serverBlocked('nazi')).toBe(true);
    await db.exec("insert into public.civility_allow (term) values ('nazi') on conflict do nothing;");
    expect(await serverBlocked('nazi')).toBe(false);
    await db.exec("delete from public.civility_allow where term = 'nazi';");
    expect(await serverBlocked('nazi')).toBe(true);
  });
});
