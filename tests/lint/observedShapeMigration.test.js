import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  artifactInventoryOf,
  canonicalJson,
  createScanArtifact,
  digestOf,
  governedLegacyDetectorSha256,
} from '../../scripts/lib/observed-shape-governance.mjs';
import {
  BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
  BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS,
  BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
  CORPUS_COVERAGE_SCANNER_DELTA_PATHS,
  CORPUS_COVERAGE_TARGET_SCHEMA,
  EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS,
  EPOCH_DARK_CORPUS_TARGET_SCHEMA,
  PROSE_REGEN_SCANNER_DELTA_PATHS,
  PROSE_REGEN_TARGET_SCHEMA,
  FILTERED_TARGET_SCHEMA,
  HEURISTIC_TARGET_SCHEMA,
  heuristicMigrationReport,
  LEAF_MIGRATION_PREDECESSOR,
  migrationBundleOf,
  migrationReport,
  migrationReportDigest,
  RETIRED_EXACT_TARGET_SCHEMA,
  reviewTemplateOf,
  run as runMigration,
  SURFACE_FILTERED_TARGET_SCHEMA,
  validateGovernedMigration,
  validateHeuristicMigrationReport,
  validateMigrationBundle,
  validateMigrationReport,
  validatePredecessorBaseline,
  validateReviewLedger,
} from '../../scripts/migrate-observed-shape-readers.mjs';
import {
  validateSchema6Baseline,
  validateSchema7Baseline,
  validateSchema8Baseline,
  validateSchema9Baseline,
  validateSchema10Baseline,
} from '../../scripts/lib/observed-shape-baseline.mjs';

const SUBJECT_SHA = 'a'.repeat(40);
const SCANNER_SHA = 'c'.repeat(40);
const HASH_A = '1'.repeat(64);
const HASH_B = '2'.repeat(64);
const HASH_C = '3'.repeat(64);
const HASH_D = '4'.repeat(64);
const HASH_E = '5'.repeat(64);
const LEGACY_MODULE_SHA = governedLegacyDetectorSha256();
const LEGACY_ALGORITHM = Object.freeze({
  baseSha: '6e7acc4dd88a43cb608f40bc77db3b2130a1e2de',
  sourceBlobSha: '0310fa9fdda873c1b382cf18c3936707e8e4addf',
  enrichment: 'node-name-start-v1',
  modulePath: 'scripts/lib/legacy-reader-shape-scan.mjs',
  moduleSha256: LEGACY_MODULE_SHA,
});
const SCAN_CONFIG = Object.freeze({
  corpusGraphSchema: 2,
  minRows: 40,
  originMinRows: 8,
});

function entry(path, sha256 = HASH_A, overrides = {}) {
  return { path, type: 'file', mode: '100644', size: 1, sha256, ...overrides };
}

function manifest(entries) {
  const sorted = [...entries].sort((a, b) => a.path.localeCompare(b.path));
  return {
    algorithm: 'sha256-canonical-path-type-mode-size-content-v2',
    entries: sorted,
    digest: digestOf(sorted),
  };
}

const sourceEntry = entry('src/probe.js', HASH_A);
const legacyDetectorEntry = entry('scripts/lib/legacy-reader-shape-scan.mjs', LEGACY_MODULE_SHA);
const currentDetectorEntry = entry('scripts/lib/reader-shape-scan.mjs', HASH_C);
const scanTree = manifest([sourceEntry]);
const sourceTree = manifest([sourceEntry]);
const detectorTree = manifest([legacyDetectorEntry, currentDetectorEntry]);
const executionTree = manifest([sourceEntry, legacyDetectorEntry, currentDetectorEntry]);

const oldFinding = (line, pos, key, shape, text = `row.${key}`) => ({
  file: 'src/probe.js', line, pos, key, shapes: [shape], text,
});

const site = (key, ordinal = 0) => `v2|owner=probe|context=${HASH_A}|expr=${HASH_B}|ordinal=${ordinal}|kind=dot|key=${encodeURIComponent(key)}`;
const newFinding = (line, pos, key, shape, origin, text = `row.${key}`, ordinal = 0) => ({
  file: 'src/probe.js', line, pos, key, shapes: [shape], origins: [origin],
  site: site(key, ordinal), text,
});

const legacyStats = { files: 1, reads: 8, resolved: 4, unresolved: 4 };
const legacySentinel = { usableShapes: 2, totalKeys: 4, resolvedReads: 4 };

const currentCorpus = {
  shapes: {
    pooled: { rows: 40, keys: ['id', 'name'] },
    row: { rows: 40, keys: ['id', 'name'] },
  },
  graph: {
    schema: 2,
    origins: {
      'root/itemsA': { id: 'root/itemsA', path: 'root/itemsA', label: 'actualA', rows: 8, keys: ['id', 'name'], requiredKeys: ['id', 'name'], fields: {}, dynamicValues: [] },
      'root/itemsB': { id: 'root/itemsB', path: 'root/itemsB', label: 'actualB', rows: 8, keys: ['id', 'name'], requiredKeys: ['id', 'name'], fields: {}, dynamicValues: [] },
      'root/row': { id: 'root/row', path: 'root/row', label: 'row', rows: 8, keys: ['id', 'name'], requiredKeys: ['id', 'name'], fields: {}, dynamicValues: [] },
    },
    roots: { row: [{ kind: 'record', origins: ['root/row'] }] },
    meta: { transitions: 1, depthTruncations: 0, cycleCuts: 0 },
  },
  // ⚠ THIS FIXTURE USED TO OMIT simulationFlagsLit/steadingsMinted/shapeCount, and
  // the migration accepted it — an ABSENT corpus-definition key compared `undefined`
  // and passed. `shapeCount` deliberately DIFFERS from the predecessor's 305 so the
  // recorded-move path is exercised rather than assumed.
  meta: {
    seeds: 4,
    configs: 4,
    generations: 16,
    pulseIntervals: 12,
    simulationFlagsLit: 73,
    steadingsMinted: 12,
    shapeCount: 1321,
  },
};
const currentStats = {
  files: 1, reads: 8, resolved: 4, resolvedOrigins: 4, unresolved: 4,
  depthTruncations: 0, cycleCuts: 0,
  computedRecordUnknown: 0, objectValuesRecordUnknown: 0,
};
const currentSentinel = {
  usableShapes: 2,
  totalKeys: 4,
  usableOrigins: 3,
  originKeys: 6,
  transitions: 1,
  resolvedReads: 4,
  resolvedOrigins: 4,
  corpusDepthTruncations: 0,
  resolverDepthTruncations: 0,
  depthTruncations: 0,
  corpusCycleCuts: 0,
  resolverCycleCuts: 0,
  cycleCuts: 0,
};

function legacyArtifact(findings, overrides = {}) {
  return createScanArtifact({
    scanMode: 'legacy-leaf',
    baselineSchema: 2,
    subjectSha: SUBJECT_SHA,
    scannerSha: SCANNER_SHA,
    scanTree,
    sourceTree,
    detectorTree,
    executionTree,
    scanConfig: SCAN_CONFIG,
    legacyAlgorithm: LEGACY_ALGORITHM,
    corpus: currentCorpus,
    findings,
    stats: legacyStats,
    sentinel: legacySentinel,
    inventory: artifactInventoryOf('legacy-leaf', findings),
    ...overrides,
  });
}

function currentArtifact(findings, overrides = {}) {
  return createScanArtifact({
    scanMode: 'exact-origin',
    baselineSchema: 3,
    subjectSha: SUBJECT_SHA,
    scannerSha: SCANNER_SHA,
    scanTree,
    sourceTree,
    detectorTree,
    executionTree,
    scanConfig: SCAN_CONFIG,
    corpus: currentCorpus,
    findings,
    stats: currentStats,
    sentinel: currentSentinel,
    inventory: artifactInventoryOf('exact-origin', findings),
    ...overrides,
  });
}

function predecessorBaseline(legacy, overrides = {}) {
  const inventory = structuredClone(legacy.inventory);
  return {
    _doc: ['schema-2 predecessor fixture'],
    schema: 2,
    frozen: '2026-08-07',
    frozenAtSha: 'ec525a59',
    minRows: 40,
    corpusMeta: {
      seeds: 4,
      configs: 4,
      generations: 16,
      pulseIntervals: 12,
      simulationFlagsLit: 73,
      steadingsMinted: 12,
      shapeCount: 305,
    },
    scanStats: structuredClone(legacy.stats),
    sentinel: structuredClone(legacy.sentinel),
    total: legacy.findings.length,
    identities: Object.values(inventory).reduce((n, row) => n + Object.keys(row).length, 0),
    inventory,
    ...overrides,
  };
}

const predecessorText = (predecessor) => `${JSON.stringify(predecessor, null, 1)}\n`;
const reportOf = (predecessor, legacy, current) => migrationReport(
  predecessor,
  legacy,
  current,
  predecessorText(predecessor),
);

function fixtureArtifacts() {
  const legacy = legacyArtifact([
    oldFinding(10, 100, 'held', 'row'),
    oldFinding(20, 200, 'split', 'pooled'),
    oldFinding(40, 400, 'departed', 'row'),
  ]);
  return {
    predecessor: predecessorBaseline(legacy),
    legacy,
    current: currentArtifact([
      newFinding(10, 100, 'held', 'row', 'root/row'),
      newFinding(20, 200, 'split', 'actualA', 'root/itemsA'),
      newFinding(20, 200, 'split', 'actualB', 'root/itemsB'),
      newFinding(50, 500, 'arrived', 'row', 'root/row'),
    ]),
  };
}

function acceptedReview(report) {
  const review = reviewTemplateOf(report);
  review.decisions = review.decisions.map((decision) => ({
    ...decision,
    decision: 'accept',
    note: decision.subject === 'scanner-transition'
      ? 'reviewed the exact governed scanner transition and its unchanged unscanned inputs'
      : 'reviewed against the exact source site and executed origin',
  }));
  return review;
}

