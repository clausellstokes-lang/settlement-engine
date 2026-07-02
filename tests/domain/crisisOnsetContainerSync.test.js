/**
 * tests/domain/crisisOnsetContainerSync.test.js
 *
 * crisisOnset writes the merged stress array to EVERY container that already
 * holds one, not just the first. Regression: a pipeline-shaped settlement dual-
 * writes a single stressor under both `stress` and `stressors`; after a first
 * onset both are arrays, and a second onset used to write only the first
 * (`stressors`), leaving the sibling (`stress`) stale — a real divergence.
 */

import { describe, test, expect } from 'vitest';
import { crisisOnset } from '../../src/domain/crisisLifecycle.js';

const onset = (settlement, targetId, label, severity) =>
  crisisOnset({
    settlement,
    event: { id: `e_${targetId}`, type: 'APPLY_STRESSOR', targetId, payload: { stressorType: targetId, label, severity } },
  }).settlement;

const typesOf = (arr) => (Array.isArray(arr) ? arr.map((s) => s.type).sort() : arr);

describe('crisisOnset — stress/stressors container sync', () => {
  test('a second onset keeps stress and stressors in agreement', () => {
    // Pipeline shape: one stressor dual-written as bare objects under both keys.
    const base = {
      tier: 'town',
      population: 2000,
      stress: { type: 'famine', name: 'Famine', severity: 0.5 },
      stressors: { type: 'famine', name: 'Famine', severity: 0.5 },
    };

    const afterFirst = onset(base, 'plague', 'Plague', 0.7);
    expect(typesOf(afterFirst.stress)).toEqual(['famine', 'plague']);
    expect(typesOf(afterFirst.stressors)).toEqual(['famine', 'plague']);

    const afterSecond = onset(afterFirst, 'unrest', 'Unrest', 0.6);
    // Both containers carry all three — no stale sibling.
    expect(typesOf(afterSecond.stress)).toEqual(['famine', 'plague', 'unrest']);
    expect(typesOf(afterSecond.stressors)).toEqual(typesOf(afterSecond.stress));
  });
});
