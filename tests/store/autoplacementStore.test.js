/**
 * autoplacementStore.test.js — W-G / J-D1: THE COMMIT, at the real store.
 *
 * The consent popup's pins (tests/components/autoplacementConsent.test.jsx) prove
 * nothing is submitted without consent. THESE pins prove what happens when it is:
 *
 *   1. THE CANONICAL WRITE, AND ONLY IT — positions land through updatePlacement /
 *      addPlacement, so every guard those carry applies. Pinned by source scan AND
 *      by behaviour (the canon lock, which lives in updatePlacement, refuses).
 *   2. ONE UNDO REVERTS THE WHOLE ACT — seven settlements moving under one consent
 *      is one act. A per-settlement undo would be unusable.
 *   3. GENESIS IS UNTOUCHED — the settlement records the placer read are
 *      byte-identical afterwards. A placement that edited generation input would
 *      break the same-seed law, which is why this is pinned at the commit and not
 *      only at the planner.
 *   4. PLACEMENTS JSON ROUND-TRIP — a committed layout survives serialization,
 *      because a campaign is reloaded from JSON and a position that only exists in
 *      memory is a position the user loses.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createMapSlice } from '../../src/store/mapSlice.js';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: k => data.get(String(k)) ?? null,
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: k => { data.delete(String(k)); },
    clear: () => { data.clear(); },
  };
}

/** The map slice plus the minimum campaign surface applyAutoplacement reads. */
const makeStore = ({ canonizedAt = null } = {}) => {
  const store = create(immer((...a) => ({
    ...createMapSlice(...a),
    activeCampaignId: 'camp-1',
    campaigns: [{ id: 'camp-1', worldState: { canonizedAt, tick: 3 }, wizardNews: null }],
    savedSettlements: [
      { id: 'flat', phase: 'canon', name: 'Wheatlow', settlement: { config: { terrainType: 'plains' } } },
      { id: 'peak', phase: 'canon', name: 'Cragholt', settlement: { config: { terrainType: 'mountain' } } },
    ],
  })));
  store.setState(s => {
    s.mapState.placements = {
      b1: { settlementId: 'flat', x: 10, y: 10, cellId: 1, placedAt: 'T0' },
      b2: { settlementId: 'peak', x: 20, y: 20, cellId: 2, placedAt: 'T0' },
    };
  });
  return store;
};

const MOVES = [
  { kind: 'move', burgId: 'b1', settlementId: 'flat', name: 'Wheatlow', x: 100, y: 110, toCell: 44 },
  { kind: 'move', burgId: 'b2', settlementId: 'peak', name: 'Cragholt', x: 200, y: 210, toCell: 88 },
];

beforeEach(() => { installLocalStorage(); });

