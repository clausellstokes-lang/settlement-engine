#!/usr/bin/env node
/**
 * scripts/page-clash-census.mjs — THE PAGE CLASH CENSUS (SURVEY S-C, the eleventh chair's SURVEY-DESIGN §2 (ii); the release's
 * number for the promise "nothing the survey says is ruled out by the record or by itself").
 *
 * For every row of the table of exclusions (`src/domain/facts/claimExclusions.js`) it counts the OWNER pages that print a line
 * standing on side A beside a line (or a recording) standing on side B, AS THE APP RENDERS THEM: each birth is rendered through
 * the real OutputContainer, every group, sub-tab and disclosure walked (`scripts/census/page-clash.render.census.jsx`, run by
 * vitest with its root at this tree, so nothing is bundled or checked in: the renderer is built at run time). What a line stands
 * on, and what the census cannot see, is written once in `scripts/census/page-clash.shared.mjs`.
 *
 * THE CORPORA are the survey's two proof corpora, 900 births each (the close's C and V: seeds `dp-<size>-<i>`, i 0..149, six
 * sizes; C born from `{ settType }`, V from `{ ...DEFAULT_CONFIG, settType, _randomizePriorities: true }`), 1,800 pages.
 * THE REGISTER (`scripts/.page-clash-census.json`): per row, the pages BANKED on the 1,800 and the towns' keys, SHRINK-ONLY; and
 * `sample`, the rows each birth of the FIXED SAMPLE carries, which `tests/lint/pageClashCensus.walker.test.js` holds exactly in
 * the suite. EVERY ROW'S BAR IS ZERO.
 *
 * Usage (read-only unless --write):
 *   node scripts/page-clash-census.mjs [--workers=3] [--out=<dir>]   the 1,800 against the register (exit 1 on a row that rose)
 *   node scripts/page-clash-census.mjs --corpus=C|V                  one corpus only (never written)
 *   node scripts/page-clash-census.mjs --sample                      the fixed sample only, against the register's `sample`
 *   node scripts/page-clash-census.mjs --from=<dir>                  count a run already rendered into <dir>
 *   node scripts/page-clash-census.mjs --write                        THE DOOR: bank the 1,800 (and the sample): refused, nothing
 *                                                                    written, if any row ROSE above its banked count; the first
 *                                                                    write banks what the corpora print
 * Measured on a 4-core container: about 40 minutes a corpus with three workers.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER = join(ROOT, 'scripts/.page-clash-census.json');
const RENDER = join(ROOT, 'scripts/census/page-clash.render.census.jsx');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** THE FIXED SAMPLE: the measure's worked examples of E-clashes rows 10 to 14, and one large town of each corpus. */
export const SAMPLE = Object.freeze([
  'C:dp-hamlet-33', 'C:dp-hamlet-26', 'C:dp-thorp-120', 'C:dp-village-141', 'C:dp-thorp-99', 'C:dp-thorp-3', 'V:dp-town-7', 'V:dp-city-12',
]);
/** @param {string} name @param {string} [fallback] */
const arg = (name, fallback) => { const hit = process.argv.find((a) => a.startsWith(`--${name}=`)); return hit ? hit.slice(name.length + 3) : fallback; };

/** @param {'C'|'V'} corpus @param {Record<string, unknown>} defaults the store's DEFAULT_CONFIG (V only) */
export function corpusPlan(corpus, defaults) {
  return SIZES.flatMap((size) => Array.from({ length: 150 }, (_, i) => ({
    corpus, seed: `dp-${size}-${i}`, size, config: corpus === 'C' ? { settType: size } : { ...defaults, settType: size, _randomizePriorities: true },
  })));
}

/**
 * Render a plan into `<out>/rows` (one vitest per worker, its root at the tree) and return the rows read.
 * @param {ReadonlyArray<any>} plan @param {string} out @param {number} workers
 */
