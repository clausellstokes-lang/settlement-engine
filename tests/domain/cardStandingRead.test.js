/**
 * cardStandingRead.test.js — PAGE-1 CARD (F4; docs/chair/2026-11-20/content/page/briefs/BUILD.md §CARD): A PERSON'S
 * STANDING IS READ FROM THE RECORD'S FACTS, NEVER FROM THE STORED `influence`.
 *
 * The stored `influence` is a keyword match on the pool role (npcGenerator.js:59-76; 88.6% of cards "low"), so the card's
 * dots and its "Standing marginal" carried a machine's error. The leaf says the fact instead: the powers the card stands
 * FIRST of (`memberships[].rank === 1`) and each power's weight HERE, read from the record's own figure for it
 * (`powerStructure.factions[].power`, the final share the Power tab orders its roster by). A card in no power, or first
 * of none, has no line. Pure; the record does not move.
 */
import { describe, expect, it } from 'vitest';
import { cardStandingLine, cardFirstOfWeights, powerWeightHere } from '../../src/domain/display/cardStandingRead.js';

/** @param {Array<[string, number]>} rows */
const townOf = (rows) => ({ powerStructure: { factions: rows.map(([faction, power]) => ({ faction, power })) } });

describe('the weight of a power here, from its own figure among the town\'s powers', () => {
  const five = townOf([['Council', 40], ['Guilds', 22], ['Temple', 18], ['Watch', 12], ['Thieves', 8]]);
  it('reads the place of the power in the town, strongest first', () => {
    expect(powerWeightHere(five, 'Council')).toBe('the strongest power here');
    expect(powerWeightHere(five, 'Guilds')).toBe('the second strongest power here');
    expect(powerWeightHere(five, 'Temple')).toBe('the third strongest power here');
    expect(powerWeightHere(five, 'Watch')).toBe('one of the lesser powers here');
    expect(powerWeightHere(five, 'Thieves')).toBe('the weakest power here');
  });
  it('says a tie as a tie', () => {
    const t = townOf([['A', 30], ['B', 30], ['C', 20], ['D', 10], ['E', 10]]);
    expect(powerWeightHere(t, 'A')).toBe('the joint strongest power here');
    expect(powerWeightHere(t, 'B')).toBe('the joint strongest power here');
    expect(powerWeightHere(t, 'C')).toBe('the third strongest power here');
    expect(powerWeightHere(t, 'D')).toBe('the joint weakest power here');
  });
  it('a town of one or two powers says so', () => {
    expect(powerWeightHere(townOf([['Elders', 100]]), 'Elders')).toBe('the only power here');
    const two = townOf([['Elders', 70], ['Kin', 30]]);
    expect(powerWeightHere(two, 'Elders')).toBe('the stronger power here');
    expect(powerWeightHere(two, 'Kin')).toBe('the weaker power here');
    expect(powerWeightHere(townOf([['Elders', 50], ['Kin', 50]]), 'Kin')).toBe('as strong as the other power here');
  });
  it('a power the record does not hold, or holds with no figure, has no weight (never a new fact)', () => {
    expect(powerWeightHere(five, 'Nobody')).toBeNull();
    expect(powerWeightHere({ powerStructure: { factions: [{ faction: 'A' }, { faction: 'B', power: 9 }] } }, 'A')).toBeNull();
    expect(powerWeightHere(null, 'A')).toBeNull();
  });
});

describe('the card\'s standing line', () => {
  const town = townOf([['Council', 40], ['Guilds', 35], ['Temple', 25]]);
  it('first of a power: the fact and the power\'s weight here', () => {
    const card = { influence: 'low', memberships: [{ power: 'Guilds', rank: 1 }, { power: 'Temple', rank: 2 }] };
    expect(cardStandingLine(card, town)).toBe('first of Guilds, the second strongest power here');
    expect(cardFirstOfWeights(card, town)).toEqual([{ power: 'Guilds', weightHere: 'the second strongest power here' }]);
  });
  it('first of two powers: both, in the card\'s own power order', () => {
    const card = { memberships: [{ power: 'Temple', rank: 1 }, { power: 'Council', rank: 1 }] };
    expect(cardStandingLine(card, town)).toBe('first of Council, the strongest power here; first of Temple, the third strongest power here');
  });
  it('the stored influence is never read: high, moderate or low, the line is the same', () => {
    const base = { memberships: [{ power: 'Council', rank: 1 }] };
    const lines = ['high', 'moderate', 'low', undefined].map((influence) => cardStandingLine({ ...base, influence }, town));
    expect(new Set(lines).size).toBe(1);
  });
  it('a keeper in no power, a member ranked below first, a power with no figure: no line', () => {
    expect(cardStandingLine({ influence: 'high' }, town)).toBeNull();
    expect(cardStandingLine({ memberships: [{ power: 'Council', rank: 2 }, { power: 'Guilds' }] }, town)).toBeNull();
    expect(cardStandingLine({ memberships: [{ power: 'Elsewhere', rank: 1 }] }, town)).toBeNull();
    expect(cardStandingLine(null, null)).toBeNull();
  });
});
