#!/usr/bin/env node
/**
 * PEOPLE-2 seat M5 (2026-11-20): the driver of the rendered arm (NAMES-3's run.mjs pattern).
 * Usage: node m5-render.mjs <tree> <out> [--n=100] [--workers=4] [--seeds=a,b]
 *   <tree>  a checkout of the revision under measure with node_modules linked (e.g. `git archive <rev> | tar -x -C <tree>`)
 *   <out>   where `<out>/views/<seed>.json` land (one per place) and the worker logs
 * Copies m5-render.census.jsx into `<tree>/.m5-run/`, runs it through vitest with `<tree>` as root, removes the copy.
 * Prints one count line. Read the per-seed files with m5-measure.mjs.
 */
import { spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const [tree, out] = process.argv.slice(2, 4).map((a) => resolve(a));
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `=${d}`).split('=').slice(1).join('=');
const workers = Number(arg('workers', '4'));
const n = Number(arg('n', '100'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const only = arg('seeds', '') ? arg('seeds', '').split(',') : null;
const plan = only
  ? only.map((seed) => ({ seed, size: seed.split('-')[1] }))
  : SIZES.flatMap((size) => Array.from({ length: n }, (_, i) => ({ seed: `hxd-${size}-${i}`, size })));
const RUN = join(tree, '.m5-run');
mkdirSync(RUN, { recursive: true }); mkdirSync(join(out, 'views'), { recursive: true });
copyFileSync(join(HERE, 'm5-render.census.jsx'), join(RUN, 'm5-render.census.jsx'));
const config = join(RUN, 'vitest.m5.config.mjs');
writeFileSync(config, `import react from '${join(tree, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${tree}', plugins: [react()], test: { environment: 'node', include: ['${join(RUN, 'm5-render.census.jsx')}'], testTimeout: 3600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const go = (env, log) => new Promise((res) => {
  const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: tree, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  const chunks = []; child.stdout.on('data', (d) => chunks.push(d)); child.stderr.on('data', (d) => chunks.push(d));
  child.on('close', (code) => { writeFileSync(log, Buffer.concat(chunks)); res(code); });
});
const codes = await Promise.all(Array.from({ length: workers }, (_, w) => {
  const part = join(out, `plan.${w}.json`); writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
  return go({ M5_OUT: join(out, 'views'), M5_PLAN: part }, join(out, `render.${w}.log`));
}));
rmSync(RUN, { recursive: true, force: true });
console.log(`m5 render: ${plan.length} places planned · exit codes ${codes.join(',')}`);
process.exit(codes.some((c) => c !== 0) ? 1 : 0);
