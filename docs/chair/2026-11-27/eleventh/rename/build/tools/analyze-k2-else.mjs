// K2 PROOF, "nothing else on the page moved": every line the rename moved is the base line with the old name put to the new
// by whole word; any other moved line is counted (with the picks the harness logged, unchanged or not)
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const C of ['C', 'V']) {
  const R = { births: 0, pagesElse: 0, linesElse: 0, linesByName: 0, linesGlued: 0, ex: [] };
  const rl = readline.createInterface({ input: createReadStream(`/home/user/scratch/work/K2-${C}.jsonl`), crlfDelay: Infinity });
  for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); if (j.error) continue; R.births++;
    const { old, neu, diff } = j.vars.T; const re = new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_])${esc(old)}(?![\\p{L}\\p{N}\\p{M}_])`, 'gu');
    let els = 0;
    for (const [view, d] of Object.entries(diff)) {
      const came = [...(d.came || [])]; const gone = d.gone || [];
      for (const g of gone) { const want = g.replace(re, neu); let i = came.indexOf(want); if (i >= 0 && want !== g) { came.splice(i, 1); R.linesByName++; } else if ((i = came.indexOf(g.split(old).join(neu))) >= 0 && g.includes(old)) { came.splice(i, 1); R.linesGlued++; } else { els++; if (R.ex.length < 14) R.ex.push(`${j.seed} ${view} GONE: ${g.slice(0, 160)}`); } }
      for (const c of came) { els++; if (R.ex.length < 14) R.ex.push(`${j.seed} ${view} CAME: ${c.slice(0, 160)}`); }
    }
    if (els) { R.pagesElse++; (R.pages ||= []).push(j.seed + " " + old); } R.linesElse += els; }
  console.log(C, JSON.stringify({ ...R, ex: undefined, pages: R.pages }), '\n  ', R.ex.join('\n   '));
}
