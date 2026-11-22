// PLACE-2 · entrepotNote CURE: the chair's ruling (2) of 18:52 UTC, "a fresh builder reads the walker and DECLARES each
// class a row fits; a row that fits none comes to me as a line; no exemption". For every row of every pool of
// `src/data/entrepotNotes.js`, read by the presumption-classes walker's own rule book (`tests/lint/presumptionClasses.shared.mjs`:
// its scanner, its declaration channels and its statuses, nothing re-implemented): the classes the row's words fall in, the
// row's declared atoms, the atoms that answer each class, and the class's status (a stock status is a hit).
//   node docs/chair/2026-11-20/content/place/tools/entrepotNote/classes-declared.mjs <repo> > .../classes-declared.txt
import fs from 'node:fs';
import path from 'node:path';
const L = path.resolve(process.argv[2] || '.');
const W = await import(path.join(L, 'tests/lint/presumptionClasses.shared.mjs'));
const { ENTREPOT_NOTES } = await import(path.join(L, 'src/data/entrepotNotes.js'));
const rel = 'src/data/entrepotNotes.js';
const rows = W.scanSource(rel, fs.readFileSync(path.join(L, rel), 'utf8'), await W.readChannels(L));
W.hitsOf(rows);
const byText = new Map(rows.map((r) => [r.text.replace(/\\'/g, "'"), r]));
const out = []; let hits = 0; const counts = {};
for (const [chain, pool] of Object.entries(ENTREPOT_NOTES)) {
  for (const row of pool) {
    if (typeof row.text !== 'string') { out.push(`${chain}[${row.id}]  (today's sentence: its literal lives in src/data/supplyChainData.js, where the walker reads it; nothing here)`); continue; }
    for (const text of [row.text, row.otherwise].filter((x) => typeof x === 'string')) {
      const r = byText.get(text);
      const classes = r ? r.classes : [];
      const decl = [...(row.needs || []), ...(row.excludes || []).map((a) => `no ${a}`)];
      const parts = classes.map((c) => {
        const dims = W.CLASS_DIMS[c];
        const by = decl.filter((a) => { const d = W.readDeclaration([a]).dims; return [...d].some((x) => dims.includes(x)); });
        const st = r.status[c]; counts[`${c}:${st}`] = (counts[`${c}:${st}`] || 0) + 1; if (!W.ANSWERED.has(st)) hits++;
        return `${c}=${st}${by.length ? ` by [${by.join(', ')}]` : ''}`;
      });
      out.push(`${chain}[${row.id}]${text === row.otherwise ? ' (otherwise)' : ''}  needs [${decl.join(', ')}]  classes: ${parts.join('; ') || '(none)'}  "${text}"`);
    }
  }
}
console.log('THE CLASSES EACH ROW OF src/data/entrepotNotes.js FALLS IN, AND WHAT ANSWERS EACH (the presumption-classes walker\'s rule book).');
console.log('status: declared/bound/negated = answered; none/other/colour/any/one-kind/band = a hit (the walker reds it).');
console.log('');
for (const l of out) console.log(l);
console.log('');
console.log(`class statuses: ${Object.entries(counts).sort().map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log(`hits (rows the walker would red): ${hits}`);
