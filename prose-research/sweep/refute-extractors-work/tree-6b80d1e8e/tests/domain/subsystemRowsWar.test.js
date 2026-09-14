/**
 * subsystemRowsWar.test.js — the seventeen WAR-STACK certification rows.
 *
 * A certification row is a CLAIM ABOUT SOURCE: "this module emits these literals,
 * writes these containers, and owns nothing else". An unchecked row rots into
 * fiction the first time a module is renamed, and a fictional row grades
 * UNOBSERVED forever while reading like diligence. So this file does four jobs:
 *
 *   1. SHAPE     the seventeen rules are authored, not deferred, and every row
 *                conforms to the registry contract.
 *   2. TRACE     every DECLARED literal is re-derived from the live source, and
 *                every DELIBERATELY UNDECLARED one is held out with an anchored
 *                negative, so a new emitter or a rename reds here.
 *   3. GAP       the eight rows that own no vocabulary say so through soakEvidence
 *                'unobserved' AND name the observation that would close the gap.
 *   4. VERDICT   each row reaches each verdict it can reach, against receipts that
 *                differ in exactly one field.
 *
 * The naval row's central claim — that the completed soak's own spatial fixture
 * gives the layer no sea to work on — is asserted by BUILDING that fixture and
 * asking the production port reader, never by re-reading a comment.
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
  auditSubsystemCoverage,
  evaluateSubsystemCertification,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import {
  WAR_PENDING_RULE_KEYS,
  WAR_SUBSYSTEM_ROWS,
} from '../../src/domain/certification/subsystemRowsWar.js';
import { navalPortsOf } from '../../src/domain/worldPulse/navalKernel.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { buildWholeWorldSoakSpatialCanon } from '../../scripts/audit/whole-world-soak-spatial-fixture.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');

// THE WAR-LAYER WRITER FAMILY. THE DECOMPOSITION WAVE (R-BLD-4) split warDeployment.js
// into a head plus five pure leaves. Several pins below assert "the war layer's source
// still contains X" — and a pin anchored on ONE FILENAME breaks on a pure relocation and
// then, once repointed, guards only whatever happens to remain in that file. The cure is
// the recorded one: read the whole MODULE SET, assert the set is non-empty and every
// member exists, so a symbol moving BETWEEN leaves cannot break the pin and cannot
// silently vacate it either. A member deleted or renamed reds here immediately.
const WAR_LAYER_FAMILY = Object.freeze([
  'src/domain/worldPulse/warDeployment.js',       // the head — the writer/entry
  'src/domain/worldPulse/warCapacityReads.js',    // pure snapshot reads
  'src/domain/worldPulse/warSiegeVerdict.js',     // the siege contest
  'src/domain/worldPulse/warHomeCosts.js',        // what the war costs the home
  'src/domain/worldPulse/warCoalitionRefusal.js', // WR-6 refusal aftermath
  'src/domain/worldPulse/warArmyRecord.js',       // the army record + the sack core
]);
/** The family's concatenated source. Non-empty per member, or this throws. */
function warLayerSource() {
  const parts = WAR_LAYER_FAMILY.map((rel) => {
    const text = sourceOf(rel);
    if (!text || text.length < 200) throw new Error(`war-layer family member is missing or empty: ${rel}`);
    return text;
  });
  return parts.join('\n');
}

const PARENT = 'warLayerEnabled';
/** The seventeen rules this lane authors, in registry order. */
const WAR_RULES = Object.freeze([
  'warLayerEnabled',
  'warEconomyDrainEnabled',
  'warLevyEnabled',
  'warForageEnabled',
  'warSupplyQualityEnabled',
  'defenderAttritionEnabled',
  'defenderResolveEnabled',
  'allyDefenseEnabled',
  'warDispositionEnabled',
  'dispositionChannelsEnabled',
  'allyIntelSharingEnabled',
  'navalEnabled',
  'peaceEngineEnabled',
  'warTerminationEnabled',
  'lineageClaimEnabled',
  'coalitionLedgerEnabled',
  'envoyDiplomacyEnabled',
]);

// The rows the engine really does AND-gate under the war layer (or, for
// warDispositionEnabled, whose only input is written nowhere else). navalEnabled and
// allyIntelSharingEnabled are deliberately NOT here: their gates are the spatial
// marker and the belief layer, and the test below asserts that too.
const NESTED_UNDER_PARENT = Object.freeze([
  'warEconomyDrainEnabled',
  'warLevyEnabled',
  'warForageEnabled',
  'warSupplyQualityEnabled',
  'defenderAttritionEnabled',
  'defenderResolveEnabled',
  'allyDefenseEnabled',
  'warDispositionEnabled',
  'peaceEngineEnabled',
  'warTerminationEnabled',
  'lineageClaimEnabled',
  'coalitionLedgerEnabled',
  'envoyDiplomacyEnabled',
]);

/** The rows that own no vocabulary at all, each with the token its gap note must name. */
const NO_CHANNEL_ROWS = Object.freeze({
  warForageEnabled: 'per-conquest delta census',
  warSupplyQualityEnabled: 'quality multiplier',
  defenderResolveEnabled: 'settlement_capitulated',
  allyDefenseEnabled: 'defenderReliefBonus',
  warDispositionEnabled: 'warSentimentAdj',
  dispositionChannelsEnabled: 'channel-shape census',
  allyIntelSharingEnabled: 'provenance census',
  warTerminationEnabled: 'decidingTerm',
  lineageClaimEnabled: 'five lineage familyId values',
  coalitionLedgerEnabled: 'eligible-call denominator',
  envoyDiplomacyEnabled: 'eligible peace-offer denominator',
});

const rowFor = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);

