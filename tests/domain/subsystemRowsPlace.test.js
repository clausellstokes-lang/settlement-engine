/**
 * subsystemRowsPlace.test.js — the six PLACE-AND-SPATIAL certification rows
 * (tier drift, urban fabric, the roads, seasons, calamities, spatial consequence).
 *
 * A certification row is a CLAIM ABOUT SOURCE: "this module emits these literals,
 * writes these containers, and deliberately declares nothing else". Three of these
 * six rows declare NOTHING and grade UNOBSERVED, which is the strongest claim in
 * the file and the easiest to rot into laziness, so it is checked hardest: each
 * empty channel is justified here by re-deriving the module's actual vocabulary
 * from live source, never by taking the row's word for it.
 *
 *   1. SHAPE      the six rows are authored, not pending, and conform to the
 *                 registry contract.
 *   2. TRACE      every declared channel is RE-DERIVED from the live source, and
 *                 every deliberately EMPTY channel is justified by deriving the
 *                 module's emitted vocabulary or by running the production
 *                 classifier.
 *   3. VERDICT    each row reaches the verdicts it can reach, against receipts
 *                 that differ in exactly one field.
 *
 * MEASURED NUMBERS in the row prose come from artifacts/soak (gitignored, so no
 * test may read it) and from a v5 probe run on 2026-07-31. Where a measurement
 * matters to a verdict, the fixtures below reproduce its SHAPE and name the case.
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
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { functionBody, mustExtract } from '../helpers/sourceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const PLACE_RULES = Object.freeze([
  'tierDriftEnabled',
  'urbanFabricEnabled',
  'roadsEnabled',
  'seasonsEnabled',
  'disastersEnabled',
  'spatialConsequenceEnabled',
]);

/** The three rows that declare no channel at all and must say so through soakEvidence. */
const GAP_RULES = Object.freeze(['seasonsEnabled', 'disastersEnabled', 'spatialConsequenceEnabled']);

const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const sorted = (list) => [...list].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

/** Every `candidateType: '<literal>'` a module emits. Fail-closed by comparison: a
 *  regex that stopped matching yields a SMALLER set and reds the equality it feeds. */
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
    caseId: 'fixture-place-2y-4s',
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

const ledger = (years, maxEntries) => ({ years, maxEntries, finalEntries: maxEntries });
const verdictOf = (evaluation, rule) => evaluation.rows.find((row) => row.rule === rule).verdict;

describe('place-and-spatial certification rows — shape', () => {
  test('all six rules are authored in the registry and none is still pending', () => {
    const pending = new Set(SUBSYSTEM_CERTIFICATION_PENDING_KEYS);
    for (const rule of PLACE_RULES) {
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
      // The row's provenance prose is the next reader's entry point; an empty one
      // turns a deliberate silence into an unexplained one.
      expect(row.aliveness.other.length, `${rule} explains nothing in aliveness.other`)
        .toBeGreaterThan(200);
    }
  });

  test('no place row claims a mover family, because `place` is a seven-lane bucket', () => {
    // The anti-vacuity law for THIS lane. Verified against the live classifier in
    // the TRACE block below: seven distinct subsystems land in `place`, so any row
    // claiming it would grade ALIVE off the other six.
    for (const rule of PLACE_RULES) {
      expect(rowOf(rule).aliveness.moverFamilies, `${rule} claims a mover family`).toEqual([]);
    }
  });

  test('a row with no channel at all declares soakEvidence unobserved, and one with a channel does not', () => {
    for (const rule of PLACE_RULES) {
      const { aliveness, soakEvidence } = rowOf(rule);
      const channels = aliveness.eventTypes.length + aliveness.moverFamilies.length + aliveness.stateKeys.length;
      if (GAP_RULES.includes(rule)) {
        expect(channels, `${rule} is listed as a gap row but declares a channel`).toBe(0);
        expect(soakEvidence, `${rule} declares no channel, so it must admit soakEvidence unobserved`)
          .toBe('unobserved');
      } else {
        expect(channels, `${rule} declares no channel`).toBeGreaterThan(0);
        expect(soakEvidence, `${rule} has a channel, so 'unobserved' would suppress a real SILENT`)
          .toBe('measured');
      }
    }
  });
});

