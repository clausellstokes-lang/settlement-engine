#!/usr/bin/env node
/**
 * Evaluate the 3D settlement-presentation promotion contract.
 *
 * This audit is intentionally evidence-conservative. It does not run a few
 * local tests and rename them "certification"; it validates receipts produced by
 * the automated, rendered, device, accessibility, user-study, and soak programs
 * named in docs/TOWN_SCENE_PROMOTION_CONTRACT.json.
 *
 * Missing evidence is a normal pre-promotion state. The default invocation
 * writes an honest `withhold_default` receipt and exits successfully.
 * `--require-promotion` is the release-gate form and exits non-zero unless every
 * required gate has current, admissible evidence. An ineligible default-on flag
 * is always an error, with or without that option.
 */

import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  realpathSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  extname,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

import { FLAG_DEFAULTS } from '../../src/lib/flagRegistry.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CONTRACT_PATH = resolve(
  ROOT,
  'docs/TOWN_SCENE_PROMOTION_CONTRACT.json',
);
const EVIDENCE_ARTIFACT_ROOT = resolve(ROOT, 'artifacts/town-scene');
const SOURCE_EXTENSIONS = new Set([
  '.cjs',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.mts',
  '.sh',
  '.ts',
  '.tsx',
]);
const MODULE_SOURCE_EXTENSIONS = new Set([
  '.cjs',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
]);
const MODULE_RESOLUTION_EXTENSIONS = Object.freeze([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.json',
  '.css',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.wasm',
]);
const MAX_FUTURE_CLOCK_SKEW_MS = 5 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** Return the value after a named CLI option, or a fallback. */
function readArg(argv, name, fallback = null) {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 && argv[index + 1] != null
    ? argv[index + 1]
    : fallback;
}

/** Parse a JSON file and attach its path to malformed-input errors. */
function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(
      `Could not read valid JSON from ${path}: ${error.message}`,
      { cause: error },
    );
  }
}

/** Whether a resolved path remains inside the evidence-artifact directory. */
function isEvidenceArtifactPath(path) {
  return (
    path === EVIDENCE_ARTIFACT_ROOT
    || path.startsWith(`${EVIDENCE_ARTIFACT_ROOT}/`)
  );
}

/** Hash one referenced evidence artifact without interpreting its content. */
function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/**
 * Recursively collect relevant files from one contract source root.
 *
 * @param {string} absolutePath
 * @param {string[]} out
 */
function collectSourceFiles(absolutePath, out) {
  const stat = statSync(absolutePath);
  if (!stat.isDirectory()) {
    if (SOURCE_EXTENSIONS.has(extname(absolutePath))) {
      out.push(absolutePath);
    }
    return;
  }

  for (const entry of readdirSync(absolutePath).sort()) {
    const child = resolve(absolutePath, entry);
    const childStat = statSync(child);
    if (childStat.isDirectory()) {
      collectSourceFiles(child, out);
    } else if (SOURCE_EXTENSIONS.has(extname(child))) {
      out.push(child);
    }
  }
}

/** Select TypeScript's parser mode from a module's extension. */
function scriptKindFor(path) {
  switch (extname(path).toLowerCase()) {
    case '.js':
    case '.cjs':
    case '.mjs':
      return ts.ScriptKind.JS;
    case '.jsx':
      return ts.ScriptKind.JSX;
    case '.ts':
    case '.cts':
    case '.mts':
      return ts.ScriptKind.TS;
    case '.tsx':
      return ts.ScriptKind.TSX;
    default:
      return ts.ScriptKind.Unknown;
  }
}

/**
 * Extract every statically discoverable module/file dependency.
 *
 * TypeScript supplies the parser only; no typechecking or module resolution is
 * delegated to compiler configuration. In addition to ESM declarations, the
 * walk recognizes literal `require()` and `import()` calls and the
 * `new URL('./worker.js', import.meta.url)` form used by Vite workers. Dynamic
 * imports are included when their target is a literal because they still alter
 * the behavior being certified even though they preserve the loading boundary.
 *
 * @param {string} absolutePath
 * @returns {string[]}
 */
