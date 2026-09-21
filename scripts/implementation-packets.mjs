/**
 * implementation-packets.mjs — IA-1's packet validator and coding-capsule tool.
 *
 * The JSON manifest is an instruction index, never proof that implementation
 * exists. Validation therefore closes the joins back to the human packet, the
 * implementation index, and the live source symbols before a READY packet can
 * produce a capsule — and, once a packet is LANDED, back to the very files its
 * CREATE rows claim to have produced.
 */

import { spawnSync } from 'node:child_process';
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

// ── THE ROW-KEYED REGISTER EXEMPTION (chair ruling, PACKET-PARALLEL ruling 4; TOOL-27) ──
// The cross-packet reservation below treats a change PATH as a whole-file claim, which is
// right for code and wrong for a REGISTER KEYED BY ROW. `mutation-coverage-manifest.json`
// is keyed by test-file path: a packet that creates one enforcer-directory test file adds
// exactly ONE row, beside its own test, and two such packets contend for nothing. MEASURED
// 2026-09-20: that one path is 10 of the 22 colliding pairs in the waiting estate, and it
// refused EM-A1 and EM-B1h together — `duplicate change path across packets:
// scripts/mutation-coverage-manifest.json (EM-A1, EM-B1h)` — with no other error in the run.
//
// ⛔ THE EXEMPTION IS NEVER A BLANK CHEQUE, and it relaxes the RESERVATION only. Addendum
// 70's reason is untouched: no row for a test file that does not yet exist is written by
// anyone but the member that creates the file, so each member still lands its own row in
// its own commit. What changes is that the reservation is taken BY ROW KEY rather than by
// path, and both fences are asserted — the SAME row key claimed twice still refuses, and a
// register row that declares NO row key refuses rather than reserving silently.
//
// ⚠ A FROZEN ARRAY, NOT A FROZEN SET, ON AN EXECUTED READING: `Object.freeze(new Set(…))`
// does NOT freeze a Set — its members are not own properties, so `.add()` still succeeds
// (measured: size 1 -> 2, no throw), while `Object.freeze([…]).push()` throws TypeError.
// The exported roster is therefore the same shape `PACKET_STATUSES` and `PACKET_ACTIONS`
// three lines above already use: a frozen array, with a private Set derived for lookup.
export const ROW_KEYED_REGISTERS = Object.freeze([
  'scripts/mutation-coverage-manifest.json',
]);
const ROW_KEYED_REGISTER_SET = new Set(ROW_KEYED_REGISTERS);

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

// ── THE MOVING-HEAD REFUSAL (HK-3, chair ruling recorded at ODQ §455) ────────────────
// A `requiredSymbols` row pins a symbol that must EXIST. A migration FILENAME quoted in a
// DOC is not a symbol — it is a figure that moves the moment the next migration lands, and
// pinning it inside a packet turns every later migration member into a red against a
// packet it never touched. WEB-1 pinned `197_consent_person_adjacent_default.sql` against
// `docs/DEPLOY.md`'s current-migration-head line; WEB-2 hit it, and the estate already
// carries the general law ("never put a re-recorded FIGURE in requiredSymbols", ODQ TE-26).
// This turns that law into machinery for the one shape that has actually bitten.
//
// SCOPED TO DOCS PATHS DELIBERATELY. The boundary was measured, not guessed, and the
// measurement is stated here correctly (D-HKA-1, ODQ §463.3 — the HK-3 commit message and
// the first draft of this comment claimed TM-2A's row "matches the filename shape outside
// docs"; under the ANCHORED regex below, ZERO estate rows match at any path). The nearest
// non-doc row is TM-2A's `const SIM_METRIC_MIGRATIONS = Object.freeze([...196_world_sim_
// metrics.sql...])` against `tests/lint/engineTelemetryWall.walker.test.js`, which only
// CONTAINS a filename inside a frozen roster constant — a correct pin, the one the walker
// exists to hold, and not the moving head. The docs/ scope is kept on its own merits: a
// test or a script may legitimately pin a bare migration basename as a symbol (a roster
// constant's line, a rehearsal wave's file reference), whereas a doc quoting the basename is
// quoting the head. TM-2A's row at its own non-docs path is the third negative control in
// tests/scripts/implementationPackets.test.js, and the same roster-constant symbol is not
// refused at a docs path either (measured at the node level at HK-A's build) — the regex is
// anchored, so only a BARE basename trips it. The refusal is also SHAPE-scoped: it reads the
// `symbol`, never the doc's contents, so a doc row naming a real heading or an exported
// token is untouched.
const MIGRATION_FILENAME_SYMBOL = /^\d{3}_.*\.sql$/;
const DOCS_PATH_PREFIX = 'docs/';

