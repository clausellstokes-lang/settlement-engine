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
  RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA,
  RETIRED_CORPUS_COVERAGE_BASELINE_SCHEMA,
  RETIRED_EPOCH_DARK_CORPUS_BASELINE_SCHEMA,
  RETIRED_PROSE_REGEN_BASELINE_SCHEMA,
  RETIRED_TREASURY_ADMISSION_BASELINE_SCHEMA,
  RETIRED_GENESIS_TIES_BASELINE_SCHEMA,
  RETIRED_DEAD_DEPENDENCY_BASELINE_SCHEMA,
  RETIRED_PRESET_LIGHT_BASELINE_SCHEMA,
  RETIRED_STABLE_CORE_BASELINE_SCHEMA,
  RETIRED_COMPANION_GATE_BASELINE_SCHEMA,
  RETIRED_STRESS_TOPOLOGY_BASELINE_SCHEMA,
  RETIRED_LINEAGE_REANCHOR_BASELINE_SCHEMA,
  RETIRED_EXEMPTION_RETIREMENT_BASELINE_SCHEMA,
  RETIRED_BANK_FENCE_BASELINE_SCHEMA,
  RETIRED_EXACT_BASELINE_SCHEMA,
  validateSchema3Baseline,
  RETIRED_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
  validateSchema4Baseline,
  validateSchema5Baseline,
  validateSchema6Baseline,
  validateSchema7Baseline,
  validateSchema8Baseline,
  validateSchema9Baseline,
  validateSchema10Baseline,
  validateSchema11Baseline,
  validateSchema12Baseline,
  validateSchema13Baseline,
  validateSchema14Baseline,
  validateSchema15Baseline,
  validateSchema16Baseline,
  validateSchema17Baseline,
  validateSchema18Baseline,
  validateSchema19Baseline,
  validateSchema20Baseline,
  validateSchema21Baseline,
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
    // ⭐ SCHEMA 12 (lane T5-CURE, chair ruling ODQ §819). Schema 11's tagged topology
    // envelope re-governed to a SUBJECT TREE THAT GREW A NEW READER — a third kind of
    // rung again. 9 and 10 declared nothing; 11 bound a repaired DETECTOR; 12 changes no
    // detector semantics at all and exists only because the shrink-only `--write` cannot
    // express INVENTORY GROWTH and refuses it in those words. It admits three rows for
    // `src/domain/instantWorld/genesisDiplomacy.js`, one of them tagged BY RULE, and
    // declares NO new mechanism and NO new exemption.
    // ⭐ SCHEMA 13 (lane T5-CURE / TE-MINT-1, chair order ODQ §783.3/§788.2(d)/§821).
    // Schema 12's tagged topology envelope re-governed to a DEPENDENCY THAT LEFT — the
    // first rung driven by neither the detector nor the inventory. `three@0.185.1` had
    // zero importers; package.json and package-lock.json are deliberate detector inputs
    // ("a dependency bump can move the parser"), so only a migration can bind the new
    // bytes. Its reconciliation is EMPTY by construction, and measured so.
    // ⭐ SCHEMA 15 (lane T8, chair ruling R-T8-OSR option C). Schema 14's tagged topology
    // envelope re-governed to a CLASSIFIER THAT NO LONGER CALLS A RECORD A MAP: the
    // corpus builder's churn branch judged a node by a corner of it, so a fixed record
    // with two optional ledgers collapsed into an id-keyed map and its grandchildren's
    // keys landed on its own shape. The branch now states the guarantee its two sibling
    // branches already had. Classification-only, so its reconciliation is EMPTY — the
    // cured tip reproduces the schema-14 register row for row.
    // ⭐ SCHEMA 17 (lane OSR-SCHEMA17). Schema 16's tagged topology envelope re-governed to
    // a CORPUS THAT CAN OBSERVE A STRESS-GATED WRITER — the first rung since 8 whose
    // subject is the corpus builder. Unlike 13, 14, 15 and 16 its reconciliation is NOT
    // empty: it clears twelve frozen rows and adds none, because the readers it clears were
    // never dead, only unobserved.
    // ⭐ SCHEMA 18 (lane OSR-SCHEMA18). Schema 17's envelope re-governed to a migration
    // receipt whose SUBJECT COMMIT lies inside the lineage carrying the register: 17's
    // genesis was cherry-picked out of its own dock, so `validateBaselineHistory` could
    // reconstruct it from nothing here and refused the gate AND every `--write`.
    // Verdict-only like 13, 14, 15 and 16 — its reconciliation is EMPTY.
    // ⭐ SCHEMA 19 (owner order, 2026-09-17). Schema 18's envelope re-governed to a
    // declared M8/M9 bank of EIGHT: `factions on locks` is RETIRED because the owner's
    // order removing every dossier lock control deleted its named writer,
    // `src/components/dossier/LockControls.jsx`, and gate 0 refuses an entry whose writer
    // it cannot read. Like 17 and unlike 18 its reconciliation is NOT empty — six rows
    // move, five GONE and one DECREASED — but the CAUSE is inverted: 17 moved rows
    // because the instrument's reach GREW, this one because the ESTATE shrank.
    // ⭐ SCHEMA 20 (2026-09-18). Schema 19's envelope re-governed to a `--write` that
    // refuses to freeze a bank its hand-owned twins do not already state: the walker's
    // literal module on every write, the rung's own declared post-bank on a migration
    // write. The first rung whose subject is the WRITE rather than the detector, the
    // corpus, the receipt or the roster. Verdict-only like 13–16 and 18 — its
    // reconciliation is EMPTY, and inventory and rowTags are byte-identical to 19's.
    // ⭐ SCHEMA 21 (2026-09-18, ODQ §934.9). Schema 20's envelope, tag law and roster
    // UNCHANGED, re-governed to a register that ADMITS THREE ROWS — DS-REL-1's list
    // assembler, lit so the paid PDF's `relationships.network` prints on a saved world.
    // The first rung since 17 and 19 to move rows, the first EVER to move them UPWARD, and
    // the first to GROW the bank (60/39 -> 61/40), which is the bank fence's first real
    // exercise: 20 minted the fence and declared the same pair it inherited.
    expect(BASELINE_SCHEMA).toBe(21);
    expect(RETIRED_BANK_FENCE_BASELINE_SCHEMA).toBe(20);
    expect(RETIRED_EXEMPTION_RETIREMENT_BASELINE_SCHEMA).toBe(19);
    expect(RETIRED_LINEAGE_REANCHOR_BASELINE_SCHEMA).toBe(18);
    expect(RETIRED_GENESIS_TIES_BASELINE_SCHEMA).toBe(12);
    expect(RETIRED_TREASURY_ADMISSION_BASELINE_SCHEMA).toBe(11);
    expect(RETIRED_PROSE_REGEN_BASELINE_SCHEMA).toBe(10);
    expect(RETIRED_EPOCH_DARK_CORPUS_BASELINE_SCHEMA).toBe(9);
    expect(RETIRED_CORPUS_COVERAGE_BASELINE_SCHEMA).toBe(8);
    expect(RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA).toBe(7);
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
  baseline.schema = RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA;
  baseline.rowTags = {
    'src/probe.js': {
      [LEAF_IDENTITY]: { reason: 'CR-H26 test ruling', rule: 'explained-writer' },
    },
  };
  baseline.digests.rowTags = digestOf(baseline.rowTags);
  return baseline;
}

