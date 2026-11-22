// CLOSE-1's census diff (E90): compare a new classed table with the rehearsal's, keyed by file + title.
// usage: node diff-classed.mjs <rehearsal classed.tsv> <new classed.tsv>
// Prints three lists: NEW rows (red now, not in the rehearsal), GONE rows (in the rehearsal, not red now),
// CHANGED rows (the class or the kind differs). Columns are found by the header when there is one
// (file, title, class, kind, lane-list, cause); a headerless five-column table is read as file, title, class, lane-list, cause.
import { readFileSync } from 'node:fs';
const read = (p) => {
  const lines = readFileSync(p, 'utf8').split('\n').filter((l) => l.trim());
  let head = lines[0].split('\t');
  const hasHead = head[0] === 'file';
  if (!hasHead) head = head.length >= 6 ? ['file', 'title', 'class', 'kind', 'lane-list', 'cause'] : ['file', 'title', 'class', 'lane-list', 'cause'];
  const rows = new Map();
  for (const l of hasHead ? lines.slice(1) : lines) {
    const c = l.split('\t'); const r = Object.fromEntries(head.map((h, i) => [h, c[i] ?? '']));
    rows.set(`${r.file}\t${String(r.title).slice(0, 100)}`, r);
  }
  return rows;
};
const [a, b] = process.argv.slice(2).map(read);
const out = { NEW: [], GONE: [], CHANGED: [] };
for (const [k, r] of b) { if (!a.has(k)) out.NEW.push(`${k}\t${r.class}\t${r.kind || ''}`); else { const o = a.get(k); if (o.class !== r.class || (o.kind || '') !== (r.kind || '')) out.CHANGED.push(`${k}\t${o.class} ${o.kind || ''} -> ${r.class} ${r.kind || ''}`); } }
for (const [k, r] of a) if (!b.has(k)) out.GONE.push(`${k}\t${r.class}\t${r.kind || ''}`);
for (const [name, list] of Object.entries(out)) { console.log(`## ${name}: ${list.length}`); for (const x of list) console.log(x); }
