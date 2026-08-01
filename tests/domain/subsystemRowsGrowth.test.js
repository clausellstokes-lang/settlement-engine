/**
 * subsystemRowsGrowth.test.js — the three LIFECYCLE-AND-GROWTH certification rows
 * (institution lifecycle, emergent pressure conditions, upswing arcs).
 *
 * A certification row is a CLAIM ABOUT SOURCE: "this module emits these literals, writes
 * these containers, and deliberately declares nothing else". Each of these three rows
 * carries at least one claim that would be comfortable to fake, so each is re-derived
 * here from live source rather than taken on the row's word:
 *
 *   1. SHAPE    the three rules are authored, not pending, and conform to the registry
 *               contract.
 *   2. TRACE    every declared channel is RE-DERIVED from the module that emits it, every
 *               deliberately EMPTY channel is justified by deriving what the module
 *               actually produces, and every mover-family claim is run through the
 *               PRODUCTION classifier rather than transcribed from it.
 *   3. VERDICT  each row reaches the verdicts it can reach, against receipts that differ
 *               in exactly one field.
 *
 * MEASURED NUMBERS in the row prose come from artifacts/soak (gitignored, so no test may
 * read it). Where a measurement matters to a verdict, the fixtures below reproduce its
 * SHAPE and name the case it came from.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
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
import { GROWTH_PENDING_RULE_KEYS } from '../../src/domain/certification/subsystemRowsGrowth.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { mustExtract } from '../helpers/sourceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const GROWTH_RULES = Object.freeze([
  'institutionLifecycleEnabled',
  'emergentEventsEnabled',
  'upswingArcsEnabled',
]);

const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const sorted = (list) => [...list].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

/** Every `candidateType: '<literal>'` a module emits. Fail-closed by comparison: a regex
 *  that stopped matching yields a SMALLER set and reds the equality it feeds. */
function quotedCandidateTypes(rel) {
  const src = read(rel);
  expect(src.length, `${rel} read empty`).toBeGreaterThan(0);
  return sorted(new Set([...src.matchAll(/candidateType:\s*'([a-z0-9_]+)'/g)].map((m) => m[1])));
}

// ── Receipt fixtures (the evaluator's input shape) ────────────────────────────
/** Every boolean switch lit, so a fixture only has to name what it turns OFF. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

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

/** A v5 receipt: it records its own configuration and a TOTAL worldState census. */
function receiptV5({ rules = litRules(), years = [], stateKeys = {} } = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'fixture-growth-2y-12s',
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
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', settlementIds: [], yearly: years },
  };
}

const ledger = (years, maxEntries) => ({ years, maxEntries, finalEntries: maxEntries });
const evalRowOf = (evaluation, rule) => evaluation.rows.find((row) => row.rule === rule);
const verdictOf = (evaluation, rule) => evalRowOf(evaluation, rule).verdict;

describe('lifecycle-and-growth certification rows — shape', () => {
  test('all three rules are authored in the registry and none is still pending', () => {
    const pending = new Set(SUBSYSTEM_CERTIFICATION_PENDING_KEYS);
    for (const rule of GROWTH_RULES) {
      const row = rowOf(rule);
      expect(row, `${rule} has no authored certification row`).toBeTruthy();
      expect(pending.has(rule), `${rule} is claimed BOTH authored and pending`).toBe(false);
      expect(SUBSYSTEM_TEMPOS).toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE).toContain(row.soakEvidence);
      expect(row.invariants.length, `${rule} declares no invariant`).toBeGreaterThan(0);
      for (const invariant of row.invariants) {
        expect(invariant.name.length).toBeGreaterThan(0);
        expect(invariant.check.length, `${rule}/${invariant.name} has no receipt-expressible check`)
          .toBeGreaterThan(20);
      }
      // The row's provenance prose is the next reader's entry point; an empty one turns a
      // deliberate silence into an unexplained one.
      expect(row.aliveness.other.length, `${rule} explains nothing in aliveness.other`)
        .toBeGreaterThan(200);
      // A row must declare a channel that can actually carry ALIVE, or admit it observes
      // nothing. All three of these declare one, so none may hide behind 'unobserved'.
      const channels = row.aliveness.eventTypes.length + row.aliveness.stateKeys.length;
      expect(channels, `${rule} declares no dispositive channel`).toBeGreaterThan(0);
      expect(row.soakEvidence, `${rule} has a dispositive channel, so 'unobserved' would suppress a real SILENT`)
        .not.toBe('unobserved');
    }
  });

  test('the lane authored every key it claimed, so its own pending list is empty', () => {
    // SHRINK-ONLY in the strongest form: this lane was born with no gap. A future key
    // added here would be a deliberate, visible burn-down entry.
    expect(GROWTH_PENDING_RULE_KEYS).toEqual([]);
  });
});

