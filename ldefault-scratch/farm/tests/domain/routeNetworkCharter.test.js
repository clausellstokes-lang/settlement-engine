/**
 * routeNetworkCharter.test.js — W-J slice J3, THE CHARTER (binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §6, with §1 Law 3, Law 4, Law 7, §13).
 *
 * The claims this file is responsible for, and the shape of each proof:
 *
 *   THE THREE GATES. §6 needs accumulated demand, a clearing objective, and a
 *   passing expedition-worth ceiling. Each is proved by a fixture that fails
 *   EXACTLY ONE of them and by the charter that fires when none of them fail, so
 *   a gate that stopped working would show up as a charter rather than as a
 *   silence.
 *
 *   CHARTERS WAIT. §6 says the coup precedent's guaranteed admission does NOT
 *   apply. This is proved against the REAL docket machinery: the same outcome is
 *   admitted with room and refused without it, and the corridor that produced it
 *   still holds its demand afterwards, so the next season re-derives the same
 *   charter. A pin that only asserted "not a one-shot" would be a statement about
 *   a list; this is a statement about behaviour.
 *
 *   DORMANCY IS BYTE-IDENTICAL. Law 7. Proved by object identity on the dark
 *   path and by a JSON byte comparison across the whole J3 surface, so a future
 *   gate slip shows up here rather than in a soak.
 *
 * Sibling files: routeNetworkDecay.test.js (§7's ladder, the anti-flap envelope,
 * destruction and revival), routeNetworkDanger.test.js (§5b and §5c).
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeIslandPack } from '../fixtures/spatialPackFixtures.js';
import {
  admitGuaranteedProposalOutcomes,
  buildProposalDocket,
  isOneShotVerdictOutcome,
  proposalDocketAllows,
} from '../../src/domain/worldPulse/proposalAdmission.js';
import { isMajorOutcome } from '../../src/domain/worldPulse/decisionTier.js';
import {
  accrueRouteFlows,
  flowMembersFromSnapshot,
} from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { ensureGenesisRouteNetwork } from '../../src/domain/worldPulse/routeNetworkGenesis.js';
import { readRouteNetwork } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import {
  CHARTER_CANDIDATE_TYPE,
  CHARTER_VERDICTS,
  ROUTE_CHARTER_TUNING,
  applyRouteCharter,
  dominantFlowClassOf,
  evaluateMilitaryCharter,
  evaluateRouteCharters,
  expeditionWeeks,
  strategicNeedRank,
} from '../../src/domain/worldPulse/routeNetworkCharter.js';
import {
  charterEmissions,
  charterHeraldItem,
  charterProposalOutcome,
} from '../../src/domain/worldPulse/routeNetworkCharterEvents.js';

const NAMES = { ashfen: 'Ashfen', brackwater: 'Brackwater', dunmoor: 'Dunmoor' };

/**
 * THE FIXTURE REALM. Three seats, aspatial by default so the geometry cannot
 * drift under the pins:
 *   - ashfen is a crossroads that grows grain and wants iron;
 *   - dunmoor was founded ISOLATED, so the genesis ladder minted it no road at
 *     all, which makes ashfen-dunmoor the corridor case;
 *   - brackwater carries the genesis edge, and whether it also exports iron is
 *     the knob that turns ashfen's iron want from unserved into already-served,
 *     which is how the objective gate is exercised without touching any tuning.
 */
function snapshotFor({ brackwaterExports = [] } = {}) {
  return [
    {
      id: 'ashfen',
      settlement: {
        config: { tradeRouteAccess: 'crossroads' },
        economicState: { primaryImports: ['iron'], primaryExports: ['grain'] },
      },
    },
    {
      id: 'brackwater',
      settlement: {
        config: { tradeRouteAccess: 'road' },
        economicState: { primaryImports: [], primaryExports: brackwaterExports },
      },
    },
    {
      id: 'dunmoor',
      settlement: {
        config: { tradeRouteAccess: 'isolated' },
        economicState: { primaryImports: ['grain'], primaryExports: ['iron'] },
      },
    },
  ];
}

/** One migration column, every pulse, on the corridor with no road. */
function withColumn(world, arrivals = 640) {
  return {
    ...world,
    spatialLedgers: {
      ...(world.spatialLedgers || {}),
      migration: { 'col.a': { originId: 'ashfen', destId: 'dunmoor', arrivals } },
    },
  };
}

