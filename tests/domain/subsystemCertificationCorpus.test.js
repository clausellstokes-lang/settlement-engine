/**
 * subsystemCertificationCorpus.test.js — THE ADVERSARIAL VALIDATION LANE for the
 * per-subsystem certification registry.
 *
 * The lane files each prove their OWN rows trace to source. The core evaluator test
 * proves the four verdicts move for the right reason. Neither asks the question this
 * file asks, which is the only one an adversary cares about:
 *
 *   Is every authored row actually CAPABLE of the verdict it advertises, and does the
 *   registry as a WHOLE reproduce the diagnosis a human found by hand?
 *
 * Four jobs, in ascending order of how badly a silent failure would hurt:
 *
 *   1. SATISFIABLE  a receipt lighting every channel a row declares must grade that
 *                   row ALIVE. A row whose declared stateKey is spelled in a form the
 *                   census never emits, or whose event literal the evaluator cannot
 *                   reach, would otherwise sit at UNOBSERVED forever and read as an
 *                   honest instrument gap instead of a broken row.
 *   2. FALSIFIABLE  an all-zero receipt with a TOTAL census and every switch lit must
 *                   grade NO row ALIVE. A row that grades ALIVE on nothing is worse
 *                   than no row at all.
 *   3. HONEST GAPS  a row may declare soakEvidence 'unobserved' AND a channel, which
 *                   converts an instrumented zero reading into UNOBSERVED rather than
 *                   SILENT. That is a legitimate move (an absent PRECONDITION is not a
 *                   silent engine) and it is also the one escape hatch in the contract,
 *                   so its population is ceilinged and every member must say what
 *                   observation would close its gap.
 *   4. THE CORPUS   the registry must reproduce, from transcribed receipt SHAPES, the
 *                   two horizon findings the completed soak ladder actually produced:
 *                   the settlement-lifecycle lane is SILENT at thirty years and ALIVE
 *                   at a hundred, and the population lane runs the other way. A
 *                   certification that cannot tell those apart is decoration.
 *
 * NO ARTIFACT READS. artifacts/soak is gitignored, so a test that read it would be
 * green on this machine and red everywhere else. Every fixture below reproduces the
 * SHAPE of a completed case and names the case it was transcribed from; the numbers
 * are per-year carriers chosen to match the measured cadence, not the full receipt.
 */
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  evaluateSubsystemCertification,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const LIFECYCLE = 'settlementLifecycleEnabled';
const POPULATION = 'populationDynamicsEnabled';
const MIGRATION = 'migrationFlowsEnabled';
const CONSTRUCTIVE = 'constructiveFlowsEnabled';
const WAR = 'warLayerEnabled';
const AGENCY = 'npcAgencyEnabled';

/**
 * The escape-hatch population as reviewed on 2026-07-31: faithSpreadEnabled and
 * religionDynamicsEnabled (a deity-free fixture cannot spread faith),
 * interventionEnabled (no coup was ever born for an intervention to join),
 * traditionsEnabled and reframeEnabled (their dispositive ledgers need the v5
 * census). SHRINK-ONLY: lower it when a row earns a real channel, never raise it to
 * admit a new row that would rather not be called SILENT.
 */
const UNOBSERVED_OVERRIDE_CEILING = 5;

const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const verdictOf = (evaluation, rule) => evaluation.rows.find((row) => row.rule === rule).verdict;
const channelCount = (row) => row.aliveness.eventTypes.length
  + row.aliveness.moverFamilies.length
  + row.aliveness.stateKeys.length;

/** Rows that declare nothing at all: they can never be ALIVE, and they say so. */
const noChannelRows = () => SUBSYSTEM_CERTIFICATION_REGISTRY.filter((row) => channelCount(row) === 0);

// The three predicates below are PURE over a registry, so each test drives them with
// a synthetic registry that must trip them BEFORE asserting the live registry is
// clean. Without that step a predicate that silently stopped matching would pass
// every assertion below on an empty result (guard the guard).

