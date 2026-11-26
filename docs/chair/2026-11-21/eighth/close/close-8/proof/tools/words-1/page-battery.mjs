#!/usr/bin/env node
/**
 * READ-25 (CLOSE-7, chain two; RULING-R24 R24-0): THE PAGE CENSUS'S WHOLE BATTERY OVER ANY PLAN. Changes nothing in any tree.
 *
 * `scripts/census/page-census.mjs` births its own corpus only (prefix r2, the census's dials). This runner takes a PLAN FILE
 * (rows `{ seed, size, config }`: the close's C, `read24/make-plan.mjs`, or V, `read24/make-visitor-plan.mjs`) and a TREE,
 * renders each birth through the tree's real OutputContainer as its owner sees it, walked by the tree's own
 * `tests/components/pageCensusWalk.shared.mjs :: walkDossier` (every group, sub-tab and disclosure), and reads it with the
 * tree's own `src/domain/coherence/pageCensusFindings.js` (every row of `PAGE_CENSUS_ROWS`), unchanged
 * (`page-battery.render.census.jsx`: the page census's renderer with the tree and the birth as parameters).
 *
 * Usage (from anywhere; the render runs one vitest per worker with its root at the tree):
 *   node page-battery.mjs --plan=<plan.json> --out=<dir> [--tree=/home/user/wt/lit] [--workers=4]
 *   node page-battery.mjs --grid --out=<dir> [--tree=...]   the page census's twelve grid births (its own birth, no config),
 *                                                            checked row for row against the tree's register `grid` (a proof)
 *   node page-battery.mjs --from=<dir> [--plan=<plan.json>|--grid] [--tree=...]   count a run already rendered into <dir>
 *   node page-battery.mjs --diff=<dirBefore>,<dirAfter>      per birth: rows gained or lost, record hash moved, page hash moved
 *   --views (with a render)                                   also write each birth's printed views (`printed`: 'Group/Tab' → lines)
 *   --strings (with a render; WORDS-1)                        also write every string of the record and of the public projection
 *   --subst=<file.json> (with a render, a measure only)        [[from, to], …] replaced in every string of each born record first
 * Writes `<out>/rows/<seed>.json` (rows, findings, recordHash, pageHash), `<out>/counts.json`, `<out>/table.txt` (per pattern:
 * the count by size, then three seeds) and `<out>/seeds/<row>.txt` (every seed of every pattern), and prints the table.
 * Exit 2 if any birth failed to render; 1 under --grid if a birth's rows differ from the register; 0 otherwise. It is a
 * MEASURE: it banks nothing, and no register is read except under --grid.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RENDER = join(HERE, 'page-battery.render.census.jsx');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @param {string} name @param {string} [fallback] */
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const diff = arg('diff');
if (diff) {
  const [a, b] = diff.split(',').map((d) => join(resolve(d), 'rows'));
  const read = (/** @type {string} */ d) => Object.fromEntries(readdirSync(d).filter((f) => f.endsWith('.json')).map((f) => {
    const r = JSON.parse(readFileSync(join(d, f), 'utf8')); return [r.seed, r];
  }));
  const A = read(a); const B = read(b);
  let rec = 0; let page = 0; let rows = 0;
  for (const seed of Object.keys(A)) {
    const x = A[seed]; const y = B[seed];
    if (!y) { console.log(`${seed}\tMISSING AFTER`); continue; }
    const lost = x.rows.filter((r) => !y.rows.includes(r)); const gained = y.rows.filter((r) => !x.rows.includes(r));
    const rm = x.recordHash !== y.recordHash; const pm = x.pageHash !== y.pageHash;
    rec += +rm; page += +pm; rows += +(lost.length + gained.length > 0);
    if (rm || pm || lost.length || gained.length) console.log(`${seed}\trecord ${rm ? 'MOVED' : 'same'}\tpage ${pm ? 'MOVED' : 'same'}\tlost ${lost.join(',') || '-'}\tgained ${gained.join(',') || '-'}`);
  }
  console.log(`page-battery --diff: ${Object.keys(A).length} births; record moved ${rec}, page moved ${page}, rows moved ${rows}`);
  process.exit(0);
}

const TREE = resolve(arg('tree', '/home/user/wt/lit') ?? '/home/user/wt/lit');
const gridOnly = process.argv.includes('--grid');
const workers = Number(arg('workers', '4'));
const from = arg('from');
const out = resolve(from || arg('out') || '');
if (!from && !arg('out')) { console.error('page-battery: --out=<dir> is required'); process.exit(2); }
const planFile = arg('plan');
/** @type {Array<{ seed: string, size: string, crisis?: string|null, config?: Record<string, unknown> }>} */
const plan = gridOnly
  ? (await import(pathToFileURL(join(TREE, 'tests/components/pageCensusWalk.shared.mjs')).href)).censusGrid()
  : planFile ? JSON.parse(readFileSync(planFile, 'utf8')) : null;
if (!plan) { console.error('page-battery: --plan=<file> or --grid is required'); process.exit(2); }