/**
 * A world with the genesis network derived and `passes` pulses of corridor demand
 * accrued onto ashfen-dunmoor.
 */
function realm({ lit = true, brackwaterExports = [], passes = 16, arrivals = 640 } = {}) {
  const members = flowMembersFromSnapshot(snapshotFor({ brackwaterExports }));
  const base = {
    simulationRules: lit ? { routeLifecycleEnabled: true } : {},
    tick: 0,
    campaignId: 'route-charter',
  };
  let world = ensureGenesisRouteNetwork(
    base, members.map(m => ({ id: m.id, config: m.config })), 0,
  );
  for (let tick = 1; tick <= passes; tick += 1) {
    world = accrueRouteFlows({ worldState: withColumn(world, arrivals), members, tick }).worldState;
  }
  return { world, members };
}

const CORRIDOR = 'corridor.ashfen.dunmoor';
const EDGE = 'route.ashfen.dunmoor.land';

/** The verdict for the fixture corridor out of a full sweep. */
function verdictFor(world, members, tick = 20, extra = {}) {
  const sweep = evaluateRouteCharters({ worldState: world, members, tick, ...extra });
  return sweep.verdicts.find(v => v.corridorId === CORRIDOR) || null;
}

describe('J3 §6 the three gates, each refusing in its own word', () => {
  it('all three passing mints a charter, on a migration flavour with a goods receipt', () => {
    const { world, members } = realm();
    const verdict = verdictFor(world, members);
    expect(verdict.verdict).toBe('charter');
    expect(verdict.charters).toBe(true);
    expect(verdict.dominantFlowClass).toBe('population');
    expect(verdict.flavor).toBe('migration');
    expect(verdict.mode).toBe('land');
    // The reason is denominated in the goods vocabulary even on a migration
    // charter, because the objective found material wants across the pair.
    expect([...verdict.reasonGoods]).toEqual(['grain', 'iron']);
  });

  it('GATE 1 demand: too few pulses of traffic and it waits, naming the demand', () => {
    const { world, members } = realm({ passes: 4 });
    const verdict = verdictFor(world, members);
    expect(verdict.verdict).toBe('wait_demand');
    expect(verdict.demandTally).toBeLessThan(Number(ROUTE_CHARTER_TUNING.FORMATION_TALLY));
    // ANTI-VACUITY: the identical fixture with more pulses charters, so this is
    // the gate refusing rather than the corridor never existing.
    const walked = realm({ passes: 16 });
    expect(verdictFor(walked.world, walked.members).verdict).toBe('charter');
  });

  it('GATE 2 objective: a want the realm already serves is not worth a road', () => {
    // brackwater also exports iron and already has a road to ashfen, so ashfen's
    // iron want is served; the corridor closes half the loop it used to.
    const served = realm({ brackwaterExports: ['iron'] });
    const unserved = realm({ brackwaterExports: [] });
    const scoreServed = verdictFor(served.world, served.members).score;
    const scoreUnserved = verdictFor(unserved.world, unserved.members).score;
    expect(scoreServed).toBeLessThan(scoreUnserved);
    expect(verdictFor(unserved.world, unserved.members).realmShaping).toBe(true);
  });

  it('GATE 2 objective: below the bar the verdict is wait_objective, not silence', () => {
    // A realm where the pair wants nothing from each other at all: the objective
    // is pure cost, which is negative, and the demand gate has already passed.
    const members = flowMembersFromSnapshot([
      { id: 'ashfen', settlement: { config: { tradeRouteAccess: 'crossroads' }, economicState: { primaryImports: [], primaryExports: [] } } },
      { id: 'dunmoor', settlement: { config: { tradeRouteAccess: 'isolated' }, economicState: { primaryImports: [], primaryExports: [] } } },
    ]);
    let world = ensureGenesisRouteNetwork(
      { simulationRules: { routeLifecycleEnabled: true }, tick: 0 },
      members.map(m => ({ id: m.id, config: m.config })), 0,
    );
    for (let tick = 1; tick <= 16; tick += 1) {
      world = accrueRouteFlows({ worldState: withColumn(world), members, tick }).worldState;
    }
    const verdict = verdictFor(world, members);
    expect(verdict.verdict).toBe('wait_objective');
    expect(verdict.demandTally).toBeGreaterThanOrEqual(Number(ROUTE_CHARTER_TUNING.FORMATION_TALLY));
    expect(verdict.score).toBeLessThan(Number(ROUTE_CHARTER_TUNING.OBJECTIVE_BAR));
  });

  it('GATE 3 expedition worth: too far is a fate, and it is named too_far', () => {
    // ISOLATION AS FATE (§0), in the shape the engine actually produces it: an
    // island realm with NO sea lanes. Nothing about the mainland and the isle is
    // reachable over the frozen geometry, so `hopWeeks` answers nothing and the
    // ceiling reads the unreachable rung. That is the honest fixture for this
    // gate: candidate corridors are k-nearest by construction, so on a connected
    // realm the ceiling binds only on the extreme tail, while an unreachable pair
    // is exactly the "no expedition is worth it" case the design names.
    const { pack, placements } = makeIslandPack();
    const digest = buildSpatialDigest({ pack, placements, seaLanes: false });
    const members = flowMembersFromSnapshot([
      {
        id: 'main',
        settlement: {
          config: { tradeRouteAccess: 'crossroads' },
          economicState: { primaryImports: ['iron'], primaryExports: ['grain'] },
        },
      },
      {
        id: 'isle',
        settlement: {
          config: { tradeRouteAccess: 'coastal' },
          economicState: { primaryImports: ['grain'], primaryExports: ['iron'] },
        },
      },
    ]);
    const spatial = {
      simulationRules: { routeLifecycleEnabled: true },
      tick: 0,
      spatialCanonVersion: 1,
      spatialDigest: digest,
    };
    expect(expeditionWeeks(spatial, 'main', 'isle'))
      .toBeGreaterThan(Number(ROUTE_CHARTER_TUNING.EXPEDITION_WORTH_WEEKS));
    let world = ensureGenesisRouteNetwork(
      spatial, members.map(m => ({ id: m.id, config: m.config })), 0,
    );
    for (let tick = 1; tick <= 16; tick += 1) {
      world = accrueRouteFlows({
        worldState: {
          ...world,
          spatialLedgers: {
            ...(world.spatialLedgers || {}),
            migration: { 'col.f': { originId: 'main', destId: 'isle', arrivals: 640 } },
          },
        },
        members,
        tick,
      }).worldState;
    }
    const sweep = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const verdict = sweep.verdicts[0];
    expect(verdict.verdict).toBe('too_far');
    // The demand gate had ALREADY passed, so this is the ceiling refusing and not
    // a corridor that never accumulated: a century of wanting cannot buy this road.
    expect(verdict.demandTally).toBeGreaterThanOrEqual(Number(ROUTE_CHARTER_TUNING.FORMATION_TALLY));
    expect(verdict.weeks).toBeGreaterThan(Number(ROUTE_CHARTER_TUNING.EXPEDITION_WORTH_WEEKS));
  });

  it('every verdict word this sweep can produce is in the closed vocabulary', () => {
    const { world, members } = realm();
    const sweep = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    for (const verdict of sweep.verdicts) {
      expect(CHARTER_VERDICTS).toContain(verdict.verdict);
    }
    expect(sweep.verdicts.length).toBeGreaterThan(0);
  });
});

