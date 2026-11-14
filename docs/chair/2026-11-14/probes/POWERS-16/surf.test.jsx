// surf.test.jsx: CORPUS= SEEDS=a,b OUTF= PAT= (a regex): every surface of a town, the sentences matching PAT (at most 2 per surface)
import { it } from 'vitest'; import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
it('surfaces', async () => {
  const React = (await import('react')).default;
  const { buildViewModel } = await import(T + '/src/pdf/lib/viewModel.js');
  const { SettlementPDF } = await import(T + '/src/pdf/SettlementPDF.jsx');
  const { buildFoundryModuleFiles } = await import(T + '/src/foundry/moduleBuilder.js');
  const { buildWorldExport } = await import(T + '/src/lib/worldExport.js');
  const { buildJournalDocuments } = await import(T + '/foundry-module/scripts/build-journals.js');
  const { composeTonightSheet } = await import(T + '/src/domain/summary/tonightSheet.js');
  const collectText = (node, out = []) => { if (node == null || typeof node === 'boolean') return out; if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; } if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; } if (typeof node === 'object') { if (typeof node.type === 'function') return collectText(node.type(node.props), out); return collectText(node.props?.children, out); } return out; };
  const want = new Set((process.env.SEEDS || '').split(',')); const P = new RegExp(process.env.PAT, 'g');
  const out = [];
  for (const l of zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n')) {
    const r = JSON.parse(l); const seed = r.seed || r.key; if (!want.has(seed)) continue; const s = r.s;
    const vm = buildViewModel({ settlement: s });
    const sf = { pdf: collectText(React.createElement(SettlementPDF, { settlement: s })).join(' '), foundry: JSON.stringify(buildFoundryModuleFiles({ settlement: s, vm })).replace(/<[^>]+>/g, ' '),
      worldImport: JSON.stringify(buildJournalDocuments(buildWorldExport({ settlements: [{ settlement: s }] }, { variant: 'dm' }))).replace(/<[^>]+>/g, ' '), tonight: JSON.stringify(composeTonightSheet(s)) };
    for (const [k, v] of Object.entries(sf)) { const sents = v.split(/(?<=[.!?])\s+|\\n|","/).filter((x) => { P.lastIndex = 0; return P.test(x); }); out.push(`${seed} ${k}: ${sents.length} :: ${[...new Set(sents)].slice(0, 2).map((x) => x.trim().slice(0, 170)).join(' || ')}`); }
  }
  fs.writeFileSync(process.env.OUTF, out.join('\n') + '\n');
}, 1200000);
