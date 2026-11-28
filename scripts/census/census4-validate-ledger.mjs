// CENSUS-4 phase A: the declaration ledger against the pools (census4-extract-pools.mjs output) and
// the closed vocabulary. Prints per-pool counts, the atom histogram and every violation (BAD n);
// exits 1 when there is one.
//
//   node scripts/census/census4-validate-ledger.mjs [<raw-dir>]
//
// <raw-dir> holds census4-extract-pools.mjs's output; without it the extract is run into a fresh
// temporary directory first, so the check always reads the pools as the tree has them.
//
// ⛔ REPAIRED (FAULTS-TOOLS, 2026-11-18). From 2c1428102 (2026-11-04) the script could not open:
// CENSUS-2's pool-shaped ledgers (ARRIVAL_MEMORIES.json first) and CENSUS-3b's row ledgers joined
// this directory, the extract emits no pool for them, and the script threw on the first. It now
// reads ONLY its own ledgers (a row-shaped file whose pool the extract emits, or whose name is a
// CENSUS-4 table's: the same set `tests/lint/census4Ledger.walker.test.js` reads) and NAMES every
// other file by family, never silently. Its atom check reads the live vocabulary
// (`src/domain/facts/factVocabulary.js`, which superseded VOCABULARY.md's phase-A words on
// 2026-11-05) instead of the phase-A copy it was born with. Two checks are new: an extract pool
// with no ledger file, and an own ledger with no extract pool, are each BAD (the ledger "still
// covers every line", as the extract's header promises).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { CRISIS_VALUES, parseAtom } from '../../src/domain/facts/factVocabulary.js';

const D = new URL('../../docs/census/declarations/', import.meta.url).pathname;
const EXTRACT = new URL('./census4-extract-pools.mjs', import.meta.url).pathname;
// CENSUS-4's own tables (the extract's pool ids begin with one of these): census4Ledger.walker's OWN.
const OWN = /^(?:npcData|npcGenerator|npcStructure|stressInstitutionEffects|crisisCast|institutionDescVariants|institutionServices|tonightSheet|corruptionPass|factionLeaderSecret)\./;

