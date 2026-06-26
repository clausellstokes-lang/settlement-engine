/**
 * migrationOrdering.test.js — proves the migration-ordering classifier actually
 * CATCHES an out-of-order band, against a SYNTHETIC scenario.
 *
 * Why this exists: migrationSequenceAll.pglite.test.js asserts the REAL
 * migration chain has no ordering bug — but that real chain is correctly ordered, so
 * that assertion would pass even if the detection logic were broken (it would
 * "find no bug" because it can't find any bug at all). That is test theater for
 * the DETECTION path. This file forges a band where migration A references a
 * function migration B defines LATER, applies it through the same
 * classifyApplyError() the sequence test uses, and asserts the ordering bug is
 * flagged — so reverting the classifier (back to swallowing every non-syntax
 * error as "environmental") turns these tests RED.
 */
import { describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import {
  definedObjects,
  missingObjectName,
  buildDefinedAt,
  classifyApplyError,
} from '../../scripts/migration-ordering.mjs';

// ── pure helpers ────────────────────────────────────────────────────────────
describe('migration-ordering — pure helpers', () => {
  it('definedObjects extracts function + table names (qualified or not, idempotent forms)', () => {
    const sql = `
      create or replace function public.foo() returns void language sql as $$ select 1 $$;
      create table if not exists public.bar (id uuid primary key);
      create function baz() returns int language sql as $$ select 2 $$;
    `;
    expect(definedObjects(sql).sort()).toEqual(['bar', 'baz', 'foo']);
  });

  it('missingObjectName pulls the bare name out of the common PG phrasings', () => {
    expect(missingObjectName('function public.write_audit(text) does not exist')).toBe('write_audit');
    expect(missingObjectName('relation "public.audit_log" does not exist')).toBe('audit_log');
    expect(missingObjectName('type "ticket_status" does not exist')).toBe('ticket_status');
    expect(missingObjectName('something totally unrelated')).toBeNull();
  });

  it('buildDefinedAt keeps the FIRST definition index (a later replace is not the source)', () => {
    const map = buildDefinedAt([
      'create table public.audit_log (id uuid);',           // index 0 defines audit_log
      'create or replace function public.audit_log() ...',  // index 1 re-uses the name
    ]);
    expect(map.get('audit_log')).toBe(0);
  });

  it('classifyApplyError distinguishes syntax / ordering / environmental', () => {
    const definedAt = buildDefinedAt([
      'create function public.early() ...',  // 0
      'create function public.late() ...',   // 1
    ]);
    // Syntax beats everything.
    expect(classifyApplyError('syntax error at or near "creat"', 0, definedAt).kind).toBe('syntax');
    // index-0 file referencing `late` (defined at index 1) → ordering bug.
    const ordering = classifyApplyError('function public.late() does not exist', 0, definedAt);
    expect(ordering.kind).toBe('ordering');
    expect(ordering.missing).toBe('late');
    expect(ordering.definedAtIndex).toBe(1);
    // A "does not exist" for a NON-band object (pre-chain dependency) → environmental.
    expect(classifyApplyError('relation "public.profiles" does not exist', 0, definedAt).kind)
      .toBe('environmental');
    // A reference to an EARLIER band object (already applied) is not an ordering bug.
    expect(classifyApplyError('function public.early() does not exist', 1, definedAt).kind)
      .toBe('environmental');
  });
});

// ── end-to-end: a forged out-of-order band fails through the SAME logic ───────
describe('migration-ordering — forged out-of-order band is caught (anti-theater)', () => {
  // Band file 0 calls helper_b() in a DO block; helper_b() is only defined by
  // band file 1. Applied in order, file 0 raises "function ... does not exist".
  const outOfOrder = [
    `do $$ begin perform public.helper_b(); end $$;`,                                  // 0: uses helper_b
    `create or replace function public.helper_b() returns void language sql as $$ select 1 $$;`, // 1: defines it
  ];

  /** Replays the sequence test's apply loop over a forged band and returns the
   *  first ordering verdict it produces (null if none). Mirrors the production
   *  loop in migrationSequenceAll.pglite.test.js exactly. */
  async function firstOrderingVerdict(bandSql) {
    const db = new PGlite();
    const definedAt = buildDefinedAt(bandSql);
    let ordering = null;
    for (let i = 0; i < bandSql.length; i += 1) {
      try {
        await db.exec(bandSql[i]);
      } catch (e) {
        const msg = String(/** @type {any} */ (e)?.message || e);
        const verdict = classifyApplyError(msg, i, definedAt);
        if (verdict.kind === 'ordering') { ordering = verdict; break; }
      }
    }
    return ordering;
  }

  it('flags the forward reference as an ordering bug (not swallowed as environmental)', async () => {
    const verdict = await firstOrderingVerdict(outOfOrder);
    expect(verdict, 'forged out-of-order band must be flagged as an ordering bug').not.toBeNull();
    expect(verdict.missing).toBe('helper_b');
    expect(verdict.definedAtIndex).toBe(1);
  });

  it('a CORRECTLY ordered band of the same two files raises no ordering bug', async () => {
    const inOrder = [outOfOrder[1], outOfOrder[0]]; // define first, then use
    const verdict = await firstOrderingVerdict(inOrder);
    expect(verdict, 'correctly ordered band must not be flagged').toBeNull();
  });
});
