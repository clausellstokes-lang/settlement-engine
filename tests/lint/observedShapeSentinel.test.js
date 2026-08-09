import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import {
  commandOf,
  compare,
  corpusPayloadOf,
  identityOf,
  isObservedShapeScanPath,
  isObservedShapeSubjectPath,
  run,
  SCAN_CONFIG,
  sentinelFailures,
  sentinelOf,
} from '../../scripts/check-observed-shape-readers.mjs';
import {
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

const validBaseline = ({ corpus, stats, frozen }) => {
  const scanPath = frozen[0]?.file || 'src/probe.js';
  const trees = treeSetFor(scanPath);
  const sentinel = sentinelOf(corpus, stats);
  const inventory = artifactInventoryOf('exact-origin', frozen);
  const manifests = trees;
  const migrationReview = receiptFor(trees, digestOf(inventory));
  return {
    _doc: ['governed test fixture'],
    schema: 3,
    frozen: '2026-08-09',
    frozenAtSha: SUBJECT_SHA,
    minRows: 40,
    originMinRows: 8,
    corpusMeta: { generations: 1 },
    scanStats: stats,
    sentinel,
    total: frozen.length,
    identities: frozen.length,
    inventory,
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
      manifests: digestOf(manifests),
      migrationReview: digestOf(migrationReview),
    },
  };
};

