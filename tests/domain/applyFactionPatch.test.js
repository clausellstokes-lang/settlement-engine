import { describe, expect, test } from 'vitest';

import { applyFactionPatch } from '../../src/domain/worldPulse/factionCompetition.js';

/**
 * Faction candidates bake ABSOLUTE next-values at authoring time, but a proposal-mode
 * outcome can be accepted many ticks later (applyWorldPulseProposal re-routes the
 * STORED outcome through applyFactionPatch). A wholesale replacement rolled live state
 * back to the stale authoring snapshot — dropping every institution captured in
 * between. Proves: lists UNION with live state (accretive, never destructive),
 * lastActedTick is monotonic, and the same-tick (auto) path is unchanged.
 */
const outcome = (factionPatch) => ({ type: 'faction', factionId: 'f1', factionPatch });

describe('applyFactionPatch — late-accepted proposals must not roll back live state', () => {
  test('same-tick apply (patch authored against live state) matches the old replacement exactly', () => {
    const ws = { factionStates: { f1: { controlledInstitutions: ['inst_a'], momentum: 0.2 } } };
    const next = applyFactionPatch(ws, outcome({
      controlledInstitutions: ['inst_a', 'inst_x'],
      momentum: 0.3,
      lastActedTick: 5,
      recentAction: 'capture_institution',
    }));
    expect(next.factionStates.f1).toEqual({
      controlledInstitutions: ['inst_a', 'inst_x'],
      suppressedInstitutions: [],
      momentum: 0.3,
      lastActedTick: 5,
      recentAction: 'capture_institution',
    });
  });

  test('a STALE patch unions with the live lists instead of dropping interim captures', () => {
    // Authored at tick 5 against ['inst_a']; by acceptance the faction also captured
    // inst_b and suppressed inst_s, and acted again at tick 9.
    const ws = {
      factionStates: {
        f1: {
          controlledInstitutions: ['inst_a', 'inst_b'],
          suppressedInstitutions: ['inst_s'],
          lastActedTick: 9,
        },
      },
    };
    const next = applyFactionPatch(ws, outcome({
      controlledInstitutions: ['inst_a', 'inst_x'],
      suppressedInstitutions: [],
      lastActedTick: 5,
    }));
    // The interim capture (inst_b) and suppression (inst_s) survive; the patch's
    // addition (inst_x) lands; the cooldown does not rewind to the authoring tick.
    expect(next.factionStates.f1.controlledInstitutions).toEqual(['inst_a', 'inst_b', 'inst_x']);
    expect(next.factionStates.f1.suppressedInstitutions).toEqual(['inst_s']);
    expect(next.factionStates.f1.lastActedTick).toBe(9);
  });

  test('a patch with no list keys leaves the live lists untouched', () => {
    const ws = { factionStates: { f1: { controlledInstitutions: ['inst_a'], momentum: 0.1 } } };
    const next = applyFactionPatch(ws, outcome({ momentum: 0.4, lastActedTick: 3 }));
    expect(next.factionStates.f1.controlledInstitutions).toEqual(['inst_a']);
    expect(next.factionStates.f1.momentum).toBe(0.4);
    expect(next.factionStates.f1.lastActedTick).toBe(3);
  });

  test('a fresh faction state seeds cleanly from the patch alone', () => {
    const next = applyFactionPatch({}, outcome({ controlledInstitutions: ['inst_x'], lastActedTick: 2 }));
    expect(next.factionStates.f1.controlledInstitutions).toEqual(['inst_x']);
    expect(next.factionStates.f1.suppressedInstitutions).toEqual([]);
    expect(next.factionStates.f1.lastActedTick).toBe(2);
  });

  test('an outcome without a factionId is a no-op', () => {
    const ws = { factionStates: { f1: { momentum: 0.5 } } };
    expect(applyFactionPatch(ws, { type: 'faction' })).toBe(ws);
  });
});
