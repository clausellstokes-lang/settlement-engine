import { describe, expect, test } from 'vitest';
import {
  chmodSync, mkdtempSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { run } from '../../scripts/check-observed-shape-readers.mjs';
import {
  assertBaselineRow,
  BASELINE_SCHEMA,
  parseLeafBaselineIdentity,
  RETIRED_EXACT_BASELINE_SCHEMA,
  validateSchema3Baseline,
  RETIRED_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
  validateSchema4Baseline,
  validateSchema5Baseline,
  validateSchema6Baseline,
  validateSchema7Baseline,
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

  test('the RETIRED exact definition still names schema 3, and refuses the live schema', () => {
    expect(RETIRED_EXACT_BASELINE_SCHEMA).toBe(3);
    expect(BASELINE_SCHEMA).toBe(7);
    expect(RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA).toBe(4);
    expect(RETIRED_FILTERED_LEAF_BASELINE_SCHEMA).toBe(5);
    // ⚠⚠ A RETIRED DEFINITION THAT THE LIVE ONE CAN MOVE IS NOT RETIRED. If the
    // schema-3 validator ever picked up `BASELINE_SCHEMA` again, every recorded
    // schema-3 reference would silently start meaning something else.
    const promoted = mutateBaseline((baseline) => { baseline.schema = BASELINE_SCHEMA; });
    expect(() => validateSchema3Baseline(promoted)).toThrow(/not schema 3/);
  });
});

/* ══ SCHEMA 6 — THE RETIRED NUMERIC HEURISTIC-LEAF ENVELOPE ═══════════════ */

const LEAF_IDENTITY = 'ghost on record';

