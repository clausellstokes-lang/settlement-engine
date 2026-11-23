#!/usr/bin/env node
// R5D-SQL-2 run (g): THE REFERENCE'S CASES THROUGH BOTH ENGINES. Every case the proof wrote (`<proof scratch>/cases.csv`: the first
// pass's 6,009, then the mask's), each as a power's desc, through 212's public._gallery_veil_withhold_always on a local database
// holding 001..211 + this tree's 212, AND through the twin's galleryWithholdAlways.js :: standingBase; each against the reference
// cut (scripts/veil/standingForms.mjs :: cutDesc, the base). SQL = JS = reference on every case, or exit 1.
//   PGHOST=... PGUSER=postgres node g-cases.mjs <cases.csv> <database> <first-pass count> <pg module dir>
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..', '..');
const [csvPath, database, firstArg, pgmod] = process.argv.slice(2);
if (!csvPath || !database || !pgmod) { console.error('usage: g-cases.mjs <cases.csv> <database> <first-pass count> <pg module dir>'); process.exit(2); }
const { compileRows, cutDesc, readTable } = await import(`${ROOT}/scripts/veil/standingForms.mjs`);
const { standingBase } = await import(`${ROOT}/src/domain/display/galleryWithholdAlways.js`);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;

/** Postgres' csv (quoted fields, doubled quotes, newlines inside quotes): [[n, s], ...]. */
function parseCsv(text) {
  const out = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { f += '"'; i += 1; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); out.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); out.push(row); }
  return out;
}

const cases = parseCsv(readFileSync(csvPath, 'utf8')).map(([n, s]) => ({ n: Number(n), s }));
const first = Number(firstArg || 0);
const rows = compileRows(readTable().forms);
const db = new pg.Client({ host: process.env.PGHOST, user: process.env.PGUSER || 'postgres', database }); await db.connect();
const B = 400;
const sql = new Map();
for (let i = 0; i < cases.length; i += B) {
  const part = cases.slice(i, i + B);
  const doc = { powerStructure: { factions: part.map(({ s }) => ({ desc: s })) } };
  const r = await db.query('select public._gallery_veil_withhold_always($1::jsonb) #> \'{powerStructure,factions}\' as f', [JSON.stringify(doc)]);
  r.rows[0].f.forEach((f, k) => sql.set(part[k].n, f.desc));
}
await db.end();
let eq = 0; let eqFirst = 0; const bad = [];
for (const { n, s } of cases) {
  const c = cutDesc(s, rows);
  const ref = c ? c.base : s;
  const js = standingBase(s);
  const pgv = sql.get(n);
  if (ref === js && ref === pgv) { eq += 1; if (n < first) eqFirst += 1; } else if (bad.length < 10) bad.push(`#${n} "${s.slice(0, 120)}": ref "${ref.slice(0, 60)}" js "${String(js).slice(0, 60)}" sql "${String(pgv).slice(0, 60)}"`);
}
console.log(`(g) ${cases.length} cases (${first} of the first pass, ${cases.length - first} of the mask) through 212's _gallery_veil_withhold_always (${database}) and the twin's standingBase: SQL = JS = reference on ${eq} / ${cases.length} (first pass ${eqFirst} / ${first}; mask ${eq - eqFirst} / ${cases.length - first})`);
for (const b of bad) console.log(`  DIFF ${b}`);
process.exit(eq === cases.length ? 0 : 1);