describe('place-and-spatial certification rows — trace to live source', () => {
  test('tier drift: the declared event types are RE-DERIVED from the two directions the module returns', () => {
    const src = read('src/domain/worldPulse/tierResourceDynamics.js');
    // The composition itself: a renamed template reds here rather than silently
    // leaving the derived set below correct-looking.
    mustExtract(src, 'candidateType: `tier_${drift.direction}`', 'tierCandidate composition');
    // THE ONE GATE SEAM. Pinned as flag + call-site COUNT rather than as one
    // literal line: P1a added the demographic viability argument and wrapped the
    // ternary, and a literal needle would have to be re-pinned on every such edit
    // while still passing if somebody added a SECOND, ungated call elsewhere.
    // Two assertions carry the invariant the literal only implied.
    mustExtract(src, 'rules.tierDriftEnabled', 'the drift flag guard');
    const eligibilityMentions = [...src.matchAll(/\btierEligibility\(/g)].length;
    expect(eligibilityMentions, 'exactly one definition and one gated call site')
      .toBe(2);
    const directions = sorted(new Set([...src.matchAll(/\bdirection: '([a-z_]+)'/g)].map((m) => m[1])));
    expect(directions).toEqual(['demotion', 'promotion']);
    expect(sorted(rowOf('tierDriftEnabled').aliveness.eventTypes))
      .toEqual(sorted(directions.map((direction) => `tier_${direction}`)));
  });

  test('tier drift: settlementTickStates is deliberately NOT claimed, because it is written when dark', () => {
    const src = read('src/domain/worldPulse/tierResourceDynamics.js');
    // The unconditional write: it sits OUTSIDE the `if (eligibility)` branch, so the
    // container exists with the flag dark and can never gate this subsystem.
    mustExtract(src, 'settlementTickStates[item.id] = {', 'the unconditional tick-state write');
    expect(rowOf('tierDriftEnabled').aliveness.stateKeys).toEqual([]);
  });

  test('urban fabric: the declared sidecar is the one the kernel writes and drops', () => {
    const src = read('src/domain/worldPulse/urbanFabricKernel.js');
    mustExtract(src, 'urbanFabricEnabled === true', 'the fabric gate');
    mustExtract(src, "setSpatialLedger(worldState, 'urbanFabric', persisted)", 'the fabric persist');
    mustExtract(src, "dropSpatialLedger(worldState, 'urbanFabric')", 'the drop-when-empty branch');
    expect(rowOf('urbanFabricEnabled').aliveness.stateKeys).toEqual(['spatialLedgers.urbanFabric']);
    // No candidate vocabulary at all, which is why eventTypes is empty.
    expect(quotedCandidateTypes('src/domain/worldPulse/urbanFabricKernel.js')).toEqual([]);
  });

  test('the roads: both declared sidecars are written through the literal-key idiom', () => {
    const src = read('src/domain/worldPulse/roadsKernel.js');
    mustExtract(src, "setSpatialLedger(nextWorldState, 'roads', persisted)", 'the mission persist');
    mustExtract(src, "setSpatialLedger(nextWorldState, 'roadsReturnedCaptives'", 'the captive persist');
    expect(sorted(rowOf('roadsEnabled').aliveness.stateKeys))
      .toEqual(['spatialLedgers.roads', 'spatialLedgers.roadsReturnedCaptives']);
    mustExtract(read('src/domain/roads/state.js'), 'roadsEnabled === true', 'roadsActive');
    expect(quotedCandidateTypes('src/domain/worldPulse/roadsKernel.js')).toEqual([]);
  });

  test('calamities: the ONLY candidate the strike emits is the shared migration literal', () => {
    // This is the whole justification for an empty eventTypes channel. If the
    // kernel ever gains a calamity-owned literal, this equality reds and the row
    // must claim it.
    expect(quotedCandidateTypes('src/domain/worldPulse/calamityKernel.js'))
      .toEqual(['population_emigration']);
    const src = read('src/domain/worldPulse/calamityKernel.js');
    mustExtract(src, "impactKind: 'calamity'", 'the strike news beat');
    // The permanent record is a per-settlement field, not a worldState container,
    // so the census cannot see it.
    mustExtract(src, 'calamityHistory: [', 'the permanent stamp');
    expect(rowOf('disastersEnabled').aliveness.stateKeys).toEqual([]);
  });

  test('seasons: the food year emits no candidate at all, only the three markers', () => {
    expect(quotedCandidateTypes('src/domain/worldPulse/seasons.js')).toEqual([]);
    const src = read('src/domain/worldPulse/seasons.js');
    for (const marker of ['harvest', 'hungry_gap', 'spring_thaw']) {
      mustExtract(src, `impactKind: '${marker}'`, `the ${marker} marker`);
    }
    mustExtract(read('src/domain/worldPulse/pulseKernel.js'), 'simulationRules.seasonsEnabled === true', 'the seasons gate');
    const row = rowOf('seasonsEnabled');
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
  });

  test('spatial consequence: the layer is write-free, so it can have no state channel', () => {
    const src = read('src/domain/worldPulse/spatialConsequenceKernel.js');
    const body = functionBody(src, 'advanceSpatialConsequence');
    expect(body.length, 'advanceSpatialConsequence body extracted empty').toBeGreaterThan(0);
    // It returns beats and a changed flag; there is no worldState in its result, so
    // a stateKeys claim would be fiction rather than merely unmeasured.
    mustExtract(body, 'return { changed: newsEntries.length > 0, newsEntries };', 'the write-free return');
    expect([...src.matchAll(/setSpatialLedger\(/g)].length, 'the layer wrote a spatial ledger').toBe(0);
    // And its INPUT is a sidecar derived outside the engine, which is why the row
    // reads UNOBSERVED rather than SILENT.
    mustExtract(read('src/domain/spatial/spatialSubstrateRead.js'), "'spatialSubstrate'", 'the substrate read');
    mustExtract(read('src/store/campaignWorldPulseDeferred.js'), 'deriveCampaignSubstrates', 'the out-of-engine producer');
    expect(rowOf('spatialConsequenceEnabled').aliveness.stateKeys).toEqual([]);
  });

  test('the production classifier really does bucket seven lanes into `place`', () => {
    // Executed against scripts/audit/behavioral-observation.mjs itself, so this is
    // the live rule rather than a transcription of it. Every record below is the
    // shape its module actually emits.
    const classify = (record) => moverFamilyOf(record);
    expect(classify({ id: 'candidate.tier.promotion.a.156', type: 'tier', candidateType: 'tier_promotion', ruleFamily: 'tier' })).toBe('place');
    expect(classify({ id: 'wizard_news.156.calamity.a', kind: 'applied', impactKind: 'calamity' })).toBe('place');
    expect(classify({ id: 'wizard_news.season.harvest.3.156', kind: 'season_marker', impactKind: 'harvest' })).toBe('place');
    expect(classify({ id: 'wizard_news.season.hungry_gap.3.156', kind: 'season_marker', impactKind: 'hungry_gap' })).toBe('place');
    expect(classify({ id: 'wizard_news.season.spring_thaw.3.156', kind: 'season_marker', impactKind: 'spring_thaw' })).toBe('place');
    expect(classify({ id: 'wizard_news.156.urban_fabric.a.rise.civic', kind: 'applied', impactKind: 'urban_fabric' })).toBe('place');
    expect(classify({ id: 'wizard_news.156.settlement_lifecycle.a.steading_founded', kind: 'applied', impactKind: 'steading_founded' })).toBe('place');
    // The exodus a calamity sheds is classified as ordinary migration, which is the
    // second half of why disastersEnabled may not claim population_emigration.
    expect(classify({ id: 'calamity.exodus.a.156', type: 'population', candidateType: 'population_emigration', ruleFamily: 'population' })).toBe('place');
  });

  test('the roads and spatial-consequence beats classify by their ID STRING, not their subsystem', () => {
    // The reason both rows declare no mover family. A roads beat matches no family
    // on its own vocabulary and falls through to `knowledge` on the bare `news`
    // token inside `wizard_news.…`; the same beat with a `ransom` seed lands in
    // `people` instead. One subsystem, two families, neither its own.
    expect(moverFamilyOf({ id: 'wizard_news.156.roads.a.depart', kind: 'applied', impactKind: 'roads' })).toBe('knowledge');
    expect(moverFamilyOf({ id: 'wizard_news.156.roads.a.ransom', kind: 'applied', impactKind: 'roads' })).toBe('people');
    // Spatial consequence splits the same way across its own two beats.
    expect(moverFamilyOf({ id: 'wizard_news.156.spatial_consequence.a.calamity_where', kind: 'applied', impactKind: 'spatial_consequence' })).toBe('place');
    expect(moverFamilyOf({ id: 'wizard_news.156.spatial_consequence.a.covert_diffusion', kind: 'applied', impactKind: 'spatial_consequence' })).toBe('knowledge');
  });
});

describe('place-and-spatial certification rows — verdicts', () => {
  test('tier drift is ALIVE on its own vocabulary and SILENT without it', () => {
    const alive = evaluateSubsystemCertification(receiptV5({
      years: [year(1, { eventTypeCounts: { tier_demotion: 2 } }), year(2, { eventTypeCounts: { tier_promotion: 1 } })],
    }));
    const row = alive.rows.find((entry) => entry.rule === 'tierDriftEnabled');
    expect(row.verdict).toBe('ALIVE');
    expect(row.evidence.eventTypes.total).toBe(3);
    expect(row.tempo.meetsExpectedTempo).toBe(true);
    // CONTROL: the identical receipt with those two years emptied of tier events,
    // so the ALIVE above measures the vocabulary and not the fixture.
    const silent = evaluateSubsystemCertification(receiptV5({ years: [year(1), year(2)] }));
    expect(verdictOf(silent, 'tierDriftEnabled')).toBe('SILENT');
  });

  test('urban fabric and the roads are ALIVE on their sidecars and SILENT without them', () => {
    // The SHAPE measured on the 2026-07-31 v5 probe (2 years x 4 settlements):
    // urbanFabric present in both years at the settlement count, roads in both.
    const alive = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      stateKeys: {
        'spatialLedgers.urbanFabric': ledger(2, 4),
        'spatialLedgers.roads': ledger(2, 2),
      },
    }));
    for (const rule of ['urbanFabricEnabled', 'roadsEnabled']) {
      const row = alive.rows.find((entry) => entry.rule === rule);
      expect(row.verdict, rule).toBe('ALIVE');
      expect(row.firedChannels, rule).toEqual(['stateKeys']);
      expect(row.tempo.meetsExpectedTempo, `${rule} tempo`).toBe(true);
    }
    // CONTROL: a census that is TOTAL and simply never carries either ledger. The
    // absence is the finding, and it must not hide behind an instrument gap.
    const silent = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      stateKeys: { pulseHistory: ledger(2, 2) },
    }));
    expect(verdictOf(silent, 'urbanFabricEnabled')).toBe('SILENT');
    expect(verdictOf(silent, 'roadsEnabled')).toBe('SILENT');
  });

  test('a v4 receipt reports the sidecar rows as an instrument gap rather than a silence', () => {
    // The shape of every completed release case: no subsystems section at all.
    const v4 = {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      caseId: 'fixture-30y-12s',
      years: 2,
      settlements: 12,
      behavioral: { schemaVersion: 4, yearly: [year(1, { eventTypeCounts: { tier_demotion: 1 } }), year(2)] },
    };
    const evaluation = evaluateSubsystemCertification(v4);
    expect(evaluation.configSource).toBe('harness_default');
    // The event channel survives the v4 envelope, so tier drift still grades.
    expect(verdictOf(evaluation, 'tierDriftEnabled')).toBe('ALIVE');
    for (const rule of ['urbanFabricEnabled', 'roadsEnabled']) {
      const row = evaluation.rows.find((entry) => entry.rule === rule);
      expect(row.verdict, rule).toBe('UNOBSERVED');
      expect(row.unobservedChannels, rule).toEqual(['stateKeys']);
      expect(row.instrumentedChannels, rule).toEqual([]);
    }
  });

  test('the three gap rows stay UNOBSERVED even while the shared place family roars', () => {
    // 3,255 place movers is the measured 30-year 12-settlement figure. None of it
    // belongs to these three rows, and the contract must not let it lift them.
    const evaluation = evaluateSubsystemCertification(receiptV5({
      years: [
        year(1, { moverCounts: { place: 1600 }, eventTypeCounts: { tier_promotion: 4, resource_depletion: 9 } }),
        year(2, { moverCounts: { place: 1655 }, eventTypeCounts: { tier_demotion: 5 } }),
      ],
      stateKeys: {
        'spatialLedgers.urbanFabric': ledger(2, 4),
        'spatialLedgers.roads': ledger(2, 2),
        'spatialLedgers.satellites': ledger(2, 3),
      },
    }));
    for (const rule of GAP_RULES) {
      const row = evaluation.rows.find((entry) => entry.rule === rule);
      expect(row.verdict, rule).toBe('UNOBSERVED');
      expect(row.evidence.eventTypes.total, rule).toBe(0);
      expect(row.evidence.stateKeys.total, rule).toBe(0);
    }
    // CONTROL: the same three rows ARE reached and graded, so the UNOBSERVED above
    // is a verdict rather than a row the evaluator skipped.
    const dark = evaluateSubsystemCertification(receiptV5({
      rules: litRules({ seasonsEnabled: false, disastersEnabled: false, spatialConsequenceEnabled: false }),
      years: [year(1, { moverCounts: { place: 1600 } })],
    }));
    for (const rule of GAP_RULES) {
      expect(verdictOf(dark, rule), rule).toBe('DORMANT_BY_CONFIG');
    }
  });

  test('spatial consequence never grades SILENT, because a soak cannot give it a substrate to read', () => {
    // Measured 2026-07-31: the v5 probe census carried twenty-two spatialLedgers
    // sub-keys and spatialSubstrate was not among them, because the substrate is
    // derived in the store at canonize time and the soak fixture seeds only a
    // spatialDigest. A zero here is an instrument gap, never a dead subsystem.
    const withoutSubstrate = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      stateKeys: { 'spatialLedgers.urbanFabric': ledger(2, 4), spatialDigest: ledger(2, 14) },
    }));
    expect(verdictOf(withoutSubstrate, 'spatialConsequenceEnabled')).toBe('UNOBSERVED');
    // CONTROL: even a census that DOES carry the substrate leaves the row
    // UNOBSERVED, because the layer writes nothing of its own and its beats never
    // reach eventTypeCounts. The row is honest about owning no channel at all.
    const withSubstrate = evaluateSubsystemCertification(receiptV5({
      years: [year(1), year(2)],
      stateKeys: { 'spatialLedgers.spatialSubstrate': ledger(2, 4) },
    }));
    expect(verdictOf(withSubstrate, 'spatialConsequenceEnabled')).toBe('UNOBSERVED');
  });
});
