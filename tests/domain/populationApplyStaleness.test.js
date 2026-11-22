/**
 * populationApplyStaleness.test.js — the migration apply-side staleness re-verify.
 *
 * A mass-emigration outcome can be applied many ticks after it was generated (a
 * long-parked proposal). The source side always clamped at zero, but the paired
 * destination credits used to land IN FULL — minting people out of thin air. The
 * re-verify records the REALIZED debit fraction when the source applies (the apply
 * pass hands source first — populationDeltas order) and scales every destination
 * credit by it, floored, so Σ credits ≤ the people who actually left.
 */
import { describe, expect, test } from 'vitest';

import { applyPopulationOutcomeToSettlement } from '../../src/domain/worldPulse/populationDynamics.js';

function emigrationOutcome({ sourceDebit = 1000, credits = [['destA', 300], ['destB', 150]] } = {}) {
  return {
    id: 'candidate.population.emigration.src.4',
    type: 'population',
    candidateType: 'population_emigration',
    targetSaveId: 'src',
    generatedAtTick: 4,
    headline: 'Src population may fall',
    populationDeltas: [
      { saveId: 'src', delta: -sourceDebit, reason: 'loss' },
      ...credits.map(([saveId, delta]) => ({ saveId, delta, reason: 'migration' })),
    ],
    metadata: { populationKind: 'emigration', migrants: credits.reduce((s, [, d]) => s + d, 0) },
  };
}

describe('applyPopulationOutcomeToSettlement — migration staleness re-verify', () => {
  test('a stale debit clamps to the current source population AND scales destination credits (conservation)', () => {
    const outcome = emigrationOutcome(); // -1000 src; +300 destA; +150 destB
    // The source shrank to 200 people while the proposal was parked.
    const src = applyPopulationOutcomeToSettlement({ population: 200 }, outcome, 'src');
    expect(src.population).toBe(0);
    expect(src.populationHistory.at(-1).delta).toBe(-200); // the REALIZED debit, not the stored one
    // Destinations receive credits scaled by the realized fraction (200/1000), floored.
    const destA = applyPopulationOutcomeToSettlement({ population: 1000 }, outcome, 'destA');
    const destB = applyPopulationOutcomeToSettlement({ population: 500 }, outcome, 'destB');
    expect(destA.population).toBe(1060); // floor(300 * 0.2)
    expect(destB.population).toBe(530);  // floor(150 * 0.2)
    // Conservation: credited people never exceed the people who actually left.
    expect((destA.population - 1000) + (destB.population - 500)).toBeLessThanOrEqual(200);
  });

  test('a FULLY stale debit (source already empty) zeroes every destination credit with no history entry', () => {
    const outcome = emigrationOutcome();
    const src = applyPopulationOutcomeToSettlement({ population: 0 }, outcome, 'src');
    expect(src.population).toBe(0);
    expect(src.populationHistory).toBeUndefined(); // no phantom history entry
    const destA = applyPopulationOutcomeToSettlement({ population: 1000 }, outcome, 'destA');
    expect(destA.population).toBe(1000);
    expect(destA.populationHistory).toBeUndefined();
  });

  test('a FRESH (non-stale) outcome is byte-identical to the legacy apply', () => {
    const outcome = emigrationOutcome();
    const src = applyPopulationOutcomeToSettlement({ population: 5000 }, outcome, 'src');
    expect(src.population).toBe(4000);
    expect(src.populationHistory.at(-1).delta).toBe(-1000);
    const destA = applyPopulationOutcomeToSettlement({ population: 1000 }, outcome, 'destA');
    const destB = applyPopulationOutcomeToSettlement({ population: 500 }, outcome, 'destB');
    expect(destA.population).toBe(1300); // full credit
    expect(destB.population).toBe(650);  // full credit
  });

  test('a destination applied WITHOUT a source record keeps the legacy full credit (fallback)', () => {
    // A fresh outcome object whose source was never applied (e.g. the source
    // settlement is missing from the settlement map) — no realized fraction is
    // recorded, so the destination falls back to the stored credit.
    const outcome = emigrationOutcome();
    const destA = applyPopulationOutcomeToSettlement({ population: 1000 }, outcome, 'destA');
    expect(destA.population).toBe(1300);
  });

  test('growth/decline outcomes (no migration credits) are untouched by the re-verify', () => {
    const outcome = {
      candidateType: 'population_decline',
      targetSaveId: 'src',
      populationDeltas: [{ saveId: 'src', delta: -300, reason: 'loss' }],
    };
    const next = applyPopulationOutcomeToSettlement({ population: 100 }, outcome, 'src');
    expect(next.population).toBe(0); // clamp-at-zero (legacy behaviour preserved)
    expect(next.populationHistory.at(-1).delta).toBe(-300); // legacy recorded delta unchanged
  });
});

// flow_migration has the SAME paired source-debit/dest-credit structure as
// population_emigration, but its targetSaveId is the DESTINATION (not the source) —
// so the staleness re-verify must key the debit on `delta < 0`, not on targetSaveId,
// or a parked refugee proposal whose source shrank mints phantom people at the dest.
function flowMigrationOutcome({ sourceDebit = 960, sourceId = 'A', destId = 'B' } = {}) {
  return {
    id: 'candidate.flow.migration.A.B.10',
    type: 'condition',
    candidateType: 'flow_migration',
    targetSaveId: destId, // the DESTINATION (the flow_migration quirk that broke the old guard)
    generatedAtTick: 10,
    headline: `Refugees from ${sourceId} reach ${destId}`,
    populationDeltas: [
      { saveId: sourceId, delta: -sourceDebit, reason: 'flee' },
      { saveId: destId, delta: sourceDebit, reason: 'arrive' },
    ],
    metadata: { flowKind: 'population', from: sourceId, to: destId },
  };
}

describe('applyPopulationOutcomeToSettlement — flow_migration conservation (parked proposal)', () => {
  test('a stale flow_migration scales the destination credit even though targetSaveId is the DESTINATION', () => {
    const outcome = flowMigrationOutcome({ sourceDebit: 960 }); // A: -960, B: +960
    // A shrank to 700 while the proposal was parked. Source applies FIRST.
    const src = applyPopulationOutcomeToSettlement({ population: 700 }, outcome, 'A');
    expect(src.population).toBe(0);
    expect(src.populationHistory.at(-1).delta).toBe(-700); // realized, not the stored -960
    // Destination is credited by the realized fraction (700/960), floored — not the full 960.
    const dest = applyPopulationOutcomeToSettlement({ population: 5000 }, outcome, 'B');
    expect(dest.population).toBe(5700); // 5000 + floor(960 * 700/960)
    // Conservation: arrivals never exceed the people who actually left.
    expect(dest.population - 5000).toBeLessThanOrEqual(700);
  });

  test('a FRESH flow_migration conserves world population exactly', () => {
    const outcome = flowMigrationOutcome({ sourceDebit: 960 });
    const src = applyPopulationOutcomeToSettlement({ population: 12000 }, outcome, 'A');
    expect(src.population).toBe(11040); // -960 in full
    const dest = applyPopulationOutcomeToSettlement({ population: 5000 }, outcome, 'B');
    expect(dest.population).toBe(5960); // +960 in full
    expect((src.population - 12000) + (dest.population - 5000)).toBe(0); // conserved
  });
});