describe('the commit writes positions through the canonical writes', () => {
  test('every consented move lands, with its cell', () => {
    const store = makeStore();
    const res = store.getState().applyAutoplacement({ proposals: MOVES, seed: 's', version: 1 });
    expect(res).toMatchObject({ ok: true, moved: 2, placed: 0, refused: 0 });
    const after = store.getState().mapState.placements;
    expect(after.b1).toMatchObject({ settlementId: 'flat', x: 100, y: 110, cellId: 44 });
    expect(after.b2).toMatchObject({ settlementId: 'peak', x: 200, y: 210, cellId: 88 });
  });

  test('an unplaced settlement goes through addPlacement, the authoritative gate', () => {
    const store = makeStore();
    store.setState(s => { s.mapState.placements = {}; });
    const res = store.getState().applyAutoplacement({
      proposals: [{ kind: 'place', burgId: null, settlementId: 'flat', name: 'Wheatlow', x: 5, y: 6, toCell: 7 }],
    });
    expect(res).toMatchObject({ ok: true, moved: 0, placed: 1 });
    const rows = Object.values(store.getState().mapState.placements);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ settlementId: 'flat', x: 5, y: 6, cellId: 7 });

    // NEGATIVE CONTROL: the gate is real. A second place of the SAME settlement is
    // refused as a duplicate by addPlacement, and autoplacement honours the refusal
    // instead of writing past it.
    const again = store.getState().applyAutoplacement({
      proposals: [{ kind: 'place', burgId: null, settlementId: 'flat', name: 'Wheatlow', x: 9, y: 9, toCell: 9 }],
    });
    expect(again).toMatchObject({ ok: true, placed: 0, refused: 1 });
    expect(Object.values(store.getState().mapState.placements)).toHaveLength(1);
  });

  test('SOURCE SCAN: the action mints no position write of its own', () => {
    const source = readFileSync(new URL('../../src/store/mapSlice.js', import.meta.url), 'utf8');
    const body = source.slice(source.indexOf('applyAutoplacement:'), source.indexOf('// RETIRED (R-5b'));
    expect(body, 'the slice was extracted wrongly').toContain('applyAutoplacement');
    // It may CALL the canonical writers …
    expect(body).toMatch(/get\(\)\.updatePlacement\(/);
    expect(body).toMatch(/get\(\)\.addPlacement\(/);
    // … but it may never touch the placement bag directly. Anchored: an assignment
    // or delete against state.mapState.placements inside this action would be a
    // second position writer, and the canon lock would not travel with it.
    // anchored: the two toMatch assertions above prove this slice is the live action body (an empty or mis-sliced extract fails there), and the guard-the-guard below proves the regex still bites
    expect(body).not.toMatch(/state\.mapState\.placements\s*\[/);
    // anchored: same live-body anchor above; a drifted extract fails there, not here
    expect(body).not.toMatch(/delete\s+state\.mapState\.placements/);
    // Guard the guard: the anchor would catch a real direct write.
    expect(/state\.mapState\.placements\s*\[/.test('  state.mapState.placements[id] = row;')).toBe(true);
  });
});

describe('the canon lock refuses the whole act, legibly', () => {
  test('a canonized realm writes nothing and says which reason', () => {
    const store = makeStore({ canonizedAt: '2026-07-31T00:00:00.000Z' });
    const before = JSON.stringify(store.getState().mapState.placements);
    const res = store.getState().applyAutoplacement({ proposals: MOVES });
    expect(res).toEqual({ ok: false, reason: 'canonized' });
    expect(JSON.stringify(store.getState().mapState.placements)).toBe(before);
    // Not even an undo entry: a refused act must leave no trace at all.
    expect(store.getState().mapUndoStack).toEqual([]);
  });

  test('no active campaign is refused the same way', () => {
    const store = makeStore();
    store.setState(s => { s.activeCampaignId = null; });
    expect(store.getState().applyAutoplacement({ proposals: MOVES })).toEqual({ ok: false, reason: 'no-campaign' });
  });
});

describe('ONE undo reverts the entire placement pass', () => {
  test('a single mapUndo restores every settlement at once', () => {
    const store = makeStore();
    const before = JSON.parse(JSON.stringify(store.getState().mapState.placements));
    store.getState().applyAutoplacement({ proposals: MOVES });
    expect(store.getState().mapState.placements.b1.x).toBe(100);

    // Exactly ONE snapshot was pushed for the whole act …
    expect(store.getState().mapUndoStack).toHaveLength(1);
    expect(store.getState().mapUndoStack[0].action).toBe('autoplace settlements');

    // … and one undo puts BOTH settlements back.
    store.getState().mapUndo();
    expect(store.getState().mapState.placements).toEqual(before);

    // NEGATIVE CONTROL: redo re-applies the whole act, so the snapshot really is
    // the pre-autoplacement image and not an empty stand-in.
    store.getState().mapRedo();
    expect(store.getState().mapState.placements.b1.x).toBe(100);
    expect(store.getState().mapState.placements.b2.x).toBe(200);
  });
});

describe('genesis immutability, at the commit', () => {
  test('the settlement records are byte-identical after a full autoplacement', () => {
    const store = makeStore();
    const before = JSON.stringify(store.getState().savedSettlements);
    store.getState().applyAutoplacement({ proposals: MOVES, seed: 's', version: 1 });
    expect(JSON.stringify(store.getState().savedSettlements)).toBe(before);
    // Specifically: no terrain key moved anywhere.
    for (const s of store.getState().savedSettlements) {
      expect(s.settlement.config.terrainOverride).toBeUndefined();
    }
    expect(JSON.parse(before)[1].settlement.config.terrainType).toBe('mountain');
    expect(store.getState().savedSettlements[1].settlement.config.terrainType).toBe('mountain');
  });

  test('placements survive a JSON round trip with their coordinates intact', () => {
    const store = makeStore();
    store.getState().applyAutoplacement({ proposals: MOVES });
    const live = store.getState().mapState.placements;
    const revived = JSON.parse(JSON.stringify(live));
    expect(revived).toEqual(live);
    for (const row of Object.values(revived)) {
      expect(Number.isFinite(row.x) && Number.isFinite(row.y)).toBe(true);
      expect(Number.isInteger(row.cellId)).toBe(true);
    }
  });
});

describe('the Herald record is ONE item for the whole charter', () => {
  test('a two-settlement act appends exactly one entry, addressed by id', async () => {
    const store = makeStore();
    store.getState().applyAutoplacement({ proposals: MOVES, seed: 'sd', version: 1 });
    // The record rides a dynamic import, so it lands a microtask later.
    await vi.waitFor(() => {
      expect(store.getState().campaigns[0].wizardNews?.entries?.length).toBe(1);
    });
    const [entry] = store.getState().campaigns[0].wizardNews.entries;
    expect(entry.kind).toBe('autoplacement');
    expect(entry.scope).toBe('realm');
    expect(entry.headline).toBe("The realm's charter is drawn");
    expect(entry.summary).toMatch(/2 settlements take their places/);
    // THE ADDRESS CHAIN: ids, so a later rename can never strand the record.
    expect([...entry.settlementIds].sort()).toEqual(['flat', 'peak']);
    expect(entry.tick).toBe(3);

    // A second charter at the same tick is its own entry, never swallowed.
    store.getState().applyAutoplacement({
      proposals: [{ kind: 'move', burgId: 'b1', settlementId: 'flat', name: 'Wheatlow', x: 7, y: 7, toCell: 3 }],
      seed: 'sd',
    });
    await vi.waitFor(() => {
      expect(store.getState().campaigns[0].wizardNews.entries.length).toBe(2);
    });
  });

  test('NEGATIVE CONTROL: a refused act writes no Herald record at all', async () => {
    const store = makeStore({ canonizedAt: '2026-07-31T00:00:00.000Z' });
    store.getState().applyAutoplacement({ proposals: MOVES, seed: 'sd' });
    await new Promise((r) => setTimeout(r, 25));
    expect(store.getState().campaigns[0].wizardNews).toBeNull();
  });
});
