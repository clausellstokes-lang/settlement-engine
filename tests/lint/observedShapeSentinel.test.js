import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import {
  applyDomGlobalReceiverFilter,
  applyExplainedWriterFilter,
  applyLanguageSurfaceFilter,
  applyShapeFamilyFilter,
  assertDomGlobalReceiverRoots,
  assertExplainedWriterEvidence,
  assertExplainedWriterExemptions,
  assertExplainedWriterRowTags,
  assertExplainedWriterTagTransition,
  assertLanguageSurfaceResidualKeys,
  assertShapeFamilyDebtPreserved,
  authoredInputHistoryCommits,
  BASELINE_SCAN_MODE,
  BASELINE_SCHEMA,
  CLASS_A_PROTECTED_IDENTITIES,
  cohortOf,
  commandOf,
  compare,
  corpusPayloadOf,
  DOM_GLOBAL_RECEIVER_ROOTS,
  domGlobalReceiverOf,
  EXACT_SCAN_EXCLUDED_SCOPE,
  EXPLAINED_WRITER_EXEMPTIONS,
  identityOf,
  isObservedShapeScanPath,
  isObservedShapeSubjectPath,
  LANGUAGE_SURFACE_RESIDUAL_KEYS,
  RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA,
  RETIRED_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
  run,
  SCAN_CONFIG,
  sentinelFailures,
  sentinelOf,
  shapeFamilyUnionOf,
  WRITE_SHAPE_SPELLINGS,
  writeShapesIn,
} from '../../scripts/check-observed-shape-readers.mjs';
import {
  validateSchema4Baseline,
  validateSchema5Baseline,
  validateSchema6Baseline,
  validateSchema7Baseline,
  validateSchema8Baseline,
} from '../../scripts/lib/observed-shape-baseline.mjs';
import {
  artifactBaselineSchemaOf,
  artifactIdentityOf,
  artifactInventoryOf,
  canonicalJson,
  createScanArtifact,
  digestOf,
  governedLegacyAlgorithmOf,
  governedLegacyDetectorSha256,
  scannerToolDigestOf,
  validateScanArtifact,
} from '../../scripts/lib/observed-shape-governance.mjs';

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const LEGACY_MODULE_SHA = governedLegacyDetectorSha256();
const SUBJECT_SHA = '1'.repeat(40);
const MAINTENANCE_SHA = '2'.repeat(40);
const SCANNER_SHA = SUBJECT_SHA;

const siteOf = (key = 'ghost', ordinal = 0) => (
  `v2|owner=function%3Aprobe|context=${HASH_A}|expr=${HASH_B}`
  + `|ordinal=${ordinal}|kind=dot|key=${encodeURIComponent(key)}`
);

const findingOf = (overrides = {}) => ({
  file: 'src/probe.js',
  line: 1,
  pos: 10,
  site: siteOf(),
  key: 'ghost',
  shapes: ['record'],
  origins: ['root/record'],
  text: 'row.ghost',
  ...overrides,
});

/** A HEURISTIC-LEAF finding — the schema-4 authority's own row shape. Six keys
 *  exactly: no `site`, no `origins`. `assertLegacyFinding` refuses either. */
const leafFindingOf = (overrides = {}) => ({
  file: 'src/probe.js',
  line: 1,
  pos: 10,
  key: 'ghost',
  shapes: ['record'],
  text: 'row.ghost',
  ...overrides,
});

const leafStats = (overrides = {}) => ({
  files: 1, reads: 2, resolved: 1, unresolved: 1, ...overrides,
});

const corpusWithTelemetry = (meta) => ({
  shapes: {},
  graph: { origins: {}, meta: { transitions: 0, ...meta } },
});

const scanStats = (overrides = {}) => ({
  resolved: 0,
  resolvedOrigins: 0,
  depthTruncations: 0,
  cycleCuts: 0,
  computedRecordUnknown: 0,
  objectValuesRecordUnknown: 0,
  ...overrides,
});

const healthyCorpus = () => ({
  shapes: { record: { rows: 40, keys: ['id'] } },
  graph: {
    schema: 2,
    origins: {
      'root/record': {
        id: 'root/record', label: 'record', rows: 8, keys: ['id'],
      },
    },
    roots: { row: [{ kind: 'record', origins: ['root/record'] }] },
    meta: { transitions: 1, depthTruncations: 0, cycleCuts: 0 },
  },
  meta: { generations: 1 },
});

const healthyStats = (overrides = {}) => scanStats({
  files: 1,
  reads: 2,
  resolved: 1,
  resolvedOrigins: 1,
  unresolved: 1,
  ...overrides,
});

const manifestForPaths = (paths) => {
  const entries = paths.map((path) => ({
    path,
    type: 'file',
    mode: '100644',
    size: path.length,
    sha256: path === 'scripts/lib/legacy-reader-shape-scan.mjs'
      ? LEGACY_MODULE_SHA
      : (path.includes('/scanner.') ? 'd' : 'c').repeat(64),
  }));
  return {
    algorithm: 'sha256-canonical-path-type-mode-size-content-v2',
    entries,
    digest: digestOf(entries),
  };
};

const treeSetFor = (scanPath = 'src/probe.js') => {
  const detectorPaths = [
    'package-lock.json',
    'scripts/lib/legacy-reader-shape-scan.mjs',
    'scripts/scanner.mjs',
  ];
  return {
    scanTree: manifestForPaths([scanPath]),
    sourceTree: manifestForPaths([scanPath]),
    detectorTree: manifestForPaths(detectorPaths),
    executionTree: manifestForPaths([...detectorPaths, scanPath].sort()),
  };
};

const pathOf = (file) => {
  const normalized = String(file).replaceAll('\\', '/');
  const marker = normalized.indexOf('/repo/');
  return marker >= 0 ? normalized.slice(marker + 6) : normalized;
};

const scanRuntime = ({ corpus = healthyCorpus(), findings = [findingOf()], stats = healthyStats() } = {}) => {
  const calls = [];
  const writes = [];
  const scanPath = findings[0]?.file || 'src/probe.js';
  const scanFile = `/repo/${scanPath}`;
  const detectorFiles = [
    '/repo/package-lock.json',
    '/repo/scripts/lib/legacy-reader-shape-scan.mjs',
    '/repo/scripts/scanner.mjs',
  ];
  return {
    calls,
    writes,
    overrides: {
      corpusFor: async () => { calls.push('corpus'); return corpus; },
      sourceFiles: () => { calls.push('sources'); return [scanFile]; },
      subjectFiles: () => [scanFile],
      scannerToolFiles: () => detectorFiles,
      executionInputFiles: () => [...detectorFiles, scanFile].sort(),
      scanReaders: () => { calls.push('reader'); return { findings, stats }; },
      assertFindingSourceEvidence: (rows) => rows,
      fileManifestOf: (_root, files) => manifestForPaths(files.map(pathOf).sort()),
      subjectShaFor: () => SUBJECT_SHA,
      scannerShaFor: () => SCANNER_SHA,
      repositoryHeadFor: () => SUBJECT_SHA,
      dirtyInputsFor: () => '',
      committedInputManifestsFor: () => treeSetFor(scanPath),
      createScanArtifact,
      planArtifactOutput: (path) => ({ path }),
      writeArtifact: (plan, artifact) => { writes.push({ path: plan.path, artifact }); },
      baselineExists: () => { calls.push('baseline-exists'); return true; },
      readBaseline: () => { calls.push('baseline-read'); throw new Error('baseline read'); },
      writeBaseline: () => { calls.push('baseline-write'); throw new Error('baseline write'); },
    },
  };
};

const receiptFor = (trees, targetInventoryDigest = 'b'.repeat(64)) => ({
  bundleDigest: '4'.repeat(64),
  reportDigest: '5'.repeat(64),
  reviewDigest: '6'.repeat(64),
  predecessorBaselineDigest: '7'.repeat(64),
  predecessorBaselineTextSha256: '8'.repeat(64),
  predecessorInventoryDigest: 'f'.repeat(64),
  legacyArtifactDigest: '9'.repeat(64),
  currentArtifactDigest: 'a'.repeat(64),
  subjectSha: SUBJECT_SHA,
  scanTreeDigest: trees.scanTree.digest,
  sourceTreeDigest: trees.sourceTree.digest,
  executionTreeDigest: trees.executionTree.digest,
  detectorTreeDigest: trees.detectorTree.digest,
  corpusDigest: '1'.repeat(64),
  scanConfigDigest: digestOf(SCAN_CONFIG),
  targetInventoryDigest,
  currentFindingsDigest: 'c'.repeat(64),
  legacyScannerSha: SUBJECT_SHA,
  legacyAlgorithmBaseSha: '6e7acc4dd88a43cb608f40bc77db3b2130a1e2de',
  legacyDetectorDigest: trees.detectorTree.digest,
  legacyScannerToolDigest: scannerToolDigestOf({
    scannerSha: SUBJECT_SHA,
    detectorTreeDigest: trees.detectorTree.digest,
    legacyAlgorithm: governedLegacyAlgorithmOf(trees.detectorTree),
  }),
  currentScannerSha: SUBJECT_SHA,
  currentDetectorDigest: trees.detectorTree.digest,
  currentScannerToolDigest: scannerToolDigestOf({
    scannerSha: SUBJECT_SHA,
    detectorTreeDigest: trees.detectorTree.digest,
  }),
});

/**
 * The schema-4 receipt. Same key set as the retired schema-3 receipt above; the
 * difference is that every `current*` binding names the SAME governed heuristic
 * artifact as its `legacy*` twin, because schema 4 has exactly one detector.
 */
const heuristicReceiptFor = (trees, targetInventoryDigest = 'b'.repeat(64)) => {
  const legacyScannerToolDigest = scannerToolDigestOf({
    scannerSha: SUBJECT_SHA,
    detectorTreeDigest: trees.detectorTree.digest,
    legacyAlgorithm: governedLegacyAlgorithmOf(trees.detectorTree),
  });
  return {
    ...receiptFor(trees, targetInventoryDigest),
    legacyArtifactDigest: '9'.repeat(64),
    currentArtifactDigest: '9'.repeat(64),
    legacyScannerToolDigest,
    currentScannerToolDigest: legacyScannerToolDigest,
  };
};