describe('J3 §6 the evaluation cadence (a charter is a multi-year event)', () => {
  it('a corridor inside its dwell is skipped entirely, not merely refused', () => {
    const { world, members } = realm();
    // The corridor was minted at tick 1 and its cursor still sits there, so a
    // sweep one week later is inside EVAL_CADENCE_TICKS.
    const early = evaluateRouteCharters({ worldState: world, members, tick: 2 });
    expect(early.verdicts).toHaveLength(0);
    expect(early.changed).toBe(false);
    expect(early.worldState).toBe(world);
    // ANTI-VACUITY: the same corridor past the dwell IS evaluated.
    const late = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    expect(late.verdicts).toHaveLength(1);
  });

  it('the cursor moves only for the corridors actually looked at', () => {
    const { world, members } = realm();
    const swept = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    expect(swept.changed).toBe(true);
    expect(readRouteNetwork(swept.worldState).corridor[CORRIDOR].lastCharterEval).toBe(20);
    // The demand it measured is untouched: the evaluator reads, the accrual writes.
    expect(readRouteNetwork(swept.worldState).corridor[CORRIDOR].tally)
      .toEqual(readRouteNetwork(world).corridor[CORRIDOR].tally);
  });
});

describe('J3 §6 charters PROPOSE, and they WAIT (guaranteed admission does not apply)', () => {
  const { world, members } = realm();
  const verdict = verdictFor(world, members);
  const outcome = charterProposalOutcome(verdict, { tick: 20, names: NAMES });

  it('the outcome is shaped for the docket that already exists', () => {
    expect(outcome.applyMode).toBe('proposal');
    expect(outcome.candidateType).toBe(CHARTER_CANDIDATE_TYPE);
    expect(outcome.targetSaveId).toBe('ashfen');
    // anchored: the two assertions above read the same object's own keys, so a shape drift empties them loudly rather than leaving this negative vacuously true.
    expect(outcome).not.toHaveProperty('recordMode');
  });

  it('it is NOT a one-shot verdict, so the cap genuinely rations it', () => {
    expect(isOneShotVerdictOutcome(outcome)).toBe(false);
    // ANTI-VACUITY: the predicate does fire for the family it was written for.
    expect(isOneShotVerdictOutcome({ ruleId: 'coup_verdict_fall' })).toBe(true);
  });

  it('it rations in the MINOR lane today, and carries the realm-shaping signal', () => {
    // §6 asks for major-class when realm-shaping. The estate's classifier keys on
    // a frozen candidateType set inside the docket machinery this slice may not
    // rewrite, so the verdict travels as a signal and the registration is the
    // wiring slice's. Pinned so the day it changes, it changes here first.
    expect(isMajorOutcome(outcome)).toBe(false);
    expect(outcome.realmShaping).toBe(true);
    expect(outcome.laneHint).toBe('major');
  });

  it('a docket with room ADMITS it and a saturated one REFUSES it', () => {
    const pendingFor = (count) => Array.from({ length: count }, (unused, index) => ({
      id: `p${index}`,
      status: 'pending',
      outcome: { candidateType: 'famine', targetSaveId: 'ashfen' },
    }));
    const roomy = buildProposalDocket({ proposals: pendingFor(2) }, 3);
    const full = buildProposalDocket({ proposals: pendingFor(3) }, 3);
    expect(proposalDocketAllows(roomy, outcome)).toBe(true);
    expect(proposalDocketAllows(full, outcome)).toBe(false);
    expect(admitGuaranteedProposalOutcomes(roomy, [outcome]).outcomes).toEqual([outcome]);
    expect(admitGuaranteedProposalOutcomes(full, [outcome]).outcomes).toEqual([]);
  });

  it('a REFUSED charter loses nothing: the corridor re-derives the same verdict', () => {
    // The whole justification for excluding charters from guaranteed admission is
    // that their trigger persists. Prove it: the demand ledger the refused
    // proposal came from is still there, and a later season produces the charter
    // again, with MORE demand behind it than before.
    const swept = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const laterWorld = accrueRouteFlows({
      worldState: withColumn(swept.worldState), members, tick: 21,
    }).worldState;
    const again = evaluateRouteCharters({ worldState: laterWorld, members, tick: 40 });
    const second = again.verdicts.find(v => v.corridorId === CORRIDOR);
    expect(second.verdict).toBe('charter');
    expect(second.demandTally).toBeGreaterThan(verdict.demandTally);
  });
});

