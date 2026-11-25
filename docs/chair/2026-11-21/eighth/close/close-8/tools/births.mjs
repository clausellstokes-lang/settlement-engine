#!/usr/bin/env node
/**
 * BIRTH-1: births a plan on a tree in N workers through `births.census.jsx` and joins the parts into one jsonl.
 *   node births.mjs --tree=<abs tree> --plan=<plan.json> --out=<file.jsonl> [--measure=<abs .mjs>] [--workers=4]
 * Exit 2 if a part is missing or short. A MEASURE: it changes nothing in any tree.
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const TREE = resolve(arg('tree'));
const plan = JSON.parse(readFileSync(arg('plan'), 'utf8'));
const out = resolve(arg('out'));
const measure = arg('measure') ? resolve(arg('measure')) : '';
const workers = Number(arg('workers', '4'));
const work = `${out}.parts`; mkdirSync(work, { recursive: true });
writeFileSync(join(work, 'vitest.births.config.mjs'), `import react from '${join(TREE, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${TREE}', plugins: [react()], server: { fs: { allow: ['${TREE}', '${HERE}', '${realpathSync(join(TREE, 'node_modules'))}'] } }, test: { environment: 'node', include: ['${join(HERE, 'births.census.jsx')}'], testTimeout: 7200000, pool: 'forks', fileParallelism: false } };
`);
const t0 = Date.now();
await Promise.all(Array.from({ length: workers }, (_, w) => {
  const part = join(work, `plan.${w}.json`);
  writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
  return new Promise((done) => {
    const child = spawn('npx', ['vitest', 'run', '--config', join(work, 'vitest.births.config.mjs')], {
      cwd: TREE, env: { ...process.env, BIRTHS_TREE: TREE, BIRTHS_PLAN: part, BIRTHS_OUT: join(work, `out.${w}.jsonl`), BIRTHS_MEASURE: measure }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const log = []; child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
    child.on('close', (code) => { writeFileSync(join(work, `run.${w}.log`), Buffer.concat(log)); done(code); });
  });
}));
const lines = [];
for (let w = 0; w < workers; w++) { const f = join(work, `out.${w}.jsonl`); if (existsSync(f)) lines.push(...readFileSync(f, 'utf8').split('\n').filter(Boolean)); }
const bySeed = new Map(lines.map((l) => [JSON.parse(l).seed, l]));
const ordered = plan.map((p) => bySeed.get(p.key ?? p.seed)).filter(Boolean);
writeFileSync(out, `${ordered.join('\n')}\n`);
console.log(`births: ${ordered.length} of ${plan.length} on ${TREE} in ${((Date.now() - t0) / 60000).toFixed(1)} min -> ${out}`);
process.exit(ordered.length === plan.length ? 0 : 2);
