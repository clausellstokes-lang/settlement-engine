// RANGE-MEASURE (A) totals: keys and lines by class; print-weighted on C and V; script (v1, v2) against the hand read,
// and the hand-calibrated estimate (each script class's keys split as the hand read split that class's sampled keys).
// node totals.mjs <cls-v1.json> <cls-v2.json> <hand170.json>
import { readFileSync } from 'node:fs';
const [V1, V2, H] = process.argv.slice(2);
const r1 = new Map(JSON.parse(readFileSync(V1, 'utf8')).map((r) => [r.ki, r]));
const rows = JSON.parse(readFileSync(V2, 'utf8')).filter((r) => !r.chrome && !r.listLike && !r.noChoice);
const hand = JSON.parse(readFileSync(H, 'utf8')); const M = { P: 'PARAPHRASE', A: 'ANGLES', D: 'DISTINCT' }; const C = ['PARAPHRASE', 'ANGLES', 'DISTINCT'];
const conf = (get) => { const m = {}; let a = 0; for (const h of hand) { const s = get(h.ki); if (!s) continue; const k = `${M[h.hand]}|${s}`; m[k] = (m[k] || 0) + 1; if (M[h.hand] === s) a++; } return { m, a }; };
const c1 = conf((ki) => r1.get(ki)?.cls); const c2 = conf((ki) => rows.find((r) => r.ki === ki)?.cls);
const table = (c, name) => { console.log(`\n${name}: agree ${c.a} of ${hand.length}`); console.log(['hand \\ script', ...C].join('\t')); for (const h of C) console.log([h, ...C.map((s) => c.m[`${h}|${s}`] || 0)].join('\t')); };
table(c1, 'SCRIPT v1'); table(c2, 'SCRIPT v2');
const handOf = new Map(hand.map((h) => [h.ki, M[h.hand]]));
const sum = (f) => { const t = {}; for (const r of rows) { const k = f(r); t[k] = (t[k] || 0) + 1; } return t; };
const w = (f, key) => { const t = {}; let T = 0; for (const r of rows) { const k = f(r); t[k] = (t[k] || 0) + r[key]; T += r[key]; } return Object.fromEntries(Object.entries(t).map(([k, v]) => [k, `${v} (${(100 * v / T).toFixed(1)}%)`])); };
console.log('\nkeys of 2+ co-eligible lines that print:', rows.length, '; lines', rows.reduce((a, r) => a + r.n, 0));
console.log('by script v2 (keys):', sum((r) => r.cls)); console.log('  lines:', (() => { const t = {}; for (const r of rows) t[r.cls] = (t[r.cls] || 0) + r.n; return t; })());
console.log('  prints C:', w((r) => r.cls, 'printsC')); console.log('  prints V:', w((r) => r.cls, 'printsV'));
// calibrated: P(hand class | script class) from the sample, applied to every unread key; read keys take their hand class
const cal = {}; for (const s of C) { const n = C.reduce((a, h) => a + (c2.m[`${h}|${s}`] || 0), 0); cal[s] = Object.fromEntries(C.map((h) => [h, n ? (c2.m[`${h}|${s}`] || 0) / n : 0])); }
const est = (key) => { const t = { PARAPHRASE: 0, ANGLES: 0, DISTINCT: 0 }; let T = 0; for (const r of rows) { const v = key ? r[key] : 1; T += v; const h = handOf.get(r.ki); if (h) t[h] += v; else for (const c of C) t[c] += v * cal[r.cls][c]; } return Object.fromEntries(C.map((c) => [c, `${Math.round(t[c])} (${(100 * t[c] / T).toFixed(1)}%)`])); };
console.log('\nHAND-CALIBRATED estimate: keys', est(null)); console.log('  lines', (() => { const t = { PARAPHRASE: 0, ANGLES: 0, DISTINCT: 0 }; let T = 0; for (const r of rows) { T += r.n; const h = handOf.get(r.ki); if (h) t[h] += r.n; else for (const c of C) t[c] += r.n * cal[r.cls][c]; } return Object.fromEntries(C.map((c) => [c, `${Math.round(t[c])} (${(100 * t[c] / T).toFixed(1)}%)`])); })());
console.log('  prints C', est('printsC')); console.log('  prints V', est('printsV'));
console.log('\nthe hand read alone, weighted by prints C:', (() => { const t = {}; let T = 0; for (const h of hand) { const r = rows.find((x) => x.ki === h.ki); if (!r) continue; t[M[h.hand]] = (t[M[h.hand]] || 0) + r.printsC; T += r.printsC; } return Object.fromEntries(Object.entries(t).map(([k, v]) => [k, `${(100 * v / T).toFixed(1)}%`])); })());
