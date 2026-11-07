/**
 * tests/domain/facts/warState.test.js — CENSUS-1 wave 0, fact 10: THE WAR-STATE HOME (a new reader).
 * @enforced-by npx vitest run tests/domain/facts/warState.test.js
 */
import { describe, expect, it } from 'vitest';
import { warStateOf, WAR_STATES } from '../../../src/domain/facts/warState.js';

describe('the war-state home (CENSUS-1 fact 10)', () => {
  it('a lone record answers from its crisis record', () => {
    expect(warStateOf({ stress: [{ type: 'under_siege' }] })).toBe('front');
    expect(warStateOf({ stress: [{ type: 'wartime' }] })).toBe('at war');
    expect(warStateOf({ stress: [{ type: 'occupied' }] })).toBe('at war');
    expect(warStateOf({ stress: [{ type: 'famine' }] })).toBe('peace');
    expect(warStateOf({})).toBe('peace');
    expect(WAR_STATES).toHaveLength(4);
  });

  it('with no live war in the world, the record answers', () => {
    expect(warStateOf({ stress: [{ type: 'wartime' }] }, { worldState: { tick: 1 }, settlementId: 's1' })).toBe('at war');
  });
});