// HK-5 (ODQ §879.11 R4; §479.2 read PACKET-scoped) — THE MOVING-HEAD REFUSAL, SECOND SHAPE.
// HK-3 above refuses a migration FILENAME pinned in a doc. The same defect has a second
// spelling that HK-3 cannot see: the migration head quoted as a bare FIGURE. Both live in
// the estate's own docs today — `docs/CURRENT_STATE.md` says "migrations are contiguous to
// 200" and `ARCHITECTURE.md` says "**migrations/** (200)" — and either becomes a trap for
// every later migration member the moment the next migration lands, exactly as WEB-1's
// filename row trapped WEB-2. The scope is the four §479.2 paths named explicitly rather
// than all of `docs/`: §479.2 is packet-scoped, the two `tests/docs/` freshness tests are
// what compel the DOCUMENTS, and a blanket refusal over every doc would convict honest prose.
// ⚠ `ARCHITECTURE.md` is at the repository ROOT, so it is deliberately NOT reachable through
// DOCS_PATH_PREFIX — that is why this roster is a list of paths and not a prefix.
const MIGRATION_HEAD_FIGURE_PATHS = Object.freeze([
  'docs/DEPLOY.md',
  'ARCHITECTURE.md',
  'docs/CURRENT_STATE.md',
  'scripts/ops/migrationRehearsalCore.mjs',
  'docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md',
]);

// Each shape is anchored at a phrase boundary, never as a loose substring, so a real heading
// ("Current migration head"), an exported token, or a three-digit figure that is not a
// migration head at all ("311 static route documents") is untouched.
const MIGRATION_HEAD_FIGURE_SHAPES = Object.freeze([
  { what: 'a bare migration head number', pattern: /^\s*\d{3}\s*$/ },
  { what: 'the frozen head constant', pattern: /\bMIGRATION_TRAIN_REPO_HEAD\s*=\s*\d+/ },
  { what: "the ARCHITECTURE migrations row's parenthesised head", pattern: /\bmigrations\/\*\*\s*\(\s*\d+\s*\)/ },
  { what: 'a contiguity claim', pattern: /\bcontiguous to \d+/ },
  { what: 'a bare head figure', pattern: /\bhead\s+\d{2,}(?!\d)/ },
]);

/**
 * @param {string} path
 * @param {string} symbol
 * @returns {string | null} the shape's description, or null when the row is well-formed.
 */
function migrationHeadFigureShape(path, symbol) {
  if (!MIGRATION_HEAD_FIGURE_PATHS.includes(path)) return null;
  for (const shape of MIGRATION_HEAD_FIGURE_SHAPES) {
    if (shape.pattern.test(symbol)) return shape.what;
  }
  return null;
}

