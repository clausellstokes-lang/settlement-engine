/**
 * CENSUS-4f unit 2 (the chair's ruling of 2026-11-05 07:2x on the five `[guard]` conflict labels;
 * R-AP amended, R-C, R-G, R-AN): the faction label `Military/Guard` is pushed by the military
 * PRIORITY and the tier, not by the roster, so the key guarantees no enforcement body and the label
 * declares `guardPresence`. Its twin names the same bloc without a body. The power step carries the
 * declared row through `textOf` (byte-identical): `guardPresence` is NOT settled at that step (the
 * 1,000: 1 of 363 label holders differs, soak1k-331), so the resolution is the mechanism lane's,
 * after the roster settles.
 */
import { describe, expect, it } from 'vitest';
import { FACTION_LABEL_SIBLINGS, MILITARY_GUARD_LABEL } from '../../src/data/factionLabelSiblings.js';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { inferFactionCategory } from '../../src/generators/power/factionCategories.js';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { textOf } from '../../src/domain/facts/textOf.js';

/** The `[guard]` instrument's own words (`readerBattery.js :: hookPoolsFindings`). */
const GUARD_WORDS = /\b(?:guard captain|guards?|garrison|the watch|watch ?(?:captain|commander|house)|watchm[ae]n|city watch|town watch|soldiers?|sentries|sentry)\b/i;

describe('FACTION_LABEL_SIBLINGS (CENSUS-4f unit 2)', () => {
  const set = FACTION_LABEL_SIBLINGS['Military/Guard'];

  it('(a) the label declares guardPresence; its one twin excludes it', () => {
    expect(set.map((l) => l.text)).toEqual(['Military/Guard', 'Military Party']);
    expect(set[0]).toMatchObject({ needs: ['guardPresence'] });
    expect(set[1]).toMatchObject({ twinOf: 'Military/Guard', excludes: ['guardPresence'] });
    expect(MILITARY_GUARD_LABEL).toBe(set[0]);
  });

  it('(b) the twin names no enforcement body and keeps the label\'s kind for every name-keyed reader', () => {
    expect(GUARD_WORDS.test(set[1].text)).toBe(false);
    expect(GUARD_WORDS.test(set[0].text)).toBe(true);
    expect(inferFactionCategory(set[1].text)).toBe(inferFactionCategory(set[0].text));
    expect(set[1].text.toLowerCase().includes('military')).toBe(true);
  });

  it('(c) a resolver handed the final record picks the label where a guard stands, the twin where none does', () => {
    const at = (/** @type {boolean} */ guardPresence) => resolveSibling('Military/Guard', FACTION_LABEL_SIBLINGS, {
      facts: /** @type {any} */ ({ guardPresence }), poolId: 'factionLabelSiblings:FACTION_LABEL_SIBLINGS', surface: 'power', drawKind: 'T',
    });
    expect(at(true)).toBe('Military/Guard');
    expect(at(false)).toBe('Military Party');
  });

  it('(d) carried, not resolved: the power step prints the declared row\'s text byte-identically, guard or none', () => {
    const config = { priorityMilitary: 70, priorityEconomy: 50, tradeRouteAccess: 'road' };
    for (const roster of [[{ name: 'Shrine', category: 'Religious' }], [{ name: 'Town watch', category: 'Defense' }]]) {
      const ps = generatePowerStructure('town', { prosperity: 'Moderate' }, null, config, roster);
      const row = (ps.factions || []).find((f) => f.faction === textOf(MILITARY_GUARD_LABEL));
      expect(row?.faction).toBe('Military/Guard');
    }
  });
});
