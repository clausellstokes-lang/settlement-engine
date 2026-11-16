/**
 * Seat A's precision draw: node sample-a.mjs <render-dir> <run.json> <out.md> [seed=516] [per=20]
 * Twenty instances of each law (LAW 1: every 1x sub-law together; LAW 4: 4n; 4r apart), drawn by a seeded PRNG
 * (mulberry32) from the run's instances, each with three printed lines either side on its own tab, for a reader to
 * judge as the second check judges (STANDS, WEAK, EXPLAINED).
 */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const { parseDump } = await import(path.join(ROOT, 'tests/helpers/pageLaws/page.mjs'));
const [, , dir, runFile, out, seed = '516', per = '20'] = process.argv;
const j = JSON.parse(fs.readFileSync(runFile, 'utf8'));
const rng = ((a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; })(Number(seed));
const groups = { 'LAW 1': (x) => x.law.startsWith('1'), 'LAW 4 (4n)': (x) => x.law.startsWith('4n'), 'LAW 4 (4r, the register on the page)': (x) => x.law.startsWith('4r') };
const L = [`# BAR5-AUDIT-A · the precision draw (seed ${seed}, ${per} a law, from ${path.basename(runFile)})`, ''];
const draw = {};
for (const [g, f] of Object.entries(groups)) {
  const pool = j.instances.filter(f); const picked = [];
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const k = Math.floor(rng() * (i + 1)); [idx[i], idx[k]] = [idx[k], idx[i]]; }
  for (const i of idx.slice(0, Number(per))) picked.push(pool[i]);
  draw[g] = picked;
  L.push(`## ${g} (${picked.length} of ${pool.length})`, '');
  picked.forEach((x, n) => {
    const { tabs } = parseDump(fs.readFileSync(path.join(dir, 'dumps', x.town + '.txt'), 'utf8'));
    const ls = tabs[x.tab] || []; const i = ls.indexOf(x.line);
    L.push(`### ${g.split(' ')[1]}-${n + 1} · ${x.law} · ${x.town} · ${x.tab}`, '', `- why: ${x.why}`, `- against: ${x.against.tab || x.against.record} :: ${String(x.against.line).slice(0, 300)}`, '', '```');
    for (let k = Math.max(0, i - 3); k <= Math.min(ls.length - 1, i + 3); k++) L.push((k === i ? '>> ' : '   ') + ls[k].slice(0, 400));
    L.push('```', '');
  });
}
fs.writeFileSync(out, L.join('\n') + '\n');
fs.writeFileSync(out.replace(/\.md$/, '.json'), JSON.stringify(draw, null, 1));
console.log('wrote', out);
