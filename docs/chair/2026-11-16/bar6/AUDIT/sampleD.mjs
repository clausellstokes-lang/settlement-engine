// BAR6-AUDIT-D · the precision draw: twenty instances of each rule of LAW 8 drawn at random (seeded) from a runD.mjs
// output, each printed with its row, its `against` and the lines around it in the town's dump, for a judge to read by
// the second check's rules (STANDS, WEAK, EXPLAINED).
//   node sampleD.mjs <runD out.json> <render-dir> <seed> <out.md> [rule ...]
import fs from 'node:fs';
import path from 'node:path';

const [inPath, dir, seedArg, outMd, ...only] = process.argv.slice(2);
if (!outMd) { console.error('usage: sampleD.mjs <out.json> <render-dir> <seed> <out.md> [rule ...]'); process.exit(2); }
let s = Number(seedArg) >>> 0 || 1;
const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; }; // a plain LCG: the draw is repeatable
const xs = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const rules = [...new Set(xs.map((x) => x.rule))].sort().filter((r) => !only.length || only.includes(r));
const tabsOf = new Map();
const tabs = (town) => { if (tabsOf.has(town)) return tabsOf.get(town); const t = {}; let cur = null;
  for (const l of fs.readFileSync(path.join(dir, 'dumps', `${town}.txt`), 'utf8').split('\n')) { const m = l.match(/^== (.+) ==$/); if (m) { cur = m[1]; t[cur] = []; continue; } if (cur && l.trim()) t[cur].push(l); }
  tabsOf.set(town, t); return t; };
const md = ['# BAR6-AUDIT-D · precision draw', '', `Source: ${path.basename(inPath)} · seed ${seedArg} · twenty a rule (all where fewer).`, ''];
for (const r of rules) {
  const pool = xs.filter((x) => x.rule === r);
  const pick = [];
  const idx = pool.map((_, i) => i);
  for (let k = 0; k < Math.min(20, pool.length); k++) { const j = k + Math.floor(rnd() * (idx.length - k)); [idx[k], idx[j]] = [idx[j], idx[k]]; pick.push(pool[idx[k]]); }
  md.push(`## ${r} (${pick.length} of ${pool.length})`, '');
  pick.forEach((x, n) => {
    const T = tabs(x.town);
    const ctx = (T[x.tab] || []).slice(Math.max(0, x.i - 3), x.i + 4).map((l, k) => `${Math.max(0, x.i - 3) + k === x.i ? '>>' : '  '} ${l.slice(0, 220)}`);
    md.push(`### ${r} #${n + 1} · ${x.town} · ${x.tab}:${x.i}${x.heldBy ? ` · on ${x.heldBy}` : ''}`, '', `- LINE: ${x.line}`, `- AGAINST: [${x.against?.tab}:${x.against?.i}] ${String(x.against?.line || '').slice(0, 300)}`, `- WHY: ${x.why}`, '', '```', ...ctx, '```', '', '- VERDICT: ', '');
  });
}
fs.writeFileSync(outMd, md.join('\n'));
console.log(`wrote ${outMd}: ${rules.map((r) => `${r} ${Math.min(20, xs.filter((x) => x.rule === r).length)}`).join(', ')}`);
