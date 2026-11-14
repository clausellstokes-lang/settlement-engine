// gen-name-tables.mjs: THE NAME SEARCH'S TABLES, GENERATED ONCE (COHERENCE-VEIL-10, REVIEW-VEIL-7's V7-1).
// Run: node gen-name-tables.mjs <nfkd-skew.txt>        (run on Node 22.23, Unicode 17.0; prints the literals)
// The literals are carried, the same text, by supabase/migrations/212_share_veil_later_cures.sql (_gallery_veil_name_case,
// _gallery_veil_name_prep) and by src/domain/display/gallerySecondHomes.js (NAME_CASE, NAME_SKEW);
// tests/security/galleryVeilHandRows.pglite.test.js holds the two engines' tables, folds and patterns equal.
//   CASE    the case classes: each a lower-case letter followed by every other code point that is the same letter in
//           another case, classes separated by one space. Built over the code points the preparation leaves alone
//           (NFKD, the marks U+0300..U+036F removed), by the closure of "x lower-cases to y" and "x upper-cases to y"
//           where each is ONE code point. Sharp s is the one such letter whose other case is two letters (a rule).
//   SKEW    code points this Unicode decomposes and PostgreSQL 16 (Unicode 15.0) does not (nfkd-skew.mjs measures them,
//           code point by code point, against a local cluster): each with its decomposition, written out by both engines
//           before they normalise, so an engine's Unicode version does not change the answer.
//   QUOTE   code points whose decomposition holds a quotation mark or a reverse solidus (made spaces before a text is
//           normalised, so that a document's text keeps its structure when it is prepared whole).
import fs from 'node:fs';
const strip = (t) => t.replace(/[\u0300-\u036f]+/g, '');
const prep = (t) => strip(t.normalize('NFKD'));
const one = (t) => [...t].length === 1;
const cps = []; for (let cp = 1; cp <= 0x10ffff; cp += 1) if (cp < 0xd800 || cp > 0xdfff) cps.push(cp);
const parent = new Map();
const find = (x) => { let r = x; while (parent.get(r) !== r) r = parent.get(r); return r; };
const add = (x) => { if (!parent.has(x)) parent.set(x, x); };
const union = (a, b) => { add(a); add(b); const ra = find(a); const rb = find(b); if (ra !== rb) parent.set(ra, rb); };
const multi = [];
for (const cp of cps) {
  const c = String.fromCodePoint(cp);
  if (prep(c) !== c) continue; // the preparation rewrites it: never met in a prepared text
  for (const other of [prep(c.toLowerCase()), prep(c.toUpperCase())]) {
    if (other === c) continue;
    if (one(other)) union(c, other); else multi.push(`${cp.toString(16)}>${[...other].map(x => x.codePointAt(0).toString(16)).join('+')}`);
  }
}
const groups = new Map();
for (const c of parent.keys()) { const r = find(c); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(c); }
const cmp = (a, b) => a.codePointAt(0) - b.codePointAt(0);
const classes = [...groups.values()].map((g) => {
  const lows = g.filter(c => c.toLowerCase() === c && c !== '\u03c2').sort(cmp); // the first: the lowest lower-case member (never final sigma)
  const first = lows[0] ?? [...g].sort(cmp)[0];
  return [first, ...g.filter(c => c !== first).sort(cmp)];
}).sort((a, b) => cmp(a[0], b[0]));
const hex4 = (n) => n.toString(16).padStart(4, '0');
const esc = (t) => [...t].map((c) => { const n = c.codePointAt(0); return n >= 0x20 && n < 0x7f ? c : c.length === 1 ? `\\u${hex4(n)}` : `\\u${hex4(c.charCodeAt(0))}\\u${hex4(c.charCodeAt(1))}`; }).join('');
const lines = []; let cur = '';
for (const g of classes.map(x => esc(x.join('')))) { if (cur && `${cur} ${g}`.length > 150) { lines.push(`${cur} `); cur = g; } else cur = cur ? `${cur} ${g}` : g; }
lines.push(cur);
// SKEW: the third line of nfkd-skew.mjs's print is the code points, in hexadecimal
const skew = fs.readFileSync(process.argv[2], 'utf8').split('\n')[2].trim().split(' ').map(h => parseInt(h, 16)).sort((a, b) => a - b);
const ranges = []; for (const cp of skew) { const last = ranges[ranges.length - 1]; if (last && last[1] === cp - 1) last[1] = cp; else ranges.push([cp, cp]); }
const sqlEsc = (n) => (n <= 0xffff ? `\\u${hex4(n)}` : `\\U${n.toString(16).padStart(8, '0')}`);
const quote = cps.map(cp => String.fromCodePoint(cp)).filter(c => c.normalize('NFKD') !== c && /["\\]/.test(c.normalize('NFKD')));
console.log(`unicode ${process.versions.unicode} | classes ${classes.length} | members ${classes.reduce((n, g) => n + g.length, 0)} | skew ${skew.length}`);
console.log(`letters whose other case is more than one code point, after the preparation: ${multi.join(' ')}`);
console.log(`QUOTE (made spaces before a text is normalised): ${quote.map(c => `U+${c.codePointAt(0).toString(16).toUpperCase()}`).join(' ')}`);
console.log(`SKEW, as a bracket expression for PostgreSQL: ${ranges.map(([a, b]) => (a === b ? sqlEsc(a) : b === a + 1 ? sqlEsc(a) + sqlEsc(b) : `${sqlEsc(a)}-${sqlEsc(b)}`)).join('')}`);
console.log(`SKEW, as JSON: {${skew.map(cp => `"${esc(String.fromCodePoint(cp))}":"${esc(String.fromCodePoint(cp).normalize('NFKD'))}"`).join(',')}}`);
console.log(`CASE, ${lines.length} lines:`);
for (const l of lines) console.log(`'${l}'`);
