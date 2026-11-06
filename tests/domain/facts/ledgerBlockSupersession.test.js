/**
 * RUNG-2 LANDING phase D, unit 1 (the chair's R-D1): a replaced pass's notes leave the ledger.
 *
 * When a pass re-derives a block, its notes REPLACE the earlier pass's notes for that block in the
 * presumption ledger — one note set per block, keyed by the block the pass owns, never an
 * accumulation across passes. Rung 2E's `soak1k-1185`, `-1221`, `-2595`: the first economy
 * computation noted `SAFETY_LINE_SIBLINGS`' 'no walls' twin (walls false at the draw);
 * `economyReconcilePass.js` re-derived the economy after walls were added and the record prints the
 * original line — the replaced computation's note survived (`cert:false-presumption`, phase C §9).
 */
import { describe, expect, it } from 'vitest';
import {
  withPresumptionLedger,
  withLedgerBlock,
  notePresumption,
} from '../../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../../src/domain/facts/presumptionCheck.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';

/** @param {string} lineId */
const note = (lineId) => notePresumption({ pool: 'planted', lineId, atoms: [], surface: 'dossier', drawKind: 'K', resolvedBy: 'drawn' });

describe('R-D1 unit 1: the ledger holds one note set per block', () => {
  it('a second pass over the same block replaces the first pass\'s notes; other notes stay', () => {
    const { ledger } = withPresumptionLedger(() => {
      note('before');
      withLedgerBlock('economy', () => { note('first-a'); note('first-b'); });
      note('between');
      withLedgerBlock('power', () => note('other-block'));
      withLedgerBlock('economy', () => note('second'));
      note('after');
    });
    expect(ledger.map((e) => e.lineId)).toEqual(['before', 'between', 'other-block', 'second', 'after']);
  });

  it('with no ledger open the block is a plain call', () => {
    expect(withLedgerBlock('economy', () => 7)).toBe(7);
  });

  it('a nested birth\'s ledger is not tagged with, nor pruned by, the outer block', () => {
    const outer = withPresumptionLedger(() => {
      withLedgerBlock('economy', () => {
        note('outer-first');
        const inner = withPresumptionLedger(() => note('inner'));
        expect(inner.ledger.map((e) => e.block)).toEqual([undefined]);
      });
    });
    expect(outer.ledger.map((e) => e.lineId)).toEqual(['outer-first']);
  });

  it.each([1185, 1221, 2595])('soak1k-%i: the replaced economy pass leaves no \'no walls\' note', async (i) => {
    await ensureLaws();
    const born = withPresumptionLedger(() => birth(i));
    const findings = presumptionFindings(born.result.settlement, born.ledger);
    expect(findings.map((p) => `${p.pool} #${p.lineId}: ${p.atom}`)).toEqual([]);
  }, 120_000);
});
