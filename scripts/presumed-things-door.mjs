#!/usr/bin/env node
/**
 * scripts/presumed-things-door.mjs — THE DOOR of the presumed-things walker's WIDENED register
 * (`tests/lint/presumedThings.widened.register.json`; W2-B-DECLARE, 2026-11-12). The register holds the
 * habitat a widening of the walker newly sees (a carrier no door enforces, a new root, a new word) and is
 * SHRINK-ONLY: no line is ever banked to absorb a NEW line.
 *
 *   --check                    print the fresh hits (not banked) and the stale rows; exit 1 if either exists
 *   --shrink                   remove every stale row (a row nothing matches); never adds
 *   --bank <reason> --base <rev>
 *                              bank the fresh hits under <reason> — ONLY hits whose literal already stood in
 *                              its file at <rev> (the widening's base). A fresh hit whose text is not at <rev>
 *                              is a NEW line: nothing is written and the door exits 1, naming it.
 *
 * Run from the tree root. Writes nothing in --check.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { WIDENED_REGISTER_REL, bankedKeys, hitKey, scanTree } from '../tests/lint/presumedThings.shared.mjs';

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

const write = () => {
  const arm1 = {};
  for (const f of Object.keys(reg.arm1).sort()) if (reg.arm1[f].length) arm1[f] = reg.arm1[f];
  reg.arm1 = arm1;
  writeFileSync(join(ROOT, WIDENED_REGISTER_REL), `${JSON.stringify(reg, null, 1)}\n`);
};

if (mode === '--check' || mode === undefined) {
  for (const h of fresh) console.log(`fresh\t${hitKey(h.file, h.thing, h.text)}`);
  for (const k of stale) console.log(`stale\t${k}`);
  console.log(`fresh ${fresh.length} · stale ${stale.length} · banked ${bankedKeys(reg).size}`);
  process.exit(fresh.length || stale.length ? 1 : 0);
} else if (mode === '--shrink') {
  const staleSet = new Set(stale);
  for (const f of Object.keys(reg.arm1)) reg.arm1[f] = reg.arm1[f].filter((r) => !staleSet.has(hitKey(f, r[0], r[2])));
  write();
  console.log(`removed ${stale.length} stale rows`);
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
  const novel = fresh.filter((h) => !fold(srcAt(h.file)).includes(fold(h.text).trim().slice(0, 60)));
  if (novel.length) {
    for (const h of novel) console.error(`NEW LINE (not at ${base}): ${hitKey(h.file, h.thing, h.text)}`);
    process.exit(1);
  }
  for (const h of fresh) (reg.arm1[h.file] ||= []).push([h.thing, reason, h.text.slice(0, 120)]);
  write();
  console.log(`banked ${fresh.length} rows under '${reason}' (each stood at ${base})`);
} else {
  console.error('usage: --check | --shrink | --bank <reason> --base <rev>');
  process.exit(2);
}
