/**
 * tests/ui/simulationRulesAxes.test.js — pins components-dossier-2: the World-Laws
 * Distance/Travel axes tell the TRUTH on a mapped realm. The map engine shipped, so
 * axisValue must derive Distance/Travel from the real canon gate (spatialCanonVersion),
 * and no option copy may still claim the capability "arrives with the map engine".
 */

import { describe, it, expect } from 'vitest';

import { AXES, axisValue } from '../../src/components/map/SimulationRulesAxes.jsx';

const draft = {}; // untouched campaign — virtual profile

describe('World-Laws Distance/Travel are engine-derived facts', () => {
  it('derives Distance/Travel from the canon gate (mapped realm ⇒ mapped/standard)', () => {
    // Before canonize: distance ignored, travel instant.
    expect(axisValue(draft, 'spatialMode', false)).toBe('ignore');
    expect(axisValue(draft, 'travelMode', false)).toBe('instant');
    // After a spatial canonize (spatialCanonVersion set ⇒ spatialMapped true): the truth.
    expect(axisValue(draft, 'spatialMode', true)).toBe('mapped');
    expect(axisValue(draft, 'travelMode', true)).toBe('standard');
  });

  it('the Distance/Travel axes are flagged derived (read-only, not a choice)', () => {
    const distance = AXES.find(a => a.key === 'spatialMode');
    const travel = AXES.find(a => a.key === 'travelMode');
    expect(distance.derived).toBe(true);
    expect(travel.derived).toBe(true);
  });

  it('no axis option still claims the shipped capability "arrives with the map engine"', () => {
    for (const axis of AXES) {
      for (const [, , description] of axis.options) {
        expect(/arrives with the map engine/i.test(description), `${axis.key}: ${description}`).toBe(false);
        expect(/arrives with geography/i.test(description), `${axis.key}: ${description}`).toBe(false);
      }
    }
  });
});
