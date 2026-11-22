#!/usr/bin/env node
/**
 * bound-book-report.mjs — AE-1 design-law census.
 *
 * AE-1 deliberately observes existing visual debt without making that debt a
 * gate. Configuration failures are different: a malformed vocabulary or a
 * stale manifest entry makes the census untrustworthy and therefore exits 1 in
 * every mode. Individual debt families can be promoted later with
 * `--enforce=seams`, `--enforce=steps`, or `--enforce=motion`.
 *
 * The exported helpers accept in-memory source records so the report contract
 * can be mutation-tested without writing fixtures into the repository.
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
} from 'node:fs';
import {
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'espree';
import postcss from 'postcss';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
export const DEFAULT_ROOT = resolve(dirname(SCRIPT_PATH), '../..');

export const FINDING_CATEGORIES = Object.freeze([
  'legacyParchmentBackground',
  'missingStaticComposition',
  'rawMotionValue',
  'undeclaredAnimation',
  'unregisteredArtwork',
  'unregisteredReaderSurface',
]);

export const ENFORCEMENT_SCOPES = Object.freeze({
  seams: Object.freeze(['unregisteredArtwork']),
  steps: Object.freeze([
    'legacyParchmentBackground',
    'unregisteredReaderSurface',
  ]),
  motion: Object.freeze([
    'missingStaticComposition',
    'rawMotionValue',
    'undeclaredAnimation',
  ]),
});

const EXPECTED_SEAMS = Object.freeze(['edge', 'feather', 'letterbox', 'plate']);
const EXPECTED_STEPS = Object.freeze(['card', 'nested', 'page']);
const EXPECTED_MOTION = Object.freeze(['none', 'reveal', 'scrub', 'settle']);
const EXPECTED_REGISTERS = Object.freeze([
  'ceremonial',
  'chrome',
  'manuscript',
  'parchment',
]);
const VOICE_FLOORS = new Set(['ui', 'plain', 'chronicle', 'covenant']);
const SOURCE_EXTENSION = /\.(?:[cm]?[jt]sx?|s?css)$/;
const DECLARATION_SOURCE = /\.d\.(?:[cm]?ts|tsx)$/;
const TOKEN_SOURCE = /^(?:src\/design\/tokens\.js|src\/design\/boundBook\.js|src\/design\/organic\/motion\.js|src\/styles\/organic(?:Vars)?\.css)$/;
const JS_STEP_PROPERTY = new Set(['background', 'backgroundColor']);
const JS_MOTION_PROPERTIES = new Set([
  'animation',
  'animationDelay',
  'animationDuration',
  'animationIterationCount',
  'animationTimingFunction',
  'transition',
  'transitionDelay',
  'transitionDuration',
  'transitionTimingFunction',
]);
const CSS_MOTION_PROPERTY = /^(?:animation|transition)(?:-(?:delay|duration|iteration-count|timing-function))?$/i;
const RAW_MOTION_VALUE = /(?:\b\d*\.?\d+(?:ms|s)\b|\bcubic-bezier\s*\(|\b(?:ease(?:-in|-out|-in-out)?|linear|infinite|spring|bounce)\b)/i;
const CSS_MOTION_VARIABLE = Object.freeze({
  '--motion-none-duration': Object.freeze({ kind: 'none', field: 'durationMs' }),
  '--motion-none-easing': Object.freeze({ kind: 'none', field: 'easing' }),
  '--motion-reveal-duration': Object.freeze({ kind: 'reveal', field: 'durationMs' }),
  '--motion-reveal-easing': Object.freeze({ kind: 'reveal', field: 'easing' }),
  '--motion-scrub-easing': Object.freeze({ kind: 'scrub', field: 'easing' }),
  '--motion-settle-duration': Object.freeze({ kind: 'settle', field: 'durationMs' }),
  '--motion-settle-easing': Object.freeze({ kind: 'settle', field: 'easing' }),
  '--motion-settle-translate-y': Object.freeze({ kind: 'settle', field: 'translateYPx' }),
});
const CSS_VARIABLE_REFERENCE = /var\(\s*(--[a-z0-9-]+)\s*\)/gi;
const EXACT_STEP_REF = /^var\(\s*--parchment-step-(?:page|card|nested)\s*\)$/;
const ART_CUSTOM_PROPERTY = /^--(?:card-bg|page-bg|sf-scene)$/i;
const ART_REGISTRY_NAME = /_BACKGROUNDS$/;
const MOTION_AVAILABLE_FIELDS = Object.freeze({
  none: Object.freeze(['durationMs', 'easing', 'iterations']),
  settle: Object.freeze(['durationMs', 'easing', 'iterations', 'translateYPx']),
  reveal: Object.freeze(['durationMs', 'easing', 'iterations']),
  scrub: Object.freeze(['easing', 'iterations']),
});
const READER_CLASS_WORD = /(?:^|[-_])(?:card|receipt|dossier|chronicle)(?:$|[-_])/i;
const NON_SURFACE_CLASS_WORD = /(?:^|[-_])(?:action|badge|bg|button|char|chip|facts|foot|footer|header|icon|plate)(?:$|[-_])/i;
const toPosix = (value) => String(value).split(sep).join('/');

function relativePath(root, input) {
  const path = isAbsolute(input) ? relative(root, input) : input;
  return toPosix(path).replace(/^\.\//, '');
}

function compareText(left, right) {
  const a = String(left);
  const b = String(right);
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareFinding(left, right) {
  return compareText(left.path, right.path)
    || (Number(left.line || 0) - Number(right.line || 0))
    || compareText(left.detail, right.detail);
}

function compareConfigError(left, right) {
  return compareText(left.code, right.code)
    || compareText(left.path, right.path)
    || compareText(left.message, right.message);
}

function uniqueSorted(values) {
  return [...new Set(Array.from(values, String))].sort(compareText);
}

function enumValues(value) {
  if (Array.isArray(value)) return value.filter((entry) => typeof entry === 'string');
  if (!value || typeof value !== 'object') return [];
  const values = Object.values(value);
  if (values.length && values.every((entry) => typeof entry === 'string')) return values;
  return Object.keys(value);
}

function normalizeManifest(value, exportName, errors) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, row]) => (
      row && typeof row === 'object' && !Array.isArray(row)
        ? { ...row, id: row.id || key }
        : row
    ));
  }
  errors.push({
    code: 'invalid-manifest',
    path: exportName,
    message: `${exportName} must be an array or object map.`,
  });
  return [];
}

function exactVocabulary(errors, exportName, actual, expected) {
  const got = uniqueSorted(actual);
  const want = uniqueSorted(expected);
  if (got.join('\u0000') !== want.join('\u0000')) {
    errors.push({
      code: 'vocabulary-mismatch',
      path: exportName,
      message: `${exportName} must contain exactly: ${want.join(', ')}; received: ${got.join(', ') || '(empty)'}.`,
    });
  }
}

function ownerText(row, sourceIndex, root) {
  const rel = relativePath(root, row.ownerPath || '');
  if (sourceIndex.has(rel)) return sourceIndex.get(rel).text;
  const absolute = resolve(root, rel);
  if (!existsSync(absolute)) return null;
  try {
    return readFileSync(absolute, 'utf8');
  } catch {
    return null;
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateManifestRows({
  rows,
  exportName,
  kind,
  seams,
  registers,
  motion,
  sourceIndex,
  root,
  errors,
  ids,
}) {
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const rowPath = `${exportName}[${index}]`;
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      errors.push({
        code: 'invalid-manifest-row',
        path: rowPath,
        message: 'Manifest rows must be objects.',
      });
      continue;
    }
    if (typeof row.id !== 'string' || !row.id.trim()) {
      errors.push({
        code: 'invalid-manifest-row',
        path: rowPath,
        message: 'Manifest row id must be a non-empty string.',
      });
    } else if (ids.has(row.id)) {
      errors.push({
        code: 'duplicate-id',
        path: `${exportName}.${row.id}`,
        message: `Duplicate manifest id "${row.id}".`,
      });
    } else {
      ids.add(row.id);
    }

    const ownerPath = typeof row.ownerPath === 'string'
      ? relativePath(root, row.ownerPath)
      : '';
    if (!ownerPath || ownerPath.startsWith('../') || !ownerPath.startsWith('src/')) {
      errors.push({
        code: 'invalid-owner-path',
        path: `${exportName}.${row.id || index}`,
        message: 'ownerPath must be a repository-relative path below src/.',
      });
      continue;
    }

    const ownerSymbol = typeof row.ownerSymbol === 'string'
      ? row.ownerSymbol
      : row.ownerSelector;
    const selector = typeof row.selector === 'string' ? row.selector : null;
    const hasSymbol = typeof ownerSymbol === 'string' && ownerSymbol.trim();
    const hasSelector = typeof selector === 'string' && selector.trim();
    if (!hasSymbol && !hasSelector) {
      errors.push({
        code: 'invalid-owner-locator',
        path: `${exportName}.${row.id || index}`,
        message: 'Each manifest row must name ownerSymbol or selector.',
      });
    }

    const text = ownerText({ ...row, ownerPath }, sourceIndex, root);
    if (text === null) {
      errors.push({
        code: 'stale-owner-path',
        path: `${exportName}.${row.id || index}`,
        message: `ownerPath does not exist or cannot be read: ${ownerPath}.`,
      });
    } else {
      if (hasSymbol && !new RegExp(`\\b${escapeRegExp(ownerSymbol)}\\b`).test(text)) {
        errors.push({
          code: 'stale-owner-symbol',
          path: `${exportName}.${row.id || index}`,
          message: `owner symbol "${ownerSymbol}" is absent from ${ownerPath}.`,
        });
      }
      if (hasSelector && !text.includes(selector)) {
        errors.push({
          code: 'stale-owner-selector',
          path: `${exportName}.${row.id || index}`,
          message: `selector "${selector}" is absent from ${ownerPath}.`,
        });
      }
    }

    if (kind === 'artwork') {
      if (!seams.has(row.seam)) {
        errors.push({
          code: 'unknown-seam',
          path: `${exportName}.${row.id || index}`,
          message: `Unknown seam "${String(row.seam)}".`,
        });
      } else if (row.seam === 'edge') {
        errors.push({
          code: 'parked-edge-use',
          path: `${exportName}.${row.id || index}`,
          message: 'The edge seam is reserved but parked and cannot be assigned.',
        });
      }
    }

    const surfaceRegister = row.surfaceRegister ?? row.register;
    if (kind === 'reader' && !registers.has(surfaceRegister)) {
      errors.push({
        code: 'unknown-register',
        path: `${exportName}.${row.id || index}`,
        message: `Unknown surface register "${String(surfaceRegister)}".`,
      });
    }

    if (row.motion != null && !motion.has(row.motion)) {
      errors.push({
        code: 'unknown-motion',
        path: `${exportName}.${row.id || index}`,
        message: `Unknown motion "${String(row.motion)}".`,
      });
    }
  }
}

function validateManifestCoverage({ rows, exportName, kind, analyses, sourceIndex, root, errors }) {
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue;
    const path = relativePath(root, row.ownerPath || '');
    const owner = manifestOwner(row);
    if (!path || !owner || !sourceIndex.has(path)) continue;
    const analysis = analyses.get(path);
    if (!analysis || analysis.parseError) continue;
    if (analysis.ambiguousOwners.includes(owner)) {
      errors.push({
        code: 'ambiguous-owner-symbol',
        path: `${exportName}.${row.id || index}`,
        message: `${owner} names more than one lexical owner in ${path}; extract or rename the surface before registration.`,
      });
      continue;
    }
    if (analysis[kind].some((candidate) => candidate.owner === owner)) continue;
    errors.push({
      code: 'stale-manifest-surface',
      path: `${exportName}.${row.id || index}`,
      message: `${owner} exists in ${path} but is not a detected ${kind} surface owner.`,
    });
  }
}

/**
 * Validate the AE-1 substrate. Existing UI debt is intentionally absent here;
 * only conditions that make the manifests or vocabulary untrustworthy belong
 * in this fatal channel.
 */
