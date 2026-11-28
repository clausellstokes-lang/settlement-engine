#!/usr/bin/env node
// PLACE-1 MEASURE, safetyDesc, section 0: the PLAYER view of the same walk. The confinement tool's renderer
// (docs/chair/2026-11-20/content/tools/confinement/render.census.jsx) copied, unchanged but for one prop:
// `<OutputContainer settlement={town} playerView />`. Writes `<out>/views/<seed>.json`, the same shape.
// Usage (from the repository root): node docs/chair/2026-11-20/content/place/tools/safetyDesc/render-player.mjs <repo> <out> <seed,seed,...>
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const [tree, out] = process.argv.slice(2, 4).map((a) => resolve(a));
const seeds = String(process.argv[4] || '').split(',').filter(Boolean);
const RUN = join(tree, '.sd-player-run');
mkdirSync(RUN, { recursive: true }); mkdirSync(join(out, 'views'), { recursive: true });
const src = readFileSync(join(HERE, '../../../tools/confinement/render.census.jsx'), 'utf8');
const patched = src.replace('<OutputContainer settlement={town} />', '<OutputContainer settlement={town} playerView />');
if (patched === src) { console.error('render-player: the renderer\'s OutputContainer line was not found'); process.exit(2); }
writeFileSync(join(RUN, 'render.player.census.jsx'), patched);
const { censusPlan } = await import(join(tree, 'tests/components/pageCensusWalk.shared.mjs'));
writeFileSync(join(RUN, 'plan.json'), JSON.stringify(seeds.map((s) => censusPlan('r2').find((r) => r.seed === s)).filter(Boolean)));
const config = join(RUN, 'vitest.config.mjs');
writeFileSync(config, `import react from '${join(tree, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${tree}', plugins: [react()], test: { environment: 'node', include: ['${join(RUN, 'render.player.census.jsx')}'], testTimeout: 3600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const code = await new Promise((res) => {
  const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: tree, env: { ...process.env, NAMES3_OUT: join(out, 'views'), NAMES3_PLAN: join(RUN, 'plan.json') }, stdio: ['ignore', 'pipe', 'pipe'] });
  const chunks = []; child.stdout.on('data', (d) => chunks.push(d)); child.stderr.on('data', (d) => chunks.push(d));
  child.on('close', (c) => { writeFileSync(join(out, 'render.player.log'), Buffer.concat(chunks)); res(c); });
});
rmSync(RUN, { recursive: true, force: true });
console.log(`render-player: exit ${code}`);
process.exit(code);
