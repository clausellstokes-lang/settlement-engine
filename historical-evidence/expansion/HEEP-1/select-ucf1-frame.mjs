#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RULE_VERSION = 'UCF1-SELECT-1.4.0';
const PROTOCOL_VERSION = '1.1.0';
const FRAME_VERSION = 'UCF-1.1.0';
const SOLVER_VERSION = 'UCF1-EXACT-NESTED-SOLVER-1.0.0';
const UNSAT_CERTIFICATE_VERSION = 'UCF1-UNSAT-CERTIFICATE-1.0.0';
const REPLACEMENT_POLICY_VERSION = 'UCF1-FULL-VECTOR-REPLACEMENT-1.0.0';
const PROTOCOL_SEED_PREFIX = 'SettlementForge|HEEP-1|UCF-1|';
const LEGAL_PREFIXES = [80, 90, 100, 110, 120];
const MACROS = [
  'ATLANTIC_ARCHIPELAGO',
  'NORDIC_BALTIC',
  'WESTERN_CONTINENTAL',
  'CENTRAL_EASTERN_SOUTHEASTERN',
  'SOUTHERN_MEDITERRANEAN',
];
const PHASES = ['PRE_1200', '1200_1399', '1400_1599', '1600_1799', '1800_PLUS'];
const SCALES = ['SMALL_LOCAL', 'INTERMEDIATE_REGIONAL', 'MAJOR_METROPOLITAN'];
const CONTEXTS = [
  'COASTAL_ESTUARINE',
  'RIVER_CROSSING',
  'WETLAND_ENGINEERED_WATER',
  'UPLAND_CONSTRAINED',
  'OTHER_INLAND',
];
const ALL_CONTEXTS = [...CONTEXTS, 'UNKNOWN'];
const DEFAULT_SCHEMA_PATH = fileURLToPath(new URL('./ucf1-frame.schema.json', import.meta.url));
const DEFAULT_SCALE_RUBRIC_PATH = fileURLToPath(new URL('./ucf1-scale-class-rubric.json', import.meta.url));
const DEFAULT_CONTEXT_RUBRIC_PATH = fileURLToPath(new URL('./ucf1-physical-context-rubric.json', import.meta.url));
const DEFAULT_SOURCE_REGISTRY_PATH = fileURLToPath(new URL('./ucf1-metadata-sources.json', import.meta.url));
const PINNED_FRAME_SCHEMA_SHA256 = '6d4d7398beadc0a4a3685f85707e6ad1e108ce3d171d2638be4d598e4166d9c6';
const PINNED_SCALE_RUBRIC_SHA256 = '22e71dc4ddabdeab14e72e4fc677d02ab9daff1ddd003bbe74f21342848ba091';
const PINNED_CONTEXT_RUBRIC_SHA256 = '325a0b989c7b90a030a1cf41ff4e02d31c7fda1cd2733b722f6852a0567e1b17';
const PINNED_CONTEXT_VALUE_ALLOWLIST_SHA256 = '9d2154a2f77ddd4ee8a99588d2ddae6990c532f44f4ba749ff2ea329b684cfe1';
const PINNED_SOURCE_REGISTRY_SHA256 = '679594ca391300fdd5f064360a4413ac27e740ace3679666c0114d8c4f818978';
const PINNED_AUTHORITY_SNAPSHOT_SHA256 = '35bbb58649c6053ae39650daf438260b64938d9313316b0a04d124fdc63f9bc2';
const PINNED_AUTHORITY_P31_REGISTRY_SHA256 = '4eb5ad5bf8534c19dbf346f956273d837a3de84da034340880f0159bb1f609ff';
const PINNED_CONTEXT_EVIDENCE_REGISTRY_SHA256 = 'ae65763830cc3e570dd9fe53497319a86d6ce28d3fd11e2244fdc1bed68e8e58';
const PINNED_LEAKAGE_CLUSTER_REGISTRY_SHA256 = '05e9d953257e178cb519f711210f5edd9a65a0643500478286f0ecda973b5804';
const PINNED_CONTEXT_AUTHORITY_EXTRACT_SHA256 = '8d9e06d302a2bcbb51b93f93f67ada702df625526d061aaab08348e1a410ea19';
const PINNED_PRIOR_SEEN_REGISTRY_SHA256 = '51d150a1a9df49c28eb440831f8ebc921b8a62c0167c16edf758d09ec5fc8e82';
const PINNED_WAVE1_REGISTRY_SHA256 = '4d1c034c203c1728dbf57b874cce88097fe92907e9a95652bafc53112d9f7222';
const PINNED_FRAME_EXCLUSION_REGISTRY_SHA256 = '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945';

const SOLVER_FORMULATION = Object.freeze({
  solverVersion: SOLVER_VERSION,
  decisionModel: 'NESTED_PREFIX_SUBSET_PARTITION',
  legalPrefixes: LEGAL_PREFIXES,
  trancheSizes: LEGAL_PREFIXES.map((prefix, index) => prefix - (LEGAL_PREFIXES[index - 1] ?? 0)),
  objective: 'LEXICOGRAPHIC_MINIMUM_TIE_HASH_SEQUENCE_WITHIN_EACH_LEGAL_TRANCHE',
  tieOrder: 'SHA256(selectionSeed + "|" + stableTownId), then stableTownId',
  completeness: 'EXHAUSTIVE_INCLUDE_FIRST_DEPTH_FIRST_ENUMERATION_WITH_SOUND_NECESSARY_BOUND_PRUNING_AND_NO_NODE_LIMIT',
  hardConstraintFamilies: [
    'macroRegionMinimumAndMaximum',
    'countryMaximum',
    'programMaximum',
    'indexPhaseMinimumAndMaximumAndUnknownMaximum',
    'scaleFunctionMinimumAndUnknownMaximum',
    'physicalContextOverlappingMinimum',
    'priorSeenMaximum',
    'singletonLeakageClusterEligibility',
    'sameMacroPhaseScaleReserve',
    'fullVectorReplacementAtEveryAffectedLegalPrefix',
  ],
  replacementPolicyVersion: REPLACEMENT_POLICY_VERSION,
});

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) throw new Error(`unexpected argument: ${argument}`);
    const key = argument.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`missing value for --${key}`);
    options[key] = value;
    index += 1;
  }
  if (!options.manifest || !options['out-dir']) {
    throw new Error('usage: select-ucf1-frame.mjs --manifest PATH --out-dir PRIVATE_DIRECTORY [--schema PATH] [--scale-rubric PATH] [--context-rubric PATH] [--source-registry PATH]');
  }
  return {
    manifestPath: path.resolve(options.manifest),
    outDir: path.resolve(options['out-dir']),
    schemaPath: path.resolve(options.schema ?? DEFAULT_SCHEMA_PATH),
    scaleRubricPath: path.resolve(options['scale-rubric'] ?? DEFAULT_SCALE_RUBRIC_PATH),
    contextRubricPath: path.resolve(options['context-rubric'] ?? DEFAULT_CONTEXT_RUBRIC_PATH),
    sourceRegistryPath: path.resolve(options['source-registry'] ?? DEFAULT_SOURCE_REGISTRY_PATH),
  };
}

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const canonicalHash = (value) => sha256(JSON.stringify(value));
const SOLVER_FORMULATION_SHA256 = canonicalHash(SOLVER_FORMULATION);
const countOf = (map, key) => map.get(key) ?? 0;
const increment = (map, key) => map.set(key, countOf(map, key) + 1);
const ceilRate = (rate, total) => Math.ceil(rate * total - 1e-9);
const floorRate = (rate, total) => Math.floor(rate * total + 1e-9);
const exactReserveKey = (candidate) => [candidate.macroRegion, candidate.indexPhase, candidate.scaleFunction.band].join('|');

function assertNoSymlinkComponents(targetPath) {
  const absolute = path.resolve(targetPath);
  const parsed = path.parse(absolute);
  let current = parsed.root;
  for (const segment of (path.relative(parsed.root, absolute).match(/[^/]+/gu) ?? [])) {
    current = path.join(current, segment);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('custody path contains a symbolic-link component');
  }
}

function assertOutsideGitAncestors(realPath) {
  let current = fs.statSync(realPath).isDirectory() ? realPath : path.dirname(realPath);
  while (true) {
    if (fs.existsSync(path.join(current, '.git'))) throw new Error('custody path is inside a Git repository or worktree');
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function assertOwnedByCurrentUser(stat, label) {
  if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) throw new Error(`${label} is not owned by the current user`);
}

function assertCustodyPaths(manifestPath, outDir) {
  assertNoSymlinkComponents(manifestPath);
  assertNoSymlinkComponents(outDir);
  const manifestRealPath = fs.realpathSync(manifestPath);
  const outDirRealPath = fs.realpathSync(outDir);
  if (manifestRealPath !== path.resolve(manifestPath) || outDirRealPath !== path.resolve(outDir)) throw new Error('custody arguments must be canonical realpaths');
  const manifestStat = fs.lstatSync(manifestRealPath);
  const manifestParentStat = fs.lstatSync(path.dirname(manifestRealPath));
  const outDirStat = fs.lstatSync(outDirRealPath);
  if (!manifestStat.isFile() || (manifestStat.mode & 0o777) !== 0o600) throw new Error('custody manifest must be a pre-existing mode-0600 regular file');
  if (!manifestParentStat.isDirectory() || (manifestParentStat.mode & 0o777) !== 0o700) throw new Error('custody manifest parent must be a mode-0700 directory');
  if (!outDirStat.isDirectory() || (outDirStat.mode & 0o777) !== 0o700) throw new Error('output custody directory must pre-exist with mode 0700');
  assertOwnedByCurrentUser(manifestStat, 'custody manifest');
  assertOwnedByCurrentUser(manifestParentStat, 'custody manifest parent');
  assertOwnedByCurrentUser(outDirStat, 'output custody directory');
  assertOutsideGitAncestors(manifestRealPath);
  assertOutsideGitAncestors(outDirRealPath);
}

function emptyCounts() {
  return {
    macro: new Map(),
    phase: new Map(),
    scale: new Map(),
    context: new Map(),
    country: new Map(),
    program: new Map(),
    exactReserve: new Map(),
    priorSeen: 0,
  };
}

function addCandidate(counts, candidate) {
  increment(counts.macro, candidate.macroRegion);
  increment(counts.phase, candidate.indexPhase);
  increment(counts.scale, candidate.scaleFunction.band);
  for (const context of candidate.physicalContext.tags) {
    if (CONTEXTS.includes(context)) increment(counts.context, context);
  }
  increment(counts.country, candidate.countryCode);
  increment(counts.program, candidate.primaryProgramId);
  increment(counts.exactReserve, exactReserveKey(candidate));
  if (candidate.priorExposure === 'PRIOR_SEEN') counts.priorSeen += 1;
  return counts;
}

function countsFor(candidates) {
  const counts = emptyCounts();
  for (const candidate of candidates) addCandidate(counts, candidate);
  return counts;
}

function quotaLimits(total) {
  return {
    macroMin: ceilRate(0.15, total),
    macroMax: floorRate(0.25, total),
    countryMax: ceilRate(0.12, total),
    programMax: ceilRate(0.15, total),
    phaseMin: ceilRate(0.10, total),
    phaseMax: floorRate(0.30, total),
    unknownPhaseMax: floorRate(0.10, total),
    scaleMin: ceilRate(0.20, total),
    unknownScaleMax: floorRate(0.10, total),
    contextMin: ceilRate(0.10, total),
    // With a later 18% holdout that excludes prior-seen units, this keeps the
    // opened development set below its frozen 20% prior-seen ceiling.
    priorSeenMax: floorRate(0.16, total),
  };
}

function schemaRef(rootSchema, reference) {
  if (!reference.startsWith('#/')) throw new Error(`offline schema validator permits only local references: ${reference}`);
  return (reference.slice(2).match(/[^/]+/gu) ?? []).reduce((value, segment) => value[segment.replaceAll('~1', '/').replaceAll('~0', '~')], rootSchema);
}

function matchesSchemaType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

function validateSchemaNode(value, schema, location, rootSchema, errors) {
  if (schema.oneOf) {
    const branchResults = schema.oneOf.map((branch) => {
      const branchErrors = [];
      validateSchemaNode(value, branch, location, rootSchema, branchErrors);
      return branchErrors;
    });
    if (branchResults.filter((branchErrors) => branchErrors.length === 0).length !== 1) errors.push(`${location}: must match exactly one oneOf branch`);
  }
  if (schema.$ref) {
    validateSchemaNode(value, schemaRef(rootSchema, schema.$ref), location, rootSchema, errors);
    return;
  }
  if (Object.hasOwn(schema, 'const') && !Object.is(value, schema.const)) errors.push(`${location}: const mismatch`);
  if (schema.enum && !schema.enum.some((entry) => Object.is(entry, value))) errors.push(`${location}: value is outside enum`);
  if (schema.type) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!allowed.some((type) => matchesSchemaType(value, type))) {
      errors.push(`${location}: expected ${allowed.join('|')}`);
      return;
    }
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${location}: shorter than minLength`);
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) errors.push(`${location}: pattern mismatch`);
    if (schema.format === 'uri') {
      try { new URL(value); } catch { errors.push(`${location}: invalid uri`); }
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${location}: fewer than minItems`);
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) errors.push(`${location}: duplicate array items`);
    }
    if (schema.items) value.forEach((item, index) => validateSchemaNode(item, schema.items, `${location}/${index}`, rootSchema, errors));
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required ?? []) if (!Object.hasOwn(value, required)) errors.push(`${location}: missing required property ${required}`);
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) validateSchemaNode(value[key], childSchema, `${location}/${key}`, rootSchema, errors);
    }
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const key of Object.keys(value)) if (!allowed.has(key)) errors.push(`${location}: additional property ${key}`);
    }
  }
}