function localDependencySpecifiers(absolutePath) {
  if (!MODULE_SOURCE_EXTENSIONS.has(extname(absolutePath).toLowerCase())) {
    return [];
  }

  const source = readFileSync(absolutePath, 'utf8');
  const parsed = ts.createSourceFile(
    absolutePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(absolutePath),
  );
  if (parsed.parseDiagnostics.length > 0) {
    const diagnostic = parsed.parseDiagnostics[0];
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      '\n',
    );
    throw new Error(
      `Could not parse fingerprint dependency ${relative(ROOT, absolutePath)}: `
      + message,
    );
  }

  const specifiers = new Set();
  const addLiteral = (node) => {
    if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      && node.text.startsWith('.')
    ) {
      specifiers.add(node.text);
    }
  };

  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      && node.moduleSpecifier
    ) {
      addLiteral(node.moduleSpecifier);
    } else if (
      ts.isImportEqualsDeclaration(node)
      && ts.isExternalModuleReference(node.moduleReference)
      && node.moduleReference.expression
    ) {
      addLiteral(node.moduleReference.expression);
    } else if (
      ts.isCallExpression(node)
      && node.arguments.length === 1
      && (
        node.expression.kind === ts.SyntaxKind.ImportKeyword
        || (
          ts.isIdentifier(node.expression)
          && node.expression.text === 'require'
        )
      )
    ) {
      addLiteral(node.arguments[0]);
    } else if (
      ts.isNewExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === 'URL'
      && node.arguments?.length === 2
    ) {
      const [pathArgument, baseArgument] = node.arguments;
      if (
        ts.isPropertyAccessExpression(baseArgument)
        && baseArgument.name.text === 'url'
        && ts.isMetaProperty(baseArgument.expression)
        && baseArgument.expression.keywordToken === ts.SyntaxKind.ImportKeyword
        && baseArgument.expression.name.text === 'meta'
      ) {
        addLiteral(pathArgument);
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(parsed);
  return [...specifiers].sort();
}

/**
 * Resolve one repository-local module specifier without consulting aliases.
 *
 * Source in this repository uses explicit relative edges for local modules.
 * Query/hash suffixes are Vite loader metadata and do not participate in the
 * filesystem lookup. A missing relative dependency is a certification error:
 * silently omitting it would recreate the partial-hash defect this closure is
 * designed to eliminate.
 */
function resolveLocalDependency(importerPath, specifier) {
  const filesystemSpecifier = specifier.split(/[?#]/, 1)[0];
  const unresolvedBase = resolve(dirname(importerPath), filesystemSpecifier);
  if (
    unresolvedBase !== ROOT
    && !unresolvedBase.startsWith(`${ROOT}/`)
  ) {
    throw new Error(
      `Fingerprint dependency escapes the repository: `
      + `${relative(ROOT, importerPath)} -> ${specifier}`,
    );
  }

  const candidates = [unresolvedBase];
  if (extname(unresolvedBase) === '') {
    for (const extension of MODULE_RESOLUTION_EXTENSIONS) {
      candidates.push(`${unresolvedBase}${extension}`);
    }
    for (const extension of MODULE_RESOLUTION_EXTENSIONS) {
      candidates.push(resolve(unresolvedBase, `index${extension}`));
    }
  } else if (extname(unresolvedBase) === '.js') {
    // TypeScript permits source files to retain their emitted `.js` specifier.
    const sourceStem = unresolvedBase.slice(0, -3);
    candidates.push(
      `${sourceStem}.ts`,
      `${sourceStem}.tsx`,
      `${sourceStem}.mts`,
      `${sourceStem}.cts`,
    );
  }

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }

  throw new Error(
    `Unresolved local fingerprint dependency: `
    + `${relative(ROOT, importerPath)} -> ${specifier}`,
  );
}

/**
 * Expand entry files into the complete repository-local dependency closure.
 *
 * @param {string[]} entryFiles
 * @returns {string[]}
 */
function expandDependencyClosure(entryFiles) {
  const seen = new Set();
  const queue = [...new Set(entryFiles)].sort();

  while (queue.length > 0) {
    const absolutePath = queue.shift();
    if (seen.has(absolutePath)) continue;
    seen.add(absolutePath);

    for (const specifier of localDependencySpecifiers(absolutePath)) {
      const dependency = resolveLocalDependency(absolutePath, specifier);
      if (!seen.has(dependency)) queue.push(dependency);
    }
  }

  return [...seen].sort();
}

/**
 * Fingerprint the source that can change settlement-scene behavior.
 *
 * The contract owns the entry inventory. Every repository-local dependency
 * reachable from those entries is then included automatically, including
 * literal lazy imports and worker URL modules. This prevents a behavior change
 * in a shared dependency from preserving an obsolete promotion fingerprint.
 * File names and bytes are both hashed, eliminating concatenation ambiguity.
 *
 * @param {Record<string, unknown>} contract
 */
export function fingerprintTownSceneSource(contract) {
  if (!Array.isArray(contract?.sourceRoots)) {
    throw new Error('Promotion contract sourceRoots must be an array.');
  }

  const files = [];
  const missingOptionalRoots = [];
  for (const rootEntry of contract.sourceRoots) {
    const path = String(rootEntry?.path || '').trim();
    if (!path) throw new Error('Every sourceRoots entry needs a path.');
    const absolutePath = resolve(ROOT, path);
    if (!absolutePath.startsWith(`${ROOT}/`) && absolutePath !== ROOT) {
      throw new Error(`Source root escapes the repository: ${path}`);
    }
    if (!existsSync(absolutePath)) {
      if (rootEntry?.required === true) {
        throw new Error(`Required source root is missing: ${path}`);
      }
      missingOptionalRoots.push(path);
      continue;
    }
    collectSourceFiles(absolutePath, files);
  }

  const entryFiles = [...new Set(files)].sort();
  const uniqueFiles = expandDependencyClosure(entryFiles);
  if (uniqueFiles.length === 0) {
    throw new Error('Town-scene source fingerprint would cover zero files.');
  }

  const hash = createHash('sha256');
  for (const absolutePath of uniqueFiles) {
    const repositoryPath = relative(ROOT, absolutePath);
    hash.update(repositoryPath);
    hash.update('\0');
    hash.update(readFileSync(absolutePath));
    hash.update('\0');
  }

  return {
    algorithm: 'sha256',
    value: hash.digest('hex'),
    files: uniqueFiles.map((path) => relative(ROOT, path)),
    entryFiles: entryFiles.map((path) => relative(ROOT, path)),
    missingOptionalRoots,
  };
}

/**
 * Validate one evidence record against one promotion gate.
 *
 * Boolean-only evidence is deliberately inadmissible. A passing record must
 * identify when it was captured, where its underlying artifacts live, and the
 * exact source fingerprint it exercised.
 *
 * @param {Record<string, unknown>} gate
 * @param {Record<string, unknown>|undefined} evidence
 * @param {string} currentSourceFingerprint
 * @param {number} [evaluatedAtMs]
 */
export function evaluateTownSceneGate(
  gate,
  evidence,
  currentSourceFingerprint,
  evaluatedAtMs = Date.now(),
) {
  const base = {
    id: gate.id,
    title: gate.title,
    required: gate.required === true,
    evidenceKind: gate.evidenceKind,
  };

  if (evidence == null) {
    return {
      ...base,
      status: 'missing',
      reason: 'No evidence record was supplied.',
    };
  }
  if (typeof evidence !== 'object' || Array.isArray(evidence)) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Evidence must be a structured record, not a boolean or array.',
    };
  }
  if (evidence.passed === false) {
    return {
      ...base,
      status: 'failed',
      reason: String(evidence.notes || 'The evidence producer reported failure.'),
    };
  }
  if (evidence.passed !== true) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Evidence `passed` must be exactly true or false.',
    };
  }
  if (evidence.gateId !== gate.id) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Evidence `gateId` must match the gate it is intended to satisfy.',
    };
  }
  if (evidence.evidenceKind !== gate.evidenceKind) {
    return {
      ...base,
      status: 'malformed',
      reason: (
        'Evidence `evidenceKind` must match the gate proof class; '
        + 'one proof class cannot be relabeled as another.'
      ),
    };
  }
  if (
    typeof evidence.producer !== 'string'
    || evidence.producer.trim().length === 0
  ) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Passing evidence must name its accountable `producer`.',
    };
  }
  if (
    typeof evidence.summary !== 'string'
    || evidence.summary.trim().length === 0
  ) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Passing evidence must include a non-empty result `summary`.',
    };
  }
  if (
    typeof evidence.capturedAt !== 'string'
    || !(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/
    ).test(evidence.capturedAt)
    || !Number.isFinite(Date.parse(evidence.capturedAt))
  ) {
    return {
      ...base,
      status: 'malformed',
      reason: (
        'Passing evidence needs an ISO-8601 `capturedAt` timestamp '
        + 'with an explicit timezone.'
      ),
    };
  }
  const capturedAtMs = Date.parse(evidence.capturedAt);
  if (
    !Number.isFinite(evaluatedAtMs)
    || capturedAtMs > evaluatedAtMs + MAX_FUTURE_CLOCK_SKEW_MS
  ) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Evidence `capturedAt` is implausibly later than the audit time.',
    };
  }
  if (
    Number.isInteger(gate.maxAgeDays)
    && evaluatedAtMs - capturedAtMs > gate.maxAgeDays * MILLISECONDS_PER_DAY
  ) {
    return {
      ...base,
      status: 'stale',
      reason: (
        `Evidence is older than this gate's ${gate.maxAgeDays}-day `
        + 'freshness window.'
      ),
      capturedAt: evidence.capturedAt,
      maxAgeDays: gate.maxAgeDays,
    };
  }
  if (
    evidence.sourceFingerprint !== currentSourceFingerprint
  ) {
    return {
      ...base,
      status: 'stale',
      reason: 'Evidence was not captured against the current source fingerprint.',
      suppliedSourceFingerprint: evidence.sourceFingerprint ?? null,
    };
  }
  if (!Array.isArray(evidence.evidenceRefs) || evidence.evidenceRefs.length === 0) {
    return {
      ...base,
      status: 'malformed',
      reason: 'Passing evidence needs at least one hashed evidence artifact.',
    };
  }

  const verifiedEvidenceRefs = [];
  for (const reference of evidence.evidenceRefs) {
    const artifactPath = typeof reference?.path === 'string'
      ? reference.path.trim()
      : '';
    const expectedHash = typeof reference?.sha256 === 'string'
      ? reference.sha256.toLowerCase()
      : '';
    if (!artifactPath || !/^[0-9a-f]{64}$/.test(expectedHash)) {
      return {
        ...base,
        status: 'malformed',
        reason: 'Every evidence reference needs a path and 64-character SHA-256.',
      };
    }

    const absolutePath = resolve(ROOT, artifactPath);
    if (!isEvidenceArtifactPath(absolutePath)) {
      return {
        ...base,
        status: 'malformed',
        reason: `Evidence artifact escapes artifacts/town-scene: ${artifactPath}`,
      };
    }
    if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
      return {
        ...base,
        status: 'malformed',
        reason: `Evidence artifact is missing or not a file: ${artifactPath}`,
      };
    }
    const realArtifactRoot = realpathSync(EVIDENCE_ARTIFACT_ROOT);
    const realArtifactPath = realpathSync(absolutePath);
    if (
      realArtifactPath !== realArtifactRoot
      && !realArtifactPath.startsWith(`${realArtifactRoot}/`)
    ) {
      return {
        ...base,
        status: 'malformed',
        reason: `Evidence artifact resolves outside artifacts/town-scene: ${artifactPath}`,
      };
    }

    const actualHash = sha256File(realArtifactPath);
    if (actualHash !== expectedHash) {
      return {
        ...base,
        status: 'stale',
        reason: `Evidence artifact digest changed: ${artifactPath}`,
      };
    }
    verifiedEvidenceRefs.push({
      path: relative(ROOT, absolutePath),
      sha256: actualHash,
    });
  }

  return {
    ...base,
    status: 'passed',
    capturedAt: evidence.capturedAt,
    producer: evidence.producer.trim(),
    summary: evidence.summary.trim(),
    evidenceRefs: verifiedEvidenceRefs,
  };
}