function validSchema8Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_CORPUS_COVERAGE_BASELINE_SCHEMA;
  return baseline;
}

function validSchema9Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_EPOCH_DARK_CORPUS_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-10 envelope, pinned to its own LITERAL number. It used to read
 *  `BASELINE_SCHEMA`, which was correct only while 10 was the live rung — the moment the
 *  authority moved to 11 that spelling would have silently re-pointed this fixture at the
 *  new number and stopped testing the retired one at all. */
function validSchema10Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_PROSE_REGEN_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-11 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 fixture above records: a retired fixture that reads `BASELINE_SCHEMA` stops
 *  testing the rung it is named after the moment the authority moves past it. */
function validSchema11Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_TREASURY_ADMISSION_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-12 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 and schema-11 fixtures above record. */
function validSchema12Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_GENESIS_TIES_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-13 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10, schema-11 and schema-12 fixtures above record. */
function validSchema13Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_DEAD_DEPENDENCY_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-14 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-13 fixtures above record. */
function validSchema14Baseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_PRESET_LIGHT_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-15 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-14 fixtures above record. */
function validSchema15Baseline_fixture() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_STABLE_CORE_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-16 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-15 fixtures above record. */
function validSchema16Baseline_fixture() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_COMPANION_GATE_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-17 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-16 fixtures above record. */
function validSchema17Baseline_fixture() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_STRESS_TOPOLOGY_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-18 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-17 fixtures above record. */
function validSchema18Baseline_fixture() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_LINEAGE_REANCHOR_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-19 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-18 fixtures above record. */
function validSchema19Baseline_fixture() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_EXEMPTION_RETIREMENT_BASELINE_SCHEMA;
  return baseline;
}

