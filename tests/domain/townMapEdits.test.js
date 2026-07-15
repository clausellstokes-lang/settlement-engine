/**
 * townMapEdits.test.js — SM-3 the cosmetic mapEdits container (design §5 + §7).
 *
 * Pure read + merge ops (domain/townMap/mapEdits.js): read-time default, pin
 * accumulation + drag-back-to-zero drop, reroll salt, legend prefs, and the
 * normalize→null collapse that restores byte-identity. Plus the two constitutional
 * pins:
 *   • THE KEY-NAMING TRAP — no schema key matches PRIVATE_KEY_RE (a future gallery
 *     allowlisting can never SILENTLY STRIP a cosmetic key).
 *   • LIFECYCLE (blob-resident) — mapEdits survives the save/load boundary
 *     (normalizeSettlement passthrough + absent-stays-absent), export→import (a
 *     JSON round-trip), and the store's clone substrate (cloneJson /
 *     snapshotSettlement) that snapshot/revert/undo/persist all ride.
 *
 * (Purity — no Date/Math.random/localeCompare in mapEdits.js — is enforced by the
 * townMap domain source-scan in townMapModel.test.js, which globs the whole dir.)
 */
import { describe, expect, it } from 'vitest';

import {
  MAP_EDITS_SCHEMA_KEYS, readMapEdits, readLegendPrefs, readLayoutVariant,
  normalizeMapEdits, withPinNudge, withLayoutVariant, nextLayoutVariant, withLegendPref,
} from '../../src/domain/townMap/mapEdits.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { cloneJson, snapshotSettlement } from '../../src/store/settlementSliceHelpers.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);

describe('mapEdits — the key-naming trap (load-bearing)', () => {
  it('NO schema key matches PRIVATE_KEY_RE (never silently stripped from a projection)', () => {
    const offenders = MAP_EDITS_SCHEMA_KEYS.filter((k) => PRIVATE_KEY_RE.test(k));
    expect(offenders).toEqual([]);
  });

  it('the schema is exactly {layoutVariant, pins, legendPrefs} + pin/legend sub-keys', () => {
    // A guard against a future key sneaking in without the denylist re-check above.
    expect([...MAP_EDITS_SCHEMA_KEYS].sort()).toEqual(
      ['anchor', 'dx', 'dy', 'layoutVariant', 'legendPrefs', 'pins', 'showLabels', 'showLegend'],
    );
  });
});

describe('mapEdits — readMapEdits (read-time default; never writes)', () => {
  it('absent / invalid ⇒ null (the pipeline never stamps a container)', () => {
    expect(readMapEdits(undefined)).toBeNull();
    expect(readMapEdits(null)).toBeNull();
    expect(readMapEdits({})).toBeNull();
    expect(readMapEdits({ mapEdits: null })).toBeNull();
    expect(readMapEdits({ mapEdits: [] })).toBeNull();       // arrays are not the container
    expect(readMapEdits({ mapEdits: 'x' })).toBeNull();
  });

  it('present ⇒ the container object, read WITHOUT mutating the settlement', () => {
    const s = { mapEdits: { layoutVariant: 2 } };
    const before = stable(s);
    expect(readMapEdits(s)).toEqual({ layoutVariant: 2 });
    expect(stable(s)).toBe(before); // read-only
  });
});

describe('mapEdits — normalizeMapEdits (collapse to null ⇒ byte-identity)', () => {
  it('empty / no-real-edit shapes ⇒ null', () => {
    expect(normalizeMapEdits(null)).toBeNull();
    expect(normalizeMapEdits({})).toBeNull();
    expect(normalizeMapEdits({ layoutVariant: 0 })).toBeNull();
    expect(normalizeMapEdits({ pins: [] })).toBeNull();
    expect(normalizeMapEdits({ pins: [{ anchor: 'a', dx: 0, dy: 0 }] })).toBeNull(); // zeroed pin
    expect(normalizeMapEdits({ legendPrefs: { showLabels: false, showLegend: false } })).toBeNull();
  });

  it('keeps only real edits, sorts pins by anchor, drops zeroed pins', () => {
    const out = normalizeMapEdits({
      layoutVariant: 3,
      pins: [
        { anchor: 'z', dx: 4, dy: -2 },
        { anchor: 'a', dx: 1, dy: 1 },
        { anchor: 'm', dx: 0, dy: 0 }, // dropped
      ],
      legendPrefs: { showLegend: true, showLabels: false },
    });
    expect(out.layoutVariant).toBe(3);
    expect(out.pins.map((p) => p.anchor)).toEqual(['a', 'z']); // sorted, zeroed dropped
    expect(out.legendPrefs).toEqual({ showLegend: true });     // false pref dropped
  });

  it('clamps a runaway nudge to ±1000 and rounds to whole units', () => {
    const out = normalizeMapEdits({ pins: [{ anchor: 'a', dx: 99999, dy: -50000.6 }] });
    expect(out.pins[0]).toEqual({ anchor: 'a', dx: 1000, dy: -1000 });
  });
});

