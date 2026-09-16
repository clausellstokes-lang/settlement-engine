/**
 * subsystemRowsPeople.test.js — the six PEOPLE certification rows
 * (stressors, relationship dynamics, population dynamics, migration flows,
 * the NPC growth layer, the NPC ladder).
 *
 * A certification row is a CLAIM ABOUT SOURCE: "this module emits these literals,
 * writes these containers, and deliberately declares nothing else". An unchecked
 * row rots the first time a rule file gains an emitter, and a rotted row grades
 * SILENT or ALIVE for a reason that has nothing to do with the engine. So this
 * file does three jobs:
 *
 *   1. SHAPE     the six rows are authored, not pending, and conform to the
 *                registry contract.
 *   2. TRACE     every declared channel is RE-DERIVED from the live source, and
 *                every deliberately EMPTY channel is justified by running the
 *                production classifier or by reading the live gate. The two big
 *                vocabularies (52 relationship literals, 66 stressor literals)
 *                are derived, never re-typed.
 *   3. VERDICT   each row reaches the verdicts it can reach, against receipts
 *                that differ in exactly one field.
 *
 * MEASURED NUMBERS in the row prose come from artifacts/soak (gitignored, so no
 * test may read it). Where a measurement matters to a verdict, the fixture below
 * reproduces its SHAPE and says which case it was transcribed from.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  SUBSYSTEM_SOAK_EVIDENCE,
  SUBSYSTEM_TEMPOS,
  evaluateSubsystemCertification,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { STRESSOR_CATALOG } from '../../src/domain/worldPulse/stressorsCore.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { mustExtract } from '../helpers/sourceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const PEOPLE_RULES = Object.freeze([
  'stressorsEnabled',
  'relationshipDynamicsEnabled',
  'populationDynamicsEnabled',
  'migrationFlowsEnabled',
  'npcGrowthEnabled',
  'npcLadderEnabled',
]);

const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const sorted = (list) => [...list].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

/**
 * Every candidateType literal the relationship rule files emit. The helper calls
 * (`internalDrift(ctx, "x", {` / `labelProposal(ctx, <label>, "x", {`) are all
 * single-line in these files, so a per-line scan is exact; the six inline rules
 * are caught by the `candidateType: "x"` form. Fail-closed by comparison: a
 * regex that stopped matching yields a smaller set and reds the equality below.
 */
