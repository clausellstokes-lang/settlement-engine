#!/usr/bin/env node
/**
 * THE CONFINEMENT CHECK BETWEEN TWO TREES (the seventh chair's CV4; built by NAMES-3, 2026-11-20, from NAMES-2's check).
 * Usage, from the repository root (any checkout; the revisions must be fetched):
 *   node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <rev-before> <rev-after> <workdir> [--words=number|names|none] [--control]
 *
 * For each revision: `git archive <rev>` into `<workdir>/tree-<sha>` (once; reused when present), `node_modules` linked from
 * this checkout (the tool refuses when `package.json` or `package-lock.json` differ between the two revisions, since one
 * install then cannot stand for both), and both corpora born there by `run.mjs <tree> <out> born`: the generator's golden
 * 525 (`goldenCorpus()` through `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`) and the census's 720
 * (`censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)` after `loadGenerationLawPayloads()`). Then
 * `confine.mjs` diffs the two births key by key and prints its table. The births are written once per revision
 * (`<workdir>/born-<sha>/{golden,census}.jsonl`, about 190 MB) and reused. About two minutes per revision on 4 cores.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const [revA, revB, work] = process.argv.slice(2);
if (!revA || !revB || !work) { console.error('usage: trees.mjs <rev-before> <rev-after> <workdir> [--words=…] [--control]'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
const shaA = git('rev-parse', '--short=9', `${revA}^{commit}`); const shaB = git('rev-parse', '--short=9', `${revB}^{commit}`);
if (git('diff', '--name-only', shaA, shaB, '--', 'package.json', 'package-lock.json')) { console.error('trees.mjs: package.json or package-lock.json differ between the revisions; one install cannot stand for both'); process.exit(2); }
const W = resolve(work); mkdirSync(W, { recursive: true });

for (const sha of [shaA, shaB]) {
  const tree = join(W, `tree-${sha}`); const born = join(W, `born-${sha}`);
  if (!existsSync(join(tree, 'package.json'))) {
    mkdirSync(tree, { recursive: true });
    execFileSync('sh', ['-c', `git archive ${sha} | tar -x -C "${tree}"`], { cwd: ROOT, stdio: 'inherit' });
    symlinkSync(join(ROOT, 'node_modules'), join(tree, 'node_modules'));
  }
  if (!existsSync(join(born, 'census.jsonl')) || !existsSync(join(born, 'golden.jsonl'))) {
    console.log(`trees.mjs: births at ${sha}`);
    const r = spawnSync('node', [join(HERE, 'run.mjs'), tree, born, 'born'], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) { console.error(`trees.mjs: the births at ${sha} failed (logs in ${born})`); process.exit(1); }
  }
}
console.log(`trees.mjs: ${shaA} -> ${shaB}`);
const r = spawnSync('node', [join(HERE, 'confine.mjs'), join(W, `born-${shaA}`), join(W, `born-${shaB}`), ...process.argv.slice(5)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