function assertSupportedSchemaKeywords(schema, location = '#') {
  const supported = new Set(['$schema', '$id', '$defs', '$ref', 'title', 'type', 'required', 'properties', 'additionalProperties', 'const', 'enum', 'oneOf', 'items', 'minItems', 'uniqueItems', 'minLength', 'pattern', 'format']);
  for (const key of Object.keys(schema)) if (!supported.has(key)) throw new Error(`offline Draft 2020-12 validator does not implement schema keyword ${location}/${key}`);
  for (const [key, child] of Object.entries(schema.$defs ?? {})) assertSupportedSchemaKeywords(child, `${location}/$defs/${key}`);
  for (const [key, child] of Object.entries(schema.properties ?? {})) assertSupportedSchemaKeywords(child, `${location}/properties/${key}`);
  for (const [index, child] of (schema.oneOf ?? []).entries()) assertSupportedSchemaKeywords(child, `${location}/oneOf/${index}`);
  if (schema.items && typeof schema.items === 'object') assertSupportedSchemaKeywords(schema.items, `${location}/items`);
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') assertSupportedSchemaKeywords(schema.additionalProperties, `${location}/additionalProperties`);
}

function validateDraft202012(manifest, schema) {
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') throw new Error('schema is not declared as Draft 2020-12');
  assertSupportedSchemaKeywords(schema);
  const errors = [];
  validateSchemaNode(manifest, schema, '#', schema, errors);
  if (errors.length) throw new Error(`Draft 2020-12 schema validation failed (${errors.length}): ${errors.slice(0, 12).join('; ')}`);
}

function expectedIndexPhase(interval) {
  const { startYear, endYear } = interval;
  if (startYear === null && endYear === null) return 'UNKNOWN';
  if (!Number.isInteger(startYear) || !Number.isInteger(endYear) || startYear > endYear) throw new Error('represented interval must contain ordered integer endpoints or two null endpoints');
  const midpoint = (startYear + endYear) / 2;
  if (midpoint < 1200) return 'PRE_1200';
  if (midpoint < 1400) return '1200_1399';
  if (midpoint < 1600) return '1400_1599';
  if (midpoint < 1800) return '1600_1799';
  return '1800_PLUS';
}

function foldedIdentity(value) {
  return value.normalize('NFKC').toLocaleLowerCase('und').replaceAll('ß', 'ss').replaceAll('ς', 'σ').replace(/\s+/gu, ' ').replace(/^\s+|\s+$/gu, '');
}

const hasNonWhitespace = (value) => typeof value === 'string' && /\S/u.test(value);

const sameJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const scaleRubricKey = ({ classKind, sourceId, programId = '', classId }) => [classKind, sourceId, programId, classId].join('|');

function validateFrozenPublicInputs(manifest, frozenInputs) {
  const { scaleRubric, contextRubric, sourceRegistry, hashes } = frozenInputs;
  if (hashes.scaleRubricSha256 !== PINNED_SCALE_RUBRIC_SHA256 || hashes.contextRubricSha256 !== PINNED_CONTEXT_RUBRIC_SHA256 || hashes.sourceRegistrySha256 !== PINNED_SOURCE_REGISTRY_SHA256) {
    throw new Error('one or more public metadata rubrics/registries do not match the selector-pinned digest');
  }
  if (!sameJson(manifest.scaleClassRubricRef, { rubricId: scaleRubric.rubricId, version: scaleRubric.version, sha256: hashes.scaleRubricSha256 })) throw new Error('manifest scale-rubric reference is stale or mismatched');
  if (!sameJson(manifest.physicalContextRubricRef, { rubricId: contextRubric.rubricId, version: contextRubric.version, sha256: hashes.contextRubricSha256 })) throw new Error('manifest physical-context-rubric reference is stale or mismatched');
  if (!sameJson(manifest.metadataSourceRegistryRef, { schemaVersion: sourceRegistry.schemaVersion, sha256: hashes.sourceRegistrySha256 })) throw new Error('manifest metadata-source-registry reference is stale or mismatched');
  const normalizedPublicSources = sourceRegistry.sources.map((source) => ({ sourceId: source.sourceId, url: source.url, publisher: source.publisher, rights: source.rightsStatus }));
  if (!sameJson(manifest.metadataSources, normalizedPublicSources)) throw new Error('manifest metadata sources do not exactly join the pinned public source registry');

  if (scaleRubric.rubricId !== 'UCF1-SCALE-CLASS-RUBRIC' || scaleRubric.version !== '1.2.0') throw new Error('unexpected scale rubric identity/version');
  const scaleEntries = new Map();
  const scaleClassBands = new Map();
  for (const entry of scaleRubric.entries ?? []) {
    if (entry.classKind !== 'WIKIDATA_P31' || entry.sourceId !== 'WIKIDATA' || Object.hasOwn(entry, 'programId') || !SCALES.includes(entry.band) || !hasNonWhitespace(entry.classId)) throw new Error('scale rubric contains a non-P31 or otherwise invalid entry');
    const key = scaleRubricKey(entry);
    if (scaleEntries.has(key)) throw new Error('scale rubric contains a duplicate class mapping');
    scaleEntries.set(key, entry);
    const classScope = [entry.classKind, entry.sourceId, entry.programId ?? '', entry.classId].join('|');
    const priorBand = scaleClassBands.get(classScope);
    if (priorBand && priorBand !== entry.band) throw new Error('scale rubric maps one scoped class to multiple bands');
    scaleClassBands.set(classScope, entry.band);
  }
  if (!scaleEntries.size || scaleRubric.classificationPolicy?.completeObservedClassSetRequired !== true || scaleRubric.classificationPolicy?.knownRequiresEveryObservedClassMapped !== true || scaleRubric.classificationPolicy?.programScopeClassMayAuthorizeKnown !== false || scaleRubric.classificationPolicy?.basisProseMaySelectBand !== false || scaleRubric.classificationPolicy?.unmappedOrAbsentClassDisposition !== 'UNKNOWN' || scaleRubric.classificationPolicy?.multipleResolvedBandsDisposition !== 'UNKNOWN') throw new Error('scale rubric does not fail closed on incomplete, program-scope, absent, unmapped, ambiguous, or prose-only classifications');

  if (contextRubric.rubricId !== 'UCF1-PHYSICAL-CONTEXT-RUBRIC' || contextRubric.version !== '1.2.0') throw new Error('unexpected physical-context rubric identity/version');
  const contextRules = new Map();
  for (const rule of contextRubric.rules ?? []) {
    if (contextRules.has(rule.ruleId) || !CONTEXTS.includes(rule.tag) || !['AUTHORITY_ITEM', 'AUTHORITY_QUANTITY', 'CATALOG_JOIN'].includes(rule.evidenceKind) || !hasNonWhitespace(rule.sourceId)) throw new Error('physical-context rubric contains an invalid or duplicate rule');
    contextRules.set(rule.ruleId, rule);
  }
  if (!contextRules.size || contextRubric.classificationPolicy?.freeTextCannotAuthorizeTag !== true || contextRubric.classificationPolicy?.unsupportedEvidenceDisposition !== 'UNKNOWN') throw new Error('physical-context rubric does not fail closed');
  return { scaleEntries, contextRules };
}