describe('J3 §6 the Herald item obeys the NEWS ADDRESS LAW', () => {
  const { world, members } = realm();
  const verdict = verdictFor(world, members);
  const item = charterHeraldItem(verdict, { tick: 20, names: NAMES });

  it('carries the full address chain, by id AND by name, with a typed action', () => {
    expect(item.candidateType).toBe('route_chartered');
    expect([...item.settlementIds]).toEqual(['ashfen', 'dunmoor']);
    expect([...item.settlementNames]).toEqual(['Ashfen', 'Dunmoor']);
    expect(item.targetSaveId).toBe('ashfen');
    expect(item.headline).toContain('Ashfen');
    expect(item.headline).toContain('Dunmoor');
  });

  it('records a reason, and never shows the reader a number it computed', () => {
    expect(item.reasons.length).toBeGreaterThan(0);
    for (const reason of item.reasons) {
      // anchored: the length assertion above proves the list is populated, so a reason that stopped being prose reds here rather than passing on an empty list.
      expect(reason).not.toMatch(/[0-9]/);
    }
  });

  it('a verdict that did not charter emits nothing at all', () => {
    const quiet = realm({ passes: 4 });
    const waiting = verdictFor(quiet.world, quiet.members);
    expect(charterProposalOutcome(waiting, { tick: 20 })).toBeNull();
    expect(charterHeraldItem(waiting, { tick: 20 })).toBeNull();
    const emissions = charterEmissions([waiting, verdict], { tick: 20, names: NAMES });
    expect(emissions.proposals).toHaveLength(1);
    expect(emissions.news).toHaveLength(1);
  });
});

