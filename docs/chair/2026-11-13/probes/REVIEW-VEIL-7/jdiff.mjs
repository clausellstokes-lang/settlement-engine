// jdiff.mjs <a.json> <b.json> [max]   REVIEW-VEIL-7: the paths at which two JSON documents differ (a = server, b = client).
import fs from 'node:fs';
const [fa, fb, max = '60'] = process.argv.slice(2);
const a = JSON.parse(fs.readFileSync(fa, 'utf8')), b = JSON.parse(fs.readFileSync(fb, 'utf8'));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const sh = (v) => { const t = JSON.stringify(v); return t === undefined ? '(absent)' : t.length > 90 ? t.slice(0, 90) + '…' : t; };
let n = 0; const out = [];
const d = (x, y, p) => {
  if (isRec(x) && isRec(y)) { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) d(x[k], y[k], `${p}.${k}`); return; }
  if (Array.isArray(x) && Array.isArray(y)) { for (let i = 0; i < Math.max(x.length, y.length); i += 1) d(x[i], y[i], `${p}[${i}]`); return; }
  if (JSON.stringify(x) !== JSON.stringify(y)) { n += 1; if (out.length < Number(max)) out.push(`${p} | a: ${sh(x)} | b: ${sh(y)}`); }
};
d(a, b, '$');
console.log(out.join('\n')); console.log(`differ: ${n}`);