function validateManifest(manifest, schema, frozenInputs) {
  validateDraft202012(manifest, schema);
  const { scaleEntries, contextRules } = validateFrozenPublicInputs(manifest, frozenInputs);
  if (manifest.protocolId !== 'HEEP-1' || manifest.protocolVersion !== PROTOCOL_VERSION || manifest.frameVersion !== FRAME_VERSION) {
    throw new Error('manifest protocolId/protocolVersion/frameVersion mismatch');
  }
  if (!Array.isArray(manifest.candidates) || manifest.candidates.length < 180) {
    throw new Error('candidate frame must contain at least 180 records');
  }
  if (manifest.constructionMode !== 'METADATA_ONLY' || manifest.eligibleForPrevalence !== false) throw new Error('manifest must freeze metadata-only, non-prevalence construction status');
  if (manifest.candidateCount !== manifest.candidates.length) throw new Error('manifest candidateCount mismatch');
  const ids = new Set();
  const identityOwners = new Map();
  const packageDefinitions = new Map();
  const packageUsages = new Map();
  const metadataSourceIds = new Set((manifest.metadataSources ?? []).map((source) => source.sourceId));
  if (metadataSourceIds.size !== manifest.metadataSources.length) throw new Error('metadata sourceId is duplicated');
  if (canonicalHash(manifest.authorityP31Registry) !== manifest.authorityP31RegistrySha256 || manifest.authorityP31RegistrySha256 !== PINNED_AUTHORITY_P31_REGISTRY_SHA256) throw new Error('authority P31 registry digest is stale, mismatched, or not selector-pinned');
  const authorityP31Registry = new Map();
  for (const entry of manifest.authorityP31Registry) {
    if (authorityP31Registry.has(entry.itemId)) throw new Error('authority P31 registry itemId is duplicated');
    authorityP31Registry.set(entry.itemId, new Set(entry.classIds));
  }
  if (canonicalHash(manifest.physicalContextEvidenceRegistry) !== manifest.physicalContextEvidenceRegistrySha256 || manifest.physicalContextEvidenceRegistrySha256 !== PINNED_CONTEXT_EVIDENCE_REGISTRY_SHA256 || manifest.physicalContextAuthoritySnapshotSha256 !== PINNED_AUTHORITY_SNAPSHOT_SHA256) throw new Error('physical-context evidence/snapshot digest is stale, mismatched, or not selector-pinned');
  const contextEvidenceRegistry = new Map();
  for (const entry of manifest.physicalContextEvidenceRegistry) {
    if (contextEvidenceRegistry.has(entry.registryEntryId)) throw new Error('physical-context evidence registryEntryId is duplicated');
    contextEvidenceRegistry.set(entry.registryEntryId, entry);
  }
  const usedContextEvidence = new Set();
  if (canonicalHash(manifest.physicalContextValueAllowlist) !== manifest.physicalContextValueAllowlistSha256 || manifest.physicalContextValueAllowlistSha256 !== PINNED_CONTEXT_VALUE_ALLOWLIST_SHA256) throw new Error('physical-context value allowlist digest is stale, mismatched, or not selector-pinned');
  const contextValuesByRule = new Map();
  for (const entry of manifest.physicalContextValueAllowlist) {
    if (contextValuesByRule.has(entry.ruleId)) throw new Error('physical-context value allowlist repeats a ruleId');
    contextValuesByRule.set(entry.ruleId, new Set(entry.valueIds));
  }
  if (canonicalHash(manifest.physicalContextAuthorityExtract) !== manifest.physicalContextAuthorityExtractSha256 || manifest.physicalContextAuthorityExtractSha256 !== PINNED_CONTEXT_AUTHORITY_EXTRACT_SHA256) throw new Error('physical-context complete authority extract digest is stale, mismatched, or not selector-pinned');
  const contextExtractByTown = new Map();
  const contextExtractAuthorityOwners = new Map();
  for (const entry of manifest.physicalContextAuthorityExtract) {
    if (contextExtractByTown.has(entry.stableTownId) || contextExtractAuthorityOwners.has(entry.authorityItemId)) throw new Error('physical-context complete extract duplicates a town or authority item');
    contextExtractByTown.set(entry.stableTownId, entry);
    contextExtractAuthorityOwners.set(entry.authorityItemId, entry.stableTownId);
  }
  if (canonicalHash(manifest.priorSeenRegistry) !== manifest.priorSeenRegistrySha256 || manifest.priorSeenRegistrySha256 !== PINNED_PRIOR_SEEN_REGISTRY_SHA256 || manifest.priorSeenRegistry.sourceRegistrySha256 !== PINNED_WAVE1_REGISTRY_SHA256) throw new Error('prior-seen registry digest/source is stale, mismatched, or not selector-pinned');
  const priorSeenIds = new Set(manifest.priorSeenRegistry.priorStableTownIds);
  if (priorSeenIds.size !== manifest.priorSeenRegistry.priorStableTownIds.length) throw new Error('prior-seen registry repeats a stableTownId');
  if (canonicalHash(manifest.frameExclusionRegistry) !== manifest.frameExclusionRegistrySha256 || manifest.frameExclusionRegistrySha256 !== PINNED_FRAME_EXCLUSION_REGISTRY_SHA256) throw new Error('frame-exclusion registry digest is stale, mismatched, or not selector-pinned');
  const frameExclusionRegistry = new Map();
  for (const entry of manifest.frameExclusionRegistry) {
    if (frameExclusionRegistry.has(entry.registryEntryId)) throw new Error('frame-exclusion registryEntryId is duplicated');
    frameExclusionRegistry.set(entry.registryEntryId, entry);
  }
  const usedFrameExclusions = new Set();
  if (canonicalHash(manifest.leakageClusters) !== manifest.leakageClusterRegistrySha256 || manifest.leakageClusterRegistrySha256 !== PINNED_LEAKAGE_CLUSTER_REGISTRY_SHA256) throw new Error('leakage-cluster registry digest is stale, mismatched, or not selector-pinned');
  const declaredRelations = new Map();
  for (const relation of manifest.multiTownPackageRelations ?? []) {
    if (declaredRelations.has(relation.relationId)) throw new Error('multi-town package relationId is duplicated');
    declaredRelations.set(relation.relationId, relation);
  }
  let computedPriorSeen = 0;
  const candidateAuthorityOwners = new Map();
  for (const candidate of manifest.candidates) {
    if (Object.hasOwn(candidate, 'inspectedBeyondMetadata')) throw new Error('legacy inspectedBeyondMetadata field is forbidden; use the frame-construction-specific field');
    if (Object.hasOwn(candidate, 'eligible') || Object.hasOwn(candidate, 'disposition')) throw new Error('legacy open-ended candidate eligibility/disposition fields are forbidden');
    if (!candidate.stableTownId || ids.has(candidate.stableTownId)) throw new Error('stableTownId is missing or duplicated');
    ids.add(candidate.stableTownId);
    if (!MACROS.includes(candidate.macroRegion)) throw new Error('candidate has an undeclared macro-region');
    if (![...PHASES, 'UNKNOWN'].includes(candidate.indexPhase)) throw new Error('candidate has an undeclared phase');
    if (![...SCALES, 'UNKNOWN'].includes(candidate.scaleFunction?.band)) throw new Error('candidate has an undeclared scale/function band');
    if (!Array.isArray(candidate.physicalContext?.tags) || candidate.physicalContext.tags.length === 0) throw new Error('candidate has no physical-context disposition');
    if (!['PRIOR_SEEN', 'NOT_PRIOR_SEEN'].includes(candidate.priorExposure)) throw new Error('candidate has no frozen prior-exposure status');
    if (candidate.priorExposure === 'PRIOR_SEEN') computedPriorSeen += 1;
    if ((candidate.priorExposure === 'PRIOR_SEEN') !== priorSeenIds.has(candidate.stableTownId)) throw new Error('candidate prior-exposure status does not match the pinned Wave-1 registry');
    if (candidate.authorityIdentity) {
      const authorityItemId = candidate.authorityIdentity.identifier;
      if (candidateAuthorityOwners.has(authorityItemId)) throw new Error('authority item is reused across stableTownIds');
      candidateAuthorityOwners.set(authorityItemId, candidate.stableTownId);
      const extract = contextExtractByTown.get(candidate.stableTownId);
      if (!extract || extract.authorityItemId !== authorityItemId) throw new Error('candidate authority identity does not resolve to the complete context extract');
      const p31Observed = authorityP31Registry.get(authorityItemId);
      if (!p31Observed || extract.p31ClassIds.length !== p31Observed.size || extract.p31ClassIds.some((classId) => !p31Observed.has(classId))) throw new Error('complete context P31 extract does not equal the frozen authority P31 registry');
    } else if (contextExtractByTown.has(candidate.stableTownId)) {
      throw new Error('context extract exists for a candidate without a frozen authority identity');
    }
    const candidateIdentityKeys = new Set();
    for (const identityName of [candidate.canonicalName, ...candidate.aliases]) {
      const identityKey = `${candidate.countryCode}|${foldedIdentity(identityName)}`;
      if (candidateIdentityKeys.has(identityKey)) throw new Error('candidate repeats an NFKC/casefold-equivalent canonical name or alias');
      candidateIdentityKeys.add(identityKey);
      const priorOwner = identityOwners.get(identityKey);
      if (priorOwner && priorOwner !== candidate.stableTownId) throw new Error('NFKC/casefold canonical-or-alias identity collides across sampling units within a country/polity');
      identityOwners.set(identityKey, candidate.stableTownId);
    }
    const expectedPhase = expectedIndexPhase(candidate.primaryRepresentedInterval);
    if (candidate.indexPhase !== expectedPhase) throw new Error('indexPhase does not match the frozen interval-midpoint rubric');
    const tags = candidate.physicalContext.tags;
    if (tags.some((tag) => !ALL_CONTEXTS.includes(tag))) throw new Error('candidate uses an undeclared physical-context tag');
    if (tags.includes('UNKNOWN') && tags.length !== 1) throw new Error('UNKNOWN physical context must be exclusive');
    if (candidate.packages[0].programId !== candidate.primaryProgramId) throw new Error('primaryProgramId must match the first primary package');
    if (!candidate.packages.some((pkg) => pkg.programId === candidate.primaryProgramId)) throw new Error('primaryProgramId has no matching package');
    const candidatePackageKeys = new Set();
    for (const pkg of candidate.packages) {
      for (const field of ['programId', 'programName', 'institutionalPublisher', 'publicationIdentifier', 'metadataSourceId', 'sourceTitle', 'rightsStatus', 'acquisitionRoute']) {
        if (!hasNonWhitespace(pkg[field])) throw new Error(`package ${field} is blank`);
      }
      if (!Array.isArray(pkg.claimBearingKinds) || !pkg.claimBearingKinds.length || pkg.claimBearingKinds.some((kind) => !hasNonWhitespace(kind))) throw new Error('package claimBearingKinds is empty or invalid');
      if (!metadataSourceIds.has(pkg.metadataSourceId)) throw new Error('package metadataSourceId is absent from the frozen source registry');
      const packageKey = `${pkg.programId}|${pkg.publicationIdentifier}|${pkg.metadataSourceId}`;
      if (candidatePackageKeys.has(packageKey)) throw new Error('candidate repeats the same package identity');
      candidatePackageKeys.add(packageKey);
      const definition = JSON.stringify([pkg.programName, pkg.institutionalPublisher, pkg.metadataUrl, pkg.rightsStatus, pkg.acquisitionRoute]);
      const priorDefinition = packageDefinitions.get(packageKey);
      if (priorDefinition && priorDefinition !== definition) throw new Error('shared package identity has inconsistent publisher, route, rights, or metadata URL');
      packageDefinitions.set(packageKey, definition);
      const usage = packageUsages.get(packageKey) ?? { owners: new Set(), records: [] };
      usage.owners.add(candidate.stableTownId);
      usage.records.push(pkg);
      packageUsages.set(packageKey, usage);
    }
    const primaryPackage = candidate.packages[0];
    const primaryCatalogJoin = {
      programId: primaryPackage.programId,
      publicationIdentifier: primaryPackage.publicationIdentifier,
      metadataSourceId: primaryPackage.metadataSourceId,
    };
    if (candidate.frameEligibility.status === 'ELIGIBLE') {
      if (candidate.frameEligibility.reasonCode !== 'OFFICIAL_OR_INSTITUTIONAL_CATALOGUE_METADATA' || !metadataSourceIds.has(candidate.frameEligibility.evidence.metadataSourceId) || candidate.frameEligibility.evidence.metadataSourceId !== primaryPackage.metadataSourceId || !sameJson(candidate.frameEligibility.evidence.catalogJoin, primaryCatalogJoin)) throw new Error('eligible candidate does not resolve to a closed primary-package evidence item');
    } else if (candidate.frameEligibility.status === 'EXCLUDED') {
      const exclusion = frameExclusionRegistry.get(candidate.frameEligibility.exclusionRegistryEntryId);
      if (!exclusion || exclusion.stableTownId !== candidate.stableTownId || exclusion.reasonCode !== candidate.frameEligibility.reasonCode || !metadataSourceIds.has(exclusion.evidence.metadataSourceId) || !sameJson(exclusion.evidence.catalogJoin, primaryCatalogJoin)) throw new Error('excluded candidate does not resolve to a pinned closed-reason exclusion record');
      usedFrameExclusions.add(exclusion.registryEntryId);
    } else {
      throw new Error('candidate frame eligibility status is undeclared');
    }
    if (!sameJson(candidate.physicalContext.rubricRef, manifest.physicalContextRubricRef)) throw new Error('candidate physical-context rubric reference is stale or mismatched');
    const candidateExtract = contextExtractByTown.get(candidate.stableTownId);
    const expectedContextMatches = new Map();
    if (candidateExtract) {
      for (const rule of contextRules.values()) {
        const allowedValues = contextValuesByRule.get(rule.ruleId) ?? new Set();
        let observedValues = [];
        if (rule.propertyId === 'P31') observedValues = candidateExtract.p31ClassIds;
        if (rule.propertyId === 'P206') observedValues = candidateExtract.p206ObjectIds;
        if (rule.propertyId === 'P706') observedValues = candidateExtract.p706ObjectIds;
        const matchedValues = observedValues.filter((valueId) => allowedValues.has(valueId));
        let quantity = null;
        if (rule.propertyId === 'P2044') {
          const value = candidateExtract.p2044Metres.find((item) => item >= rule.minimumValue);
          if (Number.isFinite(value)) quantity = { value, unitId: rule.unitId };
        }
        if (matchedValues.length || quantity) expectedContextMatches.set(rule.ruleId, { rule, matchedValues, quantity });
      }
    }
    const expectedContextTags = [...new Set([...expectedContextMatches.values()].map((match) => match.rule.tag))].sort();
    if (candidate.physicalContext.status === 'UNKNOWN') {
      if (tags.length !== 1 || tags[0] !== 'UNKNOWN' || candidate.physicalContext.evidence.length !== 0 || expectedContextMatches.size !== 0) throw new Error('UNKNOWN physical context must be exclusive and is permitted only when the complete authority extract resolves no rule');
    } else if (candidate.physicalContext.status === 'KNOWN') {
      if (tags.includes('UNKNOWN') || candidate.physicalContext.evidence.length === 0 || candidate.physicalContext.evidence.length !== expectedContextMatches.size) throw new Error('KNOWN physical context must carry exactly one closed evidence item for every rule matched by the complete authority extract');
      const derivedTags = new Set();
      const candidateEvidenceRules = new Set();
      for (const evidence of candidate.physicalContext.evidence) {
        if (!metadataSourceIds.has(evidence.metadataSourceId)) throw new Error('physical-context evidence source is absent from the frozen source registry');
        if (!sameJson(evidence.rubricRef, manifest.physicalContextRubricRef)) throw new Error('physical-context evidence rubric reference is stale or mismatched');
        if (!sameJson(evidence.catalogJoin, primaryCatalogJoin)) throw new Error('physical-context evidence catalogJoin does not resolve to the frozen primary package');
        const expectedMatch = expectedContextMatches.get(evidence.ruleId);
        const rule = expectedMatch?.rule;
        if (!rule || rule.tag !== evidence.tag || rule.evidenceKind !== evidence.evidenceKind || rule.sourceId !== evidence.metadataSourceId) throw new Error('physical-context evidence does not exactly resolve to a closed rubric rule');
        if (candidateEvidenceRules.has(evidence.ruleId)) throw new Error('candidate repeats a physical-context rule evidence item');
        candidateEvidenceRules.add(evidence.ruleId);
        const registryEntry = contextEvidenceRegistry.get(evidence.registryEntryId);
        if (!registryEntry || registryEntry.tag !== evidence.tag || registryEntry.ruleId !== evidence.ruleId || registryEntry.evidenceKind !== evidence.evidenceKind || registryEntry.metadataSourceId !== evidence.metadataSourceId || !sameJson(registryEntry.catalogJoin, evidence.catalogJoin)) throw new Error('physical-context evidence does not exactly resolve to its private frozen registry item');
        const { registryEntryId, ...registryRecord } = registryEntry;
        if (registryEntryId !== `CTXE-${canonicalHash(registryRecord).slice(0, 24)}`) throw new Error('physical-context registry item identity does not match its complete record');
        if ((registryEntry.authorityItemId ?? null) !== (evidence.authorityItemId ?? null)) throw new Error('physical-context authority item does not match the frozen registry item');
        if (candidate.authorityIdentity?.identifier !== evidence.authorityItemId || registryEntry.sourceSnapshotSha256 !== PINNED_AUTHORITY_SNAPSHOT_SHA256 || registryEntry.propertyId !== rule.propertyId) throw new Error('authority physical-context evidence does not join the frozen candidate authority item/snapshot');
        if (evidence.evidenceKind === 'AUTHORITY_QUANTITY') {
          if (!sameJson(registryEntry.quantity, expectedMatch.quantity)) throw new Error('authority quantity evidence does not equal the value derived from the complete frozen extract');
        } else if (!sameJson(registryEntry.valueIds, expectedMatch.matchedValues)) {
          throw new Error('authority relation values do not equal all matching values derived from the complete frozen extract');
        }
        usedContextEvidence.add(evidence.registryEntryId);
        derivedTags.add(rule.tag);
      }
      if (!sameJson([...candidateEvidenceRules].sort(), [...expectedContextMatches.keys()].sort()) || !sameJson([...derivedTags].sort(), expectedContextTags) || !sameJson([...tags].sort(), expectedContextTags)) throw new Error('physical-context rules/tags do not exactly equal the complete authority-extract derivation');
    } else {
      throw new Error('physical-context status is not discriminated as KNOWN or UNKNOWN');
    }
    const scale = candidate.scaleFunction;
    if (!sameJson(scale.rubricRef, manifest.scaleClassRubricRef)) throw new Error('candidate scale/function rubric reference is stale or mismatched');
    if (scale.status === 'KNOWN') {
      if (!metadataSourceIds.has(scale.authority.sourceId)) throw new Error('known scale/function authority source is absent from frozen metadata sources');
      const joinedPackage = candidate.packages.find((pkg) => (
        pkg.programId === scale.catalogJoin.programId
        && pkg.publicationIdentifier === scale.catalogJoin.publicationIdentifier
        && pkg.metadataSourceId === scale.catalogJoin.metadataSourceId
      ));
      if (!joinedPackage || joinedPackage !== primaryPackage) throw new Error('known scale/function catalogJoin does not resolve to the frozen primary package');
      if (scale.authority.classKind === 'WIKIDATA_P31') {
        if (scale.basisCode !== 'P31_ALLOWLIST_EXACT' || scale.authority.propertyId !== 'P31' || scale.authority.sourceId !== 'WIKIDATA' || candidate.authorityIdentity?.identifier !== scale.authority.itemId) throw new Error('Wikidata scale/function class does not join to the frozen authority identity');
        const observedClasses = authorityP31Registry.get(scale.authority.itemId);
        if (!observedClasses || scale.authority.classIds.length !== observedClasses.size || scale.authority.classIds.some((classId) => !observedClasses.has(classId))) throw new Error('Wikidata scale/function class set is not exactly the complete frozen P31 observation set');
        const resolved = scale.authority.classIds.map((classId) => scaleEntries.get(scaleRubricKey({ classKind: 'WIKIDATA_P31', sourceId: 'WIKIDATA', classId })));
        if (resolved.length === 0 || resolved.some((entry) => !entry)) throw new Error('KNOWN Wikidata scale/function includes an absent or unmapped P31 class');
        const resolvedBands = new Set(resolved.map((entry) => entry.band));
        if (resolvedBands.size !== 1 || !resolvedBands.has(scale.band)) throw new Error('Wikidata P31 classes are ambiguous or mismatch the declared scale band');
      } else {
        throw new Error('program-scope or synthesized catalogue classes cannot authorize KNOWN scale/function');
      }
    } else if (scale.status === 'UNKNOWN') {
      const observedClasses = authorityP31Registry.get(candidate.authorityIdentity?.identifier) ?? new Set();
      const resolved = [...observedClasses].map((classId) => scaleEntries.get(scaleRubricKey({ classKind: 'WIKIDATA_P31', sourceId: 'WIKIDATA', classId })));
      const resolvedBands = new Set(resolved.filter(Boolean).map((entry) => entry.band));
      const expectedReason = observedClasses.size === 0 ? 'NO_CLOSED_METADATA_EVIDENCE' : resolved.some((entry) => !entry) ? 'UNMAPPED_CLASS' : resolvedBands.size !== 1 ? 'AMBIGUOUS_CLASS' : null;
      if (expectedReason === null) throw new Error('scale/function is UNKNOWN despite a complete unambiguous allowlisted P31 class set');
      if (scale.reasonCode !== expectedReason) throw new Error('UNKNOWN scale/function reason does not match the frozen P31 observation/allowlist disposition');
    } else {
      throw new Error('scale/function status is not discriminated as KNOWN or UNKNOWN');
    }
  }
  if (contextExtractByTown.size !== candidateAuthorityOwners.size || [...contextExtractByTown].some(([stableTownId, entry]) => candidateAuthorityOwners.get(entry.authorityItemId) !== stableTownId)) throw new Error('physical-context complete authority extract contains an orphan or omits an authority-resolved candidate');
  if (authorityP31Registry.size !== candidateAuthorityOwners.size || [...authorityP31Registry.keys()].some((authorityItemId) => !candidateAuthorityOwners.has(authorityItemId))) throw new Error('authority P31 registry contains an orphan or omits an authority-resolved candidate');
  if ([...priorSeenIds].some((stableTownId) => !ids.has(stableTownId))) throw new Error('prior-seen registry contains an unknown stableTownId');
  if (usedFrameExclusions.size !== frameExclusionRegistry.size) throw new Error('frame-exclusion registry contains an orphan entry');
  if (usedContextEvidence.size !== contextEvidenceRegistry.size) throw new Error('physical-context evidence registry contains an orphan entry');
  const contextRulesUsedByRegistry = new Set(manifest.physicalContextEvidenceRegistry.map((entry) => entry.ruleId));
  if ([...contextValuesByRule.keys()].some((ruleId) => !contextRules.has(ruleId) || !contextRulesUsedByRegistry.has(ruleId))) throw new Error('physical-context value allowlist contains an orphan or unknown rule');
  const usedRelations = new Set();
  for (const [packageKey, usage] of packageUsages) {
    const relations = usage.records.map((pkg) => pkg.multiTownPackageRelation).filter(Boolean);
    if (usage.owners.size > 1) {
      if (relations.length !== usage.records.length) throw new Error('package identity reused across sampling units without an explicit multi-town relation');
      const relationIds = new Set(relations.map((relation) => relation.relationId));
      if (relationIds.size !== 1) throw new Error('shared package identity has inconsistent multi-town relationIds');
      const relation = relations[0];
      const declared = declaredRelations.get(relation.relationId);
      if (!declared || JSON.stringify(declared) !== JSON.stringify(relation)) throw new Error('shared package relation is not identically pre-frozen in the manifest registry');
      if (!relation.frozenBeforeSelection || relation.declaredUnitCount !== usage.owners.size || relation.packageIdentitySha256 !== sha256(packageKey)) throw new Error('shared package relation does not safely cluster its frozen sampling units');
      usedRelations.add(relation.relationId);
    } else if (relations.length) {
      throw new Error('single-unit package carries an unnecessary multi-town relation');
    }
  }
  if (usedRelations.size !== declaredRelations.size) throw new Error('multi-town package relation registry contains an orphan relation');
  const parentById = new Map([...ids].map((id) => [id, id]));
  const findClusterRoot = (id) => {
    let root = id;
    while (parentById.get(root) !== root) root = parentById.get(root);
    let cursor = id;
    while (parentById.get(cursor) !== cursor) {
      const next = parentById.get(cursor);
      parentById.set(cursor, root);
      cursor = next;
    }
    return root;
  };
  const connect = (left, right) => {
    const leftRoot = findClusterRoot(left);
    const rightRoot = findClusterRoot(right);
    if (leftRoot !== rightRoot) {
      const root = leftRoot < rightRoot ? leftRoot : rightRoot;
      parentById.set(leftRoot, root);
      parentById.set(rightRoot, root);
    }
  };
  const packageOwnersByHash = new Map();
  for (const [packageKey, usage] of packageUsages) {
    const owners = [...usage.owners].sort();
    packageOwnersByHash.set(sha256(packageKey), owners);
    for (const owner of owners.slice(1)) connect(owners[0], owner);
  }
  const equivalenceIds = new Set();
  for (const relation of manifest.packageEquivalenceRelations) {
    if (equivalenceIds.has(relation.relationId) || !relation.frozenBeforeSelection) throw new Error('package-equivalence relation is duplicated or not pre-frozen');
    equivalenceIds.add(relation.relationId);
    const leftOwners = packageOwnersByHash.get(relation.leftPackageIdentitySha256);
    const rightOwners = packageOwnersByHash.get(relation.rightPackageIdentitySha256);
    if (!leftOwners?.length || !rightOwners?.length) throw new Error('package-equivalence relation does not resolve both frozen package identities');
    for (const left of leftOwners) for (const right of rightOwners) connect(left, right);
  }
  const expectedComponents = new Map();
  for (const id of ids) {
    const root = findClusterRoot(id);
    const members = expectedComponents.get(root) ?? [];
    members.push(id);
    expectedComponents.set(root, members);
  }
  const declaredClusterById = new Map();
  const declaredMembershipOwners = new Map();
  for (const cluster of manifest.leakageClusters) {
    if (declaredClusterById.has(cluster.clusterId)) throw new Error('leakage clusterId is duplicated');
    const members = [...cluster.memberStableTownIds].sort();
    const membershipSha256 = canonicalHash(members);
    if (cluster.memberCount !== members.length || cluster.membershipSha256 !== membershipSha256 || cluster.clusterId !== `LKG-${membershipSha256.slice(0, 24)}` || !cluster.frozenBeforeSelection) throw new Error('leakage cluster identity/member hash/count is inconsistent');
    for (const member of members) {
      if (!ids.has(member) || declaredMembershipOwners.has(member)) throw new Error('leakage cluster member is unknown or appears in multiple clusters');
      declaredMembershipOwners.set(member, cluster.clusterId);
    }
    declaredClusterById.set(cluster.clusterId, cluster);
  }
  if (declaredMembershipOwners.size !== ids.size || declaredClusterById.size !== expectedComponents.size) throw new Error('leakage cluster registry does not partition every sampling unit exactly once');
  for (const membersUnsorted of expectedComponents.values()) {
    const members = [...membersUnsorted].sort();
    const membershipSha256 = canonicalHash(members);
    const cluster = declaredClusterById.get(`LKG-${membershipSha256.slice(0, 24)}`);
    if (!cluster || !sameJson([...cluster.memberStableTownIds].sort(), members)) throw new Error('leakage cluster does not equal the connected package/equivalence component');
  }
  for (const candidate of manifest.candidates) {
    const cluster = declaredClusterById.get(candidate.leakageClusterRef.clusterId);
    if (!cluster || !cluster.memberStableTownIds.includes(candidate.stableTownId) || candidate.leakageClusterRef.membershipSha256 !== cluster.membershipSha256 || candidate.leakageClusterRef.memberCount !== cluster.memberCount) throw new Error('candidate leakage-cluster reference does not resolve exactly');
    const expectedEligibility = cluster.memberCount === 1 ? 'ELIGIBLE_SINGLETON_CLUSTER' : 'EXCLUDED_NON_SINGLETON_LEAKAGE_CLUSTER';
    if (candidate.selectionEligibility !== expectedEligibility) throw new Error('candidate selection eligibility does not enforce atomic leakage clusters');
  }
  if (manifest.priorSeenCount !== computedPriorSeen) throw new Error('manifest priorSeenCount mismatch');
  for (const macro of MACROS) {
    if (!manifest.candidates.some((candidate) => candidate.macroRegion === macro)) throw new Error(`macro-region absent: ${macro}`);
  }
}