/** Every boolean switch lit, so a fixture only has to name what it turns OFF. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

/** One synthetic observed year, carrying only the fields the evaluator reads. */
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
function receiptV5({ rules = litRules(), years = [year(1), year(2)], stateKeys = {} } = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'fixture-war-stack',
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

const gradeOf = (rule, receipt) => evaluateSubsystemCertification(receipt).rows
  .find((row) => row.rule === rule);

// The measured vocabulary of a warring year, transcribed from the completed
// 30-year 12-settlement seed1 release case. war_levy is deliberately ABSENT: the
// real receipts carry zero of it, and these fixtures reproduce that shape so the
// SILENT verdict below measures the same thing the soak measured.
const WARRING_YEAR = Object.freeze({
  army_deployed: 7,
  war_drain: 9,
  war_exhaustion: 26,
  war_mobilization: 73,
  conquest: 2,
  occupation_burden: 10,
  war_conscription: 8,
});

describe('war-stack rows — shape and partition', () => {
  test('all seventeen war-stack rules are authored rather than deferred to a pending list', () => {
    // Purely positive, on purpose. A bare "not in the pending list" would need an
    // anchor sibling that is ITSELF still pending, and the pending list shrinks
    // under this file as other lanes land rows. The live coverage audit proves the
    // stronger property directly: the partition over the engine's whole boolean
    // census is exact, and claimedTwice empty means an authored rule cannot also
    // be pending.
    const audit = auditSubsystemCoverage({
      ruleKeys: simulationRuleKeys(),
      registry: SUBSYSTEM_CERTIFICATION_REGISTRY,
      pendingKeys: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
    });
    expect(WAR_RULES).toHaveLength(17);
    expect(WAR_SUBSYSTEM_ROWS.map((row) => row.rule)).toEqual(WAR_RULES);
    // Scoped to THIS lane's seventeen. The composed partition's own totality is the
    // walker's assertion, and this tree is written by parallel sessions, so a
    // sibling lane mid-edit must not red the war lane's proof.
    expect(audit.missing).toEqual([]);
    expect(audit.unknownRows).toEqual([]);
    for (const rule of WAR_RULES) {
      expect(rowFor(rule), `${rule} has no authored row`).toBeTruthy();
      expect(simulationRuleKeys(), `${rule} is not a rule the engine defines`).toContain(rule);
      // anchored: the two assertions just above prove this rule is a live engine key carrying a live authored row, so a drifted registry or census reds there first.
      expect(audit.claimedTwice, `${rule} is authored AND still pending`).not.toContain(rule);
    }
    // The lane's own burn-down list is now empty, which is only meaningful while
    // the composed list still carries other lanes' genuine gaps.
    expect(WAR_PENDING_RULE_KEYS).toEqual([]);
    expect(SUBSYSTEM_CERTIFICATION_PENDING_KEYS.length).toBeGreaterThan(0);
  });

  test('each row conforms to the registry contract', () => {
    for (const rule of WAR_RULES) {
      const row = rowFor(rule);
      expect(SUBSYSTEM_TEMPOS).toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE).toContain(row.soakEvidence);
      expect(row.title.length).toBeGreaterThan(0);
      // The gap note is the row's whole value when the channels are empty, so it
      // must carry a reader's worth of prose rather than a shrug.
      expect(row.aliveness.other.length, `${rule}: thin aliveness.other`).toBeGreaterThan(200);
      expect(row.invariants.length, `${rule}: no invariant`).toBeGreaterThanOrEqual(1);
      for (const invariant of row.invariants) {
        expect(invariant.name.length, `${rule}: unnamed invariant`).toBeGreaterThan(0);
        expect(
          invariant.check.length,
          `${rule}: invariant ${invariant.name} carries no receipt-expressible check`,
        ).toBeGreaterThan(40);
      }
      // Every declared module path is a real, non-empty file the next reader can
      // open to re-check the row against source.
      for (const path of row.module.split(',')) {
        expect(sourceOf(path.trim()).length, `${rule}: ${path}`).toBeGreaterThan(0);
      }
    }
  });

  test('no war-stack row claims a mover family, and the classifier says why', () => {
    for (const rule of WAR_RULES) {
      expect(rowFor(rule).aliveness.moverFamilies, `${rule} claimed a mover family`).toEqual([]);
    }
    // The measured reason, re-derived by RUNNING the production classifier on the
    // real record shapes rather than by re-reading its token lists. Every
    // warConditionOutcome and the conquest outcome carry ruleFamily 'stressor',
    // which is a `pressure` token, and the classifier takes the first match.
    const asEmitted = (candidateType, ruleId) => ({
      id: `world_outcome.${candidateType}.a.5`,
      type: 'condition',
      candidateType,
      ruleId,
      ruleFamily: 'stressor',
    });
    expect(moverFamilyOf({
      id: 'world_outcome.conquest.a.5',
      type: 'power_transfer',
      candidateType: 'conquest',
      ruleId: 'war_layer_conquest',
      ruleFamily: 'stressor',
    })).toBe('pressure');
    for (const type of ['war_drain', 'army_deployed', 'war_exhaustion']) {
      expect(moverFamilyOf(asEmitted(type, `war_layer_${type}`)), type).toBe('pressure');
    }
    expect(moverFamilyOf(asEmitted('war_spoils', 'occupation_war_spoils'))).toBe('pressure');
    // The two that DO land in `war` carry no ruleFamily at all, which is exactly
    // why a family claim over the whole vocabulary would be false.
    for (const type of ['war_conscription', 'war_levy']) {
      expect(moverFamilyOf({ id: `world_outcome.${type}.a.5`, candidateType: type }), type).toBe('war');
    }
    expect(rowFor(PARENT).aliveness.other.length).toBeGreaterThan(0);
  });

  test('the nested rows record their parent gate, and the two exceptions record theirs', () => {
    // The evaluator grades ONE key at a time, so a dark parent does not by itself
    // dormantize a lit child. That is a real limitation, and the cure is that each
    // child row states its own gate in prose the reader will actually see.
    for (const rule of NESTED_UNDER_PARENT) {
      expect(rowFor(rule).aliveness.other, `${rule} does not name its parent gate`)
        .toContain('warLayerEnabled');
    }
    // And the nesting is REAL, not a comment: the two composite gates are AND terms.
    expect(sourceOf('src/domain/worldPulse/warDeployment.js')).toContain('if (!rules?.warLayerEnabled) {');
    expect(sourceOf('src/domain/worldPulse/occupation.js')).toContain('if (!rules?.warLayerEnabled) {');
    expect(sourceOf('src/domain/worldPulse/warReasons.js'))
      .toContain('r.warLayerEnabled === true && r.peaceEngineEnabled === true');
    expect(sourceOf('src/domain/worldPulse/warTermination.js'))
      .toContain('rules.warLayerEnabled !== true || rules.warTerminationEnabled !== true');

    // THE TWO EXCEPTIONS. Neither is gated on the war layer, and a row that claimed
    // otherwise would send the next reader hunting a gate that does not exist.
    expect(sourceOf('src/domain/worldPulse/navalKernel.js'))
      .toContain('if (!armyTransitActive(worldState)) return false;');
    expectAbsentWithAnchor(
      rowFor('navalEnabled').aliveness.other,
      'Nested under warLayerEnabled',
      'spatial-canon marker',
      'the naval row names its real gate rather than an inherited one',
    );
    // CONTENT-ANCHORED, not line-keyed (LANE KR, 2026-08-03). This pin used to quote a
    // hand-keyed kernel line number that had already rotted ~107 lines out of true
    // (the allyIntel block sits at line 1945 today) while staying GREEN, because a
    // doc-text-to-doc-text comparison cannot see the source it names. The
    // anchor is now the kernel's own expression, and the second assertion proves that
    // expression still EXISTS in pulseKernel.js — so a rename reds here instead of
    // rotting silently. Repo-wide enforcement: tests/lint/pulseKernelLineAddress.walker.test.js.
    const ALLY_INTEL_ANCHOR = 'allyIntel: simulationRules.allyIntelSharingEnabled === true';
    expect(rowFor('allyIntelSharingEnabled').aliveness.other).toContain(`pulseKernel.js \`${ALLY_INTEL_ANCHOR}`);
    expect(sourceOf('src/domain/worldPulse/pulseKernel.js')).toContain(ALLY_INTEL_ANCHOR);
  });

  test('the eleven vocabulary-less rows admit the gap and name the observation that closes it', () => {
    for (const [rule, token] of Object.entries(NO_CHANNEL_ROWS)) {
      const row = rowFor(rule);
      expect(row.aliveness.eventTypes, `${rule}`).toEqual([]);
      expect(row.aliveness.moverFamilies, `${rule}`).toEqual([]);
      expect(row.aliveness.stateKeys, `${rule}`).toEqual([]);
      // The contract's escape hatch for a subsystem that emits nothing observable.
      expect(row.soakEvidence, `${rule}`).toBe('unobserved');
      // A gap without a remedy is an excuse; each row names the instrument.
      expect(row.aliveness.other, `${rule}: no TO OBSERVE remedy`).toContain('TO OBSERVE');
      expect(row.aliveness.other, `${rule}: remedy does not name ${token}`).toContain(token);
    }
  });
});

