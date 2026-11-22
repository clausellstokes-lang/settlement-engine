/**
 * Shared evidence primitives for attended release operations.
 *
 * Receipts need two properties that ordinary log files do not:
 *
 *   1. source identity — the Git commit is recorded, and a content fingerprint
 *      covers tracked plus untracked inputs so a dirty-tree rehearsal remains
 *      attributable to the exact bytes that ran;
 *   2. atomic, non-overwriting publication — a completed JSON document appears
 *      at the requested path in one filesystem operation, and an earlier
 *      receipt can never be silently replaced.
 *
 * The helpers deliberately know nothing about databases, HTTP, or credentials.
 * Callers pass only public evidence into `writeJsonReceiptAtomically`.
 */

import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import {
  closeSync,
  existsSync,
  fsyncSync,
  linkSync,
  mkdirSync,
  openSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

/** @param {string | Buffer} value */
export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Run one non-shell Git command and return trimmed stdout.
 *
 * @param {string} root
 * @param {string[]} args
 */
function gitOutput(root, args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

/**
 * Bind evidence to all tracked or untracked files beneath the selected paths.
 * Deleted paths remain represented by the Git status digest even though there
 * are no bytes left to hash.
 *
 * @param {string} root
 * @param {string[]} includePaths
 */
export function readSourceIdentity(root, includePaths) {
  const commit = gitOutput(root, ['rev-parse', 'HEAD']);
  const status = gitOutput(root, [
    'status',
    '--porcelain=v1',
    '--untracked-files=all',
    '--',
    ...includePaths,
  ]);
  const listed = gitOutput(root, [
    'ls-files',
    '-c',
    '-o',
    '--exclude-standard',
    '--',
    ...includePaths,
  ]);
  const files = [...new Set(listed.split('\n').filter(Boolean))].sort();
  const hash = createHash('sha256');

  for (const file of files) {
    const absolute = resolve(root, file);
    if (!existsSync(absolute) || !statSync(absolute).isFile()) continue;
    hash.update(`${file}\0`);
    hash.update(readFileSync(absolute));
    hash.update('\0');
  }
  hash.update(`status\0${status}\0`);

  return Object.freeze({
    commit,
    dirty: status !== '',
    sourceFingerprint: hash.digest('hex'),
    inputCount: files.length,
  });
}

/**
 * Produce a public URL label. Credentials, query values, and fragments are
 * never suitable receipt material.
 *
 * @param {string | URL} value
 */
export function publicUrlLabel(value) {
  const parsed = new URL(value);
  parsed.username = '';
  parsed.password = '';
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString();
}

/**
 * Extract only credential-like URL values for diagnostic redaction. The URL
 * itself remains the primary secret; this covers libraries that echo just the
 * decoded password/token rather than the original connection string.
 *
 * @param {string} value
 */
export function urlCredentialSecrets(value) {
  try {
    const parsed = new URL(value);
    const secrets = [];
    const addSecret = (candidate) => {
      if (candidate && !secrets.includes(candidate)) secrets.push(candidate);
    };
    if (parsed.password) {
      // URL.password preserves percent encoding. Keep both forms because child
      // processes and client libraries are inconsistent about which one they
      // echo in an error.
      addSecret(parsed.password);
      try {
        addSecret(decodeURIComponent(parsed.password));
      } catch {
        // The still-encoded password remains protected if decoding is invalid.
      }
    }
    for (const [name, candidate] of parsed.searchParams) {
      if (/(password|passwd|token|secret|api.?key)/i.test(name) && candidate) {
        addSecret(candidate);
      }
    }
    return secrets;
  } catch {
    return [];
  }
}

/**
 * Redact exact secret values plus credential-bearing URLs from a diagnostic.
 * This is a last-line defense; callers should still avoid collecting bodies or
 * command output that is not needed for a decision.
 *
 * @param {unknown} value
 * @param {string[]} [secrets]
 */
export function redactDiagnostic(value, secrets = []) {
  let text = value instanceof Error ? value.message : String(value ?? '');
  for (const secret of secrets.filter(Boolean).sort((a, b) => b.length - a.length)) {
    text = text.split(secret).join('[REDACTED]');
  }
  return text
    .replace(
      /\b(postgres(?:ql)?):\/\/[^\s/@:]+(?::[^\s/@]*)?@/gi,
      '$1://[REDACTED]@',
    )
    .replace(/\b(Bearer|apikey)\s+[A-Za-z0-9._~+/=-]+/gi, '$1 [REDACTED]')
    .replace(
      /([?&](?:password|passwd|token|secret|api.?key|authorization)=)[^&#\s]*/gi,
      '$1[REDACTED]',
    )
    .slice(0, 2_000);
}

/**
 * Write a receipt without an overwrite race.
 *
 * The temporary file is fsynced, then hard-linked into its final name. `link`
 * is atomic and fails with EEXIST if the destination already exists; unlike
 * `rename`, it cannot replace prior evidence. The temporary link is removed
 * after publication.
 *
 * @param {string} file
 * @param {unknown} value
 */
export function writeJsonReceiptAtomically(file, value) {
  const absolute = resolve(file);
  mkdirSync(dirname(absolute), { recursive: true });
  const temporary = `${absolute}.${process.pid}.${randomUUID()}.tmp`;
  let descriptor;

  try {
    descriptor = openSync(temporary, 'wx', 0o600);
    writeFileSync(
      descriptor,
      `${JSON.stringify(value, null, 2)}\n`,
      { encoding: 'utf8' },
    );
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    linkSync(temporary, absolute);
  } finally {
    if (descriptor != null) closeSync(descriptor);
    if (existsSync(temporary)) unlinkSync(temporary);
  }

  return absolute;
}

/** @param {string} root @param {string} file */
export function receiptLabel(root, file) {
  const label = relative(root, file);
  return label.startsWith('..') ? file : label;
}