export async function renderPlan(plan, out, workers) {
  const rows = join(out, 'rows'); mkdirSync(rows, { recursive: true });
  const config = join(out, 'vitest.page-clash.config.mjs');
  writeFileSync(config, `import react from '${join(ROOT, 'node_modules/@vitejs/plugin-react/dist/index.js')}';
export default { root: '${ROOT}', plugins: [react()], test: { environment: 'node', include: ['${RENDER}'], testTimeout: 600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
`);
  const todo = plan.filter((r) => !existsSync(join(rows, `${r.corpus}-${r.seed}.json`)));
  await Promise.all(Array.from({ length: Math.min(workers, todo.length) }, (_, w) => {
    const part = join(out, `plan.${w}.json`);
    writeFileSync(part, JSON.stringify(todo.filter((_, i) => i % workers === w)));
    return new Promise((done) => {
      const child = spawn('npx', ['vitest', 'run', '--config', config], { cwd: ROOT, env: { ...process.env, PAGE_CLASH_OUT: rows, PAGE_CLASH_PLAN: part }, stdio: ['ignore', 'pipe', 'pipe'] });
      /** @type {Buffer[]} */ const log = [];
      child.stdout.on('data', (d) => log.push(d)); child.stderr.on('data', (d) => log.push(d));
      child.on('close', (code) => { writeFileSync(join(out, `render.${w}.log`), Buffer.concat(log)); done(code); });
    });
  }));
  return plan.map((r) => { const f = join(rows, `${r.corpus}-${r.seed}.json`); return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null; });
}

/** @param {ReadonlyArray<any>} read the rendered rows @returns {Record<string, { pages: number, C: number, V: number, unconfirmed: number, towns: string[] }>} */
export function countRows(read) {
  /** @type {Record<string, { pages: number, C: number, V: number, unconfirmed: number, towns: string[] }>} */ const out = {};
  for (const r of read) for (const [id, hit] of Object.entries(r.clashes || {})) {
    const row = (out[id] ||= { pages: 0, C: 0, V: 0, unconfirmed: 0, towns: [] });
    row.pages += 1; row[/** @type {'C'|'V'} */ (r.corpus)] += 1; if (!hit.confirmed) row.unconfirmed += 1; row.towns.push(`${r.corpus}:${r.seed}`);
  }
  for (const r of read) if (Array.isArray(r.empty) && r.empty.length) {
    const row = (out[EMPTY_ROW] ||= { pages: 0, C: 0, V: 0, unconfirmed: 0, towns: [] });
    row.pages += 1; row[/** @type {'C'|'V'} */ (r.corpus)] += 1; row.towns.push(`${r.corpus}:${r.seed}`);
  }
  for (const row of Object.values(out)) row.towns.sort();
  return out;
}

/** SURVEY S-B2 (the chair's 06:05 message, (c)): the pages where one of the four solvency slots is EMPTY, a row of the register
 * beside the table's own (its bar 0; shrink-only like them). */
