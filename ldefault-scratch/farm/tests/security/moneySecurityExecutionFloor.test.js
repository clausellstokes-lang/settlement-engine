/**
 * moneySecurityExecutionFloor.test.js — A+ tests-tooling.5.
 *
 * "Coverage floor on money/security globs" — but for THIS codebase a vitest
 * line-coverage threshold is the wrong instrument. The money/security CORRECTNESS
 * does not live in the client wrappers (creditLedger.js, creditsSlice.js,
 * authSlice.js are thin shells over Postgres RPCs and are ~15% line-covered by
 * design — they are exercised through integration/E2E, not unit tests). It lives
 * in the DATABASE RPCs and the EDGE FUNCTIONS, and that is covered by EXECUTION
 * tests:
 *
 *   - tests/security/creditLedger.pglite.test.js     — spend/refund/grant RPCs run
 *                                                       against a real Postgres (pglite)
 *   - tests/security/profileEscalation.pglite.test.js — column-lock RLS, FORCE RLS,
 *                                                       privilege-escalation rejected
 *   - supabase/functions/stripe-webhook/index.test.ts — forged webhook → 400 + zero
 *                                                       writes; signed → upgrade
 *   - supabase/functions/generate-narrative/refundPolicy.test.ts — the refund decision
 *
 * The real "floor" is therefore that these execution suites cannot be silently
 * DELETED or hollowed out — that is what would actually drop money/security
 * coverage. This pin asserts each exists and is non-trivial. (A line-% gate would
 * either ratchet in the ~15% noise or demand client unit tests for logic that is
 * genuinely server-side — see vite.config.js's note on why coverage thresholds
 * are not in the default gate.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Each entry: the execution test that floors a money/security path, plus a
// substring that must appear so the file can't be reduced to an empty stub.
const FLOOR = [
  { path: 'tests/security/creditLedger.pglite.test.js', mustContain: 'spend_credits', label: 'credit ledger RPCs (spend/refund/grant)' },
  { path: 'tests/security/profileEscalation.pglite.test.js', mustContain: 'role', label: 'profile column-lock RLS / privilege escalation' },
  { path: 'supabase/functions/stripe-webhook/index.test.ts', mustContain: 'signature', label: 'stripe-webhook trust boundary (forged → 400, zero writes)' },
  { path: 'supabase/functions/generate-narrative/refundPolicy.test.ts', mustContain: 'shouldRefundOnFailure', label: 'generate-narrative refund decision' },
];

describe('tests-tooling.5 — money/security execution-coverage floor', () => {
  for (const { path, mustContain, label } of FLOOR) {
    it(`exists and is non-trivial: ${label} (${path})`, () => {
      const abs = join(ROOT, path);
      expect(existsSync(abs), `${path} is missing — money/security execution coverage dropped`).toBe(true);
      const src = readFileSync(abs, 'utf8');
      // Non-trivial: real bytes + at least a few test/assert calls + the anchor.
      expect(statSync(abs).size, `${path} is suspiciously small`).toBeGreaterThan(400);
      const testCount = (src.match(/\b(it|test|Deno\.test)\s*\(/g) || []).length;
      expect(testCount, `${path} has too few test cases (${testCount})`).toBeGreaterThanOrEqual(3);
      expect(src, `${path} no longer exercises ${mustContain}`).toContain(mustContain);
    });
  }

  it('the floor list itself stays non-trivial (guards against quietly emptying it)', () => {
    expect(FLOOR.length).toBeGreaterThanOrEqual(4);
  });
});
