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
  MAP_EDITS_SCHEMA_KEYS, readMapEdits, readLegendPrefs, readLayoutVariant, readStyleLens,
  normalizeMapEdits, withPinNudge, withLayoutVariant, nextLayoutVariant, withLegendPref, withStyleLens,
  readAnnotations, withAnnotation, withoutAnnotationAt, readBespokeStyles, withBespokeStyles,
  readSeasonOverride, withSeasonOverride, SEASON_OVERRIDE_IDS,
  readSceneOverrides, sceneOverrideFor, withSceneOverride, withoutSceneOverride,
  SCENE_OVERRIDE_SKIN_IDS, SCENE_OVERRIDE_VARIANT_IDS,
} from '../../src/domain/townMap/mapEdits.js';
import { addBespokeStyle, removeBespokeStyle, resolveActiveStyle } from '../../src/domain/townMap/bespokeStyles.js';
import { validateBespokeStyle } from '../../src/design/townMapStyleWall.js';
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

  it('the schema is exactly the container keys + pin/legend/annotation sub-keys', () => {
    // A guard against a future key sneaking in without the denylist re-check above.
    // SM-5 honestly EXTENDS this pin with the annotation keys (annotations/x/y/label/
    // audience); S4-S6 honestly EXTENDS it with `bespokeStyles` (the CONTAINER key only —
    // its value is an opaque wall-validated collection, so its dynamic ids + role fields are
    // not a fixed vocabulary and cannot join the list). Every listed key ∉ PRIVATE_KEY_RE above.
    expect([...MAP_EDITS_SCHEMA_KEYS].sort()).toEqual(
      ['anchor', 'annotations', 'audience', 'bespokeStyles', 'dx', 'dy', 'headingOffsetStep', 'label', 'layoutLawVersion', 'layoutVariant', 'legendPrefs', 'pins', 'sceneOverrides', 'seasonOverride', 'showLabels', 'showLegend', 'skinId', 'styleLens', 'variantId', 'x', 'y'],
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

describe('mapEdits — sceneOverrides (3D presentation without a second layout truth)', () => {
  it('canonicalizes by anchor, last-writer-wins, and wraps heading to -8..7', () => {
    const edits = normalizeMapEdits({
      sceneOverrides: [
        { anchor: 'z', variantId: 'mirror', headingOffsetStep: 17 },
        { anchor: 'a', skinId: 'brickGuild', headingOffsetStep: -9 },
        { anchor: 'z', variantId: 'mirror', headingOffsetStep: 8 },
      ],
    });
    expect(readSceneOverrides(edits)).toEqual([
      { anchor: 'a', skinId: 'brickGuild', headingOffsetStep: 7 },
      { anchor: 'z', variantId: 'mirror', headingOffsetStep: -8 },
    ]);
  });

  it('fails closed on arbitrary variants/skins and drops a no-op record', () => {
    expect(normalizeMapEdits({
      sceneOverrides: [{
        anchor: 'cat:tavern',
        variantId: 'Not A Slug',
        skinId: 'secret-material',
        headingOffsetStep: 0,
        x: 999,
        elevation: 9000,
        scale: 12,
      }],
    })).toBeNull();
    expect(SCENE_OVERRIDE_SKIN_IDS).toEqual([
      'brickGuild', 'marbleTemple', 'ruinedGothic', 'steelModern', 'stoneAshlar', 'timberVillage',
    ]);
    expect(SCENE_OVERRIDE_VARIANT_IDS).toEqual(['mirror']);
    expect(normalizeMapEdits({
      sceneOverrides: [{ anchor: 'cat:tavern', variantId: 'duplicate-template-slug' }],
    })).toBeNull();
  });

  it('merges one field at a time; clearing the last field restores dormancy', () => {
    let edits = withSceneOverride(null, 'cat:tavern', { variantId: 'mirror' });
    edits = withSceneOverride(edits, 'cat:tavern', { skinId: 'timberVillage' });
    expect(sceneOverrideFor(edits, 'cat:tavern')).toEqual({
      anchor: 'cat:tavern',
      variantId: 'mirror',
      skinId: 'timberVillage',
    });
    edits = withSceneOverride(edits, 'cat:tavern', { variantId: null });
    expect(sceneOverrideFor(edits, 'cat:tavern')).toEqual({
      anchor: 'cat:tavern',
      skinId: 'timberVillage',
    });
    edits = withSceneOverride(edits, 'cat:tavern', { skinId: null });
    expect(edits).toBeNull();
  });

  it('coexists with authoritative plan pins and removes only the requested anchor', () => {
    let edits = withPinNudge(null, 'cat:tavern', 12, -4);
    edits = withSceneOverride(edits, 'cat:tavern', { headingOffsetStep: 2 });
    edits = withSceneOverride(edits, 'cat:temple', { skinId: 'marbleTemple' });
    expect(edits.pins).toEqual([{ anchor: 'cat:tavern', dx: 12, dy: -4 }]);
    const withoutTemple = withoutSceneOverride(edits, 'cat:temple');
    expect(readSceneOverrides(withoutTemple)).toEqual([
      { anchor: 'cat:tavern', headingOffsetStep: 2 },
    ]);
    expect(withoutTemple.pins).toEqual([{ anchor: 'cat:tavern', dx: 12, dy: -4 }]);
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

describe('mapEdits — styleLens (MAP STYLES; cosmetic, dormancy-lawful)', () => {
  it('readStyleLens defaults to parchment; coerces an unknown lens to the default', () => {
    expect(readStyleLens(null)).toBe('parchment');
    expect(readStyleLens({})).toBe('parchment');
    expect(readStyleLens({ styleLens: 'vtt' })).toBe('vtt');
    expect(readStyleLens({ styleLens: 'no-such' })).toBe('parchment');
  });

  it('withStyleLens sets a non-default lens; selecting parchment clears it (byte-identity)', () => {
    const vtt = withStyleLens(null, 'vtt');
    expect(vtt).toEqual({ styleLens: 'vtt' });
    expect(readStyleLens(vtt)).toBe('vtt');
    expect(withStyleLens(vtt, 'parchment')).toBeNull(); // default ⇒ no edit ⇒ dormancy
    expect(withStyleLens(null, 'bogus')).toBeNull();    // unknown coerces to default ⇒ null
  });

  it('normalizeMapEdits drops a default lens but keeps a non-default one', () => {
    expect(normalizeMapEdits({ styleLens: 'parchment' })).toBeNull();
    expect(normalizeMapEdits({ styleLens: 'watercolor' })).toEqual({ styleLens: 'watercolor' });
  });

  it('a lens rides alongside other edits without disturbing them', () => {
    const e = withStyleLens({ layoutVariant: 2, pins: [{ anchor: 'a', dx: 1, dy: 1 }] }, 'darkFantasy');
    expect(e.layoutVariant).toBe(2);
    expect(e.pins).toEqual([{ anchor: 'a', dx: 1, dy: 1 }]);
    expect(e.styleLens).toBe('darkFantasy');
  });
});

describe('mapEdits — DM annotations (SM-5; cosmetic, denylist-safe, dormancy-lawful)', () => {
  it('withAnnotation adds a marker; readAnnotations validates + defaults audience to dm', () => {
    const e = withAnnotation(null, { x: 300, y: 400, label: 'Ambush point' });
    expect(readAnnotations(e)).toEqual([{ x: 300, y: 400, label: 'Ambush point', audience: 'dm' }]);
  });

  it('audience is fail-closed: only an explicit "player" is player-visible', () => {
    const dm = withAnnotation(null, { x: 1, y: 1, label: 'secret door', audience: 'garbage' });
    expect(readAnnotations(dm)[0].audience).toBe('dm');
    const pl = withAnnotation(null, { x: 1, y: 1, label: 'the inn', audience: 'player' });
    expect(readAnnotations(pl)[0].audience).toBe('player');
  });

  it('clamps coordinates to 0..1000, rounds to whole units, bounds the label, drops label-less', () => {
    const e = withAnnotation(null, { x: 99999, y: -50.6, label: '  x'.padEnd(200, 'y'), audience: 'player' });
    const a = readAnnotations(e)[0];
    expect(a.x).toBe(1000);
    expect(a.y).toBe(0);
    expect(a.label.length).toBe(80);
    // a label-less marker never persists
    expect(withAnnotation(null, { x: 5, y: 5, label: '   ' })).toBeNull();
  });

  it('absent / empty ⇒ null container (dormancy: byte-identical to no-edit)', () => {
    expect(normalizeMapEdits({ annotations: [] })).toBeNull();
    expect(normalizeMapEdits({ annotations: [{ x: 1, y: 1 }] })).toBeNull(); // label-less dropped ⇒ empty ⇒ null
    expect(readAnnotations(null)).toEqual([]);
  });

  it('withoutAnnotationAt removes by canonical index; out-of-range is a no-op', () => {
    let e = withAnnotation(null, { x: 200, y: 100, label: 'B' });
    e = withAnnotation(e, { x: 100, y: 100, label: 'A' }); // sorts before B (lower x at same y)
    expect(readAnnotations(e).map((a) => a.label)).toEqual(['A', 'B']);
    e = withoutAnnotationAt(e, 0); // removes A
    expect(readAnnotations(e).map((a) => a.label)).toEqual(['B']);
    expect(withoutAnnotationAt(e, 9)).toEqual(e); // out of range ⇒ unchanged
  });

  it('annotations ride alongside other edits without disturbing them', () => {
    const e = withAnnotation({ layoutVariant: 2, styleLens: 'vtt' }, { x: 10, y: 20, label: 'here' });
    expect(e.layoutVariant).toBe(2);
    expect(e.styleLens).toBe('vtt');
    expect(e.annotations).toHaveLength(1);
  });
});

describe('mapEdits — bespokeStyles (S4-S6; per-settlement, blob-resident, dormancy-lawful)', () => {
  const styleA = validateBespokeStyle({ label: 'Ink', background: '#101418' }, { id: 'ink', label: 'Ink' }).style;
  const styleB = validateBespokeStyle({ label: 'Rose', background: '#f0d0d8' }, { id: 'rose', label: 'Rose' }).style;

  it('the wall gives __resolved styles the collection algebra requires', () => {
    expect(styleA.__resolved).toBe(true);
    expect(styleB.__resolved).toBe(true);
  });

  it('ROUND-TRIP: withBespokeStyles stores the collection; readBespokeStyles reads it back', () => {
    const coll = addBespokeStyle(addBespokeStyle({}, 'ink', styleA), 'rose', styleB);
    const e = withBespokeStyles(null, coll);
    expect(Object.keys(readBespokeStyles(e)).sort()).toEqual(['ink', 'rose']);
    // survives a JSON round-trip (the applyMapEdit cloneJson persist) with __resolved intact.
    const round = JSON.parse(JSON.stringify(e));
    expect(readBespokeStyles(round).ink.__resolved).toBe(true);
    // resolveActiveStyle picks the saved definition for a bespoke id, base lens otherwise.
    expect(resolveActiveStyle('ink', readBespokeStyles(round)).background).toBe('#101418');
    expect(resolveActiveStyle('parchment', readBespokeStyles(round)).__resolved).toBe(true); // base lens still resolves
  });

  it('DORMANCY: an empty / all-invalid collection DROPS the key (byte-identical to no-edit)', () => {
    expect(withBespokeStyles(null, {})).toBeNull();
    expect(withBespokeStyles(null, null)).toBeNull();
    expect(normalizeMapEdits({ bespokeStyles: {} })).toBeNull();
    expect(normalizeMapEdits({ bespokeStyles: { ink: { background: '#fff' } } })).toBeNull(); // not __resolved ⇒ dropped ⇒ empty ⇒ null
    expect(readBespokeStyles(null)).toEqual({});
    expect(readBespokeStyles({ bespokeStyles: [] })).toEqual({}); // arrays are not a collection
  });

  it('DELETED-BESPOKE-NEVER-STRANDS: removing the last style returns the blob byte-identical', () => {
    const one = withBespokeStyles(null, addBespokeStyle({}, 'ink', styleA));
    const emptied = withBespokeStyles(one, removeBespokeStyle(readBespokeStyles(one), 'ink'));
    expect(emptied).toBeNull(); // dormancy: no styles ⇒ no container
  });

  it('CROSS-EDIT COEXISTENCE: bespokeStyles ride alongside pins/lens without disturbing them', () => {
    const base = withStyleLens(withPinNudge(null, 'cat:tavern', 10, -5), 'vtt');
    const e = withBespokeStyles(base, addBespokeStyle({}, 'ink', styleA));
    expect(e.pins).toEqual([{ anchor: 'cat:tavern', dx: 10, dy: -5 }]); // pin survives
    expect(e.styleLens).toBe('vtt');                                    // lens survives
    expect(Object.keys(readBespokeStyles(e))).toEqual(['ink']);        // style stored
    // and removing the style leaves the OTHER edits intact (only the bespoke key drops).
    const without = withBespokeStyles(e, {});
    expect(without.pins).toEqual([{ anchor: 'cat:tavern', dx: 10, dy: -5 }]);
    expect(without.styleLens).toBe('vtt');
    expect(without.bespokeStyles).toBeUndefined();
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

describe('mapEdits — seasonOverride (IT3-c, the styleLens shape)', () => {
  it('the key is denylist-safe (∉ PRIVATE_KEY_RE) — pinned by the schema list, re-checked here', () => {
    expect(PRIVATE_KEY_RE.test('seasonOverride')).toBe(false);
    expect(MAP_EDITS_SCHEMA_KEYS).toContain('seasonOverride');
  });

  it('readSeasonOverride: absent / invalid ⇒ null; a valid bounded season ⇒ that season', () => {
    expect(readSeasonOverride(null)).toBeNull();
    expect(readSeasonOverride({})).toBeNull();
    expect(readSeasonOverride({ seasonOverride: 'nonsense' })).toBeNull();
    expect(readSeasonOverride({ seasonOverride: 'WINTER' })).toBeNull();  // case-exact vocab
    for (const s of SEASON_OVERRIDE_IDS) expect(readSeasonOverride({ seasonOverride: s })).toBe(s);
  });

  it('DORMANCY: an unset / invalid override is DROPPED ⇒ byte-identical to no-edit', () => {
    expect(normalizeMapEdits({ seasonOverride: null })).toBeNull();
    expect(normalizeMapEdits({ seasonOverride: 'nonsense' })).toBeNull();
    // set then clear returns the blob to no-edit (the flip-back / dormancy law)
    const pinned = withSeasonOverride(null, 'winter');
    expect(pinned).toEqual({ seasonOverride: 'winter' });
    expect(withSeasonOverride(pinned, null)).toBeNull();
    expect(withSeasonOverride(pinned, 'auto')).toBeNull();  // any non-vocab value clears
  });

  it('withSeasonOverride preserves every OTHER edit (merges, non-destructive)', () => {
    const base = withStyleLens(null, 'illustrated');
    const pinned = withSeasonOverride(base, 'autumn');
    expect(pinned.styleLens).toBe('illustrated');
    expect(pinned.seasonOverride).toBe('autumn');
    // clearing the season keeps the lens
    expect(withSeasonOverride(pinned, null)).toEqual({ styleLens: 'illustrated' });
  });
});
