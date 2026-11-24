#!/usr/bin/env node
/**
 * HOOKS-CURES A (PAGE-10's brief, 2026-11-20): the script that wrote `trouble-hooks-pools.snapshot.json`, never typed by
 * hand. It reads `src/data/troubleHooks.js :: TROUBLE_HOOKS` AS IT STOOD AT A REVISION (the commit A starts on, where
 * each kind's table still held every line of its pool, the template's own lines copied in) and writes each kind's pool,
 * element for element (text, needs, excludes) and in order: a line's index is the presumption ledger's line id.
 *
 * Usage, from the repository root: node tests/fixtures/troubleHooksPoolsSnapshot.mjs <rev> > tests/fixtures/trouble-hooks-pools.snapshot.json
 * Written from 7903d6bb7. The data file imports nothing, so its text at <rev> is imported from a temporary copy.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const rev = process.argv[2];
if (!rev) { console.error('usage: troubleHooksPoolsSnapshot.mjs <rev>'); process.exit(2); }
const sha = execFileSync('git', ['rev-parse', '--short=9', `${rev}^{commit}`], { encoding: 'utf8' }).trim();
const dir = mkdtempSync(join(tmpdir(), 'trouble-hooks-'));
try {
  const file = join(dir, 'troubleHooks.js');
  writeFileSync(file, execFileSync('git', ['show', `${sha}:src/data/troubleHooks.js`], { encoding: 'utf8' }));
  const { TROUBLE_HOOKS } = await import(pathToFileURL(file).href);
  const pools = Object.fromEntries(Object.entries(TROUBLE_HOOKS).map(([kind, pool]) => [kind, pool.map((row) => ({
    text: row.text, needs: [...row.needs], ...(row.excludes ? { excludes: [...row.excludes] } : {}),
  }))]));
  process.stdout.write(`${JSON.stringify({ from: sha, source: 'src/data/troubleHooks.js :: TROUBLE_HOOKS', pools }, null, 2)}\n`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