function derivedRelationshipLiterals() {
  const found = new Set();
  for (const rel of [
    'src/domain/worldPulse/relationshipRulesCore.js',
    'src/domain/worldPulse/relationshipRulesAdversarial.js',
    'src/domain/worldPulse/relationshipRuleHelpers.js',
  ]) {
    for (const line of read(rel).split('\n')) {
      for (const pattern of [
        /internalDrift\(ctx,\s*"([a-z_]+)",\s*\{/,
        /labelProposal\(ctx,.*?"([a-z_]+)",\s*\{/,
        /candidateType:\s*"([a-z_]+)"/,
      ]) {
        const match = line.match(pattern);
        if (match) found.add(match[1]);
      }
    }
  }
  return found;
}

/** The rule keys pulseKernel reads directly off simulationRules, from source. */
function pulseKernelRuleReads() {
  const source = read('src/domain/worldPulse/pulseKernel.js');
  return [...source.matchAll(/simulationRules\.([A-Za-z]+Enabled)/g)].map((match) => match[1]);
}

/** Every boolean switch lit, so a fixture only names what it turns OFF. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

/** One synthetic observed year, shaped like behavioral-observation.mjs emits. */
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

/** A v5 receipt: it records its own configuration and a total worldState census. */
function receiptV5({ rules = litRules(), years = [], stateKeys = {} } = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'people-fixture-3y-4s',
    seed: 'people-fixture',
    years: years.length,
    settlements: 4,
    subsystems: {
      schemaVersion: 5,
      kind: 'soak_subsystem_configuration',
      presetId: 'full_simulation',
      rules,
      stateKeysComplete: true,
      stateKeys,
    },
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', settlementIds: [], yearly: years },
  };
}

/** A v4 receipt: the envelope every completed release case actually carries. */
function receiptV4(years) {
  return {
    schemaVersion: 4,
    kind: 'whole_world_soak',
    caseId: 'people-fixture-v4',
    years: years.length,
    settlements: 12,
    behavioral: { schemaVersion: 4, yearly: years },
  };
}

const rowFor = (evaluation, rule) => evaluation.rows.find((row) => row.rule === rule);

describe('people certification rows — shape', () => {
  test('all six rules are authored exactly once and none is still pending', () => {
    for (const rule of PEOPLE_RULES) {
      const matches = SUBSYSTEM_CERTIFICATION_REGISTRY.filter((row) => row.rule === rule);
      expect(matches.length, `${rule}: expected exactly one authored row`).toBe(1);
    }
    // Stated as a POSITIVE over a derived list rather than as six exclusions: the
    // pending lists are a burn-down that legitimately empties, so no fixed sibling
    // can serve as a liveness anchor for an absence claim. The assertion above
    // proves each rule is authored, and this one proves none of them is also
    // pending, which is the half of the partition this file owns.
    expect(
      [...SUBSYSTEM_CERTIFICATION_PENDING_KEYS].filter((key) => PEOPLE_RULES.includes(key)),
      'an authored people rule may not also sit in a lane PENDING list',
    ).toEqual([]);
  });

  test('every people row conforms to the registry contract', () => {
    for (const rule of PEOPLE_RULES) {
      const row = rowOf(rule);
      const where = `row ${rule}`;
      expect(SUBSYSTEM_TEMPOS, `${where}: unknown expectedTempo`).toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE, `${where}: unknown soakEvidence`).toContain(row.soakEvidence);
      expect(row.title.length, `${where}: empty title`).toBeGreaterThan(0);
      expect(row.aliveness.other.length, `${where}: an aliveness block with no prose hides its own gaps`)
        .toBeGreaterThan(80);
      expect(row.invariants.length, `${where}: at least one receipt-expressible invariant is required`)
        .toBeGreaterThan(0);
      for (const invariant of row.invariants) {
        expect(invariant.check.length, `${where}: invariant ${invariant.name} has no check`).toBeGreaterThan(0);
      }
      const channels = row.aliveness.eventTypes.length
        + row.aliveness.moverFamilies.length
        + row.aliveness.stateKeys.length;
      expect(channels, `${where}: a row must declare at least one channel`).toBeGreaterThan(0);
    }
  });
});

describe('people certification rows — traced to source', () => {
  test('the stressor vocabulary is the live catalog crossed with the three templates', () => {
    const catalogTypes = sorted(Object.keys(STRESSOR_CATALOG));
    expect(catalogTypes.length, 'the stressor catalog must be non-empty for this pin to mean anything')
      .toBeGreaterThan(15);
    const expected = sorted([
      'coup_succeeded',
      'coup_suppressed',
      'stressor_residual',
      ...catalogTypes.flatMap((type) => [
        `stressor_birth_${type}`,
        `stressor_escalate_${type}`,
        `stressor_spread_${type}`,
      ]),
    ]);
    expect(sorted(rowOf('stressorsEnabled').aliveness.eventTypes)).toEqual(expected);
    // The three templates are the exact source expressions, so a renamed prefix
    // reds here instead of silently emptying the channel.
    const stressors = read('src/domain/worldPulse/stressors.js');
    for (const template of [
      'candidateType: `stressor_birth_${type}`',
      'candidateType: `stressor_escalate_${stressor.type}`',
      'candidateType: `stressor_spread_${stressor.type}`',
      "candidateType: 'stressor_residual'",
    ]) {
      expect(mustExtract(stressors, template, 'stressor template')).toBe(template);
    }
    const coup = read('src/domain/worldPulse/coup.js');
    expect(mustExtract(coup, "candidateType: 'coup_succeeded'", 'coup verdict')).toBeTruthy();
    expect(mustExtract(coup, "candidateType: 'coup_suppressed'", 'coup verdict')).toBeTruthy();
  });

  test('the relationship vocabulary is re-derived from the rule files, literal for literal', () => {
    const derived = derivedRelationshipLiterals();
    expect(derived.size, 'the relationship extractor found nothing, so every claim below would be vacuous')
      .toBeGreaterThan(40);
    expect(sorted(rowOf('relationshipDynamicsEnabled').aliveness.eventTypes)).toEqual(sorted([...derived]));
  });

  test('the relationship row declares NO mover family because the classifier scatters it', () => {
    const row = rowOf('relationshipDynamicsEnabled');
    expect(row.aliveness.moverFamilies).toEqual([]);
    // Run the PRODUCTION classifier rather than re-reading its token lists.
    const families = new Map();
    for (const literal of row.aliveness.eventTypes) {
      const family = moverFamilyOf({ candidateType: literal, ruleFamily: 'relationship' });
      families.set(family, (families.get(family) || 0) + 1);
    }
    const named = [...families.keys()].filter((family) => family != null);
    expect(named.length, 'one relationship vocabulary spread over fewer than three families would be claimable')
      .toBeGreaterThanOrEqual(3);
    expect(families.get(null), 'at least one literal must fall through to unclassifiedEventCount')
      .toBeGreaterThan(0);
  });

  test('the relationship row declares NO state key because pulseKernel writes the states unconditionally', () => {
    expect(rowOf('relationshipDynamicsEnabled').aliveness.stateKeys).toEqual([]);
    const pulse = read('src/domain/worldPulse/pulseKernel.js');
    expect(mustExtract(pulse, 'worldState = ensureAllRelationshipStates(worldState, snapshot);', 'ensure')).toBeTruthy();
    expect(mustExtract(pulse, 'worldState = relaxRelationshipStates(worldState,', 'relax')).toBeTruthy();
    // The anchor proves the extraction is live: pulseKernel DOES read rule flags
    // off simulationRules, just never this one, which is why relationshipStates
    // exists in a world where the relationship rules never ran.
    expectAbsentWithAnchor(
      pulseKernelRuleReads(),
      'relationshipDynamicsEnabled',
      'stressorsEnabled',
      ' (pulseKernel gates the stressor passes but writes relationshipStates unconditionally)',
    );
  });

  test('the population vocabulary is the three kinds the source interpolates', () => {
    const source = read('src/domain/worldPulse/populationDynamics.js');
    expect(mustExtract(source, 'candidateType: `population_${kind}`', 'population template')).toBeTruthy();
    const kinds = mustExtract(source, /const kind = delta > 0 \? '(\w+)' : isMassEmigration \? '(\w+)' : '(\w+)'/, 'kinds');
    const declared = sorted(rowOf('populationDynamicsEnabled').aliveness.eventTypes);
    expect(declared).toEqual(['population_decline', 'population_emigration', 'population_growth']);
    for (const kind of ['growth', 'emigration', 'decline']) {
      expect(kinds, `population kind ${kind} left the source ternary`).toContain(`'${kind}'`);
    }
    // The record-mode blind spot the row prose rests on: ordinary drift is
    // state_only, so it can never reach a receipt's eventTypeCounts.
    expect(mustExtract(source, "{ recordMode: 'state_only' }", 'record mode')).toBeTruthy();
    expect(mustExtract(source, 'if (!rules.populationDynamicsEnabled) return [];', 'gate')).toBeTruthy();
  });

  test('the migration row declares the one flow literal and no sidecar', () => {
    const row = rowOf('migrationFlowsEnabled');
    expect(row.aliveness.eventTypes).toEqual(['flow_migration']);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(mustExtract(read('src/domain/worldPulse/flows.js'), "candidateType: 'flow_migration'", 'flow')).toBeTruthy();
    // The gate is a flowKind test, not a candidateType test, so the row's claim
    // that this literal is exclusively migration-gated rests on this line.
    expect(mustExtract(
      read('src/domain/worldPulse/candidateEvents.js'),
      "if (candidate.metadata?.flowKind === 'population') return rules.migrationFlowsEnabled;",
      'flow gate',
    )).toBeTruthy();
    // The second lane the same key gates, which the row records as unobservable.
    expect(mustExtract(
      read('src/domain/worldPulse/populationDynamics.js'),
      'if (isMassEmigration && rules.migrationFlowsEnabled',
      'transfer lane',
    )).toBeTruthy();
  });

  test('the two post-apply NPC rows declare their exclusive sidecar and no event type', () => {
    const growth = rowOf('npcGrowthEnabled');
    const ladder = rowOf('npcLadderEnabled');
    expect(growth.aliveness.eventTypes).toEqual([]);
    expect(ladder.aliveness.eventTypes).toEqual([]);
    expect(growth.aliveness.stateKeys).toEqual(['spatialLedgers.npcGrowth']);
    expect(ladder.aliveness.stateKeys).toEqual(['spatialLedgers.npcLadder']);
    // Exclusivity: each mover returns before touching its ledger when dark.
    const growthSource = read('src/domain/worldPulse/npcGrowthKernel.js');
    expect(mustExtract(growthSource, 'if (!npcGrowthActive(worldState)) {', 'growth gate')).toBeTruthy();
    expect(mustExtract(growthSource, "setSpatialLedger(/** @type {Record<string,unknown>} */ (worldState), 'npcGrowth'", 'growth ledger')).toBeTruthy();
    const ladderSource = read('src/domain/worldPulse/npcLadderKernel.js');
    expect(mustExtract(ladderSource, 'if (!npcLadderActive(worldState)) {', 'ladder gate')).toBeTruthy();
    expect(mustExtract(ladderSource, "setSpatialLedger(worldState, 'npcLadder'", 'ladder ledger')).toBeTruthy();
    // Both speak only through post-apply wizard news, which eventTypeCounts never
    // observes, so an impactKind may not be declared as an event type.
    expect(mustExtract(growthSource, "impactKind: 'npc_growth'", 'growth beat')).toBeTruthy();
    expect(mustExtract(ladderSource, "impactKind: 'npc_ladder'", 'ladder beat')).toBeTruthy();
  });

  test('NEITHER post-apply NPC row claims a mover family, because the classifier splits them', () => {
    expect(rowOf('npcGrowthEnabled').aliveness.moverFamilies).toEqual([]);
    expect(rowOf('npcLadderEnabled').aliveness.moverFamilies).toEqual([]);
    // The reason, executed rather than asserted: the classifier reads the whole
    // wizard-news id, and the ladder's id carries its contest kind, which is a
    // POLITICS token that outranks the `people` token in the same string. One lane,
    // two families, decided by runtime text the emitting module does not fix.
    const ladderChallenge = moverFamilyOf({
      id: 'wizard_news.52.npc_ladder.soak-a.challenge.guild.n1.n2',
      kind: 'applied',
      impactKind: 'npc_ladder',
    });
    const ladderSupport = moverFamilyOf({
      id: 'wizard_news.52.npc_support.soak-a.n1',
      kind: 'applied',
      impactKind: 'npc_support',
    });
    expect(ladderChallenge, 'the ladder challenge beat files under politics, not people').toBe('politics');
    expect(ladderSupport, 'the support beat files under people, so the lane genuinely splits').toBe('people');
  });

  test('the corroborating families each row names are the ones the classifier assigns to REAL records', () => {
    // Realistic shapes: the classifier reads type/kind/id too, and a probe that
    // omits them can certify a family the engine never actually produces.
    expect(moverFamilyOf({
      type: 'stressor', candidateType: 'stressor_birth_famine', ruleId: 'stressor_birth_famine', ruleFamily: 'stressor',
    })).toBe('pressure');
    expect(moverFamilyOf({
      type: 'population', candidateType: 'population_emigration', ruleId: 'population_emigration', ruleFamily: 'population',
    })).toBe('population');
    expect(rowOf('stressorsEnabled').aliveness.moverFamilies).toEqual(['pressure']);
    expect(rowOf('populationDynamicsEnabled').aliveness.moverFamilies).toEqual(['population']);
    // The migration row claims NO family, and this is why: a flow_migration
    // candidate carries type 'condition' (flows.js:81), and `condition` is a
    // PRESSURE token that outranks every population token in the same string.
    expect(moverFamilyOf({
      type: 'condition', candidateType: 'flow_migration', ruleId: 'flow_migration_famine', ruleFamily: 'flow',
    }), 'flow_migration classifies as pressure at runtime, not population').toBe('pressure');
    expect(rowOf('migrationFlowsEnabled').aliveness.moverFamilies).toEqual([]);
    expect(mustExtract(read('src/domain/worldPulse/flows.js'), "type: 'condition',", 'flow record type')).toBeTruthy();
  });
});

describe('people certification rows — the four verdicts', () => {
  test('ALIVE: the switch is on and the lane\'s own vocabulary fired', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { stressor_birth_famine: 2, neutral_border_incident: 5 }, moverCounts: { pressure: 2 } }),
        year(2, { eventTypeCounts: { stressor_escalate_famine: 1, vassal_rebellion: 3 }, moverCounts: { pressure: 1 } }),
      ],
      stateKeys: { 'spatialLedgers.npcLadder': { years: 2, maxEntries: 6, finalEntries: 6 } },
    }));
    expect(rowFor(evaluation, 'stressorsEnabled').verdict).toBe('ALIVE');
    expect(rowFor(evaluation, 'relationshipDynamicsEnabled').verdict).toBe('ALIVE');
    expect(rowFor(evaluation, 'npcLadderEnabled').verdict).toBe('ALIVE');
    expect(rowFor(evaluation, 'npcLadderEnabled').firedChannels).toEqual(['stateKeys']);
    expect(rowFor(evaluation, 'stressorsEnabled').tempo).toMatchObject({ observedYears: 2, yearsWithEvidence: 2 });
  });

  test('SILENT: the refugee lane is the measured silence this contract exists to name', () => {
    // The SHAPE the completed release corpus recorded: population motion in the
    // realm, and not one flow_migration in any observed year (transcribed from
    // release-30y-12s-seed2, which counted 323 population movers and zero
    // flow_migration across 30 years).
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { population_emigration: 40 }, moverCounts: { population: 40 } }),
        year(2, { eventTypeCounts: { population_emigration: 12 }, moverCounts: { population: 12 } }),
      ],
    }));
    const migration = rowFor(evaluation, 'migrationFlowsEnabled');
    expect(migration.verdict).toBe('SILENT');
    expect(migration.ruleState).toBe('on');
    expect(migration.instrumentedChannels).toEqual(['eventTypes']);
    expect(migration.evidence.eventTypes.total).toBe(0);
    expect(migration.tempo.yearsWithEvidence).toBe(0);
    expect(evaluation.silent).toContain('migrationFlowsEnabled');
    // CONTROL: the same receipt with one flow_migration grades ALIVE, so the
    // silence above measures the lane rather than ignoring it.
    const fired = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { population_emigration: 40, flow_migration: 1 }, moverCounts: { population: 41 } }),
        year(2, { eventTypeCounts: { population_emigration: 12 }, moverCounts: { population: 12 } }),
      ],
    }));
    expect(rowFor(fired, 'migrationFlowsEnabled').verdict).toBe('ALIVE');
    // And the population row reads ALIVE in both, which is what makes the
    // migration silence a finding rather than a dead realm.
    expect(rowFor(evaluation, 'populationDynamicsEnabled').verdict).toBe('ALIVE');
  });

  test('DORMANT_BY_CONFIG: a dark switch claims nothing about its lane', () => {
    const dark = evaluateSubsystemCertification(receiptV5({
      rules: litRules({ stressorsEnabled: false, npcGrowthEnabled: false }),
      years: [year(1), year(2)],
    }));
    expect(rowFor(dark, 'stressorsEnabled').verdict).toBe('DORMANT_BY_CONFIG');
    expect(rowFor(dark, 'npcGrowthEnabled').verdict).toBe('DORMANT_BY_CONFIG');
    // CONTROL: the identical receipt with both lit reaches a different verdict,
    // so the dormancy is caused by the flags and not by the empty years.
    const lit = evaluateSubsystemCertification(receiptV5({ years: [year(1), year(2)] }));
    expect(rowFor(lit, 'stressorsEnabled').verdict).toBe('SILENT');
    expect(rowFor(lit, 'npcGrowthEnabled').verdict).toBe('SILENT');
  });

  test('UNOBSERVED: an unknown configuration can never mint a silence diagnosis', () => {
    const evaluation = evaluateSubsystemCertification({
      schemaVersion: 5,
      kind: 'some_other_harness',
      years: 2,
      settlements: 4,
      behavioral: { schemaVersion: 4, yearly: [year(1), year(2)] },
    });
    for (const rule of PEOPLE_RULES) {
      expect(rowFor(evaluation, rule).verdict, `${rule} under an unknown configuration`).toBe('UNOBSERVED');
    }
  });

  test('a v4 receipt reports the two sidecar rows as an instrument gap, never as a pass', () => {
    // Every completed release case is this envelope. The one dispositive channel
    // these rows have (the stateKeys census) does not exist in v4, and neither row
    // claims a mover family, so neither can borrow a verdict from the realm's
    // other movers.
    const evaluation = evaluateSubsystemCertification(receiptV4([
      year(1, { eventTypeCounts: { npc_bargain: 9 }, moverCounts: { people: 40 } }),
      year(2, { eventTypeCounts: { npc_reform: 4 }, moverCounts: { people: 31 } }),
    ]));
    expect(evaluation.configSource).toBe('harness_default');
    for (const rule of ['npcGrowthEnabled', 'npcLadderEnabled']) {
      const row = rowFor(evaluation, rule);
      expect(row.verdict, `${rule} on a v4 receipt`).toBe('UNOBSERVED');
      expect(row.ruleState, `${rule} is lit by the full_simulation harness default`).toBe('on');
      expect(row.instrumentedChannels, `${rule}: nothing in a v4 receipt observes this lane`).toEqual([]);
      expect(row.unobservedChannels, `${rule}: the gap must be named`).toEqual(['stateKeys']);
    }
    // CONTROL: the same rows on a receipt that DOES instrument them reach a real
    // verdict, so the gap above is the schema and not the rows.
    const v5 = evaluateSubsystemCertification(receiptV5({ years: [year(1), year(2)] }));
    expect(rowFor(v5, 'npcLadderEnabled').verdict).toBe('SILENT');
    // Neither row may hide behind soakEvidence 'unobserved': that flag suppresses
    // SILENT permanently, including on the first v5 census that proves a ledger
    // empty. Both carry 'indirect' precisely so the diagnosis above stays possible.
    expect(rowOf('npcLadderEnabled').soakEvidence).toBe('indirect');
    expect(rowOf('npcGrowthEnabled').soakEvidence).toBe('indirect');
  });

  test('a v5 census that carries no growth ledger is a silence, not an instrument gap', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { moverCounts: { people: 12 } }), year(2, { moverCounts: { people: 9 } })],
      stateKeys: { npcStates: { years: 2, maxEntries: 48, finalEntries: 48 } },
    }));
    const growth = rowFor(evaluation, 'npcGrowthEnabled');
    expect(growth.verdict).toBe('SILENT');
    expect(growth.instrumentedChannels).toEqual(['stateKeys']);
    expect(growth.unobservedChannels).toEqual([]);
    // CONTROL: the same census carrying the ledger grades ALIVE, so the silence
    // above measures the ledger rather than the schema.
    const deposited = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { moverCounts: { people: 12 } }), year(2, { moverCounts: { people: 9 } })],
      stateKeys: {
        npcStates: { years: 2, maxEntries: 48, finalEntries: 48 },
        'spatialLedgers.npcGrowth': { years: 2, maxEntries: 5, finalEntries: 5 },
      },
    }));
    expect(rowFor(deposited, 'npcGrowthEnabled').verdict).toBe('ALIVE');
  });
});
