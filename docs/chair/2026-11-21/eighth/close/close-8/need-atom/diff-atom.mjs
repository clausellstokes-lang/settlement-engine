// NEED-ATOM: node diff-atom.mjs <before.jsonl> <after.jsonl>: births whose record hash or atom readers' returns (needListOf, needNotBroughtInOf) moved.
import { readFileSync } from 'node:fs';
const rd = (f) => new Map(readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const a = rd(process.argv[2]), b = rd(process.argv[3]);
let rec = 0, atom = 0;
for (const [seed, r] of a) { const s = b.get(seed); if (!s) { console.log(`MISSING ${seed}`); continue; }
  if (r.recordHash !== s.recordHash) rec++;
  if (JSON.stringify(r.atom) !== JSON.stringify(s.atom)) { atom++; console.log(`ATOM ${seed} ${JSON.stringify(r.atom)} -> ${JSON.stringify(s.atom)}`); } }
console.log(`births ${a.size} | records moved ${rec} | atom readers moved ${atom}`);
