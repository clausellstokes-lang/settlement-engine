/**
 * demographicsWorldsHand.test.js — WAVE P4 (THE WORLD'S HAND) pin battery.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md laws 5 and 6, §6, §7 and §7b are the contract.
 *
 * P4 is the last simulation-changing slice of the realm-directives programme, and its
 * claims are the ones easiest to fake, so each is pinned against the thing that would
 * make it a lie:
 *
 *   THE INSTRUMENT      the certification channel is READ by the real census function,
 *                       and the reviewed override set did not grow to admit the row.
 *   CONTINUITY          the disease coupling still VARIES above five thousand people,
 *                       which is the §0b saturation trap the existing contributors all
 *                       fall into.
 *   NO HIDDEN GOVERNOR  an anchored source scan: no incidence path anywhere reads a
 *                       realm total or a population target.
 *   MOTIVE vs CAPABILITY a starving fractured realm wants war and cannot wage it, and
 *                       the mirror (a fed realm can and need not).
 *   PERCEIVED SCARCITY  a court acts on a belief that is wrong, and the receipt says so.
 *   THE LADDER          it refuses a mover that no existing predicate refused.
 *   THE HERALD          the full address chain, and not one raw number in the prose.
 *   DORMANCY            object identity, not deep equality (the J1 precedent).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  SUBSYSTEM_CERTIFICATION_REGISTRY,
} from '../../src/domain/certification/subsystemCertification.js';
import { censusWorldStateKeys } from '../../scripts/audit/behavioral-observation.mjs';
import {
  LADDER_MOVER_KINDS,
  LADDER_MOVER_PERMITS,
  VIABILITY_GRADES,
  gradeFromReading,
  ladderCensus,
  moverPermitted,
  viabilityGradeOf,
} from '../../src/domain/worldPulse/demographicsLadder.js';
import { demographicRiskOf } from '../../src/domain/worldPulse/demographicsRisk.js';
import { scoreResponses } from '../../src/domain/worldPulse/demographicsResponses.js';
import {
  demographyMembersFromSaves,
  measureRealmDemography,
  observeRealmDemography,
} from '../../src/domain/worldPulse/demographicsObservation.js';
import {
  WAR_DEMOGRAPHIC_TUNING,
  demographicWarTermsFor,
  perceivedScarcityOf,
  warCapabilityOf,
} from '../../src/domain/worldPulse/demographicsWar.js';
import { scoreResourcePressure } from '../../src/domain/worldPulse/warReasons.js';
import { demographicNewsEntries, quantityWords } from '../../src/domain/worldPulse/demographicsHerald.js';
import { advanceDemographics } from '../../src/domain/worldPulse/demographicsKernel.js';
import { DEMOGRAPHIC_TUNING } from '../../src/domain/worldPulse/demographicsRates.js';
import { deriveSettlementPressures } from '../../src/domain/worldPulse/pressureModel.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** Source with every comment stripped. A source-scan claim about what a module CANNOT
 *  reach must read the code, never the prose: this file's own header names the module
 *  it refuses to import, and a raw scan would count that refusal as the offence. */
const code = (rel) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const DEMO = 'demographicsEnabled';

/** A settlement carrying real food physics (the demographicsRates fixture shape). */
function place({
  tier = 'town', terrain = 'plains', population = 1200, dailyProduction = 6000,
  importDependency = 0.2, deficitPct = 0, named = 0, name = 'Ashford',
} = {}) {
  return {
    population,
    tier,
    name,
    config: { tier, terrainType: terrain },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2,
        dailyProduction,
        deficitPct,
        surplusPct: 5,
        importDependency,
        storageMonths: 6,
        resilienceScore: 60,
      },
    },
    npcs: Array.from({ length: named }, (_, i) => ({ id: `npc_${i}` })),
  };
}

const litWorld = () => ({ simulationRules: { demographicsEnabled: true } });

