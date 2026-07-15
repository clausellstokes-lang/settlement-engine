/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// F1 BETA-HARDENING — long-run SOAK SUMMARY for the B-track SURFACING layer.
//
// The engine-side soaks (occupation.test.js, statefulArmies.test.js,
// mobilizationPulse.integration.test.js, tradeWar.test.js) already pin that the
// SIMULATION converges (wars end, occupations don't snowball, no oscillation).
// This soak pins that the SURFACING layer stays well-behaved over the SAME long
// run: the display read-models never throw, stay bounded, stay heuristic, and
// the surfaced occupation view respects the anti-snowball containment cap (a
// greedy occupier's surfaced holdings reads as "stretched thin", never as ever-
// growing strength). It reuses the real engine occupation loop.
// ─────────────────────────────────────────────────────────────────────────────

import { evaluateOccupations, createOccupationRecord, computeOccupierBenefit, OCCUPATION_TUNING } from '../../../src/domain/worldPulse/occupation.js';
import { occupationStandings, occupierHoldings, settlementOccupation } from '../../../src/domain/display/occupationStatus.js';
import { mobilizationStandings, settlementMobilization } from '../../../src/domain/display/mobilizationStatus.js';
import { deployedArmyStandings } from '../../../src/domain/display/armyStrength.js';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 4000,
    config: { tradeRouteAccess: 'road' },
    institutions: patch.institutions || [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }] },
    activeConditions: [],
  };
}

function makeSnapshot(ids) {
  const byId = new Map();
  for (const id of ids) byId.set(id, { id, name: `Name-${id}`, settlement: settlement(`Name-${id}`) });
  return { byId, regionalGraph: { channels: [], edges: [] } };
}

describe('B-track surfacing soak — occupation view stays bounded + convergent', () => {
  test('a greedy occupier holding many settlements never reads as unbounded strength', () => {
    // One occupier 'emp' holds 8 occupations. Run the engine occupation loop many
    // ticks, surfacing each tick. The surfaced holdings must converge to a bounded
    // read (stretched thin), never a runaway count of "paying" holdings, and the
    // engine benefit must stay HARD-CAPPED (the anti-snowball guarantee, surfaced).
    const occupiedIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ids = ['emp', ...occupiedIds];
    const snapshot = makeSnapshot(ids);
    let worldState = { occupations: {} };
    for (const oid of occupiedIds) worldState.occupations[oid] = createOccupationRecord('emp', 0);

    const nameFor = (id) => `Name-${id}`;
    let maxSurfacedBenefit = 0;
    let everThrew = false;

    for (let t = 1; t <= 30; t += 1) {
      let out;
      try {
        out = evaluateOccupations({
          snapshot, worldState, graph: snapshot.regionalGraph, deployments: {},
          warOutcomes: [], returnOutcomes: [], tick: t, rules: { warLayerEnabled: true },
        });
      } catch {
        everThrew = true;
        break;
      }
      worldState = { occupations: out.occupations };

      // Surface every tick — the read-models must never throw and stay heuristic.
      const standings = occupationStandings({ worldState, nameFor });
      const holdings = occupierHoldings({ settlementId: 'emp', worldState, nameFor });
      for (const oid of occupiedIds) settlementOccupation({ settlementId: oid, worldState, nameFor });

      // The surfaced count never exceeds the seeded occupations (no phantom growth).
      expect(standings.length).toBeLessThanOrEqual(occupiedIds.length);
      // A greedy occupier always reads as stretched thin (≥3 holdings) — the
      // overextension/containment property, surfaced. (Until it loses some.)
      if (holdings && holdings.holds.length >= 3) {
        expect(holdings.stretchedThin).toBe(true);
      }

      // The ENGINE benefit stays hard-capped — the anti-snowball, observed through
      // the run (this is what the surfacing promises the DM is true).
      const { perOccupier } = computeOccupierBenefit(worldState.occupations, (id) => snapshot.byId.get(String(id)));
      maxSurfacedBenefit = Math.max(maxSurfacedBenefit, perOccupier.emp || 0);
    }

    expect(everThrew).toBe(false);
    // The benefit NEVER exceeds the containment cap across the whole run — the
    // snowball cannot start, and the surfacing reflects a bounded world.
    expect(maxSurfacedBenefit).toBeLessThanOrEqual(OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT + 1e-9);
  });
});

describe('B-track surfacing soak — mobilization + army views stay heuristic + inert when wound down', () => {
  test('a mobilization that ramps then stands down surfaces nothing once at peace', () => {
    const nameFor = (id) => `Name-${id}`;
    // Simulate a posture ledger evolving rung-by-rung, then winding back to peace.
    const sequence = ['war_preparation', 'mobilized', 'deployed', 'demobilizing', 'peace'];
    for (const state of sequence) {
      const worldState = { warPosture: { x: { state, progress: 0.5, sinceTick: 0 } } };
      const single = settlementMobilization({ settlementId: 'x', worldState, nameFor });
      const standings = mobilizationStandings({ worldState });
      if (state === 'peace') {
        expect(single).toBeNull();
        expect(standings).toEqual([]);
      } else {
        // Surfaced — and always heuristic (no raw enum token in the phrase).
        expect(single).not.toBeNull();
        expect(single.phrase).not.toContain('_');
      }
    }
  });

  test('deployed-army strength surfaces a degrading army without throwing across a run', () => {
    const nameFor = (id) => `Name-${id}`;
    let current = 100;
    let prevWeakened = false;
    for (let t = 0; t < 20; t += 1) {
      current = Math.max(0, current - 5); // attrition each tick
      const worldState = { deployments: { a: { targetId: 'b', maxStartStrength: 100, currentEffectiveStrength: current, supplyIntegrity: 0.5, morale: 0.5, foodReserve: 0.5 } } };
      const standings = deployedArmyStandings({ worldState, nameFor });
      expect(standings.length).toBe(1);
      // Once weakened, it stays weakened (monotone degradation — no oscillation).
      if (prevWeakened) expect(standings[0].weakened).toBe(true);
      prevWeakened = standings[0].weakened;
      // Heuristic: no raw float in the surfaced phrase.
      expect(standings[0].remainingPhrase).not.toMatch(/0\.\d/);
    }
  });
});
