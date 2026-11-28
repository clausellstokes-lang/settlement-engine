// RANGE-MEASURE (C)(ii) by script: on one page, sentences that repeat a TEMPLATE already printed on that page with other
// names or slot values (the same words for different people), by size and tab. A sentence's template is its source literal
// (match.mjs) or, unhomed, its text with every capitalised word after the first masked.
// node selfrep.mjs <keys.json> <name>:<matched.jsonl> ...
import { readFileSync, createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
const [KEYS, ...CORP] = process.argv.slice(2);
const { keys, code } = JSON.parse(readFileSync(KEYS, 'utf8'));
const fileOf = (a) => (a[0] === 'K' ? keys[+a.slice(1).split('.')[0]].file : code[+a.slice(1)].site.split(':')[0]);
const chrome = (a) => a && (/^src\/(copy|components|pdf)\//.test(fileOf(a)) || (a[0] === 'X' && code[+a.slice(1)].jsx));
const sk = (t) => t.replace(/(?<!^)\b[A-ZÀ-Þ][\p{L}'’-]+/gu, '#').replace(/\d+/g, 'N');
for (const spec of CORP) {
  const [name, f] = spec.split(':');
  const by = {}; const tabs = {};
  const rl = createInterface({ input: createReadStream(f), crlfDelay: Infinity });
  for await (const L of rl) {
    if (!L) continue; const r = JSON.parse(L); if (r.error) continue;
    const seenT = new Map(); const seenS = new Set(); let n = 0; let rep = 0;
    for (const [tab, s, a] of r.sents) {
      if (chrome(a) || seenS.has(s)) continue; seenS.add(s); n++;
      const t = a ? `${a}` : `~${sk(s)}`;
      const tb = (tabs[tab] ||= { n: 0, rep: 0 }); tb.n++;
      if (seenT.has(t)) { rep++; tb.rep++; } else seenT.set(t, 1);
    }
    const z = (by[r.size] ||= { pages: 0, n: 0, rep: 0 }); z.pages++; z.n += n; z.rep += rep;
  }
  console.log(name, Object.entries(by).map(([s, z]) => `${s}: ${(100 * z.rep / z.n).toFixed(1)}% (${(z.rep / z.pages).toFixed(0)} a page)`).join('; '));
  console.log('  by tab:', Object.entries(tabs).sort((a, b) => b[1].rep - a[1].rep).slice(0, 8).map(([t, v]) => `${t} ${(100 * v.rep / v.n).toFixed(0)}%`).join(', '));
}