function eligibleCandidates(manifest) {
  return manifest.candidates.filter((candidate) => (
    candidate.frameEligibility.status === 'ELIGIBLE'
    && candidate.inspectedBeyondMetadataDuringFrameConstruction === false
    && candidate.selectionEligibility === 'ELIGIBLE_SINGLETON_CLUSTER'
  ));
}

function wouldViolateCaps(counts, candidate, total, exactPoolCounts) {
  const limits = quotaLimits(total);
  if (countOf(counts.macro, candidate.macroRegion) + 1 > limits.macroMax) return true;
  if (countOf(counts.country, candidate.countryCode) + 1 > limits.countryMax) return true;
  if (countOf(counts.program, candidate.primaryProgramId) + 1 > limits.programMax) return true;
  if (PHASES.includes(candidate.indexPhase) && countOf(counts.phase, candidate.indexPhase) + 1 > limits.phaseMax) return true;
  if (candidate.indexPhase === 'UNKNOWN' && countOf(counts.phase, 'UNKNOWN') + 1 > limits.unknownPhaseMax) return true;
  if (candidate.scaleFunction.band === 'UNKNOWN' && countOf(counts.scale, 'UNKNOWN') + 1 > limits.unknownScaleMax) return true;
  if (candidate.priorExposure === 'PRIOR_SEEN' && counts.priorSeen + 1 > limits.priorSeenMax) return true;
  const reserveKey = exactReserveKey(candidate);
  if (countOf(counts.exactReserve, reserveKey) + 1 >= countOf(exactPoolCounts, reserveKey)) return true;
  return false;
}

