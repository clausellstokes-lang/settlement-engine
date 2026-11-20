#!/usr/bin/env node
/**
 * scripts/presumption-classes-door.mjs — THE DOOR of the presumption-classes walker's register
 * (`tests/lint/presumptionClasses.register.json`; BAR6-GUARD, the chair's ruling BG1 of 2026-11-16). The register
 * holds TODAY'S DEBT: every line under the walker's roots that held a presumption-class word and declared nothing
 * that answers it at the guard's base (`register.base`). It is SHRINK-ONLY: a row leaves by its cure (the line
 * declares, takes a twin, or is reworded so no class word stands), and nothing is ever banked to absorb a NEW line.
 *
 *   --check                      print the fresh hits (not banked) and the stale rows; exit 1 if any exists
 *   --shrink                     remove every stale row (a row no hit matches) and lower the ceiling; never adds
 *   --bank debt-at-base          bank the fresh hits — ONLY hits whose WHOLE literal stood in its file at
 *                                `register.base`. A fresh hit whose text is not there is a NEW line: nothing is
 *                                written and the door exits 1, naming it (declare it; never bank it)
 *
 * Run from the tree root. Writes nothing in --check. Every run is read through `sh scripts/gate-tail.sh`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { REGISTER_REL, REASONS, bankRow, bankedKeys, rowKey, scanTree } from '../tests/lint/presumptionClasses.shared.mjs';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const mode = args.find((a) => a.startsWith('--'));
const regPath = join(ROOT, REGISTER_REL);
const reg = existsSync(regPath) ? JSON.parse(readFileSync(regPath, 'utf8')) : null;
if (!reg) { console.error(`no register at ${REGISTER_REL}`); process.exit(2); }

const hits = await scanTree(ROOT);
const banked = bankedKeys(reg);
const found = new Set(hits.map((h) => h.key));
const fresh = hits.filter((h) => !banked.has(h.key));
const stale = [...banked].filter((k) => !found.has(k));
const rowCount = () => Object.values(reg.rows).reduce((n, rs) => n + rs.length, 0);

const write = () => {
  const rows = {};
  for (const f of Object.keys(reg.rows).sort()) if (reg.rows[f].length) rows[f] = [...reg.rows[f]].sort((a, b) => (a[0] + a[3] < b[0] + b[3] ? -1 : 1));
  reg.rows = rows;
  const body = Object.keys(rows).map((f) => `  ${JSON.stringify(f)}: [\n${rows[f].map((r) => `   ${JSON.stringify(r)}`).join(',\n')}\n  ]`).join(',\n');
  const head = { ...reg }; delete head.rows;
  const headText = JSON.stringify(head, null, 1);
  writeFileSync(regPath, `${headText.slice(0, -2)},\n "rows": {\n${body}\n }\n}\n`);
};

if (mode === '--check' || mode === undefined) {
  for (const h of fresh) console.log(`FRESH\t${h.key}\t${h.status}\t${JSON.stringify(h.text.slice(0, 120))}`);
  for (const k of stale) console.log(`STALE\t${k}`);
  console.log(`hits ${hits.length} · banked ${banked.size} · fresh ${fresh.length} · stale ${stale.length} · ceiling ${reg.ceiling}`);
  process.exit(fresh.length || stale.length ? 1 : 0);
} else if (mode === '--shrink') {
  const staleSet = new Set(stale);
  for (const f of Object.keys(reg.rows)) reg.rows[f] = reg.rows[f].filter((r) => !staleSet.has(rowKey(f, r)));
  reg.ceiling = rowCount();
  write();
  console.log(`removed ${stale.length} stale rows · ceiling ${reg.ceiling}`);
} else if (mode === '--bank') {
  const reason = args[args.indexOf('--bank') + 1];
  if (!REASONS[reason]) { console.error(`--bank needs a named reason: ${Object.keys(REASONS).join(', ')}`); process.exit(2); }
  const base = reg.base;
  /** @type {Map<string, string>} */ const atBase = new Map();
  // a literal's text against its source at the base: escapes decoded and runs of white space folded on both sides
  const fold = (/** @type {string} */ x) => x.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\[nrt]/g, ' ').replace(/\\(.)/g, '$1').replace(/\s+/g, ' ');
  const srcAt = (file) => {
    if (!atBase.has(file)) { let s = ''; try { s = execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 28 }); } catch { /* absent at the base */ } atBase.set(file, fold(s)); }
    return atBase.get(file);
  };
  const novel = fresh.filter((h) => !srcAt(h.file).includes(fold(h.text).trim()));
  if (novel.length) {
    for (const h of novel) console.error(`NEW LINE (not at ${base}): ${h.key}\t${JSON.stringify(h.text.slice(0, 120))}`);
    console.error(`${novel.length} fresh hits are new lines: declare them; the door banks nothing`);
    process.exit(1);
  }
  for (const h of fresh) (reg.rows[h.file] ||= []).push(bankRow(h));
  if (reg.ceiling == null || rowCount() > reg.ceiling) reg.ceiling = rowCount();
  write();
  console.log(`banked ${fresh.length} rows under '${reason}' (each stood at ${base}) · ceiling ${reg.ceiling}`);
} else {
  console.error('usage: --check | --shrink | --bank debt-at-base');
  process.exit(2);
}
