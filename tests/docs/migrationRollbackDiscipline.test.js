import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';

/**
 * Migration rollback discipline (audit: "no SQL down/rollback exists — the scariest
 * operational gap"). Supabase migrations are forward-only. This pins the reversal
 * discipline: a runbook, data-safe reversals for the schema-additive money migrations,
 * and a FORWARD contract that any NEW money/PII migration ships a reversal or an
 * explicit `-- @rollback:` note — so reversibility is tracked, not discovered mid-incident.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ROLLBACK = join(root, 'supabase/rollback');
const MIGRATIONS = join(root, 'supabase/migrations');

const migrationFiles = () => readdirSync(MIGRATIONS).filter((f) => /^\d+.*\.sql$/.test(f));
const migNum = (f) => Number.parseInt(f.match(/^(\d+)/)[1], 10);

describe('migration rollback discipline', () => {
  test('the rollback runbook exists and documents the convention', () => {
    const readme = readFileSync(join(ROLLBACK, 'README.md'), 'utf8');
    expect(readme).toMatch(/forward-fix first/i);
    expect(readme).toMatch(/@rollback:/);
  });

  test('every .down.sql reverses a REAL migration and actually drops something', () => {
    const downs = readdirSync(ROLLBACK).filter((f) => f.endsWith('.down.sql'));
    expect(downs.length).toBeGreaterThan(0); // not vacuous
    const nums = new Set(migrationFiles().map(migNum));
    for (const d of downs) {
      const n = Number.parseInt(d.match(/^(\d+)/)?.[1] ?? 'NaN', 10);
      expect(nums.has(n), `${d} targets migration ${n} which does not exist`).toBe(true);
      expect(readFileSync(join(ROLLBACK, d), 'utf8')).toMatch(/drop\s+(trigger|function|index|constraint|table|policy)/i);
    }
  });

  test('the two cleanly-reversible money migrations (087 index, 097 trigger) have reversals', () => {
    expect(existsSync(join(ROLLBACK, '097_enforce_allocation_within_grant.down.sql'))).toBe(true);
    expect(existsSync(join(ROLLBACK, '087_refund_unique_index.down.sql'))).toBe(true);
  });

  // FORWARD CONTRACT: a NEW migration (numbered above the current documented head)
  // that touches a money/PII table must ship a reversal or carry a `-- @rollback:`
  // note. Retroactive migrations are grandfathered — the runbook covers them — so this
  // guards the future without a huge back-fill.
  const MONEY_TABLES = /credit_ledger|credit_spend_allocations|credit_grant_idempotency|ai_spend_reservations|\bprofiles\b|security_answers/;
  const GRANDFATHERED_HEAD = 97;

  test('new money/PII migrations ship a reversal or an explicit @rollback note', () => {
    const downNums = new Set(
      readdirSync(ROLLBACK).filter((f) => f.endsWith('.down.sql')).map((f) => Number.parseInt(f.match(/^(\d+)/)?.[1] ?? 'NaN', 10)),
    );
    const offenders = [];
    for (const f of migrationFiles()) {
      const n = migNum(f);
      if (n <= GRANDFATHERED_HEAD) continue; // grandfathered — covered by the runbook
      const src = readFileSync(join(MIGRATIONS, f), 'utf8');
      if (!MONEY_TABLES.test(src)) continue; // not money/PII — no reversal required
      const hasNote = /--\s*@rollback:/i.test(src);
      if (!hasNote && !downNums.has(n)) offenders.push(f);
    }
    expect(
      offenders,
      `these money/PII migrations need a supabase/rollback/<n>_*.down.sql or a '-- @rollback:' note:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });
});
