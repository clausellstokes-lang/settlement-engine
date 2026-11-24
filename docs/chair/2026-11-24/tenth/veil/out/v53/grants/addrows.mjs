// VEIL-53 unit (3): add veilrows.json's rows to tests/security/functionGrantClasses.js in register.mjs's own form
// (keys sorted by Array.prototype.sort, one `  "sig": 'CLASS',` line each; the header's Counts line recomputed).
// Refuses a row whose class is not NOBODY/SERVER/USER/ANYONE/TRIGGER (an UNCLOSED one stops it). Run from the tree's root.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const P = 'tests/security/functionGrantClasses.js';
const { FUNCTION_CLASSES } = await import(pathToFileURL(resolve(process.cwd(), P)).href);
const add = JSON.parse(readFileSync(process.argv[2], 'utf8')).rows;
const rows = { ...FUNCTION_CLASSES };
for (const r of add) {
  if (!['NOBODY', 'SERVER', 'USER', 'ANYONE', 'TRIGGER'].includes(r.cls)) throw new Error('refused ' + r.sig + ' ' + r.cls);
  if (rows[r.sig]) throw new Error('already classed ' + r.sig);
  rows[r.sig] = r.cls;
}
const keys = Object.keys(rows).sort();
const counts = {}; for (const k of keys) counts[rows[k]] = (counts[rows[k]] || 0) + 1;
let src = readFileSync(P, 'utf8');
const old = Object.keys(FUNCTION_CLASSES); const oc = {}; for (const k of old) oc[FUNCTION_CLASSES[k]] = (oc[FUNCTION_CLASSES[k]] || 0) + 1;
const oldCounts = ` * Counts: ${Object.entries(oc).map(([k, v]) => `${k} ${v}`).join(', ')}.`;
// the header's order of classes is the order of first appearance in the generated rows; keep the header's own order
const m = /^ \* Counts: (.*)\.$/m.exec(src); if (!m) throw new Error('no Counts line');
const order = m[1].split(', ').map((x) => x.split(' ')[0]);
const newCounts = ` * Counts: ${order.map((k) => `${k} ${counts[k] || 0}`).join(', ')}.`;
src = src.replace(m[0], newCounts);
const start = src.indexOf('export const FUNCTION_CLASSES = Object.freeze({\n');
const end = src.indexOf('\n});', start);
src = src.slice(0, start) + 'export const FUNCTION_CLASSES = Object.freeze({\n' + keys.map((k) => `  ${JSON.stringify(k)}: '${rows[k]}',`).join('\n') + src.slice(end);
writeFileSync(P, src);
console.log('rows', old.length, '->', keys.length, '|', m[0].trim(), '->', newCounts.trim(), '| (recomputed old:', oldCounts.trim() + ')');
