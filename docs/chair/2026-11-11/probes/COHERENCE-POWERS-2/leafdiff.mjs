// node leafdiff.mjs a.records.json b.records.json — every moved leaf path (arrays indexed), counted by path pattern
import fs from 'node:fs';
const A = JSON.parse(fs.readFileSync(process.argv[2])); const B = JSON.parse(fs.readFileSync(process.argv[3]));
const leaves = (v, p, o) => { if (v && typeof v === 'object') { const ks = Object.keys(v); if (!ks.length) o[p] = JSON.stringify(v); for (const k of ks) leaves(v[k], p + (Array.isArray(v) ? `[${k}]` : `.${k}`), o); } else o[p] = JSON.stringify(v); return o; };
const pat = {}; let total = 0;
for (const k of Object.keys(A)) { const a = leaves(A[k], '', {}), b = leaves(B[k], '', {}); for (const p of new Set([...Object.keys(a), ...Object.keys(b)])) if (a[p] !== b[p]) { total++; const q = p.replace(/\[\d+\]/g, '[]'); pat[q] = (pat[q] || 0) + 1; } }
console.log('moved leaves', total); for (const [q, n] of Object.entries(pat).sort((x, y) => y[1] - x[1]).slice(0, 60)) console.log(String(n).padStart(7), q);
