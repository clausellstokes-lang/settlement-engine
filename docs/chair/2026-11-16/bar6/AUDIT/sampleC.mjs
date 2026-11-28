// BAR6-AUDIT-C precision draw: twenty instances of each rule, drawn at random (seeded) from a runC result.
//   node sampleC.mjs <runC-result.json> <seed> [n=20] > <draw.json>
// A mulberry32 draw over each rule's instances in file order; the same file and seed give the same draw.
import fs from 'node:fs';
const [file, seedArg, nArg] = process.argv.slice(2);
const all = JSON.parse(fs.readFileSync(file, 'utf8'));
const n = Number(nArg || 20);
function rng(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rules = [...new Set(all.map((x) => x.rule))].sort();
const out = [];
for (const r of rules) {
  const xs = all.filter((x) => x.rule === r);
  const R = rng(Number(seedArg) + r.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const idx = xs.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  for (const i of idx.slice(0, n)) out.push({ rule: r, town: xs[i].town, tab: xs[i].tab, line: xs[i].line, against: xs[i].against, why: xs[i].why });
}
process.stdout.write(JSON.stringify(out, null, 1));
