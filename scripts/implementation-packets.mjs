/**
 * implementation-packets.mjs — IA-1's packet validator and coding-capsule tool.
 *
 * The JSON manifest is an instruction index, never proof that implementation
 * exists. Validation therefore closes the joins back to the human packet, the
 * implementation index, and the live source symbols before a READY packet can
 * produce a capsule — and, once a packet is LANDED, back to the very files its
 * CREATE rows claim to have produced.
 */

import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { dirname, posix, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKET_MANIFEST_SCHEMA_VERSION = 1;
export const PACKET_STATUSES = Object.freeze([
  'BLOCKED',
  'DRAFT',
  'LANDED',
  'READY',
  'STALE',
  'SUPERSEDED',
]);

export const PACKET_ACTIONS = Object.freeze([
  'CREATE',
  'DOC',
  'MODIFY',
  'REGISTER',
  'TEST',
]);

export const PACKET_AUTHORITY_NOTICE = 'Only this READY implementation packet defines coding authority. '
  + 'Design files, queues, progress notes, commit subjects, and briefs cannot expand that authority.';

const STATUS_SET = new Set(PACKET_STATUSES);
const ACTION_SET = new Set(PACKET_ACTIONS);
const TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED']);
const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MANIFEST_PATH = 'docs/implementation/PACKET_MANIFEST.json';
/**
 * A ROW-CARRYING coupling-registry volume leaf: `couplingRegistryWar.js` and its four
 * siblings, each exporting a `*_COUPLINGS` aggregate the head spreads into
 * COUPLING_REGISTRY. The lookahead excludes the head itself.
 */
const COUPLING_LEAF_RE = /^src\/domain\/certification\/couplingRegistry(?!\.js$)[A-Za-z0-9]+\.js$/;
/**
 * ⛔ EXCLUDED ON AN EXECUTED READING, not on its name: couplingRegistrySchema.js exports
 * only COUPLING_REGISTRY_SCHEMA_VERSION and the couplingRow() factory — no `*_COUPLINGS`
 * aggregate at all — so it declares the row SHAPE and mints no row.
 */
const COUPLING_SCHEMA_LEAF = 'src/domain/certification/couplingRegistrySchema.js';
/** The composing head: import + COUPLING_REGISTRY spread + named re-export. */
const COUPLING_HEAD = 'src/domain/certification/couplingRegistry.js';
/** The exact-list pin AND the per-volume registry test — both live in this one file. */
const COUPLING_PIN = 'tests/domain/couplingRegistry.test.js';

/**
 * ⛔ SHRINK-ONLY. Packets that minted a coupling row BEFORE this check existed and named
 * only the volume leaf. Every one of the five recorded instances failed the same way: the
 * manifest named the leaf and stopped, the head did not re-export the row, the row imported
 * as `undefined`, and the exact-list pin reddened AFTER the edit rather than being read
 * before it. These four are exactly the four GR-4C.md:205 names.
 *
 * Their manifests are historical records of what each packet TOLD its implementer, and each
 * implementer's departure is separately recorded in FABLE_VALIDATION_QUEUE.md, so they are
 * NOT retro-edited — rewriting them would erase the only evidence the gap ever existed, in
 * the same act that claims to prevent it.
 *
 * A row leaves this list only when its packet's manifest genuinely names both companions,
 * and the honesty arm in tests/scripts/implementationPackets.test.js reds until the row is
 * deleted, so a silent shrink is not available either. ⛔ An id may NEVER be added here to
 * make a packet pass; adding is the one motion that arm exists to forbid.
 */
const COUPLING_REGISTRATION_LEGACY = Object.freeze(['ES-5B', 'ES-5C', 'ES-5D', 'ES-6A']);

const SHA_40 = /^[0-9a-f]{40}$/;
const SHA_256 = /^[0-9a-f]{64}$/;
const ID_TOKEN = /^[A-Za-z0-9][A-Za-z0-9+._-]*$/;
const BRANCH_TOKEN = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;
const GLOB_OR_NUL = /[\0*?[\]{}!]/;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {string} left @param {string} right */
function compareCodepoint(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Return null for one canonical repository-relative path, otherwise the reason
 * it is unsafe. Globs are forbidden because a packet must name a closed set.
 *
 * @param {unknown} value
 * @returns {string|null}
 */
export function packetPathProblem(value) {
  if (typeof value !== 'string' || value.length === 0) return 'must be a non-empty string';
  if (GLOB_OR_NUL.test(value)) return 'must not contain glob or NUL characters';
  if (value.includes('\\')) return 'must use forward slashes';
  if (value.startsWith('/') || /^[A-Za-z]:/.test(value)) return 'must be repository-relative';
  const pieces = value.split('/');
  if (pieces.some((piece) => piece === '' || piece === '.' || piece === '..')) {
    return 'must not contain empty, dot, or parent segments';
  }
  if (posix.normalize(value) !== value) return 'must already be normalized';
  return null;
}

/**
 * The coupling-registration template gap, measured off one packet's change paths.
 *
 * A packet that mints a coupling row must name THREE files, and five waves running named
 * only the first: the volume leaf, the composing head (couplingRegistry.js is an explicit
 * enumeration of named aggregates, not a dynamic composition, so an un-re-exported row
 * imports as `undefined`), and the registry test that holds the exact-list pin. GR-4C is
 * why the pin FILE is required rather than merely the head: it named head and pin from the
 * start and still missed a SECOND exact-list pin inside that same file, so requiring the
 * file is what puts a reader in front of every pin it contains.
 *
 * @param {string[]} changePaths every path in one packet's changeManifest
 * @returns {{ leaves:string[], missing:string[] }} empty leaves means the packet is untriggered
 */
export function couplingRegistrationGaps(changePaths) {
  const leaves = changePaths
    .filter((path) => COUPLING_LEAF_RE.test(path) && path !== COUPLING_SCHEMA_LEAF);
  if (leaves.length === 0) return { leaves, missing: [] };
  return {
    leaves,
    missing: [COUPLING_HEAD, COUPLING_PIN].filter((path) => !changePaths.includes(path)),
  };
}

/** @param {unknown} id @returns {boolean} */
export function isCouplingRegistrationLegacy(id) {
  return COUPLING_REGISTRATION_LEGACY.includes(String(id).toUpperCase());
}

/** The frozen legacy inventory itself, so its honesty arm can audit it in both directions. */
export const couplingRegistrationLegacyIds = () => [...COUPLING_REGISTRATION_LEGACY];

/**
 * Parse the packet-header facts that identify its authority and verified base.
 *
 * @param {string} markdown
 * @returns {{heading:string|null,status:string|null,verifiedBase:string|null,verifiedBranch:string|null}}
 */
export function parsePacketHeader(markdown) {
  const preamble = markdown.split(/^##\s/m, 1)[0];
  const heading = preamble.match(/^#\s+(.+?)\s*$/m)?.[1] ?? null;
  const statusRows = [...preamble.matchAll(
    /^\s*(?:-\s*)?\*\*Status:\*\*\s*`?([A-Za-z]+)`?\s*$/gmi,
  )];
  const status = statusRows.length === 1 ? statusRows[0][1].toUpperCase() : null;
  const baseRows = [...preamble.matchAll(
    /^\s*(?:-\s*)?\*\*Verified base:\*\*([^\n]*)$/gmi,
  )];
  const baseValue = baseRows.length === 1 ? baseRows[0][1].trim() : '';
  const branchMatch = baseValue.match(
    /^`?([A-Za-z0-9][A-Za-z0-9._/-]*)`?\s+at\s+`?([0-9a-f]{40})`?$/i,
  );
  const bareMatch = baseValue.match(/^`?([0-9a-f]{40})`?$/i);
  const verifiedBase = (branchMatch?.[2] ?? bareMatch?.[1] ?? '').toLowerCase() || null;
  const verifiedBranch = branchMatch?.[1] && BRANCH_TOKEN.test(branchMatch[1])
    ? branchMatch[1] : null;
  return { heading, status, verifiedBase, verifiedBranch };
}

/**
 * Read packet status from the table cell immediately after its Markdown link.
 * Matching by resolved packet path avoids display-label drift such as SC-1A+B.
 *
 * @param {string} markdown
 * @param {string} indexPath repository-relative index path
 * @returns {{ statuses:Map<string,string>, duplicates:string[] }}
 */
export function parseIndexPacketStatuses(markdown, indexPath) {
  /** @type {Map<string,string>} */
  const statuses = new Map();
  /** @type {string[]} */
  const duplicates = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trimStart().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    for (let index = 0; index < cells.length - 1; index += 1) {
      const target = cells[index].match(/\[[^\]]+\]\(([^)]+)\)/)?.[1];
      if (!target) continue;
      const status = PACKET_STATUSES.find((candidate) => (
        new RegExp(`(?:^|[^A-Z])${candidate}(?:$|[^A-Z])`).test(cells[index + 1].toUpperCase())
      ));
      if (!status) continue;
      const cleanTarget = target.replace(/^<|>$/g, '').split(/[?#]/, 1)[0];
      if (!cleanTarget || /^(?:[a-z]+:|\/)/i.test(cleanTarget)) continue;
      const resolvedPath = posix.normalize(posix.join(posix.dirname(indexPath), cleanTarget));
      if (statuses.has(resolvedPath)) duplicates.push(resolvedPath);
      else statuses.set(resolvedPath, status);
      break;
    }
  }
  return { statuses, duplicates: duplicates.sort(compareCodepoint) };
}

/**
 * Deterministic source evidence around the first exact symbol occurrence.
 *
 * @param {string} source
 * @param {string} symbol
 * @param {number} [contextLines]
 * @returns {{ line:number, startLine:number, endLine:number, text:string }|null}
 */
export function extractSymbolExcerpt(source, symbol, contextLines = 2) {
  const normalized = source.replace(/\r\n?/g, '\n');
  const offset = normalized.indexOf(symbol);
  if (offset < 0) return null;
  const lines = normalized.split('\n');
  const line = normalized.slice(0, offset).split('\n').length;
  const context = Math.max(0, Math.min(10, Math.floor(contextLines)));
  const startLine = Math.max(1, line - context);
  const endLine = Math.min(lines.length, line + context);
  return {
    line,
    startLine,
    endLine,
    text: lines.slice(startLine - 1, endLine).join('\n'),
  };
}

/** @param {string|Buffer} value */
export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Canonical JSON with recursively codepoint-sorted keys. Unsupported values
 * and sparse arrays fail closed instead of being silently rewritten.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalSerialize(value) {
  const ancestors = new Set();

  /** @param {unknown} candidate @param {string} at */
  function serialize(candidate, at) {
    if (candidate === null || typeof candidate === 'string' || typeof candidate === 'boolean') {
      return JSON.stringify(candidate);
    }
    if (typeof candidate === 'number') {
      if (!Number.isFinite(candidate)) throw new Error(`${at} contains a non-finite number`);
      return JSON.stringify(candidate);
    }
    if (typeof candidate !== 'object') {
      throw new Error(`${at} contains a non-JSON value`);
    }
    if (ancestors.has(candidate)) throw new Error(`${at} contains a cycle`);
    ancestors.add(candidate);
    try {
      if (Array.isArray(candidate)) {
        for (let index = 0; index < candidate.length; index += 1) {
          if (!Object.hasOwn(candidate, index)) throw new Error(`${at} contains a sparse array`);
        }
        return `[${candidate.map((entry, index) => serialize(entry, `${at}[${index}]`)).join(',')}]`;
      }
      const prototype = Object.getPrototypeOf(candidate);
      if (prototype !== Object.prototype && prototype !== null) {
        throw new Error(`${at} contains a non-plain object`);
      }
      const entries = Object.keys(candidate).sort(compareCodepoint).map((key) => (
        `${JSON.stringify(key)}:${serialize(candidate[key], `${at}.${key}`)}`
      ));
      return `{${entries.join(',')}}`;
    } finally {
      ancestors.delete(candidate);
    }
  }

  return serialize(value, 'value');
}

/**
 * Hash every capsule field except the digest itself without mutating input.
 *
 * @param {unknown} capsule
 * @returns {string}
 */
export function capsuleDigestOf(capsule) {
  if (!isRecord(capsule)) throw new Error('coding capsule must be an object');
  const digestFree = Object.fromEntries(
    Object.entries(capsule).filter(([key]) => key !== 'capsuleDigest'),
  );
  return sha256(canonicalSerialize(digestFree));
}

/**
 * Verify the self-contained fields before another tool trusts a capsule.
 * Packet evidence is checked independently so a caller cannot repair an
 * altered or blank payload merely by recomputing the outer digest.
 *
 * @param {unknown} capsule
 * @returns {true}
 */
export function verifyCodingCapsule(capsule) {
  if (!isRecord(capsule)) throw new Error('coding capsule must be an object');
  if (capsule.schemaVersion !== PACKET_MANIFEST_SCHEMA_VERSION) {
    throw new Error(`coding capsule schemaVersion must be ${PACKET_MANIFEST_SCHEMA_VERSION}`);
  }
  if (typeof capsule.id !== 'string' || !ID_TOKEN.test(capsule.id)) {
    throw new Error('coding capsule id must be a non-blank packet token');
  }
  if (capsule.status !== 'READY') throw new Error('coding capsule status must be READY');
  const packetPathError = packetPathProblem(capsule.packetPath);
  if (packetPathError) throw new Error(`coding capsule packetPath ${packetPathError}`);
  if (typeof capsule.verifiedBase !== 'string' || !SHA_40.test(capsule.verifiedBase)) {
    throw new Error('coding capsule verifiedBase must be a lowercase 40-character SHA');
  }
  if (typeof capsule.verifiedBranch !== 'string' || !BRANCH_TOKEN.test(capsule.verifiedBranch)) {
    throw new Error('coding capsule verifiedBranch must be a non-blank branch token');
  }
  if (capsule.authorityNotice !== PACKET_AUTHORITY_NOTICE) {
    throw new Error('coding capsule authority notice is missing or altered');
  }
  if (!isRecord(capsule.packetMarkdown) || typeof capsule.packetMarkdown.text !== 'string'
    || capsule.packetMarkdown.text.trim().length === 0) {
    throw new Error('coding capsule packet Markdown text must be non-blank');
  }
  const packetBytes = Buffer.from(capsule.packetMarkdown.text, 'utf8');
  if (capsule.packetMarkdown.byteLength !== packetBytes.length) {
    throw new Error('coding capsule packet Markdown byte length is inconsistent');
  }
  if (!SHA_256.test(String(capsule.packetMarkdown.sha256 || ''))
    || capsule.packetMarkdown.sha256 !== sha256(packetBytes)) {
    throw new Error('coding capsule packet Markdown SHA-256 is inconsistent');
  }
  const packetHeader = parsePacketHeader(capsule.packetMarkdown.text);
  const idPattern = new RegExp(`(?:^|[^A-Za-z0-9])${escapeRegExp(capsule.id)}(?:[A-Z][A-Z0-9]*(?:\\+[A-Z0-9]+)*)?(?:$|[^A-Za-z0-9])`, 'i');
  if (!packetHeader.heading || !idPattern.test(packetHeader.heading)
    || packetHeader.status !== capsule.status
    || packetHeader.verifiedBase !== capsule.verifiedBase
    || packetHeader.verifiedBranch !== capsule.verifiedBranch) {
    throw new Error('coding capsule packet Markdown authority disagrees with capsule identity');
  }
  const packetHashRows = Array.isArray(capsule.fileHashes)
    ? capsule.fileHashes.filter((row) => isRecord(row) && row.path === capsule.packetPath)
    : [];
  if (packetHashRows.length !== 1
    || packetHashRows[0].exists !== true
    || packetHashRows[0].sha256 !== capsule.packetMarkdown.sha256) {
    throw new Error('coding capsule packet Markdown disagrees with structured file hashes');
  }
  if (!SHA_256.test(String(capsule.capsuleDigest || ''))
    || capsule.capsuleDigest !== capsuleDigestOf(capsule)) {
    throw new Error('coding capsule digest is missing or inconsistent');
  }
  return true;
}

/** @param {string} rootDir @param {string} repositoryPath */
function absoluteRepositoryPath(rootDir, repositoryPath) {
  const root = resolve(rootDir);
  const absolute = resolve(root, ...repositoryPath.split('/'));
  if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
    throw new Error(`path escapes repository root: ${repositoryPath}`);
  }
  return absolute;
}

/** @param {string} rootDir @param {string} repositoryPath */
function fileExists(rootDir, repositoryPath) {
  const absolute = absoluteRepositoryPath(rootDir, repositoryPath);
  return existsSync(absolute) && statSync(absolute).isFile();
}

/** @param {string} rootDir @param {string} repositoryPath */
function readRepositoryFile(rootDir, repositoryPath) {
  return readFileSync(absoluteRepositoryPath(rootDir, repositoryPath), 'utf8');
}

/** @param {string[]} errors @param {string} message */
function addError(errors, message) {
  errors.push(message);
}

/**
 * Validate manifest structure plus its joins to the index, packet Markdown, and
 * live source files. It returns every measured error instead of stopping at the
 * first one, but no caller may treat a partial result as valid.
 *
 * @param {unknown} manifest
 * @param {{ rootDir?:string }} [options]
 * @returns {{ ok:boolean, errors:string[] }}
 */
export function validatePacketManifest(manifest, options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  /** @type {string[]} */
  const errors = [];
  if (!isRecord(manifest)) {
    return { ok: false, errors: ['manifest must be an object'] };
  }
  if (manifest.schemaVersion !== PACKET_MANIFEST_SCHEMA_VERSION) {
    addError(errors, `schemaVersion must be ${PACKET_MANIFEST_SCHEMA_VERSION}`);
  }

  const indexPath = manifest.indexPath;
  const indexPathError = packetPathProblem(indexPath);
  if (indexPathError) addError(errors, `indexPath ${indexPathError}`);
  else if (!fileExists(rootDir, indexPath)) addError(errors, `indexPath does not exist: ${indexPath}`);

  if (!Array.isArray(manifest.packets)) addError(errors, 'packets must be an array');
  const packets = Array.isArray(manifest.packets) ? manifest.packets : [];

  /** @type {Map<string,string>} */
  let indexStatuses = new Map();
  if (!indexPathError && fileExists(rootDir, indexPath)) {
    const parsed = parseIndexPacketStatuses(readRepositoryFile(rootDir, indexPath), indexPath);
    indexStatuses = parsed.statuses;
    for (const duplicate of parsed.duplicates) {
      addError(errors, `index contains duplicate packet path: ${duplicate}`);
    }
  }

  const ids = new Set();
  const packetPaths = new Set();
  /** @type {Map<string,string>} */
  const changePathOwners = new Map();

  for (let packetIndex = 0; packetIndex < packets.length; packetIndex += 1) {
    const rawPacket = packets[packetIndex];
    const prefix = `packets[${packetIndex}]`;
    if (!isRecord(rawPacket)) {
      addError(errors, `${prefix} must be an object`);
      continue;
    }

    const id = rawPacket.id;
    const idLabel = typeof id === 'string' && id ? id : prefix;
    if (typeof id !== 'string' || !ID_TOKEN.test(id)) {
      addError(errors, `${prefix}.id must be a bounded packet token`);
    } else if (ids.has(id.toUpperCase())) {
      addError(errors, `duplicate packet id: ${id}`);
    } else ids.add(id.toUpperCase());

    const status = rawPacket.status;
    if (typeof status !== 'string' || !STATUS_SET.has(status)) {
      addError(errors, `${idLabel}.status is unknown: ${String(status)}`);
    }

    const packetPath = rawPacket.packetPath;
    const packetPathError = packetPathProblem(packetPath);
    if (packetPathError) addError(errors, `${idLabel}.packetPath ${packetPathError}`);
    else {
      if (packetPaths.has(packetPath)) addError(errors, `duplicate packet path: ${packetPath}`);
      packetPaths.add(packetPath);
      if (!fileExists(rootDir, packetPath)) addError(errors, `${idLabel}.packetPath does not exist: ${packetPath}`);
    }

    const verifiedBase = rawPacket.verifiedBase;
    if (typeof verifiedBase !== 'string' || !SHA_40.test(verifiedBase)) {
      addError(errors, `${idLabel}.verifiedBase must be a lowercase 40-character SHA`);
    }

    const changeManifest = rawPacket.changeManifest;
    const requiredSymbols = rawPacket.requiredSymbols;
    const acceptanceCases = rawPacket.acceptanceCases;
    const checks = rawPacket.checks;
    if (!Array.isArray(changeManifest)) addError(errors, `${idLabel}.changeManifest must be an array`);
    if (!Array.isArray(requiredSymbols)) addError(errors, `${idLabel}.requiredSymbols must be an array`);
    if (!Array.isArray(acceptanceCases)) addError(errors, `${idLabel}.acceptanceCases must be an array`);
    if (!Array.isArray(checks)) addError(errors, `${idLabel}.checks must be an array`);

    const changes = Array.isArray(changeManifest) ? changeManifest : [];
    const symbols = Array.isArray(requiredSymbols) ? requiredSymbols : [];
    const cases = Array.isArray(acceptanceCases) ? acceptanceCases : [];
    const commandRows = Array.isArray(checks) ? checks : [];

    if (status === 'READY') {
      if (changes.length === 0) addError(errors, `${idLabel} READY packet has no changeManifest rows`);
      if (symbols.length === 0) addError(errors, `${idLabel} READY packet has no requiredSymbols`);
      if (cases.length === 0) addError(errors, `${idLabel} READY packet has no acceptanceCases`);
      if (commandRows.length === 0) addError(errors, `${idLabel} READY packet has no checks`);
    }
    if (cases.length > 8) addError(errors, `${idLabel} has ${cases.length} acceptance cases; maximum is 8`);

    const localChangePaths = new Set();
    const changeOwnerKey = `${packetIndex}:${idLabel}`;
    const reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status));
    for (let index = 0; index < changes.length; index += 1) {
      const row = changes[index];
      const at = `${idLabel}.changeManifest[${index}]`;
      if (!isRecord(row)) {
        addError(errors, `${at} must be an object`);
        continue;
      }
      if (typeof row.action !== 'string' || !ACTION_SET.has(row.action)) {
        addError(errors, `${at}.action is unknown: ${String(row.action)}`);
      }
      const problem = packetPathProblem(row.path);
      if (problem) {
        addError(errors, `${at}.path ${problem}`);
        continue;
      }
      if (localChangePaths.has(row.path)) addError(errors, `${idLabel} contains duplicate change path: ${row.path}`);
      localChangePaths.add(row.path);
      if (reservesChangePaths) {
        const priorOwner = changePathOwners.get(row.path);
        if (priorOwner && priorOwner !== changeOwnerKey) {
          addError(
            errors,
            `duplicate change path across packets: ${row.path} (${priorOwner.replace(/^\d+:/, '')}, ${idLabel})`,
          );
        } else changePathOwners.set(row.path, changeOwnerKey);
      }
      if (row.action !== 'CREATE' && !fileExists(rootDir, row.path)) {
        addError(errors, `${at}.path does not exist for ${String(row.action)}: ${row.path}`);
      }
      // A CREATE row is a promise; LANDED is the claim that the promise was kept. Before a
      // packet lands the file must NOT exist — preflight asserts exactly that — and a
      // SUPERSEDED packet may have been replaced before it ever built anything. LANDED is
      // therefore the only status under which existence is assertable, and so the only status
      // under which a fictional CREATE row is catchable. Without this arm a landed packet can
      // name files that were never written, forever, and validation still reports `valid`.
      if (row.action === 'CREATE' && status === 'LANDED' && !fileExists(rootDir, row.path)) {
        addError(errors, `${at}.path does not exist for LANDED CREATE: ${row.path}`);
      }
    }

    // ── THE COUPLING-REGISTRATION TEMPLATE CHECK (OQ §35 ruling 3, instance FIVE) ───────
    // Applied at EVERY status deliberately. Scoping it to non-terminal statuses would have
    // been the tidier idiom and is REFUSED as vacuous: there are zero READY packets and
    // every coupling packet in the estate is LANDED, so such a check would have no live
    // subject and could be broken by any edit without anything reddening — the recorded
    // vacuity class, inside a guard whose whole purpose is to stop a silent miss.
    const coupling = couplingRegistrationGaps([...localChangePaths]);
    if (coupling.leaves.length > 0 && coupling.missing.length > 0
      && !isCouplingRegistrationLegacy(id)) {
      addError(
        errors,
        `${idLabel} mints a coupling row in ${coupling.leaves.join(', ')} but its changeManifest`
        + ` does not name ${coupling.missing.join(' or ')}: a row the composing head does not`
        + ' re-export and the exact-list pin does not name CANNOT EXIST — it imports as'
        + ' undefined and the pin reds after the edit instead of being read before it.',
      );
    }

    const symbolKeys = new Set();
    for (let index = 0; index < symbols.length; index += 1) {
      const row = symbols[index];
      const at = `${idLabel}.requiredSymbols[${index}]`;
      if (!isRecord(row)) {
        addError(errors, `${at} must be an object`);
        continue;
      }
      const problem = packetPathProblem(row.path);
      if (problem) addError(errors, `${at}.path ${problem}`);
      if (typeof row.symbol !== 'string' || row.symbol.trim().length === 0) {
        addError(errors, `${at}.symbol must be a non-blank string`);
      }
      if (problem || typeof row.symbol !== 'string' || row.symbol.trim().length === 0) continue;
      const key = `${row.path}\0${row.symbol}`;
      if (symbolKeys.has(key)) addError(errors, `${idLabel} contains duplicate required symbol: ${row.path} :: ${row.symbol}`);
      symbolKeys.add(key);
      if (!fileExists(rootDir, row.path)) {
        addError(errors, `${at}.path does not exist: ${row.path}`);
        continue;
      }
      const source = readRepositoryFile(rootDir, row.path);
      if (!source.includes(row.symbol)) {
        addError(errors, `${at}.symbol is missing from ${row.path}: ${row.symbol}`);
      }
    }

    const retiredSymbols = rawPacket.retiredSymbols;
    if (retiredSymbols !== undefined && !Array.isArray(retiredSymbols)) {
      addError(errors, `${idLabel}.retiredSymbols must be an array when present`);
    }
    const retired = Array.isArray(retiredSymbols) ? retiredSymbols : [];
    const retiredKeys = new Set();
    for (let index = 0; index < retired.length; index += 1) {
      const row = retired[index];
      const at = `${idLabel}.retiredSymbols[${index}]`;
      if (!isRecord(row)) {
        addError(errors, `${at} must be an object`);
        continue;
      }
      const problem = packetPathProblem(row.path);
      if (problem) addError(errors, `${at}.path ${problem}`);
      if (typeof row.symbol !== 'string' || row.symbol.trim().length === 0) {
        addError(errors, `${at}.symbol must be a non-blank string`);
      }
      if (problem || typeof row.symbol !== 'string' || row.symbol.trim().length === 0) continue;
      const key = `${row.path}\0${row.symbol}`;
      if (retiredKeys.has(key)) addError(errors, `${idLabel} contains duplicate retired symbol: ${row.path} :: ${row.symbol}`);
      retiredKeys.add(key);
      // THE ARM CR-IN1B-9 CURED BY HAND: a symbol cannot be both preserved and retired.
      if (symbolKeys.has(key)) {
        addError(errors, `${idLabel} names ${row.path} :: ${row.symbol} as BOTH required and retired`);
        continue;
      }
      // The mirror of the LANDED CREATE arm above, and for the same reason. Before a packet
      // lands the retiree MUST still be present — the packet is written against it. A
      // SUPERSEDED packet may have been replaced before it retired anything. LANDED is
      // therefore the only status under which absence is assertable, and so the only status
      // under which a fictional retirement is catchable.
      const exists = fileExists(rootDir, row.path);
      if (status === 'LANDED') {
        if (exists && readRepositoryFile(rootDir, row.path).includes(row.symbol)) {
          addError(errors, `${at}.symbol survives in ${row.path} for LANDED retirement: ${row.symbol}`);
        }
      } else if (!TERMINAL_PACKET_STATUSES.has(String(status))) {
        if (!exists) addError(errors, `${at}.path does not exist: ${row.path}`);
        else if (!readRepositoryFile(rootDir, row.path).includes(row.symbol)) {
          addError(errors, `${at}.symbol is already absent from ${row.path} before ${String(status)}: ${row.symbol}`);
        }
      }
    }

    const caseIds = new Set();
    for (let index = 0; index < cases.length; index += 1) {
      const row = cases[index];
      const at = `${idLabel}.acceptanceCases[${index}]`;
      if (!isRecord(row)) {
        addError(errors, `${at} must be an object`);
        continue;
      }
      if (typeof row.id !== 'string' || row.id.length === 0) addError(errors, `${at}.id must be a non-empty string`);
      else if (caseIds.has(row.id)) addError(errors, `${idLabel} contains duplicate acceptance id: ${row.id}`);
      else caseIds.add(row.id);
      if (typeof row.case !== 'string' || row.case.trim().length === 0) {
        addError(errors, `${at}.case must be a non-empty string`);
      }
    }

    for (let index = 0; index < commandRows.length; index += 1) {
      const command = commandRows[index];
      if (!Array.isArray(command) || command.length === 0 || command.some((arg) => typeof arg !== 'string' || arg.trim().length === 0)) {
        addError(errors, `${idLabel}.checks[${index}] must be a non-blank argv string array`);
      }
    }

    if (!packetPathError && fileExists(rootDir, packetPath)) {
      const header = parsePacketHeader(readRepositoryFile(rootDir, packetPath));
      const idPattern = typeof id === 'string'
        ? new RegExp(
          `(?:^|[^A-Za-z0-9])${escapeRegExp(id)}(?:[A-Z][A-Z0-9]*(?:\\+[A-Z0-9]+)*)?(?:$|[^A-Za-z0-9])`,
          'i',
        )
        : null;
      if (!header.heading || !idPattern?.test(header.heading)) {
        addError(errors, `${idLabel}.packetPath heading does not name packet id ${String(id)}`);
      }
      if (header.status !== status) {
        addError(errors, `${idLabel} status disagrees with packet Markdown: manifest=${String(status)} packet=${String(header.status)}`);
      }
      if (header.verifiedBase !== verifiedBase) {
        addError(errors, `${idLabel} verifiedBase disagrees with packet Markdown: manifest=${String(verifiedBase)} packet=${String(header.verifiedBase)}`);
      }
      if (status === 'READY' && !header.verifiedBranch) {
        addError(errors, `${idLabel}.packetPath READY header must name a non-blank verified branch`);
      }
      const indexStatus = indexStatuses.get(packetPath);
      if (!indexStatus) addError(errors, `${idLabel}.packetPath is absent from index: ${packetPath}`);
      else if (indexStatus !== status) {
        addError(errors, `${idLabel} status disagrees with index: manifest=${String(status)} index=${indexStatus}`);
      }
    }
  }

  for (const indexedPath of indexStatuses.keys()) {
    if (!packetPaths.has(indexedPath)) {
      addError(errors, `index packet path is absent from manifest: ${indexedPath}`);
    }
  }

  return { ok: errors.length === 0, errors: errors.sort(compareCodepoint) };
}

