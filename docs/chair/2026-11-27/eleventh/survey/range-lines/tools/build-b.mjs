import { readFileSync, writeFileSync } from 'node:fs';
import { B } from './b-lines.mjs';
const T = '/home/user/settlement-engine';
const V = (await import(`${T}/src/data/institutionDescVariants.js`)).INSTITUTION_DESC_VARIANTS;
const CAT = await import(`${T}/src/data/institutionalCatalog.js`);
const w = await import(`${T}/src/domain/facts/registeredWords.js`);
const c = await import(`${T}/tests/lint/presumptionClasses.shared.mjs`);
const walk = (t) => { const s = t.replace(/\{[^}]*\}/g, 'X'); const th = [...w.thingsNamedIn(s)]; const cl = c.classesOf(s); return (th.length ? `things: ${th.join(', ')}` : '') + (cl.length ? `${th.length ? '; ' : ''}classes: ${cl.join(', ')}` : '') || 'none'; };
// the catalogue line: the key's index-0 desc, read from the catalogue table
const catDesc = (key) => { const [tier, , name] = key.split('|'); const cat = CAT.INSTITUTIONAL_CATALOG ?? CAT.default; let hit = null;
  const visit = (o) => { if (!o || typeof o !== 'object' || hit) return; if (Array.isArray(o)) { o.forEach(visit); return; } if (o.shared && (o.shared.name === name || o.at?.[tier]?.name === name)) { const at = o.at?.[tier]; if (at && (at.name ?? o.shared.name) === name) hit = at.desc ?? o.shared.desc; else if (!at && o.shared.name === name) hit = o.shared.desc; } Object.values(o).forEach(visit); };
  visit(cat); return hit; };
const EW = new Map(readFileSync('/home/user/chair/docs/chair/2026-11-27/eleventh/survey/range/E-where.tsv', 'utf8').trim().split('\n').slice(1).map((r) => r.split('\t')).filter((f) => f[1].includes('[joined]')).map((f) => [f[1].split('[joined] ')[1], f[9].split(' ‖ ')]));
const H = ['key', 'existing 1: catalogue line', 'existing 2', 'existing 3', 'new line', 'what it notices', 'claims', 'needs', "walkers' matchers (thingsNamedIn; classesOf)"];
const rows = [H.join('\t')];
for (const [key, lines] of B) {
  const ex = EW.get(key);
  for (const [t, n, cl, nd] of lines) rows.push([key, ex[0], ex[1], ex[2], t, n, cl, nd, walk(t)].map((x) => String(x).replace(/[\t\n]/g, ' ')).join('\t'));
}
writeFileSync(process.argv[2], `${rows.join('\n')}\n`);
console.log(rows.length - 1);
for (const r of rows.slice(1)) { const f = r.split('\t'); console.log(f[0].split('|')[2].padEnd(24), '|', f[1].slice(0, 40), '|', f[8], '|', f[4]); }
