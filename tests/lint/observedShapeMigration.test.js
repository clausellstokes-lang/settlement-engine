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
  migrationBundleOf,
  migrationReport,
  migrationReportDigest,
  reviewTemplateOf,
  run as runMigration,
  validateGovernedMigration,
  validateMigrationBundle,
  validateMigrationReport,
  validatePredecessorBaseline,
  validateReviewLedger,
} from '../../scripts/migrate-observed-shape-readers.mjs';

const SUBJECT_SHA = 'a'.repeat(40);
const SCANNER_SHA = 'c'.repeat(40);
const HASH_A = '1'.repeat(64);
const HASH_B = '2'.repeat(64);
const HASH_C = '3'.repeat(64);
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

function entry(path, sha256 = HASH_A) {
  return { path, type: 'file', mode: '100644', size: 1, sha256 };
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
  meta: { seeds: 4, configs: 4, generations: 16, pulseIntervals: 12 },
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
    note: 'reviewed against the exact source site and executed origin',
  }));
  return review;
}

describe('observed-shape schema migration governance', () => {
  test('requires an explicit schema-2 predecessor CLI input', () => {
    expect(() => runMigration([])).toThrow(/--predecessor=<schema-2-baseline\.json>/);
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
    expect(() => validateReviewLedger(acceptedReview(report), report))
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
