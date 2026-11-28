// RANGE-MEASURE: per key and per code literal, how often it prints on a corpus (from match.mjs output).
// node agg.mjs <corpusName> <matched.jsonl> <out.json>
import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
const [NAME, IN, OUT] = process.argv.slice(2);
const K = {}; const X = {}; const tabs = {}; let pages = 0; let sents = 0;
const rl = createInterface({ input: createReadStream(IN), crlfDelay: Infinity });
for await (const L of rl) {
  if (!L) continue; const r = JSON.parse(L); if (r.error) continue; pages++;
  const seenK = new Set(); const seenX = new Set(); const dl = new Map();
  for (const [tab, , a] of r.sents) {
    sents++;
    const t = (tabs[tab] ||= { sents: 0, K: 0, X: 0, none: 0 }); t.sents++;
    if (!a) { t.none++; continue; }
    if (a[0] === 'K') {
      t.K++;
      const [k, l] = a.slice(1).split('.');
      const e = (K[k] ||= { pages: 0, prints: 0, lines: {}, sizes: {} });
      e.prints++; e.lines[l] = (e.lines[l] || 0) + 1;
      if (!dl.has(k)) dl.set(k, new Set()); dl.get(k).add(l);
      if (!seenK.has(k)) { seenK.add(k); e.pages++; e.sizes[r.size] = (e.sizes[r.size] || 0) + 1; }
    } else {
      t.X++;
      const x = a.slice(1); const e = (X[x] ||= { pages: 0, prints: 0 });
      e.prints++; if (!seenX.has(x)) { seenX.add(x); e.pages++; }
    }
  }
  for (const [k, set] of dl) K[k].dl = (K[k].dl || 0) + set.size;
}
writeFileSync(OUT, JSON.stringify({ name: NAME, pages, sents, tabs, K, X }));
console.log(`${NAME}: pages ${pages} sentences ${sents} keys printing ${Object.keys(K).length} code literals printing ${Object.keys(X).length}`);