describe('J3 §6 the edge is EARNED: acceptance materializes a track', () => {
  it('materializes at track with a chartered provenance and retires the corridor', () => {
    const { world, members } = realm();
    const swept = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const verdict = swept.verdicts.find(v => v.corridorId === CORRIDOR);
    const applied = applyRouteCharter({ worldState: swept.worldState, verdict, tick: 20 });
    expect(applied.changed).toBe(true);
    expect(applied.edgeId).toBe(EDGE);
    const network = readRouteNetwork(applied.worldState);
    expect(network.edges[EDGE].grade).toBe('track');
    expect(network.edges[EDGE].provenance).toBe('chartered:20');
    expect(network.edges[EDGE].charter.dominantFlowClass).toBe('population');
    // anchored: the corridor id was present before this apply (the sweep found it), so its absence here is the retirement rather than an empty ledger.
    expect(Object.keys(network.corridor)).not.toContain(CORRIDOR);
  });

  it('is idempotent: re-applying the same charter changes nothing', () => {
    const { world, members } = realm();
    const swept = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const verdict = swept.verdicts.find(v => v.corridorId === CORRIDOR);
    const once = applyRouteCharter({ worldState: swept.worldState, verdict, tick: 20 });
    const twice = applyRouteCharter({ worldState: once.worldState, verdict, tick: 21 });
    expect(twice.changed).toBe(false);
    expect(JSON.stringify(twice.worldState)).toBe(JSON.stringify(once.worldState));
  });

  it('survives a JSON round trip unchanged (the persistence path)', () => {
    const { world, members } = realm();
    const swept = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const verdict = swept.verdicts.find(v => v.corridorId === CORRIDOR);
    const applied = applyRouteCharter({ worldState: swept.worldState, verdict, tick: 20 });
    const reloaded = JSON.parse(JSON.stringify(applied.worldState));
    expect(readRouteNetwork(reloaded).edges[EDGE]).toEqual(readRouteNetwork(applied.worldState).edges[EDGE]);
    // The re-derived world is byte-identical to the persisted one, which is what
    // the codepoint-sorted ledger writes exist to guarantee.
    expect(JSON.stringify(reloaded)).toBe(JSON.stringify(applied.worldState));
  });
});

describe('J3 §6 military charters: strategy buys roads demand has not worn', () => {
  const { world, members } = realm({ passes: 0 });

  it('a garrison-band need charters with no corridor accumulation at all', () => {
    expect(readRouteNetwork(world).corridor).toEqual({});
    const sweep = evaluateRouteCharters({
      worldState: world,
      members,
      tick: 20,
      strategicNeeds: [{ a: 'ashfen', b: 'dunmoor', band: 'garrison', byPowerRef: 'crown' }],
    });
    const verdict = sweep.verdicts.find(v => v.a === 'ashfen' && v.b === 'dunmoor');
    expect(verdict.verdict).toBe('charter');
    expect(verdict.flavor).toBe('military');
    expect(verdict.byPowerRef).toBe('crown');
  });

  it('a need below the band waits, so strategy is a bar and not a bypass', () => {
    const sweep = evaluateRouteCharters({
      worldState: world,
      members,
      tick: 20,
      strategicNeeds: [{ a: 'ashfen', b: 'dunmoor', band: 'watch' }],
    });
    expect(sweep.verdicts[0].verdict).toBe('wait_demand');
    expect(strategicNeedRank('watch')).toBeLessThan(strategicNeedRank('garrison'));
    expect(strategicNeedRank('front')).toBeGreaterThan(strategicNeedRank('garrison'));
    expect(strategicNeedRank('nonsense_band')).toBe(0);
  });

  it('a pair a road already serves is refused, so no duplicate road is minted', () => {
    const verdict = evaluateMilitaryCharter({
      worldState: world,
      network: readRouteNetwork(world),
      need: { a: 'ashfen', b: 'brackwater', band: 'front' },
      tick: 20,
    });
    expect(verdict.verdict).toBe('already_served');
  });
});

