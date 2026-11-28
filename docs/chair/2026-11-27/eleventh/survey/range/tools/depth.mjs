// RANGE-MEASURE (B): lines per key, by keys and weighted by prints, on C and V.
// node depth.mjs <keys.json> <stats-C.json> <stats-V.json> <classified.json>
// Every non-chrome key that prints. A key whose lines print TOGETHER (list-like: 80%+ of its lines on a page that
// prints it, 1.5+ a page) offers no choice: each of its lines counts as a key of one line.
import { readFileSync } from 'node:fs';
const [KEYS, SC, SV, CL] = process.argv.slice(2);
const { keys } = JSON.parse(readFileSync(KEYS, 'utf8'));
const S = { C: JSON.parse(readFileSync(SC, 'utf8')), V: JSON.parse(readFileSync(SV, 'utf8')) };
const cls = new Map(JSON.parse(readFileSync(CL, 'utf8')).map((r) => [r.ki, r]));
const CHROME = /^src\/(copy|components|pdf)\//;
const B = (n) => (n === 1 ? '1' : n === 2 ? '2' : n <= 5 ? '3-5' : n <= 10 ? '6-10' : '11+');
const buckets = ['1', '2', '3-5', '6-10', '11+'];
const T = { keys: {}, lines: {}, C: {}, V: {}, seenC: {}, seenV: {}, effKeys: {} };
for (const b of buckets) for (const t of Object.values(T)) t[b] = 0;
let totC = 0; let totV = 0;
keys.forEach((k, ki) => {
  if (CHROME.test(k.file)) return;
  const c = S.C.K[ki]; const v = S.V.K[ki]; if (!c && !v) return;
  const r = cls.get(ki); const list = r?.listLike;
  if (list) {
    for (let li = 0; li < k.lines.length; li++) {
      const pc = c?.lines?.[li] || 0; const pv = v?.lines?.[li] || 0; if (!pc && !pv) continue;
      T.keys['1']++; T.lines['1']++; T.C['1'] += pc; T.V['1'] += pv; T.effKeys['1']++; totC += pc; totV += pv;
    }
    return;
  }
  const b = B(k.lines.length);
  T.keys[b]++; T.lines[b] += k.lines.length; T.C[b] += c?.prints || 0; T.V[b] += v?.prints || 0; totC += c?.prints || 0; totV += v?.prints || 0;
  const seen = new Set([...Object.keys(c?.lines || {}), ...Object.keys(v?.lines || {})]).size;
  T.effKeys[B(Math.max(1, seen))]++;
  T.seenC[B(Math.max(1, Object.keys(c?.lines || {}).length || 1))] += c?.prints || 0;
  T.seenV[B(Math.max(1, Object.keys(v?.lines || {}).length || 1))] += v?.prints || 0;
});
const pct = (a, b) => `${(100 * a / b).toFixed(1)}%`;
console.log(['lines in key', 'keys', 'lines', 'prints C', 'share C', 'prints V', 'share V', 'keys by lines SEEN on C+V', 'prints C by lines seen on C', 'share'].join('\t'));
const nk = Object.values(T.keys).reduce((a, b) => a + b, 0); const ne = Object.values(T.effKeys).reduce((a, b) => a + b, 0);
for (const b of buckets) console.log([b, T.keys[b], T.lines[b], T.C[b], pct(T.C[b], totC), T.V[b], pct(T.V[b], totV), T.effKeys[b], T.seenC[b], pct(T.seenC[b], totC)].join('\t'));
console.log(['all', nk, Object.values(T.lines).reduce((a, b) => a + b, 0), totC, '', totV, '', ne].join('\t'));
console.log(`share of pool sentences from a key of 1 or 2 lines: C ${pct(T.C['1'] + T.C['2'], totC)}, V ${pct(T.V['1'] + T.V['2'], totV)}`);
