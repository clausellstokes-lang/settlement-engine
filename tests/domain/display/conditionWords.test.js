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

// R3-CODE-C (ROUND-3-CUT #304, MED, rr2s-village-monster_pressure-rand-1, Summary/Foundations): "This reading includes
// the current condition: wartime pressure." in a village whose only crisis is the Beast & Raider Threat. Promotion files
// a beast threat under the war_pressure archetype (conditionPromotion.js :: STRESSOR_ARCHETYPE_RULES), and the sentence
// printed the archetype's label. A condition promoted at generation is the record's crisis: it is named by the crisis's
// own name (the stressors that promote to it); a condition an event or the world pulse wrote keeps its label.
describe('a condition promoted from the town\'s crisis is named by that crisis (ROUND-3-CUT #304)', () => {
  const generated = (archetype, label) => ({ archetype, label, triggeredAt: { tick: 0, sourceEventType: 'GENERATION', sourceEventTargetId: archetype } });

  it('a beast threat is not called wartime pressure', () => {
    const words = activeConditionWords({
      stress: { type: 'monster_pressure', name: 'Beast & Raider Threat' },
      activeConditions: [generated('war_pressure', 'Wartime pressure')],
    });
    expect(words).toEqual(['beast & raider threat']);
    expect(conditionsSentence(words)).toBe('This reading includes the current condition: beast & raider threat.');
  });

  it('two crises, each by its own name, in the record\'s condition order', () => {
    expect(activeConditionWords({
      stress: [{ type: 'under_siege', name: 'Under Siege' }, { type: 'famine', name: 'Famine' }],
      activeConditions: [generated('war_pressure', 'Wartime pressure'), generated('famine', 'Famine pressure')],
    })).toEqual(['under siege', 'famine']);
  });

  it('a condition an event wrote keeps its own label', () => {
    expect(activeConditionWords({
      stress: { type: 'monster_pressure', name: 'Beast & Raider Threat' },
      activeConditions: [{ archetype: 'war_pressure', label: 'Wartime pressure', triggeredAt: { tick: 4, sourceEventType: 'WAR_DECLARED' } }],
    })).toEqual(['wartime pressure']);
  });
});