// ── §731.3 THE RETIREMENT PATH (owner ruling ODQ §731, charter §11.5) ────────────────
// A LANDED packet is a HISTORICAL RECORD, not a promise of immortality. Every existence
// and verbatim assertion below was written on a premise nobody stated: that the codebase
// only ever GROWS. A landed packet's changeManifest rows must still exist; its
// requiredSymbols must still be present verbatim. The legacy-map strip (ODQ §725/§731)
// was the first authorized REMOVAL big enough to break that premise — six landed packets
// went red across 22 rows naming files an owner-ordered deletion had removed, and two of
// those rows pinned the very ratchet FIGURES a shrink-only census had been forced to
// lower, so a shrink-only ratchet pinned by a landed packet could never shrink. Neither
// shape is a defect the packet's author can repair, and neither is specific to one wave:
// STRIP-2..6 and every future removal ride this same path.
//
// A row may therefore carry `retiredBy`, naming the ledger § that authorized the removal.
// The row KEEPS every check that describes its own SHAPE — well-formed, uniquely keyed,
// correctly actioned — and loses only the assertions that describe a tree the ruling
// deliberately changed.
//
// THE ONE FENCE: a retirement naming no ledger § is REFUSED. An uncited `retiredBy` is a
// silent silencer, which is the precise failure this estate exists to prevent; requiring
// the citation makes every retirement traceable to a decision somebody can veto. A
// MALFORMED retirement is refused AND does not discharge — a half-formed annotation must
// never buy the silence it was refused for.
//
// SIBLING TO §379.2, NOT A REPLACEMENT. `retiredSymbols` is the CROSS-PACKET discharge: a
// NEW landed packet retires a pair and thereby answers OTHER packets' rows. It cannot
// serve here — it needs a fresh packet to do the retiring, and it has no changeManifest
// half at all. `retiredBy` is the per-row, self-annotating path a wave of pure deletion
// needs. The two compose: a requiredSymbols row may be discharged by either, and neither
// weakens the other's fences.
const RETIRED_BY_REFERENCE = /§\d+/;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Read a row's §731.3 `retiredBy` annotation.
 *
 * Returns BOTH halves deliberately: `error` is appended by the caller, and `retired` gates
 * the existence/verbatim checks. They are never both truthy — a refused retirement leaves
 * the row's live assertions running, so a malformed annotation cannot silence anything.
 *
 * @param {Record<string, unknown>} row
 * @returns {{ retired: boolean, error: string|null }}
 */
