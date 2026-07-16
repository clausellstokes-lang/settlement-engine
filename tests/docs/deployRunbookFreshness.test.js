/**
 * Freshness walker for docs/DEPLOY.md — the first-cutover runbook.
 *
 * DEPLOY.md is on the pre-authorized launch path, and its two volatile facts —
 * the edge-function deploy list and the current migration head — do NOT
 * self-correct: a stale function list ships a cutover missing whole endpoints
 * (this is exactly how the doc rotted to "10 functions" while disk had 16, and
 * omitted checkout verification, account operations, and auth recovery). The
 * architectureFreshness idiom applied here: derive both facts from the
 * filesystem and fail the gate the moment the runbook drifts, so the prose can
 * only ever be wrong loudly.
 *
 * Mirrors scripts/deploy.sh's discovery rule: a deployable function is any
 * supabase/functions/<name> dir that is not _shared and has an index.ts entry.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const deployMd = readFileSync(resolve(repoRoot, 'docs/DEPLOY.md'), 'utf8');

/** Deployable function dirs, by the same rule scripts/deploy.sh uses. */
function deployableFunctions() {
  const dir = resolve(repoRoot, 'supabase/functions');
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !name.startsWith('_'))
    .filter((name) => existsSync(resolve(dir, name, 'index.ts')))
    .sort();
}

/** The highest-numbered migration file's basename (the current head). */
function migrationHeadFile() {
  const dir = resolve(repoRoot, 'supabase/migrations');
  const files = readdirSync(dir).filter((f) => /^\d+_.*\.sql$/.test(f));
  files.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  return files[files.length - 1];
}

describe('DEPLOY.md freshness — the runbook derives from the filesystem', () => {
  it('names every deployable edge function (a first cutover deploys all of them)', () => {
    const functions = deployableFunctions();
    expect(functions.length, 'expected to discover edge functions').toBeGreaterThan(0);
    const missing = functions.filter((fn) => !deployMd.includes(fn));
    expect(
      missing,
      `docs/DEPLOY.md omits function dir(s): ${missing.join(', ')} — a first cutover ` +
        `following the runbook would ship without them. Add each to the deploy list.`,
    ).toEqual([]);
  });

  it('states the correct function count', () => {
    const n = deployableFunctions().length;
    // The runbook asserts a "<N> deployable functions" total; it must match disk.
    const claim = deployMd.match(/\*\*(\d+) deployable functions\*\*/);
    expect(claim, 'docs/DEPLOY.md should state the deployable-function count').toBeTruthy();
    expect(Number(claim[1])).toBe(n);
  });

  it('names the current migration head file', () => {
    const head = migrationHeadFile();
    expect(head, 'expected to find a migration head').toBeTruthy();
    expect(
      deployMd.includes(head),
      `docs/DEPLOY.md must name the current migration head (\`${head}\`). ` +
        `When a migration is added, update the "Current migration head" line.`,
    ).toBe(true);
  });
});
