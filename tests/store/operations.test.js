/**
 * operations.test.js — Track K COMPLETION §1/§2 K-A: the Operation envelope +
 * the canon-action adapter (the "prove the pattern" foundation).
 *
 * Proves that the 5 Track-K canon-path actions "adapt to the registry, zero
 * change" (DESIGN_TRACK_K_COMPLETION §2 K-A): their EXISTING ActionResult
 * (actionResult.js) bridges to an Operation envelope via operationFromActionResult
 * WITHOUT touching any action body — opType comes from ActionResult.action (⇔ a
 * registry key), receiptRef points at the receipts the action already produced.
 */
import { describe, expect, test } from 'vitest';
import {
  makeOperation,
  operationFromActionResult,
  OPERATION_PROVENANCE,
} from '../../src/store/operations.js';
import { makeActionResult } from '../../src/store/actionResult.js';
import { OPERATIONS, operationFor } from '../../src/store/operationRegistry.js';

const CANON = ['applyEvent', 'undoLastEvent', 'recordSnapshot', 'revertToSnapshot', 'destroySavedSettlement', 'charterUserRoute'];

describe('Operation envelope (operations.js)', () => {
  test('makeOperation fills the silent default envelope', () => {
    expect(makeOperation('setLock')).toEqual({
      opType: 'setLock',
      targets: {},
      params: {},
      provenance: 'manual',
      receiptRef: null,
      undoToken: null,
    });
  });

  test('makeOperation carries only what the caller names', () => {
    const op = makeOperation('applyEvent', {
      targets: { saveId: 's1' },
      params: { eventType: 'FAMINE' },
      provenance: OPERATION_PROVENANCE.SYSTEM,
      undoToken: 'undoLastEvent',
    });
    expect(op).toEqual({
      opType: 'applyEvent',
      targets: { saveId: 's1' },
      params: { eventType: 'FAMINE' },
      provenance: 'system',
      receiptRef: null,
      undoToken: 'undoLastEvent',
    });
  });

  test("provenance exposes manual + system only; 'ai' stays reserved (unemittable)", () => {
    expect(OPERATION_PROVENANCE).toEqual({ MANUAL: 'manual', SYSTEM: 'system' });
    expect(Object.values(OPERATION_PROVENANCE)).not.toContain('ai');
  });
});

describe('K-A canon adapter (operationFromActionResult)', () => {
  test('bridges an ActionResult to an Operation with opType == action + receipts as receiptRef', () => {
    const receipts = [{ kind: 'event', id: 'e1' }];
    const ar = makeActionResult('applyEvent', { ok: true, receipts });
    const op = operationFromActionResult(ar, { targets: { saveId: 's9' }, undoToken: 'undoLastEvent' });
    expect(op.opType).toBe('applyEvent');
    expect(op.receiptRef).toBe(receipts); // points at, does not clone
    expect(op.targets).toEqual({ saveId: 's9' });
    expect(op.provenance).toBe('manual');
    expect(op.undoToken).toBe('undoLastEvent');
  });

  test('an empty receipts array bridges to a null receiptRef', () => {
    const op = operationFromActionResult(makeActionResult('undoLastEvent', { receipts: [] }));
    expect(op.receiptRef).toBeNull();
  });

  test('a meta.opType override wins over ActionResult.action', () => {
    const op = operationFromActionResult(makeActionResult('applyEvent'), { opType: 'applyEventBatch' });
    expect(op.opType).toBe('applyEventBatch');
  });

  test('every canon action bridges to a registered canon opType (the K-A round-trip)', () => {
    for (const action of CANON) {
      const op = operationFromActionResult(makeActionResult(action));
      const spec = operationFor(op.opType);
      expect(spec, `${action} must be a registered operation`).not.toBeNull();
      expect(spec.klass).toBe('canon');
      expect(spec.opType).toBe(action);
    }
  });

  test('OPERATIONS holds exactly the 6 canon actions in class "canon"', () => {
    const canonEntries = Object.values(OPERATIONS).filter((o) => o.klass === 'canon').map((o) => o.opType).sort();
    expect(canonEntries).toEqual([...CANON].sort());
  });
});