/** @param {ReadonlyArray<any>} rows rows that declare a channel yet call the soak blind to them */
const overrideRowsOf = (rows) => rows.filter((row) => row.soakEvidence === 'unobserved' && channelCount(row) > 0);
/** @param {ReadonlyArray<any>} rows rows claiming the contaminated `knowledge` mover family */
const contaminatedFamilyRowsOf = (rows) => rows.filter((row) => row.aliveness.moverFamilies.includes('knowledge'));
/** @param {ReadonlyArray<any>} rows override rows that never name the missing observation */
const unexplainedOverridesOf = (rows) => overrideRowsOf(rows)
  .filter((row) => !/OBSERVATION|observ|census|NEEDED|would close/i.test(row.aliveness.other));

/** A minimal well-formed row, so each synthetic fixture differs in exactly ONE way. */
const fixtureRow = (overrides = {}) => ({
  rule: 'fixtureEnabled',
  title: 'Fixture',
  module: 'src/domain/worldPulse/simulationRules.js',
  aliveness: { eventTypes: ['fixture_event'], moverFamilies: [], stateKeys: [], other: '' },
  expectedTempo: 'rare',
  invariants: [],
  soakEvidence: 'measured',
  ...overrides,
});

/** One synthetic observation year, carrying only the fields the evaluator reads. */
function year(index, eventTypeCounts = {}, moverCounts = {}) {
  return {
    year: index,
    eventCount: Object.values(eventTypeCounts).reduce((total, value) => total + value, 0),
    eventTypeCounts,
    moverCounts,
    selectedMoverCounts: {},
    postApplyMoverCounts: moverCounts,
  };
}

/**
 * A v4 envelope, the shape every completed release case on disk actually carries: no
 * subsystems section, so the switches come from the harness preset and every
 * sidecar-ledger channel reports as an instrument gap.
 */
function receiptV4(years, settlements) {
  return {
    schemaVersion: 4,
    kind: 'whole_world_soak',
    caseId: 'transcribed-shape',
    seed: 'transcribed-shape',
    years: years.length,
    settlements,
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', yearly: years },
  };
}

/** A v5 envelope: it records its own switches and claims a TOTAL worldState census. */
function receiptV5(years, stateKeys, rules) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'synthetic-probe',
    years: years.length,
    settlements: 4,
    subsystems: {
      schemaVersion: 5,
      kind: 'soak_subsystem_configuration',
      presetId: 'full_simulation',
      rules: rules || Object.fromEntries(simulationRuleKeys().map((key) => [key, true])),
      stateKeysComplete: true,
      stateKeys,
    },
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', yearly: years },
  };
}

/**
 * THE USEFUL-HORIZON SHAPE, transcribed from release-30y-12s-seed1: a steady
 * per-year carrier set, a first-year burst that never returns, and a war layer that
 * runs for two years out of thirty. The measured case emitted zero
 * settlement_terminal_death, zero settlement_resettled, zero flow_migration and zero
 * war_levy across all thirty years, and moved a large post-apply constructive family
 * against zero selected constructive.
 */
function thirtyYearShape() {
  const steady = { npc_bargain: 14, stressor_residual: 12, strategy_reroute: 34, vassal_rebellion: 11 };
  const movers = { constructive: 40, knowledge: 1, people: 61, place: 108, pressure: 102 };
  const years = [];
  for (let index = 1; index <= 30; index += 1) {
    const events = { ...steady };
    if (index === 1) Object.assign(events, { population_emigration: 107, war_mobilization: 73, army_deployed: 7 });
    if (index === 2) Object.assign(events, { war_exhaustion: 12, war_drain: 7 });
    years.push(year(index, events, movers));
  }
  return receiptV4(years, 12);
}

