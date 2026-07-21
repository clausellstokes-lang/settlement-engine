/**
 * mapSlice.undo.test.js — F6: map annotation undo/redo.
 *
 * The undo stack must (a) NOT clone the heavy fmgSnapshot geography blob into
 * every snapshot, (b) restore ONLY the annotation/placement sub-slices (so
 * undoing a label can't revert geography or the camera), and (c) make moved/
 * edited annotations undoable via pushMapUndo (called once per drag).
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createMapSlice } from '../../src/store/mapSlice.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: k => data.get(String(k)) ?? null,
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: k => { data.delete(String(k)); },
    clear: () => { data.clear(); },
  };
}

const makeStore = () => create(immer((...a) => ({ ...createMapSlice(...a) })));

describe('mapSlice annotation undo/redo (F6)', () => {
  beforeEach(() => { installLocalStorage(); });

  test('snapshots do NOT include the heavy fmgSnapshot blob', () => {
    const store = makeStore();
    store.setState(s => { s.mapState.fmgSnapshot = 'X'.repeat(1000); });
    store.getState().addLabel({ x: 1, y: 1, text: 'A' });
    const snap = store.getState().mapUndoStack[0].snapshot;
    expect('fmgSnapshot' in snap).toBe(false);
    expect(Object.keys(snap).sort()).toEqual(['forests', 'labels', 'markers', 'placements']);
  });

  test('undo of add-label removes it; redo restores it', () => {
    const store = makeStore();
    store.getState().addLabel({ x: 1, y: 1, text: 'A' });
    expect(store.getState().mapState.labels).toHaveLength(1);
    store.getState().mapUndo();
    expect(store.getState().mapState.labels).toHaveLength(0);
    store.getState().mapRedo();
    expect(store.getState().mapState.labels).toHaveLength(1);
  });

  test('campaign switch (replaceMapState) CLEARS both stacks — no cross-campaign injection (fix wave 2 #3)', () => {
    const store = makeStore();
    // Campaign A: build undo history including a SECRET marker.
    store.getState().addLabel({ x: 1, y: 1, text: 'A-note' });
    store.getState().addMarker({ x: 2, y: 2, title: 'A-hidden-cache', note: 'GM secret' });
    expect(store.getState().mapUndoStack.length).toBeGreaterThan(0);

    // Switch to campaign B (its saved map has no markers).
    store.getState().replaceMapState({ placements: {}, labels: [], markers: [], forests: [] });
    expect(store.getState().mapUndoStack).toEqual([]);
    expect(store.getState().mapRedoStack).toEqual([]);

    // Undo in B must be a no-op — it can NEVER resurrect campaign A's marker/label.
    store.getState().mapUndo();
    expect(store.getState().mapState.markers).toEqual([]);
    expect(store.getState().mapState.labels).toEqual([]);
  });

  test('deselect (resetMapState) clears both undo AND redo stacks (fix wave 2 #3)', () => {
    const store = makeStore();
    store.getState().addLabel({ x: 1, y: 1, text: 'A' });
    store.getState().mapUndo(); // populate the redo stack too
    expect(store.getState().mapRedoStack.length).toBeGreaterThan(0);
    store.getState().resetMapState();
    expect(store.getState().mapUndoStack).toEqual([]);
    expect(store.getState().mapRedoStack).toEqual([]);
  });

  test('undo restores a MOVED label (pushMapUndo) without reverting geography/camera', () => {
    const store = makeStore();
    store.getState().addLabel({ x: 10, y: 10, text: 'A' });
    const id = store.getState().mapState.labels[0].id;
    // Set geography + camera AFTER the label exists; undoing the move must not touch them.
    store.setState(s => { s.mapState.fmgSnapshot = 'GEO'; s.mapState.viewport.scale = 3; });

    // Simulate a drag: snapshot once (drag-start), then per-move updates.
    store.getState().pushMapUndo('move label');
    store.getState().updateLabel(id, { x: 99, y: 99 });
    store.getState().updateLabel(id, { x: 120, y: 120 });
    expect(store.getState().mapState.labels[0]).toMatchObject({ x: 120, y: 120 });

    store.getState().mapUndo();
    // Label position restored to pre-drag…
    expect(store.getState().mapState.labels[0]).toMatchObject({ x: 10, y: 10 });
    // …but geography + camera are untouched by the annotation undo.
    expect(store.getState().mapState.fmgSnapshot).toBe('GEO');
    expect(store.getState().mapState.viewport.scale).toBe(3);
  });
});
