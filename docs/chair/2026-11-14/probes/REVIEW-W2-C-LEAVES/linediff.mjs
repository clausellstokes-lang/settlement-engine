// REVIEW-W2-C-LEAVES linediff.mjs <baseDir> <tipDir> <seedsFile> <out.jsonl> [surfaceSuffix]
// For every seed: the lines that print at the TIP and not at the BASE (kind "new"), and at the base and not at the tip
// (kind "gone"), per view ("== Group/Tab ==" headers of the tab dumps; "== page" headers of the journal; the PDF as one view).
// A line is compared whole, per view and section (the last "▲/▼" heading above it), as a multiset. Writes one JSON row per differing line: {seed, view, kind, line}.
// surfaceSuffix: '' for the tab dumps (<seed>.txt), or e.g. '.pdf-canon_dossier' / '.foundry-canon_dossier'.
import fs from 'node:fs';
const [bd, td, sf, outf, suf = ''] = process.argv.slice(2);
const seeds = fs.readFileSync(sf, 'utf8').trim().split('\n');
const out = fs.createWriteStream(outf);
function views(file) {
  const m = new Map(); let sec = ''; let v = suf === '' ? '?' : (suf.includes('pdf') ? 'PDF' : 'journal');
  if (!fs.existsSync(file)) return null;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const l = raw.trim(); if (!l) continue;
    const h = l.match(/^== (.*?)(?: ==)?$/); if (h) { v = suf.includes('pdf') ? 'PDF' : h[1]; sec = ''; continue; }
    if (/[▲▼]/.test(l) && l.length < 160) sec = l.replace(/[▲▼].*$/, '').replace(/\s*[(:].*$/, '').trim();
    if (!m.has(v)) m.set(v, new Map()); const c = m.get(v); const key = sec + '\u0001' + l; c.set(key, (c.get(key) || 0) + 1);
  }
  return m;
}
let n = 0, miss = 0, nNew = 0, nGone = 0;
for (const seed of seeds) {
  const a = views(`${bd}/${seed}${suf}.txt`), b = views(`${td}/${seed}${suf}.txt`);
  if (!a || !b) { miss++; continue; } n++;
  const vs = new Set([...a.keys(), ...b.keys()]);
  for (const v of vs) {
    const A = a.get(v) || new Map(), B = b.get(v) || new Map();
    for (const [l, c] of B) for (let i = (A.get(l) || 0); i < c; i++) { out.write(JSON.stringify({ seed, view: v, sec: l.split('\u0001')[0], kind: 'new', line: l.split('\u0001')[1] }) + '\n'); nNew++; }
    for (const [l, c] of A) for (let i = (B.get(l) || 0); i < c; i++) { out.write(JSON.stringify({ seed, view: v, sec: l.split('\u0001')[0], kind: 'gone', line: l.split('\u0001')[1] }) + '\n'); nGone++; }
  }
}
out.end(); console.log(`towns ${n} missing ${miss} new ${nNew} gone ${nGone}`);