/**
 * THE CENTURY SHAPE, transcribed from release-100y-4s-seed1: the same steady
 * carriers, twenty terminal deaths and twenty resettlements spread over forty years,
 * a single war year, and NO population_emigration anywhere in the hundred.
 */
function centuryShape() {
  const steady = { npc_reform: 17, faction_law_preference_push: 25, trade_route_disruption: 10 };
  const movers = { constructive: 43, knowledge: 2, people: 33, place: 57, pressure: 29 };
  const years = [];
  for (let index = 1; index <= 100; index += 1) {
    const events = { ...steady };
    if (index >= 2 && index <= 41) events[index % 2 === 0 ? 'settlement_terminal_death' : 'settlement_resettled'] = 1;
    if (index === 7) Object.assign(events, { war_mobilization: 8, army_deployed: 2, conquest: 1 });
    years.push(year(index, events, movers));
  }
  return receiptV4(years, 4);
}

describe('subsystem certification — every row is satisfiable and falsifiable', () => {
  test('a receipt lighting all of a row\'s declared channels grades that row ALIVE', () => {
    const declaring = SUBSYSTEM_CERTIFICATION_REGISTRY.filter((row) => channelCount(row) > 0);
    expect(declaring.length, 'a registry where no row declares a channel proves nothing below')
      .toBeGreaterThan(0);
    for (const row of declaring) {
      const events = Object.fromEntries(row.aliveness.eventTypes.map((type) => [type, 1]));
      const movers = Object.fromEntries(row.aliveness.moverFamilies.map((family) => [family, 1]));
      const stateKeys = Object.fromEntries(
        row.aliveness.stateKeys.map((key) => [key, { years: 2, maxEntries: 1, finalEntries: 1 }]),
      );
      const evaluation = evaluateSubsystemCertification(
        receiptV5([year(1, events, movers), year(2, events, movers)], stateKeys),
      );
      expect(
        verdictOf(evaluation, row.rule),
        `row ${row.rule} declares channels the evaluator cannot read, so it can never be`
        + ` proven alive by any receipt. Check the stateKey spelling against the census form`
        + ` (spatialLedgers.<sub>) and the event literals against the emitting module.`,
      ).toBe('ALIVE');
    }
  });

  test('a row that declares no channel can never be ALIVE, and admits it', () => {
    const blind = noChannelRows();
    expect(blind.length, 'the honest-gap population is the finding; an empty one means the shape drifted')
      .toBeGreaterThan(0);
    const everything = Object.fromEntries(
      SUBSYSTEM_CERTIFICATION_REGISTRY.flatMap((row) => row.aliveness.eventTypes).map((type) => [type, 9]),
    );
    const loud = evaluateSubsystemCertification(receiptV5(
      [year(1, everything, { war: 99, place: 99, people: 99 })],
      { 'spatialLedgers.satellites': { years: 1, maxEntries: 9, finalEntries: 9 } },
    ));
    for (const row of blind) {
      expect(row.soakEvidence, `row ${row.rule} observes nothing, so it must say soakEvidence unobserved`)
        .toBe('unobserved');
      expect(
        verdictOf(loud, row.rule),
        `row ${row.rule} declares no channel yet reached a verdict off another subsystem's noise`,
      ).toBe('UNOBSERVED');
    }
  });

  test('an all-zero receipt with a total census grades no row ALIVE', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5(
      [year(1), year(2)],
      { pulseHistory: { years: 2, maxEntries: 2, finalEntries: 2 } },
    ));
    expect(evaluation.counts.ALIVE, 'a row that grades ALIVE on nothing is worse than no row').toBe(0);
    expect(evaluation.alive).toEqual([]);
    // Every switch lit and nothing moved, so the honest split is SILENT plus the
    // declared honest gaps. A registry that produced neither would be inert.
    expect(evaluation.counts.SILENT).toBeGreaterThan(0);
    expect(evaluation.silent).toContain(AGENCY);
  });

  test('every switch dark grades every row DORMANT_BY_CONFIG, whatever the receipt says', () => {
    const dark = Object.fromEntries(simulationRuleKeys().map((key) => [key, false]));
    const loudEvents = Object.fromEntries(
      SUBSYSTEM_CERTIFICATION_REGISTRY.flatMap((row) => row.aliveness.eventTypes).map((type) => [type, 5]),
    );
    const evaluation = evaluateSubsystemCertification(receiptV5(
      [year(1, loudEvents, { people: 20, place: 20 })],
      { 'spatialLedgers.satellites': { years: 1, maxEntries: 4, finalEntries: 4 } },
      dark,
    ));
    expect(evaluation.counts.DORMANT_BY_CONFIG).toBe(SUBSYSTEM_CERTIFICATION_REGISTRY.length);
  });
});

