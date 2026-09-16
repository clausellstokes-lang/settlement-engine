/**
 * tests/domain/townMapFog.test.js — THE TABLE LAYER (DOOR 2) fog pins.
 *
 * The mapEdits/interiorEdits idiom, scoped per session: the KEY-NAMING TRAP (every schema key
 * ∉ PRIVATE_KEY_RE), the DORMANCY law (absent/empty ⇒ null-drop ⇒ byte-identical), the merge
 * ops; PLUS the semantic-snap reveal geometry (reveals follow the model's real district/street/
 * building edges + survive a reroll — the edits-delta law) and the fog mask fragment.
 */
import { describe, it, expect } from 'vitest';
import {
  FOG_SESSIONS_SCHEMA_KEYS,
  readFogSessions, readFogSession, readReveal, sessionHasReveal, listFogSessionIds,
  normalizeFogSession, normalizeFogSessions,
  withSession, withoutSession, withRenamedSession, withRevealed, withRevealSet, withClearedReveal,
  fogSessionId,
  fogStreets, allRevealIds, snapToSemantic, revealShapes, isFullyFogged,
  fogMaskFragment, injectFog,
} from '../../src/domain/townMap/index.js';
import { PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';

// A minimal two-district v2 model fixture (the shape buildTownMapModel emits): stable ids
// on districts (id) + buildings (anchorKey); streets are anchor↔centroid / centroid↔centroid.
function fixtureModel(over = {}) {
  return {
    layoutLawVersion: 2,
    skeleton: {
      anchor: { x: 500, y: 500, kind: 'plaza' },
      streets: [
        { from: { x: 500, y: 500 }, to: { x: 200, y: 200 } }, // spoke → dA
        { from: { x: 500, y: 500 }, to: { x: 800, y: 200 } }, // spoke → dB
        { from: { x: 200, y: 200 }, to: { x: 800, y: 200 } }, // desire dA↔dB
      ],
    },
    districts: [
      { id: 'dA', name: 'Market Quarter', category: 'market', centroid: { x: 200, y: 200 }, polygon: [[100, 100], [300, 100], [300, 300], [100, 300]] },
      { id: 'dB', name: 'Temple Ward', category: 'faith', centroid: { x: 800, y: 200 }, polygon: [[700, 100], [900, 100], [900, 300], [700, 300]] },
    ],
    buildings: [
      { anchorKey: 'cat:market', name: 'Market', districtId: 'dA', kind: 'landmark', position: { x: 180, y: 190 } },
      { anchorKey: 'cat:temple', name: 'Temple', districtId: 'dB', kind: 'landmark', position: { x: 820, y: 210 } },
    ],
    ...over,
  };
}

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

describe('THE TABLE LAYER — SEMANTIC-SNAP reveal (follows the model\'s real edges)', () => {
  it('synthesizes stable street ids from the districts a street links (spoke / desire)', () => {
    const ids = fogStreets(fixtureModel()).map((s) => s.id).sort();
    expect(ids).toEqual(['desire:dA|dB', 'spoke:dA', 'spoke:dB']);
  });

  it('allRevealIds enumerates every district id, building anchorKey, and street id', () => {
    const all = allRevealIds(fixtureModel());
    expect(all.districts.sort()).toEqual(['dA', 'dB']);
    expect(all.buildings.sort()).toEqual(['cat:market', 'cat:temple']);
    expect(all.streets.sort()).toEqual(['desire:dA|dB', 'spoke:dA', 'spoke:dB']);
  });

  it('snaps a brush point to the CONTAINING district (edge-following, not a pixel radius)', () => {
    const m = fixtureModel();
    expect(snapToSemantic(m, 150, 150, { kind: 'districts' })).toEqual({ kind: 'districts', id: 'dA' });
    expect(snapToSemantic(m, 850, 150, { kind: 'districts' })).toEqual({ kind: 'districts', id: 'dB' });
  });

  it('snaps to the nearest building / street when that kind is requested', () => {
    const m = fixtureModel();
    expect(snapToSemantic(m, 182, 188, { kind: 'buildings' })).toEqual({ kind: 'buildings', id: 'cat:market' });
    expect(snapToSemantic(m, 500, 208, { kind: 'streets' })).toEqual({ kind: 'streets', id: 'desire:dA|dB' });
  });

  it('auto snap prefers a building, then a street, then the district', () => {
    const m = fixtureModel();
    expect(snapToSemantic(m, 180, 190)).toEqual({ kind: 'buildings', id: 'cat:market' });   // on the market
    expect(snapToSemantic(m, 500, 205)).toEqual({ kind: 'streets', id: 'desire:dA|dB' });    // on the desire path
    expect(snapToSemantic(m, 120, 280)).toEqual({ kind: 'districts', id: 'dA' });            // inside dA, no bldg/street
  });

  it('a reveal id RE-DERIVES its shape over the CURRENT geometry (survives a reroll)', () => {
    const reveal = { districts: ['dA'] };
    const s1 = revealShapes(fixtureModel(), reveal);
    expect(s1).toHaveLength(1);
    expect(s1[0]).toMatchObject({ kind: 'district', points: [[100, 100], [300, 100], [300, 300], [100, 300]] });
    // a reroll MOVES dA's polygon; the SAME reveal id follows the new geometry (edits-delta law)
    const moved = fixtureModel({
      districts: [
        { id: 'dA', name: 'Market Quarter', category: 'market', centroid: { x: 600, y: 600 }, polygon: [[500, 500], [700, 500], [700, 700], [500, 700]] },
        { id: 'dB', name: 'Temple Ward', category: 'faith', centroid: { x: 800, y: 200 }, polygon: [[700, 100], [900, 100], [900, 300], [700, 300]] },
      ],
    });
    const s2 = revealShapes(moved, reveal);
    expect(s2[0].points).toEqual([[500, 500], [700, 500], [700, 700], [500, 700]]); // followed the reroll
  });

  it('a reveal id that no longer resolves is silently dropped (never a throw)', () => {
    expect(revealShapes(fixtureModel(), { districts: ['ghost'], buildings: ['gone'], streets: ['spoke:ghost'] })).toEqual([]);
    expect(isFullyFogged(fixtureModel(), { districts: ['ghost'] })).toBe(true);
    expect(isFullyFogged(fixtureModel(), { districts: ['dA'] })).toBe(false);
  });
});

describe('THE TABLE LAYER — the fog MASK fragment (union of black reveal holes)', () => {
  it('builds a <mask> that punches a black hole per revealed shape and a masked fog rect', () => {
    const frag = fogMaskFragment(fixtureModel(), { districts: ['dA'], buildings: ['cat:temple'], streets: ['spoke:dB'] }, { color: '#111', opacity: 0.9 });
    expect(frag).toContain('<mask id="sf-fog"');
    expect(frag).toContain('fill="#fff"');           // fog everywhere (white in the mask)
    expect(frag).toContain('<polygon points="100,100 300,100 300,300 100,300" fill="#000"/>'); // dA revealed
    expect(frag).toContain('<circle');               // the revealed building hole
    expect(frag).toContain('<line');                 // the revealed street corridor
    expect(frag).toContain('fill="#111" fill-opacity="0.9" mask="url(#sf-fog)"'); // the fog rect
  });

  it('injectFog splices the fragment before the final </svg>; an empty fragment is byte-identical', () => {
    const base = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
    expect(injectFog(base, '')).toBe(base);          // dormant ⇒ untouched
    const out = injectFog(base, '<g data-town-fog></g>');
    expect(out).toBe('<svg xmlns="http://www.w3.org/2000/svg"><rect/><g data-town-fog></g></svg>');
  });

  it('a fully-fogged session (nothing revealed) still produces a full-cover mask (no holes)', () => {
    const frag = fogMaskFragment(fixtureModel(), { districts: [], streets: [], buildings: [] });
    expect(frag).toContain('<mask');
    expect(frag).not.toContain('fill="#000"'); // no reveal holes ⇒ everything hidden
  });
});