describe('observed-shape schema migration governance', () => {
  test('requires an explicit schema-2 predecessor CLI input', () => {
    expect(() => runMigration([])).toThrow(/--predecessor=<predecessor-baseline\.json>/);
    expect(() => runMigration(['--unknown'])).toThrow(/unknown governed CLI argument/);
    expect(() => runMigration([
      '--predecessor=a', '--predecessor=b', '--legacy=c', '--current=d',
    ])).toThrow(/duplicate governed CLI argument/);
  });

  test('CLI plans every output before parsing evidence and refuses aliases or repository targets', () => {
    const dir = mkdtempSync(join(tmpdir(), 'osr-migration-cli-'));
    const predecessorPath = join(dir, 'predecessor.json');
    const legacyPath = join(dir, 'legacy.json');
    const currentPath = join(dir, 'current.json');
    for (const path of [predecessorPath, legacyPath, currentPath]) writeFileSync(path, '{}\n');
    const required = [
      `--predecessor=${predecessorPath}`,
      `--legacy=${legacyPath}`,
      `--current=${currentPath}`,
    ];
    try {
      expect(() => runMigration([...required, `--json=${legacyPath}`]))
        .toThrow(/aliases a governed input/);
      expect(() => runMigration([
        ...required,
        `--json=${join(process.cwd(), 'scripts', '.forbidden-osr-output.json')}`,
      ])).toThrow(/outside the repository/);
      const duplicate = join(dir, 'duplicate.json');
      expect(() => runMigration([
        ...required, `--json=${duplicate}`, `--review-template=${duplicate}`,
      ])).toThrow(/duplicate normalized path/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('pairs only exact source addresses and preserves split plus corrected as independent facets', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const report = reportOf(predecessor, legacy, current);

    expect(report.summary).toEqual({
      paired: 2,
      legacyOnly: 1,
      currentOnly: 1,
      singleOrigin: 2,
      splitOrigin: 1,
      sameLeafShape: 1,
      correctedLeafShape: 1,
      predecessorSame: 3,
      predecessorDecreased: 0,
      predecessorGone: 0,
      predecessorIncreased: 0,
      predecessorNew: 0,
    });
    expect(report.conservation).toEqual({
      predecessorIdentities: 3,
      predecessorCount: 3,
      legacyInventoryIdentities: 3,
      legacyInventoryCount: 3,
      predecessorRows: 3,
      predecessorIdentitiesCovered: 3,
      predecessorCountsCovered: 3,
      legacyInventoryIdentitiesCovered: 3,
      legacyInventoryCountsCovered: 3,
      legacyFindings: 3,
      currentFindings: 4,
      currentSites: 3,
      legacySitesCovered: 3,
      currentSitesCovered: 3,
      currentFindingsCovered: 4,
      paired: 2,
      legacyOnly: 1,
      currentOnly: 1,
    });
    const split = report.rows.find((row) => row.address.key === 'split');
    expect(split.facets).toEqual({
      presence: 'paired',
      exactOrigins: 'split',
      leafShapes: 'corrected',
    });
    expect(split.current.origins).toEqual([
      { origin: 'root/itemsA', shape: 'actualA' },
      { origin: 'root/itemsB', shape: 'actualB' },
    ]);
  });

  test('is canonical and deterministic, including stable row and report digests', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const first = reportOf(predecessor, legacy, current);
    const second = reportOf(predecessor, legacy, current);

    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(migrationReportDigest(first)).toBe(migrationReportDigest(second));
    expect(first.rows.map((row) => row.rowId)).toEqual(second.rows.map((row) => row.rowId));
    expect(first.predecessorRows.map((row) => row.rowId))
      .toEqual(second.predecessorRows.map((row) => row.rowId));
    expect(new Set(first.rows.map((row) => row.rowId)).size).toBe(first.rows.length);
    expect(new Set(first.predecessorRows.map((row) => row.rowId)).size)
      .toBe(first.predecessorRows.length);
  });

  test('binds the exact predecessor file bytes independently of canonical JSON content', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const prettyText = predecessorText(predecessor);
    const compactText = JSON.stringify(predecessor);
    const pretty = migrationReport(predecessor, legacy, current, prettyText);
    const compact = migrationReport(predecessor, legacy, current, compactText);

    expect(pretty.inputs.predecessorBaselineDigest)
      .toBe(compact.inputs.predecessorBaselineDigest);
    expect(pretty.inputs.predecessorBaselineTextSha256).toBe(
      createHash('sha256').update(Buffer.from(prettyText, 'utf8')).digest('hex'),
    );
    expect(pretty.inputs.predecessorBaselineTextSha256)
      .not.toBe(compact.inputs.predecessorBaselineTextSha256);

    const differentObject = structuredClone(predecessor);
    differentObject.frozenAtSha = 'abcdef0';
    expect(() => migrationReport(differentObject, legacy, current, prettyText))
      .toThrow(/does not match its exact input text/);
  });

  test('validates and conserves every schema-2 predecessor identity and count', () => {
    const { predecessor: original, legacy, current } = fixtureArtifacts();
    const predecessor = structuredClone(original);
    predecessor.inventory['src/probe.js']['held on row'] = 2;
    predecessor.inventory['src/probe.js']['gone on row'] = 1;
    predecessor.total = 5;
    predecessor.identities = 4;

    expect(validatePredecessorBaseline(predecessor)).toEqual(predecessor);
    const report = reportOf(predecessor, legacy, current);
    expect(report.summary).toMatchObject({
      predecessorSame: 2,
      predecessorDecreased: 1,
      predecessorGone: 1,
      predecessorIncreased: 0,
      predecessorNew: 0,
    });
    expect(report.conservation).toMatchObject({
      predecessorIdentities: 4,
      predecessorCount: 5,
      predecessorIdentitiesCovered: 4,
      predecessorCountsCovered: 5,
      legacyInventoryIdentities: 3,
      legacyInventoryCount: 3,
      legacyInventoryIdentitiesCovered: 3,
      legacyInventoryCountsCovered: 3,
    });
    expect(reviewTemplateOf(report).decisions).toHaveLength(
      report.predecessorRows.length + report.rows.length,
    );
  });

  test('rejects malformed schema-2 predecessor structure and legacy inventory growth', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    for (const mutate of [
      (value) => { value.minRows = 0; },
      (value) => { value.frozenAtSha = 'not-a-sha'; },
      (value) => { value.total += 1; },
      (value) => { value.identities += 1; },
      (value) => { value.sentinel.resolvedReads += 1; },
      (value) => { value.inventory['src/probe.js']['held on row'] = 0; },
    ]) {
      const malformed = structuredClone(predecessor);
      mutate(malformed);
      expect(() => validatePredecessorBaseline(malformed)).toThrow(/schema-2 predecessor/);
    }

    const missingIdentity = structuredClone(predecessor);
    delete missingIdentity.inventory['src/probe.js']['departed on row'];
    missingIdentity.total = 2;
    missingIdentity.identities = 2;
    const report = reportOf(missingIdentity, legacy, current);
    expect(report.summary.predecessorNew).toBe(1);
    expect(report.issues).toHaveLength(1);

    // ⚠⚠ `issues` MEANS "NOT REVIEWED", NOT "NOT CLEAN" — and the difference is a
    // governance change, stated here so nobody later reads it as an accidental
    // weakening. It was measured, both directions, that the old spelling threw on
    // any growth row BEFORE it read a single decision, so a complete, fully
    // accepted 2,326-row ledger could never authorize a migration. An issue is now
    // DISCHARGEABLE by the reviewed disposition of the SAME row, and by nothing
    // else — so the issue carries that row's id and must join to it.
    const growthRow = report.predecessorRows.find((row) => row.reconciliation === 'new');
    expect(report.issues[0].rowId, 'an issue that does not name its row cannot be discharged by review')
      .toBe(growthRow.rowId);

    // POSITIVE: a reviewed growth row authorizes.
    expect(() => validateReviewLedger(acceptedReview(report), report)).not.toThrow();

    // NEGATIVE: the SAME report with the SAME ledger, differing in exactly one
    // field — that row's decision — still fails closed.
    const pending = acceptedReview(report);
    pending.decisions = pending.decisions.map((decision) => (decision.rowId === growthRow.rowId
      ? { ...decision, decision: 'pending' }
      : decision));
    expect(() => validateReviewLedger(pending, report)).toThrow(/not accepted/);

    // NEGATIVE, THE ARM'S OWN: an issue naming a row the report does not carry is
    // invisible to the decisions loop, so ONLY the issues gate can refuse it. This
    // is what keeps that gate from being dead code once the loop demands `accept`.
    const forged = structuredClone(report);
    forged.issues = [{ ...report.issues[0], rowId: 'osr-predecessor-row-v1:not-a-real-row' }];
    // The ledger is rebuilt FROM the forged report, so its bindings match and the
    // issues gate — not the bindings check — is what refuses it.
    expect(() => validateReviewLedger(acceptedReview(forged), forged))
      .toThrow(/unresolved issues/);
  });

  test('refuses different subject commits, different trees, and artifact digest tampering', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const otherSha = currentArtifact(current.findings, { subjectSha: 'd'.repeat(40) });
    expect(() => reportOf(predecessor, legacy, otherSha)).toThrow(/different subject commits/);

    const otherEntry = entry('src/probe.js', '4'.repeat(64));
    const otherTree = manifest([otherEntry]);
    const otherExecutionTree = manifest([otherEntry, legacyDetectorEntry, currentDetectorEntry]);
    const otherBoundSource = currentArtifact(current.findings, {
      scanTree: otherTree,
      sourceTree: otherTree,
      executionTree: otherExecutionTree,
    });
    expect(() => reportOf(predecessor, legacy, otherBoundSource)).toThrow(/exact same source tree/);

    const tampered = structuredClone(current);
    tampered.findings[0].text = 'tampered source evidence';
    expect(() => reportOf(predecessor, legacy, tampered)).toThrow(/findings digest mismatch/);
  });

  test('requires identical corpus, detector, execution conditions, and committed toolchain', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    expect(() => reportOf(
      { ...predecessor, minRows: 39 }, legacy, current,
    )).toThrow(/does not match the legacy artifact threshold/);
    expect(() => reportOf({
      ...predecessor,
      corpusMeta: { ...predecessor.corpusMeta, pulseIntervals: 13 },
    }, legacy, current)).toThrow(/corpus configuration pulseIntervals/);

    // ⚠⚠ THE CORPUS DEFINITION IS RECORDED, NOT MERELY COMPARED. The live
    // 305 -> 1,321 `shapeCount` move re-grounded receivers across the estate and
    // drove the growth rows the freeze had to review — and the four-key check was
    // structurally blind to it. Execution keys must match; observation keys are
    // BANKED with both sides visible, so a genesis can never absorb a corpus-
    // definition move in silence.
    const recorded = reportOf(predecessor, legacy, current).corpusCompatibility;
    expect(recorded.keys.shapeCount).toEqual({ predecessor: 305, current: 1321, moved: true });
    expect(recorded.moved).toContain('shapeCount: 305 -> 1321');
    expect(recorded.keys.pulseIntervals.moved, 'an execution key can never be recorded as moved —'
      + ' it throws instead').toBe(false);
    expect(recorded.executionKeys).toEqual(['seeds', 'configs', 'generations', 'pulseIntervals']);

    // …and an ABSENT corpus-definition key is refused rather than compared against
    // `undefined`. This is the hole the old fixture sat in: it declared only the
    // four execution keys and the migration accepted it.
    // BOTH artifacts carry it, or `assertArtifactPair`'s same-corpus law throws
    // first and this would assert the wrong refusal.
    const undeclared = {
      ...currentCorpus,
      meta: {
        seeds: 4, configs: 4, generations: 16, pulseIntervals: 12,
      },
    };
    expect(() => reportOf(
      predecessor,
      legacyArtifact(legacy.findings, { corpus: undeclared }),
      currentArtifact(current.findings, { corpus: undeclared }),
    )).toThrow(/corpus meta simulationFlagsLit is missing/);

    const differentCorpus = currentArtifact(current.findings, {
      corpus: {
        ...currentCorpus,
        meta: { ...currentCorpus.meta, generations: 17 },
      },
    });
    expect(() => reportOf(predecessor, legacy, differentCorpus))
      .toThrow(/exact same canonical executed corpus/);

    const differentConfig = currentArtifact(current.findings, {
      scanConfig: { ...SCAN_CONFIG, minRows: 39 },
    });
    expect(() => reportOf(predecessor, legacy, differentConfig))
      .toThrow(/same thresholds and scan configuration/);

    const changedDetectorEntry = entry('scripts/lib/reader-shape-scan.mjs', '4'.repeat(64));
    const changedDetector = manifest([legacyDetectorEntry, changedDetectorEntry]);
    const changedExecution = manifest([sourceEntry, legacyDetectorEntry, changedDetectorEntry]);
    const differentDetector = currentArtifact(current.findings, {
      detectorTree: changedDetector,
      executionTree: changedExecution,
    });
    expect(() => reportOf(predecessor, legacy, differentDetector))
      .toThrow(/exact same detector tree/);

    const differentScanner = currentArtifact(current.findings, { scannerSha: 'd'.repeat(40) });
    expect(() => reportOf(predecessor, legacy, differentScanner))
      .toThrow(/same committed scanner toolchain/);

    const counterfeitLegacy = structuredClone(legacy);
    counterfeitLegacy.legacyAlgorithm.baseSha = 'd'.repeat(40);
    expect(() => reportOf(predecessor, counterfeitLegacy, current))
      .toThrow(/governed detector/);

    const alteredLegacyEntry = entry(
      'scripts/lib/legacy-reader-shape-scan.mjs',
      '5'.repeat(64),
    );
    const alteredLegacyDetector = manifest([alteredLegacyEntry, currentDetectorEntry]);
    const alteredLegacyExecution = manifest([sourceEntry, alteredLegacyEntry, currentDetectorEntry]);
    expect(() => legacyArtifact(legacy.findings, {
      detectorTree: alteredLegacyDetector,
      executionTree: alteredLegacyExecution,
      legacyAlgorithm: { ...LEGACY_ALGORITHM, moduleSha256: alteredLegacyEntry.sha256 },
    })).toThrow(/runtime-verified governed module/);
  });

  test('never falls back to nearest-line or same-text pairing', () => {
    const legacy = legacyArtifact([oldFinding(10, 100, 'id', 'row', 'row.id')]);
    const current = currentArtifact([newFinding(11, 101, 'id', 'row', 'root/row', 'row.id')]);
    const predecessor = predecessorBaseline(legacy);
    const report = reportOf(predecessor, legacy, current);

    expect(report.summary).toMatchObject({ paired: 0, legacyOnly: 1, currentOnly: 1 });
    expect(report.rows.map((row) => row.facets.presence).sort())
      .toEqual(['current-only', 'legacy-only']);
  });

  test('refuses repeated legacy sites and repeated current site/origin rows', () => {
    const duplicateLegacy = [
      oldFinding(10, 100, 'id', 'row'),
      oldFinding(10, 100, 'id', 'row'),
    ];
    expect(() => legacyArtifact(duplicateLegacy)).toThrow(/duplicate legacy observed-shape site/);

    const duplicateCurrent = [
      newFinding(10, 100, 'id', 'row', 'root/row'),
      newFinding(10, 100, 'id', 'row', 'root/row'),
    ];
    expect(() => currentArtifact(duplicateCurrent)).toThrow(/duplicate observed-shape site\/origin/);
  });

  test('requires a canonical report bound to its exact input and target inventory digests', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const report = reportOf(predecessor, legacy, current);
    expect(validateMigrationReport(
      report, predecessor, legacy, current, predecessorText(predecessor),
    )).toBe(report);

    const tampered = structuredClone(report);
    tampered.target.inventoryDigest = 'f'.repeat(64);
    expect(() => validateMigrationReport(
      tampered, predecessor, legacy, current, predecessorText(predecessor),
    )).toThrow(/not the canonical report/);
  });

  test('requires one accepted, noted decision for every migration row', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const report = reportOf(predecessor, legacy, current);
    const review = acceptedReview(report);
    const authorization = validateGovernedMigration({
      predecessorBaseline: predecessor,
      predecessorBaselineText: predecessorText(predecessor),
      legacyArtifact: legacy,
      currentArtifact: current,
      report,
      review,
    });
    expect(authorization).toMatchObject({
      reportDigest: migrationReportDigest(report),
      targetInventoryDigest: current.digests.inventory,
      subjectSha: SUBJECT_SHA,
      predecessorBaselineDigest: digestOf(validatePredecessorBaseline(predecessor)),
      predecessorBaselineTextSha256: createHash('sha256')
        .update(Buffer.from(predecessorText(predecessor), 'utf8')).digest('hex'),
      predecessorInventoryDigest: digestOf(predecessor.inventory),
      scanTreeDigest: scanTree.digest,
      sourceTreeDigest: sourceTree.digest,
      detectorTreeDigest: detectorTree.digest,
      executionTreeDigest: executionTree.digest,
      corpusDigest: current.digests.corpus,
      scanConfigDigest: current.digests.scanConfig,
      legacyArtifactDigest: report.inputs.legacyArtifactDigest,
      currentArtifactDigest: report.inputs.currentArtifactDigest,
      legacyScannerSha: SCANNER_SHA,
      legacyDetectorDigest: legacy.provenance.detectorDigest,
      legacyScannerToolDigest: legacy.provenance.scannerToolDigest,
      currentFindingsDigest: current.digests.findings,
      currentScannerSha: SCANNER_SHA,
      currentDetectorDigest: current.provenance.detectorDigest,
      currentScannerToolDigest: current.provenance.scannerToolDigest,
    });
    expect(authorization.reviewDigest).toMatch(/^[a-f0-9]{64}$/);

    const bundle = migrationBundleOf({
      predecessorBaseline: predecessor,
      predecessorBaselineText: predecessorText(predecessor),
      legacyArtifact: legacy,
      currentArtifact: current,
      report,
      review,
    });
    expect(bundle.bundleDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(bundle.predecessorBaseline).toEqual(validatePredecessorBaseline(predecessor));
    expect(bundle.predecessorBaselineText).toBe(predecessorText(predecessor));
    expect(bundle.predecessorBaselineTextSha256)
      .toBe(authorization.predecessorBaselineTextSha256);
    expect(validateMigrationBundle(bundle)).toEqual({
      ...authorization,
      bundleDigest: bundle.bundleDigest,
    });

    const tamperedPredecessor = structuredClone(bundle);
    tamperedPredecessor.predecessorBaseline.total += 1;
    tamperedPredecessor.bundleDigest = digestOf({
      predecessorBaseline: tamperedPredecessor.predecessorBaseline,
      predecessorBaselineText: tamperedPredecessor.predecessorBaselineText,
      predecessorBaselineTextSha256: tamperedPredecessor.predecessorBaselineTextSha256,
      legacyArtifact: tamperedPredecessor.legacyArtifact,
      currentArtifact: tamperedPredecessor.currentArtifact,
      report: tamperedPredecessor.report,
      review: tamperedPredecessor.review,
    });
    expect(() => validateMigrationBundle(tamperedPredecessor))
      .toThrow(/totals disagree with inventory/);

    const missing = structuredClone(review);
    missing.decisions.splice(0, 1);
    expect(() => validateReviewLedger(missing, report)).toThrow(/missing 1 row/);

    const rejected = structuredClone(review);
    rejected.decisions[0].decision = 'reject';
    expect(() => validateReviewLedger(rejected, report)).toThrow(/not accepted/);

    const unnoted = structuredClone(review);
    unnoted.decisions[0].note = '';
    expect(() => validateReviewLedger(unnoted, report)).toThrow(/lacks a review note/);
  });

  test('rejects review replay against any changed report or target inventory', () => {
    const { predecessor, legacy, current } = fixtureArtifacts();
    const report = reportOf(predecessor, legacy, current);
    const review = acceptedReview(report);
    const changed = structuredClone(report);
    changed.rows[0].legacy.text = 'different source evidence';

    expect(() => validateReviewLedger(review, changed)).toThrow(/not bound to this report/);

    const bundle = migrationBundleOf({
      predecessorBaseline: predecessor,
      predecessorBaselineText: predecessorText(predecessor),
      legacyArtifact: legacy,
      currentArtifact: current,
      report,
      review,
    });
    bundle.currentArtifact.inventory['src/probe.js'] = {};
    expect(() => validateMigrationBundle(bundle)).toThrow(/unsupported schema/);
  });
});