describe('subsystem certification — the honest-gap escape hatch stays bounded', () => {
  test('a row may downgrade a zero reading to UNOBSERVED only from a reviewed, ceilinged set', () => {
    // GUARD THE GUARD: a predicate that stopped matching would pass the ceiling and
    // the prose check below on an empty set, so prove it trips first.
    const planted = [
      fixtureRow(),
      fixtureRow({ rule: 'plantedEnabled', soakEvidence: 'unobserved' }),
    ];
    expect(overrideRowsOf(planted).map((row) => row.rule)).toEqual(['plantedEnabled']);
    expect(unexplainedOverridesOf(planted).map((row) => row.rule)).toEqual(['plantedEnabled']);
    const explained = [fixtureRow({
      rule: 'plantedEnabled',
      soakEvidence: 'unobserved',
      aliveness: { eventTypes: ['fixture_event'], moverFamilies: [], stateKeys: [], other: 'THE OBSERVATION NEEDED: a v5 census.' },
    })];
    expect(unexplainedOverridesOf(explained)).toEqual([]);

    const overrides = overrideRowsOf(SUBSYSTEM_CERTIFICATION_REGISTRY);
    expect(
      overrides.length,
      `${overrides.length} rows declare a channel and still call the soak blind to them`
      + ` (${overrides.map((row) => row.rule).join(', ')}). That converts a real SILENT into an`
      + ` instrument gap, so the population is ceilinged at ${UNOBSERVED_OVERRIDE_CEILING}. Give the`
      + ` new row a channel the receipt can read, or accept SILENT — do not raise this ceiling.`,
    ).toBeLessThanOrEqual(UNOBSERVED_OVERRIDE_CEILING);
    expect(overrides.length, 'an empty override set would make the prose check below vacuous')
      .toBeGreaterThan(0);
    // The escape is only honest when the row says what would close it, so the next
    // reader can build the missing instrument instead of inheriting a shrug.
    expect(
      unexplainedOverridesOf(SUBSYSTEM_CERTIFICATION_REGISTRY).map((row) => row.rule),
      'these rows downgrade their own silence to an instrument gap without naming the'
      + ' observation that would close it. Say what a receipt would have to carry.',
    ).toEqual([]);
  });

  test('the escape hatch is a downgrade, never an upgrade: it cannot manufacture ALIVE', () => {
    for (const row of overrideRowsOf(SUBSYSTEM_CERTIFICATION_REGISTRY)) {
      const events = Object.fromEntries(row.aliveness.eventTypes.map((type) => [type, 3]));
      const movers = Object.fromEntries(row.aliveness.moverFamilies.map((family) => [family, 3]));
      const stateKeys = Object.fromEntries(
        row.aliveness.stateKeys.map((key) => [key, { years: 1, maxEntries: 3, finalEntries: 3 }]),
      );
      const fired = evaluateSubsystemCertification(receiptV5([year(1, events, movers)], stateKeys));
      // Evidence still outranks the row's own pessimism: a channel that actually fired
      // proves the subsystem ran, whatever soakEvidence the author declared.
      expect(
        verdictOf(fired, row.rule),
        `row ${row.rule} declares soakEvidence unobserved and now cannot be proven alive even`
        + ` when its own declared channel fires. The declaration must dampen a ZERO reading, not`
        + ` a positive one.`,
      ).toBe('ALIVE');
    }
  });
});

