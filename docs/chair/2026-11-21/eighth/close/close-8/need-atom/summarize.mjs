// NEED-ATOM: node summarize.mjs <births.jsonl>: the every-birth check's counts (leaf != page; dropped-as-dealt needs; oracle refusals).
import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const neq = rows.filter((r) => !r.eq), dealt = rows.filter((r) => r.dealt.length), bad = rows.filter((r) => r.bad.length);
console.log(`births ${rows.length} | leaf != page ${neq.length} | births with a need dropped as dealt ${dealt.length} (${dealt.reduce((n, r) => n + r.dealt.length, 0)} needs) | oracle refusals ${bad.length}`);
for (const r of neq) console.log(`  NEQ ${r.seed} page=${JSON.stringify(r.page)} leaf=${JSON.stringify(r.leaf)}`);
for (const r of bad) console.log(`  BAD ${r.seed} ${JSON.stringify(r.bad)}`);
for (const r of dealt) console.log(`  DEALT ${r.seed} ${JSON.stringify(r.dealt)}`);