function remainingAvailability(remaining) {
  const available = {
    macro: new Map(MACROS.map((value) => [value, 0])),
    phase: new Map(PHASES.map((value) => [value, 0])),
    scale: new Map(SCALES.map((value) => [value, 0])),
    context: new Map(CONTEXTS.map((value) => [value, 0])),
  };
  for (const candidate of remaining) {
    increment(available.macro, candidate.macroRegion);
    if (PHASES.includes(candidate.indexPhase)) increment(available.phase, candidate.indexPhase);
    if (SCALES.includes(candidate.scaleFunction.band)) increment(available.scale, candidate.scaleFunction.band);
    for (const context of candidate.physicalContext.tags) if (CONTEXTS.includes(context)) increment(available.context, context);
  }
  return available;
}

function candidateMatches(candidate, family, value) {
  if (family === 'macro') return candidate.macroRegion === value;
  if (family === 'phase') return candidate.indexPhase === value;
  if (family === 'scale') return candidate.scaleFunction.band === value;
  if (family === 'context') return candidate.physicalContext.tags.includes(value);
  throw new Error(`unknown quota family: ${family}`);
}

function partitionCapacity(items, keyFor, remainingFor) {
  const counts = new Map();
  for (const item of items) increment(counts, keyFor(item));
  let capacity = 0;
  for (const [key, count] of counts) capacity += Math.min(count, Math.max(0, remainingFor(key)));
  return capacity;
}

function constrainedCapacity(items, projected, total, exactPoolCounts) {
  const limits = quotaLimits(total);
  const capacities = [items.length];
  capacities.push(partitionCapacity(items, (item) => item.macroRegion, (key) => limits.macroMax - countOf(projected.macro, key)));
  capacities.push(partitionCapacity(items, (item) => item.countryCode, (key) => limits.countryMax - countOf(projected.country, key)));
  capacities.push(partitionCapacity(items, (item) => item.primaryProgramId, (key) => limits.programMax - countOf(projected.program, key)));
  capacities.push(partitionCapacity(items, exactReserveKey, (key) => countOf(exactPoolCounts, key) - 1 - countOf(projected.exactReserve, key)));
  capacities.push(partitionCapacity(items, (item) => item.indexPhase, (key) => {
    if (PHASES.includes(key)) return limits.phaseMax - countOf(projected.phase, key);
    return limits.unknownPhaseMax - countOf(projected.phase, 'UNKNOWN');
  }));
  const knownScale = items.filter((item) => SCALES.includes(item.scaleFunction.band)).length;
  const unknownScale = items.length - knownScale;
  capacities.push(knownScale + Math.min(unknownScale, Math.max(0, limits.unknownScaleMax - countOf(projected.scale, 'UNKNOWN'))));
  const notPriorSeen = items.filter((item) => item.priorExposure !== 'PRIOR_SEEN').length;
  const priorSeen = items.length - notPriorSeen;
  capacities.push(notPriorSeen + Math.min(priorSeen, Math.max(0, limits.priorSeenMax - projected.priorSeen)));
  return Math.min(...capacities);
}