let RAW = process.argv[2];
if (!RAW) {
  RAW = fs.mkdtempSync(path.join(os.tmpdir(), 'census4-raw-'));
  execFileSync(process.execPath, [EXTRACT, RAW], { stdio: ['ignore', 'ignore', 'inherit'] });
}
if (!RAW.endsWith('/')) RAW += '/';
const extracted = new Set(fs.readdirSync(RAW).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')));

const ok = (a) => parseAtom(a) !== null;
// A pool KEYED by a crisis kind or family declares it on the key (phase A's `ok` took a crisis word anywhere; phase B moved
// a crisis word off a row's `needs` into its `crisis` list, so only the key keeps one).
const keyOk = (a) => ok(a) || CRISIS_VALUES.includes(a);
const hist = {}, bad = [];
let lines = 0, declaring = 0, files = 0;
const colourPools = [], scoped = [], sum = [];
/** files of the directory this validator does not read, by family */
const others = { 'CENSUS-2 pool-shaped (pools[])': [], 'row-shaped, not a CENSUS-4 table (CENSUS-3b)': [], 'a summary or vocabulary file (_*.json)': [], 'unknown shape': [] };
const own = new Set();
for (const f of fs.readdirSync(D).filter((name) => name.endsWith('.json')).sort()) {
  const id = f.replace(/\.json$/, '');
  const j = JSON.parse(fs.readFileSync(D + f, 'utf8'));
  const rowShaped = Array.isArray(j.rows) && j.pool && typeof j.pool === 'object';
  if (f.startsWith('_')) { others['a summary or vocabulary file (_*.json)'].push(f); continue; }
  if (!rowShaped) { others[Array.isArray(j.pools) ? 'CENSUS-2 pool-shaped (pools[])' : 'unknown shape'].push(f); continue; }
  if (!extracted.has(id) && !OWN.test(f)) { others['row-shaped, not a CENSUS-4 table (CENSUS-3b)'].push(f); continue; }
  own.add(id);
  files++;
  if (!extracted.has(id)) bad.push(`${id}: a CENSUS-4 ledger the extract emits no pool for`);
  else {
    const raw = JSON.parse(fs.readFileSync(RAW + id + '.json', 'utf8')).rows;
    if (raw.length !== j.rows.length) bad.push(`${id}: rows ${j.rows.length} vs raw ${raw.length}`);
    raw.forEach((r, i) => { if (j.rows[i]?.id !== r.id || j.rows[i]?.text !== r.text) bad.push(`${id}: row ${i} id/text mismatch (${r.id})`); });
  }
  if (j.pool?.id !== id) bad.push(`${id}: pool.id ${j.pool?.id}`);
  for (const atoms of Object.values(j.pool.keyDeclares || {})) for (const a of atoms) if (!keyOk(a)) bad.push(`${id}: keyDeclares atom '${a}'`);
  let d = 0;
  for (const r of j.rows) {
    for (const k of ['needs', 'excludes']) {
      if (!Array.isArray(r[k])) bad.push(`${id}:${r.id} ${k} not array`);
      for (const a of r[k] || []) { if (!ok(a)) bad.push(`${id}:${r.id} atom '${a}'`); hist[a] = (hist[a] || 0) + 1; }
    }
    const c = r.crisis;
    if (!(c === 'calm' || c === 'any' || Array.isArray(c))) bad.push(`${id}:${r.id} crisis ${JSON.stringify(c)}`);
    if (Array.isArray(c)) for (const a of c) { if (!CRISIS_VALUES.includes(a)) bad.push(`${id}:${r.id} crisis atom ${a}`); hist['crisis:' + a] = (hist['crisis:' + a] || 0) + 1; }
    else hist['crisis:' + c] = (hist['crisis:' + c] || 0) + 1;
    const dec = (r.needs?.length || 0) + (r.excludes?.length || 0) + ((c === 'calm' || c === 'any' || c?.length) ? 1 : 0) > 0;
    if (dec) d++;
    if (dec && r.colour) bad.push(`${id}:${r.id} colour but declares`);
  }
  if (j.pool.declaring !== d) bad.push(`${id}: pool.declaring ${j.pool.declaring} vs ${d}`);
  lines += j.rows.length; declaring += d;
  if (j.pool.colour) colourPools.push(id);
  if (j.pool.crisisScoped) scoped.push(id);
  sum.push([id, j.pool.drawKind, j.rows.length, d, j.rows.filter((r) => r.colour).length]);
}
for (const id of [...extracted].sort()) if (!own.has(id)) bad.push(`${id}: an extracted pool with no ledger file`);
for (const s of sum) console.log(s.join('\t'));
console.log({ files, lines, declaring, colourPools: colourPools.length, scoped });
console.log(Object.entries(hist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
for (const [family, list] of Object.entries(others)) if (list.length) console.log(`NOT READ (${family}): ${list.length}`);
/** every finding counted by its pool and its kind, so a list cut at forty still says where the rest are */
const byKind = {};
for (const b of bad) {
  const [where] = b.split(/[: ]/, 1);
  const kind = b.replace(/^[^ ]+ /, '').replace(/^row \d+ /, 'row ').replace(/'.*'/, "'…'").replace(/\(.*\)/, '(…)').replace(/\d+ vs \d+/, 'n vs n');
  byKind[`${where} · ${kind}`] = (byKind[`${where} · ${kind}`] || 0) + 1;
}
for (const [k, v] of Object.entries(byKind)) console.log(`BAD by pool  ${String(v).padStart(4)}  ${k}`);
console.log("BAD", bad.length, bad.slice(0, 40));
if (process.env.CENSUS4_ALL) for (const b of bad) console.log("BAD:", b);
process.exitCode = bad.length ? 1 : 0;
