/**
 * PAGE-7, CAUSES-DATA addendum 3 (the chair, 16:30), item 4: THE {power} FILL, one pure helper beside the sides table
 * (`src/data/tensionSidePower.js :: solePowerNameOf`). Exactly one power of the kind in the document in hand gives its
 * name as a sentence takes it (`data/people/powerSentenceName.js :: powerNameWithArticle`, the names lane's helper);
 * none, or two or more, gives null. Every expected name is COMPUTED through that helper, never quoted.
 */
import { describe, expect, it } from 'vitest';
import { powerNameWithArticle } from '../../src/data/people/powerSentenceName.js';
import { solePowerNameOf } from '../../src/data/tensionSidePower.js';

const doc = (/** @type {Array<Record<string, unknown>>} */ factions) => ({ name: 'Ashford', powerStructure: { factions } });

describe('solePowerNameOf', () => {
  it('one power of the kind: its name as a sentence takes it, inside a sentence or opening one', () => {
    const d = doc([{ faction: 'Merchant League', category: 'economy', isGoverning: true }, { faction: 'Military/Guard', category: 'military' }]);
    expect(solePowerNameOf(d, 'economy')).toBe(powerNameWithArticle('Merchant League'));
    expect(solePowerNameOf(d, 'economy', true)).toBe(powerNameWithArticle('Merchant League', true));
    expect(solePowerNameOf(d, 'military')).toBe(powerNameWithArticle('Military/Guard'));
  });
  it('two economy powers: no name (the cause that needs one does not hold)', () => {
    const d = doc([{ faction: 'Merchant League', category: 'economy', isGoverning: true }, { faction: 'Weavers Guild', category: 'economy' }]);
    expect(solePowerNameOf(d, 'economy')).toBeNull();
  });
  it('the ruler (addendum 4: merchants_rule): the GOVERNING power, however many share its category', () => {
    const d = doc([{ faction: 'Merchant League', category: 'economy', isGoverning: true }, { faction: 'Weavers Guild', category: 'economy' }]);
    expect(solePowerNameOf(d, 'ruler')).toBe(powerNameWithArticle('Merchant League'));
    expect(solePowerNameOf(d, 'ruler', true)).toBe(powerNameWithArticle('Merchant League', true));
    expect(solePowerNameOf(doc([{ faction: 'Weavers Guild', category: 'economy' }]), 'ruler')).toBeNull();
  });
  it('none of the kind, no roster, no document, a nameless power: no name', () => {
    expect(solePowerNameOf(doc([{ faction: 'Military/Guard', category: 'military' }]), 'economy')).toBeNull();
    expect(solePowerNameOf({ name: 'Ashford' }, 'economy')).toBeNull();
    expect(solePowerNameOf(null, 'economy')).toBeNull();
    expect(solePowerNameOf(doc([{ category: 'economy' }]), 'economy')).toBeNull();
  });
});
