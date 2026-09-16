/**
 * destroyWriterConvergence.test.js — Wave R-3 lane A (atlas VI.10 #4 / #148).
 *
 * DESTROY_SETTLEMENT had TWO writers of the destroyed-settlement fields: the
 * domain handler (composer pipeline) and a hand-rolled object inside
 * destroySavedSettlement. They had already drifted — the store lane never
 * stamped destroyedCause or config._destroyed/_destroyedByEventId (the keys
 * undoEvent's `withoutEventDestruction` revival matches on). The write now
 * delegates to the ONE domain writer; only the flat log-ROW shape remains
 * lane-specific (pinned by timelineEntryShapes — a full applyEvent-shaped row
 * would be a persistence-shape and undo-capability change, owner-gated).
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { destroySettlement } from '../../src/domain/events/mutateEntities.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

const BASE_SETTLEMENT = { name: 'Testford', tier: 'town', institutions: [], npcs: [] };

describe('destroySavedSettlement delegates its write to the domain handler', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-x', name: 'Doomed', settlement: { ...BASE_SETTLEMENT } }];
    });
  });

  test('the destroyed row carries the domain handler output exactly (+ the legacy reason alias)', () => {
    const result = store.getState().destroySavedSettlement('save-x', 'meteor', { confirmName: 'Testford' });
    expect(result.ok).toBe(true);
    const written = store.getState().savedSettlements[0].settlement;

    // Recompute what the ONE writer produces for the same event identity.
    const expected = destroySettlement({ ...BASE_SETTLEMENT }, {
      id: written.destroyedByEventId,
      type: 'DESTROY_SETTLEMENT',
      targetId: 'meteor',
      timestamp: written.destroyedAt,
    });
    expect(written).toEqual({ ...expected, destroyedReason: 'meteor' });

    // The previously-drifted fields, named: the revival keys exist now.
    expect(written.destroyedCause).toBe('meteor');
    expect(written.config._destroyed).toBe(true);
    expect(written.config._destroyedByEventId).toBe(written.destroyedByEventId);
    expect(written.destroyedByEventId).toMatch(/^destroy\.save-x\./);
  });

  test('the flat library-row flavor log entry keeps its exact shape', () => {
    store.getState().destroySavedSettlement('save-x', 'meteor', { confirmName: 'Testford' });
    const log = store.getState().savedSettlements[0].campaignState.eventLog;
    expect(log).toHaveLength(1);
    const row = log[0];
    expect(Object.keys(row).sort()).toEqual(
      ['id', 'narrativeSummary', 'targetId', 'timestamp', 'type'],
    );
    expect(row.type).toBe('DESTROY_SETTLEMENT');
    expect(row.targetId).toBe('meteor');
    expect(row.narrativeSummary).toBe('Testford was destroyed: meteor.');
    expect(row.beforeState).toBeUndefined();
    expect(row.event).toBeUndefined();
  });

  test('single-writer scan: the slice hand-rolls no destroyed-settlement stamp', () => {
    const source = readFileSync(
      new URL('../../src/store/settlementSlice.js', import.meta.url), 'utf8',
    );
    // The write flows through the delegated domain handler, exactly once…
    expect(source.match(/domainDestroySettlement\(/g)).toHaveLength(1);
    // …and no inline stamp of the destruction fields survives. `destroyedAt:`
    // is the hand-rolled writer's signature key; the one remaining
    // `status: 'destroyed'` string must be the ActionResult envelope's `after`
    // SUMMARY (actionResult.js's documented mapping), never a settlement write.
    expect(source).not.toMatch(/destroyedAt:/);
    expect(source.match(/status:\s*'destroyed'/g)).toHaveLength(1);
    expect(source).toMatch(/after: {2}{ id: String\(id\), status: 'destroyed', destroyedReason: reason }/);
  });
});
