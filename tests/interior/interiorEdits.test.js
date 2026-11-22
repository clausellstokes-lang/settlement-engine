/**
 * tests/interior/interiorEdits.test.js — the scoped cosmetic sidecar pins (DOOR 3).
 *
 * The mapEdits idiom, scoped per institution: the KEY-NAMING TRAP (every schema key ∉
 * PRIVATE_KEY_RE), the DORMANCY law (absent/empty ⇒ null-drop ⇒ byte-identical), and the
 * merge ops.
 */
import { describe, it, expect } from 'vitest';
import {
  INTERIOR_EDITS_SCHEMA_KEYS,
  readInteriorEdits, readInteriorEditEntry, readInteriorPins, readInteriorStyleLens,
  normalizeInteriorEntry, normalizeInteriorEdits, withInteriorPinNudge, withInteriorStyleLens,
} from '../../src/domain/interior/index.js';
import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';

describe('KEYED SCALE — sidecar KEY-NAMING TRAP (denylist-safe schema keys)', () => {
  it('every interior-edit SCHEMA key is ∉ PRIVATE_KEY_RE (a future gallery cannot strip it)', () => {
    for (const key of INTERIOR_EDITS_SCHEMA_KEYS) {
      expect(PRIVATE_KEY_RE.test(key), `schema key "${key}" matches PRIVATE_KEY_RE`).toBe(false);
    }
  });
});

describe('KEYED SCALE — sidecar DORMANCY (absent/empty ⇒ null-drop)', () => {
  it('a missing container reads null and never writes back', () => {
    expect(readInteriorEdits({})).toBe(null);
    expect(readInteriorEdits(null)).toBe(null);
    expect(readInteriorEdits({ interiorEdits: [] })).toBe(null); // array is not a container
  });

  it('an empty/edited-away container normalizes to null (the store drops the key)', () => {
    expect(normalizeInteriorEdits({})).toBe(null);
    expect(normalizeInteriorEdits({ 'cat:x': {} })).toBe(null);
    expect(normalizeInteriorEdits({ 'cat:x': { pins: [] } })).toBe(null);
    expect(normalizeInteriorEntry({ pins: [{ anchor: 'furn:a:0', dx: 0, dy: 0 }] })).toBe(null); // a zeroed pin drops
    expect(normalizeInteriorEntry({ styleLens: 'parchment' })).toBe(null); // the default lens is omitted
  });

  it('a real edit produces a minimal, byte-stable, sorted container', () => {
    const c = withInteriorPinNudge(null, 'cat:guild', 'furn:room:hall:1', 10, -4);
    expect(c).toEqual({ 'cat:guild': { pins: [{ anchor: 'furn:room:hall:1', dx: 10, dy: -4 }] } });
    // accumulate a second nudge on the same anchor
    const c2 = withInteriorPinNudge(c, 'cat:guild', 'furn:room:hall:1', 5, 5);
    expect(readInteriorPins(readInteriorEditEntry(c2, 'cat:guild'))).toEqual([{ anchor: 'furn:room:hall:1', dx: 15, dy: 1 }]);
    // dragging a pin back to origin removes it (dormancy)
    const c3 = withInteriorPinNudge(c2, 'cat:guild', 'furn:room:hall:1', -15, -1);
    expect(c3).toBe(null);
  });

  it('a non-default lens is kept; the default lens clears it', () => {
    const c = withInteriorStyleLens(null, 'cat:guild', 'vtt');
    expect(readInteriorStyleLens(readInteriorEditEntry(c, 'cat:guild'))).toBe('vtt');
    expect(withInteriorStyleLens(c, 'cat:guild', 'parchment')).toBe(null);
  });
});
