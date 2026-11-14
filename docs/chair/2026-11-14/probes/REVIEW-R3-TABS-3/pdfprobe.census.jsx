// pdfprobe: the PDF Defense chapter's and Crisis chapter's leaf text (hook-free components executed), for the seeds in PDF_SEEDS, from births PDF_IN
import { test } from 'vitest';
import fs from 'node:fs'; import zlib from 'node:zlib';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { DefenseSecurity } from '__TREE__/src/pdf/sections/DefenseSecurity.jsx';
import { loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { try { deepText(node.type(node.props || {}), out); } catch (e) { out.push('[ERR '+e.message+']'); } return out; }
  return deepText(node.props?.children, out);
}
test('pdf leaves', async () => {
  await loadGenerationLawPayloads();
  const want = new Set(fs.readFileSync(process.env.PDF_SEEDS, 'utf8').trim().split('\n'));
  const lines = zlib.gunzipSync(fs.readFileSync(process.env.PDF_IN)).toString().split('\n');
  const out = [];
  for (const l of lines) { if (!l) continue; const i = l.indexOf('","s":'); const seed = l.slice(9, i); if (!want.has(seed)) continue;
    const { s } = JSON.parse(l); const vm = buildViewModel({ settlement: s });
    const leaves = deepText(DefenseSecurity({ settlement: s, narrativeMode: false, vm, stateProse: null }));
    out.push(JSON.stringify({ seed, leaves })); }
  fs.writeFileSync(process.env.PDF_OUT, out.join('\n') + '\n');
}, 600000);