/** Assert the machine contract and shipped feature defaults still agree. */
function validateContract(contract) {
  if (
    contract?.schemaVersion !== 1
    || contract?.kind !== 'town_scene_3d_promotion_contract'
  ) {
    throw new Error('Unsupported town-scene promotion contract schema.');
  }
  if (!Array.isArray(contract.localGates) || !Array.isArray(contract.externalGates)) {
    throw new Error('Promotion contract needs localGates and externalGates arrays.');
  }
  if (!Array.isArray(contract.sourceRoots) || contract.sourceRoots.length === 0) {
    throw new Error('Promotion contract needs at least one source root.');
  }
  const sourcePaths = contract.sourceRoots.map((entry) => (
    typeof entry?.path === 'string' ? entry.path.trim() : entry?.path
  ));
  if (
    sourcePaths.some((path) => typeof path !== 'string' || path.trim().length === 0)
    || new Set(sourcePaths).size !== sourcePaths.length
    || contract.sourceRoots.some((entry) => typeof entry?.required !== 'boolean')
  ) {
    throw new Error(
      'Promotion source roots need unique paths and explicit required booleans.',
    );
  }
  if (
    contract.evidenceContract?.bundleSchemaVersion !== 1
    || typeof contract.evidenceContract?.bundleKind !== 'string'
    || contract.evidenceContract.bundleKind.trim().length === 0
    || typeof contract.evidenceContract?.defaultEvidencePath !== 'string'
    || typeof contract.evidenceContract?.defaultReceiptPath !== 'string'
  ) {
    throw new Error('Promotion contract has an incomplete evidence bundle schema.');
  }

  const allGates = [...contract.localGates, ...contract.externalGates];
  const ids = allGates.map((gate) => gate?.id);
  if (
    ids.some((id) => typeof id !== 'string' || id.trim().length === 0)
    || new Set(ids).size !== ids.length
  ) {
    throw new Error('Every promotion gate needs a unique, non-empty id.');
  }
  for (const gate of allGates) {
    if (
      typeof gate.title !== 'string'
      || gate.title.trim().length === 0
      || typeof gate.required !== 'boolean'
      || typeof gate.evidenceKind !== 'string'
      || gate.evidenceKind.trim().length === 0
      || !Array.isArray(gate.acceptance)
      || gate.acceptance.length === 0
      || gate.acceptance.some(
        (criterion) => typeof criterion !== 'string' || criterion.trim().length === 0,
      )
    ) {
      throw new Error(`Promotion gate ${gate.id} has an incomplete definition.`);
    }
    if (
      gate.maxAgeDays != null
      && (!Number.isInteger(gate.maxAgeDays) || gate.maxAgeDays <= 0)
    ) {
      throw new Error(
        `Promotion gate ${gate.id} has an invalid maxAgeDays freshness window.`,
      );
    }
  }

  const availabilityFlag = contract.feature?.availabilityFlag;
  const defaultFlag = contract.feature?.defaultFlag;
  if (
    typeof contract.feature?.implementationStatus !== 'string'
    || contract.feature.implementationStatus.trim().length === 0
    || typeof contract.feature?.promotionStatus !== 'string'
    || contract.feature.promotionStatus.trim().length === 0
  ) {
    throw new Error(
      'Promotion contract must distinguish implementation and promotion status.',
    );
  }
  if (!(availabilityFlag in FLAG_DEFAULTS) || !(defaultFlag in FLAG_DEFAULTS)) {
    throw new Error('Promotion contract references unknown feature flags.');
  }
  if (
    FLAG_DEFAULTS[availabilityFlag]
      !== contract.feature.availabilityShippedDefault
    || FLAG_DEFAULTS[defaultFlag] !== contract.feature.defaultShippedDefault
  ) {
    throw new Error(
      'Promotion contract shipped defaults have drifted from flagRegistry.js.',
    );
  }
}

