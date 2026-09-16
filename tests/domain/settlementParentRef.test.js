/**
 * The parent receipt is immutable history, not the live lineage relationship.
 * These pins keep regeneration and import address translation from collapsing
 * those two authorities into one another.
 */
import { describe, expect, it } from 'vitest';

import { reconcileSettlementChange } from '../../src/domain/settlementReconciliation.js';
import {
  preserveSettlementParentRef,
  remapSettlementParentRefForImport,
} from '../../src/domain/settlementParentRef.js';

const parentRef = () => ({
  version: 1,
  parentId: 'source-parent',
  sourceSatelliteId: 'satellite-7',
  foundedTick: 40,
  graduatedTick: 71,
  birthId: 'birth-7',
  futureEvidence: { witness: 'The east-road charter' },
});

describe('settlement parentRef lifecycle', () => {
  it('makes the prior receipt win across an ordinary reconciliation', () => {
    const priorRef = parentRef();
    const prior = { name: 'Child', activeConditions: [], parentRef: priorRef };
    const regeneratedRef = { ...priorRef, parentId: 'wrong-parent' };
    const generated = { name: 'Child Reforged', activeConditions: [], parentRef: regeneratedRef };

    const out = reconcileSettlementChange(generated, prior, { source: 'regenerate' });

    expect(out.parentRef).toBe(priorRef);
    expect(generated.parentRef).toBe(regeneratedRef);
    expect(out.parentRef.futureEvidence).toEqual({ witness: 'The east-road charter' });
  });

  it('allows the first receipt to be recorded when the prior settlement had none', () => {
    const first = parentRef();
    const generated = { name: 'New Child', parentRef: first };

    expect(preserveSettlementParentRef(generated, { name: 'Prior' })).toBe(generated);
  });

  it('remaps only parentId when both imported members landed', () => {
    const ref = parentRef();
    const settlement = { name: 'Child', parentRef: ref };
    const out = remapSettlementParentRefForImport(
      settlement,
      new Map([['source-parent', 'destination-parent']]),
    );

    expect(out).not.toBe(settlement);
    expect(out.parentRef).toEqual({ ...ref, parentId: 'destination-parent' });
    expect(settlement.parentRef).toBe(ref);
  });

  it('preserves an orphaned source receipt by identity and invents no destination parent', () => {
    const settlement = { name: 'Child', parentRef: parentRef() };
    const out = remapSettlementParentRefForImport(settlement, {
      'some-other-member': 'destination-other',
    });

    expect(out).toBe(settlement);
    expect(out.parentRef.parentId).toBe('source-parent');
  });
});
