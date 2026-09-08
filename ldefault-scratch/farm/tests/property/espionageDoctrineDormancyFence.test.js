/**
 * espionageDoctrineDormancyFence.test.js — ES-5's FOUR-FENCE dormancy set and its lit
 * mutant, over the two surfaces this wave minted.
 *
 * THE TWO SURFACES HAVE DIFFERENT DORMANCY SHAPES AND THE FILE SAYS WHICH IS WHICH, because
 * conflating them is how a fence ends up proving the easy half twice:
 *
 *   THE DOCTRINE STAGE carries the gate itself. `espionageDoctrineFor` refuses at
 *     `espionageActive` and returns null BEFORE it reads an alignment — which is a claim
 *     about a CALL PATH, not about a return value, so FENCE 3 below proves it with a
 *     settlement that throws the moment anybody touches it.
 *   THE VISIBILITY PREDICATE carries NO gate, deliberately: it is a counting function over
 *     rows its caller already holds, and its dormancy is its CONSUMER's. So FENCE 1 runs the
 *     gauntlet stage in both flag states over a world whose errand ledger really does carry
 *     an overdue foreign mission, and proves the count never reaches a dark world.
 *
 * ⚠ EVERY FENCE CARRIES ITS OWN LIVENESS CONTROL. "The dark world produced nothing" is
 * trivially true of a world that would have produced nothing anyway, which is the vacuity
 * shape this estate has shipped before. Each dark assertion below therefore sits beside the
 * SAME fixture read with the flag lit, producing a real doctrine and a real non-zero tell.
 */
import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import {
  dispatchCadenceFor,
  espionageDoctrineFor,
} from '../../src/domain/worldPulse/espionage/espionageDoctrineStage.js';
import { espionageActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import {
  advanceEspionageGauntlet,
  gauntletCatchFactors,
} from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import { envoyErrandsOf } from '../../src/domain/worldPulse/envoyErrand.js';
import { litCovertWorld, mintCovertFixture } from '../helpers/covertMissionFixture.js';

/** @param {unknown} value */
function hash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

const COURT = Object.freeze({
  id: 'irontown',
  settlement: {
    powerStructure: { factions: [{ faction: 'The Syndicate', category: 'criminal', isGoverning: true }] },
  },
});

const SNAPSHOT = Object.freeze({
  settlements: [
    {
      id: 'ashford', name: 'Ashford', crimeRate: 'moderate', safety: 'guarded', wealth: 'moderate', population: 4000,
    },
    {
      id: 'westmarch',
      name: 'Westmarch',
      crimeRate: 'rampant',
      safety: 'lawless',
      wealth: 'poor',
      population: 2500,
      activeConditions: [{ id: 'c1' }, { id: 'c2' }],
    },
  ],
});
const GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'hostile' }],
});

/** THE FOUR DARK SPELLINGS, one world each — absent, false, and truthy-non-true, plus the
 *  spine door dropped on its own. `1` is the truthy-non-true probe the `=== true` reads
 *  exist to refuse. */
const DARK_RULES = Object.freeze({
  absent: { espionageEnabled: undefined },
  false: { espionageEnabled: false },
  truthy: { espionageEnabled: /** @type {unknown} */ (1) },
  spine_dark: { errandSpineEnabled: false },
});

/** @param {Record<string, unknown>} rules */
function world(rules) {
  const built = litCovertWorld(rules);
  if (rules.espionageEnabled === undefined && 'espionageEnabled' in rules) {
    delete built.simulationRules.espionageEnabled;
  }
  return built;
}

describe('ES-5 FENCE 4 — the gate-polarity census, every door dropped on its own', () => {
  test('every dark spelling refuses, and the lit control passes the same conjunction', () => {
    for (const [label, rules] of Object.entries(DARK_RULES)) {
      const ws = world(rules);
      expect(espionageActive(ws), `${label}: the gate`).toBe(false);
      expect(espionageDoctrineFor({ worldState: ws, item: COURT }), `${label}: the stage`).toBeNull();
      expect(dispatchCadenceFor({ worldState: ws, item: COURT, tick: 5, castable: true }).reason)
        .toBe('dark');
    }
    // THE LIT MUTANT (the control). The same court, the same call, the flag on.
    const lit = litCovertWorld();
    expect(espionageActive(lit)).toBe(true);
    expect(espionageDoctrineFor({ worldState: lit, item: COURT }).known).toBe(true);
  });
});

describe('ES-5 FENCE 3 — the call-path spy: a dark stage never reads an alignment', () => {
  test('the settlement is not touched at all while the layer is dark', () => {
    let touches = 0;
    // A settlement that COUNTS being read. `settlementAlignment` reaches `item.settlement`
    // on its very first line, so any composition at all trips this.
    const trap = { id: 'irontown', get settlement() { touches += 1; return COURT.settlement; } };
    expect(espionageDoctrineFor({ worldState: world(DARK_RULES.false), item: trap })).toBeNull();
    expect(touches, 'a dark stage composed an alignment it had no business reading').toBe(0);
    // THE ANCHOR: the identical trap, lit, IS read — so the zero above is the gate and not a
    // getter that never fires.
    expect(espionageDoctrineFor({ worldState: litCovertWorld(), item: trap }).known).toBe(true);
    expect(touches).toBeGreaterThan(0);
  });
});

