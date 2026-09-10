/**
 * subsystemRowsFaithPolitics.test.js — the six FAITH AND POLITICS certification rows
 * (religionDynamicsEnabled, faithSpreadEnabled, factionCompetitionEnabled,
 * interventionEnabled, reframeEnabled, traditionsEnabled).
 *
 * TWO THINGS ARE PINNED HERE, and the second is the one that matters.
 *
 *   1. THE VOCABULARY IS TRACED, NOT INVENTED. Every event type a row declares is
 *      re-derived from the module that emits it, and every literal the row
 *      deliberately REFUSES is proved to exist in the source while staying out of
 *      the row. A registry that drifts into fiction certifies nothing, and the
 *      refusals are where a row would go vacuous first: the conversion fracture
 *      fires with faith spread dark, faction_challenge fires with the faction
 *      chooser dark, and either one would have handed its row a false ALIVE.
 *
 *   2. THE VERDICTS ARE HONEST ABOUT AN ABSENT INSTRUMENT. Five of these six
 *      subsystems cannot be certified from the completed corpus at all, for three
 *      different reasons: faith spread never ran (the soak fixture carries no
 *      deities, so its outer activation gate was shut), intervention was never
 *      offered a contest (zero coup births in any release case), and traditions and
 *      reframe emit nothing a v4 receipt records. UNOBSERVED is the correct verdict
 *      for all five, and the last test in this file proves UNOBSERVED is not a mute
 *      button: the same rows grade ALIVE the moment a census carries their sidecar.
 *
 * The receipt fixtures below MIRROR the completed corpus rather than reading it:
 * artifacts/ is untracked, so a test that read it would red on a fresh checkout.
 * The measured numbers are quoted where a fixture stands in for one.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  evaluateSubsystemCertification,
} from '../../src/domain/certification/subsystemCertification.js';
import { FACTION_VERB_PHRASES } from '../../src/domain/worldPulse/factionCompetition.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const source = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const FAITH_SPREAD = 'faithSpreadEnabled';
const RELIGION_ALIAS = 'religionDynamicsEnabled';
const FACTIONS = 'factionCompetitionEnabled';
const INTERVENTION = 'interventionEnabled';
const REFRAME = 'reframeEnabled';
const TRADITIONS = 'traditionsEnabled';
const GROUP = [FAITH_SPREAD, RELIGION_ALIAS, FACTIONS, INTERVENTION, REFRAME, TRADITIONS];

const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const verdictOf = (evaluation, rule) => evaluation.rows.find((row) => row.rule === rule);

/** One synthetic observed year, in the shape behavioral-observation.mjs emits. */
function year(index, { eventTypeCounts = {}, moverCounts = {} } = {}) {
  return {
    year: index,
    eventCount: Object.values(eventTypeCounts).reduce((total, value) => total + value, 0),
    eventTypeCounts,
    moverCounts,
    selectedMoverCounts: moverCounts,
    postApplyMoverCounts: {},
  };
}

/**
 * A v4 receipt: exactly what every completed release case is. It records no rule
 * state of its own, so the evaluator resolves the switches from the harness preset,
 * and it carries no stateKeys census at all, so every sidecar channel is a gap.
 */
function receiptV4(years) {
  return {
    schemaVersion: 4,
    kind: 'whole_world_soak',
    caseId: 'fixture-faith-politics',
    seed: 'fixture',
    years: years.length,
    settlements: 12,
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', yearly: years },
  };
}

/** A v5 receipt: it records its own switches and a TOTAL worldState census. */
function receiptV5({ rules, years, stateKeys = {} }) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'fixture-faith-politics-v5',
    seed: 'fixture',
    years: years.length,
    settlements: 12,
    subsystems: {
      schemaVersion: 5,
      kind: 'soak_subsystem_configuration',
      presetId: 'full_simulation',
      rules,
      stateKeysComplete: true,
      stateKeys,
    },
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', yearly: years },
  };
}

