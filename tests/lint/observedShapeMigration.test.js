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
  HEURISTIC_TARGET_SCHEMA,
  heuristicMigrationReport,
  migrationBundleOf,
  migrationReport,
  migrationReportDigest,
  RETIRED_EXACT_TARGET_SCHEMA,
  reviewTemplateOf,
  run as runMigration,
  validateGovernedMigration,
  validateHeuristicMigrationReport,
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

  const heuristicReportOf = ({ predecessor, legacy }) => heuristicMigrationReport(
    predecessor,
    legacy,
    predecessorText(predecessor),
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
    )).toBe(first);

    const tampered = structuredClone(first);
    tampered.target.inventoryDigest = 'f'.repeat(64);
    expect(() => validateHeuristicMigrationReport(
      tampered, fixture.predecessor, fixture.legacy, predecessorText(fixture.predecessor),
    )).toThrow(/not the canonical report/);

    // A smuggled site-migration row is refused by conservation, not merely
    // ignored — `validateReviewLedger` would otherwise demand decisions for it.
    const smuggled = structuredClone(first);
    smuggled.rows = [{ rowId: 'osr-migration-row-v1:forged' }];
    expect(() => validateHeuristicMigrationReport(
      smuggled, fixture.predecessor, fixture.legacy, predecessorText(fixture.predecessor),
    )).toThrow(/not the canonical report/);
  });

  test('an EXACT artifact cannot stand in for the governed heuristic detector', () => {
    const fixture = heuristicFixture();
    const exact = currentArtifact([newFinding(10, 100, 'held', 'row', 'root/row')]);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, exact, predecessorText(fixture.predecessor),
    )).toThrow(/validated legacy-leaf\/schema-2 scan artifact/);

    const counterfeit = structuredClone(fixture.legacy);
    counterfeit.legacyAlgorithm.baseSha = 'd'.repeat(40);
    expect(() => heuristicMigrationReport(
      fixture.predecessor, counterfeit, predecessorText(fixture.predecessor),
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

      // No `--current` and no flag: the live heuristic target, and the exact
      // artifact is never even read.
      const report = runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`, `--json=${reportPath}`,
      ]);
      expect(report.target.baselineSchema).toBe(HEURISTIC_TARGET_SCHEMA);
      expect(report.rows).toEqual([]);

      expect(() => runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`,
        `--current=${currentPath}`, `--target-schema=${HEURISTIC_TARGET_SCHEMA}`,
      ])).toThrow(/--current is only valid for the retired/);
      expect(() => runMigration([
        `--predecessor=${predecessorPath}`, `--legacy=${legacyPath}`, '--target-schema=5',
      ])).toThrow(/--target-schema must be 4/);
      expect(() => runMigration([`--predecessor=${predecessorPath}`, '--target-schema=3']))
        .toThrow(/usage:/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
