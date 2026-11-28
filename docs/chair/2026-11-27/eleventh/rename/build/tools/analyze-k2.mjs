// K2 PROOF: after the town's rename by the product's writer, the lines that still print the OLD name (any view), the pages
// whose rename back is not byte for byte, the records not restored, and whether any other stored name moved
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s) => String(s).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
for (const C of ['C', 'V']) {
  const R = { births: 0, errors: 0, pagesOld: 0, linesOld: 0, byView: {}, ex: [], backPages: 0, backEx: null, recordNotBack: 0, otherNamesMoved: 0 };
  const rl = readline.createInterface({ input: createReadStream(`/home/user/scratch/work/K2-${C}.jsonl`), crlfDelay: Infinity });
  for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); if (j.error) { R.errors++; continue; } R.births++;
    const re = new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_])${esc(j.name)}(?![\\p{L}\\p{N}\\p{M}_])`, 'u');
    const d = j.vars.T.diff; let old = 0;
    for (const [view, lines] of Object.entries(j.views)) { const gone = new Set(d[view]?.gone || []);
      const after = lines.filter((x) => !gone.has(x)).concat(d[view]?.came || []);
      for (const x of after) if (re.test(norm(x))) { old++; R.byView[view] = (R.byView[view] || 0) + 1; if (R.ex.length < 8) R.ex.push(`${j.seed} ${view}: ${x.slice(0, 200)}`); } }
    if (old) R.pagesOld++; R.linesOld += old;
    if (Object.keys(j.backDiff).length) { R.backPages++; R.backEx ||= `${j.seed} ${JSON.stringify(j.backDiff).slice(0, 300)}`; }
    if (!j.recordBack) R.recordNotBack++; if (!j.otherNamesSame) R.otherNamesMoved++; }
  console.log(C, JSON.stringify({ ...R, ex: undefined }), '\n  ', R.ex.join('\n   '));
}
