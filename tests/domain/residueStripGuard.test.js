import { describe, test, expect } from 'vitest';

import { findResidueLeaks } from '../../src/domain/worldPulse/residueStripGuard.js';

// Proves the pause-path residue self-check is CORRECT and NON-VACUOUS: it must be silent
// on properly-stripped state (so it never false-alarms the equivalence tests) AND flag a
// leak for every mapped residue type (so a forgotten strip actually reds). This is what
// gives the inline kernel guard its teeth — without it, "all pause tests pass" could just
// mean the guard never checks anything.
const deferred = (candidateType, targetSaveId) => ({ candidateType, targetSaveId, id: `o_${candidateType}` });
const clean = () => ({ warPosture: {}, deployments: {}, occupations: {} });

describe('residueStripGuard.findResidueLeaks — detection is real', () => {
  test('cleanly-stripped state yields no leaks (no false alarm)', () => {
    const ws = clean();
    const graph = { channels: [] };
    expect(findResidueLeaks(ws, graph, [deferred('war_mobilization', 'alpha')])).toEqual([]);
    expect(findResidueLeaks(ws, graph, [deferred('conquest', 'beta')])).toEqual([]);
    expect(findResidueLeaks(ws, graph, [deferred('strategy_deploy', 'alpha')])).toEqual([]);
  });

  test('leaked warPosture for a paused war_mobilization is detected', () => {
    const ws = { ...clean(), warPosture: { alpha: { state: 'war_preparation' } } };
    const leaks = findResidueLeaks(ws, { channels: [] }, [deferred('war_mobilization', 'alpha')]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0]).toContain('warPosture[alpha]');
  });

  test('leaked information_flow channel for a paused war_mobilization is detected', () => {
    const graph = { channels: [{ type: 'information_flow', from: 'alpha', to: 'beta' }] };
    const leaks = findResidueLeaks(clean(), graph, [deferred('war_mobilization', 'alpha')]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0]).toContain('information_flow');
  });

  test('leaked deployment for a paused strategy_deploy is detected', () => {
    const ws = { ...clean(), deployments: { alpha: { targetId: 'beta' } } };
    const leaks = findResidueLeaks(ws, { channels: [] }, [deferred('strategy_deploy', 'alpha')]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0]).toContain('deployments[alpha]');
  });

  test('leaked occupation for a paused conquest is detected', () => {
    const ws = { ...clean(), occupations: { beta: { stage: 'contested' } } };
    const leaks = findResidueLeaks(ws, { channels: [] }, [deferred('conquest', 'beta')]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0]).toContain('occupations[beta]');
  });

  test('vassalization checks the RUNG, not absence: vassalized reds, contested is fine', () => {
    const vassalized = { ...clean(), occupations: { beta: { stage: 'vassalized' } } };
    expect(findResidueLeaks(vassalized, { channels: [] }, [deferred('occupation_vassalized', 'beta')])).toHaveLength(1);
    const contested = { ...clean(), occupations: { beta: { stage: 'contested' } } };
    expect(findResidueLeaks(contested, { channels: [] }, [deferred('occupation_vassalized', 'beta')])).toEqual([]);
  });

  test('an unmapped candidateType is unchecked — the guard is a lower bound, never a false alarm', () => {
    const ws = { ...clean(), warPosture: { alpha: { state: 'war_preparation' } } };
    expect(findResidueLeaks(ws, { channels: [] }, [deferred('some_future_layer', 'alpha')])).toEqual([]);
  });
});