const validBaseline = ({ corpus, stats, frozen }) => {
  const scanPath = frozen[0]?.file || 'src/probe.js';
  const trees = treeSetFor(scanPath);
  const sentinel = sentinelOf(corpus, stats, BASELINE_SCAN_MODE);
  const inventory = artifactInventoryOf(BASELINE_SCAN_MODE, frozen);
  const manifests = trees;
  const migrationReview = heuristicReceiptFor(trees, digestOf(inventory));
  const identities = Object.values(inventory)
    .reduce((n, row) => n + Object.keys(row).length, 0);
  const declarations = new Map(EXPLAINED_WRITER_EXEMPTIONS
    .map((entry) => [entry.identity, entry]));
  const rowTags = {};
  for (const [file, row] of Object.entries(inventory)) {
    for (const identity of Object.keys(row)) {
      const declaration = declarations.get(identity);
      if (!declaration) continue;
      if (!rowTags[file]) rowTags[file] = {};
      rowTags[file][identity] = {
        reason: declaration.ruling,
        rule: 'explained-writer',
      };
    }
  }
  return {
    _doc: ['governed test fixture'],
    schema: BASELINE_SCHEMA,
    frozen: '2026-08-09',
    frozenAtSha: SUBJECT_SHA,
    minRows: 40,
    originMinRows: 8,
    corpusMeta: { generations: 1 },
    scanStats: stats,
    sentinel,
    total: frozen.length,
    identities,
    inventory,
    rowTags,
    migrationReview,
    manifests,
    scannerProvenance: {
      scanTreeDigest: trees.scanTree.digest,
      sourceTreeDigest: trees.sourceTree.digest,
      detectorDigest: trees.detectorTree.digest,
      executionTreeDigest: trees.executionTree.digest,
      unscannedInputDigest: digestOf([]),
    },
    digests: {
      corpusMeta: digestOf({ generations: 1 }),
      scanStats: digestOf(stats),
      sentinel: digestOf(sentinel),
      inventory: digestOf(inventory),
      rowTags: digestOf(rowTags),
      manifests: digestOf(manifests),
      migrationReview: digestOf(migrationReview),
    },
  };
};

/**
 * A schema-4 gate/write runtime. The gate no longer drives the EXACT resolver at
 * all, so `scanReaders` is wired to THROW here: if a future edit routes the
 * baseline path back through the exact leg, this fixture reds instead of quietly
 * comparing two different identity alphabets.
 */
const maintenanceRuntime = ({ current, frozen }) => {
  const corpus = healthyCorpus();
  const stats = leafStats();
  const runtime = scanRuntime({ corpus, findings: current, stats });
  const baselineWrites = [];
  const baseline = validBaseline({ corpus, stats, frozen });
  Object.assign(runtime.overrides, {
    scanReaders: () => {
      throw new Error('the live heuristic gate must not invoke the exact resolver');
    },
    scanLegacyReaders: () => { runtime.calls.push('legacy-reader'); return { findings: current, stats }; },
    baselineExists: () => true,
    readBaseline: () => baseline,
    readBaselineText: () => `${canonicalJson(baseline, 1)}\n`,
    writeBaseline: (value) => { baselineWrites.push(value); },
    dirtyInputsFor: () => '',
    // A clean shrink-only maintenance write necessarily follows a source
    // change, so it cannot still be running at the migration-genesis commit.
    // Keeping the fixture at SUBJECT_SHA would ask the validator to accept a
    // different target inventory while still claiming to be the original
    // reviewed freeze.
    subjectShaFor: () => MAINTENANCE_SHA,
    scannerShaFor: () => MAINTENANCE_SHA,
    repositoryHeadFor: () => MAINTENANCE_SHA,
    headShaFor: () => MAINTENANCE_SHA,
    validateBaselineHistory: () => baseline,
  });
  return { ...runtime, baseline, baselineWrites };
};

