#!/usr/bin/env node
/**
 * scripts/census/page-census.mjs — THE RENDERED-DOSSIER ARM (W2-A-LEAVES, 2026-11-12; the second wave's charter
 * §0 item 6 and the amendment of record 287), beside the repetition guard's census (pool-dominance.mjs).
 *
 * THE CLASS IT GUARDS. Forty-five reviewed merges added nine kinds of contradiction to the dossier because each
 * lane was read for its own claims and nothing read the finished page. This arm reads the finished page: it births
 * a corpus, renders every dossier through the real OutputContainer as its owner sees it (every group, every
 * sub-tab, every disclosure opened), and runs every page check of the census (src/domain/coherence/
 * pageCensusFindings.js, registered in the page battery as `page-census`) over it.
 *
 * THE CORPUS is the second wave's census's: 720 births in six sizes, calm and under each of fifteen forced crises
 * (tests/components/pageCensusWalk.shared.mjs :: censusPlan, prefix `r2`). `--seed-prefix=<p>` births the same
 * plan under a prefix nobody tuned to (THE FRESH-CORPUS DOOR; the release bar reads a thousand or more:
 * `--scale=2` is 1,440).
 *
 * THE REGISTER (`page-census.register.json`): one row per pattern, with the census's two columns (master before
 * the integration, db832c892; the integration's tip, 8866a0ddd) and the count BANKED on the corpus, which only
 * falls. EVERY ROW'S BAR IS ZERO. The suite's walker (tests/components/pageCensus.walker.test.jsx) holds a fixed
 * grid of twelve births to the register's `grid` rows exactly; this script holds the 720.
 *
 * Usage (read-only unless --shrink):
 *   node scripts/census/page-census.mjs [--workers=4] [--out=<dir>]     the banked corpus against the register
 *   node scripts/census/page-census.mjs --seed-prefix=<p> [--scale=k]   a fresh corpus against the bar (zero)
 *   node scripts/census/page-census.mjs --limit=<n> [--seed-prefix=<p>]  a spread of about n births (a smoke run; never banked)
 *   node scripts/census/page-census.mjs --from=<dir>                    count a run already rendered into <dir>
 *   node scripts/census/page-census.mjs --grid [--shrink]                the suite's twelve births only; --shrink lowers their
 *                                                                       grid rows (refused if any rose)
 *   node scripts/census/page-census.mjs --shrink                        THE DOOR: lower each banked count that fell;
 *                                                                       refused (nothing written) if any row rose
 * Exit 1 on a row above its banked count (banked corpus) or above its bar (a fresh corpus); 0 otherwise.
 * Measured: about 15–20 minutes for the 720 with four workers on a 4-core container.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BANKED_PREFIX, censusGrid, censusPlan } from '../../tests/components/pageCensusWalk.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER = join(ROOT, 'scripts/census/page-census.register.json');
const RENDER = join(ROOT, 'scripts/census/page-census.render.census.jsx');
/** @param {string} name @param {string} [fallback] */
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const prefix = arg('seed-prefix', BANKED_PREFIX) ?? BANKED_PREFIX;
const scale = Number(arg('scale', '1'));
const workers = Number(arg('workers', '4'));
const gridOnly = process.argv.includes('--grid');
const banked = prefix === BANKED_PREFIX && scale === 1 && !gridOnly && !process.argv.some((a) => a.startsWith('--limit='));
const shrink = process.argv.includes('--shrink');
if (shrink && !banked && !gridOnly) { console.error('page-census: --shrink reads the banked corpus (or --grid) only'); process.exit(2); }

const limit = Number(arg('limit', '0'));
const plan = gridOnly ? censusGrid() : limit > 0 ? censusPlan(prefix, scale).filter((_, i) => i % Math.ceil(720 * scale / limit) === 0) : censusPlan(prefix, scale);
const from = arg('from');
const out = from || arg('out') || mkdtempSync(join(tmpdir(), 'page-census-'));

