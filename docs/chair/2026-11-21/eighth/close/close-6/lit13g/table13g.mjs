// LIT-13G: the table and the seeds file from count13g.mjs's four outputs (lit, dark, lit-seat1, lit-fortune1), beside this file.
// usage: node table13g.mjs   (pure file reading; writes table13g.md and seeds13g.txt beside it)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const RUNS = [['lit', 'LIT (flip 8f882d0f0; seat 2, fortune 2)'], ['dark', 'DARK (line 9b0ffaa97; both laws dark)'], ['lit-fortune1', 'SPLIT: seat 2 + fortune 1 (flip)'], ['lit-seat1', 'SPLIT: seat 1 + fortune 2 (flip)']];
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = ['| tree | size | births | bought | war | (A) | (B) |', '|---|---|---|---|---|---|---|'];
const seeds = [];
for (const [run, title] of RUNS) {
  const f = join(D, `${run}.jsonl`); if (!existsSync(f)) continue;
  const ls = readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const all = { births: 0, bought: 0, war: 0, A: 0, B: 0 };
  for (const size of [...SIZES, 'control']) {
    const xs = ls.filter((l) => l.size === size);
    const t = { births: xs.length, bought: xs.filter((l) => l.bought).length, war: xs.filter((l) => l.war).length, A: xs.filter((l) => l.A).length, B: xs.filter((l) => l.B).length };
    if (size !== 'control') for (const k of Object.keys(all)) all[k] += t[k];
    out.push(`| ${title} | ${size === 'control' ? 'r2r-city-5 (control)' : size} | ${t.births} | ${t.bought} | ${t.war} | ${t.A} | ${t.B} |`);
    if (size === 'metropolis') out.push(`| ${title} | **the 900** | ${all.births} | ${all.bought} | ${all.war} | ${all.A} | ${all.B} |`);
  }
  for (const l of ls) if (l.A || l.B) seeds.push(`${run}\t${l.seed}\tA=${+l.A}\tB=${+l.B}\tgoverning=${l.governing.join(',')}\trows=${l.captureRows.map((r) => `${r.pair.join('~')}:${r.type}/${r.captureState}`).join(';')}\twar=${l.warCards.map((w) => `${w.faction}[${w.category}]:${w.line}`).join(';')}`);
}
writeFileSync(join(D, 'table13g.md'), out.join('\n') + '\n');
writeFileSync(join(D, 'seeds13g.txt'), '# run\tseed\tA\tB\tgoverning\tcapture rows\twar cards (every (A) or (B) birth)\n' + seeds.join('\n') + '\n');
console.log(out.join('\n'));
