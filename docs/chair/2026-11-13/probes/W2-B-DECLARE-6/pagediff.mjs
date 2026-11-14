// node pagediff.mjs <before.json> <after.json> [out.json] — the page list on the 720, before and after: totals, by word, and the lines that left or entered.
import fs from 'node:fs';
const [a, b, out] = process.argv.slice(2);
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8')).findings;
const A = load(a); const B = load(b);
const sum = (F) => ({ findings: F.length, pairs: new Set(F.map((f) => `${f.seed}\t${f.quote}`)).size, towns: new Set(F.map((f) => f.seed)).size });
const byWord = (F) => { const m = {}; for (const f of F) m[f.word] = (m[f.word] || 0) + 1; return m; };
const key = (f) => `${f.seed}\t${f.view}\t${f.word}\t${f.side}\t${f.quote}`;
const ka = new Set(A.map(key)); const kb = new Set(B.map(key));
const left = A.filter((f) => !kb.has(key(f))); const entered = B.filter((f) => !ka.has(key(f)));
const wa = byWord(A); const wb = byWord(B);
const words = [...new Set([...Object.keys(wa), ...Object.keys(wb)])].filter((w) => (wa[w] || 0) !== (wb[w] || 0));
const res = { before: sum(A), after: sum(B), changedWords: Object.fromEntries(words.map((w) => [w, [wa[w] || 0, wb[w] || 0]])),
  left: { n: left.length, byWord: byWord(left) }, entered: { n: entered.length, byWord: byWord(entered) },
  leftLines: left.map((f) => ({ seed: f.seed, word: f.word, view: f.view, quote: f.quote })), enteredLines: entered.map((f) => ({ seed: f.seed, word: f.word, view: f.view, quote: f.quote })) };
if (out) fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(JSON.stringify({ before: res.before, after: res.after, changedWords: res.changedWords, left: res.left, entered: res.entered }));