/**
 * The corpus shape, condensed to four years: the faction chooser firing every year
 * (measured 100 of 100 years in the 100-year case), the war and faith and politics
 * families moving (measured in every case), and NOT ONE faith-spread or
 * intervention literal (measured zero across all seven completed cases).
 */
const CORPUS_YEARS = [1, 2, 3, 4].map((index) => year(index, {
  eventTypeCounts: {
    faction_institution_capture: 3,
    faction_law_preference_push: 5,
    npc_bargain: 4,
    war_mobilization: 2,
  },
  moverCounts: { politics: 8, war: 2, faith: 38, place: 3, people: 4 },
}));

describe('faith-politics rows: registry membership', () => {
  test('all six rules are authored rather than pending, and the partition stays exact', () => {
    const pending = new Set(SUBSYSTEM_CERTIFICATION_PENDING_KEYS);
    for (const rule of GROUP) {
      const row = rowOf(rule);
      expect(row, `${rule} has no authored certification row`).toBeTruthy();
      expect(row.title.length, `${rule} has no title`).toBeGreaterThan(0);
      expect(row.invariants.length, `${rule} declares no invariant`).toBeGreaterThan(0);
      // anchored: the same loop asserted the row EXISTS one line above, so an empty
      // or renamed registry fails there before this membership question is asked.
      expect(pending.has(rule), `${rule} is claimed as BOTH authored and pending`).toBe(false);
    }
  });
});