const maintenanceRuntime = ({ current, frozen }) => {
  const corpus = healthyCorpus();
  const stats = healthyStats();
  const runtime = scanRuntime({ corpus, findings: current, stats });
  const baselineWrites = [];
  const baseline = validBaseline({ corpus, stats, frozen });
  Object.assign(runtime.overrides, {
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
    expect(events.map(({ phase }) => phase)).toEqual([
      'corpus-start',
      'corpus-complete',
      'scan-start',
      'read-start',
      'scan-complete',
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
    expect(() => commandOf(['--write', '--migrate-schema=3']))
      .toThrow(/requires --write and a nonempty --migration-review/);
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

    const held = findingOf({ file: 'src/App.jsx', site: siteOf('held'), key: 'held' });
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

  test('schema migration freeze rebinds one reviewed bundle to the fresh clean HEAD scan', async () => {
    const corpus = healthyCorpus();
    const stats = healthyStats();
    const findings = [findingOf()];
    const trees = treeSetFor();
    const currentArtifact = createScanArtifact({
      scanMode: 'exact-origin',
      baselineSchema: 3,
      subjectSha: SUBJECT_SHA,
      scannerSha: SUBJECT_SHA,
      ...trees,
      scanConfig: SCAN_CONFIG,
      corpus,
      findings,
      stats,
      sentinel: sentinelOf(corpus, stats),
      inventory: artifactInventoryOf('exact-origin', findings),
    });
    const legacyFindings = [{
      file: 'src/probe.js', line: 1, pos: 10, key: 'ghost', shapes: ['record'], text: 'row.ghost',
    }];
    const legacyStats = { files: 1, reads: 2, resolved: 1, unresolved: 1 };
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
      findings: legacyFindings,
      stats: legacyStats,
      sentinel: { usableShapes: 1, totalKeys: 1, resolvedReads: 1 },
      inventory: artifactInventoryOf('legacy-leaf', legacyFindings),
    });
    const predecessor = { schema: 2 };
    const predecessorText = `${canonicalJson(predecessor, 1)}\n`;
    const receipt = {
      ...receiptFor(trees),
      predecessorBaselineDigest: digestOf(predecessor),
      predecessorBaselineTextSha256: createHash('sha256').update(predecessorText).digest('hex'),
      legacyArtifactDigest: digestOf(legacyArtifact),
      currentArtifactDigest: digestOf(currentArtifact),
      targetInventoryDigest: currentArtifact.digests.inventory,
      currentFindingsDigest: currentArtifact.digests.findings,
      legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
      legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      currentDetectorDigest: currentArtifact.provenance.detectorDigest,
      currentScannerToolDigest: currentArtifact.provenance.scannerToolDigest,
    };
    const bundle = { predecessorBaseline: predecessor, currentArtifact, legacyArtifact };
    const runtime = scanRuntime({ corpus, findings, stats });
    const baselineWrites = [];
    Object.assign(runtime.overrides, {
      baselineExists: () => true,
      readBaseline: () => predecessor,
      readBaselineText: () => predecessorText,
      writeBaseline: (value) => { baselineWrites.push(value); },
      scanLegacyReaders: () => ({ findings: legacyFindings, stats: legacyStats }),
      readJson: () => bundle,
      validateMigrationBundle: () => receipt,
    });

    await expect(run([
      '--write', '--migrate-schema=3', '--migration-review=/virtual/review-bundle.json',
    ], runtime.overrides)).resolves.toBe(0);
    expect(baselineWrites).toHaveLength(1);
    expect(baselineWrites[0]).toMatchObject({
      schema: 3,
      frozenAtSha: SUBJECT_SHA,
      migrationReview: receipt,
      scannerProvenance: { detectorDigest: currentArtifact.provenance.detectorDigest },
    });

    const dirty = scanRuntime({ corpus, findings, stats });
    Object.assign(dirty.overrides, {
      baselineExists: () => true,
      readBaseline: () => predecessor,
      readBaselineText: () => predecessorText,
      dirtyInputsFor: () => ' M src/App.jsx',
      readJson: () => bundle,
      validateMigrationBundle: () => receipt,
    });
    await expect(run([
      '--write', '--migrate-schema=3', '--migration-review=/virtual/review-bundle.json',
    ], dirty.overrides)).rejects.toThrow(/requires clean committed inputs/);
  });

  test('identity includes the stable semantic site and exact inventories reject dormant headroom', () => {
    const finding = findingOf({ file: 'src/App.jsx' });
    const identity = identityOf(finding);
    expect(identity).toBe(`ghost on record @ root/record # ${siteOf()}`);
    expect(() => identityOf({ ...finding, site: '' })).toThrow(/semantic-ast-v2 site address/);

    const exact = compare([finding], { inventory: { [finding.file]: { [identity]: 1 } } });
    expect(exact.stale).toEqual([]);
    const lowered = compare([], { inventory: { [finding.file]: { [identity]: 1 } } });
    expect(lowered.stale).toEqual([
      expect.stringContaining('schema 3 permits no dormant headroom'),
    ]);
  });

  test('schema-3 write admits only pure decreases, never growth or an identity swap', async () => {
    const held = findingOf({ file: 'src/App.jsx', site: siteOf('held', 0), key: 'held' });
    const departed = findingOf({
      file: 'src/App.jsx', line: 2, pos: 20, site: siteOf('departed', 1), key: 'departed',
      text: 'row.departed',
    });
    const arrived = findingOf({
      file: 'src/App.jsx', line: 3, pos: 30, site: siteOf('arrived', 2), key: 'arrived',
      text: 'row.arrived',
    });

    const decrease = maintenanceRuntime({ current: [held], frozen: [held, departed] });
    await expect(run(['--write'], decrease.overrides)).resolves.toBe(0);
    expect(decrease.baselineWrites).toHaveLength(1);
    expect(decrease.baselineWrites[0].inventory)
      .toEqual(artifactInventoryOf('exact-origin', [held]));

    const growth = maintenanceRuntime({ current: [held, arrived], frozen: [held] });
    await expect(run(['--write'], growth.overrides)).rejects.toThrow(/shrink-only/);
    expect(growth.baselineWrites).toEqual([]);

    const swap = maintenanceRuntime({ current: [held, arrived], frozen: [held, departed] });
    await expect(run(['--write'], swap.overrides)).rejects.toThrow(/identity swap/);
    expect(swap.baselineWrites).toEqual([]);

    const drift = maintenanceRuntime({ current: [held], frozen: [held] });
    drift.baseline.scannerProvenance.detectorDigest = 'f'.repeat(64);
    drift.overrides.validateBaseline = () => drift.baseline;
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
      inventory: { 'src/probe.js': { [identityOf(finding)]: 1 } },
    });
    expect(corpusPayloadOf(artifact)).toBe(artifact.corpus);
    expect(corpusPayloadOf(corpus)).toBe(corpus);
    artifact.provenance.scannerSha = '3'.repeat(40);
    expect(() => validateScanArtifact(artifact)).toThrow(/provenance digest mismatch/);

    const forgedSentinel = structuredClone(runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [identityOf(finding)]: 1 } },
    }));
    forgedSentinel.sentinel.totalKeys += 1;
    forgedSentinel.digests.sentinel = digestOf(forgedSentinel.sentinel);
    expect(() => validateScanArtifact(forgedSentinel))
      .toThrow(/sentinel is not derived/);

    const forgedOrigin = structuredClone(runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [identityOf(finding)]: 1 } },
    }));
    forgedOrigin.findings[0].origins = ['root/missing'];
    forgedOrigin.inventory = artifactInventoryOf('exact-origin', forgedOrigin.findings);
    forgedOrigin.digests.findings = digestOf(forgedOrigin.findings);
    forgedOrigin.digests.inventory = digestOf(forgedOrigin.inventory);
    expect(() => validateScanArtifact(forgedOrigin)).toThrow(/absent from its corpus/);

    const noncanonical = runtime.overrides.createScanArtifact({
      ...base,
      inventory: { 'src/probe.js': { [identityOf(finding)]: 1 } },
    });
    noncanonical.unreviewed = true;
    expect(() => validateScanArtifact(noncanonical)).toThrow(/noncanonical fields/);
  });
});
