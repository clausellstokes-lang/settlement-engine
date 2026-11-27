// node report.mjs <res-C.json> <res-V.json> <outdir> : writes R-TABLE.tsv and R-REPORT.md from the counted results + the read homes
import { readFileSync, writeFileSync } from 'node:fs';
const [cf, vf, OUT] = process.argv.slice(2);
const C = JSON.parse(readFileSync(cf, 'utf8')); const V = JSON.parse(readFileSync(vf, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = (r, k, kind = 'fault') => r.items[k]?.[`${kind}N`] ?? 0;
const bySize = (r, k) => SIZES.map((s) => `${s[0].toUpperCase()}${s.slice(1, 3)} ${r.items[k]?.fault?.[s] || 0}`).join(' ');
const ex = (k) => { const e = (C.items[k]?.ex?.[0] && { c: 'C', ...C.items[k].ex[0] }) || (V.items[k]?.ex?.[0] && { c: 'V', ...V.items[k].ex[0] }); return e; };
const shareAlso = (r, k) => r.items['SHARE-ALSO']?.sub?.[k]?.n || 0; const pdfAlso = (r, k) => r.items['PDF-ALSO']?.sub?.[k]?.n || 0;
const ROWS = JSON.parse(readFileSync(new URL('./rows.json', import.meta.url), 'utf8'));
const tsv = [['item', 'home', 'fault test', 'C fault', 'C fault by size', 'C innocent', 'V fault', 'V fault by size', 'V innocent', 'kind of cure', 'smallest cure', 'other surfaces', 'example'].join('\t')];
let md = '# R-MEASURE: the whole-town items over C and V (900 births each), at df0401af6\n\n';
md += 'Every count is a script\'s (CONFIRMED) unless marked PLAUSIBLE. Pages = the owner\'s dossier as OutputContainer renders it with the census store, every tab and disclosure walked; share = toPublicSafe -> projectShareVeil -> OutputContainer readOnly playerView (PublicDossierView\'s props); PDF = buildPrintProse + the Daily Life slots + composeCrisisPage (the PDF\'s own composers, not its renderer).\n\n';
for (const row of ROWS) {
  const k = row.key;
  const e = ex(k);
  const exS = e ? `${e.c} ${e.seed}: ${JSON.stringify(Object.fromEntries(Object.entries(e).filter(([x]) => !['c', 'seed'].includes(x)))).slice(0, 400)}` : '(none)';
  const surf = `${row.surfaces}${row.shareKey ? ` | share (measured): C ${shareAlso(C, row.shareKey)}, V ${shareAlso(V, row.shareKey)}` : ''}${row.pdfKey ? ` | PDF composers (measured): C ${pdfAlso(C, row.pdfKey)}, V ${pdfAlso(V, row.pdfKey)}` : ''}`;
  tsv.push([row.item, row.home, row.test, n(C, k), bySize(C, k), n(C, k, 'innocent'), n(V, k), bySize(V, k), n(V, k, 'innocent'), row.kind, row.cure, surf, exS].map((x) => String(x).replace(/\t|\n/g, ' ')).join('\t'));
  md += `## ${row.item}\n\n- **Home:** ${row.home}\n- **Fault test:** ${row.test}\n- **Count:** C ${n(C, k)} (${bySize(C, k)}), innocent ${n(C, k, 'innocent')}; V ${n(V, k)} (${bySize(V, k)}), innocent ${n(V, k, 'innocent')}\n- **Kind of cure:** ${row.kind}. ${row.cure}\n- **Other surfaces:** ${surf}\n- **Worked example:** ${exS}\n${row.note ? `- **Note:** ${row.note}\n` : ''}\n`;
}
// the pair table
md += '## R5 + R10 + R12: the pair table (line A, line B, pages on C, pages on V)\n\n| line A | line B | C | V |\n|---|---|---|---|\n';
const keys = new Set([...Object.keys(C.pairs), ...Object.keys(V.pairs)]);
const prow = [...keys].map((k) => [k, C.pairs[k]?.n || 0, V.pairs[k]?.n || 0]).sort((a, b) => (b[1] + b[2]) - (a[1] + a[2]));
for (const [k, c, v] of prow) { const [a, b] = k.split(' ## '); md += `| ${a} | ${b} | ${c} | ${v} |\n`; }
writeFileSync(`${OUT}/R-TABLE.tsv`, `${tsv.join('\n')}\n`);
writeFileSync(`${OUT}/R-PAIRS.tsv`, `lineA\tlineB\tC\tV\n${prow.map(([k, c, v]) => `${k.replace(' ## ', '\t')}\t${c}\t${v}`).join('\n')}\n`);
writeFileSync(`${OUT}/R-REPORT.md`, md);
console.log('written');
