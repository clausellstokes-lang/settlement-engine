// Runs the goals-i13 census over a plan on a tree in N workers (as births.mjs does) and joins the parts.
//   node gi13-run.mjs --tree=<abs> --plan=<plan.json> --out=<file.jsonl> [--workers=4]
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const TREE = resolve(arg('tree')); const plan = JSON.parse(readFileSync(arg('plan'), 'utf8')); const out = resolve(arg('out'));
const workers = Number(arg('workers', '4'));
const CENSUS = '/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/tools/goals-i13.census.jsx';
const work = `${out}.parts`; mkdirSync(work, { recursive: true });
writeFileSync(join(work, 'vitest.gi13.config.mjs'), `import react from '${join(TREE, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${TREE}', plugins: [react()], server: { fs: { allow: ['${TREE}', '/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/tools', '${realpathSync(join(TREE, 'node_modules'))}'] } }, test: { environment: 'node', include: ['${CENSUS}'], testTimeout: 7200000, pool: 'forks', fileParallelism: false } };
`);
const t0 = Date.now();
const codes = await Promise.all(Array.from({ length: workers }, (_, w) => {
  const part = join(work, `plan.${w}.json`);
  writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
  return new Promise((done) => {
    const child = spawn('npx', ['vitest', 'run', '--config', join(work, 'vitest.gi13.config.mjs')], { cwd: TREE, env: { ...process.env, GI_TREE: TREE, GI_PLAN: part, GI_OUT: join(work, `out.${w}.jsonl`) }, stdio: ['ignore', 'pipe', 'pipe'] });
    const log = []; child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
    child.on('close', (code) => { writeFileSync(join(work, `run.${w}.log`), Buffer.concat(log)); done(code); });
  });
}));
const lines = [];
for (let w = 0; w < workers; w++) { const f = join(work, `out.${w}.jsonl`); if (existsSync(f)) lines.push(...readFileSync(f, 'utf8').split('\n').filter(Boolean)); }
const bySeed = new Map(lines.map((l) => [JSON.parse(l).seed, l]));
const ordered = plan.map((p) => bySeed.get(p.seed)).filter(Boolean);
writeFileSync(out, `${ordered.join('\n')}\n`);
const rows = ordered.map((l) => JSON.parse(l));
console.log(`gi13: ${ordered.length} of ${plan.length} on ${TREE} in ${((Date.now() - t0) / 60000).toFixed(1)} min; codes ${codes}; compared ${rows.reduce((n, r) => n + r.compared, 0)}; faults ${rows.reduce((n, r) => n + r.faults.length, 0)} in ${rows.filter((r) => r.faults.length).length} towns`);
process.exit(ordered.length === plan.length ? 0 : 2);