export const EMPTY_ROW = 'empty solvency slot';
/** @param {ReadonlyArray<{ id: string }>} table @returns {string[]} the register's rows: the table's and the empty slots' */
export const registerRowIds = (table) => [...table.map((r) => r.id), EMPTY_ROW];

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const { DEFAULT_CONFIG } = await import(join(ROOT, 'src/store/configSlice.js'));
  const { CLAIM_EXCLUSIONS } = await import(join(ROOT, 'src/domain/facts/claimExclusions.js'));
  const write = process.argv.includes('--write'); const sampleOnly = process.argv.includes('--sample'); const only = arg('corpus');
  if (write && (sampleOnly || only)) { console.error('page-clash-census: --write reads the whole 1,800'); process.exit(2); }
  const full = [...corpusPlan('C', DEFAULT_CONFIG), ...corpusPlan('V', DEFAULT_CONFIG)];
  const plan = sampleOnly ? full.filter((r) => SAMPLE.includes(`${r.corpus}:${r.seed}`)) : only ? full.filter((r) => r.corpus === only) : full;
  const out = arg('from') || arg('out') || mkdtempSync(join(tmpdir(), 'page-clash-'));
  const t0 = Date.now();
  console.log(`page-clash-census: ${plan.length} pages into ${out}`);
  const read = await renderPlan(plan, out, Number(arg('workers', '3')));
  const missing = read.filter((r) => !r).length;
  if (missing) { console.error(`page-clash-census: ${missing} of ${plan.length} pages not rendered; read ${out}/render.*.log`); process.exit(2); }
  const counts = countRows(read);
  const reg = existsSync(REGISTER) ? JSON.parse(readFileSync(REGISTER, 'utf8')) : null;
  /** @type {string[]} */ const rose = [];
  console.log('row                                            banked  now  (C  V)  unconfirmed  bar 0');
  for (const row of registerRowIds(CLAIM_EXCLUSIONS).map((id) => ({ id }))) {
    const now = counts[row.id] || { pages: 0, C: 0, V: 0, unconfirmed: 0, towns: [] };
    const banked = reg?.rows?.[row.id]?.pages;
    if (!sampleOnly && !only && banked != null && now.pages > banked) rose.push(row.id);
    console.log(`${row.id.padEnd(46)} ${String(banked ?? '—').padStart(6)} ${String(now.pages).padStart(4)}  (${now.C} ${now.V})  ${String(now.unconfirmed).padStart(5)}  ${now.towns.slice(0, 4).join(' ')}`);
  }
  for (const id of Object.keys(counts)) if (!registerRowIds(CLAIM_EXCLUSIONS).includes(id)) rose.push(`${id} (no row)`);
  const sample = Object.fromEntries(read.filter((r) => SAMPLE.includes(`${r.corpus}:${r.seed}`)).map((r) => [`${r.corpus}:${r.seed}`, [...Object.keys(r.clashes), ...(r.empty?.length ? [EMPTY_ROW] : [])].sort()]));
  if (sampleOnly) {
    const drift = SAMPLE.filter((k) => JSON.stringify(sample[k] || []) !== JSON.stringify(reg?.sample?.[k] || []));
    for (const k of drift) console.log(`SAMPLE ${k}: register ${JSON.stringify(reg?.sample?.[k] || [])}, now ${JSON.stringify(sample[k] || [])}`);
    console.log(`page-clash-census --sample: ${drift.length ? 'DIFFERS from the register' : 'equals the register'} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    process.exit(drift.length ? 1 : 0);
  }
  // WHAT IT COULD NOT READ, in numbers: the notes standing on an atom whose text the census never had, counted as printed
  const notes = read.reduce((n, r) => n + (r.notes || 0), 0); const unconfirmed = read.reduce((n, r) => n + (r.unconfirmedNotes || 0), 0);
  console.log(`page-clash-census: ${notes} notes stand on an atom over ${read.length} pages; ${unconfirmed} of them (${notes ? ((100 * unconfirmed) / notes).toFixed(1) : 0} %) could not be confirmed printed and are counted as printed`);
  writeFileSync(join(out, 'counts.json'), JSON.stringify({ pages: read.length, counts, sample, notes, unconfirmed }, null, 1));
  if (rose.length) { console.log(`page-clash-census: ROSE on ${rose.join(', ')}: the register is shrink-only${write ? '; nothing written' : ''}`); process.exit(1); }
  if (write) {
    const rows = Object.fromEntries(registerRowIds(CLAIM_EXCLUSIONS).map((id) => [id, counts[id] || { pages: 0, C: 0, V: 0, unconfirmed: 0, towns: [] }]));
    writeFileSync(REGISTER, `${JSON.stringify({
      _doc: 'THE PAGE CLASH CENSUS\'S REGISTER (SURVEY S-C; scripts/page-clash-census.mjs, its door --write). rows: per row of src/domain/facts/claimExclusions.js (and `empty solvency slot`, SURVEY S-B2: a page where one of the four solvency slots draws nothing), the owner pages of the corpora C and V (1,800) that print both sides, BANKED: SHRINK-ONLY (the door refuses a rise and writes nothing); every row\'s bar is 0. unconfirmed: pages whose pair holds a note the census cannot confirm printed (a table row drawn at birth). sample: the rows each birth of the fixed sample carries, held exactly by tests/lint/pageClashCensus.walker.test.js.',
      pages: read.length, rows, sample,
    }, null, 1)}\n`);
    console.log(`page-clash-census: written ${REGISTER}`);
  }
  console.log(`page-clash-census: done in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
}