describe('faith-politics rows: the declared vocabulary is traced to its module', () => {
  test('the faith rows declare the three SPREAD-EXCLUSIVE literals and refuse the conversion fracture', () => {
    const spread = rowOf(FAITH_SPREAD);
    const alias = rowOf(RELIGION_ALIAS);
    // The alias key gates nothing of its own, so the two rows must not drift apart.
    expect([...alias.aliveness.eventTypes]).toEqual([...spread.aliveness.eventTypes]);
    expect([...spread.aliveness.eventTypes]).toEqual([
      'faith_foothold_recruited',
      'faith_pact_formed',
      'stressor_birth_religious_pact_betrayal',
    ]);
    // Each declared literal is still emitted by the module the row names.
    const stanceLane = source('src/domain/worldPulse/deityStanceLane.js');
    for (const literal of spread.aliveness.eventTypes) {
      expect(stanceLane, `deityStanceLane.js no longer emits ${literal}`)
        .toContain(`candidateType: '${literal}'`);
    }
    // THE REFUSAL. The conversion fracture is real vocabulary in the same subsystem,
    // but the patron seat can change from LOCAL share drift alone, so it fires with
    // spread dark. The anchor is a sibling literal that IS declared, which proves the
    // row is populated and correctly keyed rather than empty.
    const contest = source('src/domain/worldPulse/religiousContest.js');
    expect(contest, 'religiousContest.js no longer emits the conversion fracture, so the refusal below is moot')
      .toContain("candidateType: 'stressor_birth_religious_conversion_fracture'");
    expectAbsentWithAnchor(
      [...spread.aliveness.eventTypes],
      'stressor_birth_religious_conversion_fracture',
      'faith_pact_formed',
      'the faith spread row must not claim a literal the LOCAL faith lane can emit',
    );
  });

  test('the faction row declares exactly the module vocabulary and refuses the faction_challenge archetype', () => {
    const row = rowOf(FACTIONS);
    // FACTION_VERB_PHRASES is the module's own authoritative table (a new faction_*
    // type must extend it), so set equality here makes the row extend with it.
    expect([...row.aliveness.eventTypes].sort()).toEqual(Object.keys(FACTION_VERB_PHRASES).sort());
    // THE REFUSAL. faction_challenge appears in the completed receipts and is NOT
    // this vocabulary: it is a condition archetype minted by lanes that never read
    // factionCompetitionEnabled, so a row that claimed it could grade ALIVE with the
    // chooser dark.
    const homecoming = source('src/domain/worldPulse/deploymentReturn.js');
    expect(homecoming, 'deploymentReturn.js no longer mints the faction_challenge archetype')
      .toContain("'faction_challenge'");
    expect(homecoming, 'deploymentReturn.js no longer routes its archetype into a candidateType')
      .toContain('candidateType: archetype');
    expectAbsentWithAnchor(
      [...row.aliveness.eventTypes],
      'faction_challenge',
      'faction_government_challenge',
      'the faction row must not claim an archetype other subsystems mint',
    );
    // And the obvious ledger stays unclaimed: pulseKernel evolves factionStates on
    // every tick regardless of the flag, so it can never witness the chooser.
    expect([...row.aliveness.stateKeys]).toEqual([]);
    expect(source('src/domain/worldPulse/pulseKernel.js'), 'the unconditional factionStates writer moved; re-check the stateKeys refusal above')
      .toContain('ensureFactionStates(worldState, snapshot');
  });

  test('the ledger-only rows name a sidecar their module writes, and claim no event they cannot emit', () => {
    const cases = [
      [INTERVENTION, 'spatialLedgers.interventions', 'src/domain/worldPulse/convergence.js', 'interventions'],
      [TRADITIONS, 'spatialLedgers.traditions', 'src/domain/worldPulse/traditionsKernel.js', 'traditions'],
      [REFRAME, 'spatialLedgers.reframes', 'src/domain/worldPulse/reframeKernel.js', 'reframes'],
    ];
    for (const [rule, declared, modulePath, ledgerKey] of cases) {
      const row = rowOf(rule);
      expect([...row.aliveness.stateKeys], `${rule} declares the wrong sidecar`).toEqual([declared]);
      expect(source(modulePath), `${modulePath} no longer writes the ${ledgerKey} ledger`)
        .toContain(`setSpatialLedger(`);
      expect(source(modulePath), `${modulePath} no longer names the ${ledgerKey} ledger`)
        .toContain(`'${ledgerKey}'`);
    }
    // Traditions and reframe declare NO event vocabulary, and that is a fact about
    // their modules rather than an unfinished row: neither file contains a single
    // candidateType, so neither can ever reach a receipt's eventTypeCounts.
    expect([...rowOf(TRADITIONS).aliveness.eventTypes]).toEqual([]);
    expect([...rowOf(REFRAME).aliveness.eventTypes]).toEqual([]);
    for (const modulePath of ['src/domain/worldPulse/traditionsKernel.js', 'src/domain/worldPulse/reframeKernel.js']) {
      const text = source(modulePath);
      expect(text.length, `${modulePath} is empty, so the absence below would be vacuous`).toBeGreaterThan(1000);
      // anchored: the two assertions above prove this exact file is non-empty and still writes its own ledger, so an emptied or renamed module reds before this negative is reached.
      expect(text, `${modulePath} now emits a candidateType; the row must declare it`).not.toMatch(/candidateType:/);
    }
    // Intervention DOES have one literal, reachable only on the DM-driven arm.
    expect([...rowOf(INTERVENTION).aliveness.eventTypes]).toEqual(['intervention_ordered']);
    expect(source('src/domain/worldPulse/convergence.js'))
      .toContain("candidateType: 'intervention_ordered'");
  });
});

