#!/usr/bin/env node
/**
 * scripts/presumed-things-door.mjs — THE DOOR of the presumed-things walker's WIDENED register
 * (`tests/lint/presumedThings.widened.register.json`; W2-B-DECLARE, 2026-11-12). The register holds the
 * habitat a widening of the walker newly sees (a carrier no door enforces, a new root, a new word) and is
 * SHRINK-ONLY: no line is ever banked to absorb a NEW line.
 *
 *   --check                    print the fresh hits (not banked) and the stale rows, of arm 1 and of the strip
 *                              ban; exit 1 if any exists
 *   --bank-strip <reason> <file> --base <rev>
 *                              bank the fresh strip sites of one file under <reason> (`strip-before-draw`,
 *                              `not-a-draw`) — only a site whose receiver already stood in the file at <rev>
 *   --shrink                   remove every stale row (a row nothing matches) of the widened register AND of the
 *                              first register's arm 1 (both registers are shrink-only); never adds
 *   --bank <reason> --base <rev>
 *                              bank the fresh hits under <reason> — ONLY hits whose literal already stood in
 *                              its file at <rev> (the widening's base). A fresh hit whose text is not at <rev>
 *                              is a NEW line: nothing is written and the door exits 1, naming it.
 *   --bank <reason> --base <rev> --thing <id>
 *                              the same, for the fresh hits of ONE registered word only (a re-key by identity
 *                              and a narrowed implication are banked under their two reasons, W2-B-DECLARE F4)
 *
 * Run from the tree root. Writes nothing in --check.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { REGISTER_REL, WIDENED_REGISTER_REL, bankedKeys, hitKey, scanTree, stripKey, stripTree } from '../tests/lint/presumedThings.shared.mjs';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const mode = args.find((a) => a.startsWith('--') && a !== '--base');
const reg = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));
const main = JSON.parse(readFileSync(join(ROOT, 'tests/lint/presumedThings.register.json'), 'utf8'));

const hits = scanTree(ROOT);
const banked = new Set([...bankedKeys(main), ...bankedKeys(reg)]);
const found = new Set(hits.map((h) => hitKey(h.file, h.thing, h.text)));
const fresh = hits.filter((h) => !banked.has(hitKey(h.file, h.thing, h.text)));
const stale = [...bankedKeys(reg)].filter((k) => !found.has(k));
// the first register's arm-1 rows nothing matches (a re-key by identity leaves them; the walker reds them as stale)
const mainStale = [...bankedKeys(main)].filter((k) => !found.has(k));
reg.strips ||= [];
const strips = stripTree(ROOT);
const stripFound = new Set(strips.map((x) => stripKey(x.file, x.receiver)));
const stripBanked = new Set(reg.strips.map((r) => stripKey(r[0], r[1])));
const stripFresh = strips.filter((x) => !stripBanked.has(stripKey(x.file, x.receiver)));
const stripStale = [...stripBanked].filter((k) => !stripFound.has(k));

const write = () => {
  const arm1 = {};
  for (const f of Object.keys(reg.arm1).sort()) if (reg.arm1[f].length) arm1[f] = reg.arm1[f];
  reg.arm1 = arm1;
  writeFileSync(join(ROOT, WIDENED_REGISTER_REL), `${JSON.stringify(reg, null, 1)}\n`);
};

if (mode === '--check' || mode === undefined) {
  for (const h of fresh) console.log(`fresh\t${hitKey(h.file, h.thing, h.text)}`);
  for (const k of stale) console.log(`stale\t${k}`);
  for (const k of mainStale) console.log(`stale (first register)\t${k}`);
  for (const x of stripFresh) console.log(`strip fresh\t${stripKey(x.file, x.receiver)}`);
  for (const k of stripStale) console.log(`strip stale\t${k}`);
  console.log(`fresh ${fresh.length} · stale ${stale.length} · first-register stale ${mainStale.length} · banked ${bankedKeys(reg).size} · strips fresh ${stripFresh.length} stale ${stripStale.length} banked ${stripBanked.size}`);
  process.exit(fresh.length || stale.length || mainStale.length || stripFresh.length || stripStale.length ? 1 : 0);
} else if (mode === '--shrink') {
  const staleSet = new Set(stale);
  for (const f of Object.keys(reg.arm1)) reg.arm1[f] = reg.arm1[f].filter((r) => !staleSet.has(hitKey(f, r[0], r[2])));
  const stripStaleSet = new Set(stripStale);
  reg.strips = reg.strips.filter((r) => !stripStaleSet.has(stripKey(r[0], r[1])));
  write();
  const mainSet = new Set(mainStale);
  for (const f of Object.keys(main.arm1)) main.arm1[f] = main.arm1[f].filter((r) => !mainSet.has(hitKey(f, r[0], r[2])));
  for (const f of Object.keys(main.arm1)) if (!main.arm1[f].length) delete main.arm1[f];
  if (mainStale.length) {
    // the first register keeps its own layout (one row per line): only its arm-1 section is re-written, byte-identical
    // where nothing is removed
    const text = readFileSync(join(ROOT, REGISTER_REL), 'utf8');
    const start = text.indexOf('\n "arm1": {\n'); const end = text.indexOf('\n }', start + 1);
    const body = Object.keys(main.arm1).map((f) => `  ${JSON.stringify(f)}: [\n${main.arm1[f].map((r) => `   [${r.map((x) => JSON.stringify(x)).join(', ')}]`).join(',\n')}\n  ]`).join(',\n');
    writeFileSync(join(ROOT, REGISTER_REL), `${text.slice(0, start)}\n "arm1": {\n${body}${text.slice(end)}`);
  }
  console.log(`removed ${stale.length} stale rows, ${mainStale.length} stale rows of the first register and ${stripStale.length} stale strip sites`);
} else if (mode === '--bank') {
  const reason = args[args.indexOf('--bank') + 1];
  const base = args[args.indexOf('--base') + 1];
  if (!reason || !reg.reasons[reason]) { console.error(`--bank needs a named reason of the register: ${Object.keys(reg.reasons).join(', ')}`); process.exit(2); }
  if (!base || args.indexOf('--base') < 0) { console.error('--bank needs --base <rev>'); process.exit(2); }
  /** @type {Map<string, string>} */ const atBase = new Map();
  const srcAt = (file) => {
    if (!atBase.has(file)) {
      try { atBase.set(file, execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 28 })); } catch { atBase.set(file, ''); }
    }
    return atBase.get(file);
  };
  // a literal's text against its source at the base: escapes and runs of white space folded on both sides
  const fold = (/** @type {string} */ x) => x.replace(/\\[nrt]/g, ' ').replace(/\\(.)/g, '$1').replace(/\s+/g, ' ');
  const only = args.indexOf('--thing') >= 0 ? args[args.indexOf('--thing') + 1] : null;
  if (args.indexOf('--thing') >= 0 && !only) { console.error('--thing needs a registered word id'); process.exit(2); }
  const mine = only ? fresh.filter((h) => h.thing === only) : fresh;
  const novel = mine.filter((h) => !fold(srcAt(h.file)).includes(fold(h.text).trim().slice(0, 60)));
  if (novel.length) {
    for (const h of novel) console.error(`NEW LINE (not at ${base}): ${hitKey(h.file, h.thing, h.text)}`);
    process.exit(1);
  }
  const once = new Set();
  for (const h of mine) {
    const k = hitKey(h.file, h.thing, h.text);
    if (once.has(k)) continue; // two literals sharing their first 120 characters are one row
    once.add(k);
    (reg.arm1[h.file] ||= []).push([h.thing, reason, h.text.slice(0, 120)]);
  }
  write();
  console.log(`banked ${once.size} rows under '${reason}'${only ? ` for '${only}'` : ''} (each stood at ${base})`);
} else if (mode === '--bank-strip') {
  const at = args.indexOf('--bank-strip'); const reason = args[at + 1]; const file = args[at + 2];
  const base = args[args.indexOf('--base') + 1];
  if (!['strip-before-draw', 'not-a-draw'].includes(reason) || !file || args.indexOf('--base') < 0 || !base) {
    console.error('--bank-strip needs a reason (strip-before-draw | not-a-draw), a file and --base <rev>'); process.exit(2);
  }
  let atBase = ''; try { atBase = execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 28 }); } catch { /* absent */ }
  const fold = (/** @type {string} */ x) => x.replace(/\s+/g, ' ');
  const mine = stripFresh.filter((x) => x.file === file);
  const novel = mine.filter((x) => !fold(atBase).includes(x.receiver));
  if (novel.length) { for (const x of novel) console.error(`NEW STRIP (not at ${base}): ${stripKey(x.file, x.receiver)}`); process.exit(1); }
  for (const x of mine) reg.strips.push([x.file, x.receiver, reason]);
  reg.strips.sort((p, q) => stripKey(p[0], p[1]).localeCompare(stripKey(q[0], q[1])));
  write();
  console.log(`banked ${mine.length} strip sites of ${file} under '${reason}'`);
} else {
  console.error('usage: --check | --shrink | --bank <reason> --base <rev> | --bank-strip <reason> <file> --base <rev>');
  process.exit(2);
}