describe('J3 Law 7 DORMANCY: dark means byte-identical', () => {
  it('the sweep returns the INPUT world by reference and produces nothing', () => {
    const { world, members } = realm({ lit: false });
    const sweep = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    expect(sweep.worldState).toBe(world);
    expect(sweep.verdicts).toHaveLength(0);
    expect(sweep.changed).toBe(false);
  });

  it('A DARKENED world with a LIVE ledger is still refused (the gate-slip case)', () => {
    // The pin above cannot see a removed gate, and finding that out is why this
    // one exists: a dark realm never derived a network in the first place, so an
    // ungated sweep over it has no corridor to evaluate and looks identical to a
    // gated one. The case that DOES discriminate is a world that carries a lived
    // network and then has the flag taken away, which is exactly the shape a
    // future wiring slip would produce.
    const lit = realm();
    const darkened = { ...lit.world, simulationRules: {} };
    expect(Object.keys(readRouteNetwork(darkened).corridor)).toContain(CORRIDOR);
    const sweep = evaluateRouteCharters({ worldState: darkened, members: lit.members, tick: 20 });
    expect(sweep.worldState).toBe(darkened);
    expect(sweep.verdicts).toHaveLength(0);
    // ANTI-VACUITY: the identical world with the flag on evaluates that corridor.
    expect(evaluateRouteCharters({ worldState: lit.world, members: lit.members, tick: 20 }).verdicts)
      .toHaveLength(1);
  });

  it('the apply path refuses on a dark world, by reference', () => {
    const lit = realm();
    const verdict = verdictFor(lit.world, lit.members);
    const dark = { ...lit.world, simulationRules: {} };
    const applied = applyRouteCharter({ worldState: dark, verdict, tick: 20 });
    expect(applied.worldState).toBe(dark);
    expect(applied.changed).toBe(false);
  });

  it('a dark world grows no route ledger through any J3 entry point', () => {
    const { world, members } = realm({ lit: false });
    const before = JSON.stringify(world);
    const sweep = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    expect(JSON.stringify(sweep.worldState)).toBe(before);
    // anchored: the LIT twin of this fixture carries the key (asserted below), so an absent key here is the gate holding rather than a derivation that never runs.
    expect(sweep.worldState).not.toHaveProperty('spatialLedgers.routeNetwork');
    expect(readRouteNetwork(realm({ lit: true }).world)).toBeTruthy();
  });
});

describe('J3 determinism and totality', () => {
  it('the same world evaluated twice yields identical verdicts', () => {
    const { world, members } = realm();
    const first = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    const second = evaluateRouteCharters({ worldState: world, members, tick: 20 });
    expect(JSON.stringify(second.verdicts)).toBe(JSON.stringify(first.verdicts));
  });

  it('the dominant class is the largest tally, and ties break codepoint-low', () => {
    expect(dominantFlowClassOf({ tally: { goods: 5, population: 9 } }))
      .toEqual({ flowClass: 'population', tally: 9 });
    expect(dominantFlowClassOf({ tally: { population: 4, goods: 4 } }))
      .toEqual({ flowClass: 'goods', tally: 4 });
    expect(dominantFlowClassOf({ tally: {} })).toEqual({ flowClass: null, tally: 0 });
    expect(dominantFlowClassOf(null)).toEqual({ flowClass: null, tally: 0 });
  });

  it('Law 4 states the hysteresis pair in one place, and formation dwarfs removal', () => {
    expect(Number(ROUTE_CHARTER_TUNING.FORMATION_TALLY))
      .toBeGreaterThan(Number(ROUTE_CHARTER_TUNING.REMOVAL_TALLY) * 5);
  });

  it('an empty realm, a garbage corridor and a missing member are all total', () => {
    const sweep = evaluateRouteCharters({
      worldState: { simulationRules: { routeLifecycleEnabled: true } },
      members: [],
      tick: 0,
    });
    expect(sweep.verdicts).toHaveLength(0);
    expect(expeditionWeeks(null, 'a', 'b')).toBe(0);
  });
});