describe('faith-politics rows: the verdicts a completed receipt produces', () => {
  test('the corpus shape grades the faction chooser ALIVE and the other five UNOBSERVED', () => {
    const evaluation = evaluateSubsystemCertification(receiptV4(CORPUS_YEARS));
    // The completed cases record no rule state, so the switches come from the
    // harness preset the soak hardcodes.
    expect(evaluation.configSource).toBe('harness_default');

    const factions = verdictOf(evaluation, FACTIONS);
    expect(factions.verdict).toBe('ALIVE');
    expect(factions.firedChannels).toContain('eventTypes');
    expect(factions.tempo).toMatchObject({ observedYears: 4, yearsWithEvidence: 4, meetsExpectedTempo: true });

    for (const rule of [FAITH_SPREAD, RELIGION_ALIAS, INTERVENTION, REFRAME, TRADITIONS]) {
      const row = verdictOf(evaluation, rule);
      expect(row.verdict, `${rule} should read UNOBSERVED against a v4 receipt`).toBe('UNOBSERVED');
      expect(row.ruleState, `${rule} is lit by the full_simulation preset the soak drives`).toBe('on');
    }
    // The two faith rows name ONE lane, so they must never grade differently.
    expect(verdictOf(evaluation, RELIGION_ALIAS).verdict).toBe(verdictOf(evaluation, FAITH_SPREAD).verdict);
    // The faith rows read zero on an instrumented channel: without the row's own
    // soakEvidence declaration this would mint a SILENT diagnosis, and the fixture
    // world simply had no deity for faith to spread from.
    expect(verdictOf(evaluation, FAITH_SPREAD).silentChannels).toEqual(['eventTypes']);
    // Reframe can reach no v4 channel at all, so nothing about it was instrumented.
    expect(verdictOf(evaluation, REFRAME).instrumentedChannels).toEqual([]);
    expect(verdictOf(evaluation, REFRAME).unobservedChannels).toEqual(['stateKeys']);
  });

  test('traditions reports corroborating-only evidence instead of borrowing the shared faith family', () => {
    const evaluation = evaluateSubsystemCertification(receiptV4(CORPUS_YEARS));
    const traditions = verdictOf(evaluation, TRADITIONS);
    // Measured on the completed corpus: 38 postApply faith beats against 38 founding
    // traditions at 12 settlements, 94 against 94 at 30. The family moves at exactly
    // this lane's rate, and it is STILL shared, so it corroborates and never carries.
    expect(traditions.evidence.moverFamilies.total).toBe(38 * 4);
    expect(traditions.firedChannels).toEqual(['moverFamilies']);
    expect(traditions.corroboratingOnlyEvidence).toBe(true);
    expect(traditions.verdict).toBe('UNOBSERVED');
    // Intervention rides the same rule: the war family moves for a dozen reasons.
    expect(verdictOf(evaluation, INTERVENTION).corroboratingOnlyEvidence).toBe(true);
  });

  test('soakEvidence unobserved is not a mute button: a census carrying the sidecar grades ALIVE', () => {
    const rules = {};
    for (const rule of GROUP) rules[rule] = true;
    const evaluation = evaluateSubsystemCertification(receiptV5({
      rules,
      years: CORPUS_YEARS,
      stateKeys: {
        'spatialLedgers.traditions': { years: 4, maxEntries: 38, finalEntries: 38 },
        'spatialLedgers.reframes': { years: 2, maxEntries: 4, finalEntries: 4 },
        'spatialLedgers.interventions': { years: 1, maxEntries: 1, finalEntries: 1 },
      },
    }));
    for (const rule of [TRADITIONS, REFRAME, INTERVENTION]) {
      const row = verdictOf(evaluation, rule);
      expect(row.verdict, `${rule} must grade ALIVE once its own sidecar is censused`).toBe('ALIVE');
      expect(row.firedChannels, `${rule} must be alive on its sidecar, not on a shared family`)
        .toContain('stateKeys');
    }
    // CONTROL: the faith rows declare NO sidecar, so the identical census leaves them
    // unobserved. The verdict tracks each row's own declared channel, not the census.
    expect(verdictOf(evaluation, FAITH_SPREAD).verdict).toBe('UNOBSERVED');
  });

  test('all six grade DORMANT_BY_CONFIG when their switches are dark', () => {
    const rules = {};
    for (const rule of GROUP) rules[rule] = false;
    const dark = evaluateSubsystemCertification(receiptV4(CORPUS_YEARS), { rules });
    for (const rule of GROUP) {
      expect(verdictOf(dark, rule).verdict, `${rule} should be dormant, not silent`).toBe('DORMANT_BY_CONFIG');
    }
    // CONTROL: the identical receipt with the switches lit reaches other verdicts, so
    // the dormancy above is caused by the configuration and not by the fixture.
    const lit = evaluateSubsystemCertification(receiptV4(CORPUS_YEARS));
    expect(verdictOf(lit, FACTIONS).verdict).toBe('ALIVE');
    expect(verdictOf(lit, TRADITIONS).verdict).toBe('UNOBSERVED');
  });
});
