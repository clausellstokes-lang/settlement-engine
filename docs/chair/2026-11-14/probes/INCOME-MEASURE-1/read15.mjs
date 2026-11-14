// INCOME-MEASURE-1: the fifteen towns read. Per town: counts, and at most three quoted lines (the row as it prints on the
// Economics tab; the Resources tab's word on the raw ground; the Economics tab's "Produced locally" / exports words for it).
// Usage: node read15.mjs <renderDir> <read15.json>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir, pickFile] = process.argv.slice(2);
const WORD = { 'Iron & Metalwork': /iron|coal|gold|silver|precious|metal|ore\b/i, 'Stone Quarrying': /stone|quarr|clay|pottery/i,
  'Timber Trade': /timber|forest|wood/i, 'Fish & Preserved Produce': /fish|salt/i, 'Fish & Maritime Produce': /fish|salt/i };
const sec = (txt, name) => { const out = []; let on = false; for (const l of txt.split('\n')) { if (/^== .+ ==$/.test(l)) { on = l === `== ${name} ==`; continue; } if (on) out.push(l); } return out; };
const clip = (s, w) => { if (s.length <= 150) return s; const i = s.search(w); const a = Math.max(0, i - 60); return (a ? '…' : '') + s.slice(a, a + 150) + '…'; };
const z2=(seed)=>JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${seed}.json.gz`)));
for (const r of JSON.parse(fs.readFileSync(pickFile, 'utf8'))) {
  const txt = zlib.gunzipSync(fs.readFileSync(`${dir}/${r.seed}.txt.gz`)).toString();
  const eco = sec(txt, 'tab:economics'); const res = sec(txt, 'tab:resources'); const w = WORD[r.source];
  const i = eco.findIndex((l) => l.startsWith(r.source));
  const row = i < 0 ? '(not on the tab)' : `${eco[i - 1]} ${eco[i]}`;
  const resLines = res.filter((l) => w.test(l));
  const nr = res.findIndex((l) => /^Nearby Resources/.test(l)); const nearLine = nr >= 0 ? res.slice(nr + 1, nr + 4).find((l) => w.test(l)) : null;
  const stageLine = res.find((l) => /^(Unexploited|Partially exploited|✓ Fully exploited)/.test(l) && w.test(l)) || (nearLine ? `Nearby Resources: ${nearLine}` : '(the Resources tab names no such ground)');
  const pl = eco.findIndex((l) => l === 'Produced locally'); const prod = pl >= 0 ? eco[pl + 1] || '' : '';
  const ex = eco.findIndex((l) => l === 'Exports'); const exp = ex >= 0 ? eco[ex + 1] || '' : '';
  const third = w.test(exp) ? `Exports: ${clip(exp, w)}` : w.test(prod) ? `Produced locally: ${clip(prod, w)}` : '(neither exports nor produced-locally names it)';
  console.log(`\n${r.seed} (${r.tier}, ${r.stress || 'calm'}) ${r.source} ${r.pct}% · trigger ${r.trigger} · roster ${z2(r.seed).institutions.length} · houses of the trade 0 · near houses ${r.nearHouses.length} · Resources-tab lines naming it ${resLines.length} · chain stages ${r.stages.join(',') || 'none'}`);
  console.log(`  1 "${clip(row, w)}"`);
  console.log(`  2 "${clip(stageLine, w)}"`);
  console.log(`  3 "${third}"`);
}