function minimumFeasibilityFailures(projected, futureEligible, slotsRemaining, total, exactPoolCounts) {
  const limits = quotaLimits(total);
  const futureAvailable = remainingAvailability(futureEligible);
  const failures = [];
  const groups = [
    ['macro', MACROS, projected.macro, futureAvailable.macro, limits.macroMin],
    ['phase', PHASES, projected.phase, futureAvailable.phase, limits.phaseMin],
    ['scale', SCALES, projected.scale, futureAvailable.scale, limits.scaleMin],
    ['context', CONTEXTS, projected.context, futureAvailable.context, limits.contextMin],
  ];
  for (const [family, values, current, future, minimum] of groups) {
    for (const value of values) {
      const deficit = Math.max(0, minimum - countOf(current, value));
      if (deficit > slotsRemaining) failures.push(`${family}:${value}:slots`);
      if (deficit > countOf(future, value)) failures.push(`${family}:${value}:availability`);
      if (deficit > 0) {
        const matching = futureEligible.filter((candidate) => candidateMatches(candidate, family, value));
        const capacity = constrainedCapacity(matching, projected, total, exactPoolCounts);
        if (deficit > capacity) failures.push(`${family}:${value}:capacity`);
      }
    }
  }
  if (constrainedCapacity(futureEligible, projected, total, exactPoolCounts) < slotsRemaining) failures.push('all:capacity');
  return failures;
}

function projectedCounts(counts, candidate) {
  const copy = {
    macro: new Map(counts.macro),
    phase: new Map(counts.phase),
    scale: new Map(counts.scale),
    context: new Map(counts.context),
    country: new Map(counts.country),
    program: new Map(counts.program),
    exactReserve: new Map(counts.exactReserve),
    priorSeen: counts.priorSeen,
  };
  return addCandidate(copy, candidate);
}

function validatePrefix(selected, total) {
  const counts = countsFor(selected);
  const limits = quotaLimits(total);
  const failures = [];
  for (const value of MACROS) {
    const count = countOf(counts.macro, value);
    if (count < limits.macroMin || count > limits.macroMax) failures.push(`macro:${value}`);
  }
  for (const [value, count] of counts.country) if (count > limits.countryMax) failures.push(`country:${value}`);
  for (const [value, count] of counts.program) if (count > limits.programMax) failures.push(`program:${value}`);
  for (const value of PHASES) {
    const count = countOf(counts.phase, value);
    if (count < limits.phaseMin || count > limits.phaseMax) failures.push(`phase:${value}`);
  }
  if (countOf(counts.phase, 'UNKNOWN') > limits.unknownPhaseMax) failures.push('phase:UNKNOWN');
  for (const value of SCALES) if (countOf(counts.scale, value) < limits.scaleMin) failures.push(`scale:${value}`);
  if (countOf(counts.scale, 'UNKNOWN') > limits.unknownScaleMax) failures.push('scale:UNKNOWN');
  for (const value of CONTEXTS) if (countOf(counts.context, value) < limits.contextMin) failures.push(`context:${value}`);
  if (counts.priorSeen > limits.priorSeenMax) failures.push('priorSeen');
  return { pass: failures.length === 0, failures, counts, limits };
}

function plainMap(map, preferredOrder = []) {
  const keys = [...new Set([...preferredOrder, ...map.keys()])];
  return Object.fromEntries(keys.filter((key) => map.has(key) || preferredOrder.includes(key)).map((key) => [key, countOf(map, key)]));
}

function publicCounts(counts) {
  return {
    macroRegions: plainMap(counts.macro, MACROS),
    phases: plainMap(counts.phase, [...PHASES, 'UNKNOWN']),
    scaleFunction: plainMap(counts.scale, [...SCALES, 'UNKNOWN']),
    physicalContexts: plainMap(counts.context, CONTEXTS),
    countryCount: counts.country.size,
    maximumSingleCountryCount: Math.max(0, ...counts.country.values()),
    programCount: counts.program.size,
    maximumSingleProgramCount: Math.max(0, ...counts.program.values()),
    priorSeenCount: counts.priorSeen,
  };
}

const privateJsonBytes = (value) => `${JSON.stringify(value, null, 2)}\n`;

function writePrivateJson(filePath, value) {
  const parent = path.dirname(filePath);
  const parentStat = fs.lstatSync(parent);
  if (!parentStat.isDirectory() || parentStat.isSymbolicLink() || (parentStat.mode & 0o777) !== 0o700) throw new Error('private output parent lost its custody properties');
  if (fs.existsSync(filePath)) {
    const existing = fs.lstatSync(filePath);
    if (!existing.isFile() || existing.isSymbolicLink() || (existing.mode & 0o777) !== 0o600) throw new Error('refusing to overwrite a non-private or non-regular custody output');
    assertOwnedByCurrentUser(existing, 'existing custody output');
  }
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC | (fs.constants.O_NOFOLLOW ?? 0);
  const descriptor = fs.openSync(filePath, flags, 0o600);
  try {
    fs.fchmodSync(descriptor, 0o600);
    fs.writeFileSync(descriptor, privateJsonBytes(value));
  } finally {
    fs.closeSync(descriptor);
  }
}

function orderedCandidates(candidates, selectionSeed) {
  const tieHashes = new Map(candidates.map((candidate) => [candidate.stableTownId, sha256(`${selectionSeed}|${candidate.stableTownId}`)]));
  const ordered = [...candidates].sort((left, right) => (
    tieHashes.get(left.stableTownId).localeCompare(tieHashes.get(right.stableTownId))
    || left.stableTownId.localeCompare(right.stableTownId)
  ));
  return { ordered, tieHashes };
}

