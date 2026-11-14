// W2-C-LEAVES-9 item 3: the two NOT PRINTED matchers of tradeListDisplay.js :: SERVICE_OUTPUTS counted on the PDF's whole text
// (SettlementPDF executed, every function component called, every string leaf joined; faithUnlocked both ways) and the
// Foundry journal's whole text (buildJournalPages, every page's markdown and html). TREE, CORPUS, OUT from the environment.
import { test } from 'vitest';
import fs from 'node:fs'; import zlib from 'node:zlib';
import { SettlementPDF } from '__TREE__/src/pdf/SettlementPDF.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
const WORDS = ['international banking services', 'magical item market'];
function leaves(node, acc) {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return leaves(node.type.prototype?.render ? null : node.type(node.props), acc);
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return leaves(node.type.type(node.props), acc);
    for (const [k, v] of Object.entries(node.props || {})) if (k !== 'children' && typeof v === 'string' && /^(title|label|text)$/.test(k)) acc.push(v);
    return leaves(node.props?.children, acc);
  }
  return acc;
}
test('noprint9', () => {
  const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const tot = { towns: 0, pdfOk: 0, pdfErr: 0, jrOk: 0, jrErr: 0, pdfChars: 0, jrChars: 0, hits: {} }; const errs = [];
  for (const { seed, s } of rows) {
    tot.towns++;
    for (const faithUnlocked of [false, true]) {
      try { const text = leaves(SettlementPDF({ settlement: s, faithUnlocked }), []).join('\n'); tot.pdfOk++; tot.pdfChars += text.length;
        for (const w of WORDS) { const at = text.toLowerCase().indexOf(w); if (at >= 0) { (tot.hits[`pdf:${w}`] ??= []).push(seed); (tot.ctx ??= {})[`pdf:${w}`] ??= `${seed}: ${text.slice(Math.max(0, at - 200), at + 80)}`; } }
      } catch (e) { tot.pdfErr++; if (errs.length < 5) errs.push(`${seed} pdf ${String(e.message).slice(0, 160)}`); }
    }
    try { const vm = buildViewModel({ settlement: s });
      const text = buildJournalPages(vm, { settlement: s, faithUnlocked: true }).map((p) => JSON.stringify(p)).join('\n'); tot.jrOk++; tot.jrChars += text.length;
      for (const w of WORDS) { const at = text.toLowerCase().indexOf(w); if (at >= 0) { (tot.hits[`journal:${w}`] ??= []).push(seed); (tot.ctx ??= {})[`journal:${w}`] ??= `${seed}: ${text.slice(Math.max(0, at - 200), at + 80)}`; } }
    } catch (e) { tot.jrErr++; if (errs.length < 10) errs.push(`${seed} journal ${String(e.message).slice(0, 160)}`); }
  }
  fs.writeFileSync(process.env.OUT, JSON.stringify({ ...tot, errs }, null, 1) + '\n');
}, 3600000);
