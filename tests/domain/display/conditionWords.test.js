/**
 * conditionWords.test.js — THE FOUNDATIONS SENTENCE SAYS ONLY WHAT IS TRUE (the owner,
 * 2026-11-01, ODQ §934.103; rubric R4). The words come from the settlement's own active
 * conditions; no condition, no sentence; one leaf for the screen and for print.
 */
import { describe, it, expect } from 'vitest';
import { activeConditionWords, conditionsSentence } from '../../../src/domain/display/conditionWords.js';

describe('activeConditionWords', () => {
  it('a settlement with no conditions has no words, and the sentence is empty', () => {
    expect(activeConditionWords({ name: 'Testburg' })).toEqual([]);
    expect(activeConditionWords(null)).toEqual([]);
    expect(conditionsSentence([])).toBe('');
  });

  it('names each active condition once, lower-case, in record order', () => {
    const words = activeConditionWords({ activeConditions: [
      { archetype: 'siege' }, { archetype: 'outbreak' }, { archetype: 'siege', label: 'Siege' },
    ] });
    expect(words).toEqual(['siege', 'outbreak']);
    expect(conditionsSentence(words)).toBe('This reading includes the current conditions: siege, outbreak.');
    expect(conditionsSentence(['siege'])).toBe('This reading includes the current condition: siege.');
  });
});
