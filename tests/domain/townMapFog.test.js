/**
 * tests/domain/townMapFog.test.js — THE TABLE LAYER (DOOR 2) fog pins.
 *
 * The mapEdits/interiorEdits idiom, scoped per session: the KEY-NAMING TRAP (every schema key
 * ∉ PRIVATE_KEY_RE), the DORMANCY law (absent/empty ⇒ null-drop ⇒ byte-identical) and the
 * merge ops — the PERSISTED-SHAPE half.
 *
 * ⚰ THE GEOMETRY HALF LEFT (ODQ §725/§772). The semantic-snap reveal geometry and the fog
 * mask fragment were the DRAW-side of this layer; they were retired with the legacy
 * settlement-map draw stack and their pins went with them. What is pinned here is what a
 * SAVED BLOB can still carry: a settlement written before the retirement keeps its fog
 * container, and the reader that must go on understanding it is retained substrate until the
 * governed observed-shape re-freeze can retire it too. Same posture as the bespoke-style wall.
 */
import { describe, it, expect } from 'vitest';
import {
  FOG_SESSIONS_SCHEMA_KEYS,
  readFogSessions, readFogSession, readReveal, sessionHasReveal, listFogSessionIds,
  normalizeFogSession, normalizeFogSessions,
  withSession, withoutSession, withRenamedSession, withRevealed, withRevealSet, withClearedReveal,
  fogSessionId,
} from '../../src/domain/townMap/fogSessions.js';
import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';

describe('THE TABLE LAYER — sidecar KEY-NAMING TRAP (denylist-safe schema keys)', () => {
  it('every fog-session SCHEMA key is ∉ PRIVATE_KEY_RE (a future gallery cannot strip it)', () => {
    for (const key of FOG_SESSIONS_SCHEMA_KEYS) {
      expect(PRIVATE_KEY_RE.test(key), `schema key "${key}" matches PRIVATE_KEY_RE`).toBe(false);
    }
  });
});

describe('THE TABLE LAYER — sidecar DORMANCY (absent/empty ⇒ null-drop ⇒ byte-identical)', () => {
  it('a missing container reads null and never writes back', () => {
    expect(readFogSessions({})).toBe(null);
    expect(readFogSessions(null)).toBe(null);
    expect(readFogSessions({ fogSessions: [] })).toBe(null); // an array is not a container
  });

  it('an empty/edited-away container normalizes to null (the store drops the key)', () => {
    expect(normalizeFogSessions({})).toBe(null);
    expect(normalizeFogSessions({ 'friday': {} })).toBe(null);         // no name, no reveal
    expect(normalizeFogSessions({ 'friday': { districts: [] } })).toBe(null);
    expect(normalizeFogSession({ name: '', streets: [] })).toBe(null); // blank ⇒ null
  });

  it('a named session persists; revealing then hiding everything drops back to dormant', () => {
    const c1 = withSession(null, 'Friday Game');
    expect(c1).toEqual({ 'friday-game': { name: 'Friday Game' } });        // name-only persists
    const c2 = withRevealed(c1, 'friday-game', 'districts', 'dA', true);
    expect(readReveal(readFogSession(c2, 'friday-game')).districts).toEqual(['dA']);
    const c3 = withRevealed(c2, 'friday-game', 'districts', 'dA', false);  // hide it back
    expect(c3).toEqual({ 'friday-game': { name: 'Friday Game' } });        // reveal gone, name kept
    expect(withoutSession(c3, 'friday-game')).toBe(null);                  // delete the last ⇒ dormant
  });

  it('a real reveal round-trips minimal + byte-stable (sorted, de-duped)', () => {
    const c = withRevealSet(withSession(null, 'S'), 's', 'districts', ['dB', 'dA', 'dA']);
    // sorted + de-duped for a stable stringify
    expect(readFogSession(c, 's').districts).toEqual(['dA', 'dB']);
    expect(JSON.stringify(normalizeFogSessions(c))).toBe(JSON.stringify(c)); // already canonical
  });

  it('session ids are slug-derived (no random) and reveal helpers are pure', () => {
    expect(fogSessionId('Friday Game!')).toBe('friday-game');
    expect(fogSessionId('')).toBe('session');
    const base = withRevealed(null, 'sess', 'buildings', 'cat:market', true);
    const again = withRevealed(base, 'sess', 'buildings', 'cat:market', true); // idempotent add
    expect(readReveal(readFogSession(again, 'sess')).buildings).toEqual(['cat:market']);
    expect(sessionHasReveal(readFogSession(again, 'sess'))).toBe(true);
  });

  it('rename re-keys the entry, preserving its reveal set', () => {
    const c = withRevealed(withSession(null, 'A'), 'a', 'districts', 'dA', true);
    const r = withRenamedSession(c, 'a', 'Table B');
    expect(listFogSessionIds(r)).toEqual(['table-b']);
    expect(readReveal(readFogSession(r, 'table-b')).districts).toEqual(['dA']);
  });

  it('clearing a session hides everything but keeps the named session', () => {
    const c = withRevealed(withSession(null, 'A'), 'a', 'streets', 'spoke:dA', true);
    const cleared = withClearedReveal(c, 'a');
    expect(cleared).toEqual({ 'a': { name: 'A' } });
  });
});