describe('ES-5 FENCES 1 + 2 — the tell never reaches a dark world', () => {
  /** A world with TWO covert missions: one dwelling at westmarch, one overdue at westmarch.
   *  The overdue row is what the tell counts; the dwelling row is what gets priced. */
  function populated(rules = {}) {
    const first = mintCovertFixture(litCovertWorld(rules), {
      covert: {
        demand: 'confirm',
        product: 'confirm',
        subjectId: 'irontown',
        itinerary: [
          { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
          { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
        ],
      },
    });
    return mintCovertFixture(first.worldState, {
      from: 'harrow',
      to: 'westmarch',
      npcId: 'npc.other',
      legs: [{ fromId: 'harrow', toId: 'westmarch', departTick: 10, arrivalTick: 12 }],
      covert: {
        demand: 'confirm',
        product: 'confirm',
        subjectId: 'westmarch',
        itinerary: [{ face: 'covert', settlementId: 'westmarch', stayTicks: 1 }],
      },
    }).worldState;
  }

  test('FENCE 1 — the stage’s own footprint is byte-identical dark, with a live control', () => {
    const litWorldState = populated();
    // The DARK world is the same ledger under a dark flag: the mint refuses the covert cargo
    // when the spine is dark, so the errand rows themselves differ — which is why the
    // identity claim below is about what the STAGE produced and what it WROTE, not about
    // two ledgers.
    const darkRun = advanceEspionageGauntlet({
      worldState: { ...litWorldState, simulationRules: { ...litWorldState.simulationRules, espionageEnabled: false } },
      tick: 14,
      snapshot: SNAPSHOT,
      regionalGraph: GRAPH,
    });
    expect(darkRun.detections).toEqual([]);
    expect(darkRun.skipped).toEqual([]);
    // LIVENESS CONTROL: the identical fixture, lit, really does detect — and really does
    // carry the ES-5 tell. Without this the empty arrays above prove nothing.
    const litRun = advanceEspionageGauntlet({
      worldState: litWorldState, tick: 14, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    });
    expect(litRun.detections.length).toBeGreaterThan(0);
    const priced = litRun.detections.find((row) => row.stopId === 'westmarch');
    expect(priced.overdueNotables).toBeGreaterThan(0);
    expect(priced.wariness01).toBeGreaterThan(0);
    // And the stage writes nothing in either state — the ledger it was handed comes back
    // untouched, hashed rather than eyeballed.
    expect(hash(envoyErrandsOf(litWorldState)))
      .toBe(hash(envoyErrandsOf(populated())));
  });

  test('FENCE 2 — absent and false are the SAME world to this layer', () => {
    const base = populated();
    const absent = { ...base, simulationRules: { ...base.simulationRules } };
    delete absent.simulationRules.espionageEnabled;
    const asFalse = { ...base, simulationRules: { ...base.simulationRules, espionageEnabled: false } };
    const run = (/** @type {Record<string, unknown>} */ ws) => advanceEspionageGauntlet({
      worldState: ws, tick: 14, snapshot: SNAPSHOT, regionalGraph: GRAPH,
    });
    expect(hash(run(absent))).toBe(hash(run(asFalse)));
    // LIVENESS: the lit reading of the same fixture is DIFFERENT, so the equality above is
    // an equality of two real runs rather than of two identical failures.
    expect(hash(run(base))).not.toBe(hash(run(asFalse)));
  });

  test('the tell is gathered only past the gate — the factor read is never reached dark', () => {
    // `gauntletCatchFactors` has no gate of its own by design (it is the ES-0
    // arguments-not-imports discipline), and this is the statement of where its dormancy
    // actually lives: the STAGE refuses, so the gathering is never called. Proven by the
    // stage's own empty output above; here the gathering is called DIRECTLY to show it is a
    // pure read that answers the same way whatever the flag says, which is exactly why the
    // gate must live one level up.
    const populatedWorld = populated();
    const dark = { ...populatedWorld, simulationRules: { ...populatedWorld.simulationRules, espionageEnabled: false } };
    const args = {
      regionalGraph: GRAPH,
      homeId: 'ashford',
      homeItem: SNAPSHOT.settlements[0],
      targetItem: SNAPSHOT.settlements[1],
      tick: 14,
      dwell: { settlementId: 'westmarch', stopIndex: 1, intervalIdx: 0 },
    };
    expect(gauntletCatchFactors({ ...args, worldState: dark }).overdueNotables)
      .toBe(gauntletCatchFactors({ ...args, worldState: populatedWorld }).overdueNotables);
    expect(gauntletCatchFactors({ ...args, worldState: populatedWorld }).overdueNotables)
      .toBeGreaterThan(0);
  });
});