function summarizeGateResults(results) {
  const count = (status) => (
    results.filter((result) => result.status === status).length
  );
  return {
    required: results.filter((result) => result.required).length,
    passed: count('passed'),
    missing: count('missing'),
    failed: count('failed'),
    malformed: count('malformed'),
    stale: count('stale'),
    complete: results
      .filter((result) => result.required)
      .every((result) => result.status === 'passed'),
    gates: results,
  };
}

/**
 * Build a certification receipt without writing it.
 *
 * Evidence has the shape `{ gates: { [gateId]: gateRecord } }`. Unknown gate
 * records are reported so obsolete or misspelled evidence cannot disappear
 * silently, but they do not satisfy any requirement.
 *
 * @param {Record<string, unknown>} contract
 * @param {Record<string, unknown>|null} evidenceBundle
 * @param {string|null} evidencePath
 */
export function buildTownSceneCertificationReceipt(
  contract,
  evidenceBundle,
  evidencePath = null,
) {
  validateContract(contract);
  const generatedAt = new Date();
  const source = fingerprintTownSceneSource(contract);
  const evidenceBundleValid = Boolean(
    evidenceBundle
    && typeof evidenceBundle === 'object'
    && !Array.isArray(evidenceBundle)
    && evidenceBundle.schemaVersion
      === contract.evidenceContract?.bundleSchemaVersion
    && evidenceBundle.kind === contract.evidenceContract?.bundleKind
    && evidenceBundle.gates
    && typeof evidenceBundle.gates === 'object'
    && !Array.isArray(evidenceBundle.gates)
  );
  const records = evidenceBundleValid
    ? evidenceBundle.gates
    : {};

  const evaluate = (gate) => evaluateTownSceneGate(
    gate,
    records[gate.id],
    source.value,
    generatedAt.getTime(),
  );
  const local = summarizeGateResults(contract.localGates.map(evaluate));
  const external = summarizeGateResults(contract.externalGates.map(evaluate));
  const knownIds = new Set([
    ...contract.localGates.map((gate) => gate.id),
    ...contract.externalGates.map((gate) => gate.id),
  ]);
  const unknownEvidenceIds = Object.keys(records)
    .filter((id) => !knownIds.has(id))
    .sort();

  const availabilityFlag = contract.feature.availabilityFlag;
  const defaultFlag = contract.feature.defaultFlag;
  const availabilityEnabled = FLAG_DEFAULTS[availabilityFlag] === true;
  const currentDefault = FLAG_DEFAULTS[defaultFlag] === true;
  const eligibleForDefault = (
    availabilityEnabled
    && evidenceBundleValid
    && local.complete
    && external.complete
    && unknownEvidenceIds.length === 0
  );
  const unsafeDefault = currentDefault && !eligibleForDefault;

  return {
    schemaVersion: 1,
    kind: 'town_scene_3d_certification_receipt',
    generatedAt: generatedAt.toISOString(),
    contract: {
      path: relative(ROOT, CONTRACT_PATH),
      schemaVersion: contract.schemaVersion,
      evaluatedAt: contract.evaluatedAt,
      implementationStatus: contract.feature.implementationStatus,
      promotionStatus: contract.feature.promotionStatus,
    },
    source,
    evidence: {
      path: evidencePath ? relative(ROOT, evidencePath) : null,
      supplied: evidenceBundle != null,
      schemaVersion: evidenceBundle?.schemaVersion ?? null,
      kind: evidenceBundle?.kind ?? null,
      bundleStatus: evidenceBundle == null
        ? 'not_supplied'
        : evidenceBundleValid
          ? 'valid'
          : 'malformed',
      unknownGateIds: unknownEvidenceIds,
    },
    flags: {
      [availabilityFlag]: FLAG_DEFAULTS[availabilityFlag],
      [defaultFlag]: FLAG_DEFAULTS[defaultFlag],
    },
    local,
    external,
    eligibleForDefault,
    unsafeDefault,
    decision: unsafeDefault
      ? 'invalid_default_on'
      : eligibleForDefault
        ? (currentDefault ? 'default_evidence_current' : 'eligible_to_promote')
        : 'withhold_default',
    limitations: [
      'This receipt validates submitted evidence; it does not manufacture external human or device evidence.',
      'Promotion eligibility never authorizes removing the canonical 2D plan.',
      'The audit never mutates product flags.',
    ],
  };
}

