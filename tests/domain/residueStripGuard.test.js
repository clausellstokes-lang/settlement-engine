import { describe, test, expect } from 'vitest';

import { findResidueLeaks } from '../../src/domain/worldPulse/residueStripGuard.js';

// Proves the pause-path residue self-check is CORRECT and NON-VACUOUS: it must be silent
// on properly-stripped state (so it never false-alarms the equivalence tests) AND flag a
// leak for every mapped residue type (so a forgotten strip actually reds). This is what
// gives the inline kernel guard its teeth — without it, "all pause tests pass" could just
// mean the guard never checks anything.
const deferred = (candidateType, targetSaveId, extra = {}) => ({ candidateType, targetSaveId, id: `o_${candidateType}`, ...extra });
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
    // Real ledger shape: keyed by the conquered (occupied) id, rung field `state`.
    const ws = { ...clean(), occupations: { beta: { occupierId: 'alpha', state: 'contested' } } };
    const leaks = findResidueLeaks(ws, { channels: [] }, [deferred('conquest', 'beta')]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0]).toContain('occupations[beta]');
  });

  test('vassalization checks the OCCUPIED rung via occupiedSaveId (real ledger shape)', () => {
    // Real major shape: targetSaveId is the OCCUPIER ('alpha'); the residue lives
    // on the OCCUPIED ledger row ('beta', field `state`), named by occupiedSaveId.
    const major = deferred('occupation_vassalized', 'alpha', { occupiedSaveId: 'beta' });
    const vassalized = { ...clean(), occupations: { beta: { occupierId: 'alpha', state: 'vassalized' } } };
    const leaks = findResidueLeaks(vassalized, { channels: [] }, [major]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0]).toContain('occupations[beta]');
    // A lower rung (not yet vassalized) is fine — checks the RUNG, not absence.
    const stabilized = { ...clean(), occupations: { beta: { occupierId: 'alpha', state: 'stabilized' } } };
    expect(findResidueLeaks(stabilized, { channels: [] }, [major])).toEqual([]);
  });

  test('regression: the OLD occupier-keyed / `stage`-field lookup would have missed the leak', () => {
    const major = deferred('occupation_vassalized', 'alpha', { occupiedSaveId: 'beta' });
    // The real leaked ledger: occupied 'beta' left at `state: 'vassalized'`. The old
    // guard read occupations[targetSaveId='alpha']?.stage — 'alpha' isn't even a
    // ledger key, and the field is `state` not `stage`, so it saw nothing. The fixed
    // guard resolves the occupied row and its real field, so it now catches it.
    const leaked = { ...clean(), occupations: { beta: { occupierId: 'alpha', state: 'vassalized' } } };
    expect(findResidueLeaks(leaked, { channels: [] }, [major])).toHaveLength(1);
  });

  test('an unmapped candidateType is unchecked — the guard is a lower bound, never a false alarm', () => {
    const ws = { ...clean(), warPosture: { alpha: { state: 'war_preparation' } } };
    expect(findResidueLeaks(ws, { channels: [] }, [deferred('some_future_layer', 'alpha')])).toEqual([]);
  });
});
