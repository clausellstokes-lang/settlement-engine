#!/usr/bin/env node
/**
 * WORDS-2 · G6 #10: SENTENCES PRINTED VERBATIM ON TWO TABS OF ONE PAGE. Over a page battery's `--views` rows: every line of 40
 * characters or more printed, word for word, in two or more different tabs of one page; counted by the pair of tabs and the
 * line (the place's name as {S}). A MEASURE; changes nothing. Usage: node verbatim-twice.mjs <rows dir> [--grep=<regex>]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2]; const g = process.argv.find((a) => a.startsWith('--grep='));
const only = g ? new RegExp(g.slice(7), 'i') : null;
const count = {}; let pages = 0; let anyPage = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(dir, f), 'utf8')); pages += 1;
  const head = String(r.printed?.['Summary/Overview']?.[0] ?? '').split('·')[0].trim();
  const name = head.endsWith(r.size) ? head.slice(0, -r.size.length).trim() : head;
  const where = new Map();
  for (const [view, lines] of Object.entries(r.printed || {})) for (const l of lines) {
    const t = String(l).trim(); if (t.length < 40) continue; if (only && !only.test(t)) continue;
    (where.get(t) || where.set(t, new Set()).get(t)).add(view);
  }
  let hit = false;
  for (const [t, views] of where) if (views.size >= 2) {
    hit = true; const k = `${[...views].sort().join(' + ')}\t${name ? t.split(name).join('{S}') : t}`;
    count[k] = (count[k] || 0) + 1;
  }
  if (hit) anyPage += 1;
}
console.log(`== ${dir}: pages ${pages}; with a line printed verbatim on two tabs: ${anyPage}`);
for (const [k, n] of Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`${String(n).padStart(4)}  ${k.slice(0, 260)}`);
