/**
 * mapDirtyFingerprint.test.js — components-map-1 pin.
 *
 * The autosave hook's dirty key had DIVERGED from AutoSaveChip's content-aware
 * fingerprint: the hook keyed on placement ids + layer counts only, so a
 * drag-move (id set unchanged) or a rename (count unchanged) flipped the chip to
 * "Unsaved changes" but NEVER fired the autosave — and a campaign switch then
 * discarded the edits. The fingerprint is now ONE shared module both consume.
 *
 * These pins lock (a) the content-aware behavior — every editable mutation flips
 * it — and (b) the parity: both the chip and the hook import the ONE source.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { mapDirtyFingerprint } from '../../src/components/map/mapDirtyFingerprint.js';

const base = () => ({
  placements: { s1: { x: 10, y: 20, cellId: 'c5', settlementId: 'save1' } },
  labels: [{ id: 'l1', x: 1, y: 2, text: 'River' }],
  markers: [{ id: 'm1', x: 3, y: 4, title: 'Cave', note: 'dark' }],
  forests: [{ id: 'f1', x: 5, y: 6, radius: 20 }],
  customBackdrop: null,
});

describe('mapDirtyFingerprint — content-aware dirty detection', () => {
  it('identical map states fingerprint EQUAL (no false-dirty save loop)', () => {
    expect(mapDirtyFingerprint(base())).toBe(mapDirtyFingerprint(base()));
  });

  it('a DRAG-MOVE (same id set, changed cellId/x/y) flips the fingerprint — the old count-key missed this', () => {
    const moved = base();
    moved.placements.s1 = { ...moved.placements.s1, cellId: 'c9', x: 99 };
    expect(mapDirtyFingerprint(moved)).not.toBe(mapDirtyFingerprint(base()));
  });

  it('a LABEL RENAME (same count) flips the fingerprint', () => {
    const renamed = base();
    renamed.labels = [{ ...renamed.labels[0], text: 'Great River' }];
    expect(mapDirtyFingerprint(renamed)).not.toBe(mapDirtyFingerprint(base()));
  });

  it('a MARKER note/title edit (same count) flips the fingerprint', () => {
    const edited = base();
    edited.markers = [{ ...edited.markers[0], note: 'lit torches' }];
    expect(mapDirtyFingerprint(edited)).not.toBe(mapDirtyFingerprint(base()));
  });

  it('a FOREST resize (same count) flips the fingerprint', () => {
    const resized = base();
    resized.forests = [{ ...resized.forests[0], radius: 40 }];
    expect(mapDirtyFingerprint(resized)).not.toBe(mapDirtyFingerprint(base()));
  });

  it('a custom-backdrop swap flips the fingerprint', () => {
    const b = base();
    b.customBackdrop = { imageUrl: 'blob:xyz' };
    expect(mapDirtyFingerprint(b)).not.toBe(mapDirtyFingerprint(base()));
  });

  it('null / empty mapState is a stable empty fingerprint (no throw)', () => {
    expect(mapDirtyFingerprint(null)).toBe(mapDirtyFingerprint({}));
    expect(mapDirtyFingerprint(undefined)).toBe(mapDirtyFingerprint({ placements: {} }));
  });
});

describe('parity: the chip and the autosave hook read ONE fingerprint source', () => {
  const chip = readFileSync(new URL('../../src/components/map/AutoSaveChip.jsx', import.meta.url), 'utf8');
  const hook = readFileSync(new URL('../../src/hooks/useMapAutosave.js', import.meta.url), 'utf8');

  it('both import mapDirtyFingerprint from the shared module', () => {
    expect(chip).toMatch(/import\s*\{\s*mapDirtyFingerprint\s*\}\s*from\s*'\.\/mapDirtyFingerprint\.js'/);
    expect(hook).toMatch(/import\s*\{\s*mapDirtyFingerprint\s*\}\s*from\s*'\.\.\/components\/map\/mapDirtyFingerprint\.js'/);
  });

  it('the hook no longer carries a re-forked count-only key (the divergence source)', () => {
    // The old key folded layer COUNTS: `(m.labels || []).length`. Its absence
    // proves the hook is not silently maintaining a second, drifting fingerprint.
    expect(hook).not.toMatch(/\|\$\{\(.*\|\| \[\]\)\.length\}/);
  });
});
