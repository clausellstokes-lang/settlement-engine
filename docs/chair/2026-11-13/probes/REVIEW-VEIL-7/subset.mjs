// subset.mjs <a.json> <b.json>   REVIEW-VEIL-7: every string VALUE and KEY of b that a does not hold anywhere
// (is b's text a subset of a's?), and the counts. a = the chain without 211, b = the chain with it.
import fs from 'node:fs';
const [fa, fb] = process.argv.slice(2);
const bag = (v, out = new Map()) => { if (typeof v === 'string') out.set(v, (out.get(v) || 0) + 1);
  else if (Array.isArray(v)) v.forEach(x => bag(x, out)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { out.set(`KEY ${k}`, (out.get(`KEY ${k}`) || 0) + 1); bag(x, out); } return out; };
const A = bag(JSON.parse(fs.readFileSync(fa, 'utf8'))), B = bag(JSON.parse(fs.readFileSync(fb, 'utf8')));
const extra = [...B.keys()].filter(k => !A.has(k));
console.log(`strings and keys: a ${A.size}, b ${B.size}; in b and not in a: ${extra.length}${extra.length ? ' -> ' + extra.slice(0, 8).map(x => JSON.stringify(x.slice(0, 80))).join(', ') : ''}`);