function retirementOf(row) {
  const value = row.retiredBy;
  if (value === undefined) return { retired: false, error: null };
  if (typeof value !== 'string' || value.trim().length === 0) {
    return {
      retired: false,
      error: '.retiredBy must be a non-blank string naming the ledger section that authorized'
        + ' the removal (for example "§731")',
    };
  }
  if (!RETIRED_BY_REFERENCE.test(value)) {
    return {
      retired: false,
      error: `.retiredBy cites no ledger section: ${value}. A retirement must name the § that`
        + ' authorized it (for example "§725/§731"): an uncited retirement silences a live'
        + ' guard with nothing left to veto.',
    };
  }
  return { retired: true, error: null };
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

// ── §7.4 THE SEALED-BURN EXEMPTION (chair ruling, ODQ §934.47 addendum 84) ───────────
// The non-terminal arm of the retirement check below demands that a `retiredSymbols`
// symbol still be PRESENT, because the packet is written against it. That premise has
// exactly one lawful exception, and nobody had written it down: THE PACKET'S OWN SEALED
// BUILD. EM-B1f's change manifest ordered its lane to burn `UNDISPOSITIONED_CEILING`'s
// figure — the exact text of its own retiredSymbols row — while `validate` sat at index 11
// of that same packet's sealed `checks`, so the manifest and the packet's own gate were
// mutually unsatisfiable for as long as the packet was READY. Measured three ways: retiree
// present, row present -> valid; retiree burned, row present -> refused; retiree burned,
// row deleted -> valid. No ordering of lane acts made the honest manifest green.
//
// THE DISCRIMINATOR IS THE SEAL, AND A SEAL IS A RECEIPT RATHER THAN A CLAIM. A seal can
// only exist because `createImplementationSession` ran THIS validator through
// `loadLiveAuthority` and required it green — with the retiree present — before writing
// it. So "absent under a live seal" means precisely "present at dispatch, burned by the
// build that dispatch authorized", while "absent with no seal" keeps its old meaning: a
// placement whose retiree is already gone is stale, and stays refused.
//
// FOUR FENCES, each exercised by a counterforce arm in the validator's test home:
//   * THE ENVELOPE MUST VERIFY. `integrityDigest` is recomputed from the payload, so a
//     seal edited after it was written licenses nothing. This is a DISCIPLINE boundary,
//     not a security one: whoever can write the Git directory can also recompute the
//     digest, exactly as `openImplementationSession` has always been forgeable.
//   * THE SEAL MUST BE THIS PACKET'S. A seal carrying another id is not a licence.
//   * THE SEAL MUST BE THIS WORKTREE'S. `gitDir` is compared against the live one, the
//     same fence `openImplementationSession` applies before it will open a session, so a
//     seal copied in from elsewhere is not a licence.
//   * THE BOUND HEAD MUST BE AN ANCESTOR. A stale seal, bound to a commit this tree never
//     reached, is REFUSED, and the refusal names the HEAD it bound so the staleness is
//     legible instead of mysterious. Ancestor rather than equality deliberately: the seal
//     is still telling the truth once the build's own commit lands on top of it, which is
//     when the composing chair re-runs `validate`.
//
// The lookup runs ONLY where the refusal was about to be raised, so a tree with no absent
// retiree spawns no `git` at all and the ordinary run costs exactly what it cost before.
const SEAL_DIRECTORY = 'implementation-sessions';
const SEAL_FILENAME = 'seal.json';

/**
 * The session-envelope version this reader accepts. `implementation-session.mjs` owns the
 * number as `SESSION_SCHEMA_VERSION` and imports FROM this module, so it cannot be imported
 * back without a cycle; the two are pinned equal by an arm in the validator's test home
 * rather than by a shared constant.
 */
export const SEAL_ENVELOPE_SCHEMA_VERSION = 1;

/**
 * The absolute Git administration directory for a tree, or null when it is not a worktree.
 * A linked worktree answers with its own directory, which is why seals do not leak between
 * the lanes that share one repository.
 *
 * @param {string} rootDir
 * @returns {string|null}
 */
function gitDirectoryOf(rootDir) {
  const probe = spawnSync('git', ['rev-parse', '--path-format=absolute', '--git-dir'], {
    cwd: rootDir, encoding: 'utf8', shell: false,
  });
  if (probe.status !== 0 || typeof probe.stdout !== 'string') return null;
  const value = probe.stdout.trim();
  return value ? resolve(value) : null;
}

/**
 * Whether a commit is an ancestor of the tree's HEAD. A sha naming no object exits non-zero
 * too, so an invented seal HEAD fails closed here instead of throwing.
 *
 * @param {string} rootDir
 * @param {string} commit
 * @returns {boolean}
 */
function isAncestorOfHead(rootDir, commit) {
  if (typeof commit !== 'string' || !SHA_40.test(commit)) return false;
  return spawnSync('git', ['merge-base', '--is-ancestor', commit, 'HEAD'], {
    cwd: rootDir, encoding: 'utf8', shell: false,
  }).status === 0;
}

/**
 * Read this worktree's dispatch seal for one packet, refusing anything that is not a
 * well-formed, integrity-verified seal FOR THIS PACKET in THIS worktree. Ancestry is left
 * to the caller deliberately, so a stale seal can be reported BY ITS HEAD rather than
 * silently dropped into the same verdict as no seal at all.
 *
 * @param {string} rootDir
 * @param {unknown} packetId
 * @returns {{ digest:string, head:string, gitDir:string }|null}
 */
export function readDispatchSeal(rootDir, packetId) {
  try {
    if (typeof packetId !== 'string' || !ID_TOKEN.test(packetId)) return null;
    const gitDir = gitDirectoryOf(rootDir);
    if (!gitDir) return null;
    const envelope = JSON.parse(
      readFileSync(resolve(gitDir, SEAL_DIRECTORY, packetId, SEAL_FILENAME), 'utf8'),
    );
    if (!isRecord(envelope)
      || envelope.schemaVersion !== SEAL_ENVELOPE_SCHEMA_VERSION
      || !Object.hasOwn(envelope, 'payload')
      || typeof envelope.integrityDigest !== 'string') return null;
    const recomputed = sha256(canonicalSerialize({
      schemaVersion: envelope.schemaVersion,
      payload: envelope.payload,
    }));
    if (recomputed !== envelope.integrityDigest) return null;
    const payload = envelope.payload;
    if (!isRecord(payload) || payload.id !== packetId) return null;
    if (typeof payload.gitDir !== 'string' || resolve(payload.gitDir) !== gitDir) return null;
    if (typeof payload.head !== 'string' || !SHA_40.test(payload.head)) return null;
    return { digest: envelope.integrityDigest, head: payload.head, gitDir };
  } catch {
    return null;
  }
}

/**
 * The (path, symbol) keys ONE packet's `retiredSymbols` contributes to the cross-packet
 * discharge below. Extracted so the LANDED pass and the §379.2b sealed-READY pass read the
 * rows through one expression rather than two that can drift apart.
 *
 * Malformed rows contribute nothing — they are convicted elsewhere, by their own shape — and
 * neither does a pair the SAME packet also names in `requiredSymbols`: that contradiction is
 * already an error, and a red manifest must not quietly silence a live guard somewhere else.
 *
 * @param {Record<string, unknown>} rawPacket
 * @returns {string[]}
 */
function retiredDischargeKeys(rawPacket) {
  const retiredRows = Array.isArray(rawPacket.retiredSymbols) ? rawPacket.retiredSymbols : [];
  if (retiredRows.length === 0) return [];
  const requiredRows = Array.isArray(rawPacket.requiredSymbols) ? rawPacket.requiredSymbols : [];
  const ownRequired = new Set(requiredRows
    .filter((row) => isRecord(row) && typeof row.path === 'string' && typeof row.symbol === 'string')
    .map((row) => `${row.path}\0${row.symbol}`));
  /** @type {string[]} */
  const keys = [];
  for (const row of retiredRows) {
    if (!isRecord(row) || typeof row.path !== 'string' || typeof row.symbol !== 'string') continue;
    if (packetPathProblem(row.path) || row.symbol.trim().length === 0) continue;
    const key = `${row.path}\0${row.symbol}`;
    if (!ownRequired.has(key)) keys.push(key);
  }
  return keys;
}

/**
 * Validate manifest structure plus its joins to the index, packet Markdown, and
 * live source files. It returns every measured error instead of stopping at the
 * first one, but no caller may treat a partial result as valid.
 *
 * `onNote` receives observations that are NOT errors — today, the two a live dispatch seal
 * licenses: the OWN sealed burn described at THE SEALED-BURN EXEMPTION above, and the
 * CROSS-PACKET discharge described at §379.2b inside this function. It is an optional sink
 * rather than a third key on the
 * return value on purpose: every caller in the estate asserts the exact shape
 * `{ ok, errors }`, and a validator that quietly changed its answer's shape to announce that
 * it had changed nothing would be its own kind of lie.
 *
 * @param {unknown} manifest
 * @param {{ rootDir?:string, onNote?:(note:string) => void }} [options]
 * @returns {{ ok:boolean, errors:string[] }}
 */
export function validatePacketManifest(manifest, options = {}) {
  const rootDir = resolve(options.rootDir ?? DEFAULT_ROOT);
  const onNote = typeof options.onNote === 'function' ? options.onNote : null;
  /** @param {string} message */
  const addNote = (message) => { if (onNote) onNote(message); };
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

  // ── §379.2 DISCHARGE SEMANTICS ─────────────────────────────────────────────────────
  // A retirement is a ONE-WAY RATCHET across the estate, and requiredSymbols is asserted
  // at EVERY status by deliberate design. Those two rules collided the first time a
  // packet retired a symbol four LANDED packets had required (FIXED_SURVEY_LIGHT_V1,
  // MF-T2G): the required/retired cross-check is WITHIN one packet only, so read
  // literally, retiredSymbols was unusable for any symbol a landed packet had ever
  // named, and the only cure was surgery on the older rows.
  //
  // A LANDED retiredSymbols row now DISCHARGES the requiredSymbols rows naming the same
  // (path, symbol) pair. Those rows are historical claims about a world an authorized
  // retirement removed — not live obligations — so future retirements KEEP the rows and
  // discharge them instead of deleting them.
  //
  // THREE FENCES, each of which the plants exercise:
  //  - ONLY LANDED discharges. A DRAFT or READY retirement is a promise, and a promise
  //    may not silence a live guard.
  //  - ONLY the named pair. Every other requiredSymbols row keeps its total,
  //    status-blind existence check; a missing symbol nobody retired still reds.
  //  - A packet that names a pair as BOTH required and retired contributes NO discharge.
  //    That contradiction is already an error, and a red manifest must not quietly
  //    silence a live guard somewhere else.
  //
  // Row STYLE is irrelevant here by construction: this reads the PARSED manifest, so the
  // expanded four-line row and the one-line compact row (both live in the tree, in the
  // thousands and the hundreds respectively) are the same object. Any future tool that
  // EDITS these rows as text must handle both or refuse — the surgical editor that
  // refused rather than guess on the compact style is the behaviour to copy.
  /** @type {Set<string>} */
  const dischargedSymbolKeys = new Set();
  for (const rawPacket of packets) {
    if (!isRecord(rawPacket) || rawPacket.status !== 'LANDED') continue;
    for (const key of retiredDischargeKeys(rawPacket)) dischargedSymbolKeys.add(key);
  }

  // ── §379.2b THE SEAL-AWARE CROSS-PACKET DISCHARGE (chair ruling, judgment 88; TOOL-29) ──
  // §7.4 above taught the OWN-retiree rule the seal. It could not teach THIS loop, whose first
  // line reads `status !== 'LANDED'` — so a sealed build that moves a symbol some LANDED packet
  // requires could never pass `validate`, `check:packet` or `implementation:resume` after its
  // own edits. EM-P4 measured exactly that, on its own estate: with a VALID seal live, the
  // packet's own half went quiet and SIX cross-packet errors survived, and no ordering of lane
  // acts made the honest manifest green. The packet was unbuildable, not wrong.
  //
  // A READY packet holding a VALID seal FOR THIS WORKTREE therefore discharges other packets'
  // rows exactly as its LANDED state would — and says so, as a NOTE naming the sealing packet,
  // because the discharge is PROVISIONAL in a way a landed one is not: it lasts as long as the
  // seal, and becomes an ordinary §379.2 discharge at the flip.
  //
  // THE FENCES ARE NOT RE-IMPLEMENTED HERE. `readDispatchSeal` and `isAncestorOfHead` are the
  // same two functions §7.4 consults, so the envelope schema, the recomputed integrity digest,
  // the packet's own id, this worktree's Git directory and the ancestor test are one
  // implementation with two callers rather than two that can drift. A DRAFT retirement is still
  // a promise and discharges nothing; an unsealed READY one likewise.
  //
  // ⚠ A LANDED DISCHARGE WINS AND IS SILENT. The LANDED pass runs FIRST and completely, so a
  // pair some landed packet already retired never reaches this map — no seal is consulted for
  // it, no note is minted, and LANDED behaviour is byte-identical to what it has always been.
  //
  // THE LOOKUP STAYS LAZY, which is §7.4's discipline and not merely its optimization: this
  // pass reads ROWS only and spawns no `git` at all. The seal is consulted below, at the exact
  // point a refusal was about to be raised, so a tree whose required symbols are all present
  // costs precisely what it cost before.
  /** @type {Map<string, string[]>} */
  const sealedRetirers = new Map();
  for (const rawPacket of packets) {
    if (!isRecord(rawPacket) || rawPacket.status !== 'READY') continue;
    if (typeof rawPacket.id !== 'string') continue;
    for (const key of retiredDischargeKeys(rawPacket)) {
      if (dischargedSymbolKeys.has(key)) continue;
      const claimants = sealedRetirers.get(key);
      if (claimants) claimants.push(rawPacket.id);
      else sealedRetirers.set(key, [rawPacket.id]);
    }
  }

  // Read AT MOST ONCE per packet id, and only where an absence was about to be refused: the
  // seal lookup shells out to Git, and the overwhelmingly common case reaches none of it. The
  // memo is shared by §379.2b above and §7.4's own-retiree arm below — one packet cannot need
  // two answers about one seal.
  /** @type {Map<unknown, { digest:string, head:string, gitDir:string }|null>} */
  const sealProbes = new Map();
  /** @param {unknown} packetId */
  const dispatchSealOf = (packetId) => {
    if (!sealProbes.has(packetId)) sealProbes.set(packetId, readDispatchSeal(rootDir, packetId));
    return sealProbes.get(packetId) ?? null;
  };

  // The ancestor fence costs a second `git` call, so its verdict is memoized per KEY rather
  // than recomputed for every row that names the same retiree.
  /** @type {Map<string, { id:string, digest:string, head:string }|null>} */
  const sealedDischarges = new Map();
  /** @param {string} key @returns {{ id:string, digest:string, head:string }|null} */
  const sealedDischargeOf = (key) => {
    const known = sealedDischarges.get(key);
    if (known !== undefined) return known;
    /** @type {{ id:string, digest:string, head:string }|null} */
    let answer = null;
    for (const claimant of sealedRetirers.get(key) ?? []) {
      const seal = dispatchSealOf(claimant);
      if (!seal || !isAncestorOfHead(rootDir, seal.head)) continue;
      answer = { id: claimant, digest: seal.digest, head: seal.head };
      break;
    }
    sealedDischarges.set(key, answer);
    return answer;
  };

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
        // TOOL-27: a ROW-KEYED REGISTER reserves by ROW, everything else by PATH. See THE
        // ROW-KEYED REGISTER EXEMPTION above. Every non-register path keeps the sentence it
        // has always had, byte for byte.
        const rowKeyed = ROW_KEYED_REGISTER_SET.has(row.path);
        const rowKey = rowKeyed && typeof row.rowKey === 'string' ? row.rowKey.trim() : '';
        if (rowKeyed && !rowKey) {
          addError(
            errors,
            `${at}.rowKey must name the ONE row this packet adds to the row-keyed register`
            + ` ${row.path}: several non-terminal packets may each hold this path, so a row`
            + ' that declares no key reserves nothing and cannot be told apart from a sibling.',
          );
        } else {
          const reservation = rowKeyed ? `${row.path}\0${rowKey}` : row.path;
          const priorOwner = changePathOwners.get(reservation);
          if (priorOwner && priorOwner !== changeOwnerKey) {
            const held = `${priorOwner.replace(/^\d+:/, '')}, ${idLabel}`;
            addError(errors, rowKeyed
              ? `duplicate register row key across packets: ${row.path} :: ${rowKey} (${held})`
              : `duplicate change path across packets: ${row.path} (${held})`);
          } else changePathOwners.set(reservation, changeOwnerKey);
        }
      }
      // §731.3: an authorized retirement answers the two EXISTENCE arms below. Everything
      // above — action vocabulary, path shape, duplicate keying, cross-packet reservation —
      // still runs: those describe the ROW, which a ruling about the tree cannot repair.
      const changeRetirement = retirementOf(row);
      if (changeRetirement.error) addError(errors, `${at}${changeRetirement.error}`);
      if (changeRetirement.retired) continue;
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
      // THE MOVING-HEAD REFUSAL — see MIGRATION_FILENAME_SYMBOL above. Asserted BEFORE the
      // retirement discharge and before the existence check, because this is a defect in the
      // ROW'S SHAPE rather than a claim about the tree: such a row is wrong even on the one
      // tree where the figure happens to be current, which is precisely why it shipped.
      if (row.path.startsWith(DOCS_PATH_PREFIX) && MIGRATION_FILENAME_SYMBOL.test(row.symbol)) {
        addError(
          errors,
          `${at}.symbol pins a MIGRATION FILENAME in a doc: ${row.symbol}. The current head is a`
          + ' FIGURE that moves with the next migration, so this row traps every later migration'
          + ' member against a packet it never touched. Pin a stable anchor in the doc, or pin the'
          + ' migration file itself under supabase/migrations/.',
        );
        continue;
      }
      // HK-5 — THE SAME DEFECT, SPELLED AS A FIGURE. Asserted here for HK-3's reason: it is a
      // defect in the ROW'S SHAPE, not a claim about the tree, so it fires even on the one
      // tree where the figure is current — which is exactly when such a row gets written.
      const headShape = migrationHeadFigureShape(row.path, row.symbol);
      if (headShape) {
        addError(
          errors,
          `${at}.symbol pins a MIGRATION HEAD FIGURE in ${row.path}: ${row.symbol} (${headShape}).`
          + ' The head is a figure that moves with the next migration, so this row traps every'
          + ' later migration member against a packet it never touched. Pin a stable anchor in'
          + ' the document, or pin the migration file itself under supabase/migrations/.',
        );
        continue;
      }
      // §379.2: an authorized LANDED retirement of this exact pair discharges the row.
      // The duplicate check above still runs — the row must stay well-formed and unique;
      // only the EXISTENCE assertions below are answered by the retirement.
      if (dischargedSymbolKeys.has(key)) continue;
      // §731.3: the row's OWN retirement annotation does the same, for the removal a
      // cross-packet retiredSymbols row cannot express. Asserted AFTER the moving-head
      // refusal above deliberately: that refusal is about the row's SHAPE and stays wrong
      // on every tree, so a retirement must not be able to launder it.
      const symbolRetirement = retirementOf(row);
      if (symbolRetirement.error) addError(errors, `${at}${symbolRetirement.error}`);
      if (symbolRetirement.retired) continue;
      // The two absences this row can suffer, named before either is raised. Both are answered
      // by a LANDED retirement above — the estate's arm pins that a retirement which deleted
      // the whole FILE discharges too — so both must be answerable by a sealed READY one.
      const absence = !fileExists(rootDir, row.path)
        ? `${at}.path does not exist: ${row.path}`
        : (readRepositoryFile(rootDir, row.path).includes(row.symbol)
          ? null
          : `${at}.symbol is missing from ${row.path}: ${row.symbol}`);
      if (absence === null) continue;
      // §379.2b: a READY packet's retirement of this exact pair discharges the row too, when
      // THAT packet holds a valid seal for this worktree — see THE SEAL-AWARE CROSS-PACKET
      // DISCHARGE above. ⛔ CONSULTED ONLY HERE, BELOW THE EXISTENCE READ, for the reason §7.4
      // states and a first draft of this arm broke: a discharge asserted BEFORE the read fires
      // on a symbol that is standing right there, and prints a note claiming a burn that never
      // happened. The exemption speaks only where the refusal was about to be raised.
      const sealedDischarge = sealedDischargeOf(key);
      if (sealedDischarge) {
        addNote(
          `${at}.symbol: discharged by ${sealedDischarge.id}'s SEALED READY retirement under`
          + ` seal ${sealedDischarge.digest} (bound HEAD ${sealedDischarge.head}): ${row.symbol}`
          + ` — an ordinary §379.2 LANDED discharge the moment ${sealedDischarge.id} flips.`,
        );
        continue;
      }
      addError(errors, absence);
    }

    const retiredSymbols = rawPacket.retiredSymbols;
    if (retiredSymbols !== undefined && !Array.isArray(retiredSymbols)) {
      addError(errors, `${idLabel}.retiredSymbols must be an array when present`);
    }
    const retired = Array.isArray(retiredSymbols) ? retiredSymbols : [];
    const retiredKeys = new Set();
    // Read AT MOST ONCE per packet, and only when a retiree has actually gone missing: the
    // seal lookup shells out to Git, and the overwhelmingly common case reaches none of it.
    // The memo now lives at function scope (see §379.2b above) because a seal is a fact about
    // a PACKET, not about a loop — but the call site is unchanged, and so is the rule that it
    // is reached only where the refusal was about to be raised.
    const dispatchSeal = () => dispatchSealOf(id);
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
          // §7.4: the one lawful absence is the packet's OWN sealed build burning its own
          // retiree. See THE SEALED-BURN EXEMPTION above for why a seal is a receipt and
          // what each of its four fences refuses. The refusal's sentence is unchanged in
          // both refusing branches, so a stale seal reads as the same defect PLUS the
          // reason its seal did not save it.
          const absence = `${at}.symbol is already absent from ${row.path} before ${String(status)}: ${row.symbol}`;
          const seal = dispatchSeal();
          if (!seal) addError(errors, absence);
          else if (!isAncestorOfHead(rootDir, seal.head)) {
            addError(
              errors,
              `${absence} — dispatch seal ${seal.digest} binds HEAD ${seal.head}, which is`
              + " not an ancestor of this tree's HEAD: a stale seal is not a licence.",
            );
          } else {
            addNote(
              `${at}.symbol: retiree burned under seal ${seal.digest}`
              + ` (bound HEAD ${seal.head}): ${row.symbol}`,
            );
          }
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
      /** @type {string[]} */
      const notes = [];
      const result = validatePacketManifest(manifest, {
        rootDir,
        onNote: (note) => { notes.push(note); },
      });
      // Printed BEFORE the verdict, and on both verdicts: a sealed burn is a thing the
      // reader must be told about whether or not something else reddened the same run.
      for (const note of notes.sort(compareCodepoint)) {
        writeLine(stdout, `[implementation-packets] note: ${note}`);
      }
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
