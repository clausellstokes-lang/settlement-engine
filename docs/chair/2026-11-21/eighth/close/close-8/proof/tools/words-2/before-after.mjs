#!/usr/bin/env node
/**
 * WORDS-2 · BEFORE/AFTER (each unit's table, form (d)). A MEASURE: compares two page-battery runs made with `--views`
 * over one plan (before = base, after = a tree), birth by birth. Changes nothing.
 *
 * Counts: births whose RECORD moved (`recordHash`), births whose PAGE moved (`pageHash`), both by size; and, for the
 * pages that moved, every printed line that left or arrived, per view, with the place's name as {S} and numbers as {N},
 * grouped and ranked by how many births hold the change, with up to three seeds each. The groups are what a reader
 * attributes to a unit by its own words.
 *
 * Usage: node before-after.mjs --before=<dir>/rows --after=<dir>/rows --out=<file.tsv> [--json=<summary.json>]
 *   [--rec=<records dir of the before tree, for the name>]
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const arg = (n, f) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : f; };
const BEFORE = arg('before'); const AFTER = arg('after'); const OUT = arg('out'); const JSON_OUT = arg('json'); const REC = arg('rec');

const sizeOf = (seed) => seed.replace(/^dp-/, '').replace(/-\d+$/, '');
/** @param {string} line @param {string} name */
const norm = (line, name) => {
  let s = String(line);
  if (name) s = s.split(name).join('{S}');
  return s.replace(/\d[\d,.]*/g, '{N}');
};
/** The place's name, from the records dump (`--rec`, the before tree's), if given. */
const nameOf = (seed) => {
  const f = REC ? join(REC, `${seed}.json.gz`) : '';
  return f && existsSync(f) ? (JSON.parse(gunzipSync(readFileSync(f)).toString()).record?.name ?? '') : '';
};

const files = readdirSync(BEFORE).filter((f) => f.endsWith('.json')).sort();
const summary = { births: 0, recordMoved: {}, pageMoved: {}, recordMovedTotal: 0, pageMovedTotal: 0, missing: [] };
/** key -> {view, dir, text, seeds:Set} */
const groups = new Map();
for (const f of files) {
  const seed = f.replace(/\.json$/, '');
  let a; let b;
  try { a = JSON.parse(readFileSync(join(BEFORE, f), 'utf8')); b = JSON.parse(readFileSync(join(AFTER, f), 'utf8')); } catch { summary.missing.push(seed); continue; }
  summary.births++;
  const size = sizeOf(seed);
  if (a.recordHash !== b.recordHash) { summary.recordMoved[size] = (summary.recordMoved[size] || 0) + 1; summary.recordMovedTotal++; }
  if (a.pageHash === b.pageHash) continue;
  summary.pageMoved[size] = (summary.pageMoved[size] || 0) + 1; summary.pageMovedTotal++;
  const name = nameOf(seed);
  const views = new Set([...Object.keys(a.printed || {}), ...Object.keys(b.printed || {})]);
  for (const v of views) {
    const la = (a.printed?.[v] || []).map((x) => norm(x, name)); const lb = (b.printed?.[v] || []).map((x) => norm(x, name));
    const sa = new Set(la); const sb = new Set(lb);
    for (const [dir, from, to] of [['-', la, sb], ['+', lb, sa]]) {
      for (const t of new Set(from)) {
        if (to.has(t)) continue;
        const k = `${v}\t${dir}\t${t}`;
        if (!groups.has(k)) groups.set(k, { view: v, dir, text: t, seeds: [] });
        groups.get(k).seeds.push(seed);
      }
    }
  }
}
const ranked = [...groups.values()].sort((x, y) => y.seeds.length - x.seeds.length || x.view.localeCompare(y.view));
writeFileSync(OUT, ['births\tview\tdir\tline\texamples', ...ranked.map((g) => `${g.seeds.length}\t${g.view}\t${g.dir}\t${g.text.slice(0, 400)}\t${g.seeds.slice(0, 3).join(' ')}`)].join('\n') + '\n');
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(summary, null, 1));
console.log(JSON.stringify({ ...summary, groups: ranked.length }));