if (!from) {
  mkdirSync(join(out, 'rows'), { recursive: true });
  writeFileSync(join(out, 'vitest.page-battery.config.mjs'), `import react from '${join(TREE, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${TREE}', plugins: [react()], server: { fs: { allow: ['${TREE}', '${HERE}', '${realpathSync(join(TREE, 'node_modules'))}'] } }, test: { environment: 'node', include: ['${RENDER}'], testTimeout: 300000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
  const t0 = Date.now();
  console.log(`page-battery: rendering ${plan.length} dossiers on ${TREE} (${workers} workers) into ${out}`);
  await Promise.all(Array.from({ length: workers }, (_, w) => {
    const part = join(out, `plan.${w}.json`);
    writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
    return new Promise((done) => {
      const child = spawn('npx', ['vitest', 'run', '--config', join(out, 'vitest.page-battery.config.mjs')], {
        cwd: TREE, env: { ...process.env, PAGE_BATTERY_OUT: join(out, 'rows'), PAGE_BATTERY_PLAN: part, PAGE_BATTERY_TREE: TREE, ...(process.argv.includes('--views') ? { PAGE_BATTERY_VIEWS: '1' } : {}), ...(process.argv.includes('--strings') ? { PAGE_BATTERY_STRINGS: '1' } : {}), ...(arg('subst') ? { PAGE_BATTERY_SUBST: readFileSync(String(arg('subst')), 'utf8') } : {}) }, stdio: ['ignore', 'pipe', 'pipe'],
      });
      /** @type {Buffer[]} */ const log = [];
      child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
      child.on('close', (code) => { writeFileSync(join(out, `render.${w}.log`), Buffer.concat(log)); done(code); });
    });
  }));
  writeFileSync(join(out, 'wall.txt'), `${((Date.now() - t0) / 60000).toFixed(1)} min, ${plan.length} births, ${workers} workers, tree ${TREE}\n`);
}

const rowsDir = join(out, 'rows');
const done = existsSync(rowsDir) ? readdirSync(rowsDir).filter((f) => f.endsWith('.json')) : [];
const bySeed = Object.fromEntries(done.map((f) => { const r = JSON.parse(readFileSync(join(rowsDir, f), 'utf8')); return [r.seed, r]; }));
const missing = plan.filter((p) => !bySeed[p.seed]).map((p) => p.seed);
const { PAGE_CENSUS_ROWS } = await import(pathToFileURL(join(TREE, 'src/domain/coherence/pageCensusFindings.js')).href);

/** @type {Record<string, Record<string, number>>} */ const counts = {};
/** @type {Record<string, string[]>} */ const seeds = {};
let threw = 0; let minViews = Infinity;
for (const p of plan) {
  const r = bySeed[p.seed]; if (!r) continue;
  minViews = Math.min(minViews, r.views);
  if (r.findings.some((f) => /instrument threw/.test(f.detail))) threw++;
  for (const row of r.rows) { (counts[row] ||= {})[p.size] = (counts[row][p.size] || 0) + 1; (seeds[row] ||= []).push(p.seed); }
}
const ids = [...Object.keys(PAGE_CENSUS_ROWS), ...Object.keys(counts).filter((k) => !PAGE_CENSUS_ROWS[k])];
const lines = [`births rendered ${plan.length - missing.length} of ${plan.length}; patterns applied ${Object.keys(PAGE_CENSUS_ROWS).length} (PAGE_CENSUS_ROWS of ${TREE}); fewest views in a birth ${minViews}; births with a check that threw ${threw}`,
  `row        ${SIZES.map((z) => z.slice(0, 5).padStart(6)).join('')}    all  three seeds`];
for (const id of ids) {
  const c = counts[id] || {}; const all = SIZES.reduce((n, z) => n + (c[z] || 0), 0);
  lines.push(`${id.padEnd(10)} ${SIZES.map((z) => String(c[z] || 0).padStart(6)).join('')} ${String(all).padStart(6)}  ${(seeds[id] || []).slice(0, 3).join(' ')}${PAGE_CENSUS_ROWS[id] ? '' : '  (NOT A ROW OF THE BATTERY)'}`);
}
mkdirSync(join(out, 'seeds'), { recursive: true });
for (const [id, list] of Object.entries(seeds)) writeFileSync(join(out, 'seeds', `${id}.txt`), `${list.join('\n')}\n`);
writeFileSync(join(out, 'counts.json'), JSON.stringify({ tree: TREE, births: plan.length, rendered: plan.length - missing.length, missing, counts, seeds }, null, 1));
writeFileSync(join(out, 'table.txt'), `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
if (missing.length) { console.error(`page-battery: ${missing.length} of ${plan.length} births not rendered (first: ${missing.slice(0, 5).join(' ')}); read ${out}/render.*.log`); process.exit(2); }

if (gridOnly) {
  const reg = JSON.parse(readFileSync(join(TREE, 'scripts/census/page-census.register.json'), 'utf8'));
  let bad = 0;
  for (const p of plan) {
    const want = reg.grid[p.seed] || []; const got = bySeed[p.seed].rows;
    const same = JSON.stringify([...want].sort()) === JSON.stringify(got);
    if (!same) bad++;
    console.log(`${same ? 'EQUAL ' : 'DIFFER'} ${p.seed}  register [${[...want].sort().join(',')}]  runner [${got.join(',')}]`);
  }
  console.log(`page-battery --grid: ${plan.length - bad} of ${plan.length} births read exactly the register's grid rows`);
  process.exit(bad ? 1 : 0);
}