describe('war-stack rows — the source trace behind every declared literal', () => {
  test('every declared war-layer literal is still emitted by a declared module', () => {
    const row = rowFor(PARENT);
    const sources = [
      ...row.module.split(',').map((path) => sourceOf(path.trim())),
      // The war-layer writer family in full: the row's module list names it, but the
      // shared archetypes reach the receipt from whichever leaf now mints them, and a
      // census that could only see one file would red on a pure relocation.
      warLayerSource(),
      // warRecordMode is the shared condition-outcome leaf the declared modules
      // call rather than a war module in its own right, so it is not row provenance
      // but it IS where two of the literals are minted.
      sourceOf('src/domain/worldPulse/warRecordMode.js'),
    ].join('\n');
    expect(row.aliveness.eventTypes.length).toBe(18);
    for (const type of row.aliveness.eventTypes) {
      // Each literal reaches the receipt either as a candidateType directly or as
      // the archetype warConditionOutcome copies into candidateType.
      const emitted = sources.includes(`candidateType: '${type}'`)
        || sources.includes(`archetype: '${type}'`)
        || sources.includes(`candidateType: \`${type}\``)
        // The four mobilization reactions are built from `mobilization_reaction_${move}`.
        || (type.startsWith('mobilization_reaction_')
          && sources.includes('candidateType: `mobilization_reaction_${move}`')
          && sources.includes(`'${type.slice('mobilization_reaction_'.length)}'`));
      expect(emitted, `${type} is declared but no declared module emits it`).toBe(true);
    }
    // war_exhaustion_cleared is minted by the shared record-mode leaf the war layer
    // calls, so its provenance is one hop out and must be checked where it lives.
    expect(sourceOf('src/domain/worldPulse/warRecordMode.js'))
      .toContain("candidateType: 'war_exhaustion_cleared'");
  });

  test('strategy_deploy is a SHARED literal and is correctly held out of the war row', () => {
    // The trap: settlementStrategy's chooser mints the same literal, and it fires
    // an order of magnitude more often than the war layer's own siege initiation.
    expect(sourceOf('src/domain/worldPulse/settlementStrategy.js'))
      .toContain('candidateType: `strategy_${move}`');
    expect(sourceOf('src/domain/worldPulse/warDeployment.js'))
      .toContain("candidateType: 'strategy_deploy'");
    expectAbsentWithAnchor(
      [...rowFor(PARENT).aliveness.eventTypes],
      'strategy_deploy',
      'army_deployed',
      'the war-layer row excludes the shared strategy_deploy literal',
    );
  });

  test('war_pressure is a SHARED archetype and is correctly held out of the war row', () => {
    for (const module of [
      'src/domain/worldPulse/candidateEvents.js',
      'src/domain/worldPulse/tradeWar.js',
    ]) {
      expect(sourceOf(module), `${module} no longer emits war_pressure`).toContain("'war_pressure'");
    }
    // The war layer's own two mints (harassment, and the conquest condition) are read
    // off the FAMILY rather than off warDeployment.js by name, so a later split cannot
    // break this pin or leave it guarding a file the mint has moved out of.
    expect(warLayerSource(), 'the war-layer family no longer emits war_pressure').toContain("'war_pressure'");
    expectAbsentWithAnchor(
      [...rowFor(PARENT).aliveness.eventTypes],
      'war_pressure',
      'war_drain',
      'the war-layer row excludes the shared war_pressure archetype',
    );
  });

  test('the two conserved war-economy literals each have exactly one emitter', () => {
    const warDeployment = warLayerSource();
    expect(warDeployment).toContain("candidateType: 'war_conscription'");
    expect(warDeployment).toContain("candidateType: 'war_levy'");
    expect(rowFor('warEconomyDrainEnabled').aliveness.eventTypes).toEqual(['war_conscription']);
    expect(rowFor('warLevyEnabled').aliveness.eventTypes).toEqual(['war_levy']);
    // The levy's exclusion arithmetic is what the row's silence note points at, so
    // the numbers it quotes must still be the numbers in source.
    expect(warDeployment).toContain('LEVY_POP_RATE_PER_TICK = 0.004');
    expect(warDeployment).toContain('LEVY_POP_FLOOR = 300');
    const levyNote = rowFor('warLevyEnabled').aliveness.other;
    expect(levyNote).toContain('0.004');
    expect(levyNote).toContain('300');
  });

  test('war_spoils belongs to the occupation lane, not to the forage flag', () => {
    // The misreading this row exists to prevent: war_spoils looks like sack
    // evidence, and occupation.js emits it under warLayerEnabled alone.
    expect(sourceOf('src/domain/worldPulse/occupation.js')).toContain("candidateType: 'war_spoils'");
    expect(rowFor(PARENT).aliveness.eventTypes).toContain('war_spoils');
    expect(rowFor('warForageEnabled').aliveness.eventTypes).toEqual([]);
    // And the sack really is delta-only: it rides the conquest outcome's arrays.
    const warDeployment = warLayerSource();
    expect(warDeployment).toContain('export function computeSackTransfer');
    expect(warDeployment).toContain('SACK_POP_FLOOR = 150');
    expect(rowFor('warForageEnabled').invariants.map((i) => i.check).join(' ')).toContain('150');
  });

  test('the defender-attrition container is a real top-level worldState key', () => {
    expect(sourceOf('src/domain/worldPulse/warDeployment.js'))
      .toContain('const defenderSiegeLedger = defenderAttritionEnabled');
    expect(sourceOf('src/domain/worldPulse/pulseKernel.js'))
      .toContain('worldState = { ...worldState, defenderSiegeLedger: war.defenderSiegeLedger };');
    expect(rowFor('defenderAttritionEnabled').aliveness.stateKeys).toEqual(['defenderSiegeLedger']);
  });

  test('the war row owns the resolved-target and arrival-gate consumers without duplicating their ledgers', () => {
    const row = rowFor(PARENT);
    const modules = row.module.split(',').map((part) => part.trim());
    expect(modules).toContain('src/domain/worldPulse/warIntent.js');
    expect(modules).toContain('src/domain/spatial/armyTransit.js');
    const opener = sourceOf('src/domain/worldPulse/warDeployment.js');
    expect(opener).toContain('warIntentFor(worldState, fromId, tick)');
    expect(opener).toContain('siegeArrivalGate(/** @type {{ spatialLedgers?: unknown }} */ (worldState), tick)');
    expect(sourceOf('src/domain/worldPulse/applyWorldPulse.js'))
      .toContain('state = applyWarIntentOutcome(state, outcome, tick ?? 0);');
    const intentJoin = sourceOf('src/domain/worldPulse/warIntent.js');
    expect(intentJoin).toContain("row.candidateType === 'strategy_deploy' && row.ruleFamily === 'stressor'");
    expect(intentJoin).toContain('next = consumeWarIntent(next, row.targetSaveId == null ? null : String(row.targetSaveId), tick);');
    expect(row.aliveness.stateKeys).toEqual(['deployments', 'occupations', 'warExhaustion', 'warPosture']);
  });

  test('the peace engine still writes exactly the three sidecars the row declares', () => {
    const writers = {
      'spatialLedgers.warReasons': 'src/domain/worldPulse/warReasons.js',
      'spatialLedgers.peaceReasons': 'src/domain/worldPulse/peaceReasons.js',
      'spatialLedgers.treaties': 'src/domain/worldPulse/peaceTerms.js',
    };
    expect([...rowFor('peaceEngineEnabled').aliveness.stateKeys].sort())
      .toEqual(Object.keys(writers).sort());
    for (const [censusKey, module] of Object.entries(writers)) {
      const sub = censusKey.slice('spatialLedgers.'.length);
      expect(sourceOf(module), `${censusKey} writer`).toContain(`'${sub}'`);
    }
    // The gate the row describes is still an AND of both halves.
    expect(sourceOf('src/domain/worldPulse/warReasons.js'))
      .toContain("r.warLayerEnabled === true && r.peaceEngineEnabled === true");
  });

  test('the peace row owns treaty enforcement and material transfer without inventing duplicate state', () => {
    const row = rowFor('peaceEngineEnabled');
    const modules = row.module.split(',').map((part) => part.trim());
    expect(modules).toContain('src/domain/worldPulse/treatyEnforcement.js');
    expect(modules).toContain('src/domain/worldPulse/treatyTransfer.js');
    const peaceTerms = sourceOf('src/domain/worldPulse/peaceTerms.js');
    expect(sourceOf('src/domain/worldPulse/warReasons.js'))
      .toContain('treatyBlocksWar(worldState, fromId, toId, at)');
    expect(sourceOf('src/domain/worldPulse/mobilization.js'))
      .toContain('demilitarizationCapFor(worldState, id, tick)');
    expect(sourceOf('src/domain/worldPulse/occupation.js'))
      .toContain('occupationHoldFor(worldState, occupiedId, rec.occupierId, t)');
    expect(peaceTerms).toContain('const draw = computeTreatyGrainDraw({');
    expect(peaceTerms).toContain('const nextUpdates = applyTreatyFoodDeltas(');
    expect(row.aliveness.stateKeys).toEqual([
      'spatialLedgers.peaceReasons',
      'spatialLedgers.treaties',
      'spatialLedgers.warReasons',
    ]);
    expect(row.aliveness.other).toContain('treaty_default is now fed');
  });

  test('the learned-disposition row does not borrow its legacy ledger or wizard-news receipts', () => {
    const row = rowFor('dispositionChannelsEnabled');
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(row.soakEvidence).toBe('unobserved');
    expect(row.expectedTempo).toBe('per_tick');

    // SAME-SCHEMA means the feature extends the established ledger. A top-level
    // dispositionStats count therefore cannot distinguish WR-2 from legacy state.
    const worldState = sourceOf('src/domain/worldPulse/worldState.js');
    expect(worldState).toContain('dispositionStats: simulationRules.dispositionChannelsEnabled === true');
    expect(worldState).toContain('? migrateDispositionStats(deepCloneLedger(raw?.dispositionStats), tick)');
    expect(row.aliveness.other).toContain('SAME-SCHEMA');
    expect(row.aliveness.other).toContain('channel-shape census');

    // The authored impact kinds are presentation receipts, not candidate types.
    // Holding every aliveness channel empty prevents a wizard_news.* id or its
    // impactKind from masquerading as selected behavioral evidence.
    for (const impactKind of [
      'disposition_martial_crossed',
      'disposition_mercantile_crossed',
      'disposition_diplomatic_crossed',
      'disposition_insular_crossed',
      'disposition_reversal',
      'deity_war_pressure',
      'deity_peace_pressure',
      'war_culture_suppressed',
    ]) {
      expect(row.aliveness.other).toContain(impactKind);
    }
  });

  test('the one termination row owns WR-4 and WR-5 receipt evidence without borrowing aliveness', () => {
    const rows = SUBSYSTEM_CERTIFICATION_REGISTRY
      .filter((candidate) => candidate.rule === 'warTerminationEnabled');
    expect(rows).toHaveLength(1);
    const [row] = rows;
    expect(row.title).toBe('War termination and comparative-cost read');
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(row.soakEvidence).toBe('unobserved');
    expect(row.expectedTempo).toBe('per_tick');
    expect(row.module.split(',')).toEqual(expect.arrayContaining([
      'src/domain/certification/couplingRegistry.js',
      'src/domain/certification/couplingRegistryWar.js',
      'src/domain/worldPulse/warCosts.js',
      'src/domain/worldPulse/warCostsNews.js',
      'src/domain/worldPulse/warTermination.js',
      'src/domain/worldPulse/warSeatBooks.js',
      'src/domain/worldPulse/warPeaceDecision.js',
      'src/domain/worldPulse/warPeaceRefusal.js',
      'src/domain/worldPulse/warPoliticalLoop.js',
      'src/domain/worldPulse/warRulingsEvidence.js',
      'src/domain/worldPulse/warRulingsNews.js',
      'src/domain/worldPulse/npcLadderKernel.js',
      'src/domain/worldPulse/eventProse.js',
    ]));

    for (const token of [
      'pulseRecord.warTerminationReads',
      'believedBalanceBand',
      'truthBalanceBand',
      'trajectoryMisread',
      'homeFrontBand',
      'homeFrontComponents',
      'stateRead',
      'roads',
      'stores',
      'hands',
      'institutions',
      'markets',
      'lostSupplierSinceTick',
      'decidingTerm',
      'familyId',
      'NO EXCLUSIVE ALIVENESS CHANNEL',
      'authoritySignature',
      'opponentAuthoritySignature',
      'booksInterest',
      'booksDirection',
      'rulerSecurityBand',
      'rulerLawfulnessBand',
      'rulerMoralityBand',
      'rulerId',
      'opponentRulerId',
      'factionId',
      'patronId',
      'rivalTriumphBand',
      'momentumBroken',
      'authorityChangeKind',
      'authorityVerdictId',
      'authorityDissolvedCauseTypes',
      'opponentAuthorityDissolvedCauseTypes',
      'opponentBelievedBalanceBand',
      'opponentTruthBalanceBand',
      'pulseRecord.warAuthorityVerdicts',
      'rosterId',
      'exposureKind',
      'actualAction',
      'interestServed',
      'inheritedDemand',
      'seatTransitions',
      'two yeses',
      'one refusal',
    ]) {
      expect(row.aliveness.other, `missing WR-4/WR-5 evidence token ${token}`).toContain(token);
    }
    for (const kind of [
      'war_trajectory_winning',
      'war_trajectory_losing',
      'home_front_roads',
      'home_front_stores',
      'home_front_hands',
      'home_front_institutions',
      'home_front_markets',
      'winning_abroad_losing_at_home',
      'trajectory_misread',
    ]) {
      expect(row.aliveness.other).toContain(kind);
    }
    for (const kind of [
      'sued_for_peace_seat',
      'sued_for_peace_realm',
      'war_continued_for_the_seat',
      'war_ended_against_rival_triumph',
      'peace_refused',
      'refusal_cost_legitimacy',
      'refusal_cost_ally_patience',
      'ruler_books_compromised',
      'war_party_overturns_peacemaker',
      'peace_party_overturns_warmonger',
      'succession_demand_inherited',
      'successor_repudiates_war',
      'successor_escalates_war',
      'war_dissolved_by_verdict',
    ]) {
      expect(row.aliveness.other).toContain(kind);
    }
    expect(row.aliveness.other).toContain('institution degradation is an events receipt');
    expect(row.aliveness.other).not.toContain('institution degradation is an adjudication');
    expect(row.invariants.map((invariant) => invariant.name)).toEqual(expect.arrayContaining([
      'one_read_per_valid_surviving_deployment',
      'termination_receipts_are_not_state',
      'belief_drives_trajectory_truth_only_diagnoses',
      'home_front_reuses_existing_degradation',
      'duration_never_invents_home_front_cost',
      'war_cost_news_is_transition_only',
      'two_books_never_mint_a_fifth_term',
      'bilateral_peace_requires_two_yeses',
      'only_the_current_seat_inherits_a_war_demand',
      'private_patron_books_never_enter_public_prose',
      'seat_transitions_have_one_bounded_writer',
      'verdict_dissolution_cannot_revive_the_exposed_quarrel',
    ]));
  });

  test('the lineage row stays unobserved instead of borrowing shared reason ledgers or reader prose', () => {
    const row = rowFor('lineageClaimEnabled');
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(row.soakEvidence).toBe('unobserved');
    expect(row.expectedTempo).toBe('per_tick');
    expect(row.module.split(',')).toEqual(expect.arrayContaining([
      'src/domain/certification/couplingRegistry.js',
      'src/domain/certification/couplingRegistryWar.js',
      'src/domain/worldPulse/lineageClaim.js',
      'src/domain/worldPulse/warReasons.js',
      'src/domain/worldPulse/peaceReasons.js',
      'src/domain/worldPulse/eventProse.js',
    ]));
    expect(row.aliveness.other).toContain('five lineage familyId values');
    expect(row.aliveness.other).toContain('spatialLedgers.warReasons');
    expect(row.aliveness.other).toContain('spatialLedgers.peaceReasons');
    for (const kind of [
      'lineage_edge_recorded',
      'casus_lineage_claim_parent',
      'casus_lineage_claim_child',
      'mirror_kinship_bond',
      'lineage_claim_suppressed',
    ]) {
      expect(row.aliveness.other).toContain(kind);
    }
  });

  test('the coalition row stays unobserved instead of borrowing deployments, reasons, or reader prose', () => {
    const row = rowFor('coalitionLedgerEnabled');
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(row.soakEvidence).toBe('unobserved');
    expect(row.expectedTempo).toBe('reactive');
    expect(row.module.split(',')).toEqual(expect.arrayContaining([
      'src/domain/certification/couplingRegistry.js',
      'src/domain/certification/couplingRegistryWar.js',
      'src/domain/worldPulse/warCoalitionGraph.js',
      'src/domain/worldPulse/warAllianceRisk.js',
      'src/domain/worldPulse/warCoalitionDecision.js',
      'src/domain/worldPulse/warCoalitionLedger.js',
      'src/domain/worldPulse/warCoalitionExpenditure.js',
      'src/domain/worldPulse/warCoalitionSettlement.js',
      'src/domain/worldPulse/warCoalitionEvidence.js',
      'src/domain/worldPulse/warCoalitionNews.js',
      'src/domain/worldPulse/warCoalitionPulse.js',
      'src/domain/worldPulse/warDeployment.js',
      'src/domain/worldPulse/warPeaceDecision.js',
      'src/domain/worldPulse/peaceTerms.js',
      'src/domain/worldPulse/peaceReasons.js',
      'src/domain/worldPulse/relationshipEvolution.js',
      'src/domain/worldPulse/eventProse.js',
    ]));
    for (const token of [
      'eligible-call denominator',
      'join and refuse totals',
      'stay and exit totals',
      'expenditure cost bands',
      'apportionment, spoils and payment bands',
      'aggregate coalition-settlement outcomes',
      'all twelve exact familyId values',
      'deployments cannot certify this row',
      'spatialLedgers.warReasons',
      'spatialLedgers.peaceReasons',
    ]) {
      expect(row.aliveness.other).toContain(token);
    }
    for (const kind of [
      'coalition_entry_priced',
      'coalition_joined',
      'coalition_refused',
      'casus_alliance_obligation',
      'mirror_obligation_discharged',
      'coalition_expenditure_read',
      'coalition_stayed',
      'coalition_separate_peace',
      'coalition_apportionment',
      'coalition_spoils_divided',
      'coalition_debt_paid',
      'coalition_debt_unpaid',
    ]) {
      expect(row.aliveness.other).toContain(kind);
    }
    expect(row.invariants.map((invariant) => invariant.name)).toEqual(expect.arrayContaining([
      'coalitions_remain_bilateral_graphs',
      'a_call_is_scored_not_automatic',
      'expenditure_is_derived_not_stored',
      'separate_peace_closes_one_edge',
      'aggregate_judgment_pays_pairwise',
      'reader_families_are_not_behavioral_aliveness',
    ]));
  });

  test('the envoy row stays unobserved until WR-9 sees complete lifecycle and story width', () => {
    const row = rowFor('envoyDiplomacyEnabled');
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(row.soakEvidence).toBe('unobserved');
    expect(row.expectedTempo).toBe('reactive');
    expect(row.module.split(',')).toEqual(expect.arrayContaining([
      'src/domain/certification/couplingRegistry.js',
      'src/domain/certification/couplingRegistryWar.js',
      'src/domain/spatial/armyTransit.js',
      'src/domain/worldPulse/applyWorldPulse.js',
      'src/domain/worldPulse/armyTransitKernel.js',
      'src/domain/worldPulse/beliefMap.js',
      'src/domain/worldPulse/brokerageServicesPlant.js',
      'src/domain/worldPulse/candidateEvents.js',
      'src/domain/worldPulse/envoyDiplomacy.js',
      'src/domain/worldPulse/envoyEncounter.js',
      'src/domain/worldPulse/envoyErrand.js',
      'src/domain/worldPulse/envoyNews.js',
      'src/domain/worldPulse/envoyPulse.js',
      'src/domain/worldPulse/eventProse.js',
      'src/domain/worldPulse/foreignGuestHold.js',
      'src/domain/worldPulse/informationStatecraft.js',
      'src/domain/worldPulse/namedPersonTransit.js',
      'src/domain/worldPulse/negotiationPictures.js',
      'src/domain/worldPulse/npcDmVerbs.js',
      'src/domain/worldPulse/peaceTerms.js',
      'src/domain/worldPulse/pulseKernel.js',
      'src/domain/worldPulse/roadsKernel.js',
      'src/domain/worldPulse/worldState.js',
    ]));
    for (const rule of [
      'warLayerEnabled',
      'warTerminationEnabled',
      'peaceEngineEnabled',
      'npcConsequencesEnabled',
      'routeLifecycleEnabled',
    ]) {
      expect(row.aliveness.other).toContain(rule);
    }
    for (const token of [
      'eligible peace-offer denominator',
      'capacity-rejection',
      'outbound-arrival',
      'offer-replay totals',
      'all sixteen exact familyId values',
      'divergent-seed event-type distribution comparisons',
      'envoyErrands presence',
    ]) {
      expect(row.aliveness.other).toContain(token);
    }
    for (const kind of [
      'envoy_departed',
      'envoy_on_the_road',
      'envoy_returning',
      'envoy_home',
      'envoy_lost',
      'envoy_silence_inference',
      'terms_never_reached',
      'envoy_intercepted',
      'envoy_parlaying',
      'envoy_terms_agreed',
      'envoy_held',
      'terms_signed_for_a_fallen_town',
      'parlay_at_an_occupied_venue',
      'interceptor_dilemma',
      'interceptor_parlays_own_edge',
      'parlay_terms_neither_court_drafted',
    ]) {
      expect(row.aliveness.other).toContain(kind);
    }
    expect(row.invariants.map((invariant) => invariant.name)).toEqual(expect.arrayContaining([
      'peace_waits_for_the_returning_person',
      'the_departure_picture_does_not_refresh_itself',
      'one_durable_person_uses_the_lived_route',
      'silence_is_inference_not_hidden_truth',
      'one_pre_mutation_cut_decides_each_encounter',
      'carried_terms_are_not_reappraised_at_home',
      'foreign_holds_keep_one_person_one_place',
      'sixteen_reader_families_are_not_behavioral_width',
    ]));
  });

  test('the naval row declares the sidecar and holds out the news-only literals', () => {
    expect(rowFor('navalEnabled').aliveness.stateKeys).toEqual(['spatialLedgers.navalTransit']);
    const navalKernel = sourceOf('src/domain/worldPulse/navalKernel.js');
    expect(navalKernel).toContain("setSpatialLedger(worldState, 'navalTransit', nextOrNull)");
    // blockade_declared exists in source but never reaches result.selected, so it
    // must stay out of the row's eventTypes.
    expect(navalKernel).toContain("candidateType: 'blockade_declared'");
    expect(rowFor('navalEnabled').aliveness.eventTypes).toEqual([]);
  });

  test('the completed soak fixture really gives the naval layer no sea to work on', () => {
    // The naval row's measured claim, re-derived by BUILDING the soak's own canon
    // and asking the production port reader. If a future fixture gains water, this
    // reds and the row's harness-gap explanation must be rewritten as a silence.
    const saves = Array.from({ length: 12 }, (_, index) => ({
      id: `soak-${index}`,
      settlement: { institutions: [] },
    }));
    const canon = buildWholeWorldSoakSpatialCanon(saves, { enabled: true });
    // Liveness first: the canon really is a canon, so the empty port list below
    // measures the fixture's geography rather than a fixture that failed to build.
    expect(canon.spatialCanonVersion).toBe(1);
    expect(canon.spatialDigest.settlementIds.length).toBe(saves.length);
    expect(canon.spatialDigest.reserved.seaLanes).toBeNull();
    expect(navalPortsOf(canon.spatialDigest)).toEqual([]);
    expect(rowFor('navalEnabled').aliveness.other).toContain('reserved.seaLanes null');
  });
});