function validSchema4Baseline() {
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
  // MULTIPLICITY 3 on purpose: schema 3's `count === 1` law must be visibly gone,
  // and a fixture stuck at 1 could not tell the two laws apart.
  const inventory = { 'src/probe.js': { [LEAF_IDENTITY]: 3 } };
  const scanStats = { files: 1, reads: 5, resolved: 3, unresolved: 2 };
  const sentinel = { usableShapes: 1, totalKeys: 1, resolvedReads: 3 };
  const corpusMeta = { generations: 1 };
  const legacyAlgorithm = governedLegacyAlgorithmOf(detectorTree);
  const legacyScannerToolDigest = scannerToolDigestOf({
    scannerSha: SHA,
    detectorTreeDigest: detectorTree.digest,
    legacyAlgorithm,
  });
  const migrationReview = {
    bundleDigest: '1'.repeat(64),
    reportDigest: '2'.repeat(64),
    reviewDigest: '3'.repeat(64),
    predecessorBaselineDigest: '4'.repeat(64),
    predecessorBaselineTextSha256: '5'.repeat(64),
    predecessorInventoryDigest: 'e'.repeat(64),
    legacyArtifactDigest: '6'.repeat(64),
    currentArtifactDigest: '6'.repeat(64),
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
    legacyScannerToolDigest,
    currentScannerSha: SHA,
    currentDetectorDigest: detectorTree.digest,
    currentScannerToolDigest: legacyScannerToolDigest,
  };
  return {
    _doc: ['test fixture'],
    schema: RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA,
    frozen: '2026-08-10',
    frozenAtSha: SHA,
    minRows: 40,
    originMinRows: 8,
    corpusMeta,
    scanStats,
    sentinel,
    total: 3,
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

function mutateSchema4(mutator) {
  const baseline = validSchema4Baseline();
  mutator(baseline);
  baseline.digests.inventory = digestOf(baseline.inventory);
  baseline.digests.sentinel = digestOf(baseline.sentinel);
  baseline.digests.scanStats = digestOf(baseline.scanStats);
  baseline.digests.manifests = digestOf(baseline.manifests);
  if (baseline.migrationReview) {
    baseline.digests.migrationReview = digestOf(baseline.migrationReview);
  }
  if (baseline.rowTags) baseline.digests.rowTags = digestOf(baseline.rowTags);
  return baseline;
}

function validSchema7Baseline() {
  const baseline = validSchema4Baseline();
  baseline.schema = BASELINE_SCHEMA;
  baseline.rowTags = {
    'src/probe.js': {
      [LEAF_IDENTITY]: { reason: 'CR-H26 test ruling', rule: 'explained-writer' },
    },
  };
  baseline.digests.rowTags = digestOf(baseline.rowTags);
  return baseline;
}

function mutateSchema7(mutator) {
  const baseline = validSchema7Baseline();
  mutator(baseline);
  baseline.digests.inventory = digestOf(baseline.inventory);
  baseline.digests.rowTags = digestOf(baseline.rowTags);
  baseline.digests.sentinel = digestOf(baseline.sentinel);
  baseline.digests.scanStats = digestOf(baseline.scanStats);
  baseline.digests.manifests = digestOf(baseline.manifests);
  if (baseline.migrationReview) {
    baseline.digests.migrationReview = digestOf(baseline.migrationReview);
  }
  return baseline;
}

describe('observed-shape schema-6 baseline envelope', () => {
  test('accepts one canonical, governed, heuristic-leaf inventory WITH multiplicity', () => {
    const baseline = validSchema4Baseline();
    expect(validateSchema6Baseline(baseline)).toBe(baseline);
    // The count law genuinely moved: schema 3 would refuse this exact row.
    expect(baseline.inventory['src/probe.js'][LEAF_IDENTITY]).toBe(3);
    expect(baseline.total).not.toBe(baseline.identities);
    // ⚠⚠ SCHEMAS 4, 5 AND 6 SHARE THIS ENVELOPE LAW AND NOTHING ELSE. They are
    // the same 16 keys, the same identity grammar and the same receipt — only the
    // finding-set PRODUCER differs — so one validator serves all three and the
    // NUMBER is the argument. That is exactly why the number must be pinned in
    // EVERY direction: a shared law with an unpinned number is a schema that can
    // drift into meaning one of its predecessors.
    expect(() => validateSchema4Baseline(baseline)).toThrow(/is not schema 4/);
    expect(() => validateSchema5Baseline(baseline)).toThrow(/is not schema 5/);
    const unfiltered = { ...baseline, schema: RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA };
    expect(validateSchema4Baseline(unfiltered)).toBe(unfiltered);
    expect(() => validateSchema5Baseline(unfiltered)).toThrow(/is not schema 5/);
    expect(() => validateSchema6Baseline(unfiltered)).toThrow(/is not schema 6/);
    const filtered = { ...baseline, schema: RETIRED_FILTERED_LEAF_BASELINE_SCHEMA };
    expect(validateSchema5Baseline(filtered)).toBe(filtered);
    expect(() => validateSchema4Baseline(filtered)).toThrow(/is not schema 4/);
    expect(() => validateSchema6Baseline(filtered)).toThrow(/is not schema 6/);
  });

  test('⭐ CR-OSR-FREEZE-8: ONE row law, and both consumers reach the same home', () => {
    // `assertBaselineRow` is the single definition; `rowOf` in the gate script
    // delegates to it, and the envelope validator calls it per file. A change
    // here therefore cannot leave a stale twin behind.
    expect(assertBaselineRow({ [LEAF_IDENTITY]: 4 }, 'src/x.js')).toEqual({ [LEAF_IDENTITY]: 4 });
    expect(() => assertBaselineRow(10, 'src/x.js')).toThrow(/RETIRED count-only form/);
    expect(() => assertBaselineRow([], 'src/x.js')).toThrow(/RETIRED count-only form/);
    expect(() => assertBaselineRow({}, 'src/x.js')).toThrow(/is empty/);
    expect(() => assertBaselineRow({ [LEAF_IDENTITY]: 0 }, 'src/x.js'))
      .toThrow(/positive safe integer/);
    expect(() => assertBaselineRow({ [LEAF_IDENTITY]: 1.5 }, 'src/x.js'))
      .toThrow(/positive safe integer/);
    expect(() => assertBaselineRow({ [LEAF_IDENTITY]: '2' }, 'src/x.js'))
      .toThrow(/positive safe integer/);
  });

  test('⚠⚠ the RETIRED exact spelling is refused STRUCTURALLY, not by a blocklist', () => {
    expect(parseLeafBaselineIdentity(LEAF_IDENTITY)).toEqual({ key: 'ghost', shape: 'record' });
    expect(parseLeafBaselineIdentity('id on factions|steadings'))
      .toEqual({ key: 'id', shape: 'factions|steadings' });
    // The exact identity carries interior spaces, so `\S+ on \S+` cannot match
    // it — no list of forbidden substrings is consulted, and none can be
    // forgotten. This is the pin that stops a schema-3 row being read as a leaf
    // row whose "shape" is a truncated origin.
    expect(() => parseLeafBaselineIdentity(IDENTITY)).toThrow(/heuristic identity is malformed/);
    expect(() => parseLeafBaselineIdentity('ghost on record @ root/record'))
      .toThrow(/heuristic identity is malformed/);
    expect(() => parseLeafBaselineIdentity('ghost on')).toThrow(/heuristic identity is malformed/);
    expect(() => parseLeafBaselineIdentity('ghost')).toThrow(/heuristic identity is malformed/);
    expect(() => parseLeafBaselineIdentity('')).toThrow(/nonempty string/);
    expect(() => validateSchema6Baseline(mutateSchema4((baseline) => {
      baseline.inventory['src/probe.js'] = { [IDENTITY]: 1 };
    }))).toThrow(/heuristic identity is malformed/);
  });

  test.each([
    ['a schema-3 envelope', (baseline) => { baseline.schema = RETIRED_EXACT_BASELINE_SCHEMA; }],
    ['missing migration genesis', (baseline) => { delete baseline.migrationReview; }],
    ['string count', (baseline) => { baseline.inventory['src/probe.js'][LEAF_IDENTITY] = '1'; }],
    ['zero count', (baseline) => { baseline.inventory['src/probe.js'][LEAF_IDENTITY] = 0; }],
    ['empty row', (baseline) => { baseline.inventory['src/probe.js'] = {}; }],
    ['traversal file', (baseline) => {
      baseline.inventory['src/../probe.js'] = baseline.inventory['src/probe.js'];
      delete baseline.inventory['src/probe.js'];
    }],
    ['unscanned inventory file', (baseline) => {
      baseline.inventory['src/never-scanned.js'] = { [LEAF_IDENTITY]: 1 };
    }],
    ['inconsistent total', (baseline) => { baseline.total = 2; }],
    ['inconsistent identities', (baseline) => { baseline.identities = 2; }],
    ['zero sentinel floor', (baseline) => { baseline.sentinel.usableShapes = 0; }],
    // ⚠⚠ MODE MIX-UP: an EXACT-origin sentinel/stats record in a schema-4
    // envelope. The key sets are checked EXACTLY, so extra fields fail closed
    // rather than validating on the subset they share.
    ['an exact-origin sentinel record', (baseline) => {
      baseline.sentinel = {
        ...baseline.sentinel, usableOrigins: 1, originKeys: 1, transitions: 1, resolvedOrigins: 1,
      };
    }],
    ['an exact-origin scanStats record', (baseline) => {
      baseline.scanStats = { ...baseline.scanStats, resolvedOrigins: 3, depthTruncations: 0 };
    }],
    ['stats that do not conserve reads', (baseline) => { baseline.scanStats.unresolved = 1; }],
    ['stats disagreeing with the scan tree', (baseline) => { baseline.scanStats.files = 2; }],
    ['short frozen SHA', (baseline) => { baseline.frozenAtSha = 'abcdef1'; }],
    // ⚠⚠ TWO DETECTORS. A schema-4 receipt naming an EXACT-detector tool digest
    // as "current" claims provenance from an instrument that cannot complete a
    // full-tree scan — the exact failure the mint exists to make impossible.
    ['a second (exact) current scanner tool', (baseline) => {
      baseline.migrationReview.currentScannerToolDigest = scannerToolDigestOf({
        scannerSha: SHA,
        detectorTreeDigest: baseline.manifests.detectorTree.digest,
      });
    }],
    ['a second current artifact', (baseline) => {
      baseline.migrationReview.currentArtifactDigest = '7'.repeat(64);
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
    expect(() => validateSchema6Baseline(mutateSchema4(mutator))).toThrow();
  });

  test('integrity-binds every persisted migration receipt field', () => {
    const baseline = validSchema4Baseline();
    baseline.migrationReview.reviewDigest = 'f'.repeat(64);
    expect(() => validateSchema6Baseline(baseline)).toThrow(/migrationReview digest mismatch/);
  });

  test('gate and maintenance write reject a malformed baseline before corpus execution', async () => {
    const malformed = mutateSchema7((baseline) => { delete baseline.migrationReview; });
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

describe('observed-shape schema-7 bank-by-rule envelope', () => {
  test('A5: schemas 4-6 keep numeric inventory and only schema 7 admits sparse rowTags', () => {
    const baseline = validSchema7Baseline();
    expect(validateSchema7Baseline(baseline)).toBe(baseline);
    expect(typeof baseline.inventory['src/probe.js'][LEAF_IDENTITY]).toBe('number');
    for (const [schema, validate] of [
      [RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA, validateSchema4Baseline],
      [RETIRED_FILTERED_LEAF_BASELINE_SCHEMA, validateSchema5Baseline],
      [RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA, validateSchema6Baseline],
    ]) {
      expect(() => validate({ ...baseline, schema })).toThrow(/noncanonical fields/);
    }
  });

  test.each([
    ['missing rowTags', (baseline) => { delete baseline.rowTags; }],
    ['empty per-file row', (baseline) => { baseline.rowTags['src/probe.js'] = {}; }],
    ['orphan identity', (baseline) => {
      baseline.rowTags['src/probe.js']['other on record'] = baseline.rowTags['src/probe.js'][LEAF_IDENTITY];
    }],
    ['orphan file', (baseline) => {
      baseline.rowTags['src/other.js'] = baseline.rowTags['src/probe.js'];
    }],
    ['bad rule', (baseline) => {
      baseline.rowTags['src/probe.js'][LEAF_IDENTITY].rule = 'exempt';
    }],
    ['blank reason', (baseline) => {
      baseline.rowTags['src/probe.js'][LEAF_IDENTITY].reason = ' ';
    }],
    ['multiline reason', (baseline) => {
      baseline.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'first\nsecond';
    }],
    ['too-long reason', (baseline) => {
      baseline.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'x'.repeat(241);
    }],
    ['extra tag field', (baseline) => {
      baseline.rowTags['src/probe.js'][LEAF_IDENTITY].extra = true;
    }],
  ])('A5 fails closed on %s', (_label, mutator) => {
    expect(() => validateSchema7Baseline(mutateSchema7(mutator))).toThrow();
  });

  test('A5 independently integrity-binds the sparse tag map', () => {
    const baseline = validSchema7Baseline();
    baseline.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'changed after signing';
    expect(() => validateSchema7Baseline(baseline)).toThrow(/rowTags digest mismatch/);
  });
});