function necessaryPoolBounds(candidates) {
  const counts = countsFor(candidates);
  const violatedBounds = [];
  const addMinimumBound = (prefix, family, value, required, available) => {
    if (available >= required) return;
    violatedBounds.push({
      constraintId: `PREFIX_${prefix}_${family}_${value}_MINIMUM_AVAILABILITY`,
      prefix,
      family,
      value,
      boundKind: 'MINIMUM_AVAILABILITY',
      required,
      available,
      proof: 'AVAILABLE_LT_REQUIRED',
    });
  };
  const addCapacityBound = (prefix, family, required, available) => {
    if (available >= required) return;
    violatedBounds.push({
      constraintId: `PREFIX_${prefix}_${family}_AGGREGATE_CAPACITY`,
      prefix,
      family,
      value: 'ALL',
      boundKind: 'AGGREGATE_CAPACITY',
      required,
      available,
      proof: 'CAPACITY_LT_REQUIRED',
    });
  };
  for (const total of LEGAL_PREFIXES) {
    const limits = quotaLimits(total);
    for (const value of MACROS) addMinimumBound(total, 'macro', value, limits.macroMin, countOf(counts.macro, value));
    for (const value of PHASES) addMinimumBound(total, 'phase', value, limits.phaseMin, countOf(counts.phase, value));
    for (const value of SCALES) addMinimumBound(total, 'scale', value, limits.scaleMin, countOf(counts.scale, value));
    for (const value of CONTEXTS) addMinimumBound(total, 'context', value, limits.contextMin, countOf(counts.context, value));
    const countryCapacity = [...counts.country.values()].reduce((sum, count) => sum + Math.min(count, limits.countryMax), 0);
    const programCapacity = [...counts.program.values()].reduce((sum, count) => sum + Math.min(count, limits.programMax), 0);
    addCapacityBound(total, 'countryCaps', total, countryCapacity);
    addCapacityBound(total, 'programCaps', total, programCapacity);
  }
  const reserveSafeCapacity = [...counts.exactReserve.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  addCapacityBound(LEGAL_PREFIXES.at(-1), 'samePrimaryStratumReserve', LEGAL_PREFIXES.at(-1), reserveSafeCapacity);
  violatedBounds.sort((left, right) => left.constraintId.localeCompare(right.constraintId));
  return { pass: violatedBounds.length === 0, violatedBounds, counts, reserveSafeCapacity };
}

function availabilityUnsatCertificate(candidates, selectionSeed, bounds = necessaryPoolBounds(candidates)) {
  const { ordered } = orderedCandidates(candidates, selectionSeed);
  return {
    certificateVersion: UNSAT_CERTIFICATE_VERSION,
    certificateType: 'UNSAT_BY_NECESSARY_POOL_BOUND',
    solverVersion: SOLVER_VERSION,
    formulationSha256: SOLVER_FORMULATION_SHA256,
    candidateCount: candidates.length,
    candidateOrderCommitmentSha256: canonicalHash(ordered.map((candidate) => candidate.stableTownId)),
    violatedBounds: bounds.violatedBounds,
    verification: 'RECOMPUTE_EACH_FROZEN_POOL_COUNT_OR_CAPACITY_AND_CONFIRM_AVAILABLE_OR_CAPACITY_IS_STRICTLY_BELOW_REQUIRED',
  };
}

function preflightPool(candidates, selectionSeed) {
  const bounds = necessaryPoolBounds(candidates);
  return {
    ...bounds,
    failures: bounds.violatedBounds.map((bound) => bound.constraintId),
    certificate: bounds.pass ? null : availabilityUnsatCertificate(candidates, selectionSeed, bounds),
  };
}

function replacementSwapPasses(selected, slotIndex, replacement) {
  if (slotIndex < 0 || slotIndex >= selected.length) return false;
  if (exactReserveKey(selected[slotIndex]) !== exactReserveKey(replacement)) return false;
  if (selected.some((candidate, index) => index !== slotIndex && candidate.stableTownId === replacement.stableTownId)) return false;
  const substituted = [...selected];
  substituted[slotIndex] = replacement;
  for (const prefix of LEGAL_PREFIXES.filter((value) => value > slotIndex)) {
    if (!validatePrefix(substituted.slice(0, prefix), prefix).pass) return false;
  }
  return true;
}

function buildReplacementQueues(selected, candidates, tieHashes) {
  const selectedIds = new Set(selected.map((candidate) => candidate.stableTownId));
  const unselected = candidates.filter((candidate) => !selectedIds.has(candidate.stableTownId));
  unselected.sort((left, right) => (
    tieHashes.get(left.stableTownId).localeCompare(tieHashes.get(right.stableTownId))
    || left.stableTownId.localeCompare(right.stableTownId)
  ));
  const queueBySlot = {};
  const queueLengths = [];
  const missingSlotPositions = [];
  for (let slotIndex = 0; slotIndex < selected.length; slotIndex += 1) {
    const slotKey = `SLOT_${String(slotIndex + 1).padStart(3, '0')}`;
    const queue = unselected
      .filter((candidate) => exactReserveKey(candidate) === exactReserveKey(selected[slotIndex]))
      .filter((candidate) => replacementSwapPasses(selected, slotIndex, candidate))
      .map((candidate) => candidate.stableTownId);
    queueBySlot[slotKey] = queue;
    queueLengths.push(queue.length);
    if (queue.length === 0) missingSlotPositions.push(slotIndex + 1);
  }
  return {
    pass: missingSlotPositions.length === 0,
    policyVersion: REPLACEMENT_POLICY_VERSION,
    queueBySlot,
    missingSlotPositions,
    aggregate: {
      slotCount: selected.length,
      slotsWithInitiallyLegalReplacement: selected.length - missingSlotPositions.length,
      minimumQueueLength: queueLengths.length === 0 ? 0 : Math.min(...queueLengths),
      maximumQueueLength: Math.max(0, ...queueLengths),
      totalQueueEntries: queueLengths.reduce((sum, value) => sum + value, 0),
    },
    executionLaw: 'FOR_A_SUBSTITUTION_SCAN_THE_PRESEALED_SLOT_QUEUE_IN_ORDER; SKIP_OPENED_USED_OR_CURRENTLY_ILLEGAL_ENTRIES; REVALIDATE_THE_COMPLETE_CURRENT_SLATE_AT_EVERY_AFFECTED_LEGAL_PREFIX; FAIL_CLOSED_IF_NONE_REMAINS',
  };
}

function chooseReplacementFromSealedQueue(currentSlate, slotIndex, sealedQueueStableTownIds, candidateById, unavailableStableTownIds = new Set()) {
  for (const stableTownId of sealedQueueStableTownIds) {
    if (unavailableStableTownIds.has(stableTownId)) continue;
    const candidate = candidateById.get(stableTownId);
    if (!candidate) throw new Error('sealed replacement queue contains an unknown candidate');
    if (replacementSwapPasses(currentSlate, slotIndex, candidate)) return candidate;
  }
  return null;
}

function publicSearchStats(stats, transcriptSha256) {
  return {
    nodesVisited: stats.nodesVisited.toString(),
    includeBranches: stats.includeBranches.toString(),
    skipBranches: stats.skipBranches.toString(),
    necessaryBoundPrunes: stats.necessaryBoundPrunes.toString(),
    prefixTerminalRejects: stats.prefixTerminalRejects.toString(),
    replacementTerminalRejects: stats.replacementTerminalRejects.toString(),
    completeSlateTerminals: stats.completeSlateTerminals.toString(),
    transcriptSha256,
  };
}

function solveExactNestedFrame(candidates, selectionSeed) {
  const { ordered, tieHashes } = orderedCandidates(candidates, selectionSeed);
  const candidateOrderCommitmentSha256 = canonicalHash(ordered.map((candidate) => candidate.stableTownId));
  const poolPreflight = preflightPool(candidates, selectionSeed);
  if (!poolPreflight.pass) {
    return {
      status: 'UNSAT',
      proofKind: 'NECESSARY_POOL_BOUND',
      certificate: poolPreflight.certificate,
      poolPreflight,
      tieHashes,
      candidateOrderCommitmentSha256,
    };
  }

  const exactPoolCounts = poolPreflight.counts.exactReserve;
  const stats = {
    nodesVisited: 0n,
    includeBranches: 0n,
    skipBranches: 0n,
    necessaryBoundPrunes: 0n,
    prefixTerminalRejects: 0n,
    replacementTerminalRejects: 0n,
    completeSlateTerminals: 0n,
  };
  const transcript = crypto.createHash('sha256');
  const record = (event, trancheIndex, startIndex, slotsRemaining, detail = '') => {
    transcript.update(`${event}|${trancheIndex}|${startIndex}|${slotsRemaining}|${detail}\n`);
  };

  function searchTranche(trancheIndex, selected, available) {
    const target = LEGAL_PREFIXES[trancheIndex];
    const trancheSize = target - selected.length;
    const startingCounts = countsFor(selected);

    function chooseTrancheMembers(startIndex, picks, counts) {
      stats.nodesVisited += 1n;
      const slotsRemaining = trancheSize - picks.length;
      const futureEligible = available.slice(startIndex);
      if (futureEligible.length < slotsRemaining) {
        stats.necessaryBoundPrunes += 1n;
        record('PRUNE_CARDINALITY', trancheIndex, startIndex, slotsRemaining);
        return null;
      }
      const failures = minimumFeasibilityFailures(counts, futureEligible, slotsRemaining, target, exactPoolCounts);
      if (failures.length > 0) {
        stats.necessaryBoundPrunes += 1n;
        record('PRUNE_NECESSARY_BOUND', trancheIndex, startIndex, slotsRemaining, failures.sort().join(','));
        return null;
      }
      if (slotsRemaining === 0) {
        const combined = [...selected, ...picks];
        const prefixValidation = validatePrefix(combined, target);
        if (!prefixValidation.pass) {
          stats.prefixTerminalRejects += 1n;
          record('REJECT_PREFIX', trancheIndex, startIndex, 0, prefixValidation.failures.sort().join(','));
          return null;
        }
        record('ACCEPT_PREFIX', trancheIndex, startIndex, 0);
        if (trancheIndex < LEGAL_PREFIXES.length - 1) {
          const pickedIds = new Set(picks.map((candidate) => candidate.stableTownId));
          const nextAvailable = available.filter((candidate) => !pickedIds.has(candidate.stableTownId));
          return searchTranche(trancheIndex + 1, combined, nextAvailable);
        }
        stats.completeSlateTerminals += 1n;
        const replacementPlan = buildReplacementQueues(combined, candidates, tieHashes);
        if (!replacementPlan.pass) {
          stats.replacementTerminalRejects += 1n;
          record('REJECT_REPLACEMENT', trancheIndex, startIndex, 0, replacementPlan.missingSlotPositions.join(','));
          return null;
        }
        record('ACCEPT_COMPLETE', trancheIndex, startIndex, 0);
        return { selected: combined, replacementPlan };
      }

      const candidate = available[startIndex];
      if (!wouldViolateCaps(counts, candidate, target, exactPoolCounts)) {
        stats.includeBranches += 1n;
        record('INCLUDE', trancheIndex, startIndex, slotsRemaining);
        const included = chooseTrancheMembers(startIndex + 1, [...picks, candidate], projectedCounts(counts, candidate));
        if (included) return included;
      } else {
        record('REJECT_INCLUDE_CAP', trancheIndex, startIndex, slotsRemaining);
      }
      stats.skipBranches += 1n;
      record('SKIP', trancheIndex, startIndex, slotsRemaining);
      return chooseTrancheMembers(startIndex + 1, picks, counts);
    }

    return chooseTrancheMembers(0, [], startingCounts);
  }

  const solution = searchTranche(0, [], ordered);
  const transcriptSha256 = transcript.digest('hex');
  const search = publicSearchStats(stats, transcriptSha256);
  if (solution) {
    return {
      status: 'SAT',
      proofKind: 'EXHAUSTIVE_SEARCH_FOUND_LEXICOGRAPHIC_OPTIMUM',
      selected: solution.selected,
      replacementPlan: solution.replacementPlan,
      tieHashes,
      exactPoolCounts,
      candidateOrderCommitmentSha256,
      search,
    };
  }
  const certificate = {
    certificateVersion: UNSAT_CERTIFICATE_VERSION,
    certificateType: 'UNSAT_BY_COMPLETE_ENUMERATION',
    solverVersion: SOLVER_VERSION,
    formulationSha256: SOLVER_FORMULATION_SHA256,
    candidateCount: candidates.length,
    candidateOrderCommitmentSha256,
    search,
    proof: 'THE_DETERMINISTIC_INCLUDE_FIRST_ENUMERATOR VISITED OR SOUNDLY PRUNED EVERY NESTED TRANCHE SUBSET; NO NODE OR TIME LIMIT EXISTS; REPLAY WITH THE SAME HASHED INPUTS MUST REPRODUCE THIS TRANSCRIPT HASH',
  };
  return {
    status: 'UNSAT',
    proofKind: 'COMPLETE_ENUMERATION',
    certificate,
    poolPreflight,
    tieHashes,
    candidateOrderCommitmentSha256,
    search,
  };
}

function verifyUnsatCertificate(candidates, selectionSeed, certificate) {
  if (certificate.formulationSha256 !== SOLVER_FORMULATION_SHA256 || certificate.solverVersion !== SOLVER_VERSION) return false;
  if (certificate.certificateType === 'UNSAT_BY_NECESSARY_POOL_BOUND') {
    return sameJson(certificate, availabilityUnsatCertificate(candidates, selectionSeed));
  }
  if (certificate.certificateType === 'UNSAT_BY_COMPLETE_ENUMERATION') {
    const replay = solveExactNestedFrame(candidates, selectionSeed);
    return replay.status === 'UNSAT'
      && replay.certificate.certificateType === 'UNSAT_BY_COMPLETE_ENUMERATION'
      && sameJson(replay.certificate, certificate);
  }
  return false;
}

function main() {
  const { manifestPath, outDir, schemaPath, scaleRubricPath, contextRubricPath, sourceRegistryPath } = parseArgs(process.argv.slice(2));
  assertCustodyPaths(manifestPath, outDir);
  const schemaBytes = fs.readFileSync(schemaPath);
  if (sha256(schemaBytes) !== PINNED_FRAME_SCHEMA_SHA256) throw new Error('frame schema digest is not selector-pinned');
  const schema = JSON.parse(schemaBytes.toString('utf8'));
  const scaleRubricBytes = fs.readFileSync(scaleRubricPath);
  const contextRubricBytes = fs.readFileSync(contextRubricPath);
  const sourceRegistryBytes = fs.readFileSync(sourceRegistryPath);
  const frozenInputs = {
    scaleRubric: JSON.parse(scaleRubricBytes.toString('utf8')),
    contextRubric: JSON.parse(contextRubricBytes.toString('utf8')),
    sourceRegistry: JSON.parse(sourceRegistryBytes.toString('utf8')),
    hashes: {
      scaleRubricSha256: sha256(scaleRubricBytes),
      contextRubricSha256: sha256(contextRubricBytes),
      sourceRegistrySha256: sha256(sourceRegistryBytes),
    },
  };
  const manifestBytes = fs.readFileSync(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  validateManifest(manifest, schema, frozenInputs);
  const candidates = eligibleCandidates(manifest);
  if (candidates.length < 180) throw new Error('fewer than 180 metadata-eligible candidates remain');
  const frameManifestSha256 = sha256(manifestBytes);
  const schemaSha256 = sha256(schemaBytes);
  const selectionSeed = sha256(`${PROTOCOL_SEED_PREFIX}${frameManifestSha256}`);
  const publicInputHashes = { schemaSha256, ...frozenInputs.hashes, solverFormulationSha256: SOLVER_FORMULATION_SHA256 };
  const frameEligibleCandidates = manifest.candidates.filter((candidate) => candidate.frameEligibility.status === 'ELIGIBLE' && candidate.inspectedBeyondMetadataDuringFrameConstruction === false);
  const frameExcludedCandidates = manifest.candidates.filter((candidate) => candidate.frameEligibility.status === 'EXCLUDED');
  const frameExcludedByReason = Object.fromEntries([...new Set(frameExcludedCandidates.map((candidate) => candidate.frameEligibility.reasonCode))].sort().map((reasonCode) => [reasonCode, frameExcludedCandidates.filter((candidate) => candidate.frameEligibility.reasonCode === reasonCode).length]));
  const excludedNonSingletonClusterUnits = frameEligibleCandidates.filter((candidate) => candidate.selectionEligibility === 'EXCLUDED_NON_SINGLETON_LEAKAGE_CLUSTER').length;
  const nonSingletonLeakageClusterCount = manifest.leakageClusters.filter((cluster) => cluster.memberCount > 1).length;
  const solverResult = solveExactNestedFrame(candidates, selectionSeed);
  if (solverResult.status === 'UNSAT') {
    if (!verifyUnsatCertificate(candidates, selectionSeed, solverResult.certificate)) throw new Error('generated UNSAT certificate failed deterministic verification');
    const metadataBoundFailure = solverResult.certificate.certificateType === 'UNSAT_BY_NECESSARY_POOL_BOUND';
    const poolPreflight = solverResult.poolPreflight;
    const selectionPrivate = {
      protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
      frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
      solverVersion: SOLVER_VERSION,
      status: metadataBoundFailure ? 'NOT_SELECTED_METADATA_SHORTFALL' : 'NOT_SELECTED_EXACT_SOLVER_UNSAT',
      frameManifestSha256, selectionSeed,
      selectedStableTownIds: [],
    };
    const reservesPrivate = {
      protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
      frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
      solverVersion: SOLVER_VERSION,
      replacementPolicyVersion: REPLACEMENT_POLICY_VERSION,
      status: metadataBoundFailure ? 'NOT_SEALED_METADATA_SHORTFALL' : 'NOT_SEALED_EXACT_SOLVER_UNSAT',
      selectionSeed,
      replacementQueuesBySlot: {},
    };
    const selectionSha256 = sha256(privateJsonBytes(selectionPrivate));
    const reservesSha256 = sha256(privateJsonBytes(reservesPrivate));
    const shortfall = {
      proofKind: solverResult.proofKind,
      failures: [...poolPreflight.failures].sort(),
      candidateCounts: publicCounts(poolPreflight.counts),
      reserveSafeCapacity: poolPreflight.reserveSafeCapacity,
      unsatCertificate: solverResult.certificate,
    };
    const bundle = {
      status: metadataBoundFailure ? 'FRAME_NOT_FROZEN_METADATA_SHORTFALL' : 'FRAME_NOT_FROZEN_EXACT_SOLVER_UNSAT',
      protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
      frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
      publicInputHashes, manifest, selection: selectionPrivate, reserves: reservesPrivate, shortfall,
    };
    const bundleSha256 = sha256(privateJsonBytes(bundle));
    const aggregate = {
      protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
      frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
      solverVersion: SOLVER_VERSION,
      replacementPolicyVersion: REPLACEMENT_POLICY_VERSION,
      solverFormulationSha256: SOLVER_FORMULATION_SHA256,
      status: metadataBoundFailure ? 'FROZEN_METADATA_SHORTFALL' : 'FROZEN_EXACT_SOLVER_UNSAT',
      candidateIdentityCount: manifest.candidates.length,
      frameEligibleCandidateCount: frameEligibleCandidates.length,
      frameExcludedCandidateCount: frameExcludedCandidates.length,
      frameExcludedByReason,
      selectionEligibleSingletonCount: candidates.length,
      excludedNonSingletonClusterUnitCount: excludedNonSingletonClusterUnits,
      leakageClusterCount: manifest.leakageClusters.length,
      nonSingletonLeakageClusterCount,
      selectedCount: 0,
      reserveCount: 0,
      holdoutAllocated: false,
      unsatCertificateVerified: true,
      preflight: shortfall,
      hashes: { ...publicInputHashes, frameManifestSha256, selectionSeed, selectionSha256, reservesSha256, bundleSha256 },
    };
    writePrivateJson(path.join(outDir, 'ucf-1-selected-slate.json'), selectionPrivate);
    writePrivateJson(path.join(outDir, 'ucf-1-reserve-order.json'), reservesPrivate);
    writePrivateJson(path.join(outDir, 'ucf-1-quota-validation.private.json'), aggregate);
    writePrivateJson(path.join(outDir, 'ucf-1-frame-custody-bundle.json'), bundle);
    writePrivateJson(path.join(outDir, 'ucf-1-aggregate-summary.json'), aggregate);
    process.stdout.write(`${JSON.stringify(aggregate)}\n`);
    process.exitCode = 2;
    return;
  }
  const { selected, tieHashes, replacementPlan, search } = solverResult;
  const selectedIds = new Set(selected.map((candidate) => candidate.stableTownId));
  const unselected = candidates.filter((candidate) => !selectedIds.has(candidate.stableTownId));

  const selectedExactKeys = [...new Set(selected.map(exactReserveKey))];
  if (!replacementPlan.pass || replacementPlan.missingSlotPositions.length > 0) throw new Error('exact solver returned a slate without a full-vector legal per-slot replacement queue');

  const prefixReports = LEGAL_PREFIXES.map((prefix) => {
    const validation = validatePrefix(selected.slice(0, prefix), prefix);
    return { prefix, pass: validation.pass, failures: validation.failures, limits: validation.limits, counts: publicCounts(validation.counts) };
  });
  if (prefixReports.some((report) => !report.pass)) throw new Error('one or more legal prefixes failed frozen quota validation');
  const clusterBoundaryReports = LEGAL_PREFIXES.map((prefix) => {
    const inside = new Set(selected.slice(0, prefix).map((candidate) => candidate.stableTownId));
    const crossingClusterCount = manifest.leakageClusters.filter((cluster) => cluster.memberStableTownIds.some((id) => inside.has(id)) && cluster.memberStableTownIds.some((id) => !inside.has(id))).length;
    return { prefix, pass: crossingClusterCount === 0, crossingClusterCount };
  });
  if (clusterBoundaryReports.some((report) => !report.pass)) throw new Error('a leakage cluster crosses a legal slate prefix');
  const holdoutClusterFeasibility = LEGAL_PREFIXES.map((prefix) => {
    const minimumTownCount = ceilRate(0.15, prefix);
    const maximumTownCount = floorRate(0.20, prefix);
    const deterministicTargetTownCount = Math.min(maximumTownCount, Math.max(minimumTownCount, Math.round(0.18 * prefix)));
    return { prefix, minimumTownCount, maximumTownCount, deterministicTargetTownCount, clusterAtomicFeasible: true, allocationPerformed: false };
  });

  const selectedStableTownIds = selected.map((candidate) => candidate.stableTownId);
  const selectedLeakageClusterRefs = selected.map((candidate) => candidate.leakageClusterRef);
  const selectionPrivate = {
    protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
    frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
    solverVersion: SOLVER_VERSION, solverSearch: search,
    frameManifestSha256, selectionSeed, publicInputHashes, selectedStableTownIds, selectedLeakageClusterRefs,
  };
  const candidateById = new Map(candidates.map((candidate) => [candidate.stableTownId, candidate]));
  const replacementClusterRefsBySlot = {};
  const actionableReserveIds = new Set();
  for (const [slotKey, queue] of Object.entries(replacementPlan.queueBySlot)) {
    for (const stableTownId of queue) actionableReserveIds.add(stableTownId);
    replacementClusterRefsBySlot[slotKey] = queue.map((stableTownId) => candidateById.get(stableTownId).leakageClusterRef);
  }
  const reservesPrivate = {
    protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
    frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
    solverVersion: SOLVER_VERSION,
    replacementPolicyVersion: REPLACEMENT_POLICY_VERSION,
    selectionSeed, publicInputHashes,
    replacementQueuesBySlot: replacementPlan.queueBySlot,
    replacementClusterRefsBySlot,
    replacementExecutionLaw: replacementPlan.executionLaw,
  };
  const selectionSha256 = sha256(privateJsonBytes(selectionPrivate));
  const reservesSha256 = sha256(privateJsonBytes(reservesPrivate));
  const bundle = { status: 'FRAME_FROZEN', publicInputHashes, manifest, selection: selectionPrivate, reserves: reservesPrivate };
  const bundleSha256 = sha256(privateJsonBytes(bundle));
  const aggregate = {
    protocolId: 'HEEP-1', protocolVersion: PROTOCOL_VERSION,
    frameVersion: FRAME_VERSION, ruleVersion: RULE_VERSION,
    solverVersion: SOLVER_VERSION,
    replacementPolicyVersion: REPLACEMENT_POLICY_VERSION,
    solverFormulationSha256: SOLVER_FORMULATION_SHA256,
    status: 'FRAME_FROZEN',
    candidateIdentityCount: manifest.candidates.length,
    frameEligibleCandidateCount: frameEligibleCandidates.length,
    frameExcludedCandidateCount: frameExcludedCandidates.length,
    frameExcludedByReason,
    selectionEligibleSingletonCount: candidates.length,
    excludedNonSingletonClusterUnitCount: excludedNonSingletonClusterUnits,
    leakageClusterCount: manifest.leakageClusters.length,
    nonSingletonLeakageClusterCount,
    selectedCount: selected.length,
    reserveCount: actionableReserveIds.size,
    unselectedSelectionEligibleCount: unselected.length,
    selectedExactStratumCount: selectedExactKeys.length,
    selectedSlotsWithFullVectorReplacementQueue: replacementPlan.aggregate.slotsWithInitiallyLegalReplacement,
    replacementQueueAggregate: replacementPlan.aggregate,
    deterministicCompleteSearch: search,
    candidateCounts: publicCounts(countsFor(candidates)),
    prefixReports,
    clusterBoundaryReports,
    holdoutClusterFeasibility,
    hashes: { ...publicInputHashes, frameManifestSha256, selectionSeed, selectionSha256, reservesSha256, bundleSha256 },
  };

  writePrivateJson(path.join(outDir, 'ucf-1-selected-slate.json'), selectionPrivate);
  writePrivateJson(path.join(outDir, 'ucf-1-reserve-order.json'), reservesPrivate);
  writePrivateJson(path.join(outDir, 'ucf-1-quota-validation.private.json'), aggregate);
  writePrivateJson(path.join(outDir, 'ucf-1-frame-custody-bundle.json'), bundle);
  writePrivateJson(path.join(outDir, 'ucf-1-aggregate-summary.json'), aggregate);
  process.stdout.write(`${JSON.stringify(aggregate)}\n`);
}

const isDirectInvocation = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectInvocation) main();

export {
  CONTEXTS,
  FRAME_VERSION,
  LEGAL_PREFIXES,
  MACROS,
  PHASES,
  REPLACEMENT_POLICY_VERSION,
  RULE_VERSION,
  SCALES,
  SOLVER_FORMULATION,
  SOLVER_FORMULATION_SHA256,
  SOLVER_VERSION,
  availabilityUnsatCertificate,
  buildReplacementQueues,
  chooseReplacementFromSealedQueue,
  preflightPool,
  quotaLimits,
  replacementSwapPasses,
  solveExactNestedFrame,
  validatePrefix,
  verifyUnsatCertificate,
};
