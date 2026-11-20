#!/usr/bin/env node
/**
 * GOALS-4 builder 11, addendum (B) (the chair's ruling of 2026-11-20 21:30 UTC): THE LEDGER WITH NO DOOR, WRITTEN BY A
 * SCRIPT. `docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json` is hand-written data with no write tool, and it
 * predates GOALS-3's reserve lines (GOALS-1 GR3: `npcData.js :: pairProse`'s `reserve`, indices `head`..`size-1`), so it
 * held none of the 26 reserve rows (peer_rivalry, mentor_legacy, wary_alliance, old_debt 2 each, mutual_leverage 5 each,
 * in both fields). This script reads THE DATA'S OWN DECLARATIONS for exactly those rows and writes them:
 *   - `id`: `<archetype>.<desc|tension>#<index>`, for every index at or past the field's `head`;
 *   - `text`: the line rendered as the extract and `tieProseDeclared.test.js` render it, `field({name:'{A}'},{name:'{B}'}, i)`;
 *   - `needs`, `excludes`, `crisis`: `factVocabulary.js :: declarationOf` on the live row;
 *   - `colour`: `factVocabulary.js :: isColourLine` on the live row;
 * each inserted after its field's last row, in the order the extract (`scripts/census/census4-extract-pools.mjs`) emits.
 * `pool.lines` follows the row count.
 *
 * And, separately, THE TWO RE-WORDED ROWS (addendum (C), approved): the `text` of mil_crim_corruption.tension#7 and
 * gov_econ_dependence.desc#1 is re-taken from the live rendering; the script refuses if any other existing row's
 * rendering differs from its ledger text, or if those two rows' declarations differ from the ledger's.
 *
 * Usage, from a repository root: node docs/chair/2026-11-20/content/goals/measures/b11/ledger-reserve-rows.mjs [--write]
 * Without --write it prints the rows it would write and changes nothing. Idempotent: a row already present is refused.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const FILE = path.join(ROOT, 'docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json');
const WRITE = process.argv.includes('--write');
const { STRESS_ECONOMIC_EFFECTS } = await import(pathToFileURL(path.join(ROOT, 'src/data/npcData.js')).href);
const { declarationOf, isColourLine } = await import(pathToFileURL(path.join(ROOT, 'src/domain/facts/factVocabulary.js')).href);
const RETEXT = Object.freeze(['mil_crim_corruption.tension#7', 'gov_econ_dependence.desc#1']);

const ledger = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(ledger.rows.map((r) => [r.id, r]));
const render = (field, i) => field({ name: '{A}' }, { name: '{B}' }, i);
const fail = (msg) => { console.error(`ledger-reserve-rows: ${msg}`); process.exit(1); };

// the existing rows: only the two approved re-wordings may differ from the live rendering
for (const [key, a] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
  for (const f of ['desc', 'tension']) {
    for (let i = 0; i < a[f].head; i++) {
      const id = `${key}.${f}#${i}`;
      const row = byId.get(id);
      if (!row) fail(`${id}: a head row missing from the ledger`);
      const text = render(a[f], i);
      if (row.text === text) continue;
      if (!RETEXT.includes(id)) fail(`${id}: its live text differs from the ledger and is not an approved re-wording`);
      const d = declarationOf(a[f].lines[i]);
      if (JSON.stringify([[...d.needs], [...d.excludes], [...d.crisis], isColourLine(a[f].lines[i])]) !== JSON.stringify([row.needs, row.excludes, row.crisis, row.colour]))
        fail(`${id}: its declaration differs from the ledger's`);
      console.log(`RETEXT ${id}\n  was: ${row.text}\n  now: ${text}`);
      row.text = text;
    }
  }
}

// the reserve rows, from the data's own declarations, after each field's last row
const out = [];
let added = 0;
const reserveOf = new Map();
for (const [key, a] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
  for (const f of ['desc', 'tension']) {
    const rows = [];
    for (let i = a[f].head; i < a[f].size; i++) {
      const id = `${key}.${f}#${i}`;
      if (byId.has(id)) fail(`${id}: already in the ledger`);
      const line = a[f].lines[i];
      const d = declarationOf(line);
      rows.push({ id, text: render(a[f], i), needs: [...d.needs], excludes: [...d.excludes], crisis: [...d.crisis], colour: isColourLine(line) });
    }
    if (rows.length) reserveOf.set(`${key}.${f}#${a[f].head - 1}`, rows);
  }
}
for (const row of ledger.rows) {
  out.push(row);
  const rows = reserveOf.get(row.id);
  if (rows) { out.push(...rows); added += rows.length; reserveOf.delete(row.id); for (const r of rows) console.log(`ADD ${r.id} needs=${JSON.stringify(r.needs)} excludes=${JSON.stringify(r.excludes)} crisis=${JSON.stringify(r.crisis)} colour=${r.colour}`); }
}
if (reserveOf.size) fail(`no anchor row for ${[...reserveOf.keys()].join(', ')}`);
console.log(`rows ${ledger.rows.length} -> ${out.length} (+${added})`);
if (WRITE) {
  ledger.rows = out;
  ledger.pool.lines = out.length;
  fs.writeFileSync(FILE, `${JSON.stringify(ledger, null, 2)}\n`);
  console.log(`written: ${path.relative(ROOT, FILE)}`);
}