describe('subsystem certification — the completed corpus diagnosis', () => {
  test('the thirty-year shape reproduces the hand-found silences', () => {
    const evaluation = evaluateSubsystemCertification(thirtyYearShape());
    // The v4 envelope carries no switches of its own, so the harness preset supplies
    // them. Losing that inference would turn every silence below into UNOBSERVED.
    expect(evaluation.configSource).toBe('harness_default');
    expect(evaluation.receipt.observedYears).toBe(30);
    expect(verdictOf(evaluation, LIFECYCLE)).toBe('SILENT');
    expect(verdictOf(evaluation, MIGRATION)).toBe('SILENT');
    expect(verdictOf(evaluation, CONSTRUCTIVE)).toBe('SILENT');
    // The lifecycle lane is the one a human found by hand. ALIVE would mean the
    // registry cannot see the very silence it was built to name; npcAgencyEnabled is
    // the anchor because it rides the same eventTypeCounts channel in the same receipt.
    expectAbsentWithAnchor(evaluation.silent, AGENCY, LIFECYCLE, 'thirty-year silences');
    expect(evaluation.alive).toContain(AGENCY);
    expect(evaluation.alive).toContain(WAR);
  });

  test('a v4 envelope reports its sidecar-only rows as gaps, never as manufactured silences', () => {
    const evaluation = evaluateSubsystemCertification(thirtyYearShape());
    // A row whose ONLY channel is a spatialLedgers sidecar has no instrument at all in
    // a v4 receipt, because the census arrived with v5. Grading it SILENT would invent
    // a finding out of a schema gap, which is the one dishonesty this contract cannot
    // afford: it would bury the real silences above in a wall of false ones.
    const sidecarOnly = SUBSYSTEM_CERTIFICATION_REGISTRY.filter((row) => row.aliveness.eventTypes.length === 0
      && row.aliveness.moverFamilies.length === 0
      && row.aliveness.stateKeys.length > 0);
    expect(sidecarOnly.length, 'no sidecar-only row means this pin measures nothing').toBeGreaterThan(0);
    for (const row of sidecarOnly) {
      expect(
        verdictOf(evaluation, row.rule),
        `row ${row.rule} declares only a v5 census channel, so a v4 receipt cannot answer for it`,
      ).toBe('UNOBSERVED');
    }
  });

  test('a shared mover family cannot rescue a lane the receipt never selected', () => {
    const evaluation = evaluateSubsystemCertification(thirtyYearShape());
    const constructive = evaluation.rows.find((row) => row.rule === CONSTRUCTIVE);
    // The measured corpus moved a large post-apply constructive family against zero
    // selected constructive. That is the signature of a post-apply lane, and it is
    // SHARED with the upswing lane, so it may corroborate and never conclude.
    expect(constructive.corroboratingOnlyEvidence).toBe(true);
    expect(constructive.evidence.moverFamilies.total).toBeGreaterThan(0);
    expect(constructive.tempo.yearsWithEvidence).toBe(0);
  });

  test('no row claims the contaminated knowledge family, and such a receipt grades nothing ALIVE', () => {
    // knowledgeLaneEvidence.js measured the contamination: fifteen impactKinds reach
    // the `knowledge` family through the bare token `news` in their own wizard-news
    // id, and only one reaches it on its own vocabulary. So a nonzero knowledge count
    // could be twenty-eight diplomacy notices, and no row may cite it as evidence.
    // GUARD THE GUARD first: the predicate must trip on a row that does claim it.
    expect(
      contaminatedFamilyRowsOf([fixtureRow({
        rule: 'plantedEnabled',
        aliveness: { eventTypes: [], moverFamilies: ['knowledge'], stateKeys: [], other: '' },
      })]).map((row) => row.rule),
    ).toEqual(['plantedEnabled']);
    expect(
      contaminatedFamilyRowsOf(SUBSYSTEM_CERTIFICATION_REGISTRY).map((row) => row.rule),
      'a row citing the `knowledge` mover family would grade alive off other subsystems\''
      + ' wizard-news ids. Cite the belief lane\'s own vocabulary or its ledgers instead.',
    ).toEqual([]);
    // Some row does declare SOME family, so the assertion above measures a selection
    // rather than an empty aliveness surface.
    const declaredFamilies = SUBSYSTEM_CERTIFICATION_REGISTRY.flatMap((row) => row.aliveness.moverFamilies);
    expect(declaredFamilies.length).toBeGreaterThan(0);

    const evaluation = evaluateSubsystemCertification(receiptV4([
      year(1, {}, { knowledge: 28 }),
      year(2, {}, { knowledge: 14 }),
    ], 12));
    expect(evaluation.counts.ALIVE).toBe(0);
    expect(evaluation.alive).toEqual([]);
  });

  test('the century shape flips both horizon findings, in opposite directions', () => {
    const evaluation = evaluateSubsystemCertification(centuryShape());
    expect(evaluation.receipt.observedYears).toBe(100);
    // The lane that was SILENT at thirty years fires at a hundred. This is the whole
    // reason expectedTempo exists: a `rare` subsystem is not a dead one.
    expect(verdictOf(evaluation, LIFECYCLE)).toBe('ALIVE');
    // And the lane that was ALIVE at thirty years goes silent at a hundred, which is
    // a finding the completed ladder produced and no whole-world check asked about.
    expect(verdictOf(evaluation, POPULATION)).toBe('SILENT');
    // anchored: the same list is asserted to contain POPULATION on the line above, so it cannot be empty
    expect(evaluation.silent).not.toContain(LIFECYCLE);
    expect(evaluation.silent).toContain(POPULATION);
  });

  test('a war that runs one year in a hundred is ALIVE and reported as slowing', () => {
    const evaluation = evaluateSubsystemCertification(centuryShape());
    const war = evaluation.rows.find((row) => row.rule === WAR);
    expect(war.verdict).toBe('ALIVE');
    // A subsystem that fires once and stops is not a passing subsystem. The tempo
    // floor is what makes the difference visible before the lane dies outright.
    expect(war.tempo.meetsExpectedTempo).toBe(false);
    expect(evaluation.slowing).toContain(WAR);
    // CONTROL: the thirty-year shape ran its war across two of thirty years, clears
    // the same multi_year floor, and is therefore NOT reported as slowing. So the
    // flag tracks cadence rather than being pinned on by the row's shape.
    const useful = evaluateSubsystemCertification(thirtyYearShape());
    expect(useful.slowing).toContain(POPULATION);
    // anchored: the same list is asserted to contain POPULATION on the line above, so it cannot be empty
    expect(useful.slowing).not.toContain(WAR);
  });

  test('the registry answers for every switch the engine can present', () => {
    const evaluation = evaluateSubsystemCertification(thirtyYearShape());
    expect(evaluation.coverage.ok).toBe(true);
    expect(evaluation.rows.length + evaluation.pendingRuleKeys.length).toBe(simulationRuleKeys().length);
    // Every graded row reaches exactly one of the four verdicts, so no receipt can
    // leave a subsystem unanswered.
    const graded = evaluation.counts.ALIVE + evaluation.counts.SILENT
      + evaluation.counts.UNOBSERVED + evaluation.counts.DORMANT_BY_CONFIG;
    expect(graded).toBe(SUBSYSTEM_CERTIFICATION_REGISTRY.length);
    expect(rowOf(LIFECYCLE), 'the lane this whole contract was built around must exist').toBeTruthy();
  });
});
