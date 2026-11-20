import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE + '/src';
const { chainStateShown } = await import(T + '/domain/display/chainStateShown.js');
const { buildViewModel } = await import(T + '/pdf/lib/viewModel.js');
const { buildJournalPages } = await import(T + '/foundry/journalPages.js');
const out = { impaired: [], mill: [] };
for (const { seed, s } of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().split('\n').filter(Boolean).map(JSON.parse)) {
  if (!seed.startsWith('r2r-')) continue;
  const L = buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === 'Economics & Trade')?.markdown.split('\n') || [];
  const at = L.indexOf('## Supply chains'); const sc = at < 0 ? [] : L.slice(at + 1).filter((l) => l.startsWith('- '));
  (s.economicState?.activeChains || []).forEach((c, i) => { const card = chainStateShown(c, s);
    if (card === 'impaired' && /\*\(running\)\*/.test(sc[i] || '') && out.impaired.length < 4) out.impaired.push(`${seed} #${i} ${c.chainId}: ${sc[i].slice(0, 80)}`);
    if (c.chainId === 'river_milling' && card === 'running' && (s.institutions || []).some((x) => /^(?!access).*\bmill\b/i.test(x.name)) && out.mill.length < 3) out.mill.push(`${seed} #${i}`); });
}
console.log(JSON.stringify(out, null, 1));
