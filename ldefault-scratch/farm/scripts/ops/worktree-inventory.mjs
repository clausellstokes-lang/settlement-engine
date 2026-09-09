#!/usr/bin/env node
/**
 * Read-only Git worktree inventory.
 *
 * The repository has accumulated many integration and audit worktrees. Removing
 * one safely requires three independent facts: it is not the current worktree,
 * its filesystem is clean, and its HEAD is reachable from the chosen preserved
 * base. This script reports those facts; it deliberately has no delete mode.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function readArg(argv, name, fallback = null) {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 && argv[index + 1] != null ? argv[index + 1] : fallback;
}

export function parseWorktreePorcelain(text) {
  const records = [];
  let record = null;
  for (const line of String(text || '').split(/\r?\n/)) {
    if (line.startsWith('worktree ')) {
      if (record) records.push(record);
      record = {
        path: line.slice('worktree '.length),
        head: null,
        branch: null,
        bare: false,
        detached: false,
        prunable: false,
      };
      continue;
    }
    if (!record || !line) continue;
    if (line.startsWith('HEAD ')) record.head = line.slice('HEAD '.length);
    else if (line.startsWith('branch ')) {
      record.branch = line.slice('branch '.length).replace(/^refs\/heads\//, '');
    } else if (line === 'bare') record.bare = true;
    else if (line === 'detached') record.detached = true;
    else if (line.startsWith('prunable')) record.prunable = true;
  }
  if (record) records.push(record);
  return records;
}

function refExists(ref) {
  const result = spawnSync('git', ['rev-parse', '--verify', '--quiet', ref], {
    cwd: ROOT,
    stdio: 'ignore',
    shell: false,
  });
  return result.status === 0;
}

function defaultBase() {
  for (const candidate of ['master', 'main', 'origin/master', 'origin/main']) {
    if (refExists(candidate)) return candidate;
  }
  return 'HEAD';
}

function isAncestor(commit, base) {
  if (!commit) return false;
  const result = spawnSync('git', ['merge-base', '--is-ancestor', commit, base], {
    cwd: ROOT,
    stdio: 'ignore',
    shell: false,
  });
  return result.status === 0;
}

function inspect(record, base, currentPath) {
  let clean = null;
  let inspectionError = null;
  let commitAt = null;
  if (!record.prunable && !record.bare) {
    try {
      clean = git([
        '-C',
        record.path,
        'status',
        '--porcelain=v1',
        '--untracked-files=normal',
      ]) === '';
      commitAt = git([
        '-C',
        record.path,
        'show',
        '-s',
        '--format=%cI',
        record.head || 'HEAD',
      ]) || null;
    } catch (error) {
      inspectionError = error instanceof Error ? error.message : String(error);
    }
  }
  const current = resolve(record.path) === resolve(currentPath);
  const mergedIntoBase = isAncestor(record.head, base);
  let disposition = 'keep';
  if (record.prunable) disposition = 'review-prunable-metadata';
  else if (current) disposition = 'keep-current';
  else if (clean === false) disposition = 'keep-dirty';
  else if (!mergedIntoBase) disposition = 'preserve-unmerged';
  else if (clean === true) disposition = 'candidate-for-manual-removal';

  return {
    ...record,
    current,
    clean,
    mergedIntoBase,
    commitAt,
    disposition,
    inspectionError,
  };
}

function writeJsonAtomically(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  renameSync(temporary, path);
}

/**
 * Assemble the deterministic part of an inventory receipt from already
 * inspected worktrees. Keeping this pure lets the unit suite verify receipt
 * shape without making its runtime proportional to every worktree on the host.
 * The CLI still performs the complete live inspection below.
 */
export function buildWorktreeInventoryReceipt({
  base,
  baseCommit,
  currentPath,
  worktrees,
  generatedAt = new Date().toISOString(),
}) {
  const digest = createHash('sha256')
    .update(JSON.stringify(worktrees.map((entry) => ({
      path: entry.path,
      head: entry.head,
      branch: entry.branch,
      clean: entry.clean,
      mergedIntoBase: entry.mergedIntoBase,
      disposition: entry.disposition,
    }))))
    .digest('hex');
  return {
    schemaVersion: 1,
    kind: 'git_worktree_inventory',
    repository: ROOT,
    base,
    baseCommit,
    currentPath,
    counts: worktrees.reduce((counts, entry) => {
      counts.total += 1;
      counts[entry.disposition] = (counts[entry.disposition] || 0) + 1;
      return counts;
    }, { total: 0 }),
    worktrees,
    digest,
    generatedAt,
    destructiveActionTaken: false,
  };
}

export function buildWorktreeInventory({ base = defaultBase() } = {}) {
  const currentPath = git(['rev-parse', '--show-toplevel']);
  const records = parseWorktreePorcelain(git(['worktree', 'list', '--porcelain']));
  const worktrees = records.map((record) => inspect(record, base, currentPath));
  return buildWorktreeInventoryReceipt({
    base,
    baseCommit: git(['rev-parse', base]),
    currentPath,
    worktrees,
  });
}

export function runWorktreeInventory(argv = process.argv.slice(2)) {
  const base = String(readArg(argv, 'base', defaultBase()));
  if (!refExists(base)) throw new Error(`Unknown preserved base ref "${base}".`);
  const inventory = buildWorktreeInventory({ base });
  const output = readArg(argv, 'output');
  if (output) writeJsonAtomically(resolve(String(output)), inventory);
  if (argv.includes('--json') || !output) {
    process.stdout.write(`${JSON.stringify(inventory, null, 2)}\n`);
  } else {
    process.stdout.write(
      `Worktrees: ${inventory.counts.total}; digest ${inventory.digest}; no removals performed.\n`,
    );
  }
  return inventory;
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try {
    runWorktreeInventory();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
