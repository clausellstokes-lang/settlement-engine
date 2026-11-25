#!/usr/bin/env node
// BATCH item 3 (C1): the proof. node c1-compare.mjs <beforeDir> <afterDir>
// Every place: its record hash before and after. A place governed by a birth name after: its record with the birth names
// mapped back to the old forms is byte-compared with the before record; the first differing JSON paths are printed.
import { readFileSync, existsSync } from 'node:fs';
const [A, B] = process.argv.slice(2);
const rd = (d) => new Map(readFileSync(`${d}/hashes.jsonl`, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const HA = rd(A); const HB = rd(B);
// The birth name → the old form. "Senate" alone is mapped only where no other senate's word stands before it.
const BACK = [
  [/Council of Aldermen/g, 'Corrupt Council'], [/council of aldermen/g, 'corrupt council'],
  [/Council of Syndics/g, 'Corrupt City Council'], [/council of syndics/g, 'corrupt city council'],
  [/(?<!Arcane |Merchant |Shadow |Grand )\bSenate\b/g, 'Shadow Senate'], [/(?<!arcane |merchant |shadow |grand )\bsenate\b/g, 'shadow senate'],
];
const back = (t) => BACK.reduce((s, [re, to]) => s.replace(re, to), t);
const NEW = new Set(['Council of Aldermen', 'Council of Syndics', 'Senate']);
const diffPaths = (a, b, p = '', out = []) => {
  if (out.length > 12) return out;
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], `${p}.${k}`, out);
  } else out.push(`${p}: ${JSON.stringify(a)?.slice(0, 140)} -> ${JSON.stringify(b)?.slice(0, 140)}`);
  return out;
};
let moved = 0; let carriers = 0; let equal = 0; const others = [];
for (const [seed, a] of HA) {
  const b = HB.get(seed);
  if (a.hash !== b.hash) moved += 1;
  if (!NEW.has(b.gov)) { if (a.hash !== b.hash) others.push(`${seed} (${a.gov} -> ${b.gov})`); continue; }
  carriers += 1;
  const before = readFileSync(`${A}/carriers/${seed}.json`, 'utf8');
  const after = back(readFileSync(`${B}/carriers/${seed}.json`, 'utf8'));
  if (before === after) { equal += 1; continue; }
  console.log(`DIFF ${seed} (${a.gov} -> ${b.gov}):\n  ${diffPaths(JSON.parse(before), JSON.parse(after)).join('\n  ')}`);
}
console.log(`places ${HA.size}; record moved ${moved}; carriers of a birth name ${carriers}; byte-equal mapped back ${equal}; other places moved ${others.length}${others.length ? ': ' + others.slice(0, 10).join(', ') : ''}`);
if (!existsSync(A)) process.exit(2);