/* ══ SCHEMA 2 -> 4 — THE LIVE HEURISTIC MIGRATION ══════════════════════════ */

describe('observed-shape schema-2 -> schema-4 heuristic migration', () => {
  /** The predecessor is missing one identity the heuristic scan finds, so the
   *  reconciliation carries a `new` row — the only kind that raises an issue and
   *  therefore the only kind whose review discharge can be proven. */
  function heuristicFixture() {
    const legacy = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(20, 200, 'held', 'row', 'row.held'),
      oldFinding(40, 400, 'arrived', 'row'),
    ]);
    const predecessor = predecessorBaseline(legacy);
    // Remove the `arrived` identity from the predecessor: heuristic scan finds
    // it, the schema-2 freeze did not, so it reconciles as `new`.
    delete predecessor.inventory['src/probe.js']['arrived on row'];
    predecessor.total = 2;
    predecessor.identities = 1;
    return { predecessor, legacy };
  }

  function schema6BaselineOf(artifact) {
    const inventory = structuredClone(artifact.inventory);
    const manifests = {
      scanTree: artifact.scanTree,
      sourceTree: artifact.sourceTree,
      detectorTree: artifact.detectorTree,
      executionTree: artifact.executionTree,
    };
    const migrationReview = {
      bundleDigest: HASH_A,
      reportDigest: HASH_B,
      reviewDigest: HASH_C,
      predecessorBaselineDigest: '4'.repeat(64),
      predecessorBaselineTextSha256: '5'.repeat(64),
      predecessorInventoryDigest: '6'.repeat(64),
      legacyArtifactDigest: digestOf(artifact),
      currentArtifactDigest: digestOf(artifact),
      subjectSha: artifact.provenance.subjectSha,
      sourceTreeDigest: artifact.sourceTree.digest,
      scanTreeDigest: artifact.scanTree.digest,
      detectorTreeDigest: artifact.detectorTree.digest,
      executionTreeDigest: artifact.executionTree.digest,
      corpusDigest: artifact.digests.corpus,
      scanConfigDigest: artifact.digests.scanConfig,
      targetInventoryDigest: digestOf(inventory),
      currentFindingsDigest: artifact.digests.findings,
      legacyScannerSha: artifact.provenance.scannerSha,
      legacyAlgorithmBaseSha: LEGACY_ALGORITHM.baseSha,
      legacyDetectorDigest: artifact.detectorTree.digest,
      legacyScannerToolDigest: artifact.provenance.scannerToolDigest,
      currentScannerSha: artifact.provenance.scannerSha,
      currentDetectorDigest: artifact.detectorTree.digest,
      currentScannerToolDigest: artifact.provenance.scannerToolDigest,
    };
    const baseline = {
      _doc: ['schema-6 numeric predecessor fixture'],
      schema: SURFACE_FILTERED_TARGET_SCHEMA,
      frozen: '2026-08-12',
      frozenAtSha: artifact.provenance.subjectSha,
      minRows: SCAN_CONFIG.minRows,
      originMinRows: SCAN_CONFIG.originMinRows,
      corpusMeta: structuredClone(artifact.corpus.meta),
      scanStats: structuredClone(artifact.stats),
      sentinel: structuredClone(artifact.sentinel),
      total: artifact.findings.length,
      identities: Object.values(inventory)
        .reduce((sum, row) => sum + Object.keys(row).length, 0),
      inventory,
      migrationReview,
      manifests,
      scannerProvenance: {
        scanTreeDigest: artifact.scanTree.digest,
        sourceTreeDigest: artifact.sourceTree.digest,
        detectorDigest: artifact.detectorTree.digest,
        executionTreeDigest: artifact.executionTree.digest,
        unscannedInputDigest: digestOf(artifact.sourceTree.entries.filter((candidate) => (
          !artifact.scanTree.entries.some((scanned) => scanned.path === candidate.path)
        ))),
      },
      digests: {
        corpusMeta: digestOf(artifact.corpus.meta),
        scanStats: digestOf(artifact.stats),
        sentinel: digestOf(artifact.sentinel),
        inventory: digestOf(inventory),
        manifests: digestOf(manifests),
        migrationReview: digestOf(migrationReview),
      },
    };
    validateSchema6Baseline(baseline);
    return baseline;
  }

  function schema7BaselineOf(artifact) {
    const baseline = schema6BaselineOf(artifact);
    baseline._doc = ['schema-7 tagged predecessor fixture'];
    baseline.schema = BANKED_EXPLAINED_WRITER_TARGET_SCHEMA;
    baseline.rowTags = {};
    baseline.digests.rowTags = digestOf(baseline.rowTags);
    validateSchema7Baseline(baseline);
    return baseline;
  }

  function schema8BaselineOf(artifact) {
    const baseline = schema7BaselineOf(artifact);
    baseline._doc = ['schema-8 tagged predecessor fixture'];
    baseline.schema = CORPUS_COVERAGE_TARGET_SCHEMA;
    validateSchema8Baseline(baseline);
    return baseline;
  }

  function schema9BaselineOf(artifact) {
    const baseline = schema8BaselineOf(artifact);
    baseline._doc = ['schema-9 tagged predecessor fixture'];
    baseline.schema = EPOCH_DARK_CORPUS_TARGET_SCHEMA;
    validateSchema9Baseline(baseline);
    return baseline;
  }

  const predecessorScannerSha = 'b'.repeat(40);
  const unscannedSourceEntry = entry('src/unscanned.json', HASH_C);

  function bankedTransitionTrees({
    current = false,
    changedPaths = BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS,
    entryOverrides = {},
    unscannedEntry = unscannedSourceEntry,
    inputPaths = BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
  } = {}) {
    const changed = new Set(changedPaths);
    const detectorEntries = inputPaths.map((path) => {
      const originalSha = path === LEGACY_ALGORITHM.modulePath ? LEGACY_MODULE_SHA : HASH_A;
      const sha256 = current && changed.has(path) ? HASH_B : originalSha;
      return entry(path, sha256, entryOverrides[path] || {});
    });
    const transitionSourceTree = manifest([sourceEntry, unscannedEntry]);
    return {
      detectorTree: manifest(detectorEntries),
      sourceTree: transitionSourceTree,
      executionTree: manifest([...transitionSourceTree.entries, ...detectorEntries]),
    };
  }

  function corpusCoverageTransitionTrees({
    current = false,
    changedPaths = CORPUS_COVERAGE_SCANNER_DELTA_PATHS,
    entryOverrides = {},
    unscannedEntry = unscannedSourceEntry,
    inputPaths = BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
  } = {}) {
    const schema7Changed = new Set(BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS);
    const schema8Changed = new Set(changedPaths);
    const detectorEntries = inputPaths.map((path) => {
      const originalSha = path === LEGACY_ALGORITHM.modulePath ? LEGACY_MODULE_SHA : HASH_A;
      const predecessorSha = schema7Changed.has(path) ? HASH_B : originalSha;
      const sha256 = current && schema8Changed.has(path) ? HASH_C : predecessorSha;
      return entry(path, sha256, entryOverrides[path] || {});
    });
    const transitionSourceTree = manifest([sourceEntry, unscannedEntry]);
    return {
      detectorTree: manifest(detectorEntries),
      sourceTree: transitionSourceTree,
      executionTree: manifest([...transitionSourceTree.entries, ...detectorEntries]),
    };
  }

  /** The 8→9 rung. Same shape as its two predecessors, layered one more time so
   *  the schema-8 side is the state the schema-7→8 mint actually left behind. */
  function epochDarkTransitionTrees({
    current = false,
    changedPaths = EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS,
    entryOverrides = {},
    unscannedEntry = unscannedSourceEntry,
    inputPaths = BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
  } = {}) {
    const schema7Changed = new Set(BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS);
    const schema8Changed = new Set(CORPUS_COVERAGE_SCANNER_DELTA_PATHS);
    const schema9Changed = new Set(changedPaths);
    const detectorEntries = inputPaths.map((path) => {
      const originalSha = path === LEGACY_ALGORITHM.modulePath ? LEGACY_MODULE_SHA : HASH_A;
      const schema7Sha = schema7Changed.has(path) ? HASH_B : originalSha;
      const predecessorSha = schema8Changed.has(path) ? HASH_C : schema7Sha;
      const sha256 = current && schema9Changed.has(path) ? HASH_D : predecessorSha;
      return entry(path, sha256, entryOverrides[path] || {});
    });
    const transitionSourceTree = manifest([sourceEntry, unscannedEntry]);
    return {
      detectorTree: manifest(detectorEntries),
      sourceTree: transitionSourceTree,
      executionTree: manifest([...transitionSourceTree.entries, ...detectorEntries]),
    };
  }

  /** The 9→10 rung. Layered once more, so the schema-9 side is the state the
   *  schema-8→9 mint actually left behind and the schema-10 delta is measured
   *  against it rather than against a synthetic origin. */
  function proseRegenTransitionTrees({
    current = false,
    changedPaths = PROSE_REGEN_SCANNER_DELTA_PATHS,
    entryOverrides = {},
    unscannedEntry = unscannedSourceEntry,
    inputPaths = BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
  } = {}) {
    const schema7Changed = new Set(BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS);
    const schema8Changed = new Set(CORPUS_COVERAGE_SCANNER_DELTA_PATHS);
    const schema9Changed = new Set(EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS);
    const schema10Changed = new Set(changedPaths);
    const detectorEntries = inputPaths.map((path) => {
      const originalSha = path === LEGACY_ALGORITHM.modulePath ? LEGACY_MODULE_SHA : HASH_A;
      const schema7Sha = schema7Changed.has(path) ? HASH_B : originalSha;
      const schema8Sha = schema8Changed.has(path) ? HASH_C : schema7Sha;
      const predecessorSha = schema9Changed.has(path) ? HASH_D : schema8Sha;
      const sha256 = current && schema10Changed.has(path) ? HASH_E : predecessorSha;
      return entry(path, sha256, entryOverrides[path] || {});
    });
    const transitionSourceTree = manifest([sourceEntry, unscannedEntry]);
    return {
      detectorTree: manifest(detectorEntries),
      sourceTree: transitionSourceTree,
      executionTree: manifest([...transitionSourceTree.entries, ...detectorEntries]),
    };
  }

  const heuristicReportOf = ({ predecessor, legacy }) => heuristicMigrationReport(
    predecessor,
    legacy,
    predecessorText(predecessor),
    HEURISTIC_TARGET_SCHEMA,
  );

  test('the target IS the heuristic inventory, and there are NO site-migration rows', () => {
    const fixture = heuristicFixture();
    const report = heuristicReportOf(fixture);

    expect(report.kind).toBe('observed-shape-schema-2-to-4-migration');
    expect(report.target).toEqual({
      baselineSchema: HEURISTIC_TARGET_SCHEMA,
      inventoryDigest: fixture.legacy.digests.inventory,
      findingsDigest: fixture.legacy.digests.findings,
    });
    expect(HEURISTIC_TARGET_SCHEMA).toBe(4);
    expect(RETIRED_EXACT_TARGET_SCHEMA).toBe(3);

    // ⚠⚠ THE EMPTY `rows` IS THE ARGUMENT, NOT AN OMISSION. Schema 4 re-spells
    // nothing, so there is no cross-detector pairing for a reviewer to accept;
    // the whole reconciliation is `predecessorRows`. Asserting it is EMPTY (and
    // that the ledger's expected row set is exactly the predecessor rows) is
    // what stops a later refactor from smuggling unreviewed rows through.
    expect(report.rows).toEqual([]);
    expect(report.predecessorRows).toHaveLength(2);
    expect(reviewTemplateOf(report).decisions).toHaveLength(report.predecessorRows.length);
    expect(reviewTemplateOf(report).decisions.every((d) => d.subject === 'predecessor-reconciliation'))
      .toBe(true);
    expect(report.summary).toEqual({
      predecessorSame: 1,
      predecessorDecreased: 0,
      predecessorGone: 0,
      predecessorIncreased: 0,
      predecessorNew: 1,
    });
    // Multiplicity travels: `held` is TWO reads on one leaf identity.
    expect(report.conservation).toMatchObject({
      predecessorIdentities: 1,
      predecessorCount: 2,
      legacyInventoryIdentities: 2,
      legacyInventoryCount: 3,
      targetIdentities: 2,
      targetCount: 3,
      legacyFindings: 3,
      predecessorRows: 2,
    });
  });

  test('every current* binding names the ONE governed heuristic artifact', () => {
    const fixture = heuristicFixture();
    const report = heuristicReportOf(fixture);
    const artifactDigest = digestOf(fixture.legacy);
    expect(report.inputs).toMatchObject({
      legacyArtifactDigest: artifactDigest,
      currentArtifactDigest: artifactDigest,
      legacyFindingsDigest: fixture.legacy.digests.findings,
      currentFindingsDigest: fixture.legacy.digests.findings,
      legacyScannerSha: SCANNER_SHA,
      currentScannerSha: SCANNER_SHA,
      legacyDetectorDigest: fixture.legacy.provenance.detectorDigest,
      currentDetectorDigest: fixture.legacy.provenance.detectorDigest,
      legacyScannerToolDigest: fixture.legacy.provenance.scannerToolDigest,
      currentScannerToolDigest: fixture.legacy.provenance.scannerToolDigest,
    });
  });

  test('is canonical and deterministic, and refuses a non-canonical replay', () => {
    const fixture = heuristicFixture();
    const first = heuristicReportOf(fixture);
    const second = heuristicReportOf(fixture);
    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(validateHeuristicMigrationReport(
      first, fixture.predecessor, fixture.legacy, predecessorText(fixture.predecessor),
      HEURISTIC_TARGET_SCHEMA,
    )).toBe(first);

    const tampered = structuredClone(first);
    tampered.target.inventoryDigest = 'f'.repeat(64);
    expect(() => validateHeuristicMigrationReport(
      tampered, fixture.predecessor, fixture.legacy, predecessorText(fixture.predecessor),
      HEURISTIC_TARGET_SCHEMA,
    )).toThrow(/not the canonical report/);

    // A smuggled site-migration row is refused by conservation, not merely
    // ignored — `validateReviewLedger` would otherwise demand decisions for it.
    const smuggled = structuredClone(first);
    smuggled.rows = [{ rowId: 'osr-migration-row-v1:forged' }];
    expect(() => validateHeuristicMigrationReport(
      smuggled, fixture.predecessor, fixture.legacy, predecessorText(fixture.predecessor),
      HEURISTIC_TARGET_SCHEMA,
    )).toThrow(/not the canonical report/);
  });

  test('an EXACT artifact cannot stand in for the governed heuristic detector', () => {
    const fixture = heuristicFixture();
    const exact = currentArtifact([newFinding(10, 100, 'held', 'row', 'root/row')]);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, exact, predecessorText(fixture.predecessor),
      HEURISTIC_TARGET_SCHEMA,
    )).toThrow(/validated legacy-leaf\/schema-2 scan artifact/);

    const counterfeit = structuredClone(fixture.legacy);
    counterfeit.legacyAlgorithm.baseSha = 'd'.repeat(40);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, counterfeit, predecessorText(fixture.predecessor),
      HEURISTIC_TARGET_SCHEMA,
    )).toThrow(/governed detector/);
  });

  test('the corpus definition is still recorded and execution keys still refuse a move', () => {
    const fixture = heuristicFixture();
    const recorded = heuristicReportOf(fixture).corpusCompatibility;
    expect(recorded.keys.shapeCount).toEqual({ predecessor: 305, current: 1321, moved: true });
    expect(recorded.moved).toContain('shapeCount: 305 -> 1321');
    expect(() => heuristicMigrationReport(
      { ...fixture.predecessor, corpusMeta: { ...fixture.predecessor.corpusMeta, generations: 17 } },
      fixture.legacy,
      predecessorText({ ...fixture.predecessor, corpusMeta: { ...fixture.predecessor.corpusMeta, generations: 17 } }),
      HEURISTIC_TARGET_SCHEMA,
    )).toThrow(/corpus configuration generations/);
  });

  test('a growth row must be dispositioned by an accepted, noted decision', () => {
    const fixture = heuristicFixture();
    const report = heuristicReportOf(fixture);
    const growthRow = report.predecessorRows.find((row) => row.reconciliation === 'new');
    expect(report.issues).toHaveLength(1);
    expect(report.issues[0].rowId).toBe(growthRow.rowId);

    expect(() => validateReviewLedger(acceptedReview(report), report)).not.toThrow();

    const pending = acceptedReview(report);
    pending.decisions = pending.decisions.map((decision) => (decision.rowId === growthRow.rowId
      ? { ...decision, decision: 'pending' }
      : decision));
    expect(() => validateReviewLedger(pending, report)).toThrow(/not accepted/);
  });

  test('the bundle authorizes, round-trips, and refuses a second current artifact', () => {
    const fixture = heuristicFixture();
    const report = heuristicReportOf(fixture);
    const review = acceptedReview(report);
    const shared = {
      predecessorBaseline: fixture.predecessor,
      predecessorBaselineText: predecessorText(fixture.predecessor),
      legacyArtifact: fixture.legacy,
      currentArtifact: fixture.legacy,
      report,
      review,
    };
    const authorization = validateGovernedMigration(shared);
    expect(authorization).toMatchObject({
      targetInventoryDigest: fixture.legacy.digests.inventory,
      subjectSha: SUBJECT_SHA,
      legacyArtifactDigest: digestOf(fixture.legacy),
      currentArtifactDigest: digestOf(fixture.legacy),
      currentScannerToolDigest: fixture.legacy.provenance.scannerToolDigest,
      legacyScannerToolDigest: fixture.legacy.provenance.scannerToolDigest,
      legacyAlgorithmBaseSha: '6e7acc4dd88a43cb608f40bc77db3b2130a1e2de',
    });

    const bundle = migrationBundleOf(shared);
    expect(validateMigrationBundle(bundle)).toEqual({
      ...authorization,
      bundleDigest: bundle.bundleDigest,
    });

    // ⛔ NEGATIVE CONTROL — the bundle keeps a `currentArtifact` slot only so no
    // consumer needs a branch. A DIFFERENT artifact in that slot is refused, or
    // the convenience would be a hole an unreviewed artifact travels through.
    const exact = currentArtifact([newFinding(10, 100, 'held', 'row', 'root/row')]);
    expect(() => validateGovernedMigration({ ...shared, currentArtifact: exact }))
      .toThrow(/not the governed heuristic artifact itself/);
  });

  test('the CLI derives its target from the inputs and refuses a contradictory pair', () => {
    const dir = mkdtempSync(join(tmpdir(), 'osr-heuristic-cli-'));
    const fixture = heuristicFixture();
    const predecessorPath = join(dir, 'predecessor.json');
    const legacyPath = join(dir, 'legacy.json');
    const currentPath = join(dir, 'current.json');
    const reportPath = join(dir, 'report.json');
    try {
      writeFileSync(predecessorPath, predecessorText(fixture.predecessor));
      writeFileSync(legacyPath, JSON.stringify(fixture.legacy));
      writeFileSync(currentPath, JSON.stringify(currentArtifact([
        newFinding(10, 100, 'held', 'row', 'root/row'),
      ])));

      // The RETIRED heuristic target, named explicitly. The exact artifact is
      // never even read on this path.
      const report = runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`,
        `--target-schema=${HEURISTIC_TARGET_SCHEMA}`, `--json=${reportPath}`,
      ]);
      expect(report.target.baselineSchema).toBe(HEURISTIC_TARGET_SCHEMA);
      expect(report.rows).toEqual([]);

      // ⭐ THE BARE CLI ALWAYS MEANS THE LIVE TARGET, WHICH IS NOW 10 — and a
      // schema-2 predecessor cannot reach it, because `LEAF_MIGRATION_PREDECESSOR`
      // pairs each target with exactly its own predecessor. The refusal is the
      // pin: nothing silently re-runs a retired migration, and the default moving
      // with the live schema is what makes the bare CLI mean the current mint.
      expect(() => runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`,
      ])).toThrow(/predecessor baseline must be a schema-9 object/);
      // …and the RETIRED live target of the previous mint is still reachable by
      // name, still refusing the same schema-2 predecessor for its own reason.
      expect(() => runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`,
        `--target-schema=${FILTERED_TARGET_SCHEMA}`,
      ])).toThrow(/predecessor baseline must be a schema-4 object/);

      expect(() => runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`,
        `--current=${currentPath}`, `--target-schema=${HEURISTIC_TARGET_SCHEMA}`,
      ])).toThrow(/--current is only valid for the retired/);
      // ⚠⚠ THIS PIN IS AN INVERSE, AND IT FLIPS AT EVERY MINT: target 9 was the
      // refused number until the schema-9 mint made it live, target 10 was the
      // refused number until this one did, so the refusal moves again to the
      // first number outside the table. Keeping an unreachable target named here
      // is the point — a target the CLI would accept but no rung defines is
      // exactly the silent mode switch this refusal exists to stop. ⚠ A stale
      // inverse pin does not red; it quietly stops testing anything, because the
      // number it names has become valid.
      expect(() => runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`, '--target-schema=11',
      ])).toThrow(/--target-schema must be 10/);
      expect(() => runMigration([`--predecessor=${predecessorPath}`, '--target-schema=3']))
        .toThrow(/usage:/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  /**
   * ⭐⭐ THE SCHEMA-4 -> SCHEMA-5 TARGET (CR-OSR-FREEZE-6-R2, the consolidated mint).
   *
   * Schema 5 did NOT move the alphabet — it is schema 4's `<key> on <shape>`
   * identity with the byte-frozen detector's output narrowed by two declared
   * post-filters — so the whole review is once more `predecessorRows` and the
   * report builder is genuinely the same argument rather than a copy of it.
   *
   * ⚠⚠ WHAT MUST NEVER BE CONFUSABLE IS WHICH PREDECESSOR PAIRS WITH WHICH
   * TARGET, so the pairing is a TABLE that every entry point reads, and both
   * halves of the refusal are driven here. A migration that accepted a schema-2
   * predecessor for a schema-5 target would silently re-bank the 2026-08-10
   * genesis inventory as if the two filters had never run.
   */
  test('every leaf target pairs by TABLE, and a schema-2 predecessor cannot reach the live one', () => {
    expect(FILTERED_TARGET_SCHEMA).toBe(5);
    expect(SURFACE_FILTERED_TARGET_SCHEMA).toBe(6);
    expect(BANKED_EXPLAINED_WRITER_TARGET_SCHEMA).toBe(7);
    // ⚠ THE RETIRED TARGET KEEPS ITS NUMBER. A retired constant that a live one
    // can move is not retired, and every recorded reference to "schema 8" would
    // silently start naming something else.
    expect(CORPUS_COVERAGE_TARGET_SCHEMA).toBe(8);
    expect(EPOCH_DARK_CORPUS_TARGET_SCHEMA).toBe(9);
    expect(PROSE_REGEN_TARGET_SCHEMA).toBe(10);
    // ⚠⚠ THE CHAIN IS SINGLE-STEP, PINNED AS AN EXACT TABLE. A skipped rung —
    // 2 → 6, which would re-bank a two-mints-old inventory as if four filters
    // had run — is not expressible, because no such pairing exists.
    expect(LEAF_MIGRATION_PREDECESSOR).toEqual({
      4: 2, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9,
    });
    // The kind is DERIVED from the table, so a target can never name a migration
    // it did not perform.
    expect(heuristicReportOf(heuristicFixture()).kind)
      .toBe('observed-shape-schema-2-to-4-migration');

    const fixture = heuristicFixture();
    const text = predecessorText(fixture.predecessor);
    // ── THE PAIRING REFUSAL, EVERY DIRECTION ─────────────────────────────────
    expect(() => heuristicMigrationReport(
      fixture.predecessor, fixture.legacy, text, FILTERED_TARGET_SCHEMA,
    )).toThrow(/predecessor baseline must be a schema-4 object/);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, fixture.legacy, text, SURFACE_FILTERED_TARGET_SCHEMA,
    )).toThrow(/predecessor baseline must be a schema-5 object/);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, fixture.legacy, text, BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    )).toThrow(/predecessor baseline must be a schema-6 object/);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, fixture.legacy, text, CORPUS_COVERAGE_TARGET_SCHEMA,
    )).toThrow(/predecessor baseline must be a schema-7 object/);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, fixture.legacy, text, EPOCH_DARK_CORPUS_TARGET_SCHEMA,
    )).toThrow(/predecessor baseline must be a schema-8 object/);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, fixture.legacy, text, PROSE_REGEN_TARGET_SCHEMA,
    )).toThrow(/predecessor baseline must be a schema-9 object/);
    // …and a target outside the table is refused by a TOTAL predicate rather
    // than by an enumeration of the numbers somebody thought to forbid.
    // ⚠ THE OUT-OF-TABLE PROBE MOVES UP A RUNG AT EVERY MINT — it was 10 until
    // schema 10 became live. A probe left pointing at a number the table has
    // since adopted stops proving the predicate is total and starts proving
    // nothing at all, while still passing for the wrong reason.
    expect(() => heuristicMigrationReport(fixture.predecessor, fixture.legacy, text, 11))
      .toThrow(/leaf migration target must be 4 or 5 or 6 or 7 or 8 or 9 or 10;/);
    // ⚠ AND OMITTING IT IS THE SAME REFUSAL, WHICH IS WHY THERE IS NO DEFAULT:
    // a defaulted target is the one input in this chain a caller could get wrong
    // silently, and it would decide which migration ran.
    expect(() => heuristicMigrationReport(fixture.predecessor, fixture.legacy, text))
      .toThrow(/leaf migration target must be 4 or 5 or 6 or 7 or 8 or 9 or 10;/);

    // A6 positive arm: one valid schema-6 envelope can advance exactly one rung
    // to 7, retaining the numeric inventory alphabet and reconciliation ledger.
    const predecessorTrees = bankedTransitionTrees();
    const heldArtifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
    ], {
      subjectSha: predecessorScannerSha,
      scannerSha: predecessorScannerSha,
      ...predecessorTrees,
    });
    const predecessor6 = schema6BaselineOf(heldArtifact);
    const targetTrees = bankedTransitionTrees({ current: true });
    const targetArtifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: SUBJECT_SHA,
      scannerSha: SUBJECT_SHA,
      ...targetTrees,
    });
    const report7 = heuristicMigrationReport(
      predecessor6,
      targetArtifact,
      predecessorText(predecessor6),
      BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    );
    expect(report7.kind).toBe('observed-shape-schema-6-to-7-migration');
    expect(report7.inputs.scannerTransitionDigest).toBe(digestOf(report7.scannerTransition));
    expect(report7.scannerTransition.modifiedPaths)
      .toEqual(BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS);
    expect(report7.scannerTransition.unchangedPaths).toHaveLength(7);
    expect(report7.summary).toEqual({
      predecessorSame: 1,
      predecessorDecreased: 0,
      predecessorGone: 0,
      predecessorIncreased: 0,
      predecessorNew: 1,
    });
    expect(report7.conservation).toMatchObject({
      predecessorIdentities: 1,
      predecessorCount: 1,
      targetIdentities: 2,
      targetCount: 2,
    });
    expect(validateHeuristicMigrationReport(
      report7,
      predecessor6,
      targetArtifact,
      predecessorText(predecessor6),
      BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    )).toBe(report7);

    const readable7 = structuredClone(predecessor6);
    readable7.schema = BANKED_EXPLAINED_WRITER_TARGET_SCHEMA;
    readable7.rowTags = {};
    readable7.digests.rowTags = digestOf(readable7.rowTags);
    expect(validateSchema7Baseline(readable7)).toBe(readable7);
    expect(typeof readable7.inventory['src/probe.js']['held on row']).toBe('number');
    expect(validatePredecessorBaseline(readable7, BANKED_EXPLAINED_WRITER_TARGET_SCHEMA))
      .toEqual(readable7);
    expect(report7.target.inventoryDigest).toBe(targetArtifact.digests.inventory);
    const missingTags = structuredClone(readable7);
    delete missingTags.rowTags;
    delete missingTags.digests.rowTags;
    expect(() => validatePredecessorBaseline(
      missingTags, BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    )).toThrow(/noncanonical fields/);

    const review7 = acceptedReview(report7);
    const transitionDecision = review7.decisions.find((decision) => (
      decision.subject === 'scanner-transition'
    ));
    expect(transitionDecision.rowId)
      .toBe(`osr-scanner-transition-v1:${report7.inputs.scannerTransitionDigest}`);
    expect(review7.bindings.scannerTransitionDigest)
      .toBe(report7.inputs.scannerTransitionDigest);
    const pendingTransition = structuredClone(review7);
    pendingTransition.decisions = pendingTransition.decisions.map((decision) => (
      decision.subject === 'scanner-transition'
        ? { ...decision, decision: 'pending' }
        : decision
    ));
    expect(() => validateReviewLedger(pendingTransition, report7)).toThrow(/not accepted/);
    const bundle7 = migrationBundleOf({
      predecessorBaseline: predecessor6,
      predecessorBaselineText: predecessorText(predecessor6),
      legacyArtifact: targetArtifact,
      currentArtifact: targetArtifact,
      report: report7,
      review: review7,
    });
    expect(validateMigrationBundle(bundle7)).toMatchObject({
      targetInventoryDigest: targetArtifact.digests.inventory,
      subjectSha: SUBJECT_SHA,
    });

    const reportFor = (artifact, predecessor = predecessor6) => heuristicMigrationReport(
      predecessor,
      artifact,
      predecessorText(predecessor),
      BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    );
    const targetWith = (treeOverrides = {}, artifactOverrides = {}) => legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: SUBJECT_SHA,
      scannerSha: SUBJECT_SHA,
      ...treeOverrides,
      ...artifactOverrides,
    });

    const threeChanges = bankedTransitionTrees({
      current: true,
      changedPaths: BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS.slice(1),
    });
    expect(() => reportFor(targetWith(threeChanges))).toThrow(/must modify exactly/);

    const fifthPath = 'scripts/lib/observed-shape-governance.mjs';
    const fiveChanges = bankedTransitionTrees({
      current: true,
      changedPaths: [...BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS, fifthPath],
    });
    expect(() => reportFor(targetWith(fiveChanges))).toThrow(/must modify exactly/);

    const modeChanged = bankedTransitionTrees({
      current: true,
      entryOverrides: { 'package.json': { mode: '100755' } },
    });
    expect(() => reportFor(targetWith(modeChanged))).toThrow(/file type or mode/);

    const forgedSizeOnly = bankedTransitionTrees({
      current: true,
      entryOverrides: { 'package.json': { sha256: HASH_A, size: 2 } },
    });
    expect(() => reportFor(targetWith(forgedSizeOnly))).toThrow(/does not change content/);

    const extraInput = bankedTransitionTrees({
      current: true,
      inputPaths: [...BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS, 'scripts/extra.mjs'],
    });
    expect(() => reportFor(targetWith(extraInput))).toThrow(/exact governed 11-input/);

    const movedUnscanned = bankedTransitionTrees({
      current: true,
      unscannedEntry: entry('src/unscanned.json', HASH_B),
    });
    expect(() => reportFor(targetWith(movedUnscanned))).toThrow(/changes unscanned governed source inputs/);

    expect(() => reportFor(targetWith(targetTrees, {
      subjectSha: predecessorScannerSha,
      scannerSha: predecessorScannerSha,
    }))).toThrow(/fresh committed scanner SHA/);

    const nonGenesis = structuredClone(predecessor6);
    nonGenesis.frozenAtSha = 'd'.repeat(40);
    expect(() => reportFor(targetArtifact, nonGenesis)).toThrow(/requires the immutable schema-6 migration genesis/);

    // A6 live arm: schema 7 is readable but retired, and advances exactly one
    // rung to schema 8 through the corpus/check/baseline/migrate transition.
    const schema7ScannerSha = 'd'.repeat(40);
    const schema8ScannerSha = 'e'.repeat(40);
    const schema7Trees = corpusCoverageTransitionTrees();
    const schema7Artifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: schema7ScannerSha,
      scannerSha: schema7ScannerSha,
      ...schema7Trees,
    });
    const predecessor7 = schema7BaselineOf(schema7Artifact);
    expect(validatePredecessorBaseline(
      predecessor7, BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    )).toEqual(predecessor7);

    const schema8Trees = corpusCoverageTransitionTrees({ current: true });
    const schema8Artifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: schema8ScannerSha,
      scannerSha: schema8ScannerSha,
      ...schema8Trees,
    });
    const report8 = heuristicMigrationReport(
      predecessor7,
      schema8Artifact,
      predecessorText(predecessor7),
      CORPUS_COVERAGE_TARGET_SCHEMA,
    );
    expect(report8.kind).toBe('observed-shape-schema-7-to-8-migration');
    expect(report8.inputs.scannerTransitionDigest).toBe(digestOf(report8.scannerTransition));
    expect(report8.scannerTransition).toMatchObject({
      predecessorSchema: BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
      targetSchema: CORPUS_COVERAGE_TARGET_SCHEMA,
      modifiedPaths: CORPUS_COVERAGE_SCANNER_DELTA_PATHS,
    });
    expect(report8.scannerTransition.unchangedPaths).toHaveLength(7);
    expect([...report8.scannerTransition.modifiedPaths, ...report8.scannerTransition.unchangedPaths].sort())
      .toEqual(BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS);
    expect(report8.scannerTransition.predecessor.unscannedInputDigest)
      .toBe(report8.scannerTransition.current.unscannedInputDigest);
    expect(report8.summary).toEqual({
      predecessorSame: 2,
      predecessorDecreased: 0,
      predecessorGone: 0,
      predecessorIncreased: 0,
      predecessorNew: 0,
    });
    expect(report8.predecessorRows.every((row) => row.reconciliation === 'same'))
      .toBe(true);
    expect(canonicalJson(predecessor7.inventory))
      .toBe(canonicalJson(schema8Artifact.inventory));
    expect(validateHeuristicMigrationReport(
      report8,
      predecessor7,
      schema8Artifact,
      predecessorText(predecessor7),
      CORPUS_COVERAGE_TARGET_SCHEMA,
    )).toBe(report8);

    const readable8 = structuredClone(predecessor7);
    readable8.schema = CORPUS_COVERAGE_TARGET_SCHEMA;
    expect(validateSchema8Baseline(readable8)).toBe(readable8);
    expect(() => validateSchema7Baseline(readable8)).toThrow(/is not schema 7/);

    const review8 = acceptedReview(report8);
    expect(review8.decisions.filter((decision) => decision.subject === 'scanner-transition'))
      .toHaveLength(1);
    const bundle8 = migrationBundleOf({
      predecessorBaseline: predecessor7,
      predecessorBaselineText: predecessorText(predecessor7),
      legacyArtifact: schema8Artifact,
      currentArtifact: schema8Artifact,
      report: report8,
      review: review8,
    });
    expect(validateMigrationBundle(bundle8)).toMatchObject({
      targetInventoryDigest: schema8Artifact.digests.inventory,
      subjectSha: schema8ScannerSha,
    });

    const reportFor8 = (artifact, predecessor = predecessor7) => heuristicMigrationReport(
      predecessor,
      artifact,
      predecessorText(predecessor),
      CORPUS_COVERAGE_TARGET_SCHEMA,
    );
    const targetWith8 = (treeOverrides = {}, artifactOverrides = {}) => legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: schema8ScannerSha,
      scannerSha: schema8ScannerSha,
      ...treeOverrides,
      ...artifactOverrides,
    });

    const schema8ArtifactWith = (findings) => legacyArtifact(findings, {
      subjectSha: schema8ScannerSha,
      scannerSha: schema8ScannerSha,
      ...schema8Trees,
    });
    expect(() => reportFor8(schema8ArtifactWith([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
      oldFinding(50, 500, 'covered', 'row'),
    ]))).toThrow(/byte-identical, same-only.*"new":1/);
    expect(() => reportFor8(schema8ArtifactWith([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(20, 200, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ]))).toThrow(/byte-identical, same-only.*"increased":1/);
    expect(() => reportFor8(schema8ArtifactWith([
      oldFinding(10, 100, 'held', 'row'),
    ]))).toThrow(/byte-identical, same-only.*"gone":1/);
    const repeatedSchema7Artifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(20, 200, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: schema7ScannerSha,
      scannerSha: schema7ScannerSha,
      ...schema7Trees,
    });
    expect(() => reportFor8(
      schema8Artifact,
      schema7BaselineOf(repeatedSchema7Artifact),
    )).toThrow(/byte-identical, same-only.*"decreased":1/);

    const threeCorpusChanges = corpusCoverageTransitionTrees({
      current: true,
      changedPaths: CORPUS_COVERAGE_SCANNER_DELTA_PATHS.slice(1),
    });
    expect(() => reportFor8(targetWith8(threeCorpusChanges))).toThrow(/must modify exactly/);

    const fiveCorpusChanges = corpusCoverageTransitionTrees({
      current: true,
      changedPaths: [...CORPUS_COVERAGE_SCANNER_DELTA_PATHS, fifthPath],
    });
    expect(() => reportFor8(targetWith8(fiveCorpusChanges))).toThrow(/must modify exactly/);

    const corpusModeChanged = corpusCoverageTransitionTrees({
      current: true,
      entryOverrides: { 'scripts/lib/observed-shape-corpus.mjs': { mode: '100755' } },
    });
    expect(() => reportFor8(targetWith8(corpusModeChanged))).toThrow(/file type or mode/);

    const corpusSizeOnly = corpusCoverageTransitionTrees({
      current: true,
      entryOverrides: {
        'scripts/check-observed-shape-readers.mjs': { sha256: HASH_B, size: 2 },
      },
    });
    expect(() => reportFor8(targetWith8(corpusSizeOnly))).toThrow(/does not change content/);

    const corpusExtraInput = corpusCoverageTransitionTrees({
      current: true,
      inputPaths: [...BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS, 'scripts/extra.mjs'],
    });
    expect(() => reportFor8(targetWith8(corpusExtraInput))).toThrow(/exact governed 11-input/);

    const corpusMovedUnscanned = corpusCoverageTransitionTrees({
      current: true,
      unscannedEntry: entry('src/unscanned.json', HASH_B),
    });
    expect(() => reportFor8(targetWith8(corpusMovedUnscanned)))
      .toThrow(/changes unscanned governed source inputs/);

    expect(() => reportFor8(targetWith8(schema8Trees, {
      subjectSha: schema7ScannerSha,
      scannerSha: schema7ScannerSha,
    }))).toThrow(/fresh committed scanner SHA/);

    const nonGenesis7 = structuredClone(predecessor7);
    nonGenesis7.frozenAtSha = 'f'.repeat(40);
    expect(() => reportFor8(schema8Artifact, nonGenesis7))
      .toThrow(/requires the immutable schema-7 migration genesis/);

    /* ══ A6 LIVE ARM — THE 8→9 RUNG ════════════════════════════════════════
     * Two things make this target the first that is not a straight repeat of
     * its predecessor, and both were latent DEFECTS of the transition law
     * rather than design:
     *   · the delta is FIVE governed paths, so the retained count is 6. The law
     *     used to hard-code "exactly seven", which silently assumed every future
     *     mint changes exactly four inputs.
     *   · the UNSCANNED governed source inputs moved. The law used to refuse
     *     that outright with no review path, which — since the movement's cause
     *     is a landed generated-source re-record that cannot be un-landed —
     *     made the instrument un-mintable and therefore permanently dark.
     * The movement is now RECORDED BY NAMED PATH for target 9 only; the
     * refusals still standing at targets 7 and 8 above are the paired controls
     * proving it is per-target and never retroactive.
     */
    const epochDarkPredecessorSha = '7'.repeat(40);
    const epochDarkTargetSha = '9'.repeat(40);
    const epochDarkPredecessorTrees = epochDarkTransitionTrees();
    const epochDarkPredecessorArtifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: epochDarkPredecessorSha,
      scannerSha: epochDarkPredecessorSha,
      ...epochDarkPredecessorTrees,
    });
    const predecessor8 = schema8BaselineOf(epochDarkPredecessorArtifact);
    expect(validatePredecessorBaseline(predecessor8, CORPUS_COVERAGE_TARGET_SCHEMA))
      .toEqual(predecessor8);

    const movedUnscannedEntry = entry('src/unscanned.json', HASH_B);
    const epochDarkTargetTrees = epochDarkTransitionTrees({
      current: true, unscannedEntry: movedUnscannedEntry,
    });
    const epochDarkTargetArtifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: epochDarkTargetSha,
      scannerSha: epochDarkTargetSha,
      ...epochDarkTargetTrees,
    });
    const report9 = heuristicMigrationReport(
      predecessor8,
      epochDarkTargetArtifact,
      predecessorText(predecessor8),
      EPOCH_DARK_CORPUS_TARGET_SCHEMA,
    );
    expect(report9.kind).toBe('observed-shape-schema-8-to-9-migration');
    expect(report9.inputs.scannerTransitionDigest).toBe(digestOf(report9.scannerTransition));
    expect(report9.scannerTransition).toMatchObject({
      predecessorSchema: CORPUS_COVERAGE_TARGET_SCHEMA,
      targetSchema: EPOCH_DARK_CORPUS_TARGET_SCHEMA,
      modifiedPaths: EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS,
    });
    expect(report9.scannerTransition.modifiedPaths).toHaveLength(5);
    // ⚠ SIX, NOT SEVEN — the generalised retained count, derived from this
    // target's own eleven-input universe minus its own five-path delta.
    expect(report9.scannerTransition.unchangedPaths).toHaveLength(6);
    expect([...report9.scannerTransition.modifiedPaths,
      ...report9.scannerTransition.unchangedPaths].sort())
      .toEqual(BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS);

    // ── THE REVIEWABLE UNSCANNED MOVEMENT, BY NAMED PATH ────────────────────
    expect(report9.scannerTransition.predecessor.unscannedInputDigest)
      .not.toBe(report9.scannerTransition.current.unscannedInputDigest);
    expect(report9.scannerTransition.unscannedMovement).toEqual({
      added: [],
      removed: [],
      modified: ['src/unscanned.json'],
      changedPaths: ['src/unscanned.json'],
    });
    // A digest inequality is not reviewable; a NAMED FILE is. The issue the
    // ledger must discharge says which file moved, in its own field and in the
    // human-facing message.
    const transitionIssue = report9.issues
      .find((issue) => issue.reconciliation === 'scanner-transition');
    expect(transitionIssue.unscannedPaths).toEqual(['src/unscanned.json']);
    expect(transitionIssue.message).toContain('src/unscanned.json');
    expect(transitionIssue.message).toContain('UNSCANNED');

    // ⚠ THE FIELD IS PRESENT ONLY WHEN SOMETHING ACTUALLY MOVED. An always-on
    // record would make "unscanned inputs were reviewed" true of a transition
    // where nothing moved, which is how a review becomes decoration.
    const stillUnscanned = heuristicMigrationReport(
      predecessor8,
      legacyArtifact([
        oldFinding(10, 100, 'held', 'row'),
        oldFinding(40, 400, 'arrived', 'row'),
      ], {
        subjectSha: epochDarkTargetSha,
        scannerSha: epochDarkTargetSha,
        ...epochDarkTransitionTrees({ current: true }),
      }),
      predecessorText(predecessor8),
      EPOCH_DARK_CORPUS_TARGET_SCHEMA,
    );
    expect(stillUnscanned.scannerTransition.unscannedMovement).toBeUndefined();
    expect(stillUnscanned.issues
      .find((issue) => issue.reconciliation === 'scanner-transition').unscannedPaths)
      .toBeUndefined();
    expect(stillUnscanned.scannerTransition.predecessor.unscannedInputDigest)
      .toBe(stillUnscanned.scannerTransition.current.unscannedInputDigest);

    // ⭐ SCHEMA 9 HAS NO SAME-ONLY INVENTORY INVARIANT, AND THAT ABSENCE IS
    // DELIBERATE — the mint is cut at a later tip than its inventory was
    // measured at, so a landed repair may legitimately move a row and each one
    // is reconciled by its own reviewed decision. The schema-8 refusals above
    // are the paired control that the invariant still binds where it was ruled.
    const movedInventory = heuristicMigrationReport(
      predecessor8,
      legacyArtifact([
        oldFinding(10, 100, 'held', 'row'),
        oldFinding(40, 400, 'arrived', 'row'),
        oldFinding(50, 500, 'covered', 'row'),
      ], {
        subjectSha: epochDarkTargetSha,
        scannerSha: epochDarkTargetSha,
        ...epochDarkTargetTrees,
      }),
      predecessorText(predecessor8),
      EPOCH_DARK_CORPUS_TARGET_SCHEMA,
    );
    expect(movedInventory.summary.predecessorNew).toBe(1);
    expect(movedInventory.issues.filter((issue) => issue.reconciliation === 'new'))
      .toHaveLength(1);

    const readable9 = structuredClone(predecessor8);
    readable9.schema = EPOCH_DARK_CORPUS_TARGET_SCHEMA;
    expect(validateSchema9Baseline(readable9)).toBe(readable9);
    expect(() => validateSchema8Baseline(readable9)).toThrow(/is not schema 8/);

    const review9 = acceptedReview(report9);
    expect(review9.decisions.filter((decision) => decision.subject === 'scanner-transition'))
      .toHaveLength(1);
    const bundle9 = migrationBundleOf({
      predecessorBaseline: predecessor8,
      predecessorBaselineText: predecessorText(predecessor8),
      legacyArtifact: epochDarkTargetArtifact,
      currentArtifact: epochDarkTargetArtifact,
      report: report9,
      review: review9,
    });
    expect(validateMigrationBundle(bundle9)).toMatchObject({
      targetInventoryDigest: epochDarkTargetArtifact.digests.inventory,
      subjectSha: epochDarkTargetSha,
    });

    const reportFor9 = (artifact, predecessor = predecessor8) => heuristicMigrationReport(
      predecessor,
      artifact,
      predecessorText(predecessor),
      EPOCH_DARK_CORPUS_TARGET_SCHEMA,
    );
    const targetWith9 = (treeOverrides = {}, artifactOverrides = {}) => legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: epochDarkTargetSha,
      scannerSha: epochDarkTargetSha,
      ...treeOverrides,
      ...artifactOverrides,
    });
    expect(() => reportFor9(targetWith9(epochDarkTransitionTrees({
      current: true,
      unscannedEntry: movedUnscannedEntry,
      changedPaths: EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS.slice(1),
    })))).toThrow(/must modify exactly/);
    expect(() => reportFor9(targetWith9(epochDarkTransitionTrees({
      current: true,
      unscannedEntry: movedUnscannedEntry,
      changedPaths: [...EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS, fifthPath],
    })))).toThrow(/must modify exactly/);
    expect(() => reportFor9(targetWith9(epochDarkTransitionTrees({
      current: true,
      unscannedEntry: movedUnscannedEntry,
      inputPaths: [...BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS, 'scripts/extra.mjs'],
    })))).toThrow(/exact governed 11-input/);
    expect(() => reportFor9(targetWith9(epochDarkTargetTrees, {
      subjectSha: epochDarkPredecessorSha,
      scannerSha: epochDarkPredecessorSha,
    }))).toThrow(/fresh committed scanner SHA/);

    const nonGenesis8 = structuredClone(predecessor8);
    nonGenesis8.frozenAtSha = 'c'.repeat(40);
    expect(() => reportFor9(epochDarkTargetArtifact, nonGenesis8))
      .toThrow(/requires the immutable schema-8 migration genesis/);

    /* ══ A6 LIVE ARM — THE 9→10 RUNG ═══════════════════════════════════════
     * ⭐ THIS RUNG IS THE PROOF THAT THE 8→9 GENERALISATIONS WERE LAWS AND NOT
     * ACCOMMODATIONS, and it is worth more than a repeat of its predecessor for
     * one reason: it exercises both of them AT DIFFERENT VALUES.
     *   · the delta is FOUR governed paths, so the retained count is SEVEN.
     *     Target 9's was five and six. A hard-coded retained count could have
     *     matched either but not both, so the pair is what convicts a literal.
     *   · the UNSCANNED movement is reviewable AGAIN, at a second target,
     *     declared in target 10's own entry rather than inherited — the class
     *     recurred within nine commits of the schema-9 freeze.
     * The targets 7 and 8 refusals above remain the paired controls proving
     * reviewability is per-target and never retroactive.
     */
    // ⚠ NOT 'a' — that is this file's own SUBJECT_SHA, and a fixture SHA that
    // collides with an unrelated constant makes a later "fresh scanner SHA"
    // refusal pass or fail for a reason that has nothing to do with this rung.
    const proseRegenTargetSha = 'e'.repeat(40);
    const proseRegenPredecessorArtifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: epochDarkTargetSha,
      scannerSha: epochDarkTargetSha,
      ...proseRegenTransitionTrees(),
    });
    const predecessor9 = schema9BaselineOf(proseRegenPredecessorArtifact);
    expect(validatePredecessorBaseline(predecessor9, EPOCH_DARK_CORPUS_TARGET_SCHEMA))
      .toEqual(predecessor9);

    const proseRegenTargetTrees = proseRegenTransitionTrees({
      current: true, unscannedEntry: movedUnscannedEntry,
    });
    const proseRegenTargetArtifact = legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: proseRegenTargetSha,
      scannerSha: proseRegenTargetSha,
      ...proseRegenTargetTrees,
    });
    const report10 = heuristicMigrationReport(
      predecessor9,
      proseRegenTargetArtifact,
      predecessorText(predecessor9),
      PROSE_REGEN_TARGET_SCHEMA,
    );
    expect(report10.kind).toBe('observed-shape-schema-9-to-10-migration');
    expect(report10.inputs.scannerTransitionDigest).toBe(digestOf(report10.scannerTransition));
    expect(report10.scannerTransition).toMatchObject({
      predecessorSchema: EPOCH_DARK_CORPUS_TARGET_SCHEMA,
      targetSchema: PROSE_REGEN_TARGET_SCHEMA,
      modifiedPaths: PROSE_REGEN_SCANNER_DELTA_PATHS,
    });
    // ⚠⚠ FOUR AND SEVEN, AGAINST TARGET 9'S FIVE AND SIX. Read together these
    // two arms are what makes the derived retained count a measurement instead
    // of a coincidence that happened to match one mint.
    expect(report10.scannerTransition.modifiedPaths).toHaveLength(4);
    expect(report10.scannerTransition.unchangedPaths).toHaveLength(7);
    expect(report9.scannerTransition.unchangedPaths).not
      .toHaveLength(report10.scannerTransition.unchangedPaths.length);
    expect([...report10.scannerTransition.modifiedPaths,
      ...report10.scannerTransition.unchangedPaths].sort())
      .toEqual(BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS);

    // ── THE REVIEWABLE UNSCANNED MOVEMENT, BY NAMED PATH, AT A SECOND TARGET ─
    expect(report10.scannerTransition.predecessor.unscannedInputDigest)
      .not.toBe(report10.scannerTransition.current.unscannedInputDigest);
    expect(report10.scannerTransition.unscannedMovement).toEqual({
      added: [],
      removed: [],
      modified: ['src/unscanned.json'],
      changedPaths: ['src/unscanned.json'],
    });
    const transitionIssue10 = report10.issues
      .find((issue) => issue.reconciliation === 'scanner-transition');
    expect(transitionIssue10.unscannedPaths).toEqual(['src/unscanned.json']);
    expect(transitionIssue10.message).toContain('src/unscanned.json');

    // ⚠ AND THE FIELD IS STILL ABSENT WHEN NOTHING MOVED — the anti-decoration
    // control, re-run at this target rather than assumed to carry over.
    const stillUnscanned10 = heuristicMigrationReport(
      predecessor9,
      legacyArtifact([
        oldFinding(10, 100, 'held', 'row'),
        oldFinding(40, 400, 'arrived', 'row'),
      ], {
        subjectSha: proseRegenTargetSha,
        scannerSha: proseRegenTargetSha,
        ...proseRegenTransitionTrees({ current: true }),
      }),
      predecessorText(predecessor9),
      PROSE_REGEN_TARGET_SCHEMA,
    );
    expect(stillUnscanned10.scannerTransition.unscannedMovement).toBeUndefined();

    const readable10 = structuredClone(predecessor9);
    readable10.schema = PROSE_REGEN_TARGET_SCHEMA;
    expect(validateSchema10Baseline(readable10)).toBe(readable10);
    expect(() => validateSchema9Baseline(readable10)).toThrow(/is not schema 9/);

    const reportFor10 = (artifact, predecessor = predecessor9) => heuristicMigrationReport(
      predecessor,
      artifact,
      predecessorText(predecessor),
      PROSE_REGEN_TARGET_SCHEMA,
    );
    const targetWith10 = (treeOverrides = {}, artifactOverrides = {}) => legacyArtifact([
      oldFinding(10, 100, 'held', 'row'),
      oldFinding(40, 400, 'arrived', 'row'),
    ], {
      subjectSha: proseRegenTargetSha,
      scannerSha: proseRegenTargetSha,
      ...treeOverrides,
      ...artifactOverrides,
    });
    expect(() => reportFor10(targetWith10(proseRegenTransitionTrees({
      current: true,
      unscannedEntry: movedUnscannedEntry,
      changedPaths: PROSE_REGEN_SCANNER_DELTA_PATHS.slice(1),
    })))).toThrow(/must modify exactly/);
    expect(() => reportFor10(targetWith10(proseRegenTransitionTrees({
      current: true,
      unscannedEntry: movedUnscannedEntry,
      changedPaths: [...PROSE_REGEN_SCANNER_DELTA_PATHS, fifthPath],
    })))).toThrow(/must modify exactly/);
    expect(() => reportFor10(targetWith10(proseRegenTransitionTrees({
      current: true,
      unscannedEntry: movedUnscannedEntry,
      inputPaths: [...BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS, 'scripts/extra.mjs'],
    })))).toThrow(/exact governed 11-input/);
    expect(() => reportFor10(targetWith10(proseRegenTargetTrees, {
      subjectSha: epochDarkTargetSha,
      scannerSha: epochDarkTargetSha,
    }))).toThrow(/fresh committed scanner SHA/);

    const nonGenesis9 = structuredClone(predecessor9);
    nonGenesis9.frozenAtSha = 'd'.repeat(40);
    expect(() => reportFor10(proseRegenTargetArtifact, nonGenesis9))
      .toThrow(/requires the immutable schema-9 migration genesis/);
  });
});
