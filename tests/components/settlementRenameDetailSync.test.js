/**
 * settlementRenameDetailSync.test.js — the pure detail-sync behind the dossier
 * header's inline settlement rename (C3-c / C4 Panel A handoff).
 *
 * When a saved settlement is renamed from the read-only dossier header, the store's
 * renameSettlement writes savedSettlements + persists — but the open `detail` copy
 * in SettlementDetail is a SEPARATE object, and the header's EditableInline renders
 * from its `value` prop after commit. Without patching `detail`, the name reverts to
 * the old value until re-open (a write that survives persistence but ghosts the open
 * view — the classic one-path lifecycle bug). renameDetailSettlement patches the
 * settlement name on BOTH the live copy and the embedded saveData so the whole
 * propSettlement-fed dossier reflects the rename immediately.
 */

import { describe, it, expect } from 'vitest';
import { renameDetailSettlement } from '../../src/components/settlements/helpers.js';

const baseDetail = Object.freeze({
  id: 's-1',
  settlement: { name: 'Oldford', tier: 'town', population: 1200 },
  saveData: { id: 's-1', name: 'Oldford', tier: 'town', settlement: { name: 'Oldford', tier: 'town' } },
  config: { seed: 42 },
});

describe('renameDetailSettlement — keeps the open detail in lockstep with the rename', () => {
  it('patches the name on the live settlement AND the embedded saveData (name column + blob)', () => {
    const next = renameDetailSettlement(baseDetail, 'Newford');
    expect(next.settlement.name).toBe('Newford');
    expect(next.saveData.name).toBe('Newford');
    expect(next.saveData.settlement.name).toBe('Newford');
  });

  it('preserves every other field on the settlement, saveData, and detail', () => {
    const next = renameDetailSettlement(baseDetail, 'Newford');
    expect(next.settlement.tier).toBe('town');
    expect(next.settlement.population).toBe(1200);
    expect(next.saveData.tier).toBe('town');
    expect(next.saveData.settlement.tier).toBe('town');
    expect(next.config).toEqual({ seed: 42 });
    expect(next.id).toBe('s-1');
  });

  it('trims surrounding whitespace before applying', () => {
    const next = renameDetailSettlement(baseDetail, '   Trimford  ');
    expect(next.settlement.name).toBe('Trimford');
    expect(next.saveData.name).toBe('Trimford');
  });

  it('is immutable — the original detail is untouched (React state contract)', () => {
    const next = renameDetailSettlement(baseDetail, 'Newford');
    expect(next).not.toBe(baseDetail);
    expect(baseDetail.settlement.name).toBe('Oldford');
    expect(baseDetail.saveData.settlement.name).toBe('Oldford');
  });

  it('returns the SAME reference (no-op) for an empty / whitespace-only name', () => {
    expect(renameDetailSettlement(baseDetail, '')).toBe(baseDetail);
    expect(renameDetailSettlement(baseDetail, '   ')).toBe(baseDetail);
    expect(renameDetailSettlement(baseDetail, null)).toBe(baseDetail);
  });

  it('tolerates a null detail and a detail with no saveData', () => {
    expect(renameDetailSettlement(null, 'X')).toBeNull();
    const noSave = { settlement: { name: 'Solo' } };
    const next = renameDetailSettlement(noSave, 'Duo');
    expect(next.settlement.name).toBe('Duo');
    expect(next.saveData).toBeUndefined();
  });
});
