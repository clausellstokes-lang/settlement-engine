#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/page/measures/THIN/run-render.thin.mjs 10 > docs/chair/2026-11-20/content/page/measures/THIN/render.out.txt 2>&1
 * Renders hxd-<size>-0..n-1 through render.thin.jsx (ONE vitest process, serial) into ./views/<seed>.json.
 * The vitest config lives in ./.run (nothing under tests/); vitest root = the repository root.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const tree = resolve(HERE, '../../../../../../..');
const n = Number(process.argv[2] || 10);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const plan = SIZES.flatMap((size) => Array.from({ length: n }, (_, i) => ({ seed: `hxd-${size}-${i}`, size })));
const out = join(HERE, 'views'); const tmp = join(HERE, '.run'); mkdirSync(out, { recursive: true }); mkdirSync(tmp, { recursive: true });
const config = join(tmp, 'vitest.pagethin.config.mjs');
writeFileSync(config, `import react from '${join(tree, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${tree}', plugins: [react()], test: { environment: 'node', include: ['${join(HERE, 'render.thin.jsx')}'], testTimeout: 3600000, pool: 'forks', maxWorkers: 1, fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const part = join(tmp, 'plan.json'); writeFileSync(part, JSON.stringify(plan));
const log = join(tmp, 'render.log');
const code = await new Promise((res) => {
  const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: tree, env: { ...process.env, PAGETHIN_OUT: out, PAGETHIN_PLAN: part }, stdio: ['ignore', 'pipe', 'pipe'] });
  const chunks = []; child.stdout.on('data', (d) => chunks.push(d)); child.stderr.on('data', (d) => chunks.push(d));
  child.on('close', (c) => { writeFileSync(log, Buffer.concat(chunks)); res(c); });
});
console.log(`page-THIN render: ${plan.length} towns planned, vitest exit ${code}, log ${log}`);
process.exit(code);