if (!from) {
  mkdirSync(join(out, 'rows'), { recursive: true });
  writeFileSync(join(out, 'vitest.page-census.config.mjs'), `import react from '${join(ROOT, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${ROOT}', plugins: [react()], test: { environment: 'node', include: ['${RENDER}'], testTimeout: 300000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
  console.log(`page-census: rendering ${plan.length} dossiers (${workers} workers) into ${out}`);
  await Promise.all(Array.from({ length: workers }, (_, w) => {
    const part = join(out, `plan.${w}.json`);
    writeFileSync(part, JSON.stringify(plan.filter((_, i) => i % workers === w)));
    return new Promise((resolve) => {
      const child = spawn('npx', ['vitest', 'run', '--config', join(out, 'vitest.page-census.config.mjs')], {
        cwd: ROOT, env: { ...process.env, PAGE_CENSUS_OUT: join(out, 'rows'), PAGE_CENSUS_PLAN: part }, stdio: ['ignore', 'pipe', 'pipe'],
      });
      /** @type {Buffer[]} */ const log = [];
      child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
      child.on('close', (code) => { writeFileSync(join(out, `render.${w}.log`), Buffer.concat(log)); resolve(code); });
    });
  }));
}

const rowsDir = join(out, 'rows');
const done = existsSync(rowsDir) ? readdirSync(rowsDir).filter((f) => f.endsWith('.json')) : [];
if (done.length !== plan.length) { console.error(`page-census: ${done.length} of ${plan.length} dossiers rendered; read ${out}/render.*.log`); process.exit(2); }
/** @type {Record<string, number>} */ const counts = {};
/** @type {Record<string, string[]>} */ const examples = {};
for (const f of done) {
  const r = JSON.parse(readFileSync(join(rowsDir, f), 'utf8'));
  for (const row of r.rows) { counts[row] = (counts[row] || 0) + 1; (examples[row] ||= []).length < 3 && examples[row].push(r.seed); }
}
const reg = JSON.parse(readFileSync(REGISTER, 'utf8'));
if (gridOnly) {
  /** @type {string[]} */ const rose = []; let lowered = 0;
  for (const f of done) {
    const r = JSON.parse(readFileSync(join(rowsDir, f), 'utf8'));
    const was = reg.grid[r.seed] || [];
    for (const row of r.rows) if (!was.includes(row)) rose.push(`${r.seed} ${row}`);
    for (const row of was) if (!r.rows.includes(row)) { console.log(`FALL  ${r.seed} ${row}`); lowered++; }
    if (shrink) reg.grid[r.seed] = was.filter((row) => r.rows.includes(row));
  }
  for (const x of rose) console.log(`RISE  ${x}`);
  if (rose.length) { console.log('page-census --grid: REFUSED, a grid row rose'); process.exit(1); }
  if (shrink && lowered) writeFileSync(REGISTER, `${JSON.stringify(reg, null, 1)}\n`);
  console.log(`page-census --grid: ${lowered} fall(s)${shrink && lowered ? ', written' : ''}`);
  process.exit(0);
}
/** @type {string[]} */ const over = [];
let fell = 0;
console.log('row        master integ banked  now  bar');
for (const [id, row] of Object.entries(reg.rows)) {
  const now = counts[id] || 0;
  const limit = banked ? row.banked : 0;
  if (now > limit) over.push(id);
  if (banked && now < row.banked) fell++;
  const col = (/** @type {number|null} */ n) => (n == null ? '—' : String(n));
  console.log(`${id.padEnd(10)} ${col(row.master).padStart(6)} ${col(row.integration).padStart(5)} ${String(row.banked).padStart(6)} ${String(now).padStart(4)}    0${now > limit ? (banked ? '  ROSE' : '  over the bar') : ''}  ${(examples[id] || []).join(' ')}${row.base != null ? `  (new row; ${row.base} at the base)` : ''}`);
}
// the retired rows, by name, never a silent zero: their counts when retired and the row that replaced each
for (const [id, row] of Object.entries(reg.retired || {})) {
  console.log(`${id.padEnd(10)} ${String(row.master).padStart(6)} ${String(row.integration).padStart(5)} ${String(row.atRetirement).padStart(6)}  RETIRED → ${row.replacedBy}: ${row.reason.split(':')[0]}`);
}
for (const id of Object.keys(counts)) if (!reg.rows[id]) over.push(`${id} (no row)`);
writeFileSync(join(out, 'counts.json'), JSON.stringify({ prefix, scale, births: plan.length, counts, examples }, null, 1));
if (over.length) {
  console.log(banked ? `page-census: ROSE on ${over.join(', ')} — the register is shrink-only` : `page-census: over the bar on ${over.join(', ')}`);
  process.exit(1);
}
if (shrink && fell) {
  for (const [id, row] of Object.entries(reg.rows)) row.banked = Math.min(row.banked, counts[id] || 0);
  writeFileSync(REGISTER, `${JSON.stringify(reg, null, 1)}\n`);
  console.log(`page-census: ${fell} row(s) lowered in ${REGISTER}`);
}
console.log(`page-census: ${banked ? 'the banked corpus reads at or under the register' : 'the fresh corpus reads at the bar'}`);
