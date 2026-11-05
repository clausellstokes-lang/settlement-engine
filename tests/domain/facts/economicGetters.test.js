/**
 * tests/domain/facts/economicGetters.test.js — CENSUS-3b unit 1: THE DELEGATED GETTERS
 * (the chair's ruling R-E; the vocabulary rulings §2).
 *
 * `factsOf(record)` answers `foodSources`, `imports` / `exports`, `culture`, `crime` and
 * `prosperity` by DELEGATION to the record's one canonical reader each (no field reader, no new
 * logic), and the vocabulary names the atoms they answer, so the "named but refused" list shrinks
 * by exactly those. `route` and `tier` were already getters (CENSUS-1). Byte-identity 0: a getter
 * is read only when a declared atom asks.
 *
 * @enforced-by npx vitest run tests/domain/facts/economicGetters.test.js
 */
import { describe, expect, it } from 'vitest';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { canonExports, canonImports } from '../../../src/domain/canonicalAccessors.js';
import { resolveSettlementCulture } from '../../../src/domain/resolveCulture.js';
import { deriveCriminalStructure } from '../../../src/domain/display/defenseDisplay.js';
import { CULTURE_PROFILE_KEYS } from '../../../src/domain/cultureProfiles.js';
import { PROSPERITY_LABELS } from '../../../src/domain/prosperityRank.js';

const RECORD = Object.freeze({
  tier: 'town',
  config: { culture: 'norse', terrainType: 'coastal', tradeRouteAccess: 'port' },
  institutions: [{ name: "Thieves' guild", category: 'Criminal' }],
  economicState: {
    prosperity: 'Comfortable',
    primaryExports: ['Salted fish', 'Timber'],
    primaryImports: [],
    foodSecurity: { foodRecord: { band: 'secure', foodSources: ['grain', 'fish'] } },
  },
});

describe('the delegated getters answer through the canonical readers', () => {
  const f = factsOf(RECORD);
  it('each getter IS its reader (delegation, not a re-reading)', () => {
    expect(f.exports).toEqual(canonExports(RECORD));
    expect(f.imports).toEqual(canonImports(RECORD));
    expect(f.culture).toBe(resolveSettlementCulture(RECORD));
    expect(f.crime).toBe(deriveCriminalStructure(RECORD)?.key);
    expect(f.foodSources).toEqual(['grain', 'fish']);
    expect(f.prosperity).toBe('comfortable');
  });
  it('an absent fact reads unanswered or none, never invented', () => {
    const bare = factsOf({ tier: 'thorp', institutions: [] });
    expect(bare.foodSources).toBeUndefined();
    expect(bare.crime).toBe('none');
    expect(bare.prosperity).toBeUndefined();
    expect(bare.exports).toEqual([]);
  });
});

describe('the vocabulary names the atoms they answer', () => {
  const f = factsOf(RECORD);
  it('the ladders equal their homes', () => {
    expect(V.CULTURE_WORDS).toEqual(CULTURE_PROFILE_KEYS);
    expect(V.PROSPERITY_WORDS).toEqual(['subsistence', ...PROSPERITY_LABELS.map((l) => l.toLowerCase())]);
  });
  it('the food sources, the lists, the culture, the crime and the prosperity are declarable and answered', () => {
    for (const a of ['grain', 'fish', 'game', 'livestock', 'imports', 'exports', 'organised crime', 'culture: norse', 'crime: ≥ diffuse', 'prosperity: ≥ moderate']) {
      expect(() => V.assertDeclarable(a), a).not.toThrow();
    }
    expect(V.atomHolds('grain', f)).toBe(true);
    expect(V.atomHolds('livestock', f)).toBe(false);
    expect(V.atomHolds('exports', f)).toBe(true);
    expect(V.atomHolds('imports', f)).toBe(false);
    expect(V.atomHolds('culture: norse', f)).toBe(true);
    expect(V.atomHolds('organised crime', f)).toBe(true);
    expect(V.atomHolds('crime: = organized', f)).toBe(true);
    expect(V.atomHolds('prosperity: ≥ moderate', f)).toBe(true);
    expect(V.atomHolds('prosperity: ≥ prosperous', f)).toBe(false);
    expect(V.atomHolds('grain', factsOf({ institutions: [] }))).toBeUndefined(); // fail-closed
  });
  it('the "named but refused" list shrinks by exactly these', () => {
    const refused = Object.entries(V.FACT_DIMENSIONS).filter(([, d]) => d.reader === null).map(([n]) => n).sort();
    expect(refused).toEqual([]); // the merge of CENSUS-3b and CENSUS-1c (lane census-3, 2026-11-05) empties it
  });
});
