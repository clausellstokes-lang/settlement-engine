/**
 * tests/domain/facts/sharedPower.test.js — R2-CODE-A-14, THE CHAIR'S RULING (s1) of 2026-11-14: the word
 * `shared power` granted, ONE atom, a pair's fact (`src/domain/facts/sharedPower.js`), through the vocabulary's
 * own door (`factVocabulary.js`, `factsOf.js`, `factLayers.js`, the self-check's settled view).
 *
 * @enforced-by npx vitest run tests/domain/facts/sharedPower.test.js
 */
import { describe, expect, it } from 'vitest';
import { pairSharesPower, sharesPower } from '../../../src/domain/facts/sharedPower.js';
import { sharesPower as tiesSharesPower } from '../../../src/generators/people/ties.js';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { factsOf, birthFactsOf } from '../../../src/domain/facts/factsOf.js';
import { LEAVES } from '../../../src/domain/facts/factLayers.js';
import { presumptionFindings } from '../../../src/domain/facts/presumptionCheck.js';

const card = (id, ...powers) => ({ id, name: `N${id}`, memberships: powers.map((power) => ({ power })) });
const a = card('a', 'Elder Council'); const b = card('b', 'Elder Council', 'Merchant Guilds'); const c = card('c', 'Merchant Guilds'); const d = card('d');

describe('the home: the tie generator\'s own rule, one reading', () => {
  it('two cards share a power when any membership is in common', () => {
    expect(sharesPower(a, b)).toBe(true);
    expect(sharesPower(a, c)).toBe(false);
    expect(sharesPower(b, c)).toBe(true);
    expect(sharesPower(d, a)).toBe(false);
    expect(sharesPower(a, d)).toBe(false);
  });
  it('people/ties.js weighs a target by the SAME function (a re-export, not a copy)', () => {
    expect(tiesSharesPower).toBe(sharesPower);
  });
  it('the reader reads the roster\'s own card of each id (the final record), else the card as handed', () => {
    const later = { ...a, memberships: [{ power: 'Merchant Guilds' }] };
    expect(pairSharesPower({}, [a, c])).toBe(false);
    expect(pairSharesPower({ npcs: [later, c] }, [a, c])).toBe(true);
    expect(pairSharesPower({ npcs: [later, c] }, [a, b])).toBe(true); // b is not on the roster: read as handed
    expect(pairSharesPower({}, [a])).toBeUndefined();
    expect(pairSharesPower({}, null)).toBeUndefined();
    expect(pairSharesPower({}, [a, 'b'])).toBeUndefined();
  });
});

describe('the word, through the vocabulary\'s door', () => {
  it('is a declarable presence atom with a pair context, homed in factsOf and in the layer table', () => {
    expect(V.assertDeclarable('shared power').dimension).toBe('shared power');
    const dim = V.FACT_DIMENSIONS['shared power'];
    expect(dim).toMatchObject({ shape: 'presence', home: 'sharesPower', needsContext: 'pair' });
    expect(typeof factsOf({}).sharesPower).toBe('function');
    expect(LEAVES.sharesPower).toMatchObject({ layer: 4, call: 'factsCall', reads: ['npcs'] });
  });
  it('holds for a pair that shares a power, not for one that does not, and is UNANSWERED without its pair', () => {
    const facts = birthFactsOf({ institutions: [], config: {}, tier: 'town' });
    expect(V.atomHolds('shared power', facts, { pair: [a, b] })).toBe(true);
    expect(V.atomHolds('shared power', facts, { pair: [a, c] })).toBe(false);
    expect(V.atomHolds('shared power', facts, {})).toBeUndefined();
    expect(V.atomHolds('shared power', facts)).toBeUndefined();
    const line = { line: () => '', needs: ['shared power'] };
    expect(V.declarationAdmits(V.declarationOf(line), facts, { ctx: { pair: [a, b] } }).admitted).toBe(true);
    expect(V.declarationAdmits(V.declarationOf(line), facts, { ctx: { pair: [a, c] } }).refused).toEqual(['shared power']);
    expect(V.declarationAdmits(V.declarationOf(line), facts).refused).toEqual(['shared power']); // fail-closed
  });
  it('the birth self-check re-asserts it against the FINAL record\'s cards, through its settled view', () => {
    const entry = { pool: 'P', lineId: 3, atoms: ['shared power'], surface: 'relationships', drawKind: 'H', resolvedBy: 'drawn', ctx: { pair: [a, c] } };
    expect(presumptionFindings({ npcs: [a, c] }, [entry])).toEqual([expect.objectContaining({ code: 'false-presumption', atom: 'shared power', answer: 'false' })]);
    expect(presumptionFindings({ npcs: [{ ...a, memberships: [{ power: 'Merchant Guilds' }] }, c] }, [entry])).toEqual([]);
  });
});