export function validateBoundBookConfig(config, {
  root = DEFAULT_ROOT,
  sourceFiles = null,
} = {}) {
  const errors = [];
  const sources = normalizeSourceFiles(sourceFiles || collectSourceFiles(root), root);
  const sourceIndex = new Map(sources.map((source) => [source.path, source]));
  const analyses = new Map();
  for (const source of sources) {
    const analysis = analyzeSource(source);
    analyses.set(source.path, analysis);
    if (analysis.parseError) {
      errors.push({
        code: 'source-parse-failed',
        path: source.path,
        message: analysis.parseError,
      });
    }
  }

  const seams = new Set(enumValues(config?.SEAM_KINDS));
  const registerKeys = config?.SURFACE_REGISTERS && typeof config.SURFACE_REGISTERS === 'object'
    ? Object.keys(config.SURFACE_REGISTERS)
    : [];
  const registers = new Set(registerKeys);
  const motionKeys = config?.MOTION && typeof config.MOTION === 'object'
    ? Object.keys(config.MOTION)
    : [];
  const motion = new Set(motionKeys);
  const stepKeys = config?.PARCHMENT_STEPS && typeof config.PARCHMENT_STEPS === 'object'
    ? Object.keys(config.PARCHMENT_STEPS)
    : [];

  exactVocabulary(errors, 'SEAM_KINDS', seams, EXPECTED_SEAMS);
  exactVocabulary(errors, 'SURFACE_REGISTERS', registerKeys, EXPECTED_REGISTERS);
  exactVocabulary(errors, 'MOTION', motionKeys, EXPECTED_MOTION);
  exactVocabulary(errors, 'PARCHMENT_STEPS', stepKeys, EXPECTED_STEPS);

  if (config?.SURFACE_REGISTERS && typeof config.SURFACE_REGISTERS === 'object') {
    const ranks = new Set();
    for (const [name, row] of Object.entries(config.SURFACE_REGISTERS)) {
      if (!row || typeof row !== 'object' || !Number.isFinite(row.rank)) {
        errors.push({
          code: 'invalid-register',
          path: `SURFACE_REGISTERS.${name}`,
          message: 'Each register needs a finite numeric rank.',
        });
      } else if (ranks.has(row.rank)) {
        errors.push({
          code: 'invalid-register',
          path: `SURFACE_REGISTERS.${name}`,
          message: `Register rank ${row.rank} is duplicated.`,
        });
      } else {
        ranks.add(row.rank);
      }
      if (!VOICE_FLOORS.has(row?.voiceFloor)) {
        errors.push({
          code: 'invalid-register',
          path: `SURFACE_REGISTERS.${name}`,
          message: `Unknown voiceFloor "${String(row?.voiceFloor)}".`,
        });
      }
    }
  }

  if (config?.PARCHMENT_STEPS && typeof config.PARCHMENT_STEPS === 'object') {
    for (const step of EXPECTED_STEPS) {
      if (typeof config.PARCHMENT_STEPS[step] !== 'string' || !config.PARCHMENT_STEPS[step]) {
        errors.push({
          code: 'invalid-parchment-step',
          path: `PARCHMENT_STEPS.${step}`,
          message: 'Parchment step values must be non-empty token strings.',
        });
      }
    }
  }

  if (config?.MOTION && typeof config.MOTION === 'object') {
    for (const name of EXPECTED_MOTION) {
      const row = config.MOTION[name];
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        errors.push({
          code: 'invalid-motion-token',
          path: `MOTION.${name}`,
          message: 'Motion token rows must be non-null objects.',
        });
        continue;
      }
      if (!['scroll', 'static', 'time'].includes(row.owner)) {
        errors.push({
          code: 'invalid-motion-token',
          path: `MOTION.${name}`,
          message: `Unknown motion owner "${String(row.owner)}".`,
        });
      }
      if (!(row.durationMs === null || Number.isFinite(row.durationMs))) {
        errors.push({
          code: 'invalid-motion-token',
          path: `MOTION.${name}`,
          message: 'durationMs must be finite or null for scroll ownership.',
        });
      }
      if (typeof row.easing !== 'string' || !row.easing) {
        errors.push({
          code: 'invalid-motion-token',
          path: `MOTION.${name}`,
          message: 'easing must be a non-empty string.',
        });
      } else if (/bounce|spring/i.test(row.easing)) {
        errors.push({
          code: 'forbidden-motion',
          path: `MOTION.${name}`,
          message: 'Bounce and spring easing are forbidden.',
        });
      }
      if (row.iterations !== 1) {
        errors.push({
          code: 'forbidden-motion',
          path: `MOTION.${name}`,
          message: 'Motion tokens must resolve exactly once.',
        });
      }
      if (typeof row.staticComposition !== 'string' || !row.staticComposition) {
        errors.push({
          code: 'invalid-motion-token',
          path: `MOTION.${name}`,
          message: 'Every motion token must name its staticComposition.',
        });
      }
    }
  }

  const artwork = normalizeManifest(
    config?.ARTWORK_SURFACE_MANIFEST,
    'ARTWORK_SURFACE_MANIFEST',
    errors,
  );
  const readers = normalizeManifest(
    config?.READER_SURFACE_MANIFEST,
    'READER_SURFACE_MANIFEST',
    errors,
  );
  const manifestIds = new Set();
  validateManifestRows({
    rows: artwork,
    exportName: 'ARTWORK_SURFACE_MANIFEST',
    kind: 'artwork',
    seams,
    registers,
    motion,
    sourceIndex,
    root,
    errors,
    ids: manifestIds,
  });
  validateManifestRows({
    rows: readers,
    exportName: 'READER_SURFACE_MANIFEST',
    kind: 'reader',
    seams,
    registers,
    motion,
    sourceIndex,
    root,
    errors,
    ids: manifestIds,
  });
  validateManifestCoverage({
    rows: artwork,
    exportName: 'ARTWORK_SURFACE_MANIFEST',
    kind: 'artwork',
    analyses,
    sourceIndex,
    root,
    errors,
  });
  validateManifestCoverage({
    rows: readers,
    exportName: 'READER_SURFACE_MANIFEST',
    kind: 'readers',
    analyses,
    sourceIndex,
    root,
    errors,
  });

  return {
    errors: errors.sort(compareConfigError),
    artwork,
    readers,
    sources,
    analyses,
  };
}

