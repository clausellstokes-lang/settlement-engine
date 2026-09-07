/**
 * subsystemCertification.test.js — the per-subsystem certification evaluator.
 *
 * Every verdict is exercised against a hand-built receipt whose fields differ in
 * exactly the one way that should move the verdict, so a passing assertion names
 * a cause rather than a coincidence:
 *   ALIVE             the switch is on and the subsystem's OWN vocabulary fired.
 *   DORMANT_BY_CONFIG the switch is off in the recorded configuration.
 *   SILENT            the switch is on and every instrumented channel read zero.
 *   UNOBSERVED        the receipt cannot answer (no configuration, or no
 *                     instrumented channel).
 *
 * Plus the two rules that keep a verdict from going vacuous: a shared mover
 * family can never carry ALIVE on its own, and a v4 receipt keeps its v4 meaning
 * while its sidecar-ledger channels report as an instrument gap.
 */
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  evaluateSubsystemCertification,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';

const LIFECYCLE = 'settlementLifecycleEnabled';
const AGENCY = 'npcAgencyEnabled';

/** Every boolean switch lit, so a fixture only has to name what it turns OFF. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

/**
 * One synthetic year. Only the fields the evaluator reads are populated; the
 * shape mirrors what scripts/audit/behavioral-observation.mjs emits.
 */
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
    caseId: 'fixture-3y-4s-seed1',
    seed: 'fixture',
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

const rowFor = (evaluation, rule) => evaluation.rows.find((row) => row.rule === rule);

describe('evaluateSubsystemCertification — the four verdicts', () => {
  test('ALIVE: the switch is on and the subsystem\'s own event vocabulary fired', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { npc_bargain: 4, npc_reform: 2 }, moverCounts: { people: 6 } }),
        year(2, { eventTypeCounts: { npc_protect: 3 }, moverCounts: { people: 3 } }),
      ],
    }));
    const agency = rowFor(evaluation, AGENCY);
    expect(agency.verdict).toBe('ALIVE');
    expect(agency.ruleState).toBe('on');
    expect(agency.evidence.eventTypes.total).toBe(9);
    expect(agency.firedChannels).toEqual(['eventTypes', 'moverFamilies']);
    expect(agency.tempo).toMatchObject({ observedYears: 2, yearsWithEvidence: 2, meetsExpectedTempo: true });
    expect(evaluation.configSource).toBe('receipt');
    expect(evaluation.configComplete).toBe(true);
  });

  test('DORMANT_BY_CONFIG: the switch is off, so nothing is claimed about the subsystem', () => {
    const dark = evaluateSubsystemCertification(receiptV5({
      rules: litRules({ [LIFECYCLE]: false }),
      years: [year(1), year(2)],
    }));
    expect(rowFor(dark, LIFECYCLE).verdict).toBe('DORMANT_BY_CONFIG');
    expect(rowFor(dark, LIFECYCLE).ruleState).toBe('off');
    expect(dark.dormant).toEqual([LIFECYCLE]);
    // CONTROL: the identical receipt with the switch lit reaches a different
    // verdict, so the dormancy above is caused by the flag and not by the empty
    // years.
    const lit = evaluateSubsystemCertification(receiptV5({ years: [year(1), year(2)] }));
    expect(rowFor(lit, LIFECYCLE).verdict).toBe('SILENT');
  });

  test('SILENT: the switch is on, the instrument is complete, and every channel read zero', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2), year(3)],
      // A total census that simply never contains the satellites ledger: the
      // lane never founded a steading.
      stateKeys: { pulseHistory: { years: 3, maxEntries: 3, finalEntries: 3 } },
    }));
    const lifecycle = rowFor(evaluation, LIFECYCLE);
    expect(lifecycle.verdict).toBe('SILENT');
    expect(lifecycle.firedChannels).toEqual([]);
    expect(lifecycle.instrumentedChannels).toEqual(['eventTypes', 'stateKeys']);
    expect(lifecycle.unobservedChannels).toEqual([]);
    expect(evaluation.silent).toContain(LIFECYCLE);
    // CONTROL: the same receipt whose census DOES carry the ledger grades ALIVE,
    // proving the SILENT above measures the ledger rather than ignoring it.
    const founded = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2), year(3)],
      stateKeys: { 'spatialLedgers.satellites': { years: 2, maxEntries: 3, finalEntries: 3 } },
    }));
    expect(rowFor(founded, LIFECYCLE).verdict).toBe('ALIVE');
    expect(rowFor(founded, LIFECYCLE).firedChannels).toEqual(['stateKeys']);
  });

  test('UNOBSERVED: an unknown configuration can never mint a silence diagnosis', () => {
    const evaluation = evaluateSubsystemCertification({
      schemaVersion: 5,
      kind: 'some_other_harness',
      years: 2,
      settlements: 4,
      behavioral: { schemaVersion: 4, yearly: [year(1), year(2)] },
    });
    expect(evaluation.configSource).toBe('unknown');
    expect(rowFor(evaluation, LIFECYCLE).verdict).toBe('UNOBSERVED');
    expect(rowFor(evaluation, LIFECYCLE).ruleState).toBe('unknown');
    // Evidence still outranks ignorance: an unknown configuration that clearly
    // fired is ALIVE, because the firing happened whatever the flag said.
    const fired = evaluateSubsystemCertification({
      schemaVersion: 5,
      kind: 'some_other_harness',
      years: 1,
      settlements: 4,
      behavioral: { schemaVersion: 4, yearly: [year(1, { eventTypeCounts: { npc_bargain: 2 } })] },
    });
    expect(rowFor(fired, AGENCY).verdict).toBe('ALIVE');
  });

  test('UNOBSERVED: a receipt carrying no observed years instruments nothing', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5({ years: [] }));
    expect(rowFor(evaluation, AGENCY).verdict).toBe('UNOBSERVED');
    expect(rowFor(evaluation, AGENCY).instrumentedChannels).toEqual([]);
    expect(evaluation.counts.UNOBSERVED).toBe(SUBSYSTEM_CERTIFICATION_REGISTRY.length);
  });
});