// ═══════════════════════════════════════════════════════════════════════════════
describe('P4.1 THE INSTRUMENT — the channel has a reader, and the ceiling held', () => {
  test('the row declares the plan-ledger channel and the v5 census emits that exact key', () => {
    const row = SUBSYSTEM_CERTIFICATION_REGISTRY.find((r) => r.rule === DEMO);
    expect(row.aliveness.stateKeys).toEqual(['spatialLedgers.demographicPlans']);
    // The DECLARED spelling, run through the REAL census function over the REAL shape
    // the plan writer produces. A spelling the census never emits would leave this row
    // at UNOBSERVED forever while reading as an honest instrument gap, which is the
    // exact failure the corpus guard's satisfiability test exists to catch.
    const census = censusWorldStateKeys({
      tick: 40,
      spatialLedgers: {
        demographicPlans: { ashford: { response: 'satellite', status: 'underway' } },
      },
    });
    expect(Object.keys(census)).toContain(row.aliveness.stateKeys[0]);
    expect(census[row.aliveness.stateKeys[0]]).toBe(1);
  });

  test('the reviewed override set did NOT grow, and the ceiling is untouched', () => {
    // The corpus guard's own predicate, restated here so this slice owns the claim:
    // a row is an override when it declares a channel AND still calls the soak blind.
    const overrides = SUBSYSTEM_CERTIFICATION_REGISTRY
      .filter((r) => r.soakEvidence === 'unobserved'
        && r.aliveness.eventTypes.length + r.aliveness.moverFamilies.length + r.aliveness.stateKeys.length > 0)
      .map((r) => r.rule)
      .sort();
    expect(overrides).toEqual([
      'faithSpreadEnabled',
      'interventionEnabled',
      'reframeEnabled',
      'religionDynamicsEnabled',
      'traditionsEnabled',
    ]);
    // anchored: the same list is asserted to have exactly five named members above, so it cannot be empty
    expect(overrides).not.toContain(DEMO);
    // And the ceiling literal in the guard is still 5 — a slice that raised it would
    // have satisfied the guard while breaking the law the guard encodes.
    expect(read('tests/domain/subsystemCertificationCorpus.test.js'))
      .toContain('const UNOBSERVED_OVERRIDE_CEILING = 5;');
  });

  test('realmPressure is bounded, emitted additively, and NULL on a dark world', () => {
    const saves = [
      { id: 'a', settlement: place({ population: 4000, dailyProduction: 6000 }) },
      { id: 'b', settlement: place({ population: 900, dailyProduction: 9000, name: 'Brill' }) },
    ];
    const lit = observeRealmDemography({ worldState: litWorld(), saves });
    expect(lit.kind).toBe('realm_demography');
    expect(lit.settlements).toBe(2);
    expect(lit.population).toBe(4900);
    expect(lit.realmPressure01).toBeGreaterThan(0);
    expect(lit.realmPressure01).toBeLessThanOrEqual(DEMOGRAPHIC_TUNING.PRESSURE_MAX);
    expect(lit.loadRatio01).toBeLessThanOrEqual(DEMOGRAPHIC_TUNING.PRESSURE_MAX);

    // BOUNDED AT THE TOP, measured rather than asserted: a realm far past its harvest
    // still reads at the ceiling and never above it.
    const swamped = measureRealmDemography(demographyMembersFromSaves([
      { id: 'a', settlement: place({ population: 400000, dailyProduction: 900 }) },
    ]), litWorld());
    expect(swamped.realmPressure01).toBe(DEMOGRAPHIC_TUNING.PRESSURE_MAX);

    // DARK ⇒ null ⇒ the observation drops the key rather than recording a zero.
    expect(observeRealmDemography({ worldState: { simulationRules: {} }, saves })).toBe(null);
    // And the soak harness spells the conditional spread the same way J2's does.
    expect(read('scripts/audit/behavioral-observation.mjs'))
      .toContain('...(realmDemography ? { realmDemography } : {}),');
  });

  test('an empty food denominator reads zero rather than dividing', () => {
    // A realm whose food physics are unknown is not a realm under infinite pressure.
    const blind = measureRealmDemography([{ id: 'a', settlement: { population: 500 } }], litWorld());
    expect(blind.foodKnownSettlements).toBe(0);
    expect(blind.realmPressure01).toBe(0);
    expect(blind.population).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('P4.2 CAUSAL RISK — continuous, and never a governor', () => {
  /** The disease lift at one population, everything else held. */
  const diseaseAt = (population) => demographicRiskOf({
    // Production is HELD FIXED and only the head count moves, so the bound is the same
    // 43,700-soul wall at every reading and the pressure ratio is the only thing that
    // changed. (Measured 2026-08-01: bound 43700 walls, pressures 0.6865 / 0.9153 /
    // 1.1442 — all above the crowding ease point and all under the pressure ceiling,
    // which is what makes three DISTINCT readings a statement about continuity rather
    // than about clamping.)
    settlement: place({ tier: 'city', population, dailyProduction: 200000 }),
    worldState: litWorld(),
    settlementId: 'ashford',
    scores: { healing_capacity: 30, infrastructure_condition: 35, trade_connectivity: 80, defense_readiness: 55 },
  }).diseaseLift01;

  test('THE SATURATION TRAP: the term still varies ABOVE five thousand people', () => {
    // §0b: every existing population contributor is a STEP at pop >= 5000, so the whole
    // runaway range collapses into one bucket. Three populations all past that step
    // must produce three DIFFERENT readings, or this coupling inherits the same defect.
    const readings = [30000, 40000, 50000].map(diseaseAt);
    expect(new Set(readings).size, `the lift saturated above 5000: ${readings.join(', ')}`).toBe(3);
    expect(readings[1]).toBeGreaterThan(readings[0]);
    expect(readings[2]).toBeGreaterThan(readings[1]);
    // CONTROL, the trap made visible: the existing housing contributor is flat across
    // exactly the same three populations, which is the defect this pin exists against.
    const housingStep = read('src/domain/causalState.js');
    expect(housingStep).toContain("if (pop >= 5000) { score -= 4;");
  });

  test('crowding is the CONDITION; sanitation and traffic are accelerants on it', () => {
    const clean = demographicRiskOf({
      settlement: place({ tier: 'city', population: 12000, dailyProduction: 13200 }),
      worldState: litWorld(),
      settlementId: 'ashford',
      scores: { healing_capacity: 95, infrastructure_condition: 95, trade_connectivity: 5, defense_readiness: 55 },
    });
    const filthy = demographicRiskOf({
      settlement: place({ tier: 'city', population: 12000, dailyProduction: 13200 }),
      worldState: litWorld(),
      settlementId: 'ashford',
      scores: { healing_capacity: 5, infrastructure_condition: 5, trade_connectivity: 5, defense_readiness: 55 },
    });
    const travelled = demographicRiskOf({
      settlement: place({ tier: 'city', population: 12000, dailyProduction: 13200 }),
      worldState: litWorld(),
      settlementId: 'ashford',
      scores: { healing_capacity: 95, infrastructure_condition: 95, trade_connectivity: 95, defense_readiness: 55 },
    });
    expect(filthy.diseaseLift01).toBeGreaterThan(clean.diseaseLift01);
    expect(travelled.diseaseLift01).toBeGreaterThan(clean.diseaseLift01);

    // AND THE REFUSAL THAT MAKES IT A CONDITION RATHER THAN A WEIGHT: an UNCROWDED town
    // with the same filth and the same road takes NO lift at all. A packed hungry city
    // invites plague; a half-empty clean-aired one with bad water does not, in this
    // model, and the law says the coupling is to crowding.
    const roomy = demographicRiskOf({
      settlement: place({ tier: 'city', population: 900, dailyProduction: 40000 }),
      worldState: litWorld(),
      settlementId: 'ashford',
      scores: { healing_capacity: 5, infrastructure_condition: 5, trade_connectivity: 95, defense_readiness: 55 },
    });
    expect(roomy.crowding01).toBe(0);
    expect(roomy.diseaseLift01).toBe(0);
  });

  test('raid exposure rises with a thin watch and with sprawl, and is capped', () => {
    const watched = demographicRiskOf({
      settlement: place({ tier: 'thorp', population: 30, dailyProduction: 400 }),
      worldState: litWorld(),
      settlementId: 'edge',
      scores: { defense_readiness: 90, healing_capacity: 50, infrastructure_condition: 50, trade_connectivity: 20 },
    });
    const bare = demographicRiskOf({
      settlement: place({ tier: 'thorp', population: 30, dailyProduction: 400 }),
      worldState: litWorld(),
      settlementId: 'edge',
      scores: { defense_readiness: 2, healing_capacity: 50, infrastructure_condition: 50, trade_connectivity: 20 },
    });
    expect(watched.raidLift01).toBe(0);
    expect(bare.raidLift01).toBeGreaterThan(0);
    expect(bare.sprawl01).toBeGreaterThan(0.5);
    expect(bare.raidLift01).toBeLessThanOrEqual(0.20);
  });

  test('the ONE seam carries the coupling, and DARK is byte-identical there', () => {
    const settlement = place({ tier: 'city', population: 20000, dailyProduction: 22000 });
    const snapshot = (rules, companionPopulation = 40) => ({
      worldState: { simulationRules: rules, calendar: {}, relationshipStates: {} },
      regionalGraph: { channels: [], edges: [] },
      settlements: [
        {
          id: 'ashford',
          name: 'Ashford',
          settlement,
          activeConditions: [],
          causal: {
            scores: {
              healing_capacity: 20, infrastructure_condition: 20, trade_connectivity: 85,
              defense_readiness: 20, food_security: 50, housing_pressure: 70,
              labor_capacity: 50, criminal_opportunity: 50, public_legitimacy: 50,
            },
          },
        },
        {
          id: 'brill',
          name: 'Brill',
          settlement: place({ name: 'Brill', population: companionPopulation }),
          activeConditions: [],
          causal: {
            scores: {
              healing_capacity: 50, infrastructure_condition: 50, trade_connectivity: 50,
              defense_readiness: 50, food_security: 50, housing_pressure: 70,
              labor_capacity: 50, criminal_opportunity: 50, public_legitimacy: 50,
            },
          },
        },
      ],
    });
    const dark = deriveSettlementPressures(snapshot({}));
    const lit = deriveSettlementPressures(snapshot({ demographicsEnabled: true }));
    const kindOf = (list, kind, settlementId = 'ashford') => list
      .find((p) => p.settlementId === settlementId && p.kind === kind);
    // DARK: byte-identical to legacy on every pressure kind.
    expect(JSON.stringify(dark)).toBe(JSON.stringify(deriveSettlementPressures(snapshot({}))));
    // LIT: the two coupled kinds rise, and the others do not move at all.
    expect(kindOf(lit, 'disease').score).toBeGreaterThan(kindOf(dark, 'disease').score);
    expect(kindOf(lit, 'conflict').score).toBeGreaterThan(kindOf(dark, 'conflict').score);
    for (const kind of ['food', 'trade', 'economy', 'legitimacy', 'defense', 'crime', 'hostility']) {
      expect(kindOf(lit, kind).score, `${kind} moved and should not have`).toBe(kindOf(dark, kind).score);
    }
    // The lifted entries NAME their cause rather than moving silently (law 5).
    expect(kindOf(lit, 'disease').reasons.join(' ')).toContain('packed');
    expect(kindOf(lit, 'conflict').reasons.join(' ')).toContain('watch is thin');

    // A seam-local realm governor would make Ashford move when an otherwise unrelated
    // companion grows. Both coupled outputs must remain functions of Ashford alone.
    const litWithHugeCompanion = deriveSettlementPressures(snapshot(
      { demographicsEnabled: true },
      900000,
    ));
    expect(kindOf(litWithHugeCompanion, 'disease')).toEqual(kindOf(lit, 'disease'));
    expect(kindOf(litWithHugeCompanion, 'conflict')).toEqual(kindOf(lit, 'conflict'));
  });

  test('NO HIDDEN GOVERNOR: no incidence path reads a realm total or a population target', () => {
    // The anchored negative, source-scanned rather than reasoned. The incidence module
    // must not reach the realm reading AT ALL: not by import, not by name. A realm-total
    // term inside a risk deriver IS the balancing hand law 5 forbids, and the only
    // defence that survives a refactor is that the number is unreachable from there.
    const risk = code('src/domain/worldPulse/demographicsRisk.js');
    expect(risk.length, 'the risk module read empty').toBeGreaterThan(1000);
    // anchored: the file is asserted non-empty above, so these absences are real
    expect(risk).not.toContain('demographicsObservation');
    // anchored: same file, same non-emptiness anchor
    expect(risk).not.toContain('realmPressure');
    // anchored: same file, same non-emptiness anchor
    expect(risk).not.toContain('measureRealmDemography');
    // Its import list is a closed set of per-settlement readers.
    const imports = [...risk.matchAll(/from '([^']+)'/g)].map((m) => m[1]).sort();
    expect(imports).toEqual(['../../kernel/math.js', './demographicsRates.js']);

    // Close the helper-hop route too: the risk reader may only reach this exact set of
    // local physics leaves through demographicsRates. A new import is a reviewed event.
    const rates = code('src/domain/worldPulse/demographicsRates.js');
    expect(rates.length, 'the rates module read empty').toBeGreaterThan(1000);
    const ratesImports = [...rates.matchAll(/from '([^']+)'/g)].map((m) => m[1]).sort();
    expect(ratesImports).toEqual([
      '../../data/constants.js',
      '../../kernel/math.js',
      '../foodLedger.js',
      '../resolveTerrain.js',
      './demographicsWorks.js',
      './routeNetworkConsumersInterdiction.js',
      './routeNetworkLedger.js',
    ]);

    // AND THE CONSUMER SIDE: the pressure seam's demographic terms come from the risk
    // reader alone, never from a realm aggregate reachable in that file either.
    const seam = code('src/domain/worldPulse/pressureModel.js');
    const forbiddenRealmGovernor = [
      ['realm observation import', /demographicsObservation/],
      ['realm observation reader', /\b(?:measureRealmDemography|observeRealmDemography)\b/],
      ['realm pressure', /\brealmPressure(?:01)?\b/],
      [
        'realm population alias',
        /\b(?:realmPopulation|totalPopulation|populationTarget|targetPopulation|settlementCount)\b/,
      ],
      ['direct population field read', /(?:\.population\b|\[['"]population['"]\])/],
    ];
    const governorHits = (source) => forbiddenRealmGovernor
      .filter(([, pattern]) => pattern.test(source))
      .map(([label]) => label);
    // anchored: the seam is asserted below to contain demographicRiskOf, so it is non-empty.
    expect(governorHits(seam)).toEqual([]);
    expect(seam).toContain('demographicRiskOf({');

    // GUARD THE GUARD: the same scan finds both a realm reading and a direct population
    // read in the war module. War is ALLOWED those inputs because motive is not incidence,
    // so an empty seam result above cannot come from a detector that stopped biting.
    const warGovernorHits = governorHits(code('src/domain/worldPulse/demographicsWar.js'));
    expect(warGovernorHits).toContain('realm pressure');
    expect(warGovernorHits).toContain('direct population field read');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('P4.3 WAR — motive, capability, and the picture the court acts on', () => {
  const starving = place({ tier: 'town', population: 5200, dailyProduction: 2000, deficitPct: 70 });
  const fed = place({ tier: 'town', population: 2000, dailyProduction: 14000, name: 'Brill' });

  test('MOTIVE WITHOUT CAPABILITY: a starving realm wants war and cannot wage it', () => {
    const hungry = warCapabilityOf({
      settlement: starving, worldState: litWorld(), settlementId: 'ashford', realmPressure01: 1.9,
    });
    expect(hungry.constrained).toBe(true);
    expect(hungry.capability01).toBeLessThan(0.6);
    // The floor is real and named: hunger is not a peace treaty.
    expect(hungry.capability01).toBeGreaterThanOrEqual(WAR_DEMOGRAPHIC_TUNING.CAPABILITY_FLOOR);

    // THE WANT IS UNCHANGED AND THE MEANS ARE NOT. Same gradient, two capabilities.
    const able = scoreResourcePressure({ own01: 0.9, foe01: 0.1, capability01: 1 }, 'pair');
    const unable = scoreResourcePressure({ own01: 0.9, foe01: 0.1, capability01: hungry.capability01 }, 'pair');
    expect(able.score).toBeGreaterThan(0);
    expect(unable.score).toBeLessThan(able.score);
    expect(unable.score / able.score).toBeCloseTo(hungry.capability01, 6);

    // THE MIRROR: a fed realm CAN, and its capability takes nothing away.
    const wellFed = warCapabilityOf({
      settlement: fed, worldState: litWorld(), settlementId: 'brill', realmPressure01: 0.4,
    });
    expect(wellFed.constrained).toBe(false);
    expect(wellFed.capability01).toBe(1);
    expect(scoreResourcePressure({ own01: 0.9, foe01: 0.1, capability01: wellFed.capability01 }, 'pair').score)
      .toBe(able.score);
  });

  test('ABSENT capability is 1: every pre-P4 caller and every dark world is byte-identical', () => {
    expect(scoreResourcePressure({ own01: 0.8, foe01: 0.2 }, 'pair'))
      .toEqual(scoreResourcePressure({ own01: 0.8, foe01: 0.2, capability01: 1 }, 'pair'));
    // And no note ⇒ no clause appended.
    expect(scoreResourcePressure({ own01: 0.8, foe01: 0.2 }, 'pair').receipt)
      .toBe(scoreResourcePressure({ own01: 0.8, foe01: 0.2, note: '' }, 'pair').receipt);
  });

  test('PERCEIVED, not true: a court invades a neighbour it wrongly believes grain-rich', () => {
    // The subject is in fact desperate (truth01 near the ceiling). The observer's belief
    // record says the place is SWELLING, which reads as a place being fed.
    const worldState = {
      spatialCanonVersion: 3,
      simulationRules: { demographicsEnabled: true, infoMode: 'unreliable' },
      spatialLedgers: {
        beliefMaps: {
          ashford: { seat: { brill: { populationTrendBand: 2, confidence01: 0.8, readiness: 0.5, strengthBand: 2, allianceLabel: 'neutral', faithLabel: null, lastUpdateTick: 3 } } },
        },
      },
    };
    const perceived = perceivedScarcityOf({
      observerId: 'ashford', subjectId: 'brill', worldState, truth01: 0.95,
    });
    expect(perceived.source).toBe('belief');
    expect(perceived.foe01).toBe(WAR_DEMOGRAPHIC_TUNING.PERCEIVED_BY_TREND[4]);
    expect(perceived.foe01).toBeLessThan(perceived.truth01);
    expect(perceived.mistaken).toBe(true);

    // AND THE RECEIPT SAYS SO. A war reason that acted on a wrong picture must record
    // that it did, or the world cannot later be read as tragic rather than as arbitrary.
    const terms = demographicWarTermsFor({
      worldState,
      fromId: 'ashford',
      toId: 'brill',
      fromSettlement: starving,
      toSettlement: place({ tier: 'town', population: 6000, dailyProduction: 1200, deficitPct: 80, name: 'Brill' }),
      base01: 0.8,
      baseFoe01: 0.8,
      realmPressure01: 1.2,
    });
    expect(terms.beliefSource).toBe('belief');
    expect(terms.mistaken).toBe(true);
    expect(terms.note).toContain('granaries are full');
    expect(terms.note).toContain('the court is wrong about it');
    const scored = scoreResourcePressure({
      own01: terms.own01, foe01: terms.foe01, capability01: terms.capability01, note: terms.note,
    }, 'ashford|brill');
    expect(scored.receipt).toContain('the court is wrong about it');

    // THE COUNTERFACTUAL that makes it a belief read rather than a relabelling: an
    // OMNISCIENT world resolves to truth verbatim, produces no clause, and therefore
    // scores the pair differently.
    const omniscient = perceivedScarcityOf({
      observerId: 'ashford',
      subjectId: 'brill',
      worldState: { ...worldState, simulationRules: { ...worldState.simulationRules, infoMode: 'omniscient' } },
      truth01: 0.95,
    });
    expect(omniscient.source).toBe('truth');
    expect(omniscient.foe01).toBe(0.95);
    expect(omniscient.mistaken).toBe(false);
  });

  test('a court with NO picture assumes the middle and knows it is assuming', () => {
    const worldState = {
      spatialCanonVersion: 3,
      simulationRules: { demographicsEnabled: true, infoMode: 'unreliable' },
      spatialLedgers: { beliefMaps: {} },
    };
    const blind = perceivedScarcityOf({ observerId: 'a', subjectId: 'b', worldState, truth01: 0.95 });
    expect(blind.source).toBe('unknown');
    expect(blind.foe01).toBe(WAR_DEMOGRAPHIC_TUNING.NEUTRAL_PERCEIVED);
    expect(blind.mistaken).toBe(true);
  });

  test('the motive blend stays inside 0..1, so the existing gain and cap are the only caps', () => {
    for (const realm of [0, 0.5, 1, DEMOGRAPHIC_TUNING.PRESSURE_MAX]) {
      const terms = demographicWarTermsFor({
        worldState: litWorld(),
        fromId: 'a',
        toId: 'b',
        fromSettlement: starving,
        toSettlement: fed,
        base01: 1,
        baseFoe01: 1,
        realmPressure01: realm,
      });
      expect(terms.own01).toBeLessThanOrEqual(1);
      expect(terms.own01).toBeGreaterThanOrEqual(0);
      expect(terms.foe01).toBeLessThanOrEqual(1);
      expect(terms.foe01).toBeGreaterThanOrEqual(0);
    }
    // And warReasons adds no cap of its own: the two authored ones are still the only
    // multipliers on this casus.
    const src = code('src/domain/worldPulse/warReasons.js');
    expect((src.match(/RESOURCE_ENVY_GAIN/g) || []).length).toBe(2);
    expect(src).toContain('clamp01(gap * REASON_TUNING.RESOURCE_ENVY_GAIN) * capability');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('P4.4 THE VIABILITY LADDER — five rungs, and a mover it actually stops', () => {
  test('the permit table is TOTAL on both axes (no cell defaults open)', () => {
    expect(Object.keys(LADDER_MOVER_PERMITS).sort()).toEqual([...VIABILITY_GRADES].sort());
    for (const grade of VIABILITY_GRADES) {
      for (const kind of LADDER_MOVER_KINDS) {
        expect(typeof LADDER_MOVER_PERMITS[grade][kind], `${grade}/${kind} is unauthored`).toBe('boolean');
      }
    }
    // CLOSED, both ways: an unknown grade and an unknown kind both read FALSE, so a
    // typo can only ever make the engine quieter.
    expect(moverPermitted('flourishing', 'trade')).toBe(false);
    expect(moverPermitted('viable', 'teleport')).toBe(false);
  });

  test('the five rungs are reachable, in the order the design names them', () => {
    const base = { tierFloor: 901, foodKnown: true, deficit01: 0 };
    expect(gradeFromReading({ ...base, population: 3000, bound: 5000 }).grade).toBe('viable');
    expect(gradeFromReading({ ...base, population: 3000, bound: 400 }).grade).toBe('failing');
    expect(gradeFromReading({ ...base, population: 700, bound: 400 }).grade).toBe('evacuating');
    expect(gradeFromReading({ ...base, population: 12, bound: 400, remnant: true }).grade).toBe('remnant_occupied');
    expect(gradeFromReading({ ...base, population: 0, bound: 400, remnant: true }).grade).toBe('remnant_empty');
    // UNKNOWN FOOD IS NEVER NONVIABLE: an absent reading is not evidence of failure.
    expect(gradeFromReading({ ...base, foodKnown: false, population: 700, bound: 0 }).grade).toBe('viable');
  });

  test('THE GATE: the ladder refuses a founding no existing predicate refused', () => {
    // The refusal is NEW: before P4 the founding lane was refused only for a dark
    // satellite lane, a tier under wave E's cap, no legal ground, or an absorbed
    // homeostat. A settlement whose ground and granaries cannot support the grade it
    // wears passed every one of those and could still break new ground.
    // DRIVEN THROUGH THE REAL SCORER, on two readings that differ in exactly ONE way:
    // whether the bound has fallen through the tier's own population floor. Every other
    // refusal the lane knows is cleared in both arms (the lane is lit, the cap allows
    // two, the ground is open, the homeostat absorbed nobody), so the only thing that
    // can separate them is the ladder.
    const founding = (bound) => scoreResponses({
      readings: {
        foodKnown: true, foodFlowRatio: 0.9, foodFlowBand: 'adequate', reserveCoverage: 0.4,
        reserveBand: 'stocked', urbanLoadRatio: 1.0, urbanLoadBand: 'packed',
        population: 1500, foodCapacity: bound, densityCeiling: 8625, bound, binding: 'granary',
      },
      pressure01: 1.1, tier: 'town', prosperity01: 0.5, connectivity01: 0.5,
      homeostat: { placed: 0, unplaced: 200, considered: 0 },
      ground: { applicable: true, saturated: false, sites: 6 },
      satelliteLaneLit: true, satelliteCap: 2,
    }).find((s) => s.response === 'satellite');
    // A town whose bound clears its own floor of 901 may break ground.
    expect(founding(4000).refusal).toBe('available');
    expect(founding(4000).available).toBe(true);
    // The SAME town whose granaries and ground together no longer support a town is
    // refused BY NAME, and its weight is zero rather than merely small.
    expect(founding(400).refusal).toBe('nonviable');
    expect(founding(400).available).toBe(false);
    expect(founding(400).weight).toBe(0);

    const gate = read('src/domain/worldPulse/demographicsResponses.js');
    expect(gate).toContain("!foundingPermitted ? 'nonviable'");
    expect(moverPermitted('failing', 'founding')).toBe(false);
    expect(moverPermitted('evacuating', 'founding')).toBe(false);
    expect(moverPermitted('viable', 'founding')).toBe(true);
    // A failing place may still RECEIVE people, which is how it recovers; that is the
    // asymmetry acceptance claim 9 needs, and it would be lost by a blanket refusal.
    expect(moverPermitted('failing', 'destination')).toBe(true);
    expect(moverPermitted('evacuating', 'destination')).toBe(false);
    // The ruin trades, levies and speaks for nobody (design §7b, verbatim).
    for (const kind of ['trade', 'levy', 'institution']) {
      expect(moverPermitted('remnant_occupied', kind)).toBe(false);
    }
  });

  test('the grade reads through the real settlement record, and censuses the realm', () => {
    const healthy = viabilityGradeOf(place({ population: 1200, dailyProduction: 9000 }), litWorld(), 'a');
    expect(healthy.grade).toBe('viable');
    const starved = viabilityGradeOf(
      place({ tier: 'town', population: 950, dailyProduction: 200 }), litWorld(), 'b');
    expect(['failing', 'evacuating']).toContain(starved.grade);
    // No id, no band token and no ratio in the reason a reader could ever see.
    expect(starved.reason).toMatch(/^[a-z ,.]+$/);

    const census = ladderCensus([
      { id: 'a', settlement: place({ population: 1200, dailyProduction: 9000 }) },
      { id: 'b', settlement: place({ tier: 'town', population: 950, dailyProduction: 200 }) },
    ], litWorld());
    // Every rung is present with a zero, so an absent key can never be misread.
    expect(Object.keys(census).sort()).toEqual([...VIABILITY_GRADES].sort());
    expect(Object.values(census).reduce((a, b) => a + b, 0)).toBe(2);
  });

  test('the terminal receipt names the rung, and drops the key when the wave is dark', () => {
    const src = read('src/domain/worldPulse/settlementLifecycleFirstClass.js');
    expect(src).toContain('...(viabilityGrade ? { viabilityGrade: String(viabilityGrade) } : {}),');
    expect(src).toContain('viabilityGrade: demographicsLit');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('P4.5 THE HERALD — the address chain, and no raw number in the prose', () => {
  const receipts = [{
    id: 'ashford',
    kind: 'demographic_step',
    tick: 40,
    before: 1200,
    after: 1150,
    births: 6,
    deaths: 56,
    bound: 900,
    binding: 'granary',
    foodCapacity: 900,
    densityCeiling: 8625,
    foodKnown: true,
    importSource: 'generated',
    arteries: 0,
    pressure01: 1.33,
    deficit01: 0.44,
    birthBand: 'thin',
    deathBand: 'grievous',
    namedFloor: 0,
    line: 'Ashford counts 1,150 souls this week.',
  }];
  const columns = [{
    id: 'demographics.migration.ashford.40',
    kind: 'demographic_migration',
    tick: 40,
    originId: 'ashford',
    migrantClass: 'refugee',
    departures: 307,
    placements: [{ destId: 'brill', count: 307 }],
    unplaced: 0,
    refusal: '',
    considered: 2,
  }];
  const nameOf = (id) => ({ ashford: 'Ashford', brill: 'Brill' })[id] || id;
  const entries = () => demographicNewsEntries({ receipts, migrationReceipts: columns, tick: 40, now: null, nameOf });

  test('every entry carries an id, the full address chain, a typed cause and a reason', () => {
    const out = entries();
    expect(out.length).toBe(2);
    for (const entry of out) {
      // An entry without `id` is refused by normalizeEntry AND skipped by the audit
      // receipt sink, so it would reach no reader, no Herald and no soak receipt.
      expect(entry.id).toMatch(/^wizard_news\.40\.(hunger|exodus)\./);
      expect(entry.settlementIds.length).toBeGreaterThan(0);
      expect(entry.settlementNames.length).toBe(entry.settlementIds.length);
      expect(entry.impactKind).toBeTruthy();
      expect(entry.causeClass).toBeTruthy();
      expect(entry.reasons.length).toBeGreaterThan(0);
      expect(entry.tags).toContain('demographics');
    }
  });

  test('the design\'s own sentence, with both places BY NAME', () => {
    const exodus = entries().find((e) => e.causeClass === 'flight');
    expect(exodus.summary).toBe('several hundred left Ashford and took the road to Brill.');
    expect(exodus.settlementNames).toEqual(['Ashford', 'Brill']);
    const hunger = entries().find((e) => e.causeClass === 'hunger');
    expect(hunger.headline).toBe('Grain ran short in Ashford');
  });

  test('LEGIBILITY: no digit, no ratio, no band token and no id reaches the prose', () => {
    for (const entry of entries()) {
      const prose = [entry.headline, entry.summary, ...entry.reasons].join(' ');
      // The subject cannot vanish: the prose is asserted non-empty and to NAME the
      // settlement first, so an absent digit is a property of the sentence rather than
      // of an empty string.
      expect(prose.length).toBeGreaterThan(40);
      expect(prose).toContain('Ashford');
      // anchored: the same string is asserted above to be long and to contain Ashford
      expect(prose, `a raw digit reached the prose: ${prose}`).not.toMatch(/[0-9]/);
      // anchored: same string, same liveness anchor two lines above
      expect(prose).not.toMatch(/%/);
      for (const token of ['ashford', 'brill', 'pressure01', 'deficit01', 'grievous', 'granary', 'refugee']) {
        expect(prose.includes(token), `the raw token ${token} reached the prose: ${prose}`).toBe(false);
      }
    }
  });

  test('the Herald is BANDED, not a census: an ordinary week says nothing', () => {
    const quiet = demographicNewsEntries({
      receipts: [{ ...receipts[0], births: 20, deaths: 21, deficit01: 0 }],
      migrationReceipts: [{ ...columns[0], departures: 2, placements: [], unplaced: 0 }],
      tick: 40,
      now: null,
      nameOf,
    });
    expect(quiet).toEqual([]);
  });

  test('a realm that could place nobody says so, in words', () => {
    const refused = demographicNewsEntries({
      receipts: [],
      migrationReceipts: [{ ...columns[0], departures: 0, placements: [], unplaced: 30 }],
      tick: 40,
      now: null,
      nameOf,
    });
    expect(refused.length).toBe(1);
    expect(refused[0].summary).toBe('dozens would have left Ashford, and the realm had nowhere to put them.');
    expect(quantityWords(0)).toBe('nobody');
    expect(quantityWords(3)).toBe('a few souls');
    expect(quantityWords(9000)).toBe('thousands');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('P4.6 DORMANCY — object identity, not deep equality', () => {
  test('a dark advance returns the SAME references and no news at all', () => {
    const worldState = { simulationRules: {} };
    const updates = [{ saveId: 'a', settlement: place({ population: 4000 }) }];
    const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: updates[0].settlement }] };
    const out = advanceDemographics({ snapshot, worldState, settlementUpdates: updates, rng: null, tick: 4 });
    expect(out.worldState).toBe(worldState);
    expect(out.settlementUpdates).toBe(updates);
    expect(out.changed).toBe(false);
    expect(out.newsEntries).toEqual([]);
    expect(out.receipts).toEqual([]);
  });

  test('the lifecycle host forwards the demographic news through its OWN dormancy gate', () => {
    // The demographic lane is gated by ITS flag, so its Herald lines must survive the
    // settlement-lifecycle switch being off. A dark demographic lane still forwards the
    // empty array this path always returned.
    expect(read('src/domain/worldPulse/settlementLifecycleKernel.js'))
      .toContain('newsEntries: demo.newsEntries,');
  });

  test('no transcendental or Math.pow reaches any P4 seeded path', () => {
    for (const rel of [
      'src/domain/worldPulse/demographicsLadder.js',
      'src/domain/worldPulse/demographicsRisk.js',
      'src/domain/worldPulse/demographicsWar.js',
      'src/domain/worldPulse/demographicsObservation.js',
      'src/domain/worldPulse/demographicsHerald.js',
    ]) {
      const src = code(rel);
      expect(src.length, `${rel} read empty`).toBeGreaterThan(500);
      expect(/Math\.(pow|exp|log|sqrt|sin|cos|tan)\(/.test(src), `${rel} uses a transcendental`).toBe(false);
      // No em dash in a src/domain string literal (the house prose rule).
      expect(/['"`][^'"`\n]*—/.test(src), `${rel} carries an em dash in a literal`).toBe(false);
    }
  });

  test('the six P4 modules are pure leaves: no store, no React, no clock, no I/O', () => {
    const forbidden = /from '(react|zustand|.*\/store\/|node:fs)|Date\.now\(|Math\.random\(/;
    for (const rel of readdirSync(join(ROOT, 'src/domain/worldPulse'))
      .filter((f) => /^demographics(Ladder|Rates|Risk|War|Observation|Herald)\.js$/.test(f))) {
      const abs = join(ROOT, 'src/domain/worldPulse', rel);
      expect(statSync(abs).isFile()).toBe(true);
      expect(forbidden.test(readFileSync(abs, 'utf8')), `${rel} is not a pure leaf`).toBe(false);
    }
  });
});
