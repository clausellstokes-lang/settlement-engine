// PROOF-4: e8b-roundtrip's differing strings, split by the unit that explains each (E13b: a behaviour line moved to another
// line of its pair; E1: fewer double possessives). Reads the same rows (with strings) as e8b-roundtrip. A MEASURE.
import { readFileSync, readdirSync } from 'node:fs';
import { stringUnit } from './attr.mjs';
const [T, A, B] = process.argv.slice(2);
const { heldCardLine } = await import(`${T}/src/data/people/personMention.js`);
const FIELD = /^record\.npcs\[\d+\]\.(?:personality\.tell|presentation\.impression|presentation\.behaviour|secret\.what|goal\.long)$/;
const by = {}; const ex = {};
for (const f of readdirSync(`${A}/rows`)) {
  const x = JSON.parse(readFileSync(`${A}/rows/${f}`)).strings; const y = JSON.parse(readFileSync(`${B}/rows/${f}`)).strings;
  for (const k of Object.keys(x)) if (FIELD.test(k) && heldCardLine(y[k]) !== x[k]) {
    const u = stringUnit(f, k, x[k], y[k]) || 'OTHER'; by[u] = (by[u] || 0) + 1; (ex[u] ||= []).length < 2 && ex[u].push(`${f} ${k}: ${x[k]} → ${y[k]}`);
  }
}
console.log(JSON.stringify(by)); for (const [u, e] of Object.entries(ex)) for (const l of e) console.log(`  ${u}: ${l.slice(0, 220)}`);
