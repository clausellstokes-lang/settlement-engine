/**
 * tests/domain/facts/guild.test.js — CENSUS-4b (the chair's answer 4): the composite presence atom
 * `guild`, homed ONCE in `factsOf.js` — a live guild-type institution on the roster (the
 * institution home's live names, `facts/institutions.js :: liveInstitutionNames`) ∨ a guild power
 * in the power structure. A criminal guild (a thieves' or an assassins' guild) is neither: the
 * crime atom is CENSUS-3b's (`organised crime`). Declarable; `institution: guild` stays no atom.
 *
 * @enforced-by npx vitest run tests/domain/facts/guild.test.js
 */
import { describe, expect, it } from 'vitest';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import * as V from '../../../src/domain/facts/factVocabulary.js';

describe('the guild atom (answer 4)', () => {
  it('a live guild-type institution, or a guild power, holds it; a criminal guild does not', () => {
    expect(factsOf({ tier: 'town', institutions: [{ name: 'Craft guilds (5-15)', category: 'Crafts' }] }).guild).toBe(true);
    expect(factsOf({ tier: 'city', institutions: [{ name: 'Merchant guilds (15-40)', category: 'Economy' }] }).guild).toBe(true);
    expect(factsOf({ tier: 'town', institutions: [], powerStructure: { factions: [{ faction: 'The Merchant Guilds', category: 'economy' }] } }).guild).toBe(true);
    expect(factsOf({ tier: 'town', institutions: [{ name: "Thieves' guild", category: 'Criminal' }] }).guild).toBe(false);
    expect(factsOf({ tier: 'town', institutions: [], powerStructure: { factions: [{ faction: "The Thieves' Guild", category: 'criminal' }] } }).guild).toBe(false);
    expect(factsOf({ tier: 'thorp', institutions: [{ name: 'Market square', category: 'Economy' }] }).guild).toBe(false);
    expect(factsOf({ tier: 'town', institutions: [{ name: 'Craft guilds (5-15)', category: 'Crafts', status: 'ruined' }] }).guild).toBe(false);
  });
  it('is declarable, and gates a line both ways', () => {
    expect(V.assertDeclarable('guild').dimension).toBe('guild');
    expect(V.parseAtom('institution: guild')).toBeNull();
    const withGuild = factsOf({ tier: 'town', institutions: [{ name: 'Craft guilds (5-15)', category: 'Crafts' }] });
    const without = factsOf({ tier: 'town', institutions: [] });
    const d = V.declarationOf({ text: 'x', needs: ['guild'] });
    expect(V.declarationAdmits(d, withGuild).admitted).toBe(true);
    expect(V.declarationAdmits(d, without)).toEqual({ admitted: false, refused: ['guild'] });
  });
});

// CENSUS-4c (the chair's answer 3 to CENSUS-4b): ONE guild reader. `isCommerceGuild` lives in the
// domain (`domain/institutions/institutionCategory.js`); the generator imports it from there and
// `facts/guild.js` delegates to it instead of re-reading the guild word.
describe('one guild reader (answer 3)', () => {
  it('the generator re-exports the domain definition (one function, not a copy)', async () => {
    const domain = await import('../../../src/domain/institutions/institutionCategory.js');
    const gen = await import('../../../src/generators/roleCategory.js');
    const chains = await import('../../../src/generators/computeActiveChains.js');
    expect(gen.isCommerceGuild).toBe(domain.isCommerceGuild);
    expect(gen.institutionInCategory).toBe(domain.institutionInCategory);
    expect(chains.institutionMatchesKeyword).toBe(domain.institutionMatchesKeyword);
  });
  it('the atom reads the catalogue\'s own guild marker (a guild-tagged house not named "guild")', () => {
    // Furrier's district carries the catalogue tag `guild` and drives a guild master; the old
    // regex home read only the word and answered false.
    const furriers = { name: "Furrier's district", category: 'Economy', tags: ['trade', 'guild'] };
    expect(factsOf({ tier: 'city', institutions: [furriers] }).guild).toBe(true);
  });
  it('guild.js holds no guild word of its own for the roster', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync(new URL('../../../src/domain/facts/guild.js', import.meta.url), 'utf8');
    expect(src).toMatch(/import \{[^}]*isCommerceGuild[^}]*\} from '\.\.\/institutions\/institutionCategory\.js'/);
    expect(src).not.toMatch(/liveInstitutionNames/); // anchored: the isCommerceGuild import is matched in this same source on the line above
  });
});
