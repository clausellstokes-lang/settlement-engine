/**
 * subsystemRowsEpistemics.test.js — the two EPISTEMICS certification rows
 * (distancePricedNewsEnabled, provenanceLedgerEnabled) and the shared
 * knowledge-lane evidence catalog they rest on.
 *
 * A certification row is a CLAIM ABOUT SOURCE: "this module emits these literals
 * and writes these containers". A row nobody re-checks becomes fiction the first
 * time the module is renamed, and a fictional row grades UNOBSERVED forever while
 * reading like diligence. So this file does three jobs:
 *
 *   1. SHAPE     the rows conform to the registry contract and are authored, not
 *                pending.
 *   2. TRACE     every declared (and every deliberately UNdeclared) channel is
 *                re-derived from the live source and the live classifier, so a
 *                rename or a new emitter reds here rather than rotting silently.
 *   3. VERDICT   each row reaches each verdict it can reach, against receipts
 *                that differ in exactly one field.
 *
 * The knowledge catalog's central claim — that the `knowledge` mover family is a
 * RESIDUAL bucket and therefore cannot carry a verdict — is asserted by RUNNING
 * the production classifier, never by re-reading its token lists.
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
import {
  KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS,
  KNOWLEDGE_LANE_EVENT_TYPES,
  KNOWLEDGE_LANE_STATE_KEYS,
} from '../../src/domain/certification/knowledgeLaneEvidence.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const DISTANCE = 'distancePricedNewsEnabled';
const PROVENANCE = 'provenanceLedgerEnabled';
const PROVENANCE_LEDGER_KEY = 'spatialLedgers.provenance';

const rowFor = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);

/** Every boolean switch lit, so a fixture only has to name what it turns off. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

/** One synthetic observed year, carrying only the fields the evaluator reads. */
const year = (index) => ({
  year: index,
  eventCount: 0,
  eventTypeCounts: {},
  moverCounts: {},
  selectedMoverCounts: {},
  postApplyMoverCounts: {},
});