/**
 * Load the canonical JSON without accepting comments, trailing commas, or an
 * alternate path chosen by manifest input.
 *
 * @param {{ rootDir?:string, manifestPath?:string }} [options]
 */
export function loadPacketManifest(options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST_PATH;
  const problem = packetPathProblem(manifestPath);
  if (problem) throw new Error(`manifestPath ${problem}`);
  return JSON.parse(readRepositoryFile(rootDir, manifestPath));
}

/**
 * Build the deterministic, READY-only handoff. Missing CREATE targets are
 * represented by `exists:false, sha256:null`; every existing evidence file is
 * hashed from its exact bytes.
 *
 * @param {unknown} manifest
 * @param {string} packetId
 * @param {{ rootDir?:string }} [options]
 */
export function buildCodingCapsule(manifest, packetId, options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  const validation = validatePacketManifest(manifest, { rootDir });
  if (!validation.ok) {
    throw new Error(`packet manifest is invalid:\n${validation.errors.join('\n')}`);
  }
  const packets = /** @type {Record<string, unknown>[]} */ (manifest.packets);
  const packet = packets.find((row) => row.id === packetId);
  if (!packet) throw new Error(`unknown packet id: ${packetId}`);
  if (packet.status !== 'READY') throw new Error(`packet ${packetId} is not READY`);

  const packetBytes = readFileSync(absoluteRepositoryPath(rootDir, packet.packetPath));
  const packetText = packetBytes.toString('utf8');
  if (!Buffer.from(packetText, 'utf8').equals(packetBytes)) {
    throw new Error(`packet ${packetId} is not valid UTF-8: ${packet.packetPath}`);
  }
  const packetHeader = parsePacketHeader(packetText);
  if (!packetHeader.verifiedBranch) {
    throw new Error(`packet ${packetId} has no valid verified branch`);
  }

  const changeManifest = /** @type {Array<{action:string,path:string}>} */ (packet.changeManifest);
  const requiredSymbols = /** @type {Array<{path:string,symbol:string}>} */ (packet.requiredSymbols);
  const retiredSymbols = Array.isArray(packet.retiredSymbols) ? packet.retiredSymbols : [];
  const filePaths = new Set([
    /** @type {string} */ (manifest.indexPath),
    /** @type {string} */ (packet.packetPath),
    ...changeManifest.map((row) => row.path),
    ...requiredSymbols.map((row) => row.path),
    ...retiredSymbols.map((row) => row.path),
  ]);
  const fileHashes = [...filePaths].sort(compareCodepoint).map((repositoryPath) => {
    const exists = fileExists(rootDir, repositoryPath);
    return {
      path: repositoryPath,
      exists,
      sha256: exists
        ? sha256(readFileSync(absoluteRepositoryPath(rootDir, repositoryPath)))
        : null,
    };
  });

  const symbolEvidence = requiredSymbols.map((row) => {
    const source = readRepositoryFile(rootDir, row.path);
    const excerpt = extractSymbolExcerpt(source, row.symbol);
    if (!excerpt) throw new Error(`required symbol disappeared: ${row.path} :: ${row.symbol}`);
    return { path: row.path, symbol: row.symbol, ...excerpt };
  });

  const digestFreeCapsule = {
    schemaVersion: PACKET_MANIFEST_SCHEMA_VERSION,
    id: packet.id,
    status: packet.status,
    packetPath: packet.packetPath,
    verifiedBase: packet.verifiedBase,
    verifiedBranch: packetHeader.verifiedBranch,
    authorityNotice: PACKET_AUTHORITY_NOTICE,
    packetMarkdown: {
      text: packetText,
      byteLength: packetBytes.length,
      sha256: sha256(packetBytes),
    },
    fileHashes,
    requiredSymbols: symbolEvidence,
    retiredSymbols: retiredSymbols.map(({ path, symbol }) => ({ path, symbol })),
    changeManifest: changeManifest.map((row) => ({ action: row.action, path: row.path })),
    acceptanceCases: /** @type {Array<{id:string,case:string}>} */ (packet.acceptanceCases)
      .map((row) => ({ id: row.id, case: row.case })),
    checks: /** @type {string[][]} */ (packet.checks).map((command) => [...command]),
  };
  const capsule = {
    ...digestFreeCapsule,
    capsuleDigest: capsuleDigestOf(digestFreeCapsule),
  };
  verifyCodingCapsule(capsule);
  return capsule;
}

