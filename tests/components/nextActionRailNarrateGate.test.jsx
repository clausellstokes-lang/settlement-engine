/**
 * @vitest-environment jsdom
 *
 * nextActionRailNarrateGate.test.jsx — narration is available to a signed-in FREE
 * owner, decoupled from the premium edit gate.
 *
 * Regression pin: the Next-Best-Action rail's first-narrate ("Polish") and
 * Regenerate rungs used to hang off `canEdit` (premium/founder/elevated only), so
 * a free account never saw a narrate action — even though narration is a PAID,
 * edit-mode-free move that spends a credit (or opens the purchase moment). They now
 * ride `canNarrate` (any signed-in owner of a saved settlement) while manual editing
 * / canonize stay premium-gated on `canEdit`.
 */
import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useNextActionRailHandlers } from '../../src/components/settlementDetail/useNextActionRailHandlers.js';

const base = {
  saveId: 'save-1', phase: 'draft', editMode: false, narrated: false,
  toggleEditMode: () => {}, canonize: () => {}, setConfirmCanonizeOpen: () => {}, openExportSheet: () => {},
};

const handlers = (over) => renderHook(() => useNextActionRailHandlers({ ...base, ...over })).result.current.railHandlers;

describe('NextActionRail narrate gating', () => {
  test('a FREE owner (canNarrate, NOT canEdit) gets the first-narrate rung', () => {
    const h = handlers({ canEdit: false, canNarrate: true, narrated: false });
    expect(typeof h.onPolishAi).toBe('function');
    // ...but manual editing + canonize stay premium-gated on canEdit:
    expect(h.onEdit).toBeUndefined();
    expect(h.onCanonize).toBeUndefined();
    expect(h.onApplyEvent).toBeUndefined();
  });

  test('once narrated, the FREE owner gets Regenerate (not first-narrate)', () => {
    const h = handlers({ canEdit: false, canNarrate: true, narrated: true });
    expect(typeof h.onRegenerateAi).toBe('function');
    expect(h.onPolishAi).toBeUndefined();
  });

  test('no narrate rung when canNarrate is false (anon / no save)', () => {
    const h = handlers({ canEdit: false, canNarrate: false, narrated: false });
    expect(h.onPolishAi).toBeUndefined();
    expect(h.onRegenerateAi).toBeUndefined();
  });

  test('a premium owner keeps both narrate AND edit', () => {
    const h = handlers({ canEdit: true, canNarrate: true, narrated: false });
    expect(typeof h.onPolishAi).toBe('function');
    expect(typeof h.onEdit).toBe('function');
  });
});