describe('evaluateSubsystemCertification — the anti-vacuity rules', () => {
  test('a shared mover family alone cannot carry ALIVE', () => {
    // `people` is fed by the NPC ladder and the growth layer as well as the
    // agency chooser, so a moving family with no npc_* event proves the world
    // moved, not that this subsystem did.
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { moverCounts: { people: 40 } }), year(2, { moverCounts: { people: 35 } })],
    }));
    const agency = rowFor(evaluation, AGENCY);
    expect(agency.verdict).toBe('SILENT');
    expect(agency.corroboratingOnlyEvidence).toBe(true);
    expect(agency.evidence.moverFamilies.total).toBe(75);
    // The tempo cadence must not be borrowed from the shared family either.
    expect(agency.tempo.yearsWithEvidence).toBe(0);
  });

  test('one rule key gating two lanes reports the silent lane instead of averaging it away', () => {
    // settlementLifecycleEnabled gates BOTH the first-class founding and death
    // candidates AND the satellite ledger. A v5 probe measured three satellites
    // in one year with zero foundings or deaths, which is ALIVE overall and a
    // finding on one lane.
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      stateKeys: { 'spatialLedgers.satellites': { years: 2, maxEntries: 3, finalEntries: 3 } },
    }));
    const lifecycle = rowFor(evaluation, LIFECYCLE);
    expect(lifecycle.verdict).toBe('ALIVE');
    expect(lifecycle.partiallySilent).toBe(true);
    expect(lifecycle.firedChannels).toEqual(['stateKeys']);
    expect(lifecycle.silentChannels).toEqual(['eventTypes']);
    expect(evaluation.partiallySilent).toEqual([LIFECYCLE]);
    // CONTROL: once the first-class lane also fires, the flag clears, so it
    // tracks the lane rather than being pinned on by the row's shape.
    const bothLanes = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { eventTypeCounts: { settlement_terminal_death: 1 } }), year(2)],
      stateKeys: { 'spatialLedgers.satellites': { years: 2, maxEntries: 3, finalEntries: 3 } },
    }));
    expect(rowFor(bothLanes, LIFECYCLE).partiallySilent).toBe(false);
    expect(bothLanes.partiallySilent).toEqual([]);
  });

  test('v4 receipts keep their v4 meaning and report the sidecar channel as a gap', () => {
    const v4 = {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      caseId: 'fixture-2y-4s-seed1',
      years: 2,
      settlements: 4,
      behavioral: {
        schemaVersion: 4,
        yearly: [year(1, { eventTypeCounts: { npc_bargain: 3 } }), year(2)],
      },
    };
    const evaluation = evaluateSubsystemCertification(v4);
    // The harness hardcodes the full_simulation preset, so the switches are known
    // by construction even though the receipt predates recording them.
    expect(evaluation.configSource).toBe('harness_default');
    expect(evaluation.configComplete).toBe(false);
    expect(rowFor(evaluation, AGENCY).verdict).toBe('ALIVE');
    const lifecycle = rowFor(evaluation, LIFECYCLE);
    expect(lifecycle.verdict).toBe('SILENT');
    // Honest: the event channel read zero, and the ledger channel could not be
    // read at all. SILENT wins over UNOBSERVED because an instrumented channel
    // did answer, and the gap is reported rather than hidden.
    expect(lifecycle.instrumentedChannels).toEqual(['eventTypes']);
    expect(lifecycle.unobservedChannels).toEqual(['stateKeys']);
  });

  test('a caller-supplied configuration overrides inference, and garbage never throws', () => {
    const v4 = {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      years: 1,
      settlements: 4,
      behavioral: { schemaVersion: 4, yearly: [year(1)] },
    };
    const overridden = evaluateSubsystemCertification(v4, { rules: { [LIFECYCLE]: false, [AGENCY]: false } });
    expect(overridden.configSource).toBe('caller');
    expect(overridden.counts.DORMANT_BY_CONFIG).toBe(2);
    for (const garbage of [null, undefined, 42, 'receipt', [], { behavioral: { yearly: 'nope' } }]) {
      const evaluation = evaluateSubsystemCertification(garbage);
      expect(evaluation.rows.length).toBe(SUBSYSTEM_CERTIFICATION_REGISTRY.length);
      expect(evaluation.counts.ALIVE).toBe(0);
    }
  });

  test('the evaluation reports its own coverage gap rather than implying totality', () => {
    const evaluation = evaluateSubsystemCertification(receiptV5({ years: [year(1)] }));
    expect(evaluation.coverage.ok).toBe(true);
    expect(evaluation.rows.length + evaluation.pendingRuleKeys.length).toBe(simulationRuleKeys().length);
    expect(evaluation.pendingRuleKeys.length).toBeGreaterThan(0);
  });
});