describe('war-stack rows — the verdicts, one field apart', () => {
  test('the war layer grades ALIVE off its own vocabulary and DORMANT when dark', () => {
    const alive = gradeOf(PARENT, receiptV5({
      years: [year(1, { eventTypeCounts: WARRING_YEAR, moverCounts: { war: 44 } }), year(2)],
      stateKeys: { deployments: { years: 1, maxEntries: 4, finalEntries: 0 } },
    }));
    expect(alive.verdict).toBe('ALIVE');
    expect(alive.firedChannels).toEqual(['eventTypes', 'stateKeys']);

    // CONTROL: the identical receipt with the switch dark reaches a different
    // verdict, so the aliveness above is caused by the flag and not by the fixture.
    const dark = gradeOf(PARENT, receiptV5({
      rules: litRules({ [PARENT]: false }),
      years: [year(1, { eventTypeCounts: WARRING_YEAR, moverCounts: { war: 44 } }), year(2)],
    }));
    expect(dark.verdict).toBe('DORMANT_BY_CONFIG');
  });

  test('a moving war family alone can never carry the war layer', () => {
    // The family is fed by the trade-war lane, the intervention lane, the mercenary
    // market and the naval kernel, and the layer's OWN outcomes do not even land in
    // it, so traffic there proves the world moved and nothing more.
    const graded = gradeOf(PARENT, receiptV5({
      years: [year(1, { moverCounts: { war: 90 } }), year(2, { moverCounts: { war: 60 } })],
      stateKeys: { pulseHistory: { years: 2, maxEntries: 2, finalEntries: 2 } },
    }));
    expect(graded.verdict).toBe('SILENT');
    expect(graded.firedChannels).toEqual([]);
    expect(graded.instrumentedChannels).toEqual(['eventTypes', 'stateKeys']);
    // The row declares no family, so none of that traffic is even counted for it.
    expect(graded.evidence.moverFamilies.total).toBe(0);
    expect(graded.tempo.yearsWithEvidence).toBe(0);
  });

  test('the levy grades SILENT in exactly the shape the completed soak measured', () => {
    // A warring year in which every sibling fires and war_levy does not. This is
    // the knowledge-lane diagnosis applied to the war stack.
    const silent = gradeOf('warLevyEnabled', receiptV5({
      years: [
        year(1, { eventTypeCounts: WARRING_YEAR, moverCounts: { war: 44, politics: 450 } }),
        year(2, { eventTypeCounts: { vassal_rebellion: 354 }, moverCounts: { politics: 354 } }),
      ],
    }));
    expect(silent.verdict).toBe('SILENT');
    expect(silent.ruleState).toBe('on');
    expect(silent.instrumentedChannels).toEqual(['eventTypes']);
    expect(silent.silentChannels).toEqual(['eventTypes']);
    expect(silent.evidence.eventTypes.total).toBe(0);

    // CONTROL 1: the identical receipt with ONE war_levy added grades ALIVE, so the
    // silence measures the literal rather than ignoring the channel.
    const fired = gradeOf('warLevyEnabled', receiptV5({
      years: [
        year(1, { eventTypeCounts: { ...WARRING_YEAR, war_levy: 1 }, moverCounts: { war: 45 } }),
        year(2),
      ],
    }));
    expect(fired.verdict).toBe('ALIVE');
    expect(fired.firedChannels).toEqual(['eventTypes']);

    // CONTROL 2: the same silent receipt with the switch dark grades DORMANT, so a
    // deliberately-off levy is never reported as a finding.
    const dark = gradeOf('warLevyEnabled', receiptV5({
      rules: litRules({ warLevyEnabled: false }),
      years: [year(1, { eventTypeCounts: WARRING_YEAR }), year(2)],
    }));
    expect(dark.verdict).toBe('DORMANT_BY_CONFIG');
  });

  test('the war-economy drain separates from the levy on the same receipt', () => {
    // One receipt, two sibling rows, opposite verdicts: the pair is the proof that
    // the contract resolves per subsystem rather than per family.
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { eventTypeCounts: WARRING_YEAR, moverCounts: { war: 44 } }), year(2)],
    }));
    const drain = evaluation.rows.find((row) => row.rule === 'warEconomyDrainEnabled');
    expect(drain.verdict).toBe('ALIVE');
    expect(drain.evidence.eventTypes.counts.war_conscription).toBe(8);
    expect(evaluation.silent).toContain('warLevyEnabled');
    expect(evaluation.alive).toContain('warEconomyDrainEnabled');
  });

  test('the three sidecar rows grade off their census entry and nothing else', () => {
    const cases = [
      ['defenderAttritionEnabled', 'defenderSiegeLedger'],
      ['navalEnabled', 'spatialLedgers.navalTransit'],
      ['peaceEngineEnabled', 'spatialLedgers.warReasons'],
    ];
    for (const [rule, censusKey] of cases) {
      const alive = gradeOf(rule, receiptV5({
        stateKeys: { [censusKey]: { years: 2, maxEntries: 6, finalEntries: 0 } },
      }));
      expect(alive.verdict, rule).toBe('ALIVE');
      expect(alive.firedChannels, rule).toEqual(['stateKeys']);

      // CONTROL: a census as total as any receipt could be, simply lacking the key.
      const silent = gradeOf(rule, receiptV5({
        stateKeys: { pulseHistory: { years: 2, maxEntries: 2, finalEntries: 2 } },
      }));
      expect(silent.verdict, rule).toBe('SILENT');
      expect(silent.instrumentedChannels, rule).toEqual(['stateKeys']);

      // A v4 receipt cannot answer at all, and an unanswerable question is an
      // instrument gap rather than a pass or a silence.
      const v4 = gradeOf(rule, {
        schemaVersion: 4,
        kind: 'whole_world_soak',
        years: 2,
        settlements: 12,
        behavioral: { schemaVersion: 4, yearly: [year(1), year(2)] },
      });
      expect(v4.verdict, rule).toBe('UNOBSERVED');
      expect(v4.unobservedChannels, rule).toEqual(['stateKeys']);
      expect(v4.instrumentedChannels, rule).toEqual([]);
    }
  });

  test('the eleven vocabulary-less rows reach UNOBSERVED and DORMANT, and never ALIVE', () => {
    // A census as rich as any receipt could carry, and a warring year on top: still
    // UNOBSERVED, because none of it is evidence these rows are allowed to claim.
    const rich = receiptV5({
      years: [year(1, { eventTypeCounts: WARRING_YEAR, moverCounts: { war: 44 } }), year(2)],
      stateKeys: {
        deployments: { years: 2, maxEntries: 4, finalEntries: 1 },
        occupations: { years: 2, maxEntries: 3, finalEntries: 2 },
        defenderSiegeLedger: { years: 2, maxEntries: 2, finalEntries: 0 },
        'spatialLedgers.beliefMaps': { years: 2, maxEntries: 120, finalEntries: 120 },
      },
    });
    const evaluation = evaluateSubsystemCertification(rich);
    for (const rule of Object.keys(NO_CHANNEL_ROWS)) {
      const graded = evaluation.rows.find((row) => row.rule === rule);
      expect(graded.verdict, rule).toBe('UNOBSERVED');
      expect(graded.ruleState, rule).toBe('on');
      expect(graded.firedChannels, rule).toEqual([]);
      // A rule holds exactly one verdict, so roster membership is the proof it
      // reached no other bucket on this receipt.
      expect(evaluation.unobserved, rule).toContain(rule);

      // CONTROL: the same receipt with this one switch dark reaches a DIFFERENT
      // verdict, so the gap above is the row's honest reading and not a stuck grader.
      const dark = gradeOf(rule, receiptV5({
        rules: litRules({ [rule]: false }),
        years: [year(1, { eventTypeCounts: WARRING_YEAR })],
      }));
      expect(dark.verdict, rule).toBe('DORMANT_BY_CONFIG');
    }
  });
});
