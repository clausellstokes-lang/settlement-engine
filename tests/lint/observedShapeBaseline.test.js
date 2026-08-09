import { describe, expect, test } from 'vitest';
import {
  chmodSync, mkdtempSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { run } from '../../scripts/check-observed-shape-readers.mjs';
import {
  validateSchema3Baseline,
} from '../../scripts/lib/observed-shape-baseline.mjs';
import {
  digestOf,
  fileManifestOf,
  governedLegacyAlgorithmOf,
  governedLegacyDetectorSha256,
  scannerToolDigestOf,
} from '../../scripts/lib/observed-shape-governance.mjs';

const SHA = '1'.repeat(40);
const HASH = 'a'.repeat(64);
const LEGACY_MODULE_SHA = governedLegacyDetectorSha256();
const SITE = `v2|owner=function%3Aprobe|context=${HASH}|expr=${HASH}|ordinal=0|kind=dot|key=ghost`;
const IDENTITY = `ghost on record @ root%3Arecord # ${SITE}`;

function manifest(paths) {
  const entries = paths.map((path) => ({
    path,
    type: 'file',
    mode: '100644',
    size: path.length,
    sha256: path === 'scripts/lib/legacy-reader-shape-scan.mjs'
      ? LEGACY_MODULE_SHA
      : (path.startsWith('src/') ? 'b'.repeat(64) : 'c'.repeat(64)),
  }));
  return {
    algorithm: 'sha256-canonical-path-type-mode-size-content-v2',
    entries,
    digest: digestOf(entries),
  };
}

function validBaseline() {
  const scanTree = manifest(['src/probe.js']);
  const sourceTree = manifest(['src/probe.js']);
  const detectorTree = manifest([
    'scripts/lib/legacy-reader-shape-scan.mjs',
    'scripts/scanner.mjs',
  ]);
  const executionTree = manifest([
    'scripts/lib/legacy-reader-shape-scan.mjs',
    'scripts/scanner.mjs',
    'src/probe.js',
  ]);
  const manifests = { scanTree, sourceTree, detectorTree, executionTree };
  const inventory = { 'src/probe.js': { [IDENTITY]: 1 } };
  const scanStats = {
    files: 1,
    reads: 2,
    resolved: 1,
    resolvedOrigins: 1,
    unresolved: 1,
    depthTruncations: 0,
    cycleCuts: 0,
    computedRecordUnknown: 0,
    objectValuesRecordUnknown: 0,
  };
  const sentinel = {
    usableShapes: 1,
    totalKeys: 1,
    usableOrigins: 1,
    originKeys: 1,
    transitions: 1,
    resolvedReads: 1,
    resolvedOrigins: 1,
    corpusDepthTruncations: 0,
    resolverDepthTruncations: 0,
    depthTruncations: 0,
    corpusCycleCuts: 0,
    resolverCycleCuts: 0,
    cycleCuts: 0,
  };
  const corpusMeta = { generations: 1 };
  const legacyAlgorithm = governedLegacyAlgorithmOf(detectorTree);
  const migrationReview = {
    bundleDigest: '1'.repeat(64),
    reportDigest: '2'.repeat(64),
    reviewDigest: '3'.repeat(64),
    predecessorBaselineDigest: '4'.repeat(64),
    predecessorBaselineTextSha256: '5'.repeat(64),
    predecessorInventoryDigest: 'e'.repeat(64),
    legacyArtifactDigest: '6'.repeat(64),
    currentArtifactDigest: '7'.repeat(64),
    subjectSha: SHA,
    sourceTreeDigest: sourceTree.digest,
    scanTreeDigest: scanTree.digest,
    executionTreeDigest: executionTree.digest,
    detectorTreeDigest: detectorTree.digest,
    corpusDigest: 'f'.repeat(64),
    scanConfigDigest: digestOf({ corpusGraphSchema: 2, minRows: 40, originMinRows: 8 }),
    targetInventoryDigest: digestOf(inventory),
    currentFindingsDigest: '8'.repeat(64),
    legacyScannerSha: SHA,
    legacyAlgorithmBaseSha: '6e7acc4dd88a43cb608f40bc77db3b2130a1e2de',
    legacyDetectorDigest: detectorTree.digest,
    legacyScannerToolDigest: scannerToolDigestOf({
      scannerSha: SHA,
      detectorTreeDigest: detectorTree.digest,
      legacyAlgorithm,
    }),
    currentScannerSha: SHA,
    currentDetectorDigest: detectorTree.digest,
    currentScannerToolDigest: scannerToolDigestOf({
      scannerSha: SHA,
      detectorTreeDigest: detectorTree.digest,
    }),
  };
  return {
    _doc: ['test fixture'],
    schema: 3,
    frozen: '2026-08-09',
    frozenAtSha: SHA,
    minRows: 40,
    originMinRows: 8,
    corpusMeta,
    scanStats,
    sentinel,
    total: 1,
    identities: 1,
    inventory,
    migrationReview,
    manifests,
    scannerProvenance: {
      scanTreeDigest: scanTree.digest,
      sourceTreeDigest: sourceTree.digest,
      detectorDigest: detectorTree.digest,
      executionTreeDigest: executionTree.digest,
      unscannedInputDigest: digestOf([]),
    },
    digests: {
      corpusMeta: digestOf(corpusMeta),
      scanStats: digestOf(scanStats),
      sentinel: digestOf(sentinel),
      inventory: digestOf(inventory),
      manifests: digestOf(manifests),
      migrationReview: digestOf(migrationReview),
    },
  };
}

function mutateBaseline(mutator) {
  const baseline = validBaseline();
  mutator(baseline);
  // Recompute content digests so each test reaches structural validation rather
  // than failing merely because the attacker forgot to re-sign their edit.
  baseline.digests.inventory = digestOf(baseline.inventory);
  baseline.digests.sentinel = digestOf(baseline.sentinel);
  baseline.digests.scanStats = digestOf(baseline.scanStats);
  baseline.digests.manifests = digestOf(baseline.manifests);
  if (baseline.migrationReview) {
    baseline.digests.migrationReview = digestOf(baseline.migrationReview);
  }
  return baseline;
}

describe('observed-shape schema-3 baseline envelope', () => {
  test('file manifests bind regular-file type, executable mode, size, and bytes', () => {
    const root = mkdtempSync(join(tmpdir(), 'osr-manifest-'));
    const file = join(root, 'scanner.mjs');
    const alias = join(root, 'alias.mjs');
    try {
      writeFileSync(file, 'export default true;\n');
      chmodSync(file, 0o755);
      const manifestValue = fileManifestOf(root, [file]);
      expect(manifestValue.entries).toEqual([expect.objectContaining({
        path: 'scanner.mjs', type: 'file', mode: '100755', size: 21,
      })]);
      symlinkSync(file, alias);
      expect(() => fileManifestOf(root, [alias])).toThrow(/regular file/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('accepts one canonical, singular, migration-born inventory', () => {
    const baseline = validBaseline();
    expect(validateSchema3Baseline(baseline)).toBe(baseline);
  });

  test.each([
    ['missing migration genesis', (baseline) => { delete baseline.migrationReview; }],
    ['string count', (baseline) => { baseline.inventory['src/probe.js'][IDENTITY] = '1'; }],
    ['boolean count', (baseline) => { baseline.inventory['src/probe.js'][IDENTITY] = true; }],
    ['zero count', (baseline) => { baseline.inventory['src/probe.js'][IDENTITY] = 0; }],
    ['count above one', (baseline) => { baseline.inventory['src/probe.js'][IDENTITY] = 2; }],
    ['empty row', (baseline) => { baseline.inventory['src/probe.js'] = {}; }],
    ['traversal file', (baseline) => {
      baseline.inventory['src/../probe.js'] = baseline.inventory['src/probe.js'];
      delete baseline.inventory['src/probe.js'];
    }],
    ['malformed identity', (baseline) => {
      baseline.inventory['src/probe.js'] = { 'ghost on record': 1 };
    }],
    ['site key mismatch', (baseline) => {
      baseline.inventory['src/probe.js'] = { [`other on record @ root%3Arecord # ${SITE}`]: 1 };
    }],
    ['inconsistent total', (baseline) => { baseline.total = 2; }],
    ['inconsistent identities', (baseline) => { baseline.identities = 2; }],
    ['zero sentinel floor', (baseline) => { baseline.sentinel.usableOrigins = 0; }],
    ['string sentinel', (baseline) => { baseline.sentinel.totalKeys = '1'; }],
    ['short frozen SHA', (baseline) => { baseline.frozenAtSha = 'abcdef1'; }],
    ['scanner-tool receipt drift', (baseline) => {
      baseline.migrationReview.currentScannerToolDigest = 'f'.repeat(64);
    }],
    ['legacy scanner-tool receipt drift', (baseline) => {
      baseline.migrationReview.legacyScannerToolDigest = 'f'.repeat(64);
    }],
    ['scan-config receipt drift', (baseline) => {
      baseline.migrationReview.scanConfigDigest = 'f'.repeat(64);
    }],
    ['genesis source-tree receipt drift', (baseline) => {
      baseline.migrationReview.sourceTreeDigest = 'f'.repeat(64);
    }],
    ['genesis target-inventory receipt drift', (baseline) => {
      baseline.migrationReview.targetInventoryDigest = 'f'.repeat(64);
    }],
  ])('fails closed on %s', (_label, mutator) => {
    expect(() => validateSchema3Baseline(mutateBaseline(mutator))).toThrow();
  });

  test('integrity-binds every persisted migration receipt field', () => {
    const baseline = validBaseline();
    baseline.migrationReview.reviewDigest = 'f'.repeat(64);
    expect(() => validateSchema3Baseline(baseline)).toThrow(/migrationReview digest mismatch/);
  });

  test('gate and maintenance write reject malformed schema 3 before corpus execution', async () => {
    const malformed = mutateBaseline((baseline) => { delete baseline.migrationReview; });
    let corpusCalls = 0;
    const overrides = {
      baselineExists: () => true,
      readBaseline: () => malformed,
      corpusFor: async () => { corpusCalls += 1; throw new Error('must not execute'); },
    };
    await expect(run([], overrides)).rejects.toThrow(/noncanonical fields/);
    await expect(run(['--write'], overrides)).rejects.toThrow(/noncanonical fields/);
    expect(corpusCalls).toBe(0);
  });
});
