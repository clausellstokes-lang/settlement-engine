#!/usr/bin/env node
/**
 * PAGE-12's COPY (CAUSES-PARITY-2, B), unchanged but for this line: `--corpus=hxd` births the 900 (born.census.js here).
 * NAMES-3's driver. Usage: node run.mjs <tree> <out> born|render [--workers=4] [--corpus=golden|census|both]
 * Copies the arm into `<tree>/.names3-run/`, runs it through vitest with `<tree>` as root, removes the copy.
 * born: `<out>/golden.jsonl`, `<out>/census.jsonl`. render: `<out>/views/<seed>.json` for the census's 720.
 */
import { spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const [tree, out, mode] = process.argv.slice(2).map((a, i) => (i < 2 ? resolve(a) : a));
const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `=${d}`).split('=')[1];
const workers = Number(arg('workers', '4'));
const RUN = join(tree, '.names3-run');
mkdirSync(RUN, { recursive: true }); mkdirSync(out, { recursive: true });
const file = mode === 'born' ? 'born.census.js' : 'render.census.jsx';
copyFileSync(join(HERE, file), join(RUN, file));
const config = join(RUN, 'vitest.names3.config.mjs');
writeFileSync(config, `import react from '${join(tree, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${tree}', plugins: [react()], test: { environment: 'node', include: ['${join(RUN, file)}'], testTimeout: 3600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const go = (env, log) => new Promise((res) => {
  const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: tree, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  const chunks = []; child.stdout.on('data', (d) => chunks.push(d)); child.stderr.on('data', (d) => chunks.push(d));
  child.on('close', (code) => { writeFileSync(log, Buffer.concat(chunks)); res(code); });
});
let codes;
if (mode === 'born') {
  const corpus = arg('corpus', 'both');
  codes = await Promise.all((corpus === 'both' ? ['golden', 'census'] : [corpus]).map((c) => go({ NAMES3_OUT: out, NAMES3_CORPUS: c }, join(out, `born.${c}.log`))));
} else {
  const { censusPlan } = await import(join(tree, 'tests/components/pageCensusWalk.shared.mjs'));
  // --seeds=a,b,c renders those rows only, in that order (a check of one town; the first row a worker renders is cold)
  const only = arg('seeds', '') ? arg('seeds', '').split(',') : null;
  const plan = only ? only.map((seed) => censusPlan('r2').find((r) => r.seed === seed)).filter(Boolean) : censusPlan('r2'); mkdirSync(join(out, 'views'), { recursive: true });
  codes = await Promise.all(Array.from({ length: workers }, (_, w) => {
    const part = join(out, `plan.${w}.json`); writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
    return go({ NAMES3_OUT: join(out, 'views'), NAMES3_PLAN: part }, join(out, `render.${w}.log`));
  }));
}
rmSync(RUN, { recursive: true, force: true });
console.log(`names3 ${mode}: exit codes ${codes.join(',')}`);
process.exit(codes.some((c) => c !== 0) ? 1 : 0);