/** A v5 receipt: it records its own configuration and a TOTAL worldState census. */
function receiptV5({ rules = litRules(), years = [year(1), year(2)], stateKeys = {} } = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'fixture-epistemics',
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

const gradeOf = (rule, receipt) => evaluateSubsystemCertification(receipt).rows
  .find((row) => row.rule === rule);

describe('epistemics rows — shape and partition', () => {
  test('both epistemics rules are claimed EXACTLY ONCE, by their authored row', () => {
    // Counted rather than asserted absent: the pending list is a shrinking
    // burn-down worklist, so any single key chosen as a liveness anchor for a
    // negative assertion eventually retires and takes the pin with it. An exact
    // claim count over the composed partition cannot go vacuous that way, and it
    // still reds on the half-finished edit (a row landed, the pending entry left
    // behind) that this pin exists to catch.
    for (const rule of [DISTANCE, PROVENANCE]) {
      const claims = [
        ...SUBSYSTEM_CERTIFICATION_REGISTRY.map((row) => `row:${row.rule}`),
        ...SUBSYSTEM_CERTIFICATION_PENDING_KEYS.map((key) => `pending:${key}`),
      ].filter((claim) => claim.endsWith(`:${rule}`));
      expect(claims, `${rule} must be claimed once, as an authored row`).toEqual([`row:${rule}`]);
    }
  });

  test('each row conforms to the registry contract', () => {
    for (const rule of [DISTANCE, PROVENANCE]) {
      const row = rowFor(rule);
      expect(SUBSYSTEM_TEMPOS).toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE).toContain(row.soakEvidence);
      expect(row.title.length).toBeGreaterThan(0);
      expect(row.aliveness.other.length).toBeGreaterThan(80);
      expect(row.invariants.length).toBeGreaterThanOrEqual(3);
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

  test('the distance-priced-news row declares NO channel and says so honestly', () => {
    const row = rowFor(DISTANCE);
    // A modifier owns no vocabulary and no container. The contract's escape hatch
    // for that is soakEvidence 'unobserved', and it is the only honest reading.
    expect(row.aliveness.eventTypes).toEqual([]);
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.aliveness.stateKeys).toEqual([]);
    expect(row.soakEvidence).toBe('unobserved');
    // The gap must name the observation that would close it, or the row is an
    // excuse rather than a finding.
    expect(row.aliveness.other).toContain('beliefDivergence');
  });

  test('the provenance row declares the sidecar ledger and nothing it does not own', () => {
    const row = rowFor(PROVENANCE);
    expect(row.aliveness.stateKeys).toEqual([PROVENANCE_LEDGER_KEY]);
    expect(row.aliveness.eventTypes).toEqual([]);
    // A recorder classifies nothing into a mover family; claiming one would grade
    // it alive off whatever it happened to record.
    expect(row.aliveness.moverFamilies).toEqual([]);
    expect(row.soakEvidence).toBe('measured');
  });
});

describe('epistemics rows — the source trace behind every claim', () => {
  test('the provenance ledger key and its size governor are still what the row says', () => {
    const source = sourceOf('src/domain/worldPulse/provenanceKernel.js');
    // The row's stateKey claim is exactly this literal-key write.
    expect(source).toContain("setSpatialLedger(worldState, 'provenance', merged)");
    expect(source).toContain("dropSpatialLedger(worldState, 'provenance')");
    // The ledger_respects_the_size_governor invariant quotes this number.
    expect(source).toContain('MAX_PROVENANCE_EDGES = 4096');
    expect(rowFor(PROVENANCE).invariants.map((i) => i.check).join(' ')).toContain('4096');
  });

  test('distance-priced news is still a pure modifier: it mints and stores nothing', () => {
    const source = sourceOf('src/domain/worldPulse/distancePricedNews.js');
    // The moment this leaf gains a candidate type or a ledger write, the row must
    // gain a dispositive channel and stop reading UNOBSERVED. The exported reader
    // is the liveness anchor: it proves the file is the one the row names.
    expectAbsentWithAnchor(
      source,
      'candidateType',
      'export function routeAwareHopDelayTicks',
      'distancePricedNews mints no candidate type',
    );
    expectAbsentWithAnchor(
      source,
      'setSpatialLedger',
      'export function hopDelayTicks',
      'distancePricedNews writes no worldState container',
    );
  });

  test('the belief-side gate the row describes is still an AND of both halves', () => {
    const source = sourceOf('src/domain/worldPulse/beliefMap.js');
    expect(source).toContain('export function distancePricedNewsActive');
    // beliefsActive is the first half; the virtual flag is the second.
    expect(source).toContain('if (!beliefsActive(worldState)) return false;');
    expect(source).toContain('.distancePricedNewsEnabled === true');
    // And the single consuming seam the row cites: the report age fold.
    expect(source).toContain('routeAwareHopDelayTicks(digest, sourceId, observerId, embattlementOf)');
  });
});

describe('the knowledge-lane evidence catalog', () => {
  test('the one genuine knowledge literal still classifies on its own vocabulary', () => {
    expect(KNOWLEDGE_LANE_EVENT_TYPES).toEqual(['belief_misjudgment']);
    for (const kind of KNOWLEDGE_LANE_EVENT_TYPES) {
      expect(moverFamilyOf({ impactKind: kind }), kind).toBe('knowledge');
    }
    // And it is really emitted, by the module the catalog names.
    expect(sourceOf('src/domain/worldPulse/beliefMap.js')).toContain("impactKind: 'belief_misjudgment'");
  });

  test('the knowledge family is a RESIDUAL bucket, proven by running the classifier', () => {
    // THE MECHANISM, asserted directly so this test cannot go vacuous as the
    // catalog shrinks: a record whose only vocabulary is an unrecognised kind
    // still lands in `knowledge`, purely because its wizard-news id tokenizes to
    // include `news`. No length floor is asserted, because SHRINKING the catalog
    // (giving one of these kinds a family of its own, or narrowing the token) is
    // the cure, and a ratchet that reds on the cure is a ratchet pointed backwards.
    expect(moverFamilyOf({ id: 'wizard_news.5.zzz_unrecognised_kind.observer' })).toBe('knowledge');
    for (const kind of KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS) {
      // On its own vocabulary the kind belongs to NO family at all...
      expect(moverFamilyOf({ impactKind: kind }), `${kind} on its own`).toBeNull();
      // ...yet the same record carrying its ordinary wizard-news id lands in
      // `knowledge`, purely because that id tokenizes to include `news`. This is
      // why no certification row may treat a knowledge count as its evidence.
      expect(
        moverFamilyOf({ impactKind: kind, id: `wizard_news.5.${kind}.observer.subject` }),
        `${kind} with its wizard-news id`,
      ).toBe('knowledge');
    }
  });

  test('every catalogued knowledge container still has its literal-key writer', () => {
    const writers = {
      'spatialLedgers.beliefMaps': 'src/domain/worldPulse/pulseKernel.js',
      'spatialLedgers.rumorLedgers': 'src/domain/worldPulse/pulseKernel.js',
      'spatialLedgers.credibility': 'src/domain/worldPulse/informationStatecraft.js',
      'spatialLedgers.disinfo': 'src/domain/worldPulse/informationStatecraft.js',
    };
    expect(Object.keys(writers).sort()).toEqual([...KNOWLEDGE_LANE_STATE_KEYS].sort());
    for (const [censusKey, module] of Object.entries(writers)) {
      const sub = censusKey.slice('spatialLedgers.'.length);
      expect(sourceOf(module), `${censusKey} writer`).toContain(`setSpatialLedger(`);
      expect(sourceOf(module), `${censusKey} writer`).toContain(`'${sub}'`);
    }
  });
});

describe('epistemics rows — the verdicts, one field apart', () => {
  test('provenance grades ALIVE only when the census actually carries the ledger', () => {
    const alive = gradeOf(PROVENANCE, receiptV5({
      stateKeys: { [PROVENANCE_LEDGER_KEY]: { years: 2, maxEntries: 1440, finalEntries: 1440 } },
    }));
    expect(alive.verdict).toBe('ALIVE');
    expect(alive.firedChannels).toEqual(['stateKeys']);
    expect(alive.tempo.meetsExpectedTempo).toBe(true);

    // CONTROL: the identical receipt whose TOTAL census simply lacks the ledger.
    // The only difference is the census row, so the silence names a cause.
    const silent = gradeOf(PROVENANCE, receiptV5({
      stateKeys: { pulseHistory: { years: 2, maxEntries: 2, finalEntries: 2 } },
    }));
    expect(silent.verdict).toBe('SILENT');
    expect(silent.instrumentedChannels).toEqual(['stateKeys']);
    expect(silent.silentChannels).toEqual(['stateKeys']);
  });

  test('provenance grades DORMANT_BY_CONFIG when the switch is dark', () => {
    const dormant = gradeOf(PROVENANCE, receiptV5({ rules: litRules({ [PROVENANCE]: false }) }));
    expect(dormant.verdict).toBe('DORMANT_BY_CONFIG');
    expect(dormant.ruleState).toBe('off');
  });

  test('a v4 receipt reports the provenance ledger as an instrument gap, never a pass', () => {
    const v4 = {
      schemaVersion: 4,
      kind: 'whole_world_soak',
      years: 2,
      settlements: 4,
      behavioral: { schemaVersion: 4, yearly: [year(1), year(2)] },
    };
    const graded = gradeOf(PROVENANCE, v4);
    expect(graded.verdict).toBe('UNOBSERVED');
    expect(graded.unobservedChannels).toEqual(['stateKeys']);
    expect(graded.instrumentedChannels).toEqual([]);
  });

  test('distance-priced news can reach UNOBSERVED and DORMANT, and never ALIVE', () => {
    // Lit, with a census as rich as any receipt could be: still UNOBSERVED,
    // because the row declares no channel that this evidence could satisfy.
    const lit = gradeOf(DISTANCE, receiptV5({
      stateKeys: {
        'spatialLedgers.beliefMaps': { years: 2, maxEntries: 120, finalEntries: 120 },
        'spatialLedgers.rumorLedgers': { years: 2, maxEntries: 300, finalEntries: 280 },
      },
    }));
    expect(lit.verdict).toBe('UNOBSERVED');
    expect(lit.ruleState).toBe('on');
    expect(lit.firedChannels).toEqual([]);
    // CONTROL: the same receipt with the switch dark reaches a DIFFERENT verdict,
    // so the UNOBSERVED above is the row's honest gap and not a stuck grader.
    const dark = gradeOf(DISTANCE, receiptV5({ rules: litRules({ [DISTANCE]: false }) }));
    expect(dark.verdict).toBe('DORMANT_BY_CONFIG');

    // A rule holds exactly one verdict, so membership in the evaluation's
    // `unobserved` roster is itself the proof that it reached no other bucket.
    const evaluation = evaluateSubsystemCertification(receiptV5());
    expect(evaluation.unobserved).toContain(DISTANCE);
  });
});
