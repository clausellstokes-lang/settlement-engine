// usage: node vs-census.mjs <vitest json> <red-at-line tsv> <classed tsv>... : every failed test as LISTED (on the red list), CENSUS (one of the
// census's NEW rows, its kind and lane), or SURPRISE (neither); then every census row of a file the run covered that did NOT fail: GONE.
import { readFileSync } from 'node:fs';
const [json, red, ...classed] = process.argv.slice(2);
const norm = (s) => String(s || '').replace(/\s+/g, ' ').replace(/ > /g, ' ').trim();
const rowsOf = (p, fi, ti) => readFileSync(p, 'utf8').split('\n').map((l) => l.split('\t')).filter((r) => r.length > ti && r[fi].startsWith('tests/')).map((r) => ({ file: r[fi], title: norm(r[ti]), r }));
const redRows = rowsOf(red, 1, 2);
const cen = classed.flatMap((p) => rowsOf(p, 0, 1));
const hit = (row, file, full) => row.file === file && row.title && (full.includes(row.title) || row.title.includes(full) || full.startsWith(row.title.slice(0, 120)) || row.title.startsWith(full.slice(0, 120)));
const j = JSON.parse(readFileSync(json, 'utf8'));
const used = new Set(); const files = new Set();
for (const f of j.testResults || []) {
  const file = f.name.replace(/.*?\/tests\//, 'tests/'); files.add(file);
  for (const a of f.assertionResults || []) {
    if (a.status !== 'failed') continue;
    const full = norm(a.fullName);
    const c = cen.find((x) => hit(x, file, full));
    if (c) { used.add(c); console.log(`CENSUS\t${c.r[3]}\t${c.r[4]}\t${file}\t${full.slice(0, 160)}`); continue; }
    if (redRows.some((x) => hit(x, file, full))) { console.log(`LISTED\t\t\t${file}\t${full.slice(0, 160)}`); continue; }
    console.log(`SURPRISE\t\t\t${file}\t${full.slice(0, 160)}\t${String((a.failureMessages || [''])[0]).split('\n')[0].slice(0, 200)}`);
  }
}
for (const c of cen) if (files.has(c.file) && !used.has(c)) console.log(`GONE\t${c.r[3]}\t${c.r[4]}\t${c.file}\t${c.title.slice(0, 160)}`);
