#!/usr/bin/env node
/**
 * RUN (from the repository root): node docs/chair/2026-11-20/content/page/measures/B/run-render.b.mjs [nPerSize=10] [--workers=4]
 * Renders hxd-<size>-0..n-1 (the brief's 300-recipe, first n per size) through render.b.jsx into
 * docs/chair/2026-11-20/content/page/measures/B/views/<seed>.json. NAMES-3's run.mjs driver, adapted: the arm and its
 * vitest config stay in this directory (nothing is copied into the tree); vitest root = the repository root.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const tree = resolve(HERE, '../../../../../../..');
const n = Number(process.argv[2] || 10);
const workers = Number((process.argv.find((a) => a.startsWith('--workers=')) || '=4').split('=')[1]);
const { SIZES } = await import(join(tree, 'tests/components/pageCensusWalk.shared.mjs'));
const plan = SIZES.flatMap((size) => Array.from({ length: n }, (_, i) => ({ seed: `hxd-${size}-${i}`, size })));
const out = join(HERE, 'views'); const tmp = join(HERE, '.run'); mkdirSync(out, { recursive: true }); mkdirSync(tmp, { recursive: true });
const config = join(tmp, 'vitest.pageb.config.mjs');
writeFileSync(config, `import react from '${join(tree, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${tree}', plugins: [react()], test: { environment: 'node', include: ['${join(HERE, 'render.b.jsx')}'], testTimeout: 3600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const go = (env, log) => new Promise((res) => {
  const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: tree, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  const chunks = []; child.stdout.on('data', (d) => chunks.push(d)); child.stderr.on('data', (d) => chunks.push(d));
  child.on('close', (code) => { writeFileSync(log, Buffer.concat(chunks)); res(code); });
});
const codes = await Promise.all(Array.from({ length: workers }, (_, w) => {
  const part = join(tmp, `plan.${w}.json`); writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
  return go({ PAGEB_OUT: out, PAGEB_PLAN: part }, join(tmp, `render.${w}.log`));
}));
console.log(`page-B render: ${plan.length} towns, exit codes ${codes.join(',')}`);
process.exit(codes.some((c) => c !== 0) ? 1 : 0);
