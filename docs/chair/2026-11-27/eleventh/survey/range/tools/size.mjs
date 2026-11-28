// RANGE-MEASURE (E) the size: how many new lines, over how many keys, would halve the print-weighted share of PARAPHRASE.
// The keys whose class is PARAPHRASE (the hand class where read, else the script's v2). Two models:
//  (1) DILUTE: k new, genuinely different lines join a key of n (a uniform draw): its paraphrase prints fall by k/(n+k).
//      Lines are placed one at a time where they buy the most (p * n / ((n+k)(n+k+1))) until half the weight is gone.
//  (2) REWRITE: a key is rewritten so its set is no longer one thought (four different lines replace or join it, as E's
//      demonstration does): keys taken by prints until half the paraphrase prints are covered; 4 lines each.
// node size.mjs <where.json>
import { readFileSync } from 'node:fs';
const rows = JSON.parse(readFileSync(process.argv[2], 'utf8')).filter((r) => r.final === 'PARAPHRASE');
const P = rows.reduce((a, r) => a + r.prints, 0);
const k = rows.map(() => 0); let gone = 0; let lines = 0;
while (gone < P / 2) {
  let best = -1; let bv = -1;
  for (let i = 0; i < rows.length; i++) { const n = rows[i].n; const v = rows[i].prints * n / ((n + k[i]) * (n + k[i] + 1)); if (v > bv) { bv = v; best = i; } }
  gone += bv; k[best]++; lines++;
}
const touched = k.filter((x) => x > 0).length;
const sorted = [...rows].sort((a, b) => b.prints - a.prints); let cov = 0; let keys = 0; for (const r of sorted) { if (cov >= P / 2) break; cov += r.prints; keys++; }
console.log(`PARAPHRASE keys ${rows.length}, prints ${P}. DILUTE: ${lines} new lines over ${touched} keys halve it (mean ${(lines / touched).toFixed(1)} a key). REWRITE: the ${keys} most-printed keys hold half; at 4 lines each, ${keys * 4} lines.`);
const fam = {}; for (const r of sorted.slice(0, keys)) { const f = r.key.split(' :: ')[0].replace(/^src\//, ''); fam[f] = (fam[f] || 0) + 1; }
console.log('  the REWRITE keys by file:', Object.entries(fam).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([f, n]) => `${f} ${n}`).join('; '));
