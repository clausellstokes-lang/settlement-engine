// BAR5-AUDIT-B precision draw: twenty instances of each law from a result file, by a fixed seed, each printed with
// the lines a judge needs (the instance's own card, entry or chain as printed, and its `against`).
//   node sampleB.mjs <instances.json> <census-out> <out.json> [n=20] [seed=20261116]
import fs from 'node:fs';
import path from 'node:path';

const [instPath, censusOut, outPath, nArg, seedArg] = process.argv.slice(2);
const N = +(nArg || 20); let s = +(seedArg || 20261116) >>> 0;
const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const inst = JSON.parse(fs.readFileSync(instPath, 'utf8'));
const tabsOf = (town) => {
  const tabs = {}; let cur = null;
  for (const l of fs.readFileSync(path.join(censusOut, 'dumps', `${town}.txt`), 'utf8').split('\n')) {
    const m = l.match(/^== (.+) ==$/); if (m) { cur = m[1]; tabs[cur] = []; continue; } if (cur && l.trim()) tabs[cur].push(l);
  }
  return tabs;
};
const out = [];
for (const law of ['L2', 'L3']) {
  const pool = inst.filter((x) => x.law === law);
  const picked = new Set();
  while (picked.size < Math.min(N, pool.length)) picked.add(Math.floor(rnd() * pool.length));
  for (const k of [...picked]) {
    const x = pool[k]; const t = tabsOf(x.town)[x.tab] || [];
    const ctx = t.slice(Math.max(0, x.i - 4), x.i + 3).map((l, j) => `${Math.max(0, x.i - 4) + j === x.i ? '>>' : '  '} ${l.slice(0, 220)}`);
    out.push({ law, rule: x.rule, town: x.town, tab: x.tab, i: x.i, line: x.line, against: x.against, why: x.why, ctx, judge: null, note: '' });
  }
}
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
for (const [j, x] of out.entries()) console.log(`\n#${j} ${x.law} ${x.rule} ${x.town} ${x.tab}\n${x.ctx.join('\n')}\n   AGAINST [${x.against.tab}] ${x.against.line.slice(0, 220)}`);
