// needles.mjs <file.json> <needle>...   REVIEW-VEIL-7
// Walks every KEY and every string VALUE of a JSON document and prints each path whose key or value holds a needle.
// A needle is matched three ways: as written; both sides lower-cased; both sides folded (lower case, every run of
// non-alphanumerics removed), so a slug, an id or a camel-cased key is met. One line per hit: how | path | text.
import fs from 'node:fs';
const [file, ...needles] = process.argv.slice(2);
const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
const sq = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
let hits = 0;
const test = (t, path, what) => {
  for (const n of needles) {
    const how = t.includes(n) ? 'exact' : t.toLowerCase().includes(n.toLowerCase()) ? 'lower' : (sq(n) && sq(t).includes(sq(n))) ? 'folded' : null;
    if (how) { hits += 1; console.log(`${how} | ${what} | ${path} | ${t.length > 110 ? t.slice(0, 110) + '…' : t}  <= ${n}`); }
  }
};
const walk = (v, path) => {
  if (typeof v === 'string') test(v, path, 'value');
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { test(k, `${path}.${k}`, 'KEY'); walk(x, `${path}.${k}`); }
};
walk(doc, '$');
console.log(`hits: ${hits}`);
