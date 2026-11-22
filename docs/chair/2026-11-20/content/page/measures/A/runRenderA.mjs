#!/usr/bin/env node
// RUN (from the repository root): node docs/chair/2026-11-20/content/page/measures/A/runRenderA.mjs "$PWD" 5 > docs/chair/2026-11-20/content/page/measures/A/renderA.out.txt 2>&1
// Runs renderA.census.jsx through vitest (root = the tree), RENDER_N towns a size, then summarises renderA.jsonl.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const [tree, n = '5'] = process.argv.slice(2);
const jsonl = join(HERE, 'renderA.jsonl'); if (existsSync(jsonl)) rmSync(jsonl);
const config = join(HERE, 'vitest.renderA.config.mjs');
writeFileSync(config, `import react from '${join(tree, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${tree}', plugins: [react()], test: { environment: 'node', include: ['${join(HERE, 'renderA.census.jsx')}'], testTimeout: 3600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
const r = spawnSync('npx', ['vitest', 'run', '--config', config], { cwd: tree, env: { ...process.env, MEASUREA_OUT: jsonl, RENDER_N: n }, encoding: 'utf8', maxBuffer: 1 << 28 });
writeFileSync(join(HERE, 'renderA.vitest.log'), (r.stdout || '') + (r.stderr || ''));
console.log(`vitest exit ${r.status}`);
const rows = existsSync(jsonl) ? readFileSync(jsonl, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const T = rows.flatMap((x) => x.tensions); const S = T.flatMap((t) => t.sides); const A = rows.flatMap((x) => x.arrival);
console.log(`towns rendered: ${rows.length} (${n} a size)`);
console.log(`tension descriptions printed verbatim on some view: ${T.filter((t) => t.descOn.length).length}/${T.length}; views: ${[...new Set(T.flatMap((t) => t.descOn))].join(', ')}`);
console.log(`tension sides printed verbatim: ${S.filter((s) => s.on).length}/${S.length}`);
console.log(`arrival sentences printed verbatim: ${A.filter((a) => a.on.length).length}/${A.length}; views: ${[...new Set(A.flatMap((a) => a.on))].join(', ')}; public arrival == record arrival in ${rows.filter((x) => x.publicArrivalSame).length}/${rows.length}`);
for (const t of T.filter((t) => !t.descOn.length)) console.log(`  NOT FOUND tension: ${t.type}: ${t.desc}`);
for (const s of S.filter((s) => !s.on)) console.log(`  NOT FOUND side: ${s.f}`);
for (const a of A.filter((a) => !a.on.length)) console.log(`  NOT FOUND arrival: ${a.s}`);
process.exit(r.status === 0 ? 0 : 1);
