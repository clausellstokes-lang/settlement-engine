// BAR6-AUDIT-E · the precision draw: twenty instances of each LAW 9 rule drawn at random (seeded) from a runE output,
// printed with the context a judge needs (the town's shape, the line, the line it is read against, the neighbouring
// lines of the line's own tab), for judging by the second check's rules (STANDS / WEAK / EXPLAINED).
//   node docs/chair/2026-11-16/bar6/AUDIT/sampleE.mjs <runE out.json> <render-dir> <seed> [n=20] > <sample.txt>
import fs from 'node:fs';
import path from 'node:path';

const [IN, RENDER, SEED = '616', N = '20'] = process.argv.slice(2);
if (!IN || !RENDER) { console.error('usage: sampleE.mjs <runE out.json> <render-dir> <seed> [n]'); process.exit(2); }
const xs = JSON.parse(fs.readFileSync(IN, 'utf8'));
// mulberry32
let a = Number(SEED) >>> 0; const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const byRule = new Map();
for (const x of xs) { if (!byRule.has(x.rule)) byRule.set(x.rule, []); byRule.get(x.rule).push(x); }
const dumpCache = new Map();
const tabOf = (town, tab) => {
  if (!dumpCache.has(town)) {
    const tabs = {}; let cur = null;
    for (const l of fs.readFileSync(path.join(RENDER, 'dumps', `${town}.txt`), 'utf8').split('\n')) { const m = l.match(/^== (.+) ==$/); if (m) { cur = m[1]; tabs[cur] = []; continue; } if (cur && l.trim()) tabs[cur].push(l); }
    dumpCache.set(town, tabs);
  }
  return dumpCache.get(town)[tab] || [];
};
let k = 0;
for (const [rule, list] of [...byRule].sort()) {
  const pool = list.slice(); const pick = [];
  while (pool.length && pick.length < Number(N)) pick.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  console.log(`\n######## ${rule} · ${list.length} instances in ${new Set(list.map((x) => x.town)).size} towns · drawn ${pick.length} (seed ${SEED})${list[0].held ? ` · held by ${list[0].held}` : ''}${list[0].status === 'apart' ? ' · APART' : ''}`);
  for (const x of pick) {
    k++;
    const ls = tabOf(x.town, x.tab); const i = ls.indexOf(x.line);
    const ctx = i >= 0 ? ls.slice(Math.max(0, i - 2), i + 3).map((l) => (l === x.line ? '>> ' : '   ') + l.slice(0, 220)).join('\n') : '   (line not found in tab)';
    console.log(`\n[${rule} #${k}] ${x.town} · ${x.tab} · crises ${x.crises.join('+') || 'none'}\n LINE: ${x.sentence.slice(0, 260)}\n AGAINST [${x.against.tab}]: ${String(x.against.line).slice(0, 260)}\n WHY: ${x.why.slice(0, 260)}\n${ctx}`);
  }
}