/** @param {NodeJS.WritableStream} stream @param {string} value */
function writeLine(stream, value) {
  stream.write(`${value}\n`);
}

/**
 * Importable CLI runner. Returning an exit code keeps tests from mutating the
 * process and lets the real entrypoint preserve ordinary shell semantics.
 *
 * @param {string[]} argv
 * @param {{ rootDir?:string, stdout?:NodeJS.WritableStream, stderr?:NodeJS.WritableStream }} [options]
 * @returns {number}
 */
export function runImplementationPacketsCli(argv, options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  try {
    if (argv.length === 1 && argv[0] === 'validate') {
      const manifest = loadPacketManifest({ rootDir });
      const result = validatePacketManifest(manifest, { rootDir });
      if (!result.ok) {
        for (const error of result.errors) writeLine(stderr, `[implementation-packets] ${error}`);
        return 1;
      }
      const packets = /** @type {Record<string, unknown>[]} */ (manifest.packets);
      const ready = packets.filter((packet) => packet.status === 'READY').length;
      writeLine(stdout, `[implementation-packets] valid: ${packets.length} packets (${ready} READY)`);
      return 0;
    }
    if (argv.length === 2 && argv[0] === 'capsule') {
      const manifest = loadPacketManifest({ rootDir });
      const capsule = buildCodingCapsule(manifest, argv[1], { rootDir });
      stdout.write(`${JSON.stringify(capsule, null, 2)}\n`);
      return 0;
    }
    writeLine(stderr, 'usage: node scripts/implementation-packets.mjs validate');
    writeLine(stderr, '   or: node scripts/implementation-packets.mjs capsule <ID>');
    return 1;
  } catch (error) {
    writeLine(stderr, `[implementation-packets] ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runImplementationPacketsCli(process.argv.slice(2));
}
