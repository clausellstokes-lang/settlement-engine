// PLACE-1 · entrepotNote MEASURE, section E: the candidate composer (composer.mjs) on measure.mjs's 600 births, masked
// as the chair's census masks (the masked canonical note is the note itself: no place name, no digit, in any of them;
// every candidate row is likewise free of names and digits). HELD = every chain holding a note (the census's reading,
// and the PDF's, which prints a held note ungated); PRINTED = EconomicsTab's gate (entrepot && !dependency).
//   node project.mjs <repo> <rows-plain.json> > out/project.txt
//   node project.mjs <repo> <rows-plain.json> carrier > out/project-nocarrier.txt   (the rows needing `carrier` dropped)
import fs from 'node:fs';
const [, , L, ROWS, dropArg = ''] = process.argv;
const drop = dropArg ? dropArg.split(',') : []; // e.g. `carrier`: the pool without the proposed atom's rows
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { compose, ENTREPOT_NOTES } = await import('./composer.mjs');
const rows = JSON.parse(fs.readFileSync(ROWS, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const k = { fnv1a32, hashKey };
const out = (s = '') => console.log(s);
const masked = rows.every((r) => r.chains.every((c) => c.masked === c.note));
out(`DROPPED ATOMS: ${drop.join(', ') || 'none'}`);
out(`MASK: every stored note equals its masked form in ${masked ? 'all' : 'NOT all'} places; candidate rows hold no digit: ${Object.values(ENTREPOT_NOTES).flat().every((x) => !/\d/.test(x.text))}`);
out();
/** @param {any[]} rs @param {(r:any,c:any)=>string} textOf @param {(c:any)=>boolean} keep */
function top(rs, textOf, keep) {
  const m = new Map(); let holders = 0;
  for (const r of rs) { const s = new Set(r.chains.filter(keep).map((c) => textOf(r, c))); if (s.size) holders++; for (const x of s) m.set(x, (m.get(x) || 0) + 1); }
  return { holders, sorted: [...m.entries()].sort((a, b) => b[1] - a[1]) };
}
const before = (r, c) => c.note;
const after = (r, c) => compose(k, r, c, drop).text;
const how = new Map();
for (const r of rows) for (const c of r.chains) { const x = compose(k, r, c, drop); how.set(x.how, (how.get(x.how) || 0) + 1); }
out(`DRAW: ${[...how.entries()].map(([a, b]) => `${a} ${b}`).join(', ')} (notes of 600 births)`);
out();
out('TOP SHARE BY SIZE: places of 100 holding the commonest note, BEFORE -> AFTER  (and of the size\'s holders)');
let worst = { size: null, n: -1, kind: '' };
for (const kind of ['HELD', 'PRINTED']) {
  const keep = kind === 'HELD' ? () => true : (c) => c.printed;
  for (const size of SIZES) {
    const rs = rows.filter((r) => r.size === size);
    const b = top(rs, before, keep), a = top(rs, after, keep);
    const bn = b.sorted[0]?.[1] ?? 0, an = a.sorted[0]?.[1] ?? 0;
    if (an > worst.n) worst = { size, n: an, kind };
    out(`${kind.padEnd(8)} ${size.padEnd(10)} ${String(bn).padStart(3)} -> ${String(an).padStart(3)}   (holders ${b.holders}; distinct ${b.sorted.length} -> ${a.sorted.length})   after top: "${(a.sorted[0]?.[0] || '').slice(0, 70)}"`);
  }
  out();
}
out(`WORST AFTER: ${worst.kind} ${worst.size} ${worst.n}/100. Its ten commonest after-sentences:`);
const keep = worst.kind === 'HELD' ? () => true : (c) => c.printed;
for (const [s, n] of top(rows.filter((r) => r.size === worst.size), after, keep).sorted.slice(0, 10)) out(`  ${String(n).padStart(3)}  ${s}`);
out();
out('PER CHAIN (all sizes, HELD): notes, distinct after, the commonest row\'s share of the chain\'s notes');
for (const id of Object.keys(ENTREPOT_NOTES)) {
  const m = new Map(); let n = 0;
  for (const r of rows) for (const c of r.chains) if (c.id === id) { n++; const t = compose(k, r, c, drop).id; m.set(t, (m.get(t) || 0) + 1); }
  const s = [...m.entries()].sort((a, b) => b[1] - a[1]);
  out(`  ${id.padEnd(22)} notes ${String(n).padStart(3)}  rows used ${String(s.length).padStart(2)} of ${ENTREPOT_NOTES[id].length + 1}  commonest ${s[0] ? `${s[0][0]} ${s[0][1]}` : '-'}`);
}
out();
out('THE PRINT GATE IS UNCHANGED: the composer rewrites the text only; entrepot, dependency and status are not read or written.');
