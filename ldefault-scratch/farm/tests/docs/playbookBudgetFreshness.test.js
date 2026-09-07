/**
 * Freshness walker for the execution playbook's STANDING sections (docs-knowledge-3).
 *
 * The playbook's §0.0.2 budget bullet used to TRANSCRIBE the first-paint budget
 * (CLOSURE_BUDGET_BYTES) as a literal. Every ratchet-down then re-staled it — the
 * exact "refresh, don't de-duplicate → re-rot" mechanism that bit round-1's
 * repair. The durable fix removed the literal and pointed at the code const; this
 * pin makes the re-rot impossible to merge silently: any present-tense
 * `CLOSURE_BUDGET_BYTES = <number>` claim anywhere in the playbook must equal the
 * live const.
 *
 * SCOPE NOTE: this deliberately matches only the present-tense `= <number>` form,
 * NOT the §0.0.1 ledger's historical phrasings ("budget 1,255,985", "RATCHETED
 * DOWN X → Y"). The ledger is append-only law and legitimately records past budget
 * values; it must never trip this guard.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(resolve(here, rel), 'utf8');

/** The live first-paint budget const, parsed from the ratchet test. */
function codeBudgetConst() {
  const src = read('../build/vendorPdfLazy.test.js');
  const m = src.match(/const CLOSURE_BUDGET_BYTES\s*=\s*([\d_]+)/);
  if (!m) throw new Error('CLOSURE_BUDGET_BYTES const not found in vendorPdfLazy.test.js');
  return Number(m[1].replace(/_/g, ''));
}

/** Present-tense `CLOSURE_BUDGET_BYTES = <number>` claims in a doc → numbers. */
function budgetConstClaims(text) {
  return [...text.matchAll(/CLOSURE_BUDGET_BYTES\s*=\s*([\d,_]+)/g)].map((m) =>
    Number(m[1].replace(/[,_]/g, '')),
  );
}

describe('playbook budget claims cannot drift from the code const (docs-knowledge-3)', () => {
  const budget = codeBudgetConst();
  const playbook = read('../../docs/PHASE55_EXECUTION_PLAYBOOK.md');

  it('reads a plausible budget const from code', () => {
    expect(budget).toBeGreaterThan(500_000);
    expect(budget).toBeLessThan(2_000_000);
  });

  it('the claim matcher is non-vacuous (catches a stale literal)', () => {
    // Proves the guard works even when the live doc has zero such claims.
    expect(budgetConstClaims('first-paint CLOSURE_BUDGET_BYTES = 1,255,985 (stale)')).toEqual([
      1_255_985,
    ]);
    expect(budgetConstClaims('see the CLOSURE_BUDGET_BYTES const')).toEqual([]);
  });

  it('every present-tense CLOSURE_BUDGET_BYTES = N claim equals the live const', () => {
    for (const n of budgetConstClaims(playbook)) {
      expect(
        n,
        `The playbook quotes CLOSURE_BUDGET_BYTES = ${n} but the live const is ${budget}. ` +
          `Point standing sections at the const (tests/build/vendorPdfLazy.test.js) — do not ` +
          `transcribe the number (that is how §0.0.2 re-rotted).`,
      ).toBe(budget);
    }
  });
});