describe('observed-shape anti-vacuity sentinel telemetry', () => {
  test('canonical JSON and SHA-256 are deterministic across object insertion order', () => {
    const left = { z: [3, 2, 1], a: { y: 2, x: 1 } };
    const right = { a: { x: 1, y: 2 }, z: [3, 2, 1] };
    expect(canonicalJson(left)).toBe('{"a":{"x":1,"y":2},"z":[3,2,1]}');
    expect(digestOf(left)).toBe(digestOf(right));
    expect(digestOf(left)).toMatch(/^[a-f0-9]{64}$/);
    expect(digestOf(left)).not.toBe(digestOf({ ...right, z: [1, 2, 3] }));

    const reserved = JSON.parse(
      '{"prototype":{"slot":3},"__proto__":{"slot":1},"constructor":{"slot":2}}',
    );
    const changedProto = JSON.parse(
      '{"prototype":{"slot":3},"__proto__":{"slot":9},"constructor":{"slot":2}}',
    );
    expect(canonicalJson(reserved)).toBe(
      '{"__proto__":{"slot":1},"constructor":{"slot":2},"prototype":{"slot":3}}',
    );
    expect(digestOf(reserved)).not.toBe(digestOf(changedProto));
    expect(Object.getPrototypeOf(JSON.parse(canonicalJson(reserved)))).toBe(Object.prototype);
  });

  test('historical manifest classification exactly matches live scan and subject extensions', () => {
    expect(isObservedShapeSubjectPath('src/data.json')).toBe(true);
    expect(isObservedShapeSubjectPath('src/module.generated.js')).toBe(true);
    expect(isObservedShapeSubjectPath('src/styles.css')).toBe(false);
    expect(isObservedShapeSubjectPath('src/types.ts')).toBe(false);
    expect(isObservedShapeScanPath('src/module.js')).toBe(true);
    expect(isObservedShapeScanPath('src/view.jsx')).toBe(true);
    expect(isObservedShapeScanPath('src/module.generated.js')).toBe(false);
    expect(isObservedShapeScanPath('src/data.json')).toBe(false);
  });

  test('aggregates corpus and resolver traversal losses and rejects both', () => {
    const sentinel = sentinelOf(
      corpusWithTelemetry({ depthTruncations: 2, cycleCuts: 3 }),
      scanStats({ depthTruncations: 5, cycleCuts: 7 }),
    );

    expect(sentinel).toMatchObject({
      corpusDepthTruncations: 2,
      resolverDepthTruncations: 5,
      depthTruncations: 7,
      corpusCycleCuts: 3,
      resolverCycleCuts: 7,
      cycleCuts: 10,
    });
    expect(sentinelFailures(sentinel, {})).toEqual([
      expect.stringMatching(/^depthTruncations: 7 /),
      expect.stringMatching(/^cycleCuts: 10 /),
    ]);
  });

  test('fails closed on malformed cached-corpus telemetry', () => {
    expect(() => sentinelOf(
      corpusWithTelemetry({ depthTruncations: 0, cycleCuts: '0' }),
      scanStats(),
    )).toThrow(/corpusCycleCuts must be a non-negative integer/);
  });

  test('scan-only dispatch writes one governed artifact and never admits baseline I/O', async () => {
    const runtime = scanRuntime();
    await expect(run(
      ['--scan-only', '--json=/virtual/observed-shape.json'],
      runtime.overrides,
    )).resolves.toBe(0);

    expect(runtime.calls).toContain('corpus');
    expect(runtime.calls).toContain('reader');
    expect(runtime.writes).toHaveLength(1);
    expect(runtime.writes[0].path).toBe('/virtual/observed-shape.json');
    const artifact = runtime.writes[0].artifact;
    expect(validateScanArtifact(artifact)).toBe(artifact);
    expect(artifact).toMatchObject({
      artifactSchema: 2,
      mode: 'scan-only',
      scanMode: 'exact-origin',
      baselineSchema: 3,
      siteSchema: 'semantic-ast-v2',
      provenance: {
        subjectSha: SUBJECT_SHA,
        scannerSha: SCANNER_SHA,
        sourceTreeDigest: artifact.sourceTree.digest,
        detectorDigest: artifact.detectorTree.digest,
      },
      stats: { resolved: 1, resolvedOrigins: 1 },
      sentinel: { depthTruncations: 0, cycleCuts: 0 },
    });
    expect(artifact.provenance.scannerToolDigest).toBe(digestOf({
      scannerSha: SCANNER_SHA,
      detectorTreeDigest: artifact.detectorTree.digest,
    }));
    expect(artifact.digests.inventory).toBe(digestOf(artifact.inventory));
  });

  test('progress mode emits JSONL-ready lifecycle and exact reader events', async () => {
    const runtime = scanRuntime();
    const events = [];
    runtime.overrides.writeProgress = (event) => events.push(event);
    runtime.overrides.scanReaders = (options) => {
      options.onReadStart?.({
        read: 1,
        file: 'src/probe.js',
        line: 1,
        column: 11,
        key: 'ghost',
        kind: 'dot',
      });
      return { findings: [findingOf()], stats: healthyStats() };
    };

    await expect(run(
      ['--scan-only', '--json=/virtual/progress.json', '--progress'],
      runtime.overrides,
    )).resolves.toBe(0);

    expect(commandOf(['--scan-only', '--json=/tmp/scan.json', '--progress']).progress)
      .toBe(true);
    // ⚠ ONE PHASE PER DECLARED FILTER, IN CHAIN ORDER, and every addition to the
    // chain has been caught here first — `family-filter-complete` and
    // `explained-writer-filter-complete` at the schema-5 mint, then
    // `dom-global-filter-complete` and `language-surface-filter-complete` at the
    // schema-6 mint. That is the pin working, and it is why the order is asserted
    // as a sequence rather than as a set. Each is emitted on EVERY scan, including
    // this exact-origin probe where NO filter applies, so a reader of `--progress`
    // can never mistake "filter absent" for "phase absent".
    expect(events.map(({ phase }) => phase)).toEqual([
      'corpus-start',
      'corpus-complete',
      'scan-start',
      'read-start',
      'scan-complete',
      'family-filter-complete',
      'dom-global-filter-complete',
      'language-surface-filter-complete',
      'explained-writer-filter-complete',
    ]);
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({
        phase: 'read-start',
        read: 1,
        file: 'src/probe.js',
        key: 'ghost',
      }),
      expect.objectContaining({
        phase: 'scan-complete',
        findings: 1,
        reads: 2,
      }),
    ]));
    expect(events.every(({ at }) => /^\d{4}-\d{2}-\d{2}T/.test(at))).toBe(true);
  });

  /**
   * ── CR-OSR-SCOPE-1 — THE TWO LEGS, WIRED THE OPPOSITE WAY ON PURPOSE ──────
   *
   * The chair's scope ruling rests entirely on a premise about wiring: exact
   * resolution skips the UI layer BECAUSE the heuristic (legacy-leaf) leg still
   * covers it. That premise is only true while the file census stays UNFILTERED
   * and the exclusion travels as a declared parameter to the exact leg alone.
   * Pre-filtering `sourceFiles()` instead would quietly take the UI layer away
   * from BOTH detectors — and from the governed scan manifest with it.
   *
   * Both tests below drive the REAL `run()` and read what each leg was handed.
   */
  test('CR-OSR-SCOPE-1: the EXACT leg is handed the declared exclusion, over an unfiltered census', async () => {
    const scanPath = 'src/components/Probe.jsx';
    const findings = [findingOf({ file: scanPath })];
    const runtime = scanRuntime({ findings });
    runtime.overrides.committedInputManifestsFor = () => treeSetFor(scanPath);
    let seen = null;
    runtime.overrides.scanReaders = (options) => {
      seen = options;
      return { findings, stats: healthyStats({ excludedReadFiles: 1 }) };
    };

    await expect(run(
      ['--scan-only', '--json=/virtual/scope-exact.json'],
      runtime.overrides,
    )).resolves.toBe(0);

    expect(seen.excludedReadScopes).toEqual([...EXACT_SCAN_EXCLUDED_SCOPE]);
    expect(seen.excludedReadScopes).toEqual(['src/components/']);
    // THE CENSUS IS NOT PRE-FILTERED: the one UI file in the tree is still
    // walked, still indexed, and still bound into the governed scan manifest.
    expect(seen.files).toEqual([`/repo/${scanPath}`]);
    expect(runtime.writes[0].artifact.scanTree.entries.map(({ path }) => path))
      .toEqual([scanPath]);
    expect(runtime.writes[0].artifact.stats.excludedReadFiles).toBe(1);
  });

  test('CR-OSR-SCOPE-1: the HEURISTIC leg is handed NO exclusion and the same unfiltered census', async () => {
    const scanPath = 'src/components/Probe.jsx';
    const corpus = healthyCorpus();
    const stats = healthyStats();
    const trees = treeSetFor(scanPath);
    const corpusArtifact = createScanArtifact({
      scanMode: 'exact-origin',
      baselineSchema: 3,
      subjectSha: SUBJECT_SHA,
      scannerSha: SUBJECT_SHA,
      ...trees,
      scanConfig: SCAN_CONFIG,
      corpus,
      findings: [findingOf({ file: scanPath })],
      stats,
      sentinel: sentinelOf(corpus, stats),
      inventory: artifactInventoryOf('exact-origin', [findingOf({ file: scanPath })]),
    });
    const legacyFindings = [{
      file: scanPath, line: 1, pos: 10, key: 'ghost', shapes: ['record'], text: 'row.ghost',
    }];
    const legacyStats = { files: 1, reads: 2, resolved: 1, unresolved: 1 };
    const runtime = scanRuntime({ corpus, findings: [findingOf({ file: scanPath })], stats });
    runtime.overrides.committedInputManifestsFor = () => trees;
    runtime.overrides.readJson = () => corpusArtifact;
    let seenLegacy = null;
    runtime.overrides.scanLegacyReaders = (options) => {
      seenLegacy = options;
      return { findings: legacyFindings, stats: legacyStats };
    };
    runtime.overrides.scanReaders = () => {
      throw new Error('the legacy leg must not invoke the exact resolver');
    };

    await expect(run([
      '--scan-only', '--scan-mode=legacy-leaf',
      '--corpus-artifact=/virtual/scope-exact.json', '--json=/virtual/scope-legacy.json',
    ], runtime.overrides)).resolves.toBe(0);

    // The UI file the exact leg skips is exactly the file the heuristic leg
    // still reads — and it carries no scope parameter at all.
    expect(seenLegacy.files).toEqual([`/repo/${scanPath}`]);
    expect(seenLegacy.excludedReadScopes).toBeUndefined();
    expect(runtime.writes[0].artifact.findings.map(({ file }) => file)).toEqual([scanPath]);
  });

  /**
   * ⭐⭐ CR-OSR-FREEZE-6 — THE SHAPE-FAMILY RELATION. The union is the whole point:
   * an INTERSECTION would narrow the accepted key set and MINT findings, which is
   * why the assertions below pin the union EXACTLY rather than testing that it
   * merely contains something.
   */
  test('CR-OSR-FREEZE-6: the shape family unions containing siblings, above a size guard', () => {
    const keysOf = (n, extra = []) => [...Array.from({ length: n }, (_, i) => `k${i + 1}`), ...extra];
    // `subject` has 10 own keys. `joins` covers 8 of them (0.80, exactly theta);
    // `misses` covers 7 (0.70). Only the first may contribute.
    const shapes = {
      subject: { rows: 500, keys: keysOf(10) },
      joins: { rows: 500, keys: [...keysOf(8), 'fromJoiner'] },
      misses: { rows: 500, keys: [...keysOf(7), 'fromMisser'] },
    };
    expect([...shapeFamilyUnionOf('subject', shapes)].sort())
      .toEqual([...keysOf(10), 'fromJoiner'].sort());

    // THE SIZE GUARD IS A BOUNDARY, PINNED ON BOTH SIDES: the same perfect
    // superset contributes nothing to a 7-key shape and everything to an 8-key
    // one, so the guard cannot be quietly dropped or quietly widened.
    const guardShapes = (n) => ({
      thin: { rows: 500, keys: keysOf(n) },
      fat: { rows: 500, keys: [...keysOf(n), 'fromFat'] },
    });
    expect([...shapeFamilyUnionOf('thin', guardShapes(7))].sort()).toEqual(keysOf(7).sort());
    expect([...shapeFamilyUnionOf('thin', guardShapes(8))].sort())
      .toEqual([...keysOf(8), 'fromFat'].sort());

    // Ignorance fails SAFE — an unknown shape unions to nothing, so its findings
    // all survive. The filter may only ever remove what it can justify.
    expect([...shapeFamilyUnionOf('absent', shapes)]).toEqual([]);
  });

  /**
   * ⭐⭐ CR-OSR-FREEZE-6 — WHY THIS IS A POST-FILTER AND NOT A DETECTOR EDIT.
   * `legacy-reader-shape-scan.mjs` is byte-frozen to blob 0310fa9f, so the filter
   * consumes the detector's output and returns a SUBSET. The property that makes
   * that safe is that `stats` is the SAME OBJECT — the anti-vacuity sentinel keeps
   * measuring the DETECTOR's reach, so no threshold here can hide a corpus that
   * stopped observing.
   */
  test('CR-OSR-FREEZE-6: the filter subsets findings and passes detector stats through by identity', () => {
    const shapes = {
      outcome: { rows: 756, keys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
      selected: { rows: 400, keys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'carriedBySibling'] },
    };
    const stats = leafStats();
    const rows = [
      leafFindingOf({ key: 'carriedBySibling', shapes: ['outcome'] }),
      leafFindingOf({ key: 'nobodyHasThis', shapes: ['outcome'] }),
    ];
    const filtered = applyShapeFamilyFilter({
      scanMode: BASELINE_SCAN_MODE, corpus: { shapes }, scan: { findings: rows, stats },
    });

    expect(filtered.findings.map(({ key }) => key)).toEqual(['nobodyHasThis']);
    expect(filtered.familyFilter)
      .toEqual({ applied: true, cleared: 1, clearedIdentities: ['carriedBySibling on outcome'] });
    // BY IDENTITY, not by value: `toBe` is the assertion that makes it structurally
    // impossible for this filter to move the vacuity floor.
    expect(filtered.stats).toBe(stats);

    // The EXACT leg is addressed by executed origin, where "the same record under
    // another name" is not expressible — so it keeps the raw detector output.
    const exact = applyShapeFamilyFilter({
      scanMode: 'exact-origin', corpus: { shapes }, scan: { findings: rows, stats },
    });
    expect(exact.findings).toBe(rows);
    expect(exact.familyFilter.applied).toBe(false);
  });

  /**
   * ⭐⭐⭐ THE CONTROL CR-OSR-FREEZE-6 REQUIRES. The filter was adopted ONLY on the
   * measured property that it erases zero class-(a) true positives, so that
   * property is machinery here, not a measurement that happened once.
   *
   * ⚠ THE PAIRED NEGATIVE CONTROL IS THE POINT. Both halves below run the SAME
   * corpus through the SAME clearing mechanism and differ only in whether the
   * cleared identity is class-(a). Without the pair, a pin that threw on ANY
   * clearing would look identical to this one and would be wrong — it would
   * refuse the 122 rows the filter exists to clear.
   */
  test('CR-OSR-FREEZE-6: clearing a class-(a) TRUE POSITIVE refuses the scan; clearing anything else does not', () => {
    // `coalitionEvidence on outcome` is a LIVE class-(a) row sitting on `outcome`,
    // the very shape whose union grows 48 -> 141 keys under the real filter.
    const guarded = 'coalitionEvidence on outcome';
    expect(CLASS_A_PROTECTED_IDENTITIES).toContain(guarded);

    const own = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const shapes = {
      outcome: { rows: 756, keys: own },
      selected: { rows: 400, keys: [...own, 'coalitionEvidence', 'settlementId'] },
    };
    const clearOf = (key) => applyShapeFamilyFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: { shapes },
      scan: { findings: [leafFindingOf({ key, shapes: ['outcome'] })], stats: leafStats() },
    });

    // ── THE MUTANT: the filter genuinely clears a class-(a) row ───────────────
    let raised = null;
    try {
      clearOf('coalitionEvidence');
    } catch (error) {
      raised = error;
    }
    expect(raised, 'the filter cleared a class-(a) row and the control did not fire').toBeInstanceOf(Error);
    // THE MESSAGE MUST NAME THE ACTUAL CAUSE. A pin that reds for the right reason
    // with the wrong message costs the next lane exactly the time it exists to save.
    expect(raised.message).toContain(guarded);
    expect(raised.message).toContain('class-(a)');
    expect(raised.message).toContain('CR-OSR-FREEZE-6');
    expect(raised.message).toContain('theta=0.8');
    expect(raised.message).toMatch(/cleared 1 CR-OSR-FREEZE-3-R2 class-\(a\)/);

    // ── THE NEGATIVE CONTROL: same corpus, same clearing, unguarded identity ──
    const lawful = clearOf('settlementId');
    expect(lawful.familyFilter)
      .toEqual({ applied: true, cleared: 1, clearedIdentities: ['settlementId on outcome'] });

    // …and the guard is a pure function of what was cleared, so it can be driven
    // directly: the same identity refused above passes through untouched when it
    // is NOT in the cleared set.
    expect(() => assertShapeFamilyDebtPreserved(['settlementId on outcome'])).not.toThrow();
    // anchored: the throwing case is asserted immediately above on the same helper
    expect(assertShapeFamilyDebtPreserved([])).toEqual([]);
    expect(() => assertShapeFamilyDebtPreserved([guarded])).toThrow(/class-\(a\)/);
  });

  /**
   * The refusal is not confined to the helper: it reaches the gate, because the
   * filter sits in `run()` between the scan and the inventory.
   */
  test('CR-OSR-FREEZE-6: the class-(a) refusal propagates out of the gate itself', async () => {
    const own = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const corpus = {
      ...healthyCorpus(),
      shapes: {
        outcome: { rows: 756, keys: own },
        selected: { rows: 400, keys: [...own, 'coalitionEvidence'] },
      },
    };
    const rows = [leafFindingOf({ key: 'coalitionEvidence', shapes: ['outcome'] })];
    const runtime = maintenanceRuntime({ current: rows, frozen: rows });
    runtime.overrides.corpusFor = async () => corpus;
    runtime.overrides.scanLegacyReaders = () => ({ findings: rows, stats: leafStats() });

    await expect(run([], runtime.overrides)).rejects.toThrow(/class-\(a\)[\s\S]*coalitionEvidence on outcome/);
  });

  /**
   * ⭐⭐⭐ CR-OSR-SCHEMA-6 / M11 — THE DOM-GLOBAL RECEIVER EXCLUSION, PAIRED.
   *
   * ⚠ THE PAIR IS THE WHOLE TEST. A filter that cleared EVERY `history` read
   * would look identical to this one from the positive half alone, and it would
   * be catastrophically wrong: `history` is a real settlement container. So each
   * declared receiver is driven clearing a read, and the SAME key on the SAME
   * shape is driven NOT clearing when its receiver is a domain object.
   */
  test('M11: a host-global receiver clears; the same key on a domain receiver does NOT', () => {
    expect(DOM_GLOBAL_RECEIVER_ROOTS).toEqual(['document', 'globalThis', 'window']);
    const stats = leafStats();
    const rowOfText = (text, pos) => leafFindingOf({ key: 'replaceState', shapes: ['history'], text, pos });
    const clearedBy = (text) => applyDomGlobalReceiverFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: healthyCorpus(),
      scan: { findings: [rowOfText(text, 10)], stats },
    });

    // ── THE POSITIVE HALF: every DECLARED root clears, so none is vacuous ─────
    for (const root of DOM_GLOBAL_RECEIVER_ROOTS) {
      const out = clearedBy(`${root}.history.replaceState`);
      expect(out.findings, `${root} is declared but cleared nothing`).toEqual([]);
      expect(out.domGlobals.clearedIdentities).toEqual(['replaceState on history']);
      expect(out.domGlobals.receivers).toEqual([root]);
    }
    // Optional chaining at the root is the same read and must not escape.
    expect(clearedBy('window?.history.replaceState').findings).toEqual([]);

    // ── THE NEGATIVE HALF: identical key, identical shape, domain receiver ────
    for (const text of [
      'settlement.history.replaceState',
      'save?.history.replaceState',
      'self.history.replaceState',        // a host global NOT declared (see the source note)
      'myWindow.history.replaceState',    // a longer identifier merely CONTAINING a root
      'replaceState',                     // no receiver at all
    ]) {
      const out = clearedBy(text);
      expect(out.findings.length, `${text} was cleared and must not have been`).toBe(1);
      expect(out.domGlobals.cleared).toBe(0);
      expect(domGlobalReceiverOf(text)).toBe(null);
    }
    // The extractor IS the decision, so it is pinned directly beside the filter.
    expect(domGlobalReceiverOf('window.history.replaceState')).toBe('window');
    expect(domGlobalReceiverOf('window?.history.state')).toBe('window');

    // BY IDENTITY, not by value: the anti-vacuity floor cannot move.
    expect(clearedBy('window.history.replaceState').stats).toBe(stats);
    // The EXACT leg is addressed by executed origin, where a receiver root is
    // not part of the address, so it keeps the raw detector output.
    const rows = [rowOfText('window.history.replaceState', 10)];
    const exact = applyDomGlobalReceiverFilter({
      scanMode: 'exact-origin', corpus: healthyCorpus(), scan: { findings: rows, stats },
    });
    expect(exact.findings).toBe(rows);
    expect(exact.domGlobals.applied).toBe(false);
  });

  /**
   * ⭐⭐ M11's TWO DECLARATION GUARDS, and they refuse DIFFERENT mistakes: the
   * vocabulary refuses a name that is not a host global at all, and the
   * corpus-derived guard refuses a name the detector's ROOT PRIOR grounds — the
   * one addition that would clear reads of real records wholesale.
   */
  test('M11: a domain receiver is refused by the vocabulary, and a CORPUS WALK ROOT by the corpus', () => {
    expect(assertDomGlobalReceiverRoots()).toBe(DOM_GLOBAL_RECEIVER_ROOTS);
    expect(() => assertDomGlobalReceiverRoots(['settlement']))
      .toThrow(/not a declared host global[\s\S]*blind the instrument/);
    expect(() => assertDomGlobalReceiverRoots(['window.'])).toThrow(/must be a bare identifier/);
    expect(() => assertDomGlobalReceiverRoots([])).toThrow(/nonempty array/);

    // ⚠⚠ THE MEASURED REASON THE CORPUS GUARD IS SPELLED THIS WAY. `window` IS an
    // observed corpus SHAPE name at this sha, so a guard reading "a root may not
    // be an observed shape" would have refused the very exclusion M11 exists to
    // make. The guard is on the WALK ROOTS instead — the names the root prior
    // actually grounds — and this pin drives both directions.
    const walkRootCorpus = { ...healthyCorpus(), rootShapes: ['settlement', 'window'] };
    expect(() => applyDomGlobalReceiverFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: walkRootCorpus,
      scan: { findings: [leafFindingOf()], stats: leafStats() },
    })).toThrow(/name a CORPUS WALK ROOT/);
    const shapeOnlyCorpus = {
      ...healthyCorpus(),
      shapes: { ...healthyCorpus().shapes, window: { rows: 40, keys: ['history'] } },
      rootShapes: ['settlement'],
    };
    expect(applyDomGlobalReceiverFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: shapeOnlyCorpus,
      scan: { findings: [leafFindingOf()], stats: leafStats() },
    }).domGlobals.applied).toBe(true);
  });

  /**
   * ⭐⭐ M11 INHERITS THE CLASS-(a) REFUSAL. Three filters narrow this instrument
   * and M8/M9 banks its matches; all four stages inherit the same class-(a) law
   * from one home, so widening a rule cannot erase a chaired real defect.
   */
  test('M11: clearing a class-(a) TRUE POSITIVE refuses the scan; clearing anything else does not', () => {
    const guarded = 'hooks on settlement';
    expect(CLASS_A_PROTECTED_IDENTITIES).toContain(guarded);
    const clearOf = (key) => applyDomGlobalReceiverFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: healthyCorpus(),
      scan: {
        findings: [leafFindingOf({ key, shapes: ['settlement'], text: `window.thing.${key}` })],
        stats: leafStats(),
      },
    });
    expect(() => clearOf('hooks'))
      .toThrow(/DOM-global receiver filter[\s\S]*class-\(a\)[\s\S]*hooks on settlement/);
    // THE NEGATIVE CONTROL: same receiver, same clearing, unguarded identity.
    expect(clearOf('notGuardedAnywhere').domGlobals.clearedIdentities)
      .toEqual(['notGuardedAnywhere on settlement']);
  });

  /**
   * ⭐⭐⭐ CR-OSR-SCHEMA-6 / M12 — THE LANGUAGE-SURFACE RESIDUAL, PAIRED.
   *
   * ⚠ THE NEGATIVE HALF IS A MEASURED NEAR-MISS, not an invented one. `toType on
   * history` is a REAL row in the live inventory on the REAL `history` shape, and
   * the tempting `/^to[A-Z]/` spelling of this filter would have deleted it. An
   * exact frozen key set cannot.
   */
  test('M12: a builtin prototype member clears; a domain key that merely looks like one does NOT', () => {
    expect(LANGUAGE_SURFACE_RESIDUAL_KEYS).toEqual(['toLocaleString']);
    const stats = leafStats();
    const filtered = applyLanguageSurfaceFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: healthyCorpus(),
      scan: {
        findings: [
          leafFindingOf({ key: 'toLocaleString', shapes: ['history'], text: 'popFirst.toLocaleString' }),
          leafFindingOf({ key: 'toType', shapes: ['history'], text: 'entry?.toType', pos: 20 }),
          leafFindingOf({ key: 'toString', shapes: ['history'], text: 'entry.toString', pos: 30 }),
        ],
        stats,
      },
    });
    expect(filtered.findings.map(identityOf)).toEqual(['toType on history', 'toString on history']);
    expect(filtered.languageSurface.cleared).toBe(1);
    expect(filtered.languageSurface.clearedIdentities).toEqual(['toLocaleString on history']);
    // BY IDENTITY, not by value.
    expect(filtered.stats).toBe(stats);

    const rows = [leafFindingOf({ key: 'toLocaleString', shapes: ['history'] })];
    const exact = applyLanguageSurfaceFilter({
      scanMode: 'exact-origin', corpus: healthyCorpus(), scan: { findings: rows, stats },
    });
    expect(exact.findings).toBe(rows);
    expect(exact.languageSurface.applied).toBe(false);
  });

  /**
   * ⭐⭐ M12's TWO GUARDS, and together they are why this filter may be SHAPE-BLIND.
   * A declared key must live on a builtin prototype (asked of the running engine,
   * so it cannot rot) AND be absent from every observed shape (asked of the
   * corpus, so the frozen detector's "nothing in the measured corpus collides"
   * premise is verified rather than trusted).
   */
  test('M12: a domain key is refused by the prototype guard, and an OBSERVED key by the corpus', () => {
    expect(assertLanguageSurfaceResidualKeys()).toBe(LANGUAGE_SURFACE_RESIDUAL_KEYS);
    expect(() => assertLanguageSurfaceResidualKeys(['stresses']))
      .toThrow(/not a member of any declared builtin prototype/);
    // ⚠ `test` IS language surface — on RegExp.prototype — and is DELIBERATELY
    // inadmissible: RegExp and Function prototypes are outside the declared
    // vocabulary because they would also admit `source`, `flags` and `name`,
    // which are ordinary domain keys. This is the executed form of that ruling.
    expect(() => assertLanguageSurfaceResidualKeys(['test']))
      .toThrow(/not a member of any declared builtin prototype/);
    expect(() => assertLanguageSurfaceResidualKeys(['name']))
      .toThrow(/not a member of any declared builtin prototype/);
    expect(() => assertLanguageSurfaceResidualKeys(['to Locale'])).toThrow(/bare identifier/);
    expect(() => assertLanguageSurfaceResidualKeys([])).toThrow(/nonempty array/);

    // THE CORPUS GUARD: a producer that starts writing the key makes it a domain
    // key again, and clearing it would then be a deletion rather than a filter.
    const collidingCorpus = {
      ...healthyCorpus(),
      shapes: { record: { rows: 40, keys: ['id', 'toLocaleString'] } },
    };
    expect(() => applyLanguageSurfaceFilter({
      scanMode: BASELINE_SCAN_MODE,
      corpus: collidingCorpus,
      scan: { findings: [leafFindingOf()], stats: leafStats() },
    })).toThrow(/OBSERVED DOMAIN KEYS: toLocaleString on record/);

    // ⭐⭐ AND M12 CANNOT REACH A CLASS-(a) ROW AT ALL — which is stronger than a
    // refusal control and is why it has none. Every banked true positive is a
    // DOMAIN key, so the prototype guard above refuses each of them outright:
    // the erasure the other three filters must be policed against is not
    // expressible here. Driven over the whole guard set rather than argued.
    for (const identity of CLASS_A_PROTECTED_IDENTITIES) {
      const key = identity.slice(0, identity.indexOf(' on '));
      expect(() => assertLanguageSurfaceResidualKeys([key]),
        `${key} is a banked class-(a) key and M12 would admit it as language surface`)
        .toThrow(/not a member of any declared builtin prototype/);
    }
  });

  /**
   * ⭐⭐ M8/M9 GATE 0 — THE WIDENED WRITE-SHAPE PROBE. Two of these four spellings
   * were MEASURED defeating the quoted-string scan that was this discipline's
   * best manual check, and both are real writes in the live estate. The pin
   * drives each spelling in isolation so a regression names which one broke.
   */
  test('M8/M9: the write-shape probe sees all four spellings, including the two that beat the quoted scan', () => {
    expect(WRITE_SHAPE_SPELLINGS)
      .toEqual(['property', 'quoted', 'shorthand', 'token-in-string-literal']);

    expect(writeShapesIn('const out = { ancientRuin: true };', 'ancientRuin')).toEqual(['property']);
    expect(writeShapesIn("const KEYS = ['ancientRuin'];", 'ancientRuin')).toEqual(['quoted']);
    // ⚠ BLINDNESS ONE — shorthand inside a CONDITIONAL SPREAD. This is the exact
    // shape of src/generators/historyGenerator.js:888, where neither
    // `ancientRuin:` nor `'ancientRuin'` occurs anywhere in the estate.
    expect(writeShapesIn('return { ...base, ...(ancientRuin ? { ancientRuin } : {}) };', 'ancientRuin'))
      .toEqual(['shorthand']);
    // ⚠ BLINDNESS TWO — a bare token inside a space-joined string literal. This
    // is the shape of src/store/configSlice.js:82; the quoted scan returns ZERO.
    expect(writeShapesIn("const FIELDS = ('deityCount latentPantheon pantheon').split(' ');", 'latentPantheon'))
      .toEqual(['token-in-string-literal']);

    // ── THE NEGATIVE CONTROLS, which are what make the probe mean anything ────
    // A member READ is not a write, and a longer identifier that merely CONTAINS
    // the key is not the key. Without these the probe would "find" a writer for
    // every key in the estate and the exemption evidence would be vacuous.
    expect(writeShapesIn('const v = settlement.ancientRuin;', 'ancientRuin')).toEqual([]);
    expect(writeShapesIn('const notAncientRuin = 1; foo.ancientRuin;', 'ancientRuin')).toEqual([]);
    expect(writeShapesIn('const x = { ancientRuins: 1 };', 'ancientRuin')).toEqual([]);
    // A whitespace-bearing "key" cannot be probed at all — it is not an identity.
    expect(() => writeShapesIn('anything', 'two words')).toThrow(/whitespace-free key/);
  });

  /**
   * ⭐⭐⭐ M8/M9 — THE EXPLAINED-WRITER BANK IS A DECLARED, FROZEN SET.
   *
   * The exact-equality pin is authenticity: membership or ruling movement
   * requires a governed instrument mint rather than ordinary maintenance.
   * Beside it, the three refusals that make the declaration a law rather than a
   * list — an undeclared mechanism, a class-(a) TRUE POSITIVE, and gate 4's
   * open-spread tolerance, which admits every key generically and so names none.
   */
  test('M8/M9: the explained-writer exemption is an exact declared set, and gate 4 is REFUSED as a basis', () => {
    expect(EXPLAINED_WRITER_EXEMPTIONS.map(({ identity }) => identity)).toEqual([
      'factions on locks',
      'neighbourNetwork on settlement',
      'stresses on settlement',
      'worldPulse on campaignState',
    ]);
    expect(EXPLAINED_WRITER_EXEMPTIONS.map(({ mechanism }) => mechanism)).toEqual([
      'admission-list', 'save-time-writer', 'admission-list', 'save-time-writer',
    ]);
    expect(EXPLAINED_WRITER_EXEMPTIONS.map(({ writer }) => writer)).toEqual([
      'src/components/dossier/LockControls.jsx',
      'src/lib/saves.js',
      'src/domain/settlement.schema.js',
      'src/store/campaignPulseHelpers.js',
    ]);
    // ⚠⚠ THE ONE ROW RE-TRIAGED OUT OF CLASS (a), PINNED IN BOTH DIRECTIONS.
    // `factions on locks` was banked as a true positive on evidence that turned
    // out to be a grep artifact, and the two acts — removing it from the guard
    // set and declaring it here — cannot be separated: the declaration below
    // throws at module load while the identity is still guarded. Pinning both
    // halves is what stops a later lane from restoring one without the other.
    // ⚠ ANCHORED, and the anchor is chosen to travel the SAME path: a bare
    // `not.toContain` would pass just as happily if the whole guard set drifted
    // away, so `institutions on locks` — the sibling row on the SAME `locks`
    // shape, which must still be guarded — is what proves the set is live.
    expectAbsentWithAnchor(
      CLASS_A_PROTECTED_IDENTITIES, 'factions on locks', 'institutions on locks',
      'CR-OSR-SCHEMA-6 re-triage',
    );
    expect(assertExplainedWriterExemptions()).toBe(EXPLAINED_WRITER_EXEMPTIONS);

    const entryOf = (overrides) => [{
      identity: 'someKey on someShape',
      mechanism: 'save-time-writer',
      writer: 'src/lib/saves.js',
      ruling: 'test',
      why: 'a reason long enough to satisfy the substantive-reason floor on this entry',
      ...overrides,
    }];
    // ⛔ GATE 4. `{ ...settlement }` tolerates ANY key, so admitting on it would
    // retire every settlement-root row and mean nothing. The predicate is TOTAL:
    // an unlisted mechanism is refused rather than an enumerated set of bad ones.
    expect(() => assertExplainedWriterExemptions(entryOf({ mechanism: 'open-spread' })))
      .toThrow(/undeclared mechanism[\s\S]*OPEN-SPREAD tolerance is REFUSED/);
    // ⛔ A row banked as a real defect can never be exempted as "explained".
    expect(() => assertExplainedWriterExemptions(entryOf({ identity: CLASS_A_PROTECTED_IDENTITIES[0] })))
      .toThrow(/class-\(a\)[\s\S]*re-triage/);
    expect(() => assertExplainedWriterExemptions(entryOf({ identity: 'notAnIdentity' })))
      .toThrow(/must be "<key> on <shape>"/);
    expect(() => assertExplainedWriterExemptions(entryOf({ why: 'too short' })))
      .toThrow(/lacks a ruling and a substantive reason/);
    expect(() => assertExplainedWriterExemptions(entryOf({ writer: 'scripts/lib/saves.js' })))
      .toThrow(/repository-relative src\/ writer/);
  });

  /**
   * ⭐⭐ GATE 0, EXECUTED — the half that cannot rot. The declaration above is an
   * ARGUMENT; this is the machinery that turns a writer which was deleted,
   * renamed or refactored away into a RED scan instead of a silent hole in the
   * enforcement surface.
   */
  test('M8/M9: a named writer that stopped writing the key makes the exemption STALE and reds', () => {
    // The live estate satisfies gate 0 today, and it says WHICH spelling proved it.
    const evidence = assertExplainedWriterEvidence();
    expect(evidence.map(({ identity }) => identity)).toEqual([
      'factions on locks',
      'neighbourNetwork on settlement',
      'stresses on settlement',
      'worldPulse on campaignState',
    ]);
    expect(evidence.map(({ key }) => key))
      .toEqual(['factions', 'neighbourNetwork', 'stresses', 'worldPulse']);
    // ⚠ EVERY entry, not just the first: an evidence array where one row proved
    // itself and three were never probed is the shape this loop exists to refuse.
    expect(evidence.filter(({ spellings }) => !spellings.length)).toEqual([]);

    // ── THE MUTANT: the named writer no longer mentions the key at all ────────
    // ⚠ DRIVEN ON ONE NAMED ENTRY rather than on the whole set, so the message
    // pins below stay bound to a KNOWN subject. Blanking every writer would red
    // on whichever entry sorts first, and the assertions would then be pinning
    // the sort order instead of the staleness.
    const only = (identity) => EXPLAINED_WRITER_EXEMPTIONS.filter((e) => e.identity === identity);
    let raised = null;
    try {
      assertExplainedWriterEvidence(only('neighbourNetwork on settlement'), {
        readSource: () => 'export const nothing = 1;\n',
      });
    } catch (error) {
      raised = error;
    }
    expect(raised, 'the writer stopped writing the key and gate 0 did not fire').toBeInstanceOf(Error);
    // THE MESSAGE MUST NAME THE ACTUAL CAUSE — the identity, the file, and the
    // choice between re-pointing and DELETING, because those are different acts.
    expect(raised.message).toContain('neighbourNetwork on settlement');
    expect(raised.message).toContain('src/lib/saves.js');
    expect(raised.message).toContain('STALE');
    expect(raised.message).toMatch(/must be DELETED, not repaired/);

    // ⚠⚠ AND EVERY OTHER ENTRY IS REACHED BY THE SAME LOOP, driven one at a
    // time. Without this, three of the four exemptions could have an unprobed
    // writer and the pin above would still be green — the exact vacuity that
    // makes a four-entry set riskier than the one-entry set it replaced.
    for (const { identity, writer } of EXPLAINED_WRITER_EXEMPTIONS) {
      expect(() => assertExplainedWriterEvidence(only(identity), {
        readSource: () => 'export const nothing = 1;\n',
      }), `${identity} did not go STALE when ${writer} stopped writing its key`)
        .toThrow(/is STALE/);
    }

    // …and a writer that cannot be read at all is a distinct, named failure.
    expect(() => assertExplainedWriterEvidence(undefined, {
      readSource: () => { throw new Error('ENOENT'); },
    })).toThrow(/names a writer that cannot be read/);
  });

  /**
   * ⭐⭐ THE FILTER ITSELF. Same contract as the shape-family filter: it returns a
   * SUBSET and passes `stats` through BY IDENTITY, which is what makes it
   * structurally impossible for an exemption to move the anti-vacuity floor.
   */
  test('M8/M9: the explained-writer exemption is an exact declared set and banks findings by reference', () => {
    const stats = leafStats();
    const rows = [
      leafFindingOf({ key: 'neighbourNetwork', shapes: ['settlement'] }),
      leafFindingOf({ key: 'neighbourNetwork', shapes: ['somethingElse'], pos: 20 }),
      leafFindingOf({ key: 'genuinelyDead', shapes: ['settlement'], pos: 30 }),
    ];
    const filtered = applyExplainedWriterFilter({
      scanMode: BASELINE_SCAN_MODE, scan: { findings: rows, stats },
    });
    // ⚠ THE EXEMPTION IS SHAPE-QUALIFIED, not key-qualified: the same key on a
    // DIFFERENT shape is untouched, because the declared writer wrote it onto
    // one record and says nothing about any other.
    expect(filtered.findings).toBe(rows);
    expect(filtered.findings.map(identityOf)).toEqual([
      'neighbourNetwork on settlement',
      'neighbourNetwork on somethingElse',
      'genuinelyDead on settlement',
    ]);
    expect(filtered.explainedWriters.banked).toBe(1);
    expect(filtered.explainedWriters.bankedIdentities).toEqual(['neighbourNetwork on settlement']);
    // BY IDENTITY, not by value.
    expect(filtered.stats).toBe(stats);

    const exact = applyExplainedWriterFilter({
      scanMode: 'exact-origin', scan: { findings: rows, stats },
    });
    expect(exact.findings).toBe(rows);
    expect(exact.explainedWriters.applied).toBe(false);
  });

  /**
   * ⭐⭐⭐ THE MEASURED CASE THAT FORCED THIS MINT, DRIVEN THROUGH THE WHOLE GATE.
   * `src/components/townMap/edgeAnnotations.js` moved off the genuinely dead
   * `settlement.neighbors` onto the real `settlement.neighbourNetwork`, and the
   * instrument correctly refused the maintenance write because an identity SWAP
   * is GROWTH. The exemption banks it BY RULE, so the NEXT save-time read costs
   * nobody a migration — and the paired negative control proves the gate still
   * reds on a new identity that no declared writer explains.
   */
  test('A3/A4: banked growth stays red ordinarily and only a reasoned tagged write can raise it', async () => {
    // ⚠ A REAL FILE, because gate mode's stale-row arm asks the FILESYSTEM
    // whether a frozen row's file still exists. `src/probe.js` — the fixture path
    // every other test here uses — is fictional, so it reads as "deleted or
    // moved" and reds for a reason that has nothing to do with the exemption.
    const file = 'src/lib/saves.js';
    const held = leafFindingOf({ file, key: 'ghost', shapes: ['record'] });
    const exempted = leafFindingOf({ file, key: 'neighbourNetwork', shapes: ['settlement'], pos: 40 });
    const unexplained = leafFindingOf({ file, key: 'neighbourNetworks', shapes: ['settlement'], pos: 40 });

    const exemptRun = maintenanceRuntime({ current: [held, exempted], frozen: [held] });
    expect(await run([], exemptRun.overrides)).toBe(1);
    const ordinaryWrite = maintenanceRuntime({ current: [held, exempted], frozen: [held] });
    await expect(run(['--write'], ordinaryWrite.overrides)).rejects.toThrow(/shrink-only/);

    const reasoned = maintenanceRuntime({ current: [held, exempted], frozen: [held] });
    await expect(run([
      '--write', '--raise-explained-writer=CR-H26 focused maintenance',
    ], reasoned.overrides)).resolves.toBe(0);
    expect(reasoned.baselineWrites).toHaveLength(1);
    expect(reasoned.baselineWrites[0].rowTags[file]['neighbourNetwork on settlement'])
      .toEqual({ reason: 'CR-H26 focused maintenance', rule: 'explained-writer' });

    // ── THE NEGATIVE CONTROL: same file, same shape, same position, one letter
    // different — so the ONLY thing that changed is membership of the declared
    // exemption. Without this pair, a gate that passed everything would look
    // identical to this one.
    const unexplainedRun = maintenanceRuntime({ current: [held, unexplained], frozen: [held] });
    await expect(run([
      '--write', '--raise-explained-writer=CR-H26 focused maintenance',
    ], unexplainedRun.overrides)).rejects.toThrow(/only tagged explained-writer rows/);

    const noOp = maintenanceRuntime({ current: [held], frozen: [held] });
    await expect(run([
      '--write', '--raise-explained-writer=CR-H26 focused maintenance',
    ], noOp.overrides)).rejects.toThrow(/requires at least one actual/);
    expect(() => commandOf(['--raise-explained-writer=reason']))
      .toThrow(/only with ordinary --write/);
    expect(() => commandOf(['--write', '--raise-explained-writer= first']))
      .toThrow(/trimmed single-line/);
    expect(() => commandOf(['--write', `--raise-explained-writer=${'x'.repeat(241)}`]))
      .toThrow(/1-240/);
    expect(() => commandOf(['--write', '--raise-explained-writer=first\nsecond']))
      .toThrow(/single-line/);
  });

  /**
   * GATE 1 — `git log --all -S"<key>:" -- src/` returning ZERO means no human
   * ever supplied the field, so an authored-input (M8) story is IMPOSSIBLE. It
   * can only CLOSE the hypothesis, never open it, which is why it is a
   * triage-lane obligation and deliberately not a per-run gate check: history is
   * the one input in this instrument that no manifest content-addresses.
   */
  test('M8/M9: gate 1 — the authored-input history probe separates a written key from an invented one', () => {
    expect(authoredInputHistoryCommits('neighbourNetwork').length).toBeGreaterThan(0);
    // The paired control. A key nobody ever wrote returns the empty history that
    // makes the M8 hypothesis impossible — the same answer the M8 re-audit got
    // for `notability`, which is how its founding case was refuted.
    expect(authoredInputHistoryCommits('zzzNoSuchObservedShapeKeyEverzzz')).toEqual([]);
    expect(() => authoredInputHistoryCommits('two words')).toThrow(/whitespace-free key/);
  });

  /**
   * ⭐⭐ THE SCHEMA-4 / SCHEMA-5 SPLIT. One envelope law, two numbers. Sharing the
   * law is right here and wrong for schema 3 (see observed-shape-baseline.mjs's
   * header): 4 and 5 have the IDENTICAL envelope and differ only in the finding-set
   * PRODUCER, so two copies would be one live law with two homes. What must never
   * be shared is the NUMBER — pinned here in BOTH directions.
   */
  test('A5: schemas 4-6 retain the numeric law and schema 7 adds authenticated row tags', () => {
    expect(BASELINE_SCHEMA).toBe(8);
    expect(RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA).toBe(7);
    expect(RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA).toBe(4);
    expect(RETIRED_FILTERED_LEAF_BASELINE_SCHEMA).toBe(5);
    expect(RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA).toBe(6);

    const corpus = healthyCorpus();
    const stats = leafStats();
    const live = validBaseline({ corpus, stats, frozen: [leafFindingOf()] });
    expect(live.schema).toBe(BASELINE_SCHEMA);
    expect(validateSchema8Baseline(live)).toBe(live);
    expect(assertExplainedWriterRowTags(live)).toBe(live);
    expect(() => validateSchema4Baseline(live)).toThrow(/noncanonical fields/);
    expect(() => validateSchema5Baseline(live)).toThrow(/noncanonical fields/);

    const numeric = structuredClone(live);
    delete numeric.rowTags;
    delete numeric.digests.rowTags;
    const unfiltered = { ...numeric, schema: RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA };
    expect(validateSchema4Baseline(unfiltered)).toBe(unfiltered);
    expect(() => validateSchema8Baseline(unfiltered)).toThrow();

    const filtered = { ...numeric, schema: RETIRED_FILTERED_LEAF_BASELINE_SCHEMA };
    expect(validateSchema5Baseline(filtered)).toBe(filtered);
    expect(() => validateSchema8Baseline(filtered)).toThrow();

    const surface = { ...numeric, schema: RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA };
    expect(validateSchema6Baseline(surface)).toBe(surface);
    expect(() => validateSchema8Baseline(surface)).toThrow(/noncanonical fields/);

    const retiredBanked = { ...structuredClone(live), schema: RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA };
    expect(validateSchema7Baseline(retiredBanked)).toBe(retiredBanked);
    expect(() => validateSchema8Baseline(retiredBanked)).toThrow();

    const missing = structuredClone(live);
    const declared = leafFindingOf({
      file: 'src/lib/saves.js', key: 'neighbourNetwork', shapes: ['settlement'],
    });
    const declaredBaseline = validBaseline({ corpus, stats, frozen: [declared] });
    delete declaredBaseline.rowTags['src/lib/saves.js']['neighbourNetwork on settlement'];
    delete declaredBaseline.rowTags['src/lib/saves.js'];
    declaredBaseline.digests.rowTags = digestOf(declaredBaseline.rowTags);
    expect(() => assertExplainedWriterRowTags(declaredBaseline)).toThrow(/lacks its row tag/);
    missing.rowTags['src/probe.js'] = {
      'ghost on record': { reason: 'forged', rule: 'explained-writer' },
    };
    missing.digests.rowTags = digestOf(missing.rowTags);
    expect(() => assertExplainedWriterRowTags(missing)).toThrow(/forged/);

    const wrongGenesisReason = validBaseline({ corpus, stats, frozen: [declared] });
    wrongGenesisReason.rowTags['src/lib/saves.js']['neighbourNetwork on settlement'].reason = 'forged genesis reason';
    wrongGenesisReason.digests.rowTags = digestOf(wrongGenesisReason.rowTags);
    expect(() => assertExplainedWriterRowTags(wrongGenesisReason))
      .toThrow(/migration-genesis tag reason disagrees/);

    const later = validBaseline({ corpus, stats, frozen: [declared] });
    later.frozenAtSha = MAINTENANCE_SHA;
    later.rowTags['src/lib/saves.js']['neighbourNetwork on settlement'].reason = 'valid later reason';
    later.digests.rowTags = digestOf(later.rowTags);
    const forgedSameCount = structuredClone(later);
    forgedSameCount.rowTags['src/lib/saves.js']['neighbourNetwork on settlement'].reason = 'forged without growth';
    forgedSameCount.digests.rowTags = digestOf(forgedSameCount.rowTags);
    expect(() => assertExplainedWriterTagTransition(later, forgedSameCount))
      .toThrow(/changed without numeric growth/);
    const grown = structuredClone(forgedSameCount);
    grown.inventory['src/lib/saves.js']['neighbourNetwork on settlement'] += 1;
    grown.total += 1;
    grown.digests.inventory = digestOf(grown.inventory);
    expect(assertExplainedWriterTagTransition(later, grown)).toBe(grown);
  });

  /**
   * ⭐⭐ CR-OSR-FREEZE-4-R1's step-1 blocker, cured: the heuristic leg can execute
   * its OWN corpus. `--scan-mode=legacy-leaf` used to demand
   * `--corpus-artifact=<validated exact-origin artifact>` — an input that can no
   * longer be produced, since a full-tree exact scan walls. The leg that became
   * the gate authority was therefore unrunnable on its own.
   */
  test('the HEURISTIC leg executes its own corpus with no --corpus-artifact', async () => {
    const corpus = healthyCorpus();
    const stats = leafStats();
    const findings = [leafFindingOf()];
    const runtime = scanRuntime({ corpus, findings, stats });
    let seenLegacy = null;
    runtime.overrides.scanLegacyReaders = (options) => {
      seenLegacy = options;
      return { findings, stats };
    };
    runtime.overrides.scanReaders = () => {
      throw new Error('the legacy leg must not invoke the exact resolver');
    };
    runtime.overrides.readJson = () => {
      throw new Error('the legacy leg must not read a corpus artifact it was not given');
    };

    expect(commandOf(['--scan-only', '--scan-mode=legacy-leaf', '--json=/tmp/h.json']))
      .toMatchObject({ mode: 'scan-only', scanMode: 'legacy-leaf', corpusArtifactPath: null });
    await expect(run([
      '--scan-only', '--scan-mode=legacy-leaf', '--json=/virtual/heuristic.json',
    ], runtime.overrides)).resolves.toBe(0);

    // The producers RAN — this is the whole cure. Without it the leg could only
    // borrow a corpus from an artifact nothing can mint.
    expect(runtime.calls).toContain('corpus');
    expect(seenLegacy.files).toEqual(['/repo/src/probe.js']);
    expect(runtime.writes[0].artifact).toMatchObject({
      scanMode: 'legacy-leaf',
      baselineSchema: artifactBaselineSchemaOf('legacy-leaf'),
      siteSchema: 'source-position-v1',
    });
    // ⚠ The ARTIFACT schema is 2 and the BASELINE schema in force is 8. They are
    // different numbers naming different things, and conflating them is what
    // `artifactBaselineSchemaOf` exists to prevent.
    expect(artifactBaselineSchemaOf('legacy-leaf')).toBe(2);
    expect(artifactBaselineSchemaOf('exact-origin')).toBe(3);
    expect(BASELINE_SCHEMA).toBe(8);
    expect(() => artifactBaselineSchemaOf('heuristic')).toThrow(/scan mode is unsupported/);
  });

  /**
   * ⭐⭐ CR-OSR-FREEZE-7 — the UNREVIEWED-UI cohort is DERIVED, never transcribed.
   * A restated figure rots away from the artifact it describes; this one cannot,
   * because it is computed from whichever inventory it is handed. The live
   * measured figure is pinned in the walker, against the real scan.
   */
  test('the UNREVIEWED-UI cohort is a derivation over the inventory, and it is TOTAL', () => {
    const inventory = {
      'src/components/Panel.jsx': { 'a on record': 2, 'b on record': 1 },
      'src/components/map/Layer.js': { 'c on record': 4 },
      'src/domain/rulingPower.js': { 'd on record': 9 },
    };
    expect(cohortOf(inventory)).toEqual({
      files: 2,
      identities: 3,
      counts: 7,
      paths: ['src/components/Panel.jsx', 'src/components/map/Layer.js'],
    });
    // The scopes are the EXACT instrument's exclusion list, so the cohort is
    // exactly "what the exact leg stopped resolving and the gate now enforces".
    expect(cohortOf(inventory, EXACT_SCAN_EXCLUDED_SCOPE).counts).toBe(7);
    // TOTALITY: cohort + complement conserves every identity and every count, so
    // a row can never be silently outside both.
    const all = cohortOf(inventory, ['']);
    expect(all.identities).toBe(4);
    expect(all.counts).toBe(16);
    expect(cohortOf(inventory, ['src/nothing/'])).toMatchObject({ files: 0, identities: 0, counts: 0 });
  });

  test('scan-only mode is admitted before corpus execution only with a JSON target', async () => {
    let corpusCalls = 0;
    expect(commandOf(['--scan-only', '--json=/tmp/scan.json'])).toMatchObject({
      mode: 'scan-only',
      jsonPath: '/tmp/scan.json',
      migrationReviewPath: null,
      scanMode: 'exact-origin',
    });
    await expect(run(['--scan-only'], {
      corpusFor: async () => { corpusCalls += 1; return healthyCorpus(); },
    })).rejects.toThrow(/requires a nonempty --json/);
    expect(corpusCalls).toBe(0);
    expect(() => commandOf(['--scan-only', '--json=/tmp/x.json', '--write']))
      .toThrow(/cannot be combined/);
    expect(() => commandOf(['--write', `--migrate-schema=${BASELINE_SCHEMA}`]))
      .toThrow(/requires --write and a nonempty --migration-review/);
    // ⚠ THE MIGRATION FLAG NAMES THE SCHEMA IN FORCE, so the RETIRED target's
    // flag is not merely refused — it is not a flag at all. A lane replaying a
    // schema-3 command line gets an unknown-argument refusal rather than a
    // migration into the wrong alphabet.
    expect(() => commandOf(['--write', '--migrate-schema=3']))
      .toThrow(/unknown governed CLI argument/);
    expect(() => commandOf(['--scan-only', '--scan-only', '--json=/tmp/x.json']))
      .toThrow(/duplicate governed CLI argument/);
    expect(() => commandOf(['--wat'])).toThrow(/unknown governed CLI argument/);
    expect(() => commandOf(['--json=/tmp/raw.json']))
      .toThrow(/only valid with --scan-only/);
  });

  test('retires raw corpus caches and rejects a HEAD transition during scan-only and freeze', async () => {
    const cached = scanRuntime();
    delete cached.overrides.corpusFor;
    const previous = process.env.OSR_CORPUS;
    process.env.OSR_CORPUS = '/tmp/untrusted-corpus.json';
    try {
      await expect(run(
        ['--scan-only', '--json=/virtual/cached.json'],
        cached.overrides,
      )).rejects.toThrow(/OSR_CORPUS is retired/);
    } finally {
      if (previous === undefined) delete process.env.OSR_CORPUS;
      else process.env.OSR_CORPUS = previous;
    }

    const moving = scanRuntime();
    let snapshots = 0;
    moving.overrides.repositoryHeadFor = () => (snapshots++ === 0
      ? SUBJECT_SHA
      : '2'.repeat(40));
    await expect(run(
      ['--scan-only', '--json=/virtual/moving.json'],
      moving.overrides,
    )).rejects.toThrow(/inputs or HEAD changed/);

    const held = leafFindingOf({ file: 'src/App.jsx', key: 'held' });
    const freeze = maintenanceRuntime({ current: [held], frozen: [held] });
    snapshots = 0;
    freeze.overrides.repositoryHeadFor = () => (snapshots++ === 0
      ? MAINTENANCE_SHA
      : '3'.repeat(40));
    await expect(run(['--write'], freeze.overrides)).rejects.toThrow(/inputs or HEAD changed/);
    expect(freeze.baselineWrites).toEqual([]);
  });

  test('scan-only refuses missing finding provenance and any traversal loss', async () => {
    const missingSite = scanRuntime({ findings: [findingOf({ site: '' })] });
    await expect(run(
      ['--scan-only', '--json=/virtual/missing.json'],
      missingSite.overrides,
    )).rejects.toThrow(/semantic-ast-v2 site address/);
    expect(missingSite.writes).toEqual([]);

    const missingOrigin = scanRuntime({ findings: [findingOf({ origins: [''] })] });
    await expect(run(
      ['--scan-only', '--json=/virtual/missing-origin.json'],
      missingOrigin.overrides,
    )).rejects.toThrow(/singleton shape\/origin provenance/);
    expect(missingOrigin.writes).toEqual([]);

    const lossyCorpus = healthyCorpus();
    lossyCorpus.graph.meta.depthTruncations = 1;
    const loss = scanRuntime({ corpus: lossyCorpus });
    await expect(run(
      ['--scan-only', '--json=/virtual/loss.json'],
      loss.overrides,
    )).rejects.toThrow(/lost provenance/);
    expect(loss.writes).toEqual([]);
  });

  /**
   * ⭐⭐ THE SCHEMA-4 GENESIS FREEZE, DRIVEN END TO END THROUGH THE REAL `run()`.
   *
   * The schema-3 freeze required BOTH detectors to reproduce their own bundled
   * artifact here. Schema 4 has ONE: the governed heuristic detector is the
   * authority, so the freeze re-executes it and demands byte equality against
   * BOTH bundle slots. That is not a weakened check — it is a stronger one, and
   * the exact leg is wired to throw so a regression that re-introduces the
   * (unrunnable) full-tree exact scan reds here rather than at a four-minute
   * growth wall on someone's gate.
   */
  test('schema migration freeze rebinds one reviewed bundle to the fresh clean HEAD scan', async () => {
    const corpus = healthyCorpus();
    const stats = leafStats();
    const findings = [leafFindingOf()];
    const trees = treeSetFor();
    const moduleEntry = trees.detectorTree.entries
      .find((entry) => entry.path === 'scripts/lib/legacy-reader-shape-scan.mjs');
    const legacyArtifact = createScanArtifact({
      scanMode: 'legacy-leaf',
      baselineSchema: 2,
      subjectSha: SUBJECT_SHA,
      scannerSha: SUBJECT_SHA,
      ...trees,
      scanConfig: SCAN_CONFIG,
      legacyAlgorithm: {
        baseSha: '6e7acc4dd88a43cb608f40bc77db3b2130a1e2de',
        sourceBlobSha: '0310fa9fdda873c1b382cf18c3936707e8e4addf',
        enrichment: 'node-name-start-v1',
        modulePath: moduleEntry.path,
        moduleSha256: moduleEntry.sha256,
      },
      corpus,
      findings,
      stats,
      sentinel: sentinelOf(corpus, stats, BASELINE_SCAN_MODE),
      inventory: artifactInventoryOf(BASELINE_SCAN_MODE, findings),
    });
    const predecessor = { schema: 2 };
    const predecessorText = `${canonicalJson(predecessor, 1)}\n`;
    const receipt = {
      ...heuristicReceiptFor(trees),
      predecessorBaselineDigest: digestOf(predecessor),
      predecessorBaselineTextSha256: createHash('sha256').update(predecessorText).digest('hex'),
      legacyArtifactDigest: digestOf(legacyArtifact),
      currentArtifactDigest: digestOf(legacyArtifact),
      targetInventoryDigest: legacyArtifact.digests.inventory,
      currentFindingsDigest: legacyArtifact.digests.findings,
      legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
      legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      currentDetectorDigest: legacyArtifact.provenance.detectorDigest,
      currentScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
    };
    // The bundle keeps both slots so nothing downstream needs a branch; under
    // schema 4 they hold the SAME artifact.
    const bundle = {
      predecessorBaseline: predecessor,
      currentArtifact: legacyArtifact,
      legacyArtifact,
    };
    const runtime = scanRuntime({ corpus, findings, stats });
    const baselineWrites = [];
    Object.assign(runtime.overrides, {
      baselineExists: () => true,
      readBaseline: () => predecessor,
      readBaselineText: () => predecessorText,
      writeBaseline: (value) => { baselineWrites.push(value); },
      scanReaders: () => {
        throw new Error('the schema-4 genesis must not invoke the exact resolver');
      },
      scanLegacyReaders: () => ({ findings, stats }),
      readJson: () => bundle,
      validateMigrationBundle: () => receipt,
    });

    await expect(run([
      '--write', `--migrate-schema=${BASELINE_SCHEMA}`, '--migration-review=/virtual/review-bundle.json',
    ], runtime.overrides)).resolves.toBe(0);
    expect(baselineWrites).toHaveLength(1);
    expect(baselineWrites[0]).toMatchObject({
      schema: BASELINE_SCHEMA,
      frozenAtSha: SUBJECT_SHA,
      migrationReview: receipt,
      scannerProvenance: { detectorDigest: legacyArtifact.provenance.detectorDigest },
    });
    expect(baselineWrites[0].inventory).toEqual(legacyArtifact.inventory);

    // ⚠⚠ NEGATIVE CONTROL — the re-execution is not decorative. A bundle whose
    // artifact does not reproduce byte-for-byte from the fresh scan is refused;
    // without this the whole freeze would trust the file it was handed.
    const forged = scanRuntime({ corpus, findings, stats });
    Object.assign(forged.overrides, {
      baselineExists: () => true,
      readBaseline: () => predecessor,
      readBaselineText: () => predecessorText,
      scanReaders: () => { throw new Error('exact resolver'); },
      scanLegacyReaders: () => ({
        findings: [leafFindingOf({ key: 'forged', text: 'row.forged' })], stats,
      }),
      readJson: () => bundle,
      validateMigrationBundle: () => receipt,
    });
    await expect(run([
      '--write', `--migrate-schema=${BASELINE_SCHEMA}`, '--migration-review=/virtual/review-bundle.json',
    ], forged.overrides)).rejects.toThrow(/do not exactly match the fresh governed heuristic detector/);

    const dirty = scanRuntime({ corpus, findings, stats });
    Object.assign(dirty.overrides, {
      baselineExists: () => true,
      readBaseline: () => predecessor,
      readBaselineText: () => predecessorText,
      dirtyInputsFor: () => ' M src/App.jsx',
      scanLegacyReaders: () => ({ findings, stats }),
      readJson: () => bundle,
      validateMigrationBundle: () => receipt,
    });
    await expect(run([
      '--write', `--migrate-schema=${BASELINE_SCHEMA}`, '--migration-review=/virtual/review-bundle.json',
    ], dirty.overrides)).rejects.toThrow(/requires clean committed inputs/);
  });

  test('the baseline identity is the HEURISTIC leaf, and its inventory rejects dormant headroom', () => {
    const finding = leafFindingOf({ file: 'src/App.jsx' });
    const identity = identityOf(finding);
    expect(identity).toBe('ghost on record');
    // ⚠⚠ THE RETIRED SPELLING CANNOT ENTER. `identityOf` refuses an exact
    // finding outright rather than leaf-spelling it, so a schema-3 artifact
    // cannot be quietly folded into a schema-4 inventory.
    expect(() => identityOf(findingOf({ file: 'src/App.jsx' })))
      .toThrow(/legacy finding has noncanonical fields/);

    const exact = compare([finding], { inventory: { [finding.file]: { [identity]: 1 } } });
    expect(exact.stale).toEqual([]);
    const lowered = compare([], { inventory: { [finding.file]: { [identity]: 1 } } });
    expect(lowered.stale).toEqual([
      expect.stringContaining(`schema ${BASELINE_SCHEMA} permits no dormant headroom`),
    ]);

    // MULTIPLICITY IS REAL, and it is still exact: two reads of the same leaf
    // identity in one file are ONE row with count 2, and a count of 1 under it
    // is stale rather than tolerated headroom.
    const twice = [finding, leafFindingOf({ file: 'src/App.jsx', line: 2, pos: 20 })];
    expect(compare(twice, { inventory: { [finding.file]: { [identity]: 2 } } }).stale).toEqual([]);
    expect(compare(twice, { inventory: { [finding.file]: { [identity]: 1 } } }).violations)
      .toHaveLength(1);
    expect(compare([finding], { inventory: { [finding.file]: { [identity]: 2 } } }).stale)
      .toHaveLength(1);
  });

  test('the schema-8 ordinary write admits only pure decreases, never growth or an identity swap', async () => {
    const held = leafFindingOf({ file: 'src/App.jsx', key: 'held', text: 'row.held' });
    const departed = leafFindingOf({
      file: 'src/App.jsx', line: 2, pos: 20, key: 'departed', text: 'row.departed',
    });
    const arrived = leafFindingOf({
      file: 'src/App.jsx', line: 3, pos: 30, key: 'arrived', text: 'row.arrived',
    });

    const decrease = maintenanceRuntime({ current: [held], frozen: [held, departed] });
    await expect(run(['--write'], decrease.overrides)).resolves.toBe(0);
    expect(decrease.baselineWrites).toHaveLength(1);
    expect(decrease.baselineWrites[0].inventory)
      .toEqual(artifactInventoryOf(BASELINE_SCAN_MODE, [held]));
    expect(decrease.baselineWrites[0].rowTags).toEqual({});
    expect(decrease.baselineWrites[0]._doc.join('\n')).toContain('governed --write re-freeze');
    expect(decrease.baselineWrites[0]._doc.join('\n')).toContain('never hand-edit');
    // The gate drove the HEURISTIC leg — not merely "some" leg.
    expect(decrease.calls).toContain('legacy-reader');

    const growth = maintenanceRuntime({ current: [held, arrived], frozen: [held] });
    await expect(run(['--write'], growth.overrides)).rejects.toThrow(/shrink-only/);
    expect(growth.baselineWrites).toEqual([]);

    const tagged = leafFindingOf({
      file: 'src/App.jsx', key: 'neighbourNetwork', shapes: ['settlement'],
    });
    const taggedSame = maintenanceRuntime({ current: [tagged], frozen: [tagged] });
    taggedSame.baseline.rowTags['src/App.jsx']['neighbourNetwork on settlement'].reason = 'preserved later reason';
    taggedSame.baseline.frozenAtSha = MAINTENANCE_SHA;
    taggedSame.baseline.digests.rowTags = digestOf(taggedSame.baseline.rowTags);
    await expect(run(['--write'], taggedSame.overrides)).resolves.toBe(0);
    expect(taggedSame.baselineWrites[0].rowTags['src/App.jsx']['neighbourNetwork on settlement'].reason)
      .toBe('preserved later reason');

    const taggedDuplicate = leafFindingOf({
      file: 'src/App.jsx', key: 'neighbourNetwork', shapes: ['settlement'], pos: 20,
    });
    const taggedShrink = maintenanceRuntime({
      current: [tagged], frozen: [tagged, taggedDuplicate],
    });
    taggedShrink.baseline.rowTags['src/App.jsx']['neighbourNetwork on settlement'].reason = 'preserved through shrink';
    taggedShrink.baseline.frozenAtSha = MAINTENANCE_SHA;
    taggedShrink.baseline.digests.rowTags = digestOf(taggedShrink.baseline.rowTags);
    await expect(run(['--write'], taggedShrink.overrides)).resolves.toBe(0);
    expect(taggedShrink.baselineWrites[0].rowTags['src/App.jsx']['neighbourNetwork on settlement'].reason)
      .toBe('preserved through shrink');

    const taggedGone = maintenanceRuntime({ current: [held], frozen: [held, tagged] });
    taggedGone.baseline.rowTags['src/App.jsx']['neighbourNetwork on settlement'].reason = 'preserved until gone';
    taggedGone.baseline.frozenAtSha = MAINTENANCE_SHA;
    taggedGone.baseline.digests.rowTags = digestOf(taggedGone.baseline.rowTags);
    await expect(run(['--write'], taggedGone.overrides)).resolves.toBe(0);
    expect(taggedGone.baselineWrites[0].rowTags).toEqual({});

    const swap = maintenanceRuntime({ current: [held, arrived], frozen: [held, departed] });
    await expect(run(['--write'], swap.overrides)).rejects.toThrow(/identity swap/);
    expect(swap.baselineWrites).toEqual([]);

    const drift = maintenanceRuntime({ current: [held], frozen: [held] });
    drift.baseline.scannerProvenance.detectorDigest = 'f'.repeat(64);
    drift.overrides.validateBaseline = () => drift.baseline;
    drift.overrides.assertExplainedWriterRowTags = () => drift.baseline;
    await expect(run(['--write'], drift.overrides)).rejects.toThrow(/detector or unscanned/);
    await expect(run([], drift.overrides)).resolves.toBe(1);
    expect(drift.baselineWrites).toEqual([]);
  });

  test('artifact validation derives inventory from findings and binds detector SHA to contents', () => {
    const runtime = scanRuntime();
    const corpus = healthyCorpus();
    const stats = healthyStats();
    const finding = findingOf();
    const sentinel = sentinelOf(corpus, stats);
    const trees = treeSetFor();
    const base = {
      scanMode: 'exact-origin',
      baselineSchema: 3,
      subjectSha: SUBJECT_SHA,
      scannerSha: SCANNER_SHA,
      ...trees,
      scanConfig: SCAN_CONFIG,
      corpus,
      findings: [finding],
      stats,
      sentinel,
    };
    expect(() => createScanArtifact({ ...base, inventory: {} }))
      .toThrow(/inventory is not derived from its findings/);

    const artifact = runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [artifactIdentityOf('exact-origin', finding)]: 1 } },
    });
    expect(corpusPayloadOf(artifact)).toBe(artifact.corpus);
    expect(corpusPayloadOf(corpus)).toBe(corpus);
    artifact.provenance.scannerSha = '3'.repeat(40);
    expect(() => validateScanArtifact(artifact)).toThrow(/provenance digest mismatch/);

    const forgedSentinel = structuredClone(runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [artifactIdentityOf('exact-origin', finding)]: 1 } },
    }));
    forgedSentinel.sentinel.totalKeys += 1;
    forgedSentinel.digests.sentinel = digestOf(forgedSentinel.sentinel);
    expect(() => validateScanArtifact(forgedSentinel))
      .toThrow(/sentinel is not derived/);

    const forgedOrigin = structuredClone(runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [artifactIdentityOf('exact-origin', finding)]: 1 } },
    }));
    forgedOrigin.findings[0].origins = ['root/missing'];
    forgedOrigin.inventory = artifactInventoryOf('exact-origin', forgedOrigin.findings);
    forgedOrigin.digests.findings = digestOf(forgedOrigin.findings);
    forgedOrigin.digests.inventory = digestOf(forgedOrigin.inventory);
    expect(() => validateScanArtifact(forgedOrigin)).toThrow(/absent from its corpus/);

    const noncanonical = runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [artifactIdentityOf('exact-origin', finding)]: 1 } },
    });
    noncanonical.unreviewed = true;
    expect(() => validateScanArtifact(noncanonical)).toThrow(/noncanonical fields/);
  });
});