describe('mapEdits — withPinNudge (accumulate; drag-back-to-zero drops)', () => {
  it('accumulates onto an existing pin', () => {
    let e = withPinNudge(null, 'cat:tavern', 10, -5);
    expect(e.pins).toEqual([{ anchor: 'cat:tavern', dx: 10, dy: -5 }]);
    e = withPinNudge(e, 'cat:tavern', 3, 2);
    expect(e.pins).toEqual([{ anchor: 'cat:tavern', dx: 13, dy: -3 }]);
  });

  it('a nudge back to (0,0) removes the pin ⇒ null container when it was the only edit', () => {
    let e = withPinNudge(null, 'cat:tavern', 10, -5);
    e = withPinNudge(e, 'cat:tavern', -10, 5);
    expect(e).toBeNull();
  });

  it('leaves other anchors untouched', () => {
    let e = withPinNudge(null, 'a', 5, 5);
    e = withPinNudge(e, 'b', 7, 7);
    expect(e.pins).toEqual([{ anchor: 'a', dx: 5, dy: 5 }, { anchor: 'b', dx: 7, dy: 7 }]);
  });
});

describe('mapEdits — variant + legend ops', () => {
  it('withLayoutVariant / nextLayoutVariant are monotone integers; 0 clears', () => {
    expect(readLayoutVariant(withLayoutVariant(null, 2))).toBe(2);
    expect(nextLayoutVariant({ layoutVariant: 2 })).toBe(3);
    expect(withLayoutVariant({ layoutVariant: 4 }, 0)).toBeNull(); // variant 0 ⇒ no edit
  });

  it('withLegendPref sets / clears a pref; readLegendPrefs coerces to booleans', () => {
    const on = withLegendPref(null, 'showLabels', true);
    expect(readLegendPrefs(on)).toEqual({ showLabels: true, showLegend: false });
    expect(withLegendPref(on, 'showLabels', false)).toBeNull(); // clearing the only edit ⇒ null
    expect(withLegendPref(null, 'bogusKey', true)).toBeNull();  // unknown pref ignored
  });
});

describe('mapEdits — model dormancy (absent ⇒ byte-identical view)', () => {
  it('buildTownMapModel(s, readMapEdits(s)) === buildTownMapModel(s) for an unedited settlement', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'sm3-dorm' });
    expect(stable(buildTownMapModel(s, readMapEdits(s)))).toBe(stable(buildTownMapModel(s)));
  });
});

describe('mapEdits — lifecycle (blob-resident survival)', () => {
  const edits = { layoutVariant: 2, pins: [{ anchor: 'cat:tavern', dx: 3, dy: -1 }], legendPrefs: { showLabels: true } };

  it('save→load: normalizeSettlement passes the container through UNCHANGED', () => {
    const s = { id: 'sm3-load', name: 'Loadton', tier: 'town', population: 900, mapEdits: structuredClone(edits) };
    const out = normalizeSettlement(s);
    expect(out.mapEdits).toEqual(edits);
    expect(stable(out.mapEdits)).toBe(stable(edits));
  });

  it('save→load: normalizeSettlement does NOT stamp a container when absent (byte-identity)', () => {
    const s = { id: 'sm3-absent', name: 'Absenton', tier: 'town', population: 900 };
    expect('mapEdits' in normalizeSettlement(s)).toBe(false);
  });

  it('export→import: a JSON round-trip preserves the container byte-for-byte', () => {
    const s = { id: 'sm3-export', mapEdits: structuredClone(edits) };
    const roundTripped = JSON.parse(JSON.stringify(s));
    expect(roundTripped.mapEdits).toEqual(edits);
    expect(stable(roundTripped.mapEdits)).toBe(stable(edits));
  });

  it('snapshot/revert/undo/persist substrate: cloneJson + snapshotSettlement carry the container', () => {
    const s = { id: 'sm3-clone', name: 'Cloneton', versionHistory: [{ id: 'snap' }], mapEdits: structuredClone(edits) };
    expect(cloneJson(s).mapEdits).toEqual(edits);
    const snap = snapshotSettlement(s);
    expect(snap.mapEdits).toEqual(edits);      // the container rides the snapshot
    expect(snap.versionHistory).toBeUndefined(); // …while the timeline is still stripped
  });
});