describe('lifecycle-and-growth certification rows — trace to live source', () => {
  test('institution lifecycle: the three declared literals are the union the two modules emit', () => {
    const economyTypes = quotedCandidateTypes('src/domain/worldPulse/institutionLifecycle.js');
    const moralTypes = quotedCandidateTypes('src/domain/worldPulse/moralInstitutionPressure.js');
    expect(economyTypes).toEqual(['institution_build', 'institution_closure']);
    expect(moralTypes).toEqual(['institution_closure', 'institution_founding']);
    expect(sorted(rowOf('institutionLifecycleEnabled').aliveness.eventTypes))
      .toEqual(sorted(new Set([...economyTypes, ...moralTypes])));
  });

  test('institution lifecycle: all four emission sites sit behind the same one-line gate', () => {
    const gate = 'if (!rules.institutionLifecycleEnabled) return { worldState, candidates: [] };';
    mustExtract(read('src/domain/worldPulse/institutionLifecycle.js'), gate, 'the economy-lane gate');
    const moral = read('src/domain/worldPulse/moralInstitutionPressure.js');
    // TWO gated evaluators live in this file (abolition and founding); a third that
    // forgot its gate would drop this count and red here.
    expect([...moral.matchAll(/if \(!rules\.institutionLifecycleEnabled\) return/g)].length)
      .toBe(2);
  });

  test('institution lifecycle: the founding and abolition arms are FAITH gated, which is why founding measured zero', () => {
    const moral = read('src/domain/worldPulse/moralInstitutionPressure.js');
    // The abolition arm needs a local patron OR a reaching foreign faith.
    mustExtract(moral, 'if (!patron && !reaching.length) continue;', 'the abolition faith gate');
    // The founding arm needs a LOCAL patron, full stop.
    mustExtract(moral, 'if (!patron) continue;', 'the founding faith gate');
    // And the tolerance ledger is faith-derived too: its baseline IS the patron conviction.
    mustExtract(read('src/domain/worldPulse/institutionTolerance.js'), 'export function patronConviction(patron)', 'the tolerance baseline');
  });

  test('institution lifecycle: the declared state key is the one the kernel writes and deletes', () => {
    const kernel = read('src/domain/worldPulse/pulseKernel.js');
    mustExtract(kernel, 'if (simulationRules.institutionLifecycleEnabled || memoryState.institutionTolerance !== undefined) {', 'the tolerance gate');
    mustExtract(kernel, 'memoryState = { ...memoryState, institutionTolerance: tolerance.institutionToleranceByCid };', 'the tolerance write');
    mustExtract(kernel, 'delete rest.institutionTolerance;', 'the drop-when-nothing-drifts branch');
    expect(rowOf('institutionLifecycleEnabled').aliveness.stateKeys).toEqual(['institutionTolerance']);
  });

  test('emergent events: the six declared literals ARE the archetype map, and two producer kinds cannot reach it', () => {
    const src = read('src/domain/worldPulse/candidateEvents.js');
    mustExtract(src, 'if (rules.emergentEventsEnabled) {', 'the one gate seam');
    mustExtract(src, 'if (!pressure || pressure.score < 0.5) return null;', 'the shared severity floor');
    // The composition itself: a renamed template reds here rather than leaving the
    // derived set below correct-looking.
    mustExtract(src, 'candidateType: `${pressure.kind}_pressure`', 'the candidate-type composition');
    mustExtract(src, 'if (!archetype) return null;', 'the unmapped-kind rejection');
    const block = mustExtract(src, /const archetypeByKind = \{[\s\S]*?\};/, 'the archetype map');
    const mapped = sorted(new Set([...block.matchAll(/^\s+([a-z]+):/gm)].map((m) => m[1])));
    expect(mapped).toEqual(['conflict', 'crime', 'disease', 'food', 'legitimacy', 'trade']);
    expect(sorted(rowOf('emergentEventsEnabled').aliveness.eventTypes))
      .toEqual(sorted(mapped.map((kind) => `${kind}_pressure`)));

    // The producer pushes EIGHT kinds; economy and defense have no archetype, so a row
    // that declared them would plant two channels that can never fire.
    const produced = sorted(new Set([...read('src/domain/worldPulse/pressureModel.js')
      .matchAll(/kind: '([a-z]+)', label: '/g)].map((m) => m[1])));
    expect(produced).toEqual(['conflict', 'crime', 'defense', 'disease', 'economy', 'food', 'legitimacy', 'trade']);
    expect(produced.filter((kind) => !mapped.includes(kind))).toEqual(['defense', 'economy']);
  });

  test('emergent events: the lane writes no worldState container, which is why stateKeys is empty', () => {
    const src = read('src/domain/worldPulse/candidateEvents.js');
    // A condition rides ON the candidate and is planted through the ordinary apply path.
    mustExtract(src, 'condition: {', 'the condition payload');
    expect([...src.matchAll(/setSpatialLedger\(/g)].length, 'the lane wrote a spatial ledger').toBe(0);
    expect(rowOf('emergentEventsEnabled').aliveness.stateKeys).toEqual([]);
  });

  test('upswing arcs: the mover emits NO candidate at all, which is why eventTypes is empty', () => {
    // This is the whole justification for the empty channel. If the kernel ever gains a
    // candidate literal, this equality reds and the row must claim it.
    expect(quotedCandidateTypes('src/domain/worldPulse/upswingKernel.js')).toEqual([]);
    const src = read('src/domain/worldPulse/upswingKernel.js');
    expect([...src.matchAll(/candidateType/g)].length, 'the mover gained a candidate seam').toBe(0);
    mustExtract(src, 'if (!upswingArcsActive(worldState)) {', 'the dormancy gate');
    mustExtract(src, '.upswingArcsEnabled === true', 'the fail-closed flag read');
  });

  test('upswing arcs: the declared ledger is the one the mover exclusively owns, and obligations is not it', () => {
    const src = read('src/domain/worldPulse/upswingKernel.js');
    mustExtract(src, "setSpatialLedger(nextWorldState, 'upswing', nextUpswing)", 'the arc persist');
    mustExtract(src, "dropSpatialLedger(nextWorldState, 'upswing')", 'the drop-when-empty branch');
    expect(rowOf('upswingArcsEnabled').aliveness.stateKeys).toEqual(['spatialLedgers.upswing']);
    // The obligations ledger is written HERE and elsewhere, so it can witness no single
    // subsystem. The generosity row refuses it for the same reason.
    mustExtract(src, "setSpatialLedger(nextWorldState, 'obligations', nextObl)", 'this mover writing obligations');
    mustExtract(read('src/domain/worldPulse/obligationDecay.js'), "setSpatialLedger(worldState, 'obligations', next)", 'a second writer of obligations');
  });

  test('upswing arcs: all four news receipts carry an id, so they survive normalization', () => {
    // The momentum and supply-web movers author id-less receipts that the feed drops.
    // This lane does not, which is the whole basis of its mover-family disclosure.
    const src = read('src/domain/worldPulse/upswingKernel.js');
    for (const beat of ['reconstruction', 'boom', 'bust', 'flourishing']) {
      mustExtract(src, `id: \`wizard_news.\${tick}.${beat}.`, `the ${beat} receipt id`);
      mustExtract(src, `impactKind: '${beat}'`, `the ${beat} impact kind`);
    }
    mustExtract(read('src/domain/region/wizardNews.js'), 'normalizeEntry', 'the entry normalizer');
  });

  test('the production classifier puts each vocabulary where the rows say it goes', () => {
    // Executed against scripts/audit/behavioral-observation.mjs itself, so this is the
    // live rule rather than a transcription of it. Every record below is the shape its
    // module actually emits.
    const institution = (candidateType, ruleId) => moverFamilyOf({
      id: `candidate.institution.x.a.y.156`, type: 'institution', candidateType, ruleId, ruleFamily: 'institution_lifecycle',
    });
    expect(institution('institution_build', 'institution_build_supply')).toBe('place');
    expect(institution('institution_closure', 'institution_closure')).toBe('place');
    expect(institution('institution_founding', 'institution_moral_founding_benevolent')).toBe('place');
    // Which is why the institution row claims NO family: `place` is the seven-lane bucket.
    expect(rowOf('institutionLifecycleEnabled').aliveness.moverFamilies).toEqual([]);

    for (const kind of ['food', 'disease', 'conflict', 'trade', 'legitimacy', 'crime']) {
      expect(moverFamilyOf({
        id: `candidate.condition.${kind}.a.156`, type: 'condition',
        candidateType: `${kind}_pressure`, ruleId: `organic_settlement_${kind}_pressure`, ruleFamily: 'organic_drift',
      }), kind).toBe('pressure');
    }
    expect(rowOf('emergentEventsEnabled').aliveness.moverFamilies).toEqual(['pressure']);

    // The upswing beats SPLIT across two families, because the classifier matches the
    // economy tokens `boom` and `bust` before it ever reaches the constructive list.
    const beat = (impactKind) => moverFamilyOf({ id: `wizard_news.156.${impactKind}.a`, kind: 'applied', impactKind });
    expect(beat('reconstruction')).toBe('constructive');
    expect(beat('flourishing')).toBe('constructive');
    expect(beat('boom')).toBe('economy');
    expect(beat('bust')).toBe('economy');
    expect(sorted(rowOf('upswingArcsEnabled').aliveness.moverFamilies)).toEqual(['constructive', 'economy']);
  });
});

describe('lifecycle-and-growth certification rows — verdicts', () => {
  test('institution lifecycle is ALIVE on its own vocabulary and SILENT without it', () => {
    // The SHAPE measured on release-30y-12s-seed2: builds and closures in most years.
    const alive = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { institution_closure: 4 } }),
        year(2, { eventTypeCounts: { institution_build: 1 } }),
      ],
      stateKeys: { institutionTolerance: ledger(2, 12) },
    }));
    const row = evalRowOf(alive, 'institutionLifecycleEnabled');
    expect(row.verdict).toBe('ALIVE');
    expect(row.evidence.eventTypes.total).toBe(5);
    expect(sorted(row.firedChannels)).toEqual(['eventTypes', 'stateKeys']);
    expect(row.partiallySilent).toBe(false);
    expect(row.tempo.meetsExpectedTempo).toBe(true);
    // CONTROL: the identical receipt with those two years emptied of institution events
    // and the tolerance ledger absent from a census that is still TOTAL.
    const silent = evaluateSubsystemCertification(receiptV5({ years: [year(1), year(2)] }));
    expect(verdictOf(silent, 'institutionLifecycleEnabled')).toBe('SILENT');
  });

  test('institution lifecycle names the faith-gated half rather than averaging it away', () => {
    // The measured corpus shape: the economy lane fires while the deity-free fixture
    // leaves the tolerance ledger unwritten. The row is honestly ALIVE and the zero lane
    // is the finding, so the evaluator must name it instead of burying it.
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { institution_closure: 6 } }),
        year(2, { eventTypeCounts: { institution_closure: 3, institution_build: 2 } }),
      ],
      stateKeys: { pulseHistory: ledger(2, 2) },
    }));
    const row = evalRowOf(evaluation, 'institutionLifecycleEnabled');
    expect(row.verdict).toBe('ALIVE');
    expect(row.partiallySilent).toBe(true);
    expect(row.firedChannels).toEqual(['eventTypes']);
    expect(row.silentChannels).toEqual(['stateKeys']);
    expect(row.evidence.stateKeys.total).toBe(0);
  });

  test('emergent conditions are ALIVE on any one kind, and a roaring pressure family cannot lift them', () => {
    const alive = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { crime_pressure: 8, food_pressure: 2 }, moverCounts: { pressure: 40 } }),
        year(2, { eventTypeCounts: { conflict_pressure: 5 }, moverCounts: { pressure: 51 } }),
      ],
    }));
    const row = evalRowOf(alive, 'emergentEventsEnabled');
    expect(row.verdict).toBe('ALIVE');
    expect(row.evidence.eventTypes.total).toBe(15);
    // disease_pressure measured zero across the whole completed corpus; a sibling kind
    // firing is what proves the seam ran, exactly as the third invariant says.
    expect(row.evidence.eventTypes.counts.disease_pressure).toBe(0);
    expect(row.tempo.meetsExpectedTempo).toBe(true);

    // CONTROL: the same pressure family, roaring, with none of the six literals. The
    // stressor lane feeds that family too, so it may not carry this row.
    const silent = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { stressor_birth_famine: 9 }, moverCounts: { pressure: 40 } }),
        year(2, { eventTypeCounts: { stressor_escalate_famine: 4 }, moverCounts: { pressure: 51 } }),
      ],
    }));
    const quiet = evalRowOf(silent, 'emergentEventsEnabled');
    expect(quiet.verdict).toBe('SILENT');
    // And the reader is TOLD why the row looks busy and graded silent.
    expect(quiet.corroboratingOnlyEvidence).toBe(true);
    expect(quiet.firedChannels).toEqual(['moverFamilies']);
  });

  test('upswing arcs are ALIVE on the census ledger and SILENT against a total census without it', () => {
    const alive = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      // maxEntries counts ARC KINDS, not settlements: the census walks one level into
      // spatialLedgers, so the three sub-maps are the ceiling.
      stateKeys: { 'spatialLedgers.upswing': ledger(2, 3) },
    }));
    const row = evalRowOf(alive, 'upswingArcsEnabled');
    expect(row.verdict).toBe('ALIVE');
    expect(row.firedChannels).toEqual(['stateKeys']);
    expect(row.tempo.meetsExpectedTempo).toBe(true);

    // CONTROL: a census that is TOTAL and simply never carries the ledger. The absence
    // is the finding, and it must not hide behind an instrument gap.
    const silent = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      stateKeys: { 'spatialLedgers.obligations': ledger(2, 5) },
    }));
    expect(verdictOf(silent, 'upswingArcsEnabled')).toBe('SILENT');
  });

  test('a post-apply constructive family cannot carry the upswing row, however loud it gets', () => {
    // 4,361 constructive movers is the measured 100-year figure, and it is shared with
    // the generosity lane. Corroboration is not evidence here.
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { moverCounts: { constructive: 2100, economy: 500 } }),
        year(2, { moverCounts: { constructive: 2261, economy: 571 } }),
      ],
      stateKeys: { 'spatialLedgers.generosityWillingness': ledger(2, 7) },
    }));
    const row = evalRowOf(evaluation, 'upswingArcsEnabled');
    expect(row.verdict).toBe('SILENT');
    expect(row.corroboratingOnlyEvidence).toBe(true);
    expect(row.evidence.moverFamilies.total).toBe(5432);
  });

  test('against the v4 corpus the upswing row grades SILENT with its census gap named, never a pass', () => {
    // The shape of every completed release case: no subsystems section at all, event
    // channels intact, and a large post-apply constructive family.
    const v4 = {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      caseId: 'fixture-30y-12s',
      years: 2,
      settlements: 12,
      behavioral: {
        schemaVersion: 4,
        yearly: [
          year(1, { eventTypeCounts: { institution_closure: 3, food_pressure: 4 }, moverCounts: { constructive: 600, economy: 8 } }),
          year(2, { moverCounts: { constructive: 616, economy: 5 } }),
        ],
      },
    };
    const evaluation = evaluateSubsystemCertification(v4);
    expect(evaluation.configSource).toBe('harness_default');
    // The event channels survive the v4 envelope, so two of the three still grade ALIVE.
    expect(verdictOf(evaluation, 'institutionLifecycleEnabled')).toBe('ALIVE');
    expect(verdictOf(evaluation, 'emergentEventsEnabled')).toBe('ALIVE');
    // The third cannot: its dispositive channel is the v5 census this envelope lacks, and
    // its families are corroborating only. The contract errs toward alarm, so the verdict
    // is SILENT with the gap listed rather than a comfortable UNOBSERVED.
    const upswing = evalRowOf(evaluation, 'upswingArcsEnabled');
    expect(upswing.verdict).toBe('SILENT');
    expect(upswing.corroboratingOnlyEvidence).toBe(true);
    expect(upswing.unobservedChannels).toEqual(['stateKeys']);
    expect(upswing.instrumentedChannels).toEqual(['moverFamilies']);
  });

  test('a receipt carrying NEITHER channel grades the upswing row UNOBSERVED, which is the honest instrument gap', () => {
    // A year shape with no moverCounts field at all: nothing about this subsystem is
    // derivable, so no silence may be claimed either.
    const bare = {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      caseId: 'fixture-bare-2y',
      years: 2,
      settlements: 12,
      behavioral: {
        schemaVersion: 4,
        yearly: [{ year: 1, eventTypeCounts: {} }, { year: 2, eventTypeCounts: {} }],
      },
    };
    const upswing = evalRowOf(evaluateSubsystemCertification(bare), 'upswingArcsEnabled');
    expect(upswing.verdict).toBe('UNOBSERVED');
    expect(upswing.instrumentedChannels).toEqual([]);
    expect(sorted(upswing.unobservedChannels)).toEqual(['moverFamilies', 'stateKeys']);
  });

  test('all three grade DORMANT_BY_CONFIG when their own switch is dark', () => {
    const dark = evaluateSubsystemCertification(receiptV5({
      rules: litRules({
        institutionLifecycleEnabled: false,
        emergentEventsEnabled: false,
        upswingArcsEnabled: false,
      }),
      // Loud years, so the verdict is the CONFIG reading and not a quiet fixture.
      years: [
        year(1, { eventTypeCounts: { institution_closure: 4, crime_pressure: 9 }, moverCounts: { pressure: 40, constructive: 88 } }),
        year(2, { eventTypeCounts: { institution_build: 2, food_pressure: 3 }, moverCounts: { pressure: 51, constructive: 91 } }),
      ],
      stateKeys: { 'spatialLedgers.upswing': ledger(2, 3), institutionTolerance: ledger(2, 12) },
    }));
    for (const rule of GROWTH_RULES) {
      expect(verdictOf(dark, rule), rule).toBe('DORMANT_BY_CONFIG');
    }
    // CONTROL: the identical receipt with the three switches lit grades all three ALIVE,
    // so the DORMANT above is a configuration reading and not a fixture that says nothing.
    const lit = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { eventTypeCounts: { institution_closure: 4, crime_pressure: 9 }, moverCounts: { pressure: 40, constructive: 88 } }),
        year(2, { eventTypeCounts: { institution_build: 2, food_pressure: 3 }, moverCounts: { pressure: 51, constructive: 91 } }),
      ],
      stateKeys: { 'spatialLedgers.upswing': ledger(2, 3), institutionTolerance: ledger(2, 12) },
    }));
    for (const rule of GROWTH_RULES) {
      expect(verdictOf(lit, rule), rule).toBe('ALIVE');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// WAVE P1 — THE DEMOGRAPHIC ENGINE ROW. It is the lane's fourth row and the only one
// with NO aliveness channel at all, so it is held to a different, stricter contract:
// the emptiness must be a traced property of the slice rather than an author's
// shrug, and the row must never be able to grade itself ALIVE.
// ═══════════════════════════════════════════════════════════════════════════════
describe('the demographic engine row — the deliberate empty-channel case', () => {
  const DEMO = 'demographicsEnabled';

  test('the key is a REAL rule key, authored, not pending, and reachable by the census', () => {
    expect(simulationRuleKeys()).toContain(DEMO);
    expect(rowOf(DEMO), 'the demographic engine has no certification row').toBeTruthy();
    expect(new Set(SUBSYSTEM_CERTIFICATION_PENDING_KEYS).has(DEMO)).toBe(false);
    expect(GROWTH_PENDING_RULE_KEYS).toEqual([]);
  });

  test('it is VIRTUAL: declared only in the preset spread, never in the serialized defaults', async () => {
    const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } =
      await import('../../src/domain/worldPulse/simulationRules.js');
    // A DEFAULT entry would serialize new bytes into every legacy save and enlist the
    // key in RULE_COMPARISON_KEYS, collapsing preset identity (the disastersEnabled
    // precedent). Declared-false in full_simulation is what the walker censuses.
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, DEMO)).toBe(false);
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules[DEMO]).toBe(false);
  });

  test('the empty channels are TRACED to source, not asserted', () => {
    const row = rowOf(DEMO);
    // eventTypes: the kernel mints no candidate at all, so eventTypeCounts can never
    // see it. Re-derived from live source rather than taken on the row's word.
    expect(quotedCandidateTypes('src/domain/worldPulse/demographicsKernel.js')).toEqual([]);
    expect(quotedCandidateTypes('src/domain/worldPulse/demographicsRates.js')).toEqual([]);
    expect(row.aliveness.eventTypes).toEqual([]);
    // stateKeys: P1 writes no worldState container. The two ledger setters the pulse
    // uses appear nowhere in either module.
    for (const rel of [
      'src/domain/worldPulse/demographicsKernel.js',
      'src/domain/worldPulse/demographicsRates.js',
    ]) {
      const src = read(rel);
      expect(src.length, `${rel} read empty`).toBeGreaterThan(0);
      expect(src.includes('setSpatialLedger'), `${rel} writes a spatial ledger`).toBe(false);
      expect(src.includes('worldState.demographics'), `${rel} writes a worldState key`).toBe(false);
    }
    // THE CHANNEL IS EARNED BUT NOT YET DECLARED, and the difference matters. P3 wrote
    // a plan ledger that satisfies every condition a dispositive channel must satisfy —
    // exactly one writer, gated on THIS flag, a name no other module in the tree spells
    // (precisely the test spatialLedgers.migration fails, which is why the homeostat's
    // own ledger is not claimed either). What it does NOT yet have is a READER: no
    // receipt in existence carries a stateKeys census, so declaring it converted a real
    // SILENT into an instrument gap and the corpus guard refused it. The traces below
    // stay, because they are the standing evidence that will justify the claim the day
    // P4 wires the v5 census. A channel is declarable when something can read it, not
    // when something can write it.
    expect(row.aliveness.stateKeys).toEqual([]);
    const plansSrc = read('src/domain/worldPulse/demographicsPlans.js');
    expect(plansSrc.includes('if (!demographicsActive(worldState)) return inert;'),
      'the plan writer does not gate on the wave flag').toBe(true);
    expect((plansSrc.match(/setSpatialLedger\(/g) || []).length,
      'the plan writer has more than one ledger write site').toBe(1);
    // ONE WRITER, source-scanned across the whole domain rather than asserted. The
    // ledger's name is a constant in its own leaf, so both spellings are hunted.
    const writers = [];
    const walk = (dir) => {
      for (const entry of readdirSync(join(ROOT, dir))) {
        const rel = `${dir}/${entry}`;
        if (statSync(join(ROOT, rel)).isDirectory()) { walk(rel); continue; }
        if (!/\.js$/.test(entry)) continue;
        const src = read(rel);
        if (/setSpatialLedger\(\s*[^,]+,\s*(DEMOGRAPHIC_PLANS_LEDGER|'demographicPlans')/.test(src)) writers.push(rel);
      }
    };
    walk('src/domain');
    expect(writers, `more than one writer for the plan ledger: ${writers.join(', ')}`)
      .toEqual(['src/domain/worldPulse/demographicsPlans.js']);
    // moverFamilies: the refusal that matters. `population` is fed by the very lane
    // this row replaces, so claiming it would let the row grade ALIVE off the runaway.
    expect(row.aliveness.moverFamilies).toEqual([]);
    // Run through the PRODUCTION classifier rather than transcribed from it: the family
    // this row refused to claim is demonstrably the one the replaced lane feeds.
    expect(moverFamilyOf({ candidateType: 'population_growth', ruleFamily: 'population' })).toBe('population');
    // And the kernel's own receipt classifies into NO family, so a future census that
    // starts collecting it cannot silently inflate somebody else's aliveness channel
    // (the wizard-news id-token skew, avoided by construction rather than by luck).
    expect(moverFamilyOf({ kind: 'demographic_step', id: 'demographics.Ashford.12' })).toBe(null);
    // And the row says why, at length.
    expect(row.aliveness.other.length).toBeGreaterThan(200);
    expect(row.soakEvidence).toBe('unobserved');
    expect(row.invariants.length).toBeGreaterThan(0);
  });

  test('it grades DORMANT_BY_CONFIG dark and UNOBSERVED lit, and can never reach ALIVE', () => {
    const loudYears = [
      year(1, { eventTypeCounts: { population_growth: 40, population_decline: 12 }, moverCounts: { population: 900 } }),
      year(2, { eventTypeCounts: { population_growth: 61, population_decline: 9 }, moverCounts: { population: 1200 } }),
    ];
    const dark = evaluateSubsystemCertification(receiptV5({
      rules: litRules({ [DEMO]: false }), years: loudYears,
    }));
    expect(verdictOf(dark, DEMO)).toBe('DORMANT_BY_CONFIG');

    // THE ANTI-VACUITY CHECK, executed: the same deafening population traffic with the
    // switch LIT must NOT be read as this subsystem being alive. If the row ever
    // claimed the population family, this assertion is what would red.
    const lit = evaluateSubsystemCertification(receiptV5({ years: loudYears }));
    expect(verdictOf(lit, DEMO)).toBe('UNOBSERVED');
    // WAVE P3, THEN CORRECTED: P3 declared a dispositive channel (the plan ledger)
    // here, and the corpus guard refused it — no receipt that exists carries a
    // stateKeys census, so declaring the channel converted a real SILENT into an
    // instrument gap. The channel returns in P4 alongside the v5 census wiring that
    // can actually read it. Until then the row declares NO channel, which is the
    // honest state and is what makes the claim below load-bearing: with nothing
    // declared, no amount of population traffic from the lane this wave replaced can
    // carry this row to ALIVE.
    expect(evalRowOf(lit, DEMO).instrumentedChannels).toEqual([]);
    expect(evalRowOf(lit, DEMO).corroboratingOnlyEvidence).toBe(false);

    // CONTROL: the evaluator is not simply refusing to grade this receipt. A sibling
    // row on the same envelope reaches ALIVE, so UNOBSERVED above is a statement about
    // this row's instrument and not about the fixture.
    const sibling = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { eventTypeCounts: { food_pressure: 7 } })],
    }));
    expect(verdictOf(sibling, 'emergentEventsEnabled')).toBe('ALIVE');
  });

  test('the invariant that IS receipt-expressible names the suppression, not a presence', () => {
    const row = rowOf(DEMO);
    const replacement = row.invariants.find((x) => x.name === 'the_raw_growth_line_is_replaced_not_supplemented');
    expect(replacement, 'the one settleable invariant is missing').toBeTruthy();
    expect(replacement.check).toContain('population_growth');
    expect(replacement.check).toContain('exactly zero');
    // And the source honours it: the suppression is a single flag-gated early return.
    mustExtract(
      read('src/domain/worldPulse/populationDynamics.js'),
      'if (delta > 0 && rules.demographicsEnabled === true) return null;',
      'the raw-growth suppression',
    );
  });
});