/** The RETIRED schema-20 envelope, pinned to its own LITERAL number for the reason the
 *  schema-10 through schema-19 fixtures above record. */
function validSchema20Baseline_fixture() {
  const baseline = validSchema7Baseline();
  baseline.schema = RETIRED_BANK_FENCE_BASELINE_SCHEMA;
  return baseline;
}

/** The LIVE envelope, whatever number is in force. */
function validLiveBaseline() {
  const baseline = validSchema7Baseline();
  baseline.schema = BASELINE_SCHEMA;
  return baseline;
}

function mutateSchema8(mutator) {
  const baseline = validSchema8Baseline();
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

function mutateSchema9(mutator) {
  const baseline = validSchema9Baseline();
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

/** Mutate the LIVE envelope. It reads the live fixture rather than the retired schema-10
 *  one because its callers feed the result to a real `run()`: a retired-schema baseline
 *  would be refused for its NUMBER before any malformation could be judged, and the test
 *  would pass for the wrong reason. */
function mutateSchema10(mutator) {
  const baseline = validLiveBaseline();
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
    // ⚠ THE FIXTURE MUST CARRY THE LIVE SCHEMA. A predecessor-schema envelope
    // returns 1 at the schema rung before the envelope law is ever reached, so
    // it would prove the wrong refusal — this test is about the ENVELOPE
    // validator running before the corpus, not about the schema check.
    const malformed = mutateSchema10((baseline) => { delete baseline.migrationReview; });
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
  // ⚠ TITLE HELD ACROSS THE SCHEMA-9 MINT — a test title is a census key, and a
  // rename is a delete-plus-add. Schemas 8 and 9 joined schema 7 in the tagged
  // half; the assertions below say so, the name does not have to.
  test('A5: schemas 4-6 keep numeric inventory and only schema 7 admits sparse rowTags', () => {
    const retired = validSchema7Baseline();
    const baseline = validSchema8Baseline();
    const epochDark = validSchema9Baseline();
    const proseRegen = validSchema10Baseline();
    const treasuryAdmission = validSchema11Baseline();
    const genesisTies = validSchema12Baseline();
    const deadDependency = validSchema13Baseline();
    const presetLight = validSchema14Baseline();
    const live = validLiveBaseline();
    expect(validateSchema7Baseline(retired)).toBe(retired);
    expect(validateSchema8Baseline(baseline)).toBe(baseline);
    expect(validateSchema9Baseline(epochDark)).toBe(epochDark);
    expect(validateSchema10Baseline(proseRegen)).toBe(proseRegen);
    expect(validateSchema11Baseline(treasuryAdmission)).toBe(treasuryAdmission);
    expect(validateSchema12Baseline(genesisTies)).toBe(genesisTies);
    expect(validateSchema13Baseline(deadDependency)).toBe(deadDependency);
    expect(validateSchema14Baseline(presetLight)).toBe(presetLight);
    // ⭐ 15 IS RETIRED AT §893.4 and now validates its OWN literal, so it is paired with a
    // schema-15 fixture rather than with `live` — the same move every rung makes when the
    // authority passes it. `live` belongs to 16 now.
    const stableCore = validSchema15Baseline_fixture();
    expect(validateSchema15Baseline(stableCore)).toBe(stableCore);
    // ⭐ 16 IS RETIRED at the schema-17 rung and now validates its OWN literal, so it too
    // is paired with a fixture rather than with `live`. `live` belongs to 17 now.
    const companionGate = validSchema16Baseline_fixture();
    expect(validateSchema16Baseline(companionGate)).toBe(companionGate);
    // ⭐ 17 IS RETIRED at the schema-18 rung and now validates its OWN literal, so it too
    // is paired with a fixture rather than with `live`. `live` belongs to 18 now.
    const stressTopology = validSchema17Baseline_fixture();
    expect(validateSchema17Baseline(stressTopology)).toBe(stressTopology);
    // ⭐ 18 IS RETIRED at the schema-19 rung and now validates its OWN literal, so it too
    // is paired with a fixture rather than with `live`. `live` belongs to 19 now.
    const lineageReanchor = validSchema18Baseline_fixture();
    expect(validateSchema18Baseline(lineageReanchor)).toBe(lineageReanchor);
    // ⭐ 19 IS RETIRED at the schema-20 rung and now validates its OWN literal, so it too
    // is paired with a fixture rather than with `live`. `live` belongs to 20 now.
    const exemptionRetirement = validSchema19Baseline_fixture();
    expect(validateSchema19Baseline(exemptionRetirement)).toBe(exemptionRetirement);
    // ⭐ 20 IS RETIRED at the schema-21 rung and now validates its OWN literal, so it too
    // is paired with a fixture rather than with `live`. `live` belongs to 21 now.
    const bankFence = validSchema20Baseline_fixture();
    expect(validateSchema20Baseline(bankFence)).toBe(bankFence);
    expect(validateSchema21Baseline(live)).toBe(live);
    expect(() => validateSchema19Baseline(live)).toThrow(/is not schema 19/);
    expect(() => validateSchema20Baseline(live)).toThrow(/is not schema 20/);
    expect(() => validateSchema21Baseline(exemptionRetirement)).toThrow(/is not schema 21/);
    expect(() => validateSchema21Baseline(bankFence)).toThrow(/is not schema 21/);
    expect(() => validateSchema7Baseline(baseline)).toThrow(/is not schema 7/);
    expect(() => validateSchema8Baseline(retired)).toThrow(/is not schema 8/);
    // ⚠ EVERY ADJACENT PAIR IS PINNED IN BOTH DIRECTIONS FOR ONE REASON: FOUR
    // schemas now share one tagged envelope law, so the only thing keeping them
    // from meaning each other is the NUMBER each accepts. ⚠⚠ THE 9/10 PAIR IS
    // THE ONE THAT MATTERS MOST RIGHT NOW — schema 10 re-governs schema 9's
    // envelope with NOTHING ELSE CHANGED, so these two are byte-identical in
    // every field except the number, and a validator that shrugged at the
    // number would accept a stale freeze as a current one.
    expect(() => validateSchema9Baseline(baseline)).toThrow(/is not schema 9/);
    expect(() => validateSchema8Baseline(epochDark)).toThrow(/is not schema 8/);
    expect(() => validateSchema7Baseline(epochDark)).toThrow(/is not schema 7/);
    expect(() => validateSchema10Baseline(epochDark)).toThrow(/is not schema 10/);
    expect(() => validateSchema11Baseline(epochDark)).toThrow(/is not schema 11/);
    // …and the LIVE validator names 12, so every retired rung above keeps its own number.
    // ⚠ THE 11/12 PAIR IS NOW THE TIGHTEST ONE: schema 12 re-governs schema 11's envelope
    // with NOTHING ELSE CHANGED — not even a detector byte — so these two are identical in
    // every field except the number, and only the number keeps a stale freeze from
    // validating as a current one.
    expect(() => validateSchema12Baseline(epochDark)).toThrow(/is not schema 12/);
    expect(() => validateSchema11Baseline(live)).toThrow(/is not schema 11/);
    expect(() => validateSchema12Baseline(treasuryAdmission)).toThrow(/is not schema 12/);
    // ⚠ THE 12/13 PAIR: schema 13 re-governs schema 12's envelope with NOT ONE row moved —
    // the two baselines differ in the schema number and the recorded package digests and in
    // nothing else.
    expect(() => validateSchema13Baseline(epochDark)).toThrow(/is not schema 13/);
    expect(() => validateSchema13Baseline(genesisTies)).toThrow(/is not schema 13/);
    // ⚠⚠ THE 13/14 PAIR: schema 14 re-governs schema 13's envelope with NOT ONE row moved
    // AND NOT ONE recorded digest differing outside the three instrument files — a widened
    // detector clause that convicts nothing in the live manifest leaves the two baselines
    // identical in every field except the number and the scanner provenance.
    expect(() => validateSchema14Baseline(epochDark)).toThrow(/is not schema 14/);
    expect(() => validateSchema14Baseline(genesisTies)).toThrow(/is not schema 14/);
    expect(() => validateSchema14Baseline(deadDependency)).toThrow(/is not schema 14/);
    expect(() => validateSchema13Baseline(presetLight)).toThrow(/is not schema 13/);
    // …and the LIVE validator names 15. ⚠⚠ THE 14/15 PAIR IS AS TIGHT AS 13/14 WAS AND FOR
    // the same reason: schema 15's rung is CLASSIFICATION-ONLY, so the cured register
    // reproduces schema 14's row for row and the two baselines differ in the number and
    // the scanner provenance ALONE. The number is the only thing keeping a stale freeze
    // from validating as a current one.
    expect(() => validateSchema15Baseline(epochDark)).toThrow(/is not schema 15/);
    expect(() => validateSchema15Baseline(genesisTies)).toThrow(/is not schema 15/);
    expect(() => validateSchema15Baseline(deadDependency)).toThrow(/is not schema 15/);
    expect(() => validateSchema15Baseline(presetLight)).toThrow(/is not schema 15/);
    expect(() => validateSchema14Baseline(live)).toThrow(/is not schema 14/);
    expect(() => validateSchema13Baseline(live)).toThrow(/is not schema 13/);
    expect(() => validateSchema12Baseline(live)).toThrow(/is not schema 12/);
    expect(() => validateSchema9Baseline(live)).toThrow(/is not schema 9/);
    expect(() => validateSchema8Baseline(live)).toThrow(/is not schema 8/);
    expect(() => validateSchema7Baseline(live)).toThrow(/is not schema 7/);
    expect(typeof baseline.inventory['src/probe.js'][LEAF_IDENTITY]).toBe('number');
    for (const [schema, validate] of [
      [RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA, validateSchema4Baseline],
      [RETIRED_FILTERED_LEAF_BASELINE_SCHEMA, validateSchema5Baseline],
      [RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA, validateSchema6Baseline],
    ]) {
      expect(() => validate({ ...baseline, schema })).toThrow(/noncanonical fields/);
      expect(() => validate({ ...epochDark, schema })).toThrow(/noncanonical fields/);
      expect(() => validate({ ...live, schema })).toThrow(/noncanonical fields/);
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
    expect(() => validateSchema8Baseline(mutateSchema8(mutator))).toThrow();
    expect(() => validateSchema9Baseline(mutateSchema9(mutator))).toThrow();
    expect(() => validateSchema10Baseline(mutateSchema10(mutator))).toThrow();
  });

  test('A5 independently integrity-binds the sparse tag map', () => {
    const baseline = validSchema7Baseline();
    baseline.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'changed after signing';
    expect(() => validateSchema7Baseline(baseline)).toThrow(/rowTags digest mismatch/);
    const retired = validSchema8Baseline();
    retired.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'changed after signing';
    expect(() => validateSchema8Baseline(retired)).toThrow(/rowTags digest mismatch/);
    const epochDark = validSchema9Baseline();
    epochDark.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'changed after signing';
    expect(() => validateSchema9Baseline(epochDark)).toThrow(/rowTags digest mismatch/);
    const live = validSchema10Baseline();
    live.rowTags['src/probe.js'][LEAF_IDENTITY].reason = 'changed after signing';
    expect(() => validateSchema10Baseline(live)).toThrow(/rowTags digest mismatch/);
  });
});
