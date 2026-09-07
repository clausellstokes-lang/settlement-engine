// X7 — THE JSX SEGMENT EXTRACTOR, through the ESTATE'S OWN walker
// (tests/helpers/jsxLiteralWalk.js: extractJsxProseSegments + extractJsxProseStrings, espree,
// interpolation holes normalised to {x}). Reader-facing chrome and the PDF sections.
// Usage: node x7-jsx.mjs <DOCK> <OUT.json>
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const D = process.argv[2];
const OUT = process.argv[3];
const { walkJsxFiles, extractJsxProseSegments, extractJsxProseStrings, INTERPOLATION_HOLE } =
  await import(path.join(D, 'tests/helpers/jsxLiteralWalk.js'));

const files = walkJsxFiles(path.join(D, 'src'));
const rows = [];
let parseFails = 0;
for (const f of files) {
  const rel = path.relative(D, f);
  const src = readFileSync(f, 'utf8');
  const segs = extractJsxProseSegments(src);
  if (!segs) { parseFails++; continue; }
  const hits = [];
  const seen = new Set();
  const push = (raw) => {
    const s = String(raw).split(INTERPOLATION_HOLE).join('{x}').replace(/\s+/g, ' ').trim();
    if (s.length >= 12 && s.length <= 2000 && !seen.has(s)) { seen.add(s); hits.push(s); }
  };
  for (const seg of segs) push(seg.text);
  for (const lit of (extractJsxProseStrings(src) || [])) push(lit);
  if (hits.length) rows.push({ file: rel, n: hits.length, hits });
}
rows.sort((a, b) => b.n - a.n);
writeFileSync(OUT, JSON.stringify(rows));
console.log('# jsx files:', files.length, ' parse failures:', parseFails,
  ' files with prose:', rows.length, ' segments >=12ch:', rows.reduce((a, r) => a + r.n, 0));
for (const r of rows.slice(0, 15)) console.log(String(r.n).padStart(6), r.file);
