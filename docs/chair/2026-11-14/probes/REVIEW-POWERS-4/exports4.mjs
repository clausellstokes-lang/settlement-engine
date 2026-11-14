// REVIEW-POWERS-4 exports4.mjs — TREE= CORPUS= OUT= node exports4.mjs
// The PDF's view model (pdf/lib/viewModel.js :: buildViewModel, the one slice every export reads) and the Foundry journal
// (foundry/journalPages.js :: buildJournalPages) built for every town of a corpus; each of the stage's line classes is
// counted where it prints there, and each print is read against the same record test as lines4.mjs (the record field
// is the export's source, so a print is the record's sentence verbatim). Reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const { buildViewModel } = await import(T + '/src/pdf/lib/viewModel.js');
const { buildJournalPages } = await import(T + '/src/foundry/journalPages.js');
const PROBES = {
  'claim rungs (L11)': /Merchants with local reach; a consistent civic presence, though other powers set the course here|Minor landed families with limited political reach|Clergy are present but operate at the margins|Well-funded city watch; it keeps order|City watch; law enforcement and external defence|A local protection operation tolerated|Criminal network operating in shadows|present in council discussions through intermediaries|outpaced by merchant capital|competitive with merchant capital/g,
  'SUPPLY goals (L4-L6)': /the work at [^.,;]+|Find whoever can still supply|Ration what is left at|Waste nothing at|Bring every step of the trade, from the first goods to the last/g,
  'army vignette (L12)': /Those under arms have doubled, and the city treasury pays their keep/g,
  'structural rows (L9-L10)': /Commands those under arms|Leads a squad|Heads an old family|Belongs to a lesser|Holds an office|Serves the faith under|Holds a place under|Works spells under/g,
  'persons-held (L8)': /taken against their will|buys and sells people|holding back the papers that would free them/g,
  'honorifics (L1-L3)': /\b(Brewster|Alewife|Goodman|Goodwife|Madam|Midwife) [A-Z]/g,
};
const C = {}; let err = 0;
for (const { seed, s } of rows) {
  let vmText = '', jText = '';
  try { const vm = buildViewModel({ settlement: s }); const { raw, ...rest } = vm; vmText = JSON.stringify(rest);
    try { const pages = buildJournalPages(vm, { settlement: s }); jText = JSON.stringify(pages); } catch (e) { err++; if (err < 4) console.error('journal', seed, e.message); } }
  catch (e) { err++; if (err < 4) console.error('vm', seed, e.message); continue; }
  for (const [k, re] of Object.entries(PROBES)) for (const [surf, text] of [['pdf', vmText], ['foundry', jText]]) {
    const m = text.match(re) || []; const c = (C[`${k} · ${surf}`] ||= { prints: 0, towns: 0, ex: [] }); if (m.length) { c.prints += m.length; c.towns++; if (c.ex.length < 4) c.ex.push(`${seed}: ${m[0]}`); } }
}
fs.writeFileSync(process.env.OUT, JSON.stringify(C, null, 1));
for (const [k, c] of Object.entries(C)) console.log(`${k} :: ${c.prints} prints in ${c.towns} towns`);
console.log('errors', err); process.exit(err ? 1 : 0);