/** Write JSON atomically so interruption cannot leave a plausible partial receipt. */
function writeJsonAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(
      temporaryPath,
      `${JSON.stringify(value, null, 2)}\n`,
      { encoding: 'utf8', mode: 0o600 },
    );
    renameSync(temporaryPath, path);
  } finally {
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
}

async function main(argv = process.argv.slice(2)) {
  const contract = readJson(CONTRACT_PATH);
  const configuredEvidencePath = (
    contract.evidenceContract?.defaultEvidencePath
    || 'artifacts/town-scene/evidence.json'
  );
  const configuredReceiptPath = (
    contract.evidenceContract?.defaultReceiptPath
    || 'artifacts/town-scene/certification.json'
  );
  const evidencePath = resolve(
    ROOT,
    readArg(argv, 'evidence', configuredEvidencePath),
  );
  const receiptPath = resolve(
    ROOT,
    readArg(argv, 'out', configuredReceiptPath),
  );
  if (!isEvidenceArtifactPath(evidencePath)) {
    throw new Error(
      'Evidence bundle path must remain below artifacts/town-scene.',
    );
  }
  if (!isEvidenceArtifactPath(receiptPath)) {
    throw new Error(
      'Certification receipt path must remain below artifacts/town-scene.',
    );
  }
  const requirePromotion = argv.includes('--require-promotion');
  const noWrite = argv.includes('--no-write');
  if (!noWrite && receiptPath === evidencePath) {
    throw new Error(
      'Evidence and receipt paths must differ; refusing to overwrite evidence.',
    );
  }
  const evidenceBundle = existsSync(evidencePath)
    ? readJson(evidencePath)
    : null;
  const receipt = buildTownSceneCertificationReceipt(
    contract,
    evidenceBundle,
    evidencePath,
  );

  if (!noWrite) writeJsonAtomic(receiptPath, receipt);

  const summary = {
    decision: receipt.decision,
    eligibleForDefault: receipt.eligibleForDefault,
    sourceFingerprint: receipt.source.value,
    local: {
      passed: receipt.local.passed,
      required: receipt.local.required,
    },
    external: {
      passed: receipt.external.passed,
      required: receipt.external.required,
    },
    evidenceSupplied: receipt.evidence.supplied,
    receipt: noWrite ? null : relative(ROOT, receiptPath),
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  if (receipt.unsafeDefault) {
    throw new Error(
      'settlementScene3dDefault is on without complete current evidence.',
    );
  }
  if (requirePromotion && !receipt.eligibleForDefault) {
    throw new Error(
      'Town-scene promotion evidence is incomplete; default promotion is withheld.',
    );
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`[town-scene-certification] ${error.message}\n`);
    process.exitCode = 1;
  });
}
