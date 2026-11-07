/**
 * tests/domain/facts/keptRefused.test.js — CENSUS-1g unit 2 (R-AM): A KEPT-REFUSED ORIGINAL IS
 * LEDGERED. `resolveSibling` keeps its original when no twin is admitted (or the record is
 * unanswered), and a `keepRefused` site keeps its drawn line when nothing is admitted; both now
 * note that line with its atoms (`resolvedBy: 'kept'`) so the birth self-check sees it. Nothing
 * printed changes.
 *
 * @enforced-by npx vitest run tests/domain/facts/keptRefused.test.js
 */
import { describe, expect, it } from 'vitest';
import { drawDeclared, resolveSibling } from '../../../src/domain/facts/drawDeclared.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../../src/domain/facts/presumptionCheck.js';

const SET = Object.freeze({ 'The gate is shut.': Object.freeze([{ text: 'The gate is shut.', needs: ['gate'] }]) });
const PAIR = Object.freeze({
  'The gate is shut.': Object.freeze([
    { text: 'The gate is shut.', needs: ['gate'] },
    { text: 'The lane stands empty.', twinOf: 'The gate is shut.', excludes: ['gate'] },
  ]),
});
const noGate = { defence: { gate: false } };
const withGate = { defence: { gate: true } };

describe('resolveSibling notes the original it keeps (R-AM)', () => {
  it('refused with no twin: kept, noted with its atoms', () => {
    const { result, ledger } = withPresumptionLedger(() => resolveSibling('The gate is shut.', SET, { facts: noGate, poolId: 'p', surface: 's' }));
    expect(result).toBe('The gate is shut.');
    expect(ledger).toEqual([expect.objectContaining({ pool: 'p', atoms: ['gate'], resolvedBy: 'kept' })]);
  });
  it('unanswered (no facts): kept, noted with its atoms', () => {
    const { result, ledger } = withPresumptionLedger(() => resolveSibling('The gate is shut.', SET, { facts: null, poolId: 'p', surface: 's' }));
    expect(result).toBe('The gate is shut.');
    expect(ledger).toEqual([expect.objectContaining({ atoms: ['gate'], resolvedBy: 'kept' })]);
  });
  it('admitted or twinned: noted as before, never as kept', () => {
    const a = withPresumptionLedger(() => resolveSibling('The gate is shut.', PAIR, { facts: withGate, poolId: 'p', surface: 's' }));
    expect(a.ledger.map((e) => e.resolvedBy)).toEqual(['drawn']);
    const b = withPresumptionLedger(() => resolveSibling('The gate is shut.', PAIR, { facts: noGate, poolId: 'p', surface: 's' }));
    expect(b.result).toBe('The lane stands empty.');
    expect(b.ledger.map((e) => e.resolvedBy)).toEqual(['twin']);
  });
  it('a line that is no key is neither resolved nor noted', () => {
    const { ledger } = withPresumptionLedger(() => resolveSibling('Other.', SET, { facts: noGate, poolId: 'p', surface: 's' }));
    expect(ledger).toEqual([]);
  });
});

describe('drawDeclared with keepRefused (R-AM)', () => {
  const pool = Object.freeze([{ text: 'The gate is shut.', needs: ['gate'] }]);
  it('keeps the refused drawn line and notes it; without the option the slot empties, unnoted', () => {
    const kept = withPresumptionLedger(() => drawDeclared(pool, { draw: (p) => p[0], facts: noGate, poolId: 'p', keepRefused: true }));
    expect(kept.result).toMatchObject({ text: 'The gate is shut.', resolvedBy: 'kept', refused: ['gate'] });
    expect(kept.ledger).toEqual([expect.objectContaining({ atoms: ['gate'], resolvedBy: 'kept' })]);
    const emptied = withPresumptionLedger(() => drawDeclared(pool, { draw: (p) => p[0], facts: noGate, poolId: 'p' }));
    expect(emptied.result).toMatchObject({ line: null, resolvedBy: 'none' });
    expect(emptied.ledger).toEqual([]);
  });
});

describe('the self-check sees a kept-refused line', () => {
  it('a kept line whose atom the final record refuses is a false presumption', () => {
    const { ledger } = withPresumptionLedger(() => resolveSibling('The gate is shut.', SET, { facts: noGate, poolId: 'p', surface: 's' }));
    const record = { institutions: [], defenseProfile: {} };
    expect(presumptionFindings(record, ledger).map((f) => f.atom)).toEqual(['gate']);
  });
});

describe('a description resolved where it is CHOSEN, not inside its table (CENSUS-1g unit 2b)', () => {
  it('soak1k-0 notes no kept FACTION_DESC line (its eager governing table noted a line no birth printed)', async () => {
    const { birth, ensureLaws } = await import('../../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    const { ledger } = withPresumptionLedger(() => birth(0));
    expect(ledger.filter((e) => e.pool === 'rulingStructure:FACTION_DESC_SIBLINGS' && e.resolvedBy === 'kept')).toEqual([]);
  }, 60_000);
});
