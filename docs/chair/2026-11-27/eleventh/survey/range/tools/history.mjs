// RANGE-MEASURE (D): the pools' direction of travel over six weeks of the working line (first-parent snapshots).
// node history.mjs <printingKeyPaths.json|-> snap1.json snap2.json ...
import { readFileSync } from 'node:fs';
const [PRINTING, ...SNAPS] = process.argv.slice(2);
const printing = PRINTING === '-' ? null : new Set(JSON.parse(readFileSync(PRINTING, 'utf8')));
const CHROME = /^src\/(copy|components|pdf)\//;
const DECL = ['needs', 'excludes', 'marks', 'crisis'];
const load = (f) => {
  const { keys } = JSON.parse(readFileSync(f, 'utf8'));
  const m = new Map();
  for (const k of keys) {
    if (CHROME.test(k.file)) continue;
    if (printing && !printing.has(k.key)) continue;
    const prev = m.get(k.key); // a path can repeat (two literals at one path): merge
    const lines = k.lines.map((l) => ({ t: l.text, d: (l.decl || []).some((x) => DECL.includes(x)), twin: (l.decl || []).includes('twinOf') }));
    m.set(k.key, prev ? prev.concat(lines) : lines);
  }
  return m;
};
const snaps = SNAPS.map((f) => ({ f, m: load(f) }));
const sum = (m, fn) => { let s = 0; for (const v of m.values()) s += fn(v); return s; };
console.log(['snapshot', 'keys', 'keys 2+', 'lines', 'lines in 2+ keys', 'one-line keys', 'declared lines', 'twin lines'].join('\t'));
for (const { f, m } of snaps) {
  console.log([f.replace(/.*keys-|\.json/g, ''), m.size, [...m.values()].filter((v) => v.length >= 2).length, sum(m, (v) => v.length), sum(m, (v) => (v.length >= 2 ? v.length : 0)), [...m.values()].filter((v) => v.length === 1).length, sum(m, (v) => v.filter((l) => l.d).length), sum(m, (v) => v.filter((l) => l.twin).length)].join('\t'));
}
console.log(['\nfrom -> to', 'new keys', 'keys gone', 'lines added (to keys that existed)', 'lines added (in new keys)', 'lines removed', 'reworded (paired)', 'given a declaration', 'declaration dropped', 'twins written'].join('\t'));
let T = [0, 0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 1; i < snaps.length; i++) {
  const A = snaps[i - 1].m; const B = snaps[i].m;
  let newKeys = 0; let gone = 0; let addOld = 0; let addNew = 0; let rem = 0; let rew = 0; let gave = 0; let drop = 0; let twins = 0;
  for (const [k, lb] of B) {
    const la = A.get(k);
    if (!la) { newKeys++; addNew += lb.length; twins += lb.filter((l) => l.twin).length; continue; }
    const ta = new Map(la.map((l) => [l.t, l])); const tb = new Map(lb.map((l) => [l.t, l]));
    let a = 0; let r = 0;
    for (const [t, l] of tb) { const o = ta.get(t); if (!o) { a++; if (l.twin) twins++; } else { if (!o.d && l.d) gave++; if (o.d && !l.d) drop++; if (!o.twin && l.twin) twins++; } }
    for (const t of ta.keys()) if (!tb.has(t)) r++;
    const p = Math.min(a, r); rew += p; addOld += a - p; rem += r - p;
  }
  for (const [k, la] of A) if (!B.has(k)) { gone++; rem += la.length; }
  const row = [newKeys, gone, addOld, addNew, rem, rew, gave, drop, twins];
  T = T.map((x, j) => x + row[j]);
  console.log([`${snaps[i - 1].f.replace(/.*keys-|\.json/g, '')} -> ${snaps[i].f.replace(/.*keys-|\.json/g, '')}`, ...row].join('\t'));
}
console.log(['six weeks', ...T].join('\t'));