function addFinding(findings, seen, category, path, line, detail) {
  const key = `${category}\u0000${path}\u0000${line}\u0000${detail}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings[category].push({ path, line, detail });
}

function manifestOwner(row) {
  return row?.ownerSymbol || row?.ownerSelector || row?.selector || '';
}

function registrationIndex(rows, root, predicate = () => true) {
  const index = new Map();
  for (const row of rows) {
    if (!row || !predicate(row)) continue;
    const path = relativePath(root, row.ownerPath || '');
    const owner = manifestOwner(row);
    if (!path || !owner) continue;
    if (!index.has(path)) index.set(path, new Set());
    index.get(path).add(owner);
  }
  return index;
}

function registrationCovers(index, path, owner) {
  return index.get(path)?.has(owner) === true;
}

function motionRegistrationIndex(rows, root) {
  const index = new Map();
  for (const row of rows) {
    if (!row?.motion || row.motion === 'none') continue;
    const path = relativePath(root, row.ownerPath || '');
    const owner = manifestOwner(row);
    if (!path || !owner) continue;
    if (!index.has(path)) index.set(path, new Map());
    index.get(path).set(owner, row.motion);
  }
  return index;
}

function registeredMotion(index, path, owner) {
  return index.get(path)?.get(owner) || null;
}

function propertyName(node) {
  if (!node?.key) return null;
  if (!node.computed && node.key.type === 'Identifier') return node.key.name;
  if (node.key.type === 'Literal' && typeof node.key.value === 'string') return node.key.value;
  return null;
}

function jsxName(node) {
  if (!node) return '';
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'JSXMemberExpression') return jsxName(node.property);
  return '';
}

function memberPath(node) {
  const parts = [];
  let cursor = node;
  while (cursor?.type === 'MemberExpression') {
    if (!cursor.computed && cursor.property?.type === 'Identifier') {
      parts.unshift(cursor.property.name);
    } else if (cursor.computed && cursor.property?.type === 'Literal'
      && typeof cursor.property.value === 'string') {
      parts.unshift(cursor.property.value);
    } else {
      return null;
    }
    cursor = cursor.object;
  }
  if (cursor?.type !== 'Identifier') return null;
  parts.unshift(cursor.name);
  return parts.join('.');
}

function namedOwner(node, parent, currentOwner) {
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
    return node.id?.name || currentOwner;
  }
  if (node.type === 'FunctionExpression' && node.id?.name) return node.id.name;
  if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
    && parent?.type === 'VariableDeclarator' && parent.id?.type === 'Identifier') {
    return parent.id.name;
  }
  if (node.type === 'CallExpression' && currentOwner === '(module)'
    && parent?.type === 'VariableDeclarator' && parent.id?.type === 'Identifier') {
    return parent.id.name;
  }
  return currentOwner;
}

function walkJavaScript(node, visitor, owner = '(module)', parent = null) {
  if (!node || typeof node !== 'object') return;
  const nextOwner = namedOwner(node, parent, owner);
  visitor(node, nextOwner, parent, owner);
  for (const [key, child] of Object.entries(node)) {
    if (['loc', 'range', 'start', 'end', 'parent'].includes(key)) continue;
    if (Array.isArray(child)) {
      for (const entry of child) {
        if (entry?.type) walkJavaScript(entry, visitor, nextOwner, node);
      }
    } else if (child?.type) {
      walkJavaScript(child, visitor, nextOwner, node);
    }
  }
}

function emptyAnalysis(parseError = null) {
  return {
    artwork: [],
    readers: [],
    steps: [],
    motions: [],
    ambiguousOwners: [],
    parseError,
  };
}

function declarationKey(owner, name) {
  return `${owner}\u0000${name}`;
}

function declarationFor(declarations, owner, name, ownerParents) {
  const visited = new Set();
  let cursor = owner;
  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    const declaration = declarations.get(declarationKey(cursor, name));
    if (declaration) return { declaration, owner: cursor };
    cursor = ownerParents.get(cursor);
  }
  const declaration = declarations.get(declarationKey('(module)', name));
  return declaration ? { declaration, owner: '(module)' } : null;
}

function resolveReference(node, owner, declarations, ownerParents, seen = new Set()) {
  if (!node) return null;
  if (node.type === 'ChainExpression') {
    return resolveReference(node.expression, owner, declarations, ownerParents, seen);
  }
  if (node.type === 'CallExpression'
    && /^(?:Object\.(?:freeze|seal))$/.test(memberPath(node.callee) || '')
    && node.arguments.length === 1) {
    return resolveReference(node.arguments[0], owner, declarations, ownerParents, seen)
      || node.arguments[0];
  }
  if (node.type === 'Identifier') {
    const resolved = declarationFor(declarations, owner, node.name, ownerParents);
    if (!resolved) return null;
    const resolvedKey = declarationKey(resolved.owner, node.name);
    if (seen.has(resolvedKey)) return null;
    seen.add(resolvedKey);
    return resolveReference(
      resolved.declaration,
      resolved.owner,
      declarations,
      ownerParents,
      seen,
    ) || resolved.declaration;
  }
  if (node.type !== 'MemberExpression') return node;

  const path = memberPath(node)?.split('.');
  if (!path?.length) return null;
  let cursor = resolveReference(
    { type: 'Identifier', name: path[0] },
    owner,
    declarations,
    ownerParents,
    seen,
  );
  for (const name of path.slice(1)) {
    cursor = resolveReference(cursor, owner, declarations, ownerParents, seen) || cursor;
    if (cursor?.type !== 'ObjectExpression') return null;
    let next = null;
    for (const entry of cursor.properties) {
      if (entry.type === 'Property' && propertyName(entry) === name) {
        next = entry.value;
        break;
      }
      if (entry.type === 'SpreadElement') {
        const spread = resolveReference(
          entry.argument,
          owner,
          declarations,
          ownerParents,
          new Set(seen),
        );
        if (spread?.type === 'ObjectExpression') {
          const match = spread.properties.find(
            (property) => property.type === 'Property' && propertyName(property) === name,
          );
          if (match) next = match.value;
        }
      }
    }
    if (!next) return null;
    cursor = next;
  }
  return resolveReference(cursor, owner, declarations, ownerParents, seen) || cursor;
}

function collectRootStyleProperties(
  node,
  owner,
  declarations,
  ownerParents,
  seen = new Set(),
) {
  if (!node) return [];
  const resolved = resolveReference(
    node,
    owner,
    declarations,
    ownerParents,
    new Set(seen),
  ) || node;
  if (seen.has(resolved)) return [];
  seen.add(resolved);
  if (resolved.type === 'ConditionalExpression') {
    return [
      ...collectRootStyleProperties(
        resolved.consequent,
        owner,
        declarations,
        ownerParents,
        new Set(seen),
      ),
      ...collectRootStyleProperties(
        resolved.alternate,
        owner,
        declarations,
        ownerParents,
        new Set(seen),
      ),
    ];
  }
  if (resolved.type === 'LogicalExpression') {
    return collectRootStyleProperties(
      resolved.right,
      owner,
      declarations,
      ownerParents,
      seen,
    );
  }
  if (resolved.type !== 'ObjectExpression') return [];
  const properties = [];
  for (const entry of resolved.properties) {
    if (entry.type === 'Property') properties.push(entry);
    if (entry.type === 'SpreadElement') {
      properties.push(...collectRootStyleProperties(
        entry.argument,
        owner,
        declarations,
        ownerParents,
        new Set(seen),
      ));
    }
  }
  return properties;
}

function isApprovedStepExpression(node) {
  if (!node) return false;
  if (node.type === 'ChainExpression') return isApprovedStepExpression(node.expression);
  if (node.type === 'MemberExpression') {
    return /^PARCHMENT_STEPS\.(?:page|card|nested)$/.test(memberPath(node) || '');
  }
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return EXACT_STEP_REF.test(node.value.trim());
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return EXACT_STEP_REF.test(node.quasis[0]?.value?.cooked?.trim() || '');
  }
  if (node.type === 'ConditionalExpression') {
    return isApprovedStepExpression(node.consequent)
      && isApprovedStepExpression(node.alternate);
  }
  return false;
}

function isStaticMotionNode(node) {
  if (node?.type === 'Literal' && node.value === 0) return true;
  let value = null;
  if (node?.type === 'Literal' && typeof node.value === 'string') value = node.value;
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0) {
    value = node.quasis[0]?.value?.cooked;
  }
  return /^(?:none|0|0ms|0s)$/i.test(String(value || '').trim());
}

function motionMember(node) {
  if (node?.type === 'ChainExpression') return motionMember(node.expression);
  const match = /^MOTION\.(none|settle|reveal|scrub)\.(durationMs|easing|iterations|translateYPx)$/
    .exec(memberPath(node) || '');
  if (!match || !MOTION_AVAILABLE_FIELDS[match[1]].includes(match[2])) return null;
  return { kind: match[1], field: match[2] };
}

function motionFieldsFor(property) {
  const normalized = String(property || '').replace(/-([a-z])/g, (_, letter) => (
    letter.toUpperCase()
  ));
  if (/Duration$|Delay$/.test(normalized)) return new Set(['durationMs']);
  if (/TimingFunction$/.test(normalized)) return new Set(['easing']);
  if (/IterationCount$/.test(normalized)) return new Set(['iterations']);
  if (normalized === 'animation' || normalized === 'transition') {
    return new Set(['durationMs', 'easing', 'iterations']);
  }
  return new Set();
}

function unsafeMotionRemainder(value) {
  const text = String(value).replace(/\s*!important\s*$/i, '');
  return /var\s*\(/i.test(text)
    || RAW_MOTION_VALUE.test(text)
    || /\b(?:calc|min|max|clamp|steps)\s*\(/i.test(text)
    || /(?:^|[^\w-])-?\d*\.?\d+(?=$|[^\w-])/.test(text);
}

function validateMotionLiteral(value, property) {
  const kinds = new Set();
  const allowedFields = motionFieldsFor(property);
  let approvedCount = 0;
  const remainder = String(value).replace(CSS_VARIABLE_REFERENCE, (reference, variable) => {
    const token = CSS_MOTION_VARIABLE[variable];
    if (!token || !allowedFields.has(token.field)) return reference;
    kinds.add(token.kind);
    approvedCount += 1;
    return '';
  });
  return {
    valid: approvedCount > 0
      && kinds.size === 1
      && !unsafeMotionRemainder(remainder),
    kinds,
  };
}

function validateMotionExpression(node, property) {
  if (!node) return { valid: false, kinds: new Set() };
  if (node.type === 'ChainExpression') return validateMotionExpression(node.expression, property);
  const member = motionMember(node);
  if (member) {
    return {
      valid: motionFieldsFor(property).has(member.field),
      kinds: new Set([member.kind]),
    };
  }
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return validateMotionLiteral(node.value, property);
  }
  if (node.type === 'TemplateLiteral') {
    if (node.expressions.length === 0) {
      return validateMotionLiteral(node.quasis[0]?.value?.cooked || '', property);
    }
    const parts = node.expressions.map((expression) => (
      validateMotionExpression(expression, property)
    ));
    const literalText = node.quasis.map((quasi) => quasi.value?.cooked || '').join(' ');
    const kinds = new Set(parts.flatMap((part) => [...part.kinds]));
    return {
      valid: parts.every((part) => part.valid)
        && kinds.size === 1
        && !unsafeMotionRemainder(literalText),
      kinds,
    };
  }
  if (node.type === 'ConditionalExpression') {
    const consequent = validateMotionExpression(node.consequent, property);
    const alternate = validateMotionExpression(node.alternate, property);
    const kinds = new Set([...consequent.kinds, ...alternate.kinds]);
    return {
      valid: consequent.valid && alternate.valid && kinds.size === 1,
      kinds,
    };
  }
  return { valid: false, kinds: new Set() };
}

function jsxAttribute(node, name) {
  return node.attributes?.find(
    (attribute) => attribute.type === 'JSXAttribute' && attribute.name?.name === name,
  ) || null;
}

function jsxStyleExpression(node) {
  const attribute = jsxAttribute(node, 'style');
  return attribute?.value?.type === 'JSXExpressionContainer'
    ? attribute.value.expression
    : null;
}

function isReaderClassName(name) {
  return !String(name).includes('__')
    && !String(name).includes('--')
    && READER_CLASS_WORD.test(name)
    && !NON_SURFACE_CLASS_WORD.test(name);
}

function isReaderOpening(node, source) {
  const tag = jsxName(node.name);
  const classAttribute = jsxAttribute(node, 'className');
  const classText = classAttribute
    ? source.text.slice(classAttribute.range[0], classAttribute.range[1])
    : '';
  return tag === 'Card'
    || tag === 'article'
    || (['aside', 'div', 'li', 'section'].includes(tag)
      && (classText.match(/[a-z][\w-]*/gi) || []).some(isReaderClassName));
}

function terminalSelectorCompound(selector) {
  let bracketDepth = 0;
  let parenDepth = 0;
  for (let index = selector.length - 1; index >= 0; index--) {
    const character = selector[index];
    if (character === ']') bracketDepth += 1;
    else if (character === '[') bracketDepth -= 1;
    else if (character === ')') parenDepth += 1;
    else if (character === '(') parenDepth -= 1;
    else if (bracketDepth === 0 && parenDepth === 0
      && (/[>+~]/.test(character) || /\s/.test(character))) {
      return selector.slice(index + 1).trim();
    }
  }
  return selector.trim();
}

function cardLikeCssOwners(selector) {
  const owners = [];
  for (const branch of String(selector).split(',')) {
    const terminal = terminalSelectorCompound(branch);
    const control = /^(?:a|button|input|label|option|select|textarea)(?=\.|#|\[|:|$)/i
      .test(terminal)
      || /\[role\s*=\s*['"]?button['"]?\]/i.test(terminal);
    if (control) continue;
    for (const match of terminal.matchAll(/([.#])([a-z_][\w-]*)/gi)) {
      if (isReaderClassName(match[2])) owners.push(`${match[1]}${match[2]}`);
    }
  }
  return uniqueSorted(owners);
}

function valueSource(source, node) {
  return node?.range ? source.text.slice(node.range[0], node.range[1]) : '';
}

function cssTextFromExpression(node, owner, declarations, ownerParents) {
  const resolved = resolveReference(
    node,
    owner,
    declarations,
    ownerParents,
    new Set(),
  ) || node;
  if (resolved?.type === 'Literal' && typeof resolved.value === 'string') {
    return { text: resolved.value, line: resolved.loc?.start?.line || 1 };
  }
  if (resolved?.type !== 'TemplateLiteral') return null;
  let text = '';
  for (let index = 0; index < resolved.quasis.length; index++) {
    text += resolved.quasis[index].value?.cooked || '';
    if (index < resolved.expressions.length) text += 'currentColor';
  }
  return { text, line: resolved.loc?.start?.line || 1 };
}

function mergeEmbeddedCss(result, cssAnalysis, owner, lineOffset) {
  if (cssAnalysis.parseError && !result.parseError) {
    result.parseError = `embedded <style>: ${cssAnalysis.parseError}`;
  }
  for (const category of ['artwork', 'readers', 'steps', 'motions']) {
    for (const candidate of cssAnalysis[category]) {
      result[category].push({
        ...candidate,
        owner,
        line: Math.max(1, lineOffset + Number(candidate.line || 1) - 1),
      });
    }
  }
}

function analyzeJavaScript(source) {
  let ast;
  try {
    ast = parse(source.text, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      loc: true,
      range: true,
      ecmaFeatures: { jsx: true },
    });
  } catch (error) {
    return emptyAnalysis(error instanceof Error ? error.message : String(error));
  }

  const result = emptyAnalysis();
  const declarations = new Map();
  const ownerParents = new Map();
  const ownerDefinitionCounts = new Map();
  const moduleDeclarations = [];
  walkJavaScript(ast, (node, owner, parent, parentOwner) => {
    if (owner !== parentOwner) {
      ownerDefinitionCounts.set(owner, (ownerDefinitionCounts.get(owner) || 0) + 1);
      if (!ownerParents.has(owner)) ownerParents.set(owner, parentOwner);
    }
    if (node.type !== 'VariableDeclarator' || node.id?.type !== 'Identifier' || !node.init) return;
    if (parent?.type === 'VariableDeclaration' && parent.kind === 'const') {
      declarations.set(declarationKey(owner, node.id.name), node.init);
      if (owner === '(module)') {
        moduleDeclarations.push({ name: node.id.name, node: node.init });
      }
    }
    if (ART_REGISTRY_NAME.test(node.id.name)) {
      result.artwork.push({ owner: node.id.name, line: node.loc.start.line });
    }
  });
  result.ambiguousOwners = [...ownerDefinitionCounts]
    .filter(([, count]) => count > 1)
    .map(([owner]) => owner)
    .sort(compareText);

  if (/\.(?:c|m)?js$/.test(source.path)) {
    for (const declaration of moduleDeclarations) {
      const properties = collectRootStyleProperties(
        declaration.node,
        '(module)',
        declarations,
        ownerParents,
      );
      for (const property of properties) {
        const name = propertyName(property);
        if (!name || !property.value || !JS_MOTION_PROPERTIES.has(name)
          || isStaticMotionNode(property.value)) continue;
        const validation = validateMotionExpression(property.value, name);
        result.motions.push({
          owner: declaration.name,
          line: property.loc.start.line,
          property: name,
          invalid: !validation.valid,
          kinds: [...validation.kinds].sort(compareText),
        });
      }
      if (!/CSS$/.test(declaration.name)) continue;
      const css = cssTextFromExpression(
        declaration.node,
        '(module)',
        declarations,
        ownerParents,
      );
      if (!css) continue;
      mergeEmbeddedCss(
        result,
        analyzeCss({ path: source.path, text: css.text }),
        declaration.name,
        css.line,
      );
    }
  }

  walkJavaScript(ast, (node, owner) => {
    if (node.type === 'JSXElement'
      && jsxName(node.openingElement?.name) === 'style') {
      for (const child of node.children || []) {
        let css = null;
        if (child.type === 'JSXText' && child.value.trim()) {
          css = { text: child.value, line: child.loc?.start?.line || 1 };
        } else if (child.type === 'JSXExpressionContainer') {
          css = cssTextFromExpression(
            child.expression,
            owner,
            declarations,
            ownerParents,
          );
        }
        if (!css) continue;
        mergeEmbeddedCss(
          result,
          analyzeCss({ path: source.path, text: css.text }),
          owner,
          css.line,
        );
      }
      return;
    }
    if (node.type !== 'JSXOpeningElement') return;
    const tag = jsxName(node.name);
    if (['img', 'picture', 'video'].includes(tag)) {
      result.artwork.push({ owner, line: node.loc.start.line });
    }

    const styleExpression = jsxStyleExpression(node);
    const properties = collectRootStyleProperties(
      styleExpression,
      owner,
      declarations,
      ownerParents,
    );
    const reader = isReaderOpening(node, source);
    if (reader) result.readers.push({ owner, line: node.loc.start.line });
    for (const property of properties) {
      const name = propertyName(property);
      if (!name || !property.value) continue;
      const rawValue = valueSource(source, property.value);
      const artworkValue = /\burl\s*\(|\.(?:avif|gif|jpe?g|png|svg|webp)\b/i.test(rawValue);
      if ((name === 'backgroundImage' && !/^['"]?none['"]?$/.test(rawValue.trim()))
        || ART_CUSTOM_PROPERTY.test(name)
        || (JS_STEP_PROPERTY.has(name) && artworkValue)) {
        result.artwork.push({ owner, line: property.loc.start.line });
      }
      if (reader && JS_STEP_PROPERTY.has(name) && !isApprovedStepExpression(property.value)) {
        result.steps.push({
          owner,
          line: property.loc.start.line,
          property: name,
          value: rawValue,
        });
      }
      if (JS_MOTION_PROPERTIES.has(name) && !isStaticMotionNode(property.value)) {
        const validation = validateMotionExpression(property.value, name);
        result.motions.push({
          owner,
          line: property.loc.start.line,
          property: name,
          invalid: !validation.valid,
          kinds: [...validation.kinds].sort(compareText),
        });
      }
    }
  });
  return result;
}

function insideIgnoredCssAtRule(node) {
  let cursor = node.parent;
  while (cursor) {
    if (cursor.type === 'atrule') {
      if (/keyframes$/i.test(cursor.name)) return true;
      if (cursor.name?.toLowerCase() === 'media'
        && /prefers-reduced-motion\s*:\s*reduce/i.test(cursor.params || '')) return true;
    }
    cursor = cursor.parent;
  }
  return false;
}

function analyzeCss(source) {
  const result = emptyAnalysis();
  let root;
  try {
    root = postcss.parse(source.text, { from: source.path });
  } catch (error) {
    return emptyAnalysis(error instanceof Error ? error.message : String(error));
  }
  root.walkRules((rule) => {
    if (insideIgnoredCssAtRule(rule)) return;
    const selector = rule.selector?.trim();
    if (!selector) return;
    const readerOwners = cardLikeCssOwners(selector);
    let readerRecorded = false;
    rule.walkDecls((declaration) => {
      if (insideIgnoredCssAtRule(declaration)) return;
      const name = declaration.prop;
      const value = declaration.value.trim();
      const line = declaration.source?.start?.line || rule.source?.start?.line || 0;
      const artworkValue = /\burl\s*\(|\.(?:avif|gif|jpe?g|png|svg|webp)\b/i.test(value);
      if ((name === 'background-image' && value.toLowerCase() !== 'none')
        || ART_CUSTOM_PROPERTY.test(name)
        || (/^background(?:-color)?$/i.test(name) && artworkValue)) {
        result.artwork.push({ owner: selector, line });
      }
      if (readerOwners.length && /^background(?:-(?:color|image))?$/i.test(name)
        && !readerRecorded) {
        for (const owner of readerOwners) {
          result.readers.push({ owner, line: rule.source?.start?.line || line });
        }
        readerRecorded = true;
      }
      if (readerOwners.length && /^background(?:-color)?$/i.test(name)
        && !EXACT_STEP_REF.test(value.replace(/\s*!important\s*$/i, '').trim())) {
        for (const owner of readerOwners) {
          result.steps.push({ owner, line, property: name, value });
        }
      }
      if (!CSS_MOTION_PROPERTY.test(name)) return;
      if (/^(?:none|0|0ms|0s)$/i.test(value.replace(/\s*!important\s*$/i, '').trim())) return;
      const validation = validateMotionLiteral(value, name);
      result.motions.push({
        owner: selector,
        line,
        property: name,
        invalid: !validation.valid,
        kinds: [...validation.kinds].sort(compareText),
      });
    });
  });
  return result;
}

function analyzeSource(source) {
  if (DECLARATION_SOURCE.test(source.path)) return emptyAnalysis();
  if (/\.s?css$/.test(source.path)) return analyzeCss(source);
  if (/\.(?:[cm]?ts|tsx)$/.test(source.path)) {
    return emptyAnalysis('TypeScript/TSX requires an explicit parser before it can be audited.');
  }
  return analyzeJavaScript(source);
}

/** Census the source tree without assigning pass/fail semantics. */
export function scanBoundBookSources({
  root = DEFAULT_ROOT,
  config,
  sourceFiles = null,
  normalized = null,
} = {}) {
  const validated = normalized || validateBoundBookConfig(config, { root, sourceFiles });
  const sources = validated.sources;
  const artworkRegistrations = registrationIndex(validated.artwork, root);
  const readerRegistrations = registrationIndex(validated.readers, root);
  const motionRegistrations = motionRegistrationIndex([
    ...validated.artwork,
    ...validated.readers,
  ], root);

  const findings = Object.fromEntries(FINDING_CATEGORIES.map((name) => [name, []]));
  const seen = new Set();

  for (const row of [...validated.artwork, ...validated.readers]) {
    const expectedStatic = config?.MOTION?.[row?.motion]?.staticComposition;
    if (row?.motion && typeof expectedStatic === 'string'
      && row.staticComposition !== expectedStatic) {
      addFinding(
        findings,
        seen,
        'missingStaticComposition',
        relativePath(root, row.ownerPath || '(manifest)'),
        0,
        `manifest ${row.id || '(unnamed)'} staticComposition must equal "${expectedStatic}" for ${row.motion}`,
      );
    }
  }

  for (const source of sources) {
    if (TOKEN_SOURCE.test(source.path)) continue;
    const analysis = validated.analyses?.get(source.path) || analyzeSource(source);
    const reportedArtworkOwners = new Set();
    for (const candidate of analysis.artwork) {
      if (registrationCovers(artworkRegistrations, source.path, candidate.owner)
        || reportedArtworkOwners.has(candidate.owner)) continue;
      reportedArtworkOwners.add(candidate.owner);
      addFinding(
        findings,
        seen,
        'unregisteredArtwork',
        source.path,
        candidate.line,
        `artwork owner ${candidate.owner} has no seam manifest entry`,
      );
    }

    const reportedReaderOwners = new Set();
    for (const candidate of analysis.readers) {
      if (registrationCovers(readerRegistrations, source.path, candidate.owner)
        || reportedReaderOwners.has(candidate.owner)) continue;
      reportedReaderOwners.add(candidate.owner);
      addFinding(
        findings,
        seen,
        'unregisteredReaderSurface',
        source.path,
        candidate.line,
        `reader owner ${candidate.owner} has no register manifest entry`,
      );
    }

    for (const candidate of analysis.steps) {
      addFinding(
        findings,
        seen,
        'legacyParchmentBackground',
        source.path,
        candidate.line,
        `${candidate.property} must source from PARCHMENT_STEPS or --parchment-step-*`,
      );
    }

    const firstMotionByOwner = new Map();
    for (const candidate of analysis.motions) {
      if (!firstMotionByOwner.has(candidate.owner)) {
        firstMotionByOwner.set(candidate.owner, candidate.line);
      }
      if (candidate.invalid) {
        addFinding(
          findings,
          seen,
          'rawMotionValue',
          source.path,
          candidate.line,
          `${candidate.property} must use uppercase MOTION or an approved motion CSS variable with no raw timing`,
        );
      }
      const declared = registeredMotion(motionRegistrations, source.path, candidate.owner);
      if (!candidate.invalid && declared
        && (candidate.kinds?.length !== 1 || candidate.kinds[0] !== declared)) {
        addFinding(
          findings,
          seen,
          'rawMotionValue',
          source.path,
          candidate.line,
          `${candidate.property} uses ${candidate.kinds?.join(', ') || 'no motion kind'} but ${candidate.owner} declares ${declared}`,
        );
      }
    }
    for (const [owner, line] of firstMotionByOwner) {
      if (registeredMotion(motionRegistrations, source.path, owner)) continue;
      addFinding(
        findings,
        seen,
        'undeclaredAnimation',
        source.path,
        line,
        `animated owner ${owner} has no motion manifest entry`,
      );
    }
  }

  for (const category of FINDING_CATEGORIES) findings[category].sort(compareFinding);
  return findings;
}

function normalizeEnforcement(enforce) {
  const values = Array.isArray(enforce) ? enforce : (enforce ? [enforce] : []);
  return uniqueSorted(values.flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean));
}

/**
 * Run one audit and calculate its process result. Debt exits 0 in report mode;
 * malformed configuration exits 1 regardless of mode.
 */
export function auditBoundBook({
  root = DEFAULT_ROOT,
  config,
  sourceFiles = null,
  enforce = [],
  initialConfigErrors = [],
} = {}) {
  const enforcedScopes = normalizeEnforcement(enforce);
  const invalidScopes = enforcedScopes.filter((scope) => !(scope in ENFORCEMENT_SCOPES));
  const validated = validateBoundBookConfig(config, { root, sourceFiles });
  const configErrors = [
    ...initialConfigErrors,
    ...invalidScopes.map((scope) => ({
      code: 'unknown-enforcement-scope',
      path: '--enforce',
      message: `Unknown enforcement scope "${scope}". Expected seams, steps, or motion.`,
    })),
    ...validated.errors,
  ].sort(compareConfigError);
  const findings = scanBoundBookSources({ root, config, sourceFiles, normalized: validated });
  const enforcedCategories = new Set(enforcedScopes.flatMap(
    (scope) => ENFORCEMENT_SCOPES[scope] || [],
  ));
  const enforcedDebt = [...enforcedCategories].reduce(
    (total, category) => total + findings[category].length,
    0,
  );

  return {
    mode: enforcedScopes.length ? 'enforce' : 'report',
    enforcedScopes,
    configErrors,
    findings,
    totals: {
      configErrors: configErrors.length,
      debt: FINDING_CATEGORIES.reduce(
        (total, category) => total + findings[category].length,
        0,
      ),
      enforcedDebt,
    },
    exitCode: configErrors.length || enforcedDebt ? 1 : 0,
  };
}

/** Stable human-readable output; category and finding ordering never depends on FS order. */
export function formatBoundBookReport(report) {
  const scope = report.enforcedScopes.length
    ? report.enforcedScopes.join(',')
    : 'none';
  const lines = [
    'Bound Book audit',
    `mode: ${report.mode}`,
    `enforce: ${scope}`,
    `configErrors: ${report.totals.configErrors}`,
  ];
  for (const error of report.configErrors) {
    lines.push(`  ! ${error.code} ${error.path}: ${error.message}`);
  }
  for (const category of FINDING_CATEGORIES) {
    const entries = report.findings[category];
    lines.push(`${category}: ${entries.length}`);
    for (const entry of entries) {
      const location = entry.line ? `${entry.path}:${entry.line}` : entry.path;
      lines.push(`  - ${location}: ${entry.detail}`);
    }
  }
  lines.push(`debt: ${report.totals.debt}`);
  lines.push(`enforcedDebt: ${report.totals.enforcedDebt}`);
  lines.push(`exitCode: ${report.exitCode}`);
  return `${lines.join('\n')}\n`;
}

/** Parse CLI switches without consulting process globals. */
export function parseBoundBookArgs(argv) {
  const options = { root: DEFAULT_ROOT, enforce: [], json: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--json') {
      options.json = true;
    } else if (arg === '--root') {
      options.root = resolve(argv[++index] || '');
    } else if (arg.startsWith('--root=')) {
      options.root = resolve(arg.slice('--root='.length));
    } else if (arg === '--enforce') {
      options.enforce.push(...String(argv[++index] || '').split(','));
    } else if (arg.startsWith('--enforce=')) {
      options.enforce.push(...arg.slice('--enforce='.length).split(','));
    } else {
      throw new Error(`Unknown argument "${arg}".`);
    }
  }
  options.enforce = normalizeEnforcement(options.enforce);
  return options;
}

export function collectSourceFiles(root = DEFAULT_ROOT) {
  const sourceRoot = resolve(root, 'src');
  if (!existsSync(sourceRoot)) return [];
  const absolutePaths = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && SOURCE_EXTENSION.test(entry.name)
        && !DECLARATION_SOURCE.test(entry.name)) absolutePaths.push(absolute);
    }
  };
  walk(sourceRoot);
  return absolutePaths.sort(compareText).map((absolute) => ({
    path: relativePath(root, absolute),
    text: readFileSync(absolute, 'utf8'),
  }));
}

export function normalizeSourceFiles(sourceFiles, root = DEFAULT_ROOT) {
  return sourceFiles.map((source) => {
    if (typeof source === 'string') {
      const absolute = isAbsolute(source) ? source : resolve(root, source);
      return { path: relativePath(root, absolute), text: readFileSync(absolute, 'utf8') };
    }
    return {
      path: relativePath(root, source.path),
      text: String(source.text ?? ''),
    };
  }).sort((left, right) => compareText(left.path, right.path));
}

export async function loadBoundBookConfig(root = DEFAULT_ROOT) {
  const config = {};
  const configErrors = [];
  for (const relativeModule of ['src/design/tokens.js', 'src/design/boundBook.js']) {
    const absolute = resolve(root, relativeModule);
    try {
      Object.assign(config, await import(pathToFileURL(absolute).href));
    } catch (error) {
      configErrors.push({
        code: 'config-load-failed',
        path: relativeModule,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { config, configErrors: configErrors.sort(compareConfigError) };
}

export async function runBoundBookCli(argv = process.argv.slice(2), {
  write = (value) => process.stdout.write(value),
} = {}) {
  let options;
  try {
    options = parseBoundBookArgs(argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    write(`Bound Book audit\nconfig error: ${message}\nexitCode: 1\n`);
    return 1;
  }
  const loaded = await loadBoundBookConfig(options.root);
  const report = auditBoundBook({
    root: options.root,
    config: loaded.config,
    enforce: options.enforce,
    initialConfigErrors: loaded.configErrors,
  });
  write(options.json ? `${JSON.stringify(report, null, 2)}\n` : formatBoundBookReport(report));
  return report.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === SCRIPT_PATH) {
  process.exitCode = await runBoundBookCli();
}
