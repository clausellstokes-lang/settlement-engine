import { describe, expect, test } from 'vitest';

import {
  classifyFeasibility,
  feasibilityRatio,
  verdictPermitsSiege,
  verdictAllowsHarassment,
  defenderHasCollapseSignal,
  FEASIBILITY_TUNING,
} from '../../src/domain/worldPulse/feasibilityGate.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B1 — the HARD FEASIBILITY GATE (a DETERMINISTIC classifier in front of the
// siege RNG). "A thorpe must NOT be able to siege a fortified city on a lucky roll."
// Every classification is a pure function of the capacities + the defender's live
// state — no rng — so the verdict for a given matchup is reproducible.
// ─────────────────────────────────────────────────────────────────────────────

describe('feasibility gate — the deterministic classifier', () => {
  test('a thorpe vs a fortified city is NEVER plausible — it auto-fails (no roll), across the whole low band', () => {
    // A tiny attacker (capacity ~10) against a fortified city (capacity ~80).
    for (let a = 4; a <= 14; a += 1) {
      const { verdict } = classifyFeasibility({ attackerCurrent: a, defenderCurrent: 80, coalitionSize: 1 });
      expect(verdictPermitsSiege(verdict)).toBe(false); // it CANNOT go to RNG
      expect(['auto_fail', 'harassment']).toContain(verdict);
    }
  });

  test('an utterly hopeless ratio is auto_fail (not even harassment)', () => {
    const { verdict, ratio } = classifyFeasibility({ attackerCurrent: 6, defenderCurrent: 90 });
    expect(verdict).toBe('auto_fail');
    expect(ratio).toBeLessThan(FEASIBILITY_TUNING.HOPELESS_CEILING);
  });

  test('a peer matchup IS plausible — it goes to the siege roll', () => {
    const { verdict } = classifyFeasibility({ attackerCurrent: 60, defenderCurrent: 55 });
    expect(verdict).toBe('plausible');
    expect(verdictPermitsSiege(verdict)).toBe(true);
  });

  test('a solo attacker in the coalition band cannot go alone (require_coalition), but a coalition can', () => {
    // ratio in [HARASSMENT_FLOOR, PLAUSIBLE_FLOOR) — close, but not enough solo.
    const solo = classifyFeasibility({ attackerCurrent: 45, defenderCurrent: 65, coalitionSize: 1 });
    expect(solo.verdict).toBe('require_coalition');
    expect(verdictPermitsSiege(solo.verdict)).toBe(false);

    // The SAME defender, but the COALITION sum clears the plausible floor → plausible.
    const coalition = classifyFeasibility({ attackerCurrent: 65, defenderCurrent: 65, coalitionSize: 3 });
    expect(coalition.verdict).toBe('plausible');
  });

  test('require_betrayal: a weak attacker only gets a shot when the defender is internally fractured', () => {
    const args = { attackerCurrent: 40, defenderCurrent: 70 };
    // No collapse → blocked (require_coalition / harassment).
    expect(verdictPermitsSiege(classifyFeasibility(args).verdict)).toBe(false);
    // A defender carrying a coup condition → require_betrayal → CAN roll.
    const fractured = classifyFeasibility({
      ...args,
      defenderItem: { settlement: { activeConditions: [{ archetype: 'coup_detat', severity: 0.6 }] } },
    });
    expect(fractured.verdict).toBe('require_betrayal');
    expect(verdictPermitsSiege(fractured.verdict)).toBe(true);
  });

  test('require_magic: a decisive war-magic edge tips an otherwise-implausible solo siege', () => {
    const base = { attackerCurrent: 28, defenderCurrent: 55 };
    expect(verdictPermitsSiege(classifyFeasibility(base).verdict)).toBe(false);
    const arcane = classifyFeasibility({
      ...base,
      attackerFacets: { materiel: 90 },
      defenderFacets: { materiel: 50 },
    });
    expect(arcane.verdict).toBe('require_magic');
    expect(verdictPermitsSiege(arcane.verdict)).toBe(true);
  });

  test('the classifier is a PURE function — same inputs, same verdict (reproducible, no rng)', () => {
    const args = { attackerCurrent: 50, defenderCurrent: 55, coalitionSize: 2, defenderItem: { settlement: {} } };
    const a = classifyFeasibility(args);
    const b = classifyFeasibility(args);
    expect(a).toEqual(b);
  });

  test('harassment verdict allows raiding; plausible/auto_fail do not', () => {
    expect(verdictAllowsHarassment('harassment')).toBe(true);
    expect(verdictAllowsHarassment('plausible')).toBe(false);
    expect(verdictAllowsHarassment('auto_fail')).toBe(false);
  });

  test('home-ground advantage tilts the ratio toward the defender', () => {
    // Equal raw capacities → ratio < 1 (the defender holds home ground).
    expect(feasibilityRatio(50, 50)).toBeLessThan(1);
    expect(feasibilityRatio(50, 50)).toBeCloseTo(1 / FEASIBILITY_TUNING.HOME_GROUND_MULTIPLIER, 5);
  });

  test('a fragile-legitimacy defender counts as an internal-collapse signal', () => {
    expect(defenderHasCollapseSignal({ settlement: { powerStructure: { publicLegitimacy: { score: 15 } } } })).toBe(true);
    expect(defenderHasCollapseSignal({ settlement: { powerStructure: { publicLegitimacy: { score: 70 } } } })).toBe(false);
  });
});
